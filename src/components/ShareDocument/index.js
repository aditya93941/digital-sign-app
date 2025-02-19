import React, { useState } from 'react';
import Cookies from 'js-cookie';

function ShareDocument({ documentId, onShareSuccess }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const token = Cookies.get('token');

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://digital-signature-app-backend.onrender.com/api/documents/share', {
        method: 'POST',
        credentials: 'include',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ documentId, email }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || 'Error sharing document');
      } else {
        setMessage('Document shared successfully');
        onShareSuccess();
      }
    } catch (err) {
      setMessage('Error sharing document');
    }
  };

  return (
    <div>
      <h3>Share Document</h3>
      {message && <p>{message}</p>}
      <form onSubmit={handleShare}>
        <input 
          type="email" 
          placeholder="Recipient Email" 
          value={email} 
          required 
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Share</button>
      </form>
    </div>
  );
}

export default ShareDocument;
