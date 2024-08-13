import { useQuery, useMutation, queryClient } from "react-query";
import PageSponsorInfoService from "../services/page-sponsor-info-service";

const useCreatePageSponsorInfo = () => {
  return useMutation((values) => {
    PageSponsorInfoService.createPageSponsorInfo(values);
  });
};

const usePageSponsorInfoById = (sponsor_id) => {
return useQuery(["page_sponsor_info",sponsor_id],()=>PageSponsorInfoService.getPageSponsorInfoById(sponsor_id))
}

const usePageSponsorInfo = () => {
return useQuery(["page_sponsor_info"],()=>PageSponsorInfoService.getPageSponsorInfo())
}

export {useCreatePageSponsorInfo,usePageSponsorInfoById,usePageSponsorInfo}