import React, { useState, useEffect, useReducer } from "react";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

import AuthService from "../../../service/AuthService";
import PatientService from "../../../service/PatientService";
import UserService from "../../../service/UserService";
import MasterService from "../../../service/MasterService";

import NumberFormatCustom from "../../../elements/ui/numberformatcustom";

import classes from "../patient.module.css";
import Helper from "../../helper/helper";
import * as PatientConstants from "../PatientConstants";
import * as moment from "moment";
import MasterData from "../../helper/masterdata";

import AutoCompleteSelect from "../../../elements/ui/AutoComplete/AutoCompleteSelect";
import BackdropLoader from "../../../elements/ui/BackdropLoader/BackdropLoader";
import NotificationDialog from "../../../elements/ui/Dialog/NotificationDialog";

const intialPageState = PatientConstants.paymentPageObject;
const initialState = PatientConstants.patientPaymentObject;
const initialErrorState = PatientConstants.paymentErrorObject;

const useStyles = makeStyles((theme) => ({
	readOnlyColor: {
		background: "#f0f0f0",
	},
}));

const PatientPaymentAdd = (props) => {
	const localClasses = useStyles();
	let history = useHistory();
	const { patientIdParam, invId } = useParams();
	const [patientName, setPatientName] = useState("");
	const [patientCredit, setPatientCredit] = useState(0);
	const [userName, setUserName] = useState("");
	const [paymentModeList, setPaymentModeList] = useState([]);
	const [invoiceList, setInvoiceList] = useState([]);
	const [updateDistribution, setUpdateDistribution] = useState(false);

	const [mainState, dispatch] = useReducer(Helper.reducer, initialState);

	const [pageState, dispatchPageState] = useReducer(Helper.reducer, intialPageState);

	const [errorState, dispatchErrorState] = useReducer(Helper.reducer, initialErrorState);

	const onChange = (e) => {
		const { name, value } = e.target;

		switch (name) {
			case "paymentNowAmount":
				if (value > Helper.getMaxPriceAllowed()) {
					dispatch({ field: name, value: paymentNowAmount });
				} else {
					dispatch({
						field: name,
						value: value.toString().length === 0 ? 0 : value,
					});
				}

				break;
			default:
				dispatch({ field: name, value: value });
				break;
		}
	};

	const onChangeDropdown = (name, value) => {
		dispatch({ field: name, value: value });
	};

	const onChangeIndex = (e, index) => {
		onChangeNameValue(e.target.name, e.target.value, index);
	};

	//Onchange event handler
	const onChangeNameValue = (name, value, index) => {
		const paymentArray = [...invoiceList];
		const payment = { ...paymentArray[index] };

		switch (name) {
			case "appliedAmount":
				let tempAppliedAmount = 0.0;
				if (value.toString().length === 0) {
					tempAppliedAmount = 0.0;
				} else if (parseFloat(value) > payment.balanceDue - payment.creditAppliedAmount) {
					tempAppliedAmount = payment.appliedAmount;
				} else {
					tempAppliedAmount = parseFloat(value);
				}

				payment.appliedAmount = tempAppliedAmount;

				break;

			default:
				break;
		}

		paymentArray[index] = payment;
		setInvoiceList(paymentArray);
	};

	const { advanceAmountUsed, notes, paymentDate, paymentDetails, paymentModeId, paymentNowAmount, bankName, paymentRefNo } = mainState;

	const {
		openSnackMessage,
		isLoading,
		errorWarning,
		disableSubmit,
		isPaymentModeListLoading,
		isInvoiceListLoading,
		isMainDataLoading,
		totalInvoiceDue,
		totalInvoiceDueAfterPayment,
		newPatientCredit,
		invoiceCountDuringLoad,
		fetchAdditionalPaymentDetails,
	} = pageState;

	const { paymentModeError, paymentAmountError } = errorState;

	//Set the key details like created by, payment date, patient id
	useEffect(() => {
		dispatch({
			field: "enteredBy",
			value: AuthService.getLoggedInUserId(),
		});
		dispatch({
			field: "paymentDate",
			value: Helper.getCreatedModifiedDateTime(),
		});
		dispatch({ field: "patientId", value: patientIdParam });
		dispatch({
			field: "companyId",
			value: AuthService.getLoggedInUserCompanyId(),
		});

		//Get logged in user name
		UserService.fetchUserById(AuthService.getLoggedInUserId()).then((res) => {
			setUserName(res.data.firstName + " " + res.data.lastName);
		});

		PatientService.fetchPatientById(patientIdParam)
			.then((res) => {
				setPatientName(res.data.patientName);
				setPatientCredit(res.data.patientCredit);
			})
			.finally(() => {
				dispatchPageState({ field: "isMainDataLoading", value: false });
			});
	}, [patientIdParam]);

	//Load the page only when doctor list and procedure list are fetched.
	useEffect(() => {
		if (!isInvoiceListLoading && !isPaymentModeListLoading && !isMainDataLoading) {
			setUpdateDistribution(true);
			dispatchPageState({ field: "isLoading", value: false });
		}
	}, [isInvoiceListLoading, isPaymentModeListLoading, isMainDataLoading]);

	//When Payment amount is changes, do the distribution again
	useEffect(() => {
		if (!isLoading) {
			setUpdateDistribution(true);
		}
	}, [paymentNowAmount, isLoading]);

	//Automatically assign the credits(if any) and the payment amount to the pending invoices
	useEffect(() => {
		if (updateDistribution) {
			let remainingPayment = paymentNowAmount;
			let remainingCredit = patientCredit;
			const detailsArray = [...invoiceList];

			//Apply past credits
			detailsArray.map((inv) => {
				if (remainingCredit > inv.balanceDue) {
					inv.creditAppliedAmount = inv.balanceDue;
					remainingCredit = remainingCredit - inv.balanceDue;
				} else {
					inv.creditAppliedAmount = remainingCredit;
					remainingCredit = 0;
				}

				return "";
			});

			//Apply the pay now amount
			detailsArray.map((inv) => {
				if (remainingPayment > inv.balanceDue - inv.creditAppliedAmount) {
					inv.appliedAmount = inv.balanceDue - inv.creditAppliedAmount;
					remainingPayment = remainingPayment - (inv.balanceDue - inv.creditAppliedAmount);
				} else {
					inv.appliedAmount = remainingPayment;
					remainingPayment = 0;
				}

				return "";
			});
			setInvoiceList(detailsArray);
			setUpdateDistribution(false);
		}
	}, [updateDistribution, paymentNowAmount, invoiceList, patientCredit]);

	useEffect(() => {
		if (isPaymentModeListLoading) {
			getPaymentModeList();
		}
	}, [isPaymentModeListLoading]);

	useEffect(() => {
		if (isInvoiceListLoading) {
			getPatientInvoicesByPatientId(patientIdParam, false);
		}
	}, [isInvoiceListLoading, patientIdParam]);

	//Get the pending invoices for a particular patient
	const getPatientInvoicesByPatientId = (id, isAll) => {
		PatientService.fetchPatientInvoicesByPatientId(id)
			.then((response) => {
				const resultArray = Array.isArray(response.data) ? response.data : [];
				const detailsArray = [...paymentDetails];
				let originalCount = 0;
				resultArray
					.filter((x) => x.totalAmount - (x.paidAmount === null ? 0 : x.paidAmount) > 0 && x.isCancelled === "NO")
					.map((inv) => {
						originalCount = originalCount + 1;
						const detailObject = { ...PatientConstants.paymentDetailObject };
						detailObject.invoiceId = inv.id;
						detailObject.invoiceNo = inv.invoiceNo;
						detailObject.invoiceAmount = inv.totalAmount;
						detailObject.invoiceDate = inv.invoiceDate;
						detailObject.balanceDue = inv.totalAmount - inv.paidAmount;
						if (detailsArray.findIndex((x) => x.invoiceId === inv.id) === -1) {
							detailsArray.push(detailObject);
						}
						return "";
					});

				dispatchPageState({
					field: "invoiceCountDuringLoad",
					value: originalCount,
				});

				//filter when invoice id is passed as param
				if (!isAll) {
					if (!(invId == null) && invId !== null) {
						setInvoiceList(detailsArray.filter((x) => x.invoiceId === parseInt(invId)));
					} else {
						setInvoiceList(detailsArray);
					}
				} else {
					setInvoiceList(detailsArray);
				}
			})
			.finally(() => {
				dispatchPageState({ field: "isInvoiceListLoading", value: false });
				setUpdateDistribution(true);
			});
	};

	//Calculate the summary total invoice due, credits applied and so on
	useEffect(() => {
		let totalCreditUsed = 0.0;
		let totalBalanceDue = 0.0;
		let totalAppliedAmount = 0.0;
		let newCreditAmt = 0.0;

		const detailsArray = [...invoiceList];

		detailsArray.map((inv) => {
			totalCreditUsed = totalCreditUsed + inv.creditAppliedAmount;
			totalBalanceDue = totalBalanceDue + inv.balanceDue;
			totalAppliedAmount = totalAppliedAmount + inv.appliedAmount;

			return "";
		});
		let additionalCreditPayment = 0.0;

		if (paymentNowAmount > totalBalanceDue - totalCreditUsed) {
			additionalCreditPayment = paymentNowAmount - (totalBalanceDue - totalCreditUsed);
		}
		newCreditAmt = patientCredit - totalCreditUsed + additionalCreditPayment;

		dispatch({ field: "advanceAmountUsed", value: totalCreditUsed });
		dispatchPageState({
			field: "totalInvoiceDue",
			value: totalBalanceDue,
		});
		dispatchPageState({
			field: "totalInvoiceDueAfterPayment",
			value: totalBalanceDue - totalCreditUsed - totalAppliedAmount,
		});
		dispatchPageState({ field: "newPatientCredit", value: newCreditAmt });
	}, [invoiceList, patientCredit, paymentNowAmount]);

	//Fetch the tax list
	const getPaymentModeList = () => {
		MasterService.fetchAllPaymentModesByCompanyId(AuthService.getLoggedInUserCompanyId())
			.then((response) => {
				const modes = Array.isArray(response.data) ? response.data : [];
				setPaymentModeList(modes);
			})
			.finally(() => {
				dispatchPageState({ field: "isPaymentModeListLoading", value: false });
			});
	};

	useEffect(() => {
		if (!(paymentModeId == null) && paymentModeId !== null && !isPaymentModeListLoading) {
			//get payment type
			const paymentType = paymentModeList.find((x) => x.id === paymentModeId).paymentType;
			dispatchPageState({
				field: "fetchAdditionalPaymentDetails",
				value: paymentType === "CQE" || paymentType === "NET" ? true : false,
			});

			//Clear out the values if its no cheque or net banking
			if (paymentType !== "CQE" && paymentType !== "NET") {
				dispatch({ field: "bankName", value: null });
				dispatch({ field: "paymentRefNo", value: null });
			}
		}
	}, [paymentModeId, paymentModeList, isPaymentModeListLoading]);

	//Remove an invoice from payment list
	const handleDeleteInvoice = (index) => {
		const invoiceArray = [...invoiceList];
		invoiceArray.splice(index, 1);

		setInvoiceList(invoiceArray);
		setUpdateDistribution(true);
	};

	//Verify whether all required fields are filled in before submitting data to server
	const isRequiredFieldsAvailable = () => {
		let submitForm = true;
		const validationState = { ...errorState };

		if (invoiceList.length === 0) {
			submitForm = false;

			dispatchPageState({
				field: "errorWarning",
				value: submitForm ? "" : "No outstanding invoices available for payment.",
			});
			return submitForm;
		}

		//if no payment mode entered
		validationState.paymentModeError = paymentModeId === null ? "Please enter Payment mode" : "";

		//if no credit applied & no payment amount entered, raise error.
		validationState.paymentAmountError =
			parseFloat(paymentNowAmount) === 0 && parseFloat(advanceAmountUsed) === 0 ? "Please enter Payment Amount" : "";

		//Check if there are any form errors
		Object.entries(validationState).forEach(([key, value]) => {
			if (value.length > 0) {
				submitForm = false;
				dispatchErrorState({
					field: `${key}`,
					value: `${value}`,
				});
			} else {
				dispatchErrorState({
					field: `${key}`,
					value: "",
				});
			}
		});

		dispatchPageState({
			field: "errorWarning",
			value: submitForm ? "" : "Ensure higlighted fields are corrected.",
		});

		return submitForm;
	};

	const handleClose = (event, reason) => {
		dispatchPageState({
			field: "openSnackMessage",
			value: false,
		});
		//history.goBack();
		history.push("/patient/detail/" + patientIdParam);
	};

	const handleCancel = () => {
		//history.goBack();
		history.push("/patient/detail/" + patientIdParam);
	};

	const submitForm = (e) => {
		e.preventDefault();

		if (!isRequiredFieldsAvailable()) {
			return;
		}
		//disable the submit button
		dispatchPageState({
			field: "disableSubmit",
			value: true,
		});

		const submitState = { ...mainState };
		submitState.loginId = AuthService.getLoggedInUserId();
		submitState.paymentNo = moment().format("YYYYMMDDHHmmss");
		submitState.updatedPatientCredit = newPatientCredit;

		submitState.paymentDate = moment(submitState.paymentDate, "YYYY-MM-DD HH:mm");

		const invoices = [...invoiceList];
		invoices.map((proc, index) => {
			const inv = { ...proc };
			inv.appliedAmount = inv.appliedAmount + inv.creditAppliedAmount;
			return "";
		});

		submitState.paymentDetails = [...invoices.filter((x) => x.appliedAmount > 0)];

		//submitState.invoiceDetails = procedures;
		//console.log(submitState);

		PatientService.addPatientPayment(submitState)
			.then((response) => {
				dispatchPageState({
					field: "openSnackMessage",
					value: true,
				});
			})
			.catch((ex) => {
				console.log(ex);
				dispatchPageState({
					field: "disableSubmit",
					value: false,
				});
			});
	};

	return (
		<>
			{isLoading === false ? (
				<div>
					<Typography variant='h5' gutterBottom>
						<span>{patientName}</span>
						<span style={{ fontSize: "1rem", marginLeft: "5px" }}>(#{patientIdParam})</span>
					</Typography>
					<Typography variant='subtitle1' gutterBottom>
						Please fill in patient payment details
					</Typography>
					{errorWarning.length > 0 ? (
						<Typography variant='subtitle1' gutterBottom>
							<span className={`${classes.LeftMargin5} ${classes.ErrorText}`}>{errorWarning}</span>
						</Typography>
					) : (
						""
					)}

					<form onSubmit={submitForm} noValidate>
						<div className={classes.PatientPaymentAddEditLayout}>
							<div className={classes.PatientPaymentAddEditFormSection}>
								<Paper style={{ padding: "10px" }} elevation={3}>
									<div className={classes.ThreeColumnGrid}>
										<div>
											<Typography variant='body2' gutterBottom>
												Entered by: <span style={{ fontWeight: "bold" }}>{userName}</span>
											</Typography>
										</div>
										<div>
											<Typography variant='body2' gutterBottom>
												Created at:{" "}
												<span style={{ fontWeight: "bold" }}>
													{/* {Helper.getFormattedDate(paymentDate, "ll")} */}
													{Helper.getDateTimeFromUTC(paymentDate, "ll")}
												</span>
											</Typography>
										</div>
										<div>
											<Typography variant='body2' gutterBottom>
												Patient Credit ({AuthService.getLoggedInCompanyCurrencyCode()}):{" "}
												<span style={{ fontWeight: "bold" }}>{Helper.getFormattedNumber(patientCredit)}</span>
											</Typography>
										</div>
										<div>
											<AutoCompleteSelect
												fullWidth
												data={paymentModeList}
												label='Payment Mode *'
												id='paymentModeId'
												name='paymentModeId'
												keyValue='id'
												keyLabel='paymentModeName'
												initialValue={paymentModeId}
												callbackFunction={onChangeDropdown}
												variant='standard'
												errorText={paymentModeError}></AutoCompleteSelect>
										</div>
										<div>
											<TextField
												label={"Payment Amount (" + AuthService.getLoggedInCompanyCurrencyCode() + ")"}
												id='paymentNowAmount'
												name='paymentNowAmount'
												size='small'
												margin='dense'
												fullWidth
												variant='standard'
												value={paymentNowAmount}
												onChange={onChange}
												required
												inputProps={{ maxLength: 10 }}
												InputProps={{
													inputComponent: NumberFormatCustom,
													inputProps: Helper.getPriceInputFormatBasedOnCountry(),
												}}
												error={paymentAmountError.length > 0 ? true : false}
												helperText={paymentAmountError}
											/>
										</div>
										<div>
											<TextField
												label='Payment Notes'
												id='notes'
												name='notes'
												size='small'
												margin='dense'
												fullWidth
												variant='standard'
												inputProps={{ maxLength: 255 }}
												value={notes !== null ? notes : ""}
												onChange={onChange}
												multiline
											/>
										</div>
										{fetchAdditionalPaymentDetails ? (
											<>
												<div>
													<TextField
														label='Bank Name'
														id='bankName'
														name='bankName'
														size='small'
														margin='dense'
														fullWidth
														variant='standard'
														inputProps={{ maxLength: 50 }}
														value={bankName !== null ? bankName : ""}
														onChange={onChange}
													/>
												</div>
												<div>
													<TextField
														label='Ref No'
														id='paymentRefNo'
														name='paymentRefNo'
														size='small'
														margin='dense'
														fullWidth
														variant='standard'
														inputProps={{ maxLength: 50 }}
														value={paymentRefNo !== null ? paymentRefNo : ""}
														onChange={onChange}
													/>
												</div>{" "}
											</>
										) : (
											""
										)}
									</div>
								</Paper>
								<Paper style={{ padding: "15px", backgroundColor: "#f0f0f0" }} elevation={3}>
									<div>
										{invoiceList.map((inv, index) => (
											<Paper key={index} className={classes.InvoicePaymentGrid} style={{ marginBottom: "10px", padding: "5px" }}>
												<div>
													<TextField
														className={localClasses.readOnlyColor}
														label='Invoice No'
														id='invoiceNo'
														name='invoiceNo'
														size='small'
														margin='dense'
														fullWidth
														variant='outlined'
														value={inv.invoiceNo}
														InputProps={{
															readOnly: true,
														}}
													/>
												</div>
												<div>
													<TextField
														className={localClasses.readOnlyColor}
														label='Invoice Date'
														id='invoiceDate'
														name='invoiceDate'
														size='small'
														margin='dense'
														fullWidth
														variant='outlined'
														value={Helper.getDateTimeFromUTC(inv.invoiceDate, "ll")}
														InputProps={{
															readOnly: true,
														}}
													/>
												</div>
												<div>
													<TextField
														className={localClasses.readOnlyColor}
														label={"Amount"}
														id='invoiceAmount'
														name='invoiceAmount'
														size='small'
														margin='dense'
														fullWidth
														variant='outlined'
														value={inv.invoiceAmount}
														InputProps={{
															inputComponent: NumberFormatCustom,
															inputProps: Helper.getPriceInputFormatBasedOnCountry(),
															readOnly: true,
														}}
													/>
												</div>
												<div>
													<TextField
														className={localClasses.readOnlyColor}
														label={"Balance Due (" + AuthService.getLoggedInCompanyCurrencyCode() + ")"}
														id='balanceDue'
														name='balanceDue'
														size='small'
														margin='dense'
														fullWidth
														variant='outlined'
														value={inv.balanceDue}
														InputProps={{
															inputComponent: NumberFormatCustom,
															inputProps: Helper.getPriceInputFormatBasedOnCountry(),
															readOnly: true,
														}}
													/>
												</div>
												<div>
													<TextField
														className={localClasses.readOnlyColor}
														label={"Credit Applied (" + AuthService.getLoggedInCompanyCurrencyCode() + ")"}
														id='creditAppliedAmount'
														name='creditAppliedAmount'
														size='small'
														margin='dense'
														fullWidth
														variant='outlined'
														value={inv.creditAppliedAmount}
														InputProps={{
															inputComponent: NumberFormatCustom,
															inputProps: Helper.getPriceInputFormatBasedOnCountry(),
															readOnly: true,
														}}
													/>
												</div>
												<div>
													<TextField
														className={localClasses.readOnlyColor}
														label={"Applied Amount (" + AuthService.getLoggedInCompanyCurrencyCode() + ")"}
														id='appliedAmount'
														name='appliedAmount'
														size='small'
														margin='dense'
														fullWidth
														variant='outlined'
														value={inv.appliedAmount}
														onChange={(e) => onChangeIndex(e, index)}
														InputProps={{
															inputComponent: NumberFormatCustom,
															inputProps: Helper.getPriceInputFormatBasedOnCountry(),
															readOnly: true,
														}}
													/>
												</div>
												<div style={{ marginTop: "10px" }}>
													<IconButton aria-label='delete' onClick={() => handleDeleteInvoice(index)}>
														<DeleteIcon />
													</IconButton>
												</div>
											</Paper>
										))}
									</div>
									<div>
										{invoiceCountDuringLoad > invoiceList.length ? (
											<span className={classes.RightMargin5}>
												<Button
													variant='contained'
													color='default'
													size='small'
													startIcon={<AddIcon />}
													onClick={() => getPatientInvoicesByPatientId(patientIdParam, true)}>
													Add Outstanding Invoice(s)
												</Button>
											</span>
										) : (
											""
										)}
									</div>
								</Paper>
								<Paper style={{ padding: "10px" }} elevation={3}>
									<div className={classes.AddPaymentSummaryFooter}>
										<div style={{ textAlign: "center" }}>
											<Typography variant='body2' gutterBottom>
												Invoice(s) Due ({AuthService.getLoggedInCompanyCurrencyCode()})<br></br>
												<span style={{ fontWeight: "bold" }}> {Helper.getFormattedNumber(totalInvoiceDue)}</span>
											</Typography>
										</div>
										<div style={{ textAlign: "center" }}>-</div>
										<div style={{ textAlign: "center" }}>
											<Typography variant='body2' gutterBottom>
												Credit Used ({AuthService.getLoggedInCompanyCurrencyCode()}) <br />
												<span style={{ fontWeight: "bold" }}> {Helper.getFormattedNumber(advanceAmountUsed)}</span>
											</Typography>
										</div>
										<div style={{ textAlign: "center" }}>-</div>
										<div style={{ textAlign: "center" }}>
											<Typography variant='body2' gutterBottom>
												Payment ({AuthService.getLoggedInCompanyCurrencyCode()}
												) <br />
												<span style={{ fontWeight: "bold" }}> {Helper.getFormattedNumber(paymentNowAmount)}</span>
											</Typography>
										</div>
										<div style={{ textAlign: "center" }}>=</div>
										<div style={{ textAlign: "center" }}>
											<Typography variant='body2' gutterBottom>
												Due (after payment) ({AuthService.getLoggedInCompanyCurrencyCode()})
												<span style={{ fontWeight: "bold" }}> {Helper.getFormattedNumber(totalInvoiceDueAfterPayment)}</span>
											</Typography>
										</div>
										<div style={{ textAlign: "center" }}>
											<Typography variant='body2' gutterBottom>
												Credit (after payment) ({AuthService.getLoggedInCompanyCurrencyCode()})<br></br>
												<span style={{ fontWeight: "bold" }}> {Helper.getFormattedNumber(newPatientCredit)}</span>
											</Typography>
										</div>
									</div>
								</Paper>
							</div>
							<div className={classes.PatientPaymentAddEditButtonSection}>
								<div>
									<Button
										variant='contained'
										color='primary'
										size='small'
										type='submit'
										fullWidth
										startIcon={<SaveIcon />}
										disabled={disableSubmit ? true : false}>
										Save
									</Button>
								</div>
								<div>
									<Button variant='contained' color='default' size='small' fullWidth onClick={handleCancel} startIcon={<CancelIcon />}>
										Cancel
									</Button>
								</div>
							</div>
						</div>
					</form>
				</div>
			) : (
				<BackdropLoader></BackdropLoader>
			)}

			<NotificationDialog open={openSnackMessage} handleClose={handleClose} title='Payments'>
				Patient Payment added successfully!!
			</NotificationDialog>
		</>
	);
};

export default PatientPaymentAdd;
