module.exports = {
  "env": {
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 2015
  },
  "rules": {
    "no-console": "off",
    "no-var": "error",
    "prefer-arrow-callback": [ "error", { "allowNamedFunctions": true } ],
    "arrow-parens": ["error", "as-needed"],
    "dot-location": ["error", "property"],
    "prefer-template": 2,
    "object-shorthand": 2,
    "camelcase": 2,
    "no-param-reassign": ["error", { "props": true }],
    "no-else-return": "error",
    "indent": [
        "error",
        2
    ],
    // "linebreak-style": [
    //     "error",
    //     "windows"
    // ],
    "quotes": ["error", "single"],
    "semi": ["error", "never"]
  }
};