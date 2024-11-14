{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "intent-type": "${intentType}"
          }
        },
         {
           "term": {
             "target.raw": "${target}"
           }
         }
      ]
    }
  },
  "size": 1,
  "_source": [
    "target.raw"
  ]
}
