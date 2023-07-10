import React from 'react';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Cryptology from './lib/common/Cryptology';
import App from '../client/App';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { replaceHeadTags } from './core/seo';
import { DEBUG, ErrorHandler } from './core/errors';
import { cors } from './core/cors';
import { HelmetContext } from './core/types';
import { createRouter, createServer, listen } from './core/server';
import { assets } from './core/assets';
import { upload } from './core/upload';
import { APIRouter } from './api-routes';
import { generatePreloadTags } from './core/preload';
import { analytics } from './core/analytics';
import analyticsSchema from './lib/schemas/analyticsSchema';
import { extractCssFrom } from './core/cssExtractor';
import { compressFiles } from './core/compress';

dotenv.config();

// generate password.

const generatePassword = async () => {
  console.log(Cryptology.encrypt("hoosat-template-working??"))
}
generatePassword();

if (process.env.STATIC_COMPRESSION === "true") {
  console.log("Start compressing build files.");
  compressFiles("./build/public", "br");
  compressFiles("./build/public", "delate");
  compressFiles("./build/public", "gzip");
  console.log("Files have been compressed.");
}


mongoose.set('strictQuery', true);
mongoose.connect(process.env.ATLAS_URI!, {
  autoIndex: true,
});

console.log("Mongoose connected.");

// Create a router
const router = createRouter();
console.log("Server router created.");

router.Middleware(analytics(async (analyticsData) => {
  const analytics = new analyticsSchema(analyticsData);
  await analytics.save();
}));
console.log("Analytics middleware added.");

// Define routes and middleware
router.Middleware(cors(process.env.ORIGINS!, 'GET, POST, PUT, DELETE'));
console.log("Cors middleware added.");

// Serve static files from the "public" directory.
router.Middleware(assets(process.env.PUBLIC!, (process.env.STATIC_COMPRESSION === "true") ? true : false));
console.log("Assets middleware added.");

// Handle multipart/form-data file uploading.
router.Middleware(upload(`./build/public/files`));
console.log("Upload middleware added.");

// Use Router from another module.
router.UseRouter(APIRouter);
console.log("APIRouter added.");


router.Get("*", (req, res) => {
  const helmetContext: HelmetContext = {};
  const css = extractCssFrom("./src/client");
  let preloadTags: string[];
  if(process.env.NODE_ENV === "development") {
    preloadTags = generatePreloadTags('./build/public', '/');
  } else {
    preloadTags = generatePreloadTags(process.env.PRELOAD_TAG_FOLDER!, '/');
  }

  const replaceStream = replaceHeadTags({
    title: helmetContext.helmet?.title?.toString() || '',
    meta: helmetContext.helmet?.meta?.toString() || '',
    link: preloadTags.join("\n") + (helmetContext.helmet?.link?.toString() || ''),
    script: helmetContext.helmet?.script?.toString() || '',
    base: helmetContext.helmet?.base?.toString() || '',
    style: css + helmetContext.helmet?.style?.toString() || '',
  });

  // Rendering the App component to a pipeable stream
  const stream = renderToPipeableStream(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <html lang="FI-fi">
          <head>
            <meta charSet="utf-8" />
            <title>Porin Akkupaketti</title>
            <meta name="description" content="Porin Akkupaketti, teemme pienakkujen huoltamista ja kierrätämme niitä. Porin Akkupaketti (c) MTH-TEK tmi, Author: Hoosat Oy, Designer: Toni Lukkaroinen" />
            <link rel="icon" href="/logo/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="manifest" href="/manifest.json" />
          </head>
          <body>
            {/* Mounting the App component inside the StaticRouter */}
            <div id="root">
              <StaticRouter location={req.url || ''}>
                <App />
              </StaticRouter>
            </div>
          </body>
        </html>
      </HelmetProvider>
    </React.StrictMode>,
    {
      bootstrapModules: ["/bundle.js"],
      onShellReady: () => {
        res.setHeader('content-type', 'text/html');
        stream.pipe(replaceStream).pipe(res);
      },
      onShellError(error) {
        console.error(error);
        res.status(500).send("onShellError");
        ErrorHandler(error);
      },
      onError(error) {
        console.error(error);
        ErrorHandler(error);
      }
    }
  );
});


// Create the server
const server = createServer(router);

// Start listening on port 8080
const port = parseInt(process.env.PORT || "8080");
listen(server, port, () => {
  DEBUG.log(`Server is running on port ${port}`);
});
