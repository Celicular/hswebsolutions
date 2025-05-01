import { executeQuery } from '../../db';
import { NextResponse } from 'next/server';

// GET /api/admin/users - Get all users
export async function GET() {
  try {
    const users = await executeQuery({
      query: 'SELECT id, userid FROM users ORDER BY id',
    });
    
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { message: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/admin/users - Create a new user
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
    
    // Check if user with this userid already exists
    const existingUsers = await executeQuery({
      query: 'SELECT * FROM users WHERE userid = ?',
      values: [userid],
    });
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'User with this username already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    const result = await executeQuery({
      query: 'INSERT INTO users (userid, password) VALUES (?, ?)',
      values: [userid, password],
    });
    
    return NextResponse.json(
      { 
        message: 'User created successfully',
        userId: result.insertId 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { message: 'Failed to create user' },
      { status: 500 }
    );
  }
} 