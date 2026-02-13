import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const scheduleSlot = z.object({ start: z.string(), end: z.string() }).nullable();

const artists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artists' }),
  schema: z.object({
    id: z.string(),
    accentColor: z.string().default('#C8956C'),
    accentColorLight: z.string().default('#D4A574'),
    accentColorDark: z.string().default('#A87A55'),
    backgroundImage: z.string().default('/backgrounds/artists.svg'),
    layout: z.enum(['gallery-left', 'gallery-right', 'gallery-top']).default('gallery-left'),
    availability: z
      .object({
        timezone: z.string().default('America/Denver'),
        schedule: z.object({
          monday: scheduleSlot,
          tuesday: scheduleSlot,
          wednesday: scheduleSlot,
          thursday: scheduleSlot,
          friday: scheduleSlot,
          saturday: scheduleSlot,
          sunday: scheduleSlot,
        }),
        blockedDates: z.array(z.string()).optional(),
        note: z.string().optional(),
      })
      .optional(),
  }),
});

const sections = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sections' }),
  schema: ({ image }) => z.object({
    order: z.number(),
    id: z.string(),
    backgroundImage: z.string(),
    layout: z.enum([
      'hero-center',
      'profile-card',
      'grid-gallery',
      'list-services',
      'booking-cta',
      'promo-grid',
    ]),
    title: z.string().optional(),
    subtitle: z.string().optional(),
    promos: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        link: z.string().optional(),
        date: z.string().optional(),
        images: z.array(image()).optional(), // Carousel support
        image: image().optional(), // Fallback for single image
        type: z.enum(['event', 'flash', 'promo']).default('promo'),
        position: z.number().optional(), // Custom ordering
      })
    ).optional(),
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

export const collections = { sections, artists };
