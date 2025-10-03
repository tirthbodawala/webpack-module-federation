import { createRequire } from 'node:module';
import process from 'node:process';
const require = createRequire(import.meta.url);

const mantinePresetPath = require.resolve('postcss-preset-mantine', {
  paths: [
    process.cwd(),
  ],
});

const mantineSimpleVars = require.resolve('postcss-simple-vars', {
  paths: [
    process.cwd(),
  ]
});

const postCSSConfig = {
  plugins: {
    [mantinePresetPath]: {},
    [mantineSimpleVars]: {
      variables: {
        "mantine-breakpoint-xs": "36em",
        "mantine-breakpoint-sm": "48em",
        "mantine-breakpoint-md": "62em",
        "mantine-breakpoint-lg": "75em",
        "mantine-breakpoint-xl": "88em",
      },
    },
  },
};
export default postCSSConfig;
