<div align="center">

# prasanna

[![npm](https://badge.fury.io/js/prasanna.svg)](https://badge.fury.io/js/prasanna)
[![MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![API](https://img.shields.io/website?url=https%3A%2F%2Fapi.prasanna19.xyz%2Fme&up_message=online&up_color=red)](https://api.prasanna19.xyz/me)

*It's 2026. Every portfolio is a Three.js particle explosion with an AI chatbot that hallucinates my job history.*

*This one runs in your terminal.*

</div>

---

```bash
npx prasanna
```

No install. No browser. No 4MB of React to render a name and three bullet points.  
Just arrow keys, live data, and your terminal emulator doing what it was built to do.

---

## Playground

If you launch the CLI, you also get access to the interactive playground containing five developer-themed terminal puzzles:

- **Packet Routing**: A pathfinding puzzle where you route network packets avoiding firewalls (featuring newly added ultra-hard Levels 5 & 6).
- **Cyber Defuse**: A boolean logic gate simulator where you toggle inputs to match target outputs.
- **Docker Scale**: A turn-based DevOps simulator managing container allocations under real-time traffic spikes without crashing resource limits.
- **DNS Lookup**: A subnetting math speedrun calculating NetIDs, masks, and broadcast addresses.
- **The Breach**: A mastermind-style passcode hacking logic game.

---

## API

The same data, rawer:

| Route        | Returns          |
| ------------ | ---------------- |
| `/me`        | Identity & skills |
| `/projects`  | Top repositories |
| `/experience`| Timeline         |
| `/stats`     | Live GitHub stats |
| `/now`       | What I'm building |

```bash
curl https://api.prasanna19.xyz/me
```

---

## Architecture

No database. Updates go through an `/admin` panel that commits JSON to GitHub via PAT → instant Vercel redeploy. Git is the CMS. The whole thing is stateless, versioned, and faster than anything running on a Postgres free tier.

---

<div align="center"><sub>Built by Prasanna · MIT</sub></div>
