import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import React from 'react'

export const metadata = {
  title: "Website Clone",
  description: "Recreated with React and GSAP",
  generator: "v0.app",
}

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      {children}
    </div>
  );
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
