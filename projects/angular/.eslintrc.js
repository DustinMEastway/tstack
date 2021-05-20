module.exports = {
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "extends": [
        "../../.eslintrc.js"
      ],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "tsk",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "tsk",
            "style": "kebab-case"
          }
        ]
      }
    }
  ]
};
