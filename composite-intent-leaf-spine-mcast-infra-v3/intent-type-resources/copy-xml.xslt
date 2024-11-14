<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:ibn="http://www.nokia.com/management-solutions/ibn"
                xmlns:cmp="http://www.nokia.com/management-solutions/reference-compo-intent-type"
                version="1.0">
    <xsl:template match="@* | node()">
        <xsl:copy>
          <xsl:apply-templates select="@* | node()"/>
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>
