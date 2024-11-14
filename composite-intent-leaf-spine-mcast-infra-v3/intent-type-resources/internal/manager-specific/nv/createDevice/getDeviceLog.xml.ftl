<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template retrieves device log details  -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <get>
        <filter type="subtree">
            <platform:platform xmlns:platform="http://www.nokia.com/management-solutions/anv-platform">
                <anvlog:logging xmlns:anvlog="http://www.nokia.com/management-solutions/anv-logging">
                    <anvlog:logger-config>
                        <anvlog:application>${application}</anvlog:application>
                        <anvlog:log-type>debug</anvlog:log-type>
                        <anvlog:log-scope>device</anvlog:log-scope>
                        <anvlog:device-config>
                            <anvlog:device-id>${deviceId}</anvlog:device-id>
                        </anvlog:device-config>
                    </anvlog:logger-config>
                </anvlog:logging>
            </platform:platform>
        </filter>
    </get>
</rpc>
