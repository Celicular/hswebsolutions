'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PricingFAQ.module.css';

const PricingFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  
  const toggleQuestion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const faqItems = [
    {
      question: "How do I choose the right plan for my business?",
      answer: "Evaluate your specific needs based on website complexity, traffic expectations, and feature requirements. Our Essential plan is great for small businesses, Professional for growing companies, and Enterprise for complex web applications. You can also contact us for a personalized recommendation."
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer: "Absolutely! You can easily upgrade or downgrade your plan at any time. When upgrading, you'll only pay the prorated difference for the remainder of your billing cycle. Downgrading will take effect on your next billing date."
    },
    {
      question: "Do you offer custom solutions beyond the standard plans?",
      answer: "Yes, we specialize in custom web development solutions tailored to your unique requirements. Contact us for a personalized quote on custom features, advanced integrations, or specialized development needs."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers. For Enterprise customers, we can also arrange specialized payment methods based on your company's procurement procedures."
    },
    {
      question: "Is there a money-back guarantee?",
      answer: "We offer a 14-day satisfaction guarantee for all new plans. If you're not completely satisfied with our service, contact us within the first 14 days for a full refund."
    },
    {
      question: "What kind of support is included with each plan?",
      answer: "All plans include email support with varying response times based on plan level. Professional plans include priority email support and scheduled calls, while Enterprise plans receive dedicated support with rapid response times and regular check-in meetings."
    }
  ];
  
  return (
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
        <p className={styles.sectionSubtitle}>Find answers to common questions about our pricing and services</p>
        
        <div className={styles.faqContainer}>
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${openIndex === index ? styles.faqItemOpen : ''}`}
            >
              <div 
                className={styles.faqQuestion}
                onClick={() => toggleQuestion(index)}
              >
                <h3>{item.question}</h3>
                <div className={styles.faqIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d={openIndex === index ? "M18 15L12 9L6 15" : "M6 9L12 15L18 9"} 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div 
                    className={styles.faqAnswer}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <p>{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <div className={styles.extraQuestion}>
          <p>Still have questions?</p>
          <div className={styles.estimateBlock}>
            <svg className={styles.chatIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Get your estimate now</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingFAQ; 