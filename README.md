# Gemini Search

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that provides Google Search functionality using Gemini's search capabilities.

## Features

- Real-time web search results with Google Search integration
- Uses [api-key.info](https://api-key.info) service with Gemini-compatible API
- Compliant with MCP standard protocol
- Supports stdio transport
- Lightweight single-file implementation

## Requirements

- Node.js 18 or later
- API key from [api-key.info](https://api-key.info) (Gemini-compatible service)

## Installation

```bash
npm install -g gemini-search
```

## Usage

### Environment Variables

```bash
export GEMINI_API_KEY="your-api-key-here"                                    # Required
export GEMINI_MODEL="gemini-2.5-pro"                                        # Optional (default: gemini-2.5-pro)
export GEMINI_BASE_URL="https://api-key.info"                               # Optional (default: https://api-key.info)
```

### Claude Code Configuration

```bash
# Add to user scope with minimal configuration
claude config add-server gemini-search npm:gemini-search --env GEMINI_API_KEY=your-api-key

# Add with custom model and base URL
claude config add-server gemini-search npm:gemini-search \
  --env GEMINI_API_KEY=your-api-key \
  --env GEMINI_MODEL=gemini-2.5-pro \
  --env GEMINI_BASE_URL=https://api-key.info
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
        "GEMINI_API_KEY": "your-api-key-here",
        "GEMINI_MODEL": "gemini-2.5-pro",
        "GEMINI_BASE_URL": "https://api-key.info"
      }
    }
  }
}
```

## Development

```bash
git clone https://github.com/z23cc/gemini-search.git
cd gemini-search
npm install
npm start
```

## Author

**z23cc** <admin@z23.cc>

- GitHub: [@z23cc](https://github.com/z23cc)

## License

MIT License