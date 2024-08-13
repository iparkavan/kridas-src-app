import React, { useState, useEffect } from "react";

import moment from "moment";
import "moment-timezone";

import TextField from "@material-ui/core/TextField";

import AuthService from "../../service/AuthService";
import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AppointmentService from "../../service/AppointmentService";
import Helper from "../helper/helper";
import Modal from "../../elements/ui/Modal/Modal";
import close from "../../assets/images/close.svg";

//component to create events

const EventView = (props) => {
	const [appointmentNotes, setAppointmentNotes] = useState();
	const [appointmentStart, setAppointmentStart] = useState();

	const handleAppointmentNotesChange = (event) => {
		setAppointmentNotes(event.target.value);
	};

	useEffect(() => {
		// first get the local timezone equivalent and then add the destination tz offset
		let tmpdate = Helper.getJSDateObject(props.resource.appointmentStart);
		tmpdate.setMinutes(tmpdate.getMinutes() + Helper.getOffset(moment().format(), props.tmz));

		setAppointmentStart(tmpdate);
	}, []);

	// todo: patoemtId, userId hardcoding has to be removed
	const setAddEvent = (e) => {
		let formObject = {
			companyId: AuthService.getUserInfo().companyDTO.id,
			patientId: null,
			userId: null,
			appointmentNotes: appointmentNotes,
			appointmentStarttime: moment(appointmentStart, "YYYY-MM-DD").toDate(),
			appointmentDuration: AuthService.getUserInfo().companyDTO.calendarTimeslot,
			appointmentDurationType: "M", // M - Minutes
			appointmentTitle: "Appointments Blocked",
			appointmentStatus: "CON", // Need a new status for Events
			appointmentType: "E", // A-Appointment, E-Event
			loginId: AuthService.getUserInfo().userRoles[0].userId,
			patient: null,
		};

		AppointmentService.addAppointments(formObject).then((res) => {
			if (res.data.success) {
				props.handleSuccess("Event created successfully");
				props.handleClose();
			}
		});
	};

	const handleDeleteEvent = (obj) => {
		obj.appointmentStatus = "DEL";
		AppointmentService.deleteAppointment(obj).then((res) => {
			props.handleSuccess("Event Deleted Successfully");
		});
	};

	const handleClose = (event) => {
		props.handleClose();
	};

	return (
		<Modal show={props.modal} modalClosed={handleClose}>
			<div style={{ display: "grid" }}>
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						paddingBottom: "5px",
					}}>
					<div>
						<span style={{ fontSize: "18px" }}> Event &nbsp;</span>
					</div>
					<div onClick={handleClose} style={{ cursor: "pointer" }}>
						<img src={close} height='20px' alt='close' />
					</div>
				</div>
				<div style={{ margin: "10px", display: "grid", gridTemplateColumns: "1fr 3fr", gridGap: "20px" }}>
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
								disablePast
								value={appointmentStart}
								onChange={() => {}}
								inputProps={{ datafieldtype: "appointmentStarttime" }}
								InputLabelProps={{
									shrink: true,
								}}
								required
							/>
						</MuiPickersUtilsProvider>
					</div>

					<div style={{ alignSelf: "center" }}>{props.resource.appointmentNotes}</div>
				</div>
				<div style={{ color: "red", padding: "10px" }}>Note: Delete event to start booking appointments for this date.</div>
				<div style={{ textAlign: "center", gridColumn: "1/-1", paddingTop: "20px" }}>
					<Button variant='contained' color='secondary' onClick={() => handleDeleteEvent(props.resource)}>
						Delete Event
					</Button>
				</div>
			</div>
		</Modal>
	);
};

export default EventView;
