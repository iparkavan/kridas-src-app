import {
  Box,
  Flex,
  VStack,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
} from "@chakra-ui/react";

// import AddTeam from "./user-pages-sports-profile-add-team";
import AddVenue from "./user-pages-sports-profile-add-venue";
import AddAcademy from "./user-pages-sports-profile-add-academy";
// import TeamStatisticsData from "./user-pages-team-sports-profile-details";
import VenueStatisticsData from "./user-pages-venue-sports-profile-details";
import AcademyStatisticsData from "./user-pages-academy-sports-profile-details";
import { HeadingMedium, HeadingSmall } from "../../../ui/heading/heading";
import { TextMedium, TextSmall, TextXtraSmall } from "../../../ui/text/text";
// import { SportsProfile } from "../../../ui/icons";

function PageViewSportsProfile(props) {
  const {
    pageData,
    academyStatisticsData,
    // venueStatisticsData,
    type,
  } = props;

  const selectedTabStyle = {
    color: "var(--chakra-colors-primary-500)",
    borderColor: "var(--chakra-colors-primary-500)",
  };

  // const isCatVenue = pageData?.["parent_category_type"] === "VEN";
  // const isCatAcademy = pageData?.["parent_category_type"] === "ACD";

  return (
    <VStack alignItems="flex-start" w="full" spacing={4}>
      <HStack spacing={4}>
        {/* <Icon as={SportsProfile} w="6" h="6" /> */}
        <Box>
          {type === "private" ? (
            <HeadingSmall textTransform="uppercase">
              Sports Profile
            </HeadingSmall>
          ) : (
            <HeadingMedium>Sports Profile</HeadingMedium>
          )}
          {type === "private" && (
            <TextSmall mt={1}>
              Manage your sports profile below. Add as many information you can.
            </TextSmall>
          )}
        </Box>
      </HStack>
      <Tabs w="full">
        <TabList>
          {/* {isCatVenue && (
            <Tab
              gap={3}
              _selected={selectedTabStyle}
              _focus={{ boxShadow: "none" }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.6667 24H1.33333C0.979711 24 0.640573 23.8595 0.390524 23.6095C0.140476 23.3594 0 23.0203 0 22.6667V12.9333C2.71407e-05 12.7435 0.0406035 12.5558 0.119014 12.3829C0.197425 12.21 0.311861 12.0558 0.454667 11.9307L2.66667 10V1.33333C2.66667 0.979711 2.80714 0.640573 3.05719 0.390524C3.30724 0.140476 3.64638 0 4 0H22.6667C23.0203 0 23.3594 0.140476 23.6095 0.390524C23.8595 0.640573 24 0.979711 24 1.33333V22.6667C24 23.0203 23.8595 23.3594 23.6095 23.6095C23.3594 23.8595 23.0203 24 22.6667 24ZM8 5.772C8.32283 5.77238 8.63456 5.88987 8.87733 6.10267L15.544 11.936C15.6864 12.0604 15.8007 12.2137 15.8793 12.3856C15.9579 12.5576 15.999 12.7443 16 12.9333V21.3333H21.3333V2.66667H5.33333V7.66667L7.12133 6.10133C7.36464 5.88871 7.67688 5.77168 8 5.772ZM6.66667 17.3333H9.33333V21.3333H13.3333V13.5427L8 8.876L2.66667 13.5427V21.3333H6.66667V17.3333Z"
                  fill="black"
                />
              </svg>
              <Flex direction="column" align="flex-start">
                <HeadingSmall>Your Venues</HeadingSmall>
                <TextXtraSmall fontWeight="bold">
                  {venueStatisticsData?.length}{" "}
                  {venueStatisticsData?.length > 1 ? "Venues" : "Venue"}
                </TextXtraSmall>
              </Flex>
            </Tab>
          )} */}
          <Tab
            gap={3}
            _selected={selectedTabStyle}
            _focus={{ boxShadow: "none" }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 4V22.6667H18.9247V21.3333H5.33333V5.33333H23.3333V6.74667H24.6667V4H4ZM24.6667 10.6667C24.6667 11.0203 24.5262 11.3594 24.2761 11.6095C24.0261 11.8595 23.687 12 23.3333 12C22.9797 12 22.6406 11.8595 22.3905 11.6095C22.1405 11.3594 22 11.0203 22 10.6667C22 10.313 22.1405 9.97391 22.3905 9.72386C22.6406 9.47381 22.9797 9.33333 23.3333 9.33333C23.687 9.33333 24.0261 9.47381 24.2761 9.72386C24.5262 9.97391 24.6667 10.313 24.6667 10.6667ZM26 10.6667C26 11.3739 25.719 12.0522 25.219 12.5523C24.7189 13.0524 24.0406 13.3333 23.3333 13.3333C22.6261 13.3333 21.9478 13.0524 21.4477 12.5523C20.9476 12.0522 20.6667 11.3739 20.6667 10.6667C20.6667 9.95942 20.9476 9.28115 21.4477 8.78105C21.9478 8.28095 22.6261 8 23.3333 8C24.0406 8 24.7189 8.28095 25.219 8.78105C25.719 9.28115 26 9.95942 26 10.6667V10.6667Z"
                fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.062 14.5533C20.4338 14.1984 20.928 14.0003 21.442 14H24.1633C25.1393 14 26.048 14.332 26.748 14.9933C27.4213 15.6293 27.772 16.4447 27.9153 17.2173C28.1406 18.432 27.9073 19.7593 27.3333 20.936V26.3333C27.3333 26.7516 27.1761 27.1545 26.8928 27.4622C26.6095 27.7699 26.2209 27.9599 25.8041 27.9944C25.3873 28.0289 24.9727 27.9054 24.6427 27.6485C24.3127 27.3915 24.0914 27.0199 24.0226 26.6073L23.6666 24.4713L23.3106 26.6073C23.2419 27.0199 23.0205 27.3915 22.6905 27.6485C22.3605 27.9054 21.946 28.0289 21.5292 27.9944C21.1123 27.9599 20.7237 27.7699 20.4405 27.4622C20.1572 27.1545 20 26.7516 20 26.3333V22.336V20.062C19.6959 20.2376 19.351 20.33 19 20.33H15.5986C15.0682 20.33 14.5595 20.1193 14.1844 19.7442C13.8093 19.3691 13.5986 18.8604 13.5986 18.33C13.5986 17.7996 13.8093 17.2909 14.1844 16.9158C14.5595 16.5407 15.0682 16.33 15.5986 16.33H18.1986L20.062 14.5527V14.5533ZM21.3333 22.3167V26.3333C21.3335 26.4168 21.3651 26.4972 21.4217 26.5586C21.4784 26.6199 21.556 26.6578 21.6392 26.6646C21.7224 26.6715 21.8052 26.6469 21.8711 26.5957C21.9371 26.5444 21.9814 26.4703 21.9953 26.388L22.6906 22.2173C22.7165 22.0617 22.7968 21.9202 22.9171 21.8182C23.0375 21.7161 23.1902 21.6601 23.348 21.66H23.9853C24.1431 21.6601 24.2958 21.7161 24.4161 21.8182C24.5365 21.9202 24.6168 22.0617 24.6426 22.2173L25.338 26.388C25.3519 26.4703 25.3962 26.5444 25.4621 26.5957C25.5281 26.6469 25.6108 26.6715 25.6941 26.6646C25.7773 26.6578 25.8549 26.6199 25.9115 26.5586C25.9682 26.4972 25.9997 26.4168 26 26.3333V20.7773C26 20.6706 26.0256 20.5654 26.0746 20.4707C26.5893 19.4773 26.7766 18.3887 26.6046 17.4607C26.5 16.8967 26.2553 16.362 25.8326 15.9627C25.4013 15.5553 24.8293 15.3333 24.1633 15.3333H21.4426C21.2713 15.3333 21.106 15.3993 20.982 15.5173L18.926 17.4787C18.8021 17.5971 18.6373 17.6632 18.466 17.6633H15.5986C15.4218 17.6633 15.2523 17.7336 15.1272 17.8586C15.0022 17.9836 14.932 18.1532 14.932 18.33C14.932 18.5068 15.0022 18.6764 15.1272 18.8014C15.2523 18.9264 15.4218 18.9967 15.5986 18.9967H19C19.1713 18.9965 19.3361 18.9304 19.46 18.812L20.2066 18.1C20.3011 18.0099 20.4199 17.9496 20.5483 17.9265C20.6768 17.9033 20.8092 17.9183 20.9292 17.9697C21.0491 18.0211 21.1514 18.1066 21.2232 18.2156C21.295 18.3245 21.3333 18.4522 21.3333 18.5827V22.3173V22.3167Z"
                fill="black"
              />
            </svg>
            <Flex direction="column" align="flex-start">
              <HeadingSmall> Your Academy</HeadingSmall>
              <TextXtraSmall fontWeight="bold">
                {academyStatisticsData?.length}{" "}
                {academyStatisticsData?.length > 1 ? "Academies" : "Academy"}
              </TextXtraSmall>
            </Flex>
          </Tab>
        </TabList>
        <TabPanels>
          {/* {isCatVenue && (
            <TabPanel py={5}>
              <VStack spacing={5} align="flex-start">
                {type === "private" && <AddVenue />}
                {venueStatisticsData.length === 0 && type === "private" ? (
                  <Flex minH="250px" w="full" align="center" justify="center">
                    <TextMedium>
                      Click the
                      <Box as="span" fontWeight="bold">
                        {" "}
                        Add Venue{" "}
                      </Box>
                      button to add your venues
                    </TextMedium>
                  </Flex>
                ) : (
                  <VenueStatisticsData
                    pageData={pageData}
                    venueStatisticsData={venueStatisticsData}
                    type={type}
                  />
                )}
              </VStack>
            </TabPanel>
          )} */}
          <TabPanel py={5}>
            <VStack spacing={5} align="flex-start">
              {type === "private" && <AddAcademy />}
              {academyStatisticsData.length === 0 && type === "private" ? (
                <Flex minH="250px" w="full" align="center" justify="center">
                  <Text color="black">
                    Click the
                    <Box as="span" fontWeight="bold">
                      {" "}
                      Add Academy{" "}
                    </Box>
                    button to add your academy
                  </Text>
                </Flex>
              ) : (
                <AcademyStatisticsData
                  pageData={pageData}
                  academyStatisticsData={academyStatisticsData}
                  type={type}
                />
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      )
    </VStack>
  );
}

export default PageViewSportsProfile;
