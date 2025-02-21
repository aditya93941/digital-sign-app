import React, { useRef, useState } from 'react';
import Cookies from 'js-cookie';

function UploadDocument({ onUploadSuccess }) {
  const [message, setMessage] = useState('');
  const token = Cookies.get('token');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    try {
      const response = await fetch('https://digital-signature-app-backend.onrender.com/api/documents/upload', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'Upload failed');
      } else {
        setMessage('Upload successful');
        onUploadSuccess();
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    } catch (err) {
      setMessage('Error uploading file');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div 
      className="uploadContainer" 
      onDragOver={handleDragOver} 
      onDrop={handleDrop}
    >
      <div className="uploadImage"></div>
      <div className="uploadContent">
        <div className="uploadText">DRAG AND DROP DOCUMENT HERE TO UPLOAD</div>
        <button className="selectButton" onClick={handleButtonClick}>
          SELECT FROM DEVICE
        </button>
        <input 
          type="file" 
          accept="application/pdf" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          onChange={handleFileChange} 
        />
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default UploadDocument;
