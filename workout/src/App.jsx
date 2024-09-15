import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';

import Dashboard from './pages/dashboard';
import GeneratedWorkoutsPage from './pages/workoutsScreen';
import Navbar from './components/navbar';
import Login from './pages/login';
import Signup from './pages/signup';
import Onboarding from './pages/onboarding';
import Profile from './pages/profile';
import GenerateWorkouts from './pages/chat';
import LogWorkout from './pages/logworkout';
import LoggedWorkouts from './pages/loggedWorkouts';
import Notification from './components/notifier';
import { NotificationProvider } from './services/notification';

function App() {
  return (
    <NotificationProvider>
    <Router>
      <Notification />
      <Routes>
        {/* Routes without Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Routes with Navbar */}
        <Route element={<NavbarWrapper />}>
          <Route path="/generated-workouts" element={<GeneratedWorkoutsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/generate-workouts" element={<GenerateWorkouts />} />
          <Route path="/log-workout" element={<LogWorkout />} />
          <Route path="/logged-workouts" element={<LoggedWorkouts />} />
        </Route>
      </Routes>
    </Router>
    </NotificationProvider>
  );
}

// Wrapper component to include Navbar
const NavbarWrapper = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

export default App;