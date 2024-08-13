import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  useCreateFollower,
  useRemoveFollower,
} from "../../../hooks/follower-hook";
// import { useEventById } from "../../../hooks/event-hook";
import { useUser } from "../../../hooks/user-hooks";
// import { Button } from "@chakra-ui/react";
import { FillHeartIcon } from "../../ui/icons";
import { useEventById, useEventFollowersData } from "../../../hooks/event-hook";
import { HeartIcon } from "../../ui/icons";
import Button from "../../ui/button";
import Tooltip from "../../ui/tooltip";
import { Text } from "@chakra-ui/react";
import IconButton from "../../ui/icon-button";
const EventInterest = ({ type, eventData }) => {
  const { data: userData = {} } = useUser();

  // const currentEvent = userData?.["user_id"] === eventDataNew?.createdBy;

  const { mutate: followMutate } = useCreateFollower();
  const { mutate: unfollowMutate } = useRemoveFollower();
  const [following, setFollowing] = useState();

  useEffect(() => {
    let isFollowing = eventData?.userInterested === 1 ? 1 : 0;
    setFollowing(isFollowing);
  }, [eventData?.userInterested]);

  // useEffect(() => {
  //   let isFollowing = eventFollowersData?.followerList?.find(
  //     (event) => event.id === userData?.user_id
  //   );
  //   setFollowing(isFollowing);
  // }, [userData, eventFollowersData?.followerList]);

  function handleFollow() {
    const following_event_id = eventData?.eventId;
    const follower_userid = userData["user_id"];

    followMutate(
      {
        following_event_id,
        follower_userid,
        type: "event-follower",
      },
      {
        onSuccess: () => {
          setFollowing(true);
        },
      }
    );
  }

  function handleUnfollow() {
    const following_event_id = eventData?.eventId;
    const follower_userid = userData["user_id"];

    unfollowMutate(
      {
        following_event_id,
        follower_userid,
        type: "event-follower",
      },
      {
        onSuccess: () => {
          setFollowing(false);
        },
      }
    );
  }

  return (
    <>
      {following ? (
        type === "list" ? (
          <IconButton
            icon={<FillHeartIcon size={25} />}
            colorScheme="red"
            variant="ghost"
            onClick={() => handleUnfollow()}
          />
        ) : (
          <Button
            rightIcon={<FillHeartIcon />}
            colorScheme="blue"
            variant="outline"
            onClick={() => handleUnfollow()}
          >
            Interested
          </Button>
        )
      ) : type === "list" ? (
        <IconButton
          icon={<HeartIcon size={23} />}
          colorScheme="red"
          variant="ghost"
          onClick={() => handleFollow()}
        />
      ) : (
        <Button
          rightIcon={<HeartIcon />}
          colorScheme="blue"
          variant="outline"
          onClick={() => handleFollow()}
          // disabled={currentEvent && true}
          // tooltipLabel={
          //   eventData?.length > 0 && "Unable to delete when teams are enrolled"
          // }
          // tooltipProps={{ shouldWrapChildren: true }}
        >
          Interest
        </Button>
      )}
    </>
  );
};

export default EventInterest;
