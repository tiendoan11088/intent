<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2023 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request remove replaced LTs -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="6" >
    <edit-config>
        <target>
            <running/>
        </target>
        <config>
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
                <adh:device xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                    <adh:device-id>${deviceName}</adh:device-id>
                    <adh:device-specific-data>
                        <hw:hardware xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware">
                            <#list replacedBoards as key, board>
                                <hw:component xc:operation="remove">
                                    <hw:name>Board-${board}</hw:name>
                                </hw:component>
                            </#list>
                        </hw:hardware>
                    </adh:device-specific-data>
                </adh:device>
            </anv:device-manager>
        </config>
    </edit-config>
</rpc>
