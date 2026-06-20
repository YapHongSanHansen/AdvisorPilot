# Design Tokens — Task A06

Product name: **Project Atlas**. Two-color palette: **Slate + Emerald**.

## Core palette

| Token | Hex | Use |
|---|---|---|
| `--color-slate` | `#334155` | Primary text, headers, sidebar / surfaces |
| `--color-emerald` | `#10B981` | Accent, availability, positive fit, primary CTAs |

## Supporting neutrals & status (suggested)

| Token | Hex | Use |
|---|---|---|
| `--color-bg` | `#F8FAFC` | App background |
| `--color-surface` | `#FFFFFF` | Cards / panels |
| `--color-border` | `#E2E8F0` | Dividers |
| `--color-danger` | `#EF4444` | Overload / burnout risk |
| `--color-warn` | `#F59E0B` | Near-capacity warning |

## CSS variables (paste into the UI)

```css
:root {
  --color-slate: #334155;
  --color-emerald: #10B981;
  --color-bg: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-border: #E2E8F0;
  --color-danger: #EF4444;
  --color-warn: #F59E0B;
}
```
