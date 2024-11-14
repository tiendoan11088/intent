<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template validates and upgrades/downgrades software -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:ibn="http://www.nokia.com/management-solutions/ibn">
    <edit-config>
        <target>
            <running/>
        </target>
        <test-option>set</test-option>
        <error-option>rollback-on-error</error-option>
        <config>
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv"
                                xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:ibn="http://www.nokia.com/management-solutions/ibn"
                                xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                <adh:device xc:operation="${operation.value}">
                    <adh:device-id ibn:key="true">${deviceID.value}</adh:device-id>
                    <#if act\-url?? || act\-file\-on\-server?? || pass\-url?? || pass\-file\-on\-server?? || cpeSoftware?? || ( isNTDevice?? && ( (eonuImages?? && eonuImages?has_content) || (eonuVendorSpecificImages?? && eonuVendorSpecificImages?has_content) || trans\-url?? || trans\-file\-on\-server??))>
                        <swmgmt:software xmlns:swmgmt="http://www.nokia.com/management-solutions/anv-software" ibn:audit="terminate">
                            <!-- Added for audit misalignment -->
                            <#if isAuditSupported?? && (act\-url?? || act\-file\-on\-server?? || pass\-url?? || pass\-file\-on\-server??|| (eonuImages?? && eonuImages?has_content) || eonuVendorSpecificImages?? || trans\-url?? || trans\-file\-on\-server??)>
                                <#if act\-url?? || act\-file\-on\-server??>
                                    <#if act\-url?? && act\-url.oldValue?? && !act\-url.value?has_content && !act\-file\-on\-server??>
                                        <swmgmt:target-active-software xc:operation="remove">
                                            <swmgmt:url ibn:key="true" ibn:flipAudit="true">${act\-url.oldValue}</swmgmt:url>
                                        </swmgmt:target-active-software>
                                    <#elseif act\-file\-on\-server?? && act\-file\-on\-server.oldValue?? && !act\-file\-on\-server.value?has_content && !act\-url??>
                                        <swmgmt:target-active-software ibn:flipAudit="true" xc:operation="remove">
                                        </swmgmt:target-active-software>
                                    </#if>
                                </#if>
                                <#if pass\-url?? || pass\-file\-on\-server??>
                                    <#if pass\-url?? && pass\-url.oldValue?? && !pass\-url.value?has_content && !pass\-file\-on\-server??>
                                        <swmgmt:target-passive-software xc:operation="remove">
                                            <swmgmt:url ibn:key="true" ibn:flipAudit="true">${pass\-url.oldValue}</swmgmt:url>
                                        </swmgmt:target-passive-software>
                                    <#elseif pass\-file\-on\-server?? && pass\-file\-on\-server.oldValue?? && !pass\-file\-on\-server.value?has_content && !pass\-url??>
                                        <swmgmt:target-passive-software ibn:flipAudit="true" xc:operation="remove">
                                        </swmgmt:target-passive-software>
                                    </#if>
                                </#if>
                                <#if isNTDevice?? && transformationSoftware??>
                                    <#if transformationSoftware?? && transformationSoftware.oldValue??>
                                        <swmgmt:device-artifacts>
                                            <swmgmt:artifacts-to-download xc:operation="remove">
                                                <swmgmt:type ibn:key="true">transformation-software</swmgmt:type>
                                            </swmgmt:artifacts-to-download>
                                        </swmgmt:device-artifacts>
                                    </#if>
                                </#if>
                            </#if>
                            <#if act\-url?? || act\-file\-on\-server??>
                                <#if (!lockUpgradeSw?? && enableDownload??) || !enableDownload??>
                                    <#if act\-url?? && act\-url.value?has_content>
                                        <swmgmt:target-active-software>
                                            <swmgmt:url ibn:key="true">${act\-url.value}</swmgmt:url>
                                        </swmgmt:target-active-software>
                                    <#elseif act\-file\-on\-server?? && act\-file\-on\-server.value?has_content>
                                        <swmgmt:target-active-software>
                                            <swmgmt:file-server ibn:key="true">${actFileServer.value}</swmgmt:file-server>
                                            <swmgmt:file-name ibn:key="true">${actFileName.value}</swmgmt:file-name>
                                            <swmgmt:sub-directory ibn:key="true">${actSubDirectory.value}</swmgmt:sub-directory>
                                        </swmgmt:target-active-software>
                                    </#if>
                                </#if>
                            </#if>
                            <#if pass\-url?? || pass\-file\-on\-server??>
                                <#if (downloadPassiveSW?? && enableDownload??) || !enableDownload??>
                                    <#if pass\-url?? && pass\-url.value?has_content>
                                        <swmgmt:target-passive-software>
                                            <swmgmt:url ibn:key="true">${pass\-url.value}</swmgmt:url>
                                        </swmgmt:target-passive-software>
                                    <#elseif pass\-file\-on\-server?? && pass\-file\-on\-server.value?has_content>
                                        <swmgmt:target-passive-software>
                                            <swmgmt:file-server ibn:key="true">${passFileServer.value}</swmgmt:file-server>
                                            <swmgmt:file-name ibn:key="true">${passFileName.value}</swmgmt:file-name>
                                            <swmgmt:sub-directory ibn:key="true">${passSubDirectory.value}</swmgmt:sub-directory>
                                        </swmgmt:target-passive-software>
                                    </#if>
                                </#if>
                            </#if>

                            <#if isNTDevice?? && ((eonuImages?? && eonuImages?has_content) || (eonuVendorSpecificImages?? && eonuVendorSpecificImages?has_content) || ((trans\-url??  || trans\-file\-on\-server?? )))>
                                <swmgmt:device-artifacts>
                                    <#if isNTDevice?? && (eonuImages?? && eonuImages?has_content)>
                                        <swmgmt:artifacts-to-download>
                                            <swmgmt:type ibn:key="true">ont-software</swmgmt:type>
                                            <#if operation.value != "remove">
                                                <#list eonuImages as key, eonuImage>
                                                    <#if key != "changed">
                                                        <#if eonuImage.removed??>
                                                            <swmgmt:artifact xc:operation="remove">
                                                                <swmgmt:name ibn:key="true" ibn:flipAudit="true">${eonuImage.swImageName}</swmgmt:name>
                                                            </swmgmt:artifact>
                                                        <#else>
                                                            <swmgmt:artifact xc:operation="merge">
                                                                <#if eonuImage.softwareUrl?? && eonuImage.softwareUrl?has_content>
                                                                    <swmgmt:name ibn:key="true">${eonuImage.swImageName}</swmgmt:name>
                                                                    <swmgmt:url ibn:key="true">${eonuImage.softwareUrl}</swmgmt:url>
                                                                <#else>
                                                                    <swmgmt:name ibn:key="true">${eonuImage.swImageName}</swmgmt:name>
                                                                    <swmgmt:file-server ibn:key="true">${eonuImage.fileServer}</swmgmt:file-server>
                                                                    <swmgmt:file-name ibn:key="true">${eonuImage.fileName}</swmgmt:file-name>
                                                                    <swmgmt:sub-directory ibn:key="true">${eonuImage.subDir}</swmgmt:sub-directory>
                                                                </#if>
                                                            </swmgmt:artifact>
                                                        </#if>
                                                    </#if>
                                                </#list>
                                            </#if>
                                        </swmgmt:artifacts-to-download>
                                    </#if>
                                    <#if isNTDevice?? && eonuVendorSpecificImages?? && eonuVendorSpecificImages?has_content>
                                        <swmgmt:artifacts-to-download>
                                            <swmgmt:type ibn:key="true">onu-vendor-specific-software</swmgmt:type>
                                            <#if operation.value != "remove">
                                                <#list eonuVendorSpecificImages as key, vendorSpecificImage>
                                                    <#if key != "changed">
                                                        <#if vendorSpecificImage.removed??>
                                                            <swmgmt:artifact xc:operation="remove">
                                                                <swmgmt:name ibn:key="true" ibn:flipAudit="true">${vendorSpecificImage.swImageName}</swmgmt:name>
                                                            </swmgmt:artifact>
                                                        <#else>
                                                            <swmgmt:artifact xc:operation="merge">
                                                                <#if vendorSpecificImage.softwareUrl?? && vendorSpecificImage.softwareUrl?has_content>
                                                                    <swmgmt:name ibn:key="true">${vendorSpecificImage.swImageName}</swmgmt:name>
                                                                    <swmgmt:url ibn:key="true">${vendorSpecificImage.softwareUrl}</swmgmt:url>
                                                                <#else>
                                                                    <swmgmt:name ibn:key="true">${vendorSpecificImage.swImageName}</swmgmt:name>
                                                                    <swmgmt:sub-directory ibn:key="true">${vendorSpecificImage.subDir}</swmgmt:sub-directory>
                                                                    <swmgmt:file-server ibn:key="true">${vendorSpecificImage.fileServer}</swmgmt:file-server>
                                                                    <swmgmt:file-name ibn:key="true">${vendorSpecificImage.fileName}</swmgmt:file-name>
                                                                </#if>
                                                            </swmgmt:artifact>
                                                        </#if>
                                                    </#if>
                                                </#list>
                                            </#if>
                                        </swmgmt:artifacts-to-download>
                                    </#if>
                                    <#if isNTDevice?? && (trans\-url?? || trans\-file\-on\-server??)>
                                        <swmgmt:artifacts-to-download>
                                            <swmgmt:type ibn:key="true">transformation-software</swmgmt:type>
                                            <#if trans\-url?? && trans\-url.value?has_content>
                                            <swmgmt:artifact xc:operation="merge">
                                                    <swmgmt:name ibn:key="true">${transformationSoftware.value}</swmgmt:name>
                                                    <swmgmt:url ibn:key="true">${trans\-url.value}</swmgmt:url>
                                            </swmgmt:artifact>
                                            <#elseif trans\-file\-on\-server?? && trans\-file\-on\-server.value?has_content>
                                                <swmgmt:artifact xc:operation="merge">
                                                    <swmgmt:name ibn:key="true">${transformationSoftware.value}</swmgmt:name>
                                                    <swmgmt:file-server ibn:key="true">${transFileServer.value}</swmgmt:file-server>
                                                    <swmgmt:file-name ibn:key="true">${transFileName.value}</swmgmt:file-name>
                                                    <swmgmt:sub-directory ibn:key="true">${transSubDirectory.value}</swmgmt:sub-directory>
                                                </swmgmt:artifact>
                                            </#if>
                                        </swmgmt:artifacts-to-download>
                                    </#if>
                                </swmgmt:device-artifacts>
                            </#if>

                            <#if cpeSoftware?? && cpeSoftware?has_content>
                                <swmgmt:device-artifacts>
                                    <swmgmt:artifacts-to-download>
                                        <swmgmt:type ibn:key="true">cpe-software</swmgmt:type>
                                        <#if operation.value != "remove">
                                            <#if cpeSoftware.removed??>
                                                <#assign cpeRemoveListAction = true>
                                            <#else>
                                                <#assign cpeRemoveListAction = false>
                                            </#if>
                                            <#list cpeSoftware as key, value>
                                                <#if key != "changed">
                                                    <#if cpeRemoveListAction == false>
                                                        <#if value.removed??>
                                                            <swmgmt:artifact xc:operation="remove">
                                                                <#if value.isUrl>
                                                                    <swmgmt:name ibn:key="true" ibn:flipAudit="true">${value.cpeUrlName}</swmgmt:name>
                                                                <#else>
                                                                    <swmgmt:name ibn:key="true" ibn:flipAudit="true">${value.cpeSwName}</swmgmt:name>
                                                                </#if>
                                                            </swmgmt:artifact>
                                                        <#else>
                                                            <swmgmt:artifact xc:operation="merge">
                                                                <#if value.isUrl>
                                                                    <swmgmt:name ibn:key="true">${value.cpeUrlName}</swmgmt:name>
                                                                    <swmgmt:url ibn:key="true">${value.cpeSwUrl}</swmgmt:url>
                                                                <#else>
                                                                    <swmgmt:name ibn:key="true">${value.cpeSwName}</swmgmt:name>
                                                                    <swmgmt:file-server ibn:key="true">${value.cpeFileServer}</swmgmt:file-server>
                                                                    <swmgmt:file-name ibn:key="true">${value.cpeSwFileName}</swmgmt:file-name>
                                                                    <swmgmt:sub-directory ibn:key="true">${value.cpeSwSubDir}</swmgmt:sub-directory>
                                                                </#if>
                                                            </swmgmt:artifact>
                                                        </#if>
                                                    <#else>
                                                        <swmgmt:artifact xc:operation="remove">
                                                            <#if value.isUrl>
                                                                <swmgmt:name ibn:key="true" ibn:flipAudit="true">${value.cpeUrlName}</swmgmt:name>
                                                            <#else>
                                                                <swmgmt:name ibn:key="true" ibn:flipAudit="true">${value.cpeSwName}</swmgmt:name>
                                                            </#if>
                                                        </swmgmt:artifact>
                                                    </#if>
                                                </#if>
                                            </#list>
                                        </#if>
                                    </swmgmt:artifacts-to-download>
                                </swmgmt:device-artifacts>
                            </#if>
                        </swmgmt:software>
                    </#if>
                    <#if ((active\-software?? || passive\-software?? || ( isNTDevice?? && ( (eonuImages?? && eonuImages?has_content) || (eonuVendorSpecificImages?? && eonuVendorSpecificImages?has_content) || trans\-url?? || trans\-file\-on\-server??)))&& trust\-anchors??) || cpePreferenceReleases??>
                        <adh:device-specific-data <#if navDeviceSpecificData??>ibn:audit="terminate"</#if>>
                            <#if navDeviceSpecificData??>
                                ${navDeviceSpecificData.value}
                            </#if>
                            <#if trust\-anchors??>
                                <ta:trust-anchors xmlns:ta="urn:ietf:params:xml:ns:yang:ietf-trust-anchors" ibn:audit="terminate">
                                    <#if trust\-anchors.value??>
                                        <#if trust\-anchors.oldValue??>
                                            <ta:pinned-certificates xc:operation="remove">
                                                <ta:name ibn:key="true" ibn:flipAudit="true">${trust\-anchors.oldValue}</ta:name>
                                            </ta:pinned-certificates>
                                        </#if>
                                        <ta:pinned-certificates>
                                            <ta:name ibn:key="true">${trust\-anchors.value}</ta:name>
                                            <ta:pinned-certificate>
                                                <ta:name>${trust\-anchors.value}_ca</ta:name>
                                                <ta:cert>${trust\-anchors.cert}</ta:cert>
                                            </ta:pinned-certificate>
                                        </ta:pinned-certificates>
                                    </#if>
                                </ta:trust-anchors>
                                </#if>
                                <#if cpePreferenceReleases?? && cpePreferenceReleases?has_content>
                                    <cpeswmgmt:cpe-software-management xmlns:cpeswmgmt="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-cpe-software-image-management" ibn:audit="terminate">
                                        <cpeswmgmt:software-preferences>
                                        <#if cpeSoftware.removed??>
                                            <#assign cpeRemoveListAction = true>
                                        <#else>
                                            <#assign cpeRemoveListAction = false>
                                        </#if>
                                        <#list cpePreferenceReleases as key,value >
                                            <#if key != "changed">
                                                <#if cpeRemoveListAction = false>
                                                    <#if value.removed??>
                                                        <cpeswmgmt:preference xc:operation="remove">
                                                            <cpeswmgmt:cpe-type ibn:key="true" ibn:flipAudit="true">${value.cpeType}</cpeswmgmt:cpe-type>
                                                        </cpeswmgmt:preference>
                                                    <#else>
                                                        <cpeswmgmt:preference xc:operation="merge">
                                                            <cpeswmgmt:cpe-type ibn:key="true">${value.cpeType}</cpeswmgmt:cpe-type>
                                                            <cpeswmgmt:preferred-software ibn:key="true">${value.preferredSw}</cpeswmgmt:preferred-software>
                                                            <#if value.isAutoActive??>
                                                                <cpeswmgmt:auto-active ibn:key="true">${value.isAutoActive?string("true","false")}</cpeswmgmt:auto-active>
                                                            </#if>
                                                        </cpeswmgmt:preference>
                                                    </#if>
                                                <#else>
                                                    <cpeswmgmt:preference xc:operation="remove">
                                                        <cpeswmgmt:cpe-type ibn:key="true" ibn:flipAudit="true">${value.cpeType}</cpeswmgmt:cpe-type>
                                                    </cpeswmgmt:preference>
                                                </#if>
                                            </#if>
                                        </#list>
                                    </cpeswmgmt:software-preferences>
                                </cpeswmgmt:cpe-software-management>
                            </#if>
                        </adh:device-specific-data>
                    </#if>
                </adh:device>
            </anv:device-manager>
        </config>
        <#if isAuditSupported?? && !(act\-url?? || act\-file\-on\-server?? || pass\-url?? || pass\-file\-on\-server?? || cpeSoftware?? || ( isNTDevice?? && ((eonuImages?? && eonuImages?has_content) || (eonuVendorSpecificImages?? && eonuVendorSpecificImages?has_content) || trans\-url?? || trans\-file\-on\-server??)))>
            <!-- depth added for getting the device node alone except device-specific-data child node -->
            <!-- the depth should be added after device-manager also we won't face any issue in audit-->
            <depth xmlns="http://www.nokia.com/management-solutions/netconf-extensions">4</depth>
        </#if>
    </edit-config>
</rpc>
