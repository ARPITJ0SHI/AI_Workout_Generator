import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/user/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-300">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-400">{error}</div>;
  if (!userData) return <div className="flex justify-center items-center h-screen text-gray-300">No user data found</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <div className="bg-indigo-600 text-white p-4">
            <h2 className="text-2xl font-bold">User Profile</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProfileField label="Name" value={userData.name} />
              <ProfileField label="Email" value={userData.email} />
              <ProfileField label="Age" value={`${userData.age} years`} />
              <ProfileField label="Gender" value={userData.gender} />
              <ProfileField label="Height" value={`${userData.height} cm`} />
              <ProfileField label="Weight" value={`${userData.weight} kg`} />
              <ProfileField label="Fitness Goal" value={userData.goal} />
              <ProfileField label="Experience Level" value={userData.experience} />
              <ProfileField label="Workout Type" value={userData.workoutType} />
              <ProfileField label="Workout Frequency" value={userData.workoutFrequency} />
              <ProfileField label="Health Condition" value={userData.healthCondition || 'None'} />
              <ProfileField label="Preferred Workout Time" value={userData.preferredWorkoutTime} />
              <ProfileField label="Available Equipment" value={userData.equipment.join(', ')} />
              <ProfileField label="Reminders" value={userData.reminders ? 'Enabled' : 'Disabled'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, value }) => (
  <div className="mb-4">
    <h3 className="text-sm font-semibold text-gray-400">{label}</h3>
    <p className="text-lg text-gray-200">{value}</p>
  </div>
);

export default Profile;