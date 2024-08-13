/* eslint-disable eqeqeq */
import {  FormControl, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@material-ui/core';
import React, { useEffect } from 'react';
import { STATUS_DROP_DOWN_DATA, USER_TYPE_DROP_DOWN_DATA } from '../constants/superUserDataConstants';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import moment from 'moment';


function CustomTable(props) {

    let {header, tableData} = {...props}
    // const [dataLength, setDataLength] = React.useState(false);

    // useEffect(()=> {
    //     let find = tableData.find(item => item.operation != 'd');
    //     if(!find){
    //         setDataLength(true);
    //     }else{
    //         setDataLength(false);
    //     }
    // }, [tableData])

    


    

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {header && header.map((item, index) => (
                            <TableCell key={index}>{item}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {/* {dataLength && <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>No Data Available</TableCell>
                            <TableCell></TableCell>
                        </TableRow>} */}
                    {tableData && tableData.length > 0 && tableData.map((row,index) => {  

                            return (<TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <TextField
                                    required
                                    variant='outlined'
                                    error={props.isSaveButtonClicked && (!row.organization_name || row.organization_name.trim() === '') ? true : false}
                                    style={{width: 260}}
                                    value={row.organization_name}
                                    disabled={row.preconfigured_users_id}
                                    onChange={(e) => props.onChangeTableInput('organization_name', index, e.target.value, row)}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <TextField
                                    required
                                    variant='outlined'
                                    error={props.isSaveButtonClicked && (!row.user_email || row.user_email.trim() === '') ? true : false}
                                    style={{width: 260}}
                                    value={row.user_email}
                                    disabled={row.preconfigured_users_id}
                                    onChange={(e) => {
                                        props.onChangeTableInput('user_email', index, e.target.value, row)}
                                    }
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                            <FormControl>
                                <Select
                                    value={row.role}
                                    disabled={row.preconfigured_users_id }
                                    required
                                    variant='outlined'
                                    error={props.isSaveButtonClicked && (!row.role || row.role === '') ? true : false}
                                    style={{width: 200}}
                                    onChange={(e) => {props.onChangeTableInput('role', index, e.target.value, row)}}
                                    MenuProps={{
                                        classes: {
                                            paper: {
                                                borderRadius: "3%",
                                                backgroundColor: 'white',
                                            }
                                        },
                                        anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left'
                                        },
                                        getContentAnchorEl: null,
                                        transitionDuration: 0
                                    }}
                                >
                                    {USER_TYPE_DROP_DOWN_DATA.map((userType) => {
                                        return <MenuItem value={userType}>{userType}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            </TableCell>
                            <TableCell component="th" scope="row">
                            <FormControl>
                                <Select
                                    value={row.status}
                                    disabled={row.preconfigured_users_id && !('editClicked' in row)}
                                    variant='outlined'
                                    error={props.isSaveButtonClicked && (!row.status || row.status === '') ? true : false}
                                    required
                                    style={{width: 200}}
                                    onChange={(e) => {props.onChangeTableInput('status', index, e.target.value, row)}}
                                    MenuProps={{
                                        classes: {
                                            paper: {
                                                borderRadius: "3%",
                                                backgroundColor: 'white',
                                            }
                                        },
                                        anchorOrigin: {
                                            vertical: 'bottom',
                                            horizontal: 'left'
                                        },
                                        getContentAnchorEl: null,
                                        transitionDuration: 0
                                    }}
                                >
                                    {STATUS_DROP_DOWN_DATA.map((statusObj) => {
                                        return <MenuItem value={statusObj.value}>{statusObj.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            </TableCell>
                            <TableCell>
                            <b aria-disabled="true">{(row.preconfigured_users_id !== '') && moment(row.modified_on).format('MM/DD/YYYY HH:mm:ss')}</b>
                            </TableCell>
                            <TableCell>
                                {(row.preconfigured_users_id !== '') ? <ModeEditOutlineOutlinedIcon style={{cursor: 'pointer'}} onClick={() => props.handleEdit(row)} /> : ''}
                            </TableCell>
                        </TableRow>)
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CustomTable;