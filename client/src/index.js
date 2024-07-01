import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './components-app/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
const env = window.location.hostname.includes('localhost') ? 'dev' : 'production'
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
