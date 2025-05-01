import { NextResponse } from 'next/server';
import { executeQuery } from '../../db.js';

// Fetch all estimate submissions (paginated, with filtering)
export async function GET(request) {
  try {
    console.log('API: Fetching estimate submissions');
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = (page - 1) * limit;
    
    // Get filter parameters with proper formatting
    let startDate = searchParams.get('startDate') || null;
    let endDate = searchParams.get('endDate') || null;
    const status = searchParams.get('status') || null;
    const search = searchParams.get('search') || null;
    
    // Format dates properly for MySQL if they exist
    if (startDate) {
      // Ensure date is in YYYY-MM-DD format
      startDate = new Date(startDate).toISOString().split('T')[0];
    }
    
    if (endDate) {
      // Ensure date is in YYYY-MM-DD format
      endDate = new Date(endDate).toISOString().split('T')[0];
    }
    
    console.log('API: Filter params:', { page, limit, startDate, endDate, status, search });
    
    try {
      // Start with the base count query
      let countQuery = 'SELECT COUNT(*) as total FROM estimate_submissions';
      let countParams = [];
      
      // Start with the base submissions query
      let dataQuery = `
        SELECT id, name, business_name, email, phone, submitted_at, status 
        FROM estimate_submissions
      `;
      
      // Conditions for both queries
      let whereConditions = [];
      let queryParams = [];
      
      // Build WHERE conditions
      if (startDate) {
        whereConditions.push('DATE(submitted_at) >= ?');
        queryParams.push(startDate);
      }
      
      if (endDate) {
        whereConditions.push('DATE(submitted_at) <= ?');
        queryParams.push(endDate);
      }
      
      if (status) {
        whereConditions.push('status = ?');
        queryParams.push(status);
      }
      
      if (search) {
        whereConditions.push('(name LIKE ? OR email LIKE ? OR business_name LIKE ?)');
        const searchTerm = `%${search}%`;
        queryParams.push(searchTerm, searchTerm, searchTerm);
      }
      
      // Append WHERE clause if we have conditions
      if (whereConditions.length > 0) {
        const whereClause = ' WHERE ' + whereConditions.join(' AND ');
        countQuery += whereClause;
        dataQuery += whereClause;
        countParams = [...queryParams];
      }
      
      // Add sorting and pagination to data query
      dataQuery += ' ORDER BY submitted_at DESC LIMIT ? OFFSET ?';
      
      // Alternative approach: hardcode the LIMIT and OFFSET values in the query for more reliability
      // This avoids parameter binding issues for these specific values
      // dataQuery += ` ORDER BY submitted_at DESC LIMIT ${limitInt} OFFSET ${offsetInt}`;
      
      // Log the queries and parameters
      console.log('API: Count query:', countQuery);
      console.log('API: Count params:', countParams);
      
      // Execute the count query
      const countResult = await executeQuery({
        query: countQuery,
        values: countParams
      });
      
      const total = countResult && countResult[0] ? countResult[0].total : 0;
      console.log('API: Total submissions count:', total);
      
      // If there are no submissions, return empty data
      if (total === 0) {
        return NextResponse.json({ 
          success: true,
          data: [],
          pagination: { total: 0, page, limit, totalPages: 0 }
        });
      }
      
      // Add pagination parameters - ensure these are numbers
      // MySQL prepared statements require integers for LIMIT/OFFSET
      // Make sure they are actual integers, not string numbers or floating points
      const limitInt = parseInt(limit, 10);
      const offsetInt = parseInt(offset, 10);
      queryParams.push(limitInt, offsetInt);
      
      console.log('API: Data query:', dataQuery);
      console.log('API: Query params:', queryParams);
      
      // Execute the data query
      const submissions = await executeQuery({
        query: dataQuery,
        values: queryParams
      });
      
      console.log(`API: Successfully fetched ${submissions.length} submissions`);
      
      return NextResponse.json({ 
        success: true,
        data: submissions || [],
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
      
    } catch (dbError) {
      console.error('API: Database error:', dbError);
      
      // Check if table doesn't exist
      if (dbError.code === 'ER_NO_SUCH_TABLE') {
        return NextResponse.json({ 
          success: false,
          message: 'Database table not found. Please run the setup script.',
          data: [],
          pagination: { total: 0, page, limit, totalPages: 0 }
        });
      }
      
      throw dbError;
    }
    
  } catch (error) {
    console.error('API: Error fetching estimate submissions:', error);
    console.error('API: Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      stack: error.stack
    });
    
    // Return a more informative error for debugging
    return NextResponse.json(
      { 
        success: false,
        message: 'Failed to fetch estimate submissions',
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          code: error.code,
          sqlMessage: error.sqlMessage
        } : 'Internal server error'
      },
      { status: 500 }
    );
  }
} 