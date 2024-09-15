import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import Sidebar from '../components/sidebar';
import Slider from "react-slick";
import { useSpring, animated } from 'react-spring';
import { useNotification } from '../services/notification';


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


import workout1 from '../assets/workout1.jpg';
import workout2 from '../assets/workout2.jpg';
import workout3 from '../assets/workout3.jpg';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loggedWorkouts, setLoggedWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [streak, setStreak] = useState(0);
  const { addNotification } = useNotification();
  

  useEffect(() => {
    fetchUserData();
    fetchLoggedWorkouts();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setUser(response.data);
     
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to fetch user data');addNotification('Failed to fetch user data', 'error');
    }
  };

  const fetchLoggedWorkouts = async () => {
    try {
      const response = await axios.get('/api/logged-workouts?limit=5');
      setLoggedWorkouts(response.data);
      const calculatedStreak = calculateStreak(response.data);
      setStreak(calculatedStreak);
      
      if (calculatedStreak > 0) {
       
        
      }
    } catch (err) {
      console.error('Error fetching logged workouts:', err);
      setError('Failed to fetch logged workouts');
      addNotification('Failed to fetch logged workouts', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStreak = (workouts) => {
    if (!workouts.length) return 0;

 
    const sortedWorkouts = workouts.sort((a, b) => new Date(b.date) - new Date(a.date));

    let streak = 1;
    let currentDate = new Date(sortedWorkouts[0].date);
    currentDate.setHours(0, 0, 0, 0); 

    for (let i = 1; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].date);
      workoutDate.setHours(0, 0, 0, 0); 

      const diffDays = (currentDate - workoutDate) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak++;
        currentDate = workoutDate;
      } else if (diffDays > 1) {
        break; 
      }
    }

    return streak;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };

  const heroSlides = [
    { image: workout1, title: 'Generate Your Workout', description: 'Create a personalized workout plan', path: '/generate-workouts' },
    { image: workout2, title: 'Log Your Progress', description: 'Keep track of your fitness journey', path: '/log-workout' },
    { image: workout3, title: 'View Your History', description: 'See how far you have come', path: '/logged-workouts' },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  
  const { number } = useSpring({
    from: { number: 0 },
    number: streak,
    delay: 200,
    config: { mass: 1, tension: 20, friction: 10 },
  });


  const flameProps = useSpring({
    from: { transform: 'scale(1)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'scale(1.1)' });
        await next({ transform: 'scale(1)' });
      }
    },
    config: { duration: 1000 },
  });

  if (loading) {
    return <div className="text-center text-2xl mt-10 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 text-2xl mt-10">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800 shadow-md z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <button 
              onClick={toggleSidebar} 
              className="text-gray-300 hover:text-white focus:outline-none lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-white">{getGreeting()}</h1>
              <p className="text-sm text-gray-400">Welcome Back, {user?.name}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
            <div className="mb-8">
              <Slider {...sliderSettings}>
                {heroSlides.map((slide, index) => (
                  <div key={index} className="relative">
                    <Link to={slide.path}>
                      <img src={slide.image} alt={slide.title} className="w-full h-96 object-cover rounded-lg" />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center">
                        <h2 className="text-4xl font-bold text-white mb-2">{slide.title}</h2>
                        <p className="text-xl text-gray-200">{slide.description}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </Slider>
            </div>

           
            <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Last Logged Workouts</h2>
              {loggedWorkouts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loggedWorkouts.map((workout) => (
                    <div key={workout._id} className="bg-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-white">{workout.name}</h3>
                      <p className="mt-1 text-sm text-gray-300">Date: {new Date(workout.date).toLocaleDateString()}</p>
                      <p className="mt-1 text-sm text-gray-300">Duration: {workout.duration} minutes</p>
                      <p className="mt-1 text-sm text-gray-300">Difficulty: {workout.difficulty}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">No logged workouts found.</p>
              )}
            </div>

            <div className="bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-white">Your Workout Streak</h2>
            <div className="flex items-center justify-center">
              <animated.div style={flameProps} className="mr-4">
                <svg className="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
              </animated.div>
              <div className="text-center">
                <animated.span className="text-5xl font-bold text-blue-500">
                  {number.to(n => n.toFixed(0))}
                </animated.span>
                <p className="text-xl text-gray-300">Days</p>
              </div>
            </div>
            <p className="text-center mt-4 text-gray-400">
              {streak > 0 
                ? "Keep it up! Your consistency is paying off." 
                : "Start your streak today! Log a workout to begin."}
            </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;