import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './App.css';
import Header from './common/header/header';
import Footer from './common/footer/footer';
import ImageCompression from './ImageCompression/ImageCompression';
import TextToSpeech from './text-to-speech/TextToSpeech';
import PasswordGenerator from './PasswordGenerator/PasswordGenerator';
import SalaryCalculator from './SalaryCalculator/SalaryCalculator';

// Define titles for each route
const titles = {
    '/': 'Home',
    '/image-compression': 'Image Compression',
    '/text-to-speech': 'Text to Speech',
    '/password-generator': 'Password Generator',
    '/salary-calculator': 'Salary Calculator'
};

// Component to update the document title based on current route
const TitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        document.title = titles[location.pathname] || 'Default Title';
    }, [location]);

    return null;
};

// Main App component
function App() {
    return (
        <div className="App">
            <Router>
                <Header />
                <TitleUpdater /> {/* Component to update page title */}
                <div className='container mt-3'>
                    <Routes>
                        <Route path="/image-compression" element={<ImageCompression />} />
                        <Route path="/text-to-speech" element={<TextToSpeech />} />
                        <Route path="/password-generator" element={<PasswordGenerator />} />
                        <Route path="/salary-calculator" element={<SalaryCalculator />} />
                        <Route path="/" element={<Home />} /> {/* Default route */}
                    </Routes>
                </div>
                <Footer />
            </Router>
        </div>
    );
}

// Home component rendering links to other routes with improved design
const Home = () => {
    return (
        <div className="container">
            <div className='row'>
                <div className='col-md-4 col-12 mb-5'>
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h3 className="card-title text-left">Image Compression</h3>
                                <p className="card-text fs18 mb-2 text-left">Compress your images efficiently to reduce file size while maintaining quality.</p>
                            </div>
                            <Link className="btn btn-primary justify-content-between d-flex" to="/image-compression">
                                Optimize Images
                                <i className="material-icons ml-2">arrow_right</i>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 col-12 mb-5'>
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h3 className="card-title text-left">Text to Speech</h3>
                                <p className="card-text fs18 mb-2 text-left">Convert text into spoken language easily with text-to-speech conversion capabilities.</p>
                            </div>
                            <Link className="btn btn-primary align-items-center justify-content-between d-flex" to="/text-to-speech">
                                Text to Speech
                                <i className="material-icons ml-2">arrow_right</i>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 col-12 mb-5'>
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h3 className="card-title text-left">Password Generator</h3>
                                <p className="card-text fs18 mb-2 text-left">Generate strong, secure passwords with customizable options to enhance your online security.</p>
                            </div>
                            <Link className="btn btn-primary align-items-center justify-content-between d-flex" to="/password-generator">
                                Password Generator
                                <i className="material-icons ml-2">arrow_right</i>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='col-md-4 col-12 mb-5'>
                    <div className="card h-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                            <div>
                                <h3 className="card-title text-left">Salary Calculator</h3>
                                <p className="card-text fs18 mb-2 text-left">Calculate your salary accurately based on hourly, daily, weekly, monthly, or annual income figures.</p>
                            </div>
                            <Link className="btn btn-primary align-items-center justify-content-between d-flex" to="/salary-calculator">
                                Go to Salary Calculator
                                <i className="material-icons ml-2">arrow_right</i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
