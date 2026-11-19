---
name: Academic Modernity
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#464555'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#ae2f34'
  on-secondary: '#ffffff'
  secondary-container: '#ff6b6b'
  on-secondary-container: '#6d0010'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#ffdad8'
  secondary-fixed-dim: '#ffb3b0'
  on-secondary-fixed: '#410006'
  on-secondary-fixed-variant: '#8c1520'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  display:
    fontFamily: Sora
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Sora
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Sora
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title:
    fontFamily: Sora
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
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
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system embodies an academic, structured, and modern spirit tailored for French university administration, specifically third-year university cohorts (Licence Pro / L3 SIL), academic supervisors, and corporate tutors. The aesthetic balances institutional rigor with fresh, dynamic digital ergonomics.

The visual direction merges **Corporate / Modern** foundations with refined **Minimalism** and subtle structural clarity:
- **Tone:** Academic, dependable, clear, and encouraging.
- **Audience:** Students submitting convention requests and defense theses, academic jury members, administrative coordinators, and company liaisons.
- **Experience:** Low cognitive load, high legibility for dense forms and official administrative workflows, and immediate validation feedback.

## Colors

The color system leverages high-contrast functional color roles anchored against soft atmospheric backgrounds.

### Color Roles
- **Primary (`#4F46E5`):** Deep Indigo/Violet. Represents institutional authority, official university processes, primary interactive elements, and progressive completion states.
- **Accent / Secondary (`#FF6B6B`):** Warm Coral. Used sparingly for highlights, key deadlines, active defense scheduling indicators, and critical callouts.
- **Semantic Feedback:**
  - **Success / Menthe (`#10B981`):** Validated requests, signed agreements, defense completions.
  - **Warning / Ambre (`#F59E0B`):** Pending approvals, missing documentation, pending university signatures.
  - **Error / Danger (`#EF4444`):** Rejected submissions, cancellation notices, expired deadlines.
- **Surfaces & Backgrounds:**
  - **Canvas Base (`#F7F8FC`):** Crisp cool tinted off-white reducing eye strain during extended administrative reviews.
  - **Card / Surface Base (`#FFFFFF`):** Pure white for elevated data containers and form blocks.
- **Typography & Neutral Tokens:**
  - **Text Primary (`#111827`):** Near-black for crisp, effortless readability.
  - **Text Secondary (`#6B7280`):** Neutral slate for metadata, instructions, and timestamps.
  - **Border Muted (`#E5E7EB`):** Subtle dividers and card perimeter definition.

## Typography

The typographic hierarchy combines **Sora** for structured, forward-looking headings with **Inter** for neutral, utilitarian data reading.

- **Headlines (Sora):** Employs geometric rhythm to give institutional titles a contemporary signature. Negative letter-spacing is applied on levels 24px and above to prevent sparse appearances.
- **Body & Data (Inter):** Highly legible x-height suited for official documentation, defense jury notes, candidate names, and status tables.
- **Form Labels & Badges:** Use `label-md` and `label-sm` with medium and semibold weights to guarantee immediate scanability on dashboards and multi-step conventions.

## Layout & Spacing

The layout is built on a responsive 12-column fluid grid system bounded by a max container width of `1280px` for optimal data density.

### Responsive Breakpoints
- **Mobile (`< 768px`):** Single column stack, `margin-mobile` (16px), `gutter-mobile` (16px). Bottom sheets for filter actions; tabs scroll horizontally.
- **Tablet (`768px - 1024px`):** 8-column layout, `margin` (32px), `gutter` (24px). Sidebar collapses to an icon rail or top bar.
- **Desktop (`> 1024px`):** 12-column layout with persistent sidebar navigation (260px fixed width) and fluid main dashboard area.

### Vertical Rhythm
Structural sections (e.g., student details, convention stages, thesis schedules) maintain a minimum vertical gap of `space-xl` (32px). Form field groupings utilize `space-md` (16px), while related label-to-input pairings use `space-xs` (4px).

## Elevation & Depth

Visual hierarchy uses **tonal surfaces** and **ambient shadows** with a subtle neutral-cool tint (`rgb(17, 24, 39)`), strictly avoiding muddy or harsh drops.

- **Level 0 (Flat / Canvas):** Used for background canvas (`#F7F8FC`).
- **Level 1 (Card Default):** `0 1px 3px 0 rgba(17, 24, 39, 0.05), 0 1px 2px -1px rgba(17, 24, 39, 0.05)`. Border: `1px solid #E5E7EB`.
- **Level 2 (Hover / Elevated Cards):** `0 4px 6px -1px rgba(17, 24, 39, 0.07), 0 2px 4px -2px rgba(17, 24, 39, 0.05)`. Applied on hover states for interactive stages and defense schedule listings.
- **Level 3 (Modals / Flyouts):** `0 10px 15px -3px rgba(17, 24, 39, 0.08), 0 4px 6px -4px rgba(17, 24, 39, 0.04)`. Accompanied by an overlaid backdrop blur (`backdrop-blur-sm`, `rgba(17, 24, 39, 0.4)`).

## Shapes

The design uses balanced, modern curves aligned with a foundational `16px` border-radius (`rounded-lg`) for all primary surfaces:
- **Cards & Modal Containers:** `16px` (`rounded-lg`) to create friendly, organized academic clusters.
- **Buttons, Form Inputs & Filters:** `8px` (`rounded`) for functional tactile definition.
- **Status Badges & Pills:** Completely rounded (`9999px`) to distinguish visual metadata from action triggers.

## Components

### Buttons
- **Primary:** Solid `#4F46E5` with `#FFFFFF` text. Focus ring: `3px solid rgba(79, 70, 229, 0.25)`. Height: `40px` (`36px` on dense tables).
- **Secondary:** Surface `#FFFFFF`, border `1px solid #E5E7EB`, text `#111827`. Hover: `#F9FAFB`.
- **Ghost:** Background transparent, text `#4F46E5`. Hover: `rgba(79, 70, 229, 0.08)`.
- **Destructive:** Solid `#EF4444` or outline with `#EF4444` border and text for convention refusal and cancellation.

### Badges & Status Indicators
Rendered with `label-sm` typography, pill shape (`rounded-full`), padded `4px 10px`:
- **Brouillon (Draft):** Background `#F3F4F6`, text `#4B5563`, border `1px solid #E5E7EB`.
- **Soumise (Submitted):** Background `rgba(79, 70, 229, 0.10)`, text `#4F46E5`, border `1px solid rgba(79, 70, 229, 0.20)`.
- **Validée (Approved):** Background `rgba(16, 185, 129, 0.10)`, text `#065F46`, border `1px solid rgba(16, 185, 129, 0.20)`.
- **Refusée (Rejected):** Background `rgba(239, 68, 68, 0.10)`, text `#991B1B`, border `1px solid rgba(239, 68, 68, 0.20)`.
- **À Corriger (Action Required):** Background `rgba(245, 158, 11, 0.12)`, text `#92400E`, border `1px solid rgba(245, 158, 11, 0.25)`.

### Form Fields & Inputs
- **Structure:** Always place labels (`label-md`, `#111827`) directly above inputs, separated by `space-xs` (4px). Mandatory markers indicated by `#EF4444` asterisk.
- **Input Styling:** Height `42px`, background `#FFFFFF`, border `1px solid #E5E7EB`, text `#111827`, placeholder `#9CA3AF`. Rounded `8px`.
- **Focus State:** Border `#4F46E5`, outline ring `2px rgba(79, 70, 229, 0.20)`.
- **Error State:** Border `#EF4444`, helper text `#EF4444` (`caption`).

### Cards & Surface Containers
- Surface: `#FFFFFF`.
- Corner Radius: `16px`.
- Border: `1px solid #E5E7EB`.
- Padding: `24px` on desktop, `16px` on mobile.

### Timeline & Stage Progress Indicators
- Linear or stepped node indicators displaying internship workflow milestones (e.g., *Proposition > Validation Entreprise > Validation Tuteur > Soutenance Programmée*).
- Active nodes use `#4F46E5` with pulse indicators; completed nodes use `#10B981` with checkmark glyphs; pending nodes use `#E5E7EB` with `#9CA3AF` text.

### KPI & Metric Cards
- Compact white cards displaying key statistics (e.g., *Taux de validation*, *Soutenances restantes*).
- Value rendered in Sora `headline-md`, label in Inter `label-md` `#6B7280`, and status variance badge in `#10B981` or `#FF6B6B`.