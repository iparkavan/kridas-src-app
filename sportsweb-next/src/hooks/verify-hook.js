import { useQuery } from "react-query";
import verifyService from "../services/verify-service";

const useVerifyByUserId = (userId) => {
  return useQuery(["profile-verification", userId], () =>
    verifyService.getVerify(userId)
  );
};

export default useVerifyByUserId;
