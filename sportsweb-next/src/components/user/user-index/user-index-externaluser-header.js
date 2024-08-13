import {
    Flex,
    Box,
    Text,
    Grid,
    GridItem,
    Circle,
    Image,
    Avatar,
    VStack,
    Link,
    Wrap,
    WrapItem,
    Center,
    Heading,
    usePanGesture,
    Input,
    IconButton,
    useDisclosure,
    Stack,AvatarGroup,Button,Spacer,HStack
  } from "@chakra-ui/react";
import { MdModeEditOutline } from "react-icons/md";
import styles from '../user-index/user-index.module.css'
import { useUser} from '../../../hooks/user-hooks';
import { useRouter } from 'next/router';
import PictureModal from '../../common/picture-modal';
import { EditIcon } from "../../ui/icons";
// import styles from '../user-index/user-index.module.css';


function UserIndexExternalUserHeader() {
const { isOpen, onOpen, onClose } = useDisclosure();
const router = useRouter();
const { userId } = router.query;
const { data: userData = {} } = useUser(userId);
  return (
   <>
   <Box   w='100%'>
   <Grid
       templateRows="repeat(2, 1fr)"
       templateColumns="repeat(6, 1fr)">

       <GridItem
           colSpan={6}
           h='32'
           w={["100%", "100%", "100%"]}
           position="relative">
           <Image
               h='32'
               w="full"
               src={
               userData["user_img"] ||
               "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
               }
               objectFit="cover"
               alt="Cover image"
               cursor="pointer"
               onClick={onOpen}
           />
           <PictureModal
               isOpen={isOpen}
               onClose={onClose}
               src={
               userData["user_img"] ||
               "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
               }
               alt="User cover image"
           />
           <Flex justifyContent={"flex-start"} mt={-14}  px={6} >
               <HStack>
                   <Avatar
                       size={"xl"}
                       name={userData["full_name"]}
                       src={userData["user_profile_img"]}
                       alt={"User"}
                       css={{
                       border: "2px solid white",
                       }}
                       position="relative"
                       >
                   </Avatar>
               </HStack>
           </Flex>
       </GridItem>
       <GridItem  colSpan={6}
           h='100%'
           w={["100%", "100%", "100%"]}
           bg="white">
           <Flex gap={10} mt={2}>
               <Box>
                   <VStack
                   // divider={<StackDivider borderColor='gray.200' />}
                   spacing={0}
                   align="stretch"
                   ml={[5, 10, 115]}
                   >
                       <Box>
                           <Text>
                               <Heading size="md" color="black">
                                   {userData["full_name"]}
                               </Heading>
                           </Text>
                       </Box>
                       <Box>
                           <Text>
                            User{" "}
                           </Text>
                       </Box>
                   </VStack>
               </Box>
               <Box>
                   <VStack
                   spacing={1}
                   align='center'
                   >
                       <Box>
                        <Text><b>120 Followers</b></Text>
                       </Box>
                       <Box>
                           <AvatarGroup size='sm' max={3}>
                               <Avatar name='Ryan Florence' src='https://bit.ly/ryan-florence' />
                               <Avatar name='Segun Adebayo' src='https://bit.ly/sage-adebayo' />
                               <Avatar name='Kent Dodds' src='https://bit.ly/kent-c-dodds' />
                               <Avatar name='Prosper Otemuyiwa' src='https://bit.ly/prosper-baba' />
                               <Avatar name='Christian Nwamba' src='https://bit.ly/code-beast' />
                           </AvatarGroup>
                       </Box>             
                   </VStack>
               </Box>
               <Box mt='2'>
                   <Flex align='center' justify='center' gap={5} ml='36' >
                       <Button colorScheme='blue' variant='outline' w='44' p={6}  borderRadius='none'>
                           + Follow
                       </Button>
                   </Flex>
               </Box>
           </Flex>
       </GridItem>
   </Grid>
</Box>
   
   </>
  )
}

export default UserIndexExternalUserHeader