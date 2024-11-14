/**
* (c) 2020 Nokia. All Rights Reserved.
*
* INTERNAL - DO NOT COPY / EDIT
**/
// Globals
var baseUrl = "/nfm-p/rest/api/v1/managedobjects/";
var PORT_TYPE = {"CONNECTOR": 0, "DIRECT": 2};

/*
 * Constructor Function. We'll attach more property and methods by updating "prototype" object.
 */
function AltiplanoNSPIntentHelper() {
  this.self = this;
  this.intentTypeObject = null;
  this.prefixToNsMap = new HashMap();
  this.prefixToNsMap.put("ibn", "http://www.nokia.com/management-solutions/ibn");
  this.prefixToNsMap.put("nc", "urn:ietf:params:xml:ns:netconf:base:1.0");
  this.prefixToNsMap.put("mds", "http://www.nokia.com/management-solutions/manager-directory-service");
}

AltiplanoNSPIntentHelper.prototype.setIntentObject = function (intentObjectIncoming) {
  this.intentTypeObject = intentObjectIncoming;
}

AltiplanoNSPIntentHelper.prototype.validate = function (syncInput) {
  var target = syncInput.getTarget();
  var callbackFun = this.intentTypeObject.validate;
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

AltiplanoNSPIntentHelper.prototype.synchronize = function (syncInput) {
  logger.debug("Synchronizing intent with " + apUtils.protectSensitiveDataLog(syncInput));
  var pipelineContext = {};
  pipelineContext["operation"] = "sync";
  var target = syncInput.getTarget();
  var intentConfigXml = syncInput.getIntentConfiguration();
  var networkState = syncInput.getNetworkState().name();
  var intentConfigArgs = apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.intentTypeObject.getKeyForList);
  var devices = this.intentTypeObject.getDeviceIds;
  var topology = syncInput.getCurrentTopology();
  var deviceXtraInfo = this.getDeviceXtrargs(target, topology, intentConfigArgs, pipelineContext);
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
    logger.debug("Dependency Info:::" + JSON.stringify(dependencyInfo));
    syncResult.getTopology().setDependencyInfo(this.getTransformedDependencyInfo(dependencyInfo));
  }
  var dependentsImpacted = this.isDependencyUpdated(target, topology, intentConfigArgs, deviceXtraInfo);
  logger.debug("Dependency Arguments updated???" + dependentsImpacted);
  syncResult.setUpdateDependents(dependentsImpacted);
  logger.debug("Synchronization of intent completed with result " + syncResult.isSuccess());
  return syncResult;
}

AltiplanoNSPIntentHelper.prototype.executeAggregateRequest = function(managerName, inputAggregateRequest) {
  // The aggregate request not supported in NSP fwk so no action required here
};

AltiplanoNSPIntentHelper.prototype.finalize = function(input, networkState, result, intentObject) {
  //The aggregate request not supported in NSP fwk so simply return the result.
  return result;
};

AltiplanoNSPIntentHelper.prototype.audit = function (auditInput) {
  logger.debug("Auditing intent with " + apUtils.protectSensitiveDataLog(auditInput));
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

AltiplanoNSPIntentHelper.prototype.getTopologyExtraInfoByTopology = function (topology) {
  return apUtils.getTopologyExtraInfo(topology);
}

AltiplanoNSPIntentHelper.prototype.getTransformedDependencyInfo = function (dependencyObject) {
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

AltiplanoNSPIntentHelper.prototype.isDependencyUpdated = function (target, topology, intentConfigArgs, deviceXtraInfo) {
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

AltiplanoNSPIntentHelper.prototype.getDeviceIds = function (target, intentConfigArgs, pipelinecontext) {
  var devicesConfig = this.getPropertyData(this.intentTypeObject.getDeviceIds, [target, intentConfigArgs, pipelinecontext]);
  var deviceId = Object.keys(devicesConfig);
  return deviceId
}

AltiplanoNSPIntentHelper.prototype.getDeviceXtrargs = function (target, topology, intentConfigArgs, pipelinecontext) {
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

AltiplanoNSPIntentHelper.prototype.wrapErrorHandler = function (object, className) {
  for (var fn in object) {
    if (typeof object[fn] === "function") {
      object[fn] = this.wrapErrorHandlerFn(object, object[fn], className + "." + fn)
    }
  }
  return object;
}

AltiplanoNSPIntentHelper.prototype.wrapErrorHandlerFn = function (object, fn, fnName) {
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

AltiplanoNSPIntentHelper.prototype.parseErrorMessage = function (error) {
  do{
    error = error.getCause()
  }while(error && error.getCause())
  return error;
}

AltiplanoNSPIntentHelper.prototype.translateMessage = function (message, args) {
  if (Object.keys(args).length == 0) {
    return message;
  }
  var argKeys = Object.keys(args);
  for (var argKey in argKeys) {
    message = message.replace("{{" + argKeys[argKey] + "}}", JSON.stringify(args[argKeys[argKey]]));
  }
  return message;
}

AltiplanoNSPIntentHelper.prototype.getKeyMessage = function (key) {
  var condition = new HashMap();
  condition.put("field", key.replace(/\./g, "#"));
  condition.put("locale", "en");
  var translationByConditions = translationService.getTranslationByConditions(condition);
  if (translationByConditions != null && translationByConditions.size() > 0) {
    return translationByConditions.get(0).getTranslation();
  }
  return key;
}

AltiplanoNSPIntentHelper.prototype.isDifferent = function (oldObject, currentObject) {
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

AltiplanoNSPIntentHelper.prototype.isArrayEquals = function (array, withArray) {
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

AltiplanoNSPIntentHelper.prototype.getPropertyData = function (data, args) {
  if (typeof data === 'function') {
    return data.apply(data, args);
  }
  return data;
}

AltiplanoNSPIntentHelper.prototype.getSiteIdFromDeviceId = function(deviceId) {
  return deviceId.substring(deviceId.indexOf("(") + 1, deviceId.indexOf(")"));
}

AltiplanoNSPIntentHelper.prototype.getDeviceIdFromSiteId = function(siteId) {
  var siteName;
  restClient.get(baseUrl + "network:".concat(siteId), "application/json", function(exception, httpStatus, response) {
    siteName = httpStatus === 200 ? JSON.parse(response).siteName : "";
  });
  return siteName? siteName.concat("(",siteId,")"):siteName;
}

AltiplanoNSPIntentHelper.prototype.waitTillDeviceReachable = function(managerName,siteId, queryInterval, maxRetries){
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
  logger.info("Devdebug maxRetries {}", maxRetries);
  deviceName = this.getDeviceIdFromSiteId(siteId);
  return deviceName;
}

AltiplanoNSPIntentHelper.prototype.checkDeviceReachability = function(managerName,siteId){
  var deviceName;
  deviceName = this.waitTillDeviceReachable(managerName,siteId)
  if(!deviceName)
    throw new RuntimeException("Device not discovered in NSP")
  try {
    apUtils.getManagerInfo(deviceName)
  }
  catch(e){
    throw new RuntimeException("Device not available in "+managerName)
  }
  return deviceName;
}

AltiplanoNSPIntentHelper.prototype.getNSPObjectValue = function(objectId,argName){
  var value;
  restClient.get(baseUrl.concat(objectId), "application/json", function(exception, httpStatus, response) {
    value = httpStatus === 200 ? JSON.parse(response)[argName] : "";
  });
  return value;
}

AltiplanoNSPIntentHelper.prototype.getPortDnFromDeviceAndPortId = function(deviceId, portId) {
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

AltiplanoNSPIntentHelper.prototype.getPortType = function(portId){
  var parts = this.getPortIdsSplit(portId);
  if (parts.length === 3) {
    return PORT_TYPE.DIRECT;
  } else if (parts.length === 4) {
    return PORT_TYPE.CONNECTOR;
  }
}

AltiplanoNSPIntentHelper.prototype.getPortIdsSplit = function(portId) {
  var firstIndex= portId.indexOf("-");
  var idStr = portId.substr(firstIndex+1);
  var ids = idStr.split("-");
  return ids;
}

AltiplanoNSPIntentHelper.prototype.getCardIdFromPortId = this.getPortNumber = function(portId) {
  return this.getPortIdsSplit(portId)[0];
}

AltiplanoNSPIntentHelper.prototype.getDaughterCardIdFromPortId = function(portId) {
  return this.getPortIdsSplit(portId)[1];
}

AltiplanoNSPIntentHelper.prototype.getConnIdFromPortId = function(portId) {
  return this.getPortIdsSplit(portId)[2].substr(1);
}

AltiplanoNSPIntentHelper.prototype.getPortNoFromPortID = function(portId) {
  return this.getPortIdsSplit(portId)[3];
}

AltiplanoNSPIntentHelper.prototype.waitForObject = function(device, objectType, filter, queryInterval, maxRetries) {
  var created;
  if (!queryInterval) {
    queryInterval = 1000;
  }
  if (!maxRetries) {
    maxRetries = 10;
  }

  var deviceProxy = createDecoratedNSPProxy(this, device, null);
  while (!deviceProxy.getObjectByType(device, objectType, ["objectFullName"], filter).length && maxRetries--) {
    java.lang.Thread.sleep(queryInterval);
  }
}

AltiplanoNSPIntentHelper.prototype.getLagDnFromDeviceIdAndId = function (deviceId, id) {
  return "network:" + this.getSiteIdFromDeviceId(deviceId) + ":lag:interface-" + id;
}

AltiplanoNSPIntentHelper.prototype.getDiscoveryRuleDnFromId = function (id) {
  return "network:topology:tdr-".concat(id);
}

AltiplanoNSPIntentHelper.prototype.getPortNameFromPortId = function(portId) {
  var portName = this.getCardIdFromPortId(portId) + "/" + this.getDaughterCardIdFromPortId(portId);
  if (this.getPortType(portId) === PORT_TYPE.CONNECTOR) {
    portName = portName + "/c" + this.getConnIdFromPortId(portId) + "/" + this.getPortNoFromPortID(portId);
  } else {
    portName = portName + "/" + this.getPortIdsSplit(portId)[2];
  }
  return portName;
}


AltiplanoNSPIntentHelper.prototype.getPorts = function(deviceId) {
  var deviceProxy = createDecoratedNSPProxy(this, deviceId, null);
  var requiredProperties = ["objectFullName", "displayedName"];
  var portIds = [];
  deviceProxy.searchObjectByType(deviceId, "equipment.PhysicalPort", requiredProperties, true, undefined, function (searchResults) {
    logger.debug("SearchResults Intent - "+JSON.stringify(searchResults));
    searchResults.forEach(function(result) {
      portIds.push(getPortIdFromPortDisplayName(result["displayedName"]));
    });
  });
  return portIds;
}

var getPortIdFromPortDisplayName = function(displayName){
  return "PORT-" +(displayName.substr(5).split("/")).join("-");
}

AltiplanoNSPIntentHelper.prototype.getPortSpeed = function(deviceId, portIds) {
  var deviceProxy = createDecoratedNSPProxy(this, deviceId, null);
  var requiredProperties = ["displayedName", "actualSpeed"]
  var portSpeeds = {};
  deviceProxy.searchObjectByType(deviceId, "equipment.PhysicalPort", requiredProperties, true, undefined, function (searchResults) {
    searchResults.forEach(function(portConfig){
      var portId = getPortIdFromPortDisplayName(portConfig["displayedName"]);
      if(portIds.indexOf(portId) !== -1){
        portSpeeds[portId] = portConfig["actualSpeed"];
        logger.debug("Speed is : "+portConfig["actualSpeed"]);
      }
    });
  });
  return portSpeeds;
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

NSPProxy.prototype.create = function(fdn, fullClassName, attributes) {
  logger.debug("Creating "+fullClassName+" with fdn "+ fdn + " attributes "+JSON.stringify(attributes));
  return moCreate(fdn, fullClassName, attributes);
};

/**
 *
 * @param objectId
 * @returns {boolean} returns tru when httpStatus is 200 &
 * false when httpStatus is 404
 */
NSPProxy.prototype.isObjectExist = function(objectId){
  var isExists = false;
  restClient.get(baseUrl.concat(objectId), "application/json", function(exception, httpStatus, response) {
    logger.debug("Retrieved response for objectId: ".concat(objectId, " {} "+JSON.stringify(response)));
    isExists = httpStatus === 200 ? true : false;
  });
  return isExists;
}

/**
 * @param Device ID to check it's status
 * * @param fullClassName Classname  of the Object
 * @param requiredProperties Attributes to be send with the REST body
 * @param filterExpression Additional attributes used to prune the REST response received
 * **/
NSPProxy.prototype.getObjectByType = function(deviceId, fullClassName, requiredProperties, filterExpression) {
  var searchOutput = {};
  if (!filterExpression) {
    filterExpression = fullClassName;
  }
  this.searchObjectByType(deviceId, fullClassName, requiredProperties, true, filterExpression, function (searchResults) {
    searchOutput = searchResults;
  });
  return searchOutput;
}

NSPProxy.prototype.searchObjectByType = function (deviceName, objectType, filterProperties, searchInNE, searchFilter, resultCallBack) {
  logger.debug("Searching with deviceName " + deviceName + " objectType " + objectType + " filterProp " + filterProperties + " searchInNE " + searchInNE + " searchFilter " + searchFilter + " resultCallBack " + resultCallBack);
  var searchUrl = "/nfm-p/rest/api/v1/managedobjects/searchWithFilter";
  var requestBody = {
    "fullClassName": objectType,
    "resultFilter": filterProperties
  };

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

  logger.debug("searchObjectByType called with requestBody: {}", requestBody);

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

/**
 * @param Object identifier e.g., network:<DEVICE_IP>:lag:interface-1
 * @param fullClassName Classname  of the Object
 * @param attributes Attributes to be used while updating the Object
 * **/
NSPProxy.prototype.update = function(objectId, fullClassName, attributes) {
  logger.debug("Updating "+objectId+" with attributes "+JSON.stringify(attributes));
  moMerge(objectId, fullClassName, attributes);
};

/**
 * @param Object identifier used to uniquely identify it, e.g., network:<DEVICE_IP>:lag:interface-1
 *
 * **/
NSPProxy.prototype.delete = function (objectId) {
  logger.debug("Deleting "+objectId);
  moDelete(objectId);
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
    } else if(managerInfo.getType().toString() === intentConstants.MANAGER_TYPE_NSP_NFMP) {
      var nspProxy = proxyService.getNSPProxy(managerInfo);
      restClient = nspProxy.getRestClient();
    }
  }

NSPProxy.prototype.getRestClientWithManagerName = function (managerName) {
	var managerInfo = mds.getManagerByName(managerName);
    this.setNewRestClient(managerInfo);
}


////// Pipeline Processor (Uses lot of Closures without updating Protype. FIXME.)

/**
 * The main function which runs the pipeline and builds results for synchronize and audit operations
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
      var configData = getConfigurationData(target, step, instance, intentConfigArgs);
      var objectId = configData.identifier;
      var fullClassName = configData.fullClassName;
      var filter = configData.filter;
      var flipReport = configData.flipReport;
      if (configData.audit === "false") {
        logger.debug("Skipping audit for " + objectId);
        return true;
      }
      var attributeValues = getAuditableAttributes(configData);
      var attributes = Object.keys(attributeValues);
      logger.debug("Auditing Object " + objectId + " with attributes " + apUtils.protectSensitiveDataLog(attributes));
      var auditResult = auditor(objectId, fullClassName, filter, attributeValues, flipReport);
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
       }
       addMisalignedAttributesToReport(auditResult.misAlignedAttributes);
       return true;
    };

    function addMisalignedAttributesToReport(misalignedAttributes) {
            	if (misalignedAttributes) {
                    for (var misalignedAttr in misalignedAttributes) {
                        var attrResult = misalignedAttributes[misalignedAttr];
                        if (attrResult.expectedValue && attrResult.actualValue) {
                        	report.addMisAlignedAttribute(auditFactory.createMisAlignedAttribute(attrResult.name, attrResult.expectedValue, attrResult.actualValue, attrResult.deviceName));
                        } else if (attrResult.expectedValue && !attrResult.actualValue) {
                        	report.addMisAlignedAttribute(auditFactory.createMisAlignedAttribute(attrResult.name, "Configured", "Not configured", attrResult.deviceName));
                        } else if (!attrResult.expectedValue && attrResult.actualValue) {
                        	report.addMisAlignedAttribute(auditFactory.createMisAlignedAttribute(attrResult.name, "Not configured", "Configured", attrResult.deviceName));
                        }
                    }
                }
            }

    function getAuditableAttributes(configData) {
      var attributes = {};
      for (var attributeIdx in configData.attributes) {
        var auditable = configData.attributes[attributeIdx].audit
        if (auditable == undefined || auditable === "true") {
          var attribute = configData.attributes[attributeIdx];
          attributes[attribute['name']] = attribute['value'];
        }
      }
      return attributes;
    }

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
     return function (objectId, fullClassName, filter, expectedAttributesAndValues, flipReport) {
                logger.debug("Auditing Object " + objectId + " with expected attribute values :" + apUtils.protectSensitiveDataLog(expectedAttributesAndValues));
                var isConfigured = false;
                var misAlignedAttributes = {};
                var attributes = Object.keys(expectedAttributesAndValues);
                var searchObject = {};

                if (attributes) {
                	attributes.push("objectFullName");
                	searchObject = deviceProxy.getObjectByType(objectId, fullClassName, attributes, filter);
                	attributes = Object.keys(expectedAttributesAndValues);
                }

                if (Object.keys(searchObject).length !== 0) {
                	var actualValues = {};
                	for(var j = 0; j < searchObject.length; j++) {
                    	actualValues = searchObject[j];
                        if (actualValues.objectFullName === objectId) {
                        	isConfigured = true;
                        	break;
                        }
                	}
                	if (isConfigured) {
                      isConfigured = (networkState === "delete") ? false : true;
                	} else { //object does not exist
                      isConfigured = (networkState === "delete") ? true : false;
                	}

                	if ((isConfigured && networkState !== "delete") || (!isConfigured && networkState === "delete" && flipReport)) {//audit attributes
                        misAlignedAttributes = auditObjectAttributes(objectId, attributes, expectedAttributesAndValues, actualValues);
                    }
                } else { //object does not exist
                    isConfigured = (networkState === "delete") ? true : false;
                }
                logger.debug("Is Configured: "+isConfigured+" & MisalignedAttributes: "+JSON.stringify(misAlignedAttributes));
                return {configured: isConfigured, misAlignedAttributes: misAlignedAttributes};
    };

     function auditObjectAttributes(objectId, attributes, expectedValues, actualValues) {
        var misAlignedAttributes = [];
        if (Object.keys(attributes).length <= 0) {
            return misAlignedAttributes;
        }
        for (var attribute in attributes) {
            var actualValue = actualValues[attributes[attribute]] == null ? "" : actualValues[attributes[attribute]];
            logger.debug("Comparing expected "+expectedValues[attributes[attribute]]+" actual: "+actualValue);
            var expectedValue = expectedValues[attributes[attribute]];
            if (nspFwk.isDifferent(expectedValue, actualValue)) {
                var misAlignedAttribute = {};
                misAlignedAttribute.deviceName = objectId;
                misAlignedAttribute.name = attributes[attribute];
                misAlignedAttribute.expectedValue = expectedValues[attributes[attribute]];
                misAlignedAttribute.actualValue = actualValue;
                misAlignedAttributes.push(misAlignedAttribute);
            }
        }
        return misAlignedAttributes;
    }
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
    logger.debug("Result topology " + apUtils.protectSensitiveDataLog(topology));
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
      var fdn = configData.fdn;
      var filter = configData.filter;
      if (networkState != "delete") {
        attributeValues = getConfigAttributes(configData);
      }
      if (objectId) {
	                logger.debug("Auditing Object " + objectId + " with attributes " + apUtils.protectSensitiveDataLog(attributeValues));
	                var auditResult = auditor(objectId, fullClassName, filter, attributeValues);
	                logger.debug("Audit Result for object " + objectId + " = " + JSON.stringify(auditResult));
	                try {
                		if (auditResult.configured) {
	                        if (auditResult.misAlignedAttributes.length > 0) {
	                            var attributesToUpdate = getAttributesToUpdate(auditResult.misAlignedAttributes);
	                            deviceProxy.update(objectId, fullClassName, attributesToUpdate);
	                        }
	                    } else {
	                    	if (networkState === "delete") {
	                            if (step.deleteOperation) {
	                                step.deleteOperation.apply(step, [objectId, intentConfigArgs, pipelineContext]);
	                            } else {
	                                deviceProxy.delete(objectId);
	                            }
	                        } else {
	                        	if (!fdn) {
	                        		fdn = objectId;
	                        	}
	                        	var json = deviceProxy.create(fdn, fullClassName, attributeValues);
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
                	if (networkState !== "delete" && fdn && filter) {
                		var json = deviceProxy.create(fdn, fullClassName, attributeValues);
                		var objectFullName = json.objectFullName;
      				  	var siteId = nspFwk.getSiteIdFromDeviceId(deviceIdValue);
      				  	if (objectFullName && objectFullName.indexOf(siteId) !== -1) {
      					  objectId = objectFullName;
      				  	}
      				  	pipelineContext.result[step.name] = json;
                	}
         }

        if (networkState != "delete") {
            var buildTopo = step.topology === undefined || step.topology;
            if (buildTopo && objectId) {
                    	var topologyObjectsFromConfigData = configData.topologyObjects;
                    	var side = step.topologySide || "TRAFFIC";
                    	logger.debug("Building Topology of "+step.name+" "+instance.name+" for device: "+deviceIdValue);
                    	if (topologyObjectsFromConfigData) {
                    		pipelineContext.topoFromConfig = true;
                    		var objectType = configData.objectType;
	                        if (!objectType) {
	                        	objectType = fullClassName;
	                        }
	                        var topoObjectId = objectId;
                            if (configData.topoObjectId) {
                                topoObjectId = configData.topoObjectId;
                            }
                    		var lastTopoNode, lastTopoNodeObjectId;
                    		var topologyObj = getTopologyObjectId(deviceIdValue, objectType, topoObjectId);

	                        logger.debug("Updating topology with objectType " + topologyObj.objectType + " with id " + topologyObj.topoObjectId);
                            var prevVertex = getPreviousTopoVertex(pipelineContext,instance);
                            var topoRoot = prevVertex? topologyFactory.createTopologyObjectWithVertex(topologyObj.objectType, topologyObj.topoObjectId, side, prevVertex) :
                                           topologyFactory.createTopologyObjectFrom(topologyObj.objectType, topologyObj.topoObjectId, side);
	                        pipelineContext.topologyObjects.push(topoRoot);
	                        if (!pipelineContext.topology[deviceIdValue].step[step.name]) {
	                            pipelineContext.topology[deviceIdValue].step[step.name] = {};
	                        }
	                        lastTopoNode = topoRoot;
	                        lastTopoNodeObjectId = deviceIdValue + ":" + lastTopoNode.getObjectRelativeObjectID();
	                        if(pipelineContext.prevTopoStep && pipelineContext.prevTopoStep !== step.name) {
	                        	pipelineContext.topology[deviceIdValue].step[step.name][instance.name] =
	                    		{id:lastTopoNodeObjectId, deviceId: deviceIdValue, prevStep: pipelineContext.prevTopoStep, side: side};
	                        }

                    		for each(topoObjectFromConfig in topologyObjectsFromConfigData) {
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
                    					topoRoot.setObjectPreviousVertexObjectIDs(lastTopoNodeObjectId);
                    				}
                    			}
                    			logger.debug("Topo Root: "+topoRoot);
                    			pipelineContext.topologyObjects.push(topoRoot);
    	                        lastTopoNode = topoRoot;
    	                        lastTopoNodeObjectId = deviceIdValue + ":" + lastTopoNode.getObjectRelativeObjectID();
                    		}

                    		if(!pipelineContext.prevTopoStep) {
	                        	pipelineContext.topology[deviceIdValue].step[step.name][instance.name] =
	                    		{id:lastTopoNodeObjectId, deviceId: deviceIdValue, side: side};
	                        }
                    	}
                    	else {
	                    	var objectType = configData.objectType;
	                        if (!objectType) {
	                        	objectType = fullClassName;
	                        }
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
        if (pipelineContext.prevTopoStep && pipelineContext.prevTopoStep !== pipelineContext.topology[deviceIdValue].step.name) {
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

    function getAttributesToUpdate(misAlignedAttributes) {
      var updatedAttributes = {};
      for (var misAlignedAttribute in misAlignedAttributes) {
        updatedAttributes[misAlignedAttributes[misAlignedAttribute].name] = misAlignedAttributes[misAlignedAttribute].expectedValue;
      }
      return updatedAttributes;
    }

    function getTopologyObjectId(deviceId, objectType, objectId) {
        var nspClass = "nsp#class=";
        var dnString = "#dn=";
        /**
         * objectId format is
         * <device-id>:nsp#class=<object-type>#dn=<object-dn>
         * Eg:
         * NT-2(92.168.150.101):nsp#class=lag.Interface#dn=network:92.168.150.101:lag:interface-101
         */

         var topoId = deviceId + ":" + nspClass + objectType + dnString + objectId;
         return {
            objectType: objectType,
            topoObjectId: topoId
         }
    }
    true
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
  function getConfigAttributes(configData) {
    logger.debug("getConfigAttributes->configData ={}", JSON.stringify(configData));
    var attributes = {};
    var attributeIdx;
    for (attributeIdx in configData.attributes) {
      var attribute = configData.attributes[attributeIdx];
      attributes[attribute['name']] = attribute['value'];
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
    Object.bindProperties(rawTemplateArguments, intentConfigArgs); //Append the intent configuration
    logger.debug("Proccessing FTL - " + templateResource + " with arguments - " + JSON.stringify(rawTemplateArguments));
    var processedTemplate = utilityService.processTemplate(template, rawTemplateArguments);
    return JSON.parse(processedTemplate);
  }
}

function moCreate(fdn, fullClassName, attributes) {
  var httpOperation = 'post';
  var createAttributes = {};
  logger.debug("moCreate attributes= {}", attributes);
  createAttributes.fdn = fdn;
  createAttributes.configInfo = {};
  createAttributes.configInfo.fullClassName = fullClassName;
  createAttributes.configInfo.properties = attributes;
  createAttributes = JSON.stringify(createAttributes);
  logger.debug("moCreate = {}", createAttributes);
  return executeRequest(baseUrl, httpOperation, createAttributes);
}

function moMerge(objectDn, fullClassName, attributes) {
  var httpOperation = 'put';
  //Adding double encoding here since NSP rest interface doesnt recognize this format 1/1/c6/1 when single encoded
  var instanceUrl = baseUrl+encodeURIComponent(encodeURIComponent(objectDn));
  var mergeAttributes = {};
  mergeAttributes.fullClassName = fullClassName;
  mergeAttributes.properties = attributes;
  mergeAttributes = JSON.stringify(mergeAttributes);
  executeRequest(instanceUrl, httpOperation, mergeAttributes);
}

function moDelete(objectDn) {
  //Adding double encoding here since NSP rest interface doesnt recognize this format 1/1/c6/1 when single encoded
  var instanceUrl = baseUrl+ encodeURIComponent(encodeURIComponent(objectDn));
  logger.debug("Delete object: "+objectDn+" baseUrl: "+instanceUrl);
  executeRequest(instanceUrl, "delete");
}

function executeRequest(requestUrl, restMethodName, requestBody, callback) {
  var result = {};
  if(!callback) {
    callback = restResultCallBack;
  }
  logger.debug("NSP IntentTypeFwk- executing {} method",restMethodName);
  logger.debug("NSP IntentTypeFwk- executing {} method with requestBody={}",restMethodName, requestBody);

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
  } else {
    restClient.delete(requestUrl, "application/json", function(exception, httpStatus, response) {
      if (exception) {
        logger.error("Couldn't connect to Manager of Device: ");
        throw exception;
      }
      if (httpStatus >= 400 && httpStatus !== 404) {
        logger.error("Request Failed with status code: "+httpStatus+" exception: "+exception+" response: "+response);
        throw new RuntimeException("Request Failed with response: " + response+" and HTTP code: "+httpStatus, exception);
      }
    });
  }
  logger.debug("NSP IntentTypeFwk- requestResponse received for {} method",restMethodName)
  return result;
}

function restResultCallBack(exception, httpStatus, response, resultCallBack) {
  if (exception) {
    logger.error("Couldn't connect to Manager of Device: ");
    throw exception;
  } else if (httpStatus >= 400) {
    logger.error("Request Failed with status code: "+httpStatus+" exception: "+exception+" response: "+response);
    throw new RuntimeException("Request Failed with response: " + response+" and HTTP code: "+httpStatus, exception);
  } else {
    var json = JSON.parse(response);
    logger.debug("executeRequest - Result: " + response);
    resultCallBack(json);
  }
}
