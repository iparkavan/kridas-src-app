import { useQuery } from "react-query";
import lookupTableService from "../services/lookup-table-service";

const useLookupTable = (lookupType, options = {}) => {
  return useQuery(
    ["lookupType", lookupType],
    () => lookupTableService.getLookupValuesByType(lookupType),
    {
      ...options,
    }
  );
};

export { useLookupTable };
