<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template creates LT ports -->
<rpc message-id="1" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0"
     xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0"
     xmlns:ibn="http://www.nokia.com/management-solutions/ibn" ibn:filterType="subtree">
    <edit-config>
        <target>
            <running/>
        </target>
        <config>
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
                <#if networkState.value != "delete" || isAuditSupported??>
                    <adh:device xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                        <adh:device-id ibn:key="true" ibn:hidden="true" ibn:side="ENVIRONMENT" ibn:topo="true">${deviceID.value}</adh:device-id>
                        <adh:device-specific-data>
                            <conf:configure xmlns:conf="urn:nokia.com:sros:ns:yang:sr:conf">
                                <#if boards??>
                                    <#list boards as board, attr>
                                        <#if board !="changed" && board?contains("LT")>
                                            <#assign flipAudit = "">
                                            <#assign action = operation.value>
                                            <#if attr.removed?? && action != "remove">
                                                <#assign action = "remove">
                                                <#assign flipAudit = "ibn:flipAudit=\"true\"">
                                            </#if>
                                            <conf:port xc:operation="${action}" ibn:audit="terminate">
                                                <conf:port-id ibn:key="true" ${flipAudit?no_esc}>1/${board?replace("LT","")?number + 7}/1</conf:port-id>
                                                <conf:admin-state>enable</conf:admin-state>
                                                <#if attr.backplane\-kr\-capability?? && attr.backplane\-kr\-capability.value?? || (attr.board\-service\-profile?? && attr.board\-service\-profile?contains("Uplink-Mode"))
                                                    ||  (attr.pbit\-remarking?? && attr.pbit\-remarking.value??)>
                                                    <conf:ethernet>
                                                        <#if attr.backplane\-kr\-capability?? && attr.backplane\-kr\-capability.value??>
                                                            <conf:autonegotiate>true</conf:autonegotiate>
                                                            <conf:backplane>
                                                                <conf:backplane-kr>
                                                                    <conf:capability>${attr.backplane\-kr\-capability.value}</conf:capability>
                                                                </conf:backplane-kr>
                                                            </conf:backplane>
                                                        </#if>
                                                        <#if  (attr.board\-service\-profile?? && attr.board\-service\-profile?contains("Uplink-Mode"))>
                                                            <conf:category>regular</conf:category>
                                                        </#if>
                                                        <#if attr.pbit\-remarking?? && attr.pbit\-remarking.removed?? >
                                                             <conf:remark ibn:flipAudit="true" xc:operation="remove"/>
                                                         <#elseif attr.pbit\-remarking?? && attr.pbit\-remarking.value?? && attr.pbit\-remarking.value?has_content >
                                                           	<conf:remark>${attr.pbit\-remarking.value}</conf:remark>
                                                        </#if>								
                                                    </conf:ethernet>
                                                </#if>
                                                <#if isCrossNtLoadSharingSupported?has_content && isCrossNtLoadSharingSupported.value?has_content && isCrossNtLoadSharingSupported.value == true>
                                                    <#if  (attr.board\-service\-profile?? && attr.board\-service\-profile?contains("Uplink-Mode"))>
                                                        <conf:forwarding-scope>local</conf:forwarding-scope>
                                                    <#else>
                                                        <#if isUplinkPresentInShelf?has_content && isUplinkPresentInShelf.value?has_content && isUplinkPresentInShelf.value == true >
                                                            <conf:forwarding-scope>local</conf:forwarding-scope>
                                                        <#else>
                                                            <conf:forwarding-scope>load-sharing</conf:forwarding-scope>
                                                        </#if>
                                                    </#if>
                                                </#if>
                                            </conf:port>
                                        </#if>
                                    </#list>
                                </#if>
                                <conf:card>
                                    <conf:slot-number>1</conf:slot-number>
                                    <#if boards??>
				        <#list boards as board, attr>
                                            <#if board !="changed" && (board?contains("LT") || board?contains("NTIO")) && (attr.planned\-type == "FWLT-B" || attr.planned\-type == "FWLT-C" || attr.planned\-type == "FGLT-B" || attr.planned\-type == "FNIO-A" || attr.planned\-type == "FNIO-B" || attr.planned\-type == "FNIO-E" ||  attr.planned\-type == "FGLT-D" || attr.planned\-type == "FGLT-E" || attr.planned\-type == "FGUT-A" || attr.planned\-type == "LWLT-C" || attr.planned\-type == "FELT-B" || attr.planned\-type == "FELT-D"
                                            || attr.planned\-type == "LGLT-D" || attr.planned\-type == "LTIO-A" || attr.planned\-type == "LTIO-B" || attr.planned\-type == "SFDB-A" || attr.planned\-type == "lt")>

                                                <#assign flipAudit = "">
                                                <#assign action = operation.value>
                                                <#if attr.removed?? && action != "remove">
                                                    <#assign action = "remove">
                                                    <#assign flipAudit = "ibn:flipAudit=\"true\"">
                                                </#if>
                                                <#if attr.planned\-type == "FWLT-B" || attr.planned\-type == "FWLT-C" || attr.planned\-type == "FGLT-B" || attr.planned\-type == "FGLT-D" || attr.planned\-type == "FGLT-E" || attr.planned\-type == "FGUT-A" || attr.planned\-type == "LWLT-C" || attr.planned\-type == "FELT-B" || attr.planned\-type == "FELT-D"
                                                || attr.planned\-type == "LGLT-D" || attr.planned\-type == "SFDB-A" || attr.planned\-type == "lt">
                                                    <conf:mda xc:operation="${action}" ibn:audit="terminate">
                                                        <conf:mda-slot ibn:key="true" ${flipAudit?no_esc}>${board?replace("LT","")?number + 7}</conf:mda-slot>
                                                        <#if attr.planned\-type == "FGLT-B">
                                                            <conf:mda-type>fglt-b</conf:mda-type>
                                                        <#elseif attr.planned\-type == "FWLT-B">
                                                            <conf:mda-type>fwlt-b</conf:mda-type>
                                                        <#elseif attr.planned\-type == "FWLT-C">
                                                            <conf:mda-type>fwlt-c</conf:mda-type>
                                                        <#elseif attr.planned\-type == "FGLT-D">
                                                            <conf:mda-type>fglt-d</conf:mda-type>
                                                        <#elseif attr.planned\-type == "FGLT-E">
                                                            <conf:mda-type>fglt-e</conf:mda-type>
                                                        <#elseif attr.planned\-type == "FGUT-A">
                                                            <conf:mda-type>fgut-a</conf:mda-type>
                                                        <#elseif attr.planned\-type == "LWLT-C">
                                                            <conf:mda-type>lwlt-c</conf:mda-type>
                                                        <#elseif attr.planned\-type == "FELT-B">
                                                            <conf:mda-type>felt-b</conf:mda-type>
                                                        <#elseif attr.planned\-type == "FELT-D">
                                                            <conf:mda-type>felt-d</conf:mda-type>
                                                        <#elseif attr.planned\-type == "LGLT-D">
                                                            <conf:mda-type>lglt-d</conf:mda-type>
                                                        <#elseif attr.planned\-type == "SFDB-A">
                                                            <conf:mda-type>sfdb-a</conf:mda-type>
                                                        <#elseif attr.planned\-type == "lt">
                                                            <conf:mda-type>lt</conf:mda-type>
                                                        </#if>
                                                    </conf:mda>
                                                <#elseif attr.planned\-type == "FNIO-A" || attr.planned\-type == "LTIO-A" || attr.planned\-type == "LTIO-B" || attr.planned\-type == "FNIO-E">
                                                    <conf:mda xc:operation="${action}" ibn:audit="terminate">
                                                        <#if board != "NTIO2">
                                                        <conf:mda-slot ibn:key="true" ${flipAudit?no_esc}>6</conf:mda-slot>
                                                        <#else>
                                                        <conf:mda-slot ibn:key="true" ${flipAudit?no_esc}>7</conf:mda-slot>
                                                        </#if>
                                                        <#if attr.serviceProfile??>
                                                            <#if attr.serviceProfile.mda\-type??>
                                                                <conf:mda-type>${attr.serviceProfile.mda\-type}</conf:mda-type>
							    </#if>
							    <#if isMdaLoopbackModeSupportedForIHUB??> 
  	 	                                                <#if attr.serviceProfile.mda\-loopback\-mode?? && isMdaLoopbackModeSupportedForIHUB.value == true>
  	 	                                                    <conf:mda-loopback-mode>${attr.serviceProfile.mda\-loopback\-mode}</conf:mda-loopback-mode>
  	 	                                                </#if>
  	 	                                            <#else>	
                                                                <#if attr.serviceProfile.mda\-loopback\-mode??>
                                                                    <conf:mda-loopback-mode>${attr.serviceProfile.mda\-loopback\-mode}</conf:mda-loopback-mode>
							        </#if>
						            </#if> 
                                                        </#if>
                                                    </conf:mda>
                                                <#elseif attr.planned\-type == "FNIO-B">
                                                    <conf:mda xc:operation="${action}" ibn:audit="terminate">
                                                        <conf:mda-slot ibn:key="true" ${flipAudit?no_esc}>6</conf:mda-slot>
                                                        <conf:mda-type>fniob-fib</conf:mda-type>
                                                        <#if attr.serviceProfile?? && attr.serviceProfile.mda\-loopback\-mode??>
                                                            <conf:mda-loopback-mode>${attr.serviceProfile.mda\-loopback\-mode}</conf:mda-loopback-mode>
                                                        </#if>
                                                    </conf:mda>
                                                    <conf:mda xc:operation="${action}" ibn:audit="terminate">
                                                        <conf:mda-slot ibn:key="true" ${flipAudit?no_esc}>7</conf:mda-slot>
                                                        <#if attr.serviceProfile??>
                                                            <#if attr.serviceProfile.combo\-mda\-type??>
                                                                <conf:mda-type>${attr.serviceProfile.combo\-mda\-type}</conf:mda-type>
                                                            </#if>
                                                            <#if attr.serviceProfile.mda\-loopback\-mode??>
                                                                <conf:mda-loopback-mode>${attr.serviceProfile.mda\-loopback\-mode}</conf:mda-loopback-mode>
                                                            </#if>
                                                        </#if>
                                                    </conf:mda>
                                                </#if>
                                            </#if>
                                        </#list>
                                    </#if>
                                </conf:card>
                                <#if isTimeZoneNameSupportedForIHUB?? && isTimeZoneNameSupportedForIHUB.value == true>
                                    <#if (zoneAbbreviation?? && zoneAbbreviation.value?has_content)>
                                    <conf:system>
                                        <conf:time>
                                            <conf:zone>
                                                <conf:standard ibn:audit="terminate">
                                                    <conf:name>${zoneAbbreviation.value}</conf:name>
                                                </conf:standard>
                                            </conf:zone>
                                        </conf:time>
                                    </conf:system>
                                    </#if>
                                </#if>
                            </conf:configure>

                        </adh:device-specific-data>
                    </adh:device>
                </#if>
            </anv:device-manager>
        </config>
    </edit-config>
</rpc>
