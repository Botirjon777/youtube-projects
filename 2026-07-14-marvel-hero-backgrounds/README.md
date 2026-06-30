# 🦸 Marvel Hero Backgrounds — Part 1

> Pillar: **Creative / Fan** · Publish: **2026-07-14**

A themed category pack: **four** mouse-reactive hero backgrounds in one page. Pure `<canvas>`, zero libraries. (Part 2 can add Hulk, Doctor Strange, Captain America, Black Panther…)

## ▶️ Run it
Open `index.html`. Move your mouse. Switch heroes with the pills.

## 🦸 The heroes
| Hero | Reacts to mouse by… |
|------|---------------------|
| 🔴 **Iron Man** | a full **JARVIS HUD** — targeting reticle locks onto your cursor while live **calculations** run (scrolling hex, system bars, scanning sine-wave, status readouts) over an Iron Man faceplate |
| ⚡ **Thor** | **Mjölnir is drawn at your cursor**; it crackles, glows, and **storm bolts strike the hammer** |
| 🕷️ **Spider-Man** | a **smooth classic web** shoots from your cursor — eased center, sagging strands, no jitter |
| 🐜 **Ant-Man** | **real ants** walk and swarm your cursor; buttons **🔼 Grow / 🔽 Shrink** them and **🏠 Send home** marches them into the anthill (**🐜 Release** brings them back) |

## 🖼️ About the artwork
The hero "logos" (Iron Man faceplate, Mjölnir, ants, JARVIS UI) are **hand-drawn vector art** — no copyrighted images, crisp at any resolution, 100% offline. Want real licensed artwork instead? Drop e.g. `assets/ironman.png` and load it in that theme's draw step.

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
