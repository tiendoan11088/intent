<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
<get-config>
   <source>
       <running/>
   </source>
   <filter type="subtree">
       <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
           <adh:device xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
               <adh:device-id>${deviceID}</adh:device-id>
               <adh:device-specific-data>
                   <hw:hardware xmlns:hw="urn:ietf:params:xml:ns:yang:ietf-hardware">
                       <hw:component>
                           <hw:class xmlns:nokia-hwi="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-hardware-identities">nokia-hwi:external-alarm-port</hw:class>
                       </hw:component>
                   </hw:hardware>
               </adh:device-specific-data>
           </adh:device>
       </anv:device-manager>
   </filter>
</get-config>
</rpc>
