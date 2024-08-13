import {
  HStack,
  Image,
  LinkBox,
  LinkOverlay,
  Tag,
  VStack,
} from "@chakra-ui/react";
import LabelText from "../ui/text/label-text";
import { TextMedium, TextSmall } from "../ui/text/text";

const MarketplaceCard = (props) => {
  const {
    href,
    image,
    title,
    description,
    categoryName,
    sportName,
    basePrice,
    splPrice,
    priceCurrency,
  } = props;

  const isSplPriceDifferent = splPrice !== basePrice;

  return (
    <LinkBox boxShadow="2xl" w="full" maxW="260px" borderRadius="lg" bg={'white'}>
      <Image src={image} alt={title} h="130px" w="full" objectFit="cover" />
      <VStack alignItems="flex-start" p={3}>
        <LinkOverlay href={href}>
          <LabelText fontSize="xl" noOfLines={1}>
            {title}
          </LabelText>
        </LinkOverlay>
        <TextMedium noOfLines={2}>{description}</TextMedium>
        <Tag
          variant="solid"
          colorScheme="primary"
          fontWeight="normal"
          fontSize="md"
          p={2}
        >
          {categoryName}
        </Tag>
        {sportName && <TextMedium color="primary.500">{sportName}</TextMedium>}
        {splPrice && priceCurrency && (
          <HStack alignItems="baseline">
            <TextMedium fontWeight="bold">
              {splPrice} {priceCurrency}
            </TextMedium>
            {isSplPriceDifferent && (
              <TextSmall
                fontWeight="medium"
                color="gray.500"
                textDecoration="line-through"
              >
                {basePrice} {priceCurrency}
              </TextSmall>
            )}
          </HStack>
        )}
      </VStack>
    </LinkBox>
  );
};

export default MarketplaceCard;
