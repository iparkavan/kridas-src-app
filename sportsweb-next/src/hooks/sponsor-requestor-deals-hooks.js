import axios from "../utils/axios";
import { useQuery, useMutation, queryClient } from "react-query";
import SponsorRequestorDealsService from "../services/sponsor-requestor-deals-service";

const useCreateSponsorRequestorDeal = () => {
  return useMutation((values) => {
    SponsorRequestorDealsService.createSponsorRequestorDeal(values);
  });
};

const useSponsorRequestorDealById = (sponsor_requestor_id) => {
return useQuery(["sponsor_requestor_info",sponsor_requestor_id],()=>SponsorRequestorDealsService.getSponsorRequestorDealById(sponsor_requestor_id))
}

const useSponsorRequestorDeal = () => {
return useQuery(["sponsor_requestor_info"],()=>SponsorRequestorDealsService.getAllSponsorRequestorDeals())
}

export {useCreateSponsorRequestorDeal,useSponsorRequestorDealById,useSponsorRequestorDeal}