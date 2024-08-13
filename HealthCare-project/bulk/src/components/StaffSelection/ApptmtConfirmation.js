import React from 'react';
import PropTypes from 'prop-types';

import './StaffModal.css';

const ApptmtConfirmation = ({ apptmtMode, selectedStaff, patientName, serviceTime }) => {
    const confirmationMessage = `Scheduled ${apptmtMode} appointment for ${patientName}
                                 with ${selectedStaff} on ${serviceTime}`;
    return (
        <div className='appt-cnf'>
            {confirmationMessage}
        </div>
    );
};

ApptmtConfirmation.propTypes = {

};

export default ApptmtConfirmation;