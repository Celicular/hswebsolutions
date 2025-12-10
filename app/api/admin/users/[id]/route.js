import { executeQuery } from '../../../db';
import { NextResponse } from 'next/server';

// PUT /api/admin/users/[id] - Update a user
export async function PUT(request, { params: paramsPromise }) {
  try {
    const { id } = await paramsPromise;
    const { userid, password } = await request.json();
    
    // Input validation
    if (!userid) {
      return NextResponse.json(
        { message: 'Username is required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const users = await executeQuery({
      query: 'SELECT * FROM users WHERE id = ?',
      values: [id],
    });
    
    if (users.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Check if the username is already taken by another user
    const existingUsers = await executeQuery({
      query: 'SELECT * FROM users WHERE userid = ? AND id != ?',
      values: [userid, id],
    });
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'Username is already taken' },
        { status: 409 }
      );
    }
    
    // Update the user
    if (password) {
      // If password is provided, update both username and password
      await executeQuery({
        query: 'UPDATE users SET userid = ?, password = ? WHERE id = ?',
        values: [userid, password, id],
      });
    } else {
      // Otherwise, update only the username
      await executeQuery({
        query: 'UPDATE users SET userid = ? WHERE id = ?',
        values: [userid, id],
      });
    }
    
    return NextResponse.json(
      { message: 'User updated successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { message: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete a user
export async function DELETE(request, { params: paramsPromise }) {
  try {
    const { id } = await paramsPromise;
    
    // Check if user exists
    const users = await executeQuery({
      query: 'SELECT * FROM users WHERE id = ?',
      values: [id],
    });
    
    if (users.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Delete the user
    await executeQuery({
      query: 'DELETE FROM users WHERE id = ?',
      values: [id],
    });
    
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { message: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 