import DashboardSharpIcon from "@mui/icons-material/DashboardSharp";
import PeopleIcon from "@mui/icons-material/People";
import PagesIcon from "@mui/icons-material/Pages";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

const listItems = [
  {
    id: 0,
    name: "Dashboard",
    icon: <DashboardSharpIcon />,
    path: "home",
    sub: [
      {
        id: 0,
        name: "Analytics",
        icon: <PersonAddIcon />,
        path: "analytics",
      },
    ],
  },
  {
    id: 1,
    name: "User",
    icon: <PeopleIcon />,
    path: "user",
    sub: [
      {
        id: 0,
        name: "All Users",
        icon: <PersonAddIcon />,
        path: "user/allusers",
      },
    ],
  },
  {
    id: 2,
    name: "Pages",
    icon: <PagesIcon />,
    path: "pages",
    sub: [
      {
        id: 0,
        name: "All Pages",
        icon: <PersonAddIcon />,
        path: "pages/allpages",
      },
    ],
  },
  {
    id: 3,
    name: "Master",
    icon: <PersonAddIcon />,
    path: "/reports",
    sub: [
      {
        id: 0,
        name: "Countries",
        icon: <PersonAddIcon />,
        path: "master/countries",
      },
      {
        id: 0,
        name: "Category",
        icon: <PersonAddIcon />,
        path: "master/categoty",
      },
      {
        id: 0,
        name: "Lookup",
        icon: <PersonAddIcon />,
        path: "master/lookup",
      },

      {
        id: 0,
        name: "LookupType",
        icon: <PersonAddIcon />,
        // path: "/masters/lookuptype",
        path: "master/lookuptype",
      },
      {
        id: 0,
        name: "Sports",
        icon: <PersonAddIcon />,
        path: "master/sports",
      },
    ],
  },
  {
    id: 4,
    name: "Verification",
    icon: <EmojiEventsIcon />,
    path: "/sports",
    sub: [
      {
        id: 0,
        name: "User",
        icon: <PersonAddIcon />,
        path: "verification/user",
      },
      {
        id: 0,
        name: "Company",
        icon: <PersonAddIcon />,
        path: "verification/company",
      },
    ],
  },
  {
    id: 5,
    name: "Events",
    icon: <EmojiEventsIcon />,
    path: "/sports",
    sub: [
      {
        id: 0,
        name: "All Events",
        icon: <PersonAddIcon />,
        path: "events/all",
      },
    ],
  },
  {
    id: 6,
    name: "Articles",
    icon: <EmojiEventsIcon />,
    path: "/sports",
    sub: [
      {
        id: 0,
        name: "All Articles",
        icon: <PersonAddIcon />,
        path: "articles/all",
      },
    ],
  },
  {
    id: 7,
    name: "Market Place",
    icon: <PersonAddIcon />,
    path: "marketplace",
    sub: [
      {
        id: 0,
        name: "Products",
        icon: <PersonAddIcon />,
        path: "marketplace/products",
      },
      {
        id: 0,
        name: "Services",
        icon: <PersonAddIcon />,
        path: "marketplace/services",
      },
      {
        id: 0,
        name: "Vouchers",
        icon: <PersonAddIcon />,
        path: "marketplace/vouchers",
      },

      {
        id: 0,
        name: "Orders",
        icon: <PersonAddIcon />,
        // path: "/masters/lookuptype",
        path: "marketplace/orders",
      },
    ],
  },
];

export default listItems;
