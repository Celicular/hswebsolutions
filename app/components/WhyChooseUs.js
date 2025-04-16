'use client';

import { useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import styles from './WhyChooseUs.module.css';
import { 
  FaProjectDiagram, 
  FaMoneyBillWave, 
  FaClock, 
  FaUsers, 
  FaMobile, 
  FaHeadset 
} from 'react-icons/fa';

const reasonsData = [
  {
    id: 1,
    title: 'Streamlined Project Management',
    icon: <FaProjectDiagram />,
    description: 'Our efficient project management approach ensures smooth development from concept to deployment.',
    color: '#FF5722'
  },
  {
    id: 2,
    title: 'Pocket-Friendly IT Solutions',
    icon: <FaMoneyBillWave />,
    description: 'High-quality web solutions that fit your budget without compromising on performance or features.',
    color: '#4CAF50'
  },
  {
    id: 3,
    title: 'Timely Project Completion',
    icon: <FaClock />,
    description: 'We are committed to delivering your projects on schedule, respecting your timelines and business goals.',
    color: '#2196F3'
  },
  {
    id: 4,
    title: 'Expert Collaboration Team',
    icon: <FaUsers />,
    description: 'Our team of experienced developers, designers, and strategists work together to bring your vision to life.',
    color: '#9C27B0'
  },
  {
    id: 5,
    title: 'Custom-Built, User-Friendly Apps',
    icon: <FaMobile />,
    description: 'Tailored applications designed with your users in mind, focusing on intuitive interfaces and seamless experiences.',
    color: '#00BCD4'
  },
  {
    id: 6,
    title: '24×7 Customer Support',
    icon: <FaHeadset />,
    description: 'Round-the-clock assistance whenever you need it, ensuring your website or application runs smoothly at all times.',
    color: '#FFC107'
  }
];

const WhyChooseUs = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  // Start animations when section comes into view
  if (inView) {
    controls.start('visible');
  }
  
  // Variants for container animation
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
  
  // Variants for individual cards
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 40
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Badge animation variants
  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        delay: 0.8,
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    }
  };

  // Heading text animation
  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className={styles.whyChooseSection} ref={ref}>
      <div className={styles.backgroundElements}>
        <div className={styles.bgCircle} style={{ top: '10%', left: '5%' }}></div>
        <div className={styles.bgSquare} style={{ top: '60%', right: '8%' }}></div>
        <div className={styles.bgCircle} style={{ bottom: '10%', left: '15%' }}></div>
        <div className={styles.bgDots}></div>
      </div>
      
      <div className={styles.container}>
        <motion.div 
          className={styles.sectionHeader}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={textVariants}
        >
          <h2 className={styles.sectionTitle}>Why Choose HSWebSolutions?</h2>
          <motion.div 
            className={styles.badge}
            variants={badgeVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <span>100+ Projects Delivered</span>
          </motion.div>
          <p className={styles.sectionSubtitle}>
            HSWebSolutions is more than a service provider – we're your digital partner for long-term growth. 
            We are known for delivering exceptional quality and innovation in web development and digital marketing. 
            With trusted collaborations and industry-best practices, we ensure every client receives personalized, 
            high-performance, and scalable solutions. Your satisfaction fuels our passion.
          </p>
        </motion.div>
        
        <motion.div 
          className={styles.reasonsGrid}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
        >
          {reasonsData.map((reason, index) => (
            <motion.div 
              key={reason.id}
              className={styles.reasonCard}
              variants={cardVariants}
              style={{ 
                '--card-color': reason.color,
                '--card-color-rgb': reason.color.replace('#', '').match(/.{2}/g)
                  .map(hex => parseInt(hex, 16)).join(', '),
                '--card-delay': `${index * 0.1}s`,
                '--rotate': `${(index % 2 === 0 ? 1 : -1) * 45}deg`
              }}
              whileHover={{ 
                scale: 1.03,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <div className={styles.cardContent}>
                <div className={styles.iconWrapper}>
                  <div className={styles.icon}>
                    {reason.icon}
                  </div>
                  <div className={styles.iconGlow}></div>
                </div>
                <h3 className={styles.reasonTitle}>{reason.title}</h3>
                <p className={styles.reasonDescription}>{reason.description}</p>
              </div>
              
              <div className={styles.cardBorder}></div>
              <div className={styles.cardHighlight}></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 