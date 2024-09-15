import React, { useState } from 'react';
import axios from '../api/axios'; 
import { useNavigate } from 'react-router-dom';
import Step1 from './onboarding/step1';
import Step2 from './onboarding/step2';
import Step3 from './onboarding/step3';
import Step4 from './onboarding/step4';


const Onboarding = () => {
  const navigate = useNavigate(); 
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({

    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    experience: '',
    equipment: [],
    workoutType: '',
    workoutFrequency: '',
   
    healthCondition: '',
    motivation: '',
    reminders: false,
    preferredWorkoutTime: '',
  });

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.name && formData.age && formData.gender && formData.height && formData.weight;
      case 2:
        return formData.goal && formData.experience && formData.workoutType && formData.workoutFrequency;
      case 3:
        return formData.equipment.length > 0 && formData.preferredWorkoutTime;
        case 4:
          return formData.healthCondition === 'none' || (formData.healthCondition && formData.healthCondition !== 'other');
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        const token = localStorage.getItem('token');
        console.log('Token being sent:', token);
        console.log('Sending onboarding data:', formData);
        const response =  await axios.post('/api/auth/onboarding', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Onboarding response:', response.data);
        navigate('/dashboard');
      } catch (error) {
        console.error('Onboarding submission error:', error);
        if (error.response) {
          console.error('Error data:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('Error message:', error.message);
        }
        alert('An error occurred while submitting the onboarding data. Please try again.');
      }
    } else {
      alert('Please fill in all required fields before submitting.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 formData={formData} handleInputChange={handleInputChange} />;
      case 2:
        return <Step2 formData={formData} handleInputChange={handleInputChange} />;
      case 3:
        return <Step3 formData={formData} handleInputChange={handleInputChange} />;
      case 4:
        return <Step4 formData={formData} handleInputChange={handleInputChange} />;
     
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 py-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center mb-6">Onboarding Form</h2>
        {renderStep()}

        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              onClick={prevStep}
              className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition"
            >
              Back
            </button>
          )}
          {currentStep < 4 && (
            <button
              onClick={nextStep}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              Next
            </button>
          )}
          {currentStep === 4 && (
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
