<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- Retrieves the next available ALLOC Id -->
<rpc message-id="1" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <get-free-alloc-ids xmlns="http://www.nokia.com/management-solutions/pon-id-allocation">
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
        <#list tcontName?split(",") as name>
            <tcont-name>${name}</tcont-name>
        </#list>
    </get-free-alloc-ids>
</rpc>
