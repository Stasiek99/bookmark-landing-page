module.exports = (api) => {
  const isDevelopment = api.env('development');

  return {
    presets: [
      ['@babel/preset-env', { targets: 'defaults' }],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
          development: isDevelopment,
        },
      ],
      '@babel/preset-typescript',
    ],
  };
};
