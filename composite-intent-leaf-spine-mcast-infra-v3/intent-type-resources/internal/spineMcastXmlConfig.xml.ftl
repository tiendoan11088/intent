<intent-specific-data>
	<spine-mcast
		xmlns='http://www.nokia.com/management-solutions/spine-mcast'>
		<#list cpPorts as key,cpPort>
			<network-ports>${cpPort}</network-ports>
		</#list>
		<#list accessPorts as key,accessPort>
			<access-ports>${accessPort}</access-ports>
		</#list>
		<multicast-profile>${mcastProfile}</multicast-profile>
		<c-vlan-id>${cVlanId?c}</c-vlan-id>
	</spine-mcast>
</intent-specific-data>
