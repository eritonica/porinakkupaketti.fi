import React from 'react';
import { hydrateRoot } from 'react-dom/client'
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

const domNode = document.getElementById('root');
if (domNode === null) {
  console.log("Could not find element with root id.");
} else {
  hydrateRoot(
    domNode,
      <React.StrictMode>
        <I18nextProvider i18n={i18n}>
          <HelmetProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </HelmetProvider>
        </I18nextProvider>
      </React.StrictMode>
  );
}