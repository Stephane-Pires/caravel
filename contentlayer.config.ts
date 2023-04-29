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

export default makeSource({
  contentDirPath: "content",
  documentTypes: [Content],
  mdx: {
    rehypePlugins: [],
    remarkPlugins: [],
  },
})
