# 🦸 Marvel Hero Backgrounds — Part 1

> Pillar: **Creative / Fan** · Publish: **2026-07-14**

A themed category pack: **four** mouse-reactive hero backgrounds in one page. Pure `<canvas>`, zero libraries. (Part 2 can add Hulk, Doctor Strange, Captain America, Black Panther…)

## ▶️ Run it
Open `index.html`. Move your mouse. Switch heroes with the pills.

## 🦸 The heroes
| Hero | Reacts to mouse by… |
|------|---------------------|
| 🔴 **Iron Man** | arc-reactor **HUD rings + ticks lock onto your cursor**, repulsor sparks on movement |
| ⚡ **Thor** | **storm bolts strike the cursor**; Mjölnir crackles electricity around it |
| 🕷️ **Spider-Man** | a **spider-web shoots from your cursor** to the nearest anchors, with concentric rings |
| 🐜 **Ant-Man** | shrink into the **Quantum Realm** — a tunnel of neon rings expanding from your cursor |

## 🎬 Video outline (Short)
1. Hook (0–2s): Iron Man HUD snapping to the cursor — "pick your hero."
2. (2–12s): cycle Iron Man → Thor → Spider-Man → Ant-Man, one beat each.
3. (12–18s): "all 4 in one file, no libraries."
4. CTA: "Which hero for your wallpaper? Part 2 coming — comment who's next."

## 🗣️ Talking points
- Reusable engine: every theme is `{ init(), frame(t) }`; the loop renders the active one.
- Lightning = **midpoint-displacement** (Thor + later Flash share the `jagged()` helper).
- The web is nearest anchors **sorted by angle** so the strands read cleanly.
- `globalCompositeOperation = "lighter"` drives all the energy glows.

## 🧩 Series idea
Brand each "Part" as a category video — Marvel Pt.1 / Pt.2, then DC, then Anime, then Movies — and let comments vote the next roster.
