import React from 'react';

const FloatingLoader = ({ message = 'Sending your request...', visible = true }) => {
  if (!visible) return null;

  const style = `
    .loading-bar {
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #1ca8dd;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: sans-serif;
      font-size: 14px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
      z-index: 9999;
    }

    .bar {
      display: flex;
      gap: 2px;
      margin-right: 10px;
    }

    .po {
      width: 6px;
      height: 16px;
      background: #a2e9ff;
      animation: pulse 1.2s infinite ease-in-out;
    }

    .po:nth-child(odd) {
      background: #62d3f7;
    }

    .po:nth-child(even) {
      animation-delay: 0.2s;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.3;
        transform: scaleY(1);
      }
      50% {
        opacity: 1;
        transform: scaleY(1.8);
      }
    }
  `;

  return (
    <>
      <style>{style}</style>
      <div className="loading-bar">
        <div className="bar">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="block po" />
          ))}
        </div>
        {message}
      </div>
    </>
  );
};

export default FloatingLoader;
