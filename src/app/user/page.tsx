"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UserPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Bienvenido a la Página de Usuario</h1>
      <iframe
        src="https://example.com"
        title="Contenido externo"
        className="w-full h-96 border"
      ></iframe>
    </div>
  );
}
