"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, use } from 'react';
import VendorForm from '@/app/components/VendorForm';
// { params: { id: string } } -> { params: Promise<{ id: string }> }
export default function EditVendorPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex mx-auto p-12 h-screen justify-center bg-gray-50">
      <VendorForm vendorId={id} />
    </div>
  );
}