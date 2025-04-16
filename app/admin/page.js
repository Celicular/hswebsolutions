'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './admin.module.css';

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ userid: '', password: '' });
  
  useEffect(() => {
    // Check if user is logged in, if not redirect to login page
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      router.push('/admin/login');
      return;
    }
    
    // Fetch users data
    fetchUsers();
  }, [router]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.users);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('An error occurred while fetching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/admin/login');
  };
  
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setFormData({ userid: '', password: '' });
        fetchUsers();
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    }
  };
  
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setEditingUser(null);
        setFormData({ userid: '', password: '' });
        fetchUsers();
      } else {
        setError(data.message || 'Failed to update user');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    }
  };
  
  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        fetchUsers();
      } else {
        setError(data.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('An error occurred');
      console.error(err);
    }
  };
  
  const startEditing = (user) => {
    setEditingUser(user);
    setFormData({ userid: user.userid, password: '' });
  };
  
  const cancelEditing = () => {
    setEditingUser(null);
    setFormData({ userid: '', password: '' });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      <div className={styles.section}>
        <h2>Manage Users</h2>
        
        <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className={styles.form}>
          <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
          <div className={styles.formFields}>
            <div className={styles.formGroup}>
              <label htmlFor="userid">Username</label>
              <input
                type="text"
                id="userid"
                name="userid"
                value={formData.userid}
                onChange={handleChange}
                required
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password">Password {editingUser && '(leave blank to keep current)'}</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!editingUser}
                className={styles.input}
              />
            </div>
          </div>
          
          <div className={styles.formActions}>
            <button type="submit" className={styles.button}>
              {editingUser ? 'Update User' : 'Add User'}
            </button>
            
            {editingUser && (
              <button 
                type="button" 
                onClick={cancelEditing} 
                className={`${styles.button} ${styles.cancelButton}`}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        
        <div className={styles.tableContainer}>
          <h3>Users List</h3>
          {loading ? (
            <p>Loading users...</p>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.userid}</td>
                    <td className={styles.actions}>
                      <button 
                        onClick={() => startEditing(user)} 
                        className={`${styles.actionButton} ${styles.editButton}`}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id)} 
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 