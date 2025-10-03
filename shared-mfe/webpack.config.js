import { createConfig } from "mfe-build-tools/webpack";
import webpack from "webpack";

export default createConfig(webpack, {
  uniqueName: 'shared',
  entry: './src/index.tsx',
  htmlTemplate: './public/index.html',
  port: 4002,
  moduleFederation: {
    name: 'shared',
    filename: 'remoteEntry.js',
    exposes: {
      "./Provider": "./src/Provider",
      "./Context": "./src/Context",
    },
    shared: {
      react: { singleton: true },
      "react-dom": { singleton: true },
    },
  },
});
