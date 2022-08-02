import path from "path";
import webpack from "webpack";

export default class ResolverWebpack {
  // eslint-disable-next-line
  apply(webpackHandler) {
    // console.log(webpackHandler.hooks);
    webpackHandler.hooks.beforeConfig.tap("AddRules", (env, type, config) => {
      const conf = config;

      conf.forEach(c => {
        if (c.module && c.module.plugins) {
          c.module.plugins = [
            ...c.module.plugins,
            new webpack.ProvidePlugin({
              $: "jquery",
              jQuery: "jquery",
              "window.jQuery": "jquery"
            })
          ];
        }
        if (c.module && c.module.rules) {
          c.module.rules = [
            ...c.module.rules,
            {
              test: /\.mjs$/,
              include: /node_modules/,
              type: "javascript/auto"
            }
          ];
        }
      });
    });

    webpackHandler.hooks.beforeConfig.tap(
      "ResolvePath",
      (env, type, config) => {
        try {
          let conf = config;

          if (!Array.isArray(config)) {
            conf = [config];
          }
          conf.forEach(c => {
            if (c.resolve && c.resolve.alias) {
              // eslint-disable-next-line no-param-reassign
              c.resolve.alias = {
                ...c.resolve.alias,
                "@components": path.resolve(__dirname, "./app/components/"),
                "@templates": path.resolve(__dirname, "./app/templates/"),
                "@layouts": path.resolve(__dirname, "./app/layouts/"),
                "@queries": path.resolve(__dirname, "./app/queries/"),
                "@modules": path.resolve(__dirname, "./modules/"),
                "@apolloClient": path.resolve(__dirname, "./apollo.js"),
                "@icons": path.resolve(__dirname, "./resources/icons/index.js"),
                "@images": path.resolve(__dirname, "./resources/images"),
                "@styles": path.resolve(__dirname, "./resources/css"),
                "@utils": path.resolve(__dirname, "./utils.js"),
                "@config": path.resolve(__dirname, "./config.js"),
                "@services": path.resolve(__dirname, "./services.js"),
                "@redux": path.resolve(__dirname, "./redux/"),
                "@ads": path.resolve(__dirname, "./ads.js"),
                "@adsConfig": path.resolve(__dirname, "./adsConfig.js")
              };
            }
          });
        } catch (ex) {
          // eslint-disable-next-line
          console.log(ex);
        }
      }
    );
  }
}
