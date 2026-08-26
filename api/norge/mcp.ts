import { createMcpHandler } from "mcp-handler";
import { registerNorgeTools } from "../../lib/norge/register";

const handler = createMcpHandler(
  (server) => {
    registerNorgeTools(server);
  },
  {
    serverInfo: { name: "req-norge", version: "1.0.0" },
  },
  {
    basePath: "/api/norge",
    disableSse: true,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
