// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// Define a `type` and `schema` for each collection
const artistsCollection = defineCollection({
  type: 'content', // 'content' for .md/.mdx files, 'data' for .json/.yaml
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    style: z.string(),
    video: z.string(), // Path to video file, relative to public/
    images: z.array(z.string()), // Array of paths to image files, relative to public/
    description: z.string(),
  }),
});

// Export a `collections` object to register your collection(s)
export const collections = {
  'artists': artistsCollection,
};

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  }
});