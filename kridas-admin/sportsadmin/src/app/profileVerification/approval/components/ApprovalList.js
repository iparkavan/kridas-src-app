// import { useState, useEffect } from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import MUIDataTable from "mui-datatables";
// import useHttp from "../../../../hooks/useHttp";
// import { useHistory } from 'react-router-dom';
// import ApprovalConfig from "../config/ApprovalConfig";
// import moment from 'moment'
// import IconButton from "@material-ui/core/IconButton";
// import Tooltip from "@material-ui/core/Tooltip";
// import VisibilityIcon from "@material-ui/icons/Visibility";



// const useStyles = makeStyles((theme) => ({
//     error: {
//         color: "red",
//     },
//     buttonContainer: {
//         textAlign: "right",
//         paddingBottom: "2%",
//         marginRight: "5px"
//     },
//     iconSpace: {
//         width: "35px"
//     },
//     dialog: {
//         padding: "20px"
//     },
//     dialogbtn: {
//         paddingRight: "30px"
//     },
//     btnContainer: {
//         display: "flex",
//         flexDirection: "row"
//     },
//     userTab: {
//         width: "92%",
//         marginLeft: '13px',
//       },
//     table : {
//         width: "95%",
//         marginTop : "0px"
//     },
//     approveColor : {
//         color : "white",
//         background : 'green',
//         padding:"4px 8px 3px 3px",
//     },
//     rejectColor : {
//         color : "white",
//         background:"red",
//         padding:"4px 5px 3px 3px",
//     },
//     submitColor : {
//         color : "white",
//         background:"grey",
//         padding:"4px 15px 3px 3px",

//     }

// }));

// const options = {
//     filter: true,
//     search: true,
//     print: false,
//     download: false,
//     viewColumns: false,
//     selectableRows: "none",
//     setTableProps: () => {
//         return {
//             size: "small",
//         };
//     },
// };


// function ApprovalList() {
//     let history = useHistory();
//     const classes = useStyles();
//     const { sendRequest } = useHttp();
//     const [, setClear] = useState({});
//     const [approvalList, setapprovalList] = useState([]);
//     const columns = [
//         {
//             name: "company_id",
//             label: "Type",
//             options: {
//                 filter: false,
//                 sort: false,
//                 customBodyRender: (value) => {
//                     return (
//                         <>
//                             {value === null ? "User" : "Company"}
//                         </>
//                     )
//                 }
//             },

//         },
//         {
//             name: "applied_status",
//             label: "Status",
//             options: {
//                 filter: true,
//                 sort: false,
               
//                 customBodyRender: (value, tableMeta, updateValue) => {
//                     return (      
//                             <span className={value === "Submit" ? classes.submitColor : value === "Approve" ? classes.approveColor : classes.rejectColor}> 
//                                {value === "Submit" ? "Submit" : value === "Approve" ? "Approve" : "Rejected" }
//                             </span>                       
//                     )
//                 }

//             },
//         },
//         {
//             name: "user_id",
//             options: {
//                 filter: false,
//                 sort: false,
//                 display: false,
//             },
//         },
//         {
//             name: "profile_verification_id",
//             options: {
//                 filter: false,
//                 sort: false,
//                 display: false
//             },
//         },
//         {
//             name: "applied_date",
//             label: "Applied Date",
//             options: {
//                 filter: false,
//                 sort: false,
//                 searchable : false,
//                 customBodyRender: (value) => {
//                     return (
//                         <>
//                             {moment(new Date(value)).format("YYYY-MM-DD")}
//                         </>
//                     )
//                 }
//             },
//         },
//         {
//             name: "Options",
//             options: {
//                 sort: false,
//                 filter: false,
//                 searchable: false,
//                 customBodyRender: (value, tableMeta, updateValue) => {
//                     return (
//                         <>
//                             <div>
//                                 <Tooltip title="View" className={classes.iconSpace}>
//                                     <IconButton
//                                         aria-label="View"
//                                         size="small"
//                                         onClick={() => viewRowHandler(tableMeta.rowData)}

//                                     >
//                                         <VisibilityIcon style={{ fontSize: "medium" }} />
//                                     </IconButton>
//                                 </Tooltip>

//                             </div>
//                         </>
//                     );
//                 },
//             },
//         },

//     ];

//     const viewRowHandler = (rowData, action) => {
//         // history.push(`/profile-verification/approval/${rowData[3]}/view/${rowData[0] === null ? "user" : "company"}/${rowData[0] === null ? rowData[2] : rowData[0]}`);
//         history.push(`/profile-verification/${rowData[3]}/view/${rowData[0] === null ? "user" : "company"}/${rowData[0] === null ? rowData[2] : rowData[0]}`);
//     };

//     useEffect(() => {
//         const config = ApprovalConfig.getAll();
//         const transformDate = (data) => {
//         let resultDataArra = [];
//         let resultData = data.data;
//             resultData.map((r)=>{
//                 var obj = {};
//                 obj["applied_date"] = r.applied_date;
//                 obj["company_id"] = r.company_id;
//                 obj["profile_verification_id"] = r.profile_verification_id;
//                 obj["status_change_date"] = r.status_change_date;
//                 obj["user_id"] = r.user_id;
//                 obj["verification_comments"] = r.verification_comments;

//                 let status = "Submit";
//                 if(r.applied_status==='R'){
//                     status = 'Rejected';  
//                 }else if(r.applied_status==='A'){
//                     status = 'Approve';
//                 }else{
//                     status = 'Submit';
//                 }
//                 obj["applied_status"] = status;
//                 resultDataArra.push(obj);

//                 return null;

//             }
//             )
//             setapprovalList(resultDataArra);
        
//         };
//         sendRequest(config, transformDate);
//         return () => {
//             setClear({});
//         }
//     }, [sendRequest]);

    
    
//     return (
//         <>
//         {/* {
//             approvalList.map((a)=>{
//                return  a.company_id === null ? <UserList /> : ""
//             })
//         } */}
//         {/* <MUIDataTable 
//             className={classes.table} 
//             data={approvalList} 
//             columns={columns} 
//             options={options} /> */}

//         </>
//     );
// };

// export default ApprovalList;
