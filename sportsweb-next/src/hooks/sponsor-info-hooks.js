import axios from "../utils/axios";
import { useQuery, useMutation, queryClient } from "react-query";
import SponsorInfoService from "../services/sponsor-info-service";

const useCreateSponsorInfo = () => {
  return useMutation((values) => {
    SponsorInfoService.createSponsorInfo(values);
  });
};

const useSponsorInfoById = (sponsor_id) => {
return useQuery(["sponsor_info",sponsor_id],()=>SponsorInfoService.getSponsorInfoById(sponsor_id))
}

const useSponsorInfo = () => {
return useQuery(["sponsor_info"],()=>SponsorInfoService.getSponsorInfo())
}

export {useCreateSponsorInfo,useSponsorInfoById,useSponsorInfo}