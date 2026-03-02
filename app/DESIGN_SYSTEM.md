---
title: DealFlow Design System
created: 2026-03-02
modified: 2026-03-02
category: design
status: active
tags: [design-system, tokens, glassmorphism, tailwind, shadcn]
---

# DealFlow Design System

> Visual language, design tokens, and component patterns for the DealFlow influencer platform.
> Derived from the Creator Hub (light) and Influencer Dashboard (dark/glassmorphism) mockups.

---

## 1. Design Philosophy

DealFlow's visual language communicates **premium confidence** to creators managing their business. Every surface, color choice, and interaction should reinforce that the user is in control of their professional workflow.

| Principle | Implementation |
|-----------|---------------|
| **Premium depth** | Glassmorphism cards with layered transparency create a sense of floating UI above a rich gradient canvas |
| **Warm energy** | Coral-to-orange gradient accents convey action and momentum without aggression |
| **Platform trust** | Consistent spacing, accessible contrast, and systematic tokens build subconscious trust |
| **Creator identity** | Color-coded platforms (IG coral, TT lavender, YT mint) speak the creator's language |

---

## 2. Color Palette

### 2.1 Brand Colors (Theme-Independent)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-coral` | `#E8788A` | Primary brand, Instagram, destructive-adjacent |
| `--color-coral-light` | `#F2A3AE` | Hover states, backgrounds at 15% opacity |
| `--color-coral-dark` | `#C95A6C` | Active states, pressed |
| `--color-mint` | `#7ECFB3` | Success, paid status, YouTube platform |
| `--color-mint-light` | `#A8E0CB` | Hover states |
| `--color-mint-dark` | `#5AB896` | Active states |
| `--color-lavender` | `#B8A9E8` | Neutral accent, TikTok platform |
| `--color-lavender-light` | `#D1C7F0` | Hover states |
| `--color-lavender-dark` | `#9480D6` | Active states |

### 2.2 Accent & Gradient Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-orange` | `#F5A623` | CTA buttons, active indicators, pending status |
| `--color-orange-light` | `#FBCB6E` | Hover states |
| `--color-orange-dark` | `#D98E14` | Active/pressed states |
| `--color-purple` | `#7C3AED` | Gradient backgrounds, premium features |
| `--color-purple-light` | `#A78BFA` | Lighter gradient stops |
| `--color-purple-dark` | `#5B21B6` | Deep gradient anchor |
| `--color-violet` | `#8B5CF6` | Mid-gradient accent |

### 2.3 Semantic Status Colors

| Token | Color | Usage |
|-------|-------|-------|
| `--color-success` | `#22C55E` | Generic success (distinct from mint brand color) |
| `--color-warning` | `#F5A623` | Warning states (same as orange) |
| `--color-info` | `#3B82F6` | Information notices |
| `--color-paid` | mint | Invoice paid, deal completed |
| `--color-pending` | orange | Invoice pending, deal in-progress |
| `--color-overdue` | coral | Invoice overdue, urgent attention |

### 2.4 Chart Palette (5 colors)

Used consistently across all Recharts visualizations:

| Token | Light | Dark | Purpose |
|-------|-------|------|---------|
| `chart-1` | Coral | Brighter coral | Primary data series |
| `chart-2` | Mint | Brighter mint | Secondary data series |
| `chart-3` | Lavender | Brighter lavender | Tertiary data series |
| `chart-4` | Amber | Brighter amber | Quaternary |
| `chart-5` | Teal | Brighter teal | Quinary |

---

## 3. Typography

### 3.1 Font Stack

| Role | Font | Variable | Weight | Usage |
|------|------|----------|--------|-------|
| Display/Heading | DM Serif Display | `--font-serif` | 400 | Page titles, card headings, brand name |
| Body/UI | Inter | `--font-sans` | 400-700 | Body text, labels, buttons, navigation |

### 3.2 Scale

| Level | Class | Size | Weight | Line Height | Usage |
|-------|-------|------|--------|-------------|-------|
| H1 | `font-serif text-3xl` | 30px | 400 | 1.2 | Page headings ("Dashboard") |
| H2 | `font-serif text-2xl` | 24px | 400 | 1.2 | Section headings |
| H3 | `text-lg font-semibold` | 18px | 600 | 1.4 | Card titles |
| Body | `text-sm` | 14px | 400 | 1.5 | Default body text |
| Caption | `text-xs` | 12px | 500 | 1.4 | Labels, meta, timestamps |
| Micro | `text-[10px]` | 10px | 500 | 1.3 | Status badges, chart labels |

### 3.3 Special Text

- **Gradient text** (`text-gradient-brand`): Coral-to-orange-to-lavender gradient for the DealFlow logo and premium display text
- **Stat values**: `text-2xl font-bold tracking-tight` for KPI numbers
- **Trend indicators**: `text-xs font-medium` with semantic color (green up, red down)

---

## 4. Spacing System

Based on an **8px grid** with 4px half-step for fine adjustments:

| Token | Value | Usage |
|-------|-------|-------|
| `gap-1` | 4px | Tight inline spacing (icon + text) |
| `gap-1.5` | 6px | Day grid cells, badge padding |
| `gap-2` | 8px | Default element spacing |
| `gap-3` | 12px | Card internal sections, stat grids |
| `gap-4` | 16px | Grid gaps (mobile), card groups |
| `gap-5` | 20px | Grid gaps (desktop), primary spacing unit |
| `gap-6` | 24px | Card padding (px-6, py-6), section spacing |
| `gap-8` | 32px | Shell padding (desktop) |

### Dashboard Layout Spacing

| Area | Mobile | Tablet | Desktop |
|------|--------|--------|---------|
| Shell padding | 16px | 24px | 32px |
| Grid gap | 20px | 20px | 20px |
| Stats gap | 12px | 16px | 16px |
| Card padding | 24px | 24px | 24px |

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | 12px | Base radius |
| `--radius-sm` | 8px | Badges, small inputs |
| `--radius-md` | 10px | Buttons, form elements |
| `--radius-lg` | 12px | Standard cards |
| `--radius-xl` | 16px | Large cards, modals |
| `--radius-2xl` | 20px | Glassmorphism cards |
| `rounded-full` | 9999px | Avatars, badges, dots |

---

## 6. Glassmorphism System

### 6.1 Token Definitions

| Token | Light Theme | Dark Theme |
|-------|-------------|------------|
| `--glass-bg` | `white / 70%` | `hsl(280, dark) / 40%` |
| `--glass-border` | `black / 8%` | `white / 12%` |
| `--glass-blur` | `12px` | `20px` |
| `--glass-shadow` | Subtle 2-layer | 3-layer with inner glow |

### 6.2 Utility Classes

| Class | Blur | Usage |
|-------|------|-------|
| `.glass` | 20px (dark) / 12px (light) | Standard glass cards |
| `.glass-heavy` | 32px + saturate(1.5) | Mobile nav, layered overlays |
| `.glass-subtle` | 8px | Sidebar, header, non-primary surfaces |
| `.glass-highlight` | -- | Adds top-edge catch-light gradient border |

### 6.3 Usage Pattern

```tsx
// Standard glass card
<Card variant="glass">...</Card>

// Manual glass surface
<div className="glass glass-highlight rounded-2xl p-6">
  Content here
</div>

// Subtle glass for layout elements
<aside className="glass-subtle border-r border-sidebar-border">
  Navigation
</aside>
```

---

## 7. Gradient Backgrounds

### 7.1 Dashboard Canvas

The main content area sits on a gradient background. Glass cards float above it, allowing the gradient to bleed through their translucent surfaces.

**Light theme** (`.bg-dashboard-gradient`):
```
linear-gradient(135deg, #F8F6FF 0%, #FFF5F5 50%, #F0FDF4 100%)
```
Subtle lavender-to-pink-to-mint for a soft, airy feel.

**Dark theme** (`.bg-mesh-gradient`):
```
radial-gradient(ellipse at 20% 20%, purple/60% ...)
radial-gradient(ellipse at 80% 80%, orange/40% ...)
radial-gradient(ellipse at center, deep-purple ...)
```
Multi-layer mesh gradient with purple and orange pools of color.

### 7.2 Glow Effects

| Class | Color | Usage |
|-------|-------|-------|
| `.glow-orange` | Orange / 25% | Accent button hover, active CTA |
| `.glow-coral` | Coral / 25% | Primary action emphasis |
| `.glow-purple` | Purple / 25% | Premium feature indicators |

---

## 8. Component Variants

### 8.1 Card

| Variant | Class | Surface | Border | Shadow |
|---------|-------|---------|--------|--------|
| `default` | `<Card>` | Opaque white/dark | 1px solid border | sm shadow |
| `glass` | `<Card variant="glass">` | Translucent glass | Glass border | Layered glass shadow |

### 8.2 Button

| Variant | Class | Color | Usage |
|---------|-------|-------|-------|
| `default` | `<Button>` | Coral bg, white text | Standard primary action |
| `accent` | `<Button variant="accent">` | Orange bg, white text, glow | CTA on dark surfaces |
| `gradient` | `<Button variant="gradient">` | Coral-to-orange gradient | Premium/generate actions |
| `glass` | `<Button variant="glass">` | Translucent glass | Secondary on glass cards |
| `outline` | `<Button variant="outline">` | Transparent, border | Tertiary actions |
| `ghost` | `<Button variant="ghost">` | Transparent | Icon buttons, nav items |

**Sizes**: `xs` (24px), `sm` (32px), `default` (36px), `lg` (40px), `xl` (48px), `icon` variants.

### 8.3 Badge

| Variant | Color | Usage |
|---------|-------|-------|
| `paid` | Mint bg/text | Paid invoices, completed status |
| `pending` | Orange bg/text | Pending payments, in-progress |
| `overdue` | Coral bg/text | Overdue, attention needed |
| `platform` | Lavender bg/text | Platform tags |
| `glass` | Translucent | Tags on glass surfaces |

---

## 9. Dashboard Layout System

### 9.1 Components

| Component | Purpose |
|-----------|---------|
| `<DashboardShell>` | Outer wrapper with gradient background |
| `<DashboardHeading>` | Page title with serif font |
| `<DashboardStatsRow>` | 4-column KPI stat cards (2x2 on mobile) |
| `<StatCard>` | Individual KPI metric with label, value, trend |
| `<DashboardGrid>` | 2-column bento grid (1-col on mobile) |

### 9.2 Layout Pattern

```tsx
<DashboardShell>
  <DashboardHeading>Dashboard</DashboardHeading>
  <DashboardStatsRow>
    <StatCard label="Revenue" value="$8,373" trend="+12%" trendDirection="up" />
    <StatCard label="Pending" value="$1,790" />
    <StatCard label="Deals" value="7" />
    <StatCard label="Overdue" value="$425" trendDirection="down" />
  </DashboardStatsRow>
  <DashboardGrid>
    <Card variant="glass">Content Calendar</Card>
    <Card variant="glass">Contract Generator</Card>
    <Card variant="glass">Invoice Tracking</Card>
    <Card variant="glass">Campaign Analytics</Card>
  </DashboardGrid>
</DashboardShell>
```

### 9.3 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, 2x2 stats |
| Tablet | 768px+ | 2-column grid, 4-col stats |
| Desktop | 1280px+ | 2-column grid, wider padding |

---

## 10. Accessibility Checklist

| Requirement | Implementation |
|-------------|---------------|
| Color contrast | All text meets WCAG AA (4.5:1 body, 3:1 large text) |
| Touch targets | Minimum 44x44px on all interactive elements |
| Focus indicators | Ring-based focus with 3px ring and 50% opacity |
| Screen reader | Semantic HTML, ARIA labels on icon-only buttons |
| Reduced motion | Glass effects use `prefers-reduced-motion` gracefully (blur is static, no animations) |
| Keyboard nav | All interactive elements reachable via Tab, activated via Enter/Space |
| Dark/light | Both themes maintain contrast requirements |

---

## 11. File Reference

| File | Contents |
|------|----------|
| `src/app/globals.css` | All design tokens, theme definitions, utility classes |
| `src/components/ui/card.tsx` | Card component with glass variant |
| `src/components/ui/button.tsx` | Button with accent, gradient, glass variants |
| `src/components/ui/badge.tsx` | Badge with paid, pending, overdue, platform variants |
| `src/components/dashboard/dashboard-grid.tsx` | Dashboard layout primitives |
| `src/components/layout/sidebar.tsx` | Glassmorphism sidebar |
| `src/components/layout/header.tsx` | Glassmorphism header |
| `src/components/layout/mobile-nav.tsx` | Glassmorphism mobile bottom nav |

---

*Document version: 1.0 | Created: 02.03.2026*
