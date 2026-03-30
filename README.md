# 🖥️ Prasanna's Terminal Identity

> **"Why the hell would you build a command-line interface portfolio in 2026?"**

Welcome to the future. Everyone else is shipping auto-generated, GPU-melting WebGL AI slop that requires an RTX 4090 and 3 GB of JavaScript just to render a "Hire Me" button. 

I decided to go in the exact opposite direction.

This is a **blisteringly fast, zero-bullshit, raw JSON API portfolio** that runs directly in your terminal. No loading spinners. No annoying scroll-jacking. No cookie banners. Just raw, unadulterated bytes fetched directly from Vercel via a stateless Git CMS backend.

---

## 🚀 How to Execute Me

If you have Node.js installed, just pop open your terminal and run:

\`\`\`bash
npx prasanna
\`\`\`

*(Yes, I legally own the NPM package **\`prasanna\`**. Be jealous.)*

You will be greeted with a fully interactive CLI dashboard where you can browse my projects, experience, and contact information using nothing but your arrow keys. 

---

## 🔌 The Raw API

If you are a robot, a web crawler, or just someone who genuinely prefers reading JSON strings (I won't judge), you can hit my production API directly:

- \`GET https://prasanna-api19.vercel.app/\` - Welcome payload
- \`GET https://prasanna-api19.vercel.app/me\` - Identity constraints
- \`GET https://prasanna-api19.vercel.app/projects\` - Top repositories
- \`GET https://prasanna-api19.vercel.app/stats\` - Live GitHub statistics 

Want it right in your terminal without the CLI wrapper? 
\`\`\`bash
curl -H "Accept: application/json" https://prasanna-api19.vercel.app/me
\`\`\`

---

## 🛠️ Architecture

Because I hate databases, this entire API is fully stateless. It uses a **Git CMS**.
When I want to update my skills, my secure `/admin` dashboard actually constructs a payload and uses a GitHub Personal Access Token to literally `git commit` the new JSON file to the repo, triggering an instant Vercel redeployment. 

*Zero databases. Full version control. Infinite speed.*

---

**Made with 💻 and an absurd amount of sarcasm.**
