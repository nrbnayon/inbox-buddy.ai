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

// Sample previous chats - in a real app, this would come from an API or state
// const previousChats = [
//   { id: "1", path: "/chat/previous-1", label: "Previous Chat 1" },
//   { id: "2", path: "/chat/previous-2", label: "Previous Chat 2" },
//   { id: "3", path: "/chat/previous-3", label: "Previous Chat 3" },
// ];

export const publicRoutes = [
  "/",
  "/about",
  "/connect",
  "/pricing",
  "/team",
  "/login",
];
