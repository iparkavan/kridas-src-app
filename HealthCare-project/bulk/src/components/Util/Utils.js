const Date_format = (REGION_NAME) => {
    return ((process.env.REACT_APP_REGION == REGION_NAME) ? "dd/mm/yyyy" : "mm/dd/yyyy");
}

const Date_time_format = (year, month, day, hour, minutes) => {
    const monthList = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var amPM = (hour <= 12) ? "am" : "pm";
    var monthName = "";
    if (month != "") {
        monthName = monthList[month + 1];
    } else {
        monthName = month + 1;
    }
    var hours = hour % 12;
    hours = hours ? hours : 12; //hour 0 should be hours = 12
    hours = (hours.toString().length != 2) ? ("0" + hours) : hours;
    minutes = (minutes.toString().length != 2) ? ("0" + minutes) : minutes;
    var formated_date_time = monthName + " " + day + " " + year + " " + hours + ":" + minutes + amPM;
    return formated_date_time;
}

const SortedPatientNoteDataList = (privious_patient_note_data_arrayObj) => {
    /*** [* {by: "prasanna",desc: "savindu added updated",id: 372,time: "2022-02-28T07:09:40.000Z"}* ]*/
    var data = privious_patient_note_data_arrayObj;
    var sortedCurrentPatientNoteData = [];

    var timeFromApiArr = [];
    var timeKeyArr = [];
    var idArr = [];
    var descArr = [];
    var byArr = [];

    //secont way
    for (var i = 0; i < data.length; i++) {
        timeFromApiArr[i] = data[i].time;
        timeKeyArr[i] = new Date(data[i].time).getTime();
        idArr[i] = data[i].id;
        descArr[i] = data[i].desc;
        byArr[i] = data[i].by;
    }

    var timeKeyArrSortByDecendingOrderArr = timeKeyArr.sort().reverse();
    var sameIndexFoundFromTimeKeyArrSortByDecendingOrderArr = [];

    for (var i = 0; i < timeKeyArrSortByDecendingOrderArr.length; i++) {
        for (var j = 0; j < timeKeyArr.length; j++) {
            if (timeKeyArr[i] == timeKeyArrSortByDecendingOrderArr[j]) {
                sameIndexFoundFromTimeKeyArrSortByDecendingOrderArr[i] = j;
            }
        }
    }

    for (var j = 0; j < sameIndexFoundFromTimeKeyArrSortByDecendingOrderArr.length; j++) {
        var currentArrayIndex = sameIndexFoundFromTimeKeyArrSortByDecendingOrderArr[j];
        let obj = { 'id': idArr[currentArrayIndex], 'time': timeFromApiArr[currentArrayIndex], 'desc': descArr[currentArrayIndex], 'by': byArr[currentArrayIndex] };
        sortedCurrentPatientNoteData[j] = obj;
    }

    /*
    var sortedDataWithKeyValuePair = [];
    var newDataArrayWithKeyValuePair = [];
    
        //first way not working
        data.map((item) => {
            let key = new Date(item.time).getTime().toString();//16666666000000
            let obj = { 'id': item.id, 'time': item.time, 'desc': item.desc, 'by': item.by };
            newDataArrayWithKeyValuePair[key] = obj;
        });
    
        sortedDataWithKeyValuePair = newDataArrayWithKeyValuePair.sort().reverse();
        sortedDataWithKeyValuePair.map((item, index) => {
            console.log(item);
        });
    */


    return sortedCurrentPatientNoteData;
}

module.exports = {
    Date_format,
    Date_time_format,
    SortedPatientNoteDataList
};