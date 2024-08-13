import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import auth from "../../service/AuthService";
import hallacademylogo from "../../assets/images/hallmark-physio-logo.png";

import styles from "../../component/navbar/navbar.module.css";
import { useHistory } from "react-router-dom";

import AuthService from "../../service/AuthService";

const Navbar = (props) => {
	let history = useHistory();

	const navDashboard = () => {
		if (AuthService.getRole() === "Admin") {
			history.push("/dash-admin");
		} else if (AuthService.getRole() === "SuperAdmin") {
			history.push("/dash-admin");
		}
	};

	return (
		<div>
			{auth.isAuthenticated() ? (
				<AppBar position='static' style={{ background: "#ffffff", position: "fixed" }}>
					<Toolbar>
						<div className={styles.toolbar__wrapper}>
							<div>
								<img
									src={hallacademylogo}
									height='50px'
									alt='hallmark academy logo'
									className={styles.imgstyle}
									onClick={navDashboard}
								/>
							</div>

							<div className={styles.nav__left_section}>
								<div className={styles.nav__user__info}>
									<div className={styles.useremail}>{auth.getUserInfo().userEmail}</div>
									<div className={styles.profile}>
										{auth.isAdmin() ? "Admin" : auth.isSuperAdmin() ? "Super Admin" : auth.getRole()}
									</div>
								</div>
							</div>
						</div>
					</Toolbar>
				</AppBar>
			) : null}
		</div>
	);
};

export default Navbar;
