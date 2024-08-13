import { Box, MenuItem } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import { FacebookIcon, LinkedinIcon, TwitterIcon } from "../ui/icons";

const SocialMediaShareMenuList = (props) => {
  const {
    content,
    fbHashtag,
    twitterHashtags,
    twitterMention,
    redirectPath = null,
  } = props;
  const router = useRouter();
  const path = redirectPath || router.asPath;
  const [hostURL, setHostURL] = useState(null);

  useEffect(() => {
    setHostURL(window && window.location.origin);
  }, []);

  return (
    <>
      <FacebookShareButton
        url={`${hostURL}${path}`}
        quote={content}
        hashtag={fbHashtag}
        style={{ width: "100%" }}
      >
        <MenuItem icon={<FacebookIcon />} as={Box}>
          Share to Facebook
        </MenuItem>
      </FacebookShareButton>
      <TwitterShareButton
        url={`${hostURL}${path}`}
        style={{ width: "100%" }}
        hashtags={twitterHashtags}
        via={twitterMention}
        title={content}
      >
        <MenuItem icon={<TwitterIcon />} as={Box}>
          Share to Twitter
        </MenuItem>
      </TwitterShareButton>
      <LinkedinShareButton
        url={`${hostURL}${path}`}
        style={{ width: "100%" }}
        title={content}
      >
        <MenuItem icon={<LinkedinIcon />} as={Box}>
          Share to Linkedin
        </MenuItem>
      </LinkedinShareButton>
    </>
  );
};

export default SocialMediaShareMenuList;
