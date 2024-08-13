import { useQuery } from "react-query";
import locationService from "../services/location-service";

const useLocation = () => {
  return useQuery(["location"], () => locationService.getLocation(), {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
};

export { useLocation };
