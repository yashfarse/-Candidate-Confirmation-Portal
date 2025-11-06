import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoRecorder = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [timer, setTimer] = useState(90);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const videoPreviewRef = useRef(null);
  const startTimeRef = useRef(null); // track start time

  const requestPermissions = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      setHasPermission(true);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Please grant camera and microphone permissions to record your video.');
      setHasPermission(false);
    }
  };

  const startRecording = async () => {
    setError('');
    if (!hasPermission) {
      await requestPermissions();
      return;
    }

    try {
      const mediaRecorder = new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now(); // record the start time

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const endTime = Date.now();
        const durationInSeconds = Math.round((endTime - startTimeRef.current) / 1000); // actual duration

        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideo(url);
        setRecordedBlob(blob);
        chunksRef.current = [];

        // Save video metadata
        sessionStorage.setItem(
          'videoFormData',
          JSON.stringify({
            hasVideo: true,
            duration: durationInSeconds, // ✅ actual time recorded
          })
        );
      };

      mediaRecorder.start();
      setIsRecording(true);
      setShowInstructions(false);
      startTimer();
    } catch (error) {
      console.error('Error starting recording:', error);
      setError('Error starting recording. Please try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      clearInterval(timerRef.current);
      setTimer(90);
      setShowInstructions(false);

      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = null;
      }
    }
  };

  const startTimer = () => {
    setTimer(90);
    timerRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          stopRecording();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleRetake = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }
    setRecordedVideo(null);
    setRecordedBlob(null);
    setTimer(90);
    setError('');
    setShowInstructions(true);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    requestPermissions();
  };

  const handleSubmit = () => {
    if (!recordedVideo || !recordedBlob) {
      setError('Please record a video before submitting.');
      return;
    }

    localStorage.setItem('recordedVideo', recordedVideo);

    const formData = new FormData();
    formData.append('video', recordedBlob, 'recorded-video.webm');

    navigate('/review');
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          {showInstructions && (
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Video Introduction Instructions</h4>
              </div>
              <div className="card-body">
                <h5>Please cover the following points in your video:</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">1. A brief introduction about yourself</li>
                  <li className="list-group-item">2. Why are you interested in this position?</li>
                  <li className="list-group-item">3. Highlight your relevant experience</li>
                  <li className="list-group-item">4. Your long-term career goals</li>
                </ul>
                <div className="alert alert-info mt-3">
                  <i className="bi bi-info-circle"></i> Maximum duration: 90 seconds
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="card shadow-sm">
            <div className="card-body">
              {!hasPermission && !recordedVideo && (
                <div className="text-center mb-3">
                  <button className="btn btn-primary" onClick={requestPermissions}>
                    Grant Camera Access
                  </button>
                </div>
              )}

              {hasPermission && !recordedVideo && !isRecording && (
                <div className="text-center mb-3">
                  <video
                    ref={videoPreviewRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-100 mb-3"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                </div>
              )}

              {!recordedVideo && (
                <div className="text-center mb-3">
                  {isRecording ? (
                    <>
                      <div className="alert alert-info">
                        Recording in progress... Time remaining: {timer}s
                      </div>
                      <button className="btn btn-danger btn-lg" onClick={stopRecording}>
                        Stop Recording
                      </button>
                    </>
                  ) : (
                    hasPermission && (
                      <button className="btn btn-primary btn-lg" onClick={startRecording}>
                        Start Recording
                      </button>
                    )
                  )}
                </div>
              )}

              {recordedVideo && (
                <div className="text-center">
                  <video
                    src={recordedVideo}
                    controls
                    className="w-100 mb-3"
                    style={{ maxHeight: '400px' }}
                  />
                  <div className="btn-group">
                    <button className="btn btn-secondary" onClick={handleRetake}>
                      Record Again
                    </button>
                    <button className="btn btn-success" onClick={handleSubmit}>
                      Submit Recording
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;
