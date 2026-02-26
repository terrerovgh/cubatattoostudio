// Usage: npx tsx scripts/seed-admin.ts [email] [password] [display_name]
//
// Generates an INSERT SQL statement for creating the initial admin user.
// Uses PBKDF2-SHA256 with 100k iterations and 16-byte salt (matching src/lib/auth.ts).
//
// Example:
//   npx tsx scripts/seed-admin.ts admin@cubatattoostudio.com MySecurePass123 "Studio Admin"
//   npx tsx scripts/seed-admin.ts | wrangler d1 execute cubatattoostudio-db --command="..."

import { randomBytes, pbkdf2Sync } from 'node:crypto';

const PBKDF2_ITERATIONS = 100_000;
const SALT_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

function bufferToHex(buffer: Buffer): string {
  return buffer.toString('hex');
}

function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(SALT_LENGTH);
  const derived = pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');
  return {
    hash: bufferToHex(derived),
    salt: bufferToHex(salt),
  };
}

function generateId(): string {
  return randomBytes(16).toString('hex');
}

// ─── Parse CLI Arguments ──────────────────────────────

const email = process.argv[2] || 'admin@cubatattoostudio.com';
const password = process.argv[3] || 'changeme123';
const displayName = process.argv[4] || 'Studio Admin';

// ─── Hash Password ────────────────────────────────────

const { hash, salt } = hashPassword(password);
const userId = generateId();
const now = new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, '');

// ─── Build SQL ────────────────────────────────────────

const sql = `INSERT INTO users (id, email, password_hash, password_salt, role, display_name, is_active, created_at, updated_at) VALUES ('${userId}', '${email}', '${hash}', '${salt}', 'admin', '${displayName}', 1, '${now}', '${now}');`;

// ─── Output ───────────────────────────────────────────

console.log('');
console.log('=== Cuba Tattoo Studio - Admin Seed ===');
console.log('');
console.log(`  Email:        ${email}`);
console.log(`  Display Name: ${displayName}`);
console.log(`  Password:     ${password === 'changeme123' ? `${password} (DEFAULT - change this!)` : '********'}`);
console.log(`  User ID:      ${userId}`);
console.log(`  Salt:         ${salt}`);
console.log(`  Hash:         ${hash.slice(0, 16)}...`);
console.log('');
console.log('--- Generated SQL ---');
console.log('');
console.log(sql);
console.log('');
console.log('--- Run with wrangler ---');
console.log('');
console.log(`  wrangler d1 execute cubatattoostudio-db --command="${sql}"`);
console.log('');
console.log('  Or for remote (production):');
console.log(`  wrangler d1 execute cubatattoostudio-db --remote --command="${sql}"`);
console.log('');

if (password === 'changeme123') {
  console.log('WARNING: You are using the default password. Please provide a secure password:');
  console.log('  npx tsx scripts/seed-admin.ts admin@cubatattoostudio.com YourSecurePassword "Studio Admin"');
  console.log('');
}
