import React, { useEffect, useState, Children, useReducer } from "react";
import "./admindash.scss";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment-timezone";

import AppointmentService from "../../../service/AppointmentService";
import UserService from "../../../service/UserService";
import { makeStyles } from "@material-ui/core/styles";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import AuthService from "../../../service/AuthService";

import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import PatientService from "../../../service/PatientService";

import ConfirmDialog from "../../../elements/ui/Dialog/ConfirmDialog";
import SnackBar from "../../../elements/ui/Dialog/SnackBar";
import AppointmentAdd from "../../appointment/AppointmentAdd";
import AppointmentView from "../../appointment/AppointmentView";

import AppointmentHelper from "../../appointment/AppointmentHelper";
import AppointmentCount from "../../appointment/AppointmentCount";

import auth from "../../../service/AuthService";

import NotificationDialog from "../../../elements/ui/Dialog/NotificationDialog";

import Helper from "../../helper/helper";

import Button from "@material-ui/core/Button";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import EventView from "./../../appointment/EventView";

// calendar configs.
// dow - day of week (monday for en locale), we set monday as first day of the week.
moment.locale("en", {
	week: {
		dow: 1,
		doy: 1,
	},
});
const localizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(Calendar);
/** End */

// paint each cell {greyed out color} if it falls under offdays
// fetch off days from authservice
const ColoredDateCellWrapper = ({ children, value }) => {
	let clr = "";
	// DnD Ref - to color off days like sunday.
	if (AuthService.getOffDays().includes(moment(value).format("ddd").toUpperCase())) {
		clr = "#e6e6e6";
	}
	return React.cloneElement(Children.only(children), {
		style: {
			...children.style,
			backgroundColor: clr,
			// DnD Ref
			// backgroundColor: value < CURRENT_DATE ? "" : "lavenderBlush",
			// backgroundColor: moment(value).format("dddd") === "Sunday" ? "lavenderBlush" : "",
		},
	});
};

const AdminDashComponent = () => {
	const [calendarView, setCalendarView] = useState(false);
	const [appointmentAdd, setAppointmentAdd] = useState(false);

	const [appointmentList, setAppointmentList] = useState({ events: [] });

	const [time, setTime] = useState("00:00 am");
	const [showTime, setShowTime] = useState(false);

	const [appointmentStart, setAppointmentStart] = useState();
	const [selectedDate, setSelectedDate] = useState(new Date());

	const [monthStart, setMonthStart] = useState(moment().format("YYYY-MM-01"));
	const [monthEnd, setMonthEnd] = useState(moment().format("YYYY-MM-") + moment().daysInMonth());

	const [modal, setModal] = useState(false);

	const [snack, setSnack] = useState(false);
	const [message, setMessage] = useState(false);

	const [alert, setAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");

	const classes = useStyles();
	const [doctors, setDoctors] = useState([]);

	const [selectedDoc, setSelectedDoc] = useState("0");

	const [editAppSelectedDoc, setEditAppSelectedDoc] = useState("");

	const [resource, setResource] = useState(null);

	// Reducers
	const [summaryState, dispatch] = useReducer(AppointmentHelper.reducer, initSummaryState);
	const { waitingCount, engagedCount, scheduledCount, checkoutCount } = summaryState;

	const [slotState, slotDispatch] = useReducer(AppointmentHelper.reducer, initSlotState);

	const { slot } = slotState;

	const [companyList, setCompanyList] = useState([]);

	const [selectedCompany, setSelectedCompany] = useState({});
	const [selectedCompanyName, setSelectedCompanyName] = useState("");

	const [disableSuperAdmin, setDisableSuperAdmin] = useState(false);
	const [timeZone, setTimeZone] = useState("");

	const [loading, setLoading] = useState(false);
	const [qviewList, setQviewList] = useState({});

	const [companyId, setCompanyId] = useState(AuthService.getUserInfo().companyDTO.id);
	const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
	const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
	const [selectedDoctorId, setSelectedDoctorId] = useState("");

	const [quickDay, setQuickDay] = useState(moment().format("YYYY-MM-DD"));

	const [qviewDisplay, setQviewDisplay] = useState("Today 's Schedule");

	// dialog box
	const [openDialog, setOpenDialog] = useState(false);

	const [eventsDates, setEventsDates] = useState([]);
	const [showEvent, setShowEvent] = useState(false);

	useEffect(() => {
		setCalendarView(false);
		reloadDoctorsList();
		setSelectedCompany(AuthService.getUserInfo().companyDTO.id);
		setCompanyList(AuthService.getUserInfo().companyDTOs);
		setSelectedCompanyName(AuthService.getUserInfo().companyDTO.companyName);
		reloadAppointments(AuthService.getUserInfo().companyDTO.id, monthStart, monthEnd, "", AuthService.getUserInfo().companyDTO.companyTimezoneText);
		setCompanyId(AuthService.getUserInfo().companyDTO.id);

		reloadFetchAppointments();

		fetchAppointmentsCount(AuthService.getUserInfo().companyDTO.id, moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), "");

		// logged in company id && selected company id is same the disable true - companyTimezoneText
		if (auth.isSuperAdmin()) {
			// if (selectedCompany === AuthService.getUserInfo().companyDTO.id) {
			setDisableSuperAdmin(false);
			//}
		}
		// console.log("timezone " + AuthService.getUserInfo().companyDTO.companyTimezoneText);
		setTimeZone(AuthService.getUserInfo().companyDTO.companyTimezoneText);
		// console.log("offset " + Helper.getOffset(moment().format(), AuthService.getUserInfo().companyDTO.companyTimezoneText));
	}, []);

	// Reload Appointments

	const scheduledAppointments = (data) => {
		// filtering cancelled appointments
		let filteredData = data.filter((e) => {
			return e.appointmentStatus !== "CAN";
		});

		setQviewList(filteredData);
		setLoading(true);
	};

	// const waitingAppointments = (data) => {
	// 	setQviewList(data);
	// 	setLoading(true);
	// };

	// const engagedAppointments = (data) => {
	// 	setQviewList(data);
	// 	setLoading(true);
	// };

	// const checkOutAppointments = (data) => {
	// 	setQviewList(data);
	// 	setLoading(true);
	// };

	const reloadFetchAppointments = () => {
		let formObject = {
			companyId: AuthService.getUserInfo().companyDTO.id,
			startDate: moment().format("YYYY-MM-DD"),
			endDate: moment().format("YYYY-MM-DD"),
			userId: "",
			scheduledStatus: "S",
		};

		AppointmentService.fetchQuickAppointments(formObject)
			.then((response) => {
				// filtering cancelled appointments
				let filteredData = response.data.filter((e) => {
					return e.appointmentStatus !== "CAN";
				});
				setQviewList(filteredData);
				setLoading(true);
			})
			.catch((ex) => {
				console.log(ex);
			});
	};

	// Reload Appointments
	const reloadAppointments = (companyid, startDate, endDate, userId, timezoneText) => {
		let events = [];
		let formObject = {
			companyId: companyid,
			startDate: startDate,
			endDate: endDate,
			userId: userId,
		};

		// fetch all appointments
		AppointmentService.fetchAllAppointments(formObject).then((res) => {
			let resArr = res.data;

			if (resArr === "") {
				setAppointmentList(events);
				setCalendarView(true);
			} else {
				// loops appointments, UTC startdatetime is converted to login/Company TMZ, Duration (15 Mins Slots)
				// to enddatetime and populates events.push({})
				resArr.forEach((k, idx) => {
					// create new JS Date() from moment Y:MM:D:H:S - date shifts from UTC to {local TMZ}
					// let appointmentStarttime = new Date(sYear, sMonth - 1, sDays, sHours, sMins);
					let appointmentStarttime = Helper.getJSDateObject(k.appointmentStarttime);

					// shift Date() to desired TMZ
					appointmentStarttime.setMinutes(appointmentStarttime.getMinutes() + Helper.getOffset(moment().format(), timezoneText));

					let tempAppointmentEndtime = moment(k.appointmentStarttime).add(k.appointmentDuration, "minutes");

					// assign new date
					let appointmentEndtime = Helper.getJSDateObject(tempAppointmentEndtime);
					appointmentEndtime.setMinutes(appointmentEndtime.getMinutes() + Helper.getOffset(moment().format(), timezoneText));

					events.push({
						start: appointmentStarttime,
						end: appointmentEndtime,
						title:
							k.patient === null ? k.appointmentTitle : convertLocalTime1(appointmentStarttime) + " " + truncate(k.patient.patientName, 8, "..."),
						resource: k,
					});
				});

				setAppointmentList(events);
				setCalendarView(true);

				// from entire list of appointmnets, filter only dates which have Appointmnet with appointmentType="E"
				// make array collection with formatted date, map iterates the collection and returns formatted date

				// const eventsCollection = events
				// 	.filter((e) => {
				// 		return e.resource.appointmentType === "E";
				// 	})
				// 	.map((m) => {
				// 		return Helper.getDateTimeFromUTC(m.resource.appointmentStarttime, "YYYY-MM-DD");
				// 	});

				const eventsCollection = events.filter((e) => {
					return e.resource.appointmentType === "E";
				});

				setEventsDates(eventsCollection);
			}
		});
	};

	// fetch appointment status summary
	const fetchAppointmentsCount = (companyId, stDate, edDate, docId) => {
		let formObject = {
			companyId: companyId,
			startDate: stDate,
			endDate: edDate,
			userId: docId,
		};

		AppointmentService.fetchAppointmentsCount(formObject).then((res) => {
			dispatch({ field: "waitingCount", value: res.data.waitingCount });
			dispatch({ field: "engagedCount", value: res.data.engagedCount });
			dispatch({ field: "scheduledCount", value: res.data.scheduledCount });
			dispatch({ field: "checkoutCount", value: res.data.checkoutCount });
		});

		setStartDate(stDate);
		setEndDate(edDate);
	};

	const handleChange = (event) => {
		setSelectedDoc(event.target.value);
		reloadAppointments(
			AuthService.getUserInfo().companyDTO.id,
			monthStart,
			monthEnd,
			event.target.value.id,
			AuthService.getUserInfo().companyDTO.companyTimezoneText,
		);
	};

	function reloadDoctorsList() {
		UserService.fetchAllDoctors(AuthService.getUserInfo().companyDTO.id).then((res) => {
			setDoctors(res.data);
		});
	}

	function truncate(string, length, delimiter) {
		delimiter = delimiter || "&hellip;";
		return string.length > length ? string.substr(0, length) + delimiter : string;
	}

	const handleCompanyChange = (event) => {
		setSelectedCompany(event.target.value);

		reloadDoctorsList(event.target.value);
		let obj = companyList.find((o) => o.id === event.target.value);
		setSelectedCompanyName(obj.companyName);
		setTimeZone(obj.companyTimezoneText);

		reloadAppointments(obj.id, moment().format("YYYY-MM-01"), moment().format("YYYY-MM-") + moment().daysInMonth(), "", obj.companyTimezoneText);
		fetchAppointmentsCount(obj.id, moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), "");
		reloadFetchAppointments();

		if (auth.isSuperAdmin()) {
			if (event.target.value !== AuthService.getUserInfo().companyDTO.id) {
				setDisableSuperAdmin(true);
			} else {
				setDisableSuperAdmin(false);
			}
		}
	};

	// Triggers onclick of events. Show appointmnet Information
	const handleSelectEvent = (e) => {
		setAppointmentAdd(false);

		if (e.resource.appointmentType === "E") {
			setModal(true);
			setShowEvent(true);
			setResource(e.resource);
		} else {
			setTime(moment(e.resource.appointmentStarttime).tz(AuthService.getUserInfo().companyDTO.companyTimezoneText).format("h:mm a"));

			PatientService.searchPatient(e.resource.patientId).then((res1) => {
				e.resource.patient = res1.data;

				UserService.fetchUserById(e.resource.userId).then((res2) => {
					setEditAppSelectedDoc(res2.data);
				});
				setShowEvent(false);
				setAppointmentStart(e.resource.appointmentStarttime);
				setModal(true);
				setResource(e.resource);
			});
		}
	};
	// end

	// Drag&Drop to reschedule
	const handleMoveEvent = (e) => {
		console.log("formatting date > " + e.start);
		console.log("formatting date @@@ > " + moment(e.start, "YYYY-MM-DD h:mm a").toDate());

		let newEvent = e.event.resource;

		newEvent.appointmentStarttime = moment(e.start, "YYYY-MM-DD h:mm a").toDate();

		if (moment().isSameOrAfter(newEvent.appointmentStarttime)) {
			setAlert(true);
			setAlertMessage("Rescheduling allowed only for Today / Future dates.");
			return false;
		} else {
			AppointmentService.updateAppointment(newEvent).then((res) => {
				setShowTime(false);
				setModal(false);

				handleSelectSlot1(e);

				handleSuccess("Appointment Rescheduled Successfully");
			});
		}
	};

	// Main Calendar each individual cell clicks
	const handleSelectSlot1 = (e) => {
		setShowEvent(false);
		// make a set from eventsDats, Set eliminates duplicates and has only unique elements in the collection
		var mySet = new Set(eventsDates);
		// check if the clicked cell formatted date is in the eventdates collection.
		var hasB = mySet.has(moment(e.slots[0]).format("YYYY-MM-DD"));

		// ture, that day is a holiday (event) throw alert and return false
		if (hasB) {
			setAlert(true);
			setAlertMessage("Clinic Closed, No appointments allowed today !");
			return false;
		}

		if (disableSuperAdmin) {
			setAlert(true);
			setAlertMessage("Super Admins can create only in their home country!");
			return false;
		}

		if (e.slots !== undefined && e.slots.length > 0) {
			setSelectedDate(moment(e.slots[0], "YYYY-MM-DD").toDate());
			slotDispatch({ field: "slot", value: e });
			setResource(false);

			if (moment(moment().format("YYYY-MM-DD")).isAfter(moment(e.slots[0]))) {
				setAlert(true);
				setAlertMessage("Appointments are allowed only for Future dates/time.");
				return false;
			}

			// Throw Confirm box if clicked day is Weekly Off/Holidays
			if (AuthService.getOffDays().includes(moment(e.start).format("ddd").toUpperCase())) {
				setOpenDialog(true);
			} else {
				setTime(moment(e.slots[0]).format("h:mm a"));

				setAppointmentStart(moment(e.slots[0]).format("YYYY-MM-DD"));

				setModal(true);
				setAppointmentAdd(true);

				showAddAppointment(e);
			}
		}
	};

	const showAddAppointment = (e) => {
		setSelectedDate(moment(e.start, "YYYY-MM-DD").toDate());
		setOpenDialog(false);
	};

	// style the event CANCEL / CONFIRMED {colors}
	const eventStyleGetter = (event, start, end, isSelected) => {
		let bgColor;
		let fontClr;

		if (event.resource.appointmentStatus === "CAN") {
			bgColor = "#5D604F";
			fontClr = "#ffffff";
		} else if (event.resource.appointmentStatus === "CON") {
			bgColor = "#E1FF73";
			fontClr = "#333333";
		}

		if (event.resource.appointmentType === "E") {
			bgColor = "red";
			fontClr = "#ffffff";
		}

		var style = {
			backgroundColor: bgColor,
			borderRadius: "0px",
			opacity: 0.8,
			color: fontClr,
			border: "0px",
			display: "block",
		};
		return {
			style: style,
			className: "foobares",
		};
	};

	// Called when Reschedule/Create/Cancel event
	const handleSuccess = (message) => {
		setShowTime(false);
		setModal(false);
		setSnack(true);
		reloadAppointments(AuthService.getUserInfo().companyDTO.id, monthStart, monthEnd, "", AuthService.getUserInfo().companyDTO.companyTimezoneText);
		fetchAppointmentsCount(AuthService.getUserInfo().companyDTO.id, moment().format("YYYY-MM-DD"), moment().format("YYYY-MM-DD"), "");

		reloadFetchAppointments();

		setMessage(message);
	};

	// Called when clicking [X] in pop up
	const addModalCancelled = (message) => {
		setShowTime(false);
		setModal(false);
		setSnack(false);
		setShowEvent(false);
	};

	const onNavigateHandle = (date) => {
		let mstart = moment(date).format("YYYY-MM-01");
		let mend = moment(date).format("YYYY-MM-") + moment(date).daysInMonth();

		setMonthStart(mstart);
		setMonthEnd(mend);
		setSelectedDate(date);

		reloadAppointments(selectedCompany, mstart, mend, selectedDoc !== "0" ? selectedDoc.id : "", timeZone);
		reloadFetchAppointments();
		fetchAppointmentsCount(selectedCompany, moment(date).format("YYYY-MM-DD"), moment(date).format("YYYY-MM-DD"), "");
	};

	const shiftDay = (direction) => {
		let qDay;
		if (direction === "right") {
			qDay = moment(quickDay).add(1, "days").format("YYYY-MM-DD");
			fetchAppointmentsCount(AuthService.getUserInfo().companyDTO.id, qDay, qDay, "");
			setQuickDay(qDay);
			setQviewDisplay(`${moment(qDay).format("MMM Do")} Schedule`);
		} else if (direction === "left") {
			qDay = moment(quickDay).add(-1, "days").format("YYYY-MM-DD");
			fetchAppointmentsCount(AuthService.getUserInfo().companyDTO.id, qDay, qDay, "");
			setQuickDay(qDay);
			setQviewDisplay(`${moment(qDay).format("MMM Do")} Schedule`);
		} else if (direction === "today") {
			qDay = moment().format("YYYY-MM-DD");
			fetchAppointmentsCount(AuthService.getUserInfo().companyDTO.id, qDay, qDay, "");
			setQuickDay(qDay);
			setQviewDisplay("Today 's Schedule");
		}

		let formObject = {
			companyId: AuthService.getUserInfo().companyDTO.id,
			startDate: qDay,
			endDate: qDay,
			userId: "",
			scheduledStatus: "S",
		};

		AppointmentService.fetchQuickAppointments(formObject)
			.then((response) => {
				setQviewList(response.data);
				setLoading(true);
			})
			.catch((ex) => {
				console.log(ex);
			});
	};

	function openAppointmentView(item) {
		setTime(moment(item.appointmentStarttime).tz(timeZone).format("h:mm a"));

		setResource(item);

		setAppointmentStart(item.appointmentStarttime);
		setAppointmentAdd(false);
		setModal(true);
	}

	function convertLocalTime(item) {
		let tmpdate = Helper.getJSDateObject(item.appointmentStarttime);
		tmpdate.setMinutes(tmpdate.getMinutes() + Helper.getOffset(moment().format(), timeZone));
		return moment(tmpdate).format("h:mm a");
	}

	function convertLocalTime1(item1) {
		console.log("TIME > " + item1);
		//	let tmpdate1 = Helper.getJSDateObject(item1);
		//	tmpdate1.setMinutes(tmpdate1.getMinutes() + Helper.getOffset(moment().format(), timeZone));
		return moment(item1).format("h:mm a");
	}

	return (
		<>
			<>
				{resource !== null && resource && !showEvent ? (
					<AppointmentView
						modal={modal}
						resource={resource}
						appointmentStart={appointmentStart}
						disableSuperAdmin={disableSuperAdmin}
						docList={doctors}
						time={time}
						tmz={timeZone}
						handleClose={addModalCancelled}
						handleSuccess={handleSuccess}></AppointmentView>
				) : (
					""
				)}

				{showEvent ? (
					<EventView modal={modal} resource={resource} handleSuccess={handleSuccess} tmz={timeZone} handleClose={addModalCancelled} />
				) : (
					""
				)}

				{appointmentAdd && !disableSuperAdmin ? (
					<AppointmentAdd
						modal={modal}
						appointmentStart={appointmentStart}
						eventsDates={eventsDates}
						time={time}
						doctors={doctors}
						handleClose={addModalCancelled}
						handleSuccess={handleSuccess}></AppointmentAdd>
				) : (
					""
				)}
			</>

			<div className='ad-admin'>
				<div className='section-1'>
					<div>
						{" "}
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
					</div>
					<div>&nbsp;</div>
					<FormControl className={classes.formControl}>
						<InputLabel>Doctors</InputLabel>
						<Select value={selectedDoc} margin='dense' onChange={handleChange} displayEmpty className={classes.selectEmpty}>
							<MenuItem value='0'>
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

				<div className='section-2'>&nbsp;</div>
				<div className='App'>
					{calendarView && appointmentList ? (
						<DragAndDropCalendar
							selectable
							popup
							localizer={localizer}
							defaultDate={new Date()}
							date={selectedDate}
							min={new Date(2019, 10, 0, 7, 0, 0)}
							max={new Date(2099, 10, 0, 21, 0, 0)}
							defaultView='month'
							views={["week", "month", "day"]}
							onNavigate={onNavigateHandle}
							// onNavigate={(date) => {
							// 	setSelectedDate(date);
							// }}
							resizable
							onEventDrop={handleMoveEvent}
							step={+AuthService.getUserInfo().companyDTO.calendarTimeslot}
							timeslots={1}
							events={appointmentList}
							style={{ height: "100vh" }}
							onSelectEvent={handleSelectEvent}
							onSelectSlot={handleSelectSlot1}
							eventPropGetter={eventStyleGetter}
							messages={{
								previous: "<",
								next: ">",
							}}
							components={{
								dateCellWrapper: ColoredDateCellWrapper, // DnD Ref
							}}
						/>
					) : null}
				</div>

				<div className='daycalendar'>
					<div style={{ display: "grid", gridTemplateColumns: "40px 1fr 60px", padding: "10px 0px 0px 10px" }}>
						<div>
							<span style={{ cursor: "pointer" }} onClick={() => shiftDay("today")}>
								<CalendarTodayIcon color='primary' />
							</span>
						</div>
						<div style={{ textAlign: "center", fontSize: "1rem", fontWeight: 500 }}>{qviewDisplay}</div>
						<div>
							<span style={{ cursor: "pointer" }} onClick={() => shiftDay("left")}>
								<ChevronLeftIcon color='primary' />
							</span>
							&nbsp;
							<span style={{ cursor: "pointer" }} onClick={() => shiftDay("right")}>
								<ChevronRightIcon color='primary' />
							</span>
						</div>
					</div>

					<div>
						<Button
							variant='outlined'
							size='small'
							color='primary'
							fullWidth
							onClick={() => {
								setModal(true);
								setAppointmentAdd(true);
							}}>
							+ add walk in appointment
						</Button>
					</div>
					<AppointmentCount
						scheduledClicked={scheduledAppointments}
						// waitingClicked={waitingAppointments}
						// engagedClicked={engagedAppointments}
						// checkoutClicked={checkOutAppointments}
						companyId={companyId}
						startDate={startDate}
						endDate={endDate}
						selectedDoctorId={selectedDoctorId}
						scheduledCount={scheduledCount}
						waitingCount={waitingCount}
						engagedCount={engagedCount}
						checkoutCount={checkoutCount}></AppointmentCount>

					{loading && qviewList
						? qviewList.map((item, idx) => (
								<React.Fragment key={idx}>
									<div
										onClick={() => openAppointmentView(item)}
										style={{
											display: "grid",
											cursor: "pointer",
											gridTemplateColumns: "80px 1fr",
											margin: "5px",
											borderRadius: "1px",
											padding: "10px",
											borderLeft: "2px solid green",
											color: "#333333",
											backgroundColor: "#f2f2f2",
										}}>
										<div>
											<span style={{ fontSize: "14px", fontWeight: 500 }}>{convertLocalTime(item)}</span>
										</div>
										<div>
											<div>{item.appointmentTitle} </div>
											<div>{item.appointmentNotes} </div>
										</div>
									</div>
								</React.Fragment>
						  ))
						: ""}
				</div>
			</div>

			<NotificationDialog open={alert} handleClose={() => setAlert(false)} title='Warning !!!'>
				{alertMessage}
			</NotificationDialog>

			<ConfirmDialog
				open={openDialog}
				handleClose={() => {
					setOpenDialog(false);
					setModal(false);
				}}
				handleConfirm={() => {
					setModal(true);
					setAppointmentAdd(true);
					showAddAppointment(slot);
				}}
				title='Warning Appointment Creation !'>
				You are about to create appointment on a Holiday / Non Working (day / time). Are you sure?
			</ConfirmDialog>

			<SnackBar open={snack} handleClose={() => setSnack(false)} message={message}></SnackBar>
		</>
	);
};

export default AdminDashComponent;

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
}));

export const initSlotState = {
	slot: "",
};

export const initSummaryState = {
	waitingCount: 0,
	engagedCount: 0,
	scheduledCount: 0,
	checkoutCount: 0,
};
