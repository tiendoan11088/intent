<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2021 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="6"  xmlns:ibn="http://www.nokia.com/management-solutions/ibn" >
   <edit-config>
       <target>
           <running/>
       </target>
       <config>
           <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
           <#if networkState.value != "delete" || isAuditSupported??>
               <adh:device xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                   <adh:device-id ibn:key="true">${deviceID.value}</adh:device-id>                    
                    <adh:device-specific-data>
                        <#if isClockMgmtSupported?? && isClockMgmtSupported.value == true>
                            <if:interfaces xmlns:if="urn:ietf:params:xml:ns:yang:ietf-interfaces">
                                <if:interface ibn:audit="terminate">
                                    <if:name ibn:key="true">BP_Eth</if:name>
                                    <clock-frequency:ssm-in xmlns:clock-frequency="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-conf-clock-frequency">
                                        <clock-frequency:ssm-in-enable>true</clock-frequency:ssm-in-enable>
                                    </clock-frequency:ssm-in>
                                </if:interface>
                            </if:interfaces>
                        </#if>
                        <#if isTimeZoneNameSupportedForLT?? || isHostIdConfigurationSupported??>
                            <sys:system xmlns:sys="urn:ietf:params:xml:ns:yang:ietf-system">
                                <#if isTimeZoneNameSupportedForLT?? && isTimeZoneNameSupportedForLT.value == true>
                                    <#if (timezone\-name?? && timezone\-name.value?has_content)>
                                        <sys:clock ibn:audit="terminate">
                                            <sys:timezone-name>${timezone\-name.value}</sys:timezone-name>
                                        </sys:clock>
                                    <#else>
                                        <#if (timezone\-name?? && timezone\-name.oldValue?? && timezone\-name.oldValue?has_content)>
                                            <sys:clock ibn:audit="terminate">
                                                <sys:timezone-name ibn:flipAudit="true" xc:operation="remove">${timezone\-name.oldValue}</sys:timezone-name>
                                            </sys:clock>
                                        </#if>
                                    </#if>
                                </#if>
                                <#if isHostIdConfigurationSupported?? && isHostIdConfigurationSupported.value == true>
                                    <#if hostId?? && hostId.value??>
                                        <#if (hostId.value == "not-configured")>
                                        <nokia-sdan-vmac-host-id-aug:host-id xmlns:nokia-sdan-vmac-host-id-aug="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-vmac-host-id-aug" ibn:audit="terminate">
                                            <nokia-sdan-vmac-host-id-aug:host-id ibn:flipAudit="true" xc:operation="remove"/>
                                        </nokia-sdan-vmac-host-id-aug:host-id>
                                        <#else>
                                        <nokia-sdan-vmac-host-id-aug:host-id xmlns:nokia-sdan-vmac-host-id-aug="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-vmac-host-id-aug" ibn:audit="terminate">
                                            <nokia-sdan-vmac-host-id-aug:host-id>${hostId.value}</nokia-sdan-vmac-host-id-aug:host-id>
                                        </nokia-sdan-vmac-host-id-aug:host-id>
                                        </#if>
                                    </#if>
                                </#if>
                            </sys:system>
		        </#if>
                        <#if isServiceActivationTestSupported?? && isServiceActivationTestSupported.value == true >
			    <nokia-sdan-sat:service-activation-test xmlns:nokia-sdan-sat="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-ethernet-service-activation-test" ibn:audit="terminate">
				    <nokia-sdan-sat:service-activation-test-enable>${enable\-SAT.value}</nokia-sdan-sat:service-activation-test-enable>
                            </nokia-sdan-sat:service-activation-test>
                        </#if>
                    </adh:device-specific-data>                    
                </adh:device>
           </#if>
           </anv:device-manager>
       </config>
        <#if isAuditSupported?? && !(isTimeZoneNameSupportedForLT?? || isHostIdConfigurationSupported?? || (isClockMgmtSupported?? && isClockMgmtSupported.value == true))>
            <!-- depth added for getting the device node alone except device-specific-data child node -->
            <!-- the depth should be added after device-manager also we won't face any issue in audit-->
            <depth xmlns="http://www.nokia.com/management-solutions/netconf-extensions">4</depth>
        </#if>
   </edit-config>
</rpc>
