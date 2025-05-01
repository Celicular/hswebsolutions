'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaClock,
  FaGithub,
  FaLinkedinIn,
  FaTwitter,
  FaInstagram 
} from 'react-icons/fa';
import styles from '../page.module.css';

const ContactInfo = () => {
  const contactDetails = [
    {
      icon: <FaMapMarkerAlt />,
      label: 'Address',
      value: 'Adityapur, Jamshedpur, Jharkhand, India',
      link: null
    },
    {
      icon: <FaPhoneAlt />,
      label: 'Phone',
      value: '+91 9942868093',
      link: 'tel:+919942868093'
    },
    {
      icon: <FaEnvelope />,
      label: 'Email',
      value: 'hsg090907.jsr@gmail.com',
      link: 'mailto:hsg090907.jsr@gmail.com'
    },
    {
      icon: <FaClock />,
      label: 'Business Hours',
      value: 'Mon - Fri: 9:00 AM - 6:00 PM',
      link: null
    }
  ];

  const socialLinks = [
    {
      icon: <FaGithub />,
      url: 'https://github.com',
      label: 'GitHub'
    },
    {
      icon: <FaLinkedinIn />,
      url: 'https://linkedin.com',
      label: 'LinkedIn'
    },
    {
      icon: <FaTwitter />,
      url: 'https://twitter.com',
      label: 'Twitter'
    },
    {
      icon: <FaInstagram />,
      url: 'https://instagram.com',
      label: 'Instagram'
    }
  ];

  return (
    <div className={styles.contactInfoContainer}>
      <h2 className={styles.infoTitle}>Contact Info</h2>
      
      <div className={styles.infoItems}>
        {contactDetails.map((item, index) => (
          <div key={index} className={styles.infoItem}>
            <div className={styles.infoIcon}>
              {item.icon}
            </div>
            <div className={styles.infoContent}>
              <div className={styles.infoLabel}>{item.label}</div>
              {item.link ? (
                <a href={item.link} className={styles.infoLink}>
                  <div className={styles.infoValue}>{item.value}</div>
                </a>
              ) : (
                <div className={styles.infoValue}>{item.value}</div>
              )}
            </div>
          </div>
        ))}
      </div>
     
    </div>
  );
};

export default ContactInfo; 