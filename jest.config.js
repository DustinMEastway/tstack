module.exports = {
  moduleNameMapper: {
    "^@tstack/(.*)$": "<rootDir>/dist/$1"
  },
  modulePathIgnorePatterns: [
    "<rootDir>/projects/.*/package.json"
  ]
};