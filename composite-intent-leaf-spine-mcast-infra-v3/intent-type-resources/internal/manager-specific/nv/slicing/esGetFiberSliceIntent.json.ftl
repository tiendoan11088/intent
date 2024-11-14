<#ftl output_format="JSON">
<#-- (c) 2021 Nokia. All Rights Reserved. -->
<#-- Retrieves bandwidth strategy using fiber name -->
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
                    "query_string": {
                        "fields": ["target.raw"],
                        "query": "${fiberName}"
                    }
                }
            ],
            "must_not": [
                {
                    "match": {
                        "required-network-state": "delete"
                    }
                }
            ]
        }
    },
    "_source": "configuration.bandwidth-allocation-strategy"
}
