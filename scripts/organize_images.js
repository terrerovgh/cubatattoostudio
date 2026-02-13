import { readdirSync, renameSync } from 'fs';
import { join, extname } from 'path';

const galleries = [
    'src/assets/gallery/studio',
    'src/assets/gallery/david',
    'src/assets/gallery/nina',
    'src/assets/gallery/karli'
];

galleries.forEach(dir => {
    try {
        const files = readdirSync(dir).filter(f => !f.startsWith('.') && ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(f).toLowerCase()));

        // Sort to ensure deterministic order (e.g. 01.jpg comes before 01 copy.jpg usually, or we just rely on alpha)
        files.sort();

        console.log(`Processing ${dir} - ${files.length} files`);

        // We first rename to temporary names to avoid collisions (e.g. renaming 02 to 01 when 01 exists)
        files.forEach((file, index) => {
            const ext = extname(file);
            const tempName = `temp_${Date.now()}_${index}${ext}`;
            renameSync(join(dir, file), join(dir, tempName));
        });

        // Now re-read and rename to final sequence
        const tempFiles = readdirSync(dir).filter(f => f.startsWith('temp_'));
        // Sort logic might need to rely on the index embedded in temp name to preserve original sort
        // sort by index in temp name
        tempFiles.sort((a, b) => {
            const idxA = parseInt(a.split('_')[2]);
            const idxB = parseInt(b.split('_')[2]);
            return idxA - idxB;
        });

        tempFiles.forEach((file, index) => {
            const ext = extname(file);
            const newName = `${String(index + 1).padStart(2, '0')}${ext}`;
            renameSync(join(dir, file), join(dir, newName));
            console.log(`Renamed ${file} -> ${newName}`);
        });

    } catch (e) {
        console.error(`Error processing ${dir}:`, e);
    }
});
