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
import EditClient from './EditClient';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import NewApiKey from './NewApiKey';
import EditApiKey from './EditApiKey';
import Revoke from './Revoke' ;
import ViewRevoke from './ViewRevoke' ;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreateLicense />} />
        <Route path="/client" element={<Clients />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/client-details/:id" element={<ClientDetails />} />
        <Route path="/client/add" element={<AddClient />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin-users" element={<Admin />} />
        <Route path="/admin-users/edit/:id" element={<AdminEdit />} />
        <Route path="/admin-users/add" element={<AddAdmin />} />
        <Route path="/api-keys" element={<Apikeys />} />
        <Route path="/api-keys/add" element={<AddApikeys />} />
        <Route path="/email-template" element={<Email/>} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/client/:id/edit" element={<EditClient />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/add" element={<AddProduct />} />
        <Route path="/products/edit/:id" element={<EditProduct />} />
        <Route path="/api-keys/add" element={<NewApiKey />} />
        <Route path="/api-keys/edit/:id" element={<EditApiKey />} />
        <Route path="/api-keys/revoke/:id" element={<Revoke />} />
        <Route path="/api-keys/view-revoke/:id" element={<ViewRevoke />} />
      </Routes>
    </Router>
  );
}

export default App;

