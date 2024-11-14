<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2023 Nokia. All Rights Reserved. -->
<#-- Backplane scheduler profile configuration updated here -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0"
     xmlns:ibn="http://www.nokia.com/management-solutions/ibn" ibn:filterType="subtree">
    <edit-config>
        <target>
            <running/>
        </target>
        <config>
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
                <#if networkState.value != "delete">
                    <adh:device xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                        <adh:device-id ibn:key="true">${deviceID.value}</adh:device-id>
                        <adh:device-specific-data>
                                <if:interfaces xmlns:if="urn:ietf:params:xml:ns:yang:ietf-interfaces">
                                    <if:interface>
                                        <if:name>BP_Eth</if:name>
                                        <bbf-qos-tm:tm-root xmlns:bbf-qos-tm="urn:bbf:yang:bbf-qos-traffic-mngt">
                                            <#if queues??>
                                                <#list queues as key, queueValues>
                                                    <bbf-qos-tm:queue xc:operation="${operation.value}" ibn:audit="terminate">
                                                        <bbf-qos-tm:local-queue-id ibn:key="true">${queueValues.local\-queue\-id}</bbf-qos-tm:local-queue-id>
                                                        <bbf-qos-tm:bac-name>BACKPLQ</bbf-qos-tm:bac-name>
                                                        <bbf-qos-tm:priority>${queueValues.priority}</bbf-qos-tm:priority>
                                                        <bbf-qos-tm:weight>${queueValues.weight}</bbf-qos-tm:weight>
                                                    </bbf-qos-tm:queue>
                                                </#list>
                                            </#if>
                                        </bbf-qos-tm:tm-root>
                                    </if:interface>
                                </if:interfaces>

                                <bbf-qos-tm:tm-profiles xmlns:bbf-qos-tm="urn:bbf:yang:bbf-qos-traffic-mngt">
                                    <bbf-qos-tm:bac-entry xc:operation="${operation.value}" ibn:audit="terminate">
                                        <bbf-qos-tm:name ibn:key="true">BACKPLQ</bbf-qos-tm:name>
                                        <#if operation.value != "remove">
                                            <#if configBacEntry.red??>
                                                <bbf-qos-tm:red>
                                                    <bbf-qos-tm:min-threshold>${configBacEntry["red"]["min-threshold"]}</bbf-qos-tm:min-threshold>
                                                    <bbf-qos-tm:max-threshold>${configBacEntry["red"]["max-threshold"]}</bbf-qos-tm:max-threshold>
                                                    <bbf-qos-tm:max-probability>${configBacEntry["red"]["max-probability"]}</bbf-qos-tm:max-probability>
                                                </bbf-qos-tm:red>
                                            <#elseif configBacEntry.taildrop??>
                                                <bbf-qos-tm:taildrop>
                                                    <bbf-qos-tm:max-threshold>${configBacEntry["taildrop"]["max-threshold"]}</bbf-qos-tm:max-threshold>
                                                </bbf-qos-tm:taildrop>
                                            <#elseif configBacEntry.wred??>
                                                <bbf-qos-tm:wred>
                                                    <bbf-qos-tm:color>
                                                        <bbf-qos-tm:green>
                                                            <bbf-qos-tm:min-threshold>${configBacEntry["wred"]["color"]["green"]["min-threshold"]}</bbf-qos-tm:min-threshold>
                                                            <bbf-qos-tm:max-threshold>${configBacEntry["wred"]["color"]["green"]["max-threshold"]}</bbf-qos-tm:max-threshold>
                                                            <bbf-qos-tm:max-probability>${configBacEntry["wred"]["color"]["green"]["max-probability"]}</bbf-qos-tm:max-probability>
                                                        </bbf-qos-tm:green>
                                                        <bbf-qos-tm:yellow>
                                                            <bbf-qos-tm:min-threshold>${configBacEntry["wred"]["color"]["yellow"]["min-threshold"]}</bbf-qos-tm:min-threshold>
                                                            <bbf-qos-tm:max-threshold>${configBacEntry["wred"]["color"]["yellow"]["max-threshold"]}</bbf-qos-tm:max-threshold>
                                                            <bbf-qos-tm:max-probability>${configBacEntry["wred"]["color"]["yellow"]["max-probability"]}</bbf-qos-tm:max-probability>
                                                        </bbf-qos-tm:yellow>
                                                        <bbf-qos-tm:red>
                                                            <bbf-qos-tm:min-threshold>${configBacEntry["wred"]["color"]["red"]["min-threshold"]}</bbf-qos-tm:min-threshold>
                                                            <bbf-qos-tm:max-threshold>${configBacEntry["wred"]["color"]["red"]["max-threshold"]}</bbf-qos-tm:max-threshold>
                                                            <bbf-qos-tm:max-probability>${configBacEntry["wred"]["color"]["red"]["max-probability"]}</bbf-qos-tm:max-probability>
                                                        </bbf-qos-tm:red>
                                                    </bbf-qos-tm:color>
                                                </bbf-qos-tm:wred>
                                            <#elseif configBacEntry.wtaildrop??>
                                                <bbf-qos-tm:wtaildrop>
                                                    <bbf-qos-tm:color>
                                                        <bbf-qos-tm:green>
                                                            <bbf-qos-tm:max-threshold>${configBacEntry["wtaildrop"]["color"]["green"]["max-threshold"]}</bbf-qos-tm:max-threshold>
                                                        </bbf-qos-tm:green>
                                                        <bbf-qos-tm:yellow>
                                                            <bbf-qos-tm:max-threshold>${configBacEntry["wtaildrop"]["color"]["green"]["max-threshold"]}</bbf-qos-tm:max-threshold>
                                                        </bbf-qos-tm:yellow>
                                                        <bbf-qos-tm:red>
                                                            <bbf-qos-tm:max-threshold>${configBacEntry["wtaildrop"]["color"]["green"]["max-threshold"]}</bbf-qos-tm:max-threshold>
                                                        </bbf-qos-tm:red>
                                                    </bbf-qos-tm:color>
                                                </bbf-qos-tm:wtaildrop>
                                            </#if>
                                        </#if>
                                    </bbf-qos-tm:bac-entry>
                                </bbf-qos-tm:tm-profiles>
                        </adh:device-specific-data>
                    </adh:device>
                </#if>
            </anv:device-manager>
        </config>
    </edit-config>
</rpc>
