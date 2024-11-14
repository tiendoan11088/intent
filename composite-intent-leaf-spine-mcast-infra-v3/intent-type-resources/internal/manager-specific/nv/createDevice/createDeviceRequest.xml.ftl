<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template creates device in virtualizer   -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <edit-config>
        <target>
            <running/>
        </target>
        <test-option>set</test-option>
        <error-option>rollback-on-error</error-option>
        <config>
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv"
                                xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0"
                                xmlns:ibn="http://www.nokia.com/management-solutions/ibn"
                                xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
                <adh:device xc:operation="${operation.value}">
                    <#if isDeleteLsDeviceForRollbackReinit?? && isDeleteLsDeviceForRollbackReinit.value == true >
                        <adh:device-id>${deviceID.value}</adh:device-id>
                    <#else>
                        <adh:device-id ibn:key="true" ibn:flipAudit="true" ibn:flipDeviceId="true" ibn:hidden="true" ibn:side="ENVIRONMENT" ibn:topo="true">${deviceID.value}</adh:device-id>
                    </#if>
                    <#if operation.value != "remove" >
                        <#if !(isAuditSupported??)>
                            <#if isCreateDevice??>
                                <adh:hardware-type>${hardware\-type.value}</adh:hardware-type>
                                <#if isIhubVersionConfigured?? && isIhubVersionConfigured.value == true> 
                                    <adh:interface-version>${ihub\-version.value}</adh:interface-version>
                                <#else>
                                    <adh:interface-version>${device\-version.value}</adh:interface-version>
                                </#if>
                            </#if>
                        </#if>
                        <#if ip\-address??>
                            <adh:configured-device-properties ibn:audit="terminate">
                                <adh:ip-address>${ip\-address.value}</adh:ip-address>
                                <adh:ip-port>${ip\-port.value}</adh:ip-port>
                                <adh:transport-protocol>${transport\-protocol.value}</adh:transport-protocol>
                                <adh:pma-authentication-method>username-and-password</adh:pma-authentication-method>
                                <#if username??>
                                    <adh:username>${username.value}</adh:username>
                                </#if>
                                <#if password??>
                                    <adh:password ibn:senstive-data="true">${password.value}</adh:password>
                                </#if>
                                <#if fallback\-username??>
                                    <adh:fallback-username>${fallback\-username.value}</adh:fallback-username>
                                </#if>
                                <#if fallback\-password??>
                                    <adh:fallback-password ibn:senstive-data="true">${fallback\-password.value}</adh:fallback-password>
                                </#if>
                                <#if isSshHostKeyLearningSupported?? && isSshHostKeyLearningSupported.value == "true">
                                    <adh:ssh-host-key-handling>learned</adh:ssh-host-key-handling>
                                </#if>
                            </adh:configured-device-properties>
                        <#elseif duid?? || duid2??>
                          <#if duid?? && duid.value?has_content>
                            <adh:duid ibn:audit="terminate">${duid.value}</adh:duid>
                          <#else>  
                            <adh:duid ibn:audit="terminate" ibn:flipAudit="true" xc:operation="remove"/>
                          </#if>
                          <#if isDuid2Supported?? && isDuid2Supported.value == true>
                            <#if duid2?? && duid2.value?has_content>
                                <adh:duid2 ibn:audit="terminate">${duid2.value}</adh:duid2>
                            <#else>  
                                <adh:duid2 ibn:audit="terminate" ibn:flipAudit="true" xc:operation="remove"/>
                            </#if>
                          </#if>
                        </#if>
                        <#if !(isAuditSupported??)>
                            <#if isCreateDevice??>
                            <adh:device-specific-data>
                                <#if navDeviceSpecificData??>
                                    ${navDeviceSpecificData.value?no_esc}
                                </#if>
                            </adh:device-specific-data>
                            </#if>
                        </#if>
                        <#if isAuditSupported?? && push\-nav\-configuration\-to\-device.value != "false">
                            <adh:push-nav-configuration-to-device ibn:audit="terminate">${push\-nav\-configuration\-to\-device.value}</adh:push-nav-configuration-to-device>
                        <#else>
                            <adh:push-nav-configuration-to-device>${push\-nav\-configuration\-to\-device.value}</adh:push-nav-configuration-to-device>
                        </#if>
                        <#if configuredLabels?? && configuredLabels?has_content>
                            <tag:configured-labels xmlns:tag="http://www.nokia.com/management-solutions/anv-device-tag">
                                <#list configuredLabels as labelName, labelValue>
                                    <tag:label ibn:audit="terminate" xc:operation="${operation.value}">
                                        <tag:name ibn:key="true">${labelName}</tag:name>
                                        <tag:value>${labelValue.value}</tag:value>
                                    </tag:label>
                                </#list>
                            </tag:configured-labels>
                        </#if>
                    </#if>
                </adh:device>
            </anv:device-manager>
            <!-- #if isAuditSupported?? -->
                <!-- Removed depth as with the ibn audit terminate flag not anymore put on the device container -->
                <!-- the get-config issued by the audit is not anymore leading to retrieval of the full -->
                <!-- device-specific-data. Kept as reference in case it would have to be re-enabled later on. -->
                <!-- The depth value would then have to be re-adjusted to make sure configured-device-properties -->
                <!-- leaves are included in the response. -->
                <!-- depth added for getting the device node alone except device-specific-data child node -->
                <!-- the depth should be added after device-manager also we won't face any issue in audit -->
                <!-- depth xmlns="http://www.nokia.com/management-solutions/netconf-extensions">4</depth -->
            <!-- /#if -->
        </config>
    </edit-config>
</rpc>
