import React from 'react';
import './App.css';
import TextToSpeech from './text-to-speech/TextToSpeech';
import Header from './common/header/header';
import Footer from './common/footer/footer';
import PasswordGenerator from './PasswordGenerator/PasswordGenerator';
import SalaryCalculator from './SalaryCalculator/SalaryCalculator';

function App() {
    return (
        <div className="App">
            <Header />
            <TextToSpeech />
            <PasswordGenerator />
            <SalaryCalculator />
            <Footer />
        </div>
    );
}

export default App;
