import {
  ModalFooter,
  useDisclosure,
  IconButton,
  Icon,
  ButtonGroup,
} from "@chakra-ui/react";
import Button from "../../../ui/button";
import Modal from "../../../ui/modal";
import { useDeleteStatisticById } from "../../../../hooks/page-statistics-hooks";
import { DeleteIcon } from "../../../ui/icons";

function DeleteStatistic({ statisticsId, category }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate, isLoading } = useDeleteStatisticById();

  return (
    <>
      <IconButton
        icon={<DeleteIcon />}
        variant="ghost"
        colorScheme="primary"
        onClick={onOpen}
        size="sm"
      />

      <Modal
        size="lg"
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        title={`Delete ${category}`}
      >
        Are you sure to delete this {category}? This action cannot be undone.
        <ModalFooter pt={[2, 4, 6]}>
          <ButtonGroup spacing={3}>
            <Button colorScheme="primary" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="primary"
              onClick={() => {
                mutate(
                  { statistics_id: statisticsId },
                  {
                    onSuccess: () => onClose(),
                  }
                );
              }}
              isLoading={isLoading}
            >
              Delete
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default DeleteStatistic;
