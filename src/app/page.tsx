"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Home from "./home/page";
import Loader from "./components/Loader";
import Navbar from "./components/NavBar";
import Register from "./registro/page";
import PonentesPage from "./components/Ponentes";
import Agenda from "./components/Agenda";
import Footer from "./components/Footer";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const { role } = JSON.parse(atob(token.split(".")[1]));

      // Usamos window.location.pathname para obtener la ruta actual
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        setLoading(true);
        if (role === "admin") {
          router.push("/admin");
        } else {
          router.push("/live");
        }
        setLoading(false);
      }
    }
  }, [router]);

  return (
    <>
      <Navbar />
      {loading && <Loader />}
      <Home />
      <Register />
      <PonentesPage />
      <Agenda />
      <Footer />
    </>
  );
}
