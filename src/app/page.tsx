"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Home from "@/app/home/page";
import Loader from "@/app/components/Loader";
import Navbar from "@/app/components/NavBar";
import Register from "@/app/registro/page";
import PonentesPage from "@/app/components/Ponentes";
import Agenda from "@/app/components/Agenda";
import Footer from "@/app/components/Footer";

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
