"use client";

import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect, useRef } from "react";
import Hover from "./hover/page";
import Head from "next/head"; // Use Head for metadata

const metadata = {
  title: "VClub",
  description:
    "Looking to buy CCs? VClub offers secure and verified CCs at the best prices. Instant delivery and safe transactions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content="Buy CCs, Secure CCs, Best CCs online, Cheap CCs for sale, VClub Shop, Unitedshop, unitedshop.in, nocash.cc" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* OpenGraph for Social Media Sharing */}
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:url" content="https://unitedshop.in" />
        <meta property="og:type" content="website" />
        <link rel="icon" href="" />
      </head>
      <body className="roboto">
        {children}
        <ToastContainer />
        <Hover />
      </body>
    </html>
  );
}
