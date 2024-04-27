module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Required for expo-router
      'expo-router/babel',
      
      ["transform-inline-environment-variables", {
        "include": [
          "REACT_APP_PRIVATE_IP"
        ]
      }],
      'react-native-reanimated/plugin'
    ],
  };
};
