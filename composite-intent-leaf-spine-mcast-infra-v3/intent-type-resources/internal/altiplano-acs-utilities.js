/**
* (c) 2023 Nokia. All Rights Reserved.
*
* INTERNAL - DO NOT COPY / EDIT
**/
load({script: resourceProvider.getResource('internal/java-imports.js'), name: 'java-imports.js'})

function AltiplanoAcsUtilities() {    
}

/**
 * Retrieve deviceInfo in ACS Manager by serialNumber
 * @param {String} serialNumber, ONT's serial number
 * @returns {Object} contains attributes: deviceId (combination of OUI|ProductClass|DUID), familyTypeRelease, manufacturer, modelName, etc.
 */
AltiplanoAcsUtilities.prototype.getDeviceInfoBySerialNumber = function (serialNumber) {
    var allACSManager = mds.getAllManagersOfType(intentConstants.MANAGER_TYPE_NOKIA_ACS);
    var acsManagerInfo, deviceInfo;
    if (allACSManager != null && !allACSManager.isEmpty()) {
        acsManagerInfo = mds.getManagerByName(allACSManager[0])
    }
    else {
        throw new RuntimeException("No Managers available with Manager Type NOKIA_ACS");
    }

    if (acsManagerInfo && acsManagerInfo.getConnectivityState().toString() === intentConstants.MANAGER_CONNECTED_STATE) {
        restClient.setIp(acsManagerInfo.getIp());
        restClient.setPort(acsManagerInfo.getPort());
        restClient.setProtocol(acsManagerInfo.getProtocol().name());
        restClient.get(deviceUrl, contentType, function (exception, httpStatus, res) {
            if (exception) {
                logger.debug("Couldn't send API to get all devices in ACS Manager with error {}", exception);
                throw exception;
            }
            if (httpStatus != 200) {
                logger.error("Unable to get all devices in ACS Manager with status - {} Respone : {}", httpStatus, res);
            } else {
                var jsonRes = JSON.parse(res);
                for (var i = 0; i < jsonRes.length; i++) {
                    if (jsonRes[i]["deviceId"].startsWith(serialNumber + "|")) {
                        deviceInfo = jsonRes[i];
                        break;
                    }
                }
            }
        });
    }
    else {
        throw new RuntimeException("Manager is not in a connected state");
    }
    return deviceInfo;
}

/**
 * This function is used to fetch detected serial number of an ONT from ES. The detected serial number will be available in state only after a successful sync.
 * @param ontName - ONT name
 * @returns detected serial number from state data
 */
AltiplanoAcsUtilities.prototype.getDetectedSerialNumberFromES = function (ontName) {
    let serialNumber;
    let resourceFile = resourceProvider.getResource(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "resources/esQueryGetDetectedSerialNumber.json.ftl");
    let templateArgs = {
        "intentType": intentConstants.INTENT_TYPE_ONT,
        "ontName": ontName
    }
    let queryString = utilityService.processTemplate(resourceFile, templateArgs);
    let detectedSerialNumber = JSON.parse(esQueryService.queryESIntents(queryString));
    if (apUtils.isResponseContainsData(detectedSerialNumber)) {
        detectedSerialNumber.hits.hits.forEach(function (searchResult) {
            if (searchResult["_source"] && searchResult["_source"]["state"] && searchResult["_source"]["state"]["detected-serial-number"]) {
                serialNumber = searchResult["_source"]["state"]["detected-serial-number"];
            }
        });
    }
    return serialNumber;
};

/**
 * This function is to display a meaningful error message to the user
 * @param {*} response - response from rest operation
 * @param {*} deviceName
 */
function handleServerError(response, deviceName) {
    var errorMessage;
    try {
        var json = JSON.parse(response);
    } catch (e) {
        throw new RuntimeException(response);
    }
    errorMessage = json["faultString"];
    logger.error("Response Failed : " + JSON.stringify(errorMessage) + " for device: " + (deviceName));
    if (errorMessage && errorMessage.contains("faultCode")) {
        var faultStringContent = JSON.parse(errorMessage);
        throw new RuntimeException(getFaultReason(faultStringContent) + ": " + deviceName);
    } else {
        throw new RuntimeException(errorMessage);
    }
}

function getFaultReason(faultResponse) {
    var faultReason = "";
    switch (faultResponse.faultCode) {
        case "internal.error":
            faultReason = "Internal ACS server error";
            break;
        case "operation.timeout.exception":
            faultReason = "Operation timeout on ACS server";
            break;
        case "system.exception":
            faultReason = "System exception on ACS server";
            break;
        case "device.operation.exceptions":
            faultReason = "Device operation caused exception on ACS server";
            break;
        case "device.could.not.be.found":
        case "device.not.found.or.deleted":
            faultReason = "Device could not be found";
            break;
        case "device.already.exists":
            faultReason = "The Device already exists in ACS";
            break;
        default:
            if (faultResponse.faultCode) {
                faultReason = "Remote error " + faultResponse.faultCode;
            } else if (faultResponse.details) {
                faultReason = faultResponse.details;
            } else if (faultResponse.faultString) {
                faultReason = faultResponse.faultString;
            } else if (faultResponse.faultKey) {
                faultReason = faultResponse.faultKey;
            }
    }
    if (faultReason == "") {
        if (faultResponse.details) {
            faultReason = faultResponse.details;
        } else if (faultResponse.faultString) {
            faultReason = faultResponse.faultString;
        }
    }
    return faultReason;
}

/**
 * Delete device in HDM using device Id
 * @param {String} deviceId, ONT's device Id
 * @returns Nothing
 */
AltiplanoAcsUtilities.prototype.deleteDeviceFromHDM = function (deviceId) {
    let allACSManager = mds.getAllManagersOfType(intentConstants.MANAGER_TYPE_NOKIA_ACS);
    let acsManagerInfo;
    if (allACSManager != null && !allACSManager.isEmpty()) {
        acsManagerInfo = mds.getManagerByName(allACSManager[0]);
    }
    else {
        throw new RuntimeException("No Managers available with Manager Type NOKIA_ACS");
    }
    if (acsManagerInfo && acsManagerInfo.getConnectivityState().toString() === intentConstants.MANAGER_CONNECTED_STATE) {
        restClient.setIp(acsManagerInfo.getIp());
        restClient.setPort(acsManagerInfo.getPort());
        restClient.setProtocol(acsManagerInfo.getProtocol().name());
        let url = deviceUrl + deviceId;
        let res = {};
        restClient.delete(url, contentType, function (exception, httpStatus, response) {
            if (exception) {
                logger.error("Couldn't connect to Manager of Device: " + (deviceId), exception);
                throw exception;
            }
            if (httpStatus < 200 || httpStatus > 299) {
                logger.error("Request Failed with status code: " + httpStatus + " and response: " + response + " for the device: " + (deviceId));
            }
            res = response;
            logger.debug("Device with deviceId " + deviceId + " is deleted succesfully");

        });
        if (res.contains("faultString")) {
            handleServerError(res, deviceId);   
        }
    }
    else {
        throw new RuntimeException("Manager is not in a connected state");
    }
}
