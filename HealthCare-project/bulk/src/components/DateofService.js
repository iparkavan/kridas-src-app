import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

function DateofService(props) {
  // The first commit of Material-UI
  const [selectedDate, setSelectedDate] = React.useState(new Date('2021-08-18T21:11:54'));

  const handleDateChange = (date) => {
    setSelectedDate(date);
    props.dateChanged(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>

      <KeyboardDatePicker
        className="width100p datepickcust"
        margin="normal"
        id="date-picker-dialog"
        label="Date of Service"
        format="MM/dd/yyyy"
        value={selectedDate}
        minDate={Date.now()}
        inputVariant="outlined"
        onChange={handleDateChange}
        KeyboardButtonProps={{
          'aria-label': 'change date',
        }}
      />
    </MuiPickersUtilsProvider>
  );
}
export default DateofService;