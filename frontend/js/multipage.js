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
    const modalBody = document.querySelector('.modal-body');
    
    // Google Drive video links mapping
    const googleDriveVideos = {
        '21-days-of-code': {
            driveLink: 'https://drive.google.com/file/d/1ms_g7NX6fCiV8KZba6Y52i_rBxXu_mfn/view?usp=drive_link',
            title: '21 Days of Code',
            subtitle: 'Coding Journey & Development Process',
            gradient: 'linear-gradient(135deg, #00ff88 0%, #00b4db 50%, #0083b0 100%)',
            glow: 'rgba(0, 255, 136, 0.4)'
        },
        'treasure-hunt': {
            driveLink: 'https://drive.google.com/file/d/1NUD5HSXHSATJi2B4u-qqCQxGZgGLRyZ7/view?usp=drive_link',
            title: 'Treasure Hunt',
            subtitle: 'Adventure Quest & Visual Effects',
            gradient: 'linear-gradient(135deg, #d4af37 0%, #f4e99b 50%, #d4af37 100%)',
            glow: 'rgba(212, 175, 55, 0.4)'
        },
        'odyssey-event': {
            driveLink: 'https://drive.google.com/file/d/1HKUJKu2R4FIOmBKfyCac-0oiObhsOJtv/view?usp=drive_link',
            title: 'ODYSSEY - 7 Events',
            subtitle: '7 Events Competition Coverage',
            gradient: 'linear-gradient(135deg, #4a4af0 0%, #8a2be2 50%, #00bfff 100%)',
            glow: 'rgba(74, 74, 240, 0.4)'
        }
    };
    
    if (modal && modalBody) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Check if it's a Google Drive video
        if (googleDriveVideos[videoId]) {
            const videoData = googleDriveVideos[videoId];
            
            // Create styled Google Drive link interface
            const thumbnailStyle = `
                background: ${videoData.gradient};
                width: 100%;
                height: 350px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
                font-weight: bold;
                text-align: center;
                border-radius: 15px;
                position: relative;
                cursor: pointer;
                margin-bottom: 1rem;
                box-shadow: 
                    0 10px 30px rgba(0, 0, 0, 0.5),
                    0 0 50px ${videoData.glow};
                transition: all 0.3s ease;
                border: 2px solid rgba(255, 255, 255, 0.1);
            `;
            
            modalBody.innerHTML = `
                <div style="${thumbnailStyle}"
                     onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 15px 40px rgba(0, 0, 0, 0.6), 0 0 70px ${videoData.glow}';"
                     onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 10px 30px rgba(0, 0, 0, 0.5), 0 0 50px ${videoData.glow}';">
                    <div style="text-align: center;">
                        <div style="
                            background: rgba(255, 255, 255, 0.2);
                            border-radius: 50%;
                            width: 100px;
                            height: 100px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 0 auto 1.5rem auto;
                            backdrop-filter: blur(10px);
                            border: 2px solid rgba(255, 255, 255, 0.3);
                        ">
                            <i class="fas fa-external-link-alt" style="font-size: 2.5rem; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);"></i>
                        </div>
                        <div style="font-size: 1.8rem; font-weight: 700; margin-bottom: 1rem; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);">
                            ${videoData.title}
                        </div>
                        <button onclick="window.open('${videoData.driveLink}', '_blank')" style="
                            background: linear-gradient(135deg, #4285f4 0%, #34a853 50%, #ea4335 100%);
                            color: white;
                            border: none;
                            padding: 15px 30px;
                            border-radius: 50px;
                            font-size: 1.1rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
                        " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0, 0, 0, 0.4)';" 
                           onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(0, 0, 0, 0.3)';">
                            <i class="fas fa-external-link-alt" style="margin-right: 8px;"></i>
                            Open Video in Google Drive
                        </button>
                        <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 1rem; text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);">
                            Video will open in a new tab
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Fallback for non-Google Drive videos
            modalBody.innerHTML = `
                <video id="modal-video" controls>
                    <source src="assets/videos/${videoId}.mp4" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="video-placeholder">
                    <i class="fas fa-video"></i>
                    <p>Video Coming Soon</p>
                    <small>This video is being prepared and will be available shortly.</small>
                </div>
            `;
        }
    }
}

function closeModal() {
    const modal = document.getElementById('video-modal');
    const video = document.getElementById('modal-video');
    const modalBody = document.querySelector('.modal-body');
    
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        if (video) {
            video.pause();
            video.src = '';
        }
        
        // Reset modal body to original video structure for future use
        if (modalBody) {
            modalBody.innerHTML = `
                <video id="modal-video" controls>
                    <source src="" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
                <div class="video-placeholder">
                    <i class="fas fa-video"></i>
                    <p>Video Coming Soon</p>
                    <small>This video is being prepared and will be available shortly.</small>
                </div>
            `;
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