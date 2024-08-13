import React, { useState, Fragment, useEffect } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import FormControl from "@material-ui/core/FormControl";

import Container from "@material-ui/core/Container";

import { useHistory } from "react-router-dom";
import { DropzoneArea } from "material-ui-dropzone";
import { useParams, Link } from "react-router-dom";

import Breadcrumbs from "@material-ui/core/Breadcrumbs";

import Typography from "@material-ui/core/Typography";
import Loader from "../../helper/Loader";
import PatientService from "../../../service/PatientService";

import AuthService from "../../../service/AuthService";
import { SaveIcon } from "@material-ui/icons/Save";

const PatientFilesAdd = (props) => {
	let history = useHistory();
	//	const { handleChange, handleSubmit, values, errors } = useModuleForm(saveModule, validatemodule, fields);

	const [selectedFile, setSelectedFile] = useState(null);
	const [selectedFileName, setSelectedFileName] = useState(null);

	const [loading, setLoading] = useState(false);

	const { patientIdParam } = useParams();
	// const { patientId } = props;

	// const fileSelectedHandler = (event) => {
	// 	console.log(event, "event object");
	// 	this.setState({
	// 		selectedFile: event.target.files[0],
	// 	});
	// };

	// const handleClick = () => {
	// 	history.push("/admin/list-course-media/" + id);
	// };

	// function reloadCourseList() {
	// 	CourseService.fetchNewCourseById(id).then((res) => {
	// 		setCourse(res.data);
	// 	});
	// }

	useEffect(() => {
		// reloadCourseList();
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("object submitted successfuy ..");
		setLoading(true);

		// let fileObj = {
		// 	companyId: AuthService.getUserInfo().companyDTO.id,
		// 	patientId: patientIdParam,
		// 	imageFile: selectedFile,
		// 	imageFileName: selectedFileName,
		// 	filePath: "",
		// 	isSystemGenerated: "NO",
		// };

		const formData = new FormData();
		// formData.append("companyId", AuthService.getUserInfo().companyDTO.id);
		formData.append("companyId", "2");
		formData.append("patientId", patientIdParam);
		formData.append("file", selectedFile);
		formData.append("imageFileName", selectedFileName);
		formData.append("filePath", "");
		formData.append("isSystemGenerated", "NO");

		console.log("print upload form " + JSON.stringify(formData));

		PatientService.uploadFile(formData)
			.then((res) => {
				if (res.data.success && res.status === 200) {
					setLoading(false);
					history.push(`/patient/detail/${patientIdParam}`);
				}
			})
			.catch((error) => {
				console.log(error);
				setLoading(false);
			});
	};

	const handleCancel = () => {
		history.goBack();
	};

	// const onFileChangeHandler = e => {
	// 	e.preventDefault();

	// 	setSelectedFileName(e.target.files[0].name);
	// 	toBase64(e.target.files[0]);
	// };

	// function toBase64(file) {
	// 	var reader = new FileReader();
	// 	reader.readAsDataURL(file);

	// 	reader.onload = () => {
	// 		setSelectedFile(reader.result);
	// 	};

	// 	reader.onerror = function (error) {
	// 		//	console.log("Error: ", error);
	// 	};
	// }

	const onFileChangeHandler = (e) => {
		if (e.length > 0) {
			setSelectedFileName(e[0].name);
			setSelectedFile(e[0]);
		}
	};

	return (
		<>
			<div className='adm-wrap'>
				<Fragment>
					<Container>
						<div style={header}>Add Media (Pictures, PDF) files (Max 100MB)</div>
						<form onSubmit={handleSubmit} noValidate autoComplete='off'>
							<FormControl style={formContainer}>
								<div>
									<DropzoneArea onChange={onFileChangeHandler} showAlerts={false} maxFileSize={100000000} />

									{/* {errors.imageFile && <p className="error">{errors.imageFile}</p>} */}
								</div>
								<br />
								<div style={{ display: "flex", justifyContent: "center" }}>
									<Button type='submit' variant='contained' size='small' onClick={handleSubmit} color='primary'>
										Save
									</Button>
									&nbsp;&nbsp;
									<Button variant='contained' color='primary' size='small' onClick={handleCancel}>
										Cancel
									</Button>
								</div>
								{loading ? <Loader></Loader> : ""}
							</FormControl>
						</form>
					</Container>
				</Fragment>
			</div>
		</>
	);
};

const formContainer = {
	display: "grid",
};

const header = {
	padding: "10px 0px",
	textAlign: "left",
};

const label = {
	fontSize: "14px",
	color: "grey",
	paddingLeft: "px",
};

const coursename = {
	padding: "2px 5px 5px 0px",
	fontSize: "20px",
	color: "#222222",
	fontWeight: "500",
	fontFamily: "Roboto",
};

export default PatientFilesAdd;

// <div>
// 										<Button
// 											variant='contained'
// 											color='primary'
// 											size='small'
// 											type='submit'
// 											fullWidth
// 											startIcon={<SaveIcon />}>
// 											Save
// 										</Button>
// 									</div>
// 									<div>
// 										<Button
// 											variant='contained'
// 											color='default'
// 											size='small'
// 											fullWidth
// 											onClick={handleCancel}
// 											startIcon={<CancelIcon />}>
// 											Cancel
// 										</Button>
// 									</div>
