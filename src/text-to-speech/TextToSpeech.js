import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import LanguageDropdown from '../Languages/LanguageDropdown';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [audioUrl, setAudioUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [languages, setLanguages] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputError, setInputError] = useState(false); // State to track empty input
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/api/languages');
        setLanguages(response.data);
      } catch (error) {
        toast.error('Error fetching languages');
      }
    };
    fetchLanguages();
  }, []);

  const handleSpeak = async () => {
    if (text.trim() === '') {
      setInputError(true);
      toast.error('Please enter some text to convert.');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/text-to-speech', { text, lang: selectedLanguage }, { responseType: 'blob' });

      const firstTwoWords = text.trim().split(' ').slice(0, 2).join('_').toLowerCase();
      const newFileName = `${firstTwoWords}_audio.mp3`;

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setAudioUrl(url);
      setFileName(newFileName);
      audioRef.current.src = url;
      audioRef.current.play().catch(error => {
        toast.error('Error playing audio');
      });
      setIsPlaying(true);
      setInputError(false);

      // Display success toast for download
      toast.success('Audio file is ready for download!');

    } catch (error) {
      toast.error('Error converting text to speech');
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
          toast.error('Error playing audio');
        });
      }
    }
  };

  const handleDownload = () => {
    setAudioUrl('');
    setFileName('');
    toast.success('Audio file downloaded successfully!');
  };

  return (
    <div className="container centered-card-container">
      <div className="p-3 mt-2 mb-2">
        <div className="card-body">
          <h1 className='h1-tag'>Secure <span className='green-title-color'> Text to Speech Generator</span></h1>
        </div>
      </div>
      <ToastContainer /> 
      <div className="card" style={{ backgroundImage: 'url("path_to_your_image.jpg")', backgroundSize: 'cover' }}>
        <div className="card-body">
          <div className="row">
            <div className="col-md-7 mb-3">
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setInputError(false); // Clear input error when user starts typing
                }}
                rows="10"
                className={`form-control ${inputError ? 'is-invalid' : ''}`}
                placeholder="Enter text here..."
              />
              {inputError && (
                <div className="invalid-feedback">
                  Please enter some text to convert.
                </div>
              )}
              <div className="mt-2">
                {audioUrl && (
                  <button onClick={handleTogglePlayPause} className="btn btn-primary">
                    {isPlaying ? (
                      <>
                        <span className="material-symbols-outlined">pause</span> Pause 
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">play_arrow</span> Play
                      </>
                    )}
                  </button>
                )}
              </div>
              <audio ref={audioRef} onEnded={() => setIsPlaying(false)} controls style={{ display: 'none' }}></audio>
            </div>
            <div className="col-md-5 d-flex flex-column align-items-left">
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
                <a href={audioUrl} download={fileName} onClick={handleDownload} className="btn btn-dark">
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
