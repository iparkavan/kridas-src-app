import { Box } from "@chakra-ui/react";
import ModalWithClose from "../ui/modal/modal-with-close";
import PrivacyPolicy from "../policies/privacy-policy";

const RegisterPrivacyPolicy = (props) => {
  return (
    <ModalWithClose {...props} title="Kridas Privacy Policy" size="lg">
      <Box backgroundColor={"white"} mt={4}>
        <PrivacyPolicy />
      </Box>
    </ModalWithClose>
  );
};

export default RegisterPrivacyPolicy;
