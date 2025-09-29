import { createConfig } from "webpack-react-config";
import webpack from "webpack";
import ExternalTemplateRemotesPlugin from "external-remotes-plugin";

const { ModuleFederationPlugin } = webpack.container;

const webpackConfig = createConfig(webpack, {
  uniqueName: "host",
  port: 3000,
  moduleFederation: {
    remotes: {
      app2: "app2@[app2Url]/remoteEntry.js",
      config: "config@[configUrl]/remoteEntry.js",
    },
    shared: {react: {singleton: true}, "react-dom": {singleton: true}},
  }
});

export default webpackConfig;
