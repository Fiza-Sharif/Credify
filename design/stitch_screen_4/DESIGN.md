---
name: Credify
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#f9c845'
  on-tertiary: '#3e2e00'
  tertiary-container: '#daad2a'
  on-tertiary-container: '#574200'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#ffdf95'
  tertiary-fixed-dim: '#f0c03e'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: 0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
  mono-data:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system embodies "Dark Luxury" tailored for high-stakes fintech and AI-driven wealth management. The aesthetic is anchored in **Minimalism** with a **Glassmorphic** layer, prioritizing depth through light attenuation rather than heavy color saturation.

The target audience consists of high-net-worth individuals and institutional investors who value precision, privacy, and performance. The UI should evoke an emotional response of "Quiet Confidence"—avoiding flashy animations in favor of purposeful, fluid transitions and stable, structured layouts. The style utilizes deep blacks to create a "void" effect, allowing gold accents and high-contrast typography to guide the user’s focus toward critical financial data.

## Colors

This design system uses a curated "Obsidian & Gold" palette. 

- **Primaries:** Use `#D4AF37` (Primary Gold) for core actions. Use `#F5C542` (Bright Gold) sparingly for high-attention alerts or hover states to provide a "metallic shine" effect.
- **Surface Strategy:** The UI is built on layers of increasing luminosity. The base background is absolute dark (`#050505`). Cards sit at `#121212`, and interactive elements or modal overlays sit at `#181818`.
- **Text Contrast:** Primary text is an off-white (`#F5F5F0`) to reduce harshness against the black background, while muted text ensures metadata doesn't compete with primary financial figures.
- **Borders:** Borders should be used sparingly, primarily as a 1px separator using `#2A2A2A`.

## Typography

The typographic hierarchy prioritizes readability and a "technical-luxe" feel. 

- **Headlines:** Uses **Manrope** for its modern, balanced geometry. Large displays should use tighter tracking, while smaller headings benefit from slight expansion to feel more breathable.
- **Body:** **Inter** provides the utilitarian clarity required for complex financial data.
- **Labels & Data:** **Geist** is used for monospaced numeric data and small labels to convey the AI/technical nature of the platform.
- **Styling:** For a premium feel, all labels and small headers should use `0.05em` to `0.1em` tracking (letter-spacing) and often appear in uppercase when used as section descriptors.

## Layout & Spacing

The layout follows a **Fixed Grid** model on desktop to maintain a cinematic, centered focus, while transitioning to a **Fluid Grid** on mobile devices.

- **Grid:** Use a 12-column grid for desktop with wide 64px margins to emphasize exclusivity and whitespace.
- **Rhythm:** Spacing follows an 8px linear scale. For luxury layouts, err on the side of "too much" whitespace rather than too little. Avoid crowding elements; use `stack-lg` (48px) to separate distinct functional blocks.
- **Mobile:** On mobile, reduce margins to 16px and stack all card components vertically. Use `100%` width for buttons.

## Elevation & Depth

In this dark system, elevation is conveyed through **Tonal Layers** and **Ambient Glows** rather than traditional shadows.

- **Stacking:** Surface levels move from `#050505` (Ground) → `#121212` (Card) → `#181818` (Active/Hover).
- **Glows:** High-priority cards or active elements should utilize a very soft, diffused outer glow using the primary gold color (opacity 5-10%) to simulate a backlit "aura" effect.
- **Glassmorphism:** Navigation bars and modal overlays must use a `backdrop-filter: blur(20px)` with a semi-transparent `#0D0D0D` fill to maintain context of the underlying data while providing a premium, frosted-lens feel.

## Shapes

The design system uses a "Refined Geometric" shape language.

- **Standard Radius:** 8px (`0.5rem`) for standard cards and input fields. This strikes a balance between professional rigor and modern softness.
- **Large Radius:** 16px (`1rem`) for primary containers or hero sections.
- **Buttons:** Primary buttons can use either the standard 8px radius or a full **Pill-shape** for high-contrast CTA differentiation.
- **Interactive Elements:** Checkboxes and radio buttons should maintain the 4px small-radius to appear precise.

## Components

### Buttons
- **Primary:** Background of `#D4AF37` with black text. On hover, transition to `#F5C542` with a subtle gold drop-shadow (`0px 4px 20px rgba(212, 175, 55, 0.3)`).
- **Secondary/Glass:** Transparent background, 1px border of `#D4AF37`, and gold text. Add a `backdrop-filter` for a glass effect.

### Cards
- **Standard:** Background `#121212`, 1px border of `#2A2A2A`.
- **Hover State:** Border shifts to `#D4AF37` (50% opacity) and the card lifts slightly via a subtle gold ambient glow.

### Input Fields
- Background: `#0D0D0D`. Border: 1px solid `#2A2A2A`.
- **Focus State:** Border becomes `#D4AF37` with a 2px inner glow. Use `Geist` font for numerical inputs.

### Chips & Tags
- Use small, uppercase labels with high letter-spacing. Backgrounds should be dark (`#181818`) with gold or muted-gray borders to denote status without overpowering the UI.

### Charts & Data Viz
- AI insights should be highlighted with a gold-to-transparent gradient. Lines should be thin (1.5px) and use `Bright Gold` for primary data points against the dark void.