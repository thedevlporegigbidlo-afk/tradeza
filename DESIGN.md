---
name: Warm B2B Modernism
colors:
  surface: '#f2fcf2'
  surface-dim: '#d3ddd3'
  surface-bright: '#f2fcf2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf6ed'
  surface-container: '#e6f1e7'
  surface-container-high: '#e1ebe1'
  surface-container-highest: '#dbe5dc'
  on-surface: '#151e18'
  on-surface-variant: '#3f4943'
  inverse-surface: '#29332c'
  inverse-on-surface: '#e9f3ea'
  outline: '#6f7973'
  outline-variant: '#bfc9c2'
  surface-tint: '#226a4f'
  primary: '#00523a'
  on-primary: '#ffffff'
  primary-container: '#236b50'
  on-primary-container: '#a1e9c7'
  inverse-primary: '#8ed5b4'
  secondary: '#5a605b'
  on-secondary: '#ffffff'
  secondary-container: '#dbe1db'
  on-secondary-container: '#5e6460'
  tertiary: '#733434'
  on-tertiary: '#ffffff'
  tertiary-container: '#904b4a'
  on-tertiary-container: '#ffcecc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aaf2cf'
  primary-fixed-dim: '#8ed5b4'
  on-primary-fixed: '#002115'
  on-primary-fixed-variant: '#005139'
  secondary-fixed: '#dee4de'
  secondary-fixed-dim: '#c2c8c2'
  on-secondary-fixed: '#171d1a'
  on-secondary-fixed-variant: '#424844'
  tertiary-fixed: '#ffdad8'
  tertiary-fixed-dim: '#ffb3b0'
  on-tertiary-fixed: '#3a090b'
  on-tertiary-fixed-variant: '#723333'
  background: '#f2fcf2'
  on-background: '#151e18'
  surface-variant: '#dbe5dc'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system establishes a trustworthy, high-integrity environment for global business networking. Rather than relying on cold, utilitarian corporate tropes or overly stark enterprise gray-scales, the platform leans into a modern, warm editorial minimal aesthetic. 

The visual tone communicates reliability, prestige, and grounded optimism. The palette balances deeply anchored forest tones with warm, breathable organic surfaces that reduce visual fatigue during high-volume communication, discovery, and deal flow. Interfaces emphasize structured clarity, tactile softly-rounded containment, and deliberate spatial breathing room to cultivate high-trust relationship building across diverse international markets.

## Colors

The color system is calibrated specifically for clarity, prestige, and high contrast against tactile surfaces:

- **Primary (`#236B50`)**: A deep forest green serving as the anchor brand color, used for primary calls-to-action, active indicators, and verified badges. For interaction states, use `#1C573F` on hover and `#154330` on active press.
- **Secondary / Highlight Surface (`#EDF3ED`)**: A soft sage wash deployed for secondary CTAs, selected card backgrounds, active table rows, and status badges.
- **Canvas / Ground (`#FAFAF7`)**: A tailored warm off-white that establishes warmth across the entire application canvas.
- **Surface Layer (`#FFFFFF`)**: Pure crisp white reserved for raised content blocks, modal overlays, and structured card components to cleanly lift content off the canvas.
- **Border / Divider (`#E4E9E3`)**: A subtle, warm-tinted hairline neutral for structural containment without harsh division.
- **Text & Hierarchy**:
  - Primary Typography: `#202923` (dark charcoal, high contrast).
  - Secondary Typography: `#66716A` (muted sage-slate for supporting metadata and helper copy).
  - Subtle / Placeholder: `#9BA59F`.

## Typography

The typography relies on Inter set across calibrated weights to produce an authoritative, functional, and razor-sharp reading experience. 

Letter-spacing tightens progressively as headlines increase in size to ensure headline impact remains compact and punchy. Body copy maintains standard metric tracking with balanced line-heights to support uninterrupted scanning of company profiles, RFP summaries, and negotiation feeds. Numerical data and timestamps default to tabular figure styling (`tnum`) across tables and financial metric displays.

## Layout & Spacing

The layout is grounded in a flexible 12-column fluid grid system bounded by a maximum content container of 1280px to preserve readability on wide enterprise monitors:

- **Desktop (1024px and above)**: 12 columns with 24px (`1.5rem`) gutters and outer canvas margins of 48px (`3rem`). Complex dashboard modules span 4, 8, or 12 columns.
- **Tablet (768px – 1023px)**: 8 columns with 20px gutters and 32px canvas margins. Multi-column forms and split profile panes condense to a single primary stream with subordinate panels placed below.
- **Mobile (Below 768px)**: 4 columns with 16px (`1rem`) gutters and 16px (`1rem`) canvas margins. Side navigation collapses into an off-canvas drawer or sticky bottom action bar.

Vertical rhythm relies on the 8px baseline grid (`space-xs` through `space-xl`) to maintain predictable spacing between form groups, profile segments, and feed cards.

## Elevation & Depth

Visual hierarchy uses a refined dual approach pairing structured hairline borders (`#E4E9E3`) with organic, ambient drop shadows tinted using the deep forest neutral:

- **Surface Level 0 (Ground Canvas)**: `#FAFAF7` with zero elevation.
- **Surface Level 1 (Default Containers & Cards)**: `#FFFFFF` filled surface with a 1px solid `#E4E9E3` perimeter border and a soft ambient shadow: `0 1px 3px rgba(32, 41, 35, 0.04), 0 4px 12px rgba(32, 41, 35, 0.03)`.
- **Surface Level 2 (Hover States & Interactive Panels)**: Elevated card states and floating action pods transition smoothly to: `0 4px 8px rgba(32, 41, 35, 0.04), 0 12px 24px rgba(32, 41, 35, 0.06)`.
- **Surface Level 3 (Dropdowns, Overlays & Modals)**: Critical focal points utilize pure white surfaces paired with deep diffusing shadows: `0 8px 16px rgba(32, 41, 35, 0.06), 0 24px 48px rgba(32, 41, 35, 0.10)`.

Harsh black drop shadows are prohibited; all depth cues rely strictly on warm green-tinted charcoal dispersal.

## Shapes

The design system embraces a friendly, tactile geometric curvature that softens corporate interactions:

- **Containers & Major Cards**: Standardized at `rounded-lg` (16px / `1rem`) to present business profiles, connection cards, and analytical modules as approachable tiles.
- **Interactive Controls (Buttons, Inputs, Selectors)**: Built using base `rounded` (12px to 14px / `0.75rem - 0.875rem`) to feel inviting and comfortable for touch and cursor interaction.
- **Badges, Status Pills, and Avatars**: Fully rounded (`rounded-full` / 9999px) to contrast sharply with square and rectangular card structures.

## Components

### Buttons
- **Primary**: Solid `#236B50` background, pure white `#FFFFFF` label text, 12px corner radius, zero border. On hover, background shifts smoothly to `#1C573F`. On click/active, scale down to 0.99 with `#154330`.
- **Secondary / Soft**: `#EDF3ED` sage surface with `#236B50` text. Hover shifts to a 6% darker sage mix (`#DEE8DE`).
- **Outline / Tertiary**: Hairline 1px border (`#E4E9E3`), white background, `#202923` charcoal text. On hover, background becomes `#FAFAF7` with border darkened to `#CCD5CB`.

### Input Fields & Controls
- Standard height of 44px with a 12px border radius. 
- Background set to `#FFFFFF` with 1px border in `#E4E9E3`.
- Focus state brings a 1.5px crisp `#236B50` border accompanied by an ambient focus ring: `0 0 0 3px rgba(35, 107, 80, 0.15)`.
- Checkboxes and radio buttons use 20px hit targets; checked states fill with `#236B50` featuring an inset white icon.

### Cards & Networking Modules
- Cards feature `#FFFFFF` fill, 16px radius, and a 1px border (`#E4E9E3`).
- Internal content blocks use 20px to 24px inner padding.
- Interactive connection cards feature a subtle translateY(-2px) lift and elevation transition on hover.

### Chips & Verification Badges
- **Status/Filter Chips**: Pill-shaped (9999px) with horizontal padding of 14px and vertical padding of 6px. Default state uses `#FFFFFF` with `#E4E9E3` border; active selection shifts to `#EDF3ED` with `#236B50` text and border.
- **Trust & Verification Badges**: `#EDF3ED` background, `#236B50` icon and typography, styled with label-sm typography to cleanly authenticate vetted enterprises.

### Company Profile Header & Deal Tiles
- Specialized container featuring two-tone visual stacking: a soft sage header cap (`#EDF3ED`) seamlessly nesting the company avatar, transitioning to a clean `#FFFFFF` body for metrics, industry categories, and primary outreach actions.