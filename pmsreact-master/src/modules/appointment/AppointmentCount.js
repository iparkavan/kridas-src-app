import React, { useState, useReducer } from "react";
import AppointmentHelper from "../appointment/AppointmentHelper";

import AppointmentService from "../../service/AppointmentService";

const AppointmentCount = (props) => {
	const [qview, qviewDispatch] = useReducer(AppointmentHelper.reducer, initQviewState);

	const quickViewAppointments = (key, value) => {
		//reset all bg colors to #ffffff
		qviewDispatch({ field: "scheduleBgColor", value: "#ffffff" });
		qviewDispatch({ field: "waitingBgColor", value: "#ffffff" });
		qviewDispatch({ field: "engagedBgColor", value: "#ffffff" });
		qviewDispatch({ field: "checkoutBgColor", value: "#ffffff" });

		// set antiquewhite to clicked button
		if (key === "scheduledStatus") {
			qviewDispatch({ field: "scheduleBgColor", value: "antiquewhite" });
		} else if (key === "checkedinStatus") {
			qviewDispatch({ field: "waitingBgColor", value: "antiquewhite" });
		} else if (key === "engagedStatus") {
			qviewDispatch({ field: "engagedBgColor", value: "antiquewhite" });
		} else if (key === "checkedoutStatus") {
			qviewDispatch({ field: "checkoutBgColor", value: "antiquewhite" });
		}

		let formObject = {
			companyId: props.companyId,
			startDate: props.startDate,
			endDate: props.endDate,
			userId: props.selectedDoctorId,
		};

		// add a key to formObject with selected button
		formObject[key] = value;

		AppointmentService.fetchQuickAppointments(formObject)
			.then((response) => {
				props.scheduledClicked(response.data);
			})
			.catch((ex) => {
				console.log(ex);
			});
	};

	return (
		<>
			<div
				style={{
					display: "grid",
					justifyItems: "center",
					height: "100px",
					padding: "5px",
					borderRadius: "10px",
					gridTemplateColumns: "1fr 1fr 1fr 1.3fr",
				}}>
				<div style={{ cursor: "pointer" }} onClick={() => quickViewAppointments("scheduledStatus", "S")}>
					<div style={{ fontSize: "12px", color: "#797979", padding: "5px" }}>Scheduled</div>
					<div className='element' style={{ backgroundColor: qview.scheduleBgColor }}>
						{props.scheduledCount}
					</div>
				</div>
				<div style={{ cursor: "pointer" }} onClick={() => quickViewAppointments("checkedinStatus", "S")}>
					<div style={{ fontSize: "12px", color: "#797979", padding: "5px" }}>Waiting</div>
					<div className='element' style={{ backgroundColor: qview.waitingBgColor }}>
						{props.waitingCount}
					</div>
				</div>
				<div style={{ cursor: "pointer" }} onClick={() => quickViewAppointments("engagedStatus", "S")}>
					<div style={{ fontSize: "12px", color: "#797979", padding: "5px" }}>Engaged</div>
					<div className='element' style={{ color: "green", backgroundColor: qview.engagedBgColor }}>
						{props.engagedCount}
					</div>
				</div>
				<div style={{ cursor: "pointer" }} onClick={() => quickViewAppointments("checkedoutStatus", "S")}>
					<div style={{ fontSize: "12px", color: "#797979", padding: "5px" }}>Check Out</div>
					<div className='element' style={{ backgroundColor: qview.checkoutBgColor }}>
						{props.checkoutCount}
					</div>
				</div>
			</div>
		</>
	);
};

export default AppointmentCount;

export const initQviewState = {
	scheduleBgColor: "antiquewhite",
	waitingBgColor: "#ffffff",
	engagedBgColor: "#ffffff",
	checkoutBgColor: "#ffffff",
};
