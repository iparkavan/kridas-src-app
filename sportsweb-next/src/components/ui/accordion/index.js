import {
  Accordion as CAccordion,
  AccordionItem as CAccordionItem,
  AccordionButton as CAccordionButton,
} from "@chakra-ui/react";

const Accordion = (props) => (
  <CAccordion
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
    overflow="hidden"
    {...props}
  />
);

const AccordionItem = (props) => (
  <CAccordionItem border="none" borderBottom="2px solid white" {...props} />
);

const AccordionButton = (props) => (
  <CAccordionButton
    py={4}
    px={5}
    bg="gray.100"
    _hover={{ bg: "primary.500", color: "white" }}
    _focus={{ bg: "primary.500", color: "white" }}
    _expanded={{ bg: "gray.100", color: "primary.500" }}
    {...props}
  />
);

export { Accordion, AccordionItem, AccordionButton };
