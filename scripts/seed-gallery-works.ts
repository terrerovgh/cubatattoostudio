
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleWorks = [
    {
        title: 'Neon Dragon',
        description: 'A vibrant neon dragon tattoo.',
        image_url: 'https://images.unsplash.com/photo-1542332213-31f87348057f?q=80&w=2070&auto=format&fit=crop',
        tags: ['main_gallery', 'neo_traditional'],
        published: true,
        featured: true,
    },
    {
        title: 'Geometric Wolf',
        description: 'Intricate geometric wolf design.',
        image_url: 'https://images.unsplash.com/photo-1562563436-a7e02710304e?q=80&w=2070&auto=format&fit=crop',
        tags: ['main_gallery', 'geometric'],
        published: true,
        featured: true,
    },
    {
        title: 'Floral Sleeve',
        description: 'Detailed floral sleeve in black and grey.',
        image_url: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=2070&auto=format&fit=crop',
        tags: ['main_gallery', 'black_and_grey'],
        published: true,
        featured: true,
    }
];

async function seedGalleryWorks() {
    console.log('Seeding gallery works...');

    for (const work of sampleWorks) {
        const { data, error } = await supabase
            .from('works')
            .insert(work)
            .select();

        if (error) {
            console.error(`Error inserting ${work.title}:`, error);
        } else {
            console.log(`Inserted ${work.title}:`, data[0].id);
        }
    }

    console.log('Seeding complete.');
}

seedGalleryWorks();
