import { defineDocumentType, makeSource } from "contentlayer2/source-files"
import rehypeKatex from "rehype-katex"
import rehypePrettyCode from "rehype-pretty-code"
import remarkMath from "remark-math"

export const Content = defineDocumentType(() => ({
  name: "Content",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the Content",
      required: true,
    },
    image: {
      type: "string",
      description: "The image of the content",
      required: true,
    },
    date: {
      type: "date",
      description: "The date of the content",
      required: true,
    },
    subject: {
      type: "string",
      description: "The subject of the content",
      required: true,
    },
    category: {
      type: "string",
      description: "The category of the content",
      required: true,
    },
    star: {
      type: "string",
      description: "How much i like this content",
      required: true,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (content) => `${content._raw.flattenedPath}`,
    },
  },
}))

// https://rehype-pretty-code.netlify.app/
const options = {
  // Use one of Shiki's packaged themes
  // theme: "one-dark-pro",
  theme: "github-dark",

  // Keep the background or use a custom background color?
  keepBackground: true,

  // Callback hooks to add custom logic to nodes when visiting
  // them.
  onVisitLine(node: any) {
    // Prevent lines from collapsing in `display: grid` mode, and
    // allow empty lines to be copy/pasted
    if (0 === node.children.length) {
      node.children = [{ type: "text", value: " " }]
    }
  },
  onVisitHighlightedLine(node: any) {
    // Each line node by default has `class="line"`.
    node.properties.className.push("highlighted")
  },
  onVisitHighlightedWord(node: any) {
    // Each word node has no className by default.
    node.properties.className = ["word"]
  },
}

export default makeSource({
  contentDirPath: "content/logbook",
  documentTypes: [Content],
  mdx: {
    rehypePlugins: [rehypeKatex, [rehypePrettyCode, options]],
    remarkPlugins: [remarkMath],
  },
})
