'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import styles from './TechStack.module.css';
import aboutStyles from '../about.module.css';
import { 
  FaReact, FaNodeJs, FaVuejs, FaAngular, FaAws, FaDocker, 
  FaPhp, FaPython, FaWordpress, FaShopify, FaFigma, FaStripe 
} from 'react-icons/fa';
import { 
  SiNextdotjs, SiVercel, SiTailwindcss, SiMongodb, 
  SiMysql, SiPostgresql, SiFirebase, SiGraphql 
} from 'react-icons/si';

const TechIcon = ({ icon, name, delay }) => {
  return (
    <motion.div 
      className={styles.techIcon}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className={styles.iconWrapper}>
        {icon}
      </div>
      <span>{name}</span>
    </motion.div>
  );
};

export default function TechStack() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  
  const frontendTech = [
    { icon: <FaReact />, name: 'React' },
    { icon: <SiNextdotjs />, name: 'Next.js' },
    { icon: <FaVuejs />, name: 'Vue.js' },
    { icon: <FaAngular />, name: 'Angular' },
    { icon: <SiTailwindcss />, name: 'Tailwind CSS' }
  ];
  
  const backendTech = [
    { icon: <FaNodeJs />, name: 'Node.js' },
    { icon: <FaPython />, name: 'Python' },
    { icon: <FaPhp />, name: 'PHP' },
    { icon: <SiGraphql />, name: 'GraphQL' }
  ];
  
  const databaseTech = [
    { icon: <SiMongodb />, name: 'MongoDB' },
    { icon: <SiMysql />, name: 'MySQL' },
    { icon: <SiPostgresql />, name: 'PostgreSQL' },
    { icon: <SiFirebase />, name: 'Firebase' }
  ];
  
  const otherTech = [
    { icon: <FaAws />, name: 'AWS' },
    { icon: <SiVercel />, name: 'Vercel' },
    { icon: <FaDocker />, name: 'Docker' },
    { icon: <FaWordpress />, name: 'WordPress' },
    { icon: <FaShopify />, name: 'Shopify' },
    { icon: <FaFigma />, name: 'Figma' },
    { icon: <FaStripe />, name: 'Stripe' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section className={styles.techStack} ref={sectionRef}>
      <div className={styles.container}>
        <motion.div
          className={`${styles.sectionHeader} ${aboutStyles.sectionHeader}`}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2>Our Technology Stack</h2>
          <p>We leverage the latest and most powerful technologies to build robust, scalable, and high-performance applications.</p>
        </motion.div>
        
        {isInView && (
          <div className={styles.techCategories}>
            <div className={styles.category}>
              <h3>Frontend</h3>
              <motion.div 
                className={styles.techGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {frontendTech.map((tech, index) => (
                  <TechIcon 
                    key={index} 
                    icon={tech.icon} 
                    name={tech.name} 
                    delay={index * 0.1}
                  />
                ))}
              </motion.div>
            </div>
            
            <div className={styles.category}>
              <h3>Backend</h3>
              <motion.div 
                className={styles.techGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {backendTech.map((tech, index) => (
                  <TechIcon 
                    key={index} 
                    icon={tech.icon} 
                    name={tech.name} 
                    delay={index * 0.1 + 0.2}
                  />
                ))}
              </motion.div>
            </div>
            
            <div className={styles.category}>
              <h3>Databases</h3>
              <motion.div 
                className={styles.techGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {databaseTech.map((tech, index) => (
                  <TechIcon 
                    key={index} 
                    icon={tech.icon} 
                    name={tech.name} 
                    delay={index * 0.1 + 0.4}
                  />
                ))}
              </motion.div>
            </div>
            
            <div className={styles.category}>
              <h3>Other Technologies</h3>
              <motion.div 
                className={styles.techGrid}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {otherTech.map((tech, index) => (
                  <TechIcon 
                    key={index} 
                    icon={tech.icon} 
                    name={tech.name} 
                    delay={index * 0.1 + 0.6}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 