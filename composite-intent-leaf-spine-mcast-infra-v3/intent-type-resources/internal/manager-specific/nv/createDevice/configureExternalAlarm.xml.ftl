<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2021 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template configure external alarms in virtualizer   -->
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
                <#if networkState.value != "delete" || isAuditSupported??>
                <adh:device>
                    <adh:device-id ibn:key="true">${deviceID.value}</adh:device-id>
                    <#if parentHardwareComponent?? && parentHardwareComponent.value?has_content>
                    <adh:device-specific-data>
                        <hw:hardware ibn:topokey="hardware-state" xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware" ibn:audit="terminate">
                                <#if isDeviceSX??>
                                <hw:component xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware" xc:operation="merge">
                                    <hw:name ibn:key="true">Chassis</hw:name>
                                    <hw:admin-state>unlocked</hw:admin-state>
                                    <hw:class xmlns:ianahw="urn:ietf:params:xml:ns:yang:iana-hardware">ianahw:chassis</hw:class>
                                </hw:component>
                                </#if>
                            <#if externalAlarmNames??>
                                    <#list externalAlarmNames as keyAlarm, externalAlarmItem>
                                        <#if keyAlarm != "changed" && externalAlarmItem??>
                                        <#if externalAlarmItem.removed??>
                                            <#if !skipRemoveAction??>
                                            <hw:component xc:operation="remove">
                                                <hw:name ibn:key="true" ibn:flipAudit="true">${keyAlarm}</hw:name>
                                            </hw:component>
                                            </#if>
                                        <#else>
                                            <#if skipRemoveAction??>
                                            <hw:component xc:operation="merge">
                                            <#else>
                                            <hw:component xc:operation="${operation.value}">
                                            </#if>
                                                <hw:name ibn:key="true">${externalAlarmItem.name}</hw:name>
                                                <#if operation.value != "remove">
                                                <hw:parent>${parentHardwareComponent.value}</hw:parent>
                                                <hw:parent-rel-pos>1</hw:parent-rel-pos>
                                                <hw:class xmlns:nokia-hwi="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities">nokia-hwi:external-alarm-port</hw:class>
                                                </#if>
                                            </hw:component>
                                        </#if>
                                        </#if>
                                    </#list>
                            </#if>
                            <#assign scanPointTopoVertexValue = 1>
                            <#if inputScanPoints??>
                                <#list inputScanPoints as key, inputScanPoint>
                                    <#if key != "changed" && inputScanPoint??>
                                        <#if inputScanPoint.removed??>
                                            <#if !skipRemoveAction??>
                                            <hw:component xc:operation="remove">
                                                <hw:name ibn:key="true" ibn:flipAudit="true">${inputScanPoint.name}</hw:name>
                                            </hw:component>
                                            <#elseif removeInputScanPointAction??>
                                            <hw:component xc:operation="merge">
                                                <hw:name ibn:key="true">${inputScanPoint.name}</hw:name>
                                                <input-scan-point xmlns="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-external-alarm" xc:operation="remove" ibn:flipAudit="true"/>
                                            </hw:component>
                                            </#if>
                                        <#else>
                                            <#if skipRemoveAction??>
                                            <hw:component xc:operation="merge">
                                            <#else>
                                            <hw:component xc:operation="${operation.value}">
                                            </#if>
                                                <#assign scanPointTopoVertexValue = scanPointTopoVertexValue + 1>
                                                <#if (!(isDeviceSX??) || !(noConfigTopo??))>
                                                <hw:name ibn:key="true" ibn:topo="true" ibn:topoConfig="true" ibn:side="ENVIRONMENT" ibn:topoVertex="${scanPointTopoVertexValue}" ibn:topoPreviousVertices="">${inputScanPoint.name}</hw:name>
                                                <#else>
                                                <hw:name ibn:key="true">${inputScanPoint.name}</hw:name>
                                                </#if>
                                                <#if operation.value != "remove">
                                                <hw:parent>${inputScanPoint.externalAlarm}</hw:parent>
                                                <hw:parent-rel-pos>${inputScanPoint.scan\-point\-position}</hw:parent-rel-pos>
                                                <hw:class xmlns:nokia-hwi="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities">nokia-hwi:alarm-port-input-scan-point</hw:class>
                                                <#if !(isDeviceSX??)>
                                                    <hw:alias>${inputScanPoint.name}</hw:alias>
                                                </#if>
                                                <input-scan-point xmlns="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-external-alarm">
                                                    <alarm-severity>${inputScanPoint.alarm\-severity}</alarm-severity>
                                                    <alarm-text>${inputScanPoint.alarm\-text}</alarm-text>
                                                    <polarity>${inputScanPoint.scan\-point\-polarity}</polarity>
                                                    <#if !(isDeviceSX??) && inputScanPoint.output\-scan\-point??>
                                                        <#list inputScanPoint.output\-scan\-point as keyOutputAttachedKey, outputScanPointAttached>
                                                            <#if keyOutputAttachedKey != "changed" && keyOutputAttachedKey != "removed" && outputScanPointAttached??>
                                                                <#if outputScanPointAttached.removed?? || inputScanPoint.output\-scan\-point.removed??>
                                                                    <output-scan-point ibn:flipAudit="true" xc:operation="remove">${outputScanPointAttached.name}</output-scan-point>
                                                                <#else>
                                                                    <output-scan-point>${outputScanPointAttached.name}</output-scan-point>
                                                                </#if>
                                                            </#if>
                                                        </#list>
                                                    </#if>
                                                </input-scan-point>
                                                </#if>
                                            </hw:component>
                                        </#if>
                                    </#if>
                                </#list>
                            </#if>
                            <#if outputScanPoints??>
                            <#assign outputScanParentRelPos = 0>
                                <#list outputScanPoints as key, outputScanPoint>
                                <#assign outputScanParentRelPos = outputScanParentRelPos + 1>
                                    <#if key != "changed" && outputScanPoint??>
                                        <#if outputScanPoint.removed??>
                                            <#if !skipRemoveAction??>
                                            <hw:component xc:operation="remove">
                                                <hw:name ibn:key="true" ibn:flipAudit="true">${outputScanPoint.name}</hw:name>
                                            </hw:component>
                                            </#if>
                                        <#else>
                                            <#if skipRemoveAction??>
                                            <hw:component xc:operation="merge">
                                            <#else>
                                            <hw:component xc:operation="${operation.value}">
                                            </#if>
                                                <hw:name ibn:key="true">${outputScanPoint.name}</hw:name>
                                                <#if operation.value != "remove">
                                                <hw:parent>${outputScanPoint.externalAlarm}</hw:parent>
                                                <hw:parent-rel-pos>${outputScanParentRelPos}</hw:parent-rel-pos>
                                                <hw:class xmlns:nokia-hwi="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities">nokia-hwi:alarm-port-output-scan-point</hw:class>
                                                </#if>
                                            </hw:component>
                                        </#if>
                                    </#if>
                                </#list>
                            </#if>
                        </hw:hardware>
                    </adh:device-specific-data>
                    </#if>
                </adh:device>
                </#if>
            </anv:device-manager>
        </config>
    </edit-config>
</rpc>
