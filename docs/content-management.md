# Content Management

The website's content is dynamic and managed through the Admin Dashboard, stored in Supabase.

## Structured Content
Structured data entities are managed via dedicated tables:
- **Artists**: Managed in the Artists section.
- **Works**: Managed in the Works/Gallery section.
- **Services**: Managed in the Services section.

## Unstructured/Semi-structured Content
Page content (text, headings, images for specific sections) is stored in the `site_content` table.

### `site_content` Structure
Each row represents a section of the website.
- `section`: The identifier (e.g., `hero`).
- `content`: A JSON object containing the fields for that section.

**Example (Hero Section):**
```json
{
  "title": "Cuba Tattoo Studio",
  "subtitle": "Where precision meets permanence",
  "ctaText": "Meet Our Artists",
  "backgroundImage": "url_to_image"
}
```

## Media Management
Images are stored in Supabase Storage.
- **Uploads**: Handled via the dashboard.
- **Optimization**: Images should be optimized before upload or via Supabase's image transformation features (if enabled).
- **References**: The database stores the public URL of the image.

## Updating Content
1.  Log in to the Admin Dashboard.
2.  Navigate to "Content" or the specific entity section.
3.  Make changes in the form/editor.
4.  Click "Save".
5.  Changes are immediately available via the API.
    - *Note*: If the site uses Static Site Generation (SSG) for some parts, a rebuild might be triggered (depending on the specific deployment hook setup), but currently, the site fetches data client-side or at request time, ensuring instant updates.
