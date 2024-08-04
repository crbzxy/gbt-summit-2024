"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loader';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);

        const { role } = JSON.parse(atob(token.split('.')[1]));

        // Redireccionar según el rol del usuario
        if (role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/user');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error de autenticación');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError('Error al conectar con el servidor: ' + err.message);
      } else {
        setError('Error al conectar con el servidor');
      }
      console.error('Error al conectar con el servidor', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 max-w-sm w-full bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center">Iniciar Sesión</h1>
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              className={`w-full p-3 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-blue-500`}
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <input
              className={`w-full p-3 border ${error ? "border-red-500" : "border-gray-300"} rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-blue-500`}
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 focus:outline-none"
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        {loading && <Loader />}
      </div>
    </div>
  );
}
