import { cloneElement } from "react";
import {
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import Button from "../button";

const DeletePopover = (props) => {
  const { trigger, handleDelete, title, children } = props;
  const { isOpen, onToggle, onClose } = useDisclosure();

  return (
    <Popover
      placement="auto"
      isOpen={isOpen}
      closeOnBlur={true}
      onClose={onClose}
    >
      <PopoverTrigger>
        {cloneElement(trigger, { onClick: onToggle })}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader fontSize="sm" fontWeight="medium">
          {title}
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton onClick={onClose} />
        <PopoverBody>{children}</PopoverBody>
        <PopoverFooter display="flex" justifyContent="flex-end">
          <ButtonGroup size="sm">
            <Button colorScheme={null} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                handleDelete();
                onClose();
              }}
            >
              Delete
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};

export default DeletePopover;
