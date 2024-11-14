<#ftl output_format="JSON">
<#-- (c) 2021 Nokia. All Rights Reserved. -->
<#-- Retrieves fiber intent configuration -->
{
    "query": {
        "bool": {
            "must": [
                {
                    "term": {
                        "intent-type": "fiber"
                     }
                },
                <#if fiberIntentVersion??>
                    {
                        "term": {
                            "intent-type-version": "${fiberIntentVersion}"
                        }
                    },
                </#if>

                {
                    "term": {
                        "target.raw": "${fiberName}"
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
    "_source": ["configuration.xpon-type","configuration.device-name","configuration.pon-id"]
}
