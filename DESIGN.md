---
name: TUH Laboratory Stock Design System
description: Clinical precision design system for laboratory reagent management at TUH.
colors:
  primary: "#343E9B"
  accent: "#EC6647"
  neutral-bg: "#F6F7FB"
  neutral-surface: "#FFFFFF"
  neutral-sunken: "#EEEFF5"
  neutral-ink: "#181B2A"
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
    backgroundColor: "#262E73"
---

# Design System: TUH Laboratory Stock Design System

## 1. Overview

**Creative North Star: "The Clinical Lab Ledger"**

A high-density, high-readability user interface designed specifically for medical laboratory professionals operating under variable lighting conditions. The layout avoids decorative elements in favor of a clean, structured workspace resembling an official lab record book. It rejects the generic warm-neutral SaaS aesthetic in favor of a cool blue-slate palette representing security and scientific precision.

**Key Characteristics:**
- Strict alignment to a grid system for multiple side-by-side data columns.
- Tonal layering instead of heavy borders or floating shadows.
- Visual prioritisation of safety status indicators (expiration levels, low stock alerts).

## 2. Colors

A cool, high-contrast palette anchored by laboratory indigo with coral warning accents.

### Primary
- **Laboratory Indigo** (#343E9B): Used for brand elements, primary navigation triggers, and primary actions.

### Secondary
- **Warning Coral** (#EC6647): Used strictly for expired lot numbers, critical alerts, and urgent attention markers.

### Neutral
- **Slate Ink** (#181B2A): The standard color for body copy and headings, ensuring high contrast.
- **Cool Grey Background** (#F6F7FB): Page background.
- **Pure White Surface** (#FFFFFF): Container and card backgrounds.
- **Sunken Slate** (#EEEFF5): Background for tables, lists, and inactive selectors.

**The Contrast Rule.** Body text must have a minimum contrast ratio of 4.5:1 against the background. Do not use light grey text on a white background for typography.

## 3. Typography

**Display Font:** Anuphan (with Sarabun, system-ui, sans-serif)
**Body Font:** Sarabun (with system-ui, -apple-system, sans-serif)
**Label/Mono Font:** IBM Plex Mono (for reagent codes, dates, lot IDs)

Anuphan is a modern, geometric Thai sans-serif used for displays, providing clean headlines. Sarabun is the de-facto standard font for official documents in Thailand, offering excellent readability for body text.

### Hierarchy
- **Display** (700, 2.375rem, 1.25): Hero display values and login page headings.
- **Headline** (600, 1.875rem, 1.3): Main page titles and critical status indicators.
- **Title** (600, 1.25rem, 1.35): Card headers and section titles.
- **Body** (400, 0.9375rem, 1.6): Standard text and table values. Line length capped at 75ch.
- **Label** (500, 0.6875rem, 0.04em letter-spacing): Used for product codes, timestamps, and metadata.

## 4. Elevation

The system is flat by default to maintain official document aesthetics. Depth is conveyed using tonal backgrounds (#F6F7FB vs. #FFFFFF) and thin, subtle border lines. Shadows are rare and used only to signify interactive elevation response (such as hovering over button controls).

**The Flat-By-Default Rule.** Surfaces do not float on heavy dropshadows. Shadows appear only on active states (hover) and modal overlays.

## 5. Components

### Buttons
- **Shape:** Rounded-md (8px radius)
- **Primary:** Laboratory Indigo background, white text, bold font, padding (10px 16px).
- **Hover:** Darkens background to #262E73 with a subtle glow transition.

### Cards / Containers
- **Corner Style:** Rounded-md (8px radius)
- **Background:** White surface (#FFFFFF) with a 1px border (#EEEFF5).
- **Padding:** Spacing-md (16px).

### Inputs / Fields
- **Style:** Background white, 1px border default (#C4C8D6), radius-md (8px).
- **Focus:** Shows focus ring border in #5E6CD6.

### Navigation
- **Style:** Left Sidebar rail using deep slate background. Menu items use IBM Plex Mono for badges. Hover triggers background color shift.

## 6. Do's and Don'ts

### Do:
- **Do** check typography contrast to ensure readability under lab lighting.
- **Do** use IBM Plex Mono for lot codes, PO numbers, and dates to ensure numbers align vertically.
- **Do** use distinct status icons alongside colored tags for accessibility.

### Don't:
- **Don't** use decorative gradients on text headings or card borders.
- **Don't** use side-stripe borders as indicators on tables or cards (use solid status badges instead).
- **Don't** use warm, sand-like backgrounds. Neutral backgrounds must remain cool slate-grey.
