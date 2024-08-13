import { MdOutlineSupervisorAccount } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";
import { SiPowerpages } from "react-icons/si";
import { MdVerified } from "react-icons/md";


export const userPagesDetails = [
  {
    icon: <MdOutlineSupervisorAccount />,
    title: "Users",
    iconColor: "#03C9D7",
    iconBg: "#E5FAFB",
    pcColor: "red-600",
    type: "USERS",
  },
  {
    icon: <FaUserCheck />,
    title: "Verified Users",
    iconColor: "rgb(255, 244, 229)",
    iconBg: "rgb(254, 201, 15)",
    pcColor: "green-600",
    type: "VUSERS",
  },
  {
    icon: <SiPowerpages />,
    title: "Pages",
    iconColor: "rgb(228, 106, 118)",
    iconBg: "rgb(255, 244, 229)",
    pcColor: "green-600",
    type: "PAGES",
  },
  {
    icon: <MdVerified />,
    title: "Verified Pages",
    iconColor: "rgb(0, 194, 146)",
    iconBg: "rgb(235, 250, 242)",
    pcColor: "red-600",
    type: "VPAGES",
  },
];
