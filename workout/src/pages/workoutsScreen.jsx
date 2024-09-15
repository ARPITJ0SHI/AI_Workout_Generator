import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';

const formatContent = (content) => {
  let formattedContent = '';
  const days = content.split(/\n(?=Monday|Wednesday|Friday|Sunday)/);

  days.forEach(day => {
    const [dayName, ...activities] = day.split('\n');
    formattedContent += `<div class="workout-day">
      <h2>${dayName}</h2>
      <ul>`;

    activities.forEach(activity => {
      activity = activity.replace(/^\*\s*/, '').replace(/\*\*/g, '');
      if (activity.includes('Warm-up:') || activity.includes('Workout:') || activity.includes('Cool-down:') || activity.includes('Active Recovery:')) {
        formattedContent += `</ul><h3>${activity.trim()}</h3><ul>`;
      } else {
        formattedContent += `<li>${activity.trim()}</li>`;
      }
    });

    formattedContent += `</ul></div>`;
  });

  return formattedContent;
};

const workoutContentStyles = `
  .workout-content {
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    color: #e0e0e0;
    max-height: 200px;
    overflow: hidden;
    transition: max-height 0.3s ease-out;
  }

  .workout-content.expanded {
    max-height: none;
  }

  .workout-day {
    margin-bottom: 20px;
  }

  .workout-content h2 {
    font-size: 20px;
    color: #81a1c1;
    border-bottom: 2px solid #4c566a;
    padding-bottom: 5px;
    margin-top: 0;
    margin-bottom: 10px;
  }

  .workout-content h3 {
    font-size: 16px;
    color: #88c0d0;
    margin-top: 10px;
    margin-bottom: 5px;
  }

  .workout-content ul {
    list-style-type: none;
    padding-left: 0;
  }

  .workout-content li {
    margin-bottom: 5px;
    font-size: 14px;
  }

  .expand-button {
    background-color: #5e81ac;
    color: #eceff4;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    margin-top: 10px;
    transition: background-color 0.2s;
  }

  .expand-button:hover {
    background-color: #81a1c1;
  }
`;

const GeneratedWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedWorkout, setExpandedWorkout] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get('/api/saved-workouts');
        setWorkouts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Failed to load workouts. Please try again.');
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-300">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg transition duration-300 ease-in-out hover:shadow-xl">
      <style>{workoutContentStyles}</style>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-100">Saved Workouts</h2>
        <Link to="/generate-workouts" className="text-indigo-400 hover:text-indigo-300 font-medium">Generate New</Link>
      </div>
      <div className="space-y-4">
        {workouts.map((workout, index) => (
          <div key={workout._id} className="border border-gray-700 p-4 rounded-lg hover:bg-gray-800 transition duration-300">
            <h3 className="font-medium text-lg text-gray-100 mb-1">Workout {index + 1}</h3>
            {workout.name && (
              <p className="text-sm text-gray-400 mb-2">{workout.name}</p>
            )}
            <div className="flex justify-between text-sm text-gray-400">
              <p>Duration: {workout.duration}</p>
              <p>Difficulty: {workout.difficulty}</p>
            </div>
            <button 
              className="mt-2 text-indigo-400 hover:text-indigo-300"
              onClick={() => setExpandedWorkout(expandedWorkout === workout._id ? null : workout._id)}
            >
              {expandedWorkout === workout._id ? 'Hide Details' : 'View Details'}
            </button>
            {expandedWorkout === workout._id && (
              <div className="mt-4">
                <div className={`workout-content expanded`}>
                  <div dangerouslySetInnerHTML={{ __html: formatContent(workout.content) }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedWorkouts;