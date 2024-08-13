import { useState } from "react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  IconButton,
  Image,
} from "@chakra-ui/react";

import { HeadingLarge } from "../ui/heading/heading";
import { TextMedium } from "../ui/text/text";

const FeaturesAccordian = () => {
  const [index, setIndex] = useState(0);

  const handleChange = (index) => {
    setIndex(index);
  };

  const details = [
    {
      image: "images/banner-athletes.png",
      title: "Athletes",
      content:
        "From social to elite professionals, everything you need is here.",
      color: "blue",
    },
    {
      image: "images/banner-coaches.png",
      title: "Coaches",
      content: "Budding or expert, we have you covered.",
      color: "purple",
    },
    {
      image: "images/banner-academy.png",
      title: "Academies",
      content: "A one-stop platform for your enterprise.",
      color: "green",
    },
    {
      image: "images/banner-companies.png",
      title: "Companies",
      content: "A global marketplace like no other.",
      color: "cyan",
    },
    {
      image: "images/banner-clubs.png",
      title: "Clubs & Teams",
      content:
        "From a social weekend team to a professional club, here are our offerings.",
      color: "teal",
    },
    {
      image: "images/banner-professionals.png",
      title: "Professionals",
      content:
        "Are you a fresher stepping into the sports industry? Or a seasoned professional? Kridas is just the place for you.",
      color: "red",
    },
  ];

  return (
    <Box
      p={{ base: 5, md: 10 }}
      borderRadius="xl"
      bg={`${details[index].color}.50`}
      mt={10}
    >
      <HeadingLarge>Our Features</HeadingLarge>
      <Flex mt={5} gap={10} w="full">
        <Box flexBasis={{ base: "100%", lg: "40%" }}>
          <Accordion index={index} onChange={handleChange}>
            {details.map((detail, i) => (
              <AccordionItem
                key={i}
                borderTop={i === 0 && "none"}
                borderBottom={i === details.length - 1 && "none"}
              >
                {({ isExpanded }) => (
                  <Box
                    bg={isExpanded && `${detail.color}.100`}
                    borderRadius="lg"
                    p={5}
                  >
                    <h2>
                      <AccordionButton
                        _focus={{ boxShadow: "none" }}
                        _hover={{ bg: "none" }}
                        p={0}
                      >
                        <Box
                          flex="1"
                          textAlign="left"
                          fontSize="lg"
                          fontWeight="medium"
                        >
                          {detail.title}
                        </Box>
                        <IconButton
                          icon={<AccordionIcon fontSize="24px" />}
                          colorScheme={details[index].color}
                          size="sm"
                          isRound
                          variant="ghost"
                          bg="white"
                          _focus={{ boxShadow: "none" }}
                        />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel p={0} mt={3}>
                      <TextMedium mb={2}>{detail.content}</TextMedium>
                      <Image
                        display={{ lg: "none" }}
                        src={detail.image}
                        alt={detail.title}
                        borderRadius="md"
                      />
                    </AccordionPanel>
                  </Box>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
        <Box
          flexBasis="60%"
          display={{ base: "none", lg: "revert" }}
          alignSelf="center"
        >
          <Image
            src={details[index].image}
            alt={details[index].title}
            borderRadius="xl"
          />
        </Box>
      </Flex>
    </Box>
  );
};

export default FeaturesAccordian;
