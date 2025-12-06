import nextTypescript from "eslint-config-next/typescript"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import oxlint from "eslint-plugin-oxlint"

const eslintConfig = [
  ...nextTypescript,
  ...nextCoreWebVitals,
  ...oxlint.buildFromOxlintConfigFile(".oxlintrc.json"),
  {
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".contentlayer/**",
    ],
  },
]

export default eslintConfig
