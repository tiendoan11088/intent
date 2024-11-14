<#ftl output_format="JSON">
<#-- (c) 2023 Nokia. All Rights Reserved. -->
<#-- Retrieves all standard-voip-sip-user that using the specified ontName -->
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "intent-type": "leaf-spine-network"
          }
        },
        {
          "term": {
            "configuration.node-id.keyword": "${cpName}"
          }
        }
      ]
    }
  },
  "size": 1,
  "_source": ["target", "configuration"]
}
