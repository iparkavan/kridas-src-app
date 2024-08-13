/* eslint-disable eqeqeq */
import { Grid, Paper } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import React from 'react'
import { createStyles, Theme } from "@material-ui/core/styles";


const BootstrapInput = withStyles((theme: Theme) =>
    createStyles({
        root: {
            "label + &": {
                marginTop: theme.spacing(3),
            },
        },
        input: {},

        paper: {
            padding: theme.spacing(0),
            color: theme.palette.text.secondary,
        },
    })
)(InputBase);

export default function MyDetailsComponent(props) {

    const userEmail = JSON.parse(localStorage.getItem("attributes")).find(x => x.name === 'email').value;
    const billingContactNumber = props.subscriberDetails?.blngInvcAddress?.contact_number.replaceAll('-','');
    const physicalContactNumber = props.subscriberDetails?.physicalAddress?.contact_number.replaceAll('-','');

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={8} md={9}>
                <Grid container spacing={3}>
                    {
                        sessionStorage.role == 'Admin' ? <React.Fragment>
                            <Grid item xs={12} sm={6}>
                                <p className="bodycopyg1">
                                    {" "}
                                    {process.env.REACT_APP_REGION == 'INDIA' ? "Name of the Hospital/Clinic/Lab" : "Name of the Provider / Practice"}
                                </p>
                                <p className="copytitle1">{props.subscriberDetails?.cmpnyLegalNm}</p>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <p className="bodycopyg1">
                                    {" "}
                                    Registered email address
                                </p>
                                <p className="copytitle1">{props.email}</p>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <p className="bodycopyg1"> Physical address</p>
                                <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.physicalAddress?.address_line1 ? '' : 'requird'}`}>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="Address Line 1"
                                        value={props.subscriberDetails?.physicalAddress?.address_line1}
                                        onChange={(e) => {
                                            props.onChangeFormData('address_line1', e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} className='pd0 txt-left'>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="Address Line 2 "
                                        value={props.subscriberDetails?.physicalAddress?.address_line2}
                                        onChange={(e) => {
                                            props.onChangeFormData('address_line2', e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.physicalAddress?.city ? '' : 'requird'}`}>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="City"
                                        value={props.subscriberDetails?.physicalAddress?.city}
                                        onChange={(e) => {
                                            props.onChangeFormData('city', e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.physicalAddress?.state ? '' : 'requird'}`}>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="State"
                                        value={props.subscriberDetails?.physicalAddress?.state}
                                        onChange={(e) => {
                                            props.onChangeFormData('state', e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.physicalAddress?.country ? '' : 'requird'}`}>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="Country"
                                        value={props.subscriberDetails?.physicalAddress?.country}
                                        onChange={(e) => {
                                            props.onChangeFormData('country', e.target.value);
                                        }}
                                    />
                                </Grid>
                                {process.env.REACT_APP_REGION == 'US' &&
                                    <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.physicalAddress?.zip_code ? '' : 'requird'}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="ZIP Code"
                                            value={props.subscriberDetails?.physicalAddress?.zip_code}
                                            onChange={(e) => {
                                                props.onChangeFormData('zip_code', e.target.value);
                                            }}
                                        />
                                    </Grid>
                                    
                                }
                                {process.env.REACT_APP_REGION == 'INDIA' &&
                                    <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.physicalAddress?.zip_code ? '' : 'requird'}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="PIN Code"
                                            value={props.subscriberDetails?.physicalAddress?.zip_code}
                                            onChange={(e) => {
                                                props.onChangeFormData('zip_code', e.target.value);
                                            }}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12} className={`pd0 txt-left ${physicalContactNumber && physicalContactNumber.length === 10 ? '' : 'requird'}`}>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="Phone number"
                                        value={props.subscriberDetails?.physicalAddress?.contact_number}
                                        onBlur={(e) => {
                                            props.createPhoneNumber('contact_number', e.target.value, 'physicalAddress');
                                        }}
                                        onChange={(e) => {
                                            props.onChangeFormData('contact_number', e.target.value);
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <p className="bodycopyg1">Billing address</p>
                                <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.blngInvcAddress?.address_line1 ? '' : 'requird'}`}>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="Address Line 1"
                                        value={props.subscriberDetails?.blngInvcAddress?.address_line1}
                                        onChange={(e) => {
                                            props.onChangeFormData('address_line1', e.target.value, 'blngInvcAddress');
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} className='pd0 txt-left'>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="Address Line 2 "
                                        value={props.subscriberDetails?.blngInvcAddress?.address_line2}
                                        onChange={(e) => {
                                            props.onChangeFormData('address_line2', e.target.value, 'blngInvcAddress');
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.blngInvcAddress?.city ? '' : 'requird'}`}>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="City"
                                        value={props.subscriberDetails?.blngInvcAddress?.city}
                                        onChange={(e) => {
                                            props.onChangeFormData('city', e.target.value, 'blngInvcAddress');
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.blngInvcAddress?.state ? '' : 'requird'}`}>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="State"
                                        value={props.subscriberDetails?.blngInvcAddress?.state}
                                        onChange={(e) => {
                                            props.onChangeFormData('state', e.target.value, 'blngInvcAddress');
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.blngInvcAddress?.country ? '' : 'requird'}`}>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="Country"
                                        value={props.subscriberDetails?.blngInvcAddress?.country}
                                        onChange={(e) => {
                                            props.onChangeFormData('country', e.target.value, 'blngInvcAddress');
                                        }}
                                    />
                                </Grid>
                                {process.env.REACT_APP_REGION == 'US' &&
                                    <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.blngInvcAddress?.zip_code ? '' : 'requird'}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="ZIP Code"
                                            value={props.subscriberDetails?.blngInvcAddress?.zip_code}
                                            onChange={(e) => {
                                                props.onChangeFormData('zip_code', e.target.value, 'blngInvcAddress');
                                            }}
                                        />
                                    </Grid>
                                }
                                {process.env.REACT_APP_REGION == 'INDIA' &&
                                    <Grid item xs={12} className={`pd0 txt-left ${props.subscriberDetails?.blngInvcAddress?.zip_code ? '' : 'requird'}`}>
                                        <BootstrapInput
                                            className="primary-input mb20 width100p"
                                            placeholder="PIN Code"
                                            value={props.subscriberDetails?.blngInvcAddress?.zip_code}
                                            onChange={(e) => {
                                                props.onChangeFormData('zip_code', e.target.value, 'blngInvcAddress');
                                            }}
                                        />
                                    </Grid>
                                }
                                <Grid item xs={12} className={`pd0 txt-left ${billingContactNumber && billingContactNumber.length === 10 ? '' : 'requird'}`}>
                                    <BootstrapInput
                                        className="primary-input mb20 width100p"
                                        placeholder="Phone number"
                                        value={props.subscriberDetails?.blngInvcAddress?.contact_number}
                                        onBlur={(e) => {
                                            props.createPhoneNumber('contact_number', e.target.value, 'blngInvcAddress');
                                        }}
                                        onChange={(e) => {
                                            props.onChangeFormData('contact_number', e.target.value, 'blngInvcAddress');
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container className="signinbototm mt30">
                                <Grid item xs={12} sm={9} md={9}>
                                    <button className="btn-primary" onClick={props.updateSubscriberDetails}>
                                        update
                                    </button>
                                </Grid>
                            </Grid>
                        </React.Fragment>
                        :<React.Fragment>
                            <Grid item xs={12} sm={6}>
                                <p className="bodycopyg1">First Name</p>
                                <p className="copytitle1">{sessionStorage.firstName}</p>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <p className="bodycopyg1">Last Name</p>
                                <p className="copytitle1">{sessionStorage.lastName}</p>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <p className="bodycopyg1">Email</p>
                                <p className="copytitle1">{userEmail}</p>
                            </Grid>
                        </React.Fragment>
                    }

                    <Grid item xs={12} sm={12}>
                        <hr className="redline" />
                    </Grid>
                    <Grid item xs={12} sm={7}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <p className="bodycopyg1"> Current Password </p>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <BootstrapInput
                                    className="primary-input"
                                    type="password"
                                    onChange={(e) => props.passwordFormChange('currentPass', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <p className="bodycopyg1"> New Password </p>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <BootstrapInput
                                    className="primary-input "
                                    placeholder=""
                                    type="password"
                                    onChange={(e) => props.passwordFormChange('newPassword', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={6}>
                                <p className="bodycopyg1"> Confirm Password </p>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6}>
                                <BootstrapInput
                                    className="primary-input "
                                    placeholder=""
                                    type="password"
                                    onChange={(e) => props.passwordFormChange('confirmPass', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
                <Paper className=" bx-shadow" style={{ textAlign: 'center' }}>
                    <img
                        alt="Logo"
                        className="imgresponsive"
                        style={{ borderRadius: '50%', height: '250px', width: '250px' }}
                        src={
                            props.pictures.url !== "" && props.pictures.url !== undefined && props.pictures.url !== null
                                ? props.pictures.url
                                : "assets/img/dental.jpg"
                        }
                    />
                </Paper>
            </Grid>
        </Grid>
    )
}