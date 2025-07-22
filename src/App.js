import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateLicense from './CreateLicense';
import Clients from './Clients';
import Dashboard from './Dashboard';
import ClientDetails from './ClientDetails';
import AddClient from './AddClient';
import Reports from './Reports';
import Apikeys from './Apikeys';
import Email from './Email';
import Logs from './Logs';
import Admin from './Admin';
import AdminEdit from './AdminEdit';
import AddAdmin from './AddAdmin';
import AddApikeys from './AddApikeys';
import Product from './Product';
import ProductEdit from './ProductEdit';
import AddProduct from './AddProduct';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreateLicense />} />
        <Route path="/client" element={<Clients />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/client-details/:id" element={<ClientDetails />} />
        <Route path="/client/add" element={<AddClient />} />
        <Route path="/products" element={<Product />} />
        <Route path="/products/edit/:id" element={<ProductEdit />} />
        <Route path="/products/add" element={<AddProduct />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin-users" element={<Admin />} />
        <Route path="/admin-users/edit/:id" element={<AdminEdit />} />
        <Route path="/admin-users/add" element={<AddAdmin />} />
        <Route path="/api-keys" element={<Apikeys />} />
        <Route path="/api-keys/add" element={<AddApikeys />} />
        <Route path="/email-template" element={<Email/>} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </Router>
  );
}

export default App;

