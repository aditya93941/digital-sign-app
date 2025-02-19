import React, { useRef, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function SignDocument({ documentId, onSignSuccess }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [message, setMessage] = useState('');
  const token = Cookies.get('token');

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // Fill canvas with white background
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    setIsDrawing(false);
  };

  const handleSign = async () => {
    const canvas = canvasRef.current;
    const signatureData = canvas.toDataURL('image/png');
    try {
      const response = await fetch('https://digital-signature-app-backend.onrender.com/api/documents/sign', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ documentId, signature: signatureData }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'Error signing document');
      } else {
        setMessage('Document signed successfully');
        onSignSuccess();
      }
    } catch (err) {
      setMessage('Error signing document');
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div>
      <h3>Sign Document</h3>
      {message && <p>{message}</p>}
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={100} 
        className="signature-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      />
      <div>
        <button onClick={handleSign}>Submit Signature</button>
        <button onClick={handleClear}>Clear</button>
      </div>
    </div>
  );
}

export default SignDocument;
