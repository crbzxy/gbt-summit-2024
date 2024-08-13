import Image from "next/image";

interface PonenteProps {
  name: string;
  title: string;
  category: string;
  description: string;
  image: string;
  reverse?: boolean;
  index: number; // Agrega esta línea
}

const Ponente: React.FC<PonenteProps> = ({ name, title, category, description, image, reverse = false, index }) => {
  return (
    <div className={`flex flex-col text-left overflow-hidden my-8`}>
      <p className="text-4xl font-bold text-[#006FCF] mb-12">
        Ponente {index + 1}: {category}
      </p>

      <div className="w-full p-4 flex justify-center items-center">
        <Image
          className="w-32 h-32 md:w-48 md:h-48 bg-transparent"
          src={image}
          alt={`Image of ${name}`}
          width={192}
          height={192}
        />

        <div className="p-6">
          <h2 className="text-2xl font-bold text-[#006FCF]">{name}</h2>
          <h3 className="text-lg font-semibold text-[#006FCF] mb-2">{title}</h3>
        </div>
      </div>
      <p className="text-gray-700 whitespace-pre-line">{description}</p>
    </div>
  );
};

export default Ponente;
