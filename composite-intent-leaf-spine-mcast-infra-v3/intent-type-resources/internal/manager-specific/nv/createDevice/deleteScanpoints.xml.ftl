<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2022 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template is used to remove the input and output scanpoints in case of there is a change on external alarm profiles -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="6"  xmlns:ibn="http://www.nokia.com/management-solutions/ibn" >
    <edit-config>
        <target>
            <running/>
        </target>
        <config>
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
            <adh:device xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                <adh:device-id ibn:key="true">${deviceID}</adh:device-id>
                <adh:device-specific-data>
                    <hw:hardware xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware">
                        <#if inputScanPoints??>
                            <#list inputScanPoints as key, inputScanPoint>
                                <#if key != "changed" && key != "removed" && inputScanPoint??>
                                    <hw:component xc:operation="remove">
                                        <hw:name>${inputScanPoint.name}</hw:name>
                                    </hw:component>
                                </#if>
                            </#list>
                        </#if>
                        <#if outputScanPoints??>
                            <#list outputScanPoints as key, outputScanPoint>
                                <#if key != "changed" && key != "removed" && outputScanPoint??>
                                    <hw:component xc:operation="remove">
                                        <hw:name>${outputScanPoint.name}</hw:name>
                                    </hw:component>
                                </#if>
                            </#list>
                        </#if>
                    </hw:hardware>
                </adh:device-specific-data>
            </adh:device>
            </anv:device-manager>
        </config>
    </edit-config>
</rpc>
