/* eslint-disable eqeqeq */
import { Checkbox, createStyles, FormControl, InputBase, ListItemIcon, ListItemText, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
import DeleteIcon from '@material-ui/icons/Delete';
const BootstrapInput = withStyles((theme) =>
    createStyles({
        root: {
            "label + &": {
                marginTop: theme.spacing(3),
            },
        },
        input: {},
    })
)(InputBase);

function CustomTable(props) {

    const {header, tableData} = {...props}
    const [dataLength, setDataLength] = React.useState(false);

    const assignedClients = [];
    props.clientListData.map((client) => {
        assignedClients.push(client.clientName);
    })

    useEffect(()=> {
        let find = tableData.find(item => item.operation != 'd');
        if(!find){
            setDataLength(true);
        }else{
            setDataLength(false);
        }
    }, [tableData])

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
                    {dataLength && <TableRow>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>No Data Available</TableCell>
                            <TableCell></TableCell>
                        </TableRow>}
                    {tableData && tableData.length > 0 && tableData.map((row,index) => { 

                        if( row.operation != 'd' ){ 
                            return (<TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <BootstrapInput
                                    className='primary-input mb20 width100p'
                                    value={row.firstName}
                                    disabled={index > 0 || row.users_id}
                                    onChange={(e) => props.onChangeTableInput('firstName', index, e.target.value, row)}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <BootstrapInput
                                    className='primary-input mb20 width100p'
                                    value={row.lastName}
                                    disabled={index > 0 || row.users_id}
                                    onChange={(e) => {
                                        props.onChangeTableInput('lastName', index, e.target.value, row)}
                                    }
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                            <FormControl>
                                <Select
                                    multiple
                                    value={row.clients}
                                    onChange={(e) => {
                                        e.target.value[e.target.value.length - 1] === 'all' ? props.onChangeTableInput('clients', index, assignedClients, row) 
                                        : props.onChangeTableInput('clients', index, e.target.value, row)
                                    }}
                                    disabled={index > 0 || row.users_id}
                                    variant='outlined'
                                    style={{width: 260, marginBottom: 20}}
                                    renderValue={(selected) => selected.join(", ")}
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
                                    <MenuItem
                                    value="all"
                                    >
                                    <ListItemIcon>
                                        <Checkbox
                                        checked={assignedClients.length > 0 && row.clients.length === assignedClients.length}
                                        indeterminate={
                                            row.clients.length > 0 && row.clients.length < assignedClients.length
                                        }
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Select All"
                                    />
                                    </MenuItem>
                                    {assignedClients.map((client) =>
                                    <MenuItem key={client} value={client}>
                                        <ListItemIcon>
                                        <Checkbox checked={row.clients.indexOf(client) > -1} />
                                        </ListItemIcon>
                                        <ListItemText primary={client} />
                                    </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <BootstrapInput
                                    className='primary-input mb20 width100p'
                                    value={row.email}
                                    disabled={index > 0 || row.users_id}
                                    onChange={(e) => props.onChangeTableInput('email', index, e.target.value, row)}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <DeleteIcon titleAccess='Delete User' onClick={() => props.onClickDelete(row, index)} style={{color:'red',cursor:'pointer'}} />
                            </TableCell>
                            
                        </TableRow>)
                    }
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CustomTable;