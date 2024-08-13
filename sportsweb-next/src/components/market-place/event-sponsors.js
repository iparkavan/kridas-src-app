import { Box, Button, HStack, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { TextCustom } from "../ui/text/text";
import MarketplaceCard from "./marketplace-card";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Carousel } from "react-responsive-carousel";

const EventSponsers = () => {
  const [isHover, setIsHover] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  // const [isNext, setIsNext] = useState();
  // const [isPrev, setIsPrev] = useState();

  const sponsorship = [
    {
      href: "string",
      image:
        "https://t3.ftcdn.net/jpg/02/78/42/76/360_F_278427683_zeS9ihPAO61QhHqdU1fOaPk2UClfgPcW.jpg",
      title: "Sponsors 1",
      description: "string",
      categoryName: "Equipment",
      sportName: "Badminton",
      basePrice: 1299,
      splPrice: 999,
      priceCurrency: "INR",
    },
    {
      href: "string",
      image:
        "https://i0.wp.com/ketto.blog/wp-content/uploads/2022/10/Fundraising-Ideas-for-High-School-Sports.jpg?fit=3200%2C1500&ssl=1",
      title: "Sponsors 2",
      description: "string",
      categoryName: "Equipment",
      sportName: "Cricket",
      basePrice: 1299,
      splPrice: 649,
      priceCurrency: "INR",
    },
    {
      href: "string",
      image:
        "https://www.nicepng.com/png/detail/14-142866_sports-png-image-khelo-india-school-games-2018.png",
      title: "Sponsors 3",
      description: "string",
      categoryName: "Equipment",
      sportName: "FootBall",
      basePrice: 1299,
      splPrice: 799,
      priceCurrency: "INR",
    },
    {
      href: "string",
      image:
        "https://t3.ftcdn.net/jpg/02/78/42/76/360_F_278427683_zeS9ihPAO61QhHqdU1fOaPk2UClfgPcW.jpg",
      title: "Sponsors 1",
      description: "string",
      categoryName: "Equipment",
      sportName: "Badminton",
      basePrice: 1299,
      splPrice: 999,
      priceCurrency: "INR",
    },
    {
      href: "string",
      image:
        "https://i0.wp.com/ketto.blog/wp-content/uploads/2022/10/Fundraising-Ideas-for-High-School-Sports.jpg?fit=3200%2C1500&ssl=1",
      title: "Sponsors 2",
      description: "string",
      categoryName: "Equipment",
      sportName: "Cricket",
      basePrice: 1299,
      splPrice: 649,
      priceCurrency: "INR",
    },
    {
      href: "string",
      image:
        "https://www.nicepng.com/png/detail/14-142866_sports-png-image-khelo-india-school-games-2018.png",
      title: "Sponsors 3",
      description: "string",
      categoryName: "Equipment",
      sportName: "FootBall",
      basePrice: 1299,
      splPrice: 799,
      priceCurrency: "INR",
    },
  ];

  // const next = () => {
  //   currentSlide: currentSlide + 1;
  // };

  const updateCurrentSlide = (index) => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
    console.log(index, currentSlide);
  };

  const isNext = () => {
    setCurrentSlide(currentSlide + 1);
  };

  const isPrev = () => {
    setCurrentSlide(currentSlide - 1);
  };

  return (
    <Box>
      <VStack alignContent={"center"} justifyContent={"center"} gap={6}>
        <TextCustom
          fontSize={"2xl"}
          fontWeight={"semibold"}
          color={"primary.500"}
        >
          Featured Sponsors
        </TextCustom>
        <Box
          bg={"#7c8899"}
          p={12}
          w={"full"}
          borderRadius={"3xl"}
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <VStack alignContent={"center"} gap={8}>
            <TextCustom
              fontSize={"2xl"}
              fontWeight={"semibold"}
              color={"white"}
            >
              Barathwaj Ravindran
            </TextCustom>
            <HStack
              w={"full"}
              alignContent={"center"}
              justifyContent={"space-evenly"}
              gap={12}
            >
              <HStack
                w={"full"}
                alignContent={"center"}
                justifyContent={"center"}
                gap={12}
              >
                {isHover && (
                  <Button
                    bg={"#a0a8b3"}
                    borderRadius={"full"}
                    py={10}
                    color={"white"}
                    onClick={isPrev}
                  >
                    <Box fontSize={"5xl"}>
                      <MdKeyboardArrowLeft />
                    </Box>
                  </Button>
                )}

                <Box maxW={"850px"}>
                  <Carousel
                    showStatus={false}
                    infiniteLoop={true}
                    showThumbs={false}
                    autoPlay={true}
                    stopOnHover={true}
                    showIndicators={false}
                    centerMode
                    centerSlidePercentage={35}
                    selectedItem={currentSlide}
                    onChange={updateCurrentSlide}
                    // width={"1000px"}
                    swipeable={true}
                  >
                    {sponsorship.map((item, i) => (
                      <HStack
                        key={i}
                        alignContent={"center"}
                        justifyContent={"center"}
                      >
                        <MarketplaceCard
                          href={item.href}
                          image={item.image}
                          title={item.title}
                          description={item.description}
                          categoryName={item.categoryName}
                          sportName={item.sportName}
                          basePrice={item.basePrice}
                          splPrice={item.splPrice}
                          priceCurrency={item.priceCurrency}
                        />
                      </HStack>
                    ))}
                  </Carousel>
                </Box>

                {isHover && (
                  <Button
                    bg={"#a0a8b3"}
                    borderRadius={"full"}
                    py={10}
                    color={"white"}
                    onClick={isNext}
                  >
                    <Box fontSize={"5xl"}>
                      <MdKeyboardArrowRight />
                    </Box>
                  </Button>
                )}
              </HStack>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default EventSponsers;
