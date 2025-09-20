"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "../../../../../../components/ProtectedRoute";
import { Layout } from "../../../../../../components/Layout";
import { LeadForm } from "../../../../../../components/LeadForm";
import api from "../../../../../../lib/api";
import toast from "react-hot-toast";

interface Lead {
  _id: string;
  title: string;
  description: string;
  status: "New" | "Contacted" | "Converted" | "Lost";
  value: number;
  createdAt: string;
  updatedAt: string;
}

export default function EditLeadPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  const customerId = params.id as string;
  const leadId = params.leadId as string;

  useEffect(() => {
    const fetchLead = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/customers/${customerId}/leads/${leadId}`);
        setLead(response.data.lead);
      } catch (error) {
        console.error("Failed to fetch lead:", error);
        toast.error("Failed to fetch lead details");
        router.push(`/customers/${customerId}`);
      } finally {
        setLoading(false);
      }
    };

    if (customerId && leadId) {
      fetchLead();
    }
  }, [customerId, leadId, router]);

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

  if (!lead) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="text-center">
            <p className="text-gray-500">Lead not found</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Edit Lead</h1>
            <p className="mt-1 text-sm text-gray-500">
              Update lead information
            </p>
          </div>

          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Lead Information</h3>
            </div>
            <div className="px-6 py-4">
              <LeadForm
                initialData={{
                  title: lead.title,
                  description: lead.description,
                  status: lead.status,
                  value: lead.value,
                }}
                customerId={customerId}
                leadId={leadId}
                isEdit={true}
              />
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
