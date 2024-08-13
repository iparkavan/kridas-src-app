import React, { useState } from "react";
import useAuthForm from "./useAuthForm";
import { validateauth, fields } from "./validateAuth";
import Featured from "../../assets/images/featured.jpg";
import hallacademylogo from "../../assets/images/hallmark-physio-logo.png";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";

import "./auth.scss";
import TextField from "@material-ui/core/TextField";

import AuthService from "../../service/AuthService";
import { useHistory } from "react-router-dom";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";

import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

import MasterData from "../helper/masterdata";

const Login = () => {
	let history = useHistory();

	const [showPassword, setShowPassword] = useState(false);

	const { handleChange, handleSubmit, values, errors } = useAuthForm(submit, validateauth, fields);
	const [msg, setMsg] = useState("");

	function submit() {
		const credentials = { userEmail: values.email, password: values.password };
		AuthService.login(credentials).then(
			(res) => {
				console.log(res);
				if (res.status === 200 && res.data.success !== false) {
					localStorage.setItem("userInfo", JSON.stringify(res.data));
					MasterData.setMasterData();

					let roles = res.data.userRoles;

					let issuperadmin = roles.find((o) => o.roleType === "SAD");
					let isadmin = roles.find((o) => o.roleType === "ADM");

					if (issuperadmin != null || issuperadmin !== undefined) {
						AuthService.setIsSuperAdmin(true);
					} else {
						AuthService.setIsSuperAdmin(false);
					}

					if (isadmin != null || isadmin !== undefined) {
						AuthService.setIsAdmin(true);
					} else {
						AuthService.setIsAdmin(false);
					}

					history.push("/dash-admin");

					// if (AuthService.getRole() === "Admin") {
					// 	localStorage.setItem("nav", "admindash");
					// 	history.push("/dash-admin");
					// } else if (AuthService.getRole() === "SuperAdmin") {
					// 	history.push("/dash-admin");
					// } else if (AuthService.getRole() === "Doctor") {
					// 	history.push("patient/index");
					// }
				} else {
					setMsg(res.data.message);
				}
			},
			(error) => {
				console.log(error);
				setMsg("Authentical Failed, possible bad credentials");
				history.push("/dash-admin");
			},
		);
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
									<div className='academy__name'>Hallmark Practice Management System</div>
								</div>
								<div>
									<TextField
										type='text'
										label='Enter Email'
										fullWidth
										margin='dense'
										name='email'
										value={values.email}
										onChange={handleChange}
									/>
									{errors.email && <p className='error'>{errors.email}</p>}
								</div>
								<div>
									<FormControl fullWidth>
										<InputLabel htmlFor='standard-adornment-password'>Password</InputLabel>
										<Input
											id='standard-adornment-password'
											type={showPassword ? "text" : "password"}
											name='password'
											fullWidth
											margin='dense'
											value={values.password}
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

									{errors.password && <p className='error'>{errors.password}</p>}
								</div>
								<div className='fgt_pass'>
									<div className='login_rememberme'>&nbsp;</div>
									<div className='login_forgotpass'>
										<Link to='/forgot-pass'>Forgot Password?</Link>
									</div>
								</div>
								<div className='error'>{msg}</div>

								<div className='styl--center'>
									<Button type='submit' variant='contained' color='primary'>
										Sign In
									</Button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
