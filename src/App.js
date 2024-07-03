import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './App.css';
import Header from './common/header/header';
import Footer from './common/footer/footer';
import ImageCompression from './ImageCompression/ImageCompression';
import TextToSpeech from './text-to-speech/TextToSpeech';
import PasswordGenerator from './PasswordGenerator/PasswordGenerator';
import SalaryCalculator from './SalaryCalculator/SalaryCalculator';
import CaseConverter from './CaseConvertter/CaseConverter';
import InvoiceGenerator from './InvoiceGenerator/InvoiceGenerator';

// Define titles for each route
const titles = {
    '/': 'Home',
    '/image-compression': 'Image Compression',
    '/text-to-speech': 'Text to Speech',
    '/password-generator': 'Password Generator',
    '/salary-calculator': 'Salary Calculator',
    '/case-converter': 'Case Converter',
    '/invoice-generator': 'Invoice Generator'
};

// Component to update the document title based on current route
const TitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        document.title = titles[location.pathname] || 'Default Title';
    }, [location]);

    return null;
};

const MainContent = ({ cardData, category, setCategory, searchQuery, setSearchQuery, sortedCards }) => {
    const location = useLocation();

    return (
        <div className="container mt-3">
            <div className="pt-5 pb-3">
                <h1>Link Fleek Free Tools</h1>
                <p>
                    Use our free tools to convert & compress images, text to speech, password generator, salary calculator and much more.
                    So, go and use them for yourself.
                </p>
            </div>
            <div className="row mb-4">
                {location.pathname === '/' && (
                    <div className="col-lg-3 col-md-12 col-xs-12">
                        <div className="sticky-sidebar">
                            <div className="card mb-3">
                                <div className="">
                                    <div className="input-group mb-3">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by title..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <h5 className="card-title text-left">Filter By Category</h5>
                                    <ul className="list-group">
                                        <li className={`list-group-item ${category === '' ? 'active' : ''}`}>
                                            <button className="btn btn-link" onClick={() => setCategory('')}>
                                                All categories
                                            </button>
                                        </li>
                                        {['Business', 'Developers', 'General', 'Guides', 'Marketing', 'Security'].map((cat) => (
                                            <li key={cat} className={`list-group-item ${category === cat ? 'active' : ''}`}>
                                                <button className="btn btn-link" onClick={() => setCategory(cat)}>
                                                    {cat}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={location.pathname === '/' ? 'col-lg-9 col-md-12' : 'col-12'}>
                    <Routes>
                        {sortedCards()
                            .filter(
                                (card) =>
                                    (category === '' || card.category === category) &&
                                    (searchQuery === '' ||
                                        card.title.toLowerCase().includes(searchQuery.toLowerCase()))
                            )
                            .map((card) => (
                                <Route key={card.path} path={card.path} element={card.component} />
                            ))}
                        <Route
                            path="/"
                            element={
                                <Home
                                    cardData={cardData}
                                    category={category}
                                    searchQuery={searchQuery}
                                    setCategory={setCategory}
                                    setSearchQuery={setSearchQuery}
                                />
                            }
                        />
                    </Routes>
                </div>
            </div>
        </div>
    );
};

// Main App component
function App() {
    const [category, setCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy] = useState('');

    // Data for the cards
    const cardData = [
        {
            title: 'Image Compression',
            description: 'Compress your images efficiently to reduce file size while maintaining quality.',
            category: 'Developers',
            path: '/image-compression',
            component: <ImageCompression />
        },
        {
            title: 'Text to Speech',
            description: 'Convert text into spoken language easily with text-to-speech conversion capabilities.',
            category: 'General',
            path: '/text-to-speech',
            component: <TextToSpeech />
        },
        {
            title: 'Password Generator',
            description: 'Generate strong, secure passwords with customizable options to enhance your online security.',
            category: 'Security',
            path: '/password-generator',
            component: <PasswordGenerator />
        },
        {
            title: 'Salary Calculator',
            description: 'Calculate your salary accurately based on hourly, daily, weekly, monthly, or annual income figures.',
            category: 'Business',
            path: '/salary-calculator',
            component: <SalaryCalculator />
        },
        {
            title: 'Case Converter',
            description: 'Convert case or capitalize letters in your documents and text messages using the case converter.',
            category: 'General',
            path: '/case-converter',
            component: <CaseConverter />
        },
        {
            title: 'Invoice Generator',
            description: 'Fill in your business details in the invoice template below to create a professional invoice for your customers.',
            category: 'Business',
            path: '/invoice-generator',
            component: <InvoiceGenerator />
        }
    ];

    // Function to sort cardData based on selected sortBy option
    const sortedCards = () => {
        switch (sortBy) {
            case 'oldest':
                return [...cardData].sort((a, b) => new Date(a.date) - new Date(b.date));
            case 'newest':
                return [...cardData].sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'az':
                return [...cardData].sort((a, b) => a.title.localeCompare(b.title));
            case 'za':
                return [...cardData].sort((a, b) => b.title.localeCompare(a.title));
            default:
                return cardData;
        }
    };

    return (
        <div className="App">
            <Router>
                <Header />
                <TitleUpdater />
                <MainContent
                    cardData={cardData}
                    category={category}
                    setCategory={setCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortedCards={sortedCards}
                />
                <Footer />
            </Router>
        </div>
    );
}

// Home component rendering links to other routes with improved design
const Home = ({ cardData, category, searchQuery, setCategory, setSearchQuery }) => {
    return (
        <div className="container">
            <div className="row">
                {cardData
                    .filter(
                        (card) =>
                            (category === '' || card.category === category) &&
                            (searchQuery === '' || card.title.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                    .map((card) => (
                        <div key={card.path} className="col-md-6 col-12 mb-5">
                            <div className="card h-100">
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h3 className="card-title text-left">{card.title}</h3>
                                        <p className="card-text fs18 mb-2 text-left">{card.description}</p>
                                    </div>
                                    <Link className="btn btn-primary justify-content-between d-flex" to={card.path}>
                                        Go to {card.title}
                                        <i className="material-icons ml-2">arrow_right</i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default App;