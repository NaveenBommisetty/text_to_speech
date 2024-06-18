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
        const newFileName = `audio-clips/${filePrefix}_output.mp3`;
        const url = window.URL.createObjectURL(new Blob([response.data]));
        setAudioUrl(url);
        setFileName(newFileName);
        audioRef.current.src = url;
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
        setIsPlaying(true);
      } catch (error) {
        console.error('Error converting text to speech', error);
      }
    }
  };

  const handleTogglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('Error playing audio:', error);
        });
      }
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
                {audioUrl && (
                  <button onClick={handleTogglePlayPause} className="btn btn-primary">
                    {isPlaying ? (
                      <>
                        <span class="material-symbols-outlined">pause</span> Pause </> ) : (
                      <>
                        <span class="material-symbols-outlined">play_arrow</span>Play</>
                    )}
                  </button>
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
              <button onClick={handleSpeak} className="btn btn-primary mb-3 mt-3">
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
