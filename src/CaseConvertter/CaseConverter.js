import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './CaseConverter';

const CaseConverter = () => {
    return (
        <div className="container">
            <ToastContainer />
            <div className="card">
                <div className="card-body">
                    <div className="text-center mb-2">
                        <h1>Free  <span className="text-success">Case Converter Tool</span></h1>
                    </div>
                </div>
            </div>
        </div>

)
}
export default CaseConverter;