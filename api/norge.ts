import { createMcpHandler } from "mcp-handler";
import { registerPublicDataPacks } from "../lib/public-data/register";

const handler = createMcpHandler(
  (server) => {
    registerPublicDataPacks(server);
  },
  {
    serverInfo: { name: "norge-open-data", version: "1.0.0" },
  },
  {
    // mcp-handler derives `/<basePath>/mcp` when basePath is set. This
    // function is served at /api/norge, so set the transport path explicitly.
    streamableHttpEndpoint: "/api/norge",
    sseEndpoint: "/api/norge/sse",
    sseMessageEndpoint: "/api/norge/message",
    disableSse: true,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
