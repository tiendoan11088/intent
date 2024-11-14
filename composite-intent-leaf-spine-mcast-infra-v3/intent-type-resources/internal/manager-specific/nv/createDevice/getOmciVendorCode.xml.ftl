<#ftl output_format="XML"><?xml version="1.0" encoding="UTF-8"?>
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- INTERNAL - DO NOT COPY / EDIT -->
<#-- This request template retrieves OMCI vendor code  -->
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
	<get>
		<filter type="pruned-subtree">
			<anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
				<adh:vendor-code-mappings xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
					<adh:vendor-code-mapping>
						<adh:iana-enterprise-number>${ianaEnterpriseNumber}</adh:iana-enterprise-number>
					</adh:vendor-code-mapping>
				</adh:vendor-code-mappings>
			</anv:device-manager>
		</filter>
	</get>
</rpc>
