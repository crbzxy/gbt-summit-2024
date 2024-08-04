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
  const [users, setUsers] = useState<User[]>([]); // Aplica el tipo User
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users); // Supongamos que el API devuelve { users: User[] }
      } else {
        router.push('/login');
      }
    };

    fetchUsers();
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Nombre</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Teléfono</th>
            <th className="py-2 px-4 border-b">Empresa</th>
            <th className="py-2 px-4 border-b">Puesto</th>
            <th className="py-2 px-4 border-b">Tipo de Registro</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="py-2 px-4 border-b">{user.name}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.phone}</td>
              <td className="py-2 px-4 border-b">{user.company}</td>
              <td className="py-2 px-4 border-b">{user.position}</td>
              <td className="py-2 px-4 border-b">{user.registrationType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
