# 👨‍💻 Programmer Portfolio — single page

> Pillar: **Tech / Creative** · Publish: **2026-07-23** · Profession series #1

A developer's site with a **live terminal** that types out an intro, a syntax-highlighted code editor, a GitHub-style repo grid, and uptime stats. Dark, monospace, scan-line vibe. Pure HTML/CSS/JS.

## ▶️ Run it
Open `index.html`. Watch the terminal type itself in.

## ✨ Details
- **Self-typing terminal** — types plain text char-by-char, then swaps in syntax colors
- **Code editor mock** with a real `debounce.ts` snippet, highlighted
- **Tech-stack tags** that light up on hover
- **Repo cards** with language dots, star counts, GitHub feel
- **Count-up stats** (commits/mo, 99.9% uptime, repos)
- CRT-ish **scan-line + glow** background; respects `prefers-reduced-motion`

## 🎬 Video outline
1. Hook (0–3s): the terminal typing `whoami` → name prints.
2. (3–10s): scroll through stack + the highlighted code editor.
3. (10–18s): repo grid hover + count-up stats.
4. CTA: "Dev portfolio, zero frameworks. Save it."

## 🗣️ Talking points
- Typing effect = type the `textContent`, then replace with the colored `innerHTML` (so timing is simple but colors land).
- Scan lines = a repeating `linear-gradient` background sized to 28px rows.

## 🧩 Profession series
Part of a set: **Programmer → Pharmacist → Accountant → …** — each profession gets its own visual language. Great for a "I designed a website for every job" series.
