import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import UploadDocument from '../UploadDocument';
import SignDocument from '../SignDocument';
import TextSign from '../TextSign';
import './index.css';

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState('');
  // modalData is used for Download, Share, and initial signature selection
  const [modalData, setModalData] = useState(null);
  // signMode will be either 'freehand' or 'text' to show the signing pop-up modal
  const [signMode, setSignMode] = useState(null);
  // Store the selected document id for signing
  const [selectedSignDocId, setSelectedSignDocId] = useState(null);

  const token = Cookies.get('token'); // Retrieve token from cookie
  const isMobile = window.innerWidth <= 480;

  const fetchDocuments = async () => {
    try {
      const response = await fetch('https://digital-signature-app-backend.onrender.com/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Error fetching documents');
      } else {
        setDocuments(data.documents);
      }
    } catch (err) {
      setError('Error connecting to server');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUploadSuccess = () => {
    fetchDocuments();
  };

  const handleDelete = async (documentId) => {
    try {
      const response = await fetch(`https://digital-signature-app-backend.onrender.com/api/documents/${documentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) {
        alert('Error deleting document: ' + (data.message || 'Unknown error'));
      } else {
        alert('Document deleted successfully');
        fetchDocuments();
      }
    } catch (err) {
      alert('Error deleting document');
    }
  };

  const scrollToUpload = () => {
    const uploadSection = document.getElementById('uploadSection');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Logout function: Remove token and redirect
  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  // Modal handlers for Digital Signature selection
  const handleFreehandSignature = () => {
    if (!modalData.selectedDocId) {
      alert("Please select a document.");
      return;
    }
    setSelectedSignDocId(modalData.selectedDocId);
    setModalData(null);
    setSignMode('freehand');
  };

  const handleTextSignature = () => {
    if (!modalData.selectedDocId) {
      alert("Please select a document.");
      return;
    }
    setSelectedSignDocId(modalData.selectedDocId);
    setModalData(null);
    setSignMode('text');
  };

  // Modal handler for Download action
  const handleDownloadFromModal = async () => {
    if (!modalData.selectedDocId) {
      alert("Please select a document.");
      return;
    }
    try {
      const response = await fetch(`https://digital-signature-app-backend.onrender.com/api/documents/download/${modalData.selectedDocId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        alert("Error downloading file");
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setModalData(null);
      }
    } catch (err) {
      alert("Error downloading file");
    }
  };

  // Modal handler for WhatsApp Share action
  const handleShareFromModal = () => {
    if (!modalData.selectedDocId) {
      alert("Please select a document.");
      return;
    }
    // Find the document by its id
    const doc = documents.find(d => d.id === parseInt(modalData.selectedDocId));
    if (!doc) {
      alert("Document not found");
      return;
    }
    const fileName = doc.signedPath ? doc.signedPath : doc.storagePath;
    // Construct public URL for the document (adjust host as needed)
    const documentUrl = `https://digital-signature-app-backend.onrender.com/uploads/${fileName}`;
    const message = encodeURIComponent(`Check out this document: ${documentUrl}`);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setModalData(null);
  };

  return (
    <div className="pageWrapper">
      {/* Navbar */}
      <nav className="navbar">
        <img
          src="https://ik.imagekit.io/ve7kfpijr/rpost_logo-removebg-preview.png?updatedAt=1739940047133"
          alt="Logo"
          className="navbarLogo"
        />
        <div className="navLinks">
          <a href="/dashboard">Home</a>
          <a className="logoutButton" href="#" onClick={handleLogout}>Logout</a>
        </div>
      </nav>

      <div className="mainContainer">
        {/* Quick Actions Section */}
        <div className="quickActions">
          <div className="actionContainer" onClick={scrollToUpload}>
            <img src="https://ik.imagekit.io/ve7kfpijr/upload-removebg-preview.png" alt="Upload Document" />
            <p>UPLOAD DOCUMENT</p>
          </div>
          <div className="actionContainer" onClick={() => {
            if (documents.length === 0) {
              alert("No documents available. Please upload a document first.");
            } else {
              setModalData({ type: 'signature', selectedDocId: '' });
            }
          }}>
            <img src="https://ik.imagekit.io/ve7kfpijr/sign_img-removebg-preview.png" alt="Digital Signature" />
            <p>DIGITAL SIGNATURE</p>
          </div>
          <div className="actionContainer" onClick={() => {
            if (documents.length === 0) {
              alert("No documents available. Please upload a document first.");
            } else {
              setModalData({ type: 'download', selectedDocId: '' });
            }
          }}>
            <img src="https://ik.imagekit.io/ve7kfpijr/download_img-removebg-preview.png" alt="Download Document" />
            <p>DOWNLOAD DOCUMENT</p>
          </div>
          <div className="actionContainer" onClick={() => {
            if (documents.length === 0) {
              alert("No documents available. Please upload a document first.");
            } else {
              setModalData({ type: 'share', selectedDocId: '' });
            }
          }}>
            <img src="https://ik.imagekit.io/ve7kfpijr/share_img-removebg-preview.png" alt="Share Document" />
            <p>SHARE DOCUMENT</p>
          </div>
        </div>

        {error && <p className="errMsg">{error}</p>}

        {/* Modal for Download/Share/Signature Selection */}
        {modalData && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h3>
                {modalData.type === 'signature' && "Select Document for Digital Signature"}
                {modalData.type === 'download' && "Select Document to Download"}
                {modalData.type === 'share' && "Select Document to Share"}
              </h3>
              <select
                value={modalData.selectedDocId}
                onChange={(e) =>
                  setModalData({ ...modalData, selectedDocId: e.target.value })
                }
              >
                <option value="" disabled>-- Select Document --</option>
                {documents.map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.originalName}</option>
                ))}
              </select>
              <div className="modalButtons">
                {modalData.type === 'signature' && (
                  <>
                    <button onClick={handleFreehandSignature}>Freehand</button>
                    <button onClick={handleTextSignature}>Text Signature</button>
                  </>
                )}
                {modalData.type === 'download' && (
                  <button onClick={handleDownloadFromModal}>Download</button>
                )}
                {modalData.type === 'share' && (
                  <button onClick={handleShareFromModal}>Share via WhatsApp</button>
                )}
                <button onClick={() => setModalData(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Sign Components (Freehand or Text) */}
        {signMode && (
          <div className="modalOverlay">
            <div className="modalContent">
              <h3>{signMode === 'freehand' ? "Freehand Signature" : ""}</h3>
              {signMode === 'freehand' ? (
                <SignDocument
                  documentId={selectedSignDocId}
                  onSignSuccess={() => {
                    fetchDocuments();
                    setSignMode(null);
                    setSelectedSignDocId(null);
                  }}
                />
              ) : (
                <TextSign
                  documentId={selectedSignDocId}
                  onSignSuccess={() => {
                    fetchDocuments();
                    setSignMode(null);
                    setSelectedSignDocId(null);
                  }}
                />
              )}
              <button onClick={() => {
                setSignMode(null);
                setSelectedSignDocId(null);
              }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Upload Document Area */}
        <div id="uploadSection">
          <UploadDocument onUploadSuccess={handleUploadSuccess} />
        </div>

        <h3 className="headDoc">Your Documents</h3>
        {documents.map(doc => (
          <div key={doc.id} className="document-item">
            <span className="documentName">{doc.originalName} - {doc.status}</span>
            <button className="deleteButton" onClick={() => handleDelete(doc.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="footerLogin">
        <p>CopyRights@RPost-2025</p>
      </footer>
    </div>
  );
}

export default Dashboard;
