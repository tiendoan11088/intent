<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- Retrieves the free multicast gemport id -->
<rpc message-id="1" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
   <get-free-multicast-gemport-id xmlns="http://www.nokia.com/management-solutions/pon-id-allocation">
        <channel-group-name>${channelGroupName}</channel-group-name>  
        <xpon-type xmlns:xpon-types="urn:bbf:yang:bbf-xpon-types">xpon-types:${xponType}</xpon-type>        
    </get-free-multicast-gemport-id>
</rpc>
