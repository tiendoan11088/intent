<#ftl output_format="XML">
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="21">
    <get-associated-profiles xmlns="http://www.nokia.com/management-solutions/profile-mgr">
        <filter>
            <intent-type>${intentType}</intent-type>
            <intent-type-version>${intentVersion}</intent-type-version>
        </filter>
        <page-size>300</page-size>
    </get-associated-profiles>
</rpc>
