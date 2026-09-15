---
name: TUH Laboratory Stock Design System
description: Clinical precision design system for laboratory reagent management at TUH, using the Glass Dark theme.
colors:
  primary: "#0E9587"
  accent: "#EC6647"
  neutral-bg: "#002934"
  neutral-surface: "rgba(0, 72, 92, 0.45)"
  neutral-sunken: "rgba(0, 30, 39, 0.6)"
  neutral-ink: "#ECF7F4"
typography:
  display:
    fontFamily: "Anuphan, Sarabun, system-ui, sans-serif"
    fontSize: "2.375rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Sarabun, system-ui, -apple-system, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "5px"
  md: "8px"
  lg: "12px"
spacing:
  sm: "8px"
  md: "16px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "#1FA090"
---

# Design System: TUH Laboratory Stock Design System

## 1. Overview

**Creative North Star: "The Clinical Lab Ledger"**

A high-density, high-readability user interface designed specifically for medical laboratory professionals operating under variable lighting conditions. The layout avoids decorative elements in favor of a clean, structured workspace resembling an official lab record book. It utilizes the "Glass Dark" theme — a cool, translucent dark-teal palette representing security, clinical cleanliness, and scientific precision.

The system uses the **View Transitions API** (`document.startViewTransition`) to provide cinematic page state transitions and morphing drawer elevations, preserving the user's spatial focus when navigating.

**Key Characteristics:**
- Strict alignment to a grid system for multiple side-by-side data columns.
- Tonal layering and translucent glass variables instead of heavy shadows.
- Visual prioritisation of safety status indicators (expiration levels, low stock alerts).
- Integrated celebratory micro-animations (HTML5 canvas confetti) triggered upon successful inventory actions (reconciliation, receipts).

---

## 2. Colors

A cool, translucent high-contrast palette anchored by laboratory teal-green with coral warning accents.

### Primary
- **Laboratory Teal** (#0E9587 / --brand-700): Used for brand elements, primary navigation highlights, and primary actions.

### Secondary
- **Warning Coral** (#EC6647): Used strictly for expired lot numbers, critical alerts, and urgent attention markers.

### Neutral
- **Mint Ink** (#ECF7F4 / --text-primary): The standard color for body copy and headings, ensuring high contrast on dark backgrounds.
- **Glass Ocean Background** (#002934 / --surface-page): Full-page deep teal background.
- **Translucent Teal Surface** (rgba(0, 72, 92, 0.45) / --surface-card): Card backgrounds with blur filters.
- **Sunken Dark Teal** (rgba(0, 30, 39, 0.6) / --surface-sunken): Background for tables, lists, and inactive panels.

**The Contrast Rule.** Body text must have a minimum contrast ratio of 4.5:1 against the background. Do not use light grey text on a white background for typography.

**The Quiet Saturation Rule.** Do not use high-saturation neon colors for status fills. Accents must use restrained tones to prevent visual fatigue under laboratory light.

---

## 3. Typography

**Display Font:** Anuphan (with Sarabun, system-ui, sans-serif)
**Body Font:** Sarabun (with system-ui, -apple-system, sans-serif)
**Label/Mono Font:** IBM Plex Mono (for reagent codes, dates, lot IDs)

Anuphan is a modern, geometric Thai sans-serif used for displays, providing clean headlines. Sarabun is the de-facto standard font for official documents in Thailand, offering excellent readability for body text. IBM Plex Mono locks numeric characters into matching alignments.

### Hierarchy
- **Display** (700, 2.375rem, 1.25): Hero display values and login page headings.
- **Headline** (600, 1.875rem, 1.3): Main page titles and critical status indicators.
- **Title** (600, 1.25rem, 1.35): Card headers and section titles.
- **Body** (400, 0.9375rem, 1.6): Standard text and table values. Line length capped at 75ch.
- **Label** (500, 0.6875rem, 0.04em letter-spacing): Used for product codes, timestamps, and metadata.

**The Tabular Number Rule.** Tables and lists rendering lot IDs, transaction records, and numeric quantities must use IBM Plex Mono to align values vertically.

**The Sticker Auto-scale Rule.** Long reagent names on stickers must wrap up to 2 lines and dynamically scale down their font sizes (from 8.5px/48px to 6px/22px) to prevent layout overflows.

---

## 4. Elevation

The system is flat by default to maintain official document aesthetics. Depth is conveyed using tonal backgrounds and thin, subtle border lines. Shadows are rare and used only to signify interactive elevation response (such as hovering over button controls).

**The Flat-By-Default Rule.** Surfaces do not float on heavy dropshadows. Shadows appear only on active states (hover) and modal overlays.

---

## 5. Components

### Buttons
- **Shape:** Rounded-md (8px radius)
- **Primary:** Laboratory Teal background, white text, bold font, padding (10px 16px).
- **Hover:** Darkens background to #1FA090 with a subtle glow transition. A diagonal sheen sweep-on-hover is animated on download/print triggers.

### Cards / Containers
- **Corner Style:** Rounded-md (8px radius)
- **Background:** Translucent teal surface (rgba(0, 72, 92, 0.45)) with a 1px border.
- **Padding:** Spacing-md (16px).

### Inputs / Fields
- **Style:** Background dark, 1px border default, radius-md (8px).
- **Focus:** Shows focus ring border in #33A593 with a soft glow.

### Navigation
- **Style:** Left Sidebar rail using deep slate background. Menu items use IBM Plex Mono for badges. Hover triggers background color shift.

### Sticker Label
- **Layout:** Standard A4 PDF reporting and 40x20mm thermal print layouts. Forces margin zero, hiding all navigation controls to align raw elements precisely on printer limits.

---

## 6. Do's and Don'ts

### Do:
- **Do** check typography contrast to ensure readability under lab lighting.
- **Do** use IBM Plex Mono for lot codes, PO numbers, and dates to ensure numbers align vertically.
- **Do** use distinct status icons alongside colored tags for accessibility.
- **Do** wrap view transitions under the View Transitions block to keep page swaps smooth.

### Don't:
- **Don't** use decorative gradients on text headings or card borders.
- **Don't** use side-stripe borders as indicators on tables or cards (use solid status badges instead).
- **Don't** allow transactions or corrections that drive a lot balance below zero.
- **Don't** use warm, sand-like backgrounds. Neutral backgrounds must remain cool slate-grey.

## September 2026 visual refinement

`src/redesign.css` is loaded after the legacy stylesheet. It owns the shared
screen-only refinement: opaque dark teal surfaces, readable neutral text,
consistent receive/issue actions, quiet table hover and visible keyboard focus.
Print layouts retain their existing styles. Modal headers use a pale teal surface.

Dashboard's `StockOverview` presents mutually exclusive counts of active lots
with positive balance: expired before today, today through 60 days, and later
than 60 days. It counts lots (never adds incompatible reagent units) and is
explicitly independent of the report filters. Data comes from `renderVals()`.
The graphic has text labels, an accessible summary, and an empty state.

Motion uses short crossfades, directional drawer entry and control feedback;
reduced-motion disables transitions throughout. Mobile report controls wrap.

Validation: production build and 36 domain tests passed. Local visual review
used a temporary sample-data harness for desktop 1440×1000 and narrow mobile
layouts, including dashboard, inventory, sticker form and receive modal.
Live D1 transactions and printed output were not exercised in this design pass.

### Semantic color roles

The screen refinement now separates teal actions from status. Primary actions
use #0b7365 with white text (5.75:1); issue launchers are neutral outlined
controls and issue confirmation uses the same primary teal. Amber indicates
warnings, coral indicates critical/expired states, and blue indicates information
or recorded issues/orders. The underlying severity thresholds are unchanged.
The expiry infographic reuses the status tokens. Light form scopes use muted
teal-gray surfaces and dark ink instead of the old purple brand overrides.
Checked key text/background pairs exceed 4.5:1. Receive modal and dashboard
were visually checked in the local browser using temporary sample UI.

### Mobile task layouts

`src/mobile.css` applies below 769px. The icon rail becomes an on-demand,
labelled navigation drawer with a backdrop, Escape handling, focus containment
and focus return. Receive/issue remain in the bottom action bar; the main canvas
uses the full width. Dynamic viewport height and safe-area padding accommodate
phone browser chrome and landscape layouts.

Receive/issue/register forms size to their content and scroll within the screen.
Issue summaries stack the reagent, lot and balances; FEFO allocation rows keep
quantity and expiry readable. Stock count and preparation records become labelled
vertical records on phones; the permissions matrix retains horizontal scrolling
with an explicit hint. Desktop tables remain intact. Search/date filters and
sticker/help grids fit narrow widths; form controls use 16px text on phones.

Verified with temporary sample data at 320, 360 and 390px: navigation, inventory
with long names, receive form, issue lookup and allocation preview, stock-count
quantity/reason entry, audit filters, sticker creation and preparation records.
Checked landscape form scrolling at 740×360 and desktop sidebar at 1280px.
No live transactions were submitted. Physical iOS/Android keyboard and camera
behavior require device testing; browser viewport checks do not cover those.
