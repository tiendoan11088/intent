/**
* (c) 2023 Nokia. All Rights Reserved.
*
* INTERNAL - DO NOT COPY / EDIT
**/
/**
 The IntentType implementation.
 This should ideally be the only Class that should be used from outside the framework.
 **/

var deviceUrl = "/rest/devices/";
var configUrL = "/rest/nokiacs/nbi/api/config/";
var contentType = "application/json";
function AltiplanoACSIntentHelper() {
    this.self = this;
    this.intentTypeObject = null;
    this.prefixToNsMap = new HashMap();
    this.prefixToNsMap.put("ibn", "http://www.nokia.com/management-solutions/ibn");
    this.prefixToNsMap.put("nc", "urn:ietf:params:xml:ns:netconf:base:1.0");
    this.prefixToNsMap.put("device-manager", "http://www.nokia.com/management-solutions/anv");
    this.prefixToNsMap.put("anv", "http://www.nokia.com/management-solutions/anv");
    this.prefixToNsMap.put("adh", "http://www.nokia.com/management-solutions/anv-device-holders");
    this.prefixToNsMap.put("anv-device-tag", "http://www.nokia.com/management-solutions/anv-device-tag");
    this.prefixToNsMap.put("mds", "http://www.nokia.com/management-solutions/manager-directory-service");
    this.prefixToNsMap.put("bbf-xpon-onu-states", "urn:bbf:yang:bbf-xpon-onu-states");
    this.prefixToNsMap.put("bbf-xpon-onu-state", "urn:bbf:yang:bbf-xpon-onu-state");
    this.prefixToNsMap.put("bbf-mgmd", "urn:bbf:yang:bbf-mgmd");
    this.prefixToNsMap.put("ont", "http://www.nokia.com/management-solutions/ont");
    this.prefixToNsMap.put("nokia-sdan-hw-duid", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-hardware-duid");
    this.prefixToNsMap.put("nokia-sdan-vmac-host-id-aug", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-vmac-host-id-aug");
    this.prefixToNsMap.put("nokia-sdan-system", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-system");
    this.prefixToNsMap.put("profile-administration", "http://www.nokia.com/management-solutions/profile-administration");

}

AltiplanoACSIntentHelper.prototype.setIntentObject = function (intentObjectIncoming) {
    this.intentTypeObject = intentObjectIncoming;
}

AltiplanoACSIntentHelper.prototype.validate = function (syncInput) {
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

AltiplanoACSIntentHelper.prototype.synchronize = function (syncInput) {
    logger.debug("Synchronizing intent with {}", apUtils.protectSensitiveDataLog(syncInput));
    var target = syncInput.getTarget();
    logger.debug("Synchronizing target with {}", target);
    var intentConfigXml = syncInput.getIntentConfiguration();
    var networkState = syncInput.getNetworkState().name();
    var pipelineContext = {};
    pipelineContext["operation"] = "sync";
    var intentConfigArgs = {};
    apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.intentTypeObject.getKeyForList, intentConfigArgs);
    var decryptedJSONConfigArgs = JSON.parse(syncInput.getJsonIntentConfiguration());
	var decryptedValues = getDecryptedValues(decryptedJSONConfigArgs);
	intentConfigArgs = mergeDecryptedValues(decryptedValues, intentConfigArgs); 
    var topology = syncInput.getCurrentTopology();
    var deviceXtraInfo = this.getDeviceXtrargs(target, topology, intentConfigArgs, pipelineContext);

    var devices = this.intentTypeObject.getDeviceIds;
    var intentEngine = new ACSIntentPipelineEngine(this, target, devices, intentConfigArgs, networkState, syncInput.getCurrentTopology(), pipelineContext);
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
    //var dependentsImpacted = this.isArgumentsUpdated(this.intentTypeObject.dependencyArgs, target, intentConfigArgs, deviceXtraInfo);
    //logger.debug("Dependency Arguments: {}" , dependentsImpacted);
    //syncResult.setUpdateDependents(dependentsImpacted);
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

function getDecryptedValues(decryptedJSONConfigArgs){
    if(decryptedJSONConfigArgs){
    var rgOntConfig = decryptedJSONConfigArgs[0]["rg-ont:rg-ont"];
    if (rgOntConfig && rgOntConfig["twodotfour-ghz-wireless-configuration"]) {
        var twopontfourGhzConfigs = rgOntConfig["twodotfour-ghz-wireless-configuration"];
        var decryptedValues = [];
        var decryptedObjects = {};
        if (twopontfourGhzConfigs != undefined) {
            if (twopontfourGhzConfigs.length > 0) {
                for (var index in twopontfourGhzConfigs) {
                    var twopontfourGhzConfig = twopontfourGhzConfigs[index];
                    if (twopontfourGhzConfig["wpa-key"] != undefined) {
                        decryptedObjects[twopontfourGhzConfig["id"]] = twopontfourGhzConfig["wpa-key"];

                    } else if (twopontfourGhzConfig["wep-key"] != undefined) {
                        decryptedObjects[twopontfourGhzConfig["id"]] = twopontfourGhzConfig["wep-key"];
                    }
                }
                decryptedValues.push(decryptedObjects);
            }
        }
    }

    if (rgOntConfig && rgOntConfig["five-ghz-wireless-configuration"]) {
        var twopontfourGhzConfigs = rgOntConfig["five-ghz-wireless-configuration"];
        if (twopontfourGhzConfigs != undefined) {
            if (twopontfourGhzConfigs.length > 0) {
                for (var index in twopontfourGhzConfigs) {
                    var twopontfourGhzConfig = twopontfourGhzConfigs[index];
                    if (twopontfourGhzConfig["fiveg-wpa-key"] != undefined) {
                        decryptedObjects[twopontfourGhzConfig["id"]] = twopontfourGhzConfig["fiveg-wpa-key"];
                    }
                }
                decryptedValues.push(decryptedObjects);
            }
        }
    }
   }
    return decryptedValues;
}

function mergeDecryptedValues(decryptedValues, intentConfigArgs) {
    if(decryptedValues){
    if (intentConfigArgs["twodotfour-ghz-wireless-configuration"]) {
        var twopontfourGhzConfigs = intentConfigArgs["twodotfour-ghz-wireless-configuration"];
        if (twopontfourGhzConfigs != undefined) {
            var wirelessProfileTwodotFourGhzConfKeys = Object.keys(twopontfourGhzConfigs);
            for (var inx in wirelessProfileTwodotFourGhzConfKeys) {
                var wirelessProfileTwodotFourGhzCon = twopontfourGhzConfigs[wirelessProfileTwodotFourGhzConfKeys[inx]];
                if (wirelessProfileTwodotFourGhzCon["wpa-key"] != undefined) {
                    wirelessProfileTwodotFourGhzCon["decryprted-wpa-key"] = getDecryptedValue(decryptedValues, wirelessProfileTwodotFourGhzConfKeys[inx]);

                } else if (wirelessProfileTwodotFourGhzCon["wep-key"] != undefined) {
                    wirelessProfileTwodotFourGhzCon["decryprted-wep-key"] = getDecryptedValue(decryptedValues, wirelessProfileTwodotFourGhzConfKeys[inx]);
                }
            }
        }
    }

    if (intentConfigArgs["five-ghz-wireless-configuration"]) {
        var fiveGhzConfigs = intentConfigArgs["five-ghz-wireless-configuration"];
        if (fiveGhzConfigs != undefined) {
            var wirelessProfilefiveGhzConfKeys = Object.keys(fiveGhzConfigs);
            for (var inx in wirelessProfilefiveGhzConfKeys) {
                var wirelessProfilefiveGhzCon = fiveGhzConfigs[wirelessProfilefiveGhzConfKeys[inx]];
                if (wirelessProfilefiveGhzCon["fiveg-wpa-key"] != undefined) {
                    wirelessProfilefiveGhzCon["decryprted-wpa-key"] = getDecryptedValue(decryptedValues, wirelessProfilefiveGhzConfKeys[inx]);

                }
            }
        }
    }
}
    return intentConfigArgs;
}

function getDecryptedValue(arrayObject, id) {
    for (var index in arrayObject) {
        var jsonObject = arrayObject[index];
        return jsonObject[id];
    }
}

function setTopologyExtraInfo(topology, key, value) {
    logger.debug("Setting Topology Extra Info: " + key + " : " + logger.sensitiveData(apUtils.protectSensitiveDataLog(value)));
    var found = false;
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        topology.getXtraInfo().forEach(function (extraInfo) {
            if (extraInfo.getKey() == key) {
                extraInfo.setValue(value);
                found = true;
            }
        });
    }
    if (!found) {
        var entry = topologyFactory.createTopologyXtraInfoFrom(key, value);
        topology.addXtraInfo(entry);
    }
    return topology;
}


function isArgumentsUpdated(argsList, target, intentConfigArgs, deviceXtraInfo) {
    var oldObject = {};
    var currentObject = {};
    var dependency = null;
    if (argsList) {
        argsList.forEach(function (attribute) {
            currentObject[attribute] = intentConfigArgs[attribute];
            if (Array.isArray(deviceXtraInfo[attribute])) {
                oldObject[attribute] = deviceXtraInfo[attribute]
            } else {
                oldObject[attribute] = deviceXtraInfo[attribute] ? deviceXtraInfo[attribute]["value"] : undefined;
            }
        })
        dependency = self.isDifferent(oldObject, currentObject);
    }
    return dependency;
}

AltiplanoACSIntentHelper.prototype.executeAggregateRequest = function (managerName, inputAggregateRequest) {
    // The aggregate request not supported in SNMP fwk so no action required here
};

AltiplanoACSIntentHelper.prototype.finalize = function (input, networkState, result, intentObject) {
    //The aggregate request not supported in SNMP fwk so simply return the result.
    return result;
};

AltiplanoACSIntentHelper.prototype.audit = function (auditInput) {
    logger.debug("Auditing intent with {}", apUtils.protectSensitiveDataLog(auditInput));
    var target = auditInput.getTarget();
    var intentConfigXml = auditInput.getIntentConfiguration();
    var networkState = auditInput.getNetworkState().name();
    var topology = auditInput.getCurrentTopology();
    var pipelineContext = {};
    pipelineContext["operation"] = "audit";
    var intentConfigArgs = {};
    apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.intentTypeObject.getKeyForList, intentConfigArgs);
    var devices = this.intentTypeObject.getDeviceIds;
    var intentEngine = new ACSIntentPipelineEngine(this, target, devices, intentConfigArgs, networkState, auditInput.getCurrentTopology(), pipelineContext);
    logger.debug("Intent Audit completed");
    return intentEngine.audit();
}

AltiplanoACSIntentHelper.prototype.getAttributesArray = function (configData) {
    var attributesArray = configData.attributes;
    if (typeof attributesArray == 'string') {
        attributesArray = JSON.parse(attributesArray).parameterlist;
    }
    return attributesArray;
}

AltiplanoACSIntentHelper.prototype.getAttributes = function (data) {
    var attributes = [];
    if (data.response.parameterList) {
        var len = data.response.parameterList.length;
        for (var i = 0; i < len; i++) {
            attributes.push(data.response.parameterList[i].value);
        }
    }
    return attributes;
}

AltiplanoACSIntentHelper.prototype.getAttributesMap = function (data) {
    var attributes = {};
    if (data.response && data.response.parameterList) {
        var len = data.response.parameterList.length;
        for (var i = 0; i < len; i++) {
            attributes[data.response.parameterList[i].name] = data.response.parameterList[i].value;
        }
    }
    return attributes;
}

AltiplanoACSIntentHelper.prototype.isDifferent = function (oldObject, currentObject) {
    if (typeof oldObject === "boolean") {
        oldObject = oldObject.toString();
    }
    if (Array.isArray(oldObject) && Array.isArray(currentObject)) {
        return !self.isArrayEquals(oldObject, currentObject);
    } else if (typeof oldObject === "object" && typeof currentObject === "object") {
        var oldKeys = Object.keys(oldObject);
        var newKeys = Object.keys(currentObject);
        if (oldKeys.length != newKeys.length) {
            return true;
        }
        for (var key in oldKeys) {
            logger.debug("Comparing attribute {}", apUtils.protectSensitiveDataLog(oldKeys[key]));
            if (currentObject[oldKeys[key]] === undefined && oldObject[oldKeys[key]]) {
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

AltiplanoACSIntentHelper.prototype.getPropertyData = function (data, args) {
    if (typeof data === 'function') {
        return data.apply(data, args);
    }
    return data;
}

AltiplanoACSIntentHelper.prototype.getDeviceIds = function (target, intentConfigArgs, pipelinecontext) {
    var devicesConfig = this.getPropertyData(this.intentTypeObject.getDeviceIds, [target, intentConfigArgs, pipelinecontext]);
    var deviceId = Object.keys(devicesConfig);
    return deviceId
}

AltiplanoACSIntentHelper.prototype.getDeviceXtrargs = function (target, topology, intentConfigArgs, pipelinecontext) {
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

AltiplanoACSIntentHelper.prototype.getTransformedDependencyInfo = function (dependencyObject) {
    var dependencyInfo = new java.util.ArrayList();
    var intentTypeKeys = Object.keys(dependencyObject);
    for (var j = 0; j < intentTypeKeys.length; j++) {
        var dependencyIntentType = intentTypeKeys[j];
        if (typeof dependencyObject[dependencyIntentType] === "object" && dependencyObject[dependencyIntentType].length > 0) {
            for (var index in dependencyObject[dependencyIntentType]) {
                var dependencyTarget;
                var dependencyType = "existence-and-sync";
                if (typeof dependencyObject[dependencyIntentType][index] === "object") {
                    dependencyTarget = dependencyObject[dependencyIntentType][index]["dependencyTarget"];
                    dependencyType = dependencyObject[dependencyIntentType][index]["dependencyType"];
                    if (!dependencyTarget) {
                        logger.warn("Dependency target is undefined: {}", dependencyIntentType);
                    }
                }
                else {
                    dependencyTarget = dependencyObject[dependencyIntentType][index];
                }
                var topologyIntentDependency = topologyFactory.createTopologyIntentDependency(dependencyIntentType, dependencyTarget, dependencyType);
                dependencyInfo.add(topologyIntentDependency);
            }
        }
    }
    return dependencyInfo;
}

// TBD

AltiplanoACSIntentHelper.prototype.getDeviceArgs = function (target) {
    var ontIntentConfig = self.getIntentConfigJSONByIntentType(intentConstants.INTENT_TYPE_ONT, target);
    var duid = ontIntentConfig[DUID];
    var deviceOUI = ontIntentConfig[DEVICE_OUI];
    var deviceClass = ontIntentConfig[DEVICE_CLASS];
    var deviceVariant = ontIntentConfig[DEVICE_VARIANT];
    return {
        "duid": duid,
        "device-oui": deviceOUI,
        "device-class": deviceClass,
        "device-variant": deviceVariant
    };
}

AltiplanoACSIntentHelper.prototype.getDeviceName = function (target) {
    var deviceArgs = this.getDeviceArgs(target);
    return this.getDeviceNameFromArgs(deviceArgs);
}

AltiplanoACSIntentHelper.prototype.getDeviceNameFromArgs = function (deviceArgs) {
    return (deviceArgs[DUID] + "|" + deviceArgs[DEVICE_OUI] + "|" + deviceArgs[DEVICE_CLASS]);
}

//

// Pipeline Methods
function ACSIntentPipelineEngine(ACSFwk, targetName, devicesConfig, intentConfigArgs, desiredNetworkState, currentTopology, pipelineContext) {
    var acsFwk = ACSFwk;
    var target = targetName;
    var intentConfigArgs = intentConfigArgs;
    var networkState = desiredNetworkState;
    var pipelineContext = pipelineContext;
    var devices = devicesConfig;
    var topology = currentTopology;
    var deviceProxy;
    pipelineContext.existingTopology = currentTopology;
    pipelineContext.networkState = networkState;
    var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
    if (typeof devicesConfig === 'function') {
        devices = devicesConfig(target, intentConfigArgs, topology, pipelineContext);

    }

    /**
     * Performs an audit of the given device configuration pipeline
     **/
    this.audit = function () {
        pipelineContext["operation"] = "audit";
        var deviceAuditor = new DeviceAuditorWithReport();
        var report = auditFactory.createAuditReport(null, target);
        try {
            processPipeline(deviceAuditor);
            report = deviceAuditor.getResult();
        } catch (e) {
            //report.addMisAlignedObject(auditFactory.createMisAlignedObject(e, false, pipelineContext.currentDeviceId));
            logger.error("Error occurred while auditing intent ", e);
            if (typeof e.getMessage === 'function' && e.getMessage() != null) {
                throw new RuntimeException(e.getMessage());
            }
            if (typeof e.getUndeclaredThrowable == "function" && e.getUndeclaredThrowable != null) {
                if (typeof e.getUndeclaredThrowable().getTargetException === 'function' && e.getUndeclaredThrowable().getTargetException() != null) {
                    if (typeof e.getUndeclaredThrowable().getTargetException().getMessage === 'function' && e.getUndeclaredThrowable().getTargetException().getMessage() != null) {
                        throw new RuntimeException(e.getUndeclaredThrowable().getTargetException().getMessage());
                    }
                }
            }
            throw new RuntimeException(e);
        }
        return report;
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

        this.setDeviceId = function (deviceId) {
            deviceProxy = new ACSProxy(deviceId);
            currentDevice = deviceId;
            logger.debug("Audit Calling device auditor with deviceId: {}", (deviceId));
            auditor = DeviceAuditor(deviceId, deviceProxy);
            pipelineContext.currentDeviceId = deviceId;
            pipelineContext.deviceProxy = deviceProxy;
            pipelineContext.networkState = networkState;
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
            var removed = instance.removed;
            var newInstance = instance.new;
            if (configData.audit === "false") {
                logger.debug("Skipping audit for {}", objectId);
                return true;
            }
            var attributeValues = getAuditableAttributes(configData);
            var attributes = Object.keys(attributeValues);
            logger.debug("Auditing Object {} with attributes {}", objectId, apUtils.protectSensitiveDataLog(attributes));
            var auditResult = {};
            if (newInstance === true) {
                auditResult.configured = false;
            } else {
                if (instance["isBulk"]) {
                    auditResult = auditor(objectId, fullClassName, filter, attributeValues, flipReport, configData.onlyAudit, instance["isBulk"]);
                } else {
                    auditResult = auditor(objectId, fullClassName, filter, attributeValues, flipReport, configData.onlyAudit);
                }
            }

            if (!auditResult.configured || removed === true) {
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
                    var isBoolean = false;
                    if (attrResult.expectedValue == true || attrResult.expectedValue == false) {
                        isBoolean = true;
                    }
                    if (isBoolean || (attrResult.expectedValue && attrResult.actualValue)) {
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
            var attributesArray = acsFwk.getAttributesArray(configData);
            for (var attributeIdx in attributesArray) {
                var auditable = attributesArray[attributeIdx].audit
                if (auditable == undefined || auditable === "true") {
                    var attribute = attributesArray[attributeIdx];
                    var key = attribute['name'] ? attribute['name'] : attribute['key'];
                    attributes[key] = attribute['value'];
                }
            }
            return attributes;
        }

    };


    /*
    * Closure for auditing objects with a given deviceProxy.
    * Object existence is a precondition to check of its attributes alignment
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
    function DeviceAuditor(deviceId, deviceProxy) {

        return function (objectId, fullClassName, filter, expectedAttributesAndValues, flipReport, onlyAudit, isBulk) {
            logger.debug("Auditing Object {} with expected attribute values {} :", objectId, apUtils.protectSensitiveDataLog(expectedAttributesAndValues));
            var isConfigured = false;
            var misAlignedAttributes = {};
            var attributes = Object.keys(expectedAttributesAndValues);
            var deviceResponse = {};

            try {
                if (attributes) {
                    var searchObjectId;
                    if (onlyAudit && onlyAudit == "true") {
                        searchObjectId = objectId;
                    } else {
                        searchObjectId = objectId + ".";
                    }
                    if (isBulk) {
                        deviceResponse = deviceProxy.getObjectByTypeInBulk(deviceId, attributes, false);
                    } else {
                        deviceResponse = deviceProxy.getObjectByType(deviceId, searchObjectId, false);
                    }
                    var searchObject = acsFwk.getAttributesMap(deviceResponse);
                    attributes = Object.keys(expectedAttributesAndValues);
                }
            } catch (e) {
                logger.warn("Unable to fetch data.Device might not be configured {} ",e.stack);
            }
            var actualValues = {};
            if (searchObject && Object.keys(searchObject).length !== 0) {
                isConfigured = true;
                for (var j = 0; j < attributes.length; j++) {
                    if (searchObject[attributes[j]] == undefined && searchObject[attributes[j]] == null) {
                        actualValues[attributes[j]] = null;
                    } else {
                        if (searchObject[attributes[j]] && typeof searchObject[attributes[j]] == "string" && searchObject[attributes[j]].startsWith("Device.Ethernet.VLANTermination")) {
                            var vlanObjectResponse = deviceProxy.getObjectByType(deviceId, searchObject[attributes[j]], false);
                            var vlanObjectValue = acsFwk.getAttributesMap(vlanObjectResponse);
                            actualValues[attributes[j]] = vlanObjectValue[searchObject[attributes[j]] + "VLANID"];
                        } else {
                            actualValues[attributes[j]] = searchObject[attributes[j]];
                        }
                    }
                }
                logger.debug("Auditing Object {} with actual attribute values {}:", objectId, apUtils.protectSensitiveDataLog(actualValues));

                /*if (isConfigured) {
                    isConfigured = (networkState === "delete") ? false : true;
                } else { //object does not exist
                    isConfigured = (networkState === "delete") ? true : false;
                }*/

                if ((isConfigured && networkState !== "delete") || (!isConfigured && networkState === "delete" && flipReport)) {//audit attributes
                    misAlignedAttributes = auditObjectAttributes(objectId, attributes, expectedAttributesAndValues, actualValues);
                }
            } else { //object does not exist
                isConfigured = (networkState === "delete") ? true : false;
            }
            logger.debug("Is Configured: {} & MisalignedAttributes {}:", isConfigured, JSON.stringify(misAlignedAttributes));
            return { configured: isConfigured, misAlignedAttributes: misAlignedAttributes };
        };

        function auditObjectAttributes(objectId, attributes, expectedValues, actualValues) {
            var misAlignedAttributes = [];
            if (Object.keys(attributes).length <= 0) {
                return misAlignedAttributes;
            }
            for (var attribute in attributes) {
                var actualValue = actualValues[attributes[attribute]] == null ? "" : actualValues[attributes[attribute]];
                logger.debug("Comparing expected: {} actual: {} ", apUtils.protectSensitiveDataLog(expectedValues[attributes[attribute]]), apUtils.protectSensitiveDataLog(actualValue));
                var expectedValue = expectedValues[attributes[attribute]];
                if (acsFwk.isDifferent(expectedValue, actualValue)) {
                    var misAlignedAttribute = {};
                    misAlignedAttribute.deviceName = deviceId;
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
        if (topology === undefined || topology != null) {
            // We don't need any topology updates without anything generated by SYNC. But, we need the Xtra Info for remembrance support.
            // result.getTopology().setXtraInfo(input.getCurrentTopology().getXtraInfo());
            //
        } else {
            topology = topologyFactory.createServiceTopology();
        }
        var synchronizer = new DeviceSynchronizer();
        var result = synchronizeResultFactory.createSynchronizeResult();
        try {
            processPipeline(synchronizer);
            result = synchronizer.getResult();
            result.setSuccess(true);
        } catch (e) {
            result.setSuccess(false);
            if (typeof e.getMessage === 'function') {
                logger.debug("Error occurred while synchronizing intent ", e);
                result.setErrorDetail(e.getMessage());
            } else {
                logger.debug("Error occurred while synchronizing intent ", e);
                result.setErrorDetail(e);
            }
        } finally {
            for (var device in devices) {
                setTopologyExtraInfo(topology, device + "_ARGS", JSON.stringify(intentConfigArgs));
            }
            setTopologyExtraInfo(topology, target + "_ARGS", JSON.stringify(intentConfigArgs));
            result.setTopology(topology);
            result.getTopology().setDependencyInfo(topology.getDependencyInfo());
            logger.debug("Result topology {}", apUtils.protectSensitiveDataLog(topology));
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
        this.setDeviceId = function (deviceId) {
            deviceIdValue = deviceId;
            deviceProxy = new ACSProxy(deviceId);
            logger.debug("Sync Calling device synchronizer with deviceId :{} ", deviceId);
            auditor = DeviceAuditor(deviceId, deviceProxy);
            pipelineContext.currentDeviceId = deviceId;
            pipelineContext.deviceProxy = deviceProxy;
            pipelineContext.networkState = networkState;
            pipelineContext.topology[deviceId] = { "step": {} };
            pipelineContext.prevTopoStep = null;
            pipelineContext.topoFromConfig = false;
            pipelineContext.deviceProxy = deviceProxy;
            pipelineContext.result = {};
        };

        /**
         * Synchronizes an instance based on the desired network state. Also builds topology for relevant network states.
         **/
        this.processInstance = function (step, instance) {
            var attributeValues = {};
            var attributeTypes = {};
            var configData = getConfigurationData(target, step, instance, intentConfigArgs);
            logger.debug("processInstance Configiruation Data ====: {}", apUtils.protectSensitiveDataLog(configData));
            var objectId = configData.identifier;
            var fullClassName = configData.fullClassName;
            var fdn = configData.fdn;
            var filter = configData.filter;
            var flipReport = configData.flipReport;
            var newInstance = instance.new;
            var doAudit = configData.audit;
            var onlyTopo = configData.onlyTopo;
            if (networkState != "delete") {
                attributeValues = getConfigAttributeValues(configData);
                attributeTypes = getConfigAttributeTypes(configData);
            }

            if (objectId) {
                try {
                    logger.debug("Auditing Object: {} with attributes: {} Config Data: {} ", objectId, apUtils.protectSensitiveDataLog(attributeValues), apUtils.protectSensitiveDataLog(configData));
                    var auditResult = {};
                    if (newInstance === true) {
                        auditResult.configured = false;
                    } else {
                        if (doAudit == "false") {
                            logger.debug("Skipping audit for object:" + objectId + " and declare it as configured");
                            auditResult.configured = true;
                        } else {
                            if (instance["isBulk"]) {
                                auditResult = auditor(objectId, fullClassName, filter, attributeValues, flipReport, configData.onlyAudit, instance["isBulk"]);
                            } else {
                                auditResult = auditor(objectId, fullClassName, filter, attributeValues, flipReport, configData.onlyAudit);
                            }
                        }
                    }
                    logger.debug("Audit Result for object: {} , {} =", objectId, JSON.stringify(auditResult));
                    if (doAudit == "false" && (onlyTopo && onlyTopo == "true")) {
                        //Do nothing. Just create topology object of this instance
                    } else if ((auditResult.configured && instance.removed && networkState != "delete") ||
                        (auditResult.configured && networkState === "delete")) {
                        // if(objectId.indexOf("VLANTermination") <= 0){
                        objectId = objectId + ".";
                        logger.debug("Deleting the object: {} from the device: {}", objectId, configData.deviceName);
                        try {
                            deviceProxy.deleteObject(configData.deviceName, objectId);
                        } catch (e) {
                            logger.warn("Unable to deleteObject. Device might not be configured", e);
                        }
                        if (instance["ethlinkVlanId"] && objectId.indexOf("AccessPoint") > 0) {
                            var vlanObjectId = instance["ethlinkVlanId"];
                            logger.debug("Deleting the vlanObject: {} from the device: {}", vlanObjectId, configData.deviceName);
                            if (vlanObjectId.indexOf("VLAN") > 0) {
                                deviceProxy.deleteObject(configData.deviceName, vlanObjectId);
                            }
                        }
                        // }
                    } else if (auditResult.configured && (!configData.onlyAudit || configData.onlyAudit == "false")) {
                        if (auditResult.misAlignedAttributes.length > 0) {
                            var attributesToUpdate = getAttributesToUpdate(auditResult.misAlignedAttributes, attributeTypes);
                            deviceProxy.create(configData.deviceName, fullClassName, attributesToUpdate);
                            if(networkState != "suspend"){
                             if (objectId.indexOf("InternetGatewayDevice.LANDevice.1.WLANConfiguration") >= 0) {
                                 if (instance["WPAKey"] == "true") {
                                     var preSharedKeyObjectID = objectId + ".PreSharedKey.1";
                                     var keyPassPhrase = [];
                                     var attributes = {};
                                     attributes["name"] = preSharedKeyObjectID + ".KeyPassphrase";
                                     attributes["value"] = instance["wpa-key"];
                                     attributes["type"] = "string";
                                     keyPassPhrase.push(attributes);
                                     deviceProxy.create(configData.deviceName, fullClassName, keyPassPhrase);
                                 } else if (instance["WEPKey"] == "true") {
                                     var wepKeyObjectID = objectId + ".WEPKey.1";
                                     var wepKeyArray = [];
                                     var attributes = {};
                                     attributes["name"] = wepKeyObjectID + ".WEPKey";
                                     attributes["value"] = instance["wep-key"];
                                     attributes["type"] = "string";
                                     wepKeyArray.push(attributes);
                                     deviceProxy.create(configData.deviceName, fullClassName, wepKeyArray);
                                 }
                             }
                            }
                         } else if (instance["isSyncEnabled"] == "true") {
                             if (objectId.indexOf("InternetGatewayDevice.LANDevice.1.WLANConfiguration") >= 0) {
                                 if (instance["WPAKey"] == "true") {
                                     var preSharedKeyObjectID = objectId + ".PreSharedKey.1";
                                     var keyPassPhrase = [];
                                     var attributes = {};
                                     attributes["name"] = preSharedKeyObjectID + ".KeyPassphrase";
                                     attributes["value"] = instance["wpa-key"];
                                     attributes["type"] = "string";
                                     keyPassPhrase.push(attributes);
                                     deviceProxy.create(configData.deviceName, fullClassName, keyPassPhrase);
                                 } else if (instance["WEPKey"] == "true") {
                                     var wepKeyObjectID = objectId + ".WEPKey.1";
                                     var wepKeyArray = [];
                                     var attributes = {};
                                     attributes["name"] = wepKeyObjectID + ".WEPKey";
                                     attributes["value"] = instance["wep-key"];
                                     attributes["type"] = "string";
                                     wepKeyArray.push(attributes);
                                     deviceProxy.create(configData.deviceName, fullClassName, wepKeyArray);
                                 }
                             }
                         }
                    } else {
                        if (networkState != "delete" && (!configData.onlyAudit || configData.onlyAudit == "false")) {
                            if (!fdn) {
                                fdn = configData.deviceName;
                            }
                            if (instance.gre) {
                                objectId = "Device.GRE.Tunnel.";
                                logger.debug("Creating the object: {} from the device: {}", objectId, configData.deviceName);
                                deviceProxy.addObject(fdn, objectId);
                                objectId = "Device.GRE.Tunnel.1.";
                                deviceProxy.getObjectByType(fdn, objectId, false);
                                logger.debug("Updating Object: {} from the device: {} Attributes: {} ", objectId, configData.deviceName, apUtils.protectSensitiveDataLog(configData.attributes));
                                deviceProxy.create(configData.deviceName, objectId, configData.attributes);
                            } else {
                                var dotIndex = objectId.lastIndexOf(".");
                                objectId = objectId.substr(0, dotIndex + 1);
                                logger.debug("Creating the object: {} from the device: {}", objectId, configData.deviceName);
                                var res = deviceProxy.addObject(fdn, objectId);
                                if (res && res.response && res.response.instanceNumber) {
                                    objectId = objectId + res.response.instanceNumber + ".";
                                    if (objectId.indexOf("VLANTermination") > 0) {
                                        var vlanNumber = acsFwk.getAttributesArray(configData)[1].value;
                                        pipelineContext[vlanNumber] = objectId;
                                    }
                                    var updateAttributes = updateCreatedInstanceWithAttributes(objectId, configData.attributes);
                                }
                                logger.debug("Updating the object: {} from the device: {} Attributes: {}" + objectId, configData.deviceName, apUtils.protectSensitiveDataLog(updateAttributes));
                                try {
                                    deviceProxy.create(configData.deviceName, objectId, updateAttributes);
                                }
                                catch (exception) {
                                    logger.error("Unable to perform the operation.", exception);
                                    if (instance.rollback) {
                                        // rollback
                                        logger.info("roll back for object ID {}", objectId);
                                        try {
                                            if (res && res.response && res.response.instanceNumber) {
                                                deviceProxy.deleteObject(configData.deviceName, objectId);
                                            }
                                            else {
                                                logger.error("Add Object failed");
                                            }

                                        }
                                        catch (ex) {
                                            logger.error("unable to rollback the object {}", ex);
                                        }

                                    }
                                    if (typeof exception.getMessage === 'function' && exception.getMessage() != null) {
                                        throw new RuntimeException(exception.getMessage());
                                    }
                                    if (typeof exception.getUndeclaredThrowable == "function" && exception.getUndeclaredThrowable != null) {
                                        if (typeof exception.getUndeclaredThrowable().getTargetException === 'function' && exception.getUndeclaredThrowable().getTargetException() != null) {
                                            if (typeof exception.getUndeclaredThrowable().getTargetException().getMessage === 'function' && exception.getUndeclaredThrowable().getTargetException().getMessage() != null) {
                                                throw new RuntimeException(exception.getUndeclaredThrowable().getTargetException().getMessage());
                                            }
                                        }
                                    }
                                    throw new RuntimeException(exception);
                                }
                            }
                        }
                    }
                } catch (e) {
                    logger.error("Unable to perform the operation.", e);
                    if (typeof e.getMessage === 'function' && e.getMessage() != null) {
                        throw new RuntimeException(e.getMessage());
                    }
                    if (typeof e.getUndeclaredThrowable == "function" && e.getUndeclaredThrowable != null) {
                        if (typeof e.getUndeclaredThrowable().getTargetException === 'function' && e.getUndeclaredThrowable().getTargetException() != null) {
                            if (typeof e.getUndeclaredThrowable().getTargetException().getMessage === 'function' && e.getUndeclaredThrowable().getTargetException().getMessage() != null) {
                                throw new RuntimeException(e.getUndeclaredThrowable().getTargetException().getMessage());
                            }
                        }
                    }
                    throw new RuntimeException(e);
                }
            }
            if (networkState != "delete") {
                var buildTopo = step.topology === undefined || step.topology;
                if (buildTopo && objectId) {
                    var topologyObjectsFromConfigData = configData.topologyObjects;
                    var side = step.topologySide || "INFRASTRUCTURE";
                    var tcaLabel = configData.tcaLabel || null;
                    logger.debug("Building Topology of {} for device: {}" + step.name, instance.name, deviceIdValue);
                    if (topologyObjectsFromConfigData) {
                        pipelineContext.topoFromConfig = true;
                        var objectType = configData.objectType;
                        if (!objectType) {
                            objectType = fullClassName;
                        }
                        var lastTopoNode, lastTopoNodeObjectId;
                        var topologyObj = getTopologyObjectId(deviceIdValue, objectType, objectId);

                        logger.debug("Updating topology with objectType {} with id {}" + topologyObj.objectType, topologyObj.topoObjectId);
                        var topoRoot = topologyFactory.createTopologyObjectWithTcaFrom(topologyObj.objectType, topologyObj.topoObjectId, side, null);
                        pipelineContext.topologyObjects.push(topoRoot);
                        if (!pipelineContext.topology[deviceIdValue].step[step.name]) {
                            pipelineContext.topology[deviceIdValue].step[step.name] = {};
                        }
                        lastTopoNode = topoRoot;
                        lastTopoNodeObjectId = deviceIdValue + ":" + lastTopoNode.getObjectRelativeObjectID();
                        var prevVertex;
                        if (pipelineContext.prevTopoStep && pipelineContext.prevTopoStep !== step.name) {
                            pipelineContext.topology[deviceIdValue].step[step.name][instance.name] =
                            {
                                id: lastTopoNodeObjectId,
                                deviceId: deviceIdValue,
                                prevStep: pipelineContext.prevTopoStep,
                                side: side,
                                tcaLabel: null
                            };
                        }

                        for (topoObjectFromConfig in topologyObjectsFromConfigData) {
                            logger.debug("Creating {} from lastTopoNode: {} objectId: {}", JSON.stringify(topoObjectFromConfig), lastTopoNode, lastTopoNodeObjectId);
                            var topologyObj = getTopologyObjectId(deviceIdValue,
                                topoObjectFromConfig.fullClassName, topoObjectFromConfig.value);

                            topoRoot = getMatchingTopologyObject(pipelineContext.topologyObjects, topologyObj.topoObjectId);
                            side = topoObjectFromConfig.topologySide || "INFRASTRUCTURE";
                            if (!topoRoot) {
                                topoRoot = topologyFactory.createTopologyObjectWithVertexAndTca(topologyObj.objectType, topologyObj.topoObjectId, side, lastTopoNodeObjectId, tcaLabel);
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
                            logger.debug("Topo Root: {}", topoRoot);
                            pipelineContext.topologyObjects.push(topoRoot);
                            lastTopoNode = topoRoot;
                            lastTopoNodeObjectId = deviceIdValue + ":" + lastTopoNode.getObjectRelativeObjectID();
                        }

                        if (!pipelineContext.prevTopoStep) {
                            pipelineContext.topology[deviceIdValue].step[step.name][instance.name] =
                                { id: lastTopoNodeObjectId, deviceId: deviceIdValue, side: side, tcaLabel: tcaLabel };
                        }
                    } else {
                        var objectType = configData.objectType;
                        if (!objectType) {
                            objectType = fullClassName;
                        }
                        var topologyObj = getTopologyObjectId(deviceIdValue, objectType, objectId);

                        logger.debug("Updating topology with objectType {} with id {}", topologyObj.objectType, topologyObj.topoObjectId);
                        var topoRoot = topologyFactory.createTopologyObjectWithTcaFrom(topologyObj.objectType, topologyObj.topoObjectId, side, tcaLabel);
                        pipelineContext.topologyObjects.push(topoRoot);
                        if (!pipelineContext.topology[deviceIdValue].step[step.name]) {
                            pipelineContext.topology[deviceIdValue].step[step.name] = {};
                        }
                        var prevVertex;
                        if (!instance.previousVertex && pipelineContext.topoFromConfig && pipelineContext.prevTopoStep) {
                            prevVertex = pipelineContext.prevTopoStep;
                        } else {
                            prevVertex = instance.previousVertex;
                        }
                        pipelineContext.topology[deviceIdValue].step[step.name][instance.name] =
                        {
                            id: topologyObj.topoObjectId,
                            deviceId: deviceIdValue,
                            prevStep: prevVertex,
                            side: side,
                            tcaLabel: tcaLabel
                        };
                    }
                    if (!pipelineContext.prevTopoStep || pipelineContext.prevTopoStep !== step.name) {
                        pipelineContext.prevTopoStep = step.name;
                    }
                }
            }
            logger.debug("PipelineContext contains: {}", apUtils.protectSensitiveDataLog(pipelineContext));
            result.setSuccess(true);
            return true;
        };

        function getAttributesToUpdate(misAlignedAttributes, attributeTypes) {
            var updatedAttributes = [];
            for (var i = 0; i < misAlignedAttributes.length; i++) {
                var attribute = {};
                var attributeName = misAlignedAttributes[i].name;
                attribute.name = attributeName;
                attribute.value = misAlignedAttributes[i].expectedValue;
                attribute.type = attributeTypes[attributeName];
                updatedAttributes.push(attribute);
            }
            return updatedAttributes;
        }

        function updateCreatedInstanceWithAttributes(objectId, attributes) {
            if (typeof attributes == 'string') {
                var attributesArray = JSON.parse(attributes).parameterlist;
                for (var attributeIdx in attributesArray) {
                    var attribute = attributesArray[attributeIdx];
                    if (attribute.name) {
                        attribute.name = objectId + attribute.name.substr(attribute.name.lastIndexOf(".") + 1, attribute.name.length)
                    } else if (attribute.key) {
                        attribute.key = objectId + attribute.key.substr(attribute.key.lastIndexOf(".") + 1, attribute.key.length)
                    }
                }
                var attributesJSON = JSON.parse(attributes);
                attributesJSON.parameterlist = attributesArray;
                attributes = JSON.stringify(attributesJSON);
            } else {
                for (var attributeIdx in attributes) {
                    var attribute = attributes[attributeIdx];
                    if (attribute.name) {
                        var numberOfDot = attribute.name.replace(objectId).split(".").length;
                        if (numberOfDot <= 1) {
                            attribute.name = objectId + attribute.name.substr(attribute.name.lastIndexOf(".") + 1, attribute.name.length)
                        }
                    } else if (attribute.key) {
                        attribute.key = objectId + attribute.key.substr(attribute.key.lastIndexOf(".") + 1, attribute.key.length)
                    }
                    if (attribute.audit && attribute.audit === "false") {
                        delete attribute.audit;
                    }
                }
            }
            return attributes;
        }

        function getTopologyObjectId(deviceId, objectType, objectId) {
            var acsClass = "acs:type=";
            var dnString = ":object=";
            /**
             * objectId format is
             * <device-id>:acs:type=<object-type>:object=<object-dn>
             * Eg:
             * NT-2(92.168.150.101):acs:type=lag.Interface:object=network:92.168.150.101:lag:interface-101
             */

            var topoId = deviceId + ":" + acsClass + objectType + dnString + objectId;
            return {
                "objectType": objectType,
                "topoObjectId": topoId
            }
        }

        /**
         * Updates topology and returns result
         **/
        this.getResult = function () {
            updateTopology();
            logger.debug("Topology Structure {}", JSON.stringify(pipelineContext.topology));
            var deviceIds = Object.keys(pipelineContext.topology);
            for (var deviceId = 0; deviceId < deviceIds.length; deviceId++) {
                var deviceKey = deviceIds[deviceId];
                var steps = Object.keys(pipelineContext.topology[deviceKey].step);
                if (steps) {
                    for (var stepName in steps) {
                        var instances = Object.keys(pipelineContext.topology[deviceId].step[stepName]);
                        for (var instance in instances) {
                            var topoId = pipelineContext.topology[deviceId].step[stepName][instance].id;
                            var prevVertexStep = pipelineContext.topology[deviceId].step[stepName][instance].prevStep;
                            var prevVertexIds = [];
                            if (prevVertexStep) {
                                var prevVertexInstances = Object.keys(pipelineContext.topology[deviceId].step[prevVertexStep]);
                                for (var prevVertexInstance in prevVertexInstances) {
                                    prevVertexIds.push(pipelineContext.topology[deviceId].step[prevVertexStep][prevVertexInstance].id);
                                }
                                updateTopologyPreviousVertex(topology, topoId, prevVertexIds);
                            }
                        }
                    }
                }
            }
            return result;
        }

        // Update the topology to have only the current topology objects, and remove the old ones that are not relevant.
        function updateTopology() {
            var currentTopologyObjects = Arrays.asList(pipelineContext.topologyObjects);
            topology.getTopologyObjects().removeIf(function (topoObj) {
                return !currentTopologyObjects.contains(topoObj);
            });
            for (var topoIndex in currentTopologyObjects) {
                if (!topology.getTopologyObjects().contains(currentTopologyObjects.get(topoIndex))) {
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
            deviceProcessor.setDeviceId(deviceId);
            var device = devices[deviceId];
            var steps = acsFwk.getPropertyData(device.steps, [target, intentConfigArgs, pipelineContext]);
            var deviceXtraInfo = {};
            logger.debug("Previous Device Config Args {}", apUtils.protectSensitiveDataLog(topologyXtraInfo[deviceId + "_ARGS"]));
            if (typeof topologyXtraInfo[deviceId + "_ARGS"] === "string") {
                deviceXtraInfo = JSON.parse(topologyXtraInfo[deviceId + "_ARGS"]);
                if (pipelineContext["operation"] == "synchronize") {
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
     * setDeviceId: This function should accept a single parameter the deviceId. This function should be used to prepare for device processing
     * processInstance: This function should perform operations on the given instance argument. Should return true or false,
     * depending on which the PipelineController would control pipeline execution
     * }
     **/
    function PiplelineController(stepArray, previousDeviceArgs, deviceProcessor) {
        var steps = stepArray;
        if (networkState === "delete") {
            // For "Delete" state, the pipeline is executed in the reverse
            return function () {
                for (var step = steps.length - 1; step >= 0; step--) {
                    var configStep = acsFwk.getPropertyData(steps[step], [target, intentConfigArgs, pipelineContext]);
                    if (configStep.ignoreOnDelete) {
                        logger.debug("Skipped Step {}", configStep.name);
                        continue;
                    }
                    logger.debug("Processing Step {}", configStep.name);
                    var instances = acsFwk.getPropertyData(configStep.instances, [target, intentConfigArgs, pipelineContext]);
                    for (var instance in instances) {
                        var prevParentInstance = pipelineContext.parentInstance;
                        if (configStep.steps) {
                            pipelineContext.parentInstance = instances[instance];
                            PiplelineController(configStep.steps, previousDeviceArgs, deviceProcessor)();
                        }
                        pipelineContext.parentInstance = prevParentInstance;
                        logger.debug("Processing Instance {}", apUtils.protectSensitiveDataLog(instances[instance]));
                        deviceProcessor.processInstance(configStep, instances[instance]);
                    }
                }
            }
        } else {
            return function () {
                for (var step in steps) {
                    var configStep = acsFwk.getPropertyData(steps[step], [target, intentConfigArgs, pipelineContext]);
                    logger.debug("Processing Step {}", configStep.name);
                    var instances = acsFwk.getPropertyData(configStep.instances, [target, intentConfigArgs, pipelineContext]);
                    var prevParent = pipelineContext.parentStep;
                    for (var instance in instances) {
                        logger.debug("Processing Instance {}", apUtils.protectSensitiveDataLog(instances[instance]));
                        var processChildSteps = deviceProcessor.processInstance(configStep, instances[instance]);
                        // If the processInstance returned false it means the current instance processing failed,
                        // and therefore its children should not be processed.
                        if (processChildSteps && configStep.steps) {
                            pipelineContext.parentStep = configStep.name;
                            pipelineContext.parentInstance = instances[instance];
                            PiplelineController(configStep.steps, previousDeviceArgs, deviceProcessor)();
                        }
                    }
                    pipelineContext.parentStep = prevParent;
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
     * Prunes the extra annotations present in the attributes property of an FTL, and returns a key value pair {"name": "value"}
     **/
    function getConfigAttributeValues(configData) {
        var attributes = {};
        var attributesArray = acsFwk.getAttributesArray(configData);
        for (var attributeIdx in attributesArray) {
            var attribute = attributesArray[attributeIdx];
            var key = attribute['name'] ? attribute['name'] : attribute['key'];
            attributes[key] = attribute['value'];
        }
        return attributes;
    }

    /**
     * Prunes the extra annotations present in the attributes property of an FTL, and returns a key value pair {"name": "type"}
     **/
    function getConfigAttributeTypes(configData) {
        var attributes = {};
        var attributesArray = acsFwk.getAttributesArray(configData);
        for (var attributeIdx in attributesArray) {
            var attribute = attributesArray[attributeIdx];
            var key = attribute['name'] ? attribute['name'] : attribute['key'];
            attributes[key] = attribute['type'];
        }
        return attributes;
    }

    /**
     * Fetches the templateFile to be used for the @param intentConfigStep and process the FTL
     * with the @param intentConfigArgs. The "networkState" attribute is also passed for FTL processing
     **/
    function getConfigurationData(target, intentConfigStep, instance, intentConfigArgs) {
        var templateResource = intentConstants.INTERNAL_LIGHTSPAN_DIRECTORY + intentConfigStep.name + ".ftl";
        // var templateResource = intentConfigStep.name + ".ftl";
        if (intentConfigStep.templateFile) {
            templateResource = acsFwk.getPropertyData(intentConfigStep.templateFile, [instance, target, intentConfigArgs, pipelineContext]);
        }
        var template = resourceProvider.getResource(templateResource);
        var rawTemplateArguments = {};

        if (intentConfigStep.instanceArguments) {
            rawTemplateArguments = acsFwk.getPropertyData(intentConfigStep.instanceArguments, [instance, target, intentConfigArgs, pipelineContext]);
            rawTemplateArguments["networkState"] = desiredNetworkState;
        }
        Object.bindProperties(rawTemplateArguments, intentConfigArgs); //Append the intent configuration
        logger.debug("Proccessing FTL - {} with arguments - {}", templateResource, apUtils.protectSensitiveDataLog(rawTemplateArguments));
        var processedTemplate = utilityService.processTemplate(template, rawTemplateArguments);
        return JSON.parse(processedTemplate);
    }
}

// NOKIA-ACS Methods

function ACSProxy(targetDevice) {

    getRestClient(targetDevice);

    this.executeAction = function (fdn, action, fullClassName) {
        var resourceFile = resourceProvider.getResource(action + ".ftl");
        var templateArgs = {};
        var setParamValuesRequestBody = utilityService.processTemplate(resourceFile, templateArgs);
        return moCreate(fdn, fullClassName, setParamValuesRequestBody);
    }

    this.create = function (fdn, fullClassName, attributes) {
        var resourceFile = resourceProvider.getResource(intentConstants.INTERNAL_LIGHTSPAN_DIRECTORY + "SPV.ftl");
        var templateArgs = {
            "attributes": JSON.stringify(attributes),
        };
        var setParamValuesRequestBody = utilityService.processTemplate(resourceFile, templateArgs);
        logger.debug("Creating {} with fdn {} attributes {}", fullClassName, fdn, apUtils.protectSensitiveDataLog(attributes));
        return moCreate(fdn, fullClassName, setParamValuesRequestBody);
    };

    this.addObject = function (deviceName, ObjectName) {
        var objectName = "" + ObjectName + "";
        var resourceFile = resourceProvider.getResource(intentConstants.INTERNAL_LIGHTSPAN_DIRECTORY + "addObject.ftl");
        var templateArgs = {
            "objectName": objectName,
        };
        var requestBody = utilityService.processTemplate(resourceFile, templateArgs);
        var instanceUrl = deviceUrl + encodeURIComponent(deviceName) + "/action";
        var res = {}
        logger.debug("Requesting the {} for addObject", instanceUrl);
        restClient.post(instanceUrl, contentType, requestBody, contentType, function (exception, httpStatus, response) {
            if (exception) {
                logger.error("Couldn't connect to Manager of Device: " + (deviceName), exception);
                throw exception;
            }
            if (httpStatus != 200) {
                logger.error("Request Failed with status code: " + httpStatus + " and response: " + response + " for the device: " + (deviceName));
            }
            res = response;
            logger.debug("Result of {} : {}", instanceUrl, response);

        });
        if (res.contains("faultString")) {
            handleServerError(res, deviceName);
        }
        return JSON.parse(res);
    }


    this.deleteObject = function (deviceName, ObjectName) {
        var objectName = "" + ObjectName + "";
        var resourceFile = resourceProvider.getResource(intentConstants.INTERNAL_LIGHTSPAN_DIRECTORY + "deleteObject.ftl");
        var templateArgs = {
            "objectName": objectName,
        };
        var requestBody = utilityService.processTemplate(resourceFile, templateArgs);
        var instanceUrl = deviceUrl + encodeURIComponent(deviceName) + "/action";
        var res = {};
        logger.debug("Requesting the {} for deleteObject", instanceUrl);
        restClient.post(instanceUrl, contentType, requestBody, contentType, function (exception, httpStatus, response) {
            if (exception) {
                logger.error("Couldn't connect to Manager of Device: " + (deviceName), exception);
                throw exception;
            }
            if (httpStatus != 200) {
                logger.error("Request Failed with status code: " + httpStatus + " and response: " + response + " for the device: " + (deviceName));
            }
            res = response;
            logger.debug("Result of {} : {}", instanceUrl, response);

        });
        if (res.contains("faultString")) {
            handleServerError(res, deviceName);
        }
        return JSON.parse(res);
    }

    this.addDeleteDeviceTRMGroupStep = function (deviceName, methodType) {
        var result = {};
        var url = "/rest/trm/groups/group_2/" + encodeURIComponent(deviceName);
        var requestBody = { "data": "none" };
        logger.debug("Requesting the {} for addDeleteDeviceTRMGroupStep", url);
        if (methodType == "put") {
            logger.debug("Adding device {} to TRM Group", deviceName);
            restClient.put(url, contentType, JSON.stringify(requestBody), contentType, function (exception, httpStatus, response) {
                if (exception) {
                    logger.error("Couldn't add Device: " + (deviceName) + " to the TRM group ", exception);
                    throw exception;
                }
                if (httpStatus != 200) {
                    logger.error("Add device to TRM group Request Failed with status code: " + httpStatus + " and response: " + response + " for the device: " + (deviceName));
                }
                logger.debug("Result of {} for addDeleteDeviceTRMGroupStep: {}", url, response);
                result = response;
            });
        } else if (methodType == "delete") {
            logger.debug("Deleting device {} to TRM Group", deviceName);
            restClient.delete(url, contentType, function (exception, httpStatus, response) {
                if (exception) {
                    logger.error("Couldn't remove Device: " + (deviceName) + " from the TRM group ", exception);
                    throw exception;
                }
                if (httpStatus != 200) {
                    logger.error("Delete device from TRM group request Failed with status code: " + httpStatus + " and response: " + response + " for the device: " + (deviceName));
                }
                logger.debug("Result of {} for addDeleteDeviceTRMGroupStep: {}", url, response);
                result = response;
            });
        }
        if (!result) {
            logger.warn("Device not added to TRM group since TRM configurations env is not set in acs mediator")
        }
        if (result && result.contains("faultString")) {
            handleServerError(result, deviceName);
        }
        return;
    }

    this.getDeviceDetails = function (deviceName) {
        var url = deviceUrl + deviceName;
        var res = {}
        logger.debug("Requesting the {} for getDevice", url);
        restClient.get(url, contentType, function (exception, httpStatus, response) {
            if (exception) {
                logger.error("Couldn't connect to Manager of Device: " + (deviceName), exception);
                throw exception;
            }
            if (httpStatus != 200) {
                logger.error("Request Failed with status code: " + httpStatus + " and response: " + response + " for the device: " + (deviceName));
            }
            res = response;
            logger.debug("Result of {} : {}", url, response);
        });
        return JSON.parse(res);
    }


    this.deleteDevice = function (deviceName) {
        var url = deviceUrl + deviceName;
        var res = {};
        restClient.delete(url, contentType, function (exception, httpStatus, response) {
            if (exception) {
                logger.error("Couldn't connect to Manager of Device: " + (deviceName), exception);
                throw exception;
            }
            if (httpStatus != 200) {
                logger.error("Request Failed with status code: " + httpStatus + " and response: " + response + " for the device: " + (deviceName));
            }
            res = response;
            logger.debug("Device is deleted succesfully");

        });
        if (res.contains("faultString")) {
            handleServerError(res, deviceName);
        }
    }

    this.createDevice = function (deviceName) {
        var res = {};
        restClient.post(deviceUrl + deviceName, contentType, "{}", contentType, function (exception, httpStatus, response) {
            if (exception) {
                logger.error("Couldn't connect to Manager of Device: " + (deviceName), exception);
                throw exception;
            }
            if (httpStatus != 200) {
                logger.error("Request Failed with status code: " + httpStatus + " and response: " + response + " for the device: " + (deviceName));
            }
            res = response;
            logger.debug("Result of {} : {}", deviceUrl, response);
        });
        if (res.contains("faultString")) {
            handleServerError(res, deviceName);
        }
        return;
    }

    this.replaceDevice = function (oldDeviceName, currentDeviceName) {
        var resourceFile = resourceProvider.getResource(intentConstants.INTERNAL_LIGHTSPAN_DIRECTORY + "replaceDevice.ftl");
        var templateArgs = {
            "deviceName": currentDeviceName
        };
        var requestBody = utilityService.processTemplate(resourceFile, templateArgs);
        var res = {};
        restClient.put(deviceUrl + oldDeviceName, contentType, requestBody, contentType, function (exception, httpStatus, response) {
            if (exception) {
                logger.error("Couldn't connect to Manager of Device: " + (currentDeviceName), exception);
                throw exception;
            }
            res = response;
            if (httpStatus != 200) {
                logger.error("Request Failed with status code: " + httpStatus + " and response: " + response + " for the device: " + (currentDeviceName));
            } else {
                logger.debug("Result of {} : {}", deviceUrl, response);
            }
        });
        if (res.contains("faultString")) {
            handleServerError(res, currentDeviceName);
        }
    }

    this.getObjectByTypeInBulk = function (deviceId, ObjectNamesList, isActionReachability) {
        var searchOutput = {};
        try {
            searchObjectByTypeInBulk(deviceId, ObjectNamesList, function (searchResults) {
                searchOutput = searchResults;
            });
            if (searchOutput.contains("faultString") && !isActionReachability) {
                handleServerError(searchOutput, deviceId);
            }
        } catch (e) {
            throw e;
        }
        return JSON.parse(searchOutput);
    }

    function searchObjectByTypeInBulk(deviceName, ObjectNamesList, resultCallBack) {
        logger.debug("Searching with deviceName {} for ObjectNamesList {} resultCallBack {}", deviceName, ObjectNamesList, resultCallBack);
        var resourceFile = BULK_GPV;
        var templateArgs = {
            "ObjectNamesList": JSON.stringify(ObjectNamesList)
        };
        var requestBody = utilityService.processTemplate(resourceFile, templateArgs);
        var instanceUrl = deviceUrl + encodeURIComponent(deviceName) + "/action";
        restClient.post(instanceUrl, contentType, requestBody, contentType, function (exception, httpStatus, response) {
            if (exception) {
                logger.error("Couldn't connect to Manager of Device: " + (deviceName), exception);
                throw exception;
            }
            resultCallBack(response);
        });
    }

    this.getObjectByType = function (deviceId, ObjectName, isActionReachability) {
        var searchOutput = {};
        try {
            searchObjectByType(deviceId, ObjectName, function (searchResults) {
                searchOutput = searchResults;
            }, isActionReachability);
            if (searchOutput.contains("faultString") && !isActionReachability) {
                handleServerError(searchOutput, deviceId);
            }
        } catch (e) {
            throw e;
        }
        return JSON.parse(searchOutput);
    }

    function searchObjectByType(deviceName, ObjectName, resultCallBack, isActionReachability) {
        var objectName = "" + ObjectName + "";
        logger.debug("Searching with deviceName {} for ObjectName {} resultCallBack {}", deviceName, ObjectName, resultCallBack);
        if (isActionReachability) {
            logger.debug("Action is reachability, using constant GPV from acs-fwk.js instead of GPV.ftl");
            var resourceFile = GPV;
        } else {
            var resourceFile = resourceProvider.getResource(intentConstants.INTERNAL_LIGHTSPAN_DIRECTORY + "GPV.ftl");
        }
        var templateArgs = {
            "objectName": objectName
        };
        var requestBody = utilityService.processTemplate(resourceFile, templateArgs);
        var instanceUrl = deviceUrl + encodeURIComponent(deviceName) + "/action";
        restClient.post(instanceUrl, contentType, requestBody, contentType, function (exception, httpStatus, response) {
            if (exception) {
                logger.error("Couldn't connect to Manager of Device: " + (deviceName), exception);
                throw exception;
            }
            resultCallBack(response);
        });
    }

    function getRestClient(deviceName) {
        if (!deviceName.startsWith("Local##")) {
            var managerInfo = apUtils.getManagerInfoFromEsAndMds(deviceName);
            var managerName = managerInfo.getName().toString();
            //   var suggestACSManagerNames = fwk.suggestNokiaACSManagerNames();
            //   if (managerName.length > 0) {
            //       var managerName = suggestACSManagerNames.get(0);
            if (managerName != null) {
                var managerInfo = mds.getManagerByName(managerName);
                checkManagerConnectivityStatus(managerInfo);
                var managerType = managerInfo.getType().toString();
                if (managerType === "NOKIA_ACS") {
                    restClient.setIp(managerInfo.getIp());
                    restClient.setPort(managerInfo.getPort());
                    restClient.setProtocol(managerInfo.getProtocol().name());
                }
            } else {
                logger.error("Manager not found : " + managerName);
                throw new RuntimeException("Manager not found : " + managerName);
            }
            //   } else {
            //       logger.error("Manager not found : " + managerName);
            //       throw new RuntimeException("Manager not found.");
            //   }
        }
    }

    /**
     * Method used to check the manager connectivity status ,
     * if the manager not the type of 'REST' or the status is 'DISCONNECTED'
     * the method will throw the error.
     * @param managerInfo
     */
    function checkManagerConnectivityStatus(managerInfo) {
        if (managerInfo) {
            if (managerInfo.getConnectivityState().toString() === 'DISCONNECTED') {
                var managerType = managerInfo.getType().toString();
                var managerName = managerInfo.getName();
                if (managerType === 'NOKIA_ACS' || managerType == 'GENERIC_ACS') {
                    throw new RuntimeException("Manager " + managerName + " is disconnected.");
                } else {
                    logger.error("Manager not found");
                    throw new RuntimeException("Manager not found");
                }
            }
        } else {
            logger.error("Manager not found");
            throw new RuntimeException("Manager not found");
        }
    }

    function restResultCallBack(exception, httpStatus, response, resultCallBack) {
        if (exception) {
            logger.error("Couldn't connect to Manager of Device: ", exception);
            throw exception;
        } else if (httpStatus >= 400) {
            logger.error("Request Failed with status code: " + httpStatus + " exception: " + exception + " response: " + response);
            throw new RuntimeException("Request Failed with response: " + response + " and HTTP code: " + httpStatus, exception);
        } else {
            var json = JSON.parse(response);
            logger.debug("executeRequest - Result: {}", response);
            if (json["faultCode"]) {
                if (json["details"] && typeof json["details"] == "string") {
                    throw new Exception(json["details"]);
                } else if (json["faultString"]) {
                    throw new RuntimeException(json["faultString"]);
                }
            }
        }
    }

    function executeRequest(requestUrl, restMethodName, requestBody, callback) {
        var result = {};
        if (!callback) {
            callback = restResultCallBack;
        }
        logger.debug("Nokia-ACS IntentTypeFwk- requestUrl: {} requestBody: {} restMethodName: {}", requestUrl, apUtils.protectSensitiveDataLog(requestBody), restMethodName);
        if (restMethodName === 'post') {
            restClient.post(requestUrl, contentType, requestBody, contentType, function (exception, httpStatus, response) {
                callback(exception, httpStatus, response, function (resultJson) {
                    if (exception) {
                        logger.error("Unable to config Device: ", exception);
                        throw exception;
                    }
                    result = resultJson;
                    logger.debug("executeRequest - Result: {}", result);
                    if (result.faultCode) {
                        throw new RuntimeException("Sync Failed with response: " + result.faultCode);
                    }
                });
            });
        } else if (restMethodName === 'put') {
            restClient.put(requestUrl, contentType, requestBody, contentType, function (exception, httpStatus, response) {
                callback(exception, httpStatus, response, function (resultJson) {
                    result = resultJson;
                });
            });
        } else {
            restClient.delete(requestUrl, contentType, function (exception, httpStatus, response) {
                if (exception) {
                    logger.error("Couldn't connect to Manager of Device: ", exception);
                    throw exception;
                }
                if (httpStatus >= 400 && httpStatus !== 404) {
                    logger.error("Request Failed with status code: " + httpStatus + " exception: " + exception + " response: " + response);
                    handleServerError(response, deviceId)
                }
            });
        }
        return result;
    }

    function moCreate(fdn, fullClassName, attributes) {
        var httpOperation = 'post';
        var instanceUrl = deviceUrl + encodeURIComponent(fdn) + "/action";
        return executeRequest(instanceUrl, httpOperation, attributes);
    }

    function handleServerError(response, deviceName) {
        var errorMessage;
        try {
            var json = JSON.parse(response);
        } catch (e) {
            throw new RuntimeException(response);
        }
        errorMessage = json["faultString"];
        logger.error("Response Failed : " + JSON.stringify(errorMessage) + " for device: " + (deviceName));
        if (errorMessage && errorMessage.indexOf("code") > 0 && errorMessage.indexOf("localizedMessage") > 0) {
            var impactErrorJson = JSON.parse(errorMessage);
            throw new RuntimeException(getImpactFaultReason(impactErrorJson) + " " + deviceName);
        } else if (errorMessage && errorMessage.contains("faultCode")) {
            var faultStringContent = JSON.parse(errorMessage);
            throw new RuntimeException(getFaultReason(faultStringContent) + ": " + deviceName);
        } else {
            throw new RuntimeException(errorMessage);
        }
    }

    function getImpactFaultReason(impactErrorJson) {
        var faultReason = "Internal Server Error";
        switch (impactErrorJson.code) {
            case "dsm.device.already.exist":
                faultReason = "A Device already exists ";
                break;
            default:
                faultReason = impactErrorJson.localizedMessage;
        }
        return faultReason;
    }

    function getFaultReason(faultResponse) {
        var faultReason = "";
        switch (faultResponse.faultCode) {
            case "criteria.template.invalid.arguments":
                faultReason = "Criteria template invoked with incorrect arguments";
                break;
            case "criteria.template.not.found":
                faultReason = "Criteria template not found";
                break;
            case "invalid.protocol":
                faultReason = "Invalid protocol specified";
                break;
            case "validation.exception":
                faultReason = "Validation Exception";
                break;
            case "invalid.operation.parameter":
                faultReason = "Invalid operation parameter specified";
                break;
            case "operation.function.invalid.function.code":
                faultReason = "Invalid function code for operation specified";
                break;
            case "operation.function.validation.null":
                faultReason = "Invalid function code for operation specified";
            case "single.device.operation.failed.device.captured":
                faultReason = "Single device operation failed on ACS server";
                break;
            case "single.device.operation.failed.device.not.captured":
                faultReason = "Single device operation failed on ACS server";
                break;
            case "custom.function.deleted":
                faultReason = "Custom function is deleted on ACS server";
                break;
            case "internal.error":
                faultReason = "Internal ACS server error";
                break;
            case "operation.timeout.exception":
                faultReason = "Operation timeout on ACS server";
                break;
            case "system.exception":
                faultReason = "System exception on ACS server";
                break;
            case "device.operation.exceptions":
                faultReason = "Device operation caused exception on ACS server";
                break;
            case "device.type.could.not.be.found":
                faultReason = "Device type could not be found";
                break;
            case "device.could.not.be.found":
            case "device.not.found.or.deleted":
                faultReason = "Device could not be found";
                break;
            case "device.already.exists":
                faultReason = "The Device already exists in ACS";
                break;
            case "firmware.image.not.found":
                var activeSoftware = faultResponse["firmwareImage"];
                faultReason = "Firmware image " + activeSoftware + " not found";
                break;
            default:
                if (faultResponse.faultCode) {
                    faultReason = "Remote error " + faultResponse.faultCode;
                } else if (faultResponse.details) {
                    faultReason = faultResponse.details;
                } else if (faultResponse.faultString) {
                    faultReason = faultResponse.faultString;
                } else if (faultResponse.faultKey) {
                    faultReason = faultResponse.faultKey;
                }

        }
        if (faultReason == "") {
            if (faultResponse.details) {
                faultReason = faultResponse.details;
            } else if (faultResponse.faultString) {
                faultReason = faultResponse.faultString;
            }
        }
        return faultReason;
    }

    this.getDeviceFirmwaresDetails = function (deviceName) {
        var url = "/rest/devices/" + deviceName + "/firmwares";
        var res = {}
        logger.debug("Requesting the {} for DeviceFirmwares", url);
        restClient.get(url, contentType, function (exception, httpStatus, response) {
            if (exception) {
                logger.error("Couldn't connect to Manager of Device: " + (deviceName), exception);
                throw exception;
            }
            if (httpStatus != 200) {
                logger.error("Request Failed with status code: " + httpStatus + " and response: " + response + " for the device: " + (deviceName));
            }
            res = response;
            logger.debug("Result of {} : {}", url, response);

        });
        return JSON.parse(res);
    }

    this.firmwareUpdateOpt = function (deviceName, instanceNames, activeSoftware) {
        var body = {
            "actionType": "firmwareUpdate",
            "parameterNames": instanceNames
        };
        var actionErroMsg = "";
        var url = deviceUrl + encodeURIComponent(deviceName) + "/action";
        var res;
        restClient.post(url, contentType, JSON.stringify(body), contentType, function (exception, httpStatus, response) {
            if (exception) {
                logger.error("Couldn't connect to Manager of Device: " + (deviceName), exception);
                throw exception;
            }
            if (httpStatus != 200) {
                actionErroMsg = "Request Failed with status code: " + httpStatus;
                logger.error("Request Failed with status code: " + httpStatus + " and response: " + response + " for the device: " + (deviceName));
            }
            res = response;
            logger.debug("Result of {} : {}", url, response);
        });
        var result = JSON.parse(res);
        if (result && result.result == "ERROR") {
            var errorMessage = result.parameterResponse[0].error;
            var faultResponse = JSON.parse(errorMessage);
            if (faultResponse["faultCode"] == "firmware.image.not.found") {
                faultResponse["firmwareImage"] = activeSoftware;
            }
            actionErroMsg = getFaultReason(faultResponse);
        }
        result["ErrorMessage"] = actionErroMsg;
        return result;
    }

}

function DeviceHandler() {
    this.handleDevice = function (requestContext) {
        var intentConfig = requestContext.getFromCache("intentConfigJson");
        var target = requestContext.getFromCache("target");
        var storedTemplateArgs = requestContext.getFromCache("topologyXtraInfo")[target + "_ARGS"];
        var syncFailuresStoredTemplateArgs = requestContext.getFromCache("topologyXtraInfo")[target + _SYNC_FAILURES];
        var currentDeviceCreate = intentConfig["device-create"];
        var currentDuid = intentConfig["duid"];
        var currentDeviceArgs = {
            "duid": currentDuid,
            "device-oui": intentConfig["device-oui"],
            "device-class": intentConfig["device-class"],
            "device-variant": intentConfig["device-variant"]
        };
        var currentDeviceName = acsFwk.getDeviceNameFromArgs(currentDeviceArgs);
        var isPMBulkCollectionEnable = intentConfig["pm-bulk-collection-enable"];
        var networkState = requestContext.getFromCache("networkState");
        if (networkState == "active") {
            if (currentDeviceCreate == "true") {
                if (acsFwk.isEmpty(storedTemplateArgs)) { // create operation only applicable for device create true
                    this.create(currentDeviceName, requestContext);
                }
            }
            if (!acsFwk.isEmpty(storedTemplateArgs)) { // modify case with device create true & false
                var oldDuid = storedTemplateArgs["duid"] ? storedTemplateArgs["duid"] : null;
                var oldOui = storedTemplateArgs["device-oui"];
                var oldProductClass = storedTemplateArgs["device-class"];
                var oldDeviceVariant = storedTemplateArgs["device-variant"];
                var oldDeviceName = acsFwk.getDeviceNameFromArgs({
                    "duid": oldDuid,
                    "device-oui": oldOui,
                    "device-class": oldProductClass,
                    "device-variant": oldDeviceVariant
                });

                if (currentDeviceCreate == "true") {
                    var oldDeviceCreate = storedTemplateArgs["device-create"];
                    if (currentDeviceCreate != oldDeviceCreate) {
                        this.create(currentDeviceName, requestContext);
                    }
                    if (oldDuid == null && currentDuid) {
                        this.create(currentDeviceName, requestContext);
                    } else if (oldDuid != null && !currentDuid) {
                        this.delete(oldDeviceName, requestContext);
                    }
                }
                if (oldDuid && currentDuid) {
                    if (oldDeviceName != currentDeviceName) {
                        this.replace(oldDeviceName, currentDeviceName, requestContext);
                    }
                }
            }

            if (currentDeviceName) {
                if (isPMBulkCollectionEnable == "true") {
                    var modelName = acsFwk.getModelName(currentDeviceArgs);
                    if (pmModelService.isModelActive("TR069Bulk", modelName) && currentDuid) {
                        acsFwk.addDeleteDeviceTRMGroupStepInACS(currentDeviceName, "put");
                    }
                    if (oldDuid && oldDeviceName != currentDeviceName) {
                        logger.debug("Deleting the old device name {} from group after replacing with new Device {}", oldDeviceName, currentDeviceName);
                        acsFwk.addDeleteDeviceTRMGroupStepInACS(oldDeviceName, "delete");
                    }
                } else {
                    if (storedTemplateArgs != null) { //once the topology is there it is for modification so if flag is false delete the device from the trm group
                        var oldPmBulkCollectionEnableFlag = storedTemplateArgs["pm-bulk-collection-enable"] ? storedTemplateArgs["pm-bulk-collection-enable"] : "false";
                        if (oldPmBulkCollectionEnableFlag == "true" && isPMBulkCollectionEnable == "false") {
                            logger.debug("deleting the device from trm group since pm bulk collection enable flag is false {}", currentDeviceName);
                            acsFwk.addDeleteDeviceTRMGroupStepInACS(currentDeviceName, "delete");
                        }
                    }
                }
            }
        } else if (networkState == "delete") {
            if (currentDuid != null) {
                if (currentDeviceCreate == "true") {
                    logger.debug("Removing the device from ACS : {}", currentDeviceName);
                    this.delete(currentDeviceName, requestContext);
                }
                if (isPMBulkCollectionEnable == "true") {
                    logger.debug("Removing the device from TRMGroupStep : {}", currentDeviceName);
                    acsFwk.addDeleteDeviceTRMGroupStepInACS(currentDeviceName, "delete");
                }
            }
        }
        if (syncFailuresStoredTemplateArgs) {
            if (syncFailuresStoredTemplateArgs[CREATE_DEVICE_FAILED]) {
                logger.warn("Re-Creating the device {} as it was failed in last sync due to some reason", (currentDeviceName))
                this.create(currentDeviceName, requestContext);
            } else if (syncFailuresStoredTemplateArgs[REPLACE_DEVICE_FAILED]) {
                logger.warn("Re-Replacing the device {} as it was failed in last sync due to some reason", (currentDeviceName))
                var oldDeviceNameFromPreviousSync = syncFailuresStoredTemplateArgs[REPLACE_DEVICE_FAILED];
                this.replace(oldDeviceNameFromPreviousSync, currentDeviceName, requestContext);
            } else if (syncFailuresStoredTemplateArgs[DELETE_DEVICE_FAILED]) {
                var oldDeleteDeviceNameFromPreviousSync = syncFailuresStoredTemplateArgs[DELETE_DEVICE_FAILED];
                logger.warn("Re-Deleting the device {} as it was failed in last sync due to some reason", (currentDeviceName))
                this.delete(oldDeleteDeviceNameFromPreviousSync, requestContext);
            }
        }
    }

    this.create = function (deviceName, requestContext) {
        if (acsFwk.isManagerConnected()) {
            logger.debug("creating device {} in ACS Manager from FMC", deviceName)
            try {
                acsFwk.createDeviceInAcs(deviceName);
            } catch (e) {
                acsFwk.updateSyncFailure(requestContext, CREATE_DEVICE_FAILED);
                logger.error("Exception while creating the device", e);
            }
        } else {
            acsFwk.updateSyncFailure(requestContext, CREATE_DEVICE_FAILED);
            throw new RuntimeException("Manager for ACS is disconnected");
        }
    }

    this.replace = function (oldDeviceName, currentDeviceName, requestContext) {
        if (acsFwk.isManagerConnected()) {
            logger.debug("Replacing device {} with new device {} in ACS Manager from FMC", oldDeviceName, currentDeviceName);
            if (currentDeviceName) {
                try {
                    acsFwk.replaceDeviceInAcs(oldDeviceName, currentDeviceName);
                } catch (e) {
                    var replaceFailed = {};
                    replaceFailed["replaceDeviceFailed"] = oldDeviceName;
                    acsFwk.updateSyncFailure(requestContext, replaceFailed);
                    logger.error("Exception while replacing the device", e);
                }
            }
        } else {
            var replaceFailed = {};
            replaceFailed["replaceDeviceFailed"] = oldDeviceName;
            acsFwk.updateSyncFailure(requestContext, replaceFailed);
            throw new RuntimeException("Manager for ACS is disconnected");
        }
    }

    this.delete = function (deviceName, requestContext) {
        if (acsFwk.isManagerConnected()) {
            logger.debug("Deleting device {} in ACS Manager from FMC", deviceName)
            if (deviceName) {
                try {
                    acsFwk.deleteDeviceInAcs(deviceName);
                } catch (e) {
                    var deleteFailed = {};
                    deleteFailed["deleteDeviceFailed"] = deviceName;
                    acsFwk.updateSyncFailure(requestContext, deleteFailed);
                    logger.error("device deletion {} from acs failed ", deviceName, e);
                }
            }
        } else {
            var deleteFailed = {};
            deleteFailed["deleteDeviceFailed"] = deviceName;
            acsFwk.updateSyncFailure(requestContext, deleteFailed, synchronizeResult);
            throw new RuntimeException("Manager for ACS is disconnected");
        }
    }
}

var GPV = "{\"actionType\":\"getParameterValues\",\"parameterNames\":[\"${objectName}\"]}";

var BULK_GPV = "{\"actionType\":\"getParameterValues\",\"parameterNames\":${ObjectNamesList}}";
