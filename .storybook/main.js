module.exports = {
  stories: [],
  addons: ['@chakra-ui/storybook-addon', '@storybook/addon-essentials'],
  features: {
    emotionAlias: false,
  },
  // uncomment the property below if you want to apply some webpack config globally
  // webpackFinal: async (config, { configType }) => {
  //   // Make whatever fine-grained changes you need that should apply to all storybook configs

  //   // Return the altered config
  //   return config;
  // },
};
