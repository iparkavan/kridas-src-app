import React, { useState } from "react";
import useAuthForm from "./useAuthForm";
import { validateRstPass, rstpassFields } from "./validateAuth";
import Featured from "../../assets/images/featured.jpg";
import hallacademylogo from "../../assets/images/hallmark-physio-logo.png";
import { Link } from "react-router-dom";
import { Button } from "../../elements/ui/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

import "./auth.scss";
import TextField from "@material-ui/core/TextField";

import AuthService from "../../service/AuthService";
import { useHistory } from "react-router-dom";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

const getQueryVariable = (variable) => {
	var query = window.location.search.substring(1);
	console.log(query); //"app=article&act=news_content&aid=160990"
	var vars = query.split("&");
	console.log(vars); //[ 'app=article', 'act=news_content', 'aid=160990' ]
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		console.log(pair); //[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ]
		if (pair[0] === variable) {
			return pair[1];
		}
	}
	return false;
};

const PassReset = () => {
	let history = useHistory();
	const { handleChange, handleSubmit, values, errors } = useAuthForm(submit, validateRstPass, rstpassFields);

	const [showPassword, setShowPassword] = useState(false);

	function submit() {
		console.log("PassReset Submitted Succesfully");

		const resetToken = getQueryVariable("token");

		// make API call
		const credentials = { resetToken: resetToken, password: values.password };

		AuthService.resetPassword(credentials).then((res) => {
			if (res.data.success && res.status === 200) {
				history.push("/pass-reset-success");
			}
		});
	}

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	return (
		<div>
			<div className='login_wrap'>
				<div className='login_left'>
					<img src={Featured} alt='hallmark academy logo' className='left_img' />
				</div>
				<div className='login_right'>
					<div className='form_block'>
						<form onSubmit={handleSubmit} noValidate autoComplete='off'>
							<div className='login_flex_container'>
								<div className='login_caps'>
									<img src={hallacademylogo} alt='hallmark academy logo' className='imgstyle' />
									<div className='academy__name'>Hallmark Physiotherapy Academy</div>
								</div>
								<div>
									<TextField
										type='text'
										label='Enter New Password'
										fullWidth
										margin='normal'
										name='password'
										value={values.password}
										onChange={handleChange}
									/>
								</div>

								<div>
									<FormControl fullWidth>
										<InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
										<Input
											id='standard-adornment-password'
											type={showPassword ? "text" : "password"}
											name='confirmpassword'
											fullWidth
											value={values.confirmpassword}
											onChange={handleChange}
											endAdornment={
												<InputAdornment position='end'>
													<IconButton
														aria-label='toggle password visibility'
														onClick={handleClickShowPassword}
														onMouseDown={handleMouseDownPassword}>
														{showPassword ? <Visibility /> : <VisibilityOff />}
													</IconButton>
												</InputAdornment>
											}
										/>
									</FormControl>
								</div>

								<div className='fdbck-msg'>{errors.password && <p className='error'>{errors.password}</p>}</div>

								<div className='styl--center'>
									<Button type='submit' buttonStyle='btn--neo--solid' buttonSize='btn--medium'>
										<span>Change Password</span>
									</Button>
								</div>
								<div className='login_signup'>
									Don't have an account?&nbsp;
									<span className='login_links'>
										<Link to='/sign-up'>Sign Up</Link>
									</span>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PassReset;
