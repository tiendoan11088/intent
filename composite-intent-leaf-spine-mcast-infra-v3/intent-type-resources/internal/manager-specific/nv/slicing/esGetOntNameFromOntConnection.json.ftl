<#ftl output_format="JSON">
<#-- (c) 2021 Nokia. All Rights Reserved. -->
<#-- Retrieves ont name from  ont-connection intent -->
{
    "query": {
        "bool": {
            "must": [
                {
                    "term": {
                        "intent-type": "ont-connection"
                     }
                <#if isQueryString ?? && isQueryString == "true">
                },
                {
                    "query_string": {
                        "fields": ["target.raw"],
                        "query": "${ontName}"
                    }
                }               
                <#else>
                }
                </#if>
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
    "_source": ["target"]
}
