import React from 'react';
import { hydrateRoot } from 'react-dom/client'
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

import "./index.css"

if (!('process' in window)) {
  // @ts-ignore
  window.process = {}
}

// Get the root DOM node to hydrate the app into
const domNode = document.getElementById('root');

// If the root DOM node cannot be found, log an error message to the console
if (domNode === null) {
  console.log("Could not find element with root id.");
} else {
  // Hydrate the app into the root DOM node using the React DOM client API
  hydrateRoot(
    domNode, 
    // Wrap the App component in a StrictMode component for extra runtime checks
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <HelmetProvider>
          {/* Use a BrowserRouter to enable client-side routing */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HelmetProvider>
      </I18nextProvider>
    </React.StrictMode>
  );
}
