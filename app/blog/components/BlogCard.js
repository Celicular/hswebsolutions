'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import styles from './BlogCard.module.css';

const BlogCard = ({ post }) => {
  // Destructure post data
  const { title, slug, excerpt, image_url, tags } = post;
  
  // State for hover detection
  const [isHovered, setIsHovered] = useState(false);
  
  // References for tilt effect
  const cardRef = useRef(null);
  
  // Motion values for tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth springs for tilt
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 300, damping: 30 });
  
  // Image shine effect
  const shineX = useSpring(useTransform(x, [-100, 100], [-50, 50]), { stiffness: 300, damping: 30 });
  const shineY = useSpring(useTransform(y, [-100, 100], [-50, 50]), { stiffness: 300, damping: 30 });
  
  // Split tags string into array
  const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
  
  // Handle mouse move for tilt effect
  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    x.set(mouseX);
    y.set(mouseY);
  };
  
  // Reset tilt effect when mouse leaves
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };
  
  return (
    <motion.div 
      className={styles.blogCard}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        z: 0
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link href={`/blog/${slug}`} className={styles.cardLink}>
        <div className={styles.imageContainer}>
          <div 
            className={styles.shine} 
            style={{ 
              backgroundPositionX: shineX, 
              backgroundPositionY: shineY,
              opacity: isHovered ? 0.2 : 0 
            }}
          />
          
          <Image 
            src={image_url || '/images/blog-placeholder.jpg'} 
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={styles.image}
          />
          
          <div className={styles.tagContainer}>
            {tagArray.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className={styles.contentContainer}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.excerpt}>{excerpt}</p>
          
          <div className={styles.cardFooter}>
            <motion.span 
              className={styles.readMore}
              initial={{ x: 0 }}
              animate={isHovered ? { x: 5 } : { x: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              Read More
              <svg 
                className={styles.arrowIcon} 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M13 6L19 12L13 18M5 12H19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default BlogCard; 