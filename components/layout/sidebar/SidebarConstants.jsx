import { MdOutlineDashboard } from "react-icons/md";
import { MdOutlineChatBubbleOutline } from "react-icons/md";

export const navLinks = [
  {
    path: "/dashboard",
    icon: MdOutlineDashboard,
    label: "Dashboard",
  },
  {
    path: "/chat",
    icon: MdOutlineChatBubbleOutline,
    label: "Chat",
    isChat: true,
  },
  // {
  //   path: "#",
  //   icon: RiSettings2Line,
  //   label: "Your Apps",
  // },
];

export const publicRoutes = [
  "/",
  "/about",
  "/connect",
  "/pricing",
  "/team",
  "/login",
];
