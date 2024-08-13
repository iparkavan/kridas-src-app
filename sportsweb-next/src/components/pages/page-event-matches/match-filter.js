import React from "react";
// import Modal from "../../ui/modal";
import LabelValuePair from "../../ui/label-value-pair";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

function MatchFilter({ onClose, isOpen }) {
  return (
    <Modal onClose={onClose} size="md" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <LabelValuePair label="Teams">
            <Input placeholder="Basic usage" w="full" />
          </LabelValuePair>
          <LabelValuePair label="Teams">
            <Input placeholder="Basic usage" w="full" />
          </LabelValuePair>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    // <Modal isOpen={isOpen} onClose={onClose} size="lg">
    //   <LabelValuePair label="Teams">
    //     <Input placeholder="Basic usage" w="full" />
    //   </LabelValuePair>
    //   <LabelValuePair label="Teams">
    //     <Input placeholder="Basic usage" w="full" />
    //   </LabelValuePair>
    // </Modal>
  );
}
export default MatchFilter;
