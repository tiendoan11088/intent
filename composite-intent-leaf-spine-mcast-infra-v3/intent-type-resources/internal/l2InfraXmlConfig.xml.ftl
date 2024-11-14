<intent-specific-data>
	<l2-infra xmlns='http://www.nokia.com/management-solutions/l2-infra'>
		<#list nniIds as key,nniId>
			<nni-id>${nniId}</nni-id>
		</#list>
		<vlan-mode>${vlanMode}</vlan-mode>
		<c-vlan-id>${cVlanId?c}</c-vlan-id>
		<forwarder-profile>${forwarderProfile}</forwarder-profile>
		<service-profile>${serviceProfile}</service-profile>
	</l2-infra>
</intent-specific-data>
