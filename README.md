<div align="center">
  
# 🖥️ Prasanna's Terminal Identity

[![npm version](https://badge.fury.io/js/prasanna.svg)](https://badge.fury.io/js/prasanna)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![API Status](https://img.shields.io/website?url=https%3A%2F%2Fprasanna-api19.vercel.app%2Fme&up_message=online&up_color=green&down_color=red)](https://prasanna-api19.vercel.app/me)

> **"Why the hell would you build a command-line interface portfolio in 2026?"**

</div>

Welcome to the future. Everyone else is shipping auto-generated, GPU-melting WebGL AI slop that requires an RTX 4090 and 3 GB of JavaScript just to render a "Hire Me" button. 

I decided to go in the exact opposite direction.

This is a **blisteringly fast, zero-bullshit, raw JSON API portfolio** that runs directly in your terminal. No loading spinners. No annoying scroll-jacking. No cookie banners. Just raw, unadulterated bytes fetched directly from Vercel via a stateless Git CMS backend.

---

## 🚀 Usage

There is nothing to "install", configure, or clone. 
As long as you have Node.js installed on your machine, just pop open your terminal and run:

\`\`\`bash
npx prasanna
\`\`\`

*(Yes, I legally own the NPM package **\`prasanna\`**. Be jealous.)*

You will immediately be greeted with a fully interactive CLI dashboard where you can browse my projects, experience, and contact information using nothing but your arrow keys. It reaches out to my live edge API in real-time.

---

## 🔌 The Raw API

If you are a robot, an AI agent, a web crawler, or just someone who genuinely prefers reading JSON strings over human interfaces (I won't judge), you can hit my production API directly:

- \`GET https://prasanna-api19.vercel.app/\` - Welcome payload
- \`GET https://prasanna-api19.vercel.app/me\` - Identity & Skills
- \`GET https://prasanna-api19.vercel.app/projects\` - Top repositories
- \`GET https://prasanna-api19.vercel.app/experience\` - Professional timeline
- \`GET https://prasanna-api19.vercel.app/stats\` - Live GitHub stats
- \`GET https://prasanna-api19.vercel.app/now\` - What I'm currently doing

Want it right in your terminal without the polished CLI wrapper? 
\`\`\`bash
curl -H "Accept: application/json" https://prasanna-api19.vercel.app/me
\`\`\`

---

## 🛠️ Architecture

Because I hate databases, this entire API is fully stateless. It uses a custom **Git CMS**.

When I want to update my skills, my secure `/admin` dashboard actually constructs a payload and uses a GitHub Personal Access Token to literally \`git commit\` the new JSON file to the repo on my behalf, triggering an instant Vercel redeployment. 

*Zero databases. Full version control. Infinite speed.*

---

<div align="center">
  <b>Made with 💻 and an absurd amount of sarcasm.</b>
</div>
