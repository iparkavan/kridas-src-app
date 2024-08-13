import { useState, useEffect } from "react";

const useAuthForm = (callback, validate, fields) => {
	const valuesInitialState = fields.reduce((acc, fields) => {
		acc[fields] = "";
		return acc;
	}, {});
	const [values, setValues] = useState(valuesInitialState);

	//const [values, setValues] = useState({ email: "marcos@pms.sg", password: "manivannan" });
	const [errors, setErrors] = useState({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (event) => {
		const { name, value } = event.target;
		setValues({
			...values,
			[name]: value,
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setErrors(validate(values));
		setIsSubmitting(true);
	};

	useEffect(() => {
		if (Object.keys(errors).length === 0 && isSubmitting) {
			//	localStorage.clear();
			callback();
		}
	}, [errors]);

	return {
		handleChange,
		handleSubmit,
		values,
		errors,
	};
};

export default useAuthForm;
