// components/PonentesPage.tsx

import Ponente from '../components/Ponente';

const PonentesPage = () => {
    const ponentes = [
        {
            id: '1',
            name: 'Sandra Vargas',
            title: 'Travel Manager para Grupo Salinas',
            category: 'Panel “Mujeres exitosas en la industria de viajes”',
            description: `
                Licenciada en Administración de Instituciones por la Universidad Panamericana, Maestra en Consultoría de imagen personal y
                corporativa por el Instituto de Imagen con reconocimiento en México, Nueva York y Barcelona. Maestra en Diseño estratégico e
                Innovación por la Universidad Iberoamericana. Más de 15 años de experiencia ejecutiva en la industria de viajes y eventos
                corporativos; sus inicios se dan en casas productoras de Teatro y banqueteras,  desarrolla su trayectoria en Televisa en el área de
                logística de viajes,  actualmente es responsable del programa de T&E y eventos para Grupo Salinas.
                Con un enfoque de Diseño estratégico, UX y tecnología ha logrado la expansión del programa de viajes y eventos corporativos.
                Cuenta con amplia experiencia en la centralización de servicios relacionados a la atención a clientes. Además, es profesor
                académico en Postgrados para diferentes Instituciones académicas en temas de administración de servicios, emprendimiento y
                consultorio de imagen. Apasionada en el desarrollo y acompañamiento de equipos enfocados en generar mayor productividad,
                alineando sus competencias claves, como trabajo en equipo, enfoque al cliente y automatización de procesos.
            `,
            image: '/SandraVargas.png',
        },
        {
            id: '2',
            name: 'Fabiola Urtiaga',
            title: 'Travel Manager para Casa Cuervo',
            category: 'Panel “Mujeres exitosas en la industria de viajes”',
            description: `
                Gerente Servicios Generales en José Cuervo.
                Lic Administración de Instituciones por la ESDAI, UP.
                Chef por The Culinary Insitute of America.
                Sommelier por la Universad del Tepeyac.
                Más de 30 años trabajando en la industria de la hospitalidad, 16 años en José Cuervo.
            `,
            image: '/FabiolaUrtiaga.png',
        },
        {
            id: '3',
            name: 'Tania Zuleta',
            title: 'Travel Manager para Flextronics',
            category: 'Panel “Mujeres exitosas en la industria de viajes”',
            description: `
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea
                commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu
                feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore
                te feugait nulla facilisi.
            `,
            image: '/marco.png',
        },
        {
            id: '4',
            name: 'Daniella Jiménez',
            title: 'Travel Manager para Medtronic',
            category: 'Panel “Mujeres exitosas en la industria de viajes”',
            description: `
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea
                commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu
                feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore
                te feugait nulla facilisi.
            `,
            image: '/marco.png',
        },
        {
            id: '5',
            name: 'Gloria Guevara Manzo',
            title: 'Miembro del Consejo de Amex GBT',
            category: 'Conferencia magistral',
            description: `
                Expresidenta del Consejo Mundial de Viajes y Turismo (WTTC), y actual asesora en jefe del ministro de Turismo de Arabia Saudita,
                Mohamed Al Khateeb.
            `,
            image: '/GloriaGuevara.png',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col items-center bg-white justify-center align-middle pt-11" id="panelistas">
            <div className="container mx-auto py-12 px-4 max-w-5xl">
               

                <div className="space-y-16">
                    {ponentes.map((ponente, index) => (
                        <Ponente
                            key={ponente.id}
                            name={ponente.name}
                            title={ponente.title}
                            category={ponente.category}
                            description={ponente.description}
                            image={ponente.image}
                            reverse={index % 2 !== 0} // Alternar orden si el índice es impar
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PonentesPage;