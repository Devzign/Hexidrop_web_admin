export const colors = {
  brand: {
    primary: "oklch(0.68 0.14 155)", // HexiDrop signature green #2BAA66
    primaryDark: "oklch(0.53 0.12 155)", // Deep operations green #1F8B5B
    primaryGlow: "oklch(0.85 0.14 90)", // Warm gold-green glow
    gold: "oklch(0.80 0.145 84)", // HexiDrop warm gold #F2C94C
    navy: "oklch(0.28 0.06 155)", // Deep forest green-navy
    warmTint: "oklch(0.97 0.03 95)", // Subtle gold/warm tint
  },
  semantics: {
    success: "oklch(0.70 0.17 152)",
    warning: "oklch(0.82 0.15 85)",
    destructive: "oklch(0.63 0.22 25)",
    info: "oklch(0.72 0.12 240)",
  },
  charts: {
    1: "oklch(0.53 0.12 155)",
    2: "oklch(0.80 0.145 84)",
    3: "oklch(0.38 0.10 157)",
    4: "oklch(0.70 0.15 66)",
    5: "oklch(0.65 0.09 200)",
  },
  ui: {
    background: "oklch(0.99 0.008 145)",
    foreground: "oklch(0.22 0.03 260)",
    card: "oklch(1 0 0)",
    cardForeground: "oklch(0.22 0.03 260)",
    muted: "oklch(0.965 0.012 150)",
    mutedForeground: "oklch(0.55 0.02 260)",
    border: "oklch(0.925 0.008 150)",
    input: "oklch(0.94 0.008 150)",
  },
  sidebar: {
    background: "oklch(0.995 0.004 150)",
    foreground: "oklch(0.28 0.04 260)",
    primary: "oklch(0.53 0.12 155)",
    accent: "oklch(0.96 0.02 150)",
    border: "oklch(0.93 0.008 150)",
  },
} as const;

export type ThemeColors = typeof colors;
