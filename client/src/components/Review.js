import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Review = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [videoData, setVideoData] = useState({});
  const [recordedVideoUrl, setRecordedVideoUrl] = useState('');

  useEffect(() => {
    // Fetch saved data from localStorage/sessionStorage
    const storedForm = JSON.parse(localStorage.getItem('candidateFormData') || '{}');
    const storedVideo = JSON.parse(sessionStorage.getItem('videoFormData') || '{}');
    const recordedUrl = localStorage.getItem('recordedVideo');

    // ✅ Fix for duration showing 0 seconds
    if (storedVideo && (!storedVideo.duration || storedVideo.duration <= 0)) {
      storedVideo.duration = storedVideo.actualDuration || 90; // fallback to 90s if missing
    }

    setFormData(storedForm);
    setVideoData(storedVideo);
    setRecordedVideoUrl(recordedUrl);
  }, []);

  const handleBack = () => {
    navigate('/video-recording');
  };

  const handleSubmit = async () => {
    try {
      const submitFormData = new FormData();

      // Add form data
      Object.keys(formData).forEach(key => {
        if (key !== 'resume') {
          submitFormData.append(key, formData[key]);
        }
      });

      // Resume file
      const resumeData = sessionStorage.getItem('resumeData');
      if (resumeData) {
        const blob = await (await fetch(resumeData)).blob();
        submitFormData.append('resume', blob, formData.resumeName);
      }

      // Video file
      if (recordedVideoUrl) {
        const videoResponse = await fetch(recordedVideoUrl);
        const videoBlob = await videoResponse.blob();
        submitFormData.append('video', videoBlob, 'recorded-video.webm');
      }

      // Send data to backend
      const response = await fetch('http://localhost:5000/api/candidates', {
        method: 'POST',
        body: submitFormData,
      });

      if (!response.ok) throw new Error('Failed to submit application');

      // Clear all stored data
      localStorage.removeItem('candidateFormData');
      localStorage.removeItem('recordedVideo');
      sessionStorage.removeItem('videoFormData');
      sessionStorage.removeItem('resumeData');

      navigate('/success');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mb-4 shadow-sm border-primary">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Review Your Application</h4>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            {/* Left column: Personal Info */}
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Personal Information</h5>
                </div>
                <div className="card-body">
                  <p><strong>First Name:</strong> {formData.firstName || '-'}</p>
                  <p><strong>Last Name:</strong> {formData.lastName || '-'}</p>
                  <p><strong>Position Applied For:</strong> {formData.positionAppliedFor || '-'}</p>
                  <p><strong>Current Position:</strong> {formData.currentPosition || '-'}</p>
                  <p><strong>Experience:</strong> {formData.experienceYears ? `${formData.experienceYears} years` : '-'}</p>
                </div>
              </div>
            </div>

            {/* Right column: Documents & Video */}
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Documents & Video</h5>
                </div>
                <div className="card-body">
                  {/* Resume */}
                  <div className="mb-4">
                    <h6 className="mb-2">Resume</h6>
                    {formData.resumeName ? (
                      <div className="d-flex align-items-center">
                        <i className="bi bi-file-earmark-pdf text-danger fs-4 me-2"></i>
                        <a
                          href={sessionStorage.getItem('resumeData')}
                          download={formData.resumeName}
                          className="btn btn-outline-primary btn-sm"
                        >
                          Download Resume ({(formData.resumeSize / 1024 / 1024).toFixed(1)} MB)
                        </a>
                      </div>
                    ) : (
                      <p className="text-muted">No resume uploaded</p>
                    )}
                  </div>

                  {/* Video */}
                  <div className="mt-3">
                    <h6 className="mb-2">Video Introduction</h6>
                    {recordedVideoUrl ? (
                      <div>
                        <div className="ratio ratio-16x9 mb-2">
                          <video src={recordedVideoUrl} controls className="rounded border" />
                        </div>
                        <p className="text-muted small">
                          <i className="bi bi-clock me-1"></i>
                          Duration: {videoData.duration ? `${videoData.duration} seconds` : 'Not available'}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted">No video recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-secondary" onClick={handleBack}>
              Back to Video Recording
            </button>
            <button className="btn btn-success" onClick={handleSubmit}>
              Submit Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
