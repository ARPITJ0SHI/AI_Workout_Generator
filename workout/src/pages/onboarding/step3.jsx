import React from 'react';

const Step3 = ({ formData, handleInputChange }) => {
  const equipmentOptions = ['Dumbbells', 'Barbell', 'Resistance Bands', 'Treadmill', 'Exercise Bike', 'Pull-up Bar', 'Kettlebells', 'None'];

  const toggleEquipment = (item) => {
    const newEquipment = formData.equipment.includes(item)
      ? formData.equipment.filter((equip) => equip !== item)
      : [...formData.equipment, item];
    handleInputChange('equipment', newEquipment);
  };

  return (
    <div>
      <h3 className="text-2xl mb-4">Available Equipment & Preferences</h3>
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Available Equipment *</label>
        <div className="grid grid-cols-2 gap-4">
          {equipmentOptions.map((option) => (
            <div key={option}>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={formData.equipment.includes(option)}
                  onChange={() => toggleEquipment(option)}
                  required={formData.equipment.length === 0}
                />
                <span className="ml-2">{option}</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Preferred Workout Time *</label>
        <select
          className="w-full px-4 py-2 border rounded-md"
          value={formData.preferredWorkoutTime}
          onChange={(e) => handleInputChange('preferredWorkoutTime', e.target.value)}
          required
        >
          <option value="">Select preferred time</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>
      </div>
    </div>
  );
};

export default Step3;