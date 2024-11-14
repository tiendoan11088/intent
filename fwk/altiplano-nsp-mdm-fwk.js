/**
* (c) 2020 Nokia. All Rights Reserved.
*
* INTERNAL - DO NOT COPY / EDIT
**/
// Globals
var baseUrl = "/rest/nbi/api/restconf/data/"; 
var baseUrlForDiscoveryRule = "/rest/nbi/api/restconf/operations/nsp-ne-control:get-discovery-rules";
var baseUrlForModification = "/rest/nbi/api/restconf/operations/nsp-icm:update-deployments";
var baseUrlForRetry = "/rest/nbi/api/restconf/operations/nsp-icm:retry-deployments";
var baseUrlIcm = "/rest/nbi/api/restconf/operations/nsp-icm:create-deployments";
var baseUrlForDeleteDeployments = "/rest/nbi/api/restconf/operations/nsp-icm:delete-deployments";
var baseUrl2 = "/rest/nbi/api/"
var mdtUrl = "/rest/nbi/api/mdt/rest/restconf/data/manager-directory-service:manager-directory/manager-info=MDC"
var networkPrefix = "nsp-equipment:network/network-element";
var networkDnPrefix = "/nsp-equipment:network/network-element[ne-id='";
var hardwarePrefix = "/hardware-component/";
var componentPrefix = "[component-id='";
var closeBracket = "']";
var siteDnPrefix= "/nsp-service:services/service-layer/elan[service-id='";
var endpointDnPrefix = "/endpoint[endpoint-id='";
var PORT_TYPE = {"CONNECTOR": 0, "DIRECT": 2};
var sendRequestToNsp=true;
var workflowUrl = "/rest/nbi/api/wfm/api/v1/execution/synchronous"
var getSWVersionUrl = "/rest/nbi/api/restconf/operations/nsp-lso-operation:get-target-software-version";
var softwareUrl = "/rest/nbi/api/restconf/data/nsp-lso-operation:lso-operations";
/*
 * Constructor Function. We'll attach more property and methods by updating "prototype" object.
 */
function AltiplanoNSPMDMIntentHelper() {
  this.self = this;
  this.intentTypeObject = null;
  this.prefixToNsMap = new HashMap();
  this.prefixToNsMap.put("ibn", "http://www.nokia.com/management-solutions/ibn");
  this.prefixToNsMap.put("nc", "urn:ietf:params:xml:ns:netconf:base:1.0");
  this.prefixToNsMap.put("mds", "http://www.nokia.com/management-solutions/manager-directory-service");
}

AltiplanoNSPMDMIntentHelper.prototype.setIntentObject = function (intentObjectIncoming) {
  this.intentTypeObject = intentObjectIncoming;
}

AltiplanoNSPMDMIntentHelper.prototype.validate = function (syncInput) {

  var target = syncInput.getTarget();

  var callbackFun = this.intentTypeObject.validate;//

  var intentConfigXml = syncInput.getIntentConfiguration();
  var intentConfigArgs = apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.intentTypeObject.getKeyForList);
  var contextualErrorJsonObj = {};
  var nonModifiableAttributes = {};
  var pipelineContext = {};
  pipelineContext.operation = "validate";
  var deviceLeaf = {};
  var topology = syncInput.getCurrentTopology();
  var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
  var deviceId = this.getDeviceIds(target, intentConfigArgs, pipelineContext)[0];
  var deviceXtraInfo = this.getDeviceXtrargs(target, topology, intentConfigArgs, pipelineContext);
  try {
    callbackFun(syncInput, contextualErrorJsonObj, intentConfigArgs, nonModifiableAttributes, deviceLeaf);
  } catch (e) {
    logger.error("Error while validate the intent input, " + e);
    throw e;
  }
  if (topology != null && !topologyXtraInfo[this.intentTypeObject.stageName + "_" + deviceId + "_ARGS"]) {
    throw new RuntimeException(deviceLeaf.attributes + " cannot be modified");
  }
  if (nonModifiableAttributes.attributes && nonModifiableAttributes.attributes.length != 0 && topology != null) {
    nonModifiableAttributes.attributes.forEach(function (attribute) {
      if (intentConfigArgs[attribute] != deviceXtraInfo[attribute]) {
        contextualErrorJsonObj[attribute] = "cannot be modified";
      }
      //when the leaf node in the list is not editable
      if (attribute.indexOf("#")) {
        var listAttributeArray = attribute.split("#");
        if (listAttributeArray[0] == 'list') {
          var listAttribute = listAttributeArray[1];
          var listKeyAttribute = listAttributeArray[2];
          var leafAttribute = listAttributeArray[listAttributeArray.length - 1];
          var currentList = intentConfigArgs[listAttribute];
          var oldList = deviceXtraInfo[listAttribute];
          for (var currentListRow in currentList) {
            for (var oldListRow in oldList) {
              if (currentListRow == oldListRow) {
                var currentRow = currentList[currentListRow];
                var oldRow = oldList[currentListRow];
                if (currentRow[leafAttribute] != oldRow[leafAttribute]) {
                  var key = "list#" + listAttribute + "," + currentRow[listKeyAttribute] + "," + "leaf#" + leafAttribute;
                  contextualErrorJsonObj[key] = "cannot be modified";
                }
              }
            }
          }
        }
      }
    });
  }
  if (Object.keys(contextualErrorJsonObj).length !== 0) {
    utilityService.throwContextErrorException(contextualErrorJsonObj);
  }
}

AltiplanoNSPMDMIntentHelper.prototype.synchronize = function (syncInput) {
  
  var pipelineContext = {};//
  pipelineContext["operation"] = "sync";
  var target = syncInput.getTarget();
  var intentConfigXml = syncInput.getIntentConfiguration();
  var networkState = syncInput.getNetworkState().name();
  pipelineContext["networkState"] = networkState;
  var intentConfigArgs = apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.intentTypeObject.getKeyForList);
  var devices = this.intentTypeObject.getDeviceIds;
  var topology = syncInput.getCurrentTopology();
  var deviceXtraInfo = this.getDeviceXtrargs(target, topology, intentConfigArgs, pipelineContext);//get stage name
  var intentEngine = new NSPIntentPipelineEngine(this, target, devices, intentConfigArgs, networkState, syncInput.getCurrentTopology(), pipelineContext); 
  
  var syncResult = intentEngine.synchronize();

  var skipDependencies = this.getPropertyData(this.intentTypeObject.skipDependency, [syncInput, intentConfigArgs]);
  skipDependencies = (skipDependencies === undefined) ? true : skipDependencies; //set default to true if not defined
  
  syncResult.setUpdateDependents(false);
  syncResult.setSyncDependents(false);
  syncResult.setForceStoreTopology(false);
  if (skipDependencies == false) {
    if (typeof this.intentTypeObject.syncDependents === "boolean") {
      syncResult.setSyncDependents(this.intentTypeObject.syncDependents);
    }
    var dependencyInfo = this.getPropertyData(this.intentTypeObject.getDependencyInfo, [syncInput, intentConfigArgs]);
    syncResult.getTopology().setDependencyInfo(this.getTransformedDependencyInfo(dependencyInfo));
  }
  if (networkState !== "delete") {
    if (typeof this.intentTypeObject.getDependencyProfiles === "function") {
        var dependencyProfilesUsed = this.intentTypeObject.getDependencyProfiles(intentConfigArgs, target);
        if (dependencyProfilesUsed) {
            syncResult.setIntentProfiles(apUtils.getObjectSet(dependencyProfilesUsed));
        }
    }
}
  var dependentsImpacted = this.isDependencyUpdated(target, topology, intentConfigArgs, deviceXtraInfo);
  syncResult.setUpdateDependents(dependentsImpacted);
  logger.debug("Synchronization of intent completed with result " + syncResult.isSuccess());
  return syncResult;
}

AltiplanoNSPMDMIntentHelper.prototype.executeAggregateRequest = function(managerName, inputAggregateRequest) {
  // The aggregate request not supported in NSP fwk so no action required here
};

AltiplanoNSPMDMIntentHelper.prototype.finalize = function(input, networkState, result, intentObject) {
  //The aggregate request not supported in NSP fwk so simply return the result.
  return result;
};

AltiplanoNSPMDMIntentHelper.prototype.audit = function (auditInput) {
  logger.debug("Auditing intent with " + auditInput);
  var pipelineContext = {};
  pipelineContext["operation"] = "audit";
  var target = auditInput.getTarget();
  var intentConfigXml = auditInput.getIntentConfiguration();
  var networkState = auditInput.getNetworkState().name();
  var intentConfigArgs = apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.intentTypeObject.getKeyForList);
  var devices = this.intentTypeObject.getDeviceIds;
  var intentEngine = new NSPIntentPipelineEngine(this, target, devices, intentConfigArgs, networkState, auditInput.getCurrentTopology(), pipelineContext);
  logger.debug("Audit of intent completed");
  return intentEngine.audit();
}

AltiplanoNSPMDMIntentHelper.prototype.getTopologyExtraInfoByTopology = function (topology) {
  return apUtils.getTopologyExtraInfo(topology);
}

AltiplanoNSPMDMIntentHelper.prototype.getTransformedDependencyInfo = function (dependencyObject) {
  var dependencyInfo = new java.util.ArrayList();
  var intentTypeKeys = Object.keys(dependencyObject);
  for (var j = 0; j < intentTypeKeys.length; j++) {
      var dependencyIntentType = intentTypeKeys[j];
      if(typeof dependencyObject[dependencyIntentType] === "object" && dependencyObject[dependencyIntentType].length > 0){
          for(var index in dependencyObject[dependencyIntentType]){
              var dependencyTarget;
              var dependencyType = "existence-and-sync";
              if(typeof dependencyObject[dependencyIntentType][index] === "object"){
                  dependencyTarget = dependencyObject[dependencyIntentType][index]["dependencyTarget"];
                  dependencyType = dependencyObject[dependencyIntentType][index]["dependencyType"];
                  if(!dependencyTarget){
                      logger.warn("Dependency target is undefined: " + dependencyIntentType);
                  }
              }
              else{
                  dependencyTarget = dependencyObject[dependencyIntentType][index];
              }
              var topologyIntentDependency = topologyFactory.createTopologyIntentDependency(dependencyIntentType, dependencyTarget, dependencyType);
              dependencyInfo.add(topologyIntentDependency);
          }
      }
  }
  return dependencyInfo;
}

AltiplanoNSPMDMIntentHelper.prototype.isDependencyUpdated = function (target, topology, intentConfigArgs, deviceXtraInfo) {
  var dependencyArgs = this.intentTypeObject.dependencyArgs;
  var oldObject = {};
  var currentObject = {};
  var dependency = null;
  if (dependencyArgs) {
    dependencyArgs.forEach(function (attribute) {
      currentObject[attribute] = intentConfigArgs[attribute];
      oldObject[attribute] = deviceXtraInfo[attribute];
    })
    dependency = this.isDifferent(oldObject, currentObject);
  }
  return dependency;
}

AltiplanoNSPMDMIntentHelper.prototype.getDeviceIds = function (target, intentConfigArgs, pipelinecontext) {
  var devicesConfig = this.getPropertyData(this.intentTypeObject.getDeviceIds, [target, intentConfigArgs, pipelinecontext]);
  var deviceId = Object.keys(devicesConfig);
  return deviceId
}

AltiplanoNSPMDMIntentHelper.prototype.getDeviceXtrargs = function (target, topology, intentConfigArgs, pipelinecontext) {
  var deviceId = this.getDeviceIds(target, intentConfigArgs, pipelinecontext);
  var deviceXtraInfo = {};
  if (topology) {
    var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
    if (typeof topologyXtraInfo[this.intentTypeObject.stageName + "_" + deviceId + "_ARGS"] === "string") {
      deviceXtraInfo = JSON.parse(topologyXtraInfo[this.intentTypeObject.stageName + "_" + deviceId + "_ARGS"]);
    }
  }
  return deviceXtraInfo;
}

AltiplanoNSPMDMIntentHelper.prototype.wrapErrorHandler = function (object, className) {
  for (var fn in object) {    
    if (typeof object[fn] === "function") {
      object[fn] = this.wrapErrorHandlerFn(object, object[fn], className + "." + fn)
    }
  }
  return object;
}

AltiplanoNSPMDMIntentHelper.prototype.wrapErrorHandlerFn = function (object, fn, fnName) {
  var self = this;
  return function () {
    try {
      return fn.apply(object, arguments);
    } catch (e) {
      logger.error("An error occurred while invoking function " + fnName, e);
      if (typeof e.getCause === 'function') {
        var errorMessage = self.parseErrorMessage(e);
        throw new RuntimeException(errorMessage);
      } else {
        throw new RuntimeException(e);
      }
    }
  }
}

AltiplanoNSPMDMIntentHelper.prototype.parseErrorMessage = function (error) {
  while(error && typeof error.getCause === 'function' && error.getCause())
  {
    error = error.getCause()
  }
  return error;
}

AltiplanoNSPMDMIntentHelper.prototype.translateMessage = function (message, args) {
  if (Object.keys(args).length == 0) {
    return message;
  }
  var argKeys = Object.keys(args);
  for (var argKey in argKeys) {
    message = message.replace("{{" + argKeys[argKey] + "}}", JSON.stringify(args[argKeys[argKey]]));
  }
  return message;
}

AltiplanoNSPMDMIntentHelper.prototype.getKeyMessage = function (key) {
  var condition = new HashMap();
  condition.put("field", key.replace(/\./g, "#"));
  condition.put("locale", "en");
  var translationByConditions = translationService.getTranslationByConditions(condition);
  if (translationByConditions != null && translationByConditions.size() > 0) {
    return translationByConditions.get(0).getTranslation();
  }
  return key;
}

AltiplanoNSPMDMIntentHelper.prototype.isDifferent = function (oldObject, currentObject) {
  if (Array.isArray(oldObject) && Array.isArray(currentObject)) {
    return !this.isArrayEquals(oldObject, currentObject);
  } else if (typeof oldObject === "object" && typeof currentObject === "object") {
    var oldKeys = Object.keys(oldObject);
    var newKeys = Object.keys(currentObject);
    if (oldKeys.length != newKeys.length) {
      return true;
    }
    for (var key in oldKeys) {
      logger.debug("Comparing attribute " + oldKeys[key]);
      if (currentObject[oldKeys[key]] === undefined) {
        return true;//the property doesn't even exist!
      }
      var result = this.isDifferent(oldObject[oldKeys[key]], currentObject[oldKeys[key]]);
      if (result === true) {
        return true;
      }
    }
  } else if (oldObject.toString() != currentObject.toString()) {
    return true;
  }
  return false;
}

AltiplanoNSPMDMIntentHelper.prototype.isContainedDifferent = function (oldObject, currentObject) {  
  if (Array.isArray(oldObject) && Array.isArray(currentObject)) {
    return !this.isArrayContains(oldObject, currentObject);
  } else if (typeof oldObject === "object" && typeof currentObject === "object") {
    var oldKeys = Object.keys(oldObject);
    var newKeys = Object.keys(currentObject);
    for (var key in oldKeys) {
      logger.debug("Comparing attribute " + oldKeys[key]);
      if (currentObject[oldKeys[key]] === undefined) {
        return true;//the property doesn't even exist!
      }
      var result = this.isContainedDifferent(oldObject[oldKeys[key]], currentObject[oldKeys[key]]);
      if (result === true) {
        return true;
      }
    }
  } else if (oldObject != null && currentObject !=null && oldObject.toString() != currentObject.toString()) {
    return true;
  }
  return false;
}

AltiplanoNSPMDMIntentHelper.prototype.isArrayContains = function (array, withArray) {
  if (array.length != withArray.length) {
    return false;
  }
  for (var idx in array) {
    if (typeof array[idx] === "object") {//lets try to find an object match
      var isDiffObj = true;
      for (var i = 0; i < withArray.length; ++i) {
        var isDiffObj = this.isContainedDifferent(array[idx], withArray[i]);
        if (!isDiffObj) {
          isDiffObj = false;
          break;
        }
      }
      if (isDiffObj) {
        return false;
      }
    } else {
      var arrayClone = JSON.stringify(array);
      var withArrayClone = JSON.stringify(withArray);
      arrayClone = JSON.parse(arrayClone).sort();
      withArrayClone = JSON.parse(withArrayClone).sort();
      for(var i = 0; i < withArrayClone.length; i++){
        if(arrayClone[i] != withArrayClone[i]){
          return false;
        }
      }
    }
  }
  return true;
}


AltiplanoNSPMDMIntentHelper.prototype.isArrayEquals = function (array, withArray) {
  if (array.length != withArray.length) {
    return false;
  }
  array.forEach(compare);
  function compare(item, index){
    if(withArray.indexOf(item) === -1) {
      return false;
    }
  }
  return true;
}

AltiplanoNSPMDMIntentHelper.prototype.getPropertyData = function (data, args) {
  if (typeof data === 'function') {
    return data.apply(data, args);
  }
  return data;
}

AltiplanoNSPMDMIntentHelper.prototype.getSiteIdFromDeviceId = function(deviceId) {
  try{
    var siteId = mds.getNeIdFromDeviceName(deviceId);
  }  
  catch(e){
    throw new RuntimeException("Unable to retrieve NE Id from MDMNSP" + e);
  }
  if(siteId == null || siteId == undefined){
    throw new RuntimeException("Device Not Discovered");
}
  return siteId;
}

AltiplanoNSPMDMIntentHelper.prototype.getDeviceIdFromSiteId = function(siteId) {
  return siteId.concat("(",this.getSiteIdFromDeviceId(siteId),")");
}

AltiplanoNSPMDMIntentHelper.prototype.waitTillDeviceReachable = function(managerName,siteId, queryInterval, maxRetries){
  var deviceName;
  if (!queryInterval) {
    queryInterval = 1000;
  }
  if (!maxRetries) {
    maxRetries = 10;
  }
  while (!this.getDeviceIdFromSiteId(siteId) && maxRetries--) {
    java.lang.Thread.sleep(queryInterval);
  }
  logger.info("Number of remaining attempts to check device reachability is {}", maxRetries);
  deviceName = this.getDeviceIdFromSiteId(siteId);
  return deviceName;
}

AltiplanoNSPMDMIntentHelper.prototype.checkDeviceReachability = function(managerName,deviceName){
  try {
    apUtils.getManagerInfo(deviceName)
  }
  catch(e){
    throw new RuntimeException("Device not available in "+managerName)
  }
  return deviceName;
}

AltiplanoNSPMDMIntentHelper.prototype.getComponentDn = function(siteId,hwType,componentId){ 
    switch(hwType){
        case "device":
            return networkDnPrefix.concat(siteId,closeBracket);
        case "site":
            return siteDnPrefix.concat(componentId,closeBracket);
        case "endpoint":
            return endpointDnPrefix.concat(siteId,"-").concat(componentId,closeBracket);
        case "port":
          return networkDnPrefix.concat(this.getSiteIdFromDeviceId(siteId),closeBracket).concat(hardwarePrefix,hwType).concat(componentPrefix,componentId).concat(closeBracket);
        default:
            return networkDnPrefix.concat(this.getSiteIdFromDeviceId(siteId),closeBracket).concat(hardwarePrefix,hwType).concat(componentPrefix,componentId).concat(closeBracket);
    }
}

AltiplanoNSPMDMIntentHelper.prototype.checkDeviceAvailability = function(siteId, managerName) {
  createDecoratedNSPProxy(this, null, managerName);
  var siteName;
  restClient.get(baseUrl + networkPrefix + "=" + siteId, "application/json", function(exception, httpStatus, response) {
    siteName = httpStatus === 200 ? JSON.parse(response)["nsp-equipment:network-element"][0].name : "";
  });
  return siteName ? "true" : "false";
}

AltiplanoNSPMDMIntentHelper.prototype.getPortDnFromDeviceAndPortId = function(deviceId, portId) {
  var portDn = "network:" + this.getSiteIdFromDeviceId(deviceId) +
      ":shelf-1:cardSlot-" + this.getCardIdFromPortId(portId) +
      ":card:daughterCardSlot-" + this.getDaughterCardIdFromPortId(portId) +
      ":daughterCard:";
  if (this.getPortType(portId) === PORT_TYPE.CONNECTOR) {
    portDn = portDn + "conn-" + this.getConnIdFromPortId(portId) + ":port-" + this.getPortNoFromPortID(portId);
  } else {
    portDn = portDn + "port-" + this.getPortIdsSplit(portId)[2];
  }
  return portDn;
}

AltiplanoNSPMDMIntentHelper.prototype.getPortType = function(portId){
  var parts = this.getPortIdsSplit(portId);
  if (parts.length === 3) {
    return PORT_TYPE.DIRECT;
  } else if (parts.length === 4) {
    return PORT_TYPE.CONNECTOR;
  }
}

AltiplanoNSPMDMIntentHelper.prototype.getPortIdsSplit = function(portId) {
  var firstIndex= portId.indexOf("-");
  var idStr = portId.substr(firstIndex+1);
  var ids = idStr.split("-");
  return ids;
}

AltiplanoNSPMDMIntentHelper.prototype.getCardIdFromPortId = this.getPortNumber = function(portId) {
  return this.getPortIdsSplit(portId)[0];
}

AltiplanoNSPMDMIntentHelper.prototype.getDaughterCardIdFromPortId = function(portId) {
  return this.getPortIdsSplit(portId)[1];
}

AltiplanoNSPMDMIntentHelper.prototype.getConnIdFromPortId = function(portId) {
  return this.getPortIdsSplit(portId)[2].substr(1);
}

AltiplanoNSPMDMIntentHelper.prototype.getPortNoFromPortID = function(portId) {
  return this.getPortIdsSplit(portId)[3];
}

AltiplanoNSPMDMIntentHelper.prototype.getAllTargetSoftwareVersionFromNsp = function (nspManager, deviceVersionType) {
  createDecoratedNSPProxy(this, null, nspManager);
  var targetVersions = [];
  restClient.post(getSWVersionUrl, "application/json", JSON.stringify({}), "application/json", function (exception, httpStatus, response) {
    var data = null;
    if(httpStatus === 200){
      data = JSON.parse(response);
    }
    if (data.statusCode == "OK" && data["nsp-lso-operation:output"] && data["nsp-lso-operation:output"]["software-version"] && data["nsp-lso-operation:output"]["software-version"].length > 0) {
      data["nsp-lso-operation:output"]["software-version"].forEach(function (obj) {
        if (obj && obj.targetVersion && obj.targetedProductFamily.indexOf(deviceVersionType) != -1) {
          targetVersions.push(obj.targetVersion);
        }
      })
    } else {
      logger.debug("getAllTargetSoftwareVersionFromNsp: ", exception);
    }
  });
  return targetVersions;
}

AltiplanoNSPMDMIntentHelper.prototype.waitForObject = function(device, objectType, filter, queryInterval, maxRetries) {
  var created;
  if (!queryInterval) {
    queryInterval = 1000;
  }
  if (!maxRetries) {
    maxRetries = 10;
  }

  var deviceProxy = createDecoratedNSPProxy(this, device, null);
  
  while (!deviceProxy.getObjectByType(device, objectType, filter).length && maxRetries--) {
    java.lang.Thread.sleep(queryInterval);
  }
  if (maxRetries < 0) {
    throw new RuntimeException("Object was not found: " + objectType);
  }
}

AltiplanoNSPMDMIntentHelper.prototype.waitForDeviceEntryInNspMdc = function (deviceName, queryInterval, maxRetries) {
  var device = this.getSiteIdFromDeviceId(deviceName);
  if (!queryInterval) {
    queryInterval = 1000;
  }
  if (!maxRetries) {
    maxRetries = 120;
  }
  while (!isDeviceAvailableInNspMdt(device) && maxRetries--) {
    java.lang.Thread.sleep(queryInterval);
  }
  logger.info("Number of remaining attempts to check availability in NSP Mediator is {}", maxRetries);
  if (maxRetries < 0) {
    throw new RuntimeException("Device not found in MDT of NSP: " + device);
  }
}

AltiplanoNSPMDMIntentHelper.prototype.waitForDeviceIsManagedInNspMDS = function (deviceName, queryInterval, maxRetries) {
  if (!queryInterval) {
    queryInterval = 1000;
  }
  if (!maxRetries) {
    maxRetries = 10;
  }
  while (!mds.getNeIdFromDeviceName(deviceName) && maxRetries--) {
    java.lang.Thread.sleep(queryInterval);
  }
  logger.info("Number of remaining attempts to check availability in MDMNSP is {}", maxRetries);
}

AltiplanoNSPMDMIntentHelper.prototype.isDeviceDiscoveredAndAvailable = function (deviceName) {
  createDecoratedNSPProxy(this, deviceName, null);
  var device = this.getSiteIdFromDeviceId(deviceName);
  var deviceAvailablility = false;

  restClient.get(mdtUrl, "application/json", function (exception, httpStatus, response) { 
    if (httpStatus === 200 && (response.indexOf("<mds:name>" + device + "</mds:name>") > -1)) {
      deviceAvailablility = true;
    } 
    else if (httpStatus === 200 && response.indexOf("\"name\":" + "\"" + device + "\"") > -1){
      deviceAvailablility = true;
    }
  });
  return deviceAvailablility;
}

AltiplanoNSPMDMIntentHelper.prototype.getSpecificSoftwareOperation = function (deviceName, objectPath) {
  createDecoratedNSPProxy(this, deviceName, null);
  var response;
  try {
    response = moGET(null, "getOperationAvailable", objectPath)
  } catch (error) {
    response = null;
    logger.info("Software doesn't exist");
  }
  return response
}

function isDeviceAvailableInNspMdt(device) {
  var deviceAvailablility = false;
  restClient.get(mdtUrl, "application/json", function (exception, httpStatus, response) { 
    if (httpStatus === 200 && (response.indexOf("<mds:name>" + device + "</mds:name>") > -1)) {
      deviceAvailablility = true;
    }
    else if (httpStatus === 200 && response.indexOf("\"name\":" + "\"" + device + "\"") > -1){
      deviceAvailablility = true;
    }
  });
  logger.debug("The value of device availability in MDT" + deviceAvailablility);
  return deviceAvailablility;
}
/*AltiplanoNSPMDMIntentHelper.prototype.getLagDnFromDeviceIdAndId = function (deviceId, id) {
  return "network:" + this.getSiteIdFromDeviceId(deviceId) + ":lag:interface-" + id;
}*/

/*AltiplanoNSPMDMIntentHelper.prototype.getDiscoveryRuleDnFromId = function (id) {
  return "network:topology:tdr-".concat(id);
}*/

AltiplanoNSPMDMIntentHelper.prototype.getFamilyTypeReleaseForIxrFromMdt = function(deviceName) {
  var siteId = this.getSiteIdFromDeviceId(deviceName);
  createDecoratedNSPProxy(this, deviceName, null);
  var familyTypeRelease = {};
  restClient.get(mdtUrl, "application/json", function (exception, httpStatus, response) {
    if (httpStatus === 200 && (response.indexOf("<mds:name>" + siteId + "</mds:name>") > -1)) {
      var strSplitted = response.split("</mds:device>"); 
      for(var i = 0; i<strSplitted.length; i++){
        if(strSplitted[i].indexOf(siteId) != -1){
          var familyTypeReleaseString = strSplitted[i].substring(strSplitted[i].indexOf("<mds:family-type-release>") + 25, strSplitted[i].indexOf("</mds:family-type-release>"));
          //7250 IXR:23.10.R1:7250 IXR-s
          //7250 IXR:23.10.R1:7250 IXR-x
          var familyTypeReleaseSplitted = familyTypeReleaseString.split(":");
          familyTypeRelease.deviceVersion = familyTypeReleaseSplitted[1].substring(0,familyTypeReleaseSplitted[1].lastIndexOf("."));
          familyTypeRelease.deviceType = familyTypeReleaseSplitted[2].indexOf(intentConstants.FAMILY_TYPE_IXRs) != -1? capabilityConstants.IXR_S_7250 : capabilityConstants.IXR_X1_7250;
          familyTypeRelease.hardwareType = familyTypeRelease.deviceType === capabilityConstants.IXR_S_7250? intentConstants.FAMILY_TYPE_IXR_S : intentConstants.FAMILY_TYPE_IXR_X1;
        } 
      }
    }
    else if (httpStatus === 200 && response.indexOf("\"name\":" + "\"" + siteId + "\"") > -1){
      var strSplitted = response.split("\"device\""); 
      for(var i = 0; i<strSplitted.length; i++){
        if(strSplitted[i].indexOf(siteId) != -1){
          var familyTypeReleaseString = strSplitted[i].substring(strSplitted[i].indexOf("\"family-type-release\"") + 22, strSplitted[i].indexOf(",\"name\""));
          //7250 IXR:23.10.R1:7250 IXR-s
          //7250 IXR:23.10.R1:7250 IXR-x
          var familyTypeReleaseSplitted = familyTypeReleaseString.split(":");
          familyTypeRelease.deviceVersion = familyTypeReleaseSplitted[1].substring(0,familyTypeReleaseSplitted[1].lastIndexOf("."));
          familyTypeRelease.deviceType = familyTypeReleaseSplitted[2].indexOf(intentConstants.FAMILY_TYPE_IXRs) != -1? capabilityConstants.IXR_S_7250 : capabilityConstants.IXR_X1_7250;
          familyTypeRelease.hardwareType = familyTypeRelease.deviceType === capabilityConstants.IXR_S_7250? intentConstants.FAMILY_TYPE_IXR_S : intentConstants.FAMILY_TYPE_IXR_X1;
        } 
      }
    }
    else {
      logger.debug("getFamilyTypeReleaseForIxrFromMdt: Device not found in MDT of NSP");
    }
  });
  return familyTypeRelease;
}

AltiplanoNSPMDMIntentHelper.prototype.fetchActualSoftwareVersion = function(deviceName, isGetAllResponse) {
  createDecoratedNSPProxy(this, deviceName, null);
  var siteId = this.getSiteIdFromDeviceId(deviceName);
  var fetchSwApi = baseUrl + networkPrefix + "=" + siteId + "?depth=2";
  var result = null;
  restClient.get(fetchSwApi, "application/json", function (exception, httpStatus, response) { 
    if(typeof response === "string") response = JSON.parse(response);
    if (httpStatus === 200 && response["nsp-equipment:network-element"] && response["nsp-equipment:network-element"].length > 0) 
      result = isGetAllResponse? response : response["nsp-equipment:network-element"][0]["version"];
  });
  return result;
}

AltiplanoNSPMDMIntentHelper.prototype.getPortNameFromPortId = function(portId) {
  var portName = this.getCardIdFromPortId(portId) + "/" + this.getDaughterCardIdFromPortId(portId);
  if (this.getPortType(portId) === PORT_TYPE.CONNECTOR) {
    portName = portName + "/c" + this.getConnIdFromPortId(portId) + "/" + this.getPortNoFromPortID(portId);
  } else {
    portName = portName + "/" + this.getPortIdsSplit(portId)[2];
  }
  return portName;
}

AltiplanoNSPMDMIntentHelper.prototype.getDevicePorts = function (deviceName) {   
  var portsForDisplay = [];
  if (apUtils.isDevicePod(deviceName)) {    
    var podIntentConfigJson = this.getPODIntentConfig(deviceName);    
    var podToRDevices = podIntentConfigJson["second-tor-device-id"] ?
      [podIntentConfigJson["first-tor-device-id"], podIntentConfigJson["second-tor-device-id"]] : [podIntentConfigJson["first-tor-device-id"]];    
    podToRDevices.forEach(function (device) {      
      portsForDisplay = portsForDisplay.concat(this.getPortIds(device, device.concat(":")));
    });
  } else {    
    portsForDisplay = portsForDisplay.concat(this.getPortIds(deviceName));
  }
  return portsForDisplay;
}

AltiplanoNSPMDMIntentHelper.prototype.getPortIds = function (deviceName, devicePrefix) {
  var portIds = [];
  if (devicePrefix) {
    var deviceProxy = createDecoratedNSPProxy(this, deviceId, null);
    var objectType = "/nsp-equipment:network/network-element[ne-id='".concat(this.getSiteIdFromDeviceId(deviceId), "']/hardware-component/port");
    var filterExpression = "name";
    deviceProxy.searchObjectByType(deviceId, objectType, filterExpression, function (searchResults) {
      searchResults["nsp-inventory:output"]["data"].forEach(function (port) {
        var match = port["name"].match(/(\d{1,2}\/){2}(\d{1,2}){1}/);
        if (match) {
          portIds.push(getPortIdInDisplayFormat(match[0], devicePrefix));
        }
      });
    });
  } else {
    var deviceId = deviceName.indexOf("(") != -1? deviceName.substring(deviceName.indexOf("(") + 1, deviceName.indexOf(")")) : deviceName;
    var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_IXR, deviceId);
    var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
    var deviceIxrConfigArgs = this.getDeviceIxrConfigArgs(deviceId);
    var profileData = apUtils.getParsedProfileDetailsFromProfMgr(deviceId, nodeType, intentConstants.INTENT_TYPE_DEVICE_IXR, [], intentVersion);

    if (deviceIxrConfigArgs["card-list"]) {
      Object.keys(deviceIxrConfigArgs["card-list"]).forEach((cardKey) => {
        var cardObj = deviceIxrConfigArgs["card-list"][cardKey];
        if (cardObj && cardObj["dcard-list"]) {
          Object.keys(cardObj["dcard-list"]).forEach((dcardKey) => {
            var typeProfile = cardObj["dcard-list"][dcardKey]["type-profile"];
            if (profileData && profileData["IXR-DAUGHTER-CARD"] && profileData["IXR-DAUGHTER-CARD"]["board-service-profile"]) {
              var boardServiceProfiles = profileData["IXR-DAUGHTER-CARD"]["board-service-profile"];
              boardServiceProfiles.forEach((boardServiceProfile) => {
                if (boardServiceProfile["name"] === typeProfile) {
                  boardServiceProfile["ports"].forEach((port) => {
                    var portRangeSplitted = port["port-ranges"][0].split(".."); //["1", "48"];
                    for (var i = parseInt(portRangeSplitted[0]); i <= parseInt(portRangeSplitted[1]); i++) {
                      var nspPortName = "PORT-" + cardKey + "-" + dcardKey + "-" + i; // PORT-1-1-1
                      if (portIds.indexOf(nspPortName) == -1) portIds.push(nspPortName);
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  }

  return portIds;
}

AltiplanoNSPMDMIntentHelper.prototype.getPrefixFromPortId = function (nspPortName, isGetSlot) { // PORT-1-1-c3-1 || PORT-1-1-1 || 1/1/c49/1
  var portIdSplitted;
  if(nspPortName.indexOf("-") !== -1){
    portIdSplitted = nspPortName.split("-");
    var prefix = "shelf=1/cardSlot=" + portIdSplitted[1] + "/card=" + portIdSplitted[1];
    if(isGetSlot) prefix += "/mdaSlot=" + portIdSplitted[2] + "/mda=" + portIdSplitted[2];
  } else {
    portIdSplitted = nspPortName.split("/");
    var prefix = "shelf=1/cardSlot=" + portIdSplitted[0] + "/card=" + portIdSplitted[0];
    if(isGetSlot) prefix += "/mdaSlot=" + portIdSplitted[1] + "/mda=" + portIdSplitted[1];
  }
  return prefix
}

var getPortIdInDisplayFormat = function (nspPortName, devicePrefix) {
  var port = "PORT-" + nspPortName.split("/").join("-");
  return devicePrefix ? devicePrefix + port : port;
}

AltiplanoNSPMDMIntentHelper.prototype.getDeviceIxrConfigArgs = function (deviceName) {
  var deviceIxrGetKeyForList = function (listName) {
    switch (listName) {
      case "label":
        return ["category", "value"];
      case "card-list":
        return ["number"];
      case "dcard-list":
        return ["number"];
      default:
        return null;
    }
  }
  var intentConfig = apUtils.getIntent(intentConstants.INTENT_TYPE_DEVICE_IXR, deviceName);
  var configResult = apUtils.convertIntentConfigXmlToJson(intentConfig.getIntentConfig(), deviceIxrGetKeyForList);
  return configResult;
}

AltiplanoNSPMDMIntentHelper.prototype.getFamilyTypeReleaseForIxr = function (deviceName) {
  var familyTypeRelease = {};
  var deviceIxrConfigArgs = this.getDeviceIxrConfigArgs(deviceName);
  var nodeType = this.getNodeTypefromEsAndMds(deviceName);
  var nodeTypeVersion = nodeType.split("-")[2];

  familyTypeRelease.deviceVersion = nodeTypeVersion.substring(0, nodeTypeVersion.lastIndexOf("."));
  if (deviceIxrConfigArgs["expected-model-name"] === intentConstants.FAMILY_TYPE_IXR_X1_7250) {
    familyTypeRelease.hardwareType = intentConstants.FAMILY_TYPE_IXR_X1;
    familyTypeRelease.deviceType = capabilityConstants.IXR_X1_7250;
  } else if (deviceIxrConfigArgs["expected-model-name"] === intentConstants.FAMILY_TYPE_IXR_S_7250) {
    familyTypeRelease.hardwareType = intentConstants.FAMILY_TYPE_IXR_S;
    familyTypeRelease.deviceType = capabilityConstants.IXR_S_7250;
  }
  return familyTypeRelease;
}

AltiplanoNSPMDMIntentHelper.prototype.getPortSpeed = function(deviceId, portIds) {
  var deviceProxy = createDecoratedNSPProxy(this, deviceId, null);
  var portSpeed = {};
  var objectType = "/nsp-equipment:network/network-element[ne-id='".concat(this.getSiteIdFromDeviceId(deviceId),"']/hardware-component/port");
  var filterExpression = "name;port-details";
  deviceProxy.searchObjectByType(deviceId, objectType, filterExpression, function(searchResults) {
    searchResults["nsp-inventory:output"]["data"].forEach(function(port) {
      var portId = getPortIdInDisplayFormat(port["name"]);
      if (portIds.indexOf(portId) !== -1) {
        // port speed unit is reported separately in port["port-details"][0]["actual-rate-units"] - agree to a common unit and convert?
        portSpeed[portId] = port["port-details"][0].rate;
      }
    });
  });
  return portSpeed;
}

AltiplanoNSPMDMIntentHelper.prototype.getPODIntentConfig = function (podName) {
  var getKeyForList = function (listName) {
    switch (listName) {
      case "olt-device-id":
        return "yang:leaf-list";
      default:
        return null;
    }
  };
  var intentConfig = apUtils.getIntentConfig(intentConstants.INTENT_TYPE_POD, apUtils.getIntentVersion(intentConstants.INTENT_TYPE_POD, podName), podName);
  return apUtils.convertIntentConfigXmlToJson(intentConfig, getKeyForList);
}

AltiplanoNSPMDMIntentHelper.prototype.getIntentAttributeObjectsList = function (resourceName, type, key, deviceType, profileManagerDetails, deviceTypeInPod) {
      var map;
    if(profileManagerDetails && profileManagerDetails["useProfileManager"] && profileManagerDetails["useProfileManager"]==true){
        map = this.getParsedProfileDetailsFromProfMgr(profileManagerDetails["deviceName"],profileManagerDetails["nodeType"],profileManagerDetails["intentType"],profileManagerDetails["excludeList"], profileManagerDetails["intentTypeVersion"]);
        deviceType = null;
    }
    else {
        var mapJSon = resourceProvider.getResource(resourceName);
        map = JSON.parse(mapJSon);
    }
    var values = {};
    if (map[type]) {
            for (var i = 0; i < map[type].length; i++) {
                if(deviceType) {
                    if(map[type][i]["ION"] && map[type][i]["ION"][deviceTypeInPod][deviceType]) {
                        values[map[type][i][key]] = map[type][i][key];
                    }
                } else {
                    values[map[type][i][key]] = map[type][i][key];
                }
        }
    }
    return values;
}




//////// NSP Proxy and Factory Function for Exception Message Handling
function createDecoratedNSPProxy(NSPFwk, targetDevice, targetManager) {  
  var nspProxy = new NSPProxy(NSPFwk, targetDevice, targetManager);
  return NSPFwk.wrapErrorHandler(nspProxy, "NSPProxy");
}

/**
 * Proxy that wraps the creation of the NSPProxy object, and provices CRUD REST operations
 **/

function NSPProxy(NSPFwk, targetDevice, targetManager) {
  if(!targetManager) {   
    this.getRestClient(targetDevice);
  }
  else{
    this.getRestClientWithManagerName(targetManager);
  }
  if(NSPFwk != null)
    {
  		this.NSPFwk = NSPFwk;
    }
  if(targetDevice != null) {
  	this.deviceId = targetDevice;
   }
}

/**
 * @param fdn Object Full Distinguished Name e.g., network:<DEVICE_IP>:lag:interface-1
 * @param fullClassName Classname  of the Object
 * @param attributes Attributes to be used while creating the Object
**/

NSPProxy.prototype.create = function(objectId, objectPath, objectType, requestBodyKey, attributes) {
  logger.debug("Create Request for objectId "+objectId+", objectPath "+ objectPath+",objectType"+objectType+ " attributes "+JSON.stringify(attributes));
  return moCreate(objectId, objectPath, objectType, requestBodyKey, attributes);
};

NSPProxy.prototype.searchObjectByType = function (deviceName, objectType, searchFilter, resultCallBack) {
  var searchUrl = baseUrl2 + "restconf/operations/nsp-inventory:find";
  var requestBody = {
    "input" : {
      "xpath-filter": objectType
    }
  };
  if (searchFilter) {
    requestBody["input"]["fields"] = searchFilter;
  }

  logger.debug("searchObjectByType called for {} with object type {} device with url: {}, requestBody: {}, resultCallBack: {}", deviceName, objectType, searchUrl, JSON.stringify(requestBody), resultCallBack);

  restClient.post(searchUrl, "application/json", JSON.stringify(requestBody), "application/json", function (exception, httpStatus, response) {
    if (exception) {
      logger.error("Couldn't connect to Manager of Device: " + deviceName);
      throw exception;
    }
    if (httpStatus != 200) {
      logger.error("Request Failed with status code: " + httpStatus + " and response: "+response + " for the device: " + deviceName);
      resultCallBack(JSON.parse('[]'));
    } else {
      var json = JSON.parse(response);
      logger.debug("Result of " + searchUrl + ": " + response);
      resultCallBack(json);
    }
  });
}

NSPProxy.prototype.doAudit = function(objectId, objectPath, objectType, attributes) {
  logger.debug("Update - doAudit Request for objectId "+objectId+", objectPath "+ objectPath+",objectType"+objectType+ " attributes "+JSON.stringify(attributes));
  return moAudit(objectId, objectPath, objectType, attributes);
};

NSPProxy.prototype.doPOST = function(objectId, objectPath, objectType, attributes) {
  logger.debug("Update - doPOST Request for objectId "+objectId+", objectPath "+ objectPath+",objectType"+objectType+ " attributes "+JSON.stringify(attributes));
  return moPOST(objectId, objectPath, objectType, null, attributes);
};

NSPProxy.prototype.doRetry = function(objectId, objectPath, objectType, attributes) {
  logger.debug("Retry request for objectId: " + objectId + ", objectPath: " + objectPath + ", objectType: " + objectType + ", attributes: " + JSON.stringify(attributes));
  return moRetry(objectId, objectPath, objectType);
};

NSPProxy.prototype.doPUT = function( fdn, objectType, requestBody  ) {
  logger.debug("Update - doPUT Request for objectId "+fdn);
  return moPUT( fdn, objectType, requestBody );
};

NSPProxy.prototype.doGET = function(ruleName, objectType, objectPath) {
  logger.debug("Update - doGET Request for ruleName "+ruleName);
  return moGET(ruleName, objectType, objectPath);
};


/**
 *
 * @param objectId
 * @returns {boolean} returns tru when httpStatus is 200 &
 * false when httpStatus is 404
 */
/*NSPProxy.prototype.isObjectExist = function(objectId){
  var isExists = false;
  print("isObjectExist(): GET, baseUrl= " + baseUrl.concat(objectId) )

  restClient.get(baseUrl.concat(objectId), "application/json", function(exception, httpStatus, response) {
    logger.debug("Retrieved response for objectId: ".concat(objectId, " {} "+JSON.stringify(response)));
    isExists = httpStatus === 200 ? true : false;
  });
  return isExists;
}*/

/**
 * @param deviceId: Device ID to check its status
 * @param fullClassName: Class name of the object
 * @param filterExpression: Additional attributes used to prune the REST response received
 * **/
NSPProxy.prototype.getObjectByType = function(deviceId, fullClassName, filterExpression) {
  var searchOutput = {};
  this.searchObjectByType(deviceId, fullClassName, filterExpression, function(searchResults) {
    if (searchResults["nsp-inventory:output"]) {
      searchOutput = searchResults["nsp-inventory:output"].data;
    }
  });
  return searchOutput;
}

/*NSPProxy.prototype.searchObjectForAudit = function (objectId, objectPath, objectType, resultCallBack) {
  logger.debug("Searching with objectId " + objectId + " objectPath " + objectPath + " objectType " + objectType + " resultCallBack " + resultCallBack);
  var url = baseUrl+objectPath+"/"+objectType+"/";

  if(typeof searchInNE === 'function') {
    resultCallBack = searchInNE;
    logger.debug("Result call back: {}", resultCallBack);
  } else if(searchInNE) {
    if (searchFilter) {
      requestBody.filterExpression = searchFilter;
    } else {
      var siteId = deviceName.substring(deviceName.indexOf("(") + 1, deviceName.indexOf(")"));
      requestBody.filterExpression = "(siteId='"+siteId+"')";
    }
    logger.debug("Filter: {}", requestBody.filterExpression);
  }

  print("searchObjectByType(): POST, searchUrl= " + searchUrl + " requestBody = " + JSON.stringify(requestBody) )

  restClient.post(searchUrl, "application/json", JSON.stringify(requestBody), "application/json", function (exception, httpStatus, response) {
    if (exception) {
      logger.error("Couldn't connect to Manager of Device: " + deviceName);
      throw exception;
    }
    if (httpStatus != 200) {
      logger.error("Request Failed with status code: " + httpStatus + " and response: "+response + " for the device: " + deviceName);
      resultCallBack(JSON.parse('[]'));
    } else {
      var json = JSON.parse(response);
      logger.debug("Result of " + searchUrl + ": " + response);
      resultCallBack(json);
    }
  });
}*/

/**
 * @param Object identifier e.g., network:<DEVICE_IP>:lag:interface-1
 * @param fullClassName Classname  of the Object
 * @param attributes Attributes to be used while updating the Object
 * **/
NSPProxy.prototype.update = function(objectId, objectPath, objectType, requestBodyKey, attributes) {
  logger.debug("Update Request for objectId "+objectId+", objectPath "+ objectPath+",objectType"+objectType, +",requestBodyKey"+requestBodyKey);
  if(requestBodyKey != "deployment" && requestBodyKey != "moMerge"){
    try{
      moSave(objectId);
    } catch(e){
      logger.warn("object doesnot need to update to saved state " + e.getMessage());
    }
  }
  moMerge(objectId, objectPath, objectType, requestBodyKey, attributes);
};

/**
 * @param Object identifier used to uniquely identify it, e.g., network:<DEVICE_IP>:lag:interface-1
 *
 * **/
NSPProxy.prototype.delete = function (objectId, objectPath, objectType) {
  logger.debug("Delete Request for objectId " + objectId + ", objectPath " + objectPath + ",objectType" + objectType);
  var isDirectDelete = false;
  if (objectPath === "nsp-service-intent:intent-base" && objectType === "intent") {
    var serviceType = objectId.split(",")[1];
    if(serviceType == "vpls" || serviceType == "epipe"){
      var objectTypeSearch = serviceType == "vpls"? "/nsp-service:services/service-layer/elan/service-extension:elan-svc" : "/nsp-service:services/service-layer/eline/service-extension:eline-svc"
      var filterExpression = "slc-state";
      this.searchObjectByType(objectId, objectTypeSearch, filterExpression, function (searchResults) {
        if (typeof searchResults === "string") searchResults = JSON.parse(searchResults);
        if (searchResults["nsp-inventory:output"]) {
          searchOutput = searchResults["nsp-inventory:output"].data;
          for (var serviceObj of searchOutput) {
            if (serviceObj["@"]["nsp-model:identifier"].indexOf(objectId.split(",")[0]) && serviceObj["slc-state"] == "planned-failed") {
              isDirectDelete = true;
            }
          }
        }
      });
    }
  }

  moDelete(objectId, objectPath, objectType, isDirectDelete);
};

NSPProxy.prototype.deleteFromController = function (objectId){
  logger.debug("Delete from controller Request for objectId " + objectId );
  moDeleteFromController(objectId);
}

/**
 * @param Object identifier used to uniquely identify it, e.g., network:<DEVICE_IP>:lag:interface-1
 *
 * **/
NSPProxy.prototype.get = function (objectId, objectPath, objectType) {
  logger.debug("Get Request for objectId "+objectId+", objectPath "+ objectPath+",objectType"+objectType);
  return moGet(objectId, objectPath, objectType);
};

/**
 * @param Device name, as in within the managed device.
 *
 * **/
NSPProxy.prototype.getRestClient = function (deviceName) {
  var managerInfo = apUtils.getManagerInfo(deviceName);  
  this.setNewRestClient(managerInfo);
}

/**
 * @param NSP info like, ip & rest port needed to establish rest session
 *
 * **/
NSPProxy.prototype.setNewRestClient = function (managerInfo) {  
    apUtils.checkManagerConnectionState(null, managerInfo);    
    if (managerInfo.getType().toString() === intentConstants.MANAGER_TYPE_NSP) {
      //Once HDM needs to be supported, this method could go to common utility
      restClient.setIp(managerInfo.getIp());
      restClient.setPort(managerInfo.getPort());
      restClient.setProtocol(managerInfo.getProtocol());
    } else if(managerInfo.getType().toString() === intentConstants.MANAGER_TYPE_NSP_MDM) {
      restClient.setIp(managerInfo.getIp());
      restClient.setPort(managerInfo.getPort());
      restClient.setProtocol(managerInfo.getProtocol());
    }
  }

NSPProxy.prototype.getRestClientWithManagerName = function (managerName) {
	var managerInfo = mds.getManagerByName(managerName);  
  this.setNewRestClient(managerInfo);
}


////// Pipeline Processor (Uses lot of Closures without updating Protype. FIXME.)

/**
 * The main function which runs the pipeline and builds results for and audit operations
 @param targetName the intent target. This has no significance within the pipeline unless intent object functions use it.
 @param devicesConfig the getDevices property of the intent object
 @param intentConfigArgs JSON representation of syncInput.getIntentConfiguration
 @param desiredNetworkState the network state with which the operation was triggered
 @param currentTopology the current topology of the intent. Would be null when the intent is synced the first time
 **/
function NSPIntentPipelineEngine(NSPFwk, targetName, devicesConfig, intentConfigArgs, desiredNetworkState, currentTopology, pipelineContext) {

  var nspFwk = NSPFwk;
  var target = targetName;
  var intentConfigArgs = intentConfigArgs;
  var networkState = desiredNetworkState;
  var pipelineContext = pipelineContext;
  var devices = devicesConfig;
  var topology = currentTopology;
  var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
  pipelineContext.topologyXtraInfo = topologyXtraInfo;

  if (typeof devicesConfig === 'function') {
    devices = devicesConfig(target, intentConfigArgs, pipelineContext);
  }

  /**
   * Performs an audit of the given device configuration pipeline
   **/
  this.audit = function () {
    var deviceAuditor = new DeviceAuditorWithReport();
    pipelineContext["operation"] = "audit";
    processPipeline(deviceAuditor);
    return deviceAuditor.getResult();
  };

  /**
   * The functional class to be submitted to the PipelineController to perform audit of an entire device pipeline and creates the IBN compliant report
   **/
  function DeviceAuditorWithReport() {
    var deviceProxy;
    var currentDevice;
    var auditor;
    var report = auditFactory.createAuditReport(null, target);
    logger.debug("Initialized Auditor with Report");

    this.setDeviceId = function (deviceId, targetManager) {
      deviceProxy = createDecoratedNSPProxy(nspFwk, deviceId, targetManager);
      currentDevice = deviceId;
      auditor = DeviceAuditor(deviceProxy);
      logger.debug("Auditing Device " + deviceId);
      pipelineContext.deviceProxy = deviceProxy;
      pipelineContext.networkState = networkState;
      pipelineContext.currentDeviceId = currentDevice;
    };

    this.getResult = function () {
      return report;
    }

    this.processInstance = function (step, instance) {
      if (step.ignoreOnSync && step.ignoreOnSync == true) {
        return true;
      }
      var configData = getConfigurationData(target, step, instance, intentConfigArgs);
      var objectId = configData.identifier;
      var fullClassName = configData.fullClassName;
      var objectPath = configData.objectPath;
      var objectType = configData.objectType;
      var requestBodyKey= configData.requestBodyKey;
      var flipReport = configData.flipReport;

      if (configData.audit === "false") {
        logger.debug("Skipping audit for " + objectId);
        return true;
      }      
      if(!sendRequestToNsp){
        return true;
      }
      //var attributeValues = getAuditableAttributes(configData);
      //var attributes = Object.keys(attributeValues);
      var attributeValues = getConfigAttributes(configData, objectType, objectId);
      //if(objectType != "deployment" || objectType != "intent"){
      logger.debug("Auditing Object " + objectId + " with attributes " + apUtils.protectSensitiveDataLog(attributeValues));
      var auditResult = auditor(objectId, objectPath, objectType, requestBodyKey, attributeValues, flipReport);
      if (!auditResult.configured) {
          if (flipReport && networkState === "delete") {
              addMisalignedAttributesToReport(auditResult.misAlignedAttributes);
          } else {
	          if (objectId) {
	              report.addMisAlignedObject(auditFactory.createMisAlignedObject(objectId, false, currentDevice));
	          } else {
	              if (configData.auditMessage) {
	                  report.addMisAlignedObject(auditFactory.createMisAlignedObject(configData.auditMessage, false, currentDevice));
	              }
	          }
          }
          return false;
       }else{
            if(objectId && networkState !== "delete"){ 
                var attributesToUpdate = getAttributesToUpdateAudit(auditResult.misAlignedAttributes, attributeValues);

                if( objectType === "deployment" || objectType === "intent" )
                {
                  if (auditResult.deploymentFailed) {
                    throw new RuntimeException("Deployment is in deployment-failed status, audit cannot be triggered");
                  }
                  if(auditResult.misAlignedAttributes && auditResult.misAlignedAttributes.length > 0){
                    addMisalignedAttributesToReport(auditResult.misAlignedAttributes);
                  }
                  var postObject = deviceProxy.doAudit(objectId, objectPath, objectType, attributesToUpdate);                  
                  if(postObject["ibn:output"]){
                    postObject = postObject["ibn:output"]["audit-report"];
                  }

                  if( postObject["misaligned-attribute"] && postObject["misaligned-attribute"].length > 0 ) //ToDo: to be refactored when we have the response
                  {
                      auditResult.misAlignedAttributes = postObject["misaligned-attribute"];
                      addMisalignedAttributesToReport(auditResult.misAlignedAttributes);
                  }

                  if( postObject["misaligned-object"] && postObject["misaligned-object"].length > 0 )  //ToDo: to be refactored when we have the response
                   {
                       report.addMisAlignedObject( auditFactory.createMisAlignedObject(JSON.stringify(postObject["misaligned-object"] ), false, currentDevice));
                  }
                }
            }
       }
       return true;
    };

    function getAttributesToUpdateAudit(misAlignedAttributes, attributeValues) {
      var updatedAttributes = {};
      if(attributeValues){
        updatedAttributes=attributeValues;
      } else{
        for (var misAlignedAttribute in misAlignedAttributes) {
            updatedAttributes[misAlignedAttributes[misAlignedAttribute].name] = misAlignedAttributes[misAlignedAttribute]["expected-value"];
        }
      }
      return updatedAttributes;
    };
      
    function addMisalignedAttributesToReport(misalignedAttributes) {
            	if (misalignedAttributes) {
                    for (var misalignedAttr in misalignedAttributes) {
                        var attrResult = misalignedAttributes[misalignedAttr];
                        if (attrResult["expected-value"] && attrResult["actual-value"]) {
                          report.addMisAlignedAttribute(auditFactory.createMisAlignedAttribute(attrResult.name, JSON.stringify(attrResult["expected-value"]), JSON.stringify(attrResult["actual-value"]), currentDevice));
                        } else if (attrResult["expected-value"] && !attrResult["actual-value"]) {
                          report.addMisAlignedAttribute(auditFactory.createMisAlignedAttribute(attrResult.name, "Configured", "Not configured", currentDevice));
                        } else if (!attrResult["expected-value"] && attrResult["actual-value"]) {
                          report.addMisAlignedAttribute(auditFactory.createMisAlignedAttribute(attrResult.name, "Not configured", "Configured", currentDevice));
                        }
                    }
                }
            }

/*    function getAuditableAttributes(configData) {
      var attributes = {};
      for (var attributeIdx in configData.attributes) {
        var auditable = configData.attributes[attributeIdx].audit
        if (auditable == undefined || auditable === "true") {
          var attribute = configData.attributes[attributeIdx];
          attributes[attribute['name']] = attribute['value'];
        }
      }
      return attributes;
    }*/

  };


  /*
  * Closure for auditing objects with a given deviceProxy.
  * Object existance is a precondition to check of its attributes alignment
  * Audit works as follows -
  ----------------------------------------------------------------------
  required nw state  |  isExists | ConfigAligned | Audit   |   Sync
  ----------------------------------------------------------------------
  active/onsuspend      true         True         Success     Wont Run
  active/onsuspend      false         N/A         Failure     CreateAndUpdate
  active/onsuspend      true         False        Failure     Update
  delete                true         N/A          Failure     Delete
  delete                false        N/A          Success     Wont Run
  */
  function DeviceAuditor(deviceProxy) {
    var deviceProxy = deviceProxy;
    return function (objectId, objectPath, objectType, requestBodyKey, expectedAttributesAndValues, flipReport) {
      logger.debug("Auditing Object " + objectId + " with expected attribute values :" + apUtils.protectSensitiveDataLog(expectedAttributesAndValues));
      var isConfigured = false;
      var isDeploymentFailed = false;
      var misAlignedAttributes = {};
      var searchObject = {};

      if (expectedAttributesAndValues) {
        //attributes.push("objectFullName");
        var formattedExpectedAttributesAndValues = [];
        var tempExpectedAttributesAndValues = {};
        if (expectedAttributesAndValues[0]) {
          Object.keys(expectedAttributesAndValues[0]).forEach(function (expectedVal) {
            if (expectedVal == "targets" && Array.isArray(expectedAttributesAndValues[0][expectedVal])) {
              Object.keys(expectedAttributesAndValues[0][expectedVal][0]).forEach(function (attribute) {
                tempExpectedAttributesAndValues[attribute] = expectedAttributesAndValues[0][expectedVal][0][attribute];
              })
            } else {
              tempExpectedAttributesAndValues[expectedVal] = expectedAttributesAndValues[0][expectedVal];
            }
          })
          formattedExpectedAttributesAndValues.push(tempExpectedAttributesAndValues);
        }
        searchObject = deviceProxy.get(objectId, objectPath, objectType);
      }
      if (requestBodyKey == "deployment") {
        requestBodyKey = "nsp-icm:deployment";
      }

      if (searchObject !== null && searchObject[requestBodyKey] !== undefined && searchObject[requestBodyKey].length !== 0) {
        var actualValues = {};
        for (var j = 0; j <= searchObject[requestBodyKey].length; j++) {
          actualValues = searchObject[requestBodyKey][j];
          if (requestBodyKey == "nsp-icm:deployment" && actualValues["deployed-target-data"]) {
            isConfigured = true;
            if (actualValues["deployment-status"] == "deployment-failed") {
              isDeploymentFailed = true;
            }
            break;
          } else if (requestBodyKey === "nsp-service-intent:intent" && actualValues) {
            var objectIdFromNsp = actualValues["service-name"].concat(",", actualValues["intent-type"]);
            if (objectIdFromNsp === objectId) {
              isConfigured = true;
              if(!(actualValues["deployment-state"] == "success" && actualValues["olc-state"] == "deployed")){
                isDeploymentFailed = true;
              }
              break;
            }
          } else if (actualValues && actualValues.name === objectId) {
            isConfigured = true;
            break;
          }
        }
        var toBeDeleted = false;
        if (networkState === "delete" && Object.keys(searchObject).length != 0) //if object exists in nsp then toBeDeleted is true else false
          toBeDeleted = true;
        if (isConfigured) {
          isConfigured = (networkState === "delete") ? false : true;
        } else { //object does not exist
          isConfigured = (networkState === "delete") ? true : false;
        }
        if ((isConfigured && networkState !== "delete") || (!isConfigured && networkState === "delete" && flipReport)) {//audit attributes
          misAlignedAttributes = auditObjectAttributes(objectId, formattedExpectedAttributesAndValues, actualValues);
          //ToDo: US1 if there is a misAlignedAttributes, then update NSP intent config
        }
      } else { //object does not exist
        isConfigured = (networkState === "delete") ? true : false;
                                                                 
      }
      logger.debug("Is Configured: " + isConfigured + " & MisalignedAttributes: " + JSON.stringify(misAlignedAttributes));
      return { configured: isConfigured, misAlignedAttributes: misAlignedAttributes, toBeDeleted:toBeDeleted, deploymentFailed: isDeploymentFailed };
    };

     function auditObjectAttributes(objectId, expectedValuesArr, actualValues) {
        var misAlignedAttributes = [];
        if (expectedValuesArr.length <= 0) {
            return misAlignedAttributes;
        }
       var expectedValues= expectedValuesArr[0];
       logger.debug("Comparing expected "+ JSON.stringify( expectedValues )+" actual: "+ JSON.stringify( actualValues ) );

      compareBetweenExpectedValueAndActualValue(expectedValues, actualValues, misAlignedAttributes);
      return misAlignedAttributes;
    }

    function compareBetweenExpectedValueAndActualValue(expectedValues, actualValues, misAlignedAttributes){
      if(!misAlignedAttributes){
        var misAlignedAttributes = [];
      }
      var expectedKeys = Object.keys(expectedValues);
      for (var j = 0; j < expectedKeys.length; j++) {
        var expectedObjectType = typeof expectedValues[expectedKeys[j]];
        var actualObjectType = typeof actualValues[expectedKeys[j]];
        if ((actualObjectType === "string" || actualObjectType === "number" || actualObjectType === "boolean")) {
            if (expectedValues[expectedKeys[j]].toString() !== actualValues[expectedKeys[j]].toString()) {
                var misAlignedAttribute = {};
                misAlignedAttribute.name = expectedKeys[j];
                misAlignedAttribute["expected-value"] = expectedValues[expectedKeys[j]].toString();
                misAlignedAttribute["actual-value"] = actualValues[expectedKeys[j]].toString();
                misAlignedAttributes.push(misAlignedAttribute);
            }
        } else if (actualObjectType === "undefined" && expectedObjectType !== "undefined") {
            if (expectedObjectType === "string" || expectedObjectType === "number" || expectedObjectType === "boolean") {
                var misAlignedAttribute = {};
                misAlignedAttribute.name = expectedKeys[j];
                misAlignedAttribute["expected-value"] = expectedValues[expectedKeys[j]].toString();
                misAlignedAttribute["actual-value"] = "";
                misAlignedAttributes.push(misAlignedAttribute);
            }else if(expectedObjectType === "object"){
              var misAlignedAttribute = {};
              misAlignedAttribute.name = expectedKeys[j];
              misAlignedAttribute["expected-value"] = expectedValues[expectedKeys[j]];
              misAlignedAttribute["actual-value"] = {};
              misAlignedAttributes.push(misAlignedAttribute);
            }
        } else if (actualObjectType === "object" && expectedObjectType === "object") {
          if(Array.isArray(expectedValues[expectedKeys[j]]) && Array.isArray(actualValues[expectedKeys[j]])){
            if (expectedValues[expectedKeys[j]].length > 0 && actualValues[expectedKeys[j]].length > 0) {
                if (expectedValues[expectedKeys[j]].length !== actualValues[expectedKeys[j]].length) {
                  var misAlignedAttribute = {};
                  misAlignedAttribute.name = expectedKeys[j];
                  misAlignedAttribute["expected-value"] = expectedValues[expectedKeys[j]];
                  misAlignedAttribute["actual-value"] = actualValues[expectedKeys[j]];
                  misAlignedAttributes.push(misAlignedAttribute);
                }
                if(typeof expectedValues[expectedKeys[j]][0] == 'object'){
                  compareBetweenExpectedValueAndActualValue(expectedValues[expectedKeys[j]], actualValues[expectedKeys[j]], misAlignedAttributes);
                } else if (actualValues[expectedKeys[j]].length < 0){
                  var misAlignedAttribute = {};
                  misAlignedAttribute.name = expectedKeys[j];
                  misAlignedAttribute["expected-value"] = expectedValues[expectedKeys[j]];
                  misAlignedAttribute["actual-value"] = [];
                  misAlignedAttributes.push(misAlignedAttribute);
                } else {
                  var isEqual = true;
                  expectedValues[expectedKeys[j]].forEach(function(item, index){
                    if(actualValues[expectedKeys[j]].indexOf(item) === -1){
                      isEqual = false;
                    }
                  })
                  if(!isEqual){
                    var misAlignedAttribute = {};
                    misAlignedAttribute.name = expectedKeys[j];
                    misAlignedAttribute["expected-value"] = expectedValues[expectedKeys[j]];
                    misAlignedAttribute["actual-value"] = actualValues[expectedKeys[j]];
                    misAlignedAttributes.push(misAlignedAttribute);
                  }
                }
            }
          } else {
            compareBetweenExpectedValueAndActualValue(expectedValues[expectedKeys[j]], actualValues[expectedKeys[j]], misAlignedAttributes);
          }
        }
      }
      return misAlignedAttributes;
    }

    function getAttributesToUpdateAudit(misAlignedAttributes, attributeValues) {
      var updatedAttributes = {};
      // if(attributeValues){
      //   updatedAttributes=attributeValues;
      // } else{
        for (var misAlignedAttribute in misAlignedAttributes) {
            updatedAttributes[misAlignedAttributes[misAlignedAttribute].name] = misAlignedAttributes[misAlignedAttribute]["expected-value"];
        }
      //}
      return updatedAttributes;
    };

 }

  /**
   * Performs synchronization of the given device configuration pipeline
   **/
  this.synchronize = function () {
    pipelineContext["operation"] = "synchronize";
    if (!topology) {
      topology = topologyFactory.createServiceTopology();
    }
    var preSyncSuccess = true;
    var preSyncError;
    for (var device in devices) {
      if (devices[device].preSynchronize) {
        var preSyncResult = nspFwk.getPropertyData(devices[device].preSynchronize, [target, intentConfigArgs, topology]);
        logger.debug("Presync result " + preSyncResult);
        if (preSyncResult.result === false) {
          logger.debug("Presync failed for device " + device);
          preSyncSuccess = false;
          preSyncError = preSyncResult.errorDetail;
        }
      }
    }

    var result;
    if (preSyncSuccess) {
      var synchronizer = new DeviceSynchronizer();
      processPipeline(synchronizer);
      result = synchronizer.getResult();
      result.setSuccess(true);
    } else {
      result = synchronizeResultFactory.createSynchronizeResult();
      result.setSuccess(false);
      result.setErrorDetail(preSyncError);
    }
    //irrespective of the presync result, save the int configuration in XtraInfo
    for (var device in devices) {
      apUtils.setTopologyExtraInfo(topology, nspFwk.intentTypeObject.stageName + "_" + device + "_ARGS", JSON.stringify(intentConfigArgs));
    }
    result.setTopology(topology);
    result.getTopology().setDependencyInfo(topology.getDependencyInfo());
    for (var device in devices) {
      if(devices[device].postSynchronize) {
        logger.debug("start Postsync");
        try {
          result = devices[device].postSynchronize(pipelineContext, result, topology);
        } catch (e) {
          result.setSuccess(false);
          result.setErrorCode("100");
          result.setErrorDetail(e);
        }
        logger.debug("Postsync result : "+apUtils.protectSensitiveDataLog(result));
      }
    }
    for (var device in devices) {
      if (!nspFwk.isDeviceDiscoveredInMDS(device) && networkState !== "delete") {
        result.setDeviceYetToBeConfigured([device]);
      } 
    }
    return result;
  };

  /**
   * Functional class that synchronizes an instance on the device that has been set
   **/
  function DeviceSynchronizer() {
    var deviceProxy;
    var auditor;
    var deviceIdValue;    
    logger.debug("Initialized Device Synchronizer");
    var result = synchronizeResultFactory.createSynchronizeResult();
    pipelineContext.topologyObjects = [];
    pipelineContext.topology = {};

    /**
     * This should be called before calling the processInstance
     **/
    this.setDeviceId = function (deviceId, targetManager) {
      deviceProxy = createDecoratedNSPProxy(nspFwk, deviceId, targetManager);
      auditor = DeviceAuditor(deviceProxy);
      deviceIdValue = deviceId;
      pipelineContext.currentDeviceId = deviceId;
      pipelineContext.deviceProxy = deviceProxy;
      pipelineContext.networkState = networkState;
      pipelineContext.prevTopoStep = null;
      pipelineContext.topoFromConfig = false;
      pipelineContext.result = {};
      pipelineContext.topology[deviceId] = {step: {}, topologyObjects: []};

      logger.debug("Synchronizing Device " + deviceId);
    };

    /**
     * Synchronizes an instance based on the desired network state. Also builds topology for relavant network states.
     **/
    this.processInstance = function (step, instance) {
      if (step.ignoreOnSync && step.ignoreOnSync == true) {
        return true;
      }
      var attributeValues = {};
      // Instance-level preSync
      if(step.preSynchronize) {
        logger.debug("Instance-level start Presync");
        try {
          step.preSynchronize(pipelineContext);
        } catch (e) {
          // Just a callback no need to handle error
          logger.error("Exception occured during PreSynchronize : "+ (typeof e.getMessage === 'function') ? e.getMessage() : e);
        }
        logger.debug("Instance-level stop Presync ");
      }
      try {

      var configData = getConfigurationData(target, step, instance, intentConfigArgs);
      var objectId = configData.identifier;
      var fullClassName = configData.fullClassName;
      var objectPath=configData.objectPath;
      var objectType=configData.objectType;
      var requestBodyKey=configData.requestBodyKey;
      //var fdn = configData.fdn;
      //var filter = configData.filter;
      if (networkState != "delete") {
        attributeValues = getConfigAttributes(configData, objectType, objectId);
      }

      //if(objectType != "deployment" || objectType != "intent"){
      if(sendRequestToNsp){
      if (objectId) {
	                logger.debug("Auditing Object " + objectId + " with attributes " + apUtils.protectSensitiveDataLog(attributeValues));
	                var  auditResult= auditor(objectId, objectPath, objectType, requestBodyKey, attributeValues); //WA
                  
	                logger.debug("Audit Result for object " + objectId + " = " + JSON.stringify(auditResult));
                  try {           
                		if (auditResult.configured  && networkState !== "delete") {
                   
	                        if (auditResult.misAlignedAttributes.length > 0) {
	                            var attributesToUpdate = getAttributesToUpdate(auditResult.misAlignedAttributes, attributeValues);
                                deviceProxy.update(objectId, objectPath, objectType, requestBodyKey, attributesToUpdate);
	                        }else{
                            if( objectType === "deployment" || objectType === "intent" ){
                              if (auditResult.deploymentFailed) {
                                if(objectType === "deployment"){
                                  deviceProxy.doRetry(objectId, objectPath, objectType, attributeValues);
                                } else {
                                  deviceProxy.doPOST(objectId, objectPath, objectType, attributeValues);
                                }
                              }
                            }
                          }                          
	                    } else {
	                    	if (networkState === "delete") {
                              if (step.updateOperation) {
                                attributeValues = getConfigAttributes(configData, objectType, objectId);
                                step.updateOperation.apply(step, [configData, attributeValues, pipelineContext]);
                              }
                              if (step.deleteOperation ) {
                                  step.deleteOperation.apply(step, [objectId, intentConfigArgs, instance, pipelineContext]);
                              }
                              if(configData.ignoreDelete != undefined && (configData.ignoreDelete == "true" || configData.ignoreDelete == true)){
                                auditResult.toBeDeleted = false;
                              }
                              if (auditResult.toBeDeleted && !step.isNotDeleted) {
                                
                            deviceProxy.delete(objectId, objectPath, objectType);
                          }
	                        } else {
	                        	/*if (!fdn) {
	                        		fdn = objectId;
	                        	}*/
	                        	//var json = deviceProxy.create(fdn, fullClassName, attributeValues);
                            try{
                              var json = deviceProxy.create(objectId, objectPath, objectType, requestBodyKey, attributeValues);
                            } catch(e){
                              logger.error("objectId {} already exists", objectId);
                              if(e.toString().indexOf("Deployment exists") != -1){
                                var json = deviceProxy.update(objectId, objectPath, objectType, requestBodyKey, attributeValues);
                              } else {
                                throw e;
                              }
                            }

    	          				  	pipelineContext.result[step.name] = json;
	                        }
	                    }
	                } catch (e) {
	                    if (typeof e.getMessage === 'function') {
	                        throw new RuntimeException(e.getMessage());
	                    }
	                    throw new RuntimeException(e);
	                }
      } else {
                	//if (networkState !== "delete" && fdn && filter) {
                	if (networkState !== "delete" && objectId) {
                		var json = deviceProxy.create(objectId, objectPath, objectType, requestBodyKey, attributeValues);
                		/*var objectFullName = json.objectFullName;
      				  	var siteId = nspFwk.getSiteIdFromDeviceId(deviceIdValue);
      				  	if (objectFullName && objectFullName.indexOf(siteId) !== -1) {
      					  objectId = objectFullName;
      				  	}*/
      				  	pipelineContext.result[step.name] = json;
                	}
         }
         }
        // }

        if (networkState != "delete") {
            var buildTopo = step.topology === undefined || step.topology;
            if (buildTopo && objectId) {
                    	var topologyObjectsFromConfigData = configData.topologyObjects;
                    	var side = step.topologySide || "TRAFFIC";
                    	logger.debug("Building Topology of "+step.name+" "+instance.name+" for device: "+deviceIdValue);
                    	if (topologyObjectsFromConfigData) {
                    		pipelineContext.topoFromConfig = true;
                        var objectType = fullClassName;
                        var topoObjectId = configData.topoObjectId ? configData.topoObjectId : objectId;
                    		var lastTopoNode, lastTopoNodeObjectId;
                    		var topologyObj = getTopologyObjectId(deviceIdValue, objectType, topoObjectId);

	                        logger.debug("Updating topology from configuration data with objectType " + topologyObj.objectType + " with id " + topologyObj.topoObjectId);
                            var prevVertex = getPreviousTopoVertex(pipelineContext,instance);
                            var topoRoot = prevVertex? topologyFactory.createTopologyObjectWithVertex(topologyObj.objectType, topologyObj.topoObjectId, side, prevVertex) :
                                           topologyFactory.createTopologyObjectFrom(topologyObj.objectType, topologyObj.topoObjectId, side);
	                        pipelineContext.topologyObjects.push(topoRoot);
	                        if (!pipelineContext.topology[deviceIdValue].step[step.name]) {
	                            pipelineContext.topology[deviceIdValue].step[step.name] = {};
	                        }
	                        lastTopoNode = topoRoot;
	                        lastTopoNodeObjectId = deviceIdValue + ":" + lastTopoNode.getObjectRelativeObjectID();

	                        if((!configData.connectWithPreviousStepTopo || configData.connectWithPreviousStepTopo!="false") && pipelineContext.prevTopoStep && pipelineContext.prevTopoStep !== step.name) {
	                        	pipelineContext.topology[deviceIdValue].step[step.name][instance.name] =
	                    		{id:lastTopoNodeObjectId, deviceId: deviceIdValue, prevStep: pipelineContext.prevTopoStep, side: side};
	                        }

                        topologyObjectsFromConfigData.forEach(function(topoObjectFromConfig) {
                    			logger.debug("Creating "+JSON.stringify(topoObjectFromConfig)+ " from lastTopoNode: "+lastTopoNode+" objectId: "+lastTopoNodeObjectId);
                    			var topologyObj = getTopologyObjectId(deviceIdValue,
                    					topoObjectFromConfig.fullClassName, topoObjectFromConfig.value);

                    			topoRoot = getMatchingTopologyObject(pipelineContext.topologyObjects, topologyObj.topoObjectId);
                    			if (!topoRoot) {
                    				topoRoot = topologyFactory.createTopologyObjectWithVertex(topologyObj.objectType, topologyObj.topoObjectId, side, lastTopoNodeObjectId);
                    			} else {
                    				var existingPreviousObjectIds = topoRoot.getObjectPreviousVertexObjectIDs();
                    				if (existingPreviousObjectIds.length > 0) {
                    					if (!existingPreviousObjectIds.contains(lastTopoNodeObjectId)) {
		                    				var previousVertexObjectIds = [];
		                    				for (var i = 0; i < existingPreviousObjectIds.length; i++) {
		                    					previousVertexObjectIds.push(existingPreviousObjectIds[i]);
		                    				}
		                    				previousVertexObjectIds.push(lastTopoNodeObjectId);
		                    				topoRoot.setObjectPreviousVertexObjectIDs(previousVertexObjectIds);
                    					}
                    				} else {
                              topoRoot.setObjectPreviousVertexObjectIDs([lastTopoNodeObjectId]);
                    				}
                    			}
                    			logger.debug("Topo Root: "+topoRoot);
                    			pipelineContext.topologyObjects.push(topoRoot);
 if(!configData.fixedRootTopoObject || configData.fixedRootTopoObject != "true"){
    	                        lastTopoNode = topoRoot;
    	                        lastTopoNodeObjectId = deviceIdValue + ":" + lastTopoNode.getObjectRelativeObjectID();
                          }
                        });

                    		if((!configData.connectWithPreviousStepTopo || configData.connectWithPreviousStepTopo!="false") && !pipelineContext.prevTopoStep) {
	                        	pipelineContext.topology[deviceIdValue].step[step.name][instance.name] =
	                    		{id:lastTopoNodeObjectId, deviceId: deviceIdValue, side: side};
	                        }
                    	}
                    	else {
	                      var objectType = fullClassName;
	                        var topologyObj = getTopologyObjectId(deviceIdValue, objectType, objectId);

	                        logger.debug("Updating topology with objectType " + topologyObj.objectType + " with id " + topologyObj.topoObjectId);
                            var prevVertex = getPreviousTopoVertex(pipelineContext,instance);
                            var topoRoot = prevVertex? topologyFactory.createTopologyObjectWithVertex(topologyObj.objectType, topologyObj.topoObjectId, side, prevVertex) :
                                           topologyFactory.createTopologyObjectFrom(topologyObj.objectType, topologyObj.topoObjectId, side);
	                        pipelineContext.topologyObjects.push(topoRoot);
	                        if (!pipelineContext.topology[deviceIdValue].step[step.name]) {
	                            pipelineContext.topology[deviceIdValue].step[step.name] = {};
	                        }
	                        if(!instance.previousVertex && pipelineContext.topoFromConfig && pipelineContext.prevTopoStep) {
	                        	prevVertex = pipelineContext.prevTopoStep;
	                        } else {
	                        	prevVertex = instance.previousVertex;
	                        }

	                        pipelineContext.topology[deviceIdValue].step[step.name][instance.name] =
	                        {id:topologyObj.topoObjectId, deviceId: deviceIdValue, prevStep: prevVertex, side: side};

                    	}
                    	if (!pipelineContext.prevTopoStep || pipelineContext.prevTopoStep !== step.name) {
                    		pipelineContext.prevTopoStep = step.name;
                            pipelineContext.prevInstance = instance.name;
                    	}
            }
        }
      }
      catch(e){
        throw e;
      }
      finally {
        // Instance-level postSync
        if (step.postSynchronize) {
          logger.debug("Instance-level start Postsync");
          try {
            step.postSynchronize(pipelineContext);
          } catch (e) {
            logger.error("Exception occured during PostSynchronize : "+ (typeof e.getMessage === 'function') ? e.getMessage() : e);
          }
          logger.debug("Instance-level stop Postsync ");
        }
      }
      result.setSuccess(true);
      return true;
    };

    function getPreviousTopoVertex(pipelineContext, instance){
      var instanceTopology = instance.topology;
      var prevVertex;
      if(instanceTopology){
        if(!instanceTopology.append) {
          instanceTopology.append = false;
        }
        if(instanceTopology.previousVertexObjectIds && instanceTopology.previousVertexObjectIds!=null) {
          if(Array.isArray( instanceTopology.previousVertexObjectIds)){
            prevVertex = '';
            for each (var v in  instanceTopology.previousVertexObjectIds){
              if(prevVertex=='') prevVertex = v;
              else {
                prevVertex = v + '||'+ prevVertex ;
              }
            }
          }
          else{
            prevVertex = instanceTopology.previousVertexObjectIds;
          }
        }
        if (pipelineContext.prevTopoStep && pipelineContext.prevTopoStep !== pipelineContext.topology[deviceIdValue].step.name && pipelineContext.topology[deviceIdValue].step[pipelineContext.prevTopoStep][pipelineContext.prevInstance]) {
          var lastObjectId= pipelineContext.topology[deviceIdValue].step[pipelineContext.prevTopoStep][pipelineContext.prevInstance].id;
          if(instanceTopology){
            if(instanceTopology.append==true) {
              prevVertex = prevVertex + '||' + lastObjectId;
            }else if(instanceTopology.replace && instanceTopology.replace == true){
              prevVertex = prevVertex;
            }
            else{
              prevVertex = lastObjectId;
            }
          }
          else{
            prevVertex = lastObjectId;
          }
        }
      }
      return prevVertex
    }

    function getAttributesToUpdate(misAlignedAttributes, attributeValues) {
      var updatedAttributes = {};
      if(attributeValues){
        updatedAttributes=attributeValues;
      } else{
          for (var misAlignedAttribute in misAlignedAttributes) {
            updatedAttributes[misAlignedAttributes[misAlignedAttribute].name] = misAlignedAttributes[misAlignedAttribute].expectedValue;
          }
      }
      return updatedAttributes;
    }

    /**
     * Returns the topology object ID in the format: <device-id>:nspmdm#class=<object-type>#dn=<object-dn>
     * Eg: IXR-s-1(92.168.150.101):nspmdm#class=equipment.LAG#dn=/nsp-equipment:network/network-element[ne-id='92.168.150.101']/lag[lag-id=1]
     **/
    function getTopologyObjectId(deviceId, objectType, objectId) {
      if (objectId.indexOf(",") > -1) {
        objectId = objectId.split(",")[1];
      }
      var topoId = deviceId + ":nspmdm#class=" + objectType + "#dn=" + objectId;
      return {
        objectType: objectType,
        topoObjectId: topoId
      }
    }

    /**
     * Updates topology and returns result
     **/
    this.getResult = function () {
            	updateTopology();
            	var deviceIds = Object.keys(pipelineContext.topology);
            	for each(var deviceId in deviceIds) {
            		var steps = Object.keys(pipelineContext.topology[deviceId].step);
            		for each(var stepName in steps) {
            			var instances = Object.keys(pipelineContext.topology[deviceId].step[stepName]);
            			for each(var instance in instances) {
            				var topoId = pipelineContext.topology[deviceId].step[stepName][instance].id;
            				var prevVertexStep = pipelineContext.topology[deviceId].step[stepName][instance].prevStep;
            				var prevVertexIds = [];
            				if(prevVertexStep) {
            					var prevVertexInstances = Object.keys(pipelineContext.topology[deviceId].step[prevVertexStep]);
            					for each(var prevVertexInstance in prevVertexInstances) {
            						prevVertexIds.push(pipelineContext.topology[deviceId].step[prevVertexStep][prevVertexInstance].id);
            					}
            					updateTopologyPreviousVertex(topology, topoId, prevVertexIds);
            				}
            			}
            		}
            	}
                return result;
            }

    function updateTopology() {
                var currentTopologyObjects = Arrays.asList(pipelineContext.topologyObjects);
      topology.getTopologyObjects().removeIf(function (topoObj) {
        return !currentTopologyObjects.contains(topoObj);
      });
      for (var topoIndex in currentTopologyObjects) {
           if(!topology.getTopologyObjects().contains(currentTopologyObjects.get(topoIndex))) {
               topology.addTopologyObject(currentTopologyObjects.get(topoIndex));
           }

       }
    }

    function updateTopologyPreviousVertex(currentTopo, topologyRelativeObjectId, previousVertexObjectId) {
            	var matchingTopologyObject = getMatchingTopologyObject(currentTopo.getTopologyObjects(), topologyRelativeObjectId);
            	var topologyObjects = [];

            	if (matchingTopologyObject && previousVertexObjectId) {
            		matchingTopologyObject.setObjectPreviousVertexObjectIDs(previousVertexObjectId);
            	}
      return matchingTopologyObject;
    }

    function getMatchingTopologyObject(topologyObjects, topologyRelativeObjectId) {
            	if (topologyObjects) {
            		for (var i = 0; i < topologyObjects.length; i++) {
            			var deviceName = topologyObjects[i].getObjectDeviceName();
            			var objectId = topologyObjects[i].getObjectRelativeObjectID();
            			var relativeObjectId = deviceName + ":" + objectId;
            			if (topologyRelativeObjectId === relativeObjectId) {
            				return topologyObjects[i];
            			}
            		}
            	}
            	return null;
     }
  };

  //internal methods
  function processPipeline(deviceProcessor) {
    for (var deviceId in devices) {
      deviceProcessor.setDeviceId(deviceId,devices[deviceId].manager);
      var device = devices[deviceId];
      var steps = nspFwk.getPropertyData(device.steps, [target, intentConfigArgs]);
      var deviceXtraInfo = {};
      logger.debug("Previous Device Config Args " + topologyXtraInfo[nspFwk.intentTypeObject.stageName + "_" + deviceId + "_ARGS"]);
      if (typeof topologyXtraInfo[nspFwk.intentTypeObject.stageName + "_" + deviceId + "_ARGS"] === "string") {
        deviceXtraInfo = JSON.parse(topologyXtraInfo[nspFwk.intentTypeObject.stageName + "_" + deviceId + "_ARGS"]);
        if (pipelineContext.operation != "audit") {
          pipelineContext.operation = "update";
        }
      }
      PiplelineController(steps, deviceXtraInfo, deviceProcessor)();
    }
  }

  /** Runs through the device pipeline based on the desired network state
   * @param steps the pipeline steps to be executed
   * @param previousDeviceArgs the previous intent configuration used in the pipeline (Topology XTraInfo)
   * @param deviceProcessor any class the adheres to the following contract
   * {
   * setDeviceId: This function should accept a single parameter the deviceId. This function should be used to prepare for device procesing
   * processInstance: This function should perform operations on the given instance argument. Should return true or false,
   * depending on which the PipelineController would control pipeline execution
   * }
   **/
  function PiplelineController(steps, previousDeviceArgs, deviceProcessor) {
    if (networkState === "delete") {
      // For "Delete" state, the pipeline is executed in the reverse
      return function () {
        for (var step = steps.length - 1; step >= 0; step--) {
          var configStep = nspFwk.getPropertyData(steps[step], [target, intentConfigArgs, pipelineContext]);
          if (configStep.ignoreOnDelete != null && configStep.ignoreOnDelete == true) {
            logger.debug("Skipped Step " + configStep.name);
            continue;
          }
          logger.debug("Processing Step " + configStep.name);
          var instances = nspFwk.getPropertyData(configStep.instances, [target, intentConfigArgs, pipelineContext]);
          for (var instance in instances) {
            var prevParentInstance = pipelineContext.parentInstance;
            if (configStep.steps) {
              pipelineContext.parentInstance = instances[instance];
              PiplelineController(configStep.steps, previousDeviceArgs, deviceProcessor)();
            }
            pipelineContext.parentInstance = prevParentInstance;
            logger.debug("Processing Instance " + apUtils.protectSensitiveDataLog(instances[instance]));
            if (configStep.ignoreOnDelete != null && configStep.ignoreOnDelete == "currentStep") {
              logger.debug("Skipped Step " + configStep.name);
              continue;
            }
            deviceProcessor.processInstance(configStep, instances[instance]);
          }
        }
      }
    } else {
      return function () {
        for (var step in steps) {
          var configStep = nspFwk.getPropertyData(steps[step], [target, intentConfigArgs, pipelineContext]);
          logger.debug("Processing Step " + configStep.name);
          var instances = nspFwk.getPropertyData(configStep.instances, [target, intentConfigArgs, pipelineContext]);
          if (previousDeviceArgs && Object.keys(previousDeviceArgs).length > 0) {
            //if there is an old configuration it might have been modified and w might need to delete older instances
            var previousInstances = nspFwk.getPropertyData(configStep.instances, [target, previousDeviceArgs, pipelineContext]);
            logger.debug("Previous instances for step " + apUtils.protectSensitiveDataLog(previousInstances));
            var instancesToDelete = getInstancesToDelete(previousInstances, instances);
            var newIntentConfigArgs = intentConfigArgs;
            var desiredNeworkState = networkState;
            var currentParentInstance = pipelineContext.parentInstance;
            intentConfigArgs = previousDeviceArgs;
            for (var oldInstance in instancesToDelete) {
              networkState = "delete";
              if (!configStep.ignoreOnDelete) {
                if (configStep.steps) {
                  pipelineContext.parentInstance = instancesToDelete[oldInstance];
                  //delete instances in the child steps as well
                  PiplelineController(configStep.steps, previousDeviceArgs, deviceProcessor)();
                }
                deviceProcessor.processInstance(configStep, instancesToDelete[oldInstance]);
              }
            }
            pipelineContext.parentInstance = currentParentInstance;
            intentConfigArgs = newIntentConfigArgs;
            networkState = desiredNeworkState;
          }
          var prevParent = pipelineContext.parentStep;
          for (var instance in instances) {
            logger.debug("Processing Instance " + apUtils.protectSensitiveDataLog(instances[instance]));
            var processChildSteps = deviceProcessor.processInstance(configStep, instances[instance]);
            // If the processInstance returned false it means the current instance processing failed,
            // and therefore its children should not be processed.
            if (processChildSteps && configStep.steps) {
              pipelineContext.parentStep = (configStep.topology == false) ? prevParent : configStep.name;
              pipelineContext.parentInstance = instances[instance];
              PiplelineController(configStep.steps, previousDeviceArgs, deviceProcessor)();
            }
            pipelineContext.parentStep = prevParent;
          }
        }
      }
    }
  };

  /**
   * Compares the @param oldInstanceList with the @param newInstanceList and returns
   * the list of instances which are present in the oldInstanceList but not in the newInstanceList
   **/
  function getInstancesToDelete(oldInstanceList, newInstanceList) {
    var instancesToDelete = [];
    for (var oldInstance in oldInstanceList) {
      var present = false;
      for (var newInstance in newInstanceList) {
        if (oldInstanceList[oldInstance].name === newInstanceList[newInstance].name) {
          present = true;
          break;
        }
      }
      if (!present) {
        instancesToDelete.push(oldInstanceList[oldInstance]);
      }
    }
    return instancesToDelete;
  }

  /**
   * Prunes the extra annotations present in the attributes property of an FTL, and returns a key value pair
   **/
  function getConfigAttributes(configData, objectType, objectId) {
    var attributes = {};
    attributes=configData.attributes;
    if(objectType === "deployment"){
          var deployment = {} ;
          var targetsObject = {};
          var targets= [];
          var objectIdArr = objectId.split(",");
          if(objectIdArr.length == 3){
              deployment["deployment-action"] = "deploy";
              deployment["template-name"] = objectIdArr[0];
              //deployment["target"] = objectIdArr[1];
              //deployment["target-identifier-value"]=objectIdArr[2];
              targetsObject["target"] = objectIdArr[1];
              targetsObject["target-identifier-value"]=objectIdArr[2]; 
              targets.push(targetsObject);
              deployment["target-data"]=JSON.stringify(attributes);
              deployment["targets"] = targets;
              attributes=[deployment];
          }else{
            throw new RuntimeException("Object type deployment does not have 3 components in the identifier. The current identifier is "+objectId);
          }
      }
    return attributes;
  }

  /**
   * Fetches the templateFile to be used for the @param intentConfigStep and process the FTL
   * with the @param intentConfigArgs. The "networkState" attribute is also passed for FTL processing
   **/
  function getConfigurationData(target, intentConfigStep, instance, intentConfigArgs) {
    var templateResource = intentConfigStep.name + ".ftl";
    if (intentConfigStep.templateFile) {
      templateResource = nspFwk.getPropertyData(intentConfigStep.templateFile, [instance, target, intentConfigArgs, pipelineContext]);
    }
    var template = resourceProvider.getResource(templateResource);
    var rawTemplateArguments = {};

    if (intentConfigStep.instanceArguments) {
      rawTemplateArguments = nspFwk.getPropertyData(intentConfigStep.instanceArguments, [instance, target, intentConfigArgs, pipelineContext]);
      rawTemplateArguments["networkState"] = desiredNetworkState;
      rawTemplateArguments["target"] = target;
    }
    if(rawTemplateArguments.sendRequestToNsp != undefined){
        sendRequestToNsp= rawTemplateArguments.sendRequestToNsp;
    }
    Object.bindProperties(rawTemplateArguments, intentConfigArgs); //Append the intent configuration
    logger.debug("Proccessing FTL - " + templateResource + " with arguments - " + JSON.stringify(rawTemplateArguments));
    var processedTemplate = utilityService.processTemplate(template, rawTemplateArguments);
    return JSON.parse(processedTemplate);
  }
}

function moCreate(objectId, objectPath, objectType, requestBodyKey, attributes) {
  var httpOperation = 'post';
  var instanceUrl = baseUrl+ objectPath;
  var createAttributes = {};
  if(requestBodyKey =="deployment") {
    instanceUrl = baseUrlIcm;
    var deployObject={};
    deployObject["deployments"]=attributes;
    createAttributes["input"]= deployObject;
  } else {
    createAttributes[requestBodyKey] = attributes;
  }
  logger.debug("Create object: "+objectId+" instanceUrl: "+instanceUrl);
  createAttributes = JSON.stringify(createAttributes);
  logger.debug("Create createAttributes: "+createAttributes+" instanceUrl: "+instanceUrl);
  return executeRequest(instanceUrl, httpOperation, createAttributes);
}

function moMerge(objectId, objectPath, objectType, requestBodyKey, attributes) {
  var httpOperation;  
  if(objectType === "intent")  //IBSF case
     httpOperation = 'put';  
  else
     httpOperation = 'patch';
  //Adding double encoding here since NSP rest interface doesnt recognize this format 1/1/c6/1 when single encoded
  //var instanceUrl = baseUrl+ objectPath+ "/"+objectType+"="+encodeURIComponent(encodeURIComponent(objectId));
  var instanceUrl;
  if(objectType === "ftp-mediation:ftp"){
    instanceUrl = "/restconf/data/" + objectPath+ "/"+objectType+"="+encodeURIComponent(objectId).replace(/%2C/g,','); 
  } else {
    instanceUrl = baseUrl+ objectPath+ "/"+objectType+"="+encodeURIComponent(objectId).replace(/%2C/g,','); 
  }

  logger.debug("Update object: "+objectId+" instanceUrl: "+instanceUrl);
  var mergeAttributes = {};  
  var deployments =[];

if(requestBodyKey =="deployment") {
  instanceUrl = baseUrlForModification;
  var deployObject={};
  deployObject["deployments"]=attributes;
  mergeAttributes["input"]= deployObject;
  }else if(objectType === "createSoftwareRequest"){
    instanceUrl = "/restconf/data/nsp-lso-operation:lso-operations" + objectPath;
    mergeAttributes = attributes;
  }
  else{
    mergeAttributes[requestBodyKey] = attributes;
  }
  mergeAttributes = JSON.stringify(mergeAttributes);
  executeRequest(instanceUrl, httpOperation, mergeAttributes);
}

function moDelete(objectId, objectPath, objectType, isDirectDelete) {
  //Adding double encoding here since NSP rest interface doesnt recognize this format 1/1/c6/1 when single encoded
  var instanceUrl = baseUrl+ objectPath+ "/"+objectType+"="+encodeURIComponent(objectId).replace(/%2C/g,',');
  logger.debug("Delete object: "+objectId+" instanceUrl: "+instanceUrl);
  if (objectType === "intent") {  //IBSF case
    if (isDirectDelete) {
      instanceUrl = "/rest/nbi/api/restconf/data/nsp-service-intent:intent-base/intent=" + encodeURIComponent(objectId).replace(/%2C/g, ',');
    } else {
      moRemove(objectId, objectPath, objectType);
    }
  }
  executeRequest(instanceUrl, "delete");
}

function moRemove(objectId, objectPath, objectType) {
  var httpOperation = 'post';
  var instanceUrl;
  var createAttributes = {};
  var input= {};
  instanceUrl = baseUrl + "nsp-service-intent:change-olc-state";
  var objectIdArr = objectId.split(",");
  input["intent-type"]=objectIdArr[1];
  input["service-name"]=objectIdArr[0];
  input["target-state"]="removed";
  createAttributes["input"] = input;
  logger.debug("Remove object: "+objectId+" instanceUrl: "+instanceUrl);
  createAttributes = JSON.stringify(createAttributes);
  logger.debug("Remove createAttributes: "+createAttributes+" instanceUrl: "+instanceUrl);
  return executeRequest(instanceUrl, httpOperation, createAttributes);
}

function moGet(objectId, objectPath, objectType) {
  //Adding double encoding here since NSP rest interface doesnt recognize this format 1/1/c6/1 when single encoded
  //var instanceUrl = baseUrl+ objectPath+ "/"+objectType+"="+encodeURIComponent(encodeURIComponent(objectId));
  var instanceUrl = baseUrl+ objectPath+ "/"+objectType+"="+encodeURIComponent(objectId).replace(/%2C/g,',');
  logger.debug("Get object: "+objectId+" instanceUrl: "+instanceUrl);
  return executeRequest(instanceUrl, "get");
}

function moSave(objectId){
  var httpOperation = 'post';
  var instanceUrl;
  var createAttributes = {};
  var input= {};
  instanceUrl = baseUrl + "nsp-service-intent:change-olc-state";
  var objectIdArr = objectId.split(",");
  input["intent-type"]=objectIdArr[1];
  input["service-name"]=objectIdArr[0];
  input["target-state"]= "saved";
  createAttributes["input"] = input;
  createAttributes = JSON.stringify(createAttributes);
  return executeRequest(instanceUrl, httpOperation, createAttributes);
}

function moDeleteFromController(objectId){
  var httpOperation = 'post';
  var requestBody = {};
  var objectIdArr = objectId.split(",");
  var deployObject = {};
  deployObject["deployment"] = "/nsp-icm:icm/deployments/deployment[template-name='" + objectIdArr[0] + "'][target='" + objectIdArr[1] + "'][target-identifier-value='" + objectIdArr[2] + "']";
  var input = {};
  input["deployments"] = [];
  input["deployments"].push(deployObject);
  input["delete-option"] = "nsp";
  requestBody["input"] = input;
  requestBody = JSON.stringify(requestBody);
  return executeRequest(baseUrlForDeleteDeployments, httpOperation, requestBody);
}

function moAudit(objectId, objectPath, objectType, requestBodyKey, attributes) {
  var httpOperation = 'post';
  var instanceUrl;
  var input= {};
  if( objectType === "deployment" ) //ICM case
  {
    instanceUrl = baseUrl + objectPath + "/" + objectType + "=" + encodeURIComponent(objectId).replace(/%2C/g,',') + "/audit";
    var createAttributes = 'emptyPayload';
  }else if( objectType === "intent" ){  //IBSF case
    var createAttributes = {};
    instanceUrl = baseUrl + "nsp-service-intent:audit";
    var objectIdArr = objectId.split(",");
    input["intent-type"]=objectIdArr[1];
    input["service-name"]=objectIdArr[0];
    createAttributes["input"] = input;
    createAttributes = JSON.stringify(createAttributes);
  }

  logger.debug("Create object: "+objectId+" instanceUrl: "+instanceUrl);
  //createAttributes[requestBodyKey] = attributes;  
  logger.debug("Create createAttributes: "+createAttributes+" instanceUrl: "+instanceUrl);
  return executeRequest(instanceUrl, httpOperation, createAttributes);
}

function moPOST(objectId, objectPath, objectType, requestBodyKey, requestBody) {
  var httpOperation = 'post';
  var instanceUrl;
  var input= {};
  var createAttributes;
  if( objectType === "deployment" ) //ICM case
  {

    instanceUrl = baseUrl + objectPath + "/" + objectType + "=" + encodeURIComponent(objectId).replace(/%2C/g,',') + "/align-config";
   // instanceUrl = baseUrlIcm + objectPath + "/" + objectType + "=" + encodeURIComponent(objectId).replace(/%2C/g,',') + "/align-config";
    createAttributes= 'emptyPayload';
  }else if( objectType === "intent" ){  //IBSF case
    createAttributes = {};
    instanceUrl = baseUrl + "nsp-service-intent:synchronize";
     var objectIdArr = objectId.split(",");
     input["intent-type"]=objectIdArr[1];
     input["service-name"]=objectIdArr[0];
    createAttributes["input"] = input;
    createAttributes = JSON.stringify(createAttributes);
  } else if (objectType === "createFtpPolicy"){
    createAttributes = JSON.stringify(requestBody);
    instanceUrl = "/rest/nbi/api/mdm-necontrol-rest-api-app/api/v1/restconf/data/nsp-mediation:mediation-policy";
  }else if(objectType === "discoveryRule"){  //Post for discovery Rule
      createAttributes = {};
      var requestBodyKey = "nsp-ne-control:input";
      instanceUrl = baseUrlForDiscoveryRule;
      input["rule-names"]=[objectId];
      createAttributes[requestBodyKey] = input;
      createAttributes = JSON.stringify(createAttributes);
  }else if(objectType === "createSoftwareRequest" || objectType === "rollbackRequest"){  //Post for Create or rollback operation
    // createAttributes = JSON.stringify(requestBody);
    createAttributes = requestBody;
    instanceUrl = softwareUrl;
  }else if(objectType === "startSoftwareUpdate" || objectType === "prepareStartOperation"){  //Post for Start upgrade operation
    createAttributes = requestBody;
    instanceUrl = softwareUrl + objectPath; // restconf/data/nsp-lso-operation:lso-operations
  }else if(objectType === "rerunOperation"){  //Post for rerun operation
    createAttributes = JSON.stringify(requestBody);
    instanceUrl = softwareUrl + objectPath;
  } else { // objectType === "deviceAdministration"
    instanceUrl = baseUrl2 + "mdm-necontrol-rest-api-app/api/v1/neControl/discover/"+objectId+"/nes/";
    createAttributes = 'emptyPayload';
  }

  logger.debug("Create object: "+objectId+" instanceUrl: "+instanceUrl);
  //createAttributes[requestBodyKey] = attributes;  
  logger.debug("Create createAttributes: "+createAttributes+" instanceUrl: "+instanceUrl);
  return executeRequest(instanceUrl, httpOperation, createAttributes);
}

function moRetry(objectId, objectPath, objectType) {
  var httpOperation = "post";
  var url;
  var requestBody = {};
  if (objectType == "deployment") {
    url = baseUrlForRetry;
    var objectIdArr = objectId.split(",");
    var deployObject = {};
    deployObject["deployment"] = "/nsp-icm:icm/deployments/deployment[template-name='" + objectIdArr[0] + "'][target='" + objectIdArr[1] + "'][target-identifier-value='" + objectIdArr[2] + "']"
    var input = {};
    input["deployments"] = [];
    input["deployments"].push(deployObject);
    requestBody["input"] = input;
  }
  requestBody = JSON.stringify(requestBody);
  logger.debug("Retry object: " + objectId + " ### request body: " + requestBody + " ### url: " + url);
  return executeRequest(url, httpOperation, requestBody);
}

function moPUT(fdn, objectType, requestBody) {
  var httpOperation = 'put';
  var instanceUrl;
  var createAttributes = {};
  
  if(objectType === "discoveryruleFtp"){
    instanceUrl = baseUrl2 + "mdm-necontrol-rest-api-app/api/v1/neControl/discoveryrule/"+fdn;
    createAttributes = JSON.stringify(requestBody);
  } else {
    instanceUrl = baseUrl2 + "mdm-necontrol-rest-api-app/api/v1/neControl/discover/"+fdn+"/unmanage/";
  
    logger.debug("Create fdn: "+fdn+" instanceUrl: "+instanceUrl);
    createAttributes = JSON.stringify(createAttributes);
  }
  logger.debug("Create createAttributes: "+createAttributes+" instanceUrl: "+instanceUrl);
  return executeRequest(instanceUrl, httpOperation, createAttributes);
}

function moGET(ruleName, objectType, objectPath) {
  var httpOperation = 'get';
  var instanceUrl;
  var createAttributes = {};
  createAttributes = JSON.stringify(createAttributes);
  if(ruleName){
    instanceUrl = baseUrl2 + "mdm-necontrol-rest-api-app/api/v1/neControl/discoveryrule/"+ruleName;
    logger.debug("Create fdn: "+ruleName+" instanceUrl: "+instanceUrl);
    
  }else if(ruleName == null && objectType === "getOperationAvailable"){
    instanceUrl = softwareUrl + objectPath;
  } else if(objectType === "getFtpPolicies"){
    instanceUrl = baseUrl2 + "restconf/data/nsp-mediation:mediation-policy/ftp-mediation:ftp"
  }

  logger.debug("Create createAttributes: "+createAttributes+" instanceUrl: "+instanceUrl);
  return executeRequest(instanceUrl, httpOperation, createAttributes);
}

AltiplanoNSPMDMIntentHelper.prototype.discoverServices = function (deviceId, serviceName){
  var url = baseUrl + "nsp-service-intent:stitchservices";
  var requestBody = {};
  var input = {};
  input["service-type"] = "elan";
  input["algorithm"] = "service-name";
  input["service-name"] = serviceName;
  input["sites"] = [deviceId];
  requestBody["input"] = input;
  requestBody = JSON.stringify(requestBody);
  return executeRequest(url, "post", requestBody);
}

AltiplanoNSPMDMIntentHelper.prototype.associateToService = function(serviceName){
  var url = baseUrl + "nsp-service-intent:create-intent-from-services";
  var requestBody = {};
  var input = {};
  input["template-name"] = "vpls";
  input["service-ids"] = [serviceName];
  requestBody["input"] = input;
  requestBody = JSON.stringify(requestBody);
  return executeRequest(url, "post", requestBody);
}

AltiplanoNSPMDMIntentHelper.prototype.unAssociateToService = function(serviceName){
  var url = baseUrl2 + "restconf/operations/nsp-service-associate:unassociate";
  var requestBody = {};
  var input = {};
  input["template-name"] = "vpls";
  input["service-ids"] = [serviceName];
  requestBody["input"] = input;
  requestBody = JSON.stringify(requestBody);
  return executeRequest(url, "post", requestBody);
}

function executeRequest(requestUrl, restMethodName, requestBody, callback) {
logger.debug("Execreq was called with url "+requestUrl+" METHODNAME "+restMethodName+" reqbody "+requestBody);
  var result = {};
  if(!callback) {
    callback = restResultCallBack;
  }
  logger.debug("NSP IntentTypeFwk- executing {} method",restMethodName);
  if(restMethodName === 'post') {    
    restClient.post(requestUrl, "application/json", requestBody, "application/json", function(exception, httpStatus, response) {
      callback(exception, httpStatus, response, function(resultJson) {
        result = resultJson;
      });
    });
  } else if(restMethodName === 'put'){
    restClient.put(requestUrl, "application/json", requestBody, "application/json", function(exception, httpStatus, response) {
      callback(exception, httpStatus, response, function(resultJson) {
        result = resultJson;
      });
    });
  }else if(restMethodName === 'patch'){
       restClient.patch(requestUrl, "application/json", requestBody, "application/json", function(exception, httpStatus, response) {
          if (exception) {
            logger.error("Couldn't connect to Manager of Device: "+response);
            throw exception;
          }          
          if (httpStatus >= 400 && httpStatus !== 404) {
            logger.debug(" Request Failed with status code: "+httpStatus+" exception: "+exception+" response: "+response);
            throw new RuntimeException(response);
          }
       });
   } else if(restMethodName === 'get'){
        restClient.get(requestUrl, "application/json", function(exception, httpStatus, response) {
          if (httpStatus === 404 || httpStatus === 401) {
            return null;
          } 
          else {
          callback(exception, httpStatus, response, function(resultJson) {
            result = resultJson;
          });
}
        });
  } else {
    restClient.delete(requestUrl, "application/json", function(exception, httpStatus, response) {
      if (exception) {        
        throw exception;
      }
      if (httpStatus >= 400) {
        logger.error("Request Failed with status code: "+httpStatus+" exception: "+exception+" response: "+response);
        throw new RuntimeException(response);
      }
    });
  }
  logger.debug("NSP IntentTypeFwk- requestResponse received for {} method",restMethodName)
  return result;
}

function restResultCallBack(exception, httpStatus, response, resultCallBack) {
logger.debug("NSP IntentTypeFwk- requestResponse received "+httpStatus+"response "+response+"result callback"+resultCallBack);
  if (exception) {
    logger.error("Couldn't connect to Manager of Device: "+exception);
    throw exception;
  } else if (httpStatus >= 400) {
    logger.error("Request Failed with status code: "+httpStatus+" exception: "+exception+" response: "+response);
    if(httpStatus = 405 && response && JSON.stringify(response).indexOf("operation-not-supported") != -1 && (JSON.stringify(response).indexOf("No yang object present for") != -1 || JSON.stringify(response).indexOf("Start action can only be triggered on execution with status Not-Started") != -1)){
      var json = JSON.parse(response);
      resultCallBack(json);
    } else {
      throw new RuntimeException(response);
    }
  } else if(response){
    var json = JSON.parse(response);
    logger.debug("executeRequest - Result: " + response);

    resultCallBack(json);
  }
}

AltiplanoNSPMDMIntentHelper.prototype.getExistingIntents = function (targets, intentName, splitKey) {
  var targetKeys = Object.keys(targets);
  var targetList = [];
  targetKeys.forEach(function (key) { 
    targetList.push(targets[key]);
  });
  var existingNameList = [];
  for (var key = 0; key < Object.keys(targetList).length; key++) {
    if (targetList[key].startsWith(intentName)){
      var existingNameSplit = targetList[key].split("#")[1].split(splitKey);
      var existingNameLastValue = existingNameSplit[existingNameSplit.length - 1];
      existingNameList.push(existingNameLastValue);
    }
  }
  if (existingNameList.length > 0) {
    var sortedList = existingNameList.sort(function(a, b){return b-a});
    var highestValue = sortedList[0];
    var currentValue = parseInt(highestValue) + 1;
    return currentValue;
  } else {
    return 1;
  }
}

AltiplanoNSPMDMIntentHelper.prototype.triggerWorkflowForLoopbackAction = function (createAttributes, deviceName) {
  createDecoratedNSPProxy(this, deviceName, null);
  var httpOperation = 'post';
  var response = executeRequest(workflowUrl, httpOperation, createAttributes);
  return response;
}

AltiplanoNSPMDMIntentHelper.prototype.isDeviceDiscoveredInMDS = function(deviceName){
  try {
    apUtils.getManagerInfo(deviceName);
  }
  catch(e){
    return false;
  }
  return true;
}

AltiplanoNSPMDMIntentHelper.prototype.isIxrDeviceAndNotDiscoveredInMDS = function(deviceName){
  var nodeType;
  try {
      nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
  } catch(e) {
      return false;
  }
  if (nodeType && nodeType.startsWith(intentConstants.FAMILY_TYPE_IXR) && !this.isDeviceDiscoveredInMDS(deviceName)) {
      return true;
  }
  return false;
}

AltiplanoNSPMDMIntentHelper.prototype.getActualSoftwareVersion = function (deviceName, neId) {
  createDecoratedNSPProxy(this, deviceName, null);
  var httpOperation = 'get';
  var requestUrl = "rest/nbi/api/restconf/data/nsp-equipment:network/network-element="+ neId + "?depth=2"
  var response = executeRequest(requestUrl, httpOperation);
  return response;
}

AltiplanoNSPMDMIntentHelper.prototype.getOperation = function (deviceName, neId, targetSoftware) {
  createDecoratedNSPProxy(this, deviceName, null);
  var httpOperation = 'get';
  var requestUrl = "/rest/nbi/api/restconf/data/nsp-lso-operation:lso-operations/operation=ap-ne-upgrade-with-phases," + deviceName + "_" + targetSoftware;
  var response = executeRequest(requestUrl, httpOperation);
  return response;
}

AltiplanoNSPMDMIntentHelper.prototype.deleteSoftwareOperation = function (deviceName, objectPath) {
  createDecoratedNSPProxy(this, deviceName, null);
  var httpOperation = 'delete';
  var requestUrl = softwareUrl + objectPath;
  return executeRequest(requestUrl, httpOperation);
}

AltiplanoNSPMDMIntentHelper.prototype.rerunSoftwareUpdateOperation = function (deviceName, neId, targetSoftware, phaseName) {
  createDecoratedNSPProxy(this, deviceName, null);
  var httpOperation = 'post';
  var requestUrl = "rest/nbi/api/restconf/data/nsp-lso-operation:lso-operations/operation=ap-ne-upgrade-with-phases,"+ deviceName + "_" + targetSoftware +"/phase="+phaseName+"/rerun-execution";
  var excutionName = deviceName + "_" + phaseName;
  var createAttributes = {
          "input" :
          {
              "executions":[
                  excutionName
              ]
          }
      }
  var response = executeRequest(requestUrl, httpOperation, JSON.stringify(createAttributes));
  return response;
}

AltiplanoNSPMDMIntentHelper.prototype.getEfmOamState = function (deviceName, neId, portId) {
  createDecoratedNSPProxy(this, deviceName, null);
  var httpOperation = 'get';
  var requestUrl = "rest/nbi/api/restconf/data/network-device-mgr:network-devices/network-device=" + neId + "/root/nokia-state:/state/port=" + portId + "/ethernet"
  var response = executeRequest(requestUrl, httpOperation);
  return response;
}

AltiplanoNSPMDMIntentHelper.prototype.deleteDiscoveryRule = function (ipAddress, managerName) {
  createDecoratedNSPProxy(this, null, managerName);
  var httpOperation = 'delete';
  var requestUrl = baseUrl + "nsp-ne-control:ne-control/discovery-rule=ixr-discovery-rule_" + ipAddress
  var response = executeRequest(requestUrl, httpOperation);
  return response;
}