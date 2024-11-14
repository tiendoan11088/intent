<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template retrieves interface version based on hardware type  -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <get>
        <filter type="pruned-subtree">
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
                <plug:device-plugs
                        xmlns:plug="http://www.nokia.com/management-solutions/anv-device-plugs">
                    <plug:device-plug>
                        <plug:hardware-type>${hardwareType}</plug:hardware-type>
                        <plug:interface-version/>
                    </plug:device-plug>
                </plug:device-plugs>
            </anv:device-manager>
        </filter>
    </get>
</rpc>
