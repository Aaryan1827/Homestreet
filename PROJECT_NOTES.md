# Homestreet — Project Notes

> Standing rules for all contributors and AI agents working on this codebase.

---

## Project

**Name:** Homestreet  
**Tagline:** Every street feels like home.  
**Goal:** A mobile-first PWA for interactive city exploration. Pillars: (1) exploration & hospitality, (2) history & culture, (3) safety & security, (4) best vs worst place comparison, (5) smart city insights.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Vite + React (JavaScript, not TypeScript) |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Animation | `motion` package (formerly Framer Motion) |
| Routing | `react-router-dom` |
| Maps | Leaflet + `react-leaflet` |
| Icons | `lucide-react` |
| PWA | `vite-plugin-pwa` |
| Data | Local mock data + `localStorage` only. No backend. |

---

## Theme Tokens (CSS variables on `[data-theme]`)

All tokens are CSS custom properties defined in `src/styles/theme.css`. Tailwind classes map to them via `tailwind.config.js`.

| Token | Day | Evening | Night |
|---|---|---|---|
| `--color-bg` | `#FFF4E0` | `#F6D9B0` | `#1B1F3B` |
| `--color-surface` | `#FFFFFF` | `#FFF0D6` | `#262B52` |
| `--color-surface-soft` | `#FBE9CC` | `#EEC98C` | `#2F3563` |
| `--color-primary` | `#C65D3B` | `#B8482B` | `#F28C38` |
| `--color-accent` | `#F28C38` | `#E8741F` | `#F6B26B` |
| `--color-ink` | `#3B2A20` | `#3B2A20` | `#FFF4E0` |
| `--color-muted` | `#8A6F5E` | `#7A5A46` | `#B7B3D1` |

Score colors (all themes): `--color-safe: #3F9D6B`, `--color-caution: #E2A33B`, `--color-danger: #D6453D`.

Theme transition: `600ms ease` on `background-color`, `color`, `border-color`.

### Auto mode
- Before 17:00 → `day`
- 17:00–19:30 → `evening`
- After 19:30 → `night`

---

## City Config Rule

> **Never hardcode a city name in any component. All city data comes from `CityContext`.**

To add a new city:
1. Create `src/cities/<cityid>.js` matching the shape below.
2. Import it in `src/cities/index.js` and add to the `cities` array.
3. That's it. The entire app updates automatically.

### City config shape

```js
{
  id: "pune",
  name: "Pune",
  tagline: "The Oxford of the East",
  comingSoon: false,
  center: [18.5204, 73.8567],
  zoom: 12,
  heroImage: '/images/pune/hero-shaniwar-wada.jpg',
  photoCredits: [],
  areas: [{ name, lat, lng, scores: { safety, cleanliness, affordability, rating, accessibility } }],
  culture: {
    festivals: [{ name, month, description }],
    traditions: [{ name, description }]
  },
  dishes: [
    { id, name, description, whereToTry, image } // whereToTry is a place id
  ],
  heritage: [
    { id, name, lat, lng, description, history, image }
  ],
  places: [
    {
      id, name, category, subcategory, area, lat, lng, 
      priceLevel, avgCost, tags: [], description, bestTime, openHours, image,
      scores: { safety, cleanliness, affordability, rating, accessibility },
      verified: true|false
    }
  ],
  incidents: [],
}
```

### Data Conventions
- Coordinates and scores are currently approximate demo data.
- Images for places should be placed in `public/images/<cityid>/places/<filename>`.
- Images for dishes should be placed in `public/images/<cityid>/dishes/<filename>`.
- `utils/scoring.js` contains the `cityScore` weighted average and the Haversine distance calculator.

---

## Animation Rules

- Use `motion` (from the `motion` package) for all animations.
- **Only animate `transform` and `opacity`** wherever possible for GPU compositing.
- `PageTransition` wraps each page route — fade + upward slide, 300ms.
- Bottom nav active pill uses `layoutId="nav-pill"` for smooth spring transition.
- Splash: scale + fade in/out on first session load.
- `HeritageSkyline` recolors via CSS variable changes (no JS animation).
- **Always respect `prefers-reduced-motion`** — global rule in `index.css` disables transitions/animations.

---

## Design Rules

- **Visual Direction:** Photo-first glassmorphism. Immersive, warm, and cinematic.
- **Glass UI:** Use `GlassCard` (or `.glass` class) for UI elements floating over photos. Applies `backdrop-filter: blur(18px) saturate(140%)` with a solid fallback.
- **Images:** All images must use the `CityImage` component to ensure a fallback gradient placeholder is shown if the real photo is missing.
- **Night Mode:** Not just dark mode. Photos are cooled and darkened (via CSS filters), overlaid with a navy gradient, and accented with a glowing box-shadow (`--glow-primary`).
- **Phone-first:** design for 390px width; desktop sidebar appears at ≥1024px.
- **Typography:** `Fraunces` (display, via Google Fonts) for headings, `DM Sans` for body.
- **Cards:** `border-radius: 20–24px`, warm shadows tinted with `--shadow-color` (brown RGB), NOT black.
- **Touch targets:** minimum `44px` height/width on all interactive elements.
- **Spacing:** generous — prefer `p-4` (16px) minimum on cards.

---

## Hackathon Rule

> **Keep it simple. This is a 3-hour hackathon build.**  
> Do not over-engineer. No backend. No TypeScript. No complex state managers.  
> When in doubt, use local mock data and `localStorage`.

---

*Last updated: Stage 3 — TimeSlider, Theme Sync, and Safety layer*
