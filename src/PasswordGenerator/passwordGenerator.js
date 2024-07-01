import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Slider } from '@mui/material';
import '../PasswordGenerator/PasswordGenerator.css'; // Adjust the path to your CSS file

const PasswordGenerator = () => {
    const [length, setLength] = useState(8);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeLowercase, setIncludeLowercase] = useState(true);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [password, setPassword] = useState('');
    const [securityLevel, setSecurityLevel] = useState('Very Weak');

    useEffect(() => {
        evaluateSecurityLevel();
    }, [length, includeSymbols, includeNumbers, includeLowercase, includeUppercase]);

    const generatePassword = () => {
        const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
        const numbers = '0123456789';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        let characterPool = '';
        if (includeSymbols) characterPool += symbols;
        if (includeNumbers) characterPool += numbers;
        if (includeLowercase) characterPool += lowercase;
        if (includeUppercase) characterPool += uppercase;

        if (characterPool === '') {
            toast.error('Please select at least one option (symbols, numbers, lowercase, uppercase)');
            return;
        }

        let generatedPassword = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterPool.length);
            generatedPassword += characterPool[randomIndex];
        }

        setPassword(generatedPassword);
        evaluateSecurityLevel();
        toast.success('Password generated successfully!');
    };

    const evaluateSecurityLevel = () => {
        let level = 0;
        if (length >= 20) level++;
        if (includeSymbols) level++;
        if (includeNumbers) level++;
        if (includeLowercase) level++;
        if (includeUppercase) level++;

        if (level <= 1) setSecurityLevel('Very Weak');
        else if (level === 2) setSecurityLevel('Weak');
        else if (level === 3) setSecurityLevel('Average');
        else if (level === 4) setSecurityLevel('Strong');
        else setSecurityLevel('Very Strong');
    };

    const handleLengthChange = (e, value) => {
        setLength(value);
    };

    const toggleIncludeSymbols = () => {
        setIncludeSymbols(!includeSymbols);
    };

    const toggleIncludeNumbers = () => {
        setIncludeNumbers(!includeNumbers);
    };

    const toggleIncludeLowercase = () => {
        setIncludeLowercase(!includeLowercase);
    };

    const toggleIncludeUppercase = () => {
        setIncludeUppercase(!includeUppercase);
    };
    function valuetext(value) {
        return `${value}`;
      }
    const copyPassword = () => {
        if (password === '') {
            toast.error('Please generate a password first.');
            return;
        }
        navigator.clipboard.writeText(password);
        toast.success('Password copied to clipboard!');
    };

    return (
        <div className="container">
            <div className="p-3 mt-2 mb-2">
                <div className="card-body">
                    <h1 className='h1-tag'>Smart <span className='green-title-color'> Compressor</span></h1>
                </div>
            </div>
            <ToastContainer />
            <div className="card">
                <div className="card-body">
                    <div className="row mt-4">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="password-length" className='password-length'>Password length:</label>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <Slider
                                    value={length}
                                    aria-label="Always visible"
                                    onChange={handleLengthChange}
                                    aria-labelledby="password-length"
                                    valueLabelDisplay="on"
                                    getAriaValueText={valuetext}
                                    step={1}
                                    min={6}
                                    max={14}
                                />
                                <span className="length-display">{length} characters</span>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label>Options:</label>
                            </div>
                        </div>
                        <div className="col-md-8 col-12">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="include-symbols"
                                    checked={includeSymbols}
                                    onChange={toggleIncludeSymbols}
                                />
                                <label className="form-check-label" htmlFor="include-symbols">Include Symbols (e.g. @#$%)</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="include-numbers"
                                    checked={includeNumbers}
                                    onChange={toggleIncludeNumbers}
                                />
                                <label className="form-check-label" htmlFor="include-numbers">Include Numbers (e.g. 123456)</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="include-lowercase"
                                    checked={includeLowercase}
                                    onChange={toggleIncludeLowercase}
                                />
                                <label className="form-check-label" htmlFor="include-lowercase">Include Lowercase Characters (e.g. abcdefgh)</label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    id="include-uppercase"
                                    checked={includeUppercase}
                                    onChange={toggleIncludeUppercase}
                                />
                                <label className="form-check-label" htmlFor="include-uppercase">Include Uppercase Characters (e.g. ABCDEFGH)</label>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-3 col-12">
                            <div className="form-group">
                                <label>Security level:</label>
                            </div>
                        </div>
                        <div className="col-md-8 col-12">
                            <div className={`security-level ${securityLevel.toLowerCase()}`}>
                                {securityLevel}
                            </div>
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-md-3"></div>
                        <div className="col-md-8 col-12">
                            <button className="btn btn-primary generate-password-btn" onClick={generatePassword}>Generate Password</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <div className="card">
                    <div className="card-body">
                        <div className="row mt-4">
                            <div className="col-md-3 col-12">
                                <div className="form-group">
                                    <label>Your password:</label>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-8">
                                <div className="form-group password-display">
                                    <input
                                        type="text"
                                        value={password}
                                        readOnly
                                        className="form-control password-input"
                                    />
                                </div>
                            </div>
                            <div className="col-md-2 col-sm-4 col-xs-12">
                                <button
                                    className="btn btn-secondary copy-button"
                                    onClick={copyPassword}
                                >
                                    Copy Password
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordGenerator;