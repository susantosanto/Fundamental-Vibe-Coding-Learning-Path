# 14: MCP Dasar

> **Connect external services via Model Context Protocol**

**Estimasi**: 30 menit belajar + 30 menit praktik | **Level**: Intermediate → Advanced

## 🎯 Outcome

Setelah menyelesaikan modul ini, kamu akan:
- Paham MCP protocol secara mendalam (JSON-RPC, transport, capabilities)
- Memahami arsitektur MCP server (stdio vs SSE vs HTTP, lifecycle, tool registration)
- Bisa config local dan remote MCP server di OpenCode
- Bisa build MCP server sendiri dari scratch (Python FastMCP & Node.js SDK)
- Paham MCP security (authentication, authorization, input validation)
- Mengenal resource management dan subscriptions di MCP
- Mengenal MCP prompts (templating, argument validation)
- Bisa troubleshoot masalah koneksi MCP
- Mengenal katalog popular MCP servers

## 🤔 Kenapa Butuh MCP?

### Masalah Sebelum MCP

Sebelum ada MCP, setiap AI application butuh custom integration untuk setiap external service:

```
AI App → Custom Code → GitHub API
AI App → Custom Code → Database
AI App → Custom Code → File System
AI App → Custom Code → Slack API
```

Setiap integration butuh:
- Custom authentication handling
- Custom error handling
- Custom data formatting
- Maintenance per-service

Ini tidak scalable. Bayangkan kalau ada 50 services yang perlu di-connect.

### Solusi: MCP (Model Context Protocol)

MCP adalah **standard protocol** yang memungkinkan AI applications connect ke external tools dengan cara yang **uniform dan standardized**.

```
AI App (MCP Client) → MCP Protocol → MCP Server → External Service
                    (JSON-RPC)
```

Dengan MCP:
- **Satu protocol** untuk semua services
- **Standardized** tool discovery dan execution
- **Pluggable** — tambah server tanpa ubah code AI
- **Secure** — built-in permission model

MCP dibuat oleh Anthropic dan sekarang menjadi **open standard** yang diadopsi oleh banyak AI tools termasuk OpenCode, Claude Desktop, Cursor, dan lainnya.

**Referensi**: [MCP Protocol Specification](https://modelcontextprotocol.io/specification), [vbgate/learn-opencode](https://github.com/vbgate/learn-opencode)

## 🔬 MCP Protocol Deep Dive

### Bagaimana MCP Bekerja

MCP menggunakan **JSON-RPC 2.0** sebagai message format. Setiap komunikasi antara client dan server mengikuti pattern:

```
Client Request → Server Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "filesystem_read_file",
    "arguments": { "path": "/home/user/data.txt" }
  }
}

Server Response:
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "Isi file data.txt..."
      }
    ]
  }
}
```

### Tiga Tipe Message

MCP memiliki tiga tipe message:

1. **Request** — Client minta server lakukan sesuatu
   ```json
   { "jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": {} }
   ```

2. **Response** — Server jawab request
   ```json
   { "jsonrpc": "2.0", "id": 1, "result": { "tools": [...] } }
   ```

3. **Notification** — One-way message (tidak butuh response)
   ```json
   { "jsonrpc": "2.0", "method": "notifications/resources/updated", "params": { ... } }
   ```

### Transport Layers

MCP mendukung beberapa transport layer:

| Transport | Direction | Use Case | Contoh |
|-----------|-----------|----------|--------|
| **stdio** | Bidirectional | Local servers | Filesystem, SQLite, Git |
| **SSE** (Server-Sent Events) | Server→Client streaming | Remote servers | Context7, GitHub Grep |
| **HTTP** (Streamable HTTP) | Bidirectional | Remote servers dengan auth | Custom enterprise servers |

**stdio transport**:
- Client spawn process server sebagai child process
- Komunikasi via stdin/stdout
- Cocok untuk local tools yang butuh akses langsung ke filesystem
- Lebih cepat karena tidak ada network overhead

**SSE transport**:
- Server push events ke client via HTTP stream
- Client send requests via HTTP POST
- Cocok untuk remote services
- Support connection persistence

**HTTP Streamable transport** (MCP 2025-03-26+):
- Full bidirectional via HTTP
- Support stateful sessions
- Lebih scalable untuk production

### Capabilities Negotiation

Saat pertama kali connect, client dan server negotiate capabilities:

```
Client → Server: initialize
{
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {}
    },
    "clientInfo": { "name": "opencode", "version": "1.0.0" }
  }
}

Server → Client: initialize response
{
  "result": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "tools": { "listChanged": true },
      "resources": { "subscribe": true, "listChanged": true },
      "prompts": { "listChanged": true }
    },
    "serverInfo": { "name": "filesystem", "version": "1.0.0" }
  }
}

Client → Server: initialized (notification)
{ "method": "notifications/initialized" }
```

Setelah handshake selesai, client tahu capabilities apa yang server support:
- **tools**: Server expose callable tools
- **resources**: Server expose readable resources (files, data)
- **prompts**: Server expose prompt templates
- **logging**: Server bisa send log messages

## 🏗️ MCP Server Architecture

### Lifecycle MCP Server

Setiap MCP server mengikuti lifecycle:

```
1. STARTUP    → Server process dimulai
2. INITIALIZE → Client kirim initialize, server jawab capabilities
3. READY      → Server siap terima requests
4. RUNNING    → Server process tools, resources, prompts
5. SHUTDOWN   → Client disconnect, server cleanup
```

### Tool Registration

Tools didaftarkan saat initialization. Setiap tool punya:

```json
{
  "name": "search_files",
  "description": "Search for files matching a pattern",
  "inputSchema": {
    "type": "object",
    "properties": {
      "pattern": {
        "type": "string",
        "description": "Glob pattern to search for"
      },
      "path": {
        "type": "string",
        "description": "Directory to search in"
      }
    },
    "required": ["pattern"]
  }
}
```

### Resource Management

Resources adalah data yang bisa dibaca client:

```json
{
  "uri": "file:///home/user/project/src/index.ts",
  "name": "index.ts",
  "description": "Main entry point",
  "mimeType": "text/typescript"
}
```

Resources bisa:
- **Static**: File di filesystem
- **Dynamic**: Query result dari database
- **Template**: URI dengan parameters (`file:///{path}`)

### Prompt System

Prompts adalah reusable templates yang server sediakan:

```json
{
  "name": "code_review",
  "description": "Review code with best practices",
  "arguments": [
    {
      "name": "file_path",
      "description": "Path to file to review",
      "required": true
    }
  ]
}
```

## 🔌 Config Locations

| Priority | Location | Purpose | Scope |
|----------|----------|---------|-------|
| 1 (lowest) | `~/.config/opencode/opencode.json` | Global, semua projects | User-wide |
| 2 | `opencode.json` | Project root | Project-wide |
| 3 (highest) | `.opencode/opencode.json` | Project-level (recommended) | Project-specific |

**Override behavior**: Config di level lebih tinggi override config di level lebih rendah.

## 🚀 Interactive Add

Cara paling mudah tambah MCP server:

```bash
opencode mcp add
```

Follow prompts:
```
? Location: Current project / Global
? MCP server name: filesystem
? Type: Local / Remote
? Command: npx -y @modelcontextprotocol/server-filesystem /path/to/dir
```

Ini akan otomatis generate config di lokasi yang dipilih.

## 🖥️ Local MCP Server

Local MCP server runs di mesin kamu via **stdio transport**.

### Config Dasar

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-local-mcp": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"],
      "enabled": true,
      "environment": {
        "MY_ENV_VAR": "value"
      }
    }
  }
}
```

### Options Lengkap

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `type` | String | ✅ | - | Harus `"local"` |
| `command` | Array | ✅ | - | Command + arguments array |
| `environment` | Object | ❌ | `{}` | Environment variables |
| `enabled` | Boolean | ❌ | `true` | Enable/disable server |
| `timeout` | Number | ❌ | `30000` | Connection timeout (ms) |
| `disabled` | Boolean | ❌ | `false` | Alternative untuk disable |

### 10+ Contoh Konfigurasi MCP Server

**1. Filesystem Server** — Akses file system
```jsonc
{
  "mcp": {
    "filesystem": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "D:\\Projects"]
    }
  }
}
```

**2. Git Server** — Git operations
```jsonc
{
  "mcp": {
    "git": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-git", "D:\\Projects\\my-repo"]
    }
  }
}
```

**3. SQLite Server** — Query SQLite database
```jsonc
{
  "mcp": {
    "sqlite": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-sqlite", "data.db"]
    }
  }
}
```

**4. PostgreSQL Server** — Query PostgreSQL
```jsonc
{
  "mcp": {
    "postgres": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/mydb"]
    }
  }
}
```

**5. Puppeteer Server** — Browser automation
```jsonc
{
  "mcp": {
    "puppeteer": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

**6. Everything Server** — Test server (semua capabilities)
```jsonc
{
  "mcp": {
    "everything": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-everything"]
    }
  }
}
```

**7. Sequential Thinking Server** — Chain of thought
```jsonc
{
  "mcp": {
    "sequential-thinking": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-sequential-thinking"]
    }
  }
}
```

**8. Memory/Knowledge Graph Server**
```jsonc
{
  "mcp": {
    "memory": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-memory"]
    }
  }
}
```

**9. Context7 Doc Search** — Remote documentation
```jsonc
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

**10. GitHub Grep** — Remote code search
```jsonc
{
  "mcp": {
    "gh_grep": {
      "type": "remote",
      "url": "https://mcp.grep.app"
    }
  }
}
```

**11. GitHub Server dengan Auth** — Remote dengan API key
```jsonc
{
  "mcp": {
    "github": {
      "type": "remote",
      "url": "https://api.githubcopilot.com/mcp",
      "headers": {
        "Authorization": "Bearer {env:GITHUB_TOKEN}"
      }
    }
  }
}
```

**12. Multiple Filesystem Servers** — Beda direktori
```jsonc
{
  "mcp": {
    "projects-fs": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "D:\\Projects"]
    },
    "docs-fs": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "D:\\Documents"]
    },
    "downloads-fs": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "D:\\Downloads"]
    }
  }
}
```

### Usage

Setelah config, AI akan otomatis detect tools dari MCP server:

```
use the filesystem_read_file tool to read D:\Projects\src\index.ts
```

## 🌐 Remote MCP Server

Remote MCP server connects via **HTTP/SSE transport**.

### Config Dasar

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "my-remote-mcp": {
      "type": "remote",
      "url": "https://mcp.example.com/mcp",
      "enabled": true,
      "headers": {
        "Authorization": "Bearer {env:MY_API_KEY}"
      }
    }
  }
}
```

### Options Lengkap

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `type` | String | ✅ | - | Harus `"remote"` |
| `url` | String | ✅ | - | URL remote MCP server |
| `enabled` | Boolean | ❌ | `true` | Enable/disable |
| `headers` | Object | ❌ | `{}` | Custom HTTP headers |
| `oauth` | Object/false | ❌ | `false` | OAuth configuration |
| `timeout` | Number | ❌ | `30000` | Connection timeout (ms) |

### Environment Variable Syntax

Gunakan `{env:VAR_NAME}` untuk inject environment variables:

```jsonc
{
  "headers": {
    "Authorization": "Bearer {env:GITHUB_TOKEN}",
    "X-API-Key": "{env:NOTION_API_KEY}"
  }
}
```

## 📊 Connection Status

Check status semua MCP servers:

```bash
opencode mcp list
```

| Status | Arti | Action |
|--------|------|--------|
| `connected` | Ready, tools available | ✅ Normal |
| `disabled` | `enabled: false` di config | Set `enabled: true` |
| `failed` | Connection failed | Check error log, verify config |
| `needs_auth` | OAuth required | Complete auth flow |
| `needs_client_registration` | Pre-register client ID needed | Register client |

## 🔐 MCP Security

### Authentication

MCP servers bisa require authentication:

**API Key via Headers**:
```jsonc
{
  "mcp": {
    "secure-api": {
      "type": "remote",
      "url": "https://api.example.com/mcp",
      "headers": {
        "X-API-Key": "{env:API_KEY}"
      }
    }
  }
}
```

**OAuth 2.0**:
```jsonc
{
  "mcp": {
    "oauth-server": {
      "type": "remote",
      "url": "https://oauth.example.com/mcp",
      "oauth": {
        "clientId": "my-client-id",
        "authorizationUrl": "https://auth.example.com/authorize",
        "tokenUrl": "https://auth.example.com/token",
        "scopes": ["read", "write"]
      }
    }
  }
}
```

### Authorization & Permission Model

MCP permission model bekerja di beberapa level:

1. **Server Level**: Enable/disable entire server
   ```jsonc
   { "enabled": false }  // Server tidak akan start
   ```

2. **Tool Level**: AI decide tool mana yang dipanggil
   - AI tidak bisa call tool yang tidak terdaftar
   - Tool validation via `inputSchema`

3. **Resource Level**: Resource access control
   - Filesystem server restrict ke allowed directories
   - Database server bisa restrict ke specific tables

### Input Validation

Setiap tool punya `inputSchema` yang enforce type checking:

```json
{
  "inputSchema": {
    "type": "object",
    "properties": {
      "age": { "type": "integer", "minimum": 0, "maximum": 150 },
      "email": { "type": "string", "format": "email" },
      "role": { "type": "string", "enum": ["admin", "user", "guest"] }
    },
    "required": ["email"]
  }
}
```

### Rate Limiting

Untuk remote servers, implement rate limiting di server side:
- Request per minute/hour limits
- Token-based throttling
- Circuit breaker pattern untuk prevent cascade failures

### Best Practices Security

1. **Never hardcode secrets** — Selalu gunakan `{env:VAR_NAME}`
2. **Scope filesystem access** — Restrict ke specific directories
3. **Use HTTPS** — Untuk remote servers, selalu pakai HTTPS
4. **Enable only needed servers** — Kurangi attack surface
5. **Monitor MCP logs** — Check untuk suspicious activity
6. **Regular rotation** — Rotate API keys secara berkala

## 📦 MCP Resource Management

### Apa Itu Resources?

Resources adalah **data yang bisa dibaca** oleh AI, berbeda dengan tools yang **melakukan action**.

**Tools** = functions (read file, query database, send message)
**Resources** = data sources (file content, database rows, API responses)

### Resource URI Format

Resources diidentifikasi via URI:

```
file:///home/user/project/src/index.ts
db://localhost/mydb/users/123
https://api.example.com/data/report
```

### Resource Templates

Resource templates allow dynamic resource access:

```json
{
  "uriTemplate": "file:///{path}",
  "name": "File System",
  "description": "Access files by path",
  "mimeType": "text/*"
}
```

AI bisa access: `file:///src/index.ts`, `file:///package.json`, dll.

### Subscriptions & Real-Time Updates

MCP support resource subscriptions untuk real-time updates:

```
Client → Server: resources/subscribe
{
  "method": "resources/subscribe",
  "params": { "uri": "file:///logs/app.log" }
}

Server → Client: notifications/resources/updated (notification)
{
  "method": "notifications/resources/updated",
  "params": { "uri": "file:///logs/app.log" }
}

Client → Server: resources/read
{
  "method": "resources/read",
  "params": { "uri": "file:///logs/app.log" }
}
```

Use case: Monitor log files, watch database changes, track API status.

## 💬 MCP Prompts

### Apa Itu MCP Prompts?

Prompts adalah **reusable templates** yang server sediakan untuk AI. Mirip function templates dengan argument validation.

### Prompt Structure

```json
{
  "name": "code_review",
  "description": "Perform code review with best practices checklist",
  "arguments": [
    {
      "name": "file_path",
      "description": "Path to the file to review",
      "required": true
    },
    {
      "name": "review_type",
      "description": "Type of review: security, performance, style",
      "required": false,
      "default": "security"
    }
  ]
}
```

### Prompt Composition

Prompts bisa compose dengan resources:

```json
{
  "name": "analyze_error",
  "description": "Analyze error logs and suggest fixes",
  "arguments": [
    { "name": "log_uri", "description": "URI of log file", "required": true }
  ],
  "prompt": "Analyze the error log at {{log_uri}} and suggest fixes..."
}
```

### Argument Validation

Prompts validate arguments sebelum execution:
- Required arguments harus provided
- Type checking (string, number, boolean)
- Default values untuk optional arguments

## 🛠️ Building Your Own MCP Server

### Option 1: Python dengan FastMCP

**Step 1: Install dependencies**
```bash
pip install fastmcp
```

**Step 2: Create server**
```python
from fastmcp import FastMCP

# Create server instance
mcp = FastMCP("My Custom Server")

# Register a tool
@mcp.tool()
def calculate_bmi(weight: float, height: float) -> str:
    """Calculate BMI from weight (kg) and height (m)"""
    bmi = weight / (height ** 2)
    category = ""
    if bmi < 18.5:
        category = "Underweight"
    elif bmi < 25:
        category = "Normal"
    elif bmi < 30:
        category = "Overweight"
    else:
        category = "Obese"
    return f"BMI: {bmi:.1f} ({category})"

# Register another tool
@mcp.tool()
def search_students(name: str, kelas: str = "") -> str:
    """Search student by name and optional class"""
    # Simulated database
    students = [
        {"name": "Ahmad", "kelas": "6A", "nisn": "0012345678"},
        {"name": "Siti", "kelas": "6A", "nisn": "0012345679"},
        {"name": "Budi", "kelas": "5B", "nisn": "0012345680"},
    ]
    results = [s for s in students if name.lower() in s["name"].lower()]
    if kelas:
        results = [s for s in results if s["kelas"] == kelas]
    if not results:
        return "No students found"
    return "\n".join([f"{s['name']} - Kelas {s['kelas']} - NISN: {s['nisn']}" for s in results])

# Register a resource
@mcp.resource("config://settings")
def get_settings() -> str:
    """Application settings as JSON"""
    return '{"school": "SD Negeri Pasirhalang", "npsn": "20246040"}'

# Register a prompt
@mcp.prompt()
def analyze_report(report_data: str) -> str:
    """Analyze a school report and provide insights"""
    return f"Please analyze this report data:\n\n{report_data}\n\nProvide insights on: 1) Key findings 2) Recommendations 3) Action items"

if __name__ == "__main__":
    mcp.run()
```

**Step 3: Config di OpenCode**
```jsonc
{
  "mcp": {
    "school-tools": {
      "type": "local",
      "command": ["python", "D:\\Projects\\mcp-school-server\\server.py"]
    }
  }
}
```

### Option 2: Node.js dengan MCP SDK

**Step 1: Setup project**
```bash
mkdir mcp-custom-server && cd mcp-custom-server
npm init -y
npm install @modelcontextprotocol/sdk
```

**Step 2: Create server**
```javascript
// server.js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server
const server = new McpServer({
  name: "custom-school-server",
  version: "1.0.0"
});

// Register tool with Zod schema validation
server.tool(
  "calculate_grade",
  {
    score: z.number().min(0).max(100).describe("Student score 0-100"),
    subject: z.string().describe("Subject name")
  },
  async ({ score, subject }) => {
    let grade, predicate;
    if (score >= 90) { grade = "A"; predicate = "Sangat Baik"; }
    else if (score >= 80) { grade = "B"; predicate = "Baik"; }
    else if (score >= 70) { grade = "C"; predicate = "Cukup"; }
    else if (score >= 60) { grade = "D"; predicate = "Kurang"; }
    else { grade = "E"; predicate = "Sangat Kurang"; }

    return {
      content: [
        {
          type: "text",
          text: `Subject: ${subject}\nScore: ${score}\nGrade: ${grade} (${predicate})`
        }
      ]
    };
  }
);

// Register tool without parameters
server.tool(
  "get_school_info",
  {},
  async () => {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            name: "SD Negeri Pasirhalang",
            npsn: "20246040",
            address: "Desa Mandalamukti, Kec. Cikalongwetan, Kab. Bandung Barat",
            province: "Jawa Barat"
          }, null, 2)
        }
      ]
    };
  }
);

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("MCP School Server running on stdio");
```

**Step 3: Config di OpenCode**
```jsonc
{
  "mcp": {
    "school-server": {
      "type": "local",
      "command": ["node", "D:\\Projects\\mcp-custom-server\\server.js"]
    }
  }
}
```

### Option 3: From Scratch (Pure JSON-RPC over stdio)

Untuk understanding mendalam, ini MCP server dari scratch tanpa library:

```python
import sys
import json

def send_response(req_id, result):
    """Send JSON-RPC response to stdout"""
    response = {
        "jsonrpc": "2.0",
        "id": req_id,
        "result": result
    }
    sys.stdout.write(json.dumps(response) + "\n")
    sys.stdout.flush()

def send_error(req_id, code, message):
    """Send JSON-RPC error to stdout"""
    response = {
        "jsonrpc": "2.0",
        "id": req_id,
        "error": {
            "code": code,
            "message": message
        }
    }
    sys.stdout.write(json.dumps(response) + "\n")
    sys.stdout.flush()

def handle_initialize(req_id, params):
    """Handle initialize request"""
    result = {
        "protocolVersion": "2025-03-26",
        "capabilities": {
            "tools": {"listChanged": False},
            "resources": {"subscribe": False, "listChanged": False},
            "prompts": {"listChanged": False}
        },
        "serverInfo": {
            "name": "scratch-server",
            "version": "1.0.0"
        }
    }
    send_response(req_id, result)

def handle_tools_list(req_id, params):
    """Handle tools/list request"""
    result = {
        "tools": [
            {
                "name": "greet",
                "description": "Greet someone by name",
                "inputSchema": {
                    "type": "object",
                    "properties": {
                        "name": {"type": "string", "description": "Person's name"}
                    },
                    "required": ["name"]
                }
            }
        ]
    }
    send_response(req_id, result)

def handle_tools_call(req_id, params):
    """Handle tools/call request"""
    tool_name = params.get("name")
    arguments = params.get("arguments", {})

    if tool_name == "greet":
        name = arguments.get("name", "World")
        result = {
            "content": [
                {"type": "text", "text": f"Hello, {name}! Welcome to MCP."}
            ]
        }
        send_response(req_id, result)
    else:
        send_error(req_id, -32601, f"Tool not found: {tool_name}")

def main():
    """Main loop: read from stdin, process, write to stdout"""
    for line in sys.stdin:
        try:
            request = json.loads(line.strip())
            method = request.get("method")
            req_id = request.get("id")
            params = request.get("params", {})

            if method == "initialize":
                handle_initialize(req_id, params)
            elif method == "tools/list":
                handle_tools_list(req_id, params)
            elif method == "tools/call":
                handle_tools_call(req_id, params)
            elif method == "notifications/initialized":
                pass  # No response needed for notifications
            else:
                if req_id is not None:
                    send_error(req_id, -32601, f"Method not found: {method}")
        except json.JSONDecodeError:
            sys.stderr.write(f"Invalid JSON: {line}\n")
            sys.stderr.flush()

if __name__ == "__main__":
    main()
```

## 📚 Popular MCP Servers Catalog

### Official MCP Servers

| Server | Type | Tools | Deskripsi |
|--------|------|-------|-----------|
| `@modelcontextprotocol/server-filesystem` | Local | read, write, list, search | Akses filesystem dengan directory restrictions |
| `@modelcontextprotocol/server-sqlite` | Local | query, schema, write | Query SQLite databases |
| `@modelcontextprotocol/server-postgres` | Local | query, schema | Query PostgreSQL databases |
| `@modelcontextprotocol/server-git` | Local | log, status, diff, commit | Git repository operations |
| `@modelcontextprotocol/server-puppeteer` | Local | navigate, screenshot, click, evaluate | Browser automation |
| `@modelcontextprotocol/server-everything` | Local | echo, add, longRunning, sample | Test server (semua capabilities) |
| `@modelcontextprotocol/server-memory` | Local | create, read, search, update | Knowledge graph / memory |
| `@modelcontextprotocol/server-sequential-thinking` | Local | think | Chain of thought reasoning |

### Remote MCP Servers

| Server | URL | Deskripsi |
|--------|-----|-----------|
| Context7 | `https://mcp.context7.com/mcp` | Documentation search untuk libraries |
| GitHub Grep | `https://mcp.grep.app` | Code search across GitHub |
| Brave Search | `https://mcp.brave.com` | Web search API |
| Fetch | `https://mcp.fetch.io` | URL fetching dan content extraction |

### Community MCP Servers

| Server | Type | Deskripsi |
|--------|------|-----------|
| `@raygunai/mcp-server-raygun` | Remote | Error monitoring dan crash reporting |
| `@notionhq/notion-mcp-server` | Remote | Notion database operations |
| `@slack/mcp-server` | Remote | Slack messaging dan channel management |
| `@googlemaps/mcp-server` | Remote | Maps, geocoding, directions |
| `@aws/mcp-server` | Remote | AWS service management |
| `@docker/mcp-server` | Local | Docker container management |
| `@kubernetes/mcp-server` | Remote | Kubernetes cluster management |
| `@jira/mcp-server` | Remote | Jira issue management |
| `@linear/mcp-server` | Remote | Linear issue tracking |
| `@figma/mcp-server` | Remote | Figma design file access |

## ⚖️ Local vs Remote MCP Servers

### Comparison Table

| Aspek | Local MCP | Remote MCP |
|-------|-----------|------------|
| **Transport** | stdio (stdin/stdout) | HTTP/SSE |
| **Latency** | Sangat rendah (<10ms) | Tergantung network (50-500ms) |
| **Setup** | Install package, config command | Config URL + auth |
| **Security** | Process isolation, filesystem access | Network security, API keys, OAuth |
| **Scalability** | Single machine only | Multi-user, cloud-hosted |
| **Offline** | ✅ Bekerja tanpa internet | ❌ Butuh internet |
| **Token Usage** | Lebih rendah (no network overhead) | Bisa lebih tinggi (metadata, headers) |
| **Maintenance** | Update local packages | Provider maintain server |
| **Use Case** | Filesystem, database, git, local tools | API services, SaaS, cloud tools |
| **Cost** | Free (local resources) | Bisa berbayar (API usage) |
| **Debugging** | Mudah (local logs, direct access) | Lebih sulit (remote logs, network issues) |

### Kapan Pakai Local?

- Akses filesystem lokal
- Query local database (SQLite, PostgreSQL)
- Git operations
- Custom tools yang butuh akses hardware
- Development dan testing

### Kapan Pakai Remote?

- Akses SaaS services (GitHub, Slack, Notion)
- Documentation search (Context7)
- Web search (Brave, Google)
- Shared services (team-wide MCP server)
- Services yang butuh API keys dari provider

## 🔧 MCP Troubleshooting

### Connection Issues

**Gejala: MCP timeout**
```
Error: MCP server "my-server" connection timed out after 30000ms
```

**Penyebab & Solusi**:
1. Timeout terlalu pendek → Increase `timeout` di config
   ```jsonc
   { "timeout": 60000 }  // 60 detik
   ```
2. Network lambat (remote) → Check koneksi internet
3. Server process hang → Restart OpenCode

**Gejala: Local MCP fail to start**
```
Error: Command not found: npx
```

**Penyebab & Solusi**:
1. Command tidak ada di PATH → Verify command array
   ```jsonc
   // Wrong
   { "command": "npx -y @modelcontextprotocol/server-filesystem" }

   // Correct
   { "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem"] }
   ```
2. Package tidak terinstall → Install manual dulu
   ```bash
   npm install -g @modelcontextprotocol/server-filesystem
   ```
3. Python tidak ada PATH → Gunakan full path
   ```jsonc
   { "command": ["C:\\Python312\\python.exe", "server.py"] }
   ```

### Tool Not Found

**Gejala: AI bilang tool tidak tersedia**
```
Error: Tool "my_tool" not found on server "my-server"
```

**Penyebab & Solusi**:
1. Server belum connect → Run `opencode mcp list`
2. Tool name typo → Check exact tool name dari server
3. Server tidak expose tool tersebut → Verify server capabilities

### Permission Errors

**Gejala: Access denied**
```
Error: Access denied for path /etc/passwd
```

**Penyebab & Solusi**:
1. Filesystem server restrict directory → Add allowed directory
   ```jsonc
   {
     "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "D:\\Projects", "D:\\Documents"]
   }
   ```
2. API key invalid/expired → Rotate API key
3. OAuth token expired → Re-authenticate

### Debug Mode

Enable verbose logging untuk debug:

```bash
# Set environment variable
export MCP_DEBUG=true

# Then run OpenCode
opencode
```

Check server logs:
- Local servers: stderr output
- Remote servers: HTTP response headers dan body

### Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `-32700` | Parse Error | Invalid JSON in request |
| `-32600` | Invalid Request | Missing required fields |
| `-32601` | Method Not Found | Server tidak support method ini |
| `-32602` | Invalid Params | Parameter tidak match schema |
| `-32603` | Internal Error | Server-side bug |

## ⚠️ Pitfalls

| Gejala | Penyebab | Solusi |
|--------|----------|--------|
| MCP timeout | Timeout too short / slow network | Increase `timeout`, default 30000ms |
| Local MCP fail | Command not found / wrong path | Verify `command` array, check PATH |
| Remote MCP fail | Wrong URL / server down | Verify URL, check network |
| High token usage | Too many MCP servers enabled | Only enable needed servers |
| Tool not responding | Server process crashed | Restart OpenCode, check logs |
| Auth failed | Expired/invalid API key | Rotate key, re-authenticate |
| Context overflow | GitHub MCP adds大量 tokens | Limit scope, use specific queries |

## 📝 Ringkasan

1. **MCP protocol** — Standard protocol (JSON-RPC 2.0) untuk connect AI ke external services
2. **Transport layers** — stdio (local), SSE (remote), HTTP Streamable (bidirectional remote)
3. **Capabilities negotiation** — Handshake initialize menentukan tools, resources, prompts yang available
4. **Config locations** — Global (`~/.config/opencode/`), project root, project-level (`.opencode/`)
5. **Interactive add** — `opencode mcp add` untuk guided setup
6. **Local MCP** — `type: "local"` + `command` array, runs via stdio
7. **Remote MCP** — `type: "remote"` + `url`, connects via HTTP/SSE
8. **Security** — API keys, OAuth, input validation, permission scoping
9. **Resources** — Data sources yang bisa dibaca, support subscriptions untuk real-time updates
10. **Prompts** — Reusable templates dengan argument validation
11. **Build your own** — Python FastMCP, Node.js SDK, atau pure JSON-RPC
12. **Connection status** — 5 states + `opencode mcp list` untuk check
13. **Troubleshooting** — Timeout, command path, auth, permission errors
14. **Local vs Remote** — Tradeoff antara latency, security, offline capability

## 🎯 Next Steps

Setelah paham MCP dasar, lanjut ke:
- **MCP Advanced** — Custom tool development, resource subscriptions, prompt engineering
- **MCP Security Deep Dive** — OAuth flows, rate limiting, audit logging
- **Building Production MCP Servers** — Error handling, testing, deployment

**Referensi**:
- [MCP Protocol Specification](https://modelcontextprotocol.io/specification)
- [vbgate/learn-opencode](https://github.com/vbgate/learn-opencode)
- [MCP Server Examples](https://github.com/modelcontextprotocol/servers)
