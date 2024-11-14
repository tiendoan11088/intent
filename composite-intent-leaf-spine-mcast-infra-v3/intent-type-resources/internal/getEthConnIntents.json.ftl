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
        },
        {
            "term": {
                "configuration.port-type.keyword": "uplink"
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
  "size": 10,
  "_source": [
    "target.raw",
    "targetted-devices",
    "configuration"
  ]
}
