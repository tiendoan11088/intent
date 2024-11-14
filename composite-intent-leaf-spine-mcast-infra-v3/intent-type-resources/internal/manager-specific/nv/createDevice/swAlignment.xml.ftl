<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template validates and upgrades/downgrades software -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:ibn="http://www.nokia.com/management-solutions/ibn" ibn:auditState="true">
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
                    <#if isAuditSupported?? && swImageName??>
                        <#if swImageName??>
                            <adh:interface-version ibn:audit="terminate">${device\-version.value}</adh:interface-version>
                        </#if>
                        <swmgmt:software xmlns:swmgmt="http://www.nokia.com/management-solutions/anv-software" ibn:audit="terminate">
                            <!-- Added for audit misalignment -->
                            <#if swImageName??>
                                <swmgmt:software-targets-aligned ibn:audit="terminate">true</swmgmt:software-targets-aligned>
                            </#if>
                        </swmgmt:software>
                    </#if>
                </adh:device>
            </anv:device-manager>
        </config>
        <#if isAuditSupported?? && !(swImageName??)>
            <!-- depth added for getting the device node alone except device-specific-data child node -->
            <!-- the depth should be added after device-manager also we won't face any issue in audit-->
            <depth xmlns="http://www.nokia.com/management-solutions/netconf-extensions">4</depth>
        </#if>
    </edit-config>
</rpc>
