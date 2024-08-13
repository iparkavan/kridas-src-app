import {
  Box,
  HStack,
  Image,
  Input,
  SimpleGrid,
  VStack,
} from "@chakra-ui/react";
import Button from "../../ui/button";
import { HeadingMedium } from "../../ui/heading/heading";
import { Share } from "../../ui/icons";
import LabelText from "../../ui/text/label-text";
import { TextMedium } from "../../ui/text/text";
import FieldLayout from "../../user/profile-section/user-profile-edit/field-layout";

function VoucherCash() {
  return (
    <div>
      <SimpleGrid
        p={5}
        bg="white"
        columns={2}
        h="500px"
        mt={10}
        boxShadow="2xl"
        w="1000px"
        borderRadius="lg"
      >
        <VStack>
          <Box>
            <Box
              p={15}
              w="460px"
              h="250px"
              mt={10}
              textAlign="center"
              color="white"
              boxShadow="2xl"
              mr={5}
            >
              <Image src="/images/voucher.png" alt="" objectFit="contain" />
            </Box>
          </Box>
        </VStack>
        <Box>
          <Box>
            <VStack alignItems="justify" mt={5}>
              <HStack gap={60}>
                <LabelText fontSize="2xl">Cash Vocher</LabelText>{" "}
                <Button variant="outline" leftIcon={<Share />}>
                  Share
                </Button>
              </HStack>

              <VStack alignItems="justify">
                <HeadingMedium>2000 INR</HeadingMedium>
                <TextMedium>
                  This is an Inr 2500 cash vocher to be reduced at the above
                  mentioned retail outlet
                </TextMedium>

                <FieldLayout label=" Valid Till:">
                  <TextMedium>31-Dec-2022</TextMedium>
                </FieldLayout>
                <FieldLayout label=" Sports:">
                  <TextMedium>General</TextMedium>
                </FieldLayout>
                <FieldLayout label="  Terms & Conditions:">
                  <VStack>
                    <TextMedium>
                      1.Lorem ipsum dolor sit amet constructor
                    </TextMedium>
                    <TextMedium>
                      2.Morbi ipsum dolor sit amet constructor
                    </TextMedium>
                    <TextMedium>
                      2.Morbi ipsum dolor sit amet constructor
                    </TextMedium>
                  </VStack>
                </FieldLayout>
                <FieldLayout label=" Quantity:">
                  <Input type="text" placeholder="1" w={20} />
                </FieldLayout>
              </VStack>
            </VStack>
          </Box>

          <HStack mt={10} marginLeft={10}>
            <Button type="submit" colorScheme="primary">
              Buy vocher
            </Button>
            <Button colorScheme="primary">Add to Cart</Button>
            <Button colorScheme="primary" variant="outline">
              Close
            </Button>
          </HStack>
        </Box>
      </SimpleGrid>
    </div>
  );
}
export default VoucherCash;
