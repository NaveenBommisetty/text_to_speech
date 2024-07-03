import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../ImageCompression/ImageCompression.css';

const ImageCompression = () => {
    const [images, setImages] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const [autoConvert, setAutoConvert] = useState(false); // Initially false
    const [selectedFormats, setSelectedFormats] = useState([]);
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // Progress bar for upload

    useEffect(() => {
        if (selectedFormats.length === 3) {
            setSelectAllChecked(true);
        } else {
            setSelectAllChecked(false);
        }
    }, [selectedFormats]);

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files).slice(0, 20); // Limit to 20 images

        // Display loader while uploading
        const totalFiles = files.length;
        let uploadedFiles = 0;

        for (const image of files) {
            try {
                setUploadProgress(0);
                const options = {
                    maxSizeMB: 5,
                    maxWidthOrHeight: 1920,
                    useWebWorker: true,
                    maxIteration: 10,
                    initialQuality: 0.8,
                    alwaysKeepResolution: true,
                    onProgress: (progress) => setUploadProgress(progress),
                };

                const compressedWebp = await imageCompression(image, {
                    ...options,
                    fileType: 'image/webp',
                });
                const compressedJpeg = await imageCompression(image, {
                    ...options,
                    fileType: 'image/jpeg',
                });
                const compressedPng = await imageCompression(image, {
                    ...options,
                    fileType: 'image/png',
                });

                const preview = URL.createObjectURL(image);

                const compressedImage = {
                    original: image,
                    compressed: {
                        webp: compressedWebp,
                        jpeg: compressedJpeg,
                        png: compressedPng,
                    },
                    preview,
                    initialFormat: image.type.split('/')[1], // Store initial image format
                };

                setImages((prevImages) => [...prevImages, compressedImage]);
                toast.success(`Image ${image.name} compressed successfully!`);
            } catch (error) {
                toast.error(`Failed to compress ${image.name}`);
            } finally {
                uploadedFiles++;
                const progress = Math.round((uploadedFiles / totalFiles) * 100);
                setUploadProgress(progress);
            }
        }

        setTimeout(() => {
            setUploadProgress(0);
        }, 1000); // Hide progress bar after 1 second
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
        const files = Array.from(event.dataTransfer.files).slice(0, 20); // Limit to 20 images
        setDragOver(false);
        await handleImageUpload({ target: { files } });
    };

    const handleImageDownload = (image, format) => {
        const compressedImage = image.compressed[format];
        if (!compressedImage) {
            toast.error(`No ${format.toUpperCase()} format available for download.`);
            return;
        }
        const url = URL.createObjectURL(compressedImage);
        const link = document.createElement('a');
        link.href = url;
        let imageName = image.original.name;
        let imageNameFirstPart = imageName.substring(0, imageName.indexOf('.'));
        link.download = `${imageNameFirstPart}.${format}`;
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

    const handleDownloadAll = async () => {
        if (images.length === 0) {
            toast.error('No images to download.');
            return;
        }
    
        const zip = new JSZip();
        const promises = [];
    
        images.forEach((image, index) => {
            selectedFormats.forEach((format) => {
                const compressedImage = image.compressed[format];
                if (compressedImage) {
                    const promise = compressedImage.arrayBuffer().then((buffer) => {
                        zip.file(`${image.original.name.replace(/\.[^/.]+$/, '')}.${format}`, buffer);
                    });
                    promises.push(promise);
                }
            });
        });
    
        await Promise.all(promises);
        zip.generateAsync({ type: 'blob' }).then((content) => {
            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'compressed-images.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };
    

    const getCompressionPercentage = (originalSize, compressedSize) => {
        if (originalSize > 0 && compressedSize > 0) {
            const percentage = (1 - compressedSize / originalSize) * 100;
            return percentage.toFixed(2);
        }
        return '-';
    };

    const showDownloadOptions = (image) => {
        const originalFormat = image.initialFormat.toLowerCase();
        //const originalSizeKB = (image.original.size / 1024).toFixed(2);
        const compressedSizeKB = (image.compressed[originalFormat]?.size / 1024).toFixed(2);
        const compressionPercentage = getCompressionPercentage(image.original.size, image.compressed[originalFormat]?.size);
    

        return (
            <div className="d-flex">
            <div key={originalFormat} className="d-flex flex-column align-items-center mx-2">
                <button
                    className="btn image-format-btn mb-1"
                    onClick={() => handleImageDownload(image, originalFormat)}
                >
                    {originalFormat.toUpperCase()}
                </button>
                {compressedSizeKB && (
                    <>
                        <span className="text-muted txt-green">{compressedSizeKB} KB</span>
                        <span className="text-muted txt-green">{compressionPercentage}%</span>
                    </>
                )}
            </div>
            {autoConvert && selectedFormats.map((format) => {
                if (format === originalFormat) return null; // Skip if it's the original format

                const compressedSizeKB = image.compressed[format] && (image.compressed[format].size / 1024).toFixed(2);
                const compressionPercentage = image.compressed[format] && getCompressionPercentage(image.original.size, image.compressed[format].size);

                return (
                    <div key={format} className="d-flex flex-column align-items-center mx-2">
                        <button
                            className="btn image-format-btn mb-1"
                            onClick={() => handleImageDownload(image, format)}
                        >
                            {format.toUpperCase()}
                        </button>
                        {compressedSizeKB && (
                            <>
                                <span className="text-muted txt-green">{compressedSizeKB} KB</span>
                                <span className="text-muted txt-green">{compressionPercentage}%</span>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
        );
    };

    return (
        <div className="container">
            <ToastContainer />
            <div className="card">
                <div className="card-body">
                    <div className="text-center mb-2">
                        <h1>Smart <span className="text-success">Image Compression</span></h1>
                    </div>
                </div>
            </div>
            <div className="mt-3">
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
                                onChange={handleImageUpload}
                                id="fileInput"
                                style={{ display: 'none' }}
                                multiple
                            />
                            <img src="/upload.png" width={100} alt="Upload Icon" />
                            <h4>Drop your images here!</h4>
                            <p>Up to 20 images, max 5 MB each. (upload only webp, png or jpeg images)</p>
                            {uploadProgress > 0 && uploadProgress < 100 && (
                                <div className="progress mt-3">
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style={{ width: `${uploadProgress}%` }}
                                        aria-valuenow={uploadProgress}
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                    >
                                        {uploadProgress}%
                                    </div>
                                </div>
                            )}
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
                            <label htmlFor="autoConvert" className="ml-2">
                                Convert my images automatically
                            </label>
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
                                    <div className="text-middle">
                                        {selectAllChecked ? 'Unselect All' : 'Select All'}
                                    </div>
                                    {selectAllChecked && <i className="fas fa-check"></i>}
                                </div>
                            </div>
                        )}
                        {images.length > 0 && (
                            <div className="compressed-images mt-3">
                                <h2 className="h4 left-txt">Compressed Images</h2>
                                <ul className="list-group">
                                    {images.map((image, index) => (
                                        <li
                                            key={index}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            <div className="image-info d-flex align-items-center">
                                                <img
                                                    src={image.preview}
                                                    alt="Original"
                                                    className="img-thumbnail mr-3"
                                                    width={50}
                                                    height={50}
                                                />
                                                <div className="img-txt">
                                                    <p className="mb-0 font-weight-bold">{image.original.name}</p>
                                                    <p className="mb-0 text-muted">
                                                        {(image.original.size / 1024).toFixed(2)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            {showDownloadOptions(image)}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-3">
                                    <button className="btn btn-success" onClick={handleDownloadAll}>
                                        Download All
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCompression;
