<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2023 Nokia. All Rights Reserved. -->
<#-- Template that is displayed on details page of device-XX intent when software download is triggered -->
<notification xmlns:kfksrc="http://www.nokia.com/management-solutions/kafka-notifications" kfksrc:source="ac" xmlns="urn:ietf:params:xml:ns:netconf:notification:1.0">
    <netconf-state-change xmlns="http://www.nokia.com/management-solutions/anv-netconf-stack">
        <changes>
            <#if ltBoardName??>
                <target xmlns:ibn="http://www.nokia.com/management-solutions/ibn" xmlns:dfx="http://www.nokia.com/management-solutions/${intentType}" >/ibn:ibn/ibn:intent[ibn:target='${intentTargetName}'][ibn:intent-type='${intentType}']/ibn:intent-specific-data/dfx:${intentType}-state/dfx:board-state[dfx:slot-name='${ltBoardName}']</target>
            <#else>
                <target xmlns:ibn="http://www.nokia.com/management-solutions/ibn" xmlns:dfx="http://www.nokia.com/management-solutions/${intentType}">/ibn:ibn/ibn:intent[ibn:target='${intentTargetName}'][ibn:intent-type='${intentType}']/ibn:intent-specific-data/dfx:${intentType}-state</target>
            </#if>
            <#if activeSoftware??>
                <changed-leaf>
                    <item>${activeSoftwareIndex}</item>
                    <value>
                        <actual-active-software-on-device>${activeSoftware}</actual-active-software-on-device>
                    </value>
                </changed-leaf>
            </#if>
            <#if passiveSoftware??>
                <changed-leaf>
                    <item>${passiveSoftwareIndex}</item>
                    <value>
                        <actual-passive-software-on-device>${passiveSoftware}</actual-passive-software-on-device>
                    </value>
                </changed-leaf>
            </#if>
            <#if softwareTargetsAligned??>
                <changed-leaf>
                    <item>${softwareTargetsAlignedIndex}</item>
                    <value>
                        <software-targets-aligned>${softwareTargetsAligned}</software-targets-aligned>
                    </value>
                </changed-leaf>
            </#if>
        </changes>
    </netconf-state-change>
</notification>
