/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-magic-numbers */
import { defineDocumentType, makeSource } from "contentlayer2/source-files"
import rehypeKatex from "rehype-katex"
import { rehypePrettyCode } from "rehype-pretty-code"
import remarkMath from "remark-math"

export const Content = defineDocumentType(() => ({
  computedFields: {
    url: {
      resolve: (content) => `${content._raw.flattenedPath}`,
      type: "string",
    },
  },
  contentType: "mdx",
  fields: {
    category: {
      description: "The category of the content",
      required: true,
      type: "string",
    },
    date: {
      description: "The date of the content",
      required: true,
      type: "date",
    },
    image: {
      description: "The image of the content",
      required: true,
      type: "string",
    },
    star: {
      description: "How much i like this content",
      required: true,
      type: "string",
    },
    subject: {
      description: "The subject of the content",
      required: true,
      type: "string",
    },
    title: {
      description: "The title of the Content",
      required: true,
      type: "string",
    },
  },
  filePathPattern: `**/*.mdx`,
  name: "Content",
}))

// https://rehype-pretty-code.netlify.app/
const options = {
  // Keep the background or use a custom background color?
  keepBackground: true,

  onVisitHighlightedLine(node: any) {
    // Each line node by default has `class="line"`.
    node.properties.className.push("highlighted")
  },
  onVisitHighlightedWord(node: any) {
    // Each word node has no className by default.
    node.properties.className = ["word"]
  },

  // Callback hooks to add custom logic to nodes when visiting
  // them.
  onVisitLine(node: any) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (0 === node.children.length) {
      node.children = [{ type: "text", value: " " }]
    }
  },

  // Use one of Shiki's packaged themes
  // theme: "one-dark-pro",
  theme: "github-dark",
}

export default makeSource({
  contentDirPath: "content/logbook",
  documentTypes: [Content],
  mdx: {
    rehypePlugins: [rehypeKatex, [rehypePrettyCode, options]],
    remarkPlugins: [remarkMath],
  },
})
