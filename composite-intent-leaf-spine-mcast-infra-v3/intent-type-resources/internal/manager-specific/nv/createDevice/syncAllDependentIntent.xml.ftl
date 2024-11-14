<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
  <trigger-non-persistent-policy-execution xmlns='http://www.nokia.com/management-solutions/policy-engine'>
    <name>SyncAll</name>
    <action>
      <criteria>
        <criteria-id>1</criteria-id>
        <filter-on>targetted-devices</filter-on>
        <values>${target}</values>
        <operator>equal-to</operator>
      </criteria>
      <object-type>intent</object-type>
      <operation>sync-intent</operation>
    </action>
  </trigger-non-persistent-policy-execution>
</rpc>
