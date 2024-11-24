import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from './components/FrontPage';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ClubsPage from './components/ClubsPage';   // Make sure to import the ClubsPage component
import EventsPage from './components/EventsPage'; // Make sure to import the EventsPage component
import ResourcesPage from './components/ResourcesPage'; // Make sure to import the ResourcesPage component
import DeleteAccountPage from './components/DeleteAccountPage'; // Import the DeleteAccountPage
import LogoutPage from './components/LogoutPage'; // Import the LogoutPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} /> {/* FrontPage on home route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* New routes for Clubs, Events, Resources, Account Deletion, and Logout */}
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/delete-account" element={<DeleteAccountPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
