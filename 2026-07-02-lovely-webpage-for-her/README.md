# 💖 Lovely Webpage For Her

> Pillar: **Love / feel-good** · Publish: **2026-07-02**

A programmer builds a sweet, interactive webpage as a gift. Pure HTML/CSS/JS — opens in any browser, no setup.

## ▶️ Run it
Open `index.html` in a browser. That's it.

## ✨ What's inside
- **Animated hero** — name + a typewriter of sweet lines
- **Floating hearts** ambient animation (+ a burst on the surprise)
- **Flip cards** — "reasons I love you" reveal on tap
- **Live "together since" counter** — days / hours / mins / secs
- **Surprise button** — opens a hidden love note
- Respects `prefers-reduced-motion`

## 🎁 Make it personal
Everything lives in the `CONFIG` object at the top of [script.js](script.js):
- `name` — her name
- `lines` — the typewriter messages
- `since` — your anniversary (⚠️ month is **0-based**: June = `5`)
- `reasons` — the flip-card reasons

## 🎬 Video outline
1. Hook: "My girlfriend doesn't know I built her a website…"
2. Build the hero + typewriter (live coding)
3. Add floating hearts (CSS keyframes + JS spawner)
4. Flip cards with `transform: rotateY` + `backface-visibility`
5. The live counter with `setInterval`
6. The surprise note + heart burst
7. Reveal: customize the CONFIG → "send her the link" 💌

## 🗣️ Talking points
- `backface-visibility: hidden` is the trick behind the flip
- Why `prefers-reduced-motion` matters (accessibility)
- Keeping it dependency-free so anyone can copy it
