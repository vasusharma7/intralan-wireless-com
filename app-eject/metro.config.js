const blacklist = require("metro-config/src/defaults/blacklist");
module.exports = {
  transformer: {
    assetPlugins: ["expo-asset/tools/hashAssetFiles"],
  },
  resolver: {
    /* resolver options */
    sourceExts: ["jsx", "js"], //add here
  },
  resolver: {
    blacklistRE: blacklist([
      /\/nodejs-assets\/.*/,
      /\/android\/.*/,
      /\/ios\/.*/,
    ]),
  },
};
