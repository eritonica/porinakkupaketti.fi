import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.scss';
import { Page } from './Routes/Page';
import { Admin } from './Admin/Routes/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Page />} />
        <Route path="/:page" element={<Page />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/:page" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
