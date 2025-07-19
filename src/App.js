import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateLicense from './CreateLicense';
import Clients from './Clients';
import Dashboard from './Dashboard';
import ClientDetails from './ClientDetails';
import AddClient from './AddClient';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreateLicense />} />
        <Route path="/client" element={<Clients />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/client-details/:id" element={<ClientDetails />} />
         <Route path="/client/add" element={<AddClient />} />
      </Routes>
    </Router>
  );
}

export default App;

