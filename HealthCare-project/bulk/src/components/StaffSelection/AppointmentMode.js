import React from 'react';
import PropTypes from 'prop-types';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';


const AppointmentMode = props => {
    return (
        <div className='appt-mode'>
            <FormControl component="fieldset">
                <FormLabel component="legend">Select Appointment Mode</FormLabel>
                <RadioGroup
                    aria-label="gender"
                    name="controlled-radio-buttons-group"
                    value={props.value}
                    onChange={props.handleChange}
                >
                    <FormControlLabel value={'In Person'} control={<Radio />} label="In Person" />
                    <FormControlLabel value={'Virtual'} control={<Radio />} label="Virtual" />

                </RadioGroup>
            </FormControl>
        </div>

    );
};

AppointmentMode.propTypes = {

};

export default AppointmentMode;