
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
// Use service role key to bypass RLS for initial setup/verification
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testToggleTag() {
    console.log('Testing toggleWorkTag logic...');

    // 1. Get a work
    const { data: works } = await supabase.from('works').select('id, tags').limit(1);
    if (!works || works.length === 0) {
        console.log('No works found to test.');
        return;
    }
    const work = works[0];
    console.log(`Testing with work: ${work.id}, tags: ${work.tags}`);

    // 2. Toggle tag ON
    console.log('Toggling tag ON...');
    const tag = 'test_gallery_tag';
    const currentTags = work.tags || [];
    let newTags = [...currentTags, tag];

    const { data: updated1, error: error1 } = await supabase
        .from('works')
        .update({ tags: newTags })
        .eq('id', work.id)
        .select()
        .single();

    if (error1) {
        console.error('Error toggling ON:', error1);
    } else {
        console.log('Toggled ON success. Tags:', updated1.tags);
    }

    // 3. Toggle tag OFF
    console.log('Toggling tag OFF...');
    newTags = (updated1?.tags || []).filter((t: string) => t !== tag);

    const { data: updated2, error: error2 } = await supabase
        .from('works')
        .update({ tags: newTags })
        .eq('id', work.id)
        .select()
        .single();

    if (error2) {
        console.error('Error toggling OFF:', error2);
    } else {
        console.log('Toggled OFF success. Tags:', updated2.tags);
    }
}

testToggleTag();
