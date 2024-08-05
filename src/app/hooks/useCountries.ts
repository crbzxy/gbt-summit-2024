import { useEffect, useState } from "react";

export type Country = {
  name: string;
  code: string;
};

const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        console.log(response)
        if (!response.ok) {
          throw new Error("Error al obtener la lista de países");
        }
        const data = await response.json();
        const formattedCountries = data.map((country: any) => ({
          name: country.name.common,
          code: country.cca2,
        }));
        setCountries(formattedCountries);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};

export default useCountries;
