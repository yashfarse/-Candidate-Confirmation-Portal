import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CandidateForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    positionAppliedFor: '',
    currentPosition: '',
    experienceYears: '',
  });
  const [resume, setResume] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availablePositions = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
    'Project Manager',
    'Business Analyst',
    'Other',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      e.target.value = '';
      return;
    }

    setError('');
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!Object.values(formData).every((value) => value) || !resume) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value);
      });
      submitFormData.append('resume', resume);

      await axios.post('http://localhost:5000/api/candidates', submitFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const formDataToStore = {
        ...formData,
        resumeName: resume.name,
        resumeType: resume.type,
        resumeSize: resume.size,
      };
      localStorage.setItem('candidateFormData', JSON.stringify(formDataToStore));

      const reader = new FileReader();
      reader.onload = function (e) {
        sessionStorage.setItem('resumeData', e.target.result);
      };
      reader.readAsDataURL(resume);

      navigate('/video-recording');
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="candidate-form-card p-4">
        <h2 className="mb-4 text-center text-primary">Candidate Information</h2>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">First Name *</label>
              <input
                type="text"
                className="form-control"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Last Name *</label>
              <input
                type="text"
                className="form-control"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Position Applied For *</label>
            <select
              className="form-select"
              name="positionAppliedFor"
              value={formData.positionAppliedFor}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a position</option>
              {availablePositions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Current Position *</label>
            <input
              type="text"
              className="form-control"
              name="currentPosition"
              value={formData.currentPosition}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Experience in Years *</label>
            <input
              type="number"
              className="form-control"
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleInputChange}
              min="0"
              step="0.5"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Resume (PDF only, max 5MB) *</label>
            <input
              type="file"
              className="form-control"
              accept="application/pdf"
              onChange={handleResumeChange}
              required
            />
            <small className="text-muted">
              Please upload your resume in PDF format (maximum size: 5MB)
            </small>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary px-5" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateForm;
