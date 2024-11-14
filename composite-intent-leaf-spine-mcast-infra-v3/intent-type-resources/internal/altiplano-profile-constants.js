function AltiplanoProfileConstants() {
  return {
    APPLICATION_PROFILE_BSO: {
      profileType: "application",
      subType: "APP-BSO",
    },
    BANDWIDTH_SHARING_PROFILE_BSO: {
      profileType: "bandwidth-sharing-profile",
      subType: "APP-BSO",
    },
    BANDWIDTH_SHARING_POLICY_PROFILE_BSO: {
      profileType: "bandwidth-sharing-policy",
      subType: "APP-BSO",
    },
    NTP_SERVER_PROFILE_LS: {
      profileType: "ntp-server-profiles",
      subType: "Lightspan",
    },
    NTP_SERVER_PROFILE_ISAM: {
      profileType: "ntp-server-profile",
      subType: "isam",
    },
    TZ_NAME_PROFILE_LS: {
      profileType: "timezone-name-profile",
      subType: "Lightspan",
    },
    IXR_DISCOVERY_RULE_PROFILE: {
      profileType: "discovery-rule-profile",
      subType: "IXR",
    },
    IXR_MEDIATION_POLICY_PROFILE: {
      profileType: "mediation-policy-profile",
      subType: "IXR",
    },
    IXR_DEVICE_REACHABILITY_POLICY_PROFILE: {
      profileType: "reachability-policy-profile",
      subType: "IXR",
    },
    IXR_SAP_INGRESS_POLICY: {
      profileType: "sap-ingress-policy-profile",
      subType: "IXR",
    },
    IXR_SAP_INGRESS_CLASSIFICATION_POLICY: {
      profileType: "sap-ingress-classification-policy-profile",
      subType: "IXR",
    },
    IXR_SERVICE_INGRESS_ACCESS_QOS_POLICY: {
      profileType: "service-ingress-access-qos-policies",
      subType: "IXR",
    },
    IXR_QOS_EGRESS_NETWORK_POLICY_PROFILE: {
      profileType: "qos-egress-network-policy-profile",
      subType: "IXR",
    },
    DSL_PROFILE_LS: {
      profileType: "dsl-profile",
      subType: "Lightspan",
    },
    MOCA_PROFILE: {
      profileType: "moca-profile",
      subType: "COAX",
    },
    CPE_TRAFFIC_RATE_MOCA: {
      profileType: "associated-devices",
      subType: "COAX",
    },
    L2_LINK_PROFILE: {
      profileType: "l2-link-profile",
      subType: "",
    },
    L2_LINK_PROFILE_LS: {
      profileType: "l2-link-profile",
      subType: "LS-Subscriber",
    },
    L2_LINK_PROFILE_LS_NETWORK: {
      profileType: "l2-link-profile",
      subType: "LS-Network",
    },
    CONFIGURATION_PROFILE_LS: {
      profileType: "configuration-profile",
    },
    CONFIGURATION_PROFILE_LS_MX: {
      profileType: "configuration-profile",
      subType: "LS-MX",
    },
    CONFIGURATION_PROFILE_ISAM: {
      profileType: "configuration-profile",
      subType: "ISAM",
    },
    USER_SERVICE_PROFILE_LS: {
      profileType: "user-service-profile",
      subTypeDpu: "LS-SX-DX",
      subTypeMx: "LS-MX",
      subTypeVonu: "LS-ONT",
      subTypeFx: "LS-FX",
      subTypeMf: "LS-MF",
      subTypeSf: "LS-SF",
      subTypeDfA: "LS-DF-CFXR-A",
      subTypeDfE: "LS-DF-CFXR-E",
      subTypeDfH: "LS-DF-CFXR-H",
      subTypeDfF: "LS-DF-CFXR-F",
      subTypeEthernet: "LS-Ethernet-DOWNLINK",
      subTypeEthernetUplink: "LS-Ethernet-UPLINK",
      subTypeCoax: "COAX",
    },
    EXTERNAL_ALARM_PROFILE_LS: {
      profileType: "external-alarm",
      subType: "LS-SX-DX",
    },
    DEVICE_OAM_CONNECTIVITY_ACCOUNT: {
      profileType: "device-oam-connectivity-account",
      subType: "any",
    },
    DEVICE_OAM_CONNECTIVITY_ACCOUNT_ISAM: {
      profileTypeIsam: "device-oam-connectivity-account",
      subTypeIsam: "ISAM",
    },
    DEVICE_OAM_CONNECTIVITY_ACCOUNT_COAX: {
      profileType: "device-oam-connectivity-account",
      subTypeCOAX: "COAX",
    },
    FORWARDER_PROFILE_LS: {
      profileType: "forwarder-profile",
    },
    NETWORK_SERVICE_PROFILE_LS: {
      profileType: "network-service-profile",
      subTypeDpu: "LS-SX-DX",
      subTypeMx: "LS-MX",
    },
    MULTICAST_NETWORK_SERVICE_PROFILE: {
      profileType: "multicast-network-service-profile",
      subType: "all",
    },
    MULTICAST_PROXY_PROFILE: {
      profileType: "multicast-proxy-profile",
      subType: "Lightspan",
    },
    DEPENDENCY_TYPE: {
      strong: "strong",
      low: "low",
      none: "none",
    },
    EXTERNAL_ALARM_PROFILE_LS_MX: {
      profileType: "external-alarm",
      subType: "LS-MX",
    },
    MULTICAST_USER_SERVICE_PROFILE_LS: {
      profileType: "multicast-user-service-profile",
      subTypeDpu: "LS-SX-DX",
      subTypeMx: "LS-MX",
      subTypeVonu: "VONU",
      subTypeFx: "LS-FX",
      subTypeDf: "LS-DF",
      subTypeMf: "LS-MF",
      subTypeSf: "LS-SF",
      subTypeFxEthernet: "LS-ETHERNET",
    },
    LINK_AGGREGATION_GROUP_PROFILE: {
      profileType: "link-aggregation-group-profile",
      subTypeMx: "LS-MX",
    },
    L1_PROFILE_ISAM_FX_FELT: {
      profileType: "l1-profile",
      subType: "ISAM-FX-FELT",
    },
    L1_PROFILE_ISAM_FX_NELT: {
      profileType: "l1-profile",
      subType: "ISAM-FX-NELT",
    },
    L2_LINK_PROFILE_ISAM_ETHERNET_CONNECTION: {
      profileType: "l2-link-profile",
      subType: "ISAM-Ethernet-Connection",
    },
    LINK_AGGREGATION_GROUP_PROFILE_ISAM_FX_FELT: {
      profileType: "link-aggregation-group-profile",
      subType: "ISAM-FX-FELT",
    },
    LINK_AGGREGATION_GROUP_PROFILE_ISAM_FX_NELT: {
      profileType: "link-aggregation-group-profile",
      subType: "ISAM-FX-NELT",
    },
    L1_PROFILE_LS_FX_FELT_ETH: {
      profileType: "l1-profile",
      subType: "LS-Ethernet",
    },
    L2_LINK_PROFILE_FX_FELT_ETH: {
      profileType: "l2-link-profile",
      subType: "LS-Ethernet-Connection",
    },
    L2_LINK_PROFILE_IXR: {
      profileType: "l2-link-profile",
      subType: "IXR",
    },
    LINK_AGGREGATION_GROUP_PROFILE_FX_FELT_ETH: {
      profileType: "link-aggregation-group-profile",
      subType: "LS-Ethernet",
    },
    MULTICAST_USER_SERVICE_PROFILE: {
      profileType: "multicast-user-service-profile",
      subType: "ISAM",
    },
    DSL_PROFILE_ISAM_SINGLE_LINE: {
      profileType: "dsl-profile",
      subType: "ISAM-Single-Line",
    },
    DSL_PROFILE_ISAM_BONDED_LINE: {
      profileType: "dsl-profile",
      subType: "ISAM-Bonded-Line",
    },
    L2_LINK_PROFILE_ISAM_FX: {
      profileType: "l2-link-profile",
      subType: "ISAM-FX-Subscriber",
    },
    L2_LINK_PROFILE_ISAM_MX: {
      profileType: "l2-link-profile",
      subType: "ISAM-MX-Subscriber",
    },
    BOARD_SERVICE_PROFILE: {
      profileType: "board-service-profile",
      subType: "ISAM-FX",
      subTypeDF: "ISAM-DF",
      subTypeETH: "LS-FX-ETH",
    },
    BOARD_SERVICE_PROFILE_MF: {
      profileType: "board-service-profile",
      subtypeMFLT: "LS-MF-LT",
      subtypeMFNTIO: "LS-MF-NTIO",
      subtypeMFNT: "LS-MF-NT",
      subtypeMFACU: "LS-MF-ACU",
    },
    BOARD_SERVICE_PROFILE_IXR: {
      profileType: "board-service-profile",
      subType: "IXR",
      subTypeIDC: "IXR-DAUGHTER-CARD",
    },
    LINK_AGGREGATION_GROUP_PROFILE_ISAM_DF: {
      profileType: "link-aggregation-group-profile",
      subType: "ISAM-DF",
    },
    LINK_AGGREGATION_GROUP_PROFILE_ISAM_FX: {
      profileType: "link-aggregation-group-profile",
      subType: "ISAM-FX",
    },
    LINK_AGGREGATION_GROUP_PROFILE_ISAM_MX: {
      profileType: "link-aggregation-group-profile",
      subType: "ISAM-MX",
    },
    L1_PROFILE_ISAM_FX: {
      profileType: "l1-profile",
      subType: "ISAM-FX",
    },
    L1_PROFILE_ISAM_MX_DF: {
      profileType: "l1-profile",
      subType: "ISAM-MX-DF",
    },
    L2_LINK_PROFILE_ISAM_NETWORK: {
      profileType: "l2-link-profile",
      subType: "ISAM-Network",
    },
    L2_LINK_PROFILE_ISAM_FX_NETWORK: {
      profileType: "l2-link-profile",
      subType: "ISAM-FX-Network",
    },
    L2_LINK_PROFILE_ISAM_MX_NETWORK: {
      profileType: "l2-link-profile",
      subType: "ISAM-MX-Network",
    },
    L2_LINK_PROFILE_ISAM_DF_NETWORK: {
      profileType: "l2-link-profile",
      subType: "ISAM-DF-Network",
    },
    CONNECTOR_PORT_PROFILE_ISAM_FX: {
      profileType: "connector-port-profile",
      subType: "ISAM-FX",
    },
    CONNECTOR_PORT_PROFILE_IXR: {
      profileType: "connector-port-profile",
      subType: "IXR",
    },
    FREQUENCY_SYNC_IN_PROFILES_ISAM: {
      profileType: "frequency-sync-in-profiles",
      subType: "ISAM",
    },
    FREQUENCY_SYNC_OUT_PROFILES_ISAM: {
      profileType: "frequency-sync-out-profiles",
      subType: "ISAM",
    },
    PHASE_SYNC_PROFILES_ISAM: {
      profileType: "phase-sync-profiles",
      subType: "ISAM",
    },
    L3_SERVICE_PROFILE: {
      profileType: "l3-service-profile",
      subType: "ISAM",
    },
    L3_SERVICE_PROFILE_NAV: {
      profileType: "l3-service-profile",
      subType: "Lightspan",
    },
    SERVICE_INTERFACE_PROFILE: {
      profileType: "service-interface-profile",
      subType: "Lightspan",
    },
    SGT_QOS_PROFILE: {
      profileType: "sgt-qos-profile",
      subType: "Lightspan",
    },
    MA_DOMAIN_PROFILE: {
      profileType: "ma-domain-profile",
      subType: "IHUB",
      subTypeIsam: "ISAM",
      subTypeOnt: "LS-ONT",
      subTypeEth: "LS-Ethernet",
      subTypeFiber: "LS-Fiber",
      subTypeIXR: "IXR",
    },
    MA_ASSOCIATION_PROFILE: {
      profileType: "ma-association-profile",
      subType: "IHUB",
      subTypeIsamEth: "ISAM-Ethernet",
      subTypeOnt: "LS-ONT",
      subTypeEth: "LS-Ethernet",
      subTypeFiber: "LS-Fiber",
      subTypeIXR: "IXR",
    },
    MA_ENDPOINT_PROFILE: {
      profileType: "ma-endpoint-profile",
      subType: "IHUB",
      subTypeIsamEth: "ISAM-Ethernet",
      subTypeOnt: "LS-ONT",
      subTypeEth: "LS-Ethernet",
      subTypeFiber: "LS-Fiber",
      subTypeIXR: "IXR",
    },
    MEDIATION_SESSION_PROFILE: {
      profileType: "mediation-session-profile",
      subType: "ISAM",
    },
    PTP_CCSA_PORT_PROFILES_ISAM: {
      profileType: "ptp-ccsa-port-profiles",
      subType: "ISAM",
    },
    PTP_G8275DOT1_PORT_PROFILES_ISAM: {
      profileType: "ptp-g8275dot1-port-profiles",
      subType: "ISAM",
    },
    MGMT_VLAN_ISAM: {
      profileType: "mgmt-vlan",
      subTypeFX: "ISAM-FX",
      subTypeDF: "ISAM-DF",
      subTypeMX: "ISAM-MX",
    },
    FIBER_PORT_PROFILE: {
      profileType: "fiber-port-profile",
      subTypeFX: "LS-FX",
      subTypeSF: "LS-SF",
      subTypeDF: "LS-DF",
      subTypeMF: "LS-MF",
    },
    FIBER_CONGESTION_PROFILE: {
      profileType: "fiber-congestion-profile",
      subTypeFX: "LS-FX",
      subTypeSF: "LS-SF",
      subTypeDF: "LS-DF",
      subTypeMF: "LS-MF",
    },
    FIBER_BANDWIDTH_ALLOCATION_PROFILE: {
      profileType: "fiber-bandwidth-allocation-profile",
      subType: "Lightspan",
    },
    SLICE_PROFILES: {
      profileType: "slice-profiles",
      subType: "Lightspan",
    },
    FIXED_ACCESS_SLICE_SERVICE_PROFILE: {
      profileType: "fixed-access-slice-service-profile",
      subType: "All",
    },
    FIBER_SLICE_BANDWIDTH_ALLOCATION_PROFILE: {
      profileType: "fiber-slice-bandwidth-allocation-profile",
      subTypePerOC: "Per-ONT-Connection",
      subTypePerSlice: "Per-Slice",
    },
    UPLINK_SLICE_PROFILES: {
      profileType: "uplink-slice-profiles",
      subType: "Lightspan",
    },
    TCONT_PROFILE_LS: {
      profileType: "tcont-profile",
      subTypeOnt: "LS-ONT",
      subTypeFx: "LS-FX",
      subTypeDf: "LS-DF",
      subTypeMf: "LS-MF",
    },
    EXTERNAL_ALARM_PROFILE_LS_SF: {
      profileType: "external-alarm",
      subType: "LS-SF",
    },
    BOARD_SERVICE_PROFILE_LS_SF_LT: {
      profileType: "board-service-profile",
      subType: "LS-SF-LT",
    },
    BOARD_SERVICE_PROFILE_LS_SF_NT: {
      profileType: "board-service-profile",
      subType: "LS-SF-NT",
    },
    EXTERNAL_ALARM_PROFILE_MF: {
      profileType: "external-alarm",
      subType: "LS-MF",
    },
    BOARD_SERVICE_PROFILE_LS_FX_ACU: {
      profileType: "board-service-profile",
      subType: "LS-FX-ACU",
    },
    BOARD_SERVICE_PROFILE_LS_FX_NTIO: {
      profileType: "board-service-profile",
      subType: "LS-FX-NTIO",
    },
    EXTERNAL_ALARM_PROFILE_LS_FX: {
      profileType: "external-alarm",
      subType: "LS-FX",
    },
    BOARD_SERVICE_PROFILE_LS_FX_LT: {
      profileType: "board-service-profile",
    },
    EXTERNAL_ALARM_PROFILE_DF: {
      profileType: "external-alarm",
      subType: "LS-DF",
    },
    BOARD_SERVICE_PROFILE_DF: {
      profileType: "board-service-profile",
      subType: "LS-DF",
    },
    CACHE_PROFILES: {
      profileType: "cache",
      subType: "LS-DF",
    },
    IPFIX_PROFILES: {
      profileType: "ipfix-profile",
      subType: "LS-Fiber",
    },
    FLOODING_POLICIES_PROFILES: {
      profileType: "flooding-policies-profiles",
      subType: "LS-Fiber",
    },
    MAC_LEARNING_CONTROL_PROFILES: {
      profileType: "mac-learning-control-profiles",
      subType: "LS-Fiber",
    },
    SPLIT_HORIZON_PROFILES: {
      profileType: "split-horizon-profiles",
      subType: "LS-Fiber",
    },
    L2_DHCPV4_RELAY_PROFILES: {
      profileType: "l2-dhcpv4-relay-profiles",
      subType: "LS-Fiber",
    },
    DHCPV6_LDRA_PROFILES: {
      profileType: "dhcpv6-ldra-profiles",
      subType: "LS-Fiber",
      subTypeEth: "LS-Ethernet",
    },
    PPPOE_PROFILES: {
      profileType: "pppoe-profiles",
      subType: "LS-Fiber",
    },
    SUBSCRIBER_PROFILES: {
      profileType: "subscriber-profiles",
      subType: "LS-Fiber",
    },
    COOPER_SUBSCRIBER_PROFILES: {
      profileType: "subscriber-profiles",
      subType: "LS-SX-DX-MX",
    },
    COAX_SUBSCRIBER_PROFILES: {
      profileType: "subscriber-profiles",
      subType: "COAX",
    },
    TRANSCEIVER_TCA_PROFILES: {
      profileType: "transceiver-tca-profiles",
      subType: "LS-Fiber",
      subTypeVonu: "LS-ONT",
    },
    TRANSCEIVER_LINK_TCA_PROFILES: {
      profileType: "transceiver-link-tca-profiles",
      subType: "LS-Fiber",
      subTypeUplink: "UPLINK",
      subTypeVonu: "LS-ONT",
    },
    BER_TCA_PROFILES: {
      profileType: "ber-tca-profiles",
      subType: "LS-Fiber",
      subTypeOnt: "LS-ONT",
    },
    QUEUE_PROFILES: {
      profileType: "queue-profiles",
      subType: "LS-DF",
    },
    CLASSIFIERS_PROFILES: {
      profileType: "classifiers",
      subType: "LS-Fiber",
      subTypeVonu: "LS-ONT",
      subTypeEth: "LS-Ethernet",
    },
    POLICIES_PROFILES: {
      profileType: "policies",
      subType: "LS-Fiber",
      subTypeVonu: "LS-ONT",
      subTypeEth: "LS-Ethernet",
    },
    POLICING_ACTION_PROFILES: {
      profileType: "policing-action-profiles",
      subType: "LS-Fiber",
    },
    POLICING_PRE_HANDLING_PROFILES: {
      profileType: "policing-pre-handling-profiles",
      subType: "LS-Fiber",
    },
    QOS_POLICY_PROFILES: {
      profileType: "qos-policy-profiles",
      subType: "LS-Fiber",
      subTypeVonu: "LS-ONT",
      subTypeEth: "LS-Ethernet",
    },
    POLICING_PROFILES: {
      profileType: "policing-profiles",
      subType: "LS-Fiber",
    },
    BAC_ENTRY_PROFILES: {
      profileType: "bac-entry",
      subType: "Lightspan",
    },
    TRAFFIC_DESCRIPTOR_PROFILES: {
      profileType: "traffic-descriptor-profiles",
      subType: "LS-Fiber",
    },
    SHAPER_PROFILES: {
      profileType: "shaper-profile",
      subType: "Lightspan",
    },
    ENHANCED_FILTERS_PROFILES: {
      profileType: "enhanced-filters",
      subType: "Lightspan",
    },
    VECTOR_OF_DATA_PROFILES: {
      profileType: "vector-of-data-profiles",
      subType: "Lightspan",
    },
    CONNECTION_MANAGEMENT_PROFILES: {
      profileType: "connection-management",
      subType: "Lightspan",
    },
    ICMPV6_PROFILES: {
      profileType: "icmpv6-profiles",
      subType: "Lightspan",
    },
    RADIUS_SERVER_PROFILES: {
      profileType: "radius-server-profile",
      subType: "Lightspan",
    },
    RADIUS_OPERATOR_SERVER_PROFILES: {
      profileType: "radius-server-profile",
      subType: "LS-Operator",
    },
    RADIUS_OPERATOR_AUTHENTICATION_PROFILES: {
      profileType: "radius-operator-authentication-profile",
      subType: "LS-Operator",
    },
    AUTHENTICATION_PROFILES: {
      profileType: "authentication-profile",
      subType: "Lightspan",
    },
    CONFIGURATION_PROFILES: {
      profileType: "configuration-profile",
      subType: "LS-Fiber",
    },
    PTP_CCSA_PORT_PROFILES: {
      profileType: "ptp-ccsa-port-profiles",
      subType: "Lightspan",
    },
    PTP_G8275DOT1_PORT_PROFILES: {
      profileType: "ptp-g8275dot1-port-profiles",
      subType: "Lightspan",
    },
    NTR_REGION_PROFILES: {
      profileType: "ntr-region",
      subType: "All",
    },
    SYSTEM_PROFILES: {
      profileType: "system",
      subType: "LS-Fiber",
      subTypeIsam: "ISAM",
    },
    SYSTEM_IHUB_PROFILES: {
      profileType: "system-ihub",
      subTypeLsIhubFantF: "LS-FX-IHUB-FANT-F",
      subTypeLsIhubFantG: "LS-FX-IHUB-FANT-G",
      subTypeLsIhubFantH: "LS-FX-IHUB-FANT-H",
      subTypeLsIhubFantM: "LS-FX-IHUB-FANT-M",
      subTypeLsIhubMF: "LS-MF-IHUB",
      subTypeLsIhubSF: "LS-SF-IHUB",
      subTypeIsamIhubFantF: "ISAM-FX-IHUB-FANT-F",
      subTypeIsamIhubFantG: "ISAM-FX-IHUB-FANT-G",
      subTypeIsamIhubFantH: "ISAM-FX-IHUB-FANT-H",
      subTypeIsamIhubFantM: "ISAM-FX-IHUB-FANT-M",
    },
    SYSTEM_EGRESS_PORT_QUEUE_POLICIES_PROFILES: {
      profileType: "system-egress-port-queue-policies",
      subTypeLsIhubFantF: "LS-FX-IHUB-FANT-F",
      subTypeLsIhubFantG: "LS-FX-IHUB-FANT-G",
      subTypeLsIhubFantH: "LS-FX-IHUB-FANT-H",
      subTypeLsIhubFantM: "LS-FX-IHUB-FANT-M",
      subTypeLsIhubMF: "LS-MF-IHUB",
      subTypeLsIhubSF: "LS-SF-IHUB",
      subTypeIsamIhubFantF: "ISAM-FX-IHUB-FANT-F",
      subTypeIsamIhubFantG: "ISAM-FX-IHUB-FANT-G",
      subTypeIsamIhubFantH: "ISAM-FX-IHUB-FANT-H",
      subTypeIsamIhubFantM: "ISAM-FX-IHUB-FANT-M",
      subTypeIXR: "IXR"
    },
    RING_SERVICE_PROFILE: {
      profileType: "ring-profile",
      subTypeDf: "LS-DF",
      subTypeIhub: "LS-IHUB",
    },
    CONNECTOR_PORT_PROFILE: {
      profileType: "connector-port-profile",
      subType: "",
    },
    CONNECTOR_PORT_PROFILE_LS_FX: {
      profileType: "connector-port-profile",
      subType: "LS-FX",
    },
    CONNECTOR_PORT_PROFILE_LS_DF: {
      profileType: "connector-port-profile",
      subType: "LS-DF",
    },
    CONNECTOR_PORT_PROFILE_LS_DF_DFMB_C: {
      profileType: "connector-port-profile",
      subType: "LS-DF-DFMB-C",
    },
    CONNECTOR_PORT_PROFILE_LS_MF_LANT_A: {
      profileType: "connector-port-profile",
      subType: "LS-MF-LANT-A",
    },
    CONNECTOR_PORT_PROFILE_LS_MF_LBNT_A: {
      profileType: "connector-port-profile",
      subType: "LS-MF-LBNT-A",
    },
    CONNECTOR_PORT_PROFILE_LS_MF_LMNT_B: {
      profileType: "connector-port-profile",
      subType: "LS-MF-LMNT-B",
    },
    CONNECTOR_PORT_PROFILE_LS_SF: {
      profileType: "connector-port-profile",
      subType: "LS-SF",
    },
    LINK_AGGREGATION_GROUP_PROFILE_LS_DF: {
      profileType: "link-aggregation-group-profile",
      subType: "LS-DF",
    },
    LINK_AGGREGATION_GROUP_PROFILE_LS_DF_IHUB: {
      profileType: "link-aggregation-group-profile",
      subType: "LS-DF-IHUB",
    },
    LINK_AGGREGATION_GROUP_PROFILE_LS_FX: {
      profileType: "link-aggregation-group-profile",
      subType: "LS-FX",
    },
    LINK_AGGREGATION_GROUP_PROFILE_LS_MF: {
      profileType: "link-aggregation-group-profile",
      subType: "LS-MF",
    },
    LINK_AGGREGATION_GROUP_PROFILE_LS_SF: {
      profileType: "link-aggregation-group-profile",
      subType: "LS-SF",
    },
    LINK_AGGREGATION_GROUP_PROFILE_LS_Ethernet: {
      profileType: "link-aggregation-group-profile",
      subType: "LS-Ethernet",
    },
    LINK_AGGREGATION_GROUP_PROFILE_IXR: {
      profileType: "link-aggregation-group-profile",
      subType: "IXR",
    },
    L1_PROFILE_LS_FX: {
      profileType: "l1-profile",
      subType: "LS-FX",
    },
    L1_PROFILE_LS_MF: {
      profileType: "l1-profile",
      subType: "LS-MF",
    },
    L1_PROFILE_LS_SF: {
      profileType: "l1-profile",
      subType: "LS-SF",
    },
    L1_PROFILE_LS_DF: {
      profileType: "l1-profile",
      subType: "LS-DF",
    },
    L1_PROFILE_LS_SX_DX_MX: {
      profileType: "l1-profile",
      subType: "LS-SX-DX-MX",
    },
    L1_PROFILE_COAX: {
      profileType: "l1-profile",
      subType: "COAX",
    },
    L1_PROFILE_LS_ETHERNET: {
      profileType: "l1-profile",
      subType: "LS-Ethernet",
    },
    L1_PROFILE_IXR: {
      profileType: "l1-profile",
      subType: "IXR",
    },
    L1_PROFILE: {
      profileType: "l1-profile",
      subType: "",
    },
    MACSECS_PROFILE: {
      profileType: "macsec-ca-profile",
      subType: "LS-SF",
    },
    L2_LINK_PROFILE_LS_DF_CFXR_A: {
      profileType: "l2-link-profile",
      subType: "LS-DF-CFXR-A",
    },
    L2_LINK_PROFILE_LS_DF_CFXR_E: {
      profileType: "l2-link-profile",
      subType: "LS-DF-CFXR-E",
    },
    L2_LINK_PROFILE_LS_DF_CFXR_H: {
      profileType: "l2-link-profile",
      subType: "LS-DF-CFXR-H",
    },
    FREQUENCY_SYNC_IN_PROFILES_LS: {
      profileType: "frequency-sync-in-profiles",
      subType: "Lightspan",
    },
    FREQUENCY_SYNC_OUT_PROFILES_LS: {
      profileType: "frequency-sync-out-profiles",
      subType: "Lightspan",
    },
    PHASE_SYNC_PROFILES_LS: {
      profileType: "phase-sync-profiles",
      subType: "Lightspan",
    },
    PTP_CCSA_PORT_PROFILES_ILS: {
      profileType: "ptp-ccsa-port-profiles",
      subType: "Lightspan",
    },
    PTP_G8275DOT1_PORT_PROFILES_LS: {
      profileType: "ptp-g8275dot1-port-profiles",
      subType: "Lightspan",
    },
    QUEUE_PROFILES_LS_DF: {
      profileType: "queue-profiles",
      subType: "LS-DF",
    },
    NTR_REGION_ALL: {
      profileType: "ntr-region",
      subType: "All",
    },
    FORWARDER_PROFILE_LS_FX: {
      profileType: "forwarder-profile",
      subType: "LS-FX",
    },
    FORWARDER_PROFILE_LS_DF: {
      profileType: "forwarder-profile",
      subType: "LS-DF",
    },
    FORWARDER_PROFILE_LS_MF: {
      profileType: "forwarder-profile",
      subType: "LS-MF",
    },
    FORWARDER_PROFILE_LS_SF: {
      profileType: "forwarder-profile",
      subType: "LS-SF",
    },
    NETWORK_SERVICE_PROFILE_LS_DF: {
      profileType: "network-service-profile",
      subType: "LS-DF",
    },
    NETWORK_SERVICE_PROFILE_LS_FX: {
      profileType: "network-service-profile",
      subType: "LS-FX",
    },
    NETWORK_SERVICE_PROFILE_LS_MF: {
      profileType: "network-service-profile",
      subType: "LS-MF",
    },
    NETWORK_SERVICE_PROFILE_LS_SF: {
      profileType: "network-service-profile",
      subType: "LS-SF",
    },
    NETWORK_SERVICE_PROFILE_LS_ETHERNET: {
      profileType: "network-service-profile",
      subType: "LS-Ethernet",
    },
    NETWORK_SERVICE_PROFILE_IXR: {
      profileType: "network-service-profile",
      subType: "IXR",
    },
    SGT_QOS_POLICIES_LS_FX_IHUB: {
      profileType: "sgt-qos-policies",
      subType: "LS-FX-IHUB",
    },
    SGT_QOS_POLICIES_LS_MF_IHUB: {
      profileType: "sgt-qos-policies",
      subType: "LS-MF-IHUB",
    },
    SGT_QOS_POLICIES_LS_SF_IHUB: {
      profileType: "sgt-qos-policies",
      subType: "LS-SF-IHUB",
    },
    AGGREGATION_RATE_LIMIT_PROFILE_LS: {
      profileType: "aggregation-rate-limit-profile",
      subType: "IHUB",
    },
    UNI_SERVICE_PROFILE: {
      profileType: "uni-service-profile",
      subTypeFx: "LS-FX",
      subTypeMf: "LS-MF",
      subTypeDf: "LS-DF",
      subTypeSf: "LS-SF",
      subTypeSliceOwnerFx: "Slice-Owner-LS-FX",
      subTypeSliceOwnerDf: "Slice-Owner-LS-DF",
      subTypeIsamFx: "ISAM-FX",
      subTypeIsamDf: "ISAM-DF",
    },
    ONT_SERVICE_PROFILE: {
      profileType: "ont-service-profile",
      subTypeFx: "LS-FX",
      subTypeMf: "LS-MF",
      subTypeDf: "LS-DF",
      subTypeSf: "LS-SF",
      subTypeSliceOwnerPerSliceFx: "Slice-Owner-Per-Slice-LS-FX",
      subTypeSliceOwnerPerSliceDf: "Slice-Owner-Per-Slice-LS-DF",
      subTypeSliceOwnerPerOntFx: "Slice-Owner-Per-ONT-Connection-LS-FX",
      subTypeSliceOwnerPerOntDf: "Slice-Owner-Per-ONT-Connection-LS-DF",
      subTypeIsamFx: "ISAM-FX",
      subTypeIsamDf: "ISAM-DF",
    },
    ONT_SPEED_CONTROL_PROFILE: {
      profileType: "ont-speed-control-profile",
      subType: "LS-ONT",
    },
    POTS_SERVICE_PROFILE: {
      profileType: "pots-service-profile",
      subTypeFx: "LS-FX",
      subTypeMf: "LS-MF",
      subTypeDf: "LS-DF",
      subTypeSf: "LS-SF",
      subTypeSliceOwnerFx: "Slice-Owner-LS-FX",
      subTypeSliceOwnerDf: "Slice-Owner-LS-DF",
    },
    SCHEDULER_NODE_PROFILE: {
      profileType: "scheduler-node-profile",
      subType: "Lightspan",
    },
    DOT1X_PORT_PROFILE: {
      profileType: "dot1x-port-profile",
      subType: "Lightspan",
    },
    DOT1X_SERVICE_PROFILE: {
      profileType: "dot1x-service-profile",
      subType: "Lightspan",
    },
    RADIUS_PORT_DOT1X_TIMER_CONFIGURATION: {
      profileType: "radius-port-802-1x-timer-configuration",
      subType: "Lightspan",
    },
    RADIUS_PORT_DOT1X_AUTH_PROFILE: {
      profileType: "radius-port-802-1x-auth-profile",
      subType: "Lightspan",
    },
    STP_PORT_PROFILE: {
      profileType: "stp-port-profiles",
      subType: "All",
    },
    MSTP_INSTANCE_PROFILE: {
      profileType: "mstp-instance-profiles",
      subType: "All",
    },
    INBAND_MANAGER_PROFILE: {
      profileType: "inband-management-profile",
      subType: "Lightspan",
      subTypeCopper: "LS-Copper",
    },
    LLDP_PORT_PROFILE: {
      profileType: "lldp-port-profile",
      subTypeFx: "LS-FX",
      subTypeDf: "LS-DF",
      subTypeMf: "LS-MF",
      subTypeSf: "LS-SF",
      subTypeIxr: "IXR",
    },
    LLDP_CONFIGURATION_PROFILE: {
      profileType: "lldp-configuration-profile",
      subTypeFx: "LS-FX",
      subTypeDf: "LS-DF",
      subTypeMf: "LS-MF",
      subTypeSf: "LS-SF",
    },
    RSTP_CONFIGURATION_PROFILE: {
      profileType: "rstp-configuration-profile",
      subType: "All",
    },
    MSTP_CONFIGURATION_PROFILE: {
      profileType: "mstp-configuration-profile",
      subType: "All",
    },
    FLAT_SCHEDULING_PROFILE: {
      profileType: "flat-scheduling-profiles",
      subType: "Lightspan",
    },
    ONT_TYPE_PROFILE: {
      profileType: "ont-type",
      subType: "All",
    },
    ONT_HW_LAYOUT_PROFILE: {
      profileType: "ont-hw-layout",
      subType: "All",
    },
    TC_ID_2_QUEUE_ID_MAPPING_PROFILE: {
      profileType: "tc-id-2-queue-id-mapping-profile",
      subTypeVonu: "LS-ONT",
    },
    UNI_CONFIGURATION_PROFILE: {
      profileType: "uni-configuration-profile",
      subType: "All",
    },
    ONU_TEMPLATE_PROFILE: {
      profileType: "onu-template",
      subType: "LS-ONT",
    },
    MULTICAST_INFRA_PROFILE: {
      profileType: "multicast-infra",
      subType: "LS-ONT",
    },
    SPEED_PROFILE: {
      profileType: "speed-profile",
      subTypeISAM: "ISAM",
      subTypeLS: "LS-Fiber",
    },
    MSTI_OVERRIDE_AT_PORT_PROFILE: {
      profileType: "msti-override-at-port-profile",
      subType: "All",
    },
    TRANSPORT_VOIP_SIP_PROFILE: {
      profileType: "transport-voip-sip",
      subType: "LS-ONT",
    },
    VOIP_SIP_AGENT_SERVICE_PROFILE: {
      profileType: "voip-sip-agent-service-profile",
      subTypeLs: "LS-Fiber",
    },
    VOIP_SIP_USER_SERVICE_PROFILE: {
      profileType: "voip-sip-user-service-profile",
      subTypeOnt: "LS-ONT",
    },
    SIP_SUPPLEMENTARY_SERVICES_PROFILE: {
      profileType: "sip-suppl-services-profile",
      subTypeOnt: "LS-ONT",
    },
    SIP_AGENT_PROFILE: {
      profileType: "sip-agent-profile",
      subTypeOnt: "LS-ONT",
    },
    ONT_PROFILES_GROUP: {
      profileType: "ont-profiles-group",
      subType: "LS-ONT",
    },
    QOS_INGRESS_PROFILE: {
      profileType: "qos-ingress-profile",
      subType: "ISAM",
    },
    USER_SERVICE_PROFILE_ISAM: {
      profileType: "user-service-profile",
      subTypeISAM: "ISAM",
    },
    USER_SERVICE_PROFILE_IXR: {
      profileType: "user-service-profile",
      subType: "IXR",
    },
    SYSTEM_LOAD_PROFILE: {
      profileType: "system-load-profile",
      subType: "LS-ONT",
    },
    MEMORY_USAGE_PROFILE: {
      profileType: "memory-usage-profile",
      subType: "LS-ONT",
    },
    ETH_FRAME_ERR_PROFILES: {
      profileType: "eth-frame-error-tca-profile",
      subType: "LS-Fiber",
      subTypeOnt: "LS-ONT",
    },
    ETH_PHY_LAYER_ERR_PROFILES: {
      profileType: "eth-phy-error-tca-profile",
      subType: "LS-Fiber",
      subTypeOnt: "LS-ONT",
    },
    FEC_ERROR_TCA_PROFILE: {
      profileType: "fec-error-tca-profile",
      subType: "LS-Fiber",
      subTypeOnt: "LS-ONT",
    },
    FEC_ERROR_TCA_PROFILE_FX_FELT_ETH: {
      profileType: "fec-error-tca-profile",
      subType: "LS-Ethernet",
      profileName: "init-fec-default",
    },
    TC_LAYER_ERROR_TCA_PROFILE: {
      profileType: "tc-layer-error-tca-profile",
      subType: "LS-Fiber",
      subTypeOnt: "LS-ONT",
    },
    DOWNSTREAM_MIC_ERROR_TCA_PROFILE: {
      profileType: "downstream_mic-error-tca-profile",
      subType: "LS-Fiber",
      subTypeOnt: "LS-ONT",
    },
    L2_LINK_PROFILE_IHUB: {
      profileType: "l2-link-profile",
      subType: "IHUB",
    },
    IPV6_FILTER_PROFILE: {
      profileType: "ipv6-filter-profile",
      subType: "ISAM",
    },
    IP_FILTER_PROFILE: {
      profileType: "ip-filters",
      subType: "IHUB",
    },
    MAC_FILTER_PROFILE: {
      profileType: "mac-filters-profile",
      subType: "ISAM",
    },
    IHUB_EGRESS_SYSTEM_DOT1P_MAP_PROFILE: {
      profileType: "ihub-egress-system-dot1p-map",
      subType: "ISAM",
    },
    QOS_INGRESS_LSR_NETWORK_POLICY_PROFILE: {
      profileType: "qos-ingress-lsr-network-policy-profile",
      subType: "ISAM",
    },
    QOS_EGRESS_NETWORK_POLICY_PROFILE: {
      profileType: "qos-egress-network-policy-profile",
      subType: "ISAM",
    },
    QOS_INGRESS_NETWORK_POLICY_PROFILE: {
      profileType: "qos-ingress-network-policy-profile",
      subType: "ISAM",
    },
    TRANSCEIVER_LINK_TCA_PROFILES_FX_FELT_ETH: {
      profileType: "transceiver-link-tca-profiles",
      subType: "LS-Ethernet",
      profileName: "init-txr-link-default",
    },
    TRANSCEIVER_TCA_PROFILES_FX_FELT_ETH: {
      profileType: "transceiver-tca-profiles",
      subType: "LS-Ethernet",
      profileName: "init-txr-default",
    },
    SYSLOG_COLLECTOR_PROFILE: {
      profileType: "syslog-collector-profile",
      subType: "All",
    },
    RG_ONT_SERVICE_PROFILE: {
      profileType: "rg-ont-service-profile",
      subType: "RG-ONT",
    },
    SSID_CONFIGURATION_PROFILE: {
      profileType: "ssid-configuration-profile",
      subType: "RG-ONT",
    },
    WAN_CONFIGURATION_PROFILE: {
      profileType: "wan-configuration-profile",
      subType: "RG-ONT",
    },
    VOICE_LINE_SERVICE_PROFILE: {
      profileType: "voice-line-service-profile",
      subType: "RG-ONT",
    },
    IP_HOST_CONFIG: {
      profileType: "ip-host-config",
      subType: "LS-ONT",
    },
    PSEUDOWIRE_PROFILE: {
        profileType: "pseudowire-profile",
        subType: "ISAM"
    },
    POWER_SHEDDING_PROFILE: {
        profileType: "power-shed-profile",
        subType: "LS-ONT"
    },
    CLUSTER_LAYOUT_PROFILE : {
        profileType: "cluster-layout-profile",
        subType: "All"
    },
    CLUSTER_TRAFFIC_PROFILE : {
        profileType: "cluster-traffic-profile",
        subType: "All"
    },
    SERVICE_SPEED_TEST_CONFIGURATION_PROFILE : {
      profileType: "service-speed-test-configuration-profile",
      subType: "LS-FX"
    },
    DEVICE_CONFIG_LAYOUT_PROFILE : {
        profileType: "device-config-layout-profile",
        subTypeIXR: "IXR",
        subTypeLSFX: "LS-FX",
        subTypeLSMF: "LS-MF"
    },
    SAT_FRAME_MIX_TEMPLATE_PROFILE : {
        profileType: "sat-frame-mix-template-profile",
        subType: "LS-Ethernet"
    },
    IXR_POLICING: {
      profileType: "policing-profiles",
      subType: "IXR"
    },
    CFM_ONU_TEMPLATE_PROFILE: {
        profileType: "cfm-profile",
        subType: "LS-ONT"
    },
    TLS_CONFIGURATION_PROFILE: {
      profileType: "tls-configuration",
      subType: "All",
    },
    WIFI_SLICE_SERVICE_PROFILE: {
      profileType: "wifi-slice-service-profile",
      subType: "USPC",
    },
    IXR_NRM_MAPPING_MODEL_PROFILE: {
      profileType: "nrm-mapping-model-profile",
      subType: "IXR",
    },
    SERVICE_MODE_OF_OPERATION_PROFILE: {
      profileType: "service-mode-of-operation-profile",
      subType: "LS-Fiber",
    },
    ETH_SYSTEM_PARAMS_PROFILE: {
      profileType: "ethernet-system-params-profile",
      subType: "ISAM",
    },
    LICENSE_CONFIGURATION_PROFILE: {
      profileType: "license-configuration-profile",
      subType: "Lightspan",
    }
};
}
