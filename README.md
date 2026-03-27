# 🚀 Prasanna's API Portfolio

> "Treat the developer as a public API."

A serverless, API-first developer portfolio deployed on **Vercel**. Instead of a standard UI, this project serves structured JSON data for personal identity, projects, and stats. It also includes an interactive **terminal CLI**.

## 🌐 Live API

Main Endpoint: [https://prasanna-dev-api.vercel.app/](https://prasanna-dev-api.vercel.app/)
Interactive Docs: `/docs`

### 🪄 The `curl` Magic
If you're in a terminal, just run:
```bash
curl https://prasanna-dev-api.vercel.app
```
*It detects `curl` and returns a beautifully coloured ANSI business card.*

## 💻 Interactive CLI

Experience the portfolio in high-fidelity from your terminal:
```bash
npx prasanna
```

## 🛠️ Tech Stack

- **Runtime**: Node.js (ESM)
- **Deployment**: Vercel Serverless Functions
- **Documentation**: Custom bespoke light-mode UI (Redoc-inspired)
- **CLI Utilities**: `@inquirer/prompts`, `chalk`, `boxen`, `figlet`, `gradient-string`

## 📡 Endpoints

| Endpoint | Description |
| :--- | :--- |
| `GET /me` | Personal profile, bio, and skills |
| `GET /projects` | Curated list of my best projects |
| `GET /projects/all` | Live repository list fetched from GitHub |
| `GET /stats` | Live GitHub stats (repos, stars, followers) |
| `GET /contact` | Links and social pointers |
| `GET /now` | Current status/focus |
| `GET /docs` | Full Interactive API Reference |

---

Built with ⚡ by [Prasanna](https://github.com/prasanna192005)
