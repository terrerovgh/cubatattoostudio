import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const scheduleSlot = z.object({ start: z.string(), end: z.string() }).nullable();

const constellationMandala = z.object({
  petals: z.number().min(3).max(24),
  layers: z.number().min(1).max(8),
  scale: z.number().min(0.05).max(0.5).default(0.2),
  position: z.tuple([z.number(), z.number()]),
});

const constellationRose = z.object({
  k: z.number(),
  scale: z.number().min(0.03).max(0.4).default(0.12),
  position: z.tuple([z.number(), z.number()]),
});

const constellationSchema = z.object({
  enabled: z.boolean().default(false),
  colors: z.array(z.string()).min(1).max(6).default(['#B49AD4', '#C4A8E0', '#9B7EC8']),
  starDensity: z.number().min(0).max(1).default(0.4),
  rotationSpeed: z.number().min(0).max(0.1).default(0.008),
  mandalas: z.array(constellationMandala).default([]),
  roses: z.array(constellationRose).default([]),
  sacredGeometry: z.boolean().default(true),
  geometricShapes: z.boolean().default(true),
  phyllotaxis: z.boolean().default(true),
});

const splashCursorSchema = z.object({
  enabled: z.boolean().default(false),
  SIM_RESOLUTION: z.number().default(128),
  DYE_RESOLUTION: z.number().default(1440),
  DENSITY_DISSIPATION: z.number().default(3.5),
  VELOCITY_DISSIPATION: z.number().default(2),
  PRESSURE: z.number().default(0.1),
  CURL: z.number().default(3),
  SPLAT_RADIUS: z.number().default(0.2),
  SPLAT_FORCE: z.number().default(6000),
  COLOR_UPDATE_SPEED: z.number().default(10),
});

const artists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artists' }),
  schema: z.object({
    id: z.string(),
    accentColor: z.string().default('#C8956C'),
    accentColorLight: z.string().default('#D4A574'),
    accentColorDark: z.string().default('#A87A55'),
    backgroundImage: z.string().default('/backgrounds/artists.svg'),
    layout: z.enum(['gallery-left', 'gallery-right', 'gallery-top']).default('gallery-left'),
    constellation: constellationSchema.optional(),
    splashCursor: splashCursorSchema.optional(),
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
