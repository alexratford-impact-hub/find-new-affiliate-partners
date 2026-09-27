---
version: "designmd-maker-2026-09-25"
name: "impact.com - The All-in-One Partnership Management Platform"
description: "Design system extracted from https://impact.com on 2026-09-25 (code-based analysis)."
logo:
  src: "https:\/\/impact.com\/wp-content\/uploads\/2025\/08\/Main-logo-scroller1.webp"
  srcAlt: "https:\/\/impact.com\/wp-content\/uploads\/2025\/08\/Main-logo-scroller2-1.webp"
colors:
  primary: "#F5333F"
  accent: "#298DDA"
  background: "#FFFFFF"
  surface: "#EAEBED"
  text-primary: "#000000"
  secondary: "#000000"
  text-secondary: "#667082"
  border: "#969EA7"
  on-primary: "#FFFFFF"
  on-secondary: "#FFFFFF"
  on-accent: "#FFFFFF"
  surface-container-lowest: "#FFFFFF"
  surface-container-low: "#F7F7F7"
  surface-container: "#F2F3F4"
  surface-container-high: "#F2F2F2"
  surface-container-highest: "#EAEBED"
typography:
  fontFamily: "Font Awesome\\ 6 Pro"
  display:
    fontSize: "70px"
    fontWeight: "200"
  headline-lg:
    fontSize: "42px"
    fontWeight: "200"
  headline-md:
    fontSize: "30px"
    fontWeight: "200"
  title-lg:
    fontSize: "22.4px"
    fontWeight: "200"
  body-lg:
    fontSize: "18px"
    fontWeight: "200"
  body-md:
    fontSize: "16px"
    fontWeight: "200"
  label-md:
    fontSize: "14px"
    fontWeight: "200"
    letterSpacing: ".097px"
  label-sm:
    fontSize: "12px"
    fontWeight: "200"
    letterSpacing: ".097px"
  weights: [200, 300, 400, 500, 600, 700, 800, 900]
spacing:
  xs: "2px"
  sm: "8px"
  md: "16px"
  lg: "40px"
  xl: "60px"
rounded:
  sm: "1px"
  md: "8px"
  lg: "26px"
  pill: "50%"
elevation:
  sm: "0 1px 5px 0 rgba(0,0,0,.25)"
  md: "0 0 4px rgba(0,0,0,.15)"
  lg: ".5px 1.5px 20px 1px rgba(0,0,0,.1)"
layout:
  containerMaxWidth: "770px"
components:
  card:
    background: "{colors.surface}"
    border: "1px solid {colors.border}"
    radius: "26px"
    boxShadow: "{elevation.md}"
  button-primary:
    background: "{colors.primary}"
    radius: "50%"
---

# Design Specification — impact.com - The All-in-One Partnership Management Platform

| Field | Value |
|---|---|
| Site / Project | https://impact.com |
| Analyzed on | 2026-09-25 |
| Analysis mode | Automated code extraction (no AI) |

## Overview

This design system was extracted programmatically from the source page. It is built on a light canvas (#FFFFFF), ink text (#000000), a vivid accent (#298DDA). All type is set in `Font Awesome\ 6 Pro`. Detected font weights: 200, 300, 400, 500, 600, 700, 800, 900. Detected style signatures: gradient-rich / aurora; rounded / pill-heavy; dark-mode aware.

Logo asset(s): `https://impact.com/wp-content/uploads/2025/08/Main-logo-scroller1.webp` · `https://impact.com/wp-content/uploads/2025/08/Main-logo-scroller2-1.webp`

## Color System

### Detected palette (by frequency)

| Hex | RGB | HSL | Count |
|---|---|---|---|
| `#FFFFFF` | 255, 255, 255 | 0° 0% 100% | 94 |
| `#000000` | 0, 0, 0 | 0° 0% 0% | 76 |
| `#F5333F` | 245, 51, 63 | 356° 91% 58% | 38 |
| `#EAEBED` | 234, 235, 237 | 220° 8% 92% | 16 |
| `#667082` | 102, 112, 130 | 219° 12% 45% | 14 |
| `#298DDA` | 41, 141, 218 | 206° 71% 51% | 12 |
| `#FCCC38` | 252, 204, 56 | 45° 97% 60% | 12 |
| `#D73184` | 215, 49, 132 | 330° 67% 52% | 7 |
| `#E60188` | 230, 1, 136 | 325° 99% 45% | 6 |
| `#F77300` | 247, 115, 0 | 28° 100% 48% | 6 |
| `#969EA7` | 150, 158, 167 | 212° 9% 62% | 4 |
| `#F2F3F4` | 242, 243, 244 | 210° 8% 95% | 4 |
| `#2EA3F2` | 46, 163, 242 | 204° 88% 56% | 3 |
| `#D1D7DC` | 209, 215, 220 | 207° 14% 84% | 3 |
| `#2CAFFE` | 44, 175, 254 | 203° 99% 58% | 2 |
| `#00E272` | 0, 226, 114 | 150° 100% 44% | 2 |
| `#DDDDDD` | 221, 221, 221 | 0° 0% 87% | 1 |
| `#8D8D8D` | 141, 141, 141 | 0° 0% 55% | 1 |
| `#544FC5` | 84, 79, 197 | 243° 50% 54% | 1 |
| `#FE6A35` | 254, 106, 53 | 16° 99% 60% | 1 |

### Assigned roles

Roles are taken from the page's own semantic CSS custom properties when present, otherwise inferred from usage frequency + luminance/saturation.

| Token | Hex | RGB | HSL |
|---|---|---|---|
| `--color-primary` | `#F5333F` | 245, 51, 63 | 356° 91% 58% |
| `--color-accent` | `#298DDA` | 41, 141, 218 | 206° 71% 51% |
| `--color-background` | `#FFFFFF` | 255, 255, 255 | 0° 0% 100% |
| `--color-surface` | `#EAEBED` | 234, 235, 237 | 220° 8% 92% |
| `--color-text-primary` | `#000000` | 0, 0, 0 | 0° 0% 0% |
| `--color-secondary` | `#000000` | 0, 0, 0 | 0° 0% 0% |
| `--color-text-secondary` | `#667082` | 102, 112, 130 | 219° 12% 45% |
| `--color-border` | `#969EA7` | 150, 158, 167 | 212° 9% 62% |
| `--color-on-primary` | `#FFFFFF` | 255, 255, 255 | 0° 0% 100% |
| `--color-on-secondary` | `#FFFFFF` | 255, 255, 255 | 0° 0% 100% |
| `--color-on-accent` | `#FFFFFF` | 255, 255, 255 | 0° 0% 100% |

### Surface ramp (derived from detected light neutrals)

| Token | Hex |
|---|---|
| `--color-surface-container-lowest` | `#FFFFFF` |
| `--color-surface-container-low` | `#F7F7F7` |
| `--color-surface-container` | `#F2F3F4` |
| `--color-surface-container-high` | `#F2F2F2` |
| `--color-surface-container-highest` | `#EAEBED` |

## Gradients

- `linear-gradient(90deg, #298dda, #d73184, #f5333f, #fccc38)`
- `linear-gradient(269.98deg,#fccc38 -23.32%,#f5333f 75.34%)`
- `linear-gradient(91.89deg,#e60188 -13.87%,#298dda 100.42%)`
- `linear-gradient(90deg,#298dda,#d73184,#f5333f,#fccc38)`
- `linear-gradient(90deg,#f5333f,#f77300,#fccc38)`
- `linear-gradient(#fff,#fff),linear-gradient(180deg,#f77300 6%,#f5333f 80%)`
- `linear-gradient(90deg,hsla(0,0%,100%,0),#fff)`

## Typography

Primary typeface: **Font Awesome\ 6 Pro** — stack: `Font Awesome\ 6 Pro`

### Font stacks (most used first)

- `Font Awesome\ 6 Pro`
- `Sarabun,Helvetica,Arial,sans-serif`
- `Sarabun`
- `"Font Awesome 6 Brands"`
- `"Font Awesome 6 Pro"`
- `inherit`
- `var(--fa-style-family, "Font Awesome 6 Pro")`
- `Sarabun,Helvetica,Arial,Lucida,sans-serif`

### Derived type scale

| Token | Size |
|---|---|
| display | 70px |
| headline-lg | 42px |
| headline-md | 30px |
| title-lg | 22.4px |
| body-lg | 18px |
| body-md | 16px |
| label-md | 14px |
| label-sm | 12px |

### Font sizes (by frequency)

| Size | Count |
|---|---|
| 18px | 17 |
| 16px | 16 |
| 24px | 11 |
| 26px | 10 |
| 14px | 8 |
| 12px | 8 |
| 32px | 7 |
| 20px | 7 |
| 22px | 7 |
| 13px | 6 |
| 10px | 5 |
| 36px | 5 |
| 55px | 4 |
| 30px | 4 |
| 42px | 1 |
| 70px | 1 |
| 60px | 1 |
| 1.4em | 1 |
| 8px | 1 |
| 48px | 1 |

Weights in use: 200, 300, 400, 500, 600, 700, 800, 900

### Line heights (by frequency)

| Value | Count |
|---|---|
| 34px | 10 |
| 31px | 8 |
| 26px | 8 |
| 42px | 7 |
| 18px | 7 |
| 28px | 6 |
| 30px | 6 |
| 27px | 5 |
| 24px | 5 |
| 46px | 4 |

### Letter spacing (by frequency)

| Value | Count |
|---|---|
| .097px | 4 |
| 0 | 1 |
| .7px | 1 |
| .5px | 1 |

## Spacing

### Derived spacing scale

| Token | Value |
|---|---|
| xs | 2px |
| sm | 8px |
| md | 16px |
| lg | 40px |
| xl | 60px |

### Raw values (by frequency)

| Value | Count |
|---|---|
| 20px | 20 |
| 10px | 20 |
| 30px | 12 |
| 100px | 8 |
| 40px | 6 |
| 1em | 4 |
| 8px | 4 |
| 2px | 4 |
| 9px | 4 |
| 12px | 3 |
| 15px | 3 |
| 50px | 3 |
| 60px | 2 |
| 45px | 2 |
| 7px | 2 |
| 5px | 2 |

## Borders & Radius

### Derived radius tokens

| Token | Value |
|---|---|
| sm | `1px` |
| md | `8px` |
| lg | `26px` |
| pill | `50%` |

### Raw values (resolved, by frequency)

| Radius | Count |
|---|---|
| `8px` | 8 |
| `100px` | 4 |
| `26px` | 3 |
| `4px` | 2 |
| `20px` | 2 |
| `0 50px 50px 0` | 2 |
| `50px 0 0 50px` | 2 |
| `3px` | 1 |
| `1px` | 1 |
| `2px` | 1 |
| `50%` | 1 |

## Shadows

### Derived elevation

| Token | Value |
|---|---|
| sm | `0 1px 5px 0 rgba(0,0,0,.25)` |
| md | `0 0 4px rgba(0,0,0,.15)` |
| lg | `.5px 1.5px 20px 1px rgba(0,0,0,.1)` |

### All detected shadows

- `0 1px 5px 0 rgba(0,0,0,.25)`
- `0 0 0 0 transparent`
- `.5px 1.2px 11px 1px rgba(0,0,0,.1)`
- `.5px 1.2px 9px 3px rgba(0,0,0,.12)`
- `0 0 25px 50px #fff`
- `0 1px 4px 0 #eaebed`
- `.5px 1.5px 20px 1px rgba(0,0,0,.1)`
- `0 0 6px rgba(0,0,0,.15)`
- `0 0 4px rgba(0,0,0,.15)`
- `initial`

## Layout

Container max-width: **770px**

### Breakpoints

- 660px
- 770px
- 920px
- 960px
- 990px
- 991px
- 992px
- 1250px

## Animation & Motion

### Transitions

- `color .3s,background-color .3s,border-color .3s`
- `color 0s,background-color 0s`
- `-webkit-transform .2s,-webkit-box-shadow .2s`
- `transform .2s,box-shadow .2s`
- `transform .2s,box-shadow .2s,-webkit-transform .2s,-webkit-box-shadow .2s`
- `.3s`
- `padding .3s`
- `-webkit-transform .3s`
- `transform .3s`
- `transform .3s,-webkit-transform .3s`
- `opacity .3s ease 0s,-webkit-transform 0s ease .3s`
- `opacity .3s ease 0s,transform 0s ease .3s`

### Easing curves

- `cubic-bezier(.215,.61,.355,1)`

### Keyframes

```css
@keyframes fa-beat { 0%,90%{-webkit-transform:scale(1);transform:scale(1)}45%{-webkit-transform:scale(var(--fa-beat-scale, 1.25));transform:scale(var(--fa-beat-scale, 1.25))} }
@keyframes fa-bounce { 0%{-webkit-transform:scale(1, 1) translateY(0);transform:scale(1, 1) translateY(0)}10%{-webkit-transform:scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0);transform:scale(var(--fa-bounce-start-scale-x, 1.1), var(--fa-bounce-start-scale-y, 0.9)) translateY(0)}30%{-webkit-transform:scale(var(--fa-bounce-jump-scale-x, 0.9), var(--fa-bounce-jump-scale-y, 1.1)) translateY(var(--fa-bounce-height, -0.5em));transform:scale(var(--fa-bounce-jump-scale-x, 0.9), v }
@keyframes fa-fade { 50%{opacity:var(--fa-fade-opacity, 0.4)} }
@keyframes fa-beat-fade { 0%,100%{opacity:var(--fa-beat-fade-opacity, 0.4);-webkit-transform:scale(1);transform:scale(1)}50%{opacity:1;-webkit-transform:scale(var(--fa-beat-fade-scale, 1.125));transform:scale(var(--fa-beat-fade-scale, 1.125))} }
@keyframes fa-flip { 50%{-webkit-transform:rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg));transform:rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -180deg))} }
@keyframes fa-shake { 0%{-webkit-transform:rotate(-15deg);transform:rotate(-15deg)}4%{-webkit-transform:rotate(15deg);transform:rotate(15deg)}8%,24%{-webkit-transform:rotate(-18deg);transform:rotate(-18deg)}12%,28%{-webkit-transform:rotate(18deg);transform:rotate(18deg)}16%{-webkit-transform:rotate(-22deg);transform:rotate(-22deg)}20%{-webkit-transform:rotate(22deg);transform:rotate(22deg)}32%{-webkit-transform:rotate(-12deg);transform:rotate(-12deg)}36%{-webkit-transform:rotate(12deg);transform:rotate(12deg)}40%,100 }
@keyframes fa-spin { 0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)} }
@keyframes animate-placeholder-a { 0%{-webkit-transform:translateX(0);transform:translateX(0)} }
@keyframes animate-placeholder-b { 0%{-webkit-transform:translateY(0);transform:translateY(0)} }
@keyframes gradientSmooth { 0%{background-position:0 0}50%{background-position:90% 0}to{background-position:0 0} }
@keyframes fade-in { to{opacity:1;scale:1} }
@keyframes auto-scroll { 0%{-webkit-transform:translateX(0);transform:translateX(0)}to{-webkit-transform:translateX(-50%);transform:translateX(-50%)} }
@keyframes bannermove { 0%{-webkit-transform:translateX(0);transform:translateX(0)}to{-webkit-transform:translateX(-25%);transform:translateX(-25%)} }
@keyframes img-slide { 0%,32.05%{-webkit-transform:translateX(0);transform:translateX(0)}33.33%,65.38%{-webkit-transform:translateX(-100%);transform:translateX(-100%)}66.67%,98.72%{-webkit-transform:translateX(-200%);transform:translateX(-200%)}to{-webkit-transform:translateX(-300%);transform:translateX(-300%)} }
@keyframes placeholderAnimation { 0%{background-position:0 50%}50%{background-position:100% 50%}to{background-position:0 50%} }
@keyframes soam-arrow-bounce { 0%{opacity:1;-webkit-transform:translateY(0);transform:translateY(0)}to{opacity:.5;-webkit-transform:translateY(-19px);transform:translateY(-19px)} }
@keyframes soam-top-arrow-scale { 0%{stroke-width:2px;-webkit-transform:scale(1) translate(0);transform:scale(1) translate(0)}to{stroke-width:4px;-webkit-transform:scale(.6) translateY(5px);transform:scale(.6) translateY(5px)} }
```

### Animations

- `gradientSmooth 40s 
ease infinite`
- `gradientSmooth 40s ease infinite`
- `gradientSmooth 30s ease infinite`
- `fade-in linear forwards`
- `bannermove linear infinite`
- `placeholderAnimation 3s linear infinite`

### CTA labels found on page

- Request a demo
- Get started now
- Explore the expanded platform
- Explore partnerships
- Affiliate for brands

## Source Design Tokens (CSS custom properties)

```css
:root {
  --fa-style-family-brands: "Font Awesome 6 Brands";
  --fa-font-brands: normal 400 1em/1 "Font Awesome 6 Brands";
  --fa-style-family-classic: "Font Awesome 6 Pro";
  --fa-font-light: normal 300 1em/1 "Font Awesome 6 Pro";
  --highcharts-color-0: #2caffe;
  --highcharts-color-1: #544fc5;
  --highcharts-color-2: #00e272;
  --highcharts-color-3: #fe6a35;
  --highcharts-color-4: #6b8abc;
  --highcharts-color-5: #d568fb;
  --highcharts-color-6: #2ee0ca;
  --highcharts-color-7: #fa4b42;
  --highcharts-color-8: #feb56a;
  --highcharts-color-9: #91e8e1;
  --highcharts-background-color: #fff;
  --highcharts-neutral-color-100: #000;
  --highcharts-neutral-color-80: #333;
  --highcharts-neutral-color-60: #666;
  --highcharts-neutral-color-40: #999;
  --highcharts-neutral-color-20: #ccc;
  --highcharts-neutral-color-10: #e6e6e6;
  --highcharts-neutral-color-5: #f2f2f2;
  --highcharts-neutral-color-3: #f7f7f7;
  --highcharts-highlight-color-100: #02f;
  --highcharts-highlight-color-80: #334eff;
  --highcharts-highlight-color-60: #667aff;
  --highcharts-highlight-color-20: #ccd3ff;
  --highcharts-highlight-color-10: #e6e9ff;
  --highcharts-positive-color: #06b535;
  --highcharts-negative-color: #f21313;
  --highcharts-annotation-color-0: rgba(130,170,255,.4);
  --highcharts-annotation-color-1: rgba(139,191,216,.4);
  --highcharts-annotation-color-2: rgba(150,216,192,.4);
  --highcharts-annotation-color-3: rgba(156,229,161,.4);
  --highcharts-annotation-color-4: rgba(162,241,130,.4);
  --highcharts-annotation-color-5: rgba(169,255,101,.4);
  --start-background: transparent;
  --start-webkit-text-fill-color: #fff;
}
```

## Do's and Don'ts

**Do**
- Do reserve the accent `#298DDA` for interactive highlights and key moments — it is used sparingly on the source page.
- Do keep the canvas at `#FFFFFF`; surfaces should stay within the detected neutral ramp.
- Do stick to the detected font weight(s): 200, 300, 400, 500, 600, 700, 800, 900.

**Don't**
- Don't introduce colors outside the detected palette — every hue above was found in the source.

## Design Tokens (copy-paste)

```css
:root {
  --color-primary: #F5333F;
  --color-accent: #298DDA;
  --color-background: #FFFFFF;
  --color-surface: #EAEBED;
  --color-text-primary: #000000;
  --color-secondary: #000000;
  --color-text-secondary: #667082;
  --color-border: #969EA7;
  --color-on-primary: #FFFFFF;
  --color-on-secondary: #FFFFFF;
  --color-on-accent: #FFFFFF;
  --color-surface-container-lowest: #FFFFFF;
  --color-surface-container-low: #F7F7F7;
  --color-surface-container: #F2F3F4;
  --color-surface-container-high: #F2F2F2;
  --color-surface-container-highest: #EAEBED;
  --font-sans: Font Awesome\ 6 Pro;
  --font-size-display: 70px;
  --font-size-headline-lg: 42px;
  --font-size-headline-md: 30px;
  --font-size-title-lg: 22.4px;
  --font-size-body-lg: 18px;
  --font-size-body-md: 16px;
  --font-size-label-md: 14px;
  --font-size-label-sm: 12px;
  --radius-sm: 1px;
  --radius-md: 8px;
  --radius-lg: 26px;
  --radius-pill: 50%;
  --shadow-sm: 0 1px 5px 0 rgba(0,0,0,.25);
  --shadow-md: 0 0 4px rgba(0,0,0,.15);
  --shadow-lg: .5px 1.5px 20px 1px rgba(0,0,0,.1);
  --space-xs: 2px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 40px;
  --space-xl: 60px;
  --tracking-label: .097px;
  --container-max: 770px;
}
```
