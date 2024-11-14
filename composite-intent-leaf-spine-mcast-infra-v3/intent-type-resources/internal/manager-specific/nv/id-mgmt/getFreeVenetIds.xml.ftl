<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- Retrieves the next free VENET-ID that needs to be assigned to an ONT under a VENET -->
<rpc message-id="100" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <get-free-venet-ids xmlns="http://www.nokia.com/management-solutions/pon-id-allocation">
    <device-id>${deviceID}</device-id>
    <venet-name>${venetName}</venet-name>
  </get-free-venet-ids>
</rpc>
