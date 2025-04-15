// app/(admin)/admin/components/AdminDashboard.jsx
"use client";
import { GiReceiveMoney } from "react-icons/gi";
import { FaUser, FaUserClock } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { getIncome, getUserStats } from "@/lib/api/user";
import SmallLoader from "@/components/SmallLoader";

export default function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalWaitingUsers, setTotalWaitingUsers] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total users
        const stats = await getUserStats();

        setTotalUsers(stats.totalUsers);
        setTotalWaitingUsers(stats.waitingListUsers);

        // Fetch total income
        const incomeResponse = await getIncome();
        setTotalIncome(incomeResponse?.totalIncome || 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex gap-3">
        {/* total users */}
        <div className="w-full flex justify-between px-8 py-6 rounded-xl border">
          <div className="flex flex-col justify-center">
            <FaUser size={30} color="#00ACDA" />
            <p className="text-lg mt-5">Total Users:</p>
          </div>
          <p className="h-full flex items-center text-3xl font-bold">
            {loading ? <SmallLoader /> : error ? "Error" : totalUsers}
          </p>
        </div>

        {/* total waiting list users */}
        <div className="w-full flex justify-between px-8 py-6 rounded-xl border">
          <div className="flex flex-col justify-center">
            <FaUserClock size={30} color="#e3e300" />
            <p className="text-lg mt-5">Total Waiting Users:</p>
          </div>
          <p className="h-full flex items-center text-3xl font-bold">
            {loading ? <SmallLoader /> : error ? "Error" : totalWaitingUsers}
          </p>
        </div>

        {/* total income */}
        <div className="w-full flex justify-between px-8 py-6 rounded-xl border">
          <div className="flex flex-col justify-center">
            <GiReceiveMoney size={30} color="#1ac72e" />
            <p className="text-lg mt-5">Total Income:</p>
          </div>
          <p className="h-full flex items-center text-3xl font-bold">
            {loading ? <SmallLoader /> : error ? "Error" : `$ ${totalIncome}`}
          </p>
        </div>
      </div>
    </>
  );
}
