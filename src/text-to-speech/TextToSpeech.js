import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // Ensure Bootstrap CSS is imported

const TextToSpeech = () => {
    const [text, setText] = useState('');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const audioContextRef = useRef(null);
    const destinationRef = useRef(null);

    useEffect(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            destinationRef.current = audioContextRef.current.createMediaStreamDestination();
        }

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

            const audioContext = audioContextRef.current;
            const destination = destinationRef.current;
            const mediaRecorder = new MediaRecorder(destination.stream);
            const audioChunks = [];

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
            };

            mediaRecorder.start();
            window.speechSynthesis.speak(utterance);

            utterance.onend = () => {
                mediaRecorder.stop();
            };
        }
    };

    return (
        <div className="container mt-5">
            
            <div className="row">
                <div className="col-md-6 mb-3">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows="9"
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
                    <button onClick={handleSpeak} className="btn btn-primary mb-3">
                        Speak
                    </button>
                    {audioUrl && (
                        <a href={audioUrl} download="speech.mp3" className="btn btn-secondary">
                            Download Audio
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TextToSpeech;
