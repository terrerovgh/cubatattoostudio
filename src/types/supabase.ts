export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            artists: {
                Row: {
                    id: string
                    user_id: string | null
                    name: string
                    slug: string
                    specialty: string
                    bio: string | null
                    avatar_url: string | null
                    portfolio_url: string | null
                    instagram: string | null
                    display_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    name: string
                    slug: string
                    specialty: string
                    bio?: string | null
                    avatar_url?: string | null
                    portfolio_url?: string | null
                    instagram?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    name?: string
                    slug?: string
                    specialty?: string
                    bio?: string | null
                    avatar_url?: string | null
                    portfolio_url?: string | null
                    instagram?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            services: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    description: string | null
                    icon: string | null
                    cover_image_url: string | null
                    before_image_url: string | null
                    after_image_url: string | null
                    display_order: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    description?: string | null
                    icon?: string | null
                    cover_image_url?: string | null
                    before_image_url?: string | null
                    after_image_url?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    description?: string | null
                    icon?: string | null
                    cover_image_url?: string | null
                    before_image_url?: string | null
                    after_image_url?: string | null
                    display_order?: number
                    is_active?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            works: {
                Row: {
                    id: string
                    artist_id: string | null
                    service_id: string | null
                    title: string | null
                    description: string | null
                    image_url: string
                    tags: string[] | null
                    featured: boolean
                    published: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    artist_id?: string | null
                    service_id?: string | null
                    title?: string | null
                    description?: string | null
                    image_url: string
                    tags?: string[] | null
                    featured?: boolean
                    published?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    artist_id?: string | null
                    service_id?: string | null
                    title?: string | null
                    description?: string | null
                    image_url?: string
                    tags?: string[] | null
                    featured?: boolean
                    published?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            site_content: {
                Row: {
                    id: string
                    section: string
                    content: Json
                    updated_at: string
                    updated_by: string | null
                }
                Insert: {
                    id?: string
                    section: string
                    content: Json
                    updated_at?: string
                    updated_by?: string | null
                }
                Update: {
                    id?: string
                    section?: string
                    content?: Json
                    updated_at?: string
                    updated_by?: string | null
                }
            }
            site_config: {
                Row: {
                    key: string
                    value: Json
                    updated_at: string
                }
                Insert: {
                    key: string
                    value: Json
                    updated_at?: string
                }
                Update: {
                    key?: string
                    value?: Json
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
