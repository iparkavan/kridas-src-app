import React, { useState, useEffect, useRef } from "react";
import "./sidebar.scss";

import { useHistory } from "react-router-dom";
import auth from "../../service/AuthService";

const Sidebar = (props) => {
  let history = useHistory();

  const [selectedMenu, setSelectedMenu] = useState("admindash");
  const [subMenuClicked, setSubMenuClicked] = useState(false);

  const resetClass = () => {};

  useEffect(() => {
    if (history.location.pathname.includes("/patient/detail")) {
      setSelectedMenu("patients");
    }
  }, [history.location]);

  const handleChange = (navto) => {
    resetClass();

    if (navto === "admindash") {
      setSelectedMenu("admindash");

      localStorage.setItem("nav", "admindash");
      history.push("/dash-admin");
    } else if (navto === "home") {
      setSelectedMenu("home");

      localStorage.setItem("nav", "home");
      history.push("/dash-admin");
    } else if (navto === "patients") {
      setSelectedMenu("patients");
      localStorage.setItem("nav", "patients");
      history.push("/patient/index");
    } else if (navto === "procedures") {
      setSelectedMenu("procedures");
      localStorage.setItem("nav", "procedures");
      history.push("/procedure/index");
    } else if (navto === "itemMasters") {
      // setSelectedMenu("itemMaster");
      setSelectedMenu("backoffice");
      localStorage.setItem("nav", "itemMasters");
      history.push("/item/index");
    } else if (navto === "expenses") {
      // setSelectedMenu("expenses");
      setSelectedMenu("backoffice");
      localStorage.setItem("nav", "expenses");
      history.push("/expense/index");
    } else if (navto === "logout") {
      setSelectedMenu("logout");
      localStorage.clear();
      history.push("/");
    } else if (navto === "users") {
      setSelectedMenu("users");

      localStorage.setItem("nav", "users");
      history.push("/admin/users");
    } else if (navto === "reports") {
      setSelectedMenu("reports");

      localStorage.setItem("nav", "reports");
      history.push("/reports");
    } else if (navto === "settings") {
      setSelectedMenu("settings");

      localStorage.setItem("nav", "settings");
      history.push("/settings");
    }
  };

  useEffect(() => {
    handleChange(localStorage.getItem("nav"));
  }, []);

  const handleSubMenuClick = () => setSubMenuClicked(!subMenuClicked);

  return (
    <>
      {auth.isAuthenticated() ? (
        <ul
          className="navbar-nav"
          onMouseEnter={handleSubMenuClick}
          onMouseLeave={handleSubMenuClick}
        >
          <li className="nav-item">
            <div
              className={`${
                selectedMenu === "home" ? "nav-link-select" : "nav-link"
              }`}
              style={menuStyle}
              onClick={() => handleChange("home")}
            >
              <i className="fa fa-fw fa-home" style={{ fontSize: "1.5rem" }} />
              <span className="link-text">Home</span>
            </div>
          </li>

          <li className="nav-item">
            <div
              className={`${
                selectedMenu === "patients" ? "nav-link-select" : "nav-link"
              }`}
              style={menuStyle}
              onClick={() => handleChange("patients")}
            >
              <i className="far fa-user" style={{ fontSize: "1.5rem" }} />

              <span className="link-text">Patients</span>
            </div>
          </li>

          <li className="nav-item">
            <div
              className={`${
                selectedMenu === "procedures" ? "nav-link-select" : "nav-link"
              }`}
              style={menuStyle}
              onClick={() => handleChange("procedures")}
            >
              <i className="fas fa-procedures" style={{ fontSize: "1.5rem" }} />
              <span className="link-text">Procedures</span>
            </div>
          </li>

          {/* <li className='nav-item'>
						<div
							className={`${selectedMenu === "itemMaster" ? "nav-link-select" : "nav-link"}`}
							style={menuStyle}
							onClick={() => handleChange("itemMaster")}>
							<i className='far fa-list-alt' style={{ fontSize: "1.5rem" }} />
							<span className='link-text'>Inventory</span>
						</div>
					</li>
					<li className='nav-item'>
						<div
							className={`${selectedMenu === "expenses" ? "nav-link-select" : "nav-link"}`}
							style={menuStyle}
							onClick={() => handleChange("expenses")}>
							<i className='fas fa-money-bill' style={{ fontSize: "1.5rem" }} />
							<span className='link-text'>Expenses</span>
						</div>
					</li> */}
          <li className="nav-item">
            <div
              className={`${
                selectedMenu === "admindash" ? "nav-link-select" : "nav-link"
              }`}
              style={menuStyle}
              onClick={() => handleChange("admindash")}
            >
              <i
                className="far fa-calendar-alt"
                style={{ fontSize: "1.5rem" }}
              />
              <span className="link-text">Calendar</span>
            </div>
          </li>

          {auth.isSuperAdmin() || auth.isAdmin() ? (
            <>
              <li className="nav-item">
                <div
                  className={`${
                    selectedMenu === "users" ? "nav-link-select" : "nav-link"
                  }`}
                  style={menuStyle}
                  onClick={() => handleChange("users")}
                >
                  <i className="fas fa-users" style={{ fontSize: "1.5rem" }} />
                  <span className="link-text">Users</span>
                </div>
              </li>

              <li className="nav-item">
                <div
                  className={`${
                    selectedMenu === "reports" ? "nav-link-select" : "nav-link"
                  }`}
                  style={menuStyle}
                  onClick={() => handleChange("reports")}
                >
                  <i
                    className="far fa-chart-bar"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <span className="link-text">Reports</span>
                </div>
              </li>

              <li className="nav-item">
                <div
                  className={`${
                    selectedMenu === "reports" ? "nav-link-select" : "nav-link"
                  }`}
                  style={menuStyle}
                  onClick={() => handleChange("settings")}
                >
                  <i className="fa fa-cog" style={{ fontSize: "1.5rem" }}></i>
                  <span className="link-text">Settings</span>
                </div>
              </li>

              <li className="nav-item">
                <div
                  className={`${
                    selectedMenu === "backoffice"
                      ? "nav-link-select"
                      : "nav-link"
                  }`}
                  style={menuStyle}
                >
                  <i
                    className="fas fa-clinic-medical"
                    style={{ fontSize: "1.5rem" }}
                  ></i>
                  <div className="link-text">
                    <span>
                      Stock&nbsp;&&nbsp;Finance&nbsp;
                      <i
                        className="fas fa-angle-down"
                        style={{ fontSize: "1rem" }}
                      ></i>
                    </span>
                  </div>

                  <div
                    className={`${
                      subMenuClicked ? "sub-menu-hover" : "sub-menu"
                    }`}
                  >
                    <div
                      className="sub-menu-item"
                      onClick={() => handleChange("itemMasters")}
                    >
                      <i
                        className="far fa-list-alt"
                        style={{ fontSize: "0.9rem" }}
                      >
                        &nbsp;
                        <span style={{ fontFamily: "Roboto" }}>Inventory</span>
                      </i>
                    </div>

                    <div
                      className="sub-menu-item"
                      onClick={() => handleChange("expenses")}
                    >
                      <i
                        className="far fa-money-bill-alt"
                        style={{ fontSize: "0.9rem" }}
                      >
                        &nbsp;
                        <span style={{ fontFamily: "Roboto" }}>Expenses</span>
                      </i>
                    </div>
                  </div>
                </div>
              </li>
            </>
          ) : null}

          <li className="nav-item">
            <div
              className={`${
                selectedMenu === "logout" ? "nav-link-select" : "nav-link"
              }`}
              style={menuStyle}
              onClick={() => handleChange("logout")}
            >
              <i
                className="fas fa-sign-out-alt"
                style={{ fontSize: "1.5rem" }}
              />
              <span className="link-text">Logout</span>
            </div>
          </li>
        </ul>
      ) : null}
    </>
  );
};

export default Sidebar;

const menuStyle = {
  textDecoration: "none",
  textAlign: "left",
  padding: "12px",
};
