import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const sections = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sections' }),
  schema: z.object({
    order: z.number(),
    id: z.string(),
    backgroundImage: z.string(),
    layout: z.enum([
      'hero-center',
      'profile-card',
      'grid-gallery',
      'list-services',
      'booking-cta',
    ]),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    artists: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          image: z.string(),
          instagram: z.string().optional(),
          portfolio: z.array(z.string()).optional(),
        })
      )
      .optional(),
    services: z
      .array(
        z.object({
          name: z.string(),
          description: z.string(),
          price: z.string().optional(),
        })
      )
      .optional(),
    bookingUrl: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const collections = { sections };
