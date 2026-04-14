/**
 * Cloudinary Image Optimization Service
 * Provides utilities for optimizing Cloudinary-hosted images
 */

interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'thumb';
  quality?: 'auto' | 'auto:best' | 'auto:good' | 'auto:eco' | 'auto:low' | number;
  format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  dpr?: 'auto' | number;
}

/**
 * Generates an optimized Cloudinary URL with transformation parameters
 * @param originalUrl - The original Cloudinary image URL
 * @param options - Optimization options
 * @returns Optimized Cloudinary URL
 */
export function getOptimizedCloudinaryUrl(
  originalUrl: string,
  options: CloudinaryOptions = {}
): string {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
    dpr = 'auto'
  } = options;

  // Parse existing URL - Cloudinary URLs have format: https://res.cloudinary.com/<cloud>/image/upload/<transforms>/<path>
  const urlParts = originalUrl.split('/upload/');
  if (urlParts.length !== 2) return originalUrl;

  // Build transformation string
  const transforms = [
    `c_${crop}`,
    width && `w_${width}`,
    height && `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
    `g_${gravity}`,
    dpr && `dpr_${dpr}`,
  ].filter(Boolean).join(',');

  return `${urlParts[0]}/upload/${transforms}/${urlParts[1]}`;
}

/**
 * Generates an optimized avatar URL with specific dimensions
 * @param avatarUrl - The original avatar URL (Cloudinary or other)
 * @param size - Desired avatar size in pixels
 * @returns Optimized avatar URL
 */
export function getOptimizedAvatarUrl(avatarUrl: string | null | undefined, size: number = 128): string {
  if (!avatarUrl) return '';

  // If it's not a Cloudinary URL, return as-is
  if (!avatarUrl.includes('res.cloudinary.com')) {
    return avatarUrl;
  }

  return getOptimizedCloudinaryUrl(avatarUrl, {
    width: size,
    height: size,
    crop: 'thumb',
    quality: 'auto:good',
    format: 'auto',
    gravity: 'face',
    dpr: 'auto',
  });
}

/**
 * Generates an optimized group image URL
 * @param imageUrl - The original group image URL
 * @param width - Desired width
 * @param height - Desired height
 * @returns Optimized group image URL
 */
export function getOptimizedGroupImageUrl(
  imageUrl: string | null | undefined,
  width: number = 400,
  height: number = 400
): string {
  if (!imageUrl) return '';

  if (!imageUrl.includes('res.cloudinary.com')) {
    return imageUrl;
  }

  return getOptimizedCloudinaryUrl(imageUrl, {
    width,
    height,
    crop: 'fill',
    quality: 'auto:good',
    format: 'auto',
    gravity: 'center',
    dpr: 'auto',
  });
}

/**
 * Generates an optimized message image URL
 * @param imageUrl - The original message image URL
 * @param maxWidth - Maximum width (maintains aspect ratio)
 * @returns Optimized message image URL
 */
export function getOptimizedMessageImageUrl(
  imageUrl: string | null | undefined,
  maxWidth: number = 800
): string {
  if (!imageUrl) return '';

  if (!imageUrl.includes('res.cloudinary.com')) {
    return imageUrl;
  }

  return getOptimizedCloudinaryUrl(imageUrl, {
    width: maxWidth,
    crop: 'limit', // Maintains aspect ratio, only scales down
    quality: 'auto:good',
    format: 'auto',
    dpr: 'auto',
  });
}

/**
 * Preloads common avatar sizes for a list of users
 * @param avatarUrls - Array of avatar URLs to preload
 */
export function preloadAvatars(avatarUrls: (string | null | undefined)[]): void {
  if (typeof window === 'undefined') return;

  const urls = avatarUrls
    .filter((url): url is string => Boolean(url))
    .map(url => getOptimizedAvatarUrl(url, 64));

  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Gets responsive srcSet for Cloudinary images
 * @param baseUrl - Base Cloudinary URL
 * @param widths - Array of desired widths
 * @returns srcSet string for img tag
 */
export function getCloudinarySrcSet(
  baseUrl: string,
  widths: number[] = [64, 128, 256, 512]
): string {
  if (!baseUrl.includes('res.cloudinary.com')) {
    return baseUrl;
  }

  return widths
    .map(width => `${getOptimizedCloudinaryUrl(baseUrl, { width, crop: 'limit', quality: 'auto', format: 'auto' })} ${width}w`)
    .join(', ');
}
