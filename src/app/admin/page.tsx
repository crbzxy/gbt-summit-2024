'use client';

import { useEffect, useState, Fragment } from 'react';
import { useRouter } from 'next/navigation';
import RegistrationForm from '../components/RegisterForm';
import ExcelJS from 'exceljs';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Tab } from '@headlessui/react'; // Importa Tab de Headless UI
import GetQuestions from '../components/GetQuestions';
import Image from 'next/image';

// Registra los componentes necesarios para Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // Registrar el ArcElement
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

// Función para manejar la clase activa de las pestañas
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function VortexDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Usuario seleccionado para editar
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const usersPerPage = 10; // Número de usuarios por página

  // Calcular el índice de los usuarios para la página actual
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser); // Obtener usuarios para la página actual

  // Función para manejar el cambio de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Token no encontrado. Redirigiendo a un vortex...');
        router.push('/vortex');
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
        setError('Error desconocido al conectar con el servidor');
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
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'usuarios.xlsx';
    link.click();
  };

  // Calcular total de usuarios y distribución de dominios de correo
  const totalUsers = filteredUsers.length;
  const emailDomains = filteredUsers.reduce(
    (acc: Record<string, number>, user) => {
      const domain = user.email.split('@')[1].toLowerCase(); // Convertir a minúsculas para evitar duplicados por mayúsculas/minúsculas
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    },
    {}
  );
  // Ordenar alfabéticamente los dominios de correo
  const sortedDomains = Object.keys(emailDomains).sort(
    (a, b) => emailDomains[b] - emailDomains[a]
  ); // Ordenar por número de usuarios de manera descendente
  const topTenDomains = sortedDomains.slice(0, 10); // Obtener los 10 dominios con más usuarios
  const topTenData = topTenDomains.map((domain) => emailDomains[domain]);

  const chartData = {
    labels: topTenDomains,
    datasets: [
      {
        label: 'Usuarios por dominio',
        data: topTenData,
        backgroundColor: '#4CAF50', // Verde Vortex para el fondo
        borderColor: '#2E7D32', // Verde más oscuro para el borde
        borderWidth: 1,
        color: 'white',
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white', // Color blanco para las etiquetas del gráfico
        },
      },
      title: {
        display: true,
        text: 'Top 10 dominios',
        color: 'white', // Color blanco para el título
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Color blanco para las etiquetas del eje X
        },
      },
      y: {
        ticks: {
          color: 'white', // Color blanco para las etiquetas del eje Y
        },
      },
    },
  };

  // Calcular la empresa con más usuarios
  const companyCounts = filteredUsers.reduce(
    (acc: Record<string, number>, user) => {
      acc[user.company] = (acc[user.company] || 0) + 1;
      return acc;
    },
    {}
  );

  const maxCompany = Object.keys(companyCounts).reduce(
    (a, b) => (companyCounts[a] > companyCounts[b] ? a : b),
    ''
  );

  const maxCompanyCount = maxCompany ? companyCounts[maxCompany] : 0;

  // Ordenar alfabéticamente las empresas en el filtro
  const uniqueCompanies = Array.from(
    new Set(users.map((user) => user.company))
  ).sort();

  // Datos para el gráfico de empresas
  const companyData = {
    labels: Object.keys(companyCounts),
    datasets: [
      {
        label: 'Usuarios por empresa',
        data: Object.values(companyCounts),
        backgroundColor: '#4CAF50', // Verde Vortex para el fondo
        borderColor: '#2E7D32', // Verde más oscuro para el borde
        borderWidth: 1,
        color: 'white',
      },
    ],
  };

  const companyChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white', // Color blanco para las etiquetas del gráfico
        },
      },
      title: {
        display: true,
        text: 'Distribución de usuarios por empresa',
        color: 'white', // Color blanco para el título
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Color blanco para las etiquetas del eje X
        },
      },
      y: {
        ticks: {
          color: 'white', // Color blanco para las etiquetas del eje Y
        },
      },
    },
  };
  const positionCounts = filteredUsers.reduce(
    (acc: Record<string, number>, user) => {
      acc[user.position] = (acc[user.position] || 0) + 1;
      return acc;
    },
    {}
  );

  const positionData = {
    labels: Object.keys(positionCounts),
    datasets: [
      {
        label: 'Usuarios por puesto',
        data: Object.values(positionCounts),
        backgroundColor: '#4CAF50', // Verde Vortex para el fondo
        borderColor: '#2E7D32', // Verde más oscuro para el borde
        borderWidth: 1,
        color: 'white',
      },
    ],
  };

  const positionChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: 'white', // Color blanco para las etiquetas del gráfico
        },
      },
      title: {
        display: true,
        text: 'Distribución de usuarios por puesto',
        color: 'white', // Color blanco para el título
        font: {
          size: 20,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Color blanco para las etiquetas del eje X
        },
      },
      y: {
        ticks: {
          color: 'white', // Color blanco para las etiquetas del eje Y
        },
      },
    },
  };
  const registrationTypeCounts = filteredUsers.reduce(
    (acc: Record<string, number>, user) => {
      acc[user.registrationType] = (acc[user.registrationType] || 0) + 1;
      return acc;
    },
    {}
  );

  const registrationTypeData = {
    labels: Object.keys(registrationTypeCounts),
    datasets: [
      {
        label: 'Usuarios por tipo de registro',
        data: Object.values(registrationTypeCounts),
        backgroundColor: ['#4CAF50', '#4CAFb0'], // Verde para presencial, rojo para virtual
        borderColor: '#2E7D32',
        borderWidth: 1,
      },
    ],
  };

  const registrationTypeOptions = {
    plugins: {
      legend: {
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Distribución por tipo de registro',
        color: 'white',
        font: {
          size: 20,
        },
      },
    },
  };


  return (
    <div className='min-h-screen bg-gray-900 p-8'>
      <div className=' mx-auto bg-gray-800 shadow-md rounded-lg p-6'>
        <div className='flex justify-between items-center mb-6'>
          <div className='flex items-center space-x-4'>
            <Image src='/vortex.png' alt='Vortex Logo' width={148} height={148} />


          </div>
          <div className='flex items-center space-x-4 mb-4'>
            <select
              className='py-2 px-4 bg-gray-700 text-white border border-gray-600 rounded-lg'
              value={selectedCompany}
              onChange={handleCompanyChange}
            >
              <option value='All'>Todas las empresas</option>
              {uniqueCompanies.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
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

        {/* Pestañas (Tabs) */}
        <Tab.Group>
          <Tab.List className='flex space-x-1 rounded-xl bg-gray-700 p-1'>
            <Tab
              as={Fragment}
            >
              {({ selected }) => (
                <button
                  className={classNames(
                    'w-full py-2.5 text-sm leading-5 font-medium text-white rounded-lg',
                    selected
                      ? 'bg-green-500 shadow'
                      : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                  )}
                >
                  Gráficas
                </button>
              )}
            </Tab>
            <Tab
              as={Fragment}
            >
              {({ selected }) => (
                <button
                  className={classNames(
                    'w-full py-2.5 text-sm leading-5 font-medium text-white rounded-lg',
                    selected
                      ? 'bg-green-500 shadow'
                      : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                  )}
                >
                  Usuarios
                </button>
              )}
            </Tab>
            <Tab
              as={Fragment}
            >
              {({ selected }) => (
                <button
                  className={classNames(
                    'w-full py-2.5 text-sm leading-5 font-medium text-white rounded-lg',
                    selected
                      ? 'bg-green-500 shadow'
                      : 'text-gray-300 hover:bg-gray-600 hover:text-white'
                  )}
                >
                  Mensajes en vivo
                </button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className='mt-4'>
            {/* Pestaña de Gráficas */}
            <Tab.Panel
              className={classNames(
                'bg-gray-700 rounded-xl p-3',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
              )}
            >
              {/* Información en cuadros de resumen */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <h3 className="text-green-400 text-xl font-semibold">Total de usuarios</h3>
                  <p className="text-white text-3xl font-bold">{totalUsers}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <h3 className="text-green-400 text-xl font-semibold">Dominio más popular</h3>
                  <p className="text-white text-2xl font-bold">{topTenDomains[0]}</p>
                  <p className="text-white text-sm">Usuarios: {topTenData[0]}</p>
                </div>
                <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <h3 className="text-green-400 text-xl font-semibold">Empresa con más usuarios</h3>
                  <p className="text-white text-2xl font-bold">{maxCompany}</p>
                  <p className="text-white text-sm">Usuarios: {maxCompanyCount}</p>
                </div>
              </div>

              {/* Gráficas */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Gráfico de usuarios por dominio */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <div style={{ height: '400px' }}>
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </div>

                {/* Gráfico de usuarios por empresa */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <div style={{ height: '400px' }}>
                    <Bar data={companyData} options={companyChartOptions} />
                  </div>
                </div>

                {/* Gráfico de pie: Distribución por tipo de registro */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <div style={{ height: '400px' }}>
                    <Pie data={registrationTypeData} options={registrationTypeOptions} />
                  </div>
                </div>
              </div>
            </Tab.Panel>




            {/* Pestaña de Tabla */}
            <Tab.Panel
              className={classNames(
                'bg-gray-700 rounded-xl p-3',
                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
              )}
            >
              <div className='mb-6'>
                {/* Filtro de empresas */}


                {/* Tabla de usuarios */}
                <div className='overflow-hidden rounded-lg shadow'>
                  <table className='min-w-full bg-gray-800'>
                    <thead className='bg-green-600 text-white'>
                      <tr>
                        <th className='py-3 px-4 text-left font-semibold'>Nombre</th>
                        <th className='py-3 px-4 text-left font-semibold'>Email</th>
                        <th className='py-3 px-4 text-left font-semibold'>Teléfono</th>
                        <th className='py-3 px-4 text-left font-semibold'>Empresa</th>
                        <th className='py-3 px-4 text-left font-semibold'>Puesto</th>
                        <th className='py-3 px-4 text-left font-semibold'>Tipo de Registro</th>
                        <th className='py-3 px-4 text-left font-semibold'>Acciones</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-700'>
                      {currentUsers.map((user) => (
                        <tr key={user._id} className='hover:bg-gray-700 transition duration-150'>
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
              </div>

              {/* Paginación */}
              <div className='flex justify-center mt-4'>
                <nav className='relative z-0 inline-flex rounded-md shadow-sm'>
                  {Array.from({ length: Math.ceil(filteredUsers.length / usersPerPage) }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-700 text-sm font-medium text-white hover:bg-gray-600 ${currentPage === index + 1 ? 'bg-green-500' : ''}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </nav>

              </div>

              {/* Modal para edición de usuario */}
              {selectedUser && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out'>
                  <div className='relative bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg md:max-w-3xl lg:max-w-2xl transition-transform transform scale-100'>

                    {/* Botón de Cerrar (en la esquina superior derecha) */}
                    <button
                      onClick={closeModal}
                      className='absolute top-4 right-4 text-gray-400 hover:text-gray-100 transition-colors'
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Título */}
                    <h2 className='text-2xl font-bold text-green-400 mb-6 text-center'>
                      Editar Usuario
                    </h2>

                    {/* Formulario de Registro */}
                    <RegistrationForm
                      mode='edit'
                      initialData={selectedUser}
                      onSubmit={handleUpdateUser}
                    />

                    {/* Botón de Guardar y Cerrar */}
                    <div className='flex justify-end mt-6 space-x-3'>
                      <button
                        onClick={closeModal}
                        className='py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                      >
                        Cancelar
                      </button>
                      <button
                        type='submit'
                        form='edit-form'
                        className='py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </Tab.Panel>


            {/* Pestaña de Mensajes */}
            <Tab.Panel className="bg-gray-700 rounded-xl p-3">
              <GetQuestions />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
