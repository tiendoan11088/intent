<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template retrieves configuration template name based on hardware type and interface version  -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <get-config>
        <source>
            <running/>
        </source>
        <filter type="pruned-subtree">
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
                <conftpl:configuration-templates
                        xmlns:conftpl="http://www.nokia.com/management-solutions/anv-configuration-templates"
                        xmlns:plug="http://www.nokia.com/management-solutions/anv-device-plugs">
                    <conftpl:configuration-template>
                        <conftpl:name/>
                        <conftpl:hardware-type>${hardwareType}</conftpl:hardware-type>
                        <conftpl:interface-version>${interfaceVersion}</conftpl:interface-version>
                    </conftpl:configuration-template>
                </conftpl:configuration-templates>
            </anv:device-manager>
        </filter>
    </get-config>
</rpc>
