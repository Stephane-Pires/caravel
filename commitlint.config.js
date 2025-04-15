/* eslint-disable no-commonjs */

const ERROR_LEVEL = 2

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [
      ERROR_LEVEL,
      "always",
      ["app", "content", "curriculum", "changeset"],
    ],
    "type-enum": [
      ERROR_LEVEL,
      "always",
      ["feat", "evol", "dx", "fix", "docs", "test", "chore", "release"],
    ],
  },
}
