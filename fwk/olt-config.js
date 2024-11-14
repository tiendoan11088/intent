/**
 * (c) 2020 Nokia. All Rights Reserved.
 *
 **/
(function (deviceInfo, input) {
    var requestContext = requestScope.get();
    var internalResourcePrefix = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR +
        intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR;
    var inputSchema;
    if (requestContext && requestContext.get("inputSchema")) {
      inputSchema = requestContext.get("inputSchema");
    } else {
      inputSchema = JSON.parse(resourceProvider.getResource(internalResourcePrefix + "InputSchema.json"));
      requestContext.put("inputSchema", inputSchema);
    }
    var target = requestContext.get("target");
    var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF, target);
    var profilesJsonMap = apUtils.getParsedProfileDetailsFromProfMgr(deviceInfo.name,deviceInfo.familyTypeRelease,intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF,Arrays.asList("Lightspan","LS-Fiber","LS-Operator","LS-MF","LS-MF-IHUB","All","all"),intentVersion);
    var stageName = "nav-" + intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF;
    return {
      stageName: stageName,
      supportedDeviceTypes: ["LS-MF-LMNT-A-21.3", "LS-MF-LWLT-C-21.3", "LS-MF-LMNT-A-21.6", "LS-MF-LWLT-C-21.6", "LS-MF-LWLT-C-21.9", "LS-MF-LMNT-A-21.9", intentConstants.FAMILY_TYPE_LS_MF_LGLT_D.concat("-21.9"),
      intentConstants.FAMILY_TYPE_LS_MF_LGLT_D.concat("-21.12"), intentConstants.FAMILY_TYPE_LS_MF_LWLT_C.concat("-21.12"), intentConstants.FAMILY_TYPE_LS_MF_LMNT_A.concat("-21.12"),intentConstants.FAMILY_TYPE_LS_MF_LMNT_B.concat("-21.12"),
      intentConstants.FAMILY_TYPE_LS_MF_LANT_A.concat("-22.3"),intentConstants.FAMILY_TYPE_LS_MF_LGLT_D.concat("-22.3"), intentConstants.FAMILY_TYPE_LS_MF_LWLT_C.concat("-22.3"), intentConstants.FAMILY_TYPE_LS_MF_LMNT_A.concat("-22.3"),intentConstants.FAMILY_TYPE_LS_MF_LMNT_B.concat("-22.3"),
      intentConstants.FAMILY_TYPE_LS_MF_LANT_A.concat("-22.6"),intentConstants.FAMILY_TYPE_LS_MF_LGLT_D.concat("-22.6"), intentConstants.FAMILY_TYPE_LS_MF_LWLT_C.concat("-22.6"), intentConstants.FAMILY_TYPE_LS_MF_LMNT_A.concat("-22.6"),intentConstants.FAMILY_TYPE_LS_MF_LMNT_B.concat("-22.6"),
      intentConstants.FAMILY_TYPE_LS_MF_LMNT_A_MF2_LMXR_B.concat("-24.6"), intentConstants.FAMILY_TYPE_LS_MF_LMNT_B_MF2_LMXR_B.concat("-24.6"),intentConstants.FAMILY_TYPE_LS_MF_LBNT_A_MF14_LMFS_A.concat("-24.9")],
      aggregateEditConfigs: "manager",
      getDeviceIds: function (target, intentConfigXml, intentConfigJson, topology) {
        var devices = {};
        var currentDevices = requestContext.get("currentDevices");
        if (currentDevices.indexOf(deviceInfo.name) < 0){
            //Device is removed, so we skip this device.
            return devices;
        }
        devices[deviceInfo.name] = {
          "value": deviceInfo.name,
          "managerName": deviceInfo.managerName
        };
        logger.debug("getDeviceIds {}", JSON.stringify(devices));
        return devices;
      },
      resourceFile: function (intentConfigJson, deviceId, stepName) {
        if (deviceInfo.familyType.contains(intentConstants.FAMILY_TYPE_LS_MF_LMNT_A) || deviceInfo.familyType.contains(intentConstants.FAMILY_TYPE_LS_MF_LANT_A) || deviceInfo.familyType.contains(intentConstants.FAMILY_TYPE_LS_MF_LMNT_B) || deviceInfo.familyType.contains(intentConstants.FAMILY_TYPE_LS_MF_LBNT_A_MF14_LMFS_A)) {
          return internalResourcePrefix + "ls-mf-nt.xml.ftl";
        } else if (deviceInfo.familyType.contains(intentConstants.FAMILY_TYPE_LS_MF_LWLT_C) || deviceInfo.familyType.contains(intentConstants.FAMILY_TYPE_LS_MF_LGLT_D)) {
          return internalResourcePrefix + "ls-mf-board.xml.ftl";
          } else {
          throw new RuntimeException("No matching resource file found for device " + deviceId);
        }
      },
      trackedArgs: apUtils.getTrackedArgs(inputSchema, ["ntp-server-profiles"], ["ntp-servers", "ipfix", "iburst","minpoll", "maxpoll", 
        "ipfixExporterName", "eOnu_classifiers", "eOnu_policies", "eOnu_qos-policy-profiles",
        "eOnu_tc-id-2-queue-id-mapping-profile", "transceiver-tca-profiles", "transceiver-link-tca-profiles",
        "ber-tca-profiles", "ipfixCollectorAuthenticationMethod", "eONUBroadcastGemPortIdAllocationObject", "eONUTemplateMulticastIdObject",
        "ptp-g8275dot1-port-profiles", "ptp-ccsa-port-profiles","frequency-sync-out-profiles", "phase-sync-profiles", "tcaProfileForOnuTemplates","authentication-keys","speed-monitoring-interval", "onuUsedCfmProfiles","radius-servers",
        "radius-policy", "report-onu-parameters", "dying-gasp-threshold","report-mac-address","suppress-mac-addr-separator","radius-domain","radius-detail","ca-cert-name","server-cert-name","data-path-integrity-alarm-threshold", "clear-onu-los-alarm-on-ct-lost", "suppress-ct-los-alarm-when-no-v-ani-configured",
        "tcp-keep-alives",
        "timezone-name",
        "poeDetails",
        "tr069Details","eonu_TrafficClassProfiles", "eonu_PtpCcsaProfiles", "eonu_PtpDotProfiles","mocaDetails",
        "rfVideoAniDetails", "rfVideoUniDetails",
        "ipfixCollecterPort",
        "onuUsedQosProfiles","secondarySIPServer","mediaForwardersConfig","ipConfigProfiles",
        "eth-frame-error-profiles", "eth-phy-layer-err-profiles", "ethFrameErrorTcaProfileDetailsUS", "ethFrameErrorTcaProfileDetailsDS", "ethPhyErrorTcaProfileDetails",
        "fec-err-profiles", "tc-layer-err-profiles", "downstream-mic-err-profiles", "fecErrProfile", "tcLayerErrProfile", "dwnMicErrProfile",
        "system-load-profiles", "memory-usage-profiles", "rtp-failure-profiles", "call-control-failure-profiles", "gem-port-err-profiles",
        "callControlFailureProfileDetails", "rtpFailureProfileDetails", "gemPortErrProfileDetails", "username", "password",
        "gem-frame-err-tca-profiles", "gemFrameErrTcaProfileFromOnuTemplate", "tls-server-cipher-suite", "tls-server-version",
        "tls-client-version","tls-client-cipher-suite",
        "eth-frame-error-extended-tca-profiles", "ethFrameErrorExtendedTcaProfileFromUniConfig", "pmCounterSizeFromUniConfig", "syslog-collector-profile", "mac-address-string-to-hex-conversion","OAM-ext-auth-enabled",
        "sip-agent-profile", "onu-template", "powerShedOverrides", "powerShedRef", "power-shedding-profiles",
        "radius-server-policy-name", "auth-server-first", "auth-server-second", "nas-id", "nas-ip-address", "radius-server-policy", "cli-session-policy","shelf-radius-server-profile", "radiusOperatorUsers","cli-system-config","profilesRestrictedToOnlyUsed","ethernetMaxFrameSizeConfig", "collectorNames", "mcastVPNs", "bac-entry", "licenseServerIPAddress"
      ]),
      skipAttributeInXtraInfo: ["onuTemplateString", "templateArgsWithDiffOnLT"],
  
      getTemplateArguments: function (baseArgs, topology) {
        var fwk = requestContext.get("xFWK");
        var deviceID = baseArgs["deviceID"];
        var topoKey = this.stageName + "_" + deviceID + "_ARGS";
        var keyName = deviceID + "_" + "computedBaseArgs";
        var deviceName = deviceInfo.name;
        var actualType = apUtils.getNodeTypefromEsAndMds(deviceID);
        requestContext.put("nodeType", actualType);      
        // Find whether the deviceId is shelf or LTBoard
        var deviceType = getMfDeviceType(actualType);
        // getting profiles here if profile manager is enabled
        var bestType  = apUtils.getBestKnownTypeByDeviceName(baseArgs["deviceID"], this.supportedDeviceTypes);
        var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(deviceInfo.familyTypeRelease);
        var managerName = deviceInfo.managerName;
        if (!requestContext.get(keyName)) {
          var intentConfigJson = requestContext.get("intentConfigJson");      
          baseArgs["networkState"] = baseArgs["networkState"].toString();
          var isVoipConfigOnVeipSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_VOIP_CONFIG_ON_VEIP_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
          if (isVoipConfigOnVeipSupported) {
            baseArgs["isVoipConfigOnVeipSupported"] = true
          }
          // Load resources
          var deviceVersion = apUtils.getLsDeviceInterfaceVersion(null, bestType);
          if (deviceType === "LT" || deviceType === "shelfNE") {
            var ipfix = loadIpfixResourceAndUpdateIpfixDetailsFromMds(baseArgs, actualType);
            // IPFIX details
            if (ipfix) {
              var ipfixDetails  =  ipfix["cache"];
              var ipfixExportingProcess = ipfix["exportingProcess"];
              updateIpfixDetails(ipfixDetails, inputSchema, baseArgs, ipfixExportingProcess, fwk, topology, deviceID,bestType);
              if (deviceType === "shelfNE") {
                var hardwareType = deviceTypeAndRelease.hwType;
                var shelfVariant = getShelfVariantFromHardwareType(hardwareType, true);
                var isEnergyMeteringSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_ENERGY_METERING_SUPPOTED, shelfVariant, false);
                if (!isEnergyMeteringSupported) {
                  shelfVariant = getShelfVariantFromHardwareType(hardwareType, false);
                  isEnergyMeteringSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_ENERGY_METERING_SUPPOTED, shelfVariant, false);
                }
                if (isEnergyMeteringSupported && baseArgs["networkState"] !== "delete") {
                  validateEnergyMeasurementIpfixDetails(ipfixDetails, deviceID);
                }
              }
            }
            if(deviceType === "LT") {
              var deviceLTtypeRelease = apUtils.splitToHardwareTypeAndVersion(deviceInfo.familyTypeRelease);
              var ltBoardName = deviceInfo.familyType.replace("LS-MF-","");
              var qosAndL2Profiles = loadLtConfigResources(deviceLTtypeRelease, ltBoardName);
              var qosProfiles = qosAndL2Profiles.qosProfiles;
              var l2Profiles = qosAndL2Profiles.l2Profiles;
              var ipv6AntiSpoofPrefixMode = (profilesJsonMap["system"] && profilesJsonMap["system"][0] && profilesJsonMap["system"][0]["ipv6-antispoofing-system"]) ?  profilesJsonMap["system"][0]["ipv6-antispoofing-system"] : null;
              baseArgs["isTR385ModelSupported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_TR_385_2_0_MODEL_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
              baseArgs["isUniLoopDectionSupported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_UNI_LOOP_DETECTION_SUPPORTED, ltBoardName, false);
              baseArgs["isTR383ModelSupported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_TR_383_MODEL_SUPPORTED, ltBoardName, false);
              baseArgs["isTcaLinkProfileSupportedOnOnt"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_TCA_TRANSCEIVER_LINK_PROFILE_SUPPORTED_ON_ONT, ltBoardName, false);
              baseArgs["isPoeSupported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_POE_SUPPORTED, ltBoardName, false);
              requestContext.put("isPoeSupported", baseArgs["isPoeSupported"]);
              baseArgs["isMocaSupported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_MOCA_SUPPORTED, ltBoardName, false);
              requestContext.put("isMocaSupported", baseArgs["isMocaSupported"]);
              baseArgs["isRfVideoSupported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_RF_VIDEO_SUPPORTED, ltBoardName, false);
              requestContext.put("isRfVideoSupported", baseArgs["isRfVideoSupported"]);
              baseArgs["isTr069Supported"] =  apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_TR069_SUPPORTED, ltBoardName, false);
              requestContext.put("isTr069Supported", baseArgs["isTr069Supported"]);           
              var isRandomizeDataCollection = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_IPFIX_RANDOMIZE_SUPPORTED, ltBoardName, null);
              baseArgs["isRandomizeDataCollection"] = (typeof isRandomizeDataCollection == 'boolean') ? isRandomizeDataCollection : null;
              baseArgs["isIeee802Dot1xSupported"]= apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_IEEE_802_DOT1X_SUPPORTED, ltBoardName, "false");
              baseArgs["isClearDhcpIpsOnAdmindownSupported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_CLEAR_DHCP_IPS_ON_ADMINDOWN_SUPPORTED, ltBoardName, false);
              baseArgs["isClearDhcpLearnedIpv6AddressesOnAdmindownSupported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_CLEAR_DHCP_LEARNED_IPV6_ADDRESSES_ON_ADMINDOWN_SUPPORTED, ltBoardName, false);
                 baseArgs["isIcmpv6Supported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_ICMPV6_SUPPORTED, ltBoardName, false);
              baseArgs["isTcaTransceiverLinkProfileSupported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_TCA_TRANSCEIVER_LINK_PROFILE_SUPPORTED, ltBoardName, false);
              baseArgs["isSimplifiedQosModelSupported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_SIMPLIFIED_QOS_MODEL_SUPPORTED, ltBoardName, false);
              var ltBoardPortType = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, ltBoardName, "GPON");
              requestContext.put("ltBoardPortType", ltBoardPortType);
              if (ltBoardPortType && ltBoardPortType.indexOf(intentConstants.XPON_TYPE_25G.toUpperCase()) !== -1) {
                baseArgs["is25gSupported"] = "true";
              }
              baseArgs["is25gDualRateSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, "is-25G-dual-rate-supported", ltBoardName, false);
              baseArgs["isUPDualPbitMarkingSupported"] = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType,deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_UP_DUAL_PBIT_MARKING_SUPPORTED, ltBoardName, false);
              baseArgs["isPmTcaSupportedOnOntSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_PM_TCA_SUPPORTED_ON_ONT_SUPPORTED, ltBoardName, false);
              
              baseArgs["isExtendPmTcaSupportedOnOntSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_EXTEND_PM_TCA_SUPPORTED_ON_ONT_SUPPORTED, ltBoardName, false);
              baseArgs["isAutoDetectCardNoSupported"]= apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_AUTO_DETECT_CARDNO_SUPPORTED, ltBoardName, false);
              requestContext.put("isAutoDetectCardNoSupported", baseArgs["isAutoDetectCardNoSupported"]);
              baseArgs["isOnuPowerSheddingSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_ONU_POWER_SHEDDING_SUPPORTED, ltBoardName, false);
              requestContext.put("isOnuPowerSheddingSupported", baseArgs["isOnuPowerSheddingSupported"]);
              baseArgs["isMulticastNetworkInterfaceForUnmatchedReportsSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_MULTICAST_NETWORK_INTERFACE_FOR_UNMATCHED_REPORTS_SUPPORTED, ltBoardName, false);
              baseArgs["isOnuDscpConfigSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_ONU_DSCP_CONFIG_SUPPORTED, ltBoardName, false);
              baseArgs["isLicenseServerSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_LICENSE_SERVER_SUPPORTED, ltBoardName, false);
              baseArgs["isConfigureOntMaxFrameSizeSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_CONFIGURE_ONT_MAX_FRAME_SIZE_SUPPORTED, ltBoardName, false);
              baseArgs["is10gRj45SfpOf25gOnuSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_10G_RJ45_SFP_OF_25G_ONU_SUPPORTED, ltBoardName, false);
              baseArgs["isOnuTemplateModificationSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_ONU_TEMPLATE_MODIFICATION_SUPPORTED, ltBoardName, false);
              baseArgs["isOnuSipSupplSvcsProfileConfigSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_ONU_SIP_SUPPL_SVCS_PROFILE_CONFIG_SUPPORTED, ltBoardName, false);
              baseArgs["isOnuChassisAdminStateLockSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_ONU_CHASSIS_ADMIN_STATE_LOCK_SUPPORTED, deviceTypeAndRelease.hwType.substring(6), false);
  
              //Setting values if license server supported
              if (baseArgs["isLicenseServerSupported"]) {
                  //Getting connection management
                  if (profilesJsonMap["connection-management"] && profilesJsonMap["connection-management"].length > 0) {
                      var connectionManagement = profilesJsonMap["connection-management"][0]
                  }
                  baseArgs["isLicensingCdeFeatureSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_LICENSE_CDE_FEATURE_SUPPORTED, ltBoardName, false);
                  //Seting values if licensing cde feature supported
                  if (baseArgs["isLicensingCdeFeatureSupported"] && connectionManagement) {
                      baseArgs["cde-licensing-feature-codes"] = connectionManagement["cde-licensing-feature-codes"];
                  }
  
                  var licenseServerDetails = apUtils.getLicenseServerDetailsFromMds(deviceName);
                  //Set priority to get license server detail in MDS first
                  if (licenseServerDetails && licenseServerDetails["licenseServerIP"] && licenseServerDetails["licenseServerPort"]) {
                      baseArgs["licenseServerIPAddress"] = licenseServerDetails["licenseServerIP"]
                      baseArgs["licenseServerPort"] = licenseServerDetails["licenseServerPort"]
                  } else if (connectionManagement && connectionManagement["license-server-configuration"] && connectionManagement["license-server-configuration"]["ip-address"] && connectionManagement["license-server-configuration"]["port"]) {
                      //getting license server from connection management profile
                      baseArgs["licenseServerIPAddress"] = connectionManagement["license-server-configuration"]["ip-address"];
                      baseArgs["licenseServerPort"] = connectionManagement["license-server-configuration"]["port"];
                  }
                  baseArgs["licenseServerPinnedCertificatesName"] = intentConstants.LICENSE_SERVER_PINNED_CERTIFICATES_NAME;
                  baseArgs["licenseServerPinnedCertificateName"] = intentConstants.LICENSE_SERVER_PINNED_CERTIFICATE_NAME;
                  baseArgs["licenseServerEncodedCertificate"] = intentConstants.BASE64_ENCODED_AUTO_INSERT;
              }
              if (profilesJsonMap["speed-profile"] && profilesJsonMap["user-service-profile"] && profilesJsonMap["qos-policy-profiles"] && profilesJsonMap["policies"] && profilesJsonMap["classifiers"]) {
                  // prepare new internal qos-policy-profile to build
                  var listQosRebuild = computeNewQosPolicyProfile();
                  // create & associate internal qos-policy-profile
                  if(listQosRebuild && listQosRebuild.length > 0){
                    requestContext.put("internal-qos-profile",listQosRebuild);
                    for(var qosRebuildIndex in listQosRebuild){
                      var checkResult = checkMisMatchQosProfile(listQosRebuild[qosRebuildIndex]);
                      var newQosPolicyProfile = checkResult["qosPolicyComputed"];
                      if(newQosPolicyProfile && (newQosPolicyProfile["policy-list-removed"] || newQosPolicyProfile["policy-list-added"])) {
                          if (newQosPolicyProfile["name"]) {
                            if (countIntentL2UserUsedProfile(newQosPolicyProfile["name"], profileConstants.QOS_POLICY_PROFILES.profileType, profileConstants.QOS_POLICY_PROFILES.subType) > 0) {
                              throw new RuntimeException("New Qos Policy mismatch with exist profile: " + newQosPolicyProfile["name"]);
                            }
                          }
                      }
                      var resourceFile = internalResourcePrefix + "createQosPolicyProfile.xml.ftl";
                      if(newQosPolicyProfile && newQosPolicyProfile["name"] && newQosPolicyProfile["policy-list"]){
                        apUtils.createInternalProfile(resourceFile, profileConstants.QOS_POLICY_PROFILES.profileType, profileConstants.QOS_POLICY_PROFILES.subType, newQosPolicyProfile["name"], newQosPolicyProfile["baseRelease"], newQosPolicyProfile)
                        apUtils.associateProfile(profileConstants.QOS_POLICY_PROFILES.profileType, profileConstants.QOS_POLICY_PROFILES.subType, newQosPolicyProfile["name"], null, intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF, intentVersion)
                        if(qosProfiles && qosProfiles["qos-policy-profiles"]){
                          qosProfiles["qos-policy-profiles"].push(newQosPolicyProfile);
                        }
                      }
                    }
                  }
                }
            }
  
            //Inventory Onchange supported
            baseArgs["isOnChangeIpfixCacheSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_ON_CHANGE_IPFIX_CACHE_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            baseArgs["isInventoryOnchangeSupported"] = apUtils.isInventoryOnchangeEnvEnabled();
  
            var isClockMgmtSupportedForNT = requestContext.get("isClockMgmtSupportedForNT");
            if(deviceType === "shelfNE" && isClockMgmtSupportedForNT) {
              var isClockMgmtSupported = true;
            } else if (deviceType === "LT" && isClockMgmtSupportedForNT) {
              var deviceLTtypeRelease = apUtils.splitToHardwareTypeAndVersion(deviceInfo.familyTypeRelease);
              // Remove the prefix "LS-MF-" (Length is 6), from familyType to find the Board type (LWLT-C, LGLT-D, etc)
              isClockMgmtSupported = apCapUtils.getCapabilityValue(deviceLTtypeRelease.hwType, deviceLTtypeRelease.release, capabilityConstants.BOARD_CATEGORY,
                  capabilityConstants.IS_CLOCK_MGMT_SUPPORTED, deviceInfo.familyType.substring(6), false);
            }
            if(isClockMgmtSupported) {
              baseArgs["isClockMgmtSupported"] = "true";
              var clockJson={};
              clockJson["ntr-region"] = profilesJsonMap["ntr-region"][0]["ntr-region"];
              clockJson["frequency-sync-in-profiles"] = profilesJsonMap["frequency-sync-in-profiles"];
              clockJson["frequency-sync-out-profiles"] = profilesJsonMap["frequency-sync-out-profiles"];
              clockJson["phase-sync-profiles"] = profilesJsonMap["phase-sync-profiles"];
              clockJson["ptp-g8275dot1-port-profiles"] = profilesJsonMap["ptp-g8275dot1-port-profiles"];
              clockJson["ptp-ccsa-port-profiles"] = profilesJsonMap["ptp-ccsa-port-profiles"];
              if (deviceType === "shelfNE" && clockJson && apUtils.compareVersion(actualType.substring(actualType.lastIndexOf("-") + 1), "21.12") >= 0) {
                validateNtrRegion(baseArgs, clockJson, this.stageName, topology);
              }
              fwk.convertObjectToNetconfFwkFormat(clockJson, inputSchema["clockSchema"], baseArgs);
            }
            var hwTypeNRelease = apUtils.splitToHardwareTypeAndVersion(deviceInfo.familyTypeRelease);   
            var isTCPKASupported = apCapUtils.getCapabilityValue(hwTypeNRelease.hwType, hwTypeNRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_TCP_KA_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            var isTimeZoneNameSupported  = apCapUtils.getCapabilityValue(hwTypeNRelease.hwType, hwTypeNRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_TIME_ZONE_NAME_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            baseArgs["isTCPKASupported"] = isTCPKASupported;
            baseArgs["isCacheHardwareClassFilterSupported"] = apCapUtils.getCapabilityValue(hwTypeNRelease.hwType, hwTypeNRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_CACHE_HARDWARE_CLASS_FILTER_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
  
            if (isTCPKASupported || isTimeZoneNameSupported) {
              var shelfName;
              if (deviceType == "shelfNE") {
                shelfName = deviceName;
              }
              else {
                shelfName = deviceName.substring(0, deviceName.lastIndexOf(intentConstants.DEVICE_SEPARATOR));
              }
              var deviceMfIntent = ibnService.getIntent(intentConstants.INTENT_TYPE_DEVICE_MF, shelfName);
              if (deviceMfIntent) {
                var deviceMfIntentConfig = apUtils.convertIntentConfigXmlToJson(deviceMfIntent.getIntentConfig());
                if (deviceMfIntentConfig && deviceMfIntentConfig["duid"] && deviceMfIntentConfig["duid"] !== "") {
                  baseArgs["callHome"] = "true";
                  var templateArgs = { deviceID: deviceName };
                  var netConfClientObj = apUtils.getInterfaceParams(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR + "getNetconfClient.xml.ftl", templateArgs, "ncs:netconf-server/ncs:call-home/ncs:netconf-client/ncs:name");
                  if (netConfClientObj && Object.keys(netConfClientObj) && Object.keys(netConfClientObj)[0]) {
                    baseArgs["netconfClient"] = Object.keys(netConfClientObj)[0];
                  }
                  else {
                    baseArgs["netconfClient"] = managerName;
                  }
                  if(profilesJsonMap["authentication-profile"] && profilesJsonMap["authentication-profile"][0]){
                      baseArgs["tcp-keep-alives"] = profilesJsonMap["authentication-profile"][0]["tcp-keep-alives"];
                  }
                }
                if(profilesJsonMap["authentication-profile"] && profilesJsonMap["authentication-profile"][0]){
                    baseArgs["certificate-expiration"] = profilesJsonMap["authentication-profile"][0]["certificate-expiration"]
                }  
                if (baseArgs["certificate-expiration"] && baseArgs["certificate-expiration"]["notify-days"]) {
                    baseArgs["notify-days"] = baseArgs["certificate-expiration"]["notify-days"];
                }
                if (deviceMfIntentConfig && deviceMfIntentConfig["timezone-name"] && deviceMfIntentConfig["timezone-name"] !== ""){
                  baseArgs["timezone-name"] = deviceMfIntentConfig["timezone-name"];
                }
              }
            }
            isUsedProfileOAM(baseArgs,deviceName,deviceType, deviceInfo.familyTypeRelease);
  
            baseArgs["isTlsServerConfigurationSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_TLS_SERVER_CONFIGURATION_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            if (baseArgs["isTlsServerConfigurationSupported"] && profilesJsonMap["authentication-profile"] && profilesJsonMap["authentication-profile"][0]) {            
                var authProfileTlsServer = profilesJsonMap["authentication-profile"][0]["tls-server-configuration-profile-id"];
                if (authProfileTlsServer) {
                    for (var tlsConfIndex in profilesJsonMap["tls-configuration"]) {
                      
                        if (profilesJsonMap["tls-configuration"][tlsConfIndex]["name"] === authProfileTlsServer) {
                          
                            var tlsServerVersion = profilesJsonMap["tls-configuration"][tlsConfIndex]["tls-version"];
                            var tlsServerVersionMap = {};
                            if(tlsServerVersion){
                              for (var j in tlsServerVersion) {
                                  var tlsServerVersionName = tlsServerVersion[j];
                                  //creating tlsServerVersionMap object with the name as key needed for the trackedArgs
                                  tlsServerVersionMap[tlsServerVersionName] = { "name": tlsServerVersionName }
                              }
                            }    
                            baseArgs["tls-server-version"] = tlsServerVersionMap;
  
                            var tlsServerCipher = profilesJsonMap["tls-configuration"][tlsConfIndex]["cipher-suite"];
                            var tlsServerCipherMap = {};
                            if(tlsServerCipher) {
                              for (var j in tlsServerCipher) {
                                  var tlsServerCipherName = tlsServerCipher[j];
                                  //creating tlsServerCipherMap object with the name as key needed for the trackedArgs
                                  tlsServerCipherMap[tlsServerCipherName] = { "name": tlsServerCipherName }
                              }
                            }    
                            baseArgs["tls-server-cipher-suite"] = tlsServerCipherMap;
                        }
                    }
                }
            }
            
        baseArgs["isTlsClientConfigurationSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_TLS_CLIENT_CONFIGURATION_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            if (baseArgs["isTlsClientConfigurationSupported"] && profilesJsonMap["authentication-profile"] && profilesJsonMap["authentication-profile"][0]) {            
                var authProfileTlsClient = profilesJsonMap["authentication-profile"][0]["tls-client-configuration-profile-id"];
                if (authProfileTlsClient) {
                    for (var tlsConfIndex in profilesJsonMap["tls-configuration"]) {
                      
                        if (profilesJsonMap["tls-configuration"][tlsConfIndex]["name"] === authProfileTlsClient) {
                          
                            var tlsClientVersion = profilesJsonMap["tls-configuration"][tlsConfIndex]["tls-version"];
                            var tlsClientVersionMap = {};
                            if(tlsClientVersion){
                              for (var j in tlsClientVersion) {
                                  var tlsClientVersionName = tlsClientVersion[j];
                                  //creating tlsServerVersionMap object with the name as key needed for the trackedArgs
                                  tlsClientVersionMap[tlsClientVersionName] = { "name": tlsClientVersionName }
                              }
                            }    
                            baseArgs["tls-client-version"] = tlsClientVersionMap;
  
                            var tlsClientCipher = profilesJsonMap["tls-configuration"][tlsConfIndex]["cipher-suite"];
                            var tlsClientCipherMap = {};
                            if(tlsClientCipher) {
                              for (var j in tlsClientCipher) {
                                  var tlsClientCipherName = tlsClientCipher[j];
                                  //creating tlsServerCipherMap object with the name as key needed for the trackedArgs
                                  tlsClientCipherMap[tlsClientCipherName] = { "name": tlsClientCipherName }
                              }
                            }    
                            baseArgs["tls-client-cipher-suite"] = tlsClientCipherMap;
                        }
                    }
                }
            }
          }
          //Get ponType for LT device
          baseArgs["ponTypeForLT"] = apUtils.getPonTypeForDevices(actualType);
  
          //get resources from system.json
          if (actualType && actualType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LWLT_C)) {
              var systemConfig = {};
              if(profilesJsonMap){
                systemConfig = profilesJsonMap["system"][0];
                baseArgs["tca-in-ip-packet-discards-ipv4"] = systemConfig["ipv4-antispoofing-system"]["tca-in-ip-packet-discards"];
                baseArgs["tca-in-ip-packet-discards-ipv6"] = systemConfig["ipv6-antispoofing-system"]["tca-in-ip-packet-discards"];
              }
          }
          if( deviceVersion && apUtils.compareVersion(deviceVersion, "21.9") >= 0 && (deviceType === "shelfNE" || deviceType === "LT")){
            setIdleTimeoutForDirectConnection(baseArgs)
          }
          if (deviceType === "shelfNE") { //configure LS-FX shelf-ne
            //Get NTP Server
            var hwTypeNRelease = apUtils.splitToHardwareTypeAndVersion(deviceInfo.familyTypeRelease);
            baseArgs["isNtpAuthenticationSupported"] = apCapUtils.getCapabilityValue(hwTypeNRelease.hwType, hwTypeNRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_NTP_AUTHENTICATION_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            var ntpServerProfileName = baseArgs["ntp-server-profile"];
            if (ntpServerProfileName) {
              if(profilesJsonMap["ntp-server-profiles"]) {
                var ntpServerInput = {};
                ntpServerInput["ntp-server-profiles"] =  profilesJsonMap["ntp-server-profiles"];
                var ntpServerOp = {};
                fwk.convertObjectToNetconfFwkFormat(ntpServerInput, inputSchema["ntpSchema"], ntpServerOp);
                if(ntpServerOp["ntp-server-profiles"] && ntpServerOp["ntp-server-profiles"][ntpServerProfileName]){
                    if(ntpServerOp["ntp-server-profiles"][ntpServerProfileName]["iburst"]) {
                      baseArgs.iburst = ntpServerOp["ntp-server-profiles"][ntpServerProfileName]["iburst"];
                    } 
                    if(ntpServerOp["ntp-server-profiles"][ntpServerProfileName]["maxpoll"]) {
                      baseArgs.maxpoll = ntpServerOp["ntp-server-profiles"][ntpServerProfileName]["maxpoll"];
                    } 
                    if(ntpServerOp["ntp-server-profiles"][ntpServerProfileName]["minpoll"]) {
                      baseArgs.minpoll = ntpServerOp["ntp-server-profiles"][ntpServerProfileName]["minpoll"];
                    } 
                    if(ntpServerOp["ntp-server-profiles"][ntpServerProfileName]["ntp-servers"]) {
                      baseArgs["ntp-servers"] = ntpServerOp["ntp-server-profiles"][ntpServerProfileName]["ntp-servers"];
                    }
                    if (ntpServerOp["ntp-server-profiles"][ntpServerProfileName]["authentication-keys"]) {
                      baseArgs["authentication-keys"] = ntpServerOp["ntp-server-profiles"][ntpServerProfileName]["authentication-keys"];
                    }
                  }
                }
            }
            var isRandomizeDataCollection = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_IPFIX_RANDOMIZE_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, null);
            baseArgs["isRandomizeDataCollection"] = (typeof isRandomizeDataCollection == 'boolean') ? isRandomizeDataCollection : null;
            var boardName = deviceInfo.familyType.substring(6,12);
            baseArgs["isClockBitsInterfaceSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_CLOCK_BITS_INTERFACE_SUPPORTED, boardName, "false");
            baseArgs["isNtrRegionSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_NTR_REGION_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            var isRadiusCliOperatorAuthenticationSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_RADIUS_CLI_OPERATOR_AUTHENTICATION_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            if (isRadiusCliOperatorAuthenticationSupported) {
              var lastIntentConfigFromTopo = apUtils.getLastIntentConfigFromTopologyXtraInfo(topology);
              var currentIntentOperation = requestContext.get("currentIntentOpertion");
              var intentConfigJson = requestContext.get("intentConfigJson");
              var deviceDetails;
              deviceDetails = getDeviceDetailsForProfileManager(deviceName, actualType, intentVersion);
              apUtils.configRadiusOperProfile(baseArgs, deviceDetails, intentConfigJson, lastIntentConfigFromTopo, profilesJsonMap, currentIntentOperation);
            }
          } else if (deviceType === "LT") { //configure LT devices (LWLT-C, LGLT-D)
            var nwSlicingUserType = apUtils.getNetworkSlicingUserType();
            if (nwSlicingUserType === intentConstants.NETWORK_SLICING_USER_TYPE_NON_SLICING) {
              var deviceDetails;
              deviceDetails = getDeviceDetailsForProfileManager(deviceName, actualType, intentVersion);
              baseArgs["nwSlicingUserType"] = nwSlicingUserType;
              getRadiusDetails(baseArgs, fwk, deviceDetails);
            }
            fwk.convertObjectToNetconfFwkFormat(qosProfiles, inputSchema["qosSchema"], baseArgs);
            fwk.convertObjectToNetconfFwkFormat(l2Profiles, inputSchema["l2ProfileSchema"], baseArgs);
  
            //convert interface-usages of flooding-policies-profile to object
            if (baseArgs["flooding-policies-profiles"]) {
              Object.keys(baseArgs["flooding-policies-profiles"]).forEach(function (policy) {
                let policyObject = baseArgs["flooding-policies-profiles"][policy];
                if (policyObject["flooding-policy"]) {
                  Object.keys(policyObject["flooding-policy"]).forEach(function (profile) {
                    let profileObject = policyObject["flooding-policy"][profile];
                    if (profileObject && profileObject["in-interface-usages"] && profileObject["in-interface-usages"]["interface-usages"]) {
                      let interfaceUsagesArray = profileObject["in-interface-usages"]["interface-usages"];
                      let convertedInterfaceUsages = {};
                      if (interfaceUsagesArray.length > 0) {
                        interfaceUsagesArray.forEach(function (interfaceUsage) {
                          convertedInterfaceUsages[interfaceUsage] = { "value": interfaceUsage }
                        })
                      }
                      profileObject["in-interface-usages"]["interface-usages"] = convertedInterfaceUsages;
                    }
                    if (profileObject && profileObject["out-interface-usages"] && profileObject["out-interface-usages"]["interface-usages"]) {
                      let interfaceUsagesArray = profileObject["out-interface-usages"]["interface-usages"];
                      let convertedInterfaceUsages = {};
                      if (interfaceUsagesArray.length > 0) {
                        interfaceUsagesArray.forEach(function (interfaceUsage) {
                          convertedInterfaceUsages[interfaceUsage] = { "value": interfaceUsage }
                        })
                      }
                      profileObject["out-interface-usages"]["interface-usages"] = convertedInterfaceUsages;
                    }
                  })
                }
              })
            }
            var tcaConfigJSON = {};
            tcaConfigJSON["transceiver-tca-profiles"] = profilesJsonMap["transceiver-tca-profiles"];
            tcaConfigJSON["transceiver-link-tca-profiles"] = profilesJsonMap["transceiver-link-tca-profiles"];
            tcaConfigJSON["ber-tca-profiles"] = profilesJsonMap["ber-tca-profiles"];
            fwk.convertObjectToNetconfFwkFormat(tcaConfigJSON, inputSchema["tcaConfigSchema"], baseArgs);
  
            var tcaConfigOntJSON= {};
            if (profilesJsonMap && profilesJsonMap["LS-ONT"]) {
                tcaConfigOntJSON["transceiver-tca-profiles"] = profilesJsonMap["LS-ONT"]["transceiver-tca-profiles"];
                tcaConfigOntJSON["transceiver-link-tca-profiles"] = profilesJsonMap["LS-ONT"]["transceiver-link-tca-profiles"];
                tcaConfigOntJSON["eth-frame-error-tca-profile"] = profilesJsonMap["LS-ONT"]["eth-frame-error-tca-profile"];
                tcaConfigOntJSON["eth-phy-error-tca-profile"] = profilesJsonMap["LS-ONT"]["eth-phy-error-tca-profile"];
                tcaConfigOntJSON["fec-error-tca-profile"] = profilesJsonMap["LS-ONT"]["fec-error-tca-profile"];
                tcaConfigOntJSON["tc-layer-error-tca-profile"] = profilesJsonMap["LS-ONT"]["tc-layer-error-tca-profile"];
                tcaConfigOntJSON["downstream-mic-error-tca-profile"] = profilesJsonMap["LS-ONT"]["downstream-mic-error-tca-profile"];
                tcaConfigOntJSON["call-control-failure-tca-profile"] = profilesJsonMap["LS-ONT"]["call-control-failure-tca-profile"];
                tcaConfigOntJSON["rtp-failure-tca-profile"] = profilesJsonMap["LS-ONT"]["rtp-failure-tca-profile"];
                tcaConfigOntJSON["gem-port-error-tca-profile"] = profilesJsonMap["LS-ONT"]["gem-port-error-tca-profile"];
                tcaConfigOntJSON["gem-frame-error-tca-profile"] = profilesJsonMap["LS-ONT"]["gem-frame-error-tca-profile"];
                tcaConfigOntJSON["eth-frame-error-extended-tca-profile"] = profilesJsonMap["LS-ONT"]["eth-frame-error-extended-tca-profile"];
            }
            fwk.convertObjectToNetconfFwkFormat(tcaConfigOntJSON, inputSchema["ontPMTcaConfigSchema"], baseArgs);
            var oldValueFromTopoXtrainfor =  apUtils.getStageArgsFromTopologyXtraInfo(topology, topoKey);
            if(oldValueFromTopoXtrainfor && oldValueFromTopoXtrainfor[deviceName] && oldValueFromTopoXtrainfor[deviceName]["enhanced-filters"]){
                var enhancedFilterProfileOldValue = oldValueFromTopoXtrainfor[deviceName]["enhanced-filters"];
                apUtils.checkOldValueForEnhancedFiltersProfile(enhancedFilterProfileOldValue,baseArgs["enhanced-filters"]);
            }
            if(baseArgs["enhanced-filters"]) {
              apUtils.setDefaultSourceIpvxNetwork(baseArgs["enhanced-filters"]);
            }
            var boardType = bestType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LGLT_D)? intentConstants.FAMILY_TYPE_LS_MF_LGLT_D:
                            intentConstants.FAMILY_TYPE_LS_MF_LWLT_C;
            if(baseArgs["isTR385ModelSupported"]){
                baseArgs["traffic-descriptor-profiles"] = apUtils.getProfilesMatchingFilter(baseArgs["traffic-descriptor-profiles"],"device-type", boardType);
            }
            baseArgs["policing-profiles"] = apUtils.getProfilesMatchingFilter(baseArgs["policing-profiles"], "device-type", boardType);
            Object.keys(baseArgs["policing-profiles"]).forEach((profile) => {
              if (baseArgs["policing-profiles"][profile]) {
                apUtils.formatStringAttributeToObject(baseArgs["policing-profiles"][profile], "scope");
              }
            })
            baseArgs["shaper-profiles"] = apUtils.getProfilesMatchingFilter(baseArgs["shaper-profiles"], "device-type", boardType);
            updateAdditionalLtConfigFromXtraInfo(topology, topoKey, baseArgs);
            var eOnuSupportedLts = requestContext.get("eOnuSupportedLts");
            if(eOnuSupportedLts.indexOf(baseArgs["deviceID"]) > -1) {
              // Configure the onu-template
              logger.debug("Config the LT with eONU support");
              baseArgs["isOnuTemplateSupported"] = "true";
              baseArgs["topoKey"] = topoKey;
              configEonuTemplate(baseArgs,topology, fwk, bestType, tcaConfigOntJSON);
            } else {
              logger.debug("Config the LT with VONU support");
              baseArgs["vonuMgmtAddress"] = getVonuAddressFromDevice(baseArgs["deviceID"]);
            }
            if (ipv6AntiSpoofPrefixMode) {
              if (ipv6AntiSpoofPrefixMode["ipv6-prefix-mode"])
                baseArgs["ipv6-prefix-mode"] = ipv6AntiSpoofPrefixMode["ipv6-prefix-mode"];
              else baseArgs["ipv6-prefix-mode"] = "allow-prefix-length-64";
            }
            var ltBoardName = deviceInfo.familyType.replace("LS-MF-","");
            var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(deviceInfo.familyTypeRelease);
            baseArgs["isVsiVectorProfileSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_VSI_VECTOR_PROFILE_SUPPORTED, ltBoardName, "false");
            baseArgs["isIpv6AntiSpoofingSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_IPV6_ANTI_SPOOFING_SUPPORTED, ltBoardName, "false");
            baseArgs["isIpv4AntiSpoofingSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_IPV4_ANTI_SPOOFING_SUPPORTED, ltBoardName, "false");
            baseArgs["isTcaOnPacketDiscardsSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_TCA_ON_PACKET_DISCARDS_SUPPORTED, ltBoardName, "false");
            baseArgs["isSuppressCtLosAlarmSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_SUPPRESS_CT_LOS_ALARM_SUPPORTED, ltBoardName, "false");
            baseArgs["isReportOnuParametersSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_REPORT_ONU_PARAMETERS_SUPPORTED, ltBoardName, false);
            baseArgs["isDyingGaspThresholdSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_DYING_GASP_THRESHOLD_SUPPORTED, ltBoardName, false);
            baseArgs["isReportOnuMACAddressSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release,capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_REPORT_ONU_MAC_ADDRESS_SUPPORTED, ltBoardName, false);
            baseArgs["isDataPathIntegrityAlarmThresholdSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_DATA_PATH_INTEGRITY_ALARM_THRESHOLD_SUPPORTED, ltBoardName, false);
            baseArgs["isClearOnuLosAlarmOnCtLosSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_CLEAR_ONU_LOS_ALARM_ON_CT_LOS_SUPPORTED, ltBoardName, "false");
            baseArgs["isSuppressCtLosAlarmWhenNoVANIConfiguredSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_SUPPRESS_CT_LOS_ALARM_WHEN_NO_V_ANI_CONFIGURED_SUPPORTED, ltBoardName, false);
          }
  
          if (deviceType === "LT" || deviceType === "shelfNE") {
            baseArgs["isIpfixTcpKASupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_IPFIX_TCP_KA_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            baseArgs["isCacheCriticalContentSupported"] = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_CACHE_CRITICAL_CONTENT_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            var deviceDetails;
            deviceDetails = getDeviceDetailsForProfileManager(deviceName, actualType, intentVersion);
            if (intentConfigJson && intentConfigJson["configuration-profile"]) {
              var configurationProfilesObject = apUtils.getIntentAttributeObjectValues("intent-attributes.json", "configuration-profile", "name", intentConfigJson["configuration-profile"], deviceDetails);
            }
            var isMacAddressStringToHexConversionSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_MAC_ADDRESS_STRING_TO_HEX_CONVERSION_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            if(isMacAddressStringToHexConversionSupported) {
              var intentConfigJson = requestContext.get("intentConfigJson");
              if(intentConfigJson["configuration-profile"]) {
                var configurationProfilesObject = apUtils.getIntentAttributeObjectValues("intent-attributes.json", "configuration-profile", "name", intentConfigJson["configuration-profile"], deviceDetails);
                var MacAddressStringToHexConversionValue = configurationProfilesObject["subscriber-management"]["mac-address-string-to-hex-conversion"];
                baseArgs["mac-address-string-to-hex-conversion"] = MacAddressStringToHexConversionValue;
              }
            }
            if (baseArgs["isSuppressCtLosAlarmSupported"]) {
              if (configurationProfilesObject && configurationProfilesObject["channel-termination-loss-of-signal-alarm-control"]) {
                var ctLOSAlarmControl = configurationProfilesObject["channel-termination-loss-of-signal-alarm-control"];
                baseArgs["ctLOSAlarmControl"] = ctLOSAlarmControl;
              }
            }
            if (deviceType === "LT" && baseArgs["isClearOnuLosAlarmOnCtLosSupported"]) {
              if (configurationProfilesObject && configurationProfilesObject["clear-onu-loss-of-phy-layer-on-ct-los"]) {
                  var clearOnuLOSAlmOnctLOSControl = configurationProfilesObject["clear-onu-loss-of-phy-layer-on-ct-los"];
                  baseArgs["clear-onu-los-alarm-on-ct-lost"] = clearOnuLOSAlmOnctLOSControl;
              }
            }
          }
          getSyslogCollectorDetails(baseArgs, requestContext.get("intentConfigJson"), fwk);
          requestContext.put(keyName, baseArgs);
          return baseArgs;
        } else {
          var computedBaseArgs = requestContext.get(keyName);
          delete computedBaseArgs.isAuditSupported;
          if (computedBaseArgs["isOnuTemplateSupported"] === "true") {
            delete computedBaseArgs["templateArgsWithDiffOnLT"].isAuditSupported;
            if (deviceType === "LT" && computedBaseArgs["templateArgsWithDiffOnLT"]["onu-template"]) {
              var processedOnuTemplate = getOnuTemplateString(computedBaseArgs["templateArgsWithDiffOnLT"], bestType);
              logger.debug("Processed Onu Template during Sync: {}", apUtils.protectSensitiveDataLog(processedOnuTemplate));
              computedBaseArgs["onuTemplateString"] = processedOnuTemplate;
            }
          }
          computedBaseArgs.operation = baseArgs.operation;
          return computedBaseArgs;
        }
      },
      getDependencyInfo: function (syncInput) {
        var syncDepencyInfo = {};
        if(!requestContext.get("isDependenyUpdated")) {
          syncDepencyInfo[intentConstants.INTENT_TYPE_DEVICE_MF] = [syncInput.getTarget()];
          requestContext.put("isDependenyUpdated", true);
        }
        return syncDepencyInfo;
      },
      getDependencyProfiles: function (intentConfigJson) {
        if (profilesJsonMap["speed-profile"] && profilesJsonMap["user-service-profile"] && profilesJsonMap["qos-policy-profiles"] && profilesJsonMap["policies"] && profilesJsonMap["classifiers"]) {
          var listQosRebuild = computeNewQosPolicyProfile();
          if(requestContext && listQosRebuild){
            requestContext.put("listQosRebuild", listQosRebuild)
          }
        }
        var dependentProfilesList = [];
        if ( apCapUtils.checkIfProfileManagerIsEnabled(deviceInfo.familyTypeRelease) === true) {
            dependentProfilesList = getProfilesAndDependencyInfos(deviceInfo,input.getIntentTypeVersion(),intentConfigJson, requestContext);
          }
        return dependentProfilesList;
      },
      postSynchronize: function (input, networkState, result) {
        var deviceNameToObjectTypeToObjectIds = new HashMap();
        var deviceName = deviceInfo.name;
        var qosInternalProfile = requestContext.get("internal-qos-profile");
        if (result.isSuccess() && networkState == intentConstants.NETWORK_STATE_DELETE) {
            var removableObjects = new ArrayList();
            var objectTypeToObjectIdMap = new HashMap();
            if (qosInternalProfile) {
                for(var index in qosInternalProfile){
                    if(qosInternalProfile[index] && qosInternalProfile[index]["name"]){
                        removableObjects.add("anv:bbf-qos-policies:qos-policy-profiles/policy-profile/name=" + qosInternalProfile[index]["name"]);
                        objectTypeToObjectIdMap.put(intentConstants.OBJECT_TYPE_QOS, removableObjects);
                    }
                }
            }
            // GC here use for disassociate internal profile only
            deviceNameToObjectTypeToObjectIds = apUtils.updateGcHint(deviceName, objectTypeToObjectIdMap, result, deviceNameToObjectTypeToObjectIds);
        }
        if(!deviceNameToObjectTypeToObjectIds.isEmpty()){
            apUtils.setGcHint(null, deviceNameToObjectTypeToObjectIds, result);
        }
        return result;
      }
    };
  
    /**
       * The following method retrieves info using core API, which will be implemented as part of FNMS-133141 in 23.12.
       */
  
    function isUsedProfileOAM(baseArgs,deviceName,deviceType, hwTypeRelease) {
      loadMainOAMProfiles(deviceName, hwTypeRelease);
      var shelfName;
      if (deviceType == "shelfNE") {
          shelfName = deviceName;
      }
      else {
          shelfName = deviceName.substring(0, deviceName.lastIndexOf(intentConstants.DEVICE_SEPARATOR));
      }
      var deviceMfIntent = ibnService.getIntent(intentConstants.INTENT_TYPE_DEVICE_MF, shelfName);
      if (deviceMfIntent) {
          var deviceMfIntentConfig = apUtils.convertIntentConfigXmlToJson(deviceMfIntent.getIntentConfig());
          baseArgs["isUsedProfileOAM"] = false;
          if (deviceMfIntentConfig["main-oam-connectivity-account"]) {
              var profileOAM = requestScope.get().get("usedProfileOAM");
              if (profileOAM) {
                  baseArgs["isUsedProfileOAM"] = true;
                  baseArgs["username"] = profileOAM["username"];
                  baseArgs["password"] = profileOAM["password"];
              }
          }
      }
    }
  
    function setIdleTimeoutForDirectConnection(baseArgs) {
      if(profilesJsonMap["authentication-profile"] && profilesJsonMap["authentication-profile"][0]) {
        var ncConnectivityJson = profilesJsonMap["authentication-profile"][0];
        if (ncConnectivityJson && ncConnectivityJson["netconf-idle-timeout"]) {
          baseArgs["direct-connection-idle-timeout"] = ncConnectivityJson["netconf-idle-timeout"];
        }
      }
            
    }
  
    function processOnuTemplateSipAgentProfile(onuTemplates) {
      if(onuTemplates){
          Object.keys(onuTemplates).forEach(function (key) {
              if(onuTemplates[key]["sip-agent-profiles"] && onuTemplates[key]["sip-agent-profiles"]["name"]) {
                  apUtils.formatStringAttributeToObject(onuTemplates[key]["sip-agent-profiles"], "name");
              }
          })
      }
    }
  
    function getTemplateArgsWithDiff(baseArgs, fwk, topology) {
      var eOnuTemplateArgs = JSON.parse(JSON.stringify(baseArgs));
      var xtraInfos = apUtils.getTopologyExtraInfo(topology);
      var stageArgs = stageName + "_" + baseArgs["deviceID"] + "_ARGS";
      // We need add the operation on compute time itself.
      if(eOnuTemplateArgs["networkState"] === "delete") {
        eOnuTemplateArgs["operation"] = "remove";
      } else {
        eOnuTemplateArgs["operation"] = "merge";
      }
  
      eOnuTemplateArgs = fwk.getTransformedArgs(eOnuTemplateArgs);
  
      if (baseArgs["isOnuSipSupplSvcsProfileConfigSupported"]) {
        processOnuTemplateSipAgentProfile(eOnuTemplateArgs["onu-template"]);
      }
  
      var templateArgsWithDiff = eOnuTemplateArgs
  
      if (typeof xtraInfos[stageArgs] === "string") {
        var storedTemplateArgs = apUtils.JSONParsingWithCatchingException("getTemplateArgsWithDiff", xtraInfos[stageArgs]);
        if (storedTemplateArgs[baseArgs["deviceID"]]) {
          let storedDeviceTemplateArgs = storedTemplateArgs[baseArgs["deviceID"]];
          if (baseArgs["isOnuSipSupplSvcsProfileConfigSupported"]) {
              processOnuTemplateSipAgentProfile(storedDeviceTemplateArgs["onu-template"]);
          }
          templateArgsWithDiff = fwk.compareAndMergeTrackedArgsWithDiff(storedDeviceTemplateArgs, eOnuTemplateArgs);
        }
      }
      return templateArgsWithDiff;
    }
  
    function validateOnuTemplate(onuTemplateObj, bestType, isVoipSupported, sipAgentProfilesJSONFile, transportVoipSipJSONFile) {
      if(onuTemplateObj) {
        for(var templateName in onuTemplateObj) {
          if(onuTemplateObj[templateName]["service"]) {
            var arrayServicesWithUniqueUniID = [];
            for(var serviceName in onuTemplateObj[templateName]["service"]) {
              var service = onuTemplateObj[templateName]["service"][serviceName];
              // Each service of the ONU template that shares the same type, the uni-id must be unique. RESTRICT ONLY TO MULTICAST (IPTV) CASE
              var arrayServiceKey = [];
              var multicasts = service["multicast"];
              if (multicasts) {
                  for (var mcastName in multicasts) {
                      var mcast = multicasts[mcastName];
                      var multicastVpnName = mcast["multicast-infra-name"] ? mcast["multicast-infra-name"] : "MC_VPN";
                      var serviceKey = service["type"] + "_" + service["uni-id"] + "_" + multicastVpnName; // Cross check for duplicates on services that has same type and uni-id and in the same multicast VPN
                      if (arrayServiceKey.indexOf(serviceKey) == -1) {
                          arrayServiceKey.push(serviceKey);
                      }
                  }
                  arrayServiceKey.forEach(function (key) {
                      if (arrayServicesWithUniqueUniID.indexOf(key) == -1) {
                          arrayServicesWithUniqueUniID.push(key);
                      } else {
                          throw new RuntimeException("The number of IPTV with a UNI/VEIP port should not be greater than one. Update service '" + service["name"] + "' for the '" + service["uni-id"] + "' in the profile-onu-template '" + templateName + "'.");
                      }
                  })
              }
              if ((!service["rule"]) || (service["rule"].length == 0)) {
                if (service["type"] && service["type"] != 'VOIP-SIP') {
                  throw new RuntimeException("ONU templates '" + templateName + "/Service[" + serviceName + "]' : Rule is missing, should contain at least one Rule");
                }
              }
              if(service["multicast"]) {
                var multicastObj = service["multicast"];
                if(multicastObj["multicast-gem-port-id"] && !isNaN(multicastObj["multicast-gem-port-id"]) && (multicastObj["multicast-gem-port-id"] !== "2047"
                    && multicastObj["multicast-gem-port-id"] !== "65534")) {
                  var errorMsg = "Invalid multicast-gem-port-id '" + multicastObj["multicast-gem-port-id"] +
                      "' present in ONU template '" + templateName + "' , The supported value - 2047 for GPON and 65534 " +
                      "for XGS PON/NGPON2 "
                  throw new RuntimeException(errorMsg);
                }
              }
              if (!apUtils.isMFSupportedLTFamilyType(bestType, "21.3") &&
                (!service["isPbitMarkingAvailable"] || service["isPbitMarkingAvailable"] == false)
                && service["rule"] && service["rule"][intentConstants.USER_TRAFFIC_TYPE_UNTAGGED]) {
                throw new RuntimeException("Untagged User Traffic Type is not allowed when Subscriber Ingress QoS Profile has no pbit-marking policy");
              }
            }
          }
          var sipAgentProfile = onuTemplateObj[templateName]["sip-agent-profiles"];
          if (sipAgentProfile && isVoipSupported && JSON.stringify(sipAgentProfile) != "{}") {
            var invalidProfiles = [];
            var validProfiles = [];
            if (sipAgentProfilesJSONFile) {
              var sipAgentProfObj = sipAgentProfilesJSONFile["sip-agent-profile"];
              for (var obj in sipAgentProfObj) {
                validProfiles.push(sipAgentProfObj[obj]["name"]);
              }
            }
            if (validProfiles.indexOf(sipAgentProfile["name"]) === -1 && invalidProfiles.indexOf(sipAgentProfile["name"]) === -1) {
              invalidProfiles.push(sipAgentProfile["name"]);
            }
            if (invalidProfiles && invalidProfiles.length > 0) {
              throw new RuntimeException("sip-agent-profiles profile \"" + invalidProfiles + "\" mentioned in template \"" + templateName + "\" of ONU templates is not defined");
            }
          }
          var transportVoipSip = onuTemplateObj[templateName]["transport-voip-sip"];
          var transportVoipSipExistings = false;
          if (transportVoipSip && isVoipSupported && JSON.stringify(transportVoipSip) != "{}") {
            var tVoipSip = onuTemplateObj[templateName]["transport-voip-sip"];
            var invalidProfiles = [];
            var validProfiles = [];
            if (!transportVoipSipJSONFile) {
              var transportVoipSipJSONFile = {};
              transportVoipSipJSONFile["transport-voip-sip"] = profilesJsonMap["LS-ONT"]["transport-voip-sip"];
            }
            var transportVoipSipObj = transportVoipSipJSONFile["transport-voip-sip"];
            for (var obj in transportVoipSipObj) {
              validProfiles.push(transportVoipSipObj[obj]["name"]);
            }
            if (!tVoipSip["name"]) {
              throw new RuntimeException("transport-voip-sip profile in template \"" + templateName + "\" is missing mandatory key : name");
            }
            if (validProfiles.indexOf(tVoipSip["name"]) === -1 && invalidProfiles.indexOf(tVoipSip["name"]) === -1) {
              invalidProfiles.push(tVoipSip["name"]);
            }
            if (invalidProfiles && invalidProfiles.length > 0) {
              throw new RuntimeException("transport-voip-sip profile \"" + invalidProfiles + "\" mentioned in template \"" + templateName + "\" of ONU templates is not defined");
            }
            transportVoipSipExistings = true;
          }
          var nodeType = requestContext.get("nodeType");
          var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
          var ipHostConfig = onuTemplateObj[templateName]["ip-host-config"];
          if (ipHostConfig && JSON.stringify(ipHostConfig) != "{}") {
              if (transportVoipSipExistings) { // cannot have both iphost and transportVoipSip support
                  throw new RuntimeException("ONU templates '" + templateName + "' cannot not support both Transport VOIP SIP and IP Host Configuration profiles");
              }
              var tIphostConf = onuTemplateObj[templateName]["ip-host-config"];
              var invalidProfiles = [];
              var validProfiles = [];
              if (requestContext.get("iphostConfigProfiles")) {
                  var ipHostConfigJSONFile = requestContext.get("iphostConfigProfiles");
              } else {
                  var ipHostConfigJSONFile = {};
                  ipHostConfigJSONFile["ip-host-config"] = profilesJsonMap["LS-ONT"]["ip-host-config"];
              }
              var ipHostConfigObj = ipHostConfigJSONFile["ip-host-config"];
              for (var obj in ipHostConfigObj) {
                  validProfiles.push(ipHostConfigObj[obj]["name"]);
              }
              if (!tIphostConf["name"]) {
                  throw new RuntimeException("IP Host Configuration profile in template \"" + templateName + "\" is missing mandatory key : name");
              }
              if (validProfiles.indexOf(tIphostConf["name"]) === -1 && invalidProfiles.indexOf(tIphostConf["name"]) === -1) {
                  invalidProfiles.push(tIphostConf["name"]);
              }
              if (invalidProfiles && invalidProfiles.length > 0) {
                  throw new RuntimeException("IP Host Configuration profile \"" + invalidProfiles + "\" mentioned in template \"" + templateName + "\" of ONU templates is not defined");
              }
          }
          var isAutoDetectCardNoSupported = requestContext.get("isAutoDetectCardNoSupported");
          if(isAutoDetectCardNoSupported) {
            let cards = onuTemplateObj[templateName]["layout"]["cards"];
            logger.debug("validateOnuTemplate cards : {}", JSON.stringify(cards));
  
            let cardCount = 0;
            let ethernetAllCardCount = 0;
            let ethernetCardCount = 0;
            let ethernetXXXCardCount = 0;
            let ethernetCardWithFixNumberCount = 0;
            let ethernetCardWithAutoDetectCount = 0;
  
            let potsCardCount = 0;
            let potsCardWithFixNumberCount = 0;
            let potsCardWithAutoDetectCount = 0;
  
            let veipCardCount = 0;
            let veipCardWithFixNumberCount = 0;
            let veipCardWithAutoDetectCount = 0;
  
            for (let cardName in cards){
              cardCount++;
              var cardSpeedLimit = 0;
              if(cards[cardName]["cardType"] == "VEIP"){
                veipCardCount++;
                if(cards[cardName]["cardNo"] != null && cards[cardName]["cardNo"] == "auto-detect"){
                  veipCardWithAutoDetectCount++;
                }else if(cards[cardName]["cardNo"] != null && /^\d+$/.test(cards[cardName]["cardNo"])){
                  veipCardWithFixNumberCount++;
                }
              }
              else if (cards[cardName]["cardType"] == "POTS"){
                potsCardCount++;
                if(cards[cardName]["cardNo"] != null && cards[cardName]["cardNo"] == "auto-detect"){
                  potsCardWithAutoDetectCount++;
                }else if(cards[cardName]["cardNo"] != null && /^\d+$/.test(cards[cardName]["cardNo"])){
                  potsCardWithFixNumberCount++;
                }
              }
              else if(cards[cardName]["cardType"] != null && cards[cardName]["cardType"].startsWith("Ethernet")){
                ethernetAllCardCount++;
                if(cards[cardName]["cardNo"] != null && cards[cardName]["cardNo"] == "auto-detect"){
                  ethernetCardWithAutoDetectCount++;
                }else if(cards[cardName]["cardNo"] != null && /^\d+$/.test(cards[cardName]["cardNo"])){
                  ethernetCardWithFixNumberCount++;
                }
  
                if(cards[cardName]["cardType"] != "Ethernet"){
                  ethernetXXXCardCount++;
                  cardSpeedLimit = apUtils.convertEthernetXXXCardTypeToSpeedLimit(cards[cardName]["cardType"]);
                }else{
                  ethernetCardCount++;
                }
              }
  
              var totalSpeed = 0;
              for(let port in cards[cardName]["ports"]){
                let curPort = cards[cardName]["ports"][port];
                let portspeed = curPort["portspeed"]?curPort["portspeed"]["value"]:null;
                let duplex = curPort["duplex"]?curPort["duplex"]["value"]:null;
                let negotiation = curPort["auto-negotiation"];
                if(portspeed !=null && portspeed != ""){
                  /*
                  if(negotiation == "enabled"){
                    let errorMsg = "Port speed can't set when auto-negotiation is enabled on template " + templateName + ".";
                    throw new RuntimeException(errorMsg);
                  }
                  */
                  if(cardSpeedLimit>0){
                    let portSpeedNumber = apUtils.convertPortSpeedEnumToSpeedNumber(portspeed);
                    totalSpeed += portSpeedNumber;
                  }
                }
                if(negotiation == null || negotiation == ""){
                  if(portspeed == "eth-if-speed-100gb"){
                    let errorMsg = "Not support port Speed 100Gbps on template " + templateName + ".";
                    throw new RuntimeException(errorMsg);
                  }
                  if((duplex == "half" || duplex == null || duplex == "")  && (!(portspeed == "eth-if-speed-100mb" || portspeed == "eth-if-speed-1gb" || portspeed == null || portspeed == ""))){
                    let errorMsg = "The speed " + portspeed + " can work only on full duplex mode on template " + templateName + ".";
                    throw new RuntimeException(errorMsg);
                  }
                }
              }
            }
            if(ethernetCardCount > 0 && ethernetXXXCardCount > 0 ){
              let errorMsg = "Card type should be either 'Ethernet' or 'Ethernet-xxx' and not mix in one ONU template " + templateName + "."
              throw new RuntimeException(errorMsg);
            }
  
            if(potsCardCount > 1){
              if(potsCardWithFixNumberCount > 0 && potsCardWithAutoDetectCount >0){
                let errorMsg = "It should all be 'auto-detect' cardNo or numberic cardNo in onu ONU template " + templateName + "."
                throw new RuntimeException(errorMsg);
              }
            }
            if(veipCardCount > 1){
              if(veipCardWithFixNumberCount > 0 && veipCardWithAutoDetectCount > 0){
                let errorMsg = "It should all be 'auto-detect' cardNo or numberic cardNo in onu ONU template " + templateName + "."
                throw new RuntimeException(errorMsg);
              }
            }
  
            if(ethernetAllCardCount > 1){
              if(ethernetCardWithFixNumberCount > 0 && ethernetCardWithAutoDetectCount > 0){
                let errorMsg = "It should all be 'auto-detect' cardNo or numberic cardNo in onu ONU template " + templateName + "."
                throw new RuntimeException(errorMsg);
              }
            }
          }else{
            // Release before 23.9
            let cards = onuTemplateObj[templateName]["layout"]["cards"];
            for (let cardName in cards){
              if(cards[cardName]["cardNo"] != null && cards[cardName]["cardNo"] == "auto-detect"){
                let errorMsg = "Not support 'auto-detect' in card number of card "+ cardName + " on template " + templateName + ".";
                throw new RuntimeException(errorMsg);
              }
              if(cards[cardName]["cardType"] != null && (cards[cardName]["cardType"] == "Ethernet-1G" || cards[cardName]["cardType"] == "Ethernet-2.5G"  || cards[cardName]["cardType"] == "Ethernet-10G" )){
                let errorMsg = "The card type + " + cards[cardName]["cardType"]  + " is not allowed on the device.";
                throw new RuntimeException(errorMsg);
              }
            }
          }
        }
      }
    }
  
    function validateOnuTemplatesJSON(bestType, tcontProfiles) {
      var onuTemplates = requestContext.get("onuTemplates");
      var qosProfiles = requestContext.get("qosProfiles");
      if (onuTemplates) {
        if (onuTemplates["onu-template"] != null) {
          var currTemplate = onuTemplates["onu-template"];
          var missingKeys = [];
          var serviceName = [];
          var ruleUserTrafficType = [];
          var neededKeys = ["name", "layout", "service"];
          if (apUtils.isMFSupportedLTFamilyTypeFor223(bestType) || apUtils.isMFSupportedLTFamilyTypeFor226(bestType)) {
            neededKeys.push("flexible-tcont-sharing");
          }
          for (var obj in currTemplate) {
            for (var key in neededKeys) {
              if (!currTemplate[obj][neededKeys[key]]) {
                if (missingKeys.indexOf(neededKeys[key]) === -1) {
                  missingKeys.push(neededKeys[key]);
                }
              }
            }
            if (missingKeys.indexOf("name") !== -1) {
              throw new RuntimeException("ONU template has one/more objects without key : name");
            }
            if (currTemplate[obj]["layout"]) {
              var neededInnerKeys = ["name", "cards"];
              for (var key in neededInnerKeys) {
                if (!currTemplate[obj]["layout"][neededInnerKeys[key]]) {
                  if (missingKeys.indexOf(neededInnerKeys[key]) === -1) {
                    missingKeys.push(neededInnerKeys[key]);
                  }
                }
              }
            }
            if (currTemplate[obj]["layout"]["cards"]) {
              var cards = currTemplate[obj]["layout"]["cards"];
              var neededInnerKeys = ["cardNo", "cardType", "ports"];
              for (var card in cards) {
                for (var key in neededInnerKeys) {
                  if (!cards[card][neededInnerKeys[key]]) {
                    if (missingKeys.indexOf(neededInnerKeys[key]) === -1) {
                      missingKeys.push(neededInnerKeys[key]);
                    }
                  }
                  if (cards[card]["ports"]) {
                    var ports = cards[card]["ports"];
                    var neededPortKeys = "";
                    var isAutoDetectCardNoSupported = requestContext.get("isAutoDetectCardNoSupported");
                    if(isAutoDetectCardNoSupported) {
                      neededPortKeys = ["portNo", "portName"];
                    } else {
                      neededPortKeys = ["portNo", "portName", "portType"];
                    }
                    for (var port in ports) {
                      for (var pkey in neededPortKeys) {
                        if (!ports[port][neededPortKeys[pkey]]) {
                          if (missingKeys.indexOf(neededPortKeys[pkey]) === -1) {
                            missingKeys.push(neededPortKeys[pkey]);
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
  
            if (currTemplate[obj]["service"]) {
              var svc = currTemplate[obj]["service"];
              for (var service in svc) {
                var neededInnerKeys = ["name", "type", "uni-id"];
                if (svc[service]["type"] && svc[service]["type"] != 'VOIP-SIP') {
                  neededInnerKeys = ["name", "type", "uni-id", "subscriber-ingress-qos-profile-id"];
                }
                if (svc[service]["type"] && (svc[service]["type"] == 'VOD' || svc[service]["type"] == 'IPTV')) {
                  neededInnerKeys.push("multicast");
                }
                for (var key in neededInnerKeys) {
                  if (!svc[service][neededInnerKeys[key]]) {
                    if (missingKeys.indexOf(neededInnerKeys[key]) === -1) {
                      missingKeys.push(neededInnerKeys[key]);
                    }
                  }
                  //Validate tcont-config
                  if (svc[service]["type"] && svc[service]["type"]!='VOIP-SIP') {
                    if (!svc[service]["tc-to-queue-mapping-profile-id"] && !svc[service]["tcont-config"]) {
                      throw new RuntimeException("ONU templates \"" + currTemplate[obj]["name"] + "\" is missing mandatory key(s) : tc-to-queue-mapping-profile-id or tcont-config");
                    } else if (svc[service]["tc-to-queue-mapping-profile-id"] && svc[service]["tcont-config"]) {
                      throw new RuntimeException("ONU templates \"" + currTemplate[obj]["name"] + "\" just only one key tc-to-queue-mapping-profile-id or tcont-config should be defined in json");
                    }
                    apUtils.validateTcontConfig(tcontProfiles, svc[service], svc[service]["name"], qosProfiles, null, currTemplate[obj]["name"]);
                  }
                }
                if (svc[service]["multicast"]) {
                  if (svc[service]["type"] && svc[service]["type"] !== intentConstants.SERVICE_TYPE_TRANSPARENT_FORWARD) {
                    var nodeType = requestContext.get("nodeType");
                    var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
                    if (apUtils.compareVersion(deviceTypeAndRelease.release, "22.6") > 0) {
                      var neededMcastKeys = ["name", "max-group-number", "multicast-rate-limit", "mcast-vlan-id", "multicast-profile"];
                    } else {
                      var neededMcastKeys = ["name", "max-group-number", "multicast-rate-limit", "mcast-vlan-id"];
                    }
                  } else {
                    //neededMcastKeys = ["name", "max-group-number", "multicast-rate-limit", "multicast-profile"];
                    neededMcastKeys = [];
                  }
                  if (svc[service]["multicast"] instanceof Array) {
                    svc[service]["multicast"].forEach(function(multicast){
                      for(var mkey in neededMcastKeys){
                        if(!multicast[neededMcastKeys[mkey]]){
                          if (neededMcastKeys[mkey] != "multicast-profile" || (neededMcastKeys[mkey] == "multicast-profile" && !multicast["multicast-infra-name"])) {
                            if (missingKeys.indexOf(neededMcastKeys[mkey]) === -1) {
                              missingKeys.push(neededMcastKeys[mkey]);
                              serviceName.push(svc[service]["name"]);
                            }
                          }
                        }
                      }
                    });
                  } else {
                    for (var mkey in neededMcastKeys) {
                      if (!svc[service]["multicast"][neededMcastKeys[mkey]]) {
                        if (missingKeys.indexOf(neededMcastKeys[mkey]) === -1) {
                          missingKeys.push(neededMcastKeys[mkey]);
                        }
                      }
                    }
                  }
                }
                for (var rule in svc[service]["rule"]) {
                  if (svc[service]["rule"][rule]["user-traffic-type"] !== intentConstants.SERVICE_TYPE_TRANSPARENT_FORWARD) {
                    var neededRuleKeys = ["name", "user-traffic-type"];
                    for (var rkey in neededRuleKeys) {
                      if (!svc[service]["rule"][rule][neededRuleKeys[rkey]]) {
                        if (missingKeys.indexOf(neededRuleKeys[rkey]) === -1) {
                          missingKeys.push(neededRuleKeys[rkey]);
                        }
                      }
                      var translateQToCVlan = svc[service]["rule"][rule]["translate-q-vlan-to-c-vlan"];
                      var userTrafficType = svc[service]["rule"][rule]["user-traffic-type"];
                      var qVlanId = svc[service]["rule"][rule]["q-vlan-id"];
                      var cVlanId = svc[service]["rule"][rule]["c-vlan-id"];
                      var sVlanId = svc[service]["rule"][rule]["s-vlan-id"];
                      if (userTrafficType && userTrafficType === "single-tagged") {
                        if (!qVlanId && missingKeys.indexOf("q-vlan-id") === -1) {
                          serviceName .push(svc[service]["name"]);
                          ruleUserTrafficType.push(userTrafficType);
                          missingKeys.push("q-vlan-id");
                        }
                        if (translateQToCVlan && translateQToCVlan === "true" && !cVlanId && missingKeys.indexOf("c-vlan-id") === -1) {
                          serviceName .push(svc[service]["name"]);
                          ruleUserTrafficType.push(userTrafficType);
                          missingKeys.push("c-vlan-id");
                        }
                      } else if (userTrafficType == "match-all") {
                        if ((!cVlanId && missingKeys.indexOf("c-vlan-id") === -1) && (!sVlanId && missingKeys.indexOf("s-vlan-id") === -1)) {
                          serviceName .push(svc[service]["name"]);
                          ruleUserTrafficType.push(userTrafficType);
                          missingKeys.push("c-vlan-id");
                          missingKeys.push("s-vlan-id");
                        }
                      } else {
                        if (!cVlanId && missingKeys.indexOf("c-vlan-id") === -1) {
                          serviceName .push(svc[service]["name"]);
                          ruleUserTrafficType.push(userTrafficType);
                          missingKeys.push("c-vlan-id");
                        }
                      }
                    }
                  }
                }
              }           
            }
  
            if (missingKeys && missingKeys.length > 0){
              if(missingKeys.length == 2){
                throw new RuntimeException("ONU templates '" + currTemplate[obj]["name"] + "/Service[" + serviceName + "]/Rule[ " + ruleUserTrafficType + "]' is missing mandatory keys '" + missingKeys[0] + "' or '" + missingKeys[1] +"'");
              } else{
                if(ruleUserTrafficType.length < 1) {
                  throw new RuntimeException("ONU templates '" + currTemplate[obj]["name"] + "/Service[" + serviceName[0] + "]' is missing mandatory key '" + missingKeys +"'");
                }
                throw new RuntimeException("ONU templates '" + currTemplate[obj]["name"] + "/Service[" + serviceName + "]/Rule[ " + ruleUserTrafficType + "]' is missing mandatory key '" + missingKeys +"'");
              }
            }
          }
        }
      }
    }
  
  
    /**
     * 1) Load the onu-template.json
     * 2) compute the config
     * 3) Push the config based onu-template config.
     *    - Push Hardware config
     *    - Push the profiles
     *    - Push the interfaces ( ani and enet)
     *    - Push VSI, GEM port , TCONT config
     *  4)
     */
    function configEonuTemplate(baseArgs, topology, fwk, bestType, tcaConfigJSON) {
      if (apUtils.isMFSupportedLTFamilyTypeFor226(bestType)) {
        var isVoipSupported = true;
      }
      var eOnuResources = loadEonuConfigResources(bestType, isVoipSupported);
      logger.debug("loadEonuConfigResources eOnuResources : {}", apUtils.protectSensitiveDataLog(eOnuResources));
      var onuCfmProfiles = apUtils.getCfmProfilesForEonuTemplate223(eOnuResources.onuTemplates, eOnuResources.cfmOntProfiles, eOnuResources.cfmProfiles);
      var convertedCfmProfiles = {};
      for (var index in onuCfmProfiles) {
          fwk.convertObjectToNetconfFwkFormat(onuCfmProfiles[index], inputSchema["onuUsedCfmProfilesSchema"], convertedCfmProfiles);
      }
      baseArgs["onuUsedCfmProfiles"] = onuCfmProfiles;
      var profilesRestrictedToOnlyUsed = resourceProvider.getResource(internalResourcePrefix + "profiles-restricted-to-only-used.json");
      var onuTemplateWithBerTcaProfileRestrictions;
      if (profilesRestrictedToOnlyUsed) {
          var profilesRestrictedToOnlyUsedJSON = JSON.parse(profilesRestrictedToOnlyUsed);
          if (profilesRestrictedToOnlyUsedJSON && profilesRestrictedToOnlyUsedJSON["onu-template-with-ber-tca-profile-restrictions"] &&
              typeof profilesRestrictedToOnlyUsedJSON["onu-template-with-ber-tca-profile-restrictions"].push === "function" && profilesRestrictedToOnlyUsedJSON["onu-template-with-ber-tca-profile-restrictions"].length > 0) {
              onuTemplateWithBerTcaProfileRestrictions = profilesRestrictedToOnlyUsedJSON["onu-template-with-ber-tca-profile-restrictions"]
              if (onuTemplateWithBerTcaProfileRestrictions) {
                  baseArgs["profilesRestrictedToOnlyUsed"] = onuTemplateWithBerTcaProfileRestrictions;
              }
          }
      }
      var cloneQosProfiles = JSON.parse(JSON.stringify(eOnuResources.qosProfiles));
      var eOnuArgs = {};
      fwk.convertObjectToNetconfFwkFormat(cloneQosProfiles, inputSchema["qosSchema"], eOnuArgs);
      // Use diffrent key name on qos profile entry to avoid overwrite lt qos-profiles
      Object.keys(eOnuArgs).forEach(function (key) {
        eOnuArgs["eOnu_"+key] = eOnuArgs[key];
        delete eOnuArgs[key];
      });
      var ontProfilesGroup = profilesJsonMap[profileConstants.ONT_PROFILES_GROUP.subType][profileConstants.ONT_PROFILES_GROUP.profileType] ? profilesJsonMap[profileConstants.ONT_PROFILES_GROUP.subType][profileConstants.ONT_PROFILES_GROUP.profileType] : null;
      var clockProfiles = {};
      if (baseArgs["phase-sync-profiles"]) {
        clockProfiles["phaseSyncProfiles"] = baseArgs["phase-sync-profiles"];
      }
      if (baseArgs["ptp-ccsa-port-profiles"] && baseArgs["ptp-g8275dot1-port-profiles"]) {
        clockProfiles["ccsaProfiles"] = baseArgs["ptp-ccsa-port-profiles"];
        clockProfiles["dot1Profiles"] = baseArgs["ptp-g8275dot1-port-profiles"];
      }
      var ltTopoArgs = null;
      if (topology) {
        var xtraInfos = apUtils.getTopologyExtraInfo(topology);
        var topoKey = stageName + "_" + baseArgs["deviceID"] + "_ARGS";
        if (xtraInfos && Object.keys(xtraInfos).indexOf(topoKey) != -1 ) {
          var ltTopoArgsJson = apUtils.JSONParsingWithCatchingException("configEonuTemplate", xtraInfos[topoKey]);
          if (ltTopoArgsJson && ltTopoArgsJson[baseArgs["deviceID"]]) {
              ltTopoArgs = ltTopoArgsJson[baseArgs["deviceID"]];
          }
        }
      }
      var systemLoadProfiles = profilesJsonMap[profileConstants.SYSTEM_LOAD_PROFILE.subType][profileConstants.SYSTEM_LOAD_PROFILE.profileType] ? apUtils.convertJsonArrayToKeyValueJSONObjects(profilesJsonMap[profileConstants.SYSTEM_LOAD_PROFILE.subType][profileConstants.SYSTEM_LOAD_PROFILE.profileType], "name") : null;
      var memoryUsageProfiles = profilesJsonMap[profileConstants.MEMORY_USAGE_PROFILE.subType][profileConstants.MEMORY_USAGE_PROFILE.profileType] ? apUtils.convertJsonArrayToKeyValueJSONObjects(profilesJsonMap[profileConstants.MEMORY_USAGE_PROFILE.subType][profileConstants.MEMORY_USAGE_PROFILE.profileType], "name") : null;
      var powerSheddingProfiles = profilesJsonMap[profileConstants.POWER_SHEDDING_PROFILE.subType][profileConstants.POWER_SHEDDING_PROFILE.profileType] ? apUtils.convertJsonArrayToKeyValueJSONObjects(profilesJsonMap[profileConstants.POWER_SHEDDING_PROFILE.subType][profileConstants.POWER_SHEDDING_PROFILE.profileType], "name") : null;
      var onuTemplateProfiles = apUtils.processProfilesGroupForOnuTemplate(eOnuResources, clockProfiles, eOnuArgs["eOnu_tc-id-2-queue-id-mapping-profile"], ontProfilesGroup, ltTopoArgs, systemLoadProfiles, memoryUsageProfiles, tcaConfigJSON, powerSheddingProfiles);
      if (onuTemplateProfiles) {
        if (onuTemplateProfiles["trafficClassProfiles"]) {
          eOnuArgs["eOnu_tc-id-2-queue-id-mapping-profile"] = onuTemplateProfiles["trafficClassProfiles"];
        }
        if(onuTemplateProfiles["eonu_TrafficClassProfiles"]) {
          baseArgs["eonu_TrafficClassProfiles"] = onuTemplateProfiles["eonu_TrafficClassProfiles"];
        } 
        if (onuTemplateProfiles["ptpCcsaProfiles"]) {
          baseArgs["ptp-ccsa-port-profiles"] = onuTemplateProfiles["ptpCcsaProfiles"];
        }
        if (onuTemplateProfiles["eonu_PtpCcsaProfiles"]) {
          baseArgs["eonu_PtpCcsaProfiles"] = onuTemplateProfiles["eonu_PtpCcsaProfiles"];
        }
        if (onuTemplateProfiles["ptpDotProfiles"]) {
          baseArgs["ptp-g8275dot1-port-profiles"] = onuTemplateProfiles["ptpDotProfiles"];
        }
        if (onuTemplateProfiles["eonu_PtpDotProfiles"]) {
          baseArgs["eonu_PtpDotProfiles"] = onuTemplateProfiles["eonu_PtpDotProfiles"];
        }
        if (onuTemplateProfiles["ethFrameErrProfiles"]) {
          baseArgs["eth-frame-error-profiles"] = onuTemplateProfiles["ethFrameErrProfiles"];
        }
        if (onuTemplateProfiles["ethPhyErrProfiles"]) {
          baseArgs["eth-phy-layer-err-profiles"] = onuTemplateProfiles["ethPhyErrProfiles"];
        }
        if (onuTemplateProfiles["fecErrProfiles"]) {
          baseArgs["fec-err-profiles"] = onuTemplateProfiles["fecErrProfiles"];
        }
        if (onuTemplateProfiles["tcLayerErrProfiles"]) {
          baseArgs["tc-layer-err-profiles"] = onuTemplateProfiles["tcLayerErrProfiles"];
        }
        if (onuTemplateProfiles["dwnMicErrProfiles"]) {
          baseArgs["downstream-mic-err-profiles"] = onuTemplateProfiles["dwnMicErrProfiles"];
        }
        if (onuTemplateProfiles["systemLoadProfiles"]) {
          baseArgs["system-load-profiles"] = onuTemplateProfiles["systemLoadProfiles"];
        }
        if (onuTemplateProfiles["memoryUsageProfiles"]) {
          baseArgs["memory-usage-profiles"] = onuTemplateProfiles["memoryUsageProfiles"];
        }
        if (onuTemplateProfiles["rtpFailureProfiles"]) {
          baseArgs["rtp-failure-profiles"] = onuTemplateProfiles["rtpFailureProfiles"];
        }
        if (onuTemplateProfiles["callControlFailureProfiles"]) {
            baseArgs["call-control-failure-profiles"] = onuTemplateProfiles["callControlFailureProfiles"];
        }
        if (onuTemplateProfiles["gemPortErrProfiles"]) {
            baseArgs["gem-port-err-profiles"] = onuTemplateProfiles["gemPortErrProfiles"];
        }
        if (onuTemplateProfiles["gemFrameErrProfiles"]) {
          baseArgs["gem-frame-err-tca-profiles"] = onuTemplateProfiles["gemFrameErrProfiles"];
        }
        if (onuTemplateProfiles["ethFrameErrExtendedTcaProfiles"]) {
          baseArgs["eth-frame-error-extended-tca-profiles"] = onuTemplateProfiles["ethFrameErrExtendedTcaProfiles"];
        }             
        if (onuTemplateProfiles["powerSheddingProfiles"]) {
          baseArgs["power-shedding-profiles"] = onuTemplateProfiles["powerSheddingProfiles"];
        }
      }
      if (requestContext.get("systemLoadProfiles")) {
        apUtils.updateProfilesFromONTHWLayout(requestContext.get("systemLoadProfiles"), "system-load-profiles", systemLoadProfiles, baseArgs);
      }
      if (requestContext.get("memoryUsageProfiles")) {
        apUtils.updateProfilesFromONTHWLayout(requestContext.get("memoryUsageProfiles"), "memory-usage-profiles", memoryUsageProfiles, baseArgs);
      }
      if (requestContext.get("powerSheddingProfiles") && ((ontProfilesGroup && ontProfilesGroup[0] && !ontProfilesGroup[0]["power-shedding-profiles"]) || !ontProfilesGroup)) {
        apUtils.updateProfilesFromONTHWLayout(requestContext.get("powerSheddingProfiles"), "power-shedding-profiles", powerSheddingProfiles, baseArgs);
      }
      if (eOnuResources.onuTemplates["onu-template"]) {
        baseArgs["onuUsedQosProfiles"] = apUtils.getQosProfilesForEonuTemplate(eOnuResources.onuTemplates, eOnuArgs, eOnuResources.qosProfiles, eOnuResources.transportVoipSipProfiles, ontProfilesGroup, ltTopoArgs);
      }
      
      apUtils.processTcontOnuTemplate(eOnuResources.onuTemplates["onu-template"], eOnuResources.tcont["tcont-profile"]);
      apUtils.processGemPort(eOnuResources.onuTemplates["onu-template"], eOnuResources.qosProfiles["qos-policy-profiles"], eOnuResources.qosProfiles["classifiers"], eOnuResources.qosProfiles["policies"]);
      // FNMS-86119 reverting to 21.3 to match XSLT transformation
      xponUtils.processSevicesOnuTemplate(eOnuResources.onuTemplates["onu-template"], eOnuResources.qosProfiles);
      apUtils.verifyMulticastObjectForTransparentForwardCase(eOnuResources.onuTemplates["onu-template"]);
      var isAutoDetectCardNoSupported = baseArgs["isAutoDetectCardNoSupported"];
      apUtils.ontTemplateSchemaProcessing(eOnuResources.onuTemplates, topology, baseArgs, eOnuResources, bestType, {}, true, isAutoDetectCardNoSupported);
      if (eOnuResources.multicastProfiles != null) {
        apUtils.processMultipleMulticastObjects(eOnuResources.onuTemplates["onu-template"], eOnuResources.multiCastInfraJson, eOnuResources.multicastProfiles, baseArgs);
        if(eOnuResources.onuTemplates["onu-template"]){
          validateMcastInfraJSON(eOnuResources.onuTemplates["onu-template"], eOnuResources.multiCastInfraJson);
        }
      } else {
        throw new RuntimeException("Can't get the Multicast Network Service Profile");
      }
      if (baseArgs["isClockMgmtSupported"] == "true" && eOnuResources.onuTemplates["onu-template"]) {
        computeFrequencySyncOutProfile(eOnuResources.onuTemplates, baseArgs["frequency-sync-out-profiles"]);
        validatePhaseSyncProfileId(eOnuResources.onuTemplates, baseArgs["phase-sync-profiles"]);
      }
      var nodeType = requestContext.get("nodeType");
      var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
      var ltBoardName = deviceTypeAndRelease.hwType.replace("LS-MF-", "");
      var isStatisIpHostSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_STATIC_IP_HOST_SUPPORTED, ltBoardName, false);
      if (isStatisIpHostSupported) {
          baseArgs["supportedStaticIPhost"] = true;
      }
      var isDNSForDHCPSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DNS_FOR_DHCP_IPHOST_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
      if(isDNSForDHCPSupported){
        baseArgs["supportedDNSForDHCP"] = true;
      }
      fwk.convertObjectToNetconfFwkFormat(eOnuResources.onuTemplates, inputSchema["onuTemplateSchema"], eOnuArgs);
      validateOnuTemplate(eOnuArgs["onu-template"], bestType, isVoipSupported, eOnuResources.sipAgentProfiles, eOnuResources.transportVoipSipProfiles);
      updateHighestProtocolVersion(eOnuResources.multicastProfiles);
      fwk.convertObjectToNetconfFwkFormat(eOnuResources.multicastProfiles, inputSchema["mcastProfileSchema"], eOnuArgs);
      getEonuHardwareComponetDetails(eOnuArgs);
      if (isVoipSupported) {
        apUtils.processVoipSipTcontsAndGemports(eOnuResources.onuTemplates["onu-template"], eOnuResources.transportVoipSipProfiles["transport-voip-sip"], eOnuResources.tcont["tcont-profile"], baseArgs["eonu_TrafficClassProfiles"]);
        apUtils.processTcontTransportVoipSip(eOnuResources.transportVoipSipProfiles["transport-voip-sip"], eOnuResources.tcont["tcont-profile"]);
        fwk.convertObjectToNetconfFwkFormat(eOnuResources.sipAgentProfiles, inputSchema["sipAgentProfileSchema"], eOnuArgs);
        fwk.convertObjectToNetconfFwkFormat(eOnuResources.sipSupplSvcsProfiles, inputSchema["sipSupplSvcsProfileSchema"], eOnuArgs);
        fwk.convertObjectToNetconfFwkFormat(eOnuResources.transportVoipSipProfiles, inputSchema["transportVoipSipProfileSchema"], eOnuArgs);
        updateEonuVoIPSIPDetails(eOnuArgs);
      }
      if (eOnuResources && eOnuResources.iphostConfigProfiles && eOnuResources.iphostConfigProfiles["ip-host-config"]) {
        baseArgs["supportIpHostConfigIOP"] = true;
        apUtils.processIpHostTcontsAndGemports(eOnuResources.onuTemplates["onu-template"], eOnuResources.iphostConfigProfiles["ip-host-config"], eOnuResources.tcont["tcont-profile"], baseArgs["eonu_TrafficClassProfiles"]);
        apUtils.processTcontTransportVoipSip(eOnuResources.iphostConfigProfiles["ip-host-config"], eOnuResources.tcont["tcont-profile"]);
        fwk.convertObjectToNetconfFwkFormat(eOnuResources.iphostConfigProfiles, inputSchema["iphostConfigProfileSchema"], eOnuArgs);
      }
      logger.debug("eOnuArgs : {}", apUtils.protectSensitiveDataLog(eOnuArgs));
      logger.debug("eOnuArgs[onu-template] : {}", apUtils.protectSensitiveDataLog(eOnuArgs['onu-template']));
      apUtils.getMergedObject(baseArgs, eOnuArgs);
      //Getting broadcast gem port object
      if (eOnuResources.gemPortIdAllocationProfiles && baseArgs["isClockMgmtSupported"] && baseArgs["isClockMgmtSupported"] == "true") {
        getBroadcastGemPortObject(baseArgs, eOnuResources.gemPortIdAllocationProfiles);
      }
  
      if (baseArgs["isTR383ModelSupported"]) {
        getClassAttribute(baseArgs);
      }
      if (bestType === intentConstants.FAMILY_TYPE_LS_MF_LWLT_C.concat("-21.9") || bestType === intentConstants.FAMILY_TYPE_LS_MF_LGLT_D.concat("-21.9") || apUtils.isMFSupportedLTFamilyTypeFor2112(bestType) || apUtils.isMFSupportedLTFamilyTypeFor223(bestType) || apUtils.isMFSupportedLTFamilyTypeFor226(bestType)) {
          getMulticastGemPortIdForTemplate(baseArgs, eOnuResources.gemPortIdAllocationProfiles);
      }
      var tcaConfigOntJSON= {};
      if (profilesJsonMap && profilesJsonMap["LS-ONT"]) {
        tcaConfigOntJSON["transceiver-tca-profiles"] = profilesJsonMap["LS-ONT"]["transceiver-tca-profiles"];
        tcaConfigOntJSON["transceiver-link-tca-profiles"] = profilesJsonMap["LS-ONT"]["transceiver-link-tca-profiles"];
        tcaConfigOntJSON["eth-frame-error-tca-profile"] = profilesJsonMap["LS-ONT"]["eth-frame-error-tca-profile"];
        tcaConfigOntJSON["eth-phy-error-tca-profile"] = profilesJsonMap["LS-ONT"]["eth-phy-error-tca-profile"];
        tcaConfigOntJSON["fec-error-tca-profile"] = profilesJsonMap["LS-ONT"]["fec-error-tca-profile"];
        tcaConfigOntJSON["tc-layer-error-tca-profile"] = profilesJsonMap["LS-ONT"]["tc-layer-error-tca-profile"];
        tcaConfigOntJSON["downstream-mic-error-tca-profile"] = profilesJsonMap["LS-ONT"]["downstream-mic-error-tca-profile"];
        tcaConfigOntJSON["call-control-failure-tca-profile"] = profilesJsonMap["LS-ONT"]["call-control-failure-tca-profile"];
        tcaConfigOntJSON["rtp-failure-tca-profile"] = profilesJsonMap["LS-ONT"]["rtp-failure-tca-profile"];
        tcaConfigOntJSON["gem-port-error-tca-profile"] = profilesJsonMap["LS-ONT"]["gem-port-error-tca-profile"];
        tcaConfigOntJSON["gem-frame-error-tca-profile"] = profilesJsonMap["LS-ONT"]["gem-frame-error-tca-profile"];
        tcaConfigOntJSON["eth-frame-error-extended-tca-profile"] = profilesJsonMap["LS-ONT"]["eth-frame-error-extended-tca-profile"];
      }
  
      if ((apUtils.isMFSupportedLTFamilyTypeFor223(bestType) || apUtils.isMFSupportedLTFamilyTypeFor226(bestType)) && tcaConfigOntJSON) {
        baseArgs["tcaProfileForOnuTemplates"] = xponUtils.getTcaProfileForOnuTemplates(baseArgs["onu-template"], tcaConfigOntJSON);
      }
      var isPoeSupported = requestContext.get("isPoeSupported");
      if (isPoeSupported) {
        var poeDetails = requestScope.get().get("poeDetails")
        if (poeDetails) {
          baseArgs["poeDetails"] = poeDetails;
        }
      }
      if(baseArgs["sip-agent-profile"]){
        var sipAgentArgs = baseArgs["sip-agent-profile"];
        var secondarySIPServer  = {};
        for (var key in sipAgentArgs) {
            var secProxyUriConfig = {};
            if(sipAgentArgs[key]["sec-proxy-uri-config"]){
                let temp = {"value":{}}
                secProxyUriConfig["sec-proxy-uri-config"] = temp;
                secProxyUriConfig["sec-proxy-uri-config"]["value"] = sipAgentArgs[key]["sec-proxy-uri-config"];
            }
            if(sipAgentArgs[key]["sec-outbound-proxy-uri-config"]){
                let temp = {"value":{}}
                secProxyUriConfig["sec-outbound-proxy-uri-config"] = temp;
                secProxyUriConfig["sec-outbound-proxy-uri-config"]["value"] = sipAgentArgs[key]["sec-outbound-proxy-uri-config"];
            }
            if(sipAgentArgs[key]["sec-registrar-uri-config"]){
                let temp = {"value":{}}
                secProxyUriConfig["sec-registrar-uri-config"] = temp;
                secProxyUriConfig["sec-registrar-uri-config"]["value"] = sipAgentArgs[key]["sec-registrar-uri-config"];
            }
            secondarySIPServer[key] = secProxyUriConfig;
        }
        if(secondarySIPServer){
            baseArgs["secondarySIPServer"] = secondarySIPServer;
        }
       }
      if (baseArgs["isTcaLinkProfileSupportedOnOnt"]) {
        var berTcaProfile = requestScope.get().get("berTcaProfileDetails");
        if (berTcaProfile) {
            for (var inx in berTcaProfile) {
                if (baseArgs["onu-template"][inx]["ber-tca-profile"]) {
                    baseArgs["onu-template"][inx]["ber-tca-profiles"] = berTcaProfile[inx];
                }
            }
        }
    }
  
      if(baseArgs["sip-agent-profile"]){
        var sipAgentArgs = baseArgs["sip-agent-profile"];
        var mediaForwardersConfig = {}
        for(var key in sipAgentArgs){
            var profileConfig = {};
            if(sipAgentArgs[key]["media-forwarders"] && sipAgentArgs[key]["media-forwarders"]["media-dscp-mark"]){
                let temp = {"value":{}}
                profileConfig["media-dscp-mark"] = temp;
                profileConfig["media-dscp-mark"]["value"] = sipAgentArgs[key]["media-forwarders"]["media-dscp-mark"];
            }
            mediaForwardersConfig[key] = profileConfig;
        }
  
        if(mediaForwardersConfig){
            baseArgs["mediaForwardersConfig"] = mediaForwardersConfig;
        }
      }
  
      if (baseArgs["transport-voip-sip"]) {
          var transPortVoipSipArgs = baseArgs["transport-voip-sip"];
          var ipConfigProfiles = {};
          for (var key in transPortVoipSipArgs) {
              var profileConfig = {};
              if (transPortVoipSipArgs[key]["iphost"] && transPortVoipSipArgs[key]["iphost"]["dhcp-dscp-mark"]) {
                  let temp = { value: {} };
                  profileConfig["dhcp-dscp-mark"] = temp;
                  profileConfig["dhcp-dscp-mark"]["value"] = transPortVoipSipArgs[key]["iphost"]["dhcp-dscp-mark"];
              }
              if (transPortVoipSipArgs[key]["iphost"] && transPortVoipSipArgs[key]["iphost"]["ipaddress-acquisition"]) {
                  let temp = { value: {} };
                  profileConfig["ipaddress-acquisition"] = temp;
                  profileConfig["ipaddress-acquisition"]["value"] = transPortVoipSipArgs[key]["iphost"]["ipaddress-acquisition"];
              }
              ipConfigProfiles[key] = profileConfig;
          }
          if (ipConfigProfiles) {
              baseArgs["ipConfigProfiles"] = ipConfigProfiles;
          }
      }
  
      var ethFrameErrorTcaProfileDetailsUS = requestScope.get().get("ethFrameErrorTcaProfileDetailsUS")
      if(ethFrameErrorTcaProfileDetailsUS){
          baseArgs["ethFrameErrorTcaProfileDetailsUS"] = ethFrameErrorTcaProfileDetailsUS;
      }
  
      var ethFrameErrorTcaProfileDetailsDS = requestScope.get().get("ethFrameErrorTcaProfileDetailsDS")
      if(ethFrameErrorTcaProfileDetailsDS){
          baseArgs["ethFrameErrorTcaProfileDetailsDS"] = ethFrameErrorTcaProfileDetailsDS;
      }
  
      var ethPhyErrorTcaProfileDetails = requestScope.get().get("ethPhyErrorTcaProfileDetails")
      if(ethPhyErrorTcaProfileDetails){
          baseArgs["ethPhyErrorTcaProfileDetails"] = ethPhyErrorTcaProfileDetails;
      }
  
      var fecErrProfile = requestScope.get().get("fecErrProfile")
      if(fecErrProfile){
          baseArgs["fecErrProfile"] = fecErrProfile;
      }
  
      var tcLayerErrProfile = requestScope.get().get("tcLayerErrProfile")
      if(tcLayerErrProfile){
          baseArgs["tcLayerErrProfile"] = tcLayerErrProfile;
      }
  
      var dwnMicErrProfile = requestScope.get().get("dwnMicErrProfile")
      if(dwnMicErrProfile){
          baseArgs["dwnMicErrProfile"] = dwnMicErrProfile;
      }
  
      var callControlFailureProfileDetails = requestScope.get().get("callControlFailureProfileDetails")
      if(callControlFailureProfileDetails){
        baseArgs["callControlFailureProfileDetails"] = callControlFailureProfileDetails;
      }
  
      var rtpFailureProfileDetails = requestScope.get().get("rtpFailureProfileDetails")
      if(rtpFailureProfileDetails){
        baseArgs["rtpFailureProfileDetails"] = rtpFailureProfileDetails;
      }
  
      var gemPortErrProfileDetails = requestScope.get().get("gemPortErrProfileDetails")
      if(gemPortErrProfileDetails){
          baseArgs["gemPortErrProfileDetails"] = gemPortErrProfileDetails;
      }      
  
  
          var isRfVideoSupported = requestContext.get("isRfVideoSupported");
          if (isRfVideoSupported && isRfVideoSupported == true) {
  
              var rfVideoAniDetails = requestScope.get().get("rfVideoAniDetails");
              logger.debug("rfVideoAniDetails get [{}]", JSON.stringify(rfVideoAniDetails));
              if (rfVideoAniDetails) {
                  baseArgs["rfVideoAniDetails"] = rfVideoAniDetails;
              }
  
              var rfVideoUniDetails = requestScope.get().get("rfVideoUniDetails");
              logger.debug("rfVideoUniDetails get [{}]", JSON.stringify(rfVideoUniDetails));
              if (rfVideoUniDetails) {
                  baseArgs["rfVideoUniDetails"] = rfVideoUniDetails;
              }
          }
  
      var isMocaSupported = requestContext.get("isMocaSupported");
      if (isMocaSupported) {
          var mocaDetails = requestScope.get().get("mocaDetails")
          //logger.debug("mocaDetails get [{}]", JSON.stringify(mocaDetails));
          if (mocaDetails) {
              baseArgs["mocaDetails"] = mocaDetails;
          }
      }
  
      var isTr069Supported = requestContext.get("isTr069Supported");
      if (isTr069Supported) {
          var tr069Details = requestScope.get().get("tr069Details")
          //logger.debug("tr069Details get [{}]", JSON.stringify(tr069Details));
          if (tr069Details) {
              baseArgs["tr069Details"] = tr069Details;
          }
      }
  
      var gemFrameErrTcaProfileFromOnuTemplate = requestScope.get().get("gemFrameErrTcaProfileFromOnuTemplate");
      if(gemFrameErrTcaProfileFromOnuTemplate){
          baseArgs["gemFrameErrTcaProfileFromOnuTemplate"] = gemFrameErrTcaProfileFromOnuTemplate;
      }
      
      var ethFrameErrorExtendedTcaProfileFromUniConfig = requestScope.get().get("ethFrameErrorExtendedTcaProfileFromUniConfig")
      if(ethFrameErrorExtendedTcaProfileFromUniConfig){
          baseArgs["ethFrameErrorExtendedTcaProfileFromUniConfig"] = ethFrameErrorExtendedTcaProfileFromUniConfig;
      }
      
      var pmCounterSizeFromUniConfig = requestScope.get().get("pmCounterSizeFromUniConfig")
      if(pmCounterSizeFromUniConfig){
          baseArgs["pmCounterSizeFromUniConfig"] = pmCounterSizeFromUniConfig;
      }    
  
      var ethernetMaxFrameSizeConfig = requestScope.get().get("ethernetMaxFrameSizeConfig")
      if(ethernetMaxFrameSizeConfig){
          baseArgs["ethernetMaxFrameSizeConfig"] = ethernetMaxFrameSizeConfig;
          logger.debug("ethernetMaxFrameSizeConfig: {}", JSON.stringify(ethernetMaxFrameSizeConfig));
      }
  
      var isOnuPowerSheddingSupported = requestContext.get("isOnuPowerSheddingSupported");
      if(isOnuPowerSheddingSupported) {
          var powerShedOverrides = requestContext.get("powerShedOverrides");
          if(powerShedOverrides) {
              baseArgs["powerShedOverrides"] = powerShedOverrides;
          }
          var powerShedRef = requestContext.get("powerShedRef");
          if(powerShedRef) {
            baseArgs["powerShedRef"] = powerShedRef;
          }
      }
  
      var templateArgsWithDiff = getTemplateArgsWithDiff(baseArgs, fwk, topology);
      getMcastInterfaceCount(templateArgsWithDiff);
      getMulticastSharedObject(templateArgsWithDiff, eOnuResources.gemPortIdAllocationProfiles, bestType);
      logger.debug("templateArgsWithDiff in configEonuTemplate: {}", apUtils.protectSensitiveDataLog(templateArgsWithDiff));
      baseArgs["templateArgsWithDiffOnLT"] = templateArgsWithDiff;
      if (templateArgsWithDiff["onu-template"]) {
          var processedOnuTemplate = getOnuTemplateString(templateArgsWithDiff, bestType);
          logger.debug("Processed Onu Template during Audit: {}", apUtils.protectSensitiveDataLog(processedOnuTemplate));
          baseArgs["onuTemplateString"] = processedOnuTemplate;
        }
    }
  
    function validatePhaseSyncProfileId(onuTemplates, phaseSyncProfiles) {
      var phaseSyncProfilesMap = {};
      if (phaseSyncProfiles) {
        for (var phaseSyncProfile in phaseSyncProfiles) {
          phaseSyncProfilesMap[phaseSyncProfiles[phaseSyncProfile]["name"]] = phaseSyncProfiles[phaseSyncProfile];
        }
      }
      for (var templateIndex in onuTemplates["onu-template"]) {
        var templateName = onuTemplates["onu-template"][templateIndex]["name"];
        var layout = onuTemplates["onu-template"][templateIndex]["layout"];
        var cards = layout["cards"];
        if (cards) {
          cards.forEach(function (card) {
            if (card["cardType"].startsWith("Ethernet")) {
              var ports = card["ports"];
              if (ports) {
                ports.forEach(function (port) {
                  if (port.hasOwnProperty("phase-sync-profile-id")) {
                    var profileid = port["phase-sync-profile-id"]
                    if (profileid.value !== "") {
                      var profileInJson = phaseSyncProfilesMap[profileid.value];
                      if (!profileInJson) {
                        throw new RuntimeException("Invalid phase-sync-profile-id provided at port " + port["portName"] + " in template " + templateName);
                      }
                    }
                  }
                });
              }
            }
          });
        }
      }
    }
  
    function computeFrequencySyncOutProfile(onuTemplates, freqSyncOutProfiles) {
      var freqSyncOutProfilesMap = {};
      if (freqSyncOutProfiles) {
        for (var freqSyncOutProfileName in freqSyncOutProfiles) {
          apUtils.formatStringAttributeToObject(freqSyncOutProfiles[freqSyncOutProfileName]["ssm-out"], "ssm-out-enabled");
          freqSyncOutProfilesMap[freqSyncOutProfiles[freqSyncOutProfileName]["name"]] = freqSyncOutProfiles[freqSyncOutProfileName];
        }
      }
      for (var templateIndex in onuTemplates["onu-template"]) {
        var templateName = onuTemplates["onu-template"][templateIndex]["name"];
        var layout = onuTemplates["onu-template"][templateIndex]["layout"];
        var cards = layout["cards"];
        if (cards) {
          var freqSyncOutProfileList = [];
          var vlanIdList = [];
          cards.forEach(function (card) {
            if (card["cardType"].startsWith("Ethernet")) {
              var ports = card["ports"];
              if (ports) {
                ports.forEach(function (port) {
                  if (port.hasOwnProperty("frequency-sync-out-profile-id")) {
                    var profileid = port["frequency-sync-out-profile-id"]
                    var canbeAdded = true;
                    freqSyncOutProfileList.forEach(function (profile) {
                      if ((profileid.value !== "" && profile.value === profileid.value)) {
                        canbeAdded = false;
                      }
                    });
                    if (canbeAdded && profileid.value !== "") {
                      var profileInJson = freqSyncOutProfilesMap[profileid.value];
                      if (profileInJson) {
                        vlanIdList.forEach(function (vlanId) {
                          if ((vlanId === profileInJson["ssm-out"]["ssm-out-vlan-id"])) {
                            canbeAdded = false;
                          }
                        });
                        if (canbeAdded) {
                          vlanIdList.push(profileInJson["ssm-out"]["ssm-out-vlan-id"]);
                          freqSyncOutProfileList.push(profileid);
                        }
                      } else {
                        throw new RuntimeException("Invalid frequency-sync-out-profile-id provided at port " + port["portName"] + " in template " + templateName);
                      }
                    }
                  }
                });
              }
            }
          });
          onuTemplates["onu-template"][templateIndex]["freqSyncOutProfileList"] = freqSyncOutProfileList;
        }
      }
    }
  
    function getOnuTemplateString(templateArgsWithDiff, bestType) {
      if (bestType === intentConstants.FAMILY_TYPE_LS_MF_LWLT_C.concat("-21.3")) {
        var onuTemplate = resourceProvider.getResource(internalResourcePrefix + "ls-mf-board-onu-template-21.3.xml.ftl");
      } else if (bestType === intentConstants.FAMILY_TYPE_LS_MF_LWLT_C.concat("-21.6")) {
        onuTemplate = resourceProvider.getResource(internalResourcePrefix + "ls-mf-board-onu-template-21.6.xml.ftl");
      } else if (apUtils.isMFSupportedLTFamilyTypeFor219(bestType)) {
        onuTemplate = resourceProvider.getResource(internalResourcePrefix + "ls-mf-board-onu-template-21.9.xml.ftl");
      } else if (apUtils.isMFSupportedLTFamilyTypeFor2112(bestType)) {
        onuTemplate = resourceProvider.getResource(internalResourcePrefix + "ls-mf-board-onu-template-21.12.xml.ftl");
      } else if(apUtils.isMFSupportedLTFamilyTypeFor223(bestType) || apUtils.isMFSupportedLTFamilyTypeFor226(bestType)){
        onuTemplate = resourceProvider.getResource(internalResourcePrefix + "ls-mf-board-onu-template.xml.ftl");    
      }
      else {
        throw new RuntimeException("Could not find suitable ls-mf-board-onu-template with device type " + bestType);
      }
      var processedTemplate = utilityService.processTemplate(onuTemplate, templateArgsWithDiff);
      var onusPath = "/nc:rpc/nc:edit-config/nc:config/device-manager:device-manager/adh:device/adh:device-specific-data/onu:onus";
      var processedOnuTemplate = utilityService.extractSubtree(processedTemplate, apUtils.prefixToNsMap, onusPath);
      processedOnuTemplate = DocumentUtils.documentToPrettyStringWithXslt(processedOnuTemplate);
      return processedOnuTemplate;
    }
  
    function getMcastInterfaceCount(templateArgsWithDiff) {
      var eONUTemplateMCInterfaceCountObject = {};
      var eONUTemplates = templateArgsWithDiff["onu-template"];
      for (var key in eONUTemplates) {
          if (eONUTemplates.hasOwnProperty(key)) {
              var templateValue = eONUTemplates[key];
              if (!templateValue.removed && templateValue["service"]) {
                  var serviceDetails = templateValue["service"];
                  var mcInterfaceCount = 0;
                  for (var service in serviceDetails) {
                      if (serviceDetails.hasOwnProperty(service)) {
                          var serviceDetailsValue = serviceDetails[service];
                          if (!serviceDetailsValue.removed && serviceDetailsValue["multicast"]) {
                              mcInterfaceCount = mcInterfaceCount + Object.keys(serviceDetailsValue["multicast"]).length;
                          }
                      }
                  }
                  eONUTemplateMCInterfaceCountObject[key] = mcInterfaceCount;
              }
          }
      }
      templateArgsWithDiff["eONUTemplateMCInterfaceCountObject"] = eONUTemplateMCInterfaceCountObject;
    }
  
    function getMulticastSharedObject(templateArgsWithDiff, gemPortIdAllocationProfiles, bestType) {
      var eONUTemplateMCSharedObject = {};
      var eONUTemplates = templateArgsWithDiff["onu-template"];
      var eONUTemplateMCInterfaceCountObject = templateArgsWithDiff["eONUTemplateMCInterfaceCountObject"];
      for (var key in eONUTemplates) {
          if (eONUTemplates.hasOwnProperty(key) && eONUTemplateMCInterfaceCountObject.hasOwnProperty(key)) {
              if (eONUTemplateMCInterfaceCountObject[key] > 0) {
                  var templateValue = eONUTemplates[key];
                  if (!templateValue.removed && templateValue["service"]) {
                      var serviceDetails = templateValue["service"];
                      var mcSharedObject = {};
                      mcSharedObject["multicast-channel"] = [];
                      for (var service in serviceDetails) {
                          if (serviceDetails.hasOwnProperty(service)) {
                              var serviceDetailsValue = serviceDetails[service];
                              if (!serviceDetailsValue.removed && serviceDetailsValue["multicast"]) {
                                  if (templateValue.hasOwnProperty("multicast-gem-port-id")) {
                                      var multicastGemPortValue = templateValue["multicast-gem-port-id"];
                                  } else {
                                      for (var multicastKey in serviceDetailsValue["multicast"]) {
                                          if (multicastKey != "changed" && serviceDetailsValue["multicast"][multicastKey]["name"]) {
                                              var multicast = serviceDetailsValue["multicast"][multicastKey];
                                              if (multicast.hasOwnProperty("multicast-gem-port-id")) {
                                                  var multicastGemPortValue = multicast["multicast-gem-port-id"];
                                              } else {
                                                  throw new RuntimeException("multicast-gem-port-id is not configured in "+templateValue["name"]+" on onu-template.json");
                                              }
                                              if (serviceDetailsValue["type"] != intentConstants.SERVICE_TYPE_TRANSPARENT_FORWARD) {
                                                  mcSharedObject["mcast-vlan-id"] = multicast["mcast-vlan-id"];
                                              }
                                              if (!apUtils.isMFSupportedLTFamilyTypeFor2112(bestType) && !apUtils.isMFSupportedLTFamilyTypeFor223(bestType) && !apUtils.isMFSupportedLTFamilyTypeFor226(bestType)) {
                                                  var serviceMulticastChannels = multicast["multicast-channel"];
                                                  if (serviceMulticastChannels) {
                                                      // When we are doing sync for the first time, the instance is an array and for the rest it is an object with key, value pairs
                                                      if (serviceMulticastChannels instanceof Array) {
                                                          serviceMulticastChannels.forEach(function (channel) {
                                                              if (mcSharedObject["multicast-channel"].indexOf(channel) == -1) {
                                                                  mcSharedObject["multicast-channel"].push(channel);
                                                              }
                                                          });
                                                      } else {
                                                          Object.keys(serviceMulticastChannels).forEach(function (channelKey) {
                                                              if (mcSharedObject["multicast-channel"].indexOf(serviceMulticastChannels[channelKey] == -1)) {
                                                                  mcSharedObject["multicast-channel"].push(serviceMulticastChannels[channelKey]);
                                                              }
                                                          });
                                                      }
                                                  }
                                                  mcSharedObject["unmatched-membership-report-processing-type"] = multicast["unmatched-membership-report-processing-type"];
                                                  mcSharedObject["multicast-profile"] = multicast["multicast-profile"];
                                                  mcSharedObject["isMulticastChannelAvailable"] = multicast["isMulticastChannelAvailable"];
                                                  mcSharedObject["max-group-number"] = multicast["max-group-number"];
                                                  mcSharedObject["multicast-rate-limit"] = multicast["multicast-rate-limit"];
                                              }
                                          }
                                      }
                                  }
                                  //If "multicast-gem-port-id" is "default" we will get the gem-port-id from gem-port-id-allocation.json file.
                                  //Otherwise, we will use gem-port-id in multicast configuration.
                                  if (isNaN(multicastGemPortValue) && gemPortIdAllocationProfiles && templateArgsWithDiff["ponTypeForLT"]) {
                                      mcSharedObject["multicast-gem-port-id"] = apUtils.getGemPortIdFromProfile(templateArgsWithDiff["ponTypeForLT"].value, multicastGemPortValue, gemPortIdAllocationProfiles["multicast-gem-port-id-allocation"])
                                  } else {
                                      mcSharedObject["multicast-gem-port-id"] = multicastGemPortValue;
                                  }
                                  mcSharedObject["serviceType"] = serviceDetailsValue["type"];
                                  eONUTemplateMCSharedObject[key] = mcSharedObject;
                              }
                          }
                      }
                  }
              }
          }
      }
      templateArgsWithDiff["eONUTemplateMCSharedObject"] = eONUTemplateMCSharedObject;
    }
  
    function getMulticastGemPortIdForTemplate(baseArgs, gemPortIdAllocationProfiles) {
      var eONUTemplateMulticastIdObject = {};
      var eONUTemplates = baseArgs["onu-template"];
      for (var key in eONUTemplates) {
          if (eONUTemplates.hasOwnProperty(key)) {
              var templateValue = eONUTemplates[key];
              if (templateValue["service"]) {
                  var serviceDetails = templateValue["service"];
                  var mcSharedObject = {};
                  for (var service in serviceDetails) {
                      if (serviceDetails.hasOwnProperty(service)) {
                          var serviceDetailsValue = serviceDetails[service];
                          if (serviceDetailsValue["multicast"]) {
                              if (templateValue.hasOwnProperty("multicast-gem-port-id")) {
                                var multicastGemPortValue = templateValue["multicast-gem-port-id"];
                              } else {
                                for (var multicastKey in serviceDetailsValue["multicast"]) {
                                  var multicast = serviceDetailsValue["multicast"][multicastKey];
                                  if (multicast.hasOwnProperty("multicast-gem-port-id")) {
                                    var multicastGemPortValue = multicast["multicast-gem-port-id"];
                                  } else {
                                    throw new RuntimeException("multicast-gem-port-id is not configured in "+templateValue["name"]+" on onu-template.json");
                                  }
                                  break;
                                }
                              }
                              //If "multicast-gem-port-id" is "default" we will get the gem-port-id from gem-port-id-allocation.json file.
                              //Otherwise, we will use gem-port-id in multicast configuration.
                              if (isNaN(multicastGemPortValue) && gemPortIdAllocationProfiles) {
                                  mcSharedObject["multicast-gem-port-id"] = { "value": apUtils.getGemPortIdFromProfile(baseArgs["ponTypeForLT"], multicastGemPortValue, gemPortIdAllocationProfiles["multicast-gem-port-id-allocation"]) };
                              } else {
                                  mcSharedObject["multicast-gem-port-id"] = { "value": multicastGemPortValue };
                              }
                              eONUTemplateMulticastIdObject[key] = mcSharedObject;
                          }
                      }
                  }
              }
          }
      }
      baseArgs["eONUTemplateMulticastIdObject"] = eONUTemplateMulticastIdObject;
    }
  
    function validateMcastInfraJSON(onuTemplates,multiCastInfraJson){
      var multicastTemplateMap = new HashMap();
      var serviceMap = null;
      var multicastInfraMap =new HashMap();
      onuTemplates.forEach(function(onuTemplate){
        var services = onuTemplate["service"];
        serviceMap = new HashMap();
        for (var serviceKey in services) {
            if (services.hasOwnProperty(serviceKey)) {
                var service = services[serviceKey];
                var multicastServiceNames = new ArrayList();
                if (service["multicast"] instanceof Array) {
                  service["multicast"].forEach(function(multicast){
                    if (multicast["multicast-infra-name"] != "") {
                        multicastServiceNames.add(multicast["name"]+"#"+multicast["multicast-infra-name"]);
                    }
                  });
                } else if(service["multicast"]) {
                  if (service["multicast"]["multicast-infra-name"] != "") {
                    multicastServiceNames.add(service["multicast"]["name"]+"#"+service["multicast"]["multicast-infra-name"]);
                  }
                }
                serviceMap.put(serviceKey,multicastServiceNames);
            }
        }
        multicastTemplateMap.put(onuTemplate["name"],serviceMap);
      });
      var mcastInfras = multiCastInfraJson["multicast-infra"];
      mcastInfras.forEach(function(multiCastInfra){
        if (multiCastInfra["unmatched-membership-report-processing"]["network-infra-structure"] != "") {
          multicastInfraMap.put(multiCastInfra["name"],multiCastInfra["unmatched-membership-report-processing"]["network-infra-structure"]);
        } else {
          throw RuntimeException("network-infra-structure should not be empty in mcast-infra.json");
        }
      });
      
      multicastTemplateMap.forEach(function(ontTemplateName,serviceMap){
        serviceMap.forEach(function(serviceName){
            var networkInfraNames = new ArrayList();
            var multicastServiceNames = new ArrayList();
            var multicastServiceNameWithInfra = serviceMap.get(serviceName);
            multicastServiceNameWithInfra.forEach(function(multicastServiceName){
                multicastServiceNames.add(multicastServiceName.split("#")[0]);
                var multicastInfraName = multicastServiceName.split("#")[1];
                var mcServiceName = multicastInfraMap.get(multicastInfraName);
                if (mcServiceName != null && networkInfraNames.indexOf(mcServiceName) === -1){
                    networkInfraNames.add(mcServiceName);
                };
            });
            multicastServiceNames.forEach(function(multicastServiceName){
              networkInfraNames.remove(multicastServiceName);
            });
            if (networkInfraNames.length > 0) {
                throw new RuntimeException("network-infra-structure attribute wrongly configured in multicast-infra.json");
            }
        });
      });
    }
  
    function getBroadcastGemPortObject(baseArgs, gemPortIdAllocationProfiles) {
      var eONUBroadcastGemPortIdAllocationObject = {};
      var eONUTemplates = baseArgs["onu-template"];
      var ponTypeForLT = baseArgs["ponTypeForLT"];
      for (var key in eONUTemplates) {
          if (eONUTemplates.hasOwnProperty(key)) {
              var templateValue = eONUTemplates[key];
              if (templateValue) {
                  var gemPortIdAllocation = {};
                  if (gemPortIdAllocationProfiles && templateValue["broadcast-gem-port-id"] && templateValue["broadcast-gem-port-id"] != "") {
                      gemPortIdAllocation["gem-port-id-for-lt"] = {"value": apUtils.getGemPortIdFromProfile(ponTypeForLT, templateValue["broadcast-gem-port-id"], gemPortIdAllocationProfiles["broadcast-gem-port-id-allocation"])};
                  }
                  eONUBroadcastGemPortIdAllocationObject[key] = gemPortIdAllocation;
              }
          }
      }
      baseArgs["eONUBroadcastGemPortIdAllocationObject"] = eONUBroadcastGemPortIdAllocationObject;
    }
  
    function getClassAttribute(baseArgs) {
      var eONUTemplates = baseArgs["onu-template"];
      if (eONUTemplates) {
          for (var templateIndex in baseArgs["onu-template"]) {
              var layout = baseArgs["onu-template"][templateIndex]["layout"];
              var cards = layout["cards"];
              if (cards) {
                 var cardConfigRequired = false;
                 var ethAndPortSpeedType = apUtils.gethEthAndPortSpeedType(cards);
                  for (var key in cards) {
                      if (cards.hasOwnProperty(key)) {
                          var card = cards[key];
                          var ports = card["ports"];
                          baseArgs["onu-template"][templateIndex]["layout"]["cards"][key]["virtualBoardNumber"] = card["virtual-board-number"];
                          if (ports) {
                              for (var k in ports) {
                                  if (ports.hasOwnProperty(k)) {
                                      var port = ports[k];
                                      var portType = port["portType"];
                                      var classAtr = apUtils.getClassFromPortTypeAndPortSpeed(port["portType"], port["portspeed"]["value"], port["portspeed-configurable"], card["virtual-board-number"], ethAndPortSpeedType);
                                      baseArgs["onu-template"][templateIndex]["layout"]["cards"][key]["ports"][k]["class"] = classAtr;
                                      if(!portType) {
                                        portType = apUtils.consturctPortTypeFromCardType(port["cardType"]);
                                        var classForConfigOverride= apUtils.getClassFromPortTypeAndPortSpeed(portType, port["portspeed"]["value"], port["portspeed-configurable"], card["virtual-board-number"], ethAndPortSpeedType);
                                        baseArgs["onu-template"][templateIndex]["layout"]["cards"][key]["ports"][k]["class-for-config-override"] = classForConfigOverride;
                                      }
                                      else {
                                        baseArgs["onu-template"][templateIndex]["layout"]["cards"][key]["ports"][k]["class-for-config-override"] = classAtr;
                                      }
                                      cardConfigRequired = apUtils.getCardConfigRequiredFromPortType(port["portType"], port["portspeed-configurable"]);
                                  }
                              }
                          }
                          baseArgs["onu-template"][templateIndex]["layout"]["cards"][key]["cardConfigRequired"] = cardConfigRequired;
                      }
                  }
                  for (var keyCard in cards) {
                      if (cards.hasOwnProperty(keyCard)) {
                          if (cards[keyCard]["cardType"] == "Ethernet" || cards[keyCard]["cardType"].startsWith("Ethernet-")) {
                              var isAutoDetectCardNoSupported = requestContext.get("isAutoDetectCardNoSupported");
                              if(isAutoDetectCardNoSupported)
                                cards[keyCard]["ethAndPortSpeedType"] = ethAndPortSpeedType;
                              if (ethAndPortSpeedType == 'multipleEthCardsWithSameSpeed') {
                                  baseArgs["onu-template"][templateIndex]["layout"]["cards"][keyCard]["cardConfigRequired"] = true;
                                  baseArgs["onu-template"][templateIndex]["layout"]["cards"][keyCard]["ethAndPortSpeedType"] = ethAndPortSpeedType;
                                } else if (ethAndPortSpeedType == 'multipleEthCardsWithDifferentSpeed') {
                                  baseArgs["onu-template"][templateIndex]["layout"]["cards"][keyCard]["ethAndPortSpeedType"] = ethAndPortSpeedType;
                              }
                          }
                      }
                  }
              }
          }
      }
  }
  
    function updateHighestProtocolVersion(multicastProfiles) {
      if(multicastProfiles && multicastProfiles["mcast-profile"]) {
        multicastProfiles["mcast-profile"].forEach(function (mcastObject) {
          var procolVersions = mcastObject["protocol-version"];
          var protoLatestVer = null;
          var highestProtocolVersion = null;
          procolVersions.forEach(function (protocolVersion) {
            if (!protoLatestVer) {
              protoLatestVer = Number(protocolVersion.split("-")[1]);
              highestProtocolVersion = protocolVersion;
            } else {
              var verNumCur = Number(protocolVersion.split("-")[1]);
              if (verNumCur > protoLatestVer) {
                protoLatestVer = verNumCur;
                highestProtocolVersion = protocolVersion;
              }
            }
          });
          mcastObject["highestProtocolVersion"] = highestProtocolVersion;
        });
      }
    }
    function getEonuHardwareComponetDetails(eOnuArgs) {
      eOnuArgs["onuCageName"] = "CAGE";
      eOnuArgs["ontChassisName"] = "CHASSIS";
      eOnuArgs["onuSfpPort"] = "ANIPORT";
      eOnuArgs["onuSfp"] = "SFP";
      eOnuArgs["aniInterfaceName"] = "ANI";
      eOnuArgs["onuCpuName"] = "CPU";
    }
    
    function loadCfmProfiles() {
      if (profilesJsonMap["LS-ONT"]) {
          var onuProfiles = profilesJsonMap["LS-ONT"];
          if (requestContext && requestContext.get("onuTemplates")) {
              var onuTemplates = requestContext.get("onuTemplates");
          } else {
              var onuTemplates = getOnuTemplatesFromProfileManager();
              requestContext.put("onuTemplates", onuTemplates);
          }
          var cfmProfiles = {};
          cfmProfiles["ma-association-profile"] = onuProfiles["ma-association-profile"];
          cfmProfiles["ma-domain-profile"] = onuProfiles["ma-domain-profile"];
          cfmProfiles["ma-endpoint-profile"] = onuProfiles["ma-endpoint-profile"];
          var cfmOntProfiles = {};
          cfmOntProfiles["cfm-profile"] = onuProfiles["cfm-profile"];
  
          validateCfmProfiles223(null, cfmProfiles, cfmOntProfiles);
          return { onuTemplates: onuTemplates, cfmOntProfiles: cfmOntProfiles, cfmProfiles: cfmProfiles };
      }
  }
  
    function loadEonuConfigResources(bestType, isVoipSupported) {
      if (profilesJsonMap["LS-ONT"]) {
        var onuProfiles = profilesJsonMap["LS-ONT"];
        var onuTemplates = getOnuTemplatesFromProfileManager();
  
        if (isVoipSupported) {
          var sipAgentProfiles = {};
          if (onuProfiles["sip-agent-profile"]) {
            var sipAgentProfilesString = onuProfiles["sip-agent-profile"];
            for (var profileIndex in sipAgentProfilesString) {
              if (sipAgentProfilesString[profileIndex]["dialplan-digitmap-profile"] && sipAgentProfilesString[profileIndex]["dialplan-digitmap-profile"]["digitmap"] && sipAgentProfilesString[profileIndex]["dialplan-digitmap-profile"]["digitmap"]["digit-map-pattern"]) {
                var digitMapPattern = sipAgentProfilesString[profileIndex]["dialplan-digitmap-profile"]["digitmap"]["digit-map-pattern"];
                var digitMapObject = {};
                if (Array.isArray(digitMapPattern)) {
                  for (var pattern in digitMapPattern) {
                    digitMapObject[digitMapPattern[pattern]] = { "value": digitMapPattern[pattern] };
                  }
                } else {
                  digitMapObject[digitMapPattern] = { "value": digitMapPattern };
                }
                sipAgentProfilesString[profileIndex]["dialplan-digitmap-profile"]["digitmap"]["digit-map-pattern"] = digitMapObject;
              }
            }
            sipAgentProfiles["sip-agent-profile"] = sipAgentProfilesString;
          }
    
          var transportVoipSip = {};
          transportVoipSip["transport-voip-sip"] = onuProfiles["transport-voip-sip"];
  
          var sipSupplSvcsProfiles = {};
          sipSupplSvcsProfiles["sip-suppl-services-profile"] = onuProfiles["sip-suppl-services-profile"];
  
          var iphostConfig = {};
          iphostConfig["ip-host-config"] = onuProfiles["ip-host-config"];
          validateSipAgentProfileJSON(sipAgentProfiles, sipSupplSvcsProfiles);
          validateTransportVoipSipJSON(transportVoipSip);
          if(iphostConfig && iphostConfig["ip-host-config"]) {
              validateIpHostConfigJSON(iphostConfig);
          }
        }
  
        var multicastProfiles = {};
        multicastProfiles["mcast-profile"] = profilesJsonMap["multicast-network-service-profile"];
  
        var gemPortIdAllocationProfiles = {};
        gemPortIdAllocationProfiles["broadcast-gem-port-id-allocation"] = onuProfiles["broadcast-gem-port-id-allocation"];
        gemPortIdAllocationProfiles["multicast-gem-port-id-allocation"] = onuProfiles["multicast-gem-port-id-allocation"];
  
        var multiCastInfraJson = {};
        multiCastInfraJson["multicast-infra"] = onuProfiles["multicast-infra"];
  
        var transportVoipSipProfiles = {};
        transportVoipSipProfiles["transport-voip-sip"] = onuProfiles["transport-voip-sip"];
  
        var iphostConfigProfiles = {};
        iphostConfigProfiles["ip-host-config"] = onuProfiles["ip-host-config"];
  
        var tcont = {};
        if (onuProfiles && onuProfiles["tcont-profile"]) {
          tcont["tcont-profile"] = apUtils.convertToTcontQueueSharingFromTcontSharingEnum(onuProfiles["tcont-profile"]);
        }
  
        var qosProfiles = {};
        if (onuProfiles["classifiers"]) {
            var onuClassifiersString = JSON.stringify(onuProfiles["classifiers"]);
            var replaceString = onuClassifiersString.replaceAll("bbf-qos-classifiers:", "bbf-qos-cls-mounted:");
            qosProfiles["classifiers"] = JSON.parse(replaceString);
        }
        qosProfiles["policies"] = onuProfiles["policies"];
        qosProfiles["qos-policy-profiles"] = onuProfiles["qos-policy-profiles"];
        qosProfiles["tc-id-2-queue-id-mapping-profile"] = onuProfiles["tc-id-2-queue-id-mapping-profile"];
        apUtils.processTcId2QueueIdMappingProfile(qosProfiles);
  
        if (onuTemplates) {
          if (onuTemplates["onu-template"] != null) {
              for (var templateIdx in onuTemplates["onu-template"]) {
                  var services = onuTemplates["onu-template"][templateIdx]["service"];
                  for (var serviceIdx in services) {
                      var service = services[serviceIdx];
                      if (service["tcont-config"] && (!service["tcont-config"][0]["traffic-class"] || service["tcont-config"][0]["traffic-class"] == "from-qos-profiles")) {
                          var subscriberIngressProfile = service["subscriber-ingress-qos-profile-id"];
                          var trafficClass = apUtils.getTrafficClass(subscriberIngressProfile, qosProfiles["qos-policy-profiles"], qosProfiles["classifiers"], qosProfiles["policies"], true);
                          for(var tcontIdx in service["tcont-config"]) {
                              service["tcont-config"][tcontIdx]["traffic-class"] = trafficClass[tcontIdx];
                          }
                      }
                      if (service.multicast && service.multicast.length > 0) {
                        for (var multicast of service["multicast"]) {
                            if(multicast["multicast-profile"] != null && multicast["multicast-profile"] !== ""){
                                if (!multicastProfiles["mcast-profile"].some(item => item.name === multicast["multicast-profile"])) {
                                  throw new RuntimeException("Multicast Profile '" + multicast["multicast-profile"] + "' referred in Multicast name '" + multicast["name"] + "' in service '" + service["name"] + "' of ONU Template '" + onuTemplates["onu-template"][templateIdx]["name"] + "' is not defined/associated in Multicast Network Service Profile/all");
                                }
                                for(var mcastProfile of multicastProfiles["mcast-profile"]){
                                    if(multicast["multicast-channel"] != null && mcastProfile["multicast-channel-groups"] != null && mcastProfile.name === multicast["multicast-profile"]){
                                        for(var channel of multicast["multicast-channel"]){
                                            if(mcastProfile["multicast-channel-groups"].every(channelInGroups => channelInGroups.name !== channel)){
                                                throw new RuntimeException("Channel '" + channel +"' in service '"+service["name"]+"' of ONU Template '"+onuTemplates["onu-template"][templateIdx]["name"]+"' doesn't exist in associated Multicast Network Service Profile '" + mcastProfile.name + "'");
                                            }
                                        }
                                    }
                                } 
                            }  
                        }
                      }
                  }
              }
          }
      }
      }    
      requestContext.put("onuTemplates", onuTemplates);
      requestContext.put("qosProfiles", qosProfiles);
      validateOnuTemplatesJSON(bestType, tcont);
      var cfmProfileResources = loadCfmProfiles();
      return {
        qosProfiles: qosProfiles,
        onuTemplates: onuTemplates,
        multicastProfiles: multicastProfiles,
        tcont: tcont,
        gemPortIdAllocationProfiles: gemPortIdAllocationProfiles,
        cfmProfiles: cfmProfileResources.cfmProfiles,
        cfmOntProfiles: cfmProfileResources.cfmOntProfiles,
        multiCastInfraJson: multiCastInfraJson,
        sipAgentProfiles: sipAgentProfiles,
        sipSupplSvcsProfiles: sipSupplSvcsProfiles,
        transportVoipSipProfiles: transportVoipSipProfiles,
        iphostConfigProfiles: iphostConfigProfiles
      };
    }
  
    function getOnuTemplatesFromProfileManager() {
      var onuTemplatesFromProfileManager = profilesJsonMap["LS-ONT"]["onu-template"];
      var ontHwLayout =  profilesJsonMap["ont-hw-layout"];
      var uniConfigurationProfile = profilesJsonMap["uni-configuration-profile"];
      var poeProfile = profilesJsonMap["poe-profiles"];
      var isPoeSupported = requestContext.get("isPoeSupported");
      var rfVideoProfile = profilesJsonMap["LS-ONT"]["rf-video-profile"];
      var isRfVideoSupported = requestContext.get("isRfVideoSupported");
      var mocaProfile = profilesJsonMap["LS-ONT"]["moca-uni-configuration-profile"];
      var isMocaSupported = requestContext.get("isMocaSupported");
      var tr069Profile = profilesJsonMap["LS-ONT"]["tr069-acs-server-profile"];
      var isTr069Supported = requestContext.get("isTr069Supported");
      var isOnuPowerSheddingSupported = requestContext.get("isOnuPowerSheddingSupported");
      var poeDetails ={};
  
      if (profilesJsonMap && profilesJsonMap["LS-ONT"]) {
          var ethFrameErrorTcaProfiles = profilesJsonMap["LS-ONT"]["eth-frame-error-tca-profile"];
          var ethPhyErrorTcaProfiles = profilesJsonMap["LS-ONT"]["eth-phy-error-tca-profile"];
          var callControlFailureProfiles = profilesJsonMap["LS-ONT"]["call-control-failure-tca-profile"];
          var rtpFailureProfiles = profilesJsonMap["LS-ONT"]["rtp-failure-tca-profile"];
          var ethFrameErrorExtendedTcaProfiles = profilesJsonMap["LS-ONT"]["eth-frame-error-extended-tca-profile"];
          var berTcaProfiles = profilesJsonMap["LS-ONT"]["ber-tca-profiles"];  
      }
      var ethFrameErrorTcaProfileDetailsUS = {};
      var ethFrameErrorTcaProfileDetailsDS = {};
      var ethPhyErrorTcaProfileDetails = {};
      var fecErrProfile = {};
      var tcLayerErrProfile = {};
      var dwnMicErrProfile = {};
      var rtpFailureProfileDetails = {};
      var callControlFailureProfileDetails = {};
      var gemFrameErrTcaProfileFromOnuTemplate = {};
      var ethFrameErrorExtendedTcaProfileFromUniConfig = {};
      var pmCounterSizeFromUniConfig = {};    
      var systemLoadProfiles = {};
      var memoryUsageProfiles = {};
      var rfVideoAniDetails = {};
      var rfVideoUniDetails = {};
      var mocaDetails = {};   
      var tr069Details = {};
      var powerSheddingProfiles = {};
      var berTcaProfileDetails = {};
      var ethernetMaxFrameSizeConfig = {};
      var powerShedOverrides = {};
      var powerShedRef = {};
  
      var isAutoDetectCardNoSupported = requestContext.get("isAutoDetectCardNoSupported");
      logger.info("isAutoDetectCardNoSupported is {}",isAutoDetectCardNoSupported);
      for (var inx in onuTemplatesFromProfileManager) {
          var foundVideoCard =false;
          if (berTcaProfiles && onuTemplatesFromProfileManager[inx]["ber-tca-profile"]) {
            var berTcaProfile = berTcaProfiles.filter(function (ber) {
                return (ber["name"] === onuTemplatesFromProfileManager[inx]["ber-tca-profile"]) ? ber : null;
            })[0];
            berTcaProfileDetails[onuTemplatesFromProfileManager[inx].name] = {};
            if (berTcaProfile) {
                berTcaProfileDetails[onuTemplatesFromProfileManager[inx].name][onuTemplatesFromProfileManager[inx]["ber-tca-profile"]] = berTcaProfile;
            }
          }
          var layoutDetail = ontHwLayout.filter(function(layout){
              return (layout["name"] === onuTemplatesFromProfileManager[inx]["layout"])?layout:null;
          })[0];
          if (layoutDetail && layoutDetail["hw-tca-profiles"] && layoutDetail["hw-tca-profiles"]["system-load-profile"]) {
            systemLoadProfiles[onuTemplatesFromProfileManager[inx].name] = layoutDetail["hw-tca-profiles"]["system-load-profile"];
          }
          if (layoutDetail && layoutDetail["hw-tca-profiles"] && layoutDetail["hw-tca-profiles"]["memory-usage-profile"]) {
            memoryUsageProfiles[onuTemplatesFromProfileManager[inx].name] = layoutDetail["hw-tca-profiles"]["memory-usage-profile"];
          }
          powerShedRef[onuTemplatesFromProfileManager[inx].name] = {};
          if (layoutDetail && layoutDetail["power-shedding-profile-id"]) {
            powerSheddingProfiles[onuTemplatesFromProfileManager[inx].name] = layoutDetail["power-shedding-profile-id"];
            powerShedRef[onuTemplatesFromProfileManager[inx].name]["power-shedding-profile-ref"] = {value: layoutDetail["power-shedding-profile-id"]};
          }
          if (layoutDetail && layoutDetail["backup-battery-monitoring"]) {
            powerShedRef[onuTemplatesFromProfileManager[inx].name]["backup-battery-monitoring"] = {value: layoutDetail["backup-battery-monitoring"]};
          }
          if(layoutDetail && layoutDetail["cards"]){
              var cards = layoutDetail["cards"];
              if(isAutoDetectCardNoSupported)
                layoutDetail["typemap"] = {};
              poeDetails[onuTemplatesFromProfileManager[inx].name] = {};
              ethFrameErrorTcaProfileDetailsUS[onuTemplatesFromProfileManager[inx].name] = {};
              ethFrameErrorTcaProfileDetailsDS[onuTemplatesFromProfileManager[inx].name] = {};
              ethPhyErrorTcaProfileDetails[onuTemplatesFromProfileManager[inx].name] = {};
              rtpFailureProfileDetails[onuTemplatesFromProfileManager[inx].name] = {};
              callControlFailureProfileDetails[onuTemplatesFromProfileManager[inx].name] = {};
              ethFrameErrorExtendedTcaProfileFromUniConfig[onuTemplatesFromProfileManager[inx].name] = {};
              pmCounterSizeFromUniConfig[onuTemplatesFromProfileManager[inx].name] = {};
              ethernetMaxFrameSizeConfig[onuTemplatesFromProfileManager[inx].name] = {};
              mocaDetails[onuTemplatesFromProfileManager[inx].name] = {}; 
              powerShedOverrides[onuTemplatesFromProfileManager[inx].name] = {};
              
              for (var inxCard in cards) {
                  if(isAutoDetectCardNoSupported) {
                    if (cards[inxCard]["cardType"]) {
                      var cardType = cards[inxCard]["cardType"];
                    }
                    if (layoutDetail["typemap"][cardType]) {
                      layoutDetail["typemap"][cardType]++;
                    } else {
                      layoutDetail["typemap"][cardType] = 1;
                    }
                    cards[inxCard]["cardNo_cardType"] = cards[inxCard]["cardNo"]+"_"+cards[inxCard]["cardType"];
                    var isAllPortSameSpeedOfCard = apUtils.isAllPortSameSpeed(cards[inxCard]);
                    cards[inxCard]["allPortSameSpeed"] = isAllPortSameSpeedOfCard;
                  }else{
                    cards[inxCard]["cardNo_cardType"] = cards[inxCard]["cardNo"]+"_"+cards[inxCard]["cardType"];
                    // Construct virtual-border-number, portType and port speed from new profile without these old info for old release devices
                    apUtils.fillOldAttributesOfCardFromNewProfile(cards[inxCard]);
                  }
  
                      var tpName = onuTemplatesFromProfileManager[inx].name;
                      if (isRfVideoSupported && isRfVideoSupported == true) {
  
                          logger.debug("[{}] card({}) [{}]", tpName, inxCard, JSON.stringify(cards[inxCard]["cardType"]));
  
                          if (cards[inxCard]["cardType"] && cards[inxCard]["cardType"] == "Video") {
                              logger.debug("[{}] found Video card ({})", tpName, inxCard);
                              foundVideoCard = true;
  
                              rfVideoUniDetails[tpName] = {};
                              logger.debug("rfVideoUniDetails A[{}]<- [_], ({}) [{}]", tpName, inxCard, JSON.stringify(rfVideoUniDetails));
                          }
                      }
  
                  var ports = cards[inxCard]["ports"];
                  for (var inxPort in ports) {
                          if (isRfVideoSupported && isRfVideoSupported == true) {
  
                              //checking portType ??? will be removed
                              if (cards[inxCard]["cardType"] && cards[inxCard]["cardType"] == "Video") {
  
                                  //var portId = cards[inxCard]["cardNo"] + "_" + ports[inxPort]["portNo"] + "_" + ports[inxPort]["portName"]
                                  var portId = ports[inxPort]["portName"];
  
                                  rfVideoUniDetails[tpName][portId] = {};
                                  logger.debug("rfVideoUniDetails B[{}][{}] <- [_], ({}) [{}]", tpName, portId, inxCard, JSON.stringify(rfVideoUniDetails));
  
                                  if (ports[inxPort]["service-timer"]) {
                                      rfVideoUniDetails[tpName][portId]["service-timer"] = ports[inxPort]["service-timer"];
  
                                      logger.debug("rfVideoUniDetails C[{}][{}] <- [service-timer], ({}) [{}]", tpName, portId, inxCard, JSON.stringify(rfVideoUniDetails));
                                  } else {
                                      rfVideoUniDetails[tpName][portId]["service-timer"] = "undefined";
  
                                      logger.debug("rfVideoUniDetails [{}][{}] no service-timer found, set undefined ({}) [{}]", tpName, portId, inxCard, JSON.stringify(rfVideoUniDetails));
                                  }
                              }
                          }
  
                          if (isMocaSupported && isMocaSupported == true) { 
                            if (cards[inxCard]["cardType"] && cards[inxCard]["cardType"] == "MoCA") {
  
                                    var portId = ports[inxPort]["portName"];
                                    var mocatpName = onuTemplatesFromProfileManager[inx].name;
                                    logger.error("mocaUniDetails B[{}][{}] <- [_], ({}) [{}]", mocatpName, portId, inxCard, JSON.stringify(ports[inxPort]["moca-uni-configuration-profile-id"]));
                                    
                                    if(typeof mocaProfile === 'undefined' || mocaProfile === null){
                                      throw new RuntimeException(ports[inxPort].portName  + " not associated moca-uni-configuration-profile");
                                    }  
  
                                    var mocaDetail = mocaProfile.filter(function (unimocaConfig) {
                                      return (unimocaConfig["name"] === ports[inxPort]["moca-uni-configuration-profile-id"]) ? unimocaConfig : null;
                                  });
  
                                  if(apUtils.ifObjectIsEmpty(mocaDetail)){
                                      throw new RuntimeException(ports[inxPort].portName  + " not associated moca-uni-configuration-profile");
                                   } 
                                     
                                    if (ports[inxPort]["moca-uni-configuration-profile-id"]) {
                                        layoutDetail["cards"][inxCard]["ports"][inxPort]["uniConfigurationDetail"] = mocaDetail[0];
                                    if (mocaDetail && mocaDetail.length > 0) {
                                          var mocaportId = ports[inxPort].portName;
                                              mocaDetails[mocatpName][mocaportId] = {};
                                               if(mocaDetail[0]["password"]){
                                                mocaDetails[mocatpName][mocaportId]["password"] = mocaDetail[0]["password"];
                                               }                                       
                                              if(mocaDetail[0]["privacy-enabled"]){
                                                mocaDetails[mocatpName][mocaportId]["privacy-enabled"] = mocaDetail[0]["privacy-enabled"];
                                              }else{
                                                mocaDetails[mocatpName][mocaportId]["privacy-enabled"] = "deactivated";
                                              }
      
                                              if(mocaDetail[0]["min-bw-alarm-threshold"] == null || mocaDetail[0]["min-bw-alarm-threshold"] == "" || mocaDetail[0]["min-bw-alarm-threshold"] == "disabled" ){
                                                  mocaDetails[mocatpName][mocaportId]["min-bw-alarm-threshold"] = "180";
                                              }else{
                                                  mocaDetails[mocatpName][mocaportId]["min-bw-alarm-threshold"] = mocaDetail[0]["min-bw-alarm-threshold"];
                                              }
      
                                              if(mocaDetail[0]["max-frame-size"]){
                                                  mocaDetails[mocatpName][mocaportId]["max-frame-size"] = mocaDetail[0]["max-frame-size"];
                                              }else{
                                                  mocaDetails[mocatpName][mocaportId]["max-frame-size"] = "system-default";
                                              }
                                              if(mocaDetail[0]["moca-service"] == "moca-home"){
                                                  mocaDetails[mocatpName][mocaportId]["mode"] = mocaDetail[0]["moca-service"];
                                                  if(mocaDetail[0]["target-transmit-power"]){
                                                      mocaDetails[mocatpName][mocaportId]["target-transmit-power"] = mocaDetail[0]["target-transmit-power"];
                                                  }else{
                                                      mocaDetails[mocatpName][mocaportId]["target-transmit-power"] = "-14";
                                                  }
      
                                                  if(mocaDetail[0]["network-coordinator-control"]){
                                                      mocaDetails[mocatpName][mocaportId]["network-coordinator-control"] = mocaDetail[0]["network-coordinator-control"];
                                                  }else{
                                                      mocaDetails[mocatpName][mocaportId]["network-coordinator-control"] = "negotiate";
                                                  }
                                                  
                                                  if(mocaDetail[0]["snr-margin"]){
                                                      mocaDetails[mocatpName][mocaportId]["snr-margin"] = mocaDetail[0]["snr-margin"];
                                                  }else{
                                                      mocaDetails[mocatpName][mocaportId]["snr-margin"] = "2";
                                                  }
                                                  
                                                  if(mocaDetail[0]["automatic-power-control"]){
                                                      mocaDetails[mocatpName][mocaportId]["automatic-power-control"] = mocaDetail[0]["automatic-power-control"]; 
                                                  }else{
                                                      mocaDetails[mocatpName][mocaportId]["automatic-power-control"] = "enabled";
                                                  }     
                                              }
                                              if(mocaDetail[0]["moca-service"] == "moca-access"){
                                                  mocaDetails[mocatpName][mocaportId]["mode"] = mocaDetail[0]["moca-service"];
      
                                                  if(mocaDetail[0]["moca-access-far-end-node-mac-address"]){
                                                    mocaDetails[mocatpName][mocaportId]["moca-access-far-end-node-mac-address"] = mocaDetail[0]["moca-access-far-end-node-mac-address"];
                                                  }else{
                                                    mocaDetails[mocatpName][mocaportId]["moca-access-far-end-node-mac-address"] = "00:00:00:00:00:00";
                                                  }
                                                  
                                                  if(mocaDetail[0]["moca-access-ds-rate"]){
                                                    mocaDetails[mocatpName][mocaportId]["moca-access-ds-rate"] = mocaDetail[0]["moca-access-ds-rate"];
                                                  }else{
                                                    mocaDetails[mocatpName][mocaportId]["moca-access-ds-rate"] = "1";
                                                  }
                                                  
                                                  if( mocaDetail[0]["moca-access-us-rate"]){
                                                    mocaDetails[mocatpName][mocaportId]["moca-access-us-rate"] = mocaDetail[0]["moca-access-us-rate"];
                                                  }else{
                                                    mocaDetails[mocatpName][mocaportId]["moca-access-us-rate"] = "1";
                                                  }
                                                  
                                              }
                                              if (mocaDetail[0]["forwarding"] && mocaDetail[0]["forwarding"]["gemport-sharing"]) {
                                                ports[inxPort]["gemport-sharing"] = mocaDetail[0]["forwarding"]["gemport-sharing"];
                                            }
                                          }
                                    } 
                                }
                            }
    
                            if(isOnuPowerSheddingSupported) {
                              if(ports[inxPort]["power-shed-override"]) {
                                  powerShedOverrides[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName] = {value: ports[inxPort]["power-shed-override"]};             
                              }
                          }
    
  
  
  
  //debugRfVideo("uniConfigurationProfile [{}]", uniConfigurationProfile);
                      var uniConfigurationDetail = uniConfigurationProfile.filter(function (uniConfig) {
                          return (uniConfig["name"] === ports[inxPort]["uni-configuration-profile-id"]) ? uniConfig : null;
                      })[0];
                      if (uniConfigurationDetail) {
                          layoutDetail["cards"][inxCard]["ports"][inxPort]["uniConfigurationDetail"] = uniConfigurationDetail;
                          if (uniConfigurationDetail["cfm"]) {
                              ports[inxPort]["cfm"] = JSON.parse(JSON.stringify(uniConfigurationDetail["cfm"]));
                          }
                          if (uniConfigurationDetail["clock"] && uniConfigurationDetail["clock"]["ssm-out"]) {
                              ports[inxPort]["ssm-out"] = uniConfigurationDetail["clock"]["ssm-out"];
                          }
                          if (uniConfigurationDetail["clock"] && uniConfigurationDetail["clock"]["frequency-sync-out-profile-id"]) {
                              ports[inxPort]["frequency-sync-out-profile-id"] = uniConfigurationDetail["clock"]["frequency-sync-out-profile-id"];
                          }
                          if (uniConfigurationDetail["clock"] && uniConfigurationDetail["clock"]["phase-sync-profile-id"]) {
                              ports[inxPort]["phase-sync-profile-id"] = uniConfigurationDetail["clock"]["phase-sync-profile-id"];
                          }
                          if (uniConfigurationDetail["dot1x"] && uniConfigurationDetail["dot1x"]["dot1x-authentication"]) {
                              ports[inxPort]["dot1x-authentication"] = uniConfigurationDetail["dot1x"]["dot1x-authentication"];
                          }
                          if (uniConfigurationDetail["forwarding"] && uniConfigurationDetail["forwarding"]["gemport-sharing"]) {
                              ports[inxPort]["gemport-sharing"] = uniConfigurationDetail["forwarding"]["gemport-sharing"];
                          } 
                          if (uniConfigurationDetail["fec"] && uniConfigurationDetail["fec"]["fec"] && uniConfigurationDetail["fec"]["fec"] !== "") {
                             if (ports[inxPort]["portspeed"] && ports[inxPort]["portspeed"] != "eth-if-speed-25gb") {
                                throw new RuntimeException("FEC configuration is not supported for other than 25G speed");
                             }
                            ports[inxPort]["fec"] = uniConfigurationDetail["fec"]["fec"];
                          }               
                          if (uniConfigurationDetail["poe"] && uniConfigurationDetail["poe"]["poe-profile-id"] && isPoeSupported && isPoeSupported == true) {
                             var poeDetail = poeProfile.filter(function (poe) {
                                return (poe["name"] === uniConfigurationDetail["poe"]["poe-profile-id"]) ? poe : null;
                             })
                             if (poeDetail && poeDetail.length > 0){
                                poeDetails[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName] = poeDetail[0];
                             }                       
                          }
                          if (ethFrameErrorTcaProfiles && uniConfigurationDetail["pm-tca-profiles"] && uniConfigurationDetail["pm-tca-profiles"]["us-eth-frame-err-profile"]) {
                             var ethFrameErrorTcaProfileDetail = ethFrameErrorTcaProfiles.filter(function (ethFrameErrorTcaProfile) {
                                return (ethFrameErrorTcaProfile["name"] === uniConfigurationDetail["pm-tca-profiles"]["us-eth-frame-err-profile"]) ? ethFrameErrorTcaProfile : null;
                             })
                            if(ethFrameErrorTcaProfileDetail && ethFrameErrorTcaProfileDetail.length > 0){
                                ethFrameErrorTcaProfileDetailsUS[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName] = ethFrameErrorTcaProfileDetail[0];
                             }
                          }
  
                          if (ethFrameErrorTcaProfiles && uniConfigurationDetail["pm-tca-profiles"] && uniConfigurationDetail["pm-tca-profiles"]["ds-eth-frame-err-profile"]) {
                             var ethFrameErrorTcaProfileDetail = ethFrameErrorTcaProfiles.filter(function (ethFrameErrorTcaProfile) {
                                return (ethFrameErrorTcaProfile["name"] === uniConfigurationDetail["pm-tca-profiles"]["ds-eth-frame-err-profile"]) ? ethFrameErrorTcaProfile : null;
                             })
                            if(ethFrameErrorTcaProfileDetail && ethFrameErrorTcaProfileDetail.length > 0){
                                ethFrameErrorTcaProfileDetailsDS[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName] = ethFrameErrorTcaProfileDetail[0];
                             }
                          }
  
                          if (ethPhyErrorTcaProfiles && uniConfigurationDetail["pm-tca-profiles"] && uniConfigurationDetail["pm-tca-profiles"]["eth-phy-layer-err-profile"]) {
                             var ethPhyErrorTcaProfileDetail = ethPhyErrorTcaProfiles.filter(function (ethPhyErrorTcaProfile) {
                                return (ethPhyErrorTcaProfile["name"] === uniConfigurationDetail["pm-tca-profiles"]["eth-phy-layer-err-profile"]) ? ethPhyErrorTcaProfile : null;
                             })
                            if(ethPhyErrorTcaProfileDetail && ethPhyErrorTcaProfileDetail.length > 0){
                                ethPhyErrorTcaProfileDetails[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName] = ethPhyErrorTcaProfileDetail[0];
                             }
                          }
  
                        if (rtpFailureProfiles && uniConfigurationDetail["pm-tca-profiles"] && uniConfigurationDetail["pm-tca-profiles"]["rtp-failure-profile"]) {
                          var rtpFailureProfileDetail = rtpFailureProfiles.filter(function (rtpFailureProfile) {
                              return (rtpFailureProfile["name"] === uniConfigurationDetail["pm-tca-profiles"]["rtp-failure-profile"]) ? rtpFailureProfile : null;
                          })
                          if(rtpFailureProfileDetail && rtpFailureProfileDetail.length > 0){
                              rtpFailureProfileDetails[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName] = rtpFailureProfileDetail[0];
                          }
                        }
  
                        if (callControlFailureProfiles && uniConfigurationDetail["pm-tca-profiles"] && uniConfigurationDetail["pm-tca-profiles"]["call-control-failure-profile"]) {
                          var callControlFailureProfileDetail = callControlFailureProfiles.filter(function (callControlFailureProfile) {
                              return (callControlFailureProfile["name"] === uniConfigurationDetail["pm-tca-profiles"]["call-control-failure-profile"]) ? callControlFailureProfile : null;
                          })
                          if(callControlFailureProfileDetail && callControlFailureProfileDetail.length > 0){
                              callControlFailureProfileDetails[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName] = callControlFailureProfileDetail[0];
                          }
                        }
  
                          
                        if (cards[inxCard]["cardType"] && cards[inxCard]["cardType"] == "VEIP") {
                             var tr069Section = "tr069-asc-server";
                             var tr069ProfileId = "tr069-acs-server-id";
  
                             //logger.debug("uniConfigurationDetail ({}-{}-{}) [{}]", inx, inxCard, inxPort, JSON.stringify(uniConfigurationDetail));
  
                             if (isTr069Supported && isTr069Supported == true) {
                                if (uniConfigurationDetail[tr069Section] && uniConfigurationDetail[tr069Section][tr069ProfileId]) {
                                   var tr069Detail = tr069Profile.filter(function (tr069pf) {
                                      //logger.debug("tr069pf [{}] [{}]", JSON.stringify(tr069pf), uniConfigurationDetail[tr069Section][tr069ProfileId]);
                                      return (tr069pf["name"] === uniConfigurationDetail[tr069Section][tr069ProfileId]) ? tr069pf : null;
                                   });
                                     if (tr069Detail && tr069Detail.length > 0) {
                                      var tempName = onuTemplatesFromProfileManager[inx].name;
                                      if (tr069Details[tempName]) {
                                         //logger.debug("tr069Details[{}] already exist [{}]", tempName, JSON.stringify(tr069Details[tempName]));
                                      } else {
                                         tr069Details[tempName] = {};
                                         tr069Details[tempName]["portName"] = ports[inxPort].portName;
                                         tr069Details[tempName]["admin-state"] = tr069Detail[0]["admin-state"];
                                         tr069Details[tempName]["vlan-id"] = tr069Detail[0]["vlan-id"];
                                         tr069Details[tempName]["pbit"] = tr069Detail[0]["pbit"];
                                         tr069Details[tempName]["dei"] = tr069Detail[0]["dei"];
                                         tr069Details[tempName]["uri"] = tr069Detail[0]["uri"];
                                         if (tr069Detail[0]["authentication"]) {
                                            tr069Details[tempName]["validation-scheme"] = tr069Detail[0]["authentication"]["validation-scheme"];
                                            tr069Details[tempName]["realm"] = tr069Detail[0]["authentication"]["realm"];
                                            tr069Details[tempName]["user-name"] = tr069Detail[0]["authentication"]["user-name"];
                                            tr069Details[tempName]["password"] = tr069Detail[0]["authentication"]["password"];
                                         }
                                      }
                                   }
                                }
                             }
                          }
  
  
  
                        if (ethFrameErrorExtendedTcaProfiles && uniConfigurationDetail["pm-tca-profiles"] && uniConfigurationDetail["pm-tca-profiles"]["eth-frame-err-extended-tca-profile"]) {
                            var ethFrameErrorExtendedTcaProf = ethFrameErrorExtendedTcaProfiles.filter(function (ethFrameErrorExtendedTcaProfile) {
                                return (ethFrameErrorExtendedTcaProfile["name"] === uniConfigurationDetail["pm-tca-profiles"]["eth-frame-err-extended-tca-profile"]) ? ethFrameErrorExtendedTcaProfile : null;
                            })
                            if(ethFrameErrorExtendedTcaProf && ethFrameErrorExtendedTcaProf.length > 0){
                                ethFrameErrorExtendedTcaProfileFromUniConfig[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName] = ethFrameErrorExtendedTcaProf[0];
                            }
                        }
                          
                        if(uniConfigurationDetail["pm-tca-profiles"] && uniConfigurationDetail["pm-tca-profiles"]["pm-counter-size"]) {
                            pmCounterSizeFromUniConfig[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName] = {};
                            pmCounterSizeFromUniConfig[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName].name = uniConfigurationDetail["pm-tca-profiles"]["pm-counter-size"];
                        }
  
                        if (uniConfigurationDetail["fec"] && uniConfigurationDetail["fec"]["max-frame-size"]) {
                          ethernetMaxFrameSizeConfig[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName] = {};
                          ethernetMaxFrameSizeConfig[onuTemplatesFromProfileManager[inx].name][ports[inxPort].portName].size = uniConfigurationDetail["fec"]["max-frame-size"];
                        }                        
                       }
                  }
              }
              onuTemplatesFromProfileManager[inx]["layout"] = JSON.parse(JSON.stringify(layoutDetail));
  
              if (isRfVideoSupported && isRfVideoSupported == true) {
                if (foundVideoCard) {
                    var tagRfVideoProfileName = "";
                    var otpm = onuTemplatesFromProfileManager[inx];
                    var tempName = otpm.name;
                    /*
                    if (otpm["layout"] && otpm["layout"]["video-profiles"] && otpm["layout"]["video-profiles"]["rf-video-profile"]) {
                        tagRfVideoProfileName = otpm["layout"]["video-profiles"]["rf-video-profile"];
                    }
                    debugRfVideo("tagRfVideoProfileName [{}]-[{}] [{}]", tempName, tagRfVideoProfileName, JSON.stringify(onuTemplatesFromProfileManager[inx]));
                    */
                    if (otpm && otpm["video-profiles"] && otpm["video-profiles"]["rf-video-profile"]) {
                        tagRfVideoProfileName = otpm["video-profiles"]["rf-video-profile"];
                          }
                          logger.debug("tagRfVideoProfileName [{}]-[{}] [{}]", tempName, tagRfVideoProfileName, JSON.stringify(layoutDetail));
  
                          var data = {};
                          var count = 0;
  
                        if ("" != tagRfVideoProfileName) {
                          if (!rfVideoProfile) {
                            logger.error("[{}] rfVideoProfile null, checking Associations", tpName);
                            throw new RuntimeException("No any RF Video Profile found, please check it.")
                           } 
  
                            var tagRfVideoProfiles = rfVideoProfile.filter(function (pf) {
                                logger.error("pf [{}] rfVideoProfile[{}] ", JSON.stringify(pf),pf["name"]);
                                return (pf["name"] === tagRfVideoProfileName) ? pf : null;
                            });
                            if (tagRfVideoProfiles && tagRfVideoProfiles.length > 0) {
                                logger.debug("tagRfVideoProfiles [{}]", JSON.stringify(tagRfVideoProfiles[0]));
                                var items = [
                                    //"pilot-frequency",
                                    "agc-mode",
                                    "agc-offset",
                                    "lower-optical-threshold",
                                    "upper-optical-threshold"
                                ];
                                for (var i = 0; i < items.length; i++) {
                                    var value = tagRfVideoProfiles[0][items[i]];
                                    if (value) {
                                        data[items[i]] = value;
                                        count++;
                                    }
                                }
                            } else {
                                logger.error("[{}] tag rf-video-profile not found or not Associations", tpName);
                                throw new RuntimeException("RF Video Profile of  " + tpName +"  is not found or not associations, please check it.")
                            }
                        } else {
                            logger.error("[{}] no rf-video-profile found", tpName);
                        }
  
                    data["count"] = count;
                    rfVideoAniDetails[tempName] = data;
  
                }
            } 
  
              if (onuTemplatesFromProfileManager[inx]["pm-tca-profiles"] && onuTemplatesFromProfileManager[inx]["pm-tca-profiles"]["fec-err-profile"]) {
                  fecErrProfile[onuTemplatesFromProfileManager[inx].name] = {};
                  fecErrProfile[onuTemplatesFromProfileManager[inx].name].name = onuTemplatesFromProfileManager[inx]["pm-tca-profiles"]["fec-err-profile"];
              }
  
              if (onuTemplatesFromProfileManager[inx]["pm-tca-profiles"] && onuTemplatesFromProfileManager[inx]["pm-tca-profiles"]["tc-layer-err-profile"]) {
                  tcLayerErrProfile[onuTemplatesFromProfileManager[inx].name] = {};
                  tcLayerErrProfile[onuTemplatesFromProfileManager[inx].name].name = onuTemplatesFromProfileManager[inx]["pm-tca-profiles"]["tc-layer-err-profile"];
              }
  
              if (onuTemplatesFromProfileManager[inx]["pm-tca-profiles"] && onuTemplatesFromProfileManager[inx]["pm-tca-profiles"]["downstream-mic-err-profile"]) {
                  dwnMicErrProfile[onuTemplatesFromProfileManager[inx].name] = {};
                  dwnMicErrProfile[onuTemplatesFromProfileManager[inx].name].name = onuTemplatesFromProfileManager[inx]["pm-tca-profiles"]["downstream-mic-err-profile"];
              }
  
              if (onuTemplatesFromProfileManager[inx]["pm-tca-profiles"] && onuTemplatesFromProfileManager[inx]["pm-tca-profiles"]["gem-frame-err-tca-profile"]) {
                gemFrameErrTcaProfileFromOnuTemplate[onuTemplatesFromProfileManager[inx].name] = {};
                gemFrameErrTcaProfileFromOnuTemplate[onuTemplatesFromProfileManager[inx].name].name = onuTemplatesFromProfileManager[inx]["pm-tca-profiles"]["gem-frame-err-tca-profile"];
              }
              if (onuTemplatesFromProfileManager[inx]["ip-host-config"] == null ||
                (onuTemplatesFromProfileManager[inx]["ip-host-config"] && (JSON.stringify(onuTemplatesFromProfileManager[inx]["ip-host-config"]) == "null" 
                ||  JSON.stringify(onuTemplatesFromProfileManager[inx]["ip-host-config"]) == null || Object.keys(onuTemplatesFromProfileManager[inx]["ip-host-config"]).length == 0) 
              )) {
                  delete onuTemplatesFromProfileManager[inx]["ip-host-config"];
              }    
          }else{
            throw new RuntimeException("Hardware layout '" + onuTemplatesFromProfileManager[inx]["layout"] + "' in ONU template '" + onuTemplatesFromProfileManager[inx]["name"] + "' is not associated with this intent");
        }
      }
      var onuTemplates = {};
      onuTemplates["onu-template"] = onuTemplatesFromProfileManager;
      if(poeDetails){
        requestScope.get().put("poeDetails",poeDetails);
      }
      if(ethFrameErrorTcaProfileDetailsUS){
        requestScope.get().put("ethFrameErrorTcaProfileDetailsUS",ethFrameErrorTcaProfileDetailsUS);
      }
      if(ethFrameErrorTcaProfileDetailsDS){
        requestScope.get().put("ethFrameErrorTcaProfileDetailsDS",ethFrameErrorTcaProfileDetailsDS);
      }
      if(ethPhyErrorTcaProfileDetails){
        requestScope.get().put("ethPhyErrorTcaProfileDetails",ethPhyErrorTcaProfileDetails);
      }
  
      if(fecErrProfile) {
        requestScope.get().put("fecErrProfile", fecErrProfile);
      }
      if(tcLayerErrProfile) {
        requestScope.get().put("tcLayerErrProfile", tcLayerErrProfile);
      }
      if(dwnMicErrProfile) {
        requestScope.get().put("dwnMicErrProfile", dwnMicErrProfile);
      }
      if(callControlFailureProfileDetails){
        requestScope.get().put("callControlFailureProfileDetails",callControlFailureProfileDetails);
      }
      if(rtpFailureProfileDetails){
        requestScope.get().put("rtpFailureProfileDetails",rtpFailureProfileDetails);
      }    
  
          if (isRfVideoSupported && isRfVideoSupported == true) {
  
              if (rfVideoAniDetails) {
                  logger.debug("rfVideoAniDetails put [{}]", JSON.stringify(rfVideoAniDetails));
                  requestScope.get().put("rfVideoAniDetails", rfVideoAniDetails);
              } else {
                  logger.debug("rfVideoAniDetails put none");
              }
  
              if (rfVideoUniDetails) {
                  logger.debug("rfVideoUniDetails put [{}]", JSON.stringify(rfVideoUniDetails));
                  requestScope.get().put("rfVideoUniDetails", rfVideoUniDetails);
              } else {
                  logger.debug("rfVideoUniDetails put none");
              }
          }
  
      if (mocaDetails) {
            logger.error("mocaDetails  ssssssss put [{}]", JSON.stringify(mocaDetails));
            requestScope.get().put("mocaDetails", mocaDetails);
      } else {
            logger.error("mocaDetails put none");
      }
      
      if (tr069Details) {
        //logger.debug("tr069Details put [{}]", JSON.stringify(tr069Details));
        requestScope.get().put("tr069Details", tr069Details);
      } else {
        //logger.error("tr069Details put none");
      }
  
      if(gemFrameErrTcaProfileFromOnuTemplate) {
        requestScope.get().put("gemFrameErrTcaProfileFromOnuTemplate", gemFrameErrTcaProfileFromOnuTemplate);
      }
      
      if(ethFrameErrorExtendedTcaProfileFromUniConfig){
        requestScope.get().put("ethFrameErrorExtendedTcaProfileFromUniConfig",ethFrameErrorExtendedTcaProfileFromUniConfig);
      }     
  
      if(pmCounterSizeFromUniConfig){
        requestScope.get().put("pmCounterSizeFromUniConfig",pmCounterSizeFromUniConfig);
      }
  
      if (systemLoadProfiles) {
        requestScope.get().put("systemLoadProfiles", systemLoadProfiles);
      }
  
      if (memoryUsageProfiles) {
        requestScope.get().put("memoryUsageProfiles", memoryUsageProfiles);
      }
      
      if (powerSheddingProfiles) {
        requestScope.get().put("powerSheddingProfiles", powerSheddingProfiles);
      }
  
      if (berTcaProfileDetails) {
        requestScope.get().put("berTcaProfileDetails", berTcaProfileDetails);
      }
  
      if(ethernetMaxFrameSizeConfig){
        requestScope.get().put("ethernetMaxFrameSizeConfig",ethernetMaxFrameSizeConfig);
      }
  
      if(powerShedRef) {
        requestScope.get().put("powerShedRef", powerShedRef);
      }
      if(powerShedOverrides){
        requestScope.get().put("powerShedOverrides", powerShedOverrides);
      }
  
      return onuTemplates;
    }
  
    function validateTransportVoipSipJSON(transportVoipSip) {
      if (transportVoipSip) {
        if (transportVoipSip["transport-voip-sip"] != null) {
          var tVoipSip = transportVoipSip["transport-voip-sip"];
          var missingKeys = [];
          var neededKeys = ["user-traffic-type", "translate-q-vlan-to-c-vlan", "c-vlan-id", "voip-cc-name", "sip-admin", "local-queue-weight", "local-queue-priority"];
          for (var obj in tVoipSip) {
            for (var key in neededKeys) {
              if (!tVoipSip[obj][neededKeys[key]]) {
                if (missingKeys.indexOf(neededKeys[key]) === -1)
                  missingKeys.push(neededKeys[key]);
              }
              //Validate tcont-config
              delete tVoipSip[obj]["tc-to-queue-mapping-profile-id"];
              if (!tVoipSip[obj]["tc-to-queue-mapping-profile-id"] && !tVoipSip[obj]["tcont-config"]) {
                throw new RuntimeException("ONU templates \"" + tVoipSip[obj]["name"] + "\" is missing mandatory key(s) : tc-to-queue-mapping-profile-id or tcont-config");
              } else if (tVoipSip[obj]["tc-to-queue-mapping-profile-id"] && tVoipSip[obj]["tcont-config"]) {
                throw new RuntimeException("ONU templates \"" + tVoipSip[obj]["name"] + "\" just only one key tc-to-queue-mapping-profile-id or tcont-config should be defined in json");
              }
            }
            if (tVoipSip[obj]["iphost"]) {
              var neededInnerKeys = ["ipaddress-acquisition", "respond-to-pings-enabled", "respond-to-traceroutes-enabled"];
              for (var key in neededInnerKeys) {
                if (!tVoipSip[obj]["iphost"][neededInnerKeys[key]]) {
                  if (missingKeys.indexOf(neededInnerKeys[key]) === -1)
                    missingKeys.push(neededInnerKeys[key]);
                }
              }
            }
            else {
              missingKeys.push("iphost");
            }
            if (missingKeys && missingKeys.length > 0)
              throw new RuntimeException("transport-voip-sip.json template \"" + tVoipSip[obj]["name"] + "\" is missing mandatory key(s) : " + missingKeys);
          }
        }
        else {
          throw new RuntimeException("transport-voip-sip not found.")
        }
      }
    }
  
    function validateIpHostConfigJSON(ipHostConfig) {
      var ipHostConfigObj = ipHostConfig["ip-host-config"];
      var missingKeys = [];
      var neededKeys = ["user-traffic-type", "translate-q-vlan-to-c-vlan", "c-vlan-id", "ip-cc-name", "ping-response", "trace-response"];
      for (var obj in ipHostConfigObj) {
        for (var key in neededKeys) {
          if (!ipHostConfigObj[obj][neededKeys[key]]) {
            if (missingKeys.indexOf(neededKeys[key]) === -1)
              missingKeys.push(neededKeys[key]);
          }
          //Validate tcont-config
          delete ipHostConfigObj[obj]["tc-to-queue-mapping-profile-id"];
          if (!ipHostConfigObj[obj]["tc-to-queue-mapping-profile-id"] && !ipHostConfigObj[obj]["tcont-config"]) {
            throw new RuntimeException("ONU templates \"" + ipHostConfigObj[obj]["name"] + "\" is missing mandatory key(s) : tc-to-queue-mapping-profile-id or tcont-config");
          } else if (ipHostConfigObj[obj]["tc-to-queue-mapping-profile-id"] && ipHostConfigObj[obj]["tcont-config"]) {
            throw new RuntimeException("ONU templates \"" + ipHostConfigObj[obj]["name"] + "\" just only one key tc-to-queue-mapping-profile-id or tcont-config should be defined in json");
          }
        }
        
        if (missingKeys && missingKeys.length > 0) {
          throw new RuntimeException("IP Host Configuration template \"" + ipHostConfigObj[obj]["name"] + "\" is missing mandatory key(s) : " + missingKeys);
        }
        ipHostConfigObj[obj]["ipaddress-acquisition"] = "dhcp"; // default is dhcp 
      }
    }
  
    function validateSipAgentProfileJSON(sipAgentProfiles, supplSvcsProfiles) {
      var sipAgentProfilesFile = "sip-agent-profile";
      if (sipAgentProfiles) {
        if (sipAgentProfiles["sip-agent-profile"] != null) {
          var nodeType = requestContext.get("nodeType");
          var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
          var sipAgentProfObj = sipAgentProfiles["sip-agent-profile"];
          var missingKeys = [];
          var neededKeys = ["name", "sip-ui-uri-type", "pots-uni-characteristics-profiles", "supplementary-services-profiles", "dialplan-digitmap-profile", "feature-access-codes-profile", "sip-registerchar-profile", "subscription-profile", "media-transport-profile", "media-codec-profiles", "media-forwarders", "sip-dscp-mark"];
          for (var obj in sipAgentProfObj) {
            for (var key in neededKeys) {
              if (!sipAgentProfObj[obj][neededKeys[key]]) {
                if (missingKeys.indexOf(neededKeys[key]) === -1 && (neededKeys[key] != "sip-dscp-mark" || neededKeys[key] === "sip-dscp-mark"))
                  missingKeys.push(neededKeys[key]);
              }
            }
            if (missingKeys.indexOf("name") !== -1) {
              throw new RuntimeException(sipAgentProfilesFile + " has one/more objects without key : name");
            }
            if (sipAgentProfObj[obj]["pots-uni-characteristics-profiles"]) {
              var neededInnerKeys = ["impedance", "rx-gain", "tx-gain", "echo-cancel-enabled", "off-hook-announcement-type", "hook-flash-min", "hook-flash-max", "jitter-target", "max-jitter-buffer", "pstn-protocol-variant", "dtmf-digit-levels", "dmtf-digit-duration"];
              for (var key in neededInnerKeys) {
                if (!sipAgentProfObj[obj]["pots-uni-characteristics-profiles"][neededInnerKeys[key]]) {
                  if (missingKeys.indexOf(neededInnerKeys[key]) === -1)
                    missingKeys.push(neededInnerKeys[key]);
                }
              }
            }
            if (sipAgentProfObj[obj]["voip-service-gateways"]) {
                var neededInnerKeys = ["release-timer"];
                for (var key in neededInnerKeys) {
                    if (!sipAgentProfObj[obj]["voip-service-gateways"][neededInnerKeys[key]]) {
                        if (missingKeys.indexOf(neededInnerKeys[key]) === -1)
                            missingKeys.push(neededInnerKeys[key]);
                    }
                }
            }
            if (sipAgentProfObj[obj]["media-transport-profile"]) {
              var neededInnerKeys = ["min-port-range"];
              for (var key in neededInnerKeys) {
                if (!sipAgentProfObj[obj]["media-transport-profile"][neededInnerKeys[key]]) {
                  if (missingKeys.indexOf(neededInnerKeys[key]) === -1)
                    missingKeys.push(neededInnerKeys[key]);
                }
              }
            }
  
            if (sipAgentProfObj[obj]["media-codec-profiles"]) {
              var neededInnerKeys = ["codec-selection-1st-order", "codec-packetization-time-1st-order", "silence-suppression-1st-order", "codec-selection-2nd-order", "codec-packetization-time-2nd-order", "silence-suppression-2nd-order", "codec-selection-3rd-order", "codec-packetization-time-3rd-order", "silence-suppression-3rd-order", "codec-selection-4th-order", "codec-packetization-time-4th-order", "silence-suppression-4th-order"];
              for (var key in neededInnerKeys) {
                if (!sipAgentProfObj[obj]["media-codec-profiles"][neededInnerKeys[key]]) {
                  if (missingKeys.indexOf(neededInnerKeys[key]) === -1)
                    missingKeys.push(neededInnerKeys[key]);
                }
              }
            }
  
            if (sipAgentProfObj[obj]["sip-registerchar-profile"]) {
              var neededInnerKeys = ["re-register-interval", "re-register-precursory-start-time"];
              for (var key in neededInnerKeys) {
                if (!sipAgentProfObj[obj]["sip-registerchar-profile"][neededInnerKeys[key]]) {
                  if (missingKeys.indexOf(neededInnerKeys[key]) === -1)
                    missingKeys.push(neededInnerKeys[key]);
                }
              }
            }
  
            if (sipAgentProfObj[obj]["dialplan-digitmap-profile"]) {
              var neededInnerKeys = ["dialplan-characteristics", "digitmap"];
              for (var key in neededInnerKeys) {
                if (!sipAgentProfObj[obj]["dialplan-digitmap-profile"][neededInnerKeys[key]]) {
                  if (missingKeys.indexOf(neededInnerKeys[key]) === -1)
                    missingKeys.push(neededInnerKeys[key]);
                }
              }
              if (sipAgentProfObj[obj]["dialplan-digitmap-profile"]["dialplan-characteristics"]) {
                if (!sipAgentProfObj[obj]["dialplan-digitmap-profile"]["dialplan-characteristics"]["sip-dialing-short-timer"] && missingKeys.indexOf("sip-dialing-short-timer") === -1) {
                  missingKeys.push("sip-dialing-short-timer");
                }
                if (!sipAgentProfObj[obj]["dialplan-digitmap-profile"]["dialplan-characteristics"]["sip-dialing-long-timer"] && missingKeys.indexOf("sip-dialing-long-timer") === -1) {
                  missingKeys.push("sip-dialing-long-timer");
                }
              }
              if (sipAgentProfObj[obj]["dialplan-digitmap-profile"]["digitmap"]) {
                if (!sipAgentProfObj[obj]["dialplan-digitmap-profile"]["digitmap"]["digit-map-pattern"] && missingKeys.indexOf("digit-map-pattern") === -1) {
                  missingKeys.push("digit-map-pattern");
                }
              }
            }
  
            if (sipAgentProfObj[obj]["feature-access-codes-profile"]) {
              var neededInnerKeys = ["callerid-feature-access-codes", "do-not-disturb-feature-access-codes"];
              for (var key in neededInnerKeys) {
                if (!sipAgentProfObj[obj]["feature-access-codes-profile"][neededInnerKeys[key]]) {
                  if (missingKeys.indexOf(neededInnerKeys[key]) === -1)
                    missingKeys.push(neededInnerKeys[key]);
                }
              }
              if (sipAgentProfObj[obj]["feature-access-codes-profile"]["callerid-feature-access-codes"]) {
                if (!sipAgentProfObj[obj]["feature-access-codes-profile"]["callerid-feature-access-codes"]["service-activation-code"] && missingKeys.indexOf("service-activation-code") === -1) {
                  missingKeys.push("service-activation-code");
                }
                if (!sipAgentProfObj[obj]["feature-access-codes-profile"]["callerid-feature-access-codes"]["service-deactivation-code"] && missingKeys.indexOf("service-deactivation-code") === -1) {
                  missingKeys.push("service-deactivation-code");
                }
              }
              if (sipAgentProfObj[obj]["feature-access-codes-profile"]["do-not-disturb-feature-access-codes"]) {
                if (!sipAgentProfObj[obj]["feature-access-codes-profile"]["do-not-disturb-feature-access-codes"]["service-activation-code"] && missingKeys.indexOf("service-activation-code") === -1) {
                  missingKeys.push("service-activation-code");
                }
                if (!sipAgentProfObj[obj]["feature-access-codes-profile"]["do-not-disturb-feature-access-codes"]["service-deactivation-code"] && missingKeys.indexOf("service-deactivation-code") === -1) {
                  missingKeys.push("service-deactivation-code");
                }
              }
            }
  
            if (sipAgentProfObj[obj]["media-forwarders"]) {
              var neededInnerKeys = ["fax-modem-transition-mode", "dtmf-events"];
              for (var key in neededInnerKeys) {
                if (!sipAgentProfObj[obj]["media-forwarders"][neededInnerKeys[key]]) {
                  if (missingKeys.indexOf(neededInnerKeys[key]) === -1)
                    missingKeys.push(neededInnerKeys[key]);
                }
              }
            }
  
            if (sipAgentProfObj[obj]["supplementary-services-profiles-list"] && (sipAgentProfObj[obj]["supplementary-services-profiles-list"].length > 0)){
              if (supplSvcsProfiles && supplSvcsProfiles["sip-suppl-services-profile"] && (supplSvcsProfiles["sip-suppl-services-profile"].length > 0)){
                  let supplProlMissingKeys = [];
                  let supplSvcsProfileList = sipAgentProfObj[obj]["supplementary-services-profiles-list"];
                  let supplSvcsProfilesObj = supplSvcsProfiles["sip-suppl-services-profile"];
  
                  //verify profiles of supplementary-services-profiles-list exist in profiles
                  supplSvcsProfileList.forEach(supplProfOfSipAgent => {
                      let exists = supplSvcsProfilesObj.some(supplProf =>
                          supplProf.name === supplProfOfSipAgent["supplementary-services-profile"]
                      );
  
                      if (!exists) {
                          throw new RuntimeException("SIP Supplementary Services Profile \"" + supplProfOfSipAgent["supplementary-services-profile"] + "\" is missing  or not associated");
                      }
                  });
  
                  //verify supplementary services profile content, check missing keys
                  let matchedSupplSvcsProfiles = supplSvcsProfilesObj.filter(supplProf =>
                      supplSvcsProfileList.some(supplProfOfSipAgent => supplProfOfSipAgent["supplementary-services-profile"] === supplProf.name)
                  );
                  matchedSupplSvcsProfiles.forEach(function validateSupplSvcsProfileJson(supplSvcsProfile){
                      let neededInnerKeys = ["calling-number", "calling-name", "callerid", "callerid-name", "call-waiting", "Three-party-conference", "call-hold", "call-forwarding-ind", "call-park", "attended-call-transfer", "unattended-call-transfer"];
                      for (let key in neededInnerKeys) {
                          if (!supplSvcsProfile[neededInnerKeys[key]]) {
                              if (supplProlMissingKeys.indexOf(neededInnerKeys[key]) === -1)
                                  supplProlMissingKeys.push(neededInnerKeys[key]);
                          } else if (!supplSvcsProfile[neededInnerKeys[key]]["control"]) {
                              if (supplProlMissingKeys.indexOf("control") === -1)
                                  supplProlMissingKeys.push("control");
                          }
                      }
                      if (supplSvcsProfile["callerid"] && !supplSvcsProfile["callerid"]["status"]) {
                          if (supplProlMissingKeys.indexOf("status") === -1) supplProlMissingKeys.push("status");
                      }
                      if (supplSvcsProfile["callerid-name"] && !supplSvcsProfile["callerid-name"]["status"]) {
                          if (supplProlMissingKeys.indexOf("status") === -1) supplProlMissingKeys.push("status");
                      }
                      if (supplSvcsProfile["call-waiting"] && !supplSvcsProfile["call-waiting"]["cw-caller-id-announcement"]) {
                          if (supplProlMissingKeys.indexOf("cw-caller-id-announcement") === -1) supplProlMissingKeys.push("cw-caller-id-announcement");
                      }
                      if (supplProlMissingKeys && supplProlMissingKeys.length > 0)
                          throw new RuntimeException("SIP Supplementary Services Profile \"" + supplSvcsProfile["name"] + "\" is missing mandatory key(s) : " + supplProlMissingKeys);
                  });
              } else{
                  throw new RuntimeException("SIP Supplementary Services Profile is missing or not associated");
              }
            }
  
            if (sipAgentProfObj[obj]["supplementary-services-profiles"]) {
              var neededInnerKeys = ["calling-number", "calling-name", "callerid", "callerid-name", "call-waiting", "Three-party-conference", "call-hold", "call-forwarding-ind", "call-park", "attended-call-transfer", "unattended-call-transfer"];
              for (var key in neededInnerKeys) {
                if (!sipAgentProfObj[obj]["supplementary-services-profiles"][neededInnerKeys[key]]) {
                  if (missingKeys.indexOf(neededInnerKeys[key]) === -1)
                    missingKeys.push(neededInnerKeys[key]);
                }
                else if (!sipAgentProfObj[obj]["supplementary-services-profiles"][neededInnerKeys[key]]["control"]) {
                  if (missingKeys.indexOf("control") === -1)
                    missingKeys.push("control");
                }
              }
              if (sipAgentProfObj[obj]["supplementary-services-profiles"]["callerid"] && !sipAgentProfObj[obj]["supplementary-services-profiles"]["callerid"]["status"]) {
                if (missingKeys.indexOf("status") === -1) missingKeys.push("status");
              }
              if (sipAgentProfObj[obj]["supplementary-services-profiles"]["callerid-name"] && !sipAgentProfObj[obj]["supplementary-services-profiles"]["callerid-name"]["status"]) {
                if (missingKeys.indexOf("status") === -1) missingKeys.push("status");
              }
              if (sipAgentProfObj[obj]["supplementary-services-profiles"]["call-waiting"] && !sipAgentProfObj[obj]["supplementary-services-profiles"]["call-waiting"]["cw-caller-id-announcement"]) {
                if (missingKeys.indexOf("cw-caller-id-announcement") === -1) missingKeys.push("cw-caller-id-announcement");
              }
            }
  
            if (sipAgentProfObj[obj]["subscription-profile"]) {
  
              if (!sipAgentProfObj[obj]["subscription-profile"]["sip-event-package"]) {
                if (missingKeys.indexOf("sip-event-package") === -1) missingKeys.push("sip-event-package");
              }
              else if (!sipAgentProfObj[obj]["subscription-profile"]["sip-event-package"]["subscribe-method"]) {
                if (missingKeys.indexOf("subscribe-method") === -1) missingKeys.push("subscribe-method");
              }
              else if (!sipAgentProfObj[obj]["subscription-profile"]["sip-event-package"]["subscribe-method"]["notification-characteristics"]) {
                if (missingKeys.indexOf("notification-characteristics") === -1) missingKeys.push("notification-characteristics");
              }
              else {
                var neededInnerKeys = ["tone", "visual-indication"];
                for (var key in neededInnerKeys) {
                  if (!sipAgentProfObj[obj]["subscription-profile"]["sip-event-package"]["subscribe-method"]["notification-characteristics"][neededInnerKeys[key]]) {
                    if (missingKeys.indexOf(neededInnerKeys[key]) === -1)
                      missingKeys.push(neededInnerKeys[key]);
                  }
                }
              }
            }
            if (missingKeys && missingKeys.length > 0)
              throw new RuntimeException(sipAgentProfilesFile + " template \"" + sipAgentProfObj[obj]["name"] + "\" is missing mandatory key(s) : " + missingKeys);
          }
        }
        else {
          throw new RuntimeException(sipAgentProfilesFile + " is missing mandatory key \"sip-agent-profile\"")
        }
      }
      else {
        throw new RuntimeException(sipAgentProfilesFile + " not found");
      }
    }
  
    function updateEonuVoIPSIPDetails(eOnuArgs) {
        eOnuArgs["isVoipSupported"] = true;
        //TRANSPORT-XPON-ONU-ANI || TRANSPORT-VOIP-SIP-CC
        eOnuArgs["ANI-NAME"] = "ANI";
        //ONU-VOIP-SIP-AGENT
        eOnuArgs["TEMPLATE-USAGE"] = true;
        eOnuArgs["ALLOC-ID"] = "";
    }
  
    function getVonuAddressFromDevice(deviceID){
      var manager = apUtils.getManagerInfo(deviceID);
      return manager.getVonumgmtAddress();
    }
  
    function getShelfVariantFromHardwareType(hardwareType, isExtractSubstring) {
      var shelfVariant;
      if (hardwareType.length > 12) {
        if (isExtractSubstring) {
          shelfVariant = hardwareType.substring(13);
        } else {
          shelfVariant = hardwareType;
        }
      } else {
          shelfVariant = capabilityConstants.HYPHEN_CONTEXT;
      } 
      return shelfVariant;
    }
  
    function validateEnergyMeasurementIpfixDetails(ipfixDetails, deviceID) {
      if(ipfixDetails) {
          for (var i = 0; i < ipfixDetails.length; i++) {
              //validate the exportInterval of hardware-state-energy-measurement cache
              if((ipfixDetails[i]["name"] === "hardware-state-energy-measurement") && (ipfixDetails[i]["state"] === "enabled")) {
                  // if energy-measurement cache is enabled, check whether the exportInterval is valid
                  var exportIntervalValid = false;
                  var periodicEnergyMeasurementIntervalList=resourceProvider.getResource(internalResourcePrefix + "periodic-energy-interval-23.12.json");
                  var periodicEnergyMeasurementIntervalConfig=JSON.parse(periodicEnergyMeasurementIntervalList);
                  for(var configurableInterval in periodicEnergyMeasurementIntervalConfig) {
                      if(ipfixDetails[i]["permanentCache"]["exportInterval"] == configurableInterval) {
                          exportIntervalValid = true;
                          var exportIntervalString = periodicEnergyMeasurementIntervalConfig[configurableInterval];
                      }
                  }
  
                  // if exportInterval is invalid, then forbid user to enable the Permanent Cache
                  if (!exportIntervalValid) {
                      throw new RuntimeException("exportInterval of 'hardware-state-energy-measurement' can not be set to " + ipfixDetails[i]["permanentCache"]["exportInterval"] + "! Only 300, 900, 1800, 3600, 7200 and 86400 are allowed!");
                  }
  
                  // then check whether the feature is enabled
                  var resourcePath = internalResourcePrefix + "getEnergyParameters.xml.ftl";
                  var templateArgs = {"deviceID": deviceID};
                  var extractedXpath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceID + "\']";
                  try {
                      var periodicMeasurementEnabled = false;
                      var extractedNode = apUtils.getExtractedNodeFromResponse(resourcePath, templateArgs, extractedXpath, apUtils.prefixToNsMap);
                      var xpath = "adh:device-specific-data/hw:hardware/hw:component[hw:name=\'Chassis\']/nokia-sdan-hw-energy-metering:energy/nokia-sdan-hw-energy-metering:periodic/nokia-sdan-hw-energy-metering:interval-length/text()";
                      var periodicIntervalLengthConfig = apUtils.getNodeValue(extractedNode, xpath, apUtils.prefixToNsMap);
                      if (periodicIntervalLengthConfig.length !== 0) {
                        var periodicIntervalLengthConfigString = periodicIntervalLengthConfig.replace("nokia-sdan-hw-energy-metering:", "");
                        xpath = "adh:device-specific-data/hw:hardware/hw:component[hw:name=\'Chassis\']/nokia-sdan-hw-energy-metering:energy/nokia-sdan-hw-energy-metering:periodic[nokia-sdan-hw-energy-metering:interval-length='" + periodicIntervalLengthConfig + "']/nokia-sdan-hw-energy-metering:enable/text()";
                        periodicMeasurementEnabled = apUtils.getNodeValue(extractedNode, xpath, apUtils.prefixToNsMap);
                      }
                  } catch (e) {
                      logger.warn("Error while getting periodic energy measurement parameters {}", e);
                  }
  
                  if (periodicMeasurementEnabled) {
                      // if exportInterval is valid and periodic energy measurement is enabled, check whether the interval configuration is consistant
                      // if exportInterval is not equal to periodic energy intervalLength, then forbid user to set the exportInterval
                      for(var configurableInterval in periodicEnergyMeasurementIntervalConfig) {
                          if(periodicIntervalLengthConfigString == periodicEnergyMeasurementIntervalConfig[configurableInterval]) {
                              var periodicIntervalLengthConfigValue = configurableInterval;
                          }
                      }
                      if (exportIntervalString !== periodicIntervalLengthConfigString) {
                        throw new RuntimeException("\'hardware-state-energy-measurement\' Permanent Cache exportInterval needs to keep consistant with periodic IntervalLength \'" + periodicIntervalLengthConfigValue + "\' configured in device intent!");
                      }
                  }
              }
          }
      }
    }
  
    function updateIpfixDetails(ipfixDetails, inputSchema, baseArgs, exportingProcess, fwk, topology, deviceName,bestType) {
      var ipfixObject = {}
      if (ipfixDetails) {
        for (var i = 0; i < ipfixDetails.length; i++) {
          /**
           * To get the change notification with removed for
           * "interface-type": [ ] when an interface is removed in the array.
           * The array need to be customized as follows.
           *  "interface-type":{
           *       "bbf-xpon-if-type:onu-v-enet":{
           *          "name":"bbf-xpon-if-type:onu-v-enet"
           *       },
           * only then it will notify the change as well as removed
           * (i)
           * "interface-type":{
           *       "bbf-xpon-if-type:onu-v-enet":{
           *                   "name":"bbf-xpon-if-type:onu-v-enet"
           *        },
           *       "bbf-xpon-if-type:ani":{
           *          "name":"bbf-xpon-if-type:ani",
           *          "removed":"removed"
           *       },
           *       "changed":"changed"
           *    }.
           * (ii) when all the entires are removed.
           *  "interface-type":{
           *                "bbf-xpon-if-type:onu-v-enet":{
           *                   "name":"bbf-xpon-if-type:onu-v-enet"
           *                },
           *                "removed":"removed"
           *             },
           *             "changed":"changed"
           *          },
           * Add an entry for interface-type in the inputschema.
           *
           * Otherwise it will notify only changed missing the removed:
           *   "interface-type":["bbf-xpon-if-type:onu-v-enet"],
           *   "changed":"changed"
           **/
          if (ipfixDetails[i]["interface-type"]) {
            if (isNaN(ipfixDetails[i]["interface-type"])) {
              var interfaceNameMap = {};
              for (var j in ipfixDetails[i]["interface-type"]) {
                var interfaceTypeName = ipfixDetails[i]["interface-type"][j];
                interfaceNameMap[interfaceTypeName] = { "name": interfaceTypeName }
              }
              if (!apUtils.ifObjectIsEmpty(interfaceNameMap)) {
                ipfixDetails[i]["interface-type"] = interfaceNameMap;
              }
            }
          }
        }
      }
      var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
      var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
      var ltBoardName = deviceTypeAndRelease.hwType.replace("LS-MF-", "");
      var isSpeedMonitoringIntervalSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_SPEED_MONITORING_INTERVAL_SUPPORTED, ltBoardName, false);      
      baseArgs["isSpeedMonitoringIntervalSupported"] = isSpeedMonitoringIntervalSupported;
      if (isSpeedMonitoringIntervalSupported) {
        var speedMonitoringInterval;
        var speedMonitoringIntervalList = resourceProvider.getResource(internalResourcePrefix + "monitoring-interval-22.3.json");
        var speedMonitoringIntervalConfig = JSON.parse(speedMonitoringIntervalList);
        let contextErrorObj = {};
        if (ipfixDetails) {
          for (var i = 0; i < ipfixDetails.length; i++) {
            let isNaNExportIntervalOfCacheConvertible = false;
            if (ipfixDetails[i]["permanentCache"] && ipfixDetails[i]["permanentCache"]["exportInterval"] && (isNaN(ipfixDetails[i]["permanentCache"]["exportInterval"]) || (ipfixDetails[i].name && ipfixDetails[i].name == "xpon-interfaces-state-statistics-datarate" && !isNaN(ipfixDetails[i]["permanentCache"]["exportInterval"])))) {
              let exportIntervalOfCache = ipfixDetails[i]["permanentCache"]["exportInterval"]
              if (exportingProcess["export-interval-reference"]) {
                var configurableIntervalList = exportingProcess["export-interval-reference"];
                if (configurableIntervalList && configurableIntervalList.length > 0) {
                  configurableIntervalList.forEach(function (configs) {
                    for (var key in configs) {
                      if (configs[key] == exportIntervalOfCache) {
                        ipfixDetails[i]["permanentCache"]["exportInterval"] = configs["interval"];
                        
                        if (ipfixDetails[i] && ipfixDetails[i].name && ipfixDetails[i].name == "xpon-interfaces-state-statistics-datarate") {
                          speedMonitoringInterval = configs["interval"];
                        }
                        if (configs["interval"]) {
                          isNaNExportIntervalOfCacheConvertible = true;
                        }
                      }
                    }
                  });
                }
              }
              if(ipfixDetails[i].name && ipfixDetails[i].name == "xpon-interfaces-state-statistics-datarate"){
                  for (var exportinterval in speedMonitoringIntervalConfig) {
                      if ((speedMonitoringInterval && speedMonitoringInterval == exportinterval) || (ipfixDetails[i]["permanentCache"]["exportInterval"] == exportinterval)) {
                          baseArgs["speed-monitoring-interval"] = speedMonitoringIntervalConfig[exportinterval];
                          isNaNExportIntervalOfCacheConvertible = true;
                          break;
                      }
                  }
                  if (!baseArgs["speed-monitoring-interval"] && baseArgs["ipfixProfileName"] && speedMonitoringInterval) {
                      contextErrorObj["speed_monitoring_interval#"] = "Interval ' "+ speedMonitoringInterval +"' of Export Interval Reference in IPFIX Profile/"+ intentConstants.FIBER_PREFIX+" '" + baseArgs["ipfixProfileName"] + "' is not allowed to enable in device";
                      isNaNExportIntervalOfCacheConvertible = true;
                  }
              }
              if (!isNaNExportIntervalOfCacheConvertible) {
                if (baseArgs["ipfixProfileName"]) {
                    contextErrorObj["export_interval#" + ipfixDetails[i].name] = "Export Interval '" + exportIntervalOfCache + "' in IPFIX Cache Profile/" + intentConstants.LS_MF_PREFIX + " '" + ipfixDetails[i].name + "' is not defined in Export Interval Reference of IPFIX Profile/" + intentConstants.FIBER_PREFIX + " '" + baseArgs["ipfixProfileName"] + "'";
                } else {
                    contextErrorObj["export_interval#" + ipfixDetails[i].name] = "Export Interval '" + exportIntervalOfCache + "' in IPFIX Cache Profile/" + intentConstants.LS_MF_PREFIX + " '" + ipfixDetails[i].name + "' is not defined in Export Interval Reference of any IPFIX Profile/" + intentConstants.FIBER_PREFIX;
                }
              }
            }
          }
        }
        let updatedErrorMessages = apUtils.updateErrorMessages(contextErrorObj, true);
        if (updatedErrorMessages) {
            throw new RuntimeException(updatedErrorMessages);
        }
      }
      ipfixObject["cache"] = ipfixDetails;
      var cache = {}
      fwk.convertObjectToNetconfFwkFormat(ipfixObject, inputSchema["ipfixSchema"], cache);
      baseArgs["ipfix"] = cache;
      baseArgs["ipfix"]["exportingProcess"] = exportingProcess;
      let collectorNamesInput = {}, collectorNamesOutput = {};
      collectorNamesInput["collectorNames"] = baseArgs["collectorNames"];
      fwk.convertObjectToNetconfFwkFormat(collectorNamesInput, inputSchema["collectorNamesSchema"], collectorNamesOutput);
      baseArgs["collectorNames"] = collectorNamesOutput["collectorNames"];
      if (baseArgs["ipfix"]["cache"] && baseArgs["isMultipleIpfixCollectorsSupported"] && baseArgs["isMultipleIpfixCollectorsSupported"] == true && baseArgs["availableExporters"] && profilesJsonMap["ipfix-profile"] && profilesJsonMap["ipfix-profile"][0]["exportingProcess"]) {
          let cacheProfileToBeDeleted = [];
          for (let key in baseArgs["ipfix"]["cache"]) {
              if (baseArgs["ipfix"]["cache"][key]["state"] == "enabled") {
                  if (baseArgs["ipfix"]["cache"][key]["exportingProcess"]) {
                      let exportingProcessInAvailableExporters = false;
                      for (let i = 0; i < baseArgs["availableExporters"].length; i++) {
                          if (baseArgs["availableExporters"][i] == baseArgs["ipfix"]["cache"][key]["exportingProcess"][0]) {
                              exportingProcessInAvailableExporters = true;
                              break;
                          }
                      }
                      if (!exportingProcessInAvailableExporters) {
                          cacheProfileToBeDeleted.push(key);
                      }
                  }
                  else {
                      baseArgs["ipfix"]["cache"][key]["exportingProcess"] = [];
                      if (profilesJsonMap["ipfix-profile"][0]["exportingProcess"]["collector-names"] && profilesJsonMap["ipfix-profile"][0]["exportingProcess"]["collector-names"][0]["exportingProcessName"]) {
                        baseArgs["ipfix"]["cache"][key]["exportingProcess"][0] = profilesJsonMap["ipfix-profile"][0]["exportingProcess"]["collector-names"][0]["exportingProcessName"];
                      }
                      else {
                        baseArgs["ipfix"]["cache"][key]["exportingProcess"][0] = intentConstants.STATIC_EXPORTING_PROCESS;
                      }
                  }
              }
          }
          for (let i = 0; i < cacheProfileToBeDeleted.length; i++) {
              delete baseArgs["ipfix"]["cache"][cacheProfileToBeDeleted[i]];
          }
          apUtils.handleLeafListCase(baseArgs["collectorNames"], "destinationName");
          apUtils.handleLeafListCase(baseArgs["ipfix"]["cache"], "exportingProcess");
      }
      if (baseArgs["ipfixCollectorMdsPassword"]) {
          if (exportingProcess && exportingProcess["password-algorithm"]) {
              var hashingAlgo = exportingProcess["password-algorithm"];
              apUtils.configIpfixHashedPassword(baseArgs, hashingAlgo, topology, deviceName);
          }
      }
  
    }
  
    function getMfDeviceType(nodeType) {
      var deviceType = "shelfNE";
      if(apUtils.isMFSupportedLTFamily(nodeType)) {
        deviceType = "LT";
      }
      return deviceType;
    }
  
    function loadLtConfigResources(deviceTypeAndRelease,ltBoardName) {
      var l2Profiles={};
      var qosProfiles={};
      if(profilesJsonMap){
        var isSubtendingPortSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_SUBTENDING_PORT_SUPPORTED, ltBoardName, false);
        var l2ProfileCategory = isSubtendingPortSupported ? "subtended-port": "user-port";
        l2Profiles["mac-learning-control-profiles"] = filterL2Profiles(profilesJsonMap["mac-learning-control-profiles"], l2ProfileCategory, "name"); 
        l2Profiles["split-horizon-profiles"] =  filterL2Profiles(profilesJsonMap["split-horizon-profiles"], l2ProfileCategory, "name");
        l2Profiles["flooding-policies-profiles"] = filterL2Profiles(profilesJsonMap["flooding-policies-profiles"], l2ProfileCategory, "name");
        l2Profiles["l2-dhcpv4-relay-profiles"] = profilesJsonMap["l2-dhcpv4-relay-profiles"];
        l2Profiles["dhcpv6-ldra-profiles"] = profilesJsonMap["dhcpv6-ldra-profiles"];
        l2Profiles["pppoe-profiles"] = profilesJsonMap["pppoe-profiles"];
        l2Profiles["subscriber-profiles"] = restructureSubcriberProfiles(profilesJsonMap["subscriber-profiles"]);
        l2Profiles["vector-of-data-profiles"] = profilesJsonMap["vector-of-data-profiles"];
        l2Profiles["icmpv6-profiles"] = profilesJsonMap["icmpv6-profiles"];
        var ltClassifiers = apUtils.updateLtClassifierPrefixes(profilesJsonMap["classifiers"]);
        if (ltClassifiers) {
          apUtils.processClassifiers(ltClassifiers);
          qosProfiles["classifiers"] = ltClassifiers;
        }
        qosProfiles["policies"] = profilesJsonMap["policies"];
        qosProfiles["qos-policy-profiles"] = profilesJsonMap["qos-policy-profiles"];
        qosProfiles["policing-profiles"] = profilesJsonMap["policing-profiles"];
        qosProfiles["policing-action-profiles"] = profilesJsonMap["policing-action-profiles"];
        qosProfiles["policing-pre-handling-profiles"] = profilesJsonMap["policing-pre-handling-profiles"];
        qosProfiles["bac-entry"] = profilesJsonMap["bac-entry"];
        qosProfiles["traffic-descriptor-profiles"] = profilesJsonMap["traffic-descriptor-profiles"];
        qosProfiles["scheduler-node-profiles"] = profilesJsonMap["scheduler-node-profiles"];
        qosProfiles["enhanced-filters"] = profilesJsonMap["enhanced-filters"];
        var shaperProfileList = [];
        for (var index in profilesJsonMap["shaper-profile"]) {
          var shaperProfileObj = {};
          shaperProfileObj["name"] = profilesJsonMap["shaper-profile"][index]["name"];
          shaperProfileObj["pbs"] = profilesJsonMap["shaper-profile"][index]["single-token-bucket"]["pbs"];
          shaperProfileObj["pir"] = profilesJsonMap["shaper-profile"][index]["single-token-bucket"]["pir"];
          shaperProfileList.push(shaperProfileObj);
        }
        qosProfiles["shaper-profiles"] = shaperProfileList;
        qosProfiles["flat-scheduling-profiles"] = profilesJsonMap["flat-scheduling-profiles"];
      }
     return {qosProfiles: qosProfiles, l2Profiles: l2Profiles};
    }
  
    function restructureSubcriberProfiles(subscriberProfiles) {
      var newSubscriberArr = [];
      for (var subscriber in subscriberProfiles) {
          var objDetails = {};
          objDetails["name"] = subscriberProfiles[subscriber]["name"];
          objDetails["baseRelease"] = subscriberProfiles[subscriber]["baseRelease"];
          objDetails["profileVersion"] = subscriberProfiles[subscriber]["profileVersion"];
          objDetails["circuit-id"] = {"value": subscriberProfiles[subscriber]["circuit-id"]};
          objDetails["remote-id"] = {"value": subscriberProfiles[subscriber]["remote-id"]};
          objDetails["subscriber-id"] = {"value": subscriberProfiles[subscriber]["subscriber-id"]};
          newSubscriberArr.push(objDetails);
      }
      return newSubscriberArr;
  }
  
    function filterL2Profiles(profileList, category, key){
      var filteredProfiles = [];
      if (profileList) {
        var l2Profiles = JSON.parse(JSON.stringify(profileList));
        Object.keys(l2Profiles).forEach(function(profile){
          if(JSON.stringify(l2Profiles[profile][category]) !== null && JSON.stringify(l2Profiles[profile][category]) !== "{}") {
            filteredProfiles.push(l2Profiles[profile][category]);          
            filteredProfiles[profile][key]= l2Profiles[profile][key];
          }
        });
      }
      return filteredProfiles;    
    }
  
    function loadIpfixResourceAndUpdateIpfixDetailsFromMds(baseArgs, nodeType) {
      var ipfix = {};
      var ipfixDetails = apUtils.getIPFIXDetails(baseArgs["deviceID"], nodeType, profilesJsonMap["ipfix-profile"][0], profilesJsonMap["cache"]);
      apUtils.getMergedObject(baseArgs, ipfixDetails);
      var ipfixExportingProcess = {};
      ipfix["cache"] = profilesJsonMap["cache"];
      var ipfixProfileList = profilesJsonMap["ipfix-profile"];
      if (ipfixProfileList) {
        ipfixProfileList.forEach(function (exportProcess) {
            ipfixExportingProcess = exportProcess["exportingProcess"];
            if (exportProcess && exportProcess.name) {
              baseArgs["ipfixProfileName"] = exportProcess.name;
            }
        });
      } else {
        throw new RuntimeException("IPFIX Profile/LS-Fiber is not associated");
      }
      if ((ipfixExportingProcess.keepalives && !ipfixExportingProcess.keepalives.enable) || (ipfixExportingProcess.keepalives && ipfixExportingProcess.keepalives.enable === "false")){
        delete ipfixExportingProcess.keepalives;
      }
      ipfix["exportingProcess"] = ipfixExportingProcess;
      return ipfix;
  }
  
    function updateAdditionalLtConfigFromXtraInfo(topology, topoKey, baseArgs) {
      var stageArgs = apUtils.getStageArgsFromTopologyXtraInfo(topology, topoKey)
      if (stageArgs) {
        var deviceArgs = stageArgs[baseArgs["deviceID"]];
        var oldPppoeSubtag = deviceArgs["pppoe-profiles"];
        var oldL2Suboptions = deviceArgs["l2-dhcpv4-relay-profiles"];
        var oldL2DHCPv6Option = deviceArgs["dhcpv6-ldra-profiles"];
      }
  
      var pppoeSubtag = {};
      if(baseArgs["pppoe-profiles"]) {
        Object.keys(baseArgs["pppoe-profiles"]).forEach(function (key) {
          var profile = baseArgs["pppoe-profiles"][key];
          if (oldPppoeSubtag && oldPppoeSubtag[key]) {
            var removedPppoeSubtag = apUtils.compareTwoArrayAndReturnDifference(profile["pppoe-vendor-specific-tag"]["subtag"],
                oldPppoeSubtag[key]["pppoe-vendor-specific-tag"]["subtag"].split(","));
            if (removedPppoeSubtag.length > 0) {
              pppoeSubtag[key] = removedPppoeSubtag;
            }
          }
          profile["pppoe-vendor-specific-tag"]["subtag"] = profile["pppoe-vendor-specific-tag"]["subtag"].join();
        });
      }
      baseArgs["pppoeSubtag"] = pppoeSubtag;
  
      var l2Suboptions = {};
      if (baseArgs["l2-dhcpv4-relay-profiles"]) {
        Object.keys(baseArgs["l2-dhcpv4-relay-profiles"]).forEach(function (key) {
          var l2DhcpRelayProfile = baseArgs["l2-dhcpv4-relay-profiles"][key];
  
          if (oldL2Suboptions && oldL2Suboptions[key]) {
            var removedL2Suboptions = apUtils.compareTwoArrayAndReturnDifference(l2DhcpRelayProfile["option82-format"]["suboptions"],
                oldL2Suboptions[key]["option82-format"]["suboptions"].split(","));
            if (removedL2Suboptions.length > 0) {
              l2Suboptions[key] = removedL2Suboptions;
            }
          }
          l2DhcpRelayProfile["option82-format"]["suboptions"] = l2DhcpRelayProfile["option82-format"]["suboptions"].join();
        });
      }
      baseArgs["l2Suboptions"] = l2Suboptions;
  
      var l2DHCPv6Option = {};
      var xponAccessLoopCharacteristics = {};
      if (baseArgs["dhcpv6-ldra-profiles"]) {
        Object.keys(baseArgs["dhcpv6-ldra-profiles"]).forEach(function (key) {
          var l2DHCPv6RelayProfile = baseArgs["dhcpv6-ldra-profiles"][key];
          if (oldL2DHCPv6Option && oldL2DHCPv6Option[key]) {
            var removedL2DHCPv6Option = apUtils.compareTwoArrayAndReturnDifference(l2DHCPv6RelayProfile["options"]["option"],
              oldL2DHCPv6Option[key]["options"]["option"].split(","));
              if (oldL2DHCPv6Option[key]["options"]["xpon-access-loop-characteristics"] && oldL2DHCPv6Option[key]["options"]["xpon-access-loop-characteristics"] != "undefined") {
                var l2DHCPv6RelayProfileArr = l2DHCPv6RelayProfile["options"]["xpon-access-loop-characteristics"];
                var l2DHCPv6RelayProfileModifiedArr = l2DHCPv6RelayProfileArr.map(element => {
                    if (element.contains("bbf-xpon-access-line-characteristics-type:")) {
                        return element.replace("bbf-xpon-access-line-characteristics-type:", "");
                    }
                    return element;
                });
                var oldL2DHCPv6OptionArr = oldL2DHCPv6Option[key]["options"]["xpon-access-loop-characteristics"].split(",");
                var oldL2DHCPv6OptionModifiedArr = oldL2DHCPv6OptionArr.map(element => {
                    if (element.contains("bbf-xpon-access-line-characteristics-type:")) {
                        return element.replace("bbf-xpon-access-line-characteristics-type:", "");
                    }
                    return element;
                });
  
                var removedXponAccessLoopCharacteristics = apUtils.compareTwoArrayAndReturnDifference(l2DHCPv6RelayProfileModifiedArr, oldL2DHCPv6OptionModifiedArr);
                if (removedXponAccessLoopCharacteristics.length > 0) {
                    xponAccessLoopCharacteristics[key] = removedXponAccessLoopCharacteristics;
                }
  
                if (removedL2DHCPv6Option.length > 0) {
                  l2DHCPv6Option[key] = removedL2DHCPv6Option;
                }
            } 
           
          }
          l2DHCPv6RelayProfile["options"]["option"] = l2DHCPv6RelayProfile["options"]["option"].join();
          if(l2DHCPv6RelayProfile["options"]["xpon-access-loop-characteristics"] && l2DHCPv6RelayProfile["options"]["xpon-access-loop-characteristics"] != "undefined"){
            l2DHCPv6RelayProfile["options"]["xpon-access-loop-characteristics"] = l2DHCPv6RelayProfile["options"]["xpon-access-loop-characteristics"].join();
          }
        });
      }
      baseArgs["l2DHCPv6Option"] = l2DHCPv6Option;
      baseArgs["xponAccessLoopCharacteristics"] = xponAccessLoopCharacteristics;
    }
  
    function validateCfmProfiles223(bestType, cfmProfiles, cfmOntProfiles) {
      var maAssociationProfiles = cfmProfiles["ma-association-profile"];
      for (var profile in cfmOntProfiles["cfm-profile"]) {
        var cfmProfile = cfmOntProfiles["cfm-profile"][profile];
        if (cfmProfile["maintenance-domain"]) {
          var maintanencedomains = cfmProfile["maintenance-domain"];
          for (var mdIndex in maintanencedomains) {
            if (cfmProfile["maintenance-domain"][mdIndex] && cfmProfile["maintenance-domain"][mdIndex]["ma"] && cfmProfile["maintenance-domain"][mdIndex]["ma"]["maintenance-association"]) {
              var maintenanceAssociations = cfmProfile["maintenance-domain"][mdIndex]["ma"]["maintenance-association"];
              if (!isMgIdUnique(maintanencedomains, mdIndex)) {
                throw new RuntimeException("Invalid Maintenance Group ID. Maintenance Group ID should be unique");
              }
              if (!isMepIdUnique(maintanencedomains, mdIndex, bestType)) {
                throw new RuntimeException("Invalid MEP ID, MEP ID should be unique");
              }
              for (var ma in maintenanceAssociations) {
                var mdProfileName = maintanencedomains[mdIndex]["ma-domain-profile-id"];
                var maName = maintenanceAssociations[ma]["ma-association-profile-id"];
                for (var maPf in maAssociationProfiles) {
                  if (maAssociationProfiles[maPf]["name"] == maName) {
                    var mhfCreation = maAssociationProfiles[maPf]["mhf-creation"];
                    if (mhfCreation != "mhf-none" && !maintenanceAssociations[ma]["ma-vlan-id"]) {
                      throw new RuntimeException("MA VLAN ID is mandatory for MIP creation.");
                    }
                  }
                }
                if (mdProfileName.concat(maName).length >= 45) {
                  throw new RuntimeException("Invalid Name Length. The combined length of MD Name '" + mdProfileName + "' and MA Name '" + maName + "' should be less than 45 characters");
                }
              }
            }
          }
        }
      }
    }
  
  
  
    function isMepIdUnique(maintanencegroups, mgroupIndex, bestType) {
      if (mgroupIndex != 1) {
        var maintenanceassociation = maintanencegroups[mgroupIndex]["ma"]["maintenance-association"];
        for (var maIndex in maintenanceassociation) {
          var maintenanceAssociationMep = maintenanceassociation[maIndex]["mep"]["maintenance-association-mep"];
          var mepList = [];
          for (var mepIndex in maintenanceAssociationMep) {
            var mepid = maintenanceAssociationMep[mepIndex]["mep-id"];
            if (mepList.indexOf(mepid) != -1) {
              return false;
            }
            mepList.push(mepid);
          }
        }
      }
      return true;
    }
  
    function isMgIdUnique(maintenanceDomain, mdIndex) {
      var mgList = [];
      for (var mdIndex in maintenanceDomain) {
        if (mdIndex != 1) {
          var maintenanceassociation = maintenanceDomain[mdIndex]["ma"]["maintenance-association"];
          for (var maIndex in maintenanceassociation) {
            var maintenanceAssociationMep = maintenanceassociation[maIndex]["mep"]["maintenance-association-mep"];
            for (var mepIndex in maintenanceAssociationMep) {
              var mgid = maintenanceAssociationMep[mepIndex]["maintenance-group-id"];
              if (mgList.indexOf(mgid) != -1) {
                return false;
              }
              mgList.push(mgid);
            }
          }
        }
      }
      return true;
    }
  
    function validateNtrRegion(baseArgs, clockJson, stageName, topology) {
      var stageArgs = [stageName, baseArgs["deviceID"], "ARGS"].join("_");
      if (intentConstants.SUPPORTED_CLOCK_NTR_REGION.indexOf(clockJson["ntr-region"]) === -1) {
        throw new RuntimeException("NTR Region of clock should be one of " + JSON.stringify(intentConstants.SUPPORTED_CLOCK_NTR_REGION));
      }
      var oldConfiguartion = apUtils.getStageArgsFromTopologyXtraInfo(topology, stageArgs);
      if (oldConfiguartion && oldConfiguartion[baseArgs["deviceID"]] && oldConfiguartion[baseArgs["deviceID"]]["ntr-region"]) {
        var oldNtrRegion = oldConfiguartion[baseArgs["deviceID"]]["ntr-region"]["value"];
        if (oldNtrRegion && oldNtrRegion !== clockJson["ntr-region"]) {
          throw new RuntimeException("Can not modify the NTR Region of clock");
        }
      }
      baseArgs["ntr-region"] = clockJson["ntr-region"];
    }
  
    function getRadiusDetails(baseArgs, fwk, deviceDetails) {
      var intentConfigJson = requestContext.get("intentConfigJson");
      if (intentConfigJson["configuration-profile"]) {
        if (baseArgs["nwSlicingUserType"] === intentConstants.NETWORK_SLICING_USER_TYPE_NON_SLICING) {
          var configurationProfilesObject = apUtils.getIntentAttributeObjectValues("intent-attributes.json", "configuration-profile", "name", intentConfigJson["configuration-profile"], deviceDetails);
          apUtils.getMergedObject(baseArgs, configurationProfilesObject);
          var radiusConfigProfileName = configurationProfilesObject["radius-server-profile-id"];
          if (radiusConfigProfileName && profilesJsonMap["radius-server-profile"]) {
            var radiusDetail;
            for (var inx in profilesJsonMap["radius-server-profile"]) {
              if (profilesJsonMap["radius-server-profile"][inx]["name"] === radiusConfigProfileName) {
                radiusDetail = JSON.parse(JSON.stringify(profilesJsonMap["radius-server-profile"][inx]));
                break;
              }
            }
            if (radiusDetail) {
              baseArgs["radius-detail"] = radiusDetail;
              if(radiusDetail["servers"] && radiusDetail["servers"].length > 0){
                for (var radServerinx in radiusDetail["servers"]) {
                  if (radiusDetail["servers"][radServerinx]["radius-server-cert"] && (radiusDetail["servers"][radServerinx]["radius-server-cert"]["server-certs"] || radiusDetail["servers"][radServerinx]["radius-server-cert"]["ca-certs"])) {
                    baseArgs["isRadiusServerCaCertsPresent"] = true;
                    break;
                  }
                }
              }
              var radiusServerInput = {};
              radiusServerInput["radius-server-profile"] = [radiusDetail];
              var radiusServerOp = {};
              fwk.convertObjectToNetconfFwkFormat(radiusServerInput, inputSchema["authenticationSchema"], radiusServerOp);
              if (radiusServerOp["radius-server-profile"][radiusConfigProfileName]) {
                if (radiusServerOp["radius-server-profile"][radiusConfigProfileName]["servers"]) {
                  baseArgs["radius-servers"] = radiusServerOp["radius-server-profile"][radiusConfigProfileName]["servers"];
                }
                if (radiusServerOp["radius-server-profile"][radiusConfigProfileName]["policy"]) {
                  baseArgs["radius-policy"] = radiusServerOp["radius-server-profile"][radiusConfigProfileName]["policy"];
                }
                if (radiusServerOp["radius-server-profile"][radiusConfigProfileName]["domain"]) {
                  baseArgs["radius-domain"] = radiusServerOp["radius-server-profile"][radiusConfigProfileName]["domain"];
                }
                if (radiusServerOp["radius-server-profile"][radiusConfigProfileName]["ca-certs"]) {
                  baseArgs["radius-ca-certs"] = radiusServerOp["radius-server-profile"][radiusConfigProfileName]["ca-certs"];
                 }
               if (radiusServerOp["radius-server-profile"][radiusConfigProfileName]["server-certs"]) {
                  baseArgs["radius-server-certs"] = radiusServerOp["radius-server-profile"][radiusConfigProfileName]["server-certs"];
                }
              }
            }
          }
        }
      }
    }
  
    function getSyslogCollectorDetails(baseArgs, intentConfigJson, fwk) {
        if (intentConfigJson["configuration-profile"]) {
            var configurationProfilesObject;
            var isFacilityValidForNTAndLT = "true";
            var facilityInvalidForNTAndLT = ["user", "syslog", "ftp", "ntp", "all"];
            
            if (profilesJsonMap[profileConstants.CONFIGURATION_PROFILES.profileType]) {
                for (var index in profilesJsonMap[profileConstants.CONFIGURATION_PROFILES.profileType]) {
                    if (profilesJsonMap[profileConstants.CONFIGURATION_PROFILES.profileType][index].name == intentConfigJson["configuration-profile"]) {
                        configurationProfilesObject = profilesJsonMap[profileConstants.CONFIGURATION_PROFILES.profileType][index];
                    }
                }
                if (configurationProfilesObject) {
                    var syslogCollectorProfileName = configurationProfilesObject["syslog-collector-profile-id"];
                    if (syslogCollectorProfileName && profilesJsonMap[profileConstants.SYSLOG_COLLECTOR_PROFILE.profileType]) {
                        var syslogCollectorDetails;
                        for (var index in profilesJsonMap[profileConstants.SYSLOG_COLLECTOR_PROFILE.profileType]) {
                            if (profilesJsonMap[profileConstants.SYSLOG_COLLECTOR_PROFILE.profileType][index].name == syslogCollectorProfileName) {
                                syslogCollectorDetails = profilesJsonMap[profileConstants.SYSLOG_COLLECTOR_PROFILE.profileType][index];
                            }
                        }
                        logger.debug("syslog Collector profile from Configuration profile {}", JSON.stringify(syslogCollectorDetails));
                        if (!syslogCollectorDetails) {
                            throw new RuntimeException("Syslog Collector Profile/All '" + syslogCollectorProfileName + "' is not associated");
                        }
  
                        var destinationDuplicate = validateSyslogCollectorProfile(baseArgs, syslogCollectorDetails);
                        if (destinationDuplicate) {
                          throw new RuntimeException("Syslog Collector Profile/All '" + syslogCollectorProfileName + "': The Address and UDP Port " + destinationDuplicate + " are duplicated.");
                        }
  
                        if (syslogCollectorDetails && syslogCollectorDetails["syslog-destination"] && syslogCollectorDetails["syslog-destination"].length > 0) {
                            for (var index in syslogCollectorDetails["syslog-destination"]) {
                              if(syslogCollectorDetails["syslog-destination"][index]["name"]){
                                if (syslogCollectorDetails["syslog-destination"][index]["facility-filter"] && syslogCollectorDetails["syslog-destination"][index]["facility-filter"].length > 0) {
                                  for (var index2 in syslogCollectorDetails["syslog-destination"][index]["facility-filter"]) {
                                    if(syslogCollectorDetails["syslog-destination"][index]["facility-filter"][index2]["id"]){
                                      syslogCollectorDetails["syslog-destination"][index]["facility-filter"][index2]["facility#severity"] = syslogCollectorDetails["syslog-destination"][index]["facility-filter"][index2].facility + "#" + syslogCollectorDetails["syslog-destination"][index]["facility-filter"][index2].severity;
                                      var facility = syslogCollectorDetails["syslog-destination"][index]["facility-filter"][index2].facility;
                                        
                                      if (facilityInvalidForNTAndLT.indexOf(facility) < 0) {
                                        isFacilityValidForNTAndLT = "false";
                                      }
                                      syslogCollectorDetails["syslog-destination"][index]["facility-filter"][index2]["isFacilityValidForNTAndLT"] = isFacilityValidForNTAndLT;
                                    }else{
                                      throw new RuntimeException("Syslog Collector Profile/All/ '" + syslogCollectorProfileName + "' is missing mandatory key(s) : id in the facility-filter");
                                    }
                                  }
                                }
                                if(!syslogCollectorDetails["syslog-destination"][index]["address"] && !syslogCollectorDetails["syslog-destination"][index]["port"] && syslogCollectorDetails["syslog-destination"][index]["name"] == intentConstants.AP_SYSLOG_DESTINATION){
                                  var syslogDetails = apUtils.getSyslogDetails(baseArgs["deviceID"]);
                                  syslogCollectorDetails["syslog-destination"][index]["address"]= syslogDetails["ipAddress"];
                                  syslogCollectorDetails["syslog-destination"][index]["port"]= syslogDetails["port"];
                                }
                                apUtils.handleLeafListCase(syslogCollectorDetails["syslog-destination"][index], "event-source");
                              } else{
                                throw new RuntimeException("Syslog Collector Profile/All/ '" + syslogCollectorProfileName + "' is missing mandatory key(s) : name");
                              }
                            }
                            var convertedSyslogCollectorDetails = {};
                            fwk.convertObjectToNetconfFwkFormat(syslogCollectorDetails, inputSchema["syslogCollectorSchema"], convertedSyslogCollectorDetails);
                            baseArgs["syslog-collector-profile"] = convertedSyslogCollectorDetails["syslog-destination"];                          
                            logger.debug("final syslog Collector profile in baseArgs {}", JSON.stringify(baseArgs["syslog-collector-profile"]));
                        }
                    }
                }
            }
        }
    }
  
    function validateSyslogCollectorProfile(baseArgs, syslogCollectorProfiles) {
      if (baseArgs.operation == "remove" || syslogCollectorProfiles.length == 0) {
        return false;
      }
      var seenAddressesPorts = {};
      var destinations = syslogCollectorProfiles["syslog-destination"] || [];
  
      for (var destinationIndex = 0; destinationIndex < destinations.length; destinationIndex++) {
        var profile = destinations[destinationIndex];
        var address = profile.address;
        var port = profile.port;
        var addressPortPair = address + ":" + port;
  
        if (seenAddressesPorts[addressPortPair]) {
          return addressPortPair;
        }
  
        seenAddressesPorts[addressPortPair] = true;
      }
  
      return false;
    }
  
    function computeNewQosPolicyProfile() {
      var listQosBuild = [];
      for (var speedIndex in profilesJsonMap["speed-profile"]) {
          var speedProfileDetail = profilesJsonMap["speed-profile"][speedIndex];
          for(var userServiceIndex in profilesJsonMap["user-service-profile"]){
              var userServiceProfileDetail = profilesJsonMap["user-service-profile"][userServiceIndex];
              if(userServiceProfileDetail && speedProfileDetail && userServiceProfileDetail["speed-profile-ref"] && userServiceProfileDetail["name"] && speedProfileDetail["name"] && speedProfileDetail["name"] === userServiceProfileDetail["speed-profile-ref"]){
                var isCreatedQosProfile = false;
                var profileVersion = "1"
                // case US
                if(speedProfileDetail["upstream-policy-profile-id"] && userServiceProfileDetail["subscriber-ingress-qos-profile-id"]){
                    if(validatesPolicyContainSpeed(speedProfileDetail["upstream-policy-profile-id"], profilesJsonMap["policies"], profilesJsonMap["classifiers"])) {
                          var policyList;
                          var baseRelease;
                          isCreatedQosProfile = true;
                          for(var qosIndex in profilesJsonMap["qos-policy-profiles"]){
                              if(profilesJsonMap["qos-policy-profiles"][qosIndex] && profilesJsonMap["qos-policy-profiles"][qosIndex]["name"] && profilesJsonMap["qos-policy-profiles"][qosIndex]["name"] === userServiceProfileDetail["subscriber-ingress-qos-profile-id"]){
                                  policyList = JSON.parse(JSON.stringify(profilesJsonMap["qos-policy-profiles"][qosIndex]["policy-list"]));
                                  baseRelease = profilesJsonMap["qos-policy-profiles"][qosIndex]["baseRelease"];
                                  profileVersion = profilesJsonMap["qos-policy-profiles"][qosIndex]["profileVersion"];
                                  break;
                              }
                          }
                          if(policyList){
                            // check old qos contain policy has speed
                            for(var policyIndex in policyList){
                             var policyDetail = policyList[policyIndex];
                             if(policyDetail && policyDetail["name"] && validatesPolicyContainSpeed(policyDetail["name"], profilesJsonMap["policies"], profilesJsonMap["classifiers"])){
                                isCreatedQosProfile = false;
                                break;
                              } 
                            }
                          } else {      
                            isCreatedQosProfile = false
                          }
                          if(isCreatedQosProfile && policyList && baseRelease && profileVersion){
                              policyList = [{name: speedProfileDetail["upstream-policy-profile-id"]}].concat(policyList);
                              listQosBuild.push({
                                name: userServiceProfileDetail["subscriber-ingress-qos-profile-id"] + "_" + speedProfileDetail["name"],
                                "policy-list": policyList,
                                baseRelease: baseRelease,
                                profileVersion: profileVersion,
                                "isInternalProfile": true
                              })
                          }
                  }
                }
                // case DS
                if(speedProfileDetail["downstream-policy-profile-id"] && userServiceProfileDetail["subscriber-egress-qos-profile-id"]){
                  if(validatesPolicyContainSpeed(speedProfileDetail["downstream-policy-profile-id"], profilesJsonMap["policies"], profilesJsonMap["classifiers"])) {
                          var policyList;
                          var baseRelease;
                          isCreatedQosProfile = true;
                          for(var qosIndex in profilesJsonMap["qos-policy-profiles"]){
                              if(profilesJsonMap["qos-policy-profiles"][qosIndex] && profilesJsonMap["qos-policy-profiles"][qosIndex]["name"] && profilesJsonMap["qos-policy-profiles"][qosIndex]["name"] === userServiceProfileDetail["subscriber-egress-qos-profile-id"]){
                                  policyList = JSON.parse(JSON.stringify(profilesJsonMap["qos-policy-profiles"][qosIndex]["policy-list"]));
                                  baseRelease = profilesJsonMap["qos-policy-profiles"][qosIndex]["baseRelease"];
                                  profileVersion = profilesJsonMap["qos-policy-profiles"][qosIndex]["profileVersion"];
                                  break;
                              }
                          }
                          if(policyList){
                             // check old qos contain policy has speed
                             for(var policyIndex in policyList){
                              var policyDetail = policyList[policyIndex];
                              if(policyDetail && policyDetail["name"] && validatesPolicyContainSpeed(policyDetail["name"], profilesJsonMap["policies"], profilesJsonMap["classifiers"])){
                                  isCreatedQosProfile = false;
                                  break;
                              } 
                            }
                          } else {      
                            isCreatedQosProfile = false
                          }
                          if(isCreatedQosProfile && policyList && baseRelease && profileVersion){
                              policyList = [{name: speedProfileDetail["downstream-policy-profile-id"]}].concat(policyList);
                              listQosBuild.push({
                                name: userServiceProfileDetail["subscriber-egress-qos-profile-id"] + "_" + speedProfileDetail["name"],
                                "policy-list": policyList,
                                baseRelease: baseRelease,
                                profileVersion: profileVersion,
                                "isInternalProfile": true
                              })
                          }
                  }
                }
              }
            }
        } 
  
      return listQosBuild;
    }
  
    function getProfileFromTheList(profileName, profileList){
      var profile;
      if(!profileName || !profileList){
        return profile;
      }
  
      for(var index in profileList){
        if( profileName == profileList[index]["name"]){
          profile = profileList[index];
          break;
        }
      }
      return profile;
    }
  
    function checkMisMatchQosProfile(qosPolicyComputed) {
      var templateResourcePrefix = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR +
      intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR;
      var resourceFile = resourceProvider.getResource(templateResourcePrefix + "esQueryProfile.json.ftl");
      var templateArgs = {
          "profileName": qosPolicyComputed["name"],
          "baseRelease": qosPolicyComputed["baseRelease"]
      }
      try {
          var request = utilityService.processTemplate(resourceFile, templateArgs);
          var response = apUtils.executeEsProfileSearchRequest(request);
          if (apUtils.isResponseContainsData(response)) {
              var actualPolicies = response.hits.hits[0]["_source"]["linked-profiles"][0]["profile-names"];
              if (actualPolicies) {
                  var isProfileExist = true;
              }
              var computePolicies = [];
              qosPolicyComputed["policy-list"].forEach(function(data) {
                  computePolicies.push(data["name"]);
              })
              var differencePolicies = actualPolicies.filter(x => computePolicies.indexOf(x) == -1);
              if (differencePolicies && differencePolicies.length > 0) {
                  qosPolicyComputed["policy-list-removed"] = [];
                  differencePolicies.forEach(function (data) {
                      qosPolicyComputed["policy-list-removed"].push({"name": data})
                  })
              }
              var newAddPolicies = computePolicies.filter(x => actualPolicies.indexOf(x) == -1);
              if (newAddPolicies && newAddPolicies.length > 0) {
                  qosPolicyComputed["policy-list-added"] = [];
                  newAddPolicies.forEach(function (data) {
                      qosPolicyComputed["policy-list-added"].push({"name": data})
                  })
              }
          }
        } catch (e) {
            logger.warn("Error when check mismatch qos policy profile: {}", e);
        }
        return {"qosPolicyComputed": qosPolicyComputed, "isProfileExist": isProfileExist };
    }
  
    function countIntentL2UserUsedProfile(profileName, profileType, subType) {
      var resourceFile = resourceProvider.getResource(internalResourcePrefix + "esQueryL2UserTargetDeviceUsedProfile.json.ftl");
      var templateArgs = {
          "profileName": profileName,
          "profileType": profileType,
          "subType": subType
      }
      try {
          var request = utilityService.processTemplate(resourceFile, templateArgs);
          var response = apUtils.executeEsIntentSearchRequest(request);
          if (apUtils.isResponseContainsData(response)) {
              return response.hits.total.value;
          }
        } catch (e) {
            logger.warn("Error when count intent l2 user used profile: {}", e);
        }
        return 0;
    }
  
    function validatesPolicyContainSpeed(policyName, policiesProfiles, classiferProfiles) {
      var isSpeedIncluded = false;
      var policyProfile = getProfileFromTheList(policyName, policiesProfiles);
      if (policyProfile && policyProfile["classifiers"]) {
          policyProfile["classifiers"].forEach(function(classifierName) {
            if(classifierName["name"]){
              var classifierProfile = getProfileFromTheList(classifierName["name"], classiferProfiles);
              if (classifierProfile && classifierProfile["classifier-action-entry-cfg"]) {
                  classifierProfile["classifier-action-entry-cfg"].forEach(function(entry) {
                    if(entry && entry["policing"] && entry["policing"]["policing-profile"]) {
                      isSpeedIncluded = true;
                    }
                })
              }
            }
          })
      } else {
          throw new RuntimeException("Policy Profile/LS-Fiber " + policyName + " being referenced in Speed Profile/LS-Fiber or User Service Profile does not have speed parameters defined"); 
      }
      return isSpeedIncluded;
    }
  });
  
  