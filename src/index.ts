import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createPublicClient, formatUnits, http } from "viem";
import { monadTestnet } from "viem/chains";

// Create a public client to interact with Monad testnet
const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

// Create MCP server instance
const server = new McpServer({
  name: "monad-mcp-tutorial",
  version: "0.0.1",
  capabilities: ["get-mon-balance"],
});

// Define the get-mon-balance tool
server.tool(
  "get-mon-balance",
  "Get MON balance for an address on Monad testnet",
  {
    address: z.string().describe("Monad testnet address to check balance for"),
  },
  async ({ address }) => {
    try {
      const balance = await publicClient.getBalance({
        address: address as `0x${string}`,
      });
      return {
        content: [
          {
            type: "text",
            text: `Balance for ${address}: ${formatUnits(balance, 18)} MON`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to retrieve balance for address: ${address}. Error: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
);

// Main function to start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Monad testnet MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});



import * as nodeHttp from 'http';

// Your existing MCP server logic here
const nodeServer = nodeHttp.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/mcp') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      const response = handleMCPRequest(body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    });
  } else if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Monad MCP HTTP server is running. Use POST /mcp to interact.');
  } else {
    res.writeHead(404);
    res.end();
  }
});

nodeServer.listen(3000, () => {
  console.log('MCP Server listening on http://localhost:3000');
});

function handleMCPRequest(body: string) {
  try {
    const request = JSON.parse(body);

    // Example: Only handle "get-mon-balance" tool requests
    if (
      request &&
      request.tool === "get-mon-balance" &&
      typeof request.params?.address === "string"
    ) {
      // Synchronously return a placeholder; real logic should be async
      return {
        content: [
          {
            type: "text",
            text: `Received request for address: ${request.params.address}. Please use stdio transport for full functionality.`,
          },
        ],
      };
    } else {
      return {
        error: "Unsupported tool or invalid parameters.",
      };
    }
  } catch (err) {
    return {
      error: "Invalid JSON or request format.",
    };
  }
}

