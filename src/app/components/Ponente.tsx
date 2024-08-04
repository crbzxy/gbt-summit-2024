import Image from 'next/image';

interface PonenteProps {
  name: string;
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
}

const Ponente: React.FC<PonenteProps> = ({ name, title, description, image, reverse = false }) => {
  return (
    <div
      className={`flex flex-col md:flex-row ${
        reverse ? 'md:flex-row-reverse' : ''
      } items-center   overflow-hidden my-8`}
    >
      <div className="md:w-1/4 w-full p-4 flex justify-center items-center bg-blue-50">
        <Image
          className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-white shadow-md"
          src={image}
          alt={`Image of ${name}`}
          width={192}
          height={192}
        />
      </div>
      <div className="md:w-3/4 w-full p-6">
        <h2 className="text-2xl font-bold text-blue-800">{name}</h2>
        <h3 className="text-lg font-semibold text-blue-700 mb-2">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </div>
  );
};

export default Ponente;
