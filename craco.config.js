module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Find the Babel loader rule
      const oneOfRule = webpackConfig.module.rules.find((rule) => Array.isArray(rule.oneOf));
      if (oneOfRule) {
        oneOfRule.oneOf.forEach((rule) => {
          if (rule.loader && rule.loader.includes('babel-loader')) {
            // Include yjs for Babel transpilation
            if (!rule.include) rule.include = [];
            if (typeof rule.include === 'string') rule.include = [rule.include];
            rule.include.push(/node_modules[\\/]yjs/);
          }
        });
      }
      return webpackConfig;
    },
  },
};
