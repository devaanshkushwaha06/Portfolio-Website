/**
 * TargetCursor - Custom animated cursor with target corners
 * Converted from React to vanilla JavaScript
 */
class TargetCursor {
  constructor(options = {}) {
    this.config = {
      targetSelector: options.targetSelector || '.cursor-target',
      spinDuration: options.spinDuration || 2,
      hideDefaultCursor: options.hideDefaultCursor !== false,
      borderWidth: 3,
      cornerSize: 12,
      parallaxStrength: 0.00005
    };

    this.elements = {
      cursor: null,
      corners: null,
      dot: null
    };

    this.state = {
      activeTarget: null,
      currentTargetMove: null,
      currentLeaveHandler: null,
      isAnimatingToTarget: false,
      resumeTimeout: null,
      spinTl: null
    };

    this.init();
  }

  init() {
    if (typeof gsap === 'undefined') {
      console.error('GSAP is required for TargetCursor to work. Please include GSAP library.');
      return;
    }

    this.createCursorElements();
    this.setupCursor();
    this.bindEvents();
  }

  createCursorElements() {
    // Create cursor wrapper
    this.elements.cursor = document.createElement('div');
    this.elements.cursor.className = 'target-cursor-wrapper';

    // Create dot
    this.elements.dot = document.createElement('div');
    this.elements.dot.className = 'target-cursor-dot';

    // Create corners
    const cornerClasses = ['corner-tl', 'corner-tr', 'corner-br', 'corner-bl'];
    const corners = [];

    cornerClasses.forEach(cornerClass => {
      const corner = document.createElement('div');
      corner.className = `target-cursor-corner ${cornerClass}`;
      corners.push(corner);
      this.elements.cursor.appendChild(corner);
    });

    this.elements.corners = corners;

    // Add dot to cursor
    this.elements.cursor.appendChild(this.elements.dot);

    // Add cursor to body
    document.body.appendChild(this.elements.cursor);
  }

  setupCursor() {
    if (this.config.hideDefaultCursor) {
      document.body.style.cursor = 'none';
    }

    // Set initial position
    gsap.set(this.elements.cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    this.createSpinTimeline();
  }

  createSpinTimeline() {
    if (this.state.spinTl) {
      this.state.spinTl.kill();
    }
    this.state.spinTl = gsap
      .timeline({ repeat: -1 })
      .to(this.elements.cursor, { 
        rotation: '+=360', 
        duration: this.config.spinDuration, 
        ease: 'none'
      });
  }

  moveCursor(x, y) {
    if (!this.elements.cursor) return;
    gsap.to(this.elements.cursor, {
      x,
      y,
      duration: 0.15,
      ease: 'power2.out'
    });
  }

  cleanupTarget(target) {
    if (this.state.currentTargetMove) {
      target.removeEventListener('mousemove', this.state.currentTargetMove);
    }
    if (this.state.currentLeaveHandler) {
      target.removeEventListener('mouseleave', this.state.currentLeaveHandler);
    }
    this.state.currentTargetMove = null;
    this.state.currentLeaveHandler = null;
  }

  updateCorners(mouseX, mouseY) {
    if (!this.state.activeTarget || !this.elements.cursor || !this.elements.corners) return;

    const rect = this.state.activeTarget.getBoundingClientRect();
    const cursorRect = this.elements.cursor.getBoundingClientRect();

    const cursorCenterX = cursorRect.left + cursorRect.width / 2;
    const cursorCenterY = cursorRect.top + cursorRect.height / 2;

    const [tlc, trc, brc, blc] = this.elements.corners;

    const { borderWidth, cornerSize, parallaxStrength } = this.config;

    let tlOffset = {
      x: rect.left - cursorCenterX - borderWidth,
      y: rect.top - cursorCenterY - borderWidth
    };
    let trOffset = {
      x: rect.right - cursorCenterX + borderWidth - cornerSize,
      y: rect.top - cursorCenterY - borderWidth
    };
    let brOffset = {
      x: rect.right - cursorCenterX + borderWidth - cornerSize,
      y: rect.bottom - cursorCenterY + borderWidth - cornerSize
    };
    let blOffset = {
      x: rect.left - cursorCenterX - borderWidth,
      y: rect.bottom - cursorCenterY + borderWidth - cornerSize
    };

    if (mouseX !== undefined && mouseY !== undefined) {
      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      const mouseOffsetX = (mouseX - targetCenterX) * parallaxStrength;
      const mouseOffsetY = (mouseY - targetCenterY) * parallaxStrength;

      tlOffset.x += mouseOffsetX;
      tlOffset.y += mouseOffsetY;
      trOffset.x += mouseOffsetX;
      trOffset.y += mouseOffsetY;
      brOffset.x += mouseOffsetX;
      brOffset.y += mouseOffsetY;
      blOffset.x += mouseOffsetX;
      blOffset.y += mouseOffsetY;
    }

    const tl = gsap.timeline();
    const corners = [tlc, trc, brc, blc];
    const offsets = [tlOffset, trOffset, brOffset, blOffset];

    corners.forEach((corner, index) => {
      tl.to(
        corner,
        {
          x: offsets[index].x,
          y: offsets[index].y,
          duration: 0.2,
          ease: 'power2.out'
        },
        0
      );
    });
  }

  bindEvents() {
    // Mouse move handler with throttling
    let moveThrottle = null;
    this.moveHandler = (e) => {
      if (moveThrottle) return;
      moveThrottle = requestAnimationFrame(() => {
        this.moveCursor(e.clientX, e.clientY);
        moveThrottle = null;
      });
    };
    window.addEventListener('mousemove', this.moveHandler);

    // Mouse down/up handlers for click animation
    this.mouseDownHandler = () => {
      if (!this.elements.dot) return;
      gsap.to(this.elements.dot, { scale: 0.7, duration: 0.3 });
      gsap.to(this.elements.cursor, { scale: 0.9, duration: 0.2 });
    };

    this.mouseUpHandler = () => {
      if (!this.elements.dot) return;
      gsap.to(this.elements.dot, { scale: 1, duration: 0.3 });
      gsap.to(this.elements.cursor, { scale: 1, duration: 0.2 });
    };

    window.addEventListener('mousedown', this.mouseDownHandler);
    window.addEventListener('mouseup', this.mouseUpHandler);

    // Scroll handler
    this.scrollHandler = () => {
      if (!this.state.activeTarget || !this.elements.cursor) return;

      const mouseX = gsap.getProperty(this.elements.cursor, 'x');
      const mouseY = gsap.getProperty(this.elements.cursor, 'y');

      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === this.state.activeTarget || 
         elementUnderMouse.closest(this.config.targetSelector) === this.state.activeTarget);

      if (!isStillOverTarget && this.state.currentLeaveHandler) {
        this.state.currentLeaveHandler();
      }
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });

    // Enter handler for target elements
    this.enterHandler = (e) => {
      const directTarget = e.target;

      const allTargets = [];
      let current = directTarget;
      while (current && current !== document.body) {
        if (current.matches(this.config.targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }

      const target = allTargets[0] || null;
      if (!target || !this.elements.cursor || !this.elements.corners) return;

      if (this.state.activeTarget === target) return;

      if (this.state.activeTarget) {
        this.cleanupTarget(this.state.activeTarget);
      }

      if (this.state.resumeTimeout) {
        clearTimeout(this.state.resumeTimeout);
        this.state.resumeTimeout = null;
      }

      this.state.activeTarget = target;
      this.elements.corners.forEach(corner => {
        gsap.killTweensOf(corner);
      });

      gsap.killTweensOf(this.elements.cursor, 'rotation');
      this.state.spinTl?.pause();

      gsap.set(this.elements.cursor, { rotation: 0 });

      this.state.isAnimatingToTarget = true;
      this.updateCorners();

      setTimeout(() => {
        this.state.isAnimatingToTarget = false;
      }, 1);

      let moveThrottle = null;
      const targetMove = (ev) => {
        if (moveThrottle || this.state.isAnimatingToTarget) return;
        moveThrottle = requestAnimationFrame(() => {
          this.updateCorners(ev.clientX, ev.clientY);
          moveThrottle = null;
        });
      };

      const leaveHandler = () => {
        this.state.activeTarget = null;
        this.state.isAnimatingToTarget = false;

        if (this.elements.corners) {
          gsap.killTweensOf(this.elements.corners);

          const { cornerSize } = this.config;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
          ];

          const tl = gsap.timeline();
          this.elements.corners.forEach((corner, index) => {
            tl.to(
              corner,
              {
                x: positions[index].x,
                y: positions[index].y,
                duration: 0.3,
                ease: 'power3.out'
              },
              0
            );
          });
        }

        this.state.resumeTimeout = setTimeout(() => {
          if (!this.state.activeTarget && this.elements.cursor && this.state.spinTl) {
            const currentRotation = gsap.getProperty(this.elements.cursor, 'rotation');
            const normalizedRotation = currentRotation % 360;

            this.state.spinTl.kill();
            this.state.spinTl = gsap
              .timeline({ repeat: -1 })
              .to(this.elements.cursor, { 
                rotation: '+=360', 
                duration: this.config.spinDuration, 
                ease: 'none' 
              });

            gsap.to(this.elements.cursor, {
              rotation: normalizedRotation + 360,
              duration: this.config.spinDuration * (1 - normalizedRotation / 360),
              ease: 'none',
              onComplete: () => {
                this.state.spinTl?.restart();
              }
            });
          }
          this.state.resumeTimeout = null;
        }, 50);

        this.cleanupTarget(target);
      };

      this.state.currentTargetMove = targetMove;
      this.state.currentLeaveHandler = leaveHandler;

      target.addEventListener('mousemove', targetMove);
      target.addEventListener('mouseleave', leaveHandler);
    };

    window.addEventListener('mouseover', this.enterHandler, { passive: true });
  }

  destroy() {
    // Remove event listeners
    window.removeEventListener('mousemove', this.moveHandler);
    window.removeEventListener('mouseover', this.enterHandler);
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('mousedown', this.mouseDownHandler);
    window.removeEventListener('mouseup', this.mouseUpHandler);

    if (this.state.activeTarget) {
      this.cleanupTarget(this.state.activeTarget);
    }

    // Clean up GSAP timelines
    this.state.spinTl?.kill();

    // Remove cursor element
    if (this.elements.cursor && this.elements.cursor.parentNode) {
      this.elements.cursor.parentNode.removeChild(this.elements.cursor);
    }

    // Restore default cursor
    document.body.style.cursor = '';

    console.log('TargetCursor destroyed');
  }
}

// Export for use
window.TargetCursor = TargetCursor;