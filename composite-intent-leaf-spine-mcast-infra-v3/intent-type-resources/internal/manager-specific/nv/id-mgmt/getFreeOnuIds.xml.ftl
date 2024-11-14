<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- Retrieves the next free ONU-ID that needs to be assigned to an ONT under a PON -->
<rpc message-id="1" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <get-free-onu-ids xmlns="http://www.nokia.com/management-solutions/pon-id-allocation">
        <channel-group-name>${channelGroupName}</channel-group-name>
        <#if  xponType == "25g">
            <xpon-type xmlns:xpon-types="urn:bbf:yang:bbf-xpon-types">xpon-types:twentyfivegs</xpon-type>
        <#elseif xponType == "dual-gpon">
            <xpon-type xmlns:xpon-types="urn:bbf:yang:bbf-xpon-types">xpon-types:gpon</xpon-type>
        <#else>
            <xpon-type xmlns:xpon-types="urn:bbf:yang:bbf-xpon-types">xpon-types:${xponType}</xpon-type>
        </#if>
        <#if allowedIdList??>
            <allowed-id-list>${allowedIdList}</allowed-id-list>
        </#if>
        <v-ani-name>${virtualAniInterfaceName}</v-ani-name>
    </get-free-onu-ids>
</rpc>
