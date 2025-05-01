'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import styles from './services.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ServiceCard from '../components/ServiceCard';

// Hosting Plan Component
const HostingPlan = ({ title, features, recommended = false, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold: 0.2 });
  
  return (
    <motion.div 
      className={`${styles.hostingPlan} ${recommended ? styles.recommended : ''}`}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
    >
      {recommended && <div className={styles.recommendedBadge}>Most Popular</div>}
      <h3 className={styles.hostingTitle}>{title}</h3>
      <ul className={styles.hostingFeatures}>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <button className={styles.enquireButton}>Enquire Now</button>
    </motion.div>
  );
};

export default function Services() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroRef = useRef(null);
  const servicesOverviewRef = useRef(null);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.85]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  const scrollToServices = () => {
    servicesOverviewRef.current.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };
  
  useEffect(() => {
    setMounted(true);
    
    // Smooth scroll to top on page load
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="module-background">
      <Navbar />
      
      <div className={styles.servicesPage}>
        {/* Hero Section */}
        <motion.section 
          className={styles.heroSection} 
          ref={heroRef}
          style={{ scale: heroScale, opacity: heroOpacity }}
        >
          <div className={styles.heroContent}>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className={styles.heroTitle}
            >
              Transforming Ideas <br/>
              <span>Into Digital Reality</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={styles.heroSubtitle}
            >
              We offer comprehensive web development services to bring your vision to life
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className={styles.heroButton}
              onClick={scrollToServices}
            >
              View Our Services
            </motion.button>
          </div>
          <div className={styles.heroGraphic}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            <div className={styles.circle3}></div>
            <div className={styles.grid}></div>
          </div>
        </motion.section>

        {/* Services Overview */}
        <section className={styles.servicesOverview} ref={servicesOverviewRef} id="services-overview">
          <div className={styles.sectionHeader}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className={styles.sectionTitle}
            >
              Our Services
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={styles.sectionSubtitle}
            >
              We offer a wide range of web development services to cater to all your digital needs
            </motion.p>
          </div>

          <div className={styles.servicesGrid}>
            <ServiceCard 
              title="Frontend Development" 
              description="We create stunning, responsive user interfaces that captivate your audience and drive engagement. Our frontend development services focus on creating intuitive, accessible, and performant interfaces that provide exceptional user experiences across all devices."
              delay={1}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              }
              benefits={[
                "Responsive designs that work perfectly on all devices, from mobile to desktop",
                "Optimized for performance with fast load times and smooth interactions",
                "Accessibility compliance to reach all users, including those with disabilities",
                "Engaging animations and transitions that enhance user experience",
                "SEO-friendly markup to improve search engine visibility"
              ]}
              technologies={[
                "React.js & Next.js for building dynamic, interactive interfaces",
                "TypeScript for type-safe, maintainable code",
                "CSS Modules & Styled Components for modular styling",
                "Framer Motion for fluid animations and transitions",
                "Tailwind CSS for rapid UI development",
                "Redux/Context API for state management",
                "Jest & React Testing Library for comprehensive testing"
              ]}
              methodologies={[
                "Component-driven development for reusable, consistent UI elements",
                "Mobile-first design approach ensuring responsiveness across all devices",
                "Atomic design principles for scalable interface architecture",
                "Continuous performance monitoring and optimization",
                "Regular usability testing to refine user experience",
                "Progressive enhancement to support all browsers and connection speeds"
              ]}
            />
            
            <ServiceCard 
              title="Backend Development" 
              description="We build robust, scalable server-side applications that power your digital experiences. Our backend development focuses on creating secure, efficient systems that handle complex business logic and data management with reliability and performance."
              delay={2}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                  <line x1="6" y1="6" x2="6.01" y2="6"></line>
                  <line x1="6" y1="18" x2="6.01" y2="18"></line>
                </svg>
              }
              benefits={[
                "Scalable architecture that grows with your business needs",
                "High-performance APIs designed for speed and reliability",
                "Robust security practices protecting your data and users",
                "Thorough documentation for seamless integration",
                "Automated testing ensuring reliability and stability",
                "Microservices architecture for modular, maintainable systems"
              ]}
              technologies={[
                "Node.js & Express.js for fast, efficient server-side applications",
                "Python & Django/Flask for data-intensive applications",
                "GraphQL for flexible, client-driven data queries",
                "RESTful API design for standardized communication",
                "WebSockets for real-time features and notifications",
                "JWT & OAuth2 for secure authentication and authorization",
                "Serverless functions for cost-effective, scalable operations"
              ]}
              methodologies={[
                "Domain-Driven Design for complex business logic implementation",
                "Test-Driven Development ensuring code quality and reliability",
                "CI/CD integration for automated testing and deployment",
                "Comprehensive logging and monitoring systems",
                "Horizontal scaling strategies for handling increased load",
                "Database optimization for efficient data access and storage",
                "Security-first development approach with regular vulnerability scanning"
              ]}
            />
            
            <ServiceCard 
              title="Database Management" 
              description="We design, implement, and maintain database systems that securely store and efficiently manage your application's data. Our database solutions are optimized for performance, scalability, and reliability to support your business operations."
              delay={3}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                </svg>
              }
              benefits={[
                "Optimized database schema design for efficient data operations",
                "High-performance queries with proper indexing and optimization",
                "Comprehensive data security with encryption and access controls",
                "Automated backups and disaster recovery planning",
                "Seamless scaling to handle growing data volumes",
                "Data integrity through proper constraints and validation"
              ]}
              technologies={[
                "MongoDB for flexible, document-oriented data storage",
                "PostgreSQL for complex relational data with advanced features",
                "MySQL for reliable, widely-supported relational databases",
                "Redis for high-performance caching and real-time data",
                "Firebase Firestore for real-time syncing and offline capabilities",
                "Time-series databases for analytics and monitoring data",
                "Graph databases for complex interconnected data structures"
              ]}
              methodologies={[
                "Data modeling and normalization best practices",
                "Query optimization and performance tuning",
                "Migrations planning and execution with zero downtime",
                "Regular security audits and vulnerability assessments",
                "Data archiving and retention policy implementation",
                "Monitoring and alerting for database performance metrics",
                "Comprehensive documentation of database architecture"
              ]}
            />
            
            <ServiceCard 
              title="CMS & CRM Solutions" 
              description="We implement and customize Content Management Systems and Customer Relationship Management tools tailored to your business requirements. Our solutions streamline content management and customer engagement, improving operational efficiency."
              delay={4}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              }
              benefits={[
                "User-friendly interfaces for effortless content management",
                "Customized workflows matching your business processes",
                "Seamless integration with your existing systems and tools",
                "Detailed analytics and reporting for data-driven decisions",
                "Automation of routine tasks to improve productivity",
                "Robust permission systems ensuring data access control",
                "Mobile-friendly interfaces for on-the-go management"
              ]}
              technologies={[
                "WordPress with custom themes and plugins for flexible content management",
                "Headless CMS solutions like Strapi, Contentful, and Sanity",
                "HubSpot for integrated marketing, sales, and service",
                "SalesForce for enterprise-grade customer relationship management",
                "Custom CRM development tailored to specific business needs",
                "Shopify and WooCommerce for e-commerce content management",
                "JAMstack architecture combining headless CMS with modern frontend"
              ]}
              methodologies={[
                "Thorough requirements analysis to identify exact business needs",
                "User experience design focused on content editor workflows",
                "Custom field and taxonomy development for specialized content",
                "Performance optimization for large content repositories",
                "Comprehensive training and documentation for content teams",
                "Regular security updates and maintenance",
                "Phased implementation approach minimizing business disruption"
              ]}
            />
            
            <ServiceCard 
              title="AI & Automation" 
              description="We integrate artificial intelligence and automation solutions to enhance your applications with smart features and streamlined processes. Our AI integrations add intelligence to your products, improving user experience and operational efficiency."
              delay={5}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              }
              benefits={[
                "Intelligent features that learn and adapt to user behavior",
                "Automation of repetitive tasks, saving time and reducing errors",
                "Enhanced user experiences through personalization",
                "Data-driven insights from advanced analytics",
                "24/7 availability through AI-powered chatbots and assistants",
                "Improved decision-making with predictive analytics",
                "Competitive advantage through cutting-edge technology"
              ]}
              technologies={[
                "Natural Language Processing (NLP) for chatbots and content analysis",
                "Machine Learning for personalization and recommendation systems",
                "Computer Vision for image recognition and processing",
                "Sentiment Analysis for customer feedback interpretation",
                "Predictive Analytics for forecasting and trend identification",
                "Process Automation for streamlined workflows",
                "Integration with AI platforms like OpenAI, Google AI, and Azure AI"
              ]}
              methodologies={[
                "Ethical AI development with fairness and transparency",
                "Iterative model training and refinement for improved accuracy",
                "Hybrid approaches combining rule-based and ML solutions",
                "Comprehensive testing for bias and edge cases",
                "Continuous monitoring and retraining of AI models",
                "Explainable AI techniques for transparency in decision-making",
                "Privacy-first data handling for training and inference"
              ]}
            />
            
            <ServiceCard 
              title="Payment Gateway Integration" 
              description="We seamlessly integrate secure payment processing solutions into your applications, enabling smooth and reliable financial transactions. Our payment integrations prioritize security, user experience, and compliance with financial regulations."
              delay={6}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
              }
              benefits={[
                "Secure transactions with industry-standard encryption protocols",
                "Streamlined checkout experience reducing cart abandonment",
                "Support for multiple payment methods increasing conversion rates",
                "Comprehensive fraud detection and prevention",
                "Detailed financial reporting and reconciliation",
                "Compliance with PCI DSS and other regulatory requirements",
                "Subscription and recurring payment capabilities"
              ]}
              technologies={[
                "Stripe for flexible, developer-friendly payment processing",
                "PayPal for widely recognized, trusted payment options",
                "Razorpay for India-focused payment solutions",
                "Apple Pay and Google Pay for mobile-friendly checkout",
                "Braintree for comprehensive payment management",
                "Cryptocurrency payment options for modern businesses",
                "3D Secure implementation for additional transaction security"
              ]}
              methodologies={[
                "Seamless API integration with existing commerce systems",
                "Mobile-optimized checkout flows for higher conversion",
                "Tokenization for secure recurring payment handling",
                "Comprehensive testing with sandbox environments",
                "Detailed error handling and recovery strategies",
                "User-friendly refund and dispute management processes",
                "Regular security audits and updates to payment systems"
              ]}
            />
          </div>
        </section>

        {/* Hosting Plans */}
        <section className={styles.hostingSection}>
          <div className={styles.sectionHeader}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className={styles.sectionTitle}
            >
              Hosting Solutions
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={styles.sectionSubtitle}
            >
              Choose the perfect hosting plan for your application's needs
            </motion.p>
          </div>

          <div className={styles.hostingGrid}>
            <HostingPlan 
              title="Shared Hosting"
              features={[
                "Perfect for small to medium websites",
                "99.9% uptime guarantee",
                "Easy control panel management",
                "Regular automated backups",
                "Free SSL certificate installation",
                "One-click CMS installation",
                "24/7 technical support"
              ]}
              delay={1}
            />
            
            <HostingPlan 
              title="VPS Hosting"
              features={[
                "Dedicated resources for better performance",
                "Full root access and server control",
                "Scalable resources as your needs grow",
                "Enhanced security features",
                "Regular automated backups",
                "Premium support with faster response times",
                "Custom server configurations available",
                "Perfect for medium to high-traffic websites"
              ]}
              recommended={true}
              delay={2}
            />
            
            <HostingPlan 
              title="Cloud Hosting"
              features={[
                "Auto-scaling resources based on traffic demands",
                "Distributed architecture for maximum reliability",
                "Load balancing across multiple servers",
                "Geographic distribution for faster global access",
                "Advanced DDoS protection included",
                "Real-time resource monitoring and alerts",
                "High-performance SSD storage",
                "Ideal for high-traffic and enterprise applications",
                "99.99% uptime guarantee"
              ]}
              delay={3}
            />
          </div>
        </section>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <div className={styles.sectionHeader}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className={styles.sectionTitle}
            >
              Frequently Asked Questions
            </motion.h2>
          </div>

          <div className={styles.faqGrid}>
            <motion.div 
              className={styles.faqItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3>How long does it typically take to complete a website project?</h3>
              <p>The timeline varies depending on the complexity of the project. A simple website might take 3-4 weeks, while more complex applications can take 8-12 weeks or more. We begin with a detailed planning phase to establish clear milestones and provide you with a realistic timeline based on your specific requirements. Throughout the project, we maintain transparent communication about progress and any factors that might affect the timeline.</p>
            </motion.div>
            
            <motion.div 
              className={styles.faqItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3>Do you offer maintenance services after the project is completed?</h3>
              <p>Yes, we offer ongoing maintenance packages to ensure your website remains secure, up-to-date, and functioning optimally. Our maintenance plans include regular security updates, performance monitoring, content updates, and technical support. We provide different tiers of maintenance services to match your needs and budget, from essential security updates to comprehensive technical support and regular feature enhancements. This ensures your digital assets continue to serve your business effectively long after the initial development is complete.</p>
            </motion.div>
            
            <motion.div 
              className={styles.faqItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3>What is your development process like?</h3>
              <p>Our development process follows an agile methodology with clear phases: Discovery, Planning, Design, Development, Testing, Deployment, and Maintenance. We begin with thorough requirements gathering to understand your business goals. We then create detailed specifications and project plans before moving into design and development. Throughout the process, we maintain consistent communication and provide regular updates through your preferred channels. Our iterative approach allows for feedback and adjustments at each stage, ensuring the final product aligns perfectly with your vision.</p>
            </motion.div>
            
            <motion.div 
              className={styles.faqItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3>Can you help migrate my existing website to a new platform?</h3>
              <p>Absolutely! We specialize in website migrations and can help transfer your existing content, databases, and functionality to a new platform while minimizing downtime and ensuring data integrity. Our migration process includes a comprehensive audit of your current website, detailed planning for the transfer, preservation of SEO rankings, thorough testing, and a carefully orchestrated cutover to minimize disruption. We handle migrations to and from various platforms including WordPress, Shopify, custom systems, and more, always ensuring your valuable content and functionality are preserved.</p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <motion.div 
            className={styles.ctaContent}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <h2>Ready to Start Your Project?</h2>
            <p>Let's discuss how we can help bring your vision to life with our comprehensive web development services.</p>
            <button className={styles.ctaButton}>Get in Touch</button>
          </motion.div>
          <div className={styles.ctaBackground}>
            <div className={styles.ctaCircle1}></div>
            <div className={styles.ctaCircle2}></div>
            <div className={styles.ctaCircle3}></div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
} 