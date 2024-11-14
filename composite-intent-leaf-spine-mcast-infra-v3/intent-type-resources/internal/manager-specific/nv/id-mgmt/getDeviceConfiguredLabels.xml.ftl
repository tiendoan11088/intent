<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- Retrieves all the labels that are configured on a particular ONT device -->
<#-- These labels are configured during ont-connection intent -->
<rpc message-id="7" xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <get-config>
        <source>
        <running/>
        </source>
        <filter type="subtree">
            <device-manager xmlns="http://www.nokia.com/management-solutions/anv">
                <device xmlns="http://www.nokia.com/management-solutions/anv-device-holders">
                    <device-id>${deviceID}</device-id>
                    <configured-labels xmlns="http://www.nokia.com/management-solutions/anv-device-tag">
                        <label>
                            <name>channel-group</name>
                        </label>
                        <label>
                            <name>xpon-type</name>
                        </label>
                        <label>
                            <name>olt-devices</name>
                        </label>
                        <label>
                            <name>bandwidth-strategy-type</name>
                        </label>
                    </configured-labels>
                </device>
            </device-manager>
        </filter>
    </get-config>
</rpc>
