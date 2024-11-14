<#ftl output_format="JSON">
<#-- (c) 2023 Nokia. All Rights Reserved. -->
<#-- Retrieves eth device that using the specified site-id -->
{
 "query": {
   "bool": {
     "must": [
       {
         "term": {
           "intent-type": "device-ixr"
         }
       },
       {
         "terms": {
           "target.device-name.keyword": [
              <#list siteIds as key, value>
                  "${value}"<#if value?has_next>, </#if>
              </#list>
            ]
         }
       }
     ]
   }
 },
 "size": 10,
 "_source": ["target", "configuration"]
}
