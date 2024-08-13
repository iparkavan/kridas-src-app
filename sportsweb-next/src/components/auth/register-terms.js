import { Box } from "@chakra-ui/react";
import ModalWithClose from "../ui/modal/modal-with-close";
import Terms from "../policies/terms";

const RegisterTerms = (props) => {
  return (
    <ModalWithClose {...props} title="Kridas Terms of Service" size="lg">
      <Box backgroundColor={"white"} mt={4}>
        <Terms />
      </Box>
    </ModalWithClose>
  );
};

export default RegisterTerms;
