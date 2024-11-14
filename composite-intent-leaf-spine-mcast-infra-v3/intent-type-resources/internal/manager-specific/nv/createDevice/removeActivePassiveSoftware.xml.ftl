<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template deletes active/passive software & EONU Software -->
<rpc message-id="8053" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <edit-config>
        <target>
            <running/>
        </target>
        <default-operation>none</default-operation>
        <test-option>set</test-option>
        <error-option>rollback-on-error</error-option>
        <config>
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
                <adh:device xmlns:nc="urn:ietf:params:xml:ns:netconf:base:1.0" nc:operation="merge" xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                    <adh:device-id>${deviceID}</adh:device-id>
                    <swmgmt:software xmlns:swmgmt="http://www.nokia.com/management-solutions/anv-software">
                        <#if deleteActiveSoftware??>
                        <swmgmt:target-active-software nc:operation="remove">
                        </swmgmt:target-active-software>
                        </#if>
                        <#if deletePassiveSoftware??>
                        <swmgmt:target-passive-software nc:operation="remove">
                        </swmgmt:target-passive-software>
                        </#if>
                        <#if deleteTransSoftware??>
                            <swmgmt:device-artifacts>
                              <swmgmt:artifacts-to-download nc:operation="remove">
                                <swmgmt:type>transformation-software</swmgmt:type>
                              </swmgmt:artifacts-to-download>
                            </swmgmt:device-artifacts>
                        </#if>
                    </swmgmt:software>
                </adh:device>
            </anv:device-manager>
        </config>
    </edit-config>
</rpc>
