"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import { Target, FileText, DollarSign } from "lucide-react";
import toast from "react-hot-toast";

interface LeadFormData {
  title: string;
  description: string;
  status: "New" | "Contacted" | "Converted" | "Lost";
  value: number;
}

interface LeadFormProps {
  initialData?: LeadFormData;
  customerId: string;
  leadId?: string;
  isEdit?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialData,
  customerId,
  leadId,
  isEdit = false,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    defaultValues: initialData || {
      status: "New",
      value: 0,
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsLoading(true);
    try {
      if (isEdit && leadId) {
        await api.put(`/customers/${customerId}/leads/${leadId}`, data);
        toast.success("Lead updated successfully!");
      } else {
        await api.post(`/customers/${customerId}/leads`, data);
        toast.success("Lead created successfully!");
      }
      router.push(`/customers/${customerId}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save lead");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Lead Title *
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Target className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 5,
                  message: "Title must be at least 5 characters",
                },
                maxLength: {
                  value: 200,
                  message: "Title cannot exceed 200 characters",
                },
              })}
              type="text"
              className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter lead title"
            />
          </div>
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
                maxLength: {
                  value: 1000,
                  message: "Description cannot exceed 1000 characters",
                },
              })}
              rows={4}
              className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter lead description"
            />
          </div>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="mt-1">
              <select
                {...register("status")}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">
              Value ($) *
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("value", {
                  required: "Value is required",
                  min: {
                    value: 0,
                    message: "Value cannot be negative",
                  },
                  valueAsNumber: true,
                })}
                type="number"
                step="0.01"
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.push(`/customers/${customerId}`)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : isEdit ? "Update Lead" : "Create Lead"}
        </button>
      </div>
    </form>
  );
};
