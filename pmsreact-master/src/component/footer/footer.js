import React from "react";

function Footer() {
	const getYear = () => {
		return new Date().getFullYear();
	};

	return (
		<div style={footer}>
			<div>
				<p style={footerText}>© Copyright {getYear()}. Hallmark Physio. All rights reserved</p>
			</div>
		</div>
	);
}

export default Footer;

const footer = {
	display: "grid",
	position: "relative",
	backgroundColor: "var(--bg-clr-primary)",
	height: "40px",
};

const footerText = {
	textAlign: "center",
	verticalAlign: "middle",
	padding: "1%",
	fontSize: "14px",
	color: "#ffffff",
};
