import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

// Define the structure of the booking data
interface BookingData {
    clientName: string;
    clientEmail: string;
    clientPhone?: string;
    artist?: string;
    style?: string;
    placement?: string;
    description?: string;
    images?: string[]; // Base64 strings
    selectedDate?: string;
    selectedTime?: string;
}

export const POST: APIRoute = async ({ request }) => {
    try {
        const data: BookingData = await request.json();

        if (!data.clientName || !data.clientEmail) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        // Generate a secure, unique filename
        const sanitizedName = data.clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `booking_${sanitizedName}_${timestamp}.md`;

        // Determine storage path (e.g., src/content/bookings or just a bookings folder)
        // We'll trust the implementation plan: "Save bookings as local Markdown files."
        // Let's create a 'bookings' directory in the root or src/content if it's a collection.
        // For now, let's put it in `src/bookings` so it doesn't interfere with existing content collections unless configured.
        const bookingsDir = path.resolve('./src/bookings');

        // Ensure directory exists
        try {
            await fs.access(bookingsDir);
        } catch {
            await fs.mkdir(bookingsDir, { recursive: true });
        }

        const filePath = path.join(bookingsDir, filename);

        // Construct Markdown Content
        const frontmatter = `---
type: booking
status: pending
client: "${data.clientName}"
email: "${data.clientEmail}"
phone: "${data.clientPhone || 'N/A'}"
artist: "${data.artist || 'Any'}"
style: "${data.style || 'N/A'}"
date: "${data.selectedDate || 'Unscheduled'}"
time: "${data.selectedTime || 'N/A'}"
created_at: "${new Date().toISOString()}"
---`;

        let body = `\n# Booking Request: ${data.clientName}\n\n`;
        body += `## Project Details\n`;
        body += `- **Placement**: ${data.placement || 'Not specified'}\n`;
        body += `- **Description**: ${data.description || 'No description provided'}\n\n`;

        // Embed Images
        if (data.images && data.images.length > 0) {
            body += `## References\n`;
            data.images.forEach((img, index) => {
                // Check if it's already a full data URI or just base64
                // Assuming the frontend sends full data URI (e.g. "data:image/png;base64,...")
                // Markdown usually requires an external file, but we can try embedding base64 directly in an img tag for portability
                // or we could save the image files separately. The prompt said: "las imagenes en base64 en los propios md".
                body += `\n### Image ${index + 1}\n`;
                body += `<img src="${img}" alt="Reference ${index + 1}" width="300" />\n`;
            });
        }

        const fileContent = `${frontmatter}${body}`;

        await fs.writeFile(filePath, fileContent, 'utf-8');

        return new Response(JSON.stringify({
            success: true,
            message: 'Booking saved successfully',
            dossierId: filename,
            calendarUrl: data.artist ? `/${data.artist.toLowerCase().replace(' ', '-')}/calendar` : '/calendar'
        }), { status: 200 });

    } catch (error) {
        console.error('Error saving booking:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
