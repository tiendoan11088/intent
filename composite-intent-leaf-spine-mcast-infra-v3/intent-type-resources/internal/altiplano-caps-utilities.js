/**
* (c) 2020 Nokia. All Rights Reserved.
*
* INTERNAL - DO NOT COPY / EDIT
**/
load({script: resourceProvider.getResource('internal/altiplano-caps-constants.js'), name: 'altiplano-caps-constants.js'});
var capabilityConstants = new AltiplanoCapsConstants();


function AltiplanoCapsUtilities() {
}

/**********************************************************************************************
 * Method to fetch capability values which we added in caps definition json
 *
 * @param deviceType - device type (such as LS-SX-CFAS-H, LS-MX-RANT-C...)
 * @param deviceRelease - device release/version (such as 21.6, 21.12...)
 * @param category - the category of the capabilities  (such as device, board, port...)
 * @param capability - the capability names which we defined in caps definition json
 * @param context - the context names which we defined in caps definition json
 * @param defaultValue - the default value which we want to assign for the input capability name if there is no value defined for this cap in caps definition json. It can be a string or an array string or true/false
 * @returns the value returned from CapabilitySerivce. It can be true/false or a list of string value.
 * @example getCapabilityValue("LS-FX-FANT-F-FX4", "20.12.3", "board", "portType", "FGLT-B", "XGS") would return "GPON"
 */
AltiplanoCapsUtilities.prototype.getCapabilityValue = function (deviceType, deviceRelease, category, capability, context, defaultValue) {
    var cachedCapKey = capabilityConstants.CAPABILITIES + "_" + deviceType + "_" + deviceRelease;
    var isCapValueCachedInIntentScope = function (cachedCapKey, category, capability, context) {
        if (!apUtils.getContentFromIntentScope(cachedCapKey) || !apUtils.getContentFromIntentScope(cachedCapKey)[category] || !apUtils.getContentFromIntentScope(cachedCapKey)[category][context] || apUtils.getContentFromIntentScope(cachedCapKey)[category][context][capability] === undefined) {
            return false;
        }
        return true;
    };
    var addCapValueToCachedInIntentScope = function (cachedCapKey, category, capability, context, returnedValue) {
        if (IntentScope.isTemplateUsed() && IntentScope.getCurrentScope() != null) {
            var cachedCapValue = apUtils.getContentFromIntentScope(cachedCapKey);
            if (!cachedCapValue || cachedCapValue == null) {
                cachedCapValue = {};
                cachedCapValue[category] = {};
                cachedCapValue[category][context] = {};
            } else if (!cachedCapValue[category]) {
                cachedCapValue[category] = {};
                cachedCapValue[category][context] = {};
            } else if (!cachedCapValue[category][context]) {
                cachedCapValue[category][context] = {};
            }
            cachedCapValue[category][context][capability] = returnedValue;
            apUtils.storeContentInIntentScope(cachedCapKey, cachedCapValue);
        }
    };
    var convertValues = function (returnedValue) {
        var arrValue = [];
        if (!returnedValue || returnedValue == null) {
            return null;
        }
        returnedValue.forEach(function (item) {
            arrValue.push(item);
        });
        if (arrValue.length == 1) {
            if (arrValue[0]=== "true") return true;
            if (arrValue[0]=== "false") return false;
        }
        return arrValue;
    };
    if (!isCapValueCachedInIntentScope(cachedCapKey, category, capability, context)) {
        var contextStringWrapper = typeof context !== "string"? context+"": context;
        const EMPTY_STRING = "";
        var defaultValueStringWrapper;
        if (defaultValue === null) {
            defaultValueStringWrapper = EMPTY_STRING;
        } else {
            switch(typeof defaultValue) {
                case "undefined":
                    defaultValueStringWrapper = EMPTY_STRING;
                    break;
                case "string":
                    defaultValueStringWrapper = defaultValue;
                    break;
                case "boolean":
                    defaultValueStringWrapper = defaultValue + EMPTY_STRING;
                    break;
                case "object":
                    defaultValueStringWrapper = defaultValue.length>0?
                        defaultValue[0] + EMPTY_STRING:
                        EMPTY_STRING;
                    break;
            }
        }
        var returnedValue = capabilityService.getCapabilityValue(deviceType, deviceRelease, category, capability, contextStringWrapper, defaultValueStringWrapper);
        if(returnedValue.isEmpty() && (typeof defaultValue) == 'boolean') {
            var convertedValue = defaultValue;
        } else {
            convertedValue = convertValues(returnedValue);
        }
        addCapValueToCachedInIntentScope(cachedCapKey, category, capability, context, convertedValue);
        return convertedValue;
    }
    return apUtils.getContentFromIntentScope(cachedCapKey)[category][context][capability];
}

/**********************************************************************************************
 * Method to fetch capability context which we added in caps definition json
 *
 * @param deviceType - device type (such as LS-SX-CFAS-H, LS-MX-RANT-C...)
 * @param deviceRelease - device release/version (such as 21.6, 21.12...)
 * @param category - the category of the capabilities  (such as device, board, port...)
 * @param capability - the capability names which we defined in caps definition json (such as port-type, slot-type...)
 * @param capabilityValue - the value which we want to assign for the output capability context. It can be a string or an array string
 * @param operation - the operation which we want to fetch the correct data. It can be contains-or, contains-and, in...(operation -->expect array string, non-operation -> expect string)
 * @returns the value returned from CapabilitySerivce. It is a list of context value.
 * @example getCapabilityContext("LS-FX-FANT-F-FX4", "20.12.3", "board", "portType", "GPON") would return [ "FGLT-B", "FGLT-D" ]
 * @example getCapabilityContext("LS-MF-LMNT-B", "21.12", "port-mapping" ,"group", "in", "a", "b")
 * @example getCapabilityContext("LS-MF-LMNT-B", "21.12", "port-mapping" ,"group", "contains-or", "a", "b")
 * @example etCapabilityContext("LS-MF-LMNT-B", "21.12", "port-mapping" ,"group", "contains-and", "a", "b")
 * @example getCapabilityContext("iSAM-6.5", "6.5", "board", "portType", "contains-or", ['GPON', 'XGS']) would return [ "FGLT-B", "FGLT-D" ]
 */
AltiplanoCapsUtilities.prototype.getCapabilityContext = function (deviceType, deviceRelease, category, capability, capabilityValue, operation) {
    var requestContext = requestScope.get();
    var cachedCapKey = capabilityConstants.CAPABILITIES + "_" + capabilityConstants.CONTEXT + "_" + deviceType + "_" + deviceRelease;
    var isContextCachedInReqContext = function (requestContext, cachedCapKey, category, capability, capabilityValue) {
         if (!requestContext || requestContext == null || !requestContext.get(cachedCapKey) || !requestContext.get(cachedCapKey)[category] || !requestContext.get(cachedCapKey)[category][capability] || requestContext.get(cachedCapKey)[category][capability][capabilityValue] === undefined) {
            return false;
         }
         return true;
    };
    var addCapContextToCachedInReqContext = function (requestContext, cachedCapKey, category, capability, capabilityValue, returnedContext) {
        if (requestContext && requestContext != null) {
            var cachedCapValue = requestContext.get(cachedCapKey);
            if (!cachedCapValue || cachedCapValue == null) {
                cachedCapValue = {};
                cachedCapValue[category] = {};
                cachedCapValue[category][capability] = {};
            } else if (!cachedCapValue[category]) {
                cachedCapValue[category] = {};
                cachedCapValue[category][capability] = {};
            } else if (!cachedCapValue[category][capability]) {
                cachedCapValue[category][capability] = {};
            }
            cachedCapValue[category][capability][capabilityValue] = returnedContext;
            requestContext.put(cachedCapKey, cachedCapValue);
        }
    };
    var convertValues = function (returnedValue) {
        var arrValue = [];
        if (!returnedValue || returnedValue == null) {
            return null;
        }
        returnedValue.forEach(function (item) {
            arrValue.push(item);
        });
        if (arrValue.length == 1) {
            if (arrValue[0]=== "true") return true;
            if (arrValue[0]=== "false") return false;
        }
        return arrValue;
    };
    if (!isContextCachedInReqContext(requestContext, cachedCapKey, category, capability, capabilityValue)) {
        if (operation){
            var returnedValue = capabilityService.getCapabilityContext(deviceType, deviceRelease, category, capability, operation, capabilityValue);
        }
        else{
            var returnedValue = capabilityService.getCapabilityContext(deviceType, deviceRelease, category, capability, capabilityValue);
        }
        var convertedValue = convertValues(returnedValue);
        addCapContextToCachedInReqContext(requestContext, cachedCapKey, category, capability, capabilityValue, convertedValue);   
        return convertedValue;
    }
    return requestContext.get(cachedCapKey)[category][capability][capabilityValue];
}

/**********************************************************************************************
 * Method to fetch all the contexts under category in caps definition json
 *
 * @param deviceType - device type (such as LS-SX-CFAS-H, LS-MX-RANT-C...)
 * @param deviceRelease - device release/version (such as 21.6, 21.12...)
 * @param category - the category of the capabilities  (such as device, board, port...)
 * @returns the value returned from CapabilitySerivce. It is a list of all contexts.
 * @example getCapabilityContext("LS-FX-FANT-F-FX4", "20.12.3", "port-mapping") would return [ "nt-a:xfp:2","nt-a:xfp:3","nt-a:xfp:1"]
 */

AltiplanoCapsUtilities.prototype.getCapabilityCategory = function (deviceType, deviceRelease, category) {
    var requestContext = requestScope.get();
    var cachedCapKey = capabilityConstants.CAPABILITIES + "_" + capabilityConstants.CATEGORY + "_" + deviceType + "_" + deviceRelease;
    var isCategoryCachedInReqContext = function (requestContext, cachedCapKey, category) {
         if (!requestContext || requestContext == null || !requestContext.get(cachedCapKey) || !requestContext.get(cachedCapKey)[category]) {
            return false;
         }
         return true;
    };
    var addCapCategoryToCachedInReqContext = function (requestContext, cachedCapKey, category, returnedContext) {
        if (requestContext && requestContext != null) {
            var cachedCapValue = requestContext.get(cachedCapKey);
            if (!cachedCapValue || cachedCapValue == null) {
                cachedCapValue = {};
                cachedCapValue[category] = {};
            } else if (!cachedCapValue[category]) {
                cachedCapValue[category] = {};
            } 
            cachedCapValue[category] = returnedContext;
            requestContext.put(cachedCapKey, cachedCapValue);
        }
    };
    var convertValues = function (returnedValue) {
        var arrValue = [];
        if (!returnedValue || returnedValue == null) {
            return null;
        }
        returnedValue.forEach(function (item) {
            arrValue.push(item);
        });
        if (arrValue.length == 1) {
            if (arrValue[0]=== "true") return true;
            if (arrValue[0]=== "false") return false;
        }
        return arrValue;
    };
    if (!isCategoryCachedInReqContext(requestContext, cachedCapKey, category)) {
        var returnedValue = capabilityService.getCapabilityContext(deviceType, deviceRelease, category);
        var convertedValue = convertValues(returnedValue);
        addCapCategoryToCachedInReqContext(requestContext, cachedCapKey, category, convertedValue);
        return convertedValue;
    }
    return requestContext.get(cachedCapKey)[category];
}

/**
 * This method is used to check if profile manager is enabled
 * @param deviceTypeRelease - the type as known in MDS, like "iSAM.6.5" or "LS-FX-FANT-F-22.3" or something like that.
 * @param hwTypeRelease - the subtype. This would only make sense for ISAM where it could be "FX-I", "MX", etc... For NC/Y devices it would be "-" in CAPS context and no need in param.
 * @param managerType - the type of the manager to distinguish between AMS, ANV, NSP,...
 */
 AltiplanoCapsUtilities.prototype.checkIfProfileManagerIsEnabled = function (deviceTypeRelease, hwTypeRelease, managerType) {
    /*var deviceDetails = apCapUtils.splitToDeviceTypeAndRelease(deviceTypeRelease, managerType);
    var deviceType = deviceDetails.deviceType;
    var context = capabilityConstants.HYPHEN_CONTEXT;
    var deviceRelease = deviceDetails.release;
    if(managerType === intentConstants.MANAGER_TYPE_AMS){
        var hardwareDetails = apCapUtils.splitToHardwareTypeAndVersion(hwTypeRelease);
        deviceType = intentConstants.FAMILY_TYPE_ISAM;
        context = hardwareDetails.hwType;
        deviceRelease = hardwareDetails.release;
    }
    return apCapUtils.getCapabilityValue(deviceType, deviceRelease, capabilityConstants.DEVICE_CATEGORY, 
            capabilityConstants.IS_PROFILE_MANAGER_SUPPORTED, context, false);*/
    return true;
}

/**
 * This method is used to get Hardware type anf device version
 * @param deviceTypeRelease - deviceTypeRelease
 * @param managerType - managerType
 */
AltiplanoCapsUtilities.prototype.splitToDeviceTypeAndRelease = function (deviceTypeRelease, managerType) {
    var typeResult = {};
    if(deviceTypeRelease){
        if(managerType === intentConstants.MANAGER_TYPE_AMS){
            typeResult.deviceType = deviceTypeRelease.substring(0, deviceTypeRelease.indexOf(".")); //iSAM.6.5 to iSAM
            typeResult.release = deviceTypeRelease.substring(deviceTypeRelease.indexOf(".") + 1); // iSAM.6.5 to 6.5
        }else{
            typeResult.deviceType = deviceTypeRelease.substring(0, deviceTypeRelease.lastIndexOf("-"));
            typeResult.release = deviceTypeRelease.substring(deviceTypeRelease.lastIndexOf("-") + 1);
        }
    }
    return typeResult;
}

/**
 * This method is used to get Hardware type anf device version
 * @param nodeType - nodeType
 */
AltiplanoCapsUtilities.prototype.splitToHardwareTypeAndVersion = function (nodeType) {
    if(!nodeType){
        throw new RuntimeException("Device is not managed by Manager in MDS");
    }
    var typeResult = {};
    typeResult.hwType = nodeType.substring(0, nodeType.lastIndexOf("-"));
    typeResult.release = nodeType.substring(nodeType.lastIndexOf("-") + 1);
    return typeResult;
}

/**********************************************************************************************
 * Method to get the first value of the list result from the getCapabilityValue method
*/
AltiplanoCapsUtilities.prototype.getFirstValueFromCapResult = function (capResult) {
    if (capResult && capResult != null && capResult[0]) {
        return capResult[0];
    }
    return capResult;
}

/**********************************************************************************************
 * Method to fetch capability values from the primary board context - BOARD category
 *
 * @param deviceType - device type (such as LS-SX-CFAS-H, LS-MX-RANT-C...)
 * @param deviceRelease - device release/version (such as 21.6, 21.12...)
 * @example getCapValueFromPrimaryBoard("LS-MX-RANT-C", "21.12") would return [ "rant-c"]
 */

AltiplanoCapsUtilities.prototype.getPrimaryBoardName = function (deviceType, deviceRelease) {
    var primaryBoardValue = this.getCapabilityValue(deviceType, deviceRelease, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.SUPPORTED_NT_BOARDS, capabilityConstants.HYPHEN_CONTEXT, null);
    var primaryBoardValue = this.getFirstValueFromCapResult(primaryBoardValue);
    return primaryBoardValue;
}

/**********************************************************************************************
 * Method to check whether capabilities exists or not
 *
 * @param deviceType - device type (such as LS-SX-CFAS-H, LS-MX-RANT-C...)
 * @param deviceRelease - device release/version (such as 21.6, 21.12...)
 * @param capability - the capability names which we defined in caps definition json
 * @param defaultValue - the default value which we want to assign for the input capability name if there is no value defined for this cap in caps definition json. It can be a string or an array string or true/false
 * @example isValueInCapability("LS-FX-FANT-F-FX4", "20.12.3", "port-mapping") would return [ "nt-a:xfp:2","nt-a:xfp:3","nt-a:xfp:1"]
 */

AltiplanoCapsUtilities.prototype.isValueInCapability = function (deviceType, deviceRelease, category, capability, context, value) {
    return capabilityService.isValueInCapability(deviceType, deviceRelease, category, capability, context, value);
}
