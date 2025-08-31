// DHURYU Enterprise Website - Premium JavaScript (Fixed)

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeScrollAnimations();
    initializeCounters();
    initializeTestimonialCarousel();
    initializeContactForm();
    initializeScrollEffects();
    initializeProductCTAs();
});

// Navigation functionality (FIXED)
function initializeNavigation() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Mobile menu toggle
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = navMenu.classList.contains('active');
            
            if (isActive) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                navMenu.classList.add('active');
                mobileToggle.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        // Close mobile menu when clicking nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // FIXED: Smooth scrolling for navigation and CTA buttons
    document.querySelectorAll('a[href^="#"], button[onclick*="#"]').forEach(element => {
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            let targetId = '';
            
            // Handle different element types
            if (this.getAttribute('href')) {
                targetId = this.getAttribute('href').substring(1);
            } else if (this.getAttribute('onclick')) {
                const onclickValue = this.getAttribute('onclick');
                const match = onclickValue.match(/#([a-zA-Z0-9-_]+)/);
                if (match) {
                    targetId = match[1];
                }
            }
            
            // Handle specific navigation cases
            if (this.textContent.includes('Schedule Consultation') || this.textContent.includes('consultation')) {
                targetId = 'contact';
            } else if (this.textContent.includes('View Portfolio') || this.textContent.includes('portfolio')) {
                targetId = 'products';
            }
            
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileToggle) mobileToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // Header scroll effects and active navigation
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', throttle(() => {
        const currentScrollY = window.scrollY;
        
        // Header background opacity
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }

        // Update active navigation
        updateActiveNavigation();
        
        lastScrollY = currentScrollY;
    }, 16));
}

// Update active navigation based on scroll position
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// Scroll animations using Intersection Observer
function initializeScrollAnimations() {
    const animationElements = document.querySelectorAll(
        '.solution-card, .product-card, .benefit-card, .industry-card, .testimonial-card, .stat-item'
    );
    
    // Add animation classes
    animationElements.forEach((element, index) => {
        if (index % 2 === 0) {
            element.classList.add('fade-in');
        } else {
            element.classList.add('scale-in');
        }
    });

    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
    });

    // Observe all animation elements
    animationElements.forEach(element => {
        observer.observe(element);
    });
}

// Counter animations for statistics
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseFloat(element.getAttribute('data-target'));
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    const stepDuration = duration / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            element.textContent = target % 1 === 0 ? target.toString() : target.toFixed(1);
            clearInterval(timer);
        } else {
            const displayValue = current % 1 === 0 ? Math.floor(current) : current.toFixed(1);
            element.textContent = displayValue;
        }
    }, stepDuration);
}

// Testimonial carousel
function initializeTestimonialCarousel() {
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    if (testimonialCards.length <= 1) return;
    
    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            if (i === index) {
                card.classList.add('active');
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.classList.remove('active');
                card.style.opacity = '0';
                card.style.transform = 'translateY(-20px)';
            }
        });
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }
    
    // Auto-rotate testimonials
    setInterval(nextTestimonial, 5000);
    
    // Initialize first testimonial
    showTestimonial(0);
}

// FIXED: Contact form handling with proper dropdown support
function initializeContactForm() {
    const form = document.getElementById('consultationForm');
    
    if (!form) return;
    
    // Fix dropdown functionality
    const selectElements = form.querySelectorAll('select.form-control');
    selectElements.forEach(select => {
        // Remove any conflicting event listeners
        select.style.pointerEvents = 'auto';
        select.disabled = false;
        
        // Ensure proper focus and click handling
        select.addEventListener('click', function(e) {
            e.stopPropagation();
            this.focus();
        });
        
        select.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-green)';
            this.style.boxShadow = '0 0 0 4px rgba(10, 77, 60, 0.1)';
        });
        
        select.addEventListener('blur', function() {
            this.style.borderColor = 'rgba(26, 117, 86, 0.1)';
            this.style.boxShadow = 'none';
        });
        
        select.addEventListener('change', function() {
            this.classList.add('has-value');
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous messages
        clearFormMessages();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (validateForm(data)) {
            handleFormSubmission(data);
        }
    });
    
    // Real-time validation
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            validateField(this);
        });
        
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(data) {
    let isValid = true;
    const requiredFields = ['companyName', 'industry', 'contactName', 'email'];
    let firstErrorField = null;
    
    // Validate required fields
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        const value = data[fieldName];
        
        if (!value || value.trim() === '' || value === '') {
            showFieldError(field, 'This field is required');
            isValid = false;
            if (!firstErrorField) firstErrorField = field;
        }
    });
    
    // Validate email format
    if (data.email && !isValidEmail(data.email)) {
        const emailField = document.getElementById('email');
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
        if (!firstErrorField) firstErrorField = emailField;
    }
    
    // Validate phone format (if provided)
    if (data.phone && data.phone.trim() !== '' && !isValidPhone(data.phone)) {
        const phoneField = document.getElementById('phone');
        showFieldError(phoneField, 'Please enter a valid phone number');
        isValid = false;
        if (!firstErrorField) firstErrorField = phoneField;
    }
    
    // Focus first error field
    if (!isValid && firstErrorField) {
        firstErrorField.focus();
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value ? field.value.trim() : '';
    let isValid = true;
    
    // Clear previous errors
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (field.hasAttribute('required') && (!value || value === '')) {
        showFieldError(field, 'This field is required');
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.5rem';
    
    field.parentNode.appendChild(errorElement);
}

function clearFormMessages() {
    // Clear all error states
    document.querySelectorAll('.form-control.error').forEach(field => {
        field.classList.remove('error');
    });
    
    // Clear all error messages
    document.querySelectorAll('.error-message').forEach(error => {
        error.remove();
    });
    
    // Clear success messages
    document.querySelectorAll('.success-message').forEach(message => {
        message.remove();
    });
}

function handleFormSubmission(data) {
    const submitBtn = document.querySelector('#consultationForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.textContent = 'Processing Request...';
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Show success message
        showSuccessMessage(data);
        
        // Reset form
        document.getElementById('consultationForm').reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        // Log form data (in production, send to server)
        console.log('Consultation request submitted:', data);
    }, 2000);
}

function showSuccessMessage(data) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    
    const industryName = getIndustryDisplayName(data.industry);
    const volumeName = getVolumeDisplayName(data.volume);
    
    successDiv.innerHTML = `
        <div style="display: flex; align-items: flex-start; gap: 1rem;">
            <div style="font-size: 2rem; flex-shrink: 0;">✓</div>
            <div style="flex: 1;">
                <h3 style="margin: 0 0 0.5rem 0; color: var(--primary-green); font-size: 1.25rem; font-weight: 600;">
                    Consultation Request Received!
                </h3>
                <p style="margin: 0 0 0.75rem 0;">
                    Thank you <strong>${data.contactName}</strong> from <strong>${data.companyName}</strong>!
                </p>
                <p style="margin: 0 0 1rem 0;">
                    Your consultation request for ${industryName} solutions${volumeName ? ` (${volumeName})` : ''} has been received.
                </p>
                <div style="background: rgba(10, 77, 60, 0.05); padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem;">
                    <p style="margin: 0; font-weight: 500;">
                        📧 Confirmation sent to: <strong>${data.email}</strong><br>
                        ⏱️ Our team will contact you within 4 business hours<br>
                        📋 Reference: #DHURYU-${Date.now().toString().slice(-6)}
                    </p>
                </div>
            </div>
        </div>
    `;
    
    const form = document.getElementById('consultationForm');
    form.insertBefore(successDiv, form.firstChild);
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.transition = 'all 0.3s ease';
            successDiv.style.opacity = '0';
            successDiv.style.transform = 'translateY(-10px)';
            
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 300);
        }
    }, 10000);
}

function getIndustryDisplayName(value) {
    const industryMap = {
        'corporate-food-service': 'Corporate Food Service',
        'hospitality-events': 'Hospitality & Events',
        'food-manufacturing': 'Food Processing & Manufacturing',
        'retail-ecommerce': 'Retail & E-commerce',
        'healthcare': 'Healthcare',
        'education': 'Education',
        'other': 'Custom Industry'
    };
    return industryMap[value] || 'Enterprise';
}

function getVolumeDisplayName(value) {
    const volumeMap = {
        '10k-50k': '10K-50K units',
        '50k-200k': '50K-200K units',
        '200k+': '200K+ units',
        'custom': 'Custom volume'
    };
    return volumeMap[value] || null;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

// FIXED: Product CTA handling
function initializeProductCTAs() {
    const productCTAs = document.querySelectorAll('.product-cta');
    
    productCTAs.forEach(cta => {
        cta.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Find the product card
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('h3')?.textContent || 'Selected Product';
            const minOrder = productCard.querySelector('.min-order')?.textContent || '';
            
            // Scroll to contact form
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                const targetPosition = contactSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // Pre-fill form message
                setTimeout(() => {
                    const messageField = document.getElementById('message');
                    if (messageField) {
                        messageField.value = `I'm interested in getting a quote for ${productTitle}. ${minOrder}. Please provide pricing and availability details.`;
                        messageField.focus();
                    }
                }, 1000);
            }
        });
    });
}

// Scroll effects and parallax
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollY = window.scrollY;
        
        // Hero parallax effect
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroHeight = hero.offsetHeight;
            const heroOffset = hero.offsetTop;
            
            if (scrollY >= heroOffset && scrollY <= heroOffset + heroHeight) {
                const progress = (scrollY - heroOffset) / heroHeight;
                const parallaxOffset = progress * 50;
                
                const heroBackground = hero.querySelector('.hero-background');
                if (heroBackground) {
                    heroBackground.style.transform = `translateY(${parallaxOffset}px)`;
                }
            }
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
}

// Utility functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Enhanced user experience features
document.addEventListener('DOMContentLoaded', function() {
    // Remove any debugging artifacts (fix blue circle issue)
    const debugElements = document.querySelectorAll('[style*="position: absolute"][style*="blue"], .debug-circle, .debug-element');
    debugElements.forEach(element => element.remove());
    
    // Enhanced form field interactions
    document.querySelectorAll('.form-control').forEach(field => {
        field.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });
    
    // Add smooth hover transitions to cards
    document.querySelectorAll('.solution-card, .product-card, .benefit-card, .industry-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Keyboard navigation improvements
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const mobileToggle = document.querySelector('.mobile-toggle');
        
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            if (mobileToggle) mobileToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

var swiper = new Swiper(".product-swiper", {
    slidesPerView: 1,  // Show 1 slide by default (phone)
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      768: {  // Tablet and above
        slidesPerView: 2,
      },
      1024: { // Laptop and above
        slidesPerView: 4,
      },
    },
  });
  