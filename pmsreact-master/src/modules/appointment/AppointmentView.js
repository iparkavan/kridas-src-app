import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import moment from "moment";
import "moment-timezone";

import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import TimeKeeper from "react-timekeeper";
import AppointmentService from "../../service/AppointmentService";

import "react-phone-number-input/style.css";

import close from "../../assets/images/close.svg";
import Modal from "../../elements/ui/Modal/Modal";
import MasterData from "../helper/masterdata";
import AutoCompleteSelect from "../../elements/ui/AutoComplete/AutoCompleteSelect";
import CancelScheduleSendIcon from "@material-ui/icons/CancelScheduleSend";
import ScheduleIcon from "@material-ui/icons/Schedule";
import PhoneAndroidOutlinedIcon from "@material-ui/icons/PhoneAndroidOutlined";
import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
import WcOutlinedIcon from "@material-ui/icons/WcOutlined";
import NotesTwoToneIcon from "@material-ui/icons/NotesTwoTone";
import style from "./style.js";
import { makeStyles } from "@material-ui/core";

import InputLabel from "@material-ui/core/InputLabel";

import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import AuthService from "../../service/AuthService";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import EditTwoToneIcon from "@material-ui/icons/EditTwoTone";
import TextField from "@material-ui/core/TextField";

import Helper from "../helper/helper";

const WEBSITE_URL = process.env.REACT_APP_WEBSITE_URL;

const AppointmentView = (props) => {
	// const {appointmentStart, disableSuperAdmin, docList, time} = props;
	let history = useHistory();
	const [appointmentStart, setAppointmentStart] = useState("");
	const [displayAppointmentStart, setDisplayAppointmentStart] = useState("");

	const [modal, setModal] = useState(props.modal);

	const [cancel, setCancel] = useState(false);

	const [time, setTime] = useState("00:00 am");
	const [displayTime, setDisplayTime] = useState("00:00 am");

	const [showTime, setShowTime] = useState(false);
	const [cancellationType, setCancellationType] = useState([]);
	const [cancellationReasonCode, setCancellationReasonCode] = useState("");
	const [disableCancel, setDisableCancel] = useState(true);
	const [waitingTime, setWaitingTime] = useState("");
	const [engagedTime, setEngagedTime] = useState("");
	const [totalStayTime, setTotalStayTime] = useState("");
	const [showReschedule, setShowReschedule] = useState(false);
	const [showDocChange, setShowDocChange] = useState(false);
	const [showNotes, setShowNotes] = useState(false);
	const [appointmentNotes, setAppointmentNotes] = useState("");

	const [hover, setHover] = useState(false);
	const classes = useStyles();
	const [doctors, setDoctors] = useState([]);
	const [selectedDoc, setSelectedDoc] = useState(0);
	const [disableShowDoc, setDisableShowDoc] = useState(true);

	const [clickedRescheduleBtn, setClickedRescheduleBtn] = useState("outlined");
	const [clickedCancelAppointmentBtn, setClickedCancelAppointmentBtn] = useState("outlined");
	const [clickedCopyBtn, setClickedCopyBtn] = useState("outlined");
	const [clickedDocChangeBtn, setClickedDocChangeBtn] = useState("outlined");
	const [clickedNotesChangeBtn, setClickedNotesChangeBtn] = useState("outlined");

	const [copied, setCopied] = useState(false);

	const [issuperAdmin, setIsSuperAdmin] = useState(props?.disableSuperAdmin);

	const setNavItemToPatients = (id) => {
		localStorage.setItem("nav", "patients");
		history.push(`/patient/detail/${id}`);
	};

	useEffect(() => {
		setWaitingTime("");
		setEngagedTime("");
		setTotalStayTime("");

		let tmpdate = Helper.getJSDateObject(props.appointmentStart);
		tmpdate.setMinutes(tmpdate.getMinutes() + Helper.getOffset(moment().format(), props.tmz));

		setAppointmentStart(tmpdate);
		setDisplayAppointmentStart(tmpdate);
		setTime(moment(tmpdate).format("h:mm a"));
		setDisplayTime(moment(tmpdate).format("h:mm a"));
		setAppointmentNotes(props.resource?.appointmentNotes || "N/A");

		setIsSuperAdmin(props?.disableSuperAdmin);

		setDoctors(props.docList);
		setClickedRescheduleBtn("outlined");
		setClickedCancelAppointmentBtn("outlined");
		setCopied(false);
	}, [props]);

	useEffect(() => {
		//dif in Mins: ", dif.hours() * 60 + dif.minutes()

		// logic to set waiting time
		// checkinTime & NO engagement start time - now() - checkin
		// checkinTime & engagementStarttime present - engagementstarttime - checkin

		if (props.resource.checkinTime !== null && props.resource.engageStartTime === null) {
			let localtime = Helper.getDateTimeFromUTC(props.resource.checkinTime);

			let dif = moment.duration(moment().diff(moment(localtime)));

			setWaitingTime(
				[dif.hours().toString().padStart(2, "0"), dif.minutes().toString().padStart(2, "0"), dif.seconds().toString().padStart(2, "0")].join(":"),
			);
		} else if (props.resource.checkinTime !== null && props.resource.engageStartTime !== null) {
			let dif = moment.duration(moment(props.resource.engageStartTime).diff(moment(props.resource.checkinTime)));

			setWaitingTime(
				[dif.hours().toString().padStart(2, "0"), dif.minutes().toString().padStart(2, "0"), dif.seconds().toString().padStart(2, "0")].join(":"),
			);
		}

		// logic to set engaged time
		// checkinTime & NO checkout time - now() - checkin
		// engagementStarttime & checkouttime present - checkouttime - engagementstarttime
		if (props.resource.engageStartTime !== null && props.resource.checkoutTime === null) {
			let localtime = Helper.getDateTimeFromUTC(props.resource.engageStartTime);

			let dif = moment.duration(moment().diff(moment(localtime)));

			setEngagedTime(
				[dif.hours().toString().padStart(2, "0"), dif.minutes().toString().padStart(2, "0"), dif.seconds().toString().padStart(2, "0")].join(":"),
			);
		} else if (props.resource.engageStartTime !== null && props.resource.checkoutTime !== null) {
			let dif = moment.duration(moment(props.resource.checkoutTime).diff(moment(props.resource.engageStartTime)));

			setEngagedTime(
				[dif.hours().toString().padStart(2, "0"), dif.minutes().toString().padStart(2, "0"), dif.seconds().toString().padStart(2, "0")].join(":"),
			);
		}

		// calculte TotalStaytime - checkout - checkin time
		if (props.resource.checkoutTime !== null) {
			let dif = moment.duration(moment(props.resource.checkoutTime).diff(moment(props.resource.checkinTime)));

			setTotalStayTime(
				[dif.hours().toString().padStart(2, "0"), dif.minutes().toString().padStart(2, "0"), dif.seconds().toString().padStart(2, "0")].join(":"),
			);
		}

		getCancellationTypes();
	}, [props]);

	// pulls list of cancellation types
	const getCancellationTypes = () => {
		const cancellationTypeData = MasterData.getLookupDataFromType(MasterData.lookupTypes.CancellationTypes);

		setCancellationType(cancellationTypeData);

		setCancellationReasonCode(cancellationTypeData[2].lookupKey);
	};

	// reschudele appointment
	const reschedule = (obj) => {
		let objs = moment(appointmentStart).format("YYYY-MM-DD") + " " + time;

		obj.appointmentStarttime = moment(objs, "YYYY-MM-DD h:mm a").toDate();

		AppointmentService.updateAppointment(obj).then((res) => {
			setDisplayAppointmentStart(appointmentStart);
			setDisplayTime(time);
			setShowTime(false);
			setModal(false);
			setCancel(false);

			props.handleSuccess("Appointment Rescheduled Successfully");
		});
	};

	// Save Notes
	const saveNotes = (obj) => {
		obj.appointmentNotes = appointmentNotes;

		AppointmentService.updateAppointment(obj).then((res) => {
			setShowTime(false);
			setModal(false);
			setCancel(false);
			setShowNotes(false);
			props.handleSuccess("Notes Updated Successfully");
		});
	};

	// cancel appointment
	const cancelAppointment = (obj) => {
		obj.appointmentStatus = "CAN";
		obj.cancellationReasonCode = cancellationReasonCode;

		AppointmentService.updateAppointment(obj).then((res) => {
			setShowTime(false);
			setModal(false);
			setCancel(false);

			props.handleSuccess("Appointment Cancelled Successfully");
		});
	};

	// changeDoctor appointment
	const changeDoctor = (obj) => {
		obj.userId = selectedDoc.id;

		AppointmentService.updateAppointment(obj).then((res) => {
			setShowTime(false);
			setModal(false);
			setCancel(false);
			setShowDocChange(false);
			setClickedDocChangeBtn("outlined");
			props.handleSuccess("Doctor Changed Successfully");
		});
	};

	// update appropriate (checkinTime, checkOutTime, engageStartTime) in resources object
	// obj - resource, params is : checkinTime, checkOutTime, engageStartTime
	const handleAppointmentVisit = (obj, params) => {
		obj[params] = moment();

		AppointmentService.updateAppointment(obj).then((res) => {
			// do nothing...
			setModal(false);
			props.handleSuccess("Appointment Status Changed Successfully");
		});
	};

	const cancellationTypeChangeHandle = (name, value) => {
		setCancellationReasonCode(value);
		if (value === null) {
			setDisableCancel(true);
		} else {
			setDisableCancel(false);
		}
	};

	const handleCopyAppointment = () => {
		setCopied(true);

		let formObject = {
			companyId: AuthService.getUserInfo().companyDTO.id,
			patientId: props.resource?.patient?.id,
			userId: props.resource?.user,
			appointmentNotes: props.resource?.appointmentNotes || "N/A",
			appointmentStarttime: moment(appointmentStart, "YYYY-MM-DD h:mm a").toDate(),
			appointmentDuration: AuthService.getUserInfo().companyDTO.calendarTimeslot,
			appointmentDurationType: "M", // M - Minutes
			appointmentTitle: props.resource?.patient?.patientName,
			appointmentStatus: "CON", // CON - Confirmed, CAN - Cancel
			appointmentType: "A", // A-Appointment, E-Event
			loginId: AuthService.getUserInfo().userRoles[0].userId,
			patient: {
				id: props.resource?.patient?.id,
				patientName: props.resource?.patient?.patientName,
				companyId: AuthService.getUserInfo().companyDTO.id,
				email: props.resource?.patient?.email,
				mobileNo: props.resource?.patient?.mobileNo,
				loginId: AuthService.getUserInfo().userRoles[0].userId,
			},
		};

		localStorage.setItem("copyappointment", JSON.stringify(formObject));
	};

	const handleDeleteAppointment = (obj) => {
		obj.appointmentStatus = "DEL";
		AppointmentService.deleteAppointment(obj).then((res) => {
			setShowTime(false);
			setModal(false);
			setCancel(false);

			props.handleSuccess("Appointment Deleted Successfully");
		});
	};

	const handleClose = (event) => {
		setShowReschedule(false);

		setShowDocChange(false);
		setCancel(false);
		setClickedRescheduleBtn("outlined");
		setClickedCancelAppointmentBtn("outlined");
		setAppointmentStart(displayAppointmentStart);
		setTime(displayTime);
		setCopied(false);
		setShowNotes(false);
		props.handleClose();
	};

	const handleDocChange = (event) => {
		setSelectedDoc(event.target.value);
		setDisableShowDoc(false);
	};

	const handleAppointmentNotesChange = (event) => {
		setAppointmentNotes(event.target.value);
	};

	return (
		<Modal show={props.modal} modalClosed={handleClose}>
			<div>
				<div style={{ margin: "1px" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							paddingBottom: "5px",
						}}>
						<div>
							<span style={{ fontSize: "18px" }}>
								{" "}
								Appointment &nbsp;
								<span style={{ alignSelf: "center" }}>
									{props.resource?.appointmentStatus === "CON" ? (
										<span
											style={{
												fontSize: "12px",
												color: "rgb(4, 134, 21)",
												backgroundColor: "rgb(233, 247, 237)",
												padding: "5px",
											}}>
											Confirmed
										</span>
									) : (
										<span
											style={{
												fontSize: "12px",
												color: "#DC143C",
												backgroundColor: "#f7e9e9",
												padding: "5px",
											}}>
											Cancelled
										</span>
									)}
								</span>
							</span>
						</div>
						<div onClick={handleClose} style={{ cursor: "pointer" }}>
							<img src={close} height='20px' alt='close' />
						</div>
					</div>
					<div
						style={{
							display: "grid",

							gridGap: "0px",
							gridTemplateColumns: "1fr 1fr 1fr ",
							paddingBottom: "0px",
						}}>
						<div
							onMouseEnter={() => {
								setHover(true);
							}}
							onMouseLeave={() => {
								setHover(false);
							}}
							style={{
								...style.normal,
								...(hover ? style.hover : null),
							}}
							onClick={() => setNavItemToPatients(props.resource?.patient?.id)}>
							<div>
								<span
									style={{
										fontSize: "12px",
										color: "#797979",
										textDecoration: "none",
									}}>
									Patient Name (#{props.resource?.patient?.id})
								</span>
							</div>
							<div>
								<div style={{ padding: "2px", textDecoration: "none" }}>{props.resource?.patient?.patientName}</div>
								<div style={{ fontSize: "14px", color: "#797979" }}>
									<WcOutlinedIcon style={{ fontSize: 16 }} />
									<span
										style={{
											fontSize: "16px",
											color: "#333333",
											textDecoration: "none",
										}}>
										{props.resource?.patient?.gender === "F" ? "Female" : "Male" || "N/A"}
									</span>
								</div>
							</div>
						</div>
						<div
							className={classes.marginRight}
							onMouseEnter={() => {
								setHover(true);
							}}
							onMouseLeave={() => {
								setHover(false);
							}}
							style={{
								...style.normal,
								...(hover ? style.hover : null),
							}}
							onClick={() => setNavItemToPatients(props.resource?.patient?.id)}>
							<div>
								<span style={{ fontSize: "12px", color: "#797979" }}>Patient Contact</span>
							</div>
							<div>
								<PhoneAndroidOutlinedIcon style={{ fontSize: 14 }} />
								&nbsp;
								<span
									style={{
										fontSize: "16px",
										color: "#333333",
										padding: "2px",
									}}>
									{props.resource?.patient?.mobileNo || "N/A"}
								</span>
							</div>
							<div>
								<EmailOutlinedIcon style={{ fontSize: 14 }} />
								&nbsp;
								<span
									style={{
										fontSize: "16px",
										color: "#333333",
										padding: "2px",
									}}>
									{props.resource?.patient?.email || "N/A"}
								</span>
							</div>
						</div>

						<div>
							<div>
								<span style={{ fontSize: "12px", color: "#797979" }}>Doctor Name </span>
							</div>
							<div>
								<span style={{ fontSize: "16px", color: "#333333", padding: "2px" }}>{props.resource?.user?.firstName}</span>
							</div>

							{waitingTime === "" ? (
								<div>
									<span style={{ fontSize: "13px", color: "blue", cursor: "pointer" }}>
										<Button
											variant={clickedDocChangeBtn}
											color='primary'
											size='small'
											style={{ fontSize: 10 }}
											type='submit'
											disabled={issuperAdmin ? true : false}
											onClick={() => {
												setShowDocChange(true);
												setShowReschedule(false);
												setCancel(false);
												setClickedDocChangeBtn("contained");
											}}
											endIcon={<EditTwoToneIcon />}>
											Change
										</Button>
									</span>
								</div>
							) : (
								""
							)}
						</div>
					</div>

					<div style={{ gridColumn: "1/-1", padding: "8px 0px" }}>
						<div>
							<div style={{ fontSize: "12px", color: "#797979" }}>
								<span>
									<Button
										variant={clickedNotesChangeBtn}
										color='primary'
										size='small'
										style={{ fontSize: 10 }}
										type='submit'
										disabled={issuperAdmin ? true : false}
										onClick={() => {
											setShowNotes(true);
											setShowDocChange(false);
											setShowReschedule(false);
											setCancel(false);
											setClickedNotesChangeBtn("contained");
										}}
										endIcon={<EditTwoToneIcon />}>
										Notes
									</Button>
								</span>
							</div>
							<div
								style={{
									fontSize: "14px",
									fontStyle: "italic",
									color: "#333333",
								}}>
								{props.resource?.appointmentNotes || "N/A"}
							</div>
						</div>
					</div>

					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							padding: "10px",
							backgroundColor: "#f2f2f2",
							borderTop: "0px solid #797979",
							borderBottom: "0px solid #797979",
							alignItems: "center",
						}}>
						<span style={{ fontSize: "16px", color: "#797979" }}>
							<span
								style={{
									fontSize: "16px",
									color: "darkblue",
									fontWeight: "bold",
								}}>
								{" "}
								{displayTime}{" "}
							</span>
							on{" "}
							<span
								style={{
									fontSize: "16px",
									color: "darkblue",
									fontWeight: "bold",
								}}>
								{moment(displayAppointmentStart).format("DD MMM")}
							</span>{" "}
							for {props.resource?.appointmentDuration}&nbsp;(Mins)
						</span>

						{waitingTime === "" ? (
							<>
								<span>
									{props.resource?.appointmentStatus === "CON" ? (
										<span style={{ textAlign: "center" }}>
											<Button
												variant={clickedRescheduleBtn}
												color='primary'
												size='small'
												style={{ fontSize: 11 }}
												type='submit'
												disabled={issuperAdmin ? true : false}
												onClick={() => {
													setShowReschedule(true);
													setCancel(false);
													setShowDocChange(false);
													setClickedRescheduleBtn("contained");
													setClickedCancelAppointmentBtn("outlined");
												}}
												endIcon={<ScheduleIcon />}>
												Reschedule
											</Button>
										</span>
									) : null}
								</span>
								<span>
									{props.resource?.appointmentStatus === "CON" ? (
										<span>
											<Button
												variant={clickedCancelAppointmentBtn}
												color='secondary'
												size='small'
												style={{ fontSize: 11 }}
												type='submit'
												disabled={issuperAdmin ? true : false}
												onClick={() => {
													setShowReschedule(false);
													setCancel(true);
													setShowDocChange(false);
													setAppointmentStart(displayAppointmentStart);
													setTime(displayTime);
													setClickedCancelAppointmentBtn("contained");
													setClickedRescheduleBtn("outlined");
												}}
												endIcon={<CancelScheduleSendIcon />}>
												Cancel Appointment
											</Button>
										</span>
									) : null}
								</span>
							</>
						) : null}
					</div>

					{showDocChange ? (
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								textAlign: "right",
								backgroundColor: "#f5faff",
							}}>
							<div style={{ paddingLeft: "10px" }}>
								<Select value={selectedDoc} margin='dense' onChange={handleDocChange} displayEmpty className={classes.selectEmpty}>
									<MenuItem value='0'>
										<em>Choose a Doctor</em>
									</MenuItem>
									{doctors.map((doc, i) => (
										<MenuItem key={i} value={doc}>
											{doc.firstName}
										</MenuItem>
									))}
								</Select>
							</div>
							<div
								style={{
									padding: "10px",
									display: "flex",
									alignItems: "center",
									justifyContent: "flex-end",
								}}>
								<Button
									variant='outlined'
									color='primary'
									size='small'
									style={{ fontSize: 11 }}
									type='submit'
									onClick={() => {
										setShowReschedule(false);
										setCancel(false);
										setShowDocChange(false);
										setSelectedDoc(0);
									}}>
									Cancel
								</Button>
								&nbsp;
								<Button
									variant='contained'
									disabled={disableShowDoc ? true : false}
									color='secondary'
									size='small'
									style={{ fontSize: 11 }}
									onClick={() => changeDoctor(props.resource)}>
									Change
								</Button>
							</div>
						</div>
					) : null}

					{cancel ? (
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								textAlign: "right",
								backgroundColor: "#f5faff",
							}}>
							<div style={{ paddingLeft: "10px" }}>
								{cancellationType ? (
									<AutoCompleteSelect
										data={cancellationType}
										label='Cancellation Type'
										name='cancellationtype'
										keyValue='lookupKey'
										keyLabel='lookupValue'
										margin='dense'
										initialValue={cancellationReasonCode}
										callbackFunction={cancellationTypeChangeHandle}></AutoCompleteSelect>
								) : (
									""
								)}
							</div>
							<div
								style={{
									padding: "10px",
									display: "flex",
									alignItems: "center",
									justifyContent: "flex-end",
								}}>
								<Button
									variant='outlined'
									color='primary'
									size='small'
									style={{ fontSize: 11 }}
									type='submit'
									onClick={() => {
										setCancel(false);
										setClickedCancelAppointmentBtn("outlined");
									}}>
									Cancel
								</Button>
								&nbsp;
								<Button
									variant='contained'
									disabled={disableCancel ? true : false}
									color='secondary'
									size='small'
									style={{ fontSize: 11 }}
									onClick={() => {
										cancelAppointment(props.resource);
										setCancel(false);
									}}>
									Yes, delete it.
								</Button>
							</div>
						</div>
					) : null}

					{showReschedule ? (
						<div
							style={{
								display: "grid",

								gridGap: "8px",
								gridTemplateColumns: "1fr 1fr",
								borderBottom: "0px solid #797979",
								textAlign: "right",
								backgroundColor: "#f5faff",
							}}>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									paddingLeft: "16px",
								}}>
								<div>
									<MuiPickersUtilsProvider utils={DateFnsUtils}>
										<KeyboardDatePicker
											name='appointmentStarttime'
											type='string'
											disableToolbar
											autoOk={true}
											variant='inline'
											format='dd/MMM/yyyy'
											margin='dense'
											id='date-picker-inline'
											label='Scheduled'
											value={appointmentStart || ""}
											onChange={(value, e) => setAppointmentStart(moment(value).format("YYYY-MM-DD"))}
											InputLabelProps={{
												shrink: true,
											}}
											required
										/>
									</MuiPickersUtilsProvider>
								</div>
								<div style={{ alignSelf: "center", paddingLeft: "10px" }}>
									<div style={{ alignSelf: "center", justifySelf: "center" }}>
										<div style={{ position: "absolute", zIndex: "99999" }}>
											{showTime && (
												<TimeKeeper
													time={time}
													onChange={(newTime) => {
														setTime(newTime.formatted12);
													}}
													onDoneClick={() => setShowTime(false)}
													switchToMinuteOnHourSelect={true}
													closeOnMinuteSelect={true}
												/>
											)}

											<div>
												{!showTime && waitingTime === "" ? (
													<span
														onClick={() => setShowTime(true)}
														style={{
															fontSize: "16px",
															color: "#DC143C",
															backgroundColor: "#f7e9e9",
															padding: "5px",
														}}>
														{time}
													</span>
												) : (
													""
												)}
											</div>
										</div>
									</div>
								</div>
							</div>
							<div style={{ alignSelf: "center", paddingRight: "16px" }}>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr",
										paddingLeft: "16px",
									}}>
									<div></div>
									<div>
										<span>
											{props.resource?.appointmentStatus === "CON" ? (
												<span style={{ textAlign: "center" }}>
													<Button
														variant='outlined'
														color='primary'
														size='small'
														style={{ fontSize: 11 }}
														type='button'
														onClick={() => {
															setShowReschedule(false);
															setAppointmentStart(displayAppointmentStart);
															setTime(displayTime);
															setClickedRescheduleBtn("outlined");
														}}>
														Cancel
													</Button>
													&nbsp;&nbsp;
													<Button
														variant='contained'
														color='primary'
														size='small'
														style={{ fontSize: 11 }}
														type='button'
														onClick={() => {
															reschedule(props.resource);
															setClickedRescheduleBtn("outlined");
															setShowReschedule(false);
														}}
														endIcon={<ScheduleIcon />}>
														Confirm
													</Button>
												</span>
											) : null}
										</span>
									</div>
								</div>
							</div>
						</div>
					) : (
						""
					)}

					{showNotes && !issuperAdmin ? (
						<div
							style={{
								display: "grid",

								gridGap: "8px",
								gridTemplateColumns: "1fr 1fr",
								borderBottom: "0px solid #797979",
								textAlign: "right",
								backgroundColor: "#f5faff",
							}}>
							<div
								style={{
									display: "grid",
									gridTemplateColumns: "1fr 1fr",
									paddingLeft: "16px",
								}}>
								<div>
									<div style={{ gridColumn: "1/-1", textAlign: "left", width: "400px" }}>
										<InputLabel>Notes (Optional)</InputLabel>
										<TextField
											multiline
											fullWidth
											margin='dense'
											rows='1'
											defaultValue=''
											value={appointmentNotes}
											onChange={handleAppointmentNotesChange}
										/>
									</div>
								</div>
							</div>
							<div style={{ alignSelf: "center", paddingRight: "16px" }}>
								<div
									style={{
										display: "grid",
										gridTemplateColumns: "1fr",
										paddingLeft: "16px",
									}}>
									<div></div>
									<div>
										<span>
											{props.resource?.appointmentStatus === "CON" ? (
												<span style={{ textAlign: "center" }}>
													<Button
														variant='outlined'
														color='primary'
														size='small'
														style={{ fontSize: 11 }}
														type='button'
														onClick={() => {
															setShowNotes(false);
															setClickedNotesChangeBtn("outlined");
														}}>
														Cancel
													</Button>
													&nbsp;&nbsp;
													<Button
														variant='contained'
														color='primary'
														size='small'
														style={{ fontSize: 11 }}
														type='button'
														onClick={() => {
															saveNotes(props.resource);
															setClickedNotesChangeBtn("outlined");
															setShowNotes(false);
														}}
														endIcon={<NotesTwoToneIcon />}>
														Save Notes
													</Button>
												</span>
											) : null}
										</span>
									</div>
								</div>
							</div>
						</div>
					) : (
						""
					)}

					{moment().isSame(moment(props.resource?.appointmentStarttime), "day") && !issuperAdmin ? (
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "1fr 1fr 1fr",
								padding: "10px 0px",
								alignItems: "center",
							}}>
							{props.resource?.appointmentStatus === "CON" && props.resource?.checkinTime === null ? (
								<div>
									<Button
										variant='contained'
										color='primary'
										size='small'
										style={{ fontSize: 11 }}
										onClick={() => handleAppointmentVisit(props.resource, "checkinTime")}>
										Check In
									</Button>
								</div>
							) : (
								<>
									{props.resource?.appointmentStatus === "CON" && props.resource?.engageStartTime === null ? (
										<>
											<div>
												<div style={headerLbl}>Wait (hh:mm:ss)</div>
												<div>{waitingTime}</div>
											</div>
											<div>
												<div>
													<Button
														variant='contained'
														color='primary'
														size='small'
														style={{ fontSize: 11 }}
														onClick={() => handleAppointmentVisit(props.resource, "engageStartTime")}>
														Meet Doctor
													</Button>
												</div>
											</div>
										</>
									) : (
										<>
											{props.resource?.appointmentStatus === "CON" && props.resource?.checkoutTime === null ? (
												<>
													<div>
														<div style={headerLbl}>Wait (hh:mm:ss)</div>
														<div>{waitingTime}</div>
													</div>
													<div>
														<div style={headerLbl}>Engage For</div>
														<div>{engagedTime}</div>
													</div>
													<div>
														<div>
															<Button
																variant='contained'
																color='primary'
																size='small'
																style={{ fontSize: 11 }}
																onClick={() => handleAppointmentVisit(props.resource, "checkoutTime")}>
																Checkout
															</Button>
														</div>
													</div>
												</>
											) : (
												<>
													{props.resource?.appointmentStatus === "CON" ? (
														<>
															<div>
																<div style={headerLbl}>Wait (hh:mm:ss)</div>
																<div>{waitingTime}</div>
															</div>
															<div>
																<div style={headerLbl}>Engage For</div>
																<div>{engagedTime}</div>
															</div>
															<div>
																<div style={headerLbl}>Total Stay</div>
																<div>{totalStayTime}</div>
															</div>
														</>
													) : null}
												</>
											)}
										</>
									)}
								</>
							)}
						</div>
					) : null}

					{copied && !issuperAdmin ? (
						<div style={{ textAlign: "right", fontSize: "10px", color: "#e64f13", paddingTop: "8px" }}>Click slot to paste</div>
					) : (
						<>
							<div style={{ textAlign: "right", paddingTop: "8px", border: "0px solid" }}>
								{props.resource?.appointmentStatus === "CAN" || props.resource?.checkinTime === null ? (
									<span onClick={() => handleDeleteAppointment(props.resource)}>
										<Button
											variant='outlined'
											color='primary'
											size='small'
											style={{ fontSize: 10 }}
											type='button'
											disabled={issuperAdmin ? true : false}
											onClick={() => {
												setShowReschedule(false);
												setCancel(false);
												setShowDocChange(false);
											}}
											endIcon={<DeleteIcon />}>
											Delete
										</Button>{" "}
										&nbsp;&nbsp;
									</span>
								) : (
									""
								)}
								<span onClick={() => handleCopyAppointment()}>
									<Button
										variant={clickedCopyBtn}
										color='primary'
										size='small'
										style={{ fontSize: 10 }}
										type='button'
										disabled={issuperAdmin ? true : false}
										onClick={() => {
											setShowReschedule(false);
											setCancel(false);
											setShowDocChange(false);
										}}
										endIcon={<FileCopyIcon />}>
										Copy
									</Button>
								</span>
							</div>
						</>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default AppointmentView;

const headerLbl = { fontSize: "12px", color: "#797979" };
const useStyles = makeStyles(() => ({
	ancrLink: {
		textDecoration: "none",
	},
	marginRight: {
		marginRight: "10px",
	},
}));
