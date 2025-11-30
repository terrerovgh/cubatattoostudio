# Admin Dashboard

The Admin Dashboard is the control center for the Cuba Tattoo Studio website. It allows authorized users to manage content, artists, and settings.

## Access
- URL: `/admin`
- Requirement: Authenticated user with Admin privileges.

## Features

### 1. Dashboard Overview
- **Stats**: View key metrics like total artists, active works, and total services.
- **Charts**: Visual representation of activity and content distribution.

### 2. Artist Management (`/admin/artists`)
- **List View**: See all artists, their status (active/inactive), and display order.
- **Create/Edit**:
    - Upload avatar.
    - Edit name, bio, specialty.
    - Set social media links.
    - Toggle visibility.

### 3. Works (Portfolio) Management (`/admin/works`)
- **Gallery View**: View all uploaded tattoo works.
- **Upload**: Drag and drop interface for uploading new images.
- **Details**:
    - Assign to an Artist.
    - Assign to a Service/Style.
    - Add tags.
    - Toggle `published` and `featured` status.

### 4. Services Management (`/admin/services`)
- Manage the tattoo styles offered (e.g., Realism, Fine Line).
- Edit descriptions, icons, and cover images.

### 5. Content Editor (`/admin/content`)
- Edit static content for sections like "Hero", "About", and "Contact".
- Updates are saved to the `site_content` table and reflected immediately on the site.

### 6. Visual Editor (`/admin/editor`)
- A drag-and-drop interface for building or modifying page layouts.
- Allows selecting components and arranging them visually.

## Technical Implementation
- Built with **React** and **Shadcn UI**.
- Uses **Supabase Client** for all data fetching and mutations.
- **React Query** (or similar caching, if used) helps with state synchronization.
- **Zustand** is used for complex local state in the Visual Editor.
