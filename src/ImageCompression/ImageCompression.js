import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import imageCompression from 'browser-image-compression';

const ImageCompression = () => {
    const [images, setImages] = useState([]);
    const [compressedImages, setCompressedImages] = useState([]);

    const handleImageUpload = (event) => {
        const files = Array.from(event.target.files);
        setImages(files);
    };

    const handleImageCompression = async () => {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
        };

        const compressedFiles = await Promise.all(
            images.map(async (image) => {
                try {
                    const compressedImage = await imageCompression(image, options);
                    return compressedImage;
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
        const url = URL.createObjectURL(image);
        const link = document.createElement('a');
        link.href = url;
        link.download = `compressed-image.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='container'>
            <div className="card">
                <div className="card-body">
                    <div className="p-3 mt-2 mb-2">
                        <div className="card-body">
                            <h1 className='h1-tag'>Secure <span className='green-title-color'> Password Generator</span></h1>
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                    />
                    <button onClick={handleImageCompression}>Compress Images</button>
                    <div>
                        {compressedImages.length > 0 && (
                            <div>
                                <h2>Compressed Images</h2>
                                {compressedImages.map((image, index) => (
                                    <div key={index}>
                                        <p>{image.name}</p>
                                        <button onClick={() => handleImageDownload(image, 'jpg')}>
                                            Download JPG
                                        </button>
                                        <button onClick={() => handleImageDownload(image, 'png')}>
                                            Download PNG
                                        </button>
                                        <button onClick={() => handleImageDownload(image, 'webp')}>
                                            Download WEBP
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default ImageCompression;