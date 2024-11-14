/**
 * (c) 2020 Nokia. All Rights Reserved.
 *
 * INTERNAL - DO NOT COPY / EDIT
 *
 * This js is for maintaining all the utilities related to slicing
 **/
if (!apUtils) {
    load({script: resourceProvider.getResource('internal/altiplano-utilities.js'), name: 'altiplano-utilities.js'});
    var apUtils = new AltiplanoUtilities();
}
if (!xponUtils) {
    load({script: resourceProvider.getResource('internal/xpon-utilities.js'), name: 'xpon-utilities.js'});
    var xponUtils = new XponUtilities();
}

function SlicingUtilities() {

}

SlicingUtilities.prototype.getFxShelfDeviceName = function (fxLtDeviceName) {
    if (fxLtDeviceName) {
        var lastIndex = fxLtDeviceName.lastIndexOf(intentConstants.FX_DEVICE_SEPARATOR);
        if (lastIndex > -1) {
            var fxLtDeviceNameLtDetails = fxLtDeviceName.substring(lastIndex + 1);
            var ltPattern = new RegExp(intentConstants.FX_LT_REG_EXP);
            var isLtBoard = ltPattern.test(fxLtDeviceNameLtDetails);
            if (isLtBoard) {
                return fxLtDeviceName.substring(0, lastIndex);
            } else {
                throw new RuntimeException("LS-FX shelf device name cannot be deduced");
            }
        } else {
            throw new RuntimeException("LS-FX shelf device name cannot be deduced");
        }
    } else {
        throw new RuntimeException("LS-FX shelf LT device name is not valid");
    }
};

/**
 * Returns all the FX ShelfNames that are accessible to slice-owners from the context provided
 * Mainly used in suggest functions
 * @param valueProviderContext
 * @returns {string[]}
 */
SlicingUtilities.prototype.getFxShelfDeviceNamesFromLTs = function (valueProviderContext) {
    var devices = {};
    var ltDevices = new ArrayList();
    ltDevices.addAll(mds.get10Devices(apUtils.getFXSupportedLTs(), valueProviderContext.getSearchQuery()));
    if (ltDevices) {
        ltDevices.forEach(function (ltDevice) {
            var device = slicingUtils.getFxShelfDeviceName(ltDevice);
            devices[device] = device;
        });
    }
    return Object.keys(devices);
};

SlicingUtilities.prototype.getDfDeviceNames= function (valueProviderContext) {
    var dfDevices = new ArrayList();
    dfDevices.addAll(mds.get10Devices([intentConstants.FAMILY_TYPE_LS_DF_CFXR_E, intentConstants.FAMILY_TYPE_LS_DF_CFXR_A, intentConstants.FAMILY_TYPE_LS_DF_CFXR_H, intentConstants.FAMILY_TYPE_LS_DF_CFXR_J, intentConstants.FAMILY_TYPE_LS_DF_CFXR_F], valueProviderContext.getSearchQuery()));
    return dfDevices;
};

/**
 * Returns all the LT devices associated to FX Shelf
 * @param shelfName
 * @returns {[]}
 */
SlicingUtilities.prototype.getAllFxLtDevices = function (shelfName) {
    var devices = [];
    var ltDevices = mds.getNDevicesStartingWith(shelfName + intentConstants.FX_DEVICE_SEPARATOR, intentConstants.LS_FX_MAX_DEVICE_COUNT);
    if (!(null == ltDevices || ltDevices.size() == 0)) {
        ltDevices.forEach(function (ltDevice) {
            if (ltDevice.indexOf(".IHUB") < 0) {
                var device = slicingUtils.getFxShelfDeviceName(ltDevice);
                if (device == shelfName) {
                    devices.push(ltDevice);
                }
            }
        });
    }
    return devices;
};

/**
 * Provides the VLAN Range in an array format for the given VLAN Range
 * VLAN Range can be of format 100-200,250,251
 * @param vlanRange
 * @returns {[]}
 */
SlicingUtilities.prototype.getVlanList = function (vlanRange) {
    var vlanIds = {};
    if (vlanRange) {
        var vlanList = vlanRange.split(",");
        for (var idx in vlanList) {
            var vlan = vlanList[idx];
            var splits = vlan.split("-");
            if (splits.length == 1) {
                if (!vlanIds[splits[0]]) {
                    vlanIds[splits[0]] = splits[0];
                }
            } else {
                var vlanLowerLimit = parseInt(splits[0]);
                var vlanUpperLimit = parseInt(splits[1]);
                for (var i = vlanLowerLimit; i <= vlanUpperLimit; i++) {
                    var vlan = i.toString();
                    if (!vlanIds[vlan]) {
                        vlanIds[vlan] = vlan;
                    }
                }
            }
        }
    }
    return vlanIds;
};

/**
 * Returns the VLAN Range for the provided ShelfName
 * @param shelfName
 * @returns {*}
 */
SlicingUtilities.prototype.getVlanRange = function (shelfName) {
    var uplinkConnectionSliceIntentConfigJson = this.getUplinkConnectionSliceReplicatedIntentConfigJson(shelfName);
    var vlanRange = uplinkConnectionSliceIntentConfigJson["vlan-ids"];
    return this.getVlanList(vlanRange);
};

/**
 * Returns the VLAN Range defined for the device from device-fx-slice intent's validation rule
 * @param deviceName
 * @param sliceConfigResourePath
 * @return vlanRangeConfig
 * @deprecated
 */
SlicingUtilities.prototype.getVlanRangeFromFxSliceConfig = function (deviceName, sliceConfigResourePath) {
    var vlanRangeConfig = {};
    var ltDevices = slicingUtils.getAllFxLtDevices(deviceName);
    if (ltDevices) {
        var mangerInfo = apUtils.getManagerInfoFromEsAndMds(ltDevices[0]);
        var managerName = mangerInfo.getName();
        var templateArgs = {
            managerName: managerName,
            deviceIDs: ltDevices
        };
        var xpath = "/nc:rpc-reply/nc:data/anv:device-manager";
        var node = apUtils.getExtractedNodeFromResponse(sliceConfigResourePath, templateArgs, xpath, apUtils.prefixToNsMap);
        if (node) {
            ltDevices.forEach(function (ltDevice) {
                var getLabelXpath = function (label) {
                    return "adh:device[adh:device-id=\'" + ltDevice + "\']/" +
                        "slicing:slicing/slicing:slice/slicing:resource-allocation/slicing:validation-rule[slicing:name=\'sVlanRange\']/slicing:argument[slicing:name=\'" + label + "\']/slicing:value/text()"
                };
                var maxVlan = apUtils.getNodeValue(node, getLabelXpath("MAX_SVLAN"), apUtils.prefixToNsMap);
                var minVlan = apUtils.getNodeValue(node, getLabelXpath("MIN_SVLAN"), apUtils.prefixToNsMap);

                vlanRangeConfig[ltDevice] = {
                    "maxVlan": maxVlan,
                    "minVlan": minVlan
                }
            });
        }
    }
    return vlanRangeConfig;
};

/**
 * Returns slice-owner prefix that is defined for a particular slice-owner
 *
 * @param sliceOwnerTarget
 * @returns {*}
 */
SlicingUtilities.prototype.getSliceOwnerPrefix = function (sliceOwnerTarget) {
    var sliceIntent = ibnService.getIntent(intentConstants.INTENT_TYPE_SLICE_OWNER, sliceOwnerTarget);
    if (sliceIntent) {
        var sliceIntentConfig = sliceIntent.getIntentConfig();
        var getKeyForList = function (listName) {
            switch (listName) {
                case "device-managers":
                    return "virtualizer-name";
                case "ont-release":
                    return "yang:list#leaf-list";
                default:
                    return null;
            }
        };
        var sliceIntentConfigJson = apUtils.convertIntentConfigXmlToJson(sliceIntentConfig, getKeyForList);
        return sliceIntentConfigJson["prefix"];
    } else {
        throw new RuntimeException("Unable to find the slice-owner with target '" + sliceOwnerTarget + "'");
    }
};

/**
 * Returns converted value from kbps to mbps
 * */

SlicingUtilities.prototype.convertKbpsToMbps = function (value) {
    return value * Math.pow(10, -3);
};

SlicingUtilities.prototype.getFECBandwidth = function (bandwidth, xponType) {
    if (xponType == "gpon") {
        var fecBandwidth = Math.round((bandwidth * 7) / 100);
    } else if (xponType == "xgs") {
        fecBandwidth = Math.round((bandwidth * 13) / 100);
    } else if (xponType === intentConstants.XPON_TYPE_25G) {
        fecBandwidth = Math.round((bandwidth * 15) / 100);
    }
    return fecBandwidth;
}

SlicingUtilities.prototype.getCompleteBandwidthWithFEC = function (bandwidth, xponType) {
    if (xponType == "gpon") {
        var completeBandwidth = bandwidth + Math.round((bandwidth * 7) / 100);
    } else if (xponType == "xgs") {
        completeBandwidth = bandwidth + Math.round((bandwidth * 13) / 100);
    } else if (xponType === intentConstants.XPON_TYPE_25G) {
        completeBandwidth = bandwidth + Math.round((bandwidth * 15) / 100);
    }
    return completeBandwidth;
};

/**
 * It will return the PON capacity for Upstream
 * @param xponType
 * */
SlicingUtilities.prototype.getUpstreamPONCapacity = function (fiberName, xponType) {
    if (xponType == "gpon") {
        return 1250;
    } else if (xponType == "xgs") {
        return 10000;
    } else if (xponType === intentConstants.TWENTY_FIVE_G) {
        var fiberIntent = apUtils.getIntent(intentConstants.INTENT_TYPE_FIBER, fiberName);
        if (fiberIntent) {
            var fiberIntentConfig = fiberIntent.getIntentConfig();
            var upstreamLineRate = fiberIntentConfig["line-rate"] ? fiberIntentConfig["line-rate"].split("up-")[1] : 10;
            if (upstreamLineRate && upstreamLineRate == 25) {
                return 25000;
            }
        }
        return 10000;
    }
};

/**
 * It will return the PON capacity for Downstream
 * @param xponType
 * */
SlicingUtilities.prototype.getDownstreamPONCapacity = function (xponType) {
    if (xponType == "gpon") {
        return 2500;
    } else if (xponType == "xgs") {
        return 10000;
    } else if (xponType === intentConstants.TWENTY_FIVE_G) {
        return 25000;
    }
};

/**
 * Returns LT Details after validation
 * @param fxLtDeviceName
 * @returns [*]
 * */
SlicingUtilities.prototype.getLSFXShelfLTDetails = function (fxLtDeviceName) {
    if (fxLtDeviceName) {
        var lastIndex = fxLtDeviceName.lastIndexOf(intentConstants.FX_DEVICE_SEPARATOR);
        if (lastIndex > -1) {
            var fxLtDeviceNameLtDetails = fxLtDeviceName.substring(lastIndex + 1);
            var ltPattern = new RegExp(intentConstants.FX_LT_REG_EXP);
            var isLtBoard = ltPattern.test(fxLtDeviceNameLtDetails);
            if (isLtBoard) {
                return fxLtDeviceNameLtDetails;
            }
        } else {
            throw new RuntimeException("LS-FX shelf LT device name is not valid");
        }
    } else {
        throw new RuntimeException("LS-FX shelf LT device name is not valid");
    }
};

/**
 * This method used to retrieve Onu templates from profilemanager.
 * @param {String} ltDeviceName 
 * @returns list of Onu Templates
 */
SlicingUtilities.prototype.getOnuTemplatesForSliceOwner = function (ltDeviceName) {
    var onuTemplateProfileList = [];
    if (ltDeviceName) {
        try {
            var deviceInfos = mds.getAllInfoFromDevices(ltDeviceName);
            if (deviceInfos == null || deviceInfos.size() === 0) {
                throw new RuntimeException("Device not found: " + ltDeviceName);
            }
            var nodeType = deviceInfos[0].familyTypeRelease;
            let intentType;
            let deviceName = ltDeviceName;
            if (nodeType && nodeType.startsWith(intentConstants.LS_DF_PREFIX)) {
                intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_DF;
            } else {
                intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX;
                deviceName = apUtils.getShelfDeviceName(ltDeviceName);
            }
            var intentVersion = apUtils.getIntentVersion(intentType, deviceName);
            var deviceRelease = nodeType.substring(nodeType.lastIndexOf("-") + 1);

            var onuTempaltesSet = apUtils.getAssociatedProfilesWithConfig(intentType, intentVersion, profileConstants.ONU_TEMPLATE_PROFILE.profileType,
                profileConstants.ONU_TEMPLATE_PROFILE.subType, deviceRelease, null, null, intentConstants.NETWORK_SLICING_USER_TYPE_SLICE_OWNER);
            onuTemplateProfileList = apUtils.parseProfiles(onuTempaltesSet, profileConstants.ONU_TEMPLATE_PROFILE.profileType);
            return onuTemplateProfileList;
        } catch (e) {
            logger.error("Error while getting onuTemplate {}", e);
        }
    }
    return onuTemplateProfileList;
}

/**
 * This method used to retrieve Onu templates from profilemanager.
 * @param {String} ltDeviceName
 * @param {String} templateName 
 * @returns list of Onu Templates
 */
SlicingUtilities.prototype.getOnuTemplateByNameForSliceOwner = function (ltDeviceName, templateName) {
    var onuTemplate = {};
    if (ltDeviceName) {
        try {
            var deviceInfos = mds.getAllInfoFromDevices(ltDeviceName);
            if (deviceInfos == null || deviceInfos.size() === 0) {
                throw new RuntimeException("Device not found: " + ltDeviceName);
            }
            var nodeType = deviceInfos[0].familyTypeRelease;
            let intentType;
            let deviceName = ltDeviceName;
            if (nodeType && nodeType.startsWith(intentConstants.LS_DF_PREFIX)) {
                intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_DF;
            } else {
                intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX;
                deviceName = apUtils.getShelfDeviceName(ltDeviceName);
            }
            var intentVersion = apUtils.getIntentVersion(intentType, deviceName);
            var deviceRelease = nodeType.substring(nodeType.lastIndexOf("-") + 1);

            var onuTempaltesSet = apUtils.getAssociatedProfilesWithConfig(intentType, intentVersion, profileConstants.ONU_TEMPLATE_PROFILE.profileType,
                profileConstants.ONU_TEMPLATE_PROFILE.subType, deviceRelease, templateName, null, intentConstants.NETWORK_SLICING_USER_TYPE_SLICE_OWNER);

            onuTemplate = apUtils.parseSingleProfile(onuTempaltesSet, profileConstants.ONU_TEMPLATE_PROFILE.profileType);

        } catch (e) {
            logger.error("Error while getting onuTemplate {}", e);
        }
    }
    return onuTemplate;
}

/**
 * Getting ONU Template Json by fiberName
 * This method will get onu template in json format from onu-templates.json of device-config-fx
 * @param shelfName
 * @param  {Object} contextParameters some extra parameters, {onuTemplateFileName : "onu-templates-22.6.json"}
 * @returns {Object}
 */
SlicingUtilities.prototype.getOnuTemplatesJsonForSliceOwner = function (ltDeviceName, contextParameters) {
    var onuTemplate = null;
    if (ltDeviceName) {
        try {
            var deviceInfos = mds.getAllInfoFromDevices(ltDeviceName);
            if (deviceInfos == null || deviceInfos.size() === 0) {
                throw new RuntimeException("Device not found: " + ltDeviceName);
            }
            var onuTemplatesFileName;
            var nodeType = deviceInfos[0].familyTypeRelease;
            var currentInterfaceVerion = nodeType.substring(nodeType.lastIndexOf("-") + 1, nodeType.length);
            var supportedTypes = ["LS-FX-21.3", "LS-FX-21.6", "LS-FX-21.9", "LS-FX-21.12", "LS-FX-22.3","LS-DF-22.3", "LS-FX-22.6","LS-DF-22.6"];
            if (nodeType.startsWith("LS-FX")) {
                var bestType = apUtils.getBestKnownType(("LS-FX-" + currentInterfaceVerion), supportedTypes);
                if (bestType && bestType.indexOf("21.3") != -1) {
                    onuTemplatesFileName = "onu-templates-21.3.json";
                } else if (bestType && bestType.indexOf("21.6") != -1) {
                    onuTemplatesFileName = "onu-templates-21.6.json";
                } else if (bestType && bestType.indexOf("21.9") != -1) {
                    onuTemplatesFileName = "onu-templates-21.9.json";
                } else if (bestType && bestType.indexOf("21.12") != -1) {
                    onuTemplatesFileName = "onu-templates-21.12.json";
                } else if (bestType && bestType.indexOf("22.3") != -1) {
                    onuTemplatesFileName = "onu-templates-22.3.json";
                } else if (bestType && bestType.indexOf("22.6") != -1) {
                    onuTemplatesFileName = "onu-templates-22.6.json";
                } else {
                    onuTemplatesFileName = "onu-templates-21.12.json";
                }
                var shelfName = apUtils.getShelfDeviceName(ltDeviceName);
                var dependIntent =  intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX;
            } else if (nodeType.startsWith("LS-DF")){
                var bestType = apUtils.getBestKnownType(("LS-DF-" + currentInterfaceVerion), supportedTypes);
                if (bestType && bestType.indexOf("22.3") != -1) {
                    onuTemplatesFileName = "onu-templates-22.3.json";
                } else if (bestType && bestType.indexOf("22.6") != -1) {
                    onuTemplatesFileName = "onu-templates-22.6.json";
                }
                var shelfName = deviceInfos[0].name;
                var dependIntent =  intentConstants.INTENT_TYPE_DEVICE_CONFIG_DF;
            }
            if (contextParameters && typeof contextParameters === "object" && onuTemplatesFileName) {
                contextParameters.onuTemplateFileName = onuTemplatesFileName;
            }
            onuTemplate = apUtils.getDependentIntentResourceFile(shelfName, dependIntent, intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_EONU + intentConstants.FILE_SEPERATOR + onuTemplatesFileName);
        } catch (e) {
            logger.debug("Error while getting onuTemplate {}", e);
        }

        if (onuTemplate && onuTemplate["onu-template"] && onuTemplate["onu-template"].length > 0) {
            return onuTemplate["onu-template"];
        }
    }
    return onuTemplate;
};

/**
 * Returns the Number of L1 Schedulers based on the number of ONTs
 * @param numberOfOnts
 * @returns {number}
 */
SlicingUtilities.prototype.getNoOfL1Schedulers = function (numberOfOnts) {
    var numberOfL1Schedulers = 1;
    var maxOntsPerScheduler = intentConstants.MAX_ONTS_PER_SCHEDULER;
    if (numberOfOnts % maxOntsPerScheduler == 0) {
        numberOfL1Schedulers = numberOfOnts / maxOntsPerScheduler;
    } else {
        numberOfL1Schedulers = Math.floor(numberOfOnts / maxOntsPerScheduler) + 1;
    }
    return numberOfL1Schedulers;
}

/**
 * Returns the fiber slice intent config
 * @param fiberSliceName
 * @returns {{}}
 */
SlicingUtilities.prototype.getFiberSliceIntentConfig = function (fiberSliceName) {
    var fiberSliceIntentConfigJson = {};
    fiberSliceIntentConfigJson["slices"] = {};
    var resourceFile = intentConstants.MANAGER_SPECIFIC_NV_SLICING + "esGetFiberSliceIntentConfig.json.ftl";
    var templateArgs = { "fiberSliceName": fiberSliceName };
    var response = apUtils.executeEsQueryByIntentType(resourceFile, templateArgs, intentConstants.INTENT_TYPE_FIBER_SLICE);
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
            if (intentResult["_source"]["configuration"] && intentResult["_source"]["nested-lists"] && intentResult["_source"]["configuration"]["bandwidth-allocation-strategy"]) {
                fiberSliceIntentConfigJson["bandwidth-allocation-strategy"] = intentResult["_source"]["configuration"]["bandwidth-allocation-strategy"][0];
                for (var index = 0; index < intentResult["_source"]["nested-lists"].length; index++) {
                    var sliceName = intentResult["_source"]["nested-lists"][index]["slice-name"][0];
                    var ponType = intentResult["_source"]["nested-lists"][index]["pon-type"][0];
                    var bandwidthAllocationProfile = intentResult["_source"]["nested-lists"][index]["bandwidth-allocation-profile"][0];
                    var sliceKey = sliceName + "#" + ponType;
                    fiberSliceIntentConfigJson["slices"][sliceKey] = {"slice-name" : sliceName, "pon-type" : ponType, "bandwidth-allocation-profile" : bandwidthAllocationProfile};
                }
            }
        });
    }
    return fiberSliceIntentConfigJson;
}

/**
 * Returns the ont connection intent config
 * @param ontName
 * @returns {{}}
 */
SlicingUtilities.prototype.getOntConnectionIntentConfigJson = function (ontName) {
    var ontConnectionIntentConfigJson = {};
    var ontConnectionIntent = ibnService.getIntent(intentConstants.INTENT_TYPE_ONT_CONNECTION, ontName);
    if (ontConnectionIntent != null) {
        var ontConnectionIntentConfig = ontConnectionIntent.getIntentConfig();
        ontConnectionIntentConfigJson = apUtils.convertIntentConfigXmlToJson(ontConnectionIntentConfig);
    }
    return ontConnectionIntentConfigJson;
};

/**
 * It will return ont device name from ont-connection-intent target
 * @param target
 * return string
 * */
SlicingUtilities.prototype.getOntNameFromOntConnectionTarget = function (ontConnectionTarget) {
    var locationName = ontConnectionTarget.split(intentConstants.TARGET_DELIMITER)[0];
    var ponType = ontConnectionTarget.split(intentConstants.TARGET_DELIMITER)[2];
    return locationName + "_" + ponType.toUpperCase();
};

/**
 * It will provide ont device using location name and xpon type
 * @param locationName
 * @param xponType
 * return string
 * */
SlicingUtilities.prototype.getOntDeviceName = function (locationName, xponType) {
    if (locationName && xponType) {
        return locationName + "_" + xponType.toUpperCase();
    } else {
        throw new RuntimeException("location name and pon type should not be empty");
    }
}

/**
 * It will provide l2 scheduler ont name using slice owner, location name & xpon type
 * @param slice owner name
 * @param locationName
 * @param xponType
 * return string
 * */
SlicingUtilities.prototype.getL2schedulerOntName = function (sliceOwner, locationName, xponType) {
    if (sliceOwner && locationName && xponType) {
        return sliceOwner + "_" + locationName + "_" + xponType.toUpperCase();
    } else {
        throw new RuntimeException("sliceOwner and location name and pon tye should not be empty");
    }
}

/**
 * Returns the device-fx-slice intent config
 * @param fiberSliceName
 * @returns {{}}
 */
SlicingUtilities.prototype.getDeviceFxSliceIntentConfigJson = function (fxSliceTarget) {
    var fxSliceIntentConfigJson = {};
    var fxSliceIntent = ibnService.getIntent(intentConstants.INTENT_TYPE_DEVICE_FX_SLICE, fxSliceTarget);
    if (fxSliceIntent != null) {
        var fxSliceIntentIntentConfig = fxSliceIntent.getIntentConfig();
        var getKeyForList = function (listName) {
            switch (listName) {
                case "boards-list":
                    return ["board-name"];
                default:
                    return null;
            }
        }
        fxSliceIntentConfigJson = apUtils.convertIntentConfigXmlToJson(fxSliceIntentIntentConfig,getKeyForList);
    }
    return fxSliceIntentConfigJson;
}

/**
 * Returns the device-<XX>-slice intent config
 * @param fiberSliceName
 * @param nodeType
 * @returns {{}}
 */
SlicingUtilities.prototype.getDeviceSliceIntentConfigJson = function (deviceSliceTarget, nodeType) {
    var deviceSliceIntentConfigJson = {};
    if(nodeType.startsWith(intentConstants.LS_DF_PREFIX)){
        var deviceSliceIntent = ibnService.getIntent(intentConstants.INTENT_TYPE_DEVICE_DF_SLICE, deviceSliceTarget);
        if (deviceSliceIntent != null) {
            deviceSliceIntentConfigJson = apUtils.convertIntentConfigXmlToJson(deviceSliceIntent.getIntentConfig());
        }
    } else if(nodeType.startsWith(intentConstants.LS_FX_PREFIX)){
        var deviceSliceIntent = ibnService.getIntent(intentConstants.INTENT_TYPE_DEVICE_FX_SLICE, deviceSliceTarget);
        if (deviceSliceIntent != null) {
            var deviceSliceIntentConfig = deviceSliceIntent.getIntentConfig();
            var getKeyForList = function (listName) {
                switch (listName) {
                    case "boards-list":
                        return ["board-name"];
                    default:
                        return null;
                }
            }
            deviceSliceIntentConfigJson = apUtils.convertIntentConfigXmlToJson(deviceSliceIntentConfig,getKeyForList);
        }
   
    }
    return deviceSliceIntentConfigJson;
}

/**
 * Returns the Fiber Slice Bandwidth Config for a given fiber slice
 * @param fiberSliceTarget
 * @param fiberSliceIntentConfigJson
 * @param sliceNameAndPonType
 * @returns {{}}
 */
SlicingUtilities.prototype.getFiberSliceBandwidthConfig = function (fiberSliceTarget, fiberSliceIntentConfigJson, sliceNameAndPonType) {
    var fiberSliceBandwidthConfig = {};
    if (!fiberSliceIntentConfigJson) {
        fiberSliceIntentConfigJson = this.getFiberSliceIntentConfig(fiberSliceTarget);
    }
    if (!apUtils.ifObjectIsEmpty(fiberSliceIntentConfigJson)) {
        var fiberSliceBwAllocStrategy = fiberSliceIntentConfigJson["bandwidth-allocation-strategy"];
        var fiberSliceBwAllocProfile;
        if (fiberSliceIntentConfigJson["slices"] && Object.keys(fiberSliceIntentConfigJson["slices"]).length > 0 &&
            Object.keys(fiberSliceIntentConfigJson["slices"]).indexOf(sliceNameAndPonType) != -1 && fiberSliceIntentConfigJson["slices"][sliceNameAndPonType]["bandwidth-allocation-profile"]) {
            fiberSliceBwAllocProfile = fiberSliceIntentConfigJson["slices"][sliceNameAndPonType]["bandwidth-allocation-profile"];
        } else if (fiberSliceIntentConfigJson["slices"] && Object.keys(fiberSliceIntentConfigJson["slices"]).length > 0 && Object.keys(fiberSliceIntentConfigJson["slices"]).indexOf(sliceNameAndPonType) == -1) {
            var sliceName = sliceNameAndPonType.split(intentConstants.TARGET_DELIMITER)[0];
            var pontype = sliceNameAndPonType.split(intentConstants.TARGET_DELIMITER)[1];
            throw new RuntimeException("Slice Name: Please provide the name corresponding to the PON Type '"+ pontype +"' as in fiber-slice intent '"+fiberSliceTarget+"'.");
        }
        if (fiberSliceBwAllocProfile) {
            var fiberName = fiberSliceTarget.split(intentConstants.TARGET_DELIMITER)[0];
            var devices = xponUtils.getDeviceListFromFiber(fiberName);
            var fiberOltDevice = devices["oltDevice"];
            var nodeType = apUtils.getNodeTypefromEsAndMds(fiberOltDevice);
            var profileType = profileConstants.FIBER_SLICE_BANDWIDTH_ALLOCATION_PROFILE.profileType;
            var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_FIBER_SLICE, fiberSliceTarget);
            var subType;
            if (fiberSliceBwAllocStrategy == "per-slice") {
                subType = profileConstants.FIBER_SLICE_BANDWIDTH_ALLOCATION_PROFILE.subTypePerSlice;
            } else {
                subType = profileConstants.FIBER_SLICE_BANDWIDTH_ALLOCATION_PROFILE.subTypePerOC;
            }
            var fiberSliceBwAllocProfilesJson = apUtils.getParsedProfileDetailsFromProfMgr(fiberOltDevice, nodeType, intentConstants.INTENT_TYPE_FIBER_SLICE, [], intentVersion);
            var fiberSliceBandwidthAllocProfiles = fiberSliceBwAllocProfilesJson[subType][profileType];
            for (var i = 0; i < fiberSliceBandwidthAllocProfiles.length; i++) {
                if (fiberSliceBwAllocProfile === fiberSliceBandwidthAllocProfiles[i]["name"]) {
                    fiberSliceBandwidthConfig = fiberSliceBandwidthAllocProfiles[i];
                    break;
                }
            }
        }
    }
    return fiberSliceBandwidthConfig;
}

/**
 * Provides the replicated intent configuration for the provided intent-type with target and origin (if required and available)
 * @param intentType
 * @param target
 * @param origin
 * @returns {*}
 */
SlicingUtilities.prototype.getReplicatedIntentConfig = function (intentType, target, origin) {
    if (!origin) {
        var replicatedIntentsData = replicatedIntentQueryService.getIntentsByIntentTypeAndTarget(intentType, target);
        if (replicatedIntentsData.size() == 1) {
            var replicatedIntentConfig = replicatedIntentsData[0].getIntentConfig();
            if (replicatedIntentConfig) {
                return replicatedIntentConfig;
            }
        } else if (replicatedIntentsData.size() > 1) {
            throw new RuntimeException("Multiple records found for intent-type " + intentType + " with target " + target + ", need origin to resolve the correct intent's config");
        } else if (replicatedIntentsData.size() == 0) {
            throw new RuntimeException("No replicated intent found for intent-type " + intentType + " with target " + target);
        }
    } else if (origin) {
        var replicatedIntentConfig = replicatedIntentQueryService.getIntentConfig(intentType, target, origin);
        if (replicatedIntentConfig) {
            return replicatedIntentConfig;
        } else {
            throw new RuntimeException("No replicated intent found for intent-type " + intentType + " with target " + target + " and origin " + origin);
        }
    }
};

/**
 * Provides the replicated intent type version for the provided intent-type with target
 * @param intentType
 * @param target
 * @returns {*}
 */
 SlicingUtilities.prototype.getReplicatedIntentTypeVersion = function (intentType, target) {
    var replicatedIntentsData = replicatedIntentQueryService.getIntentsByIntentTypeAndTarget(intentType, target);
    if (replicatedIntentsData.size() == 1) {
        var replicatedIntentTypeVersion = replicatedIntentsData[0].getIntentTypeVersion();
        if (replicatedIntentTypeVersion) {
            return replicatedIntentTypeVersion;
        }
    } else if (replicatedIntentsData.size() > 1) {
        throw new RuntimeException("Multiple records found for intent-type " + intentType + " with target " + target + ", need origin to resolve the correct intent's config");
    } else if (replicatedIntentsData.size() == 0) {
        throw new RuntimeException("No replicated intent found for intent-type " + intentType + " with target " + target);
    }
};

/**
 * Returns the slice-owner name for the provided resource path and manager name
 * @param resourcePath
 * @param managerName
 * @returns {*}
 */
SlicingUtilities.prototype.getSliceOwnerName = function (resourcePath, managerName) {
    var templateArgs = {
        managerName: managerName
    };
    try {
        var baseXpath = "/nc:rpc-reply/nc:data/anv:device-manager/slicing:slice-owners";
        var node = apUtils.getExtractedNodeFromResponse(resourcePath, templateArgs, baseXpath, apUtils.prefixToNsMap);
        if (node) {
            var sliceOwnerXpath = "slicing:slice-owner/slicing:name";
            var sliceOwners = apUtils.getAttributeValues(node, sliceOwnerXpath, apUtils.prefixToNsMap);
            if (sliceOwners.size() > 0) {
                return sliceOwners[0];
            } else {
                throw new RuntimeException("Unable to fetch slice-owner name");
            }
        } else {
            throw new RuntimeException("Unable to fetch slice-owner name");
        }
    } catch (exception) {
        throw new RuntimeException("Unable to fetch slice-owner name");
    }
};


/**
 * Returns uplink-connection-slice intents config as JSON object
 *
 * @param shelfName
 * @returns {*}
 */
SlicingUtilities.prototype.getUplinkConnectionSliceReplicatedIntentConfigJson = function (shelfName, sliceOwnerNameObject, nodeType) {
    if (!nodeType) {
        nodeType = apUtils.getNodeTypefromEsAndMds(shelfName);
    }
    if (nodeType.startsWith(intentConstants.LS_DF_PREFIX)) {
        var managerName = apUtils.getManagerInfoFromEsAndMds(shelfName).getName();
    } else if (nodeType.startsWith(intentConstants.LS_FX_PREFIX)) {
        var ltDeviceNames = this.getAllFxLtDevices(shelfName);
        var ltDeviceName = ltDeviceNames[0];
        var managerName = apUtils.getManagerInfoFromEsAndMds(ltDeviceName).getName();
    }

    var resourcePath = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "getSliceOwners.xml.ftl";
    var sliceOwnerName = this.getSliceOwnerName(resourcePath, managerName);
    if (sliceOwnerNameObject) {
        sliceOwnerNameObject["sliceOwnerName"] = sliceOwnerName;
    }
    var uplinkConnectionSliceTarget = shelfName + "#" + sliceOwnerName;

    var replicatedIntentConfig = this.getReplicatedIntentConfig(intentConstants.INTENT_TYPE_UPLINK_CONNECTION_SLICE, uplinkConnectionSliceTarget);
    var keyForList = function (listName) {
        switch (listName) {
            case "uplink-port-name":
                return "yang:leaf-list";
            default:
                return null;
        }
    }
    return apUtils.convertIntentConfigXmlToJson(replicatedIntentConfig, keyForList);
};

/**
 * Returns uplink-connection-slice intents state data
 *
 * @param shelfName
 * @returns {*}
 */
 SlicingUtilities.prototype.getUplinkConnectionSliceReplicatedIntentStateData = function (shelfName, sliceOwnerName) {
    var ltDeviceNames = this.getAllFxLtDevices(shelfName);
    var ltDeviceName = ltDeviceNames[0];
    var managerName = apUtils.getManagerInfoFromEsAndMds(ltDeviceName).getName();
    if (!sliceOwnerName) {
        var resourcePath = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "getSliceOwners.xml.ftl";
        sliceOwnerName = this.getSliceOwnerName(resourcePath, managerName);
    }
    var uplinkConnectionSliceTarget = shelfName + "#" + sliceOwnerName;
    var intentStateData = slicingUtils.getReplicatedIntentState(intentConstants.INTENT_TYPE_UPLINK_CONNECTION_SLICE, uplinkConnectionSliceTarget);
    if (intentStateData) {
        var uplinkPortNames = apUtils.getAttributeValues(intentStateData, "/ibn:state-report/uplink-connection-slice:uplink-connection-slice-state/uplink-connection-slice:uplink-state/uplink-connection-slice:uplink-port-name", apUtils.prefixToNsMap);
        if (uplinkPortNames) {
            var uplinkPortMap = {};
            uplinkPortNames.forEach(function(uplinkPort){
                uplinkPortMap[uplinkPort] = apUtils.getNodeValue(intentStateData, "/ibn:state-report/uplink-connection-slice:uplink-connection-slice-state/uplink-connection-slice:uplink-state[uplink-connection-slice:uplink-port-name='"+ uplinkPort +"']/uplink-connection-slice:rstp-enabled", apUtils.prefixToNsMap);
            })
            return uplinkPortMap;
        }
    } else {
        throw new RuntimeException("Unable to find the RSTP replication info " + uplinkConnectionSliceTarget);
    }
};

/**
 * Provides the replicated intent state data for the provided intent-type with target and origin (if required and available)
 * @param intentType
 * @param target
 * @param origin
 * @returns <>
 */
SlicingUtilities.prototype.getReplicatedIntentState = function (intentType, target, origin) {
    if (!origin) {
        var replicatedIntentsData = replicatedIntentQueryService.getIntentsByIntentTypeAndTarget(intentType, target);
        if (replicatedIntentsData.size() == 1) {
            var origin = replicatedIntentsData[0].getOrigin();
            return replicatedIntentQueryService.getIntentState(intentType, target, origin);
        } else if (replicatedIntentsData.size() > 1) {
            throw new RuntimeException("Multiple records found for intent-type " + intentType + " with target " + target + ", need origin to resolve the correct intent's config");
        } else if (replicatedIntentsData.size() == 0) {
            throw new RuntimeException("No replicated intent found for intent-type " + intentType + " with target " + target);
        }
    } else if (origin) {
        return replicatedIntentQueryService.getIntentState(intentType, target, origin);
    }
};

/**
 * execute search query on replication index and provide the result
 * Need to pass intentInfo parameter when resource file is outside of current context.
 * @param resourceFile
 * @param args
 * @return {*}
 * */
SlicingUtilities.prototype.executeEsReplicatedIntentSearchRequest = function (resourceFile, args) {
    var jsonTemplate = utilityService.processTemplate(resourceProvider.getResource(resourceFile), args);
    var response = esQueryService.queryESReplicatedIntents(jsonTemplate);
    return JSON.parse(response);
};

/**
 * Provides the replicated fiber intent configuration from ES
 * Need to pass intentInfo parameter when resource file is outside of current context.
 * @param resourceFile
 * @param args
 * @returns {*}
 */
SlicingUtilities.prototype.getFiberIntentFromReplication = function (resourceFile, args) {
    var fiberDetails = {};
    var response = slicingUtils.executeEsReplicatedIntentSearchRequest(resourceFile, args);
    if (apUtils.isResponseContainsData(response)) {
        if (response.hits.total.value > 1) {
            if (args && args["fiberName"]) {
                var replicatedIntentsData = replicatedIntentQueryService.getIntentsByIntentTypeAndTarget(intentConstants.INTENT_TYPE_FIBER, args["fiberName"]);
                if (replicatedIntentsData && replicatedIntentsData.size() > 0 && replicatedIntentsData[0]["intentTypeVersion"]) {
                    args["fiberIntentVersion"] = replicatedIntentsData[0]["intentTypeVersion"];
                    response = this.executeEsReplicatedIntentSearchRequest(resourceFile, args);
                }
            }
        }
        if (response.hits.total.value == 1) {
            response.hits.hits.forEach(function (result) {
                if (result["_source"] && result["_source"]["configuration"] && result["_source"]["configuration"]) {
                    if (result["_source"]["configuration"]["xpon-type"]) {
                        var xponType = result["_source"]["configuration"]["xpon-type"];
                        fiberDetails["xponType"] = xponType;
                    }
                    if (result["_source"]["configuration"]["device-name"]) {
                        var deviceName = result["_source"]["configuration"]["device-name"];
                        fiberDetails["deviceName"] = deviceName;
                    }
                    if (result["_source"]["configuration"]["pon-id"]) {
                        var ponId = result["_source"]["configuration"]["pon-id"][0];
                        fiberDetails["ponId"] = ponId;
                    }
                }
            });
        }
    }
    return fiberDetails;
};

/**
 *  Fetch fiber-slice intent details from replication
 *  Need to pass intentInfo parameter when resource file is outside of current context.
 *  @param resourceFile
 *  @param args
 *  @return {*}
 * */
SlicingUtilities.prototype.getFiberSliceIntentsFromReplication = function (resourceFile, args) {
    var fiberSliceJson = {};
    var response = slicingUtils.executeEsReplicatedIntentSearchRequest(resourceFile, args);
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (result) {
            if (result["_source"] && result["_source"]["configuration"] && result["_source"]["configuration"]["bandwidth-allocation-strategy"]) {
                fiberSliceJson["bandwidthStrategyType"] = result["_source"]["configuration"]["bandwidth-allocation-strategy"][0];
            }
        });
    }
    return fiberSliceJson;
};

/**
 *  Fetch fiber and olt devices from ont topology
 *  @param ontTarget
 *  @return {*}
 * */
SlicingUtilities.prototype.getFiberAndOltDeviceFromTopology = function (ontTarget) {
    var topology = topologyQueryService.getLatestTopology(intentConstants.INTENT_TYPE_ONT, ontTarget);
    if (topology) {
        var topologyXtraInfo = apUtils.getTopologyExtraInfo(topology);
        if (topologyXtraInfo && topologyXtraInfo["REPLICATED_ONT_ASSOCIATED_LT_DETAILS"]) {
            return JSON.parse(topologyXtraInfo["REPLICATED_ONT_ASSOCIATED_LT_DETAILS"]);
        } else {
            return this.getFiberAndOltDeviceDetailsFromReplication(ontTarget);
        }
    }
};

/**
 * Provides the LT device info for the connected fiber
 * @param ontName
 * @param fiberName
 * @returns {{}}
 */
SlicingUtilities.prototype.getFiberAndOltDeviceInfoFromReplication = function (ontName, fiberName) {
    var result = {};
    if (ontName && !fiberName) {
        var ontIntentConfigJson = apUtils.getOntIntentConfigJson(ontName);
        fiberName = ontIntentConfigJson["fiber-name"];
        if(!fiberName){
            throw new RuntimeException("Fiber Name can't be empty");
        }
    }
    var args = {
        fiberName: fiberName
    };
    var fiberDetails = slicingUtils.getFiberIntentFromReplication(intentConstants.MANAGER_SPECIFIC_NV_SLICING + "esGetFiberIntent.json.ftl", args);
    if (fiberDetails) {
        if (fiberDetails.deviceName && fiberDetails.ponId) {
            var nodeType = apUtils.getNodeTypefromEsAndMds(fiberDetails.deviceName);
			if(nodeType.startsWith(intentConstants.LS_DF_PREFIX)){
				var oltDeviceDetails = apfwk.gatherInformationAboutDevices(fiberDetails.deviceName);
            
			}else{
				var ltDevice = fiberDetails.deviceName + intentConstants.DEVICE_SEPARATOR + fiberDetails.ponId.split(intentConstants.DEVICE_SEPARATOR)[0];
           	 	var oltDeviceDetails = apUtils.getOltDeviceInfoFromMDS(ltDevice);
			}
            result["oltDevices"] = oltDeviceDetails;
        }
    } else {
        throw new RuntimeException("Unable to find fiber intent details from the replicated info")
    }
    return result;
};

/**
 * Returns the Bandwidth Allocation Strategy for the provided fiber name and xpontype
 * @param fiberName
 * @param xponType
 * @returns {{}}
 */
SlicingUtilities.prototype.getFiberSliceBandwidthAllocStrategyFromReplication = function (fiberName) {
    var bandwidthStrategyType;
    var args = {
        fiberName: fiberName + "#*"
    };
    var fiberSliceIntentsFromReplication = slicingUtils.getFiberSliceIntentsFromReplication(intentConstants.MANAGER_SPECIFIC_NV_SLICING + "esGetFiberSliceIntent.json.ftl", args);
    if (fiberSliceIntentsFromReplication.bandwidthStrategyType) {
        bandwidthStrategyType = fiberSliceIntentsFromReplication.bandwidthStrategyType;
    } else {
        throw new RuntimeException("Unable to find fiber-slice replicated info for the fiber " + fiberName);
    }
    return bandwidthStrategyType;
};

/**
 * Fetch olt and fiber details from replicated intent
 * @param ontName
 * @param fiberName
 * @param ponType
 * @return {*}
 * */
SlicingUtilities.prototype.getFiberAndOltDeviceDetailsFromReplication = function (ontName, fiberName, ponType) {
    var result = {};
    if (ontName && !fiberName) {
        var ontIntentConfigJson = apUtils.getOntIntentConfigJson(ontName);
        fiberName = ontIntentConfigJson["fiber-name"];
        if(!fiberName){
            throw new RuntimeException("Fiber Name can't be empty");
        }
        ponType = ontIntentConfigJson["pon-type"];
    }

    result["fiberName"] = fiberName;

    var args = {
        fiberName: fiberName
    };
    var fiberDetails = slicingUtils.getFiberIntentFromReplication(intentConstants.MANAGER_SPECIFIC_NV_SLICING + "esGetFiberIntent.json.ftl", args);
    if (!apUtils.ifObjectIsEmpty(fiberDetails)) {
        result["fiberXponType"] = fiberDetails.xponType[0];
        if (result["fiberXponType"] === intentConstants.XPON_TYPE_MPM_GPON_XGS) {
            result["xponType"] = ponType;
        } else if(result["fiberXponType"] === intentConstants.XPON_TYPE_DUAL_GPON) {
            result["xponType"] = intentConstants.XPON_TYPE_GPON;
        } else {
            if (ponType) {
                result["xponType"] = ponType;
            } else {
                result["xponType"] = fiberDetails.xponType[0];
            }
        }

        var ontDeviceName = this.getOntDeviceName(ontName, result["xponType"]);
        result["ontDeviceName"] = ontDeviceName;

        if (fiberDetails.deviceName && fiberDetails.ponId) {
            result["shelfDevice"] = fiberDetails.deviceName;
            var deviceType = apUtils.getNodeTypefromEsAndMds(fiberDetails.deviceName);
            if (deviceType.startsWith(intentConstants.LS_DF_PREFIX)) {
                var ltDevice = fiberDetails.deviceName[0];
            } else {
                var ltDevice = fiberDetails.deviceName + intentConstants.DEVICE_SEPARATOR + fiberDetails.ponId.split(intentConstants.DEVICE_SEPARATOR)[0];
            }

            var oltDeviceDetails = apUtils.getOltDeviceInfoFromMDS(ltDevice);
            result["oltDevices"] = oltDeviceDetails;

            var sliceOwnerName = null;
            var args = {
                isQueryString: "true",
                ontName: ontName + "#*#" + result["xponType"]
            };
            var response = slicingUtils.executeEsReplicatedIntentSearchRequest(intentConstants.MANAGER_SPECIFIC_NV_SLICING + "esGetOntNameFromOntConnection.json.ftl", args);
            if (apUtils.isResponseContainsData(response)) {
                response.hits.hits.forEach(function (result) {
                    if (result["_source"] && result["_source"]["target"] && result["_source"]["target"]["raw"]) {
                        sliceOwnerName = result["_source"]["target"]["raw"].split("#")[1];
                    }
                });
            }
            if (sliceOwnerName != null) {
                result["slice-owner-name"] = sliceOwnerName;
                var ontTarget = ontName + "#" + sliceOwnerName + "#" + result["xponType"];
                var intentStateData = slicingUtils.getReplicatedIntentState(intentConstants.INTENT_TYPE_ONT_CONNECTION, ontTarget);
                if (intentStateData) {
                    var onuManagement = apUtils.getAttributeValues(intentStateData, "/ibn:state-report/ont-connection:ont-connection-state/ont-connection:onu-management", apUtils.prefixToNsMap);
                    if (onuManagement && onuManagement[0] == "Embedded") {
                        result["onuManagement"] = intentConstants.ONU_MODEL_EONU;
                    } else if (onuManagement) {
                        result["onuManagement"] = intentConstants.ONU_MODEL_VONU;
                    }
                } else {
                    throw new RuntimeException("Unable to find ONU Management replication info for the ont " + ontName);
                }
            } else {
                throw new RuntimeException("Unable to find '" + ontName +"' details from the replicated information");
            }
        }
    } else {
        throw new RuntimeException("Unable to find fiber intent details from the replicated info");
    }

    result["bandwidthStrategyType"] = this.getFiberSliceBandwidthAllocStrategyFromReplication(fiberName);
    logger.debug("fiber and olt devices from replication : {}", JSON.stringify(result));
    return result;
};

SlicingUtilities.prototype.getUplinkConnectionSliceReplicatedStateData = function (shelfName) {
    var managerName = apUtils.getManagerInfoFromEsAndMds(shelfName).getName();
    var resourcePath = intentConstants.MANAGER_SPECIFIC_NV_SLICING + "getSliceOwners.xml.ftl";
    logger.debug("getUplinkConnectionSliceReplicatedStateData :: managerName : {}",managerName);
    var sliceOwnerName = this.getSliceOwnerName(resourcePath, managerName);
    var uplinkConnectionSliceTarget = shelfName + "#" + sliceOwnerName;
    var intentStateData = this.getReplicatedIntentState(intentConstants.INTENT_TYPE_UPLINK_CONNECTION_SLICE, uplinkConnectionSliceTarget);
    if (intentStateData) {
        var offSet = apUtils.getAttributeValues(intentStateData, "/ibn:state-report/uplink-connection-slice:uplink-connection-slice-state/uplink-connection-slice:qos-profile-id-offset", apUtils.prefixToNsMap);
        if (offSet && offSet[0]){
            return offSet[0];
        } else {
            return 0;
        }
    } else {
        throw new RuntimeException("Unable to find uplink connection slice replicated state");
    }
};

/**
 *
 * @param vnoName
 * @param topicName
 * @param payload
 */
SlicingUtilities.prototype.sendKafkaNotification = function (vnoName, topicName, payload) {
    slicingAppNotificationService.sendNotification(vnoName, topicName, payload);
};

SlicingUtilities.prototype.getUltraLowLatencyValue = function (fiberName) {
    var devices = xponUtils.getDeviceListFromFiber(fiberName);
    var shelfDeviceName = devices["oltDevice"];
    var nodeType = apUtils.getNodeTypefromEsAndMds(shelfDeviceName);
    var ultraLowLatency = null;
    if (nodeType && nodeType.startsWith(intentConstants.LS_FX_PREFIX) && devices["ponPortName"]) {
        var familyTypeRelease = apUtils.getNodeTypefromEsAndMds(devices["ltDevices"][0]);
        var portProfile = apUtils.getPortProfileDetailsByDeviceType(fiberName, devices["ponPortName"], familyTypeRelease);
        if (portProfile && portProfile["ultra-low-latency"]) {
            ultraLowLatency = portProfile["ultra-low-latency"];
        }
    }
    return ultraLowLatency;
}

/**
 * Returns the Fiber Bandwidth Config based on FiberName and bandwidth-allocation-profile
 * @param fiberName
 * @param fiberIntentConfigJson
 * @param ponType
 * @param fiberLtDevice
 * @returns {}
 */
SlicingUtilities.prototype.getFiberIntentBWAllocation = function (fiberName, fiberIntentConfigJson, ponType, fiberLtDevice) {
    var fiberBwConfig = {};
    var ponList = fiberIntentConfigJson["pon-port"];
    for (var pon in ponList) {
        var ponDetails = ponList[pon];
        var bwAllocationProfile = ponDetails["bandwidth-allocation-profile"];
        break;
    }

    if (bwAllocationProfile) {
        var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_FIBER, fiberName);
        var nodeType = apUtils.getNodeTypefromEsAndMds(fiberLtDevice);
        var fiberProfileList = new  ArrayList();
        var bandwidthAllocationProfileVO = intentProfileInputFactory.createIntentProfileInputVO(bwAllocationProfile, profileConstants.FIBER_BANDWIDTH_ALLOCATION_PROFILE.subType, profileConstants.FIBER_BANDWIDTH_ALLOCATION_PROFILE.profileType);
        fiberProfileList.add(bandwidthAllocationProfileVO);
        var deviceRelease = apUtils.splitToHardwareTypeAndVersion(nodeType).release;
        var bandwidthAllocationProfilesJson = apUtils.getSpecificProfilesInJsonFormat(intentConstants.INTENT_TYPE_FIBER, intentVersion, deviceRelease, null, fiberProfileList);
        var bandwidthAllocationProfile = bandwidthAllocationProfilesJson[profileConstants.FIBER_BANDWIDTH_ALLOCATION_PROFILE.profileType][profileConstants.FIBER_BANDWIDTH_ALLOCATION_PROFILE.subType];
        bandwidthAllocationProfile = bandwidthAllocationProfile[0];
        if (bwAllocationProfile == bandwidthAllocationProfile["name"]) {
            var dsPir = slicingUtils.convertKbpsToMbps(bandwidthAllocationProfile[ponType]["downstream-pir"]);
            fiberBwConfig["downstream-pir"] = dsPir;
            var dsCir = slicingUtils.convertKbpsToMbps(bandwidthAllocationProfile[ponType]["downstream-cir"]);
            fiberBwConfig["downstream-cir"] = dsCir;
            var usPir = slicingUtils.convertKbpsToMbps(bandwidthAllocationProfile[ponType]["upstream-pir"]);
            fiberBwConfig["upstream-pir"] = usPir;
            var usCir = slicingUtils.convertKbpsToMbps(bandwidthAllocationProfile[ponType]["upstream-cir"]);
            fiberBwConfig["upstream-cir"] = usCir;
            fiberBwConfig["downstream-fec"] = bandwidthAllocationProfile["downstream-fec"];
            return fiberBwConfig;
        }
    }
    return fiberBwConfig;
};

/**
 * This method used to get fiber-slice intent target names which are created with given fiber name
 * @param fiberName
 * @returns []
 */
SlicingUtilities.prototype.getFiberSliceIntentByFiber = function (fiberName) {
    var fiberSlices = [];
    var fiberSliceTargets = apUtils.getTargetsByIntentTypeUsingESQuery(intentConstants.INTENT_TYPE_FIBER_SLICE);
    if (fiberSliceTargets) {
        fiberSliceTargets.forEach(function (fiberSliceTarget) {
            var parts = fiberSliceTarget.split(intentConstants.TARGET_DELIMITER);
            if (parts.length > 1 && parts[0] == fiberName)
                fiberSlices.push(fiberSliceTarget);
        });
    }
    return fiberSlices;
}

/**
 * This method used to get bandwidth-allocation-profile config with profile manager
 * @param bandwidthAllocationProfile
 * @param bwAllocProfilesJson
 * @param profileType
 * @param subType
 * @returns {}
 */
SlicingUtilities.prototype.getBwAllocProfileConfigWithProfileManager = function (bandwidthAllocationProfile, bwAllocProfilesJson, profileType, subType) {
    var bwConfig = {};
    var bwAllocProfileList = bwAllocProfilesJson[subType][profileType];
    bwAllocProfileList.forEach(function (bwAllocProfile) {
        if (bandwidthAllocationProfile == bwAllocProfile["name"]) {
            bwConfig = bwAllocProfile;
            return bwConfig;
        }
    });
    return bwConfig;
};

/**
 * 
 * @param {*} fiberName 
 * @param {*} slicingMode 
 * @returns 
 */
 SlicingUtilities.prototype.getPortProfileAttributesFromFiber = function (fiberName, slicingMode) {
    var fetchKey = "getPortProfileAttributesFromFiber_".concat(fiberName);
    var portProfileAttributes = apUtils.getContentFromIntentScope(fetchKey);
    if (portProfileAttributes) {
        return portProfileAttributes;
    }
    var fiberDevices = [];
    var ponId;
    var getSubTypeForProfileManager = function (nodeType) {
        var subType = "";
        if (nodeType.startsWith(intentConstants.LS_FX_PREFIX)) {
            subType = intentConstants.LS_FX_PREFIX;
        } else if (nodeType.startsWith(intentConstants.LS_MF_PREFIX)) {
            subType = intentConstants.LS_MF_PREFIX;
        } else if (nodeType.startsWith(intentConstants.LS_DF_PREFIX)) {
            subType = intentConstants.LS_DF_PREFIX;
        } else if (nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
            subType = intentConstants.LS_SF_PREFIX;
        }
        return subType;
    }
    var getKeyForList = function (listName) {
        switch (listName) {
            case "pon-port":
                return ["device-name", "pon-id"];
            default:
                return null;
        }
    }
    if(slicingMode == intentConstants.NETWORK_SLICING_USER_TYPE_NON_SLICING) {
        var fiberIntentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_FIBER, fiberName);
        var fiberIntentConfigJson = apUtils.getFiberIntentConfigJson(fiberName);
    } else {
        var fiberIntentVersion = slicingUtils.getReplicatedIntentTypeVersion(intentConstants.INTENT_TYPE_FIBER, fiberName);
        var fiberIntentConfig = slicingUtils.getReplicatedIntentConfig(intentConstants.INTENT_TYPE_FIBER, fiberName);
        var fiberIntentConfigJson = {};
        apUtils.convertIntentConfigXmlToJson(fiberIntentConfig, getKeyForList, fiberIntentConfigJson);
    }
    if (fiberIntentConfigJson && fiberIntentConfigJson["pon-port"]) {
        var ponPorts = Object.keys(fiberIntentConfigJson["pon-port"]);
        ponPorts.forEach(function (ponPort) {
            var fiberDevice = ponPort.split("#")[0];
            fiberDevices.push(fiberDevice);
            ponId = ponPort.split("#")[1];
        });
        var devicesInfo = apUtils.gatherInformationAboutDevicesFromEsAndMds(fiberDevices);
        var deviceInfo = devicesInfo[0];
        if (deviceInfo && deviceInfo.managerType && deviceInfo.managerType === intentConstants.MANAGER_TYPE_NAV && deviceInfo.familyTypeRelease) {
            if (ponId) {
                var ponPortKey = (deviceInfo.name).concat("#", ponId)
                var portProfileName = fiberIntentConfigJson["pon-port"][ponPortKey]["port-profile"];
                if (portProfileName) {
                    if ((deviceInfo.familyType).startsWith(intentConstants.LS_DF_PREFIX)) {
                        var deviceRelease = deviceInfo.familyTypeRelease.substring(deviceInfo.familyTypeRelease.lastIndexOf("-") + 1);
                        var portProfileSet= apUtils.getAssociatedProfilesWithConfig(intentConstants.INTENT_TYPE_FIBER,fiberIntentVersion,
                            profileConstants.FIBER_PORT_PROFILE.profileType,profileConstants.FIBER_PORT_PROFILE.subTypeDF,
                            deviceRelease, portProfileName, null);
                        var portProfile = apUtils.parseSingleProfile(portProfileSet, profileConstants.FIBER_PORT_PROFILE.profileType);
                    } else if ((deviceInfo.familyType).startsWith(intentConstants.LS_FX_PREFIX) || (deviceInfo.familyType).startsWith(intentConstants.LS_MF_PREFIX) || (deviceInfo.familyType).startsWith(intentConstants.LS_SF_PREFIX)) {
                        var deviceName = (deviceInfo.name).concat(".", ponId.split(".")[0])
                        var devicesData = apUtils.gatherInformationAboutDevicesFromEsAndMds([deviceName])[0];
                        // using LT to get profiles
                        var subType = getSubTypeForProfileManager(devicesData.familyTypeRelease);
                        var deviceRelease = devicesData.familyTypeRelease.substring(devicesData.familyTypeRelease.lastIndexOf("-") + 1);
                        var portProfileSet= apUtils.getAssociatedProfilesWithConfig(intentConstants.INTENT_TYPE_FIBER,fiberIntentVersion,
                            profileConstants.FIBER_PORT_PROFILE.profileType,subType, deviceRelease, portProfileName, null);
                        var portProfile = apUtils.parseSingleProfile(portProfileSet, profileConstants.FIBER_PORT_PROFILE.profileType);

                    }
                    if(portProfile) {
                       return portProfile;
                    }
                }
            }
        }
    }
    if (portProfileAttributes) {
        apUtils.storeContentInIntentScope(fetchKey, portProfileAttributes);
    }
    return portProfileAttributes;
}
