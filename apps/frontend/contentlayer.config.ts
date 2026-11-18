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
    lede: {
      description: "The claim of the content, one sentence per item",
      of: { type: "string" },
      required: false,
      type: "list",
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
    updated: {
      description: "The date the content was last changed",
      required: false,
      type: "date",
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

// Posts kept in content/logbook but hidden from the site (the logbook, their own page and the cabin's book).
// Comment a line out to bring that post back.
const HIDDEN_POSTS = [
  "code-me-an-input.mdx",
  "functional-notes.mdx",
  "mythical-man-month.mdx",
  "peopleware.mdx",
  "team-topologies.mdx",
  "time-bang.mdx",
  "water-part-1.mdx",
  "water-part-2.mdx",
  "webnotes.mdx",
]

export default makeSource({
  contentDirExclude: HIDDEN_POSTS,
  contentDirPath: "content/logbook",
  documentTypes: [Content],
  mdx: {
    rehypePlugins: [rehypeKatex, [rehypePrettyCode, options]],
    remarkPlugins: [remarkMath],
  },
})
