/**
 * (c) 2020 Nokia. All Rights Reserved.
 *
 * INTERNAL - DO NOT COPY / EDIT
 **/
load({
    script: resourceProvider.getResource('internal/manager-specific/nv/createDevice/device-utilities.js'),
    name: 'internal/manager-specific/nv/createDevice/device-utilities.js'
});
var deviceUtilities = new DeviceUtilities();

/**
 * VirtualizerDeviceManager class support NC device creation, local device creation with varius steps.
 * steps supporting : create-device, s/w upgrade, plug match , backplane support, ihub lt ports support.
 * @constructor
 */
function VirtualizerDeviceManager() {
    this.deviceManagerName = "device-manager";
    this.prefix = "internal/manager-specific/nv/createDevice/";
    this.ihubPort = 831;
    this.ltBasePort = 832;
    this.sync = 'sync';
    this.audit = 'audit';
    this.LT_DEVICES_TOPO_NAME = "LT_DEVICES";
    if(requestScope.get().get("disableDefaultPortCheck")) {
      var intentConfigJson = requestScope.get().get("intentConfigJson");
      if(intentConfigJson["ip-port"]) {
        this.ihubPort = Number(intentConfigJson["ip-port"]) - 1;
        this.ltBasePort = Number(intentConfigJson["ip-port"]);
      }
    }
    if (!requestScope.get().get("DevicesInvolved")) {
        requestScope.get().put("DevicesInvolved", [])
    }
    if (!requestScope.get().get("device-template")) {
        requestScope.get().put("device-template", {})
    }
    if (!requestScope.get().get("syncCompletedDevices")) {
        requestScope.get().put("syncCompletedDevices",[]);
    }
    if (!requestScope.get().get("extraInfoSyncedDevices")) {
        requestScope.get().put("extraInfoSyncedDevices",[]);
    }    
    if (!requestScope.get().get("ltDeviceVersions")) {
        requestScope.get().put("ltDeviceVersions",{});
    }
    if(!requestScope.get().get("partitionProfile")){
        requestScope.get().put("partitionProfile",{});
    }
    if(!requestScope.get().get("isNtSwAligned")){
        requestScope.get().put("isNtSwAligned",true);
    }
    if(!requestScope.get().get("isSkipNTSwAlignedValidate")){
        requestScope.get().put("isSkipNTSwAlignedValidate",true);
    }
    if(!requestScope.get().get("interfaceVerisonDevices")){
        requestScope.get().put("interfaceVerisonDevices",{});
    }
}

/**
 *
 * @param listName
 * @returns {[string, string]|[string]|null}
 */
VirtualizerDeviceManager.prototype.getKeyForList = function (listName) {
    switch (listName) {
        case "label":
            return ["category", "value"];
        case "boards":
            return ["slot-name"];
        default:
            return null;
    }
}

/**
 * This step object used to create device in NV.
 * The Step object non-yang aware component , it working based on the provided config json.
 * The templates stored in the request-context and reused to avoid multiple get-config to AV.
 * @param deviceName
 * @param configJson
 * @param topology
 * @returns step-object {{name: string, resourceFile: string, getTemplateArguments: (function(*=, *=): *)}}
 */
VirtualizerDeviceManager.prototype.constructStepObjectForDeviceCreation = function (deviceName, configJson, topology) {


    var deviceManagerObj = this; 
    var allProfiles = requestScope.get().get("allProfiles");
    return {
        name: "deviceCreation",
        resourceFile: deviceManagerObj.prefix + "createDeviceRequest.xml.ftl",
        sensitiveKeys: ["password", "fallback-password"],
        getTemplateArguments: function (baseArgs, topology) {
            if(allProfiles && allProfiles["deviceOAMProfiles"] && configJson){
                var allOAMProfiles = allProfiles["deviceOAMProfiles"];
                if(configJson["main-oam-connectivity-account"]){
                    var mainOamConnectivityAccount = configJson["main-oam-connectivity-account"];
                    for (let key in allOAMProfiles) {
                        if(key == mainOamConnectivityAccount) {
                            baseArgs["username"] = allOAMProfiles[key]["username"];
                            baseArgs["password"] = allOAMProfiles[key]["password"];
                        }
                    }
                }
                if(configJson["fallback-oam-connectivity-account"]){
                    var fallbackOamConnectivityAccount = configJson["fallback-oam-connectivity-account"];
                    for (let key in allOAMProfiles) {
                        if(key == fallbackOamConnectivityAccount) {
                            baseArgs["fallback-username"] = allOAMProfiles[key]["username"];
                            baseArgs["fallback-password"] = allOAMProfiles[key]["password"];
                        }
                    }
                }
            }
            //duid for the iHUB device is different from the SHELF. so configJson have the correct duid, duid2
            delete baseArgs["duid"];
            delete baseArgs["duid2"];
            configJson["isDuid2Supported"] = apCapUtils.getCapabilityValue(configJson["hardware-type"], configJson["device-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DUID2_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            apUtils.getMergedObject(baseArgs, configJson);
            // Delete the template from baseArgs because in case of LT the template is empty baseArgs has the NT template with the same key.
            // So we should consider the configJson entry
            if(!configJson["device-template"]) {
                delete baseArgs["device-template"];
            }
            if ((!topology || (topology && !(topology.getTarget())))) {
                var deviceInfos = mds.getAllInfoFromDevices(deviceName);
                if (deviceInfos == null || deviceInfos.isEmpty()) {
                    baseArgs["isCreateDevice"] = true;
                }
            }
            var lastIntentConfigFromTopo = apUtils.getLastIntentConfigFromTopologyXtraInfo(topology);
            requestScope.get().put("lastIntentConfigFromTopo",lastIntentConfigFromTopo);
            if (baseArgs["isCreateDevice"]) {
                if (configJson["device-template"] && (baseArgs.operation !== "remove") && (baseArgs.operation !== "")) {
                    var deviceTemplateObj = requestScope.get().get("device-template");
                    if (!(deviceTemplateObj[configJson["hardware-type"]]) ||
                        !(deviceTemplateObj[configJson["hardware-type"]][configJson["device-template"]])) {
                        deviceLogger.info(new DeviceRefId(deviceName),"get device-template from device for hw type: {}", configJson["hardware-type"]);
                        baseArgs["navDeviceSpecificData"] = deviceManagerObj.getNAVTemplateData(configJson[deviceManagerObj.deviceManagerName], configJson["device-template"], configJson["hardware-type"], configJson["device-version"]);
                        if(!deviceTemplateObj[configJson["hardware-type"]]) {
                            deviceTemplateObj[configJson["hardware-type"]] = {};
                            deviceTemplateObj[configJson["hardware-type"]][configJson["device-template"]] = baseArgs["navDeviceSpecificData"];
                        } else {
                            deviceTemplateObj[configJson["hardware-type"]][configJson["device-template"]] = baseArgs["navDeviceSpecificData"];
                        }
                    } else {
                        logger.debug("get device-template from requestScope for hw type: {}", configJson["hardware-type"]);
                        baseArgs["navDeviceSpecificData"] = deviceTemplateObj[configJson["hardware-type"]][configJson["device-template"]];
                    }
                }
            }
            baseArgs["isSshHostKeyLearningSupported"] = "true";
            if (baseArgs["hardware-type"] && baseArgs["hardware-type"].contains(intentConstants.LS_IHUB) && baseArgs["device-version"] && apUtils.compareVersion(baseArgs["device-version"], "21.9") == "-1") {
                baseArgs["isSshHostKeyLearningSupported"] = "false";
            }
            if (baseArgs["hardware-type"]) {
                baseArgs["configuredLabels"] = [];
                var role = apCapUtils.getCapabilityValue(baseArgs["hardware-type"], baseArgs["device-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.HW_ROLE, capabilityConstants.HYPHEN_CONTEXT, null);
                if (baseArgs["hardware-type"].contains(intentConstants.FAMILY_TYPE_LS_FX_FANT) || (baseArgs["hardware-type"].contains(intentConstants.FAMILY_TYPE_LS_MF_LMNT) && requestScope.get().get("isIhubSupported")) 
                || baseArgs["hardware-type"].contains(intentConstants.FAMILY_TYPE_LS_MF_LANT) || baseArgs["hardware-type"].contains(intentConstants.FAMILY_TYPE_LS_MF_LBNT) || baseArgs["hardware-type"].contains(intentConstants.FAMILY_TYPE_LS_SF_SFMB_A)  || baseArgs["hardware-type"].contains(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F)) {
                    baseArgs["configuredLabels"]["migrated-with"] = {"value": deviceName + ".IHUB"};
                }
                if (role && role.length > 0 && role[0] != null && !role[0].isEmpty()) {
                    baseArgs["configuredLabels"]["hw-role"] = {"value": role[0]};
                }
                var deviceInfo = apUtils.getDeviceInfo(deviceName);
                if (deviceInfo["isLtDevice"] ||  deviceInfo["isIhubDevice"]) {
                      baseArgs["configuredLabels"]["main-device"] = {"value": deviceInfo["shelfDeviceName"]};
                     if (deviceInfo["isLtDevice"]) {
                         var slotPosition = deviceInfo["ltCard"].replace("LT", "");
                         baseArgs["configuredLabels"]["slot-position"] = {"value": slotPosition};                         
                     }
                }
                if (baseArgs["hardware-type"].contains(intentConstants.LS_FX_PREFIX) || baseArgs["hardware-type"].contains(intentConstants.LS_MF_PREFIX) || baseArgs["hardware-type"].contains(intentConstants.LS_SF_PREFIX)) {
                    if (configJson["network-id"]) {
                        var networkID = configJson["network-id"];
                        baseArgs["configuredLabels"]["network-id"] = {"value": networkID};
                    } else {
                        baseArgs["configuredLabels"]["network-id"] = {"value": intentConstants.NETWORK_ID_DEFAULT};
                    }
                }                
            }
            return baseArgs;
        },
        postStepSynchronize: function (syncInput, result) {
            if (deviceName.endsWith(intentConstants.DOT_LS_IHUB)){
                var ihubVersion = deviceManagerObj.getValueFromIntentConfigByDevice("ihub-version", deviceName);
                var deviceVersion = deviceManagerObj.getValueFromIntentConfigByDevice("device-version", deviceName);
                var attributeKeyValuePair = {};
                if(ihubVersion){
                    attributeKeyValuePair["device-version"] = ihubVersion;
                } else {
                    attributeKeyValuePair["device-version"] = deviceVersion;
                }
                apUtils.setTopologyExtraInfo(result.getTopology(), "DEVICE_VERSION_" + deviceName, JSON.stringify(attributeKeyValuePair)); 

                var attributeValueHwType = configJson["hardware-type"];
                var attributeKeyValuePairHwType = {};
                attributeKeyValuePairHwType["hardware-type"] = attributeValueHwType;
                apUtils.setTopologyExtraInfo(result.getTopology(), "HARDWARE_TYPE_" + deviceName, JSON.stringify(attributeKeyValuePairHwType));
            }
        }
    };
}

/**
 * This method will find the matching stageName for given device.
 * and find the required stepObject
 * @param topology
 * @param deviceName
 * @param extraInfoKey
 * @returns {{xtraInfoSwMatches: null, extraInfoKey: string}}
 */
VirtualizerDeviceManager.prototype.getStepObjectForMatchingKey = function(topology, deviceName, stepName) {
    var xtraInfos = apUtils.getTopologyExtraInfo(topology);
    var xtraInfoSwMatches = null;
    if (xtraInfos && Object.keys(xtraInfos).length > 0) {
        var keys = Object.keys(xtraInfos);
        for (var i = 0; i < keys.length; i++) {
            if (apUtils.stringEndsWith(deviceName + "_ARGS", keys[i]) && keys[i].indexOf('Local##') <= -1) {
                var storedTemplateArgs = JSON.parse(xtraInfos[keys[i]]);
                if (storedTemplateArgs[stepName]) {
                    xtraInfoSwMatches = storedTemplateArgs[stepName];
                }
                break;
            }
        }
    }
    return xtraInfoSwMatches;
}

VirtualizerDeviceManager.prototype.isLTShelfDeviceName = function (deviceName) {
    if (deviceName) {
        var lastIndex = deviceName.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
        if (lastIndex > -1) {
            var deviceNameLtDetails = deviceName.substring(lastIndex + 1);
            var ltPattern = new RegExp(intentConstants.LT_REG_EXP);
            var isLtBoard = ltPattern.test(deviceNameLtDetails);
            if (isLtBoard) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
};

VirtualizerDeviceManager.prototype.constructStepObjectForVerifySwAlignment = function (deviceName, configJson, currentTopology, bailOutOnPassiveSwDwLoad) {
    var requestContext = requestScope.get();
    var manager = configJson[this.deviceManagerName];
    var deviceManagerObj = this;
    var activeSw = configJson["active-software"];
    var passiveSw = configJson["passive-software"];
    return {
        name: "swAlignmentStep",
        skipAuditIfPrevStepFails: false,
        skipEditConfigRequest: true,
        sensitiveKeys: ["password"],
        internalAudit: true,
        resourceFile: deviceManagerObj.prefix + "swAlignment.xml.ftl",
        getTemplateArguments: function (baseArgs, topology) {
            if(requestContext.get("deviceSWDetails") && requestContext.get("deviceSWDetails")[deviceName]) {
                apUtils.getMergedObject(baseArgs, requestContext.get("deviceSWDetails")[deviceName]);
            }
            return baseArgs;
        },
        preStepSynchronize: function (syncInput, templateArgsWithDiff, result, auditResult) {
            var netConfFwk = requestContext.get("xFWK");
            // Returning false will make the fwk bail out of original SYNC - Marking Misalignment.
            var networkState = syncInput.getNetworkState().name();
            var activeSw = configJson["active-software"];
            var passiveSw = configJson["passive-software"];

            //Due to FNMS-62635 , adding as a workaround
            if (activeSw === "active-software") {
                activeSw = null;
            }
            if (passiveSw === "passive-software") {
                passiveSw = null;
            }

            //The device-version and active s/w is mandatory for s/w upgrade.
            if (((networkState === "delete") || (activeSw == null && passiveSw == null))) {
                return {
                    proceed: true,
                };
            }

            /*
                @author : arulkuma
                We are adding below logic due to FNMS-106250 - Intent doesn't locks again the datastore in case of retry
                during migration, when activation fails AV unlocks the device causing whole migration to fail.
                intent is expected to lock the device again during retry / periodic re-sync from sw management app.
                we are re-adding locking logic in swAlignment step because config was successfully pushed from swMatches step during initial sync.
                swMatches will be aligned and so will not be called during retry.
                Also here we get interface version from AV because extraInfo we update at end swMatches step.
             */
        // TODO move thi slogic to action
           /* if (networkState != "delete") {
                var pairDevice = requestScope.get().get("pairDevice");
                if (pairDevice) {
                    var ihubDevice = pairDevice[deviceName];
                }
                var interfaceFromAv = apUtils.getDeviceInterfaceVersion(deviceName, ihubDevice);
                var currentDeviceVersion = configJson["device-version"];
                var replacedLTs = requestScope.get().get("replacedLTs");
                logger.debug("lockOrUnlockDevice deviceName {} # interfaceFromAv {} # currentDeviceVersion {} ", deviceName, JSON.stringify(interfaceFromAv), currentDeviceVersion);
                if (interfaceFromAv && interfaceFromAv[deviceName] && (interfaceFromAv[deviceName] !== currentDeviceVersion)) {
                    if (!replacedLTs || (replacedLTs && apUtils.ifObjectIsEmpty(replacedLTs))) {
                        netConfFwk.lockOrUnlockDevice(deviceName, manager, true);
                    }
                    // IF NT upgrade to major version we need to upgrade the pair device (iHUB) also so we should lock the pair device
                    if (ihubDevice && interfaceFromAv[ihubDevice]) {
                        if ((configJson["ihub-version"] && configJson["ihub-version"] != interfaceFromAv[ihubDevice]) ||
                        (configJson["ihub-version"] == undefined && currentDeviceVersion != interfaceFromAv[ihubDevice] )) {
                            netConfFwk.lockOrUnlockDevice(ihubDevice, manager, true);
                        }
                    }
                }
            } */

            return deviceManagerObj.constructReturnMsgForSwOperation(manager, deviceName, bailOutOnPassiveSwDwLoad,"SWAlignment PRE SYNC "+deviceName, auditResult);
        }
    }
}
/**
 * This step object used to perform s/w upgrade on NCY device.
 * The Step object non-yang aware component , it working based on the provided config json.
 * This method used to lock the device (and pair device) data-store when s/w upgade started.
 * This method used to enable the debug log on NV when s/w upgrade started.
 * This method check the s/w upgrade error and bail out  with proper error message.
 * @param deviceName
 * @param configJson
 * @param currentTopology
 * @param bailOutOnPassiveSwDwLoad
 * @returns {{name: string, preStepSynchronize: preStepSynchronize, resourceFile: string, getTemplateArguments: (function(*=, *=): {isAuditSupported}|*), postStepSynchronize: postStepSynchronize, skipAuditIfPrevStepFails: boolean}}
 */
VirtualizerDeviceManager.prototype.constructStepObjectForSwMgmt = function (deviceName, configJson, currentTopology, bailOutOnPassiveSwDwLoad) {
    var requestContext = requestScope.get();
    var downloadDevices = requestContext.get("downloadDevices");
    var enableDownload = requestContext.get("enableDownload");

    var manager = configJson[this.deviceManagerName];
    var deviceManagerObj = this;
    var extraInfoKey = "create-device-" + deviceName + "_" + deviceName + "_ARGS";
    var activeSw = configJson["active-software"];
    var passiveSw = configJson["passive-software"];
    var newEonuRelease = configJson["eonu-release"];
    var cpeSw = configJson["cpe-software"];
    var vendorSpecificEonuRelease = configJson["eonu-vendor-specific-release"];
    var transformationSoftware = configJson["target-transformation-software"];
    //Due to FNMS-62635 , adding as a workaround
    if (activeSw === "active-software") {
        activeSw = null;
    }
    if (passiveSw === "passive-software") {
        passiveSw = null;
    }
    if (newEonuRelease === "eonu-release") {
        newEonuRelease = null;
    }
    if (cpeSw === "cpe-software") {
        cpeSw = null;
    }
    if (vendorSpecificEonuRelease === "eonu-vendor-specific-release") {
        vendorSpecificEonuRelease = null;
    }
    if (transformationSoftware === "target-transformation-software") {
        transformationSoftware = null;
    }
    return {
        name: "swMatches",
        skipAuditIfPrevStepFails: false,
        sensitiveKeys: ["password"],
        resourceFile: deviceManagerObj.prefix + "swValidation.xml.ftl",
        getTemplateArguments: function (baseArgs, topology) {

            var networkState = baseArgs["networkState"].toString();

            apUtils.getMergedObject(baseArgs, configJson);
            // Delete the s/w from baseArgs because in case of LT the s/w is empty,  baseArgs has the NT s/w with the same key.
            // So we should consider the configJson entry
            if(!activeSw) {
                delete baseArgs["active-software"];
            }
            if(!passiveSw) {
                delete baseArgs["passive-software"];
            }
            if(!newEonuRelease) {
                delete baseArgs["eonu-release"];
            }
            if(!cpeSw) {
                delete baseArgs["cpe-software"];
            }
            if(!vendorSpecificEonuRelease) {
                delete baseArgs["eonu-vendor-specific-release"];
            }
            if(!transformationSoftware) {
                delete baseArgs["target-transformation-software"];
            }
            deviceManagerObj.updateSwCertificateDetails(deviceName, configJson, baseArgs, networkState);
            deviceManagerObj.updateCpeSwDetails(deviceName, configJson, baseArgs, networkState);
            deviceManagerObj.updatePreferredCpeSwDetails(deviceName, configJson, baseArgs, networkState);

            if(!deviceManagerObj.isLTShelfDeviceName(deviceName)){
                baseArgs.isNTDevice = "true";
            }
            if (!baseArgs.isAuditSupported) {
                //only LT devices have following logic
                if(!bailOutOnPassiveSwDwLoad){
                    if(downloadDevices && downloadDevices.length > 0 && baseArgs.networkState.toString() != "delete"){
                        baseArgs.lockUpgradeSw = "true";
                        if(downloadDevices.indexOf(deviceName) > -1){
                            baseArgs.downloadPassiveSW = "true";
                        }
                    }
                    if(enableDownload){
                        baseArgs.enableDownload = "true";
                    }
                }
            }
            if(baseArgs.isAuditSupported) {
                deviceManagerObj.updateDeviceSwDetailsForCheckAlignmentStatus(deviceName, baseArgs);
            }
            if (baseArgs) {
                var cloneBaseArgs = JSON.parse(JSON.stringify(baseArgs));
                if (cloneBaseArgs) {
                    if (cloneBaseArgs["trust-anchors"]) {
                        if (cloneBaseArgs["trust-anchors"]["cert"]) {
                            apUtils.maskSensitiveData(cloneBaseArgs["trust-anchors"], "cert");
                        }
                    }
                }
            }
            if (cloneBaseArgs) {
                deviceLogger.info(new DeviceRefId(deviceName), "Intent SWMGMT constructStepObjectForSwMgmt baseArgs {}", apUtils.protectSensitiveData(cloneBaseArgs, ["password"]));
            }
            return baseArgs;
        },
        preStepSynchronize: function (syncInput, templateArgsWithDiff, result) {
            var netConfFwk = requestContext.get("xFWK");
            // Returning false will make the fwk bail out of original SYNC - Marking Misalignment.
            var networkState = syncInput.getNetworkState().name();

            if(networkState === "delete") {
                return {
                    proceed: true,
                };
            }


            if(!requestScope.get().get("isSkipNTSwAlignedValidate") && deviceManagerObj.isNtAndLTContainSwConfig() && deviceManagerObj.isLTShelfDeviceName(deviceName)) {
                if(!requestScope.get().get("isNtSwAligned")) {
                    var errorMessage = "Intent SWMGMT Software file(s) have been not updated for device " + deviceName +". NT software upgrade operation currently ongoing."
                    deviceLogger.info(new DeviceRefId(deviceName), errorMessage);
                    return {
                        proceed: false,
                        errorCode: "EXP-12",
                        errorMessage: deviceName
                    };
                }
            }
            var xtraInfoSwMatches = deviceManagerObj.getStepObjectForMatchingKey(currentTopology, deviceName, "swMatches");
            if (xtraInfoSwMatches) {
                // Fetch and update the device version in TopologyExtraInfo from swMatches
                if (xtraInfoSwMatches["active-software"]) {
                    var activeSoftware = xtraInfoSwMatches["active-software"]["value"];
                }
                if (xtraInfoSwMatches["passive-software"]) {
                    var passiveSoftware = xtraInfoSwMatches["passive-software"]["value"];
                }
                if (xtraInfoSwMatches["eonu-release"]) {
                    var oldEonuRelease = xtraInfoSwMatches["eonu-release"];
                }
                if (xtraInfoSwMatches["eonuImages"]) {
                    var oldEonuImages = xtraInfoSwMatches["eonuImages"];
                }
                if (xtraInfoSwMatches["target-transformation-software"]) {
                    var oldTransSW = xtraInfoSwMatches["target-transformation-software"];
                }
                var templateArgs = {};
                if ((activeSoftware && activeSw && activeSoftware != activeSw) || (activeSoftware && !activeSw)) {
                    templateArgs.deviceID = deviceName;
                    templateArgs.deleteActiveSoftware = true;
                }
                if ((passiveSoftware && passiveSw && passiveSoftware != passiveSw) || (passiveSoftware && !passiveSw)) {
                    templateArgs.deviceID = deviceName;
                    templateArgs.deletePassiveSoftware = true;
                }
                if(oldTransSW){
                    if ((oldTransSW.value && transformationSoftware && oldTransSW.value != transformationSoftware) || (oldTransSW.value && !transformationSoftware)) {
                        templateArgs.deviceID = deviceName;
                        templateArgs.deleteTransSoftware = true;
                    }
                }
                if(!bailOutOnPassiveSwDwLoad && enableDownload){
                    if(downloadDevices && downloadDevices.length > 0 && networkState != "delete"){
                        if(downloadDevices.indexOf(deviceName) > -1){
                            if (templateArgs.deleteActiveSoftware || templateArgs.deletePassiveSoftware) {
                                var requestTemplate = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "removeActivePassiveSoftware.xml.ftl"), templateArgs);
                                netConfFwk.executeRequest(requestTemplate, null, templateArgs.deviceID);
                            }
                        }
                    }
                } else {
                    if ((templateArgs.deleteActiveSoftware || templateArgs.deletePassiveSoftware) && networkState != "delete") {
                        var requestTemplate = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "removeActivePassiveSoftware.xml.ftl"), templateArgs);
                        netConfFwk.executeRequest(requestTemplate, null, templateArgs.deviceID);
                    }
                }
                if(templateArgs.deleteTransSoftware && networkState != "delete"){
                  var requestTemplate = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "removeActivePassiveSoftware.xml.ftl"), templateArgs);

                  netConfFwk.executeRequest(requestTemplate, null, templateArgs.deviceID);
                }
                var xtraInfoDeviceVersion = apUtils.getTopologyExtraInfoFromTopology(syncInput.getCurrentTopology(), "DEVICE_VERSION_" + deviceName, "device-version");
                if (!xtraInfoDeviceVersion) {
                    var attributeValue = xtraInfoSwMatches["device-version"]["value"];
                    var attributeKeyValuePair = {};
                    attributeKeyValuePair["device-version"] = attributeValue;
                    apUtils.setTopologyExtraInfo(result.getTopology(), "DEVICE_VERSION_" + deviceName, JSON.stringify(attributeKeyValuePair));
                }

                var xtraInfoHwType = apUtils.getTopologyExtraInfoFromTopology(syncInput.getCurrentTopology(), "HARDWARE_TYPE_" + deviceName, "hardware-type");
                if (!xtraInfoHwType) {
                    var attributeValue = xtraInfoSwMatches["hardware-type"]["value"];
                    var attributeKeyValuePair = {};
                    attributeKeyValuePair["hardware-type"] = attributeValue;
                    apUtils.setTopologyExtraInfo(result.getTopology(), "HARDWARE_TYPE_" + deviceName, JSON.stringify(attributeKeyValuePair));
                }
            }
            if (((networkState === "delete") || (activeSw == null && passiveSw == null && newEonuRelease == null && cpeSw == null && vendorSpecificEonuRelease == null && transformationSoftware == null))) {
                return {
                    proceed: true,
                };
            }
            /**
             * true - lock the device
             * false - unlock the device
             */
            deviceManagerObj.enableDisableDeviceSwLog(deviceName, manager, "debug");
            return {
                proceed: true,
            };
        },
        postStepSynchronize: function (syncInput, result) {
            var netConfFwk = requestContext.get("xFWK");
            // Returning false will make the fwk bail out of original SYNC - Marking Misalignment.
            var networkState = syncInput.getNetworkState().name();
            var activeSw = configJson["active-software"];
            var passiveSw = configJson["passive-software"];
            var eonuRelease = configJson["eonu-release"];
            var cpeSw = configJson["cpe-software"];
            var vendorSpecificEonuRelease = configJson["eonu-vendor-specific-release"];
            var transformationSoftware = configJson["target-transformation-software"];
            //Due to FNMS-62635 , adding as a workaround
            if (activeSw === "active-software") {
                activeSw = null;
            }
            if (passiveSw === "passive-software") {
                passiveSw = null;
            }
            if (eonuRelease === "eonu-release") {
                eonuRelease = null;
            }
            if (cpeSw === "cpe-software") {
                cpeSw = null;
            }
            if (vendorSpecificEonuRelease === "eonu-vendor-specific-release") {
                vendorSpecificEonuRelease = null;
            }
            if (transformationSoftware === "target-transformation-software") {
                transformationSoftware = null;
            }

            var cpeSwAligned = true;
            var lastIntentConfigFromTopo = apUtils.getLastIntentConfigFromTopologyXtraInfo(currentTopology);
            if (cpeSw != null || (lastIntentConfigFromTopo && lastIntentConfigFromTopo["cpe-software"] && Object.keys(lastIntentConfigFromTopo["cpe-software"]).length > 0 && lastIntentConfigFromTopo["cpe-software"] !== "cpe-software")) {
                cpeSwAligned = false;
            }

            var eonuSwAligned = true;
            if (eonuRelease != null || (lastIntentConfigFromTopo && lastIntentConfigFromTopo["eonu-release"] && Object.keys(lastIntentConfigFromTopo["eonu-release"]).length > 0 && lastIntentConfigFromTopo["eonu-release"] !== "eonu-release")) {
                eonuSwAligned = false;
            }
            if (eonuSwAligned && (vendorSpecificEonuRelease != null || (lastIntentConfigFromTopo && lastIntentConfigFromTopo["eonu-vendor-specific-release"]
                && Object.keys(lastIntentConfigFromTopo["eonu-vendor-specific-release"]).length > 0 && lastIntentConfigFromTopo["eonu-vendor-specific-release"] !== "eonu-vendor-specific-release"))) {
                eonuSwAligned = false;
            }

            var transSwAligned = true;
            if (transformationSoftware != null || (lastIntentConfigFromTopo && lastIntentConfigFromTopo["target-transformation-software"] && lastIntentConfigFromTopo["target-transformation-software"] !== "target-transformation-software")) {
                transSwAligned = false;
            }

            if (((networkState === "delete") || (activeSw == null && passiveSw == null && eonuRelease == null && cpeSw == null && vendorSpecificEonuRelease == null && cpeSwAligned && eonuSwAligned && transSwAligned))) {
                return {
                    proceed: true,
                };
            }

            if (lastIntentConfigFromTopo && lastIntentConfigFromTopo["cpe-software"] && !cpeSwAligned) {
                var resultStageArgs = apUtils.getStageArgsFromTopologyXtraInfo(result.getTopology(), "create-device-" + deviceName + "_" + deviceName + "_ARGS");
                if (resultStageArgs && resultStageArgs["swMatches"] && !resultStageArgs["swMatches"]["cpeSoftware"]) {
                    deviceManagerObj.updateCpeSwDetails(deviceName, lastIntentConfigFromTopo, resultStageArgs["swMatches"], networkState);
                    apUtils.setTopologyExtraInfo(result.getTopology(), "create-device-" + deviceName + "_" + deviceName + "_ARGS", JSON.stringify(resultStageArgs));
                }
            }

            if (lastIntentConfigFromTopo && (lastIntentConfigFromTopo["eonu-release"] || lastIntentConfigFromTopo["eonu-vendor-specific-release"]) && !eonuSwAligned) {
                var resultStageArgs = apUtils.getStageArgsFromTopologyXtraInfo(result.getTopology(), "create-device-" + deviceName + "_" + deviceName + "_ARGS");
                if (resultStageArgs && resultStageArgs["swMatches"] && !resultStageArgs["swMatches"]["eonuImages"]) {
                    deviceManagerObj.updateEonuSwDetails(lastIntentConfigFromTopo, resultStageArgs["swMatches"], "eonu-release", "eonuImages");
                    apUtils.setTopologyExtraInfo(result.getTopology(), "create-device-" + deviceName + "_" + deviceName + "_ARGS", JSON.stringify(resultStageArgs));
                }
                if (resultStageArgs && resultStageArgs["swMatches"] && !resultStageArgs["swMatches"]["eonuVendorSpecificImages"]) {
                    deviceManagerObj.updateEonuSwDetails(lastIntentConfigFromTopo, resultStageArgs["swMatches"], "eonu-vendor-specific-release",
                        "eonuVendorSpecificImages");
                    apUtils.setTopologyExtraInfo(result.getTopology(), "create-device-" + deviceName + "_" + deviceName + "_ARGS", JSON.stringify(resultStageArgs));
                }
            }

            if (lastIntentConfigFromTopo && lastIntentConfigFromTopo["target-transformation-software"] && !transSwAligned) {
                var resultStageArgs = apUtils.getStageArgsFromTopologyXtraInfo(result.getTopology(), "create-device-" + deviceName + "_" + deviceName + "_ARGS");
                if (resultStageArgs && resultStageArgs["swMatches"] && !resultStageArgs["swMatches"]["transformationSoftware"]) {
                    deviceManagerObj.updateSwDetails(lastIntentConfigFromTopo, resultStageArgs["swMatches"], "target-transformation-software", "trans-url", "trans-file-on-server", "transFileServer", "transSubDirectory", "transFileName", "transformationSoftware");
                    apUtils.setTopologyExtraInfo(result.getTopology(), "create-device-" + deviceName + "_" + deviceName + "_ARGS", JSON.stringify(resultStageArgs));
                }
            }


            if (networkState !== "delete") {
                var xtraInfoDeviceVersion = apUtils.getTopologyExtraInfoFromTopology(syncInput.getCurrentTopology(), "DEVICE_VERSION_" + deviceName, "device-version");
                var currentDeviceVersion = configJson["device-version"];
                var xtraInfoHwType = apUtils.getTopologyExtraInfoFromTopology(syncInput.getCurrentTopology(), "HARDWARE_TYPE_" + deviceName, "hardware-type");
                var currentHwType = configJson["hardware-type"];
                deviceLogger.info(new DeviceRefId(deviceName), "Intent SWMGMT lockOrUnlockDevice deviceName {} # xtraInfoDeviceVersion {} # currentDeviceVersion {} # xtraInfoHwType {} # currentHwType {}",deviceName,xtraInfoDeviceVersion,currentDeviceVersion,xtraInfoHwType,currentHwType);
                var replacedLTs = requestScope.get().get("replacedLTs");
                if (!replacedLTs || (replacedLTs && apUtils.ifObjectIsEmpty(replacedLTs))) {
                    var boardPrefix;
                    if (configJson["hardware-type"].startsWith(intentConstants.LS_FX_PREFIX)) {
                        boardPrefix = "LS-FX-"
                    } else if (configJson["hardware-type"].startsWith(intentConstants.LS_MF_PREFIX)) {
                        boardPrefix = "LS-MF-"
                    }
                    var replacedLTs = {};
                    if (currentTopology && currentTopology.getXtraInfo() !== null && !currentTopology.getXtraInfo().isEmpty()) {
                        var xtraInfos = apUtils.getTopologyExtraInfo(currentTopology);
                        if (xtraInfos["LT_DEVICES"]) {
                            var ltDevicesTopo = JSON.parse(xtraInfos["LT_DEVICES"]);
                            Object.keys(ltDevicesTopo).forEach(function (ltDevice) {
                                var boardType = boardPrefix + ltDevicesTopo[ltDevice]["planned-type"];
                                var isEthBoard = false;
                                isEthBoard = apCapUtils.isValueInCapability(currentHwType, currentDeviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, ltDevicesTopo[ltDevice]["planned-type"], "ETH");
                                var isBoardTypeLT = apCapUtils.isValueInCapability(currentHwType, currentDeviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.SLOT_TYPE, ltDevicesTopo[ltDevice]["planned-type"], "LT");
                                if(isEthBoard && isBoardTypeLT){
                                    var deviceInformation = apUtils.getDeviceInfo(deviceName);
                                    if (deviceInformation) {
                                        var deviceDetails = {};
                                        deviceDetails["useProfileManager"] = true;
                                        deviceDetails["deviceName"] = deviceInformation.shelfDeviceName;
                                        deviceDetails["nodeType"] = currentHwType + "-" + currentDeviceVersion;
                                        deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
                                        deviceDetails["intentTypeVersion"] = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceInformation.shelfDeviceName);
                                        deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);
                                        var boardServiceProfileObj = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", ltDevicesTopo[ltDevice]["board-service-profile"], deviceDetails);
                                        if(boardServiceProfileObj["model"] === "uplink-mode"){
                                            boardType = boardType + "-" + intentConstants.UP_LINK_HW_TYPE_POSTFIX;
                                        }else if(boardServiceProfileObj["model"] === "downlink-mode"){
                                            boardType = boardType + "-" + intentConstants.DOWN_LINK_HW_TYPE_POSTFIX;
                                        }
                                    }
                                }

                                var boardVersion;
                                if (ltDevicesTopo[ltDevice]["device-version"] || ltDevicesTopo[ltDevice]["device-version"] != null) {
                                    boardVersion = ltDevicesTopo[ltDevice]["device-version"];
                                } else {
                                    boardVersion = configJson["device-version"];
                                }
                                var supportedType = apCapUtils.getCapabilityValue(boardType, boardVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.COMPATIBLE_BOARDS, ltDevicesTopo[ltDevice]["planned-type"], []);
                                if (configJson["boards"] && configJson["boards"][ltDevice]) {
                                    if (supportedType.length > 0 && supportedType.indexOf(configJson["boards"][ltDevice]["planned-type"]) > -1) {
                                        replacedLTs[ltDevice] = ltDevicesTopo[ltDevice];
                                    }
                                }
                            });
                        }
                    }
                    requestScope.get().put("replacedLTs", replacedLTs);
                }
                var pairDevice = requestScope.get().get("pairDevice");
                if (pairDevice) {
                    var ihubDevice = pairDevice[deviceName];
                }                
                if((xtraInfoDeviceVersion && (xtraInfoDeviceVersion !== currentDeviceVersion))) {
                    var interfaceFromAv = requestScope.get().get("interfaceVerisonDevices");
                    if(!interfaceFromAv || !interfaceFromAv[deviceName] || (ihubDevice && !interfaceFromAv[ihubDevice])){
                        interfaceFromAv = apUtils.getDeviceInterfaceVersion(deviceName,ihubDevice);
                    }           
                    if (interfaceFromAv && interfaceFromAv[deviceName] && (interfaceFromAv[deviceName] !== currentDeviceVersion)) {
                        if (!replacedLTs || (replacedLTs && apUtils.ifObjectIsEmpty(replacedLTs))) {
                            netConfFwk.lockOrUnlockDevice(deviceName, manager, true);
                        }
                        // IF NT upgrade to major version we need to upgrade the pair device (iHUB) also so we should lock the pair device
                        if (ihubDevice && interfaceFromAv[ihubDevice]) {                           
                            if ((configJson["ihub-version"] && configJson["ihub-version"] != interfaceFromAv[ihubDevice]) ||
                            (configJson["ihub-version"] == undefined && currentDeviceVersion != interfaceFromAv[ihubDevice] )) {
                                netConfFwk.lockOrUnlockDevice(ihubDevice, manager, true);
                            }
                        }
                    }
                }                
                //Fetch and update the device version in TopologyExtraInfo from the intent Config
                var attributeValue = deviceManagerObj.getValueFromIntentConfigByDevice("device-version", deviceName);
                var attributeKeyValuePair = {};
                attributeKeyValuePair["device-version"] = attributeValue;
                apUtils.setTopologyExtraInfo(result.getTopology(), "DEVICE_VERSION_" + deviceName, JSON.stringify(attributeKeyValuePair));

                var attributeValueHwType = currentHwType;
                var attributeKeyValuePairHwType = {};
                attributeKeyValuePairHwType["hardware-type"] = attributeValueHwType;
                apUtils.setTopologyExtraInfo(result.getTopology(), "HARDWARE_TYPE_" + deviceName, JSON.stringify(attributeKeyValuePairHwType));

                var pairDevice = requestScope.get().get("pairDevice");
                if (pairDevice && pairDevice[deviceName]) {
                    var ihubDeviceName = pairDevice[deviceName];
                    if(configJson["ihub-version"]){
                        var currentDeviceVersion = configJson["ihub-version"];
                    }else {
                        var currentDeviceVersion = deviceManagerObj.getValueFromIntentConfigByDevice("device-version", deviceName);
                    }

                    var attributeIhubKeyValuePair = {};
                    attributeIhubKeyValuePair["device-version"] = currentDeviceVersion;
                    apUtils.setTopologyExtraInfo(result.getTopology(), "DEVICE_VERSION_" + ihubDeviceName, JSON.stringify(attributeIhubKeyValuePair));
                   
                    var currentHwType = deviceManagerObj.getiHUBAndLTHWTypeVersion(intentConstants.LS_FX_IHUB, configJson["hardware-type"], null);
                    var attributeIhubValueHwType = currentHwType;
                    var attributeIhubKeyValuePairHwType = {};
                    attributeIhubKeyValuePairHwType["hardware-type"] = attributeIhubValueHwType;
                    apUtils.setTopologyExtraInfo(result.getTopology(), "HARDWARE_TYPE_" + ihubDeviceName, JSON.stringify(attributeIhubKeyValuePairHwType));

                }
            }

            if(deviceManagerObj.isNtAndLTContainSwConfig() && !deviceManagerObj.isLTShelfDeviceName(deviceName)) {
                if(requestScope.get().get("isNtSwAligned")) {
                   if( (activeSw && lastIntentConfigFromTopo && !lastIntentConfigFromTopo["active-software"]) || (activeSw && lastIntentConfigFromTopo && lastIntentConfigFromTopo["active-software"] && activeSw != lastIntentConfigFromTopo["active-software"])) {
                     deviceLogger.info(new DeviceRefId(deviceName), "Intent SWMGMT : New NT Active software is just configured so marking isNtSwAligned as false");
                     requestScope.get().put("isNtSwAligned", false);
                   }
                }
            }

            // We no need to stop anything here. if the editconfig is success.
            return {
                proceed: true
            };
        }
    }
}

VirtualizerDeviceManager.prototype.constructReturnMsgForSwOperation = function (manager, deviceName, bailOutOnPassiveSwDwLoad,stage, auditResult) {
    if (bailOutOnPassiveSwDwLoad) {
        deviceLogger.info(new DeviceRefId(deviceName), "Intent SWMGMT Proceed  for parallel sw download ");
        return {
            proceed: true
        };
    }

    var stateAttributes = deviceUtilities.getStateAttributesArgs(manager, deviceName);
    deviceLogger.info(new DeviceRefId(deviceName), "Intent SWMGMT constructReturnMsgForSwOperation {} stateAttributes {}", deviceName, JSON.stringify(stateAttributes));
    var reachableState = stateAttributes.reachableState;
    var swTargetAligned = stateAttributes.softwareTargetsAligned;
    var currentOperationType = stateAttributes.currentOperationType;
    var currentFailStatus = stateAttributes.currentFailStatus;
    var softwareErrorReason = stateAttributes.softwareErrorReason;
    var eonuAligned = stateAttributes.eonuAligned;
    if(stateAttributes.transformationSoftwareAligned){
        var transformationSoftwareAligned = stateAttributes.transformationSoftwareAligned.aligned;
    }else{
        var transformationSoftwareAligned = false;
    }
    deviceLogger.info(new DeviceRefId(deviceName), "Intent SWMGMT constructReturnMsgForSwOperation {} reachableState {} currentOperationType {} currentFailStatus {} softwareErrorReason {} bailOutOnPassiveSwDwLoad {} eonuAligned {} transformationSoftwareAligned {}"
        , deviceName, reachableState, currentOperationType, currentFailStatus, softwareErrorReason, bailOutOnPassiveSwDwLoad, eonuAligned, transformationSoftwareAligned);

    deviceLogger.info(new DeviceRefId(deviceName), "Intent SWMGMT {} constructReturnMsgForSwOperation {} swTargetAligned {}",stage,deviceName,swTargetAligned);
    /**
     * If NT and LT SW provide we should create a LT device but we should not configure the LT SW until the NT SW aligned
     */
    if(requestScope.get().get("isNtSwAligned")) {
        requestScope.get().put("isNtSwAligned",false);
        deviceLogger.info(new DeviceRefId(deviceName), "Intent SWMGMT Software not aligned this device : {}");
    }
    
    return {
        proceed: true
    };
}

VirtualizerDeviceManager.prototype.updateDeviceSwDetailsForCheckAlignmentStatus = function (deviceName, baseArgs) {
    if(deviceName && baseArgs) {
        if(!requestScope.get().get("deviceSWDetails")) {
            requestScope.get().put("deviceSWDetails", {});
        } 
        var deviceSwDetails = requestScope.get().get("deviceSWDetails");
        if(!deviceSwDetails[deviceName]) {
            //update Args
            var swDetail = {};
            var keys = ["swImageName", "passSwImageName", "cpeSoftware", "eonuImages", "isNTDevice", "eonuVendorSpecificImages","transformationSoftware","device-version"];
            keys.forEach(function (key) {
                if (key) {
                    swDetail[key] = baseArgs[key];
                }
            });
            deviceSwDetails[deviceName] = swDetail;
        }
    }
}

/**
 * This device object used for create local device with single steps.
 * The local attributes for the device will created with standard format , so Network View app can search the device using label.
 * The device object non-yang aware component , it working based on the provided configObject.
 * @param deviceName
 * @param configJson
 * @param topology
 * @param order
 * @returns {{name: string, value: string, steps: [{name: string, resourceFile: string, getTemplateArguments: function(*=, *): *}], order: *}}
 */

/**
 * This device object used for create remote device with standard steps ( create-device , s/w upgrade, plug-match )
 * The device object non-yang aware component , it working based on the provided configObject.
 * The component creating the device object for single device.
 * Used inside the getDeviceIDs method and all the remote device using this method.
 * This method updating the request context 'DevicesInvolved' , this object used in postSync for mds sync and disable the debug log
 * @param deviceName
 * @param configObject
 * @param topology
 * @param order
 * @param supportsSoftwareUpgrade ( optional argument if the value false we will skip s/w upgrade and plug-match step for the device)
 * @param bailOutOnPassiveSwDwLoad (optional for allow bailing out or not)
 * @returns {{failIfRemoteDeviceNotFound: boolean, name: *, managerName: *, value: string, steps: [*], order: *}}
 */
VirtualizerDeviceManager.prototype.constructRemoteDeviceStepObject = function (deviceName, configObject, topology, order, supportsSoftwareUpgrade, bailOutOnPassiveSwDwLoad) {
    
    if (supportsSoftwareUpgrade === undefined || supportsSoftwareUpgrade === null || supportsSoftwareUpgrade === true) {
        supportsSoftwareUpgrade = true;
    }
    var deviceCreationStep = this.constructStepObjectForDeviceCreation(deviceName, configObject, topology);
    var swMgmtStep = this.constructStepObjectForSwMgmt(deviceName, configObject, topology, bailOutOnPassiveSwDwLoad);
    var swAlignmentStep = this.constructStepObjectForVerifySwAlignment(deviceName, configObject, topology, bailOutOnPassiveSwDwLoad);
    // Updating the request context DevicesInvolved ,  this will be used in postSync for mds sync and disable the debug log
    if (!requestScope.get().get("removedDevices") || !requestScope.get().get("removedDevices")[deviceName]) {
        requestScope.get().get("DevicesInvolved").push(deviceName);
    }

    // updating partitionProfile from intentConfig, this will be used in postSync to update PAP
    requestScope.get().put("partitionProfile",configObject["partition-access-profile"]);

    var result = {
        name: deviceName,
        value: deviceName + "deviceConfiguration",
        steps: [deviceCreationStep],
        order: order,
        managerName: configObject[this.deviceManagerName],
        failIfRemoteDeviceNotFound: false
    };
    /*if (deviceName.endsWith(intentConstants.DOT_LS_IHUB)){
        result.steps.push(plugMatchStep);
    }*/
    // All the devices not required the s/w creation step
    if (supportsSoftwareUpgrade) {
        result.steps.push(swMgmtStep);

        // Below steps are only required if the NT and LT softwares provided together otherwise we can skip these steps.
        if(!requestScope.get().get("isSkipNTSwAlignedValidate") && this.isNtAndLTContainSwConfig() && !this.isLTShelfDeviceName(deviceName)) {
            logger.info("Adding alignment step to check NT sw alignment before proceedon LT sw config");
            result.steps.push(swAlignmentStep);
        }
    }
    return result;
}

/**
 * Method to check whther intent config contain s/w details for both NT and LT.
 */
VirtualizerDeviceManager.prototype.isNtAndLTContainSwConfig =  function() {
    var configJson = requestScope.get().get("intentConfigJson");
    if(configJson && configJson["boards"]) {
        var boards = configJson["boards"];
        if(configJson["active-software"]) {
            if(boards && Object.keys(boards).length) {
                var keys = Object.keys(boards);
                for (let i=0; i < keys.length; i++) { 
                    if(boards[keys[i]]["active-software"] || boards[keys[i]]["passive-software"]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

/**
 * The post sync will called when the netconf fwk execute the intentObject.
 * This post sync method perform mds.syncWithManager() for each device involved in the request-context 'DevicesInvolved'
 * This  method also reset the log level to default for each device involved in the request-context 'DevicesInvolved'
 * This method also execute the provided callBack method and update the result with callback method result.
 * Currently we are creating all the LT's sync operation in callback method.
 * @param postExecuteCallBack
 * @returns {function(*=, *, *=): *}
 */
VirtualizerDeviceManager.prototype.postSynchronize = function (postExecuteCallBack, deviceName,iHubDeviceName) {
    var netConfFwk = requestScope.get().get("xFWK");
    var deviceManagerObj = this;
    return function (syncInput, networkState, result) {
        var target = syncInput.getTarget();
        var neverSynced = syncInput.neverSynced;
        var intentConfigJson = requestScope.get().get("intentConfigJson");
        var lastIntentConfigFromTopo = requestScope.get().get("lastIntentConfigFromTopo");
        var networkState = requestScope.get().get("networkState").toString();
        if ( neverSynced == false ) {
            if (!(networkState != "delete" && intentConfigJson['label'] != null) && lastIntentConfigFromTopo) {
                if(networkState == 'delete' && deviceName){
                    var sVlanDeviceName = intentConstants.SVLAN_WORKFLOW_PREFIX + deviceName;
                    var ontMovementDeviceName = intentConstants.ONT_MOVEMENT_WORKFLOW_PREFIX + deviceName;
                    var templateArgs = {
                        "sVlanDeviceName" : sVlanDeviceName,
                        "ontMovementDeviceName" : ontMovementDeviceName
                    };
                    var removeWorkflowDevice = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "removeWorkflowDevice.xml.ftl"), templateArgs);
                    var ncResponse = apUtils.executeRequestInNAC(removeWorkflowDevice);
                    if (ncResponse === null || ncResponse.trim().isEmpty()) {
                        throw new RuntimeException("Operation Failed with error " + getErrorMessage(ncResponse));
                    }
                }
                apUtils.executeDeleteLabel(intentConfigJson,lastIntentConfigFromTopo,deviceName,iHubDeviceName,target);
            }            
        }
        var manager = requestScope.get().get("ManagerInvolved");
        if (result.isSuccess()) {
            var ltDevicesReset = requestScope.get().get("ltDevicesReset");
            if (ltDevicesReset) {
                ltDevicesReset.forEach(function (ltDevice) {
                    if (ltDevice === deviceName) {
                        var templateArgs = { "deviceID": deviceName };
                        try {
                            apUtils.executeRequest(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "resetLtDevice.xml.ftl", templateArgs);
                        } catch(e) {
                            logger.error("error while resetting the LT device :{} ", e);
                        }
                    }
                })
            }
            if (postExecuteCallBack && typeof postExecuteCallBack === 'function') {
                try {
                    var callBackResult = postExecuteCallBack(syncInput, networkState, result);

                    apUtils.updateSyncResult(result, callBackResult);
                } catch (e) {
                    logger.error("error while executing the post sync call back method :{} ", e);
                    result.setSuccess(false);
                    result.setErrorCode("ERR-100");
                    result.setErrorDetail(e);
                }
            }
        }

        if(iHubDeviceName && iHubDeviceName.endsWith(".IHUB"))
        {
            mds.syncWithManager(manager, iHubDeviceName);
        }
        mds.syncWithManager(manager, deviceName);
        if(result.isSuccess() && networkState !== "delete"){
        mds.updatePAP(deviceName,requestScope.get().get("partitionProfile"));  
        if(iHubDeviceName){
        mds.updatePAP(iHubDeviceName,requestScope.get().get("partitionProfile"));
        }
        }
        if (requestScope && requestScope.get() && requestScope.get().get("isSubscribeToDeviceNotificationSupported")) {
            mds.subscribeToDeviceNotification("ping-result", "[\\r\\n\\w\\W]+<ping-result>([\\w\\W])+<\/ping-result>[\\r\\n\\w\\W]+", "test-name", ".*<test-name>(.*)</test-name>.*");
            mds.subscribeToDeviceNotification("mlt-result", "[\\r\\n\\w\\W]+<mlt-result>([\\w\\W])+<\/mlt-result>[\\r\\n\\w\\W]+", "test-name", ".*<test-name>(.*)</test-name>.*");
            mds.subscribeToDeviceNotification("pbdt-test-result", "[\\r\\n\\w\\W]+<pbdt-test-result>([\\w\\W])+<\/pbdt-test-result>[\\r\\n\\w\\W]+", "test-name", ".*<test-name>(.*)</test-name>.*");
            mds.subscribeToDeviceNotification("self-test-result", "[\\r\\n\\w\\W]+<self-test-result ([\\w\\W])+>([\\w\\W])+<\/self-test-result>[\\r\\n\\w\\W]+", "test-name", ".*<test-name>(.*)</test-name>.*");
            requestScope.get().put("isSubscribeToDeviceNotificationSupported", null);
        }
        var topology = result.getTopology();
        var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
        if (topologyXtraInfo && topologyXtraInfo["create-device-" + deviceName + "_" + deviceName + "_ARGS"]) {
            var resultStageArgs = JSON.parse(topologyXtraInfo["create-device-" + deviceName + "_" + deviceName + "_ARGS"]);
            if (resultStageArgs) {
                if (lastIntentConfigFromTopo && lastIntentConfigFromTopo["cpe-software-preference"]) {
                    var changed = false;
                    var lastCpePref = lastIntentConfigFromTopo["cpe-software-preference"];
                    if (intentConfigJson["cpe-software-preference"]) {
                        var currentCpePref = intentConfigJson["cpe-software-preference"];
                        if (Object.keys(lastCpePref).length != Object.keys(currentCpePref).length) {
                            changed = true;
                        } else {
                            for (var type in lastCpePref) {
                                if (!currentCpePref[type] || lastCpePref[type]["preferred-software-release"] != currentCpePref[type]["preferred-software-release"]) {
                                    changed = true;
                                    break;
                                }
                            }
                        }
                    } else {
                        changed = true
                    }
                    if (changed) {
                        resultStageArgs["lastCpeSwPreference"] = {};
                        for (var type in lastCpePref) {
                            resultStageArgs["lastCpeSwPreference"][type] = lastCpePref[type]["preferred-software-release"];
                        }
                        apUtils.setTopologyExtraInfo(topology, "create-device-" + deviceName + "_" + deviceName + "_ARGS", JSON.stringify(resultStageArgs));
                    }
                }
            }
        }
        var deviceVersion = requestScope.get().get("ltDeviceVersions");
        if(deviceVersion[deviceName] && deviceVersion[deviceName]["removed"]){
			apUtils.removetoplogyXtraInfo(result.getTopology(), "DEVICE_VERSION_" + deviceName);
		} else {
			deviceManagerObj.updateExtraInfoByAttributeByDevice(syncInput, result, "DEVICE_VERSION_" + deviceName, "device-version", deviceName);
		}  
        var replacedLTs = requestScope.get().get("replacedLTs");
        if (replacedLTs && !apUtils.ifObjectIsEmpty(replacedLTs)) {
            Object.keys(replacedLTs).forEach(function (replacedLT) {
                if (deviceName.endsWith(replacedLT)) {
                    // LT board need to be unlocked in order to perform replace LT
                    netConfFwk.lockOrUnlockDevice(deviceName, manager, false);
                    var templateArgs = {
                        "target" : deviceName
                    };
                    var syncDependentIntentXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "syncAllDependentIntent.xml.ftl"), templateArgs);
                    var ncResponse = executeRequestInNAC(syncDependentIntentXml);
                    if (ncResponse === null || ncResponse.trim().isEmpty()) {
                        throw new RuntimeException("Operation Failed with error " + getErrorMessage(ncResponse));
                    }
                }
            });
        }
        return result;
    }
}

/**

 * This step object used to create the device-specific-data to LT.
 * @param {String} deviceName 
 * @param {*} configJson 
 * @param {*} topology 
 * @returns {{name: string, resourceFile: string, getTemplateArguments: (function(*=, *): *)}}
 */
 VirtualizerDeviceManager.prototype.constructLtStepObject = function (deviceName, configJson, topology, isClockMgmtSupportedForLT, isTimeZoneNameSupportedForLT, isHostIdConfigurationSupported, deviceReleaseVersion) {
    var deviceManagerObj = this;
    let topologyXtraInfo;
    if (topology) {
        topologyXtraInfo = JSON.parse(JSON.stringify(apUtils.getTopologyExtraInfo(topology)));
    }
    return {
        name: "configureLtDevice",
        resourceFile: deviceManagerObj.prefix + "configureLtDevice.xml.ftl",
        getTemplateArgsForTopology: function (deviceId, templateArgsWithDiff, templateArgs, stageName) {
            return apUtils.getTemplateArgsForTopology(deviceId, topologyXtraInfo, templateArgs, deviceReleaseVersion, stageName, "configureLtDevice")
        },
        skipEditConfigRequest: function (deviceId, templateArgsWithDiff) {
            return apUtils.compareDeviceVersion(deviceId, deviceReleaseVersion);
        },
        getTemplateArguments: function (baseArgs, topology) {
            var requestContext = requestScope.get();
            var keyName = deviceName + "_" + "computedBaseArgs";
            var neverSynced = requestScope.get().get("sync-input").neverSynced;
            var slotName = deviceName.substring(deviceName.lastIndexOf(".")+1);
            var networkState = requestScope.get().get("networkState").toString();
            var deviceInfo = apUtils.getDeviceInfo(deviceName);
            var intentConfigJson = requestContext.get("intentConfigJson");
            var satCapsHwType = configJson["hardware-type"];
            var isServiceActivationTestSupported = apCapUtils.getCapabilityValue(satCapsHwType, configJson["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_SERVICE_ACTIVATION_TEST_SUPPORTED, capabilityConstants.BOARD_FELT_D, false);

            if (!requestContext.get(keyName)) {
		baseArgs["isServiceActivationTestSupported"] = isServiceActivationTestSupported;

                if(baseArgs["isServiceActivationTestSupported"]) {
                   var boards = baseArgs["boards"];
                   var selectedProfile = intentConfigJson["boards"][deviceInfo["ltCard"]]["board-service-profile"];
                   var boardServiceProfileJson = requestScope.get().get("serviceProfiles");
                   var boardServiceProfiles = boardServiceProfileJson[profileConstants.BOARD_SERVICE_PROFILE.subTypeETH][profileConstants.BOARD_SERVICE_PROFILE.profileType];

                   if (boards[slotName]) {
                       var profile = boards[slotName]["board-service-profile"];

                          if(profile === selectedProfile){
                            for (let i = 0; i < boardServiceProfiles.length; i++) {
                                if(selectedProfile === boardServiceProfiles[i]["name"]){
                                    var satEnable = boardServiceProfiles[i]["enable-SAT"];
                                    baseArgs["enable-SAT"] = satEnable;
                                }
                            }

                          }
				  }
                }
                if(isHostIdConfigurationSupported){
                    baseArgs["isHostIdConfigurationSupported"] = isHostIdConfigurationSupported;
                }
                if(isTimeZoneNameSupportedForLT){
                    baseArgs["isTimeZoneNameSupportedForLT"] = isTimeZoneNameSupportedForLT;
                }
                if(isClockMgmtSupportedForLT){
                    baseArgs["isClockMgmtSupported"] = isClockMgmtSupportedForLT;
                }
                if(baseArgs["isHostIdConfigurationSupported"]) {
                    var currentTopology = requestScope.get().get("currentTopology");
                    var lastIntentConfigJson = apUtils.getLastIntentConfigFromTopologyXtraInfo(currentTopology);
                    var boardsTopology;
                    if (lastIntentConfigJson) {
                        boardsTopology= lastIntentConfigJson["boards"];
                    } 
                    var intentConfigArgs = {
                        "deviceName": baseArgs["target"]
                    }
                    var checkInside = false;
                    var checkInsideAuto = false;
                    if (baseArgs["boards"]) {
                        var boards = baseArgs["boards"];
                        var slotPool = deviceUtilities.getSlotPool();
                        if (boards[slotName]) {
                            var hostId = boards[slotName]["host-id"];
                            if (boardsTopology && boardsTopology[slotName] && boardsTopology[slotName]["host-id"]) {
                                if (boardsTopology[slotName]["host-id"] !== "auto" && boardsTopology[slotName]["host-id"] !== "not-configured" && hostId && hostId !== "auto" && hostId !== "not-configured"  && boardsTopology[slotName]["host-id"] !== hostId) {
                                    if (slotPool) {
                                        try {
                                            slotPool.returnResourceToPool(Integer.parseInt(boardsTopology[slotName]["host-id"]));
                                        } catch (error) {
                                            logger.debug("Error occurred while return the host-id to resourcePool: " + error);                                      
                                        }
                                    }
                                }
                            }
                            if (slotPool && (((boardsTopology && boardsTopology[slotName] && boards[slotName]["host-id"] !== boardsTopology[slotName]["host-id"])) || (boardsTopology && !boardsTopology[slotName] && boards[slotName]["host-id"]) || (hostId == "auto" && !boardsTopology) || (hostId == "auto" && boardsTopology && !boardsTopology[slotName]))) {
                                if (hostId == "auto") {
                                    checkInsideAuto = true;
                                    var idGenerate;
                                    try {
                                        slotPool.getFreeResourcesFromPool("defaultConsumer", function (resource, callback) {
                                            idGenerate = resource;//1-128
                                            var idsPropsVO = resourceManagerFactory.createResourceProperties(resource, intentConfigArgs.deviceName);
                                            callback = idsPropsVO;
                                        });
                                        if (neverSynced) {
                                            deviceUtilities.updateResourcePool(idGenerate, slotPool);
                                        }

                                    } catch (e) {
                                        logger.error("Error in slotPool.getFreeResourcesFromPool : ", e);
                                        throw new RuntimeException("No Free ONT ID available under ");
                                    }
                                    //hostId = hostID;
                                    boards[slotName]["host-id"] = idGenerate.toString();
                                    boards[slotName]["host-id-auto"] = idGenerate;
                                } else {
                                    if (hostId != "not-configured") {
                                        var existIDs = deviceUtilities.getExistingHostIDList(slotPool);
                                        var isAcceptable = true;
                                        if (existIDs && existIDs.length > 0) {
                                            isAcceptable = existIDs.indexOf(hostId) === -1 ? true : false;
                                        }
                                        if (isAcceptable) {
                                            deviceUtilities.updateResourcePool(hostId, slotPool);
                                            boards[slotName]["host-id"] = hostId.toString();
                                        }
                                    }

                                }
                                checkInside = true;
                            }
                            if (hostId !== "auto" || (hostId == "auto" && checkInsideAuto)) {
                                baseArgs["boards"] = boards;
                                baseArgs["hostId"] = boards[slotName]["host-id"];
                            }

                            if (!checkInside) {
                                deviceUtilities.updateResourcePool(baseArgs["hostId"], slotPool);
                                var existIDs = deviceUtilities.getExistingHostIDList(slotPool);
                            }
                        }
                    }
                    if (networkState == "delete" ) {
                        delete baseArgs["boards"]
                        deviceUtilities.executeDeleteHostId(lastIntentConfigJson, baseArgs, deviceName, slotPool)
                    }
                    deviceUtilities.executeDeleteHostId(lastIntentConfigJson, baseArgs, deviceName, slotPool)
                }
                requestContext.put(keyName, baseArgs);
                return baseArgs;
            } else {
                var computedBaseArgs = requestContext.get(keyName);
                if(computedBaseArgs["isHostIdConfigurationSupported"]) {
                    if (computedBaseArgs["boards"] && computedBaseArgs["boards"][slotName] && computedBaseArgs["boards"][slotName]["host-id-auto"]) {
                        var slotPool = deviceUtilities.getSlotPool();
                        deviceUtilities.updateResourcePool(computedBaseArgs["boards"][slotName]["host-id-auto"], slotPool);
                    }
                }
                computedBaseArgs.operation = baseArgs.operation;
                if (computedBaseArgs.isAuditSupported) {
                    delete computedBaseArgs.isAuditSupported;
                }
                return computedBaseArgs;
            }
        }
    };
}

VirtualizerDeviceManager.prototype.constructLtWithFeltBBackplane = function (deviceName, configJson, topology, backplaneSchedulerProfile, deviceReleaseVersion) {
    var deviceManagerObj = this;
    let topologyXtraInfo;
    if (topology) {
        topologyXtraInfo = JSON.parse(JSON.stringify(apUtils.getTopologyExtraInfo(topology)));
    }
    return {
        name: "configureLtDeviceWithFeltBBackplane",
        resourceFile: deviceManagerObj.prefix + "backplane-scheduler-profile.xml.ftl",
        getTemplateArgsForTopology: function (deviceId, templateArgsWithDiff, templateArgs, stageName) {
            return apUtils.getTemplateArgsForTopology(deviceId, topologyXtraInfo, templateArgs, deviceReleaseVersion, stageName, "configureLtDeviceWithFeltBBackplane")
        },
        skipEditConfigRequest: function (deviceId, templateArgsWithDiff) {
            return apUtils.compareDeviceVersion(deviceId, deviceReleaseVersion);
        },
        getTemplateArguments: function (baseArgs, topology) {
            var requestContext = requestScope.get();
            var profileTypeNames = [
                "bac-entry",
                "scheduler-node-profile"
            ];
            var profileSubtypes = {
                "bac-entry": "Lightspan",
                "scheduler-node-profile": "Lightspan"
            }
            var intentTypeVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, requestContext.get("target"));
            var deviceFxProfileVOList = getProfileVOList(profileTypeNames, profileSubtypes);
            var allDeviceFxProfiles = loadSpecificProfiles(intentConstants.INTENT_TYPE_DEVICE_FX, intentTypeVersion, configJson["device-version"], configJson["hardware-type"], deviceFxProfileVOList);
            if (allDeviceFxProfiles) {
                var schedulerNodeProfiles = allDeviceFxProfiles["scheduler-node-profile"]["Lightspan"];
                var bacEntryProfiles = allDeviceFxProfiles["bac-entry"]["Lightspan"];;
                var schedulerNodeProfile;
                var bacEntryProfile;
                if(schedulerNodeProfiles) {
                    for (var index = 0; index < schedulerNodeProfiles.length; index++) {
                        if (schedulerNodeProfiles[index]["name"] === backplaneSchedulerProfile) {
                            schedulerNodeProfile = schedulerNodeProfiles[index];
                            break;
                        }
                    }
                }
                if(schedulerNodeProfile && bacEntryProfiles) {
                    var listQueues = schedulerNodeProfile["queues"];
                    if (listQueues.length > 0) {
                        var bacName = listQueues[0]["bac-name"];
                        for (var index = 0; index < bacEntryProfiles.length; index++) {
                            if (bacEntryProfiles[index]["name"] === bacName) {
                                bacEntryProfile = bacEntryProfiles[index];
                                break;
                            }
                        }
                        if (bacEntryProfile) {
                            baseArgs["configBacEntry"] = bacEntryProfile;
                        }
                        baseArgs["queues"] = listQueues;
                    }
                }
            }
            return baseArgs;
        }
    };
}

/**
 * This step object used to create the h/w components on NT.
 * This step part of NT device.
 * The Step object non-yang aware component , it working based on the provided config json.
 * @param deviceName
 * @param configJson
 * @param topology
 * @param skipACUNTIO - (optional) used to skip ACU & NTIO if true
 * @returns {{name: string, resourceFile: string, getTemplateArguments: (function(*=, *): *)}}
 */
VirtualizerDeviceManager.prototype.constructPlanBoardStepObject = function (deviceName, configJson, topology, skipACUNTIO, deviceReleaseVersion) {
    var deviceManagerObj = this;
    let topologyXtraInfo;
    if (topology) {
        topologyXtraInfo = JSON.parse(JSON.stringify(apUtils.getTopologyExtraInfo(topology)));
    }
    return {
        name: "planBoards",
        trackedArgs: {"boardlist" : true},
        getTemplateArgsForTopology: function (deviceId, templateArgsWithDiff, templateArgs, stageName) {
            return apUtils.getTemplateArgsForTopology(deviceId, topologyXtraInfo, templateArgs, deviceReleaseVersion, stageName,"planBoards")
        },
        skipEditConfigRequest: function (deviceId, templateArgsWithDiff) {
            return apUtils.compareDeviceVersion(deviceId, deviceReleaseVersion);
        },
        resourceFile: function(intentConfigJson, deviceId, stepName) {
            var hardwareType = intentConfigJson["hardware-type"];
            if (hardwareType && (hardwareType === intentConstants.FAMILY_TYPE_LS_DF_CFXR_E || hardwareType === intentConstants.FAMILY_TYPE_LS_DF_CFXR_H || hardwareType === intentConstants.FAMILY_TYPE_LS_DF_CFXR_J || hardwareType === intentConstants.FAMILY_TYPE_LS_DF_CFXR_F || hardwareType === intentConstants.FAMILY_TYPE_LS_DF_CFXR_C || hardwareType === intentConstants.FAMILY_TYPE_LS_DF_CFXR_A)) {
                return deviceManagerObj.prefix + "planBoardLsDfCfxrE.xml.ftl"
            } else {
                return deviceManagerObj.prefix + "planBoardFX.xml.ftl"
            }
        },
        getTemplateArguments: function (baseArgs, topology) {
            apUtils.getMergedObject(baseArgs, configJson);
            baseArgs["boardlist"] = {};
            baseArgs["networkState"] = baseArgs["networkState"].toString();
            var supportedFans = apCapUtils.getCapabilityValue(baseArgs["hardware-type"], baseArgs["device-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_FAN_BOARDS, capabilityConstants.HYPHEN_CONTEXT, []);
            baseArgs["isSupportsFan"] = supportedFans.length > 0 ? "true" : "false";
            var isBoardAdminStateSupported = apCapUtils.getCapabilityValue(baseArgs["hardware-type"], baseArgs["device-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_BOARD_ADMIN_STATE_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            var replacedBoards = {};
            if (baseArgs["boards"] && typeof baseArgs["boards"] === "object") {
                Object.keys(baseArgs["boards"]).forEach(function (board) {
                    var planType = baseArgs["boards"][board]["planned-type"];
                    if(planType !== '-') {
                    if (board.indexOf(intentConstants.FX_LT_STRING) === 0) {
                        var slotNum = Number(board.replace(intentConstants.FX_LT_STRING, ""));
                        var boardServiceProfile = baseArgs["boards"][board]["board-service-profile"];
                        var parent;
                        if (planType === intentConstants.FAMILY_TYPE_SFDB_A) {
                            board = "Lt";
                            parent = "Slot-Lt";
                        } else {
                            parent = "Slot-Lt-" + slotNum;
                        }
                        baseArgs["boardlist"][board] = deviceManagerObj.getBoardObject("nokia-hwi:lt", planType, parent, false, slotNum + 32, "nokia-hwi:slot-lt"); //Board LT vertex ID begining from 33

                        var isEthBoard = false;
                        isEthBoard = apCapUtils.isValueInCapability(baseArgs["hardware-type"], baseArgs["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, planType, "ETH");
                        var isBoardTypeLT = apCapUtils.isValueInCapability(baseArgs["hardware-type"], baseArgs["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.SLOT_TYPE, planType, "LT");
                        if ((isEthBoard && isBoardTypeLT) ){
                            var deviceDetails = {};
                            deviceDetails["useProfileManager"] = true;
                            deviceDetails["deviceName"] = baseArgs["deviceID"];
                            deviceDetails["nodeType"] = baseArgs["hardware-type"] + "-" + baseArgs["device-version"];
                            deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
                            deviceDetails["intentTypeVersion"] = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, baseArgs["deviceID"]);
                            deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);
                            var boardServiceProfileObj = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", boardServiceProfile, deviceDetails);
                            if(boardServiceProfileObj["model"] === "uplink-mode"){
                                baseArgs["boardlist"][board]["boardWorkingMode"] = "nokia-hwbm:uplink-mode";
                            }else if(boardServiceProfileObj["model"] === "downlink-mode"){
                                baseArgs["boardlist"][board]["boardWorkingMode"] = "nokia-hwbm:downlink-mode";
                            }
                        }
                        if (isBoardAdminStateSupported && typeof baseArgs["boards"][board]["admin-state"] !== 'undefined') {
                            baseArgs["boardlist"][board]["adminState"] = baseArgs["boards"][board]["admin-state"];
                        }
                        var replacedLTs = requestScope.get().get("replacedLTs");            
                        if (replacedLTs && replacedLTs[board]) {
                            replacedBoards[board] = board;
                        }
                    } else if (board.indexOf("PSU") === 0) {
                        var psuNum = Number(board.replace("PSU", ""));
                        parent = "Slot-Psu-" + psuNum;
                        baseArgs["boardlist"]["Psu" + psuNum] = deviceManagerObj.getBoardObject("nokia-hwi:psu", planType, parent, false, psuNum + 49, "nokia-hwi:slot-psu"); //Board PSU vertex ID begining from 50
                        baseArgs["boardlist"]["Psu" + psuNum]["batteryType"] = baseArgs["boards"][board]["battery-type"];
                    } else if (board.indexOf(intentConstants.NTA_BOARD) === 0 || board.indexOf(intentConstants.NTB_BOARD) === 0 || board === intentConstants.NT_STRING) {
                        if (board === intentConstants.NT_STRING) {
                            var ntName = "Nt";
                            parent = "Slot-Nt";
                            var ntNum = 29;
                        } else if (board === intentConstants.NTA_BOARD) {
                            ntName = "Nta";
                            parent = "Slot-Nt-A";
                            ntNum = 29;
                        } else {
                            ntName = "Ntb";
                            parent = "Slot-Nt-B";
                            ntNum = 30;
                        }
                        baseArgs["boardlist"][ntName] = deviceManagerObj.getBoardObject("nokia-hwi:nt", planType, parent, false, ntNum, "nokia-hwi:slot-nt");
                    } else if (board && board.match("(FAN|NTIO)[1-9]")) {
                        if (board.startsWith("FAN")) {
                            var slotNbr = Number(board.replace("FAN", ""));
                            baseArgs["boardlist"]["Fan" + slotNbr] = deviceManagerObj.getBoardObject("nokia-hwi:fan-pack", planType, "Slot-Fan-" + slotNbr, false, slotNbr + 48, "nokia-hwi:slot-fan"); //Board FAN vertex ID begining from 49
                        } else if (board.startsWith("NTIO")) {
                            var slotNbr = Number(board.replace("NTIO", ""));
                            baseArgs["boardlist"]["Ntio" + slotNbr] = deviceManagerObj.getBoardObject("nokia-hwi:ntio", planType, "Slot-Ntio-" + slotNbr, false, slotNbr + 31, "nokia-hwi:slot-ntio"); //Board NTIO vertex ID begining from 31
                        }
                    } else {
                        switch (board) {
                            case "FAN":
                                baseArgs["boardlist"]["Fan"] = deviceManagerObj.getBoardObject("nokia-hwi:fan-pack", planType, "Slot-Fan", false, 49, "nokia-hwi:slot-fan");
                                break;
                            case "NTIO":
                                baseArgs["boardlist"]["Ntio"] = deviceManagerObj.getBoardObject("nokia-hwi:ntio", planType, "Slot-Ntio", false, 31, "nokia-hwi:slot-ntio");
                                break;
                            case "ACU":
                                baseArgs["boardlist"]["Acu"] = deviceManagerObj.getBoardObject("nokia-hwi:acu", planType, "Slot-Acu", false, 52, "nokia-hwi:slot-acu");
                                break;
                        }
                    }
                    }
                });
                //default LT Slot topology list
                var numOfSlot;
                if (baseArgs["hardware-type"].startsWith(intentConstants.LS_FX_PREFIX) 
                    || baseArgs["hardware-type"].startsWith(intentConstants.LS_MF_PREFIX)) {
                    numOfSlot = apUtils.getNumberOfPorts(baseArgs["hardware-type"]);
                }
                var topoList = {};
                for (var i = 1; i <= numOfSlot; i++) {
                    topoList["Slot-Lt-" + i] = {"vertexId": 5 + i}; //begining LT vertex ID is 6
                }
                if (baseArgs["hardware-type"].startsWith(intentConstants.LS_SF_PREFIX)) {
                    topoList["Slot-Lt"] = {"vertexId": 6};
                    topoList["Slot-Nt"] = {"vertexId": 2};
                } else {
                    topoList["Slot-Nt-A"] = {"vertexId": 2};
                    topoList["Slot-Nt-B"] = {"vertexId": 3};
                }
                baseArgs["topoList"] = topoList;
            }
            var deviceVersion = configJson["device-version"];
            var isClockMgmtSupportedForNT = requestScope.get().get("isClockMgmtSupportedForNT");
            var isClockMgmtSupportedForLT = requestScope.get().get("isClockMgmtSupportedForLT");//For LS-DF
            var isClockGNSSInterfaceSupportedForNT = requestScope.get().get("isClockGNSSInterfaceSupportedForNT");
            var isClockGNSSDedicatedInOutSupportedForNT = requestScope.get().get("isClockGNSSDedicatedInOutSupportedForNT");
            var isClockBITSInterfaceSupportedForNT = requestScope.get().get("isClockBITSInterfaceSupportedForNT");

            var isClockGNSSInterfaceSupportedForACU = requestScope.get().get("isClockGNSSInterfaceSupportedForACU");
            var isClockGNSSDedicatedInOutSupportedForACU = requestScope.get().get("isClockGNSSDedicatedInOutSupportedForACU");
            var isClockBITSInterfaceSupportedForACU = requestScope.get().get("isClockBITSInterfaceSupportedForACU");

            var isTimeZoneNameSupported = requestScope.get().get("isTimeZoneNameSupported");
            var isBoardAdminStateSupported = requestScope.get().get("isBoardAdminStateSupported");

            var deviceName = baseArgs["deviceID"];
            if(isClockMgmtSupportedForNT) {
                baseArgs["isClockMgmtSupported"] = "true";
                if(typeof isClockMgmtSupportedForLT == 'boolean') {
                    baseArgs["isClockMgmtSupportedForLT"] = isClockMgmtSupportedForLT ? "true" : "false";
                }
                if(typeof isClockGNSSInterfaceSupportedForNT == 'boolean') {
                    baseArgs["isClockGNSSInterfaceSupportedForNT"] = isClockGNSSInterfaceSupportedForNT ? "true" : "false";
                }
                if(typeof isClockGNSSDedicatedInOutSupportedForNT == 'boolean') {
                    baseArgs["isClockGNSSDedicatedInOutSupportedForNT"] = isClockGNSSDedicatedInOutSupportedForNT ? "true" : "false";
                }
                if (typeof isClockBITSInterfaceSupportedForNT == 'boolean') {
                    baseArgs["isClockBITSInterfaceSupportedForNT"] = isClockBITSInterfaceSupportedForNT ? "true" : "false";
                }
                if (typeof isClockGNSSInterfaceSupportedForACU == 'boolean') {
                    baseArgs["isClockGNSSInterfaceSupportedForACU"] = isClockGNSSInterfaceSupportedForACU ? "true" : "false";
                }
                if (typeof isClockGNSSDedicatedInOutSupportedForACU == 'boolean') {
                    baseArgs["isClockGNSSDedicatedInOutSupportedForACU"] = isClockGNSSDedicatedInOutSupportedForACU ? "true" : "false";
                }
                if (typeof isClockBITSInterfaceSupportedForACU == 'boolean') {
                    baseArgs["isClockBITSInterfaceSupportedForACU"] = isClockBITSInterfaceSupportedForACU ? "true" : "false";
                }
            }
            if (isTimeZoneNameSupported){
                baseArgs["isTimeZoneNameSupported"] = "true";
            }
            if (isBoardAdminStateSupported) {
                baseArgs["isBoardAdminStateSupported"] = "true";
            }
            if ((baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_A) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_B)) && !baseArgs["isAuditSupported"]
                && apUtils.compareVersion(deviceVersion,"21.9") < 0) {
                baseArgs["externalAlarmPortList"] = deviceManagerObj.getExternalAlarmPortObject(deviceName);  //begining Alarm-Port vertex ID is 53
            }
        
            if (baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_A) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_B) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_E)
                 || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_H) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_J) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_A) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_C)) {
                baseArgs["skipRemoveAction"] = true;
            }
            if (requestScope.get().get("alarmExternalSupported")) {
                var convertedAlarmExternal = apUtils.processExternalAlarmJson(requestScope.get().get("externalAlarmJson"),requestScope.get().get("externalAlarmScanPointDetail"));
                if ( (baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_MF_LANT_A) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_MF_LBNT_A_MF14_LMFS_A))
                    && (baseArgs["boards"] && typeof baseArgs["boards"] === "object" 
                    && Object.keys(baseArgs["boards"]).indexOf("ACU") !== -1) 
                    && baseArgs["boards"]["ACU"] && baseArgs["boards"]["ACU"]["planned-type"] 
                    && intentConstants.ACU_PLANNED_TYPE_SUPPORT_EXTERNAL_ALARM.indexOf(baseArgs["boards"]["ACU"]["planned-type"]) !== -1) {
                    baseArgs["parentHardwareComponent"] = "Board-Acu";
                    requestScope.get().put("isRemovationScanpointSupported", true);
                } else if (baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_A) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_B)){
                    baseArgs["parentHardwareComponent"] = "Chassis";
                } else if (baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_E) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_H) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_J) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_A) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_C)){
                    baseArgs["parentHardwareComponent"] = "Chassis";
                } else if (baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_SF_SFMB_A)){
                    baseArgs["parentHardwareComponent"] = "Chassis";
                }
                if (convertedAlarmExternal && baseArgs["parentHardwareComponent"]) {
                    if (convertedAlarmExternal["externalAlarmNames"]) baseArgs["externalAlarmNames"] = convertedAlarmExternal["externalAlarmNames"];
                    if (convertedAlarmExternal["inputScanPoints"]) baseArgs["inputScanPoints"] = convertedAlarmExternal["inputScanPoints"];
                    if (convertedAlarmExternal["outputScanPoints"]) baseArgs["outputScanPoints"] = convertedAlarmExternal["outputScanPoints"];
                }
            }
            baseArgs["skipACUNTIO"]="false";// For LS-FX/default case
            // For LS-MF-LMNT-A/LMNT-B case where ACU/NTIO are not applicable in topology
            if(skipACUNTIO && skipACUNTIO==true) baseArgs["skipACUNTIO"]="true";

            if (baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_MF_LANT_A) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_MF_LBNT_A_MF14_LMFS_A)) {
                baseArgs["isMultipleSlot"] = true;
            }
            // Rename parent slot names for LS-DF-CFXR-E (Slot-Fan and Slot-Psu)
            if (baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_E) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_H) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_J) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_A) || baseArgs["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_C)) {
                if (baseArgs.boardlist && baseArgs.boardlist.Psu1) {
                    baseArgs.boardlist.Psu1.parent = "Slot-Psu1"
                }
                if (baseArgs.boardlist && baseArgs.boardlist.Psu2) {
                    baseArgs.boardlist.Psu2.parent = "Slot-Psu2"
                }
                if (baseArgs.boardlist && baseArgs.boardlist.Fan) {
                    baseArgs.boardlist.Fan.parent = "Slot-Fan"
                }
                let isIhubSupported = requestScope.get().get("isIhubSupported");
                if(isIhubSupported) {
                    baseArgs["isIhubSupported"] = isIhubSupported;
                }
            };

            if (replacedBoards && !apUtils.ifObjectIsEmpty(replacedBoards)) {
                var deviceName = baseArgs["deviceID"];
                var templateArgs = { "deviceName": deviceName, "replacedBoards":  replacedBoards};
                var requestXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE  + "removeReplacedLt.xml.ftl"), templateArgs);
                //Executing rpc to delete replaced LT device in AV
                var ncResponse = requestExecutor.executeNCWithManager(baseArgs["device-manager"], requestXml);
                if (!ncResponse.isOK()) {
                    if (ncResponse.getException() != null) {
                        throw ncResponse.getException();
                    } else {
                        if (ncResponse.getRawResponse() != null) {
                            logger.error(ncResponse.getRawResponse());
                            var errorContent = requestScope.get().get("xFWK").getErrorMessage(ncResponse.getRawResponse());
                            if (errorContent.errorObject != null) {
                                throw new RuntimeException(errorContent.errorObject + ":" + errorContent.errorMessage);
                            }
                            throw new RuntimeException(errorContent.errorMessage);
                        }
                    }
                }
            }
            return baseArgs;
        },
        preStepSynchronize: function (syncInput, templateArgsWithDiff, result) {
            var networkState = syncInput.getNetworkState().name();
            if (networkState != intentConstants.NETWORK_STATE_DELETE && requestScope.get().get("isRemovationScanpointSupported")) {
                var proceed = true;
                var ifRemovedExternalAlarmExist = false;
                var ifNewExternalAlarmExist = false;
                var removedExternalAlarmPort;
                var processScanpoint = function (scanpoints, action, output) {
                    var keys = Object.keys(scanpoints);
                    for (var i = 0; i < keys.length; i++) {
                        var key = keys[i];
                        key != "changed" && action(scanpoints[key], key, output);
                    }
                }
                var checkIfScanpointChanged = function (templateArgsWithDiff, scanpointName, minimumScanPointToCompare) {
                    if (templateArgsWithDiff && templateArgsWithDiff[scanpointName] && typeof templateArgsWithDiff[scanpointName] === "object" &&
                        templateArgsWithDiff[scanpointName].changed && Object.keys(templateArgsWithDiff[scanpointName]).length >= minimumScanPointToCompare) {
                        return true;
                    }
                    return false;
                }
                // 3 meaning: 1 key for "changed", 1 key for removed profiles, 1 key for new profiles (contains property removed)
                // if it contains "removed", we will ignore, because it will handle in synchronize request
                if (checkIfScanpointChanged(templateArgsWithDiff, "externalAlarmNames", 3)) {
                    processScanpoint(templateArgsWithDiff["externalAlarmNames"], function (scanpoint) {
                        if (scanpoint.removed) {
                            removedExternalAlarmPort = scanpoint.name;
                            ifRemovedExternalAlarmExist = true;
                        } else {
                            ifNewExternalAlarmExist = true;
                        }
                    })
                }
                if (ifRemovedExternalAlarmExist && ifNewExternalAlarmExist) {
                    var ifInputRequireToBeDeleted = false;
                    var ifOutputRequireToBeDeleted = false;
                    var removedInputScanpoints = {};
                    var removedOutputScanpoints = {};
                    logger.debug("External Alarm Profile modified with removed profile {}", removedExternalAlarmPort);
                    if (checkIfScanpointChanged(templateArgsWithDiff, "inputScanPoints", 2)) {
                        processScanpoint(templateArgsWithDiff["inputScanPoints"], function (scanpoint, key, removedInputScanpoints) {
                            //remove the old scanpoint(include the removed one and the scanpoint that changed parent name)
                            if (scanpoint.externalAlarm === removedExternalAlarmPort || scanpoint.changed) {
                                ifInputRequireToBeDeleted = true;
                                removedInputScanpoints[key] = scanpoint;
                            }
                        }, removedInputScanpoints)
                    }

                    if (checkIfScanpointChanged(templateArgsWithDiff, "outputScanPoints", 2)) {
                        processScanpoint(templateArgsWithDiff["outputScanPoints"], function (scanpoint, key, removedOutputScanpoints) {
                            if (scanpoint.externalAlarm === removedExternalAlarmPort || scanpoint.changed) {
                                ifOutputRequireToBeDeleted = true;
                                removedOutputScanpoints[key] = scanpoint;
                            }
                        }, removedOutputScanpoints)
                    }
                    if (ifInputRequireToBeDeleted || ifOutputRequireToBeDeleted) {
                        try {
                            var templateArgs = {
                                deviceID: templateArgsWithDiff.deviceID.value,
                                inputScanPoints: removedInputScanpoints,
                                outputScanPoints: removedOutputScanpoints
                            }
                            logger.debug("templateArgs for deleting scanpoints {}", JSON.stringify(templateArgs));
                            apUtils.executeRequest(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "deleteScanpoints.xml.ftl", templateArgs);
                        } catch (e) {
                            logger.error("Error while deleting old scanpoints {}", e)
                        }
                    }
                }
                if (!proceed) {
                    return {
                        proceed: false,
                        errorCode: "ERR-100",
                        errorMessage: "Cannot remove old scanpoints for recreation"
                    };
                }
            }
            return {
                proceed: true
            }
        }
    };
}

/**
 * This step object used to create the h/w components on LT for LS-MX device.
 * @param deviceName
 * @param configJson
 * @param topology
 * @returns {{name: string, resourceFile: string, getTemplateArguments: (function(*=, *): *)}}
 */
VirtualizerDeviceManager.prototype.constructPlanBoardStepObjectForMx = function (deviceName, configJson, topology) {
    var deviceManagerObj = this;
    return {
        name: "planBoards",
        resourceFile: deviceManagerObj.prefix + "planBoardMX.xml.ftl",
        sensitiveKeys: ["password"],
        getTemplateArguments: function (baseArgs, topology) {
            apUtils.getMergedObject(baseArgs, configJson);
            baseArgs["boardlist"] = {};
            baseArgs["networkState"] = baseArgs["networkState"].toString();
            baseArgs["hwPort"] = "SFP-NTA/X1";
            baseArgs["hwBoard"]  = intentConstants.NTA_BOARD;
            baseArgs["hwSlot"] = "SLOT-NTA";
            baseArgs["fan"]  = "FAN";
            logger.debug("constructPlanBoardStepObjectForMx Info: {}", apUtils.protectSensitiveData(baseArgs, this.sensitiveKeys));
            return baseArgs;
        }
    };
}
/**
 * This step object used to create the backplane ports on IHUB.
 * This step part of IHUB device.
 * The Step object non-yang aware component , it working based on the provided config json.
 * @param deviceName
 * @param configJson
 * @param topology
 * @returns {{name: string, resourceFile: string, getTemplateArguments: (function(*=, *): *)}}
 */
VirtualizerDeviceManager.prototype.constructIHUBLtPortsStepObject = function (deviceName, configJson, topology) {
    var deviceManagerObj = this;
    const getBoardSubTypeForLT = function(hwType, deviceVersion, plannedType) {
        if (hwType.startsWith(intentConstants.LS_MF_PREFIX)) {
            return "LS-MF-LT";
        } else if (hwType.startsWith(intentConstants.LS_SF_PREFIX)) {
            return "LS-SF-LT";
        } else if (hwType.startsWith(intentConstants.LS_DF_PREFIX)) {
            return "LS-DF";
        } else if (hwType.startsWith(intentConstants.LS_FX_PREFIX)) {
            var portTypeETH = apCapUtils.getCapabilityContext(hwType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, capabilityConstants.ETHERNET_ALIAS);
            if (portTypeETH.indexOf(plannedType) > -1) {
                return  "LS-FX-ETH";
            } else {
                return "LS-FX-LT";
            }
        }
    }
    
    return {
        name: "createLtPorts",
        trackedArgs: {
            "backplane-kr-capability": true
        },
        resourceFile: deviceManagerObj.prefix + "createLtPorts.xml.ftl",
        getTemplateArguments: function (baseArgs, topology) {
            apUtils.getMergedObject(baseArgs, configJson);
            let deviceVersionForCaps = apUtils.getDeviceVersionForCaps(deviceName, baseArgs["device-version"]);
            baseArgs["isTimeZoneNameSupportedForIHUB"] = apCapUtils.getCapabilityValue(baseArgs["hardware-type"], deviceVersionForCaps, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_TIME_ZONE_NAME_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
	    baseArgs["isMdaLoopbackModeSupportedForIHUB"] = apCapUtils.getCapabilityValue(baseArgs["hardware-type"], deviceVersionForCaps, capabilityConstants.DEVICE_CATEGORY, "is-mda-loopback-mode-supported", capabilityConstants.HYPHEN_CONTEXT, true);	
            baseArgs["zoneAbbreviation"] = baseArgs["timezone-name"] ? apUtils.convertToZoneAbbreviations(baseArgs["timezone-name"]) : "utc";
            baseArgs["networkState"] = baseArgs["networkState"].toString();
            var boardServiceProfileJson = requestScope.get().get("serviceProfiles");
            var boards = baseArgs["boards"];
            var familyPrefix = intentConstants.LS_FX_PREFIX;
            if (configJson && configJson["hardware-type"] && (configJson["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_IHUB_LANT) || configJson["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_IHUB_LBNT))) {
                familyPrefix = intentConstants.LS_MF_PREFIX;
            }
            var shelfHardwareType = configJson["shelf-hardware-type"];
            var deviceVersion = configJson[intentConstants.DEVICE_VERSION];

            let shelfName = deviceName.substring(0, deviceName.lastIndexOf(intentConstants.DEVICE_SEPARATOR));
            if (boards && boardServiceProfileJson) {
                Object.keys(boards).forEach(function (board) {
                    var boardServiceProfileName = boards[board]["board-service-profile"];
                    var plannedType = boards[board]["planned-type"];
                    if(shelfHardwareType.startsWith("LS-DF")){
                        boardServiceProfileName = configJson["board-service-profile"];
                        plannedType = plannedType.toUpperCase();
                    }
                   let boardName = shelfName+intentConstants.DEVICE_SEPARATOR+boards[board]["slot-name"];
                   let boardVersionForCaps = apUtils.getDeviceVersionForCaps(boardName, boards[board]["device-version"] ? boards[board]["device-version"] : deviceVersion);
                   let isBoardTypeLT = apCapUtils.isValueInCapability(shelfHardwareType, boardVersionForCaps, capabilityConstants.BOARD_CATEGORY, "slot-type", plannedType, "LT");
                    if (board.startsWith(intentConstants.NTIO_STRING) && boardServiceProfileName) {
                        var boardSubType = familyPrefix + "-" + intentConstants.NTIO_STRING;
                        var serviceProfiles = boardServiceProfileJson[boardSubType]["board-service-profile"];
                        if(serviceProfiles){
                            for (var inx = 0; inx < serviceProfiles.length; inx++) {
                                if (serviceProfiles[inx]["name"] === boardServiceProfileName) {
                                    boards[board]["serviceProfile"] = serviceProfiles[inx];
                                    break;
                                }
                            }
                        }
                    }
                    if (isBoardTypeLT && boardServiceProfileName) {
                        const boardSubType = getBoardSubTypeForLT(shelfHardwareType, boardVersionForCaps, plannedType)
                        var serviceProfiles = boardServiceProfileJson[boardSubType]["board-service-profile"];
                        if(serviceProfiles){
                            for (var inx = 0; inx < serviceProfiles.length; inx++) {
                                if (serviceProfiles[inx]["name"] === boardServiceProfileName  && serviceProfiles[inx]["pbit-remarking"] ) {
                                    boards[board]["pbit-remarking"] = { "value": serviceProfiles[inx]["pbit-remarking"] ? serviceProfiles[inx]["pbit-remarking"] : null};
                                    break;
                                }
                            }
                        }
                    }
                })
            }
            if (configJson["hardware-type"].startsWith("LS-FX")) {
                var isUplinkPresentInShelf = false;
                if (boards) {
                    Object.keys(boards).forEach(function (board) {
                        var boardServiceProfileName = boards[board]["board-service-profile"];
                        if (boardServiceProfileName && boardServiceProfileName.startsWith("Uplink-Mode")) {
                            isUplinkPresentInShelf = true;
                            baseArgs["isUplinkPresentInShelf"] = isUplinkPresentInShelf;
                            return;
                        } else {
                            baseArgs["isUplinkPresentInShelf"] = isUplinkPresentInShelf;
                        }
                    })
                }
                // Get the CrossNTLoadSharing CAPS from Shelf and configure the same on IHUB
                if (deviceName.endsWith(intentConstants.DOT_LS_IHUB)) {
                    var dotLastIndex = deviceName.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
                    if (dotLastIndex > -1) {
                        var deviceRelease;
                        try{
                            var shelfDeviceName = deviceName.substring(0, dotLastIndex);
                            var familyTypeRelease = apUtils.getNodeTypefromEsAndMds(shelfDeviceName);
                            deviceRelease = familyTypeRelease.substring(familyTypeRelease.lastIndexOf("-") + 1);
                        } catch (err) {
                            logger.warn("Getting CrossNTLoadSharing CAPS from Shelf - not able to get deviceRelease with error {}", err.message);
                            deviceRelease = configJson["ihub-version"] ? configJson["ihub-version"] : configJson["device-version"];
                        }
                        if (!deviceRelease) {
                            throw new RuntimeException("Could not get Device Release of Shelf device");
                        }
                        var shelfRegEx = "([A-Z]+)-([A-Z]+)-([A-Z]+-[A-Z])";
                        var shelfHardWware = configJson["shelf-hardware-type"].match(shelfRegEx);
                        var isCrossNtLoadSharingSupported = apCapUtils.getCapabilityValue(configJson["shelf-hardware-type"], deviceRelease, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_CROSS_NT_LOAD_SHARING_SUPPORTED, shelfHardWware[3], false);
                        baseArgs["isCrossNtLoadSharingSupported"] = isCrossNtLoadSharingSupported;
                    }
                }
            }
            if ((configJson["hardware-type"].startsWith("LS-FX") || configJson["hardware-type"].startsWith("LS-MF")) && deviceName.endsWith(intentConstants.DOT_LS_IHUB)) {
                var dotLastIndex = deviceName.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
                if (dotLastIndex > -1) {
                    var replacedLTs = requestScope.get().get("replacedLTs");            
                    if (replacedLTs && !apUtils.ifObjectIsEmpty(replacedLTs)) {
                        var templateArgs = {
                            "deviceID": deviceName
                        }
                        var replacedLTList = [];
                        var replacedLTNames = [];
                        Object.keys(replacedLTs).forEach(function (replacedLT) {
                            replacedLTList.push(replacedLT.replace("LT",""));
                            replacedLTNames.push(replacedLT);
                        });
                        try {
                            var extractedXpath = "/nc:rpc-reply/nc:data/device-manager:device-manager/adh:device[adh:device-id=\'" + baseArgs["deviceID"] + "\']";
                            var extractedNode = apUtils.getExtractedNodeFromResponse(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getConfiguredServices.xml.ftl", templateArgs, extractedXpath, apUtils.prefixToNsMap);
                            if (extractedNode) {
                                var vpipeObject = deviceManagerObj.getServiceNameForReplacedLT(replacedLTList, extractedNode, "vpipe");
                                var vpipeGroupObject = deviceManagerObj.getServiceNameForReplacedLT(replacedLTList, extractedNode, "vpipe-group");
                                var vplsObject = deviceManagerObj.getServiceNameForReplacedLT(replacedLTList, extractedNode, "vpls");

                                var pipeObject = deviceManagerObj.getPipeNameForReplacedLT(replacedLTNames, extractedNode);
                            }
                        } catch (e) {
                            logger.error("Error: "+ e);
                        }
                        var templateArgs = {
                            "deviceID": deviceName,
                            "vpipeObject": vpipeObject,
                            "vpipeGroupObject": vpipeGroupObject,
                            "vplsObject": vplsObject,
                            "replacedLTs": replacedLTs,
                            "pipeObject": pipeObject
                        };
                        var requestXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE  + "removeMdaTypeForReplacedLt.xml.ftl"), templateArgs);
                        var ncResponse = requestExecutor.executeNCWithManager(baseArgs["device-manager"], requestXml);
                        if (!ncResponse.isOK()) {
                            if (ncResponse.getException() != null) {
                                throw ncResponse.getException();
                            } else {
                                if (ncResponse.getRawResponse() != null) {
                                    logger.error(ncResponse.getRawResponse());
                                    var errorContent = requestScope.get().get("xFWK").getErrorMessage(ncResponse.getRawResponse());
                                    if (errorContent.errorObject != null) {
                                        throw new RuntimeException(errorContent.errorObject + ":" + errorContent.errorMessage);
                                    }
                                    throw new RuntimeException(errorContent.errorMessage);
                                }
                            }
                        }
                    }
                }
            }
            return baseArgs;
        }
    };
}

/**
 * This function used to search for the service that use a LT to configure the port to remove in LT replacement scenario
 * This step part of IHUB device
 * @param replacedLTList
 * @param extractedNode
 * @param serviceType
 * @returns Object contain all servicename that match the requirement
 */
VirtualizerDeviceManager.prototype.getServiceNameForReplacedLT = function (replacedLTList, extractedNode, serviceType) {
    var servicePath = "adh:device-specific-data/conf:configure/conf:service/conf:" + serviceType + "/conf:service-name";
    var serviceValues = apUtils.getAttributeValues(extractedNode, servicePath, apUtils.prefixToNsMap);
    var serviceObject = {};

    if (serviceValues && serviceValues.length > 0) {
        for(var i=0; i<serviceValues.length;i++) {
            var sapPath = "adh:device-specific-data/conf:configure/conf:service/conf:" + serviceType + "[conf:service-name=\'" + serviceValues[i] + "\']/conf:sap/conf:sap-id";
            var sapValues = apUtils.getAttributeValues(extractedNode, sapPath, apUtils.prefixToNsMap);
            
            if (sapValues && sapValues.length > 0) {
                for(var j=0; j<sapValues.length;j++) {
                    replacedLTList.forEach(function (slot) {
                        var portValue = parseInt(slot) + 7;
                        if (sapValues[j].startsWith("1/" + portValue + "/1")) {
                            if ((serviceType != "vpls") || (serviceType == "vpls" && serviceValues[i] != 100 && serviceValues[i] != 4093))
                            serviceObject[i] = serviceValues[i];
                        }
                    })
                }
            }
        }
    }
    return serviceObject;
}

VirtualizerDeviceManager.prototype.getPipeNameForReplacedLT = function (replacedLTs, extractedNode) {
    var serviceType = "vpipe-group";
    var pipeObject = {};
    var servicePath = "adh:device-specific-data/conf:configure/conf:service/conf:" + serviceType + "/conf:service-name";
    var serviceValues = apUtils.getAttributeValues(extractedNode, servicePath, apUtils.prefixToNsMap);
    if (serviceValues && serviceValues.length > 0) {
        serviceValues.forEach(function (serviceValue) {
            var pipePath = "adh:device-specific-data/conf:configure/conf:service/conf:" + serviceType + "[conf:service-name=\'" + serviceValue + "\']/conf:pipe/conf:pipe-name";
            var pipeValues = apUtils.getAttributeValues(extractedNode, pipePath, apUtils.prefixToNsMap);
            if (pipeValues && pipeValues.length > 0) {
                pipeValues.forEach(function (pipeName) {
                    replacedLTs.forEach(function (replacedLT) {
                        if (pipeName.endsWith(replacedLT)) {
                            if (!pipeObject[serviceValue]) {
                                pipeObject[serviceValue] = [];
                            }
                            pipeObject[serviceValue].push(pipeName);
                        }
                    })
                })
            }
        })
    }
    return pipeObject;
}

/**
 * The intent object creation method used create intent object for each board in the FX intent.
 * We are creating separate intentObject for each board to make sure the required configuration added in each device.
 * This method used as call back method in postSync and this method used in poetAudit.
 * The board object supports device-creation , s/w upgrade. plug-match steps and Local device creation.
 *
 * Sync :
 *  Method construct the intent Object for each board the execute the sync for each board with new netconf fwk object.
 *  The sync operation covered with try , catch so each board execution guaranteed.
 *  This method provided the consolidated syncResult for all the boards.
 *
 * Audit:
 *  This method used to perform the audit for each board object.
 *  This method provided the consolidated audit report for all the boards.
 *  If any board audit failed with exception this method will bailout with error message further board audit won't execute.
 * @param ntDeviceName
 * @param configJson
 * @param topology
 * @param method (sync | audit )
 * @returns {function(...[*]=)}
 */
VirtualizerDeviceManager.prototype.createIntentConfigForLTBoards = function (ntDeviceName, configJson, topology, method, lsPrefix) {

    var deviceManagerObj = this;
    return function (syncInput, networkState, result) {
        var boards = [];
        // current Config Boards
        var currentBoards = {};
        // all Config Boards ( current + removed )
        var allBoards = {};
        if (configJson["boards"] && typeof configJson["boards"] === 'object') {
            currentBoards = JSON.parse(JSON.stringify(configJson["boards"]));
            allBoards = JSON.parse(JSON.stringify(configJson["boards"]));
        }
        // get all removed lts and update in allBoards
        var boardPrefix;
        if (configJson["hardware-type"].startsWith(intentConstants.LS_FX_PREFIX)) {
            boardPrefix = "LS-FX-"
        } else if (configJson["hardware-type"].startsWith(intentConstants.LS_MF_PREFIX)) {
            boardPrefix = "LS-MF-"
        }
        var replacedLTs = requestScope.get().get("replacedLTs");
        if (!replacedLTs || (replacedLTs && apUtils.ifObjectIsEmpty(replacedLTs))) {
            var replacedLTs = {};
            if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
                var xtraInfos = apUtils.getTopologyExtraInfo(topology);
                if (xtraInfos["LT_DEVICES"]) {
                    var ltDevicesTopo = JSON.parse(xtraInfos["LT_DEVICES"]);
                    Object.keys(ltDevicesTopo).forEach(function (ltDevice) {
                        var boardType = boardPrefix + ltDevicesTopo[ltDevice]["planned-type"];

                        var isEthBoard = false;
                        isEthBoard = apCapUtils.isValueInCapability(configJson["hardware-type"], configJson["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, ltDevicesTopo[ltDevice]["planned-type"], "ETH");
                        var isBoardTypeLT = apCapUtils.isValueInCapability(configJson["hardware-type"], configJson["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.SLOT_TYPE, ltDevicesTopo[ltDevice]["planned-type"], "LT");
                        if(isEthBoard && isBoardTypeLT){
                            var deviceDetails = {};
                            deviceDetails["useProfileManager"] = true;
                            deviceDetails["deviceName"] = ntDeviceName;
                            deviceDetails["nodeType"] = configJson["hardware-type"] + "-" + configJson["device-version"];
                            deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
                            deviceDetails["intentTypeVersion"] = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, ntDeviceName);
                            deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);
                            var boardServiceProfile = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", ltDevicesTopo[ltDevice]["board-service-profile"], deviceDetails);
                            if(boardServiceProfile["model"] === "uplink-mode"){
                                boardType = boardType + "-" + intentConstants.UP_LINK_HW_TYPE_POSTFIX;
                            }else if(boardServiceProfile["model"] === "downlink-mode"){
                                boardType = boardType + "-" + intentConstants.DOWN_LINK_HW_TYPE_POSTFIX;
                            }
                        }

                        var boardVersion;
                        if (ltDevicesTopo[ltDevice]["device-version"] || ltDevicesTopo[ltDevice]["device-version"] != null) {
                            boardVersion = ltDevicesTopo[ltDevice]["device-version"];
                        } else {
                            boardVersion = configJson["device-version"];
                        }
                        var supportedType = apCapUtils.getCapabilityValue(boardType, boardVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.COMPATIBLE_BOARDS, ltDevicesTopo[ltDevice]["planned-type"], []);
                        if (configJson["boards"] && configJson["boards"][ltDevice]) {
                            if (supportedType.length > 0 && supportedType.indexOf(configJson["boards"][ltDevice]["planned-type"]) > -1) {
                                replacedLTs[ltDevice] = ltDevicesTopo[ltDevice];
                            }
                        }
                    });
                }
            }
            requestScope.get().put("replacedLTs", replacedLTs);
        }
        var removedLts = deviceManagerObj.getRemovedLts(ntDeviceName, topology, configJson["boards"], configJson["hardware-type"], configJson["device-version"]);
        if (removedLts && Object.keys(removedLts).length > 0) {
            //var currentBoards = JSON.parse(JSON.stringify(configJson["boards"]));
            Object.keys(removedLts).forEach(function (ltName) {
                allBoards[ltName] = removedLts[ltName];
            });
        }
        boards = Object.keys(allBoards);
        var deviceNetconfObject = [];
        if (boards.length > 0) {
            boards.forEach(function (board) {
                var plannedType = allBoards[board]["planned-type"];
                if (board.indexOf(intentConstants.FX_LT_STRING) === 0 && plannedType !== "-") {
                    //create LT device with each board
                    var deviceName = ntDeviceName + intentConstants.FX_DEVICE_SEPARATOR + board;
                    // update template object
                    var currentConfig = JSON.parse(JSON.stringify(configJson))
                    if (allBoards[board]["lt-device-template"]) {
                        currentConfig['device-template'] = allBoards[board]["lt-device-template"];
                    } else {
                        delete currentConfig['device-template'];
                    }
                    var boardServiceProfile = allBoards[board]["board-service-profile"];
                    currentConfig["hardware-type"] = deviceManagerObj.getiHUBAndLTHWTypeVersion(intentConstants.FX_LT_STRING, null, plannedType, lsPrefix, boardServiceProfile);
                    var isUplinkEthBoard = false;
                    var isEthBoard = false;
                    isEthBoard = apCapUtils.isValueInCapability(configJson["hardware-type"], configJson["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, plannedType, "ETH");
                    var isBoardTypeLT = apCapUtils.isValueInCapability(configJson["hardware-type"], configJson["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.SLOT_TYPE, plannedType, "LT");
                    if((isEthBoard && isBoardTypeLT)){
                        var deviceDetails = {};
                        deviceDetails["useProfileManager"] = true;
                        deviceDetails["deviceName"] = ntDeviceName;
                        deviceDetails["nodeType"] = configJson["hardware-type"] + "-" + configJson["device-version"];
                        deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
                        deviceDetails["intentTypeVersion"] = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, ntDeviceName);
                        deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);
                        var boardServiceProfileObj = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", boardServiceProfile, deviceDetails);
                        if(boardServiceProfileObj["model"] === "uplink-mode"){
                            currentConfig["hardware-type"] = currentConfig["hardware-type"] + "-" + intentConstants.UP_LINK_HW_TYPE_POSTFIX;
                            isUplinkEthBoard = true;
                        }else if(boardServiceProfileObj["model"] === "downlink-mode"){
                            currentConfig["hardware-type"] = currentConfig["hardware-type"] + "-" + intentConstants.DOWN_LINK_HW_TYPE_POSTFIX;
                        }
                    }

                    var ltDeviceVersion = allBoards[board]["device-version"];
                    if(ltDeviceVersion){
                        currentConfig["device-version"] = ltDeviceVersion;
                    }
                    currentConfig["ip-port"] = deviceManagerObj.ltBasePort + Number(board.replace(intentConstants.FX_LT_STRING, ""));
                    currentConfig["ip-port"] = currentConfig["ip-port"].toString();
                    if (currentConfig["duid"]) {
                        currentConfig["duid"] = currentConfig["duid"].replace(intentConstants.LS_NT_SHELF_DUID_POSTFIX, board);
                        delete currentConfig["duid2"];
                    } 
                    else if (currentConfig["duid2"]) {
                        currentConfig["duid"] = currentConfig["duid2"].replace(intentConstants.LS_NT_SHELF_DUID_POSTFIX, board);
                        delete currentConfig["duid2"];
                    }  
                    if(currentConfig["duidFromDevice"]){
                        if(currentConfig["duidFromDevice"][board]){
                            currentConfig["duid"] =currentConfig["duidFromDevice"][board];
                        } 
                        
                        
                    }                                     
                    if (allBoards[board]["active-software"]) {
                        currentConfig["active-software"] = allBoards[board]["active-software"];
                    } else {
                        delete currentConfig["active-software"];
                    }
                    if (allBoards[board]["passive-software"]) {
                        currentConfig["passive-software"] = allBoards[board]["passive-software"];
                    } else {
                        delete currentConfig["passive-software"];
                    }
                    var deviceInfo = {};
                    deviceInfo.name = deviceName;
                    var deviceNcObj = deviceManagerObj.createIntentConfigForSingleDevice(deviceInfo, requestScope.get().get("sync-input"), currentConfig, isUplinkEthBoard);
                    if (replacedLTs && replacedLTs[board]) {
                        var replacedSlot = replacedLTs[board]["slot-name"];
                        var newLtHardwareType = boardPrefix + currentConfig["boards"][replacedSlot]["planned-type"];
                        isUplinkEthBoard = false;
                        var isEthBoard = false;
                        isEthBoard = apCapUtils.isValueInCapability(configJson["hardware-type"], configJson["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, currentConfig["boards"][replacedSlot]["planned-type"], "ETH");
                        var isBoardTypeLT = apCapUtils.isValueInCapability(configJson["hardware-type"], configJson["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.SLOT_TYPE, currentConfig["boards"][replacedSlot]["planned-type"], "LT");
                        if(isEthBoard && isBoardTypeLT){
                            var deviceDetails = {};
                            deviceDetails["useProfileManager"] = true;
                            deviceDetails["deviceName"] = ntDeviceName;
                            deviceDetails["nodeType"] = configJson["hardware-type"] + "-" + configJson["device-version"];
                            deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
                            deviceDetails["intentTypeVersion"] = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, ntDeviceName);
                            deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);
                            var boardServiceProfileObj = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", currentConfig["boards"][replacedSlot]["board-service-profile"], deviceDetails);
                            if(boardServiceProfileObj["model"] === "uplink-mode"){
                                newLtHardwareType = newLtHardwareType + "-" + intentConstants.UP_LINK_HW_TYPE_POSTFIX;
                                isUplinkEthBoard = true;
                            }else if(boardServiceProfileObj["model"] === "downlink-mode"){
                                newLtHardwareType = newLtHardwareType + "-" + intentConstants.DOWN_LINK_HW_TYPE_POSTFIX;
                            }
                        }

                        currentConfig["hardware-type"] = newLtHardwareType;
                        var replacedDeviceNcObj = deviceManagerObj.createIntentConfigForSingleDevice(deviceInfo, requestScope.get().get("sync-input"), currentConfig, isUplinkEthBoard);
                        // Add a removed property for removed device
                        if (removedLts && removedLts[board]) {
                            deviceNcObj["removed"] = true;
                        }
                        var versionObj = requestScope.get().get("ltDeviceVersions");
                        versionObj[deviceName] = {
                            "version": currentConfig["device-version"],
                            "removed": replacedDeviceNcObj["removed"] ? true : false
                        };
                        deviceNetconfObject.push(deviceNcObj);
                        deviceNetconfObject.push(replacedDeviceNcObj);
                    } else {
                        // Add a removed property for removed device
                        if (removedLts && removedLts[board]) {
                            deviceNcObj["removed"] = true;
                        }
                        var versionObj = requestScope.get().get("ltDeviceVersions");
                        versionObj[deviceName] = {
                    		"version": currentConfig["device-version"], 
                    		"removed": deviceNcObj["removed"] ? true : false
                        };
                        deviceNetconfObject.push(deviceNcObj);
                    }
                }
            });
        }
        // Update current LT for future tracking.
        // In case of audit the result is null
        if(result) {
            apUtils.setTopologyExtraInfo(result.getTopology(), deviceManagerObj.LT_DEVICES_TOPO_NAME, JSON.stringify(currentBoards));
        }
        var localResult = synchronizeResultFactory.createSynchronizeResult();
        // Assume success during start. This is checked by updateSyncResult method.
        localResult.setSuccess(true);
        logger.debug("Intent SWMGMT swAlignment CR Initial localResult {}", apUtils.protectSensitiveDataLog(localResult));
        if (deviceNetconfObject && deviceNetconfObject.length > 0) {
            if (method === deviceManagerObj.sync) {
                // Sync Block
                var updateErrorCode;
                var updateErrorDetail;
                var trySync = true;
                deviceNetconfObject.forEach(function (intentObject) {
                    requestScope.get().put("isSubscribeToDeviceNotificationSupported", true);
                    try {
                        logger.debug("Intent SWMGMT swAlignment CR  intentObject {}", apUtils.protectSensitiveDataLog(intentObject));
                        var childNetconfFwk = new AltiplanoNetconfIntentHelper();
                        childNetconfFwk.setIntentObject(intentObject);
                        var input = syncInput;
                        // If the device removed , update the network state in the input
                        if (intentObject.removed) {
                            input = apUtils.cloneSyncInput(input);
                            input.setNetworkState(RequiredNetworkState.delete);
                        }
                        var currentResult = childNetconfFwk.synchronize(input);
                        logger.debug("Intent SWMGMT swAlignment CR Final currentResult {} ", apUtils.protectSensitiveDataLog(currentResult));
                        if (currentResult) {
                            apUtils.updateSyncResult(localResult, currentResult);
                            if(currentResult && currentResult != null){
                                var localResultErrorCode = localResult.getErrorCode();
                                var localResultErrorDetails = localResult.getErrorDetail();
                                if(typeof currentResult.getErrorCode === "function" && typeof currentResult.getErrorDetail === "function"){
                                    var currentErrorCode = currentResult.getErrorCode();
                                    if (currentErrorCode != null && currentResult.getErrorDetail() != null){
                                        updateErrorCode = currentErrorCode;
                                        updateErrorDetail = currentResult.getErrorDetail();
                                    } else if(localResultErrorCode && localResultErrorDetails){
                                        updateErrorCode = localResultErrorCode;
                                        updateErrorDetail = localResultErrorDetails;
                                    }
                                }
                            }
                        }
                    } catch (e) {
                        logger.error("Error while executing the LT intent object with stage name : {}", intentObject.stageName);
                        logger.error("Error while executing the LT intent object with stage name : {}", e);
                        localResult.setSuccess(false);
                        localResult.setErrorCode("ERR-100");
                        localResult.setErrorDetail(e);
                        trySync = false;
                    }
                });
                logger.debug("Intent SWMGMT swAlignment CR Final localResult updateErrorCode {} updateErrorDetail {}", updateErrorCode, updateErrorDetail);
                if(trySync){
                    if(!localResult.isSuccess()) {
                        localResult.setErrorCode(updateErrorCode);
                        localResult.setErrorDetail(updateErrorDetail);
                    }
                }
                logger.debug("Intent SWMGMT swAlignment CR Final localResult Updated {}", apUtils.protectSensitiveDataLog(localResult));
                return localResult;
            } else if (method === deviceManagerObj.audit) {
                // Audit block
                var auditReports = [];
                deviceNetconfObject.forEach(function (intentObject) {
                    try {
                        //TODO duplicate code
                        var childNetconfFwk = new AltiplanoNetconfIntentHelper();
                        childNetconfFwk.setIntentObject(intentObject);
                        var input = requestScope.get().get("sync-input");
                        // If the device removed , update the network state in the input
                        if (intentObject.removed) {
                            input = apUtils.cloneSyncInput(input);
                            input.setNetworkState(RequiredNetworkState.delete);
                        }
                        var currentReport = childNetconfFwk.audit(input);
                        if (currentReport) {
                            auditReports.push(currentReport);
                        }
                    } catch (e) {
                        logger.error("Error while executing the LT intent object audit with stage name : {}", intentObject.stageName);
                        logger.error("Error while executing the LT intent object with audit stage name : {}", e);
                        throw new RuntimeException(e);
                    }
                });
                return auditUtility.mergeAuditReports(auditReports);
            }
        }
    };
}
/**
 * This method is used to decide whether skip or proceed when have download operations on LT devices.
 * @param deviceName
 * @param configJson
 * @returns boolean
 */

VirtualizerDeviceManager.prototype.bailOutOnPassiveSwDwLoadForLSFX = function (deviceName, configJson, currentTopology) {
    if (configJson && configJson["boards"] && (configJson["active-software"] || configJson["passive-software"])) {
        var deviceInfos = mds.getAllInfoFromDevices(deviceName);
        if (deviceInfos == null || deviceInfos.isEmpty()) {
            if (!configJson["active-software"] && configJson["passive-software"]) {
                var result = this.enabledDownloadForLTDevices(deviceName, configJson, currentTopology);
                if (result) {
                    return result;
                }
            }
        } else {
            var xtraInfoSwMatches = this.getStepObjectForMatchingKey(currentTopology, deviceName, "swMatches");
            if (xtraInfoSwMatches) {
                if (xtraInfoSwMatches["active-software"]) {
                    var oldActiveSw = xtraInfoSwMatches["active-software"]["value"];
                }
            }
            // when upgrade NT device in processing, reject other download operations of LT devices.
            // configJson["active-software"] maybe a url or file-name and it finishes by activeSoftware.
            if (configJson["active-software"] && configJson["active-software"] !== oldActiveSw) {
                return false;
            } else if (configJson["passive-software"]) {
                //when no active software passed / present
                if (!configJson["active-software"] && configJson["passive-software"]) {
                    var result = this.enabledDownloadForLTDevices(deviceName, configJson, currentTopology);
                    if (result) {
                        return result;
                    }
                } else {
                    //when active software present but they are same as old active software
                    if(configJson["active-software"] && configJson["active-software"] == oldActiveSw){
                        var result = this.enabledDownloadForLTDevices(deviceName, configJson, currentTopology);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
        }
    }
    return false;
}

/**
 * This method is used to decide which Lt devices can be downloaded parrallel when the NT device upgrade/download.
 * @param deviceName
 * @param configJson
 * @param currentTopology
 * @returns boolean
 */
VirtualizerDeviceManager.prototype.enabledDownloadForLTDevices = function (deviceName, configJson, currentTopology) {
    var downloadBoard = [];
    var boards = configJson["boards"];
    for (var key in boards) {
        var ltDeviceName = deviceName + "." + boards[key]["slot-name"];
        var passiveSwLt = boards[key]["passive-software"];
        var activeSwLt = boards[key]["active-software"];
        if (passiveSwLt) {
            var deviceLtInfos = mds.getAllInfoFromDevices(ltDeviceName);
            if (!(deviceLtInfos == null || deviceLtInfos.isEmpty())) {
                var xtraInfoLTSwMatches = this.getStepObjectForMatchingKey(currentTopology, ltDeviceName, "swMatches");
                if (xtraInfoLTSwMatches) {
                    if (xtraInfoLTSwMatches["active-software"]) {
                        var oldActiveSwLt = xtraInfoLTSwMatches["active-software"]["value"];
                    }
                    if (xtraInfoLTSwMatches["passive-software"]) {
                        var oldPassiveSwLt = xtraInfoLTSwMatches["passive-software"]["value"];
                    }
                    if (oldPassiveSwLt != passiveSwLt &&
                        (!activeSwLt || (activeSwLt && oldActiveSwLt && activeSwLt === oldActiveSwLt))) {
                        downloadBoard.push(ltDeviceName);
                    }
                }
            } else if (!activeSwLt) {
                downloadBoard.push(ltDeviceName);
            }
        }
    }
    //downloadDevices: LT devices can be downloaded parallel with NT device
    requestScope.get().put("downloadDevices", downloadBoard);
    if (downloadBoard.length > 0) {
        //enableDownload: to distinguish LS-FX devices with other devices: LS-DF, LS-MX, LS-DPU
        requestScope.get().put("enableDownload", "true");
        return true
    }
}
/**
 * The method will create the devices in the below order,
 * 1) IHUB device (it's steps create device, plugMatch, backplane ports)
 * 2) Local IHUB device ( labels)
 * 3) NT device (it's steps create device, s/w , plugMatch, planBoards)
 * 4) Local NT device ( labels)
 * 5) Once the IHUB and NT success , The LT's created as part of postSync.
 * 6) LT's created with following steps create-device, s/w , plugMatch
 * 7) All the LT's audited using the POST audit
 *
 *  Here the IHUB created first , the reason is the NT s/w image upgrade bail out the sync, so we can't create IHUB device.
 *
 * @param deviceInfo (NT Info)
 * @param input ( intent input)
 * @param configObject ( The parsed value of intent configuration object with NT, IHUB, LT's , Lables , Software etc)
 * @returns intentObject
 */
VirtualizerDeviceManager.prototype.createIntentConfigForLSFX = function (deviceInfo, input, configObject) {
    var deviceManagerObj = this;
    var deviceName = deviceInfo.name;
    var currentTopology = input.getCurrentTopology();
    var deviceVersion = configObject["device-version"];
    var networkState = input.getNetworkState().name();
    // iHUB
    var iHubDeviceName = deviceName + intentConstants.FX_DEVICE_SEPARATOR + intentConstants.LS_FX_IHUB;    
    if(configObject["duidFromDevice"] && configObject["duidFromDevice"]["callHome"]){
        if(configObject["duidFromDevice"]["duid"]){
            configObject["duid"] =configObject["duidFromDevice"]["duid"];
        }
        if(configObject["duidFromDevice"]["duid2"]){
            configObject["duid2"] =configObject["duidFromDevice"]["duid2"];
        }       
    }
    // Create a new object with replace old values with new value
    var iHubConfigObject = JSON.parse(JSON.stringify(configObject));
    iHubConfigObject["hardware-type"] = this.getiHUBAndLTHWTypeVersion(intentConstants.LS_FX_IHUB, iHubConfigObject["hardware-type"], null);
    iHubConfigObject["shelf-hardware-type"] = configObject["hardware-type"];
    iHubConfigObject["device-template"] = iHubConfigObject["ihub-device-template"];
    iHubConfigObject["ip-port"] = this.ihubPort.toString();
    if(iHubConfigObject["ihub-version"]){
        iHubConfigObject["isIhubVersionConfigured"] = true;
    }
    if (iHubConfigObject["duid"]) {
        iHubConfigObject["duid"] = iHubConfigObject["duid"].replace(intentConstants.LS_NT_SHELF_DUID_POSTFIX, intentConstants.LS_NT_IHUB_DUID_POSTFIX);
    }
    if (iHubConfigObject["duid2"]) {
        iHubConfigObject["duid2"] = iHubConfigObject["duid2"].replace(intentConstants.LS_NT_SHELF_DUID_POSTFIX, intentConstants.LS_NT_IHUB_DUID_POSTFIX);
    }
    // Create I-HUB with standard steps ( with out s/w upgrade)
    var remoteDeviceiHUB = this.constructRemoteDeviceStepObject(iHubDeviceName, iHubConfigObject, currentTopology, 1, false);
    //Enable or Disable cal home container based on connection type
    if(iHubConfigObject["ihub-version"]){
       var isDuidSupported = apCapUtils.getCapabilityValue(iHubConfigObject["hardware-type"], iHubConfigObject["ihub-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DUID_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
    } else {
        var isDuidSupported = apCapUtils.getCapabilityValue(iHubConfigObject["hardware-type"], iHubConfigObject["device-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DUID_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
    }
    if (isDuidSupported && networkState != "delete") {
        var configCallHomeContainerStep = this.constructCallHomeContainerStepObject(iHubDeviceName, iHubConfigObject, currentTopology);
        remoteDeviceiHUB.steps.push(configCallHomeContainerStep);
    }

    var isNodeIpSupported = this.isNodeIpSupportedCaps(configObject, currentTopology, iHubDeviceName, iHubConfigObject);
    if (isNodeIpSupported && networkState != "delete") {
        var configNodeIpStep = this.constructNodeIpStepObject(iHubDeviceName, iHubConfigObject, currentTopology);
        remoteDeviceiHUB.steps.push(configNodeIpStep);
    }

    var boardPrefix = "LS-FX-";
    var replacedLTs = {};
    if (currentTopology && currentTopology.getXtraInfo() !== null && !currentTopology.getXtraInfo().isEmpty()) {
        var xtraInfos = apUtils.getTopologyExtraInfo(currentTopology);
        if (xtraInfos["LT_DEVICES"]) {
            var ltDevicesTopo = JSON.parse(xtraInfos["LT_DEVICES"]);
            Object.keys(ltDevicesTopo).forEach(function (ltDevice) {
                var boardType = boardPrefix + ltDevicesTopo[ltDevice]["planned-type"];
                var isEthBoard = false;
                isEthBoard = apCapUtils.isValueInCapability(configObject["hardware-type"], configObject["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, ltDevicesTopo[ltDevice]["planned-type"], "ETH");
                var isBoardTypeLT = apCapUtils.isValueInCapability(configObject["hardware-type"], configObject["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.SLOT_TYPE, ltDevicesTopo[ltDevice]["planned-type"], "LT");
                if(isEthBoard && isBoardTypeLT){
                    var deviceDetails = {};
                    deviceDetails["useProfileManager"] = true;
                    deviceDetails["deviceName"] = deviceName;
                    deviceDetails["nodeType"] = configObject["hardware-type"] + "-" + configObject["device-version"];
                    deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
                    deviceDetails["intentTypeVersion"] = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
                    deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);

                    var boardServiceProfileObj = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", ltDevicesTopo[ltDevice]["board-service-profile"], deviceDetails);
                    if(boardServiceProfileObj["model"] === "uplink-mode"){
                        boardType = boardType + "-" + intentConstants.UP_LINK_HW_TYPE_POSTFIX;
                    }else if(boardServiceProfileObj["model"] === "downlink-mode"){
                        boardType = boardType + "-" + intentConstants.DOWN_LINK_HW_TYPE_POSTFIX;
                    }
                }

                var boardVersion;
                if (ltDevicesTopo[ltDevice]["device-version"] || ltDevicesTopo[ltDevice]["device-version"] != null) {
                    boardVersion = ltDevicesTopo[ltDevice]["device-version"];
                } else {
                    boardVersion = configObject["device-version"];
                }
                var supportedType = apCapUtils.getCapabilityValue(boardType, boardVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.COMPATIBLE_BOARDS, ltDevicesTopo[ltDevice]["planned-type"], []);
                if (configObject["boards"] && configObject["boards"][ltDevice]) {
                    if (supportedType.length > 0 && supportedType.indexOf(configObject["boards"][ltDevice]["planned-type"]) > -1) {
                        replacedLTs[ltDevice] = ltDevicesTopo[ltDevice];
                    }
                }
            });
        }
    }
    requestScope.get().put("replacedLTs", replacedLTs);
    // Update backplane ports
    var ltPortsStep = this.constructIHUBLtPortsStepObject(iHubDeviceName, iHubConfigObject, currentTopology);

    var isDeviceCreated = false;
    if (currentTopology && currentTopology.getTarget() &&  currentTopology.getTopologyObjects().length > 0) {
        var deviceInfos = mds.getAllInfoFromDevices(deviceName);
        if (deviceInfos != null && !deviceInfos.isEmpty()) {
            isDeviceCreated = true;
        }
    }

    if (isDeviceCreated) {
        var xtraDeviceVersionNT = apUtils.getTopologyExtraInfoFromTopology(currentTopology, "DEVICE_VERSION_" + deviceName, "device-version");
        //Just push step config lt port for IHUB when config device version is same as device version in xtraTopo
        if (xtraDeviceVersionNT && xtraDeviceVersionNT == configObject["device-version"]) {
            remoteDeviceiHUB.steps.push(ltPortsStep);
        }
    } else {
        remoteDeviceiHUB.steps.push(ltPortsStep);
    }

    //Check if we need to proceed for download parallel on LT devices
    var bailOutOnPassiveSwDwLoad = this.bailOutOnPassiveSwDwLoadForLSFX(deviceName, configObject, currentTopology);
    // NT
    // Create NT with standard steps
    var remoteDeviceNT = this.constructRemoteDeviceStepObject(deviceName, configObject, currentTopology, 4, true, bailOutOnPassiveSwDwLoad);
    // Add plan board step for NT
    var planBoardStep = this.constructPlanBoardStepObject(deviceName, configObject, currentTopology, false, configObject["device-version"]);
    remoteDeviceNT.steps.push(planBoardStep);
    // Create NT local device.
    var manager = configObject[this.deviceManagerName];
    //This value 'ManagerInvolved' used in postSync for mds sync and disable the debug log
    requestScope.get().put("ManagerInvolved", manager);
    // Lock devices on major upgrade , the value used to lock the IHUB when NT get upgrade
    var pairDevice = {}
    pairDevice[deviceName] = iHubDeviceName;
    requestScope.get().put("pairDevice", pairDevice);
    var syncDependents = this.getSyncDepedencyInfoForOamConnectivity(deviceName, configObject, currentTopology);
    return {
        targetDelimiter: "#",
        stageName: "NT-iHUB-" + deviceInfo.name,
        getKeyForList: deviceManagerObj.getKeyForList,
        trackedArgs: {
            "device-version": true,
            "label": true,
            "trust-anchors": true,
            "act-url": true,
            "pass-url": true,
            "trans-url": true,
            "act-file-on-server": true,
            "pass-file-on-server": true,
            "trans-file-on-server": true,
            "transformationSoftware": true,
            "target-transformation-software": true,
            "boardlist": true,
            "boards": true,
            "eonuImages": true,
            "eonu-release": true,
            "eonuVendorSpecificImages" : true,
            "externalAlarmNames" : true,
            "inputScanPoints" : true,
            "outputScanPoints" : true,
            "timezone-name" : true
        },
        syncDependents: syncDependents.syncDependent,
        explicitlyUpdateDependentIntents: syncDependents.explicitlyUpdateDependentIntents,
        dependencyArgs: {
            "slot-name": true,
            "planned-type": true
        },
        forceStoreTopology: true,
        skipAttributeInXtraInfo: ["navDeviceSpecificData"],
        getDeviceIds: function (target, intentConfigXml, intentConfigJson, topology) {
            if (manager != null) {
                apUtils.checkManagerConnectivityStateForManager(manager);
            }
            var devices = {};
            // Add IHUB device
            devices[remoteDeviceiHUB.name] = remoteDeviceiHUB;

            // Add NT device
            devices[remoteDeviceNT.name] = remoteDeviceNT;
            return devices;
        },
        getDependencyProfiles: function (intentConfigJson, deviceId) {
            if(deviceInfo.managerType == intentConstants.MANAGER_TYPE_NAV){
                var dependentProfilesList = [];
                var profilesFx = {};
                var nodeType=[intentConfigJson["hardware-type"], intentConfigJson["device-version"]].join('-');
                deviceInfo.familyTypeRelease = nodeType;
                if (apCapUtils.checkIfProfileManagerIsEnabled(deviceInfo.familyTypeRelease) === true) {
                    profilesFx["allProfilesFx"] = requestScope.get().get("allProfiles");
                    dependentProfilesList = getProfilesAndDependencyInfos(deviceInfo, input.getIntentTypeVersion(),intentConfigJson,profilesFx);
                }
                return dependentProfilesList;
            }  
        },
        // postSync added with callback, all the LT related operation happen in postSync
        postSynchronize: deviceManagerObj.postSynchronize(deviceManagerObj.createIntentConfigForLTBoards(deviceName, configObject, currentTopology, deviceManagerObj.sync), deviceName,remoteDeviceiHUB.name),
        postAudit: function (target, intentConfigJson, networkState, topology, auditReport) {
            /**
             * Post audit provide the consolidated audit support with LTs.
             * The post audit only work on audit , this won't called on sync.
             */
            try {
                // calling all the lt's and get the consolidated audit report.
                var callAuditReport = (deviceManagerObj.createIntentConfigForLTBoards(deviceName, configObject, currentTopology, deviceManagerObj.audit))();
            } catch (e) {
                logger.error("error while executing the post Audit call back method :{} ", e);
                throw new RuntimeException("error while executing the post audit call back method");
            }
            logger.info("call NT post Audit call back over");
            // update the actual audit report with LT audit report.
            if (callAuditReport) {
                auditReport.getMisAlignedAttributes().addAll(callAuditReport.getMisAlignedAttributes());
                auditReport.getMisAlignedObjects().addAll(callAuditReport.getMisAlignedObjects());
            }
        }
    };
}

/**
 * The method will create the devices in the below order, (From 21.9 IHUB's supported)
 * 1) IHUB device (it's steps create device, plugMatch, backplane ports)
 * 2) Local IHUB device ( labels)
 * 3) NT device (it's steps create device, s/w , plugMatch, planBoards)
 * 4) Local NT device ( labels)
 * 5) Once the IHUB and NT success , The LT's created as part of postSync.
 * 6) LT's created with following steps create-device, s/w , plugMatch
 * 7) All the LT's audited using the POST audit
 *
 *  Here the IHUB created first , the reason is the NT s/w image upgrade bail out the sync, so we can't create IHUB device.
 *
 * @param deviceInfo (NT Info)
 * @param input ( intent input)
 * @param configObject ( The parsed value of intent configuration object with NT, IHUB, LT's , Lables , Software etc)
 * @returns intentObject
 */
VirtualizerDeviceManager.prototype.createIntentConfigForLSMF = function (deviceInfo, input, configObject) {
    var deviceManagerObj = this;
    var deviceName = deviceInfo.name;
    var currentTopology = input.getCurrentTopology();
    var requestContext = requestScope.get();
    var isIhubSupported = requestContext.get("isIhubSupported");
    var ihubName;
    var deviceVersion = configObject["device-version"];
    var networkState = input.getNetworkState().name();
    var boardPrefix = "LS-MF-";
    var replacedLTs = {};
    if (currentTopology && currentTopology.getXtraInfo() !== null && !currentTopology.getXtraInfo().isEmpty()) {
        var xtraInfos = apUtils.getTopologyExtraInfo(currentTopology);
        if (xtraInfos["LT_DEVICES"]) {
            var ltDevicesTopo = JSON.parse(xtraInfos["LT_DEVICES"]);
            Object.keys(ltDevicesTopo).forEach(function (ltDevice) {
                var boardType = boardPrefix + ltDevicesTopo[ltDevice]["planned-type"];
                var boardVersion;
                if (ltDevicesTopo[ltDevice]["device-version"] || ltDevicesTopo[ltDevice]["device-version"] != null) {
                    boardVersion = ltDevicesTopo[ltDevice]["device-version"];
                } else {
                    boardVersion = configObject["device-version"];
                }
                var supportedType = apCapUtils.getCapabilityValue(boardType, boardVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.COMPATIBLE_BOARDS, ltDevicesTopo[ltDevice]["planned-type"], []);
                if (configObject["boards"] && configObject["boards"][ltDevice]) {
                    if (supportedType.length > 0 && supportedType.indexOf(configObject["boards"][ltDevice]["planned-type"]) > -1) {
                        replacedLTs[ltDevice] = ltDevicesTopo[ltDevice];
                    }
                }
            });
        }
    }
    requestScope.get().put("replacedLTs", replacedLTs);
    if (isIhubSupported) {
        var iHubDeviceName = deviceName + intentConstants.DEVICE_SEPARATOR + intentConstants.LS_IHUB;
        if (configObject["duidFromDevice"] && configObject["duidFromDevice"]["callHome"]) {
            if (configObject["duidFromDevice"]["duid"]){
                configObject["duid"] = configObject["duidFromDevice"]["duid"];
            }
            if (configObject["duidFromDevice"]["duid2"]){
                configObject["duid2"] = configObject["duidFromDevice"]["duid2"];
            }
        }
        // Create a new object with replace old values with new value.
        var iHubConfigObject = JSON.parse(JSON.stringify(configObject));
        configObject["isIhubSupported"] = true;
        iHubConfigObject["shelf-hardware-type"] = configObject["hardware-type"];
        iHubConfigObject["hardware-type"] = this.getiHUBAndLTHWTypeVersion(intentConstants.LS_IHUB, iHubConfigObject["hardware-type"], null);
        iHubConfigObject["device-template"] = iHubConfigObject["ihub-device-template"];
        iHubConfigObject["ip-port"] = this.ihubPort.toString();
        if(iHubConfigObject["ihub-version"]){
            iHubConfigObject["isIhubVersionConfigured"] = true;
        }
        if (iHubConfigObject["duid"]) {
             iHubConfigObject["duid"] = iHubConfigObject["duid"].replace(intentConstants.LS_NT_SHELF_DUID_POSTFIX, intentConstants.LS_NT_IHUB_DUID_POSTFIX);
    	}
         if (iHubConfigObject["duid2"]) {
             iHubConfigObject["duid2"] = iHubConfigObject["duid2"].replace(intentConstants.LS_NT_SHELF_DUID_POSTFIX, intentConstants.LS_NT_IHUB_DUID_POSTFIX);
        }
        
        // Create I-HUB with standard steps ( with out s/w upgrade)
        var remoteDeviceiHUB = this.constructRemoteDeviceStepObject(iHubDeviceName, iHubConfigObject, currentTopology, 1, false);
        //Enable or Disable cal home container based on connection type
        if(iHubConfigObject["ihub-version"]){
            var isDuidSupported = apCapUtils.getCapabilityValue(iHubConfigObject["hardware-type"], iHubConfigObject["ihub-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DUID_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
        } else {
            var isDuidSupported = apCapUtils.getCapabilityValue(iHubConfigObject["hardware-type"], iHubConfigObject["device-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DUID_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
        }
        if (isDuidSupported && networkState != "delete") {
            var configCallHomeContainerStep = this.constructCallHomeContainerStepObject(iHubDeviceName, iHubConfigObject, currentTopology);
            remoteDeviceiHUB.steps.push(configCallHomeContainerStep);
        }

        var isNodeIpSupported = this.isNodeIpSupportedCaps(configObject, currentTopology, iHubDeviceName, iHubConfigObject);
        if (isNodeIpSupported && networkState != "delete") {
            var configNodeIpStep = this.constructNodeIpStepObject(iHubDeviceName, iHubConfigObject, currentTopology);
            remoteDeviceiHUB.steps.push(configNodeIpStep);
        }

        // Update backplane ports
        var ltPortsStep = this.constructIHUBLtPortsStepObject(iHubDeviceName, iHubConfigObject, currentTopology);

        var isDeviceCreated = true;
        if ((!currentTopology || (currentTopology && !(currentTopology.getTarget())))) {
            var deviceInfos = mds.getAllInfoFromDevices(deviceName);
            if (deviceInfos == null || deviceInfos.isEmpty()) {
                var isDeviceCreated = false;
            }
        }

        if (isDeviceCreated) {
            var xtraDeviceVersionNT = apUtils.getTopologyExtraInfoFromTopology(currentTopology, "DEVICE_VERSION_" + deviceName, "device-version");
            //Just push step config lt port for IHUB when config device version is same as device version in xtraTopo
            if (xtraDeviceVersionNT && xtraDeviceVersionNT == configObject["device-version"]) {
                remoteDeviceiHUB.steps.push(ltPortsStep);
            }
        } else {
            remoteDeviceiHUB.steps.push(ltPortsStep);
        }

        // Create I-HUB local device.
        ihubName =  remoteDeviceiHUB.name;
    }
    //Check if we need to proceed for download parallel on LT devices
    var bailOutOnPassiveSwDwLoad = this.bailOutOnPassiveSwDwLoadForLSFX(deviceName, configObject, currentTopology);
    // NT
    // Create NT with standard steps
    var remoteDeviceNT = this.constructRemoteDeviceStepObject(deviceName, configObject, currentTopology, 4, true, bailOutOnPassiveSwDwLoad);
    // Add plan board step for NT - pass true for skipACUNTIO to skip ACU & NTIO in case of LMNT-A/LMNT-B
    var isSkipAcuNtio = false;
    if (configObject["hardware-type"] && configObject["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT)) {
        isSkipAcuNtio = true;
    }
    var planBoardStep = this.constructPlanBoardStepObject(deviceName, configObject, currentTopology, isSkipAcuNtio, configObject["device-version"]);
    remoteDeviceNT.steps.push(planBoardStep);
    // Create NT local device.

    var manager = configObject[this.deviceManagerName];
    //This value 'ManagerInvolved' used in postSync for mds sync and disable the debug log
    requestScope.get().put("ManagerInvolved", manager);
    
    // Lock devices on major upgrade , the value of pairDevice used to lock the IHUB when NT get upgrade       
    var supportedDeviceTypes = intentConstants.LS_MF_SUPPORTED_NT_DEVICES;
    var oldDeviceVersionNT = apUtils.getTopologyExtraInfoFromTopology(currentTopology, "DEVICE_VERSION_" + deviceName, "device-version");
    var newDeviceVersionNT = configObject["device-version"];    
    var oldHwTypeNT = apUtils.getTopologyExtraInfoFromTopology(currentTopology, "HARDWARE_TYPE_" + deviceName, "hardware-type");
    var newHwTypeNT = configObject["hardware-type"];
    if(!oldHwTypeNT){
        oldHwTypeNT = newHwTypeNT;
    }
    var oldfamilyTypeRelease = oldHwTypeNT+"-"+oldDeviceVersionNT;
    var newfamilyTypeRelease = newHwTypeNT+"-"+newDeviceVersionNT;  
    if(isIhubSupported){
          if((apUtils.isMFsupportsIhub(oldfamilyTypeRelease, null, supportedDeviceTypes) === true)&& (apUtils.isMFsupportsIhub(newfamilyTypeRelease, null, supportedDeviceTypes) === true)){        
            var pairDevice = {}
            pairDevice[deviceName] = iHubDeviceName;
            requestScope.get().put("pairDevice", pairDevice);
        }
    }
    var syncDependents = this.getSyncDepedencyInfoForOamConnectivity(deviceName, configObject, currentTopology);
    return {
        targetDelimiter: "#",
        stageName: "NT-" + deviceInfo.name,
        getKeyForList: deviceManagerObj.getKeyForList,
        trackedArgs: {
            "device-version": true,
            "label": true,
            "trust-anchors": true,
            "act-url": true,
            "pass-url": true,
            "act-file-on-server": true,
            "pass-file-on-server": true,
            "boardlist": true,
            "boards": true,
            "eonuImages": true,
            "eonu-release": true,
            "eonuVendorSpecificImages" : true,
            "externalAlarmNames" : true,
            "inputScanPoints" : true,
            "outputScanPoints" : true,
            "timezone-name" : true
        },
        syncDependents: syncDependents.syncDependent,
        explicitlyUpdateDependentIntents: syncDependents.explicitlyUpdateDependentIntents,
        dependencyArgs: {
            "slot-name": true,
            "planned-type": true
        },
        forceStoreTopology: true,
        skipAttributeInXtraInfo: ["navDeviceSpecificData"],
        getDeviceIds: function (target, intentConfigXml, intentConfigJson, topology) {
            if (manager != null) {
                apUtils.checkManagerConnectivityStateForManager(manager);
            }
            var devices = {};
            // Add IHUB device
            if (isIhubSupported) {
                devices[remoteDeviceiHUB.name] = remoteDeviceiHUB;
            }

            // Add NT device
            devices[remoteDeviceNT.name] = remoteDeviceNT;

            return devices;
        },
        getDependencyProfiles: function (intentConfigJson, deviceId) {  
            if(deviceInfo.managerType == intentConstants.MANAGER_TYPE_NAV){
                var dependentProfilesList = [];
                var profilesMf = {};
                var nodeType = [intentConfigJson["hardware-type"], intentConfigJson["device-version"]].join('-');
                deviceInfo.familyTypeRelease = nodeType;
                if(apCapUtils.checkIfProfileManagerIsEnabled(deviceInfo.familyTypeRelease) === true){
                    profilesMf["allProfilesMf"] = requestScope.get().get("allProfiles");
                    dependentProfilesList = getProfilesAndDependencyInfos(deviceInfo, input.getIntentTypeVersion(), intentConfigJson, deviceInfo.managerType,profilesMf);
                }
                return dependentProfilesList;
            }
        },
        // postSync added with callback, all the LT related operation happen in postSync - pass MF Prefix for MF
        postSynchronize: deviceManagerObj.postSynchronize(deviceManagerObj.createIntentConfigForLTBoards(deviceName, configObject, currentTopology, deviceManagerObj.sync, intentConstants.LS_MF_PREFIX), deviceName,ihubName),
        postAudit: function (target, intentConfigJson, networkState, topology, auditReport) {
            /**
             * Post audit provide the consolidated audit support with LTs.
             * The post audit only work on audit , this won't be called on sync.
             */
            try {
                // calling all the lt's and get the consolidated audit report.
                var callAuditReport = (deviceManagerObj.createIntentConfigForLTBoards(deviceName, configObject, currentTopology, deviceManagerObj.audit, intentConstants.LS_MF_PREFIX))();
            } catch (e) {
                logger.error("error while executing the post Audit call back method :{} ", e);
                throw new RuntimeException("error while executing the post audit call back method");
            }
            logger.info("call NT post Audit call back over");
            // update the actual audit report with LT audit report.
            if (callAuditReport) {
                auditReport.getMisAlignedAttributes().addAll(callAuditReport.getMisAlignedAttributes());
                auditReport.getMisAlignedObjects().addAll(callAuditReport.getMisAlignedObjects());
            }
        }
    };
}

/**
 * This method will create the devices in the below order,
 * 1) IHUB device (it's steps create device, plugMatch, backplane ports)
 * 2) Local IHUB device ( labels)
 * 3) NT device (it's steps create device, s/w , plugMatch, planBoards)
 * 4) Local NT device ( labels)
 * 5) Once the IHUB and NT success , The LT is created as a part of postSync.
 * 6) LT is created with the following steps: create-device, s/w , plugMatch
 * 7) LT is audited using the POST audit
 *
 *  Here the IHUB created first , the reason is the NT s/w image upgrade bail out the sync, so we can't create IHUB device.
 *
 * @param deviceInfo (NT Info)
 * @param input ( intent input)
 * @param configObject ( The parsed value of intent configuration object with NT, IHUB, LT's , Lables , Software etc)
 * @returns intentObject
 */
VirtualizerDeviceManager.prototype.createIntentConfigForLSSF = function (deviceInfo, input, configObject) {
    var deviceManagerObj = this;
    var deviceName = deviceInfo.name;
    var currentTopology = input.getCurrentTopology();
    var networkState = input.getNetworkState().name();
    var iHubDeviceName = deviceName + intentConstants.DEVICE_SEPARATOR + intentConstants.LS_IHUB;    
    if(configObject["duidFromDevice"] && configObject["duidFromDevice"]["callHome"]){
        configObject["duid"] =configObject["duidFromDevice"]["duid"];
        configObject["duid2"] =configObject["duidFromDevice"]["duid2"];
    }
    // Create a new object with replace old values with new value.
    var iHubConfigObject = JSON.parse(JSON.stringify(configObject));
    iHubConfigObject["shelf-hardware-type"] = configObject["hardware-type"];
    iHubConfigObject["hardware-type"] = this.getiHUBAndLTHWTypeVersion(intentConstants.LS_IHUB, iHubConfigObject["hardware-type"], null);
    iHubConfigObject["device-template"] = iHubConfigObject["ihub-device-template"];
    iHubConfigObject["ip-port"] = this.ihubPort.toString();
    if(iHubConfigObject["ihub-version"]){
        iHubConfigObject["isIhubVersionConfigured"] = true;
    }
    if (iHubConfigObject["duid"]) {
        iHubConfigObject["duid"] = iHubConfigObject["duid"].replace(intentConstants.LS_NT_SHELF_DUID_POSTFIX, intentConstants.LS_NT_IHUB_DUID_POSTFIX);
    }
    if (iHubConfigObject["duid2"]) {
        iHubConfigObject["duid2"] = iHubConfigObject["duid2"].replace(intentConstants.LS_NT_SHELF_DUID_POSTFIX, intentConstants.LS_NT_IHUB_DUID_POSTFIX);
    }
    // Create I-HUB with standard steps ( with out s/w upgrade)
    var remoteDeviceiHUB = this.constructRemoteDeviceStepObject(iHubDeviceName, iHubConfigObject, currentTopology, 1, false);
    //Enable or Disable cal home container based on connection type
    if(iHubConfigObject["ihub-version"]){
        var isDuidSupported = apCapUtils.getCapabilityValue(iHubConfigObject["hardware-type"], iHubConfigObject["ihub-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DUID_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
    } else {
        var isDuidSupported = apCapUtils.getCapabilityValue(iHubConfigObject["hardware-type"], iHubConfigObject["device-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DUID_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
    }
    if (isDuidSupported && networkState != "delete") {
        var configCallHomeContainerStep = this.constructCallHomeContainerStepObject(iHubDeviceName, iHubConfigObject, currentTopology);
        remoteDeviceiHUB.steps.push(configCallHomeContainerStep);
    }

    var isNodeIpSupported = this.isNodeIpSupportedCaps(configObject, currentTopology, iHubDeviceName, iHubConfigObject);
    if (isNodeIpSupported && networkState != "delete") {
        var configNodeIpStep = this.constructNodeIpStepObject(iHubDeviceName, iHubConfigObject, currentTopology);
        remoteDeviceiHUB.steps.push(configNodeIpStep);
    }
    // Update backplane ports
    var ltPortsStep = this.constructIHUBLtPortsStepObject(iHubDeviceName, iHubConfigObject, currentTopology);

    var isDeviceCreated = true;
    if ((!currentTopology || (currentTopology && !(currentTopology.getTarget())))) {
        var deviceInfos = mds.getAllInfoFromDevices(deviceName);
        if (deviceInfos == null || deviceInfos.isEmpty()) {
            isDeviceCreated = false;
        }
    }

    if (isDeviceCreated) {
        var xtraDeviceVersionNT = apUtils.getTopologyExtraInfoFromTopology(currentTopology, "DEVICE_VERSION_" + deviceName, "device-version");
        //Just push step config lt port for IHUB when config device version is same as device version in xtraTopo
        if (xtraDeviceVersionNT && xtraDeviceVersionNT === configObject["device-version"]) {
            remoteDeviceiHUB.steps.push(ltPortsStep);
        }
    } else {
        remoteDeviceiHUB.steps.push(ltPortsStep);
    }

    //Check if we need to proceed for download parallel on LT devices
    var bailOutOnPassiveSwDwLoad = this.bailOutOnPassiveSwDwLoadForLSFX(deviceName, configObject, currentTopology);
    // NT
    // Create NT with standard steps
    var remoteDeviceNT = this.constructRemoteDeviceStepObject(deviceName, configObject, currentTopology, 4, true, bailOutOnPassiveSwDwLoad);
    // Add plan board step for NT - pass true for skipACUNTIO to skip ACU & NTIO
    var planBoardStep = this.constructPlanBoardStepObject(deviceName, configObject, currentTopology, true, configObject["device-version"]);
    remoteDeviceNT.steps.push(planBoardStep);

    var manager = configObject[this.deviceManagerName];
    //This value 'ManagerInvolved' used in postSync for mds sync and disable the debug log
    requestScope.get().put("ManagerInvolved", manager);

    var pairDevice = {}
    pairDevice[deviceName] = iHubDeviceName;
    requestScope.get().put("pairDevice", pairDevice);
    var syncDependents = this.getSyncDepedencyInfoForOamConnectivity(deviceName, configObject, currentTopology);
    return {
        targetDelimiter: "#",
        stageName: "NT-" + deviceInfo.name,
        getKeyForList: deviceManagerObj.getKeyForList,
        trackedArgs: {
            "device-version": true,
            "label": true,
            "trust-anchors": true,
            "act-url": true,
            "pass-url": true,
            "act-file-on-server": true,
            "pass-file-on-server": true,
            "boardlist": true,
            "boards": true,
            "eonuImages": true,
            "eonu-release": true,
            "eonuVendorSpecificImages" : true,
            "externalAlarmNames" : true,
            "inputScanPoints" : true,
            "outputScanPoints" : true,
            "timezone-name" : true
        },
        syncDependents: syncDependents.syncDependent,
        explicitlyUpdateDependentIntents: syncDependents.explicitlyUpdateDependentIntents,
        dependencyArgs: {
            "slot-name": true,
            "planned-type": true
        },
        forceStoreTopology: true,
        skipAttributeInXtraInfo: ["navDeviceSpecificData"],
        getDeviceIds: function (target, intentConfigXml, intentConfigJson, topology) {
            if (manager != null) {
                apUtils.checkManagerConnectivityStateForManager(manager);
            }
            var devices = {};
            // Add IHUB device
            devices[remoteDeviceiHUB.name] = remoteDeviceiHUB;

            // Add NT device
            devices[remoteDeviceNT.name] = remoteDeviceNT;

            return devices;
        },
        getDependencyProfiles: function (intentConfigJson, deviceId) {
            if(deviceInfo.managerType == intentConstants.MANAGER_TYPE_NAV){
                var dependentProfilesList = [];
                var profilesSf = {};
                var nodeType=[intentConfigJson["hardware-type"], intentConfigJson["device-version"]].join('-');
                deviceInfo.familyTypeRelease = nodeType;
                if (apCapUtils.checkIfProfileManagerIsEnabled(deviceInfo.familyTypeRelease) === true) {
                    profilesSf["allProfilesSf"] = requestScope.get().get("allProfiles");
                    dependentProfilesList = getProfilesAndDependencyInfos(deviceInfo, input.getIntentTypeVersion(),intentConfigJson,profilesSf);
                }
                return dependentProfilesList;
            }  
        },
        // postSync added with callback, all the LT related operation happen in postSync
        postSynchronize: deviceManagerObj.postSynchronize(deviceManagerObj.createIntentConfigForLTBoards(deviceName, configObject, currentTopology, deviceManagerObj.sync, intentConstants.LS_SF_PREFIX), deviceName,remoteDeviceiHUB.name),
        postAudit: function (target, intentConfigJson, networkState, topology, auditReport) {
            /**
             * Post audit provide the consolidated audit support with LTs.
             * The post audit only work on audit , this won't be called on sync.
             */
            try {
                // calling all the lt's and get the consolidated audit report.
                var callAuditReport = (deviceManagerObj.createIntentConfigForLTBoards(deviceName, configObject, currentTopology, deviceManagerObj.audit, intentConstants.LS_SF_PREFIX))();
            } catch (e) {
                logger.error("error while executing the post Audit call back method :{} ", e);
                throw new RuntimeException("error while executing the post audit call back method");
            }
            logger.info("call NT post Audit call back over");
            // update the actual audit report with LT audit report.
            if (callAuditReport) {
                auditReport.getMisAlignedAttributes().addAll(callAuditReport.getMisAlignedAttributes());
                auditReport.getMisAlignedObjects().addAll(callAuditReport.getMisAlignedObjects());
            }
        }
    };
}

/**
 * The method will create the devices in the below order,
 * 1) device (it's steps create device, s/w , plugMatch, planBoards)
 * 2) Local device ( labels)
 *
 * @param deviceInfo (device Info)
 * @param input ( intent input)
 * @param configObject ( The parsed value of intent configuration object)
 * @returns intentObject
 */
 VirtualizerDeviceManager.prototype.createIntentConfigForLsDf = function (deviceInfo, input, configObject) {
    var deviceManagerObj = this;
    var deviceName = deviceInfo.name;
    var currentTopology = input.getCurrentTopology();
    var deviceVersion = configObject["device-version"];
    var networkState = input.getNetworkState().name();
    var isIhubSupported = requestScope.get().get("isIhubSupported");
    var ihubName;
    if (isIhubSupported) {
        var iHubDeviceName = deviceName + intentConstants.DEVICE_SEPARATOR + intentConstants.LS_IHUB;
        // Create a new object with replace old values with new value.
        var iHubConfigObject = JSON.parse(JSON.stringify(configObject));
        configObject["isIhubSupported"] = true;
        iHubConfigObject["shelf-hardware-type"] = configObject["hardware-type"];
        iHubConfigObject["hardware-type"] = this.getiHUBAndLTHWTypeVersion(intentConstants.LS_IHUB, iHubConfigObject["hardware-type"], null);
        iHubConfigObject["device-template"] = iHubConfigObject["ihub-device-template"];

        iHubConfigObject["ip-port"] = this.ihubPort.toString();
        var ihubDeviceVersion = iHubConfigObject["ihub-version"];
        if(iHubConfigObject["ihub-version"]) {
            iHubConfigObject["isIhubVersionConfigured"] = true;
        } else {
            ihubDeviceVersion = iHubConfigObject["device-version"];
        }
        if (iHubConfigObject["duid"]) {
             iHubConfigObject["duid"] = iHubConfigObject["duid"].replace(intentConstants.LS_NT_ACCESS_DUID_POSTFIX, intentConstants.LS_NT_IHUB_DUID_POSTFIX);
        }
         if (iHubConfigObject["duid2"]) {
             iHubConfigObject["duid2"] = iHubConfigObject["duid2"].replace(intentConstants.LS_NT_ACCESS_DUID_POSTFIX, intentConstants.LS_NT_IHUB_DUID_POSTFIX);
        }
        // Create I-HUB with standard steps ( with out s/w upgrade)
        var remoteDeviceiHUB = this.constructRemoteDeviceStepObject(iHubDeviceName, iHubConfigObject, currentTopology, 1, false);
        // Enable or Disable call home container based on connection type
        var isDuidSupported = apCapUtils.getCapabilityValue(iHubConfigObject["hardware-type"], ihubDeviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DUID_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
        if (isDuidSupported && networkState != "delete") {
            var configCallHomeContainerStep = this.constructCallHomeContainerStepObject(iHubDeviceName, iHubConfigObject, currentTopology);
            remoteDeviceiHUB.steps.push(configCallHomeContainerStep);
        }
        var isNodeIpSupported = this.isNodeIpSupportedCaps(configObject, currentTopology, iHubDeviceName, iHubConfigObject);
        if (isNodeIpSupported && networkState != "delete") {
            var configNodeIpStep = this.constructNodeIpStepObject(iHubDeviceName, iHubConfigObject, currentTopology);
            remoteDeviceiHUB.steps.push(configNodeIpStep);
        }
    
        // Create I-HUB local device.
        ihubName =  remoteDeviceiHUB.name;

        // Update backplane ports
        iHubConfigObject["boards"] = {
            "LT1": {
                    "slot-name": "LT1",
                    "planned-type": "lt"
            }
        };
        var ltPortsStep = this.constructIHUBLtPortsStepObject(iHubDeviceName, iHubConfigObject, currentTopology);

        var isDeviceCreated = true;
        if ((!currentTopology || (currentTopology && !(currentTopology.getTarget())))) {
            var deviceInfos = mds.getAllInfoFromDevices(deviceName);
            if (deviceInfos == null || deviceInfos.isEmpty()) {
                isDeviceCreated = false;
            }
        }
    
        if (isDeviceCreated) {
            var xtraDeviceVersionNT = apUtils.getTopologyExtraInfoFromTopology(currentTopology, "DEVICE_VERSION_" + deviceName, "device-version");
            //Just push step config lt port for IHUB when config device version is same as device version in xtraTopo
            if (xtraDeviceVersionNT && xtraDeviceVersionNT === configObject["device-version"]) {
                remoteDeviceiHUB.steps.push(ltPortsStep);
            }
        } else {
            remoteDeviceiHUB.steps.push(ltPortsStep);
        }
    }
    // Create device with standard steps
    var remoteDevice = this.constructRemoteDeviceStepObject(deviceName, configObject, currentTopology, 4, true);
    // Add plan board step for device
    var planBoardStep = this.constructPlanBoardStepObject(deviceName, configObject, currentTopology, true, configObject["device-version"]);
    remoteDevice.steps.push(planBoardStep);
    // Create local device.

    var manager = configObject[this.deviceManagerName];
    //This value 'ManagerInvolved' used in postSync for mds sync and disable the debug log
    requestScope.get().put("ManagerInvolved", manager);
    requestScope.get().put("isSubscribeToDeviceNotificationSupported", true);
    if(isIhubSupported) {
        var pairDevice = {}
        pairDevice[deviceName] = iHubDeviceName;
        requestScope.get().put("pairDevice", pairDevice);
    }
    var syncDependents = this.getSyncDepedencyInfoForOamConnectivity(deviceName, configObject, currentTopology);
    return {
        targetDelimiter: "#",
        stageName: "create-device-" + deviceInfo.name,
        getKeyForList: deviceManagerObj.getKeyForList,
        trackedArgs: {
            "device-version": true,
            "label": true,
            "trust-anchors": true,
            "act-url": true,
            "pass-url": true,
            "act-file-on-server": true,
            "pass-file-on-server": true,
            "boardlist": true,
            "boards": true,
            "eonuImages": true,
            "eonu-release": true,
            "eonuVendorSpecificImages" : true,
            "externalAlarmNames" : true,
            "inputScanPoints" : true,
            "outputScanPoints" : true,
            "timezone-name" : true
        },
        syncDependents: syncDependents.syncDependent,
        explicitlyUpdateDependentIntents: syncDependents.explicitlyUpdateDependentIntents,
        dependencyArgs: {
            "slot-name": true,
            "planned-type": true
        },
        forceStoreTopology: true,
        skipAttributeInXtraInfo: ["navDeviceSpecificData"],
        getDeviceIds: function (target, intentConfigXml, intentConfigJson, topology) {
            if (manager != null) {
                apUtils.checkManagerConnectivityStateForManager(manager);
            }
            var devices = {};
            // Add IHUB device
            if (isIhubSupported) {
                devices[remoteDeviceiHUB.name] = remoteDeviceiHUB;
            }
            // Add device
            devices[remoteDevice.name] = remoteDevice;

            return devices;
        },
        getDependencyProfiles: function (intentConfigJson, deviceId) {  
            if(deviceInfo.managerType == intentConstants.MANAGER_TYPE_NAV){
                var dependentProfilesList = [];
                var profilesDf = {};
                var nodeType = [intentConfigJson["hardware-type"], intentConfigJson["device-version"]].join('-');
                deviceInfo.familyTypeRelease = nodeType;
                if(apCapUtils.checkIfProfileManagerIsEnabled(deviceInfo.familyTypeRelease) === true){
                    profilesDf["allProfilesDf"] = requestScope.get().get("allProfiles");
                    dependentProfilesList = getProfilesAndDependencyInfos(deviceInfo, input.getIntentTypeVersion(), intentConfigJson, deviceInfo.managerType,profilesDf);
                }
                return dependentProfilesList;
            }
        },
        postSynchronize: deviceManagerObj.postSynchronize(null, deviceName, ihubName)
    };
}

/**
 * Create a single device with remote device ( with step create-device, s/w upgrade , plug match) and local device.
 * @param deviceInfo
 * @param input
 * @param configObject
 * @returns intentObject
 */
VirtualizerDeviceManager.prototype.createIntentConfigForSingleDevice = function (deviceInfo, input, configObject, isUplinkEthBoard) {
    var deviceManagerObj = this;

    var deviceName = deviceInfo.name;
    var lastIndex = deviceName.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
    if (lastIndex > -1) {
        var ltDeviceName = deviceName.substring(lastIndex + 1);
        var ltPattern = new RegExp(intentConstants.FX_LT_REG_EXP);
        var isLtBoard = ltPattern.test(ltDeviceName);
        if(isLtBoard) {
            var deviceReleaseVersion = (configObject["boards"] && configObject["boards"][ltDeviceName] && configObject["boards"][ltDeviceName]["device-version"]) ? configObject["boards"][ltDeviceName]["device-version"] : configObject["device-version"];
        } else {
            var deviceReleaseVersion = configObject["device-version"];
        }
    } else {
        var deviceReleaseVersion = configObject["device-version"];
    }
    var currentTopology = input.getCurrentTopology();
    var remoteDevice = this.constructRemoteDeviceStepObject(deviceName, configObject, currentTopology, 2);
       //Add LT device configuration step
    var deviceType = configObject["hardware-type"];
    var deviceVersionForCaps = apUtils.getDeviceVersionForCaps(deviceName, deviceReleaseVersion);
    var isClockMgmtSupportedForNT = requestScope.get().get("isClockMgmtSupportedForNT");
    var isTimeZoneNameSupported = requestScope.get().get("isTimeZoneNameSupported");
    var isClockMgmtSupportedForLT;
    var isTimeZoneNameSupportedForLT;
    if ((deviceType.startsWith(intentConstants.LS_MF_PREFIX) || deviceType.startsWith(intentConstants.LS_SF_PREFIX)) && isClockMgmtSupportedForNT) {
        isClockMgmtSupportedForLT = apCapUtils.getCapabilityValue(deviceType, deviceVersionForCaps, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_CLOCK_MGMT_SUPPORTED, deviceType.substring(6), false);
    }
    if (deviceType.startsWith(intentConstants.LS_FX_PREFIX) && isClockMgmtSupportedForNT) {
        var shelfRegEx = "([A-Z]+)-([A-Z]+)-([A-Z]+-[A-Z])";
        var matches = deviceType.match(shelfRegEx);
        isClockMgmtSupportedForLT = apCapUtils.getCapabilityValue(deviceType, deviceVersionForCaps, capabilityConstants.BOARD_CATEGORY,capabilityConstants.IS_CLOCK_MGMT_SUPPORTED, matches[3], false);
    }
    if (isTimeZoneNameSupported){
        isTimeZoneNameSupportedForLT = apCapUtils.getCapabilityValue(deviceType, deviceVersionForCaps, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_TIME_ZONE_NAME_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
    }
    var isHostIdConfigurationSupported = apCapUtils.getCapabilityValue(deviceType, deviceVersionForCaps, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_HOST_ID_CONFIGURATION_SUPPORTED, deviceType.substring(6), false);
    if ((deviceType.startsWith(intentConstants.LS_FX_PREFIX) && isClockMgmtSupportedForLT) || (deviceType.startsWith(intentConstants.LS_MF_PREFIX) && isClockMgmtSupportedForLT) || (deviceType.startsWith(intentConstants.LS_SF_PREFIX) && isClockMgmtSupportedForLT)
        || isTimeZoneNameSupported) {
        var configureLtDevice = this.constructLtStepObject(deviceName, configObject, currentTopology, isClockMgmtSupportedForLT, isTimeZoneNameSupportedForLT, isHostIdConfigurationSupported, deviceReleaseVersion);
        remoteDevice.steps.push(configureLtDevice);
   }
   if (requestScope.get().get("alarmExternalSupported" && !deviceManagerObj.isLTShelfDeviceName(deviceName))) {
        var configExternalAlarmStep = this.constructExternalAlarmStepObject(deviceName, configObject, currentTopology, deviceReleaseVersion);
        remoteDevice.steps.push(configExternalAlarmStep);
    }
    if (deviceType && isUplinkEthBoard && configObject["boards"]) {
        var boardServiceProfileJson = requestScope.get().get("serviceProfiles");
        if (boardServiceProfileJson && boardServiceProfileJson[profileConstants.BOARD_SERVICE_PROFILE.subTypeETH] && boardServiceProfileJson[profileConstants.BOARD_SERVICE_PROFILE.subTypeETH][profileConstants.BOARD_SERVICE_PROFILE.profileType]) {
            var ltDeviceName = deviceName.substring(lastIndex + 1);
            var boards = configObject["boards"];
            if (boards[ltDeviceName]) {
                var profile = boards[ltDeviceName]["board-service-profile"];
                var boardServiceProfiles = boardServiceProfileJson[profileConstants.BOARD_SERVICE_PROFILE.subTypeETH][profileConstants.BOARD_SERVICE_PROFILE.profileType];
                var configLtWithFeltBBackplane;
                if (profile) {
                    boardServiceProfiles.forEach(function (boardServiceProfile) {
                        if (boardServiceProfile["name"] == profile && boardServiceProfile["backplane-scheduler-profile"]) {
                            configLtWithFeltBBackplane = deviceManagerObj.constructLtWithFeltBBackplane(deviceName, configObject, currentTopology, boardServiceProfile["backplane-scheduler-profile"], deviceReleaseVersion);
                            remoteDevice.steps.push(configLtWithFeltBBackplane);
                        }
                    });
                }
            }
        }
    }
    var manager = configObject[this.deviceManagerName];
    //This value 'ManagerInvolved' used in postSync for mds sync and disable the debug log
    requestScope.get().put("ManagerInvolved", manager);
    var syncDependents = this.getSyncDepedencyInfoForOamConnectivity(deviceName, configObject, currentTopology);
    return {
        targetDelimiter: "#",
        stageName: "create-device-" + deviceInfo.name,
        getKeyForList: deviceManagerObj.getKeyForList,
        trackedArgs: {
            "device-version": true,
            "label": true,
            "trust-anchors": true,
            "act-url": true,
            "pass-url": true,
            "act-file-on-server": true,
            "pass-file-on-server": true,
            "eonuImages": true,
            "eonu-release": true,
            "cpeSoftware": true,
            "cpePreferenceReleases": true,
            "eonuVendorSpecificImages" : true,
            "externalAlarmNames" : true,
            "inputScanPoints" : true,
            "outputScanPoints" : true,
            "timezone-name" : true
        },
        syncDependents: syncDependents.syncDependent,
        explicitlyUpdateDependentIntents: syncDependents.explicitlyUpdateDependentIntents,
        forceStoreTopology: true,
        skipAttributeInXtraInfo: ["navDeviceSpecificData"],
        getDeviceIds: function (target, intentConfigXml, intentConfigJson, topology) {
            if (manager != null) {
                apUtils.checkManagerConnectivityStateForManager(manager);
            }
            var devices = {};
            // Add main device
            devices[remoteDevice.name] = remoteDevice;
            return devices;
        },
        getDependencyProfiles: function (intentConfigJson, deviceId) {
            deviceInfo["familyTypeRelease"] = intentConfigJson["hardware-type"] + "-" + intentConfigJson["device-version"];            
            deviceInfo["familyType"] = intentConfigJson["hardware-type"];           
			if(deviceInfo["familyType"] && deviceInfo["familyType"].startsWith(intentConstants.FAMILY_TYPE_LS_SX)){
                var profilesDpu = {};
                profilesDpu["allProfilesDpu"] = requestScope.get().get("allProfiles");
                return getProfilesAndDependencyInfos(deviceInfo,input.getIntentTypeVersion(),intentConfigJson,profilesDpu);
            }else if(deviceInfo["familyType"] && deviceInfo["familyType"].startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_A)){
                if(deviceInfo.managerType == intentConstants.MANAGER_TYPE_NAV){
                    var dependentProfilesList = [];
                    var nodeType=[intentConfigJson["hardware-type"], intentConfigJson["device-version"]].join('-');
                    deviceInfo.familyTypeRelease = nodeType;
                    if (apCapUtils.checkIfProfileManagerIsEnabled(deviceInfo.familyTypeRelease) === true) {
                        dependentProfilesList = getProfilesAndDependencyInfos(deviceInfo, input.getIntentTypeVersion(),intentConfigJson);
                    }
                    return dependentProfilesList;
                }  
            }
        },
        postSynchronize: deviceManagerObj.postSynchronize(null, deviceName,null)
    };
}

/**
 * Create a single device with remote device ( with step create-device, s/w upgrade , plug match) and local device.
 * @param deviceInfo
 * @param input
 * @param configObject
 * @returns intentObject
 */
VirtualizerDeviceManager.prototype.createIntentConfigForMxDevice = function (deviceInfo, input, configObject) {
    var deviceManagerObj = this;
    var deviceName = deviceInfo.name;
    var currentTopology = input.getCurrentTopology();
    var remoteDevice = this.constructRemoteDeviceStepObject(deviceName, configObject, currentTopology, 2);
    var manager = configObject[this.deviceManagerName];
    var planedBoardStep = this.constructPlanBoardStepObjectForMx(deviceName, configObject, currentTopology);
    remoteDevice.steps.push(planedBoardStep);
    var configExternalAlarmStep = this.constructExternalAlarmStepObject(deviceName, configObject, currentTopology);
    remoteDevice.steps.push(configExternalAlarmStep);
    //This value 'ManagerInvolved' used in postSync for mds sync and disable the debug log
    requestScope.get().put("ManagerInvolved", manager);
    var syncDependents = this.getSyncDepedencyInfoForOamConnectivity(deviceName, configObject, currentTopology);
    return {
        targetDelimiter: "#",
        stageName: "create-device-" + deviceInfo.name,
        getKeyForList: deviceManagerObj.getKeyForList,
        trackedArgs: {
            "device-version": true,
            "label": true,
            "trust-anchors": true,
            "act-url": true,
            "pass-url": true,
            "act-file-on-server": true,
            "pass-file-on-server": true,
            "boards": true,
            "externalAlarmNames" : true,
            "inputScanPoints" : true,
            "outputScanPoints" : true,
            "cpeSoftware": true,
            "cpePreferenceReleases": true
        },
        syncDependents: syncDependents.syncDependent,
        explicitlyUpdateDependentIntents: syncDependents.explicitlyUpdateDependentIntents,
        forceStoreTopology: true,
        getDeviceIds: function (target, intentConfigXml, intentConfigJson, topology) {
            if (manager != null) {
                apUtils.checkManagerConnectivityStateForManager(manager);
            }
            var devices = {};
            // Add main device
            devices[remoteDevice.name] = remoteDevice;
            return devices;
        },
        getDependencyProfiles: function (intentConfigJson, deviceId) {
            deviceInfo["familyTypeRelease"] = intentConfigJson["hardware-type"] + "-" + intentConfigJson["device-version"];            
            deviceInfo["familyType"] = intentConfigJson["hardware-type"];           
			var profileMx = {};
            profileMx["allProfilesMx"] = requestScope.get().get("allProfiles");
            return getProfilesAndDependencyInfos(deviceInfo,input.getIntentTypeVersion(),intentConfigJson,profileMx);
        },
        postSynchronize: deviceManagerObj.postSynchronize(null, deviceName,null)
    };
}

/**
 * This step object used to configure the external alarm on LS-SX/MX/DF/FX device.
 * @param deviceName
 * @param configJson
 * @param topology
 * @returns {{name: string, resourceFile: string, getTemplateArguments: (function(*=, *): *)}}
 */
VirtualizerDeviceManager.prototype.constructExternalAlarmStepObject = function (deviceName, configJson, topology, deviceReleaseVersion) {
    var deviceManagerObj = this;
    let topologyXtraInfo;
    if (topology) {
        topologyXtraInfo = JSON.parse(JSON.stringify(apUtils.getTopologyExtraInfo(topology)));
    }
    return {
        name: "configureExternalAlarm",
        resourceFile: deviceManagerObj.prefix + "configureExternalAlarm.xml.ftl",
        sensitiveKeys: ["password"],
        getTemplateArgsForTopology: function (deviceId, templateArgsWithDiff, templateArgs, stageName) {
            return apUtils.getTemplateArgsForTopology(deviceId, topologyXtraInfo, templateArgs, deviceReleaseVersion, stageName,"configureExternalAlarm")
        },
        skipEditConfigRequest: function (deviceId, templateArgsWithDiff) {
            return apUtils.compareDeviceVersion(deviceId, deviceReleaseVersion);
        },
        preStepSynchronize: function (syncInput, templateArgsWithDiff, result) {
            var networkState = syncInput.getNetworkState().name();
            if (configJson["hardware-type"].startsWith(intentConstants.FAMILY_TYPE_LS_SX) && apUtils.compareVersion(configJson["device-version"],"23.3") <= 0 && networkState != "delete") {
                var proceed = true;
                if (templateArgsWithDiff && templateArgsWithDiff["externalAlarmNames"] ) {
                    var externalAlarmNameKeys = Object.keys(templateArgsWithDiff["externalAlarmNames"]);
                    if (externalAlarmNameKeys.indexOf("changed") >= 0 || externalAlarmNameKeys.indexOf("removed") >= 0) {
                        proceed = false;
                    }
                }
                if (templateArgsWithDiff && templateArgsWithDiff["inputScanPoints"]) {
                    var inputScanPointsKeys = Object.keys(templateArgsWithDiff["inputScanPoints"]);
                    if (inputScanPointsKeys.indexOf("changed") >= 0 || inputScanPointsKeys.indexOf("removed") >= 0) {
                        proceed = false;
                    }
                }
                if (!proceed) {
                    return {
                        proceed: false,
                        errorCode: "ERR-100",
                        errorMessage: "The External Alarm Port and the Input Scan Point configuration are not allowed to be updated for LS-SX devices."
                    };
                }
            }
            return {
                proceed : true
            }
        },
        getTemplateArguments: function (baseArgs, topology) {
            var currentBoards = baseArgs["boards"];
            var hardware = baseArgs["hardware-type"];
            var externalAlarmSupported = requestScope.get().get("alarmExternalSupported")
            if (externalAlarmSupported && baseArgs["networkState"].toString() != "delete") {
                var convertedAlarmExternal = apUtils.processExternalAlarmJson(requestScope.get().get("externalAlarmJson"),requestScope.get().get("externalAlarmScanPointDetail"));
                if (hardware.startsWith(intentConstants.FAMILY_TYPE_LS_SX)) {
                    baseArgs["parentHardwareComponent"] = "Chassis";
                    baseArgs["isDeviceSX"] = true;
                    baseArgs["skipRemoveAction"] = true;
                } else if (hardware.startsWith(intentConstants.FAMILY_TYPE_LS_MX)
                    && currentBoards && Object.keys(currentBoards).indexOf("NTA") !== -1) {
                    baseArgs["parentHardwareComponent"] = "NTA";
                    baseArgs["skipRemoveAction"] = true;
                } else if (hardware.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_A) || hardware.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_C)) {
                    baseArgs["parentHardwareComponent"] = "Chassis";
                    baseArgs["noConfigTopo"] = true;
                    baseArgs["skipRemoveAction"] = true;
                    baseArgs["removeInputScanPointAction"] = true;
                }
                if (convertedAlarmExternal && baseArgs["parentHardwareComponent"]) {
                    if (convertedAlarmExternal["externalAlarmNames"]) baseArgs["externalAlarmNames"] = convertedAlarmExternal["externalAlarmNames"];
                    if (convertedAlarmExternal["inputScanPoints"]) baseArgs["inputScanPoints"] = convertedAlarmExternal["inputScanPoints"];
                    if (convertedAlarmExternal["outputScanPoints"]) baseArgs["outputScanPoints"] = convertedAlarmExternal["outputScanPoints"];
                }
            }
            return baseArgs;
        }
    };
}

/**
 * This step object used to configure the Call home container on iHUB device.
 * @param deviceName
 * @param configJson
 * @param topology
 * @returns {{name: string, resourceFile: string, getTemplateArguments: (function(*=, *): *)}}
 */
VirtualizerDeviceManager.prototype.constructCallHomeContainerStepObject = function (deviceName, configJson, topology) {
    var deviceManagerObj = this;
    return {
        name: "configureCallHomeContainer",
        resourceFile: deviceManagerObj.prefix + "configureCallHomeContainer.xml.ftl",
        getTemplateArguments: function (baseArgs, topology) {
            return baseArgs;
        }
    };
}

/**
 * This step object used to configure the Node ip on iHUB device.
 * @param deviceName
 * @param configJson
 * @param topology
 * @returns {{name: string, resourceFile: string, getTemplateArguments: (function(*=, *): *)}}
 */
VirtualizerDeviceManager.prototype.constructNodeIpStepObject = function (deviceName, configJson, topology) {
    var deviceManagerObj = this;
    return {
        name: "configureNodeIp",
        resourceFile: deviceManagerObj.prefix + "configureNodeIp.xml.ftl",
        getTemplateArguments: function (baseArgs, topology) {
            var lastIntentConfigFromTopo = apUtils.getLastIntentConfigFromTopologyXtraInfo(topology);
            if(lastIntentConfigFromTopo && lastIntentConfigFromTopo["ip-address"] && !configJson["ip-address"]){
                baseArgs["nodeIpInterfaceNameToBeReset"] = "mgmt_ztp";
            }
            return baseArgs;
        }
    };
}

/* Supporting methods */

/**
 * Method used to find the removed LT's in NT
 * @param ntDeviceName
 * @param topology
 * @param currentBoards
 * @returns {{}}
 */
VirtualizerDeviceManager.prototype.getRemovedLts = function (ntDeviceName, topology, currentBoards, hwType, deviceVersion) {
    var removedLts = {};
    // Find removed LTS
    var boardPrefix;
    if (hwType.startsWith(intentConstants.LS_FX_PREFIX)) {
        boardPrefix = "LS-FX-"
    } else if (hwType.startsWith(intentConstants.LS_MF_PREFIX)) {
        boardPrefix = "LS-MF-"
    }
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        var xtraInfos = apUtils.getTopologyExtraInfo(topology);
        if (xtraInfos[this.LT_DEVICES_TOPO_NAME]) {
            var ltDevicesTopo = JSON.parse(xtraInfos[this.LT_DEVICES_TOPO_NAME]);
            Object.keys(ltDevicesTopo).forEach(function (ltDevice) {
                var boardType = boardPrefix + ltDevicesTopo[ltDevice]["planned-type"];
                var isEthBoard = false;
                isEthBoard = apCapUtils.isValueInCapability(hwType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, ltDevicesTopo[ltDevice]["planned-type"], "ETH");
                var isBoardTypeLT = apCapUtils.isValueInCapability(hwType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.SLOT_TYPE, ltDevicesTopo[ltDevice]["planned-type"], "LT");
                if(isEthBoard && isBoardTypeLT){
                    var deviceDetails = {};
                    deviceDetails["useProfileManager"] = true;
                    deviceDetails["deviceName"] = ntDeviceName;
                    deviceDetails["nodeType"] = hwType + "-" + deviceVersion;
                    deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
                    deviceDetails["intentTypeVersion"] = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, ntDeviceName);
                    deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);
                    var boardServiceProfileObj = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", ltDevicesTopo[ltDevice]["board-service-profile"], deviceDetails);
                    if(boardServiceProfileObj["model"] === "uplink-mode"){
                        boardType = boardType + "-" + intentConstants.UP_LINK_HW_TYPE_POSTFIX;
                    }else if(boardServiceProfileObj["model"] === "downlink-mode"){
                        boardType = boardType + "-" + intentConstants.DOWN_LINK_HW_TYPE_POSTFIX;
                    }
                }

                var boardVersion;
                if (ltDevicesTopo[ltDevice]["device-version"] || ltDevicesTopo[ltDevice]["device-version"] != null) {
                    boardVersion = ltDevicesTopo[ltDevice]["device-version"];
                } else {
                    boardVersion = deviceVersion;
                }
                if (!currentBoards || !currentBoards[ltDevice] || (currentBoards && currentBoards[ltDevice] && currentBoards[ltDevice]["planned-type"] && currentBoards[ltDevice]["planned-type"] === "-")) {
                    removedLts[ltDevice] = ltDevicesTopo[ltDevice];
                }
                if (currentBoards && currentBoards[ltDevice]) {
                    var supportedType = apCapUtils.getCapabilityValue(boardType, boardVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.COMPATIBLE_BOARDS, ltDevicesTopo[ltDevice]["planned-type"], []);
                    if (ltDevicesTopo[ltDevice]["planned-type"] != currentBoards[ltDevice]["planned-type"] && supportedType.length > 0 && supportedType.indexOf(currentBoards[ltDevice]["planned-type"]) > -1) {
                        removedLts[ltDevice] = ltDevicesTopo[ltDevice];
                    }   
                }
            });
        }
    }
    return removedLts;
}

/**
 * Find the IHUB and LT h/w version
 * @param type
 * @param ntHardwareType
 * @param plannedType
 * @param lsPrefix - (optional) used to denote Prefix for device type
 * @returns {string}
 */
VirtualizerDeviceManager.prototype.getiHUBAndLTHWTypeVersion = function (type, ntHardwareType, plannedType, lsPrefix) {
    return apUtils.getiHUBAndLTHWTypeVersion(type, ntHardwareType, plannedType, lsPrefix);
}

/**
 * Method used to construct the h/w board components for NT device
 * @param hardwareIdentities
 * @param planType
 * @param parent
 * @param isDefault
 * @param vertexNum
 * @param hardwareIdentitiesSlot
 * @returns {{parent: *, planType: *, vertexId: *, parentRelPosNr: number, hardwareSlot: *, operation: string, hardware: *}|{vertexId: *, operation: string}}
 */
VirtualizerDeviceManager.prototype.getBoardObject = function (hardwareIdentities, planType, parent, isDefault, vertexNum, hardwareIdentitiesSlot) {
    var result = {};
    if (planType === "-") {
        return {
            "operation": (isDefault === true) ? "skip" : "remove",
            "vertexId": vertexNum
        }
    }
    var parentRelPos = parent.split("-");
    var parentRelPosNr = 1;
    if (parentRelPos.length == 3) { //Slot-Psu-1, Slot-Lt-1, ...
        if (parentRelPos[2] === "A" || parentRelPos[2] === "B")
        {
            switch (parentRelPos[2]) {
                case "A":
                    parentRelPosNr = 1;
                    break;
                case "B":
                    parentRelPosNr = 2;
                    break;
                default:
                    parentRelPosNr = 1;
            }
        }
        else {
            parentRelPosNr = parentRelPos[2];
        }
    } // other are Slot-Acu, Slot-Fan
    result = {
        "hardware": hardwareIdentities,
        "planType": planType,
        "parent": parent,
        "parentRelPosNr": parentRelPosNr,
        "hardwareSlot": hardwareIdentitiesSlot,
        "vertexId": vertexNum,
        "operation": (isDefault === true) ? "skip" : "merge"
    }
    return result;
}

VirtualizerDeviceManager.prototype.getExternalAlarmPortObject = function (deviceName) {
    var templateArgs = {
        "deviceID": deviceName
    }
    var requestContext = requestScope.get();
    var netConfFwk = requestContext.get("xFWK");
    try {
        var getAlarmPortXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getExternalAlarmPortObject.xml.ftl"), templateArgs);
        var response = requestExecutor.executeNCWithManager(requestContext.get("ManagerInvolved"), getAlarmPortXml);
        var datapath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceName + "\']/adh:device-specific-data";
        var deviceResponse = utilityService.extractSubtree(response.getRawResponse(), netConfFwk.prefixToNsMap,datapath);
        var alarmPorts = utilityService.getAttributeValues(deviceResponse, datapath + "/hw:hardware/hw:component/hw:name", netConfFwk.prefixToNsMap);
        if (alarmPorts && alarmPorts.length > 0) {
            var result = {};
            for (var alarmPort = 0; alarmPort < alarmPorts.length; alarmPort++) {
                result[alarmPorts[alarmPort]] = {
                    "vertexId": alarmPort + 53
                }
            }
            return result;
        }
    } catch (e) {
        logger.error("Error why getting the external alarm port object " + e);
    }
    return null;
}

VirtualizerDeviceManager.prototype.updateSwCertificateDetails = function (deviceName, configObject, stepArgs, networkState) {
    if(requestScope.get().get("certificateNode")) {
        var certificateNode = requestScope.get().get("certificateNode");
    }
    if (configObject["active-software"] && networkState != "delete") {
        this.updateSwDetails(configObject, stepArgs, "active-software", "act-url", "act-file-on-server", "actFileServer", "actSubDirectory", "actFileName", "swImageName");
        if (this.isValidFileServer(configObject["active-software"])) {
            // FIXME reuse the same certificateNode response in multiple places - Done
            if (!certificateNode) {
                certificateNode = this.getCertificateNode(this.prefix, configObject[this.deviceManagerName]);
            }
            this.updateCertDetails(configObject, stepArgs, "active-software", "trust-anchors", configObject[this.deviceManagerName], deviceName, certificateNode);
            if (certificateNode) {
                requestScope.get().put("certificateNode", certificateNode);
            }
        }
    }
    if (configObject["passive-software"] && networkState != "delete") {
        this.updateSwDetails(configObject, stepArgs, "passive-software", "pass-url", "pass-file-on-server", "passFileServer", "passSubDirectory", "passFileName", "passSwImageName");
        if (this.isValidFileServer(configObject["passive-software"])) {
            // FIXME reuse the same certificateNode response in multiple places - Done
            if (!certificateNode) {
                certificateNode = this.getCertificateNode(this.prefix, configObject[this.deviceManagerName]);
            }
            this.updateCertDetails(configObject, stepArgs, "passive-software", "trust-anchors", configObject[this.deviceManagerName], deviceName, certificateNode);
            if (certificateNode) {
                requestScope.get().put("certificateNode", certificateNode);
            }
        }
    }
    if (configObject["eonu-release"]) {
        this.updateEonuSwDetails(configObject, stepArgs, "eonu-release", "eonuImages");
        if (!certificateNode) {
            certificateNode = this.getCertificateNode(this.prefix, configObject[this.deviceManagerName]);
        }
        this.updateCertDetails(configObject, stepArgs, "eonu-release", "trust-anchors", configObject[this.deviceManagerName], deviceName, certificateNode);
        if (certificateNode) {
            requestScope.get().put("certificateNode", certificateNode);
        }
    }
    if (configObject["eonu-vendor-specific-release"]) {
        this.updateEonuSwDetails(configObject, stepArgs, "eonu-vendor-specific-release", "eonuVendorSpecificImages");
        //this.updateEonuSwDetails(configObject, stepArgs, "eonu-vendor-specific-release", "eonu-url", "eonu-file-on-server", "eonuFileServer", "eonuSubDirectory", "eonuFileName", "eonuSwImageName","eonuImages");
        if (!certificateNode) {
            certificateNode = this.getCertificateNode(this.prefix, configObject[this.deviceManagerName]);
        }
        this.updateCertDetails(configObject, stepArgs, "eonu-vendor-specific-release", "trust-anchors", configObject[this.deviceManagerName], deviceName, certificateNode);
        if (certificateNode) {
            requestScope.get().put("certificateNode", certificateNode);
        }
    }
    if (configObject["target-transformation-software"]) {
        this.updateSwDetails(configObject, stepArgs, "target-transformation-software", "trans-url", "trans-file-on-server", "transFileServer", "transSubDirectory", "transFileName", "transformationSoftware");
        if (this.isValidFileServer(configObject["target-transformation-software"])) {
            // FIXME reuse the same certificateNode response in multiple places - Done
            if (!certificateNode) {
                certificateNode = this.getCertificateNode(this.prefix, configObject[this.deviceManagerName]);
            }
            this.updateCertDetails(configObject, stepArgs, "target-transformation-software", "trust-anchors", configObject[this.deviceManagerName], deviceName, certificateNode);
            if (certificateNode) {
                requestScope.get().put("certificateNode", certificateNode);
            }
        }
    }
}

VirtualizerDeviceManager.prototype.updateCpeSwDetails = function (deviceName, configObject, stepArgs, networkState) {
    if (configObject["cpe-software"] && networkState != "delete") {
        var finalCpeSw = {};
        var keyCpeSwKeys = Object.keys(configObject["cpe-software"]);
        var cpeReleaseNames = [];
        keyCpeSwKeys.forEach(function(cpeRelease) {
            if (cpeRelease.contains("://") || !cpeRelease.contains(":")) {
                if (cpeRelease.contains("://")) {
                    var cpeSwUrlName = cpeRelease.substr(cpeRelease.lastIndexOf("/") + 1, cpeRelease.length);
                    var cpeUrlName = cpeSwUrlName;
                    if (cpeUrlName.contains(".")) {
                        var cpeUrlName = cpeUrlName.split(".")[0];
                    }
                } else {
                    var cpeUrlName = cpeRelease;
                    if (cpeUrlName.contains(".")) {
                        var cpeUrlName = cpeUrlName.split(".")[0];
                    }
                }
                finalCpeSw[cpeUrlName] = {
                        "cpeUrlName" : cpeUrlName,
                         "cpeSwUrl" : cpeRelease,
                         "isUrl" : true,
                         "value" : cpeUrlName
                     };
            } else {
                cpeReleaseNames.push(cpeRelease);
            }

        });
        if (cpeReleaseNames.length > 0) {
            for(var i=0; i<cpeReleaseNames.length; i++){
                var cpeSwArr = cpeReleaseNames[i].split("/");
                var cpeSwArrFileServer = cpeSwArr[0].split(":");
                var cpeSwFileName = cpeSwArr[2];
                var cpeSwName = cpeSwArr[2].split(".")[0];
                var cpeSubDirectory = cpeSwArrFileServer[1]+"/"+cpeSwArr[1];
                var cpeFileServer = cpeSwArrFileServer[0];
                finalCpeSw[cpeSwName] = {
                    "cpeSwName" : cpeSwName,
                    "cpeSwFileName" : cpeSwFileName,
                    "cpeFileServer" : cpeFileServer,
                    "cpeSwSubDir" : cpeSubDirectory,
                    "isUrl" : false,
                    "value" : cpeSwName
                };
            }
        }
        stepArgs["cpeSoftware"] = finalCpeSw;
    }
}

VirtualizerDeviceManager.prototype.updatePreferredCpeSwDetails = function (deviceName, configObject, stepArgs, networkState) {
    if (configObject["cpe-software-preference"] && networkState != "delete") {
        var finalCpeSw = [];
        var preferenceCpeSwKeys = Object.keys(configObject["cpe-software-preference"]);
        var cpePreferenceReleases = [];
        var preferenceCpeSWObject = {};
        var isAutoActive;
        preferenceCpeSwKeys.forEach(function(preferenceCpeSwKey) {
            var preferenceCpeSW = configObject["cpe-software-preference"][preferenceCpeSwKey];
            var cpeRelease = preferenceCpeSW["preferred-software-release"];
            if (cpeRelease.contains("://")) {
                var cpeSwName = cpeRelease.substr(cpeRelease.lastIndexOf("/") + 1);
                if (cpeSwName.contains(".")) {
                    cpeSwName = cpeSwName.split(".")[0];
                }
            } else if (!cpeRelease.contains(":")) {
                var cpeSwName = cpeRelease;
                if (cpeSwName.contains(".")) {
                    cpeSwName = cpeSwName.split(".")[0];
                }
            } else {
                var cpeSwArr = preferenceCpeSW["preferred-software-release"].split("/");
                var cpeSwName = cpeSwArr[2].split(".")[0];
            }
            preferenceCpeSWObject[preferenceCpeSW["cpe-type"]] = {
                "cpeType" : preferenceCpeSW["cpe-type"],
                "preferredSw" : cpeSwName,
                "value" : preferenceCpeSW["cpe-type"]
            };
            isAutoActive=preferenceCpeSW["auto-active"]
            if (isAutoActive && isAutoActive === 'true') {
                preferenceCpeSWObject[preferenceCpeSW["cpe-type"]]["isAutoActive"] = true;
            }else{
                preferenceCpeSWObject[preferenceCpeSW["cpe-type"]]["isAutoActive"] = false;
            }
        });
        
        stepArgs["cpePreferenceReleases"] = preferenceCpeSWObject;
    }
}

VirtualizerDeviceManager.prototype.getCertificateNode = function (prefix, managerName) {
    var requestXml = resourceProvider.getResource(prefix + "getCertID.xml");
    requestXml = requestXml.trim().replaceFirst("^([\\W]+)<", "<");
    var certificateResponse = apUtils.executeGetConfigRequest(managerName, requestXml);
    var xpath = "/nc:rpc-reply/nc:data/platform:platform/cert:certificate-mgmt/cert:trusted-ca-certs";
    return utilityService.extractSubtree(certificateResponse, apUtils.prefixToNsMap, xpath);
}

VirtualizerDeviceManager.prototype.getNAVTemplateData = function (manager, templateName, hwType, interfaceName) {
    var templateArgs = {
        "device-template": templateName,
        "hardware-type": hwType,
        "device-version": interfaceName
    }
    var requestContext = requestScope.get();
    var netConfFwk = requestContext.get("xFWK");
    var getConfigRequestXml = utilityService.processTemplate(resourceProvider.getResource(this.prefix + "getDeviceTemplate.xml.ftl"), templateArgs);
    var getConfigResponse = requestExecutor.executeNCWithManager(manager, getConfigRequestXml);
    if (getConfigResponse == null || getConfigResponse.getRawResponse() == null) {
        throw new RuntimeException("Execution Failed with error " + getConfigResponse);
    }
    try {
        var configElementFromGETResponse = utilityService.extractSubtree(getConfigResponse.getRawResponse(), netConfFwk.prefixToNsMap,
            "/nc:rpc-reply/nc:data/anv:device-manager/conftpl:configuration-templates");
        var devSpecData = [];
        devSpecData = utilityService.getAttributeValues(configElementFromGETResponse,
            "/nc:rpc-reply/nc:data/anv:device-manager/conftpl:configuration-templates/conftpl:configuration-template/conftpl:device-specific-data"
            , netConfFwk.prefixToNsMap);
        if (devSpecData.length > 0) {
            return devSpecData[0];
        } else {
            throw new RuntimeException("Cannot find device-specific-data for the template provided.. " + devSpecData);
        }
    }
    catch (e) {
        throw new RuntimeException("Invalid device template name provided. Template name '" + templateName + "' doesn't exist for hardware type '" + hwType + "' with interface version '" + interfaceName + "'.");
    }
}

VirtualizerDeviceManager.prototype.enableDisableDeviceSwLog = function (deviceName, manager, loglevel) {
    if (loglevel == "debug") {
        this.configureLogLevel(manager, deviceName, "merge", "device.software");
    } else if (loglevel == "default") {
        this.configureLogLevel(manager, deviceName, "remove", "device.software");
    }
}

VirtualizerDeviceManager.prototype.configureLogLevel = function (manager, deviceId, operation, application) {
    var args = {deviceId: deviceId, operation: operation, application: application};
    var requestXml = utilityService.processTemplate(resourceProvider.getResource(this.prefix + "configureDeviceLog.xml.ftl"), args);
    var message1 = "Execution Failed with No Response";
    var message2 = "Execution Failed with Error Response: ";
    this.executeEditConfigRequest(manager, deviceId, requestXml, message1, message2);
}

VirtualizerDeviceManager.prototype.updateExtraInfoByAttribute = function (syncInput, result, key, attributeLeaf) {
    var attributeValue = this.getValueFromIntentConfig(attributeLeaf);
    var attributeKeyValuePair = {};
    attributeKeyValuePair[attributeLeaf] = attributeValue;
    apUtils.setTopologyExtraInfo(result.getTopology(), key, JSON.stringify(attributeKeyValuePair));
}

VirtualizerDeviceManager.prototype.getValueFromIntentConfig = function (nodeName) {
    var requestContext = requestScope.get();
    var intentConfigJson = requestContext.get("intentConfigJson");
    return intentConfigJson[nodeName];
}

VirtualizerDeviceManager.prototype.updateExtraInfoByAttributeByDevice = function (syncInput, result, key, attributeLeaf, deviceName) {
    var attributeValue = this.getValueFromIntentConfigByDevice(attributeLeaf, deviceName);
    var attributeKeyValuePair = {};
    attributeKeyValuePair[attributeLeaf] = attributeValue;
    apUtils.setTopologyExtraInfo(result.getTopology(), key, JSON.stringify(attributeKeyValuePair));
}

VirtualizerDeviceManager.prototype.getValueFromIntentConfigByDevice = function (nodeName, deviceName) {
    var requestContext = requestScope.get();
    var intentConfigJson = requestContext.get("intentConfigJson");
    var deviceInfo = apUtils.getDeviceInfo(deviceName);
	if(deviceInfo["isLtDevice"] && intentConfigJson["boards"][deviceInfo["ltCard"]]){
		return intentConfigJson["boards"][deviceInfo["ltCard"]][nodeName];
	}
    return intentConfigJson[nodeName];
}

VirtualizerDeviceManager.prototype.isValidFileServer = function (imageFilePath) {
    return !(!this.getFileServerName(imageFilePath) || !this.getFileName(imageFilePath));

}

VirtualizerDeviceManager.prototype.updateEonuSwDetails = function (configObject, stepArgs, softwareRelease, swImages) {
    stepArgs[swImages] = {};
    if(configObject[softwareRelease]) {
        for (var index = 0; index < configObject[softwareRelease].length; index++) {
            var temp = [];
            if (this.isValidFileServer(configObject[softwareRelease][index]) && !configObject[softwareRelease][index].contains("://")) {
                temp["file-on-server"] = configObject[softwareRelease][index];
            } else {
                temp["software-url"] = configObject[softwareRelease][index];
            }
            if (temp["software-url"]) {
                if (temp["software-url"].indexOf("/") > -1) {
                    temp["swImageName"] = temp["software-url"].substring(temp["software-url"].lastIndexOf("/") + 1);
                } else {
                    temp["swImageName"] = temp["software-url"];
                }
            } else if (temp["file-on-server"]) {
                temp["fileServer"] = this.getFileServerName(temp["file-on-server"]);
                temp["fileName"] = this.getFileName(temp["file-on-server"]);
                temp["subDir"] = this.getSubDir(temp["file-on-server"]);
                temp["swImageName"] = temp["fileName"];
            }
            var eonuSoftware = {
                "swImageName": temp["swImageName"],
                "softwareUrl": temp["software-url"],
                "fileServer": temp["fileServer"],
                "fileName": temp["fileName"],
                "subDir": temp["subDir"]
            };
            stepArgs[swImages][eonuSoftware.swImageName] = eonuSoftware;
        }
    }
}

VirtualizerDeviceManager.prototype.updateSwDetails = function (configObject, stepArgs, software, softwareUrl, softwareFileServer, server, subDir, file, swImage) {
    if (this.isValidFileServer(configObject[software]) && !configObject[software].contains("://")) {
        stepArgs[softwareFileServer] = configObject[software];
    } else {
        stepArgs[softwareUrl] = configObject[software];
    }
    if (stepArgs[softwareUrl]) {
        if (stepArgs[softwareUrl].indexOf("/") > -1) {
            stepArgs[swImage] = stepArgs[softwareUrl].substring(stepArgs[softwareUrl].lastIndexOf("/") + 1);
        } else {
            stepArgs[swImage] = stepArgs[softwareUrl];
        }
    } else if (stepArgs[softwareFileServer]) {
        stepArgs[server] = this.getFileServerName(stepArgs[softwareFileServer]);
        stepArgs[file] = this.getFileName(stepArgs[softwareFileServer]);
        stepArgs[subDir] = this.getSubDir(stepArgs[softwareFileServer]);
        stepArgs[swImage] = stepArgs[file];
    }
}

VirtualizerDeviceManager.prototype.getFileServerName = function (fileOnServerString) {
    return fileOnServerString.substr(0, fileOnServerString.lastIndexOf(":"));
}

VirtualizerDeviceManager.prototype.getFileName = function (fileOnServerString) {
    if (fileOnServerString.lastIndexOf(":") == -1 || fileOnServerString.lastIndexOf("/") + 1) { //this condition handles Invalid: testServer:image and valid: imageName
        return fileOnServerString.substr(fileOnServerString.lastIndexOf("/") + 1, fileOnServerString.length);
    }
}

VirtualizerDeviceManager.prototype.getSubDir = function (fileOnServerString) {
    if (fileOnServerString.indexOf("/") != fileOnServerString.lastIndexOf("/")) {
        return fileOnServerString.substr(fileOnServerString.lastIndexOf(":") + 1,
            (fileOnServerString.lastIndexOf("/") - (fileOnServerString.lastIndexOf(":") + 1)));
    } else { // condition handles valid input: testServer:/L6GQAA53.017
        return "/";
    }
}

VirtualizerDeviceManager.prototype.executeEditConfigRequest = function (manager, deviceId, request, message1, message2) {
    var ncResponse = null;
    ibnLockService.executeWithReadLockOn(deviceId, function () {
        ncResponse = requestExecutor.executeNCWithManager(manager, request);
    }, function () {
        throw new RuntimeException("GC is in progress");
    });
    if (ncResponse == null) {
        throw new RuntimeException(message1);
    } else {
        if (!ncResponse.isOK()) {
            if (ncResponse.getException() != null) {
                throw ncResponse.getException();
            } else {
                if (ncResponse.getRawResponse() != null) {
                    logger.error(ncResponse.getRawResponse());
                    var errorContent = requestScope.get().get("xFWK").getErrorMessage(ncResponse.getRawResponse());
                    if (errorContent.errorObject != null) {
                        throw new RuntimeException(message2 + errorContent.errorObject + ":" + errorContent.errorMessage);
                    }
                    throw new RuntimeException(message2 + errorContent.errorMessage);
                }
            }
        }
    }
    return ncResponse;
}

VirtualizerDeviceManager.prototype.updateCertDetails = function (configObject, stepArgs, software, trustAnchorsAgs, manager, deviceName, certResponseNode) {
    var datapath = "/nc:rpc-reply/nc:data/platform:platform";
    if (!certResponseNode) {
        var args = {deviceName: deviceName};
        var requestXml = utilityService.processTemplate(resourceProvider.getResource(this.prefix + "getCertID.xml"), args);
        var response = apUtils.executeGetConfigRequest(manager, requestXml);
        var certResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/cert:certificate-mgmt/cert:trusted-ca-certs");
    } else {
        certResponse = certResponseNode;
    }
    if(software=="eonu-release" || software=="eonu-vendor-specific-release") {
        for (var s = 0; s < configObject[software].length; s++) {
            if (configObject[software][s].contains("https://")) {
                var cert_name = configObject[software][s].split("/")[2] + "-certCA";
                var cert_binary = utilityService.getAttributeValue(certResponse, datapath + "/cert:certificate-mgmt/cert:trusted-ca-certs/cert:certificate[cert:id='" + cert_name + "']/cert:cert-binary", apUtils.prefixToNsMap);
                if (cert_binary) {
                    stepArgs[trustAnchorsAgs] = {
                        "value": "sw_download_truststore",
                        "cert": cert_binary
                    }
                }
            } else if (!configObject[software][s].contains("//")) {
                var cert_binary_default = utilityService.getAttributeValue(certResponse, datapath + "/cert:certificate-mgmt/cert:trusted-ca-certs/cert:certificate[cert:id='file-server-certCA']/cert:cert-binary", apUtils.prefixToNsMap);
                if (cert_binary_default) {
                    stepArgs[trustAnchorsAgs] = {
                        "value": "sw_download_truststore",
                        "cert": cert_binary_default
                    }
                }
            }
        }
    }else{
        if (configObject[software].contains("https://")) {
            var cert_name = configObject[software].split("/")[2] + "-certCA";
            var cert_binary = utilityService.getAttributeValue(certResponse, datapath + "/cert:certificate-mgmt/cert:trusted-ca-certs/cert:certificate[cert:id='" + cert_name + "']/cert:cert-binary", apUtils.prefixToNsMap);
            if (cert_binary) {
                stepArgs[trustAnchorsAgs] = {
                    "value": "sw_download_truststore",
                    "cert": cert_binary
                }
            }
        } else if (!configObject[software].contains("//")) {
            var cert_binary_default = utilityService.getAttributeValue(certResponse, datapath + "/cert:certificate-mgmt/cert:trusted-ca-certs/cert:certificate[cert:id='file-server-certCA']/cert:cert-binary", apUtils.prefixToNsMap);
            if (cert_binary_default) {
                stepArgs[trustAnchorsAgs] = {
                    "value": "sw_download_truststore",
                    "cert": cert_binary_default
                }
            }
        }
    }
}
/**
 * This method will fetch the hardware type & interface version from device and compare with current values.
 * @param deviceName
 * @param currentDeviceVersion
 * @param currentHwType
 * @returns {string}
 */
VirtualizerDeviceManager.prototype.checkHardwareAndInterfaceVersionFromDevice = function (deviceName, currentDeviceVersion, currentHwType) {

    var templateArgs = {
        "deviceID": deviceName
    }
    var requestContext = requestScope.get();
    var netConfFwk = requestContext.get("xFWK");
    var getInterfaceAndHardwareXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getInterfaceAndHardware.xml.ftl"), templateArgs);
    var response = requestExecutor.executeNCWithManager(requestContext.get("ManagerInvolved"), getInterfaceAndHardwareXml);
    var datapath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceName + "\']";
    var deviceResponse = utilityService.extractSubtree(response.getRawResponse(), netConfFwk.prefixToNsMap,datapath);
    var hardwareType = utilityService.getAttributeValue(deviceResponse, datapath + "/adh:hardware-type", netConfFwk.prefixToNsMap);
    var interfaceVersion = utilityService.getAttributeValue(deviceResponse, datapath + "/adh:interface-version", netConfFwk.prefixToNsMap);
    var isErrorNeeded = "false";
    if(currentDeviceVersion !== interfaceVersion || currentHwType !== hardwareType){
        isErrorNeeded = "true";
    }
    return isErrorNeeded;
}

/**
 * @param deviceName
 * @param configObject
 * @param currentTopology
 * @returns {object}
 */
VirtualizerDeviceManager.prototype.getSyncDepedencyInfoForOamConnectivity = function (deviceName,configObject, currentTopology) {
    var allProfiles = requestScope.get().get("allProfiles");
    var syncDependencyInfos = {
        syncDependent: false,
        explicitlyUpdateDependentIntents: false
    }
    var keyArg = "create-device-" + deviceName + "_" + deviceName + "_ARGS";
    var deviceCreationExtra = apUtils.getTopologyExtraInfoFromTopology(currentTopology, keyArg, "deviceCreation");

    if(deviceCreationExtra){
        if (!deviceCreationExtra["fallback-oam-connectivity-account"] && configObject["fallback-oam-connectivity-account"]) {
            if (!deviceCreationExtra["main-oam-connectivity-account"] && configObject["main-oam-connectivity-account"]) {
                if (deviceCreationExtra["username"]) {
                    if (deviceCreationExtra["password"] || deviceCreationExtra["encrypted-password"]){
                        syncDependencyInfos.syncDependent = true;
                        syncDependencyInfos.explicitlyUpdateDependentIntents = true;
                    }
                }
            }
        } else if (deviceCreationExtra["fallback-oam-connectivity-account"] && !configObject["fallback-oam-connectivity-account"]) {
            if (deviceCreationExtra["main-oam-connectivity-account"] && !configObject["main-oam-connectivity-account"]) {
                if (configObject["username"]) {
                    if (configObject["password"] || deviceCreationExtra["encrypted-password"]) {
                        syncDependencyInfos.syncDependent = true;
                        syncDependencyInfos.explicitlyUpdateDependentIntents = true;
                    }
                }
            }
        } else if (deviceCreationExtra && configObject && configObject["main-oam-connectivity-account"]) {
            var allOAMProfiles = allProfiles["deviceOAMProfiles"];
            var newPassword;
            var oldPassword;
            if(deviceCreationExtra && deviceCreationExtra["encrypted-password"] ) {
                oldPassword = deviceCreationExtra["encrypted-password"]["value"];
            }
            for (let key in allOAMProfiles) {
                if(key == configObject["main-oam-connectivity-account"]) {
                    newPassword = allOAMProfiles[key]["oamEncryptedPassword"]["password"];
                }
            }
            if (newPassword != oldPassword) {
                syncDependencyInfos.syncDependent = true;
                syncDependencyInfos.explicitlyUpdateDependentIntents = true;
            }
        }
    }
    return syncDependencyInfos;
}

/**
 * This method will fetch the capability is node ip configuration supported in the actual device version
 * @param configObject
 * @param currentTopology
 * @param iHubConfigObject
 * @param iHubDeviceName
 * @returns {object}
 */
VirtualizerDeviceManager.prototype.isNodeIpSupportedCaps = function (configObject, currentTopology, iHubDeviceName, iHubConfigObject) {
    var hwTypeRelease;
    try {                                 
        var oltDevices = apUtils.getOltDeviceInfoFromMDS(iHubDeviceName);
    	hwTypeRelease = oltDevices[0].familyTypeRelease.substring(oltDevices[0].familyTypeRelease.lastIndexOf("-") + 1);                                                                                                  
    } catch (e) {
        hwTypeRelease = configObject["ihub-version"]?configObject["ihub-version"]:configObject["device-version"];                                                   
        logger.error("Error in getting device information from MDS",e);
    }
    return apCapUtils.getCapabilityValue(iHubConfigObject["hardware-type"], hwTypeRelease, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_NODE_IP_CONFIG_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
}

