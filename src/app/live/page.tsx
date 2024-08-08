'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Agenda from '../components/Agenda';
import Link from 'next/link';

export default function UserPage() {
  const router = useRouter();

  // Estado para mostrar el dropdown del menú de usuario
  const [showDropdown, setShowDropdown] = useState(false);

  // Función de logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token de localStorage
    setTimeout(() => {
      router.replace('/'); // Reemplaza '/login' con tu ruta de inicio si es diferente
    }, 100); // Pequeño retraso de 100ms
  };

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/'); // Reemplaza '/login' con tu ruta de inicio si es diferente
      }
    };

    checkAuth();
  }, [router]);

  // Función para alternar la visibilidad del dropdown
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className='min-h-full'>
      {/* Barra de navegación */}
      <nav className='bg-white'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo de la empresa */}
            <div className='flex items-center'>
              <img
                className='h-10 w-auto'
                src='/logo.png'
                alt='Logo de la Empresa'
              />
            </div>

            {/* Navegación */}
            <div className='hidden md:block'>
              <div className='ml-10 flex items-baseline space-x-4'>
                <Link
                  href='#'
                  className='rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white'
                  aria-current='page'>
                  Evento
                </Link>

                <Link
                  href='#agenda'
                  className='rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
                  Agenda
                </Link>
              </div>
            </div>

            {/* Menú de Usuario */}
            <div className='hidden md:block'>
              <div className='ml-4 flex items-center md:ml-6'>
                {/* Botón para abrir el menú de usuario */}
                <button
                  type='button'
                  className='relative flex items-center justify-center rounded-full bg-gray-800 p-2 text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
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
                    stroke='currentColor'
                    aria-hidden='true'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4 6h16M4 12h16m-7 6h7'
                    />
                  </svg>
                </button>

                {/* Dropdown menu */}
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
                      onClick={handleLogout} // Cerrar sesión
                    >
                      Cerrar Sesión
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Botón del menú móvil */}
            <div className='-mr-2 flex md:hidden'>
              <button
                type='button'
                className='inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                aria-controls='mobile-menu'
                aria-expanded='false'>
                <span className='sr-only'>Open main menu</span>
                <svg
                  className='block h-6 w-6'
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
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state. */}
        <div className='md:hidden' id='mobile-menu'>
          <div className='space-y-1 px-2 pb-3 pt-2 sm:px-3'>
            <Link
              href='#'
              className='block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white'
              aria-current='page'>
              Dashboard
            </Link>
            <Link
              href='#'
              className='block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
              Team
            </Link>
            <Link
              href='#'
              className='block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
              Projects
            </Link>
            <Link
              href='#'
              className='block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
              Calendar
            </Link>
            <Link
              href='#'
              className='block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white'>
              Reports
            </Link>
          </div>
          <div className='border-t border-gray-700 pb-3 pt-4'>
            <div className='flex items-center px-5'>
              <div className='flex-shrink-0'>
                <img
                  className='h-10 w-10 rounded-full'
                  src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
                  alt=''
                />
              </div>
              <div className='ml-3'>
                <div className='text-base font-medium leading-none text-white'>
                  Tom Cook
                </div>
                <div className='text-sm font-medium leading-none text-gray-400'>
                  tom@example.com
                </div>
              </div>
              <button
                type='button'
                className='ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'>
                <span className='sr-only'>View notifications</span>
                <svg
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  aria-hidden='true'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0'
                  />
                </svg>
              </button>
            </div>
            <div className='mt-3 space-y-1 px-2'>
              <Link
                href='#'
                className='block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white'
                onClick={handleLogout} // Cerrar sesión
              >
                Sign out
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <main className='bg-gray-100'>
        <div className='mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-6'>
          {/* Video */}
          <div className='relative w-full overflow-hidden bg-white shadow-lg rounded-lg' style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
            <iframe
              src="https://vimeo.com/event/4494599/embed/a839373f58/interaction"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}
            ></iframe>
          </div>

          {/* Agenda */}
          <Agenda />
        </div>
      </main>
    </div>
  );
}
