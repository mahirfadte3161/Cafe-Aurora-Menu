# ☕ Café Aurora – Digital Menu Website

A mobile-first, production-ready digital menu website for **Café Aurora**, an authentic Goan café. Customers access this website inside the café by scanning a tabletop QR code on their smartphones to browse food categories, view food photography, read multilingual descriptions, check prices (single and half/full portions), and verify item availability.

> **Note:** This is strictly a **menu-display website**. Ordering and payments are handled in person with café floor staff.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 + Vite | Fast, responsive, component-based user interface |
| **Styling** | Tailwind CSS | Mobile-first Goan aesthetic (Terracotta, Warm Cream, Muted Green) |
| **Routing** | React Router v7 | Seamless client-side routing (`/` and `/category/:categoryId`) |
| **Icons** | Lucide React | Clean, lightweight UI icons |
| **Menu Database** | Private Google Sheets | Hotel owner manages menu directly without complex CMS |
| **Backend API** | Vercel Serverless Function (`/api/menu`) | Secure read-only proxy with Google Service Account auth |
| **Caching** | HTTP Cache + LocalStorage | 30-minute revalidation interval, background updates & offline grace |
| **Image Hosting** | Cloudinary / CDN | Fast, lazy-loaded responsive food photography |
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
   - *Automatic Fallback:* If a translation is missing in the spreadsheet, it gracefully falls back to English without crashing.
   - *Persistence:* Language selection persists across visits via `localStorage`.
4. **Live Search Bar & Dietary Filters:**
   - Real-time search across food names and descriptions in the active language.
   - Dietary filter chips: **All**, **Veg Only**, and **Non-Veg**.
   - Friendly empty-state message with a one-tap clear button when no dishes match.
5. **Popular / Recommended Section:** Displays items marked `Popular = TRUE` in the spreadsheet.
6. **Horizontal Category Carousel:** One-touch horizontal scrolling across all menu categories.
7. **Two-Column Mobile Food Cards:**
   - Lazy-loaded photography with aspect-ratio placeholders and fallbacks.
   - Vegetarian (green dot) / Non-Vegetarian (red dot) indicators.
   - Support for **Dual Pricing (Half / Full)** and **Single Pricing**.
   - Availability indicators: unavailable dishes remain visible with dimmed styling and a clear *"Currently Unavailable"* label.
8. **Dedicated Category Pages (`/category/:categoryId`):**
   - Breadcrumb navigation back to home.
   - In-category search and filter bar.
   - Two-column food grid.
9. **Floating Back-to-Top Button:** Appears smoothly upon scrolling down.
10. **Café Information Footer:** Daily opening hours (8:00 AM – 11:00 PM), Fontainhas address, guest Wi-Fi details, and timestamp of the last menu synchronization.

---

## 📂 Project Structure

```
hotel_MENU/
├── api/
│   └── menu.js               # Vercel serverless function (Google Sheets API proxy)
├── data/
│   ├── menu.csv              # 15 items extracted from menu photo (ready for Google Sheets)
│   └── categories.csv        # Categories schema (ready for Google Sheets)
├── public/                   # Static assets & favicon
├── src/
│   ├── components/
│   │   ├── BackToTop.jsx     # Floating back-to-top button
│   │   ├── CategoryNavigation.jsx # Horizontal category switcher
│   │   ├── FoodCard.jsx      # Mobile 2-column food card
│   │   ├── Footer.jsx        # Hours, Fontainhas address & Wi-Fi info
│   │   ├── Header.jsx        # Logo, brand, and language selector
│   │   ├── LanguageSelector.jsx # Dropdown for EN, HI, KOK_DEV, KOK_ROM
│   │   ├── LoadingState.jsx  # Pulse skeleton loader
│   │   ├── PopularItems.jsx  # Chef's recommendations section
│   │   ├── SearchBar.jsx     # Search bar with Veg/Non-Veg filter chips
│   │   └── WelcomeBanner.jsx # Goan welcome & dine-in instructions
│   ├── context/
│   │   └── LanguageContext.jsx # Multilingual context & English fallback engine
│   ├── data/
│   │   └── sampleData.js     # 15 verified items from photo for local dev
│   ├── hooks/
│   │   └── useMenu.js        # React hook for menu state & 30-min sync
│   ├── pages/
│   │   ├── CategoryPage.jsx  # Dedicated category page
│   │   ├── Home.jsx          # Homepage
│   │   └── NotFound.jsx      # 404 page
│   ├── services/
│   │   └── menuService.js    # Data caching & API synchronization service
│   ├── translations/
│   │   └── uiTranslations.js # UI labels for EN, HI, KOK_DEV, KOK_ROM
│   ├── utils/
│   │   └── formatPrice.js    # Currency formatter (Half/Full & Single)
│   ├── App.jsx               # Router configuration
│   ├── index.css             # Tailwind base & custom utilities
│   └── main.jsx              # React DOM mounting
├── Cafe_Aurora_Menu_Database.xlsx # Formatted Excel workbook for the owner
├── package.json
├── tailwind.config.js
├── vercel.json               # Vercel routing & cache headers
└── vite.config.js
```

---

## 📊 Google Sheets Setup Instructions

The spreadsheet acts as the database. Customers never receive direct access to this sheet.

### Step 1: Create the Google Sheet
1. Open [Google Sheets](https://sheets.new) and name the workbook **`Cafe Aurora Menu Database`**.
2. Create two tabs named exactly:
   - **`Menu`**
   - **`Categories`**
3. Import or copy the data from `data/menu.csv` into the **`Menu`** tab and `data/categories.csv` into the **`Categories`** tab (or import [Cafe_Aurora_Menu_Database.xlsx](file:///c:/Users/mahir/OneDrive/Desktop/AI%20LAB/hotel_MENU/Cafe_Aurora_Menu_Database.xlsx)).

### Step 2: Setup a Google Service Account
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project named `Cafe-Aurora-Menu`.
3. Enable the **Google Sheets API** under **APIs & Services > Library**.
4. Go to **APIs & Services > Credentials**, click **Create Credentials > Service Account**.
5. After creating the service account, click on it, go to the **Keys** tab, click **Add Key > Create new key > JSON**.
6. Download the JSON key file.

### Step 3: Share the Spreadsheet with the Service Account
1. Open the downloaded JSON file and find `client_email` (e.g. `cafe-aurora-menu@your-project.iam.gserviceaccount.com`).
2. Open your private Google Sheet, click **Share**, paste this email address, set permission to **Viewer**, and uncheck "Notify people".
3. Copy the **Spreadsheet ID** from the URL:
   `https://docs.google.com/spreadsheets/d/`**`<GOOGLE_SHEETS_ID>`**`/edit`

---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
# Spreadsheet ID from your Google Sheet URL
GOOGLE_SHEETS_ID=1a2b3c4d5e6f7g8h9i0j_your_actual_sheets_id

# Google Service Account client_email
GOOGLE_SERVICE_ACCOUNT_EMAIL=cafe-aurora-menu@your-project.iam.gserviceaccount.com

# Service Account private_key from JSON (keep quotes and newlines)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# Cloudinary Cloud Name
CLOUDINARY_CLOUD_NAME=cafe-aurora
```

*(If environment variables are omitted, the application automatically runs in development preview mode using the authentic 15-dish photo dataset.)*

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
   Open `http://localhost:3000` in your browser. Use Chrome DevTools Device Mode (iPhone / Android) to inspect the mobile experience.

3. Verify the production build:
   ```bash
   npm run build
   ```

---

## 🚀 Vercel Deployment Instructions

1. Push your repository to GitHub / GitLab:
   ```bash
   git init
   git add .
   git commit -m "feat: complete Cafe Aurora digital menu website"
   ```
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your repository.
4. Under **Environment Variables**, add:
   - `GOOGLE_SHEETS_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (paste full key including BEGIN/END lines)
   - `CLOUDINARY_CLOUD_NAME`
5. Click **Deploy**.
6. Once deployed, Vercel gives you your production URL (e.g., `https://cafe-aurora.vercel.app`).
7. Test the API endpoint directly: `https://cafe-aurora.vercel.app/api/menu`.

---

## 🖨️ Generating the Tabletop QR Code

Once the site is live on Vercel:
1. Copy the production URL (e.g. `https://cafe-aurora.vercel.app`).
2. Generate a high-resolution vector QR code (SVG or PNG 300 DPI).
3. Print tabletop tent cards or acrylic stands with the Café Aurora logo and caption:
   > *"Scan to view our Goan menu on your phone. Order directly with your server."*
