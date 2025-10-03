import { createTheme, rem } from "@mantine/core";

// sbi-tokens.ts
export const sbiColors = {
  // Core
  sbiBlue: "#00B5EF", // bright cyan/sky
  sbiNavy: "#2A2075", // deep navy
  sbiYellow: "#FFC400", // accent

  // Neutrals
  gray0: "#ffffff",
  gray1: "#f7f7f8",
  gray2: "#eff0f2",
  gray3: "#dfe2e6",
  gray4: "#c8cdd5",
  gray5: "#aab2be",
  gray6: "#8b94a3",
  gray7: "#6a7384",
  gray8: "#4b5567",
  gray9: "#2d3442",
};

export const sbiSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
};

export const sbiRadius = { xs: 2, sm: 4, md: 6, lg: 8, xl: 12 };

export const sbiShadow = {
  sm: "0 1px 2px rgba(0,0,0,0.05)",
  md: "0 4px 12px rgba(0,0,0,0.08)",
  lg: "0 10px 24px rgba(0,0,0,0.10)",
};

export const sbiFonts = {
  // System UI stack (safe across platforms)
  body: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

const brand = [
  "#e3f8ff",
  "#b9ecff",
  "#8ddfff",
  "#61d2ff",
  "#35c5ff",
  "#0fb8ff",
  "#00B5EF",
  "#009acb",
  "#007fa7",
  "#006583",
]; // tints/shades for sbiBlue

const navy = [
  "#ecebfb",
  "#cbc7f4",
  "#aaa4ee",
  "#8a80e8",
  "#695ce1",
  "#4838db",
  "#2A2075",
  "#231a61",
  "#1b154e",
  "#140f3b",
]; // tints/shades for sbiNavy

const accent = [
  "#fff8e1",
  "#ffecb3",
  "#ffe082",
  "#ffd54f",
  "#ffca28",
  "#ffc107",
  "#FFC400",
  "#e0ab00",
  "#c09200",
  "#a17900",
];

export const theme = createTheme({
  fontFamily: sbiFonts.body,
  fontFamilyMonospace: sbiFonts.mono,
  headings: { fontFamily: sbiFonts.body, fontWeight: "700" },

  primaryColor: "sbiBlue",
  colors: {
    // @ts-ignore
    sbiBlue: brand,
    // @ts-ignore
    sbiNavy: navy,
    // @ts-ignore
    sbiAccent: accent,
    gray: [
      sbiColors.gray0,
      sbiColors.gray1,
      sbiColors.gray2,
      sbiColors.gray3,
      sbiColors.gray4,
      sbiColors.gray5,
      sbiColors.gray6,
      sbiColors.gray7,
      sbiColors.gray8,
      sbiColors.gray9,
    ],
  },

  spacing: {
    xs: rem(sbiSpacing.xs),
    sm: rem(sbiSpacing.sm),
    md: rem(sbiSpacing.md),
    lg: rem(sbiSpacing.lg),
    xl: rem(sbiSpacing.xl),
    "2xl": rem(sbiSpacing["2xl"]),
    "3xl": rem(sbiSpacing["3xl"]),
  },

  radius: {
    xs: rem(sbiRadius.xs),
    sm: rem(sbiRadius.sm),
    md: rem(sbiRadius.md),
    lg: rem(sbiRadius.lg),
    xl: rem(sbiRadius.xl),
  },

  shadows: {
    xs: sbiShadow.sm,
    sm: sbiShadow.sm,
    md: sbiShadow.md,
    lg: sbiShadow.lg,
  },

  // Component accents
  components: {
    Button: {
      defaultProps: { radius: "md", size: "md" },
      styles: (theme: any) => ({
        root: {
          fontWeight: 600,
          boxShadow: theme.shadows.md,
          "&:focus-visible": { outlineOffset: 2 },
        },
      }),
    },
    Card: {
      defaultProps: { radius: "lg", padding: "lg" },
      styles: (theme: any) => ({
        root: {
          boxShadow: theme.shadows.md,
          border: `1px solid ${theme.colors.gray[3]}`,
        },
      }),
    },
    Badge: {
      defaultProps: { radius: "sm", variant: "light", color: "sbiNavy" },
    },
    Input: {
      defaultProps: { radius: "md", size: "md" },
    },
  },
});
