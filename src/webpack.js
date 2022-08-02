import SassPlugin from "@pawjs/sass/webpack";
import LessPlugin from "@pawjs/less/webpack";
import SrcsetPlugin from "@pawjs/srcset/webpack";
import ImageOptimizer from "@pawjs/image-optimizer/webpack";
import ResolverPlugin from "./webpack-resolver";

export default class ProjectWebpack {
  constructor({ addPlugin }) {
    // Add sass compiler to the project
    addPlugin(new SassPlugin());
    addPlugin(
      new LessPlugin({
        javascriptEnabled: true,
        modifyVars: {
          "@primary-color": "#000",
          "@layout-header-height": "51px",
          "@layout-header-padding ": "0px 0px",
          "@layout-header-background ": "#f8f8f8",
          "@layout-body-background": "#ffffff",
          "@layout-footer-padding ": "0px",
          "@border-radius-base": "2px",
          "@collapse-content-bg": "#ffffff"
        }
      })
    );
    const optimizerOptions = {
      supportedEnv: ["production"],
      configLabel: "MEDIUM_QUALITY"
    };

    addPlugin(new ImageOptimizer(optimizerOptions));

    addPlugin(new SrcsetPlugin());
    addPlugin(new ResolverPlugin());
  }
}
