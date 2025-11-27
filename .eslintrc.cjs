module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules'],
  overrides: [
    {
      files: ['**/*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: { parser: '@typescript-eslint/parser' },
      extends: ['plugin:astro/recommended'],
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint', 'react', 'react-hooks'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
      ],
      settings: { react: { version: 'detect' } },
      rules: {
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'no-case-declarations': 'off',
      },
    },
    {
      files: ['tests/**/*.ts'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
}
