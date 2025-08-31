import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>💥</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
            Oops! Something went wrong
          </h1>
          <p style={{ fontSize: '16px', opacity: '0.9', marginBottom: '24px', maxWidth: '400px' }}>
            ViralClips AI encountered an unexpected error. Please refresh the page to try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Refresh Page
          </button>
          
          <details style={{ marginTop: '20px', maxWidth: '500px' }}>
            <summary style={{ cursor: 'pointer', fontSize: '12px', opacity: '0.7' }}>
              Show technical details
            </summary>
            <pre style={{ 
              fontSize: '10px', 
              background: 'rgba(0,0,0,0.2)', 
              padding: '10px', 
              borderRadius: '4px',
              marginTop: '10px',
              textAlign: 'left',
              overflow: 'auto'
            }}>
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Check if we're running in development mode
const isDev = process.env.NODE_ENV === 'development';

// Create root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found! Make sure there is a div with id="root" in your HTML.');
  
  // Create a fallback error display
  document.body.innerHTML = `
    <div style="
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: white;
      font-family: Inter, Arial, sans-serif;
      text-align: center;
      padding: 20px;
    ">
      <div style="font-size: 64px; margin-bottom: 20px;">🚫</div>
      <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 12px;">
        Critical Error
      </h1>
      <p style="font-size: 16px; opacity: 0.9; margin-bottom: 24px; max-width: 400px; line-height: 1.5;">
        The React root element could not be found. This indicates a serious configuration issue.
        Please contact support or check the console for more details.
      </p>
      <button onclick="window.location.reload()" style="
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
      ">
        Reload Page
      </button>
    </div>
  `;
} else {
  try {
    // Create React root
    const root = ReactDOM.createRoot(rootElement);
    
    // Render the app
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );

    // Signal that React has loaded (for the loading screen)
    setTimeout(() => {
      // Add a class to indicate React has loaded
      document.body.classList.add('react-loaded');
      
      // Dispatch a custom event
      window.dispatchEvent(new CustomEvent('reactAppLoaded'));
      
      if (isDev) {
        console.log('✅ ViralClips AI loaded successfully!');
      }
    }, 100);

  } catch (error) {
    console.error('Failed to render React app:', error);
    
    // Show error in the DOM
    rootElement.innerHTML = `
      <div style="
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        font-family: Inter, Arial, sans-serif;
        text-align: center;
        padding: 20px;
      ">
        <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
        <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 12px;">
          React Rendering Error
        </h1>
        <p style="font-size: 16px; opacity: 0.9; margin-bottom: 24px; max-width: 400px; line-height: 1.5;">
          Failed to render the ViralClips AI application. 
          Please check your internet connection and try refreshing the page.
        </p>
        <button onclick="window.location.reload()" style="
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        ">
          Refresh Page
        </button>
        <details style="margin-top: 20px; max-width: 500px;">
          <summary style="cursor: pointer; font-size: 12px; opacity: 0.7;">
            Technical Details
          </summary>
          <pre style="
            font-size: 10px;
            background: rgba(0,0,0,0.2);
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
            text-align: left;
            overflow: auto;
          ">${error.toString()}</pre>
        </details>
      </div>
    `;
  }
}

// Performance monitoring
if (isDev) {
  reportWebVitals(console.log);
} else {
  // In production, you might want to send to analytics
  reportWebVitals((metric) => {
    // You can send metrics to your analytics service here
    if (window.gtag) {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
  });
}

// Global error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// PWA installation prompt
window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  // Store the event so it can be triggered later
  window.deferredPrompt = event;
  
  if (isDev) {
    console.log('💾 PWA install prompt available');
  }
});
