// Add this at the beginning of your main.js file
document.addEventListener('DOMContentLoaded', function() {
    // UTM Parameter Forwarding
    const currentUrlParams = new URLSearchParams(window.location.search);
    const paramsToForward = new URLSearchParams();

    // Define parameters to forward
    const relevantParamKeys = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'gclid',
        'fbclid'
    ];

    // Extract existing parameters
    relevantParamKeys.forEach(key => {
        if (currentUrlParams.has(key)) {
            paramsToForward.set(key, currentUrlParams.get(key));
        }
    });

    const queryStringToAppend = paramsToForward.toString();

    if (queryStringToAppend) {
        // Update all CTA buttons and links
        const ctaElements = document.querySelectorAll('a[href*="exlyapp.com"], button[onclick*="exlyapp.com"]');

        ctaElements.forEach(element => {
            try {
                if (element.tagName === 'BUTTON' && element.getAttribute('onclick')) {
                    // Handle onclick buttons
                    const originalOnclick = element.getAttribute('onclick');
                    const urlMatch = originalOnclick.match(/window\.open\(['"]([^'"]+)['"]/);

                    if (urlMatch && urlMatch[1]) {
                        let targetUrl = urlMatch[1];
                        const separator = targetUrl.includes('?') ? '&' : '?';
                        const newUrl = targetUrl + separator + queryStringToAppend;
                        
                        const newOnclick = originalOnclick.replace(targetUrl, newUrl);
                        element.setAttribute('onclick', newOnclick);
                    }
                } else if (element.tagName === 'A' && element.href) {
                    // Handle anchor links
                    let targetUrl = element.href;
                    const separator = targetUrl.includes('?') ? '&' : '?';
                    element.href = targetUrl + separator + queryStringToAppend;
                }
            } catch (error) {
                console.error('Error processing CTA element:', error);
            }
        });
    }

    // Floating CTA visibility control
    const floatingCta = document.getElementById('floatingCta');
    const benefitsSection = document.querySelector('.benefits');
    
    function handleScroll() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // For Floating CTA
        if (benefitsSection) {
            const benefitsTop = benefitsSection.offsetTop;
            if (scrollPosition > (benefitsTop - windowHeight/2)) {
                floatingCta?.classList.add('visible');
            } else {
                floatingCta?.classList.remove('visible');
            }
        }
    }

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
});

// FAQ Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-card__question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');
            
            // Close all other answers
            document.querySelectorAll('.faq-card__question.active').forEach(activeQuestion => {
                if (activeQuestion !== question) {
                    activeQuestion.classList.remove('active');
                    activeQuestion.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current answer
            question.classList.toggle('active');
            answer.classList.toggle('active');
            
            // Smooth scroll into view if opening and not fully visible
            if (!isActive) {
                setTimeout(() => {
                    const rect = answer.getBoundingClientRect();
                    const isVisible = (rect.top >= 0) && (rect.bottom <= window.innerHeight);
                    
                    if (!isVisible) {
                        answer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                }, 300);
            }
        });
    });
});

// Testimonials Slider
document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.testimonials-track');
    const dotsContainer = document.querySelector('.testimonials-nav');
    const testimonials = document.querySelectorAll('.testimonial-card');
    const totalSlides = testimonials.length;
    let currentSlide = 0;
    let interval;

    // Calculate number of pages (pairs)
    function getNumberOfPages() {
        return window.innerWidth >= 768 ? 
            Math.ceil(totalSlides / 2) : // Desktop: Show in pairs
            totalSlides; // Mobile: Show one by one
    }

    // Update dots to show correct number of pages
    function updateDots() {
        dotsContainer.innerHTML = ''; // Clear existing dots
        const numberOfPages = getNumberOfPages();

        for (let i = 0; i < numberOfPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateSlider();
                startAutoplay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateSlider() {
        const isDesktop = window.innerWidth >= 768;
        const slideWidth = isDesktop ? 50 : 100;
        // For desktop, move two slides at a time
        const offset = isDesktop ? 
            -(currentSlide * slideWidth * 2) : 
            -(currentSlide * slideWidth);
            
        track.style.transform = `translateX(${offset}%)`;

        // Update active dot
        const dots = document.querySelectorAll('.nav-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        const numberOfPages = getNumberOfPages();
        currentSlide = (currentSlide + 1) % numberOfPages;
        updateSlider();
    }

    function startAutoplay() {
        clearInterval(interval);
        interval = setInterval(nextSlide, 5000);
    }

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentSlide = 0;
            updateDots(); // Recreate dots based on new layout
            updateSlider();
        }, 250);
    });

    // Initialize
    updateDots();
    updateSlider();
    startAutoplay();
});

// Sticky CTA visibility control
document.addEventListener('DOMContentLoaded', function() {
    const stickyCta = document.querySelector('.sticky-cta');
    const benefitsSection = document.querySelector('.benefits');
    const faqsSection = document.querySelector('.faqs');
    
    // Initially hide the sticky CTA
    stickyCta.style.opacity = '0';
    stickyCta.style.visibility = 'hidden';

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Check if we're scrolling past the benefits section
            if (entry.target === benefitsSection) {
                if (!entry.isIntersecting && window.scrollY > benefitsSection.offsetTop) {
                    stickyCta.style.opacity = '1';
                    stickyCta.style.visibility = 'visible';
                } else {
                    stickyCta.style.opacity = '0';
                    stickyCta.style.visibility = 'hidden';
                }
            }
            
            // Check if we're at the FAQ section
            if (entry.target === faqsSection) {
                if (entry.isIntersecting) {
                    stickyCta.style.opacity = '0';
                    stickyCta.style.visibility = 'hidden';
                } else if (window.scrollY > benefitsSection.offsetTop) {
                    stickyCta.style.opacity = '1';
                    stickyCta.style.visibility = 'visible';
                }
            }
        });
    }, { 
        threshold: 0,
        rootMargin: '-50px'
    });

    // Observe both sections
    if (benefitsSection) observer.observe(benefitsSection);
    if (faqsSection) observer.observe(faqsSection);

    // Additional scroll handler for better control
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const benefitsPosition = benefitsSection.offsetTop;
        const faqsPosition = faqsSection.offsetTop;

        if (scrollPosition > benefitsPosition && scrollPosition < faqsPosition) {
            stickyCta.style.opacity = '1';
            stickyCta.style.visibility = 'visible';
        } else {
            stickyCta.style.opacity = '0';
            stickyCta.style.visibility = 'hidden';
        }
    });
});

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });
});

// Video Testimonials
document.addEventListener('DOMContentLoaded', function() {
    const videoOverlays = document.querySelectorAll('.video-overlay');
    
    videoOverlays.forEach(overlay => {
        overlay.addEventListener('click', function() {
            const videoWrapper = this.closest('.video-wrapper');
            const video = videoWrapper.querySelector('video');
            
            // Hide overlay
            this.style.display = 'none';
            
            // Play video
            video.play();
            
            // Show controls
            video.controls = true;
            
            // When video ends, show overlay again
            video.addEventListener('ended', function() {
                overlay.style.display = 'flex';
                video.controls = false;
            });
            
            // When video is paused, show overlay again
            video.addEventListener('pause', function() {
                overlay.style.display = 'flex';
            });
        });
    });
});
