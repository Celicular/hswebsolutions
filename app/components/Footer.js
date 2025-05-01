'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.css';
import { FaGithub, FaLinkedin, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  const particlesRef = useRef(null);

  // Create and animate particles
  useEffect(() => {
    if (!particlesRef.current) return;
    
    const canvas = particlesRef.current;
    const ctx = canvas.getContext('2d');
    const parentRect = canvas.parentElement.getBoundingClientRect();
    
    // Set canvas size to match parent container
    canvas.width = parentRect.width;
    canvas.height = parentRect.height;
    
    const particles = [];
    const particleCount = Math.floor(canvas.width / 20); // Responsive particle count
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1 + 0.5,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Get current theme (light or dark mode)
      const isDarkMode = document.documentElement.classList.contains('dark-mode');
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = isDarkMode ? 
          `rgba(0, 215, 255, ${particle.opacity})` : 
          `rgba(0, 161, 255, ${particle.opacity})`;
        ctx.fill();
        
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 70) { // Connection distance
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isDarkMode ? 
              `rgba(0, 215, 255, ${0.2 * (1 - distance / 70)})` : 
              `rgba(0, 161, 255, ${0.2 * (1 - distance / 70)})`;
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    
    // Handle window resize
    const handleResize = () => {
      const parentRect = canvas.parentElement.getBoundingClientRect();
      canvas.width = parentRect.width;
      canvas.height = parentRect.height;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <footer className={styles.footer} style={{ position: 'relative', zIndex: 10 }}>
      <div className={styles.particlesContainer}>
        <canvas ref={particlesRef} className={styles.particles}></canvas>
      </div>
      
      <div className={styles.container}>
        <div className={styles.footerTop}>
          {/* Logo and Tagline */}
          <div className={styles.brandSection}>
            <div className={styles.logoWrapper}>
              <Image 
                src="/h.ico" 
                alt="HS Logo" 
                width={50} 
                height={50} 
                className={styles.footerLogo}
              />
              <h3 className={styles.brandName}>HS Web Solutions</h3>
            </div>
            <p className={styles.tagline}>
              Transforming ideas into digital excellence
            </p>
            <div className={styles.socialIcons}>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaGithub />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaLinkedin />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaInstagram />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <FaTwitter />
              </a>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className={styles.navLinks}>
            <h4 className={styles.linkTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/blog">Blogs</Link></li>
              <li><Link href="#estimate" className={styles.estimateLink}>Estimate Project</Link></li>
            </ul>
          </div>
        </div>
        
        <div className={styles.divider}></div>
        
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} HS Web Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 