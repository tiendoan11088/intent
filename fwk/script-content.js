



/**
* (c) 2020 Nokia. All Rights Reserved.
*
**/
load({ script: resourceProvider.getResource('internal/altiplano-intent-fwk.js'), name: 'altiplano-intent-fwk.js' });
load({ script: resourceProvider.getResource('internal/manager-specific/nv/createDevice/device-utilities.js'), name: 'internal/manager-specific/nv/createDevice/device-utilities.js' });
load({
    script: resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "virtualizer-device-mgmt.js"),
    name: intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "virtualizer-device-mgmt.js"
});
var ReinitializeOutput = Java.type('com.nokia.fnms.controller.ibn.intenttype.spi.ReinitializeOutput');
var apfwk = new AltiplanoIntentHelper();
var deviceUtilities = new DeviceUtilities();
var amsFwk = new AltiplanoAMSIntentHelper();

load({script: resourceProvider.getResource('internal/actions/device-families/device-software-operations/lightspan/handler.js'), name: 'internal/actions/device-families/lightspan/software-rollback/handler.js'});
var softwareActions = new SoftwareActions();

load({script: resourceProvider.getResource('internal/actions/device-families/restart/Lightspan/handler.js'), name: 'internal/actions/device-families/restart/Lightspan/handler.js'});
var restartAction = new RestartActionLS();
load({script: resourceProvider.getResource('internal/actions/device-families/switchover/lightspan/handler.js'), name: 'internal/actions/device-families/switchover/lightspan/handler.js'});
var switchoverLs = new switchoverUtil();

load({ script: resourceProvider.getResource('internal/altiplano-profile-migrate-fwk.js'), name: 'altiplano-profile-migrate-fwk.js' });
var internalLsResourcePrefix = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR;
var internalIsamResourcePrefix = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_ISAM + intentConstants.FILE_SEPERATOR;
var extensionConfigObject = {
    getDevicesInvolved: function () {
        var requestContext = requestScope.get();
        //Put service-profiles.json to request
        var intentConfigJson = requestContext.get("intentConfigJson");
        var nodeType = [intentConfigJson["hardware-type"], intentConfigJson["device-version"]].join('-');
        var managerInfo = mds.getManagerByName(intentConfigJson["device-manager"]);
        /*
        We check useProfileManager and throw error here to add extra validation where operator has older caps and using newer intent type
        */
        var useProfileManager = false;
        if(managerInfo && managerInfo.getType() == intentConstants.MANAGER_TYPE_NAV){
            var deviceName = requestContext.get("target");
            var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
            var boardServiceProfileResource = getServiceProfile(deviceName,nodeType,intentVersion);
            var boardServiceProfileJson = boardServiceProfileResource;
            useProfileManager = apCapUtils.getCapabilityValue(intentConfigJson["hardware-type"], intentConfigJson["device-version"], capabilityConstants.DEVICE_CATEGORY,
                capabilityConstants.ENFORCE_PROFILE_MANAGER_USAGE, capabilityConstants.HYPHEN_CONTEXT, false);
        } else if(managerInfo && managerInfo.getType() == intentConstants.MANAGER_TYPE_AMS){
            useProfileManager = apCapUtils.checkIfProfileManagerIsEnabled(null, nodeType, intentConstants.MANAGER_TYPE_AMS);
            var deviceFxProfiles;
            var deviceName = requestContext.get("target");
            var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
            var hardwareType = intentConfigJson["hardware-type"];
            var deviceRelease = intentConfigJson["device-version"]
            var deviceFxProfileList = new ArrayList();
            if (intentConfigJson["isam-oam-connectivity-account"]){
                var snmpProfileVO = intentProfileInputFactory.createIntentProfileInputVO(intentConfigJson["isam-oam-connectivity-account"], intentConstants.ISAM_PREFIX, profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT_ISAM.profileTypeIsam);
                deviceFxProfileList.add(snmpProfileVO);
            }
            if (deviceFxProfileList && deviceFxProfileList.length > 0) {
                deviceFxProfiles = loadSpecificProfiles(intentConstants.INTENT_TYPE_DEVICE_FX, intentVersion, deviceRelease, hardwareType, deviceFxProfileList);
                requestScope.get().put("deviceFxProfiles", deviceFxProfiles);
            }
        }
        if(!useProfileManager){
            throw new RuntimeException("Profile Manager is disabled as part of CAPS present in your system, get the updated CAPS to have profile manager supported to continue using this intent version.");
        }
        requestContext.put("serviceProfiles", boardServiceProfileJson);
        // Add the details into request scope
        requestContext.put("ponBoards", getPonBoards(requestContext.get("intentConfigJson")));
        var devices = [];
        var device = {};
        device[requestContext.get("target")] = {
            manager: intentConfigJson[intentConstants.DEVICE_MANAGER]
        };
        if (managerInfo && managerInfo.getType() == intentConstants.MANAGER_TYPE_NAV) {
            if (intentConfigJson && intentConfigJson["hardware-type"] && intentConfigJson["device-version"]) {
                familyTypeRelease = [intentConfigJson["hardware-type"], intentConfigJson["device-version"]].join('-');
            }
            var externalAlarmSupportedDevice = intentConstants.LS_FX_SUPPORTED_NT_DEVICES_219;
            var bestType = apUtils.getBestKnownTypeByFamilyType(familyTypeRelease, externalAlarmSupportedDevice);
            var deviceVersion = intentConfigJson["device-version"];
            if (bestType && bestType.contains("21.9")) {
                requestContext.put("alarmExternalSupported", true);
                var externalAlarmJson = getExternalAlarm(deviceVersion, intentConfigJson, deviceName);
                if (externalAlarmJson) {
                    requestContext.put("externalAlarmJson", externalAlarmJson);
                }
            } else {
                requestContext.put("alarmExternalSupported", null);
            }
            if (deviceVersion && apUtils.compareVersion(deviceVersion,"21.12") >= 0) {
                var externalAlarmScanPointDetail =[];
                var boards = intentConfigJson["boards"];
                if (boards) {
                    Object.keys(boards).forEach(function (board) {
                        var curBoard = boards[board];
                        if (curBoard["board-service-profile"] && curBoard["slot-name"].startsWith(intentConstants.ACU_BOARD)) {
                            var scanpointProfileName = getScanPointProfileName(curBoard["board-service-profile"], curBoard["slot-name"], deviceName, intentConfigJson);
                            var scanPointProfile = {scanProfileName: scanpointProfileName};
                            externalAlarmScanPointDetail.push(scanPointProfile);
                        }
                    });
                }
                if(externalAlarmScanPointDetail.length > 0) {
                    requestContext.put("externalAlarmScanPointDetail",externalAlarmScanPointDetail);
                } else {
                    requestContext.put("alarmExternalSupported", null);
                }
            }
            var profileFx = loadDeviceFxIntentProfilesFromProfileManager(deviceName, nodeType, intentVersion, requestScope.get().get("validateContext"));
            requestScope.get().put("allProfiles", profileFx);
        }
        devices.push(device);
        var result = apfwk.gatherInformationAboutDevices(devices);
        if (intentConfigJson["hardware-type"] && deviceVersion) {
            var shelfRegEx = "([A-Z]+)-([A-Z]+)-([A-Z]+-[A-Z])-([A-Z0-9-.]*)";
            var matches = intentConfigJson["hardware-type"].match(shelfRegEx);
            let deviceVersionForCaps = deviceVersion;
            if (managerInfo && managerInfo.getType() == intentConstants.MANAGER_TYPE_NAV) {
                deviceVersionForCaps = apUtils.getDeviceVersionForCaps(requestContext.get("target"), deviceVersion);
            }
            var isClockMgmtSupportedForNT = apCapUtils.getCapabilityValue(intentConfigJson["hardware-type"], deviceVersionForCaps, capabilityConstants.BOARD_CATEGORY,capabilityConstants.IS_CLOCK_MGMT_SUPPORTED, matches[3], false);
            var isClockGNSSInterfaceSupportedForNT = apCapUtils.getCapabilityValue(intentConfigJson["hardware-type"], deviceVersionForCaps, capabilityConstants.BOARD_CATEGORY,capabilityConstants.IS_CLOCK_GNSS_INTERFACE_SUPPORTED, matches[3], false);
            var isClockGNSSDedicatedInOutSupportedForNT = apCapUtils.getCapabilityValue(intentConfigJson["hardware-type"], deviceVersionForCaps, capabilityConstants.BOARD_CATEGORY,capabilityConstants.IS_CLOCK_GNSS_DEDICATED_INOUT_SUPPORTED, matches[3], false);
            var isClockBITSInterfaceSupportedForNT = apCapUtils.getCapabilityValue(intentConfigJson["hardware-type"], deviceVersionForCaps, capabilityConstants.BOARD_CATEGORY,capabilityConstants.IS_CLOCK_BITS_INTERFACE_SUPPORTED, matches[3], false);
            var isTimeZoneNameSupported = apCapUtils.getCapabilityValue(intentConfigJson["hardware-type"], deviceVersionForCaps, capabilityConstants.DEVICE_CATEGORY,capabilityConstants.IS_TIME_ZONE_NAME_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            var isBoardAdminStateSupported = apCapUtils.getCapabilityValue(intentConfigJson["hardware-type"], deviceVersionForCaps, capabilityConstants.DEVICE_CATEGORY,capabilityConstants.IS_BOARD_ADMIN_STATE_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            var dynamicPortUsage = utilityService.getEnvironmentValue(intentConstants.DYNAMIC_NETCONF_PORT_USAGE);
            if(dynamicPortUsage != null && dynamicPortUsage == "true") {
               requestContext.put("disableDefaultPortCheck", true);
            }
            requestContext.put("isClockMgmtSupportedForNT", isClockMgmtSupportedForNT);
            requestContext.put("isClockGNSSInterfaceSupportedForNT", isClockGNSSInterfaceSupportedForNT);
            requestContext.put("isClockGNSSDedicatedInOutSupportedForNT", isClockGNSSDedicatedInOutSupportedForNT);
            requestContext.put("isClockBITSInterfaceSupportedForNT", isClockBITSInterfaceSupportedForNT);
            requestContext.put("isTimeZoneNameSupported", isTimeZoneNameSupported);
            requestContext.put("isBoardAdminStateSupported", isBoardAdminStateSupported);
        }
        return result;
    },
    getKeyForList: function (listName) {
        switch (listName) {
            case "label":
                return ["category", "value"];
            case "boards":
                return ["slot-name"];
            case "eonu-release":
                return "yang:leaf-list";
            case "eonu-vendor-specific-release":
                return "yang:leaf-list";
            case "duid":
                return "yang:leaf-list";
            case "onu-active-software-mapping":
                return ["index"];
            case "onu-passive-software-mapping":
                return ["index"];
            case "onu-software":
                return ["software-type", "target-release", "target-software-control"];
            case "label":
                return "yang:leaf-list";
            default:
                return null;
        }
    },
    getIntentConfigFor: function (deviceInfo, input) {
        if (deviceInfo["managerType"] == intentConstants.MANAGER_TYPE_NAV) {
            var requestContext = requestScope.get();
            var intentConfigJson = requestScope.get().get("intentConfigJson");
            var boards = intentConfigJson["boards"];
            if (intentConfigJson["duid"]) {
                intentConfigJson["callHome"] = true;
                if (intentConfigJson["duid"][1]) {
                    intentConfigJson["duid2"] = intentConfigJson["duid"][1];
                }
                if (intentConfigJson["duid"][0]) {
                    intentConfigJson["duid"] = intentConfigJson["duid"][0];
                }

            }
            if (boards) {
                var ltDevicesReset = [];
                var hardwareType = intentConfigJson[intentConstants.HARDWARE_TYPE];
                var deviceVersion = intentConfigJson[intentConstants.DEVICE_VERSION];
                var deviceName = requestContext.get("target");
                var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
                var nodeType = [intentConfigJson["hardware-type"], intentConfigJson["device-version"]].join('-');
                if (hardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_G) || hardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_H) || hardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_M)) {
                    var topology = input.getCurrentTopology();
                    if (topology) {
                        var xtraInfos = apUtils.getTopologyExtraInfo(topology);
                        if (xtraInfos && xtraInfos["LT_DEVICES"] && xtraInfos["LT_DEVICES"] !== "undefined") {
                            var oldBoards = JSON.parse(xtraInfos["LT_DEVICES"]);
                        }
                    }
                    var boardServiceProfileResource = getServiceProfile(deviceName, nodeType, intentVersion);
                    Object.keys(boards).forEach(function (board) {
                        var currentBoard = boards[board];
                        var slotName = currentBoard["slot-name"];
                        var boardServiceProfile = currentBoard["board-service-profile"];
                        var plannedType = currentBoard["planned-type"];
                        var isBoardTypeLT = apCapUtils.isValueInCapability(hardwareType, deviceVersion, capabilityConstants.BOARD_CATEGORY, "slot-type", plannedType, "LT");
                        var backplaneKrSupported = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.SUPPORTED_BACKPLANE_KR_CAPABILITY, plannedType, false);

                        if (isBoardTypeLT && (backplaneKrSupported != false)) {
                            if (boardServiceProfile) {
                                var boardType = getBoardTypeFromPlannedType(hardwareType, plannedType, deviceVersion, slotName);
                                var boardServiceProfiles = apUtils.getBoardServiceProfilesForNAVManager(boardServiceProfileResource, intentConstants.LS_FX_PREFIX, boardType, null, true);
                                var backplaneKrCapability = boardServiceProfiles[boardServiceProfile]["backplane-kr-capability"];
                                intentConfigJson["boards"][board]["backplane-kr-capability"] = { "value": backplaneKrCapability};
                                if (oldBoards && oldBoards[board]) {
                                    if (backplaneKrCapability != oldBoards[board]["backplane-kr-capability"]["value"]) {
                                        ltDevicesReset.push(deviceInfo.name + intentConstants.FX_DEVICE_SEPARATOR + board);
                                    }
                                }
                            }
                        }
                    });
                }
            }
            requestContext.put("ltDevicesReset", ltDevicesReset);
            var virtualizerDeviceManager = new VirtualizerDeviceManager();
            deviceUtilities.getDuidFromDevice(deviceInfo.name, intentConfigJson);
            try {
                return virtualizerDeviceManager.createIntentConfigForLSFX(deviceInfo, input, intentConfigJson);
            } catch (e) {
                logger.error("Error when creating intent: {} - Error: {}", JSON.stringify(deviceInfo), e);
                if (e.message && e.message.contains("createIntentConfigForLSFX is not a function")) {
                    /**
                     *  Reload JS & initialize
                     */
                    load({
                        script: resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "virtualizer-device-mgmt.js"),
                        name: intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "virtualizer-device-mgmt.js"
                    });
                    var virtualizerDeviceManagerRetry = new VirtualizerDeviceManager();
                    return virtualizerDeviceManagerRetry.createIntentConfigForLSFX(deviceInfo, input, intentConfigJson);
                } else {
                    throw new RuntimeException("Error while creating intent ", e);
                }
            }
        } else {
            var configFactoryFunction = load({
                script: resourceProvider.getResource("internal/isam/createDeviceFX.js"),
                name: "internal/isam/createDeviceFX.js"
            });
            return configFactoryFunction(deviceInfo, input);
        }
    },
    getExtraContainer: function(){
        return ["geo-coordinates"];
    }
};
apfwk.setExtensionConfig(extensionConfigObject);



function synchronize(input) {
    
    var networkState = input.getNetworkState().name();

    if (networkState !== "delete") {
        var intentConfigArgs = {};
        apUtils.getIntentConfigArgs(intentConfigArgs, input, this.extensionConfigObject.getExtraContainer());

        var target = input.getTarget();
        var managerInfo = mds.getManagerByName(intentConfigArgs["device-manager"]).getType().name();

        if (managerInfo != intentConstants.MANAGER_TYPE_AMS) {
            // update label MDS
            if (intentConfigArgs['label']) {
                apUtils.updateLabels(target, intentConfigArgs['label'], intentConstants.LABEL_MODE_EXECUTE);
            }
        }
    }
    return apfwk.synchronize(input);
}

function audit(input) {
    var intentConfigArgs = {};
    apUtils.getIntentConfigArgs(intentConfigArgs, input, this.extensionConfigObject.getExtraContainer());

    var target = input.getTarget()
    var label = apUtils.getLabelsForDevices(target);
    var labelsIntentConfig = intentConfigArgs['label'];
    var auditLabel = apUtils.commpareLabels(label, labelsIntentConfig)
    var auditResult = apfwk.audit(input)
    if (auditLabel && auditLabel["undesiredLabel"]) {
        for ( index in auditLabel["undesiredLabel"] ) {
            auditResult.addMisAlignedObject(auditFactory.createMisAlignedObject(auditLabel["undesiredLabel"][index], false, target, true));
        }
    } if (auditLabel && auditLabel["misalignedLabel"]) {
        for ( index in auditLabel["misalignedLabel"]) {
            auditResult.addMisAlignedObject(auditFactory.createMisAlignedObject(auditLabel["misalignedLabel"][index], false, target));
        }
    }
    return auditResult
}

function suggestDeviceNames(context) {
    return apUtils.suggestDeviceNamesByDeviceTypes(context, ["iSAM.6.2"]);
}

function suggestNtLtSlotFilter(context) {
    let listLTNames, listNTNames = [];
    let inputValues = context.getInputValues();
    let deviceName = inputValues.target;

    let extractedNodeLT = apUtils.getExtractedDeviceSpecificDataNode(internalLsResourcePrefix + "getLTList.xml.ftl", { "deviceID": deviceName });
    let extractedNodeNT = apUtils.getExtractedDeviceSpecificDataNode(internalLsResourcePrefix + "getNTAndNTIOList.xml.ftl", { "deviceID": deviceName });
    if (extractedNodeLT) {
        let xpath = "hw:hardware-state/hw:component/hw:name[starts-with(., 'Board')]/text()"
        listLTNames = utilityService.getAttributeValues(extractedNodeLT, xpath, apUtils.prefixToNsMap);
        if (listLTNames && listLTNames.length > 0) {
            var listLTNamesResult = [];
            listLTNames.forEach((item) => {
                if (item.indexOf("Board-") != -1) {
                    item = item.split("Board-")[1];
                }
                listLTNamesResult.push(item);
            });
        }
    }
    if (extractedNodeNT) {
        let xpath = "hw:hardware-state/hw:component/hw:name/text()"
        listNTNames = utilityService.getAttributeValues(extractedNodeNT, xpath, apUtils.prefixToNsMap);
        if (listNTNames && listNTNames.length > 0) {
            var listNTNamesResult = [];
            listNTNames.forEach((item) => {
                if (item.indexOf("Board-") != -1) {
                    item = item.split("Board-")[1];
                } else if (item.indexOf("_board") != -1) {
                    item = item.split("_board")[0];
                    if (item.indexOf("Slot-") != -1) {
                        item = item.split("Slot-")[1];
                    }
                }
                listNTNamesResult.push(item.toUpperCase());
            });
        }
    }

    if (listLTNamesResult && listNTNamesResult) {
        return apUtils.convertToSuggestReturnFormat(["NT"].concat(listLTNamesResult, listNTNamesResult), context.getSearchQuery());
    } else if (listNTNamesResult) {
        return apUtils.convertToSuggestReturnFormat(["NT"].concat(listNTNamesResult), context.getSearchQuery());
    } else if (listLTNamesResult) {
        return apUtils.convertToSuggestReturnFormat(listLTNamesResult, context.getSearchQuery());
    } else {
        return apUtils.convertToSuggestReturnFormat(["NT"], context.getSearchQuery());
    }
}

function suggestEntity(context) {
    var deviceName = [];
    var inputValues = context.getInputValues();
    deviceName.push(inputValues.target);
    return apUtils.convertToSuggestReturnFormat(deviceName, context.getSearchQuery());;
}

function getSFPDiagnosticsAndInventoryOnDev(actionInput) {
    var intentConfigJson = {};
    var namespace = "http://www.nokia.com/management-solutions/sfp-status";
    apUtils.convertIntentConfigXmlToJson(actionInput.getIntentConfiguration(), extensionConfigObject.getKeyForList, intentConfigJson);

    // Get data from action input
    var deviceName = DocumentUtils.getDirectChildElement(actionInput.getActionTreeElement(), "entity", namespace).getTextContent();
    var boardNameElement = DocumentUtils.getDirectChildElement(actionInput.getActionTreeElement(), "slot-filter", namespace);
    var managerName = intentConfigJson[intentConstants.DEVICE_MANAGER];
    var managerType = mds.getManagerByName(managerName).getType().name();
    var prefixHarwareType = "LS-FX";
    
    if (managerType && managerType == intentConstants.MANAGER_TYPE_NAV) {
        load({ script: resourceProvider.getResource('internal/actions/device-families/sfp-action/lightspan/handler.js'), name: 'internal/actions/device-families/sfp-action/lightspan/handler.js' });
        var sfpAction = new sfpUtilLS(null, "internal/actions/device-families/sfp-action/lightspan/", namespace);
        if(boardNameElement) {
            var boardName = boardNameElement.getTextContent();
            if (boardName.indexOf("LT") != -1) {
                boardName = "Board-" + boardName;
            } else if (boardName.indexOf("NTA") != -1 || boardName.indexOf("NTB") != -1) {
                boardName = "Board-" + apUtils.toUpperFirst(boardName);
            } else if (boardName.indexOf("NTIO") != -1) {
                boardName = "Slot-" + apUtils.toUpperFirst(boardName) + "_board";
            }
            return sfpAction.getSFPDiagnosticsAndInventoryForDeviceLevel(deviceName, boardName, prefixHarwareType, intentConfigJson);
        } else {
            return utilityService.buildErrorActionResponse("A slot is required to proceed with this action from a device intent.");
        }
    } else {
        return utilityService.buildErrorActionResponse("This action is only supported on this intent when the device is managed by the Network Virtualizer.");
    }
}

function getScanPointProfileName(name, boardType, deviceName, intentConfigJson){
    var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
    var nodeType = [intentConfigJson["hardware-type"], intentConfigJson["device-version"]].join('-');
    var boardServiceProfileResource = getServiceProfile(deviceName,nodeType,intentVersion);
    var boardSubType = "LS-FX-ACU";
    var boardServiceProfiles = apUtils.getBoardServiceProfilesForNAVManager(boardServiceProfileResource, intentConstants.LS_FX_PREFIX,intentConstants.ACU_BOARD,boardSubType, true);
    for(var profile in boardServiceProfiles){
        if(boardServiceProfiles[profile]["name"]== name)
            return boardServiceProfiles[profile]["scan-point-profile"];
    }
}

function getTargettedDevices(input) {
    var targettedDevices = new ArrayList();
    var deviceName = input.getTarget();
    targettedDevices.add(deviceName);
    var intentConfigXml = input.getIntentConfiguration();
    var intentConfigJson = {};
    apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.extensionConfigObject.getKeyForList, intentConfigJson, null, ["geo-coordinates"]);
    if (intentConfigJson["hardware-type"].startsWith(intentConstants.LS_FX_PREFIX)) {
        targettedDevices.add(deviceName + intentConstants.DOT_LS_FX_IHUB);
        var intentConfigXml = input.getIntentConfiguration();
        var intentConfigJson = {};
        apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.extensionConfigObject.getKeyForList, intentConfigJson);
        if (intentConfigJson["boards"]) {
            var ltDevices = Object.keys(intentConfigJson["boards"]);
            for (var i = 0; i < ltDevices.length; i++) {
                if (ltDevices[i].startsWith(intentConstants.FX_LT_STRING)) {
                    targettedDevices.add(deviceName + "." + ltDevices[i]);
                }
            }
        }
    }
    apUtils.checkIfTargettedDevicesIsEmptyAndThrowException(targettedDevices, intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
    return targettedDevices;
}

function validate(input) {
    var validateContext = {};
    return apUtils.validate(input, validateCallback,validateContext);
}


function validatePlannedType(intentConfigArgs) {
    var boards = intentConfigArgs["boards"];
    if (boards) {
        var hardwareType = intentConfigArgs["hardware-type"];
        var deviceVersion = intentConfigArgs["device-version"];
        var nwSlicingUserType = apUtils.getNetworkSlicingUserType();
        Object.keys(boards).forEach(function (boardName) {
            var board = boards[boardName];
            var slotName = board["slot-name"];
            var plannedType = board["planned-type"];
            var boardVersion = board["device-version"];

            if (!plannedType) {
                throw new RuntimeException("Slot Name " + boardName + " is missing Planned Type");
            }
            var isEthBoard = false;
            if (slotName.startsWith(intentConstants.LT_STRING)) {
                var portType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, plannedType, []);
                if (portType && portType.length > 0 && portType.indexOf(capabilityConstants.ETHERNET_ALIAS) >= 0) {
                    isEthBoard = true;
                }
            }

            if (nwSlicingUserType !== intentConstants.NETWORK_SLICING_USER_TYPE_NON_SLICING
                && (isEthBoard)) {
                throw new RuntimeException("Network slicing is not supported for {} Planned Type", plannedType);
            }
            
            var supportedType = getBoardSupportedByPlannedType(slotName, hardwareType, deviceVersion);
            
            if (supportedType.indexOf(plannedType) < 0 && plannedType !== "-") {
                throw new RuntimeException("Planned Type " + plannedType + " is not supported by Slot Name " + slotName);
            }
        });
    }
}

function validatePlannedTypeSupportUpgradeSoftware(intentConfigArgs, contextualErrorJsonObj) {
    var boards = intentConfigArgs["boards"];
    if (boards) {
        Object.keys(boards).forEach(function (boardName) {
            var board = boards[boardName];
            var plannedType = board["planned-type"];
            var softwareManagement = JSON.parse(resourceProvider.getResource(internalLsResourcePrefix + "software-management.json"));
            if (plannedType && (board["active-software"] || board["passive-software"])) {
                var supportedBoard = softwareManagement["supported-boards"];
                if (!(softwareManagement && supportedBoard && typeof supportedBoard.indexOf === "function" && supportedBoard.indexOf(plannedType) > -1)) {
                    var keyMess = "list#boards," + board["slot-name"] + ",leaf#planned-type";
                    contextualErrorJsonObj[keyMess] = "This board has planned-type " + plannedType + " that is not supported for software upgrade";
                }
            }
        });
    }
}



function validateBoardTypeChanged(input, intentConfigArgs, contextualErrorJsonObj,deviceName) {
    var boards = intentConfigArgs["boards"];
    var deviceVersion = intentConfigArgs["device-version"];
    var topology = input.getCurrentTopology();
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        var xtraInfos = apUtils.getTopologyExtraInfo(topology);
	if(xtraInfos["LT_DEVICES"] && xtraInfos["LT_DEVICES"] !== "undefined") {
            ValidateNtioforDependentUplinkPorts(xtraInfos["LT_DEVICES"],boards,deviceName,intentConfigArgs);
        }    
        if (xtraInfos["BOARD_LIST"] && xtraInfos["BOARD_LIST"] !== "undefined" && boards) {
            var oldBoards = JSON.parse(xtraInfos["BOARD_LIST"]);
            Object.keys(boards).forEach(function (board) {
                var oldBoard = oldBoards[board];
                var newBoard = boards[board];
                if (oldBoard && oldBoard["planned-type"] && newBoard["planned-type"] !== "-" && oldBoard["planned-type"] !== "-" && newBoard["planned-type"]
                        && oldBoard["planned-type"] !== newBoard["planned-type"]) {
                    throw new RuntimeException("Intent does not support update Planned Type, please try to remove/add new");
                }
            });

        } else if (xtraInfos["LT_DEVICES"] && xtraInfos["LT_DEVICES"] !== "undefined" && boards) {
            var oldBoards = JSON.parse(xtraInfos["LT_DEVICES"]);
            Object.keys(boards).forEach(function (board) {
                var oldBoard = oldBoards[board];
                var newBoard = boards[board];
                if (oldBoard && oldBoard["slot-name"] && oldBoard["slot-name"].startsWith("LT") && oldBoard["planned-type"] && newBoard["planned-type"] !== "-" && oldBoard["planned-type"] !== "-" && newBoard["planned-type"]
                        && oldBoard["planned-type"] !== newBoard["planned-type"]) {
                            var hwType = "LS-FX-" + oldBoard["planned-type"];
                            var isEthBoard = false;
                            var portType = apCapUtils.getCapabilityValue(intentConfigArgs["hardware-type"], deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, oldBoard["planned-type"], []);
                            if (portType && portType.length > 0 && portType.indexOf(capabilityConstants.ETHERNET_ALIAS) >= 0) {
                                isEthBoard = true;
                            }
                            if(isEthBoard && oldBoard["board-service-profile"]){
                                var deviceDetails = {};
                                deviceDetails["useProfileManager"] = true;
                                deviceDetails["deviceName"] = deviceName;
                                deviceDetails["nodeType"] = intentConfigArgs["hardware-type"] + "-" + deviceVersion;
                                deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
                                deviceDetails["intentTypeVersion"] = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
                                deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);
                                var boardServiceProfileObj = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", oldBoard["board-service-profile"], deviceDetails);
                                if(boardServiceProfileObj["model"] === "uplink-mode"){
                                    hwType = hwType + "-" + intentConstants.UP_LINK_HW_TYPE_POSTFIX;
                                }else if(boardServiceProfileObj["model"] === "downlink-mode"){
                                    hwType = hwType + "-" + intentConstants.DOWN_LINK_HW_TYPE_POSTFIX;
                                }
                            }

                            if (oldBoard["device-version"] && oldBoard["device-version"] != null) {
                                deviceVersion = oldBoard["device-version"];
                            }
                            var supportedType = apCapUtils.getCapabilityValue(hwType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.COMPATIBLE_BOARDS, oldBoard["planned-type"], []);
                            if (supportedType.indexOf(newBoard["planned-type"]) < 0) {
                                var keyMess = "list#boards," + oldBoard["slot-name"] + ",leaf#planned-type";
                                contextualErrorJsonObj[keyMess] = newBoard["planned-type"] + " is not a compatible board to replace " + oldBoard["planned-type"];
                            }
                }
            });
        }
    }
}

function ValidateFNIOforDependentUplinkPorts(hwType,deviceRelease,nameOfBoard,deviceName,isNtioConfigured,configuredSlotName) {
    
    var intents = topologyQueryService.getDependentIntents(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
    if (intents && !intents.isEmpty()) {
        for(var i = 0; i < intents.length; i++) {
            var intent = intents[i];
            if(intent.getIntentType() === intentConstants.INTENT_TYPE_UPLINK_CONNECTION) {
                var uplinkIntentConfiguration = {};
                var uplinkIntent = apUtils.getIntent(intentConstants.INTENT_TYPE_UPLINK_CONNECTION,deviceName);
                if(uplinkIntent) {
                    var uplinkIntentKeyForListFunction = function (listName) {
                        switch (listName) {
                            case "uplink-ports":
                                return "port-id";
                            default:
                                return null;
                        }
                    };
                    var uplinkIntentConfig = uplinkIntent.getIntentConfig();
                    apUtils.convertIntentConfigXmlToJson(uplinkIntentConfig, uplinkIntentKeyForListFunction, uplinkIntentConfiguration);
                    if(uplinkIntentConfiguration["uplink-ports"]) {
                        Object.keys(uplinkIntentConfiguration["uplink-ports"]).forEach(function (portId) {
                            var suppportedSlotType = apCapUtils.getCapabilityValue(hwType, deviceRelease, capabilityConstants.PORT_MAPPING_CATEGORY, "supported-slot-type", portId, false)[0];
                            var supportedCageFactor = apCapUtils.getCapabilityValue(hwType, deviceRelease, capabilityConstants.PORT_MAPPING_CATEGORY, "cage-form-factor", portId, false)[0];
                            if(isNtioConfigured == true) {
                                if(suppportedSlotType == configuredSlotName) {
                                    throw new RuntimeException(nameOfBoard + " has dependent uplink-connection intent configured on " + portId + "port . Try removing respective uplink ports.");    
                                }
                            }
                            else {
                                if(suppportedSlotType == "NTA" || suppportedSlotType == "NTB") {
                                    if(supportedCageFactor == "qsfp28") {
                                        throw new RuntimeException("NT-QSFP and NTIO ports are mutually exclusive. Try removing NT-QSFP ports configured on uplink connection intent");
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }
    }
}

function ValidateNtioforDependentUplinkPorts(oldBoard,newBoard,deviceName,intentConfigArgs) {
    var isNtioConfigured = true;
    oldBoard = JSON.parse(oldBoard);
    if(oldBoard) {
        Object.keys(oldBoard).forEach(function (board) {
            if(oldBoard[board] && oldBoard[board]["slot-name"] && oldBoard[board]["planned-type"]) {
		        var slotType = apCapUtils.isValueInCapability(intentConfigArgs["hardware-type"], intentConfigArgs["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.SLOT_TYPE, oldBoard[board]["planned-type"], "NTIO");    
                if(slotType) {
                    if(!(newBoard && newBoard[board])) {
                        var nameOfBoard = oldBoard[board]["planned-type"];
                        var configuredSlotName = oldBoard[board]["slot-name"];
                        var nodeType = [intentConfigArgs["hardware-type"], intentConfigArgs["device-version"]].join('-');
                        var deviceType = apUtils.splitToHardwareTypeAndVersion(nodeType);
                        if (nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_F)) {
                            var port = nodeType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_F, "").split("-")[0];
                            var ihubHwType = intentConstants.FAMILY_TYPE_IHUB_FANT_F_FX + port;
                        } else if (nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_G)) {
                            var port = nodeType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_G, "").split("-")[0];
                            var ihubHwType = intentConstants.FAMILY_TYPE_IHUB_FANT_G_FX + port;
                        } else if (nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_H)) {
                            var port = nodeType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_H, "").split("-")[0];
                            var ihubHwType = intentConstants.FAMILY_TYPE_IHUB_FANT_H_FX + port;
                        } else if (nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_M)) {
                            var port = nodeType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_M, "").split("-")[0];
                            var ihubHwType = intentConstants.FAMILY_TYPE_IHUB_FANT_M_FX + port;
                        }
                        ValidateFNIOforDependentUplinkPorts(ihubHwType,deviceType.release,nameOfBoard,deviceName,isNtioConfigured,configuredSlotName);
                    }
                }
            }
        });
    }
}

function getDeletedBoard(oldBoards, newBoards, oldBoardsDetail, boardVariable, deviceVersion) {
    var deletedBoards = [];
    if (newBoards != null) {
        oldBoards.forEach(function (board) {
            if (!newBoards[board] || (newBoards[board]["planned-type"] && newBoards[board]["planned-type"] === "-" ) ||
                (oldBoardsDetail && oldBoardsDetail != null && oldBoardsDetail[board]
                 && newBoards[board] && newBoards[board]["planned-type"] != oldBoardsDetail[board]["planned-type"])) {
                if (boardVariable && boardVariable == "BOARD_LIST") {
                    //check compatible boards with CAPS
                    var compatibleBoards = apCapUtils.getCapabilityValue(intentConstants.FAMILY_TYPE_ISAM, deviceVersion,
                        capabilityConstants.BOARD_CATEGORY, capabilityConstants.COMPATIBLE_BOARDS, oldBoardsDetail[board]["planned-type"], []);
                    if (!compatibleBoards || !newBoards[board] || (compatibleBoards && newBoards[board] && compatibleBoards.indexOf(newBoards[board]["planned-type"]) == -1)) {
                        deletedBoards.push(board);
                    }
                }else{
                    deletedBoards.push(board);
                }
            }
        });
    } else {
        deletedBoards = oldBoards;
    }
    return deletedBoards;
}

function validateRemovedBoardsOnFiberIntent(input, intentConfigArgs) {
    var boards = intentConfigArgs["boards"];
    if (typeof boards === "undefined") {
        boards = [];
    }
    var topology = input.getCurrentTopology();
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        var xtraInfos = apUtils.getTopologyExtraInfo(topology);
        if (xtraInfos["BOARD_LIST"] && xtraInfos["BOARD_LIST"] !== "undefined") {
            var oldBoards = JSON.parse(xtraInfos["BOARD_LIST"]);
            var deletedBoards = getDeletedBoard(Object.keys(oldBoards), boards, oldBoards, "BOARD_LIST", intentConfigArgs["device-version"]);
            if(deletedBoards){
                var resourceFile = resourceProvider.getResource(internalLsResourcePrefix + "esQueryFiberIntents.json.ftl");
                var templateArgs={deviceId:input.getTarget()};
                var request = utilityService.processTemplate(resourceFile, templateArgs);
                var response = JSON.parse(esQueryService.queryESIntentsByIntentType(intentConstants.INTENT_TYPE_FIBER, request));
                if(response.hits.total.value != 0){
                    var fibers = response.hits.hits;
                    fibers.forEach(function (fiber) {
                        var fiberName = fiber["_id"].split("_$$_")[1];
                        var ponIDs = fiber["_source"].configuration["pon-id"];
                        if(ponIDs) {
                            ponIDs.forEach(function (ponID) {
                                if(ponID && deletedBoards.indexOf(ponID.split(".")[0]) >= 0){
                                    throw new RuntimeException("1 dependent intents should be removed first: fiber: "+ fiberName);
                                }
                            });
                        }
                    });
                }
            }
        }
    }
}

function validateRemovedBoardsOnEthernetConnectionIntent(input, intentConfigArgs, boardVariable) {
    var boards = intentConfigArgs["boards"];
    if (typeof boards === "undefined") {
        boards = [];
    }
    var topology = input.getCurrentTopology();
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        var xtraInfos = apUtils.getTopologyExtraInfo(topology);
        var deletedBoards;
        if (xtraInfos[boardVariable] && xtraInfos[boardVariable] !== "undefined") {
            var oldBoards = JSON.parse(xtraInfos[boardVariable]);
            if (boardVariable && boardVariable == "BOARD_LIST"){
                deletedBoards = getDeletedBoard(Object.keys(oldBoards), boards, oldBoards, "BOARD_LIST", intentConfigArgs["device-version"]);
            }else{
                deletedBoards = getDeletedBoard(Object.keys(oldBoards), boards);
            }

            if(deletedBoards){
                var resourceFile = resourceProvider.getResource(internalIsamResourcePrefix + "esQueryEthernetConnectionIntents.json.ftl");
                var templateArgs={deviceId:input.getTarget()};
                var request = utilityService.processTemplate(resourceFile, templateArgs);
                var response = JSON.parse(esQueryService.queryESIntentsByIntentType(intentConstants.INTENT_TYPE_ETHERNET_CONNECTION, request));
                if(response.hits.total.value != 0){
                    var ethernetConnections = response.hits.hits;
                    ethernetConnections.forEach(function (ethernetConnection) {
                        var ethernetConnectionId = ethernetConnection["_id"].split("_$$_")[1];
                        var ethernetConnectionDevice = ethernetConnectionId.split("_$_")[0];
                        var ethernetConnectionName = ethernetConnectionId.split("_$_")[1];
                        var ponIDs = ethernetConnection["_source"].configuration["port-id"];
                        if(ponIDs) {
                            ponIDs.forEach(function (ponID) {
                                if(ponID && deletedBoards.indexOf(ponID.split(".")[0]) >= 0){
                                    throw new RuntimeException("1 dependent intents should be removed first: ethernet-connection: "+ ethernetConnectionDevice +"#"+ ethernetConnectionName);
                                }
                            });
                        }
                    });
                }
            }
        }
    }
}

function validateRemovedBoardsOnCopperConnectionIntent(input, intentConfigArgs) {
    var boards = intentConfigArgs["boards"];
    if (typeof boards === "undefined") {
        boards = [];
    }
    var topology = input.getCurrentTopology();
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        var xtraInfos = apUtils.getTopologyExtraInfo(topology);
        if (xtraInfos["BOARD_LIST"] && xtraInfos["BOARD_LIST"] !== "undefined") {
            var oldBoards = JSON.parse(xtraInfos["BOARD_LIST"]);
            var deletedBoards = getDeletedBoard(Object.keys(oldBoards), boards, oldBoards, "BOARD_LIST", intentConfigArgs["device-version"]);
            if(deletedBoards){
                var resourceFile = resourceProvider.getResource(internalIsamResourcePrefix + "esQueryCopperConnectionIntents.json.ftl");
                var templateArgs={deviceId:input.getTarget()};
                var request = utilityService.processTemplate(resourceFile, templateArgs);
                var response = JSON.parse(esQueryService.queryESIntentsByIntentType(intentConstants.INTENT_TYPE_COPPER_CONNECTION, request));
                if(response.hits.total.value != 0){
                    var copperConnections = response.hits.hits;
                    copperConnections.forEach(function (copperConnection) {
                    var copperConnectionId = copperConnection["_id"].split("_$$_")[1];
                    var copperConnectionDevice = copperConnectionId.split("_$_")[0];
                    var copperConnectionIDs = copperConnectionId.split("_$_")[1];
                        if(copperConnectionIDs && deletedBoards.indexOf(copperConnectionIDs.split(".")[0]) >= 0){
                            throw new RuntimeException("1 dependent intents should be removed first: copper-connection: "+ copperConnectionDevice +"#"+ copperConnectionIDs);
                        }
                    });
                }
            }
        }
    }
}

function validateRemovedBoardsForNavManagerType(input, intentConfigArgs) {
    var boards = intentConfigArgs["boards"];
    if (typeof boards === "undefined") {
        boards = [];
    }
    var topology = input.getCurrentTopology();
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        var xtraInfos = apUtils.getTopologyExtraInfo(topology);
        if (xtraInfos["LT_DEVICES"] && xtraInfos["LT_DEVICES"] !== "undefined") {
            var oldBoards = JSON.parse(xtraInfos["LT_DEVICES"]);
            var deletedBoards = getDeletedBoard(Object.keys(oldBoards), boards);
            if(deletedBoards && deletedBoards.length > 0){
                logger.debug("Deleted LT boards : {}", JSON.stringify(deletedBoards));
                var resourceFile = resourceProvider.getResource(internalLsResourcePrefix + "esQueryFiberIntents.json.ftl");
                var templateArgs={deviceId:input.getTarget()};
                var request = utilityService.processTemplate(resourceFile, templateArgs);
                var response = JSON.parse(esQueryService.queryESIntentsByIntentType(intentConstants.INTENT_TYPE_FIBER, request));
                if(response.hits.total.value != 0){
                    var fibers = response.hits.hits;
                    fibers.forEach(function (fiber) {
                        var fiberName = fiber["_id"].split("_$$_")[1];
                        var ponIDs = fiber["_source"].configuration["pon-id"];
                        if(ponIDs) {
                            ponIDs.forEach(function (ponID) {
                                if(ponID && deletedBoards.indexOf(ponID.split(".")[0]) >= 0){
                                    throw new RuntimeException("1 dependent intents should be removed first: fiber: "+ fiberName);
                                }
                            });
                        }
                    });
                }
                var nwSlicingUserType = apUtils.getNetworkSlicingUserType();
                if (nwSlicingUserType === intentConstants.NETWORK_SLICING_USER_TYPE_SLICE_MANAGER) {
                    var removedBoardList = new ArrayList();
                    for (var oldBoard in oldBoards) {
                        if (deletedBoards.indexOf(oldBoard) != -1)
                        {
                            removedBoardList.add(oldBoard + " (" + oldBoards[oldBoard]["planned-type"] + ")");
                        }
                    }
                    var resourceFile = resourceProvider.getResource(internalLsResourcePrefix + "esQueryDeviceFxSliceIntents.json.ftl");
                    var templateArgs={deviceId:input.getTarget(), removedBoardList: removedBoardList};
                    var request = utilityService.processTemplate(resourceFile, templateArgs);
                    var response = JSON.parse(esQueryService.queryESIntentsByIntentType(intentConstants.INTENT_TYPE_DEVICE_FX_SLICE, request));
                    if(response.hits.total.value != 0){
                        var errorMsg = "";
                        response.hits.hits.forEach(function(deviceFxSliceDoc) {
                            removedBoardList.forEach(function(removedBoard) {
                                if (deviceFxSliceDoc["_source"]["configuration"]["board-name"].indexOf(removedBoard) >= 0) {
                                    errorMsg += removedBoard + " is used in " + deviceFxSliceDoc["_source"]["target"]["raw"] + ". \n";
                                }
                            });
                        });
                        throw new RuntimeException("Dependent intents should be removed first: device-fx-slice: " + errorMsg);
                    }
                }
            }
        }
    }
}

function validateBoardServiceProfile(intentConfigArgs, contextualErrorJsonObj, input) {
    var isNtioConfigured = false;
    var boards = intentConfigArgs["boards"];
    if (boards) {
        var nodeType = [intentConfigArgs["hardware-type"], intentConfigArgs["device-version"]].join('-');
        var deviceName = input.getTarget();
        var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
        var boardServiceProfileResource = getServiceProfile(deviceName,nodeType,intentVersion);
        if (nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_F)) {
            var port = nodeType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_F, "").split("-")[0];
            var ihubHwType = intentConstants.FAMILY_TYPE_IHUB_FANT_F_FX + port;
        } else if (nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_G)) {
            var port = nodeType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_G, "").split("-")[0];
            var ihubHwType = intentConstants.FAMILY_TYPE_IHUB_FANT_G_FX + port;
        } else if (nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_H)) {
            var port = nodeType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_H, "").split("-")[0];
            var ihubHwType = intentConstants.FAMILY_TYPE_IHUB_FANT_H_FX + port;
        } else if (nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_M)) {
            var port = nodeType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_M, "").split("-")[0];
            var ihubHwType = intentConstants.FAMILY_TYPE_IHUB_FANT_M_FX + port;
        }
        Object.keys(boards).forEach(function (board) {
            var currentBoard = boards[board];
            var plannedType = currentBoard["planned-type"];
            if (plannedType !== "-") {
            var slotName = currentBoard["slot-name"];
            var boardServiceProfile = currentBoard["board-service-profile"];
            if (slotName.startsWith(intentConstants.LT_STRING)) {
                if (boardServiceProfile) {
                    var hardwareType = intentConfigArgs[intentConstants.HARDWARE_TYPE];
                    var deviceVersion = intentConfigArgs[intentConstants.DEVICE_VERSION];
                    var boardType = getBoardTypeFromPlannedType(hardwareType, plannedType, deviceVersion, slotName);
                    var boardServiceProfiles = Object.keys(apUtils.getBoardServiceProfilesForNAVManager(boardServiceProfileResource, intentConstants.LS_FX_PREFIX, boardType, null, true));
                    if (boardServiceProfiles.indexOf(boardServiceProfile) == -1) {
                        contextualErrorJsonObj["list#boards," + board + ",leaf#board-service-profile"] = "Invalid Board Profile '" + boardServiceProfile + "'";
                    }
                } else {
                    var backplaneKrSupported = apCapUtils.getCapabilityValue(intentConfigArgs["hardware-type"], intentConfigArgs["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.SUPPORTED_BACKPLANE_KR_CAPABILITY, plannedType, false);
                    if(backplaneKrSupported != false){			
                        contextualErrorJsonObj["list#boards," + board + ",leaf#board-service-profile"] = "board-service-profile is mandatory when planned-type is "+ plannedType;
                    }
                }
            } else if (slotName.startsWith(intentConstants.NTIO_STRING)) {
                if (boardServiceProfile) {
                    var boardServiceProfiles = getBoardServiceProfiles(boardServiceProfileResource);
                    if (boardServiceProfiles && boardServiceProfiles.indexOf(boardServiceProfile) == -1) {
                        contextualErrorJsonObj["list#boards," + board + ",leaf#board-service-profile"] = "Invalid Board Profile '" + boardServiceProfile + "'";
                    }

                    /*validate NtNtio mutually exclusive*/
                    var isNtNtioMutuallyExclusive = apCapUtils.isValueInCapability(ihubHwType,  intentConfigArgs["device-version"], capabilityConstants.DEVICE_CATEGORY, "is-nt-ntio-mutually-exclusive", ihubHwType, true);
                    if(isNtNtioMutuallyExclusive == true) {
                        ValidateFNIOforDependentUplinkPorts(ihubHwType, intentConfigArgs["device-version"],plannedType,deviceName,isNtioConfigured,slotName);
                    }

	                var plannedType = currentBoard["planned-type"];
		            var boardProfileVo = intentProfileInputFactory.createIntentProfileInputVO(boardServiceProfile,profileConstants.BOARD_SERVICE_PROFILE_LS_FX_NTIO.subType,profileConstants.BOARD_SERVICE_PROFILE_LS_FX_NTIO.profileType);
		            var boardProfiles = loadSpecificProfiles(intentConstants.INTENT_TYPE_DEVICE_FX, intentVersion, intentConfigArgs["device-version"], intentConfigArgs[intentConstants.HARDWARE_TYPE],Arrays.asList(boardProfileVo));
                    if(plannedType && boardProfiles && boardProfiles["board-service-profile"] && boardProfiles["board-service-profile"]["LS-FX-NTIO"] && boardProfiles["board-service-profile"]["LS-FX-NTIO"][0]["mda-type"]) {
                        var mdaType = boardProfiles["board-service-profile"]["LS-FX-NTIO"][0]["mda-type"];
		                var isValidMdaType = apCapUtils.isValueInCapability(intentConfigArgs["hardware-type"], intentConfigArgs["device-version"], capabilityConstants.BOARD_CATEGORY, "supported-mda-types", plannedType, mdaType);
	    
                        if(isValidMdaType == false) {
		                    throw new RuntimeException("Configured mda-type "+ mdaType +" is not supported for planned-type " + plannedType);
                        }
                    }
                } else {
                    contextualErrorJsonObj["list#boards," + board + ",leaf#board-service-profile"] = board + " should be used with board service profile";
                }
            } else if(slotName.startsWith(intentConstants.ACU_BOARD)){
                    var hardwareType = intentConfigArgs[intentConstants.HARDWARE_TYPE];
                    var plannedType = currentBoard["planned-type"];
                    var boardSubType = "LS-FX-ACU";
                    var boardServiceProfiles = Object.keys(apUtils.getBoardServiceProfilesForNAVManager(boardServiceProfileResource,
                             intentConstants.LS_FX_PREFIX, intentConstants.ACU_BOARD, boardSubType, true));
                    if (boardServiceProfile && boardServiceProfiles.indexOf(boardServiceProfile) == -1) {
                        contextualErrorJsonObj["list#boards," + board + ",leaf#board-service-profile"] = "Invalid Board Profile '" + boardServiceProfile + "'";
                    }
            }
            }
        });
    }
}

function validateBoardServiceProfileChange(input, topology, intentConfigArgs, contextualErrorJsonObj) {
    var boards = intentConfigArgs["boards"];
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        var xtraInfo = apUtils.getTopologyExtraInfo(topology);
        var oldIntentConfig = xtraInfo["lastIntentConfig"];
        if (oldIntentConfig) {
            var oldIntentJson = JSON.parse(oldIntentConfig);
        }
        if (!(input.getBlockedStatus() == "true" && oldIntentJson && intentConfigArgs["device-manager"] != oldIntentJson["device-manager"])) {
            if (xtraInfo["LT_DEVICES"] && xtraInfo["LT_DEVICES"] !== "undefined" && boards) {
                var oldBoards = JSON.parse(xtraInfo["LT_DEVICES"]);
                Object.keys(boards).forEach(function (board) {                    			
                    var oldBoard = oldBoards[board];
                    var newBoard = boards[board];
                    if(oldBoard && newBoard) {			
                        var isAcuProfileChangable = board.startsWith(intentConstants.ACU_BOARD);
                        var hardwareType = intentConfigArgs["hardware-type"];
                        var deviceVersion = intentConfigArgs["device-version"];

                        var isBackplaneKrSupported = false;
                        var backplaneKrSupported = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.SUPPORTED_BACKPLANE_KR_CAPABILITY, newBoard["planned-type"], false);
                        if(backplaneKrSupported != false) {
                            isBackplaneKrSupported = true;
				
                            var nodeType = hardwareType + "-" + deviceVersion;
                            var deviceName = input.getTarget();
                            var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
                            var boardServiceProfileResource = getServiceProfile(deviceName, nodeType, intentVersion);
                            var oldBoardType = getBoardTypeFromPlannedType(hardwareType, oldBoard["planned-type"], deviceVersion, oldBoard["slot-name"]);
                            var newBoardType = getBoardTypeFromPlannedType(hardwareType, newBoard["planned-type"], deviceVersion, newBoard["slot-name"]);
                            var oldBoardServiceProfiles = apUtils.getBoardServiceProfilesForNAVManager(boardServiceProfileResource, intentConstants.LS_FX_PREFIX, oldBoardType, null, true);
                            var newBoardServiceProfiles = apUtils.getBoardServiceProfilesForNAVManager(boardServiceProfileResource, intentConstants.LS_FX_PREFIX, newBoardType, null, true);				
                        } 

                        if (!isAcuProfileChangable && ((oldBoard && oldBoard["board-service-profile"] && newBoard && newBoard["board-service-profile"] && oldBoard["board-service-profile"] != newBoard["board-service-profile"])
                            || (oldBoard && !oldBoard["board-service-profile"] && newBoard && newBoard["board-service-profile"] == "Embedded-ONT")
                            || (oldBoard && oldBoard["board-service-profile"] == "Embedded-ONT" && newBoard && !newBoard["board-service-profile"])) && !isBackplaneKrSupported) {
                            contextualErrorJsonObj["list#boards," + board + ",leaf#board-service-profile"] = "Board Profile cannot be changed";
                        }else if (isBackplaneKrSupported && (oldBoard && oldBoardServiceProfiles && oldBoardServiceProfiles[oldBoard["board-service-profile"]] && oldBoardServiceProfiles[oldBoard["board-service-profile"]]["model"] && newBoard && newBoardServiceProfiles && newBoardServiceProfiles[newBoard["board-service-profile"]] && newBoardServiceProfiles[newBoard["board-service-profile"]]["model"]) && (oldBoardServiceProfiles[oldBoard["board-service-profile"]]["model"] != newBoardServiceProfiles[newBoard["board-service-profile"]]["model"])) {				
                            contextualErrorJsonObj["list#boards," + board + ",leaf#board-service-profile"] = "Board Profile cannot be changed from "+oldBoard["board-service-profile"]+" to "+newBoard["board-service-profile"];
                        }
                        if (oldBoard && oldBoard["planned-type"] && newBoard && newBoard["planned-type"]
                            && oldBoard["planned-type"].startsWith("FNIO") && (oldBoard["planned-type"] != newBoard["planned-type"])) {
                                contextualErrorJsonObj["list#boards," + board + ",leaf#planned-type"] = "Planned Type cannot be changed";
                        }
                    }			    
                });
            }
        }
    }
}

function validateDeviceTemplates(input, intentConfigArgs, topology, contextualErrorJsonObj) {
    var deviceName = input.getTarget();
    var boards = intentConfigArgs["boards"];
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        var lastIntentConfigArgs = apUtils.getLastIntentConfigFromTopologyXtraInfo(topology);
        if (lastIntentConfigArgs) {
            if (!(input.getBlockedStatus() == "true" && intentConfigArgs["device-manager"] != lastIntentConfigArgs["device-manager"])) { // NOT in case migration ISAM to LS
                if(lastIntentConfigArgs.boards) {
                    var oldBoards = lastIntentConfigArgs.boards;
                }
                var deviceInfos = apUtils.getAllInfoFromDevices(deviceName);
                if (deviceInfos != null && deviceInfos.size() > 0) {
                    if ((!lastIntentConfigArgs["device-template"] && intentConfigArgs["device-template"]) || (lastIntentConfigArgs["device-template"] && (!intentConfigArgs["device-template"] || intentConfigArgs["device-template"] !== lastIntentConfigArgs["device-template"]))) {
                        contextualErrorJsonObj["device-template"] = "Cannot be modified while the device '" + deviceName + "' is still managed in AV.";
                    }
                }
                var ihubDeviceName = deviceName + intentConstants.DOT_LS_IHUB;
                var ihubDeviceInfos = apUtils.getAllInfoFromDevices(ihubDeviceName);
                if (ihubDeviceInfos != null && ihubDeviceInfos.size() > 0) {
                    if ((!lastIntentConfigArgs["ihub-device-template"] && intentConfigArgs["ihub-device-template"]) || (lastIntentConfigArgs["ihub-device-template"] && (!intentConfigArgs["ihub-device-template"] || intentConfigArgs["ihub-device-template"] !== lastIntentConfigArgs["ihub-device-template"]))) {
                        contextualErrorJsonObj["ihub-device-template"] = "Cannot be modified while the device '" + ihubDeviceName + "' is still managed in AV.";
                    }
                }
            }
        }
    }
    if (boards) {
        Object.keys(boards).forEach(function (board) {
            var currentBoard = boards[board];
            var oldBoard = oldBoards && oldBoards[board];
            var slotName = currentBoard["slot-name"];
            var ltDeviceTemplate = currentBoard["lt-device-template"];
            if(!slotName.startsWith(intentConstants.LT_STRING) && ltDeviceTemplate && contextualErrorJsonObj) {
                contextualErrorJsonObj["list#boards," + board + ",leaf#lt-device-template"] = "Invalid Initial Configuration Template '" + ltDeviceTemplate + "', Initial Configuration Template is only applicable for LT boards in LS-FX";
            }
            var ltDeviceName = deviceName + intentConstants.DEVICE_SEPARATOR + slotName;
            var ltDeviceInfos = apUtils.getAllInfoFromDevices(ltDeviceName);
            if (ltDeviceInfos != null && ltDeviceInfos.size() > 0) {
                if (slotName.startsWith(intentConstants.LT_STRING) && oldBoard && ((!oldBoard["lt-device-template"] && ltDeviceTemplate) || (oldBoard["lt-device-template"] && (!ltDeviceTemplate || oldBoard["lt-device-template"] !== ltDeviceTemplate)))) {
                    contextualErrorJsonObj["list#boards," + board + ",leaf#lt-device-template"] = "Initial Configuration Template cannot be modified while the device '" + ltDeviceName + "' is still managed in AV.";
                }
            }
        });
    }
}

function validateBackplaneKr4SupportedForNAV(intentConfigArgs, contextualErrorJsonObj, input) {
    var boards = intentConfigArgs["boards"];
    if (boards) {
        var hardwareType = intentConfigArgs["hardware-type"];
        var deviceVersion = intentConfigArgs["device-version"];
        var nodeType = hardwareType + "-" + deviceVersion;
        var deviceName = input.getTarget();
        var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
        var boardServiceProfileResource = getServiceProfile(deviceName, nodeType, intentVersion);
        Object.keys(boards).forEach(function(board){
            var currentBoard = boards[board];
            var slotName = currentBoard["slot-name"];
            var plannedType = currentBoard["planned-type"];
            var isBoardTypeLT = apCapUtils.isValueInCapability(hardwareType, deviceVersion, capabilityConstants.BOARD_CATEGORY, "slot-type", plannedType, "LT");

            if (isBoardTypeLT) {		
                var boardServiceProfile = boards[board]["board-service-profile"];
                if (boardServiceProfile) {
                    var boardType = getBoardTypeFromPlannedType(hardwareType, plannedType, deviceVersion, slotName);
                    var boardServiceProfiles = apUtils.getBoardServiceProfilesForNAVManager(boardServiceProfileResource, intentConstants.LS_FX_PREFIX, boardType, null, true);
                    var backplaneKrCapability = boardServiceProfiles[boardServiceProfile]["backplane-kr-capability"];

                    var isBackplaneKrSupportedForDevice = apCapUtils.isValueInCapability(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_BACKPLANE_KR_CAPABILITY, "-", backplaneKrCapability);
                    if ((!isBackplaneKrSupportedForDevice) && backplaneKrCapability) {
                       contextualErrorJsonObj["list#boards," + board + ",leaf#board-service-profile"] = "The " + backplaneKrCapability + " is not supported for " + hardwareType + " device ";
                       return;
                    }

                    var isBackplaneKrSupportedForBoard = apCapUtils.isValueInCapability(hardwareType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.SUPPORTED_BACKPLANE_KR_CAPABILITY, plannedType, backplaneKrCapability);
                    if ((!isBackplaneKrSupportedForBoard) && backplaneKrCapability) {
                       contextualErrorJsonObj["list#boards," + board + ",leaf#board-service-profile"] = "The " + backplaneKrCapability + " is not supported for " + plannedType + " board ";
                       return;			    
                    }
                }
            }
        });
    }
}

function validateNumberOfLTSlot(intentConfigArgs) {
    var hardwareType = intentConfigArgs[intentConstants.HARDWARE_TYPE];
    if (hardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT) && intentConfigArgs["boards"]) {
        var numOfSlot = apUtils.getNumberOfPorts(hardwareType);
        Object.keys(intentConfigArgs["boards"]).forEach(function (board) {
            if (board.startsWith("LT") && Number(board.replace("LT", "")) > numOfSlot) {
                throw new RuntimeException("Hardware Type " + hardwareType + " only have " + numOfSlot + " LT slots");
            }
        });
    }
}

function validateCallback(input, contextualErrorJsonObj,validateContext) {
    var intentConfigArgs = {};
    var noValidationDeviceTemplate = false;
    var getKeyForList = function(listName) {
        switch (listName) {
            case "label":
                return ["category", "value"];
            case "boards":
                return ["slot-name"];
            case "eonu-release":
                return "yang:leaf-list";
            case "duid":
                return "yang:leaf-list";
            case "onu-active-software-mapping":
                return ["index"];
            case "onu-passive-software-mapping":
                return ["index"];
            case "onu-software":
                return ["software-type", "target-release", "target-software-control"];
            case "label":
                return "yang:leaf-list";            
            default:
                return null;
        }
    };
    var topology = input.getCurrentTopology();
    var deviceName = input.getTarget();
    apUtils.convertIntentConfigXmlToJson(input.getIntentConfiguration(), getKeyForList, intentConfigArgs, null, ["geo-coordinates"]);
    if ((intentConfigArgs["cli-user-name"] != null && intentConfigArgs["cli-password"] == null) || (intentConfigArgs["cli-user-name"] == null && intentConfigArgs["cli-password"] != null)) {
        throw new RuntimeException("Invalid Input. CLI User Name and CLI Password must be specified at the same time.");
    }
    if ((intentConfigArgs["tl1-user-name"] != null && intentConfigArgs["tl1-password"] == null) || (intentConfigArgs["tl1-user-name"] == null && intentConfigArgs["tl1-password"] != null)) {
        throw new RuntimeException("Invalid Input. TL1 User Name and TL1 Password must be specified at the same time.");
    }
    apUtils.validateDeviceManager(intentConfigArgs);
    var networkState = input.getNetworkState().name();
    if (networkState === "suspend") {
        throw new RuntimeException("Suspend operation is not supported");
    }
    var managerName = intentConfigArgs[intentConstants.DEVICE_MANAGER];
    var managerInfo = mds.getManagerByName(managerName).getType().name();


    if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV){
        //Skip this validate due to lock device for reinitialize
        var hwTypeRelease = intentConfigArgs["hardware-type"] + "-" + intentConfigArgs["device-version"];
        if (input.getBlockedStatus() == "false") {
            deviceUtilities.validateDevicePresentInOtherAV(input.getTarget(), managerName, contextualErrorJsonObj);
            deviceUtilities.validateForDuplicateDeviceNamesInAV(input.getTarget(), intentConstants.LS_FX_PREFIX, contextualErrorJsonObj);
        }
        deviceUtilities.validateNCYHardwareTypeAndVersion(intentConfigArgs, contextualErrorJsonObj);
        if ( intentConfigArgs["boards"] ) {
            validateCreateAndModifyHostId(intentConfigArgs, topology, input, contextualErrorJsonObj);
            validateModificationLtReplacement(intentConfigArgs, topology, contextualErrorJsonObj);
        }
        if(intentConfigArgs["ip-address"]) {
            validateIPAddressForDevice(intentConfigArgs, deviceName, contextualErrorJsonObj);
        }
        validateNumberOfLTSlot(intentConfigArgs);
        validatePlannedType(intentConfigArgs);
        validateBoardTypeChanged(input, intentConfigArgs, contextualErrorJsonObj,deviceName);
        validateVersionForOtherLT(intentConfigArgs,contextualErrorJsonObj);
        validatePlannedTypeSupportUpgradeSoftware(intentConfigArgs, contextualErrorJsonObj)
        validateRemovedBoardsForNavManagerType(input, intentConfigArgs);
        validateRemovedBoardsOnEthernetConnectionIntent(input, intentConfigArgs, "LT_DEVICES");
        validateBoardServiceProfile(intentConfigArgs, contextualErrorJsonObj, input);
        validateBoardServiceProfileChange(input, topology, intentConfigArgs, contextualErrorJsonObj);
        validateDeviceTemplates(input, intentConfigArgs, topology, contextualErrorJsonObj);
        validateBoardAdminStateActions(input, intentConfigArgs, contextualErrorJsonObj);
        var hwTypeRelease = intentConfigArgs["hardware-type"] + "-" + intentConfigArgs["device-version"];
        var allProfilesFx = loadDeviceFxIntentProfilesFromProfileManager(deviceName, hwTypeRelease, input.getIntentTypeVersion(), validateContext);
        validateContext["allProfilesFx"] = allProfilesFx;
        apUtils.validateOAMConnectivityCredentialSelection(contextualErrorJsonObj, intentConfigArgs);
        apUtils.validateOAMConnectivityAccountProfiles(contextualErrorJsonObj,intentConfigArgs,validateContext["allProfilesFx"]["deviceOAMProfiles"]);
        validateBackplaneKr4SupportedForNAV(intentConfigArgs, contextualErrorJsonObj, input);

        apUtils.validateTargetSofwareFormat(intentConfigArgs, contextualErrorJsonObj);
        if (networkState != "delete") {
            apUtils.validateTargetSoftwareValue(intentConfigArgs, contextualErrorJsonObj);
        }
        apUtils.validateDuid(intentConfigArgs, contextualErrorJsonObj,intentConstants.LS_FX_PREFIX);
        apUtils.validatePartitionAccessProfile(contextualErrorJsonObj, intentConfigArgs);
        var dynamicPortUsage = utilityService.getEnvironmentValue(intentConstants.DYNAMIC_NETCONF_PORT_USAGE);
        if(dynamicPortUsage == null || dynamicPortUsage != "true") {
           if (intentConfigArgs['ip-port'] && intentConfigArgs['ip-port'] !== "832"){
              contextualErrorJsonObj['ip-port'] = "Cannot be modified";
           }
        }
        if (intentConfigArgs["eonu-release"]) {
            var eonuRelease = intentConfigArgs["eonu-release"];
            var eonuReleaseSet = new TreeSet();
            var eonuReleaseSize = 0;
            eonuRelease.forEach(function (releaseName){
                var release = releaseName.substring(releaseName.lastIndexOf("/")+1);
                eonuReleaseSize++;
                eonuReleaseSet.add(release);
                if (eonuReleaseSize > eonuReleaseSet.size()) {
                    contextualErrorJsonObj["leaf-list#eonu-release"] = "There are two duplicate entries for the ONU release " + release;
                }
            });
        }

        var dependencyIntentType = [];
        var validateResultObj = apUtils.getValidateResult(dependencyIntentType, deviceName);
        var deviceInfo = {};
        deviceInfo.name = deviceName;
        deviceInfo.familyTypeRelease = hwTypeRelease;
        deviceInfo.managerType = managerInfo;
        var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX , deviceName);
        var profileInfos = getProfilesAndDependencyInfos(deviceInfo,input.getIntentTypeVersion(),intentConfigArgs,validateContext);
        validateResultObj.setIntentProfileVOs(apUtils.getObjectSet(profileInfos));

        var isDuidSupported = apCapUtils.getCapabilityValue(intentConfigArgs["hardware-type"], intentConfigArgs["device-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DUID_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
        if (isDuidSupported && intentConfigArgs["duid"]) {
            var target = apfwk.getRequestContext(input).get("target");
            var intentDevice = intentConstants.INTENT_TYPE_DEVICE_FX;
            var inputDUID = intentConfigArgs["duid"];
            var duplicatedMessage = deviceUtilities.checkIfDuplicateDuid(inputDUID, target, intentDevice);
            if(duplicatedMessage != ""){
                contextualErrorJsonObj["duid"] = duplicatedMessage;
            }
        }
        apUtils.validatePartitionAccessProfile(contextualErrorJsonObj, intentConfigArgs);
    }else if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_AMS){
        var deviceName = input.getTarget();
        validateFANT_MRedundantPair(intentConfigArgs, contextualErrorJsonObj);
        validateIPAddressForISAMDevice(topology, intentConfigArgs, deviceName, contextualErrorJsonObj, input);
        validateCageModeWithPlannedType(intentConfigArgs);
        validateCapabilityProfiles(intentConfigArgs, contextualErrorJsonObj);
        validateRemovedBoardsOnFiberIntent(input, intentConfigArgs);
        validateRemovedBoardsOnEthernetConnectionIntent(input, intentConfigArgs, "BOARD_LIST");
        validateRemovedBoardsOnCopperConnectionIntent(input, intentConfigArgs);
        validateSupport40Gkr4(input,intentConfigArgs, contextualErrorJsonObj);
        validateNeGroup(intentConfigArgs, contextualErrorJsonObj);
        var supportedDeviceTypes = JSON.parse(resourceProvider.getResource(internalIsamResourcePrefix + "supported-device-types.json"));
        if (supportedDeviceTypes['device-type'].indexOf(intentConfigArgs["device-version"]) == -1) {
            contextualErrorJsonObj['device-version'] = "Release version " + intentConfigArgs["device-version"] + " is not supported";
        }
        if (topology) {
           var topologyXtraInfoValidate = apUtils.getTopologyExtraInfo(topology);
           var oldConfigValidate = topologyXtraInfoValidate["lastIntentConfig"];
           if(oldConfigValidate) {
                oldConfigValidate = JSON.parse(oldConfigValidate);
                if (!(input.getBlockedStatus() == "true" && intentConfigArgs["device-manager"] != oldConfigValidate["device-manager"])) {
                    if (intentConfigArgs['target-script-or-archive'] && oldConfigValidate['target-script-or-archive'] && intentConfigArgs['target-script-or-archive'] !== oldConfigValidate['target-script-or-archive']){
                        contextualErrorJsonObj['target-script-or-archive'] = "Cannot be modified";
                    }
                    if (intentConfigArgs['hardware-type'] && oldConfigValidate['hardware-type'] && intentConfigArgs['hardware-type'] !== oldConfigValidate['hardware-type']) {
                        contextualErrorJsonObj['hardware-type'] = "Cannot be modified";
                    }
                    if (intentConfigArgs['iacm-snmp-profile'] && oldConfigValidate['iacm-snmp-profile'] && intentConfigArgs['iacm-snmp-profile'] !== oldConfigValidate['iacm-snmp-profile']) {
                        contextualErrorJsonObj['iacm-snmp-profile'] = "Cannot be modified";
                    }
                    if (intentConfigArgs['ihub-snmp-profile'] && oldConfigValidate['ihub-snmp-profile'] && intentConfigArgs['ihub-snmp-profile'] !== oldConfigValidate['ihub-snmp-profile']) {
                        contextualErrorJsonObj['ihub-snmp-profile'] = "Cannot be modified";
                    }
                }
           }
        }
        if(intentConfigArgs["duid"]){
            contextualErrorJsonObj["duid"] = "Call Home is not supported for ISAM FX."
        }

        var hwTypeRelease = intentConfigArgs["hardware-type"] + "-" + intentConfigArgs["device-version"];
        var dependencyIntentType = [];
        var deviceName = input.getTarget();
        var validateResultObj = apUtils.getValidateResult(dependencyIntentType, deviceName);
        var target = apfwk.getRequestContext(input).get("target");
        var deviceInfo = {};
        deviceInfo.name = deviceName;
        deviceInfo.target = target;
        deviceInfo.familyTypeRelease = hwTypeRelease;
        deviceInfo.managerType = managerInfo;
        var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX , target);
        var profileInfos = getProfilesAndDependencyInfos(deviceInfo,intentVersion,intentConfigArgs);
        validateResultObj.setIntentProfileVOs(apUtils.getObjectSet(profileInfos));
        apUtils.validatePartitionAccessProfile(contextualErrorJsonObj, intentConfigArgs);
    }
    apUtils.validateCreateDeviceLabel(contextualErrorJsonObj, intentConfigArgs);
    if (intentConfigArgs['label'] && networkState != "delete") {
        if (apUtils.validateUniqueCategory(intentConfigArgs, contextualErrorJsonObj)) {
            apUtils.updateLabels(deviceName,intentConfigArgs['label'],intentConstants.LABEL_MODE_VALIDATE);
        }
    }
    return validateResultObj;
}

function validateIPAddressForDevice(intentConfigArgs, deviceName, contextualErrorJsonObj){
    //begin validation for when changing the IP Address, we need to validate the same IP Address is used by other intents or not
    var esTemplateResourceFile = resourceProvider.getResource(internalLsResourcePrefix + "esQueryCheckIfIPAddressAlreadyUsed.json.ftl");
    var esTemplateArgs = {
        ipAddress: intentConfigArgs["ip-address"] //new destination IP Address
    };
    var esRequestTemplate = utilityService.processTemplate(esTemplateResourceFile, esTemplateArgs);
    try{
        var esResponse = apUtils.executeEsIntentSearchRequest(esRequestTemplate);
        /* We can't use "esQueryService.queryESIntentsByIntentType" here
        * we need to pass list of intents but this method takes only single intent as parameter
        */
    }catch(e){
        /* we will do nothing, this is to catch for the exception when we call the esQuery in Fresh setup.
        * expected error message: "Error while getting the intent details from elastic search : no such index [local-intents]"
        * refer to https://jiradc2.ext.net.nokia.com/browse/FNMS-131212
        */
    }
    if(esResponse && esResponse.hits.total.value != 0){
        var esResponseSource = esResponse.hits.hits[0]["_source"];
        var intentTargetResponse = esResponseSource.target.raw;
        if(intentTargetResponse != deviceName){
            var intentTypeResponse = esResponseSource["intent-type"];
            var intentVersionResponse = esResponseSource["intent-type-version"];
            //ex: "It is already used by intent with type 'device-fx (v5)' and target '135.249.41.180'"
            var errorMessage = "It is already used by intent with type '"
                    + intentTypeResponse + " (v" + intentVersionResponse + ")' and target '" + intentTargetResponse + "'";
            contextualErrorJsonObj['ip-address'] = errorMessage;
        }
    }
    //end validation for when changing the IP Address, we need to validate the same IP Address is used by other intents or not

}


function validateIPAddressForISAMDevice(topology, intentConfigArgs, deviceName, contextualErrorJsonObj, syncInput){
    //begin validation for only IP Address change allowed
    var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
    var lastIntentConfig = topologyXtraInfo["lastIntentConfig"];
    var isIpAddressChanged = false;
    if(lastIntentConfig) {
        var lastIntentConfigJSON = JSON.parse(lastIntentConfig);
        isIpAddressChanged = checkIfIpAddressChanged(lastIntentConfigJSON, intentConfigArgs);
        if(isIpAddressChanged){
            lastIntentConfigJSON["ip-address"] = intentConfigArgs["ip-address"];
            var sensitiveKeys = [];
            var encryptedPasswordAC = {};
            if(syncInput){
                var encryptedIntentConfig = syncInput.getEncryptedIntentConfiguration();
                if(encryptedIntentConfig){
                    sensitiveKeys = apUtils.getSensitiveKeys(encryptedIntentConfig); //["cli-password", "tl1-password"]
                    encryptedPasswordAC = apUtils.getEncryptedPassword(encryptedIntentConfig, sensitiveKeys); //{"cli-password":"$-0$NxF0", "tl1-password": "$-0$NxF06"}
                }
            }
            var areOtherIntentConfigsChanged = apUtils.compareTwoObjectsWithEncryptedData(intentConfigArgs, lastIntentConfigJSON, sensitiveKeys, encryptedPasswordAC);
            if(!areOtherIntentConfigsChanged){
                contextualErrorJsonObj['ip-address'] = "Cannot modify IP Address with other fields";
            }
        }
    }
    //end validation for only IP Address change allowed
    //begin validation for when changing the IP Address, we need to validate the same IP Address is used by other intents or not
    var esTemplateResourceFile = resourceProvider.getResource(internalIsamResourcePrefix + "esQueryCheckIfIPAddressAlreadyUsed.json.ftl");
    var esTemplateArgs = {
        ipAddress: intentConfigArgs["ip-address"] //new destination IP Address
    };
    var esRequestTemplate = utilityService.processTemplate(esTemplateResourceFile, esTemplateArgs);
    try{
        var esResponse = apUtils.executeEsIntentSearchRequest(esRequestTemplate);
        /* We can't use "esQueryService.queryESIntentsByIntentType" here
        * we need to pass list of intents but this method takes only single intent as parameter
        */
    }catch(e){
        /* we will do nothing, this is to catch for the exception when we call the esQuery in Fresh setup.
        * expected error message: "Error while getting the intent details from elastic search : no such index [local-intents]"
        * refer to https://jiradc2.ext.net.nokia.com/browse/FNMS-131212
        */
    }
    if(esResponse && esResponse.hits.total.value != 0){
        var esResponseSource = esResponse.hits.hits[0]["_source"];
        var intentTargetResponse = esResponseSource.target.raw;
        if(intentTargetResponse != deviceName){
            var intentTypeResponse = esResponseSource["intent-type"];
            var intentVersionResponse = esResponseSource["intent-type-version"];
            //ex: "It is already used by intent with type 'device-fx (v5)' and target '135.249.41.180'"
            var errorMessage = "It is already used by intent with type '"
                    + intentTypeResponse + " (v" + intentVersionResponse + ")' and target '" + intentTargetResponse + "'";
            if(isIpAddressChanged){
                //ex: "Cannot change the IP Address: It is already used by intent with type 'device-fx (v5)' and target '135.249.41.180'"
                errorMessage = "Cannot change the IP Address: " + errorMessage;
            }
            contextualErrorJsonObj['ip-address'] = errorMessage;
        }
    }
    //end validation for when changing the IP Address, we need to validate the same IP Address is used by other intents or not

}

function checkIfIpAddressChanged(lastIntentConfigJSON, intentConfigArgs){
    if(lastIntentConfigJSON && intentConfigArgs) {
        if(intentConfigArgs['ip-address'] && lastIntentConfigJSON['ip-address'] && intentConfigArgs['ip-address'] !== lastIntentConfigJSON['ip-address']){
            return true;
        }
    }
    return false;
}

function validateCreateAndModifyHostId(intentConfigArgs, topology, input, contextualErrorJsonObj) {
    var boards = {};
    boards = intentConfigArgs["boards"];
    var listLt = Object.keys(boards);
    var hardWareType = intentConfigArgs["hardware-type"];
    var NTdeviceVersion = intentConfigArgs["device-version"];
    if ( listLt && listLt.length > 0 ) {
        for (var i = 0; i < listLt.length; i++) {
            if (boards[listLt[i]]["host-id"] && boards[listLt[i]]["host-id"] != "auto" && boards[listLt[i]]["host-id"] != "not-configured" ) {
                var temp = boards[listLt[i]]["host-id"];
                if (temp) {
                    for (var j = i+1; j < listLt.length; j++) {
                        if (boards[listLt[j]]["host-id"] && boards[listLt[j]]["host-id"] != "auto" && boards[listLt[j]]["host-id"] !="not-configured" &&  temp == boards[listLt[j]]["host-id"]) {
                            throw new RuntimeException("The Host ID " + temp + " provided is already used by another device. Provide a different Host ID");
                        }
                    }
                }
            }
            var plannedType = boards[listLt[i]]["planned-type"];
            if (boards[listLt[i]]["slot-name"] && boards[listLt[i]]["slot-name"].startsWith(intentConstants.FX_LT_STRING) && plannedType !== "-"  && boards[listLt[i]]["host-id"] && boards[listLt[i]]["host-id"] != "not-configured") {
                var deviceType = hardWareType.substring(0,6) + plannedType;
                if (plannedType && deviceType) {
                    var isHostIdConfigurationSupported;
                    var LTDeviceVersion = boards[listLt[i]]["device-version"]? boards[listLt[i]]["device-version"] : NTdeviceVersion;
                    isHostIdConfigurationSupported = apCapUtils.getCapabilityValue(deviceType, LTDeviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_HOST_ID_CONFIGURATION_SUPPORTTED, plannedType, false);
                    if (!isHostIdConfigurationSupported) {
                        contextualErrorJsonObj["list#boards," + listLt[i] + ",leaf#host-id"] = "The board " + plannedType + " in " + boards[listLt[i]]["slot-name"] + " does not support configuration of HOST ID!";
                    }
                }
            } else if (boards[listLt[i]]["slot-name"] && boards[listLt[i]]["slot-name"].startsWith(intentConstants.FX_LT_STRING) == false && boards[listLt[i]]["host-id"] && boards[listLt[i]]["host-id"] != "not-configured"){
                contextualErrorJsonObj["list#boards," + listLt[i] + ",leaf#host-id"] = "The board " + plannedType + " in " + boards[listLt[i]]["slot-name"] + " does not support configuration of HOST ID!";
            }
        }
    }
    if (topology) {
        var lastIntentConfigJson = apUtils.getLastIntentConfigFromTopologyXtraInfo(topology);
        var boardsTopology;
        if (lastIntentConfigJson) {
            boardsTopology= lastIntentConfigJson["boards"];
        }
        var deviceName = input.getTarget();
        var inputArgs = {
            "deviceName": deviceName
        };
        var slotPool = deviceUtilities.getSlotPool();
        Object.keys(boards).forEach(function (key) {
            var hostId = boards[key]["host-id"];
            if (boardsTopology && boardsTopology[key] && boardsTopology[key]["host-id"]) {
                if ((boardsTopology[key]["host-id"] !== "auto" && boardsTopology[key]["host-id"] !== "not-configured" && hostId == "auto") || (boardsTopology[key]["host-id"] == "auto" && hostId !== "auto" && hostId !== "not-configured")) {
                    throw new RuntimeException("Modification of Host ID in this case is not supported");
                }
            }
            if (slotPool && (((boardsTopology && boardsTopology[key] && hostId !== boardsTopology[key]["host-id"])) || (boardsTopology && !boardsTopology[key] && hostId) || (hostId == "auto" && !boardsTopology) || (hostId == "auto" && boardsTopology && !boardsTopology[key]))) {
                if (hostId != "not-configured") {
                    var isAcceptable = true;
                    var hostIdExistList = deviceUtilities.getExistingHostIDList(slotPool);
                    if (hostIdExistList && hostIdExistList.length > 0) {
                        isAcceptable = hostIdExistList.indexOf(hostId) === -1 ? true : false;
                    }
                    if (!isAcceptable) {
                        throw new RuntimeException("The Host ID " + hostId + " provided is already used by another device. Provide a different Host ID");
                    }
                }

            }
        });
    } else if (topology == null ){
        Object.keys(boards).forEach(function (key) {
        var hostId = boards[key]["host-id"];
        if (hostId && hostId !="auto" && hostId != "not-configured") {
            var slotPool = deviceUtilities.getSlotPool();
            var isAcceptable = true;
            var hostIdExistList = deviceUtilities.getExistingHostIDList(slotPool);
            if (hostIdExistList && hostIdExistList.length > 0) {
                isAcceptable = hostIdExistList.indexOf(hostId) === -1 ? true : false;
            }
            if (!isAcceptable) {
                throw new RuntimeException("The Host ID " + hostId + " provided is already used by another device. Provide a different Host ID");
            }
        }
      });
  }
}

function validateModificationLtReplacement(intentConfigArgs, topology, contextualErrorJsonObj) {
    var boards = {};
    boards = intentConfigArgs["boards"];
    if (topology) {
        var lastIntentConfigJson = apUtils.getLastIntentConfigFromTopologyXtraInfo(topology);
        var boardsTopology;
        if (lastIntentConfigJson) {
            boardsTopology= lastIntentConfigJson["boards"];
        }
        Object.keys(boards).forEach(function (key) {
            if (boards[key] && boards[key]["planned-type"] && boardsTopology && boardsTopology[key] && boardsTopology[key]["planned-type"] && (boards[key]["planned-type"] != boardsTopology[key]["planned-type"])) {
                if (boards[key]["host-id"] && boardsTopology[key]["host-id"] && (boards[key]["host-id"] != boardsTopology[key]["host-id"])) {
                    contextualErrorJsonObj["list#boards," + key + ",leaf#host-id"] = "Modification of CFM Host ID in LT replacement case is not supported"
                }
                if (boards[key]["lt-device-template"] && boardsTopology[key]["lt-device-template"] && (boards[key]["lt-device-template"] != boardsTopology[key]["lt-device-template"])) {
                    contextualErrorJsonObj["list#boards," + key + ",leaf#lt-device-template"] = "Modification of Initial Configuration Template in LT replacement case is not supported"
                }
            }
        });
    }
}

function validateVersionForOtherLT(intentConfigArgs,contextualErrorJsonObj){
    var deviceManager = intentConfigArgs["device-manager"];
    var managerInfo = mds.getManagerByName(deviceManager).getType().name();
    if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV){
        if(intentConfigArgs["boards"]){
            var board = intentConfigArgs["boards"];
            if(board != null){
                for (var boardKeys in board){
                    if(boardKeys.indexOf("LT") == -1){
                        if(board[boardKeys]["device-version"] != null){
                            contextualErrorJsonObj["list#boards," + "has Slot Name is "+boardKeys + ",leaf#device-version"] = "Device " + boardKeys +" not support Version";
                        }
                    }
                }
            }
        }
    }
}

function suggestDeviceManagerNames(valueProviderContext) {
    var managerList = [intentConstants.MANAGER_TYPE_AMS, intentConstants.MANAGER_TYPE_NAV];
    var managers = apUtils.getDeviceManagerNames(managerList);
    return apUtils.convertToSuggestReturnFormat(managers, valueProviderContext.getSearchQuery());
}

function suggestTimezoneNames(valueProviderContext) {
    var arrTimeZone = [];
    var nwSlicingUserType = apUtils.getNetworkSlicingUserType();
    if (nwSlicingUserType != intentConstants.NETWORK_SLICING_USER_TYPE_SLICE_OWNER) {
        var inputValues = valueProviderContext.getInputValues();
        var deviceManager = inputValues["arguments"]["device-manager"];
        var managerInfo = mds.getManagerByName(deviceManager).getType().name();
        if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV){
            var intentTypeVersion =  valueProviderContext.getIntentTypeVersion();
            var target = inputValues["target"];
            var deviceType = inputValues["arguments"]["hardware-type"];
            var deviceRelease = inputValues["arguments"]["device-version"];
            var nodeType = deviceType + "-" + deviceRelease;
            var deviceDetails = getDeviceDetailsForProfileManager(target, nodeType, intentTypeVersion);
            var type = profileConstants.TZ_NAME_PROFILE_LS.profileType;
            var map = apUtils.getParsedProfileDetailsFromProfMgr(deviceDetails["deviceName"],deviceDetails["nodeType"],deviceDetails["intentType"],deviceDetails["excludeList"], deviceDetails["intentTypeVersion"]);
            if (map[type]) {
                map[type].forEach(function (entry) {
                    if (entry["timezone-name"]) {
                        entry["timezone-name"].forEach(function (value){
                            arrTimeZone.push(value);
                        });
                    }
                });
            }
        }
    }
    return apUtils.convertToSuggestReturnFormat(arrTimeZone, valueProviderContext.getSearchQuery());
}

function suggestFxHardwareTypes(valueProviderContext) {
    var deviceManager = getArgumentValue(intentConstants.DEVICE_MANAGER, valueProviderContext);
    var managerInfo = mds.getManagerByName(deviceManager).getType().name();
    if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV){
        var hardwareTypeData = deviceUtilities.getNCYHardwareTypes(intentConstants.FAMILY_TYPE_LS_FX_FANT);
        return apUtils.convertToSuggestReturnFormat(hardwareTypeData, valueProviderContext.getSearchQuery());
    } else {
        return ['FX-I'];
    }
}

function suggestIacmSnmpProfileFromAMS(context) {
    var profiles = JSON.parse(resourceProvider.getResource(internalIsamResourcePrefix + "profiles.json"));
    return apUtils.convertToSuggestReturnFormat(profiles[0]["iacmProfile"], context.getSearchQuery());
}

function suggestPartitionAccessProfiles(context) {
    var listPartitionAccessProfiles = apUtils.getPartitionAccessProfiles();
    return apUtils.convertToSuggestReturnFormat(listPartitionAccessProfiles, context.getSearchQuery());
}

function suggestBoardServiceProfileNames(context) {
    var profileNames = [];
    var intentVersion = context.getIntentTypeVersion();
    var inputArgs = context.getInputValues();
    var nodeType = [inputArgs["arguments"]["hardware-type"], inputArgs["arguments"]["device-version"]].join('-');
    var boardServiceProfileResource = getServiceProfile(inputArgs["target"],nodeType,intentVersion);
    var deviceManager = getArgumentValue(intentConstants.DEVICE_MANAGER, context);
    var managerInfo = mds.getManagerByName(deviceManager).getType().name();
    if (managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV) {
        if (inputArgs["currentListValue"] && inputArgs["currentListValue"].length > 0) {
            var hardwareType = getArgumentValue(intentConstants.HARDWARE_TYPE, context);
            var deviceVersion = getArgumentValue(intentConstants.DEVICE_VERSION, context);
            var slotName = inputArgs["currentListValue"][0]["slot-name"];
            var plannedType = inputArgs["currentListValue"][0]["planned-type"];
            var boardType = getBoardTypeFromPlannedType(hardwareType, plannedType, deviceVersion, slotName);
            if (slotName.startsWith(intentConstants.LT_STRING)) {
                profileNames = Object.keys(apUtils.getBoardServiceProfilesForNAVManager(boardServiceProfileResource,
                    intentConstants.LS_FX_PREFIX, boardType, null, true));
            } else if (slotName.startsWith(intentConstants.NTIO_STRING)) {
                profileNames = getBoardServiceProfiles(boardServiceProfileResource);
            } else if(slotName.startsWith(intentConstants.ACU_BOARD)){
                var boardSubType = "LS-FX-ACU";
                profileNames = Object.keys(apUtils.getBoardServiceProfilesForNAVManager(boardServiceProfileResource,
                             intentConstants.LS_FX_PREFIX, "ACU",boardSubType, true));
            }

        }
    } else if (managerInfo && managerInfo == intentConstants.MANAGER_TYPE_AMS) {
        var inputArgs = context.getInputValues();
        var listProfiles;
        var deviceDetails = {};
        var hwTypeRelease = inputArgs["arguments"]["hardware-type"] + "-" + inputArgs["arguments"]["device-version"];
        var deviceRelease = hwTypeRelease.substring(hwTypeRelease.lastIndexOf("-") + 1);
        deviceDetails = apUtils.getDeviceDetailForProfileManager(intentConstants.INTENT_TYPE_DEVICE_FX,null,null,deviceRelease,context,null,null,false);
        profileNames = apUtils.getAssociatedProfileNames(deviceDetails["intentType"],deviceDetails["version"],null,deviceDetails["deviceRelease"],"board-service-profile", intentConstants.FAMILY_TYPE_ISAM_FX,null,null);
    }
    return apUtils.convertToSuggestReturnFormat(profileNames, context.getSearchQuery());
}

function getServiceProfile(deviceName, nodeType, intentVersion){
        var boardServiceProfileResource = apUtils.getParsedProfileDetailsFromProfMgr(deviceName,nodeType,intentConstants.INTENT_TYPE_DEVICE_FX,Arrays.asList(),intentVersion);
        return boardServiceProfileResource;
}

function getBoardServiceProfiles(boardServiceProfileResource) {
    var profileNames = [];
    var boardServiceProfiles = boardServiceProfileResource["LS-FX-NTIO"]["board-service-profile"];
    if (boardServiceProfiles) {
        for (var boardServiceProfile in boardServiceProfiles) {
            profileNames.push(boardServiceProfiles[boardServiceProfile]["name"]);
        }
    }
    return profileNames;
}

function suggestFxInterfaceVersions(valueProviderContext) {
    var deviceManager = getArgumentValue(intentConstants.DEVICE_MANAGER, valueProviderContext);
    var managerInfo = mds.getManagerByName(deviceManager).getType().name();
    if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV){
        var interfaceVersionData = deviceUtilities.getNCYInterfaceVersions(valueProviderContext);
        return apUtils.convertToSuggestReturnFormat(interfaceVersionData, valueProviderContext.getSearchQuery());
    } else  {
        var supportedDeviceTypes = JSON.parse(resourceProvider.getResource(internalIsamResourcePrefix + "supported-device-types.json"));
        return supportedDeviceTypes['device-type'];
    }
}

function suggestFxLTInterfaceVersions(valueProviderContext) {
    var deviceManager = getArgumentValue(intentConstants.DEVICE_MANAGER, valueProviderContext);
    var managerInfo = mds.getManagerByName(deviceManager).getType().name();
    var boardCurrentName = getValuesFromeInput("","currentListValue", valueProviderContext);
        if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV){
            if(boardCurrentName  && boardCurrentName["slot-name"] && boardCurrentName["slot-name"].startsWith("LT")){
                var interfaceVersionData = deviceUtilities.getNAVInterfaceVersionsForBoard(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getInterfaceVersions.xml.ftl", valueProviderContext,intentConstants.INTENT_TYPE_DEVICE_FX);
                return apUtils.convertToSuggestReturnFormat(interfaceVersionData, valueProviderContext.getSearchQuery());
            }else{
                return {};
            }
        } else  {
            var supportedDeviceTypes = JSON.parse(resourceProvider.getResource(internalIsamResourcePrefix + "supported-device-types.json"));
            return supportedDeviceTypes['device-type'];
        }

}

function getValuesFromeInput(keyValue,key,context){
    var inputValues = context.getInputValues();
    var args = inputValues.get(key);
    return args.get(keyValue);
}

function suggestFxIhubInterfaceVersions(valueProviderContext) {
    var deviceManager = getArgumentValue(intentConstants.DEVICE_MANAGER, valueProviderContext);
    var managerInfo = mds.getManagerByName(deviceManager).getType().name();
    if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV){
        var interfaceVersionData = deviceUtilities.getNCYIhubInterfaceVersions(valueProviderContext);
        return apUtils.convertToSuggestReturnFormat(interfaceVersionData, valueProviderContext.getSearchQuery());
    }
}

function suggestIhubSnmpProfileFromAMS(context) {
    var profiles = JSON.parse(resourceProvider.getResource(internalIsamResourcePrefix + "profiles.json"));
    return apUtils.convertToSuggestReturnFormat(profiles[0]["ihubProfile"], context.getSearchQuery());
}

function suggestPlannedTypes(context) {
    var hardwareType = getArgumentValue(intentConstants.HARDWARE_TYPE, context);
    var deviceVersion = getArgumentValue(intentConstants.DEVICE_VERSION, context);
    var inputValues = context.getInputValues();
    var deviceId  = inputValues["target"];
    var boards = inputValues.currentListValue;
    var slotName = boards[0]["slot-name"];
    slotName = slotName.split("/")[0];
    var deviceManager = getArgumentValue(intentConstants.DEVICE_MANAGER, context);
    var managerInfo = mds.getManagerByName(deviceManager).getType().name();
    if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_AMS){
        var defaultValue = "\-";
        var boardType;
        if ((slotName.indexOf(intentConstants.NTA_BOARD) !== -1 || slotName.indexOf(intentConstants.NTB_BOARD) !== -1) && slotName !== intentConstants.NTIO_STRING) {
            boardType = capabilityConstants.SUPPORTED_NT_BOARDS;
        } else if (slotName == intentConstants.NT_STRING) { //Applique will use NTIO Boards
            boardType = capabilityConstants.SUPPORTED_NTIO_BOARDS;
        } else if (slotName.indexOf(intentConstants.ACU_BOARD) !== -1 || slotName.indexOf(intentConstants.NTIO_STRING) !== -1) {
            boardType = capabilityConstants.SUPPORTED_ACU_BOARDS;
        } else if (slotName.indexOf(intentConstants.LT_STRING) !== -1) {
            boardType = capabilityConstants.SUPPORTED_LT_BOARDS;
        }
        if (boardType) {
            var hardwareType = getArgumentValue(intentConstants.HARDWARE_TYPE, context);
            var deviceRelease = getArgumentValue(intentConstants.DEVICE_VERSION, context);
            var supportedBoards = apCapUtils.getCapabilityValue(intentConstants.FAMILY_TYPE_ISAM, deviceRelease, capabilityConstants.DEVICE_CATEGORY,
                        boardType, hardwareType, defaultValue);
            return apUtils.convertToSuggestReturnFormat(supportedBoards, context.getSearchQuery());
        }
        return apUtils.convertToSuggestReturnFormat([defaultValue], context.getSearchQuery());
    }else {
        var suggestArr = [];
        var currentBoard;
        try {
            var boardTypesFromDevices = apUtils.getBoardTypeFromDevice(deviceId, intentConstants.INTENT_TYPE_DEVICE_FX);
            if (boardTypesFromDevices && boardTypesFromDevices[slotName]) {
                currentBoard = boardTypesFromDevices[slotName]["planned-type"];
                if(boardTypesFromDevices[slotName]["board-service-profile"]) {
                    var boardServiceProfile = boardTypesFromDevices[slotName]["board-service-profile"];
                }
            }
        } catch (error) {
            logger.warn(error);
        }
        if (currentBoard && currentBoard !== "-") {
            suggestArr.push("\-");
        }
        var supportedType = getBoardSupportedByPlannedType(slotName, hardwareType, deviceVersion, currentBoard, boardServiceProfile, deviceId);
        for (var item in supportedType) {
            if(supportedType[item] !== ""){
                suggestArr.push(supportedType[item]);
            }
        }
        return apUtils.convertToSuggestReturnFormat(suggestArr, context.getSearchQuery());
    }
}

function suggestPlannedTypesForISAM(context){
    var inputValues = context.getInputValues();
    var boards = inputValues.currentListValue;
    var slotName = boards[0]["slot-name"];
    slotName = slotName.split("/")[0];
    var defaultValue = "\-";
    var boardType;
    if ((slotName.indexOf(intentConstants.NTA_BOARD) !== -1 || slotName.indexOf(intentConstants.NTB_BOARD) !== -1) && slotName !== intentConstants.NTIO_STRING) {
        boardType = capabilityConstants.SUPPORTED_NT_BOARDS;
    } else if (slotName == intentConstants.NT_STRING) { //Applique will use NTIO Boards
        boardType = capabilityConstants.SUPPORTED_NTIO_BOARDS;
    } else if (slotName.indexOf(intentConstants.ACU_BOARD) !== -1 || slotName.indexOf(intentConstants.NTIO_STRING) !== -1) {
        boardType = capabilityConstants.SUPPORTED_ACU_BOARDS;
    } else if (slotName.indexOf(intentConstants.LT_STRING) !== -1) {
        boardType = capabilityConstants.SUPPORTED_LT_BOARDS;
    }
    if (boardType) {
        var hardwareType = getArgumentValue(intentConstants.HARDWARE_TYPE, context);
        var deviceRelease = getArgumentValue(intentConstants.DEVICE_VERSION, context);
        var supportedBoards = apCapUtils.getCapabilityValue(intentConstants.FAMILY_TYPE_ISAM, deviceRelease, capabilityConstants.DEVICE_CATEGORY,
                    boardType, hardwareType, defaultValue);
        return apUtils.convertToSuggestReturnFormat(supportedBoards, context.getSearchQuery());
    }
    return apUtils.convertToSuggestReturnFormat([defaultValue], context.getSearchQuery());
}

function suggestCapabilityProfiles(context) {
    var profiles = JSON.parse(resourceProvider.getResource(internalIsamResourcePrefix + "profiles.json"));
    return apUtils.convertToSuggestReturnFormat(profiles[0]["capabilityProfile"], context.getSearchQuery());
}

function suggestSlotName(valueProviderContext){
    var deviceManager = getArgumentValue(intentConstants.DEVICE_MANAGER, valueProviderContext);
    var managerInfo = mds.getManagerByName(deviceManager).getType().name();
    if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV){
        var hardwareType = getArgumentValue(intentConstants.HARDWARE_TYPE, valueProviderContext);
        if (hardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT)) {
            var numOfSlot = apUtils.getNumberOfPorts(hardwareType);
            var slotList = [];
            for (var i = 1; i <= numOfSlot; i++) {
                slotList.push("LT" + i);
            }
            slotList.push("NTIO", "FAN", "PSU1", "PSU2", "ACU", "NTA", "NTB");
        }
        return apUtils.convertToSuggestReturnFormat(slotList, valueProviderContext.getSearchQuery(), true);
    } else {
        var profiles = JSON.parse(resourceProvider.getResource(internalIsamResourcePrefix + "profiles.json"));
        var slotNames = profiles[0]["slotName"];
        return apUtils.convertToSuggestReturnFormat(slotNames, valueProviderContext.getSearchQuery());
    }
}

function getAllBoardNamesFromHardware(deviceName, restartMode) {
    var slotList = [];
    var resourceName = intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getAllBoardNamesFromHardware.xml";
    var extractedNode = apUtils.getExtractedDeviceSpecificDataNode(resourceName, {"deviceID": deviceName, "restartMode": restartMode});
    if (extractedNode) {
        var boards = apUtils.getAttributeValues(extractedNode, "hw:hardware-state/hw:component/hw:name", apUtils.prefixToNsMap);
        for (var i = 0; i < boards.length; i++){
            slotList.push(boards[i]);
        }
        slotList.push("Chassis");
    }
    return slotList;
}

function suggestEntityName(context){
    var inputValues = context.getInputValues();
    var deviceName = inputValues.target;
    var intentArgs = inputValues.get("intentArguments");
    var restartMode = inputValues.arguments.restart;
    var deviceFXContext = intentArgs.get(intentConstants.INTENT_TYPE_DEVICE_FX);
    var deviceManager = deviceFXContext.get(intentConstants.DEVICE_MANAGER);
    var managerInfo = mds.getManagerByName(deviceManager).getType().name();
    var slotList = [];
    if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV) {
        slotList = getAllBoardNamesFromHardware(deviceName, restartMode);
    } else {
        var mObject = new MObjectProxy(null, deviceName);
        var slotFrNames = mObject.getAllChildrenOfType("Slot", "NE:" + deviceName);
        var mapFqdnAndAttrs = mObject.get(slotFrNames, ["eqptSlotPlannedType", "eqptBoardAdminStatus", "eqptBoardOperStatus"]);
        var slotName;
        for (var i = 0; i < slotFrNames.length; i++){
            var sdpFqdn = slotFrNames.get(i);
            var attributeMap = mapFqdnAndAttrs.get(sdpFqdn);
            var plannedType = attributeMap.get("eqptSlotPlannedType");
            var adminStatus = attributeMap.get("eqptBoardAdminStatus");
            var operStatus = attributeMap.get("eqptBoardOperStatus");
            var slotArr = sdpFqdn.split(".");
            var slot = slotArr[slotArr.length-1].toString();
            if(slot !== "Virtual"){
                slotName = slot + " (" + plannedType + ")";
                if(adminStatus === "unlock" && operStatus === "enabled"){
                    slotList.push("System", slotName);
                }
            }
        }
    }
    return apUtils.convertToSuggestReturnFormat(slotList, context.getSearchQuery(), true);
}

function getArgumentValue(argumentKey, context){
    var inputValues = context.getInputValues();
    var args = inputValues.get("arguments");
    return args.get(argumentKey);
}

function executeRequestInNAC(requestXml) {
    var configResponse = utilityService.executeRequest(requestXml);
    var responseString = utilityService.convertNcResponseToString(configResponse);
    if (responseString == null) {
        throw new RuntimeException("Execution Failed with error "+ responseString);
    }
    return responseString;
}

function suggestCategoriesForLabel(valueProviderContext) {
    var categoriesList = [];
    var curentLabels = getArgumentValue("label", valueProviderContext)
    if (curentLabels && typeof curentLabels.size === "function" && curentLabels.size() > 0) {
        curentLabels.forEach(function (label) {
            if (label && label.category && categoriesList.indexOf(label.category) === -1) {
                categoriesList.push(label.category)
            }
        })
    }
    var categories = apUtils.suggestLabelForCategory(categoriesList);
    return apUtils.convertToSuggestReturnFormat(categories, valueProviderContext.getSearchQuery());
}

function suggestValuesForCategory(valueProviderContext) {
    var inputValues = valueProviderContext.getInputValues();
    var inputArgs = inputValues["arguments"];
    var category =  inputArgs['label'][inputArgs['label'].length -1]['category'];
    var input = inputArgs['label'][inputArgs['label'].length -1]['value'];
    return apUtils.suggestValuesForCategory(input, category);
}

function suggestCageModes(valueProviderContext){
    var hardwareType = getArgumentValue(intentConstants.HARDWARE_TYPE, valueProviderContext);
    if(hardwareType.startsWith(intentConstants.ISAM_FX_PREFIX)){
        var inputValues = valueProviderContext.getInputValues();
        var inputArgs = inputValues["arguments"];
        var currentListValue = inputValues["currentListValue"];
        var plannedType = currentListValue[0]["planned-type"]; //context param
        var ponBoards = getPonBoards(inputArgs);
        var cageModes = [];
        if(ponBoards.indexOf(plannedType) != -1){
            cageModes = apCapUtils.getCapabilityValue(intentConstants.FAMILY_TYPE_ISAM, inputArgs["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, plannedType, []);
            if(cageModes && cageModes.length > 0){
                for(var cageMode in cageModes){
                    if(cageModes[cageMode] == ""){
                        delete cageModes[cageMode];
                    }else {
                        cageModes[cageMode] = cageModes[cageMode].toLowerCase();
                    }
                }
                if(cageModes.indexOf("gpon") != -1 && cageModes.indexOf("mpm") != -1 && cageModes.indexOf("xgs") != -1){
                    cageModes.push("mpm-gpon-xgs");
                    cageModes.splice(cageModes.indexOf("mpm"), 1);
                }
                if(cageModes.indexOf("ngpon2") != -1){
                    cageModes.push("u-ngpon");
                    cageModes.splice(cageModes.indexOf("ngpon2"), 1);
                }
                cageModes.push("not-set");
            }
        }
        return apUtils.convertToSuggestReturnFormat(cageModes, valueProviderContext.getSearchQuery());
    }else {
        cageModes = JSON.parse(resourceProvider.getResource(internalIsamResourcePrefix + "cageMode.json"));
        return apUtils.convertToSuggestReturnFormat(cageModes[0]["cage-modes"], valueProviderContext.getSearchQuery());
    }
}

function getPonBoards(intentConfigArgs){
    var portList = ['GPON','DUAL-GPON','XGS','NGPON2','MPM','25G',''];
    var deviceRelease = intentConfigArgs["device-version"]
    return apCapUtils.getCapabilityContext(intentConstants.FAMILY_TYPE_ISAM, deviceRelease, capabilityConstants.BOARD_CATEGORY,
                capabilityConstants.PORT_TYPE, portList, capabilityConstants.CONTAINS_OR);
}

/**
 * This method returns board type for the planned type with boards json file format e.g
 *
 * @param harwareTtype
 * @Param plannedType e.g) FELT-B, FGLT-B
 * @return Returns board type (PON or ETH)
 */
function getBoardTypeFromPlannedType (hardwareType, plannedType, deviceVersion, slotName) {
    var boardType;
    var boardsList = [];
    var slotList = ["NTIO", "NT", "PSU", "FAN", "ACU"];
    if (slotName.indexOf("LT") > -1) {
        if(plannedType !== "-") {
        var boardType;
        boardsListPON = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_LT_BOARDS, capabilityConstants.HYPHEN_CONTEXT, []);
        portTypeETH = apCapUtils.getCapabilityContext(hardwareType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, capabilityConstants.ETHERNET_ALIAS);
        slotTypeETH = apCapUtils.getCapabilityContext(hardwareType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.SLOT_TYPE, capabilityConstants.LT_ALIAS);

        var boardsListETH = getLTBoardsHasPortTypeIsETH(boardsListPON, portTypeETH, slotTypeETH);

        if (boardsListETH.indexOf(plannedType) > -1) {
            boardType =  "LS-FX-ETH";
        } else if (boardsListPON.indexOf(plannedType) > -1) {
            boardType =  "LS-FX-LT";
        }
        }
        return boardType;
    } else {
        for (var slot in slotList) {
            if(slotName.indexOf(slotList[slot]) > -1){
                var supportedBoards = "supported-" + slotList[slot].toLowerCase() + "-boards";
                var shelfVariant = getShelfVariantFromHardwareType(hardwareType);
                if (slotList[slot] == "PSU" ||  slotList[slot] == "FAN" || slotList[slot] == "ACU") {
                    boardsList = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, supportedBoards, shelfVariant, []);
                    if (boardsList.length == 0 || (boardsList.length == 1 && boardsList[0] == "")) {
                        boardsList = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, supportedBoards, hardwareType, []);
                    }
                } else {
                    boardsList = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, supportedBoards, capabilityConstants.HYPHEN_CONTEXT, []);
                }
                for (var board in boardsList) {
                    if (boardsList[board] === plannedType) {
                        var boardType =  slotList[slot];
                        return boardType;
                    }
                }
            }
        }
    }
};

function getLTBoardsHasPortTypeIsETH(listLTBoards, listLTBoardsHasPortTypeIsETH, listLTBoardsHasSlotTypeIsLT) {
    let boardsListETH = [];
    listLTBoards.filter(function(element) {
        if((listLTBoardsHasPortTypeIsETH.indexOf(element) > -1) && (listLTBoardsHasSlotTypeIsLT.indexOf(element) > -1)) {
            boardsListETH.push(element);
        }
    });
    return boardsListETH;
}

function suggestDeviceTemplates(valueProviderContext) {
    var managerInfos = getManagerInfoFromContext(valueProviderContext);
    var templates = getDeviceTemplates(managerInfos);
    return apUtils.convertToSuggestReturnFormat(templates, valueProviderContext.getSearchQuery());
}

function suggestiHubDeviceTemplates(valueProviderContext) {
    var managerInfos = getManagerInfoFromContext(valueProviderContext);
    if (managerInfos.hardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_F)) {
        managerInfos.hardwareType = intentConstants.FAMILY_TYPE_IHUB_FANT_F_FX + managerInfos.hardwareType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_F, "");
    } else if (managerInfos.hardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_G)) {
        managerInfos.hardwareType = intentConstants.FAMILY_TYPE_IHUB_FANT_G_FX + managerInfos.hardwareType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_G, "");
    } else if (managerInfos.hardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_H)) {
        managerInfos.hardwareType = intentConstants.FAMILY_TYPE_IHUB_FANT_H_FX + managerInfos.hardwareType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_H, "");
    } else if (managerInfos.hardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_M)) {
        managerInfos.hardwareType = intentConstants.FAMILY_TYPE_IHUB_FANT_M_FX + managerInfos.hardwareType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_M, "");
    }
    var templates = getDeviceTemplates(managerInfos);
    return apUtils.convertToSuggestReturnFormat(templates, valueProviderContext.getSearchQuery());
}

function suggestLTDeviceTemplates(valueProviderContext) {
    var managerInfos = getManagerInfoFromContext(valueProviderContext);
    var inputValues = valueProviderContext.getInputValues();
    var templates = [];
    var boards = inputValues.currentListValue;
    var slotName = boards[0]["slot-name"];
    if (slotName.startsWith(intentConstants.FX_LT_STRING)) {
        var ltBoard = boards[0]["planned-type"];

        var hardwareType = getArgumentValue(intentConstants.HARDWARE_TYPE, valueProviderContext);
        var deviceVersion = getArgumentValue(intentConstants.DEVICE_VERSION, valueProviderContext);
        var isEthBoard =false;
        var portType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, ltBoard, []);
        if (portType && portType.length > 0 && portType.indexOf(capabilityConstants.ETHERNET_ALIAS) >= 0) {
            isEthBoard = true;
        }
        if(isEthBoard){
            var boardServiceProfileName = boards[0]["board-service-profile"];
            var deviceDetails = {};
            deviceDetails["useProfileManager"] = true;
            deviceDetails["deviceName"] = inputValues.target;
            deviceDetails["nodeType"] = hardwareType + "-" + deviceVersion;
            deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
            deviceDetails["intentTypeVersion"] = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, inputValues.target);
            deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);
            var boardServiceProfileObj = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", boardServiceProfileName, deviceDetails);
            if(boardServiceProfileObj["model"] === "uplink-mode"){
                managerInfos.hardwareType = intentConstants.LS_FX_PREFIX + "-" + ltBoard + "-"+ intentConstants.UP_LINK_HW_TYPE_POSTFIX;
            }else if(boardServiceProfileObj["model"] === "downlink-mode"){
                managerInfos.hardwareType = intentConstants.LS_FX_PREFIX + "-" + ltBoard + "-"+ intentConstants.DOWN_LINK_HW_TYPE_POSTFIX;
            }
        }
        else {
            managerInfos.hardwareType = intentConstants.LS_FX_PREFIX + "-" + ltBoard;
        }
        templates = getDeviceTemplates(managerInfos);
    }
    return apUtils.convertToSuggestReturnFormat(templates, valueProviderContext.getSearchQuery());
}

function getArgumentFromContext(valueProviderContext) {
    var inputValues = valueProviderContext.getInputValues();
    return inputValues.get("arguments");
}

function getManagerInfoFromContext(valueProviderContext) {
    var inputArguments = getArgumentFromContext(valueProviderContext);
    return {
        "hardwareType": inputArguments.get("hardware-type"),
        "interfaceVersion": inputArguments.get("device-version"),
        "managerName": inputArguments.get("device-manager")
    }
}

function getDeviceTemplates(managerInfos) {
    var resourceName = intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getConfigTemplateMatchingHwTypeVersion.xml.ftl";
    return deviceUtilities.retrieveNAVTemplates(resourceName, managerInfos);
}

function validateCageModeWithPlannedType(intentConfigArgs){
    var ponBoards = getPonBoards(intentConfigArgs);
    if (intentConfigArgs["boards"]) {
      var boardNameList = Object.keys(intentConfigArgs["boards"]);
      for (var inx in boardNameList) {
        var config = intentConfigArgs["boards"][boardNameList[inx]];
        if(config){
            var plannedType = config["planned-type"];

            if(plannedType && plannedType != "-"){
                var isPonBoard = false;
                //Check plannedType is Pon board type
                for(var order in ponBoards){
                    if(ponBoards[order] == plannedType){
                        isPonBoard = true;
                        break;
                    }
                }
                var cageMode = config["cage-mode"];
                if(cageMode){
                    if(cageMode != "not-set" && !isPonBoard){
                    throw new RuntimeException("Cage Mode is not valid for board: " + plannedType);
                    }
                    if(intentConfigArgs["hardware-type"] != "FX-I"){
                        throw new RuntimeException("Hardware type is not valid: " + intentConfigArgs["hardware-type"]);
                    }
                }
            }
        }
      }
    }
}

function validateCapabilityProfiles(intentConfigArgs, contextualErrorJsonObj){
    if (intentConfigArgs["boards"]) {
      var boardNameList = Object.keys(intentConfigArgs["boards"]);
      for (var inx in boardNameList) {
        var config = intentConfigArgs["boards"][boardNameList[inx]];
        if (config) {
            if (!config["capability-profile"]) {
                config["capability-profile"]="-";
            }
        }
      }
    }
}

function validateSupport40Gkr4(input,intentConfigArgs, contextualErrorJsonObj) {
    var boards = intentConfigArgs["boards"];
    var deviceDetails = {};
    var profileNames = [];
    var deviceName = input.getTarget();
    deviceDetails = apUtils.getDeviceDetailForProfileManager(intentConstants.INTENT_TYPE_DEVICE_FX,deviceName,null,intentConfigArgs["device-version"],null,null,null,false);
    profileNames = apUtils.getAssociatedProfileNames(deviceDetails["intentType"],deviceDetails["version"],null,deviceDetails["deviceRelease"],"board-service-profile", intentConstants.FAMILY_TYPE_ISAM_FX,null,null);
    if (boards) {
        Object.keys(boards).forEach(function(board){
            if (boards[board]["board-service-profile"]) {
                var plannedType = boards[board]["planned-type"];
              	var nameFortyGkr4 = boards[board]["board-service-profile"];
                var fortyGKr4ErrorMsg = "list#boards," + board + ",leaf#board-service-profile";
                if (nameFortyGkr4) {
                    deviceDetails = apUtils.getDeviceDetailForProfileManager(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName, deviceName, deviceDetails["deviceRelease"], null, null, null, true, intentConstants.ISAM_FX_PREFIX, intentConstants.MANAGER_TYPE_AMS);
                    var profileData = apUtils.getParsedProfileDetailsFromProfMgr(deviceDetails["deviceName"], deviceDetails["nodeType"], deviceDetails["intentType"], deviceDetails["excludeList"], deviceDetails["intentTypeVersion"]);
                    var listProfiles = profileData[intentConstants.FAMILY_TYPE_ISAM_FX]["board-service-profile"];
                    for (var profileName in listProfiles) {
                        if (listProfiles[profileName]["name"] == nameFortyGkr4 && (plannedType.contains(intentConstants.FAMILY_TYPE_FELT)) && listProfiles[profileName]["forty-g-kr4"] != "inherit" && listProfiles[profileName]["forty-g-kr4"] != ""
                            && boards[intentConstants.NTA_BOARD] && boards[intentConstants.NTA_BOARD]["planned-type"] == "FANT-F") {
                            contextualErrorJsonObj[fortyGKr4ErrorMsg] = "The 40GKR4 is not valid for the " + plannedType + " with " + nameFortyGkr4 + " on this device.";
                        }
                    }
                    if (profileNames.indexOf(nameFortyGkr4) === -1){
                        contextualErrorJsonObj[fortyGKr4ErrorMsg] = "The 40GKR4 is not valid for the "+ plannedType +" with "+ nameFortyGkr4 +" on this device.";
                    }
                    var slotName = boards[board]["slot-name"];
                    if(slotName && slotName == "NT"){
                        contextualErrorJsonObj[fortyGKr4ErrorMsg] = "Board Profile is not supported for Applique slot";
                    }
                }
            }
        });
    }
}

function validateFANT_MRedundantPair(intentConfigArgs, contextualErrorJsonObj){
    var boards = intentConfigArgs["boards"];
    if (boards && ((boards["NTA"] && boards["NTA"]["planned-type"] === "FANT-M" && boards["NTB"] && boards["NTB"]["planned-type"] !== "FANT-M")
            || (boards["NTB"] && boards["NTB"]["planned-type"] === "FANT-M" && boards["NTA"] && boards["NTA"]["planned-type"] !== "FANT-M"))){
        if (boards["NTA"]["planned-type"] === "FANT-M"){
            contextualErrorJsonObj["list#boards,NTA,leaf#planned-type"] = "FANT-M can only be in redundant pair with another FANT-M.";
        } else if (boards["NTB"]["planned-type"] === "FANT-M") {
            contextualErrorJsonObj["list#boards,NTB,leaf#planned-type"] = "FANT-M can only be in redundant pair with another FANT-M.";
        }
    }
}

function getIntentConfigJson(syncInput) {
    var intentConfigJson = {};
    apUtils.convertIntentConfigXmlToJson(syncInput.getIntentConfiguration(), extensionConfigObject.getKeyForList, intentConfigJson, null, ["geo-coordinates"]);
    return intentConfigJson;
}

function getLtBoardAdminStateAttributes(deviceName, args, result) {
    if (!result) {
        result = {};
    }
    if (!args || apUtils.ifObjectIsEmpty(args.ltBoards) || !args.response) return result;
    let ltBoards = args.ltBoards;
    try {
        if (apUtils.ifObjectIsEmpty(ltBoards)) return {};
        let boards = Object.keys(ltBoards);
        let datapath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceName + "\']";
        let response = utilityService.extractSubtree(args.response, apUtils.prefixToNsMap, datapath + "/adh:device-specific-data");
        if (!response) return {}; 
        boards.forEach(function (board) {
            var adminState = utilityService.getAttributeValue(response, datapath + "/adh:device-specific-data/hw:hardware-state/hw:component[hw:name=\'Board-" + ltBoards[board] + "\']/hw:state/hw:admin-state", apUtils.prefixToNsMap);
            var stateLastChangedTime = utilityService.getAttributeValue(response, datapath + "/adh:device-specific-data/hw:hardware-state/hw:component[hw:name=\'Board-" + ltBoards[board] + "\']/hw:state/hw:state-last-changed", apUtils.prefixToNsMap);
            result[board] = {};
            logger.debug("LT {} adminState {} stateLastChangedTime {}", ltBoards[board], adminState,stateLastChangedTime )

            if (adminState) {
                result[board].adminState = adminState;
            }
            if (stateLastChangedTime) {
                result[board].stateLastChangedTime = stateLastChangedTime;
            }
        })
    } catch (e) {
        logger.error("Error when getting admin-state of LT boards " + e);
    }
    return result;
}

function getStateAttributes(stateRetrievalInput) {
    if (stateRetrievalInput.getNetworkState().name() === "delete") {
        return null;
    } else {
        var intentConfigJson = getIntentConfigJson(stateRetrievalInput);
        var managerName = intentConfigJson[intentConstants.DEVICE_MANAGER];
        var managerType = mds.getManagerByName(managerName).getType().name();
        if (managerType == null || managerType != intentConstants.MANAGER_TYPE_NAV) {
            return null;
        }
        var fxName = stateRetrievalInput.getTarget();
        var deviceReachable = apUtils.getReachabilityStatusByDeviceName(fxName);
        var validLTDevices = [];
        var ltAdminStateAttributes = {};
        let ltBoards = {};
        var boardOnuModelInfo = {};
        if (intentConfigJson["boards"] && typeof intentConfigJson["boards"] === "object") {
            var boards = Object.keys(intentConfigJson["boards"]);
            if (boards.length > 0) {
                var boardServiceProfileOnuModelInfo = {};
                if(managerType == intentConstants.MANAGER_TYPE_NAV){
                    var nodeType = [intentConfigJson["hardware-type"], intentConfigJson["device-version"]].join('-');
                    var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, fxName);
                    var profiles = getServiceProfile(fxName, nodeType, intentVersion);
                    var listProfiles = profiles["LS-FX-LT"]["board-service-profile"];
                }
                if (listProfiles) {
                    for (var profileName in listProfiles) {
                        boardServiceProfileOnuModelInfo[listProfiles[profileName]["name"]] = listProfiles[profileName]["onu-model"];
                    }
                }
                boards.forEach(function (board) {
                    var plannedType = intentConfigJson["boards"][board]["planned-type"];
                    if (board.indexOf(intentConstants.FX_LT_STRING) === 0 && plannedType !== "-") {
                        validLTDevices.push(fxName + intentConstants.FX_DEVICE_SEPARATOR + board);
                        ltBoards[fxName + intentConstants.FX_DEVICE_SEPARATOR + board] = board;
                        var onuModel = intentConstants.ONU_MODEL_VONU;
                        var boardServiceProfile = intentConfigJson["boards"][board]["board-service-profile"];
                        if (boardServiceProfile) {
                            onuModel = boardServiceProfileOnuModelInfo[boardServiceProfile];
                        }
                        boardOnuModelInfo[fxName + intentConstants.FX_DEVICE_SEPARATOR + board] = onuModel;
                    }
                });
            }
        }
        logger.debug ("Valid LT Devices: {}", JSON.stringify(validLTDevices));
        var filteredLTDevices = [];
        var otherStateAttrsRequested = false;
        if (stateRetrievalInput.getFilterTreeElement() != null) {
            var nsMap = {
                "nc": "urn:ietf:params:xml:ns:netconf:base:1.0",
                "fx": "http://www.nokia.com/management-solutions/device-fx"
            };
            var filteredDevicesFromXml = utilityService.getAttributeValues(stateRetrievalInput.getFilterTreeElement(), '/nc:filter/fx:device-fx-state/fx:board-state/fx:device-name/text()', nsMap);
            if (filteredDevicesFromXml != null && filteredDevicesFromXml.size() > 0) {
                for (var i = 0; i < filteredDevicesFromXml.size(); i++) {
                    filteredLTDevices.push(filteredDevicesFromXml.get(i));
                    filteredLTDevices.push(fxName + intentConstants.FX_DEVICE_SEPARATOR + filteredDevicesFromXml.get(i));
                }
            }
            logger.debug("Filter LT Devices: {}", JSON.stringify(filteredLTDevices));
            var stateSubtree = utilityService.extractSubtree(stateRetrievalInput.getFilterTreeElement(), nsMap, "/nc:filter/fx:device-fx-state");
            if (stateSubtree != null && stateSubtree.hasChildNodes()) {
                var children = stateSubtree.getChildNodes();
                for (var i = 0; i < children.getLength(); i++) {
                    var child = children.item(i);
                    if (child.getNodeType() == 1) {
                        // Element Node
                        if ("board-state" !== child.getLocalName()) {
                            otherStateAttrsRequested = true;
                            break;
                        }
                    }
                }
            }
        }
        var targetDevices = [];
        if (filteredLTDevices.length == 0) {
            if (otherStateAttrsRequested == false) {
                // Nothing specified as filter - so fetch all
                otherStateAttrsRequested = true;
                targetDevices = validLTDevices;
            }
        } else {
            targetDevices = filteredLTDevices.filter(function (e) {return validLTDevices.indexOf(e) > -1;});
        }
        if (otherStateAttrsRequested === true) {
            targetDevices.push(fxName);
        }
        logger.debug ("Target Devices: {}", JSON.stringify(targetDevices));
        load({
            script: resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "virtualizer-device-mgmt.js"),
            name: intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "virtualizer-device-mgmt.js"
        });
        let extraArgs = null;
        if (!apUtils.ifObjectIsEmpty(ltBoards)) {
            extraArgs = {
                "ltBoards": ltBoards,
                "ntDeviceName": fxName
            }
        }
        if (targetDevices.length == 0) {
            return deviceUtilities.getStateReport({}, "internal/lightspan/stateReport.xml.ftl");
        }
        var stateData;
        if(deviceReachable === 'false'){
            stateData = deviceUtilities.getSwStateAttributesForDevicesFromAV(managerName, targetDevices, extraArgs);
        }else{
            stateData = deviceUtilities.getSwStateAttributesForDevices(managerName, targetDevices, extraArgs);
        }
        logger.debug("Aggregated State Data JSON: {}", JSON.stringify(stateData));
        if (!apUtils.ifObjectIsEmpty(ltBoards)) {
            getLtBoardAdminStateAttributes(fxName, extraArgs, ltAdminStateAttributes);
        }
        var args = null;
        if (stateData[fxName] && deviceReachable === 'true') {
            if (intentConfigJson["duid"]) {
                deviceUtilities.getDiscoverableDuids(fxName, stateData);
            }
            args = stateData[fxName];

        } else if (stateData[fxName]) {
            args = stateData[fxName];
        } else {
            args = {};
        }
        args["ltDevices"] = [];
        var softwareTargetsAlignedLtDevices = [];
        targetDevices.forEach(function (deviceName) {
            if (deviceName !== fxName) {
                var ltDevice = stateData[deviceName];
                ltDevice["name"] = deviceName;
                if (!apUtils.ifObjectIsEmpty(boardOnuModelInfo) && boardOnuModelInfo[deviceName]) {
                    ltDevice["onuModel"] = boardOnuModelInfo[deviceName];
                }
                if (ltAdminStateAttributes[deviceName] && ltAdminStateAttributes[deviceName]["adminState"]) {
                    ltDevice["adminState"] = ltAdminStateAttributes[deviceName]["adminState"];
                }
                if (ltAdminStateAttributes[deviceName] && ltAdminStateAttributes[deviceName]["stateLastChangedTime"]) {
                    ltDevice["stateLastChanged"] = ltAdminStateAttributes[deviceName]["stateLastChangedTime"];
                }
                //FNMS-75975 - Check SW Status Aligned against target-active-software for LT
                var lastIndex = deviceName.lastIndexOf(intentConstants.FX_DEVICE_SEPARATOR);
                var board = deviceName.substring(lastIndex + 1, ltDevice.length);
                var ltConfigJson = intentConfigJson["boards"][board];

                var deviceVersion = ltConfigJson["device-version"];

                if (deviceVersion == null) {
                    deviceVersion = intentConfigJson["device-version"];
                }
                args["ltDevices"].push(ltDevice);
                softwareTargetsAlignedLtDevices.push(ltDevice["softwareTargetsAligned"]);
            }
        });
        logger.debug ("Structured State Data JSON: {}", JSON.stringify(args));
        if ((!args["eonuAligned"] || args["eonuAligned"] == "true") && args["softwareTargetsAligned"] && args["softwareTargetsAligned"] == "true" && (!args["transformationSoftwareState"].aligned || args["transformationSoftwareState"].aligned == "true") && (softwareTargetsAlignedLtDevices.length == 0 || softwareTargetsAlignedLtDevices.every(e => e == "true") == true)) {
            args["allSoftwaresAligned"] = "true";
        } else {
            args["allSoftwaresAligned"] = "false";
        }
        return deviceUtilities.getStateReport(args, "internal/lightspan/stateReport.xml.ftl");
    }
}


function suggestSoftwareFilesFromAltiplano(valueProviderContext) {
    var hardwareType = getArgumentValue(intentConstants.HARDWARE_TYPE, valueProviderContext);
    var suggestedSoftwareFilesOnServer = deviceUtilities.getSoftwareFilesFromAltiplano(
        intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getSoftwareFilesFromServer.xml.ftl",
        valueProviderContext, hardwareType);
    return apUtils.convertToSuggestReturnFormat(
        suggestedSoftwareFilesOnServer,
        valueProviderContext.getSearchQuery());
}

function suggestBoardSoftwareFilesFromAltiplano(valueProviderContext) {
    valueProviderContext.getInputValues().arguments.isBoardActiveSoftware = true;
    var hardwareType = getArgumentValue(intentConstants.HARDWARE_TYPE, valueProviderContext);
    var suggestedSoftwareFilesOnServer = deviceUtilities.getSoftwareFilesFromAltiplano(
        intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getSoftwareFilesFromServer.xml.ftl",
        valueProviderContext, hardwareType);
    return apUtils.convertToSuggestReturnFormat(
        suggestedSoftwareFilesOnServer,
        valueProviderContext.getSearchQuery());
}

function suggestEontSoftwareFilesFromAltiplano(valueProviderContext) {
    var suggestedSoftwareFilesOnServer = deviceUtilities.getSoftwareFilesFromAltiplano(
        intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getEonuSoftwareFilesFromServer.xml.ftl",
        valueProviderContext, "VONU");
    return apUtils.convertToSuggestReturnFormat(
        suggestedSoftwareFilesOnServer,
        valueProviderContext.getSearchQuery());
}

function suggestEonuVendorSpecificSoftwareFilesFromAltiplano(valueProviderContext) {
    var suggestedSoftwareFilesOnServer = deviceUtilities.getSoftwareFilesFromAltiplano(
        intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getEonuVendorSpecificSoftwareFilesFromServer.xml.ftl",
        valueProviderContext, intentConstants.VONU_FAMILY_TYPE);
    return apUtils.convertToSuggestReturnFormat(suggestedSoftwareFilesOnServer,
        valueProviderContext.getSearchQuery());
}

function suggestTransformationSoftwareFilesFromAltiplano(valueProviderContext) {
    var suggestedSoftwareFilesOnServer = deviceUtilities.getSoftwareFilesFromAltiplano(
        intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getTransformationSoftwareFilesFromServer.xml.ftl",
        valueProviderContext, intentConstants.VONU_FAMILY_TYPE);
    return apUtils.convertToSuggestReturnFormat(suggestedSoftwareFilesOnServer,
        valueProviderContext.getSearchQuery());
}

function suggestPassiveSoftwareFilesFromAltiplano(valueProviderContext) {
    valueProviderContext.getInputValues().arguments.isPassiveSoftware = true;
    var suggestedSoftwareFilesOnServer = deviceUtilities.getSoftwareFilesFromAltiplano(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getSoftwareFilesFromServer.xml.ftl", valueProviderContext);
    return apUtils.convertToSuggestReturnFormat(suggestedSoftwareFilesOnServer, valueProviderContext.getSearchQuery());
}

function suggestONUSWFilesFromAltiplano(valueProviderContext) {
    var suggestedSoftwareFilesOnServer = deviceUtilities.getSuggestedSoftwareFilesMassEonuSwUpgrade(valueProviderContext);
    return apUtils.convertToSuggestReturnFormat(suggestedSoftwareFilesOnServer,valueProviderContext.getSearchQuery());
}

function suggestCategoriesLabel(valueProviderContext) {
    var categories = apUtils.suggestLabelForCategory();
    return apUtils.convertToSuggestReturnFormat(categories, valueProviderContext.getSearchQuery());
}

function getBoardSupportedByPlannedType(slotName, hardwareType, deviceVersion, currentBoard, boardServiceProfile, devieName) {
    var supportedType = [];
    var shelfVariant = getShelfVariantFromHardwareType(hardwareType);
    if (slotName.indexOf("NTIO") > -1) {
        supportedType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_NTIO_BOARDS, capabilityConstants.HYPHEN_CONTEXT, []);
    } else if (slotName.indexOf("NT") > -1) {
        supportedType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_NT_BOARDS, capabilityConstants.HYPHEN_CONTEXT, []);
    } else if (slotName.indexOf("PSU") > -1) {
        supportedType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_PSU_BOARDS, shelfVariant, []);
        if (supportedType.length == 0 || (supportedType.length == 1 && supportedType[0] == "")) {
            supportedType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_PSU_BOARDS, hardwareType, []);
        }
    } else if (slotName.indexOf("FAN") > -1) {
        supportedType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_FAN_BOARDS, shelfVariant, []);
        if (supportedType.length == 0 || (supportedType.length == 1 && supportedType[0] == "")) {
            supportedType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_FAN_BOARDS, hardwareType, []);
        }
    } else if (slotName.indexOf("LT") > -1) {
        if (currentBoard && currentBoard !== "-"){
            var hwType = "LS-FX-" + currentBoard;
            var isEthBoard = false;
            var portType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, currentBoard, []);
            if (portType && portType.length > 0 && portType.indexOf(capabilityConstants.ETHERNET_ALIAS) >= 0) {
                isEthBoard = true;
            }
            if(isEthBoard && boardServiceProfile){
                var deviceDetails = {};
                deviceDetails["useProfileManager"] = true;
                deviceDetails["deviceName"] = devieName;
                deviceDetails["nodeType"] = hardwareType + "-" + deviceVersion;
                deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
                deviceDetails["intentTypeVersion"] = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, devieName);
                deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);
                var boardServiceProfileObj = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", boardServiceProfile, deviceDetails);
                if(boardServiceProfileObj["model"] === "uplink-mode"){
                    hwType = hwType + "-" + intentConstants.UP_LINK_HW_TYPE_POSTFIX;
                }else if(boardServiceProfileObj["model"] === "downlink-mode"){
                    hwType = hwType + "-" + intentConstants.DOWN_LINK_HW_TYPE_POSTFIX;
                }
            }
            supportedType = apCapUtils.getCapabilityValue(hwType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.COMPATIBLE_BOARDS, currentBoard, []);

        } else {
            supportedType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_LT_BOARDS, capabilityConstants.HYPHEN_CONTEXT, []);
        }
        
    } else if (slotName.indexOf("ACU") > -1) {
        supportedType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_ACU_BOARDS, shelfVariant, []);
        if (supportedType.length == 0 || (supportedType.length == 1 && supportedType[0] == "")) {
            supportedType = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_ACU_BOARDS, hardwareType, []);
        }
    }
    return supportedType;
}

function setRollbackFlag(actionInput) {
    return softwareActions.setRollBack(actionInput);
}

function unsetRollbackFlag(actionInput) {
    return softwareActions.unsetRollBack(actionInput);
}

function getDevicehardwareType(actionInput) {
    return softwareActions.getDevicehardwareType(actionInput);
}
function triggerONUSoftwareOperation(actionInput) {
    return softwareActions.triggerONUSoftwareOperation(actionInput);
}

function triggerSoftwareSync(actionInput) {
    return softwareActions.triggerSoftwareSync(actionInput)
}

function suggestUsedSlotNames (context) {
    var inputValues = context.getInputValues();
    var intentArgs = inputValues.get("intentArguments");
    var deviceFXContext = intentArgs.get(intentConstants.INTENT_TYPE_DEVICE_FX);
    var deviceManager = deviceFXContext.get(intentConstants.DEVICE_MANAGER);
    var managerInfo = mds.getManagerByName(deviceManager).getType().name();
    var slotList = [];
    if (managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV) {
        var boards = deviceFXContext.get("boards");
        if (boards) {
            var ltPattern = new RegExp(intentConstants.FX_LT_REG_EXP);
            if (typeof boards.add === "function") {
                boards.forEach(function(board){
                    if (board.get("slot-name") && ltPattern.test(board.get("slot-name"))) {
                        slotList.push(board.get("slot-name"));
                    }
                })
            } else if (boards.get("slot-name") && ltPattern.test(boards.get("slot-name"))) {
                slotList.push(boards.get("slot-name"));
            }
        }
    }
    return apUtils.convertToSuggestReturnFormat(slotList, context.getSearchQuery(), false);
}

load({script: resourceProvider.getResource('internal/actions/device-families/callhome-restart/lightspan/handler.js'),
        name: 'internal/actions/device-families/callhome-restart/lightspan/handler.js'});

function callhomeRestart(actionInput) {
    
    var intentConfigJson = getIntentConfigJson(actionInput);
    var deviceType = intentConfigJson["hardware-type"];
    var deviceRelease = intentConfigJson["device-version"];
    var isTlsServerConfigurationSupported = apCapUtils.getCapabilityValue(deviceType, deviceRelease, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_TLS_SERVER_CONFIGURATION_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
    if(isTlsServerConfigurationSupported)
    {
        if(intentConfigJson["duid"])
        {
            var callhomeRestart = new callhomeRestartUtil();
            var deviceName = actionInput.getTarget();
            var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
            var boards = intentConfigJson["boards"];
            var prefix = deviceName + ".";
            var requestArray = [];
            var instanceJsonObject = {};
            if (apUtils.isIhubSupportedFamilyType(nodeType)) {
                instanceJsonObject.iHUB_instance = deviceName + intentConstants.DOT_LS_IHUB;
                instanceJsonObject.iHUB_DUID = String(intentConfigJson["duid"]).replace(intentConstants.LS_NT_SHELF_DUID_POSTFIX, intentConstants.LS_NT_IHUB_DUID_POSTFIX);                
            }            
            requestArray.push(deviceName);
            var regex = /\bLT\d+\b/;
            for each(var board in boards) {        
                if(regex.test(board["slot-name"]))
                {
                    var instanceName = prefix + board["slot-name"];
                    requestArray.push(instanceName);            
                }
            };
            requestArray.push(instanceJsonObject);
            return callhomeRestart.callhomeRestartFunction(requestArray);
        }
        else
        {
            return utilityService.buildErrorActionResponse("Restart Callhome action is not supported on a non Callhome device");
        }
    }
    else {
        return utilityService.buildErrorActionResponse("Restart Callhome action is not supported on this device");
    }
}

load({script: resourceProvider.getResource('internal/actions/device-families/show-cfm-mac-per-board/lightspan/handler.js'),
        name: 'internal/actions/device-families/show-cfm-mac-per-board/lightspan/handler.js'});

function showCFMMACPerBoard(actionInput) {
    var slotPath = "sw:show-cfm-mac-per-board/sw:card-name/text()";
    var slotName = getActionInput(actionInput, slotPath, "show-cfm-mac-per-board");
    var intentConfigJson = getIntentConfigJson(actionInput);
    var boards = intentConfigJson["boards"];
    var slotNameList = [];
    for(var index in boards){
        var board = boards[index];
        if (board["slot-name"].startsWith(intentConstants.LT_STRING)) {
            slotNameList.push(board["slot-name"]);
        }
    };
    var deviceName = actionInput.getTarget();
    var deviceManager = intentConfigJson["device-manager"];
    var managerInfo = mds.getManagerByName(deviceManager).getType().name();
    if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_NAV){
        if(slotName && slotNameList.indexOf(slotName) !== -1 && deviceName) {
            var cfmMacPerBoard = new CfmMacPerBoardUtil();
            return cfmMacPerBoard.show(deviceName + "." + slotName);
        } else {
            for(var i = 0; i < slotNameList.length ; i++){
                if(slotNameList[i].startsWith(intentConstants.LT_STRING)){
                    return utilityService.buildErrorActionResponse("'" + slotName + "' is not configured");
                }
            }
            return utilityService.buildErrorActionResponse("Not supported by board '" + slotName + "'");
        }
    } else {
        return utilityService.buildErrorActionResponse("Device is not managed by the Network Virtualizer.");
    }
}

function suggestCardName(valueProviderContext) {
    return suggestUsedSlotNames(valueProviderContext);
}

load({script: resourceProvider.getResource('internal/actions/device-families/cpu-memory-monitoring-action/iSAM/handler.js'),
        name: 'internal/actions/device-families/cpu-memory-monitoring-action/iSAM/handler.js'});

function startCpuMemoryMonitoring(actionInput) {
    var cpuMemoryMonitoring = new cpuMemoryMonitoringUtil();
    var result;
    var intentConfigJson = getIntentConfigJson(actionInput);
    var deviceName = actionInput.getTarget();
    var informationAboutDevice = apfwk.gatherInformationAboutDevices([deviceName])[0];
    var familyTypeRelease = informationAboutDevice["familyTypeRelease"];
    var boards = intentConfigJson["boards"];
    var subrack = "R1.S1.";
    if (familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)) {
        for each(var board in boards) {
            var instanceName = subrack + board["slot-name"];
            result = cpuMemoryMonitoring.startCpuMemoryMonitoring(deviceName, instanceName);
        };
    } else if (familyTypeRelease.startsWith(intentConstants.LS_FX_PREFIX)) {
        return utilityService.buildErrorActionResponse("Start CPU/Memory Monitoring action is not supported on device type '" + intentConstants.LS_FX_PREFIX + "'");
    }
    return result;
}

function stopCpuMemoryMonitoring(actionInput) {
    var cpuMemoryMonitoring = new cpuMemoryMonitoringUtil();
    var result;
    var intentConfigJson = getIntentConfigJson(actionInput);
    var deviceName = actionInput.getTarget();
    var informationAboutDevice = apfwk.gatherInformationAboutDevices([deviceName])[0];
    var familyTypeRelease = informationAboutDevice["familyTypeRelease"];
    var boards = intentConfigJson["boards"];
    var subrack = "R1.S1.";
    if (familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)) {
        for each(var board in boards) {
            var instanceName = subrack + board["slot-name"];
            result = cpuMemoryMonitoring.stopCpuMemoryMonitoring(deviceName, instanceName);
        };
    } else if (familyTypeRelease.startsWith(intentConstants.LS_FX_PREFIX)) {
        return utilityService.buildErrorActionResponse("Stop CPU/Memory Monitoring action is not supported on device type '" + intentConstants.LS_FX_PREFIX + "'");
    }
    return result;
}

function enableSlidingWinStatsMonitoring(actionInput) {
    var deviceName = actionInput.getTarget();
    var informationAboutDevice = apfwk.gatherInformationAboutDevices([deviceName])[0];
    var familyTypeRelease = informationAboutDevice["familyTypeRelease"];
    if (familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)) {
        load({ script: resourceProvider.getResource('internal/actions/device-families/enable-disable-sliding-window-stats/iSAM/handler.js'), name: 'handler.js' });
        var actionSlidingWindowStatistics = "http://www.nokia.com/management-solutions/enable-disable-sliding-window-stats";
        var slidingWindowStatistics = new slidingWindowStatisticsFromISAM("internal/actions/device-families/enable-disable-sliding-window-stats/iSAM/", actionSlidingWindowStatistics);
        return slidingWindowStatistics.getEnableSlidingWindowStatistics(deviceName);
    } else {
        return utilityService.buildErrorActionResponse("'Enable Sliding Window Statistics' action is not supported on the current device type");
    }
}

function disableSlidingWinStatsMonitoring(actionInput) {
    var deviceName = actionInput.getTarget();
    var informationAboutDevice = apfwk.gatherInformationAboutDevices([deviceName])[0];
    var familyTypeRelease = informationAboutDevice["familyTypeRelease"];
    if (familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)) {
        load({ script: resourceProvider.getResource('internal/actions/device-families/enable-disable-sliding-window-stats/iSAM/handler.js'), name: 'handler.js' });
        var actionSlidingWindowStatistics = "http://www.nokia.com/management-solutions/enable-disable-sliding-window-stats";
        var slidingWindowStatistics = new slidingWindowStatisticsFromISAM("internal/actions/device-families/enable-disable-sliding-window-stats/iSAM/", actionSlidingWindowStatistics);
        return slidingWindowStatistics.getDisableSlidingWindowStatistics(deviceName);
    } else {
        return utilityService.buildErrorActionResponse("'Disable Sliding Window Statistics' action is not supported on the current device type");
    }
}

function getExternalAlarm(deviceVersion, intentConfigJson, deviceName) {
    var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
    var nodeType = [intentConfigJson["hardware-type"], intentConfigJson["device-version"]].join('-');
    var externalAlarmStr = apUtils.getParsedProfileDetailsFromProfMgr(deviceName,nodeType,intentConstants.INTENT_TYPE_DEVICE_FX,Arrays.asList("LS-FX"),intentVersion);
    return externalAlarmStr;

}

function restart ( actionInput ) {
    var deviceType;
    var restartActions;
    var deviceName = actionInput.getTarget();
    var informationAboutDevice = apfwk.gatherInformationAboutDevices([deviceName])[0];
    var deviceType = informationAboutDevice["familyType"];
    var familyTypeRelease = informationAboutDevice["familyTypeRelease"];
    var actionPath = "sw:restart/sw:restart/text()";
    var slotPath = "sw:restart/sw:entity/text()";
    var restartMode = getActionInput(actionInput, actionPath, "restart");
    var slotName = getActionInput(actionInput, slotPath, "restart");
    var boardName = slotName.substring(slotName.indexOf("(")+1, slotName.length-1);
    if (familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)) {
        if(restartMode == "to-default-configuration"){
            return utilityService.buildErrorActionResponse("Restart type '" + restartMode + "' is not supported on this device");
        }
        var deviceRelease = familyTypeRelease.substring(familyTypeRelease.indexOf(".") + 1);
        var isHotRestartSupported = apCapUtils.getCapabilityValue(deviceType, deviceRelease, capabilityConstants.DEVICE_CATEGORY,
            capabilityConstants.IS_HOT_RESTART_SUPPORTED, intentConstants.ISAM_FX_PREFIX, false);
        if(!isHotRestartSupported){
            return utilityService.buildErrorActionResponse("Not Supported");
        }
        if(!slotName.contains("System")){
            var isResetSupported = apCapUtils.getCapabilityValue(deviceType, deviceRelease, capabilityConstants.BOARD_CATEGORY,
                capabilityConstants.IS_RESET_SUPPORTED, boardName, false);
            if(!isResetSupported){
                return utilityService.buildErrorActionResponse("This action does not support on this board type.");
            }
        }
        load({script: resourceProvider.getResource('internal/actions/device-families/restart/iSAM/handler.js'), name: 'internal/actions/device-families/restart/iSAM/handler.js'});
        restartActions = new RestartActions();
        return restartActions.restart(deviceName, intentConstants.ISAM_FX_PREFIX, "ams:NE System:IACM", restartMode, slotName);
    } else {
        if(restartMode == "hardware-reset-to-factory-datastore") {
            var slotList = getAllBoardNamesFromHardware(deviceName, restartMode);
            if(slotList.length > 0 && slotList.indexOf(slotName)) {
                return utilityService.buildErrorActionResponse("Invalid Chassis or Slot Name");
            }
        }
        return restartAction.restart(deviceName, restartMode, slotName);
    }
}

function getActionInput(actionInput, actionPath, actionType) {
    var prefixNsMap = {
        "nc": "urn:ietf:params:xml:ns:netconf:base:1.0",
        "yang": "urn:ietf:params:xml:ns:yang:1",
        "ibn": "http://www.nokia.com/management-solutions/ibn",
        "sw": "http://www.nokia.com/management-solutions/" + actionType
    };
    return utilityService.evalXpathForText(actionInput.getActionTreeElement(), prefixNsMap, "/nc:rpc/yang:action/ibn:ibn/ibn:intent/ibn:intent-specific-data/" + actionPath);
}

function enableNtProtectionGroup (actionInput) {
    return executeNtProtectionGroupAction(actionInput, "enable");
}

function disableNtProtectionGroup (actionInput) {
    return executeNtProtectionGroupAction(actionInput, "disable");
}

function executeNtProtectionGroupAction(actionInput,actionType){
    var switchover;
    var relativeObjectIDSlotNT;
    var deviceName = actionInput.getTarget();
    var informationAboutDevice = apfwk.gatherInformationAboutDevices([deviceName])[0];
    var familyTypeRelease = informationAboutDevice["familyTypeRelease"];
    var deviceType = informationAboutDevice["familyType"];
    if (familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)) {
        var intentConfigJson = getIntentConfigJson(actionInput);
        var boardsConfig = intentConfigJson["boards"];
        var deviceRelease = familyTypeRelease.substring(familyTypeRelease.indexOf(".") + 1);
        var isNtProtectionGrSupported = apCapUtils.getCapabilityValue(deviceType, deviceRelease, capabilityConstants.DEVICE_CATEGORY,
            capabilityConstants.IS_NT_PROTECTION_SUPPORTED, intentConstants.ISAM_FX_PREFIX, false);
        if(!isNtProtectionGrSupported){
            return utilityService.buildErrorActionResponse("Equipment Protection is not supported");
        }
        if(actionType == "enable"){
            if(!boardsConfig["NTA"] || !boardsConfig["NTB"]){
                return utilityService.buildErrorActionResponse("Require both NTA and NTB planned to Enable NT Protection");
            }
        }
        var namespace = "http://www.nokia.com/management-solutions/switchover";
        var handlerResourcePath = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "actions" + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_DEVICE_FAMILIES
                          + intentConstants.FILE_SEPERATOR + "switchover" + intentConstants.FILE_SEPERATOR + "iSAM" + intentConstants.FILE_SEPERATOR; //internal/actions/device-families/switchover/iSAM/
        load({ script: resourceProvider.getResource(handlerResourcePath + 'handler.js'), name: 'handler.js' });
        switchover = new switchOverUtil(handlerResourcePath, namespace);
        var mObject = new MObjectProxy(null, deviceName);
        var arrayFrNT = getFrNTArray(mObject, deviceName);
        for (var i = 0; i < arrayFrNT.length; i++) {
            var slotArray = arrayFrNT[i].split(":");
            var ntSlot = slotArray[3].split(".");
            if (ntSlot[2] == "NTA") {
                relativeObjectIDSlotNT = slotArray[3];
                break;
            } else if (ntSlot[2] == "NTB") {
                relativeObjectIDSlotNT = slotArray[3];
                break;
            }
        }
    } else {
        if(actionType == "enable")
            return switchoverLs.enableNtProtectionGroup(deviceName);
        else
            return switchoverLs.disableNtProtectionGroup(deviceName);
    }
    return switchover.executeNtProtectionGroupAction(deviceName, intentConstants.ISAM_FX_PREFIX, relativeObjectIDSlotNT,actionType);
}

function switchoverNormal(actionInput) {
    var switchover;
    var relativeObjectIDSlotNT = [];
    var deviceName = actionInput.getTarget();
    var informationAboutDevice = apfwk.gatherInformationAboutDevices([deviceName])[0];
    var familyTypeRelease = informationAboutDevice["familyTypeRelease"];
    var deviceType = informationAboutDevice["familyType"];
    if (familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)) {
        var deviceRelease = familyTypeRelease.substring(familyTypeRelease.indexOf(".") + 1);
        var isNtProtectionGrSupported = apCapUtils.getCapabilityValue(deviceType, deviceRelease, capabilityConstants.DEVICE_CATEGORY,
            capabilityConstants.IS_NT_PROTECTION_SUPPORTED, intentConstants.ISAM_FX_PREFIX, false);
        if(!isNtProtectionGrSupported){
            return utilityService.buildErrorActionResponse("Equipment Protection is not supported");
        }
        var namespace = "http://www.nokia.com/management-solutions/switchover";
        var handlerResourcePath = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "actions" + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_DEVICE_FAMILIES
                          + intentConstants.FILE_SEPERATOR + "switchover" + intentConstants.FILE_SEPERATOR + "iSAM" + intentConstants.FILE_SEPERATOR; //internal/actions/device-families/switchover/iSAM/
        load({ script: resourceProvider.getResource(handlerResourcePath + 'handler.js'), name: 'handler.js' });
        switchover = new switchOverUtil(handlerResourcePath, namespace);
        var mObject = new MObjectProxy(null, deviceName);
        var arrayFrNT = getFrNTArray(mObject, deviceName);
        arrayFrNT.forEach(function (slotFrName) {
            var slotArray = slotFrName.split(":");
            var ntSlot = slotArray[3].split(".");
            if (ntSlot[2] == "NTA" || ntSlot[2] == "NTB") {
                relativeObjectIDSlotNT.push(slotFrName);
            }
        });
    } else {
        return switchoverLs.switchoverNormal(deviceName);
    }
    return switchover.switchoverNormal(deviceName, intentConstants.ISAM_FX_PREFIX, relativeObjectIDSlotNT);
}

function switchoverForced (actionInput) {
    var switchover;
    var deviceName = actionInput.getTarget();
    var relativeObjectIDSlotNTA;
    var relativeObjectIDSlotNTB;
    var informationAboutDevice = apfwk.gatherInformationAboutDevices([deviceName])[0];
    var familyTypeRelease = informationAboutDevice["familyTypeRelease"];
    var deviceType = informationAboutDevice["familyType"];
    if (familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)) {
        var deviceRelease = familyTypeRelease.substring(familyTypeRelease.indexOf(".") + 1);
        var isNtProtectionGrSupported = apCapUtils.getCapabilityValue(deviceType, deviceRelease, capabilityConstants.DEVICE_CATEGORY,
            capabilityConstants.IS_NT_PROTECTION_SUPPORTED, intentConstants.ISAM_FX_PREFIX, false);
        if(!isNtProtectionGrSupported){
            return utilityService.buildErrorActionResponse("Equipment Protection is not supported");
        }
        var namespace = "http://www.nokia.com/management-solutions/switchover";
        var handlerResourcePath = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "actions" + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_DEVICE_FAMILIES
                          + intentConstants.FILE_SEPERATOR + "switchover" + intentConstants.FILE_SEPERATOR + "iSAM" + intentConstants.FILE_SEPERATOR; //internal/actions/device-families/switchover/iSAM/
        load({ script: resourceProvider.getResource(handlerResourcePath + 'handler.js'), name: 'handler.js' });
        switchover = new switchOverUtil(handlerResourcePath, namespace);
        var mObject = new MObjectProxy(null, deviceName);
        var arrayFrNT = getFrNTArray(mObject, deviceName);
        arrayFrNT.forEach(function (slotFrName) {
            var slotArray = slotFrName.split(":");
            var ntSlot = slotArray[3].split(".");
            if(ntSlot[2] == "NTA") {
                relativeObjectIDSlotNTA = slotArray[3];
            } else if(ntSlot[2] == "NTB") {
                relativeObjectIDSlotNTB = slotArray[3];
            }
        });
    }else {
        return switchoverLs.switchoverForced(deviceName);
    }
    return switchover.switchoverForced(deviceName, intentConstants.ISAM_FX_PREFIX, relativeObjectIDSlotNTA, relativeObjectIDSlotNTB);
}

function enableMcastChannelsMonitoring(actionInput) {
    var deviceName = actionInput.getTarget();
    var deviceInfo = apfwk.gatherInformationAboutDevices([deviceName])[0];
    var familyTypeRelease = deviceInfo["familyTypeRelease"];
    var deviceType = deviceInfo["familyType"];

    if(familyTypeRelease && familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)){
        var deviceRelease = familyTypeRelease.substring(familyTypeRelease.indexOf(".") + 1);
        var isMcastMonitoringSupported = apCapUtils.getCapabilityValue(deviceType, deviceRelease, capabilityConstants.DEVICE_CATEGORY,
                capabilityConstants.IS_MULTICAST_CONTINUITY_MONITORING_SUPPORTED, intentConstants.ISAM_FX_PREFIX, false);
        if(!isMcastMonitoringSupported){
            return utilityService.buildErrorActionResponse("Enable Multicast Channels Monitoring is not supported on the current device '" + familyTypeRelease + "'");
        }
        var actionInputArgs = {};
        var minThresholdsPath = "sw:enable-multicast-channels-monitoring/sw:multicast-channel-min-thresholds/text()";
        actionInputArgs["multicast-channel-min-thresholds"] = getActionInput(actionInput, minThresholdsPath, "multicast-continuity-monitoring");

        var maxThresholdsPath = "sw:enable-multicast-channels-monitoring/sw:multicast-channel-max-thresholds/text()";
        actionInputArgs["multicast-channel-max-thresholds"] = getActionInput(actionInput, maxThresholdsPath, "multicast-continuity-monitoring");

        var namespace = "http://www.nokia.com/management-solutions/multicast-continuity-monitoring";
        var handlerResourcePath = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "actions" + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_DEVICE_FAMILIES
                        + intentConstants.FILE_SEPERATOR + "multicast-continuity-monitoring" + intentConstants.FILE_SEPERATOR + "iSAM" + intentConstants.FILE_SEPERATOR; //internal/actions/device-families/multicast-continuity-monitoring/iSAM/
        load({ script: resourceProvider.getResource(handlerResourcePath + "handler.js"), name: "handler.js" });
        var mcastContinuityMonitoring = new mcastContinuityMonitoringUtil(handlerResourcePath, namespace);
        var mcastSystemFN = "Multicast System Parameters:" + deviceName + ":IACM";
        return mcastContinuityMonitoring.enableMcastMonitoring(deviceName, mcastSystemFN, actionInputArgs);
    }
    return utilityService.buildErrorActionResponse("Enable Multicast Channels Monitoring is not supported on the current device type");
}

function disableMcastChannelsMonitoring(actionInput) {
    var deviceName = actionInput.getTarget();
    var deviceInfo = apfwk.gatherInformationAboutDevices([deviceName])[0];
    var familyTypeRelease = deviceInfo["familyTypeRelease"];
    var deviceType = deviceInfo["familyType"];

    if(familyTypeRelease && familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)){
        var deviceRelease = familyTypeRelease.substring(familyTypeRelease.indexOf(".") + 1);
        var isMcastMonitoringSupported = apCapUtils.getCapabilityValue(deviceType, deviceRelease, capabilityConstants.DEVICE_CATEGORY,
                capabilityConstants.IS_MULTICAST_CONTINUITY_MONITORING_SUPPORTED, intentConstants.ISAM_FX_PREFIX, false);
        if(!isMcastMonitoringSupported){
            return utilityService.buildErrorActionResponse("Disable Multicast Channels Monitoring is not supported on the current device '" + familyTypeRelease + "'");
        }

        var namespace = "http://www.nokia.com/management-solutions/multicast-continuity-monitoring";
        var handlerResourcePath = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "actions" + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_DEVICE_FAMILIES
                        + intentConstants.FILE_SEPERATOR + "multicast-continuity-monitoring" + intentConstants.FILE_SEPERATOR + "iSAM" + intentConstants.FILE_SEPERATOR; //internal/actions/device-families/multicast-continuity-monitoring/iSAM/
        load({ script: resourceProvider.getResource(handlerResourcePath + "handler.js"), name: "handler.js" });
        var mcastContinuityMonitoring = new mcastContinuityMonitoringUtil(handlerResourcePath, namespace);
        var mcastSystemFN = "Multicast System Parameters:" + deviceName + ":IACM";
        return mcastContinuityMonitoring.disableMcastMonitoring(deviceName, mcastSystemFN);
    }
    return utilityService.buildErrorActionResponse("Disable Multicast Channels Monitoring is not supported on the current device type");
}

function getFrNTArray(mObject, deviceName) {
    try{
        var slotFrNames = mObject.getAllChildrenOfType("Slot", "NE:" + deviceName);
        var frNTArray = [];
        var result = [];
        var matchingString = /NT/g;
        slotFrNames.forEach(function (slotFrName) {
            var elementArry = slotFrName.split(":");
            if (elementArry[3].match(matchingString)) {
                frNTArray.push(slotFrName);
            }
        });
        for (var i =0 ; i<frNTArray.length;i++){
            if(frNTArray[i].indexOf('Virtual')==-1) {
                result.push(frNTArray[i]);
            }
        }
        return result;
    } catch (e) {
        throw new RuntimeException("Execute action failed with error :" + e);
    }
}

function getDeviceDetailsForProfileManager(deviceName, nodeType, intentTypeVersion) {
    var deviceDetails = {};
    deviceDetails["useProfileManager"] = true;
    deviceDetails["deviceName"] = deviceName;
    deviceDetails["nodeType"] = nodeType
    deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
    deviceDetails["intentTypeVersion"] = intentTypeVersion;
    deviceDetails["excludeList"] = Arrays.asList(profileConstants.TZ_NAME_PROFILE_LS.subType);
    return deviceDetails;
}

// When reinit is needed, uncomment and customize this according to needs
/**
function reInitialize(reinitializeInput) {
    var intentConfigArgs = {};
    apUtils.convertIntentConfigXmlToJson(reinitializeInput.getIntentConfiguration(), this.extensionConfigObject.getKeyForList, intentConfigArgs);
    var managerName = intentConfigArgs[intentConstants.DEVICE_MANAGER];
    var managerInfo = mds.getManagerByName(managerName).getType().name();
    if(managerInfo && managerInfo == intentConstants.MANAGER_TYPE_AMS) {
        var updatedLsConfigJson = {};
        var reinitializeInputArgs = reinitializeInput.getArguments();
        //update basic configuration of LS-FX
        updateLsFxConfig(updatedLsConfigJson, reinitializeInputArgs);
        if (intentConfigArgs["boards"] && reinitializeInputArgs["boards"]) { //Checking boards of ISAM FX
            var reinitializeBoardsInput = JSON.parse(reinitializeInputArgs["boards"].replace(/'/g, '"')); //get the boards of reinitialize input
            var boardInputKeys = Object.keys(reinitializeBoardsInput);
            var boards = [];
            var boardNameList = Object.keys(intentConfigArgs["boards"]); //get the boards of ISAM FX
            for (var inx in boardNameList) {
                var isamBoardConfig = intentConfigArgs["boards"][boardNameList[inx]];
                var slotName =  isamBoardConfig["slot-name"];
                var plannedType = isamBoardConfig["planned-type"];
                if (boardInputKeys.indexOf(slotName) >= 0 && reinitializeBoardsInput[slotName]["planned-type"] == plannedType) {
                    //Just add the board which has same name with reinitialize input and has planned type which is supported by LS-FX
                    var boardInfo = {};
                    boardInfo["slot-name"] = slotName;
                    boardInfo["planned-type"] = plannedType;
                    if(slotName && slotName.startsWith(intentConstants.FX_LT_STRING)){
                        boardInfo["board-service-profile"] = reinitializeBoardsInput[slotName]["board-service-profile"];
                        boardInfo["device-version"] = reinitializeBoardsInput[slotName]["device-version"];
                    } else if(slotName && slotName == intentConstants.NT_STRING) {
                        boardInfo["slot-name"] = intentConstants.NTIO_STRING;
                    } else if(slotName && slotName == intentConstants.ACU_NTIO_BOARD){
                        boardInfo["slot-name"] = intentConstants.ACU_BOARD;
                    }
                    boards.push(boardInfo);
                }
            }
            if (boards.length > 0){
                updatedLsConfigJson["boards"] = boards; //Put array boards
            }
        }
        if (intentConfigArgs["ip-address"]) {
            updatedLsConfigJson["ip-address"] = intentConfigArgs["ip-address"]; //Put ip-address
        }

        var baseConfig = "<configuration xmlns=\"http://www.nokia.com/management-solutions/ibn\">";
        var prefix = "<device-fx xmlns=\"http://www.nokia.com/management-solutions/device-fx\">";
        var convertedXml = apUtils.convertObjectToXmlElement(updatedLsConfigJson); //Convert json to xml
        var suffix = "</device-fx>";
        var basConfEnd = "</configuration>";

        var updatedConfigStr = baseConfig + prefix + convertedXml + suffix + basConfEnd;

        var reInitializeOutput = new ReinitializeOutput(updatedConfigStr, null, null);
        return reInitializeOutput;
    } else {
        throw new RuntimeException("Only support re-initialize from ISAM to LS-FX");
    }
}

function updateLsFxConfig(updatedConfigJson, inputArgs){
    if (inputArgs["device-manager"]) {
        updatedConfigJson["device-manager"] = inputArgs["device-manager"];
    }

    if (inputArgs["hardware-type"]) {
        if (inputArgs["isamDeviceFamily"]) {
            if (inputArgs["hardware-type"].contains(inputArgs["isamDeviceFamily"])) {
                updatedConfigJson["hardware-type"] = inputArgs["hardware-type"];
            } else {
                throw new RuntimeException("The input hardware type " + inputArgs["hardware-type"] + " for re-initialize does not match with ISAM device type " + inputArgs["isamDeviceFamily"]);
            }
        } else {
            updatedConfigJson["hardware-type"] = inputArgs["hardware-type"];
        }
    }

    if (inputArgs["device-version"]) {
        updatedConfigJson["device-version"] = inputArgs["device-version"];
    }

    if (inputArgs["username"]) {
        updatedConfigJson["username"] = inputArgs["username"];
    }

    if (inputArgs["password"]) {
        updatedConfigJson["password"] = inputArgs["password"];
    }

    if (inputArgs["ip-port"]) {
        updatedConfigJson["ip-port"] = inputArgs["ip-port"];
    } else {
        updatedConfigJson["ip-port"] = "832";
    }

    if (inputArgs["push-nav-configuration-to-device"]) {
        updatedConfigJson["push-nav-configuration-to-device"] = inputArgs["push-nav-configuration-to-device"];
    } else {
        updatedConfigJson["push-nav-configuration-to-device"] = "true";
    }

    if (inputArgs["transport-protocol"]) {
        updatedConfigJson["transport-protocol"] = inputArgs["transport-protocol"];
    } else {
        updatedConfigJson["transport-protocol"] = "ssh";
    }

    if (inputArgs["device-template"]) {
        updatedConfigJson["device-template"] = inputArgs["device-template"];
    } else {
        updatedConfigJson["device-template"] = "default";
    }

    if (inputArgs["ihub-device-template"]) {
        updatedConfigJson["ihub-device-template"] = inputArgs["ihub-device-template"];
    } else {
        updatedConfigJson["ihub-device-template"] = "default";
    }
}
*/

function getProfileSubType(nodeType) {
    var profileSubtype = {};
    profileSubtype[profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT.profileType] = profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT.subType;
    return profileSubtype;
}

function getAllProfileVOList(profileSubtypes) {
    var profileTypeNames = [
        profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT.profileType,
    ];
    return getProfileVOList(profileTypeNames,profileSubtypes);
}

function getProfileVOList(profileTypeNames, profileSubtypes) {
    var profileObjectList = {};
    profileTypeNames.forEach(function (profileType) {
        profileObjectList[profileType] = {
            "name": null,
            "subType": profileSubtypes[profileType]
        };
    });
    var deviceFxProfileVOList = new ArrayList();

    Object.keys(profileObjectList).forEach(function (profileType) {
        if (profileObjectList[profileType]["subType"]) {
            var profileVO = intentProfileInputFactory.createIntentProfileInputVO(profileObjectList[profileType]["name"], profileObjectList[profileType]["subType"], profileType);
            deviceFxProfileVOList.add(profileVO);
        }
    });
    return deviceFxProfileVOList;
}

function getProfileFromAllDeviceFxProfiles(allDeviceFxProfiles, objKey, profileType, subType, profileName) {
    if (objKey) {
        if (!allDeviceFxProfiles[objKey]) {
            return null;
        }
        allDeviceFxProfiles = allDeviceFxProfiles[objKey];
    }
    if (allDeviceFxProfiles && allDeviceFxProfiles[profileType] && allDeviceFxProfiles[profileType][subType]) {
            if (profileName) {
                if (allDeviceFxProfiles[profileType][subType][profileName]) {
                    return allDeviceFxProfiles[profileType][subType][profileName];
                }
            } else {
                return allDeviceFxProfiles[profileType][subType];
            }
    }
    return null;
}

function loadDeviceFxIntentProfilesFromProfileManager(deviceName, nodeType, intentTypeVersion, validateContext) {
    var profileFromProfileManager = {};
    var hwType = nodeType.substring(0, nodeType.lastIndexOf("-"));
    var deviceRelease = nodeType.substring(nodeType.lastIndexOf("-") + 1);
    var nodeType = hwType + "-" + deviceRelease;
    var intentTypeVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);

    var profileSubtypes = getProfileSubType(nodeType);
    var deviceFxProfileVOList = getAllProfileVOList(profileSubtypes);
    var allDeviceFxProfiles = loadValidateProfiles(deviceFxProfileVOList, intentTypeVersion, deviceRelease, hwType);
    if (validateContext) {
        validateContext["allDeviceFxProfiles"] = allDeviceFxProfiles;
    }
    if (allDeviceFxProfiles) {
        var deviceOAMProfiles = getProfileFromAllDeviceFxProfiles(allDeviceFxProfiles, intentConstants.SINGLE_PROFILE_CONFIG, profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT.profileType, profileSubtypes[profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT.profileType], null);
        profileFromProfileManager["deviceOAMProfiles"] = deviceOAMProfiles;
    }
    return profileFromProfileManager;
}

function loadValidateProfiles(deviceFxProfileVOList,intentTypeVersion, deviceRelease,hardwareType){
    if(deviceFxProfileVOList){
        var allDeviceFxProfiles = loadSpecificProfiles(intentConstants.INTENT_TYPE_DEVICE_FX, intentTypeVersion, deviceRelease, hardwareType, deviceFxProfileVOList);
        return allDeviceFxProfiles;
    }
}

function loadSpecificProfiles(intentType, intentVersion, deviceRelease, hardwareType, profileDetails) {
    return apUtils.getSpecificProfilesInAllFormat(intentType, intentVersion, deviceRelease, hardwareType, profileDetails, true);
}

function getProfilesAndDependencyInfos(deviceInfo, intentVersion, intentConfigJson,validateContext) {
    var hwTypeRelease = deviceInfo.familyTypeRelease;
  	var managerType = deviceInfo.managerType;
  	var profileObjList = [];
    if(intentConfigJson["boards"]){
        var boardNameList = Object.keys(intentConfigJson["boards"]);
        for (var inx in boardNameList) {
            if(intentConfigJson["boards"]){
                var config = intentConfigJson["boards"][boardNameList[inx]];
                if (config && config["board-service-profile"]) {
                    intentConfigJson["board-service-profile"] = config["board-service-profile"];
                }
                if(managerType == intentConstants.MANAGER_TYPE_NAV){
                    if(config["slot-name"] == intentConstants.ACU_BOARD){
                        var externalAlarm = getScanPointProfileName(intentConfigJson["board-service-profile"], intentConstants.ACU_BOARD, deviceInfo.name, intentConfigJson);
                        profileObjList.push (
                        {
                            "profileName": intentConfigJson["board-service-profile"],
                            "profileType": profileConstants.BOARD_SERVICE_PROFILE_LS_FX_ACU.profileType,
                            "profileSubType": profileConstants.BOARD_SERVICE_PROFILE_LS_FX_ACU.subType,
                            "profileDependency": profileConstants.DEPENDENCY_TYPE.strong
                	    },
                        {
                            "profileName": externalAlarm,
                            "profileType": profileConstants.EXTERNAL_ALARM_PROFILE_LS_FX.profileType,
                            "profileSubType": profileConstants.EXTERNAL_ALARM_PROFILE_LS_FX.subType,
                            "profileDependency": profileConstants.DEPENDENCY_TYPE.low
                        })
                    }
                    else if(config["slot-name"].startsWith(intentConstants.LT_STRING)){
                        var plannedType = config["planned-type"];
                        var boardType = getBoardTypeFromPlannedType(intentConfigJson["hardware-type"], plannedType, intentConfigJson["device-version"], config["slot-name"]);
                        profileObjList.push(
                        {
                            "profileName": intentConfigJson["board-service-profile"],
                            "profileType": profileConstants.BOARD_SERVICE_PROFILE_LS_FX_LT.profileType,
                            "profileSubType": boardType,
                            "profileDependency": profileConstants.DEPENDENCY_TYPE.strong
                        })
                    }
                    else if(config["slot-name"].startsWith(intentConstants.NTIO_STRING)){
                        profileObjList.push(
                        {
                            "profileName": intentConfigJson["board-service-profile"],
                            "profileType": profileConstants.BOARD_SERVICE_PROFILE_LS_FX_NTIO.profileType,
                            "profileSubType": profileConstants.BOARD_SERVICE_PROFILE_LS_FX_NTIO.subType,
                            "profileDependency": profileConstants.DEPENDENCY_TYPE.strong
                        })
                    }
                }

            }

        }
    }
    var requestContext = requestScope.get();
    if ( requestContext && requestContext.get("isTimeZoneNameSupported")) {
        if (intentConfigJson["timezone-name"] && managerType == intentConstants.MANAGER_TYPE_NAV){
            profileObjList.push(
            {
                "profileName": intentConfigJson["timezone-name"].split("/")[0],
                "profileType": profileConstants.TZ_NAME_PROFILE_LS.profileType,
                "profileSubType": profileConstants.TZ_NAME_PROFILE_LS.subType,
                "profileDependency": profileConstants.DEPENDENCY_TYPE.strong
            }) ;
        }
    }
    if (intentConfigJson["main-oam-connectivity-account"] && managerType == intentConstants.MANAGER_TYPE_NAV) {
        profileObjList.push(
            {
                "profileName": intentConfigJson["main-oam-connectivity-account"],
                "profileType": profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT.profileType,
                "profileSubType": profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT.subType,
                "profileDependency": profileConstants.DEPENDENCY_TYPE.low
            }
        );
    }
    if (intentConfigJson["fallback-oam-connectivity-account"] && managerType == intentConstants.MANAGER_TYPE_NAV) {
        profileObjList.push(
            {
                "profileName": intentConfigJson["fallback-oam-connectivity-account"],
                "profileType": profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT.profileType,
                "profileSubType": profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT.subType,
                "profileDependency": profileConstants.DEPENDENCY_TYPE.low
            }
        );
    }
    if(managerType == intentConstants.MANAGER_TYPE_AMS){
       var deviceRelease = hwTypeRelease.substring(hwTypeRelease.lastIndexOf("-") + 1);
       var deviceDetails = apUtils.getDeviceDetailForProfileManager(intentConstants.INTENT_TYPE_DEVICE_FX,deviceInfo.name,deviceInfo.target,deviceRelease,null,null,null,true,intentConstants.ISAM_FX_PREFIX,intentConstants.MANAGER_TYPE_AMS);
       var profileData = apUtils.getParsedProfileDetailsFromProfMgr(deviceDetails["deviceName"], deviceDetails["nodeType"], deviceDetails["intentType"], deviceDetails["excludeList"], deviceDetails["intentTypeVersion"]);
       var listProfiles = profileData[intentConstants.FAMILY_TYPE_ISAM_FX]["board-service-profile"];
        for(var profileName in listProfiles){
            if(intentConfigJson["board-service-profile"] && listProfiles[profileName]["name"] == intentConfigJson["board-service-profile"]){
                profileObjList = [{
                    "profileName" : listProfiles[profileName]["name"],
                    "profileType": profileConstants.BOARD_SERVICE_PROFILE.profileType,
                    "profileSubType": profileConstants.BOARD_SERVICE_PROFILE.subType,
                    "profileDependency" : profileConstants.DEPENDENCY_TYPE.strong
                }]
            }
        }
        if (intentConfigJson["isam-oam-connectivity-account"]) {
            profileObjList.push(
                {
                    "profileName": intentConfigJson["isam-oam-connectivity-account"],
                    "profileType": profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT_ISAM.profileTypeIsam,
                    "profileSubType": profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT_ISAM.subTypeIsam,
                    "profileDependency": profileConstants.DEPENDENCY_TYPE.low
                }
            );
        }
    }
    return apUtils.computeAndGetDependentProfileList(deviceInfo,intentConstants.INTENT_TYPE_DEVICE_FX,intentVersion,profileObjList);
}

function migrateToV4(intentConfigJson) {
    if(intentConfigJson["boards"]){
        var board = intentConfigJson["boards"];
            if(board != null){
                for (var boardKeys in board){
                    if(boardKeys.indexOf("LT") == -1){
                        if(board[boardKeys]["device-version"] != null){
                            board[boardKeys]["device-version"] = "";
                        }
                    }
                }
            }
            intentConfigJson["boards"] = board;
    }
}

function rollbackToV3(intentConfigJson) {
    if(intentConfigJson["ihub-version"]){
        delete intentConfigJson["ihub-version"];
    }
    if(intentConfigJson["passive-ihub-version"]){
        delete intentConfigJson["passive-ihub-version"];
    }
}

function rollbackToV4(intentConfigJson) {
    if(intentConfigJson["boards"]){
        intentConfigJson["boards"].forEach(function (item) {
            if (item["host-id"]) {
                delete item["host-id"];
            }
        });
    }
    if (intentConfigJson["onu-active-software-mapping"]) {
        delete intentConfigJson["onu-active-software-mapping"];
    }
    if (intentConfigJson["onu-passive-software-mapping"]) {
        delete intentConfigJson["onu-passive-software-mapping"];
    }
}

function migrateToV6(input, intentConfigJson, topology, topologyXtraInfo) {
    var deviceName = input.getTarget();

    if(intentConfigJson["hardware-type"] == intentConstants.ISAM_FX_PREFIX){
        /* migrate topology */
        var stageName = "create-device-FX_" + deviceName + "_ARGS";
        if (topologyXtraInfo && topologyXtraInfo["lastIntentConfig"]) {
            if(topologyXtraInfo["lastIntentConfig"]){
                var lastIntentConfig = JSON.parse(topologyXtraInfo["lastIntentConfig"]);
                lastIntentConfig = migrateTopoToIncludeGeoCoordinates(lastIntentConfig);
                apUtils.setTopologyExtraInfo(topology, "lastIntentConfig", JSON.stringify(lastIntentConfig));
            }
            if(topologyXtraInfo[stageName]){
                var intentConfigJsonInTopology = JSON.parse(topologyXtraInfo[stageName]);
                intentConfigJsonInTopology = migrateTopoToIncludeGeoCoordinates(intentConfigJsonInTopology);
                apUtils.setTopologyExtraInfo(topology, stageName, JSON.stringify(intentConfigJsonInTopology));
            }
        }
    }
}

function migrateTopoToIncludeGeoCoordinates(topoObject){
    if(topoObject && (topoObject["latitude"] || topoObject["longitude"])){
        topoObject["geo-coordinates"] = {};
        if(topoObject["latitude"]){
            topoObject["geo-coordinates"]["latitude"] = topoObject["latitude"];
            delete topoObject["latitude"];
        }
        if(topoObject["longitude"]){
            topoObject["geo-coordinates"]["longitude"] = topoObject["longitude"];
            delete topoObject["longitude"];
        }
    }
    return topoObject;
}

function rollbackToV5(input, intentConfigJson, topology, topologyXtraInfo) {
    var deviceName = input.getTarget();
    if(intentConfigJson["boards"]){
        intentConfigJson["boards"].forEach(function (item) {
            if (item["admin-state"]) {
                if (item["admin-state"] == "locked") {
                    throw new RuntimeException("Admin State of '" + item["slot-name"] + "' have set to 'locked', please first change it to 'unlocked' and then do the migrate!");
                } else {
                    delete item["admin-state"];
                }
            }
            if (item["planned-type"]) {
                if (item["host-id"]) {
                    var deviceVersion;
                    var isHostIdConfigurationSupported;
                    var deviceType = intentConfigJson["hardware-type"].substring(0, 6) + item["planned-type"];
                    if (item["device-version"]) {
                        deviceVersion = item["device-version"];
                    } else {
                        deviceVersion = intentConfigJson["device-version"];
                    }
                    isHostIdConfigurationSupported = apCapUtils.getCapabilityValue(deviceType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_HOST_ID_CONFIGURATION_SUPPORTED, item["planned-type"], false);
                    if (item["host-id"] && !isHostIdConfigurationSupported) {
                        delete item["host-id"];
                    }
                }
            }
        });
    }
    apUtils.handleOnuSoftwareMappingInIntentMigration(intentConfigJson);

    if(intentConfigJson["hardware-type"] == intentConstants.ISAM_FX_PREFIX){
        /* rollback topology */
        if(intentConfigJson["geo-coordinates"]){
            if(intentConfigJson["geo-coordinates"]["latitude"]){
                intentConfigJson["latitude"] = intentConfigJson["geo-coordinates"]["latitude"];
            }
            if(intentConfigJson["geo-coordinates"]["longitude"]){
                intentConfigJson["longitude"] = intentConfigJson["geo-coordinates"]["longitude"];
            }
        }

        var stageName = "create-device-FX_" + deviceName + "_ARGS";
        if (topologyXtraInfo && topologyXtraInfo["lastIntentConfig"]) {
            if(topologyXtraInfo["lastIntentConfig"]){
                var lastIntentConfig = JSON.parse(topologyXtraInfo["lastIntentConfig"]);
                lastIntentConfig = rollbackTopoToExcludeGeoCoordinates(lastIntentConfig);
                apUtils.setTopologyExtraInfo(topology, "lastIntentConfig", JSON.stringify(lastIntentConfig));
            }
            if(topologyXtraInfo[stageName]){
                var intentConfigJsonInTopology = JSON.parse(topologyXtraInfo[stageName]);
                intentConfigJsonInTopology = rollbackTopoToExcludeGeoCoordinates(intentConfigJsonInTopology);
                apUtils.setTopologyExtraInfo(topology, stageName, JSON.stringify(intentConfigJsonInTopology));
            }
        }
    }
    if(intentConfigJson["geo-coordinates"]){
        delete intentConfigJson["geo-coordinates"];
    }
}

function rollbackTopoToExcludeGeoCoordinates(topoObject){
    if(topoObject && topoObject["geo-coordinates"]){
        if(topoObject["geo-coordinates"]["latitude"]){
            topoObject["latitude"] = topoObject["geo-coordinates"]["latitude"];
        }
        if(topoObject["geo-coordinates"]["longitude"]){
            topoObject["longitude"] = topoObject["geo-coordinates"]["longitude"];
        }
        delete topoObject["geo-coordinates"];
    }
    return topoObject;
}

function rollbackToV6(input, intentConfigJson, topology, topologyXtraInfo) {
    var deviceName = input.getTarget();
    if(intentConfigJson["boards"]){
        intentConfigJson["boards"].forEach(function (item) {
            if (item["admin-state"]) {
                if (item["admin-state"] == "locked") {
                    throw new RuntimeException("Admin State of '" + item["slot-name"] + "' have set to 'locked', please first change it to 'unlocked' and then do the migrate!");
                } else {
                    delete item["admin-state"];
                }
            }
        });
    }
    apUtils.handleOnuSoftwareMappingInIntentMigration(intentConfigJson);
    var oamConnectivityAccount;
    if(intentConfigJson["isam-oam-connectivity-account"]){
        var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
        var hardwareType = intentConfigJson["hardware-type"];
        var deviceRelease = intentConfigJson["device-version"]
        var oamConnectivityAccountProfiles = new ArrayList();
        var snmpProfileVO = intentProfileInputFactory.createIntentProfileInputVO(intentConfigJson["isam-oam-connectivity-account"], intentConstants.ISAM_PREFIX, profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT_ISAM.profileTypeIsam);
        oamConnectivityAccountProfiles.add(snmpProfileVO);
        if (oamConnectivityAccountProfiles && oamConnectivityAccountProfiles.length > 0) {
            var snmpProfileData = loadSpecificProfiles(intentConstants.INTENT_TYPE_DEVICE_FX, intentVersion, deviceRelease, hardwareType, oamConnectivityAccountProfiles);
        }
        if(snmpProfileData && snmpProfileData[profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT_ISAM.profileTypeIsam]){
            oamConnectivityAccount = snmpProfileData[profileConstants.DEVICE_OAM_CONNECTIVITY_ACCOUNT_ISAM.profileTypeIsam][intentConstants.ISAM_PREFIX][0];
            intentConfigJson["iacm-snmp-profile"] = oamConnectivityAccount["iacm-snmp-profile"];
            intentConfigJson["ihub-snmp-profile"] = oamConnectivityAccount["ihub-snmp-profile"];
            delete intentConfigJson["isam-oam-connectivity-account"];
        }
    }
    if(intentConfigJson["hardware-type"] == intentConstants.ISAM_FX_PREFIX){
        /* rollback topology */
        var stageName = "create-device-FX_" + deviceName + "_ARGS";
        if (topologyXtraInfo && topologyXtraInfo["lastIntentConfig"]) {
            if(topologyXtraInfo["lastIntentConfig"]){
                var lastIntentConfig = JSON.parse(topologyXtraInfo["lastIntentConfig"]);
                lastIntentConfig = rollbackTopoToExcludeOamConnectivityAccount(lastIntentConfig, oamConnectivityAccount);
                apUtils.setTopologyExtraInfo(topology, "lastIntentConfig", JSON.stringify(lastIntentConfig));
            }
            if(topologyXtraInfo[stageName]){
                var intentConfigJsonInTopology = JSON.parse(topologyXtraInfo[stageName]);
                intentConfigJsonInTopology = rollbackTopoToExcludeOamConnectivityAccount(intentConfigJsonInTopology, oamConnectivityAccount);
                apUtils.setTopologyExtraInfo(topology, stageName, JSON.stringify(intentConfigJsonInTopology));
            }
        }
    }
}

function rollbackTopoToExcludeOamConnectivityAccount(topoObject, oamConnectivityAccount){
    if(topoObject && topoObject["isam-oam-connectivity-account"] && oamConnectivityAccount ){
        topoObject["iacm-snmp-profile"] = oamConnectivityAccount["iacm-snmp-profile"];
        topoObject["ihub-snmp-profile"] = oamConnectivityAccount["ihub-snmp-profile"];
        delete topoObject["isam-oam-connectivity-account"];
    }
    return topoObject
}

/**
    * This method returns shelf variant to be use in device capability
    *
    * @param harwareType
    * @return Returns shelf variant "FX-4", "FX-8" or "FX-16"
*/
function getShelfVariantFromHardwareType(hardwareType) {
    var shelfVariant;
    if (hardwareType.endsWith("FX4")) {
        shelfVariant = capabilityConstants.FX4;
    } else if (hardwareType.endsWith("FX8")) {
        shelfVariant = capabilityConstants.FX8;
    } else if (hardwareType.endsWith("FX16")) {
        shelfVariant = capabilityConstants.FX16;
    }
    return shelfVariant;
}

function getONUSoftwareStatus(actionInput){
    return softwareActions.getONUSoftwareStatus(actionInput);
}

function convertStorageTypeToEnumValue() {
    return {
        "non-volatile": "3",
        "permanent": "4"
    }
}

function convertIntervalModeToEnumValue() {
    return{
        "periodic": "period",
        "total": "total",
    }
}

function startEnergyMeasurements (actionInput) {
    var deviceName = actionInput.getTarget();
    var hwTypeRelease = apUtils.getNodeTypeFromEs(deviceName);
    var hwTypeAndRelease = apCapUtils.splitToHardwareTypeAndVersion(hwTypeRelease);
    if(hwTypeAndRelease['hwType'].indexOf(intentConstants.ISAM_FX_PREFIX) != -1) {
        var isPowerMeasurementsSupported = apCapUtils.getCapabilityValue(intentConstants.FAMILY_TYPE_ISAM, hwTypeAndRelease["release"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_POWER_METERING_SUPPOTED, hwTypeAndRelease["hwType"], false);
        if(!isPowerMeasurementsSupported) {
            return utilityService.buildErrorActionResponse("The operation is not supported on the current device version");
        }

        var powerMeasurementUtilFwk = loadISAMPowerMeasurementsActionScript();
        var namespace = "http://www.nokia.com/management-solutions/equipment-power-measurements";
        var tagNames = ["interval-mode", "interval-length", "number-of-intervals", "storage-type"];
        var input = extractDataFromRequestXML(actionInput.getActionTreeElement(), namespace, tagNames);
        var objectAtrrAndFn = [];
        if(input["interval-mode"]) {
            if(!(input["interval-mode"] instanceof Array)){
                input["interval-mode"] = [input["interval-mode"]];
            }
            for (key in input["interval-mode"]) {
                var tempVar = {};
                tempVar["eoEnergyParametersIntervalMode"] = convertIntervalModeToEnumValue()[input["interval-mode"][key]];
                tempVar["eoEnergyParametersStorageType"] = convertStorageTypeToEnumValue()[input["storage-type"][key]];
                if(input["interval-mode"][key] == "periodic") {
                    if(input["interval-length"]=="1"){
                        return utilityService.buildErrorActionResponse("Interval Length of " + input["interval-length"] + " minute is not supported on this device type");
                    }	
                    tempVar["eoEnergyParametersIntervalNumber"] = input["number-of-intervals"];
                    // The eoEnergyParametersIntervalLength attr need to be converted from minute to 1/100 second
                    tempVar["eoEnergyParametersIntervalLength"] = input["interval-length"] * 6000;
                }
                objectAtrrAndFn.push(tempVar);
            }
            return powerMeasurementUtilFwk.startEnergyMeasurements(deviceName, objectAtrrAndFn);
        }
        return utilityService.buildErrorActionResponse("Energy Parameter cannot be empty");
    } else {
        var isEnergyMeasurementSupported = apCapUtils.getCapabilityValue(hwTypeAndRelease['hwType'], hwTypeAndRelease["release"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_ENERGY_METERING_SUPPOTED, capabilityConstants.HYPHEN_CONTEXT, false);
        if(!isEnergyMeasurementSupported) {
            return utilityService.buildErrorActionResponse("The operation is not supported on the current device version");
        }

        var energyMeasurementUtilFwk = loadLSEnergyMeasurementsActionScript();
        var namespace = "http://www.nokia.com/management-solutions/equipment-power-measurements";
        var tagNames = ["interval-mode", "interval-length"];
        var input = extractDataFromRequestXML(actionInput.getActionTreeElement(), namespace, tagNames);
        var objectAtrrAndFn = [];
        var exportInterval = 0;
        if(input["interval-mode"]) {
            if(!(input["interval-mode"] instanceof Array)){
                input["interval-mode"] = [input["interval-mode"]];
            }
            for (key in input["interval-mode"]) {
                var tempVar = {};
                tempVar["eoEnergyParametersIntervalMode"] = input["interval-mode"][key];
                if(input["interval-mode"][key] == "periodic") {
                    // The eoEnergyParametersIntervalLength attr need to be converted from number to string
                    switch (input["interval-length"]) {
                        case "1":
                            tempVar["eoEnergyParametersIntervalLength"] = "one-minute";
                            exportInterval = 1 * 60;
                            break;	
                        case "5":
                            tempVar["eoEnergyParametersIntervalLength"] = "five-minutes";
                            exportInterval = 5 * 60;
                            break;
                        case "15":
                            tempVar["eoEnergyParametersIntervalLength"] = "fifteen-minutes";
                            exportInterval = 15 * 60;
                            break;
                        case "30":
                            tempVar["eoEnergyParametersIntervalLength"] = "thirty-minutes";
                            exportInterval = 30 * 60;
                            break;
                        case "60":
                            tempVar["eoEnergyParametersIntervalLength"] = "one-hour";
                            exportInterval = 60 * 60;
                            break;
                        case "120":
                            tempVar["eoEnergyParametersIntervalLength"] = "two-hours";
                            exportInterval = 120 * 60;
                            break;
                        case "1440":
                            tempVar["eoEnergyParametersIntervalLength"] = "twentyfour-hours";
                            exportInterval = 1440 * 60;
                            break;
                        default:
                            return utilityService.buildErrorActionResponse("Interval Length of " + input["interval-length"] + " minutes is not supported on this device type, only 1, 5, 15, 30, 60, 120 and 1440 are allowed.");
                    }
                }
                objectAtrrAndFn.push(tempVar);
            }
            var result = energyMeasurementUtilFwk.startEnergyMeasurements(deviceName, objectAtrrAndFn);
            if (result && result == "<ok/>" && exportInterval != 0) {
                var retval = "<note xmlns=\"http://www.nokia.com/management-solutions/equipment-power-measurements\">Please update 'exportInterval' in 'hardware-state-energy-measurement' cache template to " + exportInterval + " to keep consistent with this 'Interval Length' configuration!</note>";
                return retval;
            } else {
                return result;
            }
        }
        return utilityService.buildErrorActionResponse("Energy Parameter cannot be empty");
    }
}

function stopEnergyMeasurements (actionInput) {
    var deviceName = actionInput.getTarget();
    var hwTypeRelease = apUtils.getNodeTypeFromEs(deviceName);
    var hwTypeAndRelease = apCapUtils.splitToHardwareTypeAndVersion(hwTypeRelease);

    if(hwTypeAndRelease['hwType'].indexOf(intentConstants.ISAM_FX_PREFIX) != -1) {
        var isPowerMeasurementsSupported = apCapUtils.getCapabilityValue(intentConstants.FAMILY_TYPE_ISAM, hwTypeAndRelease["release"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_POWER_METERING_SUPPOTED, hwTypeAndRelease["hwType"], false);
        if(!isPowerMeasurementsSupported) {
            return utilityService.buildErrorActionResponse("The operation is not supported on the current device version");
        }

        var powerMeasurementUtilFwk = loadISAMPowerMeasurementsActionScript();
        return powerMeasurementUtilFwk.stopEnergyMeasurements(deviceName);
    } else {
        var isEnergyMeasurementSupported = apCapUtils.getCapabilityValue(hwTypeAndRelease['hwType'], hwTypeAndRelease["release"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_ENERGY_METERING_SUPPOTED, capabilityConstants.HYPHEN_CONTEXT, false);
        if(!isEnergyMeasurementSupported) {
            return utilityService.buildErrorActionResponse("The operation is not supported on the current device version");
        }

        var energyMeasurementUtilFwk = loadLSEnergyMeasurementsActionScript();
        return energyMeasurementUtilFwk.stopEnergyMeasurements(deviceName);
    }
}

function showEnergyMeasurements(actionInput) {
    var deviceName = actionInput.getTarget();
    var hwTypeRelease = apUtils.getNodeTypeFromEs(deviceName);
    var hwTypeAndRelease = apCapUtils.splitToHardwareTypeAndVersion(hwTypeRelease);
    if(hwTypeAndRelease['hwType'].indexOf(intentConstants.ISAM_FX_PREFIX) != -1) {
        var isPowerMeasurementsSupported = apCapUtils.getCapabilityValue(intentConstants.FAMILY_TYPE_ISAM, hwTypeAndRelease["release"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_POWER_METERING_SUPPOTED, hwTypeAndRelease["hwType"], false);
        if(!isPowerMeasurementsSupported) {
            return utilityService.buildErrorActionResponse("The operation is not supported on the current device version");
        }
        var powerMeasurementUtilFwk = loadISAMPowerMeasurementsActionScript();
        return powerMeasurementUtilFwk.showEnergyMeasurements(deviceName);
    } else {
        var isEnergyMeasurementSupported = apCapUtils.getCapabilityValue(hwTypeAndRelease['hwType'], hwTypeAndRelease["release"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_ENERGY_METERING_SUPPOTED, capabilityConstants.HYPHEN_CONTEXT, false);
        if(!isEnergyMeasurementSupported) {
            return utilityService.buildErrorActionResponse("The operation is not supported on the current device version");
        }

        var energyMeasurementUtilFwk = loadLSEnergyMeasurementsActionScript();
        return energyMeasurementUtilFwk.showEnergyMeasurements(deviceName);
    }
}

function extractDataFromRequestXML (actionElementXml, namespace, tagNames) {
    var objectExtract = {};
    if (tagNames && tagNames.length > 0) {
        tagNames.forEach(function (tagName){
            var tagNameValue = actionElementXml.getElementsByTagNameNS(namespace, tagName);
            if(tagNameValue.getLength() > 1){
                var valueArr = [];
                for (var i = 0; i < tagNameValue.getLength(); i++){
                    valueArr.push(tagNameValue.item(i).getTextContent());
                }
                objectExtract[tagName] = valueArr;
            } else {
                if (tagNameValue && tagNameValue.item(0)) {
                    objectExtract[tagName] = tagNameValue.item(0).getTextContent();
                }
            }
        })
    }
    return objectExtract;
}

function loadISAMPowerMeasurementsActionScript() {
    load({script: resourceProvider.getResource('internal/actions/device-families/power-measurements/iSAM/handler.js'),
    name: 'internal/actions/device-families/power-measurements/iSAM/handler.js'});
    return new powerMeasurementUtil();
}

function loadLSEnergyMeasurementsActionScript() {
    load({script: resourceProvider.getResource('internal/actions/device-families/power-measurements/lightspan/handler.js'),
    name: 'internal/actions/device-families/power-measurements/lightspan/handler.js'});
    return new EnergyMeasurementUtilLS();
}

function showMulticastChannelsThresholds(actionInput){
    var deviceName = actionInput.getTarget();
    var hwTypeRelease = apUtils.getNodeTypeFromEs(deviceName);
    var hardwareDetails = apCapUtils.splitToHardwareTypeAndVersion(hwTypeRelease);
    var hwType = hardwareDetails.hwType;
    if(hwType.indexOf(intentConstants.ISAM_FX_PREFIX) != -1) {
        var namespace = "http://www.nokia.com/management-solutions/multicast-continuity-monitoring";
        var handlerResourcePath = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "actions" + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_DEVICE_FAMILIES + intentConstants.FILE_SEPERATOR + "multicast-continuity-monitoring" + intentConstants.FILE_SEPERATOR + intentConstants.FAMILY_TYPE_ISAM + intentConstants.FILE_SEPERATOR;
        load({ script: resourceProvider.getResource(handlerResourcePath + 'handler.js'), name: handlerResourcePath + 'handler.js' });
        var multicastContinuity = new mcastContinuityMonitoringUtil(handlerResourcePath,namespace);
        var devices = apUtils.gatherInformationAboutDevices([deviceName]);
        var deviceRelease = hardwareDetails.release;
        var deviceType = devices[0].familyType;
        var isMcastMonitoringSupported  = apCapUtils.getCapabilityValue(deviceType, deviceRelease, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_MULTICAST_CONTINUITY_MONITORING_SUPPORTED, hwType, false);
        if(!isMcastMonitoringSupported){
            return utilityService.buildErrorActionResponse("Show Multicast Channels Monitoring is not supported on the current device '" + deviceType + "." +deviceRelease + "'");
        }
        return multicastContinuity.showMulticastChannelsThresholds(deviceName);
    }
    return utilityService.buildErrorActionResponse("Show Multicast Channels Monitoring is not supported on this device type");
}


/**
 * FNMS-135071: This action is used for SWAPP internal action to check if the device support IHUB or not
 *
 */
function isiHUBSupported(input) {
    var requestContext = requestScope.get();
    var intentConfigJson = requestContext.get("intentConfigJson");
    var managerInfo = mds.getManagerByName(intentConfigJson["device-manager"]);
    var result = false;
    if (managerInfo && managerInfo.getType() == intentConstants.MANAGER_TYPE_NAV) {
        result = true;
    }
    return "<is-ihub-supported xmlns=\"http://www.nokia.com/management-solutions/is-ihub-supported\">" + result + "</is-ihub-supported>";
}

function validateBoardAdminStateActions(input, intentConfigArgs, contextualErrorJsonObj) {
    var isBoardAdminStateSupported = apCapUtils.getCapabilityValue(intentConfigArgs["hardware-type"], intentConfigArgs["device-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_BOARD_ADMIN_STATE_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
    var boards = intentConfigArgs["boards"];
    if (boards) {
        Object.keys(boards).forEach(function (board) {
            var currentBoard = boards[board];
            var slotName = currentBoard["slot-name"];
            var adminStateAction = currentBoard["admin-state"];
            if (!isBoardAdminStateSupported && adminStateAction) {
                contextualErrorJsonObj["list#boards," + board + ",leaf#admin-state"] = "Invalid Admin State Action '" + adminStateAction + "', Admin State Action is only applicable for LS-FX in release 23.9 and later";
            } else if (isBoardAdminStateSupported && adminStateAction) {
                if (slotName.startsWith(intentConstants.LT_STRING)) {
                    var ltBoard = currentBoard["planned-type"];
                    var hardwareType = intentConfigArgs[intentConstants.HARDWARE_TYPE];
                    var deviceVersion = intentConfigArgs[intentConstants.DEVICE_VERSION];			
                    var backplaneKrSupported = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.SUPPORTED_BACKPLANE_KR_CAPABILITY, ltBoard, []);
                    if(backplaneKrSupported && backplaneKrSupported.length > 0) {
                        var nodeType = hardwareType + "-" + deviceVersion;
                        var deviceName = input.getTarget();
                        var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
                        var boardServiceProfileResource = getServiceProfile(deviceName, nodeType, intentVersion);
                        var boardType = getBoardTypeFromPlannedType(hardwareType, ltBoard, deviceVersion, slotName);
                        var boardServiceProfiles = apUtils.getBoardServiceProfilesForNAVManager(boardServiceProfileResource, intentConstants.LS_FX_PREFIX, boardType, null, true);
                        var boardServiceProfileName = currentBoard["board-service-profile"];
			  
                        if (boardServiceProfiles[boardServiceProfileName]["model"] === "uplink-mode") {			    
                            contextualErrorJsonObj["list#boards," + board + ",leaf#admin-state"] = "Invalid Admin State Action '" + adminStateAction + "', Admin State Action is only applicable for Downlink Mode " + ltBoard + " board in LS-FX";
                        }
                    }
                    if (adminStateAction !== "locked" && adminStateAction !== "unlocked") {
                        contextualErrorJsonObj["list#boards," + board + ",leaf#admin-state"] = "Invalid Admin State Action '" + adminStateAction + "', only 'locked' and 'unlocked' Admin State Action is applicable for LT boards in LS-FX";
                    }
                } else {
                    contextualErrorJsonObj["list#boards," + board + ",leaf#admin-state"] = "Invalid Admin State Action '" + adminStateAction + "', Admin State Action is only applicable for LT boards in LS-FX";
                }
            }
        });
    }
}

function suggestAdminStateActions(valueProviderContext) {
    var deviceType = getArgumentValue(intentConstants.HARDWARE_TYPE, valueProviderContext);
    var deviceVersion = getArgumentValue(intentConstants.DEVICE_VERSION, valueProviderContext);
    var isBoardAdminStateSupported = apCapUtils.getCapabilityValue(deviceType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_BOARD_ADMIN_STATE_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
    if(isBoardAdminStateSupported) {
        var inputValues = valueProviderContext.getInputValues();
        var boards = inputValues.currentListValue;
        var slotName = boards[0]["slot-name"];
        var supportedAdminStateActions = [];
        if (slotName.startsWith(intentConstants.LT_STRING)) {
            var ltBoard = boards[0]["planned-type"];

            var isEthBoard = false;
            var isEthBoardDownlink = false;
            var portType = apCapUtils.getCapabilityValue(deviceType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, ltBoard, []);
            if(portType && portType.length > 0 && portType.indexOf(capabilityConstants.ETHERNET_ALIAS) >= 0) {
                isEthBoard = true;
                var nodeType = deviceType + "-" + deviceVersion;
                var deviceName = inputValues.target;
                var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
                var boardServiceProfileResource = getServiceProfile(deviceName, nodeType, intentVersion);
                var boardType = getBoardTypeFromPlannedType(deviceType, ltBoard, deviceVersion, slotName);
                var boardServiceProfiles = apUtils.getBoardServiceProfilesForNAVManager(boardServiceProfileResource, intentConstants.LS_FX_PREFIX, boardType, null, true);
                var profileName = boards[0]["board-service-profile"];

                if (boardServiceProfiles[profileName]["model"] === "downlink-mode") {
                    isEthBoardDownlink = true;
                }
            }

            if (isEthBoard) {
                if (isEthBoardDownlink) {
                    supportedAdminStateActions.push("unlocked", "locked");
                }
            } else {
                supportedAdminStateActions.push("unlocked", "locked");
            }
        }
        return apUtils.convertToSuggestReturnFormat(supportedAdminStateActions, valueProviderContext.getSearchQuery());
    }
}

function mapTargetToIntent(input) {
    return deviceUtilities.mapTargetToIntent(input, intentConstants.INTENT_TYPE_DEVICE_FX);
}

function updateSoftwareStates(input) {
    return deviceUtilities.updateSoftwareStates(input, intentConstants.INTENT_TYPE_DEVICE_FX);
}

function validateNeGroup(intentConfigArgs, contextualErrorJsonObj){
    var inputGroupName = intentConfigArgs["group-name"];
    var managerName = intentConfigArgs[intentConstants.DEVICE_MANAGER];
    var managerInfo = mds.getManagerByName(managerName);
    var neGroupMDS = managerInfo["neGroup"];
    var isValidNeGroup = false;
    if (inputGroupName) {
        if (inputGroupName.endsWith("/")) {
            contextualErrorJsonObj["group-name"] = "The 'Group Name' cannot end with '/'";
        }
        if (neGroupMDS) {
            if (inputGroupName.indexOf(neGroupMDS) !== -1) {
                var inputGroupNameArray = inputGroupName.split(neGroupMDS);
                if(inputGroupName === neGroupMDS || (inputGroupNameArray[1] && inputGroupNameArray[1].startsWith("/"))) { 
                    isValidNeGroup = true;
                }
            }
            if (!isValidNeGroup) {
                contextualErrorJsonObj["group-name"] = "The 'Group Name' is invalid because it is not included in the 'NE Group' in MDS";
            }
        }
    }
    if (!inputGroupName && neGroupMDS !== "Network") { 
        // The NE Group in MDS can not empty and the default value is "Network" so if the NE Group in MDS is "Network" then the input Group Name can be empty
        contextualErrorJsonObj["group-name"] = "The 'Group Name' cannot be empty when the 'NE Group' is specified in MDS";
    }    
}

function migrateToV7(intentConfigJson) {
    apUtils.handleOnuSoftwareMappingInIntentMigration(intentConfigJson);
}


function rollbackToV8(intentConfigJson) {
    apUtils.handleOnuSoftwareMappingInIntentMigration(intentConfigJson);
    if (intentConfigJson["network-id"]) {
        delete intentConfigJson["network-id"];
    }
    intentConfigJson["partition-access-profile"] = "PublicPAP";
}

function migrateToV8(input, intentConfigJson, topology) {
    apUtils.handleOnuSoftwareMappingInIntentMigration(intentConfigJson);
    var encryptedIntentConfiguration = input.getEncryptedIntentConfiguration();
    var sensitiveKeyToBeRemoved = ["password", "fallback-password"]
    var oamEncryptedPassword = [];
    var target = input.getTarget();
    var profileSet = apUtils.getUsedProfilesOfIntent(intentConstants.INTENT_TYPE_DEVICE_FX, target);
    if (profileSet) {
        profileSet.forEach(function (profileEntity) {
            var profileType = profileEntity.getProfileType();
            var profileName = profileEntity.getName();
            var pwdTypes = apUtils.getSensitiveKeys(profileEntity.getProfileConfig(), profileEntity.getProfileType());
            if (pwdTypes) {
                if (profileType == "device-oam-connectivity-account") {
                    if (intentConfigJson["main-oam-connectivity-account"] == profileName) {
                        oamEncryptedPassword.push(apUtils.getEncryptedPassword(profileEntity.getProfileConfig(), pwdTypes));
                    }
                }
                for (var index in pwdTypes) {
                    if (sensitiveKeyToBeRemoved.indexOf(pwdTypes[index]) == -1) {
                        sensitiveKeyToBeRemoved.push(pwdTypes[index]);
                    }
                }
            }
        })
    }
    var sensitiveKeys = apUtils.getSensitiveKeys(encryptedIntentConfiguration)
    var encryptedPasswordAC = apUtils.getEncryptedPassword(encryptedIntentConfiguration, sensitiveKeys);
    if(oamEncryptedPassword.length > 0) {
        apUtils.replaceSensitiveDataInXtraTopo(topology, {"sensitiveKeys": sensitiveKeys, "encryptedPasswordAC": encryptedPasswordAC, "oamEncryptedPassword": oamEncryptedPassword});
    } else {
        apUtils.replaceSensitiveDataInXtraTopo(topology, {"sensitiveKeys": sensitiveKeys, "encryptedPasswordAC": encryptedPasswordAC});
    }
    apUtils.removeSensitiveDataInXtraTopo(topology, sensitiveKeyToBeRemoved);
}

//Dummy method for migration handler
function migrateToV9(intentConfigJson){
    apUtils.handleOnuSoftwareMappingInIntentMigration(intentConfigJson);
}

//Dummy method for rollback handler
function rollbackToV7(intentConfigJson){
    apUtils.handleOnuSoftwareMappingInIntentMigration(intentConfigJson);
    intentConfigJson["partition-access-profile"] = "PublicPAP";
}

function migrateBoardServiceProfileTo2406 (intentTypeVersion, associatedProfiles){
    logger.debug("Migrate Profile : board-service-profile");
    let migrateCacheConfig = load({
        script: resourceProvider.getResource('internal/migrate-profile/2406/board-service-profile-migration/migrate-board-service-profile.js'),
        name: 'migrate-board-service-profile.js'
    });
    let profileMigrationfwk = new AltiplanoMigrateProfileHelper();
    profileMigrationfwk.setMigrateConfig(migrateCacheConfig());
    let data = profileMigrationfwk.migrateProfiles(intentConstants.INTENT_TYPE_DEVICE_FX, intentTypeVersion, associatedProfiles);
    return data;
}
function handleGeoCoordinatesConfigXML (intentConfigJson){
    if(intentConfigJson["latitude"] || intentConfigJson["longitude"]){
        var tempJson = {};
        var prefix = "<geo-coordinates xmlns=\"http://www.nokia.com/management-solutions/ibn-geo-location\">";
        var suffix = "</geo-coordinates>";
        if(intentConfigJson["latitude"]){
            tempJson["latitude"] = intentConfigJson["latitude"];
            delete intentConfigJson["latitude"];
        }
        if(intentConfigJson["longitude"]){
            tempJson["longitude"] = intentConfigJson["longitude"];
            delete intentConfigJson["longitude"];
        }
        apUtils.handleOnuSoftwareMappingInIntentMigration(intentConfigJson);
        var convertedXml = apUtils.convertObjectToXmlElement(tempJson);
        var resultStr = prefix + convertedXml + suffix;
        return resultStr;
    }
    return "";
}

function migrate(input) {
    var intentConfigJson = {};
    
    var arrMigrationPath = new ArrayList();
    arrMigrationPath.addAll(input.getMigrationPath()); // Add migration path from meta-info to the ArrayList
    var arrMigrationSupportedVersion = apUtils.getSupportedVersionFromMigrationPath(arrMigrationPath); // Get supported versions from migration path

    apUtils.convertIntentConfigXmlToJson(input.getIntentConfiguration(), extensionConfigObject.getKeyForList, intentConfigJson, null, ["geo-coordinates"]);
    apUtils.handleEmptyTagInJson(intentConfigJson);
    apUtils.handleListInIntentMigration(intentConfigJson, ["label"]);
    intentConfigJson["partition-access-profile"] = "PublicPAP";

    var sourceVersion = input.getSourceVersion();
    var targetVersion = input.getTargetVersion();

    // Determine versions to migrate
    var sourceIndex = arrMigrationSupportedVersion.indexOf(sourceVersion);
    var targetIndex = arrMigrationSupportedVersion.indexOf(targetVersion);
    if (targetIndex == -1) {
        targetIndex = arrMigrationSupportedVersion.length;
    }

    var version;

    for (var i = sourceIndex; i < targetIndex; i++) {
        version = parseInt(arrMigrationSupportedVersion[i]);
        var topology = input.getCurrentTopology();
        var topologyXtraInfo;
        if(topology){
            var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
        }
        switch (version) {
            case 3:
                migrateToV4(intentConfigJson);
                break;
            case 5:
                migrateToV6(input, intentConfigJson, topology, topologyXtraInfo);
                var geoCoordinatesXml = handleGeoCoordinatesConfigXML(intentConfigJson);
                break;
            case 6:
                migrateToV7(intentConfigJson);
                break;
            case 7:
                migrateToV8(input, intentConfigJson, topology)
                break;
            case 8:
                migrateToV9(intentConfigJson);
                break;
            default:
                break;
        }
    }

    if(intentConfigJson["boards"]){
        apUtils.handleListInIntentMigration(intentConfigJson,["boards"]);
    }
    if(!geoCoordinatesXml){
        var geoCoordinatesXml = apUtils.handleGeoCoordinatesInIntentMigration(intentConfigJson);
    }
    
    // Construct XML result string
    var configPrefix = "<configuration xmlns=\"http://www.nokia.com/management-solutions/ibn\">";
    var intentPrefix = "<device-fx xmlns=\"http://www.nokia.com/management-solutions/device-fx\">";
    var convertedXml = apUtils.convertObjectToXmlElement(intentConfigJson);
    var intentSuffix = "</device-fx>";
    var configSuffix = "</configuration>";
    var resultStr = configPrefix + intentPrefix + convertedXml + intentSuffix + geoCoordinatesXml + configSuffix;
    var result = new MigrationResult(resultStr, input.getCurrentTopology());

    if (typeof result.setUseLatestProfileVersions == "function") {
        if (typeof input.isProfileUpdatesRequired == "function" && input.isProfileUpdatesRequired()) {
            result.setUseLatestProfileVersions(true)
        }
    }
    if (typeof result.setSkipTargetDevices == "function") {
        result.setSkipTargetDevices(true)
    }

    if (typeof result.setIntentProfileVOList == "function") {
        var intentProfileVOs = new ArrayList();
        result.setIntentProfileVOList(intentProfileVOs);
    }

    return result;
}

function rollback(input){
    var intentConfigJson = {};
    var arrMigrationPath = new ArrayList();
    arrMigrationPath.addAll(input.getMigrationPath()); // Add migration path from meta-info to the ArrayList
    var arrMigrationSupportedVersion = apUtils.getSupportedVersionFromMigrationPath(arrMigrationPath); // Get supported versions from migration path
    apUtils.convertIntentConfigXmlToJson(input.getIntentConfiguration(), extensionConfigObject.getKeyForList, intentConfigJson, null, ["geo-coordinates"]);
    apUtils.handleEmptyTagInJson(intentConfigJson);
    apUtils.handleListInIntentMigration(intentConfigJson, ["label"]);

    var sourceVersion = input.getSourceVersion();
    var targetVersion = input.getTargetVersion();

    // Determine versions to rollback
    var sourceIndex = arrMigrationSupportedVersion.indexOf(sourceVersion);
    var targetIndex = arrMigrationSupportedVersion.indexOf(targetVersion);
    if (sourceIndex === -1) {
     	sourceIndex = arrMigrationSupportedVersion.length;
    }

    var version;

    if(intentConfigJson["boards"]){
        apUtils.handleListInIntentMigration(intentConfigJson,["boards"]);
    }
    
    for (var i = sourceIndex - 1; i >= targetIndex; i--) {
        version = parseInt(arrMigrationSupportedVersion[i]);
        var topology = input.getCurrentTopology();
        var topologyXtraInfo;
        if(topology){
            var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
        }
        switch (version) {
            case 8:
                rollbackToV8(intentConfigJson);
                break;
            case 7:
                rollbackToV7(intentConfigJson);
                break;
            case 6:
                rollbackToV6(input, intentConfigJson, topology, topologyXtraInfo);
                break;
            case 5:
                rollbackToV5(input, intentConfigJson, topology, topologyXtraInfo);
                break;
            case 4:
                rollbackToV4(intentConfigJson)
                break;
            case 3:
                rollbackToV3(intentConfigJson);
                break;
            default:
                break;
        }
    }

    var geoCoordinatesXml = apUtils.handleGeoCoordinatesInIntentMigration(intentConfigJson);
    var configPrefix = "<configuration xmlns=\"http://www.nokia.com/management-solutions/ibn\">";
    var intentPrefix = "<device-fx xmlns=\"http://www.nokia.com/management-solutions/device-fx\">";
    var convertedXml = apUtils.convertObjectToXmlElement(intentConfigJson);
    var intentSuffix = "</device-fx>";
    var configSuffix = "</configuration>";
    var resultStr = configPrefix + intentPrefix + convertedXml + intentSuffix + geoCoordinatesXml + configSuffix;
    var result = new MigrationResult(resultStr, input.getCurrentTopology());
    return result
}
