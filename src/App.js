import React from 'react';
import './App.css';
//import TextToSpeech from './text-to-speech/TextToSpeech';
import Header from './common/header/header';
import Footer from './common/footer/footer';
// import PasswordGenerator from '../PasswordGenerator/PasswordGenerator';
// import SalaryCalculator from './SalaryCalculator/SalaryCalculator';
import ImageCompression from './ImageCompression/ImageCompression';

function App() {
    return (
        <div className="App">
            <Header />
            <div className='container mt-3'>
                <ImageCompression />
            </div>
            {/* <TextToSpeech />
            <PasswordGenerator />
            <SalaryCalculator /> */}
            
            <Footer />
        </div>
    );
}

export default App;
