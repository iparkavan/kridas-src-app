import { useMutation, useQuery, useQueryClient } from "react-query";
import profileVerificationService from "../services/profile-verification-service";

const useCreateProfileVerification = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return profileVerificationService.verifyProfile(data);
    },
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(["verification", variables.id]);
      },
    }
  );
};

const useProfileVerification = (type, id) => {
  return useQuery(["verification", id], () =>
    profileVerificationService.getVerifyProfile(type, id)
  );
};

export { useCreateProfileVerification, useProfileVerification };
