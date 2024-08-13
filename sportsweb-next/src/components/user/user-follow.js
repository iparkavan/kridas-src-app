import { useState, useEffect } from "react";

import {
  useCreateFollower,
  useRemoveFollower,
} from "../../hooks/follower-hook";
import { useUserFollowersById } from "../../hooks/user-hooks";
import { useUser } from "../../hooks/user-hooks";
import Button from "../ui/button";
import { TickIcon, AddIcon } from "../ui/icons";

function UserFollow({ userData }) {
  const { data: userIdData = {} } = useUser();
  const { data: userFollowerId = {} } = useUserFollowersById(
    userIdData.user_id
  );
  const { mutate: followMutate } = useCreateFollower();
  const { mutate: unfollowMutate } = useRemoveFollower();
  const [following, setFollowing] = useState();

  useEffect(() => {
    let isFollowing = userFollowerId?.following?.find(
      (user) => user.id == userData["user_id"]
    );
    setFollowing(isFollowing);
  }, [userData, userFollowerId?.following]);

  function handleFollow() {
    const following_userid = userData["user_id"];
    const follower_userid = userIdData["user_id"];

    followMutate(
      {
        following_userid,
        follower_userid,
        type: "user-follower",
      },
      {
        onSuccess: () => {
          setFollowing(true);
        },
      }
    );
  }

  function handleUnfollow() {
    const following_userid = userData["user_id"];
    const follower_userid = userIdData["user_id"];

    unfollowMutate(
      {
        following_userid,
        follower_userid,
        type: "user-follower",
      },
      {
        onSuccess: () => {
          setFollowing(false);
        },
      }
    );
  }

  return following ? (
    <Button leftIcon={<TickIcon />} onClick={() => handleUnfollow()}>
      Following
    </Button>
  ) : (
    <Button leftIcon={<AddIcon />} onClick={() => handleFollow()}>
      Follow
    </Button>
  );
}

export default UserFollow;
