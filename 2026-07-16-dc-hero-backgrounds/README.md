# 🦇 DC Hero Backgrounds

> Pillar: **Creative / Fan** · Publish: **2026-07-16**

The DC counterpart to the Marvel pack — **four** mouse-reactive hero backgrounds, one page, pure `<canvas>`, zero libraries.

## ▶️ Run it
Open `index.html`. Move your mouse. Switch heroes with the pills.

## 🦇 The heroes
| Hero | Reacts to mouse by… |
|------|---------------------|
| 🦇 **Batman** | Gotham **rain** + a **bat-signal glow** at the cursor; bats **home in** on it, wings flapping |
| 🔵 **Superman** | fly forward through **red & blue speed streaks** radiating from the cursor; **heat-vision** beams when you move |
| ⚡ **Flash** | the **Speed Force** — a glowing lightning trail chases the cursor with crackle |
| 💚 **Green Lantern** | **willpower energy rings** + a rotating ring construct emanating from the cursor |

## 🎬 Video outline (Short)
1. Hook (0–2s): bat-signal + bats swarming the cursor.
2. (2–12s): Batman → Superman → Flash → Green Lantern, one beat each.
3. (12–18s): "Marvel vs DC — which pack wins?" (ties back to the Marvel video).
4. CTA: "Team DC or team Marvel? Comment 👇"

## 🗣️ Talking points
- Shares the same engine + `jagged()` lightning helper as the Marvel pack.
- Batman uses a hand-built **bat silhouette path** (`bat()`); bats steer toward the cursor with simple seek + damping.
- Superman's "flying forward" = streaks that grow **outward** from the cursor and respawn at the center.
- Flash keeps a short **trail buffer** of cursor positions and draws a tapered glowing polyline through it.

## 🔁 Cross-promo
Pair with the Marvel video as a two-part "Marvel vs DC" drop in the same week.
