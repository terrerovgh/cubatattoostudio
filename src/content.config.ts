import { defineCollection, z } from "astro:content";

const artists = defineCollection({
    type: "content",
    schema: z.object({
        id: z.string(),
        name: z.string().optional(),
        displayName: z.string().optional(),
        role: z.string().optional(),
        bio: z.string().optional(),
        profileImage: z.string().optional(),
        phone: z.string().optional(),
        origin: z.string().optional(),
        styleDescription: z.string().optional(),
        signatureStyle: z.string().optional(),
        achievements: z.array(z.string()).optional(),
        specialties: z.array(z.string()).optional(),
        highlights: z.array(z.string()).optional(),
        additionalSkills: z.array(z.string()).optional(),
        personalAccount: z.string().optional(),
        socials: z.object({
            instagram: z.string().optional(),
            email: z.string().optional(),
        }).optional(),

        accentColor: z.string().optional(),
        accentColorLight: z.string().optional(),
        accentColorDark: z.string().optional(),
        backgroundImage: z.string().optional(),
        layout: z.enum(["gallery-right", "gallery-top", "gallery-left", "profile-card"]).optional(),

        // Constellation background settings
        constellation: z.object({
            enabled: z.boolean().default(true),
            colors: z.array(z.string()).optional(),
            starDensity: z.number().optional(),
            rotationSpeed: z.number().optional(),
            mandalas: z.array(z.object({
                petals: z.number(),
                layers: z.number(),
                scale: z.number(),
                position: z.tuple([z.number(), z.number()])
            })).optional(),
            roses: z.array(z.object({
                k: z.number(),
                scale: z.number(),
                position: z.tuple([z.number(), z.number()])
            })).optional(),
            sacredGeometry: z.boolean().optional(),
            geometricShapes: z.boolean().optional(),
            phyllotaxis: z.boolean().optional(),
        }).optional(),

        // Availability settings
        availability: z.object({
            timezone: z.string().optional(),
            schedule: z.record(z.nullable(z.object({
                start: z.string(),
                end: z.string()
            }))).optional(),
            blockedDates: z.array(z.string()).optional(),
            note: z.string().optional()
        }).optional(),

        // Splash cursor settings
        splashCursor: z.object({
            enabled: z.boolean().default(false),
            SIM_RESOLUTION: z.number().optional(),
            DYE_RESOLUTION: z.number().optional(),
            DENSITY_DISSIPATION: z.number().optional(),
            VELOCITY_DISSIPATION: z.number().optional(),
            PRESSURE: z.number().optional(),
            CURL: z.number().optional(),
            SPLAT_RADIUS: z.number().optional(),
            SPLAT_FORCE: z.number().optional(),
            COLOR_UPDATE_SPEED: z.number().optional(),
        }).optional(),

        // Portfolio Data (Migrated from JSON)
        portfolio: z.object({
            description: z.string().optional(),
            featuredWorks: z.array(z.object({
                image: z.string(),
                title: z.string(),
                description: z.string(),
                style: z.string(),
                tags: z.array(z.string()).optional()
            })).optional(),
            additionalStyles: z.array(z.object({
                style: z.string(),
                description: z.string()
            })).optional()
        }).optional(),

        // Sections Configuration (New)
        sections: z.array(z.discriminatedUnion("type", [
            z.object({
                type: z.literal("hero"),
                animate: z.boolean().default(true).optional(),
            }),
            z.object({
                type: z.literal("bio"),
                showAchievements: z.boolean().default(true).optional(),
                animate: z.boolean().default(true).optional(),
            }),
            z.object({
                type: z.literal("stats"),
                animate: z.boolean().default(true).optional(),
            }),
            z.object({
                type: z.literal("styles"),
                showAdditionalStyles: z.boolean().default(true).optional(),
                animate: z.boolean().default(true).optional(),
            }),
            z.object({
                type: z.literal("availability"),
                animate: z.boolean().default(true).optional(),
            }),
            z.object({
                type: z.literal("gallery"),
                columns: z.number().default(3).optional(),
                mobileColumns: z.number().default(2).optional(),
                gap: z.string().optional(),
                animate: z.boolean().default(true).optional(),
            }),
            z.object({
                type: z.literal("spacer"),
                height: z.string().default("h-12").optional(), // e.g., h-12, h-24
            }),
        ])).optional(),
    }),
});



const sections = defineCollection({
    type: "content",
    schema: z.object({
        order: z.number().optional(),
        id: z.string().optional(),
        backgroundImage: z.string().optional(),
        sectionLayout: z.string().optional(),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        services: z.array(z.object({
            name: z.string(),
            description: z.string(),
            image: z.string().optional(), // Keep for backward compatibility if needed
            galleryImages: z.array(z.string()).optional(),
            videos: z.array(z.string()).optional(),
            fullDescription: z.string().optional(),
            priceList: z.array(z.object({
                item: z.string(),
                price: z.string()
            })).optional(),
            reviews: z.array(z.object({
                author: z.string(),
                comment: z.string(),
                rating: z.number()
            })).optional(),
            price: z.string().optional(), // Keep for backward compatibility
            // Grid Configuration
            colSpanMobile: z.number().default(1).optional(),
            rowSpanMobile: z.number().default(1).optional(),
            colSpanTablet: z.number().default(1).optional(),
            rowSpanTablet: z.number().default(1).optional(),
            colSpanDesktop: z.number().default(1).optional(),
            rowSpanDesktop: z.number().default(1).optional(),
        })).optional(),
        artists: z.array(z.any()).optional(),
        promos: z.array(z.any()).optional(),
        bookingUrl: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        address: z.string().optional(),
    }).passthrough(),
});

export const collections = {
    artists,
    sections,
};
