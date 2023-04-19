module.exports = {
  semi: false,
  importOrder: [
    "<THIRD_PARTY_MODULES>",
    "^@components/(.*)$",
    "^@core/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
}
