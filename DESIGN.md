---
name: Elevate OS
colors:
  surface: '#f6faff'
  surface-dim: '#d2dbe4'
  surface-bright: '#f6faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf5fe'
  surface-container: '#e6eff8'
  surface-container-high: '#e0e9f2'
  surface-container-highest: '#dbe4ed'
  on-surface: '#141d23'
  on-surface-variant: '#434656'
  inverse-surface: '#293138'
  inverse-on-surface: '#e9f2fb'
  outline: '#737688'
  outline-variant: '#c3c5d9'
  surface-tint: '#004dea'
  primary: '#0041c8'
  on-primary: '#ffffff'
  primary-container: '#0055ff'
  on-primary-container: '#e3e6ff'
  inverse-primary: '#b6c4ff'
  secondary: '#5c5f60'
  on-secondary: '#ffffff'
  secondary-container: '#e1e3e4'
  on-secondary-container: '#626566'
  tertiary: '#504f4f'
  on-tertiary: '#ffffff'
  tertiary-container: '#686767'
  on-tertiary-container: '#eae6e6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b3'
  secondary-fixed: '#e1e3e4'
  secondary-fixed-dim: '#c5c7c8'
  on-secondary-fixed: '#191c1d'
  on-secondary-fixed-variant: '#454748'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#f6faff'
  on-background: '#141d23'
  surface-variant: '#dbe4ed'
typography:
  display:
    fontFamily: Manrope
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
---

## Brand & Style

The design system is rooted in the philosophy of "Cognitive Clarity." It targets high-achievers seeking a premium, distraction-free environment for personal evolution. The brand personality is focused, empowering, and relentlessly consistent, acting as a quiet partner in the user's growth journey.

The visual style is a sophisticated blend of **High-End Minimalism** and **Modern Glassmorphism**. By utilizing a monochrome base with a single, vibrant "Focus Blue," the UI directs attention toward intent rather than interface. The aesthetic prioritizes breathability through ample whitespace, reducing cognitive load and evoking a sense of calm authority. Elements feel light yet grounded, using soft shadows and subtle gradients to suggest depth without clutter.

## Colors

The palette is intentionally restrained to maximize the impact of the primary accent.

*   **Primary (Focus Blue):** A deep, vibrant blue used exclusively for primary actions, progress indicators, and active states. It symbolizes momentum and clarity.
*   **Surface & Background:** A spectrum of pure whites and ultra-light grays (#FFFFFF to #F8F9FA) create a "gallery-like" backdrop.
*   **Typography & Accents:** High-contrast blacks (#121212) for headlines and body text ensure maximum readability. Mid-tone grays are reserved for secondary metadata and disabled states.
*   **Semantic Accents:** Success, warning, and error states should use desaturated versions of their respective hues to maintain the calming aesthetic.

## Typography

This design system utilizes **Manrope** as the primary typeface for its modern, balanced, and highly legible characteristics. Headlines use tighter tracking and heavier weights to command attention, while body text is spaced generously to facilitate long-form reflection.

For technical data, timestamps, and secondary labels, **JetBrains Mono** is introduced in all-caps. This monospaced contrast provides a "systematic" feel, grounding the organic nature of personal growth in a structured, data-driven reality.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. On desktop, content is contained within a 1200px centered track to prevent eye strain. On smaller viewports, the grid transitions to a fluid system with generous 20px side margins.

Spacing is governed by an 8px linear scale. Large-scale components (cards, sections) should use significant vertical padding (64px+) to create the "premium" sense of space. Elements within a group should remain tightly coupled (8px or 16px) to maintain clear visual hierarchy.

## Elevation & Depth

This design system rejects heavy, muddy shadows in favor of **Ambient Depth**. 

1.  **Level 0 (Base):** Pure #FFFFFF or #F8F9FA.
2.  **Level 1 (Cards):** Subtle 1px borders (#EEEEEE) with a very soft, high-diffusion shadow (0px 10px 40px rgba(0,0,0,0.03)).
3.  **Level 2 (Modals/Overlays):** Glassmorphism layers using 20px backdrop blur and 80% opacity white fill. These surfaces should have a crisp 0.5px white inner stroke to simulate light hitting the edge of glass.
4.  **Interaction:** Buttons use a more pronounced shadow upon hover to simulate a tactile "lift," reinforcing the user's agency.

## Shapes

The shape language is defined by **Rounded** geometry. The standard 0.5rem (8px) radius is used for input fields and small buttons, while larger containers and cards utilize 1.5rem (24px) to create a soft, inviting container for user data.

All progress bars and pill-tags use "Full Rounding" (999px) to contrast against the structured grid and provide a friendly, organic touch to technical indicators.

## Components

*   **Buttons:** Primary buttons are high-contrast black (#121212) with white text, or vibrant Focus Blue for critical path actions. They feature significant horizontal padding (32px) and no border. Secondary buttons use a transparent background with a subtle gray stroke.
*   **Cards:** Large radii (24px), subtle shadows, and generous internal padding (32px). Headers within cards should be clearly separated using the `label-caps` typography style.
*   **Input Fields:** Minimalist design with only a bottom border (2px) that transforms into a Focus Blue state when active. Labels float above the field in `label-caps`.
*   **Progress Indicators:** Thin, sleek bars with a Focus Blue fill and a light gray track.
*   **Glass Chips:** Category tags use a semi-transparent white background with backdrop-blur, making them feel like physical tabs resting on the surface.
*   **Lists:** High whitespace between items. Interaction is signaled by a subtle background color shift to #F8F9FA rather than a border change.