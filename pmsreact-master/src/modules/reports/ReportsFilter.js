import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState, useRef, Children, useReducer } from "react";

import UserService from "../../service/UserService";
import AuthService from "../../service/AuthService";
import ReportsService from "../../service/ReportsService";

import classes from "./reports.module.scss";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";

// import AllInvoicesPrint from "../allinvoices/AllInvoicesPrint";

import Helper from "../helper/helper";
import AutoCompleteSelect from "../../elements/ui/AutoComplete/AutoCompleteSelect";

// import MasterData from "../../../helper/masterdata";
import MasterData from "../helper/masterdata";

import * as moment from "moment";

import { DateRangePicker } from "react-dates";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
// import AllInvoicesDetailTable from "./AllInvoicesDetailTable";
import Button from "@material-ui/core/Button";

// import PrintIcon from "@material-ui/icons/Print";
import AssessmentIcon from "@material-ui/icons/Assessment";
// import AllInvoicesSummaryTable from "./AllInvoicesSummaryTable";
import Paper from "@material-ui/core/Paper";
import * as ReportsConstants from "./ReportsConstants";
import AllInvoicesReports from "./income/allinvoices/AllInvoices";
import MonthlyInvoicesReports from "./income/monthlyinvoice/MonthlyInvoices";
import AllPaymentsReports from "./payments/allpayments/AllPayments";
import ModeOfPaymentsReports from "./payments/modeofpayments/ModeOfPayments";
import AllAppointmentsReports from "./appointments/allappointments/AllAppointments";
import CancelledAppointmentsReports from "./appointments/cancelledappointments/CancelledAppointments";
import MonthlyAppointmentsReports from "./appointments/monthlyappointments/MonthlyAppointments";
import NewPatientsReports from "./patients/newpatients/NewPatients";
import MonthlyNewPatientsReports from "./patients/monthlynewpatients/MonthlyNewPatients";
import AllStockUpdateHistory from "./inventory/allstockupdatehistory/AllStockUpdateHistory";
import UnSettledInvoicesReports from "./amountdue/unsettledinvoices/UnSettledInvoices";
import AllExpensesReports from "./expenses/allexpenses/AllExpenses";
import MonthlyExpensesReports from "./expenses/monthlyexpenses/MonthlyExpenses";
import DailyPaymentsReports from "./payments/DailyPayments/DailyPayments";
import DailySummaryReports from "./dailysummary/dailysummary/DailySummary";

const ReportsFilter = (props) => {
	const [dateRange, setdateRange] = useState({
		startDate: Helper.getTodayMinusMonthsMJS(1),
		endDate: Helper.getTodayMJS(),
	});

	// destructuring dateRange
	const { startDate, endDate } = dateRange;

	const [focus, setFocus] = useState(null);
	// end of date Range init

	const [selectedDoc, setSelectedDoc] = useState("");

	// Patient Medical Group
	const [patientGroupdata, setPatientGroupData] = useState([]);
	const [selectedGroupId, setSelectedGroupId] = useState(null);

	// Refferrer List
	const [referrerList, setReferrerList] = useState([]);
	const [selectedReferrerId, setSelectedReferrerId] = useState(null);

	// Report List
	const [reportsList, setReportsList] = useState(MasterData.reportsListArr);
	const [selectedReportsId, setSelectedReportsId] = useState(null);

	const [subReportsList, setSubReportsList] = useState([]);
	const [selectedSubReportsId, setSelectedSubReportsId] = useState(null);

	const [selectedSubReportsName, setSelectedSubReportsName] = useState("");

	const [doctors, setDoctors] = useState([]);

	const [loading, setLoading] = useState(false);

	const [companyList, setCompanyList] = useState([]);

	const [selectedCompany, setSelectedCompany] = useState({});
	const [selectedCompanyName, setSelectedCompanyName] = useState("");
	const [currency, setCurrency] = useState("");
	const [locale, setLocale] = useState("");

	// calls when clicking date range
	const handleOnDateChange = ({ startDate: start, endDate: end }) => {
		setdateRange({ startDate: start, endDate: end });
	};

	// start
	const [errState, errDispatch] = useReducer(Helper.reducer, ReportsConstants.reportsErrorObject);
	const { reportsError, subreportsError } = errState;

	const [showReports, showDispatch] = useReducer(Helper.reducer, ReportsConstants.reportsShowObject);

	const [reportData, reportDispatch] = useReducer(Helper.reducer, ReportsConstants.reportsDataObject);
	// end

	// const componentRef = useRef();

	useEffect(() => {
		setLoading(false);
		setReportsList(MasterData.reportsListArr);
		setCompanyList(AuthService.getUserInfo().companyDTOs);
		setSelectedCompany(AuthService.getUserInfo().companyDTO.id);
		reloadDoctorsList(AuthService.getUserInfo().companyDTO.id);
		setSelectedCompanyName(AuthService.getUserInfo().companyDTO.companyName);
		setCurrency(AuthService.getUserInfo().companyDTO.companyBaseCurrency);
		setLocale(Helper.getCountryLocale(AuthService.getUserInfo().companyDTO.addressDTO.country));
		getReferralList();
		getGroupData();
	}, []);

	function reloadDoctorsList(id) {
		UserService.fetchAllDoctors(id).then((res) => {
			setDoctors(res.data);
		});
	}

	const handleChange = (event) => {
		setSelectedDoc(event.target.value);
	};

	const handleCompanyChange = (event) => {
		setSelectedCompany(event.target.value);
		reloadDoctorsList(event.target.value);
		let obj = companyList.find((o) => o.id === event.target.value);
		setSelectedCompanyName(obj.companyName);
		setCurrency(obj.companyBaseCurrency);
		setLocale(Helper.getCountryLocale(obj.addressDTO.country));
		resetShowReports();
		setSelectedReportsId(null);
		setSelectedSubReportsId(null);
		setSubReportsList([]);
	};

	const getGroupData = () => {
		const groupData = MasterData.getLookupDataFromType(MasterData.lookupTypes.PatientGroup);
		setPatientGroupData(groupData);
	};

	const getReferralList = () => {
		setReferrerList(MasterData.getLookupDataFromType(MasterData.lookupTypes.PatientReferral));
	};

	const onChangeNameValue = (name, value) => {
		setSelectedGroupId(value === null ? null : value);
	};

	const onChangeReferrer = (name, value) => {
		setSelectedReferrerId(value === null ? null : value);
	};

	const onChangeReports = (name, value) => {
		setSelectedReportsId(value === null ? null : value);
		setSelectedSubReportsId(null);
		if (value !== null) {
			setSubReportsList(Object.values(MasterData.subReportsListArr[value]));
		} else {
			setSubReportsList([]);
		}
	};

	const onChangeSubReports = (name, value) => {
		console.log("selected sub reports" + value);
		setSelectedSubReportsId(value);
	};

	const handleReset = () => {
		// reset the form
		setSelectedReportsId(null);
		setSelectedSubReportsId(null);
		setSelectedSubReportsName("");
		setSelectedReferrerId(null);
		setSelectedGroupId(null);
		setSelectedDoc("");
		setdateRange({
			startDate: Helper.getTodayMinusMonthsMJS(1),
			endDate: Helper.getTodayMJS(),
		});
	};

	const resetShowReports = () => {
		showDispatch({ field: `showAllInvReports`, value: false });
		showDispatch({ field: `showMonthlyInvReports`, value: false });
		showDispatch({ field: `showAllPaymentsReports`, value: false });
		showDispatch({ field: `showMOPaymentsReports`, value: false });
		showDispatch({ field: `showDailyPaymentsReports`, value: false });

		showDispatch({ field: `showAllAppointmentsReports`, value: false });
		showDispatch({ field: `showCancelledAppointments`, value: false });
		showDispatch({ field: `showMonthlyAppointmentsReports`, value: false });
		showDispatch({ field: `showNewPatientsReports`, value: false });
		showDispatch({ field: `showMonthlyNewPatientsReports`, value: false });
		showDispatch({ field: `showAllStockUpdateHistoryDetailReports`, value: false });
		showDispatch({ field: `showAllExpensesReports`, value: false });
		showDispatch({ field: `showMonthlyExpensesReports`, value: false });
		showDispatch({ field: `showUnSettledInvoices`, value: false });

		showDispatch({ field: `showDailySummaryReports`, value: false });
	};

	const isRequiredFieldsAvailable = () => {
		let submitForm = true;
		const validationState = { ...errState };

		validationState.reportsError = selectedReportsId === null ? "Please Select a Report" : "";
		validationState.subreportsError = selectedSubReportsId === null ? "Please Select a Related Report" : "";

		//Check if there is any form errors
		Object.entries(validationState).forEach(([key, value]) => {
			if (value.length > 0) {
				submitForm = false;

				errDispatch({
					field: `${key}`,
					value: `${value}`,
				});
			} else {
				errDispatch({
					field: `${key}`,
					value: "",
				});
			}
		});
		return submitForm;
	};

	// Get Reports based on filter after validation
	const handleGetReport = (e) => {
		e.preventDefault();

		if (!isRequiredFieldsAvailable()) {
			return;
		}
		setLoading(false);

		let formObject = {
			companyId: selectedCompany,
			startDate: moment(startDate).format("YYYY-MM-DD"),
			endDate: moment(endDate).format("YYYY-MM-DD"),
			userId: selectedDoc === "" ? selectedDoc : selectedDoc.id,
			patientGroup: selectedGroupId,
			referrer: selectedReferrerId,
		};

		if (selectedSubReportsId === "DILYSMRYRPT") {
			setSelectedSubReportsName("Daily Summary Reports");
			var start = new Date().getTime();
			ReportsService.fetchDailySummaryReport(formObject).then((res) => {
				reportDispatch({ field: "dailySummaryReports", value: res.data });

				setLoading(true);
				resetShowReports();

				showDispatch({ field: `showDailySummaryReports`, value: true });
				var elapsed = new Date().getTime() - start;
				console.log("elapsed time check" + elapsed);
			});
		} else if (selectedSubReportsId === "ALLINVRPT") {
			setSelectedSubReportsName("All Invoice Reports");
			var start = new Date().getTime();
			ReportsService.fetchAllInvoicesReport(formObject).then((res) => {
				reportDispatch({ field: "incomeReports", value: res.data });
				setLoading(true);
				resetShowReports();

				showDispatch({ field: `showAllInvReports`, value: true });
				var elapsed = new Date().getTime() - start;
				console.log("elapsed time check" + elapsed);
			});
		} else if (selectedSubReportsId === "MONINVRPT") {
			setSelectedSubReportsName("Monthly Invoiced Reports");

			ReportsService.fetchMonthlyInvoicesReport(formObject).then((res) => {
				reportDispatch({ field: "incomeReports", value: res.data });

				setLoading(true);
				resetShowReports();

				showDispatch({ field: `showMonthlyInvReports`, value: true });
			});
		} else if (selectedSubReportsId === "ALLPYMTRPT") {
			setSelectedSubReportsName("All Payments Reports");
			var start = new Date().getTime();
			ReportsService.fetchAllPaymentsReport(formObject).then((res) => {
				reportDispatch({ field: "paymentsReports", value: res.data });
				setLoading(true);

				resetShowReports();

				showDispatch({ field: `showAllPaymentsReports`, value: true });
				var elapsed = new Date().getTime() - start;
				console.log("elapsed time check" + elapsed);
			});
		} else if (selectedSubReportsId === "PYMTMODERPT") {
			setSelectedSubReportsName("Mode of Payments Reports");

			ReportsService.fetchModeOfPaymentsReport(formObject).then((res) => {
				reportDispatch({ field: "mopaymentsReports", value: res.data });

				setLoading(true);

				resetShowReports();

				showDispatch({ field: `showMOPaymentsReports`, value: true });
			});
		} else if (selectedSubReportsId === "PYMTRCVDRPT") {
			setSelectedSubReportsName("Payments Received Per Day");

			ReportsService.fetchPaymentsReceivedPerDayReport(formObject).then((res) => {
				reportDispatch({ field: "dailyPaymentsReports", value: res.data });

				setLoading(true);

				resetShowReports();

				showDispatch({ field: `showDailyPaymentsReports`, value: true });
			});
		} else if (selectedSubReportsId === "ALLAPMTRPT") {
			setSelectedSubReportsName("All Appointments Reports");

			ReportsService.fetchAllAppointments(formObject).then((res) => {
				reportDispatch({ field: "allAppointmentsReports", value: res.data });

				setLoading(true);

				resetShowReports();

				showDispatch({ field: `showAllAppointmentsReports`, value: true });
			});
		} else if (selectedSubReportsId === "CNLAPMTRPT") {
			setSelectedSubReportsName("All Cancelled Appointments Reports");

			ReportsService.fetchCancelledAppointments(formObject).then((res) => {
				reportDispatch({ field: "cancelledAppointmentsReports", value: res.data });

				setLoading(true);

				resetShowReports();

				showDispatch({ field: `showCancelledAppointments`, value: true });
			});
		} else if (selectedSubReportsId === "MTLYAPMTRPT") {
			setSelectedSubReportsName("Monthly Appointments Reports");

			ReportsService.fetchMonthlyAppointments(formObject).then((res) => {
				reportDispatch({ field: "monthlyAppointmentsReports", value: res.data });

				setLoading(true);

				resetShowReports();

				showDispatch({ field: `showMonthlyAppointmentsReports`, value: true });
			});
		} else if (selectedSubReportsId === "NEWPATNRPT") {
			setSelectedSubReportsName("New Patients Reports");

			ReportsService.fetchNewPatientsReport(formObject).then((res) => {
				reportDispatch({ field: "newPatientsReports", value: res.data });

				setLoading(true);

				resetShowReports();

				showDispatch({ field: `showNewPatientsReports`, value: true });
			});
		} else if (selectedSubReportsId === "MTLYNEWPATNRPT") {
			setSelectedSubReportsName("Monthly New Patients Reports");

			ReportsService.fetchMonthlyNewPatientsReport(formObject).then((res) => {
				reportDispatch({ field: "monthlyNewPatientsReports", value: res.data });

				setLoading(true);

				resetShowReports();

				showDispatch({ field: `showMonthlyNewPatientsReports`, value: true });
			});
		} else if (selectedSubReportsId === "ALLSTKUPHISRPT") {
			setSelectedSubReportsName("Stock Update History Reports");

			ReportsService.fetchStockUpdateHistoryDetailReports(formObject).then((res) => {
				reportDispatch({ field: "stockUpdateHistoryDetailReports", value: res.data });

				setLoading(true);

				resetShowReports();
				showDispatch({ field: `showAllStockUpdateHistoryDetailReports`, value: true });
			});
		} else if (selectedSubReportsId === "UNSTLINVRPT") {
			setSelectedSubReportsName("Unsettled Invoice Reports");

			ReportsService.fetchUnsettledInvoiceReports(formObject).then((res) => {
				reportDispatch({ field: "unSettledInvoices", value: res.data });

				setLoading(true);

				resetShowReports();

				showDispatch({ field: `showUnSettledInvoices`, value: true });
			});
		} else if (selectedSubReportsId === "ALLEXPRPT") {
			setSelectedSubReportsName("All Expenses Reports");

			ReportsService.fetchAllExpensesReports(formObject).then((res) => {
				// setAllExpenses(res.data);
				reportDispatch({ field: "allExpenses", value: res.data });

				setLoading(true);

				resetShowReports();
				showDispatch({ field: `showAllExpensesReports`, value: true });
			});
		} else if (selectedSubReportsId === "MTLYEXPRPT") {
			setSelectedSubReportsName("Monthly Expenses Reports");

			ReportsService.fetchMonthlyExpensesReports(formObject).then((res) => {
				reportDispatch({ field: "monthlyExpenses", value: res.data });
				setLoading(true);
				resetShowReports();
				showDispatch({ field: `showMonthlyExpensesReports`, value: true });
			});
		}
	};

	return (
		<>
			{AuthService.isSuperAdmin() ? (
				<div style={{ padding: "15px 0px 10px 0px" }}>
					<FormControl className={classes.formControl}>
						<InputLabel>Company</InputLabel>
						{companyList.length > 0 ? (
							<Select value={selectedCompany} onChange={handleCompanyChange}>
								{companyList.map((company, i) => (
									<MenuItem key={i} value={company.id}>
										{company.companyName}
									</MenuItem>
								))}
							</Select>
						) : (
							""
						)}
					</FormControl>
				</div>
			) : (
				""
			)}
			<Paper style={{ padding: "15px" }} elevation={3}>
				<div className={classes.FourColumnGrid}>
					<div>
						<AutoCompleteSelect
							fullWidth
							data={reportsList}
							label='Reports *'
							id='reports'
							name='reports'
							keyValue='lookupKey'
							keyLabel='lookupValue'
							initialValue={selectedReportsId}
							callbackFunction={onChangeReports}
							errorText={reportsError}></AutoCompleteSelect>
					</div>
					<div>
						<AutoCompleteSelect
							fullWidth
							data={subReportsList}
							label='Related Reports *'
							id='subreports'
							name='subreports'
							keyValue='lookupKey'
							keyLabel='lookupValue'
							margin='dense'
							initialValue={selectedSubReportsId}
							callbackFunction={onChangeSubReports}
							errorText={subreportsError}></AutoCompleteSelect>
					</div>
					<div style={{ textAlign: "center", gridColumn: "3 / span 2" }}>
						<DateRangePicker
							startDatePlaceholderText='From'
							startDate={startDate}
							onDatesChange={handleOnDateChange}
							endDatePlaceholderText='To'
							endDate={endDate}
							numberOfMonths={2}
							displayFormat='DD-MM-YYYY'
							showClearDates={true}
							focusedInput={focus}
							onFocusChange={(focus) => setFocus(focus)}
							startDateId='startDateMookh'
							endDateId='endDateMookh'
							minimumNights={0}
							minDate={moment().subtract(2, "years")}
							maxDate={moment()}
							hideKeyboardShortcutsPanel={true}
							isOutsideRange={() => false}
						/>
					</div>
				</div>
				<div className={classes.FourColumnGrid}>
					<div>
						<FormControl variant='standard' style={{ minWidth: 300 }}>
							<InputLabel shrink id='demo-simple-select-placeholder-label-label'>
								doctors
							</InputLabel>
							<Select value={selectedDoc} onChange={handleChange} displayEmpty margin='dense'>
								<MenuItem value=''>
									<em>All</em>
								</MenuItem>

								{doctors.map((doc, i) => (
									<MenuItem key={i} value={doc}>
										{doc.firstName}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>

					<div>
						<AutoCompleteSelect
							fullWidth
							data={patientGroupdata}
							label='Medical Group'
							id='medicalGroupId'
							name='medicalGroupId'
							keyValue='lookupKey'
							keyLabel='lookupValue'
							margin='dense'
							initialValue={selectedGroupId}
							callbackFunction={onChangeNameValue}></AutoCompleteSelect>
					</div>
					<div>
						<AutoCompleteSelect
							fullWidth
							data={referrerList}
							label='Referrer'
							id='referrerId'
							name='referrerId'
							keyValue='lookupKey'
							keyLabel='lookupValue'
							margin='dense'
							initialValue={selectedReferrerId}
							callbackFunction={onChangeReferrer}></AutoCompleteSelect>
					</div>
				</div>

				<div style={{ display: "grid", columns: "1/-1", textAlign: "center", paddingTop: "20px" }}>
					<div>
						<span>
							<Button variant='contained' color='primary' size='small' type='submit' onClick={handleGetReport} startIcon={<AssessmentIcon />}>
								Get Report
							</Button>
							&nbsp;&nbsp;
						</span>
						<span>
							&nbsp;&nbsp;
							<Button variant='contained' color='default' size='small' onClick={handleReset}>
								Reset
							</Button>
						</span>
					</div>
				</div>
			</Paper>

			<div>
				{showReports.showDailySummaryReports ? (
					<DailySummaryReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.dailySummaryReports}
					/>
				) : (
					""
				)}
				{showReports.showAllInvReports ? (
					<AllInvoicesReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.incomeReports}
					/>
				) : (
					""
				)}
			</div>
			<div>
				{showReports.showMonthlyInvReports ? (
					<MonthlyInvoicesReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.incomeReports}
					/>
				) : (
					""
				)}
			</div>
			<div>
				{showReports.showAllAppointmentsReports ? (
					<AllAppointmentsReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.allAppointmentsReports}
					/>
				) : (
					""
				)}
			</div>
			<div>
				{showReports.showCancelledAppointments ? (
					<CancelledAppointmentsReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.cancelledAppointmentsReports}
					/>
				) : (
					""
				)}
			</div>
			<div>
				{showReports.showMonthlyAppointmentsReports ? (
					<MonthlyAppointmentsReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.monthlyAppointmentsReports}
					/>
				) : (
					""
				)}
			</div>
			<div>
				{showReports.showAllPaymentsReports ? (
					<AllPaymentsReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.paymentsReports}
					/>
				) : (
					""
				)}
			</div>
			<div>
				{showReports.showMOPaymentsReports ? (
					<ModeOfPaymentsReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.mopaymentsReports}
					/>
				) : (
					""
				)}
			</div>

			<div>
				{showReports.showDailyPaymentsReports ? (
					<DailyPaymentsReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.dailyPaymentsReports}
					/>
				) : (
					""
				)}
			</div>

			<div>
				{showReports.showNewPatientsReports ? (
					<NewPatientsReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.newPatientsReports}
					/>
				) : (
					""
				)}
			</div>
			<div>
				{showReports.showMonthlyNewPatientsReports ? (
					<MonthlyNewPatientsReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.monthlyNewPatientsReports}
					/>
				) : (
					""
				)}
			</div>

			<div>
				{showReports.showAllStockUpdateHistoryDetailReports ? (
					<AllStockUpdateHistory
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.stockUpdateHistoryDetailReports}
					/>
				) : (
					""
				)}
			</div>
			<div>
				{showReports.showUnSettledInvoices ? (
					<UnSettledInvoicesReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.unSettledInvoices}
					/>
				) : (
					""
				)}
			</div>
			<div>
				{showReports.showAllExpensesReports ? (
					<AllExpensesReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.allExpenses}
					/>
				) : (
					""
				)}
			</div>
			<div>
				{showReports.showMonthlyExpensesReports ? (
					<MonthlyExpensesReports
						companyname={selectedCompanyName}
						reportcurrency={currency}
						reportlocale={locale}
						reportname={selectedSubReportsName}
						reportdata={reportData.monthlyExpenses}
					/>
				) : (
					""
				)}
			</div>
		</>
	);
};

export default ReportsFilter;
