"use client";

import React from "react";
import { ProtectedRoute } from "../../../components/ProtectedRoute";
import { Layout } from "../../../components/Layout";
import { CustomerForm } from "../../../components/CustomerForm";

export default function NewCustomerPage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Customer</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a new customer record
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
            </div>
            <div className="px-6 py-4">
              <CustomerForm />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
