
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
} catch (error) {
    console.error('CRITICAL INITIALIZATION ERROR:', error);
}
