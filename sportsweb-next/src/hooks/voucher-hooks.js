import { useQuery } from "react-query";
import voucherService from "../services/voucher-service";

const useVoucherById = (voucherId) => {
  return useQuery(
    ["voucher", voucherId],
    () => voucherService.getVoucherById(voucherId),
    {
      enabled: !!voucherId,
    }
  );
};

const useSearchVouchers = () => {
  return useQuery(["vouchers"], () => voucherService.searchVouchers());
};

export { useVoucherById, useSearchVouchers };
