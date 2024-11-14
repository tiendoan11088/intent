<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2023 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template configure call home container in virtualizer   -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <edit-config>
        <target>
            <running/>
        </target>
        <test-option>set</test-option>
        <error-option>rollback-on-error</error-option>
        <config>
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv"
                                xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0"
                                xmlns:ibn="http://www.nokia.com/management-solutions/ibn"
                                xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                <adh:device>
                    <adh:device-id ibn:key="true">${deviceID.value}</adh:device-id>                    
                    <adh:device-specific-data>
                         <conf:configure xmlns:conf="urn:nokia.com:sros:ns:yang:sr:conf">
                            <conf:system>
                                <conf:node-ip>
                                    <#if (ip\-address?? && ip\-address.value?has_content)>
                                        <#if ip\-address.value?contains(":")>
                                            <conf:ipv6>
                                                <conf:address ibn:audit="terminate">${ip\-address.value}</conf:address>
                                            </conf:ipv6>
                                        <#else>
                                            <conf:ipv4>
                                                <conf:address ibn:audit="terminate">${ip\-address.value}</conf:address>
                                            </conf:ipv4>
                                        </#if>    
                                    <#elseif nodeIpInterfaceNameToBeReset?? && nodeIpInterfaceNameToBeReset.value?has_content>
                                        <conf:ipv4>
                                            <conf:interface-name>${nodeIpInterfaceNameToBeReset.value}</conf:interface-name>
                                        </conf:ipv4>
                                        <conf:ipv6>
                                            <conf:interface-name>${nodeIpInterfaceNameToBeReset.value}</conf:interface-name>
                                        </conf:ipv6>
                                    </#if>
                                </conf:node-ip>
                            </conf:system>
                        </conf:configure>
                    </adh:device-specific-data>                    
                </adh:device>
            </anv:device-manager>
        </config>
    </edit-config>
</rpc>
