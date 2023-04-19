import { defineDocumentType, makeSource } from "contentlayer/source-files"

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
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/posts/${post._raw.flattenedPath}`,
    },
  },
}))

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Content],
  mdx: {
    rehypePlugins: [],
    remarkPlugins: [],
    // esbuildOptions: (options) => {
    //   options.tsconfig = `${process.env.PWD}/tsconfig.mdx.json`
    //   return options
    // },
  },
})
