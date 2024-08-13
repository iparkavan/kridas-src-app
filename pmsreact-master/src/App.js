import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import React from "react";
import "./App.css";

import NavBar from "./component/navbar/navbar";

import Users from "./modules/user/UserIndex";
import UserAddEdit from "./modules/user/UserAddEdit";

import SignupComponent from "./component/user/signup/SignupComponent";

import AdminDashComponent from "./modules/dash/admin/admindash";

import SideBar from "./component/sidebar/sidebar";

import { ProtectedRoute } from "./protected.route";
import PageNotFound from "./component/pagenotfound/pagenotfoundpage";

import Login from "./modules/auth/Login";
import ForgotPass from "./modules/auth/ForgotPass";
import PassSent from "./modules/auth/PassSent";
import PassReset from "./modules/auth/PassReset";
import PassResetSuccess from "./modules/auth/PassResetSuccess";

import Footer from "./component/footer/footer";

import PatientIndex from "./modules/patient/PatientIndex";
import PatientAddEdit from "./modules/patient/PatientAddEdit";
import PatientDetail from "./modules/patient/PatientDetail";

import PatientNoteAddEdit from "./modules/patient/PatientNoteAddEdit";
import ProcedureIndex from "./modules/master/procedure/ProcedureIndex";
import ProcedureAddEdit from "./modules/master/procedure/ProcedureAddEdit";
import PatientProcedureAdd from "./modules/patient/PatientProcedureAdd";
import PatientProcedureEdit from "./modules/patient/PatientProcedureEdit";

import PatientInvoiceAdd from "./modules/patient/invoice/PatientInvoiceAdd";
import PatientInvoiceEdit from "./modules/patient/invoice/PatientInvoiceEdit";
import ItemMasterIndex from "./modules/master/itemmaster/ItemMasterIndex";
import ItemMasterAddEdit from "./modules/master/itemmaster/ItemMasterAddEdit";
import PatientPaymentAdd from "./modules/patient/payment/PatientPaymentAdd";

import IncomeReportsFilter from "./modules/reports/ReportsFilter";
import PatientFilesAdd from "./modules/patient/files/PatientFilesAdd";

import ExpenseIndex from "./modules/master/expense/ExpenseIndex";
import ExpenseAddEdit from "./modules/master/expense/ExpenseAddEdit";
import ItemAddStock from "./modules/master/itemmaster/ItemAddStock";
import ItemConsumeStock from "./modules/master/itemmaster/ItemConsumeStock";
import PatientMcAdd from "./modules/patient/files/PatientMcAdd";

import SettingsDetail from "./modules/master/settings/SettingsDetail";

function App() {
  const DefaultContainer = () => (
    <>
      <NavBar />
      <nav className="navbar">
        <SideBar />
      </nav>

      <main>
        <Switch>
          <ProtectedRoute
            exact
            path="/dash-admin"
            component={AdminDashComponent}
          />

          <ProtectedRoute
            exact
            path="/reports"
            component={IncomeReportsFilter}
          />

          <ProtectedRoute exact path="/admin/users" component={Users} />
          <ProtectedRoute
            exact
            path="/admin/users/add"
            component={UserAddEdit}
          />
          <ProtectedRoute
            exact
            path="/admin/users/edit/:userId"
            component={UserAddEdit}
          />

          <ProtectedRoute
            exact
            path="/patient/index"
            component={PatientIndex}
          />

          <ProtectedRoute
            exact
            path="/patient/add"
            component={PatientAddEdit}
          />

          <ProtectedRoute
            path="/patient/detail/:id"
            component={PatientDetail}
            exact
          />

          <ProtectedRoute
            path="/patient/edit/:id"
            component={PatientAddEdit}
            exact
          />

          <ProtectedRoute
            exact
            path="/patient/notes/add/:patientIdParam/"
            component={PatientNoteAddEdit}
          />

          <ProtectedRoute
            path="/patient/notes/edit/:patientIdParam/:idParam"
            component={PatientNoteAddEdit}
            exact
          />

          <ProtectedRoute
            exact
            path="/procedure/index"
            component={ProcedureIndex}
          />

          <ProtectedRoute
            exact
            path="/procedure/add"
            component={ProcedureAddEdit}
          />

          <ProtectedRoute
            path="/procedure/edit/:procedureId"
            component={ProcedureAddEdit}
            exact
          />

          <ProtectedRoute
            exact
            path="/patient/procedure/add/:patientIdParam/"
            component={PatientProcedureAdd}
          />

          <ProtectedRoute
            path="/patient/procedure/edit/:patientIdParam/:idParam"
            component={PatientProcedureEdit}
            exact
          />

          <ProtectedRoute
            exact
            path="/patient/invoice/add/:patientIdParam/"
            component={PatientInvoiceAdd}
          />

          <ProtectedRoute
            exact
            path="/patient/invoice/add/:patientIdParam/:treatmentIdParam"
            component={PatientInvoiceAdd}
          />

          <ProtectedRoute
            path="/patient/invoice/edit/:patientIdParam/:idParam"
            component={PatientInvoiceEdit}
            exact
          />

          <ProtectedRoute
            exact
            path="/item/index"
            component={ItemMasterIndex}
          />

          <ProtectedRoute
            exact
            path="/item/add"
            component={ItemMasterAddEdit}
          />

          <ProtectedRoute
            path="/item/edit/:itemId"
            component={ItemMasterAddEdit}
            exact
          />

          <ProtectedRoute
            exact
            path="/patient/payment/add/:patientIdParam/"
            component={PatientPaymentAdd}
          />
          <ProtectedRoute
            exact
            path="/patient/payment/add/:patientIdParam/:invId"
            component={PatientPaymentAdd}
          />

          <ProtectedRoute
            exact
            path="/expense/index"
            component={ExpenseIndex}
          />

          <ProtectedRoute
            exact
            path="/expense/add"
            component={ExpenseAddEdit}
          />

          <ProtectedRoute
            path="/expense/edit/:expenseIdParam"
            component={ExpenseAddEdit}
            exact
          />

          <ProtectedRoute
            exact
            path="/patient/patient-file/add/:patientIdParam"
            component={PatientFilesAdd}
          />
          <ProtectedRoute
            exact
            path="/patient/patient-mc/add/:patientIdParam"
            component={PatientMcAdd}
          />

          <ProtectedRoute
            path="/item/addstock/:itemIdParam"
            component={ItemAddStock}
            exact
          />

          <ProtectedRoute
            path="/item/consume/:itemIdParam"
            component={ItemConsumeStock}
            exact
          />

          <ProtectedRoute exact path="/settings" component={SettingsDetail} />

          <Route path="*" component={PageNotFound} />
        </Switch>
      </main>
      <Footer></Footer>
    </>
  );

  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/sign-up" component={SignupComponent} />
          <Route exact path="/forgot-pass" component={ForgotPass} />
          <Route exact path="/pass-sent" component={PassSent} />
          <Route exact path="/reset" component={PassReset} />
          <Route
            exact
            path="/pass-reset-success"
            component={PassResetSuccess}
          />

          <Route component={DefaultContainer} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
