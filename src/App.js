import React from 'react';
import './App.css';
import TextToSpeech from './text-to-speech/TextToSpeech';
import Header from './common/header/header';
import Footer from './common/footer/footer';
import PasswordGenerator from './PasswordGenerator/passwordGenerator';

function App() {
    return (
        <div className="App">
            <Header />
            <TextToSpeech />
            <PasswordGenerator />
            <Footer />
        </div>
    );
}

export default App;
