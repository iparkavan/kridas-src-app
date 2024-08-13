import {
  Text,
  Box, 
  Button,
  ListItem,
  List,
  ListIcon,
  OrderedList,
  Link,
  Stack,
  VStack,
  HStack,
} from '@chakra-ui/react';

import { TwitterIcon, FacebookIcon } from "../../ui/icons";
//import PagesLayout from "./edit-page-component/HeaderDsgn";/*to import layout design*/

const EditSocialLinkPage = () =>{
    return(
    <>
      <HStack spacing={50} >
        <Box w=" 44px" bg="white" h="1260px" borderRadius="0px" /> 
        <Stack width= "full">
            <Box  height= "292px"  width= "981px" bg="white">
                <VStack alignItems= "flex-start" ml= {6} mt={6} spacing={6}>
                  <Button
                    color="#2F80ED"
                    background="#FFFFFF"
                    border="1px solid #2F80ED"
                    borderRadius="2px"
                    w="120px"
                    h="40px"
                    >
                    Edit
                  </Button>
                  <Text
                  color= "#000000"
                  fontSize= "18px"
                  fontWeight= "bold"
                  >
                  Social Media Presence
                  </Text>  
                  <List >
                    <OrderedList >
                      <VStack spacing={5} alignItems= "flex-start"><ListItem >
                        < ListIcon as={TwitterIcon}  />
                        <Link  color="#2F80ED"  href='#'>twitter.com/dashaplays</Link>
                      </ListItem>
                      
                      <ListItem  >
                        < ListIcon as={FacebookIcon} />
                        <Link color="#2F80ED" href='#'>facebook.com/dashaplays </Link>
                      </ListItem>
                      </VStack>
                    </OrderedList>
                  </List>   
                </VStack>
              </Box>
          </Stack>
        <Box w=" 44px" bg="white" h="1260px" borderRadius="0px"/>
      </HStack>
    </>

  );
};

export default EditSocialLinkPage;