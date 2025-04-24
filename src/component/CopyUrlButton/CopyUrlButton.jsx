// CopyUrlButton.jsx
import React, { useState } from 'react';
import './CopyUrlButton.css';

const CopyUrlButton = ({ url }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="copy-container">
      <input
        type="text"
        value={url}
        readOnly
        className="copy-input"
      />
      <button
        onClick={handleCopy}
        className="copy-button"
      >
        {copied ? 'Copied!' : 'Copy URL'}
      </button>
    </div>
  );
};

export default CopyUrlButton;
