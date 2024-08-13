import { useQuery } from "react-query";
import sportsService from "../services/sports-service";

const useSports = (config = {}, showGeneral = false) => {
  const { select: customSelect, ...otherConfig } = config;
  return useQuery(["sports"], () => sportsService.getAllSports(), {
    select: (data) => {
      const customData = showGeneral
        ? data
        : data.filter((sport) => sport["sports_code"] !== "SPOR26");
      if (customSelect) {
        return customSelect(customData);
      }
      return customData;
    },
    ...otherConfig,
  });
};

const useEnabledSports = () => {
  return useQuery(["enabled-sports"], () => sportsService.getEnabledSports());
};

export { useSports, useEnabledSports };
