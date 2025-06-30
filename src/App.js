//import React from 'react';
//import CreateLicense from './CreateLicense' ;
//
//function App() {
//  return (
//    <div>
//      <CreateLicense />
//    </div>
//    
//  );
//}
//
//export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateLicense from './CreateLicense';
import LicenseList from './LicenseList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateLicense />} />
        <Route path="/licenses" element={<LicenseList />} />
      </Routes>
    </Router>
  );
}

export default App;

