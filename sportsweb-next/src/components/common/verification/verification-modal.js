import { useEffect, useState } from "react";
import { ModalFooter } from "@chakra-ui/react";

import { useUser } from "../../../hooks/user-hooks";
import Button from "../../ui/button";
import Modal from "../../ui/modal";
import { TextMedium } from "../../ui/text/text";
import VerificationDocuments from "./verification-documents.js";
import { verifyUser } from "../../../helper/constants/user-contants";
import { verifyPage } from "../../../helper/constants/page-constants";
import { useProfileVerification } from "../../../hooks/profile-verification-hooks";

function VerificationModal(props) {
  const { isOpen, onClose, type, pageData } = props;
  const { data: userData } = useUser();
  const { isProfileComplete } =
    type === "user" ? verifyUser(userData) : verifyPage(pageData);
  const id = type === "user" ? userData["user_id"] : pageData["company_id"];
  const { data: verificationData = [] } = useProfileVerification(type, id);
  const isVerificationSubmitted = Boolean(
    verificationData?.find((verify) => verify["applied_status"] === "S")
  );

  const [step, setStep] = useState(0);
  const nextStep = () => setStep((prevStep) => prevStep + 1);

  useEffect(() => {
    if (isVerificationSubmitted) {
      setStep(2);
    }
  }, [isVerificationSubmitted]);

  const handleClose = () => {
    onClose();
    if (!isVerificationSubmitted) {
      setStep(0);
    }
  };

  const getStepComponent = () => {
    switch (step) {
      case 0:
        return (
          <>
            <TextMedium>
              You are about to apply for Verified badge. Click proceed button to
              continue.
            </TextMedium>
            <ModalFooter p={0} mt={5}>
              <Button variant="outline" mr={3} onClick={handleClose}>
                Close
              </Button>
              <Button onClick={nextStep}>Proceed</Button>
            </ModalFooter>
          </>
        );
      case 1:
        return (
          <VerificationDocuments
            handleClose={handleClose}
            nextStep={nextStep}
            type={type}
            id={id}
          />
        );
      case 2:
        return (
          <>
            <TextMedium fontWeight="bold">Documents submitted.</TextMedium>
            <TextMedium>
              Verification may take up to 3 working days. You will receive an
              email regarding the status.
            </TextMedium>
            <ModalFooter p={0} mt={5}>
              <Button onClick={handleClose}>OK</Button>
            </ModalFooter>
          </>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Get Verified Badge"
      isCentered
      size="xl"
    >
      {isProfileComplete ? (
        getStepComponent()
      ) : (
        <>
          <TextMedium>Hi {userData["first_name"]},</TextMedium>
          <TextMedium mt={3}>
            {type === "user"
              ? "Your profile is incomplete. "
              : `The profile for ${pageData["company_name"]} is incomplete. `}
            Consider filling all profile information before applying for
            Verified badge.
          </TextMedium>
          <ModalFooter p={0} mt={5}>
            <Button onClick={handleClose}>OK</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  );
}
export default VerificationModal;
