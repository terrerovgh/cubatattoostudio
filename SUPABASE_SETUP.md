# Supabase Setup Guide for Cuba Tattoo Studio

## 🚀 Quick Setup

The application is currently running in **DEVELOPMENT MODE** with a mock Supabase client. To use real data, follow these steps:

## 📋 Prerequisites

1. **Supabase Account**: Create a free account at [supabase.com](https://supabase.com)
2. **New Project**: Create a new project in your Supabase dashboard

## 🔧 Step-by-Step Configuration

### 1. Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Find your:
   - **Project URL** (format: `https://[your-project-id].supabase.co`)
   - **anon key** (starts with `eyJ`)

### 2. Update Environment Variables

Replace the placeholder values in your `.env` file:

```bash
# Before (placeholder)
PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# After (your actual credentials)
PUBLIC_SUPABASE_URL=https://abc123def.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Run Database Migrations

1. Go to your Supabase **SQL Editor**
2. Copy the contents of `supabase/migrations/002_fix_admin_dashboard.sql`
3. Run the SQL script to create all necessary tables

### 4. Configure Row Level Security (RLS)

After running the migration, enable RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Grant permissions (adjust as needed for your security requirements)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
```

## 🧪 Testing Your Setup

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Check the console**: You should see the warning messages disappear

3. **Test the admin dashboard**:
   - Navigate to `http://localhost:4321/admin`
   - Try creating, editing, and deleting artists
   - Test the works management
   - Verify content management works

## 🔍 Troubleshooting

### Common Issues

1. **"Failed to fetch" errors**: Check your Supabase URL and anon key
2. **Permission denied**: Ensure RLS policies are properly configured
3. **Table not found**: Make sure you ran the migration script
4. **CORS errors**: Add `http://localhost:4321` to your Supabase CORS settings

### Getting Help

- Check the browser console for detailed error messages
- Verify your Supabase project is active and accessible
- Ensure your network allows connections to Supabase

## 📚 Next Steps

Once your Supabase setup is complete:

1. **Set up authentication** if needed for admin access
2. **Configure storage buckets** for image uploads
3. **Add custom RLS policies** based on your security requirements
4. **Deploy to production** with proper environment variables

## 🔧 Seeds

1. Create admin user and profile:
   ```bash
   npm run seed-users
   ```
2. Migrate artists, services and works from content:
   ```bash
   npm run seed-db
   ```

## 🧪 Tests

1. Install Vitest:
   ```bash
   npm i -D vitest
   ```
2. Run tests:
   ```bash
   npm test
   ```

## 🎯 Current Status

✅ **Development Mode**: Application runs with mock data
✅ **Database Schema**: Ready for import
✅ **Form Validations**: Working perfectly
✅ **Error Handling**: Comprehensive coverage
✅ **UI/UX**: Professional interface with feedback

**Ready to connect to real Supabase data!** 🚀
