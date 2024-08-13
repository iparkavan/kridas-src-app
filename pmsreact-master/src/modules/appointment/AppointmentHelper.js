import moment from "moment";
import "moment-timezone";
import AuthService from "../../service/AuthService";
import AppointmentService from "../../service/AppointmentService";

class AppointmentHelper {
	//

	validateOperatingTime(date) {
		var day = moment(date).format("ddd");

		let operatingTime = "";

		if (day.toUpperCase() === "MON") {
			operatingTime = AuthService.getOperatingHours("MON");
		} else if (day.toUpperCase() === "TUE") {
			operatingTime = AuthService.getOperatingHours("TUE");
		} else if (day.toUpperCase() === "WED") {
			operatingTime = AuthService.getOperatingHours("WED");
		} else if (day.toUpperCase() === "THU") {
			operatingTime = AuthService.getOperatingHours("THU");
		} else if (day.toUpperCase() === "FRI") {
			operatingTime = AuthService.getOperatingHours("FRI");
		} else if (day.toUpperCase() === "SAT") {
			operatingTime = AuthService.getOperatingHours("SAT");
		}

		if (operatingTime === undefined || operatingTime === "") {
			operatingTime = "00:00-00:00";
		}

		let tmpArr = operatingTime[0].toString().split(",");

		var format = "hh:mm";

		var time = moment(moment(date).format("HH:mm"), format);
		var beforeLunchStart, beforeLunchEnd, afterLunchStart, afterLunchEnd;

		if (tmpArr.length === 2) {
			beforeLunchStart = moment(tmpArr[0].substring(0, 5), format);
			beforeLunchEnd = moment(tmpArr[0].substring(6, 13), format);

			afterLunchStart = moment(tmpArr[1].substring(0, 5), format);
			afterLunchEnd = moment(tmpArr[1].substring(6, 13), format);
		} else if (tmpArr.length === 1) {
			beforeLunchStart = moment(tmpArr[0].substring(0, 5), format);
			beforeLunchEnd = moment(tmpArr[0].substring(6, 13), format);
		} else {
			return false;
		}

		if (time.isBetween(beforeLunchStart, beforeLunchEnd, null, "[)") || time.isBetween(afterLunchStart, afterLunchEnd, null, "[]")) {
			return true;
		} else {
			// console.log("is not between");
			return false;
		}
	}

	reducer(state, { field, value }) {
		return {
			...state,
			[field]: value,
		};
	}

	supplySuperScript(param) {
		return "nd";
	}
}

export default new AppointmentHelper();
