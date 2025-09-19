/**
 * CoRamTix Preloader - Ultra Fast & Smooth
 * Optimized for maximum performance and user experience
 */

class CoRamTixPreloader {
  constructor() {
    this.preloader = document.getElementById('preloader');
    this.loadingText = document.getElementById('loading-text');
    this.progressBar = document.querySelector('.progress-fill');
    this.content = document.getElementById('main-content') || document.body;
    
    this.messages = [
      'Loading premium experience...',
      'Initializing servers...',
      'Preparing dashboard...',
      'Optimizing performance...',
      'Almost ready...',
      'Welcome to CoRamTix!'
    ];
    
    this.currentMessageIndex = 0;
    this.minDisplayTime = 2000; // Minimum 2 seconds
    this.messageInterval = null;
    this.startTime = performance.now();
    
    this.init();
  }

  init() {
    if (!this.preloader) {
      console.warn('Preloader element not found');
      return;
    }

    this.setupPreloader();
    this.startMessageRotation();
    this.startProgressAnimation();
    this.handlePageLoad();
  }

  setupPreloader() {
    // Ensure preloader is visible
    this.preloader.style.opacity = '1';
    this.preloader.style.visibility = 'visible';
    
    // Disable scrolling during preload
    document.body.style.overflow = 'hidden';
    
    // Add loading class to body
    document.body.classList.add('loading');
  }

  startMessageRotation() {
    if (!this.loadingText) return;
    
    // Set initial message
    this.loadingText.textContent = this.messages[0];
    
    // Rotate messages
    this.messageInterval = setInterval(() => {
      if (this.currentMessageIndex < this.messages.length - 1) {
        this.currentMessageIndex++;
        this.updateLoadingMessage();
      }
    }, 400);
  }

  updateLoadingMessage() {
    if (!this.loadingText) return;
    
    // Fade out current message
    this.loadingText.style.opacity = '0.5';
    
    setTimeout(() => {
      this.loadingText.textContent = this.messages[this.currentMessageIndex];
      this.loadingText.style.opacity = '1';
    }, 150);
  }

  startProgressAnimation() {
    if (!this.progressBar) return;
    
    // Simulate realistic loading progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      // Slow start, fast middle, slow end
      if (progress < 30) {
        progress += Math.random() * 3 + 1;
      } else if (progress < 70) {
        progress += Math.random() * 8 + 2;
      } else if (progress < 95) {
        progress += Math.random() * 2 + 0.5;
      }
      
      this.progressBar.style.width = Math.min(progress, 95) + '%';
      
      if (progress >= 95) {
        clearInterval(progressInterval);
        // Complete to 100% when ready to hide
        setTimeout(() => {
          this.progressBar.style.width = '100%';
        }, 200);
      }
    }, 100);
  }

  handlePageLoad() {
    // Check if DOM is already loaded
    if (document.readyState === 'complete') {
      this.onPageReady();
    } else {
      // Wait for DOM content loaded
      document.addEventListener('DOMContentLoaded', () => {
        this.onPageReady();
      });
      
      // Also listen for window load as fallback
      window.addEventListener('load', () => {
        this.onPageReady();
      });
    }
  }

  onPageReady() {
    const elapsedTime = performance.now() - this.startTime;
    const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);
    
    // Ensure minimum display time for smooth UX
    setTimeout(() => {
      this.hidePreloader();
    }, remainingTime);
  }

  hidePreloader() {
    // Clear intervals
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
    }

    // Show final message
    if (this.loadingText) {
      this.loadingText.textContent = 'Welcome to CoRamTix!';
    }

    // Complete progress bar
    if (this.progressBar) {
      this.progressBar.style.width = '100%';
    }

    // Start fade out animation
    setTimeout(() => {
      this.fadeOutPreloader();
    }, 500);
  }

  fadeOutPreloader() {
    if (!this.preloader) return;

    // Add transition classes
    this.preloader.classList.add('preloader-hidden');
    
    // Animate opacity and transform
    this.preloader.style.opacity = '0';
    this.preloader.style.transform = 'scale(0.9)';
    
    // Remove from DOM after transition
    setTimeout(() => {
      this.removePreloader();
    }, 800);
  }

  removePreloader() {
    // Remove preloader from DOM
    if (this.preloader && this.preloader.parentNode) {
      this.preloader.parentNode.removeChild(this.preloader);
    }
    
    // Re-enable scrolling
    document.body.style.overflow = '';
    document.body.classList.remove('loading');
    
    // Show main content
    this.showMainContent();
    
    // Dispatch custom event
    this.dispatchLoadedEvent();
    
    // Performance logging
    this.logPerformance();
  }

  showMainContent() {
    // Fade in main content
    if (this.content) {
      this.content.style.opacity = '0';
      this.content.style.transform = 'translateY(20px)';
      this.content.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Force reflow
      this.content.offsetHeight;
      
      // Animate in
      this.content.style.opacity = '1';
      this.content.style.transform = 'translateY(0)';
    }
  }

  dispatchLoadedEvent() {
    // Dispatch custom event for other scripts
    const event = new CustomEvent('coramtixLoaded', {
      detail: {
        loadTime: performance.now() - this.startTime,
        timestamp: Date.now()
      }
    });
    
    document.dispatchEvent(event);
  }

  logPerformance() {
    const totalTime = performance.now() - this.startTime;
    console.log(`🚀 CoRamTix loaded in ${Math.round(totalTime)}ms`);
    
    // Log performance metrics
    if ('performance' in window && performance.getEntriesByType) {
      const navigationTiming = performance.getEntriesByType('navigation')[0];
      if (navigationTiming) {
        const metrics = {
          'DNS Lookup': navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
          'TCP Connection': navigationTiming.connectEnd - navigationTiming.connectStart,
          'Server Response': navigationTiming.responseEnd - navigationTiming.requestStart,
          'DOM Processing': navigationTiming.domContentLoadedEventEnd - navigationTiming.responseEnd,
          'Total Load Time': navigationTiming.loadEventEnd - navigationTiming.fetchStart
        };
        
        console.table(metrics);
      }
    }
  }
}

// Error handling wrapper
try {
  // Initialize preloader immediately
  const preloader = new CoRamTixPreloader();
  
  // Fallback safety mechanism
  setTimeout(() => {
    const preloaderElement = document.getElementById('preloader');
    if (preloaderElement && preloaderElement.style.display !== 'none') {
      console.warn('🚨 Preloader fallback activated');
      preloaderElement.style.display = 'none';
      document.body.style.overflow = '';
    }
  }, 8000); // 8 second maximum
  
} catch (error) {
  console.error('❌ Preloader initialization error:', error);
  
  // Emergency fallback
  const preloaderElement = document.getElementById('preloader');
  if (preloaderElement) {
    preloaderElement.style.display = 'none';
  }
  document.body.style.overflow = '';
}

// Listen for page visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    const preloaderElement = document.getElementById('preloader');
    if (preloaderElement && preloaderElement.style.opacity === '1') {
      // User returned to tab, hide preloader if still showing
      setTimeout(() => {
        if (preloaderElement.parentNode) {
          preloaderElement.style.display = 'none';
          document.body.style.overflow = '';
        }
      }, 1000);
    }
  }
});
/* End of CoRamTix Preloader Script */