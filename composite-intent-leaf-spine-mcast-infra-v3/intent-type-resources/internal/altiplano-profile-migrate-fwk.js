var migrateRequestScope = new ThreadLocal();

function AltiplanoMigrateProfileHelper() {
    // The single input which MUST have all mandatory call back functions and properties to override behavior.
    this.migrateConfig = null;
}

AltiplanoMigrateProfileHelper.prototype.setMigrateConfig = function (inputConfig) {
    this.migrateConfig = inputConfig;
};


/**
 * Method which executes the migration logic given in below format
 * 

 var profileDataObject = {
     getProfiles: function(intentTypeName, intentTypeVersion, associatedProfiles) {
        //  It will return all the profiles applicable for migration
        //  It should be an Array.
     },

     // In general if there is no handler/rules inside the object then the object return by migrate step is enough
     getMigrateSteps: function(sourceFile, intentTypeName, intentTypeVersion, associatedProfiles) {
         var steps = [];
         steps.push(profileMigrateObject1);
         steps.push(profileMigrateObject2);
         ...
         return steps;
     }
 }

    // Sample construction of profileMigrateObjectx
    var content = {
        classifiers: [
        {
            name: "CC-pbit0-7_to_TC0_999",
        },
        ],
    };
    var hwGroup = [
        {
        doesNotEqual: "LS-FX-FELT-B-DOWNLINK",
        },
    ];

    var profileMigrateObject1 = {
                //profileName, profileType, subType, profileRelease, profileVersion, baseReleaseOnlyUsableBefore, hardwareGroups, slicingMode, content
                profileName: "CC-pbit0-7-TC0_test",
                profileType: "policies",
                subType: "LS-Fiber",
                profileRelease: "23.3",
                profileVersion: "1",
                baseReleaseOnlyUsableBefore: "23.3",
                hardwareGroups: hwGroup,
                slicingMode: "non-slicing",
                content: content,
                operation: "create"
          
    };
 }*/
AltiplanoMigrateProfileHelper.prototype.migrateProfiles = function (intentTypeName, intentTypeVersion, associatedProfiles) {
    logger.debug("AltiplanoMigrateProfileHelper::migrateProfiles Called by {}-v{}", intentTypeName, intentTypeVersion);
    /*
     * Pre-conditions
     */
    this.validatePreConditions();
    try {
        var self = this;
        var requestContext = this.getRequestContext(intentTypeName, intentTypeVersion);
        requestContext.put("mgfwk", this);
        var profileMigrationData = new ArrayList();
        var profileVos = this.migrateConfig.getProfiles(intentTypeName, intentTypeVersion, associatedProfiles);
        if (profileVos && typeof profileVos.push === 'function' && profileVos.length > 0) {
            profileVos.forEach(function (profile) {
                try {
                    if(!profile) {
                        throw new RuntimeException("Invalid profile: value is either null or undefined");
                    }
                    var migratedSteps = self.migrateConfig.getMigrateSteps(profile, intentTypeName, intentTypeVersion, associatedProfiles);
                    if (migratedSteps && typeof migratedSteps.push === 'function' && migratedSteps.length > 0) {
                        logger.debug("Executing step object");
                        var profileMigrationSteps = new ArrayList();
                        migratedSteps.forEach(function (migratedStep) {
                            if(!migratedStep) {
                                throw new RuntimeException("Invalid migratedStep: value is either null or undefined");
                            }
                            self.validateMigrateStepData(migratedStep);
                            var migratedProfile = self.createMigratedProfile(migratedStep, profile);
                            logger.debug("migratedProfile : {}", migratedProfile);
                            if (migratedStep.intentTypeVersion && migratedStep.intentTypeName) {
                                var migrateStep = self.createProfMigStepForProfile(migratedStep.operation, migratedProfile, migratedStep.intentTypeName, migratedStep.intentTypeVersion, migratedStep.baseReleaseOnlyUsableBefore);
                            } else {
                                var migrateStep = self.createProfMigStepForProfile(migratedStep.operation, migratedProfile, intentTypeName, intentTypeVersion, migratedStep.baseReleaseOnlyUsableBefore);
                            }
                            profileMigrationSteps.add(migrateStep);
                        });
                        var sourceProfile = self.getSourceProfile(profile);
                        var profMigrationData = profileMigrationDataFactory.createProfileMigrationData(sourceProfile, profileMigrationSteps);
                        profileMigrationData.add(profMigrationData);
                    } else {
                        logger.info("Profile contain no steps for migration : {}", profile.getName());
                    }
                } catch(e) {
                    logger.error("Error while migrate profile:{} for intentTypeName : {} with version : {} - Error {}", profile, intentTypeName, intentTypeVersion, e);
                    var errorMsg = self.translateErrorMessage(e, profile);
                    var profMigrationData = profileMigrationDataFactory.createProfileMigrationData(self.getSourceProfile(profile), errorMsg);
                    profileMigrationData.add(profMigrationData);
                }
            });
            if (profileMigrationData.size() > 0) {
                if (self.migrateConfig.postProfilesMigration && typeof self.migrateConfig.postProfilesMigration === 'function') {
                    profileMigrationData = self.migrateConfig.postProfilesMigration(intentTypeName, intentTypeVersion, associatedProfiles, profileMigrationData);
                    if (!profileMigrationData && profileMigrationData.size() == 0) {
                        throw new RuntimeException("Post migration data is empty");
                    }
                }
            }
        } else {
            logger.debug("migrateProfiles : Profiles are empty");
        }
    } catch (e) {
        migrateRequestScope.remove();
        logger.error("Error while migrate profiles for intentTypeName : {} with version : {} - Error {}", intentTypeName, intentTypeVersion, e);
        // We are not throwing errors because other profile migration also will fail due to this failure
        // Update the behavior, the core already catched exception, so it can be thrown.
        throw new RuntimeException(e);
    }
    migrateRequestScope.remove();
    return profileMigrationData;
};

AltiplanoMigrateProfileHelper.prototype.translateErrorMessage = function (exception, sourceProfile) {
    if (typeof exception.getClass === "function" && typeof exception.getClass().getName === "function" && 
    exception.getClass() && exception.getClass().getName() && exception.getClass().getName().indexOf("UndeclaredThrowableException") > -1) {
        var errorDetail = {};
        apUtils.getRootCauseException(exception, errorDetail);
        if(errorDetail.rootCauseException && errorDetail.messageDetail) {
            return errorDetail.rootCauseException + ":" + errorDetail.messageDetail;
        }
    } else if (typeof exception.getMessage === "function" && exception.getMessage()) {
        return exception.getMessage()
    }
    return "Error while migrate profile : " + sourceProfile.getName();
}

/**
 * Method use to get source profile details for migration.
 * @param {*} profileVo 
 * @returns 
 */
AltiplanoMigrateProfileHelper.prototype.getSourceProfile = function (profileVo) {
    var sourceProfile = intentProfileFactory.createIntentProfileVO(profileVo.getName(), profileVo.getProfileType(), profileVo.getSubtype(), profileVo.getBaseRelease(), profileVo.getVersion());
    return sourceProfile;
}
/**
 * Create object node for given JSON string.
 * @param {*} jsonString 
 * @returns 
 */
AltiplanoMigrateProfileHelper.prototype.getObjectNode = function (jsonString) {
    var objectNode = new ObjectMapper().readValue(jsonString, ObjectNode.class);
    return objectNode;
}

/**
 * Method used to create a Migrated Profile VO
 * @param {*} migrateData 
 * @returns migratedProfileVo
 */
AltiplanoMigrateProfileHelper.prototype.createMigratedProfile = function (migrateData, srcProfile) {
    var self = this;
    self.validateMigrateData(migrateData, srcProfile);
    
    if(migrateData.operation === intentConstants.PROFILE_MIGRATE_ASSOCIATE_OPERATION || migrateData.operation === intentConstants.PROFILE_MIGRATE_DELETE_OPERATION) {
        if(migrateData.isAbstractProfile && migrateData.isAbstractProfile == "true") {
            return migratedProfileFactory.createMigratedProfile(migrateData.profileName, migrateData.profileType, migrateData.subType, "any", migrateData.profileVersion);
        } else {
            return migratedProfileFactory.createMigratedProfile(migrateData.profileName, migrateData.profileType, migrateData.subType, migrateData.profileRelease, migrateData.profileVersion);
        }
    } else if(migrateData.operation === intentConstants.PROFILE_MIGRATE_CREATE_OPERATION || migrateData.operation === intentConstants.PROFILE_MIGRATE_CREATE_AND_ASSOCIATE_OPERATION) {
        return createMigratedProfileObj(migrateData);
    } else if(migrateData.operation === intentConstants.PROFILE_MIGRATE_MARK_ONLY_USABLE_BEFORE_OPERATION) {
        if(migrateData && migrateData.baseReleaseOnlyUsableBefore ){
            if(!migrateData.profileName && !migrateData.profileType && !migrateData.subType && !migrateData.profileRelease && !migrateData.profileVersion) {
                return null;
            } else if(!migrateData.content) {
                return migratedProfileFactory.createMigratedProfileForMarkOnlyUsableBefore(migrateData.profileName, migrateData.profileType, migrateData.subType, migrateData.profileRelease, 
                    migrateData.profileVersion, migrateData.baseReleaseOnlyUsableBefore);
            } else {
                return createMigratedProfileObj(migrateData);
            }
        } 
    } else if(migrateData.operation === intentConstants.PROFILE_MIGRATE_REPLACE_HARDWAR_GROUP_OPERATION) {
        return migratedProfileFactory.createMigratedProfileForReplaceHardwareGroups(migrateData.profileName, migrateData.profileType, migrateData.subType, migrateData.profileRelease, 
            migrateData.profileVersion, migrateData.hardwareGroups);
    } else if(migrateData.operation === intentConstants.PROFILE_MIGRATE_REPLACE_SLICING_MODE_OPERATION) {
        return migratedProfileFactory.createMigratedProfileForReplaceSlicingMode(migrateData.profileName, migrateData.profileType, migrateData.subType, migrateData.profileRelease, 
            migrateData.profileVersion, migrateData.slicingMode);
    }
    function createMigratedProfileObj(migrateData) {
        var hwSet = getHwGroups(migrateData.hardwareGroups);
        var objectNode = null;
        if (migrateData.content) {
            objectNode = self.getObjectNode(JSON.stringify(migrateData.content));
        }
        var baseReleaseOnlyUsableBefore = null;
        if(migrateData.baseReleaseOnlyUsableBefore) {
            baseReleaseOnlyUsableBefore = migrateData.baseReleaseOnlyUsableBefore;
        }

        var sliceMode = null;
        if(migrateData.slicingMode) {
            sliceMode = migrateData.slicingMode;
        }

        if(migrateData.isAbstractProfile && migrateData.isAbstractProfile == "true") {
            if(!migrateData.profileName && !migrateData.profileType && !migrateData.subType && migrateData.profileVersion) {
                return migratedProfileFactory.createMigratedAbstractProfile( migrateData.profileVersion, objectNode);
            } else {
                return migratedProfileFactory.createMigratedAbstractProfile(migrateData.profileName, migrateData.profileType,
                    migrateData.subType, migrateData.profileVersion, objectNode);
            }
        }  else if(migrateData.skipValidation && migrateData.skipValidation == "true") {
            if(!migrateData.profileName && !migrateData.profileType && !migrateData.subType && migrateData.profileRelease) {
                return migratedProfileFactory.createMigratedDeviceProfile(migrateData.profileRelease, baseReleaseOnlyUsableBefore, hwSet, sliceMode, objectNode, true);
            } else {
                return migratedProfileFactory.createMigratedProfile(migrateData.profileName, migrateData.profileType, migrateData.subType, migrateData.profileRelease,
                    migrateData.profileVersion, baseReleaseOnlyUsableBefore, hwSet, sliceMode, objectNode, true);
            }
        } else {
            return migratedProfileFactory.createMigratedProfile(migrateData.profileName, migrateData.profileType, migrateData.subType, migrateData.profileRelease,
                migrateData.profileVersion, baseReleaseOnlyUsableBefore, hwSet, sliceMode, objectNode);
        }
    }

    function getHwGroups(hardwareGroups) {
        var hwSet = null;
        if (hardwareGroups && typeof hardwareGroups.push === "function" && hardwareGroups.length > 0) {
            hwSet = new HashSet();
            hardwareGroups.forEach(function (hwGroup) {
                hwSet.add(JSON.stringify(hwGroup));
            });
        } else if (hardwareGroups && typeof hardwareGroups.size == "function" && hardwareGroups.size() > 0) { // some case like get the hw detils from original vo return as set object 
            return hardwareGroups;
        }
        return hwSet;
    }
}

/**
 * This method will generate the migrated step object for given input
 * @param {*} operation 
 * @param {*} migratedProfile 
 * @param {*} intentType 
 * @param {*} intentTypeVersion 
 * @param {*} baseReleaseOnlyUsableBefore 
 * @returns 
 */
AltiplanoMigrateProfileHelper.prototype.createProfMigStepForProfile = function (operation, migratedProfile, intentType, intentTypeVersion, baseReleaseOnlyUsableBefore) {
    if (!operation) {
        throw new RuntimeException("Migrate operation can't be empty");
    }
    switch (operation) {
        case intentConstants.PROFILE_MIGRATE_CREATE_OPERATION:
            if (!migratedProfile) {
                throw new RuntimeException("Migrated profile not present");
            }
        case intentConstants.PROFILE_MIGRATE_DELETE_OPERATION:
            return profileMigrationStepFactory.createProfMigStep(operation, migratedProfile);
        case intentConstants.PROFILE_MIGRATE_REPLACE_SLICING_MODE_OPERATION:
            if (!migratedProfile || !migratedProfile.getSlicingMode()) {
                throw new RuntimeException("Migrated profile with slice mode present");
            }
            return profileMigrationStepFactory.createProfMigStep(operation, migratedProfile);
        case intentConstants.PROFILE_MIGRATE_REPLACE_HARDWAR_GROUP_OPERATION:
            if (!migratedProfile || !migratedProfile.getHardwareGroups()) {
                throw new RuntimeException("Migrated profile with hw groups not present");
            }
            return profileMigrationStepFactory.createProfMigStep(operation, migratedProfile);
        case intentConstants.PROFILE_MIGRATE_MARK_ONLY_USABLE_BEFORE_OPERATION:
            // if there is no migrated profile the core will take the source profile as input and it will mark the end release for that.
            if(!migratedProfile && baseReleaseOnlyUsableBefore) {
                return profileMigrationStepFactory.createProfMigStepForMarkOnlyUsableBefore(operation, baseReleaseOnlyUsableBefore);
            } else {
                if(migratedProfile && migratedProfile.getBaseReleaseOnlyUsableBefore()) {
                    var useBeforeObject = profileMigrationStepFactory.createProfMigStepForMarkOnlyUsableBefore(operation, migratedProfile.getBaseReleaseOnlyUsableBefore());
                    if(migratedProfile.getContent() || (migratedProfile.getProfileType() && migratedProfile.getName() && migratedProfile.getSubtype() && 
                    migratedProfile.getProfileRelease() && migratedProfile.getProfileVersion())) {
                        useBeforeObject.setMigratedProfile(migratedProfile);
                    }
                    return useBeforeObject;
                } else {
                    throw new RuntimeException("Missing baseReleaseOnlyUsableBefore in migration step");
                }
            }
        case intentConstants.PROFILE_MIGRATE_ASSOCIATE_OPERATION:
        case intentConstants.PROFILE_MIGRATE_CREATE_AND_ASSOCIATE_OPERATION:
            if (!migratedProfile) {
                throw new RuntimeException("Migrated profile not present");
            }
            if (!intentType || !intentTypeVersion) {
                throw new RuntimeException("For associate or create-and-associate operation intent type and version pair is mandatory")
            }
            var Pair = Java.type('org.broadband_forum.obbaa.netconf.api.util.Pair');
            var pair = new Pair(intentType, intentTypeVersion);
            return profileMigrationStepFactory.createProfMigStepForProfileCreationAssociation(intentConstants.PROFILE_MIGRATE_CREATE_AND_ASSOCIATE_OPERATION, migratedProfile, pair);
        default:
            throw new RuntimeException("Invalid migrate operation " + operation);

    }
}

AltiplanoMigrateProfileHelper.prototype.getRequestContext = function (intentTypeName, intentTypeVersion) {
    var requestContext = new HashMap();
    migrateRequestScope.set(requestContext);
    requestContext.put("intentTypeName", intentTypeName);
    requestContext.put("intentTypeVersion", intentTypeVersion);
    return requestContext;
};

AltiplanoMigrateProfileHelper.prototype.validateMigrateData = function(migrateData, srcProfile) {
    if(!migrateData) {
        throw new RuntimeException("Error while create migratedProfile  : migrated data is empty");
    }
    if(migrateData.operation !== intentConstants.PROFILE_MIGRATE_MARK_ONLY_USABLE_BEFORE_OPERATION ) {

        if(migrateData.operation === intentConstants.PROFILE_MIGRATE_ASSOCIATE_OPERATION ||
            migrateData.operation === intentConstants.PROFILE_MIGRATE_DELETE_OPERATION) {
            if((!migrateData.isAbstractProfile || migrateData.isAbstractProfile == "false")  &&
                (!migrateData.profileName || !migrateData.profileType || !migrateData.subType ||  !migrateData.profileVersion )){
                throw new RuntimeException("Error while create migratedProfile profileName : {}, profileType : {}, subType: {}, profileVersion : {} values are mandatory",
                    migrateData.profileName, migrateData.profileType, migrateData.subType, migrateData.profileVersion);
            }

            if((migrateData.isAbstractProfile && migrateData.isAbstractProfile == "true")  &&
                (!migrateData.profileName || !migrateData.profileType || !migrateData.subType ||  !migrateData.profileVersion)){
                throw new RuntimeException("Error while create migratedProfile profileName : {}, profileType : {}, subType: {},  profileVersion : {} values are mandatory",
                    migrateData.profileName, migrateData.profileType, migrateData.subType, migrateData.profileVersion);
            }
        }
        if((!migrateData.isAbstractProfile || migrateData.isAbstractProfile == "false")  && !migrateData.profileRelease ) {
            throw new RuntimeException("Error while create migratedProfile profileName : {}, profileType : {}, subType: {}, profileRelease: {} values are mandatory",
                srcProfile.getName(), srcProfile.getProfileType(), srcProfile.getSubtype(), migrateData.profileRelease );
        }

        if ((migrateData.isAbstractProfile && migrateData.isAbstractProfile == "true") && !migrateData.profileVersion) {
            throw new RuntimeException("Error while create migratedProfile profileName : {}, profileType : {}, subType: {}, profileVersion : {} values are mandatory",
                srcProfile.getName(), srcProfile.getProfileType(), srcProfile.getSubtype(), migrateData.profileVersion);
        }
    }
}
AltiplanoMigrateProfileHelper.prototype.validateMigrateStepData = function(migratedStep) {
    if(!migratedStep.operation) {
        throw new RuntimeException("Migrate operation can't be empty");
    }
}
AltiplanoMigrateProfileHelper.prototype.validatePreConditions = function () {
    this.checkInit();
    // All Mandatory Call-back functions are available?
    this.checkIfFunction(this.migrateConfig.getProfiles, "getProfiles");
    this.checkIfFunction(this.migrateConfig.getMigrateSteps, "getMigrateSteps");
};

AltiplanoMigrateProfileHelper.prototype.checkInit = function () {
    if (this.migrateConfig == null) { // This method alone depends on the extensionConfig to check validity.
        throw new RuntimeException("AltiplanoMigrateProfileHelper instantiated but not configured");
    }
};

AltiplanoMigrateProfileHelper.prototype.checkIfFunction = function (input, name) {
    if (!(typeof input === "function")) {
        throw new RuntimeException(name + " Callback Function is Mandatory.");
    }
};

/**
 * 
 *  Sample input
 * [
        {
            "name": "Construct cache",
            "resourceFile": "internal/migrate-profile/2303/user-story-name/xslt/lsr2212_to_lsr2303_qos_simplification_01_construct_cache.xsl"
        },
        {
            "name": "Set enhanced filter",
            "resourceFile": "internal/migrate-profile/2303/user-story-name/xslt/lsr2212_to_lsr2303_qos_simplification_02_set_enhanced_filter.xsl"
        },
        ...
    ];

    This method will execute each xslt in order and take the previous xslt out as input to the next process.
 * @param {*} steps 
 * @param {*} input 
 * @param {*} prefixLog is used to filter log in kibana easily: such as: QosMigration: LS-Ethernet - US_IPTV
 * @returns 
 */

AltiplanoMigrateProfileHelper.prototype.processBulkXsltTemplates = function (steps, input, prefixLog) {
    if (!steps || typeof steps.push !== "function" || steps.length === 0) return;
    let output;
    prefixLog = prefixLog || "";
    steps.forEach(function (step) {
        if (typeof step === "String") {
            output = apUtils.processXsltTemplate(resourceProvider.getResource(step), output ? output : input);
            logger.debug("{} XSLT Transformation output is ", prefixLog, output);
        } else if (step && typeof step === "object" && step.resourceFile) {
            output = apUtils.processXsltTemplate(resourceProvider.getResource(step.resourceFile), output ? output : input);
            logger.debug("{} XSLT Transformation output of steps {} is {}", prefixLog, step.name, output);
        }
    });
    return output;
}

/*
 **Method to process the merged Json object to create the profileObject
 * 
 * @param {*} mergedJsonObj 
 * @returns 
 */
AltiplanoMigrateProfileHelper.prototype.processMergedJsonObject = function(sourceFile, mergedJsonObj, baseRelease, callback, baseReleaseOnlyUsableBefore) {
    if (!mergedJsonObj || typeof mergedJsonObj !== "object") {
        logger.warn("merged json object is empty for processing qos profile.");
    }; 
    //only compute the profileName, profileType, operation, content and profileRelease (in case of create), baseReleaseOnlyUsableBefore (in case of removal)
    //Other profileRelease (in case of removal), version, slicing-mode, hardware-groups will be created in the call back based on specific handler
    function computeMigratedObject (object, profileType, baseRelease) {
        let migratedProfile = {};
        migratedProfile["profileName"] = object.name;
        migratedProfile["profileType"] = profileType;
        if(object.hasOwnProperty("added") && object.added === "added"){
            migratedProfile["profileRelease"]= baseRelease;
            migratedProfile["operation"] = intentConstants.PROFILE_MIGRATE_CREATE_AND_ASSOCIATE_OPERATION;
            migratedProfile["content"] = object["content"];
        } else if(object.hasOwnProperty("removed") && object.removed === "removed"){
            if (baseReleaseOnlyUsableBefore) {
                migratedProfile["baseReleaseOnlyUsableBefore"] = baseReleaseOnlyUsableBefore;
            } else {
                migratedProfile["baseReleaseOnlyUsableBefore"] = baseRelease;
            }
            migratedProfile["operation"] = intentConstants.PROFILE_MIGRATE_MARK_ONLY_USABLE_BEFORE_OPERATION;
        }
        if (!migratedProfile.hasOwnProperty("operation")) {
            return null
        }
        return migratedProfile;
    }
    var migratedProfiles =[];
    if (mergedJsonObj) {
        let mergedObjectKeys = Object.keys(mergedJsonObj);
        mergedObjectKeys.forEach(function(key){
            let profileType = key;
            let profiles = mergedJsonObj[key];
            let profileKeys = Object.keys(profiles);
            profileKeys.forEach(function(pkey){
                let profile = profiles[pkey];
                let migratedProfile = computeMigratedObject(profile, profileType, baseRelease);
                if (migratedProfile) {
                    if (callback && typeof callback === "function") {
                        callback(sourceFile, migratedProfile, mergedJsonObj);
                    }
                    migratedProfiles.push(migratedProfile);
                }
            });
        });
    }
    return migratedProfiles; 
};

/**
 * parse a Set of String to js object, hardwareGroups may come from profile.getHardwareGroups()
 * @param {Set<String>} hardwareGroups 
 * @returns 
 */
AltiplanoMigrateProfileHelper.prototype.parseHardwareGroups = function(hardwareGroups) {
    let parsedHardwareGroups = [];
    if (hardwareGroups && hardwareGroups.size() > 0) {
       hardwareGroups.forEach(function(hardware){
           parsedHardwareGroups.push(JSON.parse(hardware));
       })
    }
    return parsedHardwareGroups;
}

/**
 * This method is used to check if an object is an object or not
 * @param object that need to be checked
 * @returns true/false
 */
AltiplanoMigrateProfileHelper.prototype.isObject = function(object){
    return object != null && typeof object === 'object';
}

/**
 * This method is used to check if an object is an object or not
 * @param object that need to be checked
 * @returns true/false
 */
AltiplanoMigrateProfileHelper.prototype.stripObjEmptyKey = function(object){
    if (Object.keys(object).length > 0){
        for (var key of Object.keys(object)) {
            if (object[key] === null || (this.isObject(object[key]) && Object.keys(object[key]).length == 0)) {
                delete object[key];
            }
        }
    }
    return Object.keys(object);
}

/**
 * This method used to compare 2 objects (example: migrated Object and original Object)
 * @param object1
 * @param object2
 * @param strictMode: strictly compare 2 objects or not
 * @returns true/false
 */
AltiplanoMigrateProfileHelper.prototype.compareTwoObjects = function(object1, object2, strictMode){
    var keys1 = Object.keys(object1);
    var keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        if (strictMode) {
            return false;
        }
        var areObjects = this.isObject(object1) && this.isObject(object2);
        if (areObjects) {
            var newKeys1 = this.stripObjEmptyKey(object1);
            var newKeys2 = this.stripObjEmptyKey(object2);
            if (newKeys1.length !== newKeys2.length) {
                return false;
            }
        } else {
            return false;
        }
    }
    for (var index in keys1) {
        var key = keys1[index];
        var value1 = object1[key];
        var value2 = object2[key];
        var areObjects = this.isObject(value1) && this.isObject(value2);
        if (strictMode) {
            if (areObjects && !this.compareTwoObjects(value1, value2, true) || !areObjects && value1 !== value2) {
                return false;
            }
        } else {
            if (Array.isArray(value1) && value1.length == 1 && value1[0] === null && value2 === "") continue;
            if (Array.isArray(value2) && value2.length == 1 && value2[0] === null && value1 === "") continue;
            if (this.isObject(value1) && Object.keys(value1).length === 0 && (value2 === null || value2 === undefined || value2 === "")) continue;
            if (this.isObject(value2) && Object.keys(value2).length === 0 && (value1 === null || value1 === undefined || value1 === "")) continue;
            if (value1 === "" && (value2 === undefined || value2 === null)) continue;
            if (value2 === "" && (value1 === undefined || value1 === null)) continue;
            if (areObjects && !this.compareTwoObjects(value1, value2, false) || !areObjects && ((isNaN(parseInt(value1)) && isNaN(parseInt(value2)) && value1 !== value2) || (!isNaN(parseInt(value1)) && !isNaN(parseInt(value2)) && parseInt(value1) !== parseInt(value2)))) {
                return false;
            }
        }
    }
    return true;
}
