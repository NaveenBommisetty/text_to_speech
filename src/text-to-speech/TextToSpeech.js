import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LanguageDropdown from '../Languages/LanguageDropdown';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [audioUrl, setAudioUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [languages, setLanguages] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/languages');
        setLanguages(response.data);
      } catch (error) {
        console.error('Error fetching languages', error);
      }
    };
    fetchLanguages();
  }, []);

  const handleSpeak = async () => {
    if (text) {
      try {
        const response = await axios.post('http://127.0.0.1:5000/api/text-to-speech', { text, lang: selectedLanguage }, { responseType: 'blob' });
        const filePrefix = text.slice(0, 2).toLowerCase();
        const newFileName = `${filePrefix}_output.mp3`;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setAudioUrl(url);
        setFileName(newFileName);
        setIsPlaying(true); // Automatically play when the audio is ready
      } catch (error) {
        console.error('Error converting text to speech', error);
      }
    }
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  }, [audioUrl]);

  const handlePlay = () => {
    handleSpeak();
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const handlePause = () => {
    handleSpeak();
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="container centered-card-container mt-5">
      <div className="card centered-card" style={{ backgroundImage: 'url("path_to_your_image.jpg")', backgroundSize: 'cover' }}>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="10"
                className="form-control"
                placeholder="Enter text here..."
              />
              <div className="mt-2">
                {isPlaying ? (
                  <svg onClick={handlePause} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-pause" style={{ cursor: 'pointer' }}>
                    <rect x="6" y="4" width="4" height="16"></rect>
                    <rect x="14" y="4" width="4" height="16"></rect>
                  </svg>
                ) : (
                  <svg onClick={handlePlay} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-play" style={{ cursor: 'pointer' }}>
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                )}
              </div>
              <audio ref={audioRef} onEnded={() => setIsPlaying(false)} controls style={{ display: 'none' }}></audio>
            </div>
            <div className="col-md-6 d-flex flex-column align-items-left">
              <h1 className="text-left mb-4">Text to Speech Converter</h1>
              <LanguageDropdown
                languages={languages}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
              />
              <button onClick={handleSpeak} className="btn btn-primary mb-3">
                Convert to Audio
              </button>
              {audioUrl && (
                <a href={audioUrl} download={fileName} className="btn btn-secondary">
                  Download Audio
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeech;
