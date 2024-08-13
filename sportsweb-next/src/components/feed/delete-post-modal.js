import { ModalFooter, useToast } from "@chakra-ui/react";
import { useDeleteFeed } from "../../hooks/feed-hooks";
import Button from "../ui/button";
import Modal from "../ui/modal";
import { TextMedium } from "../ui/text/text";

const DeletePostModal = (props) => {
  const { isOpen, onClose, feedId, type } = props;
  const toast = useToast();
  const { mutate, isLoading } = useDeleteFeed();

  const handleDelete = () => {
    mutate(
      { feedId, type },
      {
        onSettled: (_, error) => {
          const toastTitle = error
            ? "Failed to delete the post. Please try again."
            : "The post has been deleted.";
          toast({
            title: toastTitle,
            status: error ? "error" : "success",
            duration: 5000,
            isClosable: true,
          });
          onClose();
        },
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Post"
      isCentered
      size="xl"
    >
      <TextMedium> Are you sure you want to delete this post?</TextMedium>
      <ModalFooter p={0} mt={5}>
        <Button variant="outline" mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button isLoading={isLoading} onClick={handleDelete}>
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default DeletePostModal;
