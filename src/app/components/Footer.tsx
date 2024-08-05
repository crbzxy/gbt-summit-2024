import React from 'react';
import Image from 'next/image'; // Importar el componente Image de next/image

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#00175A] text-white py-8">
            <div className="container mx-auto px-4 flex-col items-center max-w-6xl">
                <Image
                    src="/gbtwhite.png" // Cambia esta ruta por la ubicación real de tu logo
                    alt="American Express Global Business Travel Logo"
                    className="mb-4"
                    width={150} // Ajusta el tamaño del logo según sea necesario
                    height={75} // Proporcional al width (ajustar según diseño)
                />
                <div className="flex-1 text-left">
                    <p className="text-sm mb-2">
                        Los servicios de American Express Global Business Travel utilizan información personal como se describe en el{' '}
                        <a href="/privacy-policy" className="underline">
                            Aviso de privacidad global de GBT
                        </a>.
                    </p>
                    <p className="text-sm mb-2">
                        American Express Global Business Travel (Amex GBT) es una empresa de riesgo compartido que no es en su totalidad de American Express Company o cualquiera de sus
                        filiales (American Express). &quot;American Express Global Business Travel&quot;, &quot;American Express&quot; y el logo de American Express son marcas comerciales de American
                        Express y se usan con licencia limitada.
                    </p>
                    <p className="text-sm mb-2">
                        Este documento contiene información no publicada, confidencial y de propiedad de American Express Global Business Travel (Amex GBT). No se puede divulgar o usar
                        ninguna parte de este material sin el consentimiento expresado por escrito de Amex GBT.
                    </p>
                    <p className="text-sm">
                        © 2024 GBT Travel Services UK Limited.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
