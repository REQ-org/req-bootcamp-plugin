import { createMcpHandler } from "mcp-handler";
import { registerPublicDataPacks } from "../lib/public-data/register";

const handler = createMcpHandler(
  (server) => {
    registerPublicDataPacks(server);
  },
  {
    serverInfo: { name: "norge-open-data", version: "1.0.0" },
  },
  { basePath: "/api" }
);

export { handler as GET, handler as POST, handler as DELETE };
