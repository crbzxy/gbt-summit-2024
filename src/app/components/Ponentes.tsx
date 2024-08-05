// components/PonentesPage.tsx

import Ponente from '../components/Ponente';

const PonentesPage = () => {
    const ponentes = [
        {
            id: '1',
            name: 'Gloria Guevara',
            title: 'Ex presidenta del Consejo Mundial de Viajes y Turismo (WTTC)',
            description:
                'Ex presidenta del Consejo Mundial de Viajes y Turismo (WTTC) y actual asesora en jefe del ministro de Turismo de Arabia Saudita, Mohamed Al Khateeb, es miembro del Consejo de Amex GBT y quien nos honrará con su presencia durante el GBT Summit 2024 para hablar sobre el crecimiento de los viajes de negocio.',
            image: '/gloria.png',
        },
        {
            id: '2',
            name: 'Lorem Ipsum',
            title: 'CEO de Ejemplo S.A.',
            description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.',
            image: '/lorem.png',
        },
        // Puedes añadir más ponentes aquí
    ];

    return (
        <div className="min-h-screen flex flex-col  items-center bg-white  justify-center align-middle pt-11" id="panelistas">
            <div className="container mx-auto py-12 px-4 max-w-5xl">
                <h1 className="text-4xl font-bold text-blue-800 mb-12 text-center">
                    Conoce a nuestros panelistas
                </h1>
                <div className="space-y-16">
                    {ponentes.map((ponente, index) => (
                        <Ponente
                            key={ponente.id}
                            name={ponente.name}
                            title={ponente.title}
                            description={ponente.description}
                            image={ponente.image}
                            reverse={index % 2 !== 0} // Alternar orden si el índice es impar
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PonentesPage;
