/**
 * (c) 2021 Nokia. All Rights Reserved.
 *
 * INTERNAL - DO NOT COPY / EDIT
 **/
load({script: resourceProvider.getResource('internal/java-imports.js'), name: 'java-imports.js'})
load({script: resourceProvider.getResource('internal/altiplano-intent-constants.js'), name: 'altiplano-intent-constants.js'});
load({script: resourceProvider.getResource('internal/altiplano-utilities.js'), name: 'altiplano-utilities.js'});

var apUtils = new AltiplanoUtilities();
var profileConstants = new AltiplanoProfileConstants();
var intentConstants = new AltiplanoIntentConstants();

function XponUtilities() {
}

/**
 * This method is used to get LT device role from xtraInfo.
 * @param xtraInfo
 * @param ltDeviceName
 * @returns {string|*}
 */
XponUtilities.prototype.getLtDeviceRole = function (xtraInfo, ltDeviceName) {
    if (xtraInfo && xtraInfo["devices"] && xtraInfo["devices"][ltDeviceName] && xtraInfo["devices"][ltDeviceName]["role"]) {
        if (xtraInfo["devices"][ltDeviceName]["role"]) {
            return xtraInfo["devices"][ltDeviceName]["role"];
        } else {
            logger.debug("Device role not found for " + ltDeviceName);
            return intentConstants.TYPE_B_PRIMARY;
        }
    }
}

/**
 * This method is used to find secondary LT device which is removed.
 *
 * @param stageName
 * @param topology
 */
XponUtilities.prototype.findRemovedSecondaryLtDevice = function (stageName, topology) {
    if (requestScope.get().get("removedDevices") && Object.keys(requestScope.get().get("removedDevices")).length > 0) {
        var removedDevices = requestScope.get().get("removedDevices");

        removedDevices.forEach(function (removedDevice) {
            var topologyExtraInfo = apUtils.getTopologyExtraInfo(topology);
            if (topologyExtraInfo && Object.keys(topologyExtraInfo).length > 0) {
                var removedLtTopoKey = stageName + "_" + removedDevice.name + "_ARGS";
                var xtraInfoForRemovedDevice = JSON.parse(topologyExtraInfo[removedLtTopoKey])[removedDevice.name];
                if (xponUtils.getLtDeviceRole(xtraInfoForRemovedDevice, removedDevice.name) === intentConstants.TYPE_B_SECONDARY) {
                    requestScope.get().put("removedSecondaryLt", removedDevice);
                }
            }
        });
    }
}

/**
 * Getting TCA profiles for each onu templates
 * @param onuTemplates
 * @param tcaProfiles
 */
 XponUtilities.prototype.getTcaProfileForOnuTemplates = function(onuTemplates, tcaProfiles) {
    var tcaProfileForOnuTemplates = {};
    for (var templateIndex in onuTemplates) {
        var profiles = {};
        var transceiverTcaProfileId = onuTemplates[templateIndex]["transceiver-tca-profile-id"];
        var transceiverLinkTcaProfileId = onuTemplates[templateIndex]["transceiver-link-tca-profile-id"];
        if (transceiverTcaProfileId) {
            var profileCount = 0;
            var transceiverTcaProfiles = tcaProfiles["transceiver-tca-profiles"];
            for (var profileIndex in transceiverTcaProfiles) {
                if (transceiverTcaProfiles[profileIndex]["name"] == transceiverTcaProfileId) {
                    profiles["transceiver-tca-profiles"] = transceiverTcaProfiles[profileIndex];
                    profileCount++;
                    break;
                }
            }
            if (profileCount == 0) {
                throw new RuntimeException("transceiver-tca-profile-id \"" + transceiverTcaProfileId + "\" is incorrect for template \"" + onuTemplates[templateIndex]["name"] + "\"");
            }
        }
        profiles["transceiver-tca-profile-id"] = transceiverTcaProfileId;

        if (transceiverLinkTcaProfileId) {
            var profileCount = 0;
            var transceiverLinkTcaProfiles = tcaProfiles["transceiver-link-tca-profiles"];
            for (var profileIndex in transceiverLinkTcaProfiles) {
                if (transceiverLinkTcaProfiles[profileIndex]["name"] == transceiverLinkTcaProfileId) {
                    profiles["transceiver-link-tca-profiles"] = transceiverLinkTcaProfiles[profileIndex];
                    profileCount++;
                    break;
                }
            }
            if (profileCount == 0) {
                throw new RuntimeException("transceiver-link-tca-profile-id \"" + transceiverLinkTcaProfileId + "\" is incorrect for template \"" + onuTemplates[templateIndex]["name"] + "\"");
            }
        }
        profiles["transceiver-link-tca-profile-id"] = transceiverLinkTcaProfileId;

        apUtils.formatStringAttributeToObject(profiles, "transceiver-tca-profile-id");
        apUtils.formatStringAttributeToObject(profiles, "transceiver-link-tca-profile-id");
        tcaProfileForOnuTemplates[onuTemplates[templateIndex]["name"]] = profiles;
    }
    return tcaProfileForOnuTemplates;
}

/**
 * 
 * @param {String} qosProfileId QoS profile Id (US_HSI)
 * @param {Object} qosProfiles QoS profiles object
 * @returns
 */
XponUtilities.prototype.isPbitMarkingAvailable = function (qosProfileId, qosProfiles) {
    var isAvailable = false;
    var qosPolicyProfiles = qosProfiles["qos-policy-profiles"];
    var policies = qosProfiles["policies"];
    var classifiers = qosProfiles["classifiers"];
    //Loop qos-policy-profiles for policy-list
    var qosPolicyProfileFilter = qosPolicyProfiles.filter(function (qosPolicyProfile) {
        return qosPolicyProfile["name"] === qosProfileId;
    });
    if (qosPolicyProfileFilter && qosPolicyProfileFilter.length > 0 && qosPolicyProfileFilter[0]["policy-list"]) {
        var policyList = qosPolicyProfileFilter[0]["policy-list"];
        for (var policyInx in policyList) {
            var policyName = policyList[policyInx]["name"];
            //Loop policies for classifiers
            var policyFilter = policies.filter(function (policy) {
                return policy["name"] === policyName;
            });
            if (policyFilter && policyFilter.length > 0 && policyFilter[0]["classifiers"]) {
                var classifierList = policyFilter[0]["classifiers"];
                for (var classifierInx in classifierList) {
                    var classifierName = classifierList[classifierInx]["name"];
                    //Check classifiers for pbit-marking-list ["classifier-action-entry-cfg"][0]["action-type"]
                    var classifierFilter = classifiers.filter(function (classifier) {
                        return classifier["name"] === classifierName;
                    });
                    if (classifierFilter && classifierFilter.length > 0 && classifierFilter[0]["classifier-action-entry-cfg"]
                        && classifierFilter[0]["classifier-action-entry-cfg"][0] && classifierFilter[0]["classifier-action-entry-cfg"][0]["action-type"]
                        && classifierFilter[0]["classifier-action-entry-cfg"][0]["action-type"].indexOf("pbit-marking") >= 0) {
                        return true;
                    }
                }
            }
        }
    }
    return isAvailable;
}

/**
 * 
 * @param {Array} onuTemplate 
 * @param {Array} qosProfiles 
 */
XponUtilities.prototype.processSevicesOnuTemplate = function (onuTemplate, qosProfiles) {
    for (var templateIdx in onuTemplate) {
        var services = onuTemplate[templateIdx]["service"];
        for (var serviceIdx in services) {
            var service = services[serviceIdx];
            if (service["subscriber-ingress-qos-profile-id"]) {
                service["isPbitMarkingAvailable"] = this.isPbitMarkingAvailable(service["subscriber-ingress-qos-profile-id"], qosProfiles);
            }
        }
    }
}

XponUtilities.prototype.getDeviceListFromFiber = function (fiberName) {
    if (fiberName) {
        var fiberIntentConfigJson = apUtils.getFiberIntentConfigJson(fiberName);

        if (apUtils.ifObjectIsEmpty(fiberIntentConfigJson)) {
            throw new RuntimeException("Invalid Fiber Name '" + fiberName + "'");
        }
        if (requestScope.get()) {
            requestScope.get().put("fiberIntentConfigJson", fiberIntentConfigJson);
        }

        var devices = {};
        var ltDevices = [];
        if (fiberIntentConfigJson["pon-port"]) {
            var keys = Object.keys(fiberIntentConfigJson["pon-port"]);
            keys.forEach(function (key) {
                var ponKeys = key.split('#'); //PON-PORT has as key of DeviceName#PONPort
                var nodeType = apUtils.getNodeTypefromEsAndMds(ponKeys[0]);

                if (nodeType.startsWith(intentConstants.LS_FX_PREFIX) || nodeType.startsWith(intentConstants.LS_MF_PREFIX)) {
                    devices["ponPortName"] = key;
                    devices["oltDevice"] = ponKeys[0]
                    var ponPortDetails = ponKeys[1].split('.'); // PON Port is having a format as LT<Nr>.<PON Nr>
                    var ltDevice = ponKeys[0] + intentConstants.FX_DEVICE_SEPARATOR + ponPortDetails[0];

                    ltDevices.push(ltDevice);
                } else if (nodeType.startsWith(intentConstants.LS_DF_PREFIX)) {
                    devices["oltDevice"] = ponKeys[0];
                }
            });
        }
        if (ltDevices.length > 0) {
            devices["ltDevices"] = ltDevices;
        }
        if (requestScope.get()) {
            requestScope.get().put("fiberDeviceList", devices);
        }

        return devices;
    }
    return [];
}
/**
 * 
 * @param {String} flatSchedulingProfileId
 * @param {Object} flatSchedulingProfiles
 * 
 */
XponUtilities.prototype.processFlatSchedulingProfileInFiber = function (flatSchedulingProfileId, flatSchedulingProfiles, baseArgs) {
    var fwk = requestScope.get().get("xFWK");
    var isFlatSchedulingProfileExists = false;
    var qosSchemaJson = JSON.parse(resourceProvider.getResource(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR + "qosSchema.json"));
    for (var index = 0; index < flatSchedulingProfiles.length; index++) {
        if (flatSchedulingProfileId == flatSchedulingProfiles[index]["name"]) {
            isFlatSchedulingProfileExists = true;
            baseArgs["flatSchedulingProfileName"] = flatSchedulingProfiles[index]["name"];
            if (flatSchedulingProfiles[index]["queues"]) {
                fwk.convertObjectToNetconfFwkFormat(flatSchedulingProfiles[index], qosSchemaJson["qosSchema"], baseArgs);
            }
            break;
        }
    }
    if (!isFlatSchedulingProfileExists) {
        throw new RuntimeException("flat-scheduling-profile " + flatSchedulingProfileId + " does not exist");
    }
}
/**
 * This method will find what are objects needs to be deleted.
 *  i) It will fetch extraInfro from Topology and find out previous l2 infra servicename and their intent configuration
 *  ii) compare with current(new) l2-infra intent information and then find what configuration are should be deleted.
 * 
 * @param topology
 * @param deviceId
 * @param extraKey
 * @param baseArgs
 * 
 */
 XponUtilities.prototype.processL2InfraNameChangeConfiguration = function (topology, deviceId, extraKey, baseArgs){
    var l2InfraServiceName = baseArgs["l2InfraServiceName"];
    var deviceType = apUtils.getNodeTypefromEsAndMds(deviceId);
    var xtraInfo = apUtils.getTopologyExtraInfo(topology);
    if (xtraInfo) {
        var stageArgs = xtraInfo[extraKey];
        if (stageArgs) {
            stageArgs = JSON.parse(stageArgs);
            var extraInfoDetails = stageArgs[deviceId];
            if (extraInfoDetails && extraInfoDetails.hasOwnProperty("l2InfraServiceName") && deviceType.contains(intentConstants.LS_IHUB)) {
                // find the configration which need to be deleted for IHUB device
                if (extraInfoDetails["l2InfraServiceName"].value != l2InfraServiceName) {
                    var oldL2infraServiceName = extraInfoDetails["l2InfraServiceName"].value;
                    var l2InfraListKeyFunction = function (listName) {
                        switch (listName) {
                            case "nni-id":
                                return "yang:leaf-list";
                            default:
                                return null;
                        }
                    };
                    var ntDeviceName = deviceId.split(".IHUB")[0];
                    var oldL2InfraIntent =  apUtils.getIntentDetailsFromIBNOrRequestScope("l2InfraIntentDetails", intentConstants.INTENT_TYPE_L2_INFRA, ntDeviceName+"#"+oldL2infraServiceName, l2InfraListKeyFunction);
                    if (oldL2InfraIntent) {
                        var oldL2InfraIntentConfig = oldL2InfraIntent.intentConfig;
                        var oldVlanId;
                        var oldServiceVlanId;
                        var oldVplsId;
                        if (oldL2InfraIntentConfig["vpls-id"]) {
                           oldVplsId = oldL2InfraIntentConfig["vpls-id"];
                        }
                        if (oldL2InfraIntentConfig["internal-s-vlan-id"]) {
                            oldVlanId = oldL2InfraIntentConfig["internal-s-vlan-id"];
                        } else if (oldL2InfraIntentConfig["internal-c-vlan-id"]) {
                            oldVlanId = oldL2InfraIntentConfig["internal-c-vlan-id"];
                        } else if (oldL2InfraIntentConfig["s-vlan-id"]) {
                            oldVlanId = oldL2InfraIntentConfig["s-vlan-id"];
                            oldServiceVlanId = oldVlanId;
                        } else if (oldL2InfraIntentConfig["c-vlan-id"] || ((extraInfoDetails["customer-vlan-id"] && extraInfoDetails["customer-vlan-id"].value) || (extraInfoDetails["customerVlanId"] && extraInfoDetails["customerVlanId"].value))) {
                            if (oldL2InfraIntentConfig["c-vlan-id"]) {
                                oldVlanId = oldL2InfraIntentConfig["c-vlan-id"];
                            } else if ((extraInfoDetails["customer-vlan-id"] && extraInfoDetails["customer-vlan-id"].value)) {
                                oldVlanId = extraInfoDetails["customer-vlan-id"].value;
                            } else if ((extraInfoDetails["customerVlanId"] && extraInfoDetails["customerVlanId"].value)) {
                                oldVlanId = extraInfoDetails["customerVlanId"].value;
                            }
                        } else {
                            throw new RuntimeException("Could not find vlan id from last L2 Infra name");
                        }
                    }
                    var sapIdNeedToRemove = [];
                    var sapIdNeedToRemoveInGc = {};
                    var svcId = oldVlanId;
                    if (oldL2InfraIntentConfig && (oldL2InfraIntentConfig["vlan-mode"] == "cross-connect" || oldL2InfraIntentConfig["vlan-mode"] == "s-vlan-cross-connect") && extraInfoDetails["l2ServiceTransportType"] && extraInfoDetails["l2ServiceTransportType"].value == "vpipe") {
                        // finding vpipe related configuration
                        if (deviceType.startsWith(intentConstants.FAMILY_TYPE_IHUB)) {
                            var uplinkPorts = apUtils.getUplinkPortNameForNNID(deviceId,oldL2InfraIntentConfig["nni-id"],intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX);
                        } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_IHUB)) {
                            var uplinkPorts = apUtils.getUplinkPortNameForNNID(deviceId,oldL2InfraIntentConfig["nni-id"],intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF);
                        } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_SF_IHUB)) {
                            var uplinkPorts = apUtils.getUplinkPortNameForNNID(deviceId,oldL2InfraIntentConfig["nni-id"],intentConstants.INTENT_TYPE_DEVICE_CONFIG_SF);
                        }
                        
                        var oldUplinkPorts = [];
                        if (uplinkPorts) {
                            uplinkPorts.forEach(function(uplinkPort){
                                sapIdNeedToRemove.push(uplinkPort +":"+oldVlanId);
                                oldUplinkPorts.push(uplinkPort);
                            });
                            baseArgs["oldUplinkPorts"] = oldUplinkPorts;
                        }
                        if (oldL2InfraIntentConfig["nni-id"] && oldL2InfraIntentConfig["nni-id"].length > 0) {
                            var pipeNames = [];
                            oldL2InfraIntentConfig["nni-id"].forEach(function(nniId){
                                pipeNames.push([nniId, baseArgs["ltDeviceName"]].join("_"));
                            });
                            baseArgs["old-pipe-name"] = pipeNames;
                        }
                        var existingInnerVlanIds = [];
                        if (oldL2InfraIntentConfig["c-vlan-id"] || (extraInfoDetails["customer-vlan-id"] && extraInfoDetails["customer-vlan-id"].value)) {
                            if (oldL2InfraIntentConfig["c-vlan-id"]) {
                                existingInnerVlanIds.push(oldL2InfraIntentConfig["c-vlan-id"]);
                            } else if ((extraInfoDetails["customer-vlan-id"] && extraInfoDetails["customer-vlan-id"].value)) {
                                existingInnerVlanIds.push(extraInfoDetails["customer-vlan-id"].value);
                            }
                            existingInnerVlanIds.push(oldL2InfraIntentConfig["c-vlan-id"]);
                        } else if (oldL2InfraIntentConfig["internal-c-vlan-id"]) {
                            existingInnerVlanIds.push(oldL2InfraIntentConfig["internal-c-vlan-id"]);
                        }
                        if ( extraInfoDetails["inner-vlan-list"]) {
                            var oldInnerVlanIds = extraInfoDetails["inner-vlan-list"].value.split(",");
                            var innerVlanIds = oldInnerVlanIds.filter(function(vlanId){
                                return existingInnerVlanIds.indexOf(vlanId) === -1;
                            });
                            if (innerVlanIds.length > 0 && innerVlanIds[0] != "") {
                                baseArgs["isPipeDelete"] = "false";
                            } else{
                                baseArgs["isPipeDelete"] = "true";
                            }
                            baseArgs["old-inner-vlan-list"] = innerVlanIds;
                        }
                        if(oldL2InfraIntentConfig["vlan-mode"] == "cross-connect") {
                            baseArgs["oldL2InfraIntentConfigVlanMode"] = "crossConnect";
                        } else if (oldL2InfraIntentConfig["vlan-mode"] == "s-vlan-cross-connect") {
                            baseArgs["oldL2InfraIntentConfigVlanMode"] = "sVlanCrossConnect";
                        }
                    } else {
                        // finding v-vpls related configuration
                        if (oldVplsId) {
                            svcId = oldVplsId;
                        }
                        var templateArgs = {
                            deviceID: deviceId,
                            vlanId: svcId
                        };
                        var requestXml = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "getVplsConfig.xml.ftl";
                        var vplsService = apUtils.getExtractedDeviceSpecificDataNode(requestXml, templateArgs);
                        var sapIdsFromRequest =  apUtils.getAttributeValues(vplsService, "conf:configure/conf:service/conf:vpls[conf:service-name=\'" + svcId + "\']/conf:sap/conf:sap-id", apUtils.prefixToNsMap);
                        var existingSapIds = [];
                        sapIdsFromRequest.forEach(function(sapId){
                            existingSapIds.push(sapId);
                        });
                        var oldLtSapId = extraInfoDetails["sapId"].value + ":" + svcId;
                        sapIdNeedToRemove.push(oldLtSapId);
                        sapIdNeedToRemoveInGc["oldLtSapId"] = oldLtSapId;
                        sapIdNeedToRemoveInGc["oldVplsId"] = svcId;
                        requestScope.get().put("sapIdNeedToRemoveInGc", sapIdNeedToRemoveInGc);
                        var sapIds = existingSapIds.filter(function(sapId){
                            return sapIdNeedToRemove.indexOf(sapId) === -1;
                        });
                        if (sapIds.length > 0) {
                            baseArgs["isVplsDelete"] = "false";
                        } else {
                            baseArgs["isVplsDelete"] = "true";
                        }
                        baseArgs["sapIdNeedToRemove"] = sapIdNeedToRemove;
                    }

                    baseArgs["isL2InfraServiceChanged"] = "true";
                    baseArgs["oldServiceName"] = svcId;
                    baseArgs["oldServiceVlanId"] = oldServiceVlanId;
                    if (extraInfoDetails["forwarderNetworkPortName"] && extraInfoDetails["forwarderNetworkPortName"].value) {
                        baseArgs["oldForwarderNetworkPortName"] = extraInfoDetails["forwarderNetworkPortName"].value;
                    }
                    if (extraInfoDetails["forwarderName"] && extraInfoDetails["forwarderName"].value) {
                        baseArgs["oldForwarderName"] = extraInfoDetails["forwarderName"].value;
                    }
                    if (extraInfoDetails["oltUplinkVlanSubInterfaceName"] && extraInfoDetails["oltUplinkVlanSubInterfaceName"].value) {
                        baseArgs["oldOltUplinkVlanSubInterfaceName"] = extraInfoDetails["oltUplinkVlanSubInterfaceName"].value;
                    }
                }
            } else if (extraInfoDetails && extraInfoDetails.hasOwnProperty("l2InfraServiceName")) {
                // find the configration which need to be deleted for LT device
                if (extraInfoDetails["l2InfraServiceName"].value !== l2InfraServiceName) {
                    baseArgs["isL2InfraServiceChanged"] = "true";
                    baseArgs["oldForwarderName"] = extraInfoDetails["forwarderName"].value;
                    baseArgs["oldForwarderUserPortName"] = extraInfoDetails["forwarderUserPortName"].value;
                    if (extraInfoDetails["forwarderNetworkPortName"] && extraInfoDetails["forwarderNetworkPortName"].value && (extraInfoDetails["forwarderNetworkPortName"].value != baseArgs["forwarderNetworkPortName"])) {
                        baseArgs["oldForwarderNetworkPortName"] = extraInfoDetails["forwarderNetworkPortName"].value;
                    }
                    if (extraInfoDetails["oltUplinkVlanSubInterfaceName"] && extraInfoDetails["oltUplinkVlanSubInterfaceName"].value && (extraInfoDetails["oltUplinkVlanSubInterfaceName"].value != baseArgs["oltUplinkVlanSubInterfaceName"])) {
                        baseArgs["oldOltUplinkVlanSubInterfaceName"] = extraInfoDetails["oltUplinkVlanSubInterfaceName"].value;
                    }
                }
            }
        }
    }
}



/**
 * Getting Aggregation Rate Limit and Storm control configurations
 * @param baseArgs
 * @param deviceTypeAndRelease
 * @param deviceObject
 */
 XponUtilities.prototype.proccessAggregationRateLimitAndStormControl = function(baseArgs, deviceTypeAndRelease, deviceObject) {
    var isRateLimitPolicyProfileSupported = false;
    isRateLimitPolicyProfileSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_RATE_LIMIT_POLICY_PROFILE_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
    var isRateLimitPolicyProfileForVPLSSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_RATE_LIMIT_POLICY_PROFILE_FOR_VPLS_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
    if (isRateLimitPolicyProfileSupported || isRateLimitPolicyProfileForVPLSSupported) {
        baseArgs["isRateLimitPolicyProfileSupported"] = "true";
        baseArgs["isRateLimitPolicyProfileForVPLSSupported"] = true;
        if (deviceObject.egressAggregationRateLimitProfile) {
            baseArgs["egressAggregationRateLimitProfile"] = deviceObject.egressAggregationRateLimitProfile;
        }

        if (deviceObject.ingressAggregationRateLimitProfile) {
            var serviceVlanId;
            if (deviceObject.internalServiceVlanId) {
                serviceVlanId = deviceObject.internalServiceVlanId;
            } else if (deviceObject.internalCustomerVlanId) { 
                serviceVlanId = deviceObject.internalCustomerVlanId;
            } else if (deviceObject.serviceVlanId) { 
                serviceVlanId = deviceObject.serviceVlanId;
            } else {
                serviceVlanId = deviceObject.customerVlanId;
            }
            deviceObject.ingressAggregationRateLimitProfile["identifier"] = (parseInt(serviceVlanId) + 4096).toString();
            baseArgs["ingressAggregationRateLimitProfile"] = deviceObject.ingressAggregationRateLimitProfile;
        }
        baseArgs["stormControl"] = deviceObject.serviceProfiles["storm-control"];
    } else {
      if (deviceObject.egressAggregationRateLimitProfile) {
        baseArgs["egressAggregationRateLimitProfile"] = deviceObject.egressAggregationRateLimitProfile;
      }
      baseArgs["stormControl"] = deviceObject.serviceProfiles["storm-control"];
    }
}

/**
 * This method used to retrieve the associated onuTempaltes from profile manager.
 * 
 * @param {String} fiberName 
 * @param {String} familyTypeRelease 
 * @returns list of Onu Templates
 */
XponUtilities.prototype.getOnuTemplates = function (fiberName, familyTypeRelease) {
    if (!familyTypeRelease) {
        var fiberDeviceDetails = apUtils.getFiberDeviceDetails(fiberName);
        if (!apUtils.ifObjectIsEmpty(fiberDeviceDetails)) {
            var fiberShelfDevice = Object.keys(fiberDeviceDetails["deviceInfo"])[0];
            var nodeType = fiberDeviceDetails["nodeType"];
            if (nodeType.startsWith(intentConstants.LS_FX_PREFIX) || nodeType.startsWith(intentConstants.LS_MF_PREFIX) || nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
                var devices = apUtils.gatherInformationAboutDevicesFromEsAndMds(fiberDeviceDetails["deviceInfo"][fiberShelfDevice]);
            } else {
                var devices = apUtils.gatherInformationAboutDevicesFromEsAndMds([fiberShelfDevice]);
            }
        }

        if (devices && devices[0]) {
            familyTypeRelease = devices[0].familyTypeRelease;
        }
    }
    if (nodeType && nodeType.startsWith(intentConstants.LS_DF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_DF;
    } else if (nodeType && nodeType.startsWith(intentConstants.LS_MF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF;
    } else if (nodeType && nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_SF;
    } else if(nodeType && nodeType.startsWith(intentConstants.LS_FX_PREFIX)){
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX;
    }
    
    if (familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM) ||
        familyTypeRelease.startsWith(intentConstants.ISAM_FX_PREFIX) ||
        familyTypeRelease.startsWith(intentConstants.ISAM_MX_PREFIX) ||
        familyTypeRelease.startsWith(intentConstants.ISAM_DF_PREFIX) ||
        familyTypeRelease.startsWith(intentConstants.ISAM_SF_PREFIX)) {
        return null;
    }
    var intentVersion = apUtils.getIntentVersion(intentType, fiberShelfDevice);
    var deviceRelease = familyTypeRelease.substring(familyTypeRelease.lastIndexOf("-") + 1);
    var onuTempaltesSet = apUtils.getAssociatedProfilesWithConfig(intentType, intentVersion, profileConstants.ONU_TEMPLATE_PROFILE.profileType,
        profileConstants.ONU_TEMPLATE_PROFILE.subType, deviceRelease, null, null, intentConstants.NETWORK_SLICING_USER_TYPE_NON_SLICING, true);
    var onuTemplateProfileList = apUtils.parseProfiles(onuTempaltesSet, profileConstants.ONU_TEMPLATE_PROFILE.profileType);
    return onuTemplateProfileList;
}

/**
 * This method used to retrieve the associated tcontProfiles from profile manager.
 * 
 * @param {String} fiberName 
 * @param {String} familyTypeRelease 
 * @returns list of tcont profiles
 */
XponUtilities.prototype.getTcontProfiles = function (fiberName, familyTypeRelease) {
    if (!familyTypeRelease) {
        var fiberDeviceDetails = apUtils.getFiberDeviceDetails(fiberName);
        if (!apUtils.ifObjectIsEmpty(fiberDeviceDetails)) {
            var fiberShelfDevice = Object.keys(fiberDeviceDetails["deviceInfo"])[0];
            var nodeType = fiberDeviceDetails["nodeType"];
            if (nodeType.startsWith(intentConstants.LS_FX_PREFIX) || nodeType.startsWith(intentConstants.LS_MF_PREFIX) || nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
                var devices = apUtils.gatherInformationAboutDevicesFromEsAndMds(fiberDeviceDetails["deviceInfo"][fiberShelfDevice]);
            } else {
                var devices = apUtils.gatherInformationAboutDevicesFromEsAndMds([fiberShelfDevice]);
            }
        }

        if (devices && devices[0]) {
            familyTypeRelease = devices[0].familyTypeRelease;
        }
    }
    if (nodeType && nodeType.startsWith(intentConstants.LS_DF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_DF;
    } else if (nodeType && nodeType.startsWith(intentConstants.LS_MF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF;
    } else if (nodeType && nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_SF;
    } else if(nodeType && nodeType.startsWith(intentConstants.LS_FX_PREFIX)){
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX;
    }
    
    if (familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)||
        familyTypeRelease.startsWith(intentConstants.ISAM_FX_PREFIX) ||
        familyTypeRelease.startsWith(intentConstants.ISAM_MX_PREFIX) ||
        familyTypeRelease.startsWith(intentConstants.ISAM_DF_PREFIX) ||
        familyTypeRelease.startsWith(intentConstants.ISAM_SF_PREFIX)) {
        return null;
    }
    var intentVersion = apUtils.getIntentVersion(intentType, fiberShelfDevice);
    var deviceRelease = familyTypeRelease.substring(familyTypeRelease.lastIndexOf("-") + 1);
    var onuTempaltesSet = apUtils.getAssociatedProfilesWithConfig(intentType, intentVersion, profileConstants.TCONT_PROFILE_LS.profileType,
        profileConstants.TCONT_PROFILE_LS.subTypeOnt, deviceRelease, null, null, intentConstants.NETWORK_SLICING_USER_TYPE_NON_SLICING);
    var tcontProfileList = apUtils.parseProfiles(onuTempaltesSet, profileConstants.TCONT_PROFILE_LS.profileType);
    return tcontProfileList;
}


/**
 * This method used to retrieve the associated onuTempaltes from profile manager.
 * 
 * @param {String} fiberName 
 * @param {String} familyTypeRelease 
 * @param {String} templateName
 * @returns onuTemplate
 */
XponUtilities.prototype.getOnuTemplateByName = function (fiberName, familyTypeRelease, templateName) {
    if (!familyTypeRelease) {
        var fiberDeviceDetails = apUtils.getFiberDeviceDetails(fiberName);
        if (!apUtils.ifObjectIsEmpty(fiberDeviceDetails)) {
            var fiberShelfDevice = Object.keys(fiberDeviceDetails["deviceInfo"])[0];
            var nodeType = fiberDeviceDetails["nodeType"];
            if (nodeType.startsWith(intentConstants.LS_FX_PREFIX) || nodeType.startsWith(intentConstants.LS_MF_PREFIX) || nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
                var devices = apUtils.gatherInformationAboutDevicesFromEsAndMds(fiberDeviceDetails["deviceInfo"][fiberShelfDevice]);
            } else {
                var devices = apUtils.gatherInformationAboutDevicesFromEsAndMds([fiberShelfDevice]);
            }
        }

        if (devices && devices[0]) {
            familyTypeRelease = devices[0].familyTypeRelease;
        }
    }
    if (nodeType && nodeType.startsWith(intentConstants.LS_DF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_DF;
    } else if (nodeType && nodeType.startsWith(intentConstants.LS_MF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF;
    } else if (nodeType && nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_SF;
    } else if(nodeType && nodeType.startsWith(intentConstants.LS_FX_PREFIX)){
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX;
    }
    if (familyTypeRelease.startsWith(intentConstants.FAMILY_TYPE_ISAM)||
        familyTypeRelease.startsWith(intentConstants.ISAM_FX_PREFIX) ||
        familyTypeRelease.startsWith(intentConstants.ISAM_MX_PREFIX) ||
        familyTypeRelease.startsWith(intentConstants.ISAM_DF_PREFIX) ||
        familyTypeRelease.startsWith(intentConstants.ISAM_SF_PREFIX)) {
        return null;
    }
    var intentVersion = apUtils.getIntentVersion(intentType, fiberShelfDevice);
    var deviceRelease = familyTypeRelease.substring(familyTypeRelease.lastIndexOf("-") + 1);
    var onuTempaltesSet = apUtils.getAssociatedProfilesWithConfig(intentType, intentVersion, profileConstants.ONU_TEMPLATE_PROFILE.profileType,
        profileConstants.ONU_TEMPLATE_PROFILE.subType, deviceRelease, templateName, null, intentConstants.NETWORK_SLICING_USER_TYPE_NON_SLICING);
    var onuTemplate = apUtils.parseSingleProfile(onuTempaltesSet, profileConstants.ONU_TEMPLATE_PROFILE.profileType);
    return onuTemplate;
}

/**
 * Method used to get details from profile manager of specified ip-filter name
 *
 * @param filterId
 * @param intentTarget
 * @param nodeType
 *
 * @returns [{deviceConfigProfiles}]
 */
XponUtilities.prototype.getIpFiltersDetail = function (filterId, intentTarget, nodeType) {
    var deviceConfigProfileList = new ArrayList();
    var serviceInterfaceProfileVO = intentProfileInputFactory.createIntentProfileInputVO(filterId, "IHUB", "ip-filters");
    deviceConfigProfileList.add(serviceInterfaceProfileVO);
    if (nodeType.startsWith(intentConstants.LS_FX_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX;
    } else if (nodeType.startsWith(intentConstants.LS_MF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF;
    } else if (nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_SF;
    }
    var deviceConfigProfiles = apUtils.getSubSetOfUsedProfilesInJsonFormat(intentType, intentTarget, deviceConfigProfileList);
    return deviceConfigProfiles;
}

/**
 * Method used to get details from profile manager of specified ipv6-filter name
 *
 * @param filterId
 * @param intentTarget
 * @param nodeType
 *
 * @returns [{deviceConfigProfiles}]
 */
XponUtilities.prototype.getIPv6FiltersDetail = function (filterId, intentTarget, nodeType) {
    var deviceConfigProfileList = new ArrayList();
    var serviceInterfaceProfileVO = intentProfileInputFactory.createIntentProfileInputVO(filterId, "ISAM", "ipv6-filter-profile");
    deviceConfigProfileList.add(serviceInterfaceProfileVO);
    if (nodeType.startsWith(intentConstants.LS_FX_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX;
    } else if (nodeType.startsWith(intentConstants.LS_MF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF;
    } else if (nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_SF;
    }
    var deviceConfigProfiles = apUtils.getSubSetOfUsedProfilesInJsonFormat(intentType, intentTarget, deviceConfigProfileList);
    return deviceConfigProfiles;
}
