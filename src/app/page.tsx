"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Home from './home/page';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const { role } = JSON.parse(atob(token.split('.')[1]));
      if (role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    }
  }, [router]);

  return <Home />;
}
