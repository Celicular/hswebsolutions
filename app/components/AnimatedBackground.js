'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from './AnimatedBackground.module.css';

function AnimatedBackground() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: undefined, y: undefined });
  const animationRef = useRef(null);
  const maxDistance = useRef(150);
  // Add a state to track theme changes
  const [isLightMode, setIsLightMode] = useState(false);
  // Add state to track if we're on mobile
  const isMobileRef = useRef(false);
  // Track throttling for mouse movement
  const lastMoveTime = useRef(0);
  // Track if the component is visible
  const isVisibleRef = useRef(true);

  // Check if device is mobile on mount
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 768;
  }, []);

  // Check theme on mount and add observer for changes
  useEffect(() => {
    // Initial theme check
    const checkTheme = () => {
      const isLight = document.documentElement.classList.contains('light-mode');
      setIsLightMode(isLight);
      return isLight;
    };
    
    // Check initial theme
    const initialTheme = checkTheme();
    
    // Set up observer to detect class changes on documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === 'class' &&
          (document.documentElement.classList.contains('light-mode') !== isLightMode)
        ) {
          checkTheme();
          // Recreate particles with new theme
          if (particlesRef.current.length > 0 && canvasRef.current) {
            createParticles();
          }
        }
      });
    });
    
    // Start observing document element for class changes
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    
    // Clean up observer on unmount
    return () => {
      observer.disconnect();
    };
  }, [isLightMode]);

  // Canvas setup and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d', { alpha: true });
    contextRef.current = context;

    // Set canvas to full screen
    const handleResize = () => {
      // Check if we're now on mobile
      const wasMobile = isMobileRef.current;
      isMobileRef.current = window.innerWidth < 768;
      
      // Get device pixel ratio for proper resolution
      const dpr = window.devicePixelRatio || 1;
      
      // Set display size (css pixels)
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      
      // Set actual size in memory (scaled to account for extra pixel density)
      // Using a lower scale factor on mobile for performance
      const scaleFactor = isMobileRef.current ? 0.5 : 1;
      canvas.width = window.innerWidth * dpr * scaleFactor;
      canvas.height = window.innerHeight * dpr * scaleFactor;
      
      // Normalize coordinate system to use css pixels
      context.scale(dpr * scaleFactor, dpr * scaleFactor);
      
      // If we switched between mobile and desktop, recreate particles
      if (wasMobile !== isMobileRef.current) {
        createParticles();
      }
    };
    
    handleResize();
    
    // Debounce resize events for better performance
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };
    
    window.addEventListener('resize', debouncedResize);

    // Mouse move handler with throttling
    const handleMouseMove = (e) => {
      // Throttle mouse events especially on mobile
      const now = Date.now();
      const throttleTime = isMobileRef.current ? 50 : 16; // 60fps on desktop, ~20fps on mobile
      
      if (now - lastMoveTime.current > throttleTime) {
        mouseRef.current = {
          x: e.clientX,
          y: e.clientY
        };
        lastMoveTime.current = now;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Touch handler for mobile devices
    const handleTouch = (e) => {
      if (e.touches.length > 0) {
        // Throttle touch events more aggressively
        const now = Date.now();
        if (now - lastMoveTime.current > 80) { // ~12fps
          mouseRef.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
          };
          lastMoveTime.current = now;
        }
      }
    };
    
    window.addEventListener('touchmove', handleTouch);
    
    // On mouse leave, gradually reset mouse position
    const handleMouseLeave = () => {
      // Simply set to undefined on mobile for performance
      if (isMobileRef.current) {
        mouseRef.current = { x: undefined, y: undefined };
        return;
      }
      
      // Simplified fadeout on desktop
      const fadeOut = setInterval(() => {
        if (!mouseRef.current.x || !mouseRef.current.y) {
          clearInterval(fadeOut);
          return;
        }
        
        mouseRef.current = {
          x: mouseRef.current.x + (window.innerWidth / 2 - mouseRef.current.x) * 0.1,
          y: mouseRef.current.y + (window.innerHeight / 2 - mouseRef.current.y) * 0.1
        };
        
        // When it's close enough to center, reset it
        if (Math.abs(mouseRef.current.x - window.innerWidth / 2) < 10 &&
            Math.abs(mouseRef.current.y - window.innerHeight / 2) < 10) {
          mouseRef.current = { x: undefined, y: undefined };
          clearInterval(fadeOut);
        }
      }, 30);
    };
    
    window.addEventListener('mouseleave', handleMouseLeave);

    // Create particles with optimizations for mobile
    const createParticles = () => {
      const currentLightMode = document.documentElement.classList.contains('light-mode');
      setIsLightMode(currentLightMode);
      
      // Significantly reduce particle count on mobile
      const particleCount = isMobileRef.current ? 30 : 100;
      
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 1.5 + 0.5;
        particlesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: size,
          baseSize: size,
          // Slower movement on mobile
          speedX: (Math.random() - 0.5) * (isMobileRef.current ? 0.8 : 1.5),
          speedY: (Math.random() - 0.5) * (isMobileRef.current ? 0.8 : 1.5),
          colorIndex: Math.floor(Math.random() * 3), // 0, 1, or 2 for different colors
          brightness: Math.random() * 20 + 80, // 80-100% brightness
          connections: [],
          hue: currentLightMode ? 210 : 210 // Blue for both modes
        });
      }
    };

    // Make createParticles accessible in the component
    window.createAnimatedBackgroundParticles = createParticles;
    createParticles();

    // Track last animation time for frame throttling on mobile
    let lastFrameTime = 0;
    
    // Animation function optimized for performance
    const animate = (timestamp) => {
      // If page is not visible, pause animation
      if (!isVisibleRef.current) {
        animationRef.current = null;
        return;
      }
      
      // On mobile, limit frame rate to ~30fps for better performance
      if (isMobileRef.current) {
        if (timestamp - lastFrameTime < 33 && lastFrameTime !== 0) { // ~30fps
          animationRef.current = requestAnimationFrame(animate);
          return;
        }
        lastFrameTime = timestamp;
      }
      
      // Clear canvas with proper size
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Check theme on each frame
      const currentLightMode = document.documentElement.classList.contains('light-mode');
      if (currentLightMode !== isLightMode) {
        setIsLightMode(currentLightMode);
      }
      
      const baseHue = currentLightMode ? 140 : 210; // Green for light mode, Blue for dark mode (default)
      
      // Calculate connection distance based on screen size and device type (smaller on mobile)
      const connectionDistance = Math.min(
        isMobileRef.current ? 100 : 150, 
        window.innerWidth / (isMobileRef.current ? 10 : 12)
      );
      
      // Skip drawing some connections on mobile for performance
      const connectionFrequency = isMobileRef.current ? 2 : 1; // Skip every other connection on mobile
      
      // Update and draw particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i];
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > window.innerWidth) {
          particle.speedX = -particle.speedX;
        }
        
        if (particle.y < 0 || particle.y > window.innerHeight) {
          particle.speedY = -particle.speedY;
        }
        
        // Mouse interaction - simplified for mobile
        if (mouseRef.current.x && mouseRef.current.y) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only interact within certain radius, smaller on mobile
          const interactionRadius = isMobileRef.current ? 100 : 150;
          
          if (distance < interactionRadius) {
            // Calculate force
            const force = (interactionRadius - distance) / interactionRadius;
            
            // Particle grows when closer to mouse
            particle.size = particle.baseSize * (1 + force * (isMobileRef.current ? 2 : 3));
            
            // Move particle towards mouse - reduced effect on mobile
            const directionX = dx / distance;
            const directionY = dy / distance;
            
            particle.x += directionX * force * (isMobileRef.current ? 2 : 3.6);
            particle.y += directionY * force * (isMobileRef.current ? 2 : 3.6);
            
            // Slightly change speed based on mouse interaction - reduced on mobile
            const speedFactor = isMobileRef.current ? 0.15 : 0.3;
            particle.speedX += directionX * force * speedFactor;
            particle.speedY += directionY * force * speedFactor;
            
            // Limit speed - lower on mobile
            const maxSpeed = isMobileRef.current ? 3 : 6;
            const currentSpeed = Math.sqrt(particle.speedX * particle.speedX + particle.speedY * particle.speedY);
            if (currentSpeed > maxSpeed) {
              particle.speedX = (particle.speedX / currentSpeed) * maxSpeed;
              particle.speedY = (particle.speedY / currentSpeed) * maxSpeed;
            }
          }
        }
        
        // Reset connections
        particle.connections = [];
        
        // Draw particles
        context.beginPath();
        context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        // Determine color based on color index and mode
        let hue = baseHue;
        if (particle.colorIndex === 1) hue += 30;
        if (particle.colorIndex === 2) hue -= 30;
        
        if (!currentLightMode) {
          context.fillStyle = `hsla(${hue}, 80%, ${particle.brightness}%, 0.7)`;
        } else {
          context.fillStyle = `hsla(${hue}, 70%, ${particle.brightness - 20}%, 0.6)`;
        }
        
        context.fill();
        
        // Skip calculating connections for some particles on mobile
        if (isMobileRef.current && i % 2 === 0) continue;
        
        // Find connections to other particles
        for (let j = i + 1; j < particlesRef.current.length; j += connectionFrequency) {
          const otherParticle = particlesRef.current[j];
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Create connection if particles are close enough
          if (distance < connectionDistance) {
            // Store connection for this frame
            particle.connections.push({
              particle: otherParticle,
              distance: distance
            });
          }
        }
      }
      
      // Draw connections after all particles are updated
      context.lineWidth = 0.5;
      
      // On mobile, reduce the number of connections drawn
      const maxConnectionsPerParticle = isMobileRef.current ? 3 : 6;
      
      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i];
        
        // Skip some particles on mobile
        if (isMobileRef.current && i % 2 === 0) continue;
        
        // Sort connections by distance and only draw the closest few
        const sortedConnections = particle.connections.sort((a, b) => a.distance - b.distance);
        const connectionsToRender = sortedConnections.slice(0, maxConnectionsPerParticle);
        
        for (let j = 0; j < connectionsToRender.length; j++) {
          const connection = connectionsToRender[j];
          const otherParticle = connection.particle;
          const distance = connection.distance;
          
          // Calculate opacity based on distance
          const opacity = 1 - (distance / connectionDistance);
          
          // Draw connection line
          context.beginPath();
          context.moveTo(particle.x, particle.y);
          context.lineTo(otherParticle.x, otherParticle.y);
          
          if (!currentLightMode) {
            context.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.5})`;
          } else {
            context.strokeStyle = `rgba(50, 50, 50, ${opacity * 0.3})`;
          }
          
          context.stroke();
        }
      }
      
      // Request next frame
      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Handle visibility changes
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
      
      // If returning to visibility, restart animation if it was stopped
      if (isVisibleRef.current && !animationRef.current) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', debouncedResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

export default AnimatedBackground; 