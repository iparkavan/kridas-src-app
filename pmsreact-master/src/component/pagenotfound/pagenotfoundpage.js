import React from "react";

import "./pagenotfoundpage.scss";
import auth from "../../service/AuthService";

const PageNotFoundPage = props => {
	return (
		<div>
			<div class="pnf_wrap">
				<h1>404 page</h1>

				<button
					onClick={() => {
						if (auth.isAuthenticated()) {
							props.history.push("/dash");
						} else {
							props.history.push("/");
						}
					}}
				>
					Go Home
				</button>
			</div>
		</div>
	);
};

export default PageNotFoundPage;
