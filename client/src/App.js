import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import CandidateForm from './components/CandidateForm';
import VideoRecorder from './components/VideoRecorder';
import Review from './components/Review';
import SuccessPage from './components/SuccessPage';
import LandingPage from './components/LandingPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/apply" element={<CandidateForm />} />
          <Route path="/video-recording" element={<VideoRecorder />} />
          <Route path="/review" element={<Review />} />
          <Route path="/success" element={<SuccessPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;