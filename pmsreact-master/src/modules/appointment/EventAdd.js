import React, { useState, useEffect } from "react";

import moment from "moment";
import "moment-timezone";

import TextField from "@material-ui/core/TextField";

import AuthService from "../../service/AuthService";
import Button from "@material-ui/core/Button";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AppointmentService from "../../service/AppointmentService";
import TimeKeeper from "react-timekeeper";

//component to create events

const EventAdd = (props) => {
	let errorsObj = {};
	const [appointmentNotes, setAppointmentNotes] = useState();
	const [appointmentStart, setAppointmentStart] = useState();

	const [showStartTimeComponent, setShowStartTimeComponent] = useState(false);
	const [showEndTimeComponent, setShowEndTimeComponent] = useState(false);

	const [sttime, setStTime] = useState("00:00 am");
	const [edtime, setEdTime] = useState("11:59 pm");

	const [errors, setErrors] = useState("");

	const handleAppointmentNotesChange = (event) => {
		setAppointmentNotes(event.target.value);
	};

	useEffect(() => {
		setAppointmentStart(props.appointmentStart);
	}, [props.appointmentStart]);

	// todo: patoemtId, userId hardcoding has to be removed
	const setAddEvent = (e) => {
		setErrors({});

		if (appointmentNotes === "" || appointmentNotes === undefined) {
			errorsObj.notes = "Notes Required.";
			setErrors(errorsObj);
			return false;
		}

		let objsEventStart = appointmentStart + " " + sttime;
		let objsEventEnd = appointmentStart + " " + edtime;

		let diffDuration = moment.duration(moment(objsEventEnd).diff(moment(objsEventStart), "minutes"));
		console.log("test >> " + diffDuration);

		let formObject = {
			companyId: AuthService.getUserInfo().companyDTO.id,
			patientId: null,
			userId: null,
			appointmentNotes: appointmentNotes,

			appointmentStarttime: moment(objsEventStart, "YYYY-MM-DD h:mm a").toDate(),
			appointmentEndtime: moment(objsEventEnd, "YYYY-MM-DD h:mm a").toDate(),

			appointmentDuration: +diffDuration,
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
				setStTime("00:00 am");
				setEdTime("11:59 pm");
				setAppointmentNotes("");

				props.handleClose();
			}
		});
	};

	return (
		<div style={{ display: "grid" }}>
			<div style={{ margin: "10px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridGap: "20px" }}>
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
				<div style={{ display: "flex" }}>
					<div style={{ display: "grid", alignSelf: "center" }}>
						<span style={{ position: "absolute", zIndex: "99999" }}>
							{showStartTimeComponent && (
								<TimeKeeper
									time={sttime}
									onChange={(newTime) => setStTime(newTime.formatted12)}
									onDoneClick={() => setShowStartTimeComponent(false)}
									switchToMinuteOnHourSelect={true}
									closeOnMinuteSelect={true}
								/>
							)}

							<span>
								{!showStartTimeComponent && (
									<span
										onClick={() => {
											console.log("object tine " + sttime);
											setShowStartTimeComponent(true);
										}}
										style={{
											fontSize: "14px",
											color: "#DC143C",
											backgroundColor: "#f7e9e9",
											padding: "10px",
										}}>
										Start Time: {sttime}
									</span>
								)}
							</span>
						</span>
					</div>
				</div>
				<div style={{ display: "flex" }}>
					<div style={{ display: "grid", alignSelf: "center" }}>
						<span style={{ position: "absolute", zIndex: "99999" }}>
							{showEndTimeComponent && (
								<TimeKeeper
									time={edtime}
									onChange={(newTime) => setEdTime(newTime.formatted12)}
									onDoneClick={() => setShowEndTimeComponent(false)}
									switchToMinuteOnHourSelect={true}
									closeOnMinuteSelect={true}
								/>
							)}

							<span>
								{!showEndTimeComponent && (
									<span
										onClick={() => {
											console.log("object tine " + edtime);
											setShowEndTimeComponent(true);
										}}
										style={{
											fontSize: "14px",
											color: "#DC143C",
											backgroundColor: "#f7e9e9",
											padding: "10px",
										}}>
										End Time: {edtime}
									</span>
								)}
							</span>
						</span>
					</div>
				</div>
			</div>

			<div style={{ margin: "10px", display: "grid", gridTemplateColumns: "1fr" }}>
				<TextField
					multiline
					fullWidth
					required
					margin='dense'
					rows='1'
					defaultValue=''
					label='Event Notes'
					value={appointmentNotes}
					onChange={handleAppointmentNotesChange}
				/>
				{errors.notes && <p className='error'>{errors.notes}</p>}
			</div>

			<div style={{ color: "red", padding: "10px" }}>Note: Any exising appointments for this date will be automatically cancelled</div>
			<div style={{ textAlign: "center", gridColumn: "1/-1", paddingTop: "20px" }}>
				<Button variant='contained' color='primary' onClick={setAddEvent}>
					+ Add Event
				</Button>
			</div>
		</div>
	);
};

export default EventAdd;
