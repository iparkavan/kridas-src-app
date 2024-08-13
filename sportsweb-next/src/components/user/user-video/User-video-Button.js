import {
  Button,Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
 useDisclosure,
Flex,Text,VStack
} from  "@chakra-ui/react";
import { RiComputerLine } from "react-icons/ri";
import {IoMdPhotos} from "react-icons/io"

import styles from '../user-video/Style-video.module.css';

import { BsThreeDots,FiHeart,BsCamera } from "react-icons/bs";

function Eg() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
    
  <BsCamera
    as Button
    border="1px solid grey"
    w={{ base: "full", md: "min-content" }}
    color="#888da8"
    bg="transparent"
    size={20}
    onClick={onOpen}
    className={styles.btnclr}
  />
          
 <Modal onClose={onClose} size="xl" isOpen={isOpen}>
    <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Header Photo</ModalHeader>
        <ModalCloseButton />
      <ModalBody>
        <Flex >
         <VStack w="50%" align="center" cursor="pointer">
          <RiComputerLine className={styles.Icon} />
            <Text className={styles.AddText}>Upload Videos</Text>
             <Text className={styles.AddText} style={{color:"#888da8"}}>Browse your computer</Text>
         </VStack>
            <VStack w="50%" align="center" cursor="pointer">
              <IoMdPhotos className={styles.Icon} />
              <Text className={styles.AddText}>Choose from My Videos</Text>
               <Text className={styles.AddText} style={{color:"#888da8"}}>Choose from your uploaded videos</Text>
        </VStack>
       </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
   </Modal>
   </>
  )
}

export default Eg;
