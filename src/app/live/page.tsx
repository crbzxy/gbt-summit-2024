'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function UserPage() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Función mejorada para cerrar sesión
  const handleLogout = async () => {
    try {
      // Opcionalmente, puedes hacer una llamada a la API para invalidar el token en el servidor
      // await fetch('/api/logout', { method: 'POST' });

      // Elimina el token del almacenamiento local
      localStorage.removeItem('token');
      
      // Cierra el dropdown y el menú móvil
      setShowDropdown(false);
      setIsMenuOpen(false);

      // Redirige al usuario a la página de inicio de sesión
      router.push('/login');
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
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

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleMobileMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className='min-h-full'>
      {/* Barra de navegación */}
      <nav className='bg-white'>
        <div className='mx-auto w-full px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center'>
              <Image
                src='/logo.svg'
                alt='Logo de la Empresa'
                width={40}
                height={40}
                className='h-10 w-auto'
              />
            </div>

            <div className='hidden md:block'>
              <div className='ml-4 flex items-center md:ml-6'>
                <button
                  type='button'
                  className='relative flex items-center justify-center p-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  id='user-menu-button'
                  aria-expanded={showDropdown}
                  aria-haspopup='true'
                  onClick={toggleDropdown}
                >
                  <span className='sr-only'>Open user menu</span>
                  <svg
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    aria-hidden='true'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6h16M4 12h16m-7 6h7'
                    />
                  </svg>
                </button>

                {showDropdown && (
                  <div
                    className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
                    role='menu'
                    aria-orientation='vertical'
                    aria-labelledby='user-menu-button'
                    tabIndex={-1}
                  >
                    <button
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      role='menuitem'
                      tabIndex={-1}
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className='-mr-2 flex md:hidden'>
              <button
                type='button'
                className='inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                aria-controls='mobile-menu'
                aria-expanded={isMenuOpen}
                onClick={toggleMobileMenu}
              >
                <span className='sr-only'>Open main menu</span>
                <svg
                  className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  aria-hidden='true'
                >
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
                  aria-hidden='true'
                >
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
              <button
                className='block w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
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