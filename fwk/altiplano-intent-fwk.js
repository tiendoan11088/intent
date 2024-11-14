




/**
* (c) 2020 Nokia. All Rights Reserved.
*
* INTERNAL - DO NOT COPY / EDIT
**/
load({script: resourceProvider.getResource('internal/altiplano-utilities.js'), name: 'altiplano-utilities.js'})
load({script: resourceProvider.getResource('internal/altiplano-virtualizer-fwk.js'), name: 'altiplano-virtualizer-fwk.js'});
load({script: resourceProvider.getResource('internal/altiplano-ams-fwk.js'), name: 'altiplano-ams-fwk.js'});
load({script: resourceProvider.getResource('internal/altiplano-nsp-fwk.js'), name: 'altiplano-nsp-fwk.js'});
load({script: resourceProvider.getResource('internal/altiplano-nsp-mdm-fwk.js'), name: 'altiplano-nsp-mdm-fwk.js'});
load({script: resourceProvider.getResource('internal/altiplano-acs-fwk.js'), name: 'altiplano-acs-fwk.js'});
load({script: resourceProvider.getResource('internal/altiplano-acs-utilities.js'), name: 'altiplano-acs-utilities.js'});
// Globals
var apUtils = new AltiplanoUtilities();
var apCapUtils = new AltiplanoCapsUtilities();
var requestScope = new ThreadLocal();
var acsUtils = new AltiplanoAcsUtilities();

/*
 * Constructor Function. We'll attach more property and methods by updating "prototype" object.
 */
function AltiplanoIntentHelper() {
    // The single input which MUST have all mandatory call back functions and properties to override behaviour.
    this.extensionConfig = null;
}

// Constants
AltiplanoIntentHelper.prototype.xFWK = "xFWK";
AltiplanoIntentHelper.prototype.SINGLETON = new AltiplanoIntentHelper();

/*
 * Intent Contract Implementation - Depends on extensionConfigObject
 */
AltiplanoIntentHelper.prototype.synchronize = function (input, deviceNameFilter) {
    logger.debug("AltiplanoIntentHelper::synchronize Called");
    /*
     * Pre-conditions
     */
    // Fwk Configured?
    this.validatePreConditions();

    var result = synchronizeResultFactory.createSynchronizeResult();


    var extraContainers;
    if (typeof this.extensionConfig.getExtraContainer === "function") {
        extraContainers = this.extensionConfig.getExtraContainer();
    }
    // Assume success during start. This is checked by updateSyncResult method.
    result.setSuccess(true);


    try {
        var requestContext = this.getRequestContext(input);
        requestContext.put("currentIntentOpertion", "sync");
        // Step 1: Determine Devices to be configured by this intent

        var deviceInfos = this.extensionConfig.getDevicesInvolved();


        if (deviceNameFilter){
            deviceInfos = apUtils.filterDevices(deviceInfos, deviceNameFilter);
        }
        this.checkManagerConnectivityState(deviceInfos);



        //Intent expected to blocked state for re-init use cases alone now - so this flow changed to take that into considerations
        var intentBlockedStatus = input.getBlockedStatus(); //Getting intent blocked status
        var isReinitializeAction = false;
        if (intentBlockedStatus && intentBlockedStatus == "true") { //Block state that mean we are moving from ISAM to LS
            this.deleteIsamAndCreateLsDevice(input, deviceInfos[0], extraContainers, isReinitializeAction, requestContext);
        }
        
        logger.debug("Devices Info: {}", JSON.stringify(deviceInfos));

        //Update the removed devices and add it in the request scope.
        if(!deviceNameFilter){
            this.updateRemovedDevices(requestContext, deviceInfos);
        }

        // Step 2: Iterate over devices & perform sync (we expect the manager-specific-fwk sync implementation to be efficient - audit and do sync only when necessary)
        this.executeSync(deviceInfos, input, result);



        var isDeviceSkippedInRemove = requestContext.get("isDeviceSkippedInRemove");
        if (requestContext.get("removedDevices") && (!isDeviceSkippedInRemove || isDeviceSkippedInRemove == "false") && (!deviceNameFilter) && (intentBlockedStatus && intentBlockedStatus == "false")) {
            if (requestContext.get("networkState") === "delete") {
                /*
                Assume the user changed the device when syncDirectly false.
                Also he changed the required n/w state to delete.
                So in this case we need run the sync on the removed devices also.
                */
                this.executeSync(requestContext.get("removedDevices"), input, result);
            } else {
                var clonedInput = apUtils.cloneSyncInput(input);
                clonedInput.setNetworkState(RequiredNetworkState.delete);
                this.executeSync(requestContext.get("removedDevices"), clonedInput, result);
            }
        }


        if (result.isSuccess() && requestContext.get("networkState") !== "delete") {
            apUtils.setTopologyExtraInfo(result.getTopology(), "ALL_DEVICES", JSON.stringify(deviceInfos));
            apUtils.setTopologyExtraInfo(result.getTopology(), "lastIntentConfig", JSON.stringify(requestContext.get("intentConfigJson")));
            if (requestContext.get("removedTopoKey")) {
                apUtils.removetoplogyXtraInfo(result.getTopology(), requestContext.get("removedTopoKey"));
            }
            if (requestContext.get("removedSecondaryTopoKey")) {
                apUtils.removetoplogyXtraInfo(result.getTopology(), requestContext.get("removedSecondaryTopoKey"));
            }
        } else if(result.isSuccess() && requestContext.get("networkState") === "delete") {
            apUtils.removetoplogyXtraInfo(result.getTopology(), "ALL_DEVICES"); // duyet qua cau truc va xoa ALL_DEVICES 
            apUtils.removetoplogyXtraInfo(result.getTopology(), "lastIntentConfig");
        }


        //////////////////////////////////////////////////////////////////////////


        var intentSensitiveKeys = apUtils.getIntentSensitiveKeys(input);
        //
        var sensitiveKeyFromIntent = this.extensionConfig.sensitiveKeyToBeRemoved; 
        if (sensitiveKeyFromIntent) {
            apUtils.setRedundantSensitiveKey(sensitiveKeyFromIntent);
        }
        var sensitiveKeyToBeRemoved = requestContext.get("sensitiveKeyToBeRemoved");
        //
        if(Object.keys(intentSensitiveKeys.sensitiveKeys).length > 0) {
            var getIntentSensitiveKeys = requestContext.get("objectMapOfPasswordList")
            apUtils.replaceSensitiveDataInXtraTopo(result.getTopology(), intentSensitiveKeys, objectMapOfPasswordList)
        }
        if(sensitiveKeyToBeRemoved && sensitiveKeyToBeRemoved.length > 0) {
            apUtils.removeSensitiveDataInXtraTopo(result.getTopology(), sensitiveKeyToBeRemoved)
        }
    } catch (e) {
        apUtils.translateErrorCodeAndErrorMessage(e, result);

        requestScope.remove();//
    }

    requestScope.remove(); // Finally block is supported ONLY in nashorn and not in Generic JS. So, I'm avoiding it. Perhaps, this ThreadLocal can be moved to IBN Core.
    logger.debug("Intent SWMGMT Final Result {}",apUtils.protectSensitiveDataLog(result));
    return result;
};

AltiplanoIntentHelper.prototype.bulkSynchronize = function (inputList, resultMap, deviceNameFilter) {
    logger.debug("AltiplanoIntentHelper::bulkSynchronize Called");

    this.validatePreConditions();
    var extraContainers;
    if (typeof this.extensionConfig.getExtraContainer === "function") {
        extraContainers = this.extensionConfig.getExtraContainer();
    }
    apUtils.storeContentInIntentScope("bulkSync", true);
    apUtils.storeContentInIntentScope("unprocessedIntentsCount", inputList.length);

    let managerType;
    let syncResults = new HashMap();
    for (let index in inputList) {
        let input = inputList[index];
        let targetName = input.getTarget();
        let result = null;
        if (resultMap && resultMap[targetName]) {
            result = resultMap[targetName];
        } else {
            resultMap = resultMap? resultMap : {};
            resultMap[input.getTarget()] = synchronizeResultFactory.createSynchronizeResult();
            result = resultMap[input.getTarget()];
        }
        if (result && !result.isSuccess() && result.getErrorDetail() == null && result.getErrorCode() == null) {
            // Assume success during start. This is checked by updateSyncResult method.
            result.setSuccess(true);
            try {
                var requestContext = this.getRequestContext(input);
                requestContext.put("currentIntentOpertion", "sync");
                // Step 1: Determine Devices to be configured by this intent
                var deviceInfos = this.extensionConfig.getDevicesInvolved();

                if (deviceNameFilter) {
                    deviceInfos = apUtils.filterDevices(deviceInfos, deviceNameFilter);
                }
                this.checkManagerConnectivityState(deviceInfos);

                //Intent expected to blocked state for re-init use cases alone now - so this flow changed to take that into considerations
                var intentBlockedStatus = input.getBlockedStatus(); //Getting intent blocked status
                var isReinitializeAction = false;
                if (intentBlockedStatus && intentBlockedStatus == "true") { //Block state that mean we are moving from ISAM to LS
                    this.deleteIsamAndCreateLsDevice(input, deviceInfos[0], extraContainers, isReinitializeAction, requestContext);
                }

                logger.debug("Devices Info: {}", JSON.stringify(deviceInfos));

                //Update the removed devices and add it in the request scope.
                if (!deviceNameFilter) {
                    this.updateRemovedDevices(requestContext, deviceInfos);
                }

                // Step 2: Iterate over devices & perform sync (we expect the manager-specific-fwk sync implementation to be efficient - audit and do sync only when necessary)
                if (deviceInfos && deviceInfos[0] && deviceInfos[0].managerType) {
                    managerType = deviceInfos[0].managerType;
                } else {
                    let managerInfo = apUtils.getManagerInfoFromEsAndMds(deviceInfos[0].name);
                    managerType = managerInfo.getType();
                }
                apUtils.storeContentInIntentScope("managerTypeOfBulkSyncDevice", managerType);
                this.executeSync(deviceInfos, input, result);
                var isDeviceSkippedInRemove = requestContext.get("isDeviceSkippedInRemove");
                if (requestContext.get("removedDevices") && (!isDeviceSkippedInRemove || isDeviceSkippedInRemove == "false") && (!deviceNameFilter) && (intentBlockedStatus && intentBlockedStatus == "false")) {
                    if (requestContext.get("networkState") === "delete") {
                        /*
                        Assume the user changed the device when syncDirectly false.
                        Also he changed the required n/w state to delete.
                        So in this case we need run the sync on the removed devices also.
                        */
                        this.executeSync(requestContext.get("removedDevices"), input, result);
                    } else {
                        var clonedInput = apUtils.cloneSyncInput(input);
                        clonedInput.setNetworkState(RequiredNetworkState.delete);
                        this.executeSync(requestContext.get("removedDevices"), clonedInput, result);
                    }
                }
                this.storeAllDataForTopologyAndEncryption(targetName, deviceInfos);
                if (!apUtils.bulkSyncAggregationSupported(managerType)) {
                    resultMap[targetName] = this.updateTopologyInResult(resultMap[targetName], inputList[index]);
                }
            } catch(e) {
                apUtils.translateErrorCodeAndErrorMessage(e, result);
                resultMap[targetName] = result;
            }
        }
        this.storeAllDataForTopologyAndEncryption(targetName, deviceInfos);
        apUtils.storeContentInIntentScope("unprocessedIntentsCount", inputList.length - (index + 1));
    }

    // Send bulk request to AV and update sync result
    if (apUtils.bulkSyncAggregationSupported(managerType) && apUtils.getContentFromIntentScope("unprocessedIntentsCount") != null && apUtils.getContentFromIntentScope("unprocessedIntentsCount") == 0) {
        let specificFwk = apUtils.getContentFromIntentScope("specificFwk");
        // Execute bulk-sync request
        let updatedSyncResult = specificFwk.executeBulkSyncRequestAndUpdateTopology();
        // Call post-sync method for each intent and update sync result object
        resultMap = this.callPostSyncAndUpdateResult(managerType, resultMap, updatedSyncResult, inputList);
        // Update topology and encrypt sensitive data in result obj
        for (let index in inputList) {
            let targetName = inputList[index].getTarget();
            resultMap[targetName] = this.updateTopologyInResult(resultMap[targetName], inputList[index]);
        }
    }
    requestScope.remove();
    // Set all result in bulkSyncResult
    for (let index=0; index<inputList.length; index++) {
        let input = inputList[index];
        let targetName = input.getTarget();
        let result = resultMap[targetName];
        // Get topologyXtraInfo from input and add that to result for each intent [should set proper xtraInfo for failure case also]
        if (result && result.getErrorDetail() != null && result.getErrorCode() != null) {
            let currentTopology = input.getCurrentTopology();
            let topologyXtraInfo = apUtils.getTopologyExtraInfo(currentTopology);
            Object.keys(topologyXtraInfo).forEach(function (topoKey) {
                apUtils.setTopologyExtraInfo(result.getTopology(), topoKey, topologyXtraInfo[topoKey]);
            });
        }
        // Encrypt sensitive data
        result = this.encryptSensitiveDataInResult(result, input);
        logger.debug("Intent SWMGMT Final Result for {} is {}", targetName, apUtils.protectSensitiveDataLog(result, targetName));
        apUtils.storeTargettedDevicesInScopeForBulkSync((result.isSuccess() && result.getTopology()) ? result.getTopology().getTopologyObjects() : null, input.getTarget());

        let intentTypeTarget = new IntentTypeTarget(input.getIntentType(), input.getIntentTypeVersion(), targetName);
        syncResults.put(intentTypeTarget, result);
    }
    var bulkSyncResult = new BulkSynchronizeResult();
    bulkSyncResult.setSynchronizeResults(syncResults);

    // Set null for target based values in intentScope
    apUtils.storeContentInIntentScope("storedValuesForTopologyUpdate", null);
    apUtils.storeContentInIntentScope("intentConfigObjectsForAllDevices", null);
    apUtils.storeContentInIntentScope("storedValuesForPostSync", null);
    apUtils.storeContentInIntentScope("resultMapForTopoUpdate", null);
    apUtils.storeContentInIntentScope("groupedRequest_forIHUB", null);
    apUtils.storeContentInIntentScope("groupedRequest_forDevice", null);
    apUtils.storeContentInIntentScope("intentConfigXml", null);

    return bulkSyncResult;
}

AltiplanoIntentHelper.prototype.storeAllDataForTopologyAndEncryption = function (targetName, deviceInfos) {
    let requestContext = requestScope.get();
    var requestContextValues = apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate")? apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate") : {};
    if (requestContextValues && !requestContextValues[targetName]) {
        requestContextValues[targetName] = {};
    }
    requestContextValues[targetName]["networkState"] = requestContext.get("networkState");
    requestContextValues[targetName]["intentConfigJson"] = requestContext.get("intentConfigJson");
    requestContextValues[targetName]["sensitiveKeyToBeRemoved"] = requestContext.get("sensitiveKeyToBeRemoved");
    requestContextValues[targetName]["objectMapOfPasswordList"] = requestContext.get("objectMapOfPasswordList");
    requestContextValues[targetName]["removedTopoKey"] = requestContext.get("removedTopoKey");
    requestContextValues[targetName]["removedSecondaryTopoKey"] = requestContext.get("removedSecondaryTopoKey");
    requestContextValues[targetName]["oamEncryptedPassword"] = requestContext.get("oamEncryptedPassword");
    requestContextValues[targetName]["deviceInfos"] = deviceInfos;
    requestContextValues[targetName]["isProfileDataNotAvailable"] = requestContext.get("isProfileDataNotAvailable");
    apUtils.storeContentInIntentScope("storedValuesForTopologyUpdate", requestContextValues);

}

AltiplanoIntentHelper.prototype.callPostSyncAndUpdateResult = function (managerType, resultMap, updatedSyncResult, inputList) {
    // Call postSyncronize and update sync result
    var self = this;
    let intentConfigObjectsForAllDevices = apUtils.getContentFromIntentScope("intentConfigObjectsForAllDevices");
    for (let inputListIndex=0; inputListIndex < inputList.length; inputListIndex++) {
        // Call postSyncronize()
        let input = inputList[inputListIndex];
        let targetName = input.getTarget();
        let syncResult = updatedSyncResult[targetName];
        let networkState = input.getNetworkState().name();
        let neverSynced = input.neverSynced;
        if (intentConfigObjectsForAllDevices && intentConfigObjectsForAllDevices[targetName]) {
            Object.keys(intentConfigObjectsForAllDevices[targetName]).forEach(function (deviceId) {
                let intentObject = intentConfigObjectsForAllDevices[targetName][deviceId];
                if (intentObject && intentObject.postSynchronize && syncResult && syncResult.getErrorDetail() == null && syncResult.getErrorCode() == null) {
                    try {
                        syncResult.setSuccess(true);
                        syncResult = intentObject.postSynchronize(input, networkState, syncResult);
                    } catch (e) {
                        logger.error("Exception caught in postSync : {}", e);
                        syncResult.setSuccess(false);
                        syncResult.setErrorCode("ERR-100");
                        syncResult.setErrorDetail(e);
                    }
                } else {
                    let valuesForPostSync = apUtils.getContentFromIntentScope("storedValuesForPostSync");
                    if (valuesForPostSync && valuesForPostSync[targetName] && valuesForPostSync[targetName]["misAlignedDevices"]) {
                        let misAlignedDevices = valuesForPostSync[targetName]["misAlignedDevices"];
                        let auditResult = valuesForPostSync[targetName]["auditResult"];
                        for (let deviceId in misAlignedDevices) {
                            let currentDevice = misAlignedDevices[deviceId];
                            if (currentDevice["steps"] && typeof currentDevice["steps"].push === "function") {
                                for (let index = 0; index < currentDevice["steps"].length; index++) {
                                    let step = currentDevice["steps"][index];
                                    if (networkState === intentConstants.NETWORK_STATE_DELETE || neverSynced == true || currentDevice["misAlignedSteps"].indexOf(step.name) > -1) {
                                        if (typeof step.postStepSynchronize === "function") {
                                            if (step.postStepSynchronize.length === 1) {
                                                let postSyncResult = step.postStepSynchronize(input);
                                                if (postSyncResult && postSyncResult.proceed === false) {
                                                    result.setSuccess(false);
                                                    result.setErrorCode(postSyncResult.errorCode);
                                                    result.setErrorDetail(postSyncResult.errorMessage);
                                                }
                                            } else if (step.postStepSynchronize.length === 2) {
                                                let postSyncResult = step.postStepSynchronize(input, result);
                                                if (postSyncResult && postSyncResult.proceed === false) {
                                                    result.setSuccess(false);
                                                    result.setErrorCode(postSyncResult.errorCode);
                                                    result.setErrorDetail(postSyncResult.errorMessage);
                                                }
                                            } else if (step.postStepSynchronize.length === 3) {
                                                let postSyncResult = step.postStepSynchronize(input, result, auditResult);
                                                if (postSyncResult && postSyncResult.proceed === false) {
                                                    result.setSuccess(false);
                                                    result.setErrorCode(postSyncResult.errorCode);
                                                    result.setErrorDetail(postSyncResult.errorMessage);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
            updatedSyncResult[targetName] = syncResult;
        }
        // Update Sync Result for bulk sync
        self.updateSyncResult(resultMap[targetName], updatedSyncResult[targetName]);
    }
    return resultMap;
}

AltiplanoIntentHelper.prototype.updateTopologyInResult = function (result, input) {
    let targetName = input.getTarget();
    let storedValuesFromScope = apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate");
    let storedValuesForTopoUpdate;
    if (storedValuesFromScope && storedValuesFromScope[targetName]) {
        storedValuesForTopoUpdate = storedValuesFromScope[targetName];
    } else {
        storedValuesForTopoUpdate = requestScope.get();
    }
    if (result.isSuccess() && storedValuesForTopoUpdate && storedValuesForTopoUpdate["networkState"] !== "delete") {
        apUtils.setTopologyExtraInfo(result.getTopology(), "ALL_DEVICES", JSON.stringify(storedValuesForTopoUpdate["deviceInfos"]));
        apUtils.setTopologyExtraInfo(result.getTopology(), "lastIntentConfig", JSON.stringify(storedValuesForTopoUpdate["intentConfigJson"]));
        if (storedValuesForTopoUpdate["removedTopoKey"]) {
            apUtils.removetoplogyXtraInfo(result.getTopology(), storedValuesForTopoUpdate["removedTopoKey"]);
        }
        if (storedValuesForTopoUpdate["removedSecondaryTopoKey"]) {
            apUtils.removetoplogyXtraInfo(result.getTopology(), storedValuesForTopoUpdate["removedSecondaryTopoKey"]);
        }
    } else if (result.isSuccess() && storedValuesForTopoUpdate && storedValuesForTopoUpdate["networkState"] === "delete") {
        apUtils.removetoplogyXtraInfo(result.getTopology(), "ALL_DEVICES");
        apUtils.removetoplogyXtraInfo(result.getTopology(), "lastIntentConfig");
    }

    return result;
}

AltiplanoIntentHelper.prototype.encryptSensitiveDataInResult = function (result, input) {
    let targetName = input.getTarget();
    let storedValuesFromScope = apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate");
    let storedValuesForEncryption;
    if (storedValuesFromScope && storedValuesFromScope[targetName]) {
        storedValuesForEncryption = storedValuesFromScope[targetName];
    } else {
        storedValuesForEncryption = requestScope.get();
    }
    let intentSensitiveKeys = apUtils.getIntentSensitiveKeys(input, targetName);
    let sensitiveKeyFromIntent = this.extensionConfig.sensitiveKeyToBeRemoved;
    if (sensitiveKeyFromIntent) {
        apUtils.setRedundantSensitiveKey(sensitiveKeyFromIntent, targetName);
    }
    if (storedValuesForEncryption) {
        let sensitiveKeyToBeRemoved = storedValuesForEncryption["sensitiveKeyToBeRemoved"];
        if (Object.keys(intentSensitiveKeys.sensitiveKeys).length > 0) {
            var objectMapOfPasswordList = storedValuesForEncryption["objectMapOfPasswordList"];
            apUtils.replaceSensitiveDataInXtraTopo(result.getTopology(), intentSensitiveKeys, objectMapOfPasswordList)
        }
        if (sensitiveKeyToBeRemoved && sensitiveKeyToBeRemoved.length > 0) {
            apUtils.removeSensitiveDataInXtraTopo(result.getTopology(), sensitiveKeyToBeRemoved)
        }
    }
    return result;
}

AltiplanoIntentHelper.prototype.deleteIsamAndCreateLsDevice = function (input, deviceInfo, extraContainers, isReinitializeAction, requestContext) {
    var managerInfo = apUtils.getManagerInfoFromEsAndMds(deviceInfo.name);
    if (managerInfo) {
        var intentConfigArgs = {};
        if (extraContainers) {
            apUtils.convertIntentConfigXmlToJson(input.getIntentConfiguration(), this.extensionConfig.getKeyForList, intentConfigArgs, null, extraContainers);
        } else {
            apUtils.convertIntentConfigXmlToJson(input.getIntentConfiguration(), this.extensionConfig.getKeyForList, intentConfigArgs);
        }
        if (intentConfigArgs && intentConfigArgs["device-manager"] && managerInfo.getName() != intentConfigArgs["device-manager"]) {
            if (managerInfo.getType() == intentConstants.MANAGER_TYPE_AMS) {
                var removedDevicesArray = [];
                var removedDeviceObj = {};
                removedDeviceObj.name = deviceInfo.name;
                removedDeviceObj.managerName = managerInfo.getName().toString();
                removedDeviceObj.managerType = managerInfo.getType().toString();
                removedDevicesArray.push(removedDeviceObj);

                requestContext.put("intentBlockedStatus", true);

                //Try to delete ISAM device
                var clonedInput = apUtils.cloneSyncInput(input);
                clonedInput.setNetworkState(RequiredNetworkState.delete);
                this.executeSync(removedDevicesArray, clonedInput, result);
                isReinitializeAction = true;
            } else if (managerInfo.getType() == intentConstants.MANAGER_TYPE_NAV) {
                var devices = [];
                devices.push(deviceInfo.name);
                devices.push(deviceInfo.name + intentConstants.DOT_LS_FX_IHUB);
                if (intentConfigArgs["boards"]) {
                    var Objectkeys = Object.keys(intentConfigArgs["boards"]);
                    Objectkeys.forEach(function (slotName) {
                        devices.push(deviceInfo.name + "." + slotName);
                    });
                }
                for (var i = 0; i < devices.length; i++) {
                    var args = {
                        "operation": {"value": "remove"},
                        "deviceID": {"value": devices[i]},
                        "isDeleteLsDeviceForRollbackReinit": {"value": true}
                    }
                    var request = utilityService.processTemplate(resourceProvider.getResource("internal/manager-specific/nv/createDevice/createDeviceRequest.xml.ftl"), args);
                    //Executing rpc to delete LS device in AV
                    var getConfigResponse = requestExecutor.executeNCWithManager(managerInfo.getName(), request);
                    if (getConfigResponse == null || getConfigResponse.getRawResponse() == null) {
                        throw new RuntimeException("Execution delete LS device failed with error " + getConfigResponse);
                    }
                }
            }
        }
    }
}

/** Action Method to synchronize IHUB devices
* @param actionInput 
* @returns result - success or failure
*/
AltiplanoIntentHelper.prototype.synchronizeNTiHUB = function (actionInput) {
    logger.debug("Synchronize NT - iHUB Action Trigered")
    try {
        var actionResult = apfwk.synchronize(actionInput, ".*\.IHUB");
        if (actionResult.success) {
            return utilityService.buildOkActionResponse();
        }
        else {
            return utilityService.buildErrorActionResponse(actionResult.errorDetail, actionResult.errorCode);
        }
    } catch (e) {
        logger.error("Error while execute Synchronize NT - iHUB Action {}", e.message);
        return utilityService.buildErrorActionResponse(e.message);
    }
}

AltiplanoIntentHelper.prototype.audit = function (input) {
    logger.debug("AltiplanoIntentHelper::audit Called");
    /*
     * Pre-conditions
     */
    // Fwk Configured?
    this.validatePreConditions();
    var requestContext = this.getRequestContext(input);
    requestContext.put("currentIntentOpertion", "audit");
    // Step 1: Determine Devices to be configured by this intent
    var deviceInfos = this.extensionConfig.getDevicesInvolved();
    logger.debug("Devices Info: {}", JSON.stringify(deviceInfos));

    //Update the removed devices and add it in the request scope.
    this.updateRemovedDevices(requestContext, deviceInfos);
    // Step 2: Iterate over devices & perform audit
    var auditReports = [];
    var isDeviceSkippedInRemove = requestContext.get("isDeviceSkippedInRemove");
    if(!isDeviceSkippedInRemove || isDeviceSkippedInRemove == "false"){
        if (requestContext.get("networkState") === "delete" && requestContext.get("removedDevices")) {
            /*
             Assume the user changed the device when syncDirectly false.
             Also he changed the required n/w state to delete.
             So in this case we need run the sync on the removed devices also.
             */
            this.executeAudit(requestContext.get("removedDevices"), input, auditReports);
        } else if (requestContext.get("removedDevices")){
            /* Assume we remove device configuration when we change to use another profile
            Here we only modify intent and not delete it.
            Hence, we need to support audit for removed devices even if networkState not "delete"
            */
            var clonedInput = apUtils.cloneSyncInput(input);
            clonedInput.setNetworkState(RequiredNetworkState.delete);
            this.executeAudit(requestContext.get("removedDevices"), clonedInput, auditReports);
        }
    }
    this.executeAudit(deviceInfos, input, auditReports);
    requestScope.remove();
    return auditUtility.mergeAuditReports(auditReports);
};

AltiplanoIntentHelper.prototype.checkInit = function () {
    if (this.extensionConfig == null) { // This method alone depends on the extensionConfig to check validity.
        throw new RuntimeException("AltiplanoIntentHelper instantiated but not configured");
    }
};

AltiplanoIntentHelper.prototype.setExtensionConfig = function (inputConfig) {
    this.extensionConfig = inputConfig;
};

AltiplanoIntentHelper.prototype.syncDevice = function (deviceInfo, input, intentConfigObject) {
    var specificFwk = this.createFwkInstance(deviceInfo, intentConfigObject);
    requestScope.get().put(this.xFWK, specificFwk); // xFWK: specificFwk

    if (apUtils.getContentFromIntentScope("bulkSync")) {
        apUtils.storeContentInIntentScope("specificFwk", specificFwk);
        
        let intentConfigObjectsForAllDevices = apUtils.getContentFromIntentScope("") ? apUtils.getContentFromIntentScope("intentConfigObjectsForAllDevices") : {};
        let targetName = input.getTarget();

        if (intentConfigObjectsForAllDevices && !intentConfigObjectsForAllDevices[targetName]) {
            intentConfigObjectsForAllDevices[targetName] = {};
        }
        let deviceName = deviceInfo.name;
        intentConfigObjectsForAllDevices[targetName][deviceName] = intentConfigObject;
        apUtils.storeContentInIntentScope("intentConfigObjectsForAllDevices", intentConfigObjectsForAllDevices);
    }
    return specificFwk.synchronize(input);
};

AltiplanoIntentHelper.prototype.auditDevice = function (deviceInfo, input, intentConfigObject) {
    var specificFwk = this.createFwkInstance(deviceInfo, intentConfigObject);
    requestScope.get().put(this.xFWK, specificFwk);
    return specificFwk.audit(input);
};

AltiplanoIntentHelper.prototype.createFwkInstance = function (deviceInfo, intentConfigObject) {
    switch (deviceInfo.managerType) {
        case "NAV":
        case "LOCAL":
            var netconfFwk = new AltiplanoNetconfIntentHelper();
            netconfFwk.setIntentObject(intentConfigObject);
            return netconfFwk;
        case "AMS":
            var amsFwk = new AltiplanoAMSIntentHelper();
            amsFwk.setIntentObject(intentConfigObject);
            return amsFwk;
        case intentConstants.MANAGER_TYPE_NSP:
        case intentConstants.MANAGER_TYPE_NSP_NFMP:
            var nspFwk = new AltiplanoNSPIntentHelper();
            nspFwk.setIntentObject(intentConfigObject);
            return nspFwk;
        case intentConstants.MANAGER_TYPE_NSP_MDM:
            var mdmFwk = new AltiplanoNSPMDMIntentHelper();
            mdmFwk.setIntentObject(intentConfigObject);
            return mdmFwk;
        case intentConstants.MANAGER_TYPE_NOKIA_ACS:
            var acsFwk = new AltiplanoACSIntentHelper();
            acsFwk.setIntentObject(intentConfigObject);
            return acsFwk;              
        default:
            throw new RuntimeException("Unknown Manager Type: " + deviceInfo.managerType);
    }
};

AltiplanoIntentHelper.prototype.updateSyncResult = function (original, update) {
    if (original != null && update != null) {
        original.setSuccess(original.isSuccess() && update.isSuccess());

        if(update.getErrorCode()){
            original.setErrorCode(update.getErrorCode());
        }

        original.setErrorDetail(update.getErrorDetail());
        original.setUpdateDependents(original.isUpdateDependents() || update.isUpdateDependents());
        original.setSyncDependents(original.isSyncDependents() || update.isSyncDependents());
        original.setForceStoreTopology(original.isForceStoreTopology() || update.isForceStoreTopology());
        original.setDeviceYetToBeConfigured(update.getDeviceYetToBeConfigured());
        var originalTopoHolder = original.getTopology();
        var topoUpdate = update.getTopology().getTopologyObjects();
        if (topoUpdate != null) {
            for (var i = 0; i < topoUpdate.size(); i++) {
                originalTopoHolder.addTopologyObject(topoUpdate.get(i));
            }
        }
        var xtraInfoUpdate = update.getTopology().getXtraInfo();
        if (xtraInfoUpdate != null) {
            for (var i = 0; i < xtraInfoUpdate.size(); i++) {
                originalTopoHolder.addXtraInfo(xtraInfoUpdate.get(i));
            }
        }
        var dependencyUpdate = update.getTopology().getDependencyInfo();
        if (dependencyUpdate != null) {
            originalTopoHolder.getDependencyInfo().addAll(dependencyUpdate);
        }
        var updatedGcHint=update.getGcHint();
        if(updatedGcHint != null){
            if (original.getGcHint() != null) {
                original.getGcHint().putAll(updatedGcHint);
            }
            else {
                original.setGcHint(updatedGcHint);
            }
        }

        var dependencyProfiles=update.getIntentProfiles();
        if (dependencyProfiles != null) {
            original.getIntentProfiles().addAll(dependencyProfiles);
        }
    }
};

AltiplanoIntentHelper.prototype.checkIfFunction = function (input, name) {
    if (!(typeof input === "function")) {
        throw new RuntimeException(name + " Callback Function is Mandatory.");
    }
};

AltiplanoIntentHelper.prototype.gatherInformationAboutDevices = function (deviceNames) {
    var result = [];
    for (var i in deviceNames) {
        var deviceInfo = deviceNames[i];
        if (typeof deviceInfo == "object") {
            var deviceName = Object.keys(deviceInfo)[0];
            var managerName = deviceInfo[deviceName].manager;
            var managerType = apUtils.getManagerByName(managerName).getType().name();
            result.push({
                "name": deviceName,
                "managerName": managerName,
                "managerType": managerType
            });
        } else if (!deviceInfo.startsWith("Local##")) {
            var managerInfo = apUtils.getAllManagersWithDevice(deviceInfo);

            if (managerInfo == null || managerInfo.isEmpty()) {
                throw new RuntimeException("Manager not found for device " + deviceInfo);
            }

            var mdsDeviceInfo = apUtils.getAllInfoFromDevices(deviceInfo);

            if (null == mdsDeviceInfo || mdsDeviceInfo.size() == 0) {
                throw new RuntimeException("Device not found: " + deviceInfo);
            }
            mdsDeviceInfo = mdsDeviceInfo.get(0);
            var familyTypeRel = mdsDeviceInfo.getFamilyTypeRelease();
            var managerName = mdsDeviceInfo.getManagerName();
            var managerType = apUtils.getManagerByName(managerName).getType().name();
            var familyType = null;
            if (familyTypeRel != null) {
                switch (managerType) {
                    case "NAV":
                        familyType = familyTypeRel.substring(0, familyTypeRel.lastIndexOf("-"));
                        break;
                    case "AMS":
                        familyType = familyTypeRel.substring(0, familyTypeRel.indexOf("."));
                        break;
                    case "NSP":
                    case "NSP_NFMP":
                    case "NSP_MDM":
                        familyType = familyTypeRel.substring(0, familyTypeRel.indexOf("-"));
                        break;
                    case "NOKIA_ACS":
                        familyType = familyTypeRel.substring(0, familyTypeRel.lastIndexOf("|"));
                        break;
                }
            }
            result.push({
                "name": deviceInfo,
                "familyTypeRelease": familyTypeRel,
                "familyType": familyType,
                "managerName": managerName,
                "managerType": managerType
            });
        } else {
            result.push({
                "name": deviceInfo,
                "familyTypeRelease": "LOCAL-1.0",
                "familyType": "LOCAL",
                "managerName": "##AC##",
                "managerType": "LOCAL"
            });
        }
    }
    return result;
};

AltiplanoIntentHelper.prototype.updateRemovedDevices = function (requestContext, deviceInfos) {
    var xtraInfo = apUtils.getTopologyExtraInfo(requestContext.get("currentTopology"));
    if (xtraInfo && xtraInfo["ALL_DEVICES"]) {
        var oldDevicesInfos = JSON.parse(xtraInfo["ALL_DEVICES"]);
        var removedDevices = apUtils.compareDeviceInfos(oldDevicesInfos, deviceInfos);
        if (removedDevices) {
            var skipDevices = requestContext.get("skipDeviceInRemovedDevices");
            if(skipDevices){
                removedDevices = apUtils.skipDeviceInRemovedDevices(removedDevices, skipDevices);
            }
            if(removedDevices.length > 0) {
            requestContext.put("removedDevices", removedDevices);
            }
        }
    }
};

AltiplanoIntentHelper.prototype.updateAggregateObject = function(syncUpdate, deviceInfo, result, intentConfigObject, aggregateObject) {
    syncUpdate["intentConfigObject"] = intentConfigObject;
    syncUpdate[this.xFWK] = requestScope.get().get(this.xFWK);
    if (aggregateObject[syncUpdate.managerName]) {
        aggregateObject[syncUpdate.managerName].push(syncUpdate);
    } else {
        aggregateObject[syncUpdate.managerName] = [];
        aggregateObject[syncUpdate.managerName].push(syncUpdate);
    }
};

AltiplanoIntentHelper.prototype.syncDeviceAndUpdateResult = function (deviceInfo, input, intentConfigObject, result, aggregateObject) {
    var syncUpdate = this.syncDevice(deviceInfo, input, intentConfigObject);
    //
    let managerType = apUtils.getContentFromIntentScope("managerTypeOfBulkSyncDevice");

    if (syncUpdate && syncUpdate.aggregatedRequest && syncUpdate["result"]) {
        // Assume we need to perform aggregate request.
        this.updateAggregateObject(syncUpdate, deviceInfo, result, intentConfigObject, aggregateObject);
    } else if (!managerType || (managerType && !apUtils.bulkSyncAggregationSupported(managerType))) {
        this.updateSyncResult(result, syncUpdate);
    }
};

AltiplanoIntentHelper.prototype.executeAggregateFinalizeAndUpdateResult = function (aggregateInput, result) {
    if (aggregateInput && Object.keys(aggregateInput).length > 0) {
        logger.debug("Sending aggregate input to request handlers");

        var requestContext = requestScope.get();
        var managerNames = Object.keys(aggregateInput);
        var isResultUpdatedAsFailed = false;
        for(var i = 0; i < managerNames.length; i ++) {
            if(!isResultUpdatedAsFailed) {
                var aggregateObjects = aggregateInput[managerNames[i]];
                var xFwk = aggregateObjects[0].xFWK;
                var aggregatedRequests = aggregateObjects.filter(function (aggregateObject) {
                    return typeof aggregateObject.aggregatedRequest === 'string';
                }).map(function (filteredObject) {
                    return filteredObject.aggregatedRequest
                });
                if (aggregatedRequests) {

                    //thuc thi yeu cau tu managerNames, sau do join lai thanh chuoi
                    xFwk.executeAggregateRequest(managerNames[i], aggregatedRequests.join("\n"));

                    for (var j = 0; j < aggregateObjects.length; j++) {
                        var childIntentConfigObject = aggregateObjects[j].intentConfigObject;
                        var childResult = aggregateObjects[j].result;
                        childResult = xFwk.finalize(requestContext.get("sync-input"), requestContext.get("networkState"),
                            childResult, childIntentConfigObject);

                        //cap nhat ket qua vao réult
                        this.updateSyncResult(result, childResult);



                        //in ra loi neu that bai
                        if (!childResult.isSuccess()) {
                            isResultUpdatedAsFailed = true; // It will stop the execution for other managers also.
                            break;
                        }
                    }
                }
            } else {
                // If execution failed for one manager we no need to execute further
                break;
            }
        }
        logger.debug("Received response for aggregate input from concerned  request handler");
    }
};

AltiplanoIntentHelper.prototype.executeSync = function (deviceInfos, input, result) {

    //tong hop input
    var aggregateInput = {};
    requestScope.get().put("deviceInfos",deviceInfos);
    
    for (var i = 0; i < deviceInfos.length; i++) {
        var deviceInfo = deviceInfos[i];
        // 2.1 : Get IntentConfigObject for the device.
        var intentConfigObject = this.extensionConfig.getIntentConfigFor(deviceInfo, input);
        if(!intentConfigObject) {
            throw new RuntimeException("Intent config object is null or empty");
        }

        // Check if the object returning the more than one intent object for same device
        if (typeof intentConfigObject.push === 'function') {
            if (intentConfigObject.length > 0) {
                // 2.2 : We're creating specific-fwk instance based on Device/ManagerType.
                for (var index = 0; index < intentConfigObject.length; index++) {
                    this.syncDeviceAndUpdateResult(deviceInfo, input, intentConfigObject[index], result, aggregateInput);
                }
            }
        } else {
            // 2.2 : We're creating specific-fwk instance based on Device/ManagerType.
            logger.debug("Invoking sync with handler specific to device: {}", deviceInfo.name);
            this.syncDeviceAndUpdateResult(deviceInfo, input, intentConfigObject, result, aggregateInput);
            logger.debug("Recieved aggregate input from handler for device: {}", deviceInfo.name);
        }
        if ((!aggregateInput || Object.keys(aggregateInput).length === 0) && !result.isSuccess()) {
            logger.error("Sync Failed for device {} with errorCode {} and errorDetail", deviceInfo.name, result.getErrorCode(), result.getErrorDetail());
            break;
        }
    }

    let managerType = apUtils.getContentFromIntentScope("managerTypeOfBulkSyncDevice");

    if (!managerType || (managerType && !apUtils.bulkSyncAggregationSupported(managerType))) {

        this.executeAggregateFinalizeAndUpdateResult(aggregateInput, result);
    }
};

AltiplanoIntentHelper.prototype.executeAudit = function (deviceInfos, input, auditReports) {
    for (var i = 0; i < deviceInfos.length; i++) {
        var deviceInfo = deviceInfos[i];
        // 2.1 : Get IntentConfigObject for the device.
        var intentConfigObject = this.extensionConfig.getIntentConfigFor(deviceInfo, input);
        // Check if the object returning the more than one intent object for same device
        if (typeof intentConfigObject.push === "function") {
            if (intentConfigObject.length > 0) {
                // 2.2 : We're creating specific-fwk instance based on Device/ManagerType.
                for (var index = 0; index < intentConfigObject.length; index++) {
                    var auditReport = this.auditDevice(deviceInfo, input, intentConfigObject[index]);
                    if (auditReport) {
                        auditReports.push(auditReport);
                    }
                }
            }
        } else {
            // 2.2 : We're creating specific-fwk instance based on Device/ManagerType.
            auditReport = this.auditDevice(deviceInfo, input, intentConfigObject);
            if (auditReport) {
                auditReports.push(auditReport);
            }
        }
    }
};

AltiplanoIntentHelper.prototype.validatePreConditions = function () {
    this.checkInit();
    // All Mandatory Call-back functions are available?
    this.checkIfFunction(this.extensionConfig.getDevicesInvolved, "getDevicesInvolved");
    this.checkIfFunction(this.extensionConfig.getIntentConfigFor, "getIntentConfigFor");
    logger.info('extensionConfig: {}',JSON.stringify(this.extensionConfig))
};

AltiplanoIntentHelper.prototype.getRequestContext = function (input) {
    var intentType = input.getIntentType();
    var target = input.getTarget();
    var requestContext = new HashMap();
    requestScope.set(requestContext);
    requestContext.put("sync-input", input);
    requestContext.put("target", target);
    requestContext.put("intentConfigXml", input.getIntentConfiguration());
    requestContext.put("currentTopology", input.getCurrentTopology());
    requestContext.put("networkState", input.getNetworkState().name());
    var intentConfigJson = {};
    apUtils.convertIntentConfigXmlToJsonForChoice( 
        input.getIntentConfiguration(),
        this.extensionConfig.getKeyForList,
        intentConfigJson,
        this.setExtensionConfig.choiceArray,["geo-coordinates"] , this.extensionConfig.emptyLeafOfList)
    requestContext.put("intentConfigJson", intentConfigJson);
    if(intentConstants.INTENT_TYPE_IMPACTED_BY_SENSITIVE_KEY.indexOf(intentType) != -1) {
        var pwdTypes = apUtils.getSensitiveKeys(input.getEncryptedIntentConfiguration()); // intent
        var profileSet = apUtils.getUsedProfilesOfIntent(intentType, target);
        var isNeverSynced;
        try {
            isNeverSynced = apUtils.isNeverSynced(intentType, target);
        }catch (e){
            //do nothing
        }
        // search sensitive value from usedProfile
        if (profileSet && profileSet.size() > 0) {
            profileSet.forEach(function (profileEntity) {
                var profile = JSON.parse(profileEntity.getProfileConfigJSON())
                var pwdKey = apUtils.getSensitiveKeys(profileEntity.getProfileConfig(), profileEntity.getProfileType());
                apUtils.setRedundantSensitiveKey(pwdKey);
                if(requestScope.get().get("sensitiveValues")){
                    var sensitiveValues = requestContext.get("sensitiveValues");
                }else{
                    var sensitiveValues = [];
                }
                apUtils.sensitiveKeyHandling(profile, pwdKey, sensitiveValues)
            })
        }else if(isNeverSynced && isNeverSynced == false){
            requestContext.put("isProfileDataNotAvailable", true);
        }
        // search sensitive value from intent's yang
        if(pwdTypes.length > 0) {
            if(requestScope.get().get("sensitiveValues")){
                var sensitiveValues = requestContext.get("sensitiveValues");
            }else{
                var sensitiveValues = [];
            }
            apUtils.sensitiveKeyHandling(intentConfigJson, pwdTypes, sensitiveValues);
        }
    }
    return requestContext;
};

/**
 * Checks the connectivity state of manager based on the deviceInfo
 *
 * @param deviceInfos
 */
AltiplanoIntentHelper.prototype.checkManagerConnectivityState = function (deviceInfos) {
    var managerInfos = {};
    var devicesWithoutManagerInfo = [];
    deviceInfos.filter(function (deviceInfo) {
        // Get unique manager names among all devices
        if (deviceInfo && deviceInfo.managerName && deviceInfo.managerType && deviceInfo.managerType != intentConstants.MANAGER_TYPE_LOCAL) {
            managerInfos[deviceInfo.managerName] = deviceInfo.managerType;
        } else if (!deviceInfo.managerName) {
            devicesWithoutManagerInfo.push(deviceInfo);
        }
    });
    if (devicesWithoutManagerInfo && devicesWithoutManagerInfo.length > 0) {
        devicesWithoutManagerInfo.forEach(function (device) {
            var devicesInfo = apUtils.getAllInfoFromDevices(device.name);
            if (devicesInfo == null || devicesInfo.isEmpty()) {
                throw new RuntimeException("Device not found: " + device.name);
            }
            if (devicesInfo && devicesInfo.managerName && devicesInfo.managerType && devicesInfo.managerType != intentConstants.MANAGER_TYPE_LOCAL) {
                managerInfos[devicesInfo.managerName] = devicesInfo.managerType;
            }
        });
    }
    if (managerInfos && Object.keys(managerInfos).length > 0) {
        Object.keys(managerInfos).forEach(function (managerName) {
            // Find connectivity state with manager name
            var managerType = managerInfos[managerName];
            if (managerType == intentConstants.MANAGER_TYPE_NAV && intentConstants.MANAGER_DISCONNECTED_STATE == apUtils.getConnectivityState(managerName, intentConstants.NETCONF_PROTOCOL)) {
                throw new RuntimeException("Can't connect to Altiplano AV : " + managerName);
            } else if (managerType != intentConstants.MANAGER_TYPE_NAV) {
                var manager = apUtils.getManagerByName(managerName);
                if (!manager) {
                    throw new RuntimeException("Manager not found in MDS: " + managerName);
                }
                if (manager.getConnectivityState().toString() === intentConstants.MANAGER_DISCONNECTED_STATE) {
                    if (managerType === intentConstants.MANAGER_TYPE_AMS) {
                        throw new RuntimeException("Cannot connect to AMS manager: " + managerName);
                    } else if (managerType === intentConstants.MANAGER_TYPE_NSP) {
                        throw new RuntimeException("Can't connect to NSP :" + managerName);
                    } else if (managerType === intentConstants.MANAGER_TYPE_NSP_MDM) {
                        throw new RuntimeException("Can't connect to NSP_MDM :" + managerName);
                    } else if (managerType === intentConstants.MANAGER_TYPE_NOKIA_ACS) {
                        throw new RuntimeException("Can't connect to NOKIA ACS Manager :" + managerName);
                    } else {
                        throw new RuntimeException("Can't connect : " + managerName);
                    }
                }
            }
        });
    }
}
