import React from 'react';
import PropTypes from 'prop-types';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import './StaffModal.css';


const StaffList = props => {
    const availableStaff = props.staffs.map(staff =>
        <FormControlLabel value={staff.name} control={<Radio />} label={staff.name} />
    );
    return (
        <div className='staff-list'>
            <FormControl component="fieldset">
                <FormLabel component="legend">Select Clinician/Staff</FormLabel>
                <RadioGroup
                    aria-label="gender"
                    name="controlled-radio-buttons-group"
                    value={props.value}
                    onChange={props.handleChange}
                >
                    {availableStaff}

                </RadioGroup>
            </FormControl>
        </div>

    );
};

StaffList.propTypes = {

};

export default StaffList;