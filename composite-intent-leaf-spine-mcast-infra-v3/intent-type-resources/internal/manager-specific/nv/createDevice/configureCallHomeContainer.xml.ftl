<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2021 Nokia. All Rights Reserved. -->
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
                              <#if (duid?? && duid.value?has_content) || (duid2?? && duid2.value?has_content)>
                                <conf:call-home/>
                              <#else>
                                <conf:call-home ibn:flipAudit="true" xc:operation="remove"/>
                            </#if>
                            </conf:system>
                        </conf:configure>
                    </adh:device-specific-data>                    
                </adh:device>
            </anv:device-manager>
        </config>
    </edit-config>
</rpc>
