# Gemini Search

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides Google Search functionality.

## Features

- Real-time web search results
- Compliant with MCP standard protocol
- Supports stdio transport
- Lightweight single-file implementation

## Requirements

- Node.js 18 or later
- API key

## Installation

```bash
npm install -g gemini-search
```

## Usage

### Environment Variables

```bash
export GEMINI_API_KEY="your-api-key-here"
export GEMINI_MODEL="gemini-2.5-flash"  # Optional (default: gemini-2.5-flash)
```

### Claude Code Configuration

```bash
# Add to user scope
claude config add-server gemini-search npm:gemini-search --env GEMINI_API_KEY=your-api-key
```

### Manual Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "gemini-search": {
      "command": "npx",
      "args": ["gemini-search"],
      "env": {
        "GEMINI_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Development

```bash
git clone https://github.com/your-repo/gemini-search.git
cd gemini-search
npm install
npm start
```

## License

Apache License 2.0