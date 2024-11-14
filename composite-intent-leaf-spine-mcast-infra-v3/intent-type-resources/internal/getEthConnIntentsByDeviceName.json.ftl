<#ftl output_format="JSON">
<#-- (c) 2020 Nokia. All Rights Reserved. -->
<#-- Retrieves all the ont intents from A&A -->
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "intent-type": "ethernet-connection"
          }
        },
        {
            "term": {
                "target.device-name.keyword": "${deviceName}"
            }
        }
      ]
    }
  },
  "size": 40,
  "_source": [
    "target",
    "configuration",
    "part-of-composite"
  ]
}
