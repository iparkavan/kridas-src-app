import React, { useRef, useState } from "react";
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
// import { usePage} from '../../../hooks/user-hooks';
import { usePage } from "../../../hooks/page-hooks";
import { useRouter } from 'next/router';
import PictureModal from '../../common/picture-modal';
import { EditIcon } from "../../ui/icons";
import Router from "next/router";
// import styles from '../user-index/user-index.module.css';
import { BsArrowLeft } from "react-icons/bs";
import VerifyProfileCompleteModal from "../../common/user-pages-verification-workflow/user-pages-verify-profilecomplete";
import VerifyProfileIncompleteModal from "../../common/user-pages-verification-workflow/user-pages-verify-profileincomplete";


function ViewHomepageAsUserHeader(props)
 {
const { isOpen, onOpen, onClose } = useDisclosure();
const {
    isOpen: isVerifyModalOpen,
    onOpen: onVerifyModalOpen,
    onClose: onVerifyModalClose,
  } = useDisclosure();
  
const router = useRouter();
const { pageId } = router.query;
const { data: pageData = {} } = usePage(pageId);
const isProfileDetailsFilled = true;

return (
<>

<Center >
    <Box  w='7xl' mt={5}>
        <Grid
            templateRows="repeat(2, 1fr)"
            templateColumns="repeat(6, 1fr)" >
            <GridItem
                colSpan={6}
                h='32'
                w={["100%", "100%", "100%"]}
                position="relative">
                <Image
                    h='32'
                    w="full"
                    src={pageData?.["company_img"] || "/images/cardImage.png"}
                    objectFit="cover"
                    alt="Cover image"
                    cursor="pointer"
                    onClick={onOpen}
                />
                <PictureModal
                    isOpen={isOpen}
                    onClose={onClose}
                    src={
                        pageData?.["company_img"] ||
                    "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                    }
                    alt="User cover image"
                />
                <Flex justifyContent={"flex-start"} mt={-14}  px={6} >
                    <HStack>
                        <Avatar
                            size={"xl"}
                            name={pageData?.["company_name"]}
                            src={
                                pageData?.["company_profile_img"] ||
                                "https://images.unsplash.com/photo-1612865547334-09cb8cb455da?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
                              }
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
                <Flex gap={10} mt='1.5'>
                    <Box>
                        <VStack
                        // divider={<StackDivider borderColor='gray.200' />}
                        spacing={0}
                        align="stretch"
                        ml={[5, 10, 140]}
                        >
                        <Box mt={2} w={80}  >  
                        <Heading size="md" color="black"  wordBreak='break-word' textOverflow='ellipsis'>
                            {pageData["company_name"]}
                          </Heading>
                      </Box>
                            <Box>
                                <Text>
                                {pageData["company_desc"]} {" "}
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
                    <Box>
                        <VStack
                        spacing={1}
                        align='center'>
                            <Box>
                                <Text><b>10 Following</b></Text>
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
                    <Box >
                        <Flex justify='center' gap={2} >
                            <Button colorScheme='blue' variant='outline' w='44' p={6} borderRadius='none'  onClick={onVerifyModalOpen}> 
                              Get ”Verified” Badge
                            </Button>
                            {isProfileDetailsFilled ? (
                                <VerifyProfileCompleteModal
                                  isOpen={isVerifyModalOpen}
                                  onClose={onVerifyModalClose}
                                />
                              ) : (
                                <VerifyProfileIncompleteModal
                                  isOpen={isVerifyModalOpen}
                                  onClose={onVerifyModalClose}
                                  name={userData.full_name}
                                />
                              )}
                        <VStack>
                            <Button colorScheme='blue' variant='outline' w='44' p={6}  borderRadius='none'>
                             Get Sponsorship
                            </Button>
                            <Box   onClick={() => router.push("/user/pages")}>
                                <Flex justify='flex-start' alignItems='center' gap={3}>
                                    <BsArrowLeft color='#2F80ED' />
                                    <Link color='#2F80ED'>Go to Pages List</Link>
                                </Flex>
                            </Box>
                        </VStack>   
                        </Flex>
                    </Box>
                </Flex>
            </GridItem>
        </Grid>
    </Box>
</Center>
</>
)
}

export default ViewHomepageAsUserHeader