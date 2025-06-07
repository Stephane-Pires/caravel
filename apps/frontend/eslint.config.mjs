import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js"
import oxlint from "eslint-plugin-oxlint"
import path from "node:path"
import { fileURLToPath } from "node:url"

// Should be deleted when this project transition completly to oxlintrc

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
})

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  ...oxlint.buildFromOxlintConfigFile(".oxlintrc.json"),
  {
    linterOptions: {
      reportUnusedDisableDirectives: "off"
  }
}
]

export default eslintConfig
