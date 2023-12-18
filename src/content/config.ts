import { z, defineCollection } from "astro:content";

const blogCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string()),
    image: z.string().optional(),
  }),
});

const shadersCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
  }),
});

const authorsCollection = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    jobTitle: z.string(),
  }),
});

export const collections = {
  blogs: blogCollection,
  shaders: shadersCollection,
  authors: authorsCollection,
};
