import { defineCollection, z } from 'astro:content';

const artistsCollection = defineCollection({
  schema: z.object({
    name: z.string(),
    specialty: z.string(),
    bio: z.string(),
    photo: z.string(),
    instagram: z.string().optional(),
    facebook: z.string().optional(),
  }),
});

export const collections = { artists: artistsCollection };
