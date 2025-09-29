import { createTheme, rem } from "@mantine/core";

// hdfc-tokens.ts
export const hdfcColors = {
  hdfcBlue: "#004C8F", // core blue
  hdfcRed: "#ED232A", // core red
  // neutrals tuned for UI
  gray0: "#ffffff",
  gray1: "#f6f7f9",
  gray2: "#eceff3",
  gray3: "#d9dee6",
  gray4: "#c3cbd6",
  gray5: "#a6b0be",
  gray6: "#8793a6",
  gray7: "#6a768a",
  gray8: "#495368",
  gray9: "#2c3342",
};

export const hdfcSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
};
export const hdfcRadius = { xs: 2, sm: 4, md: 6, lg: 8, xl: 12 };
export const hdfcShadow = {
  sm: "0 1px 2px rgba(0,0,0,.05)",
  md: "0 4px 12px rgba(0,0,0,.08)",
  lg: "0 10px 24px rgba(0,0,0,.10)",
};

export const hdfcFonts = {
  body: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Liberation Sans", sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

const blue = [
  "#e6f0f9",
  "#c8def1",
  "#a7c9e8",
  "#86b3df",
  "#669dd6",
  "#4e88cb",
  "#004C8F",
  "#003e76",
  "#00315e",
  "#002646",
];

const red = [
  "#ffe9ea",
  "#ffc9cc",
  "#ffa5a8",
  "#ff8084",
  "#ff5a60",
  "#ff3a44",
  "#ED232A",
  "#c61d22",
  "#a0171b",
  "#7a1215",
];

export const theme = createTheme({
  fontFamily: hdfcFonts.body,
  fontFamilyMonospace: hdfcFonts.mono,
  headings: { fontFamily: hdfcFonts.body, fontWeight: "700" },

  primaryColor: "hdfcBlue",
  colors: {
    // @ts-ignore
    hdfcBlue: blue,
    // @ts-ignore
    hdfcRed: red,
    gray: [
      hdfcColors.gray0,
      hdfcColors.gray1,
      hdfcColors.gray2,
      hdfcColors.gray3,
      hdfcColors.gray4,
      hdfcColors.gray5,
      hdfcColors.gray6,
      hdfcColors.gray7,
      hdfcColors.gray8,
      hdfcColors.gray9,
    ],
  },

  spacing: {
    xs: rem(hdfcSpacing.xs),
    sm: rem(hdfcSpacing.sm),
    md: rem(hdfcSpacing.md),
    lg: rem(hdfcSpacing.lg),
    xl: rem(hdfcSpacing.xl),
    "2xl": rem(hdfcSpacing["2xl"]),
    "3xl": rem(hdfcSpacing["3xl"]),
  },

  radius: {
    xs: rem(hdfcRadius.xs),
    sm: rem(hdfcRadius.sm),
    md: rem(hdfcRadius.md),
    lg: rem(hdfcRadius.lg),
    xl: rem(hdfcRadius.xl),
  },

  shadows: {
    xs: hdfcShadow.sm,
    sm: hdfcShadow.sm,
    md: hdfcShadow.md,
    lg: hdfcShadow.lg,
  },

  components: {
    Button: {
      defaultProps: { radius: "md", size: "md", color: "hdfcBlue" },
      styles: (theme: any) => ({
        root: { fontWeight: 600, boxShadow: theme.shadows.md },
      }),
    },
    Badge: {
      defaultProps: { radius: "sm", variant: "light", color: "hdfcRed" },
    },
    Card: {
      defaultProps: { radius: "lg", padding: "lg" },
      styles: (t: any) => ({
        root: {
          boxShadow: t.shadows.md,
          border: `1px solid ${t.colors.gray[3]}`,
        },
      }),
    },
    Input: { defaultProps: { radius: "md", size: "md" } },
    Tabs: { defaultProps: { color: "hdfcRed" } },
    Anchor: { defaultProps: { c: "hdfcBlue.6", fw: 600 } },
  },
});
