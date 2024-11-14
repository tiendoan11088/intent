<#-- (c) 2022 Nokia. All Rights Reserved. -->
<#-- check if DUID is existed in all the DUID from device-dpu  -->
  {
  "query": {
    "bool": {
      "filter": [
        {
          "term": {
            "intent-type": "${intentDevice}"
          }
        },
        {
          "term": {
            "configuration.duid.keyword": "${DUID}"
         }
        }
      ],
      "must_not": [
        {
          "term": {
            "target.raw": "${target}"
          }
        }
      ]
    }
  },
  "size": 1
}
