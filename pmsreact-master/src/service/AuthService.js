import axios from "axios";
import Helper from "../modules/helper/helper";

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

class AuthService {
	constructor() {
		this.authenticated = false;
		this.isadmin = null;
		this.issuperadmin = null;
	}

	login(credentials) {
		this.authenticated = true;

		return axios.post(`${BACKEND_API_URL}/token/generate-token`, credentials);
	}

	passwordEmail(credentials) {
		return axios.post(`${BACKEND_API_URL}/token/passwordEmail`, credentials);
	}

	resetPassword(credentials) {
		return axios.post(`${BACKEND_API_URL}/token/resetPassword`, credentials);
	}

	getUserInfo() {
		return JSON.parse(localStorage.getItem("userInfo"));
	}

	getAllCompanyInfo() {
		return JSON.parse(localStorage.getItem("userInfo"));
	}

	getRole() {
		let role = this.getUserInfo().userRoles;

		let roleName = "";
		role.forEach((element) => {
			roleName = roleName + element.roleDesc + ",";
		});

		return Helper.removeEndComma(roleName);
	}

	getAuthHeader() {
		return { headers: { Authorization: "Bearer " + this.getUserInfo().token } };
	}

	logOut() {
		localStorage.removeItem("userInfo");
		localStorage.removeItem("lookupdata");
		localStorage.clear();
		this.authenticated = false;
		return axios.post(`${BACKEND_API_URL}/logout`, {}, this.getAuthHeader());
	}

	isAuthenticated() {
		return this.authenticated;
	}

	isAdmin() {
		if (this.isadmin === null) {
			let roles = this.getUserInfo().userRoles;
			let isadmin = roles.find((o) => o.roleType === "ADM");

			if (isadmin != null || isadmin !== undefined) {
				this.isadmin = true;
				return this.isadmin;
			} else {
				this.isadmin = false;
				return this.isadmin;
			}
		} else {
			return this.isadmin;
		}
	}

	isSuperAdmin() {
		if (this.issuperadmin === null) {
			let roles = this.getUserInfo().userRoles;
			let issuperadmin = roles.find((o) => o.roleType === "SAD");

			if (issuperadmin != null || issuperadmin !== undefined) {
				this.issuperadmin = true;
				return this.issuperadmin;
			} else {
				this.issuperadmin = false;
				return this.issuperadmin;
			}
		} else {
			return this.issuperadmin;
		}
	}

	setIsSuperAdmin(status) {
		this.issuperadmin = status;
	}

	setIsAdmin(status) {
		this.isadmin = status;
	}

	getLoggedInUserId() {
		return this.getUserInfo().userRoles[0].userId;
	}

	getWeeklyScheduleDTOList() {
		return this.getUserInfo().companyDTO.customSchedules;
	}

	getOffDays() {
		let wslist = this.getUserInfo().companyDTO.customSchedules;

		return wslist
			.filter((e) => e.isOpen.trim() === "NO")
			.map(function (obj) {
				return obj.weekDay;
			});
	}

	getMonOperatingHours() {
		let wslist = this.getUserInfo().companyDTO.customSchedules;

		return wslist
			.filter((e) => e.weekDay === "MON")
			.map(function (obj) {
				return obj.operatingTime;
				//  return (obj.operating_hours = "08:00 - 13:00");
			});
	}

	getOperatingHours(day) {
		let wslist = this.getUserInfo().companyDTO.customSchedules;

		return wslist
			.filter((e) => e.weekDay === day)
			.map(function (obj) {
				return obj.operatingTime;
				//  return (obj.operating_hours = "08:00 - 13:00");
			});
	}

	getAuthHeaderAlone() {
		return { Authorization: "Bearer " + this.getUserInfo().token };
	}

	getLoggedInUserCompanyId() {
		return this.getUserInfo().companyDTO.id;
	}

	getLoggedInCompanyCurrencyCode() {
		if (this.getUserInfo() !== null) {
			return this.getUserInfo().companyDTO.companyBaseCurrency;
		} else {
			return "";
		}
	}

	getAuthHeaderForBlobResponse() {
		return {
			headers: {
				Authorization: "Bearer " + this.getUserInfo().token,
				"Content-Type": "application/json",
				Accept: "application/pdf",
			},
			responseType: "blob",
		};
	}
}

export default new AuthService();
