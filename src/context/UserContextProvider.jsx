import React, { createContext, useState } from 'react';

// Create a context for user data
export const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  // State to hold customer data
  const [customers, setCustomers] = useState([]);

  return (
    // Provide the context to child components
    <UserContext.Provider value={{ customers, setCustomers }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
