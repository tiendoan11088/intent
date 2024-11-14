<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template retrieves state attributes from virtualizer  -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <get>
        <filter type="pruned-subtree">
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
                <#list deviceNames as position, deviceName>
                <adh:device xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                    <adh:device-id>${deviceName}</adh:device-id>
                    <adh:device-state>
                        <adh:reachable/>
                    </adh:device-state>
                    <swmgmt:progress-reporting xmlns:swmgmt="http://www.nokia.com/management-solutions/anv-software"/>
                    <swmgmt:software xmlns:swmgmt="http://www.nokia.com/management-solutions/anv-software">
                        <swmgmt:active-software/>
                        <swmgmt:passive-software/>
                        <swmgmt:software-targets-aligned/>
                        <swmgmt:active-releases/>
                        <swmgmt:passive-releases/>
                        <swmgmt:software-error-reason/>
                        <swmgmt:device-artifacts/>
                    </swmgmt:software>
                </adh:device>
                </#list>
            </anv:device-manager>
        </filter>
    </get>
</rpc>
