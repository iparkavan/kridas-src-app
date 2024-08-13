export const fields = ["email", "password"];

export const validateauth = values => {
	let errors = {};
	if (!values.email) {
		errors.email = "Email address is required";
	} else if (!/\S+@\S+\.\S+/.test(values.email)) {
		errors.email = "Email address is invalid";
	}
	if (!values.password) {
		errors.password = "Password is required";
	} else if (values.password.length < 6) {
		errors.password = "Password needs to be more than 6 characters";
	}
	return errors;
};

// forgot pass
export const fgtpassFields = ["email"];

export const validateFgtPass = values => {
	let errors = {};
	if (!values.email) {
		errors.email = "Email address is required";
	} else if (!/\S+@\S+\.\S+/.test(values.email)) {
		errors.email = "Email address is invalid";
	}

	return errors;
};

// reset pass
// forgot pass
export const rstpassFields = ["password", "confirmpassword"];

export const validateRstPass = values => {
	let errors = {};

	if (values.password !== values.confirmpassword) {
		errors.password = "Password did not match";
	}

	return errors;
};
