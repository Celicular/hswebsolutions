'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, EffectCoverflow } from 'swiper/modules';
import styles from './ClientsSection.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';

// Client data with actual logos
const clientsData = [
  {
    id: 1,
    name: 'B.C.SEN JEWELLERS, Kolkata',
    logo: '/clients/logos/1.jpeg',
    rating: 5,
    caption: 'Exceptional web solutions that transformed our digital presence.'
  },
  {
    id: 2,
    name: 'Online Medical Store, Bhopal',
    logo: '/clients/logos/2.png',
    rating: 5,
    caption: 'Simple, Fast and Reliable development, appreciated'
  },
  {
    id: 3,
    name: 'Pizzawale, West Bengal',
    logo: '/clients/logos/3.png',
    rating: 4.5,
    caption: 'Professional service in affordable budget'
  },
  {
    id: 4,
    name: 'A.I.D.M, Kolkata',
    logo: '/clients/logos/4.jpeg',
    rating: 5,
    caption: 'Really good service, Very Satisfied'
  },
  {
    id: 5,
    name: '90+ More',
    logo: '/clients/logos/5.png',
    rating: 4.5,
    caption: 'And counting...'
  }
];

const ClientsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  // Handle responsive breakpoints
  useEffect(() => {
    const checkBreakpoints = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    
    checkBreakpoints();
    window.addEventListener('resize', checkBreakpoints);
    
    return () => window.removeEventListener('resize', checkBreakpoints);
  }, []);

  // Start animations when section comes into view
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  // Generate star rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    
    return (
      <div className={styles.ratingStars}>
        {[...Array(fullStars)].map((_, i) => (
          <span key={`star-${i}`} className={styles.starFull}>★</span>
        ))}
        {halfStar && <span className={styles.starHalf}>★</span>}
      </div>
    );
  };

  // Handle swiper slide change
  const handleSlideChange = (swiper) => {
    setActiveIndex(swiper.realIndex);
  };

  return (
    <section className={styles.clientsSection} ref={ref}>
      {/* Background Elements */}
      <div className={styles.backgroundElements}>
        <div className={styles.bgCircle} style={{ top: '10%', right: '15%' }}></div>
        <div className={styles.bgSquare} style={{ top: '60%', left: '8%' }}></div>
        <div className={styles.bgCircle} style={{ bottom: '10%', right: '20%' }}></div>
        <div className={styles.bgDots}></div>
      </div>
      
      <div className={styles.container}>
        <motion.div 
          className={styles.sectionHeader}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className={styles.sectionTitle}>Our Clients</h2>
          <p className={styles.sectionSubtitle}>
            A glimpse at the clients who trust us with their digital presence
          </p>
        </motion.div>

        {/* Swiper Carousel */}
        <motion.div
          className={styles.carouselContainer}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Swiper
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={isMobile ? 1 : isTablet ? 2 : 3}
            spaceBetween={30}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: `${styles.paginationBullet}`,
              bulletActiveClass: `${styles.paginationBulletActive}`,
            }}
            loop={true}
            speed={800}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Autoplay, EffectCoverflow]}
            onSlideChange={handleSlideChange}
            className={styles.swiperContainer}
          >
            {clientsData.map((client) => (
              <SwiperSlide key={client.id} className={styles.swiperSlide}>
                <div className={styles.clientCard}>
                  <div className={styles.clientLogo}>
                    <img 
                      src={client.logo} 
                      alt={`${client.name} logo`} 
                      className={styles.logoImage}
                    />
                  </div>
                  <div className={styles.clientInfo}>
                    <div className={styles.clientHeader}>
                      <h3 className={styles.clientName}>{client.name}</h3>
                    </div>
                    {renderStars(client.rating)}
                    <p className={styles.clientCaption}>"{client.caption}"</p>
                  </div>
                  <div className={styles.cardGlow}></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination will be rendered automatically by Swiper */}
          <div className={styles.paginationWrapper}></div>
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsSection; 