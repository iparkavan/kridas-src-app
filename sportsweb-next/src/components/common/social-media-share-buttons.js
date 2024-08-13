import { useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useClipboard,
} from "@chakra-ui/react";

import { CopyIcon, Share2Icon, ShareFillIcon } from "../ui/icons";
import IconButton from "../ui/icon-button";
import SocialMediaShareMenuList from "./social-media-share-menu-list";

const SocialMediaShareButtons = (props) => {
  const { handleShare, ...otherProps } = props;
  const [currentLink, setCurrentLink] = useState("");
  const { onCopy } = useClipboard(currentLink);

  useEffect(() => {
    setCurrentLink(window.location.href);
  }, []);

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Share options"
        icon={<Share2Icon color="primary.600" />}
        size="md"
        colorScheme="primary"
        _focus={{ boxShadow: "none" }}
        variant="outline"
      />
      <MenuList maxWidth={"200px"}>
        {handleShare && (
          <MenuItem
            icon={<ShareFillIcon fontSize="14px" />}
            onClick={handleShare}
          >
            Share now
          </MenuItem>
        )}
        <MenuItem icon={<CopyIcon fontSize="14px" />} onClick={onCopy}>
          Copy Link
        </MenuItem>
        <SocialMediaShareMenuList {...otherProps} />
      </MenuList>
    </Menu>
  );
};

export default SocialMediaShareButtons;
