
load({ script: resourceProvider.getResource('internal/altiplano-intent-fwk.js'), name: 'altiplano-intent-fwk.js' });
load({ script: resourceProvider.getResource('internal/manager-specific/nv/slicing/slicing-utilities.js'), name: 'internal/manager-specific/nv/slicing/slicing-utilities.js' });
load({ script: resourceProvider.getResource('internal/xpon-utilities.js'), name: 'internal/xpon-utilities.js' });
load({ script: resourceProvider.getResource('internal/manager-specific/nv/createDevice/device-utilities.js'), name: 'internal/manager-specific/nv/createDevice/device-utilities.js' });

var internalResourcePrefix = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR;
var RuntimeException = Java.type('java.lang.RuntimeException');
var apfwk = new AltiplanoIntentHelper();
var intentLock = new apUtils.intentLockUtil();
var slicingUtils = new SlicingUtilities();
var xponUtils = new XponUtilities();
var deviceUtilities = new DeviceUtilities();

function buildRequestBody(input) {
	var resource = "reserveConfirmReleaseVlanRequest.json.ftl";
	var intentConfig = JSON.parse(input.getJsonIntentConfiguration());
    if(intentConfig && intentConfig[0] && intentConfig[0][intentConstants.LEAF_SPINE_MCAST_INFRA_INTENT_CONFIG]){
        var geaMcastConfig = intentConfig[0][intentConstants.LEAF_SPINE_MCAST_INFRA_INTENT_CONFIG];
        var cpName = geaMcastConfig["node-id"];
        var cVlan = geaMcastConfig['c-vlan-id'];
        var cpLeafLagLabel = geaMcastConfig['lag-description'];
        if(cpLeafLagLabel.contains("ETH")) {
            var lagLabelSplit = cpLeafLagLabel.split("ETH");
            cpLeafLagLabel = lagLabelSplit[0] + "ETH_" + lagLabelSplit[1];
        }

        var acIntentConfig = getAccessClusterIntentConfig(geaMcastConfig['node-id']);
        var spineNames = Object.keys(acIntentConfig['spine']);
        var accessLeafs = Object.keys(acIntentConfig['access-leaf']);
        var accessLeafNames = [];
        for (var accLeaf of accessLeafs) {
            if(acIntentConfig['access-leaf'][accLeaf] && acIntentConfig['access-leaf'][accLeaf]["expected-model-name"].contains("MF")) {
                accessLeafNames.push(accLeaf);
            }
        }
        var templateArgs = {
            "intentType": intentConstants.INTENT_TYPE_LEAF_SPINE_MCAST_INFRA,
            "intentTarget": input.getTarget(),
            "cVlan": cVlan,
            "spineNameList": spineNames,
            "accessLeafNames": accessLeafNames && accessLeafNames.length != 0 ? accessLeafNames : [],
            "cpName": cpName != "undefined" ? cpName : "",
            "cpLeafLagLabel": cpLeafLagLabel != "undefined" ? cpLeafLagLabel : ""
        };
        if (spineNames && (spineNames.length == 2 || spineNames.length == 4) && accessLeafNames && accessLeafNames.length != 0) {
            var requestBody = utilityService.processTemplate(resourceProvider.getResource(resource), templateArgs);
            return requestBody;
        } else {
            var requestBody = null;
            return requestBody;
        }  
    }
}

function reserveVlans(input) {
	var urlPath = "rest/api/vlan/reserve";
    var requestBody = buildRequestBody(input);
	if (requestBody != null) {
        var responseJson = apUtils.executeRestRequest(urlPath, "post", requestBody);
    }	
}

function confirmVlanReservation(input) {
	var urlPath = "rest/api/vlan/confirm";
    var requestBody = buildRequestBody(input);
	if (requestBody != null) {
        var responseJson = apUtils.executeRestRequest(urlPath, "post", requestBody);
    }
}

function releaseVlans(input) {
	var urlPath = "rest/api/vlan/release";
    var requestBody = buildRequestBody(input);
	if (requestBody != null) {
        var responseJson = apUtils.executeRestRequest(urlPath, "post", requestBody);
    }
}

function updateDeviceTopology(input) {
	var urlPath = "rest/api/vlan/topology/update";
    var requestBody = buildRequestBody(input);
	if (requestBody != null) {
        var responseJson = apUtils.executeRestRequest(urlPath, "post", requestBody);
    }
}

function getAccessClusterConfigFromES(resourceFile, args, isGettingAcConfig) {
    var jsonTemplate = utilityService.processTemplate(resourceProvider.getResource(resourceFile), args ? args : {});
    var response = apUtils.executeEsIntentSearchRequest(jsonTemplate);
    if (apUtils.isResponseContainsData(response)) {
        if(isGettingAcConfig)
            return response.hits.hits[0]["_source"]['configuration'];
        else 
            return response
    }
    return null;
}

function suggestUserServiceProfileNames(valueProviderContext) {
    var serviceProfiles = [];
    var inputValues = valueProviderContext.getInputValues();
    var l2NetworkIntentVersion;
    var cpName;
    var childIntents = valueProviderContext.getChildIntents();
    for (let childIntent of childIntents) {
        if (childIntent["intentType"] == 'l2-network') {
            l2NetworkIntentVersion = childIntent['intentTypeVersion'];
        }
    }
    var args = inputValues["arguments"]['intent-specific-data'];
    if (args && args[intentConstants.LEAF_SPINE_MCAST_INFRA]) {
        cpName = args[intentConstants.LEAF_SPINE_MCAST_INFRA][0]['node-id'];
        if(cpName){
            var nodeType = apUtils.getNodeTypefromEsAndMds(cpName);
            var allProfiles = apUtils.getParsedProfileDetailsFromProfMgr(cpName, nodeType, intentConstants.INTENT_TYPE_L2_NETWORK, [], l2NetworkIntentVersion);
            if (allProfiles && allProfiles[profileConstants.NETWORK_SERVICE_PROFILE_LS_ETHERNET.subType] && allProfiles[profileConstants.NETWORK_SERVICE_PROFILE_LS_ETHERNET.subType][profileConstants.NETWORK_SERVICE_PROFILE_LS_ETHERNET.profileType]) {
                var ethUplinkUserProfiles = allProfiles[profileConstants.NETWORK_SERVICE_PROFILE_LS_ETHERNET.subType][profileConstants.NETWORK_SERVICE_PROFILE_LS_ETHERNET.profileType];
                for (var userProfile of ethUplinkUserProfiles) {
                    serviceProfiles.push(userProfile["name"]);
                }
            }
        }
    }
    return apUtils.convertToSuggestReturnFormat(serviceProfiles, valueProviderContext.getSearchQuery());
}

function suggestCpLeafName(valueProviderContext) {
    var cpLeaveName = [];
    var response = getAccessClusterConfigFromES(internalResourcePrefix + "esQueryDeviceFxIsPartOfComposite.json.ftl");
    if (response) {
        response.hits.hits.forEach(function (intentResult) {
            var partOfCompositeArr = intentResult["_source"]["part-of-composite"];
            if (partOfCompositeArr && partOfCompositeArr.length > 0)
                cpLeaveName.push(intentResult["_source"]["target"]["raw"]);
        });
    }
    return apUtils.convertToSuggestReturnFormat(cpLeaveName, valueProviderContext.getSearchQuery());
}

function validate(input) {
    var validateContext = {};
	apUtils.validate(input, validateCallback, validateContext);
    var validateResultObj = new ValidateResult();
    validateResultObj.setIntentProfileVOs(getDependencyProfiles(input, validateContext));
    return validateResultObj;
}

function validateCallback(input, contextualErrorJsonObj, validateContext){
    apUtils.setRestClientForVlanIdManager();
    reserveVlans(input);
	var networkState = input.getNetworkState().name();
	if(networkState !== intentConstants.NETWORK_STATE_DELETE && networkState !== intentConstants.NETWORK_STATE_SUSPEND){
		validateAcIsExisting(input,contextualErrorJsonObj,validateContext);
        validateDeviceMfHasBoard(input,contextualErrorJsonObj,validateContext);
	}
};

function validateDeviceMfHasBoard(input,contextualErrorJsonObj,validateContext) {
    var intentConfig = JSON.parse(input.getJsonIntentConfiguration());
    if(intentConfig && intentConfig[0] && intentConfig[0][intentConstants.LEAF_SPINE_MCAST_INFRA_INTENT_CONFIG]){
        var geaMcastConfig = intentConfig[0][intentConstants.LEAF_SPINE_MCAST_INFRA_INTENT_CONFIG];
        var acIntentConfig = getAccessClusterIntentConfig(geaMcastConfig['node-id']);
        var acAccessLeafKeys = Object.keys(acIntentConfig['access-leaf']);
        var response = executeEsQuery(internalResourcePrefix + "esQueryDeviceMfConfiguration.json.ftl", {acAccessLeafKeys:acAccessLeafKeys});
        if (apUtils.isResponseContainsData(response)) {
            response.hits.hits.forEach(function (intentResult) {
                if(!intentResult["_source"]["configuration"] || !intentResult["_source"]["configuration"]["slot-name"]){
                    contextualErrorJsonObj['access-leaf'] = "'" + intentResult["_source"]["target"]["raw"] + "' has no LT Board configuration";
                }
            });
        }
    }
}

function validateAcIsExisting(input,contextualErrorJsonObj,validateContext) {
    var cpNameRegx = /<node-id>(.*)<\/node-id>/;
    var cpName =  cpNameRegx.exec(input.getEncryptedIntentConfiguration())? cpNameRegx.exec(input.getEncryptedIntentConfiguration())[1] : "";
    var acIntentConfig = getAccessClusterConfigFromES(internalResourcePrefix + "esQueryTargetNamesBasedOnClusterName.json.ftl", {"cpName":cpName}, true);
    if(!acIntentConfig){
        contextualErrorJsonObj['node-id'] = "'" + cpName + "' is not managed by any 'leaf-spine-network' composite intents";
    }
}

function postCreate(input) {
	confirmVlanReservation(input);
}

function postUpdate(input) {
	confirmVlanReservation(input);
}

function postSynchronize(input){
    try{
        apUtils.setRestClientForVlanIdManager();
	    updateDeviceTopology(input);
        if(!input.getCurrentTopology()) return null;
        var topology = input.getCurrentTopology();
        var topoDependencies = topology.getDependencyInfo();
        var newTopoIntentDependencies = new ArrayList();
        topoDependencies.forEach(function (intentTopologyVO){
            if(intentTopologyVO.getDependencyIntentType() != intentConstants.INTENT_TYPE_MCAST_INFRA){
                newTopoIntentDependencies.add(intentTopologyVO);
            }
        });
        topology.setDependencyInfo(newTopoIntentDependencies);   
        var result = apUtils.setTopologyForDynamicCompositeIntent(topology);
        var networkState = input.getNetworkState().name();
        if (networkState != intentConstants.NETWORK_STATE_DELETE) {
            var dependencyProfileSet = getDependencyProfiles(input, {});
            if (dependencyProfileSet && dependencyProfileSet.size() > 0) {
                result.setIntentProfiles(dependencyProfileSet);
            }
        }
        return result;
    } catch(e){
        var result = synchronizeResultFactory.createSynchronizeResult();
		result.setSuccess(false);
		result.setErrorCode("100");
        result.setErrorDetail(e);
		return result;
    }
}

function onDelete(input) {
    apUtils.setRestClientForVlanIdManager();
    releaseVlans(input);
}

function suggestNniIds(valueProviderContext){
    var inputValues = valueProviderContext.getInputValues();
    var target = inputValues.get("target");
    var currentDeviceName = inputValues.get("arguments").get("intent-specific-data").get(intentConstants.LEAF_SPINE_MCAST_INFRA)[0].get("node-id");
    var nniList = inputValues.get("arguments").get("intent-specific-data").get(intentConstants.LEAF_SPINE_MCAST_INFRA)[0].get("lag-description");
    var nniIds = [];
    var deviceType = apUtils.getNodeTypefromEsAndMds(currentDeviceName);
    var ethConnectionInstances = [];
    var responseEthernet = apUtils.executeEsQueryByIntentType(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "getEthConnIntents.json.ftl", {"deviceName": currentDeviceName}, intentConstants.INTENT_TYPE_ETHERNET_CONNECTION);
    if (apUtils.isResponseContainsData(responseEthernet)) {
        responseEthernet.hits.hits.forEach(function (intentResult) {
            var ethConnectionInstance = intentResult["_source"]["target"]["raw"];
            ethConnectionInstances.push(ethConnectionInstance);
        });
        var ethuplinkPorts = ethConnectionLagDetails(ethConnectionInstances, deviceType);
        if (ethuplinkPorts) {
            for (var index in ethuplinkPorts) {
                if (nniIds.indexOf(ethuplinkPorts[index]) < 0) {
                    nniIds.push(ethuplinkPorts[index]);
                }
            }
        }
    }
    return nniIds;
}

var ethConnectionLagDetails = function (ethConnectionInstances, nodeType) {
    var ethConnections = [];
    ethConnectionInstances.forEach(function (ethConnectionInstance) {
        var ethConnectionIntentConfiguration = {};
        var ethConnectionIntent = apUtils.getIntent(intentConstants.INTENT_TYPE_ETHERNET_CONNECTION, ethConnectionInstance);
        if (!ethConnectionIntent) {
            throw new RuntimeException("Intent not present with target '" + ethConnectionInstance + "' of intent type '" + intentConstants.INTENT_TYPE_ETHERNET_CONNECTION + "'");
        }
        apUtils.convertIntentConfigXmlToJson(ethConnectionIntent.getIntentConfig(), ethListKeyFunction, ethConnectionIntentConfiguration);
        if (ethConnectionIntentConfiguration["eth-lt-ports"]) {
            var ethLtPorts = ethConnectionIntentConfiguration["eth-lt-ports"];
            var lags = loadLagProfileOfEthernetConnIntent(ethConnectionInstance, nodeType);
            for (var i in ethLtPorts) {
                var ethLagId = ethLtPorts[i]["agg-system-name"];
                var ethConnection;
                if (ethLagId) {
                    var ethLtId = ethLtPorts[i]["port-id"].split(".")[0];
                    var lagObject = getLagObjectFromLagName(lags, ethLagId);
                    if (lagObject != null) {
                        ethLagId = lagObject["lag-id"];
                    }
                    ethConnection = ethLtId + "." + ethLagId;
                } else {
                    ethConnection = ethLtPorts[i]["port-id"];
                }
                ethConnections.push(ethConnection);
            }
        }
    });
    return ethConnections;
}

function loadLagProfileOfEthernetConnIntent(ethConnTarget, nodeType) {
    var ethConnIntentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_ETHERNET_CONNECTION, ethConnTarget);
    var lagJson;
    var hwTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
    var ethConnProfileList = new ArrayList();
    var ethConnProfileVO = intentProfileInputFactory.createIntentProfileInputVO(null,profileConstants.LINK_AGGREGATION_GROUP_PROFILE_LS_Ethernet.subType, profileConstants.LINK_AGGREGATION_GROUP_PROFILE_LS_Ethernet.profileType);
    ethConnProfileList.add(ethConnProfileVO);
    var allProfiles = loadSpecificProfiles(intentConstants.INTENT_TYPE_ETHERNET_CONNECTION, ethConnIntentVersion, hwTypeAndRelease.release, ethConnProfileList, hwTypeAndRelease.hwType);
    if (allProfiles && allProfiles["link-aggregation-group-profile"] && allProfiles["link-aggregation-group-profile"]["LS-Ethernet"]) {
        lagJson = allProfiles["link-aggregation-group-profile"]["LS-Ethernet"];
    }
    return lagJson;
}

function loadSpecificProfiles(intentType, intentVersion, deviceRelease, profileDetails, hardwareType) {
    return apUtils.getSpecificProfilesInJsonFormat(intentType, intentVersion, deviceRelease, hardwareType, profileDetails);
}

function getLagObjectFromLagName(lags, lagName) {
    for (var i = 0; i < lags.length; i++) {
        if (lags[i]["name"] === lagName) {
            return lags[i];
        }
    }
    return null;
}

function ethListKeyFunction(listName) {
    switch (listName) {
        case "eth-lt-ports":
            return "port-id";
        default:
            return null;
    }
}

function executeEsQuery(resourceFile, args) {
    var jsonTemplate = utilityService.processTemplate(resourceProvider.getResource(resourceFile), args);
    return apUtils.executeEsIntentSearchRequest(jsonTemplate);
}

function getChildIntentRealizations(childIntentRealizationInput){
    var childIntentRealizations = new ArrayList();
    var cpChildIntentType = [intentConstants.INTENT_TYPE_L2_INFRA, intentConstants.INTENT_TYPE_L2_NETWORK, intentConstants.INTENT_TYPE_MCAST_INFRA];
    var intentConfig = JSON.parse(childIntentRealizationInput.getCompositeIntentConfigurationJson());
    var serviceName = childIntentRealizationInput.getCompositeTarget();
    var geaMcastConfig = intentConfig[0][intentConstants.LEAF_SPINE_MCAST_INFRA_INTENT_CONFIG];
    geaMcastConfig["service-name"] = serviceName;
    var networkState = childIntentRealizationInput.getNetworkState().name();

    var acIntentConfig = getAccessClusterIntentConfig(geaMcastConfig['node-id']);
    var acAccessLeafKeys = Object.keys(acIntentConfig['access-leaf']);
    var acSpineKeys = Object.keys(acIntentConfig['spine']);
    geaMcastConfig.smcastPorts = {};
    
    for(var spine of acSpineKeys){
        geaMcastConfig.smcastPorts[spine] = getEthernetConnectionIntentConfig(spine, acIntentConfig);
        if(geaMcastConfig.smcastPorts[spine] && geaMcastConfig.smcastPorts[spine]["accessPorts"] && geaMcastConfig.smcastPorts[spine]["accessPorts"].length > 0){
            var childIntentTargetName = spine + "#" + serviceName;
            getChildIntentRealization(intentConstants.INTENT_TYPE_SPINE_MCAST, childIntentTargetName, geaMcastConfig, acIntentConfig, childIntentRealizations, networkState, childIntentRealizationInput);
        }
    }
    logger.info("IBNLOGGER: geaMcastConfig.smcastPorts {}", JSON.stringify(geaMcastConfig.smcastPorts));
    for(var accessLeaf of acAccessLeafKeys){
        if(acIntentConfig['access-leaf'][accessLeaf] && acIntentConfig['access-leaf'][accessLeaf]["expected-model-name"].indexOf("IXR") == -1){
            var childIntentTargetName = accessLeaf + "#" + serviceName;
            getChildIntentRealization(intentConstants.INTENT_TYPE_L2_INFRA, childIntentTargetName, geaMcastConfig, acIntentConfig, childIntentRealizations, networkState, childIntentRealizationInput);
            getChildIntentRealization(intentConstants.INTENT_TYPE_MCAST_INFRA, childIntentTargetName, geaMcastConfig, acIntentConfig, childIntentRealizations, networkState, childIntentRealizationInput);
        }
    }
    
    for(let i = 0; i<cpChildIntentType.length; i++){
        var childIntentTargetName = geaMcastConfig['node-id'] + "#" + serviceName;
        getChildIntentRealization(cpChildIntentType[i], childIntentTargetName, geaMcastConfig, acIntentConfig, childIntentRealizations, networkState, childIntentRealizationInput);
    }
    logger.info("IBNLOGGER: childIntentRealizations {}", childIntentRealizations);
    return childIntentRealizations;
}

function getAccessClusterIntentConfig(nodeId){
    var acName;
    var response = getAccessClusterConfigFromES(internalResourcePrefix + "esQueryTargetNamesBasedOnClusterName.json.ftl", {"cpName":nodeId});
    if (apUtils.isResponseContainsData(response)) {
        acName = response.hits.hits[0]["_source"]['target']['cluster-name'];
    }
    var intentConfigArgs = {};
    var getKeyForList = function (listName) {
        switch (listName) {
            case "spine":
                return ["node-id"];
            case "access-leaf":
                return ["node-id"];
            case "network-leaf":
                return ["node-id"];
            case "label":
                return ["category", "value"];
            default:
                return null;
        }
    };
    
    var acIntentConfig = apUtils.getIntent("leaf-spine-network", acName);
    apUtils.convertIntentConfigXmlToJson(acIntentConfig.getIntentConfig(), getKeyForList, intentConfigArgs);
    return intentConfigArgs;
}

function getChildIntentRealization(childIntentType, childIntentTargetName, geaMcastConfig, acIntentConfig, childIntentRealizations, networkState, childIntentRealizationInput){
    networkState = childIntentType === intentConstants.INTENT_TYPE_MCAST_INFRA && networkState === intentConstants.NETWORK_STATE_SUSPEND? intentConstants.NETWORK_STATE_ACTIVE : networkState;
    var childIntentInfo = {
        intentType: childIntentType,
        version: getchildIntentVersion(childIntentType),
        target: childIntentTargetName,
        configXml: getChildIntentConfigXml(childIntentType, childIntentTargetName, geaMcastConfig, acIntentConfig, childIntentRealizationInput),
        allowDirectModification: false,
        dependsOnInstance: getDependsOnInstance(childIntentType, childIntentTargetName),
        networkState: networkState
    };
    var childIntentRealization = apUtils.getChildIntentRealizationResult(childIntentInfo);
    childIntentRealizations.add(childIntentRealization);
    return childIntentRealizations;
}

function getProfileByProfileTypeAndSubType(intentType, intentVersion, profileType, profileSubType){
    var allProfiles = {};
    var profileSet = apUtils.getAssociatedProfilesWithConfig(intentType, intentVersion, profileType, profileSubType, "any", null, null);

    profileSet.forEach(function (profileEntity) {
        var profType = profileEntity.getProfileType();
        if(profType === profileType){
            var profAttr = JSON.parse(profileEntity.getProfileConfigJSON());
            var profkey = profType + ":" + profType;
            var profDetail = profAttr[profkey];
            profDetail["name"] = profileEntity.getName();
            if(!allProfiles[profType]){
                allProfiles[profType] = [];
            }
            allProfiles[profType].push(profDetail);
        }
    });
    return allProfiles;
}

function getchildIntentVersion(childIntentType){
    var childIntentDefinition = JSON.parse(resourceProvider.getResource("childIntentDefinitions.json"));
    var childIntentVersion = "";
    if(childIntentType === intentConstants.INTENT_TYPE_L2_INFRA) childIntentVersion = childIntentDefinition[intentConstants.INTENT_TYPE_L2_INFRA];
    else if (childIntentType === intentConstants.INTENT_TYPE_L2_NETWORK) childIntentVersion = childIntentDefinition[intentConstants.INTENT_TYPE_L2_NETWORK];
    else if (childIntentType === intentConstants.INTENT_TYPE_MCAST_INFRA) childIntentVersion = childIntentDefinition[intentConstants.INTENT_TYPE_MCAST_INFRA];
    else childIntentVersion = childIntentDefinition[intentConstants.INTENT_TYPE_SPINE_MCAST];

    return childIntentVersion;
}

function getDependsOnInstance(childIntentType, childIntentTargetName){
    var dependencyInfo = [];
    if(childIntentType === intentConstants.INTENT_TYPE_L2_NETWORK || childIntentType === intentConstants.INTENT_TYPE_MCAST_INFRA){
        dependencyInfo.push({
            intentType: intentConstants.INTENT_TYPE_L2_INFRA,
            target: childIntentTargetName,
            intentTypeVersion: getchildIntentVersion(intentConstants.INTENT_TYPE_L2_INFRA)
        });
    }
    return dependencyInfo;
}

function getChildIntentConfigXml(childIntentType, childIntentTargetName, geaMcastConfig, acIntentConfig, childIntentRealizationInput){
    var filePath = getChildIntentXmlFilePath(childIntentType);
    var templateArgs = getChildIntentTemplateArgs(childIntentType, childIntentTargetName, geaMcastConfig, acIntentConfig, childIntentRealizationInput);
    var xmlConfig = utilityService.processTemplate(resourceProvider.getResource(filePath), templateArgs);
    return xmlConfig;
}

function getChildIntentXmlFilePath(childIntentType){
    var fileName = "";
    switch (childIntentType) {
        case intentConstants.INTENT_TYPE_L2_INFRA:
            fileName = "l2InfraXmlConfig.xml.ftl";
            break;
        case intentConstants.INTENT_TYPE_L2_NETWORK:
            fileName = "l2NetworkXmlConfig.xml.ftl";
            break;
        case intentConstants.INTENT_TYPE_MCAST_INFRA:
            fileName = "mcastInfraXmlConfig.xml.ftl";
            break;
        case intentConstants.INTENT_TYPE_SPINE_MCAST:
            fileName = "spineMcastXmlConfig.xml.ftl";
            break;
        default:
            logger.debug("childIntentType is not match!");
            break;
    }
    return internalResourcePrefix.concat(fileName);
}

function getClusterTrafficProfile(profileName, target){
    var expectedProfile = "";
    var intentTypeVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_LEAF_SPINE_MCAST_INFRA, target);
    var clusterTrafficProfile = getProfileByProfileTypeAndSubType(intentConstants.INTENT_TYPE_LEAF_SPINE_MCAST_INFRA, intentTypeVersion, profileConstants.CLUSTER_TRAFFIC_PROFILE.profileType, profileConstants.CLUSTER_TRAFFIC_PROFILE.subType);
    if(clusterTrafficProfile && clusterTrafficProfile[profileConstants.CLUSTER_TRAFFIC_PROFILE.profileType]){
        clusterTrafficProfile[profileConstants.CLUSTER_TRAFFIC_PROFILE.profileType].forEach(function (profile){
            if(profile.name === profileName) expectedProfile = profile;
        })
    }
    if(expectedProfile === "") throw new RuntimeException("'cluster-traffic-profile' is not found");
    return expectedProfile
}

function getNniIdsFromUplinkConnection(deviceName){
    var nniIds = [];
    var uplinkNniIds = apUtils.getNniIdsFromUplinkConnection(deviceName);
    if(uplinkNniIds && uplinkNniIds.length > 0){
        for(uplinkNniId of uplinkNniIds){
            nniIds.push(uplinkNniId.split("-")[0] + "-" + uplinkNniId.split("-")[1]);
        }
    }
    return nniIds;
}

function getMfDeviceFromAccessLeafs(accLeafConfig){
    var mfDevices = []
    var accessLeafKeys = Object.keys(accLeafConfig);
    for(let accessLeafKey of accessLeafKeys){
        var accessLeafConfig = accLeafConfig[accessLeafKey];
        if(accessLeafConfig && accessLeafConfig["expected-model-name"] && accessLeafConfig["expected-model-name"].indexOf("MF") != -1){
            mfDevices.push(accessLeafKey);
        }
    }
    return mfDevices
}

function getEthernetConnectionIntentConfig(deviceName, acIntentConfig){
    var accEthConnPrefix = "acc-eth-conn-";
    var cpEthConnPrefix = "cp-eth-conn-";
    var ports = {
        "cpPorts": [],
        "accessPorts": []
    }

    var mfDevices = getMfDeviceFromAccessLeafs(acIntentConfig["access-leaf"]);
    var jsonTemplate = utilityService.processTemplate(resourceProvider.getResource(internalResourcePrefix + "getEthConnIntentsByDeviceName.json.ftl"), {"deviceName":deviceName});
    var responseEthernet = apUtils.executeEsIntentSearchRequest(jsonTemplate);

    if (apUtils.isResponseContainsData(responseEthernet)) {
        responseEthernet.hits.hits.forEach(function (intentResult) {
            if(intentResult["_source"]["part-of-composite"].length > 0){
                var lagDescriptionName = intentResult["_source"]["configuration"]["lag-description"][0];
                var connectionNameList = intentResult["_source"]["target"]["connection-name"];
                if(mfDevices.indexOf(lagDescriptionName) !== -1 && connectionNameList.indexOf(accEthConnPrefix) != -1){
                    intentResult["_source"]["configuration"]["agg-system-name"].forEach(function (lagName) {
                        ports["accessPorts"].push(lagName.split("-")[0] + "-" + lagName.split("-")[1]);
                    })
                } else if (mfDevices.indexOf(lagDescriptionName) == -1 && connectionNameList.indexOf(cpEthConnPrefix) != -1){
                    intentResult["_source"]["configuration"]["agg-system-name"].forEach(function (lagName) {
                        ports["cpPorts"].push(lagName.split("-")[0] + "-" + lagName.split("-")[1]);
                    })
                }
            }
        });
    }
    logger.info("IBNLOGGER: getEthernetConnectionIntentConfig {}", JSON.stringify(ports));
    return ports;
}

function getChildIntentTemplateArgs(childIntentType, childIntentTargetName, geaMcastConfig, acIntentConfig, childIntentRealizationInput){
    var templateArgs = {};
    templateArgs.target = childIntentTargetName;
    templateArgs.intentTypeVersion = getchildIntentVersion(childIntentType);

    var clusterTrafficProfile = getClusterTrafficProfile("default", childIntentRealizationInput.getCompositeTarget());
    var clusterTrafficMulticast = clusterTrafficProfile["multicast"];
    if(childIntentType === intentConstants.INTENT_TYPE_L2_INFRA){
        templateArgs.nniIds = getNniIdsFromUplinkConnection(templateArgs.target.split("#")[0]);
        templateArgs.vlanMode = "multicast-vpn";
        templateArgs.cVlanId = geaMcastConfig['c-vlan-id'];

        if(geaMcastConfig['node-id'] === childIntentTargetName.split("#")[0]){
            templateArgs.forwarderProfile = clusterTrafficMulticast["forwarder-profile"]["network-profile"];
            templateArgs.serviceProfile = clusterTrafficMulticast["network-service-profile"]["network-profile"];
        } else {
            templateArgs.forwarderProfile = clusterTrafficMulticast["forwarder-profile"]["access-profile"];
            templateArgs.serviceProfile = clusterTrafficMulticast["network-service-profile"]["access-profile"];
        }
    } else if(childIntentType === intentConstants.INTENT_TYPE_L2_NETWORK){
        templateArgs.nniId = geaMcastConfig['lag-description'];
        templateArgs.l2InfraName = geaMcastConfig['service-name'];
        templateArgs.networkServiceProfile = geaMcastConfig['service-profile'];

    } else if(childIntentType === intentConstants.INTENT_TYPE_MCAST_INFRA){
        templateArgs.querySourceIpAddress = clusterTrafficMulticast["query-source-ip-address"];
        templateArgs.reportSourceIpAddress = clusterTrafficMulticast["report-source-ip-address"];
        templateArgs.channelGroups = clusterTrafficMulticast["channel-groups"];
        templateArgs.l2InfraName = geaMcastConfig['service-name'];
        if(geaMcastConfig['node-id'] === childIntentTargetName.split("#")[0])
            templateArgs.mcastProfile = clusterTrafficMulticast["multicast-network-service-profile"]["network-profile"];
        else
            templateArgs.mcastProfile = clusterTrafficMulticast["multicast-network-service-profile"]["access-profile"];

    } else {
        templateArgs.mcastProfile = clusterTrafficMulticast["multicast-network-service-profile"]["spine-profile"];
        templateArgs.cVlanId = geaMcastConfig['c-vlan-id'];
        templateArgs.cpPorts = geaMcastConfig.smcastPorts[templateArgs.target.split("#")[0]].cpPorts;
        templateArgs.accessPorts = geaMcastConfig.smcastPorts[templateArgs.target.split("#")[0]].accessPorts;
    }

    return templateArgs;
}

function getProfileDetails(profileName, profileType, subType, intentType, intentTypeVersion ){
	var intentProfileInputVos = new ArrayList();
	var intentProfileInputVo = apUtils.createIntentProfileInputVo(profileType, subType, profileName);
	intentProfileInputVos.add(intentProfileInputVo);
	var profileConfigJSON = apUtils.getSpecificProfilesInJsonFormat(intentType, intentTypeVersion, null, null, intentProfileInputVos)
	if(profileConfigJSON[profileType]){
		for(var profile of  profileConfigJSON[profileType][subType]){
			if(profile["name"] == profileName){
				return profile;
			}
		}
	}
	return null;
}

function addProfileToList(profileName, profileType, profileSubType, profileObjList) {
	profileObjList.push({
		profileName: profileName.name,
		profileType: profileType,
		profileSubType: profileSubType,
		profileDependency: profileConstants.DEPENDENCY_TYPE.low,
		baseRelease: profileName.baseRelease,
		version: profileName.profileVersion
	});
	return profileObjList;
}

function getDependencyProfiles(input, customContext) {
	var target = input.getTarget();
	var intentTypeVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_LEAF_SPINE_MCAST_INFRA, target);
	var profileObjList = [];
	var clusterTrafficDetails = getProfileDetails("default", profileConstants.CLUSTER_TRAFFIC_PROFILE.profileType, profileConstants.CLUSTER_TRAFFIC_PROFILE.subType, intentConstants.INTENT_TYPE_LEAF_SPINE_MCAST_INFRA, intentTypeVersion);	
	profileObjList = addProfileToList(clusterTrafficDetails, profileConstants.CLUSTER_TRAFFIC_PROFILE.profileType, profileConstants.CLUSTER_TRAFFIC_PROFILE.subType, profileObjList);
    var dependentProfilesList = apUtils.getDependentProfileList(profileObjList);
    return apUtils.getObjectSet(dependentProfilesList);
}

function migrateFromV2ToV3 (migrationInput) {
	var xslt = resourceProvider.getResource("copy-xml.xslt");
    return utilityService.transformXml(migrationInput.getIntentConfiguration(), xslt);
}

function rollBackToV2 (migrationInput) {
    var xslt = resourceProvider.getResource("copy-xml.xslt");
    return utilityService.transformXml(migrationInput.getIntentConfiguration(), xslt);
}