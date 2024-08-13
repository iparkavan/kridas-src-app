import React, { useEffect, useState, useRef } from "react";

const ReportsHeader = (props) => {
	const [companyName, setCompanyName] = useState("");

	useEffect(() => {
		setCompanyName(props.companyname);
	}, []);

	return (
		<>
			<div
				style={{ display: "flex", padding: "20px 0px 40px 0px", fontSize: "24px", borderBottom: "1px solid grey", justifyContent: "center" }}>
				{props.companyname}
			</div>
			<div style={{ display: "flex", fontSize: "18px", padding: "16px" }}>
				<b>Report Name :</b> &nbsp;{props.reportname}
			</div>
		</>
	);
};

export default ReportsHeader;
