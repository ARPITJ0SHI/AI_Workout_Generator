import React from 'react';

const Step2 = ({ formData, handleInputChange }) => {
  return (
    <div>
      <h3 className="text-2xl mb-4">Fitness Goals & Experience</h3>
      <div className="mb-4">
        <label className="block text-gray-700">Primary Fitness Goal *</label>
        <select
          className="w-full px-4 py-2 border rounded-md"
          value={formData.goal}
          onChange={(e) => handleInputChange('goal', e.target.value)}
          required
        >
          <option value="">Select a goal</option>
          <option value="weight_loss">Weight Loss</option>
          <option value="muscle_gain">Muscle Gain</option>
          <option value="general_fitness">General Fitness</option>
          <option value="endurance">Endurance</option>
          <option value="flexibility">Flexibility</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Fitness Level *</label>
        <select
          className="w-full px-4 py-2 border rounded-md"
          value={formData.experience}
          onChange={(e) => handleInputChange('experience', e.target.value)}
          required
        >
          <option value="">Select your experience</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Preferred Workout Type *</label>
        <select
          className="w-full px-4 py-2 border rounded-md"
          value={formData.workoutType}
          onChange={(e) => handleInputChange('workoutType', e.target.value)}
          required
        >
          <option value="">Select workout type</option>
          <option value="strength_training">Strength Training</option>
          <option value="cardio">Cardio</option>
          <option value="hiit">HIIT</option>
          <option value="yoga">Yoga</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Workout Frequency *</label>
        <select
          className="w-full px-4 py-2 border rounded-md"
          value={formData.workoutFrequency}
          onChange={(e) => handleInputChange('workoutFrequency', e.target.value)}
          required
        >
          <option value="">Select frequency</option>
          <option value="1-2">1-2 times per week</option>
          <option value="3-4">3-4 times per week</option>
          <option value="5+">5+ times per week</option>
        </select>
      </div>
    </div>
  );
};

export default Step2;