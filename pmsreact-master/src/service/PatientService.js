import axios from "axios";
import AuthService from "./AuthService";

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL;

class PatientService {
	fetchPatients = (searchTerms) => {
		return axios.post(`${BACKEND_API_URL}/patient/search`, searchTerms);
	};

	addPatient = (patientInfo) => {
		return axios.post(`${BACKEND_API_URL}/patient/addPatient`, patientInfo);
	};

	fetchPatientById = (patientId) => {
		return axios.get(`${BACKEND_API_URL}/patient/${patientId}`);
	};

	fetchAppointmentsByPatientId = (searchTerms) => {
		return axios.post(`${BACKEND_API_URL}/appointment/byPatient`, searchTerms);
	};

	updatePatient = (patientInfo) => {
		return axios.put(`${BACKEND_API_URL}/patient/updatePatient/${patientInfo.id}`, patientInfo);
	};

	deletePatient = (id) => {
		return axios.delete(`${BACKEND_API_URL}/patient/deletePatient/${id}`);
	};

	fetchPatientClinicalNotes = (patientId) => {
		return axios.get(`${BACKEND_API_URL}/patient/notes/all/${patientId}`);
	};

	addPatientClinicalNote = (notesData) => {
		return axios.post(`${BACKEND_API_URL}/patient/notes/addNote`, notesData);
	};

	fetchPatientClinicalNotesById = (id) => {
		return axios.get(`${BACKEND_API_URL}/patient/notes/${id}`);
	};

	updatePatientClinicalNote = (notesData) => {
		return axios.put(`${BACKEND_API_URL}/patient/notes/updateNote/${notesData.id}`, notesData);
	};

	deletePatientClinicalNote = (id) => {
		return axios.delete(`${BACKEND_API_URL}/patient/notes/deleteNote/${id}`);
	};

	searchPatient = (id) => {
		return axios.get(`${BACKEND_API_URL}/patient/${id}`);
	};

	fetchPatientProceduresByPatientId = (id) => {
		return axios.get(`${BACKEND_API_URL}/treatment/all/${id}`, AuthService.getAuthHeader());
	};

	addPatientTreatment = (data) => {
		return axios.post(`${BACKEND_API_URL}/treatment/addTreatment`, data);
	};

	updatePatientTreatment = (data) => {
		return axios.put(`${BACKEND_API_URL}/treatment/updateTreatment/${data.id}`, data);
	};

	fetchPatientTreatmentByTreatmentId = (id) => {
		return axios.get(`${BACKEND_API_URL}/treatment/${id}`, AuthService.getAuthHeader());
	};

	//Fetch Invoices for a particular patient
	fetchPatientInvoicesByPatientId = (id) => {
		return axios.get(`${BACKEND_API_URL}/invoice/all/${id}`, AuthService.getAuthHeader());
	};

	//Add invoice for a patient
	addPatientInvoice = (data) => {
		return axios.post(`${BACKEND_API_URL}/invoice/addInvoice`, data, AuthService.getAuthHeader());
	};

	//Update a particular invoice
	updatePatientInvoice = (data) => {
		return axios.put(`${BACKEND_API_URL}/invoice/updateInvoice/${data.id}`, data, AuthService.getAuthHeader());
	};

	//Fetch a particular invoice
	fetchPatientInvoiceByInvoiceId = (id) => {
		return axios.get(`${BACKEND_API_URL}/invoice/${id}`, AuthService.getAuthHeader());
	};

	//Fetch Payments for a particular patient
	fetchPatientPaymentsByPatientId = (id) => {
		return axios.get(`${BACKEND_API_URL}/payment/all/${id}`, AuthService.getAuthHeader());
	};

	//Add payment for a patient
	addPatientPayment = (data) => {
		return axios.post(`${BACKEND_API_URL}/payment/addPayment`, data, AuthService.getAuthHeader());
	};

	//Fetch ledger for a particular patient
	fetchPatientLedgerByPatientId = (id) => {
		return axios.get(`${BACKEND_API_URL}/patient/allLedgers/${id}`, AuthService.getAuthHeader());
	};

	//Update a particular payment (for cancellation purpose)
	updatePatientPayment = (data) => {
		return axios.put(`${BACKEND_API_URL}/payment/updatePayment/${data.id}`, data, AuthService.getAuthHeader());
	};

	uploadFile = (formData) => {
		return axios.post(`${BACKEND_API_URL}/patientFile/addPatientFile`, formData, {
			headers: {
				Authorization: "Bearer " + AuthService.getUserInfo().token,
				"Content-type": "multipart/form-data",
			},
		});
	};

	fetchPatientFilesById = (id) => {
		return axios.get(`${BACKEND_API_URL}/patientFile/all/${id}`, AuthService.getAuthHeader());
	};

	fetchInvoiceReportById = (id) => {
		return axios.get(`${BACKEND_API_URL}/invoice/report/${id}`, AuthService.getAuthHeaderForBlobResponse());
	};

	fetchPaymentReportById = (id) => {
		return axios.get(`${BACKEND_API_URL}/payment/report/${id}`, AuthService.getAuthHeaderForBlobResponse());
	};

	mcReport = (formData) => {
		return axios.post(`${BACKEND_API_URL}/patient/mcReport`, formData, AuthService.getAuthHeaderForBlobResponse());
	};

	deleteMediaFile = (id) => {
		return axios.delete(`${BACKEND_API_URL}/patientFile/deletePatientFile/${id}`, AuthService.getAuthHeader());
	};
}

export default new PatientService();
