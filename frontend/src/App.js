import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FrontPage from './components/FrontPage';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import ForgotPassword from './components/ForgotPassword';
import ClubsPage from './components/ClubsPage';
import CreateClub from './components/CreateClub';
import EventsPage from './components/EventsPage';
import CreateEvent from './components/CreateEvent';
import EventDetails from './components/EventDetails';
import ResourcesPage from './components/ResourcesPage';
import DeleteAccountPage from './components/DeleteAccountPage';
import LogoutPage from './components/LogoutPage';
import ClubDetailsPage from './components/ClubDetailsPage';  // Import ClubDetailsPage

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/clubs" element={<ClubsPage />} />
        {/* Use the correct element prop to pass ClubDetailsPage */}
        <Route path="/clubs/:clubId" element={<ClubDetailsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/create-club" element={<CreateClub />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/delete-account" element={<DeleteAccountPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
