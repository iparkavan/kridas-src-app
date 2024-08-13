import axios from 'axios';
const Specialties_List_fetch = async () => {
    let specialtiesData = [];
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
    } catch (error) {
        console.log("my profile specialty data not load", error);
    }
    return specialtiesData;
};

const Title_List = () => { return ['Dr.', 'Prof.', 'Mr.', 'Ms.', 'Mrs.']; };
const Gender_List = () => { return ["Male", "Female"]; };

module.exports = { Specialties_List_fetch, Title_List, Gender_List, Gender_List };