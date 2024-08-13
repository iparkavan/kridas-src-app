import { useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

import { makeStyles } from "@material-ui/styles";
import Header from "./Header";

import UserDashboard from "../../../user/components/UserDashboard";
import Login from "../../../auth/components/Login";
import UserIndex from "../../../user/components/UserIndex";
import UserDetail from "../../../user/components/UserDetail";

import SportsIndex from "../../../master/sports/components/SportsIndex";
import LookupTableIndex from "../../../master/lookupTable/components/LookupTableIndex";
import OrganizersIndex from "../../../organizer/components/OrganizersIndex";
import OrganizerIndex from "../../../organizer/components/OrganizerIndex";
import EventCategoryIndex from "../../../events/eventCategory/components/EventCategoryIndex";

import CompanyIndex from "../../../company/components/CompanyIndex";
import CompanyEdit from "../../../company/components/CompanyEdit";
import CompanyDetail from "../../../company/components/CompanyDetail";
import CountryIndex from "../../../master/country/components/CountryIndex";
import AddEventCategory from "../../../events/eventCategory/components/AddEventCategory";
import EditEventCategory from "../../../events/eventCategory/components/EditEventCategory";
//import { authActions } from "../../store/authSlice";
import AddCountry from "../../../master/country/components/AddCountry";
import EditCountry from "../../../master/country/components/EditCountry";
import ViewCountry from "../../../master/country/components/GetCountry";
import UserEdit from "../../../user/components/UserEdit";
import SportsStatsIndex from "../../../master/sportsStatistics/components/SportsStatsIndex";
import UserStatisticsEdit from "../../../user/components/userStatistics/userStatisticsEdit";
import UserStatisticsIndex from "../../../user/components/userStatistics/userStatisticsIndex";

import CategoryIndex from "../../../master/category/components/CategoryIndex";
import AddCategory from "../../../master/category/components/AddCategory";
import EditCategory from "../../../master/category/components/EditCategory";
import ViewCategory from "../../../master/category/components/GetCategory";
import LookupTypeIndex from "../../../master/lookupType/components/LookupTypeIndex";
import EditSports from "../../../master/sports/components/EditSport";
import ViewLookupType from "../../../master/lookupType/components/ViewLookupType";
import ViewSports from "../../../master/sports/components/ViewSports";
import AddSport from "../../../master/sports/components/AddSport";

import ApprovalIndex from "../../../profileVerification/approval/components/ApprovalIndex";
import ApprovalView from "../../../profileVerification/approval/components/ApprovalView";
import UserApprovalList from "../../../profileVerification/approval/components/UserApprovalList";
import CompanyApprovalList from "../../../profileVerification/approval/components/CompanyApprovalList";
import EventIndex from "../../../events/component/EventIndex";

import EventsView from "../../../events/component/eventsView";
import ArticleList from "../../../articles/component/ArticleList";

import VendorOnboardingIndex from "../../../vendorOnboarding/component/VendorOnboardingIndex";
import VendorOnboardingDetail from "../../../vendorOnboarding/component/VendorOnboardingDetail";
import VendorOnboardingEdit from "../../../vendorOnboarding/component/VendorOnboardingEdit";
import ProductsView from "../../../marketPlace/products/ProductsView";
import ProductsIndex from "../../../marketPlace/products/ProductsIndex";
import ServicesIndex from "../../../marketPlace/services/ServicesIndex";
import ServicesView from "../../../marketPlace/services/ServicesView";
import OrdersView from "../../../marketPlace/orders/components/OrdersView";
import VouchersIndex from "../../../marketPlace/vouchers/VouchersIndex";
import VouchersView from "../../../marketPlace/vouchers/VouchersView";
import OrdersIndex from "../../../marketPlace/orders/components/OrdersIndex";
import SalesIndex from "../../../marketPlace/salesReport/SalesReport";
import UserAccountDeletion from "../../../user/components/userStatistics/UserAccountDeletion";
import AccountDeletionIndex from "../../../user/components/AccountDeletionIndex";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    maxHeight: "100vh",
    overflow: "None",
  },
  content: {
    marginLeft: `${theme.drawerWidth}px`,
    flexGrow: 1,
    // height: "100vh",
    // overflow:"None"
    // overflowX: "hide",
    // overflowY: "auto",
  },
  contentShift: {
    marginLeft: `${theme.drawerCloseWidth}px`,
    flexGrow: 1,
  },
  authPage: {
    marginLeft: `0px`,
    flexGrow: 1,
  },
  appBarSpacer: theme.mixins.toolbar,
}));

const Layout = (props) => {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  // const tokenExpirationTime = useSelector(
  //   (state) => state.auth.tokenExpirationTime
  // );

  const drawerHandler = (isDrawerOpen) => {
    setOpenDrawer(isDrawerOpen);
  };

  /* useEffect(() => {
    if (isLoggedIn) {
      const currentTime = new Date();
      const expirationTime = new Date(tokenExpirationTime);

      var res = Math.abs(expirationTime - currentTime) / 1000;
      var remainingTimeInSeconds = (Math.floor(res / 60) % 60) * 60;

      setTimeout(() => {
        dispatch(authActions.logout());
      }, remainingTimeInSeconds * 1000);
    }
  }, [isLoggedIn, dispatch, tokenExpirationTime]); */

  return (
    <BrowserRouter>
      <div className={classes.root}>
        <Header drawerHandler={drawerHandler}></Header>
        <main
          className={
            isLoggedIn
              ? openDrawer
                ? classes.content
                : classes.contentShift
              : classes.authPage
          }
        >
          {isLoggedIn ? <div className={classes.appBarSpacer}></div> : ""}

          <div>
            <Switch>
              {isLoggedIn ? (
                <>
                  <Route exact path="/home" component={UserDashboard} />
                  <Route exact path="/user" component={UserIndex} />
                  <Route exact path="/account-deletion" component={AccountDeletionIndex} />
                  <Route exact path="/user/:userId" component={UserDetail} />
                  <Route exact path="/user/edit/:userId" component={UserEdit} />
                  <Route
                    exact
                    path="/master/country/add"
                    component={AddCountry}
                  />
                  <Route
                    exact
                    path="/master/country/edit/:countryId"
                    component={EditCountry}
                  />
                  <Route
                    exact
                    path="/master/country/view/:countryId"
                    component={ViewCountry}
                  />
                  <Route
                    exact
                    path="/user/userStatisticsEdit/:userStatisticsId"
                    component={UserStatisticsEdit}
                  />
                  <Route
                    exact
                    path="/user/userStatisticsView/:userStatisticsId"
                    component={UserStatisticsIndex}
                  />

                  <Route exact path="/masters/sports" component={SportsIndex} />
                  <Route
                    exact
                    path="/masters/sports/view/:sportsId"
                    component={ViewSports}
                  />

                  <Route
                    exact
                    path="/masters/sportsStatistics/:user_statistics_id/:sports_name"
                    component={SportsStatsIndex}
                  />
                  <Route
                    exact
                    path="/masters/sportsStatistics/:user_statistics_id/:sports_name/:mode"
                    component={SportsStatsIndex}
                  />

                  <Route
                    exact
                    path="/masters/lookupType"
                    component={LookupTypeIndex}
                  />
                  <Route
                    exact
                    path="/masters/lookupType/view/:lookupType"
                    component={ViewLookupType}
                  />

                  {/* <Route exact path="/list" component={CountryIndex}/> */}
                  <Route
                    exact
                    path="/sales"
                    component={() => <div>Sales Page</div>}
                  />
                  <Route
                    exact
                    path="/dashboard/user"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/dashboard/company"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/dashboard/events"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/dashboard/ecommerce"
                    component={() => <div>Reports Page</div>}
                  />

                  <Route
                    exact
                    path="/users/organizers"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/users/players"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />
                  <Route
                    exact
                    path="/reports"
                    component={() => <div>Reports Page</div>}
                  />

                  <Route
                    exact
                    path="/masters/sports/add"
                    component={AddSport}
                  />
                  <Route
                    exact
                    path="/masters/sports/edit/:sportsId"
                    component={EditSports}
                  />
                  <Route
                    exact
                    path="/masters/lookup"
                    component={LookupTableIndex}
                  />
                  <Route
                    exact
                    path="/masters/country"
                    component={CountryIndex}
                  />

                  <Route
                    exact
                    path="/masters/company"
                    component={CompanyIndex}
                  />

                  <Route
                    exact
                    path="/events/category"
                    component={EventCategoryIndex}
                  />

                  <Route
                    exact
                    path="/masters/category"
                    component={CategoryIndex}
                  />
                  <Route
                    exact
                    path="/masters/category/edit/:categoryId"
                    component={EditCategory}
                  />

                  <Route
                    exact
                    path="/masters/category/view/:categoryId"
                    component={ViewCategory}
                  />
                  <Route
                    exact
                    path="/masters/category/add"
                    component={AddCategory}
                  />

                  <Route
                    exact
                    path="/category/add"
                    component={AddEventCategory}
                  />
                  <Route
                    exact
                    path="/category/edit/:categoryId"
                    component={EditEventCategory}
                  />
                  <Route exact path="/organizers" component={OrganizersIndex} />
                  <Route
                    exact
                    path="/organizer/:organizerId"
                    component={OrganizerIndex}
                  />

                  <Route exact path="/pages" component={CompanyIndex} />
                  <Route
                    exact
                    path="/pages/:companyId"
                    component={CompanyDetail}
                  />

                  <Route
                    exact
                    path="/pages/edit/:companyId"
                    component={CompanyEdit}
                  />
                  <Route
                    exact
                    path="/profile-verification/approval"
                    component={ApprovalIndex}
                  />
                  <Route
                    exact
                    path="/profile-verification/approval/:profileId/view/:type?/:id?"
                    component={ApprovalView}
                  />
                  <Route
                    exact
                    path="/profile-verification/users"
                    component={UserApprovalList}
                  />
                  <Route
                    exact
                    path="/profile-verification/company"
                    component={CompanyApprovalList}
                  />

                  <Route exact path="/events" component={EventIndex} />
                  <Route exact path="/articles" component={ArticleList} />

                  {/* ========================================================================== */}

                  {/* MarketPlace Products  */}

                  <Route
                    exact
                    path="/marketplace/products"
                    component={ProductsIndex}
                  />

                  <Route
                    exact
                    path="/marketplace/products/view/:productId"
                    component={ProductsView}
                  />

                  {/* MarketPlace Services  */}

                  <Route
                    exact
                    path="/marketplace/services"
                    component={ServicesIndex}
                  />

                  <Route
                    exact
                    path="/marketplace/services/view/:productId"
                    component={ServicesView}
                  />

                  {/* Marketplace Vouchers */}
                  <Route
                    exact
                    path="/marketplace/vouchers"
                    component={VouchersIndex}
                  />

                  <Route
                    exact
                    path="/marketplace/vouchers/view/:voucherId"
                    component={VouchersView}
                  />

                  {/* MarketPlace Orders */}

                  <Route
                    exact
                    path="/marketplace/orders/view/:orderId"
                    component={OrdersView}
                  />

                  <Route
                    exact
                    path="/marketplace/orders"
                    component={OrdersIndex}
                  />

                  <Route
                    exact
                    path="/marketplace/salesreport"
                    component={SalesIndex}
                  />

                  {/* ============================================================= */}

                  <Route
                    exact
                    path="/vendor-onboarding"
                    component={VendorOnboardingIndex}
                  />
                  <Route
                    exact
                    path="/vendor-onboarding/:companyId"
                    component={VendorOnboardingDetail}
                  />
                  <Route
                    exact
                    path="/vendor-onboarding/edit/:companyId"
                    component={VendorOnboardingEdit}
                  />

                  <Route
                    exact
                    path="/events/view/:eventId"
                    component={EventsView}
                  />

                  <Route exact path="/" component={UserDashboard} />
                  {/* <Route path="*">
                    <Redirect to="/home"></Redirect>
                  </Route> */}
                </>
              ) : (
                <>
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/" component={Login} />

                  <Route path="*">
                    <Redirect to="/login"></Redirect>
                  </Route>
                </>
              )}
            </Switch>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default Layout;
