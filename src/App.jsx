import React from 'react';
import { Route, Routes } from 'react-router-dom';
import CustomerForm from './components/CustomerForm.jsx';
import CustomerList from './components/ CustomerList.jsx';

const App = () => {
  return (
    // Define the application's routes
    <Routes>
      {/* Route for displaying the customer list */}
      <Route path="/" element={<CustomerList />} />
      {/* Route for adding a new customer */}
      <Route path="/add" element={<CustomerForm />} />
      {/* Route for editing an existing customer */}
      <Route path="/edit/:id" element={<CustomerForm />} />
    </Routes>
  );
};

export default App;
