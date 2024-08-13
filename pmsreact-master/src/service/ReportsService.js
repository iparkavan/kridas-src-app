import axios from "axios";
import AuthService from "./AuthService";

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

class ReportsService {
	fetchDailySummaryReport = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/dailySummary`, formData, AuthService.getAuthHeader());
	};

	fetchAllInvoicesReport = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/income`, formData, AuthService.getAuthHeader());
	};

	fetchMonthlyInvoicesReport = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/monthlyIncome`, formData, AuthService.getAuthHeader());
	};

	fetchAllPaymentsReport = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/payment`, formData, AuthService.getAuthHeader());
	};

	fetchModeOfPaymentsReport = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/paymentMode`, formData, AuthService.getAuthHeader());
	};

	fetchAllAppointments = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/appointments`, formData, AuthService.getAuthHeader());
	};

	fetchCancelledAppointments = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/cancelAppointments`, formData, AuthService.getAuthHeader());
	};

	fetchMonthlyAppointments = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/monthlyAppointments`, formData, AuthService.getAuthHeader());
	};

	fetchNewPatientsReport = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/patients`, formData, AuthService.getAuthHeader());
	};

	fetchMonthlyNewPatientsReport = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/monthlyPatients`, formData, AuthService.getAuthHeader());
	};

	fetchStockUpdateHistoryDetailReports = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/stockReports`, formData, AuthService.getAuthHeader());
	};

	fetchUnsettledInvoiceReports = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/unsettledInvoices`, formData, AuthService.getAuthHeader());
	};

	fetchAllExpensesReports = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/expenses`, formData, AuthService.getAuthHeader());
	};
	fetchMonthlyExpensesReports = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/monthlyExpenses`, formData, AuthService.getAuthHeader());
	};

	// Payments Received / Day
	fetchPaymentsReceivedPerDayReport = (formData) => {
		return axios.post(`${BACKEND_API_URL}/reports/dailyPaymentReport`, formData, AuthService.getAuthHeader());
	};
}

export default new ReportsService();
