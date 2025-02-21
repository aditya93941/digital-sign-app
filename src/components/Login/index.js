import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import './index.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://digital-signature-app-backend.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login failed');
      } else {
        Cookies.set('token', data.token, { expires: 1 });
        onLogin && onLogin(data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  return (
    <div className="pageWrapper">
      <nav className="navbarLogin">
        <img
          src="https://ik.imagekit.io/ve7kfpijr/rpost_logo-removebg-preview.png?updatedAt=1739940047133"
          alt="Logo"
          className="navbarLogo"
        />
      </nav>

      <main className="loginContent">
        <div className="loginImageContainer">
          <img
            src="https://ik.imagekit.io/ve7kfpijr/digital_signature_img.jpg?updatedAt=1739940026711"
            alt="Digital Signature"
            className="loginImage"
          />
        </div>
        <div className="formWrapper">
          <form onSubmit={handleSubmit} className="formContainer">
            <h1 className="loginHead">Login</h1>
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
            <button type="submit" className="loginButton">Login</button>
            {error && <p className="errMsg">{error}</p>}
            <p className="login">
              Don't have an account? <a className="loginSpan" href="/signup">Join us!</a>
            </p>
          </form>
        </div>
      </main>

      <footer className="footerLogin">
        <p>CopyRights@RPost-2025</p>
      </footer>
    </div>
  );
}

export default Login;
