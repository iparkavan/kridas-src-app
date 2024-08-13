import React from "react";

import { Stack, HStack, VStack,Container,Grid,GridItem,Flex,Spacer ,StackDivider} from '@chakra-ui/react'
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Input
    ,Textarea
  } from '@chakra-ui/react'
  import { Avatar, AvatarBadge, AvatarGroup,AspectRatio} from '@chakra-ui/react'
  import { SimpleGrid,Box } from '@chakra-ui/react'
  import { Heading,Text,Icon} from '@chakra-ui/react'
  import { PhoneIcon, AddIcon, WarningIcon,ChatIcon,ExternalLinkIcon ,StarIcon,DragHandleIcon} from '@chakra-ui/icons'
  // import styles from "../components/Style-video.module.css";
  // import styles from './Style-video.module.css';
  import styles from '../user-video/Style-video.module.css';
  import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
      Image
  } from '@chakra-ui/react'
  
  import {
    MenuItem,
    Menu,
    MenuButton,
    MenuList,
    useColorModeValue,
  } from "@chakra-ui/react";

  import {
    Button,Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
   useDisclosure,
  
  } from  "@chakra-ui/react";
  import { RiComputerLine } from "react-icons/ri";
  import {IoMdPhotos} from "react-icons/io"
 
  
  // import img from '../public/img.jpg'
  // import { FaBeer } from 'react-icons/fa';
  import { BsThreeDots,FiHeart,BsCamera } from "react-icons/bs";
  import { BiHeart,BiCommentDetail,BiPaperPlane } from "react-icons/bi";
  import { useBoolean } from '@chakra-ui/react'
 
// import {Video} from "../videos/components/User-video-video_gal"
// import Video from '../components/User-video-video_gal';
// import Eg from '../components/User-video-Button';
import Video from "./User-video-video_gal"
import Eg from "./User-video-Button"
//  import cam from "../component/cameraIcon";
// import {Eg} from "../videos/components/User-video-Button";
 

function FormUi(){
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpened, onOpened, onClosed } = useDisclosure();
return(
    <>
    
      <VStack w={[20,'lg',"full"]} h="full" justifyContent="center" 
       alignItems="flex-start" >
           <Video/>
      </VStack>
        <VStack w={["40vh","60vh","80vh"]} h="full"  p={2} spacing={6} alignItems="flex-start" bg="white">
          <Box mt={2}>
            <Grid
            // templateRows='repeat(2, 1fr)'
            templateColumns='repeat(5, 1fr)'
            gap={10}
            mt={3}
            pl={2} 
            pr={2}
            >
            <GridItem colSpan={1} ><Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' /></GridItem>
            <GridItem colSpan={3} ><Heading size={15}>Sathish Buwanesh</Heading><Text>2 hours ago</Text></GridItem>
              <GridItem>
                <Box>
                      <Menu isOpen={isOpen}>
                      <MenuButton
                        variant="ghost"
                        mx={1}
                        py={[1, 2, 2]}
                        px={4}
                        borderRadius={5}
                        _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
                        aria-label="More"
                        fontWeight="normal"
                        onMouseEnter={onOpen}
                        onMouseLeave={onClose}
                      >
                        <BsThreeDots size={25}/>
                      </MenuButton>
                      <MenuList onMouseEnter={onOpen} onMouseLeave={onClose}>
                        <MenuItem>Edit Post</MenuItem>
                        <MenuItem>Delete Post</MenuItem>
                        <MenuItem>Turn Off Notifications</MenuItem>
                        <MenuItem>Select as Featured</MenuItem>
                      </MenuList>
                    </Menu>
                </Box>
              </GridItem>
             </Grid>         
          </Box> 
                      <Box>
                           <VStack
                              divider={<StackDivider borderColor='gray.200' />}
                              spacing={2}
                              align='stretch'
                            >
                              <Box  pl={4} pr={4}>
                              
              <Text pb={3}  color="#C5C5C5">Last Saturday we went with <text>Mathilda Brinker</text> to the “Rock Garden Festival” and had a blast! Here’s a small video of one of us in the crowd.</Text>
             
                              </Box>
                              <Box py={[2,3,4]}>
                              <Grid
                              // templateRows='repeat(2, 1fr)'
                              templateColumns='repeat(5, 1fr)'
                              gap={30}
                              mt={2}
                              pl={2} 
                              pr={2}
                              
                              >
                                <GridItem rowSpan={1} colSpan={1}  >
                                  <Box 
                                  _hover={{
                                    color:"orange"
                                  }}
                                  >
                                    <Flex flexDirection="row">
                                          <Icon boxSize={10} ><BiHeart/></Icon>
                                          <Text>12</Text>
                                    </Flex>
                                </Box>
                              </GridItem>
                              <GridItem colSpan={3} >
                                  <Box _hover={{
                                    color:"orange"
                                  }}>
                                    <Flex flexDirection="row">
                                      <Icon boxSize={10} ><BiCommentDetail/></Icon>
                                      <Text>12</Text>
                                  </Flex> 
                                </Box>
                            </GridItem>
                            <GridItem>
                                <Box _hover={{
                                  color:"orange"
                                }}>
                                <Flex flexDirection="row">
                                          <Icon boxSize={10} ><BiPaperPlane/></Icon>
                                          <Text>12</Text>
                                </Flex> 
                                </Box>
                              </GridItem>
                          </Grid> 
                              </Box>
                              <Box h='100px' overflow="scroll" className={styles.noBar} py={5}>

                              <Box>
                                    <Grid
                                    // templateRows='repeat(2, 1fr)'
                                    templateColumns='repeat(5, 1fr)'
                                    gap={10}
                                    mt={3}
                                    pl={2} 
                                    pr={2}
                                    >
                                    <GridItem colSpan={1}  pt={1}  ><Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' /></GridItem>
                                    <GridItem colSpan={3} ><Heading size={15}>Sathish Buwanesh</Heading><Text>2 hours ago</Text></GridItem>
                                      <GridItem>
                                        <Box>
                                                <Popover>
                                                <PopoverTrigger>
                                                  <Box
                                                    tabIndex='0'
                                                    role='button'
                                                    aria-label='Some box'
                                                    p={3}
                                      
                                                  >
                                                  <Icon
                                                    role="button"
                                                    boxSize={10}
                                                    _hover={{
                                                      color:"orange"
                                                    }}
                                                    >
                                                    <BsThreeDots/>
                                                  </Icon>
                                                  </Box>
                                                </PopoverTrigger>
                                                <PopoverContent bg='white' color='black'>
                                                  <PopoverBody>
                                                    <VStack textAlign="left">
                                                      <Box as='button' h='40px' w="100%">
                                                      <Text >Edit post</Text>
                                                      </Box>
                                                    <Box as='button' h='40px'w="100%" >
                                                    <Text>Delete post</Text>
                                                    </Box>
                                                    <Box as='button' h='40px' w="100%">
                                                    <Text>Turn off Notifications</Text>
                                                    </Box>
                                                    <Box as='button' h='40px' w="100%">
                                                      Select as Feature
                                                    </Box>
                                                    </VStack>
                                                  </PopoverBody>
                                                </PopoverContent>
                                              </Popover>
                                        </Box>
                                      </GridItem>
                                    </Grid>         
                                  </Box> 
                                      
                      <Box>
                      <VStack
                         divider={<StackDivider borderColor='gray.200' />}
                         spacing={4}
                         align='stretch'
                       >
                         <Box  pl={4} pr={4}>
                         
         <Text pb={3}  color="#C5C5C5">Last Saturday we went with <text>Mathilda Brinker</text> to the “Rock Garden Festival” and had a blast! Here’s a small video of one of us in the crowd.</Text>
        
                         </Box>
                         <Box py={6}>
                         <Grid
                         // templateRows='repeat(2, 1fr)'
                         templateColumns='repeat(5, 1fr)'
                         gap={30}
                         mt={2}
                         pl={2} 
                         pr={2}
                         >
                           <GridItem rowSpan={1} colSpan={1}  >
                             <Box 
                             _hover={{
                               color:"orange"
                             }}
                             >
                               <Flex flexDirection="row">
                                     <Icon boxSize={10} ><BiHeart/></Icon>
                                     <Text>12</Text>
                               </Flex>
                           </Box>
                         </GridItem>
                         <GridItem colSpan={3} >
                             <Box _hover={{
                               color:"orange"
                             }}>
                               <Flex flexDirection="row">
                                 <Icon boxSize={10} ><BiCommentDetail/></Icon>
                                 <Text>12</Text>
                             </Flex> 
                           </Box>
                       </GridItem>
                       <GridItem>
                           <Box _hover={{
                             color:"orange"
                           }}>
                           <Flex flexDirection="row">
                                     <Icon boxSize={10} ><BiPaperPlane/></Icon>
                                     <Text>12</Text>
                           </Flex> 
                           </Box>
                         </GridItem>
                     </Grid> 
                         </Box>
                       </VStack>
                     </Box>
                         </Box>
                         <Box >
                             <Grid
                              // templateRows='repeat(1, 1fr)'
                              templateColumns='repeat(6, 1fr)'
                              gap={2}
                              mt={8}
                              ml={2}
                              mr={2}  
                            >
                              <GridItem  pt={2} ><Avatar name='Dan Abrahmov' src='https://bit.ly/dan-abramov' /></GridItem> 
                              <GridItem colSpan={4} >
                            <Box position="relative" w="full">
                            <Textarea
                            placeholder="Please Enter to Post"
                            size="sm"
                            _focus={{ borderColor: "#FF763A"}}
                          />
                            </Box>
                            </GridItem>
                              <GridItem  mt={14}>
                              <Eg 
                              />
                              </GridItem>
                            </Grid>       
               </Box>
                          </VStack>
                    </Box>
        </VStack>
    </>
       
     
)
}
export default FormUi