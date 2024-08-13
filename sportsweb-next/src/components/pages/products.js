import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { TextSmall } from "../ui/text/text";

function ProductsList({ products }) {
  return (
    <Box bg="white">
      <Grid templateColumns="repeat(4, 1fr)" gap={4}>
        {products.map((data) => {
          return (
            <>
              <VStack bg="gray.200" p={3}>
                <Box>
                  <Image src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
                </Box>
                <Text>{data.name}</Text>
                <Text>Price:{data.price}</Text>
                {/* <TextSmall>Description:{data.description}</TextSmall> */}
              </VStack>
            </>
          );
        })}
      </Grid>
    </Box>
  );
}

export default ProductsList;
