<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2021 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template reset LT Device -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="1">
  <action xmlns="urn:ietf:params:xml:ns:yang:1">
    <device-manager xmlns="http://www.nokia.com/management-solutions/anv">
        <device xmlns="http://www.nokia.com/management-solutions/anv-device-holders">
            <device-id>${deviceID}</device-id>
            <device-specific-data>
              <hardware-state xmlns="urn:ietf:params:xml:ns:yang:ietf-hardware">
                <component>
                  <name>Board</name>
                  <reset xmlns="urn:bbf:yang:bbf-hardware-reset-action">
                    <reset-type xmlns:bbf-hw-rst-act="urn:bbf:yang:bbf-hardware-reset-action">bbf-hw-rst-act:hardware-reset</reset-type>
                  </reset>
                </component>
              </hardware-state>
            </device-specific-data>
        </device>
    </device-manager>
  </action>
</rpc>
