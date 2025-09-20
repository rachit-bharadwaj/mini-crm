"use client";

import React from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "../../../../../components/ProtectedRoute";
import { Layout } from "../../../../../components/Layout";
import { LeadForm } from "../../../../../components/LeadForm";

export default function NewLeadPage() {
  const params = useParams();
  const customerId = params.id as string;

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Lead</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create a new lead for this customer
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Lead Information</h3>
            </div>
            <div className="px-6 py-4">
              <LeadForm customerId={customerId} />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
