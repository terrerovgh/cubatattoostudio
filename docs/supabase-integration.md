# Supabase Integration

This document details the database schema, storage configuration, and security policies used in the project.

## Database Schema

The database consists of the following main tables:

### `artists`
Stores information about the tattoo artists.
- `id`: UUID (Primary Key)
- `user_id`: UUID (References `auth.users`)
- `name`: Text
- `slug`: Text (Unique)
- `specialty`: Text
- `bio`: Text
- `avatar_url`: Text
- `portfolio_url`: Text
- `instagram`: Text
- `display_order`: Integer
- `is_active`: Boolean

### `services`
Stores the tattoo styles/disciplines offered.
- `id`: UUID (Primary Key)
- `title`: Text
- `slug`: Text (Unique)
- `description`: Text
- `icon`: Text
- `cover_image_url`: Text
- `display_order`: Integer
- `is_active`: Boolean

### `works`
Stores the portfolio of tattoo images.
- `id`: UUID (Primary Key)
- `artist_id`: UUID (References `artists.id`)
- `service_id`: UUID (References `services.id`)
- `title`: Text
- `description`: Text
- `image_url`: Text
- `tags`: Text Array
- `featured`: Boolean
- `published`: Boolean

### `site_content`
Stores dynamic content for various site sections.
- `id`: UUID (Primary Key)
- `section`: Text (Unique, e.g., 'hero', 'about')
- `content`: JSONB (Flexible content structure)
- `updated_by`: UUID (References `auth.users`)

### `site_config`
Stores global configuration settings.
- `key`: Text (Primary Key)
- `value`: JSONB

## Row Level Security (RLS) Policies

RLS is enabled on all tables to ensure data security.

### Public Access
- **Read Access**: Public users (unauthenticated) can view:
    - Active artists (`is_active = true`)
    - Active services (`is_active = true`)
    - Published works (`published = true`)
    - Site content and config.

### Authenticated Access
- **Artists**:
    - Can view their own profile and works.
    - Can update their own profile.
    - Can create, update, and delete their own works.
- **Admins**:
    - Have full CRUD access to all tables (`artists`, `services`, `works`, `site_content`, `site_config`).

## Storage Buckets

### `avatars`
- Stores artist profile pictures.
- **Public**: Read access.
- **Authenticated**: Upload access for users (for their own avatar) and admins.

### `works`
- Stores tattoo portfolio images.
- **Public**: Read access.
- **Authenticated**: Upload access for artists (for their own works) and admins.

### `site-assets`
- Stores general site images (logos, backgrounds).
- **Public**: Read access.
- **Authenticated**: Upload access for admins only.
