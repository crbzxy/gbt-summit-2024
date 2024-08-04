"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date("2024-09-26T08:00:00");

    const calculateTimeLeft = () => {
      const now = new Date();
      const totalSeconds = Math.floor(
        (targetDate.getTime() - now.getTime()) / 1000
      );
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
    <main className="flex flex-col items-center min-h-screen bg-white text-gray-900 justify-center">
      <div className="flex flex-col items-center w-full px-4">
        {/* Contenedor principal */}
        <div className="flex flex-col lg:flex-row justify-center w-full items-center mt-20 lg:mt-16 lg:space-x-8">
          {/* Imagen del ticket */}
          <div className="flex flex-col items-center mb-3 lg:mb-0">
            <Image
              src="/Summit_2024_Logo.png"
              alt="Event Ticket"
              width={200}
              height={200}
              className="mb-4"
            />
          </div>

          {/* Temporizador */}
          <div className="flex flex-col items-center mb-6 lg:mb-0">
            <h2 className="text-xl lg:text-2xl font-extrabold text-blue-900 mb-4 text-center">
              Faltan
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mb-8 text-center">
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center">
                  {timeLeft.days}
                </span>
                <span className="text-sm font-semibold text-gray-700">días</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center">
                  {timeLeft.hours}
                </span>
                <span className="text-sm font-semibold text-gray-700">horas</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center">
                  {timeLeft.minutes}
                </span>
                <span className="text-sm font-semibold text-gray-700">mins</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl font-bold text-white bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center">
                  {timeLeft.seconds}
                </span>
                <span className="text-sm font-semibold text-gray-700">segs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="w-full max-w-5xl mb-2 text-left px-4">
          <h2 className="text-sm md:text-base font-bold text-blue-900 leading-relaxed mb-4">
            American Express Global Business Travel (Amex GBT) lo invita a
            nuestro próximo evento anual “LAC Business Travel Summit 2024”,
            donde promoveremos la igualdad de género en la industria de la
            aviación y compartiremos estrategias de gestión de viajes para
            Travel Managers.
          </h2>
          <p className="text-xs md:text-sm text-gray-700 leading-relaxed mb-4">
            Contaremos con la participación de nuestros socios comerciales que
            nos compartirán las acciones que están tomando para hacer una
            industria de viajes más igualitaria. Además asistirán algunas Travel
            Managers expertas en la industria, que nos compartirán su
            experiencia, buenas prácticas, y casos de éxito que han logrado de
            la mano con Amex GBT.
          </p>
          <p className="text-xs md:text-sm text-gray-700 leading-relaxed mb-4">
            Finalmente, en la conferencia magistral con Gloria Guevara Manzo,
            expresidenta del Consejo Mundial de Viajes y Turismo (WTTC) y actual
            asesora en jefe del ministro de Turismo de Arabia Saudita, Mohamed
            Al Khateeb, es miembro del Consejo de Amex GBT y quien nos honrará
            con su presencia durante el GBT Summit 2024 para hablar sobre el
            crecimiento de los viajes de negocio.
          </p>
          <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
            Esperamos que este evento le ayude a conocer cómo la equidad de
            género se está implementando en esta industria y amplíe su visión
            sobre los viajes corporativos.
          </p>
        </div>

        {/* Patrocinadores */}
        <h3 className="text-base font-bold text-blue-900 text-center mb-4">
          Patrocinado por:
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <div className="flex justify-center items-center">
            <Image
              src="/amdl.png"
              alt="Aeromexico"
              width={320}
              height={80}
            />
          </div>
          <div className="flex justify-center items-center">
            <Image
              src="/marriot.png"
              alt="Delta"
              width={80}
              height={40}
              className="w-12 md:w-24 lg:w-30 h-auto"
            />
          </div>
          <div className="flex justify-center items-center">
            <Image
              src="/em.jpg"
              alt="Marriott Bonvoy"
              width={80}
              height={40}
              className="w-12 md:w-23 lg:w-30 h-auto"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
