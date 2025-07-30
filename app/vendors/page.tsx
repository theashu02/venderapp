"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {Trash2,Edit3,ArrowLeft } from 'lucide-react'

interface Vendor {
  _id: string;
  name: string;
  bankAccountNo: string;
  bankName: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function VendorsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const fetchVendors = async (page = 1) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/vendors?page=${page}&limit=10`);

      if (!res.ok) {
        throw new Error("Failed to fetch vendors");
      }

      const data = await res.json();
      setVendors(data.vendors);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || "Error fetching vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchVendors();
    }
  }, [session]);

  const handlePageChange = (newPage: number) => {
    fetchVendors(newPage);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/vendors/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete vendor");
      }

      // Refresh the list
      fetchVendors(pagination.page);
      setShowConfirm(false);
      setDeleteId(null);
    } catch (err: any) {
      setError(err.message || "Error deleting vendor");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  if (!session) {
    return null; 
  }

  return (
    <div className="container mx-auto max-w-6xl h-[50%]">
      <div className="absolute left-5 top-5">
        <Link href={`/`}>
          <Button
            variant="secondary"
            size="sm"
            className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
          >
            <ArrowLeft /> Back
          </Button>
        </Link>
      </div>
      <Card className="shadow-lg border-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Vendors</CardTitle>
          <Button
            onClick={() => router.push("/vendors/create")}
            className="bg-stone-600 text-white hover:bg-stone-700 hover:text-[#f4f4f4]"
          >
            Add New Vendor
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {showConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
                <p>
                  Are you sure you want to delete this vendor? This action
                  cannot be undone.
                </p>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button
                    onClick={() => setShowConfirm(false)}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {loading && vendors.length === 0 ? (
            <div className="text-center py-8">Loading vendors...</div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-8">
              <p className="mb-4">No vendors found.</p>
              <Button
                onClick={() => router.push("/vendors/create")}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Add Your First Vendor
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left p-2 border-b">Vendor Name</th>
                      <th className="text-left p-2 border-b">
                        Bank Account No.
                      </th>
                      <th className="text-left p-2 border-b">Bank Name</th>
                      <th className="text-left p-2 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor) => (
                      <tr
                        key={vendor._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="p-2">{vendor.name}</td>
                        <td className="p-2">{vendor.bankAccountNo}</td>
                        <td className="p-2">{vendor.bankName}</td>
                        <td className="p-2">
                          <div className="flex items-center gap-3">
                            <Link href={`/vendors/edit/${vendor._id}`}>
                              <Button
                                variant="secondary"
                                size="sm"
                                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                              >
                                <Edit3 /> Edit
                              </Button>
                            </Link>
                            <Button
                              onClick={() => confirmDelete(vendor._id)}
                              variant="destructive"
                              size="sm"
                              className="hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                            >
                              <Trash2 /> Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center space-x-2 mt-1">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: pagination.totalPages },
                      (_, i) => i + 1
                    ).map((page) => (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 ${
                          pagination.page === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:opacity-50"
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
