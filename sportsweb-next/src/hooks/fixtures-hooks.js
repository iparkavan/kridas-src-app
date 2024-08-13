import { useMutation } from "react-query";
import fixturesService from "../services/fixtures-service";

const useGenerateFixtures = () => {
  // const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      return fixturesService.generateFixtures(data);
    }
    // {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(["page-event"]);
    //   },
    // }
  );
};
export { useGenerateFixtures };
