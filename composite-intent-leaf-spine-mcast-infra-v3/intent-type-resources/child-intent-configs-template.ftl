<cic:child-intent-configs xmlns:cic="http://www.nokia.com/management-solutions/composite-intents/child-intent-configs" 
                          xmlns:ibn="http://www.nokia.com/management-solutions/ibn" 
                          xmlns:nc="urn:ietf:params:xml:ns:netconf:base:1.0">
<#list childIntentConfigs?keys as key>
	<cic:child-intent>
		<cic:name>${key}</cic:name>
		${childIntentConfigs[key]['intent-config']}
	</cic:child-intent>
</#list>
</cic:child-intent-configs>
