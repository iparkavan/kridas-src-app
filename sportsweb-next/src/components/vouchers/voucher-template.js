import {
  Box,
  Circle,
  Flex,
  Heading,
  Image,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { usePage } from "../../hooks/page-hooks";
import { TextMedium, TextSmall } from "../ui/text/text";

const VoucherTemplate = ({ voucherData }) => {
  const { data: pageData } = usePage(voucherData.seller.companyId);

  let price;
  if (voucherData.productPricing.productPriceCurrency === "SGD") {
    price = "S$ ";
  } else if (voucherData.productPricing.productPriceCurrency === "INR") {
    price = "₹ ";
  }
  price += voucherData.productPricing.productBasePrice;

  const validDate = format(
    new Date(voucherData.redemptionTillDate),
    "do MMMM yyyy"
  );

  return (
    <Box
      w="full"
      minH="350px"
      bgImage="/images/voucher-bg.png"
      bgPosition="center"
      bgSize="cover"
      position="relative"
    >
      <Box pos="absolute" top="10px" right="10px" width="25%">
        <Image src="/kridas-logo.svg" alt="Kridas-logo" />
      </Box>

      <VStack
        pos="absolute"
        top="0"
        left="50%"
        transform="translateX(-50%)"
        spacing={0}
        w="full"
      >
        <Image
          src={pageData?.company_profile_img}
          alt={pageData?.company_name}
          maxH="150px"
          maxW="250px"
        />
        <TextMedium fontWeight="medium" noOfLines={1}>
          {pageData?.address?.line1} {pageData?.address?.city}{" "}
          {pageData?.address?.pincode}
        </TextMedium>
        <TextMedium fontWeight="medium">
          {pageData?.company_contact_no}
        </TextMedium>
      </VStack>

      <Box
        position="absolute"
        w="15%"
        h="full"
        bgColor="primary.500"
        opacity={0.75}
      >
        {new Array(10).fill("").map((_, index) => (
          <Circle
            key={index}
            size="20px"
            bg="white"
            position="absolute"
            mt={2}
            top={`${index * 40}px`}
            left={0}
            transform="translateX(-50%)"
          />
        ))}
      </Box>

      <Box position="absolute" right="0" bottom="8%" h="160px" w="48%">
        <Flex h="full">
          <Box
            w="30%"
            bg="primary.500"
            clipPath="polygon(100% 0, 0 50%, 100% 100%)"
          />
          <Box
            w="full"
            bg="primary.500"
            position="relative"
            py={1}
            px={1}
            ml="-1px"
          >
            <Stack pr={3}>
              <Heading size="xl" color="white" noOfLines={1}>
                {price}
              </Heading>
              <Box
                border="1px solid white"
                borderRadius="2xl"
                py={2}
                px={3}
                w="fit-content"
              >
                <Heading size="md" color="white" noOfLines={2}>
                  {voucherData.productName}
                </Heading>
              </Box>
              <Heading size="sm" color="white" alignSelf="center" noOfLines={1}>
                VALID TILL: {validDate}
              </Heading>
            </Stack>
            {new Array(4).fill("").map((_, index) => (
              <Circle
                key={index}
                size="20px"
                bg="white"
                position="absolute"
                mt={3}
                top={`${index * 40}px`}
                right={0}
                transform="translateX(50%)"
              />
            ))}
          </Box>
        </Flex>
        <Heading
          size="md"
          textAlign="center"
          color="primary.500"
          mt={1}
          noOfLines={1}
        >
          VOC ID: d01c
        </Heading>
      </Box>

      <Box pos="absolute" left="20px" bottom="20px" w="45%">
        <TextSmall textAlign="center">TERMS & CONDITIONS</TextSmall>
        <Box
          w="full"
          border="1px solid black"
          borderRadius="lg"
          p={2}
          noOfLines={4}
        >
          {voucherData.voucherTerms}
        </Box>
      </Box>
    </Box>
  );
};

export default VoucherTemplate;
