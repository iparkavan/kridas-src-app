import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { makeStyles } from "@material-ui/styles";


const useStyles = makeStyles((theme) => ({
  field: {
    width: "250px",
    margin: "10px",
    marginLeft: '20px'
  },
}));

const Dropdown = (props) =>{
  const classes = useStyles();
  const {label,name,List}= props;  
    
   return(
       <>
         <FormControl className={classes.field}>
                    <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
                    <Select
                        labelId="demo-simple-select-helper-label"
                        id="demo-simple-select-helper"                     
                        name={name}
                        label={label}                      
                         onChange={props.onSelectChange}
                        {...props}
                        >
                      {List?.map((i) =>
                      <MenuItem value = {i.id}>{i.value}</MenuItem>                      
                      )} 
                    </Select>
                </FormControl>               
       </>       
   )
}
export default Dropdown;