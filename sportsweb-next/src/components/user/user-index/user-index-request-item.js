import { Flex, Avatar, VStack, Text, Button, Spacer } from "@chakra-ui/react";

function RequestItem({name,mutual,user_image})
{
 return (
       <Flex w="full" p={3} align="flex-start" gap={3}>
              <Avatar
                  size="sm"
                  name={name}
                src={user_image}
                objectFit="cover"
              />
              <VStack spacing={1} align="flex-start">
                  <Text>{name}</Text>
                  <Text>{mutual} {mutual==1 ? 'mutual connection' : 'mutual connections'}</Text>
                <Flex gap={3}>
                  <Button p={0} fontSize="14px" variant="ghost" colorScheme="blue">
                    APPROVE
                  </Button>
                  <Button p={0} fontSize="14px" variant="ghost" colorScheme="blue">
                    DELETE
                  </Button>
                </Flex>
              </VStack>
              <Spacer />
<Text>2d</Text>
            </Flex>



)


}

export default RequestItem;