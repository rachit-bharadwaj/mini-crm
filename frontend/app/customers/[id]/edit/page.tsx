"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "../../../../components/ProtectedRoute";
import { Layout } from "../../../../components/Layout";
import { CustomerForm } from "../../../../components/CustomerForm";
import api from "../../../../lib/api";
import toast from "react-hot-toast";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  const customerId = params.id as string;

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/customers/${customerId}`);
        setCustomer(response.data.customer);
      } catch (error) {
        console.error("Failed to fetch customer:", error);
        toast.error("Failed to fetch customer details");
        router.push("/customers");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomer();
    }
  }, [customerId, router]);

  if (loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  if (!customer) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="text-center">
            <p className="text-gray-500">Customer not found</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Customer</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update customer information
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
            </div>
            <div className="px-6 py-4">
              <CustomerForm
                initialData={{
                  name: customer.name,
                  email: customer.email,
                  phone: customer.phone,
                  company: customer.company,
                }}
                customerId={customerId}
                isEdit={true}
              />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
