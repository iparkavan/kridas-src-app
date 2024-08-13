import { HStack, IconButton, useDisclosure, VStack } from "@chakra-ui/react";
import Button from "../../ui/button";
import { ArrowLeftIcon } from "../../ui/icons";
import SponsorsModal from "./sponsors-modal";
import SponsorsDND from "./sponsors-dnd";

const SponsorsEdit = (props) => {
  const { type, id, setMode, areSponsorsPresent, sports } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <VStack align="flex-start" spacing={5}>
      <HStack w="full" justifyContent="space-between">
        <Button variant="outline" onClick={onOpen}>
          + Add Sponsor
        </Button>
        {areSponsorsPresent && (
          <IconButton
            icon={<ArrowLeftIcon />}
            size="sm"
            colorScheme="primary"
            variant="outline"
            onClick={() => setMode("view")}
          />
        )}
      </HStack>
      <SponsorsModal
        isOpen={isOpen}
        onClose={onClose}
        type={type}
        id={id}
        mode="add"
        sports={sports}
      />
      <SponsorsDND type={type} id={id} setMode={setMode} />
    </VStack>
  );
};

export default SponsorsEdit;
