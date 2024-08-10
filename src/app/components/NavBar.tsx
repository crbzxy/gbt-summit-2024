// components/Navbar.tsx

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // Nueva función para cerrar el menú
    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <header className="bg-white shadow-md fixed w-full z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-evenly">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Image src="/logo.svg" alt="American Express Logo" width={120} height={40} />
                    </div>

                    {/* Botón del Menú para Móviles */}
                    <div className="absolute inset-y-0 right-0 flex items-center lg:hidden">
                        <button
                            onClick={toggleMenu}
                            className="relative inline-flex items-center justify-center rounded-md p-2 text-blue-400 hover:bg-blue-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>

                    {/* Menú de Navegación */}
                    <nav className="hidden lg:flex items-center justify-center ">
                        <ul className="flex space-x-8">
                            <li>
                                <Link href="#registro" className="text-blue-600 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-xl text-sm font-medium">
                                    Registro
                                </Link>
                            </li>
                            <li>
                                <Link href="#panelistas" className="text-blue-600 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-xl text-sm font-medium">
                                    Panelistas
                                </Link>
                            </li>
                            <li>
                                <Link href="#agenda" className="text-blue-600 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-xl text-sm font-medium">
                                    Agenda
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="bg-blue-600 text-white hover:bg-blue-500 px-6 py-2 rounded-xl text-sm font-medium transition duration-300">
                                    Login
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Menú Móvil */}
            {isOpen && (
                <div className="lg:hidden" id="mobile-menu">
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <Link href="#registro" className="block text-blue-600 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-xl text-base font-medium" onClick={closeMenu}>
                            Registro
                        </Link>
                        <Link href="#panelistas" className="block text-blue-600 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-xl text-base font-medium" onClick={closeMenu}>
                            Panelistas
                        </Link>
                        <Link href="#agenda" className="block text-blue-600 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-xl text-base font-medium" onClick={closeMenu}>
                            Agenda
                        </Link>
                        <Link href="/login" className="block text-white bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-xl text-base font-medium transition duration-300" onClick={closeMenu}>
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
