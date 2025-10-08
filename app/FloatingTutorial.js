"use client";
import React, { useState, useEffect, useRef } from "react";

const FloatingTutorial = () => {
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const videoRef = useRef(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const timestamps = [
    { label: "Official Links", time: 23 },
    { label: "Make Account on Crypto App", time: 65 },
    { label: "Add Funds in Crypto", time: 103 },
    { label: "Add Funds in VclubShop", time: 124 },
    { label: "Our Services", time: 180 },
  ];

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/login") {
      setShowTutorial(true);
    }
  }, []);

  useEffect(() => {
    if (open && visibleCount < timestamps.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, open]);

  // Inject fadeInUp animation style
  useEffect(() => {
    if (!document.getElementById("fadeInUpStyle")) {
      const styleTag = document.createElement("style");
      styleTag.id = "fadeInUpStyle";
      styleTag.innerHTML = `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);

  if (!showTutorial) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 9999,
      }}
    >
      {!open ? (
        <button
          onClick={() => {
            setOpen(true);
            setVisibleCount(0);
          }}
          style={{
            fontFamily: "monospace",
            fontWeight: "bold",
            backgroundColor: "#f6f8fa",
            color: "#24292f",
            border: "1px solid rgba(27,31,36,0.15)",
            padding: "6px 14px",
            fontSize: "13px",
            borderRadius: "6px",
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            transition: "all 0.2s ease",
          }}
        >
          TUTORIAL
        </button>
      ) : (
        <div
          style={{
            position: "relative",
            width: "320px",
            height: "auto",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 0 20px rgba(0,0,0,0.4)",
            backgroundColor: "#000",
            animation: "fadeInUp 0.4s ease",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <video
            ref={videoRef}
            controls
            autoPlay
            style={{
              width: "100%",
              height: "180px",
              objectFit: "cover",
              background: "#000",
            }}
          >
            <source src="https://keysgen.site/vclub/vclub-full-tutorial.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div
            style={{
              padding: "6px 10px",
              fontSize: "12px",
              color: "#fff",
              background: "#111",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <strong>VClub Tutorial</strong>: Learn how to buy CCs quickly and safely.
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "10px",
              background: "#111",
              gap: "6px",
            }}
          >
            {timestamps.slice(0, visibleCount).map((t) => (
              <button
                key={t.label}
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = t.time;
                    videoRef.current.play();
                  }
                }}
                style={{
                  background: "#444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "6px 10px",
                  fontSize: "12px",
                  cursor: "pointer",
                  width: "100%",
                  animation: "fadeInUp 0.4s ease",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: "5px",
              right: "5px",
              background: "rgba(0, 0, 0, 0.6)",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              padding: "2px 6px",
              fontSize: "12px",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,0,0,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(0,0,0,0.6)";
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default FloatingTutorial;
