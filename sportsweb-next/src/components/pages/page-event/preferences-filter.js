import { Fragment, useEffect, useMemo } from "react";
import {
  Grid,
  GridItem,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  Stack,
} from "@chakra-ui/react";
import { FilterIcon } from "../../ui/icons";
import { HeadingSmall } from "../../ui/heading/heading";

const PreferencesFilter = (props) => {
  const {
    filters,
    setFilters,
    tournamentCategory,
    apparelData,
    sizesData,
    foodData,
    areFiltersApplied,
  } = props;

  const preferencesOffered = useMemo(
    () =>
      tournamentCategory.preferencesOffered
        ? JSON.parse(tournamentCategory.preferencesOffered)
        : tournamentCategory.preferencesOffered,
    [tournamentCategory]
  );
  const isApparelPresent = useMemo(
    () => Boolean(preferencesOffered?.apparel_preference.length > 0),
    [preferencesOffered]
  );
  const isFoodPresent = useMemo(
    () => Boolean(preferencesOffered?.food_preference.length > 0),
    [preferencesOffered]
  );

  useEffect(() => {
    const initialFilters = {};
    if (isApparelPresent) {
      initialFilters.apparel_preference = {};
      preferencesOffered.apparel_preference.forEach((apparelKey) => {
        initialFilters.apparel_preference[apparelKey] = "";
      });
    }
    if (isFoodPresent) {
      initialFilters.food_preference = "";
    }
    setFilters(initialFilters);
  }, [isApparelPresent, isFoodPresent, preferencesOffered, setFilters]);

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="Filter"
          variant={areFiltersApplied ? "solid" : "outline"}
          colorScheme="primary"
          icon={<FilterIcon fontSize="20px" />}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader color="primary.500">Filter</PopoverHeader>
        <PopoverBody>
          <Stack>
            {isApparelPresent && (
              <>
                <HeadingSmall>Apparel Preferences</HeadingSmall>
                <Grid templateColumns="auto 1fr" gap={3} alignItems="center">
                  {preferencesOffered.apparel_preference.map((apparelKey) => {
                    const apparelName = apparelData.find(
                      ({ lookup_key }) => lookup_key === apparelKey
                    )?.lookup_value;

                    return (
                      <Fragment key={apparelKey}>
                        <GridItem>{apparelName}</GridItem>
                        <GridItem>
                          <Select
                            borderColor="gray.300"
                            value={filters.apparel_preference[apparelKey] || ""}
                            onChange={(e) => {
                              setFilters({
                                ...filters,
                                apparel_preference: {
                                  ...filters.apparel_preference,
                                  [apparelKey]: e.target.value,
                                },
                              });
                            }}
                          >
                            <option value=""></option>
                            {sizesData.map((size) => (
                              <option
                                key={size.lookup_key}
                                value={size.lookup_key}
                              >
                                {size.lookup_value}
                              </option>
                            ))}
                          </Select>
                        </GridItem>
                      </Fragment>
                    );
                  })}
                </Grid>
              </>
            )}
            {isFoodPresent && (
              <>
                <HeadingSmall>Food Preferences</HeadingSmall>
                <Select
                  borderColor="gray.300"
                  value={filters.food_preference}
                  onChange={(e) => {
                    setFilters({
                      ...filters,
                      food_preference: e.target.value,
                    });
                  }}
                >
                  <option value=""></option>
                  {foodData.map((food) => (
                    <option key={food.lookup_key} value={food.lookup_key}>
                      {food.lookup_value}
                    </option>
                  ))}
                </Select>
              </>
            )}
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PreferencesFilter;
