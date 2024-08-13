import {
  Box,
  Divider,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Link,
  Stack,
} from "@chakra-ui/react";
import NextLink from "next/link";
// import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { Carousel } from "react-responsive-carousel";

import { HeadingSmall } from "../ui/heading/heading";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "../ui/icons";
import { TextMedium } from "../ui/text/text";
// import FeaturesAccordian from "../layout/features-accordion";
import FeaturesCarousel from "../layout/features-carousel";
import routes from "../../helper/constants/route-constants";

const LandingInfo = (props) => {
  const { CustomContainer } = props;
  return (
    <>
      <CustomContainer>
        {/* <FeaturesAccordian /> */}
        <FeaturesCarousel />
      </CustomContainer>

      <CustomContainer>
        {/* <Box as="section" my={10}>
          <Carousel
            showStatus={false}
            infiniteLoop={true}
            showThumbs={false}
            autoPlay={true}
            stopOnHover={false}
          >
            <Image src="images/about_image1.png" alt="about_image1" />
            <Image src="images/about_image2.png" alt="about_image2" />
            <Image src="images/vision_image1.png" alt="about_image1" />
            <Image src="images/vision_image2.png" alt="about_image1" />
            <Image src="images/mission_image1.png" alt="about_image1" />
            <Image src="images/mission_image2.png" alt="about_image1" />
          </Carousel>
        </Box> */}

        <Flex
          as="section"
          id="about"
          direction={{ base: "column", lg: "row" }}
          gap={{ base: 5, md: 10 }}
          align="center"
        >
          <Box flexBasis="50%">
            <Image src="images/about.png" alt="about" />
          </Box>
          <Box flexBasis="50%">
            <TextMedium textAlign="justify">
              Welcome to the global sports networking and career platform. Get
              instant access to professional sports profiles from across the
              globe to make connections with individuals, teams, coaches, clubs,
              academies, professionals, and mentors relevant to your field of
              sports. Kridas assist your find the right talent or help you learn
              new skills, connect with like minded individuals, avail
              sponsorship support or build your career in the international
              sports community. We serve as a connecting point for those who are
              passionate about sports, regardless of the sport and level they
              participate in.
            </TextMedium>
          </Box>
        </Flex>

        <Flex
          as="section"
          id="vision"
          direction={{ base: "column", md: "row-reverse" }}
          gap={{ base: 5, md: 10 }}
          align="center"
        >
          <Box flexBasis="50%">
            <Image src="images/vision.png" alt="vision" />
          </Box>
          <Box flexBasis="50%">
            <TextMedium textAlign="justify">
              Founded by Mr. Sivasankaran B., who is the former Honorary
              Treasurer for Singapore Cricket Association (SCA) and former
              Convener of Ceylon Sports Club for 6 years from 2011 to 2016,
              Kridas is the brainchild of Siva’s 15 years of solid experience in
              sports events management and sports equipment industry. His
              passion for sports propelled him to create a platform for all the
              like-minded sports enthusiasts to not only climb the medal
              platform but also build a successful career in the international
              sports ecosystem. His vision is to give every individual a
              platform to create their global network, project themselves and
              create opportunities. Kridas showcases every individual&apos;s
              sporting achievements as the glorious crown to their success in
              life and career.
            </TextMedium>
          </Box>
        </Flex>

        <Flex
          as="section"
          id="mission"
          direction={{ base: "column", md: "row" }}
          gap={{ base: 5, md: 10 }}
          align="center"
          mb={{ base: 5, md: 0 }}
        >
          <Box flexBasis="50%">
            <Image src="images/mission.png" alt="mission" />
          </Box>
          <Box flexBasis="50%">
            <TextMedium textAlign="justify">
              Bringing the entire sports community together, Our mission is
              simple: Connect, Collaborate, Create Opportunities. we care about
              the commitment and passion of every individual within the sports
              industry to excel and turn their dreams into reality.
            </TextMedium>
          </Box>
        </Flex>

        {/* <Box as="section" id="blog" my={10}>
          <HeadingLarge textAlign="center">Blog</HeadingLarge>
          <TextMedium mt={5} textAlign="justify">
            <Box as="div" fontWeight="semibold">
              KRIDAS - YOUR STEPPING STONE!
            </Box>
            Every sportsman dreams of the day he could perform for his tribe!
            However, the present sports scene does not guarantee everybody this
            cup of tea. The burden of carrying talents unattended could be at
            times too heavy that it weighs you down!
            <br />
            <br />
            Stedman Graham, points out, “If you did the same thing you did
            yesterday as you did today as you will do tomorrow, what have you
            done? The same thing.” The present world is all about doing things
            differently. Different enough, to challenge even your yesterdays.
            <br />
            <br />
            In today’s fast-moving world, possessing a skill is never enough;
            you need to have salability. So yeah, being an aspiring sportsperson
            in the contemporary, one has to be mindful of skill acquisition, and
            mastery as much as building network and identity along the way!
            There is a need to have multiple doors knocked and traversed, till
            landing on that one life-changing door. For this very purpose,
            KRIDAS saves your time and efforts in finding the right door, right
            people and right opportunities! It offers you ‘the platform’ to
            showcase talents by connecting you to multiple doorways with talent
            needs!
            <br />
            <br />
            In 2009, the sports column of The Irish Times briefed on the three
            stages of learning skills involved in a sport. They enlisted the
            stages as PREPARATORY, PRACTICE AND AUTOMATION stages, based on
            theories postulated by experts from conditioning studies. In the
            first stage, the preparation stage, a potential player is let to
            perceive a picture of WHAT is to be done and HOW it has been done.
            This stage involves a lot of observation of the sport, its existing
            stars and their game!
            <br />
            <br />
            The second is the practice stage. It is more often bent upon how
            different it can be done. Performance and efficiency building
            involves serious concentration levels, practising perfections in
            movements, and building upon physical and mental coordination for
            the same. This is a stage of recurrent mistakes, trial and error,
            and eventual reduction of them. This stage requires proper guidance
            and support from a committed coach who can steer your learning
            wheels in apt directions!
            <br />
            <br />
            On accomplishing a journey through preparation and practice, one
            ends up ‘Just doing it!’ The processing time earlier taken becomes
            comparatively reduced. The motor tasks become more consistent and
            automated! It is at this point in the sport that external pressures
            seize to affect the player. The corrective action becomes internally
            guided and sharpening the skill takes up stand-alone importance at
            this point. It is a milestone wherein the sport is mostly ready to
            monetize one’s honed skill set. Here arises the need for the right
            runway, and networking!
            <br />
            <br />
            These foundational stages are essential in the career of any sports
            enthusiast to transform into the star they aimed to be. KRIDAS
            bridges the gap between you and your sports idol, opening up a
            platform that connects every support essential at different points
            in your dream path. KRIDAS is a community of athletes, agents,
            coaches, clubs, associations, brands, and more. It endeavours to
            stand by you, as a pillar holistically through all your hurdles.
            <br />
            <br />
            ‘Every pro was once an amateur, every expert was once a beginner!’
            Not willing to repeat your yesterday, you now know what difference
            you should make from your yesterday! Choose KRIDAS and let us do the
            rest!
          </TextMedium>
        </Box> */}
      </CustomContainer>

      <Box id="contact" as="footer" py={10} bg="gray.100">
        <CustomContainer>
          <Flex
            direction={["column", "column", "row"]}
            justify="space-between"
            gap={10}
          >
            <Box flexBasis="45%">
              <Image
                src="/kridas-logo.svg"
                alt="Kridas-logo"
                width="250px"
                height="50px"
              />
              <TextMedium mt={5}>
                Global Sports networking and career platform that provides
                expansion, collaboration, sponsorship and marketing
                opportunities.
              </TextMedium>
            </Box>

            <Box flexBasis="30%">
              <HeadingSmall>Enquiries</HeadingSmall>
              <Box mt={2}>
                <TextMedium display="inline">General: </TextMedium>
                <Link href="mailto:support@kridas.com" color="primary.500">
                  support@kridas.com
                </Link>
              </Box>
              <Box mt={2}>
                <TextMedium display="inline">Partnership: </TextMedium>
                <NextLink href="mailto:partners@kridas.com" passHref>
                  <Link color="primary.500">partners@kridas.com</Link>
                </NextLink>
              </Box>
            </Box>

            <Box flexBasis="20%">
              <HeadingSmall>Social</HeadingSmall>
              <HStack mt={2} spacing="2px">
                <IconButton
                  icon={<Icon as={TwitterIcon} h={7} w={7} p={1} />}
                  size="sm"
                  onClick={() =>
                    window.open("https://twitter.com/kridas_sports", "_blank")
                  }
                />
                <IconButton
                  icon={<Icon as={InstagramIcon} h={7} w={7} p={1} />}
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/kridas_sports",
                      "_blank"
                    )
                  }
                />
                <IconButton
                  icon={<Icon as={FacebookIcon} h={7} w={7} p={1} />}
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/Kridas-103915698901083",
                      "_blank"
                    )
                  }
                />
                <IconButton
                  icon={<Icon as={LinkedinIcon} h={7} w={7} p={1} />}
                  size="sm"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/company/kridas-the-sports-platform",
                      "_blank"
                    )
                  }
                />
              </HStack>
            </Box>
          </Flex>
          <Divider my={5} borderColor="gray.400" />
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 1, md: 4 }}
          >
            <NextLink href={routes.terms} passHref>
              <Link color="primary.500">Terms</Link>
            </NextLink>
            <NextLink href={routes.privacyPolicy} passHref>
              <Link color="primary.500">Privacy Policy</Link>
            </NextLink>
            <NextLink href={routes.shippingPolicy} passHref>
              <Link color="primary.500">Shipping & Delivery Policy</Link>
            </NextLink>
            <NextLink href={routes.cancellationPolicy} passHref>
              <Link color="primary.500">Cancellation & Refund Policy</Link>
            </NextLink>
            <NextLink href={routes.contact} passHref>
              <Link color="primary.500">Contact Us</Link>
            </NextLink>
          </Stack>
          <TextMedium mt={2}>
            Copyright {new Date().getFullYear()} Sportz Platform Pte Ltd. All
            rights reserved.
          </TextMedium>
        </CustomContainer>
      </Box>
    </>
  );
};

export default LandingInfo;
