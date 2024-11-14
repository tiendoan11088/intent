<#ftl output_format="XML">
<rpc xmlns="urn:ietf:params:xml:ns:netconf:base:1.0">
   <#if fetchFrom == "AV">
      <get-config>
   <#else>
      <get>
   </#if>
        <source>
            <running/>
         </source>
         <#if fetchFrom == "AV">
            <filter type="pruned-subtree">
         <#else>
            <filter type="subtree">
         </#if>
         <anv:device-manager xmlns:anv="http://www.nokia.com/management-solutions/anv">
            <adh:device xmlns:adh="http://www.nokia.com/management-solutions/anv-device-holders">
               <adh:device-id>${deviceID}</adh:device-id>
               <adh:device-specific-data>
                   <nokia-sztp:sztp xmlns:nokia-sztp="http://www.nokia.com/Fixed-Networks/BBA/yang/nokia-sdan-sztp"/>
               </adh:device-specific-data>
            </adh:device>
         </anv:device-manager>
      </filter>
   <#if fetchFrom == "AV">
      </get-config>
   <#else>
      <error-mode xmlns="http://www.nokia.com/management-solutions/netconf-extensions">strict</error-mode>
      </get>
   </#if>
</rpc>
