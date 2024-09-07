import Image from "next/image";

export default function Vista() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-[#006FCF] via-[#00175A] to-[#006FCF] animate-bgGradient">
       <Image
        src="/gbtwhite.svg"
        alt="American Express Logo"
        width={120}
        height={40}
        className="mb-8"
      />
      
    </div>
  );
}
