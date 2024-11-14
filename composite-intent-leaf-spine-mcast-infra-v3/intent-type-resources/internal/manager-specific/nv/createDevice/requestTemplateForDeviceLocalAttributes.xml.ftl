<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template configures devices labels -->
<rpc message-id="1" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0"
     xmlns:ibn="http://www.nokia.com/management-solutions/ibn" ibn:filterType="subtree">
    <edit-config>
        <target>
            <running/>
        </target>
        <config>
            <mds:local-attributes xmlns:mds="http://www.nokia.com/management-solutions/manager-directory-service">
                <mds:device xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" xc:operation="${operation.value}">
                    <mds:name ibn:key="true">${deviceID.value?keep_after("##")}</mds:name>
                    <#if label??>
                        <#if operation.value != "remove">
                            <#list label as key, values>
                                <#if key != "changed">
                                    <#if values.removed??>
                                        <mds:attribute xc:operation="remove">
                                            <mds:name ibn:key="true" ibn:flipAudit="true">${values.category}</mds:name>
                                        </mds:attribute>
                                    <#else>
                                        <mds:attribute>
                                            <mds:name ibn:key="true">${values.category}</mds:name>
                                            <mds:value>${values.value}</mds:value>
                                        </mds:attribute>
                                    </#if>
                                </#if>
                            </#list>
                        </#if>
                    </#if>
                </mds:device>
            </mds:local-attributes>
        </config>
    </edit-config>
</rpc>

