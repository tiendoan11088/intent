<#ftl output_format="JSON">
<#-- (c) 2024 Nokia. All Rights Reserved. -->
<#-- Retrieves specific device-mf configuration -->
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "intent-type": "device-mf"
          }
        },
        {
          "terms": {
            "target.device-name.keyword": [<#list acAccessLeafKeys as key, acAccessLeafName>
                                            "${acAccessLeafName}"<#sep>,</#sep>
                                          </#list>]
          }
        }
      ]
    }
  },
  "size": 50,
  "_source": ["target", "configuration.slot-name"]
}