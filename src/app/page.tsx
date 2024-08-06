'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Home from './home/page';
import Loader from './components/Loader'; // Import the Loader component
import Navbar from './components/NavBar'; // Import the Navbar component
import Register from './registro/page'; // Import the Register component
//import PonentesPage from "./components/Ponentes";
import Agenda from './components/Agenda';
import Footer from './components/Footer';
import Vista from './vista/page';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // State to manage loader visibility

  useEffect(() => {
    const handleNavigation = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const { role } = JSON.parse(atob(token.split('.')[1]));
        setLoading(true); // Show loader before navigation
        if (role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/live');
        }
        setLoading(false); // Hide loader after navigation
      }
    };

    handleNavigation();
  }, [router]);

  return (
    <>
      {/*<Navbar />  Use the Navbar component here */}
     {/* {loading && <Loader />}  Display the loader if loading is true */}
     {/* <Home />*/}
     {/* <Register />*/}
      {/*<PonentesPage />*/}
     {/* <Agenda />*/}
     {/* <Footer />*/}
      <Vista />
    </>
  );
}
