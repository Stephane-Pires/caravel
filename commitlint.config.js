/* eslint-disable no-commonjs */

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "scope-enum": [2, "always", ["app", "content", "curriculum"]],
    "type-enum": [
      2,
      "always",
      ["feat", "evol", "dx", "fix", "docs", "test", "chore"],
    ],
  },
}
