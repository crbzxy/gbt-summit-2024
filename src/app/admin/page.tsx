'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RegistrationForm from '../components/RegisterForm';

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

// Define el tipo FormState, eliminando la contraseña
type FormState = {
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Usuario seleccionado para editar
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

  // Función para manejar la edición de usuario
  const handleEditUser = (user: User) => {
    setSelectedUser(user); // Establece el usuario seleccionado para edición
  };

  // Función para enviar los datos actualizados del usuario
  const handleUpdateUser = async (updatedData: FormState) => {
    const token = localStorage.getItem('token');
    if (!token || !selectedUser) return;

    try {
      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          token,
          userId: selectedUser._id,
          ...updatedData,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? updatedUser.user : user
          )
        );
        setSelectedUser(null); // Cerrar el formulario de edición
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar el usuario');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError('Error al conectar con el servidor: ' + err.message);
      } else {
        setError('Error al conectar con el servidor');
      }
    }
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-4xl font-extrabold text-[#006FCF]'>
            Panel de Administración
          </h1>
          <div className='space-x-4'>
            <button
              onClick={handleUserViewRedirect}
              className='py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'>
              Ver transmisión
            </button>
            <button
              onClick={handleLogout}
              className='py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors'>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {error && <div className='text-red-600 mb-4 text-center'>{error}</div>}

        <div className='overflow-hidden rounded-lg shadow-lg'>
          <table className='min-w-full bg-white'>
            <thead className='bg-blue-600 text-white'>
              <tr>
                <th className='py-3 px-4 text-left font-semibold'>Nombre</th>
                <th className='py-3 px-4 text-left font-semibold'>Email</th>
                <th className='py-3 px-4 text-left font-semibold'>Teléfono</th>
                <th className='py-3 px-4 text-left font-semibold'>Empresa</th>
                <th className='py-3 px-4 text-left font-semibold'>Puesto</th>
                <th className='py-3 px-4 text-left font-semibold'>
                  Tipo de Registro
                </th>
                <th className='py-3 px-4 text-left font-semibold'>Acciones</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className='hover:bg-gray-100 transition duration-150 text-black'>
                  <td className='py-4 px-4 text-sm'>{user.name}</td>
                  <td className='py-4 px-4 text-sm'>{user.email}</td>
                  <td className='py-4 px-4 text-sm'>{user.phone}</td>
                  <td className='py-4 px-4 text-sm'>{user.company}</td>
                  <td className='py-4 px-4 text-sm'>{user.position}</td>
                  <td className='py-4 px-4 text-sm'>{user.registrationType}</td>
                  <td className='py-4 px-4 text-sm'>
                    <button
                      onClick={() => handleEditUser(user)}
                      className='py-1 px-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal para edición de usuario */}
        {selectedUser && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='rounded-lg overflow-hidden shadow-lg w-11/12 md:w-3/4 lg:w-1/2'>
              <div className='p-6'>
                <h2 className='text-2xl font-bold mb-4 text-center'>
                  Editar Usuario
                </h2>
                <RegistrationForm
<<<<<<< HEAD
                  mode="edit"
=======
                  registrationType={selectedUser.registrationType}
                  mode='edit'
>>>>>>> develop
                  initialData={selectedUser}
                  onSubmit={handleUpdateUser}
                  registrationType={selectedUser.registrationType} // Asegúrate de pasar registrationType
                />
              </div>
              <div className='flex justify-end p-4'>
                <button
                  onClick={closeModal}
                  className='py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors'>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
