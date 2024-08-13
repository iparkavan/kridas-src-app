import {
  Avatar,
  Box,
  ButtonGroup,
  Flex,
  Grid,
  GridItem,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import { HeadingSmall } from "../../ui/heading/heading";
import { TextMedium } from "../../ui/text/text";
import Button from "../../ui/button";

function FixturesCard({
  type,
  eventData,
  typeGame,
  tournamentCategories,
  tournamentCategoryId,
}) {
  const [edit, setEdit] = useState(false);
  const tournamentCategory = tournamentCategories.find(
    (tc) => tc.tournamentCategoryId == tournamentCategoryId
  );
  const formatCode = tournamentCategory?.sports_format.find(
    (sportCategory) =>
      sportCategory.format_code === tournamentCategory.tournamentFormat
  )?.format_code;

  // const sports_code = tournamentCategory.sports_code;

  console.log(tournamentCategory, "formatCode");

  return (
    <Box w="full" h="max-content" bg="gray.100" mt={15}>
      <Grid
        templateColumns="repeat(5,1fr)"
        gap={6}
        p={5}
        // alignContent="center"
        alignContent="space-between"
      >
        {
          (type = "view" ? (
            <GridItem w="100%">
              <Text>Match 02</Text>
            </GridItem>
          ) : (
            <GridItem w="100%">
              <ReactDatePicker
                dateFormat="MM/dd/yyyy"
                placeholderText="Date"
                customInput={
                  <Input borderColor="gray.300" bg="white" fontSize="sm" />
                }
              />
            </GridItem>
          ))
        }

        {
          (type = "view" ? (
            <GridItem w="100%" textAlign="center">
              <Text>26-Nov-2022</Text>
            </GridItem>
          ) : (
            <GridItem w="100%">
              <ReactDatePicker
                dateFormat="MM/dd/yyyy"
                placeholderText="Date"
                customInput={
                  <Input borderColor="gray.300" bg="white" fontSize="sm" />
                }
              />
            </GridItem>
          ))
        }
        <GridItem w="100%" textAlign="center"></GridItem>
        {
          (type = "view" ? (
            <GridItem w="100%" textAlign="center">
              <Text>9.00 A.M </Text>
            </GridItem>
          ) : (
            <GridItem w="100%">
              <ReactDatePicker
                dateFormat="MM/dd/yyyy"
                placeholderText="Date"
                customInput={
                  <Input borderColor="gray.300" bg="white" fontSize="sm" />
                }
              />
            </GridItem>
          ))
        }

        {
          (type = "view" ? (
            <GridItem w="100%" textAlign="end">
              <Text>Jawaharlal Nehru Stadium</Text>
            </GridItem>
          ) : (
            <GridItem w="100%">
              <ReactDatePicker
                dateFormat="MM/dd/yyyy"
                placeholderText="Date"
                customInput={
                  <Input borderColor="gray.300" bg="white" fontSize="sm" />
                }
              />
            </GridItem>
          ))
        }
      </Grid>
      <Grid
        templateColumns="repeat(5,1fr)"
        gap={6}
        p={5}
        alignContent="space-between"
      >
        {
          (type = "view" ? (
            <GridItem w="100%">
              <Text>hello</Text>
            </GridItem>
          ) : (
            <GridItem w="100%">
              <Input
                borderColor="gray.300"
                bg="white"
                fontSize="sm"
                placeholder="Venue Name"
              />
            </GridItem>
          ))
        }
        <GridItem w="100%" alignSelf="center">
          {tournamentCategory && tournamentCategory.sports_code === "SPOR02" ? (
            <Grid
              templateRows="repeat(2, 1fr)"
              templateColumns="repeat(5, 1fr)"
            >
              <GridItem rowSpan={2} colSpan={1}>
                <Avatar name="teams" src="https://bit.ly/dan-abramov" />
              </GridItem>
              <GridItem colSpan={4}>
                <HeadingSmall noOfLines={2}>Teams 2</HeadingSmall>
              </GridItem>

              <GridItem colSpan={4}>
                <SimpleGrid columns={3}>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    borderRadius={3}
                    // backgroundColor="green.900"
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 1</HeadingSmall>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 2</HeadingSmall>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    borderRadius={3}
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 3</HeadingSmall>
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={3}>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    borderRadius={3}
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 1</HeadingSmall>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 2</HeadingSmall>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    borderRadius={3}
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 3</HeadingSmall>
                  </Box>
                </SimpleGrid>
              </GridItem>
            </Grid>
          ) : (
            <Grid
              templateRows="repeat(2, 1fr)"
              templateColumns="repeat(5, 1fr)"
            >
              <GridItem rowSpan={2} colSpan={1}>
                <Avatar name="teams" src="https://bit.ly/dan-abramov" />
              </GridItem>
              <GridItem colSpan={4}>
                <HeadingSmall mt={3} ml={3} noOfLines={2}>
                  Teams 2
                </HeadingSmall>
              </GridItem>

              <GridItem colSpan={4}>
                <SimpleGrid columns={3}>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    backgroundColor="green.600"
                    color="white"
                    textAlign="center"
                  >
                    <TextMedium>Set 1</TextMedium>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    textAlign="center"
                  >
                    <TextMedium>Set 2</TextMedium>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    borderRadius={3}
                    textAlign="center"
                  >
                    <TextMedium>Set 3</TextMedium>
                  </Box>
                </SimpleGrid>
                <SimpleGrid mt={2} columns={3}>
                  <Box border="2px solid" borderColor="gray" textAlign="center">
                    {edit ? (
                      <NumberInput
                        // onChange={(value) => setNoOfReg(value)}
                        // maxW={10}
                        // maxH={5}
                        size="sm"
                        borderColor="transparent"
                        focusBorderColor="transparent"
                      >
                        <NumberInputField />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                    ) : (
                      <TextMedium>21</TextMedium>
                    )}
                  </Box>
                  <Box border="2px solid" borderColor="gray" textAlign="center">
                    {edit ? (
                      <NumberInput
                        // onChange={(value) => setNoOfReg(value)}
                        // maxW={10}
                        // maxH={5}
                        size="sm"
                        borderColor="transparent"
                        focusBorderColor="transparent"
                      >
                        <NumberInputField />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                    ) : (
                      <TextMedium>67</TextMedium>
                    )}
                  </Box>
                  <Box border="2px solid" borderColor="gray" textAlign="center">
                    {edit ? (
                      <NumberInput
                        // onChange={(value) => setNoOfReg(value)}
                        // maxW={10}
                        // maxH={5}
                        size="sm"
                        borderColor="transparent"
                        focusBorderColor="transparent"
                      >
                        <NumberInputField />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                    ) : (
                      <TextMedium>21</TextMedium>
                    )}
                  </Box>
                </SimpleGrid>
              </GridItem>
            </Grid>
          )}
          {/* <Grid templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)">
            <GridItem rowSpan={2} colSpan={1}>
              <Avatar name="teams" src="https://bit.ly/dan-abramov" />
            </GridItem>
            <GridItem colSpan={4}>
              <HeadingSmall noOfLines={2}>Teams 1</HeadingSmall>
            </GridItem>

            <GridItem colSpan={4}>
              <SimpleGrid columns={3}>
                <Box
                  border="2px solid"
                  borderColor="green"
                  borderRadius={3}
                  backgroundColor="green.400"
                  textAlign="center"
                >
                  <HeadingSmall noOfLines={2}>Set 1</HeadingSmall>
                </Box>
                <Box border="2px solid" borderColor="green" textAlign="center">
                  <HeadingSmall noOfLines={2}>Set 2</HeadingSmall>
                </Box>
                <Box
                  border="2px solid"
                  borderColor="green"
                  borderRadius={3}
                  textAlign="center"
                >
                  <HeadingSmall noOfLines={2}>Set 3</HeadingSmall>
                </Box>
              </SimpleGrid>
              <SimpleGrid columns={3}>
                <Box
                  border="2px solid"
                  borderColor="green"
                  borderRadius={3}
                  textAlign="center"
                >
                  <HeadingSmall noOfLines={2}>Set 1</HeadingSmall>
                </Box>
                <Box border="2px solid" borderColor="green" textAlign="center">
                  <HeadingSmall noOfLines={2}>Set 2</HeadingSmall>
                </Box>
                <Box
                  border="2px solid"
                  borderColor="green"
                  borderRadius={3}
                  textAlign="center"
                >
                  <HeadingSmall noOfLines={2}>Set 3</HeadingSmall>
                </Box>
              </SimpleGrid>
            </GridItem>
          </Grid> */}
          {/* <SimpleGrid columns={2}>
            <GridItem bg="red" w="auto">
              <Avatar name="teams" src="https://bit.ly/dan-abramov" />
            </GridItem>
            <GridItem bg="blue">
              <HeadingSmall noOfLines={2}>Teams 1</HeadingSmall>
            </GridItem>

            <Box></Box>
            <GridItem bg="pink">
              <SimpleGrid columns={3} spacing={3}>
                <Box bg="tomato" height="5px"></Box>
                <Box bg="tomato" height="5px"></Box>
                <Box bg="tomato" height="5px"></Box>
                <Box bg="tomato" height="5px"></Box>
                <Box bg="tomato" height="5px"></Box>
              </SimpleGrid>
            </GridItem>
          </SimpleGrid> */}
          {/* <VStack>
            <HStack>
              <Avatar name="teams" src="https://bit.ly/dan-abramov" />
              <HeadingSmall noOfLines={2}>Teams 1</HeadingSmall>
            </HStack>

            <SimpleGrid columns={3} spacing={3} ml={20}>
              <Box border="2px solid" borderColor="green">
                <HeadingSmall noOfLines={2}>Set 1</HeadingSmall>
              </Box>
              <Box border="2px solid" borderColor="green">
                <HeadingSmall noOfLines={2}>Set 2</HeadingSmall>
              </Box>
              <Box border="2px solid" borderColor="green">
                <HeadingSmall noOfLines={2}>Set 3</HeadingSmall>
              </Box>
              <Box border="2px solid" borderColor="green">
                <HeadingSmall noOfLines={2}>23</HeadingSmall>
              </Box>
              <Box>
                <HeadingSmall noOfLines={2}>34</HeadingSmall>
              </Box>
              <Box>
                <HeadingSmall noOfLines={2}>45</HeadingSmall>
              </Box>
            </SimpleGrid>
          </VStack> */}
        </GridItem>

        <GridItem
          // w="100%"
          alignSelf="center"
          // pr={40}
          w="auto"
          px={20}
        >
          {/* SPOR05 (cricket) */}
          {tournamentCategory && tournamentCategory.sports_code === "SPOR02" ? (
            <Flex gap={2}>
              {edit ? (
                <NumberInput
                  // onChange={(value) => setNoOfReg(value)}
                  // maxW={10}
                  // maxH={5}
                  size="sm"
                  borderColor="transparent"
                  focusBorderColor="transparent"
                >
                  <NumberInputField />
                  {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                </NumberInput>
              ) : (
                <TextMedium>2</TextMedium>
              )}
              <TextMedium>Vs</TextMedium>
              {edit ? (
                <NumberInput
                  // onChange={(value) => setNoOfReg(value)}
                  // maxW={10}
                  // maxH={5}
                  size="sm"
                  borderColor="transparent"
                  focusBorderColor="transparent"
                >
                  <NumberInputField />
                  {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                </NumberInput>
              ) : (
                <TextMedium>1</TextMedium>
              )}
            </Flex>
          ) : (
            <TextMedium>Vs</TextMedium>
          )}
        </GridItem>

        <GridItem w="100%">
          {tournamentCategory && tournamentCategory.sports_code === "SPOR02" ? (
            <Grid
              templateRows="repeat(2, 1fr)"
              templateColumns="repeat(5, 1fr)"
            >
              <GridItem rowSpan={2} colSpan={1}>
                <Avatar name="teams" src="https://bit.ly/dan-abramov" />
              </GridItem>
              <GridItem colSpan={4}>
                <HeadingSmall noOfLines={2}>Teams 2</HeadingSmall>
              </GridItem>

              <GridItem colSpan={4}>
                <SimpleGrid columns={3}>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    borderRadius={3}
                    // backgroundColor="green.900"
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 1</HeadingSmall>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 2</HeadingSmall>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    borderRadius={3}
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 3</HeadingSmall>
                  </Box>
                </SimpleGrid>
                <SimpleGrid columns={3}>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    borderRadius={3}
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 1</HeadingSmall>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 2</HeadingSmall>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    borderRadius={3}
                    textAlign="center"
                  >
                    <HeadingSmall noOfLines={2}>Set 3</HeadingSmall>
                  </Box>
                </SimpleGrid>
              </GridItem>
            </Grid>
          ) : (
            <Grid
              templateRows="repeat(2, 1fr)"
              templateColumns="repeat(5, 1fr)"
            >
              <GridItem rowSpan={2} colSpan={1}>
                <Avatar name="teams" src="https://bit.ly/dan-abramov" />
              </GridItem>
              <GridItem colSpan={4}>
                <HeadingSmall mt={3} ml={3} noOfLines={2}>
                  Teams 2
                </HeadingSmall>
              </GridItem>

              <GridItem colSpan={4}>
                <SimpleGrid columns={3}>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    backgroundColor="green.600"
                    color="white"
                    textAlign="center"
                  >
                    <TextMedium>Set 1</TextMedium>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    textAlign="center"
                  >
                    <TextMedium>Set 2</TextMedium>
                  </Box>
                  <Box
                    border="2px solid"
                    borderColor="green"
                    borderRadius={3}
                    textAlign="center"
                  >
                    <TextMedium>Set 3</TextMedium>
                  </Box>
                </SimpleGrid>
                <SimpleGrid mt={2} columns={3}>
                  <Box border="2px solid" borderColor="gray" textAlign="center">
                    {edit ? (
                      <NumberInput
                        // onChange={(value) => setNoOfReg(value)}
                        // maxW={10}
                        // maxH={5}
                        size="sm"
                        borderColor="transparent"
                        focusBorderColor="transparent"
                      >
                        <NumberInputField />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                    ) : (
                      <TextMedium>18</TextMedium>
                    )}
                  </Box>
                  <Box border="2px solid" borderColor="gray" textAlign="center">
                    {edit ? (
                      <NumberInput
                        // onChange={(value) => setNoOfReg(value)}
                        // maxW={10}
                        // maxH={5}
                        size="sm"
                        borderColor="transparent"
                        focusBorderColor="transparent"
                      >
                        <NumberInputField />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                    ) : (
                      <TextMedium>28</TextMedium>
                    )}
                  </Box>
                  <Box border="2px solid" borderColor="gray" textAlign="center">
                    {edit ? (
                      <NumberInput
                        // onChange={(value) => setNoOfReg(value)}
                        // maxW={10}
                        // maxH={5}
                        size="sm"
                        borderColor="transparent"
                        focusBorderColor="transparent"
                      >
                        <NumberInputField />
                        {/* <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper> */}
                      </NumberInput>
                    ) : (
                      <TextMedium>56</TextMedium>
                    )}
                  </Box>
                </SimpleGrid>
              </GridItem>
            </Grid>
          )}
        </GridItem>

        <GridItem w="100%" textAlign="end">
          {!edit && (
            <Button size="md" variant="solid" onClick={() => setEdit(true)}>
              Edit Result
            </Button>
          )}
        </GridItem>
      </Grid>

      <Grid
        templateColumns="repeat(5,1fr)"
        gap={6}
        p={5}
        alignContent="space-between"
      >
        <GridItem w="100%">
          <Text>Result</Text>
        </GridItem>
        <GridItem w="100%"></GridItem>
        <GridItem w="100%">
          {edit ? (
            <Input
              placeholder="Centennial Maritime Won 2-1"
              size="sm"
              w="56"
              bg="white"
              border="none"
            />
          ) : (
            <Text>Centennial Maritime Won 2-1</Text>
          )}
        </GridItem>
        <GridItem w="100%"></GridItem>

        <GridItem w="100%" textAlign="end">
          {edit && (
            <Button size="md" variant="solid" onClick={() => setEdit(true)}>
              Save
            </Button>
          )}
        </GridItem>
      </Grid>
    </Box>
  );
}

export default FixturesCard;
