module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint/eslint-plugin'],
    parserOptions: {
        project: 'tsconfig.json',
        sourceType: 'module',
    },
    extends: [
        'plugin:@typescript-eslint/recommended',
    ],
    env: {
        node: true,
    },
    rules: {
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': [
            'error',
            {
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_',
                'caughtErrorsIgnorePattern': '^_'
            }
        ],
        '@typescript-eslint/semi': ['error', 'never'],
        '@typescript-eslint/no-var-requires': 'off',
    },
}
