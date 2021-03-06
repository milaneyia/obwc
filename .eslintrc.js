module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es6: true,
        jquery: true,
        commonjs: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
    ],
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'vue',
    ],
    rules: {
        'indent': [
            'error',
            4,
            { 'SwitchCase': 1 },
        ],
        'quotes': [
            'error',
            'single',
            { 'allowTemplateLiterals': true },
        ],
        'semi': [
            'error',
            'always',
        ],
        'semi-spacing': [
            'error',
            { 'before': false, 'after': true },
        ],
        'no-var': 'error',
        'comma-dangle': [
            'error', {
                'arrays': 'always-multiline',
                'objects': 'always-multiline',
                'imports': 'always-multiline',
                'exports': 'always-multiline',
                'functions': 'never',
            },
        ],
        'require-atomic-updates': 'off',
        'object-curly-spacing': [
            'error',
            'always',
        ],
        'object-shorthand': 'error',
        'require-await': 'error',
        'vue/html-indent': [
            'error',
            4,
        ],
        'vue/max-attributes-per-line': ['error', {
            'singleline': 2,
            'multiline': 1,
        }],
        'no-trailing-spaces': 'error',
        'key-spacing': 'error',
        'keyword-spacing': 'error',
        'space-before-blocks': 'error',
        'padding-line-between-statements': [
            'error',
            { 'blankLine': 'always', 'prev': '*', 'next': 'return' },

            { 'blankLine': 'always', 'prev': 'directive', 'next': '*' },
            { 'blankLine': 'any', 'prev': 'directive', 'next': 'directive' },

            { 'blankLine': 'always', 'prev': '*', 'next': 'block-like' },
            { 'blankLine': 'always', 'prev': 'block-like', 'next': '*' },
        ],
        'vue/component-tags-order': ['error', {
            'order': ['template', 'script', 'style'],
        }],
        'vue/no-v-html': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'vue/new-line-between-multi-line-property': 'error',
    },
};
