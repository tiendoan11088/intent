





/**
* (c) 2020 Nokia. All Rights Reserved.
*
* INTERNAL - DO NOT COPY / EDIT
**/
load({script: resourceProvider.getResource('internal/java-imports.js'), name: 'java-imports.js'})
load({script: resourceProvider.getResource('internal/altiplano-intent-constants.js'), name: 'altiplano-intent-constants.js'});
load({script: resourceProvider.getResource('internal/altiplano-profile-constants.js'), name: 'altiplano-profile-constants.js'});
load({script: resourceProvider.getResource('internal/altiplano-caps-utilities.js'), name: 'altiplano-caps-utilities.js'})
load({script: resourceProvider.getResource('internal/altiplano-release-flags.js'), name: 'altiplano-release-flags.js'})
var intentConstants = new AltiplanoIntentConstants();
var profileConstants = new AltiplanoProfileConstants();
var apCapUtils = new AltiplanoCapsUtilities();
var apReleaseFlags = new AltiplanoReleaseFlags();
var HashCodeBuilder = Java.type('org.apache.commons.lang3.builder.HashCodeBuilder');

function AltiplanoUtilities() {

    this.prefixToNsMap = new HashMap();
    //Altiplano
    this.prefixToNsMap.putAll(this.altiplanoPrefixToNsMap());
    // XPON
    this.prefixToNsMap.putAll(this.xponPrefixToNsMap());
    // Copper
    this.prefixToNsMap.putAll(this.copperPrefixToNsMap());

    /**
     * Default Namespace to module mapping
     */
    this.nsToModuleMap = new HashMap();
    // Altiplano
    this.nsToModuleMap.putAll(this.altiplanoNsToModuleMap());
    //XPON
    this.nsToModuleMap.putAll(this.xponNsToModuleMap());
    // Copper
    this.nsToModuleMap.putAll(this.copperNsToModuleMap());

}

AltiplanoUtilities.prototype.altiplanoPrefixToNsMap = function () {
    var prefixToNsMap = new HashMap();
    prefixToNsMap.put("ibn", "http://www.nokia.com/management-solutions/ibn");
    prefixToNsMap.put("nc", "urn:ietf:params:xml:ns:netconf:base:1.0");
    prefixToNsMap.put("device-manager", "http://www.nokia.com/management-solutions/anv");
    prefixToNsMap.put("anv", "http://www.nokia.com/management-solutions/anv");
    prefixToNsMap.put("adh", "http://www.nokia.com/management-solutions/anv-device-holders");
    prefixToNsMap.put("anv-device-tag", "http://www.nokia.com/management-solutions/anv-device-tag");
    prefixToNsMap.put("mds", "http://www.nokia.com/management-solutions/manager-directory-service");
    prefixToNsMap.put("conftpl", "http://www.nokia.com/management-solutions/anv-configuration-templates");
    prefixToNsMap.put("swmgmt", "http://www.nokia.com/management-solutions/anv-software");
    prefixToNsMap.put("cdev", "http://www.nokia.com/management-solutions/device-configuration");
    prefixToNsMap.put("plug", "http://www.nokia.com/management-solutions/anv-device-plugs");
    prefixToNsMap.put("emaa", "http://www.nokia.com/management-solutions/ema-administration");
    prefixToNsMap.put("pi", "http://www.nokia.com/management-solutions/pod-infra");
    prefixToNsMap.put("platform", "http://www.nokia.com/management-solutions/anv-platform");
    prefixToNsMap.put("anvlog", "http://www.nokia.com/management-solutions/anv-logging");
    prefixToNsMap.put("slicing", "http://www.nokia.com/management-solutions/anv-network-slicing");
    prefixToNsMap.put("cert", "http://www.nokia.com/management-solutions/anv-certificates");
    prefixToNsMap.put("ta", "urn:ietf:params:xml:ns:yang:ietf-trust-anchors");
    prefixToNsMap.put("conf", "urn:nokia.com:sros:ns:yang:sr:conf");
    prefixToNsMap.put("bbf-xpon-onu-states", "urn:bbf:yang:bbf-xpon-onu-states");
    prefixToNsMap.put("bbf-xpon-onu-state", "urn:bbf:yang:bbf-xpon-onu-state");
    prefixToNsMap.put("bbf-xpon-onu-authentication", "urn:bbf:yang:bbf-xpon-onu-authentication");
    prefixToNsMap.put("bbf-mgmd", "urn:bbf:yang:bbf-mgmd");
    prefixToNsMap.put("device-fx", "http://www.nokia.com/management-solutions/device-fx");
    prefixToNsMap.put("device-df", "http://www.nokia.com/management-solutions/device-df");
    prefixToNsMap.put("device-mf", "http://www.nokia.com/management-solutions/device-mf");
    prefixToNsMap.put("ont", "http://www.nokia.com/management-solutions/ont");
    prefixToNsMap.put("ont-connection", "http://www.nokia.com/management-solutions/ont-connection");
    prefixToNsMap.put("uplink-connection-slice", "http://www.nokia.com/management-solutions/uplink-connection-slice");
    prefixToNsMap.put("nokia-mcast-cac", "uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-multicast-cac");
    prefixToNsMap.put("ncm", "urn:ietf:params:xml:ns:yang:ietf-netconf-monitoring");
    prefixToNsMap.put("nokia-ber-tca-prof", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ber-tca-profiles");
    prefixToNsMap.put("nokia-hw-prof", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-profiles");
    prefixToNsMap.put("lic-app", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-licensing-app");
    prefixToNsMap.put("nokia-hw-ext-alarm", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-external-alarm");
    prefixToNsMap.put("lldp", "urn:ieee:std:802.1AB:yang:ieee802-dot1ab-lldp");
    prefixToNsMap.put("nokia-lldp-aug", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ieee802-dot1ab-lldp-aug");
    prefixToNsMap.put("nokia-stp", "uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-spanning-tree");
    prefixToNsMap.put("nokia-stp-types", "uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-spanning-tree-types");
    prefixToNsMap.put("device-fx-slice", "http://www.nokia.com/management-solutions/device-fx-slice");
    prefixToNsMap.put("profile-mgr", "http://www.nokia.com/management-solutions/profile-mgr");
    prefixToNsMap.put("fiber-slice", "http://www.nokia.com/management-solutions/fiber-slice");
    prefixToNsMap.put("nokia-sdan-hw-duid", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-hardware-duid");
    prefixToNsMap.put("nokia-sdan-vmac-host-id-aug", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-vmac-host-id-aug");
    prefixToNsMap.put("sys-mounted", "urn:ietf:params:xml:ns:yang:ietf-system-mounted");
    prefixToNsMap.put("nokia-sdan-system", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-system");
    prefixToNsMap.put("nokia-sdan-system-mounted", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-system-mounted");
    prefixToNsMap.put("profile-administration", "http://www.nokia.com/management-solutions/profile-administration");
    prefixToNsMap.put("nokia-sztp", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-sztp");
    prefixToNsMap.put("bbf-qos-enhfilt", "urn:bbf:yang:bbf-qos-enhanced-filters");
    prefixToNsMap.put("bbf-qos-filt", "urn:bbf:yang:bbf-qos-filters");
    prefixToNsMap.put("nokia-sdan-if-mir", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-interfaces-mirror");
    prefixToNsMap.put("nokia-sdan-hw-energy-metering", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-hardware-energy-metering");
    prefixToNsMap.put("nokia-hw-pwr-shed-prof-mounted", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-hardware-power-shed-profiles-mounted");
    prefixToNsMap.put("ibnadmin", "http://www.nokia.com/management-solutions/ibn-administration");
    prefixToNsMap.put("nokia-aaa", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-aaa");
    prefixToNsMap.put("npt", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-protocol-tracing");
    prefixToNsMap.put("state","urn:nokia.com:sros:ns:yang:sr:state");
    prefixToNsMap.put("nokia-sdan-sat","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-ethernet-service-activation-test");
    prefixToNsMap.put("prof-fwd","http://www.nokia.com/management-solutions/forwarder-profile");
    prefixToNsMap.put("prof-rad-port-timer","http://www.nokia.com/management-solutions/radius-port-802-1x-timer-configuration");
    prefixToNsMap.put("prof-uni-serv","http://www.nokia.com/management-solutions/uni-service-profile");
    prefixToNsMap.put("prof-usr-svc","http://www.nokia.com/management-solutions/user-service-profile");
    return prefixToNsMap;
};

AltiplanoUtilities.prototype.xponPrefixToNsMap = function() {
    var prefixToNsMap = new HashMap();
    prefixToNsMap.put("xponinfra","urn:bbf:yang:bbf-xponinfra");
    prefixToNsMap.put("bbf-xpon","urn:bbf:yang:bbf-xpon");
    prefixToNsMap.put("bbf-xponvani","urn:bbf:yang:bbf-xponvani");
    prefixToNsMap.put("fiber","urn:bbf:yang:bbf-fiber");
    prefixToNsMap.put("if","urn:ietf:params:xml:ns:yang:ietf-interfaces");
    prefixToNsMap.put("bbfxponift","urn:bbf:yang:bbf-xpon-if-type");
    prefixToNsMap.put("ianahw","urn:ietf:params:xml:ns:yang:iana-hardware");
    prefixToNsMap.put("hw","urn:ietf:params:xml:ns:yang:ietf-hardware");
    prefixToNsMap.put("bbf-hwt","urn:bbf:yang:bbf-hardware-types");
    prefixToNsMap.put("bbf-hw-ext","urn:bbf:yang:bbf-hardware-extension");
    prefixToNsMap.put("pon-id-allocation","http://www.nokia.com/management-solutions/pon-id-allocation");
    prefixToNsMap.put("ianaent","urn:ietf:params:xml:ns:yang:iana-hardware");
    prefixToNsMap.put("bbf-qos-policies","urn:bbf:yang:bbf-qos-policies");
    prefixToNsMap.put("lscfinfranetitf","http://www.nokia.com/management-solutions/lightspan-cf-infra-network-interface");
    prefixToNsMap.put("eth","urn:ieee:params:xml:ns:yang:ethernet");
    prefixToNsMap.put("bbfintport","urn:bbf:yang:bbf-interface-port-reference");
    prefixToNsMap.put("xponvenet","urn:bbf:yang:bbf-xponvenet");
    prefixToNsMap.put("xpongemtcont","urn:bbf:yang:bbf-xpongemtcont");
    prefixToNsMap.put("bbf-subif","urn:bbf:yang:bbf-sub-interfaces");
    prefixToNsMap.put("bbf-subif-tag","urn:bbf:yang:bbf-sub-interface-tagging");
    prefixToNsMap.put("xponvani","urn:bbf:yang:bbf-xponvani");
    prefixToNsMap.put("bbf-if-usg","urn:bbf:yang:bbf-interface-usage");
    prefixToNsMap.put("bbfift","urn:bbf:yang:bbf-if-type");
    prefixToNsMap.put("bbf-qos-pol","urn:bbf:yang:bbf-qos-policies");
    prefixToNsMap.put("bbf-pppoe-ia","urn:bbf:yang:bbf-pppoe-intermediate-agent");
    prefixToNsMap.put("bbf-l2-d4r","urn:bbf:yang:bbf-l2-dhcpv4-relay");
    prefixToNsMap.put("bbf-ldra","urn:bbf:yang:bbf-ldra");
    prefixToNsMap.put("yhe","http://www.nokia.com/Fixed-Netwoks/BBA/yangnokia-hardware-extension");
    prefixToNsMap.put("yhed","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-extension");
    prefixToNsMap.put("ntp","http://www.nokia.com/management-solutions/ntp-server");
    prefixToNsMap.put("nokia-arpsec","uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-arp-downstream-security.yang");
    prefixToNsMap.put("xponinfraAug","urn:broadband-forum-org:yang:bbf-xponinfra-augment-nodes");
    prefixToNsMap.put("nokia-sdan-traffic-descriptor-profile-aug","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-traffic-descriptor-profile-aug");
    prefixToNsMap.put("nokia-sdan-if-xpon-aug","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-if-xpon-aug");
    prefixToNsMap.put("bbf-hw-ext","urn:bbf:yang:bbf-hardware-extension");
    prefixToNsMap.put("bbf-l2-d4r-fwd","urn:bbf:yang:bbf-l2-dhcpv4-relay-forwarding");
    prefixToNsMap.put("sys","urn:ietf:params:xml:ns:yang:ietf-system");
    prefixToNsMap.put("bbf-subprof","urn:bbf:yang:bbf-subscriber-profiles");
    prefixToNsMap.put("bbf-icmpv6","urn:bbf:yang:bbf-icmpv6");
    prefixToNsMap.put("bbf-qos-enhanced-scheduling","urn:bbf:yang:bbf-qos-enhanced-scheduling");
    prefixToNsMap.put("bbf-qos-traffic-mngt","urn:bbf:yang:bbf-qos-traffic-mngt");
    prefixToNsMap.put("nokia-ipv4-sppr","uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ipv4-address-spoofing-prevention");
    prefixToNsMap.put("dot1ax","urn:ieee:std:802.1AX:yang:ieee802-dot1ax");
    prefixToNsMap.put("dot1ax-extension","urn:ieee:std:802.1AX:yang:ieee802-dot1ax-extension");
    prefixToNsMap.put("name-id-map", "urn:bbf:yang:bbf-fiber-name-id-map-body");
    prefixToNsMap.put("conf", "urn:nokia.com:sros:ns:yang:sr:conf");
    prefixToNsMap.put("bbf-xponani", "urn:bbf:yang:bbf-xponani");
    prefixToNsMap.put("onus-from-template", "http://www.nokia.com/Fixed-Networks/BBA/yang/onus-from-template");
    prefixToNsMap.put("onu", "urn:bbf:params:xml:ns:yang:bbf-fiber-onu-emulated-mount");
    prefixToNsMap.put(" bbf-qos-pol-mounted", "urn:bbf:yang:bbf-qos-policies-mounted");
    prefixToNsMap.put("bbf-qos-cls-mounted", "urn:bbf:yang:bbf-qos-classifiers-mounted");
    prefixToNsMap.put("bbf-qos-tm-mounted", "urn:bbf:yang:bbf-qos-traffic-mngt-mounted");
    prefixToNsMap.put("hw-mounted", "urn:ietf:params:xml:ns:yang:ietf-hardware-mounted");
    prefixToNsMap.put("if-mounted", "urn:ietf:params:xml:ns:yang:ietf-interfaces-mounted");
    prefixToNsMap.put("bbf-xpongemtcont-mounted", "urn:bbf:yang:bbf-xpongemtcont-mounted");
    prefixToNsMap.put("bbf-if-port-ref-mounted", "urn:bbf:yang:bbf-interface-port-reference-mounted");
    prefixToNsMap.put("eth-mounted", "urn:ieee:params:xml:ns:yang:ethernet-mounted");
    prefixToNsMap.put("ianaift-mounted", "urn:ietf:params:xml:ns:yang:iana-if-type-mounted");
    prefixToNsMap.put("bbf-xponift-mounted", "urn:bbf:yang:bbf-xpon-if-type-mounted");
    prefixToNsMap.put("bbf-if-port-ref-mounted", "urn:bbf:yang:bbf-interface-port-reference-mounted");
    prefixToNsMap.put("bbf-xponani-mounted", "urn:bbf:yang:bbf-xponani-mounted");
    prefixToNsMap.put("bbf-sim-mounted", "urn:bbf:yang:bbf-software-image-management-one-dot-one-mounted");
    prefixToNsMap.put("bbf-xpon-ploam-authentication", "urn:bbf:yang:bbf-xpon-ploam-authentication");
    prefixToNsMap.put("bbf-mgmd-mounted","urn:bbf:yang:bbf-mgmd-mounted");
    prefixToNsMap.put("sip-voip-mounted","urn:bbf:yang:bbf-sip-voip-mounted");
    prefixToNsMap.put("bbf-qos-pol-subif-rw","urn:bbf:yang:bbf-qos-policies-sub-itf-rewrite");
    prefixToNsMap.put("cert-app","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-certificate-management");
    prefixToNsMap.put("nokia-ipv6-sppr", "uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ipv6-address-spoofing-prevention");
    prefixToNsMap.put("nokia-ndsec","uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-nd-downstream-security.yang");
    prefixToNsMap.put("clock-frequency", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-conf-clock-frequency");
    prefixToNsMap.put("clock-frequency-mounted", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-conf-clock-frequency-mounted");
    prefixToNsMap.put("clock-ptp", "urn:ietf:params:xml:ns:yang:nokia-conf-clock-ptp");
    prefixToNsMap.put("clock-ptp-mounted", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-conf-clock-ptp-mounted");
    prefixToNsMap.put("bbf-if-port-ref","urn:bbf:yang:bbf-interface-port-reference");
    prefixToNsMap.put("nokia-rmt-itf","urn:ietf:params:xml:ns:yang:nokia-remote-interface");
    prefixToNsMap.put("clock-gnss", "urn:ietf:params:xml:ns:yang:nokia-conf-clock-gnss");
    prefixToNsMap.put("confd_dyncfg", "http://tail-f.com/ns/confd_dyncfg/1.0");
    prefixToNsMap.put("nokia-if-id", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-interface-identities");
    prefixToNsMap.put("bbf-vsi-vctr", "urn:bbf:yang:bbf-vlan-sub-interface-vector");
    prefixToNsMap.put("nokia-type-b-controller", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-type-b-protection-controller");
    prefixToNsMap.put("nokia-hw-ext", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-extension");
    prefixToNsMap.put("nokia-itf-tm", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-interface-speed-monitoring");
    prefixToNsMap.put("dot1q-cfm-mounted", "urn:ieee:std:802.1Q:yang:ieee802-dot1q-cfm-mounted");
    prefixToNsMap.put("nokia-cfm-oam-ais-mounted", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ethernet-cfm-oam-ais-mounted");
    prefixToNsMap.put("nokia-radius","urn:aul:params:xml:ns:yang:nokia-radius");
    prefixToNsMap.put("nokia-sdan-if-xponvani-aug", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-if-xponvani-aug");
    prefixToNsMap.put("nokia-hw-pow-met","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-power-metering");
    prefixToNsMap.put("nokia-loop-detect-mounted", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-uni-loop-detection-mounted");
    prefixToNsMap.put("nokia-loop-detect", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-uni-loop-detection");
    prefixToNsMap.put("nokia-storm-ctrl", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-storm-control");
    prefixToNsMap.put("nokia-qos-types", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-qos-types");
    prefixToNsMap.put("nokia-erps", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-ethernet-erps");
    prefixToNsMap.put("nokia-sdan-vmac-host-id-aug", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-vmac-host-id-aug");
    prefixToNsMap.put("nokia-qos-cls-ext", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-qos-classifier-extension");
    prefixToNsMap.put("nokia-qos-cls-ext-dei", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-qos-classifier-extension-dei");
    prefixToNsMap.put("dot1q-cfm", "urn:ieee:std:802.1Q:yang:ieee802-dot1q-cfm");
    prefixToNsMap.put("bbf-vsi-vctr-icmpv6", "urn:bbf:yang:bbf-vlan-sub-interface-vector-icmpv6");
    prefixToNsMap.put("bbf-vsi-vctr-dhcpv6", "urn:bbf:yang:bbf-vlan-sub-interface-vector-dhcpv6");
    prefixToNsMap.put("bbf-vsi-vctr-dhcpv4", "urn:bbf:yang:bbf-vlan-sub-interface-vector-dhcpv4");
    prefixToNsMap.put("bbf-vsi-vctr-pppoe", "urn:bbf:yang:bbf-vlan-sub-interface-vector-pppoe");
    prefixToNsMap.put("bbf-vsi-vctr-usg", "urn:bbf:yang:bbf-vlan-sub-interface-vector-usage");
    prefixToNsMap.put("nokia-vector-ipv4-sppr", "uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-vlan-sub-interface-vector-ipv4-address-spoofing-prevention");
    prefixToNsMap.put("nokia-vector-ipv6-sppr", "uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-vlan-sub-interface-vector-ipv6-address-spoofing-prevention");
    prefixToNsMap.put("nokia-sdan-xpon-al", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-xpon-alarm");
    prefixToNsMap.put("nokia-hardware-extension-mounted", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-extension-mounted");
    prefixToNsMap.put("bbf-frameproc", "urn:bbf:yang:bbf-frame-processing-profile");
    prefixToNsMap.put("nokia-sdan-itf-loopback-mounted", "http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-itf-loopback-mounted");
    prefixToNsMap.put("nokia-ethernet-interface-fec","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ethernet-interface-fec");
    prefixToNsMap.put("nokia-sdan-ethernet-interface-tca-prof","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-ethernet-interface-tca-profiles");
    prefixToNsMap.put("nokia-sdan-ethernet-interface-fec-tca-prof","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-ethernet-interface-fec-tca-profile");
    prefixToNsMap.put("nokia-sdan-ethernet-interface-tca","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-ethernet-interface-tca");
    return prefixToNsMap;

};

AltiplanoUtilities.prototype.copperPrefixToNsMap = function() {
    var prefixToNsMap = new HashMap();
    prefixToNsMap.put("ietf-interfaces","urn:ietf:params:xml:ns:yang:ietf-interfaces");
    prefixToNsMap.put("iana-if-type","urn:ietf:params:xml:ns:yang:iana-if-type");
    prefixToNsMap.put("bbf-fast","urn:bbf:yang:bbf-fast");
    prefixToNsMap.put("bbf-vdsl","urn:bbf:yang:bbf-vdsl");
    prefixToNsMap.put("bbf-qos-tm","urn:bbf:yang:bbf-qos-traffic-mngt");
    prefixToNsMap.put("bbf-qos-pol","urn:bbf:yang:bbf-qos-policies");
    prefixToNsMap.put("bbf-l2-forwarding","urn:bbf:yang:bbf-l2-forwarding");
    prefixToNsMap.put("bbf-qos-policies","urn:bbf:yang:bbf-qos-policies");
    prefixToNsMap.put("bbf-l2-d4r","urn:bbf:yang:bbf-l2-dhcpv4-relay");
    prefixToNsMap.put("bbf-ldra","urn:bbf:yang:bbf-ldra");
    prefixToNsMap.put("bbf-pppoe-ia","urn:bbf:yang:bbf-pppoe-intermediate-agent");
    prefixToNsMap.put("bbf-subprof","urn:bbf:yang:bbf-subscriber-profiles");
    prefixToNsMap.put("bbf-qos-shap","urn:bbf:yang:bbf-qos-shaping");
    prefixToNsMap.put("bbf-ghs","urn:bbf:yang:bbf-ghs");
    prefixToNsMap.put("nokia-arpsec","uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-arp-downstream-security.yang");
    prefixToNsMap.put("nokia-ipv4-sppr","uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ipv4-address-spoofing-prevention");
    prefixToNsMap.put("bbf-l2-fwd","urn:bbf:yang:bbf-l2-forwarding");
    prefixToNsMap.put("dot1x","http://www.nokia.com/Fixed-Networks/BBA/yang/ieee802-dot1x");
    prefixToNsMap.put("ieee802-dot1x","urn:ieee:std:802.1X:yang:ieee802-dot1x");
    prefixToNsMap.put("nokia-dot1x-ext","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-802-dot1x-ext");
    prefixToNsMap.put("nokia-radius","urn:aul:params:xml:ns:yang:nokia-radius");
    prefixToNsMap.put("ncs","urn:ietf:params:xml:ns:yang:ietf-netconf-server");
    prefixToNsMap.put("bbf-ncs-tcpka","urn:broadband-forum-org:yang:bbf-netconf-server-tcp-keep-alives");
    prefixToNsMap.put("cert-app","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-certificate-management");
    prefixToNsMap.put("nokia-hwi","http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities");
    prefixToNsMap.put("bbf-hw-xcvr","urn:bbf:yang:bbf-hardware-transceivers");
    prefixToNsMap.put("bbf-if-port-ref","urn:bbf:yang:bbf-interface-port-reference");
    prefixToNsMap.put("confd_dyncfg", "http://tail-f.com/ns/confd_dyncfg/1.0");
    prefixToNsMap.put("bbf-selt", "urn:bbf:yang:bbf-selt");
    prefixToNsMap.put("bbf-sim", "urn:bbf:yang:bbf-software-image-management-one-dot-one");
    prefixToNsMap.put("bbf-moca", "urn:bbf:yang:bbf-moca");
    prefixToNsMap.put("mmx:proprietary", "xmlns:mmx=http://inango.com");
    prefixToNsMap.put("bbf-moca25access", "urn:bbf:yang:bbf-moca25access");
    return prefixToNsMap;
};

AltiplanoUtilities.prototype.altiplanoNsToModuleMap = function () {
    var nsToModuleMap = new HashMap();
    nsToModuleMap.put("http://www.nokia.com/management-solutions/manager-directory-service", "manager-directory-service");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/anv-device-holders", "adh");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/device-configuration", "device-configuration");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/anv-configuration-templates", "anv-configuration-templates");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/anv", "anv");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/anv-software", "swmgmt");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/pod-infra", "pi");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/device-fx", "device-fx");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/device-df", "device-df");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/device-mf", "device-mf");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/ont-connection", "ont-connection");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/device-fx-slice", "device-fx-slice");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/uplink-connection-slice", "uplink-connection-slice");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/profile-mgr", "profile-mgr");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/fiber-slice", "fiber-slice");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-hardware-duid", "nokia-sdan-hw-duid");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-uni-loop-detection-mounted", "nokia-loop-detect-mounted");
    return nsToModuleMap;
};

AltiplanoUtilities.prototype.xponNsToModuleMap = function() {
    var nsToModuleMap = new HashMap();
    nsToModuleMap.put("urn:bbf:yang:bbf-xpon","bbf-xpon");
    nsToModuleMap.put("urn:bbf:yang:bbf-xponvani","bbf-xponvani");
    nsToModuleMap.put("urn:bbf:yang:bbf-xpongemtcont","bbf-xpongemtcont");
    nsToModuleMap.put("urn:bbf:yang:bbf-xponinfra","bbf-xponinfra");
    nsToModuleMap.put("urn:bbf:yang:bbf-fiber","bbf-fiber");
    nsToModuleMap.put("urn:bbf:yang:bbf-xpon-if-type","bbf-xpon-if-type");
    nsToModuleMap.put("urn:bbf:yang:bbf-xponvenet","bbf-xponvenet");
    nsToModuleMap.put("urn:bbf:yang:bbf-sub-interfaces","bbf-subif");
    nsToModuleMap.put("urn:bbf:yang:bbf-sub-interface-tagging","bbf-subif-tag");
    nsToModuleMap.put("urn:bbf:yang:bbf-dot1q-types","bbf-dot1qt");
    nsToModuleMap.put("urn:bbf:yang:bbf-interface-usage","bbf-interface-usage");
    nsToModuleMap.put("urn:bbf:yang:bbf-if-type","bbf-if-type");
    nsToModuleMap.put("urn:bbf:yang:bbf-mgmd","bbf-mgmd");
    nsToModuleMap.put("uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-multicast-cac", "nokia-mcast-cac");
    nsToModuleMap.put("urn:bbf:yang:bbf-l2-forwarding","bbf-l2-fwd");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:ietf-interfaces","ietf-interfaces");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:ietf-hardware","ietf-hardware");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:iana-hardware","iana-hardware");
    nsToModuleMap.put("urn:bbf:yang:bbf-hardware-types","bbf-hardware-types");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/anv-network-slicing","anv-network-slicing");
    nsToModuleMap.put("urn:bbf:yang:bbf-qos-policies","bbf-qos-policies");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/anv-device-holders","anv-device-holders");
    nsToModuleMap.put("urn:ieee:params:xml:ns:yang:ethernet","ethernet");
    nsToModuleMap.put("urn:bbf:yang:bbf-interface-port-reference","bbf-interface-port-reference");
    nsToModuleMap.put("urn:bbf:yang:bbf-link-table-body","bbf-link-table-body");
    nsToModuleMap.put("urn:broadband-forum-org:yang:bbf-eqpt","bbf-eqpt");
    nsToModuleMap.put("urn:bbf:yang:bbf-pppoe-intermediate-agent","bbf-pppoe-ia");
    nsToModuleMap.put("urn:bbf:yang:bbf-l2-dhcpv4-relay","bbf-l2-d4r");
    nsToModuleMap.put("urn:bbf:yang:bbf-ldra","bbf-ldra");
    nsToModuleMap.put("urn:bbf:yang:bbf-qos-traffic-mngt","bbf-qos-traffic-mngt");
    nsToModuleMap.put("urn:bbf:yang:bbf-qos-classifiers","bbf-qos-classifiers");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:ietf-ipfix-psamp","ietf-ipfix-psamp");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ipfix","nokia-ipfix");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Netwoks/BBA/yangnokia-hardware-extension","nokia-hardware-extension");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/anv-device-tag","anv-device-tag");
    nsToModuleMap.put("uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-arp-downstream-security.yang","nokia-arpsec");
    nsToModuleMap.put("urn:broadband-forum-org:yang:bbf-xponinfra-augment-nodes","xponinfraAug");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-traffic-descriptor-profile-aug","nokia-sdan-traffic-descriptor-profile-aug");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-if-xpon-aug","nokia-sdan-if-xpon-aug");
    nsToModuleMap.put("http://www.nokia.com/management-solutions/device-configuration","cdev");
    nsToModuleMap.put("urn:bbf:yang:bbf-hardware-extension","bbf-hw-ext");
    nsToModuleMap.put("urn:bbf:yang:bbf-l2-dhcpv4-relay-forwarding","bbf-l2-d4r-fwd");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:ietf-system","sys");
    nsToModuleMap.put("urn:bbf:yang:bbf-subscriber-profiles","bbf-subprof");
    nsToModuleMap.put("urn:bbf:yang:bbf-icmpv6","bbf-icmpv6");
    nsToModuleMap.put("urn:bbf:yang:bbf-qos-enhanced-scheduling","bbf-qos-enhanced-scheduling");
    nsToModuleMap.put("urn:bbf:yang:bbf-qos-shaping","bbf-qos-shaping");
    nsToModuleMap.put("uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ipv4-address-spoofing-prevention","nokia-ipv4-sppr");
    nsToModuleMap.put("urn:ieee:std:802.1AX:yang:ieee802-dot1ax","dot1ax");
    nsToModuleMap.put("urn:ieee:std:802.1AX:yang:ieee802-dot1ax-extension","dot1ax-extension");
    nsToModuleMap.put("urn:nokia.com:sros:ns:yang:sr:conf","conf");
    nsToModuleMap.put("urn:bbf:yang:bbf-qos-policing", "bbf-qos-policing");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ietf-system-aug","nokia-ietf-system-aug");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-virtual-network-function","nokia-vnf");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/onus-from-template", "onus-from-template");
    nsToModuleMap.put("urn:bbf:yang:bbf-xponani", "bbf-xponani");
    nsToModuleMap.put("urn:bbf:yang:bbf-qos-enhanced-filters", "bbf-qos-enhanced-filters");
    nsToModuleMap.put("urn:bbf:yang:bbf-frame-processing-profile", "bbf-frameproc");
    nsToModuleMap.put("urn:bbf:params:xml:ns:yang:bbf-fiber-onu-emulated-mount", "bbf-fiber-onu-emulated-mount");
    nsToModuleMap.put("urn:bbf:yang:bbf-qos-policies-mounted", "bbf-qos-policies-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-qos-classifiers-mounted", "bbf-qos-classifiers-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-qos-traffic-mngt-mounted", "bbf-qos-traffic-mngt-mounted");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:ietf-hardware-mounted", "ietf-hardware-mounted");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:ietf-interfaces-mounted", "ietf-interfaces-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-xpongemtcont-mounted", "bbf-xpongemtcont-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-interface-port-reference-mounted", "bbf-interface-port-reference-mounted");
    nsToModuleMap.put("urn:ieee:params:xml:ns:yang:ethernet-mounted", "ethernet-mounted");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:iana-if-type-mounted", "iana-if-type-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-xpon-if-type-mounted", "bbf-xpon-if-type-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-interface-port-reference-mounted", "bbf-interface-port-reference-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-xponani-mounted", "bbf-xponani-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-sub-interfaces-mounted", "bbf-sub-interfaces-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-if-type-mounted", "bbf-if-type-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-sub-interface-tagging-mounted", "bbf-sub-interface-tagging-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-xpon-ploam-authentication", "bbf-xpon-ploam-authentication");
    nsToModuleMap.put("urn:bbf:yang:bbf-mgmd-mounted","bbf-mgmd-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-sip-voip-mounted","sip-voip-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-qos-policies-sub-itf-rewrite","bbf-qos-pol-subif-rw");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-certificate-management","cert-app");
    nsToModuleMap.put("uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ipv6-address-spoofing-prevention","nokia-ipv6-sppr");
    nsToModuleMap.put("uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-nd-downstream-security.yang", "nokia-ndsec");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ber-tca-profiles", "nokia-ber-tca-prof");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-profiles", "nokia-hw-prof");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:ietf-trust-anchors", "ietf-trust-anchors");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-extension","nokia-hw-ext");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-licensing-app", "nokia-licensing-app");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-conf-clock-frequency","clock-frequency");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-conf-clock-frequency-mounted","clock-frequency-mounted");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:nokia-conf-clock-ptp","clock-ptp");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-conf-clock-ptp-mounted","clock-ptp-mounted");
    nsToModuleMap.put("urn:bbf:yang:bbf-interface-port-reference", "bbf-if-port-ref");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:nokia-remote-interface", "nokia-rmt-itf");
    nsToModuleMap.put("urn:ietf:params:xml:ns:yang:nokia-conf-clock-gnss","clock-gnss");
    nsToModuleMap.put("http://tail-f.com/ns/confd_dyncfg/1.0","confd_dyncfg");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-interface-identities","nokia-if-id");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-type-b-protection-controller","nokia-type-b-controller");
    nsToModuleMap.put("urn:ieee:std:802.1AB:yang:ieee802-dot1ab-lldp","lldp");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ieee802-dot1ab-lldp-aug", "nokia-lldp-aug");
    nsToModuleMap.put("uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-spanning-tree", "nokia-stp");
    nsToModuleMap.put("uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-spanning-tree-types", "nokia-stp-types");
    nsToModuleMap.put("urn:bbf:yang:bbf-vlan-sub-interface-vector","bbf-vsi-vctr");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-ethernet-erps", "nokia-erps");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-interface-speed-monitoring", "nokia-itf-tm");
    nsToModuleMap.put("urn:ieee:std:802.1Q:yang:ieee802-dot1q-cfm-mounted", "dot1q-cfm-mounted");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ethernet-cfm-oam-ais-mounted", "nokia-cfm-oam-ais-mounted");
    nsToModuleMap.put("urn:aul:params:xml:ns:yang:nokia-radius","nokia-radius");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-if-xponvani-aug","nokia-sdan-if-xponvani-aug");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-power-metering","nokia-hw-pow-met");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-storm-control", "nokia-storm-ctrl");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-qos-types", "nokia-qos-types");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-qos-classifier-extension", "nokia-qos-cls-ext");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-qos-classifier-extension-dei", "nokia-qos-cls-ext-dei");
    nsToModuleMap.put("urn:ieee:std:802.1Q:yang:ieee802-dot1q-cfm", "dot1q-cfm");
    nsToModuleMap.put("urn:bbf:yang:bbf-vlan-sub-interface-vector-icmpv6", "bbf-vsi-vctr-icmpv6");
    nsToModuleMap.put("urn:bbf:yang:bbf-vlan-sub-interface-vector-dhcpv6", "bbf-vsi-vctr-dhcpv6");
    nsToModuleMap.put("urn:bbf:yang:bbf-vlan-sub-interface-vector-dhcpv4", "bbf-vsi-vctr-dhcpv4");
    nsToModuleMap.put("urn:bbf:yang:bbf-vlan-sub-interface-vector-pppoe", "bbf-vsi-vctr-pppoe");
    nsToModuleMap.put("urn:bbf:yang:bbf-vlan-sub-interface-vector-usage", "bbf-vsi-vctr-usg");
    nsToModuleMap.put("uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-vlan-sub-interface-vector-ipv4-address-spoofing-prevention", "nokia-vector-ipv4-sppr");
    nsToModuleMap.put("uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-vlan-sub-interface-vector-ipv6-address-spoofing-prevention", "nokia-vector-ipv6-sppr");
    nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-xpon-alarm", "nokia-sdan-xpon-al");

    return nsToModuleMap;
};

AltiplanoUtilities.prototype.copperNsToModuleMap = function() {
  var nsToModuleMap = new HashMap();
  nsToModuleMap.put("urn:ietf:params:xml:ns:yang:ietf-interfaces","ietf-interfaces");
  nsToModuleMap.put("urn:ietf:params:xml:ns:yang:iana-if-type","iana-if-type");
  nsToModuleMap.put("urn:bbf:yang:bbf-fastdsl","bbf-fastdsl");
  nsToModuleMap.put("urn:bbf:yang:bbf-fast","bbf-fast");
  nsToModuleMap.put("urn:bbf:yang:bbf-interface-port-reference","bbf-interface-port-reference");
  nsToModuleMap.put("urn:bbf:yang:bbf-interface-usage","bbf-interface-usage");
  nsToModuleMap.put("urn:bbf:yang:bbf-interfaces-performance-management","bbf-interfaces-performance-management");
  nsToModuleMap.put("urn:bbf:yang:bbf-l2-forwarding","bbf-l2-forwarding");
  nsToModuleMap.put("urn:bbf:yang:bbf-ptm","bbf-ptm");
  nsToModuleMap.put("urn:bbf:yang:bbf-qos-traffic-mngt","bbf-qos-traffic-mngt");
  nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-fast","nokia-fast");
  nsToModuleMap.put("urn:bbf:yang:bbf-sub-interface-tagging","bbf-sub-interface-tagging");
  nsToModuleMap.put("urn:bbf:yang:bbf-if-type","bbf-if-type");
  nsToModuleMap.put("urn:broadband-forum-org:yang:bbf-ptm-interface","bbf-ptm-interface");
  nsToModuleMap.put("urn:bbf:yang:bbf-sub-interfaces","bbf-sub-interfaces");
  nsToModuleMap.put("urn:bbf:yang:bbf-subscriber-profiles","bbf-subscriber-profiles");
  nsToModuleMap.put("urn:bbf:yang:bbf-dot1q-types","bbf-dot1q-types");
  nsToModuleMap.put("urn:broadband-forum-org:yang:bbf-sub-interface-tagging-nokia","bbf-sub-interface-tagging-nokia");
  nsToModuleMap.put("urn:bbf:yang:bbf-dhcpv4","bbf-dhcpv4");
  nsToModuleMap.put("http://www.nokia.com/management-solutions/anv-device-holders","anv-device-holders");
  nsToModuleMap.put("urn:bbf:yang:bbf-qos-filters","bbf-qos-filt");
  nsToModuleMap.put("urn:bbf:yang:bbf-mgmd","bbf-mgmd");
  nsToModuleMap.put("urn:bbf:yang:bbf-qos-policies","bbf-qos-pol");
  nsToModuleMap.put("urn:bbf:yang:bbf-qos-policing","bbf-qos-plc");
  nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-qos-queue-monitoring","nokia-qos-queue-monitoring");
  nsToModuleMap.put("urn:ieee:params:xml:ns:yang:ethernet","ethernet");
  nsToModuleMap.put("urn:bbf:yang:bbf-ldra","bbf-ldra");
  nsToModuleMap.put("urn:bbf:yang:bbf-l2-dhcpv4-relay","bbf-l2-d4r");
  nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ipfix","nokia-ipfix");
  nsToModuleMap.put("urn:ietf:params:xml:ns:yang:ietf-ipfix-psamp","ietf-ipfix-psamp");
  nsToModuleMap.put("urn:bbf:yang:bbf-ghs","bbf-ghs");
  nsToModuleMap.put("urn:bbf:yang:bbf-vdsl","bbf-vdsl");
  nsToModuleMap.put("urn:bbf:yang:bbf-qos-classifiers","bbf-qos-cls");
  nsToModuleMap.put("urn:bbf:yang:nokia-cpe-qos-management","nokia-cpe-qos-management:ip-precedence-range");
  nsToModuleMap.put("urn:bbf:yang:bbf-qos-shaping","bbf-qos-shaping");
  nsToModuleMap.put("uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-arp-downstream-security.yang","nokia-arpsec");
  nsToModuleMap.put("uri:http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-ipv4-address-spoofing-prevention","nokia-ipv4-sppr");
  nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-l2cp","nokia-l2cp");
  nsToModuleMap.put("urn:bbf:yang:bbf-hardware-rpf","bbf-hw-rpf");
  nsToModuleMap.put("urn:bbf:yang:bbf-hardware-rpf-system-config","bbf-hw-rpf-syscfg");
  nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/ieee802-dot1x","dot1x");
  nsToModuleMap.put("urn:ieee:std:802.1X:yang:ieee802-dot1x","ieee802-dot1x");
  nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-802-dot1x-ext","nokia-dot1x-ext");
  nsToModuleMap.put("urn:aul:params:xml:ns:yang:nokia-radius","nokia-radius");
  nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-qos-filters-ext","nokia-qos-filt");
  nsToModuleMap.put("urn:ietf:params:xml:ns:yang:ietf-netconf-server","ncs");
  nsToModuleMap.put("urn:broadband-forum-org:yang:bbf-netconf-server-tcp-keep-alives","bbf-ncs-tcpka");
  nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-certificate-management","cert-app");
  nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-profiles", "nokia-hw-prof");
  nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities", "nokia-hwi");
  nsToModuleMap.put("urn:bbf:yang:bbf-hardware-transceivers", "bbf-hw-xcvr");
  nsToModuleMap.put("http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-external-alarm","nokia-hw-ext-alarm");
  nsToModuleMap.put("http://tail-f.com/ns/confd_dyncfg/1.0","confd_dyncfg");
  nsToModuleMap.put("urn:bbf:yang:bbf-selt","bbf-selt");
  nsToModuleMap.put("bbf-moca", "urn:bbf:yang:bbf-moca");
  nsToModuleMap.put("mmx:proprietary", "xmlns:mmx=http://inango.com");
  nsToModuleMap.put("bbf-moca25access", "urn:bbf:yang:bbf-moca25access");
  return nsToModuleMap;
};

AltiplanoUtilities.prototype.convertIntentConfigXmlToJson = function (intentConfigXml, listObjectMapper, json, choiceArray, multipleContainers, emptyLeafOfList) {
    return this.convertIntentConfigXmlToJsonForChoice(intentConfigXml, listObjectMapper, json, choiceArray, multipleContainers, emptyLeafOfList);
}

AltiplanoUtilities.prototype.toUpperFirst = function (input) {
    var input = input.toLowerCase();
    return input[0].toUpperCase().concat(input.substring(1));
}

AltiplanoUtilities.prototype.convertIntentConfigXmlToJsonForChoice = function (intentConfigXml, listObjectMapper, json, choiceArray, multipleContainers, emptyLeafOfList) {
    if (!json) {
        var isJsonDefined = false;
        json = {};
    }
    json["EMPTY-LEAFS"] = [];
    /* 
     * This part is to handle when there are multiple root leafs
     * With each root leaf (from the second leaf), we will add a container key to the intentConfigJson
     * We don't change the existing structure of the intentConfigJson of the first leaf 
     * 
     * Example: <configuration xmlns="http://www.nokia.com/management-solutions/ibn">
     *               <device-fx xmlns="http://www.nokia.com/management-solutions/device-fx">
     *                   <device-manager>AMS_DEMO</device-manager>
     *                   <hardware-type>FX-I</hardware-type>
     *                   <device-version>6.7</device-version>
     *                   <ip-address>135.249.41.46</ip-address>
     *               </device-fx>
     *               <geo-coordinates xmlns="http://www.nokia.com/management-solutions/ibn-geo-location">
     *                   <latitude>50</latitude>
     *                   <longitude>50</longitude>
     *               </geo-coordinates>
     *           </configuration>
     *   
     *   Result: {
     *               "EMPTY-LEAFS": [],
     *               "device-manager": "AMS_DEMO",
     *               "hardware-type": "FX-I",
     *               "device-version": "6.7",
     *               "ip-address": "135.249.41.46",
     *               "geo-coordinates": {
     *                   "latitude": "50",
     *                   "longitude": "50"
     *               }
     *           }
     */
    var rootConfig = null;
    try {
        if(typeof intentConfigXml === "string") {
            rootConfig = utilityService.extractSubtree(intentConfigXml, {}, "//*[local-name()='intent-specific-data']");
        } else {
            rootConfig = utilityService.extractSubtree(intentConfigXml, {}, "//*[local-name()='configuration']");
        }
    } catch (e) {
        //logger.error("Error while parsing the intent-specific-data : {}", e);
        throw new RuntimeException("configuration or intent-specific-data node not present in the intent configuration");
    }

    if (rootConfig != null && rootConfig.hasChildNodes()) {
        let rootChildren = rootConfig.getChildNodes();
        if(rootChildren.getLength() > 0) {
            for (let index = 0; index < rootChildren.getLength(); index++) {
                let rootChild = rootChildren.item(index);
                if (rootChild != null && rootChild.hasChildNodes()) {
                    let rootContainerKey = rootChild.getLocalName();
                    let isNeedContainerKey = false;
                    if (multipleContainers != null && multipleContainers.indexOf(rootContainerKey) != -1) {
                        isNeedContainerKey = true;
                    }
                    if (isNeedContainerKey) {
                        json[rootContainerKey] = {};
                    }
                    let childNodes = rootChild.getChildNodes();
                    for (let i = 0; i < childNodes.getLength(); i++) {
                        let child = childNodes.item(i);
                        if (child.getNodeType() == 1) { // Element Node
                            if (child.getChildNodes().getLength() === 0) {
                                if (choiceArray && choiceArray.indexOf(child.getLocalName()) > -1) {
                                    if (isNeedContainerKey) {
                                        json[rootContainerKey][child.getLocalName()] = child.getLocalName();
                                    } else {
                                        json[child.getLocalName()] = child.getLocalName();
                                    }
                                } else {
                                    if (isNeedContainerKey) {
                                        json[rootContainerKey][child.getLocalName()] = "";
                                    } else {
                                        json[child.getLocalName()] = "";
                                    }
                                }
                                json["EMPTY-LEAFS"].push(child.getLocalName()); // Add to handle multiple empty leaf in the choice.
                               
                            } else if (child.getChildNodes().getLength() == 1 && child.getChildNodes().item(0).getNodeType() == 3) {
                                // Text Node - Direct Leafs.
                                if (typeof listObjectMapper === "function") {
                                    let listKey = listObjectMapper(child.getLocalName());
                                    if (listKey == "yang:leaf-list") {
                                        if (isNeedContainerKey) {
                                            if (json[rootContainerKey][child.getLocalName()]) {
                                                json[rootContainerKey][child.getLocalName()].push(child.getTextContent());
                                            } else {
                                                json[rootContainerKey][child.getLocalName()] = [child.getTextContent()];
                                            }
                                        } else {
                                            if (json[child.getLocalName()]) {
                                                json[child.getLocalName()].push(child.getTextContent());
                                            } else {
                                                json[child.getLocalName()] = [child.getTextContent()];
                                            }
                                        }
                                    } else {
                                        if (isNeedContainerKey) {
                                            json[rootContainerKey][child.getLocalName()] = child.getTextContent();
                                        } else {
                                            json[child.getLocalName()] = child.getTextContent();
                                        }
                                    }
                                } else {
                                    if (isNeedContainerKey) {
                                        json[rootContainerKey][child.getLocalName()] = child.getTextContent();
                                    } else {
                                        json[child.getLocalName()] = child.getTextContent();
                                    }
                                }
                            }
                            if (child.hasChildNodes() && typeof listObjectMapper === "function") {
                                let key = listObjectMapper(child.getLocalName());
                                if (key != null) { // Known List.
                                    let listInstance = {};
                                    let listChildren = child.getChildNodes();
                                    for (let j = 0; j < listChildren.getLength(); j++) {
                                        let listLeaf = listChildren.item(j);
                                        if (listLeaf.getNodeType() == 1) {
                                            // Element Node
                                            if(listLeaf.getNodeType()==1 && listLeaf.getChildNodes().getLength() ==0){
                                               if(emptyLeafOfList && emptyLeafOfList.indexOf(listLeaf.getLocalName()) >-1){
                                                  listInstance[listLeaf.getLocalName()] ="";
                                               }
                                            }else if (listLeaf.getChildNodes().getLength() == 1 && listLeaf.getChildNodes().item(0).getNodeType() == 3) {
                                                // We only support leafs,leaf-list inside list.
                                                let listKey = listObjectMapper(listLeaf.getLocalName());
                                                if (listKey == "yang:list#leaf-list") {
                                                    if (listInstance[listLeaf.getLocalName()]) {
                                                        listInstance[listLeaf.getLocalName()].push(listLeaf.getTextContent());
                                                    } else {
                                                        listInstance[listLeaf.getLocalName()] = [listLeaf.getTextContent()];
                                                    }
                                                } else {
                                                    listInstance[listLeaf.getLocalName()] = listLeaf.getTextContent();
                                                }
                                            } else if (listLeaf.hasChildNodes()) {
                                                // we will be supporting the second level list which is the child of the first list
                                                let key2 = listObjectMapper(listLeaf.getLocalName());
                                                if (key2) {
                                                    let listInstance2 = {};
                                                    let listChildren2 = listLeaf.getChildNodes();
                                                    for (let k = 0; k < listChildren2.getLength(); k++) {
                                                        let listLeaf2 = listLeaf.item(k);
                                                        if (listLeaf2.getNodeType() == 1 && listLeaf2.getChildNodes().getLength() == 1 && listLeaf2.getChildNodes().item(0).getNodeType() == 3) {
                                                            let listKey2 = listObjectMapper(listLeaf2.getLocalName());
                                                            if (listKey2 == "yang:list#leaf-list") {
                                                                if (listInstance2[listLeaf2.getLocalName()]) {
                                                                    listInstance2[listLeaf2.getLocalName()].push(listLeaf2.getTextContent());
                                                                } else {
                                                                    listInstance2[listLeaf2.getLocalName()] = [listLeaf2.getTextContent()];
                                                                }
                                                            } else {
                                                                listInstance2[listLeaf2.getLocalName()] = listLeaf2.getTextContent();
                                                            }
                                                        }
                                                    }
                                                    if (typeof listInstance[listLeaf.getLocalName()] === "undefined") {
                                                        listInstance[listLeaf.getLocalName()] = {};
                                                    }
                                                    if (!(typeof key2 === "string")) { //expected array
                                                        let dataString2 = [];
                                                        for (let index2 = 0; index2 < key2.length; index2++) {
                                                            dataString2.push(listInstance2[key2[index2]]);
                                                        }
                                                        listInstance[listLeaf.getLocalName()][dataString2.join("#")] = listInstance2; //handle case multiple optional key
                                                    } else {
                                                        listInstance[listLeaf.getLocalName()][listInstance2[key2]] = listInstance2;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (isNeedContainerKey) {
                                        if (typeof json[rootContainerKey][child.getLocalName()] === "undefined") {
                                            json[rootContainerKey][child.getLocalName()] = {};
                                        }
                                        if (!(typeof key === "string")) { //expected array
                                            let dataString = [];
                                            for (let index = 0; index < key.length; index++) {
                                                dataString.push(listInstance[key[index]]);
                                            }
                                            json[rootContainerKey][child.getLocalName()][dataString.join("#")] = listInstance; //handle case multiple optional key
                                        } else {
                                            json[rootContainerKey][child.getLocalName()][listInstance[key]] = listInstance;
                                        }
                                    } else {
                                        if (typeof json[child.getLocalName()] === "undefined") {
                                            json[child.getLocalName()] = {};
                                        }
                                        if (!(typeof key === "string")) { //expected array
                                            let dataString = [];
                                            for (let index = 0; index < key.length; index++) {
                                                dataString.push(listInstance[key[index]]);
                                            }
                                            json[child.getLocalName()][dataString.join("#")] = listInstance; //handle case multiple optional key
                                        } else {
                                            json[child.getLocalName()][listInstance[key]] = listInstance;
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
    if (!isJsonDefined) {
        return json;
    }
};

/**
 * This method used to convert the given JS Array to JSON format for suggest
 * function. The suggest values are filtered based on searchString
 * If suggest all present it will suggest all else it will suggest only 10 entries.
 *
 * @param contextArray
 * @param searchString
 * @param suggestAll (boolean - optional)
 * @returns {Object}
 */
AltiplanoUtilities.prototype.convertToSuggestReturnFormat = function (contextArray, searchString, suggestAll) {
  var dataSuggestion = new Object();
  var returnVal = new Object();
  var count = 0;
  if(contextArray && contextArray.length > 0) {
    contextArray.forEach(function (value) {
            if (suggestAll) {
                if (searchString) {
                    if (value.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) {
                        dataSuggestion[value] = value;
                    }
                } else {
                    dataSuggestion[value] = value;
                }
            } else {
            if (count <= 200) {
                if (searchString) {
                    if (value.toLowerCase().indexOf(searchString.toLowerCase()) !== -1) {
                        dataSuggestion[value] = value;
                        count++;
                    }
                } else {
                    dataSuggestion[value] = value;
                    count++;
                }
            } else {
                return;
            }
        }
    });
  }
  Object.keys(dataSuggestion).sort().forEach(function(key) {
    returnVal[key] = dataSuggestion[key];
  });
  return returnVal;
};

/**
 * This method used find the removed devices in the umbrella fwk
 * @param oldDevicesInfo
 * @param newDevicesInfo
 * @returns {[]}
 */
AltiplanoUtilities.prototype.compareDeviceInfos = function(oldDevicesInfo, newDevicesInfo) {
    var removedDevices = [];
    oldDevicesInfo.forEach(function (oldDevice) {
        var resultArray = newDevicesInfo.filter(function (newDevice) {
            if(newDevice.name === oldDevice.name) {
                return newDevice.name;
            }
        });
        if(!resultArray || resultArray.length === 0) {
            removedDevices.push(oldDevice);
        }
    });
    logger.debug("compareDeviceInfos removed devices : {}" + JSON.stringify(removedDevices));
    if(removedDevices.length > 0) {
        return removedDevices;
    } else {
        return null;
    }
};

/**
 * This method used to skip the devices from the removed devices in the umbrella fwk
 * mainly used for MF if the MF NT not supports IHUB
 * @param removedDevicesInfo
 * @param skipDevicesInfo
 * @returns removedDevicesInfo
 */

AltiplanoUtilities.prototype.skipDeviceInRemovedDevices =  function(removedDevicesInfo, skipDevicesInfo) {    
    if(removedDevicesInfo && skipDevicesInfo){
        removedDevicesInfo.forEach(function (removedDevice) {
            skipDevicesInfo.forEach(function (skipDevice) {
                if(removedDevice.name === skipDevice) {
                    removedDevicesInfo.splice(removedDevice,1);
                }
                });
        });
    }
    return removedDevicesInfo;
};


AltiplanoUtilities.prototype.cloneSyncInput = function(originalSyncInout) {
    var result = new SynchronizeInput();
    result.setTarget(originalSyncInout.getTarget());
    result.setNetworkState(originalSyncInout.getNetworkState());
    result.setIntentConfiguration(originalSyncInout.getIntentConfiguration());
    result.setCurrentTopology(originalSyncInout.getCurrentTopology());
    return result;
};

/**
 * Suggent device name based on the context and device types
 *
 * @param context
 * @param deviceTypes
 * @returns {Object}
 */
AltiplanoUtilities.prototype.suggestDeviceNamesByDeviceTypes = function (context, deviceTypes) {
  var devices = new ArrayList();
  devices.addAll(mds.get10Devices(deviceTypes, context.getSearchQuery()));
  if (devices){
        var returnVal = {};
    devices.forEach( function(device){
      returnVal[device] = device;
        });
    return returnVal;
  }
};
/*
* suggest target of intents
* @param intent type string
* @returns Array
*/
AltiplanoUtilities.prototype.getTargetsByIntentType=function(intentType){
  var returnVal=[];
   var intents= ibnService.getConfiguredIntentsByIntentTypeName(intentType);
   intents.forEach(function(intent){
     var target = intent.getTarget();
     returnVal.push(target);
   });
  return returnVal;
};

/**
 * Suggest device name based on the context, device types and AV name
 *
 * @param context
 * @param deviceTypes
 * @param managerName
 * @returns {Object}
 */
AltiplanoUtilities.prototype.suggestDeviceNamesByDeviceTypesAndManager = function (context, deviceTypes, managerName) {
  var devices = new ArrayList();
  devices.addAll(mds.get10DevicesForManager(deviceTypes, context.getSearchQuery(), managerName));
  if (devices){
        var returnVal = {};
    devices.forEach( function(device){
      returnVal[device] = device;
        });
    return returnVal;
  }
};

/**
 * Used to merge the two object ( the objects doesn't contain function
 * property ).
 *
 * @param baseObject
 * @param newObject
 * @returns {*}
 */
AltiplanoUtilities.prototype.getMergedObject = function (baseObject, newObject) {
    for (var key in newObject) {
        baseObject[key] = newObject[key];
    }
    return baseObject;
};

/**
 *
 * @param target
 * @returns parts
 */
AltiplanoUtilities.prototype.getTargetDetails = function (target, delimiter) {
    if (delimiter) {
        var parts = target.split(delimiter);
    } else {
        parts = target.split("#");
    }
    return parts;
};

AltiplanoUtilities.prototype.createDummyTopologyObject = function (deviceName, side) {
    var intentTopology = topologyFactory.createServiceTopology();
    var topologyObject = topologyFactory.createTopologyObjectFrom("dummy", "dummy", side, deviceName);
    topologyObject.setObjectPreviousVertexObjectIDs("-hidden-");
    intentTopology.addTopologyObject(topologyObject);
    return intentTopology;
};

/**
 * Validate Abstract method
 * validateContext, This is an optional parameter used for storing the values computed during the
 * callback function to use it later in the validate method mostly used for dependency computations
 *
 * @param syncInput
 * @param callbackFun
 * @param validateContext
 */
AltiplanoUtilities.prototype.validate = function (syncInput, callbackFun, validateContext) {
    var contextualErrorJsonObj = {};
    var validateResult;
    try {
        validateResult = callbackFun(syncInput, contextualErrorJsonObj, validateContext);
    } catch (e) {
        //logger.error("Error while validate the intent input: {}", e);
        throw e;
    }
    if (Object.keys(contextualErrorJsonObj).length !== 0) {
        utilityService.throwContextErrorException(contextualErrorJsonObj);
    }
    return validateResult;
};

/**
 * This method used to check whether the object present it the JS array
 *
 * @param inputArray
 * @param value
 * @returns {boolean}
 */
AltiplanoUtilities.prototype.isArrayContains = function (inputArray, value) {
    if (inputArray && inputArray.length > 0) {
        return (inputArray.indexOf(value) > -1) ? true : false;
    }
    return false;
};

/**
 * Get the manager for the given deviceName if manager not found the method
 * will throw the exception
 *
 * @param deviceName
 * @returns {*}
 */
AltiplanoUtilities.prototype.getManagerInfo = function (deviceName) {
    var managerInfos = apUtils.getAllManagersWithDevice(deviceName);
    if (managerInfos == null || managerInfos.isEmpty()) {
        throw new RuntimeException("Device not found: " + deviceName);
    }
    return managerInfos[0];
};


AltiplanoUtilities.prototype.getTransformedDependencyInfo = function (dependencyObject){
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

/**
 * Get the manager for the given deviceName if manager not found the method
 * will throw the exception
 *
 * @param deviceName
 * @param useIntentScope - Using intent scope to get managerInfo or not
 * @returns {*}
 */
AltiplanoUtilities.prototype.getManagerInfoFromEsAndMds = function (deviceName, useIntentScope) {
    var fetchKey = "deviceManagerFromEsAndMdsInfo_".concat(deviceName);
    if (useIntentScope || useIntentScope == undefined) {    //In this case, undefined means use intent scope
        var managerInfo = this.getContentFromIntentScope(fetchKey);
        if (managerInfo) {
            return managerInfo;
        }
    }
    var nwSlicingUserType = apUtils.getNetworkSlicingUserType();
    if (nwSlicingUserType == intentConstants.NETWORK_SLICING_USER_TYPE_SLICE_OWNER) {
        var deviceInfo = apUtils.getDeviceInfo(deviceName);
        var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
        if (deviceInfo && !deviceInfo.isLtDevice && nodeType != null && !nodeType.startsWith(intentConstants.LS_DF_PREFIX)) {
            deviceName = deviceName + intentConstants.DOT_LS_IHUB;
        }
        if (useIntentScope || useIntentScope == undefined) {
            var managerInfos = apUtils.getAllManagersWithDevice(deviceName);
        } else {
            var managerInfos = mds.getAllManagersWithDevice(deviceName);
        }
        if (managerInfos == null || managerInfos.isEmpty()) {
            throw new RuntimeException("Device not found: " + deviceName);
        } else {
            this.storeContentInIntentScope(fetchKey, managerInfos[0]);
            return managerInfos[0];
        }
    } else {
        if (useIntentScope || useIntentScope == undefined) {
            var managerInfos = apUtils.getAllManagersWithDevice(deviceName);
        } else {
            var managerInfos = mds.getAllManagersWithDevice(deviceName);
        }
        if (managerInfos == null || managerInfos.isEmpty()) {
            managerInfos = new java.util.ArrayList();

            // We are trying to retrieve the shelf name from LT device name to find the manager here
            var deviceInfo = apUtils.getDeviceInfo(deviceName);
            if (deviceInfo && deviceInfo.isLtDevice) {
                deviceName = deviceInfo.shelfDeviceName;
            }

            // Device not found in MDS, try to get the manager from ES
            var managerName;
            var object = {};
            var rootObject = {};
            var mustArray = [];
            var labelObject = {"term": {"label": "Physical Equipment"}};
            var deviceTerm = {"term": {"target.device-name.keyword": deviceName}};
            mustArray.push(labelObject);
            mustArray.push(deviceTerm);
            var mustNotArray = [];
            var unsupportedLabelObject = {"term": {"label": "Slicing"}};
            mustNotArray.push(unsupportedLabelObject);
            rootObject = {"bool": {"must": mustArray,  "must_not": mustNotArray}};
            object["query"] = rootObject;
            object["from"] = 0;
            object["size"] = 1;
            object["_source"] = ["configuration.device-manager"];
            var response = apUtils.executeEsIntentSearchRequest(JSON.stringify(object));
            if (apUtils.isResponseContainsData(response)) {
                response.hits.hits.forEach(function (intentResult) {
                    if (intentResult["_source"]["configuration"] !== undefined) {
                        managerName = intentResult["_source"]["configuration"]["device-manager"]
                    }
                });
            }

            if (managerName) {
                var manager = apUtils.getManagerByName(managerName);
                managerInfos.add(manager);
            } else {
                var deviceType;
                try{
                    deviceType = this.getNodeTypefromEsAndMds(deviceName);
                } catch (e) {
                    deviceType = null;
                }
                if (deviceType && deviceType.startsWith(intentConstants.FAMILY_TYPE_IXR)) {
                    managerName = apUtils.getDeviceManagerNames([intentConstants.MANAGER_TYPE_NSP_MDM]).get(0);
                    managerInfos.add(apUtils.getManagerByName(managerName));
                } else {
                    throw new RuntimeException("Device not found: " + deviceName);
                }
            }
        }
        this.storeContentInIntentScope(fetchKey, managerInfos[0]);
        return managerInfos[0];
    }
};

/**
 * convert given JS array to JAVA HashSet Object.
 *
 * @param objects
 * @returns {java.util.HashSet}
 */
AltiplanoUtilities.prototype.getObjectSet = function (objects) {
    var setAtt = new java.util.HashSet();
    if (typeof objects.push === "function") {
        objects.forEach(function (object) {
            setAtt.add(object);
        })
    }
    return setAtt;
};

/**
 * Validate if the required intent type preset in the IBN DB. else method will
 * throw the exception
 *
 * @param intentType
 * @param version
 */
AltiplanoUtilities.prototype.validateIntentType = function (intentType, version) {
    let scopeKey = "findIntentTypeByName_" + intentType + "#" + version;
    if (!apUtils.getContentFromIntentScope(scopeKey)) {
        var isIntentTypePresent = ibnService.findIntentTypeByName(intentType, version);
        if (!isIntentTypePresent) {
            throw new RuntimeException("Intent type not present :" + intentType);
        }
        apUtils.storeContentInIntentScope(scopeKey, isIntentTypePresent);
    }
};

/**
 * Used to get intentConfigDetails.
 *
 * @param intentType
 * @param version
 * @param target
 * @returns {*}
 */
AltiplanoUtilities.prototype.getIntentConfig = function (intentType, version, target) {
    if (intentType && version) {
        this.validateIntentType(intentType, version);
        if (target) {
            var intentDetails = this.validateIntentTarget(intentType, target);
            return intentDetails.getIntentConfig();
        }
    }
    return null;
};

/**
 * Check intent type present with the provided target value
 *
 * @param intentType
 * @param version
 * @param target
 * @returns {boolean}
 */
AltiplanoUtilities.prototype.isIntentTypePresentWithTarget = function (intentType, version, target) {
    if (intentType && version) {
        try {
            this.validateIntentType(intentType, version);
            if (target) {
                var intentDetails = this.validateIntentTarget(intentType, target);
                if (intentDetails) {
                    return true;
                }
            }
        } catch (e) {
            logger.error("Error while finding intent {}", e);
        }
    }
    return false;
};

AltiplanoUtilities.prototype.validateIntentTarget = function (intentType, target) {
    var intentDetails = apUtils.getIntent(intentType, target);
    if (!intentDetails) {
        throw new RuntimeException("Intent not present with target '" + target + "' of intent type '" + intentType + "'");
    }
    return intentDetails;
};

AltiplanoUtilities.prototype.getIntentVersion = function (intentType, target) {
    var intentDetails = apUtils.getIntent(intentType, target);
    if (!intentDetails) {
        throw new RuntimeException("Intent not present with target '" + target + "' of intent type '" + intentType + "'");
    }
    return intentDetails.getIntentTypeVersion();
};

/**
 * convert given JS object to xtraInfoList
 *
 * @param object
 * @returns {java.util.ArrayList}
 */
AltiplanoUtilities.prototype.convertToTopologyExtraInfoList = function (object) {
    var xtraInfoList = new java.util.ArrayList();
    for (var key in object) {
        xtraInfoList.add(this.convertToTopologyExtraInfoObject(key, object[key]));
    }
    return xtraInfoList;
};

/**
 * convert given key and value to xtraInfo object
 *
 * @param key
 * @param value
 * @returns {*}
 */
AltiplanoUtilities.prototype.convertToTopologyExtraInfoObject = function (key, value) {
    return topologyFactory.createTopologyXtraInfoFrom(key, value);
};

/**
 * Get the topology extra info for a specified storage and leaf
 *
 * @param topology
 * @param storageName
 * @param attributeLeaf
 * @returns {*}
 */
AltiplanoUtilities.prototype.getTopologyExtraInfoFromTopology = function (topology, storageName, attributeLeaf) {
    if (topology != null) {
        var result;
        var xtraInfos = this.getTopologyExtraInfo(topology);
        if (typeof xtraInfos[storageName] === "string") {
            var storedTemplateArgs = this.JSONParsingWithCatchingException("getTopologyExtraInfoFromTopology", xtraInfos[storageName]);
            if (storedTemplateArgs[attributeLeaf]) {
                result = storedTemplateArgs[attributeLeaf];
            }
        }
    }
    return result;
};

/**
 * Method used to get the TopologyExtraInfo and returns JS object
 *
 * @param topology
 */
AltiplanoUtilities.prototype.getTopologyExtraInfo = function (topology) {
    var args = {};
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        topology.getXtraInfo().forEach(function (extraInfo) {
            args[extraInfo.getKey()] = extraInfo.getValue();
        });
    }
    return args;
};

AltiplanoUtilities.prototype.getStageArgsFromTopologyXtraInfo = function(topology, key) {
    //var key = stageName + "_" + deviceName + "_ARGS";
    var xtraInfo = this.getTopologyExtraInfo(topology);
    if (xtraInfo) {
        var stageArgs = xtraInfo[key];
        if (stageArgs) {
            stageArgs = this.JSONParsingWithCatchingException("getStageArgsFromTopologyXtraInfo", stageArgs);
            return stageArgs;
        }
    }
};

AltiplanoUtilities.prototype.getLastIntentConfigFromTopologyXtraInfo = function(topology) {
    var xtraInfo = this.getTopologyExtraInfo(topology);
    if (xtraInfo) {
        var lastIntentConfig = xtraInfo["lastIntentConfig"];
        if (lastIntentConfig) {
            lastIntentConfig = this.JSONParsingWithCatchingException("getLastIntentConfigFromTopologyXtraInfo", lastIntentConfig);
            return lastIntentConfig;
        }
    }
};

AltiplanoUtilities.prototype.removetoplogyXtraInfo = function (topology, key) {
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        var xtraInfos = topology.getXtraInfo();
        for (var i = 0; i < xtraInfos.size(); i++) {
            if (xtraInfos.get(i).getKey() == key) {
                xtraInfos.remove(i);
                break;
            }
        }
    }
};

AltiplanoUtilities.prototype.setTopologyExtraInfo = function (topology, key, value) {
    var found = false;
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        topology.getXtraInfo().forEach(function (extraInfo) {
            if (extraInfo.getKey() == key) {
                extraInfo.setValue(value);
                found = true;
            }
        });
    }
    if (!found) {
        if (topology) {
            var entry = topologyFactory.createTopologyXtraInfoFrom(key, value);
            topology.addXtraInfo(entry);
        }
    }
    return topology;
};

AltiplanoUtilities.prototype.setGcHint=function(deviceName,objectTypeToObjectIdsMap,result){
    if (this.getContentFromIntentScope("bulkSync")) {
        if (deviceName) {
            var deviceNameToObjectTypeToObjectIds = new HashMap();
            if (result && result.getGcHint() != null) {
                deviceNameToObjectTypeToObjectIds = result.getGcHint();
            }
            deviceNameToObjectTypeToObjectIds.put(deviceName, objectTypeToObjectIdsMap);
            result.setGcHint(deviceNameToObjectTypeToObjectIds);
        } else {
            result.setGcHint(objectTypeToObjectIdsMap);
        }
    } else {
        if (deviceName) {
            var deviceNameToObjectTypeToObjectIds = new HashMap();
            deviceNameToObjectTypeToObjectIds.put(deviceName, objectTypeToObjectIdsMap);
            result.setGcHint(deviceNameToObjectTypeToObjectIds);
        } else {
            result.setGcHint(objectTypeToObjectIdsMap);
        }
    }
    return result;
};

AltiplanoUtilities.prototype.isDeviceRemoved = function (deviceName) {
    var isDeviceRemoved = false;
    var removedDevices = requestScope.get().get("removedDevices");
    if(removedDevices) {
        removedDevices.forEach(function (value) {
            if (value.name && value.name == deviceName) {
                isDeviceRemoved = true;
            }
        });
    }
    var deviceInfos = apUtils.getAllInfoFromDevices(deviceName);
    return isDeviceRemoved && (null == deviceInfos || deviceInfos.size() == 0);
};

AltiplanoUtilities.prototype.getNodeType = function (device) {
    var deviceInfos = apUtils.getAllInfoFromDevices(device);
    if (null == deviceInfos || deviceInfos.size() == 0) {
        // In case of slicing, we will not have the shelf related info in MDS, so as an alternative we construct IHUB device and get related info from it
        // Here assumption is that we get shelf name always, if we get an LT as device name then the first call to MDS should already return the related information
        var nwSlicingUserType = apUtils.getNetworkSlicingUserType();
        if (nwSlicingUserType == intentConstants.NETWORK_SLICING_USER_TYPE_SLICE_OWNER) {
            var deviceInfo = apUtils.getDeviceInfo(device);
            if (deviceInfo && !deviceInfo.isLtDevice) {
                deviceInfos = apUtils.getAllInfoFromDevices(device + intentConstants.DOT_LS_IHUB);
            }
            if (null == deviceInfos || deviceInfos.size() == 0) {
                throw new RuntimeException("Device not found: " + device);
            }

        } else {
            throw new RuntimeException("Device not found: " + device);
        }
    }
    var deviceInfo = deviceInfos.get(0);
    var deviceType = deviceInfo.getFamilyTypeRelease();
    if (deviceType == null) {
        throw new RuntimeException("Device Family type and release not found for device: " + device);
    }
    return deviceType;
};


/**********************************************************************************************
 * Method used to filter Device and its details when the device name matches the given pattern
 *
 * @param deviceInfos - devices List returned by extensionConfigObject.getDevicesInvolved method
 * @param pattern - regex pattern string e.g ".*\.IHUB"
 * @returns devicesList
 */

AltiplanoUtilities.prototype.filterDevices = function (deviceInfos , pattern) {
    var patternRegEx = new RegExp(pattern);
    if(deviceInfos && patternRegEx){
        var devicesList = deviceInfos.filter(function (device){
            return device.name.match(patternRegEx);
        })
        if(devicesList && devicesList.length > 0){
            return devicesList;
        } else{
            throw new RuntimeException("No matching device found for pattern: " + pattern);
        }
    }
};

/*****************************************************************************
 * Method used to perform the natural sorting on string array.
 *
 * @param a
 * @param b
 * @returns {number}
 */
AltiplanoUtilities.prototype.naturalCompare = function (a, b) {
    var splitArrayA = [], splitArrayB = [];

    a.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        splitArrayA.push([$1 || Infinity, $2 || ""])
    });
    b.replace(/(\d+)|(\D+)/g, function (_, $1, $2) {
        splitArrayB.push([$1 || Infinity, $2 || ""])
    });

    while (splitArrayA.length && splitArrayB.length) {
        var filterArrayA = splitArrayA.shift();
        var filterArrayB = splitArrayB.shift();
        var result = (filterArrayA[0] - filterArrayB[0]) || filterArrayA[1].localeCompare(filterArrayB[1]);
        if (result) return result;
    }

    return splitArrayA.length - splitArrayB.length;
};

/**
 * Sorts the objects provided
 *
 * @param a
 * @param b
 */
AltiplanoUtilities.prototype.compare = function (a, b) {
    a = apUtils.convertToNewNamingConvention(a);
    b = apUtils.convertToNewNamingConvention(b);
    return apUtils.naturalCompare(a,b);
};

/**
 * Converts the old familyTypeRelease pattern to new convention
 * Eg : If the familyTypeRelease is LS-FX-FANT-F-FX4-20A.06, it is converted to LS-FX-FANT-F-FX4-20.06
 *
 * @param element
 * @returns {*|string|void}
 */
AltiplanoUtilities.prototype.convertToNewNamingConvention = function (element) {
    var oldRelRegExPattern = "[0-9]{2}[A|B]\\.";
    var oldRelRegEx = new RegExp(oldRelRegExPattern);
    var patternToBeReplaced = "[A|B]";
    var patternRegEx = new RegExp(patternToBeReplaced);

    var isOldRelRegExPatternMatch = oldRelRegEx.test(element);
    if (isOldRelRegExPatternMatch) {
        var newReleasePattern = element.replace(oldRelRegEx, function (match) {
            var newString = match.replace(patternRegEx, "");
            return newString;
        });
        return newReleasePattern;
    } else {
        return element;
    }
};


/**
 * Get's the prefix length for the provided deviceType to calculate best known type
 *
 * @param deviceType
 * @returns {number}
 */
AltiplanoUtilities.prototype.getPrefixLengthForDeviceType = function (deviceType) {
    if (deviceType.startsWith("LS-FX-FANT-")) {
        return 16;
    } else if (deviceType.startsWith("LS-FX-IHUB-FANT-")) {
        return 21;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FELT_B_DOWNLINK.concat("-"))) {
        return 22;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FELT_B_UPLINK.concat("-"))) {
        return 21;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FELT_D_DOWNLINK.concat("-"))) {
        return 22;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FELT_D_UPLINK.concat("-"))) {
        return 21;
    } else if (deviceType.startsWith("LS-FX-")) {
        return 13;
    } else if (deviceType.startsWith("LS-CF-24W-")) {
        return 8;
    } else if (deviceType.startsWith("LS-DF-CFXR-A-") || deviceType.startsWith("LS-DF-CFXR-E-") || deviceType.startsWith("LS-DF-CFXR-H-") || deviceType.startsWith("LS-DF-CFXR-J-") || deviceType.startsWith("LS-DF-CFXR-F-") || deviceType.startsWith("LS-DF-CFXR-C-")) {
        return 13;
    } else if (deviceType.startsWith("LS-DF-IHUB-CFXR-F-")) {
        return 18;
    } else if (this.getDeviceModelType(deviceType)==="MODEL2") {
        return 20;
    } else if (deviceType.startsWith("LS-DPU-") || deviceType.startsWith("LS-SX-") || deviceType.startsWith("LS-DX-")) {
        return 13;
    } else if (deviceType.startsWith("LS-MX-")) {
        if(deviceType.startsWith("LS-MX-RANT-C-ETH")) {
            return 24;
        } else if(deviceType.startsWith("LS-MX-RANT-C-XPON")) {
            return 25;
        }
        return 12;
    } else if (deviceType.startsWith("SX4F")) {
        return 5;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LWLT_C.concat("-"))) {
        return 13;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LGLT_D.concat("-"))) {
        return 13;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_A_MF2_LMXR_B.concat("-"))) {
        return 24;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LANT_A.concat("-"))) {
        return 13;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LBNT_A_MF14_LMFS_A.concat("-"))) {
        return 25;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_B_MF2_LMXR_B.concat("-"))) {
        return 24;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_A.concat("-"))){
        return 13;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_B.concat("-"))){
        return 13;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_IHUB.concat("-"))) {
        return 18;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_SF_SFMB_A.concat("-"))){
        return 13;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_SF_SFDB_A.concat("-"))){
        return 13;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_LS_SF_IHUB.concat("-"))) {
        return 18;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_APP_BSO.concat("-"))){
        return 8;
    } else if (deviceType.startsWith(intentConstants.FAMILY_TYPE_COAX.concat("-"))) {
        return 11;						
    } else {
        return 5; // default
    }
};
/**
 * This method is moved from VirtualizerDeviceManager so that in the handler of action, we can use it
 * This method is used to get the IHUB or LT hardware type
 * @param {*} type 
 * @param {*} ntHardwareType 
 * @param {*} plannedType 
 * @param {*} lsPrefix 
 * @returns 
 */
AltiplanoUtilities.prototype.getiHUBAndLTHWTypeVersion = function (type, ntHardwareType, plannedType, lsPrefix) {
    // By default uses FX Prefix if lsPrefix is not specified
    if(!lsPrefix) lsPrefix = intentConstants.LS_FX_PREFIX;
    if (type === intentConstants.FX_LT_STRING && plannedType) {
        return lsPrefix + "-" + plannedType;
    } else if ((type === intentConstants.LS_FX_IHUB || type === intentConstants.LS_IHUB) && ntHardwareType) {
        if (ntHardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_F)) {
            return intentConstants.FAMILY_TYPE_IHUB_FANT_F_FX + ntHardwareType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_F, "");
        } else if (ntHardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_G)) {
            return intentConstants.FAMILY_TYPE_IHUB_FANT_G_FX + ntHardwareType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_G, "");
        } else if (ntHardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_H)) {
            return intentConstants.FAMILY_TYPE_IHUB_FANT_H_FX + ntHardwareType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_H, "");
        } else if (ntHardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT_M)) {
            return intentConstants.FAMILY_TYPE_IHUB_FANT_M_FX + ntHardwareType.replace(intentConstants.FAMILY_TYPE_LS_FX_FANT_M, "");
        } else if (ntHardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_A)) {
            return intentConstants.FAMILY_TYPE_IHUB_LMNT_A + ntHardwareType.replace(intentConstants.FAMILY_TYPE_LS_MF_LMNT_A, "");
        } else if (ntHardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LANT_A)) {
            return intentConstants.FAMILY_TYPE_IHUB_LANT_A;
        } else if (ntHardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LBNT_A_MF14_LMFS_A)) {
            return intentConstants.FAMILY_TYPE_IHUB_LBNT_A_MF14_LMFS_A;
        } else if (ntHardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_B)) {
            return intentConstants.FAMILY_TYPE_IHUB_LMNT_B + ntHardwareType.replace(intentConstants.FAMILY_TYPE_LS_MF_LMNT_B, "");
        } else if (ntHardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_SF_SFMB_A)) {
            return intentConstants.FAMILY_TYPE_LS_SF_IHUB_SFMB_A;
        } else if (ntHardwareType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F)) {
            return intentConstants.FAMILY_TYPE_LS_DF_IHUB_CFXR_F;
        } else {
            throw new RuntimeException("Cannot get IHUB HW Type with NT HW Type " + ntHardwareType);
        }
    } else {
        throw new RuntimeException("Cannot get FX hardware type");
    }
}

/**
 * Method used to get a bestKnown type from the allTheSupported device types.
 *
 * @param actualType
 * @param knownTypes
 * @param prefixLength
 * @returns {bestTypes if the condition matching else return null}.
 */
AltiplanoUtilities.prototype.getBestKnownType = function (actualType, knownTypes, prefixLength) {
    if (knownTypes && (knownTypes.length > 0)) {
        var allTypes = knownTypes.slice();
        if (!prefixLength) {
            prefixLength = 4;
        }

        // Return if already exist in allTypes
        if (allTypes.indexOf(actualType) > -1) {
            return actualType;
        }
        // Add it to all types
        allTypes.push(actualType);
        // sort the array
        allTypes.sort(this.compare);
        logger.trace("Sorted All types :: {}", allTypes);

        var actualIndex = allTypes.indexOf(actualType);
        logger.trace("actualIndex :: {}", actualIndex);

        // Find the required index
        if (actualIndex > 0) {
            var requiredIndex = actualIndex - 1;
            logger.trace("requiredIndex :: {}", requiredIndex);
        } else {
            return null;
        }
        // compare the prefix
        if (actualType.slice(0, prefixLength) === allTypes[requiredIndex].slice(0, prefixLength)) {
            return allTypes[requiredIndex];
        } else {
            return null;
        }
    }
    return null;
};

AltiplanoUtilities.prototype.checkSupportForNodeType = function (device, knownTypes, prefixLength) {
    logger.debug("checkSupportForNodeType with device: {}", device);
    this.checkManagerConnectionState(device);
    var actualType = this.getNodeType(device);
    var bestType = this.getBestKnownType(actualType, knownTypes, prefixLength);
    if (!bestType) {
        throw new RuntimeException(device + " Unsupported Device Type: " + actualType);
    }
};

AltiplanoUtilities.prototype.checkManagerConnectionState = function (deviceName, managerInfo) {
    if (deviceName && !managerInfo) {
        logger.debug("checkManagerConnectionState with deviceName: {}", deviceName);
        var managerInfos = apUtils.getAllManagersWithDevice(deviceName);
        if (managerInfos == null || managerInfos.isEmpty()) {
            throw new RuntimeException("Manager not found for device " + deviceName);
        }
        managerInfo = managerInfos.get(0);
    }
    var managerName = managerInfo.getName();
    var managerType = managerInfo.getType().toString();
    if(intentConstants.MANAGER_TYPE_NAV == managerType && intentConstants.MANAGER_DISCONNECTED_STATE == this.getConnectivityState(managerName, intentConstants.NETCONF_PROTOCOL)){
        throw new RuntimeException("Can't connect to Altiplano AV : " + managerName);
    } else if (intentConstants.MANAGER_TYPE_NAV != managerType && managerInfo.getConnectivityState().toString() === intentConstants.MANAGER_DISCONNECTED_STATE) {
        if (managerType === 'AMS') {
            throw new RuntimeException("Cannot connect to AMS manager:" + managerName);
        }else if (managerType === intentConstants.MANAGER_TYPE_NSP) {
            throw new RuntimeException("Can't connect to NSP :" + managerName);
        }else if (managerType === intentConstants.MANAGER_TYPE_NSP_MDM) {
            throw new RuntimeException("Can't connect to NSP_MDM :" + managerName);                
        } else {
            throw new RuntimeException("Can't connect : " + managerName);
        }
    }
};

/**
 * The method will return the different values of the list in the below format
 * "firstACL": { "ipv4acl2": { "destinationNetwork": { "oldValue":
 * "2.3.4.6/12", "currentValue": "" }, "destinationLowerPort": { "oldValue":
 * "300", "currentValue": "200" } } }
 *
 * Special case , if the value x changed to empty the return values will be
 * like this , "firstACL": { "ipv4acl2": { "destinationNetwork": { "oldValue":
 * "2.3.4.6/12", "currentValue": "" } } }
 *
 * But if the value changed from empty to x then the different value won't
 * available in the object. Right now we are supporting only the value to
 * empty special case and normal change like value x to value y value.
 *
 * @param currentObject,
 *          the current list object
 * @param topology
 * @param objectKey
 *          for find the oldObject from topology xtraInfo.
 */
AltiplanoUtilities.prototype.compareList = function (currentObject, topology, objectKey, deviceID, stageName) {
    var xtraInfo = this.getTopologyExtraInfo(topology);
    if (xtraInfo && typeof xtraInfo[stageName + "_" + deviceID + "_ARGS"] === "string") {
        var storedTemplateArgs = this.JSONParsingWithCatchingException("compareList", xtraInfo[stageName + deviceID + "_ARGS"]);
        if (storedTemplateArgs[deviceID]) {
            var oldObject = storedTemplateArgs[deviceID][objectKey];
            if (oldObject) {
                var result = this.compareListValues(oldObject, currentObject);
                return result;
            }
        }
    }
};

/**
 * Method used to find the modified values in the list.
 *
 * @param oldObject
 * @param currentObject
 */
AltiplanoUtilities.prototype.compareListValues = function (oldObject, currentObject) {
    var result = {};
    var oldKeys = Object.keys(oldObject);
    for (var j = 0; j < oldKeys.length; j++) {
        var currentObjectType = typeof currentObject[oldKeys[j]];
        var oldObjectType = typeof oldObject[oldKeys[j]];
        if ((currentObjectType === "string" || currentObjectType === "number" || currentObjectType === "boolean")) {
            if (oldObject[oldKeys[j]] !== currentObject[oldKeys[j]]) {
                result[oldKeys[j]] = {};
                result[oldKeys[j]].oldValue = oldObject[oldKeys[j]];
                result[oldKeys[j]].currentValue = currentObject[oldKeys[j]];
            }
        } else if (currentObjectType === "undefined" && oldObjectType !== "undefined") {
            if (oldObjectType === "string" || oldObjectType === "number" || oldObjectType === "boolean") {
                result[oldKeys[j]] = {};
                result[oldKeys[j]].oldValue = oldObject[oldKeys[j]];
                result[oldKeys[j]].currentValue = "";
            }
        } else if (currentObjectType === "object" && typeof oldObject[oldKeys[j]] === "object") {
            result[oldKeys[j]] = this.compareListValues(oldObject[oldKeys[j]], currentObject[oldKeys[j]]);
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
AltiplanoUtilities.prototype.getExtractedDeviceSpecificDataNode = function (resourceName, templateArgs) {
    try {
        var requestTemplate = resourceProvider.getResource(resourceName);
        var requestXml = utilityService.replaceVariablesInXmlTemplate(requestTemplate, templateArgs);
        var ncResponse = requestExecutor.execute(templateArgs.deviceID, requestXml);
        var xPathToDsd = "/nc:rpc-reply/nc:data/device-manager:device-manager/" +
            "adh:device[adh:device-id=\'" + templateArgs.deviceID + "\']/adh:device-specific-data";
        var extractedNode = utilityService.extractSubtree(ncResponse, this.prefixToNsMap, xPathToDsd);
        return extractedNode;
    } catch (e) {
        logger.warn("RPC response doesn't contain device-specific-data {}", e);
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
 * @param xpath
 * @param argPrefixToNsMap
 * @returns {*}
 */
AltiplanoUtilities.prototype.getExtractedNodeFromResponse = function (resourceName, templateArgs, xpath, argPrefixToNsMap) {
    try {
        var requestTemplate = resourceProvider.getResource(resourceName);
        var requestXml = utilityService.replaceVariablesInXmlTemplate(requestTemplate, templateArgs);
        var deviceName = templateArgs.deviceID;
        var managerName = templateArgs.managerName;
        var ncResponse;
        if (deviceName) {
            ncResponse = requestExecutor.execute(deviceName, requestXml);
        } else if (managerName) {
            var configResponse = requestExecutor.executeNCWithManager(managerName, requestXml);
            ncResponse = configResponse.getRawResponse();
        } else {
            ncResponse = this.executeRequestInNAC(requestXml);
        }
        var extractedNode = utilityService.extractSubtree(ncResponse, argPrefixToNsMap, xpath);
        return extractedNode;
    } catch (e) {
        logger.warn("RPC response doesn't contain any data under provided xpath {}, error: {}", xpath, e);
    }
    return null;
};

/**
 * Used to get the element value from the given xpath.
 *
 * @param extractedNode
 * @param xpath
 * @param prefixToNsMap
 * @returns {*}
 */
AltiplanoUtilities.prototype.getNodeValue = function (extractedNode, xpath, prefixToNsMap) {
    return utilityService.evalXpathForText(extractedNode, prefixToNsMap, xpath);
};

/**
 * Used to get the element values from the given xpath.
 *
 * @param extractedNode
 * @param xpath
 * @param prefixToNsMap
 * @returns {*}
 */
AltiplanoUtilities.prototype.getAttributeValues = function (extractedNode, xpath, prefixToNsMap) {
    return utilityService.getAttributeValues(extractedNode, xpath, prefixToNsMap);
};

AltiplanoUtilities.prototype.getVonuDeviceLabels = function (target, resourcePath) {
    var templateArgs = {
        deviceID: target
    };

    try {
        var xpath = "/nc:rpc-reply/nc:data/device-manager:device-manager/" +
            "adh:device[adh:device-id=\'" + templateArgs.deviceID + "\']";
        var node = this.getExtractedNodeFromResponse(resourcePath, templateArgs, xpath, this.prefixToNsMap);     
        if (node) {
            var getLabelXpath = function (label) {
                return "anv-device-tag:configured-labels/anv-device-tag:label[anv-device-tag:name=\'" + label + "\']/anv-device-tag:value/text()"
            };
            var vonuDeviceLabels = {};
            vonuDeviceLabels.fiberName = apUtils.getNodeValue(node, getLabelXpath("channel-group"), this.prefixToNsMap);
            vonuDeviceLabels.oltDevices = apUtils.getNodeValue(node, getLabelXpath("olt-devices"), this.prefixToNsMap);
            vonuDeviceLabels.xponType = apUtils.getNodeValue(node, getLabelXpath("xpon-type"), this.prefixToNsMap);
            vonuDeviceLabels.bandwidthStrategyType = apUtils.getNodeValue(node, getLabelXpath("bandwidth-strategy-type"), this.prefixToNsMap);
            logger.debug("getVonuDeviceLabels labels: {}", JSON.stringify(vonuDeviceLabels));
            return vonuDeviceLabels;
        }
    } catch (exception) {
        logger.warn("Unable to fetch the Device Configured Labels details for : {}, error: {}", target, exception);
    }
    return null;
};

/**
 *  This Method return Device's InterfaceVersion from AV
 * @param deviceName
 * @returns {null|*}
 */
AltiplanoUtilities.prototype.getDeviceInterfaceVersion= function(deviceName, ihubDevice) {
    var templateArgs = {
        "deviceID": deviceName
    }
    if(ihubDevice) {
        templateArgs["ihubDeviceID"] = ihubDevice;
    }
    try {
        var xpath = "/nc:rpc-reply/nc:data/device-manager:device-manager/" +
            "adh:device[adh:device-id=\'" + templateArgs.deviceID + "\']";
        var node = this.getExtractedNodeFromResponse(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getInterfaceAndHardware.xml.ftl", templateArgs, xpath, this.prefixToNsMap);
        if (node) {
            var datapath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceName + "\']";
            var interfaceVersionNT = this.getNodeValue(node, datapath + "/adh:interface-version", this.prefixToNsMap);
            var interfaceVersion = {};
            interfaceVersion[deviceName] = interfaceVersionNT;
            if(requestScope && typeof requestScope.get === "function" && requestScope.get()){
                var interfaceVersionDevices = requestScope.get().get("interfaceVerisonDevices");
                if(deviceName && interfaceVersionNT){
                    if(interfaceVersionDevices){
                        interfaceVersionDevices[deviceName] = interfaceVersionNT; 
                    }
                }
                if(ihubDevice) {
                    var datapathIhub = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + ihubDevice + "\']";
                    var interfaceVersionIhub = this.getNodeValue(node, datapathIhub + "/adh:interface-version", this.prefixToNsMap);
                    interfaceVersion[ihubDevice] = interfaceVersionIhub;
                    if(interfaceVersionDevices){
                        interfaceVersionDevices[ihubDevice] = interfaceVersionIhub;
                    }
                }
            }
            logger.debug("getDeviceInterfaceVersion interfaceVersion: {}", JSON.stringify(interfaceVersion));
            return interfaceVersion;
        }
    } catch (exception) {
        logger.warn("Unable to fetch the Device Interface Version for : {}, error: {}", deviceName, exception);
    }
    return null;
}

/**
 * This method is used to get the device version of device
 * Use case: in the device-xxx intent, when device is migrating,
 * the device-version between GUI and AV is different, so it can cause
 * some migration impacts. So we will use version from MDS with high priority
 * @param {string} deviceName 
 * @param {string} deviceVersion 
 * @returns 
 */
AltiplanoUtilities.prototype.getDeviceVersionForCaps = function (deviceName, deviceVersion) {
    let hwTypeRelease;
    try {
        let oltDevices = apUtils.getOltDeviceInfoFromMDS(deviceName);
        hwTypeRelease = oltDevices[0].familyTypeRelease.substring(oltDevices[0].familyTypeRelease.lastIndexOf("-") + 1);
    } catch (e) {
        logger.error("Error in invoking Get device version for capabilities ", e);
    }
    logger.debug("Invoked get device version for capabilities with deviceName {} hwTypeRelease {} deviceVersion {}", deviceName, hwTypeRelease, deviceVersion);
    return hwTypeRelease ? hwTypeRelease : deviceVersion;
}
/**
 * Compare device version to check if the device is migrating or not
 * 1. Check with version from requestScope
 * 2. Check with version from MDS
 * @param {*} deviceName 
 * @param {*} expectedDeviceVersion 
 * @returns 
 */
AltiplanoUtilities.prototype.compareDeviceVersion = function (deviceName, expectedDeviceVersion) {
    if (deviceName && expectedDeviceVersion) {
        if(requestScope && typeof requestScope.get === "function"){
            let actualDeviceVersion;
            let interfaceVersionDevices = requestScope.get().get("interfaceVerisonDevices");
            if(interfaceVersionDevices){
                actualDeviceVersion = interfaceVersionDevices[deviceName];
            }
            if (!actualDeviceVersion) {
                actualDeviceVersion = apUtils.getDeviceVersionForCaps(deviceName, expectedDeviceVersion);
            }
            if (actualDeviceVersion && actualDeviceVersion != expectedDeviceVersion) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Get template arguments from topology
 * @param {*} deviceName 
 * @param {*} oldTopologyExtraInfo 
 * @param {*} templateArgs 
 * @param {*} deviceReleaseVersion 
 * @param {*} stageName 
 * @param {*} stepName 
 * @returns 
 */
AltiplanoUtilities.prototype.getTemplateArgsForTopology = function (deviceName, oldTopologyExtraInfo, templateArgs, deviceReleaseVersion, stageName, stepName) {
    let isUpdated = apUtils.compareDeviceVersion(deviceName, deviceReleaseVersion);
    if (isUpdated) {
        if (oldTopologyExtraInfo && oldTopologyExtraInfo[stageName]) {
            if (typeof oldTopologyExtraInfo[stageName] === "string") {
                let storedTemplateArgs = JSON.parse(oldTopologyExtraInfo[stageName]);
                if (storedTemplateArgs && storedTemplateArgs[stepName]) {
                    return storedTemplateArgs[stepName];
                }
            }
        }
    }
    return templateArgs;
}

/**
 *  This Method return Device manager holding details from AV
 * @param deviceName
 * @returns {{}}|*}
 */
 AltiplanoUtilities.prototype.getDeviceHolderDetail= function(deviceName){
    var templateArgs = {
        "deviceID": deviceName
    }
    var deviceHolderDetail = {};
    try {
        var xpath = "/nc:rpc-reply/nc:data/device-manager:device-manager/" +
            "adh:device[adh:device-id=\'" + templateArgs.deviceID + "\']";
        var node = this.getExtractedNodeFromResponse(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getDeviceHolderDetail.xml.ftl", templateArgs, xpath, this.prefixToNsMap);
        if (node) {
            deviceHolderDetail ["device-exist"] = true;
            var datapath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceName + "\']";
            deviceHolderDetail ["duid"] = this.getNodeValue(node, datapath + "/adh:duid", this.prefixToNsMap);
        }
    } catch (exception) {
        logger.warn("Unable to fetch the Device holder details for : {}, error: {}", deviceName, exception);
    }
    return deviceHolderDetail;
}

/**
 * This Method return Software File Name From Software URL & File Server URL
 * @param software
 * @returns swFileName
 */

AltiplanoUtilities.prototype.getSoftwareFileNamefromFileServerORUrl= function(software){
    var swFileName = null;
    logger.debug("getSoftwareFileNamefromFileServerORUrl software {}",software);
    if(software.contains(intentConstants.HTTP_HTTPS_URL_SOFTWARE_DIVIDER)){
        //URL Case
        swFileName = software.substring(software.lastIndexOf(intentConstants.SOFTWARE_DIVIDER_STASH) + 1);
    }else if(software.indexOf(intentConstants.FILE_SERVER_SOFTWARE_DIVIDER) > 0 && (!software.contains(intentConstants.HTTP_HTTPS_URL_SOFTWARE_DIVIDER))){
        //File Server Case
        if (software.lastIndexOf(intentConstants.SOFTWARE_DIVIDER_STASH) + 1) { //this condition handles Invalid: testServer:image and valid: imageName
            swFileName =  software.substr(software.lastIndexOf(intentConstants.SOFTWARE_DIVIDER_STASH) + 1, software.length);
        }
    }
    logger.debug("getSoftwareFileNamefromFileServerORUrl swFileName {}",swFileName);
    return swFileName;
}

/**
 * This method will reterive olt details from MDS
 * @param oltDevices
 * @return [{*}]
 * */
AltiplanoUtilities.prototype.getOltDeviceInfoFromMDS = function (oltDevices) {
    if (oltDevices) {
        var oltDevicesSplit = oltDevices.split(",");
        return apUtils.gatherInformationAboutDevices(oltDevicesSplit);
    }
    return [];
}

AltiplanoUtilities.prototype.getOltDeviceInfoFromVonuLabels = function (vonuDeviceLabels) {
    if (vonuDeviceLabels && vonuDeviceLabels.oltDevices) {
        var oltDevicesSplit = vonuDeviceLabels.oltDevices.split(",");
        return apUtils.gatherInformationAboutDevices(oltDevicesSplit);
    }
    return [];
}

AltiplanoUtilities.prototype.getDeviceListFromLabels = function (target, resourcePath, oltDevices) {
    var devices = {};
    if (oltDevices) {
        var oltDevicesSplit = oltDevices.split(",");
        oltDevicesSplit.forEach(function (oltDevice) {
            devices[oltDevice] = oltDevice;
        });
    } else {
        var vOnuDeviceDetails = this.getVonuDeviceLabels(target, resourcePath);
        if (vOnuDeviceDetails) {
            var oltDevices = vOnuDeviceDetails.oltDevices;
            if (!oltDevices) {
                return devices;
            }
            var oltDevicesSplit = oltDevices.split(",");
            oltDevicesSplit.forEach(function (oltDevice) {
                devices[oltDevice] = oltDevice;
            });
        }
    }
    logger.debug("getDeviceListFromLabels devices: {}", JSON.stringify(devices));
    return devices;
};

/**
 * ES Methods
 * @param queryResponse
 * @returns {boolean}
 */
AltiplanoUtilities.prototype.isResponseContainsData = function (queryResponse) {
    if (queryResponse && queryResponse.hits) {
        if (queryResponse.hits.total.value <= 0) {
            return false;
        }
        return true;
    }
    return false;
};

AltiplanoUtilities.prototype.getESCountValueFromResponse = function (queryResponse) {
    if (queryResponse && queryResponse.count) {
        return queryResponse.count;
    }
    return 0;
};

AltiplanoUtilities.prototype.executeEsIntentSearchRequest = function (queryString) {
    var response = esQueryService.queryESIntents(queryString);
    return JSON.parse(response);
};

AltiplanoUtilities.prototype.executeEsIntentCountRequest = function (queryString) {
    var response = esQueryService.countESIntentsByQuery(queryString);
    return JSON.parse(response);
};

AltiplanoUtilities.prototype.executeEsProfileSearchRequest = function (queryString) {
    var response = esQueryService.queryESIntents("profiles/_search", queryString);
    return JSON.parse(response);
};

AltiplanoUtilities.prototype.executeEsHamSearchRequest = function (queryString) {
    var response = esQueryService.queryESIntents("ham/_search/", queryString);
    return JSON.parse(response);
};

AltiplanoUtilities.prototype.getResourcesIdFromResponse = function (response) {
    var deleteResources = [];
    if (apUtils.isResponseContainsData(response)) {
        if (response.hits.total.value != 0) {
            var hit = response.hits.hits[0];
            var supportingResources =  hit["_source"]["supporting-resources"];
            for(var supportingResource in supportingResources) {
                var resourceId = supportingResources[supportingResource]["resource-id"];
                deleteResources.push(resourceId);
            }
        }
    }
    return deleteResources;
};


AltiplanoUtilities.prototype.executeGetHamResource = function (lagId, deviceName) {
    var response;
    var templateESArgs = {lagId: lagId, deviceName: deviceName};
    var resourceFile = resourceProvider.getResource("esQueryHamLagId.json.ftl");
    var request = utilityService.processTemplate(resourceFile, templateESArgs);
    try {
        response = apUtils.executeEsHamSearchRequest(request);
    } catch (error) {
        logger.debug("Cannot query ES for ham")
    }
    return response;
}

AltiplanoUtilities.prototype.getTemplate = function (queryString) {
    var response = esQueryService.queryESIntents("ham/_search/", queryString);
    return JSON.parse(response);
};

/**
 * Intent lock support
 */
/**
 * Method used to lock the intent execution based on the provided object;
 */
AltiplanoUtilities.prototype.intentLockUtil = function () {
    var intentLocks = new IntentLocksClass();
    this.acquireLockOnIntent = function (intentType, lockObject) {
        var intentStatePK = IntentStatePKClass.from(intentType, lockObject);
        logger.debug("acquire lock on object : {}", lockObject);
        intentLocks.lockOn(intentStatePK);
    };

    this.releaseLockOnIntent = function (intentType, lockedObject) {
        var intentStatePK = IntentStatePKClass.from(intentType, lockedObject);
        logger.debug("release lock on object : {}", lockedObject);
        intentLocks.unlock(intentStatePK);
    };
};

/**
 * Executes the provided get-config request in the provided manager
 *
 * @param manager
 * @param xmlConfig
 * @returns {*}
 */
AltiplanoUtilities.prototype.executeGetConfigRequest = function (manager, xmlConfig) {
    var configResponse = requestExecutor.executeNCWithManager(manager, xmlConfig);
    if (configResponse == null || configResponse.getRawResponse() == null) {
        throw new RuntimeException("Execution Failed with error " + configResponse);
    }
    return configResponse.getRawResponse();
};

/**
 * Returns all the managers for the list of manager types
 *
 * @param managerList
 * @returns {ArrayList}
 */
AltiplanoUtilities.prototype.getDeviceManagerNames = function (managerTypes) {
    let managersForAllType = new ArrayList();
    let scopeKey;
    for (let i = 0; i < managerTypes.length; i++) {
        let managerType = managerTypes[i];
        scopeKey = "mds_deviceManagerNames_" + managerType;
        let managers = apUtils.getContentFromIntentScope(scopeKey);
        if (managers) {
            managersForAllType.addAll(managers);
        } else {
            managers = mds.getAllManagersOfType(managerType);
            managersForAllType.addAll(managers);
            apUtils.storeContentInIntentScope(scopeKey, managers);
        }
    }
    return managersForAllType;
};

AltiplanoUtilities.prototype.validateDeviceManager = function (intentConfigJson) {
    var managerName = intentConfigJson["device-manager"];
    if (!managerName) {
        managerName = intentConfigJson["application-service-manager"];
    }
    this.checkManagerConnectivityStateForManager(managerName);
};

/**
 * Checks the connectivity state of the manager in A&A
 *
 * @param managerName
 */
AltiplanoUtilities.prototype.checkManagerConnectivityStateForManager = function (managerName) {
    logger.debug("checkManagerConnectivityStateForManager with managerName: {}", managerName);
    var manager = apUtils.getManagerByName(managerName);
    if (!manager) {
        throw new RuntimeException("Manager not found in MDS: " + managerName);
    }
    if(intentConstants.MANAGER_TYPE_NAV == manager.getType() && intentConstants.MANAGER_DISCONNECTED_STATE == this.getConnectivityState(managerName, intentConstants.NETCONF_PROTOCOL)){
        throw new RuntimeException("Can't connect to Altiplano AV : " + managerName);
    }else if (intentConstants.MANAGER_TYPE_NAV != manager.getType() && intentConstants.MANAGER_DISCONNECTED_STATE === manager.getConnectivityState().toString()) {
        throw new RuntimeException("Manager " + managerName + " is in DISCONNECTED state.");
    }
};

/***
 * Returns connectivity status of NAV manager based on protocol
 * @param managerName
 * @param protocol
 * @returns status
 * */
AltiplanoUtilities.prototype.getConnectivityState = function (managerName, protocol) {
    if(managerName && protocol){
        return mds.getConnectivityState(managerName,protocol);
    }else{
        throw new RuntimeException("Manager name and Protocol can't be null");
    }
};

/**
 * Suggent device name based on the context and managerTypes
 *
 * @param context
 * @param managerName
 * @returns {Object}
 */
AltiplanoUtilities.prototype.suggestDeviceNamesForManagerType = function (context, managerTypes) {
    var devices = new ArrayList();
    devices.addAll(mds.get10DevicesForManagerType(managerTypes, context.getSearchQuery()));
    if (devices) {
        var returnVal = new Object();
        devices.forEach(function (device) {
            returnVal[device] = device;
        })
        return returnVal;
    }
};

AltiplanoUtilities.prototype.executeRequestInNAC = function (requestXml) {
    var configResponse = utilityService.executeRequest(requestXml);
    var responseString = utilityService.convertNcResponseToString(configResponse);

    if (responseString == null) {
        throw new RuntimeException("Execution Failed with error " + responseString);
    }
    return responseString;
};

/**
 * Suggent lt or nt ports based on the deviceName, ports and portType
 *
 * @param deviceName
 * @param ports
 * @param portType
 * @returns {Object}
 */
//TODO for ls-dpu
AltiplanoUtilities.prototype.suggestEthernetPortAndLAG = function (deviceName, ports, portType) {
    //virtual port must not be added in the auto-suggest
    var virtualAndPreviousPort = (portType.substring(0, 2) === "nt") ? [deviceName+"#nt:vp:1", deviceName+"#nt:mc:1"] : [];
    //previously selected ports must not be show in the auto-suggest
    if (ports.length) {
        for (var index = 0; index < ports.length; index++) {
            virtualAndPreviousPort.push(ports[index]);
        }
    }
    var amsFwk = new AltiplanoAMSIntentHelper();
    var mObject = new MObjectProxy(amsFwk, deviceName);
    var returnVal = null;
    //We can create LAG (Link Aggregation Group) with list of nt-ports, so retrieve LAG in the auto-suggest, if port type is nt-port
    if (portType.substring(0, 2) == "nt") {
        var lagPorts = mObject.getAllChildrenOfType("Link Aggregation Group", "NE:" + deviceName);
        if (lagPorts) {
            returnVal = new Object();
            lagPorts.forEach(function (lagPortDetail) {
                var lagPortDetailArray = lagPortDetail.split(":");
                var lagPort = "LAG-" + lagPortDetailArray[lagPortDetailArray.length - 1];
                if (virtualAndPreviousPort.indexOf(deviceName+"#"+lagPort) == -1) {
                    returnVal[lagPort] = lagPort;
                }
            })
        }
    }
    //Add lt-port or nt-port in the auto-suggest as per port type
    if(portType == "nt-port" || portType == "lt-port"){
        var ethPortsFrName = mObject.getAllChildrenOfType("Ethernet Port", "Agent:" + deviceName + ":IHUB");
    }else{
        var ethPortsFrName = mObject.getAllChildrenOfType("Ethernet NT Port", "Agent:" + deviceName + ":IACM");
    }

    var ethPortFrNameWithPortName = mObject.get(ethPortsFrName, ["portName"]);
    if (ethPortFrNameWithPortName) {
        returnVal = (returnVal == null) ? new Object() : returnVal;
        ethPortFrNameWithPortName.forEach(function (friendlyName) {
            var portNameWithPortFrName = ethPortFrNameWithPortName.get(friendlyName);
            var portFriendlyName = portNameWithPortFrName.get("portName");
            if ((portFriendlyName.substring(0, 2) === portType.substring(0, 2)) && virtualAndPreviousPort.indexOf(deviceName+"#"+portFriendlyName) == -1) {
                returnVal[portFriendlyName] = portFriendlyName;
            }
        })
    }
    return returnVal;
};

/*****************************************************************************
 * Method used to get node type from the devices created as a part device-xxx intent or MDS
 * This intent is suitable for usage in the intents below the red line i.e. where the device-xxx intent is known
 *
 * @param Device Name
 * @param Device-xxx Intent Type Name
 * @returns {deviceType}
 */

AltiplanoUtilities.prototype.getNodeTypeFromDeviceIntentAndMds = function (deviceName,deviceIntentType) {
    var fetchKey = "deviceNodeType_".concat(deviceName);
    var deviceType = this.getContentFromIntentScope(fetchKey);
    if (deviceType) {
        return deviceType;
    }
    var deviceIntent = apUtils.getIntent(deviceIntentType, deviceName);
    if (deviceIntent) {
        var deviceIntentConfigJson = apUtils.convertIntentConfigXmlToJson(deviceIntent.getIntentConfig(), null);
        deviceType = deviceIntentConfigJson["hardware-type"] + "-" + deviceIntentConfigJson["device-version"];
    } else {
        var deviceInfos = apUtils.getAllInfoFromDevices(deviceName);
        if (null == deviceInfos || deviceInfos.size() == 0) {
            throw new RuntimeException("Device not found: " + deviceName);
        }
        var deviceInfo = deviceInfos.get(0);
        var deviceType = deviceInfo.getFamilyTypeRelease();
        if (deviceType == null) {
            throw new RuntimeException("Device Family type and release not found for device: " + deviceName);
        }
    }
    this.storeContentInIntentScope(fetchKey, deviceType);
    return deviceType;
};

/**
 * This method will return device infomation with cache
 * 
 * @param {String} deviceName deviceName
 * @returns {deviceInfos}
 */
AltiplanoUtilities.prototype.getAllInfoFromDevices = function (deviceName) {
    var fetchKey = "deviceInfo_".concat(deviceName);
    var deviceInfos = this.getContentFromIntentScope(fetchKey);
    if (deviceInfos) {
        return deviceInfos;
    }
    deviceInfos = mds.getAllInfoFromDevices(deviceName);
    if (null != deviceInfos && deviceInfos.size() > 0) {
        this.storeContentInIntentScope(fetchKey, deviceInfos);
    }
    return deviceInfos;
}

/**
 * This method will return device manager with cache
 * 
 * @param {String} deviceName deviceName
 * @returns {managerInfos} 
 */
AltiplanoUtilities.prototype.getAllManagersWithDevice = function (deviceName) {
    var fetchKey = "allManagersWithDevice_".concat(deviceName);
    var managerInfos = this.getContentFromIntentScope(fetchKey);
    if (managerInfos && managerInfos.size() > 0) {
        return managerInfos;
    }
    managerInfos = mds.getAllManagersWithDevice(deviceName);
    if (null != managerInfos) {
        this.storeContentInIntentScope(fetchKey, managerInfos);
    }
    return managerInfos;
}

/**
 * This method will return manager information with cache
 * 
 * @param {String} managerName manager name
 * @returns {manager} 
 */
AltiplanoUtilities.prototype.getManagerByName = function (managerName) {
    var fetchKey = "managerInfo_".concat(managerName);
    var managerInfo = this.getContentFromIntentScope(fetchKey);
    if (managerInfo) {
        return managerInfo;
    }
    managerInfo = mds.getManagerByName(managerName);
    if (null != managerInfo) {
        this.storeContentInIntentScope(fetchKey, managerInfo);
    }
    return managerInfo;
}

/**
 * This method will return intent information with cache
 * 
 * @param {String} intentType intent type like device-config-fx, fiber
 * @param {String} target target of intent
 * @returns {intentInfo}
 */
AltiplanoUtilities.prototype.getIntent = function (intentType, target) {
    var fetchKey = "intentFromIBN_".concat(intentType) + "_" + target;
    var intentInfo = this.getContentFromIntentScope(fetchKey);
    if (intentInfo) {
        return intentInfo;
    }
    intentInfo = ibnService.getIntent(intentType, target);
    if (null != intentInfo && intentInfo.getIntentTypeVersion()) {
        this.storeContentInIntentScope(fetchKey, intentInfo);
    }
    return intentInfo;
}

/**
 * This method will return resource value with cache
 * 
 * @param {String} intentType intent type like device-config-fx, fiber
 * @param {Number} intentVersion intent version like 2, 3
 * @param {String} resourceName resource file name
 * @returns {resourceValue}
 */
AltiplanoUtilities.prototype.getResourceValue = function (intentType, intentVersion, resourceName) {
    var fetchKey = "resourceValueFromIBN_".concat(intentType) + "_" + intentVersion + "_" + resourceName;
    var resourceValue = this.getContentFromIntentScope(fetchKey);
    if (resourceValue) {
        return resourceValue;
    }
    resourceValue = ibnService.getResourceValue(intentType, intentVersion, resourceName);
    if (null != resourceValue) {
        this.storeContentInIntentScope(fetchKey, resourceValue);
    }
    return resourceValue;
}

/**
 * This method will return gatherInformationAboutDevices with cache
 * 
 * @param {Array} deviceNames list of device name
 * @returns {Array} 
 */
 AltiplanoUtilities.prototype.gatherInformationAboutDevices = function (deviceNames) {
     var result;
     if (deviceNames != null && deviceNames.length > 0 && deviceNames[0] instanceof String) {
         var fetchKey = "gatherInformationAboutDevices_".concat(deviceNames.join("_"));
         result = this.getContentFromIntentScope(fetchKey);
         if (result) {
             return result;
         }
         result = apfwk.gatherInformationAboutDevices(deviceNames);
         if (null != result) {
             this.storeContentInIntentScope(fetchKey, result);
         }
     } else {
         result = apfwk.gatherInformationAboutDevices(deviceNames);
     }
     return result;
}

/**
 * This method will return targetted-devices for a specific intentType and target
 * @param intentType
 * @param target
 */
AltiplanoUtilities.prototype.getTargettedDevicesFromIntentType = function (intentType, target, sizeOfResult) {
    var targettedDevices = [];
    var object = {};
    var mustArray = [];
    var intentTerm = {"term": {"intent-type": intentType}};
    var deviceTerm = {"term": {"target.device-name.keyword": target}};
    mustArray.push(intentTerm);
    mustArray.push(deviceTerm);
    var rootObject = {"bool": {"filter": mustArray}};
    object["query"] = rootObject;
    object["_source"] = ["targetted-devices"];
    if (sizeOfResult) {
        object["size"] = sizeOfResult;
    }

    var response = apUtils.executeEsIntentSearchRequest(JSON.stringify(object));
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
            if (intentResult["_source"]["targetted-devices"] !== undefined) {
                targettedDevices = intentResult["_source"]["targetted-devices"];
            }
        });
    }
    return targettedDevices;
};

AltiplanoUtilities.prototype.getNodeTypeFromEs = function(deviceName) {
    var fetchKey = "deviceNodeTypeFromEs_".concat(deviceName);
    var deviceType = this.getContentFromIntentScope(fetchKey);
    if (deviceType) {
        return deviceType;
    }
    deviceType = null;
    var deviceInfo = apUtils.getDeviceInfo(deviceName);
    if (deviceInfo && (deviceInfo.isLtDevice || deviceInfo.isIhubDevice)) {
        deviceName = deviceInfo.shelfDeviceName;
    }
    var object = {};
    var mustArray = [];
    var labelObject = {"term": {"label": "Physical Equipment"}};
    var deviceTerm = {"term": {"target.device-name.keyword": deviceName}};
    mustArray.push(labelObject);
    mustArray.push(deviceTerm);
    var mustNotArray = [];
    var unsupportedLabelObject = {"term": {"label": "Slicing"}};
    mustNotArray.push(unsupportedLabelObject);
    var rootObject = {"bool": {"must": mustArray,  "must_not": mustNotArray}};
    object["query"] = rootObject;
    object["from"] = 0;
    object["size"] = 1;
    object["_source"] = ["intent-type", "target.raw"];
    var response = apUtils.executeEsIntentSearchRequest(JSON.stringify(object));
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
            deviceType = apUtils.getDeviceTypeByName(deviceInfo, intentResult, deviceName);
        });
    }
    if (deviceType) {
        this.storeContentInIntentScope(fetchKey, deviceType);
    }
    return deviceType;
};

AltiplanoUtilities.prototype.getDeviceInfo = function(deviceName) {
    var deviceInfo = {};
    var deviceTail = null;
    var lastIndexOfDot = deviceName.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
    if (lastIndexOfDot > 0) {
        deviceTail = deviceName.substring(lastIndexOfDot + 1);
        if (deviceTail && deviceTail.startsWith(intentConstants.LT_STRING)) {
            deviceInfo["isLtDevice"] = true;
            deviceInfo["isIhubDevice"] = false;
            deviceInfo["ltCard"] = deviceTail;
            deviceInfo["shelfDeviceName"] = deviceName.substring(0, lastIndexOfDot);
        } else if (deviceTail && deviceTail.startsWith(intentConstants.LS_IHUB)) {
            deviceInfo["isLtDevice"] = false;
            deviceInfo["isIhubDevice"] = true;
            deviceInfo["shelfDeviceName"] = deviceName.substring(0, lastIndexOfDot);
        } else {
            deviceInfo["isLtDevice"] = false;
            deviceInfo["isIhubDevice"] = false;
            deviceInfo["shelfDeviceName"] = deviceName;
        }
    } else {
        deviceInfo["isLtDevice"] = false;
        deviceInfo["isIhubDevice"] = false;
        deviceInfo["shelfDeviceName"] = deviceName;
    }
    return deviceInfo;
}

AltiplanoUtilities.prototype.getDeviceTypeByName = function(deviceInfo, intentResult, deviceName) {
    var deviceType = null;
    if (intentResult["_source"] !== undefined && intentResult["_source"]["intent-type"] !== undefined && intentResult["_source"]["target"]["raw"] !== undefined) {
        if ((intentResult["_source"]["target"]["raw"]) === deviceName) {
            var intentType = intentResult["_source"]["intent-type"];
            var target = intentResult["_source"]["target"]["raw"];
            if (intentType == intentConstants.INTENT_TYPE_DEVICE_IXR) {
                return intentConstants.FAMILY_TYPE_IXR;
            }
            if (deviceInfo && deviceInfo.isLtDevice) {
                if (intentType === intentConstants.INTENT_TYPE_DEVICE_FX || intentType === intentConstants.INTENT_TYPE_DEVICE_MF || intentType === intentConstants.INTENT_TYPE_DEVICE_SF ) {
                    var intentConfigJson = apUtils.getDeviceFxMfIntentConfigJson(target, intentType);
                    if (intentConfigJson && intentConfigJson["boards"]) {
                        var ltDevices = intentConfigJson["boards"];
                        var ltCards = Object.keys(ltDevices);
                        for (var i = 0; i < ltCards.length; i++) {
                            if (deviceInfo["ltCard"] == ltCards[i]) {
                                var ltDeviceDetail = ltDevices[ltCards[i]];
                                if (intentType === intentConstants.INTENT_TYPE_DEVICE_FX) {
                                    var isEthBoard = false;
                                    isEthBoard = apCapUtils.isValueInCapability(intentConfigJson["hardware-type"], intentConfigJson["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, ltDeviceDetail["planned-type"], "ETH");
                                    var isBoardTypeLT = apCapUtils.isValueInCapability(intentConfigJson["hardware-type"], intentConfigJson["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.SLOT_TYPE, ltDeviceDetail["planned-type"], "LT");
                                    if(isEthBoard && isBoardTypeLT){
                                        var deviceDetails = {};
                                        deviceDetails["useProfileManager"] = true;
                                        deviceDetails["deviceName"] = deviceName;
                                        deviceDetails["nodeType"] = intentConfigJson["hardware-type"] + "-" + intentConfigJson["device-version"];
                                        deviceDetails["intentType"] = intentConstants.INTENT_TYPE_DEVICE_FX;
                                        deviceDetails["intentTypeVersion"] = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_FX, deviceName);
                                        deviceDetails["excludeList"] = Arrays.asList(profileConstants.BOARD_SERVICE_PROFILE.subTypeETH);
                                        var boardServiceProfileObj = apUtils.getIntentAttributeObjectValues(null, profileConstants.BOARD_SERVICE_PROFILE.profileType, "name", ltDeviceDetail["board-service-profile"], deviceDetails);
                                        if(boardServiceProfileObj["model"] === "uplink-mode"){
                                            deviceType = intentConstants.LS_FX_PREFIX + "-" + ltDeviceDetail["planned-type"] + "-" + intentConstants.UP_LINK_HW_TYPE_POSTFIX.concat("-", ltDeviceDetail["device-version"] ? ltDeviceDetail["device-version"] : intentConfigJson["device-version"]);
                                        }else if(boardServiceProfileObj["model"] === "downlink-mode"){
                                            deviceType = intentConstants.LS_FX_PREFIX + "-" + ltDeviceDetail["planned-type"] + "-" + intentConstants.DOWN_LINK_HW_TYPE_POSTFIX.concat("-", ltDeviceDetail["device-version"] ? ltDeviceDetail["device-version"] : intentConfigJson["device-version"]);
                                        }
                                    }
                                    else {
                                        deviceType = intentConstants.LS_FX_PREFIX.concat("-", ltDeviceDetail["planned-type"], "-", ltDeviceDetail["device-version"] ? ltDeviceDetail["device-version"] : intentConfigJson["device-version"]);
                                    }
                                } else if (intentType === intentConstants.INTENT_TYPE_DEVICE_MF) {
                                    deviceType = intentConstants.LS_MF_PREFIX.concat("-", ltDeviceDetail["planned-type"], "-", ltDeviceDetail["device-version"] ? ltDeviceDetail["device-version"] : intentConfigJson["device-version"]);
                                } else if (intentType === intentConstants.INTENT_TYPE_DEVICE_SF) {
                                    deviceType = intentConstants.LS_SF_PREFIX.concat("-", ltDeviceDetail["planned-type"], "-", ltDeviceDetail["device-version"] ? ltDeviceDetail["device-version"] : intentConfigJson["device-version"]);
                                }
                                break;
                            }
                        }
                    }
                }
            } else {                                 
                var deviceIntent = apUtils.getIntent(intentType, target);
                if (!deviceIntent) {
                    throw new RuntimeException("Intent Type : {}, with target : {} does not exist", intentType, target);
                } else {
                    var deviceConfig = deviceIntent.getIntentConfig();
                    var intentConfigJson = apUtils.convertIntentConfigXmlToJson(deviceConfig);
                    if (intentConfigJson["hardware-type"] && intentConfigJson["device-version"]) {
                        if (deviceInfo && deviceInfo.isIhubDevice) {
                            var generalDeviceType = intentConfigJson["hardware-type"].substring(0, 5);
                            deviceType = intentConfigJson["hardware-type"].replace(generalDeviceType, generalDeviceType + "-IHUB") + "-" + intentConfigJson["device-version"];
                        } else {
                            deviceType = intentConfigJson["hardware-type"] + "-" + intentConfigJson["device-version"];
                        }
                    }
                }
            }
        }
    }                                                       
    return deviceType;
};

/*****************************************************************************
 * Method used to get node type from the devices available in Elasticsearch created as a part of intent or to get node type from the devices available in MDS
 * This intent is suitable for usage in the intents above the red line i.e. where the device type can be of any variant
 *
 * @param Device Name
 * @returns {deviceType}
 */

AltiplanoUtilities.prototype.getNodeTypefromEsAndMds = function (deviceName) {
    var fetchKey = "deviceNodeType_".concat(deviceName);
    var deviceType = this.getContentFromIntentScope(fetchKey);
    if (deviceType) {
        return deviceType;
    }
    try {
        // Get from MDS
        deviceType = this.getNodeType(deviceName);
    } catch (err) {
        logger.warn("getNodeTypefromEsAndMds Error while fetching the device type from MDS for device : {}, error: {}", deviceName, err);
    }
    if (!deviceType) {
        deviceType = this.getNodeTypeFromEs(deviceName);
        if(!deviceType) {
            // check for IXR
            if (deviceName && deviceName.contains("(")  && deviceName.contains(")")) {
                var ipAddressStr = deviceName.substring(deviceName.lastIndexOf("(") + 1, deviceName.lastIndexOf(")"));
                deviceType = this.getNodeTypeFromEs(ipAddressStr);
                if (!deviceType) {
                    throw new RuntimeException("Device Family type and release not found for device:" + deviceName);
                }
            } else {
                throw new RuntimeException("Device Family type and release not found for device:" + deviceName);
            }
        }
	}
    this.storeContentInIntentScope(fetchKey, deviceType);
    return deviceType;
};

/**
 * Method used to get from JSON resource the list of values for a certain profile type, family, and key.
 * Typical usage: get the names of all profiles of a certain type for a specific device family, for validate.
 *
 * This would work with JSON structure as follows:
 *
 * {
 *   "type1": {
 *     "family1": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ],
 *     "family2": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ]
 *   },
 *   etc.
 * }
 *
 *
 * Case2 :
 *{
 *   "type1": {
 *   "key1": value,
 *   variant1{
 *     "family1": {
 *       {
 *
 *       }
 *     },
 *     "family2": {
 *       {
 *
 *       }
 *     }
 *     }
 *   }
 *   etc.
 * }
 *
 * @param resourceName
 * @param type
 * @param family
 * @param key
 * @param profileManagerDetails - input params to fetch data from profile manager.
 * If useProfilemanager flag is true, the details would be fetched from profile manager instead of JSON
 * @returns Array
 */
AltiplanoUtilities.prototype.getMappingJsonValuesByTypeFamilyKey = function (resourceName, type, family, key,profileManagerDetails) {
    var map;
    if(profileManagerDetails){
        if(profileManagerDetails["profileJsonMap"]){
            map = profileManagerDetails["profileJsonMap"];
        }else{
            map = this.getParsedProfileDetailsFromProfMgr(profileManagerDetails["deviceName"],profileManagerDetails["nodeType"],profileManagerDetails["intentType"],profileManagerDetails["excludeList"], profileManagerDetails["intentTypeVersion"],profileManagerDetails["nwSlicingType"], profileManagerDetails["profileObjectList"]);
        }
        family = null;
    }else{
            var mapJSon = resourceProvider.getResource(resourceName);
            map = JSON.parse(mapJSon)
    }
    var values = [];
    if (family) {
        if (map[type]) {
            if (map[type][family]) {
                map[type][family].forEach(function (entry) {
                    if (entry[key]) {
                        values.push(entry[key]);
                    }
                });
            }
        }
    } else {
    
        if (map[type]) {
            map[type].forEach(function (entry) {
                if (entry[key]) {
                   values.push(entry[key]);
                }
            });
        }
    }
    return values;
};

/**
 * Method used to get from JSON resource the list of values for a certain profile type, family, and key.
 * Typical usage: get the names of all profiles of a certain type for a specific device family, for suggest.
 *
 * This would work with JSON structure as follows:
 *Case1 :
 * {
 *   "type1": {
 *     "family1": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ],
 *     "family2": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ]
 *   },
 *   etc.
 * }
 *
 * Case2 :
 *{
 *   "type1": {
 *   "key1": value,
 *   variant1{
 *     "family1": {
 *       {
 *
 *       }
 *     },
 *     "family2": {
 *       {
 *
 *       }
 *     }
 *     }
 *   }
 *   etc.
 * }
 *
 * @param resourceName
 * @param type
 * @param family
 * @param key
 * @param profileManagerDetails - input params to fetch data from profile manager.
 * If useProfilemanager flag is true, the details would be fetched from profile manager instead of JSON
 * @returns {*}
 */
AltiplanoUtilities.prototype.getMappingJsonObjectValuesByTypeFamilyKey = function (resourceName, type, family, key,profileManagerDetails) {
    var map;
    if(profileManagerDetails && !profileManagerDetails.hasOwnProperty("useProfileManager")){
        profileManagerDetails["useProfileManager"] = true;
    }
    if(profileManagerDetails && profileManagerDetails["useProfileManager"]==true){
        map = this.getParsedProfileDetailsFromProfMgr(profileManagerDetails["deviceName"],profileManagerDetails["nodeType"],profileManagerDetails["intentType"],profileManagerDetails["excludeList"], profileManagerDetails["intentTypeVersion"] );
        family = null;
    }else{
        var mapJSon = resourceProvider.getResource(resourceName);
        map = JSON.parse(mapJSon);
    }
    var values = {};
    if (family) {
        if (map[type]) {
            if (map[type][family]) {
                map[type][family].forEach(function (entry) {
                    if (entry[key]) {
                        values[entry[key]] = entry[key];
                    }
                });
            }
        }
    } else {
        if (map[type]) {
            map[type].forEach(function (entry) {
                if (entry[key]) {
                    values[entry[key]] = entry[key];
                }
            });
        }
    }
    return values;
};


/**
 * Method used to get list of values from JSON resource for list of prefixes and a certain profile type.
 * Typical usage: Get all profile values which are specified in a certain profile type and prefix/prefixes
 *
 * This would work with JSON structure as follows:
 * {
 *   "type1": {
 *     "prefix1": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ],
 *     "prefix2": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ]
 *   },
 *   etc.
 * }
 *
 * @param resourceName
 * @param profileType
 * @param prefixList
 * @param profileJsonName
 * @returns {*}
 */
AltiplanoUtilities.prototype.getJsonObjectValuesByPrefixes = function (resourceName, profileType, prefixList, profileJsonName, profileManagerDetails) {
    var profileMap = {};
    if(profileManagerDetails && !profileManagerDetails.hasOwnProperty("useProfileManager")){
        profileManagerDetails["useProfileManager"] = true;
    }
    var requestContext = requestScope.get();
    if(profileManagerDetails && profileManagerDetails["useProfileManager"] && profileManagerDetails["useProfileManager"]==true){
        var allProfiles = this.getParsedProfileDetailsFromProfMgr(profileManagerDetails["deviceName"],profileManagerDetails["nodeType"],profileManagerDetails["intentType"],[], profileManagerDetails["intentTypeVersion"]);
        if(allProfiles){
            var definedProfiles = allProfiles[profileManagerDetails["devicePrefix"]][profileManagerDetails["profileType"]];
            return this.convertJsonArrayToKeyValueJSONObjects(definedProfiles, "name");
        }
    }
    if(!requestContext) {
        var profileJson = JSON.parse(resourceProvider.getResource(resourceName));
    } else {
        var profileJson = requestScope.get().get(profileJsonName);
    }
    var selectedProfiles = profileJson[profileType];
    profileMap = {};
    prefixList.forEach(function (prefix) {
        if(selectedProfiles[prefix]) {
            selectedProfiles[prefix].forEach(function (profile) {
                if (profile["name"]) {
                    profileMap[profile["name"]] = profile;
                }
            });
        }
    });
    return profileMap;
}

/**
 * Method used to get from JSON resource all data related to a profile of a certain type when a certain key is matching a specific value.
 * Typical usage: get all parameters of a profile of a certain type and with a given name.
 *
 * This would work with JSON structure as follows:
 * {
 *   "type1": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ]
 *   etc.
 * }
 *
 * @param resourceName
 * @param type
 * @param key
 * @param value
 * @returns {*}
 */
AltiplanoUtilities.prototype.getIntentAttributeObjectValues = function (resourceName, type, key, value, profileManagerDetails) {
    var map;
    if (profileManagerDetails) {
        if(profileManagerDetails["profileJsonMap"]){
            map= profileManagerDetails["profileJsonMap"];
        } else {
            map = this.getParsedProfileDetailsFromProfMgr(profileManagerDetails["deviceName"], profileManagerDetails["nodeType"], profileManagerDetails["intentType"], profileManagerDetails["excludeList"], profileManagerDetails["intentTypeVersion"],profileManagerDetails["nwSlicingType"] ,profileManagerDetails["profileObjectList"]);
        }
    }
    else {
        var mapJSon = resourceProvider.getResource(resourceName);
        map = JSON.parse(mapJSon);
    }
    if (map[type]) {
        for (var i = 0; i < map[type].length; i++) {
            if (map[type][i][key] != null && map[type][i][key] == value) {
                return map[type][i];
            }
        }
    }
    return {};
}


/**
 * Method used to get from Pm all data related to a profile of a certain type when a certain key is matching a specific value.
 * Typical usage: get all parameters of a profile of a certain type and with a given name.
 *
 * This would work with JSON structure as follows:
 * {
 *   "type1": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ]
 *   etc.
 * }
 *
 * @param type
 * @param key
 * @param value
 * @returns {*}
 */
 AltiplanoUtilities.prototype.getIntentAttributeObjectValuesFromPm = function (type, key, value, profileManagerDetails) {
    if(profileManagerDetails && !profileManagerDetails.hasOwnProperty("useProfileManager")){
        profileManagerDetails["useProfileManager"] = true;
    }
    var map;
    if(profileManagerDetails && profileManagerDetails["useProfileManager"] && profileManagerDetails["useProfileManager"]==true){
        map = this.getParsedProfileDetailsFromProfMgr(profileManagerDetails["deviceName"],profileManagerDetails["nodeType"],profileManagerDetails["intentType"],profileManagerDetails["excludeList"], profileManagerDetails["intentTypeVersion"]);
    }
    if (map && map[type]) {
        for (var i = 0; i < map[type].length; i++) {
            if (map[type][i][key] != null && map[type][i][key] == value) {
                return map[type][i];
            }
        }
    }
    return {};
}

/**
 * used to get profiles from profile manager with the type of profile
 * @param {String} type type of profiles in profile managers: such as user service type
 * @param {*} profileManagerDetails objects contains informations to get correct profiles: deviceName, nodeType, intentType, excludeList, intentTypeVersion
 * @returns array of profiles
 */
AltiplanoUtilities.prototype.getProfilesFromProfileManagerWithType = function (type, profileManagerDetails) {
    if(profileManagerDetails && !profileManagerDetails.hasOwnProperty("useProfileManager")){
        profileManagerDetails["useProfileManager"] = true;
    }
    var map;
    if(profileManagerDetails && profileManagerDetails["useProfileManager"] && profileManagerDetails["useProfileManager"]==true){
        map = this.getParsedProfileDetailsFromProfMgr(profileManagerDetails["deviceName"],profileManagerDetails["nodeType"],profileManagerDetails["intentType"],profileManagerDetails["excludeList"], profileManagerDetails["intentTypeVersion"]);
    }
    if (map && map[type]) {
        return map[type];
    }
    return [];
}

/**
 * Method used to get list of profiles from JSON resource of a certain type.
 * Typical usage: get all profiles of a certain type
 *
 * This would work with JSON structure as follows:
 * {
 *   "type1": [
 *       {
 *         "key1": value1,
 *         "family1": {
 *             ...
 *         },
 *         "family2": {
 *             ...
 *         },
 *         etc.
 *       }
 *       {
 *         "key2": value2,
 *         "family1": {
 *             ...
 *         },
 *         "family2": {
 *             ...
 *         },
 *         etc.
 *       }
 *     ]
 *   etc.
 * }
 *
 * @param resourceName
 * @param type
 * @param key
 * @param value
 * @returns {*}
 */
AltiplanoUtilities.prototype.getIntentAttributeObjectsList = function (resourceName, type, key, deviceType, profileManagerDetails) {
      var map;
    if (profileManagerDetails) {
        map = this.getParsedProfileDetailsFromProfMgr(profileManagerDetails["deviceName"],profileManagerDetails["nodeType"],profileManagerDetails["intentType"],profileManagerDetails["excludeList"], profileManagerDetails["intentTypeVersion"]);
        deviceType = null;
    }
    else {
        var mapJSon = resourceProvider.getResource(resourceName);
        map = JSON.parse(mapJSon);
    }
    var values = {};
    if (map[type]) {
            for (var i = 0; i < map[type].length; i++) {
                if(deviceType) {
                    if(map[type][i][deviceType]) {
                        values[map[type][i][key]] = map[type][i][key];
                    }
                } else {
                    values[map[type][i][key]] = map[type][i][key];
                }
        }
    }
    return values;
}

/**
 * Method used to get from JSON resource all data related to a profile of a certain type & family when a certain key is matching a specific value.
 * Typical usage: get all parameters of a profile of a certain type for a specific family and with a given name.
 *
 * This would work with JSON structure as follows:
 *Case1 :
 * {
 *   "type1": {
 *     "family1": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ],
 *     "family2": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ]
 *   },
 *   etc.
 * }
 *
 * Case2 :
 *{
 *   "type1": {
 *   "key1": value,
 *   variant1{
 *     "family1": {
 *       {
 *
 *       }
 *     },
 *     "family2": {
 *       {
 *
 *       }
 *     }
 *     }
 *   }
 *   etc.
 * }
 * @param resourceName
 * @param type
 * @param family
 * @param key
 * @param value
 * @param variant
 * @returns {*}
 */
AltiplanoUtilities.prototype.getMappingJsonObjectByTypeFamilyMatchingKeyValue = function (resourceName, type, family, key, value, variant, profileManagerDetails) {

    var map;
    if(profileManagerDetails && !profileManagerDetails.hasOwnProperty("useProfileManager")){
        profileManagerDetails["useProfileManager"] = true;
    }
    if(profileManagerDetails && profileManagerDetails["useProfileManager"]==true){
        map = this.getParsedProfileDetailsFromProfMgr(profileManagerDetails["deviceName"],profileManagerDetails["nodeType"],profileManagerDetails["intentType"],profileManagerDetails["excludeList"], profileManagerDetails["intentTypeVersion"] );
        family = null;
    }else{
        var mapJSon = resourceProvider.getResource(resourceName);
        map = JSON.parse(mapJSon);
    }

    if (!variant) {
        if (map[type]) {
            if (map[type][family]) {
                for (var i = 0; i < map[type][family].length; i++) {
                    if (map[type][family][i][key] != null && map[type][family][i][key] == value) {
                        return map[type][family][i];
                    }
                }
            } else {
                for (var i = 0; i < map[type].length; i++) {
                    if (map[type][i][key] != null && map[type][i][key] == value) {
                        return map[type][i];
                    }
                }
            }
        }
        else if (map[family]) {
            if (map[family][type] && map[family][type].length & map[family][type].length) {
                for (var i = 0; i < map[family][type].length; i++) {
                    if (map[family][type][i][key] != null && map[family][type][i][key] == value) {
                        return map[family][type][i];
                    }
                }
            }
        }
    } else {
        if (map[type]) {
            for (var i = 0; i < map[type].length; i++) {
                if (map[type][i][key] != null && map[type][i][key] == value) {
                    if (map[type][i][variant]){
                        if (map[type][i][variant][family]) {
                            return map[type][i][variant][family];
                        }
                    }
                }
            }
        }
    }
    return {};
};

/**
 * Method used to get from JSON resource the list of values for a certain profile type, family, subType and key.
 * Typical usage: get the names of all profiles of a certain type for a specific device family, subType, for validate.
 *
 * This would work with JSON structure as follows:
 *
 * {
 *   "type1": {
 *     "family1": {
           "subType1" :
              [
            *       {
            *         "key1": value,
            *         "key2": value,
            *         etc.
            *       }
            * ]
           "subType2" :
           [
           *       {
           *         "key1": value,
           *         "key2": value,
           *         etc.
           *       }
           * ]
    }
 }
 *
 *   etc.
 * }
 **/

AltiplanoUtilities.prototype.getMappingJsonValuesByTypeFamilyKeyMatchSubType = function (resourceName, type, family, subType, key) {
    var mapJSon = resourceProvider.getResource(resourceName);
    var map = JSON.parse(mapJSon);
    var values = [];
    if (family) {
     if (map[type]) {
         if (map[type][family]) {
            if (map[type][family][subType]) {
                map[type][family][subType].forEach(function (entry) {
                     if (entry[key]) {
                         values.push(entry[key]);
                     }
                 });
            }

         }
     }
    }
    return values;
};

/**
 * Method used to get from JSON resource all data related to a profile of a certain profile type, family, subType and key.
 * Typical usage: get all parameters of a profile of a certain type for a specific device family, subType and and with a given name.
 *
 * This would work with JSON structure as follows:
 *
 * {
 *   "type1": {
 *     "family1": {
           "subType1" :
              [
            *       {
            *         "key1": value,
            *         "key2": value,
            *         etc.
            *       }
            * ]
           "subType2" :
           [
           *       {
           *         "key1": value,
           *         "key2": value,
           *         etc.
           *       }
           * ]
    }
 }
 *
 *   etc.
 * }
 **/
AltiplanoUtilities.prototype.getMappingJsonObjectByTypeFamilyKeyAndSubTypeMatchKeyValue = function (resourceName, type, family, subType, key, value) {
    var mapJSon = resourceProvider.getResource(resourceName);
    var map = JSON.parse(mapJSon);
    if (family) {
      if (map[type]) {
          if (map[type][family]) {
             if (map[type][family][subType]) {
                 for (var i = 0; i < map[type][family][subType].length; i++) {
                     if (map[type][family][subType][i][key] != null && map[type][family][subType][i][key] == value) {
                         return map[type][family][subType][i];
                     }
                 }
             }

          }
      }
    }
};

/**
 * set the property of object with not null value
 * @param targetObject
 * @param property
 * @param value
 */
AltiplanoUtilities.prototype.setObjectProperty = function(targetObject, property, value) {
    if (targetObject && value) {
        targetObject[property] = value;
    }
}

AltiplanoUtilities.prototype.getIPFIXDetails = function (deviceName, nodeType, ipfixProfileData, cacheProfileData) {
    var managerInfo = apUtils.getManagerInfoFromEsAndMds(deviceName);

    var ipfixDetails = {};
    if (managerInfo) {
        if ((managerInfo.getIpfixAuthenticationMethod() !== intentConstants.MUTUAL_TLS && managerInfo.getIpfixPortValue() != 0) || (managerInfo.getIpfixAuthenticationMethod() === intentConstants.MUTUAL_TLS && managerInfo.getIpfixTLSPortValue() != 0)) {
            ipfixDetails["isIpfixPortConfigured"] = true;
        }
        else {
            ipfixDetails["isIpfixPortConfigured"] = false;
        }
        this.setObjectProperty(ipfixDetails, "ipfixExporterName", managerInfo.getName());
        this.setObjectProperty(ipfixDetails, "ipfixCollectorName", managerInfo.getName());
        this.setObjectProperty(ipfixDetails, "ipfixCollectorAddress", managerInfo.getIpfixIp());
        this.setObjectProperty(ipfixDetails, "ipfixCollecterPort", managerInfo.getIpfixPortValue().toString());
        this.setObjectProperty(ipfixDetails, "ipfixCollectorUserName", managerInfo.getIpfixUsername());
        this.setObjectProperty(ipfixDetails, "ipfixCollectorMdsPassword", managerInfo.getIpfixPassword());
        this.setObjectProperty(ipfixDetails, "ipfixCollectorHashedPassword", managerInfo.getIpfixHashedPassword());
        this.setObjectProperty(ipfixDetails, "ipfixCollectorAuthenticationMethod", managerInfo.getIpfixAuthenticationMethod());

        var deviceHwTypeRelease = this.splitToHardwareTypeAndVersion(nodeType);
        let isMultipleIpfixCollectorsSupported =  apCapUtils.getCapabilityValue(deviceHwTypeRelease.hwType, deviceHwTypeRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_IPFIX_MULTIPLE_COLLECTORS_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
        ipfixDetails["isMultipleIpfixCollectorsSupported"] = isMultipleIpfixCollectorsSupported;
        if (nodeType && nodeType.startsWith(intentConstants.LS_FX_PREFIX)) {
            var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
            var mTLSIpfixSupported;
            if (nodeType.contains(intentConstants.LS_FX_IHUB)) {
                mTLSIpfixSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_IPFIX_MTLS_SECURE_DATA_FLOW_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
            } else {
                var boardName = deviceTypeAndRelease.hwType.replace(intentConstants.LS_FX_PREFIX + "-", "");
                if (!boardName.contains(intentConstants.LT_STRING)) {
                    boardName = boardName.substring(0, boardName.lastIndexOf("-"));
                }
                mTLSIpfixSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_IPFIX_MTLS_SECURE_DATA_FLOW_SUPPORTED, boardName, false);
            }
            if (mTLSIpfixSupported == true) {
                ipfixDetails["mTLSIpfixSupported"] = mTLSIpfixSupported;
            }
        }
        //only support this mTLS ipfix feature from device 21.6 and not supported for IHUB 21.6
        if (nodeType && (this.compareVersion(deviceHwTypeRelease.release, "21.6") >= 0)) {
            if (isMultipleIpfixCollectorsSupported) {
                ipfixDetails["collectorNames"] = [];
                let numberOfCollectors = managerInfo.getNumberOfIpfixFeCollectorsValue();
                if (ipfixProfileData["exportingProcess"] && ipfixProfileData["exportingProcess"]["collector-names"] && ipfixProfileData["exportingProcess"]["collector-names"].length > 0) {
                    if (ipfixProfileData["exportingProcess"]["collector-names"].length < numberOfCollectors) {
                        throw new RuntimeException("Number of collectors configured in ipfix profile is less than number of collectors configured in MDS");
                    }
                    let availableExporters = [];
                    for (let i = 0; i < numberOfCollectors; i++) {
                        availableExporters.push(ipfixProfileData["exportingProcess"]["collector-names"][i]["exportingProcessName"]);
                    }
                    if (availableExporters.length > 0)
                        ipfixDetails["availableExporters"] = availableExporters;
                    let cachesToConfigure = false;
                    let addDefaultExporterToUsedExporters = false;
                    let usedExporters = [];
                    for (let i = 0; i < cacheProfileData.length; i++) {
                        if (cacheProfileData[i]["state"] == "enabled") {
                            cachesToConfigure = true;
                            if (cacheProfileData[i]["exportingProcess"] && cacheProfileData[i]["exportingProcess"][0]) {
                                let exportingProcessInIpfixProfile = false;
                                for (let j = 0; j < ipfixProfileData["exportingProcess"]["collector-names"].length; j++) {
                                    if (ipfixProfileData["exportingProcess"]["collector-names"][j]["exportingProcessName"] == cacheProfileData[i]["exportingProcess"][0]) {
                                        exportingProcessInIpfixProfile = true;
                                        break;
                                    }
                                }
                                if (exportingProcessInIpfixProfile) {
                                    if (availableExporters.indexOf(cacheProfileData[i]["exportingProcess"][0]) !== -1 && usedExporters.indexOf(cacheProfileData[i]["exportingProcess"][0]) === -1) {
                                        usedExporters.push(cacheProfileData[i]["exportingProcess"][0]);
                                    }
                                }
                                else {
                                    throw new RuntimeException("Exporting process referenced in cache template is not there in IPFIX profile");
                                }
                            }
                            else {
                                addDefaultExporterToUsedExporters = true;
                            }
                        }
                    }
                    if ((usedExporters.length === 0 && cachesToConfigure === true) || addDefaultExporterToUsedExporters) {
                        if (usedExporters.indexOf(ipfixProfileData["exportingProcess"]["collector-names"][0]["exportingProcessName"]) === -1) {
                            usedExporters.push(ipfixProfileData["exportingProcess"]["collector-names"][0]["exportingProcessName"]);
                        }
                    }
                    for (let i = 0; i < usedExporters.length; i++) {
                        let index = 0, ipfixProfileDataCollectorNames = ipfixProfileData["exportingProcess"]["collector-names"];
                        for (let j = 0; j < ipfixProfileDataCollectorNames.length; j++) {
                            if (ipfixProfileDataCollectorNames[j]["exportingProcessName"] == usedExporters[i]) {
                                index = j;
                                break;
                            }
                        }
                        ipfixDetails["collectorNames"][i] = {};
                        ipfixDetails["collectorNames"][i]["exportingProcessName"] = usedExporters[i];
                        ipfixDetails["collectorNames"][i]["destinationName"] = ipfixProfileData["exportingProcess"]["collector-names"][index]["destinationNames"];
                        if (ipfixDetails["ipfixCollectorAuthenticationMethod"] === intentConstants.MUTUAL_TLS) {
                            if ((nodeType.contains(intentConstants.LS_FX_PREFIX) && ipfixDetails["mTLSIpfixSupported"] == true) || ((deviceName.endsWith(intentConstants.DOT_LS_IHUB) && (this.compareVersion(deviceHwTypeRelease.release, "21.12") >= 0)) || !deviceName.endsWith(intentConstants.DOT_LS_IHUB))) {
                                ipfixDetails["collectorNames"][i]["destinationPort"] = managerInfo.getIpfixTLSPortValue() + 2*index;
                                ipfixDetails["isMtlsIpfixConfigured"] = true;
                            }
                            else {
                                ipfixDetails["collectorNames"][i]["destinationPort"] = managerInfo.getIpfixPortValue() + 2*index;
                            }
                        }
                        else {
                            ipfixDetails["collectorNames"][i]["destinationPort"] = managerInfo.getIpfixPortValue() + 2*index;
                        }
                    }
                }
                else {
                    if (numberOfCollectors > 1) {
                        throw new RuntimeException("Number of collectors configured in ipfix profile is less than number of collectors configured in MDS");
                    }
                    for (let i = 0; i < cacheProfileData.length; i++) {
                        if (cacheProfileData[i]["state"] == "enabled") {
                            if (cacheProfileData[i]["exportingProcess"] && cacheProfileData[i]["exportingProcess"][0]) {
                                if (intentConstants.STATIC_EXPORTING_PROCESS != cacheProfileData[i]["exportingProcess"][0]) {
                                    throw new RuntimeException("Exporting process referenced in cache template is not there in IPFIX profile");
                                }
                            }
                        }
                    }
                    ipfixDetails["availableExporters"] = [intentConstants.STATIC_EXPORTING_PROCESS];
                    ipfixDetails["collectorNames"][0] = {};
                    ipfixDetails["collectorNames"][0]["exportingProcessName"] = intentConstants.STATIC_EXPORTING_PROCESS;
                    ipfixDetails["collectorNames"][0]["destinationName"] = [intentConstants.STATIC_IPFIX_DESTINATION];
                    if (ipfixDetails["ipfixCollectorAuthenticationMethod"] === intentConstants.MUTUAL_TLS) {
                        if ((nodeType.contains(intentConstants.LS_FX_PREFIX) && ipfixDetails["mTLSIpfixSupported"] == true) || ((deviceName.endsWith(intentConstants.DOT_LS_IHUB) && (this.compareVersion(deviceHwTypeRelease.release, "21.12") >= 0)) || !deviceName.endsWith(intentConstants.DOT_LS_IHUB))) {
                            ipfixDetails["collectorNames"][0]["destinationPort"] = managerInfo.getIpfixTLSPortValue();
                            ipfixDetails["isMtlsIpfixConfigured"] = true;
                        }
                        else {
                            ipfixDetails["collectorNames"][0]["destinationPort"] = managerInfo.getIpfixPortValue();
                        }
                    }
                    else {
                        ipfixDetails["collectorNames"][0]["destinationPort"] = managerInfo.getIpfixPortValue();
                    }
                }
            }
            else {
                if (ipfixDetails["ipfixCollectorAuthenticationMethod"] === intentConstants.MUTUAL_TLS) {
                    if ((nodeType.contains(intentConstants.LS_FX_PREFIX) && ipfixDetails["mTLSIpfixSupported"] == true) || ((deviceName.endsWith(intentConstants.DOT_LS_IHUB) && (this.compareVersion(deviceHwTypeRelease.release, "21.12") >= 0)) || !deviceName.endsWith(intentConstants.DOT_LS_IHUB))) {
                        this.setObjectProperty(ipfixDetails, "ipfixCollecterPort", managerInfo.getIpfixTLSPortValue().toString());
                        ipfixDetails["isMtlsIpfixConfigured"] = true;
                    }
                }
                ipfixDetails["ipfixExporterName"] = intentConstants.STATIC_EXPORTING_PROCESS;
                ipfixDetails["ipfixCollectorName"] = intentConstants.STATIC_IPFIX_DESTINATION;
            }
            ipfixDetails["ipfixPinnedCertificates"] = intentConstants.MUTUAL_TLS_IPFIX_PINNED_CERTS;
            ipfixDetails["ipfixPinnedCertificate"] = intentConstants.MUTUAL_TLS_IPFIX_PINNED_CERT;
            ipfixDetails["ipfixCertificate"] = intentConstants.BASE64_ENCODED_AUTO_INSERT;
        }

        // support this mTLS ipfix feature for device LS-FX/MF IHUB 21.12 onwards
        if (deviceName.endsWith(intentConstants.DOT_LS_IHUB) && nodeType && (this.compareVersion(deviceHwTypeRelease.release, "21.12") >= 0)) {
            ipfixDetails["tlsClientProfile"] = intentConstants.MUTUAL_TLS_CLIENT_PROFILE;
            ipfixDetails["tlsServerProfile"] = intentConstants.MUTUAL_TLS_SERVER_PROFILE;
            ipfixDetails["caProfile"] = intentConstants.MUTUAL_TLS_CA_PROFILE;
            ipfixDetails["caProfileDescription"] = intentConstants.MUTUAL_TLS_CA_PROFILE_DESCRIPTION;
            ipfixDetails["caCertFile"] = intentConstants.MUTUAL_TLS_CA_CERT_FILE;
            ipfixDetails["certProfile"] = intentConstants.MUTUAL_TLS_CERT_PROFILE;
            ipfixDetails["certFile"] = intentConstants.MUTUAL_TLS_CERT_FILE;
            ipfixDetails["keyFile"] = intentConstants.MUTUAL_TLS_KEY_FILE;
            ipfixDetails["clientCipherList"] = intentConstants.MUTUAL_TLS_CLIENT_CIPHER_LIST;
            ipfixDetails["serverCipherList"] = intentConstants.MUTUAL_TLS_SERVER_CIPHER_LIST;
            ipfixDetails["cipher"] = intentConstants.MUTUAL_TLS_CIPHER;
            ipfixDetails["trustAnchorProfile"] = intentConstants.MUTUAL_TLS_TRUST_ANCHOR_PROFILE;
        }
	
        if (managerInfo.getIpfixIp()&& 
           ((!ipfixDetails["isMtlsIpfixConfigured"] && managerInfo.getIpfixPortValue()) ||
            (ipfixDetails["isMtlsIpfixConfigured"] && managerInfo.getIpfixTLSPortValue()))) {
        	    	ipfixDetails["checkIfIPFIXConfigExists"] = true;
        }

    }
    return ipfixDetails;
};

AltiplanoUtilities.prototype.getSyslogDetails = function (deviceName) {
    var managerInfo = apUtils.getManagerInfoFromEsAndMds(deviceName);

    var syslogDetails = {};
    if (managerInfo) {
        this.setObjectProperty(syslogDetails, "ipAddress", managerInfo.getIpfixIp());
        this.setObjectProperty(syslogDetails, "port", mds.getSysLogPortNumber(managerInfo.getName()).toString());
    }
    return syslogDetails;
};

AltiplanoUtilities.prototype.getLicenseServerDetailsFromMds = function (deviceName) {
    var managerInfo = apUtils.getManagerInfoFromEsAndMds(deviceName);
    var licenseServerDetails = {};
    if (managerInfo) {
        licenseServerDetails["licenseServerIP"] = managerInfo.getLicenseServerIP();
        licenseServerDetails["licenseServerPort"] = managerInfo.getLicenseServerPortValue().toString();
    } else {
        throw new RuntimeException("Device not found: " + deviceName);
    }
    return licenseServerDetails;
};

AltiplanoUtilities.prototype.configIpfixHashedPassword = function (baseArgs, hashingAlgo, topology, deviceName) {
    var topologyXtraInfo = this.getTopologyExtraInfo(topology);
    var passBeforeHashingAlgo = baseArgs["ipfixCollectorMdsPassword"];
    var salt = "";
    if (!topologyXtraInfo["passBeforeHashingAlgo"] || passBeforeHashingAlgo != topologyXtraInfo[deviceName + "_passBeforeHashingAlgo"] || !topologyXtraInfo[deviceName + "_ipfixCollectorHashedPassword"]) {
        if (hashingAlgo == "SHA-512") {
            if (!topologyXtraInfo[deviceName + "_salt_" + hashingAlgo]) {
                salt = this.getRandomString(8);
                this.setTopologyExtraInfo(topology, deviceName + "_salt_" + hashingAlgo, salt);
            } else {
                salt = topologyXtraInfo[deviceName + "_salt_" + hashingAlgo];
            }
        } else if (hashingAlgo == "bcrypt-10") {
            if (!topologyXtraInfo[deviceName + "_salt_" + hashingAlgo]) {
                salt = this.getRandomString(16);
                this.setTopologyExtraInfo(topology, deviceName + "_salt_" + hashingAlgo, salt);
            } else {
                salt = topologyXtraInfo[deviceName + "_salt_" + hashingAlgo];
            }
        }
        var ipfixCollectorHashedPassword = utilityService.getHashedPassword(passBeforeHashingAlgo, hashingAlgo, salt);
        baseArgs["ipfixCollectorHashedPassword"] = ipfixCollectorHashedPassword;
        this.setTopologyExtraInfo(topology, deviceName + "_passBeforeHashingAlgo", passBeforeHashingAlgo);
        this.setTopologyExtraInfo(topology, deviceName + "_ipfixCollectorHashedPassword", ipfixCollectorHashedPassword);
    } else {
        baseArgs["ipfixCollectorHashedPassword"] = topologyXtraInfo[deviceName + "_ipfixCollectorHashedPassword"];
    }
};

AltiplanoUtilities.prototype.getRandomString = function (length) {
  var s = '';
  do { s += Math.random().toString(36).substr(2); } while (s.length < length);
  s = s.substr(0, length);

  return s;
}

AltiplanoUtilities.prototype.findDiffObject = function (curObject, oldObject) {
    var diffObject = {};
    var oldProfileKeys = Object.keys(oldObject);
    for (var key in oldProfileKeys) {
        var oldProfileKey = oldProfileKeys[key];
        diffObject[oldProfileKey] = [];
        var oldProfiles = oldObject[oldProfileKey];
        var currentProfiles = curObject[oldProfileKey];

        if (currentProfiles && currentProfiles.length > 0) {
            var curProfileNames = [];
            for (var inx in currentProfiles) {
                curProfileNames.push(currentProfiles[inx]["name"]);
            }
            if (curProfileNames.length > 0) {
                for (var inx in oldProfiles) {
                    if (curProfileNames.indexOf(oldProfiles[inx]["name"]) == -1) {
                        diffObject[oldProfileKey].push(oldProfiles[inx]["name"]);
                    }
                }
            }
        }
    }
    return diffObject;
};

/*** Method used to add the parent and child keys of the provided mapping JSON to baseArgs with provided depth of the JSON
 *
 * This would work with JSON structure as follows:
 *
 * {
 *   "Key": {
 *     "Key1": {
 *       "key2":{
 *
 *       }
 *     }
 * }
 *
 * If we want key1 to be added to baseArgs then depth would be 1, for key2 depth would be 2
 * Name of the keys would be appended with the parent key name before adding to baseArgs
 *
 * eg. apUtils.addJSONProfileKeysToBaseArgs(profiles,2,baseArgs); ==> baseArgs[key_key1_key2]
 * apUtils.addJSONProfileKeysToBaseArgs(profiles,1,baseArgs); ==> baseArgs[key_key1]
 **/

AltiplanoUtilities.prototype.addJSONProfileKeysToBaseArgs = function (obj, depth, baseArgs) {
    Object.keys(obj).forEach(function (key) {
        if (depth >= 1) {
            Object.keys(obj[key]).forEach(function (key1) {
                var name = key + "_" + key1;
                baseArgs[name] = obj[key][key1];
                if (depth >= 2) {
                    Object.keys(obj[key][key1]).forEach(function (key2) {
                        var name1 = key + "_" + key1 + "_" + key2;
                        baseArgs[name1] = obj[key][key1][key2];
                    });
                }
            });
        }
        baseArgs[key] = obj[key];
    });
    return baseArgs;
}

/**
 * This method will compare two arrays and it will return the response.
 * currentArray = ['a', 'b']
 * oldArray= ['a', 'b', 'c']
 * this will return ['c']
 * @param currentArray
 * @param oldArray
 * @returns {*|Array|Array}
 */

AltiplanoUtilities.prototype.compareTwoArrayAndReturnDifference = function(currentArray, oldArray) {
    var diffArray = [];
    if(currentArray && currentArray.length > 0) {
        var mergedArray = oldArray.concat(currentArray);
    } else {
        diffArray = oldArray;
        return diffArray;
    }

    for (var i = 0; i < mergedArray.length; i++) {
        if (currentArray.indexOf(mergedArray[i]) === -1) {
            diffArray.push(mergedArray[i]);
        }
    }
    return diffArray;
}

/**
 * This method will return all the NC devices.
 * @param supportedIntentLabels
 * @param unsupportedIntentTypes
 * @param currentQuery
 * @param deviceNames : deviceNames["suggest"],deviceNames["list"]
 * @param suggestAll
 * @returns {Object|*}
 */
AltiplanoUtilities.prototype.getNCDevices = function (supportedIntentLabels, unsupportedIntentTypes, currentQuery, deviceNames, suggestAll) {
    var deviceCount = 0;
    var MAX_DEVICE = 10;
    if (!deviceNames) {
        deviceNames = new Object();
        var deviceNamesSuggest = new Object();
        var deviceNamesList = [];
    }  else {
        var deviceNamesList = deviceNames["list"];
        deviceCount = deviceNamesList.length;
        if (deviceCount >= MAX_DEVICE && !suggestAll) {
            return deviceNames;
        }
        var deviceNamesSuggest = deviceNames["suggest"];
    }
    var mustArray = [];
    var mustNotArray = [];
    var intentLabel = ["Physical Equipment"];

    intentLabel.forEach(function (label) {
        var labelObject = {"term": {"label": label}};
        mustArray.push(labelObject);
    });
    if (!currentQuery) {
        currentQuery = "";
    }
    if (currentQuery != null) {
    var currentQueryToLowerCase = currentQuery.toLowerCase();
    }
    var queryString = {
           "regexp": {
               "target.device-name": "("+currentQueryToLowerCase+").*"
           }
    };
    mustArray.push(queryString);
    unsupportedIntentTypes.forEach(function (unsupportedIntentType) {
        var unsupportedIntentTypeObject = {"term": {"intent-type": unsupportedIntentType}};
        mustNotArray.push(unsupportedIntentTypeObject);
    });

    var rootObject = {};
    rootObject =
        {
            "bool":
                {
                    "must": mustArray,
                    "must_not": mustNotArray,
                    "filter": [
                        {
                            "terms": {
                                "label": supportedIntentLabels
                            }
                        }
                    ]
                }
        };

    var object = {};
    object["query"] = rootObject;
    if (suggestAll) {
        object["size"] = 10000;
    } else {
        object["size"] = 10;
    }
    object["_source"] = ["target.raw"];
    var response = apUtils.executeEsIntentSearchRequest(JSON.stringify(object));
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
            if (intentResult["_source"]["target"] !== undefined) {
                if (suggestAll || deviceCount <= MAX_DEVICE) {
                    var deviceName = intentResult["_source"]["target"]["raw"];
                    deviceNamesList.push(deviceName);
                    deviceNamesSuggest[deviceName] = deviceName;
                }
            }
        });
    } else {
        logger.debug("No NC devices configured from A&A");
    }
    deviceNames["suggest"] = deviceNamesSuggest;
    deviceNames["list"] = deviceNamesList;
    return deviceNames;
}

/**
 * This method will return all the NC devices by Hardware Type.
 * @param supportedIntentLabels
 * @param unsupportedIntentTypes
 * @param currentQuery
 * @param supportedHardwareTypes
 * @param deviceNames : deviceNames["suggest"],deviceNames["list"]
 * @param suggestAll
 * @returns {Object|*}
 */
AltiplanoUtilities.prototype.getAllDevicesByHwType = function (supportedIntentLabels, unsupportedIntentTypes, currentQuery, supportedHardwareTypes, deviceNames, suggestAll) {
    var deviceCount = 0;
    var MAX_DEVICE = 10;
    if (!deviceNames) {
        deviceNames = new Object();
        var deviceNamesSuggest = new Object();
        var deviceNamesList = [];
    }  else {
        var deviceNamesList = deviceNames["list"];
        deviceCount = deviceNamesList.length;
        if (deviceCount >= MAX_DEVICE && !suggestAll) {
            return deviceNames;
        }
        var deviceNamesSuggest = deviceNames["suggest"];
    }
    var mustArray = [];
    var mustNotArray = [];
    var intentLabel = ["Physical Equipment"];

    intentLabel.forEach(function (label) {
        var labelObject = {"term": {"label": label}};
        mustArray.push(labelObject);
    });
    if (!currentQuery) {
        currentQuery = "";
    }
    if (currentQuery != null) {
    var currentQueryToLowerCase = currentQuery.toLowerCase();
    }
    var queryString = {
           "regexp": {
               "target.device-name": "("+currentQueryToLowerCase+").*"
           }
    };
    mustArray.push(queryString);
    unsupportedIntentTypes.forEach(function (unsupportedIntentType) {
        var unsupportedIntentTypeObject = {"term": {"intent-type": unsupportedIntentType}};
        mustNotArray.push(unsupportedIntentTypeObject);
    });
    var boolShouldArray = [];
    supportedHardwareTypes.forEach(function (supportedHardwareType) {
        var supportedHardwareTypeObject = {"term": {"configuration.hardware-type.keyword": supportedHardwareType}};
        boolShouldArray.push(supportedHardwareTypeObject);
    });
    if (boolShouldArray.length > 0) {
        mustArray.push({"bool": {"should": boolShouldArray}});
    }
    var rootObject = {};
    rootObject =
        {
            "bool":
                {
                    "must": mustArray,
                    "must_not": mustNotArray
                }
        };
        if (supportedIntentLabels && supportedIntentLabels.length > 0) {
            rootObject["bool"]["filter"] = [];
            rootObject["bool"]["filter"].push({
                    "terms": {
                        "label": supportedIntentLabels
                    }
                }
            );
        }

    var object = {};
    object["query"] = rootObject;
    if (suggestAll) {
        object["size"] = 10000;
    } else {
        object["size"] = 10;
    }
    object["_source"] = ["target.raw"];
    var response = apUtils.executeEsIntentSearchRequest(JSON.stringify(object));
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
            if (intentResult["_source"]["target"] !== undefined) {
                if (suggestAll || deviceCount <= MAX_DEVICE) {
                    var deviceName = intentResult["_source"]["target"]["raw"];
                    deviceNamesList.push(deviceName);
                    deviceNamesSuggest[deviceName] = deviceName;
                }
            }
        });
    } else {
        logger.debug("No NC devices configured from A&A");
    }
    deviceNames["suggest"] = deviceNamesSuggest;
    deviceNames["list"] = deviceNamesList;
    return deviceNames;
}

/**
 * This method will return all the ISAM devices.
 * @param currentQuery
 * @param deviceNames : deviceNames["suggest"],deviceNames["list"]
 * @param suggestAll
 * @returns {Object|*}
 */
AltiplanoUtilities.prototype.getISAMDevices = function (currentQuery, deviceNames, suggestAll) {
    var deviceCount = 0;
    var MAX_DEVICE = 10;
    var intentTypes = [intentConstants.INTENT_TYPE_DEVICE_FX, intentConstants.INTENT_TYPE_DEVICE_MX];

    if (!deviceNames) {
        deviceNames = new Object();
        var deviceNamesSuggest = new Object();
        var deviceNamesList = [];
    } else {
        var deviceNamesList = deviceNames["list"];
        deviceCount = deviceNamesList.length;
        if (deviceCount >= MAX_DEVICE && !suggestAll) {
            return deviceNames;
        }
        var deviceNamesSuggest = deviceNames["suggest"];
    }
    var mustArray = [];
    if (!currentQuery) {
        currentQuery = "";
    }
    var queryString = {
           "regexp": {
               "target.device-name.keyword": "("+currentQuery+").*"
        }
    };
    mustArray.push(queryString);
    var rootObject = {};
    rootObject =
        {
            "bool":
                {
                    "must": mustArray,
                    "filter": [
                        {
                            "terms": {
                                "intent-type": intentTypes
                            }
                        }
                    ]
                }
        };

    var object = {};
    object["query"] = rootObject;
    if (suggestAll) {
        object["size"] = 10000;
    } else {
        object["size"] = 10;
    }
    object["_source"] = ["target.raw"];
    var response = apUtils.executeEsIntentSearchRequest(JSON.stringify(object));
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
            if (intentResult["_source"]["target"] !== undefined) {
                if (suggestAll || deviceCount <= MAX_DEVICE) {
                    var deviceName = intentResult["_source"]["target"]["raw"];
                    deviceNamesList.push(deviceName);
                    deviceNamesSuggest[deviceName] = deviceName;
                }
            }
        });
    } else {
        logger.debug("No ISAM devices configured from A&A");
    }
    deviceNames["suggest"] = deviceNamesSuggest;
    deviceNames["list"] = deviceNamesList;
    return deviceNames;
}

/**
 * This method will return traffic class of Qos profile policy.
 * @param sideEgressQosPolicy
 * @param qosPolicyProfiles
 * @param classifiers
 * @returns {trafficClass}
 */
AltiplanoUtilities.prototype.getTrafficClass = function(sideEgressQosPolicy, qosPolicyProfiles, classifiers, policies, isFindAll) {
    var trafficClass = 0;
    var trafficClassList = [];
    for (var i = 0; i < qosPolicyProfiles.length ; i++){
        if (qosPolicyProfiles[i].name == sideEgressQosPolicy){
            for(var k = qosPolicyProfiles[i]["policy-list"].length -1; k>=0; k--) {
                var policyName = qosPolicyProfiles[i]["policy-list"][k].name;
                for (var policy = 0; policy < policies.length ; policy++){
                    if(policies[policy].name == policyName) {
                        for (var classifier = 0; classifier < policies[policy]["classifiers"].length ; classifier++){
                            for (var j = 0; j < classifiers.length ; j++){
                                if (classifiers[j].name == policies[policy]["classifiers"][classifier].name && classifiers[j].hasOwnProperty("classifier-action-entry-cfg")
                                    && classifiers[j]["classifier-action-entry-cfg"][0].hasOwnProperty("action-type")
                                    && (classifiers[j]["classifier-action-entry-cfg"][0]["action-type"] == "bbf-qos-cls:scheduling-traffic-class" ||
                                    classifiers[j]["classifier-action-entry-cfg"][0]["action-type"] == "bbf-qos-cls-mounted:scheduling-traffic-class")){

                                    trafficClass = classifiers[j]["classifier-action-entry-cfg"][0]["scheduling-traffic-class"];
                                    if (!isFindAll) {
                                        return trafficClass;
                                    } else {
                                        if(trafficClassList.indexOf(trafficClass) < 0) {
                                            trafficClassList.push(trafficClass);
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
    if (trafficClassList.length > 0) {
        return trafficClassList;
    }
    throw  new RuntimeException("Invalid Policy Profile for Qos Egress: missing p-bit to TC classifier: " + sideEgressQosPolicy);
};

/**
 * Add the necessary param to TCONT map
 *
 * @param tcontMap
 * @param tcontName
 * @param eonuTcontName
 * @param tc2QmapId
 * @param queue
 * @param isShared
 */
AltiplanoUtilities.prototype.addTcontObject = function(tcontMap, tcontName, eonuTcontName, tc2QmapId, queue, isShared) {
    tcontMap[tcontName] = {
        "name" : tcontName,
        "eonuName" : eonuTcontName,
        "tc-to-queue-mapping-profile-id" : tc2QmapId,
        "queue" : queue,
        "isShared": isShared
    };
};

/**
 * Add the necessary param to GEM-port map
 *
 * @param gemPortMap
 * @param gemPortName
 * @param eonuGemPortName
 * @param trafficClass
 * @param tcontName
 * @param eonuTcontName
 */
AltiplanoUtilities.prototype.addGemportObject = function(gemPortMap, gemPortName, eonuGemPortName, trafficClass, tcontName, eonuTcontName) {
    gemPortMap[gemPortName] = {
        "name": gemPortName,
        "eonuName" : eonuGemPortName,
        "trafficClass": trafficClass,
        "tcontName": tcontName,
        "eonuTcontName": eonuTcontName
    };
};

/**
 * Method to Generate the shared or non-shared TCONT name
 *
 * @param tcontMap empty map will be added with tcontName as key and required parameters as value
 * @param tcontProfileId tcont-profile-id
 * @param isTcontFixed if the TCON is non shared then this can true otherwise false
 * @param tcontParams tcont parameters for the tcont-profile-id
 * @param serviceProfileOlt
 * @param onuTrafficClass
 * @returns {String} TCONT name
 */
 AltiplanoUtilities.prototype.generateTcontName = function(tcontMap, tcontProfileId, isTcontFixed, tcontParams, serviceProfileOlt, onuTrafficClass, totalTconts, flexibleTcontSharing) {
    var onuTcontParams = this.convertToTcontQueueSharingFromTcontSharingEnumForProfile(tcontParams["tcontProfileMap"][tcontProfileId]);
    var eonuTcontName;
    var tcontName;
    var trafficDescriptorProfileId = function (serviceProfileOlt, onuTrafficClass) {
        if (serviceProfileOlt && serviceProfileOlt["traffic-descriptor-profile-id"]) {
            return serviceProfileOlt["traffic-descriptor-profile-id"];
        } else if (serviceProfileOlt && serviceProfileOlt["traffic-descriptor-per-tc"]) {
            var profileId;
            for (var trafficDescriptorIndex in serviceProfileOlt["traffic-descriptor-per-tc"]) {
                if (serviceProfileOlt["traffic-descriptor-per-tc"][trafficDescriptorIndex]["traffic-class"] === onuTrafficClass) {
                    profileId = serviceProfileOlt["traffic-descriptor-per-tc"][trafficDescriptorIndex]["traffic-descriptor-profile-id"];
                }
            }
            return profileId;
        }
    }
    var checkAndAddTcontName = function (tcontName, eonuTcontName, isShared, tdpId) {
        if(!tcontMap[tcontName]) {
            apUtils.addTcontObject(tcontMap, tcontName, eonuTcontName, onuTcontParams["tc-to-queue-mapping-profile-id"], onuTcontParams["queue"], isShared);
            if (isShared) {
                tcontMap[tcontName]["tdpId"] = tdpId;
            } else {
                if (totalTconts <= 1 && !tcontParams.tdpId && serviceProfileOlt["traffic-descriptor-per-tc"]) {
                    throw new RuntimeException("TCONT sharing should be true when Traffic Descriptor Profile Scope is per TC.");
                }
                tcontMap[tcontName]["tdpId"] = tcontParams.tdpId || tdpId;
            }
        }
    }
    var isShared = !isTcontFixed && (onuTcontParams["tcont-sharing"] === "true" || onuTcontParams["queue-sharing"] === "true");
    if(isTcontFixed || (onuTcontParams["tcont-sharing"] === "false" && onuTcontParams["queue-sharing"] === "false")) { // no sharing
        let suffix = tcontParams.serviceName;
        var descriptorId = null;
        if(totalTconts > 1 && flexibleTcontSharing && flexibleTcontSharing == "false") {
            suffix = tcontProfileId;
            descriptorId = trafficDescriptorProfileId(serviceProfileOlt,onuTrafficClass);
        }
        tcontName = ["TCONT", tcontParams.ontName, tcontParams.uniLabel, suffix].join("_");
        eonuTcontName = ["TCONT", tcontParams.uniLabel, suffix].join("_");
        checkAndAddTcontName(tcontName,eonuTcontName, isShared, descriptorId);
    } else if (onuTcontParams["tcont-sharing"] === "true" && onuTcontParams["queue-sharing"] === "false") {
        eonuTcontName = ["TCONT", tcontParams.uniLabel, tcontProfileId].join("_");
        var descriptorId = trafficDescriptorProfileId(serviceProfileOlt,onuTrafficClass);
        tcontName = ["TCONT", tcontParams.ontName, tcontParams.uniLabel, tcontProfileId].join("_");
        checkAndAddTcontName(tcontName,eonuTcontName, isShared, descriptorId);
    } else if (onuTcontParams["tcont-sharing"] === "true" && onuTcontParams["queue-sharing"] === "true") {
        eonuTcontName = ["TCONT", tcontProfileId].join("_");
        var descriptorId = trafficDescriptorProfileId(serviceProfileOlt,onuTrafficClass);
        tcontName = ["TCONT", tcontParams.ontName, tcontProfileId].join("_");
        checkAndAddTcontName(tcontName,eonuTcontName,isShared,descriptorId);
    }
    return tcontName;
};

/**
 * Generate non shrared TCONT name
 * @param tcontMap
 * @param tcontParams
 * @param trafficClasses
 * @param tc2QmapId
 * @returns Tcont name
 */
AltiplanoUtilities.prototype.generateNonSharedTcontName = function(tcontMap, tcontParams, trafficClasses, tc2QmapId) {
    var tcontName = ["TCONT", tcontParams.ontName, tcontParams.uniLabel, tcontParams.serviceName].join("_");
    var eonuTcontName = ["TCONT", tcontParams.uniLabel, tcontParams.serviceName].join("_");
    var queue = trafficClasses.map(function (trafficClass) {
        return {
            "local-queue-id": trafficClass,
            "priority": "1",
            "weight": "1"
        };
    });
    this.addTcontObject(tcontMap, tcontName, eonuTcontName, tc2QmapId, queue, false);
    tcontMap[tcontName]["tdpId"] = tcontParams.tdpId;
    return tcontName;
};

/**
 * Method to generate names and params for Multiple GEM ports and shared/non-shared TCONTs
 *
 * @param commonObject
 * @param tcontProfiles
 * @param onuServiceProfile
 * @param ontQosProfiles
 * @param tdpId
 * @param deviceType
 * @param serviceProfileOlt
 */
AltiplanoUtilities.prototype.computeOnuGemportsAndTcont = function(commonObject, tcontProfiles, onuServiceProfile, ontQosProfiles, tdpId, deviceType, serviceProfileOlt) {
    var serviceName;
    var isGemportShared = commonObject.isGemportShared;
    var flexibleTcontSharing = commonObject.flexibleTcontSharing;
    let onuTemplateTcontConfig = commonObject.onuTemplateTcontConfig;
    if (commonObject.eonuServiceName) {
        serviceName = commonObject.eonuServiceName;
    } else {
        serviceName = commonObject.serviceName;
    }
    // converting "tcont-profile" array to map
    var tcontProfileMap = {};
    tcontProfiles["tcont-profile"] = this.convertToTcontQueueSharingFromTcontSharingEnum(tcontProfiles["tcont-profile"])
    if (tcontProfiles && tcontProfiles["tcont-profile"]) {
        for (var tcontProfile = 0; tcontProfile < tcontProfiles["tcont-profile"].length; tcontProfile++) {
            tcontProfileMap[tcontProfiles["tcont-profile"][tcontProfile].name] = tcontProfiles["tcont-profile"][tcontProfile];
        }
    }

    var tcontParams = {
        uniLabel: commonObject.uniLabel,
        ontName: commonObject.ontName,
        serviceName: serviceName,
        tcontProfileMap: tcontProfileMap,
        tdpId: tdpId,
        deviceType: deviceType
    };
    // Generate the GEM port & TCONT and when the traffic class is specified in tcont-config, TCONT can be shared in this scenario
    var onuTrafficClasses = [];
    var gemPortMap = {};
    var tcontMap = {};
    var tcontProfileIdFixed;
    if(onuServiceProfile["tcont-config"]) {
        let totalTconts = onuTemplateTcontConfig ? onuTemplateTcontConfig.length : 0;
        for (var i = 0; i < onuServiceProfile["tcont-config"].length; i++) {
            if (onuServiceProfile["tcont-config"][i]["traffic-class"]) {
                var onuTrafficClass = onuServiceProfile["tcont-config"][i]["traffic-class"];
                onuTrafficClasses.push(onuTrafficClass);
                var tcontProfileId = onuServiceProfile["tcont-config"][i]["tcont-profile-id"];
                var oltTcontName = this.generateTcontName(tcontMap, tcontProfileId, false, tcontParams, serviceProfileOlt, onuTrafficClass, totalTconts, flexibleTcontSharing);
                if (commonObject.customerUpstreamTrafficType == intentConstants.USER_TRAFFIC_TYPE_TRANSPARENT_FORWARD || isGemportShared) {
                    var gemPortName = ["GEM" + onuTrafficClass, commonObject.ontName, commonObject.uniLabel].join("_");
                    var eonuGemPortName = ["GEM" + onuTrafficClass, commonObject.uniLabel].join("_");
                } else {
                    var gemPortName = ["GEM" + onuTrafficClass, commonObject.ontName, commonObject.uniLabel, serviceName].join("_");
                    var eonuGemPortName = ["GEM" + onuTrafficClass, commonObject.uniLabel, serviceName].join("_");
                    var onuTcontParams = tcontProfileMap[tcontProfileId];
                    if (flexibleTcontSharing && flexibleTcontSharing == "true") {
                        if (onuTcontParams["tcont-sharing"] == "false" && onuTcontParams["queue-sharing"] == "false") {
                            eonuGemPortName = ["GEM" + onuTrafficClass, commonObject.uniLabel, serviceName].join("_");
                        } else if (onuTcontParams["tcont-sharing"] == "true" && onuTcontParams["queue-sharing"] == "false") {
                            gemPortName = ["GEM" + onuTrafficClass, commonObject.ontName, commonObject.uniLabel, serviceName, "TCONT-UNI"].join("_");
                            eonuGemPortName = ["GEM" + onuTrafficClass, commonObject.uniLabel, serviceName, "TCONT-UNI"].join("_");
                        } else if (onuTcontParams["tcont-sharing"] == "true" && onuTcontParams["queue-sharing"] == "true") {
                            gemPortName = ["GEM" + onuTrafficClass, commonObject.ontName, commonObject.uniLabel, serviceName, "TCONT-ONT"].join("_");
                            eonuGemPortName = ["GEM" + onuTrafficClass, commonObject.uniLabel, serviceName, "TCONT-ONT"].join("_");
                        }
                    }
                }
                this.addGemportObject(gemPortMap, gemPortName, eonuGemPortName, onuTrafficClass, oltTcontName, tcontMap[oltTcontName]["eonuName"]);
                if(onuServiceProfile["tcont-config"][i]["gem-port-err-profile"]) {
                  gemPortMap[gemPortName]["gemPortErrProfileName"] = {};  
                  gemPortMap[gemPortName]["gemPortErrProfileName"].value = onuServiceProfile["tcont-config"][i]["gem-port-err-profile"];
                }  
            } else {
                onuTrafficClasses = [];
                tcontProfileIdFixed = onuServiceProfile["tcont-config"][i]["tcont-profile-id"];
                break;
            }
        }
    }

    // Generate the GEM port & TCONT and when the traffic class is not specified in tcont-config, TCONT is not shared in this scenario
    if (onuTrafficClasses.length === 0) {
        gemPortMap = {};
        tcontMap = {};
        var onuSubscriberIngressProfile = onuServiceProfile["subscriber-ingress-qos-profile-id"];
        onuTrafficClasses = this.getTrafficClass(onuSubscriberIngressProfile, ontQosProfiles["qos-policy-profiles"], ontQosProfiles["classifiers"], ontQosProfiles["policies"], true);
        if(tcontProfileIdFixed) {
            oltTcontName = this.generateTcontName(tcontMap, tcontProfileIdFixed, true, tcontParams);
        } else {
            oltTcontName = this.generateNonSharedTcontName(tcontMap, tcontParams, onuTrafficClasses, onuServiceProfile["tc-to-queue-mapping-profile-id"]);
        }
        for (var tcIndex = 0; tcIndex < onuTrafficClasses.length; tcIndex++) {
            if (commonObject.customerUpstreamTrafficType == intentConstants.USER_TRAFFIC_TYPE_TRANSPARENT_FORWARD || isGemportShared) {
                var oldGemPortName = ["GEM" + onuTrafficClasses[tcIndex], commonObject.ontName, commonObject.uniLabel].join("_");
                var oldEonuGemPortName = ["GEM" + onuTrafficClasses[tcIndex], commonObject.uniLabel].join("_");
            } else {
                var oldGemPortName = ["GEM" + onuTrafficClasses[tcIndex], commonObject.ontName, commonObject.uniLabel, serviceName].join("_");
                var oldEonuGemPortName = ["GEM" + onuTrafficClasses[tcIndex], commonObject.uniLabel, serviceName].join("_");
            }
            this.addGemportObject(gemPortMap, oldGemPortName, oldEonuGemPortName, onuTrafficClasses[tcIndex], oltTcontName, tcontMap[oltTcontName]["eonuName"]);
        }
    }

    commonObject.gemPortMap = gemPortMap;
    commonObject.tcontMap = tcontMap;
};

AltiplanoUtilities.prototype.getNetworkSlicingUserType = function (managerName) {
    let scopeKey = "mds_networkSlicingUserType_" + managerName;
    let networkSlicingUserType = apUtils.getContentFromIntentScope(scopeKey);
    if (networkSlicingUserType) {
        return networkSlicingUserType;
    } else if (requestScope.get() && requestScope.get().get("networkSlicingUserType")) {
        return requestScope.get().get("networkSlicingUserType");
    } else {
        networkSlicingUserType = intentConstants.NETWORK_SLICING_USER_TYPE_NON_SLICING;
        if (managerName) {
            networkSlicingUserType = mds.getNetworkSlicingUserType(managerName);
        } else {
            var nvManagerList = [intentConstants.MANAGER_TYPE_NAV];
            var managers = apUtils.getDeviceManagerNames(nvManagerList);
            if (managers && managers.length > 0) {
                for (var manager in managers) {
                    scopeKey = "mds_networkSlicingUserType_" + managers[manager];
                    networkSlicingUserType = apUtils.getContentFromIntentScope(scopeKey);
                    if (networkSlicingUserType) {
                        return networkSlicingUserType;
                    } else {
                        let networkSlicingUserTypeFromMds = mds.getNetworkSlicingUserType(managers[manager]);
                        if (networkSlicingUserTypeFromMds != null && networkSlicingUserTypeFromMds !== intentConstants.NETWORK_SLICING_USER_TYPE_UNKNOWN) {
                            networkSlicingUserType = networkSlicingUserTypeFromMds;
                            break;
                        }
                    }
                }
            }
        }
        apUtils.storeContentInIntentScope(scopeKey, networkSlicingUserType);
        return networkSlicingUserType;
    }
};

/**
 * Method returns the networkSlicingUserType of the given device.
 *
 * @param deviceName
 * @returns networkSlicingUserType
 */
AltiplanoUtilities.prototype.getNetworkSlicingUserTypeByDeviceName = function (deviceName) {
    var deviceFoundInMds = true;
    var networkSlicingUserType = intentConstants.NETWORK_SLICING_USER_TYPE_NON_SLICING;
    var managerInfos = apUtils.getAllManagersWithDevice(deviceName);
    if (managerInfos != null && managerInfos.size() > 1) {
        throw new RuntimeException("More than 1 manager found for device name " + deviceName);
    }
    if (managerInfos == null || managerInfos.isEmpty()) {
        var managerInfos = apUtils.getAllManagersWithDevice(deviceName + intentConstants.DOT_LS_FX_IHUB);
        if (managerInfos == null || managerInfos.isEmpty()) {
            deviceFoundInMds = false;
        }
    }
    if (deviceFoundInMds) {
        var managerInfo = managerInfos.get(0);
        if (managerInfo && managerInfo.getType().toString() !== intentConstants.MANAGER_TYPE_AMS) {
            var networkSlicingUserTypeFromMds = managerInfo.getNetworkSlicingUserType();
            if (networkSlicingUserTypeFromMds != null && networkSlicingUserTypeFromMds !== intentConstants.NETWORK_SLICING_USER_TYPE_UNKNOWN) {
                networkSlicingUserType = networkSlicingUserTypeFromMds;
            }
        }
    } else {
        var manager = apUtils.getDeviceManagerFromEsByDeviceName(deviceName);
        if (manager) {
            var managerInfo = apUtils.getManagerByName(manager);
            if (!managerInfo) {
                throw new RuntimeException("Manager not found in MDS: " + manager);
            }
            var managerType = managerInfo.getType().name();
            if (managerType && managerType !== intentConstants.MANAGER_TYPE_AMS) {
                var networkSlicingUserTypeFromMds = mds.getNetworkSlicingUserType(manager);
                if (networkSlicingUserTypeFromMds != null && networkSlicingUserTypeFromMds !== intentConstants.NETWORK_SLICING_USER_TYPE_UNKNOWN) {
                    networkSlicingUserType = networkSlicingUserTypeFromMds;
                }
            }
        } else {
            throw new RuntimeException("Manager not found for device " + deviceName);
        }
    }
    return networkSlicingUserType;
};

/**
 * Method returns the managerName of the given device.
 * 
 * @param deviceName 
 * @returns managerName
 */

AltiplanoUtilities.prototype.getDeviceManagerFromEsByDeviceName = function (deviceName) {
    var managerName;
    var resourceFile = resourceProvider.getResource(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "resources/esQueryGetDeviceManager.json.ftl");
    var templateArgs = {deviceName: deviceName};
    var request = utilityService.processTemplate(resourceFile, templateArgs);
    var response = apUtils.executeEsIntentSearchRequest(request);
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
            if (intentResult["_source"]["configuration"] !== undefined) {
                managerName = intentResult["_source"]["configuration"]["device-manager"];
            }
        });
    }
    return managerName;
};

AltiplanoUtilities.prototype.getTargetsByIntentTypeUsingESQuery = function (intentType, input, size) {
    var targetNames = [];
    var rootObject = {};
    rootObject =
        {
            "bool":
                {
                    "filter": [
                        {
                            "term": {
                                "intent-type": intentType
                            }
                        }
                    ]
                }
        };

    var object = {};
    if (input) {
        var objRegex = {
            "regexp": {
                  "target.raw": {
                    "value": "(" + input + ").*",
                    "case_insensitive": true
                  }
              }
          };
        rootObject["bool"]["filter"].push(objRegex);
    }
    if (size && size > 0) {
        object["size"] = size;
    } else {
        object["size"] = 10000;
    }
    object["query"] = rootObject;
    object["_source"] = ["target.raw"];
    var response = apUtils.executeEsIntentSearchRequest(JSON.stringify(object));
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
            if (intentResult["_source"]["target"] !== undefined) {
                    var targetName = intentResult["_source"]["target"]["raw"];
                    targetNames.push(targetName);
            }
        });
    } else {
        logger.debug("No response for " + intentType + " with function getTargetsByIntentTypeUsingESQuery, size: " + object["size"]);
    }
    return targetNames;
}
/**
 * Method used to get from JSON resource all data related to a profile of a certain type & family when a certain key is matching a specific value of a different intent Type.
 * Typical usage: get all parameters of a profile of a certain type for a specific family and with a given name.
 *
 * This would work with JSON structure as follows:
 *Case1 :
 * {
 *   "type1": {
 *     "family1": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ],
 *     "family2": [
 *       {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *       }
 *     ]
 *   },
 *   etc.
 * }
 *
 * Case2 :
 *{
 *   "type1": {
 *   "key1": value,
 *   variant1{
 *     "family1": {
 *       {
 *
 *       }
 *     },
 *     "family2": {
 *       {
 *
 *       }
 *     }
 *     }
 *   }
 *   etc.
 * }
 * @param intentType
 * @param resourceName
 * @param intentVersion
 * @param type
 * @param family
 * @param key
 * @param value
 * @param variant
 * @param profileManagerDetails - input params to fetch data from profile manager.
 * If useProfilemanager flag is true, the details would be fetched from profile manager instead of JSON
 * @returns {*}
 */
AltiplanoUtilities.prototype.getDependentIntentServiceProfileObject = function(intentType, resourceName, intentVersion, type, family, key, value, variant, profileManagerDetails) {
    var dependentIntentJSON;
    if(profileManagerDetails && !profileManagerDetails.hasOwnProperty("useProfileManager")){
        profileManagerDetails["useProfileManager"] = true;
    }
    if(profileManagerDetails && profileManagerDetails["useProfileManager"]==true){
        var dependentIntentInfo = this.getParsedProfileDetailsFromProfMgr(profileManagerDetails["deviceName"],profileManagerDetails["nodeType"],profileManagerDetails["intentType"],profileManagerDetails["excludeList"], profileManagerDetails["intentTypeVersion"]);
        dependentIntentJSON = {};
        dependentIntentJSON[type] = dependentIntentInfo;
    }
    else{
        dependentIntentJSON  = JSON.parse(apUtils.getResourceValue(intentType, intentVersion, resourceName));
    }
    if (!variant) {
        if (dependentIntentJSON[type]) {
            if (dependentIntentJSON[type][family]) {
                for (var i = 0; i < dependentIntentJSON[type][family].length; i++) {
                    if (dependentIntentJSON[type][family][i][key] != null && dependentIntentJSON[type][family][i][key] == value) {
                        return dependentIntentJSON[type][family][i];
                    }
                }
            }
        }
    } else {
        if (dependentIntentJSON[type]) {
            for (var i = 0; i < dependentIntentJSON[type].length; i++) {
                if (dependentIntentJSON[type][i][key] != null && dependentIntentJSON[type][i][key] == value) {
                    if (dependentIntentJSON[type][i][variant]){
                        if (dependentIntentJSON[type][i][variant][family]) {
                            return dependentIntentJSON[type][i][variant][family];
                        }
                    }
                }
            }
        }
    }
    return {};
};

/**
 * Method used to get from JSON resource all data related to a profile of a certain type & family when a certain key is matching a specific value of a different intent Type.
 * Typical usage: get all parameters of a profile of a certain type for a specific family and with a given name.
 *
 * This would work with JSON structure as follows:
 * {
 *   "type1": [
 *      {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *      },
 *      etc.
 *   ],
 *   "type2": [
 *      {
 *         "key1": value,
 *         "key2": value,
 *         etc.
 *      },
 *      etc.
 *   ]
 * }
 * @param intentType
 * @param resourceName
 * @param intentVersion
 * @param type,
 * @param key
 * @param value
 * @returns {*}
 */
AltiplanoUtilities.prototype.getDependentIntentAttributes = function(intentType, resourceName, intentVersion, type, key, value, profileManagerDetails) {
    var dependentIntentJSON;
    if(profileManagerDetails && !profileManagerDetails.hasOwnProperty("useProfileManager")){
        profileManagerDetails["useProfileManager"] = true;
    }
    if (profileManagerDetails && profileManagerDetails["useProfileManager"]){
        dependentIntentJSON = this.getParsedProfileDetailsFromProfMgr(profileManagerDetails["deviceName"],profileManagerDetails["nodeType"],profileManagerDetails["intentType"],profileManagerDetails["excludeList"], profileManagerDetails["intentTypeVersion"]);
    } else {
        dependentIntentJSON  = JSON.parse(apUtils.getResourceValue(intentType, intentVersion, resourceName));
    }
    if (dependentIntentJSON[type]) {
        for (var i = 0; i < dependentIntentJSON[type].length; i++) {
            if (dependentIntentJSON[type][i][key] != null && dependentIntentJSON[type][i][key] == value) {
                return dependentIntentJSON[type][i];
            }
        }
    }
    return {};
};

AltiplanoUtilities.prototype.getDependentIntentAttributesByKey = function(intentType, resourceName, intentVersion, type, key, variant) {
    var dependentIntentJSON  = JSON.parse(apUtils.getResourceValue(intentType, intentVersion, resourceName));
    var arr = [];
    if (dependentIntentJSON[type]) {
        for (var i = 0; i < dependentIntentJSON[type].length; i++) {
            if(variant) {
                if(dependentIntentJSON[type][i][variant]) {
                    arr.push(dependentIntentJSON[type][i][key]);
                }
            } else if (dependentIntentJSON[type][i][key] != null) {
                arr.push(dependentIntentJSON[type][i][key]);

            }
        }
    }
    return arr;
};

/**
 * Method used to process the xslt template and provide the response for given string.
 * @param xsltString
 * @param xmlString
 * @returns {null|*}
 */
AltiplanoUtilities.prototype.processXsltTemplate = function (xsltTemplate, xmlString) {
    var source = new DOMSource(DocumentUtils.stringToDocument(xsltTemplate));
    var template = TransformerFactory.newInstance().newTemplates(source);
    var result = new DOMResult();
    var inputStringReader = new StringReader(xmlString.trim())
    var streamSource = new StreamSource(inputStringReader);
    try{
        template.newTransformer().transform(streamSource, result);
    } catch (e) {
        logger.error("Error while perform the xslt transformation : {}", e);
    }
    if(result.getNode()) {
        return DocumentUtils.documentToString(result.getNode());
    }
    return null;
};

AltiplanoUtilities.prototype.getFxShelfDeviceName = function (fxLtDeviceName) {
    if (fxLtDeviceName) {
        var lastIndex = fxLtDeviceName.lastIndexOf(intentConstants.FX_DEVICE_SEPARATOR);
        if (lastIndex > -1) {
            var fxLtDeviceNameLtDetails = fxLtDeviceName.substring(lastIndex + 1);
            var ltPattern = new RegExp(intentConstants.FX_LT_REG_EXP);
            var isLtBoard = ltPattern.test(fxLtDeviceNameLtDetails);
            if (isLtBoard) {
                return fxLtDeviceName.substring(0, lastIndex);
            } else {
                throw new RuntimeException("LS-FX shelf device name cannot be deduced");
            }
        } else {
            throw new RuntimeException("LS-FX shelf device name cannot be deduced");
        }
    } else {
        throw new RuntimeException("LS-FX shelf LT device name is not valid");
    }
};

AltiplanoUtilities.prototype.getShelfDeviceName = function (ltDeviceName, prefix) {
    if (ltDeviceName) {
        var lastIndex = ltDeviceName.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
        if (lastIndex > -1) {
            var ltDeviceNameDetails = ltDeviceName.substring(lastIndex + 1);
            var ltPattern = new RegExp(intentConstants.FX_LT_REG_EXP);
            var isLtBoard = ltPattern.test(ltDeviceNameDetails);
            if (isLtBoard) {
                return ltDeviceName.substring(0, lastIndex);
            } else {
                throw new RuntimeException(prefix + " shelf device name cannot be deduced");
            }
        } else {
            throw new RuntimeException(prefix + " shelf device name cannot be deduced");
        }
    } else {
        throw new RuntimeException(prefix + " shelf LT device name is not valid");
    }
};

AltiplanoUtilities.prototype.getL3InfraConfigFromL2Infra = function (l2InfraTargetList, sourceResult, size) {
    var rootObject = {};
    var queryString = {
        "term": {
          "intent-type": intentConstants.INTENT_TYPE_L3_INFRA
        }
    };
    var mustArray = [];
    mustArray.push(queryString);
    rootObject = {
            "bool":
            {
                "must": mustArray,
                "filter" : [
                      {
                     "terms": {
                       "configuration.l2-infra-name.keyword": l2InfraTargetList
                     }

                   }
                 ]
            }
        };

    var object = {};
    object["query"] = rootObject;
    object["size"] = 1;
    object["_source"] = ["target.raw"];
    if (size) {
        object["size"] = size;
    }
    if (sourceResult) {
        object["_source"] = sourceResult;
    }
    return apUtils.executeEsIntentSearchRequest(JSON.stringify(object));
};

AltiplanoUtilities.prototype.getMPLSTransportConfigFromL2Infra = function (l2InfraTargetList, sourceResult, size) {
    for(var i = 0; i < l2InfraTargetList.length; i++){
        l2InfraTargetList[i] = l2InfraTargetList[i].split("#")[1];
    }
    var rootObject = {};
    var queryString = {
        "term": {
          "intent-type": intentConstants.INTENT_TYPE_MPLS_TRANSPORT
        }
    };
    var mustArray = [];
    mustArray.push(queryString);
    rootObject = {
            "bool":
            {
                "must": mustArray,
                "filter" : [
                      {
                     "terms": {
                       "configuration.service-id.keyword": l2InfraTargetList
                     }

                   }
                 ]
            }
        };

    var object = {};
    object["query"] = rootObject;
    object["size"] = 1;
    object["_source"] = ["target.raw"];
    if (size) {
        object["size"] = size;
    }
    if (sourceResult) {
        object["_source"] = sourceResult;
    }
    return apUtils.executeEsIntentSearchRequest(JSON.stringify(object));
};

AltiplanoUtilities.prototype.getBoardSupportCageModeFromDevice = function (deviceId, deviceType) {
    var deviceIntentVersion = apUtils.getIntentVersion(deviceType, deviceId);
    var internalResourcePrefix = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR;
    var cageModeSupportResource = apUtils.getResourceValue(deviceType, deviceIntentVersion, internalResourcePrefix + "port-cage-mode-boards.json");
    var boardsResource = JSON.parse(cageModeSupportResource);
    var boards =  boardsResource[intentConstants.ISAM_PREFIX];
    return boards;
};

AltiplanoUtilities.prototype.getBoardTypeFromDevice = function (deviceId, deviceType) {
    var getKeyForList = function (listName) {
        switch (listName) {
            case "label":
                return ["category", "value"];
            case "boards":
                return ["slot-name"];
            default:
                return null;
        }
    }
    var deviceIntentVersion = apUtils.getIntentVersion(deviceType, deviceId);
    var deviceIntentConfig = apUtils.convertIntentConfigXmlToJson(apUtils.getIntentConfig(deviceType, deviceIntentVersion, deviceId), getKeyForList);
    var boardTypes = deviceIntentConfig["boards"];
    return boardTypes;
};


/**
 * The method will convert the {"a":{"b":{"c":{"d":{}}}}} to below format
 * <xml:element 'a'><xml:element 'b'><xml:element 'c'><xml:element 'd'></xml:element 'd'></xml:element 'c'></xml:element 'b'></xml:element 'a'>
 * @param inputObject
 * @returns {string}
 */
AltiplanoUtilities.prototype.convertObjectToXmlElement = function (obj) {
    var xml = '';
    for (var prop in obj) {
        xml += obj[prop] instanceof Array ? '' : "<" + prop + ">";
        if (obj[prop] instanceof Array) {
            for (var i = 0; i < obj[prop].length; i++) {
                xml += "<" + prop + ">";
                xml += this.convertObjectToXmlElement(new Object(obj[prop][i]));
                xml += "</" + prop + ">";
            }
        } else if (typeof obj[prop] == "object") {
            xml += this.convertObjectToXmlElement(new Object(obj[prop]));
        } else {
            if(intentConstants.ESCAPE_XML_CHARACTERS_REGEX.test(obj[prop])) {
                // Special character encoding for intentConfigJSON
                obj[prop] = StringEscapeUtils.escapeXml(obj[prop])
            }
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml;
};

/**
 * The method will convert the {"a":{"b":{"c":{"d":{}}}}} to below format
 * <xml:element 'a'><xml:element 'b'><xml:element 'c'><xml:element 'd'></xml:element 'd'></xml:element 'c'></xml:element 'b'></xml:element 'a'>
 * @param inputObject
 * @param xmlnsCompositeIntent Ex: xmlns=\"http://www.nokia.com/management-solutions/residential-internet\"
 * @returns {string}
 */
AltiplanoUtilities.prototype.convertObjectCompositeToXmlElement = function (obj, xmlnsCompositeIntent) {
    var xml = '';
    for (var prop in obj) {
        xml += obj[prop] instanceof Array ? '' : "<" + prop + " "+ xmlnsCompositeIntent + ">";
        if (obj[prop] instanceof Array) {
            for (var i = 0; i < obj[prop].length; i++) {
                xml += "<" + prop + ">";
                xml += this.convertObjectToXmlElement(new Object(obj[prop][i]));
                xml += "</" + prop + ">";
            }
        } else if (typeof obj[prop] == "object") {
            xml += this.convertObjectToXmlElement(new Object(obj[prop]));
        } else {
            if(intentConstants.ESCAPE_XML_CHARACTERS_REGEX.test(obj[prop])) {
                // Special character encoding for intentConfigJSON
                obj[prop] = StringEscapeUtils.escapeXml(obj[prop])
            }
            xml += obj[prop];
        }
        xml += obj[prop] instanceof Array ? '' : "</" + prop + ">";
    }
    xml = xml.replace(/<\/?[0-9]{1,}>/g, '');
    return xml;
};

/**
 * 'search' The characters to be searched for at the end of actualString
 * 'actualString' the actual string to search the givenChars
 * 'actualStringLength' Optional - If provided, it is used as the length of actualString. Defaults to actualString.length.
 * @param search
 * @param actualString
 * @param actualStringLength
 * @returns {boolean}
 */
AltiplanoUtilities.prototype.stringEndsWith = function (search, actualString, actualStringLength) {
    if (actualStringLength === undefined || actualStringLength > actualString.length) {
        actualStringLength = actualString.length;
    }
    return actualString.substring(actualStringLength - search.length, actualStringLength) === search;
};

/**
 * check if device type is ION type(i.e managable by NSP product exe SR,IXR series)
 * @param deviceName
 * @param deviceType, optional
 * @returns {boolean}
 */
AltiplanoUtilities.prototype.isDeviceIONType = function(deviceName, deviceType){
    if(deviceName){
        if(!deviceType && deviceName){
            try{
                deviceType = this.getNodeType(deviceName);
            }catch (e) {
                logger.warn("isDeviceIONType Error while fetching the device type from MDS for device : {}, error: {}", deviceName, e);
                return false;
            }
        }
        return (deviceType.startsWith(intentConstants.FAMILY_TYPE_IXR) ||
            deviceType.startsWith(intentConstants.FAMILY_TYPE_SR))? true : false;
    }
    return null;
}

/**
 * This method gets all the required device details from ES and MDS
 * @param devices
 * @returns {[]}
 */
AltiplanoUtilities.prototype.gatherInformationAboutDevicesFromEsAndMds = function (devices) {
    var deviceDetails = [];
    devices.forEach(function (device) {
        var managerInfo = apUtils.getManagerInfoFromEsAndMds(device);
        var managerType = managerInfo.getType().toString();
        var managerName = managerInfo.getName().toString();
        var familyTypeRel = apUtils.getNodeTypefromEsAndMds(device);
        var familyType = null;
        if (familyTypeRel != null) {
            if ((intentConstants.MANAGER_TYPE_NAV === managerType) || (intentConstants.MANAGER_TYPE_NSP === managerType) 
                 || (intentConstants.MANAGER_TYPE_NSP_MDM === managerType) ) {
                familyType = familyTypeRel.substring(0, familyTypeRel.lastIndexOf("-"));
            } else if (intentConstants.MANAGER_TYPE_AMS === managerType) {
                familyType = familyTypeRel.substring(0, familyTypeRel.indexOf("."));
            } else if (intentConstants.MANAGER_TYPE_NOKIA_ACS === managerType) {
                familyType = familyTypeRel.substring(0, familyTypeRel.lastIndexOf("|"));
            }
        }
        deviceDetails.push({
            "name": device,
            "managerName": managerName,
            "managerType": managerType,
            "familyTypeRelease": familyTypeRel,
            "familyType": familyType
        });
    });
    return deviceDetails;
};

/**
 * Update sync result object with other result object.
 * @param original
 * @param update
 */
AltiplanoUtilities.prototype.updateSyncResult = function (original, update) {
    if (original != null && update != null) {
        logger.debug("Intent SWMGMT updateSyncResult Check original isSuccess {} update isSuccess {}",original.isSuccess(),update.isSuccess());
        original.setSuccess(original.isSuccess() && update.isSuccess());
        logger.debug("Intent SWMGMT updateSyncResult Check original ErrorCode {} original ErrorDetail {} update ErrorCode {} update ErrorDetail {}",
            original.getErrorCode(),original.getErrorDetail(),update.getErrorCode(),update.getErrorDetail());
        original.setErrorCode(update.getErrorCode());
        original.setErrorDetail(update.getErrorDetail());
        logger.debug("Intent SWMGMT updateSyncResult Check Final Success {} ErrorCode {} ErrorDetail {}",original.isSuccess(),original.getErrorCode(),original.getErrorDetail());
        original.setUpdateDependents(original.isUpdateDependents() || update.isUpdateDependents());
        original.setSyncDependents(original.isSyncDependents() || update.isSyncDependents());
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
        var gcHint=update.getGcHint();
        if(gcHint != null){
            original.setGcHint(gcHint);
        }
    }
};

AltiplanoUtilities.prototype.getJSONDetails = function (nameKey, myArray, svcProfileKey, serviceProfileName){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
    throw new RuntimeException ("Unknown profile name " + "'" + nameKey + "'" + " for " + svcProfileKey + " key in the mapping.json for the selected Service Profile " + serviceProfileName);
}

/**
 * Checks whether the provided JSON Object is Empty or Not
 * @param object
 * @returns {boolean}
 */
AltiplanoUtilities.prototype.ifObjectIsEmpty = function (object) {
    var isEmpty = true;
    if (object && Object.keys(object).length > 0) {
        isEmpty = false;
    }
    return isEmpty;
};

/**
 * Retrieves devices which are grouped to local device POD
 * @param terminalSide, whether device acts LT or NT[values allowed are LT/NT]
 * @param podName, optional if null, fetches devices from all the PODs
 * @param deviceType, optional filter a particulat device-type devices
 * @returns {[]}, list of devices
 */
AltiplanoUtilities.prototype.getPODCompatibleDevicesFromMDS = function(terminalSide, podName, deviceType){
    podName = podName ? podName : null
    var localDevices = [];
    var allDevicesWithPodLabelAttribute = mds.getAllDevicesMatchWithAttribute("POD", podName);
    allDevicesWithPodLabelAttribute.forEach(function(device){
        if(device.getLocalAttributes().stream().filter(function (localAttr) {
            return localAttr.getAttributeName() === "type" &&
                localAttr.getAttributeValue() === terminalSide
        }).collect(Collectors.toList()).size()!==0){
            if(deviceType && apUtils.getNodeType(device.getDeviceName()).startsWith(deviceType)){
                localDevices.push(device.getDeviceName());
            }else if(!deviceType){
                localDevices.push(device.getDeviceName());
            }
        }
    });
    return localDevices;
};

/**
 * Check if LOCAL device is of type POD
 * @param deviceName
 * @returns {boolean}
 */
AltiplanoUtilities.prototype.isDevicePod = function(deviceName){
    var deviceType;
    try{
        deviceType = this.getNodeTypefromEsAndMds(deviceName);
    }catch (e) {
        logger.warn("isDevicePod Error while fetching the device type from MDS for device : {}, error: {}", deviceName, e);
        return null;
	}
    return deviceType.startsWith(intentConstants.FAMILY_TYPE_POD)? true: false;
};

AltiplanoUtilities.prototype.getCategoriesForLabel = function (requestXml) {
    var getConfigResponse = apUtils.executeRequestInNAC(requestXml);
    var labelElementFromResponse = utilityService.extractSubtree(getConfigResponse, apUtils.prefixToNsMap, "/nc:rpc-reply/nc:data/emaa:ema-administration/emaa:labels");
    var xpath = "/nc:rpc-reply/nc:data/emaa:ema-administration/emaa:labels/emaa:category/emaa:name";
    var categoriesForLabelData = apUtils.getAttributeValues(labelElementFromResponse, xpath, apUtils.prefixToNsMap);
    logger.debug("Categories: {}", categoriesForLabelData);
    return categoriesForLabelData;
};



AltiplanoUtilities.prototype.validateCreateDeviceLabel = function (contextualErrorJsonObj, intentConfigJson) {
    var requestXml = resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getCategoriesForLabel.xml");
    if (intentConfigJson["label"]) {
        var categoriesForLabelData = this.getCategoriesForLabel(requestXml);
        var keys = Object.keys(intentConfigJson["label"]);
        for (var i = 0; i < keys.length; i++) {
            var categoryName = keys[i].split('#')[0];
            var wrongKeyMsg = null;
            if (categoriesForLabelData.indexOf(categoryName) === -1) {
                wrongKeyMsg = "list#label," + categoryName + ",leaf#category";
                contextualErrorJsonObj[wrongKeyMsg] = 'Invalid value, Acceptable values are ' + categoriesForLabelData.toString();
            }
        }
    }
}

/**
 * FNMS-131254: the category that is used in hierarchy, it should be used one time in labels
 * @param {*} intentConfigJson 
 * @param {*} contextualErrorJsonObj 
 * @returns 
 */
AltiplanoUtilities.prototype.validateUniqueCategory = function (intentConfigJson, contextualErrorJsonObj) {
    let result = true;
    if (intentConfigJson && intentConfigJson["label"] && !this.ifObjectIsEmpty(intentConfigJson["label"])) {
        var labelList = Object.keys(intentConfigJson["label"]);
        if (labelList.length === 0) return;
        var categories = [];
        labelList.forEach(function (label) {
            if (categories.indexOf(label.split('#')[0]) === -1) {
                categories.push(label.split('#')[0])
            }
        }
        )
        var allCategories = mds.getAllCategories(Arrays.asList(categories));
        var categoryMap = {};
        for (var i = 0; i < labelList.length; i++) {
            var categoryName = labelList[i].split('#')[0];
            if (!categoryMap[categoryName]) {
                categoryMap[categoryName] = true;
            } else if (allCategories && !allCategories.contains(categoryName)) {
                result = false;
                contextualErrorJsonObj["list#label," + categoryName + ",leaf#category"] = "Category '" + categoryName + "' is part of a hierarchy and only allows a single label value.";
            }
        }
    }
    return result
}

/*
 * translate error code and error message with the suitable cases.
 * @param exception
 * @param result
 */
AltiplanoUtilities.prototype.translateErrorCodeAndErrorMessage = function (exception, result) {
    var errorCode = "ERR-100";
    var errorMessage = exception;
    //"java.lang.reflect.UndeclaredThrowableException" hanppens when delete the manager
    if (typeof exception.getClass === "function" && typeof exception.getClass().getName === "function" && 
    exception.getClass() && exception.getClass().getName() && exception.getClass().getName().indexOf("UndeclaredThrowableException") > -1) {
        var errorDetail = {};
        this.getRootCauseException(exception, errorDetail);
        var rootCauseException = errorDetail.rootCauseException;
        var messageDetail = errorDetail.messageDetail;
        if (rootCauseException && messageDetail) {
            if (rootCauseException.indexOf("ManagerNotFoundException") > -1 && messageDetail.indexOf("not found") > -1) {
                errorCode = "EXP-1";
                //message of exception ManagerNotFoundException: Manager 'NAV name' not found.
                errorMessage = messageDetail.substring(messageDetail.indexOf("'") + 1, messageDetail.lastIndexOf("'"));
            }
        }
    } else if (typeof exception.getMessage === "function" && exception.getMessage()) {
        var managerNotFound = "Manager not found in MDS: ";
        var deviceNotFound = "Device not found: ";
        var configurationRejected = "Configuration is rejected for device ";
        var netconfTimeOut = "Cannot connect or object does not exist in host";
        if (exception.getMessage().startsWith(managerNotFound)) {
            errorCode = "EXP-1";
            errorMessage = exception.getMessage().substring(managerNotFound.length);
        } else if (exception.getMessage().startsWith(deviceNotFound)) {
            errorCode = "EXP-2";
            errorMessage = exception.getMessage().substring(deviceNotFound.length);
        } else if (exception.getMessage().startsWith(configurationRejected)) {
            // format: Configuration is rejected for device devicename by ManagerName
            errorCode = "EXP-3";
            var errorDeviceName = exception.getMessage().substring(configurationRejected.length).split(" by ")[0];
            var errorManagerName = exception.getMessage().substring(configurationRejected.length).substring(errorDeviceName.length + " by ".length);
            var errorMessage = errorDeviceName + "," + errorManagerName;
        } else if (exception.getMessage().indexOf(netconfTimeOut) !== -1) {
            errorCode = "EXP-500";
        }
    }
    result.setSuccess(false);
    result.setErrorCode(errorCode);
    result.setErrorDetail(errorMessage);
}

/**
 * get the rootcause exception, sometime the exception can be gotten UndeclaredThrowableException
 * @param exception
 * @param errorDetail
 */
AltiplanoUtilities.prototype.getRootCauseException = function (exception, errorDetail) {
    if (typeof exception.getCause === "function") {
        var cause = exception.getCause();
        if (cause != null) {
            if (typeof cause.getMessage === "function") {
                errorDetail.messageDetail = cause.getMessage();
                errorDetail.rootCauseException = cause.toString();
            }
            return this.getRootCauseException(cause, errorDetail);
        }
    }
    return null;
};

/**
 * This method will return all the FX/MF devices for a particular shelf (Excluding the shelf Name)
 * @param shelfName
 */
AltiplanoUtilities.prototype.getAllFxMfDevicesFromMdsEs = function (shelfName, deviceType) {
    var devices = [];
    // Get the devices from MDS
    if(deviceType == intentConstants.INTENT_TYPE_DEVICE_FX) {
        devices = this.getAllFxDevices(shelfName);
    } else if (deviceType == intentConstants.INTENT_TYPE_DEVICE_MF) {
        devices = this.getAllMfLtiHubDevices(shelfName);
    } else if (deviceType == intentConstants.INTENT_TYPE_DEVICE_SF) {
        devices = this.getAllSfLtiHubDevices(shelfName);
    }
    if(devices.length === 0) {
        // Try to also get the devices from ES
        var targettedDevices = this.getTargettedDevicesFromIntentType(deviceType, shelfName);
        // Remove shelf name from targettedDevices
        var indexOfShelfName = targettedDevices.indexOf(shelfName);
        if(indexOfShelfName !== -1) {
            targettedDevices.splice(indexOfShelfName, 1);
        }
        return targettedDevices;
    }
    return devices;
}

/**
 * Returns all FX devices (Including IHUB) associated to this shelf
 * @param shelfName
 * @returns {[]}
 */
AltiplanoUtilities.prototype.getAllFxDevices = function (shelfName) {
    var devices = [];
    var fxDevices = mds.getNDevicesStartingWith(shelfName + intentConstants.FX_DEVICE_SEPARATOR, intentConstants.LS_FX_MAX_DEVICE_COUNT);

    if (fxDevices && fxDevices.size() > 0) {
        fxDevices.forEach(function (fxDevice) {
            if (fxDevice.endsWith(intentConstants.DOT_LS_FX_IHUB)) {
                var lastIndex = fxDevice.lastIndexOf(intentConstants.FX_DEVICE_SEPARATOR);
                var fxDeviceSplitString0 = fxDevice.substring(0, lastIndex);
                if (fxDeviceSplitString0 == shelfName) {
                    var fxDeviceSplitString1 = fxDevice.substring(lastIndex + 1);
                    if (fxDeviceSplitString1.startsWith(intentConstants.LS_FX_IHUB)) {
                        devices.push(fxDevice);
                    }
                }
            } else if (fxDevice.contains(intentConstants.DOT_LT)) {
                var device = apUtils.getFxShelfDeviceName(fxDevice);
                if (device == shelfName) {
                    devices.push(fxDevice);
                }
            }
        });
    }
    return devices;
}
/**
 * Return all the MF devices (LTS)
 * @param shelfName
 * @returns {[]}
 */
AltiplanoUtilities.prototype.getAllMfLtDevices = function (shelfName) {
    var devices = [];
    var mfDevices = mds.getNDevicesStartingWith(shelfName + intentConstants.DEVICE_SEPARATOR, intentConstants.LS_FX_MAX_DEVICE_COUNT);

    if (mfDevices && mfDevices.size() > 0) {
        var ltPattern = new RegExp(intentConstants.DEVICE_SEPARATOR.concat(intentConstants.LT_REG_EXP));
        mfDevices.forEach(function (ltDevice) {
            if (ltPattern.test(ltDevice)) {
                var device = apUtils.getShelfDeviceName(ltDevice, intentConstants.LS_MF_PREFIX);
                if (device == shelfName) {
                    devices.push(ltDevice);
                }
            }
        });
    }
    return devices;
}

/**
 * Return all the MF devices (LTS) and iHUB
 * @param shelfName
 * @returns {[]}
 */
AltiplanoUtilities.prototype.getAllMfLtiHubDevices = function (shelfName) {
    var devices = [];
    var mfDevices = mds.getNDevicesStartingWith(shelfName + intentConstants.DEVICE_SEPARATOR, intentConstants.LS_FX_MAX_DEVICE_COUNT);

    if (mfDevices && mfDevices.size() > 0) {
        mfDevices.forEach(function (mfDevice) {
            if (mfDevice.endsWith(intentConstants.DOT_LS_IHUB)) {
                var lastIndex = mfDevice.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
                var mfShelfName = mfDevice.substring(0, lastIndex);
                if (mfShelfName === shelfName && mfDevice.substring(lastIndex + 1).startsWith(intentConstants.LS_IHUB)) {
                    devices.push(mfDevice);
                }
            } else if (mfDevice.contains(intentConstants.LT_STRING)) {
                var device = apUtils.getShelfDeviceName(mfDevice, intentConstants.LS_MF_PREFIX);
                if (device === shelfName) {
                    devices.push(mfDevice);
                }
            }
        });
    }
    return devices;
}

/**
 * method to get attribute values from a RPC reply
 * @param template
 * @param templateArgs
 * @param xpath
 * @param skipCharCount
 */
AltiplanoUtilities.prototype.getInterfaceParams = function (template, templateArgs, xpath, skipCharCount) {
    var result = new Object();
    var trimmedParam;
    try {
        var deviceXml = this.getExtractedDeviceSpecificDataNode(template, templateArgs);
        if(deviceXml) {
            var interfaceParams = this.getAttributeValues(deviceXml, xpath, this.prefixToNsMap);
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
        }
    } catch (e) {
        logger.error("Mismatch in configuration between device and expected parameter {}", e);
    }
    return result;
};

AltiplanoUtilities.prototype.getTransformedDependencyInfo = function (dependencyObject){
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
}

AltiplanoUtilities.prototype.getValidateResult = function(dependencyIntentType, dependencyTarget) {
    var syncDependencyInfo = {};
    var validateResultObj = new ValidateResult();
    for (var i = 0; i < dependencyIntentType.length; i++) {
        this.validateIntentTarget(dependencyIntentType[i], dependencyTarget);
        syncDependencyInfo[dependencyIntentType[i]] = [dependencyTarget];
    }
    validateResultObj.setDependencyInfo(this.getTransformedDependencyInfo(syncDependencyInfo));
    return validateResultObj;
}


// If any empty leaf added while converting to json, will be removed
AltiplanoUtilities.prototype.handleEmptyTagInJson = function(intentConfigJson) {
    var emptyTags = intentConfigJson["EMPTY-LEAFS"];
    emptyTags.forEach(function (emptyTag) {
        intentConfigJson[emptyTag] = null;
    });
    delete intentConfigJson["EMPTY-LEAFS"];
    return intentConfigJson;
}

/**
 * Function to convert the JSON format from (A) to (B)
 * If Intent RPC has list then default XML to JSON conversion API will produce format (A) before invoking
 * API convertObjectToXmlElement(intentConfigJson) the intent-config-json should be in format (B)
 *  (A)
 *  "static-ipv4-address": {
 *   "192.168.254.101": { "address": "192.168.254.101", "prefix-length": "32" }
 *  }
 *  (B)
 * "static-ipv4-address": [
 *  { "address": "192.168.254.101", "prefix-length": "32" }
 * ]
 */
AltiplanoUtilities.prototype.handleListInIntentMigration = function(intentConfigJson, keys) {
    for (var key in keys) {
        if (intentConfigJson[keys[key]]) {
            var preConfigJson = intentConfigJson[keys[key]];
            intentConfigJson[keys[key]] = [];
            for (var elements in preConfigJson) {
                if (elements != "undefined") {
                    intentConfigJson[keys[key]].push(preConfigJson[elements]);
                }
            }
        }
    }
}

/**
 * Function to handle Onu Software Mapping in intent migration
 */
AltiplanoUtilities.prototype.handleOnuSoftwareMappingInIntentMigration = function(intentConfigJson) {
    if (intentConfigJson["onu-active-software-mapping"]) {
        var activeSoftwareMapping = intentConfigJson["onu-active-software-mapping"];
        if (activeSoftwareMapping != null) {
            for (var activeMapKeys in activeSoftwareMapping) {
                if (activeSoftwareMapping[activeMapKeys]["onu-software"]) {
                    this.handleListInIntentMigration(activeSoftwareMapping[activeMapKeys], ["onu-software"]);
                }
                if (activeSoftwareMapping[activeMapKeys]["label"]) {
                    this.handleListInIntentMigration(activeSoftwareMapping[activeMapKeys], ["label"]);
                }
            }
        }
        intentConfigJson["onu-active-software-mapping"] = activeSoftwareMapping;
        this.handleListInIntentMigration(intentConfigJson,["onu-active-software-mapping"]);
    }
    if (intentConfigJson["onu-passive-software-mapping"]) {
        var passiveSoftwareMapping = intentConfigJson["onu-passive-software-mapping"];
        if (passiveSoftwareMapping != null) {
            for (var passiveMapKeys in passiveSoftwareMapping) {
                if (passiveSoftwareMapping[passiveMapKeys]["onu-software"]) {
                    this.handleListInIntentMigration(passiveSoftwareMapping[passiveMapKeys], ["onu-software"]);
                }
                if (passiveSoftwareMapping[passiveMapKeys]["label"]) {
                    this.handleListInIntentMigration(passiveSoftwareMapping[passiveMapKeys], ["label"]);
                }
            }
        }
        intentConfigJson["onu-passive-software-mapping"] = passiveSoftwareMapping;
        this.handleListInIntentMigration(intentConfigJson,["onu-passive-software-mapping"]);
    }
}

/**
 * @param deviceName
 * @returns Local attribute-value of attribute-type 'POD' linked to device in MDS
 */
AltiplanoUtilities.prototype.getPODNameFromDevice = function(deviceName){
    var podName;
    if(deviceName){
        let scopeKey = "mds_allLocalAttributesPerDevice_" + deviceName;
        let localAttr = apUtils.getContentFromIntentScope(scopeKey);
        if (!localAttr) {
            localAttr = mds.getAllLocalAttributesPerDevice(deviceName);
        }
        if (localAttr) {
            apUtils.storeContentInIntentScope(scopeKey, localAttr);
            podName = localAttr.get("POD");
        }
    }
    return podName;
}

/**
 * Returns the targetted devices for the specified intent
 * @param dependentIntentType
 * @param dependentTarget
 * @param dependentIntentVersion
 */
AltiplanoUtilities.prototype.getDependentIntentTargettedDevices = function (dependentIntentType, dependentTarget, dependentIntentVersion) {
    var targettedDevices = [];

    var rootObject = {};
    rootObject =
        {
            "bool":
                {
                    "filter": [
                        {
                            "term": {
                                "intent-type": dependentIntentType
                            }
                        },
                        {
                            "term": {
                                "intent-type-version": dependentIntentVersion
                            }
                        },
                        {
                            "term": {
                                "target.raw": dependentTarget
                            }
                        }
                    ]
                }
        };

    var object = {};
    object["query"] = rootObject;
    object["size"] = 1;
    object["_source"] = ["targetted-devices", "nested-lists"];
    var response = apUtils.executeEsIntentSearchRequest(JSON.stringify(object));
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
            if (intentResult["_source"]["targetted-devices"] !== undefined) {
                targettedDevices = intentResult["_source"]["targetted-devices"];
                if (intentResult["_source"]["nested-lists"] !== undefined) {
                    var nestedLists = [];
                    nestedLists = intentResult["_source"]["nested-lists"];
                    // Find all slot-names with planned-type "-"
                    var slotsToRemove = [];
                    for (var i = 0; i < nestedLists.length; i++) {
                        if (nestedLists[i]["planned-type"] && nestedLists[i]["planned-type"].indexOf("-") !== -1) {
                            if (nestedLists[i]["slot-name"] && nestedLists[i]["slot-name"][0]) {
                                slotsToRemove.push(dependentTarget + "." + nestedLists[i]["slot-name"][0]);
                            }
                        }
                    }
                    // Filter out these slots from target
                    if (slotsToRemove.length > 0) {
                        targettedDevices = targettedDevices.filter(function (item) {
                            return slotsToRemove.indexOf(item) === -1;
                        });
                    }
                }
            }
        });
    } else {
        logger.debug("No intent found with target {}, intent-version {} of type {}", dependentTarget, dependentIntentVersion, dependentIntentType);
    }

    return targettedDevices;
};

/**
 * This method used to get the lightspan device family-type from family-type-release.
 *
 * @param familyTypeRelease
 * @returns {string|null}
 */
AltiplanoUtilities.prototype.getLightspanDeviceFamilyTypeFromRelease = function (familyTypeRelease) {
    if(familyTypeRelease) {
        var pattern = "^[L][S][-].*[A-Z-0-9.-]{7}$";
        var regExpObj = new RegExp(pattern);
        if(regExpObj.test(familyTypeRelease)) {
            return familyTypeRelease.substring(0, familyTypeRelease.lastIndexOf("-"));
        }
    }
    return null;
}

AltiplanoUtilities.prototype.getBestKnownTypeByDeviceName = function (deviceName, supportedDeviceTypes) {
    var actualType = apUtils.getNodeTypefromEsAndMds(deviceName);
    if(actualType){
        var prefixLength = this.getPrefixLengthForDeviceType(actualType);
        return this.getBestKnownType(actualType, supportedDeviceTypes, prefixLength);
    }
    return null;
};

/**
 * get best known type of device based on the family type
 * @param {String} actualType the family type of the device
 * @param {Array} supportedDeviceTypes array of supported device types
 * @return {String} the best known type of device.
 */
AltiplanoUtilities.prototype.getBestKnownTypeByFamilyType = function (actualType, supportedDeviceTypes) {
    if(actualType){
        var prefixLength = this.getPrefixLengthForDeviceType(actualType);
        return this.getBestKnownType(actualType, supportedDeviceTypes, prefixLength);
    }
    return null;
};

AltiplanoUtilities.prototype.getBoardServiceProfilesForNAVManager = function (serviceProfileResource, familyPrefix, boardType, boardSubType, useProfileManager) {
    var boardServiceProfileObj = {};
    if(!useProfileManager){
        serviceProfileResource = JSON.parse(serviceProfileResource);
    }
    if (familyPrefix === intentConstants.LS_FX_PREFIX || familyPrefix === intentConstants.LS_MF_PREFIX || familyPrefix === intentConstants.LS_SF_PREFIX) {
        if (boardType == null) {
            var boardServiceProfiles = serviceProfileResource["board-service-profile"]["PON"];
        } else if(boardType && boardSubType) {
            if(familyPrefix === intentConstants.LS_MF_PREFIX){
                if(useProfileManager == true){
                    if((boardType==="NT" && boardSubType===profileConstants.BOARD_SERVICE_PROFILE_MF.subtypeMFNT) || (boardType==="LT" && boardSubType===profileConstants.BOARD_SERVICE_PROFILE_MF.subtypeMFLT) || (boardType==="NTIO" && boardSubType===profileConstants.BOARD_SERVICE_PROFILE_MF.subtypeMFNTIO) || (boardType==="ACU" && boardSubType===profileConstants.BOARD_SERVICE_PROFILE_MF.subtypeMFACU)){
                        if(serviceProfileResource[boardSubType] && serviceProfileResource[boardSubType]["board-service-profile"]) {
                            boardServiceProfiles = serviceProfileResource[boardSubType]["board-service-profile"];
                        }
                    }else{
                        boardServiceProfiles = serviceProfileResource[profileConstants.BOARD_SERVICE_PROFILE_MF.subtypeMFNT]["board-service-profile"];
                    }
                }else{
                    if(boardType==="NT" && boardSubType==="EXTAL"){
                        boardServiceProfiles = serviceProfileResource["board-service-profile"][boardType][boardSubType];
                    }else {
                        boardServiceProfiles = serviceProfileResource["board-service-profile"][boardSubType];
                    }
                }
            } else if(familyPrefix === intentConstants.LS_SF_PREFIX){
                if(useProfileManager == true && (boardType==="NT" && boardSubType==="LS-SF-NT") || (boardType==="LT" && boardSubType==="LS-SF-LT")){
                    boardServiceProfiles = serviceProfileResource[boardSubType]["board-service-profile"];
                }
                else{
                    boardServiceProfiles = serviceProfileResource["board-service-profile"][boardSubType];
                }
            }
            else if(familyPrefix === intentConstants.LS_FX_PREFIX){     
                if((useProfileManager)){
                    if(serviceProfileResource[boardSubType] && serviceProfileResource[boardSubType]["board-service-profile"]) {
                        boardServiceProfiles = serviceProfileResource[boardSubType]["board-service-profile"];
                    }
                }
                else{
                    boardServiceProfiles = serviceProfileResource["board-service-profile"][boardSubType];
                }
            }
        } else {
            if(useProfileManager){
                boardServiceProfiles = serviceProfileResource[boardType]["board-service-profile"];
            }
            else{
                boardServiceProfiles = serviceProfileResource["board-service-profile"][boardType];
            }
        }
    }  else if (familyPrefix.startsWith(intentConstants.LS_DF_PREFIX)) {
        if(useProfileManager) {
            boardServiceProfiles = serviceProfileResource[profileConstants.BOARD_SERVICE_PROFILE_DF.subType]["board-service-profile"];
        }else {
            boardServiceProfiles = serviceProfileResource["board-service-profile"][familyPrefix]["PON"];
        }
    }
    if (boardServiceProfiles) {
        for (var boardServiceProfile in boardServiceProfiles) {
            boardServiceProfileObj[boardServiceProfiles[boardServiceProfile]["name"]] = boardServiceProfiles[boardServiceProfile];
        }
    }
    return boardServiceProfileObj;
};

/**
 * This method helps to get node value from NC response
 * Also it will return corresponding error message if the given node is not present in the NC response
 *
 * @param ncResponse
 * @param xpath
 */
AltiplanoUtilities.prototype.getNodeValueIfNotNull = function (ncResponse, xpath) {
    var node = apUtils.getNodeValue(ncResponse, xpath, this.prefixToNsMap);
    if (!node) {
        //get error message
        var errorMsg = apUtils.getNodeValue(ncResponse, "nc:rpc-error/nc:error-message/text()", this.prefixToNsMap);
        if (errorMsg) {
            throw new RuntimeException(errorMsg);
        }
        throw new RuntimeException("RPC response doesn't contain data for given xpath");
    }
    return node;
}

/**
 * Computes the tracked args for the provided arguments
 * TODO : Current method only considers 2 levels of nesting in the schema object for computing tracking args
 * TODO : We need to extend this to compute tracked args for n levels of nesting in schema object
 * @param inputSchemaObject
 * @param excludeList
 * @param additionalKeys
 */
AltiplanoUtilities.prototype.computeTrackedArgs = function (inputSchemaObject, excludeList, additionalKeys) {
    var isExcludeListPresent = false;
    if (excludeList && excludeList.length > 0) {
        isExcludeListPresent = true;
    }
    var trackedArgs = {};
    if (inputSchemaObject) {
        Object.keys(inputSchemaObject).forEach(function (key) {
            Object.keys(inputSchemaObject[key]).forEach(function (innerKey) {
                if (!isExcludeListPresent || (isExcludeListPresent && excludeList.indexOf(innerKey) <= -1)) {
                    trackedArgs[innerKey] = true;
                }
            });
        });
    }
    if (additionalKeys && additionalKeys.length > 0) {
        additionalKeys.forEach(function (key) {
            trackedArgs[key] = true;
        });
    }
    return trackedArgs;
};

/**
 * Method to generate the ONU ID from AV or read from the topology if already generated
 */
AltiplanoUtilities.prototype.getOnuId = function (ontName, deviceName, channelGroupName, currentTopo, xponType, stageName, deviceType, managerName) {
    if (currentTopo == null || currentTopo.getTopologyObjects() == null || currentTopo.getTopologyObjects().isEmpty()) {
        return this.getNextFreeOnuId(ontName, deviceName, channelGroupName, xponType, deviceType, managerName);
    } else {
        var key = stageName + "_" + deviceName + "_ARGS";
        var xtraInfo = this.getTopologyExtraInfo(currentTopo);
        if (xtraInfo) {
            var stageArgs = xtraInfo[key];
            if (stageArgs) {
                stageArgs = this.JSONParsingWithCatchingException("getOnuId", stageArgs);
                var deviceArgs = stageArgs[deviceName];
                var onuId = deviceArgs.onuId;
                if (onuId) {
                    // If fibername is changed - compute new ONT ID
                    if(deviceArgs.channelGroupName && deviceArgs.channelGroupName.value != channelGroupName) {
                        logger.debug("Fiber change detected for ont: {}, from channelGroupName: {} to {}", ontName, deviceArgs.channelGroupName.value, channelGroupName);
                        return this.getNextFreeOnuId(ontName, deviceName, channelGroupName, xponType, deviceType, managerName);
                    }
                    return onuId.value;
                }
            }
        }
        // Specifically added to getNextFreeOnuId if topology exists, but device info does not exist
        // i.e 2nd Alarm for Easy start case - ONT movement across NE.
        return this.getNextFreeOnuId(ontName, deviceName, channelGroupName, xponType, deviceType, managerName);
    }
}

/**
 * Generate the next free ONU ID from AV
 * @param ifSkipAllowedIds to skip checking with the allowed ids or not
 */
AltiplanoUtilities.prototype.getNextFreeOnuId = function (ontName, deviceName, channelGroupName, xponType, deviceType, managerName, ifSkipAllowedIds) {
    var templateArgs = {
        "channelGroupName": channelGroupName,
        "deviceID": deviceName,
        "xponType": xponType,
        "virtualAniInterfaceName": ontName
    };
    if (!ifSkipAllowedIds) {
        var allowedIds = apUtils.getAllowedIdList(deviceName, deviceType, ontName, "ONU", managerName);
        if (allowedIds) {
            templateArgs["allowedIdList"] = allowedIds;
        }
    }
    var resourceFile = intentConstants.MANAGER_SPECIFIC_NV_ID_MGMT + "getFreeOnuIds.xml.ftl";
    var nextFreeOnuIdNode = this.getExtractedNodeFromResponse(resourceFile,
        templateArgs, "/nc:rpc-reply/pon-id-allocation:v-ani-and-onu-id/pon-id-allocation:onu-id/text()", this.prefixToNsMap);
    if (!nextFreeOnuIdNode) {
        throw new RuntimeException("ONU Id is not able to fetch with " + JSON.stringify(templateArgs));
    }
    return nextFreeOnuIdNode.nodeValue;
}

/**
 * get the DynamidIds: it can be gemport-id or tcont-id
 * @param currentTopo topology object to find the existing Ids
 * @param xtraParams params need to fetch the device arguments from topology
 * @param dynamicIdParams params need to generate Ids
 */
AltiplanoUtilities.prototype.getDynamicIds = function (currentTopo, xtraParams, dynamicIdParams) {
    if (currentTopo == null || currentTopo.getTopologyObjects() == null || currentTopo.getTopologyObjects().isEmpty()) {
        return this.getDynamicId(dynamicIdParams, false);
    } else {
        var deviceArgs = this.getXtraInfoArgs(currentTopo, xtraParams);
        if (deviceArgs && deviceArgs.fiberName && (deviceArgs.fiberName.value === dynamicIdParams.fiberName)) {
            if (dynamicIdParams.dynamicType === "GEM-PORT") {
                if (deviceArgs.gemPortId && deviceArgs.gemPortId.value) {
                    return deviceArgs.gemPortId.value;
                }
            } else if (dynamicIdParams.dynamicType === "ALLOC") {
                if (deviceArgs.allocId &&  deviceArgs.allocId.value) {
                    return deviceArgs.allocId.value;
                }
            }
        }
        return this.getDynamicId(dynamicIdParams, false);
    }
}

/**
 * get the DynamidIds: it can be gemport-id or tcont-id
 * @param value
 * @param fiberName
 * @param xponType
 * @param dynamicType
 * @param deviceName
 */
AltiplanoUtilities.prototype.getDynamicId = function (params, isMultipleIds) {
    var templateArgs = {
        channelGroupName: params.fiberName,
        xponType: params.xponType,
        deviceID: params.deviceName
    };
    if (!params.isLsOltPlusLsDpu) {
        var allowedIds = apUtils.getAllowedIdList(params.deviceName, params.deviceType, params.ontName, params.dynamicType, params.managerName);
    } else {
        var allowedIds = apUtils.getAllowedIdListForLSFiberPlusCopper(params.deviceName, params.copperDeviceName,  params.deviceType, params.dynamicType);
    }
    if (allowedIds) {
        templateArgs["allowedIdList"] = allowedIds;
    }
    if (params.dynamicType === "GEM-PORT") {
        templateArgs["gemPortName"] = params.value;
        var resource = intentConstants.MANAGER_SPECIFIC_NV_ID_MGMT + "getFreeGemPortIds.xml.ftl";
        var rpcReply = this.getExtractedNodeFromResponse(resource, templateArgs, "/nc:rpc-reply", this.prefixToNsMap);
        if (rpcReply) {
            if(isMultipleIds) {
                return this.extractElementIds(params.value, rpcReply, "pon-id-allocation:gemport-and-gemport-id[pon-id-allocation:gemport-name=\"NAME\"]/pon-id-allocation:gemport-id/text()");
            } else {
                return apUtils.getNodeValueIfNotNull(rpcReply, "pon-id-allocation:gemport-and-gemport-id/pon-id-allocation:gemport-id/text()");
            }
        } else {
            throw new RuntimeException("NetConf Response is NULL or Response is timed out")
        }
    } else if (params.dynamicType === "ALLOC") {
        templateArgs["tcontName"] = params.value;
        resource = intentConstants.MANAGER_SPECIFIC_NV_ID_MGMT + "getFreeAllocationId.xml.ftl";
        var rpcReply = this.getExtractedNodeFromResponse(resource, templateArgs, "/nc:rpc-reply", this.prefixToNsMap);
        if (rpcReply) {
            if(isMultipleIds) {
                return this.extractElementIds(params.value, rpcReply, "pon-id-allocation:tcont-and-alloc-id[pon-id-allocation:tcont-name=\"NAME\"]/pon-id-allocation:alloc-id/text()");
            } else {
                return apUtils.getNodeValueIfNotNull(rpcReply, "pon-id-allocation:tcont-and-alloc-id/pon-id-allocation:alloc-id/text()");
            }
        } else {
            throw new RuntimeException("NetConf Response is NULL or Response is timed out")
        }
    }
};

AltiplanoUtilities.prototype.getAllowedIdListForLSFiberPlusCopper = function(fiberDeviceName, copperDeviceName, fiberDeviceType, dynamicType) {
    var deviceConfigType, nodeType;
    if (fiberDeviceType.contains(intentConstants.LS_DF_PREFIX)) {
        deviceConfigType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_DF;
        nodeType = intentConstants.LS_DF_PREFIX;
    } else if(fiberDeviceType.contains(intentConstants.LS_FX_PREFIX)) {
        deviceConfigType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX;
        nodeType = intentConstants.LS_FX_PREFIX;
        if(fiberDeviceName.contains(intentConstants.DOT_LT)) {
            fiberDeviceName = apUtils.getShelfDeviceName(fiberDeviceName);
        }
    } else if(fiberDeviceType.contains(intentConstants.LS_MF_PREFIX)) {
        deviceConfigType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF;
        nodeType = intentConstants.LS_MF_PREFIX;
        if(fiberDeviceName.contains(intentConstants.DOT_LT)) {
            fiberDeviceName = apUtils.getShelfDeviceName(fiberDeviceName, intentConstants.LS_MF_PREFIX);
        }
    } else if(fiberDeviceType.contains(intentConstants.LS_SF_PREFIX)) {
        deviceConfigType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_SF;
        nodeType = intentConstants.LS_SF_PREFIX;
        if(fiberDeviceName.contains(intentConstants.DOT_LT)) {
            fiberDeviceName = apUtils.getShelfDeviceName(fiberDeviceName, intentConstants.LS_SF_PREFIX);
        }
    }
    var ponIdManagementProfileResouce = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR +  "pon-id-management.json";
    var uplinkConnectionVersion = this.getIntentVersion(intentConstants.INTENT_TYPE_UPLINK_CONNECTION, copperDeviceName);
    var allAllowedIdList = apUtils.getDependentIntentResourceFile(fiberDeviceName, deviceConfigType, ponIdManagementProfileResouce);
    var idManagementProfile = JSON.parse(apUtils.getResourceValue(intentConstants.INTENT_TYPE_UPLINK_CONNECTION, uplinkConnectionVersion, intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "id-management.json"));
    var ponIdManagementProfile = idManagementProfile["id-management"][nodeType]["pon-id-management-profile"];

    if (ponIdManagementProfile) {
        var allowedIds = allAllowedIdList["pon-id-profiles"][ponIdManagementProfile][0];
        if (dynamicType === "GEM-PORT") {
            return allowedIds["gemport-id"]["allowed-id-list"];
        } else if (dynamicType === "ALLOC") {
            return allowedIds["tcont-id"]["allowed-id-list"];
        } else if (dynamicType === "ONU") {
            return allowedIds["onu-id"]["allowed-id-list"];
        } 
    }
    return null;
}

/**
 * Method to extract Multiple Ids for the given node
 *
 * @param multipleElements comma separated values
 * @param rpcReply
 * @param elementXpath xpath with placeholder "NAME" which can be replaced with actual value
 * @returns extracted Ids in a Map with key as name
 */
AltiplanoUtilities.prototype.extractElementIds = function (multipleElements, rpcReply, elementXpath) {
    var ids = {};
    var names = multipleElements.split(",");
    for (var nameIndex in names) {
        ids[names[nameIndex]] = apUtils.getNodeValueIfNotNull(rpcReply, elementXpath.replace("NAME", names[nameIndex]));
    }
    return ids;
};

/**
 * get the DynamidIds for the list of gemport or tcont
 *
 * @param oltGemTcontMap it can be a group of gemport or tcont
 * @param topology
 * @param params other required parameters
 */
AltiplanoUtilities.prototype.getDynamicIdsForList = function (oltGemTcontMap, topology, params, xtraParams, checkTypeArray) {
    // Fetching from the topology for update operation
    var oldOnuGemTontMap;
    if (!(topology == null || topology.getTopologyObjects() == null || topology.getTopologyObjects().isEmpty())) {
        var deviceArgs = this.getXtraInfoArgs(topology, xtraParams);
        if (deviceArgs && deviceArgs.fiberName && (deviceArgs.fiberName.value === params.fiberName)) {
            if (params.dynamicType === "GEM-PORT") {
                oldOnuGemTontMap = deviceArgs.gemPortMap;
            } else if (params.dynamicType === "ALLOC") {
                oldOnuGemTontMap = deviceArgs.tcontMap;
            }
        }
    }

    // Listing the element names which need to get id
    var elementNames = [];
    for(var onuTcontEntry in oltGemTcontMap) {
        var onuElementName = oltGemTcontMap[onuTcontEntry]["name"];
        if (oldOnuGemTontMap && oldOnuGemTontMap[onuElementName] && oldOnuGemTontMap[onuElementName][params.dynamicId]) {
            oltGemTcontMap[onuTcontEntry][params.dynamicId] = oldOnuGemTontMap[onuElementName][params.dynamicId];
        } else {
            elementNames.push(onuElementName);
        }
    }
    // Generating the Ids and setting
    if(elementNames.length > 0) {
        params["value"] = elementNames.join(",");
        var ids = this.getDynamicId(params, true);
        if (!checkTypeArray){
            for (var elementIndex in elementNames) {
                oltGemTcontMap[elementNames[elementIndex]][params.dynamicId] = ids[elementNames[elementIndex]];
            }
        }else {
            for(var onuTcontEntry in oltGemTcontMap) {
                var onuElementName = oltGemTcontMap[onuTcontEntry]["name"];
                for (var elementIndex in elementNames) {
                    if(oltGemTcontMap && oltGemTcontMap[onuTcontEntry] && elementNames && (oltGemTcontMap[onuTcontEntry]["name"] == elementNames[elementIndex])){
                        oltGemTcontMap[onuTcontEntry][params.dynamicId] = ids[elementNames[elementIndex]];
                    }
                }
            }
        }
    }
}

/**
 * This method sets the necessary parameter need for verion 20.12 templates to just pass AT as it is not needed to support
 * This can be cleaned up in 21.6. To avoid large changes in AT suites
 * @param onuGemPortMap
 * @param onuTcontMap
 * @param baseArgs
 * @param requestContext
 */
AltiplanoUtilities.prototype.setDeviceExtraParam2012 = function(onuGemPortMap, onuTcontMap, baseArgs, requestContext) {
    var gemPortName = Object.keys(onuGemPortMap)[0];
    var tcontName = Object.keys(onuTcontMap)[0];
    baseArgs["gemPortName"] = gemPortName;
    baseArgs["gemPortNameForONU"] = gemPortName;
    baseArgs["trafficClass"] = onuGemPortMap[gemPortName]["trafficClass"];
    baseArgs["localQueueID"] = onuGemPortMap[gemPortName]["trafficClass"];
    var gemPortId = onuGemPortMap[gemPortName]["gemPortId"];
    baseArgs["gemPortId"] = gemPortId;
    requestContext.put("gemPortId", gemPortId);
    baseArgs["tcontName"] = tcontName;
    baseArgs["tcontNameForONU"] = tcontName;
    baseArgs["tc2QueueMappingProfile"] = onuTcontMap[tcontName]["tc-to-queue-mapping-profile-id"];
    var allocId = onuTcontMap[tcontName]["allocId"];
    baseArgs["allocId"] = allocId;
    requestContext.put("allocId", allocId);
};

/**
 * get the allowed id list for gemport-id or tcont-id or onu-id
 * @param deviceName
 * @param deviceType
 * @param ontName
 * @param dynamicType
 */
AltiplanoUtilities.prototype.getAllowedIdList = function(deviceName, deviceType, ontName, dynamicType, managerName) {

    var deviceConfigType, nodeType, familyTypeRelease, ponIdManagementProfile;
    var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_ONT, ontName);
    familyTypeRelease = apUtils.getNodeTypefromEsAndMds(deviceName);
    if (deviceType.contains(intentConstants.LS_DF_PREFIX)) {
        deviceConfigType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_DF;
        nodeType = intentConstants.LS_DF_PREFIX;
    } else if(deviceType.contains(intentConstants.LS_FX_PREFIX)) {
        deviceConfigType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX;
        nodeType = intentConstants.LS_FX_PREFIX;
        if(deviceName.contains(intentConstants.DOT_LT)) {
            deviceName = apUtils.getShelfDeviceName(deviceName);
        }
    } else if(deviceType.contains(intentConstants.LS_MF_PREFIX)) {
        deviceConfigType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF;
        nodeType = intentConstants.LS_MF_PREFIX;
        if(deviceName.contains(intentConstants.DOT_LT)) {
            deviceName = apUtils.getShelfDeviceName(deviceName, intentConstants.LS_MF_PREFIX);
        }
    } else if(deviceType.contains(intentConstants.LS_SF_PREFIX)) {
        deviceConfigType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_SF;
        nodeType = intentConstants.LS_SF_PREFIX;
        if(deviceName.contains(intentConstants.DOT_LT)) {
            deviceName = apUtils.getShelfDeviceName(deviceName, intentConstants.LS_SF_PREFIX);
        }
    }
    var nwSlicingUserType = apUtils.getNetworkSlicingUserType(managerName);
    var ponIdManagementProfileResouce = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR;
    
    if (nwSlicingUserType == intentConstants.NETWORK_SLICING_USER_TYPE_SLICE_OWNER) {
        ponIdManagementProfileResouce += "pon-id-management-slice-owner.json";
    } else if (nwSlicingUserType == intentConstants.NETWORK_SLICING_USER_TYPE_SLICE_MANAGER) {
        ponIdManagementProfileResouce += "pon-id-management-slice-manager.json";
    } else {
        ponIdManagementProfileResouce += "pon-id-management.json";
    }

    var allAllowedIdList = apUtils.getDependentIntentResourceFile(deviceName, deviceConfigType, ponIdManagementProfileResouce);
    var idManagementProfile = JSON.parse(apUtils.getResourceValue(intentConstants.INTENT_TYPE_ONT, intentVersion, intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR + "id-management.json"));
    ponIdManagementProfile = idManagementProfile["id-management"][nodeType]["pon-id-management-profile"];

    if (ponIdManagementProfile) {
        var allowedIds = allAllowedIdList["pon-id-profiles"][ponIdManagementProfile][0];
        if (dynamicType === "GEM-PORT") {
            return allowedIds["gemport-id"]["allowed-id-list"];
        } else if (dynamicType === "ALLOC") {
            return allowedIds["tcont-id"]["allowed-id-list"];
        } else if (dynamicType === "ONU") {
            return allowedIds["onu-id"]["allowed-id-list"];
        } 
    }
    return null;
}

/**
 * get the getXtraInfoArgs of device
 * @param currentTopo
 * @param xtraParas
 */
AltiplanoUtilities.prototype.getXtraInfoArgs = function (currentTopo, xtraParas) {
    if (xtraParas.requestContext.get(xtraParas.xtraKey)) {
        return xtraParas.requestContext.get(xtraParas.xtraKey);
    } else {
        var xtraInfo = this.getTopologyExtraInfo(currentTopo);
        if (xtraInfo) {
            var stageArgs = xtraInfo[xtraParas.extraInfoKey];
            if (stageArgs) {
                stageArgs = this.JSONParsingWithCatchingException("getXtraInfoArgs", stageArgs);
                xtraParas.requestContext.put(xtraParas.xtraKey, stageArgs[xtraParas.deviceName]);
                return stageArgs[xtraParas.deviceName];
            }
        }
    }
    return null;
}

/**
 * Get Frame Processing Profile name
 * @param sVlanId
 * @param cVlanId
 * @param upstreamTrafficType
 * @param isLsOltPlusLsDpu
 *
 * @return string
 *
 * */
AltiplanoUtilities.prototype.getTaggedProfileName = function (sVlanId, cVlanId,upstreamTrafficType,unTagProcessingAtLT, isLsOltPlusLsDpu) {
    var taggedProfileName = "Untagged";
    if (unTagProcessingAtLT == "true") {
        if (sVlanId && cVlanId) {
            if (upstreamTrafficType == "priority-tagged") {
                taggedProfileName = "Priority_Double_Tagged_PBIT_Marking_Done";
            } else if (upstreamTrafficType == "single-tagged" || upstreamTrafficType == "match-all" || upstreamTrafficType == "untagged" || upstreamTrafficType == "transparent-forward") {
                if (isLsOltPlusLsDpu) {
                    taggedProfileName = "CC-QINQ-VLAN-PROFILE";
                } else {
                    taggedProfileName = "Double_Tagged_PBIT_Marking_Done";
                }
            }
        } else if (cVlanId) {
            if (upstreamTrafficType == "priority-tagged") {
                taggedProfileName = "Priority_Single_Tagged_PBIT_Marking_Done";
            } else if (upstreamTrafficType == "single-tagged" || upstreamTrafficType == "match-all" || upstreamTrafficType == "untagged" || upstreamTrafficType == "transparent-forward") {
                taggedProfileName = "Single_Tagged_PBIT_Marking_Done";
            }
        }
    } else {
        if (sVlanId && cVlanId) {
            if (isLsOltPlusLsDpu) {
                taggedProfileName = "CC-QINQ-VLAN-PROFILE";
            } else {
                taggedProfileName = "Double_Tagged_PBIT_Marking_Done";
            }
        } else if (cVlanId || sVlanId) {
            taggedProfileName = "Single_Tagged_PBIT_Marking_Done";
        }
    }
    return taggedProfileName;
}
/*
 * Getting dependent intent resource file
 * TODO : This method will get ependent intent resource file
 * @param deviceName
 * @param intentType
 * @param resourcePath
 * @returns {Object}
 */
AltiplanoUtilities.prototype.getDependentIntentResourceFile = function (deviceName, intentType, resourcePath) {
    var intentVersion = apUtils.getIntentVersion(intentType, deviceName);
    return JSON.parse(apUtils.getResourceValue(intentType, intentVersion, resourcePath));
};

/**
 * Getting ONU Template Json by fiberName
 * This method will get onu template in json format from onu-templates.json of device-config-xx base on fiberName
 * @param fiberName
 * @param  {Object} contextParameters some extra parameters, {onuTemplateFileName : "onu-templates-22.6.json"}
 * @returns {Object}
 */
AltiplanoUtilities.prototype.getOnuTemplatesJson = function (fiberName, deviceName, familyTypeRelease, supportedDeviceTypes, contextParameters) {
    if (!familyTypeRelease && !deviceName) {
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
            deviceName = devices[0].name;
        }
    }

    var onuTemplate = null;
    if (familyTypeRelease == intentConstants.FAMILY_TYPE_ISAM) {
        return null;
    }

    var onuTemplatesFileName;
    if (deviceName) {
        var bestType = apUtils.getBestKnownTypeByDeviceName(deviceName, supportedDeviceTypes);
        if (bestType && bestType.indexOf("21.3") != -1 && bestType.startsWith(intentConstants.LS_FX_PREFIX)) {
            onuTemplatesFileName = "onu-templates-21.3.json";
        } else if (bestType && bestType.indexOf("21.3") != -1 && !bestType.startsWith(intentConstants.LS_FX_PREFIX)) {
            onuTemplatesFileName = "onu-templates.json";
        } else if (bestType && (bestType.indexOf("21.6") != -1)) {
            onuTemplatesFileName = "onu-templates-21.6.json";
        } else if (bestType && bestType.indexOf("21.9") != -1) {
            onuTemplatesFileName = "onu-templates-21.9.json";
        } else if (bestType && bestType.indexOf("21.12") != -1) {
            onuTemplatesFileName = "onu-templates-21.12.json";
        } else if (bestType && bestType.indexOf("22.3") != -1) {
            onuTemplatesFileName = "onu-templates-22.3.json";
        } else if (bestType && bestType.indexOf("22.6") != -1) {
            onuTemplatesFileName = "onu-templates-22.6.json";
        }
    } else {
        onuTemplatesFileName = "onu-templates-21.9.json";
    }
    if (contextParameters && typeof contextParameters === "object" && onuTemplatesFileName) {
        contextParameters.onuTemplateFileName = onuTemplatesFileName;
    }
    if (familyTypeRelease) {
        var intentType;
        if (familyTypeRelease.contains(intentConstants.LS_FX_PREFIX)) {
            intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX;
        } else if (familyTypeRelease.contains(intentConstants.LS_DF_PREFIX)) {
            intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_DF;
        } else if (familyTypeRelease.contains(intentConstants.LS_MF_PREFIX)) {
            intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF;
        } else if (familyTypeRelease.contains(intentConstants.LS_SF_PREFIX)) {
            intentType = intentConstants.INTENT_TYPE_DEVICE_CONFIG_SF;
        }

        try {
            var deviceInfo = apUtils.getDeviceInfo(deviceName);
            if (deviceInfo && deviceInfo["isLtDevice"] && deviceInfo["shelfDeviceName"]) {
                onuTemplate = apUtils.getDependentIntentResourceFile(deviceInfo["shelfDeviceName"], intentType, intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_EONU + intentConstants.FILE_SEPERATOR + onuTemplatesFileName);
            } else {
                onuTemplate = apUtils.getDependentIntentResourceFile(deviceName, intentType, intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_EONU + intentConstants.FILE_SEPERATOR + onuTemplatesFileName);
            }
        } catch (e) {
            logger.debug("Error while getting onuTemplate {}", e);
        }

        if (onuTemplate && onuTemplate["onu-template"] && onuTemplate["onu-template"].length > 0) {
            return onuTemplate["onu-template"];
        }
    }
    return onuTemplate;
};

/**
 * Getting devices from fiber by fiberName
 * TODO : This method will get devices base on pon-port in fiber intent
 * @param fiberName
 * @returns {Object}
 */
AltiplanoUtilities.prototype.getDevicesFromFiber = function (fiberName) {
    var fiberDevices = [];
    if (fiberName) {
        var fiberIntentConfigJson = apUtils.getFiberIntentConfigJson(fiberName);

        var oltDeviceAndPon = {};
        if (fiberIntentConfigJson["pon-port"]) {
            if (fiberIntentConfigJson["xpon-type"] === intentConstants.XPON_TYPE_GPON || fiberIntentConfigJson["xpon-type"] === intentConstants.XPON_TYPE_XGS || fiberIntentConfigJson["xpon-type"] === intentConstants.XPON_TYPE_MPM_GPON_XGS || fiberIntentConfigJson["xpon-type"] === intentConstants.XPON_TYPE_25G
            || fiberIntentConfigJson["xpon-type"] === intentConstants.XPON_TYPE_DUAL_GPON || fiberIntentConfigJson["xpon-type"] === intentConstants.XPON_TYPE_U_NGPON) {
                var keys = Object.keys(fiberIntentConfigJson["pon-port"]);
                keys.forEach(function (key) {
                    var splitsKey = key.split('#');
                    if (!oltDeviceAndPon[splitsKey[0]]) {
                        oltDeviceAndPon[splitsKey[0]] = splitsKey[1];
                    }
                });
            }
            if (Object.keys(oltDeviceAndPon).length > 0) {
                fiberDevices = Object.keys(oltDeviceAndPon);
            }
        }
    }
    return fiberDevices;
};

/**
 * Getting fiber intent configuration by fiberName
 * TODO : This method will get fiber intent configuration by fiberName
 * @param fiberName
 * @returns {Object}
 */
AltiplanoUtilities.prototype.getFiberIntentConfigJson = function (fiberName){
    var fiberIntent = apUtils.getIntent(intentConstants.INTENT_TYPE_FIBER, fiberName);
    if (!fiberIntent) {
        throw new RuntimeException("Fiber intent '" + fiberName + "' does not exist");
    } else {
        var fiberIntentConfig = fiberIntent.getIntentConfig();
        var getKeyForList = function(listName){
            switch (listName) {
                case "pon-port":
                    return ["device-name", "pon-id"];
                default:
                    return null;
            }
        };
        return apUtils.convertIntentConfigXmlToJson(fiberIntentConfig, getKeyForList);
    }
};

/**
 * Fetch Ont intent configuration using ont name
 * @param ontName
 * @return {*}
 */
AltiplanoUtilities.prototype.getOntIntentConfigJson = function (ontName) {
    var ontIntent = apUtils.getIntent(intentConstants.INTENT_TYPE_ONT, ontName);
    if (!ontIntent) {
        throw new RuntimeException("ONT intent '" + ontName + "' does not exist");
    } else {
        var ontIntentConfig = ontIntent.getIntentConfig();
        var getKeyForList = function (listName) {
            switch (listName) {
                case "uni-service-configuration":
                    return "uni-id";
                case "label":
                    return ["category", "value"];
                default:
                    return null;
            }
        };
        return apUtils.convertIntentConfigXmlToJson(ontIntentConfig, getKeyForList);
    }
};

/**
 * Getting device-fx/device-mf intent configuration by deviceId
 * TODO : This method will get device fx or device mf intent configuration by deviceId
 * @param deviceId
 * @returns {Object}
 */
AltiplanoUtilities.prototype.getDeviceFxMfIntentConfigJson = function (deviceId, intentType){
    var deviceIntent = apUtils.getIntent(intentType, deviceId);
    if (!deviceIntent) {
        throw new RuntimeException("Device FX intent '" + deviceId  + "' does not exist");
    } else {
        var deviceConfig = deviceIntent.getIntentConfig();
        var getKeyForList = function (listName) {
            switch (listName) {
                case "label":
                    return ["category", "value"];
                case "boards":
                    return ["slot-name"];
                case "eonu-release":
                    return "yang:leaf-list";
                default:
                    return null;
            }
        };
        return apUtils.convertIntentConfigXmlToJson(deviceConfig, getKeyForList);
    }
};
/**
 * Getting eONU supported LTs from device-fx/mf intent
 * TODO : This method will get LTs device which supported eONU
 * @param deviceName - Device name
 * @param nodeType - Node type
 * @param ltDeviceName
 * @returns {Object}
 */
AltiplanoUtilities.prototype.getEonuSupportedLtsFromDeviceFxOrMfIntent = function (deviceName, nodeType, ltDeviceName, storeInIntentScope) {
    var eOnuSupportedLts = [];
    var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
    if(nodeType && nodeType.startsWith(intentConstants.LS_MF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_MF;
        var deviceConfigIntent = apUtils.getIntent(intentType, deviceName);
        var prefix = intentConstants.LS_MF_PREFIX;
    } else if(nodeType && nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_SF;
        var deviceConfigIntent = apUtils.getIntent(intentType, deviceName);
        var prefix = intentConstants.LS_SF_PREFIX;
    } else {
        var intentType = intentConstants.INTENT_TYPE_DEVICE_FX;
        var deviceConfigIntent = apUtils.getIntent(intentType, deviceName);
        var prefix = intentConstants.LS_FX_PREFIX;
    }

    if (deviceConfigIntent) {
        var deviceConfigIntentConfig = deviceConfigIntent.getIntentConfig();
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
        var deviceConfigIntentConfigJson = apUtils.convertIntentConfigXmlToJson(deviceConfigIntentConfig, getKeyForList);
        if (deviceConfigIntentConfigJson) {
            var boardList = deviceConfigIntentConfigJson["boards"];
            if (boardList) {
                var ltPattern = new RegExp(intentConstants.LT_REG_EXP);
                var selectedBoardProfileList = [];
                var boardNumberList = Object.keys(boardList);
                if(ltDeviceName) {
                    for (var index in boardNumberList) {
                        var board = boardNumberList[index];
                        var isLtBoard = ltPattern.test(board);
                        if (isLtBoard) {
                           if(ltDeviceName && this.getLtBoardNumber(ltDeviceName) == board) {
                                var selectedBoardProfile = boardList[board]["board-service-profile"];
                                var boardServiceProfileVO = intentProfileInputFactory.createIntentProfileInputVO(selectedBoardProfile, prefix + "-LT" , "board-service-profile");
                                selectedBoardProfileList.push(boardServiceProfileVO);
                                break;
                            }
                        }
                    }

                } else {
                    for (var index in boardNumberList) {
                        var board = boardNumberList[index];
                        var isLtBoard = ltPattern.test(board);
                        if (isLtBoard) {
                            var selectedBoardProfile = boardList[board]["board-service-profile"];
                            var boardServiceProfileVO = intentProfileInputFactory.createIntentProfileInputVO(selectedBoardProfile, prefix + "-LT" , "board-service-profile");
                            selectedBoardProfileList.push(boardServiceProfileVO); 
                            
                        }
                    }
                }
                var boardServiceProfiles = apUtils.getSubSetOfUsedProfilesInJsonFormat(intentType, deviceName, selectedBoardProfileList, storeInIntentScope);
                Object.keys(boardList).forEach(function (board) {
                    var isLtBoard = ltPattern.test(board);
                    if (isLtBoard) {
                        var boardName = boardList[board]["slot-name"];
                        var selectedBoardProfile = boardList[board]["board-service-profile"];
                        var onuModel;
                        if(selectedBoardProfile) {
                            if(boardServiceProfiles["board-service-profile"] && boardServiceProfiles["board-service-profile"][prefix + "-LT"]) {
                                for(var index in boardServiceProfiles["board-service-profile"][prefix + "-LT"]) {
                                    if(boardServiceProfiles["board-service-profile"][prefix + "-LT"][index]["name"] == selectedBoardProfile) {
                                        onuModel = boardServiceProfiles["board-service-profile"][prefix + "-LT"][index]["onu-model"];
                                        break;
                                    }
                                }
                            }
                            
                        } else if (nodeType && (nodeType.startsWith(intentConstants.LS_MF_PREFIX) || nodeType.startsWith(intentConstants.LS_SF_PREFIX))) {
                            onuModel = intentConstants.ONU_MODEL_EONU;
                        }
                        if(onuModel && onuModel === intentConstants.ONU_MODEL_EONU) {
                            var ltDevice = deviceName + "." + boardName;
                            eOnuSupportedLts.push(ltDevice);
                        }
                    }
                });
            }
        }
    }
    logger.debug("eOnuSupportedLts : {}", JSON.stringify(eOnuSupportedLts));
    return eOnuSupportedLts;
};

/**
 * Checking DF device is using eONU or not
 * @param deviceName - Device name
 * @returns {Boolean}
 */
AltiplanoUtilities.prototype.isDfDeviceUseEonu = function (deviceName, familyType, storeInIntentScope) {
    var deviceDfIntent = apUtils.getIntent(intentConstants.INTENT_TYPE_DEVICE_DF, deviceName);
    if (deviceDfIntent) {
        var dfIntentConfigJson = apUtils.convertIntentConfigXmlToJson(deviceDfIntent.getIntentConfig());
        var selectedBoardProfile = dfIntentConfigJson["board-service-profile"];
        var boardServiceProfileVO = intentProfileInputFactory.createIntentProfileInputVO(selectedBoardProfile, profileConstants.BOARD_SERVICE_PROFILE_DF.subType, profileConstants.BOARD_SERVICE_PROFILE_DF.profileType);
        var boardProfile = apUtils.getSubSetOfUsedProfilesInJsonFormat(intentConstants.INTENT_TYPE_DEVICE_DF, deviceName, Arrays.asList(boardServiceProfileVO), storeInIntentScope);
        if(boardProfile && boardProfile[profileConstants.BOARD_SERVICE_PROFILE_DF.profileType] &&
            boardProfile[profileConstants.BOARD_SERVICE_PROFILE_DF.profileType][profileConstants.BOARD_SERVICE_PROFILE_DF.subType] && 
            boardProfile[profileConstants.BOARD_SERVICE_PROFILE_DF.profileType][profileConstants.BOARD_SERVICE_PROFILE_DF.subType][0]["onu-model"] === intentConstants.ONU_MODEL_EONU) {
            return true;
        } else if (!boardProfile[profileConstants.BOARD_SERVICE_PROFILE_DF.profileType] && familyType && (familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_E) 
                || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_H) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_J) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_A) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_C))) {
            return true;
        }
	}
    return false;
};

/**
 * Checking FX/MF device is using eONU or not
 * @param deviceName - Device name
 * @param deviceType - Device type
 * @param fiberName - Fiber name
 * @returns {Boolean}
 */
AltiplanoUtilities.prototype.isLtDeviceUseEonu = function (deviceName, deviceType, fiberName, storeInIntentScope) {
    if (fiberName) {
        try {
            var fiberIntentConfigJson = apUtils.getFiberIntentConfigJson(fiberName);
            if (fiberIntentConfigJson["pon-port"]) {
                var ponPortName = Object.keys(fiberIntentConfigJson["pon-port"]);
                var lastIndex = ponPortName[0].lastIndexOf(intentConstants.DEVICE_SEPARATOR);
                if (lastIndex > -1) {
                    var ltDeviceDetails = ponPortName[0].substring(0, lastIndex);
                    var ltDevice = ltDeviceDetails.replace("#", ".");
                    var eOnuSupportedLts = apUtils.getEonuSupportedLtsFromDeviceFxOrMfIntent(deviceName, deviceType, ltDevice, storeInIntentScope);
                    if (eOnuSupportedLts) {
                        for (var device in eOnuSupportedLts) {
                            if (ltDevice === eOnuSupportedLts[device]) {
                                return true;
                            }
                        }
                    }
                }
            }
        } catch (error) {
            logger.debug("Error while getting fiberIntentConfigJson {}", error);
        }
    }
    return false;
};

/**
 * Getting service attribute from ONU template by UNI ID
 * @param serviceAttribute - Service Attribute
 * @param onuTemplatesJson - ONU Template Json
 * @param ontTemplateName - ONU Template Name
 * @param uniId - UNI ID
 * @param returnMatchObject - Return object or string value
 * @returns {string}
 */
AltiplanoUtilities.prototype.getServiceAttributeFromOnuTemplateByUniId = function (serviceAttribute, onuTemplatesJson, ontTemplateName, uniId, returnMatchObject) {
    var attributeValue;
    if (onuTemplatesJson) {
        for (var template in onuTemplatesJson) {
            if (onuTemplatesJson[template]["name"] === ontTemplateName) {
                var services = onuTemplatesJson[template]["service"];
                for (var service in services) {
                    if (services[service]["uni-id"] && uniId == services[service]["uni-id"]) {
                        if (!returnMatchObject) {
                            attributeValue = services[service][serviceAttribute];
                        } else {
                            return services[service];
                        }
                        break;
                    }
                }
                break;
            }
        }
    }
    return attributeValue;
};

/**
 * Getting fiberName from ONT State
 * @param ontTarget - ONT name
 * @returns {string}
 */
AltiplanoUtilities.prototype.getFiberNameFromOntState = function (ontTarget) {
    var fetchKey = "fiberName_".concat(ontTarget);
    var fiberName = apUtils.getContentFromIntentScope(fetchKey);
    var ontIntentConfigJSON,ontIntentStateJSON;
    if(!fiberName){
        var argsONT = {
            "ontTarget": ontTarget,
            "intentType": intentConstants.INTENT_TYPE_ONT
        }
        var jsonTemplate = utilityService.processTemplate(resourceProvider.getResource(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "resources/esQueryOnuConfigFromOntTarget.json.ftl"), argsONT);
        var responseONT = apUtils.executeEsIntentSearchRequest(jsonTemplate);
        if (apUtils.isResponseContainsData(responseONT)) {
            responseONT.hits.hits.forEach(function (intentResultONT) {
                ontIntentConfigJSON = intentResultONT["_source"]["configuration"];
                ontIntentStateJSON = intentResultONT["_source"]["state"];
            })
        }
        if(ontIntentConfigJSON && ontIntentConfigJSON["fiber-name"]){
            fiberName = ontIntentConfigJSON["fiber-name"][0];
        } else if(ontIntentStateJSON && ontIntentStateJSON["detected-fiber-name"]){
            fiberName = ontIntentStateJSON["detected-fiber-name"][0];
        } 
        apUtils.storeContentInIntentScope(fetchKey, fiberName);
    }
    return fiberName;
};

/**
 * Getting fiberName in easy ont case
 * @param ontTarget - ONT name
 * @param vonuLabelsResourcePath - VONU label resource path
 * @returns {string}
 */
AltiplanoUtilities.prototype.getFiberNameInEasyOnt = function (ontTarget, vonuLabelsResourcePath) {
    var ontIntent = apUtils.getIntent(intentConstants.INTENT_TYPE_ONT, ontTarget);
    if (!ontIntent) {
        throw new RuntimeException("User Device: Not a valid User Device");
    }
    var fiberName;
    var ontIntentConfigJson = apUtils.convertIntentConfigXmlToJson(ontIntent.getIntentConfig());
    if (ontIntentConfigJson && ontIntentConfigJson["fiber-name"]) {
        fiberName = ontIntentConfigJson["fiber-name"];
        var ontTopology = topologyQueryService.getLatestTopology(intentConstants.INTENT_TYPE_ONT, ontTarget);
        if(ontTopology){
            var topXtraInfo = apUtils.getTopologyExtraInfo(ontTopology);
            if(topXtraInfo && topXtraInfo["lastIntentConfig"]){
                var lastIntentConfig = apUtils.JSONParsingWithCatchingException("getFiberNameInEasyOnt", topXtraInfo["lastIntentConfig"]);
                if (lastIntentConfig && lastIntentConfig["fiber-name"]) {
                    fiberName = lastIntentConfig["fiber-name"];
                }
            }
        }
    } else {
        //ONT easy start
        var ontTopology = topologyQueryService.getLatestTopology(intentConstants.INTENT_TYPE_ONT, ontTarget);
        if (ontTopology) {
            var allDevices = apUtils.getStageArgsFromTopologyXtraInfo(ontTopology, "ALL_DEVICES");
            var managerType;
            if (allDevices && allDevices.length != 0) {
                managerType = allDevices[0].managerType;
            } else {
                if (requestScope.get() && requestScope.get().get("fiber-name")) {
                    return requestScope.get().get("fiber-name");
                }
            }

            if (managerType && intentConstants.MANAGER_TYPE_NAV == managerType) {
                // check whether the ont is type of VONU
                var deviceInfos = apUtils.getAllInfoFromDevices(ontTarget);
                if (deviceInfos && deviceInfos.size() > 0) {
                    var deviceInfo = deviceInfos.get(0);
                    var deviceType = deviceInfo.getFamilyTypeRelease();
                    if(deviceType && deviceType.startsWith(intentConstants.VONU_FAMILY_TYPE)) {
                        var ontLabels = apUtils.getVonuDeviceLabels(ontTarget, vonuLabelsResourcePath);
                        if (ontLabels){
                            fiberName = ontLabels.fiberName;
                        }

                    }
                } else {
                    //Getting from DETECTED_FIBER_NAME
                    var detectedFiberName = apUtils.getStageArgsFromTopologyXtraInfo(ontTopology, "DETECTED_FIBER_NAME");
                    if (detectedFiberName && detectedFiberName["detected-fiber-name"]) {
                        fiberName = detectedFiberName["detected-fiber-name"];
                    }
                }
            } else if(managerType && managerType == intentConstants.MANAGER_TYPE_AMS) {
                var topXtraInfo = apUtils.getTopologyExtraInfo(ontTopology);
                var keysInTopologyXtraInfo = Object.keys(topXtraInfo);
                var intentValueJsonInTopology = {};
                if (keysInTopologyXtraInfo.length != 0) {
                    for (var key in keysInTopologyXtraInfo) {
                        intentValueJsonInTopology = apUtils.JSONParsingWithCatchingException("getFiberNameInEasyOnt", topXtraInfo[keysInTopologyXtraInfo[key]]);
                        if (intentValueJsonInTopology["fiber-name"]) {
                            fiberName = intentValueJsonInTopology["fiber-name"];
                            break;
                        }

                    }
                }
            }
        }
    }
    return fiberName;
};

/**
 * This method used to fetch the respouce from dependent indeant based on callback ouput.
 * We used provide the nodeType as input and the call back will return target and intent type name.
 * @param deviceName
 * @param resourcePath
 * @param callBack
 * @returns {null|any}
 */
AltiplanoUtilities.prototype.getDependentResourceByDeviceName = function (deviceName, target, resourcePath, callBack) {
    var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
    var intentType = callBack(nodeType);
    if(intentType) {
        return this.getDependentIntentResourceFile(target, intentType, resourcePath);
    }
    return null;
};

/**
 * Returns the list of eONU hardware component details that are used in device
 */
AltiplanoUtilities.prototype.getEonuHardwareComponentDetails = function () {
    var eonuHardwareComponentDetails = {};
    eonuHardwareComponentDetails["onuCageName"] = "CAGE";
    eonuHardwareComponentDetails["onuChassisName"] = "CHASSIS";
    eonuHardwareComponentDetails["onuSfpPort"] = "ANIPORT";
    eonuHardwareComponentDetails["onuSfp"] = "SFP";
    eonuHardwareComponentDetails["aniInterfaceName"] = "ANI";
    return eonuHardwareComponentDetails;
};

/**
 * Returns the ONT Details for the selected ONT from the list of available ONT's under mapping.json of ONT Intent
 * @param ontTypes
 * @param ontTypeProvided
 * @returns {*}
 */
AltiplanoUtilities.prototype.getOntDetails = function (ontTypes, ontTypeProvided) {
    var ontDetails;
    if (ontTypes) {
        ontTypes.forEach(function (ontType) {
            if (ontType["name"] === ontTypeProvided) {
                ontDetails = ontType;
                return;
            }
        });
    }
    return ontDetails;
};

/**
 * Returns the list of matching profiles for the provided keys from onu-templates.json
 * @param onuTemplatesJson
 * @param ontTemplateName
 * @param keys
 * @returns {[]}
 */
AltiplanoUtilities.prototype.getMatchingServiceProfilesFromOnuTemplate = function (onuTemplate, keys) {
    var serviceProfiles = [];
    var services = onuTemplate["service"];
    for (var service in services) {
        if (services[service]["type"] == intentConstants.SERVICE_TYPE_TRANSPARENT_FORWARD && keys["type"] == intentConstants.SERVICE_TYPE_TRANSPARENT_FORWARD) {
            serviceProfiles.push(services[service]);
        } else {
            var isMatchingProfile = true;
            Object.keys(keys).forEach(function (key) {
                if(key !== "mcast-vlan-id") {
                    if (services[service][key]) {
                        if (keys[key] !== services[service][key]) {
                            isMatchingProfile = false;
                            return;
                        }
                    }
                } else {
                    if (services[service]["multicast"] && services[service]["multicast"][key]) {
                        if (keys[key] !== services[service]["multicast"][key]) {
                            isMatchingProfile = false;
                            return;
                        }
                    }
                }
            });
            if (isMatchingProfile) {
                serviceProfiles.push(services[service])
            }
        }
    }
    return serviceProfiles;
};
/**
 * Returns the list of matching profiles for the provided keys from profile manager
 * @param onuTemplatesJson
 * @param keys
 * @returns {[]}
 */
 AltiplanoUtilities.prototype.getMatchingServiceProfileswithoutOntTemplateName = function (onuTemplatesJson, keys) {
    var serviceProfiles = [];
    if (onuTemplatesJson) {
        var services = onuTemplatesJson["service"];
        for (var service in services) {
            if (services[service]["type"] == intentConstants.SERVICE_TYPE_TRANSPARENT_FORWARD && keys["type"] == intentConstants.SERVICE_TYPE_TRANSPARENT_FORWARD) {
                serviceProfiles.push(services[service]);
            } else {
                var isMatchingProfile = true;
                Object.keys(keys).forEach(function (key) {
                    if(key !== "mcast-vlan-id") {
                        if (services[service][key]) {
                            if (keys[key] !== services[service][key]) {
                                isMatchingProfile = false;
                                return;
                            }
                        }
                    } else {
                        if (services[service]["multicast"] && services[service]["multicast"][key]) {
                            if (keys[key] !== services[service]["multicast"][key]) {
                                isMatchingProfile = false;
                                return;
                            }
                        }
                    }
                });
                if (isMatchingProfile) {
                    serviceProfiles.push(services[service])
                }
            }
        }
    }
    return serviceProfiles;
};
/**
 * The method used to get the user traffic from intent config.
 * @param intentConfigJson
 * @returns {string}
 */
AltiplanoUtilities.prototype.getCustomerUpstreamTrafficType = function(intentConfigJson) {
    if (!intentConfigJson["EMPTY-LEAFS"] && !intentConfigJson["q-vlan-id"]) {
        throw new RuntimeException("Invalid intent config object");
    }
    if (intentConfigJson["EMPTY-LEAFS"]) {
        if (intentConfigJson["EMPTY-LEAFS"].indexOf(intentConstants.USER_TRAFFIC_TYPE_PRIORITY_TAGGED) > -1) {
            return intentConstants.USER_TRAFFIC_TYPE_PRIORITY_TAGGED;
        } else if (intentConfigJson["transparent-q-vlan-id"]) {
            return intentConstants.USER_TRAFFIC_TYPE_TRANSPARENT_FORWARD;
        } else if (intentConfigJson["EMPTY-LEAFS"].indexOf(intentConstants.USER_TRAFFIC_TYPE_UNTAGGED) > -1) {
            return intentConstants.USER_TRAFFIC_TYPE_UNTAGGED;
        } else if (intentConfigJson["EMPTY-LEAFS"].indexOf(intentConstants.USER_TRAFFIC_TYPE_MATCH_ALL) > -1) {
            return intentConstants.USER_TRAFFIC_TYPE_MATCH_ALL;
        } else if (intentConfigJson["q-vlan-id"]) {
            return intentConstants.USER_TRAFFIC_TYPE_SINGLE_TAGGED;
        } else if (intentConfigJson["EMPTY-LEAFS"].indexOf(intentConstants.USER_TRAFFIC_TYPE_S_VLAN_MATCH) > -1) {
            return intentConstants.USER_TRAFFIC_TYPE_S_VLAN_MATCH;
        } else if (intentConfigJson["EMPTY-LEAFS"].indexOf(intentConstants.USER_TRAFFIC_TYPE_C_VLAN_MATCH) > -1) {
            return intentConstants.USER_TRAFFIC_TYPE_C_VLAN_MATCH;
        } else if (intentConfigJson["egress-traffic-type"]) {
            return intentConstants.USER_TRAFFIC_TYPE_MULTIPLE_TRAFFIC_TYPE;
      	} else if (intentConfigJson["n-vlan-id"]) {
            return intentConstants.USER_TRAFFIC_TYPE_DUAL_TAGGED;
      	}
    }
}

/**
 * Returns the NNI ID's based on the configuration done in uplink-connection intent
 *
 * @param shelfName
 * @returns {[]}
 */
AltiplanoUtilities.prototype.getNniIdsFromUplinkConnection = function (shelfName, nodeType) {
    var nniIds = [];

    var uplinkIntentConfiguration = {};
    var uplinkIntent = apUtils.getIntent(intentConstants.INTENT_TYPE_UPLINK_CONNECTION, shelfName);
    if (uplinkIntent) {
        var uplinkIntentKeyForListFunction = function (listName) {
            switch (listName) {
                case "uplink-ports":
                    return "port-id";
                case "auto-negotiation-Advertised-bits":
                    return "yang:list#leaf-list";
                case "boards":
                    return ["slot-name"];
                default:
                    return null;
            }
        };
        var uplinkIntentConfig = uplinkIntent.getIntentConfig();
        apUtils.convertIntentConfigXmlToJson(uplinkIntentConfig, uplinkIntentKeyForListFunction, uplinkIntentConfiguration);
    } else {
        throw new RuntimeException("uplink-connection-intent is not configured");
    }

    if (uplinkIntentConfiguration) {
        var uplinkPorts = uplinkIntentConfiguration["uplink-ports"];
        if(!nodeType){
            nodeType = apUtils.getNodeTypefromEsAndMds(shelfName);
        }
        
        if (uplinkPorts && Object.keys(uplinkPorts).length > 0) {
            Object.keys(uplinkPorts).forEach(function (uplinkPort) {
                
                var isClockPort = false;
                if (nodeType && (nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LANT_A) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT_B) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LBNT_A_MF14_LMFS_A))){
                    var deviceIhubName = shelfName.concat(intentConstants.DOT_LS_IHUB);
                    var deviceIhubNodeType = apUtils.getNodeTypefromEsAndMds(deviceIhubName);
                    var ihubHwTypeAndRelease= apUtils.splitToHardwareTypeAndVersion(deviceIhubNodeType);
                    isClockPort = apCapUtils.getCapabilityValue(ihubHwTypeAndRelease.hwType, ihubHwTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_CLOCK_PORT, uplinkPort, false); 
                                  
                }
                if (!isClockPort) {
                    if (typeof uplinkPorts[uplinkPort]["agg-system-name"] != "undefined") {
                        var lag = uplinkPorts[uplinkPort]["agg-system-name"];
                        if (nniIds.indexOf(lag) == -1) {
                            nniIds.push(lag);
                        }
                    } else {
                        nniIds.push(uplinkPort);
                    }
                } else {
                    logger.debug("When port is clock port, NNI ID will not be detected in L2-infra");
                }
            });
        }
    }
    return nniIds;
}

AltiplanoUtilities.prototype.getL1Profiles = function(nodeType, deviceName) {
    var definedL1Profiles;
    var profileSubtype = this.getL1ProfileSubType(nodeType);  
    var deviceTypeAndRelease = this.splitToHardwareTypeAndVersion(nodeType);
    var uplinkConnectionProfileVOList = this.getL1ProfileVOList(profileSubtype);
    var intentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_UPLINK_CONNECTION, deviceName);
   
    var l1Profiles = this.getSpecificProfilesInAllFormat(intentConstants.INTENT_TYPE_UPLINK_CONNECTION, intentVersion, deviceTypeAndRelease.release, deviceTypeAndRelease.hwType, uplinkConnectionProfileVOList);           
    if(l1Profiles && l1Profiles[intentConstants.SINGLE_PROFILE_CONFIG] && l1Profiles[intentConstants.SINGLE_PROFILE_CONFIG][profileConstants.L1_PROFILE.profileType] && l1Profiles[intentConstants.SINGLE_PROFILE_CONFIG][profileConstants.L1_PROFILE.profileType][profileSubtype]){
        definedL1Profiles =  l1Profiles[intentConstants.SINGLE_PROFILE_CONFIG][profileConstants.L1_PROFILE.profileType][profileSubtype];
     }

     return definedL1Profiles;

}

AltiplanoUtilities.prototype.isPacketCapturePort = function(definedL1Profiles, uplinkport) {

    var isCapturePort = false;
    if(definedL1Profiles && definedL1Profiles[uplinkport["l1-profile"]] ){
        var l1Profile = definedL1Profiles[uplinkport["l1-profile"]];                     
        if(l1Profile && l1Profile["remote-packet-capture-port"]){
            isCapturePort = l1Profile["remote-packet-capture-port"];
        }  

    }              
    isCapturePort = isCapturePort == "true" ? true: false;
    return isCapturePort;

}

AltiplanoUtilities.prototype.getL1ProfileSubType = function(nodeType) {
    var profileSubtype;  

    if (nodeType.startsWith(intentConstants.LS_FX_PREFIX)) {
        profileSubtype = profileConstants.L1_PROFILE_LS_FX.subType;
       } else if (nodeType.startsWith(intentConstants.LS_MF_PREFIX)) {
        profileSubtype = profileConstants.L1_PROFILE_LS_MF.subType;
      
    } else if (nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
        profileSubtype = profileConstants.L1_PROFILE_LS_SF.subType;
       
    } else if (nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_A) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_E) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_H) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_J) ||nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_C)  ) {
        profileSubtype = profileConstants.L1_PROFILE_LS_DF.subType;
    }else if (nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_IHUB_CFXR_F)) {
        profileSubtype = profileConstants.L1_PROFILE_LS_MF.subType;
     }
    return profileSubtype;
}


AltiplanoUtilities.prototype.getL1ProfileVOList = function(profileSubtype) {
    var l1ProfileObject = {}; 
    var uplinkConnectionProfileVOList = new ArrayList();
    l1ProfileObject= {
        "name": null,
         "subType": profileSubtype
     };
	var profileVO = intentProfileInputFactory.createIntentProfileInputVO(l1ProfileObject["name"], l1ProfileObject["subType"], profileConstants.L1_PROFILE_LS_FX.profileType);
    uplinkConnectionProfileVOList.add(profileVO);       
    return uplinkConnectionProfileVOList;
}




/**
 * Returns the STP configuration done in l2-mgmt-infra intent
 *
 * @param shelfName
 * @returns STP Configuration
 */
AltiplanoUtilities.prototype.getStpConfigFromL2MgmtInfra = function (shelfName) {
    var stpConfig = {};
    var l2MgmtInfraConfiguration = {};
    var l2MgmtInfraIntent = apUtils.getIntent(intentConstants.INTENT_TYPE_L2_MGMT_INFRA, shelfName);
    if (l2MgmtInfraIntent) {
        var keyList = function (listName) {
            switch (listName) {
                case "stp-ports":
                    return "nni-id";
                default:
                    return null;
            }
        };
        apUtils.convertIntentConfigXmlToJson(l2MgmtInfraIntent.getIntentConfig(), keyList, l2MgmtInfraConfiguration);
    }
    if (l2MgmtInfraConfiguration) {
        var stpPorts = l2MgmtInfraConfiguration["stp-ports"];
        if (stpPorts && Object.keys(stpPorts).length > 0) {
            stpConfig["nniIds"] = Object.keys(stpPorts);
        }
        stpConfig["stpMode"] = l2MgmtInfraConfiguration["stp-mode"];
    }
    return stpConfig;
}

/**
 * Checking the fiber devices are supported multiple NNI-IDs or not
 *
 * @param deviceName
 * @param nodeType
 * @param bestKnownType
 * @param supportedDeviceTypes
 * @returns boolean
 */
AltiplanoUtilities.prototype.isFiberDeviceSupportedMultipleNniIds = function (deviceName, nodeType) {
    if (!nodeType && deviceName) {
        try {
            nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
        } catch (error) {
            logger.error("Error when checking fiber device is supported multiple nni-id or not: " + error);
        }
    }
    if (!nodeType) {
        return false;
    }
    var currentVersion = nodeType.substring(nodeType.lastIndexOf("-") + 1);
    if (this.compareVersion(currentVersion, "21.12") >= 0 && (nodeType.startsWith(intentConstants.LS_MF_PREFIX) || nodeType.startsWith(intentConstants.LS_SF_PREFIX) || nodeType.startsWith(intentConstants.LS_FX_PREFIX)
                                                            || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_E) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_H) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_J) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F))) {
        return true;
    }
    return false;
}

/**
 * Returns the UplinkPortName for the provided NNI ID
 * @param shelfName
 * @param supportedDeviceTypes
 * @param nniId
 * @returns {*}
 */
AltiplanoUtilities.prototype.getUplinkPortNameForLsFx = function (shelfName, supportedDeviceTypes, nniId) {
    var uplinkPort = nniId;
    if (nniId.indexOf("LAG") > -1) {
        return uplinkPort.toLowerCase();
    }

    var familyTypeRelease = apUtils.getNodeTypefromEsAndMds(shelfName);
    //pattern ex. (LS)-(FX)-(FANT-H)-(FX4)-(21.9)
    var shelfRegEx = "([A-Z]+)-([A-Z]+)-([A-Z]+-[A-Z])-([A-Z0-9]+)-([0-9]+.[0-9]+)";
    var matches = familyTypeRelease.match(shelfRegEx);

    var deviceTypeAndRelease = this.splitToHardwareTypeAndVersion(familyTypeRelease);
    var hwType;
    if (deviceTypeAndRelease.hwType.startsWith(intentConstants.FAMILY_TYPE_IHUB)){
        hwType = deviceTypeAndRelease.hwType;
    } else {
        hwType = deviceTypeAndRelease.hwType.replace("LS-FX",intentConstants.FAMILY_TYPE_IHUB);
    }
    var portMappingJson = apCapUtils.getCapabilityCategory(hwType, deviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY);

    if(portMappingJson){
        var matchFound = false;
        if(!matchFound){
            for (var i = 0; i < portMappingJson.length; i++) {
                if (nniId == portMappingJson[i]) {
                var portMappingInternalName = apCapUtils.getCapabilityValue(hwType, deviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_INTERNAL_NAME, portMappingJson[i], false);
                uplinkPort = portMappingInternalName[0];    
                matchFound = true;    
                        matchFound = true;
                matchFound = true;    
                break;
                }
            }
        }
    }

    return uplinkPort;
};

/**
 * Returns the UplinkPortName for the provided NNI ID from portMapping.json resource in device-config-xx Intent
 * @param shelfName
 * @param deviceConfigIntent
 * @param portMappingResourcePath
 * @param nniId
 * @returns {*}
 */
 AltiplanoUtilities.prototype.getUplinkPortNameForNNID = function (shelfName, nniIds, deviceConfigIntent, portMappingResourcePath, uplinkTypeDevicePrefix, familyType, uplinkPortObject, uplinkIntent) {
    var uplinkPort = [];
    if (nniIds && nniIds.length > 0) {
        if (!familyType) {
            familyType = apUtils.getNodeTypefromEsAndMds(shelfName);
        }
        if(deviceConfigIntent === intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX || deviceConfigIntent === intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF || deviceConfigIntent === intentConstants.INTENT_TYPE_DEVICE_CONFIG_SF ||deviceConfigIntent === intentConstants.INTENT_TYPE_DEVICE_CONFIG_DF) {
            var deviceTypeAndRelease = this.splitToHardwareTypeAndVersion(familyType);
            var hwType;
            if (deviceTypeAndRelease.hwType.contains(intentConstants.LS_FX_PREFIX)) {
                if (deviceTypeAndRelease.hwType.startsWith(intentConstants.FAMILY_TYPE_IHUB)){
                    hwType = deviceTypeAndRelease.hwType;
                } else {
                    hwType = deviceTypeAndRelease.hwType.replace("LS-FX",intentConstants.FAMILY_TYPE_IHUB);
                }
            } else if (deviceTypeAndRelease.hwType.contains(intentConstants.LS_MF_PREFIX)) {
                if (deviceTypeAndRelease.hwType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_IHUB)){
                    hwType = deviceTypeAndRelease.hwType;
                } else {
                    hwType = deviceTypeAndRelease.hwType.replace("LS-MF",intentConstants.FAMILY_TYPE_LS_MF_IHUB);
                }
            } else if (deviceTypeAndRelease.hwType.contains(intentConstants.LS_SF_PREFIX)) {
                if (deviceTypeAndRelease.hwType.startsWith(intentConstants.FAMILY_TYPE_LS_SF_IHUB)) {
                    hwType = deviceTypeAndRelease.hwType;
                } else {
                    hwType = deviceTypeAndRelease.hwType.replace("LS-SF",intentConstants.FAMILY_TYPE_LS_SF_IHUB);
                }
            }else if (deviceTypeAndRelease.hwType.contains(intentConstants.LS_DF_PREFIX)) {
                if (deviceTypeAndRelease.hwType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_IHUB)) {
                    hwType = deviceTypeAndRelease.hwType;
                } else {
                    hwType = deviceTypeAndRelease.hwType.replace("LS-DF",intentConstants.FAMILY_TYPE_LS_DF_IHUB);
                }
            }
            var portMappingJson = apCapUtils.getCapabilityCategory(hwType, deviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY);
            var uplinkPortNames = {}
            if (portMappingJson) {
                for (var i = 0; i < portMappingJson.length; i++){
                    var portMappingInternalName = apCapUtils.getCapabilityValue(hwType, deviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_INTERNAL_NAME, portMappingJson[i]);
                    var isClockPort = apCapUtils.getCapabilityValue(hwType, deviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_CLOCK_PORT, portMappingJson[i], false);
                    if(portMappingInternalName && ((!uplinkIntent && !isClockPort) || (uplinkIntent && (uplinkIntent==intentConstants.INTENT_TYPE_UPLINK_CONNECTION)))){
                        uplinkPortNames[portMappingJson[i]] = portMappingInternalName[0];
                    }  }
            }
        } else {
            var portMappingJson = this.getDependentIntentResourceFile(shelfName, deviceConfigIntent, portMappingResourcePath);
            var uplinkPortNames =  this.getAllUplinkPortNames(portMappingJson, familyType, uplinkTypeDevicePrefix);
        }

        nniIds.forEach(function (nniId) {
            var nniIdName;
            if (nniId.indexOf("LAG") > -1) {
                nniIdName = nniId.toLowerCase();
            } else if (uplinkPortNames[nniId]) {
                nniIdName = uplinkPortNames[nniId];
            } else {
                nniIdName = nniId;
            }
            uplinkPort.push(nniIdName);
            if (uplinkPortObject) {
                uplinkPortObject[nniId] = nniIdName;
            }
        })
    }
    return uplinkPort;
};

/**
 * Returns the UplinkPortName for the provided NNI IDs array from capability
 * @param nniIds
 * @param hwType
 * @param release
 * @param uplinkPortObject
 * @returns {*}
 */
AltiplanoUtilities.prototype.getUplinkPortNameFromCapsForNNID = function (nniIds, hwType, release, uplinkPortObject) {
    var uplinkPort = [];
    if (nniIds && nniIds.length > 0) {
        nniIds.forEach(function (nniId) {
            var nniIdName;
            if (nniId.indexOf("LAG") > -1) {
                nniIdName = nniId.toLowerCase();
            }else{
                var portMappingInternalName = apCapUtils.getCapabilityValue(hwType, release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_INTERNAL_NAME, nniId, false);
                if(portMappingInternalName && portMappingInternalName.length > 0){
                    nniIdName = portMappingInternalName[0];
                }else{
                    nniIdName = nniId;
                }
            }
            uplinkPort.push(nniIdName);
            if (uplinkPortObject) {
                uplinkPortObject[nniId] = nniIdName;
            }
        })
    }
    return uplinkPort;
};
/**
 *  get all uplink port name defined in the portMapping.json of device-config-xx
 * @param {*} portMappingJson port mapping json from portMapping.json
 * @param {*} familyType to find which port is supported for the device
 * @param {*} familyPrefix "family type in the portMapping.json". Ex: "LS-FX-IHUB-FANT-ALL"
 * @returns [] all uplink port names are supported for the device
 */
 AltiplanoUtilities.prototype.getAllUplinkPortNames = function (portMappingJson, familyType, familyPrefix) {
    var uplinkPortNames = {};
    if (portMappingJson && portMappingJson["Uplink_Labels"]) {
        var portTypeMappings =  portMappingJson["Uplink_Labels"][familyPrefix];
        if (portTypeMappings && Object.keys(portTypeMappings).length > 0) {
            Object.keys(portTypeMappings).forEach(function (portMappping) {
                var uplinkPortTypeMappings = portTypeMappings[portMappping];
                for (var i = 0; i < uplinkPortTypeMappings.length; i++) {
                    var deviceTypeMapping = uplinkPortTypeMappings[i]["device-type"];
                    if (deviceTypeMapping) {
                        var isPortSupported = deviceTypeMapping.filter(function(deviceType){
                            return familyType.indexOf(deviceType) !== -1;
                        });
                        if (!isPortSupported || isPortSupported.length === 0) {
                            continue;
                        }
                    }
                    uplinkPortNames[uplinkPortTypeMappings[i].name] = uplinkPortTypeMappings[i]["uplinkPortName"];
                }
            })
        }
    }
    return uplinkPortNames;
}

/**
 * Returns the olt devices for fiber configuration
 * @param fiberConfiguration
 * @returns []
 */
AltiplanoUtilities.prototype.getOltDevicesFromFiberConfiguration = function(fiberConfiguration, ltPorts) {
    var devices = [];
    if (fiberConfiguration && fiberConfiguration["pon-port"]) {
        var ponPortKeys = Object.keys(fiberConfiguration["pon-port"]);
        ponPortKeys.forEach(function (ponPortKey) {
            var splitKeys = ponPortKey.split('#');
            if (devices.indexOf(splitKeys[0]) === -1) {
                devices.push(splitKeys[0]);
            }
        });
        var devicesInfo = this.gatherInformationAboutDevicesFromEsAndMds(devices)[0];
        if (devicesInfo && devicesInfo.familyType && (devicesInfo.familyType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT) || devicesInfo.familyType.startsWith(intentConstants.LS_MF_PREFIX) || devicesInfo.familyType.startsWith(intentConstants.LS_SF_PREFIX))) {
            var oltDevices = [];
            ponPortKeys.forEach(function (ponPortKey) {
                var splitKeys = ponPortKey.split('#');
                var ponId = splitKeys[1];
                var ltCard = ponId.split(".")[0];
                var ltBoard = devicesInfo.name + intentConstants.DEVICE_SEPARATOR + ltCard;
                if (oltDevices.indexOf(ltBoard) < 0) {
                    if (ltPorts) {
                        ltPorts.push(ltCard.substring(intentConstants.LT_STRING.length));
                    }
                    oltDevices.push(ltBoard);
                }
            });
            return oltDevices;
        }
        return [devicesInfo];
    }
    return devices;
}

/**
 * This method used to check whether particular LT is belongs to FX supported.
 * */
AltiplanoUtilities.prototype.isFXSupportedLTFamily = function (family) {
    var isSupported = false;
    if (family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FELT_B_DOWNLINK) || family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FELT_B_UPLINK) || family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FELT_D_DOWNLINK) || family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FELT_D_UPLINK) || family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGLT_B) || family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FWLT_B) ||
        family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FWLT_C) || family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGLT_D) || family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGLT_E) || family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGUT_A)) {
        isSupported = true;
    }
    return isSupported;
}


/**
 * This method is used to check which boards supports MPM.
 * */
 AltiplanoUtilities.prototype.isMPMCapableBoards = function (family) {
    var isMPMCapable = false;
    if(family.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_E) || family.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_H) || family.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F) || family.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LWLT_C) ||
        family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FWLT_C) ||  family.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGUT_A) ||  family.startsWith(intentConstants.FAMILY_TYPE_LS_SF_SFDB_A)){
        isMPMCapable = true;
    }
    return isMPMCapable;
}
/**
 * This method is used to check the supported device prefix
 * @param {String} deviceTypePrefix 
 * @returns boolean
 */
AltiplanoUtilities.prototype.isShelfSupportedDevice = function (deviceTypePrefix) {
    var isSupported = false;
    if (deviceTypePrefix == intentConstants.LS_MF_PREFIX 
        || deviceTypePrefix == intentConstants.LS_FX_PREFIX 
        || deviceTypePrefix == intentConstants.LS_SF_PREFIX) {
        isSupported = true;
    }
    return isSupported;
}

AltiplanoUtilities.prototype.isFXSupportedLTFamilyTypeFor213 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-FWLT-C-21.3"
        || bestType === "LS-FX-FGLT-D-21.3"
        || bestType === "LS-FX-FGLT-B-21.3"
        || bestType === "LS-FX-FWLT-B-21.3"
        || bestType === "LS-FX-FGUT-A-21.3") {
        isSupported = true;
    }
    return isSupported;
}

AltiplanoUtilities.prototype.isFXSupportedLTFamilyTypeFor216 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-FWLT-C-21.6"
        || bestType === "LS-FX-FGLT-D-21.6"
        || bestType === "LS-FX-FGLT-B-21.6"
        || bestType === "LS-FX-FWLT-B-21.6"
        || bestType === "LS-FX-FGUT-A-21.6") {
        isSupported = true;
    }
    return isSupported;
}

AltiplanoUtilities.prototype.isFXSupportedLTFamilyTypeFor219 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-FWLT-C-21.9"
        || bestType === "LS-FX-FGLT-D-21.9"
        || bestType === "LS-FX-FGLT-B-21.9"
        || bestType === "LS-FX-FWLT-B-21.9"
        || bestType === "LS-FX-FGUT-A-21.9"
        || bestType === "LS-FX-FELT-B-DOWNLINK-21.9") {
        isSupported = true;
    }
    return isSupported;
}

AltiplanoUtilities.prototype.isFXSupportedLTFamilyTypeFor2112 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-FWLT-C-21.12"
        || bestType === "LS-FX-FGLT-D-21.12"
        || bestType === "LS-FX-FGLT-B-21.12"
        || bestType === "LS-FX-FWLT-B-21.12"
        || bestType === "LS-FX-FGUT-A-21.12"
        || bestType === "LS-FX-FELT-B-DOWNLINK-21.12") {
        isSupported = true;
    }
    return isSupported;
}

AltiplanoUtilities.prototype.isFXSupportedLTFamilyTypeFor223 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-FWLT-C-22.3"
        || bestType === "LS-FX-FGLT-D-22.3"
        || bestType === "LS-FX-FGLT-B-22.3"
        || bestType === "LS-FX-FWLT-B-22.3"
        || bestType === "LS-FX-FGUT-A-22.3"
        || bestType === "LS-FX-FELT-B-DOWNLINK-22.3"
        || bestType === "LS-FX-FELT-B-UPLINK-22.3") {
        isSupported = true;
    }
    return isSupported;
}

AltiplanoUtilities.prototype.isFXSupportedLTFamilyTypeFor226 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-FWLT-C-22.6"
        || bestType === "LS-FX-FGLT-D-22.6"
        || bestType === "LS-FX-FGLT-B-22.6"
        || bestType === "LS-FX-FWLT-B-22.6"
        || bestType === "LS-FX-FGUT-A-22.6"
        || bestType === "LS-FX-FELT-B-DOWNLINK-22.6"
        || bestType === "LS-FX-FELT-B-UPLINK-22.6") {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular LT is supported for 22.9 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedLTFamilyTypeFor229 = function (bestType) {
    var isSupported = false;
    if (intentConstants.LS_FX_SUPPORTED_LT_DEVICES_229.indexOf(bestType) >= 0) {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular LT is supported for 23.9 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedLTFamilyTypeFor239 = function (bestType) {
    var isSupported = false;
    if (intentConstants.LS_FX_SUPPORTED_LT_DEVICES_239.indexOf(bestType) >= 0) {
        isSupported = true;
    }
    return isSupported;
}

/**
* This method used to check whether particular LT is supported for 24.6 release in FX family.
* */
AltiplanoUtilities.prototype.isFXSupportedLTFamilyTypeFor246 = function (bestType) {
    var isSupported = false;
    if (intentConstants.LS_FX_SUPPORTED_LT_DEVICES_246.indexOf(bestType) >= 0) {
        isSupported = true;
    }
    return isSupported;
}

/**
* This method used to check whether particular LT is supported for 24.12 release in FX family.
* */
AltiplanoUtilities.prototype.isFXSupportedLTFamilyTypeFor2412 = function (bestType) {
    var isSupported = false;
    if (intentConstants.LS_FX_SUPPORTED_LT_DEVICES_2412.indexOf(bestType) >= 0) {
        isSupported = true;
    }
    return isSupported;
}

/**
 * Checking LT device support fiber LT
 * @param bestType LT device type
 * @returns {boolean}
 */
 AltiplanoUtilities.prototype.isFXSupportedFiberLT = function (bestType) {
    var isSupported = false;
    if (bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FWLT_C)
        || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGLT_D)
        || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGLT_E)
        || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGLT_B)
        || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FWLT_B)
        || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGUT_A)) {
        isSupported = true;
    }
    return isSupported;
}

/**
 * Getting PON type of devices
 * @param bestType best type
 * @returns {string}
 */
AltiplanoUtilities.prototype.getPonTypeForDevices = function (bestType) {
    if (bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGLT_B) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGLT_D) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGLT_E) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_A) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_C) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LGLT_D)) {
        return intentConstants.XPON_TYPE_GPON;
    } else if (bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FWLT_B)) {
        return intentConstants.XPON_TYPE_XGS;
    } else if (bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FWLT_C) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FGUT_A) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_E) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_A) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_C) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_H) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_J) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F) || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LWLT_C)
        || bestType.startsWith(intentConstants.FAMILY_TYPE_LS_SF_SFDB_A)) {
        return intentConstants.XPON_TYPE_MPM_GPON_XGS;
    }
}

/**
 * Getting GEM Port Id From Allocation profile
 * @param ponTypeForLT Pon type
 * @param profileName Profile name
 * @param gemPortIdAllocationProfile Allocation profile
 * @returns {string}
 */
AltiplanoUtilities.prototype.getGemPortIdFromProfile = function (ponTypeForLT, profileName, gemPortIdAllocationProfile) {
    var gemPortIdAllocation = null;
    for (var profile in gemPortIdAllocationProfile) {
        if (gemPortIdAllocationProfile[profile].name == profileName) {
            if (ponTypeForLT == intentConstants.XPON_TYPE_GPON) {
                gemPortIdAllocation = gemPortIdAllocationProfile[profile]["gemport-id-for-gpon-lt"];
            } else if (ponTypeForLT == intentConstants.XPON_TYPE_XGS) {
                gemPortIdAllocation = gemPortIdAllocationProfile[profile]["gemport-id-for-xgs-lt"];
            } else if (ponTypeForLT == intentConstants.XPON_TYPE_MPM_GPON_XGS || ponTypeForLT === intentConstants.XPON_TYPE_25G) {
                gemPortIdAllocation = gemPortIdAllocationProfile[profile]["gemport-id-for-multiple-pon-lt"];
            }
            break;
        }
    }
    return gemPortIdAllocation;
}

/**
 * This method used to check whether particular IHUB is supported for 21.3 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedIHUBFamilyTypeFor213 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-IHUB-FANT-F-FX4-21.3" || bestType === "LS-FX-IHUB-FANT-F-FX8-21.3" || bestType === "LS-FX-IHUB-FANT-F-FX16-21.3"
        || bestType === "LS-FX-IHUB-FANT-G-FX4-21.3" || bestType === "LS-FX-IHUB-FANT-G-FX8-21.3" || bestType === "LS-FX-IHUB-FANT-G-FX16-21.3"
        || bestType === "LS-FX-IHUB-FANT-H-FX4-21.3" || bestType === "LS-FX-IHUB-FANT-H-FX8-21.3" || bestType === "LS-FX-IHUB-FANT-H-FX16-21.3") {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular IHUB is supported for 21.6 release in FX family.
 * */
 AltiplanoUtilities.prototype.isFXSupportedIHUBFamilyTypeFor216 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-IHUB-FANT-F-FX4-21.6" || bestType === "LS-FX-IHUB-FANT-F-FX8-21.6" || bestType === "LS-FX-IHUB-FANT-F-FX16-21.6"
        || bestType === "LS-FX-IHUB-FANT-G-FX4-21.6" || bestType === "LS-FX-IHUB-FANT-G-FX8-21.6" || bestType === "LS-FX-IHUB-FANT-G-FX16-21.6"
        || bestType === "LS-FX-IHUB-FANT-H-FX4-21.6" || bestType === "LS-FX-IHUB-FANT-H-FX8-21.6" || bestType === "LS-FX-IHUB-FANT-H-FX16-21.6") {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular IHUB is supported for 21.9 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedIHUBFamilyTypeFor219 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-IHUB-FANT-F-FX4-21.9" || bestType === "LS-FX-IHUB-FANT-F-FX8-21.9" || bestType === "LS-FX-IHUB-FANT-F-FX16-21.9"
        || bestType === "LS-FX-IHUB-FANT-G-FX4-21.9" || bestType === "LS-FX-IHUB-FANT-G-FX8-21.9" || bestType === "LS-FX-IHUB-FANT-G-FX16-21.9"
        || bestType === "LS-FX-IHUB-FANT-H-FX4-21.9" || bestType === "LS-FX-IHUB-FANT-H-FX8-21.9" || bestType === "LS-FX-IHUB-FANT-H-FX16-21.9") {
        isSupported = true;
    }
    return isSupported;
}


/**
 * This method used to check whether particular IHUB is supported for 22.6 release in FX family.
 * */
 AltiplanoUtilities.prototype.isFXSupportedIHUBFamilyTypeFor226 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-IHUB-FANT-F-FX4-22.6" || bestType === "LS-FX-IHUB-FANT-F-FX8-22.6" || bestType === "LS-FX-IHUB-FANT-F-FX16-22.6"
        || bestType === "LS-FX-IHUB-FANT-G-FX4-22.6" || bestType === "LS-FX-IHUB-FANT-G-FX8-22.6" || bestType === "LS-FX-IHUB-FANT-G-FX16-22.6"
        || bestType === "LS-FX-IHUB-FANT-H-FX4-22.6" || bestType === "LS-FX-IHUB-FANT-H-FX8-22.6" || bestType === "LS-FX-IHUB-FANT-H-FX16-22.6") {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular IHUB is supported for 22.9 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedIHUBFamilyTypeFor229 = function (bestType) {
    var isSupported = false;
    if (intentConstants.LS_FX_SUPPORTED_IHUB_DEVICES_229.indexOf(bestType) >= 0) {
        isSupported = true;
    }
    return isSupported;
}


/**
 * This method used to check whether particular IHUB is supported for 21.12 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedIHUBFamilyTypeFor2112 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-IHUB-FANT-F-FX4-21.12" || bestType === "LS-FX-IHUB-FANT-F-FX8-21.12" || bestType === "LS-FX-IHUB-FANT-F-FX16-21.12"
        || bestType === "LS-FX-IHUB-FANT-G-FX4-21.12" || bestType === "LS-FX-IHUB-FANT-G-FX8-21.12" || bestType === "LS-FX-IHUB-FANT-G-FX16-21.12"
        || bestType === "LS-FX-IHUB-FANT-H-FX4-21.12" || bestType === "LS-FX-IHUB-FANT-H-FX8-21.12" || bestType === "LS-FX-IHUB-FANT-H-FX16-21.12") {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular IHUB is supported for 22.3 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedIHUBFamilyTypeFor223 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-IHUB-FANT-F-FX4-22.3" || bestType === "LS-FX-IHUB-FANT-F-FX8-22.3" || bestType === "LS-FX-IHUB-FANT-F-FX16-22.3"
        || bestType === "LS-FX-IHUB-FANT-G-FX4-22.3" || bestType === "LS-FX-IHUB-FANT-G-FX8-22.3" || bestType === "LS-FX-IHUB-FANT-G-FX16-22.3"
        || bestType === "LS-FX-IHUB-FANT-H-FX4-22.3" || bestType === "LS-FX-IHUB-FANT-H-FX8-22.3" || bestType === "LS-FX-IHUB-FANT-H-FX16-22.3") {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular IHUB is supported for 24.6 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedIHUBFamilyTypeFor246 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-IHUB-FANT-F-FX4-24.6" || bestType === "LS-FX-IHUB-FANT-F-FX8-24.6" || bestType === "LS-FX-IHUB-FANT-F-FX16-24.6"
        || bestType === "LS-FX-IHUB-FANT-G-FX4-24.6" || bestType === "LS-FX-IHUB-FANT-G-FX8-24.6" || bestType === "LS-FX-IHUB-FANT-G-FX16-24.6"
        || bestType === "LS-FX-IHUB-FANT-H-FX4-24.6" || bestType === "LS-FX-IHUB-FANT-H-FX8-24.6" || bestType === "LS-FX-IHUB-FANT-H-FX16-24.6") {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular IHUB is supported for 24.12 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedIHUBFamilyTypeFor2412 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-IHUB-FANT-F-FX4-24.12" || bestType === "LS-FX-IHUB-FANT-F-FX8-24.12" || bestType === "LS-FX-IHUB-FANT-F-FX16-24.12"
        || bestType === "LS-FX-IHUB-FANT-G-FX4-24.12" || bestType === "LS-FX-IHUB-FANT-G-FX8-24.12" || bestType === "LS-FX-IHUB-FANT-G-FX16-24.12"
        || bestType === "LS-FX-IHUB-FANT-H-FX4-24.12" || bestType === "LS-FX-IHUB-FANT-H-FX8-24.12" || bestType === "LS-FX-IHUB-FANT-H-FX16-24.12"
        || bestType === "LS-FX-IHUB-FANT-M-FX4-24.12" || bestType === "LS-FX-IHUB-FANT-M-FX8-24.12" || bestType === "LS-FX-IHUB-FANT-M-FX16-24.12") {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular shelf NE (FANT) is supported for 21.3 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedFamilyTypeFor213 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-FANT-F-FX4-21.3" || bestType === "LS-FX-FANT-F-FX8-21.3" || bestType === "LS-FX-FANT-F-FX16-21.3"
        || bestType === "LS-FX-FANT-G-FX4-21.3" || bestType === "LS-FX-FANT-G-FX8-21.3" || bestType === "LS-FX-FANT-G-FX16-21.3"
        || bestType === "LS-FX-FANT-H-FX4-21.3" || bestType === "LS-FX-FANT-H-FX8-21.3" || bestType === "LS-FX-FANT-H-FX16-21.3") {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular shelf NE (FANT) is supported for 21.6 release in FX family.
 * */
 AltiplanoUtilities.prototype.isFXSupportedFamilyTypeFor216 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-FANT-F-FX4-21.6" || bestType === "LS-FX-FANT-F-FX8-21.6" || bestType === "LS-FX-FANT-F-FX16-21.6"
        || bestType === "LS-FX-FANT-G-FX4-21.6" || bestType === "LS-FX-FANT-G-FX8-21.6" || bestType === "LS-FX-FANT-G-FX16-21.6"
        || bestType === "LS-FX-FANT-H-FX4-21.6" || bestType === "LS-FX-FANT-H-FX8-21.6" || bestType === "LS-FX-FANT-H-FX16-21.6") {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular shelf NE (FANT) is supported for 21.9 release in FX family.
 * */
 AltiplanoUtilities.prototype.isFXSupportedFamilyTypeFor219 = function (bestType) {
     var isSupported = false;
     if (bestType === "LS-FX-FANT-F-FX4-21.9" || bestType === "LS-FX-FANT-F-FX8-21.9" || bestType === "LS-FX-FANT-F-FX16-21.9"
         || bestType === "LS-FX-FANT-G-FX4-21.9" || bestType === "LS-FX-FANT-G-FX8-21.9" || bestType === "LS-FX-FANT-G-FX16-21.9"
         || bestType === "LS-FX-FANT-H-FX4-21.9" || bestType === "LS-FX-FANT-H-FX8-21.9" || bestType === "LS-FX-FANT-H-FX16-21.9") {
         isSupported = true;
     }
     return isSupported;
}

/**
 * This method used to check whether particular shelf NE (FANT) is supported for 21.12 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedFamilyTypeFor2112 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-FANT-F-FX4-21.12" || bestType === "LS-FX-FANT-F-FX8-21.12" || bestType === "LS-FX-FANT-F-FX16-21.12"
        || bestType === "LS-FX-FANT-G-FX4-21.12" || bestType === "LS-FX-FANT-G-FX8-21.12" || bestType === "LS-FX-FANT-G-FX16-21.12"
        || bestType === "LS-FX-FANT-H-FX4-21.12" || bestType === "LS-FX-FANT-H-FX8-21.12" || bestType === "LS-FX-FANT-H-FX16-21.12") {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular shelf NE (FANT) is supported for 22.3 release in FX family.
 * */
AltiplanoUtilities.prototype.isFXSupportedFamilyTypeFor223 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-FANT-F-FX4-22.3" || bestType === "LS-FX-FANT-F-FX8-22.3" || bestType === "LS-FX-FANT-F-FX16-22.3"
        || bestType === "LS-FX-FANT-G-FX4-22.3" || bestType === "LS-FX-FANT-G-FX8-22.3" || bestType === "LS-FX-FANT-G-FX16-22.3"
        || bestType === "LS-FX-FANT-H-FX4-22.3" || bestType === "LS-FX-FANT-H-FX8-22.3" || bestType === "LS-FX-FANT-H-FX16-22.3") {
        isSupported = true;
    }
    return isSupported;
}


/**
 * This method used to check whether particular shelf NE (FANT) is supported for 22.6 release in FX family.
 * */
 AltiplanoUtilities.prototype.isFXSupportedFamilyTypeFor226 = function (bestType) {
    var isSupported = false;
    if (bestType === "LS-FX-FANT-F-FX4-22.6" || bestType === "LS-FX-FANT-F-FX8-22.6" || bestType === "LS-FX-FANT-F-FX16-22.6"
        || bestType === "LS-FX-FANT-G-FX4-22.6" || bestType === "LS-FX-FANT-G-FX8-22.6" || bestType === "LS-FX-FANT-G-FX16-22.6"
        || bestType === "LS-FX-FANT-H-FX4-22.6" || bestType === "LS-FX-FANT-H-FX8-22.6" || bestType === "LS-FX-FANT-H-FX16-22.6") {
        isSupported = true;
    }
    return isSupported;
}

/**
* This method used to check whether particular shelf NE (FANT) is supported for 22.9 release in FX family.
* */
AltiplanoUtilities.prototype.isFXSupportedFamilyTypeFor229 = function (bestType) {
    var isSupported = false;
    if (intentConstants.LS_FX_SUPPORTED_NT_DEVICES_229.indexOf(bestType) >= 0){
        isSupported = true;
    }
    return isSupported;
}


/**
 * This method is used to check which boards supported by LMNT-A/LMNT-B.
 * */
AltiplanoUtilities.prototype.isMFSupportedLTFamilyTypeFor219 = function (bestType) {
    return this.isMFSupportedLTFamilyType(bestType, "21.9");
}

/**
 * This method is used to check which boards supported by LMNT-A/LMNT-B.
 * */
 AltiplanoUtilities.prototype.isMFSupportedLTFamilyTypeFor2112 = function (bestType) {
    return this.isMFSupportedLTFamilyType(bestType, "21.12");
}

/**
 * This method is used to check which boards supported by LMNT-A/LMNT-B.
 * */
AltiplanoUtilities.prototype.isMFSupportedLTFamilyTypeFor223 = function (bestType) {
    return this.isMFSupportedLTFamilyType(bestType, "22.3");
}

AltiplanoUtilities.prototype.isMFSupportedLTFamilyTypeFor226 = function (bestType) {
    return this.isMFSupportedLTFamilyType(bestType, "22.6");
}

AltiplanoUtilities.prototype.isMFSupportedLTFamilyTypeFor239 = function (bestType) {
    return this.isMFSupportedLTFamilyType(bestType, "23.9");
}

AltiplanoUtilities.prototype.isMFSupportedLTFamilyType = function (bestType, interfaceVersion) {
    var isSupported = false;
    if (bestType === intentConstants.FAMILY_TYPE_LS_MF_LWLT_C.concat("-",interfaceVersion)
        || bestType === intentConstants.FAMILY_TYPE_LS_MF_LGLT_D.concat("-",interfaceVersion)) {
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check whether particular LT is belongs to MF supported.
 */
 AltiplanoUtilities.prototype.isMFSupportedLTFamily = function (family) {
    var isSupported = false;
    if(family.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LWLT_C) || family.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LGLT_D)){
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method used to check the IHUB families that MF supports
 */
 AltiplanoUtilities.prototype.isMFSupportedIHUBFamily = function (family) {
    var isSupported = false;
    if(family.startsWith(intentConstants.FAMILY_TYPE_IHUB_LMNT_A) || family.startsWith(intentConstants.FAMILY_TYPE_IHUB_LMNT_B) || family.startsWith(intentConstants.FAMILY_TYPE_IHUB_LANT_A) || family.startsWith(intentConstants.FAMILY_TYPE_IHUB_LBNT_A_MF14_LMFS_A)){
        isSupported = true;
    }
    return isSupported;
}

/**
 * This method will return list of supported LT board in FX.
 * */
AltiplanoUtilities.prototype.getFXSupportedLTs = function (){
    return [intentConstants.FAMILY_TYPE_LS_FX_FELT_B_DOWNLINK, intentConstants.FAMILY_TYPE_LS_FX_FELT_D_DOWNLINK, intentConstants.FAMILY_TYPE_LS_FX_FGLT_B, intentConstants.FAMILY_TYPE_LS_FX_FWLT_B,intentConstants.FAMILY_TYPE_LS_FX_FWLT_C,intentConstants.FAMILY_TYPE_LS_FX_FGLT_D,intentConstants.FAMILY_TYPE_LS_FX_FGLT_E,intentConstants.FAMILY_TYPE_LS_FX_FGUT_A];
}

AltiplanoUtilities.prototype.getFXDeviceType = function (bestType) {
    if(apUtils.isFXSupportedLTFamily(bestType)) {
        return "LT";
    } else if(bestType.startsWith(intentConstants.FAMILY_TYPE_IHUB)) {
        return "IHUB";
    }
    return "shelfNE";
}

/**
 * Returns true, if the given familyType of device is of Fiber
 * @param familyTypeRelease
 * @returns {boolean}
 */
AltiplanoUtilities.prototype.isFiberType = function (familyTypeRelease) {
    return familyTypeRelease.startsWith(intentConstants.LS_FX_PREFIX) || familyTypeRelease.startsWith(intentConstants.LS_DF_PREFIX) ||  familyTypeRelease.startsWith(intentConstants.LS_MF_PREFIX)
            ||  familyTypeRelease.startsWith(intentConstants.LS_SF_PREFIX);
}

/**
 * Returns true, if the given familyType of device is of Copper
 * @param familyTypeRelease
 * @returns {boolean}
 */
AltiplanoUtilities.prototype.isCopperType = function (familyTypeRelease) {
    return familyTypeRelease.startsWith(intentConstants.LS_DPU_PREFIX) || familyTypeRelease.startsWith(intentConstants.LS_SX_PREFIX)
        ||  familyTypeRelease.startsWith(intentConstants.LS_DX_PREFIX)
        ||  familyTypeRelease.startsWith(intentConstants.LS_MX_PREFIX
        ||  familyTypeRelease.startsWith(intentConstants.SX4F_PREFIX));
}

/**
 * Returns true, if the given familyType of device is of Lightspan
 * @param familyTypeRelease
 * @returns {boolean}
 */
AltiplanoUtilities.prototype.isLightspan = function (familyTypeRelease) {
    return this.isFiberType(familyTypeRelease) || this.isCopperType(familyTypeRelease);
}

/**
 * Getting removed multicast channel list
 * @param deviceName
 * @param topoKey
 * @param currentTopo
 * @param multicastPackages
 * @returns {*}
 */
AltiplanoUtilities.prototype.getRemovedMcastChannelGroup = function(deviceName, topoKey, currentTopo, multicastPackages) {
    var stageArgs = this.getStageArgsFromTopologyXtraInfo(currentTopo, topoKey);
    var oldMcastPack;
    if (stageArgs) {
        var deviceArgs = stageArgs[deviceName];
        oldMcastPack = deviceArgs["multicastPackages"];
    }
    var removedMcastChannelListMapping = {};
    if(multicastPackages) {
        multicastPackages.forEach(function (value) {
            if (oldMcastPack) {
                oldMcastPack.forEach(function (oldMcPack) {
                    if (oldMcPack["name"] == value.name && oldMcPack["multicast-channel-group-list"]) {
                        var removedChannelList = apUtils.compareTwoArrayAndReturnDifference(value["multicast-channel-group-list"], oldMcPack["multicast-channel-group-list"]);
                        if (removedChannelList.length > 0) {
                            removedMcastChannelListMapping[value.name] = removedChannelList;
                        }
                    }
                });
            }
        });
    }
    return removedMcastChannelListMapping;
};

AltiplanoUtilities.prototype.getChannelGroupId = function(ponId) {
        var ponIdParts = ponId.split(".");
        if (ponIdParts.length != 2) {
            throw new RuntimeException("Incorrect Channel Pair Id: " + ponId);
        }
        var slotId = ponIdParts[0].replace("LT","");
        var channelPairId = ponIdParts[1].replace("PON","");
        var channelGroupId = (parseInt(slotId)-1)* 16 + parseInt(channelPairId);
        return channelGroupId;
    }

/**
 * Evaluate GPON serial number from DUID given in device
 * @param duid
 * @param enterpriseJson ("enterprise number/vendor code" mapping from *.JSON provided with intent)
 * @return serialNumber
 * logic:
 * IF (duid does not follow the pattern "[0..9]*-[0..9]*"), return '';
   ELSE, split the duid on '-';
         -> IF (the second part of the splitted duid is made of 4 letters followed by 8 numbers)
           THEN, return the second part of the splitted duid;
         -> ELSE, look up the first part of the splitted duid in the "iana-enterprise-number" JSON given;
                   -> IF (an entry is found in the table), THEN return prefix + suffix;
                     where :{ prefix = value of the corresponding "omci-vendor-code" column
                               suffix = hexadecimal value of the second part of the splitted duid, converted to upper case}
   In all other cases, return undefined
 */
AltiplanoUtilities.prototype.computeGponSerialNumber = function(duid, enterpriseJson){
    var serialNumber;
    if(/[0-9]*-[0-9]*/.test(duid)){
        var duidPart = duid.split("-");
        if(duidPart[1].length === 12 && /([A-Z]){4}([0-9]){8}/.test(duidPart[1])){
            serialNumber = duidPart[1];
        }else if (enterpriseJson){
            if(enterpriseJson[duidPart[0]] && /^[0-9]+$/.test(duidPart[1])){
                serialNumber = enterpriseJson[duidPart[0]].concat((parseInt(duidPart[1],10).toString(16)).toUpperCase());
            }
        }else{
            logger.error("JSON for mapping enterprise number should be given, when DUID {} doesn't match regEx 4 letters followed by 8 numbers", duid);
        }
    }
    return serialNumber;
}

/**
 * Fetches computed GPON serial number if DUID is provided
 * @param duid
 * @param enterpriseJsonFilePath, ex: "enterprise-vendor-code.json"
 * @returns {serialNumber}
 */
AltiplanoUtilities.prototype.fetchGponSerialNumberFromDuid = function(duid, enterpriseJsonFilePath){
    if(duid){
        var enterpriseCodeJson = JSON.parse(resourceProvider.getResource(enterpriseJsonFilePath));
        return this.computeGponSerialNumber(duid, enterpriseCodeJson);
    }
}

/**
 * Setting the default value for source-ipvx-network if applicable
 * @param enFilters enhanced-filters
 */
AltiplanoUtilities.prototype.setDefaultSourceIpvxNetwork = function(enFilters){
    Object.keys(enFilters).forEach(function(enFilter) {
        if(enFilters[enFilter]["filter-operation"] === "bbf-qos-cls:match-all-filter" && enFilters[enFilter]["filter"]) {
            Object.keys(enFilters[enFilter]["filter"]).forEach(function(filter) {
                var filterOption = enFilters[enFilter]["filter"][filter];
                if((filterOption["ipv4"] && !filterOption["ipv4"]["source-ipv4-network"] && !filterOption["ipv4"]["destination-ipv4-network"]) ||
                    (filterOption["ipv6"] && !filterOption["ipv6"]["source-ipv6-network"] && !filterOption["ipv6"]["destination-ipv6-network"])) {
                    if(filterOption["ipv4"]) {
                        var ipvDefault = "0.0.0.0/0";
                    } else {
                        ipvDefault = "00::/0";
                    }
                    var ipCommon = filterOption["ip-common"] && (filterOption["ip-common"]["dscp-range"] || filterOption["ip-common"]["protocol"]);
                    if(ipCommon) {
                        enFilters[enFilter]["filter"][filter]["defaultSource"] = ipvDefault;
                    } else {
                        var transport = filterOption["transport"];
                        var sourcePortRange = transport && transport["source-port-range"] && (transport["source-port-range"]["lower-port"] || transport["source-port-range"]["upper-port"]);
                        var destinationPortRange = transport && transport["destination-port-range"] && (transport["destination-port-range"]["lower-port"] || transport["destination-port-range"]["upper-port"]);
                        if(sourcePortRange || destinationPortRange) {
                            enFilters[enFilter]["filter"][filter]["defaultSource"] = ipvDefault;
                        }
                    }
                }
            });
        }
    });
}

/**
 * Returns the planned type for the provided LT from ES
 * @param deviceName EX : ShelfName
 * @param ltSlotNumber EX : LT1
 * @returns ltPlannedType
 */
AltiplanoUtilities.prototype.getLtPlannedTypeFromEs = function (deviceName, ltSlotNumber) {
    var esQueryKey = "esQueryKey_getLtPlannedTypeFromEs_" + deviceName + "_" + ltSlotNumber;
    if(apUtils.getContentFromIntentScope(esQueryKey)){
        return apUtils.getContentFromIntentScope(esQueryKey);
    }else{
        var plannedType = null;
        var object = {};
        var mustArray = [];
        var labelObject = {"term": {"label": "Physical Equipment"}};
        var deviceTerm = {"term": {"target.device-name.keyword": deviceName}};
        mustArray.push(labelObject);
        mustArray.push(deviceTerm);
        var mustNotArray = [];
        var unsupportedLabelObject = {"term": {"label": "Slicing"}};
        mustNotArray.push(unsupportedLabelObject);
        var rootObject = {"bool": {"must": mustArray,  "must_not": mustNotArray}};
        object["query"] = rootObject;
        object["from"] = 0;
        object["size"] = 1;
        object["_source"] = ["target.device-name", "configuration.hardware-type", "configuration.device-version", "nested-lists.slot-name", "nested-lists.planned-type"];
        var response = apUtils.executeEsIntentSearchRequest(JSON.stringify(object));
        if (apUtils.isResponseContainsData(response)) {
            response.hits.hits.forEach(function (intentResult) {
                if (intentResult["_source"]["nested-lists"] !== undefined) {
                    for (var i = 0; i < intentResult["_source"]["nested-lists"].length; i++) {
                        if (intentResult["_source"]["nested-lists"][i]["slot-name"] == ltSlotNumber) {
                            plannedType = intentResult["_source"]["nested-lists"][i]["planned-type"];
                            break;
                        }
                    }
                }
            });
        }
        apUtils.storeContentInIntentScope(esQueryKey, plannedType);
        return plannedType;
    }    
};
AltiplanoUtilities.prototype.createGroupAndItsParent = function (mObject, groupName) {
    var groupNameArr = groupName.split("/");
    var groupTreeLength = groupNameArr.length;
    if (groupTreeLength > 1) {
        var groupTreeName = groupNameArr[0];
        for (var i = 1; i < groupTreeLength; i++) {
            var parentGroup = groupTreeName;
            groupTreeName = groupTreeName + "/" + groupNameArr[i];
            try {
                mObject.createNeGroup(groupTreeName);
            }
            catch (e) {
                if (e.message && e.message.contains("Name already exists")){
                    logger.warn('"' + groupNameArr[i] + '" already exists in group ' + parentGroup + e);
                } else {
                    throw new RuntimeException("Error while creating group ", e);
                }
            }
        }
    }
}

AltiplanoUtilities.prototype.deleteGroupAndItsParent = function (mObject, groupName) {
    var groupNameArr = groupName.split("/");
    var groupTreeLength = groupNameArr.length;
    if (groupTreeLength > 1){
        for (var i = groupTreeLength; i > 1; i--) {
            var groupTreeName = groupNameArr.join("/");
            try {
                mObject.deleteNeGroup(groupTreeName);
            } catch (e) {
                logger.error("Cannot delete group ", e);
            }
            groupNameArr.pop();
        }
    }
}
/**
 * @param leafName, leafname for which error needs to be thrown,
 *                entry for this leafName should be present in intentYangLeafNameMap
 * @param errorMsg, message which has to be suffixed with Leaf name against which error needs to be thrown
 * @param intentYangLeafNameMap, an Object which as leaf entries with their display name in intent's yang.
 *         ex: var yangLeaves = {
                     "service-profile": "Service Profile",
                     "list#static-ipv4-address": "IPv4 Anti-Spoofing",
                     "leaf#address": "Address"
               }
 * @returns {String: leaf name as described in intent yang followed by message given}
 */
AltiplanoUtilities.prototype.getProperRuntimeErrorWithLeafName = function (leafName, errorMsg, intentYangLeafNameMap) {
    var errorKey;
    if(leafName.split(",").length === 3){
        var errorKeys = leafName.split(",");
        errorKey = ( intentYangLeafNameMap[errorKeys[0]] && intentYangLeafNameMap[errorKeys[2]])?
            "Table '".concat(intentYangLeafNameMap[errorKeys[0]],"', row '",errorKeys[1],"', column '",intentYangLeafNameMap[errorKeys[2]],"'")
            : "Error in [" +leafName+ "]";
    }else{
        errorKey = intentYangLeafNameMap[leafName]? intentYangLeafNameMap[leafName] : "Error in [" +leafName+ "]";
    }
    return errorKey.concat(" : ",errorMsg);
}

/**
 * Execute the given template with arguments
 * @param resourceFile template
 * @param templateArgs arguments list
 */

AltiplanoUtilities.prototype.executeRequest = function (resourceFile, templateArgs) {
    var requestTemplate = resourceProvider.getResource(resourceFile);
    var requestXml = utilityService.replaceVariablesInXmlTemplate(requestTemplate, templateArgs);
    var fwk = requestScope.get().get("xFWK");
    fwk.executeRequest(requestXml, null, templateArgs.deviceID);
}

/**
 * Returns an ONT vendor name based on given serialNumber
 * @param serialNumber - serial number of an ONT
 */

AltiplanoUtilities.prototype.getOntVendorName = function (serialNumber, ontVendorJson) {
    if (serialNumber && ontVendorJson) {
        var ontVendorObjects = ontVendorJson["ont-vendor-detection"];
        for (var i = 0; i < ontVendorObjects.length; i++) {
            var regExpObj = new RegExp(ontVendorObjects[i]["pattern-regex"]);
            if (ontVendorObjects[i]["name"] != "Default" && regExpObj.test(serialNumber)) {
                return ontVendorObjects[i]["name"];
            }
        }
    }
    return "Default";
}

/**
 * Returns a valid eONU template name based on given ONT vendor name and ont-type details
 * @param ontDetails - JSON detail of ONT type corresponds to ONT-Type selected in the ONT intent
 * @param ontVendorName
 */

AltiplanoUtilities.prototype.getOntTemplateName = function (ontDetails, ontVendorName) {
    if (ontVendorName != "Default" && ontDetails["template-for-ont-vendor"] && ontDetails["template"]){
        for (var i = 0; i < ontDetails["template-for-ont-vendor"].length; i++ ) {
            if(ontDetails["template-for-ont-vendor"][i]["ont-vendor-name"] === ontVendorName) {
                return ontDetails["template-for-ont-vendor"][i]["ont-vendor-template"];
            }
        }
        return ontDetails["template"];
    }
    else{
        return ontDetails["template"];
    }
}

/**
 * Returns whether the device provided is a Lightspan Fiber Device or not
 * @param deviceName
 * @returns {boolean}
 */
AltiplanoUtilities.prototype.isLsFiberDevice = function (deviceName) {
    var isLsFiberDevice = false;
    var nwSlicingUserType = this.getNetworkSlicingUserType();
    if (nwSlicingUserType === intentConstants.NETWORK_SLICING_USER_TYPE_SLICE_OWNER) {
        isLsFiberDevice = true;
    } else {
        var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
        if (nodeType != null && (nodeType.startsWith(intentConstants.LS_FX_PREFIX) || nodeType.startsWith(intentConstants.LS_MF_PREFIX) || nodeType.startsWith(intentConstants.LS_SF_PREFIX) ||
            nodeType.startsWith(intentConstants.LS_DF_PREFIX))) {
            isLsFiberDevice = true;
        }
    }
    return isLsFiberDevice;
};

/**
 * FNMS-86119 from 21.6 the upstream-pbit flag has been removed from JSON customization
 * still not handled in XSLT trasformation from 21.3 -> 21.6 for dei
 * Reverse engineering the upstream-bit from classifier for applying it to dei
 * To avoid the ONU template changes via 21.6-intents
 */
AltiplanoUtilities.prototype.isPbitOverriding = function (classifier, qosPolicyUpstreamPbitMap, eonuQosForService) {
    if (classifier && classifier["classifier-action-entry-cfg"][0]["action-type"] && classifier["classifier-action-entry-cfg"][0]["action-type"].indexOf("pbit-marking") >= 0
        && classifier["classifier-action-entry-cfg"][0]["pbit-marking-cfg"]["pbit-marking-list"][0]["pbit-value"]
        && classifier["match-criteria"] && classifier["match-criteria"]["tag"] && classifier["match-criteria"]["tag"]["in-pbit-list"]) {
        if(classifier["classifier-action-entry-cfg"][0]["pbit-marking-cfg"]["pbit-marking-list"][0]["pbit-value"] !== classifier["match-criteria"]["tag"]["in-pbit-list"]) {
            qosPolicyUpstreamPbitMap[eonuQosForService] = "true";
        }
    }
}

/**
 * FNMS-86119 from 21.6-release: The QOS/Policy/Classifiers used by individual eonu Templates are pushed in to template root
 * not all the QOS profiles and its relevant Policy/Classifiers as before 21.3-release
 * This is due to the XSLT transformation limitations between 21.3 -> 21.6
 *
 * FNMS-104735 from 22.6-release: if onu-template hasProperty "profiles-restricted-to-only-used" and set to true then only use lock/Qos Profile are created in ONU template
 * otherwise by default all lock/Qos Profile will be created in ONU template irrespective of whether used or not
 *
 * @param onuTemplates ONU template JSON
 * @param eOnuArgs eonu all Qos/Policy/Classifiers profiles in map
 * @param cloneQosProfiles eonu all Qos/Policy/Classifiers profiles from JSON resource
 * @returns map (key as template name, value as qos/policy/classifier for that template)
 */
AltiplanoUtilities.prototype.getQosProfilesForEonuTemplate = function (onuTemplates, eOnuArgs, eonuQosProfilesJSON, transportVoipSipProfiles, ontProfilesGroup, ltDeviceTopology) {
    var classifierMap = {};
    eonuQosProfilesJSON["classifiers"].forEach(function(classifier) {
        classifierMap[classifier.name] = classifier;
    });
    var onuUsedQosProfiles = {};
    var qosPolicyUpstreamPbitMap = {};
    onuTemplates["onu-template"].forEach(function (onuTemplate) {
        var onuQosProfiles = {};
        var eonuQos = [];
        var eonuPolicies = [];
        var eonuClassifiers = [];
        var eonuQosProfiles = [];

        // Add referred QoS profiles in ONU templates
        if (onuTemplate["service"]) {
            onuTemplate["service"].forEach(function (service) {
                var eonuQosForService = service["subscriber-ingress-qos-profile-id"];
                if (eonuQosForService) {
                    eonuQosProfiles.push(eonuQosForService);
                }
            });
        }
        // Add QoS profiles defined in ONT Profiles Group
        if (onuTemplate["ont-profiles-group-id"] && onuTemplate["ont-profiles-group-id"] != null && ontProfilesGroup) {
            ontProfilesGroup.forEach(function (profileGroup) {
                if (profileGroup && profileGroup["name"] == onuTemplate["ont-profiles-group-id"] && profileGroup["qos-policy-profiles"]) {
                    profileGroup["qos-policy-profiles"].forEach(function (qosPolicyProfile) {
                        if (eonuQosProfiles.indexOf(qosPolicyProfile) == -1) {
                            eonuQosProfiles.push(qosPolicyProfile);
                        }
                    });
                }
            });
        }
        eonuQosProfiles.forEach(function (eonuQosProfile) {
            if(eonuQosProfile && eonuQos.indexOf(eonuQosProfile) === -1) {
                eonuQos.push(eonuQosProfile);
                if (eOnuArgs["eOnu_qos-policy-profiles"][eonuQosProfile]) {
                    var policiesForQos = Object.keys(eOnuArgs["eOnu_qos-policy-profiles"][eonuQosProfile]["policy-list"]);
                    policiesForQos.forEach(function (policyForQos) {
                        if (eonuPolicies.indexOf(policyForQos) === -1) {
                            eonuPolicies.push(policyForQos);
                            var classifiersForPolicy = Object.keys(eOnuArgs["eOnu_policies"][policyForQos]["classifiers"]);
                            classifiersForPolicy.forEach(function (classifierForPolicy) {
                                if (eonuClassifiers.indexOf(classifierForPolicy) === -1) {
                                    eonuClassifiers.push(classifierForPolicy);
                                }
                                if (!qosPolicyUpstreamPbitMap[eonuQosProfile]) {
                                    apUtils.isPbitOverriding(classifierMap[classifierForPolicy], qosPolicyUpstreamPbitMap, eonuQosProfile);
                                }
                            });
                        }
                    });
                }
            }
        });

        onuTemplate["service"].forEach(function(service) {
            var eonuQosForService = service["subscriber-ingress-qos-profile-id"];
            if (qosPolicyUpstreamPbitMap[eonuQosForService]) {
                service["isPbitOverriding"] = qosPolicyUpstreamPbitMap[eonuQosForService];
            }
        });

        if(transportVoipSipProfiles && transportVoipSipProfiles["transport-voip-sip"] && onuTemplate["transport-voip-sip"]) {
            if(onuTemplate["transport-voip-sip"]["name"]) {
                var transportVoipSipConfig = transportVoipSipProfiles["transport-voip-sip"].filter(function(transportVoipSipProfile) {
                    return transportVoipSipProfile["name"] == onuTemplate["transport-voip-sip"]["name"];
                });
                if(transportVoipSipConfig && transportVoipSipConfig[0] && transportVoipSipConfig[0]["subscriber-ingress-qos-profile-id"]) {
                    var eonuQosForService = transportVoipSipConfig[0]["subscriber-ingress-qos-profile-id"];
                    if(eonuQosForService && eonuQos.indexOf(eonuQosForService) === -1) {
                        eonuQos.push(eonuQosForService);
                        var policiesForQos = Object.keys(eOnuArgs["eOnu_qos-policy-profiles"][eonuQosForService]["policy-list"]);
                        policiesForQos.forEach(function(policyForQos) {
                            if(eonuPolicies.indexOf(policyForQos) === -1) {
                                eonuPolicies.push(policyForQos);
                                var classifiersForPolicy = Object.keys(eOnuArgs["eOnu_policies"][policyForQos]["classifiers"]);
                                classifiersForPolicy.forEach(function(classifierForPolicy) {
                                    if(eonuClassifiers.indexOf(classifierForPolicy) === -1) {
                                        eonuClassifiers.push(classifierForPolicy);
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }
        // Get qos-policy-profile, policy-profile and classifiers details
        if (ltDeviceTopology && ltDeviceTopology["onuUsedQosProfiles"] && ltDeviceTopology["onuUsedQosProfiles"][onuTemplate.name]
            && Array.isArray(ltDeviceTopology["onuUsedQosProfiles"][onuTemplate.name]["eonuQosPolicyProfiles"])
            && Array.isArray(ltDeviceTopology["onuUsedQosProfiles"][onuTemplate.name]["eonuPolicies"])
            && Array.isArray(ltDeviceTopology["onuUsedQosProfiles"][onuTemplate.name]["eonuClassifier"])) {
            var qosPolicyProfileNamesFromTopo = ltDeviceTopology["onuUsedQosProfiles"][onuTemplate.name]["eonuQosPolicyProfiles"];
            if (qosPolicyProfileNamesFromTopo) {
                onuQosProfiles["eonuQosPolicyProfiles"] = apUtils.computeRemovedAttribute(qosPolicyProfileNamesFromTopo, eOnuArgs["eOnu_qos-policy-profiles"], eonuQos);
            }
            var policyNamesFromTopo = ltDeviceTopology["onuUsedQosProfiles"][onuTemplate.name]["eonuPolicies"];
            if (policyNamesFromTopo) {
                onuQosProfiles["eonuPolicies"] = apUtils.computeRemovedAttribute(policyNamesFromTopo, eOnuArgs["eOnu_policies"], eonuPolicies);
            }
            var classifierNamesFromTopo = ltDeviceTopology["onuUsedQosProfiles"][onuTemplate.name]["eonuClassifier"];
            if (classifierNamesFromTopo && eonuClassifiers && eonuClassifiers.length > 0) {
                onuQosProfiles["eonuClassifier"] = apUtils.computeRemovedAttribute(classifierNamesFromTopo, eOnuArgs["eOnu_classifiers"], eonuClassifiers);
            }
        } else {
            if (eonuQos && eonuQos.length > 0) {
                onuQosProfiles["eonuQosPolicyProfiles"] = {};
                eonuQos.forEach(function (qosProfileName) {
                    if (eOnuArgs && eOnuArgs["eOnu_qos-policy-profiles"] && Object.keys(eOnuArgs["eOnu_qos-policy-profiles"]).indexOf(qosProfileName) != -1) {
                        onuQosProfiles["eonuQosPolicyProfiles"][qosProfileName] = {"name": eOnuArgs["eOnu_qos-policy-profiles"][qosProfileName]["name"] };
                    }
                });
            }
            if (eonuPolicies && eonuPolicies.length > 0) {
                onuQosProfiles["eonuPolicies"] = {};
                eonuPolicies.forEach(function (policyName) {
                    if (eOnuArgs && eOnuArgs["eOnu_policies"] && Object.keys(eOnuArgs["eOnu_policies"]).indexOf(policyName) != -1) {
                        onuQosProfiles["eonuPolicies"][policyName] = {"name": eOnuArgs["eOnu_policies"][policyName]["name"] };
                    }
                });
            }
            if (eonuClassifiers && eonuClassifiers.length > 0) {
                onuQosProfiles["eonuClassifier"] = {};
                eonuClassifiers.forEach(function (classifierName) {
                    if (eOnuArgs && eOnuArgs["eOnu_classifiers"] && Object.keys(eOnuArgs["eOnu_classifiers"]).indexOf(classifierName) != -1) {
                        onuQosProfiles["eonuClassifier"][classifierName] =  {"name": eOnuArgs["eOnu_classifiers"][classifierName]["name"] };
                    }
                });
            }
        }
        onuUsedQosProfiles[onuTemplate.name] = onuQosProfiles;
    });
    logger.debug("Used and Referred QOS/Policy/Classifier profiles in ONT Profiles Group for individual template " + JSON.stringify(onuUsedQosProfiles));
    return onuUsedQosProfiles;
}

AltiplanoUtilities.prototype.getCfmProfilesForEonuTemplate = function (onuTemplates, eonuCfmProfilesJSON) {
	var onuUsedCfmProfiles = {};
	onuTemplates["onu-template"].forEach(function (onuTemplate) {
		var cfmProfileUsed = {};
		if(onuTemplate["cfm-profiles"] && onuTemplate["cfm-profiles"]["name"]){
			var cfmProfileUsedName = onuTemplate["cfm-profiles"]["name"];
			var cfmProfileMatchedInOnuTemplate = false;
			eonuCfmProfilesJSON["cfm-profile"].forEach(function (cfmProfile) {
				if(cfmProfile.name == cfmProfileUsedName){
					cfmProfileUsed["cfmProfile"] = cfmProfile;
					cfmProfileMatchedInOnuTemplate = true;
				}
			});
			if(!cfmProfileMatchedInOnuTemplate){
			    throw new RuntimeException("Invalid Configuration: The configured CFM profile "+cfmProfileUsedName+" is not available in CfmProfile json" );
			}
			cfmProfileUsed["maintenanceDomainProfile"] = [];
			cfmProfileUsed["maintenanceAssociationProfile"] = [];
			cfmProfileUsed["maintenanceEndpointProfile"] = [];
			eonuCfmProfilesJSON["ma-domain-profile"].forEach(function (madomainprofile) {
				cfmProfileUsed["maintenanceDomainProfile"].push(madomainprofile);
			});
			eonuCfmProfilesJSON["ma-association-profile"].forEach(function (maAssociationprofile) {
				cfmProfileUsed["maintenanceAssociationProfile"].push(maAssociationprofile);
			});
			eonuCfmProfilesJSON["ma-endpoint-profile"].forEach(function (maendpointprofile) {
				cfmProfileUsed["maintenanceEndpointProfile"].push(maendpointprofile);
			});			
			onuUsedCfmProfiles[onuTemplate.name] = cfmProfileUsed;
		}		
	});
	return onuUsedCfmProfiles;
}

/**
 * 
 * @param {*} onuTemplates 
 * @param {*} eonucfmOntProfilesJSON 
 * @param {*} eonuCfmProfilesJSON 
 * @param {*} onuTemplateWithCfmProfileRestrictions, list of onu templates will not support cfm feature
 * 
 * @returns 
 */
AltiplanoUtilities.prototype.getCfmProfilesForEonuTemplate223 = function (onuTemplates, eonucfmOntProfilesJSON, eonuCfmProfilesJSON, onuTemplateWithCfmProfileRestrictions) {
    var onuUsedCfmProfiles = {};
    if (!onuTemplates["onu-template"]) return onuUsedCfmProfiles;
    onuTemplates["onu-template"].forEach(function (onuTemplate) {
        var cfmProfileUsed = {};
        if(!(onuTemplate.name && onuTemplateWithCfmProfileRestrictions && 
            typeof onuTemplateWithCfmProfileRestrictions.push === "function" && 
            onuTemplateWithCfmProfileRestrictions.indexOf(onuTemplate.name) !== -1) && 
            onuTemplate["cfm-profiles"] && onuTemplate["cfm-profiles"]["name"]){
            var cfmProfileUsedName = onuTemplate["cfm-profiles"]["name"];
            var cfmProfileMatchedInOnuTemplate = false;
            if (eonucfmOntProfilesJSON) {
                var cloneEonuCfmOntProfilesJSON = JSON.parse(JSON.stringify(eonucfmOntProfilesJSON))
                if (cloneEonuCfmOntProfilesJSON["cfm-profile"]) {
                    cloneEonuCfmOntProfilesJSON["cfm-profile"].forEach(function (cfmProfile) {
                        if(cfmProfile.name == cfmProfileUsedName){
                            cfmProfileUsed["cfmProfile"] = cfmProfile;
                            if (cfmProfile && cfmProfile["maintenance-domain"]) {
                                var maintenanceDomain = cfmProfile["maintenance-domain"];
                                if (maintenanceDomain && maintenanceDomain.length > 0) {
                                    maintenanceDomain.forEach(function(domain){
                                        if(domain["ma"] && domain["ma"]["maintenance-association"] && 
                                            domain["ma"]["maintenance-association"].length > 0) {
                                            domain["ma"]["maintenance-association"].forEach(function(association){
                                                var mepMap = {};
                                                if (association["mep"] && association["mep"]["maintenance-association-mep"] && 
                                                    association["mep"]["maintenance-association-mep"].length > 0) {
                                                    association["mep"]["maintenance-association-mep"].forEach(function(mep) {
                                                        var mepId = mep["mep-id"];
                                                        mepMap[mepId] = {"mep-id" : mepId};
                                                        apUtils.formatStringAttributeToObject(mep, "mep-id");
                                                    })
                                                }
                                                association["mepMap"] = mepMap;
                                            });
        
                                        }
                                    })
                                }
        
                            }
                            cfmProfileMatchedInOnuTemplate = true;
                        }
                    });
                }

            }
            if(!cfmProfileMatchedInOnuTemplate){
                throw new RuntimeException("Invalid Configuration: The configured CFM profile "+cfmProfileUsedName+" is not available in CfmProfile json" );
            }
            cfmProfileUsed["maintenanceDomainProfile"] = [];
            cfmProfileUsed["maintenanceAssociationProfile"] = [];
            cfmProfileUsed["maintenanceEndpointProfile"] = [];
            if (eonuCfmProfilesJSON) {
                if (eonuCfmProfilesJSON["ma-domain-profile"]) {
                    eonuCfmProfilesJSON["ma-domain-profile"].forEach(function (madomainprofile) {
                        cfmProfileUsed["maintenanceDomainProfile"].push(madomainprofile);
                    });
                }
                if (eonuCfmProfilesJSON["ma-association-profile"]) {
                    eonuCfmProfilesJSON["ma-association-profile"].forEach(function (maAssociationprofile) {
                        cfmProfileUsed["maintenanceAssociationProfile"].push(maAssociationprofile);
                    });
                }
                if (eonuCfmProfilesJSON["ma-endpoint-profile"]) {
                    eonuCfmProfilesJSON["ma-endpoint-profile"].forEach(function (maendpointprofile) {
                        cfmProfileUsed["maintenanceEndpointProfile"].push(maendpointprofile);
                    });
                }
            }
            onuUsedCfmProfiles[onuTemplate.name] = cfmProfileUsed;
        }
    });
    return onuUsedCfmProfiles;
}


/**
 *
 * @param {String} tcontName
 * @param {Array} tcontProfiles
 * @return {Object} TCONT profile base on tcontName
 */
AltiplanoUtilities.prototype.getTcontConfig = function (tcontName, tcontProfiles) {
    tcontProfiles = this.convertToTcontQueueSharingFromTcontSharingEnum(tcontProfiles);
    for (var tcontIdx in tcontProfiles) {
        if (tcontProfiles[tcontIdx]["name"] === tcontName) {
            return tcontProfiles[tcontIdx];
        }
    }
}

/**
 * Get TCONT Profile base on name and add TCONT detail to tcontConfigs
 * @param {Array} tcontConfigs 
 * @param {Array} tcontProfiles 
 */
AltiplanoUtilities.prototype.processTcont = function (tcontConfigs, tcontProfiles) {
    for (var tcontConfigIdx in tcontConfigs) {
        var tcontConfig = tcontConfigs[tcontConfigIdx];
        var tcontConfigDetail = apUtils.getTcontConfig(tcontConfig["tcont-profile-id"], tcontProfiles);
        tcontConfig["tcontConfigDetail"] = tcontConfigDetail;
    }
}
/**
 * FNMS-119287: support the backward compatibility, in old release, some tcont configs don't contain traffic
 * class, it will be converted to "traffic-class" : "from-qos-profiles" so that can be used in profiles manager.
 * But our code already supported tcont-configs without class, so need to delete this "traffic-class" : "from-qos-profiles"
 * internally
 * @param {Array} tcontConfig 
 */
AltiplanoUtilities.prototype.processBackwardCompatibilityTcontConfig = function (tcontConfig) {
    if (tcontConfig && typeof tcontConfig.push === "function" && tcontConfig.length > 0) {
        for (var i = 0; i < tcontConfig.length; i++) {
            var tcont = tcontConfig[i];
            if (tcont["traffic-class"] && tcont["traffic-class"] === "from-qos-profiles") {
                delete tcontConfig[i]["traffic-class"];
            }
        }
    }
}

/**
 * 
 * @param {Array} onuTemplate 
 * @param {Array} tcontProfiles 
 */
AltiplanoUtilities.prototype.processTcontOnuTemplate = function (onuTemplate, tcontProfiles) {
    for (var templateIdx in onuTemplate) {
        var services = onuTemplate[templateIdx]["service"];
        var flexibleTcontSharing = onuTemplate[templateIdx]["flexible-tcont-sharing"];
        for (var serviceIdx in services) {
            var service = services[serviceIdx];
             if (flexibleTcontSharing && flexibleTcontSharing == "false" && service["tcont-config"] && service["tcont-config"].length > 1){
                 var trafficClassSet = new HashSet();
                for (var tcontConfigIdx in service["tcont-config"]) {
                    var tcontConfig = service["tcont-config"][tcontConfigIdx];
                    if (tcontConfig["traffic-class"] && trafficClassSet.contains(tcontConfig["traffic-class"])) {
                        throw new RuntimeException("flexible-tcont-sharing attribute is disabled for "+service["name"]+" service in "+onuTemplate[templateIdx]["name"]+" template , so only different Traffic Class for each tcont-config is allowed");
                    } else if (tcontConfig["traffic-class"]){
                        trafficClassSet.add(tcontConfig["traffic-class"]);
                    }
                }
            }
            if (service["tcont-config"]) {
                apUtils.processTcont(service["tcont-config"], tcontProfiles);
            }
        }
    }
}



/**
 * FNMS-139856, support multiple gemport
 * The traffic class for gemport will be defined as an array.
 * if the traffic class array are not defined, it will be retrieved from tc-id-2-queue-id-mapping-profile
 * There can be many gemports but only one tcont.
 * @param {*} onuTemplates list of onu-templates profiles
 * @param {*} transportVoipSipProfiles list of transport-voip-sip-profiles
 * @param {*} tcontProfiles list of tcont-profiles
 * @param {*} tcId2QueueIdMappingProfiles list of tc-id-to-queue-id-mapping-profiles
 * @returns 
 */
AltiplanoUtilities.prototype.processVoipSipTcontsAndGemports = function (onuTemplates, transportVoipSipProfiles, tcontProfiles, tcId2QueueIdMappingProfiles) {
    if (!onuTemplates || !tcontProfiles || !transportVoipSipProfiles) return;
    var transportVoipSipProfileMap = apUtils.convertArrayObjectToMap(transportVoipSipProfiles, "name");
    var tcontProfileMap = apUtils.convertArrayObjectToMap(tcontProfiles, "name");
    function getTcId2QueueIdMappingProfile(tcId2QueueIdMappingProfileMap, tc2QueueMappingProfileId) {
        if (tcId2QueueIdMappingProfileMap && tc2QueueMappingProfileId && tcId2QueueIdMappingProfileMap[tc2QueueMappingProfileId] &&
            tcId2QueueIdMappingProfileMap[tc2QueueMappingProfileId]["mapping-entry"]) {
            return tcId2QueueIdMappingProfileMap[tc2QueueMappingProfileId]["mapping-entry"];
        }
    }
    function computeVoipTcontOrGemportName(trafficClass, voipCCName, isTcont) {
        if (trafficClass === undefined) {
            throw new RuntimeException("Missing Traffic Class for VOIP TCONT and GEMPORT computation");
        }
        if (!voipCCName) {
            throw new RuntimeException("Missing VoIP CC Name for VOIP TCONT and GEMPORT computation");
        }
        if (isTcont) {
            return ["TCONT" + (Number(trafficClass) + 1), voipCCName].join("_");
        }
        return ["GEM" + (Number(trafficClass) + 1), voipCCName].join("_");

    }
    function computeTcont(name, itfReference, tc2QueueMappingProfileId, queues) {
        var tcont = {};
        tcont.name = name;
        tcont["interface-reference"] = itfReference;
        tcont["tc-id-2-queue-id-mapping-profile-name"] = tc2QueueMappingProfileId;
        tcont.queues = queues;
        return tcont;
    }

    function computeTconts(tconts, tcontName, computedTrafficClasses, voipCCName, tc2QueueMappingProfileId, queues) {
        if (!tconts) return;
        if (!tcontName && computedTrafficClasses && computedTrafficClasses.length > 0) {
            var tcontName = computeVoipTcontOrGemportName(computedTrafficClasses[0]["traffic-class-id"], voipCCName, true);
            var queueMap = apUtils.convertArrayObjectToMap(queues, "local-queue-id")
            var tcont = computeTcont(tcontName, "ANI", tc2QueueMappingProfileId, queueMap);
            tconts[tcontName] = tcont;
        }
        return tcontName;
    }
    function computeGemport(name, voipCCName, trafficClass, tcontName) {
        var gemPort = {};
        gemPort.name = name;
        gemPort["traffic-class"] = trafficClass;
        gemPort["tcont-ref"] = tcontName;
        gemPort["interface"] = "VSI_" + voipCCName;
        return gemPort;
    }
    function computeGemports(gemports, voipCCName, tcontName, trafficClasses) {
        if (!gemports) return;
        for (var key in trafficClasses) {
            var trafficClass = trafficClasses[key]["traffic-class-id"];
            var gemportName = computeVoipTcontOrGemportName(trafficClass, voipCCName);
            var gemport = computeGemport(gemportName, voipCCName, trafficClass, tcontName);
            gemports[gemport.name] = gemport;
        }
    }
    function computeTrafficClasses(tcontProfileName, tcId2QueueIdMappingProfile, tc2QueueMappingProfileId, trafficClasses) {
        var computedTrafficClasses = [];
        if (trafficClasses && trafficClasses.length > 0) {
            var undefinedTCs = [];
            for (var i = 0; i < trafficClasses.length; i++) {
                if (apUtils.ifObjectIsEmpty(tcId2QueueIdMappingProfile) || !tcId2QueueIdMappingProfile[trafficClasses[i]]) {
                    undefinedTCs.push(trafficClasses[i]);
                    continue;
                }
                computedTrafficClasses.push(tcId2QueueIdMappingProfile[trafficClasses[i]]);
            }
            if (undefinedTCs && undefinedTCs.length > 0) {
                throw new RuntimeException("Traffic Class '[" + undefinedTCs + "]' of TCONT Profile '" + tcontProfileName + "' are not defined in Traffic Class-ID to Queue-ID Mapping Profile '" + tc2QueueMappingProfileId + "'.");
            }
        }
        return computedTrafficClasses;
    }
    for (var key in onuTemplates) {
        var onuTemplate = onuTemplates[key];
        var tcId2QueueIdMappingProfileMap = tcId2QueueIdMappingProfiles;
        if (!onuTemplate || !onuTemplate["transport-voip-sip"] || !onuTemplate["transport-voip-sip"]["name"]) continue;
        var transportVoipSipName = onuTemplate["transport-voip-sip"]["name"];
        if (!transportVoipSipProfileMap[transportVoipSipName]) continue;
        var transportVoipSipProfile = transportVoipSipProfileMap[transportVoipSipName];
        var voipCCName = transportVoipSipProfile["voip-cc-name"];
        var tconts = {};
        var gemports = {};
        var tcontName = null;
        if (transportVoipSipProfile["tcont-config"]) {
            if (transportVoipSipProfile["tcont-config"].length > 2) {
                throw new RuntimeException("Invalid TCONT Config profile '" + transportVoipSipName + "' for VoIP SIP services. All VoIP SIP services on an ONT share the same TCONT.");
            }
            for (var tcontKey in transportVoipSipProfile["tcont-config"]) {
                var trafficClasses = null;
                var tcontConfig = transportVoipSipProfile["tcont-config"][tcontKey];
                var tcontProfileId = tcontConfig["tcont-profile-id"];
                var tcontProfile = tcontProfileMap[tcontProfileId];
                var queues = null;
                var tc2QueueMappingProfileId = null;
                if (tcontProfile) {
                    tc2QueueMappingProfileId = tcontProfile["tc-to-queue-mapping-profile-id"];
                    queues = tcontProfile["queue"];
                }
                if (tcontConfig["traffic-class"] && tcontConfig["traffic-class"].length > 0) {
                    trafficClasses = tcontConfig["traffic-class"];
                }
                var tcId2QueueIdMappingProfile = getTcId2QueueIdMappingProfile(tcId2QueueIdMappingProfileMap, tc2QueueMappingProfileId);
                var computedTrafficClasses = computeTrafficClasses(tcontProfile.name, tcId2QueueIdMappingProfile, tc2QueueMappingProfileId, trafficClasses);
                if (!tcId2QueueIdMappingProfile || apUtils.ifObjectIsEmpty(tcId2QueueIdMappingProfile)) continue;
                if (!computedTrafficClasses || computedTrafficClasses.length === 0) {
                    var firstTrafficClass = null;
                    for (var i = 0; i < Object.keys(tcId2QueueIdMappingProfile).length; i++) {
                        var tcId2QueueIdMappingKeys = Object.keys(tcId2QueueIdMappingProfile);
                        var key = tcId2QueueIdMappingKeys[i];
                        if (key && tcId2QueueIdMappingProfile[key] && 
                            tcId2QueueIdMappingProfile[key].hasOwnProperty("internal-order") &&
                            tcId2QueueIdMappingProfile[key]["internal-order"] === 0) {
                            firstTrafficClass = tcId2QueueIdMappingProfile[key]["traffic-class-id"];
                            break;
                        }
                    }
                    if (!firstTrafficClass && Object.keys(tcId2QueueIdMappingProfile) && Object.keys(tcId2QueueIdMappingProfile).length > 0) {
                        firstTrafficClass = Object.keys(tcId2QueueIdMappingProfile)[0];
                    }
                    computedTrafficClasses = [tcId2QueueIdMappingProfile[firstTrafficClass]];
                }
                tcontName = computeTconts(tconts, tcontName, computedTrafficClasses, voipCCName, tc2QueueMappingProfileId, queues);
                computeGemports(gemports, voipCCName, tcontName, computedTrafficClasses);
                break;
            }
        }
        if (!apUtils.ifObjectIsEmpty(tconts)) {
            onuTemplate["voipTcontsList"] = tconts;
        }
        if (!apUtils.ifObjectIsEmpty(gemports)) {
            onuTemplate["voipGemportsList"] = gemports;
        }
    }
}

/**
 * The traffic class for gemport will be defined as an array.
 * if the traffic class array are not defined, it will be retrieved from tc-id-2-queue-id-mapping-profile
 * There can be many gemports but only one tcont.
 * @param {*} onuTemplates list of onu-templates profiles
 * @param {*} iphostConfigProfiles list of ip-host-config-profiles
 * @param {*} tcontProfiles list of tcont-profiles
 * @param {*} tcId2QueueIdMappingProfiles list of tc-id-to-queue-id-mapping-profiles
 * @returns 
 */
AltiplanoUtilities.prototype.processIpHostTcontsAndGemports = function (onuTemplates, ipHostConfigProfiles, tcontProfiles, tcId2QueueIdMappingProfiles) {
    if (!onuTemplates || !tcontProfiles || !ipHostConfigProfiles) return;
    var ipHostConfigProfileMap = apUtils.convertArrayObjectToMap(ipHostConfigProfiles, "name");
    var tcontProfileMap = apUtils.convertArrayObjectToMap(tcontProfiles, "name");
    function getTcId2QueueIdMappingProfile(tcId2QueueIdMappingProfileMap, tc2QueueMappingProfileId) {
        if (tcId2QueueIdMappingProfileMap && tc2QueueMappingProfileId && tcId2QueueIdMappingProfileMap[tc2QueueMappingProfileId] &&
            tcId2QueueIdMappingProfileMap[tc2QueueMappingProfileId]["mapping-entry"]) {
            return tcId2QueueIdMappingProfileMap[tc2QueueMappingProfileId]["mapping-entry"];
        }
    }
    function computeIpHostTcontOrGemportName(trafficClass, ipCCName, isTcont) {
        if (trafficClass === undefined) {
            throw new RuntimeException("Missing Traffic Class for IP HOST TCONT and GEMPORT computation");
        }
        if (!ipCCName) {
            throw new RuntimeException("Missing VoIP CC Name for IP HOST TCONT and GEMPORT computation");
        }
        if (isTcont) {
            return ["TCONT" + (Number(trafficClass) + 1), ipCCName].join("_");
        }
        return ["GEM" + (Number(trafficClass) + 1), ipCCName].join("_");

    }
    function computeTcont(name, itfReference, tc2QueueMappingProfileId, queues) {
        var tcont = {};
        tcont.name = name;
        tcont["interface-reference"] = itfReference;
        tcont["tc-id-2-queue-id-mapping-profile-name"] = tc2QueueMappingProfileId;
        tcont.queues = queues;
        return tcont;
    }

    function computeTconts(tconts, tcontName, computedTrafficClasses, ipCCName, tc2QueueMappingProfileId, queues) {
        if (!tconts) return;
        if (!tcontName && computedTrafficClasses && computedTrafficClasses.length > 0) {
            var tcontName = computeIpHostTcontOrGemportName(computedTrafficClasses[0]["traffic-class-id"], ipCCName, true);
            var queueMap = apUtils.convertArrayObjectToMap(queues, "local-queue-id")
            var tcont = computeTcont(tcontName, "ANI", tc2QueueMappingProfileId, queueMap);
            tconts[tcontName] = tcont;
        }
        return tcontName;
    }
    function computeGemport(name, ipCCName, trafficClass, tcontName) {
        var gemPort = {};
        gemPort.name = name;
        gemPort["traffic-class"] = trafficClass;
        gemPort["tcont-ref"] = tcontName;
        gemPort["interface"] = "VSI_" + ipCCName;
        return gemPort;
    }
    function computeGemports(gemports, ipCCName, tcontName, trafficClasses) {
        if (!gemports) return;
        for (var key in trafficClasses) {
            var trafficClass = trafficClasses[key]["traffic-class-id"];
            var gemportName = computeIpHostTcontOrGemportName(trafficClass, ipCCName);
            var gemport = computeGemport(gemportName, ipCCName, trafficClass, tcontName);
            gemports[gemport.name] = gemport;
        }
    }
    function computeTrafficClasses(tcontProfileName, tcId2QueueIdMappingProfile, tc2QueueMappingProfileId, trafficClasses) {
        var computedTrafficClasses = [];
        if (trafficClasses && trafficClasses.length > 0) {
            var undefinedTCs = [];
            for (var i = 0; i < trafficClasses.length; i++) {
                if (apUtils.ifObjectIsEmpty(tcId2QueueIdMappingProfile) || !tcId2QueueIdMappingProfile[trafficClasses[i]]) {
                    undefinedTCs.push(trafficClasses[i]);
                    continue;
                }
                computedTrafficClasses.push(tcId2QueueIdMappingProfile[trafficClasses[i]]);
            }
            if (undefinedTCs && undefinedTCs.length > 0) {
                throw new RuntimeException("Traffic classes '[" + undefinedTCs + "]' of Tcont Profile '" + tcontProfileName + "' are not defined in Traffic Class-ID to Queue-ID Mapping Profile '" + tc2QueueMappingProfileId + "'.");
            }
        }
        return computedTrafficClasses;
    }
    for (var key in onuTemplates) {
        var onuTemplate = onuTemplates[key];
        var tcId2QueueIdMappingProfileMap = tcId2QueueIdMappingProfiles;
        if (!onuTemplate || !onuTemplate["ip-host-config"] || !onuTemplate["ip-host-config"]["name"]) continue;
        var ipHostConfigName = onuTemplate["ip-host-config"]["name"];
        if (!ipHostConfigProfileMap[ipHostConfigName]) continue;
        var ipHostConfigProfile = ipHostConfigProfileMap[ipHostConfigName];
        var ipCCName = ipHostConfigProfile["ip-cc-name"];
        var tconts = {};
        var gemports = {};
        var tcontName = null;
        if (ipHostConfigProfile["tcont-config"]) {
            if (ipHostConfigProfile["tcont-config"].length > 2) {
                throw new RuntimeException("Invalid TCONT Config Profile '" + ipHostConfigName + "' for IP Host Config services. All IP Host Config services on an ONT share the same TCONT.");
            }
            for (var tcontKey in ipHostConfigProfile["tcont-config"]) {
                var trafficClasses = null;
                var tcontConfig = ipHostConfigProfile["tcont-config"][tcontKey];
                var tcontProfileId = tcontConfig["tcont-profile-id"];
                var tcontProfile = tcontProfileMap[tcontProfileId];
                var queues = null;
                var tc2QueueMappingProfileId = null;
                if (tcontProfile) {
                    tc2QueueMappingProfileId = tcontProfile["tc-to-queue-mapping-profile-id"];
                    queues = tcontProfile["queue"];
                }
                if (tcontConfig["traffic-class"] && tcontConfig["traffic-class"].length > 0) {
                    trafficClasses = tcontConfig["traffic-class"];
                }
                var tcId2QueueIdMappingProfile = getTcId2QueueIdMappingProfile(tcId2QueueIdMappingProfileMap, tc2QueueMappingProfileId);
                var computedTrafficClasses = computeTrafficClasses(tcontProfile.name, tcId2QueueIdMappingProfile, tc2QueueMappingProfileId, trafficClasses);
                if (!tcId2QueueIdMappingProfile || apUtils.ifObjectIsEmpty(tcId2QueueIdMappingProfile)) continue;
                if (!computedTrafficClasses || computedTrafficClasses.length === 0) {
                    var firstTrafficClass = null;
                    for (var i = 0; i < Object.keys(tcId2QueueIdMappingProfile).length; i++) {
                        var tcId2QueueIdMappingKeys = Object.keys(tcId2QueueIdMappingProfile);
                        var key = tcId2QueueIdMappingKeys[i];
                        if (key && tcId2QueueIdMappingProfile[key] && 
                            tcId2QueueIdMappingProfile[key].hasOwnProperty("internal-order") &&
                            tcId2QueueIdMappingProfile[key]["internal-order"] === 0) {
                            firstTrafficClass = tcId2QueueIdMappingProfile[key]["traffic-class-id"];
                            break;
                        }
                    }
                    if (!firstTrafficClass && Object.keys(tcId2QueueIdMappingProfile) && Object.keys(tcId2QueueIdMappingProfile).length > 0) {
                        firstTrafficClass = Object.keys(tcId2QueueIdMappingProfile)[0];
                    }
                    computedTrafficClasses = [tcId2QueueIdMappingProfile[firstTrafficClass]];
                }
                tcontName = computeTconts(tconts, tcontName, computedTrafficClasses, ipCCName, tc2QueueMappingProfileId, queues);
                computeGemports(gemports, ipCCName, tcontName, computedTrafficClasses);
                break;
            }
        }
        if (!apUtils.ifObjectIsEmpty(tconts)) {
            onuTemplate["ipHostTcontsList"] = tconts;
        }
        if (!apUtils.ifObjectIsEmpty(gemports)) {
            onuTemplate["ipHostGemportsList"] = gemports;
        }
    }
}


/**
 * FNMS-139856, support multiple gemport
 * compute the olt tcont and gemport
 * @param {*} tcontMap store the final value for tconts
 * @param {*} gemPortMap store the final value for gemport
 * @param {*} voipCCName VoIP CC Name
 * @param {*} trafficClass List of traffci class
 * @param {*} deviceName the ONT name
 * @param {*} serviceName the L2-Infra service name
 * @returns 
 */
AltiplanoUtilities.prototype.processOltVoipSipTcontsAndGemports = function (tcontMap, gemPortMap, voipCCName, trafficClass, deviceName, serviceName) {
    if (!tcontMap || !gemPortMap) return;
    if (trafficClass && trafficClass.length > 0) {
        var oltTcontName = null;
        for (var i = 0; i < trafficClass.length; i++) {
            var oltGemportName = ["GEM" + (Number(trafficClass[i]) + 1), voipCCName, deviceName, serviceName].join('_');
            var onuGemportName = ["GEM" + (Number(trafficClass[i]) + 1), voipCCName].join('_')
            gemPortMap[oltGemportName] = {
                "name": oltGemportName,
                "eonuName": onuGemportName,
                "traffic-class": trafficClass[i]
            }
            if (!oltTcontName) {
                oltTcontName = ["TCONT" + (Number(trafficClass[i]) + 1), voipCCName, deviceName, serviceName].join('_');
                var onuTcontName = ["TCONT" + (Number(trafficClass[i]) + 1), voipCCName].join('_');
                tcontMap[oltTcontName] = {
                    "name": oltTcontName,
                    "eonuName": onuTcontName
                }
            }
        }
    }
}

/**
 * compute the olt tcont and gemport
 * @param {*} tcontMap store the final value for tconts
 * @param {*} gemPortMap store the final value for gemport
 * @param {*} ipCCName IP CC Name
 * @param {*} trafficClass List of traffci class
 * @param {*} deviceName the ONT name
 * @param {*} serviceName the L2-Infra service name
 * @returns 
 */
AltiplanoUtilities.prototype.processOltIpHostTcontsAndGemports = function (tcontMap, gemPortMap, ipCCName, trafficClass, deviceName, serviceName) {
    if (!tcontMap || !gemPortMap) return;
    if (trafficClass && trafficClass.length > 0) {
        var oltTcontName = null;
        for (var i = 0; i < trafficClass.length; i++) {
            var oltGemportName = ["GEM" + (Number(trafficClass[i]) + 1), ipCCName, deviceName, serviceName].join('_');
            var onuGemportName = ["GEM" + (Number(trafficClass[i]) + 1), ipCCName].join('_')
            gemPortMap[oltGemportName] = {
                "name": oltGemportName,
                "eonuName": onuGemportName,
                "traffic-class": trafficClass[i]
            }
            if (!oltTcontName) {
                oltTcontName = ["TCONT" + (Number(trafficClass[i]) + 1), ipCCName, deviceName, serviceName].join('_');
                var onuTcontName = ["TCONT" + (Number(trafficClass[i]) + 1), ipCCName].join('_');
                tcontMap[oltTcontName] = {
                    "name": oltTcontName,
                    "eonuName": onuTcontName
                }
            }
        }
    }
}

/**
 * FNMS-139856, support multiple gemport
 * TCONT for VOIP will be retrieved from the 1st traffic class in the tc-id-2-queue-id-mapping-profile
 * After some conversion from input schema, it will be a map, and can not get the 1st traffic class,
 * so an internal property was added to use later: internal-order
 * @param {*} profiles 
 */
AltiplanoUtilities.prototype.processTcId2QueueIdMappingProfile = function (profiles) {
    if (profiles && profiles["tc-id-2-queue-id-mapping-profile"] && profiles["tc-id-2-queue-id-mapping-profile"].length > 0) {
        for (var i = 0; i < profiles["tc-id-2-queue-id-mapping-profile"].length; i++) {
            var tcId2QueueIdMappingProfile = profiles["tc-id-2-queue-id-mapping-profile"][i];
            if (tcId2QueueIdMappingProfile && tcId2QueueIdMappingProfile["mapping-entry"] && tcId2QueueIdMappingProfile["mapping-entry"].length > 0) {
                var mappingEntries = tcId2QueueIdMappingProfile["mapping-entry"];
                for (var j = 0; j < mappingEntries.length; j++) {
                    var mappingEntry = mappingEntries[j];
                    if (mappingEntry) {
                        mappingEntry["internal-order"] = j
                    }
                }
            }
        }
    }
}

/**
 * 
 * @param {Array} transportVoipSip 
 * @param {Array} tcontProfiles 
 */
AltiplanoUtilities.prototype.processTcontTransportVoipSip = function (transportVoipSip, tcontProfiles) {
    for (var transportVoipSipIdx in transportVoipSip) {
        apUtils.processTcont(transportVoipSip[transportVoipSipIdx]["tcont-config"], tcontProfiles);
    }
}

/**
 * 
 * @param {Array} onuTemplate 
 * @param {Array} qosPolicyProfiles 
 * @param {Array} classifiers 
 * @param {Array} policies 
 */
AltiplanoUtilities.prototype.processGemPort = function (onuTemplate, qosPolicyProfiles, classifiers, policies) {
    for (var templateIdx in onuTemplate) {
        var services = onuTemplate[templateIdx]["service"];
        var flexibleTcontSharing = onuTemplate[templateIdx]["flexible-tcont-sharing"];
        for (var serviceIdx in services) {
            var service = services[serviceIdx];
            if (flexibleTcontSharing && flexibleTcontSharing == "true" && service["tcont-config"] && !service["tcont-config"][0]["traffic-class"]) {
                throw new RuntimeException("Traffic Class must be configured if more than one tcont-config configuration");
            } else if (service["tcont-config"] && !service["tcont-config"][0]["traffic-class"]) {
                var subscriberIngressProfile = service["subscriber-ingress-qos-profile-id"];
                var trafficClass = apUtils.getTrafficClass(subscriberIngressProfile, qosPolicyProfiles, classifiers, policies, true);
                service["trafficClass"] = trafficClass;
            }
        }
    }
}

/**
 * This method is used for validating traffic-class and queue in the tcont-configs
 * with the other in qos-profiles
 * @param {Array} tcontConfigs tcont-config come from services on onu-templates or intentt-attributes.json
 * @param {Object} serviceProfileVONUDevices contain ONT side information: tcont-configs, subscriber-ingress-qos-profile-id
 * @param {String} serviceProfileName name of service
 * @param {Array} qosProfilesJSON the qos profile json
 * @param {Array} ltServiceProfileJson contain LT side information for subscriber-egress-qos-rpofile-id
 * @param {String} jsonFileName file name of service profile
 */
AltiplanoUtilities.prototype.validateTcontConfig = function (tcontConfigs, serviceProfileVONUDevices, serviceProfileName, qosProfilesJSON, ltServiceProfileJson, onuTemplateFileName) {
    var profileValues = {};
    // Validate tcont-profile.json
    var tcontNames = {}
    if (tcontConfigs && tcontConfigs["tcont-profile"]) {
        var tcontProfile = this.convertToTcontQueueSharingFromTcontSharingEnum(tcontConfigs["tcont-profile"]);
        var tc2qMappingProfileMap = {};
        if(!ltServiceProfileJson) {
            for (var tc2qProfileIndex = 0; tc2qProfileIndex < qosProfilesJSON["tc-id-2-queue-id-mapping-profile"].length; tc2qProfileIndex++) {
                tc2qMappingProfileMap[qosProfilesJSON["tc-id-2-queue-id-mapping-profile"][tc2qProfileIndex]["name"]] = qosProfilesJSON["tc-id-2-queue-id-mapping-profile"][tc2qProfileIndex];
            }
        }
        var missingKeys = []
        for (var i = 0; i < tcontProfile.length; i++) {
            if (tcontProfile[i]["name"]) {
                if (tcontNames[tcontProfile[i]["name"]]) throw new RuntimeException("Tcont-profile: " + tcontProfile[i]["name"] + " is duplicated")
                else {
                    var tcontProfileOnt = tcontProfile[i];
                    var tc2queueMappingProfileId = tcontProfileOnt["tc-to-queue-mapping-profile-id"];
                    if (!tc2queueMappingProfileId)
                        missingKeys.push("tc-to-queue-mapping-profile-id");
                    if (!tcontProfileOnt["queue"] || tcontProfileOnt["queue"].length < 1)
                        missingKeys.push("queue");
                    var tcQueueMapForTcontProfileId = {};
                    for (var j = 0; j < tcontProfileOnt["queue"].length; j++) {
                        var localQueueId = tcontProfileOnt["queue"][j]["local-queue-id"];
                        if (!localQueueId)
                            missingKeys.push("local-queue-id");
                        if (!tcontProfileOnt["queue"][j]["priority"])
                            missingKeys.push("priority");
                        if (!tcontProfileOnt["queue"][j]["weight"])
                            missingKeys.push("weight");

                        if (missingKeys.length < 1 && !ltServiceProfileJson) {
                            if (tcontProfileOnt) {
                                var tcForQueue = apUtils.getTrafficClassFromLocalQueueId(tc2qMappingProfileMap[tc2queueMappingProfileId], tc2queueMappingProfileId, localQueueId, tcontProfileOnt);
                                tcQueueMapForTcontProfileId[tcForQueue] = localQueueId;
                            }                          
                        }
                    }

                    var tcontSharing = tcontProfileOnt["tcont-sharing"];
                    tcontNames[tcontProfile[i]["name"]] = {"tcontSharing" : tcontSharing};
                    tcontNames[tcontProfile[i]["name"]]["tcQueueMapForTcontProfileId"] = tcQueueMapForTcontProfileId;
                    /* else {
                        if (tcontProfile[i]["PON"] && tcontProfile[i]["PON"]["ONT"]) {
                            var tcontProfileOnt = tcontProfile[i]["PON"]["ONT"];
                            var tc2queueMappingProfileId = tcontProfileOnt["tc-to-queue-mapping-profile-id"];
                            if (!tc2queueMappingProfileId)
                                missingKeys.push("tc-to-queue-mapping-profile-id");
                            if (!tcontProfileOnt["queue"] || tcontProfileOnt["queue"].length < 1)
                                missingKeys.push("queue");
                            var tcQueueMapForTcontProfileId = {};
                            for (var j = 0; j < tcontProfileOnt["queue"].length; j++) {
                                var localQueueId = tcontProfileOnt["queue"][j]["local-queue-id"];
                                if (!localQueueId)
                                    missingKeys.push("local-queue-id");
                                if (!tcontProfileOnt["queue"][j]["priority"])
                                    missingKeys.push("priority");
                                if (!tcontProfileOnt["queue"][j]["weight"])
                                    missingKeys.push("weight");
    
                                if (missingKeys.length < 1 && !ltServiceProfileJson) {
                                    var tcForQueue = apUtils.getTrafficClassFromLocalQueueId(tc2qMappingProfileMap[tc2queueMappingProfileId], tc2queueMappingProfileId, localQueueId);
                                    tcQueueMapForTcontProfileId[tcForQueue] = localQueueId;
                                }
                            }
    
                            var tcontSharing = tcontProfileOnt["tcont-sharing"];
                            tcontNames[tcontProfile[i]["name"]] = {"tcontSharing" : tcontSharing};
                            tcontNames[tcontProfile[i]["name"]]["tcQueueMapForTcontProfileId"] = tcQueueMapForTcontProfileId;
                        } else missingKeys.push("PON");
                    } */
                }
            } else missingKeys.push("name");

            if (missingKeys && missingKeys.length > 0) {
                throw new RuntimeException("Tcont-profile [" + i + "] is missing mandatory key(s) : " + missingKeys);
            }
        }
    }

    //Validate tcont-config in intent-attribute.json
    if (serviceProfileVONUDevices) {
        var subcriberType = ltServiceProfileJson ? "subscriber-egress-qos-profile-id" : "subscriber-ingress-qos-profile-id";
        var typeProfile;
        if(subcriberType === "subscriber-egress-qos-profile-id"){  
            typeProfile = "Subscriber Egress QoS Profile"
        }
        if(subcriberType === "subscriber-ingress-qos-profile-id"){
            typeProfile = "Subscriber Ingress QoS Profile"
        }
	    var usedServiceProfile = ltServiceProfileJson ? ltServiceProfileJson : serviceProfileVONUDevices;
	    this.validateQosPolicyProfile(usedServiceProfile, qosProfilesJSON, subcriberType, serviceProfileName, onuTemplateFileName);       
        if (serviceProfileVONUDevices["tc-to-queue-mapping-profile-id"] && serviceProfileVONUDevices["tcont-config"]) {
            throw new RuntimeException("Service Profile: " + "'" + serviceProfileName + "'" + " just only one key tc-to-queue-mapping-profile-id or tcont-config should be defined in json");
        }
        if (!serviceProfileVONUDevices["tc-to-queue-mapping-profile-id"] && !serviceProfileVONUDevices["tcont-config"]) {
            throw new RuntimeException("Service Profile: " + "'" + serviceProfileName + "'" + " is missing mandatory key(s) : tc-to-queue-mapping-profile-id or tcont-config");
        }
        if (serviceProfileVONUDevices["tcont-config"]) {
            if (serviceProfileVONUDevices["tcont-config"].length == 0) {//EMPTY case
                throw new RuntimeException("TCONT configuration list of the Service '" + serviceProfileName + "' cannot be empty in the ONU Template '" + onuTemplateFileName + "'");
            }
            var qosProfileTrafficClasses = apUtils.getTrafficClass(usedServiceProfile[subcriberType], qosProfilesJSON["qos-policy-profiles"], qosProfilesJSON["classifiers"], qosProfilesJSON["policies"], true);
            profileValues["qosProfileTrafficClasses"] = qosProfileTrafficClasses;
            profileValues["qosProfile"] = usedServiceProfile[subcriberType];
            var uniqueTcontConfigList = [];
            serviceProfileVONUDevices["tcont-config"].forEach(function (tcontConfig) {
                if (!tcontConfig["tcont-profile-id"])
                    throw new RuntimeException("Service Profile: " + "'" + serviceProfileName + "'" + " is missing mandatory key(s) : tcont-profile-id");
                if (!tcontNames[tcontConfig["tcont-profile-id"]])
                    throw new RuntimeException("The TCONT Profile: "+tcontConfig["tcont-profile-id"] + " is not defined in "+ typeProfile +" '" + usedServiceProfile[subcriberType] + "' of the Service '" + serviceProfileName + "' in the ONU Template '" + onuTemplateFileName + "'");
                if (tcontNames[tcontConfig["tcont-profile-id"]] && tcontNames[tcontConfig["tcont-profile-id"]].tcontSharing === "true" && !tcontConfig["traffic-class"]) {
                    throw new RuntimeException ("TCONT sharing is not allowed when no Traffic Class is defined in "+ typeProfile +" '" + usedServiceProfile[subcriberType] + "' of the Service '" + serviceProfileName + "' in the ONU Template '" + onuTemplateFileName + "'");
                }
                var tcQueueMapForTcontProfileId = tcontNames[tcontConfig["tcont-profile-id"]]["tcQueueMapForTcontProfileId"];
                if (tcontConfig["traffic-class"]) {                       
                    if (qosProfileTrafficClasses.indexOf(tcontConfig["traffic-class"]) < 0) {                     
					    throw new RuntimeException("TCONT Profile '" + tcontConfig["tcont-profile-id"] + "' Traffic Class '" + tcontConfig["traffic-class"] + "' is not defined in " + typeProfile + " '" + usedServiceProfile[subcriberType] + "' of the Service '"+serviceProfileName+"' in the ONU Template '" + onuTemplateFileName + "'");
                    }
                    if(!ltServiceProfileJson && Object.keys(tcQueueMapForTcontProfileId).indexOf(tcontConfig["traffic-class"]) < 0) {
                        throw new RuntimeException("Traffic Class: " + tcontConfig["traffic-class"] + " is not defined in the referred TCONT Profile " + tcontConfig["tcont-profile-id"]);
                    }
                    var uniqueKey = tcontConfig["traffic-class"].concat("_").concat(tcontConfig["tcont-profile-id"]);
                    if (uniqueTcontConfigList.indexOf(uniqueKey) > -1) {
                        throw new RuntimeException("TCONT configuration list of the Service "+  "'" + serviceProfileName + "'"  + "contains duplicate configuration in the ONU Template '" + onuTemplateFileName + "'");
                    } else {
                        uniqueTcontConfigList.push(uniqueKey);
                    }
                } else {
                    Object.keys(tcQueueMapForTcontProfileId).forEach(function (tcOfTcontProfileId) {
                        if(qosProfileTrafficClasses.indexOf(tcOfTcontProfileId) < 0) {
                            throw new RuntimeException("Traffic Class defined by TCONT Profile " + tcontConfig["tcont-profile-id"] + " not matching in " + typeProfile + " '" + usedServiceProfile[subcriberType] + "' of the Service '"+serviceProfileName+"' in the ONU Template '" + onuTemplateFileName + "'");
                        }
                    });
                    var uniqueKey = tcontConfig["tcont-profile-id"];
                    if (uniqueTcontConfigList.indexOf(uniqueKey) > -1) {
                        throw new RuntimeException("TCONT configuration list of the Service '" + serviceProfileName + "' contains duplicate configuration in the ONU Template '" + onuTemplateFileName + "'");
                    } else {
                        uniqueTcontConfigList.push(uniqueKey);
                    }
                }
            });
            uniqueTcontConfigList=[];
        }
    }
    return profileValues;
}

/**
 * This method is used for validating the subcriber profile id exists in the qos profiles
 * @param {Array} usedServiceProfile the service profile from ONT side or OLT side
 * @param {Object} qosProfilesJson qos profile json based on ONT or OLT side
 * @param {String} subcriberType subscriber-egress-qos-profile-id or subscriber-ingress-qos-profile-id
 * @param {Array} serviceProfileName service profile name
 * @param {String} jsonFileName file name of service profile
 */
AltiplanoUtilities.prototype.validateQosPolicyProfile = function (usedServiceProfile, qosProfilesJson, subcriberType, serviceProfileName, onuTemplatesFileName) {
	if (usedServiceProfile) {
		if(!usedServiceProfile[subcriberType]) {
			throw new RuntimeException("Service Profile: '" + serviceProfileName + "' is missing mandatory key(s) : "+ subcriberType + " in the ONU Template " + onuTemplatesFileName);
		} else if (qosProfilesJson["qos-policy-profiles"]) {
            for (var i = 0; i < qosProfilesJson["qos-policy-profiles"].length; i++) {
                if (qosProfilesJson["qos-policy-profiles"][i]["name"] == usedServiceProfile[subcriberType]) {
                    var qosPolicyProfile = qosProfilesJson["qos-policy-profiles"][i]
                    break;
                }
            }
            if (!qosPolicyProfile) throw new RuntimeException("Service Profile: '" + serviceProfileName + "': " + subcriberType + " is not defined");
        }
    }
}

AltiplanoUtilities.prototype.getTrafficClassFromLocalQueueId = function (tc2qMappingProfile, tc2queueMappingProfileId, localQueueId, tcontProfileONT) {
    if (!tc2qMappingProfile) {
        throw new RuntimeException("tc-id-2-queue-id-mapping-profile: " + tc2queueMappingProfileId + " is not defined")
    } else {
        if (tc2qMappingProfile["mapping-entry"]) {
            for (var i = 0; i < tc2qMappingProfile["mapping-entry"].length; i++) {
                if (tc2qMappingProfile["mapping-entry"][i]["local-queue-id"] == localQueueId) {
                    return tc2qMappingProfile["mapping-entry"][i]["traffic-class-id"];
                }
            }
        }
    }
    throw new RuntimeException("TCONT Profile '" + tcontProfileONT["name"] + "' has queue '" + localQueueId + "' defined, while the tc-id-2-queue-mapping-profile '" + tc2queueMappingProfileId + "' it refers only has a mapping to queue '" + tc2qMappingProfile["mapping-entry"][0]["local-queue-id"] + "'");
}

/**
 *
 * @param {String} deviceName fiber device name (LT/DF/MF)
 * @param {Object} input coming from postSynchronize
 * @param {String} networkState coming from postSynchronize
 * @param {Object} result coming from postSynchronize
 * @param {String} extraInfoKey key to specify topology
 *
 */
AltiplanoUtilities.prototype.setGcHintForTcont = function(deviceName, input, networkState, result, extraInfoKey, isTR385ModelSupported, deviceNameToObjectTypeToObjectIds, isSpeedAtOntIntent) {
    var isFiberDevice = apUtils.isLsFiberDevice(deviceName);
    var setGc = function (xtraInfoJson, deviceName, result) {
        if (xtraInfoJson[deviceName]["tcontMap"]) {
            var objectTypeToObjectIdMap = new HashMap();
            var objectTcontIds = new ArrayList();
            var objectDeviceTcontIds = new ArrayList();
            var ontName = xtraInfoJson[deviceName]["ontName"].value;
            var isDeviceUseEonu = xtraInfoJson[deviceName]["isDeviceUseEonu"].value;
            var isOntTemplate = xtraInfoJson[deviceName]["ontTemplateName"] ? true : false;
            for (var tcontName in xtraInfoJson[deviceName]["tcontMap"]) {
                var tcontDeatils = xtraInfoJson[deviceName]["tcontMap"][tcontName];
                if (tcontDeatils["isShared"] == true) {
                    if (isDeviceUseEonu === "true") {
                        if (isOntTemplate) {
                            if (isTR385ModelSupported && isTR385ModelSupported == true) {
                                objectTcontIds.add("anv:bbf-fiber-onu-emulated-mount:onus/onu=" + ontName + "/nokia-onus-from-template:template-parameters/tconts/tcont=" + tcontDeatils["eonuName"]);
                                objectTypeToObjectIdMap.put(intentConstants.OBJECT_TYPE_EONU_TCONT_XPONGEMTCONT, objectTcontIds);
                            } else {
                                objectTcontIds.add("anv:bbf-fiber-onu-emulated-mount:onus/onu=" + ontName + "/nokia-onus-from-template:template-parameters/tconts-config/tcont=" + tcontDeatils["eonuName"]);
                                objectTypeToObjectIdMap.put(intentConstants.OBJECT_TYPE_EONU_TCONT, objectTcontIds);
                            }
                        } else {
                            if (isTR385ModelSupported && isTR385ModelSupported == true) {
                                objectTcontIds.add("anv:onu:onus/onu=" + ontName + "/onu:root/xpongemtcont/tconts/tcont=" + tcontDeatils["eonuName"]);
                                objectTypeToObjectIdMap.put(intentConstants.OBJECT_TYPE_EONU_TCONT_XPONGEMTCONT, objectTcontIds);
                            } else {
                                objectTcontIds.add("anv:onu:onus/onu=" + ontName + "/onu:root/tconts-config/tcont=" + tcontDeatils["eonuName"]);
                                objectTypeToObjectIdMap.put(intentConstants.OBJECT_TYPE_EONU_TCONT, objectTcontIds);
                            }                            
                        }
                    }
                    if(!isSpeedAtOntIntent) {
                        if (isTR385ModelSupported && isTR385ModelSupported == true) {
                            objectDeviceTcontIds.add("anv:bbf-xpongemtcont:xpongemtcont/tconts/tcont=" + tcontName);
                            objectTypeToObjectIdMap.put(intentConstants.OBJECT_TYPE_TCONT_XPONGEMTCONT, objectDeviceTcontIds);
                        } else {
                            objectDeviceTcontIds.add("anv:bbf-xpongemtcont:tconts-config/tcont=" + tcontName);
                            objectTypeToObjectIdMap.put(intentConstants.OBJECT_TYPE_TCONT, objectDeviceTcontIds);
                        }
                    }
                }
            }
            if (!objectTypeToObjectIdMap.isEmpty()) {
                return apUtils.updateGcHint(deviceName, objectTypeToObjectIdMap, result, deviceNameToObjectTypeToObjectIds);
            }
        }
    };
    if (result.isSuccess() && isFiberDevice) {
        var xtraInfo = apUtils.getTopologyExtraInfo(result.getTopology());
        if (xtraInfo && xtraInfo[extraInfoKey] && networkState == intentConstants.NETWORK_STATE_DELETE) {
            var xtraInfoJson = apUtils.JSONParsingWithCatchingException("setGcHintForTcont", xtraInfo[extraInfoKey]);
            setGc(xtraInfoJson, deviceName, result);
        } else if (xtraInfo && xtraInfo[extraInfoKey] && xtraInfo["oldTopologyXtraInfo"] && xtraInfo["lastIntentConfig"] && networkState == intentConstants.NETWORK_STATE_ACTIVE) {
            var oldIntentConfig = apUtils.JSONParsingWithCatchingException("setGcHintForTcont", xtraInfo["lastIntentConfig"]);
            var xtraInfoJson = apUtils.JSONParsingWithCatchingException("setGcHintForTcont", xtraInfo[extraInfoKey]);
            if (oldIntentConfig && oldIntentConfig["service-profile"] &&
                xtraInfoJson && xtraInfoJson[deviceName] && xtraInfoJson[deviceName]["service-profile"] && xtraInfoJson[deviceName]["service-profile"]["value"] &&
                oldIntentConfig["service-profile"] !== xtraInfoJson[deviceName]["service-profile"]["value"]) {
                var oldTopologyXtraInfo = JSON.parse(xtraInfo["oldTopologyXtraInfo"])[extraInfoKey];
                var oldXtraInfoJson = JSON.parse(oldTopologyXtraInfo);
                setGc(oldXtraInfoJson, deviceName, result);
            }
        }
    }
    return deviceNameToObjectTypeToObjectIds;
};

/**
 * Update deviceNameToObjectTypeToObjectIds to set in garbage collection
 * @param {*} deviceName device name need to set
 * @param {*} objectTypeToObjectIdMap new object need to update in deviceNameToObjectTypeToObjectIds
 * @param {*} result result 
 * @param {*} deviceNameToObjectTypeToObjectIds the object will be update everytime call this function
 * @returns
 */
AltiplanoUtilities.prototype.updateGcHint = function (deviceName, objectTypeToObjectIdMap, result, deviceNameToObjectTypeToObjectIds) {
    if (deviceNameToObjectTypeToObjectIds != null) {
        if (deviceNameToObjectTypeToObjectIds.get(deviceName) != null) {
            var objectsIdsOfDevice = deviceNameToObjectTypeToObjectIds.get(deviceName);
            for each(var objectKey in objectTypeToObjectIdMap.keySet()) {
                var arrOfNewObject = objectTypeToObjectIdMap.get(objectKey);
                if (objectsIdsOfDevice.get(objectKey) != null && arrOfNewObject.size() > 0) {
                    var arrOfCurrentObject = objectsIdsOfDevice.get(objectKey);
                    for (var counter = 0; counter < arrOfNewObject.size(); counter++) {
                        var value = arrOfNewObject.get(counter);
                        if (arrOfCurrentObject.indexOf(value) < 0) {
                            arrOfCurrentObject.add(value);
                        }
                    }
                    deviceNameToObjectTypeToObjectIds.get(deviceName).put(objectKey, arrOfCurrentObject);
                } else {
                    deviceNameToObjectTypeToObjectIds.get(deviceName).put(objectKey, arrOfNewObject);
                }
            }
        } else {
            deviceNameToObjectTypeToObjectIds.put(deviceName, objectTypeToObjectIdMap);
        }
    } else {
        deviceNameToObjectTypeToObjectIds = new HashMap();
        deviceNameToObjectTypeToObjectIds.put(deviceName, objectTypeToObjectIdMap);
    }
    return deviceNameToObjectTypeToObjectIds;
}

/**
 * set the uplink sap to map object using in garbage collection
 * @param {*} objectTypeToObjectIdMap map of objects to collect
 * @param {*} portsTobeAddedGC uplink port
 * @param {*} outerVlan  s vlan or c vlan
 * @returns
 */
AltiplanoUtilities.prototype.setGcForUplinkSap = function (objectTypeToObjectIdMap, portsTobeAddedGC, outerVlan, vplsId, overrideOuterVlanId) {
    var objectL2SapIds = new ArrayList();
    if (portsTobeAddedGC && Object.keys(portsTobeAddedGC).length > 0) {
        Object.keys(portsTobeAddedGC).forEach(function (port) {
            var sapObject = port + ":" + outerVlan;
            if(vplsId){
                if (overrideOuterVlanId) {
                   sapObject = port + ":" + overrideOuterVlanId;
                }
                objectL2SapIds.add("anv:nokia-conf:configure/service/vpls=" + vplsId + "/sap=" + encodeURIComponent(sapObject));
            } else{
                objectL2SapIds.add("anv:nokia-conf:configure/service/vpls=" + outerVlan + "/sap=" + encodeURIComponent(sapObject));
            }
            
        });
        if (objectTypeToObjectIdMap) {
            objectTypeToObjectIdMap.put(intentConstants.OBJECT_TYPE_SAP, objectL2SapIds);
        }
        return true;
    }
    return false;
}

/**
 * get the old configuration from topology and put it in scope
 * @param {*} currentTopo current topology
 * @param {*} extraInfoKey the stage _ device name _ ARGS
 * @param {*} deviceName device name
 * @param {*} contextKey the key to put value in scope default is ihubXtraInfo
 * @returns
 */
AltiplanoUtilities.prototype.getOldConfigurationAndPutInScope = function (currentTopo, extraInfoKey, deviceName, contextKey) {
    contextKey = !contextKey || "ihubXtraInfo";
    if (requestScope.get().get(contextKey)) {
        return requestScope.get().get(contextKey);
    } else {
        var xtraInfo = apUtils.getTopologyExtraInfo(currentTopo);
        if (xtraInfo) {
            var stageArgs = xtraInfo[extraInfoKey];
            if (stageArgs) {
                stageArgs = apUtils.JSONParsingWithCatchingException("getOldConfigurationAndPutInScope", stageArgs);
                requestScope.get().put(contextKey, stageArgs[deviceName]);
                return stageArgs[deviceName];
            }
        }
    }
    return null;
}

/**
 * Check and get ONU Model base on device and intent type
 *
 * @param {string} deviceName
 * @param {string} intentType
 * @returns {string}
 */
AltiplanoUtilities.prototype.getOnuModelState = function (deviceName, intentType) {
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
        var serviceProfile = apUtils.getAssociatedProfilesWithConfigForIntentType(nodeType, intentType, intentVersion, "board-service-profile", subType, null);
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
            if (!boardProfile && (familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_E) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_H) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_J) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_A) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_C))){
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

/**
 * Getting list of used tcont-config name basing on interfaceName.
 * @param  {String} deviceID Device ID.
 * @param  {String} ontName ONT name.
 * @return {String} List of tcont-config name.
*/
AltiplanoUtilities.prototype.getUnusedTcontConfigForOnt = function (deviceID, ontName, isTR385ModelSupported) {
    var templateArgs = {
        deviceID: deviceID,
        interfaceName: ontName,
        isTR385ModelSupported: isTR385ModelSupported
    };
    var tcontConfigList = [];
    var resourceUrl = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR + "getTcontConfig.xml.ftl";
    var node = apUtils.getExtractedDeviceSpecificDataNode(resourceUrl, templateArgs);
    if (node) {
        var tcontXpath;
        if (isTR385ModelSupported) {
            tcontXpath = "xpongemtcont:xpongemtcont/xpongemtcont:tconts/xpongemtcont:tcont/xpongemtcont:name";
        } else {
            tcontXpath = "xpongemtcont:tconts-config/xpongemtcont:tcont/xpongemtcont:name"
        }
        var listTconts =  apUtils.getAttributeValues(node, tcontXpath, apUtils.prefixToNsMap);
        listTconts.forEach(function (tcontName) {
                tcontConfigList.push(tcontName);
        });
    }
    return tcontConfigList;
}

/** FNMS-101599: 
 * Getting list of used gemport-config in device for olt and ont side (EONU with template)
 * @param  {String} deviceID Device ID.
 * @param  {String} ontName ONT name.
 * @param  {String} ontTemplateName template-ref
 * @return {Object} two list for olt gemports and onu gemport
*/
AltiplanoUtilities.prototype.getGemportConfigForOnt = function (deviceID, ontName, ontTemplateName, isTR385ModelSupported) {
    var templateArgs = {
        deviceID: deviceID,
        ontName: ontName,
        ontTemplateName: ontTemplateName,
        isTR385ModelSupported: isTR385ModelSupported
    };
    logger.debug("getGemportConfigForOnt " + JSON.stringify(templateArgs));
    //var oltGemportList = [];
    var onuGemportList = [];
    var resourceUrl = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR + "getGemportConfig.xml.ftl";
    var node = apUtils.getExtractedDeviceSpecificDataNode(resourceUrl, templateArgs);
    var addItemsToList = function (items, targetList) {
        if (items) {
            items.forEach(function (item) {
                targetList.push(item);
            });
        }
    }
    if (node) {
        //var oltGemports = apUtils.getAttributeValues(node, "xpongemtcont:gemports-config/xpongemtcont:gemport/xpongemtcont:name", apUtils.prefixToNsMap);
        if (isTR385ModelSupported) {
            var onuGemports = apUtils.getAttributeValues(node, "onu:onus/onu:onu/onus-from-template:template-parameters/onus-from-template:gemports/onus-from-template:gemport/onus-from-template:template-ref", apUtils.prefixToNsMap);
        } else {
            var onuGemports = apUtils.getAttributeValues(node, "onu:onus/onu:onu/onus-from-template:template-parameters/onus-from-template:gemports-config/onus-from-template:gemport/onus-from-template:template-ref", apUtils.prefixToNsMap);
        }
        //addItemsToList(oltGemports, oltGemportList);
        addItemsToList(onuGemports, onuGemportList);
    }
    return {
        //oltGemportList: oltGemportList,
        onuGemportList: onuGemportList
    };
}

/**
 * FNMS-101599: The gemport sharing can be changed by changing the eonu template
 * But due to the roll back issue, it can't separate into 2 rpc
 * Need to delete all the gemports that related to the uni has the gemport-sharing options changed
 * @param {*} baseArgs contains required data
 * @param {*} stageName step name of ont intent
 * @param {*} topology 
 * @returns 
 */
AltiplanoUtilities.prototype.getUnusedGemportsForGemportSharingChanged = function (baseArgs, stageName, topology, isTR385ModelSupported) {
    if (!baseArgs || !baseArgs["deviceID"] || !stageName) return;
    var deviceName = baseArgs["deviceID"];
    var topoKey =  stageName + "_" + deviceName + "_ARGS";
    var oldOnuTemplateName;
    var uniWithGemportSharingOptionChanged = [];
    var gemportSharingMap = baseArgs["gemportSharingMap"];

    var getOldConfiguration = function (deviceName, topology, topoKey) {
        if (topology && Object.keys(apUtils.getTopologyExtraInfo(topology)).indexOf(topoKey) > 0) {
            var stageArgs = apUtils.getStageArgsFromTopologyXtraInfo(topology, topoKey);
            if (stageArgs && stageArgs[deviceName]) {
                return stageArgs[deviceName];
            }
        }
    }
    var getUnusedGemports = function (gemportList, uniWithGemportSharingOptionChanged, gemportSharingMap, ontNamePrefix) {
        var unusedGemports = [];
        for (var i = 0; i < gemportList.length; i++) {
            var gemport = gemportList[i];
            for (var j = 0; j < uniWithGemportSharingOptionChanged.length; j++) {
                var uni = uniWithGemportSharingOptionChanged[j];
                var isProperUni = false;
                var onuNamingConvention = ontNamePrefix + "_" + uni;
                /**change from non-sharing to sharing --> get all gemports contain _<UNI_ID>_ 
                 * compare with 4 because the convention naming of GEMPORT is GEM<TC>
                */
                if (gemportSharingMap[uni]) {
                    onuNamingConvention = onuNamingConvention + "_";
                    isProperUni = gemport.indexOf(onuNamingConvention) === intentConstants.GEMPORT_PREFIX_LENGTH ? true : false;
                } else {
                    isProperUni = gemport.endsWith(onuNamingConvention) && (onuNamingConvention.length + intentConstants.GEMPORT_PREFIX_LENGTH) === gemport.length ? true : false;
                }
                isProperUni && unusedGemports.push(gemport);
            }
        }
        return unusedGemports;
    }
    /**Find the uni-id that the gemport sharing option is changed by comparing the current value with the old value from topology*/
    if (gemportSharingMap && Object.keys(gemportSharingMap).length > 0) {
        var oldConfiguration = getOldConfiguration(deviceName, topology, topoKey);
        if (oldConfiguration && oldConfiguration["onuTemplate"] && 
            oldConfiguration["onuTemplate"]["name"] && oldConfiguration["gemportSharingMap"] &&
            oldConfiguration["onuTemplate"]["name"] !== baseArgs["onuTemplate"]["name"] ) {
            var oldGemportSharingMap = oldConfiguration["gemportSharingMap"];
            oldOnuTemplateName = oldConfiguration["onuTemplate"]["name"];
            Object.keys(gemportSharingMap).forEach(function (uni) {
                if (oldGemportSharingMap.hasOwnProperty(uni) && gemportSharingMap[uni] !== oldGemportSharingMap[uni]) {
                    uniWithGemportSharingOptionChanged.push(uni);
                }
            })
        }
    }

    /**if there are unis that gemport-sharing options is changed, get all the olt gemports and eonu gemports from the device
     * Based on the unis, find the matched gemports: for olt gemports it contains the ont name in the constuction
     */
    if (uniWithGemportSharingOptionChanged && uniWithGemportSharingOptionChanged.length > 0 && oldOnuTemplateName) {
        var allGemports = apUtils.getGemportConfigForOnt(deviceName, baseArgs["ontName"], oldOnuTemplateName, isTR385ModelSupported);
        /** Reduce the mount of data come from device for olt gemport, so comment it . but it will affect the total gemport-id can provide */
        /** 
        if (allGemports && allGemports["oltGemportList"].length > 0) {
            var unusedOltGemports = getUnusedGemports(allGemports["oltGemportList"], uniWithGemportSharingOptionChanged, gemportSharingMap, "_" + baseArgs["ontName"]);
            if (unusedOltGemports && unusedOltGemports.length > 0) {
                baseArgs["unusedOltGemports"] = unusedOltGemports;
            }
        }
        */
        if (allGemports && allGemports["onuGemportList"].length > 0) {
            var unusedOntGemports = getUnusedGemports(allGemports["onuGemportList"], uniWithGemportSharingOptionChanged, gemportSharingMap, "");
            if (unusedOntGemports && unusedOntGemports.length > 0) {
                baseArgs["unusedOntGemports"] = unusedOntGemports;
            }
        }
    }
}

/**
 * Getting the specific ont template json basing on the ont template name.
 * @param  {Object} ontTemplatesJson Json of ont templates.
 * @param  {String} ontTemplateName specific ont template name.
 * @return {Object} json of specific ont template.
*/
AltiplanoUtilities.prototype.getOntTemplateJson = function (ontTemplatesJson, ontTemplateName) {
    if (ontTemplatesJson && ontTemplateName) {
        for(var template in ontTemplatesJson) {
            if(ontTemplatesJson[template].name && ontTemplatesJson[template].name === ontTemplateName) {
                return ontTemplatesJson[template];
            }
        }
    }
}
/**
 * Add an object with the key to the map object
 * @param  {Object} objectMap object map.
 * @param  {Object} object specific object need to put in map.
 * @param  {String} key key to put in the map.
 * @return {Object} the updated object map.
*/
AltiplanoUtilities.prototype.addObjectToMap = function (objectMap, object, key) {
    if (objectMap && object && object[key] && !objectMap[object[key]]) {
      objectMap[object[key]] = object;
    }
}

/**
 * convert a map object to a list
 * @param  {Object} map map object.
 * @return {Object} the list object.
*/
AltiplanoUtilities.prototype.mapToList = function (map) {
    var list = [];
    for(var key in map) {
      list.push(map[key]);
    }
    return list
}

/**
 * compute a tcont object
 * @param  {String} name tcont name.
 * @param  {Object} queues array of queues.
 * @param  {String} tcToQueueMappingProfileId tc to queue mapping profile id.
 * @return {Object} tcont object.
*/
AltiplanoUtilities.prototype.computeSingleTcontObject = function (name, queues, tcToQueueMappingProfileId) {
    return {
      name: name,
      queues: queues,
      tcToQueueMappingProfileId: tcToQueueMappingProfileId
    }
  }

/**
 * compute a gemport object
 * @param  {String} name gemport name.
 * @param  {String} itfRef interface reference.
 * @param  {String} trafficClass traffic class.
 * @param  {String} tcontRef tcont reference.
 * @param  {String} upstreamAesIndicator upstream aes indicator.
 * @param  {String} downstreamAesIndicator downstream aes indicator.
 * @return {Object} gemport object.
*/
AltiplanoUtilities.prototype.computeSingleGemPortObject = function (name, itfRef, trafficClass, tcontRef, upstreamAesIndicator, downstreamAesIndicator) {
    return {
        name: name,
        itfRef: itfRef,
        trafficClass: trafficClass,
        tcontRef: tcontRef,
        upstreamAesIndicator: upstreamAesIndicator,
        downstreamAesIndicator: downstreamAesIndicator
    }
}

/**
 * compute a tcont name basing on the options of sharing
 * @param  {Object} tcontParams parameters for computing.
 * @param  {Object} tcontConfig tcont-config.
 * @return {String} tcont name.
*/
AltiplanoUtilities.prototype.computeTcontName = function (tcontParams, tcontConfig, trafficClass, totalTconts, flexibleTcontSharing) {
    var tcontName;
    if (tcontConfig && tcontConfig["tcont-sharing"] === "true" && tcontConfig["queue-sharing"] === "false") {
        tcontName = ["TCONT", tcontParams.uniId, tcontParams.tcontProfileId].join("_");
    } else if (tcontConfig && tcontConfig["tcont-sharing"] === "true" && tcontConfig["queue-sharing"] === "true") {
        tcontName = ["TCONT", tcontParams.tcontProfileId].join("_");
    } else {
        var suffix =  (totalTconts > 1 && flexibleTcontSharing && flexibleTcontSharing == "false") ? tcontParams.tcontProfileId: tcontParams.serviceName;
        tcontName = ["TCONT", tcontParams.uniId, suffix].join("_");
    }
    return tcontName;
}

/**
 * Transform the sequence of numbers in an array to ranges
 * @param  arrayValue
 * @return transformed ranges, individual number as an array
 */

AltiplanoUtilities.prototype.getRanges = function (arrayValue) {
    var sortedArray = arrayValue.sort(function (a, b) { return a - b; });
    var ranges = [];
    for (var i = 0; i < sortedArray.length; i++) {
        var rangeStart = sortedArray[i];
        var rangeEnd = rangeStart;
        while (sortedArray[i + 1] - sortedArray[i] == 1) {
            rangeEnd = sortedArray[i + 1];
            i++;
        }
        ranges.push(rangeStart == rangeEnd ? rangeStart + '' : rangeStart + '-' + rangeEnd);
    }
    return ranges;
}

/**
 * reformat an attribut of object from String to Object
 * @param  {Object} object object contains attribute
 * @param  {String} attribute attribute need to be reformatted.
 * @return {Object} object with reformatted attribute
*/
AltiplanoUtilities.prototype.formatStringAttributeToObject = function (object, attribute) {
    if (object && attribute) {
        object[attribute] = {
            "value": object[attribute] ? object[attribute] : ""
        }
    }
}

/**
 * 1) compute the VSI name for non voip-sip inteface
 * 2) compute the Tconts and gemport for every service
 * 3) Push the modified service and tcontsLists and gemportLists to template
 * @param  {Object} onuTemplates onuTemplates from the onu-templates.json
 * @param  {Object} topology used for compute the modified attribute
 * @param  {Object} baseArgs
 * @param  {Object} eOnuResources resources for vaidating the gemport sharing
 * @param  {String} bestType for checking version supports gemport sharing
 * @param  {Object} contextParameters some extra parameters, {onuTemplateFileName : "onu-templates-22.6.json"}
 * @return {Object} the proceeded onu templates
 */
AltiplanoUtilities.prototype.ontTemplateSchemaProcessing = function (onuTemplates, topology, baseArgs, eOnuResources, bestType, contextParameters, useProfileManager, isAutoDetectCardNoSupported) {
    var isGemportSharingChanged = function (ontTemplate, onuTemplateStageArgs, portNo, cardNo, isGemportShared, portsDetail , uniId ,isAutoDetectCardNoSupported) {
        if (!ontTemplate || !onuTemplateStageArgs || !onuTemplateStageArgs[ontTemplate]
        || !onuTemplateStageArgs[ontTemplate]["layout"] || !portNo || !cardNo) return;
        if(!isAutoDetectCardNoSupported){
            var oldCards = onuTemplateStageArgs[ontTemplate]["layout"]["cards"];
            if (oldCards[cardNo] && oldCards[cardNo]["ports"] && oldCards[cardNo]["ports"][portNo]) {
            var oldGemportSharing = oldCards[cardNo]["ports"][portNo]["gemport-sharing"];
            if (isGemportShared && (!oldGemportSharing || oldGemportSharing === "false")
                || !isGemportShared && (oldGemportSharing === "true")) {
                    return true;
                }
            }
        }else{
            var oldCards = onuTemplateStageArgs[ontTemplate]["layout"]["cards"];
            if(portsDetail && uniId && portsDetail[uniId] && portsDetail[uniId] && portsDetail[uniId]["cardType"]){
                var cardNo_cardType = cardNo + "_" + portsDetail[uniId]["cardType"];
                if(oldCards[cardNo_cardType] && oldCards[cardNo_cardType]["ports"] && oldCards[cardNo_cardType]["ports"][cardNo] && oldCards[cardNo_cardType]["ports"][cardNo]["uniConfigurationDetail"] && oldCards[cardNo_cardType]["ports"][cardNo]["uniConfigurationDetail"]["forwarding"] && oldCards[cardNo_cardType]["ports"][cardNo]["uniConfigurationDetail"]["forwarding"]["gemport-sharing"]){
                    var oldGemportSharing = oldCards[cardNo_cardType]["ports"][cardNo]["uniConfigurationDetail"]["forwarding"]["gemport-sharing"];
                    if(isGemportShared && (!oldGemportSharing || oldGemportSharing === "false") || !isGemportShared && (oldGemportSharing === "true")){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    var stageArgs = apUtils.getStageArgsFromTopologyXtraInfo(topology,  baseArgs["topoKey"]);
    var onuTemplateStageArgs;
    var gemPortErrProfileDetails = {};
    if (stageArgs && stageArgs[baseArgs["deviceID"]] && stageArgs[baseArgs["deviceID"]]["onu-template"]) {
        onuTemplateStageArgs = stageArgs[baseArgs["deviceID"]]["onu-template"];
    }
    for (var templateIndex in onuTemplates["onu-template"]) {
        var flexibleTcontSharing = onuTemplates["onu-template"][templateIndex]["flexible-tcont-sharing"];
        var services = onuTemplates["onu-template"][templateIndex]["service"];
        var templateName = onuTemplates["onu-template"][templateIndex]["name"];
        var layout = onuTemplates["onu-template"][templateIndex]["layout"];
        var portsDetail = this.getPortsDetailAndTransformPortsStructure(layout, true, isAutoDetectCardNoSupported);
        var listKey = [];
        var modifiedServices = [];
        var tcontMap = {};
        var gemPortMap = {};
        var caches = {};
        var uniSubscriberQosPolicyProfileMap = {};
        gemPortErrProfileDetails[templateName] = {};
        
        for (var serviceIndex in services) {
            var service = services[serviceIndex];
            var uniId = service["uni-id"];
            var isGemportShared = this.isGemportShared(uniId, portsDetail, null, true, bestType, isAutoDetectCardNoSupported);
            var cardNo = portsDetail[uniId] ? portsDetail[uniId]["cardNo"] : null;
            var portNo = portsDetail[uniId] ? portsDetail[uniId]["portNo"] : null;
            if(!isAutoDetectCardNoSupported){
                if (isGemportSharingChanged(templateName, onuTemplateStageArgs, cardNo, portNo, isGemportShared)
                && portsDetail[uniId] && intentConstants.PORT_TYPES_SUPPORTED_GEMPORT_SHARING.indexOf(portsDetail[uniId]["portType"]) !== -1) {
                throw new RuntimeException("Can not modify the gemport sharing option of template " + templateName
                    + ", uni-id " + uniId);
                }
            }else{
                if (isGemportSharingChanged(templateName, onuTemplateStageArgs, cardNo, portNo, isGemportShared,portsDetail,uniId,isAutoDetectCardNoSupported)
                && portsDetail[uniId] && intentConstants.CARD_TYPES_SUPPORTED_GEMPORT_SHARING.indexOf(portsDetail[uniId]["cardType"].toLowerCase()) !== -1) {
                    throw new RuntimeException("Can not modify the gemport sharing option of template " + templateName
                    + ", uni-id " + uniId);
                }
            }
            if (isGemportShared) {
                if (!uniSubscriberQosPolicyProfileMap[uniId]) {
                    uniSubscriberQosPolicyProfileMap[uniId] = [];
                }
                uniSubscriberQosPolicyProfileMap[uniId].push({
                    "subscriber-ingress-qos-profile-id": service["subscriber-ingress-qos-profile-id"],
                    "tcont-config": service["tcont-config"]
                });
                if (!this.checkIfTcontSharing(service["tcont-config"], null, true)) {
                    throw new RuntimeException("The gemport sharing in template " + templateName + " on UNI " +
                    uniId + " must be used with tcont-sharing");
                }
                var gemportValidationFailure = this.validateGemportSharing(uniSubscriberQosPolicyProfileMap[uniId],
                    eOnuResources.qosProfiles["qos-policy-profiles"],
                    eOnuResources.qosProfiles["policies"],
                    eOnuResources.qosProfiles["classifiers"], caches, templateName, service.name, uniId);
                if (gemportValidationFailure) {
                    throw new RuntimeException(gemportValidationFailure);
                }
            }
            this.computeVsiPerService(templateName, modifiedServices, listKey, service, flexibleTcontSharing, contextParameters);
            this.computeTcontsAndGemportPerService(templateName, service, tcontMap, gemPortMap, isGemportShared, flexibleTcontSharing, useProfileManager, gemPortErrProfileDetails);
            if (bestType.startsWith(intentConstants.LS_FX_PREFIX) || bestType.startsWith(intentConstants.LS_DF_PREFIX) || bestType.startsWith(intentConstants.LS_MF_PREFIX)
                || bestType.startsWith(intentConstants.LS_SF_PREFIX)) {
                this.processMulticastKey(modifiedServices);
            }
        }
        apUtils.formatStringAttributeToObject(onuTemplates["onu-template"][templateIndex], "voip-capability");
        apUtils.deletePropertyInObjectIfEmpty(onuTemplates["onu-template"][templateIndex], "sip-agent-profiles");
        apUtils.deletePropertyInObjectIfEmpty(onuTemplates["onu-template"][templateIndex], "transport-voip-sip");
        onuTemplates["onu-template"][templateIndex]["service"] = modifiedServices;
        onuTemplates["onu-template"][templateIndex]["tcontsList"] = this.mapToList(tcontMap);
        onuTemplates["onu-template"][templateIndex]["gemPortsList"] = this.mapToList(gemPortMap);
    }
    
    requestScope.get().put("gemPortErrProfileDetails",gemPortErrProfileDetails);
}
/**
 * check if specific property of an object is empty, if yes, delete this property from object
 * use cases: profile manager sometimes return empty objects that will not work in case of tracking 
 * object's removal. So need to delete the empty objects to continue the removal
 * @param {Object} object
 * @param {String} propertyName
 */
AltiplanoUtilities.prototype.deletePropertyInObjectIfEmpty = function (object, propertyName) {
    if (object && propertyName && object.hasOwnProperty(propertyName)) {
        if (apUtils.ifObjectIsEmpty(object[propertyName])) {
            delete object[propertyName];
        }
    }
}
/**
 * check if the gemport is shared or not
 * @param {String} portName the uni-id (port name)
 * @param {Object} portsDetail details of ports (map) - under the layout -> cards (based on the portName to find)
 * @param {Object} uniServiceProfile the uni-service-profile of port defined in Ont intent
 * @param {Boolean} isEonuWithTemplate the device is EONU with template or not
 * @param {String} bestType only support the gemport sharing from 21.12
 * @returns true or false
 */
AltiplanoUtilities.prototype.isGemportShared = function (portName, portsDetail, uniServiceProfile, isEonuWithTemplate, bestType, isAutoDetectCardNoSupported) {
    if(!isAutoDetectCardNoSupported){
        if (!bestType || bestType.contains("21.3") || bestType.contains("21.6") || bestType.contains("21.9")) return false;
        if(portsDetail && portsDetail[portName] && !portsDetail[portName]["cardType"]){
            if (!portsDetail || !portsDetail[portName] || !portsDetail[portName]["portType"]
            || intentConstants.PORT_TYPES_SUPPORTED_GEMPORT_SHARING.indexOf(portsDetail[portName]["portType"]) === -1) {
            return false;
            }
        }
        if(isEonuWithTemplate && portsDetail && portName && portsDetail[portName] && portsDetail[portName]["gemport-sharing"]
        && portsDetail[portName]["gemport-sharing"] === "true"){
            return true;
        }
        if (!isEonuWithTemplate && uniServiceProfile && uniServiceProfile["gemport-sharing"] && uniServiceProfile["gemport-sharing"] === "true") {
            return true;
        }
    }else{
        if(portsDetail && portName && portsDetail[portName]){
            if(isEonuWithTemplate && portsDetail[portName]["uniConfigurationDetail"] && portsDetail[portName]["uniConfigurationDetail"]["forwarding"] && portsDetail[portName]["uniConfigurationDetail"]["forwarding"]["gemport-sharing"] && portsDetail[portName]["uniConfigurationDetail"]["forwarding"]["gemport-sharing"] === "true"){
                var cardTypeInPortsDetail = portsDetail[portName]["cardType"].toLowerCase();
                var isGemportSharing;
                var cardTypeSps = intentConstants.CARD_TYPES_SUPPORTED_GEMPORT_SHARING;
                for(var cardTypeSp in cardTypeSps){
                    if(cardTypeSps[cardTypeSp].indexOf(cardTypeInPortsDetail) !== -1){
                        isGemportSharing = true;
                    }
                }
                return isGemportSharing ? isGemportSharing : false;
            }
            if(isEonuWithTemplate && portsDetail[portName] && portsDetail[portName]["gemport-sharing"] && portsDetail[portName]["gemport-sharing"] === "true"){
                return true;
            }
        }
        if(!isEonuWithTemplate && uniServiceProfile && uniServiceProfile["gemport-sharing"] && uniServiceProfile["gemport-sharing"] === "true"){
            return true;
        }
    }
    return false;
}


AltiplanoUtilities.prototype.processMulticastKey = function (modifiedServices){
    for (var serviceIndex in modifiedServices) {
        var modifiedService = modifiedServices[serviceIndex];
        if (modifiedService["multicast"]) {
            var modifiedMulticasts = [];
            if (modifiedService["multicast"] instanceof Array){
                modifiedService["multicast"].forEach(function(multicast,index){
                    var modifiedMulticast = JSON.parse(JSON.stringify(multicast));
                    modifiedMulticasts.push(modifiedMulticast);
                });
            } else if (modifiedService["multicast"] instanceof Object) {
                var modifiedMulticast = JSON.parse(JSON.stringify(modifiedService["multicast"]));
                modifiedMulticasts.push(modifiedMulticast);
            }
            modifiedServices[serviceIndex]["multicast"] = modifiedMulticasts;
        }
    }
}

/**
 * checking if all the traffic class is tcont sharing or not
 * @param {*} tcontConfigs tcont-configs from tcont-config under service in device-config-xx or under VONU
 * in service profile of l2-user
 * @param {*} tcontProfiles tcont-profiles from l2-user
 * @param {*} fromDeviceConfig check in device-config or in l2-user
 * @returns
 */
AltiplanoUtilities.prototype.checkIfTcontSharing = function (tcontConfigs, tcontProfiles, fromDeviceConfig) {
    var tcontProfileMap = {};
    if (tcontProfiles && tcontProfiles["tcont-profile"]) {
        for (var i = 0; i < tcontProfiles["tcont-profile"].length; i++) {
            tcontProfileMap[tcontProfiles["tcont-profile"][i].name] = tcontProfiles["tcont-profile"][i];
        }
    }
    if (tcontConfigs && tcontConfigs.length > 0) {
        for (var i = 0; i < tcontConfigs.length; i++) {
            var tcontConfig = tcontConfigs[i];
            var tcontConfigDetail;
            if (fromDeviceConfig && tcontConfig["tcontConfigDetail"]) {
                tcontConfigDetail = tcontConfig["tcontConfigDetail"];
            }
            if (!fromDeviceConfig && tcontProfileMap[tcontConfig["tcont-profile-id"]]) {
                tcontConfigDetail = tcontProfileMap[tcontConfig["tcont-profile-id"]];
            }
            if (!(tcontConfigDetail && tcontConfigDetail["tcont-sharing"] === "true")) {
                return false;
            }
        }
        return true;
    }
    return false;
}

/**
 * Check if all the profile use the same traffic class or not
 * @param {Array} subscriberProfiles
 * @param {Object} qosProfiles qos-policy-policies in qos-profiles-xxx.json
 * @param {Object} policies policies in qos-profiles-xxx.json
 * @param {Object} classifiers classifiers in qos-profiles-xxx.json
 * @param {Object} caches store the value of all iterations
 * @returns String error or not: "QoS profile should have same pbit to TC mapping in all VSIs of a UNI"
 */
AltiplanoUtilities.prototype.validateGemportSharing = function (subscriberProfiles, qosProfiles, policies, classifiers, caches, onuTemplateName, serviceName, uniId) {
    if (!subscriberProfiles || subscriberProfiles.length <= 1
        || !qosProfiles || !policies || !classifiers) return;
    var subscribersList = subscriberProfiles.map(function (profile) { return profile["subscriber-ingress-qos-profile-id"] });
    var tcAndPbitMap = this.getTcAndPbitOfQosPolicies(subscribersList, qosProfiles, policies, classifiers, caches);
    var tcAndPbit = {};
    var isFirstProfile = true;
    for (var i = 0; i < subscriberProfiles.length; i++) {
        var profile = subscriberProfiles[i];
        var tcontConfigs = profile["tcont-config"];
        var profileId = profile["subscriber-ingress-qos-profile-id"];
        var trafficClassList = Object.keys(tcAndPbitMap[profileId]);
        var tcAndpbitNotSameOnServicesErrors;
        if(onuTemplateName && serviceName){
            tcAndpbitNotSameOnServicesErrors = "In the ONU Template \'" + onuTemplateName + "\' with Service \'" + serviceName + "\', QoS Policy \'" + profileId + "\' should have the same pbit to TC mapping for all services on the same UNI \'" + uniId + "\' when GEM Port Sharing is enabled";
        }else{
            tcAndpbitNotSameOnServicesErrors = "QoS Policy \'" + profileId + "\' should have the same pbit to TC mapping for all services on the same UNI \'" + uniId + "\' when GEM Port Sharing is enabled";
        }
        if (!tcontConfigs || tcontConfigs.length === 0) continue;
        var count = 0;
        for (var j = 0; j < tcontConfigs.length; j++) {
            var tcontConfig = tcontConfigs[j];
            var trafficClass;
            if (tcontConfig["traffic-class"]) {
                trafficClass = tcontConfig["traffic-class"];
            } else if (trafficClassList.length > 0) {
                trafficClass = trafficClassList[0];
            }
            if (!trafficClass) continue;
            if (isFirstProfile) {
                tcAndPbit[trafficClass] = tcAndPbitMap[profileId][trafficClass];
            } else {
                if (tcAndPbit[trafficClass]) {
                    if (String(tcAndPbit[trafficClass]["inPbitList"].sort()) !== String(tcAndPbitMap[profileId][trafficClass]["inPbitList"].sort())
                        && String(tcAndPbit[trafficClass]["pbitMarkingList"].sort()) !== String(tcAndPbitMap[profileId][trafficClass]["pbitMarkingList"].sort())) {
                        return tcAndpbitNotSameOnServicesErrors;
                    }
                } else {
                    return tcAndpbitNotSameOnServicesErrors;
                }
            }
            count++;
        }
        if (!isFirstProfile && Object.keys(tcAndPbit).length !== count) {
            return tcAndpbitNotSameOnServicesErrors;
        };
        isFirstProfile = false;
    }
    return;
}

/**
 * get Traffic and Pbits of qos policy profiles
 * @param {Array} subscriberProfiles array of qos policy profiles, ex: ["US_VOD", "US_IPTV"];
 * @param {Object} qosProfiles qos policy profiles in the qos-profiles-xxx.json
 * @param {Object} policies policies in the qos-profiles-xxx.json
 * @param {Object} classifiers policy profiles in the qos-profiles-xxx.json
 * @param {Object} caches store the value of all iterations
 * @returns Objects - map of qos policy profile with traffic class and pbit.
 * {"US_VOD" :
 * {"1" : {
 *  "inPbitList" : ["0-1"]
 *  "pbitMarkingList" : [0,1,2,3]
 * }}}
 */
AltiplanoUtilities.prototype.getTcAndPbitOfQosPolicies = function (subscriberProfiles, qosProfiles, policies, classifiers, caches) {
    if (typeof subscriberProfiles.push !== "function") return;
    var getTcAndPbitOfPolicies = function (caches, policyList, policies, classifiers) {
        var policyMap = {};
        for (var i = 0, count = 0; i < policies.length; i++) {
            var profile = policies[i];
            if (count === policyList.length) break;
            if (policyList.indexOf(profile.name) === -1) continue;
            count++;
            if (!caches["policyMap"][profile.name]) {
                var classifierList = profile["classifiers"].map(function (classifier) { return classifier.name; })
                caches["policyMap"][profile.name] = getTcAndPbitOfClassifier(caches["classifierMap"], classifierList, classifiers);
            }
            apUtils.addItemsToArrayAttributesOfMap(caches["policyMap"][profile.name], policyMap)
        }
        return policyMap;
    }
    var getPbitOfClassifier = function (classifier) {
        var matchCriteria = classifier["match-criteria"];
        var pbits = {};
        if (!classifier["classifier-action-entry-cfg"] || !matchCriteria) return {};
        if (matchCriteria["tag"]) {
            pbits["inPbitList"] = matchCriteria["tag"]["in-pbit-list"];
        }
        if (matchCriteria["pbit-marking-list"]) {
            pbits["pbitMarkingList"] = matchCriteria["pbit-marking-list"].map(function (pbit) {
                return pbit["pbit-value"];
            });
        }
        return pbits;
    }
    var getTcOfClassifier = function (classifier, pbits) {
        var tcText = "bbf-qos-cls:scheduling-traffic-class";
        var tcMountedText = "bbf-qos-cls-mounted:scheduling-traffic-class";
        var actionEntry = classifier["classifier-action-entry-cfg"];
        var inPbitList = pbits && pbits["inPbitList"] ? pbits["inPbitList"] : [];
        var pbitMarkingList = pbits && pbits["pbitMarkingList"] ? pbits["pbitMarkingList"] : [];
        var tcMap = {};
        if (!classifier["classifier-action-entry-cfg"]) return {};
        for (var i = 0, length = actionEntry.length; i < length; i++) {
            var entry = actionEntry[i];
            var type = entry["action-type"];
            if (type !== tcText && type !== tcMountedText) continue;
            var tc = entry["scheduling-traffic-class"];
            if (tcMap[tc]) {
                [].push.apply(tcMap[tc]["inPbitList"], inPbitList);
                [].push.apply(tcMap[tc]["pbitMarkingList"], pbitMarkingList);
            } else {
                tcMap[tc] = {
                    inPbitList: inPbitList,
                    pbitMarkingList: pbitMarkingList
                }
            }
        }
        return tcMap;
    }
    var getTcAndPbitOfClassifier = function (caches, classifierList, classifiers) {
        var policyMap = {};
        if (!classifierList || !classifiers || classifiers.length === 0) return policyMap;
        for (var i = 0, count = 0; (i < classifiers.length || count !== classifierList.length); i++) {
            var classifier = classifiers[i];
            if (count === classifierList.length) break;
            if (classifierList.indexOf(classifier.name) === -1) continue;
            count++;
            if (!caches[classifier.name]) {
                caches[classifier.name] = getTcOfClassifier(classifier, getPbitOfClassifier(classifier));
            }
            apUtils.addItemsToArrayAttributesOfMap(caches[classifier.name], policyMap, ["inPbitList", "pbitMarkingList"]);
        }
        return policyMap;
    }
    caches = caches ? caches : {};
    caches["qosPolicyMap"] = caches["qosPolicyMap"] ? caches["qosPolicyMap"] : {},
    caches["policyMap"] = caches["policyMap"] ? caches["policyMap"] : {},
    caches["classifierMap"] = caches["classifierMap"] ? caches["classifierMap"] : {}
    var tcAndPbits = {};
    for (var i = 0, count = 0; i < qosProfiles.length; i++) {
        var profile = qosProfiles[i];
        var policyList = profile["policy-list"].map(function (policy) { return policy.name; });
        if (count === qosProfiles.length) break;
        if (subscriberProfiles.indexOf(profile.name) === -1) continue;
        count++;
        if (!caches.qosPolicyMap[profile.name]) {
            caches.qosPolicyMap[profile.name] = getTcAndPbitOfPolicies(caches, policyList, policies, classifiers);
        }
        tcAndPbits[profile.name] = {};
        apUtils.addItemsToArrayAttributesOfMap(caches.qosPolicyMap[profile.name], tcAndPbits[profile.name], ["inPbitList", "pbitMarkingList"])
    }
    return tcAndPbits;
}

/**
 * add or update the items in map objects
 * Ex: items {a : {attribute : [2]} mapObjects {a: {attribute : [1]}} attributes [attribue]
 * => mapObjects {a: {attribute : [1, 2]}}
 * @param {*} items items(properties) need to add the map
 * @param {*} mapObjects targetMap
 * @param {*} attributes attrbutes used to add as an array
 * @returns
 */
AltiplanoUtilities.prototype.addItemsToArrayAttributesOfMap = function (items, mapObjects, attributes) {
    if (!items || Object.keys(items).length === 0) return;
    Object.keys(items).forEach(function (item) {
        if (mapObjects[item]) {
            attributes && attributes.map(function (attribute) {
                if (typeof mapObjects[item] === "function") {
                    return [].push.apply(mapObjects[item][attribute], items[item][attribute]);
                } else {
                    return mapObjects[item][attribute] = items[item][attribute];
                }
            });
        } else {
            mapObjects[item] = items[item];
        }
    });
}

/**
 * change the format of auto-negotiation parameters and return the port details
 * @param  {Object} layout layout of eonu template
 * @return {Object} the transformed layout
*/
AltiplanoUtilities.prototype.getPortsDetailAndTransformPortsStructure = function (layout, isTransformed, isAutoDetectCardNoSupported) {
    var cards = layout["cards"];
    var portsDetail = {};
    
        
    if (cards) {
        cards.forEach(function (card) {
            var ports = card["ports"];

            if (ports) {
                ports.forEach(function (port) {
                    if(!isAutoDetectCardNoSupported){
                        portsDetail[port["portName"]] = port;
                        portsDetail[port["portName"]]["cardNo"] = card["cardNo"];
                        if (!isTransformed) {
                            return;
                        }
                        apUtils.formatStringAttributeToObject(port, "portspeed");
                        apUtils.formatStringAttributeToObject(port, "duplex");
                        if (port.hasOwnProperty("frequency-sync-out-profile-id")) {
                            apUtils.formatStringAttributeToObject(port, "frequency-sync-out-profile-id");
                        }
                        if (port.hasOwnProperty("phase-sync-profile-id")) {
                            apUtils.formatStringAttributeToObject(port, "phase-sync-profile-id");
                        }
                        apUtils.formatStringAttributeToObject(port, "dot1x-authentication");
                        apUtils.formatStringAttributeToObject(port, "fec");
                    }else{
                        portsDetail[port["portName"]] = port;
                        portsDetail[port["portName"]]["cardNo"] = card["cardNo"];
                        if(card["cardType"]){
                            portsDetail[port["portName"]]["cardType"] = card["cardType"];
                        }
                        if(port.hasOwnProperty("uniConfigurationDetail")){
                            portsDetail[port["portName"]]["uniConfigurationDetail"] = port["uniConfigurationDetail"];
                        }
                        if (!isTransformed) {
                            return;
                        }
                        apUtils.formatStringAttributeToObject(port, "portspeed");
                        apUtils.formatStringAttributeToObject(port, "duplex");
                        if (port.hasOwnProperty("frequency-sync-out-profile-id")) {
                            apUtils.formatStringAttributeToObject(port, "frequency-sync-out-profile-id");
                        }
                        if (port.hasOwnProperty("phase-sync-profile-id")) {
                            apUtils.formatStringAttributeToObject(port, "phase-sync-profile-id");
                        }
                        apUtils.formatStringAttributeToObject(port, "dot1x-authentication");
                        apUtils.formatStringAttributeToObject(port, "fec");
                    }
                    
                })
            }
        })
    }
    return portsDetail;
}
/**
 * check arguments in current Object is changed or not, has an default value to compare in case of old or current value is missing
 * @param {Object} currentObject current Object
 * @param {Object} oldObject old Object was got from topology
 * @param {String} argument agument of baseArgs need to check
 * @param {String} defaultValue incase of topology didn't have the value of attribute, we can compare with
 * default value
 * @returns 
 */
 AltiplanoUtilities.prototype.isArgumentChanged = function (currentObject, oldObject, argument, defaultValue) {
     if (!oldObject || !currentObject) {
         return false;
     }
     if (oldObject[argument] && oldObject[argument].value) {
         if (currentObject[argument]) {
             return oldObject[argument].value !== currentObject[argument];
         }
         return defaultValue ? defaultValue !== oldObject[argument].value : true;
     }
     return defaultValue && currentObject[argument] ? defaultValue !== currentObject[argument] : !!currentObject[argument];
 }

/**
 * compute the VSI or GEMPORT name basing on traffic class and allow same service on uni option
 * @param  {String} prefixName VSI or GEM
 * @param  {String} uniId the UNI-ID
 * @param  {String} serviceName service name
 * @param  {String} trafficClass traffic class
 * @param  {String} serviceType Type of service
 * @param {Boolean} isGemportShared if GEMPORT is shared, the naming convention will change: GEM<tc>_<uni-id>
 * @return {String} the VSI or GemPort name
 * @
*/
AltiplanoUtilities.prototype.computeVsiOrGemPortName = function (prefixName, uniId, serviceName, trafficClass, serviceType, isGemportShared, flexibleTcontSharing, tcontConfig) {
    var component = null;
    if (serviceType && serviceType === intentConstants.SERVICE_TYPE_TRANSPARENT_FORWARD) {
        if (prefixName === "VSI") {
            component = [prefixName, uniId, "transparent"].join("_");
        } else if (prefixName === "GEM") {
            component = [prefixName.concat(trafficClass), uniId].join("_");
        }
        return component;
    }
    if (isGemportShared && trafficClass) {
        return [prefixName.concat(trafficClass), uniId].join("_");
    }
    if (flexibleTcontSharing && flexibleTcontSharing == "true") {
        if (tcontConfig["tcont-sharing"] == "false" && tcontConfig["queue-sharing"] == "false") {
            return [prefixName.concat(trafficClass), uniId, serviceName].join("_");
        } else if (tcontConfig["tcont-sharing"] == "true" && tcontConfig["queue-sharing"] == "false") {
            return [prefixName.concat(trafficClass), uniId, serviceName, "TCONT-UNI"].join("_");
        } else if (tcontConfig["tcont-sharing"] == "true" && tcontConfig["queue-sharing"] == "true") {
            return [prefixName.concat(trafficClass), uniId, serviceName, "TCONT-ONT"].join("_");
        }
    }
    if (prefixName === "GEM" && trafficClass) {
        return [prefixName.concat(trafficClass), uniId, serviceName].join("_");
    }
    return [prefixName, uniId, serviceName].join("_");
}

/**
* 1) compute the VSI name basing on the allow-same-service-on-uni defined in ont template
* 2) allow-same-service-on-uni = true then VSI = VSI + traffic class + UNI + Service
* 3) allow-same-service-on-uni = false then VSI = VSI + UNI + Service
* @param  {String} templateName the template name
* @param  {Object} modifiedServices list of modified services
* @param  {String} listKey list of service name should be created
* @param  {Object} service the service need to be changed
* @param  {Boolean} flexibleTcontSharing
* @param  {Object} contextParameters some extra parameters, {onuTemplateFileName : "onu-templates-22.6.json"}
* @return {Object} list of modified services
*/
AltiplanoUtilities.prototype.computeVsiPerService = function (templateName, modifiedServices, listKey, service, flexibleTcontSharing, contextParameters) {
    var serviceType = service["type"];
    var computedTrafficClasses = service["trafficClass"];
    var tcontConfigs = service["tcont-config"];
    var onuTemplateFileName = contextParameters && typeof contextParameters === "object" && contextParameters.onuTemplateFileName ? contextParameters.onuTemplateFileName : "ONU template";
    var validateAndUpdateServiceInTemplate = function (templateName, service, listKey, modifiedServices, trafficClass) {
        var serviceName = service["name"];
        var uniId = service["uni-id"];
        var key;
        if (trafficClass) {
            key = [serviceName, uniId, trafficClass].join("_");
        } else {
            key = [serviceName, uniId, serviceType].join("_");
        }
        if (listKey.indexOf(key) > -1) {
            var partKeyError = trafficClass ? "_'traffic-class'" : "";
            throw new RuntimeException(onuTemplateFileName + " has duplicate service with the combination of 'name'_'uni-id'" + partKeyError + ": " + listKey[listKey.indexOf(key)] + " in " + templateName);
        }
        listKey.push(key);
        var modifiedService = {};
        modifiedService = JSON.parse(JSON.stringify(service));
        modifiedService["key"] = key;
        modifiedService["vlanSubInterfaceName"] = apUtils.computeVsiOrGemPortName("VSI", uniId, serviceName, trafficClass ? trafficClass : false, serviceType);
        modifiedServices.push(modifiedService);
    }
    validateAndUpdateServiceInTemplate(templateName, service, listKey, modifiedServices, false);
}
/**
*compute the TCONT and GEMPORT basing on the tcont-config defined in ont template
* @param  {String} templateName the template name
* @param  {Object} service the service
* @param  {Object} tcontMap map of tcont
* @param  {Object} gemPortmap map of gemport
* @param  {Boolean} isGemportShared gemport sharing or not to compute the gemport name and itf reference
* @return {Object} new tcontMap and gemportMap
 */
AltiplanoUtilities.prototype.computeTcontsAndGemportPerService = function (templateName, service, tcontMap, gemPortmap, isGemportShared, flexibleTcontSharing, useProfileManager, gemPortErrProfileDetails) {
    var serviceType = service["type"];
    var tcontConfigs = service["tcont-config"];
    var computedTrafficClasses = service["trafficClass"];
    var upstreamAesIndicator = service["upstream-aes-indicator"];
    var downstreamAesIndicator = service["downstream-aes-indicator"];
    var uniId = service["uni-id"];
    var serviceName = service["name"];
    var tcontParams = {
        uniId: uniId,
        serviceName: serviceName,
    }
    if (serviceType != "VOIP-SIP") {
        if (tcontConfigs && tcontConfigs.length > 0) {
            for (var availableKey = 0; availableKey < tcontConfigs.length; availableKey++) {
                var tcontConfig = useProfileManager?tcontConfigs[availableKey].tcontConfigDetail:tcontConfigs[availableKey].tcontConfigDetail.PON.ONT;
                tcontParams.tcontProfileId = tcontConfigs[availableKey]["tcont-profile-id"];
                var tcontName;
                var trafficClass = tcontConfigs[availableKey]["traffic-class"];
                if ((flexibleTcontSharing && flexibleTcontSharing == "false"  || !flexibleTcontSharing) && !trafficClass && computedTrafficClasses && computedTrafficClasses.length > 0) {
                    var computedTrafficClassesSet = new HashSet(computedTrafficClasses);
                    if (computedTrafficClassesSet.size() > 2) {
                        throw new RuntimeException("The Traffic Class should be defined explicitly in the Service '" + serviceName + "' of template '" + templateName +"'" );
                    } else {
                        trafficClass = computedTrafficClasses[0];
                    }
                }
                if (trafficClass) {
                    tcontConfig = this.convertToTcontQueueSharingFromTcontSharingEnumForProfile(tcontConfig);
                    tcontName = this.computeTcontName(tcontParams, tcontConfig, trafficClass, tcontConfigs.length, flexibleTcontSharing);
                    var tcont = this.computeSingleTcontObject(tcontName, tcontConfig.queue, tcontConfig["tc-to-queue-mapping-profile-id"]);
                    this.addObjectToMap(tcontMap, tcont, "name");
                    var gemPortName = this.computeVsiOrGemPortName("GEM", uniId, serviceName, trafficClass, serviceType, isGemportShared, flexibleTcontSharing, tcontConfig);
                    var vlanSubInterfaceName = this.computeVsiOrGemPortName("VSI", uniId, serviceName, trafficClass, serviceType);
                    var itfRef = isGemportShared && serviceType !== intentConstants.SERVICE_TYPE_TRANSPARENT_FORWARD ? ["ENET", uniId].join("_") : vlanSubInterfaceName;
                    var gemPort = this.computeSingleGemPortObject(gemPortName, itfRef, trafficClass, tcontName, upstreamAesIndicator, downstreamAesIndicator);
                    this.addObjectToMap(gemPortmap, gemPort, "name");

                    gemPortErrProfileDetails[templateName][gemPortName] = tcontConfigs[availableKey];
                } else {
                    throw new RuntimeException("Can't find the Traffic Class in the Service '" + serviceName + "' of template '" + templateName +"'" );
                }
            }
        }
    }
}
AltiplanoUtilities.prototype.addObjectTypeToObjectIdMapGC = function(objectId, objectTypeGC, objectTypeToObjectIdMap){
    var objectIds = new ArrayList();
    if (objectTypeToObjectIdMap.containsKey(objectTypeGC)) {
        var existedObject = objectTypeToObjectIdMap.get(objectTypeGC);
        for (var i in existedObject){
            objectIds.add(existedObject[i]);
        }
        objectIds.add(objectId);
        objectTypeToObjectIdMap.put(objectTypeGC,objectIds);
    } else {
        objectIds.add(objectId);
        objectTypeToObjectIdMap.put(objectTypeGC, objectIds);
    }
}
/**
* Excute GC action for all objectIds math type with objectTypes in objectsToDoAction for deviceName of the intentType
* @param  {Object} intentType: intent Type to do GC action
* @param  {Object} objectsToDoAction: map of the list object type with action to do.
* @param  {Object} deviceName: device to do GC action
* i.e: intentType = intentConstants.INTENT_TYPE_L2_USER, objectToDoAction = [{objectTypes: ["L2 SAP"],action:{type: "invokeAction",name: "cleanPort"}}], deviceName = 135.249.41.180
* @return {Object} map of type and list object to be deleted successfully
*/
AltiplanoUtilities.prototype.doGcActionForIntentTypeOfDeviceName = function (intentType, objectsToDoAction, deviceName) {
    var garbageObjectsDeleted = new HashMap();
    var amsFwk = new AltiplanoAMSIntentHelper();
    var deviceProxy = new MObjectProxy(amsFwk, deviceName);
    var unusedObjects = ibnService.getUnusedObjects(intentType, deviceName);
    logger.debug("unusedObjects of '{}' intent type of '{}' device name: {}", intentType, deviceName, unusedObjects);
    if(unusedObjects != undefined && !unusedObjects.isEmpty()){
        var objectTypes = unusedObjects.keySet();
        objectTypes.forEach(function (objectType) {
            objectsToDoAction.forEach(function(objectToDoAction){
                var objectTypesToBeDeleted = objectToDoAction["objectTypes"];
                var arrangeObjectIds = []
                if(objectTypesToBeDeleted && objectTypesToBeDeleted.indexOf(objectType) >= 0){
                    var actionToDo = objectToDoAction["action"];
                    var objectIds = unusedObjects.get(objectType);
                    var successfullyDeletedObjectIds = new ArrayList();
                    var extraIntentTypesToBeChecked = objectToDoAction["extraIntentTypes"];
                    if(extraIntentTypesToBeChecked) {
                        var extraUsedObjectIdList = new HashSet();
                        extraIntentTypesToBeChecked.forEach(function(extraIntentType) {
                            var extraUsedObjects = topologyQueryService.getUsedObjectIdsForObjectType(deviceName, extraIntentType, null, objectTypesToBeDeleted);
                            logger.debug("extraUsedObjects of '{}' object types in '{}' intent type: {}", objectType, extraIntentType, extraUsedObjects);
                            if (extraUsedObjects != undefined && !extraUsedObjects.isEmpty()) {
                                extraUsedObjectIdList.addAll(extraUsedObjects.get(objectType));
                            }
                        });
                    }
                    if (objectType == "VLAN") {
                        for (var i = 0; i < objectIds.length; i++) {
                            if (objectIds[i].indexOf(".C") != -1){
                                arrangeObjectIds.unshift(objectIds[i]);
                            }else{
                                arrangeObjectIds.push(objectIds[i]);
                            }
                        }
                        objectIds = arrangeObjectIds;
                    }
                    for (var i = 0; i < objectIds.length; i++) {
                        if (!extraUsedObjectIdList || (extraUsedObjectIdList && !extraUsedObjectIdList.contains(objectIds[i]))) {
                            var partOfObjectId = objectIds[i].split(":");
                            var agent = partOfObjectId[2];
                            var objectId = partOfObjectId[3];
                            var objectFQDN = objectType + ":" + deviceName+ ":" + agent + ":" + objectId;
                            if (deviceProxy.isObjectExist(objectFQDN)) {
                                try {
                                    if(actionToDo){
                                        var actionType = actionToDo["type"];
                                        var actionName = actionToDo["name"];
                                        if(actionType){
                                            switch (actionType){
                                                case "delete":
                                                    logger.debug("Excute delete action for Object ID: {}", objectFQDN);
                                                    deviceProxy.delete(objectFQDN);
                                                    break;
                                                case "invokeAction":
                                                    if(actionName){
                                                        logger.debug("Excute invokeAction cleanPort for Object ID: {}", objectFQDN);
                                                        deviceProxy.invokeAction(objectFQDN, actionName);
                                                    }
                                                    break;
                                                case "deleteByCondition":
                                                    logger.debug("Excute delete action for Object ID: {}", objectFQDN);
                                                    var listVlanAssoc = deviceProxy.getAllChildrenOfType("VLAN Association",objectFQDN);
                                                    logger.debug("List vlan association {}.", JSON.stringify(listVlanAssoc));
                                                    var objectsVlanAssocUnused = unusedObjects.get("VLAN Association");
                                                    logger.debug("List vlan assciation unused {}", JSON.stringify(objectsVlanAssocUnused));
                                                    if(listVlanAssoc !== undefined && objectsVlanAssocUnused !== undefined){
                                                        for(var index = 0; index < listVlanAssoc.length; index++){
                                                            var vlanAssoArr = listVlanAssoc[index].split(":");
                                                            var vlanAssoObjectId = "ams:VLAN Association:" + vlanAssoArr[2] + ":" + vlanAssoArr[3];
                                                            for(var j = 0; j < objectsVlanAssocUnused.length; j++ ){
                                                                if(vlanAssoObjectId !== objectsVlanAssocUnused[j]){
                                                                    return;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    deviceProxy.delete(objectFQDN);
                                                    break;
                                                default:
                                                    logger.warn("Action type is incorrect for object ID: {}", objectFQDN);
                                                    break;
                                            }
                                        }else{
                                            logger.debug("Action type not found, excute delete action as default action for object ID: {}", objectFQDN);
                                            deviceProxy.delete(objectFQDN);
                                        }
                                    } else {
                                        logger.warn("Action not found for object ID: {}", objectFQDN);
                                    }
                                } catch (exception) {
                                    logger.warn("Unable to delete the Object ID : " + objectId, exception);
                                } finally{
                                    if(!deviceProxy.isObjectExist(objectFQDN)){
                                        successfullyDeletedObjectIds.add(objectIds[i]);
                                    }
                                }
                            }else{
                                successfullyDeletedObjectIds.add(objectIds[i]);
                            }
                        }
                    }
                    garbageObjectsDeleted.put(objectType, successfullyDeletedObjectIds);
                }
            });
        });
    }
    return garbageObjectsDeleted;
}

AltiplanoUtilities.prototype.checkIsNGPON2Model = function (xponType, ponPorts, fiberName, deviceName) {
    if (xponType == intentConstants.XPON_TYPE_U_NGPON) {
        return true;
    } else if (xponType == intentConstants.XPON_TYPE_XGS) {
       if (!ponPorts || (ponPorts && Object.keys(ponPorts).length == 0)) {
            return false;
        }
        var primaryPonPort =Object.keys(ponPorts)[0];
        var currentLT = primaryPonPort.split('#')[1].split(".")[0];

        var deviceType = apUtils.getNodeTypeFromEs(deviceName);
        var hwTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(deviceType);
        var listPlannedTypeFromDevice;
        var isFXDeviceType = false;
        if (deviceType.startsWith(intentConstants.ISAM_FX_PREFIX)) {
            listPlannedTypeFromDevice = apUtils.getBoardTypeFromDevice(deviceName, intentConstants.INTENT_TYPE_DEVICE_FX);
            isFXDeviceType = true;
        }
        if (deviceType.startsWith(intentConstants.ISAM_DF_PREFIX)) {
            listPlannedTypeFromDevice = apUtils.getBoardTypeFromDevice(deviceName, intentConstants.INTENT_TYPE_DEVICE_DF);
        }
        if (deviceType.startsWith(intentConstants.ISAM_SF_PREFIX)) {
            listPlannedTypeFromDevice = apUtils.getBoardTypeFromDevice(deviceName, intentConstants.INTENT_TYPE_DEVICE_SF);
        }
        var getDefaultCapProfile = function (defaultCapProfiles, plannedType){
            for(var i = 0; i < defaultCapProfiles.length; i++){
                var profile = defaultCapProfiles[i];
                if(profile["board-types"].indexOf(plannedType) != -1){
                    return profile["default-cap"];
                }
            }
        }
        var ltCapability;
        var plannedType;
        var cageMode;
        if(listPlannedTypeFromDevice){
            Object.keys(listPlannedTypeFromDevice).forEach(function (board) {
                if (board === currentLT) {
                    ltCapability = listPlannedTypeFromDevice[board]["capability-profile"];
                    plannedType = listPlannedTypeFromDevice[board]["planned-type"];
                    cageMode = listPlannedTypeFromDevice[board]["cage-mode"];
                    if(!ltCapability || ltCapability == ""){
                        var boardType = listPlannedTypeFromDevice[board]["planned-type"];
                        ltCapability = apCapUtils.getCapabilityValue(intentConstants.FAMILY_TYPE_ISAM, hwTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, 
                            intentConstants.DEFAULT_BOARD_CAPABILITY_PROFILE, boardType, null)[0];
                    }
                }
            });
        }
        if ((ltCapability && ltCapability == "ngpon"  && isFXDeviceType && cageMode != "xgs") || (!isFXDeviceType && plannedType && plannedType.startsWith("CWLT") && cageMode != "xgs")) {
            return true;
        }
        return false;
    }
    return false;
}
/**
 * Check for attribute "is-dual-gpon" under the model name in modelFriendlyNames.json
 * @param modelName friendly name of the model
 * @param xponType
 * @param familyType device family type (eg. LS-DF-CFXR-E)
 */
AltiplanoUtilities.prototype.isDualGponSfp= function (modelName, xponType, familyType) {
    var modelFriendlyNamesJson = requestScope.get().get("modelFriendlyNamesJson");
    var isDualGpon = "false";
    var models;
    var xponTypeName = (xponType === intentConstants.XPON_TYPE_25G)? "twenty-five-g" : xponType;
    if (familyType.startsWith(intentConstants.LS_DF_PREFIX)) {
        models = modelFriendlyNamesJson["downlinkSFPModels"][xponTypeName]["ponSfp"];
    } else {
        models = modelFriendlyNamesJson[xponTypeName]["ponSfp"];
    }
    models.forEach(function (model) {
        if (model.modelFriendlyName === modelName) {
            isDualGpon = model["is-dual-gpon"] ? model["is-dual-gpon"] : "false";
            return;
        }
    })
    return isDualGpon;
}
/**
 * This method used to check if an intent targettedDevices is empty and throw an error if it is empty
 * @param  targettedDevices: array of targetted devices
 * @param  intentType: intent Type
 * @param  target: intent target
 * i.e: targettedDevices = [FX, FX.IHUB, FX.LT1, FX.LT2], intentType = intentConstants.INTENT_TYPE_DEVICE_FX, target = FX
 */
AltiplanoUtilities.prototype.checkIfTargettedDevicesIsEmptyAndThrowException = function (targettedDevices, intentType, target) {
    if (targettedDevices && intentType && target) {
        if(targettedDevices.size() === 0) {
            throw new RuntimeException("Targetted devices is empty for intent type " + intentType + " for target: " + target);
        }
    }   
}

/**
 *  Utility function for getting the used profiles of a intent type
 *  returns the profiles which has the mentioned intent type and target in their used-by list
 * @param intentType
 * @param target
 * @returns {set<ImmutableProfile>} object
 */
AltiplanoUtilities.prototype.getUsedProfilesOfIntent = function (intentType, target) {
    let scopeKey = "profiles_getMyProfiles_" + intentType + "#" + target;
    if (apUtils.getContentFromIntentScope(scopeKey)) {
        return apUtils.getContentFromIntentScope(scopeKey);
    } else {
        let profileSet = profileQueryService.getMyProfiles(intentType, target);
        if (scopeKey && profileSet) {
            apUtils.storeContentInIntentScope(scopeKey, profileSet);
        }
        return profileSet;
    }
}
/**
 * Utility function for getting the used profile configuration as JSON from profile manager
 * @param intentType
 * @param intentTypeVersion
 * @param target
 * @param profileType
 * @param subtype
 * @param profilename
 * @param profileVersion
 * @param deviceRelease
 * @returns {any}
 */
AltiplanoUtilities.prototype.getProfileConfigFromProfileManager = function (intentType,intentTypeVersion, target, profileType, subtype, profilename,profileVersion,deviceRelease) {
    try {
        var matchProfileJson;
        var usedProfilesByIntent = this.getUsedProfilesOfIntent(intentType, target);
        if (usedProfilesByIntent && usedProfilesByIntent.size() > 0) {
            usedProfilesByIntent.forEach(function (profile) {
                if (profile.getProfileType() === profileType && profile.getSubtype() === subtype && profile.getName() === profilename && profile.getVersion() === profileVersion) {
                    matchProfileJson = JSON.parse(profile.getProfileConfigJSON());
                    var pwdTypes = apUtils.getSensitiveKeys(profile.getProfileConfig(), profile.getProfileType());
                    apUtils.setRedundantSensitiveKey(pwdTypes);
                }
            });
        }
        if (!matchProfileJson) {
            var intentProfileInputVo = this.createIntentProfileInputVo(profileType, subtype, profilename);
            var specificProfiles = this.getSpecificProfiles(intentType,intentTypeVersion,deviceRelease,intentProfileInputVo);
            if (specificProfiles && specificProfiles.size() > 0) {
                //Here since only a single profile will be returned if exists,
                //first object is retrieved directly
                matchProfileJson = JSON.parse(specificProfiles.stream().findFirst().get().getProfileConfigJSON());
            }
        }
        return matchProfileJson;
    } catch (e) {
        logger.warn("error in retrieving profile info from profile manager:{}", e);
    }
}

/**
 * Utility function to restrive all device details along with proifles info
 * Used for migration cases to optimize valiate method
 * @param validateInput
 * @param intentType
 * @param excludeList
 * @return deviceAndProfileInfo
 */
AltiplanoUtilities.prototype.getDeviceInfoWithAllProfiles = function(validateInput, intentType, excludeList){
    let deviceAndProfileInfo ={};
    let deviceInfo =[];

    let target = validateInput.getTarget();
    let nwSlicingUserType = this.getNetworkSlicingUserType();
    let intentVersion = validateInput.getIntentTypeVersion();
    let topology = validateInput.getCurrentTopology();
    if(topology){
        let allDevices = apUtils.getStageArgsFromTopologyXtraInfo(topology, "ALL_DEVICES");        
            for (device of allDevices){

                //Getting device details
                var deviceDetails ={};            
                if(device["familyType"].contains(intentConstants.LT_STRING)){
                    if(this.isLtDevice(device["name"])){
                        deviceDetails["name"] = device["name"];
                    }else {
                        let ltName = this.getLtDeviceName(device["name"],topology)
                        deviceDetails["name"] = ltName;
                    }                
                }else{
                    deviceDetails["name"] = device["name"];
                }            
                deviceDetails["familyTypeRelease"] = device["familyTypeRelease"];
                deviceDetails["familyType"] = device["familyType"];
                deviceDetails["managerType"] = device["managerType"];
                
                //Check whether to use profiles using CAPS
                let useProfileManager;
                if (deviceDetails["managerType"] == intentConstants.MANAGER_TYPE_AMS) {
                    useProfileManager = true;
                } else {
                    useProfileManager = apCapUtils.checkIfProfileManagerIsEnabled(deviceDetails["familyTypeRelease"]);
                }
                deviceDetails["useProfileManager"] = useProfileManager;
    
                //Get All profiles
                let allProfiles = {};
                if(isProfileUpdatesRequried){
                    allProfiles = this.getParsedProfileDetailsFromProfMgr(deviceDetails["name"], deviceDetails["familyTypeRelease"], intentType, excludeList, intentVersion, nwSlicingUserType);                
                }else{
                    allProfiles = this.getUsedProfilesOfIntentInJsonFormat(intentType, target);
                }
                if(allProfiles){
                    deviceDetails["allProfiles"] = allProfiles;                    
                } 

                
                
                deviceInfo.push(deviceDetails);
            }
            deviceAndProfileInfo["deviceInfo"] = deviceInfo;
    }
    return deviceAndProfileInfo;   

}



AltiplanoUtilities.prototype.isTopologyExistForInput = function(input){
    let topology = input.getCurrentTopology();
    if(topology){
        let topologyXtraInfo = this.getTopologyExtraInfo(topology);
        if(topologyXtraInfo){
            return true;
        }else{
            return false;
        }
    }
    return false;
}



/**
 * Utility function to restrive all device details 
 * Used for migration cases to optimize valiate method
 * @param validateInput * 
 * @return deviceInfo
 */
AltiplanoUtilities.prototype.getDeviceInfoForValidate = function(validateInput, intentType){
   let deviceDetailInfo ={};
   let deviceInfo =[];
   let topology = validateInput.getCurrentTopology();
    if(topology){
        let allDevices = apUtils.getStageArgsFromTopologyXtraInfo(topology, "ALL_DEVICES");        
            if(allDevices){
                for (let device of allDevices){
                    //Getting device details
                    let deviceDetails ={};            
                    if(device["familyTypeRelease"] && device["familyTypeRelease"].contains(intentConstants.LT_STRING)){
                        if(this.isLtDevice(device["name"])){
                            deviceDetails["name"] = device["name"];
                            deviceDetails["familyType"] = device["familyType"];
                            deviceDetails["familyTypeRelease"] = device["familyTypeRelease"]; 
                        }else {
                            let ltName = this.getLtDeviceName(device["name"], topology)
                            deviceDetails["name"] = ltName;
                            let deviceHwTypeRelease = this.splitToHardwareTypeAndVersion(device["familyTypeRelease"]);
                            deviceDetails["familyType"] = deviceHwTypeRelease.hwType;
                            deviceDetails["familyTypeRelease"] = device["familyTypeRelease"];                         
                        }                
                    }else if((device["managerType"] == intentConstants.MANAGER_TYPE_NAV) && this.isNTSupportsLT(device["name"], device["familyTypeRelease"]) && (intentType && intentType == intentConstants.INTENT_TYPE_ONT)){
                         let ltName = this.getLtDeviceName(device["name"], topology); 
                         if(ltName){
                            deviceDetails["name"] = ltName;
                            let nodeType = this.getNodeTypefromEsAndMds(ltName);
                            let deviceHwTypeRelease = this.splitToHardwareTypeAndVersion(nodeType);                            
                            deviceDetails["familyTypeRelease"] = nodeType;
                            deviceDetails["familyType"] = deviceHwTypeRelease.hwType; 
                         }                                    

                    }else{
                        deviceDetails["name"] = device["name"];
                        deviceDetails["familyType"] = device["familyType"];
                        if(device["familyTypeRelease"]){
                            deviceDetails["familyTypeRelease"] = device["familyTypeRelease"];
                        }                        
                    }            
                                   
                    deviceDetails["managerType"] = device["managerType"];
                    if(device["deviceType"]){
                        deviceDetails["deviceType"] = device["deviceType"];
                    }
                    
                    //Check whether to use profiles using CAPS
                    let useProfileManager;
                    if (deviceDetails["managerType"] == intentConstants.MANAGER_TYPE_AMS) {
                        useProfileManager = true;
                    } else {
                        useProfileManager = apCapUtils.checkIfProfileManagerIsEnabled(deviceDetails["familyTypeRelease"]);
                    }
                    deviceDetails["useProfileManager"] = useProfileManager;
                    
                    
                    deviceInfo.push(deviceDetails);
                }
            }            
            deviceDetailInfo = deviceInfo;
    }
    return deviceDetailInfo;   

}


/**
 * Utility function to restrive all  proifles info
 * Used for migration cases to optimize valiate method
 * @param validateInput
 * @param intentType
 * @param excludeList
 * @param deviceName
 * @param familTypeRelease
 * @param isGetSpecificProfileStructure
 * @return allProfiles
 */
AltiplanoUtilities.prototype.getAllProfilesForValidate = function(validateInput, intentType, excludeList, deviceName, familyTypeRelease, isGetSpecificProfileStructure){
    let allProfiles ={};
    let target = validateInput.getTarget();
    let nwSlicingUserType = this.getNetworkSlicingUserType();
    let intentVersion = validateInput.getIntentTypeVersion();
    let isProfileUpdatesRequired = validateInput.isProfileUpdatesRequired();    
   
    if(isProfileUpdatesRequired && deviceName && familyTypeRelease){          
        allProfiles = this.getParsedProfileDetailsFromProfMgr(deviceName, familyTypeRelease, intentType, excludeList, intentVersion, nwSlicingUserType);                
        if (isGetSpecificProfileStructure) {
            let updatedAllProfiles = this.transpositionProfileTypeAndSubtypeStructure(allProfiles);
            if (!this.ifObjectIsEmpty(updatedAllProfiles)) {
                allProfiles = updatedAllProfiles;
            }
        }
    }else{
        allProfiles = this.getUsedProfileDetailsFromProfMgr(intentType, target, excludeList, isGetSpecificProfileStructure);
    }
    return allProfiles;  

}

/**
 * Utility function to transposition profile-type and sub-type from parsed profile list
 * @param parsedProfileList
 * @return transpositionedProfileList
 */
AltiplanoUtilities.prototype.transpositionProfileTypeAndSubtypeStructure = function(parsedProfileList) {
    let newProfileMap = {}
    if (parsedProfileList && !this.ifObjectIsEmpty(parsedProfileList)) {
        let subtypes = Object.keys(parsedProfileList);
        if (subtypes && subtypes.length > 0) {
            for (let subtype of subtypes) {
                if (parsedProfileList[subtype]) {
                    if (!Array.isArray(parsedProfileList[subtype])) {
                        let profileTypes = Object.keys(parsedProfileList[subtype]);
                        if (profileTypes && profileTypes.length > 0) {
                            for (let profileType of profileTypes) {
                                if (parsedProfileList[subtype][profileType]) {
                                    let profileList = parsedProfileList[subtype][profileType];
                                    if (!newProfileMap.hasOwnProperty(profileType)) {
                                        newProfileMap[profileType] = {};
                                    }
                                    newProfileMap[profileType][subtype] = profileList;
                                }
                            }
                        }
                    } else {
                        newProfileMap[subtype] = parsedProfileList[subtype]
                    }
                }
            }
        }
    }
    return newProfileMap;
}
/**
 * Utility method to get ltDeviceName from ntDeviceName from topology
 * @param ntDeviceName
 * @param topology
 * @returns ltDeviceName
 */
AltiplanoUtilities.prototype.getLtDeviceName = function (ntDeviceName, topology) {
    let ltDeviceName;
    let topXtraInfo = apUtils.getTopologyExtraInfo(topology);
    let keysInTopologyXtraInfo = Object.keys(topXtraInfo);
    if (keysInTopologyXtraInfo.length != 0){
        for (let key of keysInTopologyXtraInfo){
            if (key.contains(ntDeviceName) && key.contains("_ARGS") ){
                let topoConfig = JSON.parse(topXtraInfo[key]);
                let deviceID = Object.keys(topoConfig)[0];
                if(deviceID && topoConfig[deviceID]["ltDeviceName"]){
                    let ltName = topoConfig[deviceID]["ltDeviceName"].value;
                    if(this.isLtDevice(ltName) && (ltName.indexOf(ntDeviceName) > -1)){
                    ltDeviceName =ltName;
                    break;
                    }               
                }else if(deviceID && this.isLtDevice(deviceID)){
                    ltDeviceName = deviceID;
                    break;
                }
            } 
        }
    }
    return ltDeviceName;   
}

/**
 * Utility method to get check if NT supports LT based on NT device Type
 * @param ntDeviceType
 * @returns boolean
 */
AltiplanoUtilities.prototype.isNTSupportsLT = function (ntDeviceName, ntDeviceType) {
    let isLTSupportedNT = false;
    if(ntDeviceType){
        let deviceHwTypeRelease = this.splitToHardwareTypeAndVersion(ntDeviceType);
        isLTSupportedNT =  apCapUtils.getCapabilityValue(deviceHwTypeRelease.hwType, deviceHwTypeRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.HAS_LT_SUBSYSTEM, capabilityConstants.HYPHEN_CONTEXT, false);    
        if(isLTSupportedNT && !this.isLtDevice(ntDeviceName)){
            isLTSupportedNT = true;
        } 
    }       
    return isLTSupportedNT;   
}

/**
 * Utility method to get onuModel from topology
 * @param input
 * @param deviceName
 * @returns onuModel
 */

AltiplanoUtilities.prototype.getOnuModelFromTopology = function(input, deviceName){
    let onuModel;
    let topology = input.getCurrentTopology();
    if(topology){
        let topologyXtraInfo = this.getTopologyExtraInfo(topology);
        let keysInTopologyXtraInfo = Object.keys(topologyXtraInfo);
        for(let key in keysInTopologyXtraInfo){
            if (keysInTopologyXtraInfo[key].contains(deviceName) && keysInTopologyXtraInfo[key].contains("_ARGS") ) {
                let topo = JSON.parse(topologyXtraInfo[keysInTopologyXtraInfo[key]]);
                let deviceID = Object.keys(topo)[0];
                if(deviceID && topo[deviceID]["onuModel"]){
                    if (topo[deviceID]["onuModel"] && topo[deviceID]["onuModel"].value == "Embedded") {
                        onuModel = intentConstants.ONU_MODEL_EONU;
                    } else if (topo[deviceID]["onuModel"]) {
                        onuModel =  intentConstants.ONU_MODEL_VONU;
                    } 
                }
               
            }
        }
    }
    
    return onuModel;
}


/**
 * Utility method to get onuModel from topology
 * @param input
 * @param deviceName
 * @returns onuModel
 */

AltiplanoUtilities.prototype.setDependencyInfoForValidate = function(input, intentTypeName){
    var syncDependencyInfo = {};
    var validateResultObj = new ValidateResult();    
    let intentTarget = input.getTarget();
    let resourceFile = resourceProvider.getResource(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "resources/esQueryGetDependentIntentsDetails.json.ftl");
    let templateArgs = {intentType: intentTypeName, target: intentTarget};
    let request = utilityService.processTemplate(resourceFile, templateArgs);
    let response = apUtils.executeEsIntentSearchRequest(request);
    if (apUtils.isResponseContainsData(response)) {
        for(let i = 0; i < response.hits.hits.length; i++){
            let result = response.hits.hits[i];
                if (result["_source"] && result["_source"]["dependencies"] && result["_source"]["dependencies"].length > 0) {
                    let dependencies =  result["_source"]["dependencies"];
                    for(let j in dependencies){
                        let splitKeys = dependencies[j].split("_$$_");
                        let dependencyIntentType = splitKeys[0];
                        let dependencyTarget = splitKeys[1];
                        if(dependencyTarget.indexOf("_$_") > -1){
                            dependencyTarget = dependencyTarget.replace("_$_", "#");
                        }
                        this.validateIntentTarget(dependencyIntentType, dependencyTarget);
                        syncDependencyInfo[dependencyIntentType] = [dependencyTarget];
                    }
                        
               }
        }
    } 
    validateResultObj.setDependencyInfo(this.getTransformedDependencyInfo(syncDependencyInfo));
    return validateResultObj;
}


/**
 * Utility function for extracting the release version from the nodetype-release
 * @param deviceId
 * @returns {*}
 */
AltiplanoUtilities.prototype.getLsDeviceInterfaceVersion = function (deviceId,nodeType) {
//If nodeType is not passed as parameter, nodeTyps fetched from mds
    if(!nodeType && deviceId){
        nodeType = apUtils.getNodeTypefromEsAndMds(deviceId);
    }

    if (nodeType && nodeType.length > 0) {
        return nodeType.slice(nodeType.lastIndexOf("-") + 1, nodeType.length);
    }
}

/**
 *Utility function for obtaining Associated profile names from profile manager in array format
 * @param intentType
 * @param intentVersion
 * @param deviceId
 * @param deviceReleaseVersion
 * @param profileType
 * @param subType
 * @param profileName
 * @param hardwareType
 * @return {any[]}
 */
AltiplanoUtilities.prototype.getAssociatedProfileNames = function (intentType, intentVersion, deviceId, deviceReleaseVersion, profileType, subType, profileName, hardwareType, profileList) {
    var profileNamesSet = this.getAssociatedProfiles(intentType, intentVersion, deviceId, deviceReleaseVersion, profileType, subType, profileName, hardwareType);
    var profileNames = [];
    profileNamesSet.forEach(function (profileName) {
        if (profileList && typeof profileList.push === "function") {
            var profileJson = {};
            var profileKey = profileName.getProfileType() + ":" + profileName.getProfileType();
            profileJson = JSON.parse(profileName.getProfileConfigJSON())[profileKey];
            var pwdTypes = apUtils.getSensitiveKeys(profileName.getProfileConfig(), profileName.getProfileType());
            apUtils.setRedundantSensitiveKey(pwdTypes);
            profileJson["name"] = profileName.getName();
            profileList.push(JSON.parse(JSON.stringify(profileJson, apUtils.stringReplacer)));
        }
        profileNames.push(profileName.getName());
    });
    return profileNames;
}

/**
 * Utility function for framing the IntentProfileInputVO object
 * @param profileType
 * @param subType
 * @param name
 * @returns {IntentProfileInputVO} object
 */
AltiplanoUtilities.prototype.createIntentProfileInputVo = function (profileType, subType, name) {
    var intentProfileVO = new IntentProfileInputVO();
    intentProfileVO.setName(name);
    intentProfileVO.setProfileType(profileType);
    intentProfileVO.setSubtype(subType);
    return intentProfileVO;
}
/**
 * Function for retrieving the profile passed in intentProfileInputVos,
 * when these profiles are not returned in getUsedByProfiles() function
 * @param intentType
 * @param intentTypeVersion
 * @param deviceRelease
 * @param intentProfileInputVos
 * @returns {*}
 */
AltiplanoUtilities.prototype.getSpecificProfiles = function (intentType, intentTypeVersion, deviceRelease, intentProfileInputVos) {
    return profileQueryService.getSpecificProfiles(intentType, intentTypeVersion, deviceRelease, Arrays.asList(intentProfileInputVos));
}
/**
 * Function for retrieving the profile passed in intentProfileInputVos,
 * when these profiles are not returned in getUsedByProfiles() function
 * @param intentType
 * @param intentTypeVersion
 * @param deviceRelease
 * @param hardwareType
 * @param intentProfileInputVos
 * @returns {*}
 */
 AltiplanoUtilities.prototype.getSpecificProfiles = function (intentType, intentTypeVersion, deviceRelease, hardwareType, intentProfileInputVos) {
    return profileQueryService.getSpecificProfiles(intentType, intentTypeVersion, deviceRelease,hardwareType, Arrays.asList(intentProfileInputVos));
}
/**
 * utility function for retrieving the associated profiles without config from profile manager
 *
 * @param intentType
 * @param intentVersion
 * @param deviceId
 * @param deviceReleaseVersion
 * @param profileType
 * @param subType
 * @param profileName
 * @param hardwareType
 * @returns {*}
 */
AltiplanoUtilities.prototype.getAssociatedProfiles = function (intentType, intentVersion, deviceId, deviceReleaseVersion, profileType, subType, profileName, hardwareType) {
    if (!deviceReleaseVersion && deviceId) {
        deviceReleaseVersion = apUtils.getLsDeviceInterfaceVersion(deviceId,deviceReleaseVersion);
    }

    return profileQueryService.getAssociatedProfiles(intentType, intentVersion, profileType, subType, deviceReleaseVersion, profileName, hardwareType, null, null);
}

/**
 * It will fetch specific Intent type with associated Profile and Config
 * @param nodeType
 * @param intentType
 * @param intentTypeVersion
 * @param profileType
 * @param subType
 * @param networkSlicingUserType
 * 
 * @return []
 */
 AltiplanoUtilities.prototype.getAssociatedProfilesWithConfigForIntentType = function (nodeType, intentType, intentTypeVersion, profileType, subType, networkSlicingUserType, storeInIntentScope) {
    var profileList = [];
    var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
    var tempProfiles = apUtils.getAssociatedProfilesWithConfig(intentType,intentTypeVersion,profileType,subType,deviceTypeAndRelease.release,null,null,networkSlicingUserType, storeInIntentScope);
  	tempProfiles.forEach(function(qosProfile){
        var profileJson = {};
        var profileKey = qosProfile.getProfileType() + ":" + qosProfile.getProfileType();
      	profileJson = JSON.parse(qosProfile.getProfileConfigJSON())[profileKey];
        var pwdTypes = apUtils.getSensitiveKeys(qosProfile.getProfileConfig(), qosProfile.getProfileType());
        apUtils.setRedundantSensitiveKey(pwdTypes);
      	profileJson["name"] = qosProfile.getName();
        profileList.push(JSON.parse(JSON.stringify(profileJson, apUtils.stringReplacer)));
    });
    return profileList;
}
/**
 * Method flat number range string to number array
 * Input:   0
            0,1,2
            0-7
            0,1, 4-7
    Output: [0]
            [0,1,2]
            [0,1,2,3,4,5,6,7]
            [0,1,4,5,6,7]
 *
 * @param {String} numberRange
 * @returns {Array}
 */
AltiplanoUtilities.prototype.flatNumberRangeToArray = function (numberRange) {
    var arrNumber = [];
    if (numberRange) {
        var numberList = numberRange.split(",");
        for (var idx in numberList) {
            var ele = numberList[idx];
            var splits = ele.split("-");
            if (splits.length == 1) { //No "-" in element
                arrNumber.push(parseInt(ele));
            } else {
                var lowerLimit = parseInt(splits[0]);
                var upperLimit = parseInt(splits[1]);
                for (var i = lowerLimit; i <= upperLimit; i++) {
                    arrNumber.push(i);
                }
            }
        }
    }
    return arrNumber;
};

/**
 * Method covert string to number array
 * Input:   ["0","1","2"]
    Output: [0,1,2]
 *
 * @param {Array} arrString
 * @returns {Array}
 */
AltiplanoUtilities.prototype.convertStringToNumberArray = function (arrString) {
    var arrNumber = [];
    if (arrString) {
        for (var idx in arrString) {
            arrNumber.push(parseInt(arrString[idx]));
        }
    }
    return arrNumber;
};

AltiplanoUtilities.prototype.convertArrayToArrayObject = function (arr) {
    var obj = [];
    for (var i in arr) {
        obj.push({ "key": arr[i], "value": arr[i] });
    }
    return obj;
};

/**
 *
 * @param used to retrieve content stored in IntentScope, by referencing a key
 * @returns content
 */
AltiplanoUtilities.prototype.getContentFromIntentScope = function (scopeKey){
    try{
        return  (IntentScope.isTemplateUsed() &&
            IntentScope.getCurrentScope()!=null && IntentScope.getCurrentScope().getFromCache(scopeKey)!=null) ?
            IntentScope.getCurrentScope().getFromCache(scopeKey) : null;
    }catch(e){
        logger.error("Getting content for key {} from cache failed: {}",scopeKey, e.message);
        return;
    }
}

/**
 * @param used to store content in IntentScope, by referencinf value to a key
 * storing content in IntentScope, is just like in requestScope. except it has a higher scope
 * i.e scope is valid for a full intent operation
 * @returns content
 */
AltiplanoUtilities.prototype.storeContentInIntentScope = function (scopeKey, content){
    try{
        if(IntentScope.isTemplateUsed() &&
            IntentScope.getCurrentScope()!=null && content!=null){
            IntentScope.getCurrentScope().putInCache(scopeKey, content);
        }
        return content;
    }catch(e){
        logger.error("Caching content for key {} failed: {}",scopeKey, e.message);
        return;
    }
}

/**
 * Retrieves Intents version & configuration from the IBN.Then store it in cache, for easy retrieval in subsequent use.
 * @param keyInRequestScope, any string used as key to store/retrieve content from IntentScope
 * @param intentType, ex: intentConstants.INTENT_TYPE_ONT
 * @param intentTarget, target of intent
 * @param intentListKeyFunction, mapper for lists used in intent-type yang
 * @returns {{intentVersion: *, intentConfig: * format in JSON}}
 */
AltiplanoUtilities.prototype.getIntentDetailsFromIBNOrRequestScope = function (keyInRequestScope, intentType, intentTarget, intentListKeyFunction){
    var fetchKey = keyInRequestScope.concat("_",intentType,"_",intentTarget);
    var intentDetails = this.getContentFromIntentScope(fetchKey);
    if(!intentDetails){
        var intent  = apUtils.getIntent(intentType, intentTarget);
        if(intent){
            intentDetails =  intent ? {
                intentConfig : this.convertIntentConfigXmlToJson(intent.getIntentConfig(), intentListKeyFunction),
                intentVersion: intent.getIntentTypeVersion()
            } : null;
            this.storeContentInIntentScope(fetchKey, intentDetails);
        }
    }
    return intentDetails;
}

/**
 * Retrieves target devices from topoObjects(except IHUB) & stores it in requestScope
 * & can be retrieved in getTargettedDevices in same intent-type
 * Method to be used in synchronize function of an intent-type
 * @param topoObjects
 */
AltiplanoUtilities.prototype.storeTargettedDevicesInScope = function (topoObjects){
    var devices = (topoObjects && topoObjects.size()) ? (topoObjects.stream().map(function(topoObj) {
        return topoObj.getObjectDeviceName()}).filter(function(deviceName){
        return !deviceName.contains(intentConstants.DOT_LS_FX_IHUB)}).
    distinct().collect(Collectors.toList())) : new ArrayList();
    this.storeContentInIntentScope("targettedDevices", devices);
}

AltiplanoUtilities.prototype.storeTargettedDevicesInScopeForBulkSync = function (topoObjects, targetName){
    var devices = (topoObjects && topoObjects.size()) ? (topoObjects.stream().map(function(topoObj) {
        return topoObj.getObjectDeviceName()}).filter(function(deviceName){
        return !deviceName.contains(intentConstants.DOT_LS_FX_IHUB)}).
    distinct().collect(Collectors.toList())) : new ArrayList();
    let scopeKey = "targettedDevices_" + targetName;
    this.storeContentInIntentScope(scopeKey, devices);
}

/**
 * Method to be used in getTargettedDevices of an intent-type,
 * to retrieve targettedDevice from cache(saves time of re-computing it again).
 * @returns ArrayList()( if device list present in cache)
 */
AltiplanoUtilities.prototype.getTargettedDevicesFromScope = function (){
    return this.getContentFromIntentScope("targettedDevices");
}

AltiplanoUtilities.prototype.getTargettedDevicesFromScopeForBulkSync = function (targetName){
    let scopeKey = "targettedDevices_" + targetName;
    return this.getContentFromIntentScope(scopeKey);
}

/**
 * Method to be used to find out whether a device is of type
 * model1 or model2 based on devicetype
 * @returns String MODEL1 or MODEL2
 */
AltiplanoUtilities.prototype.getDeviceModelType = function (deviceType, deviceRelease) {
    if (deviceType && deviceRelease) {
        var modelType = apCapUtils.getCapabilityValue(deviceType, deviceRelease,capabilityConstants.DEVICE_CATEGORY,capabilityConstants.MODEL_TYPE, capabilityConstants.HYPHEN_CONTEXT, "MODEL1");
        return (modelType && modelType.length > 0) ? modelType[0] : null;
    }
    if (deviceType) {
        if (deviceType.toLowerCase().contains("model2") || deviceType.toLowerCase().contains("model-2")) {
            return "MODEL2";
        } else if (deviceType.startsWith("SX4F")){
            return "SX4F";
        } else {
            return "MODEL1";
        }
    }
    return null;
}

/**
 * protect sensitive data on logging.
 */

AltiplanoUtilities.prototype.maskSensitiveData = function (obj, keys) {
    var self = this;
    if (obj instanceof Array) {
        obj.forEach(function(item) {
            self.maskSensitiveData(item, keys)
        });
    } else if (typeof obj === 'object') {
        Object.getOwnPropertyNames(obj).forEach(function(key) {
            if (keys.indexOf(key) !== -1) {
                //delete obj[key];
                obj[key] = "*****";
            } else {
                if (obj[key]) {
                    self.maskSensitiveData(obj[key], keys);
                }
            }
        });
    }
}

AltiplanoUtilities.prototype.protectSensitiveData = function (dataObj, inputPropertiesToHide, returnAsObject) {
    if(dataObj && Object.keys(dataObj).length > 0 &&
        (inputPropertiesToHide && inputPropertiesToHide instanceof Array && inputPropertiesToHide.length > 0)) {
        var cloneDataObj = JSON.parse(JSON.stringify(dataObj));
        this.maskSensitiveData(cloneDataObj, inputPropertiesToHide);
        if(!returnAsObject) {
            return JSON.stringify(cloneDataObj);
        } else {
            return cloneDataObj;
        }
    } else {
        if(!returnAsObject) {
            return JSON.stringify(dataObj);
        } else {
            return dataObj;
        }
    }
}

/**
 * Utility function for returning the profile that exactly matches with the
 * specified profile name, from the associated profiles
 * @param intentType
 * @param intentVersion
 * @param deviceId
 * @param deviceReleaseVersion
 * @param profileType
 * @param subType
 * @param profileName
 * @param hardwareType
 * @returns {ImmutableProfile}
 */
AltiplanoUtilities.prototype.getSpecifiedAssociatedProfile = function (intentType, intentVersion, deviceId, deviceReleaseVersion, profileType, subType, profileName, hardwareType) {
    var profileSet = this.getAssociatedProfiles(intentType, intentVersion, deviceId, deviceReleaseVersion, profileType, subType, profileName, hardwareType);
    if (profileSet && profileSet.size() > 0) {
        var profile;
        var iterator = profileSet.iterator();
        while (iterator.hasNext()) {
            profile = iterator.next();
            if (profileName === profile.getName()) {
                return profile;
            }
        }
    }
}

/** Iterate over the list of values and check for matching searchElement
 * @param args - list of values
 * @param searchElement - a string
 * @return true or false
 */
AltiplanoUtilities.prototype.findAndMatchString = function (args, searchElement) {
    var isMatchFound = false;
    if(args) {
        args.forEach(function (value) {
            if (value === searchElement) {
                isMatchFound = true;
            }
        });
    }
    return isMatchFound;
}

/**
 * function for checking if IHUB is supported or not ( device version from 21.9 )
 * @param {String} familyTypeRelease familyTypeRelease of device
 * @param {String} deviceName device name
 * @param {Array} supportedDeviceTypes array of supported devices
 * @returns {Boolean} IHUB's supported or not
 */
AltiplanoUtilities.prototype.isMFsupportsIhub = function (familyTypeRelease, deviceName, supportedDeviceTypes) {
    var bestType;
    if (deviceName) {
        bestType = apUtils.getBestKnownTypeByDeviceName(deviceName, supportedDeviceTypes);
    } else if (familyTypeRelease) {
        bestType = apUtils.getBestKnownTypeByFamilyType(familyTypeRelease, supportedDeviceTypes);
    }
    var deviceVerison = apUtils.getLsDeviceInterfaceVersion(null, bestType);
    if (deviceVerison && deviceVerison !== "20.9" && deviceVerison !== "21.3" && deviceVerison !== "21.6") {
        return true;
    }
    if(deviceName) {
        var version = this.getIntentVersion(intentConstants.INTENT_TYPE_DEVICE_MF, deviceName);
        var deviceMfIntentConfig = this.getIntentConfig(intentConstants.INTENT_TYPE_DEVICE_MF, version, deviceName);
        if(deviceMfIntentConfig) {
            var deviceMfIntentConfigJson = this.convertIntentConfigXmlToJson(deviceMfIntentConfig, null, null);
            deviceVerison = deviceMfIntentConfigJson["device-version"];
            if (deviceVerison && deviceVerison !== "20.9" && deviceVerison !== "21.3" && deviceVerison !== "21.6") {
                return true;
            }
        }
	}
    return false;
}


/**
 * Method to check if IHUB is supported by LS-DF
 * @param {String} familyTypeRelease familyTypeRelease of device
 * @param {String} deviceName device name
 * @returns {Boolean} IHUB's supported or not
 */
 AltiplanoUtilities.prototype.isDFsupportsIhub = function (hardwareType, release) {
    var portMappingCaps = apCapUtils.getCapabilityCategory(hardwareType, release, capabilityConstants.PORT_MAPPING_CATEGORY);
    
    // If there is no port-mapping defined, then a dedicated ihub device handles it
    return !(portMappingCaps && portMappingCaps.length > 0);
 }

/**
 * function for checking whether default Lag configuration Exist or not in MF IHUB device
 * @param {String} deviceName  MF device name * 
 * @returns {Boolean} true or false
 */
 AltiplanoUtilities.prototype.isDefaultLagExistOnLsMfIhub = function (deviceName, supportedDeviceTypes){
  if(deviceName && supportedDeviceTypes){
  var isIhubSupported = this.isMFsupportsIhub(null, deviceName, supportedDeviceTypes);
  if(isIhubSupported){
      var nniIdsFromUplinkConnection = this.getNniIdsFromUplinkConnection(deviceName);
      if(!nniIdsFromUplinkConnection[0] || nniIdsFromUplinkConnection[0].isEmpty()){
         return true;  
      }
      else{
         return false; 
      } 
   }else if(isIhubSupported === false){
       return false;
    }
  }
}

/**
 * function to get Uplink port name from Default NNI ID*
 * @param {resource} resource file
 * @param {templateArgs} 
 * @returns {String} uplinkPortName from Default NNI ID
 */
 AltiplanoUtilities.prototype.getUplinkPortNameForDefaultNNIID = function (resource, templateArgs){ 
    try{
        var extractedDeviceSpecificDataNode = this.getExtractedDeviceSpecificDataNode(resource, templateArgs);
        if (extractedDeviceSpecificDataNode) {
           var lagName = apUtils.getNodeValue(extractedDeviceSpecificDataNode, "conf:configure/conf:lag/conf:lag-index", this.prefixToNsMap);
           if(lagName){
               uplinkPortName = "lag-" + lagName;
           }
           else{
              throw new RuntimeException("Default Lag not exist in device"); 
           }
       } 
   }
   catch (e) {
    logger.error("Error while getting Default Lag from device {}", e.message);
   }
   return uplinkPortName;
}

/**
 * function for checking the proper mapping.json file in uplinkconnection intent)
 * @param {String} familyTypeRelease familyTypeRelease of device
 * @param {String} deviceName device name
 * @param {Array} supportedDeviceTypes array of supported devices
 * @returns {Boolean} Ithe mapping.json
 */
AltiplanoUtilities.prototype.getUplinkConnectionMappingFile = function (familyTypeRelease, deviceName, supportedDeviceTypes) {
    var bestType;
    if (deviceName) {
        bestType = apUtils.getBestKnownTypeByDeviceName(deviceName, supportedDeviceTypes);
    } else if (familyTypeRelease) {
        bestType = apUtils.getBestKnownTypeByFamilyType(familyTypeRelease, supportedDeviceTypes);
    }
    var deviceVerison = apUtils.getLsDeviceInterfaceVersion(null, bestType);
    if (deviceVerison && deviceVerison !== "21.3" && deviceVerison !== "21.6") {
        return "mapping-21.9.json";
    }
    return "mapping.json";
}

/** Iterate over the list of values, check for matching searchElement and remove it from args if matching
 * @param args - list of values
 * @param searchElement - a string
 * @return true or false
 */
AltiplanoUtilities.prototype.findMatchAndRemoveString = function (args, searchElement) {
    var isMatchFound = false;
    if(args) {
        args.forEach(function (value) {
            if (value === searchElement) {
                isMatchFound = true;
            }
        });
    }
    if (isMatchFound) args.remove(searchElement);
    return isMatchFound;
}

/** Getting all Shelf and LT devices from fiber name
 * @param fiberName - fiber name
 * @return fiberDeviceDetails with its Node Type
 */
AltiplanoUtilities.prototype.getFiberDeviceDetails = function (fiberName) {
    var fiberDeviceDetails = {};
    if (fiberName) {
        var fiberIntentConfig = apUtils.getFiberIntentConfigJson(fiberName);
        if (fiberIntentConfig["pon-port"]) {
            var deviceInfo = {};
            var ltDeviceNames = [];
            var nodeType;
            var ponPortKeys = Object.keys(fiberIntentConfig["pon-port"]);
            ponPortKeys.forEach(function (ponPortKey) {
                var splitsKey = ponPortKey.split('#');
                var deviceName = splitsKey[0];
                var ponPort = splitsKey[1];
                nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
                if (nodeType.startsWith(intentConstants.LS_FX_PREFIX) || nodeType.startsWith(intentConstants.LS_MF_PREFIX) || nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
                    var ltCard = ponPort.split(".")[0];
                    var ltBoard = deviceName + intentConstants.DEVICE_SEPARATOR + ltCard;
                    if (fiberDeviceDetails["deviceInfo"] && fiberDeviceDetails["deviceInfo"][deviceName]) {
                        ltDeviceNames = fiberDeviceDetails["deviceInfo"][deviceName];
                    }
                    if (ltDeviceNames.indexOf(ltBoard) < 0) {
                        ltDeviceNames.push(ltBoard);
                    }
                    deviceInfo[deviceName] = ltDeviceNames;
                } else {
                    deviceInfo[deviceName] = deviceName;
                }
            });
            fiberDeviceDetails["nodeType"] = nodeType;
            fiberDeviceDetails["deviceInfo"] = deviceInfo;
        }
    }
    return fiberDeviceDetails;
};

/**
 * It is used to find clock mgnt support in shelf
 * @param deviceInfo
 * @retrun boolean
 */

AltiplanoUtilities.prototype.isClockMgmtSupportedForNT = function (deviceInfo,isSliceowner) {
    var deviceTypeRelease = apUtils.splitToHardwareTypeAndVersion(deviceInfo.familyTypeRelease);
    var shelfRegEx = "([A-Z]+)-([A-Z]+)-([A-Z]+-[A-Z])-([A-Z0-9-.]*)";
    var matches = deviceInfo.familyTypeRelease.match(shelfRegEx);
    if (isSliceowner && deviceInfo.familyTypeRelease.contains("-IHUB")) {
        var isClockMgmtSupported = apCapUtils.getCapabilityValue(deviceTypeRelease.hwType.replace("-IHUB",""), deviceTypeRelease.release, capabilityConstants.BOARD_CATEGORY,
        capabilityConstants.IS_CLOCK_MGMT_SUPPORTED, matches[3], false);
    } else {
        if (deviceTypeRelease.hwType.startsWith(intentConstants.LS_DF_PREFIX)) {
            var boardNT = apCapUtils.getCapabilityContext(deviceTypeRelease.hwType, deviceTypeRelease.release, capabilityConstants.BOARD_CATEGORY,"slot-type","NT");
        } else {
            var boardNT = matches[3];
        }
        var isClockMgmtSupported = apCapUtils.getCapabilityValue(deviceTypeRelease.hwType, deviceTypeRelease.release, capabilityConstants.BOARD_CATEGORY,
            capabilityConstants.IS_CLOCK_MGMT_SUPPORTED, boardNT, false);
    }
    return isClockMgmtSupported;
}



/**
 * It is used to find mirroring supported for NT or not
 * @param nodeType
 * @retrun boolean
 */

AltiplanoUtilities.prototype.isPacketCaptureSupportedForNT = function (nodeType) {
    var deviceTypeRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
    var shelfRegEx = "([A-Z]+)-([A-Z]+)-([A-Z]+-[A-Z])-([A-Z0-9-.]*)";
    var matches = nodeType.match(shelfRegEx);
    if (nodeType.contains("-IHUB") && !deviceTypeRelease.hwType.startsWith(intentConstants.LS_DF_PREFIX)) {
        var isPacketCaptureSupported = apCapUtils.getCapabilityValue(deviceTypeRelease.hwType.replace("-IHUB",""), deviceTypeRelease.release, capabilityConstants.BOARD_CATEGORY,
        capabilityConstants.IS_MIRRORING_SUPPORTED, matches[3], false);
    } else {
        if (deviceTypeRelease.hwType.startsWith(intentConstants.LS_DF_PREFIX)) {
            var boardNT = apCapUtils.getCapabilityContext(deviceTypeRelease.hwType, deviceTypeRelease.release, capabilityConstants.BOARD_CATEGORY,"slot-type","NT");
        } else {
            var boardNT = matches[3];
        }
        var isPacketCaptureSupported = apCapUtils.getCapabilityValue(deviceTypeRelease.hwType, deviceTypeRelease.release, capabilityConstants.BOARD_CATEGORY,
            capabilityConstants.IS_MIRRORING_SUPPORTED, boardNT, false);
    }
    return isPacketCaptureSupported;
}
/**
 * It is used to find clock gnss mgnt support in shelf
 * @param deviceInfo
 * @retrun boolean
 */

 AltiplanoUtilities.prototype.isClockGNSSInterfaceSupportedForNT = function (deviceInfo) {
    var deviceTypeRelease = apUtils.splitToHardwareTypeAndVersion(deviceInfo.familyTypeRelease);
    if (!deviceTypeRelease.hwType.contains("-IHUB")) {
        var shelfRegEx = "([A-Z]+)-([A-Z]+)-([A-Z]+-[A-Z])-([A-Z0-9-.]*)";
        var matches = deviceInfo.familyTypeRelease.match(shelfRegEx);
        var isClockMgmtSupported = apCapUtils.getCapabilityValue(deviceTypeRelease.hwType, deviceTypeRelease.release, capabilityConstants.BOARD_CATEGORY,
            capabilityConstants.IS_CLOCK_GNSS_INTERFACE_SUPPORTED, matches[3], false);
        return isClockMgmtSupported;
    } else {
        return false;
    }
}

/**
 * It is used to find clock bits mgnt support in shelf
 * @param deviceInfo
 * @retrun boolean
 */

 AltiplanoUtilities.prototype.isClockBITSInterfaceSupportedForNT = function (deviceInfo) {
    var deviceTypeRelease = apUtils.splitToHardwareTypeAndVersion(deviceInfo.familyTypeRelease);
    if (!deviceTypeRelease.hwType.contains("-IHUB")) {
        var shelfRegEx = "([A-Z]+)-([A-Z]+)-([A-Z]+-[A-Z])-([A-Z0-9-.]*)";
        var matches = deviceInfo.familyTypeRelease.match(shelfRegEx);
        var isClockMgmtSupported = apCapUtils.getCapabilityValue(deviceTypeRelease.hwType, deviceTypeRelease.release, capabilityConstants.BOARD_CATEGORY,
            capabilityConstants.IS_CLOCK_BITS_INTERFACE_SUPPORTED, matches[3], false);
        return isClockMgmtSupported;
    } else {
        return false;
    }
}

/**
 * It is used to find clock mgnt support in LT Board
 * @param ltDeviceInfo
 * @retrun boolean
 */

AltiplanoUtilities.prototype.isClockMgmtSupportedForLT = function (ltDeviceInfo) {
    var deviceType = ltDeviceInfo.familyType;
    if (deviceType.startsWith("LS-FX")) {
        var shelfRegEx = "([A-Z]+)-([A-Z]+)-([A-Z]+-[A-Z])-([A-Z0-9-.]*)";
        var matches = ltDeviceInfo.familyTypeRelease.match(shelfRegEx);
        var ltBoardName = matches[3];
    } else if (deviceType.startsWith("LS-DF")) {
        var ltBoardName = ltDeviceInfo.familyType.replace("LS-DF-", "");
    }
    var deviceTypeRelease = apUtils.splitToHardwareTypeAndVersion(ltDeviceInfo.familyTypeRelease);
    var isClockMgmtSupported = apCapUtils.getCapabilityValue(deviceTypeRelease.hwType, deviceTypeRelease.release, capabilityConstants.BOARD_CATEGORY,
        capabilityConstants.IS_CLOCK_MGMT_SUPPORTED, ltBoardName, false);
    return isClockMgmtSupported;
}

/**
 * It is used to find subtending port support in LT Board
 * @deprecated To be removed after Caps included in all variants in 22.6
 * @param {String} deviceType LT board
 * @returns boolean
 */
AltiplanoUtilities.prototype.isSubtendingPortSupported = function (deviceType) {
    if (deviceType.startsWith("LS-FX-FGLT-D") || deviceType.startsWith("LS-FX-FWLT-C") || deviceType.startsWith("LS-FX-FELT-B") || deviceType.startsWith("LS-FX-FELT-D")) {
        return true;
    }
    return false;
}

/**FNMS-92186
 * It's used to check if the device supports vpipe service in cross-connect or not
 * based on the capabilities of the device, default for fx is true and for mf is false
 * @param {String} deviceType NT device type
 * @returns 
 */
AltiplanoUtilities.prototype.isVpipeServiceSupported = function (deviceType) {
    var defaultValue = false;
    if (deviceType && deviceType.startsWith(intentConstants.LS_FX_PREFIX)){
        defaultValue = true;
    }
    if (deviceType) {
        var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(deviceType);
        return apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_VPIPE_SERVICE_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, defaultValue);
    }
    return false;
}

/**FNMS-92186
 * It's used to check if the device supports vpipe group service in cross-connect or not
 * based on the capabilities of the device, default for fx is true and for mf is false
 * @param {String} deviceType NT device type
 * @returns 
 */
AltiplanoUtilities.prototype.isVpipeGroupServiceSupported = function (deviceType) {
    var defaultValue = false;
    if (deviceType && deviceType.startsWith(intentConstants.LS_FX_PREFIX)){
        defaultValue = true;
    }
    if (deviceType) {
        var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(deviceType);
        return apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_VPIPE_GROUP_SERVICE_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, defaultValue);
    }
    return false;
}
/**
 * FNMS-92186
 * get the default value of l2-service transport type
 * @param {String} nodeType
 * @returns vpipe for ls-fx and v-vpls for mf
 */
AltiplanoUtilities.prototype.getDefaultL2ServiceTransportType = function (nodeType) {
    if (nodeType && nodeType.startsWith(intentConstants.LS_FX_PREFIX)) {
        return "vpipe";
    } else {
        return "v-vpls";
    }
}


/**
 * It is is used to validate duplication of VLAN ID
 * @param deviceName - device name
 * @param serviceTarget - service name
 * @param taggedType - tagged type
 * @param vlanIds - list vlan id
 * @param resourceFile - ftl file to get vlan id
 * @param nniDetails - NNI IDs details
 * @retrun boolean
 */
AltiplanoUtilities.prototype.isVlanIdExist = function (deviceName, serviceTarget, taggedType, vlanIds, resourceFile, nniDetails) {
    var result = false;
    var templateArgs = {
        deviceID: deviceName,
        taggedType: taggedType,
        vlanIds: vlanIds
    };

    var isMultipleNNIIDs = false;
    if (nniDetails && nniDetails.length > 1) {
        isMultipleNNIIDs = true;
    }

    try {
        var node = apUtils.getExtractedDeviceSpecificDataNode(resourceFile, templateArgs);
        if (node) {
            var interfaceNames = apUtils.getAttributeValues(node, "if:interfaces/if:interface/if:name", apUtils.prefixToNsMap);
            if (interfaceNames && nniDetails) {
                for (var i = 0; i < nniDetails.length; i++) {
                    var suffix = i + 1;
                    var interfaceNameFromTarget = isMultipleNNIIDs ? serviceTarget + "_" + suffix : serviceTarget;
                    for (var j = 0; j < interfaceNames.length; j++) {
                        var interfaceName = interfaceNames[i];
                        if (taggedType == "single_tagged" || taggedType == "SINGLETAG_1000") {
                            var xpathTag0 = "if:interfaces/if:interface[if:name=\'" + interfaceName + "\']/bbf-subif:inline-frame-processing/bbf-subif:ingress-rule/bbf-subif:rule[bbf-subif:name=\'" + taggedType + "\']"
                                + "/bbf-subif:flexible-match/bbf-subif-tag:match-criteria/bbf-subif-tag:tag[bbf-subif-tag:index=0]/bbf-subif-tag:dot1q-tag/bbf-subif-tag:vlan-id/text()";
                            var vlanIdTag0 = apUtils.getNodeValue(node, xpathTag0, apUtils.prefixToNsMap);
                            if (vlanIds[0] == vlanIdTag0 && interfaceName != interfaceNameFromTarget) {
                                result = true;
                                break;
                            }
                        } else if (taggedType == "double_tagged") {
                            var xpathTag0 = "if:interfaces/if:interface[if:name=\'" + interfaceName + "\']/bbf-subif:inline-frame-processing/bbf-subif:ingress-rule/bbf-subif:rule[bbf-subif:name=\'" + taggedType + "\']"
                                + "/bbf-subif:flexible-match/bbf-subif-tag:match-criteria/bbf-subif-tag:tag[bbf-subif-tag:index=0]/bbf-subif-tag:dot1q-tag/bbf-subif-tag:vlan-id/text()";
                            var vlanIdTag0 = apUtils.getNodeValue(node, xpathTag0, apUtils.prefixToNsMap);
    
                            var xpathTag1 = "if:interfaces/if:interface[if:name=\'" + interfaceName + "\']/bbf-subif:inline-frame-processing/bbf-subif:ingress-rule/bbf-subif:rule[bbf-subif:name=\'" + taggedType + "\']"
                                    + "/bbf-subif:flexible-match/bbf-subif-tag:match-criteria/bbf-subif-tag:tag[bbf-subif-tag:index=1]/bbf-subif-tag:dot1q-tag/bbf-subif-tag:vlan-id/text()";
                            var vlanIdTag1 = apUtils.getNodeValue(node, xpathTag1, apUtils.prefixToNsMap);
    
                            if (vlanIds[0] == vlanIdTag0 && vlanIds[1] == vlanIdTag1 && interfaceName != interfaceNameFromTarget) {
                                result = true;
                                break;
                            }
                        }
                    }
                    if (result) {
                        break;
                    }
                }
            }
        }
    } catch (e) {
        logger.error("Error while getting interface from Vlan Id ", e);
    }
    return result;
}

/**
 * It is is used to convert all associated profiles into nputvos so as to input to get specific profiles to get the attributes and values
 * @param immutableProfiles the profiles fetched from getassociatedprofiles
 * @param deviceRelease - device release
 * @return list - list of all profile as inputvos
 */
AltiplanoUtilities.prototype.convertImmutableProfilesToIntentProfileInputVOs = function(immutableProfiles, deviceRelease) {
    var	profiles = immutableProfiles.stream().map(function(profile){
        return intentProfileInputFactory.createIntentProfileInputVO(profile.getName(), profile.getSubtype(), profile.getProfileType());
    }).collect(Collectors.toList());
    return profiles;
}

/**
 * It is is used to fetch all profile attributes and their values from profile manager for the list of input profiletype, subtype and name created as vinputo
 * @param intentType - intent type eg: device config dpu
 * @param intentTypeVersion - version of intent type
 * @param intentProfileInputVos - list of all intentprofile as vos, for which the attributes are to be fetched
 * @param intentType - intent type eg: device config dpu
 * @param deviceRelease - device release
 * @return list - list of all profile entities queried from profile manager
 */
AltiplanoUtilities.prototype.getSpecificProfilesList = function (intentType, intentTypeVersion, deviceRelease, intentProfileInputVos) {
    return profileQueryService.getSpecificProfiles(intentType, intentTypeVersion, deviceRelease, intentProfileInputVos);
}

/**
 * It is is used to fetch all profile details from profile manager instead of json if useprofilemanager is true
 * @param deviceName - device name
 * @param nodeType - node type
 * @param intentType - intent type eg: device config dpu
 * @return list - list of all associated profiles queried from profile manager is set in context
 */
AltiplanoUtilities.prototype.getAllProfileDataForIntent = function (deviceName, nodeType, intentType, intentVersion, slicingMode) {
    var requestContext = requestScope.get();
    var allprofiles;
    if (!nodeType) {
        nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
    }
    if (!intentVersion) {
        intentVersion = this.getIntentVersion(intentType, deviceName);
    }
    if (typeof nodeType == "string" && nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT)) {
        var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
        if (slicingMode) {
            allprofiles = this.getAssociatedProfilesWithConfig(intentType, intentVersion, null, null, deviceTypeAndRelease.release, null, deviceTypeAndRelease.hwType, slicingMode);
        } else {
            allprofiles = this.getAssociatedProfilesWithConfig(intentType, intentVersion, null, null, deviceTypeAndRelease.release, null, deviceTypeAndRelease.hwType, slicingMode, true);
        }
    } else {
        if(nodeType && nodeType["deviceType"] && nodeType["deviceVersion"]){
            var hwType = nodeType["hardwareType"];
            var deviceReleaseVersion = nodeType["deviceVersion"]
        }else {
            var prefixLength = this.getPrefixLengthForDeviceType(nodeType);
            var hwType = nodeType.substring(0, prefixLength - 1);
            var deviceReleaseVersion = this.getLsDeviceInterfaceVersion(deviceName, nodeType);
        }
        // var hwType = "DF";
        if (slicingMode) {
            allprofiles = this.getAssociatedProfilesWithConfig(intentType, intentVersion, null, null, deviceReleaseVersion, null, hwType, slicingMode);
        } else {
            allprofiles = this.getAssociatedProfilesWithConfig(intentType, intentVersion, null, null, deviceReleaseVersion, null, hwType, slicingMode, true);
        }
    }
    if (!allprofiles || allprofiles.length == 0 || allprofiles.size() == 0) {
        throw new RuntimeException("No profile is associated with intent " + intentType + " in profile manager");
    }
        return allprofiles;
}

/**
 * It is is used to check and throw error if there are missing profiles from profile manager
 * @param intentType - intent type eg: device config dpu
 * @param intentVersion - intent version eg: 3
 */
AltiplanoUtilities.prototype.checkMissingProfiles = function (intentType, intentVersion, ignoredProfiles) {
    var supportedProfiles = []
    var supportedProfilesJSon = resourceProvider.getResource("supported-profile-types.json");
    var profilesData = JSON.parse(supportedProfilesJSon);
    profilesData.forEach(function (profile) {
        supportedProfiles.push(profile["profile-type"]);
    });
    var missingProfiles = this.getMissingProfiles(supportedProfiles, intentType, intentVersion, ignoredProfiles);
    if (missingProfiles && missingProfiles.length > 0) {
        missingProfiles = missingProfiles.join(", ");
        throw new RuntimeException("Missing profile types in profile manager: " + missingProfiles);
    }
}

/**
 * It is is used to get missing profiles from profile manager
 * @param profileTypes - profile types from supported json file
 * @param intentType - intent type eg: device config dpu
 * @param intentVersion - intent version eg: 3
 * @return list - list of profiles in supported profile json but not associated
 */
 AltiplanoUtilities.prototype.getMissingProfiles = function (profileTypes, intentType, intentVersion, ignoredProfiles) {
    var missingProfiles = [];
    var associatedProfiles = [];
    var templateArgs = {
        intentType: intentType,
        intentVersion: intentVersion
    };
    try {
        var xpath = "/nc:rpc-reply";
        var node = this.getExtractedNodeFromResponse(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "resources/getAssociatedProfiles.xml.ftl", templateArgs, xpath, this.prefixToNsMap);
        if (node) {
            var associatedProfiles =  this.getAttributeValues(node, "/nc:rpc-reply/profile-mgr:profiles/profile-mgr:profile/profile-mgr:profile-type", this.prefixToNsMap);
        }
    } catch (e) {
        throw new RuntimeException("Could not get associated profiles ", e);
    }
    if (associatedProfiles) {
        if (associatedProfiles.length > 0) {
            profileTypes.forEach(function (profileType) {
                if (missingProfiles.indexOf(profileType) < 0 && associatedProfiles.indexOf(profileType) < 0) {
                    if (!ignoredProfiles || ignoredProfiles.length == 0 || ignoredProfiles.indexOf(profileType) < 0) {
                        missingProfiles.push(profileType);
                    }
                }
            });
        } else {
            throw new RuntimeException("No profile is associated with intent " + intentType + " in profile manager");
        }
    } else {
        throw new RuntimeException("Could not get associated profiles");
    }
    return missingProfiles;
}

/**
 * The profile data retrieved from profile manager will be parsed and restructureed to align with the json input format to ftl
 * @param deviceName - device name
 * @param nodeType - node type
 * @param intentType - intent type eg: device config dpu
 * @param excludeSubTypeList - while restructuring, these subtypes are additionaly added in profile mgr, and the json inside it may need to be pulled out a level
 * @param intentVersion - version of intent type
 * @param devicePrefix - device prefix needed to filter data inside son while merging
 * @param mergeJsonList - list of json resource files that need to be merged with profile manager data
 * @return list - list of restructured profiles to input to ftl and merge to baseargs
 */
AltiplanoUtilities.prototype.getParsedProfileDetailsFromProfMgr = function (deviceName,nodeType,intentType,excludeSubTypeList,intentVersion,slicingMode, allprofiles) {
    var allProfilesFromProfMgr={};
    if(!allprofiles){
        if(slicingMode){
            allprofiles = this.getAllProfileDataForIntent(deviceName,nodeType,intentType,intentVersion,slicingMode);
        }else{
            allprofiles = this.getAllProfileDataForIntent(deviceName,nodeType,intentType,intentVersion);
        }
    }
        if(allprofiles) {
            allprofiles.forEach(function (profileentity) {
                var profType = profileentity.getProfileType();
                var subType = profileentity.getSubtype();
                var profAttr = JSON.parse(profileentity.getProfileConfigJSON());
                var pwdTypes = apUtils.getSensitiveKeys(profileentity.getProfileConfig(), profType);
                apUtils.setRedundantSensitiveKey(pwdTypes);
                if(typeof requestScope !== 'undefined' && requestScope.get() != null){
                    if(requestScope.get().get("sensitiveValues")){
                        var sensitiveValues = requestScope.get().get("sensitiveValues");
                    }else{
                        var sensitiveValues = [];
                    }
                    apUtils.sensitiveKeyHandling(profAttr, pwdTypes, sensitiveValues);
                }
                var profkey = profType + ":" + profType;
                var profDetail = profAttr[profkey];
                if (profDetail["name"]) {
                    profDetail["nameAttribute"] = profDetail["name"];
                }
                profDetail["name"] = profileentity.getName();
                if (profileentity.getBaseRelease()) {
                    profDetail["baseRelease"] = profileentity.getBaseRelease();
                }
                if (profileentity.getVersion()) {
                    profDetail["profileVersion"] = profileentity.getVersion();
                }
                
                //From profile manager subtype comes as lightspan/LS-SX-DX-MX etc which need not be fed to ftl, so strip them out
                if (excludeSubTypeList.indexOf(subType) > -1) {
                    if (!allProfilesFromProfMgr[profType]) {
                        allProfilesFromProfMgr[profType] = [];
                    }
                    allProfilesFromProfMgr[profType].push(profDetail);
                } else {
                    if(!allProfilesFromProfMgr[subType]){
                        allProfilesFromProfMgr[subType]={};
                        allProfilesFromProfMgr[subType][profType] = [];
                    }
                    else if(!allProfilesFromProfMgr[subType][profType]){
                        allProfilesFromProfMgr[subType][profType] = [];
                    }
                    allProfilesFromProfMgr[subType][profType].push(profDetail);
                }
            });
            allProfilesFromProfMgr = JSON.parse(JSON.stringify(allProfilesFromProfMgr, this.stringReplacer));

            //processing all profile data to the structure as in respective jsons
            var restructuredProfileData = {};
            if ( Object.keys(allProfilesFromProfMgr).length > 0){
                Object.keys(allProfilesFromProfMgr).forEach(function (level1key) {
                    if (excludeSubTypeList.indexOf(level1key) > -1) {
                        //case 1 - system, ipfix comes from profile mgr as profiletype:[objects], whereas in json we just need objects
                        if (Array.isArray(allProfilesFromProfMgr[level1key]) && allProfilesFromProfMgr[level1key].length > 0) {
                            allProfilesFromProfMgr[level1key].forEach(function (entireJsonData) {
                                apUtils.getMergedObject(restructuredProfileData, entireJsonData);
                            });
                        }
                    }
                    else {
                        restructuredProfileData[level1key] = allProfilesFromProfMgr[level1key];
                    }
                });
            }
            allProfilesFromProfMgr = restructuredProfileData;
        }


    return allProfilesFromProfMgr;
}

/**
 * function is used to covert the json format in external-alarm.json from device-xxx
 * so that can be easily tracked. Besides, the function also validates some cases:
 * output-scan-point doesn't exist, or duplicate in/output-scan-point
 * @param {Object} externalAlarmJson 
 * @returns {Object} Contains three attributes: externalAlarmNames, inpuScanPoints, outputScanPoints
 */
AltiplanoUtilities.prototype.processExternalAlarmJson = function (externalAlarmJson,externalAlarmScanPointDetail) {
    var externalAlarmNames = {};
    var inputScanPoints = {};
    var outputScanPoints = {};
    var convertOutputScanPoints = function (externalAlarmName, inputScanPoint, outputScanPointList,parentSlot) {        
        var outputs = inputScanPoint["output-scan-point"];
        var convertedOutput = {};
        if (outputs && typeof outputs.push === "function") {
            var outputScanPointOfInput = [];
            for (var key = 0; key < outputs.length; key++) {
                var output = outputs[key];
                if (outputScanPointOfInput.indexOf(output) !== -1) {
                    throw new RuntimeException(externalAlarmName + ": Duplicate output-scan-point " + output + " of input-scan-point " + inputScanPoint["name"]);
                }
                if (outputScanPointList.indexOf(output) === -1) {
                    throw new RuntimeException(externalAlarmName + ": The output-scan-point " + output + " of input-scan-point " + inputScanPoint["name"] + " doesn't exist");
                }
                outputScanPointOfInput.push(output);
                convertedOutput[output] = { "name": output };
            }
            inputScanPoint["output-scan-point"] = convertedOutput;
        }
    }
    var convertInputAndOutputScanPoints = function (externalAlarmName, scanPoints, allScanPoints, scanPointList, outputsExternal, scanPointType, parentSlot) {
        if (scanPoints && typeof scanPoints.push === "function") {
            for (var key = 0; key < scanPoints.length; key++) {
                var scantPoint = scanPoints[key];
                var scanPointName = scantPoint["name"];
                if (scanPointList.indexOf(scanPointName) !== -1 && !parentSlot) {
                    throw new RuntimeException("Duplicate the " + scanPointType + " " + scanPointName + " of external-alarm " + externalAlarmName);
                }
                if (allScanPoints[scanPointName] && !parentSlot) {
                    throw new RuntimeException("Duplicate the " + scanPointType + " " + scanPointName + " of external-alarm " + externalAlarmName + " and " + allScanPoints[scanPointName]["externalAlarm"]);
                }
                if (scanPointType === "input-scan-point") {
                    convertOutputScanPoints(externalAlarmName, scantPoint, outputsExternal, parentSlot);
                }
                allScanPoints[scanPointName] = scantPoint;
                if (!parentSlot) {
                    //logic for DF and FX
                    allScanPoints[scanPointName]["externalAlarm"] = externalAlarmName;
                } else {
                    //output scan points of MF can have the corresposding external alarm output port as parent
                    if (scanPointName.equals(intentConstants.LS_MF_OUTPUT_SCANPOINT_NTA)) {
                        allScanPoints[scanPointName]["externalAlarm"] = intentConstants.LS_MF_EXTERNAL_ALARM_PORT_NTA;
                    } else if (scanPointName.equals(intentConstants.LS_MF_OUTPUT_SCANPOINT_NTB)) {
                        allScanPoints[scanPointName]["externalAlarm"] = intentConstants.LS_MF_EXTERNAL_ALARM_PORT_NTB;
                    } else if (parentSlot == "Nt") {
                        allScanPoints[scanPointName]["externalAlarm"] = intentConstants.EXTERNAL_ALARM_PORT;
                    } else {
                        allScanPoints[scanPointName]["externalAlarm"] = "External-Alarm-Port-" + parentSlot;
                    }
                    allScanPoints[scanPointName]["parent-rel-position"] = "1";
                }
                scanPointList.push(scanPointName);
            }
        }
    }
    var getInputAndOutputScanPoints = function (externalAlarm, inputScanPoints, outputScanPoints, parentSlot) {
        var outputsExternal = [];
        if (externalAlarm) {
            var externalAlarmName = getExternalAlarmName(externalAlarm["alarm-port"], externalAlarm["name"])
            if (externalAlarm["output-scan-points"]) {
                if (parentSlot) {
                    var portParentName = "External-Alarm-Port-" + parentSlot;
                    convertInputAndOutputScanPoints(getExternalAlarmName(externalAlarm["alarm-port"], portParentName), externalAlarm["output-scan-points"], outputScanPoints, outputsExternal, null, "output-scan-point", parentSlot);
                } else {
                    convertInputAndOutputScanPoints(externalAlarmName, externalAlarm["output-scan-points"], outputScanPoints, outputsExternal, null, "output-scan-point", parentSlot);
                }
            }
            convertInputAndOutputScanPoints(externalAlarmName, externalAlarm["input-scan-points"], inputScanPoints, [], outputsExternal, "input-scan-point", parentSlot);
        }
    }

    var getExternalAlarmName = function (alarmPortName, defaultAlarmPortName) {
        return alarmPortName ? alarmPortName : defaultAlarmPortName;
    }

    var setExternalAlarmNames = function (externalAlarmNames, externalAlarm, defaultExternalAlarmName, parentName) {
        var keyExternalName = getExternalAlarmName(externalAlarm["alarm-port"], externalAlarm["name"]);
        var externalAlarmName = getExternalAlarmName(externalAlarm["alarm-port"], defaultExternalAlarmName);
        externalAlarmNames[keyExternalName] = {
            "name": externalAlarmName
        };
        if (parentName) {
            externalAlarmNames[keyExternalName]["parent"] = parentName
        }
    }
    var getAlarmProfile = function (externalAlarms, name) {
        return externalAlarms.filter(function (profile) {
            return profile.name === name;
        })[0];
    }
    if (externalAlarmJson) {
        var cloneAlarmExternalJson = JSON.parse(JSON.stringify(externalAlarmJson));
        var externalAlarms = cloneAlarmExternalJson["external-alarm"];
        if (externalAlarms && typeof externalAlarms.push === "function") {
            for (var index = 0; index < externalAlarms.length; index++) {
                var externalAlarm = externalAlarms[index];
                var externalAlarmName = externalAlarm["name"];
                if (externalAlarmNames[externalAlarmName]) {
                    throw new RuntimeException("Duplicate scan-point name " + externalAlarmName + " in the external-alarm profile");
                }
                if (!externalAlarmScanPointDetail) {
                    externalAlarmNames[externalAlarmName] = { "name": externalAlarmName };
                    getInputAndOutputScanPoints(externalAlarm, inputScanPoints, outputScanPoints);
                }
            }
            if (externalAlarmScanPointDetail) {
                externalAlarmScanPointDetail.forEach(function (scanProfile) {
                    var externalAlarm = getAlarmProfile(externalAlarms, scanProfile.scanProfileName);
                    var parentSlotName = scanProfile.parentSlot;
                    var correctedParentSlotName;
                    if (parentSlotName) {
                        correctedParentSlotName = parentSlotName.charAt(0) + parentSlotName.substring(1).toLowerCase();
                        var parentName = ["Board", correctedParentSlotName].join("-");
                        if (correctedParentSlotName == "Nt") {
                            setExternalAlarmNames(externalAlarmNames, externalAlarm, intentConstants.EXTERNAL_ALARM_PORT, parentName);
                        } else {
                            setExternalAlarmNames(externalAlarmNames, externalAlarm, [intentConstants.EXTERNAL_ALARM_PORT, correctedParentSlotName].join("-"), parentName);
                        }
                    } else {
                        setExternalAlarmNames(externalAlarmNames, externalAlarm, externalAlarm["name"]);
                    }
                    getInputAndOutputScanPoints(externalAlarm, inputScanPoints, outputScanPoints, correctedParentSlotName);
                });
            }
        }
        return {
            externalAlarmNames: externalAlarmNames,
            inputScanPoints: inputScanPoints,
            outputScanPoints: outputScanPoints
        }
    }
}


/**
 * This method will convert a jsonmap so that all values of keys, will become string
 * usage should be: var result = JSON.stringify(jsonmaptobeconverted,this.stringReplacer);
 * In case of empty leaf the core returns as array of null ,then we convert it back to empty string
 * @param key - key of json map
 * @param value - value of each entry
 * @return list - converted jsonmap
 */
AltiplanoUtilities.prototype.stringReplacer = function (key,value) {
    if(typeof value == 'number' || typeof value == 'boolean'){
        return new String(value);
    }
    if (Array.isArray(value) && value && value.length == 1 && value[0] === null){
	 	return "";
    }
    return value;
}

/**
 * utility function for retrieving the associated profiles with complete config from profile manager
 * @param intentType
 * @param intentVersion
 * @param profileType
 * @param subType
 * @param deviceReleaseVersion
 * @param profileName
 * @param hwType
 * @returns {*}
 */
AltiplanoUtilities.prototype.getAssociatedProfilesWithConfig = function(intentType,intentVersion,profileType,subType,deviceReleaseVersion,profileName,hwType,slicingMode, storeInIntentScope){
    let result,
        scopeKey = `profiles_getAssociatedProfilesWithConfig_${intentType}-${intentVersion}-${profileType}-${subType}-${deviceReleaseVersion}-${profileName}-${hwType}`;
    if (storeInIntentScope && apUtils.getContentFromIntentScope(scopeKey)) {
        return apUtils.getContentFromIntentScope(scopeKey);
    }
    if (slicingMode) {
        result = profileQueryService.getAssociatedProfilesWithConfig(intentType, intentVersion, profileType, subType, deviceReleaseVersion, profileName, hwType, slicingMode);
    } else {
        result = profileQueryService.getAssociatedProfilesWithConfig(intentType, intentVersion, profileType, subType, deviceReleaseVersion, profileName, hwType);
    }
    if(storeInIntentScope) {
        apUtils.storeContentInIntentScope(scopeKey, result);
    }    
    return result;
}

/**
 * This method will check "multicast" object for each service template
 * If multicast object contains all parameters that relate to multicast-channel
 * then will assigned "isMulticastChannelAvailable" = true
 * 
 * @param {Object} onuTemplate
 * 
 */
AltiplanoUtilities.prototype.verifyMulticastObjectForTransparentForwardCase = function (onuTemplate) {
    for (var templateIdx in onuTemplate) {
        var services = onuTemplate[templateIdx]["service"];
        for (var serviceIdx in services) {
            var service = services[serviceIdx];
            if (service["multicast"]) {
                var multicastObj = service["multicast"];
                if (multicastObj instanceof Array) {
                    for (var multicastKey in multicastObj) {
                        var multicast = multicastObj[multicastKey];
                        if (multicast.hasOwnProperty("max-group-number") && multicast.hasOwnProperty("multicast-rate-limit") &&
                            (multicast.hasOwnProperty("unmatched-membership-report-processing-type") || multicast.hasOwnProperty("multicast-infra-name")) &&
                            multicast.hasOwnProperty("multicast-channel")) {
                            multicast["isMulticastChannelAvailable"] = true;
                        }
                    }
                } else {
                    if (multicastObj.hasOwnProperty("max-group-number") && multicastObj.hasOwnProperty("multicast-rate-limit") &&
                        (multicastObj.hasOwnProperty("unmatched-membership-report-processing-type") || multicastObj.hasOwnProperty("multicast-infra-name")) &&
                        multicastObj.hasOwnProperty("multicast-profile") && multicastObj.hasOwnProperty("multicast-channel")) {
                        multicastObj["isMulticastChannelAvailable"] = true;
                    }
                }
            }
        }
    }
}

/**
 * This method will construct multiple "multicast" and setting desired inforamtion
 *
 * @param {Object} onuTemplate
 *
 */

 AltiplanoUtilities.prototype.processMultipleMulticastObjects = function (onuTemplates,multiCastInfraJson,multiCastNetWorkServiceProfileJson, baseArgs) {
    var multiCastInfras = multiCastInfraJson["multicast-infra"];
    var mcastVPNs = {};
    for(var key in onuTemplates){
        if (onuTemplates.hasOwnProperty(key)) {
            var onuTemplate = onuTemplates[key];
            var services = onuTemplate["service"];
            var isMultipleNWVSINeeded = true;
            onuTemplate["multicast-interface-to-host"] ={};
            var multicastChannelSet = {};
            let currentMcastNames = {};
            currentMcastNames[onuTemplate["name"]] = {};
            mcastVPNs[onuTemplate["name"]] = {};
            for (var serviceKey in services) {
                if (services.hasOwnProperty(serviceKey)) {
                    var service = services[serviceKey];
                    var multicastVpns = new ArrayList();
                    var multicastNetworkVSIs = new ArrayList();
                    var multicastNetworkInterfaces = new ArrayList();
                    if (service["multicast"]) {
                        service["multicast-vpn"] = {};
                        if (service["multicast"].length > 1) {
                            var multicasts = service["multicast"];
                            for(var multicastKey in multicasts){
                                var multicast = multicasts[multicastKey];
                                if (multicast.hasOwnProperty("multicast-infra-name") && multicast["multicast-infra-name"] != "") {
                                    var multicastPackages = this.getMulticastPackages(multiCastNetWorkServiceProfileJson,multicast,multiCastInfras);
                                    this.createMultipleMulticastVpn(service,multicast,multicastVpns,multiCastInfras,multicastNetworkVSIs,multicastNetworkInterfaces,multicastChannelSet,multicastPackages);
                                } else {
                                    throw new RuntimeException("multicast-infra-name not configured for "+multicast["name"] +" multicast in "+onuTemplate["name"]);
                                }
                            }
                        } else if (service["multicast"].length == 1) {
                            var multicasts = service["multicast"];
                            for(var multicastKey in multicasts){
                                var multicast = multicasts[multicastKey];
                                var multicastPackages = this.getMulticastPackages(multiCastNetWorkServiceProfileJson,multicast,multiCastInfras);
                                if (multicast.hasOwnProperty("multicast-infra-name") && multicast["multicast-infra-name"] != "") {
                                    this.createMultipleMulticastVpn(service,multicast,multicastVpns,multiCastInfras,multicastNetworkVSIs,multicastNetworkInterfaces,multicastChannelSet,multicastPackages);
                                } else {
                                    if(isMultipleNWVSINeeded == true) {
                                        this.createSingleMulticastVpn(service,multicast,multiCastInfras,multicastChannelSet,multicastPackages);
                                        var multicastInterfaceToHostName = "USER_PORT_"+service["uni-id"]+"_"+service["name"];
                                        onuTemplate["multicast-interface-to-host"]["MC_VPN"]={};
                                        onuTemplate["multicast-interface-to-host"]["MC_VPN"][multicastInterfaceToHostName] = {};
                                        onuTemplate["multicast-interface-to-host"]["MC_VPN"][multicastInterfaceToHostName]["interfaceToHostName"] = multicastInterfaceToHostName;
                                        onuTemplate["multicast-interface-to-host"]["MC_VPN"][multicastInterfaceToHostName]["interfaceToHostUncontrolName"] = "ENET_"+service["uni-id"];
                                        onuTemplate["multicast-interface-to-host"]["MC_VPN"][multicastInterfaceToHostName]["vlanSubInterfaceName"] = service["vlanSubInterfaceName"];
                                        onuTemplate["multicast-interface-to-host"]["MC_VPN"][multicastInterfaceToHostName]["type"] = service["type"];
                                        isMultipleNWVSINeeded = false;
                                        multicast["isMultipleNWVSINeeded"] = true;
                                    } else {
                                        var multicastInterfaceToHostName = "USER_PORT_"+service["uni-id"]+"_"+service["name"];
                                        onuTemplate["multicast-interface-to-host"]["MC_VPN"][multicastInterfaceToHostName] = {};
                                        onuTemplate["multicast-interface-to-host"]["MC_VPN"][multicastInterfaceToHostName]["interfaceToHostName"] = multicastInterfaceToHostName;
                                        onuTemplate["multicast-interface-to-host"]["MC_VPN"][multicastInterfaceToHostName]["interfaceToHostUncontrolName"] = "ENET_"+service["uni-id"];
                                        onuTemplate["multicast-interface-to-host"]["MC_VPN"][multicastInterfaceToHostName]["vlanSubInterfaceName"] = service["vlanSubInterfaceName"];
                                        onuTemplate["multicast-interface-to-host"]["MC_VPN"][multicastInterfaceToHostName]["type"] = service["type"];
                                        multicast["isMultipleNWVSINeeded"] = false;
                                        multicast["multicastVpnName"] = "MC_VPN";
                                        if (apUtils.ifObjectIsEmpty(onuTemplate["multicast-subscriber-specific-packages"])) {
                                            var multicastChannelGroupNetworkInterface = {};
                                            onuTemplate["multicast-subscriber-specific-packages"] = {};
                                            onuTemplate["multicast-subscriber-specific-packages"]["MC_VPN"] = this.getSubscriberSpecificPackages(multicast,"NW_PORT_MC_NW_VSI",multicastChannelGroupNetworkInterface,multicastChannelSet,multicastPackages);
                                        } else{
                                            var modifiedMulticasChannelGroupInterface = {};
                                            modifiedMulticasChannelGroupInterface = JSON.parse(JSON.stringify(onuTemplate["multicast-subscriber-specific-packages"]["MC_VPN"]));
                                            onuTemplate["multicast-subscriber-specific-packages"]["MC_VPN"] = this.getSubscriberSpecificPackages(multicast,"NW_PORT_MC_NW_VSI",modifiedMulticasChannelGroupInterface,multicastChannelSet,multicastPackages);
                                        }
                                    }
                                }
                                // setting mcast-vlan-id for IPTV-only case
                                if (service["type"] == "IPTV") {
                                    for (var ruleIndex in service["rule"]){
                                        var rule = service["rule"][ruleIndex];
                                        if (rule["user-traffic-type"] == "single-tagged") {
                                            service["rule"][ruleIndex]["mcast-vlan-id"] = multicast["mcast-vlan-id"];
                                        }
                                    }
                                }
                            }
                        }
                        // Get all multicastVpnName, multicastNetworkVSI, multicastNetworkInterface and multicastSnoopTransparentProfileName and add it in list
                        if (baseArgs && service["multicast-vpn"] && !apUtils.ifObjectIsEmpty(service["multicast-vpn"])) {
                            Object.keys(service["multicast-vpn"]).forEach(function (multicastVpn) {
                                if (!currentMcastNames[onuTemplate["name"]]["multicastVpnNames"]) {
                                    currentMcastNames[onuTemplate["name"]]["multicastVpnNames"] = [multicastVpn];
                                } else {
                                    currentMcastNames[onuTemplate["name"]]["multicastVpnNames"].push(multicastVpn);
                                }
                                if (service["multicast-vpn"][multicastVpn]["multicastNetworkVSI"]) {
                                    currentMcastNames[onuTemplate["name"]]["multicastNetworkVSINames"] = (currentMcastNames[onuTemplate["name"]]["multicastNetworkVSINames"])? currentMcastNames[onuTemplate["name"]]["multicastNetworkVSINames"] : [];
                                    var multicastNetworkVsi = service["multicast-vpn"][multicastVpn]["multicastNetworkVSI"];
                                    Object.keys(multicastNetworkVsi).forEach(function (index) {
                                        currentMcastNames[onuTemplate["name"]]["multicastNetworkVSINames"].push(multicastNetworkVsi[index])
                                    });
                                }
                                if (service["multicast-vpn"][multicastVpn]["multicastNetworkInterface"]) {
                                    if (service["multicast-vpn"][multicastVpn]["multicastNetworkInterface"]) {
                                        currentMcastNames[onuTemplate["name"]]["multicastNetworkInterfaces"] = (currentMcastNames[onuTemplate["name"]]["multicastNetworkInterfaces"])? currentMcastNames[onuTemplate["name"]]["multicastNetworkInterfaces"] : {};
                                        var multicastNetworkInterface = service["multicast-vpn"][multicastVpn]["multicastNetworkInterface"];
                                        Object.keys(multicastNetworkInterface).forEach(function (index) {
                                            if (!currentMcastNames[onuTemplate["name"]]["multicastNetworkInterfaces"][multicastVpn]) {
                                                currentMcastNames[onuTemplate["name"]]["multicastNetworkInterfaces"][multicastVpn] = {};
                                            }
                                            currentMcastNames[onuTemplate["name"]]["multicastNetworkInterfaces"][multicastVpn][index] = multicastNetworkInterface[index];
                                        });
                                    }
                                }
                                if (service["multicast-vpn"][multicastVpn]["multicastSnoopTransparentProfileName"]) {
                                    currentMcastNames[onuTemplate["name"]]["multicastSnoopTransparentProfileNames"] = (currentMcastNames[onuTemplate["name"]]["multicastSnoopTransparentProfileNames"])? currentMcastNames[onuTemplate["name"]]["multicastSnoopTransparentProfileNames"] : [];
                                    var multicastSnoopProfile = service["multicast-vpn"][multicastVpn]["multicastSnoopTransparentProfileName"];
                                    Object.keys(multicastSnoopProfile).forEach(function (index) {
                                        currentMcastNames[onuTemplate["name"]]["multicastSnoopTransparentProfileNames"].push(multicastSnoopProfile[index])
                                    });
                                }
                            });
                            baseArgs["currentMcastNames"] = currentMcastNames;
                        }

                        // Get all multicastVpnName across the services of the onu template
                        if (baseArgs && service["multicast-vpn"] && !apUtils.ifObjectIsEmpty(service["multicast-vpn"])) {
                            var onuTemplateName = onuTemplate["name"];
                            Object.keys(service["multicast-vpn"]).forEach(function (multicastVpn) {
                                var mcastVpn = mcastVPNs[onuTemplateName][multicastVpn];
                                if (!mcastVpn) {
                                    mcastVpn = service["multicast-vpn"][multicastVpn];
                                } else {
                                    var multicastNetworkVSI = service["multicast-vpn"][multicastVpn]["multicastNetworkVSI"];
                                    if (multicastNetworkVSI) {
                                        multicastNetworkVSI.forEach(function (vsi) {
                                            if (mcastVpn["multicastNetworkVSI"] && mcastVpn["multicastNetworkVSI"].indexOf(vsi) == -1) {
                                                mcastVpn["multicastNetworkVSI"].push(vsi);
                                            }
                                        })
                                    }

                                    var multicastNetworkInterface = service["multicast-vpn"][multicastVpn]["multicastNetworkInterface"];
                                    if (multicastNetworkInterface) {
                                        multicastNetworkInterface.forEach(function (nwInterface) {
                                            if (mcastVpn["multicastNetworkInterface"] && mcastVpn["multicastNetworkInterface"].indexOf(nwInterface) == -1) {
                                                mcastVpn["multicastNetworkInterface"].push(nwInterface);
                                            }
                                        })
                                    }

                                    var multicastNetworkVSIWithInterface = service["multicast-vpn"][multicastVpn]["multicastNetworkVSIWithInterface"];
                                    if (multicastNetworkVSIWithInterface && !apUtils.ifObjectIsEmpty(multicastNetworkVSIWithInterface)) {
                                        Object.keys(multicastNetworkVSIWithInterface).forEach(function (nwVSI) {
                                            if (mcastVpn["multicastNetworkVSIWithInterface"] && !mcastVpn["multicastNetworkVSIWithInterface"][nwVSI]) {
                                                mcastVpn["multicastNetworkVSIWithInterface"][nwVSI] = multicastNetworkVSIWithInterface[nwVSI];
                                            }
                                        });
                                    }

                                    var multicastServices = service["multicast-vpn"][multicastVpn]["multicastServices"];
                                    if (multicastServices) {
                                        multicastServices.forEach(function (mcastService) {
                                            if (mcastVpn["multicastServices"] && mcastVpn["multicastServices"].indexOf(mcastService) == -1) {
                                                mcastVpn["multicastServices"].push(mcastService);
                                            }
                                        })
                                    }

                                    if (service["multicast-vpn"][multicastVpn]["multicast-subscriber-specific-packages"] && !apUtils.ifObjectIsEmpty(service["multicast-vpn"][multicastVpn]["multicast-subscriber-specific-packages"])) {
                                        var mcastSubSpecificPackagesSrc = service["multicast-vpn"][multicastVpn]["multicast-subscriber-specific-packages"][multicastVpn];
                                        if (mcastVpn["multicast-subscriber-specific-packages"]) {
                                            var mcastSubSpecificPackagesTarget = mcastVpn["multicast-subscriber-specific-packages"][multicastVpn];
                                        }
                                        if (mcastSubSpecificPackagesSrc && !apUtils.ifObjectIsEmpty(mcastSubSpecificPackagesSrc)) {
                                            if (!mcastSubSpecificPackagesTarget) {
                                                mcastVpn["multicast-subscriber-specific-packages"][multicastVpn] = mcastSubSpecificPackagesSrc;
                                            } else {
                                                Object.keys(mcastSubSpecificPackagesSrc).forEach(function (mcastSubSpecificPackage) {
                                                    if (mcastSubSpecificPackage === "subscriberSpecificPackages") {
                                                        if (mcastSubSpecificPackagesSrc["subscriberSpecificPackages"] && !apUtils.ifObjectIsEmpty(mcastSubSpecificPackagesSrc["subscriberSpecificPackages"])) {
                                                            if (!mcastSubSpecificPackagesTarget["subscriberSpecificPackages"]) {
                                                                mcastVpn["multicast-subscriber-specific-packages"][multicastVpn]["subscriberSpecificPackages"] = mcastSubSpecificPackagesSrc["subscriberSpecificPackages"];
                                                            } else {
                                                                Object.keys(mcastSubSpecificPackagesSrc["subscriberSpecificPackages"]).forEach(function (subscriberSpecificPackage) {
                                                                    if (!mcastSubSpecificPackagesTarget["subscriberSpecificPackages"][subscriberSpecificPackage]) {
                                                                        mcastVpn["multicast-subscriber-specific-packages"][multicastVpn]["subscriberSpecificPackages"][subscriberSpecificPackage] = mcastSubSpecificPackagesSrc["subscriberSpecificPackages"][subscriberSpecificPackage];
                                                                    } else {
                                                                        mcastSubSpecificPackagesSrc["subscriberSpecificPackages"][subscriberSpecificPackage].forEach(function (pkg) {
                                                                            if (mcastSubSpecificPackagesTarget["subscriberSpecificPackages"][subscriberSpecificPackage].indexOf(pkg) == -1) {
                                                                                mcastVpn["multicast-subscriber-specific-packages"][multicastVpn]["subscriberSpecificPackages"][subscriberSpecificPackage].push(pkg);
                                                                            }
                                                                        })
                                                                    }
                                                                });
                                                            }
                                                        }
                                                    } else if (!mcastSubSpecificPackagesTarget[mcastSubSpecificPackage]) {
                                                        mcastVpn["multicast-subscriber-specific-packages"][multicastVpn][mcastSubSpecificPackage] = mcastSubSpecificPackagesSrc[mcastSubSpecificPackage];
                                                    }
                                                });
                                            }
                                        }
                                    }
                                }
                                mcastVPNs[onuTemplateName][multicastVpn] = mcastVpn;
                            });
                        };
                    }
                }
            }
            if (apUtils.ifObjectIsEmpty(onuTemplate["multicast-interface-to-host"])) {
                delete onuTemplate["multicast-interface-to-host"];
            }
            if (apUtils.ifObjectIsEmpty(onuTemplate["multicast-subscriber-specific-packages"])) {
                delete onuTemplate["multicast-subscriber-specific-packages"];
            }
        }
    }
    baseArgs["mcastVPNs"] = mcastVPNs;
}

AltiplanoUtilities.prototype.getMulticastPackages = function(multiCastNetWorkServiceProfileJson,multicast,multiCastInfras){
    var mcastProfile = multiCastNetWorkServiceProfileJson["mcast-profile"];
    for(var multiCastInfraJsonKey in mcastProfile){
        if(mcastProfile[multiCastInfraJsonKey]["name"] == this.getMulticastProfileForOnu(multicast,multiCastInfras)){
            return mcastProfile[multiCastInfraJsonKey]["multicast-packages"];
        }
    }
    return null;
}

AltiplanoUtilities.prototype.getMulticastProfileForOnu = function(multicastInOnuTemplate,multiCastInfraJson){
    if(multicastInOnuTemplate["multicast-infra-name"]){
        for(var multiCastInfra in multiCastInfraJson){
        if(multiCastInfraJson[multiCastInfra]["name"] == multicastInOnuTemplate["multicast-infra-name"]){
            return multiCastInfraJson[multiCastInfra]["multicast-profile"];
        }
    }
    } else if(multicastInOnuTemplate["multicast-profile"]){
        return multicastInOnuTemplate["multicast-profile"];
    }
}

/**
 * This method will construct "multicast vpn" object for multiple multicast configuration
 *
 * @param service
 * @param multicast
 * @param multicastVpns
 * @param multiCastInfras
 * @param multicastNetworkVSIs
 * @param multicastNetworkInterfaces
 *
 */

AltiplanoUtilities.prototype.createMultipleMulticastVpn = function (service,multicast,multicastVpns,multiCastInfras,multicastNetworkVSIs,multicastNetworkInterfaces,multicastChannelSet,multicastPackages) {
    if (multicast["multicast-infra-name"]!= "") {
        multicast["multicastVpnName"] = multicast["multicast-infra-name"];
        multicast["multicastNetworkVSI"] = "MC_NW_VSI_"+multicast["name"];
        multicast["multicastNetworkInterface"] = "mc_network_itf_"+multicast["name"];

        if (multicastVpns.indexOf(multicast["multicast-infra-name"]) == -1) {
            multicastVpns.add(multicast["multicast-infra-name"]);
            multicastChannelSet[multicast["multicast-infra-name"]] = [];
            var multicastVpn = JSON.parse(JSON.stringify(multicast));
            var mcastInfra = multiCastInfras.filter(function(multicastInfra){
                return multicastInfra["name"] == multicast["multicast-infra-name"];
            });
            if (mcastInfra.length > 0) {
                multicast["unmatched-membership-report-processing-type"] = mcastInfra[0]["unmatched-membership-report-processing"]["type"];
                multicastVpn["networkInterfaceUnmatchedReports"] = "mc_network_itf_"+mcastInfra[0]["unmatched-membership-report-processing"]["network-infra-structure"];
                apUtils.formatStringAttributeToObject(multicastVpn,"networkInterfaceUnmatchedReports");
                multicastVpn["multicast-profile"] = mcastInfra[0]["multicast-profile"];
            }
            multicastVpn["multicastVpnName"] = multicast["multicast-infra-name"];
            multicastVpn["multicastSnoopTransparentProfileName"] = "vpn"+"_"+multicast["multicast-infra-name"]+"_profile";
            multicastVpn["unmatched-membership-report-processing-type"] = multicast["unmatched-membership-report-processing-type"];
            multicastVpn["multicast-channel"] = multicast["multicast-channel"];
            multicastVpn["isMulticastChannelAvailable"] = multicast["isMulticastChannelAvailable"]
            multicastNetworkVSIs.add(multicast["multicastNetworkVSI"]);
            multicastVpn["multicastNetworkVSI"] = [multicast["multicastNetworkVSI"]];
            multicastNetworkInterfaces.add(multicast["multicastNetworkInterface"]);
            multicastVpn["multicastNetworkInterface"] = [multicast["multicastNetworkInterface"]];
            multicastVpn["multicast-subscriber-specific-packages"] = {};
            var multicastChannelGroupNetworkInterface = {};
            //multicastChannelGroupNetworkInterface[multicastVpn["multicastNetworkInterface"]].push(this.getSubscriberSpecificPackages(multicast,multicastVpn["multicastNetworkInterface"]));
            multicastVpn["multicast-subscriber-specific-packages"][multicastVpn["multicastVpnName"]] = this.getSubscriberSpecificPackages(multicast,multicast["multicastNetworkInterface"],multicastChannelGroupNetworkInterface,multicastChannelSet,multicastPackages);
            var serviceMulticast = multicastVpn["multicast-channel"];
            var multicastChannelObject = {};
            if (Array.isArray(serviceMulticast)){
            for (var channel in serviceMulticast){
                multicastChannelObject[serviceMulticast[channel]] = {"value": serviceMulticast[channel]}
                }
            }
            multicastVpn["multicast-channel"] = multicastChannelObject;
            var multicastNetworkVSIWithInterface = {};
            multicastNetworkVSIWithInterface[multicastVpn["multicastNetworkInterface"]] = multicast["multicastNetworkVSI"];
            multicastVpn["multicastNetworkVSIWithInterface"] = multicastNetworkVSIWithInterface;
            multicastVpn["multicastServices"] = [multicast["name"]];
            apUtils.formatStringAttributeToObject(multicastVpn,"multicast-profile");
            apUtils.formatStringAttributeToObject(multicastVpn,"multicastVpnName");
            apUtils.formatStringAttributeToObject(multicastVpn,"multicastSnoopTransparentProfileName");
            service["multicast-vpn"][multicast["multicast-infra-name"]] = multicastVpn;
        } else {
            var modifiedMulticastVpn = {};
            modifiedMulticastVpn = JSON.parse(JSON.stringify(service["multicast-vpn"][multicast["multicastVpnName"]]));
            if (multicastNetworkVSIs.indexOf(multicast["multicastNetworkVSI"]) == -1) {
                multicastNetworkVSIs.add(multicast["multicastNetworkVSI"]);
                modifiedMulticastVpn["multicastNetworkVSI"].push(multicast["multicastNetworkVSI"]);
            }
            if (multicastNetworkInterfaces.indexOf(multicast["multicastNetworkInterface"]) == -1) {
                multicastNetworkInterfaces.add(multicast["multicastNetworkInterface"]);
                modifiedMulticastVpn["multicastNetworkInterface"].push(multicast["multicastNetworkInterface"]);
                var modifiedMulticasChannelGroupInterface = {};
                modifiedMulticasChannelGroupInterface = JSON.parse(JSON.stringify(modifiedMulticastVpn["multicast-subscriber-specific-packages"][multicast["multicastVpnName"]]));
                modifiedMulticastVpn["multicast-subscriber-specific-packages"][multicast["multicastVpnName"]]= this.getSubscriberSpecificPackages(multicast,multicast["multicastNetworkInterface"],modifiedMulticasChannelGroupInterface,multicastChannelSet,multicastPackages);
                var multicastNetworkVSIWithInterface = {};
                multicastNetworkVSIWithInterface = JSON.parse(JSON.stringify(modifiedMulticastVpn["multicastNetworkVSIWithInterface"]));
                multicastNetworkVSIWithInterface[multicast["multicastNetworkInterface"]] = multicast["multicastNetworkVSI"];
                modifiedMulticastVpn["multicastNetworkVSIWithInterface"] = multicastNetworkVSIWithInterface;
            }
            modifiedMulticastVpn["multicastServices"].push(multicast.name);
            service["multicast-vpn"][multicast["multicast-infra-name"]] = modifiedMulticastVpn;
        }
    } else {
        throw RuntimeException("multicast-infra-name attribute should not be empty in "+ key +" template");
    }
}

/**
 * This method will construct "multicast vpn" object for single multicast configuration
 *
 * @param service
 * @param multicast
 * @param multiCastInfras
 *
 */

AltiplanoUtilities.prototype.createSingleMulticastVpn = function (service,multicast,multiCastInfras,multicastChannelSet,multicastPackages) {
    multicast["multicastVpnName"] = "MC_VPN";
    multicast["multicastNetworkVSI"] = "MC_NW_VSI";
    multicast["multicastNetworkInterface"] = "NW_PORT_MC_NW_VSI";
    multicastChannelSet[multicast["multicastVpnName"]] = [];
    var multicastVpn = JSON.parse(JSON.stringify(multicast));
    var mcastInfra;
    if (multicast.hasOwnProperty("multicast-infra-name")){
        mcastInfra = multiCastInfras.filter(function(multicastInfra){
            return multicastInfra["name"] == multicast["multicast-infra-name"];
        });
    }
    if (multicast.hasOwnProperty("unmatched-membership-report-processing-type") && multicast["unmatched-membership-report-processing-type"]!="") {
        multicastVpn["networkInterfaceUnmatchedReports"] = "NW_PORT_MC_NW_VSI";
    } else if (mcastInfra && mcastInfra.length > 0){
        multicastVpn["unmatched-membership-report-processing-type"] = mcastInfra[0]["unmatched-membership-report-processing"]["type"];
        multicastVpn["networkInterfaceUnmatchedReports"] = "NW_PORT_MC_NW_VSI";
    }
    if (!multicast.hasOwnProperty("multicast-profile") && (mcastInfra && mcastInfra.length > 0)) {
        multicastVpn["multicast-profile"] = mcastInfra[0]["multicast-profile"];
    }
    multicastVpn["multicastSnoopTransparentProfileName"] = "MC_VPN_snoop_profile";
    multicastVpn["multicastNetworkInterface"] = "NW_PORT_MC_NW_VSI";
    multicastVpn["isMulticastChannelAvailable"] = multicast["isMulticastChannelAvailable"]
    multicastVpn["multicastNetworkVSI"] = [multicast["multicastNetworkVSI"]];
    multicastVpn["multicastServices"] = [multicast["name"]];
    multicastVpn["multicast-subscriber-specific-packages"] = {};
    var multicastChannelGroupNetworkInterface = {};
    multicastVpn["multicast-subscriber-specific-packages"][multicastVpn["multicastVpnName"]] = this.getSubscriberSpecificPackages(multicast,multicastVpn["multicastNetworkInterface"],multicastChannelGroupNetworkInterface,multicastChannelSet,multicastPackages);
    var multicastNetworkVSIWithInterface = {};
    multicastNetworkVSIWithInterface[multicastVpn["multicastNetworkInterface"]] = multicast["multicastNetworkVSI"];
    multicastVpn["multicastNetworkVSIWithInterface"] = multicastNetworkVSIWithInterface;
    apUtils.formatStringAttributeToObject(multicastVpn,"multicastNetworkInterface");
    apUtils.formatStringAttributeToObject(multicastVpn,"multicast-profile");
    apUtils.formatStringAttributeToObject(multicastVpn,"multicastVpnName");
    apUtils.formatStringAttributeToObject(multicastVpn,"multicastSnoopTransparentProfileName");
    if (multicastVpn["networkInterfaceUnmatchedReports"]) {
        apUtils.formatStringAttributeToObject(multicastVpn,"networkInterfaceUnmatchedReports");
    }
    service["multicast-vpn"][multicast["multicastVpnName"]] = multicastVpn;
}


AltiplanoUtilities.prototype.getSubscriberSpecificPackages = function (multicast, networkInterfaceName,networkInterfaceNameObject,multicastChannelSet,multicastPackages) {
    var permittedPackages = multicast["permitted-packages"];
    var allowedPackages = multicast["allowed-preview-packages"];
    var allPackages = [];
    var subscriberSpecificPackages = {};
    var allSubscriberPackages = {};
    if(permittedPackages) {
        for(var packageIndex = 0; packageIndex < permittedPackages.length; packageIndex++) {
            if (permittedPackages[packageIndex] != "") {
                allPackages.push(permittedPackages[packageIndex]);
            }
        }
    }
    if(allowedPackages) {
        for(var packageIndex = 0; packageIndex < allowedPackages.length; packageIndex++) {
            if (allowedPackages[packageIndex] != "") {
                allPackages.push(allowedPackages[packageIndex]);
            }
        }
    }
    if (allPackages.length > 0) {
        subscriberSpecificPackages["subscriberSpecificPackages"] = allPackages;
        allPackages.forEach(function(package1){
            if(multicastPackages){
                multicastPackages.forEach(function(packageItem){
                    if(packageItem["name"] == package1){
                        var multicastChannelInOnuArr = [];
                        var multicastChannelGroupList = packageItem["multicast-channel-group-list"];
                        var multicastChannelInOnus = multicast["multicast-channel"];
                        multicastChannelGroupList.forEach(function(multicastChannel){
                            multicastChannelInOnus.forEach(function(multicastChannelInOnu){
                                if(multicastChannelInOnu == multicastChannel){
                                    multicastChannelInOnuArr.push(multicastChannelInOnu);
                                }
                            });
                        });
                        allSubscriberPackages[package1] = multicastChannelInOnuArr;
                    }
                });
            }
        });
        if (networkInterfaceNameObject.hasOwnProperty("subscriberSpecificPackages")) {
            var modifiedSubscriberSpecificPackages = JSON.parse(JSON.stringify(networkInterfaceNameObject["subscriberSpecificPackages"]));
            allPackages.forEach(function(package2){
                if (Object.keys(modifiedSubscriberSpecificPackages).indexOf(package2) == -1) {
                    modifiedSubscriberSpecificPackages[package2] = allSubscriberPackages[package2];
                } else {
                    var modifiedSubscriberPackages = modifiedSubscriberSpecificPackages[package2];
                    if (allSubscriberPackages[package2] instanceof Array) {
                        allSubscriberPackages[package2].forEach(function (channel) {
                            if (modifiedSubscriberPackages.indexOf(channel) == -1) {
                                modifiedSubscriberPackages.push(channel);
                            }
                        });
                    } else {
                        Object.keys(allSubscriberPackages[package2]).forEach(function (channelKey) {
                            if (modifiedSubscriberPackages.indexOf(allSubscriberPackages[package2][channelKey]) == -1) {
                                modifiedSubscriberPackages.push(allSubscriberPackages[package2][channelKey]);
                            }
                        });
                    }
                    modifiedSubscriberSpecificPackages[package2] = modifiedSubscriberPackages;
                }
            });
            networkInterfaceNameObject["subscriberSpecificPackages"]= modifiedSubscriberSpecificPackages;
        } else {
            networkInterfaceNameObject["subscriberSpecificPackages"]= allSubscriberPackages;
        }
    } else {
        networkInterfaceNameObject["subscriberSpecificPackages"] = allSubscriberPackages;
    }
    subscriberSpecificPackages["multicast-channel"]=[];
    var multicastChannelSetPerVPN = multicastChannelSet[multicast["multicastVpnName"]];
    if (multicast["multicast-channel"]) {
        multicast["multicast-channel"].forEach(function(multicastChannelName){
            if (multicastChannelSetPerVPN.indexOf(multicastChannelName) == -1) {
                subscriberSpecificPackages["multicast-channel"].push(multicastChannelName);
                multicastChannelSetPerVPN.push(multicastChannelName);
            }
        });
    }
    multicastChannelSet[multicast["multicastVpnName"]] = multicastChannelSetPerVPN;
    if (networkInterfaceNameObject[networkInterfaceName]) {
        subscriberSpecificPackages["multicast-channel"].forEach(function(multicastChannelName){
            networkInterfaceNameObject[networkInterfaceName]["multicast-channel"].push(multicastChannelName);
        });
    } else {
        networkInterfaceNameObject[networkInterfaceName] = subscriberSpecificPackages;
    }
    var specificPackages = subscriberSpecificPackages["multicast-channel"];
    var multicastChannelPackages = {};
    if (Array.isArray(specificPackages)){
        for (var channel in specificPackages){
            multicastChannelPackages[specificPackages[channel]] = {"value": specificPackages[channel]};
        }
        subscriberSpecificPackages["multicast-channel"] = multicastChannelPackages;
    }
    return networkInterfaceNameObject;
}

/**
 * Utility function for extracting hardware type from node type
 * @param nodeType
 * @returns {string}
 */
AltiplanoUtilities.prototype.getHardwareTypeFromNodeType = function (nodeType) {
    var prefixLength = this.getPrefixLengthForDeviceType(nodeType);
    return nodeType.substring(0, prefixLength - 1);
}

/**
 * This method pushes the dependent profile details and Updates profile manager of the dependent profiles of intent if useprofilemanager is true
 * @param deviceId - deviceId
 * @param deviceInfo - deviceInfo
 * @param intentType - intent type eg: device config dpu
 * @param deviceRelease - device release
 * @param strongDependency - strongDependency
 * @param intentVersion - intentVersion
 * @param profileObjList - profileObjList
 * @return list - list of dependent profiles
 */
AltiplanoUtilities.prototype.computeAndGetDependentProfileList = function (deviceInfo,intentType,intentVersion,profileObjList) {
    var deviceName = deviceInfo.name;
    if(deviceInfo.managerType == intentConstants.MANAGER_TYPE_AMS) {
        var deviceFamilyTypeRelease = deviceInfo.familyTypeRelease;
        if (deviceFamilyTypeRelease.startsWith(intentConstants.ISAM_FX_PREFIX) || deviceFamilyTypeRelease.startsWith(intentConstants.ISAM_DF_PREFIX) || deviceFamilyTypeRelease.startsWith(intentConstants.ISAM_MX_PREFIX)) {
            var nodeType = deviceFamilyTypeRelease.substring(deviceFamilyTypeRelease.lastIndexOf("-") + 1);
        } else {
            var nodeType = deviceFamilyTypeRelease.substring(deviceFamilyTypeRelease.lastIndexOf(".") - 1);
        }
    } else {
        var nodeType = deviceInfo.familyTypeRelease;
    }
    var selectedProfileList = profileObjList;
    var dependentProfilesList = [];
    var allprofiles = this.getAllProfileDataForIntent(deviceName,nodeType,intentType,intentVersion);
    if(allprofiles){
        allprofiles.forEach(function (profileentity) {
            var pwdTypes = apUtils.getSensitiveKeys(profileentity.getProfileConfig(), profileentity.getProfileType());
            apUtils.setRedundantSensitiveKey(pwdTypes);
            var profType =  profileentity.getProfileType();
            var subType = profileentity.getSubtype();
            var profName = profileentity.getName();
            if(selectedProfileList && selectedProfileList.length>0){
                selectedProfileList.forEach(function (selectedProfile) {
                    if(selectedProfile["profileName"]==profName && selectedProfile["profileType"]==profType && selectedProfile["profileSubType"]==subType){
                        var profileIntentVO = intentProfileFactory.createIntentProfileVO(profName, profType, subType,
                            profileentity.getBaseRelease(), profileentity.getVersion(), selectedProfile["profileDependency"]);
                        dependentProfilesList.push(profileIntentVO);
                    }
                });
            }
        });
    }
    return dependentProfilesList;
}

/**
 * Parse and return the profileObjlist to list of profileIntentVO format
 * @param {*} profileObjList 
 * @returns list - list of profileIntentVOs
 */
AltiplanoUtilities.prototype.getDependentProfileList = function (profileObjList) {
    var dependentProfilesList = [];
    if(profileObjList && profileObjList.length>0){
        profileObjList.forEach(function (selectedProfile) {
            if (selectedProfile["baseRelease"] && selectedProfile["version"]) {
                var profileIntentVO = intentProfileFactory.createIntentProfileVO(selectedProfile["profileName"], selectedProfile["profileType"], selectedProfile["profileSubType"], 
                    selectedProfile["baseRelease"], selectedProfile["version"], selectedProfile["profileDependency"]);
                dependentProfilesList.push(profileIntentVO);
            } else {
                throw new RuntimeException("Unable to retrieve baseRelease/version for Profile: '" + selectedProfile["profileName"] + "', Profile Type: '" + selectedProfile["profileType"] + "',  Profile Subtype: '" + selectedProfile["profileSubType"] + "'");
            }
        });
    }
    return dependentProfilesList;
}

/**
 * Utility function for extracting profiles/JSON blocks matching a particular key-value condiiton form a JSON file
 * @param profileObj {JSON}: {"TDP0": {"name": "TDP0", "maximum-bandwidth": "1000000000" },"TDP_XGS":{"name": "TDP_XGS","device-type": ["LS-MF-LGLT-D"], "maximum-bandwidth": "10000000000"}}
 * @param checkForFlag {string}: JSON key if exists && its value based upon which block has to be filtered"device-type", ex: "device-type"
 * @param flagValue {string}: Value based upon which block has to be filtered"device-type", ex: "LS-MF-LGLT-D"
 * @returns {JSON array} : Filtered blocks: ex: {"TDP0": {"name": "TDP0", "maximum-bandwidth": "1000000000" },"TDP_XGS":{"name": "TDP_XGS","device-type": ["LS-MF-LGLT-D"], "maximum-bandwidth": "10000000000"}}
 */
AltiplanoUtilities.prototype.getProfilesMatchingFilter = function (profileObj, checkForFlag, flagValue){
    var returnJson = {};
    if(profileObj && Object.keys(profileObj).length !== 0){
        Object.keys(profileObj).forEach(function(profileName){
            var profile = profileObj[profileName];
            if(!profile[checkForFlag] || profile[checkForFlag] == "" || profile[checkForFlag].indexOf(flagValue) !== -1)
                            returnJson[profileName] = profile;
        });
    }
    return returnJson;
}


/**
 * This method will compare the version and will return 
 * -1 if currentVersion (21.3) is smaller than compareVersion (21.9)
 * 0 if currentVersion (21.9) is same as compareVersion (21.9)
 * +1 if currentVersion (21.12) is greater than compareVersion (21.9)
 * 
 * @param currentVersion - Current device version
 * @param compareVersion - The version to compare
 * @return number        - -1 / 0 / 1
 */
 AltiplanoUtilities.prototype.compareVersion = function (currentVersion, compareVersion) {
    var result = apUtils.naturalCompare(currentVersion,compareVersion);
    if (result < 0){
        return -1;
    } else if(result > 0){
        return 1;
    } else{
        return 0;
    }
}

/**FNMS-92186
 * get the l2-service-transport-type from the service profile in l2-infra
 * if not have value, return the default value
 * @param {Object} serviceProfiles service profiles from l2-infra
 * @param {String} defaultValue default value
 * @returns 
 */
AltiplanoUtilities.prototype.getL2ServiceTransportType = function (serviceProfiles, defaultValue) {
    if ( serviceProfiles && serviceProfiles["l2-service-transport-type"]) {
        if (intentConstants.SUPPORTED_L2_SERVICE_TRANSPORT_TYPE.lastIndexOf(serviceProfiles["l2-service-transport-type"]) === -1) {
            throw new RuntimeException("The l2-service-transport-type should be in " + intentConstants.SUPPORTED_L2_SERVICE_TRANSPORT_TYPE);
        } else {
            return serviceProfiles["l2-service-transport-type"];
        }
    }
    return defaultValue;
}
/**FNMS-92186
 * This function is used to validate the l2-service-transport type defined in service profile
 * The l2-service-transport shoulde have 2 value ["v-vpls", "vpipe"]
 * if the l2-service-transport-type is vpipe, also check the capabilities of device if supported or not
 * Also check if the l2-service-transport-type is modified or not
 * @param {Object} baseArgs an object to store the value of l2ServiceTransportType
 * @param {String} l2ServiceTransportType "v-vpls" or "vpipe"
 * @param {Object} oldConfiguration the old configuration
 * @param {String} familyTypeRelease 
 * @param {String} serviceVlanId service vlan id to determine the vpipe or vpipe group
 * @param {String} defaultTransportType LS-FX: default is vpipe; LS-MF: default is v-vpls
 */
AltiplanoUtilities.prototype.validateL2ServiceTransportType = function (baseArgs, l2ServiceTransportType, oldConfiguration, familyTypeRelease, serviceVlanId, defaultTransportType) {
    if (l2ServiceTransportType) {
        if (serviceVlanId && !this.isVpipeGroupServiceSupported(familyTypeRelease) &&
            (l2ServiceTransportType && l2ServiceTransportType === "vpipe")) {
            throw new RuntimeException("Vpipe Group Service is not support for this device");
        }
        if (!serviceVlanId && !this.isVpipeServiceSupported(familyTypeRelease) &&
            (l2ServiceTransportType && l2ServiceTransportType === "vpipe")) {
            throw new RuntimeException("Vpipe Service is not support for this device");
        }
    }
    if (this.isArgumentChanged(baseArgs, oldConfiguration, "l2ServiceTransportType", defaultTransportType)) {
        throw new RuntimeException("The L2 service transport type can not be modified");
    };
}

/**
 * This method is used to identify the matching fiber device from the DPU device name in ISAM+DPU use case
 * @param serviceName - serviceName
 * @param infraDetails - infraDetails
 * @param deviceFromFiberResource - ES resource file name to be executed to fetch the fiber device Name
 * @param l2InfraForMultipleDeviceResourcePath - ES resource file name to be executed to fetch l2-infra names for multiple devices
 */
AltiplanoUtilities.prototype.getFiberFromUplink = function (serviceName, infraDetails, deviceFromFiberResourcePath, l2InfraForMultipleDeviceResourcePath) {
    var ontTarget = infraDetails["deviceName"];
    var uplinkConnectionJSON = getUplinkConnectionIntent(ontTarget);
    if (uplinkConnectionJSON) {
        var uplinkConfig = uplinkConnectionJSON.intentConfig["uplink-ports"];
    }
    var fiberNames = {};
    if (uplinkConfig) {
        Object.keys(uplinkConfig).forEach(function (key) {
            if (uplinkConfig[key]["fiber-name"]) {
                fiberNames[uplinkConfig[key]["fiber-name"]] = uplinkConfig[key]["port-id"];
            } else if (uplinkConfig[key]["connected-end-point"]) {
                fiberNames[uplinkConfig[key]["connected-end-point"]] = uplinkConfig[key]["port-id"];
            }
        });
    }
    var convertToShelfDeviceNames = function (fiberNames){
        if (fiberNames && JSON.stringify(fiberNames) != JSON.stringify({})) {
            var fiberNameKeys = Object.keys(fiberNames);
            var convertedFiberNames = {};
            fiberNameKeys.forEach(function (key) {
                var deviceNameItem = key;
                var managerInfo = apUtils.getManagerInfoFromEsAndMds(deviceNameItem);
                if (managerInfo && managerInfo.getType() == intentConstants.MANAGER_TYPE_NAV) {
                    var deviceType = apUtils.getNodeTypefromEsAndMds(deviceNameItem);
                    if (deviceType && (deviceType.startsWith(intentConstants.LS_FX_PREFIX) || deviceType.startsWith(intentConstants.LS_MF_PREFIX) || deviceType.startsWith(intentConstants.LS_SF_PREFIX)) && deviceNameItem.contains(intentConstants.LT_STRING)) {
                        var shelfDevice = apUtils.getShelfDeviceName(deviceNameItem, intentConstants.LS_FX_PREFIX);
                        convertedFiberNames[shelfDevice] = fiberNames[key];
                    } else if (deviceType && deviceType.startsWith(intentConstants.LS_DF_PREFIX)) {
                        convertedFiberNames[key] = fiberNames[key];
                    }
                } else {
                    convertedFiberNames[key] = fiberNames[key];
                }
            });
            return convertedFiberNames;
        }
        return  { "fiberNames " :fiberNames,
        };
    };
    if ((fiberNames && JSON.stringify(fiberNames) != JSON.stringify({}))) {
        var fiberNamesList = Object.keys(fiberNames);
        var fiberDeviceNames = this.getFiberDeviceNames(fiberNamesList, deviceFromFiberResourcePath);
        var fiberDeviceNames = convertToShelfDeviceNames(fiberDeviceNames);
        if (fiberDeviceNames && JSON.stringify(fiberDeviceNames) != JSON.stringify({})) {
            var l2InfraIntentDeviceName = this.getL2InfraForMultipleDevices(Object.keys(fiberDeviceNames), serviceName, l2InfraForMultipleDeviceResourcePath);
        }
        if (l2InfraIntentDeviceName) {
            var deviceType = apUtils.getNodeTypefromEsAndMds(l2InfraIntentDeviceName);
            if (deviceType.startsWith(intentConstants.LS_FX_PREFIX) || deviceType.startsWith(intentConstants.LS_DF_PREFIX) || deviceType.startsWith(intentConstants.LS_MF_PREFIX) || deviceType.startsWith(intentConstants.LS_SF_PREFIX)) {
                infraDetails["isLsOltPlusLsDpu"] = true;
                infraDetails["fiberDeviceType"] = deviceType;
            }
            infraDetails["fiberOnDpu"] = fiberDeviceNames[l2InfraIntentDeviceName];
            infraDetails["fiberDevice"] = this.getFiberRunningFromDevice(fiberDeviceNames[l2InfraIntentDeviceName], infraDetails);
            infraDetails["uplinkType"] = "__UPLINK_Fiber";
            infraDetails["dpuUplinkPort"] = fiberNames[infraDetails["fiberOnDpu"]];
            infraDetails["uplinkConnectionJSON"] = uplinkConnectionJSON;
        }
    }
}
/**
 * This method is used to fetch the list of all device names for a list of fiber names
 * @param fiberNames - fiberNames
 * @param infraDetails - infraDetails
 * @param deviceFromFiberResource - ES resource file name to be executed to fetch the fiber device Name
 */
AltiplanoUtilities.prototype.getFiberDeviceNames = function (fiberNames, deviceFromFiberResource) {
    var fiberIntents = {};
    var fiberNamesList = fiberNames.join(",");
    var response = this.executeEsQuery(deviceFromFiberResource, { "fiberNamesList": fiberNamesList });

    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
            var targetedDevices = intentResult["_source"]["targetted-devices"];

            targetedDevices.forEach(function (targetedDevice) {
                fiberIntents[targetedDevice] = intentResult["_source"]["target"]["fiber-name"];
            });
        });
    }

    return fiberIntents;

}
/**
 * This method is used to fetch the l2-infra for multiple device list
 * @param deviceNames - deviceNames
 * @param serviceName - serviceName
 * @param l2InfraForMultipleDeviceResourcePath - ES resource file name to be executed to fetch l2-infra names for multiple devices
 */
AltiplanoUtilities.prototype.getL2InfraForMultipleDevices = function (deviceNames, serviceName, l2InfraForMultipleDeviceResourcePath) {
    if (!deviceNames.isEmpty) {
        var deviceNamesList = deviceNames.join(",");
        var response = this.executeEsQuery(l2InfraForMultipleDeviceResourcePath, { "deviceNamesList": deviceNamesList, "serviceName": serviceName });
        if (apUtils.isResponseContainsData(response)) {
            if (response.hits.hits.length > 1) {
                throw new RuntimeException("Same service name '" + serviceName + "' has been used by multiple fiber devices of different uplinks on the DPU.Cannot proceed");
            } else if (response.hits.hits.length < 1) {
                throw new RuntimeException("Service name '" + serviceName + "' is not configured in the l2-infra intent");
            }
            var hit = response.hits.hits[0];

            var targetedDevice = hit["_source"]["target"]["device-name"];
        }
    }
    return targetedDevice;

}

/**
 * This method is used to identify the matching l2-infra target if the target device is different from current intent
 * @param deviceNames - deviceNames
 * @param serviceName - serviceName
 * @param l2InfraForMultipleDeviceResourcePath - ES resource file name to be executed to fetch l2-infra names for multiple devices
 */
AltiplanoUtilities.prototype.getL2InfraTarget = function (serviceName, infraDetails) {
    var deviceName = infraDetails["deviceName"], fiberOnDpu = infraDetails["fiberOnDpu"], fiberDevice = infraDetails["fiberDevice"]; //OLT-DPU case
    var infraTargetDeviceName = (fiberOnDpu && fiberDevice) ? fiberDevice : (infraDetails["podName"] ? infraDetails["podName"] : deviceName);
    return infraTargetDeviceName.concat(intentConstants.TARGET_DELIMITER, serviceName);
}
/**
 * This method is used to fetch the fiber details of the devive
 * @param fiberName - fiberName
 * @param infraDetails - infraDetails
 */
AltiplanoUtilities.prototype.getFiberRunningFromDevice = function (fiberName, infraDetails) {
    if (!fiberName) {
        throw new RuntimeException(intentConstants.ONT_EASY_START_DETECT_FIBER_ERROR);
    }

    var fiberIntent = getFiberIntent(fiberName);

    if (!fiberIntent) {
        throw new RuntimeException("Intent not present with target '" + fiberName + "' of intent type '" + intentConstants.INTENT_TYPE_FIBER + "'");
    }
    var fiberIntentConfiguration = fiberIntent.intentConfig;
    var fiberRunningFromDevices = [];
    var ltDeviceNames = [];
    var ponPortKeys = Object.keys(fiberIntentConfiguration["pon-port"]);
    ponPortKeys.forEach(function (ponPortKey) {
        var splitKeys = ponPortKey.split('#');
        if (fiberRunningFromDevices.indexOf(splitKeys[0]) === -1) {
            fiberRunningFromDevices.push(splitKeys[0]);
            var nodeType = apUtils.getNodeTypefromEsAndMds(splitKeys[0]);
            if (nodeType.startsWith(intentConstants.LS_FX_PREFIX) || nodeType.startsWith(intentConstants.LS_MF_PREFIX) || nodeType.startsWith(intentConstants.LS_SF_PREFIX)) {
                var ltCard = splitKeys[1].split(".")[0];
                var ltBoard = splitKeys[0] + intentConstants.DEVICE_SEPARATOR + ltCard;
                if (ltDeviceNames.indexOf(ltBoard) < 0) {
                    ltDeviceNames.push(ltBoard);
                }
            }
            if (!infraDetails["deviceVariant"]) {
                infraDetails["deviceVariant"] = "PON";
            }
        }
    });

    if (ltDeviceNames.length > 0) {
        infraDetails["ltDeviceNames"] = ltDeviceNames;
    }

    if (infraDetails["isamDPUOntMgtCase"] && fiberRunningFromDevices.length > 0) {
        // need to check that device is ISAM
        var managerType = apUtils.getManagerInfoFromEsAndMds(fiberRunningFromDevices[0]);
        if (managerType && managerType.getType() != intentConstants.MANAGER_TYPE_AMS) {
            throw new RuntimeException("Device \"" + fiberRunningFromDevices[0] + "\" in Fiber intent must be an ISAM device");
        }
    }
    return fiberRunningFromDevices[0];
}
/**
 * This method is used to execute the ES query when passed with resource file
 * @param resourceFile - resourceFile
 * @param args - args
 */
AltiplanoUtilities.prototype.executeEsQuery = function (resourceFile, args) {
    var jsonTemplate = utilityService.processTemplate(resourceProvider.getResource(resourceFile), args);
    return apUtils.executeEsIntentSearchRequest(jsonTemplate);
}

/**
 * This method is used to execute the ES query when passed with index and resouce file
 * @param intentIndex
 * @param resourceFile - resourceFile
 * @param intentIndex - Intent Type
 * @param args - args
 */
AltiplanoUtilities.prototype.executeEsQueryByIntentType = function (resourceFile, templateArgs, intentIndex) {
    var request = utilityService.processTemplate(resourceProvider.getResource(resourceFile), templateArgs);
    return JSON.parse(esQueryService.queryESIntentsByIntentType(intentIndex, request));
}

/**
 * This method is used to execute the ES query when passed with resource file
 * @param intentConfigJson - intentConfigJson of mcast-infra intent
 * @param l2InfraList - l2InfraList
 */
AltiplanoUtilities.prototype.getAggregatedMcastChannels = function (intentConfigJson,mcastChannelsAggregated,mcastList,key) {
    var l2InfraList = intentConfigJson["l2-infra-services"];
    var mcastChannelsList = {};
    if (l2InfraList[key]["multicast-channel-name"]) {
        Object.keys(l2InfraList[key]["multicast-channel-name"]).forEach(function (channelKey) {
            mcastChannelsAggregated.push(l2InfraList[key]["multicast-channel-name"][channelKey]);
            mcastChannelsList[l2InfraList[key]["multicast-channel-name"][channelKey]] = mcastList[l2InfraList[key]["multicast-channel-name"][channelKey]];

        });

        l2InfraList[key]["multicast-channel-name"] = mcastChannelsList;
        intentConfigJson["multicast-channel-group"] = mcastChannelsList;
    }
    return mcastChannelsAggregated;
}

/**
 * This method is used to get Hardware type anf device version
 * @param nodeType - nodeType 
 */
AltiplanoUtilities.prototype.splitToHardwareTypeAndVersion = function (nodeType) {
    var typeResult = {};
    typeResult.hwType = nodeType.substring(0, nodeType.lastIndexOf("-"));
    typeResult.release = nodeType.substring(nodeType.lastIndexOf("-") + 1);
    return typeResult;
}


/**
 * This method is used to handle leaf-list values of a intent profile in case it can not be tracked.
 * @param data - profile data get from baseArgs
 * @param leafListName - name of the array attribute of leaf-list in data
 */
AltiplanoUtilities.prototype.handleLeafListCase = function (data, leafListName) {
    if (!data) {
        return;
    }
    if (data === leafListName) {
        data = apUtils.convertLeafListValues(data);
        return;
    }
    if (Array.isArray(data)) {
        if (data.length > 0 && data[0]) {
            if (data[0] && typeof(data[0]) == "string") {
                return;
            }
            for (var i = 0; i < data.length; i++){
                apUtils.handleLeafListCase(data[i], leafListName);
            }
        }
        return;
    }
    if (typeof (data) === "object") {
        Object.keys(data).forEach(function (k) {
            if (k === leafListName) {
                data[k] = apUtils.convertLeafListValues(data[k]);
                return;
            }
            apUtils.handleLeafListCase(data[k], leafListName);
        });
    }
}

/**
 * This method is used to convert the values from a linear list to an object.
 * @param data - current array
 * @returns newData - newly constructed object with the values of leaf-list converted into an object
 */
AltiplanoUtilities.prototype.convertLeafListValues = function(data) {
    let newData = {};
    if (data && Array.isArray(data)) {
        data.forEach(function(val) {
            newData[val] = { "value": val };
        });
    }
    return newData;
}

/**
 * Getting ethernet connection intent configuration by ethernet-connection targe
 * TODO : This method will get ethernet-connection intent configuration by ethernet-connection targe
 * @param target
 * @returns {Object}
 */
 AltiplanoUtilities.prototype.getEthernetConnectionIntentConfigJson = function (target){
    var ethConnectionIntent = apUtils.getIntent(intentConstants.INTENT_TYPE_ETHERNET_CONNECTION, target);
    if (!ethConnectionIntent) {
        throw new RuntimeException("Ethernet connection intent '" + target + "' does not exist");
    } else {
        var ethernetConnectionIntentConfig = ethConnectionIntent.getIntentConfig();
        var getKeyForList = function(listName){
            switch (listName) {
                case "eth-lt-ports":
                    return "port-id";
                default:
                    return null;
            }
        };
        return apUtils.convertIntentConfigXmlToJson(ethernetConnectionIntentConfig, getKeyForList);
    }
};

/**
 * This method is used as a utility to validate ERPS configurations.
 * The validations are performed when at least one of the intent's NNI-IDs match the NNI-IDs in ethernet ring paths
 * and the C-VLAN-ID is same as the ethernet ring's C-VALN-ID OR it is in the ethernet ring's VLAN range.
 * @param deviceName - Device Name
 * @param intentConfigArgs - The intent's configuration attributes
 * @param ethernetRingNames - The ethernet-ring-infra names that the device is part of
 * @param contextualErrorJsonObj - The object to track errors
 * @param validateContext - Context used during validation process
 * @param isSyncOper - Boolean indicating the sync operation
 */
AltiplanoUtilities.prototype.validateErpsConfig = function(deviceName, intentConfigArgs, ethernetRingNames, contextualErrorJsonObj, validateContext, isSyncOper, ethernetRingnniId) {
    var sVlanId = intentConfigArgs["s-vlan-id"];
    var cVlanId = intentConfigArgs["c-vlan-id"];
    var nniIds = intentConfigArgs["nni-id"];
    var outerVlan = cVlanId;
    if(sVlanId != undefined)
        outerVlan = sVlanId;
    var erpsRingDetails = {};

    var ringNniIds;
    if (ethernetRingnniId) {
        ringNniIds = ethernetRingnniId;
    }
    else {  
        ethernetRingnniId = null;
    }
    for (var index = 0; index < ethernetRingNames.length; index++) {
        var ringName = ethernetRingNames[index];
        var ethRingConfigJson = apUtils.getEthernetRingDetails(ringName);
        var ethNniIdA = ethRingConfigJson["devices"][deviceName]["nni-id-a"];
        var ethNniIdB = ethRingConfigJson["devices"][deviceName]["nni-id-b"];
        var vlanIds = ethRingConfigJson["devices"][deviceName]["vlan-id"];
        var cVlan = ethRingConfigJson['c-vlan-id']; 
        
        if ((ethNniIdA && nniIds.indexOf(ethNniIdA) == -1) || (ethNniIdB && nniIds.indexOf(ethNniIdB) == -1)) {
            continue;
        } else {
            var isDataVlanId = false;
            if (cVlanId != undefined) {
                var isDataCVlanId = apUtils.isValidDataVlanId(cVlanId, ethRingConfigJson['vlan-range'], vlanIds);
            }
            if (sVlanId != undefined) {
                var isDataSVlanId = apUtils.isValidDataVlanId(sVlanId, ethRingConfigJson['vlan-range']);
                if(!isDataSVlanId && validateContext)
                {
                    validateContext["isInvalidSVlanId"] = true;
                    validateContext['vlan-range'] = ethRingConfigJson['vlan-range'];
                }
            }
            if (sVlanId != undefined && cVlanId == undefined && (sVlanId === ethRingConfigJson['s-vlan-id'] || isDataSVlanId)) {
                isDataVlanId = true;
            } else if (sVlanId == undefined && cVlanId != undefined && (cVlanId === ethRingConfigJson['c-vlan-id'] || isDataCVlanId)) {
                isDataVlanId = true;
            } else if (sVlanId != undefined && cVlanId != undefined & isDataSVlanId) {
                isDataVlanId = true;
            }
            if (isDataVlanId) {
                if (isSyncOper) {
                    requestScope.get().put("isErpsControlInstance", true);
                } else {
                    validateContext["isErpsControlInstance"] = true;
                }
                erpsRingDetails[ringName] = ethRingConfigJson["devices"][deviceName];
                erpsRingDetails[ringName]["id"] = ethRingConfigJson["id"];
            }
        }
        var subringType = ethRingConfigJson["sub-ring-type"];
        if(subringType){
        var interconnectChoice = ethRingConfigJson["parent-ring-name"];
        if(interconnectChoice && (cVlan == outerVlan)) {
            for(var iter = 0;iter < nniIds.length; iter++)
            {
                var inputNniId = nniIds[iter];
                if(!(inputNniId == ethNniIdA) && !(inputNniId == ethNniIdA))
                {
                    if(subringType == "non-virtual-link")
                        throw new RuntimeException("Service" + outerVlan + "contains Ethernet Ring Control Sap");
                }
            }
        }
        if(!interconnectChoice){
            for(var iter = 0;iter < nniIds.length; iter++)
            {  var inputNniId = nniIds[iter];
                if((inputNniId == ethNniIdA) || (inputNniId == ethNniIdB))
                    {
                    if (isSyncOper) {
                        requestScope.get().put("erpsRingDetails", erpsRingDetails);
                        } else {
                        validateContext["erpsRingDetails"] = erpsRingDetails;
                        }
                    } else if (!isDataVlanId) {
                        throw new RuntimeException("Invalid Configuration. Multiple ring indexes cannot be attached on a given L2-Service");
                    }
            } 
        } else {
            if (isSyncOper) {
             requestScope.get().put("erpsRingDetails", erpsRingDetails);
            } else {
                validateContext["erpsRingDetails"] = erpsRingDetails;
                }
            }
        } else{
            if(outerVlan == cVlan)
            {
                if(!subringType)
                {
                   for(var i = 0;i < nniIds.length; i++)
                    {  
                        var inputNniId = nniIds[i];
                        if((inputNniId == ethNniIdA) || (inputNniId == ethNniIdB))
                        {
                            if (isSyncOper) {
                                requestScope.get().put("erpsRingDetails", erpsRingDetails);
                            } else {
                                validateContext["erpsRingDetails"] = erpsRingDetails;
                            }
                        } else { 
                            throw new RuntimeException("Invalid Configuration. Multiple ring indexes cannot be attached on a given L2-Service");
                        }
                    }
                }
            }
            
            for(var i = 0;i < nniIds.length; i++)
            {  
                var inputNniId = nniIds[i];
                if((inputNniId == ethNniIdA) || (inputNniId == ethNniIdB)){
                    if (isSyncOper) {
                    requestScope.get().put("erpsRingDetails", erpsRingDetails);
                    } else {
                    validateContext["erpsRingDetails"] = erpsRingDetails;
                    }
                } else {
                    for(var iter = 0;iter < ringNniIds.length; iter++){
                        var input = ringNniIds[iter][0];                                                         
                        if(inputNniId == input) 
                        {                            
                            throw new RuntimeException("Invalid Configuration. Multiple ring indexes cannot be attached on a given L2-Service");                                
                        } else {
                            if (isSyncOper) {
                            requestScope.get().put("erpsRingDetails", erpsRingDetails);
                            } else {
                                validateContext["erpsRingDetails"] = erpsRingDetails;
                            }        
                        }
                    }

                }
            }
        }
    } 
}

/**
 * This method is used as a utility to validate subring configurations.
 * The validations are performed when at least one of the intent's NNI-IDs match the NNI-IDs in ethernet ring paths
 * and the C-VLAN-ID is same as the ethernet ring's C-VALN-ID OR it is in the ethernet ring's VLAN range.
 * @param deviceName - Device Name
 * @param intentConfigArgs - The intent's configuration attributes
 * @param ethernetRingNames - The ethernet-ring-infra names that the device is part of
 * @param contextualErrorJsonObj - The object to track errors
 * @param validateContext - Context used during validation process
 * @param isSyncOper - Boolean indicating the sync operation
 */
AltiplanoUtilities.prototype.validateSubringConfig = function(deviceName, intentConfigArgs, ethernetRingNames, contextualErrorJsonObj, validateContext, isSyncOper) {
    var sVlanId = intentConfigArgs["s-vlan-id"];
    var cVlanId = intentConfigArgs["c-vlan-id"];
    var nniIds = intentConfigArgs["nni-id"];

    var subringType;
    var interconnectionNode;
    var outerVlan = cVlanId;
    if(sVlanId != undefined)
       outerVlan = sVlanId;

    if (intentConfigArgs["service-profile"] == "Unicast_With_SplitHz")
    {
        if (isSyncOper)
            requestScope.get().put("isSplitHorizonGrpRequired", true);
        else
            validateContext["isSplitHorizonGrpRequired"] = true;
      
        for (var index = 0; index < ethernetRingNames.length; index++)
        {
            var ringName = ethernetRingNames[index];
            var ethRingConfigJson = apUtils.getEthernetRingDetails(ringName);
            logger.debug("Erps subring - ethRingConfigJson {}", JSON.stringify(ethRingConfigJson));
            var ethNniIdA = ethRingConfigJson["devices"][deviceName]["nni-id-a"];
            var ethNniIdB = ethRingConfigJson["devices"][deviceName]["nni-id-b"];
            var cVlan     = ethRingConfigJson["c-vlan-id"];
            if(outerVlan == cVlan)
            {
                var interconnectChoice = ethRingConfigJson["parent-ring-name"];
                if(interconnectChoice && ((ethNniIdA && !ethNniIdB)||(!ethNniIdA && ethNniIdB)))
                {
                    var parentRingJson = apUtils.getEthernetRingDetails(interconnectChoice);
                    logger.debug("Erps subring - parentRingJson {}", JSON.stringify(parentRingJson));
                    var subringType = ethRingConfigJson["sub-ring-type"];
                    if(subringType == "virtual-link")
                    {
                        var parentNniIdA = parentRingJson["devices"][deviceName]["nni-id-a"];
                        var parentNniIdB = parentRingJson["devices"][deviceName]["nni-id-b"];
                        for(var iter = 0;iter < nniIds.length; iter++)
                        {
                            var inputNniId = nniIds[iter];
                            if((inputNniId == parentNniIdA) || (inputNniId == parentNniIdB))
                            {
                                logger.debug("Erps subring - Setting isSplitHorizonAssocRequired as true!!");
                                if (isSyncOper)
                                {
                                   requestScope.get().put("isSplitHorizonAssocRequired", true);
                                }
                                else
                                {
                                   validateContext["isSplitHorizonAssocRequired"] = true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * This method is used to fetch the ethernet ring details for the given ring
 * @param ringName - Ethernet Ring Name
 */
AltiplanoUtilities.prototype.getEthernetRingDetails = function(ringName) {
    var ethRingConfigXml = apUtils.getIntent(intentConstants.INTENT_TYPE_ETHERNET_RING_INFRA, ringName).getIntentConfig();
    var getKeyForList = function (listName) {
        switch (listName) {
            case "devices":
                return ["device-name"];
            case "vlan-range":
                return ["vlan-start-id", "vlan-end-id"];
            case "vlan-id":
                return "yang:list#leaf-list";
            default:
                return null;
        }
    };
    return apUtils.convertIntentConfigXmlToJson(ethRingConfigXml, getKeyForList);
}

/**
 * This method is used to fetch the ethernet ring names for a given device
 * Note: If the inputNniIds is passed as an argument then return only the ring names where at least
 * one of the inputNniIds match the NNI-IDs in ethernet ring paths
 * @param deviceName - Device Name
 * @param erpsResourceFile - The ES query resource file's path
 * @param inputNniIds - The intent's NNI-IDs
 */
AltiplanoUtilities.prototype.getEthernetRingNames = function(deviceName, erpsResourceFile, inputNniIds) {
    var templateArgs={};
    templateArgs["deviceName"]=deviceName;
    templateArgs["intentType"]= intentConstants.INTENT_TYPE_ETHERNET_RING_INFRA;
    var request = utilityService.processTemplate(erpsResourceFile, templateArgs);
    var response = apUtils.executeEsIntentSearchRequest(request);
    var ethernetRingNames = [];
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
            if(inputNniIds) {
                var ethernetRingConfig = intentResult["_source"]["configuration"];
                var nniIdA;
                var nniIdB;
                if(ethernetRingConfig) {
                    nniIdA = ethernetRingConfig["nni-id-a"];
                    nniIdB = ethernetRingConfig["nni-id-b"];
                }
                if (apUtils.isCommonElementExists(inputNniIds, nniIdA) || apUtils.isCommonElementExists(inputNniIds, nniIdB)) {
                    ethernetRingNames.push(intentResult["_source"]["target"]["raw"]);
                }
            } else {
                    ethernetRingNames.push(intentResult["_source"]["target"]["raw"]);
                }
        });
    }
    return ethernetRingNames;
}

AltiplanoUtilities.prototype.getEthernetRingNniId = function(deviceName, erpsResourceFile) {
    var templateArgs={};
    templateArgs["deviceName"]=deviceName;
    templateArgs["intentType"]= intentConstants.INTENT_TYPE_ETHERNET_RING_INFRA;
    var request = utilityService.processTemplate(erpsResourceFile, templateArgs);
    var response = apUtils.executeEsIntentSearchRequest(request);
    var ethernetRingnniId = [];
    if (apUtils.isResponseContainsData(response)) {
        response.hits.hits.forEach(function (intentResult) {
                var ethernetRingConfig = intentResult["_source"]["configuration"];
                var nniIdA;
                var nniIdB;
                if(ethernetRingConfig) {
                    var subringType = ethernetRingConfig["sub-ring-type"];
                    if(!subringType){
                    nniIdA = ethernetRingConfig["nni-id-a"];
                    nniIdB = ethernetRingConfig["nni-id-b"];
                        if(nniIdA){
                        ethernetRingnniId.push(nniIdA);
                        }
                        if(nniIdB){
                        ethernetRingnniId.push(nniIdB); 
                        }
                    }
                }
                
           
        });
    }
    return ethernetRingnniId;
}

/**
 * This utility method checks if there exists at least one common element in two arrays
 * @param inputElements - Array containing user inputs
 * @param targetElements - Target array to check element's existence
 */
AltiplanoUtilities.prototype.isCommonElementExists = function(inputElements, targetElements) {
    var commomElementExists = false;
    if (targetElements && targetElements.length > 0) {
        for (var i = 0; i < targetElements.length; i++) {
            if (inputElements.indexOf(targetElements[i]) >= 0) {
                commomElementExists = true;
                break;
            }
        }
    }
    return commomElementExists;
}

/**
 * This method checks if a given VLAN-ID is in one of the given VLAN ranges
 * @param vlanId - VLAN-ID
 * @param vlanRanges - Array of VLAN ranges
 */
AltiplanoUtilities.prototype.isValidDataVlanId = function(vlanId, vlanRanges, vlanIds) {
    var valid = false;
    var vlanRangeKeys = Object.keys(vlanRanges);
    for (var idx = 0; idx < vlanRangeKeys.length; idx++) {
        var vlanRangeKey = vlanRangeKeys[idx];
        var vlanRange = vlanRanges[vlanRangeKey];
        var vlanStartId = parseInt(vlanRange["vlan-start-id"]);
        var vlanEndId = parseInt(vlanRange["vlan-end-id"]);
        if ((vlanId >= vlanStartId && vlanId <= vlanEndId) || (vlanIds && vlanIds.indexOf(vlanId) > -1)) {
            valid = true;
        }
    }
    return valid;
}

AltiplanoUtilities.prototype.getNumberOfPorts = function (familyType) {
    var numberOfPort;
    if (familyType) {
        if (familyType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LMNT) || familyType.startsWith(intentConstants.FAMILY_TYPE_IHUB_LMNT)) {
            numberOfPort = 2;
        } else if (familyType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LANT) || familyType.startsWith(intentConstants.FAMILY_TYPE_IHUB_LANT)) {
            numberOfPort = 14;
        } else if (familyType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT) || familyType.startsWith(intentConstants.FAMILY_TYPE_IHUB)) {
            numberOfPort = Number(familyType.substring(familyType.lastIndexOf("FX") + 2));
        } else if (familyType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LBNT_A_MF14_LMFS_A) || familyType.startsWith(intentConstants.FAMILY_TYPE_IHUB_LBNT_A_MF14_LMFS_A)) {
            numberOfPort = 14;
        } else if (familyType.startsWith(intentConstants.FAMILY_TYPE_LS_SF_SFMB_A) || familyType.startsWith(intentConstants.FAMILY_TYPE_LS_SF_IHUB_SFMB_A)) {
            numberOfPort = 1;
        }
    }
    return numberOfPort
}

/**
 * This method is used to create a mepping between ethernet-ring path NNI-IDs and Uplink ports
 * @param erpsRingDetails - Ethernet Ring details
 * @param portMappingJson - The Port Mapping Json configuration
 * @param familyType - Device's family type
 */
AltiplanoUtilities.prototype.getUplinkPortErpsMapping = function(erpsRingDetails, portMappingJson, ihubDeviceTypeAndRelease, deviceName) {
    var uplinkPortNames = {};
    if (portMappingJson) {
        for (var i = 0; i < portMappingJson.length; i++){
            var portMappingInternalName = apCapUtils.getCapabilityValue(ihubDeviceTypeAndRelease.hwType, ihubDeviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_INTERNAL_NAME, portMappingJson[i]);
            if (portMappingInternalName){
                uplinkPortNames[portMappingJson[i]] = portMappingInternalName[0];
            }
        }
    }
    var ringNames = Object.keys(erpsRingDetails);
    var uplinkPortErpsMapping = {};
    logger.debug("Erps - ringNames {}",JSON.stringify(ringNames));
    for (var idx = 0; idx < ringNames.length; idx++) {
        var ringKey = ringNames[idx];
        var ring = erpsRingDetails[ringKey];
        var nniIdA = apUtils.getUpdatedNniId(ring["nni-id-a"], uplinkPortNames, true);
        if(nniIdA) {
            if(!uplinkPortErpsMapping[nniIdA]) {
                uplinkPortErpsMapping[nniIdA] = {};
                uplinkPortErpsMapping[nniIdA]["ringIndex"] = ring["id"];
                uplinkPortErpsMapping[nniIdA]["ringPath"] = "a";
            }
        }
        
        var nniIdB = apUtils.getUpdatedNniId(ring["nni-id-b"], uplinkPortNames, true);
        if(nniIdB) {
            if(!uplinkPortErpsMapping[nniIdB]) {
                uplinkPortErpsMapping[nniIdB] = {};
                uplinkPortErpsMapping[nniIdB]["ringIndex"] = ring["id"];
                uplinkPortErpsMapping[nniIdB]["ringPath"] = "b";
            }
        }
        var ethRingConfigJson = apUtils.getEthernetRingDetails(ringKey);
        var interconnectChoice = ethRingConfigJson["parent-ring-name"];
        var subringType = ethRingConfigJson["sub-ring-type"];
        if(interconnectChoice && ((nniIdA && !nniIdB)||(!nniIdA && nniIdB)) && (subringType == "virtual-link"))
        {
            var parentRingJson = apUtils.getEthernetRingDetails(interconnectChoice);
            logger.debug("Erps subring - ring infra parentRingJson {}", JSON.stringify(parentRingJson));
        
            if((nniIdA && !nniIdB))
                uplinkPortErpsMapping[nniIdA]["parentRing"] = parentRingJson["id"];
            else if(!nniIdA && nniIdB)
                uplinkPortErpsMapping[nniIdB]["parentRing"] = parentRingJson["id"];
        
            var parentNniIdA = parentRingJson["devices"][deviceName]["nni-id-a"];
            var parentNniIdB = parentRingJson["devices"][deviceName]["nni-id-b"];
                    
            var parentPortNameA = apUtils.getUpdatedNniId(parentNniIdA, uplinkPortNames, true);
            var parentPortNameB = apUtils.getUpdatedNniId(parentNniIdB, uplinkPortNames, true);
                    
            uplinkPortErpsMapping[parentPortNameA] = {};
            uplinkPortErpsMapping[parentPortNameB] = {};
            uplinkPortErpsMapping[parentPortNameA]["ringIndex"] = parentRingJson["id"];
            uplinkPortErpsMapping[parentPortNameB]["ringIndex"] = parentRingJson["id"];
        }
    }
    return uplinkPortErpsMapping;
}

/**
 * This method is used to get the NNI-ID in desired format
 * @param nniId - NNI-ID
 * @param uplinkPortNames - The Uplink Port Names
 * @param isLagToLowercase - Boolean indicating lowercase conversion of LAG-Id
 */
AltiplanoUtilities.prototype.getUpdatedNniId = function(nniId, uplinkPortNames, isLagToLowercase) {
    var nniIdName;
    if(nniId) {
        if (nniId.indexOf("LAG") > -1) {
            if(isLagToLowercase) {
                nniIdName = nniId.toLowerCase();
            } else {
                nniIdName = nniId.substring(nniId.lastIndexOf("-")+1, nniId.length);
            }
        } else if (uplinkPortNames) {
            if(uplinkPortNames[nniId]){
                nniIdName = uplinkPortNames[nniId];
            }
    }
    }
    return nniIdName;
}

/**
 * This method is used to check whether the given intent and target has dependent intents or not.
 * @param intentName
 * @param deviceName
 */
AltiplanoUtilities.prototype.isDependentIntentsPresent = function (intentName, deviceName) {
    var intentNameAndTarget = intentName + "_$$_" + deviceName;
    var resourceFile = resourceProvider.getResource(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "resources/esQueryGetDependentIntentsCount.json.ftl");
    var templateArgs = {intentNameAndTarget: intentNameAndTarget};
    var request = utilityService.processTemplate(resourceFile, templateArgs);
    var response = apUtils.executeEsIntentCountRequest(request);
    if (response["count"] && response["count"] > 0) {
        return true;
    }
    return false;
}


/**
 * This method is used to track args in intent by passing input schema and additional attributes
 * @param inputObject - Input schema whose attributes are to be tracked
 * @param excludeList - Attribute list which should not be tracked
 * @param additinalKeys - Additional attributes to be tracked than the input schema
 */
AltiplanoUtilities.prototype.getTrackedArgs = function(inputObject, excludeList, additinalKeys) {
    var isExcludeListPresent = false;
    if(excludeList && excludeList.length > 0) {
        isExcludeListPresent = true;
    }
    var trackedArgs = {};
    if(inputObject) {
        Object.keys(inputObject).forEach(function (key) {
            Object.keys(inputObject[key]).forEach(function (innerKey) {
                if(!isExcludeListPresent || ( isExcludeListPresent && excludeList.indexOf(innerKey) <= -1)) {
                    trackedArgs[innerKey] = true;
                }
            });
        });
    }
    if(additinalKeys && additinalKeys.length > 0) {
        additinalKeys.forEach(function (key) {
            trackedArgs[key] = true;
        });
    }
    return trackedArgs;
}

/**
 * This method is used to set deviceDetails for Profile Manager
 * @param intentType
 * @param deviceName
 * @param target
 * @param deviceRelease
 * @param excludeList
 * @param deviceType
 * @param isGetParse
 * @param hwType
 * @param managerType
 * @param intentVersion
 */
 AltiplanoUtilities.prototype.getDeviceDetailForProfileManager = function (intentType,deviceName,target,deviceRelease,context,excludeList,
            deviceType,isGetParse,hwType,managerType, intentVersion){
    var deviceDetails = {};
    deviceDetails["intentType"] = intentType;
    if(!intentType || (((!context && !deviceName) || !deviceRelease) && !isGetParse) || ((!deviceName || !target) && isGetParse) ){
        logger.error("deviceName or deviceRelease or context or intentType or target were missed");
    }else if(isGetParse){
        deviceDetails["deviceName"] = deviceName;
        deviceDetails["deviceRelease"] = deviceRelease;
        deviceDetails["nodeType"] = deviceType + "-" + deviceRelease;
        if(managerType == intentConstants.MANAGER_TYPE_AMS){
            deviceDetails["nodeType"] = hwType + "-" + deviceRelease;
        }
        deviceDetails["excludeList"] = excludeList ? excludeList : [];
        deviceDetails["target"] = target;
        deviceDetails["intentTypeVersion"] = intentVersion? intentVersion : apUtils.getIntentVersion(intentType,target);
    }else {
        if(deviceName){
            deviceDetails["version"] = apUtils.getIntentVersion(deviceDetails["intentType"],deviceName);
        }else{
            deviceDetails["version"] = context.getIntentTypeVersion();
        }
        deviceDetails["deviceRelease"] = deviceRelease;
    }
    return deviceDetails;
}

/**
 * This method is used to get port-profile details from fiber-profiles.json based on device type
 * @param target
 * @param hardWareType
 */
AltiplanoUtilities.prototype.getHwTypeForProfileManager = function (target, hardWareType){
    var nodeType = apUtils.gatherInformationAboutDevices([target])[0].familyTypeRelease;
    var nodeTypeArr = nodeType.split(".");
    var hwType = hardWareType + "-" + nodeTypeArr[1] + "." + nodeTypeArr[2];
    return hwType;
}

/**
 * This method is used to get data from Profile Mapping
 * @param resourceName - resourceName
 * @param stepName - stepName 
 * @param profileData - profileData 
 */
 AltiplanoUtilities.prototype.getDataFromFileProfileMapping = function (resourceName, stepName, profileData) {
    var maps = JSON.parse(resourceProvider.getResource(resourceName + "profile-mapping.json"));
    if (maps) {
        for (var map in maps) {
            if(maps[map]["existing-profile-type"] == stepName){
                var subtype = maps[map]["subtype"];
                var profileType = maps[map]["profile-type"];
                if(profileData[subtype][profileType]){
                    var profileDef = profileData[subtype][profileType];
                    return JSON.parse(JSON.stringify(profileDef))
                }
            }
        }
    }
};

/**
 * This method is used to get data from Profile Mapping
 * @param resourceName - resourceName
 * @param stepName - stepName 
 * @param profileData - profileData 
 * @param actualNTSlotPlannedType - actualNTSlotPlannedType
 */
 AltiplanoUtilities.prototype.getDataFromFileProfileMappingFromActualNTSlotPlannedType = function (resourceName, stepName, profileData,actualNTSlotPlannedType) {
    var maps = JSON.parse(resourceProvider.getResource(resourceName + "profile-mapping.json"));
    if (maps) {
        for (var map in maps) {
             if(maps[map]["existing-profile-type"] == stepName){
                var subtype = maps[map]["subtype"];
                var profileType = maps[map]["profile-type"];
                if(profileData && profileData[subtype] && profileData[subtype][profileType] && actualNTSlotPlannedType && actualNTSlotPlannedType == subtype){
                    var profileDef = profileData[subtype][profileType];
                    return JSON.parse(JSON.stringify(profileDef))
                }
            }
        }
        return [];
    }
};

/**
 * This method is used to get port-profile details from fiber-profiles.json based on device type
 * @param fiberName
 * @param portProfileName
 * @param deviceType
 * @param bestType
 * @returns {Object}
 */
AltiplanoUtilities.prototype.getPortProfileDetailsByDeviceType = function (fiberName, portProfileName, nodeType) {
    var fiberIntentConfig = apUtils.getFiberIntentConfigJson(fiberName);
    if (fiberIntentConfig["pon-port"] && fiberIntentConfig["pon-port"][portProfileName] && fiberIntentConfig["pon-port"][portProfileName]["port-profile"]) {
        var portProfileName = fiberIntentConfig["pon-port"][portProfileName]["port-profile"];
        var deviceRelease = apUtils.splitToHardwareTypeAndVersion(nodeType).release;
        if (nodeType.startsWith("LS-FX")) {
            var subType = profileConstants.FIBER_PORT_PROFILE.subTypeFX;
        } else if (nodeType.startsWith("LS-MF")) {
            var subType = profileConstants.FIBER_PORT_PROFILE.subTypeMF;
        } else if (nodeType.startsWith("LS-DF")) {
            var subType = profileConstants.FIBER_PORT_PROFILE.subTypeDF;
        } else if(nodeType.startsWith("LS-SF")) {
            var subType = profileConstants.FIBER_PORT_PROFILE.subTypeSF;
        }
        var fiberIntentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_FIBER, fiberName);
        var portProfileDetails = apUtils.getAssociatedProfilesWithConfig(intentConstants.INTENT_TYPE_FIBER, fiberIntentVersion, profileConstants.FIBER_PORT_PROFILE.profileType, subType, deviceRelease, portProfileName,null,null);
        var result;
        if (portProfileDetails.size() == 1) {
            portProfileDetails.forEach(function (profile) {
                var profileKey = profile.getProfileType() + ":" + profile.getProfileType();
                result = JSON.parse(profile.getProfileConfigJSON())[profileKey];
                var pwdTypes = apUtils.getSensitiveKeys(profile.getProfileConfig(), profile.getProfileType());
                apUtils.setRedundantSensitiveKey(pwdTypes);
                result["name"] = profile.getName();
                result = JSON.parse(JSON.stringify(result, apUtils.stringReplacer));
            });
        }
        return result;
    }
}

/**
 * This method is used as a utility to validate MSTP configurations.
 * The validations are performed when at least one of the intent NNI-IDs match the NNI-IDs in MSTP
 * @param deviceName - Device Name
 * @param intentConfigJson - The intent's configuration attributes
 * @param contextualErrorJsonObj - The object to track errors
 * @param validateContext - Context used during validation process
 * @param isSyncOper - Boolean indicating the sync operation
 */
AltiplanoUtilities.prototype.validateMstpConfig = function (deviceName, intentConfigJson, contextualErrorJsonObj, validateContext, isSyncOper) {
    var nniIds = intentConfigJson["nni-id"];
    var sVlanId = intentConfigJson["s-vlan-id"];
    if (!nniIds || nniIds.length === 0) {
        return;
    }

    var stpConfig = apUtils.getStpConfigFromL2MgmtInfra(deviceName);
    var stpMode = stpConfig["stpMode"];
    var mstpPorts = stpConfig["nniIds"];

    if (stpMode && stpMode === "mstp" && mstpPorts && mstpPorts.length > 0) {
        var mstpNniIds = nniIds.filter(function (nniId) {
            return mstpPorts.indexOf(nniId) !== -1;
        });
        if (mstpNniIds && mstpNniIds.length > 0 && sVlanId) {
            if (isSyncOper) {
                throw new RuntimeException("Invalid Configuration. For MSTP, LS-MF-LMNT-B device type can only have C-VLAN ID.");
            } else {
                contextualErrorJsonObj["s-vlan-id"] = "Invalid Configuration. For MSTP, LS-MF-LMNT-B device type can only have C-VLAN ID.";
            }
        } else {
            if (isSyncOper) {
                requestScope.get().put("isMstpConfiguredDevice", true);
            }
        }
    }
}

/**
 * This method is used to retrieve list of Partition Access Profiles available
 * @param valueProviderContext
 */
 AltiplanoUtilities.prototype.getPartitionAccessProfiles = function () {
    var listPartitionAccessProfiles = pap.getUserAllowedPAPs();
    return listPartitionAccessProfiles;
}

/**
 * This method is used to validate the Partition Access Profile used for intent creation
 * @param valueProviderContext
 */
AltiplanoUtilities.prototype.validatePartitionAccessProfile = function (contextualErrorJsonObj,intentConfigJson) {
    var listPapProfiles = pap.getUserAllowedPAPs();
    var intentPapProfile = intentConfigJson["partition-access-profile"];
    logger.debug("listPapProfiles = {} ",listPapProfiles);
    if (!listPapProfiles || listPapProfiles == null){
        contextualErrorJsonObj["partition-access-profile"] = "Unable to retrieve the list of allowed PAPs";
        return;
    }
    if (!listPapProfiles.contains(intentPapProfile)) {
        contextualErrorJsonObj["partition-access-profile"] =  "'"+intentPapProfile+"' is not a valid Partition Access Profile";
    }
}

/**
 * This method used to update the Pratition Access Profile used by device name
 * @param deviceName - The device name
 * @param papName - The partition access profile name
 */
AltiplanoUtilities.prototype.updatePartitionAccessProfile = function (deviceName, papName) {
    if(deviceName && papName){
        mds.updatePAP(deviceName, papName);
    }
}

/**
 * This method is used to get data from Profile Manager
 * @param target - deviceName
 * @param intentType - intentType 
 * @param hwTypePrefix - hwTypePrefix example: 'DF'
 */
 AltiplanoUtilities.prototype.getDataFromProfileManager = function (target, intentType, hwTypePrefix) {
    var intentVersion = apUtils.getIntentVersion(intentType, target);
    var deviceType = apUtils.getNodeTypefromEsAndMds(target);
    var nodeType = hwTypePrefix + "-" + deviceType.split(".")[1] + "." + deviceType.split(".")[2];
    return apUtils.getParsedProfileDetailsFromProfMgr(target, nodeType, intentType, [], intentVersion);
};

/**
 * Return all the SF devices (LTS) and iHUB
 * @param shelfName
 * @returns {[]}
 */
AltiplanoUtilities.prototype.getAllSfLtiHubDevices = function (shelfName) {
    var devices = [];
    var sfDevices = mds.getNDevicesStartingWith(shelfName + intentConstants.DEVICE_SEPARATOR, intentConstants.LS_FX_MAX_DEVICE_COUNT);

    if (sfDevices && sfDevices.size() > 0) {
        sfDevices.forEach(function (sfDevice) {
            if (sfDevice.endsWith(intentConstants.DOT_LS_IHUB)) {
                var lastIndex = sfDevice.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
                var mfShelfName = sfDevice.substring(0, lastIndex);
                if (mfShelfName === shelfName && sfDevice.substring(lastIndex + 1).startsWith(intentConstants.LS_IHUB)) {
                    devices.push(sfDevice);
                }
            } else if (sfDevice.contains(intentConstants.LT_STRING)) {
                var device = apUtils.getShelfDeviceName(sfDevice, intentConstants.LS_SF_PREFIX);
                if (device === shelfName) {
                    devices.push(sfDevice);
                }
            }
        });
    }
    return devices;
}

/**
 * This method used to check whether particular LT is belongs to SF supported.
 */
AltiplanoUtilities.prototype.isSFSupportedLTFamily = function (family) {
    var isSupported = false;
    if(family.startsWith(intentConstants.FAMILY_TYPE_LS_SF_SFDB_A)){
        isSupported = true;
    }
    return isSupported;
}



/**
 * This method is used to validate the duid field in fiber device-xx intents
 */
 AltiplanoUtilities.prototype.validateDuid = function (intentConfigArgs, contextualErrorJsonObj,lsPrefix) {
    if (intentConfigArgs["duid"]) {
        var isDuidSupported = apCapUtils.getCapabilityValue(intentConfigArgs["hardware-type"], intentConfigArgs["device-version"], capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DUID_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
        if (!isDuidSupported) {
            contextualErrorJsonObj["leaf-list#duid"] = "Call home is not supported for " + intentConfigArgs["hardware-type"] + "-" + intentConfigArgs["device-version"];
        }
        if (intentConfigArgs["boards"]) {
            Object.keys(intentConfigArgs["boards"]).forEach(function (board) {
                var deviceVersion = intentConfigArgs["boards"][board]["device-version"] ? intentConfigArgs["boards"][board]["device-version"] : intentConfigArgs["device-version"];
                var plannedType = intentConfigArgs["boards"][board]["planned-type"];
                var slotName = intentConfigArgs["boards"][board]["slot-name"];

                var isEthBoard = false;
                isEthBoard = apCapUtils.isValueInCapability(intentConfigArgs["hardware-type"], intentConfigArgs["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.PORT_TYPE, plannedType, "ETH");
                var isBoardTypeLT = apCapUtils.isValueInCapability(intentConfigArgs["hardware-type"], intentConfigArgs["device-version"], capabilityConstants.BOARD_CATEGORY, capabilityConstants.SLOT_TYPE, plannedType, "LT");
                if (!isEthBoard && isBoardTypeLT) {
                    if (slotName.indexOf(intentConstants.LT_STRING) > -1) {
                        var hardwareType = lsPrefix + "-" + plannedType;
                        var isDuidSupported = apCapUtils.getCapabilityValue(hardwareType, deviceVersion, capabilityConstants.DEVICE_CATEGORY, capabilityConstants.IS_DUID_SUPPORTED, capabilityConstants.HYPHEN_CONTEXT, false);
                        if (!isDuidSupported) {
                            contextualErrorJsonObj["list#boards," + board + ",leaf#device-version"] = "Call home is not supported for " + hardwareType + "-" + deviceVersion;
                        }
                    }
                }
            });
        }
    }
}

/**
 * FNMS-107949 translate range format
 * @param {Array} ranges should be an array,ex: ["100", "200-300", "400-500"]
 * @param {String}} replacedSeparator the separator need to be replaced, ex: "-"
 * @param {String} expectedSeparator the expected separator, ex: ".."
 * @returns translated ranges, ex: ["100", "200..300", "400..500"]
 */
AltiplanoUtilities.prototype.translateRangeValues = function (ranges, replacedSeparator, expectedSeparator) {
    if (ranges && typeof ranges.push === "function" && ranges.length > 0) {
        return ranges.map(function (range) {
            return replacedSeparator && expectedSeparator && replacedSeparator !== expectedSeparator ? range.replace(replacedSeparator, expectedSeparator) : range;
        })
    }
    return ranges;
}

/**
 * FNMS-107949 check the if 2 ranges overlap or not 
 * ranges [100,200] and [150, 250]
 * @param {String} startRangeX start range of 1st range
 * @param {String*} endRangeX end range of 1st range
 * @param {String} startRangeY start range of 2nd range
 * @param {String} endRangeY end range of 2nd range
 * @returns Boolean [100,200] and [150, 250] -> false
 */
AltiplanoUtilities.prototype.checkRangesOverlap = function (startRangeX, endRangeX, startRangeY, endRangeY){
    if((parseInt(startRangeY) <= parseInt(endRangeX)) && (parseInt(endRangeY) >= parseInt(startRangeX))){
        return true;
    }
    return false;
}

/**
 * FNMS-107949 convert a single value range to an array range withs start and end for further process
 * @param {String} range should be "100" or "100-200"
 * @param {String} separator separator of range, ex: "-", "..", default is "-"
 * @returns return an array from a range [100, 100] or [100, 200]
 */
AltiplanoUtilities.prototype.convertRanges = function (range, separator) {
    separator = separator || "-";
    var ranges = range.split(separator);
    if (ranges.length == 1) {
        ranges[1] = ranges[0];
    }
    return ranges;
}


/**
 * This method is used to get intent state of intent type which is nerver-synced
 * @param {String} intentType
 * @param {String} target 
 * @returns {Boolean} 
 */
AltiplanoUtilities.prototype.isNeverSynced = function (intentType,target) {
    var intentState = ibnService.getIntentState(intentType,target);
    if(!intentState){
        throw new RuntimeException("Cannot get intent state of target '" + target + "' of intent type '" + intentType + "'");
    }
    return intentState.isNeverSynced();
}
AltiplanoUtilities.prototype.allValuesAreEqual = function (input) {
    if (!input.length) return true;
    return !input.filter(function (e) {
        return e !== input[0];
    }).length;
}
/**
 * This method used to verify the given string is in URL format
 * @param {String} urlValue 
 * @returns {Boolean}
 */
AltiplanoUtilities.prototype.isUrl = function (urlValue) {
    if (urlValue.startsWith("http://") || urlValue.startsWith("https://") || urlValue.startsWith("sftp://") || urlValue.startsWith("ftp://") || urlValue.startsWith("ftps://")) {
        if (!urlValue.startsWith("http://file-on-device/")) {
            return true;
        }
    }
    return false;
}

AltiplanoUtilities.prototype.validateTargetSofwareFormat = function (intentConfigArgs, contextualErrorJsonObj) {
    var boards = intentConfigArgs["boards"];
    if (intentConfigArgs["active-software"] && apUtils.isUrl(intentConfigArgs["active-software"])) {
        contextualErrorJsonObj["active-software"] = "URL format is not supported for active-software";
    }
    if (intentConfigArgs["passive-software"] && apUtils.isUrl(intentConfigArgs["passive-software"])) {
        contextualErrorJsonObj["passive-software"] = "URL format is not supported for passive-software";
    }
    if (intentConfigArgs["target-transformation-software"] && apUtils.isUrl(intentConfigArgs["target-transformation-software"])) {
        contextualErrorJsonObj["target-transformation-software"] = "URL format is not supported for target-transformation-software";
    }
    if (boards) {
        Object.keys(boards).forEach(function (boardName) {
            var board = boards[boardName];
            if (board["active-software"] && apUtils.isUrl(board["active-software"])) {
                var keyMess = "list#boards," + board["slot-name"] + ",leaf#active-software";
                contextualErrorJsonObj[keyMess] = "URL format is not supported for active-software";
            }
            if (board["passive-software"] && apUtils.isUrl(board["passive-software"])) {
                var keyMess = "list#boards," + board["slot-name"] + ",leaf#passive-software";
                contextualErrorJsonObj[keyMess] = "URL format is not supported for passive-software";
            }
        });
    }   
}

/**
 * Method to extract l2-profile
 *
 * @param profileList l2-profile list
 * @param profileName profile to process
 * @param category user-port or subtended-port
 * @param key unique identifier of processing profiles
 * @returns
 */
AltiplanoUtilities.prototype.filterL2Profiles = function (profileList, profileName, category, key) {
    var filteredProfiles = [];
    if (profileList[profileName]) {
        var l2Profiles = JSON.parse(JSON.stringify(profileList[profileName]));
        Object.keys(l2Profiles).forEach(function (profile) {
           if(profileName == "mac-learning-control-profiles" || (JSON.stringify(l2Profiles[profile][category]) !== null && JSON.stringify(l2Profiles[profile][category]) !== "{}")) {
               var temp = l2Profiles[profile][category];
               if(temp){
                   temp[key] = l2Profiles[profile][key];
                   filteredProfiles.push(temp);
               }
           }
        });
    }
    return filteredProfiles;
}

/**
 * Utility function for constructing array object to key and object as value, based on given key
 *Eg:
 * Input - [{"name":"abc","location:"xyz"}], then if key = "name"
 * Output - {"abc":{"name":"abc","location:"xyz"}}
 * @param arrayJson
 * @param key
 * @returns {"key":{"key":""}}
 */
AltiplanoUtilities.prototype.convertJsonArrayToKeyValueJSONObjects = function (arrayJson, key) {
    var constructedJson = {};
    arrayJson.forEach(function (value) {
        constructedJson[value[key]] = value;
    });
    return constructedJson;
}

AltiplanoUtilities.prototype.getConnectorPortProfileFromUplinkConnection = function (target) {
    var connectorPortProfile = "";
    var uplinkIntentConfiguration = {};
    var uplinkIntent = apUtils.getIntent(intentConstants.INTENT_TYPE_UPLINK_CONNECTION, target);
    if (uplinkIntent) {
        var uplinkIntentKeyForListFunction = function (listName) {
            switch (listName) {
                case "uplink-ports":
                    return "port-id";
                case "auto-negotiation-Advertised-bits":
                    return "yang:list#leaf-list";
                case "boards":
                    return ["slot-name"];
                default:
                    return null;
            }
        };
        var uplinkIntentConfig = uplinkIntent.getIntentConfig();
        apUtils.convertIntentConfigXmlToJson(uplinkIntentConfig, uplinkIntentKeyForListFunction, uplinkIntentConfiguration);
    }
    if (uplinkIntentConfiguration) {
        connectorPortProfile = uplinkIntentConfiguration["connector-port-profile"];
    }
    return connectorPortProfile;
}
/**
 * Method's used to convert array of object to map with the key
 * @param {*} ArrayObject array of object
 * @param {*} attributeToBeKey attribute of object in array to be key of map
 * @param {*} map 
 * @returns map of with defined key
 */
AltiplanoUtilities.prototype.convertArrayObjectToMap = function (ArrayObject, attributeToBeKey, map) {

    if (!ArrayObject || typeof ArrayObject.push !== "function" || ArrayObject.length === 0 || !attributeToBeKey) return map ? map : {};
    if (!map) {
        map = {};
    }
    for (var i = 0; i < ArrayObject.length; i++) {
        if (ArrayObject[i][attributeToBeKey]) {
            map[ArrayObject[i][attributeToBeKey]] = ArrayObject[i];
        }
    }
    return map;
}

/**
 * Method to convert Ascii string to HEX 
 *Eg:
 * Input - str = 
 * Output - 
 * @param strAscii
 * @returns strHex
 */

AltiplanoUtilities.prototype.convertAsciiToHex = function (str) {
    var arr1 = [];
    for (var n = 0, l = str.length; n < l; n++) {
        var hex = Number(str.charCodeAt(n)).toString(16);
        arr1.push(hex);
    }
    return arr1.join('');
}

AltiplanoUtilities.prototype.convertHexToAsciiForISAM = function (str1) {
    var hex = str1.toString();
    var str = '';
    hex = hex.replace(/(00)+$/, ''); // Remove padding bytes "00" at the end of the hex string. Hexadecimal 44454641554C54000000 => Ascii DEFAULT
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}

AltiplanoUtilities.prototype.convertHexToAscii = function (str1) {
    var hex  = str1.toString();
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	return str;
}

AltiplanoUtilities.prototype.getClassFromPortTypeAndPortSpeed = function (portType, portSpeed, portSpeedConfigurable, virtualBoardNumber, ethAndPortSpeedType) {
    if (portType == 'veip' || portType == 'onu-v-vrefpoint' || portSpeedConfigurable == "true") {
        return "bbf-hwt:transceiver-link";
    } else if (portType == 'pots') {
        return "nokia-hwi:rj11";
    } else if (portType == 'ethernetCsmacd') {
        if (virtualBoardNumber && ethAndPortSpeedType != 'multipleEthCardsWithDifferentSpeed') {
            return "bbf-hwt:rj45";
        }   
        if (portSpeed == "eth-if-speed-10mb") {
            return "nokia-hwi:rj45-10M";
        } else if (portSpeed == "eth-if-speed-10-100mb") {
            return "nokia-hwi:rj45-10-100MB";
        } else if (portSpeed == "eth-if-speed-100mb") {
            return "nokia-hwi:rj45-100M";
        } else if (portSpeed == "eth-if-speed-1gb") {
            return "nokia-hwi:rj45-1G";
        } else if (portSpeed == "eth-if-speed-10gb") {
            return "nokia-hwi:rj45-10G";
        } else if (portSpeed == "eth-if-speed-2.5gb") {
            return "nokia-hwi:rj45-2.5G";
        } else if (portSpeed == "eth-if-speed-5gb") {
            return "nokia-hwi:rj45-5G";
        } else if (portSpeed == "eth-if-speed-25gb") {
            return "nokia-hwi:rj45-25G";
        } else if (portSpeed == "eth-if-speed-40gb") {
            return "nokia-hwi:rj45-40G";
        }
        return "bbf-hwt:rj45";
    } else {
        return "bbf-hwt:transceiver-link";
    }
}

/**
 * Method to convert Array to Object 
 *Eg:
 * Input - array  
 * Output - object
 * @param array [4,2,7,...]
 * @returns object {"1":4,"2":2,"3":7,....}
 * 
 */

AltiplanoUtilities.prototype.arrayToObject = function(array) {
    var object = {};
    for (let i = 0; i < array.length; i++) {
      object[i] = array[i];
    }
    return object;
}

AltiplanoUtilities.prototype.compareAndReturnOldAndRemovedValue = function(oldObj, newObj, key, addRemoveAllvalue, addOldValue){
    if((oldObj.hasOwnProperty(key) && newObj.hasOwnProperty(key)) || (oldObj.hasOwnProperty(key) && !newObj.hasOwnProperty(key))){
        if(addRemoveAllvalue && oldObj.hasOwnProperty(key) && !newObj.hasOwnProperty(key)){
            newObj["removed-".concat(key)] = true;
        }
        if(addOldValue){
            var obj = this.compareArr(oldObj[key],newObj[key] ? newObj[key] : []);
            if(obj.hasOwnProperty("remove-value") && obj["remove-value"].length > 0){
                newObj["old-".concat(key)] = this.arrayToObject(obj["remove-value"]);
            }
        }
    }
}

AltiplanoUtilities.prototype.findObjectChanges = function(obj1, obj2) {
    var changes = {};
    var keys = Object.keys(obj1).concat(Object.keys(obj2));
  
    for (var key of keys) {
      if (!obj1.hasOwnProperty(key) || !obj2.hasOwnProperty(key)) {
        changes[key] = {
          addedValue: obj2.hasOwnProperty(key) ? obj2[key] : undefined,
          removedValue: obj1.hasOwnProperty(key) ? obj1[key] : undefined,
        };
      } else if (obj1[key] !== obj2[key]) {
        changes[key] = {
          old: obj1[key],
          new: obj2[key],
        };
      }
    }
  
    return changes;
  }

AltiplanoUtilities.prototype.checkObjHaveRemoved = function(obj){
    var keys = Object.keys(obj);
    for(var key of keys){
        if(obj[key].hasOwnProperty("removedValue") && obj[key].removedValue != undefined){
            return true;
        }
    }
    return false;
}

AltiplanoUtilities.prototype.findObjectChangeReturnOldValue = function(odlObj,newObj,key,saveObj){
    if(odlObj.hasOwnProperty(key) && newObj.hasOwnProperty(key)){
        var changeObj = this.findObjectChanges(odlObj[key],newObj[key]);
        if(this.checkObjHaveRemoved(changeObj)){
            saveObj["old-".concat(key)] = changeObj;
        }
    }
}

AltiplanoUtilities.prototype.deleteValue = function(obj,key){
    if(obj.hasOwnProperty(key)){
        delete obj[key];
    }
}

AltiplanoUtilities.prototype.formatEnhancedFiltersForTopo = function(objs){
    if(typeof objs !== undefined){
        for(var obj in objs){
            if(typeof objs[obj] !== undefined ){
                for(var key in objs[obj]){
                    if(key == "filter" && typeof objs[obj][key] !== undefined){
                        for(var filter in objs[obj][key]){
                            this.deleteValue(objs[obj][key][filter],"old-ipv4");
                            this.deleteValue(objs[obj][key][filter],"old-ipv6");
                            this.deleteValue(objs[obj][key][filter],"removed-ethernet-frame-type");
                            this.deleteValue(objs[obj][key][filter],"old-ip-common");
                            this.deleteValue(objs[obj][key][filter],"removed-protocol");
                            this.deleteValue(objs[obj][key][filter],"old-protocol");
                            this.deleteValue(objs[obj][key][filter],"removed-flow-color");
                            this.deleteValue(objs[obj][key][filter],"old-flow-color");
                            if(objs[obj][key][filter].hasOwnProperty("pbit-marking-list")){
                                if(typeof objs[obj][key][filter]["pbit-marking-list"] !== undefined){
                                    for(var pbit in objs[obj][key][filter]["pbit-marking-list"]){
                                        this.deleteValue(objs[obj][key][filter]["pbit-marking-list"][pbit],"old-pbit-value");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return objs;
}

/**
 * The method adds an element containing a list of deleted pbit-values 
 *Eg:
 * Input - Object Enhanced Filter Profile Old Value , Object Enhanced Filter Profile New Value
 * Output - Enhanced Filter Profile with new value for pbit-value with the new config, there is an additional object containing the pbit-values that have been deleted 
 * @param oldObject 
 * @param newObject
 */

AltiplanoUtilities.prototype.checkOldValueForEnhancedFiltersProfile = function(enhancedFilterProfileOldValue,enhancedFilterProfileNewValue){
    if(enhancedFilterProfileOldValue && enhancedFilterProfileNewValue){
        for(var keyOld in enhancedFilterProfileOldValue){
            for(var keyNew in enhancedFilterProfileNewValue){
                 if(keyOld == keyNew){
                     if(enhancedFilterProfileOldValue[keyOld]["filter"] && enhancedFilterProfileNewValue[keyNew]["filter"]){
                         var enhancedFilterProfileOldFilterValue = enhancedFilterProfileOldValue[keyOld]["filter"];
                         var enhancedFilterProfileNewFilterValue = enhancedFilterProfileNewValue[keyNew]["filter"];
                         for(var keyOldFilter in enhancedFilterProfileOldFilterValue){
                             for(var keyNewFilter in enhancedFilterProfileNewFilterValue){
                                 if(keyOldFilter == keyNewFilter){
                                    this.compareAndReturnOldAndRemovedValue(enhancedFilterProfileOldFilterValue[keyOldFilter],enhancedFilterProfileNewFilterValue[keyNewFilter],"ethernet-frame-type",true,false);
                                    this.compareAndReturnOldAndRemovedValue(enhancedFilterProfileOldFilterValue[keyOldFilter],enhancedFilterProfileNewFilterValue[keyNewFilter],"flow-color",true,true);
                                    this.compareAndReturnOldAndRemovedValue(enhancedFilterProfileOldFilterValue[keyOldFilter],enhancedFilterProfileNewFilterValue[keyNewFilter],"protocol",true,true);
                                    this.findObjectChangeReturnOldValue(enhancedFilterProfileOldFilterValue[keyOldFilter],enhancedFilterProfileNewFilterValue[keyNewFilter],"ipv4",enhancedFilterProfileNewValue[keyNew]["filter"][keyNewFilter]);
                                    this.findObjectChangeReturnOldValue(enhancedFilterProfileOldFilterValue[keyOldFilter],enhancedFilterProfileNewFilterValue[keyNewFilter],"ipv6",enhancedFilterProfileNewValue[keyNew]["filter"][keyNewFilter]);
                                    this.findObjectChangeReturnOldValue(enhancedFilterProfileOldFilterValue[keyOldFilter],enhancedFilterProfileNewFilterValue[keyNewFilter],"ip-common",enhancedFilterProfileNewValue[keyNew]["filter"][keyNewFilter]);
                                     if(enhancedFilterProfileOldFilterValue[keyOldFilter]["pbit-marking-list"] && enhancedFilterProfileNewFilterValue[keyNewFilter]["pbit-marking-list"]){
                                         var oldPbitMarkingList = enhancedFilterProfileOldFilterValue[keyOldFilter]["pbit-marking-list"];
                                         var newPbitMarkingList = enhancedFilterProfileNewFilterValue[keyNewFilter]["pbit-marking-list"];
                                         for(var oldKeyPbit in oldPbitMarkingList){
                                             for(var newKeyPbit in newPbitMarkingList){
                                                 if(oldKeyPbit == newKeyPbit){
                                                     if(oldPbitMarkingList[oldKeyPbit]["pbit-value"] && newPbitMarkingList[newKeyPbit]["pbit-value"]){
                                                        this.compareAndReturnOldAndRemovedValue(oldPbitMarkingList[oldKeyPbit],enhancedFilterProfileNewValue[keyNew]["filter"][keyNewFilter]["pbit-marking-list"][newKeyPbit],"pbit-value",false,true);
                                                     }
                                                 }
                                             }
                                         }
                                     }
                                 }else continue;
                             }
                         }
                     }
                 }else continue;
            }
         }
    }
    
}

/**
 * Method compare two Arrays and returns an Object containing a list of added and removed elements 
 *Eg:
 * Input - array1 , array2  
 * Output - object
 * @param array1 [4,2,7]
 * @param array2 [4,3]
 * @returns object {""add-value"":[2,7],"remove-value":[3]}
 * 
 */

AltiplanoUtilities.prototype.compareArr = function(arr1,arr2){
    var check = false;
    var arrAddValue = [];
    var arrRemoveValue = [];
    if (arr1.length !== arr2.length) {
        check = true;
    }
    if(!check){
        for (var i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                check = true;
            }
        }
    }
    if(check){
        var elementInArr1 = {};
        for(var element of arr1){
            elementInArr1[element] = true;
        }
        for(var element of arr2){
            if(!elementInArr1.hasOwnProperty(element)){
                arrAddValue.push(element);
            }
            delete elementInArr1[element];
        }
        for(var element in elementInArr1){
            arrRemoveValue.push(element);
        }
        return {
            "add-value":arrAddValue,
            "remove-value": arrRemoveValue
        };
    }

    return false;
}
AltiplanoUtilities.prototype.getClassFromCardTypeAndPortSpeed = function(cardType,portSpeed,portSpeedConfigurable,ethAndPortSpeedType) {
    if (cardType == 'VEIP' || cardType == 'onu-v-vrefpoint') {
        return "bbf-hwt:transceiver-link";
    } else if (cardType == 'POTS') {
        return "nokia-hwi:rj11";
    } else if (cardType == 'Ethernet Optical') {
        return "nokia-hwi:cage-uni";
    } else if (cardType.startsWith("Ethernet") || cardType == "Ethernet") {
        if(portSpeedConfigurable == "true"){
            return "bbf-hwt:transceiver-link";
        }
        if(ethAndPortSpeedType == "singleEthCard") {
            return "bbf-hwt:rj45";
        }
        if(ethAndPortSpeedType == "multiEthCardWithDiffSpeed"){
            if(cardType == "Ethernet-1G"){
                return "nokia-hwi:rj45-1G";
            }else if(cardType == "Ethernet-2.5G"){
                return "nokia-hwi:rj45-2.5G";
            }else if(cardType == "Ethernet-10"){
                return "nokia-hwi:rj45-10G";
            }
            return "bbf-hwt:rj45";
        }
    }
    return "bbf-hwt:rj45";
}

AltiplanoUtilities.prototype.convertWavelengthToFrequency = function (wavelengthInNm, decimals) {
    if(wavelengthInNm){
        var speedOfLight = 299792458;
        var wavelengthInMeters = wavelengthInNm * 1e-9; // 1e-9 = 0.000000001
        var frequencyInHz = speedOfLight / wavelengthInMeters;
        var frequencyInMHz = Math.round(frequencyInHz  * 1e-6); // 1e-6 = 0.000001
        if(decimals){
            frequencyInMHz = Math.floor(frequencyInMHz/decimals) * decimals;  // if decimals = 10000 then 196100432 => 196100000	
        }
        return frequencyInMHz;
    }
    return null;
}

AltiplanoUtilities.prototype.isAllPortSameSpeed = function(card) {
    logger.debug("isAllPortSameSpeed card = {} ",JSON.stringify(card));
    var portSpeedListOnCard = [];
    let portSpeed;
    for (var port in card.ports) {
        if(card.ports[port]["portspeed"] == undefined)
            return false;
        if(card.ports[port]["portspeed"]["value"]){
            portSpeed = card.ports[port]["portspeed"]["value"];
        } else{
            portSpeed = card.ports[port]["portspeed"];
        }
        logger.debug("isAllPortSameSpeed portSpeed = {} ",portSpeed);
        if(portSpeed == null || portSpeed == "") {
            return false;
        }
        if(portSpeedListOnCard.indexOf(portSpeed) == -1)
            portSpeedListOnCard.push(portSpeed);
    }
    logger.debug("isAllPortSameSpeed portSpeedListOnCard = {} ",JSON.stringify(portSpeedListOnCard));
    if(portSpeedListOnCard.length > 1)
        return false;
    return true;
}

/**
 * Method to get Ethernet and Port speed type
 *Eg:
 * Input = cards detai; 
 * Output number
 * @param cards
 * @returns 
 * 1 if single Eth card, 
 * 2 if multiple Eth card with different port speed
 * 3 if multiple Eth card with same port speed
 * 0 if have not Eth card
 */

AltiplanoUtilities.prototype.gethEthAndPortSpeedType = function (cards) {
    var cardTypeList = [];
    var portSpeedList = [];
    for (var key in cards) {
        let cardType = cards[key]["cardType"];
        if(cardType == "Ethernet" || cardType.startsWith("Ethernet-")){
            cardType = "Ethernet";
        }
        cardTypeList.push(cardType);
        if (cardType == "Ethernet") {
            var portKey;
            if (cards[key]["portNoList"]) {
                portKey = "portNoList";
            } else {
                portKey = "ports";
            }
            Object.keys(cards[key][portKey]).forEach(port => {
                if(cards[key][portKey][port]["portspeed"]){
                    if(cards[key][portKey][port]["portspeed"]["value"] && portSpeedList.indexOf(cards[key][portKey][port]["portspeed"]["value"]) < 0 ){
                        portSpeedList.push(cards[key][portKey][port]["portspeed"]["value"]);
                    }
                    else if(cards[key][portKey][port]["portspeed"]["value"] == undefined && cards[key][portKey][port]["portspeed"] != "" && portSpeedList.indexOf(cards[key][portKey][port]["portspeed"]) < 0){
                        portSpeedList.push(cards[key][portKey][port]["portspeed"]);
                    }
                }
            })
        }
    }
    if (cardTypeList.indexOf('Ethernet') > -1) {
        if (cardTypeList.indexOf('Ethernet') == cardTypeList.lastIndexOf('Ethernet')) {
            return 'singleEthCard'; 
        } else {
            if (portSpeedList.length > 1) {
                return 'multipleEthCardsWithDifferentSpeed';
            } else {
                return 'multipleEthCardsWithSameSpeed';
            }
        }
    }
    return 'notExistsEthCard';
}

                            
AltiplanoUtilities.prototype.suggestLabelForCategory = function (categoriesList) {
    if (!categoriesList) {
        categoriesList = [];
    }
    try {
        var categories = mds.getAllCategories(categoriesList);
        return categories;
    } catch (error) {
        logger.info("Error while trying to get categories" + error);
    }
}

/**
 * This method provide suggested value for a choosen category.
 * @param deviceName
 * @param category
 */

AltiplanoUtilities.prototype.suggestValuesForCategory = function (searchText, category) {
    var result = mds.getCategoryValues(category,searchText,'10',[]);
    if ( result ) {
        try {
            var values ={};
            result.forEach(function (item) {
                values[item] = item;
            })
            return values;
        } catch (error) {
            logger.info("Error while trying to suggesting value " + error);
        }
    } 
}

/**
 * This method will update the labels in mariaDB after audit,sync.
 * @param deviceName
 * @param labelInput
 */

AltiplanoUtilities.prototype.updateLabels = function (deviceName, labelInput, mode) {
    if (deviceName) {
        var updateLabels = new ArrayList();
        var labelConfig = [];
        if(labelInput){
            var keys = Object.keys(labelInput);
            for (var key in keys) {
                labelConfig.push(labelInput[keys[key]]);
            }
            for (var index in labelConfig) {
                updateLabels.add(JSON.stringify(labelConfig[index]));
            }
            try {
                return mds.updateLabels([deviceName], updateLabels, "replace", mode);
            } catch (error) {
                throw new RuntimeException("Error while updating labels " + ": " + error.getMessage());
            }
        }
    }
}

/**
 * This method will retrieve the labels in mariaDB for specific devices.
 * @param deviceName
 */

AltiplanoUtilities.prototype.getLabelsForDevices = function (deviceName) { 
    var values = mds.getLabelsForDevices([deviceName]);
    return values[deviceName];
}

/**
 * This method will delete the labels in mariaDB for specific devices with exact label values.
 * @param deviceName
 * @param labelValue
 */

AltiplanoUtilities.prototype.deleteLabelsForDevices = function (deviceName, labelValue) {
    var deleteLabels = new ArrayList();
    var deleteValues = [];
    for (index in labelValue) {
        deleteValues.push(labelValue[index]);
    }
    for (index in deleteValues) {
        deleteLabels.add(JSON.stringify(deleteValues[index]));
    }
    return mds.deleteLabelsForDevices([deviceName],deleteLabels);
}

/**
 * This method will compare the labels get from mariaDB and return undesired or misaligned label.
 * the param label is label values retrieved from mariaDB
 * the param labelsIntentConfig is label values retrieved from mariaDB
 * @param label 
 * @param labelsIntentConfig
 */
AltiplanoUtilities.prototype.commpareLabels = function (label, labelsIntentConfig) {
    var formatLabel = {};
    if (label && label.length !== 0) {
        var labelKeys = [];
        for (var l in label) {
            labelKeys.push(l);
        }
        for (var i = 0; i < labelKeys.length; i++) {
            var keyStr = labelKeys[i];
            var keyValue = label[keyStr];
            if (keyValue && keyValue.length !== 0) {
                var categoryName = keyValue["category"];
                var categoryValue = keyValue["value"];
                formatLabel[categoryName + "#" + categoryValue] = { "category": categoryName, "value": categoryValue };
            }
        }
    }
    if (!labelsIntentConfig) {
        labelsIntentConfig = [];
    }
    if (!formatLabel) {
        formatLabel = [];
    }

    var arrayLabel;
    var misalignedLabel = [];
    var undesiredLabel = [];
    if (Object.keys(formatLabel).length > 0 && Object.keys(labelsIntentConfig).length > 0) {
        arrayLabel = Object.keys(formatLabel).concat(Object.keys(labelsIntentConfig));
    } else if (Object.keys(formatLabel).length > 0) {
        arrayLabel = Object.keys(formatLabel);
    } else {
        arrayLabel = Object.keys(labelsIntentConfig);
    }

    if (arrayLabel.length > 0) {
        var newArrayLabel = arrayLabel.filter((c, index) => {
            return arrayLabel.indexOf(c) === index;
        });
        newArrayLabel.forEach(function (value) {
            if (Object.keys(formatLabel).indexOf(value) == - 1) {
                misalignedLabel.push(value)
            }
            if (Object.keys(labelsIntentConfig).indexOf(value) == - 1) {
                undesiredLabel.push(value)
            }
        })
    }
    if (undesiredLabel.length > 0 && misalignedLabel.length > 0) {
        return {
            "undesiredLabel": undesiredLabel,
            "misalignedLabel": misalignedLabel
        }
    }
    if (undesiredLabel.length > 0) {
        return {
            "undesiredLabel": undesiredLabel
        }
    }
    if (misalignedLabel.length > 0) {
        return {
            "misalignedLabel": misalignedLabel
        }
    }
}

/**
 * This method will execute the needed value for deleting labels in mariaDB 
 * @param baseArgs
 * @param lastIntentConfigFromTopo
 */
 AltiplanoUtilities.prototype.executeDeleteLabel = function (baseArgs, lastIntentConfigFromTopo, deviceName, iHubDeviceName, target, networkState) {
    if ( baseArgs["boards"] && lastIntentConfigFromTopo["boards"] ) {
        if (Object.keys(baseArgs["boards"]).length < Object.keys(lastIntentConfigFromTopo["boards"]).length) {
            var deleteTarget
            for (var slot in lastIntentConfigFromTopo["boards"]) {
                if (JSON.stringify(lastIntentConfigFromTopo["boards"][slot]).indexOf(JSON.stringify(baseArgs["boards"][slot])) == -1) {
                    deleteTarget = target + `.${slot}`;
                }
                if (deleteTarget) {
                    this.deleteLabelsForDevices(deleteTarget, baseArgs['label'])
                }
            }
        }
    } else if ( !baseArgs["boards"] && lastIntentConfigFromTopo["boards"] ) {
        var deleteTarget
        for (var slot in lastIntentConfigFromTopo["boards"]) {
                deleteTarget = target + `.${slot}`;
            this.deleteLabelsForDevices(deleteTarget, lastIntentConfigFromTopo['label'])
        }
    }
    var currentLabels = {};
    var oldLabels = {};
    if (baseArgs['label']) {
        currentLabels = baseArgs['label'];
    }
    if (lastIntentConfigFromTopo['label']) {
        oldLabels = lastIntentConfigFromTopo['label'];
    }
    if (!baseArgs['label'] && lastIntentConfigFromTopo['label']) {
        this.deleteLabelsForDevices(deviceName, lastIntentConfigFromTopo['label']);
        if ( iHubDeviceName ) {
            this.deleteLabelsForDevices(iHubDeviceName, lastIntentConfigFromTopo['label']);
        }
    } else if ( Object.keys(currentLabels).length < Object.keys(oldLabels).length) {
        var deleteLabels = [];
        var labelObject = {};
        for (var valueLabel in oldLabels) {
            if (Object.keys(currentLabels).indexOf(valueLabel) == -1) {
                labelObject[valueLabel] = oldLabels[valueLabel];
                deleteLabels.push(labelObject);
            }
        }
        this.deleteLabelsForDevices(deviceName, deleteLabels[0]);
    } else if (baseArgs['label'] && deviceName && networkState == "delete") {
        this.deleteLabelsForDevices(deviceName, baseArgs['label']);
    }
}

/**
 * This method will execute and return the intentConfigArgs 
 * @param intentConfigArgs
 * @param input
 */
AltiplanoUtilities.prototype.getIntentConfigArgs = function (intentConfigArgs, input, extraContainers) {
    var getKeyForList = function (listName) {
        switch (listName) {
            case "label":
                return ["category", "value"];
            case "boards":
                return ["slot-name"];
            case "eonu-release":
                return "yang:leaf-list";
            case "duid":
                return "yang:leaf-list";
            case "onu-vendor-specific-software":
                return ["software-type"];                
            default:
                return null;
        }
    };
    if (extraContainers){
        this.convertIntentConfigXmlToJson(input.getIntentConfiguration(), getKeyForList, intentConfigArgs, null, extraContainers);
    } else {
        this.convertIntentConfigXmlToJson(input.getIntentConfiguration(), getKeyForList, intentConfigArgs);
    }
}

AltiplanoUtilities.prototype.getCardConfigRequiredFromPortType = function (portType, portSpeedConfigurable) {
    if (portType && (portType == "veip" || portType == "onu-v-vrefpoint" || portSpeedConfigurable == "true")) { 
        return true;
    }
    return false;
}

/**
 * This function returns the list of profiles defined under Link Aggregation Group Profile
 * @param deviceName
 * @returns {*[]}
 */
AltiplanoUtilities.prototype.getLinkAggregationGroupProfiles = function (deviceName) {
    var linkAggregationGroupProfileList = [];
    var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
    var uplinkIntentVersion = apUtils.getIntentVersion(intentConstants.INTENT_TYPE_UPLINK_CONNECTION, deviceName);
    var linkAggregationGroupProfileEntitySet = [];
    if (nodeType.startsWith(intentConstants.LS_FX_PREFIX)) {
        linkAggregationGroupProfileEntitySet = apUtils.getAssociatedProfilesWithConfig(intentConstants.INTENT_TYPE_UPLINK_CONNECTION, uplinkIntentVersion, profileConstants.LINK_AGGREGATION_GROUP_PROFILE.profileType,
            profileConstants.LINK_AGGREGATION_GROUP_PROFILE_LS_FX.subType, null, null, null, null);
    } else if (nodeType.startsWith(intentConstants.LS_DF_PREFIX)) {
        linkAggregationGroupProfileEntitySet = apUtils.getAssociatedProfilesWithConfig(intentConstants.INTENT_TYPE_UPLINK_CONNECTION, uplinkIntentVersion, profileConstants.LINK_AGGREGATION_GROUP_PROFILE.profileType,
            profileConstants.LINK_AGGREGATION_GROUP_PROFILE_LS_DF.subType, null, null, null, null);
    }
    linkAggregationGroupProfileEntitySet.forEach(function (linkAggregationGroupProfileEntity) {
        var linkAggregationGroupProfile = {}
        linkAggregationGroupProfile = JSON.parse(linkAggregationGroupProfileEntity.getProfileConfigJSON())[profileConstants.LINK_AGGREGATION_GROUP_PROFILE.profileType + ":" + profileConstants.LINK_AGGREGATION_GROUP_PROFILE.profileType];
        linkAggregationGroupProfile["name"] = linkAggregationGroupProfileEntity.getName();
        linkAggregationGroupProfileList.push(linkAggregationGroupProfile);
    });
    return linkAggregationGroupProfileList;
}

/**
 * Parse set of profiles to JSON format
 * @param {*} profileSet 
 * @param {*} profileType 
 * @returns list of profiles in JSON format
 */
AltiplanoUtilities.prototype.parseProfiles = function (profileSet, profileType) {
    var profileList = [];
    profileSet.forEach(function (profileEntity) {
        var profile = {};
        profile = JSON.parse(profileEntity.getProfileConfigJSON())[profileType + ":" + profileType];
        var pwdTypes = apUtils.getSensitiveKeys(profileEntity.getProfileConfig(), profileType);
        apUtils.setRedundantSensitiveKey(pwdTypes);
        if (profile) {
            profile["name"] = profileEntity.getName();
            profile = JSON.parse(JSON.stringify(profile, apUtils.stringReplacer));
            profileList.push(profile);
        }
    });
    return profileList;
}


/**
 * Parse single profile to JSON format
 * @param {*} profileSet 
 * @param {*} profileType 
 * @returns profile in JSON format
 */
 AltiplanoUtilities.prototype.parseSingleProfile = function (profileSet, profileType) {
    var profile;
    profileSet.forEach(function (profileEntity) {
        profile = JSON.parse(profileEntity.getProfileConfigJSON())[profileType + ":" + profileType];
        var pwdTypes = apUtils.getSensitiveKeys(profileEntity.getProfileConfig(), profileType);
        apUtils.setRedundantSensitiveKey(pwdTypes);
        profile["name"] = profileEntity.getName();
        profile = JSON.parse(JSON.stringify(profile, apUtils.stringReplacer));
    });
    return profile;
}

/**
 * Retrieve the used profile of specified intent and parse it to JSON format.
 * @param {*} intenttype 
 * @param {*} target 
 * @returns used profiles in JSON format
 */
AltiplanoUtilities.prototype.getUsedProfilesOfIntentInJsonFormat= function(intenttype, target){
    var profileMap = {};
    let profileSet;
    let scopeKey = "profiles_getMyProfiles_" + intenttype + "#" + target;
    if (apUtils.getContentFromIntentScope(scopeKey)) {
        profileSet = apUtils.getContentFromIntentScope(scopeKey);
    } else {
        profileSet = profileQueryService.getMyProfiles(intenttype, target);
        if (scopeKey && profileSet) {
            apUtils.storeContentInIntentScope(scopeKey, profileSet);
        }
    }
    if (profileSet) {
        profileSet.forEach(function (profileEntity) {
            var profile;
            var profileType = profileEntity.getProfileType();
            profile = JSON.parse(profileEntity.getProfileConfigJSON())[profileType + ":" + profileType];
            var pwdTypes = apUtils.getSensitiveKeys(profileEntity.getProfileConfig(), profileType);
            apUtils.setRedundantSensitiveKey(pwdTypes);
            if (profile["name"]) {
                profile["nameAttribute"] = profile["name"];
            }
            profile["name"] = profileEntity.getName();
            profile["baseRelease"] = profileEntity.getBaseRelease();
            profile["profileVersion"] = profileEntity.getVersion();
            profile = JSON.parse(JSON.stringify(profile, apUtils.stringReplacer));
            if(profileMap[profileType]){
                profileMap[profileType].push(profile)
            } else {
                var profileList = [];
                profileList.push(profile);
                profileMap[profileType] = profileList;
            }
        });
    }
    return profileMap;
}

/**
 * The profile data retrieved from used profile list of each intent instance will be parsed and restructureed to align with the json input format to ftl
 * @param intentType - intent type eg: device config dpu
 * @param target - target of intent instance
 * @param excludeSubTypeList - while restructuring, these subtypes are additionaly added in profile mgr, and the json inside it may need to be pulled out a level
 * @param isGetSpecificProfileStructure - return profile list with getSpecificProfilesInJsonFormat structure if true, else return with getParsedProfileDetailsFromProfMgr structure 
 * @return list - list of restructured profiles to input to ftl and merge to baseargs
 */
AltiplanoUtilities.prototype.getUsedProfileDetailsFromProfMgr = function (intentType, target, excludeSubTypeList, isGetSpecificProfileStructure) {
    var profileMap={};
    var profileSet = profileQueryService.getMyProfiles(intentType, target);
    if(profileSet) {
        if (isGetSpecificProfileStructure) {
            profileMap = this.parseProfilesToMap(profileSet);
            if (excludeSubTypeList.length > 0) {
                var restructuredProfileData = {};
                if (Object.keys(profileMap).length > 0){
                    Object.keys(profileMap).forEach(function (profileType) {
                        let subTypeList = Object.keys(profileMap[profileType])
                        if (subTypeList.length > 0) {
                            subTypeList.forEach((subType) => {
                                if (excludeSubTypeList.indexOf(subType) > -1) {
                                    restructuredProfileData[profileType] = profileMap[profileType][subType];
                                }
                            })
                        }
                    });
                }
                profileMap = this.ifObjectIsEmpty(restructuredProfileData) ? profileMap : restructuredProfileData;
            }
        } else {
            profileSet.forEach(function (profileentity) {
                var profType = profileentity.getProfileType();
                var subType = profileentity.getSubtype();
                var profAttr = JSON.parse(profileentity.getProfileConfigJSON());
                var profkey = profType + ":" + profType;
                var profDetail = profAttr[profkey];
                if (profDetail["name"]) {
                    profDetail["nameAttribute"] = profDetail["name"];
                }
                profDetail["name"] = profileentity.getName();
                if (profileentity.getBaseRelease()) {
                    profDetail["baseRelease"] = profileentity.getBaseRelease();
                }
                if (profileentity.getVersion()) {
                    profDetail["profileVersion"] = profileentity.getVersion();
                }
                
                //From profile manager subtype comes as lightspan/LS-SX-DX-MX etc which need not be fed to ftl, so strip them out
                if (excludeSubTypeList.indexOf(subType) > -1) {
                    if (!profileMap[profType]) {
                        profileMap[profType] = [];
                    }
                    profileMap[profType].push(profDetail);
                } else {
                    if(!profileMap[subType]){
                        profileMap[subType]={};
                        profileMap[subType][profType] = [];
                    }
                    else if(!profileMap[subType][profType]){
                        profileMap[subType][profType] = [];
                    }
                    profileMap[subType][profType].push(profDetail);
                }
            });
            profileMap = JSON.parse(JSON.stringify(profileMap, this.stringReplacer));
    
            //processing all profile data to the structure as in respective jsons
            var restructuredProfileData = {};
            if ( Object.keys(profileMap).length > 0){
                Object.keys(profileMap).forEach(function (level1key) {
                    if (excludeSubTypeList.indexOf(level1key) > -1) {
                        //case 1 - system, ipfix comes from profile mgr as profiletype:[objects], whereas in json we just need objects
                        if (Array.isArray(profileMap[level1key]) && profileMap[level1key].length > 0) {
                            profileMap[level1key].forEach(function (entireJsonData) {
                                apUtils.getMergedObject(restructuredProfileData, entireJsonData);
                            });
                        }
                    }
                    else {
                        restructuredProfileData[level1key] = profileMap[level1key];
                    }
                });
            }
            profileMap = restructuredProfileData;
        }
    }
    return profileMap;
}


/**
 * This method is created to fetch all valid software from AV
 * @param deviceManager
 * @return {*[]}
 */
AltiplanoUtilities.prototype.getAllSoftwareFilesFromAltiplano = function (deviceManager) {

    var requestTemplateArgs = {
        managerName: deviceManager
    };
    var resourceName = intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getAllSoftwareFilesFromServer.xml.ftl";


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
                }
                var softwareFile = fileServer + ":" + subDirectory + "/" + fileName;
                if (suggestedSoftwareFilesOnServer.indexOf(softwareFile) === -1) {
                    suggestedSoftwareFilesOnServer.push(softwareFile);
                }
            }
        }
    }
    return suggestedSoftwareFilesOnServer;
};

/**
 * This method used to verify the given string is in expected and valid value
 * @param {String} swValue
 * @param {Array} swList
 * @returns {Boolean}
 */
AltiplanoUtilities.prototype.isValidSoftware = function (swValue, swList) {
    if (swValue.startsWith("http://file-on-device/")) {
        return true;
    }
    if (swList && (swList.length > 0) && (swList.indexOf(swValue) > -1)) {
        return true;
    }
    return false;
}

/**
 * this method is used to valid software values and check is it valid or not.
 * @param intentConfigArgs
 * @param contextualErrorJsonObj
 */
AltiplanoUtilities.prototype.validateTargetSoftwareValue = function (intentConfigArgs, contextualErrorJsonObj) {
    var boards = intentConfigArgs["boards"];
    var managerName = intentConfigArgs[intentConstants.DEVICE_MANAGER];
    var swList = apUtils.getAllSoftwareFilesFromAltiplano(managerName);

    

    if (intentConfigArgs["active-software"] && !apUtils.isValidSoftware(intentConfigArgs["active-software"], swList)) {
        contextualErrorJsonObj["active-software"] = "Invalid Software passed for active-software";
    }
    if (intentConfigArgs["passive-software"] && !apUtils.isValidSoftware(intentConfigArgs["passive-software"], swList)) {
        contextualErrorJsonObj["passive-software"] = "Invalid Software passed for passive-software";
    }
    if (intentConfigArgs["target-transformation-software"] && !apUtils.isValidSoftware(intentConfigArgs["target-transformation-software"], swList)) {
        contextualErrorJsonObj["target-transformation-software"] = "Invalid Software passed for target-transformation-software";
    }
    if (boards) {
        Object.keys(boards).forEach(function (boardName) {
            var board = boards[boardName];
            if (board["active-software"] && !apUtils.isValidSoftware(board["active-software"], swList)) {
                var keyMess = "list#boards," + board["slot-name"] + ",leaf#active-software";
                contextualErrorJsonObj[keyMess] = "Invalid Software passed for active-software";
            }
            if (board["passive-software"] && !apUtils.isValidSoftware(board["passive-software"], swList)) {
                var keyMess = "list#boards," + board["slot-name"] + ",leaf#passive-software";
                contextualErrorJsonObj[keyMess] = "Invalid Software passed for passive-software";
            }
        });
    }

    let activeSoftwareMapping = intentConfigArgs["onu-active-software-mapping"];
    let passiveSoftwareMapping = intentConfigArgs["onu-passive-software-mapping"];

    // Validate valid onu softwares provided for active softwares
    if(activeSoftwareMapping){
        Object.keys(activeSoftwareMapping).forEach(function (softwareId) {
            let softwareContent = activeSoftwareMapping[softwareId];
            if(softwareContent["onu-software"]){
                let onuSoftwares = softwareContent["onu-software"];
                Object.keys(onuSoftwares).forEach(function(onuSW){
                        let ontSW = onuSoftwares[onuSW];
                        if(ontSW["target-release"] && !apUtils.isValidSoftware(ontSW["target-release"], swList) ){
                            contextualErrorJsonObj["list#Onu-Active-Software-Release: " + softwareId + ", Software-Type: " + ontSW["software-type"] + ", leaf#Target-Release: "] = "Invalid Software passed for ont-software.";   
                        }
                });
            }
            
        });
    }
    // Validate valid onu softwares provided for passive softwares
    if(passiveSoftwareMapping){
        Object.keys(passiveSoftwareMapping).forEach(function (softwareId) {
            let softwareContent = passiveSoftwareMapping[softwareId];
            if(softwareContent["onu-software"]){
                let onuSoftwares = softwareContent["onu-software"];
                Object.keys(onuSoftwares).forEach(function (onuSW){
                        let ontSW = onuSoftwares[onuSW];
                        if(ontSW["target-release"] && !apUtils.isValidSoftware(ontSW["target-release"], swList) ){
                            contextualErrorJsonObj["list#Onu-Passive-Software-Release: " + softwareId + ", Software-Type: " + ontSW["software-type"] + ", leaf#Target-Release: "] = "Invalid Software passed for ont-software";   
                        }
                        
                });
            }
            
        });
    }

    // Validate if same ont software provided for active and passive slot for main and VSS softwares.
    //We check whether for the ONT  active and passive softwares has same index, same ont selection criteria, same software type and same target release
    //For e.g Following case error is thorwn
    //Index 1 - City - TN - Main software - Active software - ONTSoftwareX
    //Index 1 - City - TN - Main software - Passive software - ONTSoftwareX    
    if(activeSoftwareMapping){
        if(passiveSoftwareMapping){
            var activeSoftwareIds =  Object.keys(activeSoftwareMapping);
            var passiveSoftwareIds = Object.keys(passiveSoftwareMapping);
            for(let i of activeSoftwareIds){
                for(let j of passiveSoftwareIds){
                    if(i == j){
                        let activeSoftwareContent = activeSoftwareMapping[i];
                        let passiveSoftwareContent = passiveSoftwareMapping[j];
                        let activeLabel = null;
                        let passiveLabel = null;
                        if(activeSoftwareContent["label"]){
                            activeLabel = Object.keys(activeSoftwareContent["label"]).sort();
                        }if(passiveSoftwareContent["label"]){
                            passiveLabel = Object.keys(passiveSoftwareContent["label"]).sort();
                        }
                        if((activeSoftwareContent["onu-software"] && passiveSoftwareContent["onu-software"]) && ((JSON.stringify(activeLabel) === JSON.stringify(passiveLabel)) || (activeLabel == null && passiveLabel == null))){
                                let activeOnuSoftwares = activeSoftwareContent["onu-software"];
                                let passiveOnuSoftwares = passiveSoftwareContent["onu-software"];
                                let activeOnuKeys = Object.keys(activeOnuSoftwares);
                                let passiveOnuKeys = Object.keys(passiveOnuSoftwares);
                               for(let k of activeOnuKeys){
                                    for(let l of passiveOnuKeys){
                                        if(activeOnuSoftwares[k]["software-type"] == passiveOnuSoftwares[l]["software-type"]){
                                             if(activeOnuSoftwares[k]["target-release"] == passiveOnuSoftwares[l]["target-release"]){                                            
                                                contextualErrorJsonObj["list#Onu-Software-Release: " + i + ", Software-Type: " + activeOnuSoftwares[k]["software-type"] + ", leaf#Target-Release: "] = "ONT target active software release should not be same as ONT target passive software's.";                                              
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



/**
 * this method is used to check valid ont software values and check is it valid or not.
 * @param intentConfigJson
 * @param contextualErrorJsonObj
 */
AltiplanoUtilities.prototype.validateTargetOntSoftwareValue = function (intentConfigJson, managerName) {
    logger.debug("validateTargetOntSoftwareValue managerName {}", JSON.stringify(managerName));
    
    var swList = apUtils.getAllSoftwareFilesFromAltiplano(managerName);    
    
    if(intentConfigJson["active-software"] && !apUtils.isValidSoftware(intentConfigJson["active-software"], swList)){
        throw new RuntimeException("Invalid Software: " +intentConfigJson["active-software"] +" passed for active-software");
    }
    if (intentConfigJson["passive-software"] && !apUtils.isValidSoftware(intentConfigJson["passive-software"], swList)) {
        throw new RuntimeException("Invalid Software: " +intentConfigJson["passive-software"] +" passed for passive-software");
    }  


    if (intentConfigJson['onu-vendor-specific-software']) {
        var inputVendorSw = intentConfigJson['onu-vendor-specific-software'];
        for (let input in inputVendorSw) {
            if (inputVendorSw[input]["active-software"] && !apUtils.isValidSoftware(inputVendorSw[input]["active-software"], swList)) {
                throw new RuntimeException("Ont-vendor-specific-software: "+inputVendorSw[input]["software-type"] +". Invalid Target Active Software: "+inputVendorSw[input]["active-software"]+ " passed for onu vendor specific software");
            }

            if (inputVendorSw[input]["passive-software"] && !apUtils.isValidSoftware(inputVendorSw[input]["passive-software"], swList)){
                throw new RuntimeException("Ont-vendor-specific-software: "+inputVendorSw[input]["software-type"] +". Invalid Target Passive Software: "+inputVendorSw[input]["passive-software"]+ " passed for onu vendor specific software");
            
            }
        }
    }
}
    
    

/**
 * This method parses the profiles in all formats to that reiteration can be avoided
 * @param {*} profileSet set of ProfileVO
 * @returns profiles in JSON format
 * 
 * parsed JSON format :
 * {
 *  <profile-type>:
 *  {
 *      <sub-type>: [<profiledetails>]
 *  } 
 * }
 * 
 */
 AltiplanoUtilities.prototype.parseProfilesToMapToAllFormats = function (profileSet) {
    var profileMap = {};
    if (profileSet) {
        profileSet.forEach(function (profileEntity) {
            var profile;
            var profileType = profileEntity.getProfileType();
            profile = JSON.parse(profileEntity.getProfileConfigJSON())[profileType + ":" + profileType];
            profile["name"] = profileEntity.getName();
            profile["baseRelease"] = profileEntity.getBaseRelease();
            profile["profileVersion"] = profileEntity.getVersion();
            profile = JSON.parse(JSON.stringify(profile, apUtils.stringReplacer));
            var pwdTypes = apUtils.getSensitiveKeys(profileEntity.getProfileConfig(), profileType);
            apUtils.setRedundantSensitiveKey(pwdTypes);
            if (profileMap[profileType] && profileMap[profileType][profileEntity.getSubtype()]) {
                profileMap[profileType][profileEntity.getSubtype()].push(profile)
                profileMap[intentConstants.PROFILE_NAMES][profileType][profileEntity.getSubtype()].push(profile["name"]);
                profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType][profileEntity.getSubtype()][profile["name"]] = profile;
                
            } else {
                var profileList = [];
                var profileNames = [];
                profileList.push(profile);
                profileNames.push(profile["name"]);
                if(!profileMap[profileType]) {
                    profileMap[profileType] = {};                        
                }
                if(!profileMap[intentConstants.PROFILE_NAMES]) {
                    profileMap[intentConstants.PROFILE_NAMES] = {};
                }
                if(!profileMap[intentConstants.PROFILE_NAMES][profileType]) {
                    profileMap[intentConstants.PROFILE_NAMES][profileType]={};                        
                }
                if(!profileMap[intentConstants.SINGLE_PROFILE_CONFIG]) {
                    profileMap[intentConstants.SINGLE_PROFILE_CONFIG] = {};
                }
                if(!profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType]) {
                    profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType]={};                        
                }
                if(!profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType][profileEntity.getSubtype()]) {
                    profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType][profileEntity.getSubtype()]={};                        
                }
                profileMap[profileType][profileEntity.getSubtype()] = profileList;
                profileMap[intentConstants.PROFILE_NAMES][profileType][profileEntity.getSubtype()] = profileNames;
                profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType][profileEntity.getSubtype()][profile["name"]] = profile;

            }
        });
    }
    return profileMap;
}

/**
 * This method parses the profiles to JSON format
 * @param {*} profileSet set of ProfileVO
 * @returns profiles in JSON format
 * 
 * parsed JSON format :
 * {
 *  <profile-type>:
 *  {
 *      <sub-type>: [<profiledetails>]
 *  } 
 * }
 * 
 */
AltiplanoUtilities.prototype.parseProfilesToMap = function (profileSet, intentType, targetName, storeInIntentScope) {
    var profileMap = {};
    if (profileSet) {
        profileSet.forEach(function (profileEntity) {
            var profile;
            var profileType = profileEntity.getProfileType();
            profile = JSON.parse(profileEntity.getProfileConfigJSON())[profileType + ":" + profileType];
            profile["name"] = profileEntity.getName();
            profile["baseRelease"] = profileEntity.getBaseRelease();
            profile["profileVersion"] = profileEntity.getVersion();
            profile = JSON.parse(JSON.stringify(profile, apUtils.stringReplacer));
            var pwdTypes = apUtils.getSensitiveKeys(profileEntity.getProfileConfig(), profileType);
            apUtils.setRedundantSensitiveKey(pwdTypes);
            if (profileMap[profileType] && profileMap[profileType][profileEntity.getSubtype()]) {
                profileMap[profileType][profileEntity.getSubtype()].push(profile);
            } else {
                var profileList = [];
                profileList.push(profile);
                if(!profileMap[profileType]) {
                    profileMap[profileType] = {};
                }
                profileMap[profileType][profileEntity.getSubtype()] = profileList;
            }
        });
        if (storeInIntentScope && intentType && targetName) {
            let scopeKey = "profiles_subSetOfUsedProfiles_" + intentType + "#" + targetName;
            var profilesFromIntentScope = this.getContentFromIntentScope(scopeKey);
            if (profilesFromIntentScope) {
                Object.keys(profileMap).forEach(function (profileType) {
                    profilesFromIntentScope[profileType] = profileMap[profileType];
                });
                this.storeContentInIntentScope(scopeKey, profilesFromIntentScope);
            } else {
                this.storeContentInIntentScope(scopeKey, profileMap);
            }
        }
    }
    return profileMap;
}

/**
 * This method retrieves the specific profiles in JSON format
 * 
 * @param  intentType 
 * @param  intentTypeVersion 
 * @param  deviceRelease 
 * @param  hardwareType 
 * @param  intentProfileInputVos 
 * @returns returns specific profiles in JSON format
 */
 AltiplanoUtilities.prototype.getSpecificProfilesInJsonFormat = function(intentType, intentTypeVersion, deviceRelease, hardwareType, intentProfileInputVos) {
    var specificProfilesSet = profileQueryService.getSpecificProfiles(intentType, intentTypeVersion, deviceRelease,hardwareType, intentProfileInputVos);
    return this.parseProfilesToMap (specificProfilesSet);

 }

 /**
 * This method retrieves the specific profiles in all format to that reiteration can be avoided
 * 
 * @param  intentType 
 * @param  intentTypeVersion 
 * @param  deviceRelease 
 * @param  hardwareType 
 * @param  intentProfileInputVos 
 * @returns returns specific profiles in JSON format
 */
  AltiplanoUtilities.prototype.getSpecificProfilesInAllFormat = function(intentType, intentTypeVersion, deviceRelease, hardwareType, intentProfileInputVos, fromDeviceLevel) {
    var specificProfilesSet = profileQueryService.getSpecificProfiles(intentType, intentTypeVersion, deviceRelease,hardwareType, intentProfileInputVos);
    if (fromDeviceLevel) {
        return this.parseProfilesToMapToAllFormatsFromDeviceLevel(specificProfilesSet);
    }
    return this.parseProfilesToMapToAllFormats (specificProfilesSet);
 }

 /**
  * This method retrieves the used profiles in JSON format
  * 
  * @param  intentType 
  * @param  target 
  * @param  intentProfileInputVos
  * @param  storeInIntentScope
  * @returns returns used profiles in JSON format
  */
 AltiplanoUtilities.prototype.getSubSetOfUsedProfilesInJsonFormat = function(intentType, target, intentProfileInputVos, storeInIntentScope) {
     let usedProfilesJson = {};
     let profilesToBeRetrieved = new ArrayList();
     let scopeKey = "profiles_subSetOfUsedProfiles_" + intentType + "#" + target;
     let profilesFromIntentScope = this.getContentFromIntentScope(scopeKey);
     if (profilesFromIntentScope) {
         if (intentProfileInputVos.length > 0) {
             for (let index = 0; index < intentProfileInputVos.length; index++) {
                 var profileVo = intentProfileInputVos[index];
                 if (profileVo && profileVo.getProfileType() && profileVo.getSubtype()) {
                     let profileType = profileVo.getProfileType();
                     let subType = profileVo.getSubtype();
                     if (profilesFromIntentScope[profileType] && profilesFromIntentScope[profileType][subType]) {
                         if (!usedProfilesJson[profileType]) {
                             usedProfilesJson[profileType] = {};
                         }
                         usedProfilesJson[profileType][subType] = profilesFromIntentScope[profileType][subType];
                     }
                 } else {
                     profilesToBeRetrieved.add(intentProfileInputVos[index]);
                 }
             }
         } else {
             usedProfilesJson = profilesFromIntentScope;
         }
     } else {
         profilesToBeRetrieved = intentProfileInputVos;
     }
     if (!profilesFromIntentScope || (profilesFromIntentScope && profilesToBeRetrieved && profilesToBeRetrieved.length > 0)) {
         let usedProfilesSet = profileQueryService.getSubsetOfMyProfilesInBulk(intentType, target, profilesToBeRetrieved);
         let parsedProfiles = this.parseProfilesToMap(usedProfilesSet, intentType, target, storeInIntentScope);
         if (usedProfilesJson && Object.keys(usedProfilesJson).length > 0 && parsedProfiles && Object.keys(parsedProfiles).length > 0) {
             Object.keys(parsedProfiles).forEach(function (profileType) {
                 usedProfilesJson[profileType] = parsedProfiles[profileType];
             });
         } else if (parsedProfiles && Object.keys(parsedProfiles).length > 0) {
             usedProfilesJson = parsedProfiles;
         }
     }
     return usedProfilesJson;
 }

 /**
  * This method retrieves the used profiles in in all format to that reiteration can be avoided
  * 
  * @param  intentType 
  * @param  target 
  * @param  intentProfileInputVos 
  * @returns returns used profiles in JSON format
  */
  AltiplanoUtilities.prototype.getSubSetOfUsedProfilesInAllFormat = function(intentType, target, intentProfileInputVos) {
    var usedProfilesSet = profileQueryService.getSubsetOfMyProfilesInBulk(intentType, target, intentProfileInputVos);
    return this.parseProfilesToMapToAllFormats(usedProfilesSet);
 }
 /**
  * This function retreives the default lag and port that is configured from device
  * and stores them in extra info to maintain the already configured lag and uplink port
  * from defaults.xml
  */
 AltiplanoUtilities.prototype.validatePortWithDefaultLag = function(deviceId,uplinkPort,uplinkLagInfo, defaultLagDetails){
    logger.debug("uplinkPort:: {}", JSON.stringify(uplinkPort));
    logger.debug("defaultLagDetails:: {}", JSON.stringify(defaultLagDetails));
    logger.debug("uplinkLagInfo::{}", JSON.stringify(uplinkLagInfo));
    if(defaultLagDetails){
        if(defaultLagDetails.port && defaultLagDetails.port[uplinkPort.uplinkPortName]){
            if(!uplinkPort["agg-system-name"] || uplinkPort["agg-system-name"] != defaultLagDetails["lagIndex"]){
                throw new RuntimeException("Uplink port "+uplinkPort["port-id"]+" lag must be matching with default lag LAG-"+defaultLagDetails["lagIndex"]);
            }
        }
    }
}
/**
 * Checking the sub nested object exist or not
 *  object{
 *      "nestedObjectName" : {
 *          "subNestedObjectName": {
 *              
 *          }
 *      }
 *  }
 * it will return true ifSubNestedObjectExists(object, "nestedObjectName", "subNestedObjectName")
 * @param {*} object 
 * @param {*} nestedObjectName 
 * @param {*} subNestedObjectName 
 * @returns 
 */
AltiplanoUtilities.prototype.ifSubNestedObjectExists = function(object, nestedObjectName, subNestedObjectName ) {
    if (object && nestedObjectName && subNestedObjectName && object[nestedObjectName] && object[nestedObjectName][subNestedObjectName]) {
        return true
    }
    return false
}


 /**
     * Function corrects the classifiers prefix from module name to prefix name
     * Ex : Classifier module name is bbf-qos-classifiers and prefix for that is bbf-qos-cls
     * @param classifierJsonObject
     * @returns {any}
     */
  AltiplanoUtilities.prototype.updateLtClassifierPrefixes =  function(classifierJsonObject) {
        var classifiersString = JSON.stringify(classifierJsonObject);
        if (classifiersString) {
            var classifiersReplaceString = classifiersString.replaceAll("bbf-qos-classifiers:", "bbf-qos-cls:");
            classifiersReplaceString = classifiersReplaceString.replaceAll("bbf-qos-rate-control:", "bbf-qos-rc:");
            return JSON.parse(classifiersReplaceString);
        }
    }

/**
 * Function used for retreiving the default Lag and Uplink ports from xtraInfo and updated in requestContext
 * If xtraInfo is empty, then the lag details are fetched and updated in xtraInfo
 *
 * This function is implemented in order to retreive the default Lag and associated uplink ports
 * created during device-sf intent creation
 *
 * @param deviceId
 * @returns {lagDetails}
 */
 AltiplanoUtilities.prototype.getDefaultLagAndUplinkPorts = function(deviceId){     
    var requestContext = requestScope.get();
    var lagDetails = requestContext.get("defaultLagDetails");    
    if (!lagDetails) {
        var currentTopology = requestContext.get("currentTopology");
        var extraInfo = apUtils.getTopologyExtraInfo(currentTopology);
        if (extraInfo && extraInfo["defaultLagDetails"]) {
            lagDetails = JSON.parse(extraInfo["defaultLagDetails"]);
        } else {
            var extractedNode = this.getExtractedDeviceSpecificDataNode(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR + "getLagAndPortConfigured.xml.ftl", {"deviceID": deviceId});            
            if (extractedNode) {
                lagDetails = {};
                var getLagXpath = function (label, lagIndex) {
                    if(lagIndex){
                        return "conf:configure/conf:lag[conf:lag-index=\'" + lagIndex +"\']/" + label;           
                    }else{
                        return "conf:configure/conf:lag/" + label; 
                    }
                };
                
                lagDetails.lacp = {};
                lagDetails.port = {};
                lagDetails.lagIndex = apUtils.getNodeValue(extractedNode, getLagXpath("conf:lag-index"), apUtils.prefixToNsMap);
                lagDetails["lacp"]["administrative - key"] = apUtils.getNodeValue(extractedNode, getLagXpath("conf:lacp/conf:administrative-key"), apUtils.prefixToNsMap);
                lagDetails["lacp"]["mode"] = apUtils.getNodeValue(extractedNode, getLagXpath("conf:lacp/conf:mode", lagDetails.lagIndex), apUtils.prefixToNsMap);
                lagDetails["portMode"] = apUtils.getNodeValue(extractedNode, getLagXpath("conf:mode"), apUtils.prefixToNsMap);

                var associatedPorts = apUtils.getAttributeValues(extractedNode, getLagXpath("conf:port/conf:port-id", lagDetails.lagIndex), apUtils.prefixToNsMap);
                if (associatedPorts) {
                    var associatedPortsString = "";
                    for (var index = 0; index < associatedPorts.length; index++) {
                        lagDetails.port[associatedPorts[index]] = {"port-id": associatedPorts[index]};
                        associatedPortsString = associatedPortsString.concat(",").concat(associatedPorts[index]).concat(",");
                    }
                    lagDetails.associatedPorts = associatedPortsString;
                }
            }
        }
        requestContext.put("defaultLagDetails", lagDetails);
    }
    return lagDetails;
}
AltiplanoUtilities.prototype.getDefaultPortPbitRemarkValue = function(deviceId) {
    var lagDetails = this.getDefaultLagAndUplinkPorts(deviceId);
    var extractedNode = this.getExtractedDeviceSpecificDataNode(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR + "getLagAndPortConfigured.xml.ftl", {"deviceID": deviceId});
    if (lagDetails.port){
        for( let portIndex in lagDetails.port){
            var pBitRemark = apUtils.getNodeValue(extractedNode,  "conf:configure/conf:port[conf:port-id=\'" + portIndex +"\']/conf:ethernet/conf:remark", apUtils.prefixToNsMap);
            if(pBitRemark !== undefined && pBitRemark !== "")
                return pBitRemark;
        }
    }
}

/**
 * Function used for executing the Hardware Reset ONT To Default Configuration action
 *
 * @param actionData
 * @param lsOntActionUtil
 * @param throwError
 * @returns action status
 */
AltiplanoUtilities.prototype.executeResetOntToDefaultConf = function(actionData, lsOntActionUtil, throwError) {
    var deviceTypeAndRelease = actionData.deviceTypeAndRelease;
    if (deviceTypeAndRelease && deviceTypeAndRelease.hwType && deviceTypeAndRelease.release) {
        if (deviceTypeAndRelease.hwType.startsWith(intentConstants.LS_FX_PREFIX) || deviceTypeAndRelease.hwType.startsWith(intentConstants.FAMILY_TYPE_LS_MF) || deviceTypeAndRelease.hwType.startsWith(intentConstants.FAMILY_TYPE_LS_SF)) {
            var isHardwareResetToDefaultConfigurationSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_HARDWARE_RESET_TO_DEFAULT_CONFIGURATION_SUPPORTED, deviceTypeAndRelease.hwType.substring(6), false);
        } else if (actionData.model == intentConstants.ONU_MODEL_VONU) {
            var isHardwareResetToDefaultConfigurationSupported = apCapUtils.getCapabilityValue(intentConstants.VONU_FAMILY_TYPE, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_HARDWARE_RESET_TO_DEFAULT_CONFIGURATION_SUPPORTED, "ONU", false);
        } else {
            var isHardwareResetToDefaultConfigurationSupported = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.BOARD_CATEGORY, capabilityConstants.IS_HARDWARE_RESET_TO_DEFAULT_CONFIGURATION_SUPPORTED, intentConstants.LT_STRING, false);
        }
    }

    if (isHardwareResetToDefaultConfigurationSupported) {
        if (actionData.model == intentConstants.ONU_MODEL_VONU) { //Case vONU
            var args = {
                deviceID: actionData.ontName
            }
            return lsOntActionUtil.resetVontToDefaultConf(args);
        } else { //Case eONU
            try {
                var args = {
                    deviceID: actionData.deviceName,
                    ontName: actionData.ontName
                }
                return lsOntActionUtil.resetEontToDefaultConf(args);
            } catch (exception) {
                logger.error("Failed to execute Hardware Reset ONT To Default Configuration: {}", e);
            }
        }
    } else if (throwError) {
        throw new RuntimeException("Hardware Reset ONT To Default Configuration is not supported!");
    }
}

AltiplanoUtilities.prototype.createProfileVOFromProfileEntity = function(profileEntity, profileDependency){
    return intentProfileFactory.createIntentProfileVO(profileEntity.getName(), profileEntity.getProfileType(), profileEntity.getSubtype(),
        profileEntity.getBaseRelease(), profileEntity.getVersion(), profileDependency);

 }

 /**
  * Get the board number of lt device based on the name
  * @param {*} ltDeviceName 
  * @returns 
  */
AltiplanoUtilities.prototype.getLtBoardNumber = function (ltDeviceName) {
    if (ltDeviceName) {
        var lastIndex = ltDeviceName.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
        if (lastIndex > -1) {
            var ltDeviceNameDetails = ltDeviceName.substring(lastIndex + 1);
            var ltPattern = new RegExp(intentConstants.LT_REG_EXP);
            var isLtBoard = ltPattern.test(ltDeviceNameDetails);
            if (isLtBoard && ltDeviceName.substring(lastIndex) && ltDeviceName.substring(lastIndex).split(intentConstants.LT_STRING).length > 1) {
                return ltDeviceName.substring(lastIndex).split(intentConstants.LT_STRING)[1];
            }
        }
    }
}


 /**
  * This function is used to check if device is LT device or not.
  * Ex: LS-MF.LT1 is true
  *     LS-MF is false
  * @param {*} deviceName 
  * @returns 
  */
 AltiplanoUtilities.prototype.isLtDevice = function (deviceName) {
    if (deviceName) {
        var lastIndex = deviceName.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
        if (lastIndex > -1) {
            var deviceNameDetails = deviceName.substring(lastIndex + 1);
            var ltPattern = new RegExp(intentConstants.LT_REG_EXP);
            var isLtBoard = ltPattern.test(deviceNameDetails);
            if (isLtBoard) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Method to suggest profile-name of Speed Profile or User Service Profile for Composite Intent
 *Eg:
 * Input - str =
 * Output -
 * @param subType -- exam: ISAM
 * @param hwTypeRelease -- exam: FX-I-6.6
 * @param profileType -exam "speed-profile" or "user-service-profile
 * @param compositeIntentType -exam "composite-ont-and-l2-user-intent"
 * @param compositeIntentTypeVersion  -exam: "1"
 * @returns profile-name of profile-type array
 */ 
 AltiplanoUtilities.prototype.getProfileNamesByProfileTypeAndHardware = function (subType,hwTypeRelease, profileType, compositeIntentType, compositeIntentTypeVersion) {
    var l2UserIntentTypeVersion;
    var serviceProfiles = {};
    var serviceProfileNames = [];
    var intentTypeDefinition = ibnService.findIntentTypeByName(compositeIntentType, compositeIntentTypeVersion);
    var compositeChildIntents = intentTypeDefinition.getCompositeDefinition().getCompositeChildIntents();
    compositeChildIntents.forEach(compositeChildIntent => {
        if (compositeChildIntent.getIntentType() == intentConstants.INTENT_TYPE_L2_USER) {
            l2UserIntentTypeVersion = compositeChildIntent.getIntentTypeVersion();
        }
    });
    if (l2UserIntentTypeVersion) {
        if (!subType) {
            serviceProfiles = profileQueryService.getAssociatedProfiles(intentConstants.INTENT_TYPE_L2_USER, l2UserIntentTypeVersion, profileType, null, null, null, null, null, null);
            serviceProfiles.forEach(function (serviceProfile) {
                serviceProfileNames.push(serviceProfile.getName());
            });
            return serviceProfileNames;
        } else {
            return apUtils.getAssociatedProfileNames(intentConstants.INTENT_TYPE_L2_USER, l2UserIntentTypeVersion, null, hwTypeRelease, profileType, subType, null, null);
        }
    }
    return serviceProfileNames;
};

/**
 * This method used to check whether specified node type supports IHUB.
 *
 * @param nodeType
 *
 * @returns boolean
 */
AltiplanoUtilities.prototype.isIhubSupportedFamilyType = function (nodeType) {
    if (nodeType && nodeType.startsWith(intentConstants.LS_FX_PREFIX) || nodeType.startsWith(intentConstants.LS_MF_PREFIX) || nodeType.startsWith(intentConstants.LS_SF_PREFIX) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_IHUB_CFXR_F) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_DF_CFXR_F)) {
        return true;
    }
    return false;
}

/**
 * This method used to get a friendly error message from the error which is used to thrown exception.
 *
 * @param error
 *
 * @returns string
 */
 AltiplanoUtilities.prototype.getErrorMessageFromErrorArgs = function (error) {
    if(error && error.getMessage()){
        var errorMessage = JSON.parse(error.getMessage());
        return JSON.stringify(errorMessage['errorArgs']);
    }
    return error;
}


/**
 * This method used to compare 2 objects (example: current intentConfigArgs with last intentConfig)
 * @param object1
 * @param object2
 * @returns true/false
 */
AltiplanoUtilities.prototype.compareTwoObjects = function(object1, object2){
    var keys1 = Object.keys(object1);
    var keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length){
        return false;
    }
    for(var index in keys1) {
        var key = keys1[index];
        var value1 = object1[key];
        var value2 = object2[key];
        var areObjects = this.isObject(value1) && this.isObject(value2);
        if(areObjects && !this.compareTwoObjects(value1, value2) || !areObjects && value1 !== value2){
            return false;
        }
    }
    return true;
}

/**
 * This method used to compare 2 objects (example: current intentConfigArgs with last intentConfig)
 * @param object1
 * @param object2
 * @param sensitiveKeys ["cli-password", "tl1-password"]
 * @param encryptedData {"cli-password":"$-0$NxF06Mq6wI9BKB8f8U5D2L+cyaqk29dfesx2uNmc7OM=", "tl1-password": "$-0$NxF06Mq6wI9BKB8f8U5D2L+cyaqk29dfesx2uNmc7OM="}
 * @returns true/false
 */
AltiplanoUtilities.prototype.compareTwoObjectsWithEncryptedData = function(object1, object2, sensitiveKeys, encryptedData){
    var keys1 = Object.keys(object1);
    var keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length){
        return false;
    }
    for(var index in keys1) {
        var key = keys1[index];
        var value1 = object1[key];
        var value2 = object2[key];
        if(sensitiveKeys && sensitiveKeys.indexOf(key) != -1){
            if(encryptedData && encryptedData[key]){
                value1 = encryptedData[key];
            }
            value2 = object2["encrypted-" + key];
        }
        var areObjects = this.isObject(value1) && this.isObject(value2);
        if(areObjects && !this.compareTwoObjectsWithEncryptedData(value1, value2, sensitiveKeys, encryptedData) || !areObjects && value1 !== value2){
          return false;
        }
    }
    return true;
}


/**
 * Convert an array property of object to map format
 * Ex: {protocol: [1]} => {protocol : {1 : {"name": 1}}}
 * @param {*} object contain the attribute to be converted
 * @param {*} attribute name of attribute in object that is an array
 * @param {*} key the key of object after being converted
 * @returns 
 */
AltiplanoUtilities.prototype.convertArrayPropToMap = function(object,attribute, key) {
    var array = object[attribute];
    var map = {};
    if (array && typeof array.push === "function" && array.length > 0) {
        array.forEach(function(item){
            var obj = {};
            obj[key] = item;
            map[item] = obj;
        })
        object[attribute] = map;
    }
    return map;
}
/**
 * It will do some changes on the classifiers so that the trackArgs can work with old values
 * Convert array properties to map: protocol, pbit-value
 * Delete some properties if it's null or empty, this will help on finding the removed objects: ip-common
 * Convert a string value to an object with value properties: {destination-ipv4-network: "0.0.0.0/24"} -> {destination-ipv4-network: { "value" : "0.0.0.0/24"}} 
 * @param {*} classifiers
 */
AltiplanoUtilities.prototype.processClassifiers = function (classifiers) {
    var that =this;
    if (classifiers && classifiers.length > 0 ) {
        for (var i =0 ; i < classifiers.length; i ++) {
            var classifier = classifiers[i];
            this.convertArrayPropToMap(classifier, "protocol", "name")
            if (classifier && classifier["pbit-marking-list"] && classifier["pbit-marking-list"].length > 0) {
                classifier["pbit-marking-list"].forEach(function(pbits){
                    that.convertArrayPropToMap(pbits, "pbit-value","name");
                })
            }
            if (classifier["ip-common"] && apUtils.ifObjectIsEmpty(classifier["ip-common"])) {
                delete classifier["ip-common"];
            }
            if (classifier["match-criteria"] && apUtils.ifObjectIsEmpty(classifier["match-criteria"])) {
                delete classifier["match-criteria"];
            }
        }
    }
}

/**
    This is the function to display format x Days x Hrs x Mins x Sec
*/
AltiplanoUtilities.prototype.convertMillisecondsToAmountOfTime = function(milliSeconds) {
    var years = Math.floor(milliSeconds / 31536000000);
    var days = Math.floor((milliSeconds % 31536000000) / 86400000);
    var hours = Math.floor(((milliSeconds % 31536000000) % 86400000) / 3600000);
    var minutes = Math.floor((((milliSeconds % 31536000000) % 86400000) % 3600000) / 60000);
    var seconds = Math.floor((((milliSeconds % 31536000000) % 86400000) % 3600000) % 60000) / 1000;
    var duration = '';
    if (years) duration+=(years + "y ");
    if (days) duration+=(days + "d ");
    if (hours) duration+=(hours + "h ");
    if (minutes) duration+=(minutes + "min ");
    if (seconds) duration+=(seconds + "s ");
    return duration;
}

/**
 * This method is used to check if an object is an object or not
 * @param object that need to be checked
 * @returns true/false
 */
 AltiplanoUtilities.prototype.isObject = function(object){
    return object != null && typeof object === 'object';
}


/**
 * This is the function to get information of used tc-id-2-queue-id-mapping/ptp-ccsa-port/ptp-g8275dot1-port profile in onu template.
 * Also this method will return tc-id-2-queue-id-mapping/clock profile details based on ont-profiles-group-id
 *
 *
 * @param {Array} eOnuResources
 * @param {Array} clockProfiles
 * @param {Array} tcToIdMappingProfiles
 * @param {Array} ontProfilesGroup
 */
AltiplanoUtilities.prototype.processProfilesGroupForOnuTemplate = function (eOnuResources, clockProfiles, tcToIdMappingProfiles, ontProfilesGroup, ltDeviceTopology, systemLoadProfilesContent, memoryUsageProfilesContent, tcaConfigJSON, powerSheddingProfileContent) {
    var trafficClassProfiles = {};
    var ptpCcsaProfiles = {};
    var ptpDotProfiles = {};
    var eonu_TrafficClassProfiles = {};
    var eonu_PtpCcsaProfiles = {};
    var eonu_PtpDotProfiles = {};
    var systemLoadProfiles = {};
    var memoryUsageProfiles = {};
    var ethFrameErrProfiles = {};
    var ethPhyErrProfiles = {};
    var fecErrProfiles = {};
    var tcLayerErrProfiles = {};
    var dwnMicErrProfiles = {};
    var callControlFailureProfiles = {};
    var rtpFailureProfiles = {};
    var gemPortErrProfiles = {};
    var gemFrameErrProfiles = {};
    var ethFrameErrExtendedTcaProfiles = {};
    var powerSheddingProfiles = {};

    var onuTemplate = eOnuResources["onuTemplates"]["onu-template"];
    var tcontProfiles = eOnuResources["tcont"]["tcont-profile"];

    for (var templateIdx in onuTemplate) {

        // Getting referred profiles from onu-template
        var services = onuTemplate[templateIdx]["service"];
        var trafficClassProfileNames = [];
        // Get referred tc-id-2-queue-id-mapping profile from service
        for (var serviceIdx in services) {
            var service = services[serviceIdx];
            if (service["tcont-config"]) {
                apUtils.processTcont(service["tcont-config"], tcontProfiles);
                service["tcont-config"].forEach(function (tcontConfigInTemplate) {
                    if (tcontConfigInTemplate && tcontConfigInTemplate["tcontConfigDetail"] && tcontConfigInTemplate["tcontConfigDetail"]["tc-to-queue-mapping-profile-id"]
                        && trafficClassProfileNames.indexOf(tcontConfigInTemplate["tcontConfigDetail"]["tc-to-queue-mapping-profile-id"]) == -1) {
                        trafficClassProfileNames.push(tcontConfigInTemplate["tcontConfigDetail"]["tc-to-queue-mapping-profile-id"]);
                    }
                });
            }
        }
        // Get referred tc-id-2-queue-id-mapping profile from transport-voip-sip
        if (onuTemplate[templateIdx]["transport-voip-sip"] != null && eOnuResources["transportVoipSipProfiles"] && eOnuResources["transportVoipSipProfiles"]["transport-voip-sip"]) {
            var transportVoipSipProfiles = eOnuResources["transportVoipSipProfiles"]["transport-voip-sip"];
            for (var profileIndex in transportVoipSipProfiles) {
                if (onuTemplate[templateIdx]["transport-voip-sip"]["name"] == transportVoipSipProfiles[profileIndex]["name"]) {
                    if (transportVoipSipProfiles[profileIndex]["tc-to-queue-mapping-profile-id"]) {
                        trafficClassProfileNames.push(transportVoipSipProfiles[profileIndex]["tc-to-queue-mapping-profile-id"]);
                    } else if (transportVoipSipProfiles[profileIndex]["tcont-config"] && transportVoipSipProfiles[profileIndex]["tcont-config"].length> 0
                        && transportVoipSipProfiles[profileIndex]["tcont-config"][0]["tcont-profile-id"]) {
                        var tcontConfig = [{"tcont-profile-id": transportVoipSipProfiles[profileIndex]["tcont-config"][0]["tcont-profile-id"]}];
                        apUtils.processTcont(tcontConfig, tcontProfiles);
                        if (tcontConfig && tcontConfig.length > 0 && tcontConfig[0]["tcontConfigDetail"] && tcontConfig[0]["tcontConfigDetail"]["tc-to-queue-mapping-profile-id"]) {
                            trafficClassProfileNames.push(tcontConfig[0]["tcontConfigDetail"]["tc-to-queue-mapping-profile-id"]);
                        }
                    }
                }
            }
        }
        var ptpCcsaProfileNames = [];
        var ptpDotProfileNames = [];
        var systemLoadProfileNames = [];
        var memoryUsageProfileNames = [];
        if (clockProfiles && clockProfiles["phaseSyncProfiles"] && clockProfiles["ccsaProfiles"] && clockProfiles["dot1Profiles"] && onuTemplate[templateIdx]["layout"] && onuTemplate[templateIdx]["layout"]["cards"]) {
            var cards = onuTemplate[templateIdx]["layout"]["cards"];
            if (cards) {
                cards.forEach(function (card) {
                    if (card && card["ports"]) {
                        for (var portIdx in card["ports"]) {
                            var port = card["ports"][portIdx];
                            if (port && port["uniConfigurationDetail"] && port["uniConfigurationDetail"]["clock"] && port["uniConfigurationDetail"]["clock"]["phase-sync-profile-id"]) {
                                var phaseSyncProfileId = port["uniConfigurationDetail"]["clock"]["phase-sync-profile-id"];
                                if (phaseSyncProfileId && Object.keys(clockProfiles["phaseSyncProfiles"]).indexOf(phaseSyncProfileId) != -1 &&
                                    clockProfiles["phaseSyncProfiles"][phaseSyncProfileId]["ptp-master"]) {
                                    // Add referred ptp-ccsa-port profile
                                    if (clockProfiles["phaseSyncProfiles"][phaseSyncProfileId]["ptp-master"]["ccsa-port-profile-id"] && ptpCcsaProfileNames.indexOf(clockProfiles["phaseSyncProfiles"][phaseSyncProfileId]["ptp-master"]["ccsa-port-profile-id"]) == -1) {
                                        ptpCcsaProfileNames.push(clockProfiles["phaseSyncProfiles"][phaseSyncProfileId]["ptp-master"]["ccsa-port-profile-id"]);
                                    }
                                    // Add referred dot1-port profile
                                    if (clockProfiles["phaseSyncProfiles"][phaseSyncProfileId]["ptp-master"]["g8275dot1-port-profile-id"] && ptpDotProfileNames.indexOf(clockProfiles["phaseSyncProfiles"][phaseSyncProfileId]["ptp-master"]["g8275dot1-port-profile-id"]) == -1) {
                                        ptpDotProfileNames.push(clockProfiles["phaseSyncProfiles"][phaseSyncProfileId]["ptp-master"]["g8275dot1-port-profile-id"]);
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }

        // Get profile names from ont-profiles-group
        var ethFrameErrProfileNames = [];
        var ethPhyErrProfileNames = [];
        var fecErrProfileNames = [];
        var tcLayerErrProfileNames = [];
        var dwnMicErrProfileNames = [];
        var rtpFailureProfileNames = [];
        var callControlFailureProfileNames = [];
        var gemPortErrProfileNames = [];
        var gemFrameErrProfileNames = [];
        var ethFrameErrExtendedTcaProfileNames = [];
        var powerSheddingProfileNames = [];
        if (onuTemplate[templateIdx]["ont-profiles-group-id"] && onuTemplate[templateIdx]["ont-profiles-group-id"] != null && ontProfilesGroup) {
            ontProfilesGroup.forEach(function (profileGroup) {
                if (profileGroup && profileGroup["name"] == onuTemplate[templateIdx]["ont-profiles-group-id"]) {
                    if (profileGroup["tc-id-2-queue-id-mapping-profiles"]) {
                        // Get tc-id-2-queue-id-mapping profile name from ont-profiles-group
                        profileGroup["tc-id-2-queue-id-mapping-profiles"].forEach(function (tcProfileName) {
                            if ((trafficClassProfileNames.length == 0) || (trafficClassProfileNames.length > 0 && trafficClassProfileNames.indexOf(tcProfileName) == -1)) {
                                trafficClassProfileNames.push(tcProfileName);
                            }
                        });
                    }
                    if (profileGroup["ptp-ccsa-port-profiles"]) {
                        // Get ptp-ccsa-port profile name from ont-profiles-group
                        profileGroup["ptp-ccsa-port-profiles"].forEach(function (ccsaProfileName) {
                            if ((ptpCcsaProfileNames.length == 0) || (ptpCcsaProfileNames.length > 0 && ptpCcsaProfileNames.indexOf(ccsaProfileName) == -1)) {
                                ptpCcsaProfileNames.push(ccsaProfileName);
                            }
                        });
                    }
                    if (profileGroup["ptp-g8275dot1-port-profiles"]) {
                        // Get ptp-g8275dot1-port profile name from ont-profiles-group
                        profileGroup["ptp-g8275dot1-port-profiles"].forEach(function (dotProfileName) {
                            if ((ptpDotProfileNames.length == 0) || (ptpDotProfileNames.length > 0 && ptpDotProfileNames.indexOf(dotProfileName) == -1)) {
                                ptpDotProfileNames.push(dotProfileName);
                            }
                        });
                    }
                    if (profileGroup["eth-frame-err-profiles"]) {
                        // Get eth-frame-err-profiles name from ont-profiles-group
                        profileGroup["eth-frame-err-profiles"].forEach(function (ethFrameErrProfileName) {
                            if ((ethFrameErrProfileNames.length == 0) || (ethFrameErrProfileNames.length > 0 && ethFrameErrProfileNames.indexOf(ethFrameErrProfileName) == -1)) {
                                ethFrameErrProfileNames.push(ethFrameErrProfileName);
                            }
                        });
                    }
                    if (profileGroup["eth-phy-layer-err-profiles"]) {
                        // Get eth-phy-err-profiles name from ont-profiles-group
                        profileGroup["eth-phy-layer-err-profiles"].forEach(function (ethPhyErrProfileName) {
                            if ((ethPhyErrProfileNames.length == 0) || (ethPhyErrProfileNames.length > 0 && ethPhyErrProfileNames.indexOf(ethPhyErrProfileName) == -1)) {
                                ethPhyErrProfileNames.push(ethPhyErrProfileName);
                            }
                        });
                    }
		           if (profileGroup["fec-err-profiles"]) {
                        // Get fec-err-profiles name from ont-profiles-group
                        profileGroup["fec-err-profiles"].forEach(function (fecErrProfileName) {
                            if ((fecErrProfileNames.length == 0) || (fecErrProfileNames.length > 0 && fecErrProfileNames.indexOf(fecErrProfileName) == -1)) {
                                fecErrProfileNames.push(fecErrProfileName);
                            }
                        });
                    }
                    if (profileGroup["tc-layer-err-profiles"]) {
                        // Get tc-layer-err-profiles name from ont-profiles-group
                        profileGroup["tc-layer-err-profiles"].forEach(function (tcLayerErrProfileName) {
                            if ((tcLayerErrProfileNames.length == 0) || (tcLayerErrProfileNames.length > 0 && tcLayerErrProfileNames.indexOf(tcLayerErrProfileName) == -1)) {
                                tcLayerErrProfileNames.push(tcLayerErrProfileName);
                            }
                        });
                    }
                    if (profileGroup["downstream-mic-err-profiles"]) {
                        // Get downstream-mic-err-profiles name from ont-profiles-group
                        profileGroup["downstream-mic-err-profiles"].forEach(function (dwnMicErrProfileName) {
                            if ((dwnMicErrProfileNames.length == 0) || (dwnMicErrProfileNames.length > 0 && dwnMicErrProfileNames.indexOf(dwnMicErrProfileName) == -1)) {
                                dwnMicErrProfileNames.push(dwnMicErrProfileName);
                            }
                        });
                    }
                    if (profileGroup["system-load-profiles"]) {
                        // Get system-load-profiles profile name from ont-profiles-group
                        profileGroup["system-load-profiles"].forEach(function (systemLoadProfile) {
                            if (systemLoadProfileNames.indexOf(systemLoadProfile) == -1) {
                                systemLoadProfileNames.push(systemLoadProfile);
                            }
                        });
                    }
                    if (profileGroup["memory-usage-profiles"]) {
                        // Get memory-usage-profiles profile name from ont-profiles-group
                        profileGroup["memory-usage-profiles"].forEach(function (memoryUsageProfile) {
                            if (memoryUsageProfileNames.indexOf(memoryUsageProfile) == -1) {
                                memoryUsageProfileNames.push(memoryUsageProfile);
                            }
                        });
                    }
                    if (profileGroup["rtp-failure-profiles"]) {
                        // Get rtp-failure-tca-profiles name from ont-profiles-group
                        profileGroup["rtp-failure-profiles"].forEach(function (rtpFailureProfileName) {
                            if ((rtpFailureProfileNames.length == 0) || (rtpFailureProfileNames.length > 0 && rtpFailureProfileNames.indexOf(rtpFailureProfileName) == -1)) {
                                rtpFailureProfileNames.push(rtpFailureProfileName);
                            }
                        });
                    }

                    if (profileGroup["call-control-failure-profiles"]) {
                        // Get call-control-failure-tca-profiles name from ont-profiles-group
                        profileGroup["call-control-failure-profiles"].forEach(function (callControlFailureProfileName) {
                            if ((callControlFailureProfileNames.length == 0) || (callControlFailureProfileNames.length > 0 && callControlFailureProfileNames.indexOf(callControlFailureProfileName) == -1)) {
                                callControlFailureProfileNames.push(callControlFailureProfileName);
                            }
                        });
                    }
                    if (profileGroup["gem-port-err-profiles"]) {
                        // Get gem-port-err-profiles name from ont-profiles-group
                        profileGroup["gem-port-err-profiles"].forEach(function (gemPortErrProfileName) {
                            if ((gemPortErrProfileNames.length == 0) || (gemPortErrProfileNames.length > 0 && gemPortErrProfileNames.indexOf(gemPortErrProfileName) == -1)) {
                                gemPortErrProfileNames.push(gemPortErrProfileName);
                            }
                        });
                    }
                    if (profileGroup["gem-frame-err-tca-profiles"]) {
                        // Get gem-frame-err-tca-profiles name from ont-profiles-group
                        profileGroup["gem-frame-err-tca-profiles"].forEach(function (gemFrameErrProfileName) {
                            if ((gemFrameErrProfileNames.length == 0) || (gemFrameErrProfileNames.length > 0 && gemFrameErrProfileNames.indexOf(gemFrameErrProfileName) == -1)) {
                                gemFrameErrProfileNames.push(gemFrameErrProfileName);
                            }
                        });
                    }
                    if (profileGroup["eth-frame-err-extended-tca-profiles"]) {
                        // Get eth-frame-err-profiles name from ont-profiles-group
                        profileGroup["eth-frame-err-extended-tca-profiles"].forEach(function (ethFrameErrExtendedTcaProfileName) {
                            if ((ethFrameErrExtendedTcaProfileNames.length == 0) || (ethFrameErrExtendedTcaProfileNames.length > 0 && ethFrameErrExtendedTcaProfileNames.indexOf(ethFrameErrExtendedTcaProfileName) == -1)) {
                                ethFrameErrExtendedTcaProfileNames.push(ethFrameErrExtendedTcaProfileName);
                            }
                        });
                    }
                    if (profileGroup["power-shedding-profiles"]) {
                        // Get power-shedding-profiles name from ont-profiles-group
                        profileGroup["power-shedding-profiles"].forEach(function (powerSheddingProfileName) {
                            if ((powerSheddingProfileNames.length == 0) || (powerSheddingProfileNames.length > 0 && powerSheddingProfileNames.indexOf(powerSheddingProfileName) == -1)) {
                                powerSheddingProfileNames.push(powerSheddingProfileName);
                            }
                        });
                    }
                }
            });
        }

        if (ltDeviceTopology && ltDeviceTopology["eOnu_tc-id-2-queue-id-mapping-profile"] && ltDeviceTopology["eOnu_tc-id-2-queue-id-mapping-profile"][Object.keys(ltDeviceTopology["eOnu_tc-id-2-queue-id-mapping-profile"])[0]]
            && ltDeviceTopology["eOnu_tc-id-2-queue-id-mapping-profile"][Object.keys(ltDeviceTopology["eOnu_tc-id-2-queue-id-mapping-profile"])[0]]["name"]) {
            var tcIdMappingProfileNamesFromTopo = Object.keys(ltDeviceTopology["eOnu_tc-id-2-queue-id-mapping-profile"]);
            if (tcIdMappingProfileNamesFromTopo) {
                trafficClassProfiles[onuTemplate[templateIdx]["name"]] = apUtils.computeRemovedAttribute(tcIdMappingProfileNamesFromTopo, tcToIdMappingProfiles, trafficClassProfileNames);
            }
        } else {
            if (trafficClassProfileNames && trafficClassProfileNames.length > 0) {
                trafficClassProfiles[onuTemplate[templateIdx]["name"]] = {};
                trafficClassProfileNames.forEach(function (trafficClassProfileName) {
                    if (tcToIdMappingProfiles && Object.keys(tcToIdMappingProfiles).length > 0 && Object.keys(tcToIdMappingProfiles).indexOf(trafficClassProfileName) != -1) {
                        trafficClassProfiles[onuTemplate[templateIdx]["name"]][trafficClassProfileName] = {"name": tcToIdMappingProfiles[trafficClassProfileName]["name"]};
                        eonu_TrafficClassProfiles[trafficClassProfileName] = tcToIdMappingProfiles[trafficClassProfileName];
                    }
                });
            }
        }

        if (ltDeviceTopology && ltDeviceTopology["ptp-ccsa-port-profiles"] && ltDeviceTopology["ptp-ccsa-port-profiles"][Object.keys(ltDeviceTopology["ptp-ccsa-port-profiles"])[0]]
            && ltDeviceTopology["ptp-ccsa-port-profiles"][Object.keys(ltDeviceTopology["ptp-ccsa-port-profiles"])[0]]["name"]) {
            var ptpCcsaProfileNamesFromTopo = Object.keys(ltDeviceTopology["ptp-ccsa-port-profiles"]);
            if (ptpCcsaProfileNamesFromTopo) {
                ptpCcsaProfiles[onuTemplate[templateIdx]["name"]] = apUtils.computeRemovedAttribute(ptpCcsaProfileNamesFromTopo, clockProfiles["ccsaProfiles"], ptpCcsaProfileNames);
            }
        } else {
            if (ptpCcsaProfileNames && ptpCcsaProfileNames.length > 0) {
                ptpCcsaProfiles[onuTemplate[templateIdx]["name"]] = {};
                ptpCcsaProfileNames.forEach(function (ptpCcsaProfileName) {
                    if (clockProfiles && clockProfiles["ccsaProfiles"] && Object.keys(clockProfiles["ccsaProfiles"]).length > 0 && Object.keys(clockProfiles["ccsaProfiles"]).indexOf(ptpCcsaProfileName) != -1) {
                        ptpCcsaProfiles[onuTemplate[templateIdx]["name"]][ptpCcsaProfileName] = {"name": clockProfiles["ccsaProfiles"][ptpCcsaProfileName]["name"]};
                        eonu_PtpCcsaProfiles[ptpCcsaProfileName] = clockProfiles["ccsaProfiles"][ptpCcsaProfileName];
                    }
                });
            }
        }

        if (ltDeviceTopology && ltDeviceTopology["ptp-g8275dot1-port-profiles"] && ltDeviceTopology["ptp-g8275dot1-port-profiles"][Object.keys(ltDeviceTopology["ptp-g8275dot1-port-profiles"])[0]]
            && ltDeviceTopology["ptp-g8275dot1-port-profiles"][Object.keys(ltDeviceTopology["ptp-g8275dot1-port-profiles"])[0]]["name"]) {
            var ptpDot1ProfileNamesFromTopo = Object.keys(ltDeviceTopology["ptp-g8275dot1-port-profiles"]);
            if (ptpDot1ProfileNamesFromTopo) {
                ptpDotProfiles[onuTemplate[templateIdx]["name"]] = apUtils.computeRemovedAttribute(ptpDot1ProfileNamesFromTopo, clockProfiles["dot1Profiles"], ptpDotProfileNames);
            }
        } else {
            if (ptpDotProfileNames && ptpDotProfileNames.length > 0) {
                ptpDotProfiles[onuTemplate[templateIdx]["name"]] = {};
                ptpDotProfileNames.forEach(function (ptpDotProfileName) {
                    if (clockProfiles && clockProfiles["dot1Profiles"] && Object.keys(clockProfiles["dot1Profiles"]).length > 0 && Object.keys(clockProfiles["dot1Profiles"]).indexOf(ptpDotProfileName) != -1) {
                        ptpDotProfiles[onuTemplate[templateIdx]["name"]][ptpDotProfileName] = {"name": clockProfiles["dot1Profiles"][ptpDotProfileName]["name"]};
                        eonu_PtpDotProfiles[ptpDotProfileName] = clockProfiles["dot1Profiles"][ptpDotProfileName];
                    }
                });
            }
        }

        if (ethFrameErrProfileNames && ethFrameErrProfileNames.length > 0) {
            ethFrameErrProfiles[onuTemplate[templateIdx]["name"]] = {};
            ethFrameErrProfileNames.forEach(function (ethFrameErrProfileName) {
                var configedEthFrmErrProfiles = tcaConfigJSON["eth-frame-error-tca-profile"];
                if(configedEthFrmErrProfiles)
                {
                    configedEthFrmErrProfiles.forEach(function (configedEthFrmErrProfile) {
			            if(ethFrameErrProfileName == configedEthFrmErrProfile.name) {
                            ethFrameErrProfiles[onuTemplate[templateIdx]["name"]][ethFrameErrProfileName] = configedEthFrmErrProfile;
			            }
                    });
                }                
            });
        }        
        if (ethPhyErrProfileNames && ethPhyErrProfileNames.length > 0) {
            ethPhyErrProfiles[onuTemplate[templateIdx]["name"]] = {};
            ethPhyErrProfileNames.forEach(function (ethPhyErrProfileName) {
                var configedEthPhyErrProfiles = tcaConfigJSON["eth-phy-error-tca-profile"];
                if(configedEthPhyErrProfiles)
                {
                    configedEthPhyErrProfiles.forEach(function (configedEthPhyErrProfile) {
			            if(ethPhyErrProfileName == configedEthPhyErrProfile.name) {
                            ethPhyErrProfiles[onuTemplate[templateIdx]["name"]][ethPhyErrProfileName] = configedEthPhyErrProfile;
			            }
                    });
                }                
            });
        }

        if (rtpFailureProfileNames && rtpFailureProfileNames.length > 0) {
            rtpFailureProfiles[onuTemplate[templateIdx]["name"]] = {};
            rtpFailureProfileNames.forEach(function (rtpFailureProfileName) {
                var configedRtpFailureProfiles = tcaConfigJSON["rtp-failure-tca-profile"];
                if(configedRtpFailureProfiles)
                {
                    configedRtpFailureProfiles.forEach(function (configedRtpFailureProfile) {
			            if(rtpFailureProfileName == configedRtpFailureProfile.name) {
                            rtpFailureProfiles[onuTemplate[templateIdx]["name"]][rtpFailureProfileName] = configedRtpFailureProfile;
			            }
                    });
                }                
            });
        }

        if (callControlFailureProfileNames && callControlFailureProfileNames.length > 0) {
            callControlFailureProfiles[onuTemplate[templateIdx]["name"]] = {};
            callControlFailureProfileNames.forEach(function (callControlFailureProfileName) {
                var configedCallControlFailureProfiles = tcaConfigJSON["call-control-failure-tca-profile"];
                if(configedCallControlFailureProfiles)
                {
                    configedCallControlFailureProfiles.forEach(function (configedCallControlFailureProfile) {
			            if(callControlFailureProfileName == configedCallControlFailureProfile.name) {
                            callControlFailureProfiles[onuTemplate[templateIdx]["name"]][callControlFailureProfileName] = configedCallControlFailureProfile;
			            }
                    });
                }                
            });
        }

        if (fecErrProfileNames && fecErrProfileNames.length > 0) {
            fecErrProfiles[onuTemplate[templateIdx]["name"]] = {};
            fecErrProfileNames.forEach(function (fecErrProfileName) {
                var configuredfecErrProfiles = tcaConfigJSON["fec-error-tca-profile"];
                if(configuredfecErrProfiles)
                {
                    configuredfecErrProfiles.forEach(function (configuredfecErrProfile) {
			            if(fecErrProfileName == configuredfecErrProfile.name) {
                            fecErrProfiles[onuTemplate[templateIdx]["name"]][fecErrProfileName] = configuredfecErrProfile;
			            }
                    });
                }                
            });
        }
        if (tcLayerErrProfileNames && tcLayerErrProfileNames.length > 0) {
            tcLayerErrProfiles[onuTemplate[templateIdx]["name"]] = {};
            tcLayerErrProfileNames.forEach(function (tcLayerErrProfileName) {
                var configuredTcLayerErrProfiles = tcaConfigJSON["tc-layer-error-tca-profile"];
                if(configuredTcLayerErrProfiles)
                {
                    configuredTcLayerErrProfiles.forEach(function (configuredTcLayerErrProfile) {
			            if(tcLayerErrProfileName == configuredTcLayerErrProfile.name) {
                            tcLayerErrProfiles[onuTemplate[templateIdx]["name"]][tcLayerErrProfileName] = configuredTcLayerErrProfile;
			            }
                    });
                }                
            });
        }
        if (dwnMicErrProfileNames && dwnMicErrProfileNames.length > 0) {
            dwnMicErrProfiles[onuTemplate[templateIdx]["name"]] = {};
            dwnMicErrProfileNames.forEach(function (dwnMicErrProfileName) {
                var configuredDwnMicErrProfiles = tcaConfigJSON["downstream-mic-error-tca-profile"];
                if(configuredDwnMicErrProfiles)
                {
                    configuredDwnMicErrProfiles.forEach(function (configuredDwnMicErrProfile) {
			            if(dwnMicErrProfileName == configuredDwnMicErrProfile.name) {
                            dwnMicErrProfiles[onuTemplate[templateIdx]["name"]][dwnMicErrProfileName] = configuredDwnMicErrProfile;
			            }
                    });
                }                
            });
        }
        if (gemPortErrProfileNames && gemPortErrProfileNames.length > 0) {
            gemPortErrProfiles[onuTemplate[templateIdx]["name"]] = {};
            gemPortErrProfileNames.forEach(function (gemPortErrProfileName) {
                var configedGemPortErrProfiles = tcaConfigJSON["gem-port-error-tca-profile"];
                if(configedGemPortErrProfiles)
                {
                    configedGemPortErrProfiles.forEach(function (configedGemPortErrProfile) {
                      if(gemPortErrProfileName == configedGemPortErrProfile.name) {
                         gemPortErrProfiles[onuTemplate[templateIdx]["name"]][gemPortErrProfileName] = configedGemPortErrProfile;
                        }
                    });
                }
            });
        }
        if (systemLoadProfileNames.length > 0) {
            systemLoadProfiles[onuTemplate[templateIdx]["name"]] = {};
            systemLoadProfileNames.forEach(function (systemLoadProfileName) {
                if (systemLoadProfilesContent && Object.keys(systemLoadProfilesContent).length > 0 && Object.keys(systemLoadProfilesContent).indexOf(systemLoadProfileName) != -1) {
                    systemLoadProfiles[onuTemplate[templateIdx]["name"]][systemLoadProfileName] = systemLoadProfilesContent[systemLoadProfileName];
                }
            });
        }
        if (memoryUsageProfileNames.length > 0) {
            memoryUsageProfiles[onuTemplate[templateIdx]["name"]] = {};
            memoryUsageProfileNames.forEach(function (memoryUsageProfileName) {
                if (memoryUsageProfilesContent && Object.keys(memoryUsageProfilesContent).length > 0 && Object.keys(memoryUsageProfilesContent).indexOf(memoryUsageProfileName) != -1) {
                    memoryUsageProfiles[onuTemplate[templateIdx]["name"]][memoryUsageProfileName] = memoryUsageProfilesContent[memoryUsageProfileName];
                }
            });
        }
        if (gemFrameErrProfileNames && gemFrameErrProfileNames.length > 0) {
            gemFrameErrProfiles[onuTemplate[templateIdx]["name"]] = {};
            gemFrameErrProfileNames.forEach(function (gemFrameErrProfileName) {
                var configedGemFrameErrProfiles = tcaConfigJSON["gem-frame-error-tca-profile"];
                if(configedGemFrameErrProfiles) {
                    configedGemFrameErrProfiles.forEach(function (configedGemFrameErrProfile) {
                        if(gemFrameErrProfileName == configedGemFrameErrProfile.name) {
                            gemFrameErrProfiles[onuTemplate[templateIdx]["name"]][gemFrameErrProfileName] = configedGemFrameErrProfile;
                        }
                    });
                }
            });
        }
        if (ethFrameErrExtendedTcaProfileNames && ethFrameErrExtendedTcaProfileNames.length > 0) {
            ethFrameErrExtendedTcaProfiles[onuTemplate[templateIdx]["name"]] = {};
            ethFrameErrExtendedTcaProfileNames.forEach(function (ethFrameErrExtendedTcaProfileName) {
                var configedEthFrmErrExtendedTcaProfiles = tcaConfigJSON["eth-frame-error-extended-tca-profile"];
                if(configedEthFrmErrExtendedTcaProfiles)
                {
                    configedEthFrmErrExtendedTcaProfiles.forEach(function (configedEthFrmErrExtendedTcaProfile) {
			            if(ethFrameErrExtendedTcaProfileName == configedEthFrmErrExtendedTcaProfile.name) {
                            ethFrameErrExtendedTcaProfiles[onuTemplate[templateIdx]["name"]][ethFrameErrExtendedTcaProfileName] = configedEthFrmErrExtendedTcaProfile;
			            }
                    });
                }                
            });
        }
        //powerSheddingProfileNames = ["default"]
        if (powerSheddingProfileNames && powerSheddingProfileNames.length > 0) {
            powerSheddingProfiles[onuTemplate[templateIdx]["name"]] = {};
            powerSheddingProfileNames.forEach(function (powerSheddingProfileName) {
                if (powerSheddingProfileContent) {
                    for (var powerSheddingProfile in powerSheddingProfileContent) {
                        if (powerSheddingProfileName == powerSheddingProfileContent[powerSheddingProfile]["name"]) {
                            powerSheddingProfiles[onuTemplate[templateIdx]["name"]][powerSheddingProfileName] = powerSheddingProfileContent[powerSheddingProfile];
                        }
                    }
                }
            });
        }          
    }

    var onuTemplateProfiles = null;
    onuTemplateProfiles = {"trafficClassProfiles" : trafficClassProfiles, "ptpCcsaProfiles" : ptpCcsaProfiles, "ptpDotProfiles" : ptpDotProfiles,
                           "eonu_TrafficClassProfiles" : eonu_TrafficClassProfiles, "eonu_PtpCcsaProfiles" : eonu_PtpCcsaProfiles, "eonu_PtpDotProfiles" : eonu_PtpDotProfiles,
                           "systemLoadProfiles": systemLoadProfiles, "memoryUsageProfiles": memoryUsageProfiles,
                           "ethFrameErrProfiles" : ethFrameErrProfiles, "ethPhyErrProfiles" : ethPhyErrProfiles,
                           "fecErrProfiles" : fecErrProfiles, "tcLayerErrProfiles" : tcLayerErrProfiles, "dwnMicErrProfiles" : dwnMicErrProfiles,
                           "callControlFailureProfiles" : callControlFailureProfiles, "rtpFailureProfiles" : rtpFailureProfiles,
	    		           "gemPortErrProfiles" : gemPortErrProfiles, "gemFrameErrProfiles" : gemFrameErrProfiles,
                           "ethFrameErrExtendedTcaProfiles" : ethFrameErrExtendedTcaProfiles,
                           "powerSheddingProfiles" : powerSheddingProfiles};                    
    return onuTemplateProfiles;
}

/**
 * This is the function to validate the OAM connectivity credential selection of device-xyz intent.
 *
 * @param {Object} contextualErrorJsonObj
 * @param {Object} intentConfigJson
 */
AltiplanoUtilities.prototype.validateOAMConnectivityCredentialSelection = function(contextualErrorJsonObj,intentConfigJson) {
    var errorMessage = "This field is required";
    if (intentConfigJson["ip-address"]) {
        if (intentConfigJson["username"] || intentConfigJson["password"]) { // inline-for-main-only choice
            if (!intentConfigJson["username"]) {
                contextualErrorJsonObj["username"] = errorMessage;
            }
            if (!intentConfigJson["password"]) {
                contextualErrorJsonObj["password"] = errorMessage;
            }
        } else if (intentConfigJson["main-oam-connectivity-account"] || intentConfigJson["fallback-oam-connectivity-account"]) { // use-profiles choice
            if (!intentConfigJson["main-oam-connectivity-account"]) {
                contextualErrorJsonObj["main-oam-connectivity-account"] = errorMessage;
            }
            if (!intentConfigJson["fallback-oam-connectivity-account"]) {
                contextualErrorJsonObj["fallback-oam-connectivity-account"] = errorMessage;
            }
        } else {
            contextualErrorJsonObj["choice#oam-connectivity-credential"] = "This field must be selected";
        }
    }
    
}

/**
 * This is the function to validate the OAM connectivity account profiles of device-xyz intent.
 *
 * @param {Object} contextualErrorJsonObj
 * @param {Object} intentConfigJson
 * @param {Object} oamConnectivityAccountProfiles
 */
AltiplanoUtilities.prototype.validateOAMConnectivityAccountProfiles = function(contextualErrorJsonObj, intentConfigJson, oamConnectivityAccountProfiles) {
    if (intentConfigJson["main-oam-connectivity-account"] && intentConfigJson["fallback-oam-connectivity-account"]) {
        let objMainOAM = {};
        let objFallbackOAM = {};
        if (oamConnectivityAccountProfiles && Object.keys(oamConnectivityAccountProfiles).length > 0) {
            Object.keys(oamConnectivityAccountProfiles).forEach(function (profileNameKey) {
                if (intentConfigJson["main-oam-connectivity-account"] == oamConnectivityAccountProfiles[profileNameKey].name) {
                    objMainOAM["main-oam-connectivity-account"] = oamConnectivityAccountProfiles[profileNameKey].password;
                    if (oamConnectivityAccountProfiles[profileNameKey].username.length > 11) {
                        contextualErrorJsonObj["main-oam-connectivity-account"] = "Username cannot have more than 11 characters " + "of " + intentConfigJson["main-oam-connectivity-account"];
                    }
                    if (oamConnectivityAccountProfiles[profileNameKey].password.length < 5 || oamConnectivityAccountProfiles[profileNameKey].password.length > 20) {
                        contextualErrorJsonObj["main-oam-connectivity-account"] = "Password should be equal to or greater than 5 characters and should not exceed maximum value 20 characters";
                    }
                    if (oamConnectivityAccountProfiles[profileNameKey].username != "admin") {
                        contextualErrorJsonObj["main-oam-connectivity-account"] = "Only 'admin' account can be used for OAM Connectivity purpose " + "of " + intentConfigJson["main-oam-connectivity-account"];
                    }
                }
                if (intentConfigJson["fallback-oam-connectivity-account"] == oamConnectivityAccountProfiles[profileNameKey].name) {
                    objFallbackOAM["fallback-oam-connectivity-account"] = oamConnectivityAccountProfiles[profileNameKey].password;
                    if (oamConnectivityAccountProfiles[profileNameKey].username.length > 11) {
                        contextualErrorJsonObj["fallback-oam-connectivity-account"] = "Username cannot have more than 11 characters " + "of " + intentConfigJson["fallback-oam-connectivity-account"];
                    }
                    if (oamConnectivityAccountProfiles[profileNameKey].password.length < 5 || oamConnectivityAccountProfiles[profileNameKey].password.length > 20) {
                        contextualErrorJsonObj["fallback-oam-connectivity-account"] = "Password should be equal to or greater than 5 characters and should not exceed maximum value 20 characters";
                    }
                    if (oamConnectivityAccountProfiles[profileNameKey].username != "admin") {
                        contextualErrorJsonObj["fallback-oam-connectivity-account"] = "Only 'admin' account can be used for OAM Connectivity purpose " + "of " + intentConfigJson["fallback-oam-connectivity-account"];
                    }
                }
            })
            if (objMainOAM["main-oam-connectivity-account"] && objFallbackOAM["fallback-oam-connectivity-account"]) {
                if (objMainOAM["main-oam-connectivity-account"] === objFallbackOAM["fallback-oam-connectivity-account"]){
                    contextualErrorJsonObj["fallback-oam-connectivity-account"] = "Both main and fallback Connectivity OAM Accounts cannot have same password ";
                    contextualErrorJsonObj["main-oam-connectivity-account"] = "Both main and fallback Connectivity OAM Accounts cannot have same password ";
                }
            }
            if  (!objMainOAM["main-oam-connectivity-account"]){
                contextualErrorJsonObj["main-oam-connectivity-account"] = "Profile Device Oam Connectivity Account with subtype Lightspan " + intentConfigJson["main-oam-connectivity-account"] + " is not associated";
            }
            if  (!objFallbackOAM["fallback-oam-connectivity-account"]){
                contextualErrorJsonObj["fallback-oam-connectivity-account"] = "Profile Device Oam Connectivity Account with subtype Lightspan " + intentConfigJson["fallback-oam-connectivity-account"] + " is not associated";
            }
        }
    }
}

/** FNMS-136021
 * This method is used to catch the error while parsing a JSON string to objects
 * If there is an error, an error will be thrown that will help GUI not freezed.
 * @param {*} methodName the method is using the parse function
 * @param {*} stageArgs json string
 * @returns 
 */
AltiplanoUtilities.prototype.JSONParsingWithCatchingException = function (methodName, stageArgs) {
    try {
        return JSON.parse(stageArgs);
    } catch (e) {
        logger.error("Stage args failed in method {} : {}", methodName, stageArgs);
        throw new RuntimeException("Error while parse the xtra info at " + methodName +" method");
    }
}

/**
 * This is the function to compute and set 'removed' attribute by comparing list of profile names in the topology and current profile names.
 *
 *
 * @param {Array} profileNamesFromTopo
 * @param {Object} profileObject
 * @param {Array} currentProfileNamesList
 */
AltiplanoUtilities.prototype.computeRemovedAttribute = function (profileNamesFromTopo, profileObject, currentProfileNamesList) {
    var constructedProfileObject = {};
    for (var profileIndex in profileNamesFromTopo) {
        var profileName = profileNamesFromTopo[profileIndex];
        if (profileObject && Object.keys(profileObject).indexOf(profileName) != -1) {
            constructedProfileObject[profileName] = JSON.parse(JSON.stringify(profileObject[profileName]));
            if ((currentProfileNamesList.length == 0) || (currentProfileNamesList.length > 0 && currentProfileNamesList.indexOf(profileName) == -1)) {
                constructedProfileObject[profileName]["removed"] = "removed";
            }
        }
    }
    return constructedProfileObject;
}

/**
 * This method is used to get the intent state
 */
AltiplanoUtilities.prototype.getIntentState = function (intentType, target) {
    var intentState = ibnService.getIntentState(intentType, target);
    if (intentState) {
        return intentState.getAligned();
    }
    return null;
}

/**
 * This is the function migrate the values of the intent UI yang attributes in intentConigJSON during intent migration.
 *
 *
 * @param intentConfigJson - The intent's configuration attributes
 * @param yangField - Yang Field in the intent
 * @param yangMappingObj - Object of the Mapping of the old value and new value (ex. {oldValue1:newValue1,oldValue2:newValue2})
 */

AltiplanoUtilities.prototype.migrateIntentYangAttributes = function (intentConfigJson,yangField,yangMappingObj) {
    if (intentConfigJson[yangField]) {
       Object.keys(yangMappingObj).forEach(function (oldYangValue){
            if (intentConfigJson[yangField] == oldYangValue) {
                intentConfigJson[yangField] = yangMappingObj[oldYangValue];
            }
        })
    }
    return intentConfigJson;
}
/**
* This method is used to generate number device for using hash alogirthm
* @returns virtual device name 
*/
AltiplanoUtilities.prototype.getBSOVirtualDevice = function(deviceName, targetNameCompanation, maxDeviceInstance){
	// For Future Reference : APAPPS-2479 (Fix suggested by Annamalt)
	var stringBuilder = new HashCodeBuilder();
    stringBuilder.append(deviceName);
    var hashIndex = (Math.abs(stringBuilder.hashCode()) % maxDeviceInstance) + 1;
    return targetNameCompanation.concat(hashIndex);
}

AltiplanoUtilities.prototype.getBSOVirtualDeviceShardId = function(deviceName, targetName, bucketCount){
	var stringBuilder = new HashCodeBuilder();
    stringBuilder.append('sharding-'+deviceName);
    var hashIndex = (Math.abs(stringBuilder.hashCode()) % bucketCount) + 1;
    return targetName.concat(hashIndex);
}

AltiplanoUtilities.prototype.getSztpFlag = function(deviceID, fetchFrom) {
    var requestTemplateArgs = { "deviceID": deviceID, "fetchFrom": fetchFrom };
    var xpath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceID + "\']";
    try {
        var res = this.getExtractedNodeFromResponse(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "resources/getSztpFlag.xml.ftl", requestTemplateArgs, xpath, this.prefixToNsMap);
        var flagPath = "adh:device-specific-data/nokia-sztp:sztp/nokia-sztp:enabled";
        var flagvalue = this.getNodeValue(res, flagPath, this.prefixToNsMap);
        return flagvalue;
    }
    catch (e) {
        logger.debug("Error while getting sztp flag {}", e);
    }
    return null;
}

AltiplanoUtilities.prototype.convertEthernetXXXCardTypeToSpeedLimit = function(cardType){
    if(cardType == "Ethernet-10M") {
        return 10;
    }
    else if(cardType == "Ethernet-100M"){
        return 100;
    }
    else if(cardType == "Ethernet-1G"){
        return 1000;
    }
    else if(cardType == "Ethernet-2.5G"){
        return 2500;
    }
    else if(cardType == "Ethernet-5G"){
        return 5000;
    }
    else if(cardType == "Ethernet-10G"){
        return 10000;
    }
    else if(cardType == "Ethernet-25G"){
        return 25000;
    }
    else if(cardType == "Ethernet-40G"){
        return 40000;
    }
    return 100000;
}

AltiplanoUtilities.prototype.convertPortSpeedEnumToSpeedNumber = function(portSpeedEnum){
    switch (portSpeedEnum) {
        case "eth-if-speed-100mb":{
            return 100;
        }
        case "eth-if-speed-1gb": {
            return 1000;
        }
        case "eth-if-speed-2.5gb": {
            return 2500;
        }
        case "eth-if-speed-5gb": {
            return 5000;
        }
        case "eth-if-speed-10gb": {
            return 10000;
        }
        case "eth-if-speed-25gb": {
            return 25000;
        }
        case "eth-if-speed-40gb": {
            return 40000;
        }
        case "eth-if-speed-100gb": {
            return 100000;
        }
    }
    return 0;
}

AltiplanoUtilities.prototype.fillOldAttributesOfCardFromNewProfile = function(card){

    // if(!card["virtual-board-number"] && card["cardNo"]){
    //     card["virtual-board-number"] = card["cardNo"];
    // }
    let ports = card["ports"];
    let cardType = card["cardType"];
    for (var inxPort in ports) {
        let port = ports[inxPort];
        if(port["portType"] == undefined){
            let pt = apUtils.consturctPortTypeFromCardType(card["cardType"]);
            if(pt != null){
                port["portType"] = pt;
            }
        }
        let portSpeed = port["portspeed"];
        if(cardType.startsWith("Ethernet-") && (portSpeed == null || portSpeed == "") && port["auto-negotiation"] != "enabled"){
            port["portspeed"] = apUtils.convertEthernetXXXCardTypeToPortSpeed(cardType);
        }
    }
}

AltiplanoUtilities.prototype.consturctPortTypeFromCardType = function(cardType){
    let portType = null;
    if(cardType == null){
        return portType;
    }
    if(cardType === "POTS"){
        portType = "pots";
    } else if (cardType === "Video") {
        portType = "video";
    } else if (cardType === "MoCA") {
        portType = "moca";
    } else if (cardType === "Ethernet Optical") {
        portType = "ethernetCsmacd";
    } else if (cardType === "VEIP") {
        portType = "onu-v-vrefpoint";
    } else if (cardType.startsWith("Ethernet-")) {
        portType = "ethernetCsmacd";
    } else {
        // cardType = "Ethernet"
        portType = "ethernetCsmacd";
    }
    return portType;
}
/**
 * Function get tcont-sharing and queue-sharing attributes from tcont-sharing-enum attribute
 * @param tcontProfileList
 * @return {*}
 */  
AltiplanoUtilities.prototype.convertToTcontQueueSharingFromTcontSharingEnum = function(tcontProfileList){
    if(tcontProfileList && tcontProfileList.length > 0){
        for(var index in tcontProfileList){
            tcontProfileList[index] = this.convertToTcontQueueSharingFromTcontSharingEnumForProfile(tcontProfileList[index]);
        }
    }
    return tcontProfileList;
}  

AltiplanoUtilities.prototype.convertToTcontQueueSharingFromTcontSharingEnumForProfile = function(tcontProfile){
    if(tcontProfile && tcontProfile["tcont-sharing-enum"]){
        if(tcontProfile["tcont-sharing-enum"] == "none"){
            tcontProfile["tcont-sharing"] = "false";
            tcontProfile["queue-sharing"] = "false";
        }
        else{
            tcontProfile["tcont-sharing"] = "true";
            if(tcontProfile["tcont-sharing-enum"] == "ont"){
                tcontProfile["queue-sharing"] = "true";
            }
            else if(tcontProfile["tcont-sharing-enum"] == "uni"){
                tcontProfile["queue-sharing"] = "false";
            }
        }
    }
    return tcontProfile;
}

AltiplanoUtilities.prototype.convertEthernetXXXCardTypeToPortSpeed = function(cardType) {
    if (cardType == "Ethernet-100M") {
        return "eth-if-speed-100mb";
    } else if (cardType == "Ethernet-1G") {
        return "eth-if-speed-1gb";
    } else if (cardType == "Ethernet-2.5G") {
        return "eth-if-speed-2.5gb";
    } else if (cardType == "Ethernet-5G") {
        return "eth-if-speed-5gb";
    } else if (cardType == "Ethernet-10G") {
        return "eth-if-speed-10gb";
    } else if (cardType == "Ethernet-25G") {
        return "eth-if-speed-25gb";
    } else if (cardType == "Ethernet-40G") {
        return "eth-if-speed-40gb";
    } else if (cardType == "Ethernet-100G") {
        return "eth-if-speed-100gb";
    }
    return null;
}

AltiplanoUtilities.prototype.validateSpeedProfiles = function(intentConfigArgs, onuTemplate, ontSpeedProfiles, fiberName) {
    if (ontSpeedProfiles) {
        var isTdpSpeedOntLevel;
        var isTdpSpeedUniLevel;
        var isTcontShared;
        if (ontSpeedProfiles && intentConfigArgs && intentConfigArgs["ont-speed-profile"] && intentConfigArgs["ont-speed-profile"] != "") {
            ontSpeedProfiles.forEach(function(speedProfiles) {
                if (speedProfiles && speedProfiles["name"] && speedProfiles["name"] == intentConfigArgs["ont-speed-profile"] && speedProfiles["traffic-descriptor-profile-id"]  && speedProfiles["traffic-descriptor-profile-id"] != "") {
                    isTdpSpeedOntLevel = true;
                }
            })
        }

        if (ontSpeedProfiles && intentConfigArgs && intentConfigArgs['uni-service-configuration']) {
            Object.keys(intentConfigArgs["uni-service-configuration"]).forEach(function (port) {
                if (intentConfigArgs["uni-service-configuration"][port] && intentConfigArgs["uni-service-configuration"][port]["uni-speed-profile"]) {
                    ontSpeedProfiles.forEach(function(speedProfiles) {
                        if (speedProfiles && speedProfiles["name"] && speedProfiles["name"] == intentConfigArgs["uni-service-configuration"][port]["uni-speed-profile"] && speedProfiles["traffic-descriptor-profile-id"]  && speedProfiles["traffic-descriptor-profile-id"] != "") {
                            isTdpSpeedUniLevel = true;
                        }
                    })
                }
            })
        }
        if (!isTdpSpeedOntLevel && !isTdpSpeedUniLevel){
            return;
        }
        if (onuTemplate && onuTemplate["service"] && ontSpeedProfiles && intentConfigArgs && intentConfigArgs['uni-service-configuration']) {
            var tcontProfiles =  this.convertToTcontQueueSharingFromTcontSharingEnum(xponUtils.getTcontProfiles(fiberName));
            Object.keys(intentConfigArgs["uni-service-configuration"]).forEach(function (port) {
                onuTemplate["service"].forEach(function (service) {
                    if (tcontProfiles && intentConfigArgs["uni-service-configuration"][port]["uni-id"] == service["uni-id"] && service["tcont-config"] && service["tcont-config"].length > 0) {
                        service["tcont-config"].forEach(function (tcontConfig) {
                            tcontProfiles.forEach(function (tcontProfile) {
                                if(tcontProfile["name"] === tcontConfig["tcont-profile-id"]) {
                                    if ((isTdpSpeedOntLevel && tcontProfile["tcont-sharing"] == "true" && tcontProfile["queue-sharing"] == "true") || (isTdpSpeedUniLevel && tcontProfile["tcont-sharing"] == "true" && tcontProfile["queue-sharing"] == "false")) {
                                        isTcontShared = true;
                                    }
                                }
                            })
                        })
                    }
                })
            })
        }
        if (!isTcontShared) {
            if (isTdpSpeedOntLevel) {
                throw new RuntimeException("At least one UNI should have TCONT sharing and Queue sharing when using speed with Traffic Descriptor profile at ONT level");
            }
            if (isTdpSpeedUniLevel) {
                throw new RuntimeException("At least one UNI should have TCONT sharing without Queue sharing when using speed with Traffic Descriptor profile at UNI level");
            }
        }
    }
}

AltiplanoUtilities.prototype.getQueueModel = function(deviceID, channelPartitionName, resource) {
    if (!deviceID || !channelPartitionName || !resource) {
        return null;
    }
    var templateArgs = {
        deviceID: deviceID,
        channelPartitionName: channelPartitionName
    };
    
    try {
        var extractedNode = this.getExtractedDeviceSpecificDataNode(resource, templateArgs);
        if (extractedNode) {
            var dataPath = "if:interfaces/if:interface/bbf-qos-tm:tm-root/bbf-qos-tm:tc-id-2-queue-id-mapping-profile-name";
            return apUtils.getNodeValue(extractedNode, dataPath, apUtils.prefixToNsMap);
        } else {
            throw new RuntimeException("NetConf Response is NULL or Response is timed out")
        }
    } catch (e) {
        logger.error("Error while getting queue model from channel partition {}", e);
    }
    return null;
}

AltiplanoUtilities.prototype.computeTcontForOntSpeedControl = function(speedProfiles, fiberName, xponType, ontName, deviceName, intentConfigJson, onuTemplate, onuServiceProfiles, uniServiceProfiles) {
    // Compute Tcont for speed profiles
    var tcontSpeedList = [];
    var listTcontComputed = [];
    var result = {};
    var params = {
        fiberName: fiberName,
        xponType: xponType,
        ontName: ontName,
        deviceName: deviceName,
        deviceType: apUtils.getNodeTypefromEsAndMds(deviceName),
        dynamicId: "allocId",
        dynamicType: "ALLOC",
    };
    var services = onuTemplate["service"];
    if (speedProfiles && intentConfigJson && intentConfigJson["ont-speed-profile"]){
        speedProfiles.forEach(function (speedProfile) {
            if (speedProfile["name"] == intentConfigJson["ont-speed-profile"] && speedProfile["traffic-descriptor-profile-id"] && speedProfile["traffic-descriptor-profile-id"] && services && services[0] && services[0]["tcont-config"]) {
                services[0]["tcont-config"].forEach(function (tcontConfig) {
                    var tcontName = ["TCONT", ontName, tcontConfig["tcont-profile-id"]].join("_");
                    if (listTcontComputed.indexOf(tcontName) == -1) {
                        tcontSpeedList.push({
                            name: tcontName,
                            tdpId: speedProfile["traffic-descriptor-profile-id"],
                            virtualAniInterfaceName: ontName
                        });
                        listTcontComputed.push(tcontName);
                    }
                })
            }
        })
    } else if (speedProfiles && onuServiceProfiles && intentConfigJson && intentConfigJson["onu-service-profile"]){
        var onuServiceProfile;
        for(var index in onuServiceProfiles){
            if(onuServiceProfiles[index].name == intentConfigJson["onu-service-profile"]){
                onuServiceProfile = onuServiceProfiles[index];
                break;
            }
        }
        speedProfiles.forEach(function (speedProfile) {
            if (onuServiceProfile && onuServiceProfile["speed-profile-ref"] && speedProfile["name"] == onuServiceProfile["speed-profile-ref"] && speedProfile["traffic-descriptor-profile-id"] && speedProfile["traffic-descriptor-profile-id"] && services && services[0] && services[0]["tcont-config"]) {
                services[0]["tcont-config"].forEach(function (tcontConfig) {
                    var tcontName = ["TCONT", ontName, tcontConfig["tcont-profile-id"]].join("_");
                    if (listTcontComputed.indexOf(tcontName) == -1) {
                        tcontSpeedList.push({
                            name: tcontName,
                            tdpId: speedProfile["traffic-descriptor-profile-id"],
                            virtualAniInterfaceName: ontName
                        });
                        listTcontComputed.push(tcontName);
                    }
                })
            }
        })
    }
    
    if (speedProfiles && intentConfigJson && intentConfigJson["uni-service-configuration"]){
        var potsPorts = requestScope.get().get("potsPorts");
        Object.keys(intentConfigJson["uni-service-configuration"]).forEach(function (port) {
            if (intentConfigJson["uni-service-configuration"][port] && intentConfigJson["uni-service-configuration"][port]["uni-id"] && (intentConfigJson["uni-service-configuration"][port]["uni-speed-profile"])) {
                if (!(potsPorts && potsPorts.length > 0 && potsPorts.indexOf(intentConfigJson["uni-service-configuration"][port]["uni-id"]) > -1)) {
                    var tdpIdUni = null;
                    if (intentConfigJson["uni-service-configuration"][port]["uni-speed-profile"]) {
                        speedProfiles.forEach(function (speedProfile) {
                            if (speedProfile["name"] && speedProfile["traffic-descriptor-profile-id"] && speedProfile["name"] == intentConfigJson["uni-service-configuration"][port]["uni-speed-profile"]){
                                tdpIdUni = speedProfile["traffic-descriptor-profile-id"];
                            }
                        })
                    }
                    if (tdpIdUni && services) {
                        services.forEach(function (service) {
                            if (intentConfigJson["uni-service-configuration"][port]["uni-id"] == service["uni-id"] && service["tcont-config"] && service["tcont-config"].length > 0) {
                                service["tcont-config"].forEach(function (tcontConfig) {
                                    var isExistTcont = false;
                                    var tcontName = ["TCONT", ontName, intentConfigJson["uni-service-configuration"][port]["uni-id"], tcontConfig["tcont-profile-id"]].join("_");
                                    tcontSpeedList.forEach(function(tcontSpeed) {
                                        if (tcontSpeed && tcontSpeed.name == tcontName) {
                                            isExistTcont = true;
                                        }
                                    });
                                    if (!isExistTcont) {
                                        tcontSpeedList.push({
                                            name: tcontName,
                                            tdpId: tdpIdUni,
                                            virtualAniInterfaceName: ontName
                                        });
                                    }
                                })
                            }
                        });
                    }
                }
            } else if (intentConfigJson["uni-service-configuration"][port] && intentConfigJson["uni-service-configuration"][port]["uni-id"] && !(intentConfigJson["uni-service-configuration"][port]["uni-speed-profile"]) && uniServiceProfiles){
                var uniServiceProfile;
                for(var indexUni in uniServiceProfiles){
                    if(uniServiceProfiles[indexUni].name == intentConfigJson["uni-service-configuration"][port]["service-profile"]){
                        uniServiceProfile = uniServiceProfiles[indexUni];
                        break;
                    }
                }
                if (!(potsPorts && potsPorts.length > 0 && potsPorts.indexOf(intentConfigJson["uni-service-configuration"][port]["uni-id"]) > -1)) {
                    var tdpIdUni = null;
                    if (uniServiceProfile["speed-profile-ref"]) {
                        speedProfiles.forEach(function (speedProfile) {
                            if (uniServiceProfile && uniServiceProfile["speed-profile-ref"] && speedProfile["name"] && speedProfile["name"] == uniServiceProfile["speed-profile-ref"] && speedProfile["traffic-descriptor-profile-id"]) {
                                tdpIdUni = speedProfile["traffic-descriptor-profile-id"];
                            }
                        })
                    }
                    if (tdpIdUni && services) {
                        services.forEach(function (service) {
                            if (intentConfigJson["uni-service-configuration"][port]["uni-id"] == service["uni-id"] && service["tcont-config"] && service["tcont-config"].length > 0) {
                                service["tcont-config"].forEach(function (tcontConfig) {
                                    var isExistTcont = false;
                                    var tcontName = ["TCONT", ontName, intentConfigJson["uni-service-configuration"][port]["uni-id"], tcontConfig["tcont-profile-id"]].join("_");
                                    tcontSpeedList.forEach(function(tcontSpeed) {
                                        if (tcontSpeed && tcontSpeed.name == tcontName) {
                                            isExistTcont = true;
                                        }
                                    });
                                    if (!isExistTcont) {
                                        tcontSpeedList.push({
                                            name: tcontName,
                                            tdpId: tdpIdUni,
                                            virtualAniInterfaceName: ontName
                                        });
                                    }
                                })
                            }
                        })
                    }
                }
            }
        });
    }
    apUtils.getDynamicIdsForList(tcontSpeedList, null, params, null, true);
    result = apUtils.convertJsonArrayToKeyValueJSONObjects(tcontSpeedList, "name");
    return result;
}

/**
 * The function retrieves the internal uplink port name based on caps for ihub and non ihub device types
 * 
 * @param {*} uplinkPortName 
 * @param {*} deviceName 
 * @returns 
 */

AltiplanoUtilities.prototype.getInternalUplinkPortName =function(uplinkPortName, deviceName){
    var uplinkPortNameInternal;
    var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
    var isIHUBSupported = apUtils.isIhubSupportedFamilyType(nodeType);
    
    if(isIHUBSupported){
        var ihubDeviceName = deviceName + intentConstants.DOT_LS_IHUB;
        var ihubType = apUtils.getNodeTypefromEsAndMds(ihubDeviceName);
        var ihubdeviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(ihubType);
        uplinkPortNameInternal = apCapUtils.getCapabilityValue(ihubdeviceTypeAndRelease.hwType, ihubdeviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_INTERNAL_NAME, uplinkPortName)[0];
     }else{
        var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
        uplinkPortNameInternal = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_UPLINK_PORT_NAME, uplinkPortName)[0];
        uplinkPortNameInternal = uplinkPortNameInternal.replace("_PORT", "")
    }

    return uplinkPortNameInternal;

}


AltiplanoUtilities.prototype.getUplinkPortName =function(uplinkPortNameInternal, deviceName){
    var uplinkPort;
    var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
    var isIHUBSupported = apUtils.isIhubSupportedFamilyType(nodeType);
    
    if(isIHUBSupported){
        var ihubDeviceName = deviceName + intentConstants.DOT_LS_IHUB;
        var ihubType = apUtils.getNodeTypefromEsAndMds(ihubDeviceName);
        var ihubdeviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(ihubType);
        var portMappingJson = apCapUtils.getCapabilityCategory(ihubdeviceTypeAndRelease.hwType, ihubdeviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY);
        if(portMappingJson){
            var matchFound = false;
            if(!matchFound){
                for (var i = 0; i < portMappingJson.length; i++) {
                    var portMappingInternalName = apCapUtils.getCapabilityValue(ihubdeviceTypeAndRelease.hwType, ihubdeviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_INTERNAL_NAME, portMappingJson[i], false);
                    if(nodeType.startsWith(intentConstants.LS_FX_PREFIX) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LANT_A) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LBNT_A_MF14_LMFS_A)){
                        var plannedTypesFromDevice = nodeType.startsWith(intentConstants.LS_FX_PREFIX) ? apUtils.getBoardTypeFromDevice(deviceName, intentConstants.INTENT_TYPE_DEVICE_FX) : apUtils.getBoardTypeFromDevice(deviceName, intentConstants.INTENT_TYPE_DEVICE_MF);
                        if(plannedTypesFromDevice){
                            var boardPlannedTypes = [];
                            Object.keys(plannedTypesFromDevice).forEach(function (board) {
                                if (board.startsWith(intentConstants.NTIO_STRING) || board.startsWith(intentConstants.LTIO_STRING)) {
                                    boardPlannedTypes.push(plannedTypesFromDevice[board]["planned-type"]);
                                }
                            });
                            var uplinkPortGroup = apCapUtils.getCapabilityValue(ihubdeviceTypeAndRelease.hwType, ihubdeviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_GROUP, portMappingJson[i], false);
                            if (uplinkPortGroup && (uplinkPortGroup[0].startsWith(intentConstants.FNIO_STRING) || uplinkPortGroup[0].startsWith(intentConstants.LTIO_STRING) || uplinkPortGroup[0].startsWith(intentConstants.NTIO_STRING))) {
                                var isGroupMatch = false;
                                var plannedType = uplinkPortGroup[0].substring(0, (uplinkPortGroup[0].indexOf("-") + 2));
                                boardPlannedTypes.forEach(function (boardPlannedType) {
                                    if (boardPlannedType.startsWith(plannedType)) {
                                        isGroupMatch = true;
                                        return;
                                    }
                                });
                            }
                            if (uplinkPortGroup && nodeType.startsWith(intentConstants.LS_FX_PREFIX) && !uplinkPortGroup[0].startsWith(intentConstants.FNIO_STRING)) {
                                isGroupMatch = undefined
                            }
                            if(nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LANT_A) || nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_MF_LBNT_A_MF14_LMFS_A)){
                                var deprecated = apCapUtils.getCapabilityValue(ihubdeviceTypeAndRelease.hwType, ihubdeviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_DEPRECATE, portMappingJson[i], false);
                                if(deprecated){
                                    isGroupMatch = false;
                                }
                            }
                        }
                    }
                    if(uplinkPortNameInternal == portMappingInternalName && (isGroupMatch === undefined || isGroupMatch)){
                        uplinkPort = portMappingJson[i];
                        matchFound = true; 
                        break;
                    }                   
                }
            }
        }
        }else{
            var deviceTypeAndRelease = apUtils.splitToHardwareTypeAndVersion(nodeType);
            uplinkPortNameInternal = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_UPLINK_PORT_NAME, uplinkPortName)[0];
            uplinkPortNameInternal = uplinkPortNameInternal + "_PORT";
            var portMappingJson = apCapUtils.getCapabilityCategory(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY);
            if(portMappingJson){
                var matchFound = false;
                if(!matchFound){
                    for (var i = 0; i < portMappingJson.length; i++) {
                        var portMappingInternalName = apCapUtils.getCapabilityValue(deviceTypeAndRelease.hwType, deviceTypeAndRelease.release, capabilityConstants.PORT_MAPPING_CATEGORY, capabilityConstants.PORT_MAPPING_UPLINK_PORT_NAME, portMappingJson[i], false);
                        if(uplinkPortNameInternal == portMappingInternalName){
                            uplinkPort = portMappingJson[i];
                            matchFound = true; 
                            break;
                        }                   
                    }
                }
            }
    }
    return uplinkPort;

}


/**
 * The function checks is the mirroring instance exist or not in the device
 * 
 * @param {*} ihubDeviceName 
 * @param {*} uplinkport 
 * @returns boolean
 */

AltiplanoUtilities.prototype.isMirroringInstanceExist = function(ihubDeviceName, uplinkport){
    var internalLsResourcePrefix = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR;
    var extractedNode = apUtils.getExtractedDeviceSpecificDataNode(internalLsResourcePrefix + "getMirrorDestinationInfomation.xml.ftl", { "deviceID": ihubDeviceName });
    var captureVlanIDPath = 'conf:configure/conf:mirror/conf:mirror-dest/conf:service-name';
    if (extractedNode) {
        var captureVlanID = apUtils.getNodeValue(extractedNode, captureVlanIDPath, apUtils.prefixToNsMap);
        if(captureVlanID){
            var mirrorDestInterfacePath = "conf:configure/conf:mirror/conf:mirror-dest[conf:service-name=\'" + captureVlanID + "\']/conf:sap/conf:sap-id";
            var mirrorDestInterface = apUtils.getNodeValue(extractedNode, mirrorDestInterfacePath, apUtils.prefixToNsMap);
            if(mirrorDestInterface){
                var portName = mirrorDestInterface.substring(0, mirrorDestInterface.lastIndexOf(":"));
                if(portName == uplinkport){
                    return true;
                }
            }
        }
    }
    return false;
}

/**
 * The function checks is the mirroring instance exist or not in the device for non-ihub
 * @param {*} nonihubDeviceName
 * @returns boolean
 */

AltiplanoUtilities.prototype.isMirroringInstanceExistNonIhub = function(nonihubDeviceName){
    var mirrorValue = true;
    var templateArgs = {
        "deviceID": nonihubDeviceName
    }
    var internalLsResourcePrefix = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR;
    var extractedNode =  apUtils.getExtractedDeviceSpecificDataNode(internalLsResourcePrefix + "getMirrorInfomation.xml.ftl", templateArgs);
    if (extractedNode) {
        var mirrorDestInterfacePath = "if:interfaces/if:interface/if:name[starts-with(.,'MIRROR_DEST')]";
        var mirrorDestInterface = apUtils.getNodeValue(extractedNode, mirrorDestInterfacePath, this.prefixToNsMap);
        if (mirrorDestInterface && mirrorDestInterface.length > 0) {
            return mirrorValue;
        } else {
            return false;
        }  
    }
}


/**
 * The function retrieves the mirror Service name
 * 
 * @param {*} ihubDeviceName 
 * @param {*} uplinkport 
 * @returns boolean
 */

AltiplanoUtilities.prototype.removeFilterAndGetMirrorServiceName = function(ihubDeviceName){
    var mirrorSvcName;
    var internalLsResourcePrefix = intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + intentConstants.DIRECTORY_LIGHTSPAN + intentConstants.FILE_SEPERATOR;
    var extractedNode = apUtils.getExtractedDeviceSpecificDataNode(internalLsResourcePrefix + "getMirrorDestinationInfomation.xml.ftl", { "deviceID": ihubDeviceName });
    var captureVlanIDPath = 'conf:configure/conf:mirror/conf:mirror-dest/conf:service-name';
    if (extractedNode) {
        var captureVlanID = apUtils.getNodeValue(extractedNode, captureVlanIDPath, apUtils.prefixToNsMap);
        if(captureVlanID){    
            var mirrorDestInterfacePath = "conf:configure/conf:mirror/conf:mirror-dest[conf:service-name=\'" + captureVlanID + "\']/conf:sap/conf:sap-id";
            var mirrorDestInterface = apUtils.getNodeValue(extractedNode, mirrorDestInterfacePath, apUtils.prefixToNsMap);
            if(mirrorDestInterface){
                var templateArgs = {
                    deviceID: ihubDeviceName,
                    mirrorDestName: captureVlanID,
                    mirrorDestInterfaceName: mirrorDestInterface
                    
                }
                var resourceName = internalLsResourcePrefix + "removeDestinationFilter.xml.ftl";
                var requestTemplate = resourceProvider.getResource(resourceName);
        
                var requestXml = utilityService.replaceVariablesInXmlTemplate(requestTemplate, templateArgs);
                var ncResponse = requestExecutor.execute(templateArgs.deviceID, requestXml);
                 
                if (ncResponse == null || ncResponse.trim().isEmpty() || !ncResponse.contains("<ok/>")) {
                    throw new RuntimeException("Error while deleting the packet capture destination sap filter");   
                }else{
                    mirrorSvcName = captureVlanID;
                    return mirrorSvcName;
                }
                
            }
                
        }                
    }
    
}

/**
 * This method used to convert the given JS XML to JSON format 
 *
 * @param intentConfigXml
 * @param listObjectMapper
 * @param json
 * @param choiceArray null
 * @param containers List of container names in order of the composite intents
 * @param localNameExpected the local name will start to collect data 
 *   <configuration xmlns="http://www.nokia.com/management-solutions/ibn">
 *           <ont-type>twoPotsFourDataPorts</ont-type>
 *           <onu-service-profile>default</onu-service-profile>
 *           <pon-type>gpon</pon-type>
 *           <expected-serial-number>ALCL90124411</expected-serial-number>
 *           <pots-service-profile>default</pots-service-profile>
 *           <fiber-name>FiberMF</fiber-name>
 *           <uni-service-configuration>
 *               <uni-id>LAN1</uni-id>
 *               <service-profile>default</service-profile>
 *           </uni-service-configuration>
 *           <uni-service-configuration>
 *               <uni-id>LAN2</uni-id>
 *               <service-profile>default</service-profile>
 *           </uni-service-configuration>
 *       </subscriber>
 *       <residential-internet xmlns="http://www.nokia.com/management-solutions/residential-internet">
 *           <l2-infra>RBC300</l2-infra>
 *           <service-profile>HSI-100M-10M</service-profile>
 *           <uni-id>LAN1</uni-id>
 *           <untagged/>
 *           <service-name>HSI</service-name>
 *       </residential-internet>
 *   </configuration>
 * Result: 
 * {
 *   "subscriber": {
 *       "EMPTY-LEAFS": [],
 *       "ont-type": "twoPotsFourDataPorts",
 *       "onu-service-profile": "default",
 *       "pon-type": "gpon",
 *       "expected-serial-number": "ALCL90124411",
 *       "pots-service-profile": "default",
 *       "fiber-name": "FiberMF"
 *   },
 *   "residential-internet": {
 *       "EMPTY-LEAFS": [
 *       "untagged"
 *       ],
 *       "l2-infra": "RBC300",
 *       "service-profile": "HSI-100M-10M",
 *       "uni-id": "LAN1",
 *       "untagged": "",
 *       "service-name": "HSI"
 *   }
 * }
 */
 AltiplanoUtilities.prototype.convertCompositeIntentConfigXmlToJsonWithMutlipleContainers = function (intentConfigXml, listObjectMapper, choiceArray, containers, localNameExpected) {
    var result = {};
    // /configuration/intent-type-namespace-prefix:intent-type-name
    for (var index = 0; index < containers.length; index++) {
        var json = {};
        var indexContainer = index + 1;
        try {
            if (localNameExpected) {
                var intentSpecificData = "//*[local-name()='" + localNameExpected + "']/*[" + indexContainer + "]";
            } else if (typeof intentConfigXml === "string") {
                var intentSpecificData = "//*[local-name()='intent-specific-data']/*[" + indexContainer + "]";
            } else {
                var intentSpecificData = "//*[local-name()='configuration']/*[" + indexContainer + "]";
            }
            configRoot = utilityService.extractSubtree(intentConfigXml, {}, intentSpecificData);
        } catch (e) {
            //logger.error("Error while parsing the intent-specific-data : {}", e);
            throw new RuntimeException("configuration or intent-specific-data node not present in the intent configuration");
        }
        json["EMPTY-LEAFS"] = [];
        if (configRoot != null && configRoot.hasChildNodes()) {
            var rootChildren = configRoot.getChildNodes();
            for (var i = 0; i < rootChildren.getLength(); i++) {
                var child = rootChildren.item(i);
                if (child.getNodeType() == 1) { // Element Node
                    if (child.getChildNodes().getLength() === 0) {
                        if (choiceArray && choiceArray.indexOf(child.getLocalName()) > -1) {
                            json[child.getLocalName()] = child.getLocalName();
                        } else {
                            json[child.getLocalName()] = "";
                        }
                        json["EMPTY-LEAFS"].push(child.getLocalName()); // Add to handle multiple empty leaf in the choice.
                    } else if (child.getChildNodes().getLength() == 1 && child.getChildNodes().item(0).getNodeType() == 3) {
                        // Text Node - Direct Leafs.
                        if (typeof listObjectMapper === "function") {
                            var listKey = listObjectMapper(child.getLocalName());
                            if (listKey == "yang:leaf-list") {
                                if (json[child.getLocalName()]) {
                                    json[child.getLocalName()].push(child.getTextContent());
                                } else {
                                    json[child.getLocalName()] = [child.getTextContent()];
                                }
                            } else {
                                json[child.getLocalName()] = child.getTextContent();
                            }
                        } else {
                            json[child.getLocalName()] = child.getTextContent();
                        }
                    }
                    if (child.hasChildNodes() && typeof listObjectMapper === "function") {
                        var key = listObjectMapper(child.getLocalName());
                        if (key != null) { // Known List.
                            var listInstance = {};
                            var listChildren = child.getChildNodes();
                            for (var j = 0; j < listChildren.getLength(); j++) {
                                var listLeaf = listChildren.item(j);
                                if (listLeaf.getNodeType() == 1) {
                                    // Element Node
                                    if (listLeaf.getChildNodes().getLength() == 1 && listLeaf.getChildNodes().item(0).getNodeType() == 3) {
                                        // We only support leafs,leaf-list inside list.
                                        var listKey = listObjectMapper(listLeaf.getLocalName());
                                        if (listKey == "yang:list#leaf-list") {
                                            if (listInstance[listLeaf.getLocalName()]) {
                                                listInstance[listLeaf.getLocalName()].push(listLeaf.getTextContent());
                                            } else {
                                                listInstance[listLeaf.getLocalName()] = [listLeaf.getTextContent()];
                                            }
                                        } else {
                                            listInstance[listLeaf.getLocalName()] = listLeaf.getTextContent();
                                        }
                                    } else if (listLeaf.hasChildNodes()) {
                                        // we will be supporting the second level list which is the child of the first list
                                        var key2 = listObjectMapper(listLeaf.getLocalName());
                                        if (key2) {
                                            var listInstance2 = {};
                                            var listChildren2 = listLeaf.getChildNodes();
                                            for (var k = 0; k < listChildren2.getLength(); k++) {
                                                var listLeaf2 = listLeaf.item(k);
                                                if (listLeaf2.getNodeType() == 1 && listLeaf2.getChildNodes().getLength() == 1 && listLeaf2.getChildNodes().item(0).getNodeType() == 3) {
                                                    var listKey2 = listObjectMapper(listLeaf2.getLocalName());
                                                    if (listKey2 == "yang:list#leaf-list") {
                                                        if (listInstance2[listLeaf2.getLocalName()]) {
                                                            listInstance2[listLeaf2.getLocalName()].push(listLeaf2.getTextContent());
                                                        } else {
                                                            listInstance2[listLeaf2.getLocalName()] = [listLeaf2.getTextContent()];
                                                        }
                                                    } else {
                                                        listInstance2[listLeaf2.getLocalName()] = listLeaf2.getTextContent();
                                                    }
                                                }
                                            }
                                            if (typeof listInstance[listLeaf.getLocalName()] === "undefined") {
                                                listInstance[listLeaf.getLocalName()] = {};
                                            }
                                            if (!(typeof key2 === "string")) { //expected array
                                                var dataString2 = [];
                                                for (var index2 = 0; index2 < key2.length; index2++) {
                                                    dataString2.push(listInstance2[key2[index2]]);
                                                }
                                                listInstance[listLeaf.getLocalName()][dataString2.join("#")] = listInstance2; //handle case multiple optional key
                                            } else {
                                                listInstance[listLeaf.getLocalName()][listInstance2[key2]] = listInstance2;
                                            }
                                        }
                                    }
                                }
                            }
                            if (typeof json[child.getLocalName()] === "undefined") {
                                json[child.getLocalName()] = {};
                            }
                            if (!(typeof key === "string")) { //expected array
                                var dataString = [];
                                for (var index3 = 0; index3 < key.length; index3++) {
                                    dataString.push(listInstance[key[index3]]);
                                }
                                json[child.getLocalName()][dataString.join("#")] = listInstance; //handle case multiple optional key
                            } else {
                                json[child.getLocalName()][listInstance[key]] = listInstance;
                            }
                        }
                    }
                }
            }
        }
        result[containers[index]] = json;
    }
    return result;
};

/**
 * Update error messages from object format to string format
 * @param {Object} contextErrorObj 
 * @param {Boolean} isMultipleLine true if want the error show multiple line
 */

AltiplanoUtilities.prototype.updateErrorMessages = function (contextErrorObj, isMultipleLine) {
    if (!apUtils.ifObjectIsEmpty(contextErrorObj)) {
        let errors = [];
        for (let error in contextErrorObj) {
            errors.push(contextErrorObj[error])
        }
        if (errors.length > 0) {
            if (isMultipleLine) {
                if (errors.length > 1) {
                    return "<br>" + errors.join("<br>");
                } 
                return errors.join("<br>");
            } else {
                return errors.join(". ");
            }
        }
    }
    return null
}

/**
 * The function update profile System Load Profiles and Memory Use Profiles
 * 
 * @param {*} profileFromHwLayout 
 * @param {*} profileName 
 * @param {*} profileDetails 
 * @param {*} baseArgs 
 */

AltiplanoUtilities.prototype.updateProfilesFromONTHWLayout = function (profileFromHwLayout, profileName, profileDetails, baseArgs) {
    for (var templateName in profileFromHwLayout) {
        var profileValue = profileFromHwLayout[templateName];
        if (!baseArgs[profileName][templateName]) {
            baseArgs[profileName][templateName] = {};
            if (profileDetails && profileDetails[profileValue]) {
                baseArgs[profileName][templateName][profileDetails[profileValue].name] = profileDetails[profileValue];
            }
        } else {
            if (!baseArgs[profileName][templateName][profileValue]) {
                if (profileDetails && profileDetails[profileValue]) {
                    baseArgs[profileName][templateName][profileDetails[profileValue].name] = profileDetails[profileValue];
                }
            }
        }
    }
}


/**
 * The function generate a new profile name when its length exceed the MAX length
 * 
 * @param String profileName 
 * @param number maxNameLength 
 * @Result String
 */

AltiplanoUtilities.prototype.calculateNewProfileName = function (profileName, maxNameLength) {
    var sumValue = 0;
    if (profileName.length > maxNameLength) {
        var nameLength = profileName.length;
        for (var index = nameLength-1; index >= 0; index--) {
            var value = profileName.charCodeAt(index);
            sumValue = sumValue * 67 + value;
            if (sumValue > 999999) {
                sumValue = sumValue % 100000;
            }
        }
        var postfix = (Array(6).join(0) + sumValue).slice(-6);
        var outputName = profileName.substring(0,maxNameLength-7)+"_" + postfix;
        return outputName;
    }
    else {
        return profileName;
    }
}

/**
 * The function is to check if profile is created in migration
 * 
 * @param String newProfileName 
 * @param String oldProfileName 
 * @Result Boolean
 */

AltiplanoUtilities.prototype.isMigratedNewProfile = function (newProfileName, oldProfileName) {
    let slicingMaxNameLength = 61;
    let nonSlicingMaxNameLength = 64;
    let tempProfileName = oldProfileName+"_net";
    if(tempProfileName === newProfileName){
        return true;
    }
    let tempProfileName1 = this.calculateNewProfileName(tempProfileName, slicingMaxNameLength);
    let tempProfileName2 = this.calculateNewProfileName(tempProfileName, nonSlicingMaxNameLength);
    if(tempProfileName1 === newProfileName || tempProfileName2 === newProfileName){
        return true;
    }
    return false;
}

/**
 * The function used to get profile params by usiing device params
 *
 * @param {*} profileparam
 */
AltiplanoUtilities.prototype.getDeviceParamByProfileParam = function (profileparam) {
   var deviceparam;
   switch (profileparam) {
       case "bestEffort":
           deviceparam = 0;
           break;
       case "background":
           deviceparam = 1;
           break;
       case "spare":
           deviceparam = 2;
           break;
       case "excellentEffort":
           deviceparam = 3;
           break;
       case "controlledLoad":
           deviceparam = 4;
           break;
       case "videoLessThan100msLatencyAndJitter":
           deviceparam = 5;
           break;
       case "videoLessThan10msLatencyAndJitter":
           deviceparam = 6;
           break;
       case "networkControl":
           deviceparam = 7;
           break;
   }
   return deviceparam;
}

AltiplanoUtilities.prototype.configRadiusOperProfile = function(baseArgs, deviceDetails, intentConfigJson, lastIntentConfigFromTopo, profilesJsonMap, currentIntentOperation) {
    baseArgs["currentIntentOperation"] = currentIntentOperation;
    var cleanUpRadius;
    var resourcePath = "internal/lightspan/getExistingUsers.xml.ftl";
    var templateArgs = {
        deviceID: baseArgs["deviceID"]
    };
    var extractedXpath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + baseArgs["deviceID"] + "\']";
    var extractedNode = apUtils.getExtractedNodeFromResponse(resourcePath, templateArgs, extractedXpath, apUtils.prefixToNsMap);
    if (extractedNode) {
        var datapath = "adh:device-specific-data/nokia-aaa:users/nokia-aaa:user/nokia-aaa:name";
        var currentUsersList = apUtils.getAttributeValues(extractedNode, datapath, apUtils.prefixToNsMap);
        var validUser = [];
        if(currentUsersList ){
            currentUsersList.forEach((user, index) => {
                validUser.push(user) 
            });
        }
        baseArgs["validUser"] = validUser;
    }
    
    if (intentConfigJson["configuration-profile"] && baseArgs["operation"] != "remove") {
        var configurationProfilesObject = apUtils.getIntentAttributeObjectValues("intent-attributes.json", "configuration-profile", "name", intentConfigJson["configuration-profile"], deviceDetails);
        var radiusOperatorAuthenticationProfileId = configurationProfilesObject["radius-operator-authentication-profile-id"];
        var radiusOperatorAuthenticationProfileList = profilesJsonMap["radius-operator-authentication-profile"];
        if (radiusOperatorAuthenticationProfileList && radiusOperatorAuthenticationProfileId) {
            radiusOperatorAuthenticationProfileList.forEach(function (radiusOperatorAuthenticationProfile) {
                if (radiusOperatorAuthenticationProfileId === radiusOperatorAuthenticationProfile.name) {
                    baseArgs["radius-operator-authentication-profile"] = radiusOperatorAuthenticationProfile;
                    if (radiusOperatorAuthenticationProfile["users"]) {
                        var userList = [];
                        radiusOperatorAuthenticationProfile["users"].forEach(function (radiusOperatorUsers) {
                             userList.push(radiusOperatorUsers);
                        })
                        userList = userList.filter((user) => {
                            if(baseArgs["username"] && (user.name == baseArgs["username"])) {
                                baseArgs["OAM-ext-auth-enabled"] = user["ext-auth-enabled"];
                            }else{
                                return user;
                            }
                        })
                        if(currentUsersList){
                            var inValidUser = [];
                            userList.forEach(function (user) {
                                if (currentUsersList.indexOf(user["name"]) == -1) {
                                    if (inValidUser.indexOf(user["name"]) == -1) {
                                        inValidUser.push(user["name"]);
                                    }
                                }
                            })
                            if (inValidUser.length > 0) {
                                throw new RuntimeException("In '" + radiusOperatorAuthenticationProfileId + "' profile name in RADIUS Operator Authentication Profile/LS-Operator profile, the users '" + inValidUser.join(", ") + "' specified  does not exist. Please ensure that the users are created in the device.");
                            }
                        }
                        var userObj = {};
                        userList.forEach(function(user){
                            userObj[user.name] = user
                        })
                        baseArgs["radiusOperatorUsers"] = userObj;
                    }
                    var radiusServerProfileId = radiusOperatorAuthenticationProfile["radius-server-profile-id"];
                    if (radiusServerProfileId) {
                        baseArgs["radiusServerProfileUsed"] = true;
                        var radiusServerProfileList = profilesJsonMap["radius-server-profile"];
                        if (radiusServerProfileList) {
                            radiusServerProfileList.forEach(function (radiusServerProfile) {
                                if (radiusServerProfileId === radiusServerProfile.name) {
                                    baseArgs["radius-server-policy-name"] = radiusServerProfile["policy"][0]["name"];
                                    baseArgs["auth-server-first"] = radiusServerProfile["policy"][0]["auth-server-first"];
                                    baseArgs["auth-server-second"] = radiusServerProfile["policy"][0]["auth-server-second"];
                                    baseArgs["nas-id"] = radiusServerProfile["policy"][0]["nas-id"];
                                    baseArgs["nas-ip-address"] = radiusServerProfile["policy"][0]["nas-ip-address"];
                                    baseArgs["cli-session-policy"] = radiusServerProfile["cli-session-policy"];
                                    var radiusServerProfileObj = {};
                                    for (var i = 0; i < radiusServerProfile["servers"].length; i++) {
                                        var radiusServer = radiusServerProfile["servers"][i];
                                        radiusServerProfileObj[radiusServer.name] = radiusServer;
                                    }
                                    baseArgs["shelf-radius-server-profile"] = radiusServerProfileObj;
                                }
                            })
                        }
                    }
                    if(radiusOperatorAuthenticationProfile["cli-system-config"]){
                        baseArgs["cli-system-config"] = radiusOperatorAuthenticationProfile["cli-system-config"];
                    }
                }
            });
        } else {
            cleanUpRadius = true;
        }
    } else {
        cleanUpRadius = true;
    }
    if (cleanUpRadius && currentIntentOperation != "audit"){
        var resourceFile = "internal/lightspan/cleanUpRadiusOperPolicy.xml.ftl";
        var templateArgs = {
            deviceID: baseArgs["deviceID"],
            isConfigExtAuthEnable: true
        };
        
        var resourcePath = "internal/lightspan/getExistingUsers.xml.ftl";
        var extractedXpath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + baseArgs["deviceID"] + "\']";
        var extractedNode = apUtils.getExtractedNodeFromResponse(resourcePath, templateArgs, extractedXpath, this.prefixToNsMap);
        var datapath = "adh:device-specific-data/nokia-aaa:users/nokia-aaa:user/nokia-aaa:name";
        if(extractedNode){
            var usedUserList = apUtils.getAttributeValues(extractedNode, datapath, this.prefixToNsMap);
            var usedUserArr = [];
            if(usedUserList ){
                usedUserList.forEach((user, index) => {
                    if (user != baseArgs["username"]) {
                        usedUserArr.push(user) 
                    }
                });
            }
            if(usedUserArr.length > 0){
                baseArgs["usedUserArr"] = usedUserArr;
            }
        }
        try {
            this.executeRequest(resourceFile, templateArgs);
        } catch (e) {
            logger.debug("Clean up execution failed with error: " + e);
        }
    }
}

AltiplanoUtilities.prototype.rollbackToSubsequentVersions = function(input, script, isMigateTopology) {
    var result;
    var rollbackHandler;
    let targetVersion = input.getTargetVersion();
    let arrMigrationPath = new ArrayList();
    arrMigrationPath.addAll(input.getMigrationPath());
    targetVersion = this.getUpdatedVersion(arrMigrationPath, targetVersion);
    if (!targetVersion){
        result = input;
    } else {
        input.setTargetVersion(targetVersion);
        var migrationPath = input.getMigrationPath();
        migrationPath.forEach(function (mpath) {
            var supportedVersion = mpath.getSupportedVersion();
            rollbackHandler = script[mpath.getRollbackHandler()];
            if (supportedVersion == targetVersion) {
                if (rollbackHandler != null) {
                    var response = rollbackHandler(input);
                    var migratedConfig = DocumentUtils.stringToDocumentElement(isMigateTopology ? response.getMigratedConfiguration() : response);
                    input.setIntentConfiguration(migratedConfig);
                    if (isMigateTopology){
                        input.setCurrentTopology(response.getUpdatedTopology());
                    }
                    result = input;
                } else {
                    result = input;
                }
            }
        });
    }
    return result;
}

AltiplanoUtilities.prototype.migrateToSubsequentVersions = function (input, resultStr, script, isMigateTopology) {
    var result;
    var migrationHandler;
    let sourceVersion = input.getSourceVersion();
    let arrMigrationPath = new ArrayList();
    arrMigrationPath.addAll(input.getMigrationPath());
    sourceVersion = this.getUpdatedVersion(arrMigrationPath, sourceVersion);
    if (!sourceVersion) {
        result = isMigateTopology ? new MigrationResult(resultStr, input.getCurrentTopology()) : resultStr;
        //always set these flags true here, modify them in migration handlers instead
        if (typeof result.setUseLatestProfileVersions == "function") {
            if (typeof input.isProfileUpdatesRequired == "function" && input.isProfileUpdatesRequired()) {
                result.setUseLatestProfileVersions(true)
            }
        }
        if (typeof result.setSkipTargetDevices == "function") {
            result.setSkipTargetDevices(true)
        }
    } else {
        var migratedConfig = DocumentUtils.stringToDocument(resultStr).getDocumentElement();
        input.setIntentConfiguration(migratedConfig);
        input.setSourceVersion(sourceVersion);
        var migrationPath = input.getMigrationPath();
        migrationPath.forEach(function (mpath) {
            var supportedVersion = mpath.getSupportedVersion();
            migrationHandler = script[mpath.getMigrationHandler()];
            if (supportedVersion == sourceVersion) {
                if (migrationHandler != null) {
                    result = migrationHandler(input);
                } else if (resultStr != null) {
                    result = isMigateTopology ? new MigrationResult(resultStr, input.getCurrentTopology()) : resultStr;
                    //always set these flags true here, modify them in migration handlers instead
                    if (typeof result.setUseLatestProfileVersions == "function") {
                        if (typeof input.isProfileUpdatesRequired == "function" && input.isProfileUpdatesRequired()) {
                            result.setUseLatestProfileVersions(true)
                        }
                    }
                    if (typeof result.setSkipTargetDevices == "function") {
                        result.setSkipTargetDevices(true)
                    }
                }
            }
        });
    }
    return result;
}

AltiplanoUtilities.prototype.getUpdatedVersion = function(arrMigrationPath, version){
    for (let i=0; i< arrMigrationPath.size(); i++){
        if (version === arrMigrationPath.get(i).getSupportedVersion()){
            if (arrMigrationPath.size() > (i + 1)){
                return arrMigrationPath.get(i+1).getSupportedVersion();
            }
        }
    }
}

AltiplanoUtilities.prototype.getSupportedVersionFromMigrationPath = function (arrMigrationPath) {
    var result = [];
    for (let i = 0; i < arrMigrationPath.size(); i++) {
        if (arrMigrationPath.get(i).getSupportedVersion()) {
            result.push(arrMigrationPath.get(i).getSupportedVersion())
        }
    }
    return result;
}

AltiplanoUtilities.prototype.getChildIntentRealizationResult = function (childIntentInfo) {
    var ChildIntentRealizationResult = Java.type('com.nokia.fnms.controller.ibn.intenttype.spi.ChildIntentRealizationResult');
    var IntentTypeTarget = Java.type('com.nokia.fnms.controller.ibn.intenttype.spi.IntentTypeTarget');
    var RequiredNetworkState = Java.type('com.nokia.fnms.controller.ibn.intenttype.spi.RequiredNetworkState');

    var networkState;
    if(childIntentInfo.networkState === intentConstants.NETWORK_STATE_ACTIVE) networkState = RequiredNetworkState.active;
    else if(childIntentInfo.networkState === intentConstants.NETWORK_STATE_SUSPEND) networkState = RequiredNetworkState.suspend;
    else if(childIntentInfo.networkState === intentConstants.NETWORK_STATE_DELETE) networkState = RequiredNetworkState.delete;
    else if(childIntentInfo.networkState === "custom") networkState = RequiredNetworkState.custom;
    
    var childIntentRealizationResult = new ChildIntentRealizationResult();
    childIntentRealizationResult.setIntentType(childIntentInfo.intentType);
    childIntentRealizationResult.setVersion(childIntentInfo.version);
    childIntentRealizationResult.setTarget(childIntentInfo.target);
    childIntentRealizationResult.setAllowDirectModification(childIntentInfo.allowDirectModification);
    childIntentRealizationResult.setIntentConfiguration(childIntentInfo.configXml);
    childIntentRealizationResult.setRequiredNetworkState(networkState);

    var dependOnInstanceList = new ArrayList();
    if(childIntentInfo.dependsOnInstance && childIntentInfo.dependsOnInstance.length > 0){
        for(var intentDependency of childIntentInfo.dependsOnInstance){
            var intentTypeTarget = new IntentTypeTarget(intentDependency.intentType, intentDependency.target);
            intentTypeTarget.setIntentTypeVersion(intentDependency.intentTypeVersion);
            dependOnInstanceList.add(intentTypeTarget);
        }
    }
    childIntentRealizationResult.setDependsOnInstance(dependOnInstanceList);

    return childIntentRealizationResult;
}

/**
 * The function create internal profile
 * 
 * @param {*} resourceName 
 * @param {*} profileType 
 * @param {*} subType 
 * @param {*} profileName 
 * @param {*} baseRelease 
 * @param {*} extraAttributes 
 * @returns boolean
 */

AltiplanoUtilities.prototype.createInternalProfile = function(resourceName, profileType, subType, profileName, baseRelease, extraAttributes){
    var templateArgs = {
        "profileType": profileType,
        "subType": subType,
        "profileName": profileName,
        "baseRelease": baseRelease,
        "extraAttributes": extraAttributes
    }
    try {
        var requestTemplate = resourceProvider.getResource(resourceName);
        var requestXml = utilityService.replaceVariablesInXmlTemplate(requestTemplate, templateArgs);
        var ncResponse;
        ncResponse = this.executeRequestInNAC(requestXml);
        var extractedNode = utilityService.extractSubtree(ncResponse, apUtils.prefixToNsMap, "/nc:rpc-reply/nc:ok");
        return extractedNode;
    } catch (e) {
        logger.warn("Error when create profile: {}", e);
    }
}

/**
 * The function associate profile
 * 
 * @param {*} resourceName 
 * @param {*} profileType 
 * @param {*} subType 
 * @param {*} profileName 
 * @param {*} baseRelease 
 * @param {*} extraAttributes 
 * @returns boolean
 */

AltiplanoUtilities.prototype.associateProfile = function(profileType, subType, profileName, profileVersion, intentType, intentVersion){
    var templateArgs = {
        "profileType": profileType,
        "subType": subType,
        "profileName": profileName,
        "profileVersion": profileVersion? profileVersion : 1,
        "intentType": intentType,
        "intentVersion": intentVersion
    }
    try {
        var requestTemplate = resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_ID_MGMT + "associateProfile.xml.ftl");
        var requestXml = utilityService.replaceVariablesInXmlTemplate(requestTemplate, templateArgs);
        var ncResponse;
        ncResponse = this.executeRequestInNAC(requestXml);
        var extractedNode = utilityService.extractSubtree(ncResponse, apUtils.prefixToNsMap, "/nc:rpc-reply/nc:ok");
        return extractedNode;
    } catch (e) {
        logger.warn("Error when associate profile: {}", e);
    }
}

/**
 * The function disassociate profile
 * 
 * @param {*} resourceName 
 * @param {*} profileType 
 * @param {*} subType 
 * @param {*} profileName 
 * @param {*} baseRelease 
 * @param {*} extraAttributes 
 * @returns boolean
 */

AltiplanoUtilities.prototype.disassociateProfile = function(profileType, subType, profileName, profileVersion, intentType, intentVersion){
    var templateArgs = {
        "profileType": profileType,
        "subType": subType,
        "profileName": profileName,
        "profileVersion": profileVersion? profileVersion : 1,
        "intentType": intentType,
        "intentVersion": intentVersion
    }
    try {
        var requestTemplate = resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_ID_MGMT + "disassociateProfile.xml.ftl");
        var requestXml = utilityService.replaceVariablesInXmlTemplate(requestTemplate, templateArgs);
        var ncResponse;
        ncResponse = this.executeRequestInNAC(requestXml);
        var extractedNode = utilityService.extractSubtree(ncResponse, apUtils.prefixToNsMap, "/nc:rpc-reply/nc:ok");
        return extractedNode;
    } catch (e) {
        logger.warn("Error when disassociate profile: {}", e);
    }
}

/**
 * The function used to get device reachability status from deviceName
 *
 * @param {*} deviceName
 */
AltiplanoUtilities.prototype.getReachabilityStatusByDeviceName = function (deviceName){
    var reachableState = false;
    var args = {deviceName: deviceName};
    var managerInfo = apUtils.getManagerInfo(deviceName);
    if(managerInfo){
        var managerType = managerInfo.getType().name();
        var connectvityState = managerInfo.getConnectivityState().toString();
        if (managerType && managerType == intentConstants.MANAGER_TYPE_NAV && connectvityState === intentConstants.MANAGER_CONNECTED_STATE) {
            var requestXml = utilityService.processTemplate(resourceProvider.getResource(intentConstants.MANAGER_SPECIFIC_NV_CREATE_DEVICE + "getStateAttributesFromNAV.xml.ftl"), args);
            var response = apUtils.executeGetConfigRequest(managerInfo.getName().toString(), requestXml);
            if(response){
                var datapath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceName + "\']";
                var reachableStateResponse = utilityService.extractSubtree(response, apUtils.prefixToNsMap, datapath + "/adh:device-state");
                if(reachableStateResponse){
                    reachableState = utilityService.getAttributeValue(reachableStateResponse, datapath + "/adh:device-state/adh:reachable", apUtils.prefixToNsMap);
                }
            }
        }
    }
    return reachableState;
};

AltiplanoUtilities.prototype.isInventoryOnchangeEnvEnabled = function() {
    var isInventoryOnchangeEnvEnabled = inventoryConfigService.isOnChangeSupported();
    return isInventoryOnchangeEnvEnabled;
}

/**
 * 
 * @param {*} childIntentConfigObject
 * @returns List childIntentRealizationResults
 */

AltiplanoUtilities.prototype.getChildIntentRealizations = function(input, childIntentConfigObject) {

    function getPropertyData (data, args) {
        if (typeof data === 'function') {
          return data.apply(data, args);
        }
        return data;
    }

    function getConfigurationData(target, childIntentConfigStep, instance, intentConfigArgs){
        var templateResource = childIntentConfigStep.templateFile;
        var template = resourceProvider.getResource(templateResource);
        var rawTemplateArguments = {};
        if (childIntentConfigStep.instanceArguments) {
            rawTemplateArguments = getPropertyData(childIntentConfigStep.instanceArguments, [instance, target, intentConfigArgs, context]);
        }
        Object.bindProperties(rawTemplateArguments, intentConfigArgs);
        var processedTemplate = utilityService.processTemplate(template, rawTemplateArguments);
        return processedTemplate;
    }

    function processInstance(step, instance){
        var IntentTypeTarget = Java.type('com.nokia.fnms.controller.ibn.intenttype.spi.IntentTypeTarget');
        var configData = getConfigurationData(target, step, instance, intentConfigArgs);
        var dependOnInstance = instance["dependOnInstances"];
        if(dependOnInstance){
            var dependOnInstanceList = new ArrayList();
            for(var intentDependency of dependOnInstance){
                for(var index = 0; index < intentDependency["target"].length; index++){
                    var intentTypeTarget = new IntentTypeTarget(intentDependency["intentType"], intentDependency["target"][index]);
                    dependOnInstanceList.add(intentTypeTarget);
                }
            }
        }
        var allowDirectModification = false;
        if(step.allowDirectModification && step.allowDirectModification == true){
            allowDirectModification = true;
        }
        var ChildIntentRealizationResult = Java.type('com.nokia.fnms.controller.ibn.intenttype.spi.ChildIntentRealizationResult');
        var childIntentRealizationResult = new ChildIntentRealizationResult();
        childIntentRealizationResult.setIntentType(step.intentType);
        childIntentRealizationResult.setVersion(instance["intentTypeVersion"]);
        childIntentRealizationResult.setTarget(instance["target"]);
        childIntentRealizationResult.setAllowDirectModification(allowDirectModification);
        childIntentRealizationResult.setIntentConfiguration(configData);
        childIntentRealizationResult.setRequiredNetworkState(RequiredNetworkState.active);
        if(dependOnInstanceList){
            childIntentRealizationResult.setDependsOnInstance(dependOnInstanceList);
        } else {
            childIntentRealizationResult.setDependsOnInstance(new ArrayList());
        }

        setXtraTopology(instance, step, "childIntentTargets", instance["target"]);
        setXtraTopology(instance, step, "childIntentRealizations", childIntentRealizationResult);
        return childIntentRealizationResult;
    }

    function setXtraTopology(instance, step, key, value){
        if(!context[key]){
            context[key] = {};
        }

        if(!context[key][step.intentType]){
            context[key][step.intentType] = {};
        }

        if(!context[key][step.intentType][instance["target"]]){
            context[key][step.intentType][instance["target"]] = value;
        }
    }

    var context = {};

    var target = input.getCompositeTarget();
	var compositeIntentVersion = input.getCompositeIntentTypeVersion();
    var intentType = input.getCompositeIntentTypeName();
    var intentConfigArgs = JSON.parse(input.getCompositeIntentConfigurationJson())[0][intentType + ":" + intentType];

    var childIntentRealizationResults = new ArrayList();
    var childIntentObjList = getPropertyData(childIntentConfigObject.getChildIntentRealizations, [target, intentConfigArgs]);


    if(childIntentObjList == null || childIntentObjList.length == 0){
        return [];
    }
   
    for (var index in childIntentObjList){
        var configStep = getPropertyData(childIntentObjList[index], [target, intentConfigArgs, context]);
        var instances = getPropertyData(configStep.instances, [target, intentConfigArgs, context]);
        for (var instance in instances) {
            var childIntentRealizationResult = processInstance(configStep, instances[instance]);
            childIntentRealizationResults.add(childIntentRealizationResult);
        }
    }
    return childIntentRealizationResults;
}

AltiplanoUtilities.prototype.setTopologyForDynamicCompositeIntent = function(topology) {

    function addTopologyObject(topology, topologyObject) {
        var topologyObjects = topology.getTopologyObjects();
        var topologyObjectId = topologyObject.getObjectDeviceName() + ":" + topologyObject.getObjectRelativeObjectID();
        var topoObject = getMatchingTopologyObject(topologyObjects, topologyObjectId);
        if (!topoObject) {
            topology.addTopologyObject(topologyObject);
        }
    }
    
    function getMatchingTopologyObject(topologyObjects, topologyRelativeObjectId) {
        if (topologyObjects) {
            for (var i = 0; i < topologyObjects.length; i++) {
                topologyObjects[i].setTimestamp(null);
                topologyObjects[i].setTarget(null);
                topologyObjects[i].setIntentType(null);
                var deviceName = topologyObjects[i].getObjectDeviceName();
                var objectId = topologyObjects[i].getObjectRelativeObjectID();
                var relativeObjectId = deviceName + ":" + objectId;
                if (topologyRelativeObjectId === relativeObjectId) {
                    return topologyObjects[i];
                }
            }
        }
        return null;
    }

    var syncResult = synchronizeResultFactory.createSynchronizeResult();
    syncResult.setSuccess(true);
    var topoSuperParent1 = topologyFactory.createTopologyObjectFrom("superParent1", "device:anv:superParentRelativeObjectId=superParent1", "INFRASTRUCTURE");
    var topoParent1 = topologyFactory.createTopologyObjectWithVertex("parent1", "device:anv:parentRelativeObjectId=parent1", "INFRASTRUCTURE", "device:anv:superParentRelativeObjectId=superParent1");
    var topoChild1 = topologyFactory.createTopologyObjectWithVertex("child1", "device:anv:childRelativeObjectId=child1", "INFRASTRUCTURE", "device:anv:parentRelativeObjectId=parent1");

    addTopologyObject(topology, topoSuperParent1);
    addTopologyObject(topology, topoParent1);
    addTopologyObject(topology, topoChild1);
    syncResult.setTopology(topology);
    return syncResult;
}

AltiplanoUtilities.prototype.convertEncryptedIntentConfigXmlToJson = function (intentConfigXml, listObjectMapper, json, choiceArray, multipleContainers) {
    if (!json) {
        var isJsonDefined = false;
        json = {};
    }
    json["EMPTY-LEAFS"] = [];
    /* 
     * This part is to handle when there are multiple root leafs
     * With each root leaf (from the second leaf), we will add a container key to the intentConfigJson
     * We don't change the existing structure of the intentConfigJson of the first leaf 
     * 
     * Example: <configuration xmlns="http://www.nokia.com/management-solutions/ibn">
     *               <device-fx xmlns="http://www.nokia.com/management-solutions/device-fx">
     *                   <device-manager>AMS_DEMO</device-manager>
     *                   <hardware-type>FX-I</hardware-type>
     *                   <device-version>6.7</device-version>
     *                   <ip-address>135.249.41.46</ip-address>
     *               </device-fx>
     *               <geo-coordinates xmlns="http://www.nokia.com/management-solutions/ibn-geo-location">
     *                   <latitude>50</latitude>
     *                   <longitude>50</longitude>
     *               </geo-coordinates>
     *           </configuration>
     *   
     *   Result: {
     *               "EMPTY-LEAFS": [],
     *               "device-manager": "AMS_DEMO",
     *               "hardware-type": "FX-I",
     *               "device-version": "6.7",
     *               "ip-address": "135.249.41.46",
     *               "geo-coordinates": {
     *                   "latitude": "50",
     *                   "longitude": "50"
     *               }
     *           }
     */
    var rootConfig = null;
    try {
        rootConfig = utilityService.extractSubtree(intentConfigXml, {}, "//*[local-name()='configuration']");
    } catch (e) {
        //logger.error("Error while parsing the intent-specific-data : {}", e);
        throw new RuntimeException("configuration node is not present in the intent configuration xml");
    }

    if (rootConfig != null && rootConfig.hasChildNodes()) {
        let rootChildren = rootConfig.getChildNodes();
        if(rootChildren.getLength() > 0) {
            for (let index = 0; index < rootChildren.getLength(); index++) {
                let rootChild = rootChildren.item(index);
                if (rootChild != null && rootChild.hasChildNodes()) {
                    let rootContainerKey = rootChild.getLocalName();
                    let isNeedContainerKey = false;
                    if (multipleContainers != null && multipleContainers.indexOf(rootContainerKey) != -1) {
                        isNeedContainerKey = true;
                    }
                    if (isNeedContainerKey) {
                        json[rootContainerKey] = {};
                    }
                    let childNodes = rootChild.getChildNodes();
                    for (let i = 0; i < childNodes.getLength(); i++) {
                        let child = childNodes.item(i);
                        if (child.getNodeType() == 1) { // Element Node
                            if (child.getChildNodes().getLength() === 0) {
                                if (choiceArray && choiceArray.indexOf(child.getLocalName()) > -1) {
                                    if (isNeedContainerKey) {
                                        json[rootContainerKey][child.getLocalName()] = child.getLocalName();
                                    } else {
                                        json[child.getLocalName()] = child.getLocalName();
                                    }
                                } else {
                                    if (isNeedContainerKey) {
                                        json[rootContainerKey][child.getLocalName()] = "";
                                    } else {
                                        json[child.getLocalName()] = "";
                                    }
                                }
                                json["EMPTY-LEAFS"].push(child.getLocalName()); // Add to handle multiple empty leaf in the choice.
                            } else if (child.getChildNodes().getLength() == 1 && child.getChildNodes().item(0).getNodeType() == 3) {
                                // Text Node - Direct Leafs.
                                if (typeof listObjectMapper === "function") {
                                    let listKey = listObjectMapper(child.getLocalName());
                                    if (listKey == "yang:leaf-list") {
                                        if (isNeedContainerKey) {
                                            if (json[rootContainerKey][child.getLocalName()]) {
                                                json[rootContainerKey][child.getLocalName()].push(child.getTextContent());
                                            } else {
                                                json[rootContainerKey][child.getLocalName()] = [child.getTextContent()];
                                            }
                                        } else {
                                            if (json[child.getLocalName()]) {
                                                json[child.getLocalName()].push(child.getTextContent());
                                            } else {
                                                json[child.getLocalName()] = [child.getTextContent()];
                                            }
                                        }
                                    } else {
                                        if (isNeedContainerKey) {
                                            json[rootContainerKey][child.getLocalName()] = child.getTextContent();
                                        } else {
                                            json[child.getLocalName()] = child.getTextContent();
                                        }
                                    }
                                } else {
                                    if (isNeedContainerKey) {
                                        json[rootContainerKey][child.getLocalName()] = child.getTextContent();
                                    } else {
                                        json[child.getLocalName()] = child.getTextContent();
                                    }
                                }
                            }
                            if (child.hasChildNodes() && typeof listObjectMapper === "function") {
                                let key = listObjectMapper(child.getLocalName());
                                if (key != null) { // Known List.
                                    let listInstance = {};
                                    let listChildren = child.getChildNodes();
                                    for (let j = 0; j < listChildren.getLength(); j++) {
                                        let listLeaf = listChildren.item(j);
                                        if (listLeaf.getNodeType() == 1) {
                                            // Element Node
                                            if (listLeaf.getChildNodes().getLength() == 1 && listLeaf.getChildNodes().item(0).getNodeType() == 3) {
                                                // We only support leafs,leaf-list inside list.
                                                let listKey = listObjectMapper(listLeaf.getLocalName());
                                                if (listKey == "yang:list#leaf-list") {
                                                    if (listInstance[listLeaf.getLocalName()]) {
                                                        listInstance[listLeaf.getLocalName()].push(listLeaf.getTextContent());
                                                    } else {
                                                        listInstance[listLeaf.getLocalName()] = [listLeaf.getTextContent()];
                                                    }
                                                } else {
                                                    listInstance[listLeaf.getLocalName()] = listLeaf.getTextContent();
                                                }
                                            } else if (listLeaf.hasChildNodes()) {
                                                // we will be supporting the second level list which is the child of the first list
                                                let key2 = listObjectMapper(listLeaf.getLocalName());
                                                if (key2) {
                                                    let listInstance2 = {};
                                                    let listChildren2 = listLeaf.getChildNodes();
                                                    for (let k = 0; k < listChildren2.getLength(); k++) {
                                                        let listLeaf2 = listLeaf.item(k);
                                                        if (listLeaf2.getNodeType() == 1 && listLeaf2.getChildNodes().getLength() == 1 && listLeaf2.getChildNodes().item(0).getNodeType() == 3) {
                                                            let listKey2 = listObjectMapper(listLeaf2.getLocalName());
                                                            if (listKey2 == "yang:list#leaf-list") {
                                                                if (listInstance2[listLeaf2.getLocalName()]) {
                                                                    listInstance2[listLeaf2.getLocalName()].push(listLeaf2.getTextContent());
                                                                } else {
                                                                    listInstance2[listLeaf2.getLocalName()] = [listLeaf2.getTextContent()];
                                                                }
                                                            } else {
                                                                listInstance2[listLeaf2.getLocalName()] = listLeaf2.getTextContent();
                                                            }
                                                        }
                                                    }
                                                    if (typeof listInstance[listLeaf.getLocalName()] === "undefined") {
                                                        listInstance[listLeaf.getLocalName()] = {};
                                                    }
                                                    if (!(typeof key2 === "string")) { //expected array
                                                        let dataString2 = [];
                                                        for (let index2 = 0; index2 < key2.length; index2++) {
                                                            dataString2.push(listInstance2[key2[index2]]);
                                                        }
                                                        listInstance[listLeaf.getLocalName()][dataString2.join("#")] = listInstance2; //handle case multiple optional key
                                                    } else {
                                                        listInstance[listLeaf.getLocalName()][listInstance2[key2]] = listInstance2;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (isNeedContainerKey) {
                                        if (typeof json[rootContainerKey][child.getLocalName()] === "undefined") {
                                            json[rootContainerKey][child.getLocalName()] = {};
                                        }
                                        if (!(typeof key === "string")) { //expected array
                                            let dataString = [];
                                            for (let index = 0; index < key.length; index++) {
                                                dataString.push(listInstance[key[index]]);
                                            }
                                            json[rootContainerKey][child.getLocalName()][dataString.join("#")] = listInstance; //handle case multiple optional key
                                        } else {
                                            json[rootContainerKey][child.getLocalName()][listInstance[key]] = listInstance;
                                        }
                                    } else {
                                        if (typeof json[child.getLocalName()] === "undefined") {
                                            json[child.getLocalName()] = {};
                                        }
                                        if (!(typeof key === "string")) { //expected array
                                            let dataString = [];
                                            for (let index = 0; index < key.length; index++) {
                                                dataString.push(listInstance[key[index]]);
                                            }
                                            json[child.getLocalName()][dataString.join("#")] = listInstance; //handle case multiple optional key
                                        } else {
                                            json[child.getLocalName()][listInstance[key]] = listInstance;
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
    if (!isJsonDefined) {
        return json;
    }
};

/**
 * The function used to get config from Route Policies and Route Policies Profile
 *
 * @param object profilesJsonMap
 * @param object inputSchema
 * @param boolean isRoutingProtocolSupported
 * @param object baseArgs
 */
AltiplanoUtilities.prototype.getRoutePoliciesAndRoutePoliciesOption = function (profilesJsonMap, inputSchema, isRoutingProtocolSupported, baseArgs) {
    var routingPoliciesJson = {};
    var routingPoliciesOptionJson = {};
    baseArgs["isRoutingProtocolSupported"] = isRoutingProtocolSupported;
    routingPoliciesJson["route-policies"] = profilesJsonMap["route-policies"];
    routingPoliciesOptionJson["route-policies-option"] = profilesJsonMap["route-policies-option"];
    var fwk = requestScope.get().get("xFWK");
    if(isRoutingProtocolSupported && routingPoliciesJson) {
        fwk.convertObjectToNetconfFwkFormat(routingPoliciesJson, inputSchema["routePoliciesSchema"], baseArgs);
    }
    if (isRoutingProtocolSupported && routingPoliciesOptionJson) {
        fwk.convertObjectToNetconfFwkFormat(routingPoliciesOptionJson, inputSchema["routePoliciesOptionSchema"], baseArgs);
    }
    if (baseArgs["route-policies"]) {
        var routePolicies = baseArgs["route-policies"];
        for (var key in routePolicies) {
            if (routePolicies[key] && routePolicies[key]["entry"] && Object.keys(routePolicies[key]["entry"]).length > 0) {
                var entry = routePolicies[key]["entry"];
                for (var eKey in entry) {
                    if (entry[eKey]) {
                        if (entry[eKey]["action"]) {
                            if (entry[eKey]["action"]["preference"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies"][key]["entry"][eKey]["action"], "preference");
                            }
                            if (entry[eKey]["action"]["as-path-prepend"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies"][key]["entry"][eKey]["action"], "as-path-prepend");
                            }
                            if (entry[eKey]["action"]["as-path-repeat"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies"][key]["entry"][eKey]["action"], "as-path-repeat");
                            }
                            if (entry[eKey]["action"]["as-path-add"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies"][key]["entry"][eKey]["action"], "as-path-add");
                            }
                            if (entry[eKey]["action"]["as-path-replace"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies"][key]["entry"][eKey]["action"], "as-path-replace");
                            }
                        }
                        if (entry[eKey]["from"]) {
                            if (entry[eKey]["from"]["prefix"]) {
                                baseArgs["route-policies"][key]["entry"][eKey]["from"]["prefix"] = this.convertArrayPropToMap(entry[eKey]["from"], "prefix", "value");
                            }
                            if (entry[eKey]["from"]["community"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies"][key]["entry"][eKey]["from"], "community");
                            }
                            if (entry[eKey]["from"]["as-path"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies"][key]["entry"][eKey]["from"], "as-path");
                            }
                            if (entry[eKey]["from"]["neighbor-ipaddress"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies"][key]["entry"][eKey]["from"], "neighbor-ipaddress");
                            }
                            if (entry[eKey]["from"]["neighbor-prefix"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies"][key]["entry"][eKey]["from"], "neighbor-prefix");
                            }
                        }
                        if (entry[eKey]["to"]) {
                            if (entry[eKey]["to"]["prefix"]) {
                                baseArgs["route-policies"][key]["entry"][eKey]["to"]["prefix"] = this.convertArrayPropToMap(entry[eKey]["to"], "prefix", "value");
                            }
                            if (entry[eKey]["to"]["neighbor-ipaddress"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies"][key]["entry"][eKey]["to"], "neighbor-ipaddress");
                            }
                            if (entry[eKey]["to"]["neighbor-prefix"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies"][key]["entry"][eKey]["to"], "neighbor-prefix");
                            }
                        }

                    }
                }
            }
        }
    }
    if (baseArgs["route-policies-option"]) {
        var routePoliciesOption = baseArgs["route-policies-option"];
        for (var key in routePoliciesOption) {
            if (routePoliciesOption[key]) {
                if (routePoliciesOption[key]["as-path-exp"]) {
                    this.formatStringAttributeToObject(baseArgs["route-policies-option"][key], "as-path-exp");
                }
                if (routePoliciesOption[key]["prefix-list"] && Object.keys(routePoliciesOption[key]["prefix-list"]).length > 0) {
                    var prefixList = routePoliciesOption[key]["prefix-list"];
                    for (var pKey in prefixList) {
                        if (prefixList[pKey]) {
                            if (prefixList[pKey]["ip-prefix"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies-option"][key]["prefix-list"][pKey], "ip-prefix");
                            }
                            if (prefixList[pKey]["match-type"]) {
                                this.formatStringAttributeToObject(baseArgs["route-policies-option"][key]["prefix-list"][pKey], "match-type");
                            }
                            if (prefixList[pKey]["to-prefix"]) {
                                baseArgs["route-policies-option"][key]["prefix-list"][pKey]["to-prefix"] = this.convertArrayPropToMap(prefixList[pKey], "to-prefix", "value");
                            }
                            if (prefixList[pKey]["address-mask"]) {
                                baseArgs["route-policies-option"][key]["prefix-list"][pKey]["address-mask"] = this.convertArrayPropToMap(prefixList[pKey], "address-mask", "value");
                            }
                        }
                    }
                }
                if (routePoliciesOption[key]["community"] && routePoliciesOption[key]["community"]["member"]) {
                    var community = routePoliciesOption[key]["community"];
                    baseArgs["route-policies-option"][key]["community"]["member"] = this.convertArrayPropToMap(community, "member", "value");
                }
            }
        }
    }
}

/**
 * The function used to validate Burst size
 *
 * @param String supportedChipset
 * @param String profileType
 * @param String profileName
 * @param String nameOfBurstAttribute
 * @param Number rateSize
 * @param Number burstSize
 */
AltiplanoUtilities.prototype.validateBurstSize = function (supportedChipset, profileType, profileName, nameOfBurstAttribute, rateSize, burstSize) {
    var granularityObj = {
        "Marvel": [
            {
                gran: 0,
                minBurst: 0.5,
                maxBurst: 63,
                rateGran: 1
            },
            {
                gran: 1,
                minBurst: 0.5,
                maxBurst: 511,
                rateGran: 10
            },
            {
                gran: 2,
                minBurst: 0.5,
                maxBurst: 4095,
                rateGran: 100
            },
            {
                gran: 3,
                minBurst: 0.5,
                maxBurst: 32767,
                rateGran: 1000
            },
            {
                gran: 4,
                minBurst: 4,
                maxBurst: 262140,
                rateGran: 10000
            },
            {
                gran: 5,
                minBurst: 32,
                maxBurst: 2097120,
                rateGran: 100000
            }
        ],
        "BCM": [
            {
                gran: 0,
                minBurst: 0.5,
                maxBurst: 2048,
                rateGran: 8
            },
            {
                gran: 1,
                minBurst: 1,
                maxBurst: 4096,
                rateGran: 16
            },
            {
                gran: 2,
                minBurst: 2,
                maxBurst: 8192,
                rateGran: 32
            },
            {
                gran: 3,
                minBurst: 4,
                maxBurst: 16384,
                rateGran: 64
            },
            {
                gran: 4,
                minBurst: 8,
                maxBurst: 32768,
                rateGran: 128
            },
            {
                gran: 5,
                minBurst: 16,
                maxBurst: 65536,
                rateGran: 256
            },
            {
                gran: 6,
                minBurst: 32,
                maxBurst: 131072,
                rateGran: 512
            },
            {
                gran: 7,
                minBurst: 64,
                maxBurst: 262144,
                rateGran: 1024
            },
        ]
    }
    var onePercentOfRate = rateSize / 100;
    var granularity = [];
    var maxBurstSize;
    if (supportedChipset == intentConstants.CHIPSET_BCM) {
        granularity = granularityObj["BCM"];
    } else if (supportedChipset == intentConstants.CHIPSET_MARVEL) {
        granularity = granularityObj["Marvel"];
    }
    for (var i = 0; i < granularity.length; i++) {
        if (onePercentOfRate >= granularity[i].rateGran && (granularity[i + 1] ? onePercentOfRate < granularity[i + 1].rateGran : true)) {
            maxBurstSize = granularity[i].maxBurst;
        }
    }
    if (maxBurstSize && burstSize > maxBurstSize) {
        throw new RuntimeException(nameOfBurstAttribute + " value of the " + profileType + " '" + profileName + "' should be less than or equal to " + maxBurstSize);
    }
}

/**
 * The function used to validate Burst size of Storm Control Profile
 *
 * @param String supportedChipset
 * @param object stormControlProfile
 * @param String profileType
 */
AltiplanoUtilities.prototype.validateBurstSizeOfStormControlProfile = function (supportedChipset, stormControlProfile, profileType) {
    if (stormControlProfile["unknown-mcast-rate"] && stormControlProfile["unknown-mcast-burst"]) {
        this.validateBurstSize(supportedChipset, profileType, stormControlProfile["name"], "Unknown Multicast Burst", stormControlProfile["unknown-mcast-rate"], stormControlProfile["unknown-mcast-burst"]);
    }
    if (stormControlProfile["unknown-ucast-rate"] && stormControlProfile["unknown-ucast-burst"]) {
        this.validateBurstSize(supportedChipset, profileType, stormControlProfile["name"], "Unknown Unicast Burst", stormControlProfile["unknown-ucast-rate"], stormControlProfile["unknown-ucast-burst"]);
    }
    if (stormControlProfile["broadcast-rate"] && stormControlProfile["broadcast-burst"]) {
        this.validateBurstSize(supportedChipset, profileType, stormControlProfile["name"], "Broadcast Burst", stormControlProfile["broadcast-rate"], stormControlProfile["broadcast-burst"]);
    }
}

/**
 * The function used to set rest client to communicate with VLAN ID MANAGER
 *
 */
AltiplanoUtilities.prototype.setRestClientForVlanIdManager = function (){
	var AuthUtils = Java.type("com.nokia.anv.app.security.util.AuthzClientAdapterUtils");
	if (AuthUtils.getEnv("VLANIDMANAGER_URL")) {
        var vlanIdManagerUrl = AuthUtils.getEnv("VLANIDMANAGER_URL").split("://")[1];
        var port = 8181;
        var HTTP_PROTOCOL = "http";
        var bearer_token = AuthUtils.getToken().getRawTokenString();
        try {
            restClient.setIp(vlanIdManagerUrl);
            restClient.setPort(port);
            restClient.setProtocol(HTTP_PROTOCOL);
            restClient.setBearerToken(bearer_token);
        } catch (error) {
            logger.info("Error with starting rest client. {}", error.message);
        }
    } else {
        throw new RuntimeException("VLANIDMANAGER_URL is not set in the deployment");
    }
}

/**
 * The function used to execute rest request for VLAN ID MANAGER
 *
 */

AltiplanoUtilities.prototype.setRestClient = function (){
    var AuthUtils = Java.type("com.nokia.anv.app.security.util.AuthzClientAdapterUtils");
    var acUrl = AuthUtils.getEnv("HTTP_BASE_URL");
    if (acUrl) {
        var protocol = "https";
        var publicIp = AuthUtils.getEnv("K8S_PUBLIC_IP");
        var bearer_token = AuthUtils.getToken().getRawTokenString();
        try {
            restClient.setIp(publicIp);
            restClient.setProtocol(protocol);
            restClient.setBearerToken(bearer_token);
        } catch (error) {
            logger.debug("Error with starting rest client. {}", error.message);
        }
    } else {
        throw new RuntimeException("HTTP_BASE_URL is not set in the deployment");
    }
}

AltiplanoUtilities.prototype.executeRestRequest = function (requestUrl, restMethodName, requestBody, callback, contentType, acceptType) {
    var result = {};
    if (!callback) {
        callback = this.restResultCallBack;
    }
    if(!contentType){
        contentType = "application/json";
    }
    if(!acceptType){
        acceptType = "application/json";
    }
    if (restMethodName === 'post') {
		restClient.post(requestUrl, contentType, requestBody, acceptType, function (exception, httpStatus, response) {
            callback(exception, httpStatus, response, function (resultJson) {
                result = resultJson;
            });
        });
    } else if (restMethodName === 'put') {
        restClient.put(requestUrl, contentType, requestBody, acceptType, function (exception, httpStatus, response) {
            callback(exception, httpStatus, response, function (resultJson) {
                result = resultJson;
            });
        });
    } else if (restMethodName === 'patch') {
        restClient.patch(requestUrl, contentType, requestBody, acceptType, function (exception, httpStatus, response) {
            if (exception) {
                throw exception;
            }
            if (httpStatus >= 400 && httpStatus !== 404) {
                logger.error("Request Failed with status code: " + httpStatus + " exception: " + exception + " response: " + response);
                throw new RuntimeException(response);
            }
        });
    } else if (restMethodName === 'get') {
        restClient.get(requestUrl, contentType, function (exception, httpStatus, response) {
            if (httpStatus === 404 || httpStatus === 401) {
                return null;
            }
            else {
                callback(exception, httpStatus, response, function (resultJson) {
                    result = resultJson;
                });
            }
        });
    } else {
        restClient.delete(requestUrl, contentType, function (exception, httpStatus, response) {
            if (exception) {
                throw exception;
            }
            if (httpStatus >= 400) {
                logger.error("Request Failed with status code: " + httpStatus + " exception: " + exception + " response: " + response);
                throw new RuntimeException(response);
            }
        });
    }
    return result;
}

/**
 * The function used to return response for the rest call
 *
 */
AltiplanoUtilities.prototype.restResultCallBack = function (exception, httpStatus, response, resultCallBack) {
    if (exception) {
        logger.error("Couldn't connect to Manager of Device: " + exception);
        throw exception;
    } else if (httpStatus >= 400) {
        logger.error("Request Failed with status code: " + httpStatus + " exception: " + exception + " response: " + response);
        throw new RuntimeException(response);
    } else if (response) {
        var json = JSON.parse(response);
        resultCallBack(json);
    }
}

/** This method is used to fetch the protocol-tracing session name based on the interface name
 *
 * @param String deviceID
 * @param String interfaceNames
 * @return list of sessionNames if there are protocol sessions, otherwise return null
 */
AltiplanoUtilities.prototype.getProtocolSessionName = function(deviceID, interfaceNames) {
    if (typeof interfaceNames === "string") {
        interfaceNames = [interfaceNames];
    }
    var requestTemplateArgs = {
        "deviceID": deviceID,
        "interfaceNames": interfaceNames
    };
    var xpath = "/nc:rpc-reply/nc:data/anv:device-manager/adh:device[adh:device-id=\'" + deviceID + "\']";
    try {
        var node = this.getExtractedNodeFromResponse(intentConstants.DIRECTORY_INTERNAL + intentConstants.FILE_SEPERATOR + "resources/getProtocolSessionName.xml.ftl", requestTemplateArgs, xpath, this.prefixToNsMap);
        if (node) {
            var interfaceListFromResponse = this.getAttributeValues(node, "adh:device-specific-data/npt:protocol-tracing/npt:session/npt:interface", this.prefixToNsMap);
            if (interfaceListFromResponse && !interfaceListFromResponse.isEmpty()) {
                var result = [];
                for (var i = 0; i < interfaceNames.length; i++) {
                    var interfaceName = interfaceNames[i];
                    if (interfaceListFromResponse.indexOf(interfaceName) > -1) {
                        result.push(interfaceName);
                    }
                }
                if (result.length === 0) {
                    return null;
                }
                if (interfaceNames.length === 1) {
                    return result[0];
                }
                return result;
            }
        }
    }
    catch (e) {
        logger.debug("Error while getting protocol tracing {}", e);
    }
    return null;
}

/**
 * Get Difference between two arrays
 */
AltiplanoUtilities.prototype.symmetricDifference = function (a1, a2) {
    var result = [];
    for (var i = 0; i < a1.length; i++) {
      if (a2.indexOf(a1[i]) === -1) {
        result.push(a1[i]);
      }
    }
    return result;
}

/**
 * Get available ports during modification
 */
AltiplanoUtilities.prototype.getAvailablePorts = function (a1, a2) {
    var result = [];
    for (var i = 0; i < a1.length; i++) {
      if (a2.indexOf(a1[i]) != -1) {
        result.push(a1[i]);
      }
    }
    return result;
}

AltiplanoUtilities.prototype.getDeviceIxrConfiguration = function(args, resourceFile) {
    var jsonTemplate = utilityService.processTemplate(resourceProvider.getResource(resourceFile), args);
    var response = apUtils.executeEsIntentSearchRequest(jsonTemplate);
    if (apUtils.isResponseContainsData(response)) {
        return response.hits.hits[0];
    }
    return false;
}

/**
 * get the profile content from a list.
 * @param {*} profileName, profile name
 * @param {*} profileList, the profile List object
 * @returns profile content
 */
AltiplanoUtilities.prototype.getProfileFromTheList = function(profileName, profileList){

    var profile;
    if(!profileName || !profileList){
        return profile;
    }

    for(var index = 0; index < profileList.length; index ++ ){
        if( profileName == profileList[index]["name"]){
            profile = profileList[index];
            break;
        }
    }

    return profile;
}
AltiplanoUtilities.prototype.getQueueModelFromFiberPortProfile = function(fiberPortProfile, ponType){
    var queueModel;
    if (!fiberPortProfile || !ponType) {
        return queueModel;
    }
    if(ponType === "gpon" || ponType === "dual-gpon") {
        var maxQueueNum = fiberPortProfile["gpon"]["max-queue-num"];
    }
    if(ponType === "xgs" || ponType === "ngpon2-twdm" || ponType === "u-ngpon") {
        var maxQueueNum = fiberPortProfile["xgs"]["max-queue-num"];
    }
    if(ponType === "25g") {
        var maxQueueNum = fiberPortProfile["twenty-five-g"]["max-queue-num"];
    }
    if(maxQueueNum){
        queueModel = maxQueueNum==8 ? intentConstants.TC_TO_8_QUEUES : intentConstants.TC_TO_4_QUEUES;
    }
    return queueModel;
}

AltiplanoUtilities.prototype.getDependencyForL3Infra = function (dependencyInfo, syncInput){
    var intentConfigJson = requestScope.get().get("intentConfigJson");
    var targetL3Infra = syncInput.getTarget();
    var deviceName = targetL3Infra.split("#")[0];
    var managerInfo = apUtils.getManagerInfoFromEsAndMds(deviceName);
    var interfaces = intentConfigJson["interfaces"];
    var nniIdArray = [];
    if (intentConfigJson["nni-id"]){
        for (var i = 0; i < intentConfigJson["nni-id"].length; i++) {
            nniIdArray.push(intentConfigJson["nni-id"][i]);
        }
    }
    if (interfaces) {
        var interfaceKeys = Object.keys(interfaces);
        var l2InfraIntents = [];
        for (var interfaceKey in interfaceKeys) {
            if (interfaces[interfaceKeys[interfaceKey]]["l2-infra-name"]) {
                l2InfraIntents.push(interfaces[interfaceKeys[interfaceKey]]["l2-infra-name"]);
            }
            if (interfaces[interfaceKeys[interfaceKey]]["nni-id"]) {
                nniIdArray.push(interfaces[interfaceKeys[interfaceKey]]["nni-id"]);
            }
        }
        if (l2InfraIntents.length > 0) {
          dependencyInfo[intentConstants.INTENT_TYPE_L2_INFRA] = l2InfraIntents;
        }
    }
    if (managerInfo && managerInfo.getType() == intentConstants.MANAGER_TYPE_NAV) {
      if (nniIdArray.length > 0) {
        dependencyInfo[intentConstants.INTENT_TYPE_UPLINK_CONNECTION] = [deviceName];
      }
    }
    if(!dependencyInfo[intentConstants.INTENT_TYPE_L2_INFRA] || dependencyInfo[intentConstants.INTENT_TYPE_L2_INFRA] && dependencyInfo[intentConstants.INTENT_TYPE_L2_INFRA].length == 0){
      if (managerInfo && managerInfo.getType() == intentConstants.MANAGER_TYPE_AMS) {
        dependencyInfo[intentConstants.INTENT_TYPE_UPLINK_CONNECTION] = [deviceName];
      }
      if(managerInfo && managerInfo.getType() == intentConstants.MANAGER_TYPE_NAV){
        var nodeType = apUtils.getNodeTypefromEsAndMds(deviceName);
        if(nodeType.startsWith(intentConstants.FAMILY_TYPE_LS_FX_FANT)){
            dependencyInfo[intentConstants.INTENT_TYPE_DEVICE_CONFIG_FX] = [syncInput.getTarget()];
        } else if(nodeType.startsWith(intentConstants.LS_DF_PREFIX)){
            dependencyInfo[intentConstants.INTENT_TYPE_DEVICE_CONFIG_DF] = [syncInput.getTarget()];
        } else if (nodeType.startsWith(intentConstants.LS_MF_PREFIX)){
            dependencyInfo[intentConstants.INTENT_TYPE_DEVICE_CONFIG_MF] = [syncInput.getTarget()];
        } else if (nodeType.startsWith(intentConstants.LS_SF_PREFIX)){
            dependencyInfo[intentConstants.INTENT_TYPE_DEVICE_CONFIG_SF] = [syncInput.getTarget()];
        }
      }
    }
    return dependencyInfo;
};
 /*
 * This method will replace the used sensitive keys with encrypted and delete any redundant one
 * @objectMap = {{"sip-password":{"TEL1":"encryptPasswordOfTel1","TEL2":"encryptPasswordOfTel2","key":"uni-id"},"cli-password":{"TEL1":"cli-pass-encryptPasswordOfTel1","key":"uni-id"}}
 * Provide this objectMap if you need to reuse the passwords in case you have a list containing the password =>
 * the structure would be
 * {
 *  "password-type": {
 *    "key's value": "encrypted password of the same object"
 *    "key": key type  
 *  }
 * }
*/
AltiplanoUtilities.prototype.replaceSensitiveDataInXtraTopo = function (topology, intentSensitiveKeys, objectMap) {
    var sensitiveKeys = intentSensitiveKeys.sensitiveKeys
    var encryptedPasswordAC = intentSensitiveKeys.encryptedPasswordAC
    var oamEncryptedPassword = intentSensitiveKeys.oamEncryptedPassword
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        topology.getXtraInfo().forEach(function (xtraInfo) {
            var xtraData = xtraInfo.getValue();
            if (!xtraData || xtraData == null) {
                return;
            }
            var isJsonString = function(xtraData) {
                try {
                    JSON.parse(xtraData);
                } catch (e) {
                    return false;
                }
                return true;
            }
            if(isJsonString(xtraData)) {    
                xtraData = JSON.parse(xtraData);
            }
            var xtraInfoSensitiveKeyHandling = function(xtraData) {
                if (xtraData && apUtils.isObject(xtraData) && !Array.isArray(xtraData)) {
                    Object.keys(xtraData).forEach(function (keyData) {
                        if (sensitiveKeys.indexOf(keyData) > -1) {
                            xtraData["encrypted-" + keyData] = {};
                            if(xtraData[keyData]["value"]) {
                                xtraData["encrypted-" + keyData]["value"] =  oamEncryptedPassword ? oamEncryptedPassword[keyData] : encryptedPasswordAC[keyData];
                            } else {
                                xtraData["encrypted-" + keyData] = oamEncryptedPassword ? oamEncryptedPassword[keyData] : encryptedPasswordAC[keyData];
                            }
                            delete xtraData[keyData];
                        }
                        if (objectMap) {
                            Object.keys(objectMap).forEach(function (sensitiveKey) {
                                Object.keys(objectMap[sensitiveKey]).forEach(function (child) {
                                if (xtraData[keyData][objectMap[sensitiveKey]["key"]] && xtraData[keyData][objectMap[sensitiveKey]["key"]] == child) {
                                    xtraData[keyData][sensitiveKey] = objectMap[sensitiveKey][child];
                                }
                                })
                            })
                        }
                        xtraInfoSensitiveKeyHandling(xtraData[keyData]); 
                    })
                } else if(xtraData && Array.isArray(xtraData)){
                    xtraData.forEach(function (element) {
                        xtraInfoSensitiveKeyHandling(element);
                    })
                }
            }
            xtraInfoSensitiveKeyHandling(xtraData)
            if(apUtils.isObject(xtraData)) {
                xtraInfo.setValue(JSON.stringify(xtraData));
            }else {
                xtraInfo.setValue(xtraData);
            }
        });
    }
}

/**
 * This method is used to get the sensitive key from core's input
 * <device>abc</device>
 * <userName>abc</userName>
 * <passwordType --is-password="true">****</passwordType>
 *
 * =>>> return ["passwordType"];
 */
AltiplanoUtilities.prototype.getSensitiveKeys = function (input, profileType) {
    if(profileType){
        var profileToBeCovered = intentConstants.PROFILE_WITH_SENSITIVE_VALUES;
        if(profileToBeCovered && profileToBeCovered[profileType]) {
            return this.regexHandlingForSensitiveInfo(input);
        }
    }else {
        return this.regexHandlingForSensitiveInfo(input);
    }
}

AltiplanoUtilities.prototype.regexHandlingForSensitiveInfo = function(input) {
    var pwdRegex = intentConstants.REG_EXP_FOR_SENSITIVE;
    if(!pwdRegex || pwdRegex == null) {
        pwdRegex = new RegExp("<(.*?)" + ' is-password="true"' + ">(.*?)</\(.*?)>", "g");
    }
    var executedPwdRegex;
    var uniqueArray = [];
    var executedPwdTypes = [];
    while ((executedPwdRegex = pwdRegex.exec(input)) !== null) {
        executedPwdTypes.push(executedPwdRegex[1]);
    }
    var uniqueArray = executedPwdTypes.filter(function (currentExecutedPwdType, pos) {
        return executedPwdTypes.indexOf(currentExecutedPwdType) == pos;
    })
    return uniqueArray;
}

/**
 * This method is used to get the sensitive data from core's input
 * <device>abc</device>
 * <userName>abc</userName>
 * <passwordType --is-password="true">****</passwordType>
 *
 * =>>> return ["****"];
 */
AltiplanoUtilities.prototype.getEncryptedPassword = function (input, pwdTypes) {
    var result = {};
    if (pwdTypes) {
        pwdTypes.forEach(function (pwdType) {
            var pwdRegex = new RegExp("<" + pwdType + ' is-password="true"' + ">(.*)<\/" + pwdType + ">");
            try {
                var pwdValue = pwdRegex.exec(input);
                if (pwdValue != null) {
                    result[pwdType] = pwdValue[1];
                }
            } catch (e) {
                logger.debug("An error occurred while trying to get encrypted password {}", e);
            }
        });
    }
    return result;
}

/**
 * This method will return the list of sensitive keys and encryptedPassword from the input of each intent
 * intent device-xyz =>
 *  return {
 *   "sensitiveKeys": ["password","fallback-password","tl1-password",...],
     "encryptedPasswordAC": encrypted password retrieved from core's input,
     "oamEncryptedPassword": encrypted password from OAM-Connectivity profile
 *  }

 * intent standard-voip-sip-user =>  this one won't have oamEncryptedPassword because this intent does not use OAM-Connectivity profile
 * return {
 *  "sensitiveKeys": ["sip-password"],
    "encryptedPasswordAC": encrypted password retrieved from core's input,
    "oamEncryptedPassword": null
 * }
 */
AltiplanoUtilities.prototype.getIntentSensitiveKeys = function (input, targetName) {
    var encryptedIntentConfiguration = input.getEncryptedIntentConfiguration();
    var sensitiveKeys = [];
    sensitiveKeys = apUtils.getSensitiveKeys(encryptedIntentConfiguration);
    apUtils.setRedundantSensitiveKey(sensitiveKeys, targetName);
    var encryptedPasswordAC = apUtils.getEncryptedPassword(input, sensitiveKeys);
    var intentConfig;
    var oamEncryptedPassword;
    if (this.getContentFromIntentScope("bulkSync") && apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate") && apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate")[targetName]) {
        let storedValue = apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate")[targetName];
        intentConfig = storedValue["intentConfigJson"];
        oamEncryptedPassword = storedValue["oamEncryptedPassword"];
    } else {
        var requestContext = requestScope.get();
        intentConfig = requestContext.get("intentConfigJson");
        oamEncryptedPassword = requestContext.get("oamEncryptedPassword")
    }
    var result = {
        "sensitiveKeys": sensitiveKeys,
        "encryptedPasswordAC": encryptedPasswordAC
    }
    if(oamEncryptedPassword) {
        this.addMoreKeyWhenConfiguredWithOAM(intentConfig, sensitiveKeys, oamEncryptedPassword);
        result.oamEncryptedPassword = oamEncryptedPassword;
    }
    return result;
}

/**
 * This method parses the profiles in all formats to that reiteration can be avoided
 * and if the intent have OAM-Connectivity configured, we can retrieve the encrypted password of OAM profile
 * @param {*} profileSet set of ProfileVO
 * @returns profiles in JSON format
 *
 * parsed JSON format :
 * {
 *  <profile-type>:
 *  {
 *      <sub-type>: [<profiledetails>]
 *  }
 * }
 */
AltiplanoUtilities.prototype.parseProfilesToMapToAllFormatsFromDeviceLevel = function (profileSet) {
    var profileMap = {};
    if (profileSet) {
        profileSet.forEach(function (profileEntity) {
            var profile;
            var profileType = profileEntity.getProfileType();
            profile = JSON.parse(profileEntity.getProfileConfigJSON())[profileType + ":" + profileType];
            profile["name"] = profileEntity.getName();
            profile["baseRelease"] = profileEntity.getBaseRelease();
            profile["profileVersion"] = profileEntity.getVersion();
            profile = JSON.parse(JSON.stringify(profile, apUtils.stringReplacer));
            var pwdTypes = apUtils.getSensitiveKeys(profileEntity.getProfileConfig(), profileType);
            if (profileType == "device-oam-connectivity-account" && pwdTypes) {
                var encryptedPassword = apUtils.getEncryptedPassword(profileEntity.getProfileConfig(), pwdTypes);
                var requestContext = requestScope.get();
                if (requestContext) {
                    var intentConfig = requestContext.get("intentConfigJson");
                    if (intentConfig["main-oam-connectivity-account"] == profile["name"]) {
                        requestContext.put("oamEncryptedPassword", encryptedPassword);
                        profile["oamEncryptedPassword"] = encryptedPassword;
                    }
                }
            }
            if (profileMap[profileType] && profileMap[profileType][profileEntity.getSubtype()]) {
                profileMap[profileType][profileEntity.getSubtype()].push(profile)
                profileMap[intentConstants.PROFILE_NAMES][profileType][profileEntity.getSubtype()].push(profile["name"]);
                profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType][profileEntity.getSubtype()][profile["name"]] = profile;
            } else {
                var profileList = [];
                var profileNames = [];
                profileList.push(profile);
                profileNames.push(profile["name"]);
                if(!profileMap[profileType]) {
                    profileMap[profileType] = {};
                }
                if(!profileMap[intentConstants.PROFILE_NAMES]) {
                    profileMap[intentConstants.PROFILE_NAMES] = {};
                }
                if(!profileMap[intentConstants.PROFILE_NAMES][profileType]) {
                    profileMap[intentConstants.PROFILE_NAMES][profileType]={};
                }
                if(!profileMap[intentConstants.SINGLE_PROFILE_CONFIG]) {
                    profileMap[intentConstants.SINGLE_PROFILE_CONFIG] = {};
                }
                if(!profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType]) {
                    profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType]={};
                }
                if(!profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType][profileEntity.getSubtype()]) {
                    profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType][profileEntity.getSubtype()]={};
                }
                profileMap[profileType][profileEntity.getSubtype()] = profileList;
                profileMap[intentConstants.PROFILE_NAMES][profileType][profileEntity.getSubtype()] = profileNames;
                profileMap[intentConstants.SINGLE_PROFILE_CONFIG][profileType][profileEntity.getSubtype()][profile["name"]] = profile;
            }
        });
    }
    return profileMap;
}

/**
 * this method will check whether OAM-Connectivity profile is used to configure on intent type to add additional sensitive values
 */
AltiplanoUtilities.prototype.addMoreKeyWhenConfiguredWithOAM = function (intentConfig, sensitiveKeys, oamEncryptedPassword) {
    if (intentConfig["main-oam-connectivity-account"] && intentConfig["fallback-oam-connectivity-account"]) {
        var oamSensitiveKeys = ["password","fallback-password"];
        //This loop will ensure that new sensitive key in device's yang can work with OAM-Connectivity case.
        // For example:
        // ["some-secret-key"] + ["password","fallback-password"] = ["some-secret-key","password","fallback-password"]
        // or ["password"] + ["password","fallback-password"] = ["password","fallback-password"]
        for (var index in oamSensitiveKeys) {
            if(sensitiveKeys.indexOf(oamSensitiveKeys[index]) == -1) {
                sensitiveKeys.push(oamSensitiveKeys[index]);
            }
        }
    }
}


/**
 * This method will set the sensitive key into "sensitiveKeyToBeRemoved" in requestScope for later usage
 * Input : ["xyz-password"]
 * Output : ["abc-password",...,"xyz-password"]
 */
AltiplanoUtilities.prototype.setRedundantSensitiveKey = function (data, targetName) {
    var sensitiveKeyToBeRemoved;
    if(data && Array.isArray(data) && data.length > 0) {
        if (this.getContentFromIntentScope("bulkSync") && targetName && apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate")
            && apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate")[targetName] && apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate")[targetName]["sensitiveKeyToBeRemoved"]) {
            sensitiveKeyToBeRemoved = apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate")[targetName]["sensitiveKeyToBeRemoved"];
        } else if (requestScope.get() != null) {
            sensitiveKeyToBeRemoved = requestScope.get().get("sensitiveKeyToBeRemoved");
        }
        if (sensitiveKeyToBeRemoved && Array.isArray(sensitiveKeyToBeRemoved) && sensitiveKeyToBeRemoved.length > 0) {
            for (var index in data) {
                if (sensitiveKeyToBeRemoved.indexOf(data[index]) == -1) {
                    sensitiveKeyToBeRemoved.push(data[index]);
                }
            }
        } else {
            // Initial case
            sensitiveKeyToBeRemoved = [];
            for (var index in data) {
                sensitiveKeyToBeRemoved.push(data[index]);
            }
        }
        if (requestScope.get() != null) {
            requestScope.get().put("sensitiveKeyToBeRemoved", sensitiveKeyToBeRemoved);
        }
        let storedValuesFromScope = apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate") ? apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate") : {};
        if (storedValuesFromScope && !storedValuesFromScope[targetName]) {
            storedValuesFromScope[targetName] = {};
        }
        storedValuesFromScope[targetName]["sensitiveKeyToBeRemoved"] = sensitiveKeyToBeRemoved;
    }
}


/**
 * This method will remove all the sensitive value from xtraTopology
 *   lastIntentConfig: {                 lastIntentConfig: {
 *      "userName": "xyz"      ==>          "userName": "xyz"
 *      "password": "abc"
 *   }                                   }
 */
AltiplanoUtilities.prototype.removeSensitiveDataInXtraTopo = function (topology, sensitiveKeyToBeRemoved) {
    if (topology && topology.getXtraInfo() !== null && !topology.getXtraInfo().isEmpty()) {
        topology.getXtraInfo().forEach(function (xtraInfo) {
            var xtraData = xtraInfo.getValue();
            if (!xtraData || xtraData == null) {
                return;
            }
            var isJsonString = function(xtraData) {
                try {
                    JSON.parse(xtraData);
                } catch (e) {
                    return false;
                }
                return true;
            }
            if(isJsonString(xtraData)) {    
                xtraData = JSON.parse(xtraData);
            }
            var xtraInfoSensitiveKeyHandling = function(xtraData) {
                if (xtraData && apUtils.isObject(xtraData) && !Array.isArray(xtraData)) {
                    Object.keys(xtraData).forEach(function (keyData) {
                        if(sensitiveKeyToBeRemoved && sensitiveKeyToBeRemoved.indexOf(keyData) > -1) {
                            delete xtraData[keyData];
                        }
                        xtraInfoSensitiveKeyHandling(xtraData[keyData]);
                    })
                } else if (xtraData && Array.isArray(xtraData)) {
                    xtraData.forEach(function (element) {
                        xtraInfoSensitiveKeyHandling(element);
                    })
                }
            }
            xtraInfoSensitiveKeyHandling(xtraData)
            if(apUtils.isObject(xtraData)) {
                xtraInfo.setValue(JSON.stringify(xtraData));
            }else {
                xtraInfo.setValue(xtraData);
            }
        });
    }
}

/**
 * Method to get board service profile name
 * @param deviceId -- DeviceIId
 * @param deviceType --  intentConstants.INTENT_TYPE_DEVICE_FX
 * @returns boardServiceProfileName
 */

AltiplanoUtilities.prototype.getBoardServiceProfileFromDeviceId = function (deviceId, deviceType) {
    var boardServiceProfileName;
    var ltDeviceName;
    if(!this.isLtDevice(deviceId)){
        return;
    }
    var ntDeviceName = this.getFxShelfDeviceName(deviceId);
    var lastIndex = deviceId.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
    if (lastIndex > -1) {
        ltDeviceName = deviceId.substring(lastIndex + 1);
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
    }
    var deviceIntentVersion = apUtils.getIntentVersion(deviceType, ntDeviceName);
    var deviceIntentConfig = apUtils.convertIntentConfigXmlToJson(apUtils.getIntentConfig(deviceType, deviceIntentVersion, ntDeviceName), getKeyForList);
    var boardList = deviceIntentConfig["boards"];
    Object.keys(boardList).forEach(function (board) {
        if(ltDeviceName === board){
            boardServiceProfileName = boardList[board]["board-service-profile"];
        }
    })
    return boardServiceProfileName;
};

/**
 * Method to get planned lt board type
 * @param deviceId -- DeviceIId
 * @param deviceType --  intentConstants.INTENT_TYPE_DEVICE_FX
 * @returns lt type
 */

AltiplanoUtilities.prototype.getPlannedLtTypeFromDeviceId = function (deviceId, deviceType) {
    var ltType;
    var ltDeviceName;
    if(!this.isLtDevice(deviceId)){
        return;
    }
    var ntDeviceName = this.getFxShelfDeviceName(deviceId);
    var lastIndex = deviceId.lastIndexOf(intentConstants.DEVICE_SEPARATOR);
    if (lastIndex > -1) {
        ltDeviceName = deviceId.substring(lastIndex + 1);
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
    }
    var deviceIntentVersion = apUtils.getIntentVersion(deviceType, ntDeviceName);
    var deviceIntentConfig = apUtils.convertIntentConfigXmlToJson(apUtils.getIntentConfig(deviceType, deviceIntentVersion, ntDeviceName), getKeyForList);
    var boardList = deviceIntentConfig["boards"];
    Object.keys(boardList).forEach(function (board) {
        if(ltDeviceName === board){
            ltType = boardList[board]["planned-type"];
        }
    })
    return ltType;
};
AltiplanoUtilities.prototype.protectSensitiveDataLog = function (originalInput, targetName) {
    if (originalInput) {
        var cloneInput = originalInput;
        let storedValuesFromScope = apUtils.getContentFromIntentScope("storedValuesForTopologyUpdate");
        let storedValuesForProtection;
        if (targetName && storedValuesFromScope && storedValuesFromScope[targetName]) {
            storedValuesForProtection = storedValuesFromScope[targetName];
        } else if (typeof requestScope !== 'undefined' && requestScope.get() != null) {
            storedValuesForProtection = requestScope.get();
        }
        if (storedValuesForProtection) {
            var networkState = storedValuesForProtection["networkState"];
            var isProfileDataNotAvailable = storedValuesForProtection["isProfileDataNotAvailable"];
            if (storedValuesForProtection["sensitiveValues"]) {
                var sensitiveValues = storedValuesForProtection["sensitiveValues"];
                if(storedValuesForProtection["sensitiveKeyToBeRemoved"]) {
                    var pwdTypes = storedValuesForProtection["sensitiveKeyToBeRemoved"];
                    if(pwdTypes && pwdTypes.length > 0) {
                        apUtils.sensitiveKeyHandling(cloneInput, pwdTypes, sensitiveValues);
                    }
                }
            }
        }
        if(!isProfileDataNotAvailable && networkState != "delete"){
            if (undefined != JSON.stringify(cloneInput) && typeof cloneInput != "string") {
                cloneInput = JSON.stringify(cloneInput);
            }else if (typeof cloneInput.toString == "function"){
                cloneInput = cloneInput.toString();
            }//else -> cloneInput is already in String data type, so no need to convert to String -> do nothing

            if (sensitiveValues && sensitiveValues.length > 0) {
                sensitiveValues = sensitiveValues.filter((value, index) => sensitiveValues.indexOf(value) == index);

                /* This function will replace any regex syntax into string. Example:
                * abc$xyz => abc\$xyz
                * abc$def?xyz => abc\$def\?xyz
                * abcdef => abcdef: in case there aren't any regex syntax
                */
                var parseSpecialCharInRegexToString = function(string) {
                    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                }
                for (var index in sensitiveValues) {
                    if(sensitiveValues[index]) {
                        if(apUtils.isObject(sensitiveValues[index]) && sensitiveValues[index]["value"]) {
                            //this is to cover any sensitive value placed in an object with key is "value". Exp:{"password":{"value":"abcdef"}}
                            var sensitiveValue = parseSpecialCharInRegexToString(sensitiveValues[index]["value"]);
                        }else{
                            var sensitiveValue = parseSpecialCharInRegexToString(sensitiveValues[index]);
                        }
                        /* Given the sensitive value is wel$come
                        * the regexPattern will have a string like this: "wel\$come"|>wel\$come<g so that the replaceAll()
                        * can make a global search and replace if there is any string match with "wel\$come" or >wel$come<
                        */
                        var indicatorValue = ['"' + sensitiveValue + '"', '>' + sensitiveValue + '<'];
                        var regexPattern = new RegExp(indicatorValue.join("|"), "g");
                        cloneInput = cloneInput.replace(regexPattern, '"******"');
                    }
                }
            }

            return cloneInput; //it's in String data type
        }else {
            return "";
        }
    }
}


AltiplanoUtilities.prototype.sensitiveKeyHandling = function (jsonObject, pwdTypes, sensitiveValues) {
    if(pwdTypes && pwdTypes.length > 0){
        if ((jsonObject && Java.isJavaObject(jsonObject) && jsonObject instanceof Object && (!jsonObject.toString().contains("]") || jsonObject.toString().contains('":"')))
            || (jsonObject && jsonObject instanceof Object && !Array.isArray(jsonObject) && !Java.isJavaObject(jsonObject))
        ) {
            Object.keys(jsonObject).forEach(function (keyData) {
                if (pwdTypes && pwdTypes.indexOf(keyData) > -1) {
                    if (sensitiveValues && sensitiveValues.indexOf(jsonObject[keyData] == -1)) {
                        sensitiveValues.push(jsonObject[keyData])
                    }
                }
                apUtils.sensitiveKeyHandling(jsonObject[keyData],pwdTypes,sensitiveValues);
            })
        } else if(jsonObject && Array.isArray(jsonObject)) {
            jsonObject.forEach(function (element) {
                apUtils.sensitiveKeyHandling(element, pwdTypes,sensitiveValues);
            })
        }
        requestScope.get().put("sensitiveValues", sensitiveValues);
    }
}

AltiplanoUtilities.prototype.convertToZoneAbbreviations = function(zoneName) {
    let zoneAbbreviation;
    let objTimeZone = {
      "acst": ["Australia/Adelaide", "Australia/Broken_Hill", "Australia/Darwin", "Australia/North", "Australia/South", "Australia/Yancowinna"],
      "aest": ["Antarctica/Macquarie", "Australia/ACT", "Australia/Brisbane", "Australia/Canberra", "Australia/Currie", "Australia/Hobart",
        "Australia/Lindeman", "Australia/Melbourne", "Australia/NSW", "Australia/Queensland", "Australia/Sydney", "Australia/Tasmania", "Australia/Tasmania"
      ],
      "akst": ["America/Anchorage", "America/Juneau", "America/Metlakatla", "America/Nome", "America/Sitka", "America/Yakutat", "US/Alaska"],
      "ast": ["America/Aruba"],
      "awst": ["Australia/Perth", "Australia/West"],
      "cet": ["Africa/Algiers", "Africa/Ceuta", "Africa/Tunis", "Arctic/Longyearbyen", "Atlantic/Jan_Mayen", "Europe/Amsterdam", "Europe/Andorra",
        "Europe/Belgrade", "Europe/Berlin", "Europe/Bratislava", "Europe/Brussels", "Europe/Belgrade", "Europe/Budapest", "Europe/Busingen",
        "Europe/Copenhagen", "Europe/Gibraltar", "Europe/Ljubljana", "Europe/Luxembourg", "Europe/Madrid", "Europe/Malta", "Europe/Monaco",
        "Europe/Oslo", "Europe/Paris", "Europe/Podgorica", "Europe/Belgrade", "Europe/Prague", "Europe/Rome", "Europe/San_Marino", "Europe/Sarajevo",
        "Europe/Skopje", "Europe/Stockholm", "Europe/Tirane", "Europe/Vaduz", "Europe/Vatican", "Europe/Vienna", "Europe/Warsaw", "Europe/Zagreb", "Europe/Zurich"
      ],
      "cst": ["America/Bahia_Banderas", "Africa/Cairo", "America/Atikokan"],
      "hst": ["Pacific/Honolulu", "US/Aleutian", "US/Hawaii"],
      "msk": ["Europe/Kirov", "Europe/Moscow", "Europe/Simferopol", "Europe/Volgograd"],
      "mst": ["America/Boise", "America/Cambridge_Bay", "America/Ciudad_Juarez", "America/Creston", "America/Dawson", "America/Dawson_Creek", "America/Denver",
        "America/Edmonton", "America/Fort_Nelson", "America/Hermosillo", "America/Inuvik", "America/Mazatlan", "America/Phoenix", "America/Shiprock",
        "America/Whitehorse", "America/Yellowknife", "Canada/Mountain", "Canada/Saskatchewan", "Canada/Yukon", "Mexico/BajaSur", "Navajo", "US/Mountain", "US/Arizona"
      ],
      "nst": ["America/St_Johns", "Canada/Newfoundland"],
      "nzst": ["Antarctica/McMurdo", "Antarctica/South_Pole", "Pacific/Auckland"],
      "pst": ["America/Ensenada", "America/Los_Angeles", "America/Santa_Isabel", "America/Tijuana", "America/Vancouver", "Asia/Manila", "Canada/Pacific", "Mexico/BajaNorte", "US/Pacific"],
      "wet": ["Atlantic/Canary", "Atlantic/Faeroe", "Atlantic/Faroe", "Atlantic/Madeira", "Europe/Lisbon", "Portugal"]
    }
  
    Object.keys(objTimeZone).forEach((zoneAbbr) => {
      objTimeZone[zoneAbbr].forEach((timeZone) => {
        if (timeZone === zoneName){
          zoneAbbreviation = zoneAbbr;
        }
      })
    })
    return zoneAbbreviation ? zoneAbbreviation : "utc";
}

/**
 * Function to handle Geo Coordinates in intent migration
 * @param intentConfigJson -- The intent's configuration attributes
 * @returns resultStr --- The string of Geo Coordinates xml configuration
 */
AltiplanoUtilities.prototype.handleGeoCoordinatesInIntentMigration = function(intentConfigJson) {
    if (intentConfigJson["geo-coordinates"]) {
        var tempJson = {};
        if(intentConfigJson["geo-coordinates"]["latitude"] || intentConfigJson["geo-coordinates"]["longitude"]){
            var prefix = "<geo-coordinates xmlns=\"http://www.nokia.com/management-solutions/ibn-geo-location\">";
            var suffix = "</geo-coordinates>";
        }
        if(intentConfigJson["geo-coordinates"]["latitude"]){
            tempJson["latitude"] = intentConfigJson["geo-coordinates"]["latitude"];
            delete intentConfigJson["geo-coordinates"]["latitude"];
        }
        if(intentConfigJson["geo-coordinates"]["longitude"]){
            tempJson["longitude"] = intentConfigJson["geo-coordinates"]["longitude"];
            delete intentConfigJson["geo-coordinates"]["longitude"];
        }
        delete intentConfigJson["geo-coordinates"];
        var convertedXml = apUtils.convertObjectToXmlElement(tempJson);
        var resultStr = prefix + convertedXml + suffix;
        return resultStr;
    } 
    return "";
}

AltiplanoUtilities.prototype.convertGraalListToMap = function(arr) {
    if (arr.length>0 && typeof Graal != 'Undefined' && Array.isArray(arr) === true) {
        var map = {};
        for (var i=0; i<arr.length; i++) {
            map[i] = arr[i];
        }
        return map;
    }
    return arr;
}

AltiplanoUtilities.prototype.bulkSyncAggregationSupported = function (managerType) {
    if (managerType == intentConstants.MANAGER_TYPE_NAV) {
        return true;
    }
    return false;
}

AltiplanoUtilities.prototype.isBulkSyncSupportedForIntent = function (intentName) {
    if (intentName && intentConstants.SUPPORTED_BULK_SYNC_INTENTS && intentConstants.SUPPORTED_BULK_SYNC_INTENTS.indexOf(intentName) != -1) {
        return true;
    }
    return false;
}

