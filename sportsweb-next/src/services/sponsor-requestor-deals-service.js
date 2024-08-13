import axios from "../utils/axios";

class SponsorRequestorDealsService{
async createSponsorRequestorDeal(values){

 const response = await axios.post("/sponsor-requestor-deals", values);
 return response.data;
}

async getSponsorRequestorDealById(sponsor_requestor_id){

 const response = await axios.get(`/sponsor-requestor-deals/get/${sponsor_requestor_id}`)
 return response.data.data;
}

 async getAllSponsorRequestorDeals(){

 const response = await axios.get("/sponsor-requestor-deals/getAll")
  return response.data;
}


}

export default new SponsorRequestorDealsService();