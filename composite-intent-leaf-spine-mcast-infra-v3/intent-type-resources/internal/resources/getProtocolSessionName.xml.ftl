<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
   <get-config>
     <source>
            <running/>
         </source>
      <filter type="pruned-subtree">
         <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
            <adh:device xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
               <adh:device-id>${deviceID}</adh:device-id>
               <adh:device-specific-data>
                  <npt:protocol-tracing xmlns:npt="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-protocol-tracing">
                     <#list interfaceNames as key, interfaceName>
                     <npt:session>
                        <npt:name/>
                        <npt:interface>${interfaceName}</npt:interface>
                     </npt:session>
                     </#list>
                  </npt:protocol-tracing>
               </adh:device-specific-data>
            </adh:device>
         </anv:device-manager>
      </filter>
   </get-config>
</rpc>
