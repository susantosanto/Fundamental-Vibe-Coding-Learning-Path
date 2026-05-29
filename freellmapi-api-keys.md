# FreeLLMAPI API Keys

> Instalasi: `C:\Users\USER\freellmapi`
> Server: `http://localhost:3001`
> Dashboard: `http://localhost:5173` (dev) / `http://localhost:3001` (prod)
> Unified API Key: `freellmapi-05adc1675f2532df391b04ec5e12223d73a07e2e02690ac3`

## Provider Keys

| Provider | Platform | API Key | Status |
|----------|----------|---------|--------|
| Google Gemini | `google` | `AIzaSyDKhqCQqQECXca5ItiaWvozJCyInlbm7yc` | ✅ Active |
| Groq | `groq` | `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` | ✅ Active |
| Cerebras | `cerebras` | `csk-vn9mx42ydhvv4fere9fc6d6yv6me54phfycmket5ppkxj2jd` | ✅ Active |
| NVIDIA NIM | `nvidia` | `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` | ✅ Active |
| Mistral | `mistral` | `a24j2i1tMXXWX8kcHaRZqVBHta8k73nM` | ✅ Active |
| Cloudflare Workers AI | `cloudflare` | `cfat_VUK9EMQzGys73SZyo1NKm8RcXqSay84FKQvggZrPadb497c4` | ✅ Active |
| Zhipu (Z.ai / BigModel) | `zhipu` | `490958167b1340589159f210d9d51d95.d0M9xrUMlq0qI9rW` | ✅ Active |
| Kilo Gateway | `kilo` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (JWT token, dipotong) | ✅ Active |

## Cara Menjalankan

```powershell
# Development mode (server :3001 + dashboard :5173)
cd C:\Users\USER\freellmapi
npm run dev

# Production mode
cd C:\Users\USER\freellmapi
npm run build
node server/dist/index.js
```

## Cara Pakai API

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:3001/v1",
    api_key="freellmapi-05adc1675f2532df391b04ec5e12223d73a07e2e02690ac3",
)

# Auto-router (pilih model terbaik yang available)
resp = client.chat.completions.create(
    model="auto",
    messages=[{"role": "user", "content": "Halo!"}],
)
print(resp.choices[0].message.content)
```
