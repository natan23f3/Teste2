import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MarketingPage from './pages/MarketingPage';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import FamilyDashboard from './pages/FamilyDashboard';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/enterprise" element={<EnterpriseDashboard />} />
        <Route path="/family" element={<FamilyDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;