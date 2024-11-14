<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template configures device log  -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="3">
    <edit-config>
        <target>
            <running/>
        </target>
        <config>
            <platform:platform xmlns:platform="http://www.nokia.com/management-solutions/anv-platform">
                <anvlog:logging xmlns:anvlog="http://www.nokia.com/management-solutions/anv-logging">
                    <anvlog:logger-config xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" xc:operation="merge">
                        <anvlog:application>${application}</anvlog:application>
                        <anvlog:log-type>debug</anvlog:log-type>
                        <anvlog:log-scope>device</anvlog:log-scope>
                        <anvlog:device-config xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" xc:operation="${operation}">
                            <anvlog:device-id>${deviceId}</anvlog:device-id>
                            <anvlog:log-level>debug</anvlog:log-level>
                        </anvlog:device-config>
                    </anvlog:logger-config>
                </anvlog:logging>
            </platform:platform>
        </config>
    </edit-config>
</rpc>
