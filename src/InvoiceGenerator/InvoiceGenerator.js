import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './InvoiceGenerator.css';

const InvoiceGenerator = () => {
    const [invoiceNumber, setInvoiceNumber] = useState('Invoice #');
    const [logo, setLogo] = useState(null);

    const onDrop = (acceptedFiles) => {
        setLogo(URL.createObjectURL(acceptedFiles[0]));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' });

    useEffect(() => {
        // Clear the logo on page reload
        return () => {
            if (logo) {
                URL.revokeObjectURL(logo);
            }
        };
    }, [logo]);

    const handleInvoiceNumberChange = (e) => {
        setInvoiceNumber(e.target.innerText);
    };

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
            <div className='row'>
                <div className='col-md-9'>
                    <div className="card mt-2">
                        <div className="card-body">
                            <div className="row">
                                <div className='col-md-8'>
                                    <div
                                        className='invoice-number'
                                        contentEditable
                                        suppressContentEditableWarning={true}
                                        onBlur={handleInvoiceNumberChange}
                                        style={{
                                            borderRadius: '.25rem',
                                            padding: '.375rem .75rem',
                                            minHeight: '38px'
                                        }}
                                    >
                                        {invoiceNumber}
                                    </div>
                                </div>
                                <div className='col-md-4'>
                                    <div
                                        {...getRootProps()}
                                        className='dropzone logo-border p-2 mt-1'
                                        style={{ cursor: 'pointer', border: '1px dashed #ced4da', borderRadius: '.25rem' }}
                                    >
                                        <input {...getInputProps()} />
                                        {logo ? (
                                            <img src={logo} alt="Logo" className="uploaded-logo" style={{ width: '100%', height: 'auto' }} />
                                        ) : (
                                            <p>Drag & drop a logo file or click to upload</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-3'>
                    <div className="card mt-2">
                        <div className="card-body">
                            <div className="text-center mb-2">
                                <p>Side Bar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceGenerator;
