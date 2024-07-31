import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import UserContextProvider from './context/UserContextProvider';
import 'bootstrap/dist/css/bootstrap.min.css';

// Setting up the root of the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main app within the context providers and router
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
