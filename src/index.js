import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create root element for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Optional: Add global error handling for production
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
  
  // You can add error reporting service here
  // Example: Sentry, LogRocket, or custom analytics
  if (process.env.NODE_ENV === 'production') {
    // Report to error tracking service
    // errorReportingService.captureException(event.error);
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  if (process.env.NODE_ENV === 'production') {
    // Report to error tracking service
    // errorReportingService.captureException(event.reason);
  }
});

// Optional: Service Worker registration for PWA features
// Uncomment the code below if you want to enable service worker
/*
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
*/

// Optional: Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'navigation') {
      console.log('Page load time:', entry.loadEventEnd - entry.loadEventStart, 'ms');
    }
  }
});

if (typeof PerformanceObserver !== 'undefined') {
  performanceObserver.observe({ entryTypes: ['navigation'] });
}

// Development helpers
if (process.env.NODE_ENV === 'development') {
  // Enable React DevTools profiler in development
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ && window.__REACT_DEVTOOLS_GLOBAL_HOOK__.settings && 
  Object.assign(window.__REACT_DEVTOOLS_GLOBAL_HOOK__.settings, {
    profilerEnabled: true,
  });
  
  // Add development console messages
  console.log(
    '%c🛡️ CyberSentinel - URL Threat Analyzer %c\n' +
    'AI-Powered Security Analysis System\n' +
    'Built with React & Random Forest ML Algorithm\n' +
    'Development Mode Active',
    'color: #8B5CF6; font-size: 16px; font-weight: bold;',
    'color: #6B21A8; font-size: 12px;'
  );
}