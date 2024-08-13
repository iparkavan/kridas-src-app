import React, { useEffect, useState, useRef } from 'react';
import { TablePagination, makeStyles, Grid, Button, FormControl, InputLabel, Input, InputAdornment, Select, MenuItem } from '@material-ui/core';
import { Edit, Delete, Done, Clear, Search } from '@material-ui/icons';
import axios from 'axios';
import Addstaffpopup from '../addstaffpopup';
import Table from "@material-ui/core/Table";
import MaterialTable from "material-table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
function StaffDetailsGride() {
    const [dataRow, setDataRow] = useState([
        {
            title: "Dr.", firstName: "fn", lastName: "ln", gender: "fe", licenNo: "123",
            email: "aaaaaaaaaabc@gmail.com", cellNumber: "07687", specialty: "Cardiology", practicingSince: "1999"
        },
        {
            title: "Mr.", firstName: "fn", lastName: "ln", gender: "fe", licenNo: "123",
            email: "aaaaaaaaaaaabc@gmail.com", cellNumber: "1234567890", specialty: "Cardiology", practicingSince: "1999"
        },
        {
            title: "Mr.", firstName: "fn", lastName: "ln", gender: "fe", licenNo: "123",
            email: "aaaaaaaaaaaabc@gmail.com", cellNumber: "1234567890", specialty: "Cardiology", practicingSince: "1999"
        },
        {
            title: "Mr.", firstName: "fn", lastName: "ln", gender: "fe", licenNo: "123",
            email: "aaaaaaaaaaaabc@gmail.com", cellNumber: "1234567890", specialty: "Cardiology", practicingSince: "1999"
        },
        {
            title: "Mr.", firstName: "fn", lastName: "ln", gender: "fe", licenNo: "123",
            email: "aaaaaaaaaaaabc@gmail.com", cellNumber: "1234567890", specialty: "Cardiology", practicingSince: "1999"
        },
        {
            title: "Mr.", firstName: "fn", lastName: "ln", gender: "fe", licenNo: "123",
            email: "aaaaaaaaaaaabc@gmail.com", cellNumber: "1234567890", specialty: "Cardiology", practicingSince: "1999"
        },
        {
            title: "Mr.", firstName: "fn", lastName: "ln", gender: "fe", licenNo: "123",
            email: "aaaaaaaaaaaabc@gmail.com", cellNumber: "1234567890", specialty: "Cardiology", practicingSince: "1999"
        },
    ]);
    const [specialtyList, setSpecialtiesList] = useState([]);
    const [search, setSearch] = useState("");
    // for pagination component
    const [paginationRow, setPaginationRow] = useState(5);
    const [page, setPage] = React.useState(2);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);


    React.useEffect(() => {
        // fetchServiceType();
        // fetchProfilePicture();
        fetchSpecialtiesList();
    }, []);

    const fetchServiceType = () => {

    }
    const fetchProfilePicture = () => {

    }
    const fetchSpecialtiesList = async () => {
        let specialtiesConfigure = {
            method: "get",
            url: process.env.REACT_APP_BEATS_GET_SPECIALTIES_API,
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("idToken"),
            },
        };
        try {
            let specialties = await axios(specialtiesConfigure);
            //ex : {data: [{}]}
            let specialtiesData = [];
            if (specialties.data.length > 0) {
                specialties.data.map((item, index) => {
                    if (item != null) {
                        let specialtyObj = {
                            value: item.specialty_name,
                            label: item.specialty_name,
                            visit_reason: item.visit_reason,
                        }
                        specialtiesData.push(specialtyObj);
                    }
                })
            }
            setSpecialtiesList(specialtiesData);
        } catch (error) {
            console.log("my profile specialty data not load", error);
        }
    }

    const CustomPagination = () => {
        const pages = [5, 10, 20, 30, 40];
        const MenuItemList = pages.map((item, index) => (<MenuItem value={item}>{item}</MenuItem>));
        const handleChange = (event) => {
            setPaginationRow(event.target.value);
        };
        return (
            <FormControl>
                <InputLabel id="demo-simple-select-label">row</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={paginationRow}
                    label="row"
                    onChange={handleChange}
                >
                    {MenuItemList}
                </Select>
            </FormControl>
        );
    }


    const Pagination = () => {

        const handleChangePage = (event, newPage) => {
            setPage(newPage);
        };

        const handleChangeRowsPerPage = (event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
        };
        return (
            <TablePagination
                component="div"
                count={100}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        );
    }

    const AddStaffRenderDataRowToStaffDetailsGride = () => {
        const pages = [5, 10, 20, 30, 40];
        const MenuItemList = pages.map((item, index) => (<MenuItem value={item}>{item}</MenuItem>));
        const handleChange = (event) => {
            setPaginationRow(event.target.value);
        };
        const styles = {
            grideSize: {
                maxHeight: '100px',
            },

        };
        return (
            <Grid item xs={12}>{
                dataRow.map((item, index) => {
                    return (
                        <Grid container spacing={6} key={index} style={styles.grideSize}>
                            <Grid item xs={1} >
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={paginationRow}
                                  
                                    onChange={handleChange}
                                >
                                    {MenuItemList}
                                </Select>
                            </Grid>
                            <Grid item xs={1}>
                                {item.firstName}
                            </Grid>
                            <Grid item xs={1}>
                                {item.lastName}
                            </Grid>
                            <Grid item xs={1}>
                                {item.gender}
                            </Grid>
                            <Grid item xs={1}>
                                {item.licenNo}
                            </Grid>
                            <Grid item xs={3}>
                                {item.email}
                            </Grid>
                            <Grid item xs={1} >
                                {item.cellNumber}
                            </Grid>
                            <Grid item xs={1}>
                                {item.specialty}
                            </Grid>
                            <Grid item xs={1}>
                                {item.practicingSince}
                            </Grid>
                            <Grid item xs={1}>
                                <Edit onClick={() => { alert("edit"); }} />
                                <Delete onClick={() => { alert("delete"); }} />
                            </Grid>
                            <Grid item xs={12} justifyContent="center">
                                <Grid container>
                                    <Grid item xs={12} > {/*<hr />*/} </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                })
            }
            </Grid>
        )

    }

    const RenderDataRowToStaffDetailsGride = () => {
        const styles = {
            grideSize: {
                maxHeight: '100px',
            },

        };
        return (
            <Grid item xs={12} spacing={6}>{
                dataRow.map((item, index) => {
                    return (
                        <Grid container spacing={6} key={index} style={styles.grideSize}>
                            <Grid item xs={1} >
                                {item.title}
                            </Grid>
                            <Grid item xs={1}>
                                {item.firstName}
                            </Grid>
                            <Grid item xs={1}>
                                {item.lastName}
                            </Grid>
                            <Grid item xs={1}>
                                {item.gender}
                            </Grid>
                            <Grid item xs={1}>
                                {item.licenNo}
                            </Grid>
                            <Grid item xs={3}>
                                {item.email}
                            </Grid>
                            <Grid item xs={1} >
                                {item.cellNumber}
                            </Grid>
                            <Grid item xs={1}>
                                {item.specialty}
                            </Grid>
                            <Grid item xs={1}>
                                {item.practicingSince}
                            </Grid>
                            <Grid item xs={1}>
                                <Edit onClick={() => { alert("edit"); }} />
                                <Delete onClick={() => { alert("delete"); }} />
                            </Grid>
                            <Grid item xs={12} justifyContent="center">
                                <Grid container>
                                    <Grid item xs={12} > {/*<hr />*/} </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                })
            }
            </Grid>
        )

    }
    return (
        <Grid container spacing={6}>
            {/**Header row search.add staff button*/}
            <Grid item xs={12} spacing={6}>
                <Grid container  >
                    <Grid items xs={6}>
                        <h6> Staff Details (to assign to patients)</h6>
                    </Grid>
                    <Grid items xs={3}>
                         <Addstaffpopup />
                        {/*<Button
                            size="large"
                            variant="contained"
                            style={{ backgroundColor: "red" }}
                            onClick={() => { alert("click") }}
                        >
                            <h style={{ fontSize: "14px", color: "white", }}>Add Staff</h>
                        </Button>*/}
                    </Grid>
                    <Grid items xs={3}>
                        <FormControl variant="standard">
                            <InputLabel htmlFor="input-with-icon-adornment"></InputLabel>
                            <Input
                                onChange={(e) => { setSearch(e.target.value); console.log(e.target.value); }}
                                value={search}
                                id="input-with-icon-adornment"
                                placeholder="Search"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="start">
                                        <Clear onClick={() => { setSearch(""); }} />
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                    </Grid>
                </Grid>

            </Grid>


 <Grid item xs={12} sm={12} className="custom-table">
                        <TableContainer component={Paper}>
                          <Table
                         
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell> 
                                 <TableCell>Gender</TableCell> 
                                 <TableCell> License No. / NPI </TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Cell Number</TableCell>
                                <TableCell> Specialty </TableCell> 
                                <TableCell>Practicing Since</TableCell> 
                                 <TableCell>Action</TableCell> 
                              </TableRow>
                            </TableHead>
                            <TableBody>
                             
                                <TableRow  style={{ position: "relative" }} >  
                                 <TableCell > Dr.   </TableCell> 
                                  <TableCell>   Raju  </TableCell> 
                                   <TableCell>son</TableCell>
                                  <TableCell>Male</TableCell>
                                  <TableCell>  W098634  </TableCell>
                                  <TableCell>  Rajuson@gmail.com  </TableCell> 
                                   <TableCell>    9886544350 </TableCell> 
                                    <TableCell>Cardiology</TableCell> 
                                     <TableCell>1982</TableCell> 
                                  <TableCell className="tbl-btn-wdith">
                                   
                                    
                                   <Edit onClick={() => { alert("edit"); }} />
                                <Delete onClick={() => { alert("delete"); }} />
                                   
                                  </TableCell>
                                  
                                </TableRow>
                            
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Grid>

           
            <Grid item xs={12} direction="row"
                justifyContent="flex-end"
                alignItems="flex-start" >
                <Pagination />
            </Grid>

        </Grid>
    )
}
export default StaffDetailsGride