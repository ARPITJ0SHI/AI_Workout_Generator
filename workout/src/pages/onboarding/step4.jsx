import React, { useState, useEffect } from 'react';

const Step4 = ({ formData, handleInputChange }) => {
  const [showHealthConditionInput, setShowHealthConditionInput] = useState(false);

  useEffect(() => {
    setShowHealthConditionInput(formData.healthCondition !== 'none');
  }, [formData.healthCondition]);

  const handleHealthConditionChange = (e) => {
    const value = e.target.value;
    handleInputChange('healthCondition', value);
    setShowHealthConditionInput(value !== 'none');
  };

  return (
    <div>
      <h3 className="text-2xl mb-4">Health & Motivation</h3>
      <div className="mb-4">
        <label className="block text-gray-700">Health Condition *</label>
        <select
          className="w-full px-4 py-2 border rounded-md mb-2"
          value={formData.healthCondition === 'none' ? 'none' : ''}
          onChange={handleHealthConditionChange}
          required
        >
          <option value="none">No health problems</option>
          <option value="">I have a health condition</option>
        </select>
        {showHealthConditionInput && (
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={formData.healthCondition === 'none' ? '' : formData.healthCondition}
            onChange={(e) => handleInputChange('healthCondition', e.target.value)}
            placeholder="Describe your health condition"
            required
          />
        )}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Workout Reminders</label>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={formData.reminders}
            onChange={() => handleInputChange('reminders', !formData.reminders)}
          />
          <span className="ml-2">Receive Workout Reminders</span>
        </label>
      </div>
    </div>
  );
};

export default Step4;