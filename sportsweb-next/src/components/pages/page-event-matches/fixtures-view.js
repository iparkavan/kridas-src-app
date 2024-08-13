import {
  Box,
  ButtonGroup,
  Grid,
  GridItem,
  HStack,
  Input,
  Select,
  Spacer,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import LabelText from "../../ui/text/label-text";
import { HeadingMedium } from "../../ui/heading/heading";
import { useState } from "react";
import Button from "../../ui/button";
import IconButton from "../../ui/icon-button";
import { FilterIcon } from "../../ui/icons";
import FixturesCard from "./fixture-card";
import { useTeams } from "../../../hooks/team-hooks";
import { useEffect } from "react";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";
import LabelValuePair from "../../ui/label-value-pair";
import Modal from "../../ui/modal";
import MatchFilter from "./match-filter";
import FixturesDoublesCard from "./Fixtures-doubles-card";
import FixturesCardCricket from "./fixture-card-cricket";

function FixturesView({ sports, eventData, isSportsSuccess }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tournamentCategoryId, setTournamentCategoryId] = useState("");
  const [typeGame, setTypeGame] = useState();
  const { data: eventTeamData = [], isLoading } =
    useTeams(tournamentCategoryId);

  let tournamentCategories = [];
  if (isSportsSuccess && eventData?.tournaments) {
    eventData.tournaments.forEach((tournament) => {
      const sport = sports.find(
        (sport) => sport.sports_id === tournament.sportsRefid
      );
      tournament?.tournamentCategories.forEach((tournamentCategory) => {
        const obj = { ...sport };
        obj.tournamentCategoryId = tournamentCategory.tournamentCategoryId;
        obj.tournamentCategory = tournamentCategory.tournamentCategory;
        obj.tournamentFormat = tournamentCategory.tournamentFormat;
        obj.tournamentConfig = tournamentCategory.tournamentConfig;
        tournamentCategories.push(obj);
      });
    });
  }

  useEffect(() => {
    const isType = eventTeamData.find(
      (cat) => cat.tournament_category_id === +tournamentCategoryId
    )?.type?.type;
    setTypeGame(isType);
  }, [eventTeamData, tournamentCategoryId]);

  const isDoubles = eventTeamData.map((obj) => {
    return obj.tournament_player_reg_id;
  });
  const typeValid = isDoubles.length !== new Set(isDoubles).size;

  return (
    <VStack w="full">
      <HStack spacing={10} mb={7} w="full">
        <HeadingMedium>Event Category</HeadingMedium>
        <Select
          borderColor="gray.300"
          maxW="xs"
          placeholder="Select Sport"
          value={tournamentCategoryId}
          onChange={(e) => setTournamentCategoryId(e.target.value)}
        >
          {tournamentCategories?.map((tournamentCategoryObj) => {
            const category =
              tournamentCategoryObj.sports_category?.find(
                (sportCategory) =>
                  sportCategory.category_code ===
                  tournamentCategoryObj.tournamentCategory
              )?.category_name || tournamentCategoryObj.tournament_category;
            return (
              <option
                key={tournamentCategoryObj.tournamentCategoryId}
                value={tournamentCategoryObj.tournamentCategoryId}
              >
                {`${tournamentCategoryObj.sports_name} - ${category}`}
              </option>
            );
          })}
        </Select>
        {typeValid ? (
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button size="md">All</Button>
            <Button size="md">Group 1</Button>
            <Button size="md">Group 2</Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup size="sm" isAttached variant="outline">
            <Button size="md">All</Button>
            <Button size="md">Group</Button>
            <Button size="md">Knockout</Button>
          </ButtonGroup>
        )}

        <Spacer />
        <Button size="md" variant="outline">
          Clear Filter
        </Button>
        <IconButton
          icon={<FilterIcon fontSize="16px" />}
          colorScheme="primary"
          variant="solid"
          size="md"
          onClick={onOpen}
        />
      </HStack>
      {/* <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <LabelValuePair label="Teams">
              <Input placeholder="Basic usage" />
            </LabelValuePair>
            <LabelValuePair label="Teams">
              <Input placeholder="Basic usage" />
            </LabelValuePair>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal> */}
        <Grid
          // templateColumns="repeat(5,1fr)"
          // gap={6}
          // p={5}
          // w={'full'}
          // alignContent="space-between"
        >
          <GridItem>
            <FixturesCard
              type="view"
              typeGame={typeGame}
              tournamentCategoryId={tournamentCategoryId}
              tournamentCategories={tournamentCategories}
            />
          </GridItem>
          <GridItem>
            <FixturesCardCricket
              type="view"
              typeGame={typeGame}
              tournamentCategoryId={tournamentCategoryId}
              tournamentCategories={tournamentCategories}
            />
          </GridItem>
        </Grid>
      {/* <FixturesDoublesCard
        type="view"
        typeGame={typeGame}
        tournamentCategoryId={tournamentCategoryId}
        tournamentCategories={tournamentCategories}
      /> */}
      {typeValid && (
        <FixturesDoublesCard
          type="view"
          typeGame={typeGame}
          tournamentCategoryId={tournamentCategoryId}
          tournamentCategories={tournamentCategories}
        />
      )}

      <MatchFilter isOpen={isOpen} onClose={onClose} />
    </VStack>
  );
}

export default FixturesView;
