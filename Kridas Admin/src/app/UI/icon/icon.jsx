import { FiLogOut } from "react-icons/fi";

import { HiMail } from "react-icons/hi";

import {
  MdVisibility,
  MdVisibilityOff,
  MdOutlineSupervisorAccount,
  MdModeEdit,
} from "react-icons/md";

// **********************************************************************************
export const EditIcon = (props) => <MdModeEdit {...props} />;

// **********************************************************************************
export const LogOut = (props) => <FiLogOut {...props} />;

// **********************************************************************************

export const MailIcon = (props) => <HiMail {...props} />;

// **********************************************************************************
export const UsersIcon = (props) => <MdOutlineSupervisorAccount {...props} />;

// **********************************************************************************
export const VisibleIcon = (props) => <MdVisibility {...props} />;
export const VisibleOffIcon = (props) => <MdVisibilityOff {...props} />;
export const VerifiedIcon = (props) => <GoVerified {...props} />;

// **********************************************************************************
