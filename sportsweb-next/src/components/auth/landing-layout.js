import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  AspectRatio,
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Image,
  Link,
  ListItem,
  OrderedList,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
// import Image from "next/image";
import NextLink from "next/link";
import { HamburgerIcon, LockIcon } from "@chakra-ui/icons";

import LandingInfo from "./landing-info";
import routes from "../../helper/constants/route-constants";
import Button from "../../components/ui/button/index";
import Login from "./login";
import Register from "./register";
import ActivateAccount from "./activate-account-otp";
import { HeadingLarge } from "../ui/heading/heading";
import { TextMedium } from "../ui/text/text";

const LandingLayout = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { rc, redir } = router.query;
  const [prefillMail, setPrefillMail] = useState("");

  const {
    isOpen: isLoginOpen,
    onOpen: onLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();
  const {
    isOpen: isRegisterOpen,
    onOpen: onRegisterOpen,
    onClose: onRegisterClose,
  } = useDisclosure();
  const {
    isOpen: isVerifyCodeOpen,
    onOpen: onVerifyCodeOpen,
    onClose: onVerifyCodeClose,
  } = useDisclosure();

  const CustomContainer = ({ children }) => (
    <Container maxW={["sm", "xl", "4xl", "4xl", "5xl", "6xl"]}>
      {children}
    </Container>
    // <Container maxW="90%">{children}</Container>
  );

  const CustomLink = ({ href, ...props }) => (
    <NextLink href={href} passHref>
      <Link {...props} />
    </NextLink>
  );

  useEffect(() => {
    if (rc) {
      onRegisterOpen();
    }
  }, [onRegisterOpen, rc]);

  useEffect(() => {
    if (redir) {
      onLoginOpen();
    }
  }, [onLoginOpen, redir]);

  const handleOpenVerify = () => {
    onRegisterClose();
    onVerifyCodeOpen();
  };

  return (
    <Box bg="white">
      <Box
        as="header"
        bg="white"
        pos="sticky"
        top={0}
        boxShadow="md"
        zIndex={1}
      >
        <CustomContainer>
          <HStack
            as="nav"
            justify="space-between"
            gap={{ md: 5, lg: 7 }}
            py={4}
            // h="10vh"
          >
            <CustomLink href={routes.login}>
              <Image
                src="/kridas-logo.svg"
                alt="Kridas - Logo"
                width="250px"
                height="50px"
              />
            </CustomLink>
            <Flex
              gap={{ md: 3, lg: 5 }}
              display={{ base: "none", md: "inherit" }}
              justify="space-between"
              align="center"
            >
              <CustomLink href="#about" color="primary.500">
                About Kridas
              </CustomLink>
              <CustomLink href="#vision" color="primary.500">
                Vision
              </CustomLink>
              <CustomLink href="#mission" color="primary.500">
                Mission
              </CustomLink>
              {/* <CustomLink href="#blog" color="primary.500">Blog</CustomLink> */}
              <CustomLink href="#contact" color="primary.500">
                Get in touch
              </CustomLink>
              <Button
                variant="link"
                leftIcon={<LockIcon />}
                onClick={onLoginOpen}
              >
                Login
              </Button>
              <Button borderRadius="full" onClick={onRegisterOpen}>
                Register
              </Button>
            </Flex>

            <IconButton
              icon={<HamburgerIcon />}
              display={{ base: "initial", md: "none" }}
              onClick={onOpen}
            />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Kridas</DrawerHeader>

                <DrawerBody>
                  <OrderedList listStyleType="none" ml={0} spacing={5}>
                    <ListItem onClick={onClose}>
                      <Link href="#about" color="primary.500">
                        About Kridas
                      </Link>
                    </ListItem>
                    <ListItem onClick={onClose}>
                      <Link href="#vision" color="primary.500">
                        Vision
                      </Link>
                    </ListItem>
                    <ListItem onClick={onClose}>
                      <Link href="#mission" color="primary.500">
                        Mission
                      </Link>
                    </ListItem>
                    {/* <ListItem>
                      <Link href="#blog" color="primary.500">Blog</Link>
                    </ListItem> */}
                    <ListItem onClick={onClose}>
                      <Link href="#contact" color="primary.500">
                        Get in touch
                      </Link>
                    </ListItem>
                    <ListItem onClick={onClose}>
                      <Button
                        variant="link"
                        leftIcon={<LockIcon />}
                        onClick={onLoginOpen}
                      >
                        Login
                      </Button>
                    </ListItem>
                    <ListItem onClick={onClose}>
                      <Button borderRadius="full" onClick={onRegisterOpen}>
                        Register
                      </Button>
                    </ListItem>

                    {/* <ListItem>
                      <Button
                        colorScheme="primary"
                        variant="outline"
                        onClick={() =>
                          window.open("https://kridas.com", "_blank")
                        }
                      >
                        Pre-register
                      </Button>
                    </ListItem> */}
                    {/* <ListItem>
                      <Button
                        colorScheme="primary"
                        onClick={() => router.push("/login")}
                      >
                        Login
                      </Button>
                    </ListItem> */}
                  </OrderedList>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </HStack>
        </CustomContainer>
      </Box>

      <Login
        isOpen={isLoginOpen}
        onOpen={onLoginOpen}
        onClose={onLoginClose}
        onVerifyCodeOpen={onVerifyCodeOpen}
        onRegisterOpen={onRegisterOpen}
      />

      <ActivateAccount
        isOpen={isVerifyCodeOpen}
        onClose={onVerifyCodeClose}
        onLoginOpen={onLoginOpen}
        prefillMail={prefillMail}
        setPrefillMail={setPrefillMail}
      />

      <Register
        isOpen={isRegisterOpen}
        onClose={onRegisterClose}
        handleOpenVerify={handleOpenVerify}
        setPrefillMail={setPrefillMail}
      />

      {/* <Flex
        as="section"
        minH="90vh"
        direction={{ base: "column", md: "row" }}
        px={{ base: "5%", lg: "10%" }}
        py="5%"
        justifyContent="space-between"
        align="center"
        gap={[10, 10, 10, 20]}
        bgImage="images/kridas_bg.png"
        bgPosition="center"
        bgSize="cover"
      >
        <Box color="white" bg="primary.600" flexBasis="45%" p={5} opacity="0.9">
          <HeadingLarge size="xl">Connecting Sports Community</HeadingLarge>
          <TextMedium mt={2}>
            A sports community platform that connects athletes, brands and
            stakeholders globally.
          </TextMedium>
        </Box>
        <VStack
          bg="white"
          flexBasis={{ base: "50%", lg: "40%" }}
          width="full"
          paddingX={[4, 8, 8, 12, 16]}
          paddingY={8}
          alignItems="center"
          spacing={6}
        >
          {props.children}
        </VStack>
      </Flex> */}

      {/* <Image
        as="section"
        minH="90vh"
        direction={{ base: "column", md: "row" }}
        px={{ base: "5%", lg: "10%" }}
        py="5%"
        justifyContent="space-between"
        align="center"
        gap={[10, 10, 10, 20]}
        // bgImage="images/new_kridas_bg.jpg"
        src="images/new_kridas_bg.jpg"
        // alt="naruto"
        objectFit="cover"
        bgPosition="center"
        bgSize="cover"
      ></Image> */}
      {/* <Box boxSize="auto">
        <Image src="images/new_kridas_bg.png" objectFit="cover" />
      </Box> */}
      {/* <AspectRatio ratio={16 / 9}>
        <Image
          src="images/new_kridas_bg.png"
          objectFit="cover"
          alt="kridas bg"
        />
      </AspectRatio> */}

      {/* <Image
        src="/images/new_kridas_bg.png"
        alt="kridas bg"
        w="100%"
        maxH="90vh"
      /> */}

      <CustomContainer>
        <VStack my={10} textAlign="center" spacing={3}>
          <HeadingLarge
            size="xl"
            as="h1"
            maxW="600px"
            color="primary.500"
            fontFamily="Akshar, Roboto"
          >
            GLOBAL SPORTS NETWORKING
            <Box as="br" display={{ base: "none", sm: "inherit" }} /> AND CAREER
            PLATFORM
          </HeadingLarge>
          <TextMedium maxW="500px">
            One platform for all - bringing all stakeholders within the sporting
            industry together. Create your unique sporting profile and start
            curating your global network.
          </TextMedium>
        </VStack>
      </CustomContainer>

      <LandingInfo CustomContainer={CustomContainer} />
    </Box>
  );
};

export default LandingLayout;
