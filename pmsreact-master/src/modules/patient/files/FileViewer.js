import React from "react";
import PDFViewer from "pdf-viewer-reactjs";
import { Viewer } from "react-viewer";

const FileViewer = (props) => {
	const [visible, setVisible] = React.useState(false);
	const [clickedFile, setClickedFile] = React.useState(false);

	return (
		<Viewer
			visible={props.visible}
			onClose={() => {
				setVisible(false);
			}}
			images={[{ src: clickedFile, alt: "" }]}
		/>
	);
};

export default FileViewer;
