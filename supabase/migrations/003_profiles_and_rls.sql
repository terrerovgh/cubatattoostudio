-- Profiles table and robust RLS policies based on profiles
-- Created: 2025-11-23

-- ==================== PROFILES ====================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin','artist','viewer')),
    display_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Trigger to update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Own profile read" ON profiles FOR SELECT TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Own profile update" ON profiles FOR UPDATE TO authenticated
    USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Admins manage profiles" ON profiles FOR ALL TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
    WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- ==================== REINSTATE ROBUST POLICIES ====================
-- Drop simplified dev policies from migration 002 and apply robust ones

-- Artists
DROP POLICY IF EXISTS "Artists visible to all" ON artists;
DROP POLICY IF EXISTS "Authenticated users can manage artists" ON artists;

CREATE POLICY "Artistas activos visibles públicamente"
    ON artists FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Artistas pueden ver su propio perfil"
    ON artists FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Artistas pueden actualizar su perfil"
    ON artists FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Solo admins pueden crear artistas"
    ON artists FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

CREATE POLICY "Solo admins pueden eliminar artistas"
    ON artists FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Works
DROP POLICY IF EXISTS "Works visible to all" ON works;
DROP POLICY IF EXISTS "Authenticated users can manage works" ON works;

CREATE POLICY "Trabajos publicados visibles públicamente"
    ON works FOR SELECT TO public USING (published = true);

CREATE POLICY "Artistas pueden ver sus trabajos"
    ON works FOR SELECT TO authenticated USING (
        artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
    );

CREATE POLICY "Artistas pueden crear trabajos"
    ON works FOR INSERT TO authenticated WITH CHECK (
        artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    );

CREATE POLICY "Artistas pueden actualizar sus trabajos"
    ON works FOR UPDATE TO authenticated USING (
        artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    );

CREATE POLICY "Artistas pueden eliminar sus trabajos"
    ON works FOR DELETE TO authenticated USING (
        artist_id IN (SELECT id FROM artists WHERE user_id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    );

-- Services
DROP POLICY IF EXISTS "Services visible to all" ON services;
DROP POLICY IF EXISTS "Authenticated users can manage services" ON services;

CREATE POLICY "Servicios activos visibles públicamente"
    ON services FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Solo admins pueden gestionar servicios"
    ON services FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    );

-- Site content
DROP POLICY IF EXISTS "Content visible to all" ON site_content;
DROP POLICY IF EXISTS "Authenticated users can manage content" ON site_content;

CREATE POLICY "Contenido visible públicamente"
    ON site_content FOR SELECT TO public USING (true);

CREATE POLICY "Solo admins pueden editar contenido"
    ON site_content FOR ALL TO authenticated USING (
        EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    ) WITH CHECK (
        EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
    );

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_artists_slug ON artists(slug);
CREATE INDEX IF NOT EXISTS idx_works_created ON works(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_content_section ON site_content(section);

