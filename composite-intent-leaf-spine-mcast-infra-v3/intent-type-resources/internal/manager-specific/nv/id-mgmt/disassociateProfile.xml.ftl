<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2024 Nokia. All Rights Reserved. -->
<rpc xmlns='urn:ietf:params:xml:ns:netconf:base:1.0'>
    <action xmlns="urn:ietf:params:xml:ns:yang:1">
        <profile-mgr xmlns="http://www.nokia.com/management-solutions/profile-mgr">
            <dissociate>
                <profile-type>${profileType}</profile-type>
                <subtype>${subType}</subtype>
                <name>${profileName}</name>
                <version>${profileVersion}</version>
                <intent-type>
                    <name>${intentType}</name>
                    <version>${intentVersion}</version>
                </intent-type>
            </dissociate>
        </profile-mgr>
    </action>
</rpc>
