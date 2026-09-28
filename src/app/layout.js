"use client"

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar";
import Footer from "./components/Footer";
import { NotesProvider } from "@/app/context/NotesContext";
import { ClerkProvider } from "@clerk/nextjs";


//Estas son lad fuentes, para que todo el project tenga la misma fuente
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <ClerkProvider>
      <body className="min-h-full flex flex-col">        
          <NotesProvider>
            <Navbar />
          </NotesProvider>

          {children}
        
        <Footer />

      </body>
      </ClerkProvider>
    </html>
  );
}
