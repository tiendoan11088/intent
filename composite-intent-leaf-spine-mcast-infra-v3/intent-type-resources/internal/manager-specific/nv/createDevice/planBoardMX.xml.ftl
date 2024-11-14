<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template plans MX board -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="1"
     xmlns:ibn="http://www.nokia.com/management-solutions/ibn">
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
                        <hw:hardware ibn:topokey="hardware-state" xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware" ibn:audit="terminate">
                            <hw:component xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware" xc:operation="merge">
                                <hw:name ibn:key="true">Chassis</hw:name>
                                <hw:admin-state>unlocked</hw:admin-state>
                                <hw:class xmlns:ianahw="urn:ietf:params:xml:ns:yang:iana-hardware">ianahw:chassis</hw:class>
                            </hw:component>
                            <#assign topoVertexValue = 7>
                            <#assign topoPrevVertexValue = 7>
                            <#if boards??>
                                <#list boards as key, config>
                                    <#if key != 'changed' >
                                        <#if config.removed??>
                                            <hw:component xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware" xc:operation="remove">
                                                <hw:name ibn:key="true" ibn:flipAudit="true">${key}</hw:name>
                                            </hw:component>
                                        <#else>
                                            <hw:component xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware" xc:operation="merge">
                                                <#assign topoVertexValue = topoVertexValue+1>
                                                <#assign topoPrevVertexValue = topoPrevVertexValue+2>
                                                <hw:name ibn:key="true"  ibn:topo="true" ibn:topoConfig="true" ibn:side="ENVIRONMENT" ibn:topoVertex="${topoVertexValue}" ibn:topoPreviousVertices="${topoPrevVertexValue}">${config.slot\-name}</hw:name>
                                                <hw:mfg-name>ALCL</hw:mfg-name>
                                                <hw:admin-state>unlocked</hw:admin-state>
                                                <hw:parent>SLOT-${config.slot\-name}</hw:parent>
                                                <hw:parent-rel-pos>1</hw:parent-rel-pos>
                                                <bbf-hw-ext:model-name xmlns:bbf-hw-ext="urn:bbf:yang:bbf-hardware-extension">${config.planned\-type}</bbf-hw-ext:model-name>
                                                <#if config.slot\-name?contains("LT")>
                                                    <hw:class xmlns:nokia-hwi="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities">nokia-hwi:lt</hw:class>
                                                <#elseif config.slot\-name?contains("NTB")>
                                                    <hw:class xmlns:nokia-hwi="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities">nokia-hwi:ntio</hw:class>
                                                <#else>
                                                    <hw:class xmlns:nokia-hwi="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities">nokia-hwi:nt</hw:class>
                                                </#if>
                                            </hw:component>
                                            <#if isTopologyOperation??>
                                                <hw:component xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware" xc:operation="merge">
                                                    <#assign topoVertexValue = topoVertexValue+1>
                                                    <hw:name ibn:key="true"  ibn:topo="true" ibn:topoConfig="true" ibn:side="ENVIRONMENT" ibn:topoVertex="${topoVertexValue}" ibn:topoPreviousVertices="">SLOT-${config.slot\-name}</hw:name>
                                                </hw:component>
                                            </#if>
                                        </#if>
                                    </#if>
                                </#list>
                            </#if>
                            <#if isTopologyOperation??>
                                <hw:component>
                                    <hw:name ibn:key="true" ibn:topo="true" ibn:topoConfig="true" ibn:side="ENVIRONMENT" ibn:topoVertex="5" ibn:topoPreviousVertices="6">${hwBoard.value}</hw:name>
                                    <hw:name ibn:key="true" ibn:topo="true" ibn:topoConfig="true" ibn:side="ENVIRONMENT" ibn:topoVertex="6" ibn:topoPreviousVertices="">${hwSlot.value}</hw:name>
                                    <hw:name ibn:key="true" ibn:topo="true" ibn:topoConfig="true" ibn:side="ENVIRONMENT" ibn:topoVertex="7" ibn:topoPreviousVertices="">${fan.value}</hw:name>
                                    <#assign topoVertexValue = topoVertexValue+1>
                                    <hw:name ibn:key="true" ibn:topo="true" ibn:topoConfig="true" ibn:side="ENVIRONMENT" ibn:topoVertex="${topoVertexValue}" ibn:topoPreviousVertices="">Chassis</hw:name>
                                </hw:component>
                            </#if>
                        </hw:hardware>
                    </adh:device-specific-data>
                </adh:device>
            </#if>
            </anv:device-manager>
        </config>
    </edit-config>
</rpc>
