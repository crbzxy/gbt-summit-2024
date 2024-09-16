"use client";

import { useState, useEffect } from "react";
import FullScreenLoader from "./components/FullScreenLoader";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 20);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <FullScreenLoader />}
      {children}
    </>
  );
}