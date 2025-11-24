import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env file
config();

// Load environment variables
// For seed scripts, we need to use the service role key to bypass RLS
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    console.error('Make sure PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Define the current content from the website
const siteContent = [
    {
        section: 'hero',
        content: {
            location: 'Albuquerque, NM',
            tagline: 'Ideally located in the heart of the desert. Where precision meets permanence.',
            cta_text: 'Meet the Artists',
            cta_link: '#artists'
        }
    },
    {
        section: 'gallery',
        content: {
            title: 'Selected Works.',
            archive_text: 'View Archive',
            archive_link: '/works'
        }
    },
    {
        section: 'services',
        content: {
            title: 'Disciplines.',
            description: 'We don\'t just apply ink. We curate experiences tailored to your narrative. From microscopic detail to full body suits.'
        }
    },
    {
        section: 'booking',
        content: {
            title: 'Book Your Session',
            description: 'Ready to start your journey? Our artists are here to bring your vision to life.',
            cta_text: 'Schedule Consultation',
            email: 'info@cubatattoostudio.com',
            phone: '+1 (505) XXX-XXXX'
        }
    },
    {
        section: 'about',
        content: {
            title: 'About Us',
            description: 'Cuba Tattoo Studio is a premier tattoo studio located in Albuquerque, New Mexico. We specialize in custom tattoo work across multiple disciplines.'
        }
    },
    {
        section: 'footer',
        content: {
            copyright: '© 2024 Cuba Tattoo Studio. All rights reserved.',
            address: 'Albuquerque, New Mexico',
            social: {
                instagram: 'https://instagram.com/cubatattoostudio',
                facebook: 'https://facebook.com/cubatattoostudio'
            }
        }
    }
];

async function seedContent() {
    console.log('Starting content seed...');

    for (const item of siteContent) {
        console.log(`Inserting ${item.section}...`);

        const { data, error } = await supabase
            .from('site_content')
            .upsert({
                section: item.section,
                content: item.content,
                updated_at: new Date().toISOString()
            }, { onConflict: 'section' });

        if (error) {
            console.error(`Error inserting ${item.section}:`, error);
        } else {
            console.log(`✓ ${item.section} inserted successfully`);
        }
    }

    console.log('Content seed completed!');
}

seedContent().catch(console.error);
