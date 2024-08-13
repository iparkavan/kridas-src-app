import axios from "axios";
import AuthService from "./AuthService";

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

class UserService {
	// fake json tbd
	fetchUsers() {
		return axios.get(`${BACKEND_API_URL}/user/all`, AuthService.getAuthHeader());
	}

	fetchDashboardInfo(userId) {
		return axios.get(`${BACKEND_API_URL}/user/dashboard/${userId}`, AuthService.getAuthHeader());
	}

	fetchUserById(userId) {
		return axios.get(`${BACKEND_API_URL}/user/${userId}`, AuthService.getAuthHeader());
	}

	deleteUser(userId) {
		return axios.delete(`${BACKEND_API_URL}/user/deleteUser/${userId}`, AuthService.getAuthHeader());
	}

	addUser(user) {
		return axios.post(`${BACKEND_API_URL}/user/addUser`, user);
	}

	editUser(user) {
		return axios.put(`${BACKEND_API_URL}/user/updateUser/${user.id}`, user, AuthService.getAuthHeader());
	}

	fetchUserByEmail(emailId) {
		return axios.get(`${BACKEND_API_URL}/user/userByEmail/${emailId}`, AuthService.getAuthHeader());
	}

	fetchDashInfo(userId) {
		return axios.get(`${BACKEND_API_URL}/schedule/user/${userId}`, AuthService.getAuthHeader());
	}

	fetchAllDoctors(companyId) {
		return axios.get(`${BACKEND_API_URL}/user/allDocs/${companyId}`, AuthService.getAuthHeader());
	}

	fetchAllPatients(companyId, searchstring) {
		return axios.get(`${BACKEND_API_URL}/patient/all/${companyId}`, AuthService.getAuthHeader());
	}

	fetchPatientsBySearch(searchform) {
		return axios.post(`${BACKEND_API_URL}/patient/search`, searchform);
	}

	fetchAllUsersByCompanyId(companyId) {
		return axios.get(`${BACKEND_API_URL}/user/allUsers/${companyId}`, AuthService.getAuthHeader());
	}
}

export default new UserService();


