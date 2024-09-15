import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useNotification } from '../services/notification';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, isNewUser } = response.data;
      localStorage.setItem('token', token);
      
      console.log('Login response:', response.data); // Add this line for debugging
      
      if (isNewUser) {
       
        navigate('/onboarding');
      } else {
        addNotification('Login successful! Welcome back.', 'success');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        const errorMessage = error.response.data.message || 'An error occurred during login';
        setError(errorMessage);
        addNotification(errorMessage, 'error');
      } else if (error.request) {
        console.error('Error request:', error.request);
        const errorMessage = 'No response received from the server';
        setError(errorMessage);
        addNotification(errorMessage, 'error');
      } else {
        console.error('Error message:', error.message);
        const errorMessage = 'An error occurred while setting up the request';
        setError(errorMessage);
        addNotification(errorMessage, 'error');
      }
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url('/src/assets/background.jpg')` }}
    >
      <div className="bg-white shadow-md rounded-lg px-8 py-8 w-full max-w-md backdrop-blur-md bg-opacity-80">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome to FitnessBro</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;