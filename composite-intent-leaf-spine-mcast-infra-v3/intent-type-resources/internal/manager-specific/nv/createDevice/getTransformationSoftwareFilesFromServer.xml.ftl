<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2022 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template retrieves Transformation software files from server  -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="1">
    <get>
        <filter type="pruned-subtree">
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
                <swmgmt:software-management
                        xmlns:swmgmt="http://www.nokia.com/management-solutions/anv-software">
                    <swmgmt:device-software-files-on-server>
                        <swmgmt:number-of-available-files/>
                        <swmgmt:available-file>
                            <swmgmt:package-type>multi-board-package</swmgmt:package-type>
                        </swmgmt:available-file>
                    </swmgmt:device-software-files-on-server>
                </swmgmt:software-management>
            </anv:device-manager>
        </filter>
    </get>
</rpc>
