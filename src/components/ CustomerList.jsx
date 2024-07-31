import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContextProvider';

const CustomerList = () => {
  // Accessing the customers data and the function to update it from the context
  const { customers, setCustomers } = useContext(UserContext);

  // Function to handle the deletion of a customer
  const handleDelete = (id) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
  };

  return (
    <div className="container mt-5">
      <h2>Customer List</h2>
      {/* Link to navigate to the add customer form */}
      <Link to="/add" className="btn btn-primary mb-3">
        Add Customer
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>PAN</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapping over the customers to display each one in a table row */}
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.PAN}</td>
              <td>{customer.FullName}</td>
              <td>{customer.Email}</td>
              <td>{customer.Mobile}</td>
              <td>
                {/* Link to navigate to the edit form for the specific customer */}
                <Link to={`/edit/${customer.id}`} className="btn btn-warning mr-2">
                  Edit
                </Link>
                {/* Button to delete the customer */}
                <button onClick={() => handleDelete(customer.id)} className="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
