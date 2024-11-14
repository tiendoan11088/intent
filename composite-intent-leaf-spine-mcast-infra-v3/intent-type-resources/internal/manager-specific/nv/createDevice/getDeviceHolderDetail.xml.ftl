<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2022 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template retrieves duid based on device name  -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <get>
        <filter type="pruned-subtree">
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv"
                                xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:ibn="http://www.nokia.com/management-solutions/ibn"
                                xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                <adh:device>
                    <adh:device-id>${deviceID}</adh:device-id>
                    <adh:duid/>
                </adh:device>
            </anv:device-manager>
        </filter>
    </get>
</rpc>
