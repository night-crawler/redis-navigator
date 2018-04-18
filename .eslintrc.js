module.exports = {
    'globals': {
        'process': true,
        'shallow': true,
    },
    'env': {
        'browser': true,
        'jest/globals': true,
        'jest': true,
        'commonjs': true,
        'es6': true,
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:jest/recommended',
        'plugin:import/recommended',
        // 'plugin:flowtype/recommended',
        // 'plugin:react-native/all'
    ],
    'settings': {
        'import/resolver': {
            node: { paths: [ 'src' ] },
            'babel-module': {},
            'extensions': [ '.js', '.jsx' ]
        }
    },
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaFeatures': {
            'experimentalObjectRestSpread': true,
            'jsx': true
        },
        'sourceType': 'module'
    },
    'plugins': [
        'react',
        // 'react-native',
        'jest',
        'prettier',
        // 'flowtype',
    ],
    'rules': {
        'react/react-in-jsx-scope': 'off',
        'react/jsx-pascal-case': [2, { 'allowAllCaps': true, 'ignore': [] }],
        'react/jsx-curly-spacing': [2, { 'when': 'always', 'allowMultiline': true }],
        'react/jsx-boolean-value': [2, 'always'],
        'react/jsx-indent-props': [1],
        'react/jsx-indent': [1],
        'react/jsx-handler-names': [1, {
            'eventHandlerPrefix': 'handle',
            'eventHandlerPropPrefix': 'on'
        }],
        'react/jsx-closing-tag-location': 1,
        'react/jsx-space-before-closing': 1,
        'react/no-set-state': 0,
        'react/prefer-es6-class': [2, 'always'],

        // react native
        // 'react-native/no-unused-styles': 1,
        // 'react-native/split-platform-components': 1,
        // 'react-native/no-inline-styles': 1,
        // 'react-native/no-color-literals': 1,

        'no-console': process.env.NODE_ENV === 'production' ? 2 : 1,
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 1,

        // 'indent': [
        //     'error',
        //     4
        // ],
        'indent': ['error', 4, { SwitchCase: 1 }],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],

        'import/order': ['error', {
            'groups': ['builtin', 'external', 'index', 'internal', 'parent', 'sibling'],
            'newlines-between': 'always'
        }],

        'prettier/prettier': 'error',
    }
};
