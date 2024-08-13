import React, { useState, useEffect } from "react";
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

import Tooltip from "../../ui/tooltip";

import IconButton from "../../ui/icon-button";

function PageFollowCard({ pageId }) {
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
        <IconButton
          colorScheme="primary"
          leftIcon={<TickIcon />}
          fontWeight="normal"
          onClick={() => handleUnfollow()}
        />
      ) : (
        <Tooltip
          label={currentPage && true && "Unable to Follow own pages"}
          shouldWrapChildren={true}
        >
          <IconButton
            colorScheme="primary"
            leftIcon={<AddIcon />}
            fontWeight="normal"
            onClick={() => handleFollow()}
          />
        </Tooltip>
      )}
    </>
  );
}

export default PageFollowCard;
