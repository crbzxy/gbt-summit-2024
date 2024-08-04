"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Home from "./home/page";
import Loader from "./components/Loader"; // Import the Loader component

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State to manage loader visibility

  useEffect(() => {
    const handleNavigation = () => {
      const token = localStorage.getItem("token");
      if (token) {
        const { role } = JSON.parse(atob(token.split(".")[1]));
        setLoading(true); // Show loader before navigation
        if (role === "admin") {
          router.push("/admin"); 
        } else {
          router.push("/live"); 
        }
        setLoading(false); // Hide loader after navigation
      }
    };

    handleNavigation();
  }, [router]);

  return (
    <>
      {loading && <Loader />} {/* Display the loader if loading is true */}
      <Home />
    </>
  );
}
