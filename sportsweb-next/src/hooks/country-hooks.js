import { useQuery } from "react-query";
import countryService from "../services/country-service";

const useCountries = () => {
  return useQuery(["countries"], () => countryService.getAllCountries(), {
    select: (data) => data.data,
  });
};

const useCountryByISOCode = (code) => {
  return useQuery(
    ["country", code],
    () => countryService.getCountryByISOCode(code),
    {
      enabled: !!code,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );
};

const useCountryByCode = (code) => {
  return useQuery(
    ["country", code],
    () => countryService.getCountryByCode(code),
    {
      enabled: !!code,
    }
  );
};

const useAllCities = () => {
  return useQuery(["cities"], () => countryService.getAllCities(), {
    select: (data) => data.data,
  });
};
export { useCountries, useCountryByISOCode, useCountryByCode, useAllCities };
