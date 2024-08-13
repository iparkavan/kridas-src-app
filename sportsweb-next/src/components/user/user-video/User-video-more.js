import React from 'react';
// import styles from '../components/Style-video.module.css';
// import styles from './Style-video.module.css';
import styles from '../user-video/Style-video.module.css';

import { Box } from "@chakra-ui/react"
import { Flex, Spacer } from '@chakra-ui/react'
import { formatDistance } from 'date-fns';
import { Grid, GridItem,Center,Button } from '@chakra-ui/react'
import { Stack, HStack, VStack,Container,Heading,AspectRatio,Image ,SimpleGrid,Text,Circle,  CircularProgress} from '@chakra-ui/react'
import { AddIcon,SmallAddIcon } from '@chakra-ui/icons'
import { AiFillPlayCircle } from "react-icons/ai";
import { vd_t } from './User-video-sample-data';
import { useRef,useState } from "react";
import { useInfiniteUserVideo} from '../../../hooks/media-hooks'
import { useUser } from "../../../hooks/user-hooks";
import { useIntersectionObserver } from "../../../hooks/common-hooks";



function More() {
  const [show, setShow] = useState("video");
  const { data: userData = {} } = useUser();
  const loadMoreRef = useRef();
console.log("test user data--->",userData)
  const {
    data: videosData = [],
    hasNextVideo,
    fetchNextVideo,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteUserVideo(userData["user_id"]);

  const dateAgo = (date) => {
		return formatDistance(new Date(date), new Date(), { addSuffix: true });
	};

  useIntersectionObserver({
    target: loadMoreRef,
    onIntersect: fetchNextVideo,
    enabled: !!hasNextVideo,
  });
  console.log("check more video page:---->",videosData)
  return (
      <>
   <VStack w="full" mt={[300,300,0]} >
      <Box  w="full"  mt={4} bg="white" height={120} borderRadius={10} padding={10}>
      <Flex  >
              <Box p='2'>
              <Heading size='md' color="black">{userData["full_name"]}</Heading>
               </Box>
              <Spacer />
          <Box>
              <Button rightIcon={<SmallAddIcon/>} bg='#ff7658' w="170px"  h="50px" variant='solid'
                  _hover={{
                      bg: 'orange',
                  }}
                  color="white"
                  >
                  upload
              </Button>
          </Box>
      </Flex>
   </Box>

          <Box pt={4} w="full" justifyContent="center" >
          {show === "video" && videosData ? (
          <Box>
            {isLoading ? (
              "Loading..."
            ) : error ? (
              "An error has occurred: " + error.message
            ) : (
              <SimpleGrid columns={4} w="full" gap={2}>
                 {videosData?.pages?.map((page, idx) => {
                  return page?.content?.map(({ media_url, media_id,updated_date, }) => (
                    <GridItem w='100%' minHeight="100%" bg='white'  colSpan={{ base: 4,md:2,lg:2,xl:1 }} key={idx}>
                      

                      <Box mb={2} className={styles.PhotoContainer}>
                    <AspectRatio
                    maxW='400px' ratio={4 / 3}
                    >
                       <Box
                          as='video'
                          controls
                          src={media_url}
                          poster={media_url}
                          alt='Big Buck Bunny'
                          objectFit='contain'
                      />
                   </AspectRatio>
                      <Box ml={4} mt={6}>
                        <Heading size={20}>{"Test"}</Heading><Text>{dateAgo(updated_date)}</Text>
                        </Box>
                        {/* <Box  h={230} w="100%" className={styles.HoverContainer}  textAlign="center" pt="30%" >
                          <Center>
                            <VStack>
                            <Circle h={20} w={20} bg="#ffaa66">
                                <AiFillPlayCircle size={90} />
                            </Circle>
                            <h1>Videos</h1>
                            </VStack>
                          </Center>
                      </Box> */}
                     </Box>
                      <span ref={loadMoreRef} />
                      {isFetchingNextPage && (
                  <CircularProgress
                    alignSelf="center"
                    isIndeterminate
                    size="24px"
                  />
               )}
                    </GridItem>
                  ));
                })}
              </SimpleGrid>
            )}
          </Box>
        ) : (
          <Box>
            <SimpleGrid columns={4} w="full" gap={2}>
              No Records found 
            </SimpleGrid>
          </Box>
        )}




        {/* {vd_t.map((data,index) => ( 

              <GridItem w='100%' minHeight="100%" bg='white'  colSpan={{ base: 4,md:2,lg:2,xl:1 }} key={index}>
                   <Box mb={2} className={styles.PhotoContainer}>
                    <AspectRatio
                    maxW='400px' ratio={4 / 3}
                    >
                   <Image  src={data.tumbnail} alt='celebration' objectFit='cover' />
                   </AspectRatio>
                      <Box ml={4} mt={6}>
                        <Heading size={20}>{data.heading}</Heading><Text>{data.title}</Text>
                        </Box>
                        <Box  h={230} w="100%" className={styles.HoverContainer}  textAlign="center" pt="30%" >
                          <Center>
                            <VStack>
                            <Circle h={20} w={20} bg="#ffaa66">
                                <AiFillPlayCircle size={90} />
                            </Circle>
                            <h1>Videos</h1>
                            </VStack>
                          </Center>
                      </Box>
                     </Box>
              </GridItem>


        ))} */}
        </Box>
  </VStack>


      </>
  )
}

export default More;
