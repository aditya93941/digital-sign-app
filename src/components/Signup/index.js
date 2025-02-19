import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://digital-signature-app-backend.onrender.com/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Registration failed');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  return (
    <div className="pageWrapper">
      <nav className="navbar">
        <img
          src="https://ik.imagekit.io/ve7kfpijr/rpost_logo-removebg-preview.png?updatedAt=1739940047133"
          alt="Logo"
          className="navbarLogo"
        />
      </nav>

      <main className="signupContent">
        <div className="signupImageContainer">
          <img
            src="https://ik.imagekit.io/ve7kfpijr/digital_signature_img.jpg?updatedAt=1739940026711"
            alt="Digital Signature"
            className="signupImage"
          />
        </div>
        <div className="formWrapper">
          <form onSubmit={handleSubmit} className="signupFormContainer">
            <h1 className="signupHead">Sign Up</h1>
            <input 
              type="email" 
              id="email" 
              placeholder="Enter Email" 
              value={email} 
              required 
              onChange={(e) => setEmail(e.target.value)} 
            />
            <br/>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter Password" 
              value={password} 
              required 
              onChange={(e) => setPassword(e.target.value)} 
            />
            <br/>
            <button type="submit" className="signupButton">Signup</button>
            {error && <p className="errMsg">{error}</p>}
            <p className="accountInfo">
              Already have an account? <a className="loginLink" href="/login">Login here!</a>
            </p>
          </form>
        </div>
      </main>

      <footer className="footerSignup">
        <p>CopyRights@RPost-2025</p>
      </footer>
    </div>
  );
}

export default Signup;
