import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'celi',
  database: process.env.DB_NAME || 'hswebsol',
  port: parseInt(process.env.DB_PORT || '3306'),
};

// Sample blog posts to seed the database if it's empty
const samplePosts = [
  {
    title: "5 Essential Web Development Tools for 2024",
    slug: "essential-web-development-tools-2024",
    excerpt: "Discover the most powerful web development tools that will boost your productivity in 2024.",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at lacus ut nulla tincidunt feugiat. Vivamus euismod, urna quis tempor efficitur, metus sapien faucibus sapien, eu finibus nisi justo ut nisi. In this article, we'll explore the most essential web development tools that every developer should have in their arsenal in 2024.\n\nFirst on our list is VS Code. img(dev-tool-vscode) Visual Studio Code has become the industry standard editor for web developers due to its flexibility, speed, and extensive library of extensions.\n\nNext, we have Docker. Containerization has transformed how we develop and deploy applications, making it easier to ensure consistency across different environments and team members.",
    image_url: "/uploads/web-dev-tools.jpg",
    tags: "Development,Tools,Productivity"
  },
  {
    title: "How to Optimize Your Website Performance",
    slug: "how-to-optimize-website-performance",
    excerpt: "Learn practical techniques to improve your website's loading speed and overall performance.",
    content: "Website performance is critical for user experience and SEO. In this comprehensive guide, we explore various techniques to optimize your website's loading speed and overall performance for better user engagement and higher search rankings.\n\nImage optimization is crucial. img(image-optimization) Properly sized and compressed images can significantly reduce page load times without sacrificing quality.\n\nImplementing lazy loading for images and videos ensures that resources are only loaded when they're about to enter the viewport, improving initial page load speed.",
    image_url: "/uploads/website-performance.jpg",
    tags: "Performance,Optimization,SEO"
  },
  {
    title: "Responsive Web Design Best Practices",
    slug: "responsive-web-design-best-practices",
    excerpt: "Master the art of creating websites that look great on any device with these best practices.",
    content: "In today's mobile-first world, responsive web design is no longer optional. This article covers the essential best practices for creating websites that provide an optimal viewing experience across all devices, from desktop computers to smartphones.\n\nUse flexible grid layouts based on relative units. img(responsive-grid) This allows your design to adapt fluidly to different screen sizes.\n\nImplement media queries strategically to adjust layouts at appropriate breakpoints, ensuring your content remains readable and accessible regardless of the device.",
    image_url: "/uploads/responsive-design.jpg",
    tags: "Design,Responsive,Mobile"
  }
];

async function ensureTableExists(connection) {
  try {
    // Check if table exists
    const [tables] = await connection.execute(
      "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = ? AND table_name = ?",
      [dbConfig.database, "blog_posts"]
    );
    
    if (tables[0].count === 0) {
      console.log('Creating blog_posts table...');
      
      // Create the blog_posts table
      await connection.execute(`
        CREATE TABLE blog_posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL,
          excerpt TEXT,
          content LONGTEXT,
          image_url VARCHAR(500),
          tags VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('blog_posts table created successfully');
    }
  } catch (error) {
    console.error('Error creating table:', error);
  }
}

async function seedDatabaseIfEmpty(connection) {
  try {
    // Check if the table is empty
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM blog_posts');
    const count = countResult[0].count;
    
    if (count === 0) {
      console.log('Blog posts table is empty, seeding with sample data...');
      
      // Insert sample posts
      for (const post of samplePosts) {
        await connection.execute(
          'INSERT INTO blog_posts (title, slug, excerpt, content, image_url, tags) VALUES (?, ?, ?, ?, ?, ?)',
          [post.title, post.slug, post.excerpt, post.content, post.image_url, post.tags]
        );
      }
      
      console.log('Database seeded successfully with sample blog posts');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

export async function GET(request) {
  console.log('API route called: GET /api/blog-posts');
  
  // Parse query parameters
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit') || 10;
  const page = searchParams.get('page') || 1;
  const tag = searchParams.get('tag');
  const slug = searchParams.get('slug');
  const search = searchParams.get('search');
  
  console.log('Query params:', { limit, page, tag, slug, search });
  
  let connection;
  try {
    // Create database connection
    console.log('Connecting to database with config:', { 
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    connection = await mysql.createConnection(dbConfig);
    console.log('Database connection established');
    
    // Ensure the blog_posts table exists
    await ensureTableExists(connection);
    
    // Seed the database if it's empty
    await seedDatabaseIfEmpty(connection);
    
    // Base query
    let query = 'SELECT * FROM blog_posts';
    const queryParams = [];
    
    // Add filters if provided
    const whereConditions = [];
    
    if (tag) {
      whereConditions.push('tags LIKE ?');
      queryParams.push(`%${tag}%`);
    }
    
    if (slug) {
      whereConditions.push('slug = ?');
      queryParams.push(slug);
    }
    
    if (search) {
      whereConditions.push('(title LIKE ? OR excerpt LIKE ? OR content LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    // Add WHERE clause if we have conditions
    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }
    
    // Process pagination values 
    const limitVal = parseInt(limit);
    const offsetVal = (parseInt(page) - 1) * limitVal;
    
    // Add order and pagination (use direct values instead of parameters)
    query += ` ORDER BY created_at DESC LIMIT ${limitVal} OFFSET ${offsetVal}`;
    
    // Execute query
    console.log('Executing query:', query);
    const [rows] = await connection.execute(query, queryParams);
    console.log(`Query executed successfully, fetched ${rows.length} posts`);
    
    // Process posts to match expected format in the frontend
    const posts = rows.map(post => ({
      id: post.id || Math.random().toString(36).substr(2, 9),
      title: post.title || '',
      slug: post.slug || post.title?.toLowerCase().replace(/\s+/g, '-') || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      featuredImage: post.image_url || '', 
      tags: post.tags ? post.tags.split(',').map(tag => tag.trim()) : [],
      createdAt: post.created_at || new Date().toISOString()
    }));
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM blog_posts';
    if (tag || slug || search) {
      countQuery += ' WHERE ' + whereConditions.join(' AND ');
    }
    
    console.log('Executing count query:', countQuery);
    const [countResult] = await connection.execute(
      countQuery,
      queryParams
    );
    const totalPosts = countResult[0].total;
    console.log('Total posts count:', totalPosts);
    
    // Close the connection
    await connection.end();
    console.log('Database connection closed');
    
    // Return the posts with pagination metadata
    const response = {
      posts: posts.length ? posts : [],
      totalPages: Math.ceil(totalPosts / limitVal),
      page: parseInt(page),
      total: totalPosts,
    };
    
    console.log('Sending response with metadata:', {
      postsCount: posts.length,
      totalPages: response.totalPages,
      page: response.page,
      total: response.total
    });
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Database error:', error);
    
    // Log detailed error information
    if (error.code) {
      console.error(`SQL Error Code: ${error.code}`);
    }
    if (error.errno) {
      console.error(`SQL Error Number: ${error.errno}`);
    }
    if (error.sqlMessage) {
      console.error(`SQL Message: ${error.sqlMessage}`);
    }
    if (error.sqlState) {
      console.error(`SQL State: ${error.sqlState}`);
    }
    
    // Close connection if it was established
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed after error');
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch blog posts', 
        message: error.message,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage,
        sqlState: error.sqlState
      },
      { status: 500 }
    );
  }
} 