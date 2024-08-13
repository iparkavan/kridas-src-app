import axios from "../utils/axios";

class PageSponsorInfoService{
async createPageSponsorInfo(values){

 const response = await axios.post("/company-sponsor-info", values);
 return response.data;
}

async getPageSponsorInfoById(sponsor_id){

 const response = await axios.get(`/company-sponsor-info/get/${sponsor_id}`)
 return response.data.data;
}

 async getPageSponsorInfo(){

 const response = await axios.get("/company-sponsor-info/getAll")
  return response.data;
}

}

export default new PageSponsorInfoService();