// Multi-page JavaScript functionality
// Global variables
let currentFilter = 'all';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait for navigation to load, then initialize
    setTimeout(initializeWebsite, 100);
});

// Initialize website functionality
function initializeWebsite() {
    // Check which page we're on and initialize accordingly
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Common functionality for all pages
    setupScrollAnimations();
    setupModal();
    setupSmoothScrolling();
    
    // Page-specific functionality
    switch(currentPage) {
        case 'index.html':
        case '':
            // Home page - minimal functionality
            break;
        case 'vfx.html':
            setupPortfolioFilters();
            setupProjectCalculator();
            break;
        case 'technical.html':
            // Technical page specific setup
            break;
        case 'about.html':
            setupContactForm();
            break;
    }
    
    // Update navbar scroll effect for all pages
    setupNavbarScrollEffect();
}

// Navbar scroll effect
function setupNavbarScrollEffect() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
}

// Portfolio filters (for index page)
function setupPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter portfolio items
                filterPortfolioItems(filter);
            });
        });
    }
}

function filterPortfolioItems(filter) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });
}

// Contact form handling (for about page)
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
    }
}

async function handleContactFormSubmission() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    try {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            budget: formData.get('budget'),
            service: formData.get('service'),
            message: formData.get('message'),
            timeline: formData.get('timeline')
        };
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showNotification('Message sent successfully! I will get back to you soon.', 'success');
            form.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        console.error('Error sending message:', error);
        showNotification('Failed to send message. Please try again or contact me directly via email.', 'error');
    } finally {
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
}

// Project calculator (for services page)
function setupProjectCalculator() {
    const videoLength = document.getElementById('video-length');
    const complexity = document.getElementById('complexity');
    const urgency = document.getElementById('urgency');
    const checkboxes = document.querySelectorAll('#project-calculator input[type="checkbox"]');

    // Only setup if elements exist
    if (videoLength && complexity && urgency) {
        function updateCalculator() {
            const length = parseInt(videoLength.value);
            const complexityLevel = complexity.value;
            const urgencyLevel = urgency.value;

            // Update length display
            const minutes = Math.floor(length / 60);
            const seconds = length % 60;
            const lengthDisplay = document.getElementById('length-display');
            if (lengthDisplay) {
                lengthDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')} minutes`;
            }

            // Calculate base price
            let basePrice = 999;
            switch(complexityLevel) {
                case 'standard': basePrice = 2499; break;
                case 'premium': basePrice = 4999; break;
                case 'custom': basePrice = 7999; break;
            }

            // Length modifier
            if (length > 300) basePrice += Math.floor((length - 300) / 60) * 500;

            // Additional services
            let additionalCost = 0;
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    switch(checkbox.id) {
                        case 'scriptwriting': additionalCost += 500; break;
                        case 'voiceover': additionalCost += 800; break;
                        case 'subtitles': additionalCost += 300; break;
                        case 'consultation': additionalCost += 400; break;
                    }
                }
            });

            // Urgency modifier
            let urgencyMultiplier = 1;
            let urgencyCost = 0;
            switch(urgencyLevel) {
                case 'fast': urgencyMultiplier = 1.2; break;
                case 'rush': urgencyMultiplier = 1.5; break;
            }
            urgencyCost = Math.round((basePrice + additionalCost) * (urgencyMultiplier - 1));

            const totalPrice = Math.round((basePrice + additionalCost) * urgencyMultiplier);

            // Update display elements if they exist
            const basePriceEl = document.getElementById('base-price');
            const additionalCostsEl = document.getElementById('additional-costs');
            const urgencyCostEl = document.getElementById('urgency-cost');
            const totalPriceEl = document.getElementById('total-price');
            
            if (basePriceEl) basePriceEl.textContent = `₹${basePrice}`;
            if (additionalCostsEl) additionalCostsEl.textContent = `₹${additionalCost}`;
            if (urgencyCostEl) urgencyCostEl.textContent = `₹${urgencyCost}`;
            if (totalPriceEl) totalPriceEl.textContent = `₹${totalPrice}`;

            // Update timeline
            let deliveryTime = '3-5 days';
            switch(urgencyLevel) {
                case 'fast': deliveryTime = '2-3 days'; break;
                case 'rush': deliveryTime = '1-2 days'; break;
                case 'standard': 
                    switch(complexityLevel) {
                        case 'basic': deliveryTime = '2-3 days'; break;
                        case 'standard': deliveryTime = '3-4 days'; break;
                        case 'premium': deliveryTime = '4-5 days'; break;
                        case 'custom': deliveryTime = '5-7 days'; break;
                    }
                    break;
            }
            
            const deliveryTimeEl = document.getElementById('delivery-time');
            if (deliveryTimeEl) deliveryTimeEl.textContent = deliveryTime;

            // Update revisions
            let revisions = '2 included';
            if (complexityLevel === 'premium' || complexityLevel === 'custom') {
                revisions = '3 included';
            }
            
            const revisionCountEl = document.getElementById('revision-count');
            if (revisionCountEl) revisionCountEl.textContent = revisions;
        }

        // Event listeners
        videoLength.addEventListener('input', updateCalculator);
        complexity.addEventListener('change', updateCalculator);
        urgency.addEventListener('change', updateCalculator);
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateCalculator);
        });

        // Initial calculation
        updateCalculator();
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        background: ${type === 'success' ? '#00b894' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        margin-bottom: 10px;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
        pointer-events: all;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.portfolio-item, .service-card, .skill-category, .advantage-card, .project-card');
    animateElements.forEach(el => observer.observe(el));
}

// Modal functionality
function setupModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        // Close modal when clicking outside
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
}

function openVideoModal(videoId) {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video');
    const placeholder = document.querySelector('.video-placeholder');
    
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Try to load the video
        const videoSource = `assets/videos/${videoId}.mp4`;
        if (video) {
            video.style.display = 'none';
            video.src = videoSource;
            
            video.addEventListener('loadeddata', function() {
                video.style.display = 'block';
                if (placeholder) placeholder.style.display = 'none';
            });
            
            video.addEventListener('error', function() {
                video.style.display = 'none';
                if (placeholder) {
                    placeholder.style.display = 'block';
                    placeholder.innerHTML = `
                        <i class="fas fa-video"></i>
                        <p>Video Coming Soon</p>
                        <small>This video is being prepared and will be available shortly.</small>
                    `;
                }
            });
        }
    }
}

function closeModal() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        if (video) {
            video.pause();
            video.src = '';
        }
    }
}

// Smooth scrolling
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle same-page links
            if (href.startsWith('#') && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Utility functions
function generateQuote() {
    const totalPriceEl = document.getElementById('total-price');
    const deliveryTimeEl = document.getElementById('delivery-time');
    
    if (totalPriceEl && deliveryTimeEl) {
        const totalPrice = totalPriceEl.textContent;
        const deliveryTime = deliveryTimeEl.textContent;
        
        const message = `Hi Devaansh! I'd like to get a detailed quote for a VFX project. Based on the calculator, the estimate is ${totalPrice} with delivery in ${deliveryTime}. Can we discuss the details?`;
        
        window.open(`https://wa.me/+916265954576?text=${encodeURIComponent(message)}`, '_blank');
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    .navbar.scrolled {
        background: rgba(26, 26, 46, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(style);