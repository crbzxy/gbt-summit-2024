import React, { useEffect, useState } from 'react';

// Define la interfaz con un campo 'id' único.
interface AgendaItem {
    id: string; // Campo para el identificador único.
    horario: string;
    ponencia: string;
    panelista: string;
}

const Agenda: React.FC = () => {
    const [items, setItems] = useState<AgendaItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/agendaData.json');
                if (!response.ok) {
                    throw new Error('Error al cargar los datos');
                }
                const data: AgendaItem[] = await response.json();

                // Agrega un identificador único si no existe en los datos.
                const dataWithId = data.map((item, index) => ({
                    ...item,
                    id: `${item.ponencia}-${index}`, // Generar un ID basado en `ponencia` y `index`.
                }));

                setItems(dataWithId);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col align-middle justify-center text-center pt-6 pb-12 bg-white shadow-md" id="agenda">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Agenda</h2>
            <table className="w-full text-left border-collapse max-w-5xl m-auto">
                <thead className="rounded-t-lg">
                    <tr className="bg-blue-600 text-white">
                        <th className="p-4 first:rounded-tl-lg last:rounded-tr-lg" style={{ width: '15%' }}>Horario</th>
                        <th className="p-4 first:rounded-tl-lg last:rounded-tr-lg" style={{ width: '40%' }}>Ponencia</th>
                        <th className="p-4 first:rounded-tl-lg last:rounded-tr-lg" style={{ width: '45%' }}>Panelista</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr
                            key={item.id} // Usar el identificador único como clave.
                            className="odd:bg-white even:bg-gray-100 hover:shadow-lg border-y-8 transition duration-300 ease-in-out transform hover:scale-105 text-blue-800 rounded-lg overflow-hidden"
                            style={{
                                backgroundImage: 'radial-gradient(circle, rgba(35,126,235,0.8), rgba(173,216,230,0.2))',
                                backgroundSize: '150% 150%',
                                backgroundPosition: 'center',
                            }}
                        >
                            <td className="p-4">{item.horario}</td>
                            <td className="p-4">{item.ponencia}</td>
                            <td className="p-4">{item.panelista}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Agenda;
