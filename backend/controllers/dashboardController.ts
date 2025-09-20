import { Request, Response } from "express";
import Customer from "../models/Customer";
import Lead from "../models/Lead";
import connectDB from "../database/connection/mongoose";

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    await connectDB();

    // Get basic counts
    const totalCustomers = await Customer.countDocuments({ ownerId: userId });
    const totalLeads = await Lead.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $match: {
          "customer.ownerId": userId,
        },
      },
      {
        $count: "total",
      },
    ]);

    // Get leads by status
    const leadsByStatus = await Lead.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $match: {
          "customer.ownerId": userId,
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalValue: { $sum: "$value" },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Get total value by status
    const totalValueByStatus = leadsByStatus.reduce((acc, item) => {
      acc[item._id] = item.totalValue;
      return acc;
    }, {} as Record<string, number>);

    // Get recent leads (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentLeads = await Lead.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $match: {
          "customer.ownerId": userId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $count: "total",
      },
    ]);

    // Get leads created in the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const leadsLastWeek = await Lead.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $match: {
          "customer.ownerId": userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $count: "total",
      },
    ]);

    // Get top customers by lead count
    const topCustomers = await Lead.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      {
        $match: {
          "customer.ownerId": userId,
        },
      },
      {
        $group: {
          _id: "$customerId",
          leadCount: { $sum: 1 },
          totalValue: { $sum: "$value" },
          customerName: { $first: "$customer.name" },
          customerCompany: { $first: "$customer.company" },
        },
      },
      {
        $sort: { leadCount: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({
      stats: {
        totalCustomers,
        totalLeads: totalLeads[0]?.total || 0,
        recentLeads: recentLeads[0]?.total || 0,
        leadsLastWeek: leadsLastWeek[0]?.total || 0,
      },
      leadsByStatus,
      totalValueByStatus,
      topCustomers,
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
