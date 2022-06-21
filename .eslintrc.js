module.exports = {
  overrides: [
    {
      files: [
        '**/*.js',
      ],
      extends: [
        'airbnb-base',
      ],
    },
    {
      files: [
        '**/*.ts',
      ],
      extends: [
        'airbnb-base',
        'airbnb-typescript/base',
      ],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
};
