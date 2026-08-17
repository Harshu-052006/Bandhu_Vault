# Clean SaaS Design System (Phase 1)

## Overview
This document outlines the "Clean SaaS" design language for the Free Team Vault application. The aesthetic prioritizes minimal design, ample whitespace, soft shadows, and a light-mode first approach, giving users a highly premium and focused experience.

## 1. Typography
We use **Inter** for all UI elements to ensure legibility and a modern, technical feel.

- **Headings (h1, h2, h3):** Inter, Font Weight 600 or 700. High contrast (nearly black).
- **Body Text:** Inter, Font Weight 400. Slightly muted color for readability.
- **Micro-copy/Labels:** Inter, Font Weight 500, small size, muted color.

## 2. Color Palette

### Base
- **Background (`--background`):** `#FAFAFA` (Off-white, softer on the eyes than pure white).
- **Surface (`--surface`):** `#FFFFFF` (Pure white for cards and modals to stand out against background).
- **Foreground (`--foreground`):** `#09090B` (Very dark gray, not pure black).
- **Muted (`--muted`):** `#F4F4F5`
- **Muted Foreground (`--muted-foreground`):** `#71717A`

### Primary Accent
- **Primary (`--primary`):** `#18181B` (Nearly black, sleek for primary actions).
- **Primary Foreground (`--primary-foreground`):** `#FAFAFA`

### Borders and Lines
- **Border (`--border`):** `#E4E4E7` (Subtle gray for dividing content).
- **Ring (`--ring`):** `#18181B` (Focus ring color).

## 3. Shadows (Elevation)
Soft, diffused shadows are key to the "Clean SaaS" look, lifting interactive elements off the page without being harsh.

- **sm:** `0 1px 2px 0 rgb(0 0 0 / 0.05)` (Subtle lift for small elements like inputs).
- **md:** `0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)` (Standard card elevation).
- **lg:** `0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)` (Hover states or modals).

## 4. Spacing and Radii
- **Border Radius (`--radius`):** `0.5rem` (8px) - Slightly rounded but still sharp and professional.
- **Padding/Margin:** Generous whitespace. Components should breathe.

## 5. Micro-Animations & Interactions
- **Hover on Buttons:** Slight lift (`translate-y-[-1px]`) and enhanced shadow (`shadow-md`), transitioning over `200ms` with `ease-out`.
- **Active State:** Scale down slightly (`scale-95`).
- **Focus:** Sharp ring offset (`ring-2 ring-offset-2 ring-zinc-900`).
