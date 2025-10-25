/**
 * PillNav - Animated pill-shaped navigation component
 * Converted from React to vanilla JavaScript
 */
class PillNav {
  constructor(options = {}) {
    this.config = {
      logo: options.logo || '',
      logoAlt: options.logoAlt || 'Logo',
      items: options.items || [],
      activeHref: options.activeHref || '',
      className: options.className || '',
      ease: options.ease || 'power3.easeOut',
      baseColor: options.baseColor || '#1a1a2e',
      pillColor: options.pillColor || '#ffd700',
      hoveredPillTextColor: options.hoveredPillTextColor || '#1a1a2e',
      pillTextColor: options.pillTextColor || '#1a1a2e',
      initialLoadAnimation: options.initialLoadAnimation !== false
    };

    this.state = {
      isMobileMenuOpen: false,
      circleRefs: [],
      tlRefs: [],
      activeTweenRefs: [],
      logoTweenRef: null
    };

    this.elements = {
      container: null,
      nav: null,
      logo: null,
      logoImg: null,
      navItems: null,
      hamburger: null,
      mobileMenu: null
    };

    this.init();
  }

  init() {
    if (typeof gsap === 'undefined') {
      console.error('GSAP is required for PillNav to work. Please include GSAP library.');
      return;
    }

    this.createNavigation();
    this.setupEventListeners();
    this.layout();
    
    if (this.config.initialLoadAnimation) {
      this.playInitialAnimation();
    }
  }

  createNavigation() {
    // Create main container
    this.elements.container = document.createElement('div');
    this.elements.container.className = 'pill-nav-container';

    // Create nav element
    this.elements.nav = document.createElement('nav');
    this.elements.nav.className = `pill-nav ${this.config.className}`;
    this.elements.nav.setAttribute('aria-label', 'Primary');

    // Set CSS variables
    this.setCSSVariables();

    // Create logo
    this.createLogo();

    // Create navigation items (desktop)
    this.createNavItems();

    // Create mobile menu button
    this.createMobileMenuButton();

    // Create mobile menu
    this.createMobileMenu();

    // Assemble structure
    this.elements.nav.appendChild(this.elements.logo);
    this.elements.nav.appendChild(this.elements.navItems);
    this.elements.nav.appendChild(this.elements.hamburger);
    
    this.elements.container.appendChild(this.elements.nav);
    this.elements.container.appendChild(this.elements.mobileMenu);
  }

  setCSSVariables() {
    const cssVars = {
      '--base': this.config.baseColor,
      '--pill-bg': this.config.pillColor,
      '--hover-text': this.config.hoveredPillTextColor,
      '--pill-text': this.config.pillTextColor || this.config.baseColor
    };

    Object.entries(cssVars).forEach(([key, value]) => {
      this.elements.nav.style.setProperty(key, value);
    });
  }

  createLogo() {
    this.elements.logo = document.createElement('a');
    this.elements.logo.className = 'pill-logo cursor-target';
    this.elements.logo.href = this.config.items[0]?.href || '#';
    this.elements.logo.setAttribute('aria-label', 'Home');

    this.elements.logoImg = document.createElement('img');
    this.elements.logoImg.src = this.config.logo;
    this.elements.logoImg.alt = this.config.logoAlt;

    this.elements.logo.appendChild(this.elements.logoImg);

    // Add hover effect
    this.elements.logo.addEventListener('mouseenter', () => this.handleLogoEnter());
  }

  createNavItems() {
    this.elements.navItems = document.createElement('div');
    this.elements.navItems.className = 'pill-nav-items desktop-only';

    const list = document.createElement('ul');
    list.className = 'pill-list';
    list.setAttribute('role', 'menubar');

    this.config.items.forEach((item, i) => {
      const li = document.createElement('li');
      li.setAttribute('role', 'none');

      const link = document.createElement('a');
      link.setAttribute('role', 'menuitem');
      link.href = item.href;
      link.className = `pill cursor-target${this.config.activeHref === item.href ? ' is-active' : ''}`;
      link.setAttribute('aria-label', item.ariaLabel || item.label);

      // Create hover circle
      const circle = document.createElement('span');
      circle.className = 'hover-circle';
      circle.setAttribute('aria-hidden', 'true');
      this.state.circleRefs[i] = circle;

      // Create label stack
      const labelStack = document.createElement('span');
      labelStack.className = 'label-stack';

      const label = document.createElement('span');
      label.className = 'pill-label';
      label.textContent = item.label;

      const hoverLabel = document.createElement('span');
      hoverLabel.className = 'pill-label-hover';
      hoverLabel.setAttribute('aria-hidden', 'true');
      hoverLabel.textContent = item.label;

      labelStack.appendChild(label);
      labelStack.appendChild(hoverLabel);

      link.appendChild(circle);
      link.appendChild(labelStack);

      // Add event listeners
      link.addEventListener('mouseenter', () => this.handleEnter(i));
      link.addEventListener('mouseleave', () => this.handleLeave(i));

      li.appendChild(link);
      list.appendChild(li);
    });

    this.elements.navItems.appendChild(list);
  }

  createMobileMenuButton() {
    this.elements.hamburger = document.createElement('button');
    this.elements.hamburger.className = 'mobile-menu-button mobile-only cursor-target';
    this.elements.hamburger.setAttribute('aria-label', 'Toggle menu');

    const line1 = document.createElement('span');
    line1.className = 'hamburger-line';
    const line2 = document.createElement('span');
    line2.className = 'hamburger-line';

    this.elements.hamburger.appendChild(line1);
    this.elements.hamburger.appendChild(line2);

    this.elements.hamburger.addEventListener('click', () => this.toggleMobileMenu());
  }

  createMobileMenu() {
    this.elements.mobileMenu = document.createElement('div');
    this.elements.mobileMenu.className = 'mobile-menu-popover mobile-only';

    // Set CSS variables for mobile menu
    const cssVars = {
      '--base': this.config.baseColor,
      '--pill-bg': this.config.pillColor,
      '--hover-text': this.config.hoveredPillTextColor,
      '--pill-text': this.config.pillTextColor || this.config.baseColor
    };

    Object.entries(cssVars).forEach(([key, value]) => {
      this.elements.mobileMenu.style.setProperty(key, value);
    });

    const list = document.createElement('ul');
    list.className = 'mobile-menu-list';

    this.config.items.forEach((item, i) => {
      const li = document.createElement('li');
      
      const link = document.createElement('a');
      link.href = item.href;
      link.className = `mobile-menu-link cursor-target${this.config.activeHref === item.href ? ' is-active' : ''}`;
      link.textContent = item.label;
      link.addEventListener('click', () => this.setMobileMenuOpen(false));

      li.appendChild(link);
      list.appendChild(li);
    });

    this.elements.mobileMenu.appendChild(list);

    // Initial state
    gsap.set(this.elements.mobileMenu, { visibility: 'hidden', opacity: 0, scaleY: 1 });
  }

  layout() {
    this.state.circleRefs.forEach((circle, i) => {
      if (!circle?.parentElement) return;

      const pill = circle.parentElement;
      const rect = pill.getBoundingClientRect();
      const { width: w, height: h } = rect;
      const R = ((w * w) / 4 + h * h) / (2 * h);
      const D = Math.ceil(2 * R) + 2;
      const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
      const originY = D - delta;

      circle.style.width = `${D}px`;
      circle.style.height = `${D}px`;
      circle.style.bottom = `-${delta}px`;

      gsap.set(circle, {
        xPercent: -50,
        scale: 0,
        transformOrigin: `50% ${originY}px`
      });

      const label = pill.querySelector('.pill-label');
      const white = pill.querySelector('.pill-label-hover');

      if (label) gsap.set(label, { y: 0 });
      if (white) gsap.set(white, { y: h + 12, opacity: 0 });

      this.state.tlRefs[i]?.kill();
      const tl = gsap.timeline({ paused: true });

      tl.to(circle, { scale: 1.2, xPercent: -50, duration: 1, ease: this.config.ease, overwrite: 'auto' }, 0);

      if (label) {
        tl.to(label, { y: -(h + 8), duration: 1, ease: this.config.ease, overwrite: 'auto' }, 0);
      }

      if (white) {
        gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
        tl.to(white, { y: 0, opacity: 1, duration: 1, ease: this.config.ease, overwrite: 'auto' }, 0);
      }

      this.state.tlRefs[i] = tl;
    });
  }

  handleEnter(i) {
    const tl = this.state.tlRefs[i];
    if (!tl) return;
    this.state.activeTweenRefs[i]?.kill();
    this.state.activeTweenRefs[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease: this.config.ease,
      overwrite: 'auto'
    });
  }

  handleLeave(i) {
    const tl = this.state.tlRefs[i];
    if (!tl) return;
    this.state.activeTweenRefs[i]?.kill();
    this.state.activeTweenRefs[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease: this.config.ease,
      overwrite: 'auto'
    });
  }

  handleLogoEnter() {
    const img = this.elements.logoImg;
    if (!img) return;
    this.state.logoTweenRef?.kill();
    gsap.set(img, { rotate: 0 });
    this.state.logoTweenRef = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease: this.config.ease,
      overwrite: 'auto'
    });
  }

  toggleMobileMenu() {
    this.setMobileMenuOpen(!this.state.isMobileMenuOpen);
  }

  setMobileMenuOpen(isOpen) {
    this.state.isMobileMenuOpen = isOpen;

    const hamburger = this.elements.hamburger;
    const menu = this.elements.mobileMenu;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (isOpen) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease: this.config.ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease: this.config.ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease: this.config.ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease: this.config.ease });
      }
    }

    if (menu) {
      if (isOpen) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10, scaleY: 1 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease: this.config.ease,
            transformOrigin: 'top center'
          }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          scaleY: 1,
          duration: 0.2,
          ease: this.config.ease,
          transformOrigin: 'top center',
          onComplete: () => {
            gsap.set(menu, { visibility: 'hidden' });
          }
        });
      }
    }
  }

  playInitialAnimation() {
    const logo = this.elements.logo;
    const navItems = this.elements.navItems;

    if (logo) {
      gsap.set(logo, { scale: 0 });
      gsap.to(logo, {
        scale: 1,
        duration: 0.6,
        ease: this.config.ease
      });
    }

    if (navItems) {
      gsap.set(navItems, { width: 0, overflow: 'hidden' });
      gsap.to(navItems, {
        width: 'auto',
        duration: 0.6,
        ease: this.config.ease
      });
    }
  }

  setupEventListeners() {
    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => this.layout(), 150);
    };
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => this.layout()).catch(() => {});
    }

    // Store reference for cleanup
    this._onResize = onResize;
  }

  render(container) {
    const targetContainer = typeof container === 'string' 
      ? document.querySelector(container) 
      : container;

    if (!targetContainer) {
      console.error('PillNav: Target container not found');
      return;
    }

    targetContainer.appendChild(this.elements.container);
    
    // Force fixed positioning immediately
    this.elements.container.style.position = 'fixed';
    this.elements.container.style.top = '1rem';
    this.elements.container.style.left = '50%';
    this.elements.container.style.transform = 'translateX(-50%)';
    this.elements.container.style.zIndex = '99999';
    
    // Layout after DOM insertion
    setTimeout(() => this.layout(), 0);
  }

  updateActiveHref(href) {
    this.config.activeHref = href;
    
    // Update desktop nav
    const pills = this.elements.navItems.querySelectorAll('.pill');
    pills.forEach((pill, i) => {
      const item = this.config.items[i];
      if (item?.href === href) {
        pill.classList.add('is-active');
      } else {
        pill.classList.remove('is-active');
      }
    });

    // Update mobile nav
    const mobileLinks = this.elements.mobileMenu.querySelectorAll('.mobile-menu-link');
    mobileLinks.forEach((link, i) => {
      const item = this.config.items[i];
      if (item?.href === href) {
        link.classList.add('is-active');
      } else {
        link.classList.remove('is-active');
      }
    });
  }

  destroy() {
    // Clean up GSAP timelines
    this.state.tlRefs.forEach(tl => tl?.kill());
    this.state.activeTweenRefs.forEach(tween => tween?.kill());
    this.state.logoTweenRef?.kill();

    // Remove event listeners
    window.removeEventListener('resize', this._onResize);

    // Remove from DOM
    if (this.elements.container && this.elements.container.parentNode) {
      this.elements.container.parentNode.removeChild(this.elements.container);
    }

    console.log('PillNav destroyed');
  }
}

// Export for use
window.PillNav = PillNav;