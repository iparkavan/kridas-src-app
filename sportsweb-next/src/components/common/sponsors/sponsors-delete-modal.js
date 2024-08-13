import { ModalFooter } from "@chakra-ui/react";
import { useDeleteSponsor } from "../../../hooks/sponsor-hooks";
import Button from "../../ui/button";
import Modal from "../../ui/modal";
import { TextMedium } from "../../ui/text/text";

const SponsorsDeleteModal = (props) => {
  const { isOpen, onClose, sponsorId, type, id } = props;
  const { mutate, isLoading, isError, reset } = useDeleteSponsor();

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDelete = () => {
    mutate(
      { sponsorId, type, id },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Sponsor"
      size="xl"
      isCentered
    >
      <TextMedium>Are you sure you want to delete this sponsor?</TextMedium>
      {isError && (
        <TextMedium mt={5} color="red.500">
          Unable to delete sponsor
        </TextMedium>
      )}
      <ModalFooter p={0} mt={5}>
        <Button variant="outline" mr={3} onClick={handleClose}>
          Cancel
        </Button>
        <Button isLoading={isLoading} onClick={handleDelete}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SponsorsDeleteModal;
