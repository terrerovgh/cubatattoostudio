export async function compressImage(
  blob: Blob,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    mimeType?: string;
  } = {},
): Promise<Blob> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85,
    mimeType = 'image/jpeg',
  } = options;

  const imageBitmap = await createImageBitmap(blob);
  const { width, height } = imageBitmap;

  let newWidth = width;
  let newHeight = height;
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    newWidth = Math.round(width * ratio);
    newHeight = Math.round(height * ratio);
  }

  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(newWidth, newHeight);
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);
    imageBitmap.close();
    return canvas.convertToBlob({ type: mimeType, quality });
  }

  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(imageBitmap, 0, 0, newWidth, newHeight);
  imageBitmap.close();

  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b!), mimeType, quality);
  });
}

export function generateImageId(artist: string): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${artist}-${timestamp}-${random}`;
}

export function getMimeType(file: File): string {
  if (file.type) return file.type;
  const ext = file.name.split('.').pop()?.toLowerCase();
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
  };
  return mimeMap[ext || ''] || 'image/jpeg';
}

export function validateImageFile(
  file: File,
  maxSizeMB = 10,
): { valid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF.` };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File too large. Maximum size is ${maxSizeMB}MB.` };
  }
  return { valid: true };
}
