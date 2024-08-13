import React, { useRef } from "react";
import { TabList, Tab } from "@chakra-ui/react";

const UserProfileCommonTabList = (props) => {
  const followerRef = useRef();
  const aboutRef = useRef();
  /*  const photosRef = useRef();
  const videosRef = useRef(); */

  const selectedTab = {
    borderBottom: "solid",
    borderColor: "primary.500",
    color: "primary.500",
  };

  if (props.isFollowClicked) followerRef.current.click();
  if (props.isAboutClicked) {
    aboutRef.current.click();
  }
  /*   if (props.isPhotosClicked) {
    photosRef.current.click();
    props.setIsPhotosClicked(false);
  }
  if (props.isVideosClicked) {
    videosRef.current.click();
    props.setIsVideosClicked(false);
  }
 */
  return (
    <TabList gap={5} color="gray.500" bg="white" pt={1}>
      <Tab _selected={selectedTab} _focus={{ boxShadow: "none" }}>
        Posts
      </Tab>
      <Tab
        _selected={selectedTab}
        _focus={{ boxShadow: "none" }}
        ref={aboutRef}
      >
        About
      </Tab>
      <Tab
        _selected={selectedTab}
        ref={followerRef}
        _focus={{ boxShadow: "none" }}
      >
        Followers
      </Tab>
      <Tab
        _selected={selectedTab}
        /*      ref={photosRef} */
        _focus={{ boxShadow: "none" }}
      >
        Photos
      </Tab>
      <Tab
        /*     ref={videosRef} */
        _selected={selectedTab}
        _focus={{ boxShadow: "none" }}
      >
        Videos
      </Tab>
    </TabList>
  );
};

export default UserProfileCommonTabList;
