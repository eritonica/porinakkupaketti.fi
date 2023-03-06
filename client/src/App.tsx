import React, { useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.scss';
import { Landing } from './Routes/Landing';
import { Equipment } from './Routes/Equipment';
import { References } from './Routes/References';
import { Contact } from './Routes/Contact';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/references" element={<References />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
