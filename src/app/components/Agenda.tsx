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
            <table className="w-full text-center border-collapse max-w-5xl m-auto">
                <thead >
                    <tr className=" text-white mb-5">
                        <th className="p-4 rounded-md bg-blue-600" style={{ width: '15%' }}>Horario</th>
                        <th className="p-4 rounded-full" style={{ width: '2.5%' }}></th>
                        <th className="p-4 rounded-md bg-blue-600" style={{ width: '40%' }}>Actividad</th>
                        <th className="p-4 rounded-full" style={{ width: '2.5%' }}></th>
                        <th className="p-4 rounded-md bg-blue-600" style={{ width: '35%' }}>Ponentes</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="bg-white ">
                        <td className="p-3" colSpan={5}></td>
                    </tr>
                    {items.map((item) => (
                        <tr
                            key={item.id} 
                            className="rounded-full border-collapse hover:shadow-sm border-y-8 transition duration-300 ease-in-out transform hover:scale-105 text-[#02390] overflow-hidden"
                            style={{
                                backgroundImage: 'radial-gradient(circle, rgba(59,160,228,1), rgba(180,235,255,1))',
                                backgroundSize: '150% 150%',
                                backgroundPosition: 'center',
                                borderColor: 'white',
                                borderRadius: '50px',
                                margin: '8px 0',
                            }}
                        >
                            <td className="p-2 " colSpan={2} style={{ borderEndStartRadius: 12, borderTopLeftRadius:12}}>{item.horario}</td>
                            <td className="p-2" colSpan={2}>{item.ponencia}</td>
                            <td className="p-2" style={{ borderEndEndRadius: 12, borderTopRightRadius:12}}>{item.panelista}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Agenda;
