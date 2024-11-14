<?xml version="1.0"?>
<!--
(c) 2020 Nokia. All Rights Reserved.
    INTERNAL - DO NOT COPY / EDIT
-->
<xsl:stylesheet version="1.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:ibn-admin="http://www.nokia.com/management-solutions/ibn-administration"
                xmlns:ibn="http://www.nokia.com/management-solutions/ibn"
                xmlns:intent-ann="http://www.nokia.com/management-solutions/intent-design-annotations"
                xmlns:nc="urn:ietf:params:xml:ns:netconf:base:1.0"
                xmlns="urn:ietf:params:xml:ns:netconf:base:1.0"
                xmlns:ncext="http://www.nokia.com/management-solutions/netconf-extensions"
                exclude-result-prefixes="xsl">

    <!-- Copy the attributes ALONE from RPC Element to get the namespace definitions. -->
    <xsl:template match="/nc:rpc">
        <rpc>
            <xsl:copy-of select="@*" />
            <xsl:choose>
                <xsl:when test="@ibn:auditState = 'true'">
                    <get>
                        <xsl:choose>
                            <xsl:when test="@ibn:filterType">
                                <xsl:element name="filter">
                                    <xsl:attribute name="type">
                                        <xsl:value-of select="@ibn:filterType"></xsl:value-of>
                                    </xsl:attribute>
                                    <!-- We just need to transform the config into filter -->
                                    <xsl:apply-templates select="nc:edit-config/nc:config/*" />
                                </xsl:element>
                            </xsl:when>
                            <xsl:otherwise>
                                <filter type="subtree">
                                    <!-- We just need to transform the config into filter -->
                                    <xsl:apply-templates select="nc:edit-config/nc:config/*" />
                                </filter>
                            </xsl:otherwise>
                        </xsl:choose>
                        <xsl:choose>
                            <xsl:when test="nc:edit-config/ncext:depth">
                                <xsl:apply-templates select="nc:edit-config/ncext:depth" />
                            </xsl:when>
                        </xsl:choose>
                    </get>
                </xsl:when>
                <xsl:otherwise>
                    <get-config>
                        <source>
                            <running />
                        </source>
                        <xsl:choose>
                            <xsl:when test="@ibn:filterType">
                                <xsl:element name="filter">
                                    <xsl:attribute name="type">
                                        <xsl:value-of select="@ibn:filterType"></xsl:value-of>
                                    </xsl:attribute>
                                    <!-- We just need to transform the config into filter -->
                                    <xsl:apply-templates select="nc:edit-config/nc:config/*" />
                                </xsl:element>
                            </xsl:when>
                            <xsl:otherwise>
                                <filter type="subtree">
                                    <!-- We just need to transform the config into filter -->
                                    <xsl:apply-templates select="nc:edit-config/nc:config/*" />
                                </filter>
                            </xsl:otherwise>
                        </xsl:choose>
                        <xsl:choose>
                            <xsl:when test="nc:edit-config/ncext:depth">
                                <xsl:apply-templates select="nc:edit-config/ncext:depth" />
                            </xsl:when>
                        </xsl:choose>

                    </get-config>
                </xsl:otherwise>
            </xsl:choose>
        </rpc>
    </xsl:template>
    <!-- Actual Transformation -->
    <xsl:template match="@*|node()">
        <xsl:choose>
            <xsl:when test="not(@ibn:audit)">
                <xsl:copy>
                    <xsl:apply-templates select="@*|node()" />
                </xsl:copy>
            </xsl:when>
            <xsl:otherwise>
                <xsl:copy>
                    <xsl:apply-templates select="@*|*[@ibn:key]|node()//*[@ibn:audit]" />
                </xsl:copy>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
</xsl:stylesheet>
