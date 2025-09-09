#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";

// Google Search implementation
function createGoogleSearchAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
  const baseUrl = process.env.GEMINI_BASE_URL || 'https://api-key.info';
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required. Get your API key from https://api-key.info');
  }
  return { apiKey, model, baseUrl };
}

async function searchGoogle(api, params) {
  const response = await fetch(`${api.baseUrl}/v1beta/models/${api.model}:generateContent?key=${api.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        role: "user", 
        parts: [{ text: params.query }]
      }],
      tools: [{ googleSearch: {} }]
    })
  });

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No results found';
  
  return {
    content: [{ type: "text", text }]
  };
}

const server = new Server(
  {
    name: "gemini-search",
    version: "0.1.1",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const googleSearchAI = createGoogleSearchAI();

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "google_search",
        description: "Performs a web search using Google Search (via the Gemini API) and returns the results. This tool is useful for finding information on the internet based on a query.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The search query to find information on the web.",
            },
          },
          required: ["query"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== "google_search") {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${request.params.name}. Available tools: google_search`
    );
  }

  if (!request.params.arguments) {
    throw new McpError(ErrorCode.InvalidParams, "Missing arguments. Required: query (string)");
  }

  const args = request.params.arguments;

  if (typeof args.query !== "string") {
    throw new McpError(
      ErrorCode.InvalidParams,
      "Invalid arguments: query must be a string. Example: { \"query\": \"search terms\" }"
    );
  }

  try {
    const result = await searchGoogle(googleSearchAI, { query: args.query });
    return { content: result.content };
  } catch (error) {
    throw new McpError(
      ErrorCode.InternalError,
      `Google Search failed: ${error instanceof Error ? error.message : "Unknown error"}. Please check your GEMINI_API_KEY and network connection.`
    );
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Gemini Search MCP server running on stdio - Google Search via Gemini API");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});