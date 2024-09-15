import React from 'react';

const Step1 = ({ formData, handleInputChange }) => {
  return (
    <div>
      <h3 className="text-2xl mb-4">Basic Info</h3>
      <div className="mb-4">
        <label className="block text-gray-700">Full Name *</label>
        <input
          type="text"
          className="w-full px-4 py-2 border rounded-md"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Age *</label>
        <input
          type="number"
          className="w-full px-4 py-2 border rounded-md"
          value={formData.age}
          onChange={(e) => handleInputChange('age', e.target.value)}
          placeholder="Enter your age"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Gender *</label>
        <select
          className="w-full px-4 py-2 border rounded-md"
          value={formData.gender}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          required
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Height (cm) *</label>
        <input
          type="number"
          className="w-full px-4 py-2 border rounded-md"
          value={formData.height}
          onChange={(e) => handleInputChange('height', e.target.value)}
          placeholder="Enter your height"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Weight (kg) *</label>
        <input
          type="number"
          className="w-full px-4 py-2 border rounded-md"
          value={formData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
          placeholder="Enter your weight"
          required
        />
      </div>
    </div>
  );
};

export default Step1;