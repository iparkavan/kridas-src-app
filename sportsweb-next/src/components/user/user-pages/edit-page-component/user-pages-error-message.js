import React from "react";
// import styles from '../styles/Style-video.module.css';
// import styles from '../../../../../src/components/user/user-pages/Styles-video.module.css'
import { MdErrorOutline } from "react-icons/md";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Box,Text
  } from '@chakra-ui/react'
import { usePage } from "../../../../hooks/page-hooks";
import { useRouter } from "next/router";

function ErrorMsg(){
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);

return(

    <>
             <Box  w={["4xl", "4xl", "7xl"]}>
                <Alert status='warning' borderRadius={50}>
                <MdErrorOutline size={30} />
                <Text pl={10}>
             Page created. Complete and verify your <b>{pageData["company_name"]}</b> profile page.<br/>
            Verified pages are eligible to get sponsorship benefits, host tournaments and more
                </Text>
                </Alert>
            </Box>
</>


)

}
export default ErrorMsg