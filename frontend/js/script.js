// Global variables
let currentFilter = 'all';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// Initialize website functionality
function initializeWebsite() {
    setupNavigation();
    setupPortfolioFilters();
    setupContactForm();
    setupScrollAnimations();
    setupModal();
    setupSmoothScrolling();
    setupReviewSystem();
    // Ensure DOM is ready for calculator
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(setupProjectCalculator, 200);
            setTimeout(updateAvailabilityStatus, 100);
        });
    } else {
        setTimeout(setupProjectCalculator, 200);
        setTimeout(updateAvailabilityStatus, 100);
    }
}

// Navigation functionality
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Portfolio filters
function setupPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

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

// Contact form handling
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleContactFormSubmission();
    });
}

async function handleContactFormSubmission() {
    const form = document.getElementById('contactForm');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.innerHTML = '<span class="loading"></span> Sending...';
    submitButton.disabled = true;
    
    try {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
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
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#00b894' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.portfolio-item, .skill-item, .contact-item, .stat-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Animate skill bars when in view
    const skillBars = document.querySelectorAll('.skill-progress');
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.style.width || '0%';
                skillObserver.unobserve(entry.target);
            }
        });
    });
    
    skillBars.forEach(bar => skillObserver.observe(bar));
}

// Modal functionality
function setupModal() {
    const modal = document.getElementById('videoModal');
    const closeBtn = modal.querySelector('.close');
    
    // Ensure the close button exists and add event listener
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
        });
    }
    
    // Click outside modal to close
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function openVideoModal(videoId) {
    const modal = document.getElementById('videoModal');
    const videoContainer = document.getElementById('videoContainer');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    
    console.log('Opening video modal for:', videoId); // Debug log
    
    // Video file mapping with thumbnails
    const videoFiles = {
        '21-days-of-code': {
            type: 'drive',
            driveLink: 'https://drive.google.com/file/d/1ms_g7NX6fCiV8KZba6Y52i_rBxXu_mfn/view?usp=drive_link',
            title: '21 Days of Code',
            subtitle: 'Coding Journey & Development Process',
            gradient: 'linear-gradient(135deg, #00ff88 0%, #00b4db 50%, #0083b0 100%)',
            glow: 'rgba(0, 255, 136, 0.4)'
        },
        'treasure-hunt': {
            type: 'drive',
            driveLink: 'https://drive.google.com/file/d/1NUD5HSXHSATJi2B4u-qqCQxGZgGLRyZ7/view?usp=sharing',
            title: 'Treasure Hunt',
            subtitle: 'Adventure Quest & Visual Effects',
            gradient: 'linear-gradient(135deg, #d4af37 0%, #f4e99b 50%, #d4af37 100%)',
            glow: 'rgba(212, 175, 55, 0.4)'
        },
        'odyssey-event': {
            type: 'drive',
            driveLink: 'https://drive.google.com/file/d/1HKUJKu2R4FIOmBKfyCac-0oiObhsOJtv/view?usp=sharing',
            title: 'ODYSSEY',
            subtitle: '7 Events Competition Coverage',
            gradient: 'linear-gradient(135deg, #4a4af0 0%, #8a2be2 50%, #00bfff 100%)',
            glow: 'rgba(74, 74, 240, 0.4)'
        }
    };
    
    const videoData = videoFiles[videoId];
    console.log('Video data:', videoData); // Debug log
    
    if (videoData) {
        // Set modal title and subtitle
        modalTitle.textContent = videoData.title;
        modalSubtitle.textContent = videoData.subtitle;
        
        // Create a themed thumbnail style
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
        
        // Handle Google Drive links differently
        if (videoData.type === 'drive') {
            // Create Google Drive link interface
            videoContainer.innerHTML = `
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
            
            // Show modal
            modal.style.display = 'block';
            setTimeout(() => modal.classList.add('show'), 10);
            return;
        }
        
        videoContainer.innerHTML = `
            <div id="thumbnailContainer" style="${thumbnailStyle}"
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
                        <i class="fas fa-play" style="font-size: 2.5rem; margin-left: 5px; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);"></i>
                    </div>
                    <div style="font-size: 1.8rem; font-weight: 700; margin-bottom: 0.5rem; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);">
                        ${videoData.title}
                    </div>
                    <div style="font-size: 1rem; opacity: 0.9; font-style: italic; text-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);">
                        Click to play video
                    </div>
                </div>
            </div>
            <div id="videoPlayerContainer" style="display: none;">
                <video controls style="
                    width: 100%; 
                    max-height: 500px; 
                    border-radius: 15px; 
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(212, 175, 55, 0.2);
                " autoplay>
                    <source src="${videoData.video}" type="video/mp4">
                    <p style="color: rgba(255, 255, 255, 0.8);">Your browser does not support the video tag. <a href="${videoData.video}" download style="color: #d4af37;">Download the video</a></p>
                </video>
            </div>
        `;
        
        // Add click handler to thumbnail
        const thumbnailContainer = videoContainer.querySelector('#thumbnailContainer');
        const videoPlayerContainer = videoContainer.querySelector('#videoPlayerContainer');
        
        thumbnailContainer.addEventListener('click', function() {
            thumbnailContainer.style.display = 'none';
            videoPlayerContainer.style.display = 'block';
            modalSubtitle.textContent = 'Now Playing';
            
            // Start playing the video
            const video = videoPlayerContainer.querySelector('video');
            video.play();
        });
        
        // Add event listener to check if video loads
        const video = videoContainer.querySelector('video');
        video.addEventListener('error', function(e) {
            console.error('Video failed to load:', e);
            videoPlayerContainer.innerHTML = `
                <div style="
                    padding: 3rem; 
                    text-align: center; 
                    color: #e74c3c;
                    background: rgba(231, 76, 60, 0.1);
                    border-radius: 15px;
                    border: 1px solid rgba(231, 76, 60, 0.3);
                ">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <h4 style="margin-bottom: 1rem;">Video Not Found</h4>
                    <p>Could not load: ${videoData.video}</p>
                    <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-top: 1rem;"></i>
                </div>
            `;
        });
        
        video.addEventListener('loadedmetadata', function() {
            console.log('Video loaded successfully:', videoData.video);
        });
        
    } else {
        videoContainer.innerHTML = `
            <div style="padding: 2rem; text-align: center;">
                <h3>Video: ${videoId}</h3>
                <p>Video file mapping not found for this project.</p>
                <p>Available videos: ${Object.keys(videoFiles).join(', ')}</p>
                <div style="margin-top: 1rem;">
                    <i class="fas fa-video" style="font-size: 3rem; color: #6c5ce7; opacity: 0.5;"></i>
                </div>
            </div>
        `;
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('videoModal');
    
    // Add smooth transition out
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Stop any playing videos
        const videoContainer = document.getElementById('videoContainer');
        if (videoContainer) {
            const videos = videoContainer.querySelectorAll('video');
            videos.forEach(video => {
                video.pause();
                video.currentTime = 0;
            });
        }
    }, 300);
}

// Smooth scrolling
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link, .btn[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 70;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add typing effect for hero text
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            // Wait 2 seconds then restart the animation
            setTimeout(() => {
                i = 0;
                element.textContent = '';
                type();
            }, 2000);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', function() {
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        typeWriter(heroTitle, originalText, 80);
    }
});

// Parallax effect for hero section - minimized to prevent gap issues
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    // Only apply minimal parallax to prevent gap issues
    if (hero) {
        const rate = scrolled * -0.2; // Reduced from -0.5
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
    }
`;
document.head.appendChild(style);

// Project Calculator Functions
function setupProjectCalculator() {
    console.log('Attempting to setup calculator...');
    
    // Wait a bit more and try multiple times if needed
    let attempts = 0;
    const maxAttempts = 5;
    
    function trySetup() {
        attempts++;
        console.log(`Calculator setup attempt ${attempts}`);
        
        const lengthSlider = document.getElementById('video-length');
        const lengthDisplay = document.getElementById('length-display');
        const complexitySelect = document.getElementById('complexity');
        const urgencySelect = document.getElementById('urgency');
        
        if (!lengthSlider || !lengthDisplay || !complexitySelect || !urgencySelect) {
            console.log('Calculator elements not found:', {
                slider: !!lengthSlider,
                display: !!lengthDisplay,
                complexity: !!complexitySelect,
                urgency: !!urgencySelect
            });
            
            if (attempts < maxAttempts) {
                setTimeout(trySetup, 500);
                return;
            } else {
                console.log('Calculator not available on this page or failed to load');
                return;
            }
        }
        
        console.log('All calculator elements found, setting up events...');
        
        // Remove existing event listeners first
        lengthSlider.removeEventListener('input', handleSliderChange);
        complexitySelect.removeEventListener('change', handleComplexityChange);
        urgencySelect.removeEventListener('change', handleUrgencyChange);
        
        // Add event listeners
        lengthSlider.addEventListener('input', handleSliderChange);
        complexitySelect.addEventListener('change', handleComplexityChange);
        urgencySelect.addEventListener('change', handleUrgencyChange);
        
        // Setup checkbox listeners for the correct IDs
        const checkboxes = document.querySelectorAll('#scriptwriting, #voiceover, #subtitles, #consultation');
        checkboxes.forEach(checkbox => {
            checkbox.removeEventListener('change', handleCheckboxChange);
            checkbox.addEventListener('change', handleCheckboxChange);
        });
        
        // Initial setup
        updateLengthDisplay();
        calculatePrice();
        console.log('Calculator setup complete!');
    }
    
    trySetup();
}

function handleSliderChange(event) {
    console.log('Slider changed to:', event.target.value);
    updateLengthDisplay();
    calculatePrice();
}

function handleComplexityChange(event) {
    console.log('Complexity changed to:', event.target.value);
    calculatePrice();
}

function handleUrgencyChange(event) {
    console.log('Urgency changed to:', event.target.value);
    calculatePrice();
}

function handleCheckboxChange(event) {
    console.log('Checkbox changed:', event.target.id, event.target.checked);
    calculatePrice();
}

function updateLengthDisplay() {
    const lengthSlider = document.getElementById('video-length');
    const lengthDisplay = document.getElementById('length-display');
    
    if (!lengthSlider || !lengthDisplay) {
        console.log('Length elements not found');
        return;
    }
    
    const totalSeconds = parseInt(lengthSlider.value);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    let displayText;
    if (minutes > 0) {
        displayText = seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
        displayText = `${seconds} seconds`;
    }
    
    lengthDisplay.textContent = displayText;
    console.log('Length display updated to:', displayText);
}

function calculatePrice() {
    console.log('Starting price calculation...');
    
    const lengthSlider = document.getElementById('video-length');
    const complexitySelect = document.getElementById('complexity');
    const urgencySelect = document.getElementById('urgency');
    const scriptwriting = document.getElementById('scriptwriting');
    const voiceoverCheck = document.getElementById('voiceover');
    const subtitlesCheck = document.getElementById('subtitles');
    const consultationCheck = document.getElementById('consultation');
    
    // Price display elements
    const basePriceEl = document.getElementById('base-price');
    const additionalCostsEl = document.getElementById('additional-costs');
    const urgencyCostEl = document.getElementById('urgency-cost');
    const totalPriceEl = document.getElementById('total-price');
    
    if (!lengthSlider || !complexitySelect || !urgencySelect) {
        console.log('Required calculator elements not found:', {
            slider: !!lengthSlider,
            complexity: !!complexitySelect,
            urgency: !!urgencySelect
        });
        return;
    }
    
    // Get current values
    const length = parseInt(lengthSlider.value) || 180;
    const complexity = complexitySelect.value || 'basic';
    const urgency = urgencySelect.value || 'standard';
    
    console.log('Calculator inputs:', { length, complexity, urgency });
    
    // Base pricing
    const basePrices = {
        basic: 999,
        standard: 2499,
        premium: 4999,
        custom: 7999
    };
    
    let basePrice = basePrices[complexity] || 999;
    
    // Length multiplier for longer videos
    if (length > 300) { // Over 5 minutes
        const extraMinutes = Math.ceil((length - 300) / 60);
        basePrice += extraMinutes * 200;
    }
    
    // Additional services
    let additionalCosts = 0;
    if (scriptwriting && scriptwriting.checked) additionalCosts += 500;
    if (voiceoverCheck && voiceoverCheck.checked) additionalCosts += 800;
    if (subtitlesCheck && subtitlesCheck.checked) additionalCosts += 300;
    if (consultationCheck && consultationCheck.checked) additionalCosts += 400;
    
    // Urgency modifier
    let urgencyModifier = 1;
    let urgencyCost = 0;
    if (urgency === 'fast') {
        urgencyModifier = 1.2;
        urgencyCost = Math.round((basePrice + additionalCosts) * 0.2);
    } else if (urgency === 'rush') {
        urgencyModifier = 1.5;
        urgencyCost = Math.round((basePrice + additionalCosts) * 0.5);
    }
    
    const totalPrice = Math.round((basePrice + additionalCosts) * urgencyModifier);
    
    // Update display elements
    if (basePriceEl) basePriceEl.textContent = `₹${basePrice.toLocaleString()}`;
    if (additionalCostsEl) additionalCostsEl.textContent = `₹${additionalCosts.toLocaleString()}`;
    if (urgencyCostEl) urgencyCostEl.textContent = urgencyCost > 0 ? `+₹${urgencyCost.toLocaleString()}` : '₹0';
    if (totalPriceEl) totalPriceEl.textContent = `₹${totalPrice.toLocaleString()}`;
    
    // Update timeline info
    const deliveryTimes = {
        basic: '2-3 days',
        standard: '3-4 days',
        premium: '4-5 days',
        custom: '5-7 days'
    };
    
    const revisions = {
        basic: '2 included',
        standard: '3 included',
        premium: '4 included',
        custom: 'Unlimited*'
    };
    
    let deliveryTime = deliveryTimes[complexity] || '2-3 days';
    if (urgency === 'fast') deliveryTime = '2-3 days';
    if (urgency === 'rush') deliveryTime = '24-48 hours';
    
    const deliveryTimeEl = document.getElementById('delivery-time');
    const revisionCountEl = document.getElementById('revision-count');
    
    if (deliveryTimeEl) deliveryTimeEl.textContent = deliveryTime;
    if (revisionCountEl) revisionCountEl.textContent = revisions[complexity] || '2 included';
    
    console.log('Price calculation complete:', {
        basePrice,
        additionalCosts,
        urgencyCost,
        totalPrice
    });
    
    return totalPrice;
}

function generateQuote() {
    const length = document.getElementById('video-length').value;
    const complexity = document.getElementById('complexity').value;
    const urgency = document.getElementById('urgency').value;
    const totalPrice = document.getElementById('total-price').textContent;
    const deliveryTime = document.getElementById('delivery-time').textContent;
    
    const quoteMessage = `Hi Devaansh! I'm interested in your VFX services.

Project Details:
- Video Length: ${Math.floor(length/60)} minutes ${length%60} seconds
- Complexity: ${complexity.charAt(0).toUpperCase() + complexity.slice(1)}
- Timeline: ${urgency}
- Estimated Price: ${totalPrice}
- Delivery: ${deliveryTime}

Can we discuss this project further?`;

    const encodedMessage = encodeURIComponent(quoteMessage);
    const whatsappURL = `https://wa.me/+916265954576?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

// Availability Status Updates
function updateAvailabilityStatus() {
    // This would typically connect to a real-time system
    // For now, we'll simulate dynamic status
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-text');
    
    if (!statusDot) return;
    
    // Simulate availability status (in real app, this would be dynamic)
    const currentHour = new Date().getHours();
    const isWorkingHours = currentHour >= 9 && currentHour <= 22; // 9 AM to 10 PM
    
    if (isWorkingHours) {
        statusDot.style.background = '#00ff88';
        statusText.textContent = 'Available for projects';
        statusText.style.color = '#00ff88';
    } else {
        statusDot.style.background = '#ffa500';
        statusText.textContent = 'Away (will respond soon)';
        statusText.style.color = '#ffa500';
    }
}

// Update availability every 30 minutes
setInterval(updateAvailabilityStatus, 30 * 60 * 1000);

// Additional fallback initialization for calculator
window.addEventListener('load', function() {
    console.log('Window fully loaded, doing final calculator check...');
    setTimeout(setupProjectCalculator, 100);
});

// Review System Functions
function setupReviewSystem() {
    console.log('Setting up review system...');
    
    const starRating = document.getElementById('starRating');
    const ratingInput = document.getElementById('rating');
    const reviewForm = document.getElementById('reviewForm');
    
    if (!starRating || !ratingInput || !reviewForm) {
        console.log('Review system elements not found on this page');
        return;
    }
    
    // Setup star rating
    const stars = starRating.querySelectorAll('.star');
    let currentRating = 0;
    
    stars.forEach((star, index) => {
        star.addEventListener('click', function() {
            currentRating = index + 1;
            ratingInput.value = currentRating;
            updateStars(currentRating);
        });
        
        star.addEventListener('mouseover', function() {
            updateStars(index + 1);
        });
    });
    
    starRating.addEventListener('mouseleave', function() {
        updateStars(currentRating);
    });
    
    function updateStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }
    
    // Setup form submission
    reviewForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitReview();
    });
    
    // Load approved reviews on page load
    loadApprovedReviews();
    
    // Check for pending reviews and show admin notifications
    checkPendingReviews();
    
    console.log('Review system setup complete');
}

function checkPendingReviews() {
    const pendingReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
    if (pendingReviews.length > 0) {
        // Show notification about pending reviews
        setTimeout(() => {
            showNotification(`You have ${pendingReviews.length} pending review(s) for approval`, 'info');
        }, 2000);
    }
}

function submitReview() {
    const form = document.getElementById('reviewForm');
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['clientName', 'projectType', 'rating', 'reviewText'];
    const allowPublish = document.getElementById('allowPublish').checked;
    
    for (let field of requiredFields) {
        if (!formData.get(field)) {
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return;
        }
    }
    
    if (!allowPublish) {
        alert('Please agree to publish the review to proceed');
        return;
    }
    
    // Create review object
    const reviewData = {
        id: 'review_' + Date.now(),
        name: formData.get('clientName'),
        company: formData.get('clientCompany') || '',
        website: formData.get('clientWebsite') || '',
        projectType: formData.get('projectType'),
        rating: parseInt(formData.get('rating')),
        reviewText: formData.get('reviewText'),
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toISOString(),
        status: 'pending',
        approved: false
    };
    
    // Store in pending reviews
    storePendingReview(reviewData);
    
    // Send email notification to admin
    sendEmailNotification(reviewData);
    
    // Clear form
    form.reset();
    document.getElementById('rating').value = '';
    document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
    
    // Show success message to user
    alert('Thank you for your review! It has been submitted for approval and will appear on the website once approved.');
    
    console.log('Review submitted for approval:', reviewData);
}

function storePendingReview(reviewData) {
    // Store in localStorage for persistence
    let pendingReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
    pendingReviews.push(reviewData);
    localStorage.setItem('pendingReviews', JSON.stringify(pendingReviews));
    
    // Store approved reviews separately
    let approvedReviews = JSON.parse(localStorage.getItem('approvedReviews') || '[]');
    localStorage.setItem('approvedReviews', JSON.stringify(approvedReviews));
}

function sendEmailNotification(reviewData) {
    // Email notification using EmailJS or similar service
    // For now, we'll use a mailto link as a fallback
    const emailSubject = `New Review Submission - ${reviewData.name}`;
    const emailBody = `
New Review Received:

Client: ${reviewData.name}
Company: ${reviewData.company || 'Not provided'}
Project Type: ${reviewData.projectType}
Rating: ${reviewData.rating}/5 stars
Website: ${reviewData.website || 'Not provided'}

Review:
"${reviewData.reviewText}"

Submitted: ${reviewData.timestamp}

To approve this review, visit your website admin panel.
Review ID: ${reviewData.id}
    `.trim();
    
    // Create email notification
    console.log('Email notification would be sent:', {
        to: 'devkush2006@outlook.com',
        subject: emailSubject,
        body: emailBody
    });
    
    // For immediate implementation, create a notification for the admin
    showAdminNotification(reviewData);
}

function showAdminNotification(reviewData) {
    // Show notification in admin panel
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.innerHTML = `
        <div class="notification-header">
            <i class="fas fa-bell"></i>
            <strong>New Review Pending Approval</strong>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
        <div class="notification-content">
            <p><strong>${reviewData.name}</strong> - ${reviewData.rating}★</p>
            <p>"${reviewData.reviewText.substring(0, 100)}${reviewData.reviewText.length > 100 ? '...' : ''}"</p>
            <div class="notification-actions">
                <button onclick="approveReview('${reviewData.id}')" class="btn approve-btn">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button onclick="rejectReview('${reviewData.id}')" class="btn reject-btn">
                    <i class="fas fa-times"></i> Reject
                </button>
            </div>
        </div>
    `;
    
    // Add to admin controls or create notification area
    document.body.appendChild(notification);
    
    // Auto-remove after 30 seconds if no action taken
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 30000);
}

function approveReview(reviewId) {
    let pendingReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
    let approvedReviews = JSON.parse(localStorage.getItem('approvedReviews') || '[]');
    
    // Find the review
    const reviewIndex = pendingReviews.findIndex(review => review.id === reviewId);
    if (reviewIndex === -1) {
        showNotification('Review not found', 'error');
        return;
    }
    
    const review = pendingReviews[reviewIndex];
    review.approved = true;
    review.approvedDate = new Date().toISOString();
    
    // Move to approved list
    approvedReviews.push(review);
    pendingReviews.splice(reviewIndex, 1);
    
    // Update storage
    localStorage.setItem('pendingReviews', JSON.stringify(pendingReviews));
    localStorage.setItem('approvedReviews', JSON.stringify(approvedReviews));
    
    // Add to display
    addReviewToDisplay(review);
    
    // Remove notification
    document.querySelectorAll('.admin-notification').forEach(notification => {
        if (notification.innerHTML.includes(reviewId)) {
            notification.remove();
        }
    });
    
    showNotification('Review approved and published', 'success');
    console.log('Review approved:', reviewId);
}

function rejectReview(reviewId) {
    if (!confirm('Are you sure you want to reject this review? It will be permanently deleted.')) {
        return;
    }
    
    let pendingReviews = JSON.parse(localStorage.getItem('pendingReviews') || '[]');
    const reviewIndex = pendingReviews.findIndex(review => review.id === reviewId);
    
    if (reviewIndex === -1) {
        showNotification('Review not found', 'error');
        return;
    }
    
    // Remove from pending
    pendingReviews.splice(reviewIndex, 1);
    localStorage.setItem('pendingReviews', JSON.stringify(pendingReviews));
    
    // Remove notification
    document.querySelectorAll('.admin-notification').forEach(notification => {
        if (notification.innerHTML.includes(reviewId)) {
            notification.remove();
        }
    });
    
    showNotification('Review rejected and deleted', 'success');
    console.log('Review rejected:', reviewId);
}

function loadApprovedReviews() {
    // Load and display approved reviews on page load
    const approvedReviews = JSON.parse(localStorage.getItem('approvedReviews') || '[]');
    const reviewsDisplay = document.getElementById('reviewsDisplay');
    
    if (approvedReviews.length === 0) {
        return; // Keep placeholder
    }
    
    // Clear placeholder
    reviewsDisplay.innerHTML = '';
    
    // Add each approved review
    approvedReviews.forEach(review => {
        addReviewToDisplay(review);
    });
}

function addReviewToDisplay(reviewData) {
    const reviewsDisplay = document.getElementById('reviewsDisplay');
    const placeholder = reviewsDisplay.querySelector('.review-placeholder');
    
    // Generate unique ID for this review
    const reviewId = 'review_' + Date.now();
    
    // Create star display
    const starsHtml = '★'.repeat(reviewData.rating) + '☆'.repeat(5 - reviewData.rating);
    
    // Create review HTML with delete button
    const reviewHtml = `
        <div class="review-item" id="${reviewId}">
            <div class="review-header">
                <div class="quote-icon">
                    <i class="fas fa-quote-left"></i>
                </div>
                <button class="delete-review-btn" onclick="deleteReview('${reviewId}')" title="Delete this review">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="review-rating" style="color: #ffd700; font-size: 1.5rem; margin-bottom: 15px;">
                ${starsHtml}
            </div>
            <p>"${reviewData.reviewText}"</p>
            <div class="client-info">
                <div class="client-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="client-details">
                    <h4>${reviewData.name}</h4>
                    <span>${reviewData.projectType}${reviewData.company ? ' • ' + reviewData.company : ''}</span>
                    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-top: 5px;">
                        ${reviewData.date}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Replace placeholder or add to existing reviews
    if (placeholder) {
        placeholder.outerHTML = reviewHtml;
    } else {
        reviewsDisplay.insertAdjacentHTML('beforeend', reviewHtml);
    }
    
    console.log('Review added to display:', reviewData);
}

// Review Management Functions
function deleteReview(reviewId) {
    // Confirm deletion
    if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
        const reviewElement = document.getElementById(reviewId);
        if (reviewElement) {
            reviewElement.remove();
            console.log('Review deleted:', reviewId);
            
            // Check if no reviews left, show placeholder
            const reviewsDisplay = document.getElementById('reviewsDisplay');
            const remainingReviews = reviewsDisplay.querySelectorAll('.review-item');
            
            if (remainingReviews.length === 0) {
                showReviewPlaceholder();
            }
            
            // Show success message
            showNotification('Review deleted successfully', 'success');
        }
    }
}

function showReviewPlaceholder() {
    const reviewsDisplay = document.getElementById('reviewsDisplay');
    const placeholderHtml = `
        <div class="review-placeholder">
            <div class="quote-icon">
                <i class="fas fa-quote-left"></i>
            </div>
            <h3>Be the First to Review!</h3>
            <p>"Your feedback will be featured here. Share your experience working with me and help other clients make informed decisions."</p>
            <div class="client-info">
                <div class="client-avatar">
                    <i class="fas fa-user-plus"></i>
                </div>
                <div class="client-details">
                    <h4>Your Name Here</h4>
                    <span>Your Project Type</span>
                </div>
            </div>
        </div>
    `;
    reviewsDisplay.innerHTML = placeholderHtml;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Admin Functions for Review Management
function clearAllReviews() {
    if (confirm('Are you sure you want to delete ALL reviews? This action cannot be undone.')) {
        const reviewsDisplay = document.getElementById('reviewsDisplay');
        showReviewPlaceholder();
        showNotification('All reviews cleared', 'success');
        console.log('All reviews cleared');
    }
}

function exportReviews() {
    const reviews = document.querySelectorAll('.review-item');
    if (reviews.length === 0) {
        showNotification('No reviews to export', 'info');
        return;
    }
    
    const reviewData = [];
    
    reviews.forEach(review => {
        const name = review.querySelector('.client-details h4').textContent;
        const content = review.querySelector('p').textContent.replace(/"/g, '');
        const rating = review.querySelector('.review-rating').textContent.split('★').length - 1;
        const projectInfo = review.querySelector('.client-details span').textContent;
        const date = review.querySelector('.client-details div').textContent;
        
        reviewData.push({
            name,
            content,
            rating,
            projectInfo,
            date
        });
    });
    
    const dataStr = JSON.stringify(reviewData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'website-reviews.json';
    link.click();
    
    showNotification('Reviews exported successfully', 'success');
}

function toggleAdminPanel() {
    const adminControls = document.getElementById('adminControls');
    if (adminControls.style.display === 'none') {
        adminControls.style.display = 'block';
        showNotification('Admin panel activated', 'info');
    } else {
        adminControls.style.display = 'none';
        showNotification('Admin panel hidden', 'info');
    }
}