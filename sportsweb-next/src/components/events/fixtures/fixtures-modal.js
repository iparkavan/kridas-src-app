import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import FixturesSvg from "../../../svg/fixtures-svg";
import { HeadingMedium } from "../../ui/heading/heading";

const FixturesModal = (props) => {
  const { isOpen, onClose, children } = props;

  return (
    <Modal
      size="5xl"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent pos="relative">
        <ModalHeader p={0} pos="absolute" top={0} left={0}>
          <FixturesSvg />
          <HeadingMedium
            color="white"
            textAlign="center"
            pos="absolute"
            fontSize={{ base: "md", md: "xl" }}
            top={{ base: "30px", md: "50px" }}
            left={{ base: "10px", md: "25px" }}
            transform="rotate(309deg)"
          >
            SETUP <br /> FIXTURE
          </HeadingMedium>
        </ModalHeader>
        <ModalCloseButton />
        {children}
      </ModalContent>
    </Modal>
  );
};

export default FixturesModal;
