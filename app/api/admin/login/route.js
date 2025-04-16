import { executeQuery } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userid, password } = await request.json();
    
    // Input validation
    if (!userid || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Query the database
    const users = await executeQuery({
      query: 'SELECT * FROM users WHERE userid = ? LIMIT 1',
      values: [userid],
    });
    
    // Check if user exists and password matches
    if (users.length === 0 || users[0].password !== password) {
      return NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Success response
    return NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 