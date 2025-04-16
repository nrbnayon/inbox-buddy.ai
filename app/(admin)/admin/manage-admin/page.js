import { RiAdminFill } from "react-icons/ri";
import AdminListTable from "./components/AdminListTable";
export default function manageAdminPage() {
  return (
    <div>
      <h2 className="text-2xl ml-6 mt-10 mb-5 font-bold flex gap-2">
        <RiAdminFill size={30} />
        Admins List:
      </h2>
      <AdminListTable />
    </div>
  );
}
