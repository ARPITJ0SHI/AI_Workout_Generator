import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const LoggedWorkouts = () => {
  const [loggedWorkouts, setLoggedWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedWorkout, setExpandedWorkout] = useState(null);

  useEffect(() => {
    fetchLoggedWorkouts();
  }, []);

  const fetchLoggedWorkouts = async () => {
    try {
      const response = await axios.get('/api/logged-workouts');
      setLoggedWorkouts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching logged workouts:', err);
      setError('Failed to fetch logged workouts. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleWorkoutDetails = (workoutId) => {
    setExpandedWorkout(expandedWorkout === workoutId ? null : workoutId);
  };

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Logged Workouts</h1>
        {loggedWorkouts.length === 0 ? (
          <p className="text-center">No workouts logged yet.</p>
        ) : (
          loggedWorkouts.map((workout) => (
            <div key={workout._id} className="bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-2">{workout.name}</h2>
              <p className="text-gray-400 mb-2">Date: {formatDate(workout.date)}</p>
              <p className="text-gray-400 mb-2">Duration: {workout.duration} minutes</p>
              <p className="text-gray-400 mb-2">Difficulty: {workout.difficulty}</p>
              <button
                onClick={() => toggleWorkoutDetails(workout._id)}
                className="text-indigo-400 hover:text-indigo-300 focus:outline-none"
              >
                {expandedWorkout === workout._id ? 'Hide Details' : 'Show Details'}
              </button>
              {expandedWorkout === workout._id && (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-2">Exercises:</h3>
                  <ul className="list-disc list-inside">
                    {workout.exercises.map((exercise, index) => (
                      <li key={index} className="mb-2">
                        <span className="font-medium">{exercise.name}</span> - {exercise.sets} sets,{' '}
                        {exercise.reps} reps, {exercise.weight}
                      </li>
                    ))}
                  </ul>
                  {workout.notes && (
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold mb-2">Notes:</h3>
                      <p className="text-gray-400">{workout.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoggedWorkouts;