<#ftl output_format="JSON">
<#-- (c) 2023 Nokia. All Rights Reserved. -->
<#-- Retrieves all device-fx that is a part of the composite intents -->
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "intent-type": "device-fx"
          }
        },
        {
          "term": {
            "required-network-state": "active"
          }
        }
      ]
    }
  },
  "size": 1000,
  "_source": [
    "target",
    "part-of-composite"
  ]
}
