/**
 * Liquid Ether - Advanced Interactive Background Animation System
 * Creates fluid, organic animations with particle systems and morphing shapes
 */

class LiquidEther {
    constructor(options = {}) {
        this.options = {
            container: options.container || 'body',
            intensity: options.intensity || 'medium', // low, medium, high
            colorTheme: options.colorTheme || 'gold', // gold, cyan, purple
            interactivity: options.interactivity !== false,
            particleCount: options.particleCount || 50,
            enableMouse: options.enableMouse !== false,
            enableTouch: options.enableTouch !== false,
            performance: options.performance || 'auto', // low, medium, high, auto
            ...options
        };

        this.container = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.particles = [];
        this.morphingShapes = [];
        this.isInitialized = false;
        this.animationId = null;
        this.performanceLevel = this.detectPerformance();

        this.init();
    }

    init() {
        this.container = document.querySelector(this.options.container);
        if (!this.container) {
            console.warn('LiquidEther: Container not found');
            return;
        }

        this.createBackground();
        this.setupEventListeners();
        this.createParticles();
        this.createMorphingShapes();
        this.startAnimation();
        this.isInitialized = true;

        console.log('LiquidEther: Initialized successfully');
    }

    detectPerformance() {
        if (this.options.performance !== 'auto') {
            return this.options.performance;
        }

        // Simple performance detection
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return 'low';
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            if (renderer.includes('Intel')) return 'medium';
            if (renderer.includes('NVIDIA') || renderer.includes('AMD')) return 'high';
        }

        // Fallback based on device memory if available
        if (navigator.deviceMemory) {
            if (navigator.deviceMemory >= 8) return 'high';
            if (navigator.deviceMemory >= 4) return 'medium';
            return 'low';
        }

        return 'medium';
    }

    createBackground() {
        const liquidBg = document.createElement('div');
        liquidBg.className = 'liquid-ether-bg';
        liquidBg.innerHTML = `
            <div class="liquid-mesh"></div>
            <div class="liquid-blob liquid-blob-1"></div>
            <div class="liquid-blob liquid-blob-2"></div>
            <div class="liquid-blob liquid-blob-3"></div>
            <div class="liquid-morph liquid-morph-1"></div>
            <div class="liquid-morph liquid-morph-2"></div>
            <div class="liquid-wave"></div>
            <div class="liquid-orb liquid-orb-1"></div>
            <div class="liquid-orb liquid-orb-2"></div>
            <div class="liquid-orb liquid-orb-3"></div>
            ${this.createStreams()}
            ${this.createInitialParticles()}
        `;

        this.container.appendChild(liquidBg);
        this.liquidBg = liquidBg;

        // Apply theme
        this.applyTheme(this.options.colorTheme);
    }

    createStreams() {
        const streamCount = this.performanceLevel === 'high' ? 6 : 
                           this.performanceLevel === 'medium' ? 4 : 2;
        
        let streams = '';
        for (let i = 0; i < streamCount; i++) {
            streams += `<div class="liquid-stream liquid-stream-${i + 1}"></div>`;
        }
        return streams;
    }

    createInitialParticles() {
        const particleCount = this.getParticleCount();
        let particles = '';
        
        for (let i = 0; i < particleCount; i++) {
            particles += `<div class="liquid-particle"></div>`;
        }
        return particles;
    }

    getParticleCount() {
        const baseCount = this.options.particleCount;
        if (this.performanceLevel === 'low') return Math.floor(baseCount * 0.3);
        if (this.performanceLevel === 'medium') return Math.floor(baseCount * 0.6);
        return baseCount;
    }

    setupEventListeners() {
        if (!this.options.interactivity) return;

        if (this.options.enableMouse) {
            document.addEventListener('mousemove', this.handleMouseMove.bind(this));
            document.addEventListener('mouseenter', this.handleMouseEnter.bind(this));
            document.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        }

        if (this.options.enableTouch) {
            document.addEventListener('touchmove', this.handleTouchMove.bind(this));
            document.addEventListener('touchstart', this.handleTouchStart.bind(this));
            document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        }

        // Window events
        window.addEventListener('resize', this.handleResize.bind(this));
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }

    handleMouseMove(e) {
        this.mouseX = e.clientX / window.innerWidth;
        this.mouseY = e.clientY / window.innerHeight;
        this.updateMouseInteraction();
    }

    handleTouchMove(e) {
        if (e.touches.length > 0) {
            this.mouseX = e.touches[0].clientX / window.innerWidth;
            this.mouseY = e.touches[0].clientY / window.innerHeight;
            this.updateMouseInteraction();
        }
    }

    handleMouseEnter() {
        this.liquidBg?.classList.add('mouse-active');
    }

    handleMouseLeave() {
        this.liquidBg?.classList.remove('mouse-active');
    }

    handleTouchStart(e) {
        this.handleMouseEnter();
        this.handleTouchMove(e);
    }

    handleTouchEnd() {
        this.handleMouseLeave();
    }

    updateMouseInteraction() {
        if (!this.liquidBg) return;

        const blobs = this.liquidBg.querySelectorAll('.liquid-blob');
        const morphs = this.liquidBg.querySelectorAll('.liquid-morph');

        blobs.forEach((blob, index) => {
            const factor = (index + 1) * 0.1;
            const moveX = (this.mouseX - 0.5) * 30 * factor;
            const moveY = (this.mouseY - 0.5) * 30 * factor;
            
            blob.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });

        morphs.forEach((morph, index) => {
            const factor = (index + 1) * 0.15;
            const moveX = (this.mouseX - 0.5) * 20 * factor;
            const moveY = (this.mouseY - 0.5) * 20 * factor;
            
            morph.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    }

    handleResize() {
        // Throttled resize handling
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.updateLayout();
        }, 250);
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAnimation();
        } else {
            this.resumeAnimation();
        }
    }

    updateLayout() {
        // Recalculate responsive elements
        if (this.liquidBg) {
            const particles = this.liquidBg.querySelectorAll('.liquid-particle');
            particles.forEach(particle => {
                this.randomizeParticle(particle);
            });
        }
    }

    createParticles() {
        this.particles = [];
        const particleElements = this.liquidBg?.querySelectorAll('.liquid-particle') || [];
        
        particleElements.forEach(element => {
            this.randomizeParticle(element);
            this.particles.push({
                element,
                x: Math.random(),
                y: Math.random(),
                vx: (Math.random() - 0.5) * 0.001,
                vy: (Math.random() - 0.5) * 0.001,
                life: Math.random()
            });
        });
    }

    randomizeParticle(particle) {
        const left = Math.random() * 100;
        const animationDelay = Math.random() * 20;
        const animationDuration = 8 + Math.random() * 8;
        
        particle.style.left = `${left}%`;
        particle.style.animationDelay = `${-animationDelay}s`;
        particle.style.animationDuration = `${animationDuration}s`;
    }

    createMorphingShapes() {
        this.morphingShapes = [];
        const morphElements = this.liquidBg?.querySelectorAll('.liquid-morph') || [];
        
        morphElements.forEach(element => {
            this.morphingShapes.push({
                element,
                phase: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.03
            });
        });
    }

    startAnimation() {
        if (this.animationId) return;
        
        const animate = () => {
            this.updateAnimation();
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    updateAnimation() {
        // Update morphing shapes
        this.morphingShapes.forEach(shape => {
            shape.phase += shape.speed;
            const scale = 1 + Math.sin(shape.phase) * 0.1;
            const rotation = Math.sin(shape.phase * 0.5) * 5;
            
            shape.element.style.transform += ` scale(${scale}) rotate(${rotation}deg)`;
        });

        // Update particles (if custom animation needed)
        if (this.performanceLevel === 'high') {
            this.updateAdvancedParticles();
        }
    }

    updateAdvancedParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life += 0.01;

            // Boundary check
            if (particle.x < 0 || particle.x > 1) particle.vx *= -1;
            if (particle.y < 0 || particle.y > 1) particle.vy *= -1;

            // Update position
            particle.element.style.left = `${particle.x * 100}%`;
            particle.element.style.top = `${particle.y * 100}%`;
        });
    }

    pauseAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resumeAnimation() {
        if (!this.animationId) {
            this.startAnimation();
        }
    }

    applyTheme(theme) {
        if (!this.liquidBg) return;

        this.liquidBg.classList.remove('theme-gold', 'theme-cyan', 'theme-purple');
        this.liquidBg.classList.add(`theme-${theme}`);
    }

    setIntensity(intensity) {
        this.options.intensity = intensity;
        
        const elements = this.liquidBg?.querySelectorAll('.liquid-blob, .liquid-morph') || [];
        elements.forEach(element => {
            element.classList.remove('intensity-low', 'intensity-medium', 'intensity-high');
            element.classList.add(`intensity-${intensity}`);
        });
    }

    destroy() {
        this.pauseAnimation();
        
        // Remove event listeners
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('touchmove', this.handleTouchMove);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('visibilitychange', this.handleVisibilityChange);
        
        // Remove DOM elements
        if (this.liquidBg && this.liquidBg.parentNode) {
            this.liquidBg.parentNode.removeChild(this.liquidBg);
        }
        
        this.isInitialized = false;
        console.log('LiquidEther: Destroyed');
    }

    // Public API methods
    getTheme() {
        return this.options.colorTheme;
    }

    setTheme(theme) {
        this.options.colorTheme = theme;
        this.applyTheme(theme);
    }

    getIntensity() {
        return this.options.intensity;
    }

    toggleInteractivity() {
        this.options.interactivity = !this.options.interactivity;
        
        if (this.options.interactivity) {
            this.setupEventListeners();
        }
    }

    isActive() {
        return this.isInitialized && this.animationId !== null;
    }

    getPerformanceLevel() {
        return this.performanceLevel;
    }
}

// Auto-initialize if data attribute is present
document.addEventListener('DOMContentLoaded', () => {
    const autoInit = document.querySelector('[data-liquid-ether]');
    if (autoInit) {
        const options = {};
        
        // Parse data attributes
        if (autoInit.dataset.liquidEtherTheme) {
            options.colorTheme = autoInit.dataset.liquidEtherTheme;
        }
        if (autoInit.dataset.liquidEtherIntensity) {
            options.intensity = autoInit.dataset.liquidEtherIntensity;
        }
        if (autoInit.dataset.liquidEtherContainer) {
            options.container = autoInit.dataset.liquidEtherContainer;
        }

        window.liquidEther = new LiquidEther(options);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LiquidEther;
}

// Global availability
window.LiquidEther = LiquidEther;
