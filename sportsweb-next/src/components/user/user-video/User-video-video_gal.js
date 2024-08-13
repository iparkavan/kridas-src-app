import React from "react";
import { Stack, HStack, VStack,Container,Center,Circle,Heading,AspectRatio,Image,Box,StackDivider,Grid,GridItem} from '@chakra-ui/react'
// import image from '../public/img.jpg';
// import img from  '../public/image1.jpg'
// import styles from '../components/Style-video.module.css'
// import styles from './Style-video.module.css';
import styles from '../user-video/Style-video.module.css';
import { AiFillPlayCircle } from "react-icons/ai";
function Video(){
return(
    <>   
    <Box className={styles.PhotoContainer}>
    <Box className={styles.HoverContainer}   textAlign="center" pt="30%" >
        <Center>
          <VStack>
           <Circle h={20} w={20} bg="#ffaa66">
              <AiFillPlayCircle size={90}/>
           </Circle>
           <h1>Sathish</h1>
           <Heading>{"here need to put the data"}</Heading>
          </VStack>
        </Center>
    </Box>
      <Image
        boxSize="250"
        w="full"
        h={["150px","200px","full"]}
        objectFit="cover"
        src='https://bit.ly/dan-abramov'
        borderRadius="5px"
        alt="image"
      />
  </Box>

       
     
    </>

 
)

}
export default Video