import MasterService from "../../service/MasterService";
import Helper from "./helper";
import AuthService from "../../service/AuthService";

class MasterData {
	lookupTypes = {
		PatientGroup: "MDG",
		PatientReferral: "RFL",
		BloodGroup: "BGP",
		PatientRelationship: "REL",
		Ethnicity: "ETH",
		Nationality: "NAT",
		Occupation: "OCC",
		Country: "CNT",
		MedicalHistory: "MDH",
		AppointmentStatus: "APS",
		UserRole: "ROL",
		ItemTypes: "ITY",
		Manufacturers: "MFR",
		ExpenseTypes: "EXP",
		ConsumptionType: "CSM",
		DrugType: "DTY",
		StrengthUnit: "UST",
		CancellationTypes: "CNR",
		Locales: "LLE",
		TimeZones: "TIZ",
		StockingUnit: "UOM",
	};

	recordStatus = {
		update: "UPDATE",
		insert: "INSERT",
		delete: "DELETE",
	};

	pageMode = {
		Add: "ADD",
		Edit: "EDIT",
	};

	paymentModes = [
		{
			companyId: 1,
			id: 1,
			paymentModeName: "Cash",
		},
		{
			companyId: 1,
			id: 2,
			paymentModeName: "Cheque",
		},
		{
			companyId: 1,
			id: 3,
			paymentModeName: "Visa/Master",
		},
		{
			companyId: 1,
			id: 4,
			paymentModeName: "Nets",
		},
	];

	setMasterData() {
		MasterService.fetchAllLookup(AuthService.getLoggedInUserCompanyId()).then((response) => {
			const resultArray = Array.isArray(response.data) ? response.data : [];
			localStorage.setItem("lookupdata", JSON.stringify(resultArray));
		});
	}

	getLookupValueFromKey(keyName, lookupType) {
		if (keyName == null || keyName === null) return "";
		const lookupArray = JSON.parse(localStorage.getItem("lookupdata"));

		const lookupObj = lookupArray !== null && lookupArray.find((x) => x.lookupKey === keyName && x.lookupType === lookupType);
		return !(lookupObj == null) ? lookupObj.lookupValue : null;
		/*  return (
      lookupArray.find(
        (x) => x.lookupKey === keyName && x.lookupType === lookupType
      ).lookupValue  
    );*/
	}

	getLookupDataFromType(lookupType) {
		if (lookupType == null || lookupType === null) return [];
		const lookupArray = JSON.parse(localStorage.getItem("lookupdata"));
		return lookupArray.filter((x) => x.lookupType === lookupType);
	}

	getLookupObjectFromKey(keyName, lookupType) {
		if (keyName == null || keyName === null) return "";
		const lookupArray = JSON.parse(localStorage.getItem("lookupdata"));
		return lookupArray.find((x) => x.lookupKey === keyName && x.lookupType === lookupType);
	}

	getRolesAsString(roleArray) {
		let roleString = "";
		roleArray.map((item) => {
			roleString = roleString + item.roleDesc + ", ";
		});

		return Helper.removeEndComma(roleString);
	}

	reportsListArr = [
		{ lookupKey: "INCRPT", lookupValue: "Income" },
		{ lookupKey: "APPRPT", lookupValue: "Appointment" },

		{ lookupKey: "PYMTRPT", lookupValue: "Payments" },
		{ lookupKey: "PATNRPT", lookupValue: "Patients" },
		{ lookupKey: "AMNTDUERPT", lookupValue: "Amount Due" },
		{ lookupKey: "INVNTRYRPT", lookupValue: "Inventory" },
		{ lookupKey: "EXPNSRPT", lookupValue: "Expense" },
		{ lookupKey: "DILYSMRYRPT", lookupValue: "Daily Summary" },
	];

	subReportsListArr = {
		INCRPT: [
			{ lookupKey: "ALLINVRPT", lookupValue: "All invoice" },
			{ lookupKey: "MONINVRPT", lookupValue: "Monthly invoice" },
		],
		PYMTRPT: [
			{ lookupKey: "ALLPYMTRPT", lookupValue: "All payments" },
			{ lookupKey: "PYMTMODERPT", lookupValue: "Mode of payments" },
			{ lookupKey: "PYMTRCVDRPT", lookupValue: "Payments received per day" },
		],
		APPRPT: [
			{ lookupKey: "ALLAPMTRPT", lookupValue: "All appointmnets" },
			{ lookupKey: "CNLAPMTRPT", lookupValue: "Cancelled appointments" },
			{ lookupKey: "MTLYAPMTRPT", lookupValue: "Monthly appointmnets count" },
		],
		PATNRPT: [
			{ lookupKey: "NEWPATNRPT", lookupValue: "New patient" },
			{ lookupKey: "MTLYNEWPATNRPT", lookupValue: "Monthly new patient" },
		],
		AMNTDUERPT: [{ lookupKey: "UNSTLINVRPT", lookupValue: "Unsetted invoices" }],
		EXPNSRPT: [
			{ lookupKey: "ALLEXPRPT", lookupValue: "All expenses" },
			{ lookupKey: "MTLYEXPRPT", lookupValue: "Monthly expenses" },
		],
		INVNTRYRPT: [{ lookupKey: "ALLSTKUPHISRPT", lookupValue: "All stock update history" }],
		DILYSMRYRPT: [{ lookupKey: "DILYSMRYRPT", lookupValue: "Daily Summary Report" }],
	};

	getLocaleBasedOnCountry(cntryCode) {
		return this.getLookupValueFromKey(cntryCode, this.lookupTypes.Locales) || "en";
	}

	//Actions for the menu in Invoice Index page
	invoiceMenuActions = {
		edit: "EDIT",
		cancel: "CANCEL",
		email: "EMAIL",
		print: "PRINT",
		pay: "PAY",
	};

	//Actions for the menu in payment Index page
	paymentMenuActions = {
		cancel: "CANCEL",
		email: "EMAIL",
		print: "PRINT",
	};

	getLookupList(companyId, type, promiseFunc, finallyFunc) {
		MasterService.fetchLookupByType(type, companyId)
			.then(promiseFunc)
			.catch((ex) => {
				console.log(ex);
			})
			.finally(finallyFunc);
	}

	getValueFromLookupList(list, key) {
		const lookupRow = list.find((x) => x.lookupKey === key);
		return !(lookupRow == null) && lookupRow !== null ? lookupRow.lookupValue : null;
	}

	settingLookupListArr = [
		{ lookupType: "DTY", lookupTypeDesc: "Drug Type" },
		{ lookupType: "ETH", lookupTypeDesc: "Ethnicity" },
		{ lookupType: "EXP", lookupTypeDesc: "Expense Types" },
		{ lookupType: "MFR", lookupTypeDesc: "Manufacturers" },
		{ lookupType: "MDH", lookupTypeDesc: "Medical History" },
		{ lookupType: "MDG", lookupTypeDesc: "Medical Groups" },
		{ lookupType: "NAT", lookupTypeDesc: "Nationality" },
		{ lookupType: "OCC", lookupTypeDesc: "Occupation" },
		{ lookupType: "RFL", lookupTypeDesc: "Referrals" },
		{ lookupType: "UST", lookupTypeDesc: "Stregth Unit" },
		{ lookupType: "UOM", lookupTypeDesc: "Unit of Measure" },
	];
}

export default new MasterData();
