import React from 'react';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider} from 'react-helmet-async';
import { createRouter, createServer, listen } from './core/server';

import App from '../client/App';

import { I18nextProvider } from 'react-i18next';
import i18n from './core/i18n';

import { DEBUG } from './core/errors';
import { cors } from './core/cors';
import { assets } from './core/assets';
import { upload } from './core/upload';
import { renderer } from './core/renderer';
import { compressFiles } from './core/compress';
import { APIRouter } from './api-routes';

import { analytics } from './core/analytics';
import analyticsSchema from './lib/schemas/analyticsSchema';

import Cryptology from './lib/common/Cryptology';

dotenv.config();

const generatePassword = async () => {
  DEBUG.log(Cryptology.encrypt("hoosat-template-working??"))
}
generatePassword();

if (process.env.STATIC_COMPRESSION === "true") {
  DEBUG.log("Start compressing build files.");
  compressFiles("./build/public", "br");
  compressFiles("./build/public", "deflate");
  compressFiles("./build/public", "gzip");
  DEBUG.log("Files have been compressed.");
}

mongoose.set('strictQuery', true);
mongoose.connect(process.env.ATLAS_URI!, {
  autoIndex: true,
});

DEBUG.log("Mongoose connected.");

// Create a router
const router = createRouter();
DEBUG.log("Server router created.");

router.Middleware(analytics(async (analyticsData) => {
  const analytics = new analyticsSchema(analyticsData);
  await analytics.save();
}));
DEBUG.log("Analytics middleware added.");

// Define routes and middleware
router.Middleware(cors(process.env.ORIGINS!, 'GET, POST, PUT, DELETE'));
DEBUG.log("Cors middleware added.");

// Serve static files from the "public" directory.
router.Middleware(assets(process.env.PUBLIC!, (process.env.STATIC_COMPRESSION === "true") ? true : false));
DEBUG.log("Assets middleware added.");

// Handle multipart/form-data file uploading.
router.Middleware(upload(`./build/public/files`));
DEBUG.log("Upload middleware added.");

// Use Router from another module.
router.UseRouter(APIRouter);
DEBUG.log("APIRouter added.");


router.Get("*", async (req, res) => {
  const helmetContext = {};
  const jsx = 
    <React.StrictMode>
      <I18nextProvider i18n={i18n}>
        <HelmetProvider context={helmetContext}>
          <html lang="FI-fi">
            <head>
              <meta charSet="utf-8" />
              <link rel="icon" href="/logo/favicon.ico" />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="manifest" href="/manifest.json" />
            </head>
            <body>
              {/* Mounting the App component inside the StaticRouter */}
              <div id="root">
                <StaticRouter location={req.url!}>
                  <App />
                </StaticRouter>
              </div>
            </body>
          </html>
        </HelmetProvider>
      </I18nextProvider>
    </React.StrictMode>;
  renderer({
    res: res, 
    jsx: jsx, 
    helmetContext: helmetContext, 
    extractCSS: true, 
    preloadTagFolder: './build/public'
  });
});


// Create the server
const server = createServer(router);

// Start listening on port 8080
const port = parseInt(process.env.PORT || "8080");
listen(server, port, () => {
  DEBUG.log(`Server is running on port ${port}`);
});
