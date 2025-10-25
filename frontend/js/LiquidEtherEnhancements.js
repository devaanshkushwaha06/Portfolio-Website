/**
 * Liquid Ether Enhancements - Advanced Interactive Features
 * Mouse trails, scroll effects, and dynamic interactions
 */

class LiquidEtherEnhancements {
    constructor(liquidEther) {
        this.liquidEther = liquidEther;
        this.mouseTrails = [];
        this.scrollPosition = 0;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }
    
    init() {
        if (this.isReducedMotion) return;
        
        this.setupMouseTrails();
        this.setupScrollEffects();
        this.setupIntersectionObserver();
        this.setupDynamicIntensity();
        this.addFloatingActionButton();
        this.enhanceButtons();
        
        console.log('LiquidEther: Enhancements loaded');
    }
    
    setupMouseTrails() {
        let lastTrailTime = 0;
        const trailDelay = 50; // milliseconds
        
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTrailTime < trailDelay) return;
            
            this.createMouseTrail(e.clientX, e.clientY);
            lastTrailTime = now;
        });
    }
    
    createMouseTrail(x, y) {
        const trail = document.createElement('div');
        trail.className = 'liquid-trail';
        trail.style.left = `${x}px`;
        trail.style.top = `${y}px`;
        
        document.body.appendChild(trail);
        
        // Remove trail after animation
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        }, 2000);
        
        // Limit number of trails
        this.mouseTrails.push(trail);
        if (this.mouseTrails.length > 15) {
            const oldTrail = this.mouseTrails.shift();
            if (oldTrail.parentNode) {
                oldTrail.parentNode.removeChild(oldTrail);
            }
        }
    }
    
    setupScrollEffects() {
        let ticking = false;
        
        const updateScrollEffects = () => {
            this.scrollPosition = window.pageYOffset;
            
            // Dynamic background intensity based on scroll
            if (this.liquidEther && this.liquidEther.liquidBg) {
                const scrollPercent = this.scrollPosition / (document.body.scrollHeight - window.innerHeight);
                const intensity = Math.min(1, scrollPercent * 2);
                
                this.liquidEther.liquidBg.style.filter = `saturate(${0.8 + intensity * 0.7}) brightness(${0.9 + intensity * 0.3})`;
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });
    }
    
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger liquid effect intensity change
                    if (this.liquidEther) {
                        this.liquidEther.setIntensity('high');
                        setTimeout(() => {
                            this.liquidEther.setIntensity('medium');
                        }, 2000);
                    }
                }
            });
        }, observerOptions);
        
        // Observe elements with animation classes
        const animatedElements = document.querySelectorAll('.liquid-reveal, .liquid-scale-in, .liquid-slide-left, .liquid-slide-right');
        animatedElements.forEach(el => observer.observe(el));
    }
    
    setupDynamicIntensity() {
        // Change intensity based on user activity
        let activityTimer;
        let isIdle = false;
        
        const resetActivityTimer = () => {
            clearTimeout(activityTimer);
            
            if (isIdle && this.liquidEther) {
                this.liquidEther.setIntensity('medium');
                isIdle = false;
            }
            
            activityTimer = setTimeout(() => {
                if (this.liquidEther) {
                    this.liquidEther.setIntensity('low');
                    isIdle = true;
                }
            }, 30000); // 30 seconds of inactivity
        };
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetActivityTimer, true);
        });
        
        resetActivityTimer();
    }
    
    addFloatingActionButton() {
        const fab = document.createElement('a');
        fab.className = 'liquid-fab';
        fab.href = '#home';
        fab.innerHTML = '<i class="fas fa-arrow-up"></i>';
        fab.title = 'Back to top';
        
        document.body.appendChild(fab);
        
        // Show/hide based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                fab.style.opacity = '1';
                fab.style.pointerEvents = 'auto';
            } else {
                fab.style.opacity = '0';
                fab.style.pointerEvents = 'none';
            }
        });
        
        // Smooth scroll to top
        fab.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    enhanceButtons() {
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.classList.add('liquid-enhanced');
            
            button.addEventListener('mouseenter', () => {
                if (this.liquidEther) {
                    this.liquidEther.setIntensity('high');
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (this.liquidEther) {
                    this.liquidEther.setIntensity('medium');
                }
            });
        });
    }
    
    addTextGlowEffect(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add('liquid-text-glow');
        });
    }
    
    createLoadingScreen() {
        const loader = document.createElement('div');
        loader.className = 'liquid-loading';
        loader.innerHTML = '<div class="liquid-loader"></div>';
        
        document.body.appendChild(loader);
        
        // Remove loading screen after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.parentNode.removeChild(loader);
                    }
                }, 1000);
            }, 500);
        });
    }
    
    // Advanced particle burst effect
    createParticleBurst(x, y, count = 12) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'liquid-trail';
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            const angle = (360 / count) * i;
            const distance = 50 + Math.random() * 50;
            const duration = 1000 + Math.random() * 1000;
            
            const endX = x + Math.cos(angle * Math.PI / 180) * distance;
            const endY = y + Math.sin(angle * Math.PI / 180) * distance;
            
            document.body.appendChild(particle);
            
            // Animate particle
            particle.animate([
                { transform: 'translate(0, 0) scale(1)', opacity: 0.8 },
                { transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            };
        }
    }
    
    // Theme transition effects
    transitionTheme(newTheme) {
        if (!this.liquidEther) return;
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, var(--liquid-${newTheme}) 0%, transparent 70%);
            opacity: 0;
            pointer-events: none;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;
        
        document.body.appendChild(overlay);
        
        setTimeout(() => {
            overlay.style.opacity = '0.8';
        }, 50);
        
        setTimeout(() => {
            this.liquidEther.setTheme(newTheme);
            overlay.style.opacity = '0';
            
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 500);
        }, 300);
    }
    
    // Cleanup method
    destroy() {
        // Remove all trails
        this.mouseTrails.forEach(trail => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
        });
        
        // Remove floating action button
        const fab = document.querySelector('.liquid-fab');
        if (fab && fab.parentNode) {
            fab.parentNode.removeChild(fab);
        }
        
        console.log('LiquidEther: Enhancements destroyed');
    }
}

// Auto-initialization
document.addEventListener('DOMContentLoaded', () => {
    // Wait for LiquidEther to initialize
    setTimeout(() => {
        if (window.liquidEther) {
            window.liquidEtherEnhancements = new LiquidEtherEnhancements(window.liquidEther);
        }
    }, 1000);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LiquidEtherEnhancements;
}

window.LiquidEtherEnhancements = LiquidEtherEnhancements;