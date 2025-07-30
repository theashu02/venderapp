"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import VendorForm from "@/app/components/VendorForm";

export default function CreateVendorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex mx-auto py-12 h-screen justify-center">
      <VendorForm />
    </div>
  );
}
