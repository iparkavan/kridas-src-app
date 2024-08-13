import { useState } from "react";
import {
  Box,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Image,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

import { HeadingLarge } from "../ui/heading/heading";
import { TextMedium } from "../ui/text/text";
import {
  AcademiesSvg,
  AthletesSvg,
  BrandsSvg,
  ClubsSvg,
  CoachesSvg,
  CompaniesSvg,
  EventOrganizersSvg,
  InstitutionsSvg,
  ProfessionalsSvg,
  ServiceProvidersSvg,
  SportsAssociationsSvg,
} from "../../svg/features-svg";

const FeaturesCarousel = () => {
  const [index, setIndex] = useState(0);

  const features = [
    {
      SVG: AthletesSvg,
      title: "Athletes",
      image: "images/banner/athletes.jpg",
      content:
        "From social to elite professionals, everything you need is here.",
    },
    {
      SVG: AcademiesSvg,
      title: "Academies",
      image: "images/banner/academies.jpg",
      content: "A one-stop platform for your enterprise.",
    },
    {
      SVG: ClubsSvg,
      title: "Clubs and Teams",
      image: "images/banner/clubs_and_teams.jpg",
      content:
        "From a social weekend team to a professional club, here are our offerings.",
    },
    {
      SVG: CompaniesSvg,
      title: "Companies/Corporate",
      image: "images/banner/companies.jpg",
      content: "Bring all your sports teams and events under one profile.",
    },
    {
      SVG: CoachesSvg,
      title: "Coaches",
      image: "images/banner/coaches.jpg",
      content: "Budding or expert, we have you covered.",
    },
    {
      SVG: ProfessionalsSvg,
      title: "Professionals",
      image: "images/banner/professionals.jpg",
      content:
        "Are you a fresher stepping into the sports industry? Or a seasoned professional? Kridas is just the place for you.",
    },
    {
      SVG: InstitutionsSvg,
      title: "Institutions",
      image: "images/banner/institutions.jpg",
      content:
        "Project your sports teams, programs and success stories with the sports ecosystem and attract upcoming talents.",
    },
    {
      SVG: EventOrganizersSvg,
      title: "Event Organizers",
      image: "images/banner/event_organizers.jpg",
      content:
        "Build your digital event portfolio along with an one-stop event management platform.",
    },
    {
      SVG: SportsAssociationsSvg,
      title: "Sports Associations",
      image: "images/banner/sports_associations.jpg",
      content:
        "Create your digital profile, showcasing your events across all age groups and geographics.",
    },
    {
      SVG: BrandsSvg,
      title: "Brands",
      image: "images/banner/brands.jpg",
      content: "Your one-stop targeted marketing platform.",
    },
    {
      SVG: ServiceProvidersSvg,
      title: "Sports Service Providers/Vendors & Distributors",
      image: "images/banner/sports_providers.jpg",
      content: "A global marketplace like no other.",
    },
  ];

  const iconButtonSize = useBreakpointValue({ base: "sm", md: "md" });

  return (
    <Box p={{ base: 5, md: 10 }} borderRadius="xl" bg="blue.50" mt={10}>
      <HeadingLarge>What We Offer</HeadingLarge>

      <Flex
        my={8}
        rowGap={6}
        columnGap={12}
        flexWrap="wrap"
        justifyContent="center"
      >
        {features.map((feature, i) => {
          const isActive = index === i;

          return (
            <VStack
              key={i}
              w="min-content"
              cursor="pointer"
              onClick={() => setIndex(i)}
              px={5}
            >
              <Box
                bg="white"
                borderRadius="full"
                p={3}
                border="2px solid"
                borderColor={isActive ? "primary.500" : "white"}
              >
                <feature.SVG />
              </Box>
              <TextMedium
                fontWeight="bold"
                textAlign="center"
                color={isActive && "primary.500"}
                wordBreak={{ base: "break-all", md: "revert" }}
              >
                {feature.title}
              </TextMedium>
            </VStack>
          );
        })}
      </Flex>

      <Grid
        templateColumns="auto 1fr auto"
        alignItems="center"
        columnGap={{ md: 2 }}
        mx={{ base: -5, md: "auto" }}
      >
        <GridItem>
          <IconButton
            size={iconButtonSize}
            icon={<ChevronLeftIcon fontSize="40px" />}
            colorScheme="blue"
            variant="ghost"
            _focus={{ boxShadow: "none" }}
            onClick={() => {
              const newIndex = index - 1;
              setIndex(newIndex < 0 ? features.length - 1 : newIndex);
            }}
          />
        </GridItem>

        <GridItem>
          <Carousel
            showStatus={false}
            infiniteLoop={true}
            showThumbs={false}
            showArrows={false}
            showIndicators={false}
            autoPlay={true}
            interval={15000}
            stopOnHover={false}
            selectedItem={index}
            onChange={(cIndex) => setIndex(cIndex)}
          >
            {features.map((feature, i) => (
              <Image key={i} src={feature.image} alt={feature.title} />
            ))}
          </Carousel>
        </GridItem>

        <GridItem>
          <IconButton
            size={iconButtonSize}
            icon={<ChevronRightIcon fontSize="40px" />}
            colorScheme="blue"
            variant="ghost"
            _focus={{ boxShadow: "none" }}
            onClick={() => {
              const newIndex = index + 1;
              setIndex(newIndex >= features.length ? 0 : newIndex);
            }}
          />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default FeaturesCarousel;
