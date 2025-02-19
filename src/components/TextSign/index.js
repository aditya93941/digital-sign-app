import React, { useState } from 'react';
import Cookies from 'js-cookie';
import './index'

function TextSign({ documentId, onSignSuccess }) {
  const [textSignature, setTextSignature] = useState('');
  const [message, setMessage] = useState('');
  const token = Cookies.get('token');

  const handleSign = async () => {
    try {
      const response = await fetch('https://digital-signature-app-backend-1.onrender.com/api/documents/sign-text', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ documentId, textSignature }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'Error signing document');
      } else {
        setMessage('Document signed successfully with text signature');
        onSignSuccess();
      }
    } catch (err) {
      setMessage('Error signing document');
    }
  };

  return (
    <div>
      <h3>Text Signature</h3>
      {message && <p>{message}</p>}
      <input 
        type="text" 
        placeholder="Enter your signature text" 
        value={textSignature}
        className='textInput'
        onChange={(e) => setTextSignature(e.target.value)}
      />
      <button onClick={handleSign}>Submit Text Signature</button>
    </div>
  );
}

export default TextSign;
