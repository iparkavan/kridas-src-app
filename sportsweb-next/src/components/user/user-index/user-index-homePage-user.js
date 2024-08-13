import React from 'react'
import ViewHomepageAsUserHeader from './user-index-header-user'
import { useUser } from '../../../hooks/user-hooks';
import { useRouter } from 'next/router';
import MyEditor from '../user-feeds/user-feed-Editor';
import { SamplePhotos } from '../user-photos/sampledata';
import { vd_t } from '../user-video/User-video-sample-data';
import { feeds } from './user-index-sample-data';
import FeedItem from './user-index-feed-item'
import { usePage } from '../../../hooks/page-hooks';

import styles from "../user-index/user-index.module.css"
import {
  Text,
  Box,
  Flex,
  Image,
  VStack,
  Button,
  Avatar,
  HStack,
  Textarea,
  Spacer,
  SimpleGrid,
  GridItem,Progress, Heading,StackDivider, Center,Radio,Link,Input
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { BiChevronLeftCircle,BiChevronRightCircle,BiLike,BiCommentDetail } from "react-icons/bi";
import { BsBorderBottom, BsFillHandThumbsUpFill, BsFillHeartFill,BsShareFill} from "react-icons/bs";
// import { FcLike,BsFillHeartFill } from "react-icons/fc";
import UserHomepageview from '../user-pages/edit-page-component/user-pages-homepageview';
function ViewHomepageAsUser(props) {
  const router = useRouter();
  const { pageId } = router.query;
  const { data: pageData = {} } = usePage(pageId);
  return (
<>

    <ViewHomepageAsUserHeader {...props}/>

</>
  )
}

export default ViewHomepageAsUser