import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Header Section */}
      <header className="landing-header">
        <div className="container d-flex justify-content-between align-items-center py-3">
          <div className="brand">SpurQLabs Technologies 
</div>
          <nav>
            <Link to="/apply" className="btn apply-now-btn">
              Apply Now
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="landing-hero">
        <div className="container text-center">
          <h1 className="display-5 fw-bold text-white">
            Welcome — You're One Step Away
          </h1>
          <p className="lead my-4 text-light">
            Tell us about yourself, upload your resume, and record a short video to showcase your skills.
          </p>

          <div className="d-flex justify-content-center">
            <Link to="/apply" className="btn btn-cta btn-lg">
              Start Application
            </Link>
          </div>

          {/* Steps Section */}
          <div className="steps row mt-5 justify-content-center">
            <div className="col-md-3">
              <div className="step-card text-center">
                <h5>1. Apply</h5>
                <p>Fill in your details and upload a resume.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="step-card text-center">
                <h5>2. Record</h5>
                <p>Record a short video to showcase your personality.</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="step-card text-center">
                <h5>3. Submit</h5>
                <p>Review and submit your application easily.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer text-center">
        <small>© {new Date().getFullYear()} TalentStream — All rights reserved.</small>
      </footer>
    </div>
  );
};

export default LandingPage;
