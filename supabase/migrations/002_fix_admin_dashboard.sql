-- Fix missing tables and relationships for Cuba Tattoo Studio Admin Dashboard

-- ==================== MISSING TABLES ====================

-- Create work_artists junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS work_artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    work_id UUID REFERENCES works(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'primary',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(work_id, artist_id)
);

-- Create animations table for visual editor
CREATE TABLE IF NOT EXISTS animations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    config JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create activity log table for tracking changes
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    changes JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== FIX RLS POLICIES ====================

-- More permissive policies for development/testing
DROP POLICY IF EXISTS "Artistas activos visibles públicamente" ON artists;
DROP POLICY IF EXISTS "Artistas pueden ver su propio perfil" ON artists;
DROP POLICY IF EXISTS "Artistas pueden actualizar su perfil" ON artists;
DROP POLICY IF EXISTS "Solo admins pueden crear artistas" ON artists;
DROP POLICY IF EXISTS "Solo admins pueden eliminar artistas" ON artists;

-- Simplified artist policies
CREATE POLICY "Artists visible to all" ON artists FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage artists" ON artists FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Simplified works policies  
DROP POLICY IF EXISTS "Trabajos publicados visibles públicamente" ON works;
DROP POLICY IF EXISTS "Artistas pueden ver sus trabajos" ON works;
DROP POLICY IF EXISTS "Artistas pueden crear trabajos" ON works;
DROP POLICY IF EXISTS "Artistas pueden actualizar sus trabajos" ON works;
DROP POLICY IF EXISTS "Artistas pueden eliminar sus trabajos" ON works;

CREATE POLICY "Works visible to all" ON works FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage works" ON works FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Simplified services policies
DROP POLICY IF EXISTS "Servicios activos visibles públicamente" ON services;
DROP POLICY IF EXISTS "Solo admins pueden gestionar servicios" ON services;

CREATE POLICY "Services visible to all" ON services FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage services" ON services FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Simplified content policies
DROP POLICY IF EXISTS "Contenido visible públicamente" ON site_content;
DROP POLICY IF EXISTS "Solo admins pueden editar contenido" ON site_content;

CREATE POLICY "Content visible to all" ON site_content FOR SELECT TO public USING (true);
CREATE POLICY "Authenticated users can manage content" ON site_content FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ==================== ADD INDEXES ====================

CREATE INDEX IF NOT EXISTS idx_work_artists_work_id ON work_artists(work_id);
CREATE INDEX IF NOT EXISTS idx_work_artists_artist_id ON work_artists(artist_id);
CREATE INDEX IF NOT EXISTS idx_work_artists_role ON work_artists(role);
CREATE INDEX IF NOT EXISTS idx_animations_active ON animations(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(created_at DESC);

-- ==================== ADD TRIGGERS ====================

-- Trigger for work_artists updated_at
CREATE TRIGGER update_work_artists_updated_at BEFORE UPDATE ON work_artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for animations updated_at  
CREATE TRIGGER update_animations_updated_at BEFORE UPDATE ON animations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for activity_log (no updated_at needed)

-- ==================== STORAGE SETUP ====================

-- Create storage buckets if they don't exist
-- Note: These should be run in Supabase dashboard or via API
-- INSERT INTO storage.buckets (id, name, public) VALUES 
--     ('avatars', 'avatars', true),
--     ('works', 'works', true),
--     ('site-assets', 'site-assets', true)
-- ON CONFLICT DO NOTHING;

-- ==================== SAMPLE DATA ====================

-- Insert sample services if they don't exist
INSERT INTO services (id, title, slug, description, icon, display_order, is_active) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Hyper Realism', 'hyper-realism', 'Portraits and nature with uncompromising detail', 'pentool', 1, true),
    ('550e8400-e29b-41d4-a716-446655440002', 'Fine Line', 'fine-line', 'Delicate, intricate, and minimal designs', 'pencil', 2, true),
    ('550e8400-e29b-41d4-a716-446655440003', 'Neo Traditional', 'neo-traditional', 'Bold lines and vibrant colors with modern flair', 'feather', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample artists if they don't exist
INSERT INTO artists (id, name, slug, specialty, bio, display_order, is_active) VALUES 
    ('550e8400-e29b-41d4-a716-446655440004', 'David', 'david', 'Blackwork & Realism', 'Mastering shadow and light, David specializes in high-contrast photorealism and large-scale blackwork projects.', 1, true),
    ('550e8400-e29b-41d4-a716-446655440005', 'Nina', 'nina', 'Fine Line & Floral', 'Delicacy is strength. Nina brings botanical illustrations and single-needle geometry to life.', 2, true),
    ('550e8400-e29b-41d4-a716-446655440006', 'Karli', 'karli', 'Neo Traditional & Color', 'Vibrant, bold, and timeless. Karli reinvents traditional motifs with a modern palette.', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample works if they don't exist
INSERT INTO works (id, artist_id, service_id, title, description, image_url, tags, featured, published) VALUES 
    ('550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Dragon Back Piece', 'Full back dragon tattoo in hyper realistic style', '/tattoo/dragon-back.png', '{"dragon", "back", "realism"}', true, true),
    ('550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Rose Sleeve', 'Delicate rose sleeve with fine line technique', '/tattoo/rose-sleeve.png', '{"rose", "sleeve", "fine-line"}', true, true),
    ('550e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'Neo Tiger', 'Modern neo-traditional tiger design', '/tattoo/neo-tiger.png', '{"tiger", "neo-traditional", "color"}', true, true)
ON CONFLICT (id) DO NOTHING;