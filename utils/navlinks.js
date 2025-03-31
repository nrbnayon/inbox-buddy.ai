import { LiaUserClockSolid } from "react-icons/lia";
import { RxDashboard } from "react-icons/rx";
import { PiUsersThree } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { LuBrainCircuit } from "react-icons/lu";
import { RiUserForbidLine } from "react-icons/ri";

const navLinks = [
  {
    path: "/admin",
    icon: RxDashboard,
    label: "Dashboard",
  },
  {
    path: "/admin/users",
    icon: PiUsersThree,
    label: "Users",
  },
  {
    path: "/admin/waiting-list",
    icon: LiaUserClockSolid,
    label: "Waiting List",
  },
  {
    path: "/admin/blocked-users",
    icon: RiUserForbidLine,
    label: "Blocked Users",
  },
  {
    path: "/admin/manage-admin",
    icon: RiAdminLine,
    label: "Manage Admins",
  },
  {
    path: "/admin/train-ai",
    icon: LuBrainCircuit,
    label: "Train Ai",
  },
];

export default navLinks;
