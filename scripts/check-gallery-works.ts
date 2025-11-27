
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkGalleryWorks() {
    const { data, error } = await supabase
        .from('works')
        .select('*')
        .contains('tags', ['main_gallery']);

    if (error) {
        console.error('Error fetching works:', error);
        return;
    }

    console.log(`Found ${data.length} works with tag 'main_gallery'`);
    if (data.length > 0) {
        console.log('Sample work:', data[0]);
    } else {
        console.log('No works found. You might need to add some works with the tag "main_gallery" via the admin dashboard or a script.');
    }
}

checkGalleryWorks();
