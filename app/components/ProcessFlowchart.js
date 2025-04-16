'use client';

import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './ProcessFlowchart.module.css';
import { FaClipboardList, FaPencilRuler, FaCode, FaVial, FaRocket } from 'react-icons/fa';

const processSteps = [
  {
    id: 1,
    title: 'Planning',
    icon: <FaClipboardList />,
    description: 'We gather requirements, define project scope, and create a detailed roadmap.',
    details: 'This includes market research, competitor analysis, user personas, sitemap creation, and content planning.'
  },
  {
    id: 2,
    title: 'Design',
    icon: <FaPencilRuler />,
    description: 'We create wireframes and design mockups that align with your brand.',
    details: 'Our designers craft modern, user-friendly interfaces with responsive layouts, typography, color schemes, and visual elements.'
  },
  {
    id: 3,
    title: 'Development',
    icon: <FaCode />,
    description: 'We transform designs into functional code using modern technologies.',
    details: 'Our developers use clean, efficient code to build your site with optimized performance, security, and SEO in mind.'
  },
  {
    id: 4,
    title: 'Testing',
    icon: <FaVial />,
    description: 'We thoroughly test every aspect to ensure quality and performance.',
    details: 'This includes cross-browser testing, responsive design verification, performance optimization, security audits, and accessibility checks.'
  },
  {
    id: 5,
    title: 'Deployment',
    icon: <FaRocket />,
    description: 'We launch your website and provide ongoing support.',
    details: 'After deployment, we offer maintenance, monitoring, updates, and content management assistance to keep your site running smoothly.'
  }
];

const ProcessFlowchart = () => {
  const [activeStep, setActiveStep] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  const lineRef = useRef(null);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true, // Only trigger once for better performance
    threshold: 0.1
  });
  
  const hasDrawnLine = useRef(false);

  // Check if mobile on mount and when window resizes, but with debounce for better performance
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Debounced resize handler
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        checkMobile();
        if (inView && hasDrawnLine.current) {
          // Redraw line if already visible and resized
          animateConnectingLine();
        }
      }, 150); // Debounce resize events
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [inView]);

  // Handle click on step
  const handleStepClick = (id) => {
    setActiveStep(prevActiveStep => prevActiveStep === id ? null : id);
  };

  // Handle animations when section comes into view
  useEffect(() => {
    if (inView && !hasDrawnLine.current) {
      controls.start('visible');
      animateConnectingLine();
    }
  }, [controls, inView, isMobile]);

  // Animate connecting line between steps with optimizations
  const animateConnectingLine = () => {
    if (!lineRef.current || !sectionRef.current) return;
    
    const line = lineRef.current;
    const container = sectionRef.current;
    
    // Get steps with reduced DOM queries
    const steps = container.querySelectorAll(`.${styles.step}`);
    if (steps.length < 2) return;
    
    const firstStep = steps[0];
    const lastStep = steps[steps.length - 1];
    
    if (isMobile) {
      // Calculate the total height based on the positions of the first and last steps
      const firstRect = firstStep.getBoundingClientRect();
      const lastRect = lastStep.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const totalHeight = lastRect.bottom - firstRect.top + 60; // Add padding
      
      // Position the line with fewer style changes for better performance
      line.style.cssText = `
        top: ${firstRect.top - containerRect.top + 20}px;
        height: 0;
        transition: none;
      `;
      
      // Use requestAnimationFrame for smoother animation
      requestAnimationFrame(() => {
        setTimeout(() => {
          line.style.transition = 'height 1.5s ease-out';
          line.style.height = `${totalHeight}px`;
          hasDrawnLine.current = true;
        }, 50);
      });
    } else {
      // Horizontal line (desktop)
      const firstRect = firstStep.getBoundingClientRect();
      const lastRect = lastStep.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      
      const totalWidth = lastRect.right - firstRect.left + 40; // Add padding
      
      // Batch style changes
      line.style.cssText = `
        left: ${firstRect.left - containerRect.left - 20}px;
        width: 0;
        transition: none;
      `;
      
      requestAnimationFrame(() => {
        setTimeout(() => {
          line.style.transition = 'width 1.5s ease-out';
          line.style.width = `${totalWidth}px`;
          hasDrawnLine.current = true;
        }, 50);
      });
    }
  };

  // Optimized variants for framer-motion animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Reduced stagger time
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 }, // Reduced motion
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // Shorter animation
        ease: "easeOut"
      }
    }
  };

  // Use memo for step details to prevent unnecessary rerenders
  const renderStepDetails = (step) => {
    if (activeStep !== step.id) return null;
    
    return (
      <motion.div 
        className={styles.stepDetails}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step.details}
      </motion.div>
    );
  };

  return (
    <section className={styles.processSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>How We Build Websites</h2>
        <p className={styles.introText}>
          Every website we build follows a proven, transparent process tailored for quality and results.
        </p>
        
        <div 
          className={`${styles.flowchartContainer} ${isMobile ? styles.vertical : styles.horizontal}`}
          ref={(el) => { if (el) sectionRef.current = el; ref(el); }}
        >
          {/* Connecting line */}
          <div 
            className={`${styles.connectingLine} ${isMobile ? styles.verticalLine : styles.horizontalLine}`}
            ref={lineRef}
          ></div>
          
          <motion.div 
            className={styles.stepsContainer}
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {processSteps.map((step) => (
              <motion.div 
                key={step.id}
                className={`${styles.step} ${activeStep === step.id ? styles.active : ''}`}
                variants={stepVariants}
                onClick={() => handleStepClick(step.id)}
                whileTap={{ scale: 0.98 }}
                style={{ willChange: 'transform, box-shadow' }}
              >
                <div className={styles.stepNumber}>{step.id}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
                
                {renderStepDetails(step)}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessFlowchart; 