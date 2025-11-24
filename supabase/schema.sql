-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== TABLES ====================

-- Artists Table
CREATE TABLE artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    specialty TEXT NOT NULL,
    bio TEXT,
    avatar_url TEXT,
    portfolio_url TEXT,
    instagram TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services Table
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon TEXT,
    cover_image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Works Table
CREATE TABLE works (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES artists(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    tags TEXT[],
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Content Table
CREATE TABLE site_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    section TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES auth.users(id)
);

-- Site Config Table
CREATE TABLE site_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== INDEXES ====================

CREATE INDEX idx_artists_active ON artists(is_active) WHERE is_active = true;
CREATE INDEX idx_artists_display_order ON artists(display_order);
CREATE INDEX idx_works_artist ON works(artist_id);
CREATE INDEX idx_works_published ON works(published) WHERE published = true;
CREATE INDEX idx_works_tags ON works USING GIN(tags);

-- ==================== TRIGGERS ====================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_artists_updated_at BEFORE UPDATE ON artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== ROW LEVEL SECURITY (RLS) ====================

ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- ARTISTS POLICIES
CREATE POLICY "Artistas activos visibles públicamente"
    ON artists FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Artistas pueden ver su propio perfil"
    ON artists FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Artistas pueden actualizar su perfil"
    ON artists FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Solo admins pueden crear artistas"
    ON artists FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Solo admins pueden eliminar artistas"
    ON artists FOR DELETE TO authenticated USING (auth.jwt() ->> 'role' = 'admin');

-- WORKS POLICIES
CREATE POLICY "Trabajos publicados visibles públicamente"
    ON works FOR SELECT TO public USING (published = true);

CREATE POLICY "Artistas pueden ver sus trabajos"
    ON works FOR SELECT TO authenticated USING (
        artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
    );

CREATE POLICY "Artistas pueden crear trabajos"
    ON works FOR INSERT TO authenticated WITH CHECK (
        artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()) OR auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Artistas pueden actualizar sus trabajos"
    ON works FOR UPDATE TO authenticated USING (
        artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()) OR auth.jwt() ->> 'role' = 'admin'
    );

CREATE POLICY "Artistas pueden eliminar sus trabajos"
    ON works FOR DELETE TO authenticated USING (
        artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid()) OR auth.jwt() ->> 'role' = 'admin'
    );

-- SERVICES POLICIES
CREATE POLICY "Servicios activos visibles públicamente"
    ON services FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Solo admins pueden gestionar servicios"
    ON services FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin') WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- SITE CONTENT POLICIES
CREATE POLICY "Contenido visible públicamente"
    ON site_content FOR SELECT TO public USING (true);

CREATE POLICY "Solo admins pueden editar contenido"
    ON site_content FOR ALL TO authenticated USING (auth.jwt() ->> 'role' = 'admin') WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- ==================== STORAGE ====================

-- Note: Buckets must be created via Dashboard or API if not using Supabase CLI with migration support for storage.
-- The following inserts might work if the storage schema is exposed, but usually it's better to do this in the dashboard.
-- INSERT INTO storage.buckets (id, name, public) VALUES 
--     ('avatars', 'avatars', true),
--     ('works', 'works', true),
--     ('site-assets', 'site-assets', true)
-- ON CONFLICT DO NOTHING;

-- STORAGE POLICIES
-- Avatars
CREATE POLICY "Avatares públicos"
    ON storage.objects FOR SELECT TO public USING (bucket_id = 'avatars');

CREATE POLICY "Usuarios autenticados pueden subir avatares"
    ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'avatars');

-- Works
CREATE POLICY "Trabajos públicos"
    ON storage.objects FOR SELECT TO public USING (bucket_id = 'works');

CREATE POLICY "Artistas pueden subir trabajos"
    ON storage.objects FOR INSERT TO authenticated WITH CHECK (
        bucket_id = 'works' AND (
            auth.uid() IN (SELECT user_id FROM artists) OR
            auth.jwt() ->> 'role' = 'admin'
        )
    );
