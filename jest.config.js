module.exports = {
  moduleNameMapper: {
    "@tstack/jest": "<rootDir>/dist/jest",
    "^@tstack/(.*)$": "<rootDir>/dist/$1"
  },
  modulePathIgnorePatterns: [
    "<rootDir>/projects/.*/package.json"
  ]
};