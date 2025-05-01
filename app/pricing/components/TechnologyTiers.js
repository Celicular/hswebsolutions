'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { FaReact, FaNodeJs, FaPhp, FaWordpress, FaShopify } from 'react-icons/fa';
import { SiSvelte, SiNextdotjs, SiPython, SiDjango, SiStrapi, SiContentful } from 'react-icons/si';
import { IoCodeSlash } from 'react-icons/io5';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import styles from './TechnologyTiers.module.css';

const TechnologyTiers = () => {
  const [activeCategory, setActiveCategory] = useState('frontend');
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  
  const categories = [
    { id: 'frontend', label: 'Frontend Frameworks' },
    { id: 'backend', label: 'Backend Technologies' },
    { id: 'cms', label: 'CMS & Headless' }
  ];
  
  const technologies = {
    frontend: [
      {
        name: 'React',
        icon: <FaReact />,
        description: 'Dynamic UI library with component-based architecture',
        costRange: '₹20,000 - ₹50,000',
        features: [
          'Virtual DOM for optimized rendering',
          'Extensive ecosystem and community',
          'Flexible integration with various backends',
          'Mobile development via React Native'
        ],
        color: '#61DAFB',
        expertise: 90
      },
      {
        name: 'Svelte',
        icon: <SiSvelte />,
        description: 'Compiler-based framework with zero runtime overhead',
        costRange: '₹20,000 - ₹90,000',
        features: [
          'No virtual DOM overhead',
          'True reactivity with minimal code',
          'Built-in animations and state management',
          'Smaller bundle sizes'
        ],
        color: '#FF3E00',
        expertise: 75
      },
      {
        name: 'Next.js',
        icon: <SiNextdotjs />,
        description: 'React framework with SSR and static site generation',
        costRange: '₹25,000 - ₹70,000',
        features: [
          'Server-side rendering & static generation',
          'Automatic code splitting',
          'Built-in routing & image optimization',
          'Serverless function support'
        ],
        color: '#000000',
        expertise: 85
      }
    ],
    backend: [
      {
        name: 'Node.js',
        icon: <FaNodeJs />,
        description: 'JavaScript runtime built on Chrome\'s V8 engine',
        costRange: '₹10,000 - ₹40,000',
        features: [
          'Non-blocking I/O operations',
          'Same language on front and back end',
          'Large ecosystem (npm)',
          'Microservices architecture support'
        ],
        color: '#339933',
        expertise: 95
      },
      {
        name: 'Python',
        icon: <SiPython />,
        description: 'General-purpose language with frameworks like Django and Flask',
        costRange: '₹20,000 - ₹60,000',
        features: [
          'Readable, maintainable code',
          'Extensive standard library',
          'Strong in data processing & ML',
          'Robust web frameworks'
        ],
        color: '#3776AB',
        expertise: 80
      },
      {
        name: 'PHP',
        icon: <FaPhp />,
        description: 'Server-side scripting language for web development',
        costRange: '₹5,000 - ₹20,000',
        features: [
          'Wide hosting availability',
          'Framework options (Laravel, Symfony)',
          'Easy database integration',
          'Established CMS ecosystem'
        ],
        color: '#777BB4',
        expertise: 85
      }
    ],
    cms: [
      {
        name: 'WordPress',
        icon: <FaWordpress />,
        description: 'Traditional CMS with extensive plugin ecosystem',
        costRange: '₹5,000 - ₹10,000',
        features: [
          'User-friendly admin interface',
          'Thousands of themes and plugins',
          'SEO-friendly structure',
          'Regular updates and security patches'
        ],
        color: '#21759B',
        expertise: 90
      },
      {
        name: 'Custom Solution',
        icon: <IoCodeSlash />,
        description: 'Tailor-made application built from scratch',
        costRange: '₹20,000 - ₹50,000',
        features: [
          'Fully customized functionality',
          'Optimized performance',
          'Unique user experience',
          'Proprietary features & IP'
        ],
        color: '#6C5CE7',
        expertise: 95
      },
      {
        name: 'Headless CMS',
        icon: <SiContentful />,
        description: 'Content backend with API-first delivery',
        costRange: '₹30,000 - ₹70,000',
        features: [
          'Content as API',
          'Frontend framework flexibility',
          'Multichannel content distribution',
          'Better performance & security'
        ],
        color: '#E34F26',
        expertise: 85
      }
    ]
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };
  
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };
  
  // Render expertise level bar
  const renderExpertiseBar = (level, color) => {
    return (
      <div className={styles.expertiseContainer}>
        <div className={styles.expertiseLabel}>Our Expertise</div>
        <div className={styles.expertiseBarOuter}>
          <motion.div 
            className={styles.expertiseBarInner}
            initial={{ width: 0 }}
            animate={{ width: `${level}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            style={{ 
              background: `linear-gradient(90deg, ${color}80, ${color})`,
              boxShadow: `0 0 10px ${color}40`
            }}
          />
          <span className={styles.expertisePercent}>{level}%</span>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className={styles.technologyTiers}>
      <div className={styles.container}>
        <motion.div 
          className={styles.headerSection}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>Technology Solutions</h2>
          <p className={styles.sectionSubtitle}>
            Explore our range of technology options to find the perfect fit for your project needs and budget
          </p>
        </motion.div>
        
        <motion.div 
          className={styles.categoryTabs}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {categories.map(category => (
            <button
              key={category.id}
              className={`${styles.categoryTab} ${activeCategory === category.id ? styles.activeTab : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </motion.div>
        
        <div className={styles.techGridContainer}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className={styles.techGrid}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              {technologies[activeCategory].map((tech, index) => (
                <motion.div 
                  key={tech.name}
                  className={styles.techCard}
                  variants={itemVariants}
                  custom={index}
                  whileHover={{ y: -10, transition: { duration: 0.2 } }}
                >
                  <div className={styles.techHeader} style={{ background: `linear-gradient(135deg, ${tech.color}20, ${tech.color}05)` }}>
                    <div className={styles.techIconContainer} style={{ color: tech.color }}>
                      {tech.icon}
                    </div>
                    <h3 className={styles.techName}>{tech.name}</h3>
                  </div>
                  
                  <div className={styles.techDetails}>
                    <p className={styles.techDescription}>{tech.description}</p>
                    
                    <div className={styles.costContainer}>
                      <span className={styles.costLabel}>Cost Range:</span>
                      <span className={styles.costValue}>{tech.costRange}</span>
                    </div>
                    
                    {renderExpertiseBar(tech.expertise, tech.color)}
                    
                    <div className={styles.featuresContainer}>
                      <h4 className={styles.featuresTitle}>Key Features:</h4>
                      <ul className={styles.featuresList}>
                        {tech.features.map((feature, fIndex) => (
                          <li key={fIndex} className={styles.featureItem}>
                            <span className={styles.featureBullet} style={{ backgroundColor: tech.color }}></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <motion.div 
          className={styles.ctaContainer}
          variants={fadeInUpVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.5 }}
        >
          <Link href="/contact" className={styles.ctaButton}>
            <span>Get your technology estimate now</span>
            <HiOutlineArrowNarrowRight className={styles.ctaIcon} />
            <div className={styles.ctaRipple}></div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnologyTiers; 