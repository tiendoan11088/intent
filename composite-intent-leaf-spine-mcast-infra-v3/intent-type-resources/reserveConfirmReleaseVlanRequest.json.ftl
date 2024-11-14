{
    "intent_type": "${intentType}",
    "intent_target": "${intentTarget}",
    "strategy": "leaf_spine",
    "services": [
        "mcast_infra"
    ],
    "external_vlans": {
        "cvlan": ${cVlan?c}
    },
    "device_topology": [
        {
            "devices": [
                <#if spineNameList?? && spineNameList?has_content>
                    <#list spineNameList as key,spineName>
                    {
                        "name": "${spineName}",
                        "device_type": "IXR-X1",
                        "target_type": "spine"
                    },
                    </#list>
                </#if>
                <#if accessLeafNames?has_content>
                    <#list accessLeafNames as key,accessLeaf>
                    {
                        "name": "${accessLeaf}",
                        "device_type": "LS-MF",
                        "target_type": "access_leaf"
                    },
                    </#list>
                </#if>
                {
                    "name": "${cpName}",
                    "device_type": "LS-FX",
                    "target_type": "cp_leaf",
                    "interface": "${cpLeafLagLabel}"
                }
            ]
        }
    ]
}