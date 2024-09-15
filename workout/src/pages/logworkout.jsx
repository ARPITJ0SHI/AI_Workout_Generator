import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const LogWorkout = () => {
  const [workoutData, setWorkoutData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0], // Set default date to today
    duration: '',
    difficulty: '',
    exercises: [{ name: '', sets: '', reps: '', weight: '' }],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [generatedWorkouts, setGeneratedWorkouts] = useState([]);

  useEffect(() => {
    fetchGeneratedWorkouts();
  }, []);

  const fetchGeneratedWorkouts = async () => {
    try {
      const response = await axios.get('/api/generated-workouts');
      setGeneratedWorkouts(response.data);
    } catch (err) {
      console.error('Error fetching generated workouts:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWorkoutData({ ...workoutData, [name]: value });
  };

  const handleExerciseChange = (index, e) => {
    const { name, value } = e.target;
    const newExercises = [...workoutData.exercises];
    newExercises[index] = { ...newExercises[index], [name]: value };
    setWorkoutData({ ...workoutData, exercises: newExercises });
  };

  const addExercise = () => {
    setWorkoutData({
      ...workoutData,
      exercises: [...workoutData.exercises, { name: '', sets: '', reps: '', weight: '' }]
    });
  };

  const removeExercise = (index) => {
    const newExercises = workoutData.exercises.filter((_, i) => i !== index);
    setWorkoutData({ ...workoutData, exercises: newExercises });
  };

  const handleGeneratedWorkoutSelect = (e) => {
    const selectedWorkout = generatedWorkouts.find(workout => workout._id === e.target.value);
    if (selectedWorkout) {
      const exercises = parseExercises(selectedWorkout.content);
      setWorkoutData({
        ...workoutData,
        name: selectedWorkout.name,
        duration: selectedWorkout.duration,
        difficulty: selectedWorkout.difficulty,
        exercises: exercises,
        notes: selectedWorkout.content // Set the full workout content as notes
      });
    }
  };

  const parseExercises = (content) => {
    const exerciseRegex = /Exercise:\s*(.*?)\s*Sets:\s*(\d+)\s*Reps:\s*(\d+)\s*Weight:\s*(.*?)(?=\n|$)/gs;
    const exercises = [];
    let match;
    while ((match = exerciseRegex.exec(content)) !== null) {
      exercises.push({
        name: match[1].trim(),
        sets: match[2],
        reps: match[3],
        weight: match[4].trim()
      });
    }
    return exercises.length > 0 ? exercises : [{ name: '', sets: '', reps: '', weight: '' }];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await axios.post('/api/log-workout', workoutData);
      console.log('Workout logged:', response.data);
      setSuccess(true);
      setWorkoutData({
        name: '',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        difficulty: '',
        exercises: [{ name: '', sets: '', reps: '', weight: '' }],
        notes: ''
      });
    } catch (err) {
      console.error('Error logging workout:', err);
      setError('Failed to log workout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Log Workout</h1>
        <form onSubmit={handleSubmit} className="bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="generatedWorkout">
              Select a Generated Workout (Optional)
            </label>
            <select
              id="generatedWorkout"
              onChange={handleGeneratedWorkoutSelect}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">-- Select a workout --</option>
              {generatedWorkouts.map(workout => (
                <option key={workout._id} value={workout._id}>{workout.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="name">
              Workout Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={workoutData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="date">
              Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="date"
              type="date"
              name="date"
              value={workoutData.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="duration">
              Duration (minutes)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="duration"
              type="number"
              name="duration"
              value={workoutData.duration}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="difficulty">
              Difficulty
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="difficulty"
              name="difficulty"
              value={workoutData.difficulty}
              onChange={handleInputChange}
              required
            >
              <option value="">Select difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2">Exercises</label>
            {workoutData.exercises.map((exercise, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-700 rounded">
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                  type="text"
                  name="name"
                  value={exercise.name}
                  onChange={(e) => handleExerciseChange(index, e)}
                  placeholder="Exercise name"
                  required
                />
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                  type="number"
                  name="sets"
                  value={exercise.sets}
                  onChange={(e) => handleExerciseChange(index, e)}
                  placeholder="Sets"
                  required
                />
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                  type="number"
                  name="reps"
                  value={exercise.reps}
                  onChange={(e) => handleExerciseChange(index, e)}
                  placeholder="Reps"
                  required
                />
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                  type="text"
                  name="weight"
                  value={exercise.weight}
                  onChange={(e) => handleExerciseChange(index, e)}
                  placeholder="Weight (e.g., '10 kg' or 'Bodyweight')"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addExercise}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add Exercise
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="notes">
              Notes
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="notes"
              name="notes"
              value={workoutData.notes}
              onChange={handleInputChange}
              rows="3"
            ></textarea>
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging...' : 'Log Workout'}
            </button>
          </div>
        </form>
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        {success && <p className="text-green-500 text-xs italic">Workout logged successfully!</p>}
      </div>
    </div>
  );
};

export default LogWorkout;