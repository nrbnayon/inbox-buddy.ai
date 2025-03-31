import { GiReceiveMoney } from "react-icons/gi";
import { FaUser, FaUserClock } from "react-icons/fa6";

export default function adminPage() {
  return (
    <section>
      {/* stat cards */}
      <div className="flex gap-3">
        {/* total users */}
        <div className="w-full flex justify-between px-8 py-6 rounded-xl border">
          <div className="flex flex-col justify-center">
            <FaUser size={30} color="#00ACDA" />
            <p className="text-lg mt-5">Total Users:</p>
          </div>
          <p className="h-full flex items-center text-3xl font-bold">5</p>
        </div>

        {/* total waiting list users */}
        <div className="w-full flex justify-between px-8 py-6 rounded-xl border">
          <div className="flex flex-col justify-center">
            <FaUserClock size={30} color="#e3e300" />
            <p className="text-lg mt-5">Total Waiting Users:</p>
          </div>
          <p className="h-full flex items-center text-3xl font-bold">5</p>
        </div>

        {/* total income */}
        <div className="w-full flex justify-between px-8 py-6 rounded-xl border">
          <div className="flex flex-col justify-center">
            <GiReceiveMoney size={30} color="#1ac72e" />
            <p className="text-lg mt-5">Total Income:</p>
          </div>
          <p className="h-full flex items-center text-3xl font-bold">$ 5</p>
        </div>
      </div>
    </section>
  );
}
