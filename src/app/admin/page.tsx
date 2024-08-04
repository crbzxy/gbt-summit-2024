"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define un tipo de usuario para tipado seguro
type User = {
  _id: string; // mongoose usa _id
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  registrationType: string;
};

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token no encontrado. Redirigiendo al login...');
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al obtener usuarios');
          router.push('/login');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError('Error al conectar con el servidor: ' + err.message);
        } else {
          setError('Error al conectar con el servidor');
        }
      }
    };

    fetchUsers();
  }, [router]);

  // Función para manejar la redirección a la vista de usuario
  const handleUserViewRedirect = () => {
    router.push('/live'); // Cambia la ruta a la vista del usuario no admin
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del almacenamiento local
    router.push('/login'); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold text-blue-700">
            Panel de Administración
          </h1>
          <div className="space-x-4">
            <button
              onClick={handleUserViewRedirect}
              className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver transmisión
            </button>
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}

        <div className="overflow-hidden rounded-lg shadow-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Nombre</th>
                <th className="py-3 px-4 text-left font-semibold">Email</th>
                <th className="py-3 px-4 text-left font-semibold">Teléfono</th>
                <th className="py-3 px-4 text-left font-semibold">Empresa</th>
                <th className="py-3 px-4 text-left font-semibold">Puesto</th>
                <th className="py-3 px-4 text-left font-semibold">Tipo de Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100 transition duration-150 text-black">
                  <td className="py-4 px-4 text-sm">{user.name}</td>
                  <td className="py-4 px-4 text-sm">{user.email}</td>
                  <td className="py-4 px-4 text-sm">{user.phone}</td>
                  <td className="py-4 px-4 text-sm">{user.company}</td>
                  <td className="py-4 px-4 text-sm">{user.position}</td>
                  <td className="py-4 px-4 text-sm">{user.registrationType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
