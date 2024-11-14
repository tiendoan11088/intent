<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2023 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request remove replaced LTs -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="1" >
    <edit-config>
        <target>
            <running/>
        </target>
        <config>
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
                <adh:device xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                    <adh:device-id>${deviceID}</adh:device-id>
                    <adh:device-specific-data>
                            <conf:configure xmlns:conf="urn:nokia.com:sros:ns:yang:sr:conf">
                                <#list replacedLTs as board, attr>
                                    <conf:port xc:operation="remove">
									    <conf:port-id>1/${board?replace("LT","")?number + 7}/1</conf:port-id>
								    </conf:port>
                                </#list>
                                    <conf:card>
                                        <conf:slot-number>1</conf:slot-number>
                                        <#list replacedLTs as board, attr>
                                        <conf:mda xc:operation="remove">
                                            <conf:mda-slot>${board?replace("LT","")?number + 7}</conf:mda-slot>  
                                            <#if attr.planned\-type == "FGLT-B">
                                                <conf:mda-type>fglt-b</conf:mda-type>
                                            <#elseif attr.planned\-type == "FWLT-C">
                                                <conf:mda-type>fwlt-c</conf:mda-type>
                                            <#elseif attr.planned\-type == "FGLT-D">
                                                <conf:mda-type>fglt-d</conf:mda-type>
                                            <#elseif attr.planned\-type == "FGUT-A">
                                                <conf:mda-type>fgut-a</conf:mda-type>
                                            <#elseif attr.planned\-type == "LWLT-C">
                                                <conf:mda-type>lwlt-c</conf:mda-type>
                                            <#elseif attr.planned\-type == "LGLT-D">
                                                <conf:mda-type>lglt-d</conf:mda-type>
                                            <#elseif attr.planned\-type == "FELT-B">
                                                <conf:mda-type>felt-b</conf:mda-type>
                                            <#elseif attr.planned\-type == "FELT-D">
                                                <conf:mda-type>felt-d</conf:mda-type>
                                            </#if>       
                                        </conf:mda>
                                        </#list>
                                    </conf:card>
                                <conf:service>
                                    <#list vpipeObject as service, attr>
									    <conf:vpipe xc:operation="remove">
                                            <conf:service-name>${attr}</conf:service-name>
                                        </conf:vpipe>
                                    </#list>
                                    <#list vpipeGroupObject as service, attr>
									    <conf:vpipe-group xc:operation="remove">
                                            <conf:service-name>${attr}</conf:service-name>
                                        </conf:vpipe-group>
                                    </#list>
                                    <#list vplsObject as service, attr>
									    <conf:vpls xc:operation="remove">
                                            <conf:service-name>${attr}</conf:service-name>
                                        </conf:vpls>
                                    </#list>
                                    <#list pipeObject as service, attr>
									    <conf:vpipe-group>
                                            <conf:service-name>${service}</conf:service-name>
                                            <#list attr as pipeNameKey, pipeName>
                                            <conf:pipe xc:operation="remove">
                                                <conf:pipe-name>${pipeName}</conf:pipe-name>
                                            </conf:pipe>
                                            </#list>
                                        </conf:vpipe-group>
                                    </#list>
								</conf:service>
                            </conf:configure>
                        </adh:device-specific-data>
                    </adh:device>
            </anv:device-manager>
        </config>
    </edit-config>
</rpc>
