# ☕ Café Aurora – Digital Menu Website

A mobile-first, production-ready digital menu website for **Café Aurora**, an authentic Goan café. Customers access this website inside the café by scanning a tabletop QR code on their smartphones to browse food categories, view food photography, read multilingual descriptions, check prices (single and half/full portions), and verify item availability.

> **Zero Configuration Required for Deployment:** This project is pre-configured with the full authentic 15-dish Goan menu from the café photograph, complete with photography, pricing, categories, and 4-language support. **No environment variables are required to deploy on Vercel.** Simply connect and click Deploy!

---

## 🚀 Instant 1-Click Vercel Deployment

1. Push or import this repository into your [Vercel](https://vercel.com/) account.
2. Leave all Environment Variables **blank** (zero env vars needed!).
3. Click **Deploy**.
4. Your digital menu is immediately live with all 15 dishes, search, categories, and multilingual support!

*(Optional: If you later decide to link a private Google Sheets spreadsheet for live editing by hotel staff, you can optionally supply `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_PRIVATE_KEY` in Vercel settings.)*

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite | Fast, responsive, component-based user interface |
| **Styling** | Tailwind CSS | Mobile-first Goan aesthetic (Terracotta, Warm Cream, Muted Green) |
| **Routing** | React Router v7 | Seamless client-side routing (`/` and `/category/:categoryId`) |
| **Icons** | Lucide React | Clean, lightweight UI icons |
| **Menu Database** | Standalone Demo + Google Sheets API option | Runs out of the box with 0 env vars |
| **Backend API** | Vercel Serverless Function (`/api/menu`) | High-speed JSON endpoint with CDN caching |
| **Caching** | HTTP Cache + LocalStorage | 30-minute revalidation interval, background updates & offline grace |
| **Deployment** | Vercel | Global CDN deployment with automatic serverless functions |

---

## 🎨 Design System & Brand Identity

Traditional Goan café aesthetic: warm, welcoming, elegant, and food-focused.

- **Warm Cream (`#FBF8EF` / `#FDFCF7`):** Backgrounds and off-white cards.
- **Terracotta Accent (`#C05621`):** Primary branding, prices, and interactive badges.
- **Muted Green (`#4A7C59`):** Secondary Goan heritage accents and vegetarian markers.
- **Dark Brown (`#382314`):** High-contrast, readable typography.
- **Typography:** *Playfair Display* (Goan Portuguese heritage serif) + *Plus Jakarta Sans* (clean readability).
- **Subtle Azulejo Motifs:** Traditional Portuguese geometric accents in banners and cards.

---

## 📱 Mobile-First Features

1. **Header & Quick Actions:** Café Aurora mark, language selector, and manual refresh button.
2. **Welcome Banner:** Traditional Goan greeting, Fontainhas Goa location badge, and tabletop order guidance.
3. **Multilingual Support (4 Languages):**
   - **English (EN)** – Default
   - **Hindi (HI)** – Devanagari script
   - **Konkani Devanagari (KOK_DEV)**
   - **Konkani Roman Script (KOK_ROM)**
   - *Automatic Fallback:* If a translation is missing, it gracefully falls back to English without crashing.
   - *Persistence:* Language selection persists across visits via `localStorage`.
4. **Live Search Bar & Dietary Filters:**
   - Real-time search across food names and descriptions in the active language.
   - Dietary filter chips: **All**, **Veg Only**, and **Non-Veg**.
   - Friendly empty-state message with a one-tap clear button when no dishes match.
5. **Popular / Recommended Section:** Displays dishes marked `Popular = TRUE` with a *"Chef Pick"* badge.
6. **Horizontal Category Carousel:** One-touch horizontal scrolling across all menu categories.
7. **Two-Column Mobile Food Cards:**
   - Photography with aspect-ratio placeholders and fallbacks.
   - Vegetarian (green dot) / Non-Vegetarian (red dot) indicators.
   - Support for **Dual Pricing (Half / Full)** and **Single Pricing**.
   - Availability indicators: unavailable dishes remain visible with dimmed styling and a clear *"Currently Unavailable"* label.
8. **Dedicated Category Pages (`/category/:categoryId`):**
   - Breadcrumb navigation back to home.
   - In-category search and filter bar.
   - Two-column food grid.
9. **Floating Back-to-Top Button:** Appears smoothly upon scrolling down.
10. **Café Information Footer:** Daily opening hours (8:00 AM – 11:00 PM), Fontainhas address, guest Wi-Fi details, and last menu update status.

---

## 💻 Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser. Toggle Chrome DevTools Device Mode (e.g., iPhone 14 or Pixel 7) to inspect the mobile experience.

3. Verify the production build:
   ```bash
   npm run build
   ```
