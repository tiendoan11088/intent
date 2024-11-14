var ReconcileOutput = Java.type('com.nokia.fnms.controller.ibn.intenttype.spi.ReconcileOutput');
var domUtils = Java.type("org.broadband_forum.obbaa.netconf.api.util.DocumentUtils");
var HashMap = Java.type('java.util.HashMap');
var ArrayList = Java.type('java.util.ArrayList');

function reconcile(input) {
  var xtraInfo;
  var inputTarget = input.getTarget();
  var topology = input.getCurrentTopology();
  var intentConfigList = new ArrayList();
  var childIntentConfigMap = new HashMap();
  var currentConfig = input.getIntentConfiguration();
  var updatedConfigXml;
  if (topology) {
    var xtraInfo = topology.getXtraInfo();
    if (xtraInfo) {
      for (var index in xtraInfo) {
         var key = xtraInfo[index].getKey();
         var value = xtraInfo[index].getValue();
         if (key == "child-intent") {
            var valueJson = JSON.parse(value);
          	for (var childName in valueJson) {
		    	var intentType = valueJson[childName]['intent-type'];
		   		var target = valueJson[childName]['target'];
		        var childIntentMap = new HashMap();
		    	childIntentMap.put("intent-type", intentType);
		        childIntentMap.put("target", target);
		        var intentDetails = ibnService.getIntent(intentType, target);
				if (intentDetails) {
				    var intentConfig = intentDetails.getIntentConfig();
			      	if (intentConfig) {
			      		childIntentMap.put("intent-config", intentConfig);
			      	}
			      	childIntentConfigMap.put(childName, childIntentMap);
				} else {
					logger.error("Intent not present with target '" + target + "' of intent type '"+intentType+"'");
				}
          	}
           	break;
         }
       }
     }
  }
  var virtualArguments;
  if (currentConfig) {
		var virtualArgs = currentConfig.getElementsByTagName("virtual-arguments");
		if (virtualArgs) {
			virtualArguments = virtualArgs.item(0);
		}
  }
  if (childIntentConfigMap) {
	var values = new HashMap();
	values.put("childIntentConfigs", childIntentConfigMap);
	var childIntentConfigsXml = utilityService.processTemplate(resourceProvider.getResource("child-intent-configs-template.ftl"), values);
    if (childIntentConfigsXml) {
	   var transformedConfig;
	   if (virtualArguments) {
	   		transformedConfig = utilityService.transformXml(childIntentConfigsXml, "virtualArguments", virtualArguments, resourceProvider.getResource("reconcile-request-template.xslt"));
       } else {
			transformedConfig = utilityService.transformXml(childIntentConfigsXml, null, null, resourceProvider.getResource("reconcile-request-template.xslt"));
	   }
		if (transformedConfig) {
            var reconciledConfigDocument = domUtils.stringToDocument(transformedConfig);
            var reconciledConfigData = reconciledConfigDocument.getElementsByTagName("configuration");
            if (reconciledConfigData) {
            	var reconciledConfigurationElement = reconciledConfigData.item(0);
                if (reconciledConfigurationElement) {
                  	var reconciledConfiguration = domUtils.documentToString(reconciledConfigurationElement);
                  	logger.debug("Composite Intent reconciledConfiguration {}", reconciledConfiguration);
                }
            }
       }
    }
  }
  return new ReconcileOutput(reconciledConfiguration, null, "false", false, false, null);
}
