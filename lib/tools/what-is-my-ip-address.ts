import { ipToolsConfig } from "@/components/tools/what-is-my-ip-address/faq";

const loadIpTool = () =>
  import("@/components/tools/what-is-my-ip-address/what-is-my-ip-address");

const createIpTool = (
  slug: string,
  title: string,
  description: string,
  keywords: string[]
) => ({
  slug,
  title,
  description,
  keywords,
  receiveSlug: true,
  load: loadIpTool,
});

export const whatIsMyIpAddressTools = {
  "my-ip-address-what-is": createIpTool(
    "my-ip-address-what-is",
    ipToolsConfig["my-ip-address-what-is"].metaTitle,
    ipToolsConfig["my-ip-address-what-is"].metaDescription,
    ipToolsConfig["my-ip-address-what-is"].keywords
  ),

  "what-is-my-ip-address": createIpTool(
    "what-is-my-ip-address",
    ipToolsConfig["what-is-my-ip-address"].metaTitle,
    ipToolsConfig["what-is-my-ip-address"].metaDescription,
    ipToolsConfig["what-is-my-ip-address"].keywords
  ),

  "what-is-my-ip-no": createIpTool(
    "what-is-my-ip-no",
    ipToolsConfig["what-is-my-ip-no"].metaTitle,
    ipToolsConfig["what-is-my-ip-no"].metaDescription,
    ipToolsConfig["what-is-my-ip-no"].keywords
  ),
};

export type WhatIsMyIpAddressSlug = keyof typeof whatIsMyIpAddressTools;