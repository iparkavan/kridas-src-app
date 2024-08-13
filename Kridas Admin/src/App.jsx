import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./contexts/auth-context";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analytics from "./app/dashboard/analytics";
import PageIndex from "./app/pages/page-index";
import ProductIndex from "./app/marketplace/products/product-index";
import ServiceIndex from "./app/marketplace/services/service-index";
import ServiceView from "./app/marketplace/services/service-view";
import ProductView from "../src/app/marketplace/products/product-view";
import LogInPage from "./app/auth/login-page";
// import SignUpPage from "./app/auth/signup_page";
import PrivateRoute from "./app/auth/private-rount";
import { useStateContext } from "./contexts/context-provider";
import { useEffect } from "react";
import EditCommonHeaderPage from "./app/pages/edit-pages/edit-common-header-page";

function App() {
  const queryClient = new QueryClient();
  const { currentMode, setCurrentMode } = useStateContext();

  useEffect(() => {
    const currentThemeMode = localStorage.getItem("themeMode");

    if (currentThemeMode === "Light") {
      setCurrentMode("Light");
    } else {
      setCurrentMode("Dark");
    }
  }, []);

  return (
    <div className={currentMode === "Light" ? "dark" : "light"}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* lOG PAGES */}
              <Route exact path="/login" Component={LogInPage} />
              {/* <Route pat="/signup" Component={SignUpPage} /> */}

              {/* DASHBOARD */}
              <Route exact path="/" Component={PrivateRoute}>
                <Route exact path="/" Component={Analytics} />
                <Route path="/analytics" Component={Analytics} />
                {/* PAGES */}
                <Route path="/pages/allpages" Component={PageIndex} />
                <Route
                  path="/pages/allpages/:companyId"
                  Component={EditCommonHeaderPage}
                />

                {/* MARKET PLACE */}
                {/* Product */}
                <Route path="/marketplace/products" Component={ProductIndex} />
                <Route
                  path="/marketplace/products/view/:productId"
                  Component={ProductView}
                />

                {/* Service */}
                <Route path="/marketplace/services" Component={ServiceIndex} />
                <Route
                  path="/marketplace/services/view/:serviceId"
                  Component={ServiceView}
                />
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </div>
  );
}

export default App;
