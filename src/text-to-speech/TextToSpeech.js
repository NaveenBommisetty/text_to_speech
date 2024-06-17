import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // Ensure Bootstrap CSS is imported
import lamejs from 'lamejs';
import { decode } from 'wav-decoder';

const TextToSpeech = () => {
    const [text, setText] = useState('');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [fileName, setFileName] = useState('speech.mp3');
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
            const firstThreeWords = text.split(' ').slice(0, 1).join('_');
            const newFileName = firstThreeWords ? `${firstThreeWords}.mp3` : 'speech.mp3';
            setFileName(newFileName);

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

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const arrayBuffer = await audioBlob.arrayBuffer();
                const decodedData = await decode(arrayBuffer);
                const mp3Blob = convertWavToMp3(decodedData);
                const audioUrl = URL.createObjectURL(mp3Blob);
                setAudioUrl(audioUrl);
            };

            mediaRecorder.start();
            window.speechSynthesis.speak(utterance);

            utterance.onend = () => {
                mediaRecorder.stop();
            };
        }
    };

    const convertWavToMp3 = (decodedData) => {
        const { sampleRate, channelData } = decodedData;
        const mp3Encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
        const samples = new Int16Array(channelData[0].length);
        for (let i = 0; i < samples.length; i++) {
            samples[i] = Math.max(-1, Math.min(1, channelData[0][i])) * 32767;
        }

        const mp3Data = [];
        const sampleBlockSize = 1152;

        for (let i = 0; i < samples.length; i += sampleBlockSize) {
            const sampleChunk = samples.subarray(i, i + sampleBlockSize);
            const mp3buf = mp3Encoder.encodeBuffer(sampleChunk);
            if (mp3buf.length > 0) {
                mp3Data.push(mp3buf);
            }
        }

        const mp3buf = mp3Encoder.flush();
        if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
        }

        return new Blob(mp3Data, { type: 'audio/mp3' });
    };

    return (
        <div className="container centered-card-container mt-5">
            <div className="card centered-card" style={{ backgroundImage: 'url("path_to_your_image.jpg")', backgroundSize: 'cover' }}>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <textarea value={text} onChange={(e) => setText(e.target.value)} rows="10" className="form-control" placeholder="Enter text here..." />
                        </div>
                        <div className="col-md-6 d-flex flex-column align-items-left">
                            <h1 className="text-left mb-4">Text to Speech Converter</h1>
                            <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)} className="form-control mb-3">
                                <option value="" disabled>Select a voice</option>
                                {voices.map((voice, index) => (
                                    <option key={index} value={voice.name}>
                                        {voice.name} ({voice.lang})
                                    </option>
                                ))}
                            </select>
                            <button onClick={handleSpeak} className="btn btn-primary mb-3"> Speak </button>
                            <a href={audioUrl} download={fileName} className="btn btn-secondary" disabled={!audioUrl}> Download Audio </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextToSpeech;
