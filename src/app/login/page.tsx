'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loader';
import InputField from '../components/InputField';
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import SupportQuestion from '../components/SupportQuestion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSupportModalOpen, setSupportModalOpen] = useState(false); // Estado para el modal
  const router = useRouter();

  const getDeviceId = (): string => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const deviceId = getDeviceId();

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, deviceId }),
      });

      if (response.ok) {
        const { token, userId, userName } = await response.json();

        localStorage.setItem('token', token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('userName', userName);

        const payload = JSON.parse(atob(token.split('.')[1]));
        const { role } = payload;

        if (role === 'admin') {
          setError('Favor de verificar su correo.');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
        } else {
          router.push('/live');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error de autenticación');
        setSupportModalOpen(true); // Abrir el modal si hay un error
      }
    } catch (err) {
      if (err instanceof Error) {
        setError('Error al conectar con el servidor: ' + err.message);
      } else {
        setError('Error desconocido al conectar con el servidor');
      }
      setSupportModalOpen(true); // Abrir el modal en caso de error
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const closeModal = () => {
    setSupportModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#006FCF] via-[#00175A] to-[#006FCF]">
      <Image src="/gbtwhite.svg" alt="American Express Logo" width={120} height={40} className="mb-8" />
      <div className="p-8 max-w-sm w-full bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center">Iniciar Sesión</h1>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField type="email" placeholder="Correo" name="email" value={email} onChange={(e) => setEmail(e.target.value)} mode="register" />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        {loading && <Loader />}
        
       
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <button
                onClick={() => window.location.href = 'https://www.gbtsummit2024.com/#registro'}
                className="text-blue-600 hover:underline"
              >
                Regístrate aquí
              </button>
            </p>

            <p className="text-sm mt-4">
              <button
                onClick={() => window.open('https://wa.me/1234567890', '_blank')}
                className="text-blue-500 hover:underline transition-all"
              >
                ¿Necesitas soporte? Contáctanos por WhatsApp
              </button>
            </p>
          </div>
      

        <div className="mt-4 text-center absolute left-8 top-7">
          <button onClick={handleBack} className="text-sm text-white hover:underline transition-all">
            &larr; Volver
          </button>
        </div>
      </div>

      {/* Botón flotante de WhatsApp */}
    
        <button
          onClick={() => window.open('https://wa.me/1234567890', '_blank')}
          className="fixed bottom-4 right-4 bg-green-500 p-3 rounded-full shadow-lg transform transition-transform hover:scale-110 active:scale-95"
        >
          <Image src="/whats.png" alt="WhatsApp" width={40} height={40} />
        </button>
    
      {/* Modal de soporte */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md transform transition-all hover:scale-105 outline-none focus:outline-none">
            <h2 className="text-2xl font-bold text-center mb-4">Soporte de Autenticación</h2>
            <SupportQuestion />
            <button
              onClick={closeModal}
              className="w-full mt-4 text-center py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
            >
              Cerrar
            </button>
            </div>
        </div>
      )}
    </div>
  );
}
