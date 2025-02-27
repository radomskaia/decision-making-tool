/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    env: {
      browser: true,
      es2022: true
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended-type-checked',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:perfectionist/recommended-natural',
      'plugin:unicorn',
      'prettier'
    ],
    overrides: [
      {
        files: ['*.js'],
        extends: ['plugin:@typescript-eslint/disable-type-checked']
      }
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: ['**/tsconfig.json']
    },
    plugins: ['import', '@typescript-eslint', 'unicorn'],
    rules: {
      'unicorn/better-regex': 'error',
      curly: ['error', 'all'],
      'max-lines-per-function': [
        'error',
        { max: 40, skipBlankLines: true, skipComments: true }
      ],
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            arguments: false
          }
        }
      ],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'off'
          }
        }
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' }
      ],
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-imports': 'error'
    },
    reportUnusedDisableDirectives: true,
    noInlineConfig: true,
    settings: {
      'import/resolver': {
        typescript: true
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts']
      }
    }
  }
];
