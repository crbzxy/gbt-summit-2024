"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0 // Añadimos segundos al estado
  });

  useEffect(() => {
    const targetDate = new Date('2024-09-26T08:00:00');

    const calculateTimeLeft = () => {
      const now = new Date();
      const totalSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="flex min-h-screen bg-gray-100">
      <div className="flex flex-col lg:flex-row w-full">
        {/* Sección de bienvenida */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-800 text-white lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-4">GBT Summit 2024</h1>
          <div className="text-center">
            <p className="text-2xl lg:text-3xl font-extrabold mb-4">Faltan</p>
            <div className="flex space-x-4 mb-8 justify-center">
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-extrabold bg-white text-blue-900 rounded-full w-20 lg:w-24 h-20 lg:h-24 flex items-center justify-center animate-pulse">
                  {timeLeft.days}
                </div>
                <p className="text-base lg:text-lg mt-2">días</p>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-extrabold bg-white text-blue-900 rounded-full w-20 lg:w-24 h-20 lg:h-24 flex items-center justify-center animate-pulse">
                  {timeLeft.hours}
                </div>
                <p className="text-base lg:text-lg mt-2">horas</p>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-extrabold bg-white text-blue-900 rounded-full w-20 lg:w-24 h-20 lg:h-24 flex items-center justify-center animate-pulse">
                  {timeLeft.minutes}
                </div>
                <p className="text-base lg:text-lg mt-2">minutos</p>
              </div>
              <div className="text-center">
                <div className="text-5xl lg:text-6xl font-extrabold bg-white text-blue-900 rounded-full w-20 lg:w-24 h-20 lg:h-24 flex items-center justify-center animate-pulse">
                  {timeLeft.seconds}
                </div>
                <p className="text-base lg:text-lg mt-2">segundos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de botones */}
        <div className="lg:w-1/2 bg-white flex flex-col justify-center p-8 lg:p-16 shadow-lg rounded-lg">
          <Image src="/logo.png" alt="Logo" width={150} height={50} />
          <div className="flex space-x-4">
            <button 
              className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => window.location.href='/register?type=home'}
            >
              Registrarsed
            </button>
            <button 
              className="w-full p-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => window.location.href='/login'}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
