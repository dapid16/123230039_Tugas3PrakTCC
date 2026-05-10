import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css'; // Manggil CSS lama lu dari Tugas 2 biar UI tetep cakep

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);