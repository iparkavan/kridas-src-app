import { useRouter } from "next/router";
import React, { useRef, useState, useEffect } from "react";
import {
  useCreateFollower,
  useRemoveFollower,
} from "../../../hooks/follower-hook";
import { usePage } from "../../../hooks/page-hooks";
import { useUser } from "../../../hooks/user-hooks";
import { usePageFollowersData } from "../../../hooks/page-hooks";
// import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { TickIcon } from "../../ui/icons";
import Button from "../../ui/button";
import Tooltip from "../../ui/tooltip";

function PageFollow({ pageId }) {
  /*   const router = useRouter();
  const { pageId } = router.query; */
  const { data: pageData = {} } = usePage(pageId);
  const { data: userData = {} } = useUser();
  const { mutate: followMutate } = useCreateFollower();
  const { mutate: unfollowMutate } = useRemoveFollower();
  const [following, setFollowing] = useState();
  const { data: pageFollowersData = {} } = usePageFollowersData(pageId);

  const currentPage = userData?.["user_id"] === pageData?.created_by;

  useEffect(() => {
    let isFollowing = pageFollowersData?.companyFollower?.find(
      (page) => page.id === userData?.user_id
    );
    setFollowing(isFollowing);
  }, [userData, pageFollowersData?.companyFollower]);

  function handleFollow() {
    const following_companyid = pageId;
    const follower_userid = userData["user_id"];

    followMutate(
      {
        following_companyid,
        follower_userid,
        type: "page-follower",
      },
      {
        onSuccess: () => {
          setFollowing(true);
        },
      }
    );
  }

  function handleUnfollow() {
    const following_companyid = pageData["company_id"];
    const follower_userid = userData["user_id"];

    unfollowMutate(
      {
        following_companyid,
        follower_userid,
        type: "page-follower",
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
        <Button
          colorScheme="primary"
          leftIcon={<TickIcon />}
          fontWeight="normal"
          onClick={() => handleUnfollow()}
        >
          Following
        </Button>
      ) : (
        <Tooltip
          label={currentPage && true && "Unable to Follow own pages"}
          shouldWrapChildren={true}
        >
          <Button
            colorScheme="primary"
            leftIcon={<AddIcon />}
            fontWeight="normal"
            onClick={() => handleFollow()}
            // disabled={currentPage && true}
            // tooltipProps={{ shouldWrapChildren: true }}
            // tooltipLabel={currentPage && true && "Unable to follow own pages"}
          >
            Follow
          </Button>
        </Tooltip>
      )}
    </>
  );
}

export default PageFollow;
