// app/(admin)/admin/components/AdminDashboard.jsx - Client Component
"use client";
import { GiReceiveMoney } from "react-icons/gi";
import { FaUser, FaUserClock } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { getAllUsers, getIncome, getAllWaitingListUsers } from "@/lib/api/user";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalWaitingUsers, setTotalWaitingUsers] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total users
        const usersResponse = await getAllUsers();
        setTotalUsers(usersResponse?.users?.length || 0);

        // Fetch total waiting users
        const waitingResponse = await getAllWaitingListUsers();
        const waitingCount =
          waitingResponse.data?.filter((entry) => entry.status === "waiting")
            .length || 0;

        console.log("Total waiting::", waitingCount);
        setTotalWaitingUsers(waitingCount);

        // Fetch total income
        const incomeResponse = await getIncome();
        setTotalIncome(incomeResponse.data?.total || 0);

        // Generate mock monthly data for charts
        // In a real application, you would fetch this data from your API
        const mockMonthlyData = generateMockMonthlyData(
          usersResponse?.users?.length || 0,
          waitingCount,
          incomeResponse.data?.total || 0
        );
        setMonthlyData(mockMonthlyData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper function to generate mock data for charts
  const generateMockMonthlyData = (users, waitingUsers, income) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const currentMonth = new Date().getMonth();

    return months.map((month, index) => {
      // Create realistic progressive data
      const monthIndex = index;
      const userGrowthFactor = 0.8 + monthIndex / 10;
      const waitingGrowthFactor = 0.7 + monthIndex / 8;
      const incomeGrowthFactor = 0.75 + monthIndex / 7;

      const monthUsers = Math.round(
        users * ((monthIndex + 1) / months.length) * userGrowthFactor
      );
      const monthWaiting = Math.round(
        waitingUsers * ((monthIndex + 1) / months.length) * waitingGrowthFactor
      );
      const monthIncome = Math.round(
        income * ((monthIndex + 1) / months.length) * incomeGrowthFactor
      );

      return {
        name: month,
        users: monthUsers,
        waitingUsers: monthWaiting,
        income: monthIncome,
      };
    });
  };

  return (
    <>
      {/* Original stat cards - kept unchanged */}
      <div className="flex gap-3">
        {/* total users */}
        <div className="w-full flex justify-between px-8 py-6 rounded-xl border">
          <div className="flex flex-col justify-center">
            <FaUser size={30} color="#00ACDA" />
            <p className="text-lg mt-5">Total Users:</p>
          </div>
          <p className="h-full flex items-center text-3xl font-bold">
            {loading ? "..." : error ? "Error" : totalUsers}
          </p>
        </div>

        {/* total waiting list users */}
        <div className="w-full flex justify-between px-8 py-6 rounded-xl border">
          <div className="flex flex-col justify-center">
            <FaUserClock size={30} color="#e3e300" />
            <p className="text-lg mt-5">Total Waiting Users:</p>
          </div>
          <p className="h-full flex items-center text-3xl font-bold">
            {loading ? "..." : error ? "Error" : totalWaitingUsers}
          </p>
        </div>

        {/* total income */}
        <div className="w-full flex justify-between px-8 py-6 rounded-xl border">
          <div className="flex flex-col justify-center">
            <GiReceiveMoney size={30} color="#1ac72e" />
            <p className="text-lg mt-5">Total Income:</p>
          </div>
          <p className="h-full flex items-center text-3xl font-bold">
            {loading ? "..." : error ? "Error" : `$ ${totalIncome}`}
          </p>
        </div>
      </div>

      {/* {loading ? (
        <div className="text-center py-10">Loading charts data...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">
          Error loading chart data
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          <div className="p-4 rounded-xl border">
            <h3 className="text-lg font-semibold mb-4">User Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="users" fill="#00ACDA" name="Active Users" />
                  <Bar
                    dataKey="waitingUsers"
                    fill="#e3e300"
                    name="Waiting Users"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-4 rounded-xl border">
            <h3 className="text-lg font-semibold mb-4">Income Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, "Income"]} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#1ac72e"
                    activeDot={{ r: 8 }}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}
