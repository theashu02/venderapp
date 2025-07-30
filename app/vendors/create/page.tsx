"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import VendorForm from '@/app/components/VendorForm';

export default function CreateVendorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <VendorForm />
    </div>
  );
}