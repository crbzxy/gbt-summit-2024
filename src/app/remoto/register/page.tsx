"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterRemoto() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone, company, position, registrationType: 'remoto' }),
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Error de registro');
      }
    } catch (error) {
      console.error('Error al conectar con el servidor', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Registro Remoto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 border border-gray-300 rounded-lg"
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg"
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg"
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg"
          type="text"
          placeholder="Empresa"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <input
          className="w-full p-3 border border-gray-300 rounded-lg"
          type="text"
          placeholder="Puesto"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />
        <button
          type="submit"
          className="w-full p-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
}
