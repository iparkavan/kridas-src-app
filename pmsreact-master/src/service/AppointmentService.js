import axios from "axios";
import AuthService from "./AuthService";

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

class AppointmentService {
	// todo: comany should be passed dynamically

	fetchInstructors() {
		return axios.get(`${BACKEND_API_URL}/user/all`, AuthService.getAuthHeader());
	}

	fetchAppointments = (id) => {
		return axios.get(`${BACKEND_API_URL}/appointment/${id}`, AuthService.getAuthHeader());
	};

	fetchAllAppointments = (formData) => {
		return axios.post(`${BACKEND_API_URL}/appointment/all`, formData, AuthService.getAuthHeader());
	};

	fetchQuickAppointments = (formData) => {
		return axios.post(`${BACKEND_API_URL}/appointment/all`, formData, AuthService.getAuthHeader());
	};

	fetchAppointmentsCount = (formData) => {
		return axios.post(`${BACKEND_API_URL}/appointment/appointmentCount`, formData, AuthService.getAuthHeader());
	};

	addAppointments = (formData) => {
		return axios.post(`${BACKEND_API_URL}/appointment/addAppointment`, formData, AuthService.getAuthHeader());
	};

	updateAppointment = (appointment) => {
		return axios.put(`${BACKEND_API_URL}/appointment/updateAppointment/${appointment.id}`, appointment, AuthService.getAuthHeader());
	};

	deleteAppointment = (appointment) => {
		return axios.put(`${BACKEND_API_URL}/appointment/deleteAppointment/${appointment.id}`, appointment, AuthService.getAuthHeader());
	};

	// dnd
	// fetchCourseBatches = async ({ courseId }) => {

	// 	return await axios.get(`${BACKEND_API_URL}/schedule/all/${courseId}`, AuthService.getAuthHeader());
	// };
}

export default new AppointmentService();
