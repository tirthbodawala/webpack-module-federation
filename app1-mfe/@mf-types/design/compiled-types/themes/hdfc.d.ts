export declare const hdfcColors: {
    hdfcBlue: string;
    hdfcRed: string;
    gray0: string;
    gray1: string;
    gray2: string;
    gray3: string;
    gray4: string;
    gray5: string;
    gray6: string;
    gray7: string;
    gray8: string;
    gray9: string;
};
export declare const hdfcSpacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    "2xl": number;
    "3xl": number;
};
export declare const hdfcRadius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
};
export declare const hdfcShadow: {
    sm: string;
    md: string;
    lg: string;
};
export declare const hdfcFonts: {
    body: string;
    mono: string;
};
export declare const theme: {
    focusRing?: "auto" | "always" | "never" | undefined;
    scale?: number | undefined;
    fontSmoothing?: boolean | undefined;
    white?: string | undefined;
    black?: string | undefined;
    colors?: {
        [x: string & {}]: import("@mantine/core").MantineColorsTuple | undefined;
        dark?: import("@mantine/core").MantineColorsTuple | undefined;
        gray?: import("@mantine/core").MantineColorsTuple | undefined;
        red?: import("@mantine/core").MantineColorsTuple | undefined;
        pink?: import("@mantine/core").MantineColorsTuple | undefined;
        grape?: import("@mantine/core").MantineColorsTuple | undefined;
        violet?: import("@mantine/core").MantineColorsTuple | undefined;
        indigo?: import("@mantine/core").MantineColorsTuple | undefined;
        blue?: import("@mantine/core").MantineColorsTuple | undefined;
        cyan?: import("@mantine/core").MantineColorsTuple | undefined;
        green?: import("@mantine/core").MantineColorsTuple | undefined;
        lime?: import("@mantine/core").MantineColorsTuple | undefined;
        yellow?: import("@mantine/core").MantineColorsTuple | undefined;
        orange?: import("@mantine/core").MantineColorsTuple | undefined;
        teal?: import("@mantine/core").MantineColorsTuple | undefined;
    } | undefined;
    primaryShade?: import("@mantine/core").MantineColorShade | {
        light?: import("@mantine/core").MantineColorShade | undefined;
        dark?: import("@mantine/core").MantineColorShade | undefined;
    } | undefined;
    primaryColor?: string | undefined;
    variantColorResolver?: import("@mantine/core").VariantColorsResolver | undefined;
    autoContrast?: boolean | undefined;
    luminanceThreshold?: number | undefined;
    fontFamily?: string | undefined;
    fontFamilyMonospace?: string | undefined;
    headings?: {
        fontFamily?: string | undefined;
        fontWeight?: string | undefined;
        textWrap?: "wrap" | "nowrap" | "balance" | "pretty" | "stable" | undefined;
        sizes?: {
            h1?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
            h2?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
            h3?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
            h4?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
            h5?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
            h6?: {
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                lineHeight?: string | undefined;
            } | undefined;
        } | undefined;
    } | undefined;
    radius?: {
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    defaultRadius?: import("@mantine/core").MantineRadius | undefined;
    spacing?: {
        [x: number]: string | undefined;
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    fontSizes?: {
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    lineHeights?: {
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    breakpoints?: {
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    shadows?: {
        [x: string & {}]: string | undefined;
        xs?: string | undefined;
        sm?: string | undefined;
        md?: string | undefined;
        lg?: string | undefined;
        xl?: string | undefined;
    } | undefined;
    respectReducedMotion?: boolean | undefined;
    cursorType?: "default" | "pointer" | undefined;
    defaultGradient?: {
        from?: string | undefined;
        to?: string | undefined;
        deg?: number | undefined;
    } | undefined;
    activeClassName?: string | undefined;
    focusClassName?: string | undefined;
    components?: {
        [x: string]: {
            classNames?: any;
            styles?: any;
            vars?: any;
            defaultProps?: any;
        } | undefined;
    } | undefined;
    other?: {
        [x: string]: any;
    } | undefined;
};
