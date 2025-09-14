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
    
    closeBtn.addEventListener('click', closeModal);
    
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
            video: 'assets/videos/21-days-of-code.mp4',
            title: '21 Days of Code',
            subtitle: 'Coding Journey & Development Process',
            gradient: 'linear-gradient(135deg, #00ff88 0%, #00b4db 50%, #0083b0 100%)',
            glow: 'rgba(0, 255, 136, 0.4)'
        },
        'treasure-hunt': {
            video: 'assets/videos/treasure-hunt.mp4',
            title: 'Treasure Hunt',
            subtitle: 'Adventure Quest & Visual Effects',
            gradient: 'linear-gradient(135deg, #d4af37 0%, #f4e99b 50%, #d4af37 100%)',
            glow: 'rgba(212, 175, 55, 0.4)'
        },
        'odyssey-event': {
            video: 'assets/videos/7EVENTS(ODYSSEY).mp4',
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
        
        // Create a themed thumbnail
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
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Stop any playing videos
    const videoContainer = document.getElementById('videoContainer');
    const videos = videoContainer.querySelectorAll('video');
    videos.forEach(video => {
        video.pause();
        video.currentTime = 0;
    });
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

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
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