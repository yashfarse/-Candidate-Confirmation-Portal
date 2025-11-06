import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="card text-center p-4">
        <div className="card-body">
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-primary" style={{ fontSize: '4rem' }}></i>
          </div>
          <h2 className="card-title mb-3 text-primary">Application Submitted Successfully!</h2>
          <p className="card-text text-muted">
            Thank you for applying. Our team will review your information soon.
          </p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate('/')}
          >
            Submit Another Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
