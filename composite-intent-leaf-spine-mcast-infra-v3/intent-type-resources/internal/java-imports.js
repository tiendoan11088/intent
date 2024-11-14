/**
* (c) 2020 Nokia. All Rights Reserved.
*
* INTERNAL - DO NOT COPY / EDIT
**/
var RuntimeException = Java.type('java.lang.RuntimeException');
var ThreadLocal = Java.type('java.lang.ThreadLocal');
var HashMap = Java.type('java.util.HashMap');
var TransformerFactory = Java.type('javax.xml.transform.TransformerFactory');
var OutputKeys = Java.type('javax.xml.transform.OutputKeys');
var DOMSource =  Java.type('javax.xml.transform.dom.DOMSource');
var DOMResult = Java.type('javax.xml.transform.dom.DOMResult');
var StreamResult =  Java.type('javax.xml.transform.stream.StreamResult');
var StreamSource =  Java.type('javax.xml.transform.stream.StreamSource');
var StringWriter = Java.type('java.io.StringWriter');
var StringReader = Java.type('java.io.StringReader');
var StringJava = Java.type('java.lang.String');
var ArrayList = Java.type('java.util.ArrayList');
var Collectors = Java.type('java.util.stream.Collectors');
var IntentLocksClass = Java.type("org.broadband_forum.obbaa.netconf.api.utils.locks.HashLocks");
var IntentStatePKClass = Java.type("com.nokia.fnms.controller.ibn.entity.IntentStatePK");
var XPathFactory = Java.type('javax.xml.xpath.XPathFactory');
var XPathConstants = Java.type('javax.xml.xpath.XPathConstants');
var HashSet = Java.type("java.util.HashSet");
var Arrays = Java.type("java.util.Arrays");
var RequiredNetworkState = Java.type("com.nokia.fnms.controller.ibn.intenttype.spi.RequiredNetworkState");
var SynchronizeInput = Java.type("com.nokia.fnms.controller.ibn.intenttype.spi.SynchronizeInput");
var MisAlignedAttribute = Java.type("com.nokia.fnms.controller.ibn.intenttype.spi.MisAlignedAttribute");
var DocumentUtils = Java.type("org.broadband_forum.obbaa.netconf.api.util.DocumentUtils");
var OptionalObject = Java.type('java.util.Optional');
var Integer = Java.type('java.lang.Integer');
var TreeSet = Java.type('java.util.TreeSet');
var ValidateResult = Java.type("com.nokia.fnms.controller.ibn.intenttype.spi.ValidateResult");
var MigrationResult = Java.type("com.nokia.fnms.controller.ibn.intenttype.spi.MigrationResult");
var AuthUtils = Java.type("com.nokia.anv.app.security.util.AuthzClientAdapterUtils");
var HttpPost = Java.type("org.apache.http.client.methods.HttpPost");
var HttpGet = Java.type("org.apache.http.client.methods.HttpGet");
var HttpPut = Java.type("org.apache.http.client.methods.HttpPut");
var HttpDelete = Java.type("org.apache.http.client.methods.HttpDelete");
var HttpEntity = Java.type("org.apache.http.entity.StringEntity");
var StringEscapeUtils = Java.type('org.apache.commons.lang.StringEscapeUtils');
var IntentProfileInputVO = Java.type("com.nokia.fnms.controller.ibn.intenttype.spi.IntentProfileInputVO");
var JSONObject = Java.type('org.json.JSONObject');
var XML = Java.type('org.json.XML');
var Gson = Java.type('com.google.gson.Gson');
var DeviceRefId = Java.type('com.nokia.anv.netconf.util.DeviceRefId');
var BulkSynchronizeResult = Java.type('com.nokia.fnms.controller.ibn.intenttype.spi.BulkSynchronizeResult');
var BulkMigrationInput = Java.type('com.nokia.fnms.controller.ibn.intenttype.spi.BulkMigrationInput');
var BulkMigrationResult = Java.type('com.nokia.fnms.controller.ibn.intenttype.spi.BulkMigrationResult');
var IntentTypeTarget = Java.type('com.nokia.fnms.controller.ibn.intenttype.spi.IntentTypeTarget');

/**
 * Adding import for IntentScope,
 * IntentScope initialized per intent
 * suggest using ThreadLocal for caching data for sync operations
 */
var IntentScope = Java.type('org.broadband_forum.obbaa.netconf.server.RequestScope');
var IntentContext = Java.type('org.broadband_forum.obbaa.netconf.server.RequestContext');

var ObjectMapper = Java.type('org.codehaus.jackson.map.ObjectMapper');
var ObjectNode = Java.type('org.codehaus.jackson.node.ObjectNode');
var TokenProvider = Java.type('com.nokia.acp.emsclient.proxy.api.TokenProvider');
