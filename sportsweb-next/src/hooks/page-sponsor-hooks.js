import { useQuery } from "react-query";
import pageSponsorService from "../services/page-sponsor-service";

const usePageSponsors = (pageId) => {
  return useQuery(
    ["page-sponsors", pageId],
    () => pageSponsorService.getSponsorByPageId(pageId),
    {
      enabled: !!pageId,
    }
  );
};

export { usePageSponsors };
