
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CatalystProvider } from './catalyst/providers/CatalystProvider.tsx'

// Initialize the application with Catalyst Provider
// This follows the Catalyst application startup pattern
createRoot(document.getElementById("root")!).render(
  <CatalystProvider>
    <App />
  </CatalystProvider>
);
