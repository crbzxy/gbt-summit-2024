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
                Licenciada en Administración de Instituciones por la ESDAI, UP y Chef por The Culinary Insitute of America y Sommelier por la Universad del Tepeyac.
                Cuenta con una experiencia de más de 30 años trabajando en la industria de la hospitalidad y 16 años en José Cuervo,
                actualmente como Gerente de Servicios Generales.
            `,
            image: '/FabiolaUrtiaga.png',
        },
        {
            id: '3',
            name: 'Tania Alejandra Zuleta Martínez',
            title: 'Travel Manager para Flextronics',
            category: 'Panel “Mujeres exitosas en la industria de viajes”',
            description: `
                Licenciada en Administración y Finanzas por la Universidad Panamericana campus Guadalajara.
                Especialista en el área de cuentas por pagar y viajes corporativos. Mi experiencia se ha basado en el análisis y negociación con los diferentes proveedores de viajes.
                Así como el estudio y conocimiento de los diferentes tipos de viajeros. Con una trayectoria de 20 años.
                Actualmente Travel manager de Flex para la región de LATAM y soporte para la región de EMEA.
            `,
            image: '/TaniaAlejandraZuleta.png',
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
                Licenciada en Informática por la Universidad Anáhuac, con un MBA por Kellogg School of Business de Northwestern University.
                Dirigió el Consejo Mundial de Viajes y Turismo (WTTC) desde 2017 como Presidenta y CEO. 
                Se incorporó al Ministerio de Turismo de Arabia Saudí como Asesora Especial Principal del Ministro en 2021 para apoyar la impresionante transformación en el marco de Visión 2030 y el desarrollo de Viajes y Turismo.
                Durante su estancia en el WTTC, creó iniciativas clave centradas en el turismo sostenible y los viajes sin interrupciones.
                Fue reconocida como una de las mujeres más influyentes de México por CNN, Forbes y Expansión.
                Actualmente forma parte del consejo de AMEX GBT (GBTG) y de la Autoridad Saudí de Turismo.
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