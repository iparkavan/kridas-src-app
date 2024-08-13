import axios from "../utils/axios";

class SponsorInfoService{
async createSponsorInfo(values){

 const response = await axios.post("/sponsor_info", values);
 return response.data;
}

async getSponsorInfoById(sponsor_id){

 const response = await axios.get(`/sponsor_info/get/${sponsor_id}`)
 return response.data.data;
}

 async getSponsorInfo(){

 const response = await axios.get("/sponsor_info/getAll")
  return response.data;
}


}

export default new SponsorInfoService();