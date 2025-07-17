// Image Loader for Dynamic Profile Images
// This script helps load profile images from CMS settings

class ImageLoader {
    constructor() {
        this.defaultImage = 'images/placeholder.svg';
        this.init();
    }

    init() {
        this.loadProfileImages();
        this.addImageErrorHandling();
    }

    // Load profile images in different sections
    loadProfileImages() {
        const profileImages = document.querySelectorAll('.hero-img, .profile-img');
        
        profileImages.forEach(img => {
            // Add loading placeholder
            img.style.backgroundColor = '#f3f4f6';
            
            // Handle image load success
            img.addEventListener('load', () => {
                img.style.backgroundColor = 'transparent';
                img.classList.add('loaded');
            });

            // Handle image load error
            img.addEventListener('error', () => {
                this.handleImageError(img);
            });
        });
    }

    // Handle image loading errors
    handleImageError(img) {
        console.warn('Failed to load profile image, using fallback');
        
        // Create fallback with initials
        const fallback = this.createFallbackImage();
        img.parentNode.appendChild(fallback);
        img.style.display = 'none';
    }

    // Create fallback image with initials
    createFallbackImage() {
        const fallback = document.createElement('div');
        fallback.className = 'profile-fallback';
        fallback.innerHTML = '<span>ي م</span>'; // يوسف محمد
        
        fallback.style.cssText = `
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 2rem;
            font-weight: bold;
            position: absolute;
            top: 0;
            left: 0;
        `;
        
        return fallback;
    }

    // Add error handling for all images
    addImageErrorHandling() {
        const allImages = document.querySelectorAll('img');
        
        allImages.forEach(img => {
            img.addEventListener('error', function() {
                if (!this.classList.contains('error-handled')) {
                    this.classList.add('error-handled');
                    console.warn('Image failed to load:', this.src);
                }
            });
        });
    }

    // Update profile image (for CMS integration)
    updateProfileImage(newImagePath) {
        const profileImages = document.querySelectorAll('.hero-img, .profile-img');
        
        profileImages.forEach(img => {
            img.src = newImagePath || this.defaultImage;
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ImageLoader();
});

// Export for potential CMS integration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageLoader;
}
