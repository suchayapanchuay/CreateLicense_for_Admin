import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateLicense from './CreateLicense';
import Clients from './Clients';
import Dashboard from './Dashboard';
import ClientDetails from './ClientDetails';
import AddClient from './AddClient';
import EditClient from './EditClient';
import Product from './Product';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreateLicense />} />
        <Route path="/client" element={<Clients />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/client-details/:id" element={<ClientDetails />} />
        <Route path="/client/add" element={<AddClient />} />
        <Route path="/client/:id/edit" element={<EditClient />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/add" element={<AddProduct />} />
        <Route path="/product/:id/edit" element={<EditProduct />} />
      </Routes>
    </Router>
  );
}

export default App;

