import { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Skeleton,
  useDisclosure,
} from "@chakra-ui/react";
import { useIntersectionObserver } from "../../../hooks/common-hooks";
import { useInfiniteSearchPlayers } from "../../../hooks/player-hooks";
import Button from "../../ui/button";
import { AddIcon, FilterIcon, SearchIcon } from "../../ui/icons";
import { TextMedium } from "../../ui/text/text";
import AddPlayerModal from "./add-player-modal";
import PlayerCard from "./player-card";
import PlayersFilter from "./players-filter";
import helper from "../../../helper/helper";

const PlayersTab = (props) => {
  const { pageData, currentPage, isParentPage, isChildPage, isSubTeamPage } =
    props;
  const loadMoreRef = useRef();
  const {
    isOpen: isAddPlayerOpen,
    onOpen: onAddPlayerOpen,
    onClose: onAddPlayerClose,
  } = useDisclosure();
  const {
    isOpen: isFilterOpen,
    onOpen: onFilterOpen,
    onClose: onFilterClose,
  } = useDisclosure();

  const initialFilters = {
    sports_id: "",
    player_id: "",
    first_name: "",
    last_name: "",
    email_id: "",
    contact_number: "",
    user_dob: "",
    team_name: "",
    full_name: "",
    ...(isParentPage && { parent_company_id: pageData?.company_id }),
    ...((isChildPage || isSubTeamPage) && {
      child_company_id: pageData?.company_id,
    }),
  };

  const [filters, setFilters] = useState(initialFilters);

  let updatedFilters = { ...filters };
  if (updatedFilters.user_dob) {
    updatedFilters.user_dob = helper.getJSDateObject(updatedFilters.user_dob);
  }

  const {
    data: playersData,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteSearchPlayers(pageData?.["company_id"], updatedFilters);

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  // const [initialState, setInitialState] = useState(null);

  // useEffect(() => {
  //   if (initialState === null && playersData) {
  //     setInitialState(playersData?.pages[0]?.totalCount > 0);
  //   }
  // }, [initialState, playersData]);

  const isCurrentAndChildPage = currentPage && isChildPage;
  const arePlayersPresent = playersData?.pages[0]?.totalCount > 0;

  const areFiltersApplied = Object.keys(filters).some(
    (key) =>
      key !== "parent_company_id" &&
      key !== "child_company_id" &&
      key !== "full_name" &&
      filters[key]
  );

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  return (
    <Box bg="white" p={6} borderRadius="lg">
      <HStack mb={5} justifyContent="space-between">
        {isCurrentAndChildPage && (
          <>
            <Button leftIcon={<AddIcon />} onClick={onAddPlayerOpen}>
              Add Player
            </Button>
            <AddPlayerModal
              isOpen={isAddPlayerOpen}
              onClose={onAddPlayerClose}
              pageData={pageData}
            />
          </>
        )}

        {/* {initialState && (
        <> */}
        <PlayersFilter
          isOpen={isFilterOpen}
          onClose={onFilterClose}
          pageData={pageData}
          filters={filters}
          setFilters={setFilters}
          isParentPage={isParentPage}
        />
        <HStack ml="auto" spacing={3}>
          <InputGroup maxW="250px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon />
            </InputLeftElement>
            <Input
              input
              type="search"
              placeholder="Search Player"
              name="full_name"
              value={filters.full_name}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  full_name: e.target.value,
                });
              }}
            />
          </InputGroup>
          <Button
            leftIcon={<FilterIcon />}
            variant={areFiltersApplied ? "solid" : "outline"}
            onClick={onFilterOpen}
          >
            Filter
          </Button>
          {areFiltersApplied && (
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </HStack>
        {/* </>
        )} */}
      </HStack>

      <Skeleton isLoaded={!isLoading}>
        <>
          {arePlayersPresent ? (
            <SimpleGrid columns={3} spacingX={10} spacingY={6}>
              {playersData?.pages?.map((page) => {
                return page?.content?.map((player) => (
                  <PlayerCard
                    key={player.company_team_players_id}
                    player={player}
                    isCurrentAndChildPage={isCurrentAndChildPage}
                  />
                ));
              })}
            </SimpleGrid>
          ) : (
            <TextMedium>No players to display</TextMedium>
          )}
        </>
        <span ref={loadMoreRef} />
        {isFetchingNextPage && (
          <CircularProgress mt={5} isIndeterminate size="24px" />
        )}
      </Skeleton>
    </Box>
  );
};

export default PlayersTab;
