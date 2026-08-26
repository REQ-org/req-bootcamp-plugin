import type { ZodRawShape } from "zod";

/** Credit line shown on every tool response. Catalog UIs can reuse this. */
export type SourceCredit = {
  id: string;
  name: string;
  url: string;
  license: string;
  licenseUrl: string;
};

export type ToolText = { type: "text"; text: string };

export type ToolResult = {
  content: ToolText[];
  isError?: boolean;
};

export type PackTool = {
  name: string;
  description: string;
  inputSchema: ZodRawShape;
  execute: (args: Record<string, unknown>) => Promise<ToolResult>;
};

/**
 * One open-data connector pack. The Varden catalog can import these
 * objects and register them on any MCP host - no bootcamp/course coupling.
 */
export type DataPack = {
  id: string;
  title: string;
  description: string;
  source: SourceCredit;
  tools: PackTool[];
};

/** Minimal host surface used by `registerPack`. Compatible with mcp-handler. */
export type McpToolHost = {
  tool: (
    name: string,
    description: string,
    schema: ZodRawShape,
    handler: (args: Record<string, unknown>) => Promise<ToolResult>
  ) => unknown;
};

export type FetchLike = typeof fetch;

export type PackOptions = {
  fetchImpl?: FetchLike;
};
