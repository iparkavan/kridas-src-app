import { Box, Grid } from '@material-ui/core'
import React from 'react'
import AddIcon from '@material-ui/icons/Add';
import CustomTable from './common/ManageClientsTable';
import { EXISTING_MANAGE_CLIENT_TABLE_HEADER } from './table_constants'


import { ToastError } from '../service/toast/Toast';
import { ToastContainer } from 'react-toastify';
const ManageClientsTab = (props) => {

    const onClickDelete = (type, index) => {
        let temp_array = [...props.clientListData];
        let itemToDlete = temp_array[index];
        let userData = [...props.userListData];
        let isEligibleToDelete = true;
        userData && userData.forEach(obj => {
            let find = obj.clients.find(item => item === itemToDlete.clientName);
            if (find) {
                isEligibleToDelete = false;
            }
        });
        if (temp_array[index]['operation'] === 'c') {
            temp_array.splice(index, 1);
        } else if (isEligibleToDelete) {
            temp_array[index]['operation'] = 'd';
        } else {
            ToastError(`"${itemToDlete.clientName}" is assigned to user(s). Please modify the users before deleting the clients`);
        }
        if (temp_array.length > 0) {
            props.setClientListData(temp_array);
        } else {
            props.setClientListData(props.defaultClientTableData);
        }
    }

    const onChangeTableInput = (keyName, index, keyValue, rowData) => {
        let temp_array = [...props.clientListData];
        let temp_value = keyValue
        temp_array[index][keyName] = temp_value;
        if (rowData && !rowData.clientId) {
            temp_array[index]['operation'] = 'c';
        }
        props.setClientListData(temp_array);
    }

    const onClickAdd = () => {
        props.setClientAddButtonClicked(true);
        let temp_array = [...props.defaultClientTableData, ...props.clientListData];
        props.setClientListData(temp_array);
    }

    return (
        <>
            <Grid container spacing={3} className="mr0 txt-left">
                <ToastContainer />
                <Grid item xs={12} sm={12}>
                    <Box sx={{ width: '100%' }}>
                        <Grid item xs={12} sm={12} md={12} className="pd0">
                            <span className="txt-left btitle linkprim">Add Clients</span>
                            <span className="txt-left btitle linkprim" title='Add User'><AddIcon onClick={() => onClickAdd()} className='add-button' /></span>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} className="pd0">
                            <CustomTable
                                header={EXISTING_MANAGE_CLIENT_TABLE_HEADER}
                                tableData={props.clientListData}
                                onClickDelete={onClickDelete}
                                onChangeTableInput={onChangeTableInput}
                                onClickAdd={onClickAdd}
                            />
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default ManageClientsTab