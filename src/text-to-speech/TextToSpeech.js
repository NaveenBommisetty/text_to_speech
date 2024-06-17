import React, { useState, useEffect } from 'react';

const TextToSpeech = () => {
    const [text, setText] = useState('');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

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
            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Text to Speech Converter</h1>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows="10"
                cols="50"
                placeholder="Enter text here..."
                style={{ padding: '10px', fontSize: '16px' }}
            />
            <br />
            <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                style={{ padding: '10px', fontSize: '16px', marginTop: '10px' }}
            >
                {voices.map((voice, index) => (
                    <option key={index} value={voice.name}>
                        {voice.name} ({voice.lang})
                    </option>
                ))}
            </select>
            <br />
            <button onClick={handleSpeak} style={{ padding: '10px 20px', fontSize: '16px', marginTop: '10px' }}>
                Speak
            </button>
        </div>
    );
};

export default TextToSpeech;
