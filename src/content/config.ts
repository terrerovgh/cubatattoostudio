
import { defineCollection, z } from 'astro:content';

const artists = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    style: z.string(),
    role: z.string().default('Resident Artist'),
    order: z.number().default(99),
    coverImage: z.string(),
    images: z.array(z.string()),
    bio: z.string().optional(),
    socials: z.object({
      instagram: z.string().optional(),
    }).optional(),
  }),
});

const gallery = defineCollection({
  type: 'content', // or 'data' if no body needed, but 'content' allows descriptions
  schema: z.object({
    title: z.string().optional(),
    image: z.string(),
    artist: z.string().optional(), // Reference to artist slug if needed
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    date: z.date().optional(),
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    media: z.string(), // URL to image or video
    type: z.enum(['image', 'video']).default('image'),
    price: z.string().optional(),
    tags: z.array(z.string()).optional(),
    gallery: z.array(z.string()).optional(), // Explicit list of images/videos
    order: z.number().default(99),
  }),
});

const studio = defineCollection({
  type: 'content',
  schema: z.object({
    sectionTag: z.string(),
    mainTitle: z.string(),
    subtitle: z.string(),
    videos: z.array(z.string()),
    feature1Title: z.string(),
    feature1Subtitle: z.string(),
    feature2Title: z.string(),
    feature2Subtitle: z.string(),
  }),
});

const chat = defineCollection({
  type: 'content',
  schema: z.object({
    assistantName: z.string().default('Assistant'),
    modalTitle: z.string().default('Chat'),
    welcomeMessage: z.string().default('How can I help you?'),
    inputPlaceholder: z.string().default('Type a message...'),
    quickActions: z.array(z.object({
      label: z.string(),
      prompt: z.string(),
    })).optional(),
    staticResponses: z.array(z.object({
      trigger: z.string(), // Keyword or phrase to match
      response: z.string(), // The static answer
    })).optional(),
  }),
});

export const collections = {
  artists,
  gallery,
  services,
  studio,
  chat,
};
