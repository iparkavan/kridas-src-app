import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import * as yup from "yup";

import FixturesSvg from "../../../svg/fixtures-svg";
import { HeadingMedium } from "../../ui/heading/heading";
import NumberWithValidation from "../../ui/number-input/number-with-validation";
import Button from "../../ui/button";
import { getPointsTableYupSchema } from "../../../helper/constants/event-fixtures-constants";
import { useUpdatePointConfig } from "../../../hooks/tournament-categories-hooks";

const PointsTableSetupModal = (props) => {
  const { isOpen, onClose, tournamentCategory, eventId } = props;
  const { mutate, isLoading } = useUpdatePointConfig(eventId);

  return (
    <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
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
            POINTS <br /> SETUP
          </HeadingMedium>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          mt={{ base: "50px", md: "50px" }}
          ml={{ base: "50px", md: "150px" }}
          pr={{ base: "0px", md: "30px" }}
          p={4}
        >
          <Formik
            initialValues={
              tournamentCategory.tournamentPointConfig
                ? JSON.parse(tournamentCategory.tournamentPointConfig)
                : {
                    points_for_win: "",
                    points_for_tie: "",
                  }
            }
            validationSchema={getPointsTableYupSchema(yup)}
            onSubmit={(values) => {
              mutate(
                {
                  tournamentCategoryId: tournamentCategory.tournamentCategoryId,
                  tournamentPointConfig: values,
                },
                {
                  onSuccess: onClose,
                }
              );
            }}
          >
            {() => {
              return (
                <Form>
                  <HStack alignItems="flex-start">
                    <NumberWithValidation
                      name="points_for_win"
                      label="Points for Win"
                      min={1}
                      maxW="150px"
                    />
                    <NumberWithValidation
                      name="points_for_tie"
                      label="Points for Tie"
                      min={0}
                      maxW="150px"
                    />
                  </HStack>
                  <Stack
                    direction={{ base: "column", md: "row" }}
                    justifyContent="flex-end"
                    alignItems="flex-start"
                    mt={10}
                    spacing={4}
                  >
                    <Button isLoading={isLoading} type="submit">
                      Save
                    </Button>
                    <Button colorScheme="red" onClick={onClose}>
                      Cancel
                    </Button>
                  </Stack>
                </Form>
              );
            }}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PointsTableSetupModal;
