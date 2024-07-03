import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InvoiceGenerator';

const InvoiceGenerator = () => {
    return (
        <div className="container">
            <ToastContainer />
            <div className="card">
                <div className="card-body">
                    <div className="text-center mb-2">
                        <h1>Free Online <span className="text-success">Invoice Generator</span></h1>
                    </div>
                </div>
            </div>
            <div className="card mt-2">
                <div className="card-body">
                    <div className="text-center mb-2">
                        <p>Om</p>
                    </div>
                </div>
            </div>
        </div>

)
}
export default InvoiceGenerator;