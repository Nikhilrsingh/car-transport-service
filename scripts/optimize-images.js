/**
 * Image Optimization Script for Car Transport Service
 * This script provides utilities to optimize images for better performance
 */

class ImageOptimizer {
  constructor() {
    this.imageFormats = ['.jpg', '.jpeg', '.png', '.gif'];
    this.optimizedImages = [];
  }

  /**
   * Optimize images with compression
   * @param {string} imagePath - Path to the image file
   * @param {Object} options - Optimization options
   */
  async optimizeImage(imagePath, options = {}) {
    // In a real implementation, this would use libraries like Sharp or ImageMagick
    // For demonstration purposes, we'll simulate optimization
    
    const defaultOptions = {
      quality: 80,
      maxWidth: 1920,
      maxHeight: 1080,
      format: 'webp'
    };
    
    const opts = { ...defaultOptions, ...options };
    
    console.log(`Optimizing image: ${imagePath}`);
    console.log(`Quality: ${opts.quality}%`);
    console.log(`Max dimensions: ${opts.maxWidth}x${opts.maxHeight}`);
    console.log(`Output format: ${opts.format}`);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const optimizedPath = imagePath.replace(/\.[^/.]+$/, `.${opts.format}`);
    this.optimizedImages.push({
      original: imagePath,
      optimized: optimizedPath,
      sizeReduction: Math.floor(Math.random() * 60) + 30 // Random reduction between 30-90%
    });
    
    return optimizedPath;
  }

  /**
   * Batch optimize images in a directory
   * @param {string} directory - Directory containing images
   */
  async optimizeDirectory(directory) {
    console.log(`Optimizing all images in directory: ${directory}`);
    
    // In a real implementation, this would scan the directory and optimize each image
    // For demonstration, we'll just log the process
    
    const mockImages = [
      'assets/images/banner-2.jpg',
      'assets/images/banner.jpg',
      'assets/images/bmw.jpg',
      'assets/images/bmw2.jpeg',
      'assets/images/car-carrier.png',
      'assets/images/first.jpeg',
      'assets/images/footer-bg.jpg',
      'assets/images/gallery-1.jpg',
      'assets/images/gallery-3.jpg',
      'assets/images/gallery-5.jpg',
      'assets/images/gallery-6.jpg',
      'assets/images/gallery-7.jpg',
      'assets/images/hasel-free.png',
      'assets/images/left-logo-w-bt.png',
      'assets/images/left-logo.jpg',
      'assets/images/right-logo.jpg'
    ];
    
    for (const imagePath of mockImages) {
      try {
        await this.optimizeImage(imagePath, { 
          quality: 80, 
          format: 'webp' 
        });
      } catch (error) {
        console.error(`Failed to optimize ${imagePath}:`, error);
      }
    }
    
    return this.optimizedImages;
  }

  /**
   * Generate responsive image sets
   * @param {string} imagePath - Path to the original image
   * @param {Array} sizes - Array of sizes to generate
   */
  generateResponsiveSet(imagePath, sizes = [320, 640, 1024, 1920]) {
    const responsiveSet = sizes.map(size => {
      return {
        src: imagePath.replace(/\.[^/.]+$/, `-${size}w.webp`),
        width: size
      };
    });
    
    return responsiveSet;
  }

  /**
   * Generate HTML with srcset for responsive images
   * @param {string} basePath - Base path for the image
   * @param {Array} sizes - Array of sizes
   */
  generateSrcsetAttribute(basePath, sizes = [320, 640, 1024, 1920]) {
    const srcset = sizes.map(size => {
      const fileName = basePath.replace(/\.[^/.]+$/, `-${size}w.webp`);
      return `${fileName} ${size}w`;
    }).join(', ');
    
    return srcset;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ImageOptimizer;
}

// Example usage:
/*
const optimizer = new ImageOptimizer();
optimizer.optimizeDirectory('./assets/images/')
  .then(results => {
    console.log('Optimization complete:');
    results.forEach(result => {
      console.log(`${result.original} -> ${result.optimized} (${result.sizeReduction}% smaller)`);
    });
  });
*/