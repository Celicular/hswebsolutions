'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './BlogGrid.module.css';

const BlogGrid = () => {
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchResults, setSearchResults] = useState(null);

  // Get query parameters
  const search = searchParams.get('search');
  const tag = searchParams.get('tag');

  useEffect(() => {
    fetchPosts();
  }, [currentPage, search, tag]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Build the API URL with query parameters
      let apiUrl = `/api/blog-posts?page=${currentPage}&limit=6`;
      
      // Add tag filter if provided
      if (tag) {
        apiUrl += `&tag=${encodeURIComponent(tag)}`;
      }
      
      // Fetch posts from the API with pagination
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      
      // If there's a search query, filter posts client-side
      let filteredPosts = data.posts;
      if (search) {
        const searchLower = search.toLowerCase();
        filteredPosts = data.posts.filter(post => 
          post.title.toLowerCase().includes(searchLower) || 
          post.excerpt.toLowerCase().includes(searchLower) || 
          post.content.toLowerCase().includes(searchLower)
        );
        
        setSearchResults({
          term: search,
          count: filteredPosts.length,
          total: data.posts.length
        });
      } else {
        setSearchResults(null);
      }
      
      setPosts(filteredPosts);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts. Please try again later.');
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className={styles.blogGrid}>
        <div className={styles.container}>
          <div className={styles.loadingContainer}>
            <div className={styles.loader}></div>
            <p>Loading blog posts...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className={styles.blogGrid}>
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            <h3>Oops!</h3>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <section className={styles.blogGrid}>
        <div className={styles.container}>
          <div className={styles.errorContainer}>
            {searchResults ? (
              <>
                <h3>No results found</h3>
                <p>Your search for "{searchResults.term}" did not match any posts.</p>
                <Link href="/blog" className={styles.returnLink}>
                  View all posts
                </Link>
              </>
            ) : tag ? (
              <>
                <h3>No posts found in this category</h3>
                <p>There are no posts available with the tag "{tag}".</p>
                <Link href="/blog" className={styles.returnLink}>
                  View all posts
                </Link>
              </>
            ) : (
              <>
                <h3>No posts found</h3>
                <p>Check back later for new content.</p>
              </>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.blogGrid}>
      <div className={styles.container}>
        {/* Search results message */}
        {searchResults && (
          <div className={styles.searchResultsInfo}>
            <p>
              {searchResults.count > 0 
                ? `Found ${searchResults.count} result${searchResults.count !== 1 ? 's' : ''} for "${searchResults.term}"`
                : `No results found for "${searchResults.term}"`
              }
            </p>
            <Link href="/blog" className={styles.clearSearch}>
              Clear search
            </Link>
          </div>
        )}
        
        {/* Tag filter message */}
        {tag && !searchResults && (
          <div className={styles.tagFilterInfo}>
            <p>Showing posts tagged with: <span className={styles.tagHighlight}>{tag}</span></p>
            <Link href="/blog" className={styles.clearFilter}>
              Clear filter
            </Link>
          </div>
        )}
        
        <motion.div 
          className={styles.blogList}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {posts.map((post, index) => (
            <BlogPostItem key={post.id} post={post} index={index} />
          ))}
        </motion.div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button 
            className={styles.pageButton} 
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className={styles.pageButton} 
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

const BlogPostItem = ({ post, index }) => {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <motion.article 
      className={styles.blogPost}
      custom={index}
      initial="hidden"
      animate="visible"
      variants={variants}
    >
      <div className={styles.blogImageContainer}>
        <img 
          src={post.featuredImage || post.image_url || '/uploads/default-blog.jpg'} 
          alt={post.title}
          className={styles.blogImage}
        />
      </div>
      <div className={styles.postContent}>
        <h2 className={styles.postTitle}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        <p className={styles.postExcerpt}>{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
          Read More
        </Link>
        <div className={styles.postMeta}>
          <span className={styles.postDate} title={formatDate(post.createdAt)}>
            {formatDate(post.createdAt)}
          </span>
          <div className={styles.postTags}>
            {post.tags && post.tags.length > 0 && 
              post.tags.slice(0, 2).map((tag, idx) => (
                <Link 
                  key={idx} 
                  href={`/blog?tag=${encodeURIComponent(tag)}`} 
                  className={styles.tag}
                >
                  {tag}
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </motion.article>
  );
};

export default BlogGrid; 