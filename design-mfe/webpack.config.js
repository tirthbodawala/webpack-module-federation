import { createConfig } from "mfe-build-tools/webpack";
import webpack from "webpack";

export default createConfig(webpack, {
  uniqueName: 'design',
  entry: './src/index.tsx',
  htmlTemplate: './public/index.html',
  port: 4001,
  moduleFederation: {
    name: 'design',
    filename: 'remoteEntry.js',
    exposes: {
      "./Header": "./src/components/header/index.tsx",
      "./Hero": "./src/components/hero/index.tsx",
      "./Demo": "./src/components/demo/index.tsx",
      "./provider": "./src/provider",
      "./theme": "./src/theme",
    },
    shared: {
      react: { singleton: true },
      "react-dom": { singleton: true },
      "@mantine/core": { singleton: true },
      "@mantine/hooks": { singleton: true },
      "@tabler/icons-react": { singleton: true },
      "@tanstack/react-router": { singleton: true },
    },
  },
});
