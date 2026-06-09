/**
 * Generate WebP version of image path
 * Assumes WebP files are stored alongside original images with .webp extension
 * Example: /images/desktop-humidor.jpg → /images/desktop-humidor.webp
 */
export const getWebPPath = (imagePath: string): string => {
  if (!imagePath) return '';

  // Handle already-webp paths
  if (imagePath.endsWith('.webp')) return imagePath;

  // Remove extension and add .webp
  const pathWithoutExt = imagePath.replace(/\.(jpg|jpeg|png|gif)$/i, '');
  return `${pathWithoutExt}.webp`;
};

/**
 * Get image sources for picture element
 */
export const getImageSources = (imagePath: string) => ({
  webp: getWebPPath(imagePath),
  original: imagePath
});

/**
 * Image size optimization presets
 */
export const imageSizes = {
  thumbnail: '100px',
  small: '300px',
  medium: '600px',
  large: '1200px',
  full: '100vw'
};

/**
 * Generate srcset for responsive images
 */
export const generateSrcSet = (basePath: string, sizes: number[] = [300, 600, 1200]): string => {
  return sizes.map(size => `${basePath}?w=${size} ${size}w`).join(', ');
};
