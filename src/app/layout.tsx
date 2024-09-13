"use client"; // Esto indica que es un componente del lado del cliente

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script"; // Importamos el componente Script de Next.js
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

let metadata: Metadata = {
  title: "Amex GBT Summit 2024",
  description: "Amex GBT Summit 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-mx">
      <head>
        {/* Google Analytics Tag */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-NYWPJ79YRE`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NYWPJ79YRE');
            `,
          }}
        />
{/* Google tag (gtag.js) */}

      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
