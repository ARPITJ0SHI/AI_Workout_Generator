import React, { useState } from 'react';
import axios from '../api/axios';
import { ClipLoader } from 'react-spinners';

const GenerateWorkouts = () => {
    const [prompt, setPrompt] = useState('');
    const [generatedWorkout, setGeneratedWorkout] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setGeneratedWorkout(null);
        setSaveSuccess(false);
    
        try {
          const response = await axios.post('/api/generate-workout', { prompt });
          console.log('Received workout data:', response.data);
          setGeneratedWorkout(response.data.workout);
        } catch (err) {
          console.error('Error generating workout:', err);
          setError('Failed to generate workout. Please try again.');
        } finally {
          setLoading(false);
        }
    };

    const handleSaveWorkout = async () => {
        try {
         
          const determineDifficulty = (content) => {
            const lowerContent = content.toLowerCase();
            if (lowerContent.includes('beginner')) return 'Beginner';
            if (lowerContent.includes('intermediate')) return 'Intermediate';
            if (lowerContent.includes('advanced')) return 'Advanced';
            return 'Unknown';
          };
      
      
          const extractDuration = (content) => {
            const durationMatch = content.match(/Duration:\s*(\d+(?:\s*-\s*\d+)?\s*(?:minutes|mins))/i);
            return durationMatch ? durationMatch[1] : 'Unknown';
          };
      
          const workoutToSave = {
            name: "Generated Workout",
            content: generatedWorkout,
            duration: extractDuration(generatedWorkout),
            difficulty: determineDifficulty(generatedWorkout)
          };
          console.log("Sending workout data:", workoutToSave);
          const response = await axios.post('/api/save-workout', workoutToSave);
          console.log('Workout saved:', response.data);
          setSaveSuccess(true);
        } catch (error) {
          console.error('Error saving workout:', error);
          if (error.response) {
            console.error('Error response:', error.response.data);
          }
          setError('Failed to save workout. Please try again.');
        }
      };
    
    const renderWorkout = () => {
        if (!generatedWorkout) return null;
      
        const workoutSections = generatedWorkout.split(/\n+/).map(section => section.trim());
      
        return (
          <div className="bg-gray-700 rounded-lg p-4 shadow-inner mb-4">
            {workoutSections.map((section, index) => {
             
              section = section.replace(/\*/g, '');

              if (section.toLowerCase().includes("duration") || section.toLowerCase().includes("difficulty")) {
                const [label, value] = section.split(':').map(s => s.trim());
                return (
                  <p key={index} className="text-gray-400 mb-2">
                    <strong>{label}:</strong> {value}
                  </p>
                );
              } else if (section.toLowerCase().includes("workout name")) {
                return (
                  <h3 key={index} className="text-2xl font-bold text-indigo-300 mb-4">
                    {section.split(':')[1].trim()}
                  </h3>
                );
              } else if (section.toLowerCase().includes("round") || section.toLowerCase().includes("warm-up") || section.toLowerCase().includes("cool-down")) {
                return (
                  <h4 key={index} className="text-lg font-semibold text-indigo-300 mt-4 mb-2">
                    {section}
                  </h4>
                );
              } else if (section.includes(":")) {
                const [exercise, details] = section.split(':').map(s => s.trim());
                return (
                  <div key={index} className="text-gray-300 mb-2">
                    <strong>{exercise}:</strong> {details}
                  </div>
                );
              } else if (section.trim()) {
                return (
                  <p key={index} className="text-gray-400 mb-2">
                    {section}
                  </p>
                );
              }
              return null;
            })}
          </div>
        );
    };


    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-100">
                    AI Workout Generator
                </h1>
                
                <div className="bg-gray-800 shadow-lg rounded-xl overflow-hidden">
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="mb-4">
                            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                                Describe your desired workout
                            </label>
                            <textarea
                                id="prompt"
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-100"
                                rows="4"
                                placeholder="E.g., I want a 30-minute HIIT workout focusing on core strength"
                                required
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                            disabled={loading}
                        >
                            {loading ? 'Generating...' : 'Generate Workout'}
                        </button>
                    </form>

                    {loading && (
                        <div className="flex justify-center items-center p-6">
                            <ClipLoader color="#818CF8" loading={loading} size={50} />
                        </div>
                    )}

                    {error && (
                        <div className="p-6 bg-red-900 border-l-4 border-red-500">
                            <p className="text-red-200">{error}</p>
                        </div>
                    )}

                    {generatedWorkout && (
                        <div className="p-6 bg-gray-750 border-t border-gray-700">
                            <h3 className="text-xl font-semibold text-gray-100 mb-4">Your Personalized Workout</h3>
                            {renderWorkout()}
                            <button
                                onClick={handleSaveWorkout}
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                            >
                                Save Workout
                            </button>
                            {saveSuccess && (
                                <p className="mt-2 text-green-400 text-center">Workout saved successfully!</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateWorkouts;