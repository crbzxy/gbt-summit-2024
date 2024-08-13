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
    <main className="flex flex-col lg:flex-row items-center min-h-screen bg-white text-gray-900 justify-center max-w-7xl mx-auto px-4">

      <div className="flex flex-col items-center w-full">
        {/* Contenedor principal */}
        <div className=" flex flex-col lg:flex-row justify-center items-center mt-10 lg:mt-16 lg:space-x-8">
          {/* Imagen del ticket */}
          <div className="flex flex-col items-center mb-4 lg:mb-0 mt-9">
            <Image
              src="/laclogo.png"
              alt="Event Ticket"
              width={300}
              height={200}
              className="mb-8"
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="w-full max-w-5xl mb-6 text-left">
          <p className="text-sm md:text-base text-[#006FCF] leading-relaxed mb-4">
            Como cada año, American Express Global Business Travel (Amex GBT)
            celebra el “LAC Business Travel Summit” bajo el concepto de
            “Impulsando conexiones de valor” en la edición de este año. Un evento
            que resalta las conexiones con valor agregado que se crean entre Amex
            GBT y nuestros socios de negocios, compartiendo experiencias, buenas
            prácticas, casos de éxito y estrategias de gestión para travel managers.
          </p>
          <p className="text-sm md:text-base text-[#006FCF] leading-relaxed mb-4">
            En la conferencia magistral, nos honrará con su presencia Gloria
            Guevara Manzo, expresidenta del Consejo Mundial de Viajes y Turismo
            (WTTC), y actual asesora en jefe del ministro de Turismo de Arabia
            Saudita, Mohamed Al Khateeb. Ella es miembro del Consejo de Amex
            GBT y nos platicará sobre el crecimiento de los viajes de negocio.
          </p>
          <p className="text-sm md:text-base text-[#006FCF] leading-relaxed mb-4">
            Esperamos que este evento le ayude a conocer cómo Amex GBT busca
            constantemente las conexiones de valor entre sus socios estratégicos y
            logre ampliar su visión sobre los viajes corporativos.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center w-full">
        {/* Patrocinadores */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#006FCF] text-center mb-8 md:mb-16">
          Nuestros patrocinadores:
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-4 mb-12">
          <div className="flex justify-center items-center">
            <Image src="/all_logos.svg" alt="Patrocinadores" width={420} height={80} />
          </div>
        </div>

        {/* Temporizador */}
        <div className="flex flex-col items-center mb-12 lg:mb-0">
          <h2 className="text-xl lg:text-2xl font-extrabold text-[#006FCF] mb-4 text-center">
            Faltan
          </h2>
          <div className="flex flex-wrap justify-center gap-2 mb-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white bg-[#00175A] rounded-full w-14 h-14 flex items-center justify-center">
                {timeLeft.days}
              </span>
              <span className="text-sm font-semibold text-[#006FCF]">días</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white bg-[#00175A] rounded-full w-14 h-14 flex items-center justify-center">
                {timeLeft.hours}
              </span>
              <span className="text-sm font-semibold text-[#006FCF]">horas</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white bg-[#00175A] rounded-full w-14 h-14 flex items-center justify-center">
                {timeLeft.minutes}
              </span>
              <span className="text-sm font-semibold text-[#006FCF]">mins</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl font-bold text-white bg-[#00175A] rounded-full w-14 h-14 flex items-center justify-center">
                {timeLeft.seconds}
              </span>
              <span className="text-sm font-semibold text-[#006FCF]">segs</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
