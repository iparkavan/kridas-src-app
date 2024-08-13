import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import ImageOutlinedIcon from "@material-ui/icons/ImageOutlined";
import MonetizationOnOutlinedIcon from "@material-ui/icons/MonetizationOnOutlined";
import AssessmentOutlinedIcon from "@material-ui/icons/AssessmentOutlined";
import WallpaperOutlinedIcon from "@material-ui/icons/WallpaperOutlined";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CategoryIcon from "@material-ui/icons/Category";
import FlagIcon from "@material-ui/icons/Flag";
import SportsBaseballIcon from "@material-ui/icons/SportsBaseball";
import { menuActions } from "../../../../store/menuSlice";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import Collapse from "@material-ui/core/Collapse";
import clsx from "clsx";
import DashboardRoundedIcon from "@material-ui/icons/DashboardRounded";
import GroupRoundedIcon from "@material-ui/icons/GroupRounded";
import BusinessRoundedIcon from "@material-ui/icons/BusinessRounded";
import LibraryBooksRoundedIcon from "@material-ui/icons/LibraryBooksRounded";
import { Person } from "@material-ui/icons";
import DnsIcon from "@material-ui/icons/Dns";
import PagesOutlinedIcon from "@material-ui/icons/PagesOutlined";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useHistory } from "react-router-dom";
import { PersonOutline } from "@material-ui/icons";
import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";
import AssignmentIcon from "@material-ui/icons/Assignment";
import ArtTrackIcon from "@material-ui/icons/ArtTrack";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";

const useStyles = makeStyles((theme) => ({
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar,
  },

  drawer: {
    width: theme.drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: theme.drawerWidth,
    position: "fixed",
    whiteSpace: "nowrap",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9),
    },
  },
  drawerHeader: {
    ...theme.mixins.toolbar,
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: theme.spacing(0, 1),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const listItems = [
  {
    id: 0,
    name: "Dashboard",
    icon: () => <HomeOutlinedIcon />,
    path: "/home",
    sub: [
      {
        id: 0,
        name: "User",
        icon: () => <HomeOutlinedIcon />,
        path: "/dashboard/user",
      },
      {
        id: 0,
        name: "Company",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Events",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Ecommerce",
        icon: () => <HomeOutlinedIcon />,
      },
    ],
  },
  {
    id: 1,
    name: "User",
    icon: () => <ImageOutlinedIcon />,
    path: "/user",
    sub: [
      {
        id: 0,
        name: "All Users",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Organizers",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Player",
        icon: () => <HomeOutlinedIcon />,
      },
    ],
  },
  {
    id: 2,
    name: "Company",
    icon: () => <MonetizationOnOutlinedIcon />,
    path: "/organizer",
    sub: [
      {
        id: 0,
        name: "All Company",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Organizers",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Brands",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Sponsers",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Clubs",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Service Providers",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Venues",
        icon: () => <HomeOutlinedIcon />,
      },
    ],
  },
  {
    id: 3,
    name: "Event",
    icon: () => <WallpaperOutlinedIcon />,
    path: "/sports",
    sub: [
      {
        id: 0,
        name: "All Events",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Event Category",
        icon: () => <HomeOutlinedIcon />,
      },
    ],
  },
  {
    id: 4,
    name: "Ecommerce",
    icon: () => <AssessmentOutlinedIcon />,
    path: "/reports",
    sub: [
      {
        id: 0,
        name: "Products",
        icon: () => <HomeOutlinedIcon />,
      },
    ],
  },
  {
    id: 5,
    name: "Master",
    icon: () => <AssessmentOutlinedIcon />,
    path: "/reports",
    sub: [
      {
        id: 0,
        name: "Countries",
        icon: () => <HomeOutlinedIcon />,
      },
      {
        id: 0,
        name: "Category",
        icon: () => <CategoryIcon />,
      },
      {
        id: 0,
        name: "Lookup",
        icon: () => <StarBorder />,
        path: "/masters/lookup",
      },

      {
        id: 0,
        name: "LookupType",
        icon: () => <StarBorder />,
        // path: "/masters/lookuptype",
      },
      {
        id: 0,
        name: "Sports",
        icon: () => <SportsBaseballIcon />,
      },
    ],
  },
  {
    id: 6,
    name: "Organizer",
    icon: () => <AssessmentOutlinedIcon />,
    path: "/organizers",
    sub: [
      {
        id: 0,
        name: "All Organizers",
        icon: () => <HomeOutlinedIcon />,
      },
    ],
  },
  {
    id: 7,
    name: "Profile Verification",
    // icon: () => <PeopleAlt />,
    path: "/profile-verification",
    sub: [
      // {
      //   id: 0,
      //   name: "Approvel",
      //   // icon: () => <VerifiedUser />,
      //   path: "/profile-verification/Approvel",
      // },
      {
        id: 0,
        name: "User",
        // icon: () => <VerifiedUser />,
        path: "/profile-verification/users",
      },
      {
        id: 0,
        name: "Comapny",
        // icon: () => <VerifiedUser />,
        path: "/profile-verification/comapny",
      },
    ],
  },
  {
    id: 8,
    name: "Events",
    path: "/events",
    sub: [
      {
        id: 0,
        name: "All Events",
        path: "/events",
      },
    ],
  },
];

const SideMenu = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const [selectedItem] = useState(0);

  const [openDash, setOpenDash] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openCom, setOpenCom] = useState(false);
  const [openMas, setOpenMas] = useState(false);
  const [openPro, setOpenPro] = useState(false);
  const [openEvent, setOpenEvent] = useState(false);
  const [openArticle, setOpenArticle] = useState(false);
  const [openVendorOnboarding, setOpenVendorOnboarding] = useState(false);
  const [openMarketPlace, setOpenMarketPlace] = useState(false);

  const handleClickDash = () => {
    props.drawerOpenHandler();
    setOpenDash(!openDash);
    setOpenPro(false);
    setOpenUser(false);
    setOpenCom(false);
    setOpenMas(false);
    setOpenEvent(false);
    setOpenArticle(false);
    setOpenVendorOnboarding(false);
    setOpenMarketPlace(false);
  };

  const handleClickUser = () => {
    props.drawerOpenHandler();
    setOpenDash(false);
    setOpenPro(false);
    setOpenUser(!openUser);
    setOpenCom(false);
    setOpenMas(false);
    setOpenEvent(false);
    setOpenArticle(false);
    setOpenVendorOnboarding(false);
    setOpenMarketPlace(false);
  };

  const handleClickCmpy = () => {
    props.drawerOpenHandler();
    setOpenDash(false);
    setOpenUser(false);
    setOpenCom(!openCom);
    setOpenMas(false);
    setOpenPro(false);
    setOpenEvent(false);
    setOpenArticle(false);
    setOpenVendorOnboarding(false);
    setOpenMarketPlace(false);
  };

  const handleClickMas = () => {
    props.drawerOpenHandler();
    setOpenDash(false);
    setOpenUser(false);
    setOpenCom(false);
    setOpenPro(false);
    setOpenMas(!openMas);
    setOpenEvent(false);
    setOpenArticle(false);
    setOpenVendorOnboarding(false);
    setOpenMarketPlace(false);
  };

  const handleClickPro = () => {
    props.drawerOpenHandler();
    setOpenDash(false);
    setOpenUser(false);
    setOpenCom(false);
    setOpenPro(!openPro);
    setOpenMas(false);
    setOpenEvent(false);
    setOpenArticle(false);
    setOpenVendorOnboarding(false);
    setOpenMarketPlace(false);
  };

  const handleClickEvent = () => {
    props.drawerOpenHandler();
    setOpenDash(false);
    setOpenUser(false);
    setOpenCom(false);
    setOpenPro(false);
    setOpenMas(false);
    setOpenEvent(!openEvent);
    setOpenArticle(false);
    setOpenVendorOnboarding(false);
    setOpenMarketPlace(false);
  };

  const handleClickArticle = () => {
    props.drawerOpenHandler();
    setOpenDash(false);
    setOpenUser(false);
    setOpenCom(false);
    setOpenPro(false);
    setOpenMas(false);
    setOpenEvent(false);
    setOpenArticle(!openArticle);
    setOpenVendorOnboarding(false);
    setOpenMarketPlace(false);
  };

  const handleClickVendorOnboarding = () => {
    props.drawerOpenHandler();
    setOpenDash(false);
    setOpenUser(false);
    setOpenCom(false);
    setOpenPro(false);
    setOpenMas(false);
    setOpenEvent(false);
    setOpenArticle(false);
    setOpenVendorOnboarding(!openVendorOnboarding);
    setOpenMarketPlace(false);
  };

  const handleClickMarketPlace = () => {
    props.drawerOpenHandler();
    setOpenDash(false);
    setOpenUser(false);
    setOpenCom(false);
    setOpenPro(false);
    setOpenMas(false);
    setOpenEvent(false);
    setOpenArticle(false);
    setOpenVendorOnboarding(false);
    setOpenMarketPlace(!openMarketPlace);
  };

  const handleDrawerClose = () => {
    setOpenDash(false);
    setOpenUser(false);
    setOpenCom(false);
    setOpenPro(false);
    setOpenMas(false);
    setOpenEvent(false);
    setOpenArticle(false);
    setOpenVendorOnboarding(false);
    props.drawerCloseHandler();
  };

  const toDashboard = () => {
    history.push(`/`);
  };

  useEffect(() => {
    [...listItems].forEach((route) => {
      switch (window.location.pathname) {
        case `${route.path}`:
          if (selectedItem !== route.id) {
            //setSelectedItem(route.id);
            dispatch(menuActions.setMenuItem({ value: route.id }));
          }
          break;
        default:
          break;
      }
    });
  }, [selectedItem, dispatch]);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      open={props.open}
      classes={{
        paper: clsx(
          classes.drawerPaper,
          !props.open && classes.drawerPaperClose
        ),
      }}
    >
      <div className={classes.toolbarIcon}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      <List component="nav" aria-label="menu items">
        <div onClick={() => toDashboard()}>
          <ListItem button onClick={handleClickDash}>
            <ListItemIcon>
              <DashboardRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
            {/* {openDash ? <ExpandLess /> : <ExpandMore />} */}
          </ListItem>
        </div>
        {/* <Collapse in={openDash} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="User" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Company" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Events" />
            </ListItem>
            {/* <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Ecommerce" />
            </ListItem> 
          </List>
        </Collapse> */}

        <ListItem button onClick={handleClickUser}>
          <ListItemIcon>
            <GroupRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="User" />
          {openUser ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openUser} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/user"}
            >
              <ListItemIcon>
                <GroupAddIcon />
              </ListItemIcon>
              <ListItemText primary="All Users" />
            </ListItem>

            <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/account-deletion"}
            >
              <ListItemIcon>
                <GroupAddIcon />
              </ListItemIcon>
              <ListItemText primary="Account Deletion" />
            </ListItem>
            {/* <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Players" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Organizers" />
            </ListItem> */}
          </List>
        </Collapse>

        <ListItem button onClick={handleClickCmpy}>
          <ListItemIcon>
            <BusinessRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Pages" />
          {openCom ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openCom} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/pages"}
            >
              <ListItemIcon>
                <PagesOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="All Pages" />
            </ListItem>

            {/*  <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Organizers" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Brands" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Sponsers" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Clubs" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Service Providers" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Venues" />
            </ListItem> */}
          </List>
        </Collapse>

        {/* <ListItem button onClick={handleClickEvt}>
          <ListItemIcon>
            <EmojiEventsRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Event" />
          {openEvt ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openEvt} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="All Event" />
            </ListItem>
            <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/events/category"}
            >
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Event Category" />
            </ListItem>
          </List>
        </Collapse> */}

        {/* <ListItem button onClick={handleClickEcom}>
          <ListItemIcon>
            <StoreRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Ecommerce" />
          {openEco ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openEco} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Products" />
            </ListItem>
          </List>
        </Collapse> */}

        <ListItem button onClick={handleClickMas}>
          <ListItemIcon>
            <LibraryBooksRoundedIcon />
          </ListItemIcon>
          <ListItemText primary="Master" />
          {openMas ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openMas} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {/* <ListItem button className={classes.nested}>
              <ListItemIcon>
                <SportsSoccerRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Sports" />
            </ListItem>
            <ListItem button className={classes.nested}>
              <ListItemIcon>
                <LanguageRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Countries" />
            </ListItem> */}
            <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/masters/lookup"}
            >
              <ListItemIcon>
                <DnsIcon />
              </ListItemIcon>
              <ListItemText primary="Lookup" />
            </ListItem>

            <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/masters/country"}
            >
              <ListItemIcon>
                <FlagIcon />
              </ListItemIcon>
              <ListItemText primary="Country" />
            </ListItem>

            <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/masters/category"}
            >
              <ListItemIcon>
                <CategoryIcon />
              </ListItemIcon>
              <ListItemText primary="Category" />
            </ListItem>

            <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/masters/lookupType"}
            >
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="Lookup Type" />
            </ListItem>

            {/* <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/masters/sports"}
            >
              <ListItemIcon>
                <SportsBaseballIcon />
              </ListItemIcon>
              <ListItemText primary="Sports" />
            </ListItem> */}

            <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/masters/sports"}
            >
              <ListItemIcon>
                <SportsBaseballIcon />
              </ListItemIcon>
              <ListItemText primary="Sports" to={"/masters/sports"} />
            </ListItem>

            {/* 
            <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/masters/sportsStatistics"}
            >

            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Sports-Statistics"
              to={"/masters/sportsStatistics"}
            />
            </ListItem> */}
          </List>
        </Collapse>

        {/*  <ListItem button onClick={handleClickOrg}>
          <ListItemIcon>
            <HowToRegIcon />
          </ListItemIcon>
          <ListItemText primary="Organizer" />
          {openOrg ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={openOrg} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              className={classes.nested}
              component={Link}
              to={"/organizers"}
            >
              <ListItemIcon>
                <StarBorder />
              </ListItemIcon>
              <ListItemText primary="All Organizers" />
            </ListItem>
          </List>
        </Collapse> */}

        {/* {listItems.map((item) => {
          return (
            <Fragment key={item.id}>
              <ListItem button onClick={handleClick}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={item.name} />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.sub.map((subitem) => {
                    return (
                      <ListItem button className={classes.nested}>
                        <ListItemIcon>
                          <StarBorder />
                        </ListItemIcon>
                        <ListItemText primary={subitem.name} />
                      </ListItem>
                    );
                  })}
                </List>
              </Collapse>
            </Fragment>
            // <ListItem
            //   button
            //   component={Link}
            //   to={item.path}
            //   key={item.id}
            //   onClick={() => selectedItemHandler(item.id)}
            //   selected={selectedDrawerItem === item.id}
            // >
            //   <ListItemIcon>{item.icon()}</ListItemIcon>
            //   <ListItemText primary={item.name} />
            // </ListItem>
          );
        })} */}
      </List>

      <ListItem button onClick={handleClickPro}>
        <ListItemIcon>
          <Person />
        </ListItemIcon>
        <ListItemText primary="Verification" />
        {openPro ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openPro} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {/* <ListItem
            button
            className={classes.nested}
            component={Link}
            to={"/Profile-verification/approval"}
          >
            <ListItemIcon>
              <VerifiedUser />
            </ListItemIcon>
            <ListItemText primary="Approval" />
          </ListItem> */}

          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={"/Profile-verification/users"}
          >
            <ListItemIcon>
              <PersonOutline />
            </ListItemIcon>
            <ListItemText primary="User" to={"/Profile-verification/users"} />
          </ListItem>

          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={"/Profile-verification/Company"}
          >
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText
              primary="Company"
              to={"/Profile-verification/company"}
            />
          </ListItem>
        </List>
      </Collapse>

      <ListItem button onClick={handleClickEvent}>
        <ListItemIcon>
          <EmojiEventsIcon />
        </ListItemIcon>
        <ListItemText primary="Events" />
        {openEvent ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openEvent} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          ``
          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={"/events"}
          >
            <ListItemIcon>
              <EventAvailableIcon />
            </ListItemIcon>
            <ListItemText primary="All Events" to={"/events"} />
          </ListItem>
        </List>
      </Collapse>

      <ListItem button onClick={handleClickArticle}>
        <ListItemIcon>
          <ArtTrackIcon />
        </ListItemIcon>
        <ListItemText primary="Articles" />
        {openArticle ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openArticle} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={"/articles"}
          >
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="All Articles" to={"/articles"} />
          </ListItem>
        </List>
      </Collapse>

      {/* <ListItem button onClick={handleClickVendorOnboarding}>
        <ListItemIcon>
          <HandshakeIcon />
        </ListItemIcon>
        <ListItemText primary="Vendor Onboarding" />
        {openVendorOnboarding ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openVendorOnboarding} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={"/vendor-onboarding"}
          >
            <ListItemIcon>
              <HowToRegIcon />
            </ListItemIcon>
            <ListItemText
              primary="Vendor Onboarding"
              to={"/vendor-onboarding"}
            />
          </ListItem>
        </List>
      </Collapse> */}

      <ListItem button onClick={handleClickMarketPlace}>
        <ListItemIcon>
          <AddBusinessIcon />
        </ListItemIcon>
        <ListItemText primary="MarketPlace" />
        {openMarketPlace ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={openMarketPlace} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={"/marketplace/products"}
          >
            <ListItemIcon>
              <ProductionQuantityLimitsIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItem>

          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={"/marketplace/services"}
          >
            <ListItemIcon>
              <DesignServicesIcon />
            </ListItemIcon>
            <ListItemText primary="Services" />
          </ListItem>

          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={"/marketplace/vouchers"}
          >
            <ListItemIcon>
              <ProductionQuantityLimitsIcon />
            </ListItemIcon>
            <ListItemText primary="Vouchers" />
          </ListItem>

          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={"/marketplace/orders"}
          >
            <ListItemIcon>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>

          <ListItem
            button
            className={classes.nested}
            component={Link}
            to={"/marketplace/salesreport"}
          >
            <ListItemIcon>
              <ShoppingBasketIcon />
            </ListItemIcon>
            <ListItemText primary="Sales Report" />
          </ListItem>
        </List>
      </Collapse>

      {/* </List> */}
    </Drawer>
  );
};

export default SideMenu;
