import React from 'react';
import './App.css';
import TextToSpeech from './text-to-speech/TextToSpeech';
import Header from './common/header/header';
import Footer from './common/footer/footer';

function App() {
    return (
        <div className="App">
            <Header />
            <TextToSpeech />
            <Footer />
        </div>
    );
}

export default App;
