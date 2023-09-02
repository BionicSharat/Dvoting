import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './home';
import Candidate from './pages/Candidate';
import Vote from './pages/Vote';

import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}/>
        <Route path="/register-candidate" element={<Candidate />}/>
        <Route path="/vote" element={<Vote />}/>
      </Routes>
    </BrowserRouter>
);
