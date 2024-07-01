import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imageCompression from 'browser-image-compression';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../ImageCompression/ImageCompression.css';

const ImageCompression = () => {
    const [images, setImages] = useState([]);
    const [compressedImages, setCompressedImages] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const [autoConvert, setAutoConvert] = useState(false);
    const [selectedFormats, setSelectedFormats] = useState(['webp', 'jpeg', 'png']);
    const [selectAllChecked, setSelectAllChecked] = useState(false);

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        setImages(files);
        if (autoConvert) {
            await compressImages(files);
        } else {
            previewImages(files);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        setImages(files);
        setDragOver(false);
        if (autoConvert) {
            await compressImages(files);
        } else {
            previewImages(files);
        }
    };

    const previewImages = (files) => {
        const previews = files.map(file => ({
            original: file,
            preview: URL.createObjectURL(file)
        }));
        setCompressedImages(previews);
    };

    const compressImages = async (files) => {
        const options = {
            maxSizeMB: 6,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        const compressedFiles = await Promise.all(
            files.map(async (image) => {
                try {
                    const compressedImage = await imageCompression(image, options);
                    return { original: image, compressed: compressedImage };
                } catch (error) {
                    toast.error(`Failed to compress ${image.name}`);
                    return null;
                }
            })
        );

        setCompressedImages(compressedFiles.filter((file) => file !== null));
        toast.success('Images compressed successfully!');
    };

    const handleImageDownload = (image, format) => {
        const url = URL.createObjectURL(image.compressed);
        const link = document.createElement('a');
        link.href = url;
        link.download = `compressed-image.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const toggleFormat = (format) => {
        setSelectedFormats((prev) => {
            if (prev.includes(format)) {
                return prev.filter((f) => f !== format);
            }
            return [...prev, format];
        });
    };

    const selectAllFormats = () => {
        if (selectAllChecked) {
            setSelectedFormats([]);
            setSelectAllChecked(false);
        } else {
            setSelectedFormats(['webp', 'jpeg', 'png']);
            setSelectAllChecked(true);
        }
    };

    const getFormatExtension = (format) => {
        switch (format) {
            case 'jpeg':
                return 'jpg';
            default:
                return format;
        }
    };

    const getCompressedSizeDifference = (originalSize, compressedSize) => {
        const difference = (originalSize - compressedSize) / 1024; // in KB
        return difference.toFixed(2);
    };

    const getCompressionPercentage = (originalSize, compressedSize) => {
        const percentage = (1 - compressedSize / originalSize) * 100;
        return percentage.toFixed(2);
    };

    return (
        <div className="container mt-5">
            <ToastContainer />
            <div className="card">
                <div className="card-body">
                    <div className="text-center mb-2">
                        <h1>Smart <span className="text-success">Image Compression</span></h1>
                    </div>
                </div>
            </div>
            <div className='mt-3'>
                <div className="card">
                    <div className="card-body">
                        <div
                            className={`upload-area ${dragOver ? 'dragover' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                id="fileInput"
                                style={{ display: 'none' }}
                            />
                            <img src="/upload.png" width={100} alt="Upload Icon" />
                            <h4>Drop your images here!</h4>
                            <p>Up to 20 images, max 6 MB each.</p>
                        </div>
                        <div className="convert-option mt-3">
                            <label className="toggle-switch">
                                <input 
                                    type="checkbox" 
                                    id="autoConvert" 
                                    checked={autoConvert}
                                    onChange={() => setAutoConvert(!autoConvert)}
                                />
                                <span className="slider"></span>
                            </label>
                            <label htmlFor="autoConvert" className="ml-2">Convert my images automatically</label>
                        </div>
                        {autoConvert && (
                            <div className="format-options">
                                <div 
                                    className={`format-option ${selectedFormats.includes('webp') ? 'selected' : ''}`} 
                                    onClick={() => toggleFormat('webp')}
                                >
                                    <div className="text-middle">WebP</div>
                                </div>
                                <div 
                                    className={`format-option ${selectedFormats.includes('jpeg') ? 'selected' : ''}`} 
                                    onClick={() => toggleFormat('jpeg')}
                                >
                                    <div className="text-middle">JPEG</div>
                                </div>
                                <div 
                                    className={`format-option ${selectedFormats.includes('png') ? 'selected' : ''}`} 
                                    onClick={() => toggleFormat('png')}
                                >
                                    <div className="text-middle">PNG</div>
                                </div>
                                <div className="vertical-divider"></div>
                                <div 
                                    className={`format-option select-all ${selectAllChecked ? 'checked' : ''}`}
                                    onClick={selectAllFormats}
                                >
                                    <div className="text-middle">Select All</div>
                                    {selectAllChecked && <i className="fas fa-check"></i>}
                                </div>
                            </div>
                        )}
                        {compressedImages.length > 0 && (
                            <div className="compressed-images mt-3">
                                <h2 className="h4">Compressed Images</h2>
                                <ul className="list-group">
                                    {compressedImages.map((image, index) => (
                                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="image-info d-flex align-items-center">
                                                <img src={image.preview || URL.createObjectURL(image.original)} alt="Original" className="img-thumbnail mr-3" width={50} height={50} />
                                                <div>
                                                    <p className="mb-0 font-weight-bold">{image.original.name}</p>
                                                    <p className="mb-0 text-muted">Original size: {(image.original.size / 1024).toFixed(2)} KB</p>
                                                </div>
                                            </div>
                                            <div className="d-flex">
                                                {image.compressed && selectedFormats.map((format) => (
                                                    <div key={format} className="d-flex flex-column align-items-center mx-2">
                                                        <button 
                                                            className="btn btn-secondary mb-1"
                                                            onClick={() => handleImageDownload(image, format)}
                                                        >
                                                            {format.toUpperCase()}
                                                        </button>
                                                        <span className="text-muted">{getCompressionPercentage(image.original.size, image.compressed.size)}%</span>
                                                        <span className="text-muted">{(image.compressed.size / 1024).toFixed(2)} KB</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCompression;
