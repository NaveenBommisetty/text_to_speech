import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Header from './common/header/header';
import Footer from './common/footer/footer';
import ImageCompression from './ImageCompression/ImageCompression';
import TextToSpeech from './text-to-speech/TextToSpeech';
import PasswordGenerator from './PasswordGenerator/PasswordGenerator';
import SalaryCalculator from './SalaryCalculator/SalaryCalculator';

function App() {
    return (
        <div className="App">
            <Router>
                <Header />
                <div className='container mt-3'>
                    <Routes>
                        <Route path="/image-compression" element={<ImageCompression />} />
                        <Route path="/text-to-speech" element={<TextToSpeech />} />
                        <Route path="/password-generator" element={<PasswordGenerator />} />
                        <Route path="/salary-calculator" element={<SalaryCalculator />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </div>
                <Footer />
            </Router>
        </div>
    );
}

const Home = () => {
    return (
        <div className="container">
            <div className='row'>
                <div className='col-md-6 mb-5'>
                    <div className="card">
                    <div className="card-body">
                        <h3>Image Compression</h3>
                        <p>Compress your images efficiently.</p>
                        <Link to="/image-compression">Go to Image Compression</Link>
                    </div>
                    </div>
                </div>
                <div className='col-md-6 mb-5'>
                    <div className="card">
                    <div className="card-body">
                        <h3>Text to Speech</h3>
                        <p>Convert text to speech easily.</p>
                        <Link to="/text-to-speech">Go to Text to Speech</Link>
                    </div>
                    </div>
                </div>
                <div className='col-md-6 mb-5'>
                    <div className="card">
                        <h3>Password Generator</h3>
                        <p>Generate strong passwords.</p>
                        <Link to="/password-generator">Go to Password Generator</Link>
                    </div>
                </div>
                <div className='col-md-6 mb-5'>
                    <div className="card">
                        <h3>Salary Calculator</h3>
                        <p>Calculate your salary accurately.</p>
                        <Link to="/salary-calculator">Go to Salary Calculator</Link>
                    </div>
                </div>
        </div>
    </div>
    );
}

export default App;
