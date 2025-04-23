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
