import webpack from "webpack";
import { createConfig } from "webpack-react-config";

const webpackConfig = createConfig(webpack, {
  uniqueName: 'design',
  port: 4001,
  moduleFederation: {
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

export default webpackConfig;
