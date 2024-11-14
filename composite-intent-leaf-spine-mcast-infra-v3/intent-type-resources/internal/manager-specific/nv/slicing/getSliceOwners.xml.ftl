<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2021 Nokia. All Rights Reserved. -->
<#-- This request template is deleting VPLS service by C-VlanId -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
    <get>
        <filter type="subtree">
            <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
                <slicing:slice-owners xmlns:slicing="http://www.nokia.com/management-solutions/anv-network-slicing">
                    <slicing:slice-owner>
                        <slicing:name/>
                    </slicing:slice-owner>
                </slicing:slice-owners>
            </anv:device-manager>
        </filter>
    </get>
</rpc>
         
