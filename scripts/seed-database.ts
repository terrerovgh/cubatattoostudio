import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

console.log('Loading environment variables...');
console.log('Supabase URL found:', !!supabaseUrl);
console.log('Service/Secret Key found:', !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY));

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials. Checked: PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_SECRET_KEY.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function migrateArtists() {
    console.log('Migrating artists...');
    const artistsDir = path.join(__dirname, '../src/content/artists');
    const files = fs.readdirSync(artistsDir);

    for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(artistsDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(content);
        const slug = file.replace('.md', '');

        const artistData = {
            name: data.name,
            slug: slug,
            bio: data.bio,
            specialty: data.specialties ? data.specialties.join(', ') : 'Tattoo Artist', // Adjust based on schema
            avatar_url: data.profileImage,
            instagram: data.social?.instagram,
            is_active: true,
        };

        const { error } = await supabase
            .from('artists')
            .upsert(artistData, { onConflict: 'slug' });

        if (error) {
            console.error(`Error migrating artist ${slug}:`, error);
        } else {
            console.log(`Migrated artist: ${slug}`);
        }
    }
}

async function migrateServices() {
    console.log('Migrating services...');
    const servicesDir = path.join(__dirname, '../src/content/services');
    if (!fs.existsSync(servicesDir)) {
        console.log('No src/content/services directory found.');
        return;
    }
    const files = fs.readdirSync(servicesDir);
    for (const file of files) {
        if (!file.endsWith('.md')) continue;
        const filePath = path.join(servicesDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(content);
        const slug = file.replace('.md', '');
        const serviceData = {
            title: data.title,
            slug,
            description: data.description || null,
            icon: data.icon || null,
            cover_image_url: data.coverImage || null,
            is_active: true,
        };
        const { error } = await supabase
            .from('services')
            .upsert(serviceData, { onConflict: 'slug' });
        if (error) {
            console.error(`Error migrating service ${slug}:`, error);
        } else {
            console.log(`Migrated service: ${slug}`);
        }
    }
}

async function migrateWorks() {
    console.log('Migrating works...');
    const worksDir = path.join(__dirname, '../src/content/works');
    if (!fs.existsSync(worksDir)) {
        console.log('No src/content/works directory found.');
        return;
    }
    const files = fs.readdirSync(worksDir);
    for (const file of files) {
        if (!file.endsWith('.md')) continue;
        const filePath = path.join(worksDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(content);
        const imageUrl = Array.isArray(data.images) && data.images.length ? data.images[0] : null;
        const tagsFromLocations = Array.isArray(data.displayLocations)
            ? data.displayLocations.filter((t: string) => typeof t === 'string')
            : [];
        let serviceSlug: string | null = null;
        const serviceTag = tagsFromLocations.find((t: string) => t.startsWith('service_'));
        if (serviceTag) serviceSlug = serviceTag.replace('service_', '');
        let serviceId: string | null = null;
        if (serviceSlug) {
            const { data: svc } = await supabase
                .from('services')
                .select('id')
                .eq('slug', serviceSlug)
                .single();
            serviceId = svc?.id || null;
        }
        let artistId: string | null = null;
        if (data.artist) {
            const { data: art } = await supabase
                .from('artists')
                .select('id')
                .eq('slug', data.artist)
                .single();
            artistId = art?.id || null;
        }
        const workData = {
            title: data.title || null,
            description: data.description || null,
            image_url: imageUrl || '',
            tags: tagsFromLocations.length ? tagsFromLocations : null,
            service_id: serviceId,
            artist_id: artistId,
            featured: true,
            published: true,
        };
        const { data: existing } = await supabase
            .from('works')
            .select('id')
            .eq('image_url', workData.image_url)
            .single();
        let insertedWorkId = existing?.id;
        if (!existing) {
            const { data: inserted, error } = await supabase
                .from('works')
                .insert(workData)
                .select('id')
                .single();
            if (error) {
                console.error(`Error migrating work ${file}:`, error);
                continue;
            }
            insertedWorkId = inserted?.id;
            console.log(`Migrated work: ${file}`);
        } else {
            console.log(`Work already exists: ${file}`);
        }
        if (insertedWorkId && artistId) {
            const { error } = await supabase
                .from('work_artists')
                .upsert({ work_id: insertedWorkId, artist_id: artistId, role: 'primary' }, { onConflict: 'work_id,artist_id' });
            if (error) {
                console.error(`Error linking work ${file} to artist:`, error);
            }
        }
    }
}

async function main() {
    await migrateArtists();
    await migrateServices();
    await migrateWorks();
    console.log('Migration complete.');
}

main().catch(console.error);
