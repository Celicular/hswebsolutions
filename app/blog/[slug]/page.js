'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import styles from './page.module.css';

export default function BlogPostPage() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchBlogPost();
  }, [slug]);

  const fetchBlogPost = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/blog-posts?slug=${slug}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      
      const data = await response.json();
      
      if (data.posts.length === 0) {
        throw new Error('Blog post not found');
      }
      
      setPost(data.posts[0]);
      
      // Fetch related posts based on tags
      if (data.posts[0].tags && data.posts[0].tags.length > 0) {
        const tag = data.posts[0].tags[0];
        const relatedResponse = await fetch(`/api/blog-posts?tag=${tag}&limit=3`);
        
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          // Filter out the current post
          setRelatedPosts(relatedData.posts.filter(p => p.id !== data.posts[0].id));
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Function to parse content and handle image tags and HTML content
  const renderContent = (content) => {
    if (!content) return null;
    
    // Regular expression to match img(imagename) format
    const regex = /img\(([^)]+)\)/g;
    
    // Check if content contains HTML tags
    const containsHtml = /<[a-z][\s\S]*>/i.test(content);
    
    // If content contains HTML, use dangerouslySetInnerHTML to render it
    if (containsHtml) {
      // Process image tags within HTML content
      let processedContent = content;
      let match;
      
      // Replace img() tags with actual image HTML
      while ((match = regex.exec(content)) !== null) {
        const imageName = match[1];
        const imgTag = `<div class="${styles.contentImageContainer}">
          <img 
            src="/uploads/${imageName}.jpg" 
            alt="${imageName}" 
            class="${styles.contentImage}"
          />
          <span class="${styles.imageCaption}">${imageName.replace(/-/g, ' ')}</span>
        </div>`;
        
        processedContent = processedContent.replace(match[0], imgTag);
      }
      
      return (
        <div dangerouslySetInnerHTML={{ __html: processedContent }} />
      );
    }
    
    // If content doesn't contain HTML, use the existing implementation
    // Split content by the image tags
    const parts = content.split(regex);
    
    // Extract image names
    const imageNames = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      imageNames.push(match[1]);
    }
    
    // Create an array of content parts and images
    const renderedContent = [];
    
    parts.forEach((part, index) => {
      // Add the text part
      if (part.trim()) {
        renderedContent.push(
          <p key={`text-${index}`}>{part}</p>
        );
      }
      
      // Add the image if there is one for this position
      if (index < parts.length - 1 && imageNames[index]) {
        renderedContent.push(
          <div key={`img-${index}`} className={styles.contentImageContainer}>
            <img 
              src={`/uploads/${imageNames[index]}.jpg`}
              alt={imageNames[index]} 
              className={styles.contentImage}
            />
            <span className={styles.imageCaption}>{imageNames[index].replace(/-/g, ' ')}</span>
          </div>
        );
      }
    });
    
    return renderedContent;
  };

  // Loading state
  if (!mounted || loading) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.blogContentWrapper}>
            <div className={styles.loading}>
              <div className={styles.loadingSpinner}></div>
              <p className={styles.loadingText}>Loading blog post...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.blogContentWrapper}>
            <button 
              onClick={() => router.push('/blog')}
              className={styles.backButton}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Blog
            </button>
            
            <div className={styles.blogPostContainer}>
              <div className={styles.error}>
                <h2>Error</h2>
                <p>{error}</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty state
  if (!post) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <div className={styles.blogContentWrapper}>
            <button 
              onClick={() => router.push('/blog')}
              className={styles.backButton}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Blog
            </button>
            
            <div className={styles.blogPostContainer}>
              <div className={styles.error}>
                <h2>Blog post not found</h2>
                <p>The requested blog post could not be found.</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.blogContentWrapper}>
          <button 
            onClick={() => router.push('/blog')}
            className={styles.backButton}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Blog
          </button>
          
          <motion.div 
            className={styles.blogPostContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Blog Header */}
            <div className={styles.blogHeader}>
              <img 
                src={post.featuredImage || post.image_url || '/uploads/default-blog.jpg'} 
                alt={post.title} 
                className={styles.blogImage}
              />
              
              <div className={styles.blogMeta}>
                <div className={styles.blogMetaTop}>
                  <div className={styles.blogDate}>
                    {formatDate(post.createdAt)}
                  </div>
                  {post.tags && post.tags.length > 0 && (
                    <div className={styles.blogTags}>
                      {post.tags.map((tag, index) => (
                        <span key={index} className={styles.blogTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <h1 className={styles.blogTitle}>{post.title}</h1>
              </div>
            </div>
            
            {/* Blog Content */}
            <div className={styles.blogContent}>
              {renderContent(post.content)}
            </div>
          </motion.div>
        </div>
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section 
            className={styles.relatedPosts}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className={styles.relatedPostsTitle}>Related Articles</h2>
            <div className={styles.relatedPostsGrid}>
              {relatedPosts.map((relatedPost) => (
                <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id}>
                  <div className={styles.relatedPostCard}>
                    <div className={styles.relatedPostImage}>
                      <img 
                        src={relatedPost.featuredImage || relatedPost.image_url || '/uploads/default-blog.jpg'} 
                        alt={relatedPost.title}
                      />
                    </div>
                    <div className={styles.relatedPostContent}>
                      <h3>{relatedPost.title}</h3>
                      <p>{relatedPost.excerpt}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </main>
      <Footer />
    </div>
  );
} 