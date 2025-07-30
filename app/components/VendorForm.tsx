"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface VendorFormProps {
  vendorId?: string;
}

interface VendorData {
  name: string;
  bankAccountNo: string;
  bankName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  zipCode: string;
}

export default function VendorForm({ vendorId }: VendorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<VendorData>({
    name: "",
    bankAccountNo: "",
    bankName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    zipCode: "",
  });

  useEffect(() => {
    if (vendorId) {
      // Fetch vendor data if editing
      const fetchVendor = async () => {
        try {
          setLoading(true);
          const res = await fetch(`/api/vendors/${vendorId}`);

          if (!res.ok) {
            throw new Error("Failed to fetch vendor");
          }

          const data = await res.json();
          setFormData(data);
        } catch (err: any) {
          setError(err.message || "Error fetching vendor");
        } finally {
          setLoading(false);
        }
      };

      fetchVendor();
    }
  }, [vendorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = vendorId ? `/api/vendors/${vendorId}` : "/api/vendors";
      const method = vendorId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save vendor");
      }

      // Redirect to vendors list
      router.push("/vendors");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Error saving vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-0 w-full max-w-2xl bg-gray-50">
      <div className="absolute left-5 top-5">
        <Link href={`/vendors`}>
          <Button
            variant="secondary"
            size="sm"
            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
          >
            <ArrowLeft /> Back
          </Button>
        </Link>
      </div>
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center">
          {vendorId ? "Edit Vendor" : "Create Vendor"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Vendor Name*
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bankAccountNo" className="text-sm font-medium">
                Bank Account No.*
              </label>
              <input
                id="bankAccountNo"
                name="bankAccountNo"
                type="text"
                required
                value={formData.bankAccountNo}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="bankName" className="text-sm font-medium">
                Bank Name*
              </label>
              <input
                id="bankName"
                name="bankName"
                type="text"
                required
                value={formData.bankName}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="addressLine1" className="text-sm font-medium">
                Address Line 1
              </label>
              <input
                id="addressLine1"
                name="addressLine1"
                type="text"
                value={formData.addressLine1}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="addressLine2" className="text-sm font-medium">
                Address Line 2*
              </label>
              <input
                id="addressLine2"
                name="addressLine2"
                type="text"
                required
                value={formData.addressLine2}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="zipCode" className="text-sm font-medium">
                Zip Code
              </label>
              <input
                id="zipCode"
                name="zipCode"
                type="text"
                value={formData.zipCode}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              onClick={() => router.push("/vendors")}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading
                ? "Saving..."
                : vendorId
                ? "Update Vendor"
                : "Create Vendor"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
