import createImageUrlBuilder from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

/**
 * Generates optimized image URL from Sanity
 * @param {Object} source - Sanity image source
 * @param {Object} options - Image optimization options
 * @param {number} options.width - Image width
 * @param {number} options.height - Image height
 * @param {number} options.quality - Image quality (1-100), default: 85
 * @param {string} options.format - Image format ('webp', 'avif', 'jpg', 'png'), default: 'webp'
 * @param {boolean} options.auto - Auto format based on browser support, default: true
 * @returns {Object} Sanity image builder instance
 */
export const urlFor = (source, options = {}) => {
  if (!source) return null;
  
  const {
    width,
    height,
    quality = 85,
    format = 'webp',
    auto = true,
    fit = 'max',
  } = options;

  let imageBuilder = builder.image(source);

  if (width) imageBuilder = imageBuilder.width(width);
  if (height) imageBuilder = imageBuilder.height(height);
  if (quality) imageBuilder = imageBuilder.quality(quality);
  if (fit) imageBuilder = imageBuilder.fit(fit);

  // Auto format (webp/avif) based on browser support
  if (auto && format === 'webp') {
    imageBuilder = imageBuilder.format('webp');
  } else if (format) {
    imageBuilder = imageBuilder.format(format);
  }

  return imageBuilder;
}
