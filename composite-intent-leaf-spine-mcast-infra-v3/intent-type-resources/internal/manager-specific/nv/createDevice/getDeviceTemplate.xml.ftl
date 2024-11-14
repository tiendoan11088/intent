<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template retrieves device specific data  -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
	<get-config>
		<source>
			<running />
		</source>
		<filter type="pruned-subtree">
			<anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
				<conftpl:configuration-templates
					xmlns:conftpl="http://www.nokia.com/management-solutions/anv-configuration-templates"
					xmlns:plug="http://www.nokia.com/management-solutions/anv-device-plugs">
					<conftpl:configuration-template>
						<conftpl:name>${device\-template}</conftpl:name>
						<conftpl:hardware-type>${hardware\-type}</conftpl:hardware-type>
						<conftpl:interface-version>${device\-version}</conftpl:interface-version>
						<conftpl:device-specific-data />
					</conftpl:configuration-template>
				</conftpl:configuration-templates>
			</anv:device-manager>
		</filter>
	</get-config>
</rpc>