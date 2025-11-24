-- Migration: Extend schema for visual content editor
-- Created: 2025-11-23

-- ==================== ANIMATIONS TABLE ====================

CREATE TABLE IF NOT EXISTS animations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('gsap', 'framer', 'css')),
    properties JSONB NOT NULL DEFAULT '{}',
    trigger_type TEXT CHECK (trigger_type IN ('scroll', 'viewport', 'click', 'load', 'hover')),
    trigger_config JSONB DEFAULT '{}',
    target_selector TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_animations_type ON animations(type);
CREATE INDEX idx_animations_active ON animations(is_active) WHERE is_active = true;

-- ==================== EXTEND SITE_CONTENT ====================

-- Add columns for component-based page structure
ALTER TABLE site_content 
    ADD COLUMN IF NOT EXISTS components JSONB DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS layout_config JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

CREATE INDEX idx_site_content_section ON site_content(section);

-- ==================== WORK-ARTIST RELATIONSHIPS ====================

-- Many-to-many relationship for collaborations
CREATE TABLE IF NOT EXISTS work_artists (
    work_id UUID REFERENCES works(id) ON DELETE CASCADE,
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'primary' CHECK (role IN ('primary', 'collaboration', 'guest')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (work_id, artist_id)
);

CREATE INDEX idx_work_artists_work ON work_artists(work_id);
CREATE INDEX idx_work_artists_artist ON work_artists(artist_id);

-- ==================== EXTEND ARTISTS TABLE ====================

ALTER TABLE artists
    ADD COLUMN IF NOT EXISTS personal_gallery JSONB DEFAULT '[]',
    ADD COLUMN IF NOT EXISTS bio_rich_text JSONB,
    ADD COLUMN IF NOT EXISTS portfolio_config JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS theme_settings JSONB DEFAULT '{}';

-- ==================== EXTEND WORKS TABLE ====================

ALTER TABLE works
    ADD COLUMN IF NOT EXISTS video_url TEXT,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS animation_config JSONB,
    ADD COLUMN IF NOT EXISTS display_config JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS before_image_url TEXT,
    ADD COLUMN IF NOT EXISTS after_image_url TEXT;

CREATE INDEX idx_works_video ON works(video_url) WHERE video_url IS NOT NULL;

-- ==================== PAGE COMPONENTS TABLE ====================

-- For storing reusable component definitions
CREATE TABLE IF NOT EXISTS page_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    props JSONB DEFAULT '{}',
    children JSONB DEFAULT '[]',
    styles JSONB DEFAULT '{}',
    animations UUID[] DEFAULT '{}',
    is_reusable BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_page_components_type ON page_components(type);
CREATE INDEX idx_page_components_reusable ON page_components(is_reusable) WHERE is_reusable = true;

-- ==================== TRIGGERS ====================

CREATE TRIGGER update_animations_updated_at 
    BEFORE UPDATE ON animations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_components_updated_at 
    BEFORE UPDATE ON page_components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== ROW LEVEL SECURITY ====================

ALTER TABLE animations ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_components ENABLE ROW LEVEL SECURITY;

-- Animations policies
CREATE POLICY "Animaciones visibles públicamente"
    ON animations FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Solo admins pueden gestionar animaciones"
    ON animations FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'admin') 
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Work-Artists policies
CREATE POLICY "Relaciones work-artist visibles públicamente"
    ON work_artists FOR SELECT TO public USING (true);

CREATE POLICY "Artistas y admins pueden gestionar relaciones"
    ON work_artists FOR ALL TO authenticated 
    USING (
        artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()) 
        OR auth.jwt() ->> 'role' = 'admin'
    );

-- Page Components policies
CREATE POLICY "Componentes visibles públicamente"
    ON page_components FOR SELECT TO public USING (true);

CREATE POLICY "Solo admins pueden gestionar componentes"
    ON page_components FOR ALL TO authenticated 
    USING (auth.jwt() ->> 'role' = 'admin') 
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ==================== HELPER FUNCTIONS ====================

-- Function to get all artists for a work
CREATE OR REPLACE FUNCTION get_work_artists(work_uuid UUID)
RETURNS TABLE (
    artist_id UUID,
    artist_name TEXT,
    artist_slug TEXT,
    role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.name,
        a.slug,
        wa.role
    FROM artists a
    JOIN work_artists wa ON a.id = wa.artist_id
    WHERE wa.work_id = work_uuid
    ORDER BY 
        CASE wa.role 
            WHEN 'primary' THEN 1 
            WHEN 'collaboration' THEN 2 
            ELSE 3 
        END;
END;
$$ LANGUAGE plpgsql;

-- Function to get all works for an artist
CREATE OR REPLACE FUNCTION get_artist_works(artist_uuid UUID)
RETURNS TABLE (
    work_id UUID,
    title TEXT,
    image_url TEXT,
    role TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        w.id,
        w.title,
        w.image_url,
        wa.role
    FROM works w
    JOIN work_artists wa ON w.id = wa.work_id
    WHERE wa.artist_id = artist_uuid AND w.published = true
    ORDER BY w.created_at DESC;
END;
$$ LANGUAGE plpgsql;
