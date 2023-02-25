module.exports = {
    plugins: ['react', '@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        "plugin:postcss-modules/recommended"
    ],
    parser: '@typescript-eslint/parser',
    root: true,
    rules: {
        'react/prop-types': 'off',
        '@typescript-eslint/no-unused-vars': [
            'warn',
            {
                'argsIgnorePattern': '^_$',
            },
        ],
    },
};
