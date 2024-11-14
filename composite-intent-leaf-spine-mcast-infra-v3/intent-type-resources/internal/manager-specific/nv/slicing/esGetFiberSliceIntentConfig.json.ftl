<#ftl output_format="JSON">
<#-- (c) 2022 Nokia. All Rights Reserved. -->
<#-- Retrieves fiber-slice intent configurations using fiber-slice name -->
{
    "query": {
        "bool": {
            "must": [
                {
                    "term": {
                        "intent-type": "fiber-slice"
                     }
                },
                {
                    "term": {
                        "target.raw": "${fiberSliceName}"
                    }
                }
            ]
        }
    },
    "_source": ["configuration.bandwidth-allocation-strategy", "nested-lists"]
}
