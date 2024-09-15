import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'border-black text-black' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/dashboard" className="text-2xl font-bold text-gray-800">FitnessBro</Link>
          </div>
          <div className="hidden sm:flex sm:space-x-8 flex-grow justify-center">
            <Link 
              to="/dashboard" 
              className={`${isActive('/dashboard')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Dashboard
            </Link>
            <Link 
              to="/generated-workouts" 
              className={`${isActive('/generated-workouts')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Generated Workouts
            </Link>
            <Link 
              to="/generate-workouts" 
              className={`${isActive('/generate-workouts')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Generate Workout
            </Link>
            <Link 
              to="/log-workout" 
              className={`${isActive('/log-workout')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Log Workout
            </Link>
            <Link 
              to="/profile" 
              className={`${isActive('/profile')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Profile
            </Link>
            <Link 
              to="/logged-workouts" 
              className={`${isActive('/logged-workouts')} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
            >
              Logged Workouts
            </Link>
          </div>
          
          <div className="hidden sm:flex sm:items-center">
            <button
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;