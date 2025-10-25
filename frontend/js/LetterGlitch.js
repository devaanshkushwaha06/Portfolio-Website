/**
 * LetterGlitch - Animated matrix-style background effect
 * Converted from React to vanilla JavaScript
 */
class LetterGlitch {
  constructor(options = {}) {
    this.config = {
      glitchColors: options.glitchColors || ['#ffd700', '#b8860b', '#daa520', '#f0c674', '#ffed4e'],
      className: options.className || '',
      glitchSpeed: options.glitchSpeed || 80,
      centerVignette: options.centerVignette || false,
      outerVignette: options.outerVignette !== false,
      smooth: options.smooth !== false,
      characters: options.characters || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789',
      opacity: options.opacity || 0.1,
      fontSize: options.fontSize || 14,
      charWidth: options.charWidth || 8,
      charHeight: options.charHeight || 16
    };

    this.state = {
      canvas: null,
      context: null,
      animationFrame: null,
      letters: [],
      grid: { columns: 0, rows: 0 },
      lastGlitchTime: Date.now(),
      isVisible: true,
      resizeTimeout: null
    };

    this.elements = {
      container: null,
      canvas: null,
      outerVignette: null,
      centerVignette: null
    };

    this.lettersAndSymbols = Array.from(this.config.characters);
    this.init();
  }

  init() {
    this.createElements();
    this.setupCanvas();
    this.setupEventListeners();
    this.resizeCanvas();
    this.animate();
  }

  createElements() {
    // Create container
    this.elements.container = document.createElement('div');
    this.elements.container.className = `letter-glitch-container ${this.config.className}`;
    this.elements.container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(26, 26, 46, 0.95);
      overflow: hidden;
      pointer-events: none;
      z-index: 1;
      opacity: ${this.config.opacity};
    `;

    // Create canvas
    this.elements.canvas = document.createElement('canvas');
    this.elements.canvas.style.cssText = `
      display: block;
      width: 100%;
      height: 100%;
    `;

    // Create outer vignette
    if (this.config.outerVignette) {
      this.elements.outerVignette = document.createElement('div');
      this.elements.outerVignette.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: radial-gradient(circle, rgba(26,26,46,0) 40%, rgba(26,26,46,0.8) 100%);
      `;
    }

    // Create center vignette
    if (this.config.centerVignette) {
      this.elements.centerVignette = document.createElement('div');
      this.elements.centerVignette.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background: radial-gradient(circle, rgba(26,26,46,0.9) 0%, rgba(26,26,46,0) 50%);
      `;
    }

    // Assemble elements
    this.elements.container.appendChild(this.elements.canvas);
    if (this.elements.outerVignette) {
      this.elements.container.appendChild(this.elements.outerVignette);
    }
    if (this.elements.centerVignette) {
      this.elements.container.appendChild(this.elements.centerVignette);
    }
  }

  setupCanvas() {
    this.state.canvas = this.elements.canvas;
    this.state.context = this.state.canvas.getContext('2d');
  }

  setupEventListeners() {
    this.handleResize = () => {
      clearTimeout(this.state.resizeTimeout);
      this.state.resizeTimeout = setTimeout(() => {
        this.cancelAnimation();
        this.resizeCanvas();
        this.animate();
      }, 100);
    };

    window.addEventListener('resize', this.handleResize);

    // Intersection Observer for performance optimization
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.state.isVisible = entry.isIntersecting;
        if (!this.state.isVisible) {
          this.cancelAnimation();
        } else if (!this.state.animationFrame) {
          this.animate();
        }
      });
    });

    this.observer.observe(this.elements.container);
  }

  calculateGrid(width, height) {
    const columns = Math.ceil(width / this.config.charWidth);
    const rows = Math.ceil(height / this.config.charHeight);
    return { columns, rows };
  }

  initializeLetters(columns, rows) {
    this.state.grid = { columns, rows };
    const totalLetters = columns * rows;
    this.state.letters = Array.from({ length: totalLetters }, () => ({
      char: this.getRandomChar(),
      color: this.getRandomColor(),
      targetColor: this.getRandomColor(),
      colorProgress: 1
    }));
  }

  resizeCanvas() {
    const canvas = this.state.canvas;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (this.state.context) {
      this.state.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = this.calculateGrid(rect.width, rect.height);
    this.initializeLetters(columns, rows);
    this.drawLetters();
  }

  getRandomChar() {
    return this.lettersAndSymbols[Math.floor(Math.random() * this.lettersAndSymbols.length)];
  }

  getRandomColor() {
    return this.config.glitchColors[Math.floor(Math.random() * this.config.glitchColors.length)];
  }

  hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  }

  interpolateColor(start, end, factor) {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor)
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  }

  drawLetters() {
    if (!this.state.context || this.state.letters.length === 0) return;

    const ctx = this.state.context;
    const { width, height } = this.state.canvas.getBoundingClientRect();
    
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${this.config.fontSize}px 'Courier New', monospace`;
    ctx.textBaseline = 'top';

    this.state.letters.forEach((letter, index) => {
      const x = (index % this.state.grid.columns) * this.config.charWidth;
      const y = Math.floor(index / this.state.grid.columns) * this.config.charHeight;
      
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  }

  updateLetters() {
    if (!this.state.letters || this.state.letters.length === 0) return;

    // Update a percentage of letters each frame for smooth animation
    const updateCount = Math.max(1, Math.floor(this.state.letters.length * 0.03));

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * this.state.letters.length);
      if (!this.state.letters[index]) continue;

      this.state.letters[index].char = this.getRandomChar();
      this.state.letters[index].targetColor = this.getRandomColor();

      if (!this.config.smooth) {
        this.state.letters[index].color = this.state.letters[index].targetColor;
        this.state.letters[index].colorProgress = 1;
      } else {
        this.state.letters[index].colorProgress = 0;
      }
    }
  }

  handleSmoothTransitions() {
    if (!this.config.smooth) return;

    let needsRedraw = false;
    this.state.letters.forEach(letter => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.04;
        if (letter.colorProgress > 1) letter.colorProgress = 1;

        const startRgb = this.hexToRgb(letter.color);
        const endRgb = this.hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = this.interpolateColor(startRgb, endRgb, letter.colorProgress);
          needsRedraw = true;
        }
      }
    });

    if (needsRedraw) {
      this.drawLetters();
    }
  }

  animate() {
    if (!this.state.isVisible) return;

    const now = Date.now();
    if (now - this.state.lastGlitchTime >= this.config.glitchSpeed) {
      this.updateLetters();
      this.drawLetters();
      this.state.lastGlitchTime = now;
    }

    this.handleSmoothTransitions();

    this.state.animationFrame = requestAnimationFrame(() => this.animate());
  }

  cancelAnimation() {
    if (this.state.animationFrame) {
      cancelAnimationFrame(this.state.animationFrame);
      this.state.animationFrame = null;
    }
  }

  render(container) {
    const targetContainer = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;

    if (!targetContainer) {
      console.error('LetterGlitch: Target container not found');
      return;
    }

    // Make sure the target container has relative positioning
    const computedStyle = window.getComputedStyle(targetContainer);
    if (computedStyle.position === 'static') {
      targetContainer.style.position = 'relative';
    }

    targetContainer.appendChild(this.elements.container);
    
    // Initial resize after DOM insertion
    setTimeout(() => this.resizeCanvas(), 0);
  }

  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    
    // Update colors array
    this.lettersAndSymbols = Array.from(this.config.characters);
    
    // Update container opacity
    this.elements.container.style.opacity = this.config.opacity;
    
    // Reinitialize if needed
    this.resizeCanvas();
  }

  setOpacity(opacity) {
    this.config.opacity = opacity;
    this.elements.container.style.opacity = opacity;
  }

  pause() {
    this.state.isVisible = false;
    this.cancelAnimation();
  }

  resume() {
    this.state.isVisible = true;
    if (!this.state.animationFrame) {
      this.animate();
    }
  }

  destroy() {
    this.cancelAnimation();
    
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    
    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
    }

    // Clear timeouts
    if (this.state.resizeTimeout) {
      clearTimeout(this.state.resizeTimeout);
    }

    // Remove from DOM
    if (this.elements.container && this.elements.container.parentNode) {
      this.elements.container.parentNode.removeChild(this.elements.container);
    }

    console.log('LetterGlitch destroyed');
  }
}

// Export for use
window.LetterGlitch = LetterGlitch;