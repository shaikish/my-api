import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import App from './App'; // Import the App component

// Get the root element
const rootElement = document.getElementById('root');

// Create a root and render the App component wrapped in BrowserRouter
const root = createRoot(rootElement);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);