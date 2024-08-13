import { useState, useEffect } from "react";
import {
  Box,
  GridItem,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import Button from "../ui/button";
import { HeadingMedium } from "../ui/heading/heading";
import { TextMedium } from "../ui/text/text";

function CheckoutPoints(props) {
  const {
    rewardPoints,
    cashForRewardPoints,
    rewardPointsForCurrency,
    maxCashRedeemed,
    setCashRedeemed,
  } = props;
  const [cashSlider, setCashSlider] = useState(maxCashRedeemed);
  const maxPointsRedeemed = cashSlider / rewardPointsForCurrency || 0;
  // const maxPointsRedeemed = cashSlider * 5;

  useEffect(() => {
    setCashSlider(maxCashRedeemed);
  }, [maxCashRedeemed]);

  const handleCashRedeem = () => setCashRedeemed(cashSlider);

  return (
    <Box mt={5}>
      <HeadingMedium color="primary.500"> Kridas Points</HeadingMedium>
      <SimpleGrid
        columns={2}
        mt={3}
        spacingY={2}
        spacingX={10}
        alignItems="center"
      >
        <TextMedium>Total Available Points</TextMedium>
        <GridItem justifySelf="start">
          <NumberInput maxW="xs" value={rewardPoints} isDisabled={true}>
            <NumberInputField />
          </NumberInput>
        </GridItem>
        <TextMedium>Total Respective Cash</TextMedium>
        <GridItem justifySelf="start">
          <NumberInput maxW="xs" value={cashForRewardPoints} isDisabled={true}>
            <NumberInputField />
          </NumberInput>
        </GridItem>
        <TextMedium>Points to be Redeemed</TextMedium>
        <GridItem justifySelf="start">
          <NumberInput maxW="xs" value={maxPointsRedeemed} isReadOnly={true}>
            <NumberInputField />
          </NumberInput>
        </GridItem>
        <TextMedium>Cash to be Redeemed</TextMedium>
        <GridItem justifySelf="start">
          <NumberInput
            maxW="xs"
            min={0}
            max={maxCashRedeemed}
            value={cashSlider}
            onChange={(val) => setCashSlider(val)}
          >
            <NumberInputField />
          </NumberInput>
        </GridItem>
        <Slider
          aria-label="cash-slider"
          colorScheme="primary"
          min={0}
          max={maxCashRedeemed}
          focusThumbOnChange={false}
          value={cashSlider}
          onChange={(val) => setCashSlider(val)}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb borderWidth="2px" borderColor="primary.600" />
        </Slider>
        <GridItem justifySelf="baseline">
          <Button
            maxW="xs"
            onClick={handleCashRedeem}
            disabled={maxCashRedeemed <= 0}
          >
            Redeem
          </Button>
        </GridItem>
      </SimpleGrid>
    </Box>
  );
}

export default CheckoutPoints;
