
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODEL_ID = 'Xenova/Qwen1.5-0.5B-Chat';
const BASE_URL = `https://huggingface.co/${MODEL_ID}/resolve/main`;

const FILES_TO_DOWNLOAD = [
    'config.json',
    'tokenizer.json',
    'tokenizer_config.json',
    'generation_config.json',
    'generation_config.json',
    'onnx/model.onnx',
];

const TARGET_DIR = path.join(__dirname, '../public/models', MODEL_ID);

if (!fs.existsSync(TARGET_DIR)) {
    fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function downloadFile(filename) {
    const url = `${BASE_URL}/${filename}`;
    const dest = path.join(TARGET_DIR, filename);
    const destDir = path.dirname(dest);

    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(dest)) {
        console.log(`Skipping ${filename} (already exists)`);
        return;
    }

    console.log(`Downloading ${filename} from ${url}...`);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`Failed to download ${filename}: ${response.status} ${response.statusText}`);
            return;
        }

        const fileStream = fs.createWriteStream(dest);
        const reader = response.body.getReader();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            fileStream.write(Buffer.from(value));
        }

        fileStream.end();
        console.log(`Downloaded ${filename}`);
    } catch (error) {
        console.error(`Error downloading ${filename}:`, error.message);
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
    }
}

async function main() {
    for (const file of FILES_TO_DOWNLOAD) {
        await downloadFile(file);
    }
}

main();
