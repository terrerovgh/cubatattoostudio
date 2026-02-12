/**
 * Instagram Feed Fetcher — RapidAPI (instagram120) Edition
 *
 * Fetches posts from @cubatattoostudio via
 * POST https://instagram120.p.rapidapi.com/api/instagram/posts
 *
 * Since cubatattoostudio reposts content from its artists, we extract
 * all posts from the studio feed and attribute them to artists based
 * on the user.username field in each post.
 *
 * Downloads images to public/gallery/{artist}/ with deterministic names,
 * and writes src/data/instagram.json with the structured data.
 *
 * Environment variables:
 *   INSTAGRAM_RAPIDAPI_KEY  — Your RapidAPI key (required)
 *
 * Usage:
 *   node scripts/fetch-insta.js
 *
 * Directory structure created:
 *   public/gallery/studio/   — all posts from @cubatattoostudio
 *   public/gallery/david/    — posts by @david_guzman_tattoo
 *   public/gallery/nina/     — posts by @goodnina_tattooing
 *   public/gallery/karli/    — posts by @karlii_castillo_tattoos
 *   public/artists/david.jpg — profile picture
 *   public/artists/nina.jpg  — profile picture
 *   public/artists/karli.jpg — profile picture
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Configuration ─────────────────────────────────────────
const RAPIDAPI_HOST = 'instagram120.p.rapidapi.com';
const API_URL = `https://${RAPIDAPI_HOST}/api/instagram/posts`;

// The studio account — all posts come from here
const STUDIO_USERNAME = 'cubatattoostudio';

// Map Instagram usernames to local artist folders
// The studio account reposts from these artists
const ARTIST_MAP = {
  david_guzman_tattoo: 'david',
  goodnina_tattooing: 'nina',
  karlii_castillo_tattoos: 'karli',
};

const ALL_FOLDERS = ['studio', 'david', 'nina', 'karli'];

const POSTS_PER_ARTIST = 6;
const OUTPUT_JSON = resolve(__dirname, '../src/data/instagram.json');
const PUBLIC_DIR = resolve(__dirname, '../public');
const GALLERY_DIR = resolve(PUBLIC_DIR, 'gallery');
const ARTISTS_DIR = resolve(PUBLIC_DIR, 'artists');

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

// ─── Instagram120 API ─────────────────────────────────────

/**
 * Fetch posts from a user via POST /api/instagram/posts
 * Returns the raw nodes array from the API response.
 */
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

  // API returns { result: { edges: [{ node: { ... } }] } }
  const edges = json?.result?.edges;
  if (!edges || !Array.isArray(edges)) {
    console.log(
      '  [warn] Unexpected response structure:',
      JSON.stringify(json).slice(0, 200),
    );
    return [];
  }

  return edges.map((e) => e.node).filter(Boolean);
}

/**
 * Extract the best image URL from a node.
 * Works for both image posts (media_type 1) and video posts (media_type 2),
 * since video posts also have image_versions2 with thumbnail images.
 */
function getImageUrl(node) {
  if (node.image_versions2?.candidates?.length > 0) {
    return node.image_versions2.candidates[0].url;
  }
  if (node.display_url) return node.display_url;
  if (node.thumbnail_url) return node.thumbnail_url;
  return '';
}

/**
 * Extract image URL from a carousel item
 */
function getCarouselImageUrl(item) {
  if (item.image_versions2?.candidates?.length > 0) {
    return item.image_versions2.candidates[0].url;
  }
  if (item.display_url) return item.display_url;
  return '';
}

/**
 * Extract caption text
 */
function getCaption(node) {
  if (node.caption?.text) return node.caption.text;
  if (typeof node.caption === 'string') return node.caption;
  return '';
}

/**
 * Process raw nodes into normalized post objects.
 * Uses thumbnails for video posts so they work in the gallery.
 */
function processAllPosts(nodes) {
  const posts = [];

  for (const node of nodes) {
    let imageUrl = '';

    // Carousel (media_type 8) — pick the first image
    if (node.media_type === 8 && node.carousel_media?.length > 0) {
      for (const item of node.carousel_media) {
        const url = getCarouselImageUrl(item);
        if (url) {
          imageUrl = url;
          break;
        }
      }
    }

    // Regular image or video thumbnail
    if (!imageUrl) {
      imageUrl = getImageUrl(node);
    }

    if (!imageUrl) continue;

    // Determine which artist this post belongs to
    const username = node.user?.username || '';
    const artistFolder = ARTIST_MAP[username] || 'studio';

    posts.push({
      id: node.pk || node.id || `post-${posts.length}`,
      imageUrl,
      caption: getCaption(node),
      permalink: node.code
        ? `https://www.instagram.com/p/${node.code}/`
        : '',
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

  if (!apiKey) {
    console.log(
      '[instagram] No INSTAGRAM_RAPIDAPI_KEY found — using cached/empty data',
    );
    ensureFallback();
    return;
  }

  console.log('[instagram] Starting fetch via instagram120.p.rapidapi.com...\n');

  // Ensure directories
  ensureDir(GALLERY_DIR);
  ensureDir(ARTISTS_DIR);
  ALL_FOLDERS.forEach((f) => ensureDir(resolve(GALLERY_DIR, f)));

  // 1. Fetch all posts from the studio account
  console.log(`[instagram] Fetching @${STUDIO_USERNAME}...`);
  const nodes = await fetchPostsRaw(STUDIO_USERNAME);
  console.log(`  Received ${nodes.length} nodes from API\n`);

  // 2. Process all posts and attribute to artists
  const allPosts = processAllPosts(nodes);
  console.log(`[instagram] Processed ${allPosts.length} total posts\n`);

  // 3. Group posts by artist folder
  const postsByArtist = {};
  for (const folder of ALL_FOLDERS) {
    postsByArtist[folder] = [];
  }
  for (const post of allPosts) {
    const folder = post.artistFolder;
    if (!postsByArtist[folder]) postsByArtist[folder] = [];
    postsByArtist[folder].push(post);
  }

  // Log distribution
  for (const [folder, posts] of Object.entries(postsByArtist)) {
    console.log(`  ${folder}: ${posts.length} posts`);
  }
  console.log();

  // 4. Collect unique artist profiles from post data
  const artistProfiles = {};
  for (const post of allPosts) {
    const folder = post.artistFolder;
    if (folder !== 'studio' && !artistProfiles[folder] && post.user.username) {
      artistProfiles[folder] = {
        username: post.user.username,
        fullName: post.user.fullName,
        profilePicUrl: post.user.profilePicUrl,
        localProfilePic: null,
      };
    }
  }

  // 5. Download artist profile pictures
  for (const [folder, profile] of Object.entries(artistProfiles)) {
    if (profile.profilePicUrl) {
      const profileDest = resolve(ARTISTS_DIR, `${folder}.jpg`);
      console.log(
        `[instagram] Downloading profile pic @${profile.username} → /artists/${folder}.jpg`,
      );
      const downloaded = await downloadImage(
        profile.profilePicUrl,
        profileDest,
      );
      if (downloaded) {
        profile.localProfilePic = `/artists/${folder}.jpg`;
      }
      await sleep(300);
    }
  }
  console.log();

  // 6. Download post images (up to POSTS_PER_ARTIST per folder)
  const result = {
    studio: { profile: null, posts: [] },
    artists: {},
    lastFetched: new Date().toISOString(),
  };

  for (const folder of ALL_FOLDERS) {
    const posts = (postsByArtist[folder] || []).slice(0, POSTS_PER_ARTIST);
    const localPosts = [];

    console.log(
      `[instagram] Downloading ${posts.length} images for "${folder}"...`,
    );

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const num = String(i + 1).padStart(2, '0');
      const filename = `${num}.jpg`;
      const destPath = resolve(GALLERY_DIR, folder, filename);
      const publicPath = `/gallery/${folder}/${filename}`;

      console.log(`  [${num}] → ${publicPath}`);
      const downloaded = await downloadImage(post.imageUrl, destPath);

      localPosts.push({
        id: post.id,
        imageUrl: downloaded ? publicPath : post.imageUrl,
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

    console.log(`  ✓ ${folder} done\n`);
  }

  // 7. Build flat posts array for backward-compatible gallery
  const flatPosts = [
    ...result.studio.posts,
    ...Object.values(result.artists).flatMap((a) => a.posts),
  ];

  // 8. Write output JSON
  const output = {
    posts: flatPosts,
    studio: result.studio,
    artists: result.artists,
    lastFetched: result.lastFetched,
  };

  writeFileSync(OUTPUT_JSON, JSON.stringify(output, null, 2));
  console.log(
    `[instagram] Wrote ${flatPosts.length} total posts → ${OUTPUT_JSON}`,
  );
  console.log('[instagram] Done!\n');
}

function ensureFallback() {
  if (existsSync(OUTPUT_JSON)) {
    try {
      const existing = readFileSync(OUTPUT_JSON, 'utf-8');
      const data = JSON.parse(existing);
      if (data.posts && data.posts.length > 0) {
        console.log(
          `[instagram] Using cached data (${data.posts.length} posts)`,
        );
        return;
      }
    } catch {
      // Corrupted JSON, overwrite
    }
  }

  const fallback = {
    posts: [],
    studio: { profile: null, posts: [] },
    artists: {},
    lastFetched: null,
  };
  writeFileSync(OUTPUT_JSON, JSON.stringify(fallback, null, 2));
  console.log('[instagram] Wrote empty fallback data');
}

main().catch((err) => {
  console.error(`[instagram] Fatal error: ${err.message}`);
  ensureFallback();
  process.exit(0); // Don't break the build
});
