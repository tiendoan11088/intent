<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2023 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request remove replaced LTs -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0" xmlns:xc="urn:ietf:params:xml:ns:netconf:base:1.0" message-id="6">
	<edit-config>
		<target>
			<running/>
		</target>
		<config>
			<mds:local-attributes xmlns:mds="http://www.nokia.com/management-solutions/manager-directory-service">
				<mds:device xc:operation="remove">
					<mds:name>${sVlanDeviceName}</mds:name>
				</mds:device>
				<mds:device xc:operation="remove">
					<mds:name>${ontMovementDeviceName}</mds:name>
				</mds:device>
			</mds:local-attributes>
		</config>
	</edit-config>
</rpc>
