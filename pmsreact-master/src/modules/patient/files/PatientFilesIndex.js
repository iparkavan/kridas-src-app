import React, { useState, useEffect } from "react";

import { useHistory } from "react-router-dom";

import { useParams } from "react-router-dom";

import PatientService from "../../../service/PatientService";

import Button from "@material-ui/core/Button";

import PatientFilesDetails from "./PatientFilesDetails";

const PatientFilesIndex = (props) => {
	let history = useHistory();
	const [loading, setLoading] = useState(false);

	const { id } = useParams();
	const { patientId } = props;

	const [patientFiles, setPatientFiles] = useState([]);

	useEffect(() => {
		PatientService.fetchPatientFilesById(id).then((res) => {
			setPatientFiles(res.data);
			setLoading(true);
		});
	}, [id]);

	const addFile = (e) => {
		e.preventDefault();
		console.log("object submitted successfuy ..");
		history.push("/patient/patient-file/add/" + patientId);
	};

	const addMedicalCertificate = (e) => {
		e.preventDefault();
		history.push("/patient/patient-mc/add/" + patientId);
	};

	return (
		<>
			<div className='adm-wrap'>
				<div style={header}>
					<div>List of Patient Records</div>

					<div>
						<Button variant='contained' color='primary' size='small' onClick={addMedicalCertificate}>
							+ Add Medical Certificate
						</Button>
						&nbsp;
						<Button variant='contained' color='primary' size='small' onClick={addFile}>
							+ Add File
						</Button>
					</div>
				</div>
				{loading ? <PatientFilesDetails reportdata={patientFiles} /> : ""}
			</div>
		</>
	);
};

const header = {
	display: "flex",
	justifyContent: "space-between",
	padding: "10px 0px",
	textAlign: "left",
};

export default PatientFilesIndex;
