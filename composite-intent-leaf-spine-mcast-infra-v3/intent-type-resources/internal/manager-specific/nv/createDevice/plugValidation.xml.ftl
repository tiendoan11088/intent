<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template validates plug entries -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
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
                <#if isAuditSupported??>
                    <adh:device ibn:audit="terminate" xc:operation="${operation.value}">
                        <adh:device-id ibn:key="true">${deviceID.value}</adh:device-id>
                        <adh:hardware-type>${hardware\-type.value}</adh:hardware-type>
                        <#if isIhubDevice?? && isIhubDevice.value == true && isIhubVersionConfigured?? && isIhubVersionConfigured.value == true> 
                            <adh:interface-version>${ihub\-version.value}</adh:interface-version>
                        <#else>
                            <adh:interface-version>${device\-version.value}</adh:interface-version>
                        </#if>
                    </adh:device>
                    <#if pairDevice??>
                        <adh:device ibn:audit="terminate">
                            <adh:device-id ibn:key="true">${pairDevice.value}</adh:device-id>
                            <#if isIhubVersionConfigured?? && isIhubVersionConfigured.value == true> 
                                <adh:interface-version>${ihub\-version.value}</adh:interface-version>
                            <#else>
                                <adh:interface-version>${device\-version.value}</adh:interface-version>
                            </#if>
                        </adh:device>
                    </#if>
                </#if>
            </anv:device-manager>
        </config>
        <#if isAuditSupported??>
            <!-- depth added for getting the device node alone except device-specific-data child node -->
            <!-- the depth should be added after device-manager also we won't face any issue in audit-->
            <depth xmlns="http://www.nokia.com/management-solutions/netconf-extensions">4</depth>
        </#if>
    </edit-config>
</rpc>
