/**
* (c) 2020 Nokia. All Rights Reserved.
*
* INTERNAL - DO NOT COPY / EDIT
**/
/**
 The IntentType implementation.
 This should ideally be the only Class that should be used from outside the framework.
 **/
 function AltiplanoAMSIntentHelper() {
  this.self = this;
  this.intentTypeObject = null;
  this.prefixToNsMap = new HashMap();
  // TODO: Lot of Intent inter-dependencies are there and they read intent configuration. These should be moved to altiplano-intent-fwk
  this.prefixToNsMap.put("ibn", "http://www.nokia.com/management-solutions/ibn");
  this.prefixToNsMap.put("nc", "urn:ietf:params:xml:ns:netconf:base:1.0");
  this.prefixToNsMap.put("device-manager", "http://www.nokia.com/management-solutions/anv");
  this.prefixToNsMap.put("mds", "http://www.nokia.com/management-solutions/manager-directory-service");
  this.prefixToNsMap.put("oltWponOnt", "http://www.nokia.com/management-solutions/wpon-olt-infra-ont");
  this.prefixToNsMap.put("oltRbHsiIf", "http://www.nokia.com/management-solutions/wpon-olt-infra-hsi-residential-bridge");
  this.prefixToNsMap.put("oltRbStunHsiIf", "http://www.nokia.com/management-solutions/wpon-olt-infra-hsi-rb-s-tunnel");
  this.prefixToNsMap.put("MplsArHsiInfra", "http://www.nokia.com/management-solutions/mpls-access-ring-hsi-infra");
  this.prefixToNsMap.put("xif", "http://www.nokia.com/management-solutions/isam-xdsl-single-line");
  this.prefixToNsMap.put("xOltInfUniIf", "http://www.nokia.com/management-solutions/xpon-olt-infra-unicast");
  this.prefixToNsMap.put("oltxif", "http://www.nokia.com/management-solutions/xpon-olt-infra-fiber");
  this.prefixToNsMap.put("oltXponOnt", "http://www.nokia.com/management-solutions/xpon-olt-infra-ont");
}

AltiplanoAMSIntentHelper.prototype.setIntentObject = function (intentObjectIncoming) {
  this.intentTypeObject = intentObjectIncoming;
}

AltiplanoAMSIntentHelper.prototype.validate = function (syncInput) {
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
    logger.error("Error while validate the intent input, ", e);
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
    })
  }
  if (Object.keys(contextualErrorJsonObj).length !== 0) {
    utilityService.throwContextErrorException(contextualErrorJsonObj);
  }
}

AltiplanoAMSIntentHelper.prototype.synchronize = function (syncInput) {
  logger.debug("Synchronizing intent with {}", apUtils.protectSensitiveDataLog(syncInput));
  var pipelineContext = {};
  pipelineContext["operation"] = "sync";
  var target = syncInput.getTarget();
  var intentConfigXml = syncInput.getIntentConfiguration();
  var networkState = syncInput.getNetworkState().name();
  if (typeof this.intentTypeObject.getExtraContainer === "function") {
    var intentConfigArgs = apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.intentTypeObject.getKeyForList, null, null, this.intentTypeObject.getExtraContainer());
  } else{
    var intentConfigArgs = apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.intentTypeObject.getKeyForList);
  }
  var devices = this.intentTypeObject.getDeviceIds;
  var topology = syncInput.getCurrentTopology();
  var deviceXtraInfo = this.getDeviceXtrargs(target, topology, intentConfigArgs, pipelineContext);
  var intentEngine = new SNMPIntentPipelineEngine(this, target, devices, intentConfigArgs, networkState, syncInput.getCurrentTopology(), pipelineContext);
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
    logger.debug("Dependency Info:::{}", JSON.stringify(dependencyInfo));
    syncResult.getTopology().setDependencyInfo(this.getTransformedDependencyInfo(dependencyInfo));
  }
  if (typeof this.intentTypeObject.forceStoreTopology === "boolean") {
    result.setForceStoreTopology(this.intentTypeObject.forceStoreTopology);
  }
  var dependentsImpacted = this.isDependencyUpdated(target, topology, intentConfigArgs, deviceXtraInfo);
  logger.debug("Dependency Arguments updated??? {}", dependentsImpacted);
  syncResult.setUpdateDependents(dependentsImpacted);
  logger.debug("Synchronization of intent completed with result {}", syncResult.isSuccess());
  if (networkState !== "delete") {
    if (typeof this.intentTypeObject.getDependencyProfiles === "function") {
      var dependencyProfilesUsed = this.intentTypeObject.getDependencyProfiles(intentConfigArgs, target);
      if (dependencyProfilesUsed) {
        syncResult.setIntentProfiles(apUtils.getObjectSet(dependencyProfilesUsed));
      }
    }
}
  return syncResult;
}

AltiplanoAMSIntentHelper.prototype.executeAggregateRequest = function(managerName, inputAggregateRequest) {
  // The aggregate request not supported in SNMP fwk so no action required here
};

AltiplanoAMSIntentHelper.prototype.finalize = function(input, networkState, result, intentObject) {
  //The aggregate request not supported in SNMP fwk so simply return the result.
  return result;
};

AltiplanoAMSIntentHelper.prototype.audit = function (auditInput) {
  logger.debug("Auditing intent with {}", apUtils.protectSensitiveDataLog(auditInput));
  var pipelineContext = {};
  pipelineContext["operation"] = "audit";
  var target = auditInput.getTarget();
  var intentConfigXml = auditInput.getIntentConfiguration();
  var networkState = auditInput.getNetworkState().name();
  if (typeof this.intentTypeObject.getExtraContainer === "function") {
    var intentConfigArgs = apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.intentTypeObject.getKeyForList, null, null, this.intentTypeObject.getExtraContainer());
  }else{
    var intentConfigArgs = apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.intentTypeObject.getKeyForList);
  }
  var devices = this.intentTypeObject.getDeviceIds;
  var intentEngine = new SNMPIntentPipelineEngine(this, target, devices, intentConfigArgs, networkState, auditInput.getCurrentTopology(), pipelineContext);
  logger.debug("Audit of intent completed");
  return intentEngine.audit();
}

AltiplanoAMSIntentHelper.prototype.getTopologyExtraInfoByTopology = function (topology) {
  return apUtils.getTopologyExtraInfo(topology);
}

/**
 * Get data from LatestTopology based on lastIntentConfigKeys and topologyExtraKeys
 * @param intentType
 * @param target
 * @param lastIntentConfigKeys
 * @param topologyExtraKeys
 * Example: getDataFromLatestTopology("intent-uplink-connection", "135.249.41.108", ["uplink-ports"])
 * If the key 'uplink-ports' exists LatestTopology will be return objects contain data of this key 
 **/
AltiplanoAMSIntentHelper.prototype.getDataFromLatestTopology = function(intentType, target, lastIntentConfigKeys, topologyExtraKeys) {
  var objects = {};
  if (!intentType || !target) {
    return;
  }
  var topology = topologyQueryService.getLatestTopology(intentType, target);
  if(topology && apUtils.getTopologyExtraInfo(topology)){
    var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
    objects["intentLocalTopology"] = JSON.parse(topology["intentLocalTopology"]);
    if (topologyExtraKeys && typeof topologyExtraKeys == "object" && topoXtraKeys.length > 0) {
      topologyExtraKeys.forEach(function (key){
        objects[key] = JSON.parse(topologyXtraInfo[key]);
      });
    }
    if (topologyXtraInfo && topologyXtraInfo.lastIntentConfig && lastIntentConfigKeys && typeof lastIntentConfigKeys == "object" && lastIntentConfigKeys.length > 0) {
      var lastIntentConfig = JSON.parse(topologyXtraInfo.lastIntentConfig);
      lastIntentConfigKeys.forEach(function (key){
        objects[key] = lastIntentConfig[key];
      });
    }
  }
  return objects;
}

/**
 * Get profile id by profile name based on topology or from NE
 * @param intentType
 * @param target
 * @param profileType
 * @param attributeName
 * @param profileName
 * @param keyAccessExtraTopo
 * Example: getProfileIdByProxyAndTopo("intent-device-config-fx", "135.249.41.108",
 * "QoS Session Profile", "qosSessionProfileName", "P0_1Gbps", "qosSessionProfiles");
 * If the profile exists from topology or NE will be return profile id
 **/
AltiplanoAMSIntentHelper.prototype.getProfileIdByProxyAndTopo = function (intentType, target, profileType, attributeName, profileName, keyAccessExtraTopo) {
  var profileId;
  var deviceName = target;
  if (!intentType || !deviceName || !profileType || !attributeName || !profileName || !keyAccessExtraTopo) {
    return;
  }
  var profileInfo;
  var topology = topologyQueryService.getLatestTopology(intentType, target);
  if(topology && apUtils.getTopologyExtraInfo(topology)){
    var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
    if (topologyXtraInfo["PROFILE_INFO"]) {
      var topologyProfileInfo = JSON.parse(topologyXtraInfo["PROFILE_INFO"]);
      profileInfo = topologyProfileInfo[keyAccessExtraTopo];
      if (profileInfo) {
        for (var idx in profileInfo) {
          var profile = profileInfo[idx];
          if (profile["name"] == profileName) {
            profileId = profile["ID"];
            break;
          }
        }
      }
    } 
    if (topologyXtraInfo[keyAccessExtraTopo] && topologyXtraInfo[keyAccessExtraTopo] != "undefined") {
      profileInfo = JSON.parse(topologyXtraInfo[keyAccessExtraTopo]);
      for (var idx in profileInfo) {
        var profile = profileInfo[idx];
        var fn = Object.keys(profile)[0];
        if (profile[fn][attributeName] == profileName) {
          var fnSplits = fn.split(":");
          profileId = fnSplits[fnSplits.length-1];
          break;
        }
      }
    }
  }
  if (!profileId) {
    profileId = this.getProfileIndex(deviceName, profileName, attributeName, profileType);
  }
  return profileId;
}

AltiplanoAMSIntentHelper.prototype.getTransformedDependencyInfo = function (dependencyObject) {
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
                      logger.warn("Dependency target is undefined: {}", dependencyIntentType);
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

AltiplanoAMSIntentHelper.prototype.isDependencyUpdated = function (target, topology, intentConfigArgs, deviceXtraInfo) {
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

AltiplanoAMSIntentHelper.prototype.getDeviceIds = function (target, intentConfigArgs, pipelinecontext) {
  var devicesConfig = this.getPropertyData(this.intentTypeObject.getDeviceIds, [target, intentConfigArgs, pipelinecontext]);
  var deviceId = Object.keys(devicesConfig);
  return deviceId
}

AltiplanoAMSIntentHelper.prototype.getDeviceXtrargs = function (target, topology, intentConfigArgs, pipelinecontext) {
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

AltiplanoAMSIntentHelper.prototype.getChildAttributes = function (oltName, profileId, profileFriendlyName, profileAttributeList, mObject, ignoreGetAttributeIfNoChild) {
  mObject = (mObject == null) ? createDecoratedMObjectProxy(this, oltName) : mObject;
  var profiles = mObject.getAllChildrenOfType(profileId, profileFriendlyName);
  if ((!profiles || (profiles && profiles.size() == 0)) && ignoreGetAttributeIfNoChild) {
    return;
  }
  var profileNames = mObject.get(profiles, profileAttributeList);
  return profileNames;
}

AltiplanoAMSIntentHelper.prototype.filterItems = function (item, query) {
  return item.filter(function (el) {
    return el.toLowerCase().indexOf(query.toLowerCase()) > -1;
  })
}

AltiplanoAMSIntentHelper.prototype.getProxyObject = function (deviceName) {
  var managerInfo = apUtils.getManagerInfo(deviceName);
  return proxyService.getAmsProxy(managerInfo);
}

AltiplanoAMSIntentHelper.prototype.getProfileIndex = function (deviceName, profileName, profileNameObject, profileObjectType, allChildrenOfType) {
  var mObjectProxy = createDecoratedMObjectProxy(this, deviceName);
  var index = this.getProfileId(deviceName, mObjectProxy, profileName, profileNameObject, profileObjectType, allChildrenOfType);
  return index;
}

AltiplanoAMSIntentHelper.prototype.getProfileId = function (deviceName, proxyObject, profileName, profileNameObject, profileObjectType, allChildrenOfType, objectTypeOfParent) {
  var id;
  var profileMoId;
  if (allChildrenOfType != null) {
    profileMoId = allChildrenOfType;
  } else {
    var fnOfParent = objectTypeOfParent ? objectTypeOfParent + ":" + deviceName : "NE:" + deviceName;
    profileMoId = proxyObject.getAllChildrenOfType(profileObjectType, fnOfParent);
  }
  if (profileMoId !== null && !profileMoId.isEmpty()) {
    var setAtt = [profileNameObject];
    var obj = proxyObject.get(profileMoId, setAtt);
    for each(var e in obj.keySet()) {
      var map = obj.get(e);
      var index = map.get(profileNameObject).toString();
      if (index == profileName) {
        id = e.split(":")[3];
        return id;
      }
    }
  }
  return null;
}

AltiplanoAMSIntentHelper.prototype.isContain = function (availableIndexs, index) {
  for each(var i in availableIndexs) {
    if (i == index) {
      return true;
    }
  }
  return false;
}

AltiplanoAMSIntentHelper.prototype.getXdslProfileMap = function (intentConfigArgs) {
  logger.debug("isam-xdsl-single-line intent getProfileMap with service: {}", apUtils.protectSensitiveDataLog(intentConfigArgs));
  var profile = {
    serviceProfile: {
      profileName: intentConfigArgs["service-profile"],
      type: "XDSL Line Service Profile",
      attribute: "xdslLineServiceProfileName"
    },
    spectrumProfile: {
      profileName: intentConfigArgs["spectrum-profile"],
      type: "XDSL Line Spectrum Profile",
      attribute: "xdslLineSpectrumProfileName"
    },
    rtxProfile: {
      profileName: intentConfigArgs["rtx-profile"],
      type: "XDSL RTX Profile",
      attribute: "xdslRtxProfileName"
    },
    queueProfile0: {
      profileName: "FD_BEQ",
      type: "QoS Queue Profile",
      attribute: "qosQueueProfileName"
    },
    queueProfile1: {
      profileName: "FD_CLQ",
      type: "QoS Queue Profile",
      attribute: "qosQueueProfileName"
    },
    queueProfile2: {
      profileName: "FD_VideoQ",
      type: "QoS Queue Profile",
      attribute: "qosQueueProfileName"
    },
    queueProfile3: {
      profileName: "FD_VoiceQ",
      type: "QoS Queue Profile",
      attribute: "qosQueueProfileName"
    },
    bondingGroupProfile: {
      profileName: intentConfigArgs["bonding-group-profile"],
      type: "Bonding Group Profile",
      attribute: "bondingGroupProfileName"
    },
    bondingGroupRtxProfile: {
      profileName: intentConfigArgs["bonding-group-rtx-profile"],
      type: "Bonding Group RTX Profile",
      attribute: "bondingGroupRtxProfileName"
    },
    defaultQueueProfile: {
      profileName: "UNI_BECLQ",
      type: "QoS Queue Profile",
      attribute: "qosQueueProfileName"

    },
    queueProfiles: {
      profileNames: ["FD_BEQ", "FD_CLQ", "FD_VideoQ", "FD_VoiceQ", "UNI_BECLQ"],
      type: "QoS Queue Profile",
      attribute: "qosQueueProfileName"
    }
  };
  return profile;
}

AltiplanoAMSIntentHelper.prototype.getBulkProfileFName = function (deviceName, attribute, profileType, profileNameList, pipelineContext) {
  logger.debug("getBulkProfileFName with deviceName: {}, profileType: {}", deviceName, profileType);
  var proxyObject = pipelineContext.deviceProxy;
  var profileMoIds = proxyObject.getAllChildrenOfType(profileType, profileType + ":" + deviceName);
  var profilesList = new ArrayList();
  if (profileMoIds !== null && !profileMoIds.isEmpty()) {
    var setAtt = [attribute];
    var obj = proxyObject.get(profileMoIds, setAtt);
    for each(var e in obj.keySet()) {
      var map = obj.get(e);
      var val = map.get(attribute).toString();
      var idx = profileNameList.indexOf(val);
      if (idx > -1) {
        profileId = e.split(":")[3];
        profilesList.add({
          'profileName': val,
          'obj': profileType + ":" + deviceName + ":IACM:" + profileId
        });
        profileNameList.splice(idx, 1);
      }
    }
  }
  if (profileNameList.length > 0) {
    throw new RuntimeException("Profile not found with name " + profileNameList);
  }
  return profilesList;
}

AltiplanoAMSIntentHelper.prototype.isIntentExistsForNE = function (intentType, oltName, delimiter) {
  var intentTargets = ibnService.getConfiguredIntentsByIntentTypeName(intentType);
  for (var index = 0; index < intentTargets.size(); index++) {
    var target = intentTargets.get(index).getTarget();
    var deviceName = target.split(delimiter)[0];
    if (oltName == deviceName) {
      return target;
    }
  }
}

AltiplanoAMSIntentHelper.prototype.getAllPlannedLTSap = function (oltName, deviceProxy, isPortId) {
  var ltPortInstances = [];
  deviceProxy = (deviceProxy == null) ? createDecoratedMObjectProxy(this, oltName) : deviceProxy;
  var ethPortFrNameWithPortName = this.getChildAttributes(oltName, "Ethernet Port", "Agent:" + oltName + ":" + "IHUB", ["portName", "tmnxPortClass"], deviceProxy);
  var ethPortFrNameWithLtName = ethPortFrNameWithPortName.entrySet().stream().filter(function (keyValuePair) {
    var portClass = keyValuePair.getValue().get("tmnxPortClass");
    return (portClass !== null && portClass.toString() == "LTPort");
  }).collect(Collectors.toMap(function (keyValuePair) { return keyValuePair.getKey() }, function (keyValuePair) {
    var portNameWithPortFrName = keyValuePair.getValue();
    var portFriendlyName = portNameWithPortFrName.get("portName");
    var portArray = portFriendlyName.split(":")[1].split("/");
    return "Slot:" + oltName + ":IACM:R" + portArray[0] + ".S" + portArray[1] + ".LT" + portArray[2];
  }));
  if (null != ethPortFrNameWithLtName && ethPortFrNameWithLtName.size() > 0) {
    var slotPlannedStatusAttr = deviceProxy.get(ethPortFrNameWithLtName.values().toArray(), ["eqptSlotPlannedType"]);
    if (null != slotPlannedStatusAttr && slotPlannedStatusAttr.size() > 0) {
      for each(ethPortFrNameWithLtNameEntrySet in ethPortFrNameWithLtName.entrySet()){
        if(slotPlannedStatusAttr.containsKey(ethPortFrNameWithLtNameEntrySet.getValue())){
          var eqptSlotPTMap = slotPlannedStatusAttr.get(ethPortFrNameWithLtNameEntrySet.getValue());
          var slotPlannedStatus = eqptSlotPTMap.get("eqptSlotPlannedType");
          if(slotPlannedStatus!= null && slotPlannedStatus != "EXT_MANAGED" && slotPlannedStatus != "UNMANAGED" && slotPlannedStatus != "NOT_PLANNED" && slotPlannedStatus != "NOT_ALLOWED") {
            if (isPortId) {
              var portIdArray = ethPortFrNameWithLtNameEntrySet.getKey().split(":");
              ltPortInstances.push(portIdArray[portIdArray.length - 1]);
            } else {
              var ltPortDisplayNameMap = ethPortFrNameWithPortName.get(ethPortFrNameWithLtNameEntrySet.getKey());
              var ltDisplayName = ltPortDisplayNameMap.get("portName");
              ltPortInstances.push(ltDisplayName);
            }
          }
        }
      }
    }
  }
}

AltiplanoAMSIntentHelper.prototype.getONTCardConfigJson = function (arrayLayouts, ontLayout) {
  for each(layout in arrayLayouts) {
    if(layout.name == ontLayout) {
      return layout.cards;
    }
  }
}

AltiplanoAMSIntentHelper.prototype.getPortMapDetails = function (portName, jsonObj) {
  var cardId = 0, portId = 0, portType;
  var result = {};
  jsonObj.forEach(function (card) {
    card.ports.forEach(function (portMap) {
      if (portMap.portName == portName) {
        cardId = card.cardNo;
        portId = portMap.portNo;
        portType = portMap.portType;
      }
    });
  });
  if (cardId == 0) {
    throw new RuntimeException('Please provide valid port name');
  }
  result.cardId = cardId;
  result.portId = portId;
  result.portType = portType;
  return result;
}

AltiplanoAMSIntentHelper.prototype.getPortNameWithoutPots = function (arrayLayouts, ontLayout) {
  var returnVal = new Object();
  arrayLayouts.forEach(function (layout) {
    if (layout.name == ontLayout) {
      layout.cards.forEach(function (portsMap) {
        portsMap.ports.forEach(function (portMap) {
          if (portMap.portType != 'pots')
            returnVal[portMap.portName] = portMap.portName;
        });
      });
    }
  });
  return returnVal;
}

AltiplanoAMSIntentHelper.prototype.validateTarget = function (intentType, intentVersion, target) {
  var intentTypeDefinition = ibnService.findIntentTypeByName(intentType, intentVersion);
  var targetComponentSet = intentTypeDefinition.getTargetComponents();
  var parts = target.split(intentTypeDefinition.getTargetDelimiter());
  if (parts.length != targetComponentSet.size()) {
    var errorMessage = "Target should be of format <";
    for each(var targetComponent in targetComponentSet) {
      errorMessage = errorMessage + targetComponent.getName() + ">#<";
    }
    errorMessage = errorMessage.substring(0, errorMessage.length - 3);
    throw new RuntimeException(errorMessage);
  }
}

AltiplanoAMSIntentHelper.prototype.getAndReserveNextFreeIDFor = function (name, dictionary, operation, maxLimit) {
  for (var entry in dictionary) {
    var profile = dictionary[entry];
    if (name == profile) {
      return entry;
    }
  }
  var ids = Object.keys(dictionary).sort();
  var freeID = 0;
  for (var id = 1; id <= maxLimit + 1; id++) {
    if (ids && ids.indexOf(id.toString()) == -1) {
      freeID = id;
      break;
    }
  }
  if (freeID == 0) {
    freeID = freeID + 1;
  }
  dictionary[freeID] = name;
  return freeID;
}

AltiplanoAMSIntentHelper.prototype.getAllInstances = function (oltName, moType, attributeName, pipelineContext, isIhubProfile) {
  var result = {};
  var objectFN = "NE:" + oltName;
  if(isIhubProfile != undefined && isIhubProfile == true){
     objectFN = "Agent:" + oltName + ":IHUB";
  }
  var deviceProxy;
  if (!pipelineContext || pipelineContext.deviceProxy == null) {
    deviceProxy = createDecoratedMObjectProxy(this, oltName);
  } else {
    deviceProxy = pipelineContext.deviceProxy;
  }
  var profiles = this.getChildAttributes(oltName, moType, objectFN, [attributeName], deviceProxy);
  if (profiles) {
    for (var profile in profiles) {
      var attributeValue = profiles.get(profile).get(attributeName);
      var splitColon = profile.split(":");
      var ID = splitColon[splitColon.length - 1];
      result[ID] = attributeValue;
    }
  }
  return result;
}

AltiplanoAMSIntentHelper.prototype.getAllBulkInstancesWithAttributes = function (oltName, moType, attributeName, attributes, isIhubProfile, pipelineContext) {
  var objectIds = {};
  var objectFN = "NE:" + oltName;
  if (isIhubProfile != undefined && isIhubProfile == true) {
     objectFN = "Agent:" + oltName + ":IHUB";
  }
  if (attributeName && attributes.indexOf(attributeName) == -1) {
    attributes.push(attributeName);
  }
  var deviceProxy;
  if (!pipelineContext || pipelineContext.deviceProxy == null) {
    deviceProxy = createDecoratedMObjectProxy(this, oltName);
  } else {
    deviceProxy = pipelineContext.deviceProxy;
  }
  var profiles = this.getChildAttributes(oltName, moType, objectFN, attributes, deviceProxy, true);
  if (profiles) {
    for (var profile in profiles) {
      var attributeValue = profiles.get(profile).get(attributeName);
      var splitColon = profile.split(":");
      var ID = splitColon[splitColon.length - 1];
      objectIds[ID] = attributeValue;
    }
  }
  return {"objectIds" : objectIds, "profiles": profiles};
}
// We have not completed remove JSON yet so to minimize the impact to other code, will not remove param "useProfileManager" by now
// when completed remove JSON for all of the intent we should remove it completely
AltiplanoAMSIntentHelper.prototype.generateTabularInstances = function (target, pipelineContext, attributeName, objectType, stepName, maxLimit, skipAudit, 
    skipCreateWhenExist, requestContext, ignoreOnDelete, attributesForExistingAudit, attributesFetchInstance, isIgnoreMaxLimit, isCleanUpOldInstance) {
  var allProfiles = requestContext.get("allProfiles");
  var templateResourcePrefix = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_ISAM + intentConstants.FILE_SEPERATOR;
   var deviceDetails = {};
   var deviceType = apUtils.getNodeTypeFromEs(target);
   var deviceVersion = deviceType.startsWith(intentConstants.ISAM_FX_PREFIX)? deviceType.split("-")[2] : deviceType.split("-")[1];
   var profileDef;
   var defaultProfilesDef;
  var deviceName = target;
  var maps = JSON.parse(resourceProvider.getResource(templateResourcePrefix + "profile-mapping.json"));
  var flagDevice65 = false;
  if (deviceVersion >= "6.5") {
   flagDevice65 = true;
  }
  if (maps) {
    for (var map in maps) {
      if(maps[map]["existing-profile-type"] == stepName){
        var subtype = maps[map]["subtype"];
        var profileType = maps[map]["profile-type"];
        profileDef = allProfiles[subtype][profileType];
        break;
      }
    }
  }
  if (isIgnoreMaxLimit && profileDef && maxLimit < profileDef.length) {
    maxLimit = profileDef.length;
  }
  var defaultProfilesDef = JSON.parse(resourceProvider.getResource(templateResourcePrefix + "default-profiles.json"));
  var existingProfilesInNE = {};
  var bulkInstanceProfiles = {};
  if (attributesFetchInstance) {
    bulkInstanceProfiles = this.getAllBulkInstancesWithAttributes(target, objectType, attributeName, attributesFetchInstance, false, pipelineContext);
    existingProfilesInNE = bulkInstanceProfiles.objectIds;
  } else {
    existingProfilesInNE = this.getAllInstances(target, objectType, attributeName, pipelineContext);
  }
  var ignoreOnDeleteValue = false;
  if (ignoreOnDelete) {
    ignoreOnDeleteValue = ignoreOnDelete;
  }
  var forceCreate = false;
  if(!bulkInstanceProfiles.profiles || bulkInstanceProfiles.profiles.size() == 0){
    forceCreate = true;
  }
  var self = this;
  return {
    name: stepName,
    topology: false,
    create: forceCreate,
    ignoreOnDelete: ignoreOnDeleteValue,
    existenceAuditAttributes : attributesForExistingAudit,
    bulkInstanceProfiles: bulkInstanceProfiles.profiles,
    templateFile: templateResourcePrefix + stepName + ".json.ftl",
    instanceArguments: function (instance, target, intentConfigArgs, pipelineContext) {
      var value = pipelineContext.operation == "audit" ? "audit" : "sync";
      instance["value"] = value;
      instance["flagDevice65"] = flagDevice65;
      pipelineContext["isDefault"] = false;
      //Check if default profile
      if(defaultProfilesDef){
        var defaultProfiles = defaultProfilesDef[stepName];
        if(defaultProfiles){
          for(var i = 0; i <= defaultProfiles.length; i++) {
              if(defaultProfiles[i] == instance.name){
                pipelineContext["isDefault"] = true;
                break;
              }
          }
        }
      }

      if(!pipelineContext[stepName]){
          pipelineContext[stepName]=[];
      }
      if(!pipelineContext["nameAttr"+stepName]){
          pipelineContext["nameAttr"+stepName]=[];
      }
      for (var existingProfile in existingProfilesInNE) {
        if(existingProfilesInNE[existingProfile] == instance.name){
          instance["ID"] = existingProfile;
          pipelineContext[stepName].push(instance);
          var tempAttrJson = {};
          tempAttrJson[attributeName] = instance.name;
          var tempJson = {};
          tempJson[objectType+":"+target+":IACM:"+instance["ID"]]=tempAttrJson;
          pipelineContext["nameAttr"+stepName].push(tempJson);
          return instance;
        }
      }
      instance["ID"] = self.getAndReserveNextFreeIDFor(instance.name, existingProfilesInNE, pipelineContext.operation, maxLimit);
      pipelineContext[stepName].push(instance);
      var tempAttrJson = {};
      tempAttrJson[attributeName] = instance.name;
      var tempJson = {};
      tempJson[objectType+":"+target+":IACM:"+instance["ID"]]=tempAttrJson;
      pipelineContext["nameAttr"+stepName].push(tempJson);
      return instance;
    },
    cleanUpOldInstance: isCleanUpOldInstance,
    // Keys defined in the JSON is used as Instance Identifiers in JS layer.

    instances: function (target, intentConfigArgs, pipelineContext) {
      if (skipAudit && pipelineContext.operation == "audit") {
          return [];
      }
      return profileDef;
    },
    deleteOperation: function (objectId, configArgs, context) {
      if(context["isDefault"] == false){
          context.deviceProxy.delete(objectId);
      }
    }
  }
}

AltiplanoAMSIntentHelper.prototype.wrapErrorHandler = function (object, className) {
  for (var fn in object) {
    if (typeof object[fn] === "function") {
      object[fn] = this.wrapErrorHandlerFn(object, object[fn], className + "." + fn)
    }
  }
  return object;
}

AltiplanoAMSIntentHelper.prototype.wrapErrorHandlerFn = function (object, fn, fnName) {
  var self = this;
  return function () {
    try {
      return fn.apply(object, arguments);
    } catch (e) {
        if(typeof e.getMessage === 'function' && e.getMessage().contains("MObjectRestService.objNotExist")){
            logger.debug("Object does not exist: {}", e.getMessage());
        }else{
            logger.error("An error occurred while invoking function " + fnName, e)
        }
      if (typeof e.getMessage === 'function') {
        var errorMessage = self.parseErrorMessage(e.getMessage());
        throw new RuntimeException(errorMessage);
      } else {
        throw new RuntimeException(e);
      }
    }
  }
}

AltiplanoAMSIntentHelper.prototype.parseErrorMessage = function (message) {
  var error;
  try {
    error = JSON.parse(message);
  } catch (e) { //failed to parse JSON
    return message;
  }
  if (!error.errorKey) {
    return message;
  }
  var errorMessage;
  if (typeof translationService != 'undefined') {
    errorMessage = this.getKeyMessage(error.errorKey);
    errorMessage = this.translateMessage(errorMessage, error.errorArgs);
  }
  if (!errorMessage || errorMessage === error.errorKey) { //if we weren't able to figure the keys translation
    var detailError = (error.errorArgs) ? "Details " + JSON.stringify(error.errorArgs) : "";
    errorMessage = "Error occurred: " + error.errorKey + "\n" + detailError;
  }
  return errorMessage;
}

AltiplanoAMSIntentHelper.prototype.translateMessage = function (message, args) {
  if (!args || Object.keys(args).length == 0) {
    return message;
  }
  var argKeys = Object.keys(args);
  for (var argKey in argKeys) {
    message = message.replace("{{" + argKeys[argKey] + "}}", JSON.stringify(args[argKeys[argKey]]));
  }
  return message;
}

AltiplanoAMSIntentHelper.prototype.getKeyMessage = function (key) {
  var condition = new HashMap();
  condition.put("field", key.replace(/\./g, "#"));
  condition.put("locale", "en");
  var translationByConditions = translationService.getTranslationByConditions(condition);
  if (translationByConditions != null && translationByConditions.size() > 0) {
    return translationByConditions.get(0).getTranslation();
  }
  return key;
}

AltiplanoAMSIntentHelper.prototype.isDifferent = function (oldObject, currentObject) {
  if (Array.isArray(oldObject) && Array.isArray(currentObject)) {
    return !this.isArrayEquals(oldObject, currentObject);
  } else if (typeof oldObject === "object" && typeof currentObject === "object") {
    var oldKeys = Object.keys(oldObject);
    var newKeys = Object.keys(currentObject);
    if (oldKeys.length != newKeys.length) {
      return true;
    }
    for (var key in oldKeys) {
      logger.debug("Comparing attribute {}", apUtils.protectSensitiveDataLog(oldKeys[key]));
      if (currentObject[oldKeys[key]] === undefined) {
        return true;//the property doesn't even exist!
      }
      var result = this.isDifferent(oldObject[oldKeys[key]], currentObject[oldKeys[key]]);
      if (result === true) {
        return true;
      }
    }
  } else if (oldObject != currentObject) {
    return true;
  }
  return false;
}

AltiplanoAMSIntentHelper.prototype.isArrayEquals = function (array, withArray) {
  if (array.length != withArray.length) {
    return false;
  }
  for (var idx in array) {
    if (typeof array[idx] === "object") {//lets try to find an object match
      var isDiffObj = true;
      for (var i = 0; i < withArray.length; ++i) {
        var isDiffObj = this.isDifferent(array[idx], withArray[i]);
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

/**
 * Sorting the order of fields in actualObject to follow expectedObject
 **/
AltiplanoAMSIntentHelper.prototype.sortActualValue = function (actualObject, expectedObject) {
    if (Array.isArray(actualObject) && Array.isArray(expectedObject)) {
        var sortedActualObject = [];
        var copyOfActualObject = actualObject.slice(0);
        for (var idx in expectedObject) {
            var matchIndex = copyOfActualObject.indexOf(expectedObject[idx]);
            if (matchIndex >= 0) {
                sortedActualObject.push(expectedObject[idx]);
                copyOfActualObject.splice(matchIndex,1);
            }
        }
        sortedActualObject = sortedActualObject.concat(copyOfActualObject);
        return sortedActualObject;
    }
    else if (typeof actualObject === "object" && typeof expectedObject === "object") {
        var sortedActualObject = {};
        var copyOfActualObject = {};
        for (var key in actualObject) {
            copyOfActualObject[key] = actualObject[key];
        }
        for (var key in expectedObject) {
            if (copyOfActualObject[key] != null && !(copyOfActualObject[key] === undefined)) {
                sortedActualObject[key] = copyOfActualObject[key];
                delete copyOfActualObject[key];
            }
        }
        for (var key in copyOfActualObject) {
            sortedActualObject[key] = copyOfActualObject[key];
        }
        return sortedActualObject;
    }
    else {
        return actualObject;
    }
}

AltiplanoAMSIntentHelper.prototype.getPropertyData = function (data, args) {
  if (typeof data === 'function') {
    return data.apply(data, args);
  }
  return data;
}

AltiplanoAMSIntentHelper.prototype.getSubType = function (deviceName) {
  try {
    var mObjectProxy = createDecoratedMObjectProxy(this, deviceName);
    var ne_fn_name = "NE" + ":" + deviceName;
    var neFrArray = [ne_fn_name];
    var ne_attributes = ['subType'];
    var attribute_map = mObjectProxy.get(neFrArray, ne_attributes);
    var sub_type = attribute_map.get(ne_fn_name).get('subType');
    return sub_type;
  } catch (error) {
    logger.error("Cannot get subType from MDS:", error);
    var nodeType = apUtils.getNodeTypeFromEs(deviceName);
    return apUtils.splitToHardwareTypeAndVersion(nodeType).hwType;
  }
}

AltiplanoAMSIntentHelper.prototype.getNEContent = function (target, intentConfigArgs, isZTPSupported, oamConnectivityAccount) {
  var deviceName = target;
  var groupName = intentConfigArgs["group-name"];
  if (!groupName) {
    groupName = "Network";
  }
  var iacmSnmpProfile = intentConfigArgs["iacm-snmp-profile"];
  if (oamConnectivityAccount && oamConnectivityAccount["iacm-snmp-profile"]){
    iacmSnmpProfile = oamConnectivityAccount["iacm-snmp-profile"];
  }
  var neContent = {
    "name": deviceName,
    "groupName": groupName,
    "partitionAccessProfile": "defaultPAP",
    "IACM__ipAddress": intentConfigArgs["ip-address"],
    "IACM__snmpProfile_id": iacmSnmpProfile,
  };
  if (intentConfigArgs["hardware-type"] === intentConstants.ISAM_FX_PREFIX) {
    var ihubSnmpProfile = intentConfigArgs["ihub-snmp-profile"];
    if (oamConnectivityAccount && oamConnectivityAccount["ihub-snmp-profile"]){
      ihubSnmpProfile = oamConnectivityAccount["ihub-snmp-profile"];
    }
    neContent["IHUB__snmpProfile_id"] = ihubSnmpProfile;
  } else if (intentConfigArgs["hardware-type"] === intentConstants.ISAM_MX_PREFIX) {
    if(intentConfigArgs["geo-coordinates"]){
        neContent["latitude"] = intentConfigArgs["geo-coordinates"]["latitude"];
        neContent["longitude"] = intentConfigArgs["geo-coordinates"]["longitude"];
    }
  }
  if (intentConfigArgs["hardware-type"] !== intentConstants.ISAM_FX_PREFIX || (intentConfigArgs["hardware-type"] === intentConstants.ISAM_FX_PREFIX && isZTPSupported)){
    if (intentConfigArgs["target-script-or-archive"]) {
      neContent["targetScriptOrArchive"] = intentConfigArgs["target-script-or-archive"];
      neContent["executeScriptAtStartSupervision"] = true;
      if (intentConfigArgs["other-command-line-params"]) {
        neContent["otherCommandLineParameters"] = intentConfigArgs["other-command-line-params"];
      }
    }
  }
  return neContent;
}

AltiplanoAMSIntentHelper.prototype.checkNEReachable = function (mObject, deviceName) {
  var tryTime = 0;
  var isamObject = JSON.parse(resourceProvider.getResource(internalIsamResourcePrefix + "isam.json"));
  var numberOfRetries = isamObject['number-of-retries'];
  var supervisionStatusWaitTime = isamObject['supervision-status-wait-time'];
  var neFrndName = "NE:" + deviceName;

  var Thread = Java.type("java.lang.Thread");

  var setAtt = ['connectivityState'];
  var setFr = [neFrndName];
  var connectionStatus;
  while (numberOfRetries >= tryTime) {
    try {
      var connectionStatusMap = mObject.get(setFr, setAtt);
      connectionStatus = connectionStatusMap.get(neFrndName).remove('connectivityState');
      if (connectionStatus && connectionStatus != 'CONNECTED') {
        Thread.sleep(supervisionStatusWaitTime * 1000);
        tryTime++;
      } else {
        break;
      }
    } catch (e) {
      logger.error("Error while getting status of NE ", e);
      throw new RuntimeException("Error while getting status of NE");
    }
  }

  if (((tryTime - 1) == numberOfRetries) && connectionStatus) {
    switch (connectionStatus) {
      case 'DISCONNECTED':
        throw new RuntimeException("NE '" + deviceName + "' is unreachable");
        break;
      case 'BOOTING':
        throw new RuntimeException("NE '" + deviceName + "' is booting");
        break;
      case 'PARTIALLYCONNECTED':
        throw new RuntimeException("NE '" + deviceName + "' is partially reachable");
        break;
      default:
        throw new RuntimeException("NE '" + deviceName + "' is in unknown state");
        break;
    }
  }
}

AltiplanoAMSIntentHelper.prototype.checkAndUpdateLabel = function (input, intentConfigArgs, deviceName) {
  var needUpdateLabel = false;
  if (intentConfigArgs["label"]) {
    needUpdateLabel = true;
  } else {
    var topology = input.getCurrentTopology();
    if (topology) {
      var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
      var oldDeviceConfig = topologyXtraInfo[this.intentTypeObject.stageName + "_" + deviceName + "_ARGS"];
      if (oldDeviceConfig) {
        oldDeviceConfig = JSON.parse(oldDeviceConfig);
        if (oldDeviceConfig["label"]) {
          needUpdateLabel = true;
        }
      }
    }
  }
  if (needUpdateLabel) {
    var labelList = this.getLabelList(deviceName, intentConfigArgs);
    var args = {
      "deviceName": deviceName,
      "label": labelList.createLabel
    };
    this.saveLocalAttribute(args);
    var args2 = {
      "deviceName": deviceName,
      "label": labelList.removeLabel
    };
    this.saveLocalAttribute(args2);
  }
}

AltiplanoAMSIntentHelper.prototype.checkIfSlotNeedsUnplanning = function (deviceName, intentConfigArgs, slotName, plannedType, profileIndex, proxy, cageMode, mapAttributesBoard) {
  var slot = "Slot:" + deviceName + ":IACM:R1.S1." + slotName;
  if (slotName == "NT") {
    slot = "Applique Slot:" + deviceName + ":IACM:R1.S1." + "NT";
  }
  var slotFrName = [slot];
  var attributeArr;
  var hwType = intentConfigArgs['hardware-type'];
  attributeArr = ["eqptSlotPlannedType", "eqptSlotPlannedCapabilityProfile"];
  if (hwType === intentConstants.ISAM_FX_PREFIX && intentConfigArgs["device-version"] >= "6.2" && slotName != "NT") {
    attributeArr = ["eqptSlotPlannedType", "eqptSlotPlannedCapabilityProfile", "eqptBoardCageMode"];
  }
  var map;
  if (mapAttributesBoard) {
    mapAttributesBoard.forEach(function(attrBoard){
        if (attrBoard === slot) {
            map = mapAttributesBoard.get(slot);
        }
    })
    // A board was removed from the boards list => unplanned this board from the corresponding slot in the NE.
    // mapAttributesBoard only contains data of boards configured in device-fx. Boards removement is not stored in mapAttributesBoard => undefined
    // Then we will assign true if mapAttributesBoard is undefined.
    if (!map) {
      return true;
    }
  } else {
    var map_attributes = proxy.get(slotFrName, attributeArr);
    map = map_attributes.get(slot);
  }
  var currentPlannedType = map.get('eqptSlotPlannedType');
  var currentProfileIndex = map.get('eqptSlotPlannedCapabilityProfile');
  if (hwType === intentConstants.ISAM_FX_PREFIX && intentConfigArgs["device-version"] >= "6.2" && slotName != "NT") {
    var currentCageMode = map.get("eqptBoardCageMode");
  }

  if (currentPlannedType && currentPlannedType != "NOT_PLANNED") {
    if (plannedType == currentPlannedType && (profileIndex == currentProfileIndex)) {
        if (hwType === intentConstants.ISAM_FX_PREFIX && intentConfigArgs["device-version"] >= "6.2" && cageMode != undefined && cageMode != "not-set" && cageMode != currentCageMode) {
            return true;
        }
        return false;
    } else if (plannedType == currentPlannedType && profileIndex && profileIndex != currentProfileIndex) {
      return true;
    } else if (plannedType != currentPlannedType) {
      return true;
    }
  }
  return false;
}

AltiplanoAMSIntentHelper.prototype.executeRequestInNAC = function (requestXml) {
  var configResponse = utilityService.executeRequest(requestXml);
  var responseString = utilityService.convertNcResponseToString(configResponse);
  if (responseString == null) {
    throw new RuntimeException("Execution Failed with error " + responseString);
  }
  return responseString;
}

AltiplanoAMSIntentHelper.prototype.saveLocalAttribute = function (args) {
  var templateResourcePrefix = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_ISAM + intentConstants.FILE_SEPERATOR;
  var requestTemplateForDeviceLabels = resourceProvider.getResource(templateResourcePrefix + "requestTemplateForDeviceLabels.xml.ftl");
  var requestXml = utilityService.processTemplate(requestTemplateForDeviceLabels, args);
  var getConfigResponse = this.executeRequestInNAC(requestXml);
}

AltiplanoAMSIntentHelper.prototype.getLabelList = function (deviceName, intentConfigArgs) {
  var newListLabel = intentConfigArgs["label"];
  var localAttributes = this.getLocalAttributesPerDevice(deviceName);
  var listLabelToRemove = this.getListLabelToRemove(localAttributes, newListLabel);
  var listLabelToCreate = this.getListLabelToCreate(localAttributes, newListLabel);
  var listLabels = { "createLabel": listLabelToCreate, "removeLabel": listLabelToRemove };
  return listLabels;
}

AltiplanoAMSIntentHelper.prototype.getListLabelToRemove = function (localAttributes, newListLabel) {
  var listLabelToRemove = [];
  var data = {};
  if (localAttributes) {
    for (attrKey in localAttributes) {
      var localCategoryName = attrKey.split(/\s*##_/)[1];
      var localCategoryValue = localAttributes[attrKey];
      var needToRemove = true;
      if (newListLabel && newListLabel.length !== 0) {
        for (var keyStr in newListLabel) {
          var keyValue = newListLabel[keyStr];
          var categoryName = keyValue["category"];
          var categoryValue = keyValue["value"];
          if (localCategoryName === categoryName && localCategoryValue === categoryValue) {
            needToRemove = false;
            break;
          }
        }
      }
      if (needToRemove) {
        var labelToRemove = { "category": attrKey, "value": localCategoryValue, "operation": "remove" };
        data[attrKey] = labelToRemove;
      }
    }
  }
  return data;
}

AltiplanoAMSIntentHelper.prototype.getListLabelToCreate = function (localAttributes, newListLabel) {
  var listLabelToCreate = {};
  if (newListLabel && newListLabel.length !== 0) {
    var labelId = this.getLabelId(localAttributes);
    for (var keyStr in newListLabel) {
      var keyValue = newListLabel[keyStr];
      if (keyValue && keyValue.length !== 0) {
        var labelAvailable = false;
        var category;
        var categoryName = keyValue["category"];
        var categoryValue = keyValue["value"];

        if (localAttributes) {
          for (attrKey in localAttributes) {
            if (attrKey.split(/\s*##_/)[1] === categoryName && localAttributes[attrKey] === categoryValue) { //E.g: __label__1_##_State => State
              category = attrKey;
              labelAvailable = true;
              break;
            }
          }
        }
        if (!labelAvailable) {
          labelId++;
          category = "__label__" + labelId + "_##_" + categoryName;
          var labelToCreate = { "category": category, "value": categoryValue, "operation": "create" };
          listLabelToCreate[category] = labelToCreate;
        }
      }
    }
  }
  return listLabelToCreate;
}

AltiplanoAMSIntentHelper.prototype.getLocalAttributesPerDevice = function (deviceName) {
  var localAttributes = mds.getAllLocalAttributesPerDevice(deviceName);
  logger.debug("Local Attributes for {} : {}", deviceName, localAttributes);
  return localAttributes;
}

AltiplanoAMSIntentHelper.prototype.getLabelId = function (localAttributes) {
  var categoryNames = [];
  if (localAttributes) {
    localAttributes.forEach(function (localAttribute) {
      categoryNames.push(parseInt(localAttribute.split(/\s*_/)[4]));
    });
    if (categoryNames.length > 0) {
      var max = Math.max.apply(null, categoryNames) + 1;
      return max;
    }
  }
  return 1;
}

AltiplanoAMSIntentHelper.prototype.startSupervision = function (deviceName) {
  var mObjectProxy = createDecoratedMObjectProxy(this, deviceName);
  var Thread = Java.type("java.lang.Thread");
  var neNames = new HashSet();
  neNames.add(deviceName);
  try {
    mObjectProxy.startSupervision(neNames);
    Thread.sleep(5 * 1000);
  } catch (e) {
      logger.error("Error while starting supervision on NE " + deviceName + ": ", e);
      throw new RuntimeException("Error while starting supervision on NE {}", deviceName);
  }
}

AltiplanoAMSIntentHelper.prototype.stopSupervision = function (deviceName) {
  var mObjectProxy = createDecoratedMObjectProxy(this, deviceName);
  var Thread = Java.type("java.lang.Thread");
  var neNames = new HashSet();
  neNames.add(deviceName);
  try {
    mObjectProxy.stopSupervision(neNames);
    Thread.sleep(5 * 1000);
  } catch (e) {
      logger.error("Error while stopping supervision on NE " + deviceName + ": ", e);
      throw new RuntimeException("Error while stopping supervision on NE " + deviceName);
  }
}

AltiplanoAMSIntentHelper.prototype.changeIPAddress = function (deviceName, newIpAddress) {
  var mObjectProxy = createDecoratedMObjectProxy(this, deviceName);
  var Thread = Java.type("java.lang.Thread");
  var isErrorIgnored = false;
  try {
    mObjectProxy.changeIPAddress(deviceName, newIpAddress);
    Thread.sleep(5 * 1000);
  } catch (e) {
    var errorMessage = "An error occurred while changing IP Address of NE '" + deviceName + "'";
    if(typeof e.getMessage === 'function'){
      if(e.getMessage().contains("ipAlreadyUsedByNE")){
        if(e.getMessage().contains(deviceName)){
          errorMessage += ". The new IP Address '"+ newIpAddress + "' is identical to the current device"
          isErrorIgnored = true;
        }else {
          errorMessage += ". The new IP Address '"+ newIpAddress + "' is already used by another device"
        }
      }else if(e.getMessage().contains("wrongIpFormat")){
        errorMessage += ". Not a valid IP Address";
      }
    }
    logger.error(errorMessage, e);
    if(!isErrorIgnored){
      throw new RuntimeException(errorMessage);
    }
  }
}

AltiplanoAMSIntentHelper.prototype.getNeRelease = function (deviceName, mObjectProxy){
  logger.debug("Start to get NE Release");
  var neRelease;
  var neSystemMObjectId = "NE System:"+deviceName+":IACM";
  var attrs = ["swEtsiVersion"];
  var attrValues = mObjectProxy.get([neSystemMObjectId], attrs);
  if (attrValues) {
      var values = attrValues.get(neSystemMObjectId);
      neRelease = values.get("swEtsiVersion");
  }
  return neRelease;
}

/**
 * Check if the input NE Release is supported for current Ne Release
 * @param deviceName
 * @param mObjectProxy
 * @param inputRelease
 * Example: checkNeRelease(deviceName, mObjectProxy, "6.2.04")
 * If the current Ne release is matched or newer than input release then return true.
 **/
AltiplanoAMSIntentHelper.prototype.checkNeRelease = function (deviceName, mObjectProxy, inputRelease){
  var neRelease = this.getNeRelease(deviceName, mObjectProxy);
  var neReleaseArr = neRelease.split(".");
  var firstNeReleaseArr = neReleaseArr[0].toUpperCase().replace('R','');
  var inputReleaseArr = inputRelease.split(".");
  var firstInputReleaseArr = inputReleaseArr[0].toUpperCase().replace('R','');
  if ((firstNeReleaseArr == firstInputReleaseArr && neReleaseArr[1] > inputReleaseArr[1]) ||
        (firstNeReleaseArr == firstInputReleaseArr && neReleaseArr[1] == inputReleaseArr[1] && (neReleaseArr[2] && neReleaseArr[2] >= inputReleaseArr[2])) ||
        firstNeReleaseArr >= firstInputReleaseArr + 1 ||
        (firstNeReleaseArr == firstInputReleaseArr && neReleaseArr[1] == inputReleaseArr[1] && !neReleaseArr[2] && !inputReleaseArr[2])) {
    return true;
  }
  return false;
}

/**
 * Get board type from board name
 * @param boardList fx-boards.json
 * @param boardName FGLT-B
 **/
AltiplanoAMSIntentHelper.prototype.getBoardTypeFromBoardName = function (boardList, boardName) {
  if(boardList && boardList.length > 0){
    if(boardName != "" || boardName != undefined || boardName != null){
      for(var i = 0; i < boardList.length; i++){
        var board = boardList[i];
        if(board["board-list"].indexOf(boardName) != -1){
          return board["board-type"];
        }
      }
    }
  }
  return {};
}

AltiplanoAMSIntentHelper.prototype.checkIfReplanWithoutUnplanning = function(deviceName, mObjectProxy, configureBoardType, oldConfigBoardType, configureBoardList, replanBoardList) {
    if(oldConfigBoardType && (configureBoardType != oldConfigBoardType)){
      var boardType = this.getBoardTypeFromBoardName(configureBoardList, configureBoardType);
      if(!boardType){
          return false;
      }
      var selectReplanBoards;
      if(replanBoardList && replanBoardList.length > 0){
          for(var i = 0; i < replanBoardList.length; i++ ){
              var replanBoard = replanBoardList[i];
              if(replanBoard["board-type"] == boardType){
                  selectReplanBoards = replanBoard["board-replan"];
              }
          }
      }
      //Check for each release and board to replan
      if(selectReplanBoards && selectReplanBoards.length > 0){
          for(var j = 0; j < selectReplanBoards.length; j++){
              var selectReplanBoard = selectReplanBoards[j];
              var fromRelease = selectReplanBoard["from-release"];
              var isSupportRelease = this.checkNeRelease(deviceName, mObjectProxy, fromRelease);
              if(isSupportRelease){
                  var releaseReplanBoards = selectReplanBoard["boards"];
                  for(var k = 0; k < releaseReplanBoards.length; k++){
                      var releaseReplanBoard = releaseReplanBoards[k];
                      var fromBoards = releaseReplanBoard["from"];
                      var toBoards = releaseReplanBoard["to"];
                      if(fromBoards.indexOf(oldConfigBoardType) != -1 && toBoards.indexOf(configureBoardType) != -1){
                          return true;
                      }
                  }
              }
          }
      }
  }
  return false;
}

/*
AltiplanoAMSIntentHelper.prototype.checkIfChangeCageModeWithoutUnplanning = function(deviceName, mObjectProxy, configureBoardType, oldConfigBoardType, cageMode, oldCageMode, applicableBoardList, cageModeUpdatePosibilities) {
  if(oldConfigBoardType && (configureBoardType === oldConfigBoardType) && applicableBoardList.indexOf(configureBoardType) != -1 && cageMode != undefined && oldCageMode != undefined && cageMode != oldCageMode){
    var isSupportRelease = this.checkNeRelease(deviceName, mObjectProxy, "6.5");
    if(isSupportRelease){
      for(var k = 0; k < cageModeUpdatePosibilities.length; k++){
        var cageModeUpdatePosibility = cageModeUpdatePosibilities[k];
        var fromCageMode = cageModeUpdatePosibility["from"];
        var toCageMode = cageModeUpdatePosibility["to"];
        if(fromCageMode.indexOf(oldCageMode) != -1 && toCageMode.indexOf(cageMode) != -1){
            return true;
        }
      }
    }
  }
  return false;
}
*/

/**
  * @param deviceName
  * @param mObjectId id of MObject which include the attribute e.g., /configurationProfileNr=SIP_Client/version=1
  * @param attributeName names of the attributes which values will be retrieved e.g., sipClientProfile
 **/
AltiplanoAMSIntentHelper.prototype.getSipAttribute = function(deviceName, mobjectId, attributeName){
  var mObjectProxy = createDecoratedMObjectProxy(this, deviceName);
  var domain = "application.sip";
  var service = "configurationProfile";
  try {
    var result = mObjectProxy.getAttribute(domain, service, mobjectId, attributeName);
  } catch (e) {
    logger.error("Error while getting Sip Attribute on NE " + deviceName + ": ", e);
    throw new RuntimeException("Failed to get Sip Attribute.");
  }
  return result;
};

/**
  * CIDR Conversion
  * @param netmask 255.255.255.1
 **/
AltiplanoAMSIntentHelper.prototype.cidrConversion = function(netmask){
    var maskNodes = netmask.match(/(\d+)/g);
    var cidr = 0;
    for(var i in maskNodes)
    {
      cidr += (((maskNodes[i] >>> 0).toString(2)).match(/1/g) || []).length;
    }
    return cidr;
}

//////// MObject Proxy and Factory Function for Exception Message Handling
function createDecoratedMObjectProxy(AMSFwk, targetDevice, targetManager) {
  var moProxy = new MObjectProxy(AMSFwk, targetDevice, targetManager);
  return AMSFwk.wrapErrorHandler(moProxy, "MObjectProxy");
}

/**
 * Proxy that wraps the creation of the AMSProxy object, and provices CRUD MObject operations
 **/

function MObjectProxy(AMSFwk, targetDevice, targetManager) {
  if(!targetManager) {
    this.amsProxy = this.getAmsProxy(targetDevice);
  }
  else{
    this.amsProxy = this.getAmsProxyByManagerName(targetManager);
  }
  if(AMSFwk != null)
    {
  		this.AMSFwk = AMSFwk;
    }
  if(targetDevice != null) {
  	this.deviceId = targetDevice;
   }
}

/**
 * @param objectId MObject Full Friendly Name e.g., ONT:NENAME:IACM:R1.S1.LT1.PON1.ONT1
 * @param attributes Attributes to be used while creating the MObject
 **/
MObjectProxy.prototype.create = function (objectId, attributes) {
  logger.debug("Creating {} with attributes {}", objectId, apUtils.protectSensitiveDataLog(attributes));
  var formattedAttributes = this.getAttributeValuesMap(attributes);
  var result = null;
  var amsProxy = this.amsProxy;
  ibnLockService.executeWithReadLockOn(this.deviceId, function() {
		result = amsProxy.create(objectId, formattedAttributes);
	}, function() {
		throw new RuntimeException("GC is in progress");
	});
  return result;
};

/**
 * @param neType e.g FX-I
 * @param release e.g 6.2
 * @param attributes Attributes to be used while creating NE
 * {"name":"50-1-0-105","groupName":"Network","partitionAccessProfile":"defaultPAP","IACM__ipAddress":"50.1.0.105","IACM__snmpProfile_id":"public","IHUB__snmpProfile_id":"ihub"}
 */
MObjectProxy.prototype.createNe = function (neType, release, attributes) {
  logger.debug("Creating NE {} with attributes {}", neType, apUtils.protectSensitiveDataLog(attributes));
  var formattedAttributes = this.getAttributeValuesMap(attributes);
  var amsProxy = this.amsProxy;
  return amsProxy.createNe(neType, release, formattedAttributes);
};

/**
 * @param groupName e.g Network/North America
 */
MObjectProxy.prototype.createNeGroup = function (groupName) {
  logger.debug("Creating NE Group with name {}", groupName);
  var amsProxy = this.amsProxy;
  return amsProxy.createNeGroup(groupName);
};

/**
 * @param groupName e.g Network/North America
 */
MObjectProxy.prototype.isNeGroupExisting = function (groupName) {
  logger.debug("Check if NE Group name {} exists", groupName);
  var result = null;
  var amsProxy = this.amsProxy;
  result = amsProxy.isNeGroupExisting(groupName);
  return result;
};

/**
 * @param groupName e.g Network/North America
 */
MObjectProxy.prototype.deleteNeGroup = function (groupName) {
  logger.debug("Deleting NE Group with name {}", groupName);
  var amsProxy = this.amsProxy;
  return amsProxy.deleteNeGroup(groupName);
};

/**
 * @param neList e.g {"NE1","NE2"}
 */
MObjectProxy.prototype.startSupervision = function (neList){
    logger.debug("Starting supervision on {}", JSON.stringify(neList));
    var amsProxy = this.amsProxy;
    return amsProxy.startSupervision(neList);
}

/**
 * @param neList e.g {"NE1","NE2"}
 */
MObjectProxy.prototype.stopSupervision = function (neList){
    logger.debug("Stopping supervision on {}", JSON.stringify(neList));
    var amsProxy = this.amsProxy;
    return amsProxy.stopSupervision(neList);
}

/**
 * @param 
 */
 MObjectProxy.prototype.changeIPAddress = function (deviceName, newIpAddress){
  logger.debug("Changing IP Address on device '{}' to new IP Address: '{}'", deviceName, newIpAddress);
  var amsProxy = this.amsProxy;
  return amsProxy.changeIPAddress(deviceName, newIpAddress);
}

/**
 * @param objectId MObject Full Friendly Name e.g., ONT:NENAME:IACM:R1.S1.LT1.PON1.ONT1
 * @param attributes Attributes to be updated on the MObject
 **/
MObjectProxy.prototype.update = function (objectId, attributes) {
  logger.debug("Updating {} with attributes {}", objectId, apUtils.protectSensitiveDataLog(attributes));
  var formattedAttributes = this.getAttributeValuesMap(attributes);
  var result = null;
  var amsProxy = this.amsProxy;
  ibnLockService.executeWithReadLockOn(this.deviceId, function() {
		result = amsProxy.update(objectId, formattedAttributes);
	}, function() {
		throw new RuntimeException("GC is in progress");
	});
  return result;
};

/**
 * @param bulkAttributes Map<string, Map<string,object>>
 **/
 MObjectProxy.prototype.bulkUpdate= function(bulkAttributes){
  logger.debug("Updating bulk instance {} ", apUtils.protectSensitiveDataLog(bulkAttributes));
  var result = null;
  var amsProxy = this.amsProxy;
  ibnLockService.executeWithReadLockOn(this.deviceId, function() {
		result = amsProxy.bulkUpdate(bulkAttributes);
	}, function() {
		throw new RuntimeException("GC is in progress");
	});
  return result;
}

/**
 * @param objectId MObject Full Friendly Name e.g., ONT:NENAME:IACM:R1.S1.LT1.PON1.ONT1
 **/
MObjectProxy.prototype.delete = function (objectId) {
  logger.debug("Deleting {}", objectId);
  var result = null;
  var amsProxy = this.amsProxy;
  ibnLockService.executeWithReadLockOn(this.deviceId, function() {
		result = amsProxy.delete(objectId);
	}, function() {
		throw new RuntimeException("GC is in progress");
	});
  return result;
};

/**
 * @param objectId MObject Full Friendly Name e.g., ONT:NENAME:IACM:R1.S1.LT1.PON1.ONT1
 **/
MObjectProxy.prototype.isObjectExist = function (objectId) {
  logger.debug("Checking if Object {} exists", objectId);
  var result = null;
  var amsProxy = this.amsProxy;
  ibnLockService.executeWithReadLockOn(this.deviceId, function() {
		result = amsProxy.checkIfExists(objectId);
	}, function() {
		throw new RuntimeException("GC is in progress");
	});
  return result;
}

/**
 * @param objectId MObject Full Friendly Name e.g., ONT:NENAME:IACM:R1.S1.LT1.PON1.ONT1
 * @param actionName The name of the action to be submitted to MObject.execute method
 * @param actionArgs The arguments to be passed for the execution of the action
 **/
MObjectProxy.prototype.invokeAction = function (objectId, actionName, actionArgs) {
  if (!actionArgs) {
    actionArgs = {};
  }
  objectId = encodeURIComponent(objectId);
  logger.debug("Invoking action {} on object {} with args {}", actionName, objectId, actionArgs);
  var result = null;
  var amsProxy = this.amsProxy;
  ibnLockService.executeWithReadLockOn(this.deviceId, function() {
		result = amsProxy.invokeAction(actionName, objectId, actionArgs);
	}, function() {
		throw new RuntimeException("GC is in progress");
	});
  return result;
}

/**
 * @param objectIds Set of MObject Full Friendly Name e.g., ONT:NENAME:IACM:R1.S1.LT1.PON1.ONT1
 * @param attributes Attributes to be used while creating the MObject
 **/
MObjectProxy.prototype.get = function (objectIds, attributes) {
  var objectIdSet = this.setOf(objectIds);
  var attributeSet = this.setOf(attributes);
  logger.debug("Fetching {} attributes {}", objectIdSet, attributeSet);

  var result = null;
  var amsProxy = this.amsProxy;
  ibnLockService.executeWithReadLockOn(this.deviceId, function() {
		result = amsProxy.getAttributes(objectIdSet, attributeSet);
	}, function() {
		throw new RuntimeException("GC is in progress");
	});
  return result;
};


/**
  * @param domain should be same as that of a domain defined in AMS
  * @param service should be same as that of a service defined in AMS
  * @param mObjectId id of MObject which include the attribute e.g., /configurationProfileNr=SIP_Client/version=1
  * @param attributeName names of the attributes which values will be retrieved e.g., sipClientProfile
 **/
MObjectProxy.prototype.getAttribute = function(domain, service, mObjectId, attributeName){
  logger.debug("Fetching {} attribute {}", mObjectId, attributeName);
  var result = null;
  var amsProxy = this.amsProxy;
  ibnLockService.executeWithReadLockOn(this.deviceId, function() {
		result = amsProxy.getAttribute(domain, service, mObjectId, attributeName);
	}, function() {
		throw new RuntimeException("GC is in progress");
	});
  return result;
};

/**
 * @param objectType The object type of the children to be fetched. For e.g., "Ethernet Port"
 * @param friendlyNameOfParent
 **/
MObjectProxy.prototype.getAllChildrenOfType = function (objectType, friendlyNameOfParent) {
  logger.debug("Fetching children of {} of type {}", friendlyNameOfParent, objectType);
  var result = null;
  var amsProxy = this.amsProxy;
  ibnLockService.executeWithReadLockOn(this.deviceId, function() {
		result = amsProxy.getAllChildrenOfType(objectType, friendlyNameOfParent);
	}, function() {
		throw new RuntimeException("GC is in progress");
	});
  return result;
}

MObjectProxy.prototype.getAttributeValuesMap = function (attributes) {
  var keys = Object.keys(attributes);
  var formattedAttributes = {};
  for each(var key in keys) {
    if (Array.isArray(attributes[key])) {
      var arrayType = Java.type("java.lang.Object[]");
      var attributeVal = attributes[key];
      for (var attrib in attributeVal) {
        if (typeof attributeVal[attrib] === "object") {
          attributeVal[attrib] = this.mapOfJson(attributeVal[attrib]);
        }
      }
      attributeVal = Java.to(attributeVal, arrayType);
      formattedAttributes[key] = attributeVal;
    }
    else {
      formattedAttributes[key] = attributes[key];
    }
  }
  return formattedAttributes;
}

MObjectProxy.prototype.mapOfJson = function (jsonObj) {
  var map = new HashMap();
  var keys = Object.keys(jsonObj);
  for each(var key in keys) {
    map.put(key, jsonObj[key]);
  }
  return map;
}

MObjectProxy.prototype.setOf = function (collection) {
  var set = new HashSet();
  for (var element in collection) {
    set.add(collection[element]);
  }
  return set;
}

MObjectProxy.prototype.getAmsProxy = function (deviceName) {
  var managerInfo = apUtils.getManagerInfoFromEsAndMds(deviceName, false);
  apUtils.checkManagerConnectionState(null, managerInfo);
  return proxyService.getAmsProxy(managerInfo);
}

MObjectProxy.prototype.getAmsProxyByManagerName = function (managerName) {
	var managerInfo;
	managerInfo = mds.getManagerByName(managerName);
	apUtils.checkManagerConnectionState(null, managerInfo);
	return proxyService.getAmsProxy(managerInfo);
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
function SNMPIntentPipelineEngine(AMSFwk, targetName, devicesConfig, intentConfigArgs, desiredNetworkState, currentTopology, pipelineContext) {

  var amsFwk = AMSFwk;
  var target = targetName;
  var intentConfigArgs = intentConfigArgs;
  var networkState = desiredNetworkState;
  var pipelineContext = pipelineContext;
  pipelineContext.isSNMPIntentPipelineEngineCalled = true;
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
      deviceProxy = createDecoratedMObjectProxy(amsFwk, deviceId, targetManager);
      currentDevice = deviceId;
      auditor = DeviceAuditor(deviceProxy);
      logger.debug("Auditing Device {}", deviceId);
      pipelineContext.deviceProxy = deviceProxy;
      pipelineContext.networkState = networkState;
    };

    this.getResult = function () {
      return report;
    }

    this.processInstance = function (step, instance) {
      if(step.bulkInstance && instance.length !== undefined){
        for(var id in instance){
            this.processInstance(step, instance[id]);
        }
      }
      else {
      var configData = getConfigurationData(target, step, instance, intentConfigArgs);
      var objectId = configData.identifier;
      var attributesForExistingAudit = getAttributeForExistingAudit(target, step, instance, intentConfigArgs);
      if (configData.audit === "false") {
        logger.debug("Skipping audit for {}", objectId);
        return true;
      }
      var attributeValues = getAuditableAttributes(configData);
      var attributes = Object.keys(attributeValues);
      logger.debug("Auditing Object {} with attributes {}", objectId, apUtils.protectSensitiveDataLog(attributes));
      var auditResult = auditor(objectId, attributeValues,attributesForExistingAudit, undefined, step.attributeConfiguration);
      if (pipelineContext.networkState !== "delete") {
        if (!auditResult.configured) {
            report.addMisAlignedObject(auditFactory.createMisAlignedObject(objectId, false, currentDevice));
            return false;
        }
      } else {
        if (!auditResult.configured && (!configData.directlyDeleted || (configData.directlyDeleted && configData.directlyDeleted == "true"))) {
            if (auditResult.isUndesired) {
                report.addMisAlignedObject(auditFactory.createMisAlignedObject(objectId, false, currentDevice, true));
            } else {
                report.addMisAlignedObject(auditFactory.createMisAlignedObject(objectId, false, currentDevice));
            }
            return false;
        }
      }

      if (auditResult.misAlignedAttributes) {
        for (var misalignedAttr in auditResult.misAlignedAttributes) {
          var attrResult = auditResult.misAlignedAttributes[misalignedAttr];
          if(typeof attrResult.expectedValue === 'object') {
              report.addMisAlignedAttribute(
                      auditFactory.createMisAlignedAttribute(
                        attrResult.name, JSON.stringify(attrResult.expectedValue), JSON.stringify(attrResult.actualValue), attrResult.deviceName));
          }
          else{
              report.addMisAlignedAttribute(
                auditFactory.createMisAlignedAttribute(
                  attrResult.name, attrResult.expectedValue, attrResult.actualValue, attrResult.deviceName));
          }
        }
      }
      return true;
      }
    };

    function getAuditableAttributes(configData) {
      var attributes = {};
      var attributeIdx;
      for (attributeIdx in configData.attributes) {
        var auditable = configData.attributes[attributeIdx].audit;
        var useObjectValue = "false";
        var keySet = [];
        if(configData.attributes[attributeIdx].useObjectValue){
          useObjectValue = configData.attributes[attributeIdx].useObjectValue;
        }
        if(Array.isArray(configData.attributes[attributeIdx].keySet)){
          keySet = configData.attributes[attributeIdx].keySet;
        }
        if (auditable == undefined || auditable === "true") {
          var attribute = configData.attributes[attributeIdx];
          var attributeInstance = {value: attribute['value'], useObjectValue: useObjectValue, fullFn: attribute['fullFn'], keySet: keySet};
          if (attribute["ui-mapping"] && attribute["ui-mapping"][attribute['value']]) {
            attributeInstance = {
              value: attribute["ui-mapping"][attribute['value']],
              useObjectValue: useObjectValue,
              fullFn: attribute['fullFn'],
              keySet: keySet,
              attributeUIMapping: attribute["ui-mapping"]
            };
          }
          if(attribute.ignoreTimezone){
            attributeInstance["ignoreTimezone"] = true;
          }
          if(attribute.ignoreSortToAudit){
            attributeInstance["ignoreSortToAudit"] = true;
          }
          if(attribute.hasCaptionInValue){
            attributeInstance["hasCaptionInValue"] = true;
          }
          if(attribute.getShortFn){
            attributeInstance["getShortFn"] = true;
          }
          if(attribute.unsedObjectKeys){
            attributeInstance["unsedObjectKeys"] = attribute.unsedObjectKeys;
          }
          attributes[attribute['name']] = attributeInstance;
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

    return function (objectId, expectedAttributesAndValues, attributesForExistingAudit, bulkInstanceProfiles, attributeConfiguration, isBulkAudit, bulkAuditAttributeValues) {
      logger.debug("Auditing Object {} with expected attribute values :{} and attributesForExistingAudit {}", objectId, apUtils.protectSensitiveDataLog(expectedAttributesAndValues), apUtils.protectSensitiveDataLog(attributesForExistingAudit));
      var isConfigured = true;
      var isUndesired = false;
      var misAlignedAttributes = {};
      if(!isBulkAudit){
        if (networkState !== "delete") {
          if(attributeConfiguration == false){
            return { configured: deviceProxy.isObjectExist(objectId), misAlignedAttributes: misAlignedAttributes };
          }
          if (Object.keys(expectedAttributesAndValues).length <= 0) {
            return { configured: isConfigured, misAlignedAttributes: misAlignedAttributes };
          }
        }
        var existenceObjectInstanceMap = getObjectInstanceMapFromBulkInstances(objectId, expectedAttributesAndValues, attributesForExistingAudit, bulkInstanceProfiles, deviceProxy);

        var isUsingGetAttributeFroExistenceChecking = checkIfAbleToUseGetAttributeForExistenceChecking(expectedAttributesAndValues, attributesForExistingAudit);
        if (!isUsingGetAttributeFroExistenceChecking) {
          var isObjectExist = deviceProxy.isObjectExist(objectId); //define a new variable to pass SONAR check and maven build failure as "duplicate code"
          if (isObjectExist) {
            isConfigured = (networkState === "delete") ? false : true;
            if (networkState != "delete") {//audit attributes
              var attributes = Object.keys(expectedAttributesAndValues);
              var auditAttrResult = auditObjectAttributes(deviceProxy, objectId, attributes, expectedAttributesAndValues, null, existenceObjectInstanceMap);
              misAlignedAttributes = auditAttrResult.misAlignedAttributes;
            } else {
                isUndesired = true;
            }
          } else { //object does not exist
            isConfigured = (networkState === "delete") ? true : false;
          }
        } else {
          if(networkState === "delete"){ // only use isObjectExist for delete
            isConfigured = !deviceProxy.isObjectExist(objectId);
            if (!isConfigured) {
              isUndesired = true;
            }

          }
          else{ // during create/update in Sync
            try{
              var attributes = Object.keys(expectedAttributesAndValues);
              var auditResult = auditObjectAttributes(deviceProxy, objectId, attributes, expectedAttributesAndValues, attributesForExistingAudit, existenceObjectInstanceMap);
              misAlignedAttributes = auditResult.misAlignedAttributes;
              isConfigured = auditResult.configured; // MObject exists in case of no exception during get attributes call
            }
            catch(e){
              if(typeof e.getMessage === 'function' && e.getMessage().contains("does not exist")){
                isConfigured = false; // MObject does not exist
              }
              else{
                throw e; // Other AMS Exception
              }
              }
          }
        }


        // isObjectExist AMS call is removed here during Audit

      /* if(networkState === "delete"){ // only use isObjectExist for delete
          isConfigured = !deviceProxy.isObjectExist(objectId);
        }
        else{ // during create/update in Sync
          try{
            var attributes = Object.keys(expectedAttributesAndValues);
            var auditResult = auditObjectAttributes(deviceProxy, objectId, attributes, expectedAttributesAndValues);
            misAlignedAttributes = auditResult.misAlignedAttributes;
            isConfigured = auditResult.configured; // MObject exists in case of no exception during get attributes call
          }
          catch(e){
            if(e.getMessage().contains("does not exist")){
              isConfigured = false; // MObject does not exist
            }
            else{
              throw e; // Other AMS Exception
            }
          }
        }*/
      } else {
        var objectIdArray = objectId;
        var auditResults = {};
        if (networkState !== "delete") {
          if(attributeConfiguration == false){
            objectIdArray.forEach(function(id){
              auditResults[id] = { configured: deviceProxy.isObjectExist(id), misAlignedAttributes: misAlignedAttributes }
            })
            return auditResults;
          }
            if (Object.keys(expectedAttributesAndValues).length <= 0) {
              objectIdArray.forEach(function(id){
                auditResults[id] = { configured: isConfigured, misAlignedAttributes: misAlignedAttributes }
              })
              return auditResults;
            }
        }
        var attributes = Object.keys(expectedAttributesAndValues);
          var existenceObjectInstanceMap = deviceProxy.get(objectIdArray, attributes);
          var isUsingGetAttributeFroExistenceChecking = checkIfAbleToUseGetAttributeForExistenceChecking(expectedAttributesAndValues, attributesForExistingAudit);
          if (!isUsingGetAttributeFroExistenceChecking) {
            objectIdArray.forEach(function(id){
              attributes = Object.keys(bulkAuditAttributeValues[id]);
              isUndesired = false;
              misAlignedAttributes = {};
              if (deviceProxy.isObjectExist(id)) {
                isConfigured = (networkState === "delete") ? false : true;
                if (networkState != "delete") {//audit attributes
                  var auditAttrResult = auditObjectAttributes(deviceProxy, id, attributes, bulkAuditAttributeValues[id], null, existenceObjectInstanceMap);
                  misAlignedAttributes = auditAttrResult.misAlignedAttributes;
                } else {
                    isUndesired = true;
                }
              } else { //object does not exist
                isConfigured = (networkState === "delete") ? true : false;
              }
              auditResults[id] = { configured: isConfigured, misAlignedAttributes: misAlignedAttributes , isUndesired : isUndesired};
            })
          } else {
            objectIdArray.forEach(function(id){
              attributes = Object.keys(bulkAuditAttributeValues[id]);
              isUndesired = false;
              misAlignedAttributes = {};
              if(networkState === "delete"){ // only use isObjectExist for delete
                isConfigured = !deviceProxy.isObjectExist(id);
                if (!isConfigured) {
                  isUndesired = true;
                }
                auditResults[id] = { configured: isConfigured, misAlignedAttributes: misAlignedAttributes , isUndesired : isUndesired};
              }
              else{ // during create/update in Sync
                try{
                  var auditResult = auditObjectAttributes(deviceProxy, id, attributes, bulkAuditAttributeValues[id], attributesForExistingAudit, existenceObjectInstanceMap);
                  misAlignedAttributes = auditResult.misAlignedAttributes;
                  isConfigured = auditResult.configured; // MObject exists in case of no exception during get attributes call
                }
                catch(e){
                  if(typeof e.getMessage === 'function' && e.getMessage().contains("does not exist")){
                    isConfigured = false; // MObject does not exist
                  }
                  else{
                    throw e; // Other AMS Exception
                  }
                }
                auditResults[id] = { configured: isConfigured, misAlignedAttributes: misAlignedAttributes , isUndesired : isUndesired};
              }
            })
          }
          return auditResults;
      }
      return { configured: isConfigured, misAlignedAttributes: misAlignedAttributes , isUndesired : isUndesired};
    };

    function getObjectInstanceMapFromBulkInstances(objectId, expectedAttributesAndValues, attributesForExistingAudit, bulkInstanceProfiles, deviceProxy) {
      var existenceObjectInstanceMap;
      if (bulkInstanceProfiles && bulkInstanceProfiles[objectId]) {
        var attributesForAudit = Object.keys(expectedAttributesAndValues);
        if (attributesForExistingAudit && attributesForExistingAudit.length > 0) {
          attributesForExistingAudit.forEach(function(item) {
            if (attributesForAudit.indexOf(item) == -1) {
              attributesForAudit.push(item);
            }
          });
        }
        existenceObjectInstanceMap =  new HashMap();
        var actualObjectValuesMap = bulkInstanceProfiles[objectId];
        var actualObjectValuesJson = {};
        attributesForAudit.forEach(function(attribute) {
          actualObjectValuesJson[attribute] = actualObjectValuesMap[attribute];
        });
        existenceObjectInstanceMap.put(objectId, deviceProxy.mapOfJson(actualObjectValuesJson));

      }
      return existenceObjectInstanceMap;
    }

    function checkIfAbleToUseGetAttributeForExistenceChecking(expectedAttributesAndValues, attributesForExistingAudit) {
        if (attributesForExistingAudit && attributesForExistingAudit.length > 0) {
            var attributes = Object.keys(expectedAttributesAndValues);
            if (attributes) {
                var isAllExisting = true;
                for (var attributesForExistingAuditKey in attributesForExistingAudit) {
                    if (attributes.indexOf(attributesForExistingAudit[attributesForExistingAuditKey]) < 0 ) {
                        isAllExisting = false;
                    }
                }
                return isAllExisting;
            }
        }
        return false;
    }

    /**
     * 
     * @param {*} actualAttributes 
     * @returns false if object doesn't exist and true if it is existing
     */
 
    function checkANonExistingObjectByItsAttributes(actualAttributesAndValues, attributesForExistingAudit) {
      if (actualAttributesAndValues && actualAttributesAndValues != null && actualAttributesAndValues.size() > 0 && attributesForExistingAudit && attributesForExistingAudit.length > 0) {
        for each(var attrKey in actualAttributesAndValues.keySet()){
            if (attributesForExistingAudit.indexOf(attrKey) >= 0 && actualAttributesAndValues.get(attrKey) === '--') {
              return false;// assume that if any the attribute values are "--" , the object doesn't exist
            }
          }
          return true;
        }
      return true; // old behavior
    }

    function mergeAttributes(attributes,attributesForExistingAudit) {
        for (var attributesForExistingAuditKey in attributesForExistingAudit) {
            if (attributes.indexOf(attributesForExistingAudit[attributesForExistingAuditKey]) < 0) {
                attributes.push(attributesForExistingAudit[attributesForExistingAuditKey]);
            }
        }
    }
    /**
     * 
     * @param {*} deviceProxy 
     * @param {*} object 
     * @param {*} attributes 
     * @param {*} expectedValues 
     * @returns a object with 2 keys configured and misAlignedAttributes
     */
    function auditObjectAttributes(deviceProxy, object, attributes, expectedValues, attributesForExistingAudit, actualObjectValues) {
      var misAlignedAttributes = [];
      if (Object.keys(attributes).length <= 0) {
         return  {
             configured : true,
             misAlignedAttributes : misAlignedAttributes
           };
      }
      if (!actualObjectValues) {
        var objectIds = [object];
        mergeAttributes(attributes, attributesForExistingAudit);
        try {
          actualObjectValues = deviceProxy.get(objectIds, attributes);
        } catch (error) {
          logger.error("Error while fetching attributes: {}", error);
        }
      }
      logger.debug("Actual Object Values {}", apUtils.protectSensitiveDataLog(actualObjectValues));
      var actualValues = actualObjectValues ? actualObjectValues[object] : null;

      // new check object existing from web-fwk in 21.9
      if (attributesForExistingAudit && attributesForExistingAudit.length > 0 && !checkANonExistingObjectByItsAttributes(actualValues, attributesForExistingAudit)) {
        return {
          configured : false,
          misAlignedAttributes : misAlignedAttributes
        };
      }
      actualValues = (actualValues == null) ? {} : actualValues;

      for (var attribute in attributes) {
        var actualValue = actualValues[attributes[attribute]] == null ? "" : actualValues[attributes[attribute]];
        var useObjectValue = expectedValues[attributes[attribute]].useObjectValue;
        var keySet = expectedValues[attributes[attribute]].keySet;
        var attributeUIMapping = expectedValues[attributes[attribute]].attributeUIMapping;
        if (attributeUIMapping && attributeUIMapping[actualValue] && actualValue != null) {
          actualValue = attributeUIMapping[actualValue];
        }
        try {
          var actualValue = JSON.parse(actualValue);
          if (Array.isArray(actualValue)) {
            actualValue = normalizeActualValueArray(actualValue);
          } 
          /*
              Use to get attribute's value from this object
              {
                "shortFn": "defaultSipClient, 1",
                "fullFn": "SIP Client Config Profile ( defaultSipClient, 1 )",
                "value": "/verSipClientConfigProfileNr=2"
              }
          */
          else if (useObjectValue && useObjectValue === "false" && actualValue.fullFn) {
              if (!expectedValues[attributes[attribute]].fullFn) {
                if(expectedValues[attributes[attribute]].getShortFn){ //get "shortFn": "defaultSipClient, 1",
                  actualValue = getShortFn(actualValue.shortFn);
                }else{
                  actualValue = getFullFn(new String(actualValue.fullFn));
                }
              }
              else {
                    actualValue = new String(actualValue.fullFn);
              }
          }
          else if (useObjectValue && useObjectValue === "true" && actualValue.value){
            actualValue = actualValue.value;
          }
          else if(keySet && keySet.length > 0){
            var strArr = [];
            for(var k in keySet){
              var inputValue = actualValue[keySet[k]];
              var strFormat = keySet[k] + "=" + inputValue; // key=value
              strArr.push(strFormat);
            }
            actualValue = "{" + strArr.join(", ") + "}";
          }
        } catch (error) {
          //Unable to parse as JSON. Must be a non-text value. Ignore.
        }
        if(expectedValues[attributes[attribute]].ignoreTimezone){
          actualValue = actualValue.slice(0,19);
        }
        var ignoreSortToAudit;
        if(expectedValues[attributes[attribute]].ignoreSortToAudit){
          ignoreSortToAudit = true;
        }
        var expectedValue = expectedValues[attributes[attribute]].fullFn ? expectedValues[attributes[attribute]].fullFn : expectedValues[attributes[attribute]].value;
        var expectedValueToBeCompared = expectedValue; // default
        var hasCaptionInValue = expectedValues[attributes[attribute]].hasCaptionInValue;
        if(hasCaptionInValue){
          if(expectedValue.match(/\(([^)]+)\)/)){
            expectedValueToBeCompared = expectedValue.match(/\(([^)]+)\)/)[1]; // get value in round brackets eg: "value (value1)" => value1
          }
        }
        var unusedObjectKeys = expectedValues[attributes[attribute]].unsedObjectKeys;
        if(unusedObjectKeys && unusedObjectKeys.length >0){
          removeUnusedObjectKeys(actualValue, unusedObjectKeys);
        }
        if (amsFwk.isDifferent(actualValue, expectedValueToBeCompared)) {
          var misAlignedAttribute = {};
          misAlignedAttribute.deviceName = object;
          misAlignedAttribute.name = attributes[attribute];
          misAlignedAttribute.expectedValue = expectedValue;
          if(ignoreSortToAudit){
            misAlignedAttribute.actualValue = actualValue;
          }else {
            misAlignedAttribute.actualValue = amsFwk.sortActualValue(actualValue, expectedValue);
          }
          misAlignedAttributes.push(misAlignedAttribute);
        }
      }
       return  {
         configured : true,
         misAlignedAttributes : misAlignedAttributes
       };
    }

    function normalizeActualValueArray(actualValue) {
      for (var idx in actualValue) {
        if (typeof actualValue[idx] !== "object") {
          continue;
        }
        if (actualValue[idx].fullFn) {//[{shortFn:xyz, fullFn:xyz}]
          actualValue[idx] = getFullFn(new String(actualValue[idx].fullFn));
        } else {//[{"key":{shortFn:xyz, fullFn:xyz}}]
          var actualValueKeys = Object.keys(actualValue[idx]);
          for each(var valueKey in actualValueKeys) {
            if (actualValue[idx][valueKey].fullFn) {
              actualValue[idx][valueKey] = getFullFn(new String(actualValue[idx][valueKey].fullFn));
            }
          }
        }
      }
      return actualValue;
    }

    function getFullFn(fullFn) {
      var actualValue;
      if (fullFn.indexOf("(") != -1) { // e.g., QoS Ingress Profile
        actualValue = fullFn.substring(0, fullFn.indexOf("(")).trim();
      } else {
        actualValue = new String(fullFn);
      }
      return actualValue;
    }

    function getShortFn(shortFn) {
      var actualValue;
      if (shortFn && shortFn.indexOf(",") != -1) { //  "shortFn": "publicsnmp, V2",
        actualValue = shortFn.substring(0, shortFn.indexOf(",")).trim();
      } else {
        actualValue = new String(shortFn);
      }
      return actualValue;
    }

    function removeUnusedObjectKeys(data, unusedObjectKeys){
      if(Array.isArray(data)){
        data.forEach(function(value){
          removeUnusedObjectKeys(value, unusedObjectKeys);
        });
      }else if (typeof data === 'object'){
        Object.keys(data).forEach(function(key){
          if(unusedObjectKeys.indexOf(key) > -1 ){
            delete data[unusedObjectKeys[unusedObjectKeys.indexOf(key)]];
          }else if(Array.isArray(data[key]) || typeof data[key] === 'object'){
            removeUnusedObjectKeys(data[key], unusedObjectKeys);
          }
        });
      }
      return data;
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
    var isIgnoreConfig = false;
    for (var device in devices) {
      if(devices[device].isIgnoreConfig){
        isIgnoreConfig = true;
        break;
      }
      if (devices[device].preSynchronize) {
        var preSyncResult = amsFwk.getPropertyData(devices[device].preSynchronize, [target, intentConfigArgs, topology]);
        logger.debug("Presync result {}", preSyncResult);
        if (preSyncResult.result === false) {
          logger.debug("Presync failed for device {}", device);
          preSyncSuccess = false;
          preSyncError = preSyncResult.errorDetail;
        }
      }
    }

    var result;
    if (preSyncSuccess && isIgnoreConfig) {
      result = synchronizeResultFactory.createSynchronizeResult();
      result.setSuccess(true);
    } else if(preSyncSuccess){
      var synchronizer = new DeviceSynchronizer();
      processPipeline(synchronizer);
      result = synchronizer.getResult();
    } else {
      result = synchronizeResultFactory.createSynchronizeResult();
      result.setSuccess(false);
      result.setErrorDetail(preSyncError);
    }
    //irrespective of the presync result, save the int configuration in XtraInfo
    for (var device in devices) {
      apUtils.setTopologyExtraInfo(topology, amsFwk.intentTypeObject.stageName + "_" + device + "_ARGS", JSON.stringify(intentConfigArgs));
      if(devices[device].storeLastConfig){
        logger.debug("Storing lastIntentConfigArgs to topology {}", apUtils.protectSensitiveDataLog(intentConfigArgs));
        apUtils.setTopologyExtraInfo(topology, "lastIntentConfigArgs", JSON.stringify(intentConfigArgs));
      }
    }
    result.setTopology(topology);
    result.getTopology().setDependencyInfo(topology.getDependencyInfo());
    if(!isIgnoreConfig){
      for (var device in devices) {
        if(devices[device].postSynchronize) {
          logger.debug("start Postsync");
          try {
            result = devices[device].postSynchronize(pipelineContext, result, topology);
          } catch (e) {
            result.setSuccess(false);
            result.setErrorCode("ERR-100");
            result.setErrorDetail(e);
          }
          logger.debug("Postsync result : {}", apUtils.protectSensitiveDataLog(result));
        }
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
    logger.debug("Initialized Device Synchronizer");
    var result = synchronizeResultFactory.createSynchronizeResult();
    pipelineContext.topology = { step: {}, topologyObjects: [] };

    /**
     * This should be called before calling the processInstance
     **/
    this.setDeviceId = function (deviceId, targetManager) {
      deviceProxy = createDecoratedMObjectProxy(amsFwk, deviceId, targetManager);
      auditor = DeviceAuditor(deviceProxy);
      pipelineContext.deviceProxy = deviceProxy;
      pipelineContext.networkState = networkState;
      logger.debug("Synchronizing Device {}", deviceId);
    };

    /**
     * Synchronizes an instance based on the desired network state. Also builds topology for relavant network states.
     **/
    this.processInstance = function (step, instance) {
      var attributeValues = {};
      var instanceSyncSuccess;
      // Instance-level preSync
      if(step.preSynchronize) {
        logger.debug("Instance-level start Presync");
        try {
          if(step.bulkInstance){
            instance.forEach(function(instanceValue){
              step.preSynchronize(pipelineContext, instanceValue);
            });
          }else{
            step.preSynchronize(pipelineContext, instance);
          }
        } catch (e) {
          // Just a callback no need to handle error
          logger.error("Exception occured during PreSynchronize : ", e);
        }
        logger.debug("Instance-level stop Presync ");
      }
      try {
        if(step.bulkInstance){
          var arrayInstanceValues = [];
          for(var idx in instance){
            var attributeValue ={};
            var configDataId = getConfigurationData(target, step, instance[idx], intentConfigArgs);
            if(configDataId.onlyConfigTopo && configDataId.onlyConfigTopo == true){
              buildTopology(configDataId, step, instance[idx], pipelineContext);
              result.setSuccess(true);
              return true;
            }

            if (configDataId.skipConfig === true) {
              result.setSuccess(true);
              return true;
            }
            var objectFriendlyName = configDataId.identifier;
            if (networkState != "delete") {
               attributeValue = getConfigAttributes(configDataId);
            }
            var objectAttributeValues = {
                 "objectId": objectFriendlyName,
                  "attributeValues": attributeValue,
                  "configData": configDataId,
                  "instance": instance[idx]
                }
            arrayInstanceValues.push(objectAttributeValues);
          }
        }
        else{
          var configData = getConfigurationData(target, step, instance, intentConfigArgs);
          if(configData.onlyConfigTopo && configData.onlyConfigTopo == true){
            buildTopology(configData, step, instance, pipelineContext);
            result.setSuccess(true);
            return true;
          }
          
          if (configData.skipConfig === true) {
            result.setSuccess(true);
            return true;
          }
          var objectId = configData.identifier;
          if (networkState != "delete") {
            attributeValues = getConfigAttributes(configData);
          }
        }
        try{
        var updateFlag = amsFwk.getPropertyData(step.update, [instance, target, intentConfigArgs, pipelineContext]);
        step.update = updateFlag ? updateFlag : undefined;
        if(networkState != "delete" && step.create && step.create==true){
          try{
            if(step.bulkInstance){
              arrayInstanceValues.forEach(function (objectValue){
                    deviceProxy.create(objectValue.objectId, objectValue.attributeValues);
                });
            } else {
              deviceProxy.create(objectId, attributeValues);
            }
          }
          catch(e){
            if(typeof e.getMessage === 'function' && e.getMessage()!=null && (e.getMessage().toString().contains("exists already") || e.getMessage().toString().contains("already exists") 
                  || (e.getMessage().toString().trim().contains("General error")) || e.getMessage().toString().contains("Internal Server Error"))){
              var isObjectExist = true;
              if(e.getMessage().toString().contains("Internal Server Error")){
                isObjectExist = deviceProxy.isObjectExist(objectId);
              }
              if(isObjectExist){
                logger.error("Ignoring CREATE error {} - trying UPDATE", e.getMessage());
                if(step.bulkInstance){
                  arrayInstanceValues.forEach(function (objectValue){
                    if(networkState != "delete" && step.auditToUpdate && step.auditToUpdate == true){
                      var attributesForExistingAudit = getAttributeForExistingAudit(target, step, instance, intentConfigArgs);
                      doUpdate(configDobjectValue.configDataata, objectValue.objectId, attributesForExistingAudit, step);
                    } else{
                      deviceProxy.update(objectValue.objectId, objectValue.attributeValues);
                    }
                  });
                } else {
                  if(networkState != "delete" && step.auditToUpdate && step.auditToUpdate == true){
                    var attributesForExistingAudit = getAttributeForExistingAudit(target, step, instance, intentConfigArgs);
                    doUpdate(configData, objectId, attributesForExistingAudit, step);
                  } else{
                    deviceProxy.update(objectId, attributeValues);
                  }
                }
              }else {
                // will be captured and handled/ignored in the next catch
                throw e;
              }
            }else {
              throw e;
            }
          }
        }
        else if(networkState != "delete" && step.update && step.update==true){
          if(step.bulkInstance){
            if(arrayInstanceValues.length && arrayInstanceValues.length > 0){
              var bulkObjectValueMap =  new HashMap();
              for (var idx in arrayInstanceValues){ 
                var isAttributeHasValue = Object.keys(arrayInstanceValues[idx].attributeValues).length > 0;
                if(isAttributeHasValue){
                  bulkObjectValueMap.put(arrayInstanceValues[idx].objectId , deviceProxy.mapOfJson(arrayInstanceValues[idx].attributeValues))
                }
              }
              if(bulkObjectValueMap.size()){
                deviceProxy.bulkUpdate(bulkObjectValueMap);
              }
            }
          }else{
            if(attributeValues && Object.keys(attributeValues).length > 0){
              deviceProxy.update(objectId, attributeValues);
            }
          }
        }
        else
        {
          if(step.bulkInstance){
            var instanceToBeUpdated = [];
            var auditAttributeValues = {};
            var bulkAuditAttributeValues = {};
            var attributesForExistingAudit;
            var objectIds = [];
            arrayInstanceValues.forEach(function (instanceValue){
              var tempAuditAttributeValues = getAuditConfigAttributes(instanceValue.configData);
              bulkAuditAttributeValues[instanceValue.objectId] = tempAuditAttributeValues;
              if(Object.keys(tempAuditAttributeValues).length > Object.keys(auditAttributeValues).length){
                auditAttributeValues = tempAuditAttributeValues;
              }
              
              attributesForExistingAudit = getAttributeForExistingAudit(target, step, instanceValue, intentConfigArgs);
              objectIds.push(instanceValue.objectId);
            });
            var auditResult = auditor(objectIds, auditAttributeValues, attributesForExistingAudit, undefined, step.attributeConfiguration, true, bulkAuditAttributeValues);
            arrayInstanceValues.forEach(function (instanceValue){
              var objectId = instanceValue.objectId;
              logger.debug("Audit Result for object {} = {}", instanceValue.objectId, apUtils.protectSensitiveDataLog(auditResult));
              if (auditResult[objectId].configured) {
                if (auditResult[objectId].misAlignedAttributes.length > 0) {
                  var attributesToUpdate = getAttributesToUpdate(auditResult[objectId].misAlignedAttributes);
                  var objectAttributeValues = {
                    "objectId": instanceValue.objectId,
                    "attributeValues": attributesToUpdate,
                  }
                  instanceToBeUpdated.push(objectAttributeValues);
                }
              } else {
                if (networkState === "delete") {
                  if (step.deleteOperation) {
                    step.deleteOperation.apply(step, [instanceValue.objectId, intentConfigArgs, pipelineContext, instanceValue]);
                  } else {
                    deviceProxy.delete(instanceValue.objectId);
                  }
                } else {
                  deviceProxy.create(instanceValue.objectId, instanceValue.attributeValues);
                }
              }
            });
            if(instanceToBeUpdated && instanceToBeUpdated.length && instanceToBeUpdated.length > 0){
              var bulkObjectValueMap =  new HashMap();
              for (var idx in instanceToBeUpdated){ 
                var isAttributeHasValue = Object.keys(instanceToBeUpdated[idx].attributeValues).length > 0;
                if(isAttributeHasValue){
                  bulkObjectValueMap.put(instanceToBeUpdated[idx].objectId , deviceProxy.mapOfJson(instanceToBeUpdated[idx].attributeValues))
                }
              }
              if(bulkObjectValueMap.size()){
                deviceProxy.bulkUpdate(bulkObjectValueMap);
              }
            }
          }else {
            var auditAttributeValues = getAuditConfigAttributes(configData);
            var attributesForExistingAudit = getAttributeForExistingAudit(target, step, instance, intentConfigArgs);
            var auditResult = auditor(objectId, auditAttributeValues, attributesForExistingAudit, step.bulkInstanceProfiles, step.attributeConfiguration);
            logger.debug("Audit Result for object {} = {}", objectId, apUtils.protectSensitiveDataLog(auditResult));
      
              if (auditResult.configured) {
                if (auditResult.misAlignedAttributes.length > 0) {
                  var attributesToUpdate = getAttributesToUpdate(auditResult.misAlignedAttributes);
                  deviceProxy.update(objectId, attributesToUpdate);
                }
              } else {
                if (networkState === "delete") {
                  if (step.deleteOperation) {
                    try {
                      step.deleteOperation.apply(step, [objectId, intentConfigArgs, pipelineContext, instance]);
                    } catch (e) {
                      if (typeof e.getMessage === 'function' && e.getMessage() != null && (e.getMessage().toString().contains("in use") || e.getMessage().toString().contains("in-use"))) {
                        logger.error("Ignoring error while deleting object ID {} : {}", objectId, e);
                      }
                    }
                  } else {
                    try {
                      deviceProxy.delete(objectId);
                    } catch (e) {
                      if (typeof e.getMessage === 'function' && e.getMessage() != null && (e.getMessage().toString().contains("in use") || e.getMessage().toString().contains("in-use"))) {
                        logger.error("Ignoring error while deleting object ID {} : {}", objectId, e);
                      }
                    }
                  }
                } else {
                  deviceProxy.create(objectId, attributeValues);
                }
              }
          }
       }
}
    catch(e){
        if(typeof e.getMessage === 'function' && e.getMessage()!=null && e.getMessage().toString().contains("exists already")){
    		// Ignore error
          logger.error("Ignoring error ", e);
    	}
    	else{
        logger.error("Error occurred while synchronizing intent");
        throw e;
      }
    }
    if(step.bulkInstance){
      instance.forEach(function (instanceValue) {
          var configData = getConfigurationData(target, step, instanceValue, intentConfigArgs);
          if (configData.skipConfig === true) {
              result.setSuccess(true);
              return true;
          }
          if (networkState != "delete") {
            buildTopology(configData, step, instanceValue, pipelineContext);
          }
      });
    } else {
      if (networkState != "delete") {
        buildTopology(configData, step, instance, pipelineContext);
      }
    }
instanceSyncSuccess=true;
      }
      catch(e){
      instanceSyncSuccess=false;
            // Rethrow the captured error
        throw e;
      }
      finally {
        // Instance-level postSync
        if (step.postSynchronize) {
          logger.debug("Instance-level start Postsync");
          if(step.throwErrorInPostSync){
            doPostSync(step, instance, pipelineContext, networkState, instanceSyncSuccess);
          }else {
            try {
              doPostSync(step, instance, pipelineContext, networkState, instanceSyncSuccess);
            } catch (e) {
              logger.error("Exception occured during PostSynchronize : ", e);
            }
          }
          logger.debug("Instance-level stop Postsync ");
        }
      }
      result.setSuccess(true);
      return true;
    };

    function buildTopology(configData, step, instanceValue, pipelineContext){
      var objectId = configData.identifier;
      var buildTopo = step.topology === undefined || step.topology;
      if (buildTopo) {
        var topologyObj = getTopologyObjectId(objectId);
        var side = step.topologySide || "INFRASTRUCTURE";
        logger.debug("Updating topology with objectType {} with id {}", topologyObj.objectType, topologyObj.topoObjectId);
        var prevVertex;
        if (instanceValue.topology) {
          if (!instanceValue.topology.append) {
            instanceValue.topology.append = false;
          }
          if (instanceValue.topology.previousVertexObjectIds && instanceValue.topology.previousVertexObjectIds != null) {
            if (Array.isArray(instanceValue.topology.previousVertexObjectIds)) {
              prevVertex = '';
              for(var index in instanceValue.topology.previousVertexObjectIds) {
                var v = instanceValue.topology.previousVertexObjectIds[index];
                if (prevVertex == ''){
                  prevVertex = v;
                } else {
                  prevVertex = v + '||' + prevVertex;
                }
              }
            } else {
              prevVertex = instanceValue.topology.previousVertexObjectIds;
            }
          }
        }
        var topoObject;
        if (pipelineContext.parentStep && pipelineContext.topology.step[pipelineContext.parentStep]
            && pipelineContext.topology.step[pipelineContext.parentStep].lastObjectId) {
          if (instanceValue.topology) {
            if (instanceValue.topology.append == true) {
              prevVertex = prevVertex + '||' + pipelineContext.topology.step[pipelineContext.parentStep].lastObjectId;
            }
          }else {
            prevVertex = pipelineContext.topology.step[pipelineContext.parentStep].lastObjectId;
          }
        }

        if(prevVertex) {
          topoObject = topologyFactory.createTopologyObjectWithVertex(topologyObj.objectType, topologyObj.topoObjectId, side, prevVertex);
        } else {
          topoObject = topologyFactory.createTopologyObjectFrom(topologyObj.objectType, topologyObj.topoObjectId, side);
        }
        
        pipelineContext.topology.topologyObjects.push(topoObject);
        if (!pipelineContext.topology.step[step.name]) {
          pipelineContext.topology.step[step.name] = {};
        }
        pipelineContext.topology.step[step.name].lastObjectId = topologyObj.topoObjectId;
      }
    }

    function doPostSync(step, instance, pipelineContext, networkState, instanceSyncSuccess){
      if(step.bulkInstance){
        instance.forEach(function (instanceValue){
          step.postSynchronize(pipelineContext, instanceValue, step, networkState, instanceSyncSuccess);
        });
      } else {
        step.postSynchronize(pipelineContext, instance, step, networkState, instanceSyncSuccess);
      }
    }

    function getAttributesToUpdate(misAlignedAttributes) {
      var updatedAttributes = {};
      for (var misAlignedAttribute in misAlignedAttributes) {
        updatedAttributes[misAlignedAttributes[misAlignedAttribute].name] = misAlignedAttributes[misAlignedAttribute].expectedValue;
      }
      return updatedAttributes;
    }

    function getTopologyObjectId(objectId) {
      //objectId format is ObjectType:Ne:Agent:ObjectId
      var objectElements = objectId.split(":");
      var objectType = objectElements[0];
      var deviceName = objectElements[1];
      var agent = objectElements[2];
      //identifiers sometimes themselves contain a ':' - rejoin them with the same
      var objectId = objectElements.slice(3, objectElements.length).join(':');
      var topoId = deviceName + ":ams:" + objectType + ":" + agent + ":" + objectId;
      return {
        objectType: objectType,
        topoObjectId: topoId
      }
    }

    function doUpdate(configData, objectId, attributesForExistingAudit, step){
      var auditAttributeValues = getAuditConfigAttributes(configData);
      var auditResult = auditor(objectId, auditAttributeValues, attributesForExistingAudit, step.bulkInstanceProfiles, step.attributeConfiguration);
      if (auditResult.configured) {
        if (auditResult.misAlignedAttributes.length > 0) {
          var attributesToUpdate = getAttributesToUpdate(auditResult.misAlignedAttributes);
          deviceProxy.update(objectId, attributesToUpdate);
        }
      }
    }

    /**
     * Updates topology and returns result
     **/
    this.getResult = function () {
      updateTopology();
      return result;
    }

    // Update the topology to have only the current topology objects, and remove the old ones that are not relevant.
    function updateTopology() {
      var currentTopologyObjects = Arrays.asList(pipelineContext.topology.topologyObjects);
      topology.getTopologyObjects().removeIf(function (topoObj) {
        return !currentTopologyObjects.contains(topoObj);
      });
      for (var topoIndex in currentTopologyObjects) {
        topology.addTopologyObject(currentTopologyObjects.get(topoIndex));
      }
    }
  };

  //internal methods
  function processPipeline(deviceProcessor) {
    for (var deviceId in devices) {
      deviceProcessor.setDeviceId(deviceId,devices[deviceId].manager);
      var device = devices[deviceId];
      var steps = amsFwk.getPropertyData(device.steps, [target, intentConfigArgs]);
      var deviceXtraInfo = {};
      var prevDeviceConfigArgs = apUtils.protectSensitiveDataLog(topologyXtraInfo[amsFwk.intentTypeObject.stageName + "_" + deviceId + "_ARGS"]);
      logger.debug("Previous Device Config Args {}", typeof prevDeviceConfigArgs === "undefined"?"undefined":prevDeviceConfigArgs);
      if (typeof topologyXtraInfo[amsFwk.intentTypeObject.stageName + "_" + deviceId + "_ARGS"] === "string") {
        deviceXtraInfo = JSON.parse(topologyXtraInfo[amsFwk.intentTypeObject.stageName + "_" + deviceId + "_ARGS"]);
        if (pipelineContext.operation != "audit") {
          pipelineContext.operation = "update";
        }
      }
      var isPrevInstanceIgnored = false;
      PipelineController(steps, deviceXtraInfo, deviceProcessor, isPrevInstanceIgnored)();
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
  function PipelineController(steps, previousDeviceArgs, deviceProcessor, isPrevInstanceIgnored) {

    if (networkState === "delete") {
      // For "Delete" state, the pipeline is executed in the reverse
      return function () {
        for (var step = steps.length - 1; step >= 0; step--) {
          var configStep = amsFwk.getPropertyData(steps[step], [target, intentConfigArgs, pipelineContext]);
          if (configStep.ignoreOnDelete != null && configStep.ignoreOnDelete == true) {
            logger.debug("Skipped Step {}", configStep.name);
            continue;
          }
          logger.debug("Processing Step {}", configStep.name);
          var instances = amsFwk.getPropertyData(configStep.instances, [target, intentConfigArgs, pipelineContext]);
          for (var instance in instances) {
            var prevParentInstance = pipelineContext.parentInstance;
            if (configStep.steps) {
              pipelineContext.parentInstance = instances[instance];
              PipelineController(configStep.steps, previousDeviceArgs, deviceProcessor, isPrevInstanceIgnored)();
            }
            pipelineContext.parentInstance = prevParentInstance;
            logger.debug("Processing Instance {}", apUtils.protectSensitiveDataLog(instances[instance]));
            if (configStep.ignoreOnDelete != null && configStep.ignoreOnDelete == "currentStep") {
              logger.debug("Skipped Step {}", configStep.name);
              continue;
            }
            deviceProcessor.processInstance(configStep, instances[instance]);
          }
        }
      }
    } else {
      return function () {
        for (var step in steps) {
          var configStep = amsFwk.getPropertyData(steps[step], [target, intentConfigArgs, pipelineContext]);
          if(configStep.name != pipelineContext.lastProcessingStepName){
            isPrevInstanceIgnored = false;
          }
          pipelineContext.lastProcessingStepName = configStep.name;
          logger.debug("Processing Step {}", configStep.name);
          var instances = amsFwk.getPropertyData(configStep.instances, [target, intentConfigArgs, pipelineContext]);
          // This logic is to clean up the old instance in OLT. 
          // Make sure that there will have a key in 'instances' that we can do the comparasion between old and new instances
          if(!isPrevInstanceIgnored && pipelineContext.operation != "audit"){
            isPrevInstanceIgnored = true;
            var typeOfCleanUpOldInstance = typeof configStep.cleanUpOldInstance;
            var instanceToBeCleanUp = [];
            if(typeOfCleanUpOldInstance === "function"){
              instanceToBeCleanUp = amsFwk.getPropertyData(configStep.cleanUpOldInstance(topologyXtraInfo, instances, configStep.name));
              logger.debug("ProcessPipeline - instanceToBeCleanUp: {}", JSON.stringify(instanceToBeCleanUp));
            }else if(typeOfCleanUpOldInstance === "boolean" && configStep.cleanUpOldInstance == true){
              //compare value and remove unused instance as common function if the flag == true
              //will update later on in 23.9 to reach P7 23.6
              if(topologyXtraInfo && topologyXtraInfo[configStep.name] && topologyXtraInfo[configStep.name] != "undefined"){
                var oldInstanceArray = JSON.parse(topologyXtraInfo[configStep.name]);
                //loop in the instaces of the step to get the list of new instance name (profile name in case device-config-xx intent)
                var newInstanceNameArray = [];
                if(instances){
                  instances.forEach(function (newInstance) {
                    if(newInstance.name){
                      newInstanceNameArray.push(newInstance.name);
                    }
                  });
                }
                logger.debug("cleanUpOldInstance function - newInstanceNameArray: {}", JSON.stringify(newInstanceNameArray));
                
                //loop in the old Instaces and check if which instance is not used in the new Instances that we can have the list of instace need to be cleaned up.
                oldInstanceArray.forEach(function (oldInstance) {
                  var oldInstanceObject = oldInstance[Object.keys(oldInstance)[0]];
                  var oldInstanceName = oldInstanceObject[Object.keys(oldInstanceObject)[0]];
                  if(newInstanceNameArray.indexOf(oldInstanceName) == -1){
                    instanceToBeCleanUp.push(Object.keys(oldInstance)[0]);
                  }
                });
              }
            }
            logger.debug("cleanUpOldInstance function - instanceToBeCleanUp: {}", JSON.stringify(instanceToBeCleanUp));
            if(instanceToBeCleanUp.length > 0){
              instanceToBeCleanUp.forEach(function (unusedObjectId) {
                try{
                  pipelineContext.deviceProxy.delete(unusedObjectId);
                }catch(e){
                  logger.debug("An error occurred while trying to delete Object with Friendly Name: " + unusedObjectId, e);
                }
              });
            }
          }

          if (previousDeviceArgs && Object.keys(previousDeviceArgs).length > 0) {
            //if there is an old configuration it might have been modified and w might need to delete older instances
            var previousInstances = amsFwk.getPropertyData(configStep.instances, [target, previousDeviceArgs, pipelineContext]);
            var cloneInput = apUtils.protectSensitiveDataLog(previousInstances);
            logger.debug("Previous instances for step {}", typeof cloneInput==="undefined"? "undefined":JSON.stringify(cloneInput));
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
                  PipelineController(configStep.steps, previousDeviceArgs, deviceProcessor, isPrevInstanceIgnored)();
                }
                deviceProcessor.processInstance(configStep, instancesToDelete[oldInstance]);
              } 
              var instanceToUpdate = instancesToDelete[oldInstance];
              //update the attribute value if there is an old configuration
              if (configStep.cleanUpOldConfig && instanceToUpdate["attributesToBeCleanUp"]){
                networkState = desiredNeworkState;
                var attributesToBeCleanUp = instanceToUpdate["attributesToBeCleanUp"];
                Object.keys(attributesToBeCleanUp).forEach(function(attrName){
                  instanceToUpdate[attrName] = attributesToBeCleanUp[attrName];
                });
                deviceProcessor.processInstance(configStep, instanceToUpdate);
              }
            }
            pipelineContext.parentInstance = currentParentInstance;
            intentConfigArgs = newIntentConfigArgs;
            networkState = desiredNeworkState;
          }
          var prevParent = pipelineContext.parentStep;
          if(configStep.bulkInstance){
            logger.debug("Processing Instances {}", apUtils.protectSensitiveDataLog(instances));
            var processChildsSteps = deviceProcessor.processInstance(configStep, instances);
            if (processChildsSteps && configStep.steps) {
                for(var instance in instances){
                  pipelineContext.parentStep = (configStep.topology == false) ? prevParent : configStep.name;
                  pipelineContext.parentInstance = instances[instance];
                  PipelineController(configStep.steps, previousDeviceArgs, deviceProcessor, isPrevInstanceIgnored)();
                }
            }
            pipelineContext.parentStep = prevParent;   
          } else {
          for (var instance in instances) {
            logger.debug("Processing Instance {}", apUtils.protectSensitiveDataLog(instances[instance]));
            var processChildSteps = deviceProcessor.processInstance(configStep, instances[instance]);
            // If the processInstance returned false it means the current instance processing failed,
            // and therefore its children should not be processed.
            if (processChildSteps && configStep.steps) {
              pipelineContext.parentStep = (configStep.topology == false) ? prevParent : configStep.name;
              pipelineContext.parentInstance = instances[instance];
              PipelineController(configStep.steps, previousDeviceArgs, deviceProcessor, isPrevInstanceIgnored)();
            }
            pipelineContext.parentStep = prevParent;
          }
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
    var attributes = {};
    var attributeIdx;
    for (attributeIdx in configData.attributes) {
      var attribute = configData.attributes[attributeIdx];
      attributes[attribute['name']] = attribute['value'];
    }
    return attributes;
  }

  /**
   * Prunes the extra annotations present in the attributes property of an FTL, and returns a key value pair (For Audit before synchronize)
   **/
  function getAuditConfigAttributes(configData) {
    var attributes = {};
    var attributeIdx;
    for (attributeIdx in configData.attributes) {
      var useObjectValue = "false";
      var keySet = [];
      if(configData.attributes[attributeIdx].useObjectValue){
        useObjectValue = configData.attributes[attributeIdx].useObjectValue;
      }
      if(Array.isArray(configData.attributes[attributeIdx].keySet)){
        keySet = configData.attributes[attributeIdx].keySet;
      }
      var attribute = configData.attributes[attributeIdx];
      attributes[attribute['name']] = {value: attribute['value'], useObjectValue: useObjectValue, keySet: keySet};
    }
    return attributes;
  }

  /**
   * Fetches the templateFile to be used for the @param intentConfigStep and process the FTL
   * with the @param intentConfigArgs. The "networkState" attribute is also passed for FTL processing
   **/
  function getConfigurationData(target, intentConfigStep, instance, intentConfigArgs) {
    var templateResource = intentConfigStep.name + ".json.ftl";
    if (intentConfigStep.templateFile) {
      templateResource = amsFwk.getPropertyData(intentConfigStep.templateFile, [instance, target, intentConfigArgs, pipelineContext]);
    }
    var template = resourceProvider.getResource(templateResource);
    var rawTemplateArguments = {};

    if (intentConfigStep.instanceArguments) {
      rawTemplateArguments = amsFwk.getPropertyData(intentConfigStep.instanceArguments, [instance, target, intentConfigArgs, pipelineContext]);
      rawTemplateArguments["networkState"] = desiredNetworkState;
      rawTemplateArguments["target"] = target;
    }
    Object.bindProperties(rawTemplateArguments, intentConfigArgs); //Append the intent configuration
    var processedTemplate = utilityService.processTemplate(template, rawTemplateArguments);
    logger.debug("Proccessing FTL - {} with arguments - {}", templateResource, apUtils.protectSensitiveDataLog(rawTemplateArguments));
    logger.debug("processedTemplate {}", apUtils.protectSensitiveDataLog(processedTemplate));
    return JSON.parse(processedTemplate);
  }
  function getAttributeForExistingAudit(target, intentConfigStep, instance, intentConfigArgs) {
      var attributes;
      if (intentConfigStep.existenceAuditAttributes) {
        attributes = amsFwk.getPropertyData(intentConfigStep.existenceAuditAttributes, [instance, target, intentConfigArgs, pipelineContext]);
      }

      return attributes;
  }
}

MObjectProxy.prototype.getNeStartupScriptFileNames = function(){
	var amsProxy = this.amsProxy;
	return amsProxy.getNeStartupScriptFileNames();
}

function suggestScriptOrArchiveNames(valueProviderContext) {
    var inputArguments = valueProviderContext.getInputValues().get("arguments");
    var managerName = inputArguments.get("device-manager");
    var mObject = new MObjectProxy(null,null,managerName);
    var result = mObject.getNeStartupScriptFileNames();
    return apUtils.convertToSuggestReturnFormat(result, valueProviderContext.getSearchQuery());
  }
