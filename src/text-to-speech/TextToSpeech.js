import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const TextToAudio = () => {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    const loadVoices = () => {
      const synth = window.speechSynthesis;
      const voiceList = synth.getVoices();
      setVoices(voiceList);
      if (voiceList.length > 0) {
        setSelectedVoice(voiceList[0].name);
      }
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  const handleSpeak = () => {
    if (text !== '') {
      const utterance = new SpeechSynthesisUtterance(text);
      const selectedVoiceObj = voices.find(voice => voice.name === selectedVoice);
      if (selectedVoiceObj) {
        utterance.voice = selectedVoiceObj;
      }

      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();
      mediaRecorderRef.current = new MediaRecorder(destination.stream);

      mediaRecorderRef.current.ondataavailable = event => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        chunksRef.current = [];
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      };

      const source = audioContext.createMediaStreamSource(destination.stream);
      source.connect(audioContext.destination);

      mediaRecorderRef.current.start();
      window.speechSynthesis.speak(utterance);

      utterance.onend = () => {
        mediaRecorderRef.current.stop();
        audioContext.close();
      };
    }
  };

  return (
    <div className="container centered-card-container mt-5">
      <div className="card centered-card" style={{ backgroundSize: 'cover' }}>
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
            </div>
            <div className="col-md-6 d-flex flex-column align-items-left">
              <h1 className="text-left mb-4">Text to Speech Converter</h1>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="form-control mb-3"
              >
                <option value="" disabled>Select a voice</option>
                {voices.map((voice, index) => (
                  <option key={index} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
              <button onClick={handleSpeak} className="btn btn-primary mb-3">Speak</button>
              {audioUrl && <audio controls src={audioUrl} className="mt-3" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToAudio;