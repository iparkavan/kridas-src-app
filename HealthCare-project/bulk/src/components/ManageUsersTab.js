import { Box, Grid } from '@material-ui/core';
import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import CustomTable from './common/ManageUsersTable';
import {EXISTING_MANAGE_USER_TABLE_HEADER} from './table_constants'


const ManageUsersTab = (props) => {

    const onClickDelete = (type, index) => {
        let temp_array = [...props.userListData];
        if (temp_array[index]['operation'] === 'c') {
            temp_array.splice(index, 1);
        } else {
            temp_array[index]['operation'] = 'd';
        }
        if (temp_array.length > 0) {
            props.setUserListData(temp_array);
        } else {
            props.setUserListData(props.defaultTableData);
        }
    }
    const onClickAdd = () => {
        props.setUserAddButtonCLicked(true);
        let temp_array = [...props.defaultTableData, ...props.userListData];
        props.setUserListData(temp_array);
    }

    const onChangeTableInput = (keyName, index, keyValue, rowData) => {
        let temp_array = [...props.userListData];
        let temp_value = keyValue

        if(keyName === 'email' && temp_value){
            temp_value = temp_value.trim();
        }
        temp_array[index][keyName] = temp_value;
        if (rowData && !rowData.userid) {
            temp_array[index]['operation'] = 'c';
        }
        props.setUserListData(temp_array);
    }

  return (
    <>
        <Grid container spacing={3} className="mr0 txt-left">
            <Grid item xs={12} sm={12}>
                <Box sx={{ width: '100%' }}>
                    <Grid item xs={12} sm={12} md={12} className="pd0">
                        <span className="txt-left btitle linkprim">Add users</span>
                        <span className="txt-left btitle linkprim" title='Add User'><AddIcon onClick={()=>onClickAdd()} className='add-button' /></span>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} className="pd0">
                        <CustomTable
                            header={EXISTING_MANAGE_USER_TABLE_HEADER}
                            tableData={props.userListData}
                            onClickDelete={onClickDelete}
                            clientListData={props.clientListData}
                            userListData={props.userListData}
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

export default ManageUsersTab