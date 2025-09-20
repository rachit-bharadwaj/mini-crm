"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { Layout } from "../../../components/Layout";
import api from "../../../lib/api";
import { Edit, Trash2, Plus, Mail, Phone, Building, Calendar, DollarSign, Target } from "lucide-react";
import Link from "next/link";
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

interface Lead {
  _id: string;
  title: string;
  description: string;
  status: "New" | "Contacted" | "Converted" | "Lost";
  value: number;
  createdAt: string;
  updatedAt: string;
}

interface CustomerDetailResponse {
  customer: Customer;
  leads: Lead[];
}

const statusColors = {
  New: "bg-blue-100 text-blue-800",
  Contacted: "bg-yellow-100 text-yellow-800",
  Converted: "bg-green-100 text-green-800",
  Lost: "bg-red-100 text-red-800",
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<CustomerDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const customerId = params.id as string;

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/customers/${customerId}`);
        setData(response.data);
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

  const handleDelete = async () => {
    try {
      await api.delete(`/customers/${customerId}`);
      toast.success("Customer deleted successfully");
      router.push("/customers");
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error("Failed to delete customer");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

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

  if (!data) {
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

  const { customer, leads } = data;
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
              <p className="mt-1 text-sm text-gray-500">{customer.company}</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href={`/customers/${customerId}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Customer Information
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Contact details and company information
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {customer.name}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email address</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      {customer.email}
                    </div>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      {customer.phone}
                    </div>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-400 mr-2" />
                      {customer.company}
                    </div>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      {formatDate(customer.createdAt)}
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Leads Section */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Leads ({leads.length})
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Total value: {formatCurrency(totalValue)}
                </p>
              </div>
              <Link
                href={`/customers/${customerId}/leads/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Link>
            </div>
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <Target className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No leads</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new lead for this customer.
                </p>
                <div className="mt-6">
                  <Link
                    href={`/customers/${customerId}/leads/new`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lead
                  </Link>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {leads.map((lead) => (
                    <li key={lead._id}>
                      <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                              <Target className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {lead.title}
                              </p>
                              <span
                                className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[lead.status]}`}
                              >
                                {lead.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              {lead.description}
                            </p>
                            <div className="flex items-center mt-1">
                              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                              <p className="text-sm text-gray-500">
                                {formatCurrency(lead.value)}
                              </p>
                              <Calendar className="h-4 w-4 text-gray-400 ml-4 mr-1" />
                              <p className="text-sm text-gray-500">
                                {formatDate(lead.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/customers/${customerId}/leads/${lead._id}/edit`}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Delete Confirmation Modal */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mt-2">
                    Delete Customer
                  </h3>
                  <div className="mt-2 px-7 py-3">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this customer? This action cannot be undone
                      and will also delete all associated leads.
                    </p>
                  </div>
                  <div className="flex justify-center space-x-4 mt-4">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
