import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

import StaffList from './StaffList';
import AppointmentMode from './AppointmentMode';
import ApptmtConfirmation from './ApptmtConfirmation';

import './StaffModal.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const StaffSelection = ({ open, handleOpen, handleClose, staffs, patientName, serviceDate }) => {

    const steps = ['Available Clinician/Staff', 'Appointment Mode', 'Confirmation'];
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    // Selected Staff state and handler.
    const [selectedStaff, setSelectedStaff] = React.useState('');
    const handleStaffChange = (event) => {
        setSelectedStaff(event.target.value);
    };

    // Appoitment mode and handler.
    const [apptmtMode, setApptmtMode] = React.useState('');
    const handleApptmtChange = (event) => {
        setApptmtMode(event.target.value);
    };

    const disableNext = activeStep == 0 ? (selectedStaff == '' ? true : false) :
        (activeStep == 1 ? (apptmtMode == '' ? true : false) : false);


    return (

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Stepper activeStep={activeStep}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};

                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

                {activeStep == 0 &&
                    <StaffList
                        staffs={staffs}
                        value={selectedStaff}
                        handleChange={handleStaffChange} />
                }
                {activeStep == 1 &&
                    <AppointmentMode
                        value={apptmtMode}
                        handleChange={handleApptmtChange} />
                }

                {activeStep == steps.length - 1 &&
                    <ApptmtConfirmation
                        apptmtMode={apptmtMode}
                        selectedStaff={selectedStaff}
                        patientName={patientName}
                        serviceTime={serviceDate}
                    />
                }


                <React.Fragment>
                    <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: "1 1 auto" }} />

                        {activeStep === steps.length - 1 &&
                            <Button onClick={handleClose}>
                                Confirm
                            </Button>

                        }

                        {activeStep !== steps.length - 1 &&
                            <Button
                                onClick={handleNext}
                                disabled={disableNext}>
                                Next
                            </Button>
                        }

                    </Box>
                </React.Fragment>

            </Box>
        </Modal>

    );
};

StaffSelection.propTypes = {

};

export default StaffSelection;