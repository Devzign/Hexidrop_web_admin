import { colors } from "./colors";
import { typography } from "./typography";

export const theme = {
  colors,
  typography,
  radius: {
    public: "1rem", // 16px soft curve for public marketing
    admin: "0.75rem", // 12px crisp radius for dashboard tables & cards
  },
  shadows: {
    card: "0 8px 24px -14px oklch(0.35 0.1 155 / 0.18)",
    elegant: "0 24px 50px -20px oklch(0.35 0.12 155 / 0.28)",
    glow: "0 0 40px oklch(0.85 0.14 90 / 0.5)",
  },
} as const;

export type Theme = typeof theme;
