import {
    useDisclosure,
    Modal as ModalCommon,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
  } from "@chakra-ui/react";
  
  const Modal = (props) => {
    const { onClose, isOpen, title, size,...otherProps } = props;
  
    return (
      <ModalCommon
        onClose={onClose}
        isOpen={isOpen}
        size={size}
        {...otherProps}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            bg="linear-gradient(90deg, #0093E9 0%, #80D0C7 100%)"
            color="white"
          >
            {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody {...otherProps} p={[2,4,6]}>{props.children}</ModalBody>
         
        </ModalContent>
      </ModalCommon>
    );
  };
  
  export default Modal;
  