import {
  Box,
  Circle,
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  VStack,
} from "@chakra-ui/react";
import { HeadingMedium } from "../ui/heading/heading";
import { TextMedium, TextSmall } from "../ui/text/text";

const VoucherCard = ({ voucher }) => {
  return (
    <LinkBox bg="white" p={4} borderRadius="md" boxShadow="md" h="full">
      <Box mx={-4}>
        <Image
          src={voucher.productMediaUrl}
          alt={voucher.productName}
          h="130px"
          w="full"
          objectFit="contain"
        />
      </Box>
      <VStack alignItems="flex-start" mt={4} spacing={2}>
        <LinkOverlay href={`/vouchers/${voucher.productVoucherId}`}>
          <HeadingMedium color="primary.500" fontWeight="medium">
            {voucher.productName}
          </HeadingMedium>
        </LinkOverlay>
        <HStack spacing={3}>
          <TextMedium fontWeight="semibold">
            {voucher.productBasePrice} {voucher.productPriceCurrency}
          </TextMedium>
          {/* {voucher.discountedPrice && (
            <TextSmall textDecoration="line-through">
              {voucher.discountedPrice}
            </TextSmall>
          )} */}
        </HStack>
        <TextSmall>{voucher.sportsName}</TextSmall>
        {/* <HStack wrap="wrap" spacing={0} columnGap={2}>
          <TextSmall>{voucher.companyAddress}</TextSmall>
          <Circle h="4px" w="4px" bgColor="black" />
          <TextSmall></TextSmall>
          <Circle h="4px" w="4px" bgColor="black" />
          <TextSmall></TextSmall>
        </HStack> */}
      </VStack>
    </LinkBox>
  );
};

export default VoucherCard;
