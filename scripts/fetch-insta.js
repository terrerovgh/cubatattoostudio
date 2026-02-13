/**
 * Instagram Feed Fetcher — RapidAPI (instagram120) Edition
 *
 * Fetches posts from @cubatattoostudio via
 * POST https://instagram120.p.rapidapi.com/api/instagram/posts
 *
 * Downloads images to src/assets/gallery/{artist}/ and src/assets/artists/
 * and generates src/data/instagram.ts with static imports for Astro optimization.
 *
 * Environment variables:
 *   INSTAGRAM_RAPIDAPI_KEY  — Your RapidAPI key (required)
 *
 * Usage:
 *   node scripts/fetch-insta.js
 */

import { writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync, statSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Configuration ─────────────────────────────────────────
const RAPIDAPI_HOST = 'instagram120.p.rapidapi.com';
const API_URL = `https://${RAPIDAPI_HOST}/api/instagram/posts`;

const STUDIO_USERNAME = 'cubatattoostudio';

const ARTIST_MAP = {
  david_guzman_tattoo: 'david',
  goodnina_tattooing: 'nina',
  karlii_castillo_tattoos: 'karli',
};

const ALL_FOLDERS = ['studio', 'david', 'nina', 'karli'];

const POSTS_PER_ARTIST = 24;
const SRC_DIR = resolve(__dirname, '../src');
const OUTPUT_TS = resolve(SRC_DIR, 'data/instagram.ts');
const ASSETS_DIR = resolve(SRC_DIR, 'assets');
const GALLERY_DIR = resolve(ASSETS_DIR, 'gallery');
const ARTISTS_DIR = resolve(ASSETS_DIR, 'artists');
const PUBLIC_DIR = resolve(__dirname, '../public');

// ─── Helpers ───────────────────────────────────────────────

function ensureDir(dir) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(url, options, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 429 && i < retries) {
        console.log('  [rate-limit] Waiting 3s before retry...');
        await sleep(3000);
        continue;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (err) {
      if (i === retries) throw err;
      console.log(`  [retry] Attempt ${i + 2}/${retries + 1}...`);
      await sleep(1000);
    }
  }
}

// ─── Instagram API ────────────────────────────────────────

async function fetchPostsRaw(username) {
  const res = await fetchWithRetry(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': RAPIDAPI_HOST,
      'X-RapidAPI-Key': process.env.INSTAGRAM_RAPIDAPI_KEY,
    },
    body: JSON.stringify({ username, maxId: '' }),
  });

  const json = await res.json();
  const edges = json?.result?.edges;

  if (!edges || !Array.isArray(edges)) {
    console.log('  [warn] Unexpected response structure');
    return [];
  }

  return edges.map((e) => e.node).filter(Boolean);
}

function getImageUrl(node) {
  if (node.image_versions2?.candidates?.length > 0) {
    return node.image_versions2.candidates[0].url;
  }
  if (node.display_url) return node.display_url;
  if (node.thumbnail_url) return node.thumbnail_url;
  return '';
}

function getCarouselImageUrl(item) {
  if (item.image_versions2?.candidates?.length > 0) {
    return item.image_versions2.candidates[0].url;
  }
  if (item.display_url) return item.display_url;
  return '';
}

function getCaption(node) {
  if (node.caption?.text) return node.caption.text;
  if (typeof node.caption === 'string') return node.caption;
  return '';
}

function processAllPosts(nodes, forcedFolder = null) {
  const posts = [];

  for (const node of nodes) {
    let imageUrl = '';

    if (node.media_type === 8 && node.carousel_media?.length > 0) {
      for (const item of node.carousel_media) {
        const url = getCarouselImageUrl(item);
        if (url) {
          imageUrl = url;
          break;
        }
      }
    }

    if (!imageUrl) imageUrl = getImageUrl(node);
    if (!imageUrl) continue;

    const username = node.user?.username || '';
    // If we passed a specific folder (artist), use it. Otherwise, try to map from username (legacy logic)
    const artistFolder = forcedFolder || ARTIST_MAP[username] || 'studio';

    posts.push({
      id: node.pk || node.id || `post-${posts.length}`,
      imageUrl,
      caption: getCaption(node),
      permalink: node.code ? `https://www.instagram.com/p/${node.code}/` : '',
      timestamp: node.taken_at || '',
      artistFolder,
      user: {
        username,
        fullName: node.user?.full_name || username,
        profilePicUrl: node.user?.profile_pic_url || '',
      },
    });
  }

  return posts;
}

// ─── Image Downloader ──────────────────────────────────────

async function downloadImage(imageUrl, destPath) {
  try {
    const res = await fetchWithRetry(imageUrl, {}, 1);
    const buffer = Buffer.from(await res.arrayBuffer());
    writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`    [download] Failed: ${err.message}`);
    return false;
  }
}

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.INSTAGRAM_RAPIDAPI_KEY;

  // Ensure directories
  ensureDir(GALLERY_DIR);
  ensureDir(ARTISTS_DIR);
  ALL_FOLDERS.forEach((f) => ensureDir(resolve(GALLERY_DIR, f)));

  let result = {
    studio: { profile: null, posts: [] },
    artists: {},
    lastFetched: new Date().toISOString(),
  };

  // Data for generating imports
  const imports = []; // { name: string, path: string }

  if (!apiKey) {
    console.log('[instagram] No INSTAGRAM_RAPIDAPI_KEY found — using local fallback...');
    runLocalFallback();
    return;
  }

  console.log('[instagram] Starting fetch via instagram120.p.rapidapi.com...\n');

  // 1. Fetch & Process for EACH artist + studio
  const postsByArtist = {};
  const artistProfiles = {};

  // Initialize arrays
  for (const folder of ALL_FOLDERS) {
    postsByArtist[folder] = [];
  }

  // Iterate over all mapped users (including studio if mapped, though studio is usually special)
  // Our ARTIST_MAP maps instagram_username -> folder_name
  // We also want to fetch the studio account: 'cubatattoostudio' -> 'studio'

  const ACCOUNTS_TO_FETCH = [
    { username: STUDIO_USERNAME, folder: 'studio' },
    ...Object.entries(ARTIST_MAP).map(([username, folder]) => ({ username, folder }))
  ];

  for (const { username, folder } of ACCOUNTS_TO_FETCH) {
    console.log(`[instagram] Fetching @${username} (${folder})...`);
    try {
      const nodes = await fetchPostsRaw(username);

      // Process nodes to standard format
      const posts = processAllPosts(nodes, folder); // Modified processAllPosts to take folder override

      // Add to collection
      postsByArtist[folder].push(...posts);

      // Extract profile info from the first valid post if available
      if (posts.length > 0 && !artistProfiles[folder]) {
        const p = posts[0];
        artistProfiles[folder] = {
          username: p.user.username,
          fullName: p.user.fullName,
          profilePicUrl: p.user.profilePicUrl,
          localProfilePic: null,
        };
      }
    } catch (err) {
      console.error(`  [error] Failed to fetch ${username}: ${err.message}`);
    }

    await sleep(2000); // Be nice to API
  }

  // 2. Download Profiles
  for (const [folder, profile] of Object.entries(artistProfiles)) {
    if (profile && profile.profilePicUrl) {
      const filename = `${folder}.jpg`;
      const destPath = resolve(ARTISTS_DIR, filename);
      console.log(`[instagram] Profile pic: ${folder}`);

      const downloaded = await downloadImage(profile.profilePicUrl, destPath);
      if (downloaded) {
        const importName = `profile_${folder}`;
        imports.push({ name: importName, path: `../assets/artists/${filename}` });
        profile.localProfilePic = importName;
      }
    }
  }

  // 3. Download Posts & Build Result
  for (const folder of ALL_FOLDERS) {
    // Take top N posts
    const posts = (postsByArtist[folder] || []).slice(0, POSTS_PER_ARTIST);
    const localPosts = [];

    console.log(`[instagram] Downloading images for "${folder}"...`);

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      // Use original ID if possible to avoid dupes, but standardized filename
      const num = String(i + 1).padStart(2, '0');
      const filename = `${num}.jpg`;
      const destPath = resolve(GALLERY_DIR, folder, filename);

      const downloaded = await downloadImage(post.imageUrl, destPath);
      const importName = `img_${folder}_${num}`;

      if (downloaded) {
        imports.push({ name: importName, path: `../assets/gallery/${folder}/${filename}` });
      }

      localPosts.push({
        id: post.id,
        imageUrl: downloaded ? importName : post.imageUrl,
        caption: post.caption,
        permalink: post.permalink,
        artist: folder,
        isLocal: downloaded,
      });

      if (i < posts.length - 1) await sleep(300);
    }

    if (folder === 'studio') {
      result.studio = { profile: null, posts: localPosts };
    } else {
      result.artists[folder] = {
        profile: artistProfiles[folder] || null,
        posts: localPosts,
      };
    }
  }

  const flatPosts = [
    ...result.studio.posts,
    ...Object.values(result.artists).flatMap((a) => a.posts),
  ];

  writeTsOutput(flatPosts, result, imports);
  console.log('[instagram] Done!\n');
}

function writeTsOutput(flatPosts, result, imports) {
  let content = `// @ts-nocheck
// This file is auto-generated by scripts/fetch-insta.js
// Do not edit manually

`;

  // Write imports
  imports.forEach(({ name, path }) => {
    content += `import ${name} from '${path}';\n`;
  });

  content += `\nexport interface Post {
  id: string;
  imageUrl: ImageMetadata | string;
  caption?: string;
  permalink?: string;
  artist?: string;
  isLocal?: boolean;
}

export interface ArtistData {
  profile: {
    username?: string;
    fullName?: string;
    localProfilePic?: ImageMetadata | string;
  } | null;
  posts: Post[];
}

export interface InstagramData {
  posts: Post[];
  studio?: { profile: ArtistData['profile']; posts: Post[] };
  artists?: Record<string, ArtistData>;
  lastFetched?: string;
}
`;

  // Helper to stringify but keep specific values as raw variables
  const stringifyWithVars = (obj) => {
    // 1. Replace variables with unique placeholders
    const replacements = {};

    // Recursive function to find values that match import names
    const traverse = (o) => {
      if (!o) return;
      if (typeof o === 'object') {
        for (const k in o) {
          const val = o[k];
          if ((k === 'imageUrl' || k === 'localProfilePic') && typeof val === 'string') {
            // Check if this value is one of our import names
            if (imports.some(imp => imp.name === val)) {
              const token = `__VAR_${val}__`;
              replacements[token] = val;
              o[k] = token;
            }
          } else {
            traverse(val);
          }
        }
      }
    };

    const clone = JSON.parse(JSON.stringify(obj));
    traverse(clone);

    let json = JSON.stringify(clone, null, 2);

    for (const [token, varName] of Object.entries(replacements)) {
      // Replace "token" with varName (unquoted)
      json = json.split(`"${token}"`).join(varName);
    }

    return json;
  };

  const data = {
    posts: flatPosts,
    studio: result.studio,
    artists: result.artists,
    lastFetched: result.lastFetched,
  };

  content += `\nconst instagramData: InstagramData = ${stringifyWithVars(data)};\n\nexport default instagramData;\n`;

  writeFileSync(OUTPUT_TS, content);
  console.log(`[instagram] Wrote ${flatPosts.length} posts to src/data/instagram.ts`);
}

function runLocalFallback() {
  // 1. Check if src/assets/gallery already has images (preferred source)
  // We check 'studio' folder specifically to see if it has content
  const studioDir = resolve(GALLERY_DIR, 'studio');
  const hasSrcImages = existsSync(studioDir) && readdirSync(studioDir).some(f => f.match(/\.(jpg|jpeg|png|webp)$/i));

  // 2. Check public/gallery (legacy source)
  const publicGallery = resolve(PUBLIC_DIR, 'gallery');
  const hasPublicImages = existsSync(publicGallery);

  if (!hasSrcImages && !hasPublicImages) {
    console.log('[instagram] No local images found for fallback. Generating empty data.');
    writeTsOutput([], { studio: { posts: [] }, artists: {} }, []);
    return;
  }

  const sourceDir = hasSrcImages ? GALLERY_DIR : publicGallery;
  console.log(`[instagram] Using local files from ${hasSrcImages ? 'src/assets' : 'public'} for fallback...`);

  const imports = [];
  const flatPosts = [];
  const result = {
    studio: { profile: null, posts: [] },
    artists: {},
    lastFetched: new Date().toISOString(),
  };

  // Process folders
  for (const folder of ALL_FOLDERS) {
    const srcFolder = resolve(sourceDir, folder);
    if (!existsSync(srcFolder)) continue;

    // In src mode, we just read. In public mode, we copy to src.
    if (!hasSrcImages) {
      ensureDir(resolve(GALLERY_DIR, folder));
    }

    const files = readdirSync(srcFolder).filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
    const localPosts = [];

    files.forEach((file, index) => {
      const srcFile = resolve(srcFolder, file);
      const destFile = resolve(GALLERY_DIR, folder, file);

      if (!hasSrcImages) {
        copyFileSync(srcFile, destFile);
      }

      const cleanName = file.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
      const importName = `img_${folder}_${cleanName}`;

      imports.push({ name: importName, path: `../assets/gallery/${folder}/${file}` });

      localPosts.push({
        id: `local-${folder}-${index}`,
        imageUrl: importName,
        caption: 'Local fallback image',
        permalink: '',
        artist: folder,
        isLocal: true,
      });
    });

    if (folder === 'studio') {
      result.studio = { profile: null, posts: localPosts };
    } else {
      // Profile pic logic
      let profilePicVar = null;
      const profilePicName = `${folder}.jpg`;

      // Look for profile pic in source artists dir
      const srcArtistsDir = hasSrcImages ? ARTISTS_DIR : resolve(PUBLIC_DIR, 'artists');
      const srcProfile = resolve(srcArtistsDir, profilePicName);

      if (existsSync(srcProfile)) {
        if (!hasSrcImages) {
          ensureDir(ARTISTS_DIR);
          copyFileSync(srcProfile, resolve(ARTISTS_DIR, profilePicName));
        }

        const importName = `profile_${folder}`;
        imports.push({ name: importName, path: `../assets/artists/${profilePicName}` });
        profilePicVar = importName;
      }

      result.artists[folder] = {
        profile: {
          username: `${folder}_fallback`,
          fullName: `${folder} Fallback`,
          localProfilePic: profilePicVar
        },
        posts: localPosts,
      };
    }

    flatPosts.push(...localPosts);
    console.log(`  Processed ${localPosts.length} images for ${folder}`);
  }

  writeTsOutput(flatPosts, result, imports);
}

main().catch((err) => {
  console.error(`[instagram] Fatal error: ${err.message}`);
  process.exit(0);
});
