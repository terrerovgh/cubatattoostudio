import { defineCollection, reference, z } from 'astro:content';

const artists = defineCollection({
    type: 'content',
    schema: z.object({
        name: z.string(),
        bio: z.string(),
        profileImage: z.string(), // Path to image in public folder or URL
        social: z.object({
            instagram: z.string().url().optional(),
            facebook: z.string().url().optional(),
            twitter: z.string().url().optional(),
            email: z.string().email().optional(),
        }).optional(),
        specialties: z.array(z.string()).default([]),
        stats: z.array(z.object({
            label: z.string(),
            value: z.string(),
        })).optional(),
    }),
});

const works = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        style: z.string(),
        serviceCategory: z.enum(['Tattoo', 'Piercing', 'Art']).optional(),
        images: z.array(z.string()), // Paths to images
        videos: z.array(z.string()).optional(), // Paths to videos
        displayLocations: z.array(z.enum([
            'dome_gallery',
            'main_gallery',
            'artist_portfolio',
            'service_realism',
            'service_fineline',
            'service_neotraditional'
        ])).default(['artist_portfolio']),
        sessions: z.number().optional(),
        artist: reference('artists'), // Reference to an artist entry
    }),
});

const siteContent = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        sections: z.array(
            z.object({
                id: z.string(),
                title: z.string().optional(),
                content: z.string(), // Can be markdown string or just text
            })
        ).optional(),
    }),
});

const services = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        coverImage: z.string(),
        icon: z.string().optional(),
        relatedTag: z.string(), // Must match a value in works.displayLocations
    }),
});

export const collections = {
    artists,
    works,
    siteContent,
    services,
};
