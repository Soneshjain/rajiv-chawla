// Floating CTA visibility control
document.addEventListener('DOMContentLoaded', function() {
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
    const dots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let autoplayInterval;
    let slidesPerView = 1;

    function updateSlidesPerView() {
        slidesPerView = window.innerWidth >= 768 ? 2 : 1;
        return Math.ceil(6 / slidesPerView); // Total number of slides needed
    }

    function initializeSlider() {
        const totalSlides = updateSlidesPerView();
        
        // Update dots visibility
        dots.forEach((dot, index) => {
            dot.style.display = index < totalSlides ? 'block' : 'none';
        });

        // Reset transform
        updateSlide();
        
        // Start autoplay
        autoplayInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlide();
        }, 3000);
    }

    function updateSlide() {
        const slideWidth = 100 / slidesPerView;
        track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Initialize slider
    initializeSlider();

    // Handle window resize
    window.addEventListener('resize', initializeSlider);

    // Add click handlers to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlide();
            clearInterval(autoplayInterval);
            initializeSlider();
        });
    });
});
