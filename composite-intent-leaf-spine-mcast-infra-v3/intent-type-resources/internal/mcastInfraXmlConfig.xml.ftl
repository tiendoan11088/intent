
<intent-specific-data>
	<mcast-infra
		xmlns='http://www.nokia.com/management-solutions/mcast-infra'>
		<mcast-profile>${mcastProfile}</mcast-profile>
		<query-src-ip-address>${querySourceIpAddress}</query-src-ip-address>
		<l2-infra-services>
			<l2-infra>${l2InfraName}</l2-infra>
			<report-src-ip-address>${reportSourceIpAddress}</report-src-ip-address>
			<#if channelGroups?has_content && channelGroups?size > 0>
				<#list channelGroups as key,channelGroup>
					<multicast-channel-name>${channelGroup}</multicast-channel-name>
				</#list>
			</#if>
		</l2-infra-services>
		<network-infra-for-unmatched-report>${l2InfraName}</network-infra-for-unmatched-report>
	</mcast-infra>
</intent-specific-data>
