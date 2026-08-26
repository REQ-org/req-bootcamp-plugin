/**
 * Public Norwegian open-data packs.
 *
 * Intended reuse: a Varden MCP catalog can import `createPublicDataPacks`
 * or individual `create*Pack` factories and register them on its own host.
 * This module has no course-content or auth coupling.
 */
export { createBrregPack, BRREG_SOURCE } from "./packs/brreg";
export { createKartverketPack, KARTVERKET_SOURCE } from "./packs/kartverket";
export { createSsbPack, SSB_SOURCE } from "./packs/ssb";
export {
  createPublicDataPacks,
  registerPack,
  registerPublicDataPacks,
} from "./register";
export type {
  DataPack,
  FetchLike,
  McpToolHost,
  PackOptions,
  PackTool,
  SourceCredit,
  ToolResult,
} from "./types";
