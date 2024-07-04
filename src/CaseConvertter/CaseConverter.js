import React, { useState, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CaseConverter.css';

const CaseConverter = () => {
  const [text, setText] = useState('');
  const [convertedText, setConvertedText] = useState('');
  const [selectedConversion, setSelectedConversion] = useState('');
  const convertedTextAreaRef = useRef(null); // Reference to the converted text area

  const txtHandling = (e) => {
    setText(e.target.value);
  };

  const handleConversionChange = (e) => {
    setSelectedConversion(e.target.value);
  };

  const applyConversion = () => {
    let converted = '';
    switch (selectedConversion) {
      case 'uppercase':
        converted = text.toUpperCase();
        break;
      case 'lowercase':
        converted = text.toLowerCase();
        break;
      case 'capitalize':
        converted = text
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        break;
      default:
        converted = text;
    }
    setConvertedText(converted);
  };

  const copyToClipboard = () => {
    if (convertedTextAreaRef.current) {
      convertedTextAreaRef.current.select();
      document.execCommand('copy');
      toast.success('Copied to clipboard!', {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const isConversionSelected = () => {
    return selectedConversion !== '';
  };

  return (
    <>
      <div className="container">
        <ToastContainer />
        <div className="card">
          <div className="card-body">
            <div className="text-center mb-2">
              <h1>Free <span className="text-success">Case Converter Tool</span></h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className='row'>
          <div className='col-md-12'>
            <div className="card mt-2">
              <div className="card-body">
                <div className="row">
                  <div className='col-md-5'>
                    <form>
                      <div className="form-group">
                        <textarea 
                          className="form-control" 
                          id="textInput" 
                          rows={7} 
                          value={text} 
                          onChange={txtHandling} 
                          placeholder="Type here..." 
                        />
                      </div>
                     
                      <button 
                        type="button" 
                        className="btn btn-primary mt-3" 
                        onClick={applyConversion} 
                        disabled={!isConversionSelected()}
                      >
                        Convert Txt
                      </button>
                    </form>
                  </div>
                  <div className='col-md-2'>
                  <div className="form-group mt-4">
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="conversionOptions" 
                            id="uppercase" 
                            value="uppercase" 
                            onChange={handleConversionChange} 
                          />
                          <label className="form-check-label" htmlFor="uppercase">
                            ALL CAPITALIZED
                          </label>
                        </div>
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="conversionOptions" 
                            id="lowercase" 
                            value="lowercase" 
                            onChange={handleConversionChange} 
                          />
                          <label className="form-check-label" htmlFor="lowercase">
                            all minimalized
                          </label>
                        </div>
                        <div className="form-check">
                          <input 
                            className="form-check-input" 
                            type="radio" 
                            name="conversionOptions" 
                            id="capitalize" 
                            value="capitalize" 
                            onChange={handleConversionChange} 
                          />
                          <label className="form-check-label" htmlFor="capitalize">
                            All First Letter Capitalized
                          </label>
                        </div>
                      </div>
                  </div>
                  <div className='col-md-5'>
                    <textarea 
                      className="form-control" 
                      rows={7} 
                      value={convertedText} 
                      readOnly 
                      ref={convertedTextAreaRef} // Reference to the converted text area
                    />
                    <button 
                      type="button" 
                      className="btn btn-secondary mt-3" 
                      onClick={copyToClipboard}
                    >
                      Copy Text
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseConverter;
