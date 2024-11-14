/**
* (c) 2020 Nokia. All Rights Reserved.
*
* INTERNAL - DO NOT COPY / EDIT
**/
/*
 * Constructor Function
 */
function AltiplanoNetconfIntentHelper() {
    this.self = this;
    this.intentObject = null;

    this.prefixToNsMap = new HashMap();
    // Altiplano
    this.prefixToNsMap.putAll(apUtils.altiplanoPrefixToNsMap());
    // XPON
    this.prefixToNsMap.putAll(apUtils.xponPrefixToNsMap());
    // Copper
    this.prefixToNsMap.putAll(apUtils.copperPrefixToNsMap());

    /**
     * Default Namespace to module mapping
     */
    this.nsToModuleMap = new HashMap();
    // Altiplano
    this.nsToModuleMap.putAll(apUtils.altiplanoNsToModuleMap());
    //XPON
    this.nsToModuleMap.putAll(apUtils.xponNsToModuleMap());
    // Copper
    this.nsToModuleMap.putAll(apUtils.copperNsToModuleMap());
}

/*
 * Static Constants
 */
AltiplanoNetconfIntentHelper.prototype.requestHeader = "<rpc xmlns=\"urn:ietf:params:xml:ns:netconf:base:1.0\" xmlns:xc=\"urn:ietf:params:xml:ns:netconf:base:1.0\" message-id=\"6\"  xmlns:ibn=\"http://www.nokia.com/management-solutions/ibn\" >\n" +
"    <edit-config>\n" +
"        <target>\n" +
"            <running/>\n" +
"        </target>\n" +
"        <config>\n" +
"           <anv:device-manager xmlns:anv=\"http://www.nokia.com/management-solutions/anv\">\n";

AltiplanoNetconfIntentHelper.prototype.requestFooter = "</anv:device-manager>"+
"</config>\n" +
"    </edit-config>\n" +
"</rpc>";

AltiplanoNetconfIntentHelper.prototype.requestHeaderForBulkSync = "<rpc xmlns=\"urn:ietf:params:xml:ns:netconf:base:1.0\" message-id=\"1\" xmlns:xc=\"urn:ietf:params:xml:ns:netconf:base:1.0\">\n" +
    "    <aggregated-edit-config xmlns=\"http://www.nokia.com/management-solutions/anv-netconf-stack\">\n" +
    "        <edit-config-payload>\n" +
    "            <config>\n";

AltiplanoNetconfIntentHelper.prototype.requestFooterForBulkSync = "</config>\n" +
    "        </edit-config-payload>\n" +
    "    </aggregated-edit-config>\n" +
    "</rpc>"

AltiplanoNetconfIntentHelper.prototype.configStartElement = "<config>";

AltiplanoNetconfIntentHelper.prototype.configEndElement = "</config>";

AltiplanoNetconfIntentHelper.prototype.deviceLockRequest = "<rpc message-id=\"101\" xmlns=\"urn:ietf:params:xml:ns:netconf:base:1.0\">\n" +
"<action xmlns=\"urn:ietf:params:xml:ns:yang:1\">\n" +
"<anv:device-manager xmlns:anv=\"http://www.nokia.com/management-solutions/anv\">\n" +
"<adh:device xmlns:adh=\"http://www.nokia.com/management-solutions/anv-device-holders\">\n" +
"<adh:device-id>${deviceId}</adh:device-id>\n" +
"<adh:lock-for-migration/>\n" +
"</adh:device>\n" +
"</anv:device-manager>\n" +
"</action>\n" +
"</rpc>";

AltiplanoNetconfIntentHelper.prototype.deviceUnlockRequest = "<rpc message-id=\"101\" xmlns=\"urn:ietf:params:xml:ns:netconf:base:1.0\">\n" +
"<action xmlns=\"urn:ietf:params:xml:ns:yang:1\">\n" +
"<anv:device-manager xmlns:anv=\"http://www.nokia.com/management-solutions/anv\">\n" +
"<adh:device xmlns:adh=\"http://www.nokia.com/management-solutions/anv-device-holders\">\n" +
"<adh:device-id>${deviceId}</adh:device-id>\n" +
"<adh:unlock-for-migration/>\n" +
"</adh:device>\n" +
"</anv:device-manager>\n" +
"</action>\n" +
"</rpc>";

AltiplanoNetconfIntentHelper.prototype.retrySoftwareAlignmentRequest = "<rpc xmlns=\"urn:ietf:params:xml:ns:netconf:base:1.0\" message-id=\"3\">\n" +
"<retry-software-alignment xmlns=\"http://www.nokia.com/management-solutions/anv-software\">\n" +
"<device-id>${deviceId}</device-id>\n" +
"</retry-software-alignment>\n" +
"</rpc>";


AltiplanoNetconfIntentHelper.prototype.ANV = "anv:";
AltiplanoNetconfIntentHelper.prototype.SLASH = "/";


/**
 * Method to configure this instance.
 */
AltiplanoNetconfIntentHelper.prototype.setIntentObject = function (intentObjectIncoming) {
  this.intentObject = intentObjectIncoming;
};

/**
 * Public audit Method to be called by IBN.
 *
 * @param audit Input
 *          Target, Required Network State, Configuration and Current Topology
 * @returns Audit Report.
 */
AltiplanoNetconfIntentHelper.prototype.audit = function (input) {
    var target = input.getTarget();
    var intentConfig = input.getIntentConfiguration();
    var topology = input.getCurrentTopology();
    var networkState = input.getNetworkState();
    logger.debug("onAudit with networkState: {}", networkState);
    var intentConfigJson = {};
    apUtils.convertIntentConfigXmlToJson(intentConfig, this.intentObject.getKeyForList, intentConfigJson);

    var deviceReport = this.constructDevices(target, intentConfig, intentConfigJson, topology);

    // Skip doAudit if device doesn't exist
    if (Object.keys(deviceReport["currentDeviceList"]).length == 0 && this.intentObject["skipSyncAuditIfDeviceNotExist"]){
        return null;
    }
    var auditReport = this.doAudit(target, intentConfigJson, intentConfig, networkState, topology, "audit").auditReport;
    // the below block execute before send the final audit report to ibn.
    if (this.intentObject.postAudit && typeof this.intentObject.postAudit === 'function') {
        try {
            // The method can update the existing auditReport object.
            this.intentObject.postAudit(target, intentConfigJson, networkState, topology, auditReport);
        } catch (e) {
            logger.debug ("Error while executing the post audit : {}", e);
        }
    }
    if(auditReport && auditReport["misAlignedObjects"]){	
        auditReport["misAlignedObjects"].forEach(function(misAlignedObj){    
            if(misAlignedObj["objectId"].split("sap=")[0] && misAlignedObj["objectId"].split("sap=")[1]){
                misAlignedObj["objectId"] = misAlignedObj["objectId"].split("sap=")[0] + "sap=" + misAlignedObj["objectId"].split("sap=")[1].replaceAll("/","%2F");
            }
        }); 	
    }
    return auditReport;
};

AltiplanoNetconfIntentHelper.prototype.synchronize = function(input) {
    // logger.debug("netconf-fwk sync called...");
    var result = null;
    try {
        result = this.doSynchronize(input);
    } catch (e) {
        logger.error ("Error from Script {}", e);
        result = synchronizeResultFactory.createSynchronizeResult();
        result.setSuccess(false);
        result.setErrorCode("ERR-100");
        result.setErrorDetail(e);
        throw e;
    }
    return result;
};

AltiplanoNetconfIntentHelper.prototype.doSynchronize = function(input) {
    var target = input.getTarget();
    var intentConfigXml = input.getIntentConfiguration();
    let intentType = input.getIntentType();
    var topology = input.getCurrentTopology();
    var networkState = input.getNetworkState().name();
    var contextArgumentsMap = new HashMap();
    var xtraTopologyObject = {};

    var bulkSync = apUtils.getContentFromIntentScope("bulkSync");
    let resultMapForTopoUpdate;
    if (bulkSync) {
        resultMapForTopoUpdate = apUtils.getContentFromIntentScope("resultMapForTopoUpdate")? apUtils.getContentFromIntentScope("resultMapForTopoUpdate") : new HashMap();
    }
    let result = synchronizeResultFactory.createSynchronizeResult();
    // Skip sync if result has error for same target
    // For example:
    // Move ONT from LT1 to LT2 (new config should be pushed to LT2 and old config should be removed from LT1).
    // If edit-config failed for LT2 then no need to send request for LT1
    if (!result || (result && result.getErrorDetail() == null && result.getErrorCode() == null)) {
        try {
            result.setTopology(topologyFactory.createServiceTopology());
            if (input.getCurrentTopology() != null) {
                // We don't need any topology updates without anything generated by
                // SYNC. But, we need the Xtra Info for remembrance support.
                result.getTopology().setXtraInfo(input.getCurrentTopology().getXtraInfo());
                result.getTopology().setDependencyInfo(input.getCurrentTopology().getDependencyInfo());
            } else {
                topology = result.getTopology();
            }

            var intentConfigJson = {};
            apUtils.convertIntentConfigXmlToJson(intentConfigXml, this.intentObject.getKeyForList, intentConfigJson);
            var deviceReport = this.constructDevices(target, intentConfigXml, intentConfigJson, topology);
            // Skip doAudit and doSynchronize if device doesn't exist
            if (Object.keys(deviceReport["currentDeviceList"]).length == 0 && this.intentObject["skipSyncAuditIfDeviceNotExist"]) {
                result.setSuccess(true);
                return result;
            }

            if (networkState !== "delete") {
                if (typeof this.intentObject.getDependencyProfiles === "function") {
                    var dependencyProfilesUsed = this.intentObject.getDependencyProfiles(intentConfigJson, target);
                    if (dependencyProfilesUsed) {
                        result.setIntentProfiles(apUtils.getObjectSet(dependencyProfilesUsed));
                    }
                }
            }
            var auditForDelete = false;
            if (this.intentObject["auditForDelete"] !== "undefined" && typeof this.intentObject["auditForDelete"] === "boolean") {
                auditForDelete = this.intentObject["auditForDelete"];
            }
            var auditResult;
            var neverSynced = input.neverSynced===undefined? false: input.neverSynced;
            if (networkState === "delete" || neverSynced == true) {
                if(networkState === "delete" && auditForDelete == true){
                   auditResult = this.doAudit(target, intentConfigJson, intentConfigXml, networkState, topology, "sync");
                   var misAlignedDevices = auditResult.misAlignedDevices;
                   var configMatchedAndMarkedAsMisAligned = auditResult.configMatchedAndMarkedAsMisAligned;
                }else{
                   //skip audit
                   var misAlignedDevices = deviceReport["currentDeviceList"];
                }
            } else if (neverSynced == false) {
                auditResult = this.doAudit(target, intentConfigJson, intentConfigXml, networkState, topology, "sync");
                var misAlignedDevices = auditResult.misAlignedDevices;
                var configMatchedAndMarkedAsMisAligned = auditResult.configMatchedAndMarkedAsMisAligned;
            }
            var sortedMisalignedDeviceNamesAndOrder = this.constructSortedDeviceArrayWithNameAndOrder(misAlignedDevices);
            logger.debug("sortedMisalignedDeviceNamesAndOrder : {}" , JSON.stringify(sortedMisalignedDeviceNamesAndOrder));
            if (misAlignedDevices) {
                let valuesToStoreForPostSync = apUtils.getContentFromIntentScope("storedValuesForPostSync") ? apUtils.getContentFromIntentScope("storedValuesForPostSync") : {};
                valuesToStoreForPostSync[target] = valuesToStoreForPostSync[target] ? valuesToStoreForPostSync[target] : {};
                valuesToStoreForPostSync[target]["misAlignedDevices"] = misAlignedDevices;
                valuesToStoreForPostSync[target]["auditResult"] = auditResult;
                apUtils.storeContentInIntentScope("storedValuesForPostSync", valuesToStoreForPostSync);
            }
            result.setUpdateDependents(false);
            result.setSyncDependents(false);
            result.setForceStoreTopology(false);
            if (sortedMisalignedDeviceNamesAndOrder.length > 0) {
                if(typeof this.intentObject.syncDependents === "boolean"){
                    result.setSyncDependents(this.intentObject.syncDependents);
                }
                if(typeof this.intentObject.getDependencyInfo === "function"){
                    var dependencyInfo = this.intentObject.getDependencyInfo(input);
                    logger.debug("doSynchronize Dependency Info {}", JSON.stringify(dependencyInfo));
                    result.getTopology().setDependencyInfo(this.getTransformedDependencyInfo(dependencyInfo));
                }
                //forceStoreTopology flag is used to tell the IBN whether to persist the Topology even there is a failure in Sync.
                if(typeof this.intentObject.forceStoreTopology === "boolean"){
                    result.setForceStoreTopology(this.intentObject.forceStoreTopology);
                }
                if (input.getCurrentTopology() != null) {
                    result.getTopology().setTopologyObjects(input.getCurrentTopology().getTopologyObjects());
                    var topoObjectList = result.getTopology().getTopologyObjects();
                    for (var i = 0; i < topoObjectList.size(); i++) {
                        var topoObject = topoObjectList.get(i);
                        topoObject.setTimestamp(null);
                        topoObject.setTarget(null);
                        topoObject.setIntentType(null);
                    }
                }
                var xtraInfos = apUtils.getTopologyExtraInfo(result.getTopology());

                var deviceTemplateArgs = {};
                var requestXmlAggregated = {};
                var self = this;

                for (var d = 0; d < sortedMisalignedDeviceNamesAndOrder.length; d++) {
                    var deviceNameAndOrder = sortedMisalignedDeviceNamesAndOrder[d];
                    var deviceId = deviceNameAndOrder.deviceName;
                    var currentDevice = misAlignedDevices[deviceId];
                    contextArgumentsMap.put(deviceId, new HashMap());
                    var deviceRequiredState = networkState;
                    if (typeof misAlignedDevices[deviceId].removed === "string") {
                        deviceRequiredState = "delete";
                    }

                    if (typeof xtraInfos[this.intentObject.stageName + "_" + deviceId + "_ARGS"] === "string") {
                        deviceTemplateArgs = JSON.parse(xtraInfos[this.intentObject.stageName + "_" + deviceId + "_ARGS"]);
                    }
                    var self = this;
                    var prepareForSync = function (stepName) {
                        var operation = "merge";
                        if (deviceRequiredState === "delete") {
                            operation = "remove";
                        }

                        // Basic Arguments prepared from Intent Config and all
                        // well-known fields of Intent
                        // NOTE: We're cloning and passing intentConfigJson to avoid
                        // accidental damage (if done by intent-type call-backs)
                        // across devices/steps.
                        // For Audit: Operation is ""
                        var baseTemplateArguments = self.basicTemplateArguments(JSON.parse(JSON.stringify(intentConfigJson)), intentConfigXml, target, deviceRequiredState, operation, misAlignedDevices, deviceId, stepName);
                        var templateArgsReport = self.constructTemplateArguments(baseTemplateArguments, result.getTopology());
                        contextArgumentsMap.get(deviceId).put(stepName, templateArgsReport);
                        var templateArgsWithDiff = templateArgsReport.templateArgsWithDiff;
                        var templateArgs = templateArgsReport.templateArgs;
                        if (stepName) {
                            logger.debug("device {} step {} synchronize templateArgsWithDiff {}", deviceId, stepName, apUtils.protectSensitiveDataLog(templateArgsWithDiff));
                        } else {
                            logger.debug("device {} synchronize templateArgsWithDiff {}", deviceId, apUtils.protectSensitiveDataLog(templateArgsWithDiff));
                        }

                        var resourceFile = self._getResourceFile(self.intentObject, intentConfigJson, deviceId, stepName, templateArgsWithDiff);
                        var requestXml;
                        if (!(currentDevice["steps"] && typeof currentDevice["steps"].push === "function") || (operation === "remove" || neverSynced == true || misAlignedDevices[deviceId]["misAlignedSteps"].indexOf(stepName) > -1)) {
                            // Sync devices only for master set or only the misaligned
                            // steps on misaligned devices.
                            // On remove operation,It would execute for all the steps.
                            requestXml = utilityService.processTemplate(resourceProvider.getResource(resourceFile), templateArgsWithDiff);
                        }
                        if (templateArgs["step"] && templateArgs.skipAttributeInXtraInfo && templateArgs.skipAttributeInXtraInfo.length > 0) {
                            var updatedTemplateArgs = apUtils.protectSensitiveData(templateArgs, templateArgs["step"].skipAttributeInXtraInfo, true);
                        } else if (self.intentObject.skipAttributeInXtraInfo && self.intentObject.skipAttributeInXtraInfo.length > 0) {
                            updatedTemplateArgs = apUtils.protectSensitiveData(templateArgs, self.intentObject.skipAttributeInXtraInfo, true);
                        } else {
                            updatedTemplateArgs = templateArgs;
                        }
                        var prepareResult = {
                            "templateArgs": updatedTemplateArgs,
                            "requestXml": requestXml,
                            "templateArgsWithDiff": templateArgsWithDiff,
                        }
                        return prepareResult;
                    }
                    var self = this;
                    var updateXtraInfoInMemory = function () {
                        if (typeof self.intentObject.trackedArgs === "object") {
                            if (typeof misAlignedDevices[deviceId].removed === "string") {
                                apUtils.removetoplogyXtraInfo(result.getTopology(), self.intentObject.stageName + "_" + deviceId + "_ARGS");
                            } else {
                                if (deviceTemplateArgs["deviceCreation"] || deviceTemplateArgs["swMatches"] || deviceTemplateArgs["swAlignmentStep"] || deviceTemplateArgs["plugMatches"] || deviceTemplateArgs["configureLtDevice"] || deviceTemplateArgs["planBoards"] || deviceTemplateArgs["createLtPorts"] || deviceTemplateArgs["configureCallHomeContainer"]) {
                                    try {
                                        var obj = {};
                                        obj["deviceCreation"] = deviceTemplateArgs["deviceCreation"];
                                        obj["swMatches"] = deviceTemplateArgs["swMatches"];
                                        obj["swAlignmentStep"] = deviceTemplateArgs["swAlignmentStep"];
                                        obj["plugMatches"] = deviceTemplateArgs["plugMatches"];
                                        obj["configureLtDevice"] = deviceTemplateArgs["configureLtDevice"];
                                        obj["planBoards"] = deviceTemplateArgs["planBoards"];
                                        obj["createLtPorts"] = deviceTemplateArgs["createLtPorts"];
                                        obj["configureCallHomeContainer"] = deviceTemplateArgs["configureCallHomeContainer"];
                                        apUtils.setTopologyExtraInfo(result.getTopology(), self.intentObject.stageName + "_" + deviceId + "_ARGS", JSON.stringify(obj));
                                    } catch (e) {
                                        logger.error("Error while store the extra info details {}", e);
                                        throw new RuntimeException("Error while store the extra info details");
                                    }
                                }
                                //Set topology extra info when sync is successful
                                xtraTopologyObject[self.intentObject.stageName + "_" + deviceId + "_ARGS"] = JSON.stringify(deviceTemplateArgs);
                            }
                        }
                    }

                    var aggregateRequestXml = function (requestXml, manager) {
                        if (!requestXmlAggregated[manager]) {
                            requestXmlAggregated[manager] = new ArrayList();
                        }
                        requestXmlAggregated[manager].add(requestXml);
                    }

                    if (deviceId.startsWith("Local##")) {
                        var localManagers = mds.getAllManagersOfType(intentConstants.MANAGER_TYPE_LOCAL);
                        logger.debug("Fetching the Local manager list: {}", localManagers);
                        var deviceManager = localManagers[0];
                    } else {
                        if (currentDevice.managerName) {
                            var deviceManager = currentDevice.managerName;
                        } else {
                            var deviceManager = apUtils.getManagerInfo(deviceId).getName();
                        }
                    }
                    if (currentDevice["steps"] && typeof currentDevice["steps"].push === "function") {
                        // Multi step device - sync each step.
                        var steps = misAlignedDevices[deviceId]["steps"];
                        if (networkState === "delete") {
                            steps = steps.reverse();
                        }
                        for (var j = 0; j < steps.length; j++) {

                            var step = steps[j];
                            var syncInputs = prepareForSync(step.name);
                            if (networkState === "delete" || neverSynced == true || currentDevice["misAlignedSteps"].indexOf(step.name) > -1) {
                                // This is a step considered (misaligned by audit) for
                                // Sync.
                                // Removed the argument count check for now.Will add
                                // after updated other impacted intents
                                if (typeof step.preStepSynchronize === "function") {
                                    var preSyncResult = step.preStepSynchronize(input, syncInputs.templateArgsWithDiff, result, auditResult);
                                    if (preSyncResult && preSyncResult.proceed === false) {
                                        result.setSuccess(false);
                                        result.setErrorCode(preSyncResult.errorCode);
                                        result.setErrorDetail(preSyncResult.errorMessage);
                                        if (!bulkSync) {
                                            return result;
                                        }
                                    }
                                }
                            }


                            deviceTemplateArgs[step.name] = syncInputs.templateArgs;
                            /**In case of device migration, there are some steps is used with skipEditConfigRequest: true
                             * At that time, to make sure the old configuration is tracked properly, the old templateArgs
                             * must be kept
                             */
                            let skipEditConfigRequest = step.skipEditConfigRequest;
                            if (typeof step.skipEditConfigRequest === "function") {
                                skipEditConfigRequest = step.skipEditConfigRequest(deviceId, syncInputs.templateArgsWithDiff);
                            }
                            if (skipEditConfigRequest && step.getTemplateArgsForTopology && typeof step.getTemplateArgsForTopology === "function") {
                                deviceTemplateArgs[step.name] = step.getTemplateArgsForTopology(deviceId, syncInputs.templateArgsWithDiff, syncInputs.templateArgs, self.intentObject.stageName + "_" + deviceId + "_ARGS");
                            }
                            var dependentsImpacted = this.isDependencyUpdated(syncInputs.templateArgsWithDiff);
                            result.setUpdateDependents(dependentsImpacted);
                            updateXtraInfoInMemory();
                            var requestXml = syncInputs.requestXml;
                            if (!skipEditConfigRequest) {
                                if (requestXml) {
                                    if (bulkSync) {
                                        // Group edit-config request by device-id and pon name/device-id if it is bulk sync
                                        if (syncInputs.templateArgsWithDiff && syncInputs.templateArgsWithDiff.target && syncInputs.templateArgsWithDiff.target.value && syncInputs.templateArgsWithDiff.bulkAggregationKey && syncInputs.templateArgsWithDiff.bulkAggregationKey.value) {
                                            let targetName = syncInputs.templateArgsWithDiff.target.value;
                                            let bulkAggregationKey = syncInputs.templateArgsWithDiff.bulkAggregationKey.value;
                                            this.groupAndStoreRequestInIntentScope(deviceId, deviceManager, bulkAggregationKey, targetName, requestXml);
                                            // store xtraTopologyObject for each misaligned device in intent scope
                                            let valuesToStore = apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate") ? apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate") : {};
                                            if (valuesToStore && !valuesToStore[targetName]) {
                                                valuesToStore[targetName] = {};
                                            }
                                            if (valuesToStore[targetName] && !valuesToStore[targetName]["xtraTopologyObject"]) {
                                                valuesToStore[targetName]["xtraTopologyObject"] = {};
                                            }
                                            valuesToStore[targetName]["xtraTopologyObject"][self.intentObject.stageName + "_" + deviceId + "_ARGS"] = xtraTopologyObject[self.intentObject.stageName + "_" + deviceId + "_ARGS"];
                                            apUtils.storeContentInIntentScope("storedValuesForTopologyUpdate", valuesToStore);
                                        }

                                    } else {
                                        // Send edit-config request to AV if it is not bulk sync
                                        if (this.intentObject.aggregateEditConfigs === "manager") {
                                            aggregateRequestXml(requestXml, deviceManager);
                                            if (typeof step.postStepSynchronize === "function" && step.postStepSynchronize.length === 1) {
                                                logger.warn("Step {} has defined 'postStepSynchronize'; but will be ignored as 'aggregateEditConfigs' is set to 'manager'", step.name);
                                            }
                                        } else {
                                            this.executeRequest(requestXml, deviceManager, deviceId);
                                        }
                                    }
                                    if (apUtils.isBulkSyncSupportedForIntent(intentType)) {
                                        step.prePostStepSynchronize(syncInputs.templateArgsWithDiff.target.value);
                                    }
                                }
                            }
                            if (!bulkSync) {
                                if (networkState === "delete" || neverSynced == true || currentDevice["misAlignedSteps"].indexOf(step.name) > -1) {
                                    // This is a step considered (misaligned by audit) for
                                    // Sync.
                                    if (typeof step.postStepSynchronize === "function") {
                                        if (step.postStepSynchronize.length === 1) {
                                            var postSyncResult = step.postStepSynchronize(input);
                                            if (postSyncResult && postSyncResult.proceed === false) {
                                                result.setSuccess(false);
                                                result.setErrorCode(postSyncResult.errorCode);
                                                result.setErrorDetail(postSyncResult.errorMessage);
                                                return result;
                                            }
                                        } else if (step.postStepSynchronize.length === 2) {
                                            postSyncResult = step.postStepSynchronize(input, result);
                                            if (postSyncResult && postSyncResult.proceed === false) {
                                                result.setSuccess(false);
                                                result.setErrorCode(postSyncResult.errorCode);
                                                result.setErrorDetail(postSyncResult.errorMessage);
                                                return result;
                                            }
                                        } else if (step.postStepSynchronize.length === 3) {
                                            postSyncResult = step.postStepSynchronize(input, result, auditResult);
                                            if (postSyncResult && postSyncResult.proceed === false) {
                                                result.setSuccess(false);
                                                result.setErrorCode(postSyncResult.errorCode);
                                                result.setErrorDetail(postSyncResult.errorMessage);
                                                return result;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        // Single/Default step device.
                        var syncInputs = prepareForSync(null);
                        deviceTemplateArgs[deviceId] = syncInputs.templateArgs;
                        var dependentsImpacted = this.isDependencyUpdated(syncInputs.templateArgsWithDiff);
                        result.setUpdateDependents(dependentsImpacted);
                        updateXtraInfoInMemory();
                        var requestXml = syncInputs.requestXml;
                        if (!this.intentObject.skipEditConfigRequest) {
                            if (requestXml) {
                                if (bulkSync) {
                                    // Group edit-config request by device-id and pon name/device-id if it is bulk sync
                                    if (syncInputs.templateArgsWithDiff && syncInputs.templateArgsWithDiff.target && syncInputs.templateArgsWithDiff.target.value && syncInputs.templateArgsWithDiff.bulkAggregationKey && syncInputs.templateArgsWithDiff.bulkAggregationKey.value) {
                                        let targetName = syncInputs.templateArgsWithDiff.target.value;
                                        let bulkAggregationKey = syncInputs.templateArgsWithDiff.bulkAggregationKey.value;
                                        if (!(configMatchedAndMarkedAsMisAligned && configMatchedAndMarkedAsMisAligned[deviceId])) {
                                            this.groupAndStoreRequestInIntentScope(deviceId, deviceManager, bulkAggregationKey, targetName, requestXml);
                                        }
                                        // store xtraTopologyObject for each misaligned device in intent scope
                                        let valuesToStore = apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate") ? apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate") : {};
                                        if (valuesToStore && !valuesToStore[targetName]) {
                                            valuesToStore[targetName] = {};
                                        }
                                        if (valuesToStore[targetName] && !valuesToStore[targetName]["xtraTopologyObject"]) {
                                            valuesToStore[targetName]["xtraTopologyObject"] = {};
                                        }
                                        valuesToStore[targetName]["xtraTopologyObject"][self.intentObject.stageName + "_" + deviceId + "_ARGS"] = xtraTopologyObject[self.intentObject.stageName + "_" + deviceId + "_ARGS"];
                                        apUtils.storeContentInIntentScope("storedValuesForTopologyUpdate", valuesToStore);
                                    }
                                } else {
                                    // Send edit-config request to AV if it is not bulk sync
                                    if (!(configMatchedAndMarkedAsMisAligned && configMatchedAndMarkedAsMisAligned[deviceId])) {
                                        if (this.intentObject.aggregateEditConfigs === "manager") {
                                            aggregateRequestXml(requestXml, deviceManager);
                                        } else {
                                            this.executeRequest(requestXml, deviceManager, deviceId);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }// for misalignedDeviceNameAndOrder
            }
            if (bulkSync) {
                // Store required data in intent-scope for topology update
                var valuesToStore = apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate") ? apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate") : {};
                if (valuesToStore && !valuesToStore[target]) {
                    valuesToStore[target] = {};
                }
                valuesToStore[target]["networkState"] = networkState;
                valuesToStore[target]["intentConfigJson"] = intentConfigJson;
                let keyForTopoObjects;
                if (deviceReport && deviceReport["currentDeviceList"] && Object.keys(deviceReport["currentDeviceList"]).length === 1) {
                    // Use device-name as a key
                    keyForTopoObjects = Object.keys(deviceReport["currentDeviceList"]);
                } else if (deviceReport && deviceReport["currentDeviceList"] && Object.keys(deviceReport["currentDeviceList"]).length > 1) {
                    // If device report contains more than one device than combine all device name and use as a key
                    keyForTopoObjects = Object.keys(deviceReport["currentDeviceList"]).join("#");
                } else {
                    // If device report is null then use target as a key
                    keyForTopoObjects = target;
                }
                if (!valuesToStore[target]["deviceReport"]) {
                    valuesToStore[target]["deviceReport"] = {};
                    valuesToStore[target]["deviceReport"][keyForTopoObjects] = {};
                }
                valuesToStore[target]["deviceReport"][keyForTopoObjects] = deviceReport;
                if (!valuesToStore[target]["contextArgumentsMap"]) {
                    valuesToStore[target]["contextArgumentsMap"] = {};
                    valuesToStore[target]["contextArgumentsMap"][keyForTopoObjects] =  {};
                }
                valuesToStore[target]["contextArgumentsMap"][keyForTopoObjects] = contextArgumentsMap;
                if (!valuesToStore[target]["intentObject"]) {
                    valuesToStore[target]["intentObject"] = {};
                    valuesToStore[target]["intentObject"][keyForTopoObjects] = {};
                }
                valuesToStore[target]["intentObject"][keyForTopoObjects] = this.intentObject;
                result.setSuccess(true);
                if (!resultMapForTopoUpdate[target]) {
                    resultMapForTopoUpdate[target] = {};
                    resultMapForTopoUpdate[target][keyForTopoObjects] = {};
                }
                resultMapForTopoUpdate[target][keyForTopoObjects] = result;
                apUtils.storeContentInIntentScope("resultMapForTopoUpdate", resultMapForTopoUpdate);
                apUtils.storeContentInIntentScope("storedValuesForTopologyUpdate", valuesToStore);
                let intentConfigXml = apUtils.getContentFromIntentScope("intentConfigXml")? apUtils.getContentFromIntentScope("intentConfigXml") : {};
                intentConfigXml[target] = intentConfigXml;
                apUtils.storeContentInIntentScope("intentConfigXml", intentConfigXml);
            }
        } catch (e) {
            logger.error("Error occurred in AltiplanoNetconfIntentHelper::doSynchronize for {} - {} ", target, e);
            if (!bulkSync) {
                throw new RuntimeException(e);
            }
            apUtils.translateErrorCodeAndErrorMessage(e, result);
            let keyForResultMap;
            if (deviceReport && deviceReport["currentDeviceList"] && Object.keys(deviceReport["currentDeviceList"]).length === 1) {
                keyForResultMap = Object.keys(deviceReport["currentDeviceList"]);
            } else if (deviceReport && deviceReport["currentDeviceList"] && Object.keys(deviceReport["currentDeviceList"]).length > 1) {
                keyForResultMap = Object.keys(deviceReport["currentDeviceList"]).join("#");
            } else {
                keyForResultMap = target;
            }
            if (!resultMapForTopoUpdate[target]) {
                resultMapForTopoUpdate[target] = {};
                resultMapForTopoUpdate[target][keyForResultMap] = {};
            }
            resultMapForTopoUpdate[target][keyForResultMap] = result;
            apUtils.storeContentInIntentScope("resultMapForTopoUpdate", resultMapForTopoUpdate);
        }
        if (apUtils.isBulkSyncSupportedForIntent(intentType) && this.intentObject && this.intentObject.preparePostSync) {
            this.intentObject.preparePostSync(target);
        } else if (apUtils.isBulkSyncSupportedForIntent(intentType) && this.intentObject && this.intentObject.postSynchronize && !this.intentObject.preparePostSync) {
            apUtils.translateErrorCodeAndErrorMessage("preparePostSync() is missing", result);
        }
    }

    // Update topology and call postSynchronize for non bulksync case
    if (!bulkSync) {
        // Get the topology Object
        var currentIntentTopo = this.getIntentTopologyObject(deviceReport, target, networkState, this.intentObject, intentConfigJson, intentConfigXml, result.getTopology(), contextArgumentsMap);
        this.updateTopologyInResultObject(currentIntentTopo, result, networkState, xtraTopologyObject);
        // Call postSync
        if (result && result.getErrorDetail() == null && result.getErrorCode() == null) {
            if (this.intentObject.aggregateEditConfigs === "manager" && requestXmlAggregated &&
                Object.keys(requestXmlAggregated).length > 0) {
                for (var manager in requestXmlAggregated) {
                    var xmlList = requestXmlAggregated[manager];
                    var aggregatedRequest = "";
                    var self = this;
                    xmlList.forEach(function (requestXml) {
                        var deviceManagerXpath = "/nc:rpc/nc:edit-config/nc:config/anv:device-manager";
                        var deviceNodeString = self.getNodeListAsString(deviceManagerXpath, requestXml, self.prefixToNsMap);
                        aggregatedRequest = aggregatedRequest + deviceNodeString;
                    });
                }

                var aggregatedObject = {
                    result: result,
                    aggregatedRequest: aggregatedRequest,
                    managerName: deviceManager,
                };
                return aggregatedObject;
            } else {
                result.setSuccess(true);
                if (this.intentObject.postSynchronize) {
                    try {
                        result = this.intentObject.postSynchronize(input, networkState, result);
                    } catch (e) {
                        logger.error("Exception caught in postSync : {}", e);
                        result.setSuccess(false);
                        result.setErrorCode("ERR-100");
                        result.setErrorDetail(e);
                    }
                }
                return result;
            }
        }
    }
};

AltiplanoNetconfIntentHelper.prototype.groupAndStoreRequestInIntentScope = function(deviceId, deviceManager, aggregationKey, intentTargetName, requestXml) {
    let scopeKeyName = deviceId.endsWith(intentConstants.DOT_LS_IHUB)? "groupedRequest_forIHUB" : "groupedRequest_forDevice";
    let requestInIntentScope = apUtils.getContentFromIntentScope(scopeKeyName);
    let deviceIdAndManagerName = deviceId;
    if (deviceManager) {
        deviceIdAndManagerName = deviceId + "#" + deviceManager;
    }
    if (!requestInIntentScope) {
        requestInIntentScope = {};
        requestInIntentScope[deviceIdAndManagerName] = {};
        requestInIntentScope[deviceIdAndManagerName][aggregationKey] = {};
    } else if (requestInIntentScope && !requestInIntentScope[deviceIdAndManagerName]) {
        requestInIntentScope[deviceIdAndManagerName] = {};
        requestInIntentScope[deviceIdAndManagerName][aggregationKey] = {};
    } else if (requestInIntentScope && requestInIntentScope[deviceIdAndManagerName] && !requestInIntentScope[deviceIdAndManagerName][aggregationKey]) {
        requestInIntentScope[deviceIdAndManagerName][aggregationKey] = {}
    }
    requestInIntentScope[deviceIdAndManagerName][aggregationKey][intentTargetName] = [];
    requestInIntentScope[deviceIdAndManagerName][aggregationKey][intentTargetName].push(requestXml);
    apUtils.storeContentInIntentScope(scopeKeyName, requestInIntentScope);
}

AltiplanoNetconfIntentHelper.prototype.executeBulkSyncRequestAndUpdateTopology = function () {
    let resultMap = new HashMap();
    // Create aggregated request and send to the AV for bulk sync
    let self = this;

    // Aggregate request for LT/DPU/Ethernet at the pon level
    let groupedRequestForDevice = apUtils.getContentFromIntentScope("groupedRequest_forDevice");
    if (groupedRequestForDevice && Object.keys(groupedRequestForDevice).length > 0) {
        Object.keys(groupedRequestForDevice).forEach(function (deviceNameAndManager) {
            Object.keys(groupedRequestForDevice[deviceNameAndManager]).forEach(function (aggregationKey) {
                let deviceManager;
                let deviceName;
                // deviceNameAndManager format will be looks like <devicename>#<managername>
                // If manager name is present then find device name and manager name using '#'
                if (deviceNameAndManager.lastIndexOf("#") > -1) {
                    deviceName = deviceNameAndManager.slice(0, deviceNameAndManager.lastIndexOf("#"));
                    deviceManager = deviceNameAndManager.slice(deviceNameAndManager.lastIndexOf("#")+1, deviceNameAndManager.length);
                } else {
                    deviceName = deviceNameAndManager;
                    deviceManager = apUtils.getManagerInfoFromEsAndMds(deviceName).getName();
                }
                let aggregatedRequest = self.constructAggregatedRequestForBulkSync(groupedRequestForDevice[deviceNameAndManager][aggregationKey]);
                // Execute LT/Ethernet/DPU request
                if (self.isExecuteBulkSyncRequestFailed(aggregatedRequest, deviceManager, deviceName)) {
                    // Execute single request if bulk sync is failed
                    self.retrySyncOperationForBulkSync(groupedRequestForDevice[deviceNameAndManager][aggregationKey], deviceManager, deviceName);
                }
            });
        });
    }

    // Aggregate and send edit-config request for IHUB at the device level
    let groupedRequestForIHUB = apUtils.getContentFromIntentScope("groupedRequest_forIHUB");
    if (groupedRequestForIHUB && Object.keys(groupedRequestForIHUB).length > 0) {
        Object.keys(groupedRequestForIHUB).forEach(function (ihubNameAndManager) {
            let ihubName;
            let deviceManager;
            let aggregatedRequest;
            if (ihubNameAndManager.lastIndexOf("#") > -1) {
                ihubName = ihubNameAndManager.slice(0, ihubNameAndManager.lastIndexOf("#"));
                deviceManager = ihubNameAndManager.slice(ihubNameAndManager.lastIndexOf("#")+1, ihubNameAndManager.length);
            } else {
                ihubName = ihubNameAndManager;
                deviceManager = apUtils.getManagerInfoFromEsAndMds(ihubName).getName();
            }
            Object.keys(groupedRequestForIHUB[ihubNameAndManager]).forEach(function (aggregationKey) {
                if (aggregatedRequest) {
                    aggregatedRequest = aggregatedRequest + self.constructAggregatedRequestForBulkSync(groupedRequestForIHUB[ihubNameAndManager][aggregationKey]);
                } else {
                    aggregatedRequest = self.constructAggregatedRequestForBulkSync(groupedRequestForIHUB[ihubNameAndManager][aggregationKey]);
                }
            });
            if (self.isExecuteBulkSyncRequestFailed(aggregatedRequest, deviceManager, ihubName)) {
                // Execute single request if bulk sync is failed
                Object.keys(groupedRequestForIHUB[ihubNameAndManager]).forEach(function (aggregationKey) {
                    self.retrySyncOperationForBulkSync(groupedRequestForIHUB[ihubNameAndManager][aggregationKey], deviceManager, ihubName);
                });
            }
        });
    }

    // Update topology
    let storedValues = apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate");
    let resultMapForTopoUpdate = apUtils.getContentFromIntentScope("resultMapForTopoUpdate");
    for (let targetName in storedValues) {
        let storedResult;
        if (resultMapForTopoUpdate && resultMapForTopoUpdate[targetName]) {
            for (let key in resultMapForTopoUpdate[targetName]) {
                storedResult = resultMapForTopoUpdate[targetName][key];
                // Get the topology Object
                if (storedResult && storedResult.getErrorDetail() == null && storedResult.getErrorCode() == null) {
                    let intentConfigXml = apUtils.getContentFromIntentScope("intentConfigXml");
                    intentConfigXml = intentConfigXml[targetName];
                    let currentIntentTopo = this.getIntentTopologyObject(storedValues[targetName]["deviceReport"][key], targetName, storedValues[targetName]["networkState"], storedValues[targetName]["intentObject"][key], storedValues[targetName]["intentConfigJson"], intentConfigXml, storedResult.getTopology(), storedValues[targetName]["contextArgumentsMap"][key]);
                    this.updateTopologyInResultObject(currentIntentTopo, storedResult, storedValues[targetName]["networkState"], storedValues[targetName]["xtraTopologyObject"]);
                }
                if (!resultMap[targetName]) {
                    resultMap[targetName] = {};
                    resultMapForTopoUpdate[targetName][key] = {};
                }
                resultMap[targetName][key] = storedResult;
            }
        }
    }
    return resultMap;
}

AltiplanoNetconfIntentHelper.prototype.constructAggregatedRequestForBulkSync = function(groupedDeviceRequest) {
    var self = this;
    var aggregatedRequestForBulkSync = "";
    Object.keys(groupedDeviceRequest).forEach(function (intentTargetName) {
        groupedDeviceRequest[intentTargetName].forEach(function (requestXml) {
            aggregatedRequestForBulkSync = aggregatedRequestForBulkSync + self.extractRequestAndReturnAsString("/nc:rpc/nc:edit-config/nc:config", requestXml);
        });
    });
    return aggregatedRequestForBulkSync;
}

AltiplanoNetconfIntentHelper.prototype.extractRequestAndReturnAsString = function(xpath, requestXml) {
    try {
        return this.getNodeListAsString(xpath, requestXml, this.prefixToNsMap);
    } catch (e) {
        logger.error("Error while extracting data from requestXml : {}", e);
    }
}

AltiplanoNetconfIntentHelper.prototype.isExecuteBulkSyncRequestFailed = function(aggregatedRequest, deviceManager, deviceName) {
    let bulkSyncFailed = false;
    try {
        var aggregatedRequestForBulkSync = this.requestHeaderForBulkSync + aggregatedRequest + this.requestFooterForBulkSync;
        this.executeRequest(aggregatedRequestForBulkSync, deviceManager, deviceName);
    } catch (e) {
        logger.error("Bulk sync is failed for {} with error {}", deviceName, e);
        return true;
    }
    return bulkSyncFailed;
}

AltiplanoNetconfIntentHelper.prototype.retrySyncOperationForBulkSync = function(groupedRequest, deviceManager, deviceName) {
    logger.debug("Doing retry since bulk request failed");
    let storedValues = apUtils.getContentFromIntentScope("resultMapForTopoUpdate");
    let self = this;
    Object.keys(groupedRequest).forEach(function (intentTargetName) {
        groupedRequest[intentTargetName].forEach(function (requestXml) {
            let result;
            let keyInResultMap;
            if (storedValues && storedValues[intentTargetName] && storedValues[intentTargetName][deviceName]) {
                keyInResultMap = deviceName;
            } else {
                keyInResultMap = Object.keys(storedValues[intentTargetName])[0];
            }
            result = storedValues[intentTargetName][keyInResultMap];
            if (!result || (result && result.getErrorDetail() == null && result.getErrorCode() == null)) {
                try {
                    self.executeRequest(requestXml, deviceManager, deviceName);
                } catch (e) {
                    logger.error("Retry also failed for {} with error {}", deviceName, e);
                    apUtils.translateErrorCodeAndErrorMessage(e, result);
                }
            }
            storedValues[intentTargetName][keyInResultMap] = result;
        });
    });
    apUtils.storeContentInIntentScope("resultMapForTopoUpdate", storedValues);
}

AltiplanoNetconfIntentHelper.prototype.updateTopologyInResultObject = function(currentIntentTopo, result, networkState, xtraTopologyObject) {
    if (currentIntentTopo) {
        result.getTopology().setTopologyObjects(currentIntentTopo);
    }

    //logger.trace("doSynchronize Topology: {}", result.getTopology().toString());
    if (networkState === "delete") {
        if (result.getTopology() && result.getTopology().getTopologyObjects()) {
            var topoObjectList = result.getTopology().getTopologyObjects();
            if (!topoObjectList.isEmpty()) {
                topoObjectList.clear();
            }
        }
        //If networkState of an intent is "delete", it means its configuration is removed;
        //Sometimes because of some issue, it may not get removed from controller. In this this case we shouldnt remove the dependency info from topo.
        //Intent's dependency removel is handled by core, so this code is no more required.

    }

    for (var key in xtraTopologyObject) {
        try {
            apUtils.setTopologyExtraInfo(result.getTopology(), key, xtraTopologyObject[key]);
        } catch (e) {
            logger.error("Error while store the extra info details {}", e);
            throw new RuntimeException("Error while store the extra info details");
        }
    }
}

/**
 * Execute the aggregated rpc request.
 * @param managerName
 * @param inputAggregateRequest
 */
AltiplanoNetconfIntentHelper.prototype.executeAggregateRequest = function(managerName, inputAggregateRequest) {
    var aggregatedRequest = this.requestHeader;
    aggregatedRequest = aggregatedRequest + inputAggregateRequest;
    aggregatedRequest = aggregatedRequest + this.requestFooter;
    this.executeRequest(aggregatedRequest, managerName);
};

/**
 * In case of aggregate request we need to perform some additional task after execute the aggregate request.
 * @param input
 * @param networkState
 * @param result
 * @param intentObject
 * @returns {*}
 */
AltiplanoNetconfIntentHelper.prototype.finalize = function(input, networkState, result, intentObject) {
    result.setSuccess("true");
    if (intentObject.postSynchronize) {
        try {
            intentObject.postSynchronize(input, networkState, result);
        } catch (e) {
            result.setSuccess(false);
            result.setErrorCode("ERR-100");
            result.setErrorDetail(e);
        }
    }
    return result;
};

AltiplanoNetconfIntentHelper.prototype.getIntentTopologyObject = function(deviceReport, target, networkState, intentObject, intentConfigJson, intentConfigXml, topology, contextArgumentsMap) {
    var self = this;
    var getTopoObject = function(stepName) {
        var templateArgsReport;
        if(contextArgumentsMap.get(deviceId) != null && contextArgumentsMap.get(deviceId).get(stepName) != null) {
            templateArgsReport = contextArgumentsMap.get(deviceId).get(stepName);
        } else {
            var baseTemplateArguments = self.basicTemplateArguments(JSON.parse(JSON.stringify(intentConfigJson)), intentConfigXml, target, networkState, "", deviceReport["currentDeviceList"], deviceId, stepName);
            baseTemplateArguments["isTopologyOperation"] = {
                "value": true
            };
            templateArgsReport = self.constructTemplateArguments(baseTemplateArguments, topology);
        }

        var templateArgsWithDiff = templateArgsReport.templateArgsWithDiff;
        var resourceFile = self._getResourceFile(intentObject, intentConfigJson, deviceId, stepName, templateArgsWithDiff);
        return self.getTopologyObjects(deviceId, resourceFile, templateArgsWithDiff).getTopologyObjects();
    };
    var deviceTopologyObjects = new ArrayList();
    if(networkState !== "delete") {
        var currentDevices = deviceReport["currentDeviceList"];
        var sortedCurrentDeviceNamesAndOrder = this.constructSortedDeviceArrayWithNameAndOrder(currentDevices);
        for (var d = 0; d < sortedCurrentDeviceNamesAndOrder.length; d++) {
            var deviceNameAndOrder = sortedCurrentDeviceNamesAndOrder[d];
            var deviceId = deviceNameAndOrder.deviceName;
            var currentDevice = currentDevices[deviceId];
            if (typeof currentDevices[deviceId].removed === "string") {
                var deviceRequiredState = "delete";
            }
            if (deviceRequiredState !== "delete") {
                if (currentDevice["steps"] && typeof currentDevice["steps"].push === "function") {
                    // Multi step device - sync each step.
                    var steps = currentDevices[deviceId]["steps"];
                    for (var j = 0; j < steps.length; j++) {
                        var step = steps[j];
                        var stepTopoObject = getTopoObject(step.name);
                        if(stepTopoObject) {
                            deviceTopologyObjects.addAll(stepTopoObject);
                        }
                    }
                } else {
                    var deviceTopo = getTopoObject(null);
                    if(deviceTopo) {
                        deviceTopologyObjects.addAll(deviceTopo);
                    }
                }
            }
        }
    }
    return deviceTopologyObjects;
};

AltiplanoNetconfIntentHelper.prototype.constructTemplateArguments = function (baseTemplateArguments, topology) {
    var deviceId = baseTemplateArguments["deviceID"];
    var stepName = baseTemplateArguments["stepName"];
    // Intent types can add more derived arguments.
    var templateArguments = null;
    // Add support for step level getTemplateArguments
    if (baseTemplateArguments["step"] && baseTemplateArguments["step"].getTemplateArguments) {
        templateArguments = this.getTransformedArgs(baseTemplateArguments["step"].getTemplateArguments(baseTemplateArguments, topology));
    } else if (this.intentObject.getTemplateArguments) {
        templateArguments = this.getTransformedArgs(this.intentObject.getTemplateArguments(baseTemplateArguments, topology));
    } else {
        templateArguments = this.getTransformedArgs(baseTemplateArguments);
    }

    // Get List of arguments which is saved during last execution to produce
    // diff.
    var templateArgsWithDiff = templateArguments;
    if (typeof this.intentObject.trackedArgs === "object") {
        var xtraInfos = apUtils.getTopologyExtraInfo(topology);
        if (typeof xtraInfos[this.intentObject.stageName + "_" + deviceId + "_ARGS"] === "string") {
            var storedTemplateArgs = JSON.parse(xtraInfos[this.intentObject.stageName + "_" + deviceId + "_ARGS"]);
            var propertyName = deviceId;
            if (stepName) {
                propertyName = stepName;
            }
            if (!(typeof storedTemplateArgs[propertyName] === "undefined")) {
                templateArgsWithDiff = this.compareAndMergeTrackedArgsWithDiff(storedTemplateArgs[propertyName], templateArguments);
            }
        }
    }
    var result = {
        "templateArgs": templateArguments,
        "templateArgsWithDiff": templateArgsWithDiff
    }
    return result;
};

AltiplanoNetconfIntentHelper.prototype.constructDevices = function (target, intentConfigXml, intentConfigJson, topology) {
    // Get List of Devices
    var devices = null;
    if (typeof this.intentObject.getDeviceIds === "function") {
        devices = this.intentObject.getDeviceIds(target, intentConfigXml, intentConfigJson, topology);
    } else {
        devices = this.getDevices(target);
    }

    if (devices) {
        var deviceIds = Object.keys(devices);
        deviceIds.forEach(function (deviceId) {
            var currentDevice = devices[deviceId];
            var transformedSteps = [];
            if (currentDevice.steps) {
                currentDevice.steps.forEach(function (step) {
                    if (typeof step === "string") {
                        transformedSteps.push({
                            name: step
                        })
                    } else {
                        transformedSteps.push(step);
                    }
                });
                currentDevice.steps = transformedSteps;
            }
        });
    }


    // Get List of Devices we might have sync'd in the past to consider those
    // as well in Audit
    var result = {
        "currentDeviceList" : devices
    };
    logger.debug("constructDevices result: {}", JSON.stringify(result));
    return result;
};

AltiplanoNetconfIntentHelper.prototype.constructSortedDeviceArrayWithNameAndOrder = function (devices) {
    var deviceIds = Object.keys(devices);
    var resultArray = [];
    deviceIds.forEach(function (deviceId) {
        var tempDeviceObj = {
            "deviceName": deviceId,
            "order": devices[deviceId]["order"]
        }
        resultArray.push(tempDeviceObj);
    });
    resultArray.sort(function (a, b) {
        if (typeof a.order === "number" && typeof b.order === "number") {
            return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0);
        } else {
            if (typeof a.order === "number") {
                return 1;
            } else {
                return -1;
            }
        }
    });
    return resultArray;
};

AltiplanoNetconfIntentHelper.prototype.doAudit = function (target, intentConfigJson, intentConfigXml, networkState, topology, currentIntentOpertion) {
    var deviceReport = this.constructDevices(target, intentConfigXml, intentConfigJson, topology);
    var devices = deviceReport["currentDeviceList"];

    if(networkState && typeof networkState.name === 'function') {
        var requiredNetworkState = networkState;
    } else {
        if(typeof networkState === 'string') {
            if(networkState === 'active') {
                requiredNetworkState = RequiredNetworkState.active;
            } else if(networkState === 'suspend') {
                requiredNetworkState = RequiredNetworkState.suspend;
            } else if(networkState === 'delete') {
                requiredNetworkState = RequiredNetworkState.delete;
            }
        }
    }

    var deviceIds = Object.keys(devices);

    var remoteDevices = [];
    deviceIds.forEach(function (deviceId) {
        if (!deviceId.startsWith("Local##")) {
            remoteDevices.push(deviceId);
        }
    });

    // Check whether all devices are really supported - else, abort.
    if (remoteDevices.length > 0) {
        if (this.intentObject.supportedDeviceTypes != null && typeof this.intentObject.supportedDeviceTypes.push === "function") {
            var self = this;
            remoteDevices.forEach(function (deviceId) {
                if (typeof devices[deviceId]["failIfRemoteDeviceNotFound"] === "boolean" && devices[deviceId]["failIfRemoteDeviceNotFound"] == false) {
                    try {
                        apUtils.checkSupportForNodeType(deviceId, self.intentObject.supportedDeviceTypes);
                    } catch (e) {
                        logger.debug("Device {} not found in MDS, Skipping as 'failIfRemoteDeviceNotFound' is set to false", deviceId);
                    }
                } else {
                    apUtils.checkSupportForNodeType(deviceId, self.intentObject.supportedDeviceTypes);
                }
            });
        }
    }

    var auditReport;
    var misAlignedDevices = {};
    // We are marking some device as misaligned even the exact config present on device for internal computation
    // like topology, dependency and extra info args. We should allow to do all the above operation but
    // we should not send edit config to AV for that reason we are using this flag.
    var configMatchedAndMarkedAsMisAligned = {};

    // Create an array to get the devices sorted
    var sortedDeviceArray = this.constructSortedDeviceArrayWithNameAndOrder(devices);

    function updateMisAlignedDevices(deviceId) {
        if (misAlignedDevices[deviceId] === undefined) {
            misAlignedDevices[deviceId] = devices[deviceId];
        }
    }

    function updateMisAlignedDeviceSteps(deviceId) {
        if (misAlignedDevices[deviceId]["misAlignedSteps"] === undefined) {
            misAlignedDevices[deviceId]["misAlignedSteps"] = [];
        }
    }

    var self = this;
    sortedDeviceArray.forEach(function (deviceNameAndOrder) {
        var deviceId = deviceNameAndOrder.deviceName;
        var currentDevice = devices[deviceId];
        var deviceRequiredState = networkState;
        if(typeof devices[deviceId].removed === "string"){
            deviceRequiredState = "delete";
        }

        var convertEditToGetAndRetrieveResponse = function (templateArgs, template) {
            var expectedXml = utilityService.processTemplate(template, templateArgs);
            var getConfigRequestXmlWithIbnAttribute = apUtils.processXsltTemplate(resourceProvider.getResource("internal/transform-edit-to-get.xslt"),expectedXml);

            var getConfigRequestXml = utilityService.stripIntentDesignAnnotations(getConfigRequestXmlWithIbnAttribute);
            logger.debug("Altiplano virtualizer IntentTypeFwk- Executing audit on device: {}", deviceId);
            if (currentDevice["managerName"]) {
                var manager = currentDevice["managerName"];
                var getConfigResponse = null;
                ibnLockService.executeWithReadLockOn(deviceId, function() {
                    getConfigResponse = requestExecutor.executeNCWithManager(manager, getConfigRequestXml).getRawResponse();
            	}, function() {
            		throw new RuntimeException("GC is in progress");
            	});
            } else if (deviceId.startsWith("Local##")) {
                var getConfigResponse = utilityService.executeRequest(getConfigRequestXml).responseToString();
            } else {
            	var getConfigResponse = null;
                ibnLockService.executeWithReadLockOn(deviceId, function() {
                    getConfigResponse = requestExecutor.execute(deviceId, getConfigRequestXml);
            	}, function() {
            		throw new RuntimeException("GC is in progress");
            	});
            }
            logger.debug("Altiplano virtualizer IntentTypeFwk- Audit response recieved from device: {}",deviceId);
            return {expectedXml: expectedXml, configResponse: getConfigResponse, getConfigRequestWithIbnAnnotation: getConfigRequestXmlWithIbnAttribute};
        }

        var doSingleAudit = function (stepName, auditStatusObject) {

            // Basic Arguments prepared from Intent Config and all well-known
            // fields of Intent
            // NOTE: We're cloning and passing intentConfigJson to avoid
            // accidental damage (if done by intent-type call-backs) across
            // devices/steps.
            // For Audit: Operation is ""
            var baseTemplateArguments = self.basicTemplateArguments(JSON.parse(JSON.stringify(intentConfigJson)), intentConfigXml, target, deviceRequiredState, "", devices, deviceId, stepName);
            // Adding self.arg for getTemplate Arguments to know from where it
            // is getting called.
            baseTemplateArguments["isAuditSupported"] = {
                "value": true
            };

            baseTemplateArguments["networkState"] = baseTemplateArguments["networkState"].toString();
            var templateArgsWithDiff = self.constructTemplateArguments(baseTemplateArguments, topology).templateArgsWithDiff;
            if(stepName) {
                logger.debug("device {} step {} audit templateArgsWithDiff {}", deviceId, stepName, apUtils.protectSensitiveDataLog(templateArgsWithDiff));
            } else {
                logger.debug("device {} audit templateArgsWithDiff {}", deviceId, apUtils.protectSensitiveDataLog(templateArgsWithDiff));
            }
            if(auditStatusObject) {
                if (auditStatusObject.markAsMisalignedIfTrackedArgsChanged) {
                    auditStatusObject.misAlignedStatus = self.isTrackedArgsUpdated(templateArgsWithDiff);
                }

                if ((!auditStatusObject.misAlignedStatus || auditStatusObject.misAlignedStatus == false) && templateArgsWithDiff["deviceRelease"]) {
                    let keys = Object.keys(templateArgsWithDiff["deviceRelease"]);
                    auditStatusObject.misAlignedStatus = (keys.length > 1 && keys.indexOf("oldValue") >= 0)
                }
            }

            // Edit-Config template to be used for the audit (we'll change
            // that to GET ourselves)
            var resourceFile = self._getResourceFile(self.intentObject, intentConfigJson, deviceId, stepName, templateArgsWithDiff);
            var nonDeviceSpecific = false;
            var isDevicePresent = true;
            var getConfig = convertEditToGetAndRetrieveResponse(templateArgsWithDiff, resourceProvider.getResource(resourceFile));
            // For Remote devices, check whether they are present in GET
            // Response before attempting config audit.
            if (!deviceId.startsWith("Local##")) {
                if (isDevicePresent) {
                    try {
                        var deviceIdFromGetResponse = utilityService.evalXpathForText(getConfig.configResponse, self.prefixToNsMap, "/nc:rpc-reply/nc:data/device-manager:device-manager/adh:device/adh:device-id/text()");
                        if (!deviceIdFromGetResponse) {
                            isDevicePresent = false;
                        }
                        if(self.intentObject["nonDeviceSpecific"] && self.intentObject["nonDeviceSpecific"] === true){
                            nonDeviceSpecific = true;
                        }
                    } catch (e) {
                        isDevicePresent = false;
                    }
                    logger.debug("Intent SWMGMT Audit expectedXml {} --> {}", stepName,apUtils.protectSensitiveDataLog(getConfig.expectedXml));
                    logger.debug("Intent SWMGMT Audit getConfigRequestXmlWithIbnAttribute {} ",apUtils.protectSensitiveDataLog(getConfig.getConfigRequestWithIbnAnnotation));
                    logger.debug("Intent SWMGMT Audit configResponse {} ",apUtils.protectSensitiveDataLog(getConfig.configResponse));
                }
                if (isDevicePresent === false && nonDeviceSpecific === false && requiredNetworkState.toString() !== 'delete') {
                    if (typeof devices[deviceId]["failIfRemoteDeviceNotFound"] === "boolean" && devices[deviceId]["failIfRemoteDeviceNotFound"] == false) {
                        var localAuditReport = auditFactory.createAuditReport(null, null);
                        localAuditReport.addMisAlignedObject(auditFactory.createMisAlignedObject("anv:device-manager/anv-device-holders:device=" + deviceId, false, deviceId));
                        logger.debug("Intent SWMGMT Audit Report {} ",apUtils.protectSensitiveDataLog(localAuditReport));
                        return localAuditReport;
                    } else {
                        throw new RuntimeException("Device not found: " + deviceId);
                    }
                }
            }

            var actualDataPath = "/nc:rpc-reply/nc:data";
            var expectedDataPath = "/nc:rpc/nc:edit-config/nc:config";
            var getConfigPath = "/nc:rpc/nc:get-config/nc:filter/device-manager:device-manager";
            var deviceNameToReport = "Local";
            if (!deviceId.startsWith("Local##")) {
                actualDataPath = actualDataPath + "/device-manager:device-manager";
                expectedDataPath = expectedDataPath + "/device-manager:device-manager";
                deviceNameToReport = deviceId;
            }
            try {
                var configElementFromGETResponse = utilityService.extractSubtree(getConfig.configResponse, self.prefixToNsMap, actualDataPath);
                if(!deviceId.startsWith("Local##") && !nonDeviceSpecific) {
                    if(configElementFromGETResponse && isDevicePresent) {
                        try {
                            var dsdNode = configElementFromGETResponse.getElementsByTagNameNS(self.prefixToNsMap.get("adh"), "device-specific-data");
                            if(dsdNode) {
                                var dsdInResponse = dsdNode.item(0);
                            }
                        } catch (e) {
                            logger.warn("device-specific-data not present in the response: {}", getConfig.configResponse);
                        }
                        var deviceSpecificDataPath = getConfigPath + "/adh:device/adh:device-specific-data";
                        var getConfigDsdNode = utilityService.extractSubtree(getConfig.getConfigRequestWithIbnAnnotation, self.prefixToNsMap, deviceSpecificDataPath);
                        if(!dsdInResponse) {
                            // DSD not found in the response
                            if(getConfigDsdNode) {
                                var updatedResponseForAudit = self.updateDeviceSpecificDataInDeviceNode(deviceId, getConfig.configResponse, getConfigDsdNode, null);
                                configElementFromGETResponse = utilityService.extractSubtree(updatedResponseForAudit, self.prefixToNsMap, actualDataPath);
                            }
                        } else {
                            // DSD found in the response
                            updatedResponseForAudit = self.updateDeviceSpecificDataInDeviceNode(deviceId, getConfig.configResponse, getConfigDsdNode, dsdInResponse);
                            configElementFromGETResponse = utilityService.extractSubtree(updatedResponseForAudit, self.prefixToNsMap, actualDataPath);
                        }
                    }
                }
            } catch(e) {
                logger.debug("Audit : update the get-config response skipped : {}", e);
            }
            if(!configElementFromGETResponse && requiredNetworkState.toString() === 'delete') {
                configElementFromGETResponse = utilityService.extractSubtree(getConfig.configResponse, self.prefixToNsMap, "/nc:rpc-reply/nc:data");
                if(configElementFromGETResponse) {
                    return auditFactory.createAuditReport(null, null);
                } else {
                    throw new RuntimeException("Error while convert the get-config response");
                }
            } else {
                var expectedXmlNode = utilityService.extractSubtree(getConfig.expectedXml, self.prefixToNsMap, expectedDataPath);
                return auditUtility.runAuditWithDevice(expectedXmlNode, configElementFromGETResponse, self.nsToModuleMap, deviceNameToReport, requiredNetworkState);
            }
        };

        var appendToAuditReport = function (deltaReport) {
            var impacted = false;
            if (auditReport) {
                if (deltaReport) {
                    if (deltaReport.getMisAlignedObjects() && !deltaReport.getMisAlignedObjects().isEmpty()) {
                        // Always use addMisAlignedObjects to avoid duplicate
                        // objectID in report
                        for(var i = 0;i < deltaReport.getMisAlignedObjects().size();i++){
                            auditReport.addMisAlignedObject(deltaReport.getMisAlignedObjects().get(i));
                        }
                        impacted = true;
                    }
                    if (deltaReport.getMisAlignedAttributes() && !deltaReport.getMisAlignedAttributes().isEmpty()) {
                        // Always use addMisAlignedAttribute to avoid
                        // duplicate attributes in report
                        for(var i = 0;i < deltaReport.getMisAlignedAttributes().size();i++){
                            auditReport.addMisAlignedAttribute(deltaReport.getMisAlignedAttributes().get(i));
                        }
                        impacted = true;
                    }
                }
            } else {
                // Merge is getting called first time. Just copy and return
                // true (if there are deviations)
                if (deltaReport) {
                    if ((deltaReport.getMisAlignedObjects() && !deltaReport.getMisAlignedObjects().isEmpty()) ||
                        (deltaReport.getMisAlignedAttributes() && !deltaReport.getMisAlignedAttributes().isEmpty())) {
                        impacted = true;
                    }
                    auditReport = deltaReport;
                }
            }
            return impacted;
        }


        if (currentDevice["steps"] && typeof currentDevice["steps"].push === "function") {
            // There are multiple steps for self.device.
            var prevStepFailed = false;
            currentDevice["steps"].forEach(function (step) {
                var auditStatusObject = {
                    markAsMisalignedIfTrackedArgsChanged: false,
                };
                if(step.markAsMisalignedIfTrackedArgsChanged) {
                    // Some time we need to sync the dependent intent even
                    // there is no change in the device
                    // configuration but some changes in the intent
                    // configuration
                    auditStatusObject = {
                        markAsMisalignedIfTrackedArgsChanged: true,
                        misAlignedStatus: false
                    }
                }
                if (prevStepFailed === true && step.skipAuditIfPrevStepFails === true) {
                    logger.debug("Already mis-aligned: {} So skipping the step: {}", JSON.stringify(misAlignedDevices[deviceId]["misAlignedSteps"]), step.name);
                    // prevStepFailed = false;
                } else if(currentIntentOpertion === "audit" && step.internalAudit) {
                    logger.debug("Skipping internal audit for the step: {}", step.name);
                } else {
                    var stepAuditReport = doSingleAudit(step.name, auditStatusObject);
                    var isStepLevelAuditMisaligned = appendToAuditReport(stepAuditReport);
                    if (isStepLevelAuditMisaligned) {
                        updateMisAlignedDevices(deviceId);
                        updateMisAlignedDeviceSteps(deviceId);
                        misAlignedDevices[deviceId]["misAlignedSteps"].push(step.name);
                        prevStepFailed = true;
                    } else if (!isStepLevelAuditMisaligned && auditStatusObject && auditStatusObject.misAlignedStatus) {
                        updateMisAlignedDevices(deviceId);
                        updateMisAlignedDeviceSteps(deviceId);
                        misAlignedDevices[deviceId]["misAlignedSteps"].push(step.name);
                        prevStepFailed = true;
                    } else {
                        prevStepFailed = false;
                    }
                }
            })
        } else {
            // Single Step Device.
            var auditStatusObject = {
                markAsMisalignedIfTrackedArgsChanged: false,
            };
            if(currentDevice.markAsMisalignedIfTrackedArgsChanged) {
                // Some time we need to sync the dependent intent even there
                // is no change in the device
                // configuration but some changes in the intent configuration
                auditStatusObject = {
                    markAsMisalignedIfTrackedArgsChanged: true,
                    misAlignedStatus: false
                }
            }
            if(currentIntentOpertion === "audit" && self.intentObject.internalAudit) {
                logger.debug("Skipping internal audit for the deviceId: {}", deviceId);
            } else {
                var deviceAuditReport = doSingleAudit(null, auditStatusObject);
                var isAuditContainMisalignment = appendToAuditReport(deviceAuditReport);
                if (isAuditContainMisalignment) {
                    updateMisAlignedDevices(deviceId);
                } else if(!isAuditContainMisalignment && !self.isTopologyExistForAlignedDevices(topology)) {
                    configMatchedAndMarkedAsMisAligned[deviceId] = deviceId;
                    updateMisAlignedDevices(deviceId);
                } else if(!isAuditContainMisalignment && !self.isTopologyExistForAlignedDevicesWithDeviceArgs(topology, deviceId, self.intentObject.stageName)) {
                    configMatchedAndMarkedAsMisAligned[deviceId] = deviceId;
                    updateMisAlignedDevices(deviceId);
                } else if(!isAuditContainMisalignment && auditStatusObject && auditStatusObject.misAlignedStatus) {
                    configMatchedAndMarkedAsMisAligned[deviceId] = deviceId;
                    updateMisAlignedDevices(deviceId);
                }
            }
        }
    });

    if (!auditReport) {
        // Just to avoid "might not be initialized" problem due to issues in
        // intent-type.
        auditReport = null;
    }

    var result = {
        "auditReport" : auditReport,
        "misAlignedDevices" : misAlignedDevices,
        "configMatchedAndMarkedAsMisAligned": configMatchedAndMarkedAsMisAligned
    }
    logger.debug("doAudit: Config matched and marked as misaligned: {}", JSON.stringify(configMatchedAndMarkedAsMisAligned));
    logger.debug ("doAudit Report: {}, Misaligned Devices: {}", auditReport != null ? auditReport.toString() : "NULL", JSON.stringify(misAlignedDevices));
    return result;
};

AltiplanoNetconfIntentHelper.prototype.getUpdatedPrefixToNsMap = function() {
    var updatedHashMap = new HashMap();
    updatedHashMap.put("ibn", "http://www.nokia.com/management-solutions/ibn");
    updatedHashMap.put("nc", "urn:ietf:params:xml:ns:netconf:base:1.0");
    updatedHashMap.put("device-manager", "http://www.nokia.com/management-solutions/anv");
    updatedHashMap.put("adh", "http://www.nokia.com/management-solutions/anv-device-holders");

    var nsToModuleHash = apUtils.nsToModuleMap;
    nsToModuleHash.keySet().forEach(function (key) {
        updatedHashMap.put(nsToModuleHash.get(key), key);
    });
    return updatedHashMap;
};

/**
 * This method will check the node
 * if the DSD found in the response it will add the missing child nodes
 * if dsd not found it will add the both dsd and missing nodes.
 * @param requestXml
 * @param getConfigDsdNode
 * @param dsdInResponse
 * @returns {*}
 */
AltiplanoNetconfIntentHelper.prototype.updateDeviceSpecificDataInDeviceNode = function(deviceId, requestXml, getConfigDsdNode, dsdInResponse) {
    //{childNames : childNames, childNameSpaces: childNameSpaces};
    logger.debug("updateDeviceSpecificDataInDeviceNode : {}", apUtils.protectSensitiveDataLog(requestXml));
    var getConfigDsdChildNodes = this.getFirstChildNodesInfo(getConfigDsdNode);
    logger.debug("parsedValues : {}", JSON.stringify(getConfigDsdChildNodes));
    var childNames = getConfigDsdChildNodes.childNames;
    var namespaces = getConfigDsdChildNodes.childNameSpaces;
    var uniqueChildNames  = childNames.filter(function (value, pos) { return childNames.indexOf(value) === pos; });
    var childDetails = {};
    uniqueChildNames.forEach(function (value) {
        childDetails[value] = value;
    });
    /**
     * If the response already contain dsd and other child nodes no need to add it again.
     */

    if (dsdInResponse) {
        var prefixToNsMap = this.getUpdatedPrefixToNsMap();
        uniqueChildNames.forEach(function (value) {
            var nodePath = "/nc:rpc-reply/nc:data/device-manager:device-manager/" +
                "adh:device[adh:device-id='"+deviceId + "']"+ "/adh:device-specific-data/" + value;
            try {
                var node = utilityService.extractSubtree(dsdInResponse, prefixToNsMap, nodePath);
            } catch (e) {
                logger.debug("Node not present in the response so skip the delete from childDetails");
            }
            if(node) {
                delete childDetails[value];
            }
        });
    }

    logger.debug("updateDeviceSpecificDataInDeviceNode parsedValues after update: {}", JSON.stringify(childDetails));

    if(Object.keys(childDetails).length > 0) {
        // covert the xpath to xsl node.
        var childEntries = this.getConvertedChildEntries(Object.keys(childDetails), dsdInResponse, deviceId);
    }

    //var nameSpaces = Object.keys(getConfigDsdChildNodes).map(function(key){return getConfigDsdChildNodes[key]});
    if(childEntries) {
        var uniqueNamespaces = namespaces.filter(function (value, pos) {
            return namespaces.indexOf(value) === pos;
        });

        var uniqueNamespacesArray = [];
        for (var i = 0; i < uniqueNamespaces.length; i++) {
            uniqueNamespacesArray.push(uniqueNamespaces[i]);
        }

        var templateArgs = {
            elementNotContainParent: childEntries.elementNotContainParent,
            elementContainParent: childEntries.elementContainParent,
            nameSpaces: uniqueNamespaces
        };

        if (dsdInResponse) {
            templateArgs["dsdInResponse"] = true;
        }

        if (typeof Graal != 'undefined') {
            var xsltTemplate = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<xsl:stylesheet xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"\n" +
                "                xmlns:adh=\"http://www.nokia.com/management-solutions/anv-device-holders\"\n" +
                "                xmlns:anv=\"http://www.nokia.com/management-solutions/anv\"\n" +
                "            <#if nameSpaces??>" +
                "                <#list nameSpaces as nameSpcevalue>\n" +
                "                    ${nameSpcevalue}\n" +
                "                </#list>\n" +
                "             </#if>" +
                "                version=\"1.0\">\n" +
                "    <xsl:output indent=\"yes\"/>\n" +
                "    <xsl:strip-space elements=\"*\"/>\n" +
                "    <!-- Identity transform -->\n" +
                "    <xsl:template match=\"@* | node()\">\n" +
                "        <xsl:copy>\n" +
                "            <xsl:apply-templates select=\"@* | node()\"/>\n" +
                "        </xsl:copy>\n" +
                "    </xsl:template>\n" +
                "\n" +
                "    <#if dsdInResponse??>" +
                "        <#if elementContainParent??>" +
                "           <#list elementContainParent as key , childName>\n" +
                "               <xsl:template match=\"anv:device-manager/adh:device/adh:device-specific-data/${key}\">\n" +
                "                   <!-- Copy the element -->\n" +
                "                   <xsl:copy>\n" +
                "                   <xsl:apply-templates select=\"@* | node()\"/>\n" +
                "                      ${childName}\n" +
                "                   </xsl:copy>\n" +
                "              </xsl:template>\n" +
                "      </#list>" +
                "    </#if>" +
                "    <#if elementNotContainParent??>" +
                "               <xsl:template match=\"anv:device-manager/adh:device/adh:device-specific-data\">\n" +
                "                   <!-- Copy the element -->\n" +
                "                   <xsl:copy>\n" +
                "                   <xsl:apply-templates select=\"@* | node()\"/>\n" +
                "                      <#list elementNotContainParent as key , childName>\n" +
                "                         ${childName}\n" +
                "                       </#list>" +
                "                   </xsl:copy>\n" +
                "              </xsl:template>\n" +

                "    </#if>" +
                "</#if>" +
                "\n" +
                "\n" +
                "    <xsl:template match=\"anv:device-manager/adh:device\">\n" +
                "        <xsl:choose>\n" +
                "            <xsl:when test=\"not(adh:device-specific-data)\">\n" +
                "                <xsl:copy>\n" +
                "                    <xsl:apply-templates select=\"@* | node()\"/>\n" +
                "                    <xsl:element name=\"adh:device-specific-data\">\n" +
                "                    <#if elementNotContainParent??>" +
                "                        <#list elementNotContainParent as key , childName>\n" +
                "                            ${childName}\n" +
                "                        </#list>\n" +
                "                     </#if>" +
                "                    </xsl:element>\n" +
                "                </xsl:copy>\n" +
                "            </xsl:when>\n" +
                "\n" +
                "            <xsl:otherwise>\n" +
                "                <xsl:copy>\n" +
                "                    <xsl:apply-templates select=\"@* | node()\"/>\n" +
                "                </xsl:copy>\n" +
                "            </xsl:otherwise>\n" +
                "        </xsl:choose>\n" +
                "    </xsl:template>\n" +
                "</xsl:stylesheet>";
        } else {
            var xsltTemplate = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
                "<xsl:stylesheet xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"\n" +
                "                xmlns:adh=\"http://www.nokia.com/management-solutions/anv-device-holders\"\n" +
                "                xmlns:anv=\"http://www.nokia.com/management-solutions/anv\"\n" +
                "            <#if nameSpaces??>" +
                "                <#list nameSpaces as key , nameSpcevalue>\n" +
                "                    ${nameSpcevalue}\n" +
                "                </#list>\n" +
                "             </#if>" +
                "                version=\"1.0\">\n" +
                "    <xsl:output indent=\"yes\"/>\n" +
                "    <xsl:strip-space elements=\"*\"/>\n" +
                "    <!-- Identity transform -->\n" +
                "    <xsl:template match=\"@* | node()\">\n" +
                "        <xsl:copy>\n" +
                "            <xsl:apply-templates select=\"@* | node()\"/>\n" +
                "        </xsl:copy>\n" +
                "    </xsl:template>\n" +
                "\n" +
                "    <#if dsdInResponse??>" +
                "        <#if elementContainParent??>" +
                "           <#list elementContainParent as key , childName>\n" +
                "               <xsl:template match=\"anv:device-manager/adh:device/adh:device-specific-data/${key}\">\n" +
                "                   <!-- Copy the element -->\n" +
                "                   <xsl:copy>\n" +
                "                   <xsl:apply-templates select=\"@* | node()\"/>\n" +
                "                      ${childName}\n" +
                "                   </xsl:copy>\n" +
                "              </xsl:template>\n" +
                "      </#list>" +
                "    </#if>" +
                "    <#if elementNotContainParent??>" +
                "               <xsl:template match=\"anv:device-manager/adh:device/adh:device-specific-data\">\n" +
                "                   <!-- Copy the element -->\n" +
                "                   <xsl:copy>\n" +
                "                   <xsl:apply-templates select=\"@* | node()\"/>\n" +
                "                      <#list elementNotContainParent as key , childName>\n" +
                "                         ${childName}\n" +
                "                       </#list>" +
                "                   </xsl:copy>\n" +
                "              </xsl:template>\n" +

                "    </#if>" +
                "</#if>" +
                "\n" +
                "\n" +
                "    <xsl:template match=\"anv:device-manager/adh:device\">\n" +
                "        <xsl:choose>\n" +
                "            <xsl:when test=\"not(adh:device-specific-data)\">\n" +
                "                <xsl:copy>\n" +
                "                    <xsl:apply-templates select=\"@* | node()\"/>\n" +
                "                    <xsl:element name=\"adh:device-specific-data\">\n" +
                "                    <#if elementNotContainParent??>" +
                "                        <#list elementNotContainParent as key , childName>\n" +
                "                            ${childName}\n" +
                "                        </#list>\n" +
                "                     </#if>" +
                "                    </xsl:element>\n" +
                "                </xsl:copy>\n" +
                "            </xsl:when>\n" +
                "\n" +
                "            <xsl:otherwise>\n" +
                "                <xsl:copy>\n" +
                "                    <xsl:apply-templates select=\"@* | node()\"/>\n" +
                "                </xsl:copy>\n" +
                "            </xsl:otherwise>\n" +
                "        </xsl:choose>\n" +
                "    </xsl:template>\n" +
                "</xsl:stylesheet>";
        }

        xsltTemplate = utilityService.processTemplate(xsltTemplate, templateArgs);
        logger.debug("Processed XSLT Template : {}", xsltTemplate);
        return apUtils.processXsltTemplate(xsltTemplate, requestXml);
    } else {
        logger.debug("Unable to process get-config request, dsd or child node under dsd not present in get-config request");
        throw new RuntimeException("Unable to process get-config request, dsd or child node under dsd not present in get-config request");
    }
};

/**
 * This method used to convert the given context array path into xml strings.
 *
 * Input sample : ["a/b/c/d", "a/b/c"]
 * Output sample : <xsl:element 'a'><xsl:element 'b'><xsl:element 'c'><xsl:element 'd'></xsl:element 'd'></xsl:element 'c'></xsl:element 'b'></xsl:element 'a'>
 * @param childPaths
 * @returns {[]}
 */
AltiplanoNetconfIntentHelper.prototype.getConvertedChildEntries = function(childPaths, dsdInResponse, deviceId) {
    var self = this;
    var elementNotContainParent = {};
    var elementContainParent = {};
    var nodePath = "/nc:rpc-reply/nc:data/device-manager:device-manager/" +
        "adh:device[adh:device-id='"+deviceId + "']"+ "/adh:device-specific-data/";
    var prefixToNsMap = this.getUpdatedPrefixToNsMap();
    /*
      Group the child  ["a/b/c/d", "a/b/c", "a/x/y", "aa/bb/cc/dd","aa/bb/cc/ee"] based  on the parent like below
      {"a":["a/b/c/d","a/b/c","a/x/y"],"aa":["aa/bb/cc/dd","aa/bb/cc/ee"]}
     */
    var baseObject = {};
    var baseObjectFoundInNode = {};
    childPaths.forEach(function (value) {
        var baseValue =  value.split("/")[0];
        if(baseObject[baseValue]) {
            var splitArray = value.split("/");
            if(baseObjectFoundInNode[baseValue] && splitArray && splitArray.length > 0) {
                splitArray.shift();
                baseObject[baseValue].push(splitArray.join("/"));
            } else {
                baseObject[baseValue].push(value);
            }
        } else {
            try {
                var node = utilityService.extractSubtree(dsdInResponse, prefixToNsMap, nodePath + baseValue);
            } catch (e) {
            }
            if(node) {
                baseObjectFoundInNode[baseValue] = true;
            }
            splitArray = value.split("/");
            if(baseObjectFoundInNode[baseValue] && splitArray && splitArray.length > 0) {
                splitArray.shift();
                baseObject[baseValue] = [splitArray.join("/")];
            } else {
                baseObject[baseValue] = [value];
            }
        }
    });

    Object.keys(baseObject).forEach(function (key) {
        /*
         The below logic convert the the String array ["a/b/c/d","a/b/c","a/x/y"] to the following format
         {"a":{"b":{"c":{"d":{}}},"x":{"y":{}}}}
         */
        var convertedObject  = baseObject[key].reduce(function (obj, path) {
            path.split('/').reduce(function (obj, key) { return obj[key] = obj[key] || {}}, obj);
            return obj;
        }, {});

        var convertedXml = self.convertObjectToXslElement(convertedObject);

        if(baseObjectFoundInNode[key]) {
            elementContainParent[key] = convertedXml;
        } else {
            elementNotContainParent[key] = convertedXml;
        }
    });
    return {elementNotContainParent : elementNotContainParent, elementContainParent: elementContainParent};
};

/**
 * The method will convert the {"a":{"b":{"c":{"d":{}}}}} to below format
 * <xsl:element 'a'><xsl:element 'b'><xsl:element 'c'><xsl:element 'd'></xsl:element 'd'></xsl:element 'c'></xsl:element 'b'></xsl:element 'a'>
 * @param inputObject
 * @returns {string}
 */
AltiplanoNetconfIntentHelper.prototype.convertObjectToXslElement = function(inputObject) {
    var outputXml = '';
    for (var prop in inputObject) {
        outputXml += inputObject[prop] instanceof Array ? '' : "<xsl:element name='" + prop + "'>";
        if (inputObject[prop] instanceof Array) {
            for (var array in inputObject[prop]) {
                outputXml += "<" + prop + ">";
                outputXml += this.convertObjectToXslElement(new Object(inputObject[prop][array]));
                outputXml += "</" + prop + ">";
            }
        } else if (typeof inputObject[prop] == "object") {
            outputXml += this.convertObjectToXslElement(new Object(inputObject[prop]));
        } else {
            outputXml += inputObject[prop];
        }
        outputXml += inputObject[prop] instanceof Array ? '' : "</xsl:element>";
    }
    outputXml = outputXml.replace(/<\/?[0-9]{1,}>/g, '');
    return outputXml
};

/**
 * This method used to fetch the child nodes under device specific node in the get-config request
 * If the node contain the ibn:audit="terminate" in the first level child (eg: interfaces ) under device specific data the use the node directly
 * Else check the child nodes ( interfaces/interface ) contain the ibn:audit="terminate" using 'getChildNodesWithContextPath' method
 *
 *
 * The output in the below format the child names cotain the xpath and the childNameSpaces contain the required name spaces
 * {
 * "childNames":["bbf-xpongemtcont:gemports-config","bbf-xpongemtcont:tconts-config",
 * "ietf-interfaces:interfaces",
 * "bbf-l2-forwarding:forwarding/bbf-l2-forwarding:forwarders"],
 *
 * "childNameSpaces":["xmlns:bbf-xpongemtcont=\"urn:bbf:yang:bbf-xpongemtcont\"",
 * "xmlns:ietf-interfaces=\"urn:ietf:params:xml:ns:yang:ietf-interfaces\"",
 * "xmlns:bbf-l2-forwarding=\"urn:bbf:yang:bbf-l2-forwarding\""]}
 * @param inputXmlNode
 * @returns {{childNames: [], childNameSpaces: []}}
 */
AltiplanoNetconfIntentHelper.prototype.getFirstChildNodesInfo = function(inputXmlNode) {
    var childDetails = {};
    var childNames = [];
    var childNameSpaces = [];
    if (inputXmlNode != null && inputXmlNode.hasChildNodes()) {
        var rootChildren = inputXmlNode.getChildNodes();
        for (var i = 0; i < rootChildren.getLength(); i++) {
            var child = rootChildren.item(i);
            if (child.getNodeType() === 1) { // Element Node
                if (child.getChildNodes().getLength() === 0) {
                    // Don't perform anything
                } else if (child.getChildNodes().getLength() === 1 && child.getChildNodes().item(0).getNodeType() === 3) {
                    // Don't perform anything
                }
                if (child.hasChildNodes()) {
                    if(!(childNames.indexOf(child.getLocalName()) > -1)) {
                        var childName = child.getLocalName();
                        var nameSpace = child.getNamespaceURI();
                        var moduleName = this.nsToModuleMap.get(nameSpace);
                        if (moduleName) {
                            childName = moduleName + ":" + childName;
                            //xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders"
                            nameSpace = "xmlns" + ":" + moduleName + "=\"" + nameSpace + "\"";
                        } else {
                            nameSpace = "xmlns" + "=" + "\"" + nameSpace + "\"";
                        }
                        var contextPath = childName;
                        var attrNode = child.getAttributes().getNamedItem("ibn:audit");
                        if(!attrNode) {
                            if (child != null && child.hasChildNodes()) {
                                var subChildren = child.getChildNodes();
                                for (var j = 0; j < subChildren.getLength(); j++) {
                                    var subChild = subChildren.item(j);
                                    if (subChild.getNodeType() === 1) {
                                        contextPath = childName;
                                        contextPath = this.getChildNodesWithContextPath(subChild, contextPath, childNameSpaces);
                                        childNames.push(contextPath);
                                    }
                                }
                            }
                        } else {
                            childNames.push(contextPath);
                        }

                        if(childNameSpaces.indexOf(nameSpace) === -1) {
                            childNameSpaces.push(nameSpace);
                        }
                        //childDetails[childName] = nameSpace;
                    }
                }
            }
        }
    }
    return {childNames : childNames, childNameSpaces: childNameSpaces};
};

/**
 * This recursive method used to compute the context path in the get config request and update the namespaces
 * If the node contain the ibn:audit="terminate" return the context path
 * Else check further.
 *
 *  Sample o/p : "bbf-l2-forwarding:forwarding/bbf-l2-forwarding:forwarders"
 * @param childNode
 * @param contextPath
 * @param namespaces
 * @returns {string}
 */
AltiplanoNetconfIntentHelper.prototype.getChildNodesWithContextPath = function (childNode, contextPath, namespaces) {
    if (childNode.getNodeType() === 1) { // Element Node
        if (childNode.getChildNodes().getLength() === 0) {
            // Don't perform anything
        } else if (childNode.getChildNodes().getLength() === 1 && childNode.getChildNodes().item(0).getNodeType() === 3) {
            // Don't perform anything
        }
        if (childNode.hasChildNodes()) {
            var childName = childNode.getLocalName();
            var nameSpace = childNode.getNamespaceURI();
            var moduleName = this.nsToModuleMap.get(nameSpace);
            if (moduleName) {
                childName = moduleName + ":" + childName;
                //xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders"
                nameSpace = "xmlns" + ":" + moduleName + "=\"" + nameSpace + "\"";
            } else {
                nameSpace = "xmlns" + "=" + "\"" + nameSpace + "\"";
            }
            var attrNode = childNode.getAttributes().getNamedItem("ibn:audit");
            if (attrNode) {
                return contextPath + "";
            } else {
                contextPath = contextPath + "/" + childName;
                if(namespaces.indexOf(nameSpace) === -1) {
                    namespaces.push(nameSpace);
                }
                var subChildren = childNode.getChildNodes();
                for (var j = 0; j < subChildren.getLength(); j++) {
                    var subChild = subChildren.item(j);
                    this.getChildNodesWithContextPath(subChild, contextPath, namespaces);
                }
            }
        }
    }
    return contextPath;
};

AltiplanoNetconfIntentHelper.prototype.executeRequest = function(requestXml, manager, deviceId) {
    var request = utilityService.stripIntentDesignAnnotations(requestXml);
    logger.debug("Altiplano virtualizer IntentTypeFwk- executing config request for manager {} deviceId {}", manager, deviceId);
    var managerType;
    if (manager) {
        var fetchKey = "managerInfo_".concat(manager);
        var managerInfo = apUtils.getContentFromIntentScope(fetchKey);
        if (managerInfo == null) {
            managerInfo =  mds.getManagerByName(manager);
            if (managerInfo != null) {
                apUtils.storeContentInIntentScope(fetchKey, managerInfo);
            }
        }
        if(managerInfo) {
            managerType = managerInfo.getType();
        }
    }
    if (managerType && managerType == intentConstants.MANAGER_TYPE_NAV) {
        var ncResponse = null;
        var deviceIds = null;
        try {
            var xpath = '/nc:rpc/nc:edit-config/nc:config/device-manager:device-manager';
            var extractedNode = utilityService.extractSubtree(requestXml, this.prefixToNsMap, xpath);
            xpath = "adh:device/adh:device-id";
            deviceIds = apUtils.getAttributeValues(extractedNode, xpath, this.prefixToNsMap);
        } catch (e) {
            logger.debug("Device id not present in the rpc request");
        }
        if(deviceIds && deviceIds.size() > 0) {
            var waitTimeForEachDevice = 10; // 10 Sec waiting time for each device
            var totalWaitTimeForAllDevice = deviceIds.size() * waitTimeForEachDevice;
            //logger.debug("total read lock wait time for all device : {}", totalWaitTimeForAllDevice);
            ibnLockService.executeWithReadLockOn(deviceIds, totalWaitTimeForAllDevice, function() {
                ncResponse = requestExecutor.executeNCWithManager(manager, request);
            }, function() {
                throw new RuntimeException("GC is in progress");
            });
        } else {
            // This else part execute other manager specific request ( eg : slice-owner creation )
            ncResponse = requestExecutor.executeNCWithManager(manager, request);
        }
        if (ncResponse == null) {
            if (deviceId) {
                logger.error("Execution Failed with No Response");
                throw new RuntimeException("Configuration is rejected for device " + deviceId + " by " + manager + ' with error: No Response');
            }
            throw new RuntimeException("Execution Failed with No Response");
        } else {
            if (!ncResponse.isOK()) {
                if (ncResponse.getException() != null) {
                    throw ncResponse.getException();
                } else {
                    if (ncResponse.getRawResponse() != null) {
                        logger.error("Execution Failed with Error Response: {}", ncResponse.getRawResponse());
                        var errorContent = this.getErrorMessage(ncResponse.getRawResponse());
                        if(errorContent.errorObject != null){
                            if (deviceId) {
                                logger.error("Execution Failed with Error Response: {}:{}", errorContent.errorObject, errorContent.errorMessage);
                                throw new RuntimeException("Configuration is rejected for device " + deviceId + " by " + manager + ' with error: ' + errorContent.errorObject + " : " + errorContent.errorMessage);
                            }
                            throw new RuntimeException("Execution Failed with Error Response: "+ errorContent.errorObject +":"+ errorContent.errorMessage);
                        }
                        if (deviceId) {
                            logger.error("Execution Failed with Error Response: {}", errorContent.errorMessage);
                            throw new RuntimeException("Configuration is rejected for device " + deviceId + " by " + manager + ' with error: ' + errorContent.errorMessage);
                        }
                        throw new RuntimeException("Execution Failed with Error Response: " + errorContent.errorMessage);
                    }
                }
            }
        }
    } else if ((managerType && managerType != intentConstants.MANAGER_TYPE_NAV) || deviceId.startsWith("Local##")) {
        var ncResponse = utilityService.executeRequest(request);
        if (ncResponse == null) {
            if (deviceId) {
                logger.error("Execution Failed with No Response");
                throw new RuntimeException("Configuration is rejected for device " + deviceId + " by " + manager + ' with error: No Response');
            }
            throw new RuntimeException("Execution Failed with No Response");
        } else {
            if (!ncResponse.isOk()) {
                if (ncResponse.responseToString() != null) {
                    logger.error("Execution Failed with Error Response: {}", ncResponse.responseToString());
                    var errorContent = this.getErrorMessage(ncResponse.responseToString());
                    if(errorContent.errorObject != null){
                        if (deviceId) {
                            logger.error("Execution Failed with Error Response: {}:{}", errorContent.errorObject, errorContent.errorMessage);
                            throw new RuntimeException("Configuration is rejected for device " + deviceId + " by " + manager + ' with error: ' + errorContent.errorObject + " : " + errorContent.errorMessage);
                        }
                        throw new RuntimeException("Execution Failed with Error Response: "+ errorContent.errorObject +":"+ errorContent.errorMessage);
                    }
                    if (deviceId) {
                        logger.error("Execution Failed with Error Response: {}", errorContent.errorMessage);
                        throw new RuntimeException("Configuration is rejected for device " + deviceId + " by " + manager + ' with error: ' + errorContent.errorMessage);
                    }
                    throw new RuntimeException("Execution Failed with Error Response: " + errorContent.errorMessage);
                }
            }
        }
    } else {
        var ncResponse = null;
        ibnLockService.executeWithReadLockOn(deviceId, function() {
            ncResponse = requestExecutor.executeNC(deviceId, request);
        }, function() {
            throw new RuntimeException("GC is in progress");
        });
        if (ncResponse == null) {
            if (deviceId) {
                logger.error("Execution Failed with No Response");
                throw new RuntimeException("Configuration is rejected for device " + deviceId + " by " + manager + ' with error: No Response');
            }
            throw new RuntimeException("Execution Failed with No Response");
        } else {
            if (!ncResponse.isOK()) {
                if (ncResponse.getException() != null) {
                    throw ncResponse.getException();
                } else {
                    if (ncResponse.getRawResponse() != null) {
                        logger.error("Execution Failed with Error Response: {}", ncResponse.getRawResponse());
                        var errorContent = this.getErrorMessage(ncResponse.getRawResponse());
                        if(errorContent.errorObject != null){
                            if (deviceId) {
                                logger.error("Execution Failed with Error Response: {}:{}", errorContent.errorObject, errorContent.errorMessage);
                                throw new RuntimeException("Configuration is rejected for device " + deviceId + " by " + manager + ' with error: ' + errorContent.errorObject + " : " + errorContent.errorMessage);
                            }
                            throw new RuntimeException("Execution Failed with Error Response: "+ errorContent.errorObject +":"+ errorContent.errorMessage);
                        }
                        if (deviceId) {
                            logger.error("Execution Failed with Error Response: {}", errorContent.errorMessage);
                            throw new RuntimeException("Configuration is rejected for device " + deviceId + " by " + manager + ' with error: ' + errorContent.errorMessage);
                        }
                        throw new RuntimeException("Execution Failed with Error Response: " + errorContent.errorMessage);
                    }
                }
            }
        }
    }
    logger.debug("Altiplano virtualizer IntentTypeFwk- request response received");
    return ncResponse;
};

AltiplanoNetconfIntentHelper.prototype.isTopologyExistForAlignedDevices = function(topology) {
    if(!topology || !topology.getXtraInfo() || topology.getXtraInfo().isEmpty()) {
        logger.debug("topology object not exit for aligned device");
        return false;
    }
    return true;
};

AltiplanoNetconfIntentHelper.prototype.isTopologyExistForAlignedDevicesWithDeviceArgs = function (topology, deviceId, stageName) {
    var key = stageName + "_" + deviceId + "_ARGS";
    var topologyExistForAlignedDevicesWithDeviceArgs = false;
    if (topology) {
        var xtraInfo = apUtils.getTopologyExtraInfo(topology);
        if (xtraInfo && xtraInfo[key]) {
            topologyExistForAlignedDevicesWithDeviceArgs = true;
        }
    }
    return topologyExistForAlignedDevicesWithDeviceArgs;
};

/**
 *
 * @param baseObject
 * @param intentConfigXml
 * @param target
 * @param networkState
 * @param ncOperation
 * @param devices
 * @param currentDeviceId
 * @param stepName
 * @returns {*}
 */
AltiplanoNetconfIntentHelper.prototype.basicTemplateArguments = function(baseObject, intentConfigXml, target, networkState, ncOperation, devices, currentDeviceId, stepName) {
    if(!ncOperation) {
        ncOperation = "";
    }
    if (!stepName) {
        stepName = "";
    } else {
        // Include step object in baseArgs
        if(devices[currentDeviceId].steps) {
            var steps = devices[currentDeviceId].steps;
            for(var index = 0; index < steps.length; index++) {
                var stepObject = steps[index];
                if(stepObject.name === stepName) {
                    baseObject["step"] = stepObject;
                    break;
                }
            }
            if(!baseObject["step"]) {
                logger.debug("Specific step not found");
            }
        }
    }
    baseObject["deviceID"] = currentDeviceId;
    baseObject["stepName"] = stepName;
    baseObject["devices"] = devices;
    baseObject["arguments"] = intentConfigXml;
    baseObject["operation"] = ncOperation;
    baseObject["networkState"] = networkState;
    baseObject["target"] = target;
    if (typeof this.intentObject.targetDelimiter === "string") {
        baseObject["targetComponents"] = target.split(this.intentObject.targetDelimiter);
    }
    if(networkState.toString() === 'suspend') {
        baseObject["isServiceSuspended"] = "true";
    }
    return baseObject;
};

AltiplanoNetconfIntentHelper.prototype._getResourceFile = function(intentObject, intentConfigJson, deviceId, stepName, templateArgs) {
    var resourceFile = null;
    // Add support to load the resource from individual steps
    if (templateArgs["step"] && templateArgs["step"].resourceFile) {
        if (typeof templateArgs["step"].resourceFile === 'string') {
            resourceFile = templateArgs["step"].resourceFile;
        } else if (typeof templateArgs["step"].resourceFile === 'function') {
            resourceFile = templateArgs["step"].resourceFile(intentConfigJson, deviceId, stepName);
        }
    } else {
        logger.debug("Step object NOT found with resourceFile");
        if (!apUtils.getContentFromIntentScope("bulkSync")) {
            intentObject = this.intentObject;
        }
        if (!intentObject.resourceFile) {
            resourceFile = "requestTemplate.xml.ftl";
        } else {
            if (typeof intentObject.resourceFile === 'string') {
                resourceFile = intentObject.resourceFile;
            } else if (typeof intentObject.resourceFile === 'function') {
                resourceFile = intentObject.resourceFile(intentConfigJson, deviceId, stepName);
            }
        }
    }
    if(!resourceFile) {
        throw new RuntimeException("No matching resource file found for device " + deviceId);
    }
    return resourceFile;
};

AltiplanoNetconfIntentHelper.prototype.getDevices = function(target){
    var devices = {};
    devices[target] = {
        value: "defaultDevice"
    }
    return devices
};

/**
 * Method used to get the topology objects
 *
 * @param deviceName
 * @param resourceFile
 * @param templateArgs
 * @returns {*}
 */
AltiplanoNetconfIntentHelper.prototype.getTopologyObjects = function (deviceName, resourceFile, templateArgs) {
    // var agrs = JSON.parse(JSON.stringify(templateArgs));
    templateArgs["isTopologyOperation"] = {
        "value": true
    }
    if(templateArgs["operation"]) {
        var operation = templateArgs["operation"]["value"];
    }
    if(operation === "remove"){
        return topologyFactory.createServiceTopology();
    }
    var topologyXml = utilityService.processTemplate(resourceProvider.getResource(resourceFile), templateArgs);
    return topologyUtility.getTopologyObjects(deviceName, topologyXml);
};

/**
 * Method used to convert XML NodeList to XML string
 *
 * @param xpath
 * @param xmlString
 * @param prefixToNsMap
 * @returns {string}
 */
AltiplanoNetconfIntentHelper.prototype.getNodeListAsString = function (xpath, xmlString, prefixToNsMap) {
    var nodes = utilityService.extractSubtree(xmlString, prefixToNsMap, xpath);
    var source = new DOMSource();
    var writer = new StringWriter();
    var result = new StreamResult(writer);
    var transformer = TransformerFactory.newInstance().newTransformer();
    transformer.setOutputProperty(OutputKeys.OMIT_XML_DECLARATION, "yes");
    for (var i = 0; i < nodes.getLength(); ++i) {
        source.setNode(nodes.item(i));
        transformer.transform(source, result);
    }
    var response = writer.toString();
    return response;
};

AltiplanoNetconfIntentHelper.prototype.getTransformedArgs = function (templateArgs){
    var transformedArgs = {};
    for (var i in templateArgs){
        if(typeof templateArgs[i] === 'string' || typeof templateArgs[i] === 'number' || typeof templateArgs[i] === 'boolean'){
            transformedArgs[i] = {};
            transformedArgs[i]["value"] = templateArgs[i];
        } else {
            transformedArgs[i] = templateArgs[i];
        }
    }

    return transformedArgs;
};

AltiplanoNetconfIntentHelper.prototype.getTransformedDependencyInfo = function (dependencyObject){
    var dependencyInfo = new java.util.ArrayList();
    var intentTypeKeys = Object.keys(dependencyObject);
    for(var j=0; j< intentTypeKeys.length; j++) {
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
};

AltiplanoNetconfIntentHelper.prototype.compare = function(oldObject, currentObject) {
    var result = {};
    var oldKeys = [];
    var currentKeys = [];
    if(currentObject && typeof currentObject ===  "object"){
        currentKeys = Object.keys(currentObject);
    } else {
        if(oldObject.value) {
            result.oldValue = oldObject.value;
            return result;
        }
    }
    /*
      In case the old object stored with array format later they change the format to object we need make the oldKeys to empty back.
      The scenario is,  sometime the script using the JSON object directly so it can be array format but later the script changing the structure to
      object due to fwk support.
      Without this change we will get old array entry with removed property , but that's not a expected.
     */
    if(oldObject && typeof oldObject ===  "object") {
        if(typeof oldObject.push === 'function' && (currentObject && typeof currentObject.push !== 'function')) {
            oldKeys = [];
        } else {
            oldKeys = Object.keys(oldObject);
        }
    }
    for (var j = 0; j < currentKeys.length; j++) {
        result[currentKeys[j]] = currentObject[currentKeys[j]];
    }
    if(oldKeys.length < currentKeys.length){
        result.changed = "changed";
    }
    for (var j = 0; j < oldKeys.length; j++) {
        var currentObjectType;
        if (currentObject) {
            currentObjectType = typeof currentObject[oldKeys[j]];
        }
        if (oldKeys[j] === "value" && (currentObjectType === "string" || currentObjectType === "number" || currentObjectType === "boolean")) {
            if (oldObject.value !== currentObject.value) {
                result.oldValue = oldObject.value;
            }
        } else if ((currentObjectType === "string" || currentObjectType === "number" || currentObjectType === "boolean") &&
            (oldKeys[j] !== "value")){
            if (oldObject[oldKeys[j]] !== result[oldKeys[j]]) {
                result.changed = "changed";
            }
        } else if (currentObjectType !== "object" && currentObjectType !== "string" && currentObjectType !== "number"
            && currentObjectType !== "boolean") {
            var oldObjectType = typeof oldObject[oldKeys[j]];
            if(oldObjectType !== "string" && oldObjectType !== "number"
                && oldObjectType !== "boolean") {
                result[oldKeys[j]] = oldObject[oldKeys[j]];
                result[oldKeys[j]]["removed"] = "removed";
            }
            result.changed = "changed";
        }else if (currentObjectType === "object" && typeof oldObject[oldKeys[j]] === "object") {
            result[oldKeys[j]] = this.compare(oldObject[oldKeys[j]],currentObject[oldKeys[j]]);
            if(result[oldKeys[j]] && (result[oldKeys[j]].changed || result[oldKeys[j]].removed)){
                result.changed = "changed";
            }
        }
    }
    return result;
};

AltiplanoNetconfIntentHelper.prototype.compareAndMergeTrackedArgsWithDiff = function(oldArgs, currentArgs) {
    var result = {};
    var currentKeys = Object.keys(currentArgs);
    var oldKeys = Object.keys(oldArgs);
    var mergedKeys = currentKeys.concat(oldKeys);
    var allUniqueKeys = mergedKeys.filter(function (item, pos) {return mergedKeys.indexOf(item) == pos});
    for (var j = 0; j < allUniqueKeys.length; j++) {
        if (this.intentObject.trackedArgs[allUniqueKeys[j]] === true && typeof oldArgs[allUniqueKeys[j]] === "object") {
            result[allUniqueKeys[j]] = this.compare(oldArgs[allUniqueKeys[j]], currentArgs[allUniqueKeys[j]]);
        } else {
            result[allUniqueKeys[j]] = currentArgs[allUniqueKeys[j]];
        }
    }
    return result;
};

AltiplanoNetconfIntentHelper.prototype.isDependencyUpdated = function(result){
    if(this.intentObject.explicitlyUpdateDependentIntents &&
        this.intentObject.explicitlyUpdateDependentIntents==true){
        return true;
    }
    var keyObjects = Object.keys(result);
    for(var key in keyObjects){
        var content = result[keyObjects[key]];
        if(typeof this.intentObject.dependencyArgs === "object"){
            if(this.intentObject.dependencyArgs[keyObjects[key]] === true && (content) &&
                (content.oldValue || content.changed)){
                return true;
            }
        }else{
            return false;
        }
    }
    return false;
};

AltiplanoNetconfIntentHelper.prototype.isTrackedArgsUpdated = function(result) {
    var keyObjects = Object.keys(result);
    for (var key in keyObjects) {
        var content = result[keyObjects[key]];
        if (content && (content.oldValue || content.changed)) {
            return true;
        }
    }
    return false;
};


AltiplanoNetconfIntentHelper.prototype.compareAndMergeDevices = function (oldDeviceList, currentDeviceList) {
    var result = {};
    var oldKeys = Object.keys(oldDeviceList);
    var currentKeys = Object.keys(currentDeviceList);
    for (var j = 0; j < currentKeys.length; j++) {
        result[currentKeys[j]] = currentDeviceList[currentKeys[j]];
    }
    for (var j = 0; j < oldKeys.length; j++) {
        if (!(typeof currentDeviceList[oldKeys[j]] === "object")) {
            result[oldKeys[j]] = oldDeviceList[oldKeys[j]];
            result[oldKeys[j]]["removed"] = "removed";
        } else if (typeof currentDeviceList[oldKeys[j]].value === "string") {
            if (currentDeviceList[oldKeys[j]].value != oldDeviceList[oldKeys[j]].value) {
                result[oldKeys[j]]["oldValue"] = oldDeviceList[oldKeys[j]].value;
            }
        }
    }
    return result;
};

/**
 * Used to get extracted device-specific-data node Mostly used, when we need
 * to find any value in the device response We can also use this for suggest
 * the values from response with combination of getNodeValue,
 * getAttributeValue and getAttributeValues
 *
 * @param resourceName
 * @param templateArgs
 * @returns {*}
 */
AltiplanoNetconfIntentHelper.prototype.getExtractedDeviceSpecificDataNode = function(resourceName, templateArgs) {
    try {
        var requestTemplate = resourceProvider.getResource(resourceName);
        var requestXml = utilityService.replaceVariablesInXmlTemplate(requestTemplate, templateArgs);
        var ncResponse = null;
        ibnLockService.executeWithReadLockOn(templateArgs.deviceID, function() {
        	ncResponse = requestExecutor.execute(templateArgs.deviceID, requestXml);
    	}, function() {
    		throw new RuntimeException("GC is in progress");
    	});
        var xPathToDsd = "/nc:rpc-reply/nc:data/device-manager:device-manager/" +
            "adh:device[adh:device-id=\'" + templateArgs.deviceID + "\']/adh:device-specific-data";
        var extractedNode = utilityService.extractSubtree(ncResponse, this.prefixToNsMap, xPathToDsd);
        return extractedNode;
    } catch (e) {
        logger.error("RPC response doesn't contain device-specific-data: {}", e);
    }
    return null;
};

/**
 * Used to get extracted node from response based on the given xpath Mostly
 * used, when we need to find any value in the device response We can also use
 * this for suggest the values from response with combination of getNodeValue,
 * getAttributeValue and getAttributeValues
 *
 * @param resourceName
 * @param templateArgs
 * @returns {*}
 */
AltiplanoNetconfIntentHelper.prototype.getExtractedNodeFromResponse = function(resourceName, templateArgs, xpath) {
    try {
        var requestTemplate = resourceProvider.getResource(resourceName);
        var requestXml = utilityService.replaceVariablesInXmlTemplate(requestTemplate, templateArgs);
        var ncResponse = null;
        ibnLockService.executeWithReadLockOn(templateArgs.deviceID, function() {
        	ncResponse = requestExecutor.execute(templateArgs.deviceID, requestXml);
    	}, function() {
    		throw new RuntimeException("GC is in progress");
    	});
        var extractedNode = utilityService.extractSubtree(ncResponse, this.prefixToNsMap, xpath);
        return extractedNode;
    } catch (e) {
        logger.error("RPC response doesn't contain device-specific-data: {}", e);
    }
    return null;
};

/**
 * true - lock the device false - unlock the device
 */
AltiplanoNetconfIntentHelper.prototype.lockOrUnlockDevice = function(deviceId,manager,lock) {
    logger.debug("lockOrUnlockDevice deviceId {} # manager {} # lock {}",deviceId,manager,lock);
    var args = {deviceId: deviceId};
    if (lock === true) {
        var requestXml = utilityService.processTemplate(this.deviceLockRequest, args);
    } else {
        var requestXml = utilityService.processTemplate(this.deviceUnlockRequest, args);
    }
    var configResponse = null
    ibnLockService.executeWithReadLockOn(deviceId, function() {
    	configResponse = requestExecutor.executeNCWithManager(manager, requestXml);
	}, function() {
		throw new RuntimeException("GC is in progress");
	});
    logger.debug("lockOrUnlockDevice deviceId {} # requestXml {} # configResponse {} # configResponse_getRawResponse {}",deviceId,requestXml,configResponse,configResponse.getRawResponse());
    if (configResponse == null || configResponse.getRawResponse() == null) {
        throw new RuntimeException("Execution Failed with error " + configResponse);
    }
};

AltiplanoNetconfIntentHelper.prototype.isConfigChanged = function(templateArgsWithDiff,leafAttribute){
    var isConfigChanged = false;
    if(templateArgsWithDiff[leafAttribute] &&
        typeof templateArgsWithDiff[leafAttribute].oldValue === "string"){
        isConfigChanged = true;
    }else{
        logger.debug("No change in the attribute: {}", leafAttribute);
    }
    return isConfigChanged;
};

AltiplanoNetconfIntentHelper.prototype.getErrorMessage = function(ncResponse){
    var errorContent = {};
    var result = utilityService.extractSubtree(ncResponse, this.prefixToNsMap,"/nc:rpc-reply");
    if (result != null && result.hasChildNodes()) {
        var nodeList = result.getChildNodes();
        for(var i=0;i<nodeList.getLength();i++){
            if(nodeList.item(i).getNodeType() == 1 && nodeList.item(i).getLocalName() == "rpc-error"){
                var rpcErrorNodeList = result.getChildNodes();
                for(var j=0;j<rpcErrorNodeList.getLength();j++){
                    if(rpcErrorNodeList.item(j).getNodeType() == 1){
                        var childNodes = rpcErrorNodeList.item(j).getChildNodes();
                        for(var k=0;k<childNodes.getLength();k++){
                            if(childNodes.item(k).getLocalName() == "error-message"){
                                errorContent.errorMessage =  childNodes.item(k).getTextContent();
                            }
                            if(childNodes.item(k).getLocalName() == "error-path"){
                                errorContent.errorObject =  this.getFullUIName(childNodes.item(k).getTextContent());
                            }
                        }
                    }
                }
            }
        }
    }
    return errorContent;
};

AltiplanoNetconfIntentHelper.prototype.getFullUIName = function(objectId) {
    var fullUIName = this.validateObjectId(objectId);
    if(fullUIName != null){
        return this.getANVFullUiName(objectId);
    }
    return fullUIName;
};

AltiplanoNetconfIntentHelper.prototype.validateObjectId = function(objectId){
    if(objectId === null || objectId === "" || objectId === undefined){
        return null;
    }
    if(objectId.startsWith("/")){
        objectId = objectId.substring(1,objectId.length);
    }
    if(!objectId.startsWith(this.ANV)){
        return null;
    }
    if(objectId.startsWith(this.ANV)){
        if(objectId.split(this.SLASH).length < 3 || !(objectId.indexOf("device-id=") > -1) || !(objectId.indexOf("device-specific-data") > -1)) {
            return null;
        }
    }
    return objectId;
};

/*
 * Below apis are just mix and match. split the objectId or relativeObjectId
 * and frame the corresponding generic type needed.
 */
AltiplanoNetconfIntentHelper.prototype.getANVFullUiName = function(objectId){
    var objIdParts =  this.splitAndGetObjectId(objectId);
    if(objIdParts && objIdParts.splitRelativeObjectId && objIdParts.splitRelativeObjectId.lastKey) {
        return decodeURIComponent(objIdParts.splitRelativeObjectId.lastKey + ":" + objIdParts.deviceName + objIdParts.splitRelativeObjectId.values);
    } else {
        return decodeURIComponent(objIdParts.splitRelativeObjectId.relObjIdPrefix);
    }
};

AltiplanoNetconfIntentHelper.prototype.splitAndGetObjectId = function(objectId){
    var splitObjectId  = new Object();
    splitObjectId.deviceName = objectId.substring(objectId.indexOf("device-id=") + "device-id=".length, objectId.indexOf("/adh:device-specific-data/"));
    if(splitObjectId.deviceName.endsWith("]")){
        splitObjectId.deviceName = splitObjectId.deviceName.substring(0,splitObjectId.deviceName.length-1);
    }
    splitObjectId.relativeObjectId = "anv:" + objectId.substring(objectId.indexOf("/adh:device-specific-data/") + "/adh:device-specific-data/".length);
    splitObjectId.splitRelativeObjectId = this.splitAndGetRelativeObjectId(splitObjectId.relativeObjectId);
    return splitObjectId;
};

AltiplanoNetconfIntentHelper.prototype.splitAndGetRelativeObjectId = function(relativeObjectId){
    var splitRelativeObjectId  = new Object();
    relativeObjectId = relativeObjectId.replace("anv:", "");
    var splitRelObjectIdArray = relativeObjectId.split("/");
    splitRelativeObjectId.relObjIdPrefix = "";

    /*
     * below for loop is to catch cases like,
     * "anv:ietf-interfaces-PMA-SX16F-5.6:interfaces/someContainer/interface=DSL1/egressrule=rule1";
     */

    var countPrefixIndex = 0;
    for(var prefixIndex=0; prefixIndex < splitRelObjectIdArray.length; prefixIndex++){
        if(splitRelObjectIdArray[prefixIndex].indexOf("=") > -1){
            break;
        }
        splitRelativeObjectId.relObjIdPrefix = splitRelativeObjectId.relObjIdPrefix + splitRelObjectIdArray[prefixIndex] + "/";
        countPrefixIndex++;
    }
    // chop off the last Slash.
    splitRelativeObjectId.relObjIdPrefix = splitRelativeObjectId.relObjIdPrefix.substring(0,
        splitRelativeObjectId.relObjIdPrefix.length -1)

    splitRelativeObjectId.keys = "";
    splitRelativeObjectId.values = "";

    for (var index=countPrefixIndex;index < splitRelObjectIdArray.length; index++)
    {
        var keyValueSplit = splitRelObjectIdArray[index].split("=");

        // might be a container without a value.
        if(keyValueSplit.length === 1)
        {
            splitRelativeObjectId.keys = splitRelativeObjectId.keys + "/" + keyValueSplit;
            splitRelativeObjectId.values = splitRelativeObjectId.values + "/" + keyValueSplit;
        } else if(keyValueSplit.length === 2) {
            splitRelativeObjectId.keys = splitRelativeObjectId.keys + "/" + keyValueSplit[0];
            splitRelativeObjectId.values = splitRelativeObjectId.values + "/" + keyValueSplit[1];
            if(splitRelativeObjectId.values.endsWith("]")){
                splitRelativeObjectId.values = splitRelativeObjectId.values.substring(0,splitRelativeObjectId.values.length-1);
            }
        }

    }

    var splitKeys = splitRelativeObjectId.keys.split("/");
    splitRelativeObjectId.lastKey = splitKeys[splitKeys.length - 1];

    return splitRelativeObjectId;
};

/**
 * expected query request: { "query": { "bool": { "must": [ { "match": {
 * "deviceRefId": <deviceName> } }, { "terms": { "alarmTypeId":[
 * "anv-software:software-error", "anv-software:artifact-download-error"]} },
 *  {"match": {"alarmStatus": "Active"} } ] } }
 */
AltiplanoNetconfIntentHelper.prototype.getSoftwareErrorAlarmQueryString = function(deviceName){
    var object = {};
    var booleanRootObject = {};
    var mustArray = [];
    var deviceMatchObject = {"match": {"deviceRefId": deviceName}};
    var alarmTypeMatchObject = {"terms":{"alarmTypeId":["anv-software:software-error", "anv-software:artifact-download-error"]}};
    var alarmStatusObject = {"match": {"alarmStatus": "Active"}};
    mustArray.push(deviceMatchObject);
    mustArray.push(alarmTypeMatchObject);
    mustArray.push(alarmStatusObject);
    var booleanRootObject = {"bool":{"must":mustArray}};
    object["query"] = booleanRootObject;
    return JSON.stringify(object);
};

AltiplanoNetconfIntentHelper.prototype.isSoftwareErrorExists = function(deviceName){
    var alarmQueryString = this.getSoftwareErrorAlarmQueryString(deviceName);
    var alarms = this.getAlarms(alarmQueryString);
    if(alarms && alarms.length){
        alarms = JSON.parse(alarms);
        if (alarms!=null && alarms.hits!=null && alarms.hits.total.value!=0) {
            return true;
        }
    }
    return false;
};

AltiplanoNetconfIntentHelper.prototype.getAlarms = function(queryString){
    try {
        var alarms = esQueryService.queryESAlarms("/alarms-active", queryString);
        return alarms;
    } catch (err) {
        logger.error("error while parsing alarms: {}", err);
        return null;
    }
};

AltiplanoNetconfIntentHelper.prototype.retrySoftwareAlignment = function(manager,deviceName){
    logger.debug("retry Software alignment on the deviceId: {}", deviceName);
    var args = {deviceId: deviceName};
    var requestXml = utilityService.processTemplate(this.retrySoftwareAlignmentRequest, args);
    var ncResponse = null;
    ibnLockService.executeWithReadLockOn(deviceName, function() {
    	ncResponse = requestExecutor.executeNCWithManager(manager, requestXml);
	}, function() {
		throw new RuntimeException("GC is in progress");
	});
    if (ncResponse == null) {
        throw new RuntimeException("Software alignment Execution Failed with No Response");
    } else {
        if (!ncResponse.isOK()) {
            if (ncResponse.getException() != null) {
                throw ncResponse.getException();
            } else {
                if (ncResponse.getRawResponse() != null) {
                    logger.error("Software alignment Execution Failed with error: {}", ncResponse.getRawResponse());
                    var errorContent = this.getErrorMessage(ncResponse.getRawResponse());
                    if(errorContent.errorObject != null){
                        throw new RuntimeException("Software alignment Execution Failed with error: " + errorContent.errorObject+":"+errorContent.errorMessage);
                    }
                    throw new RuntimeException("Software alignment Execution Failed with error: " + errorContent.errorMessage);
                }
            }
        }
    }
};



AltiplanoNetconfIntentHelper.prototype.isCTMeantForTypeBRole = function(devices, deviceName) {
  var deviceDetails = {};
  apUtils.getMergedObject(deviceDetails, devices);
  var devicesKeys = Object.keys(deviceDetails);
  devicesKeys.forEach(function (value) {
      if ((deviceDetails[value]["removed"])) {
          delete deviceDetails[value];
      }
  });
  if(deviceDetails) {
      var sortedObject = this.constructSortedDeviceArrayWithNameAndOrder(deviceDetails);
      if(sortedObject) {
          if(sortedObject.length == 2) {
              var deviceObject = sortedObject[0];
              if(deviceObject.deviceName === deviceName) {
                  return true;
              }
          }
      }
  }
  return false;
};

AltiplanoNetconfIntentHelper.prototype.getInterfaceParams = function (template, templateArgs, xpath, skipCharCount) {
  var result = new Object();
  var trimmedParam;
  try {
      var deviceXml = this.getExtractedDeviceSpecificDataNode(template, templateArgs);
      var interfaceParams = utilityService.getAttributeValues(deviceXml, xpath, this.prefixToNsMap);
      if (skipCharCount) {
          interfaceParams.forEach(function (name) {
              trimmedParam = name.substring(skipCharCount);
              result[trimmedParam] = trimmedParam;
          });
      } else {
          interfaceParams.forEach(function (name) {
              result[name] = name;
          });
      }
  } catch (e) {
      logger.error("Mismatch in configuration between device and expected parameter {}", e);
  }
  return result;
};

/*
Method to get a function to handle the key-names for the list defined in Intents
usage : xml to json conversion
*/
AltiplanoNetconfIntentHelper.prototype.getKeyForList = function (intentType) {
  if(intentType === 'lightspan-cf-infra-network-interface') {
      return function(listName) {
          switch (listName) {
              case "uplink-ports":
                  return "port-name";
              case "aggregating-system":
                  return "agg-system";
              default:
                  return null;
          }
      }
  }
};


/**
 * Method used to convert the JS object into netconf fwk support format.
 * Input: {
    "cache": [
        {
            "name": "copper-interfaces-state",
            "state": "enabled",
            "permanentCache": {
                "exportInterval": "900",
                "cacheLayout": {
                    "cacheField": [
                        {
                            "name": "Field1",
                            "ieName": "/if:interfaces-state/if:interface/if:name"
                        },
                        {
                            "name": "Field2",
                            "ieName": "/if:interfaces-state/if:interface/if:admin-status"
                        },
                        {
                            "name": "Field3",
                            "ieName": "/if:interfaces-state/if:interface/if:oper-status"
                        }
                    ]
                }
            }
        }
    ]
}

 keyObject : {
    "cache": {
        "key":"name",
        "permanentCache": {
            "cacheLayout": {
                "cacheField" : {
                    "key": "name"
                }
            }
        }
    }
}

 O/P:
 {
 "cache": {
    "copper-interfaces-state": {
      "name": "copper-interfaces-state",
      "state": "enabled",
      "permanentCache": {
        "exportInterval": "900",
        "cacheLayout": {
          "cacheField": {
            "Field1": {
              "name": "Field1",
              "ieName": "/if:interfaces-state/if:interface/if:name"
            },
            "Field2": {
              "name": "Field2",
              "ieName": "/if:interfaces-state/if:interface/if:admin-status"
            },
            "Field3": {
              "name": "Field3",
              "ieName": "/if:interfaces-state/if:interface/if:oper-status"
            }
          }
        }
      }
    }
  }
 }
 * @param inputObject - input json object.
 * @param keyObject - keySchema for coverting.
 * @param json - the output value updated in this object.
 */
AltiplanoNetconfIntentHelper.prototype.convertObjectToNetconfFwkFormat = function (inputObject, keyObject, json) {
    var convertObject = function(baseObject, baseName, keyObjectBase) {
        var keyObject = JSON.parse(JSON.stringify(keyObjectBase));
        var result = JSON.parse(JSON.stringify(baseObject));
        if (baseObject) {
            if (typeof baseObject === 'object') {
                if (baseObject[baseName] && typeof baseObject[baseName].push === 'function') {
                    if (baseObject[baseName].length > 0 && typeof baseObject[baseName][0] === 'object' && typeof baseObject[baseName][0].push !== 'function') {
                        result[baseName] = {};
                        var baseKey = keyObject["key"];
                        delete keyObject["key"];
                        baseObject[baseName].forEach(function (subObject) {
                            result[baseName][subObject[baseKey]] = subObject;
                            if (Object.keys(keyObject).length > 0) {
                                Object.keys(keyObject).forEach(function (subKey) {
                                    result[baseName][subObject[baseKey]][subKey] = convertObject(result[baseName][subObject[baseKey]], subKey, keyObject[subKey])[subKey];
                                });
                            }
                        });
                    }
                } else {
                    if(baseObject[baseName]) {
                        result[baseName] = baseObject[baseName];
                        if (Object.keys(keyObject).length > 0) {
                            Object.keys(keyObject).forEach(function (subKey) {
                                result[baseName][subKey] = convertObject(result[baseName], subKey, keyObject[subKey])[subKey];
                            });
                        }
                    }
                }
            }
        }
        return result;
    }

    if(!json) {
        json = {};
    }

    if(inputObject && keyObject && Object.keys(keyObject).length > 0) {
        Object.keys(keyObject).forEach(function (key) {
            var actualObject = {};
            actualObject[key] = inputObject[key];
            var result = convertObject(actualObject, key, keyObject[key]);
            if(result && result[key]) {
                json[key] = result[key];
            }
        });
    }

    return json;


}
