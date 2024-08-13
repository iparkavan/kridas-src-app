import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import useHttp from "../../../hooks/useHttp";
import MUIDataTable from "mui-datatables";
import VisibilityIcon from "@material-ui/icons/Visibility";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/styles";
import EventConfig from "../config/EventConfig";
import moment from "moment";
// import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme) => ({
  listIcon: {
    width: "35px",
  },
  approveColor: {
    color: "white",
    background: "green",
    padding: "4px 8px 3px 3px",
  },
  pendingColor: {
    color: "white",
    background: "red",
    padding: "4px 5px 3px 3px",
  },
}));

const EventList = () => {
  const classes = useStyles();
  const history = useHistory();
  const [eventList, setEventList] = useState([]);
  const { isLoading, sendRequest } = useHttp();
  const [, setClear] = useState({});
  const [feature, setFeature] = useState();
  const [reload, setReload] = useState(false);
  const label = { inputProps: { "aria-label": "Switch demo" } };

  // const [tableData, setTabledata] = useState([]);
  // const [count, setCount] = useState(0);
  // const [pageNumber, setPageNumber] = useState(0);

  // var object = {
  //   pagelimit: 10,
  //   pagenumber: pageNumber,
  // };

  // useEffect(() => {
  //   const config = EventConfig.searchEvent(object);
  //   const transformDate = (data) => {
  //     setTabledata(data?.content);
  //   };
  //   sendRequest(config, transformDate);
  //   return () => {
  //     setClear({});
  //   };
  // }, [sendRequest, reload]);

  useEffect(() => {
    const config = EventConfig.getAllEvent();
    const transformDate = (data) => {
      let resultDataArray = [];
      let resultData = data;
      resultData.map((r) => {
        var obj = {};
        obj["event_id"] = r.event_id;
        obj["event_name"] = r.event_name;
        obj["event_startdate"] = r.event_startdate;
        obj["event_enddate"] = r.event_enddate;
        obj["category_name"] = r.category_name;
        obj["is_featured"] = r.is_featured;

        let status;
        if (r.is_featured === true && r.is_featured !== undefined) {
          status = "Featured";
        } else {
          status = "Not Featured";
        }
        obj["is_featured"] = status;
        resultDataArray.push(obj);
        return null;
      });
      setEventList(resultDataArray);
    };
    sendRequest(config, transformDate);
    return () => {
      setClear({});
    };
  }, [sendRequest, reload]);

  const viewRowHandler = (rowData, action) => {
    history.push(`/events/view/${rowData[0]}`);
  };

  // const changePage = async (pagenumber, rowsPerPage) => {
  //   debugger;
  //   var object = {
  //     pagelimit: rowsPerPage,
  //     pagenumber: pagenumber,
  //   };

  //   const config = EventConfig.searchEvent(object);
  //   const transformData = (data) => {
  //     setTabledata(data?.content);
  //     setCount(data?.totalCount);
  //     setPageNumber(data?.totalPage);
  //     console.log("data", data);
  //   };
  //   sendRequest(config, transformData);

  //   setReload(!reload);
  // };
  // console.log("tabledata", tableData);

  const handleChange = (e, rowData) => {
    let body = {
      is_featured: e.target.checked,
      event_id: rowData[0],
    };

    const config = EventConfig.updateEventIsFeature(body);
    const transformData = (data) => {
      setFeature(data);
      setReload(!reload);
    };
    sendRequest(config, transformData);
  };

  const columns = [
    {
      name: "event_id",
      label: "Event ID",
      options: {
        filter: false,
        sort: false,
        display: false,
      },
    },
    {
      name: "event_name",
      label: "Event Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "event_startdate",
      label: "Start Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return <>{moment(new Date(value)).format("YYYY-MM-DD")}</>;
        },
      },
    },
    {
      name: "event_enddate",
      label: "End Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return <>{moment(new Date(value)).format("YYYY-MM-DD")}</>;
        },
      },
    },
    {
      name: "category_name",
      label: "Category Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "is_featured",
      label: "Featured",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (data, tableMeta, value) => {
          return (
            <>
              {/* <Checkbox
                name="is_featured"
                borderColor="primary.600"
                checked={data === true ? true : false}
                onChange={(e) => handleChange(e, tableMeta.rowData)}
              /> */}
              <Switch
                {...label}
                name="is_featured"
                checked={data === "Featured" ? true : false}
                onChange={(e) => handleChange(e, tableMeta.rowData)}
              />
            </>
          );
        },
      },
    },
    {
      name: "Options",
      options: {
        sort: false,
        filter: false,
        searchable: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <>
              <Tooltip title="View" className={classes.listIcon}>
                <IconButton
                  aria-label="View"
                  size="small"
                  onClick={() => viewRowHandler(tableMeta.rowData)}
                >
                  <VisibilityIcon style={{ fontSize: "medium" }} />
                </IconButton>
              </Tooltip>
            </>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    search: true,
    print: false,
    download: false,
    viewColumns: false,
    selectableRows: "none",
    // sorting: true,
    // print: false,
    // download: false,
    // setRowProps: (row) => {
    //   if (row[0] === null) {
    //     return {
    //       style: { background: "#e6f3ff" },
    //     };
    //   }
    // },
    // filter: false,
    // fixedHeader: true,
    // caseSensitive: false,
    // fixedHeader: true,
    // selectableRows: false,
    // customSearch: false,
    // pagination: true,
    // exportButton: false,
    // exportAllData: false,
    // elevation: 4,
    // addRowPosition: "first",
    // fontSize: "10px",
    // viewColumns: false,
    // onRowsDelete: false,
    // serverSide: true,
    // count: count,
    // page: pageNumber,
    // onTableChange: (action, tableState) => {
    //   debugger;
    //   console.log("action", action);
    //   console.log("tableState", tableState);

    //   if (action === "changeRowsPerPage") {
    //     return changePage(tableState?.page, tableState?.rowsPerPage);
    //   }
    // },

    textLabels: {
      body: {
        noMatch: isLoading ? "Loading..." : "Sorry , No Matching Records Found",
      },
    },
    setTableProps: () => {
      return {
        size: "small",
      };
    },
  };

  return (
    <>
      <div>
        <MUIDataTable data={eventList} columns={columns} options={options} />
      </div>
    </>
  );
};

export default EventList;

// import { useEffect, useState } from "react";
// import { useHistory } from "react-router";
// import useHttp from "../../../hooks/useHttp";
// import MUIDataTable from "mui-datatables";
// import VisibilityIcon from "@material-ui/icons/Visibility";
// import IconButton from "@material-ui/core/IconButton";
// import Tooltip from "@material-ui/core/Tooltip";
// import { makeStyles } from "@material-ui/styles";
// import EventConfig from "../config/EventConfig";
// import moment from "moment";
// import Checkbox from "@material-ui/core/Checkbox";

// const useStyles = makeStyles((theme) => ({
//   listIcon: {
//     width: "35px",
//   },
//   approveColor: {
//     color: "white",
//     background: "green",
//     padding: "4px 8px 3px 3px",
//   },
//   pendingColor: {
//     color: "white",
//     background: "red",
//     padding: "4px 5px 3px 3px",
//   },
// }));

// const EventList = () => {
//   const classes = useStyles();
//   const history = useHistory();
//   const [eventList, setEventList] = useState([]);
//   const { isLoading, sendRequest } = useHttp();
//   const [, setClear] = useState({});
//   const [feature, setFeature] = useState();
//   const [reload, setReload] = useState(false);
//   const [tableData, setTabledata] = useState([]);
//   const [count, setCount] = useState(0);
//   const [pageNumber, setPageNumber] = useState(0);

//   useEffect(() => {
//     const config = EventConfig.searchEvent();
//     const transformDate = (data) => {
//       setTabledata(data?.content);
//     };
//     sendRequest(config, transformDate);
//     return () => {
//       setClear({});
//     };
//   }, [sendRequest, reload]);

//   // useEffect(() => {
//   //   const config = EventConfig.getAllEvent();
//   //   const transformDate = (data) => {
//   //     setEventList(data);
//   //   };
//   //   sendRequest(config, transformDate);
//   //   return () => {
//   //     setClear({});
//   //   };
//   // }, [sendRequest, reload]);

//   const viewRowHandler = (rowData, action) => {
//     history.push(`/events/view/${rowData[0]}`);
//   };

//   const changePage = async (pagenumber, rowsPerPage) => {
//     var object = {
//       size: rowsPerPage,
//       page: pagenumber,
//     };

//     const config = EventConfig.searchEvent(object);
//     const transformData = (data) => {
//       setTabledata(data?.content);
//       setCount(data?.totalCount);
//       setPageNumber(pagenumber);
//       console.log("data", data);
//     };
//     sendRequest(config, transformData);

//     setReload(!reload);
//   };

//   const handleChange = (e, rowData) => {
//     let body = {
//       is_featured: e.target.checked,
//       event_id: rowData[0],
//     };

//     const config = EventConfig.updateEventIsFeature(body);
//     const transformData = (data) => {
//       setFeature(data);
//       setReload(!reload);
//     };
//     sendRequest(config, transformData);
//   };

//   const columns = [
//     {
//       name: "event_id",
//       label: "Event ID",
//       options: {
//         filter: false,
//         sort: false,
//         display: false,
//       },
//     },
//     {
//       name: "event_name",
//       label: "Event Name",
//       options: {
//         filter: true,
//         sort: true,
//       },
//     },
//     {
//       name: "event_startdate",
//       label: "Start Date",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => {
//           return <>{moment(new Date(value)).format("YYYY-MM-DD")}</>;
//         },
//       },
//     },
//     {
//       name: "event_enddate",
//       label: "End Date",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (value) => {
//           return <>{moment(new Date(value)).format("YYYY-MM-DD")}</>;
//         },
//       },
//     },
//     {
//       name: "category_name",
//       label: "Category Name",
//       options: {
//         filter: true,
//         sort: true,
//       },
//     },
//     {
//       name: "is_featured",
//       label: "Featured",
//       options: {
//         filter: true,
//         sort: true,
//         customBodyRender: (data, tableMeta) => {
//           return (
//             <>
//               <Checkbox
//                 name="is_featured"
//                 borderColor="primary.600"
//                 checked={data === true ? true : false}
//                 onChange={(e) => handleChange(e, tableMeta.rowData)}
//               />
//             </>
//           );
//         },
//       },
//     },
//     {
//       name: "Options",
//       options: {
//         sort: false,
//         filter: false,
//         searchable: false,
//         customBodyRender: (value, tableMeta, updateValue) => {
//           return (
//             <>
//               <Tooltip title="View" className={classes.listIcon}>
//                 <IconButton
//                   aria-label="View"
//                   size="small"
//                   onClick={() => viewRowHandler(tableMeta.rowData)}
//                 >
//                   <VisibilityIcon style={{ fontSize: "medium" }} />
//                 </IconButton>
//               </Tooltip>
//             </>
//           );
//         },
//       },
//     },
//   ];

//   const options = {
//     filter: true,
//     search: true,
//     print: false,
//     download: false,
//     viewColumns: false,
//     selectableRows: "none",

//     fixedHeader: true,
//     pagination: true,
//     serverSide: true,
//     count: count,
//     page: pageNumber,
//     onTableChange: (action, tableState) => {
//       debugger;
//       console.log("action", action);
//       console.log("tableState", tableState);

//       if (action === "changeRowsPerPage") {
//         return changePage(tableState?.page, tableState?.rowsPerPage);
//       } else if (action === "changePage") {
//         return changePage(tableState?.page, tableState?.rowsPerPage);
//       }
//     },

//     textLabels: {
//       body: {
//         noMatch: isLoading ? "Loading..." : "Sorry , No Matching Records Found",
//       },
//     },
//     setTableProps: () => {
//       return {
//         size: "small",
//       };
//     },
//   };

//   return (
//     <>
//       <div>
//         <MUIDataTable data={tableData} columns={columns} options={options} />
//       </div>
//     </>
//   );
// };

// export default EventList;
