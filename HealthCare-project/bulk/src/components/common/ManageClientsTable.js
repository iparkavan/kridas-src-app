/* eslint-disable eqeqeq */
import { createStyles, InputBase, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, withStyles } from '@material-ui/core';
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
                            <TableCell></TableCell>
                        </TableRow>}
                    {tableData && tableData.length > 0 && tableData.map((row,index) => {  
                        if( row.operation != 'd' ){ return <TableRow
                            key={index}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                <BootstrapInput
                                    className='primary-input mb20 width100p'
                                    value={row.clientName}
                                    disabled={index > 0 || row.client_id}
                                    onChange={(e) => props.onChangeTableInput('clientName', index, e.target.value, row)}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <BootstrapInput
                                    className='primary-input mb20 width100p'
                                    value={row.clientDescription}
                                    disabled={index > 0 || row.client_id}
                                    onChange={(e) => props.onChangeTableInput('clientDescription', index, e.target.value, row)}
                                />
                            </TableCell>
                            <TableCell component="th" scope="row">
                                <DeleteIcon titleAccess='Delete User' onClick={() => props.onClickDelete(row, index)} style={{color:'red',cursor:'pointer'}} />
                            </TableCell>
                        </TableRow>}
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default CustomTable;