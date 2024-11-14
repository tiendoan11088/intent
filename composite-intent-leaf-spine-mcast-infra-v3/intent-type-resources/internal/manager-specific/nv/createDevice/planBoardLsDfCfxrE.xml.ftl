<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template plans FX/MF board -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="6"  xmlns:ibn="http://www.nokia.com/management-solutions/ibn" >
    <edit-config>
        <target>
            <running/>
        </target>
        <config>
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
            <#if networkState.value != "delete" || isAuditSupported??>
                <adh:device xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                    <adh:device-id ibn:key="true">${deviceID.value}</adh:device-id>
                    <adh:device-specific-data>
                        <hw:hardware ibn:topokey="hardware-state" xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware">
                            <#if isTopologyOperation??>
                                <hw:component>
                                    <#if hardware\-type.value == "LS-DF-CFXR-A">
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="1" ibn:topoConfig="true">Chassis</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="2" ibn:topoConfig="true">Board</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="3" ibn:topoConfig="true">Slot-Fan</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="4" ibn:topoConfig="true">Slot-Psu2</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="5" ibn:topoConfig="true">Slot-Psu1</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="6" ibn:topoConfig="true">PON1_PON2_CP1</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="7" ibn:topoConfig="true">PON3_PON4</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="8" ibn:topoConfig="true">PON5_PON6_CP2</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="9" ibn:topoConfig="true">PON7_PON8</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="10" ibn:topoConfig="true">PON9_PON10_CP3</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="11" ibn:topoConfig="true">PON11_PON12</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="12" ibn:topoConfig="true">PON13_PON14_CP4</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="13" ibn:topoConfig="true">PON15_PON16</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="14" ibn:topoConfig="true">FSM1</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="15" ibn:topoConfig="true">FSM2</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="16" ibn:topoConfig="true">FSM3</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="17" ibn:topoConfig="true">FSM4</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="18" ibn:topoConfig="true">FSM5</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="19" ibn:topoConfig="true">FSM6</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="20" ibn:topoConfig="true">FSM7</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="21" ibn:topoConfig="true">FSM8</hw:name>
                                    <#elseif hardware\-type.value == "LS-DF-CFXR-C">
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="1" ibn:topoConfig="true">Chassis</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="2" ibn:topoConfig="true">Board</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="3" ibn:topoConfig="true">Slot-Fan</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="4" ibn:topoConfig="true">Slot-Psu1</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="5" ibn:topoConfig="true">Slot-Psu2</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="6" ibn:topoConfig="true">C1</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="7" ibn:topoConfig="true">C2</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="8" ibn:topoConfig="true">C3</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="9" ibn:topoConfig="true">C4</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="10" ibn:topoConfig="true">C5</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="11" ibn:topoConfig="true">C6</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="12" ibn:topoConfig="true">C7</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="13" ibn:topoConfig="true">C8</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="14" ibn:topoConfig="true">FSM1</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="15" ibn:topoConfig="true">FSM2</hw:name>
                                    <#elseif hardware\-type.value == "LS-DF-CFXR-J">
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="1" ibn:topoConfig="true">Chassis</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="2" ibn:topoConfig="true">Board</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="3" ibn:topoConfig="true">Slot-Fan</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="4" ibn:topoConfig="true">Slot-Psu1</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="5" ibn:topoConfig="true">Slot-Psu2</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="6" ibn:topoConfig="true">C1</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="7" ibn:topoConfig="true">C2</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="8" ibn:topoConfig="true">C3</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="9" ibn:topoConfig="true">C4</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="10" ibn:topoConfig="true">C5</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="11" ibn:topoConfig="true">C6</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="12" ibn:topoConfig="true">C7</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="13" ibn:topoConfig="true">C8</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="14" ibn:topoConfig="true">FSM1</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="15" ibn:topoConfig="true">FSM2</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="16" ibn:topoConfig="true">FSM3</hw:name>
                                            <hw:name ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="17" ibn:topoConfig="true">FSM4</hw:name>
                                    <#else>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="1" ibn:topoConfig="true">Board</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="2" ibn:topoConfig="true">Chassis</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="3" ibn:topoConfig="true">Slot-Fan</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="4" ibn:topoConfig="true">Slot-Psu2</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="5" ibn:topoConfig="true">Slot-Psu1</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="6" ibn:topoConfig="true">C1</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="7" ibn:topoConfig="true">C2</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="8" ibn:topoConfig="true">C3</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="9" ibn:topoConfig="true">C4</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="10" ibn:topoConfig="true">C5</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="11" ibn:topoConfig="true">C6</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="12" ibn:topoConfig="true">C7</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="13" ibn:topoConfig="true">C8</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="14" ibn:topoConfig="true">C9</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="15" ibn:topoConfig="true">C10</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="16" ibn:topoConfig="true">C11</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="17" ibn:topoConfig="true">C12</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="18" ibn:topoConfig="true">C13</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="19" ibn:topoConfig="true">C14</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="20" ibn:topoConfig="true">C15</hw:name>
                                            <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="21" ibn:topoConfig="true">C16</hw:name>
                                            <#if !isIhubSupported??>
                                                <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="22" ibn:topoConfig="true">FSM1</hw:name>
                                                <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="23" ibn:topoConfig="true">FSM2</hw:name>
                                                <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="24" ibn:topoConfig="true">FSM3</hw:name>
                                                <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="25" ibn:topoConfig="true">FSM4</hw:name>
                                                <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="26" ibn:topoConfig="true">Q1</hw:name>
                                            </#if>
                                    </#if>
                                </hw:component>
                            </#if>
                            <hw:component xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware" xc:operation="merge" ibn:audit="terminate">
                                <hw:name ibn:key="true">Chassis</hw:name>
                                <hw:admin-state>unlocked</hw:admin-state>
                                <hw:class xmlns:ianahw="urn:ietf:params:xml:ns:yang:iana-hardware">ianahw:chassis</hw:class>
                                <hw:mfg-name>ALCL</hw:mfg-name>
                            </hw:component>
                            <#list boardlist as board, attr>
                                <#if board != 'changed' && attr.operation != 'skip'>
                                    <#if attr.removed?? || attr.operation == 'remove'>
                                        <#assign action = 'remove'>
                                        <#assign flipAudit = "ibn:flipAudit=\"true\"">
                                    <#else>
                                        <#assign action = attr.operation>
                                        <#assign flipAudit = "">
                                    </#if>
                                    <#if !isAuditSupported??>
                                    <hw:component xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware" xc:operation="merge" ibn:audit="terminate">
                                        <hw:name>${attr.parent}</hw:name>
                                        <hw:admin-state>unlocked</hw:admin-state>
                                        <hw:class xmlns:nokia-hwi="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities">${attr.hardwareSlot}</hw:class>
                                        <hw:parent>Chassis</hw:parent>
                                        <hw:parent-rel-pos>${attr.parentRelPosNr}</hw:parent-rel-pos>
                                    </hw:component>
                                    </#if>
                                    <hw:component xc:operation="${action}" ibn:audit="terminate">
                                        <hw:name ibn:key="true" ibn:topo="true" ibn:side="ENVIRONMENT" ibn:topoVertex="${attr.vertexId}" ibn:topoConfig="true" ${flipAudit?no_esc}>Board-${board}</hw:name>
                                        <#if action != "remove">
                                        <hw:class xmlns:nokia-hwi="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities">${attr.hardware}</hw:class>
                                        <hw:mfg-name>ALCL</hw:mfg-name>
                                        <bbf-hw-ext:model-name xmlns:bbf-hw-ext="urn:bbf:yang:bbf-hardware-extension">${attr.planType}</bbf-hw-ext:model-name>
                                        <#if attr.batteryType??>
                                        <nokia-sdan-hw-bat-mgmt:battery  xmlns:nokia-sdan-hw-bat-mgmt="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-hardware-battery-management">
                                        <nokia-sdan-hw-bat-mgmt:battery-type xmlns:nokia-sdan-hw-bat-mgmt="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-hardware-battery-management">nokia-sdan-hw-bat-mgmt:${attr.batteryType}</nokia-sdan-hw-bat-mgmt:battery-type>
                                        </nokia-sdan-hw-bat-mgmt:battery>
                                        </#if>
                                        <hw:parent>${attr.parent}</hw:parent>
                                        <hw:parent-rel-pos>1</hw:parent-rel-pos>
                                        </#if>
                                    </hw:component>
                                </#if>
                            </#list>
                            <#if isClockMgmtSupported?? && isClockMgmtSupported.value == "true">
                                <#if isClockGNSSInterfaceSupportedForNT?? && isClockGNSSInterfaceSupportedForNT.value == "true" && isClockGNSSDedicatedInOutSupportedForNT?? && isClockGNSSDedicatedInOutSupportedForNT.value == "false">
                                    <hw:component xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware" xc:operation="${operation.value}" ibn:audit="terminate">
                                        <hw:name ibn:key="true">gnss</hw:name>
                                        <#if operation.value != "remove">
                                            <hw:class xmlns:nokia-hwi="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities">nokia-hwi:gnss-port</hw:class>
                                            <hw:parent>Board</hw:parent>
                                            <hw:parent-rel-pos>1</hw:parent-rel-pos>
                                            <hw:admin-state>unlocked</hw:admin-state>
                                            <clock-gnss:gnss xmlns:clock-gnss="urn:ietf:params:xml:ns:yang:nokia-conf-clock-gnss">
                                                <clock-gnss:hw-connector>rj-45</clock-gnss:hw-connector>
                                                <#if !isAuditSupported??>
                                                <clock-gnss:direction>in</clock-gnss:direction>
                                                </#if>
                                                <clock-gnss:serial-param>
                                                    <clock-gnss:baud-rate>9600</clock-gnss:baud-rate>
                                                    <clock-gnss:data-bit>8</clock-gnss:data-bit>
                                                    <clock-gnss:stop-bit>1</clock-gnss:stop-bit>
                                                    <clock-gnss:parity>none</clock-gnss:parity>
                                                </clock-gnss:serial-param>
                                            </clock-gnss:gnss>
                                        </#if>
                                    </hw:component>
                                </#if>
                            </#if>
                            <#if externalAlarmNames??>
                                <#list externalAlarmNames as keyAlarm, externalAlarmItem>
                                    <#if keyAlarm != "changed" && externalAlarmItem??>
                                    <#if externalAlarmItem.removed??>
                                        <#if !skipRemoveAction??>
                                        <hw:component xc:operation="remove" ibn:audit="terminate">
                                            <hw:name ibn:key="true" ibn:flipAudit="true">${keyAlarm}</hw:name>
                                        </hw:component>
                                        </#if>
                                    <#else>
                                        <#if skipRemoveAction??>
                                        <hw:component xc:operation="merge" ibn:audit="terminate">
                                        <#else>
                                        <hw:component xc:operation="${operation.value}" ibn:audit="terminate">
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
                            <#assign scanPointTopoVertexValue = 100>
                            <#if inputScanPoints??>
                                <#list inputScanPoints as key, inputScanPoint>
                                    <#if key != "changed" && inputScanPoint??>
                                        <#if inputScanPoint.removed?? >
                                            <#if !skipRemoveAction?? >
                                            <hw:component xc:operation="remove" ibn:audit="terminate">
                                                <hw:name ibn:key="true" ibn:flipAudit="true">${inputScanPoint.name}</hw:name>
                                            </hw:component>
                                            <#else>
                                            <hw:component xc:operation="merge" ibn:audit="terminate">
                                                <hw:name ibn:key="true">${inputScanPoint.name}</hw:name>
                                                <input-scan-point xmlns="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-external-alarm" xc:operation="remove" ibn:flipAudit="true"/>
                                            </hw:component>
                                            </#if>
                                        <#else>
                                            <#if skipRemoveAction??>
                                            <hw:component xc:operation="merge" ibn:audit="terminate">
                                            <#else>
                                            <hw:component xc:operation="${operation.value}" ibn:audit="terminate">
                                            </#if>
                                                <#assign scanPointTopoVertexValue = scanPointTopoVertexValue + 1>
                                                <hw:name ibn:key="true" ibn:topo="true" ibn:topoConfig="true" ibn:side="ENVIRONMENT" ibn:topoVertex="${scanPointTopoVertexValue}" ibn:topoPreviousVertices="">${inputScanPoint.name}</hw:name>
                                                <#if operation.value != "remove">
                                                <hw:parent>${inputScanPoint.externalAlarm}</hw:parent>
                                                <hw:parent-rel-pos>${inputScanPoint.scan\-point\-position}</hw:parent-rel-pos>
                                                <hw:class xmlns:nokia-hwi="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities">nokia-hwi:alarm-port-input-scan-point</hw:class>
                                                <hw:alias>${inputScanPoint.name}</hw:alias>
                                                <input-scan-point xmlns="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-external-alarm">
                                                    <alarm-severity>${inputScanPoint.alarm\-severity}</alarm-severity>
                                                    <alarm-text>${inputScanPoint.alarm\-text}</alarm-text>
                                                    <polarity>${inputScanPoint.scan\-point\-polarity}</polarity>
                                                    <#if inputScanPoint.output\-scan\-point??>
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
                                            <hw:component xc:operation="remove" ibn:audit="terminate">
                                                <hw:name ibn:key="true" ibn:flipAudit="true">${outputScanPoint.name}</hw:name>
                                            </hw:component>
                                            </#if>
                                        <#else>
                                            <#if skipRemoveAction??>
                                            <hw:component xc:operation="merge" ibn:audit="terminate">
                                            <#else>
                                            <hw:component xc:operation="${operation.value}" ibn:audit="terminate">
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
                        <#if isTimeZoneNameSupported?? && isTimeZoneNameSupported.value == "true">
                            <#if (timezone\-name?? && timezone\-name.value?has_content)>
                                <sys:system xmlns:sys="urn:ietf:params:xml:ns:yang:ietf-system">
                                    <sys:clock ibn:audit="terminate">
                                        <sys:timezone-name>${timezone\-name.value}</sys:timezone-name>
                                    </sys:clock>
                                </sys:system>
                            <#else>
                                <#if (timezone\-name?? && timezone\-name.oldValue?? && timezone\-name.oldValue?has_content)>
                                    <sys:system xmlns:sys="urn:ietf:params:xml:ns:yang:ietf-system">
                                        <sys:clock ibn:audit="terminate">
                                            <sys:timezone-name ibn:flipAudit="true" xc:operation="remove">${timezone\-name.oldValue}</sys:timezone-name>
                                        </sys:clock>
                                    </sys:system>
                                </#if>
                            </#if>
                        </#if>
                    </adh:device-specific-data>
                </adh:device>
            </#if>
            </anv:device-manager>
        </config>
    </edit-config>
</rpc>
