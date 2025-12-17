
import { defineCollection, z, reference } from 'astro:content';

const schedules = defineCollection({
  type: 'content',
  schema: z.object({
    days: z.array(z.string()), // e.g. ["Monday", "Wednesday", "Friday"]
    hours: z.object({
      start: z.string(), // "10:00"
      end: z.string(),   // "18:00"
    }),
    exceptions: z.array(z.object({
      date: z.string(), // "2023-12-25"
      available: z.boolean(),
    })).optional(),
  }),
});

const bookingInfo = defineCollection({
  type: 'content',
  schema: z.object({
    deposit: z.string(), // "$50"
    minPrice: z.string().optional(), // "$100"
    policy: z.string(), // "Non-refundable deposit..."
    methods: z.array(z.string()), // ["Cash", "Zelle"]
  }),
});

// New Collections for Strict Relational Structure
const bios = defineCollection({
  type: 'content',
  schema: z.object({
    artist: reference('artists').optional(), // Back-reference just in case
    fullBio: z.string(),
    shortBio: z.string().optional(),
  }),
});

const tattoos = defineCollection({
  type: 'content',
  schema: z.object({
    image: z.string(),
    artist: reference('artists'),
    tags: z.array(z.string()).default([]),
    date: z.date().optional(),
  }),
});

const flashDesigns = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    price: z.string().optional(),
    image: z.string(),
    artist: reference('artists'),
    available: z.boolean().default(true),
    description: z.string().optional(),
  }),
});

const promotions = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    artist: reference('artists'),
    validUntil: z.string().optional(), // Date string
    images: z.array(z.string()).optional(),
  }),
});

const clients = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    email: z.string(),
    contact: z.string().optional(),
  }),
});

const dossiers = defineCollection({
  type: 'content',
  schema: z.object({
    description: z.string(),
    budget: z.string().optional(),
    referenceImages: z.array(z.string()).optional(),
    client: reference('clients'),
  }),
});

const appointments = defineCollection({
  type: 'content',
  schema: z.object({
    date: z.string(), // ISO Date
    time: z.string(),
    artist: reference('artists'),
    dossier: reference('dossiers'),
  }),
});


const artists = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    style: z.string(),
    role: z.string().default('Resident Artist'),
    order: z.number().default(99),
    status: z.enum(['walk-ins', 'booking', 'closed']).default('booking'),
    coverImage: z.string(),
    profileImage: z.string().optional(),
    // Relations - these can be inferred by reverse lookup, but keeping explicit if needed. 
    // Usually in relational DBs, the 'many' side holds the FK. 
    // Here 'tattoos', 'flashDesigns' etc have 'artist' FK. 
    // So we don't STRICTLY need arrays here unless we want manual ordering/curation.
    // The user requirement says "artists have related bio, tattoos...". 
    // I will add optional arrays for explicit curation, but rely on reverse query mostly.
    schedule: reference('schedules').optional(),
    bookingInfo: reference('bookingInfo').optional(),
    bio: reference('bios').optional(),
    socials: z.object({
      instagram: z.string().optional(),
    }).optional(),
  }),
});

const gallery = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    image: z.string(),
    artist: z.string().optional(), // Keeping independent for now, or could migrate to reference('artists')
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    date: z.date().optional(),
    tattoos: z.array(reference('tattoos')).optional(), // Link to specific tattoo entries if related
  }),
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    media: z.string(),
    type: z.enum(['image', 'video']).default('image'),
    price: z.string().optional(),
    tags: z.array(z.string()).optional(),
    gallery: z.array(z.string()).optional(),
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
      trigger: z.string(),
      response: z.union([z.string(), z.array(z.string())]),
    })).optional(),
    bookingSteps: z.array(z.object({
      key: z.string(),
      question: z.union([z.string(), z.array(z.string())]),
      type: z.enum(['text', 'option', 'image', 'date']).default('option'),
      options: z.array(z.string()).optional(),
      errorMessage: z.union([z.string(), z.array(z.string())]).optional(),
    })).optional(),
  }),
});

export const collections = {
  artists,
  gallery,
  services,
  studio,
  chat,
  schedules,
  bookingInfo,
  // New ones
  bios,
  tattoos,
  flashDesigns,
  promotions,
  clients,
  dossiers,
  appointments
};
