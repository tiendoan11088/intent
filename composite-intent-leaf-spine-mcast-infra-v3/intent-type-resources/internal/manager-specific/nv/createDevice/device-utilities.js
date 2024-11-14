/**
 * (c) 2020 Nokia. All Rights Reserved.
 *
 * INTERNAL - DO NOT COPY / EDIT
 **/
 function DeviceUtilities() {
}

/**
 * Returns the list of a specific element  from a resource ftl
 *
 * @param resourceName
 * @param requestTemplateArgs
 * @returns {*}
 */
DeviceUtilities.prototype.retrieveElementsData = function (resourceName, requestTemplateArgs, xpathOuter, xpathInner, nameSpaceMap) {
    var elementFromResponse = apUtils.getExtractedNodeFromResponse(resourceName, requestTemplateArgs, xpathOuter, nameSpaceMap);
    if (null != elementFromResponse) {
        var elementsData = apUtils.getAttributeValues(elementFromResponse, xpathInner, nameSpaceMap);
        return elementsData;
    }
    return null;
};

/**
 * Returns the list of deployed hardware types for the family provided in request in Altiplano
 *
 * @param resourceName
 * @param requestTemplateArgs
 * @returns {*}
 */
DeviceUtilities.prototype.retrieveNAVHardwareTypes = function (resourceName, requestTemplateArgs) {
    var xpathOuter = "/nc:rpc-reply/nc:data/anv:device-manager/plug:device-plugs";
    var xpathInner = "/nc:rpc-reply/nc:data/anv:device-manager/plug:device-plugs/plug:device-plug/plug:hardware-type";
    return this.retrieveElementsData(resourceName, requestTemplateArgs, xpathOuter, xpathInner, apUtils.prefixToNsMap);
};


/**
 * Returns the list of deployed hardware types for the family provided in request in Altiplano
 *
 * @param resourceName
 * @param valueProviderContext
 * @returns {*}
 */
DeviceUtilities.prototype.getNAVHardwareTypes = function (resourceName, valueProviderContext) {
    var inputValues = valueProviderContext.getInputValues();
    var inputArguments = inputValues.get("arguments");

    var deviceManager = inputArguments.get("device-manager");

    var requestTemplateArgs = {
        managerName: deviceManager
    };

    var hardwareTypeData = this.retrieveNAVHardwareTypes(resourceName, requestTemplateArgs);
    return hardwareTypeData;
};

/**
 * Returns the list of deployed hardware types for the family provided in request in Altiplano
 *
 * @param familyType
 * @returns {*}
 */
DeviceUtilities.prototype.getNCYHardwareTypes = function (familyType) {
    var hardwareTypeData = [];
    var hardwareTypeArrList = mds.getAllHardwareTypes(familyType);
    hardwareTypeArrList.forEach (function (value) {
        hardwareTypeData.push(value);
    });
    return hardwareTypeData;
};

/**
 * Validating NAV Hardware Type
 *
 * @param syncInput
 * @param intentConfigJson
 * @param contextualErrorJsonObj
 * @param requestXml
 */
DeviceUtilities.prototype.validateNAVPlugDetails = function (syncInput, intentConfigJson, contextualErrorJsonObj, resourceName, noValidationDeviceTemplate) {
    // Validate valid hardware-type or not
    var deviceHardwareType = intentConfigJson["hardware-type"];
    var managerName = intentConfigJson["device-manager"];
    var requestTemplateArgs = {
        managerName: managerName,
        hardwareType: deviceHardwareType,
        interfaceVersion: intentConfigJson["device-version"]
    };

    var xpath = "/nc:rpc-reply/nc:data/anv:device-manager";
    var node = apUtils.getExtractedNodeFromResponse(resourceName, requestTemplateArgs, xpath, apUtils.prefixToNsMap);
    xpath = "plug:device-plugs/plug:device-plug/plug:hardware-type";
    this.validatePlugDetails(node, xpath, contextualErrorJsonObj, intentConfigJson, "hardware-type");

    // Validate interface version
    if(!contextualErrorJsonObj["hardware-type"]) {
        xpath = "plug:device-plugs/plug:device-plug/plug:interface-version";
        this.validatePlugDetails(node, xpath, contextualErrorJsonObj, intentConfigJson, "device-version");
    }
    // Validate template

    if(!contextualErrorJsonObj["hardware-type"] && !contextualErrorJsonObj["device-version"] && !noValidationDeviceTemplate) {
        xpath= "conftpl:configuration-templates/conftpl:configuration-template/conftpl:name";
        this.validatePlugDetails(node, xpath, contextualErrorJsonObj, intentConfigJson, "device-template");
    }
};

/**
 * Validating NCY Hardware Type and Version
 *
 * @param intentConfigArgs
 * @param contextualErrorJsonObj
 */
DeviceUtilities.prototype.validateNCYHardwareTypeAndVersion = function (intentConfigArgs, contextualErrorJsonObj) {
    var hardwareType = intentConfigArgs["hardware-type"];
    var hardwareVersion = intentConfigArgs["device-version"];
    if (!hardwareType && !hardwareVersion) {
        hardwareType = intentConfigArgs["application-service-type"];
        hardwareVersion = intentConfigArgs["application-version"];
    }
    // Validating Hardware Type
    var hwType = mds.getAllHardwareTypes(hardwareType);
    var hwTypeFound = apUtils.findAndMatchString(hwType, hardwareType);
    if (!hwTypeFound) {
        throw new RuntimeException("Hardware type: " + hardwareType + " does not exist");
    }

    // Validating Hardware Version
    if (hwTypeFound) {
        var versions = mds.getAllInterfaceVersionByHardwareType(hardwareType);
        var versionFound = apUtils.findAndMatchString(versions, hardwareVersion);
        if (!versionFound) {
            throw new RuntimeException("Device version: " + hardwareVersion + " does not exist");
        }
    }
}

/**
 * Returns the list of supported interface versions for the provided hardware type
 *
 * @param resourceName
 * @param requestTemplateArgs
 * @returns {*}
 */
DeviceUtilities.prototype.retrieveNAVInterfaceVersions = function (resourceName, requestTemplateArgs) {
    var xpathOuter = "/nc:rpc-reply/nc:data/anv:device-manager/plug:device-plugs";
    var xpathInner = "/nc:rpc-reply/nc:data/anv:device-manager/plug:device-plugs/plug:device-plug/plug:interface-version";
    return this.retrieveElementsData(resourceName, requestTemplateArgs, xpathOuter, xpathInner, apUtils.prefixToNsMap);
};

/**
 * Returns the list of supported interface versions for the provided hardware type
 *
 * @param resourceName
 * @param valueProviderContext
 * @param isLT
 * @param checkNTtype
 * @returns {*}
 */
DeviceUtilities.prototype.getNAVInterfaceVersionsForBoard = function (resourceName, valueProviderContext, intentType) {
    var inputValues = valueProviderContext.getInputValues();
    var inputArguments = inputValues.get("arguments");

    var deviceManager = inputArguments.get("device-manager");
    var hardwareType = inputArguments.get("hardware-type");

    var boards = inputValues.currentListValue;
    var slotName = boards[0]["slot-name"];
    if (slotName.startsWith(intentConstants.LT_STRING)) {
        var boardServiProfile = boards[0]["board-service-profile"];
        var plannedType = boards[0]["planned-type"];
        if (intentType == intentConstants.INTENT_TYPE_DEVICE_FX) {
            hardwareType = intentConstants.LS_FX_PREFIX + "-" + plannedType;
            var deviceVersion = inputArguments.get("device-version");
            var hwType = inputArguments.get("hardware-type");
            var isEthBoard = false;
            var portType = apCapUtils.getCapabilityValue(hwType, deviceVersion, capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, plannedType, []);
            if (portType && portType.length > 0 && portType.indexOf(capabilityConstants.ETHERNET_ALIAS) >= 0) {
                isEthBoard = true;
            }
            if(isEthBoard){
                var deviceDetails = {};
                deviceDetails["useProfileManager"] = true;
                deviceDetails["deviceName"] = inputValues.target;
                deviceDetails["nodeType"] = hwType + "-" + deviceVersion;
                deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
                deviceDetails["intentTypeVersion"] = valueProviderContext.getIntentTypeVersion();
                deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);
                var boardServiceProfile = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", boardServiProfile, deviceDetails);
                if(boardServiceProfile["model"] === "uplink-mode"){
                    hardwareType = hardwareType + "-" + intentConstants.UP_LINK_HW_TYPE_POSTFIX;
                }else if(boardServiceProfile["model"] === "downlink-mode"){
                    hardwareType = hardwareType + "-" + intentConstants.DOWN_LINK_HW_TYPE_POSTFIX;
                }
            }
        }
        else if (intentType == intentConstants.INTENT_TYPE_DEVICE_MF) {
            hardwareType = intentConstants.LS_MF_PREFIX + "-" + plannedType;
        }
    }

    var requestTemplateArgs = {
        managerName: deviceManager,
        hardwareType: hardwareType
    };

    var interfaceVersionData = this.retrieveNAVInterfaceVersions(resourceName, requestTemplateArgs);
    return interfaceVersionData;
};

/**
 * Returns the list of supported interface versions for the provided hardware type
 *
 * @param resourceName
 * @param valueProviderContext
 * @returns {*}
 */
DeviceUtilities.prototype.getNAVInterfaceVersions = function (resourceName, valueProviderContext) {
    var inputValues = valueProviderContext.getInputValues();
    var inputArguments = inputValues.get("arguments");

    var deviceManager = inputArguments.get("device-manager");
    var hardwareType = inputArguments.get("hardware-type");

    var requestTemplateArgs = {
        managerName: deviceManager,
        hardwareType: hardwareType
    };

    var interfaceVersionData = this.retrieveNAVInterfaceVersions(resourceName, requestTemplateArgs);
    return interfaceVersionData;
};

/**
 * Returns the list of supported ihub interface versions
 *
 * @param resourceName
 * @param valueProviderContext
 * @returns {*}
 */
 DeviceUtilities.prototype.getNCYIhubInterfaceVersions = function (valueProviderContext) {
    var inputValues = valueProviderContext.getInputValues();
    var inputArguments = inputValues.get("arguments");
    var interfaceVersionData = [];

    var shelfHardwareType = inputArguments.get("hardware-type");
    var devicePrefix = this.getDevicePrefix(shelfHardwareType);
    var shelfHardwareSplit = shelfHardwareType.split(devicePrefix);
    var hardwareType = devicePrefix + "-IHUB" + shelfHardwareSplit[1];
    var interfaceVersionArrList = mds.getAllInterfaceVersionByHardwareType(hardwareType);
    interfaceVersionArrList.forEach (function (value) {
        interfaceVersionData.push(value);
    });
    return interfaceVersionData;
};

DeviceUtilities.prototype.getDevicePrefix = function (shelfHardwareType) {
    var devicePrefix;
    if (shelfHardwareType.startsWith(intentConstants.LS_FX_PREFIX)) {
        devicePrefix = intentConstants.LS_FX_PREFIX;
    } else if (shelfHardwareType.startsWith(intentConstants.LS_MF_PREFIX)){
        devicePrefix = intentConstants.LS_MF_PREFIX;
    } else if (shelfHardwareType.startsWith(intentConstants.LS_SF_PREFIX)){
        devicePrefix = intentConstants.LS_SF_PREFIX;
    } else if (shelfHardwareType.startsWith(intentConstants.LS_DF_PREFIX)){
        devicePrefix = intentConstants.LS_DF_PREFIX;
    }
    return devicePrefix;
}

/**
 * Returns the list of supported interface versions for the provided hardware type
 *
 * @param valueProviderContext
 * @returns {*}
 */
DeviceUtilities.prototype.getNCYInterfaceVersions = function (valueProviderContext) {
    var interfaceVersionData = [];
    var inputValues = valueProviderContext.getInputValues();
    var args = inputValues.get("arguments");
    var hardwareType = args.get("hardware-type");
    if (!hardwareType) {
        hardwareType = args.get("application-service-type");
    }
    var interfaceVersionArrList = mds.getAllInterfaceVersionByHardwareType(hardwareType);
    interfaceVersionArrList.forEach (function (value) {
        interfaceVersionData.push(value);
    });
    return interfaceVersionData;
};



DeviceUtilities.prototype.getBarCodeConfig = function (resourceName, valueProviderContext) {
    var inputValues = valueProviderContext.getInputValues();
    var inputArguments = inputValues.get("arguments");

    var deviceManager = inputArguments.get("device-manager");

    var requestTemplateArgs = {
        managerName: deviceManager
    };

    var xpath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:barcode-configuration";
    var barcodeConfigFromResponse = apUtils.getExtractedNodeFromResponse(resourceName, requestTemplateArgs, xpath, apUtils.prefixToNsMap);
    if (null != barcodeConfigFromResponse) {
        xpath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:barcode-configuration/adh:white-list-pattern";
        var barcodeConfigData = apUtils.getAttributeValues(barcodeConfigFromResponse, xpath, apUtils.prefixToNsMap);
        logger.debug("barcode-configuration: {}", barcodeConfigData);
        return barcodeConfigData;
    }
};

/**
 * Returns the list of NAV templates for the given hardware-type and interface-version
 *
 * @param resourceName
 * @param requestTemplateArgs
 * @returns {*}
 */
DeviceUtilities.prototype.retrieveNAVTemplates = function (resourceName, requestTemplateArgs) {
    var xpathOuter = "/nc:rpc-reply/nc:data/anv:device-manager/conftpl:configuration-templates";
    var xpathInner = "/nc:rpc-reply/nc:data/anv:device-manager/conftpl:configuration-templates/conftpl:configuration-template/conftpl:name";
    return this.retrieveElementsData(resourceName, requestTemplateArgs, xpathOuter, xpathInner, apUtils.prefixToNsMap);
};

/**
 * Returns the list of NAV templates for the given hardware-type and interface-version
 *
 * @param resourceName
 * @param valueProviderContext
 * @returns {*}
 */
DeviceUtilities.prototype.getNAVTemplates = function (resourceName, valueProviderContext) {
    var inputValues = valueProviderContext.getInputValues();
    var inputArguments = inputValues.get("arguments");

    var deviceManager = inputArguments.get("device-manager");
    var hardwareType = inputArguments.get("hardware-type");
    var deviceInterfaceVersion = inputArguments.get("device-version");

    if (hardwareType && hardwareType === "VONU") {
        return new Object();
    }

    var requestTemplateArgs = {
        managerName: deviceManager,
        hardwareType: hardwareType,
        interfaceVersion: deviceInterfaceVersion
    };

    var templateData = this.retrieveNAVTemplates(resourceName, requestTemplateArgs);
    return templateData;
};

DeviceUtilities.prototype.validatePlugDetails = function(responseNode, xpath, contextualErrorJsonObj, intentConfigJson, attribute) {
    if(intentConfigJson[attribute]) {
        var value = intentConfigJson[attribute];
        if (responseNode) {
            var attributeValues = apUtils.getAttributeValues(responseNode, xpath, apUtils.prefixToNsMap);
            if (!attributeValues || !attributeValues.contains(value)) {
                contextualErrorJsonObj[attribute] = value + " does not exist";
            }
        } else {
            contextualErrorJsonObj[attribute] = value + " does not exist";
        }
    }
};

DeviceUtilities.prototype.getCategoriesForLabel = function (requestXml) {
    var getConfigResponse = apUtils.executeRequestInNAC(requestXml);
    var labelElementFromResponse = utilityService.extractSubtree(getConfigResponse, apUtils.prefixToNsMap, "/nc:rpc-reply/nc:data/emaa:ema-administration/emaa:labels");
    var xpath = "/nc:rpc-reply/nc:data/emaa:ema-administration/emaa:labels/emaa:category/emaa:name";
    var categoriesForLabelData = apUtils.getAttributeValues(labelElementFromResponse, xpath, apUtils.prefixToNsMap);
    logger.debug("Categories: {}", categoriesForLabelData);
    return categoriesForLabelData;
};



DeviceUtilities.prototype.getSoftwareFilesFromAltiplano = function (resourceName, valueProviderContext, hardwareType) {
    var inputValues = valueProviderContext.getInputValues();
    var inputArguments = inputValues.get("arguments");
    var deviceManager = inputArguments.get("device-manager");
    if (!hardwareType) {
        hardwareType = inputArguments.get("hardware-type");
    }
    var deviceInterfaceVersion = inputArguments.get("device-version");
    
    var requestTemplateArgs = {
        managerName: deviceManager,
        hardwareType: hardwareType
    };

    if(!inputArguments.get("isPassiveSoftware")) {
        requestTemplateArgs.interfaceVersion = deviceInterfaceVersion;
    }

    if(inputArguments.get("isBoardActiveSoftware")){
        var boards = inputValues.currentListValue;
        var boardInterfaceVersion = boards[0]["device-version"];

        if(boardInterfaceVersion){
            requestTemplateArgs.interfaceVersion = boardInterfaceVersion;
        }else{
            requestTemplateArgs.interfaceVersion = deviceInterfaceVersion;
        }
    }


    var xpath = "/nc:rpc-reply/nc:data/anv:device-manager/swmgmt:software-management/swmgmt:device-software-files-on-server";
    var result = apUtils.getExtractedNodeFromResponse(resourceName, requestTemplateArgs, xpath, apUtils.prefixToNsMap);

    var suggestedSoftwareFilesOnServer = [];
    if (result != null && result.hasChildNodes()) {
        var nodeList = result.getChildNodes();
        for (var i = 0; i < nodeList.getLength(); i++) {
            if (nodeList.item(i).getNodeType() == 1 && nodeList.item(i).getLocalName() == "available-file") {
                var childNodes = nodeList.item(i).getChildNodes();
                for (var k = 0; k < childNodes.getLength(); k++) {
                    if (childNodes.item(k).getLocalName() == "file-name") {
                        var fileName = childNodes.item(k).getTextContent();
                    }
                    if (childNodes.item(k).getLocalName() == "file-server") {
                        var fileServer = childNodes.item(k).getTextContent();
                    }
                    if (childNodes.item(k).getLocalName() == "sub-directory") {
                        var subDirectory = childNodes.item(k).getTextContent();
                    }
                    if (inputArguments.get("isPassiveSoftware")){
                        if (childNodes.item(k).getLocalName() == "software-type") {
                            var softwareType = childNodes.item(k).getTextContent();
                        }
                    }
                }
                var softwareFile = fileServer + ":" + subDirectory + "/" + fileName;
                if (!softwareType) {
                    if (suggestedSoftwareFilesOnServer.indexOf(softwareFile) === -1) {
                        suggestedSoftwareFilesOnServer.push(softwareFile);
                    }
                }
            }
        }
    }
    return suggestedSoftwareFilesOnServer;
};


/**
 * Utility function to get software files on server for mass eONU SW upgrade
 * @param resourceName
 * @param valueProviderContext
 * @param hardwareType
 * @param deviceManager
 */
DeviceUtilities.prototype.getSoftwareFilesFromAltiplanoForReleaseMapping = function (resourceName, valueProviderContext, hardwareType, deviceManager) {
    var requestTemplateArgs = {
        managerName: deviceManager,
        hardwareType: hardwareType,
        interfaceVersion:null
    };
    var xpath = "/nc:rpc-reply/nc:data/anv:device-manager/swmgmt:software-management/swmgmt:device-software-files-on-server";
    var result = apUtils.getExtractedNodeFromResponse(resourceName, requestTemplateArgs, xpath, apUtils.prefixToNsMap);
    var suggestedSoftwareFilesOnServer = [];
    if (result != null && result.hasChildNodes()) {
        var nodeList = result.getChildNodes();
        for (var i = 0; i < nodeList.getLength(); i++) {
            if (nodeList.item(i).getNodeType() == 1 && nodeList.item(i).getLocalName() == "available-file") {
                var inputValues = valueProviderContext.getInputValues();
                var inputArguments = inputValues.get("arguments");
                var childNodes = nodeList.item(i).getChildNodes();
                for (var k = 0; k < childNodes.getLength(); k++) {
                    if (childNodes.item(k).getLocalName() == "file-name") {
                        var fileName = childNodes.item(k).getTextContent();
                    }
                    if (childNodes.item(k).getLocalName() == "file-server") {
                        var fileServer = childNodes.item(k).getTextContent();
                    }
                    if (childNodes.item(k).getLocalName() == "sub-directory") {
                        var subDirectory = childNodes.item(k).getTextContent();
                    }
                    if (inputArguments.get("isPassiveSoftware")){
                        if (childNodes.item(k).getLocalName() == "software-type") {
                            var softwareType = childNodes.item(k).getTextContent();
                        }
                    }
                }
                var softwareFile = fileServer + ":" + subDirectory + "/" + fileName;
                if (!softwareType) {
                    if (suggestedSoftwareFilesOnServer.indexOf(softwareFile) === -1) {
                        suggestedSoftwareFilesOnServer.push(softwareFile);
                    }
                }
            }
        }
    }
    return suggestedSoftwareFilesOnServer;
};

/**
 * Validating NAV File format in server
 * @param contextualErrorJsonObj
 * @param fileOnServer
 * @param intentConfig
 */

DeviceUtilities.prototype.validateNAVFileOnServerFormat = function (contextualErrorJsonObj, fileOnServer, intentConfigJson) {
    var fileOnServerString = intentConfigJson[fileOnServer];
    if (fileOnServerString) {
        if (!this.getNAVFileServerName(fileOnServerString) || !this.getNAVSubDir(fileOnServerString) || !this.getNAVFileName(fileOnServerString)) {
            contextualErrorJsonObj[fileOnServer] = "should be in the format <File Server Name>:<Directory>/<File Name>";
        }
    }
};

/**
 * Validating Software path and file name is valid for active and passive softwares
 *
 * @param software
 * @param leaf
 * @param contextualErrorJsonObj
 */

DeviceUtilities.prototype.validateNAVSoftware = function (software, leaf, contextualErrorJsonObj) {
    if (!this.isValidNAVFilePath(software)) {
        if (leaf === "active-software") {
            contextualErrorJsonObj[leaf] = "Invalid Active Software";
        }
        if (leaf === "passive-software") {
            contextualErrorJsonObj[leaf] = "Invalid Passive Software";
        }
        if (leaf.contains("cpe-software")) {
            contextualErrorJsonObj[leaf] = "Invalid CPE Software";
        }
    }
};

/**
 * Validating Software path and file name is valid based on file path
 *
 * @param imageFilePath
 * @returns {boolean}
 */

DeviceUtilities.prototype.isValidNAVFilePath = function (imageFilePath) {
    if (!this.getNAVFileServerName(imageFilePath) || !this.getNAVFileName(imageFilePath)) {
        return false;
    }
    return true;
};

/**
 * Fetch software file server name alone from the full path
 *
 * @param fileOnServerString
 * @returns {*}
 */
DeviceUtilities.prototype.getNAVFileServerName = function (fileOnServerString) {
    return fileOnServerString.substr(0, fileOnServerString.lastIndexOf(":"));
};

/**
 * Fetch NAV software file name from full path
 *
 * @param fileOnServerString
 * @returns {*}
 */

DeviceUtilities.prototype.getNAVFileName = function (fileOnServerString) {
    if (fileOnServerString.lastIndexOf(":") == -1 || fileOnServerString.lastIndexOf("/") + 1) { //this condition handles Invalid: testServer:image and valid: imageName
        return fileOnServerString.substr(fileOnServerString.lastIndexOf("/") + 1, fileOnServerString.length);
    }
};

/**
 * This method updates the local id by setting the labels and local attributes (if any defined)
 * @param baseArgs
 */
DeviceUtilities.prototype.updateLocalId = function(baseArgs) {
    // Update labels
    var label = baseArgs["label"];
    if (label && label.length !== 0) {
        var newLabel = {};
        var deviceName = baseArgs["deviceID"].split("##")[1];
        var localAttributes = getLocalAttributesPerDevice(deviceName);
        var labelId = getLabelId(localAttributes);
        var labelKeys = [];
        for (var l in label) {
            labelKeys.push(l);
        }
        for (var i = 0; i < labelKeys.length; i++) {
            var keyStr = labelKeys[i];
            var keyValue = label[keyStr];
            if (keyValue && keyValue.length !== 0) {
                var labelAvailable = false;
                var category;
                var categoryName = keyValue["category"];
                var categoryValue = keyValue["value"];

                if (localAttributes) {
                    for (var attrKey in localAttributes) {
                        if (attrKey.split(/\s*##_/)[1] === categoryName && localAttributes[attrKey] === categoryValue) { //E.g: __label__1_##_State => State
                            category = attrKey;
                            labelAvailable = true;
                        }
                    }
                }
                if (!labelAvailable) {
                    logger.debug("Label Id for Category {} : {}", categoryName, labelId);
                    category = "__label__" + labelId + "_##_" + categoryName;
                    labelId++;
                }
                newLabel[category + "#" + categoryValue] = {"category": category, "value": categoryValue};
            }
        }
        baseArgs["label"] = newLabel;
    }
    // Update local attributes (if defined)
    if (baseArgs["localAttributes"]) {
        var localAttributes = {};
        for (var index = 0; index < baseArgs["localAttributes"].length; index++) {
            var attributeNames = Object.keys(baseArgs["localAttributes"][index]);
            if (attributeNames.length > 0){
                attributeNames.forEach(function (attributeName) {
                    var attributeValue = baseArgs["localAttributes"][index][attributeName];
                    localAttributes[attributeName] = {"name": attributeName, "value": attributeValue};
                });
            }
        }
        baseArgs["localAttributes"] = localAttributes;
    }

    function getLocalAttributesPerDevice(deviceName) {
        var localAttributes = mds.getAllLocalAttributesPerDevice(deviceName);
        logger.debug("Local Attributes for {} : {}", deviceName, localAttributes);
        return localAttributes;
    }

    function getLabelId(localAttributes) {
        var categoryNames = [];
        if (localAttributes) {
            localAttributes.forEach(function (localAttribute) {
                if(localAttribute.startsWith("__label__")) {
                    categoryNames.push(parseInt(localAttribute.split(/\s*_/)[4]));
                }
            });
            if (categoryNames.length > 0) {
                var max = Math.max.apply(null, categoryNames) + 1;
                return max;
            }
        }
        return parseInt("1");
    }
};
/**
 * Get Certificate from AV to AC config the file-server CA cert on device
 *
 * @param baseArgs
 * @param software
 * @param trustAnchorsAgs
 * @param manager
 * @param deviceName
 * @returns {*}
 */

DeviceUtilities.prototype.getCertDetails = function (baseArgs, software, trustAnchorsAgs, manager, deviceName, certResponseNode) {
    var datapath = "/nc:rpc-reply/nc:data/platform:platform";
    if(!certResponseNode) {
        var args = {deviceName: deviceName};
        var requestXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getCertID.xml"), args);
        var response = apUtils.executeGetConfigRequest(manager, requestXml);
        var certResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/cert:certificate-mgmt/cert:trusted-ca-certs");
    } else {
        certResponse = certResponseNode;
    }
    if (baseArgs[software].contains("https://")) {
        var cert_name = baseArgs[software].split("/")[2] + "-certCA";
        var cert_binary = utilityService.getAttributeValue(certResponse, datapath + "/cert:certificate-mgmt/cert:trusted-ca-certs/cert:certificate[cert:id='" + cert_name + "']/cert:cert-binary", apUtils.prefixToNsMap);
        if (cert_binary){
            baseArgs[trustAnchorsAgs]={
                "value": "sw_download_truststore",
                "cert": cert_binary
           }
        }
    }else if(!baseArgs[software].contains("//")){
        var cert_binary_default = utilityService.getAttributeValue(certResponse, datapath + "/cert:certificate-mgmt/cert:trusted-ca-certs/cert:certificate[cert:id='file-server-certCA']/cert:cert-binary", apUtils.prefixToNsMap);
        if (cert_binary_default){
            baseArgs[trustAnchorsAgs]={
                "value": "sw_download_truststore",
                "cert": cert_binary_default
            }
        }
    }
    return baseArgs;
 }

/**
 * Validating NAV directories
 *
 * @param fileOnServerString
 * @returns {string|*}
 */

DeviceUtilities.prototype.getNAVSubDir = function (fileOnServerString) {
    if (fileOnServerString.indexOf("/") != fileOnServerString.lastIndexOf("/")) {
        return fileOnServerString.substr(fileOnServerString.lastIndexOf(":") + 1,
            (fileOnServerString.lastIndexOf("/") - (fileOnServerString.lastIndexOf(":") + 1)));
    } else { // condition handles valid input: testServer:/L6GQAA53.017
        return "/";
    }
};

DeviceUtilities.prototype.getStateReport = function (reportArgs, stateReportFilePath) {
    return utilityService.processTemplate(resourceProvider.getResource(stateReportFilePath), reportArgs);
};

DeviceUtilities.prototype.retrieveOmciVendorCode = function (resourceName, requestTemplateArgs) {
    var xpathOuter = "/nc:rpc-reply/nc:data/anv:device-manager/adh:vendor-code-mappings";
    var xpathInner = "/nc:rpc-reply/nc:data/anv:device-manager/adh:vendor-code-mappings/adh:vendor-code-mapping/adh:omci-vendor-code";
    return this.retrieveElementsData(resourceName, requestTemplateArgs, xpathOuter, xpathInner, apUtils.prefixToNsMap);
};

DeviceUtilities.prototype.getOnuStateAttributesArgs = function (avName, deviceName, checkSwOperState) {
    var args = {deviceName: deviceName, checkSwOperState: checkSwOperState};
    var requestXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getStateAttributesFromNAV.xml.ftl"), args);
    var response = apUtils.executeGetConfigRequest(avName, requestXml);
    var datapath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceName + "\']";
    var reachableStateResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/adh:device-state");
    var reachableState = utilityService.getAttributeValue(reachableStateResponse, datapath + "/adh:device-state/adh:reachable", apUtils.prefixToNsMap);
    if (!response.contains("swmgmt:software")) {
        //In case slicing, we don't have swmgmt:software leaf, so we will return reachable state
        return {
            reachableState: reachableState
        };
    }
    var softwareResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/swmgmt:software");
    var activeSoftware = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:active-software", apUtils.prefixToNsMap);
    var passiveSoftware = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:passive-software", apUtils.prefixToNsMap);
    var activeReleases = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:active-releases", apUtils.prefixToNsMap);
    var passiveReleases = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:passive-releases", apUtils.prefixToNsMap);
    var softwareTargetsAligned = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:software-targets-aligned", apUtils.prefixToNsMap);

    var stateArgs = {};

    if (checkSwOperState == "true") {
        var softwareReportingResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/swmgmt:progress-reporting");
        var currentOperationType = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
        var currentSoftwareName = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:software-name", apUtils.prefixToNsMap);
        var currentStartTime = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:start-time", apUtils.prefixToNsMap);
        var currentFailStatus = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:failed", apUtils.prefixToNsMap);
        var nextOperationOrderList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:order", apUtils.prefixToNsMap);
        var nextOperationOperationTypeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
        var nextOperationsSWNameList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:software-name", apUtils.prefixToNsMap);
        var completedOperationStartTimeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:start-time", apUtils.prefixToNsMap);
        var completedOperationOperationTypeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
        var completedOperationsSWNameList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:software-name", apUtils.prefixToNsMap);
        var completedOperationsResultList = utilityService.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:result", apUtils.prefixToNsMap);
        var completedOperationResultTimeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:result-time", apUtils.prefixToNsMap);
        var completedOperationSwErrReasonList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:software-error-reason", apUtils.prefixToNsMap);

        var nextOperations = {};
        for (var n = 0; n < nextOperationOrderList.size(); n++) {
            var order = nextOperationOrderList.get(n);
            nextOperations[order] = {};
            nextOperations[order]["order"] = order;
            nextOperations[order]["operation-type"] = nextOperationOperationTypeList.get(n);
            nextOperations[order]["software-name"] = nextOperationsSWNameList.get(n);
        }
        var completedOperations = {};
        for (var s = 0; s < completedOperationStartTimeList.size(); s++) {
            completedOperations[s] = {};
            completedOperations[s]["start-time"] = completedOperationStartTimeList.get(s);
            completedOperations[s]["operation-type"] = completedOperationOperationTypeList.get(s);
            completedOperations[s]["software-name"] = completedOperationsSWNameList.get(s);
            completedOperations[s]["result"] = completedOperationsResultList.get(s);
            completedOperations[s]["result-time"] = completedOperationResultTimeList.get(s);
            completedOperations[s]["software-error-reason"] = completedOperationSwErrReasonList.get(s);
        }

        stateArgs = {
            reachableState: reachableState,
            activeSoftware: activeSoftware,
            passiveSoftware: passiveSoftware,
            activeReleases: activeReleases,
            passiveReleases: passiveReleases,
            softwareTargetsAligned: softwareTargetsAligned,
            currentOperationType: currentOperationType,
            currentSoftwareName: currentSoftwareName,
            currentStartTime: currentStartTime,
            currentFailStatus: currentFailStatus,
            nextOperations: nextOperations,
            completedOperations: completedOperations,
        };

    } else {
        stateArgs = {
            reachableState: reachableState,
            activeSoftware: activeSoftware,
            passiveSoftware: passiveSoftware,
            activeReleases: activeReleases,
            passiveReleases: passiveReleases,
            softwareTargetsAligned: softwareTargetsAligned,
        };
    }
    logger.debug("getOnuStateAttributesArgs stateArgs: {}", JSON.stringify(stateArgs));
    return stateArgs;
};

DeviceUtilities.prototype.getStateAttributesArgs = function (avName, deviceName, response, topologyXtraInfo) {
    var args = {deviceName: deviceName,checkSwOperState:"true"};
    if (!response) {
        var requestXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getStateAttributesFromNAV.xml.ftl"), args);
        response = apUtils.executeGetConfigRequest(avName, requestXml);
    }
    var datapath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceName + "\']";
    var reachableStateResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/adh:device-state");
    var reachableState = utilityService.getAttributeValue(reachableStateResponse, datapath + "/adh:device-state/adh:reachable", apUtils.prefixToNsMap);
    if (!response.contains("swmgmt:software")) {
        //In case slicing, we don't have swmgmt:software leaf, so we will return reachable state
        return {
            reachableState: reachableState
        };
    }
    var softwareResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/swmgmt:software");
    var activeSoftware = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:active-software", apUtils.prefixToNsMap);
    var passiveSoftware = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:passive-software", apUtils.prefixToNsMap);
    var activeReleases = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:active-releases", apUtils.prefixToNsMap);
    var passiveReleases = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:passive-releases", apUtils.prefixToNsMap);
    var softwareTargetsAligned = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:software-targets-aligned", apUtils.prefixToNsMap);
    var softwareErrorReason = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:software-error-reason", apUtils.prefixToNsMap);
    var eonuAligned= utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:aligned", apUtils.prefixToNsMap);
    var eonuReleaseStateSWList =apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='ont-software']/swmgmt:artifact/swmgmt:name", apUtils.prefixToNsMap);
    var eonuReleaseStateAlignedList =apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='ont-software']/swmgmt:artifact/swmgmt:aligned", apUtils.prefixToNsMap);
    var eonuVendorSpecificSWList = apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='" + intentConstants.SOFTWARE_TYPE_VENDOR_SPECIFIC + "']/swmgmt:artifact/swmgmt:name", apUtils.prefixToNsMap);
    var eonuVendorSpecificSWAlignedList = apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='" + intentConstants.SOFTWARE_TYPE_VENDOR_SPECIFIC + "']/swmgmt:artifact/swmgmt:aligned", apUtils.prefixToNsMap);
    var transformationSoftware = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='transformation-software']/swmgmt:artifact/swmgmt:name", apUtils.prefixToNsMap);
    var transformationSoftwareAligned = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='transformation-software']/swmgmt:artifact/swmgmt:aligned", apUtils.prefixToNsMap);
    var softwareReportingResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/swmgmt:progress-reporting");
    var currentOperationType = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
    var currentSoftwareName = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:software-name", apUtils.prefixToNsMap);
    var currentStartTime = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:start-time", apUtils.prefixToNsMap);
    var currentFailStatus = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:failed", apUtils.prefixToNsMap);
    var nextOperationOrderList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:order", apUtils.prefixToNsMap);
    var nextOperationOperationTypeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
    var nextOperationsSWNameList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:software-name", apUtils.prefixToNsMap);
    var completedOperationStartTimeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:start-time", apUtils.prefixToNsMap);
    var completedOperationOperationTypeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
    var completedOperationsSWNameList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:software-name", apUtils.prefixToNsMap);
    var completedOperationsResultList = utilityService.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:result", apUtils.prefixToNsMap);
    var completedOperationResultTimeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:result-time", apUtils.prefixToNsMap);
    var completedOperationSwErrReasonList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:software-error-reason", apUtils.prefixToNsMap);
    var deviceArtifactAlignedState = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:aligned", apUtils.prefixToNsMap);
    var cpeSwArtifactNames = utilityService.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='cpe-software']/swmgmt:artifact/swmgmt:name", apUtils.prefixToNsMap);
    var cpeSwArtifactAlignedStates = utilityService.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='cpe-software']/swmgmt:artifact/swmgmt:aligned", apUtils.prefixToNsMap);
    var nextOperations = {};
    for (var n = 0; n < nextOperationOrderList.size(); n++) {
        var order = nextOperationOrderList.get(n);
        nextOperations[order] = {};
        nextOperations[order]["order"] = order;
        nextOperations[order]["operation-type"] = nextOperationOperationTypeList.get(n);
        nextOperations[order]["software-name"] = nextOperationsSWNameList.get(n);
    }
    var completedOperations = {};
    for (var s = 0; s < completedOperationStartTimeList.size(); s++) {
        completedOperations[s] = {};
        completedOperations[s]["start-time"] = completedOperationStartTimeList.get(s);
        completedOperations[s]["operation-type"] = completedOperationOperationTypeList.get(s);
        completedOperations[s]["software-name"] = completedOperationsSWNameList.get(s);
        completedOperations[s]["result"] = completedOperationsResultList.get(s);
        completedOperations[s]["result-time"] = completedOperationResultTimeList.get(s);
        completedOperations[s]["software-error-reason"] = completedOperationSwErrReasonList.get(s);
    }
    var eonuReleaseStates = {};
    if(eonuReleaseStateAlignedList && (eonuReleaseStateAlignedList.size()>0)){
        for (var e = 0; e < eonuReleaseStateAlignedList.size(); e++) {
            eonuReleaseStates[e] = {};
            eonuReleaseStates[e]["eonu-release"] = eonuReleaseStateSWList.get(e);
            eonuReleaseStates[e]["aligned"] = eonuReleaseStateAlignedList.get(e);
        }
    }

    var eonuVendorSpecificReleaseStates = {};
    if (eonuVendorSpecificSWAlignedList && (eonuVendorSpecificSWAlignedList.size() > 0)) {
        for (var index = 0; index < eonuVendorSpecificSWAlignedList.size(); index++) {
            eonuVendorSpecificReleaseStates[index] = {};
            eonuVendorSpecificReleaseStates[index]["release"] = eonuVendorSpecificSWList.get(index);
            eonuVendorSpecificReleaseStates[index]["aligned"] = eonuVendorSpecificSWAlignedList.get(index);
        }
    }

    var transformationSoftwareState = {};
    if (transformationSoftware) {
        transformationSoftwareState["software-name"] = transformationSoftware;
        transformationSoftwareState["aligned"] = transformationSoftwareAligned;
    }

    var cpeSwArtifacts = {};
    if(cpeSwArtifactNames.size() == cpeSwArtifactAlignedStates.size()){
        for (var k = 0; k< cpeSwArtifactNames.size(); k ++) {
            cpeSwArtifacts[cpeSwArtifactNames.get(k)] = cpeSwArtifactAlignedStates.get(k);
        }
    }
    var lastCpeSwPreference = {}
    if (topologyXtraInfo && topologyXtraInfo["create-device-" + deviceName + "_" + deviceName + "_ARGS"]) {
        var stageArgs = JSON.parse(topologyXtraInfo["create-device-" + deviceName + "_" + deviceName + "_ARGS"]);
        if (stageArgs["lastCpeSwPreference"]) {
            lastCpeSwPreference = stageArgs["lastCpeSwPreference"];
        }
    }
    var stateArgs = {
        reachableState: reachableState,
        activeSoftware: activeSoftware,
        passiveSoftware: passiveSoftware,
        activeReleases: activeReleases,
        passiveReleases: passiveReleases,
        softwareTargetsAligned: softwareTargetsAligned,
        softwareErrorReason: softwareErrorReason,
        currentOperationType: currentOperationType,
        currentSoftwareName: currentSoftwareName,
        currentStartTime: currentStartTime,
        currentFailStatus: currentFailStatus,
        nextOperations: nextOperations,
        completedOperations: completedOperations,
        eonuAligned: eonuAligned,
        eonuReleaseStates: eonuReleaseStates,
        deviceArtifactAlignedState : deviceArtifactAlignedState,
        cpeSwArtifacts : cpeSwArtifacts,
        eonuVendorSpecificReleaseStates : eonuVendorSpecificReleaseStates,
        transformationSoftwareState : transformationSoftwareState,
        lastCpeSwPreference: lastCpeSwPreference
    };
    logger.debug("Intent SWMGMT getStateAttributesArgs deviceName {} softwareTargetsAligned {} stateArgs: {}", deviceName,softwareTargetsAligned,JSON.stringify(stateArgs));
    deviceLogger.info(new DeviceRefId(deviceName), "Intent SWMGMT getStateAttributesArgs deviceName {} softwareTargetsAligned {} stateArgs: {}", deviceName,softwareTargetsAligned,JSON.stringify(stateArgs));
    return stateArgs;
};

DeviceUtilities.prototype.getSwStateAttributesForDevicesFromAV = function (avName, deviceNames, extraArgs) {
    var result = {};
    if (deviceNames != null && typeof deviceNames === "object" && typeof deviceNames.push === "function") {
        var args = {
            "deviceNames": deviceNames
        };
        if (extraArgs) {
            args.ltBoards = extraArgs.ltBoards;
            args.ntDeviceName = extraArgs.ntDeviceName;
        }
        var requestXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getSWStateAttributesForDevicesFromNAV.xml.ftl"), args);
        var response = apUtils.executeGetConfigRequest(avName, requestXml);
        deviceNames.forEach(function (deviceName){
            var datapath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceName + "\']";
            var reachableStateResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/adh:device-state");
            var reachableState = utilityService.getAttributeValue(reachableStateResponse, datapath + "/adh:device-state/adh:reachable", apUtils.prefixToNsMap);
            var softwareResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/swmgmt:software");
            var activeSoftware = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:active-software", apUtils.prefixToNsMap);
            var passiveSoftware = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:passive-software", apUtils.prefixToNsMap);
            var activeReleases = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:active-releases", apUtils.prefixToNsMap);
            var passiveReleases = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:passive-releases", apUtils.prefixToNsMap);
            var softwareTargetsAligned = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:software-targets-aligned", apUtils.prefixToNsMap);
            var softwareErrorReason = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:software-error-reason", apUtils.prefixToNsMap);
            var eonuAligned= utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:aligned", apUtils.prefixToNsMap);
            var eonuReleaseStateSWList =apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='ont-software']/swmgmt:artifact/swmgmt:name", apUtils.prefixToNsMap);
            var eonuReleaseStateAlignedList =apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='ont-software']/swmgmt:artifact/swmgmt:aligned", apUtils.prefixToNsMap);
            var eonuVendorSpecificSWList = apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='" + intentConstants.SOFTWARE_TYPE_VENDOR_SPECIFIC + "']/swmgmt:artifact/swmgmt:name", apUtils.prefixToNsMap);
            var eonuVendorSpecificSWAlignedList = apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='" + intentConstants.SOFTWARE_TYPE_VENDOR_SPECIFIC + "']/swmgmt:artifact/swmgmt:aligned", apUtils.prefixToNsMap);
            var transformationSoftware = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='transformation-software']/swmgmt:artifact/swmgmt:name", apUtils.prefixToNsMap);
            var transformationSoftwareAligned = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='transformation-software']/swmgmt:artifact/swmgmt:aligned", apUtils.prefixToNsMap);
            var softwareReportingResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/swmgmt:progress-reporting");
            var currentOperationType = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
            var currentSoftwareName = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:software-name", apUtils.prefixToNsMap);
            var currentStartTime = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:start-time", apUtils.prefixToNsMap);
            var currentFailStatus = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:failed", apUtils.prefixToNsMap);
            var nextOperationOrderList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:order", apUtils.prefixToNsMap);
            var nextOperationOperationTypeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
            var nextOperationsSWNameList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:software-name", apUtils.prefixToNsMap);
            var completedOperationStartTimeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:start-time", apUtils.prefixToNsMap);
            var completedOperationOperationTypeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
            var completedOperationsSWNameList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:software-name", apUtils.prefixToNsMap);
            var completedOperationsResultList = utilityService.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:result", apUtils.prefixToNsMap);
            var completedOperationResultTimeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:result-time", apUtils.prefixToNsMap);
            var completedOperationSwErrReasonList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:software-error-reason", apUtils.prefixToNsMap);

            var nextOperations = {};
            for (var n = 0; n < nextOperationOrderList.size(); n++) {
                var order = nextOperationOrderList.get(n);
                nextOperations[order] = {};
                nextOperations[order]["order"] = order;
                nextOperations[order]["operation-type"] = nextOperationOperationTypeList.get(n);
                nextOperations[order]["software-name"] = nextOperationsSWNameList.get(n);
            }
            var completedOperations = {};
            for (var s = 0; s < completedOperationStartTimeList.size(); s++) {
                completedOperations[s] = {};
                completedOperations[s]["start-time"] = completedOperationStartTimeList.get(s);
                completedOperations[s]["operation-type"] = completedOperationOperationTypeList.get(s);
                completedOperations[s]["software-name"] = completedOperationsSWNameList.get(s);
                completedOperations[s]["result"] = completedOperationsResultList.get(s);
                completedOperations[s]["result-time"] = completedOperationResultTimeList.get(s);
                completedOperations[s]["software-error-reason"] = completedOperationSwErrReasonList.get(s);
            }
            var eonuReleaseStates = {};
            if(eonuReleaseStateAlignedList && (eonuReleaseStateAlignedList.size()>0)){
                for (var e = 0; e < eonuReleaseStateAlignedList.size(); e++) {
                    eonuReleaseStates[e] = {};
                    eonuReleaseStates[e]["eonu-release"] = eonuReleaseStateSWList.get(e);
                    eonuReleaseStates[e]["aligned"] = eonuReleaseStateAlignedList.get(e);
                }
            }
            var eonuVendorSpecificReleaseStates = {};
            if (eonuVendorSpecificSWAlignedList && (eonuVendorSpecificSWAlignedList.size() > 0)) {
                for (var index = 0; index < eonuVendorSpecificSWAlignedList.size(); index++) {
                    eonuVendorSpecificReleaseStates[index] = {};
                    eonuVendorSpecificReleaseStates[index]["release"] = eonuVendorSpecificSWList.get(index);
                    eonuVendorSpecificReleaseStates[index]["aligned"] = eonuVendorSpecificSWAlignedList.get(index);
                }
            }
            var transformationSoftwareState = {};
            if (transformationSoftware) {
                transformationSoftwareState["software-name"] = transformationSoftware;
                transformationSoftwareState["aligned"] = transformationSoftwareAligned;
            }
            var stateArgs = {
                reachableState: reachableState,
                activeSoftware: activeSoftware,
                passiveSoftware: passiveSoftware,
                activeReleases: activeReleases,
                passiveReleases: passiveReleases,
                softwareTargetsAligned: softwareTargetsAligned,
                softwareErrorReason: softwareErrorReason,
                currentOperationType: currentOperationType,
                currentSoftwareName: currentSoftwareName,
                currentStartTime: currentStartTime,
                currentFailStatus: currentFailStatus,
                nextOperations: nextOperations,
                completedOperations: completedOperations,
                eonuAligned: eonuAligned,
                eonuReleaseStates: eonuReleaseStates,
                eonuVendorSpecificReleaseStates : eonuVendorSpecificReleaseStates,
                transformationSoftwareState : transformationSoftwareState,
            };
            deviceLogger.info(new DeviceRefId(deviceName), "Intent SWMGMT getStateAttributesArgs deviceName {} softwareTargetsAligned {} stateArgs: {}", deviceName, softwareTargetsAligned, JSON.stringify(stateArgs));
            result[deviceName] = stateArgs;
        });
    }
    return result;
}

DeviceUtilities.prototype.getSwStateAttributesForDevices = function (avName, deviceNames, extraArgs) {
    var result = {};
    if (deviceNames != null && typeof deviceNames === "object" && typeof deviceNames.push === "function") {
        var args = {
            "deviceNames": deviceNames
        };
        if (extraArgs) {
            args.ltBoards = extraArgs.ltBoards;
            args.ntDeviceName = extraArgs.ntDeviceName;
        }
        var requestXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getSWStateAttributesForDevices.xml.ftl"), args);
        var response = apUtils.executeGetConfigRequest(avName, requestXml);
        if (extraArgs && response) {
            extraArgs.response = response;
        }
        deviceNames.forEach(function (deviceName){
            var datapath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceName + "\']";
            var reachableStateResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/adh:device-state");
            var reachableState = utilityService.getAttributeValue(reachableStateResponse, datapath + "/adh:device-state/adh:reachable", apUtils.prefixToNsMap);
            var softwareResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/swmgmt:software");
            var activeSoftware = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:active-software", apUtils.prefixToNsMap);
            var passiveSoftware = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:passive-software", apUtils.prefixToNsMap);
            var activeReleases = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:active-releases", apUtils.prefixToNsMap);
            var passiveReleases = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:passive-releases", apUtils.prefixToNsMap);
            var softwareTargetsAligned = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:software-targets-aligned", apUtils.prefixToNsMap);
            var softwareErrorReason = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:software-error-reason", apUtils.prefixToNsMap);
            var eonuAligned= utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:aligned", apUtils.prefixToNsMap);
            var eonuReleaseStateSWList =apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='ont-software']/swmgmt:artifact/swmgmt:name", apUtils.prefixToNsMap);
            var eonuReleaseStateAlignedList =apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='ont-software']/swmgmt:artifact/swmgmt:aligned", apUtils.prefixToNsMap);
            var eonuVendorSpecificSWList = apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='" + intentConstants.SOFTWARE_TYPE_VENDOR_SPECIFIC + "']/swmgmt:artifact/swmgmt:name", apUtils.prefixToNsMap);
            var eonuVendorSpecificSWAlignedList = apUtils.getAttributeValues(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='" + intentConstants.SOFTWARE_TYPE_VENDOR_SPECIFIC + "']/swmgmt:artifact/swmgmt:aligned", apUtils.prefixToNsMap);
            var transformationSoftware = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='transformation-software']/swmgmt:artifact/swmgmt:name", apUtils.prefixToNsMap);
            var transformationSoftwareAligned = utilityService.getAttributeValue(softwareResponse, datapath + "/swmgmt:software/swmgmt:device-artifacts/swmgmt:artifacts-to-download[swmgmt:type='transformation-software']/swmgmt:artifact/swmgmt:aligned", apUtils.prefixToNsMap);
            var softwareReportingResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/swmgmt:progress-reporting");
            var currentOperationType = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
            var currentSoftwareName = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:software-name", apUtils.prefixToNsMap);
            var currentStartTime = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:start-time", apUtils.prefixToNsMap);
            var currentFailStatus = utilityService.getAttributeValue(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:current-operation/swmgmt:failed", apUtils.prefixToNsMap);
            var nextOperationOrderList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:order", apUtils.prefixToNsMap);
            var nextOperationOperationTypeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
            var nextOperationsSWNameList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:next-operation/swmgmt:software-name", apUtils.prefixToNsMap);
            var completedOperationStartTimeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:start-time", apUtils.prefixToNsMap);
            var completedOperationOperationTypeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:operation-type", apUtils.prefixToNsMap);
            var completedOperationsSWNameList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:software-name", apUtils.prefixToNsMap);
            var completedOperationsResultList = utilityService.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:result", apUtils.prefixToNsMap);
            var completedOperationResultTimeList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:result-time", apUtils.prefixToNsMap);
            var completedOperationSwErrReasonList = apUtils.getAttributeValues(softwareReportingResponse, datapath + "/swmgmt:progress-reporting/swmgmt:already-triggered-operation/swmgmt:software-error-reason", apUtils.prefixToNsMap);
            var cfmHostId = apUtils.getAttributeValues(response, datapath + "/adh:device-specific-data/sys:system/nokia-sdan-vmac-host-id-aug:host-id/nokia-sdan-vmac-host-id-aug:host-id", apUtils.prefixToNsMap);
            var valueHostId;
            if (cfmHostId && cfmHostId.length >0) {
                valueHostId = cfmHostId[0];
            } else {
                valueHostId = "not-configured"
            }
            var nextOperations = {};
            for (var n = 0; n < nextOperationOrderList.size(); n++) {
                var order = nextOperationOrderList.get(n);
                nextOperations[order] = {};
                nextOperations[order]["order"] = order;
                nextOperations[order]["operation-type"] = nextOperationOperationTypeList.get(n);
                nextOperations[order]["software-name"] = nextOperationsSWNameList.get(n);
            }
            var completedOperations = {};
            for (var s = 0; s < completedOperationStartTimeList.size(); s++) {
                completedOperations[s] = {};
                completedOperations[s]["start-time"] = completedOperationStartTimeList.get(s);
                completedOperations[s]["operation-type"] = completedOperationOperationTypeList.get(s);
                completedOperations[s]["software-name"] = completedOperationsSWNameList.get(s);
                completedOperations[s]["result"] = completedOperationsResultList.get(s);
                completedOperations[s]["result-time"] = completedOperationResultTimeList.get(s);
                completedOperations[s]["software-error-reason"] = completedOperationSwErrReasonList.get(s);
            }
            var eonuReleaseStates = {};
            if(eonuReleaseStateAlignedList && (eonuReleaseStateAlignedList.size()>0)){
                for (var e = 0; e < eonuReleaseStateAlignedList.size(); e++) {
                    eonuReleaseStates[e] = {};
                    eonuReleaseStates[e]["eonu-release"] = eonuReleaseStateSWList.get(e);
                    eonuReleaseStates[e]["aligned"] = eonuReleaseStateAlignedList.get(e);
                }
            }
            var eonuVendorSpecificReleaseStates = {};
            if (eonuVendorSpecificSWAlignedList && (eonuVendorSpecificSWAlignedList.size() > 0)) {
                for (var index = 0; index < eonuVendorSpecificSWAlignedList.size(); index++) {
                    eonuVendorSpecificReleaseStates[index] = {};
                    eonuVendorSpecificReleaseStates[index]["release"] = eonuVendorSpecificSWList.get(index);
                    eonuVendorSpecificReleaseStates[index]["aligned"] = eonuVendorSpecificSWAlignedList.get(index);
                }
            }
            var transformationSoftwareState = {};
            if (transformationSoftware) {
                transformationSoftwareState["software-name"] = transformationSoftware;
                transformationSoftwareState["aligned"] = transformationSoftwareAligned;
            }
            var stateArgs = {
                reachableState: reachableState,
                activeSoftware: activeSoftware,
                passiveSoftware: passiveSoftware,
                activeReleases: activeReleases,
                passiveReleases: passiveReleases,
                softwareTargetsAligned: softwareTargetsAligned,
                softwareErrorReason: softwareErrorReason,
                currentOperationType: currentOperationType,
                currentSoftwareName: currentSoftwareName,
                currentStartTime: currentStartTime,
                currentFailStatus: currentFailStatus,
                nextOperations: nextOperations,
                completedOperations: completedOperations,
                eonuAligned: eonuAligned,
                eonuReleaseStates: eonuReleaseStates,
                eonuVendorSpecificReleaseStates : eonuVendorSpecificReleaseStates,
                transformationSoftwareState : transformationSoftwareState,
                cfmHostId : valueHostId
            };
            deviceLogger.info(new DeviceRefId(deviceName), "Intent SWMGMT getStateAttributesArgs deviceName {} softwareTargetsAligned {} stateArgs: {}", deviceName, softwareTargetsAligned, JSON.stringify(stateArgs));
            result[deviceName] = stateArgs;
        });
    }
    return result;
}
DeviceUtilities.prototype.getDuidFromDevice = function (deviceName, intentConfigJson) {

    var templateArgs = {};
    var duidFromDevice = {};
    var ntDuids = [];
    var duid ,duid2;
    templateArgs = {
        "deviceID": deviceName
    };
    if (intentConfigJson["callHome"]) {
            var componentNode = apUtils.getExtractedDeviceSpecificDataNode(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getBoardDetails.xml", templateArgs);
            if (componentNode) {
                var NtClass = "nokia-hwi:nt";
                var ntBoards = utilityService.getAttributeValues(componentNode, "hw:hardware-state/hw:component[hw:class=\'" + NtClass + "\']/hw:name", apUtils.prefixToNsMap);
                if (ntBoards) {
                    ntBoards.forEach(function (ntBoardName) {
                        var duids = utilityService.getAttributeValues(componentNode, "hw:hardware-state/hw:component[hw:name=\'" + ntBoardName + "\']/nokia-sdan-hw-duid:duid/nokia-sdan-hw-duid:duids", apUtils.prefixToNsMap);
                        if (duids) {
                            duids.forEach(function (duid) {
                                if (duid.contains(intentConstants.LS_NT_SHELF_DUID_POSTFIX)) {
                                    ntDuids.push(duid);
                                }
                            });
                        }
                    });
                    duidFromDevice["callHome"] = true;
                    if (intentConfigJson["duid"] && intentConfigJson["duid2"] && ntDuids.length == 2) {
                        var ntDuidsFromDevice = JSON.parse(JSON.stringify(ntDuids));
                        if (ntDuidsFromDevice.indexOf(intentConfigJson["duid"]) < 0) {
                            ntDuidsFromDevice.splice((ntDuidsFromDevice.indexOf(intentConfigJson["duid2"])), 1);
                            throw new RuntimeException("DUID '" + intentConfigJson["duid"] + "' is not valid. Modify the DUID as '" + ntDuidsFromDevice + "' and re-synchronize the intent.");
                        }
                        if (ntDuidsFromDevice.indexOf(intentConfigJson["duid2"]) < 0) {
                            ntDuidsFromDevice.splice((ntDuidsFromDevice.indexOf(intentConfigJson["duid"])), 1);
                            throw new RuntimeException("DUID '" + intentConfigJson["duid2"] + "' is not valid. Modify the DUID as '" + ntDuidsFromDevice + "' and re-synchronize the intent.");
                        }
                    }
                    if (ntDuids.indexOf(intentConfigJson["duid"]) >=0) {
                        duidFromDevice["duid"] = intentConfigJson["duid"];
                        ntDuids.splice(ntDuids.indexOf(duidFromDevice["duid"]), 1);
                    }else{
                        duid = true;                                                         
                    }

                    if (ntDuids.indexOf(intentConfigJson["duid2"]) >=0) {
                        duidFromDevice["duid2"] = intentConfigJson["duid2"];
                        ntDuids.splice(ntDuids.indexOf(duidFromDevice["duid2"]), 1);
                    }else{
                        duid2 = true;                                                         
                    }
                    if(duid){
                        duidFromDevice["duid"] = ntDuids[0];
                    }
                    else if(duid2){
                        duidFromDevice["duid2"] = ntDuids[0];
                    }
                }
                if (intentConfigJson["boards"]) {
                    Object.keys(intentConfigJson["boards"]).forEach(function (board) {
                        if (board.indexOf(intentConstants.FX_LT_STRING) === 0) {
                            if (intentConfigJson["hardware-type"].contains("LS-SF")) {
                                parentSlot = "Slot-Lt";
                            }
                            else {
                                var slotNum = Number(board.replace(intentConstants.FX_LT_STRING, ""));
                                parentSlot = "Slot-Lt-" + slotNum;
                            }
                            var duids = utilityService.getAttributeValues(componentNode, "hw:hardware-state/hw:component[hw:parent=\'" + parentSlot + "\']/nokia-sdan-hw-duid:duid/nokia-sdan-hw-duid:duids", apUtils.prefixToNsMap);
                            if (duids) {
                                duids.forEach(function (duid) {
                                    duidFromDevice[board] = duid;
                                });
                            }
                        }
                    });
                }
                
            }
            else {                
                if (intentConfigJson["boards"]) {
                    Object.keys(intentConfigJson["boards"]).forEach(function (board) {
                        if (board.indexOf(intentConstants.FX_LT_STRING) === 0) {
                            var deviceHolderDetails = apUtils.getDeviceHolderDetail(deviceName + intentConstants.FX_DEVICE_SEPARATOR + board);
                            if (deviceHolderDetails && deviceHolderDetails["duid"]) {
                                duidFromDevice[board] = deviceHolderDetails["duid"];
                            }
                        }

                    });
                }
            }
            intentConfigJson["duidFromDevice"] = duidFromDevice;
    }
}

DeviceUtilities.prototype.getDiscoverableDuids = function (deviceName, stateArgs) {
    var templateArgs = {};
    discoveredDuids = {};
    templateArgs = {
        "deviceID": deviceName
    };
    if (deviceName) {
        try {
            var componentNode = apUtils.getExtractedDeviceSpecificDataNode(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getBoardDetails.xml", templateArgs);
            if (componentNode) {
                var NtClass = "nokia-hwi:nt";
                var ntBoards = utilityService.getAttributeValues(componentNode, "hw:hardware-state/hw:component[hw:class=\'" + NtClass + "\']/hw:name", apUtils.prefixToNsMap);
                if (ntBoards) {
                    ntBoards.forEach(function (ntBoardName) {
                        var duids = utilityService.getAttributeValues(componentNode, "hw:hardware-state/hw:component[hw:name=\'" + ntBoardName + "\']/nokia-sdan-hw-duid:duid/nokia-sdan-hw-duid:duids", apUtils.prefixToNsMap);
                        if (duids) {
                            duids.forEach(function (duid) {
                                if (duid.contains(intentConstants.LS_NT_SHELF_DUID_POSTFIX)) {
                                    discoveredDuids[duid] = duid;
                                }
                            });
                        }
                    });


                }
            }
        } catch (error) {
            logger.debug("State data not available from device ", error);
        }
        if (stateArgs[deviceName]) {
            stateArgs[deviceName]["discoveredDuids"] = discoveredDuids;
        }

    }
}

/**
 * Check whether the device with deviceName is already existing in another AV.
 *
 * @param deviceName
 * @param currentManagerName
 * @param contextualErrorJsonObj
 *
 */
DeviceUtilities.prototype.validateDevicePresentInOtherAV = function(deviceName, currentManagerName, contextualErrorJsonObj) {
    var managerInfos = mds.getAllManagersWithDevice(deviceName);
    if (managerInfos == null || managerInfos.isEmpty()) {
        return;
    }
    var managerName = managerInfos[0].getName();
    if(managerName !== currentManagerName) {
        var managerName = managerInfos[0].getName();
        contextualErrorJsonObj["device-name"] = deviceName + " cannot be created because it already exists under Device Manager " + managerName.toString() + ". Delete the existing device first.";
    }
};

/**
 * Check whether duplicate device name is exist in AV
 *
 * @param deviceName
 * @param deviceType
 * @param contextualErrorJsonObj
 *
 */
DeviceUtilities.prototype.validateForDuplicateDeviceNamesInAV = function(deviceName, deviceType, contextualErrorJsonObj) {
    var deviceDetails = mds.getAllInfoFromDevices(deviceName);
    var errorMessage = "Device '" + deviceName + "' cannot be created because a device with the same name already exists in the network";
    if (deviceDetails == null || deviceDetails.isEmpty()) {
        return;
    } else if (deviceDetails != null && !deviceDetails.isEmpty()) {
        var familyTypeRelease = deviceDetails[0].familyTypeRelease;
        if (familyTypeRelease && !familyTypeRelease.startsWith(deviceType)) {
            if (deviceType == intentConstants.FAMILY_TYPE_APP_BSO) {
                contextualErrorJsonObj["application-name"] = errorMessage;
            } else {
                contextualErrorJsonObj["device-name"] = errorMessage;
            }
        }
    }
}
/**
 * Check and get ONU Model base on device and intent type
 * 
 * @param {string} deviceName 
 * @param {string} intentType 
 * @returns {string}
 */
DeviceUtilities.prototype.getOnuModelState = function (deviceName, intentType) {
    var onuModel = intentConstants.ONU_MODEL_VONU;
    var devicePrefix = "";
    var board = "";
    if (intentType == intentConstants.INTENT_TYPE_DEVICE_FX || intentType == intentConstants.INTENT_TYPE_DEVICE_MF || intentType == intentConstants.INTENT_TYPE_DEVICE_SF) {
        if (intentType == intentConstants.INTENT_TYPE_DEVICE_FX) {
            devicePrefix = intentConstants.LS_FX_PREFIX;
        } else if (intentType == intentConstants.INTENT_TYPE_DEVICE_MF) {
            devicePrefix = intentConstants.LS_MF_PREFIX;
        } else if (intentType == intentConstants.INTENT_TYPE_DEVICE_SF) {
            devicePrefix = intentConstants.LS_SF_PREFIX;
        }
        var ltDevice = deviceName;
        var lastIndex = ltDevice.lastIndexOf(intentConstants.FX_DEVICE_SEPARATOR);
        if (lastIndex > -1) {
            var fxLtDeviceNameLtDetails = ltDevice.substring(lastIndex + 1);
            var ltPattern = new RegExp(intentConstants.FX_LT_REG_EXP);
            var isLtBoard = ltPattern.test(fxLtDeviceNameLtDetails);
            if (isLtBoard) {
                deviceName = ltDevice.substring(0, lastIndex);
                board = ltDevice.substring(lastIndex + 1, ltDevice.length);
            } else {
                throw new RuntimeException(devicePrefix + " shelf device name cannot be deduced");
            }
        } else {
            throw new RuntimeException(devicePrefix + " shelf device name cannot be deduced");
        }
    } else if (intentType == intentConstants.INTENT_TYPE_DEVICE_DF) {//DF case
        devicePrefix = intentConstants.LS_DF_PREFIX;
    } else {
        throw new RuntimeException("Intent type '" + intentType + "' does not support to get ONU Model");
    }
    var getKeyForList = function (listName) {
        switch (listName) {
            case "label":
                return ["category", "value"];
            case "boards":
                return ["slot-name"];
            default:
                return null;
        }
    };
    var deviceIntent = apUtils.getIntent(intentType, deviceName);

    if (deviceIntent) {
        var intentConfigJson = apUtils.convertIntentConfigXmlToJson(deviceIntent.getIntentConfig(), getKeyForList);
        var intentVersion = apUtils.getIntentVersion(intentType, deviceName);
        var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
        if (intentType == intentConstants.INTENT_TYPE_DEVICE_FX) {
            var subType = "LS-FX-LT"
        } else if (intentType == intentConstants.INTENT_TYPE_DEVICE_MF) {
            var subType = "LS-MF-LT"
        } else if (intentType == intentConstants.INTENT_TYPE_DEVICE_SF) {
            var subType = "LS-SF-LT"
        } else if (intentType == intentConstants.INTENT_TYPE_DEVICE_DF) {
            var subType = "LS-DF"
        }
        var serviceProfile = apUtils.getAssociatedProfilesWithConfigForIntentType(nodeType, intentType, intentVersion, "board-service-profile", subType, null, true);
        if (intentType == intentConstants.INTENT_TYPE_DEVICE_FX || intentType == intentConstants.INTENT_TYPE_DEVICE_MF || intentType == intentConstants.INTENT_TYPE_DEVICE_SF) {
            var boardProfile = intentConfigJson["boards"][board]["board-service-profile"];
            if(!boardProfile && (intentType == intentConstants.INTENT_TYPE_DEVICE_MF || intentType == intentConstants.INTENT_TYPE_DEVICE_SF)) {
                return intentConstants.ONU_MODEL_EONU;
            }
            if (serviceProfile) {
                var serviceProfilePon = serviceProfile;
            }
        } else {//DF case
            var familyType = intentConfigJson["hardware-type"];
            var boardProfile = intentConfigJson["board-service-profile"];
            var serviceProfilePon = serviceProfile;
            if (!boardProfile && (familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_E) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_H)
               || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_J) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F))){
                return intentConstants.ONU_MODEL_EONU;
            }
        }

        if (boardProfile && serviceProfile) {
            var serviceProfilePonObj = {};
            if(serviceProfilePon){
                serviceProfilePon.forEach(function (profile) {
                    serviceProfilePonObj[profile.name] = profile;
                });
            }
            if (serviceProfilePonObj[boardProfile] && serviceProfilePonObj[boardProfile]["onu-model"] === intentConstants.ONU_MODEL_EONU) {
                return intentConstants.ONU_MODEL_EONU;
            }
        }
    }
    return onuModel;
}

DeviceUtilities.prototype.checkIfDuplicateDuid = function (DUIDs,target,intentDevice) {
    var listDuplicatedDuid = [];
    var returnMessageError = "";
    try {
        if (DUIDs) {
            DUIDs.forEach(function (duid) {
                var argsDUID = {
                    "DUID": duid,
                    "target": target,
                    "intentDevice": intentDevice
                };
                var resourceFile = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "manager-specific/nv/createDevice/esQueryDUID.json.ftl";
                var response = apUtils.executeEsQuery(resourceFile, argsDUID);
                if (apUtils.isResponseContainsData(response)) {
                    listDuplicatedDuid.push(duid);
                }
            });
        }
    } catch (error) {
        logger.debug("An error occurred while checking for duplicate DUID ", error);
    }
    if (listDuplicatedDuid.length > 0) {
        listDuplicatedDuid = listDuplicatedDuid.join(",");
        returnMessageError = "A device with the " + listDuplicatedDuid + " already exists, please enter another DUID";
    }
    return returnMessageError;
};

/**
 * Utility function to get suggested software files on server for mass eONU SW upgrade
 * @param valueProviderContext
 */
 DeviceUtilities.prototype.getSuggestedSoftwareFilesMassEonuSwUpgrade = function (valueProviderContext) {
    var inputValues = valueProviderContext.getInputValues();
    var currentListValue = inputValues.get("currentListValue");
    var inputArguments = inputValues.get("arguments");
    var deviceManager = inputArguments.get("device-manager");
    if (currentListValue) {
        var softwareType = currentListValue.get(0).get("software-type");
    }
    var suggestedSoftwareFilesOnServer;
    if (softwareType){
        if(softwareType == "main-software"){
            suggestedSoftwareFilesOnServer = this.getSoftwareFilesFromAltiplanoForReleaseMapping(
                intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getEonuSoftwareFilesFromServer.xml.ftl",
                valueProviderContext, null, deviceManager);
        } else {
            suggestedSoftwareFilesOnServer = this.getSoftwareFilesFromAltiplanoForReleaseMapping(
                intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getEonuVendorSpecificSoftwareFilesFromServer.xml.ftl",
                valueProviderContext, null, deviceManager);   
        }
    }
    return suggestedSoftwareFilesOnServer;
}


DeviceUtilities.prototype.getHostId = function (deviceName) {
    var templateArgs = {
        "deviceID": deviceName
    }
    var xpath = "/nc:rpc-reply/nc:data/device-manager:device-manager/" + "adh:device[adh:device-id=\'" + deviceName + "\']";
    if (deviceName.indexOf("LT")) {
        var componentNode = apUtils.getExtractedNodeFromResponse(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getHostId.xml", templateArgs, xpath, apUtils.prefixToNsMap);
        if (componentNode) {
            var dataPath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceName + "\']/adh:device-specific-data/sys:system/nokia-sdan-vmac-host-id-aug:host-id"
            var hostId = apUtils.getAttributeValues(componentNode, dataPath, apUtils.prefixToNsMap)
            return hostId
        }
    }
}

DeviceUtilities.prototype.getSlotPool = function() {
    var scope = "AC";
    try {
        var slotPool = resourceManager.getPool("ap-host-ids", OptionalObject.of(scope));
    } catch (e) {
        logger.debug("Error occurred during getting resource pool" + ": " + e);
    }
    return slotPool;
}

DeviceUtilities.prototype.getExistingHostIDList = function(slotPool) {
    var existingHostIDElementList;
    try {
        existingHostIDElementList = slotPool.getResource(null, "ap-host-ids");
    }
    catch (e) {
        logger.debug("Resource error : " + e);
    }
    if (existingHostIDElementList && existingHostIDElementList[0] != null) {
        //Host ID Exists
        var hostIDExistList = [];
        existingHostIDElementList.forEach(function (item) {
            var value = item.toString().split("=")[0].replace("{", "");
            hostIDExistList.push(value);
        });
        return hostIDExistList;
    }
    return null;
}

DeviceUtilities.prototype.updateResourcePool = function(hostID, slotPool) {
    if (!hostID ) {
        return;
    }
    logger.debug("Updating resource pool with ONT ID '" + hostID + ".");
    try {
        var idsPropsVO = resourceManagerFactory.createResourceProperties(hostID, "ap-host-ids");
        var idMap = new HashMap();
        idMap.put(Integer.parseInt(hostID), idsPropsVO);
        var idMapList = new ArrayList();
        idMapList.add(idMap);
        slotPool.updateUsedResourcesList("defaultConsumer", idMapList);
    } catch (e) {
        logger.debug("Error occurred during updating used resource list: " + e);
    }
}

DeviceUtilities.prototype.executeDeleteHostId = function(lastIntentConfigJson, baseArgs, deviceName, slotPool) {
    if (lastIntentConfigJson) {
        if (!baseArgs["boards"] && lastIntentConfigJson["boards"]) {
            var slotPool = this.getSlotPool();
            for (var slot in lastIntentConfigJson["boards"]) {
                var presentHostId = this.getHostId(deviceName);
                for (index in presentHostId) {
                    if (slotPool) {
                        try {
                            slotPool.returnResourceToPool(Integer.parseInt(presentHostId[index]));
                        } catch (error) {
                            logger.debug("Error occurred while return the host-id to resourcePool: " + error)                                        
                        }
                    }
                }
            }
        } else if (baseArgs["boards"] && lastIntentConfigJson["boards"] && slotPool) {
            if (Object.keys(baseArgs["boards"]).length < Object.keys(lastIntentConfigJson["boards"]).length) {
                var deleteTarget
                for (var slot in lastIntentConfigJson["boards"]) {
                    if (JSON.stringify(lastIntentConfigJson["boards"][slot]).indexOf(JSON.stringify(baseArgs["boards"][slot])) == -1) {
                        deleteTarget = deviceName.slice(0, deviceName.indexOf(".")) + `.${slot}`;
                    }
                    if (deleteTarget) {
                        var deleteHostId = this.getHostId(deleteTarget);
                        for (index in deleteHostId) {
                            if (slotPool) {
                                try {
                                    slotPool.returnResourceToPool(Integer.parseInt(deleteHostId[index]));
                                } catch (error) {
                                    logger.debug("Error occurred while return the host-id to resourcePool: " + error)                                        
                                }
                            }
                        }
                    }
                }
            }
            for ( var slot in lastIntentConfigJson["boards"] ) {
                if (baseArgs["boards"][slot] && lastIntentConfigJson["boards"][slot]["host-id"] && baseArgs["boards"][slot]["host-id"] && lastIntentConfigJson["boards"][slot]["host-id"] != "not-configured" && baseArgs["boards"][slot]["host-id"] == "not-configured") {
                    var deleteTarget = deviceName.slice(0, deviceName.indexOf(".")) + `.${slot}`;
                    var deleteHostId = this.getHostId(deleteTarget);
                    for (index in deleteHostId) {
                        if (slotPool) {
                            try {
                                slotPool.returnResourceToPool(Integer.parseInt(deleteHostId[index]));
                            } catch (error) {
                                logger.debug("Error occurred while return the host-id to resourcePool: " + error)                                        
                            }
                        }
                    }
                }
            }
        }
    }
}

DeviceUtilities.prototype.mapTargetToIntent = function(input,intentType) {
    var intentTypeTarget = null;
    var notificationXml = input.getNotificationXml();
    logger.debug("received notification:: {}",notificationXml);
    logger.debug("for intenttype:: {}", intentType);
    if (notificationXml && notificationXml.contains("target")) {
        var deviceId = deviceUtilities.getDeviceIdFromNotification(notificationXml);
        if (deviceId) {
            var target = deviceId.contains("LT") ? deviceId.split(".LT")[0] : deviceId;
            var templateArgs = {
                target: target,
                intentType: intentType
            };
            var resourceFile = resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "esGetDeviceIntent.json.ftl");
            var request = utilityService.processTemplate(resourceFile, templateArgs);
            logger.debug("request for intent check to Es:: {}", JSON.stringify(request));
            var response = apUtils.executeEsIntentSearchRequest(request);
            if (response.hits.total.value != 0) {
                intentTypeTarget = new com.nokia.fnms.controller.ibn.intenttype.spi.IntentTypeTarget(intentType, target);
            }
        }
    }
    logger.debug("intent type target:: {}",intentTypeTarget);
    return intentTypeTarget;
}

DeviceUtilities.prototype.updateSoftwareStates = function(input,intenType) {

    var stateArgs = ["swmgmt:software-targets-aligned", "swmgmt:active-software", "swmgmt:passive-software"];
    var notificationXml = input.getNotificationXml();

    //Reading the changes from xml
    if (notificationXml.contains("software-targets-aligned") || notificationXml.contains("active-software") || notificationXml.contains("passive-software")) {
        var stateReportArgs = {};
        var notificationReportArgs = {};
        var stateDetailsCollector = {};
        var index = 1;
        var changedArgsJson = deviceUtilities.getChangedJsonFromNotificationXml(notificationXml);
        if (changedArgsJson) {
            var deviceId = deviceUtilities.getDeviceIdFromNotification(notificationXml);

            if (deviceId.contains(".LT")) {
                var lastIndex = deviceId.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
                if (lastIndex > -1) {
                    var ltBoardName = deviceId.substring(lastIndex + 1);
                }
                notificationReportArgs["ltBoardName"] = ltBoardName;
                stateDetailsCollector = {"name": deviceId};
            }


            if (Object.keys(changedArgsJson).indexOf(stateArgs[0]) >= 0) {
                stateDetailsCollector["softwareTargetsAligned"] = changedArgsJson[stateArgs[0]].toString();
                notificationReportArgs["softwareTargetsAligned"] = changedArgsJson[stateArgs[0]].toString();
                notificationReportArgs["softwareTargetsAlignedIndex"] = index++;
            }
            if (Object.keys(changedArgsJson).indexOf(stateArgs[1]) >= 0) {
                stateDetailsCollector["activeSoftware"] = changedArgsJson[stateArgs[1]];
                notificationReportArgs["activeSoftware"] = changedArgsJson[stateArgs[1]];
                notificationReportArgs["activeSoftwareIndex"] = index++;
            }
            if (Object.keys(changedArgsJson).indexOf(stateArgs[2]) >= 0) {
                stateDetailsCollector["passiveSoftware"] = changedArgsJson[stateArgs[2]];
                notificationReportArgs["passiveSoftware"] = changedArgsJson[stateArgs[2]];
                notificationReportArgs["passiveSoftwareIndex"] = index++;
            }
            if (stateDetailsCollector["softwareTargetsAligned"] && stateDetailsCollector["softwareTargetsAligned"] == "false") {
                stateReportArgs["allSoftwaresAligned"] = "false";
            }
            if(deviceId.contains(".LT")){
                //adding all the software fields under the ltDevices
                var ltDevices= [];
                ltDevices.push(stateDetailsCollector);
                stateReportArgs["ltDevices"] = ltDevices;
            }else{
                //since device is NT, adding the software fields to the parent
                stateReportArgs = stateDetailsCollector;
            }
            stateReportArgs["isNotificationHandler"] = "true";
            notificationReportArgs["intentType"] = intenType;
            notificationReportArgs["intentTargetName"] = input.getTarget();
        }

        logger.debug("stateReportArgs::{}", JSON.stringify(stateReportArgs));
        logger.debug("notificationReportArgs::{}", JSON.stringify(notificationReportArgs));

        //Sending notification on software state
        var changeNotificationXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "notificationReport.xml.ftl"), notificationReportArgs);
        logger.debug("changeNotificationXml:: {}", changeNotificationXml);
        var notification = utilityService.constructNCNotification(changeNotificationXml);
        notificationService.sendNotification("STATE_CHANGE", notification);


        //Framing stateReport for updating intent state page
        var stateReportFilePath = internalLsResourcePrefix + "stateReport.xml.ftl";
        var stateReportXml = deviceUtilities.getStateReport(stateReportArgs, stateReportFilePath);
        logger.debug("stateReportXml:: {}", stateReportXml);

        var handlerOutput = new com.nokia.fnms.controller.ibn.intenttype.spi.HandlerOutput();
        handlerOutput.setStateReport(stateReportXml);

        return handlerOutput;
    }
    return null;
}

DeviceUtilities.prototype.getValueFromXml = function(input, name) {
    var regex = new RegExp("<" + name + "[^>]*>(.*)<\/" + name + ">");

    try {
        var result = regex.exec(input)[1];
        return result;
    } catch (e) {
        return "";
    }
}

DeviceUtilities.prototype.getChangedJsonFromNotificationXml = function(notificationXml) {
    var prefixToNSMap = apUtils.prefixToNsMap;
    prefixToNSMap.put("xmlns", "urn:ietf:params:xml:ns:netconf:notification:1.0");
    prefixToNSMap.put("kfksrc", "http://www.nokia.com/management-solutions/kafka-notifications");
    prefixToNSMap.put("xmlns", "http://www.nokia.com/management-solutions/anv-netconf-stack");


    var extractedConfig = utilityService.extractSubtree(notificationXml, prefixToNSMap, "/*[local-name()='notification']/*[local-name()='netconf-state-change']/*[local-name()='changes']");
    var processedConfig = DocumentUtils.documentToPrettyStringWithXslt(extractedConfig);
    var changesJsonObject = JSON.parse(XML.toJSONObject(processedConfig));
    if (changesJsonObject) {
        var changedLeafJson = changesJsonObject["changes"]["changed-leaf"];
        var changedArgs = {};
        if (changedLeafJson) {
            if (Array.isArray(changedLeafJson)) {
                for (var index in changedLeafJson) {
                    var changedLeafValue = changedLeafJson[index]["value"];
                    if(changedLeafValue && Object.keys(changedLeafValue).length>0){
                        var keyString = Object.keys(changedLeafValue)[0];
                        changedArgs[keyString] = changedLeafValue[keyString]["content"];
                    }
                }
            } else{
                var changedLeafObj = changedLeafJson["value"];
                var keyString = Object.keys(changedLeafObj)[0];
                changedArgs[keyString] = changedLeafObj[keyString]["content"];
            }
        }
        return changedArgs;
    }
}

DeviceUtilities.prototype.getDeviceIdFromNotification = function(notificationXml) {
    var target = deviceUtilities.getValueFromXml(notificationXml, "target");
    if (target) {
        var deviceIdRegexPattern = "device-id='(.*?)'";
        var deviceId = target.match(deviceIdRegexPattern);
        return deviceId[1];
    }

}
