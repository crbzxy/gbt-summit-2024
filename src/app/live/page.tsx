'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserPage() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función de logout
  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    const logoutToken = localStorage.getItem('logoutToken');

    if (!token || !logoutToken) {
      console.error('Token o logoutToken no están disponibles');
      return;
    }

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar el token al encabezado
        },
        body: JSON.stringify({ logoutToken }),
      });
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      // Eliminar los tokens del localStorage y redirigir
      localStorage.removeItem('token');
      localStorage.removeItem('logoutToken');
      setTimeout(() => {
        router.replace('/');
      }, 100); // Pequeño retraso de 100ms
    }
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/');
      }
    };

    checkAuth();
  }, [router]);

  // Función para alternar la visibilidad del dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Función para alternar la visibilidad del menú móvil
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='min-h-full'>
      {/* Barra de navegación */}
      <nav className='bg-white'>
        <div className='mx-auto w-full px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center'>
              <img
                className='h-10 w-auto'
                src='/logo.png'
                alt='Logo de la Empresa'
              />
            </div>

            <div className='hidden md:block'>
              <div className='ml-4 flex items-center md:ml-6'>
                <button
                  type='button'
                  className='relative flex items-center justify-center p-2 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                  id='user-menu-button'
                  aria-expanded='false'
                  aria-haspopup='true'
                  onClick={toggleDropdown}>
                  <span className='sr-only'>Open user menu</span>
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth='2'
                    stroke='blue'
                    aria-hidden='true'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4 6h16M4 12h16m-7 6h7'
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div
                    className='absolute right-0 z-10 w-48 origin-top-right rounded-md bg-white py-1 mt-20 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                    role='menu'
                    aria-orientation='vertical'
                    aria-labelledby='user-menu-button'
                    tabIndex={-1}>
                    <Link
                      href='#'
                      className='block px-4 py-2 text-sm text-gray-700'
                      role='menuitem'
                      tabIndex={-1}
                      id='user-menu-item-2'
                      onClick={handleLogout}>
                      Cerrar Sesión
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className='-mr-2 flex md:hidden'>
              <button
                type='button'
                className='inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                aria-controls='mobile-menu'
                aria-expanded={isMenuOpen ? 'true' : 'false'}
                onClick={toggleMobileMenu}>
                <span className='sr-only'>Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4 6h16M4 12h16m-7 6h7'
                  />
                </svg>
                <svg
                  className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className='md:hidden' id='mobile-menu'>
            <div className='space-y-1 px-2 pb-3 pt-2 sm:px-3'>
              <Link
                href='#'
                className='block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                onClick={handleLogout}>
                Cerrar Sesión
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className='bg-gray-100'>
        <div className='mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6'>
          <div className='relative w-full h-4/5 overflow-hidden bg-white shadow-lg rounded-lg' style={{ padding: '46.25% 0 0 0', position: 'relative' }}>
            <iframe
              title='gbt-summit'
              src="https://vimeo.com/event/4499457/embed/0800326aa0/interaction"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
}
