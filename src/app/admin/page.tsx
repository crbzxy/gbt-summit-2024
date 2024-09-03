'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RegistrationForm from '../components/RegisterForm';
import ExcelJS from 'exceljs';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registra los componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

export default function VortexDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
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
          // Ordenar los usuarios alfabéticamente por empresa
          const sortedUsers = data.users.sort((a: User, b: User) =>
            a.company.localeCompare(b.company)
          );
          setUsers(sortedUsers);
          setFilteredUsers(sortedUsers);
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

  // Filtrar usuarios según la empresa seleccionada
  const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const company = event.target.value;
    setSelectedCompany(company);
    if (company === 'All') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.company === company));
    }
  };

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
        setFilteredUsers((prevUsers) =>
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

  // Función para exportar los usuarios a Excel
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Usuarios');

    worksheet.columns = [
      { header: 'Nombre', key: 'name', width: 30 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Teléfono', key: 'phone', width: 15 },
      { header: 'Empresa', key: 'company', width: 30 },
      { header: 'Puesto', key: 'position', width: 30 },
      { header: 'Tipo de Registro', key: 'registrationType', width: 20 },
    ];

    filteredUsers.forEach((user) => {
      worksheet.addRow({
        name: user.name,
        email: user.email,
        phone: user.phone,
        company: user.company,
        position: user.position,
        registrationType: user.registrationType,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'usuarios.xlsx';
    link.click();
  };

  // Calcular total de usuarios y distribución de dominios de correo
  const totalUsers = filteredUsers.length;
  const emailDomains = filteredUsers.reduce((acc: Record<string, number>, user) => {
    const domain = user.email.split('@')[1];
    acc[domain] = (acc[domain] || 0) + 1;
    return acc;
  }, {});

  // Ordenar alfabéticamente los dominios de correo
  const sortedDomains = Object.keys(emailDomains).sort();
  const sortedDomainData = sortedDomains.map(domain => emailDomains[domain]);

  const chartData = {
    labels: sortedDomains,
    datasets: [
      {
        label: 'Usuarios por dominio',
        data: sortedDomainData,
        backgroundColor: '#4CAF50', // Verde Vortex
        borderColor: '#2E7D32', // Verde más oscuro
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  // Ordenar alfabéticamente las empresas en el filtro
  const uniqueCompanies = Array.from(new Set(users.map(user => user.company))).sort();

  return (
    <div className='min-h-screen bg-gray-900 p-8'>
      <div className='max-w-7xl mx-auto bg-gray-800 shadow-md rounded-lg p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-4xl font-extrabold text-green-400'>
            Vortex Dashboard
          </h1>
          <div className='flex space-x-4'>
            <button
              onClick={handleUserViewRedirect}
              className='py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors'>
              Ver transmisión
            </button>
            <button
              onClick={exportToExcel}
              className='py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors'>
              Descargar Excel
            </button>
            <button
              onClick={handleLogout}
              className='py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors'>
              Cerrar Sesión
            </button>
          </div>
        </div>

        {error && <div className='text-red-600 mb-4 text-center'>{error}</div>}

        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-green-400 mb-4'>Dashboard</h2>
          <div className='flex items-center space-x-4 mb-4'>
            <p className='text-lg font-medium text-white'>
              Total de usuarios: <span className='text-green-400'>{totalUsers}</span>
            </p>
            <select
              className='py-2 px-4 bg-gray-700 text-white border border-gray-600 rounded-lg'
              value={selectedCompany}
              onChange={handleCompanyChange}
            >
              <option value="All">Todas las empresas</option>
              {uniqueCompanies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
          <div className='mt-2 bg-gray-700 p-4 rounded-lg shadow-inner'>
            <div style={{ height: '400px' }}>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className='overflow-hidden rounded-lg shadow'>
          <table className='min-w-full bg-gray-800'>
            <thead className='bg-green-600 text-white'>
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
            <tbody className='divide-y divide-gray-700'>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className='hover:bg-gray-700 transition duration-150'>
                  <td className='py-4 px-4 text-sm text-white'>{user.name}</td>
                  <td className='py-4 px-4 text-sm text-white'>{user.email}</td>
                  <td className='py-4 px-4 text-sm text-white'>{user.phone}</td>
                  <td className='py-4 px-4 text-sm text-white'>{user.company}</td>
                  <td className='py-4 px-4 text-sm text-white'>{user.position}</td>
                  <td className='py-4 px-4 text-sm text-white'>{user.registrationType}</td>
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
            <div className='rounded-lg overflow-hidden shadow-lg w-11/12 md:w-3/4 lg:w-1/2 bg-gray-800'>
              <div className='p-6'>
                <h2 className='text-2xl font-bold mb-4 text-center text-green-400'>
                  Editar Usuario
                </h2>
                <RegistrationForm
                  mode="edit"
                  initialData={selectedUser}
                  onSubmit={handleUpdateUser}
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
