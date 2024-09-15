'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Question = {
    _id: string;
    userName: string;
    userEmail: string;
    question: string;
    createdAt: string;
};

const GetQuestions: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Paginación
    const [currentPage, setCurrentPage] = useState<number>(1);
    const questionsPerPage = 10; // Número de preguntas por página

    const router = useRouter();

    useEffect(() => {
        let isMounted = true; // Para evitar actualizaciones en componentes desmontados
        let intervalId: NodeJS.Timeout;

        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    if (isMounted) {
                        setError('No autorizado. Redirigiendo...');
                        router.push('/login');
                    }
                    return;
                }

                const response = await fetch('/api/questions', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 401) {
                    if (isMounted) {
                        setError('No autorizado. Redirigiendo...');
                        router.push('/login');
                    }
                    return;
                }

                if (response.status === 403) {
                    if (isMounted) {
                        setError('Acceso denegado.');
                    }
                    return;
                }

                if (!response.ok) {
                    throw new Error('Error al cargar las preguntas.');
                }

                const data = await response.json();
                if (isMounted) {
                    setQuestions(data.data);
                    setLoading(false);
                    setError(null);
                }
            } catch (err) {
                console.error('Error al cargar las preguntas:', err);
                if (isMounted) {
                    setError('Error al cargar las preguntas.');
                    setLoading(false);
                }
            }
        };

        // Realizar la primera solicitud
        fetchQuestions();

        // Configurar el sondeo cada 5 segundos
        intervalId = setInterval(() => {
            fetchQuestions();
        }, 5000); // 5000 ms = 5 segundos

        // Limpieza al desmontar el componente
        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [router]);

    // Calcular los índices para la paginación
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
    const totalPages = Math.ceil(questions.length / questionsPerPage);

    // Función para formatear la fecha en horario de México
    const formatDateToMexicoTime = (dateString: string): string => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-MX', {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'America/Mexico_City',
        }).format(date);
    };

    // Componente de Paginación
    const Pagination = () => {
        if (totalPages === 0) return null;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <nav className='flex justify-center mt-4'>
                <ul className='inline-flex -space-x-px'>
                    <li>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${
                                currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                        >
                            Anterior
                        </button>
                    </li>
                    {pageNumbers.map((number) => (
                        <li key={number}>
                            <button
                                onClick={() => setCurrentPage(number)}
                                className={`px-3 py-2 leading-tight border border-gray-300 ${
                                    currentPage === number
                                        ? 'text-white bg-green-500 hover:bg-green-600'
                                        : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
                                }`}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${
                                currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
                            }`}
                        >
                            Siguiente
                        </button>
                    </li>
                </ul>
            </nav>
        );
    };

    if (loading) {
        return (
            <div className='flex justify-center items-center h-full'>
                <div className='text-white'>Cargando preguntas...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex justify-center items-center h-full'>
                <div className='text-red-500'>{error}</div>
            </div>
        );
    }

    return (
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-gray-800'>
                <thead className='bg-green-600 text-white'>
                    <tr>
                        <th className='py-3 px-4 text-left font-semibold'>Nombre</th>
                        <th className='py-3 px-4 text-left font-semibold'>Pregunta</th>
                        <th className='py-3 px-4 text-left font-semibold'>Última Conexión</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-700'>
                    {currentQuestions.map((question) => (
                        <tr
                            key={question._id}
                            className='hover:bg-gray-700 transition duration-150'
                        >
                            <td className='py-4 px-4 text-sm text-white'>{question.userName}</td>
                            <td className='py-4 px-4 text-sm text-white'>{question.question}</td>
                            <td className='py-4 px-4 text-sm text-white'>
                                {formatDateToMexicoTime(question.createdAt)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination />
        </div>
    );
};

export default GetQuestions;
