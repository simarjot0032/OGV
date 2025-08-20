'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/global.scss';

const DashboardPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard/upload');
  }, [router]);

  return null;
};

export default DashboardPage;
