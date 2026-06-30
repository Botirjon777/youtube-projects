# 🎬 Creative Web Projects — YouTube Channel

Short, lovable, creative web projects. **3–4 videos per week.**

## Folder structure

Each video lives in a folder named by its **publish date** + a slug:

```
YYYY-MM-DD-slug/
  index.html
  style.css
  script.js
  README.md   ← video concept, script notes, talking points
```

## Content pillars

| Pillar | Vibe | Example ideas |
|--------|------|---------------|
| 💖 Love / feel-good | "programmer built something sweet for someone" | webpage for girlfriend, anniversary counter, love-letter generator |
| 🧩 Tech tutorials | "build this UI piece" | navbar, creative dropdowns, modals, cards, hero sections |
| ⚡ Performance & clean code | "make it fast & readable" | refactors, lazy loading, CSS cleanup, Lighthouse runs |
| ✨ Creative / fun | "wow factor" | particle effects, canvas art, micro-interactions |

## Schedule (rolling)

| Publish date | Project | Pillar | Status |
|--------------|---------|--------|--------|
| 2026-07-02 | Lovely webpage for her | 💖 Love | 🟢 Built |
| 2026-07-04 | "Will you go on a date?" (No runs away + countdown) | 💖 Love | 🟢 Built |
| 2026-07-07 | Jank Lab — transform vs left (you've been animating wrong) | ⚡ Performance | 🟢 Built |
| 2026-07-09 | Debounce vs Throttle — visualized | 🧩 Explainer | 🟢 Built |
| 2026-07-11 | Interactive hero backgrounds (12 mouse-reactive themes) | ✨ Creative | 🟢 Built |
| 2026-07-14 | Marvel hero backgrounds (Iron Man · Thor · Spider-Man · Ant-Man) | 🦸 Fan pack | 🟢 Built |
| 2026-07-16 | DC hero backgrounds (Batman · Superman · Flash · Green Lantern) | 🦇 Fan pack | 🟢 Built |
| 2026-07-18 | Sci-fi movie backgrounds (Interstellar · Inception · Blade Runner) | 🎞️ Fan pack | 🟢 Built |
| 2026-07-21 | Designer portfolio — single page (custom cursor, hover previews) | 🎨 Tech/Creative | 🟢 Built |
| 2026-07-23 | Programmer portfolio (live terminal, code editor) | 💼 Profession | 🟢 Built |
| 2026-07-25 | Pharmacist portfolio (floating pills, live open/closed) | 💼 Profession | 🟢 Built |
| 2026-07-28 | Accountant portfolio (animated growth chart, counters) | 💼 Profession | 🟢 Built |

See **[VIRAL-STRATEGY.md](VIRAL-STRATEGY.md)** for what's working and the idea backlog.

## 🎒 Themed background packs (one pack = one video)

Each "pack" bundles 3–4 mouse-reactive `<canvas>` backgrounds around a theme, on the same reusable engine. Great for episodic, comment-driven series ("who's next?").

- **Marvel Pt.1** ✅ → Pt.2 (Hulk, Doctor Strange, Captain America, Black Panther)
- **DC** ✅ → Pt.2 (Wonder Woman, Aquaman, Joker, Cyborg)
- **Sci-Fi movies** ✅ → Tron, Dune, 2001, Tenet, Avatar
- **By vibe** (planned): For Men · For Girls · For Anime · For Creativity
- **Master showcase:** the 12-theme [interactive hero backgrounds](2026-07-11-interactive-hero-backgrounds/)

## 💼 Profession portfolio series (one job = one video)

"I designed a website for every profession" — each profession gets its own visual language.

- **Programmer** ✅ — terminal that types itself, code editor, repo grid
- **Pharmacist** ✅ — floating pill capsules, live Open/Closed status
- **Accountant** ✅ — animated growth chart, $/%/+ counters
- **Next ideas:** Architect · Lawyer · Chef · Photographer · Teacher · Real-estate agent · Barber · Fitness coach · Dentist · Musician

## Tech choices

Plain **HTML + CSS + JS**, no build step — easy to follow on camera, runs by opening `index.html`.
