import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Button,
  HStack,
} from "@chakra-ui/react";
import { ShareFillIcon, ShareIcon } from "../ui/icons";
import SocialMediaShareMenuList from "./social-media-share-menu-list";
import { TextSmall } from "../ui/text/text";

const SocialMediaSharePost = (props) => {
  const { handleShare, ...otherProps } = props;

  return (
    <Menu>
      <MenuButton
        as={Button}
        aria-label="Share options"
        size="sm"
        variant="ghost"
      >
        <HStack>
          <Icon as={ShareIcon} h={5} w={5} />
          <TextSmall ml={2} fontWeight="normal">
            Share
          </TextSmall>
        </HStack>
      </MenuButton>
      <MenuList maxWidth={"200px"} zIndex={5}>
        <MenuItem
          icon={<ShareFillIcon fontSize="14px" />}
          onClick={handleShare}
        >
          Share now
        </MenuItem>
        <SocialMediaShareMenuList {...otherProps} />
      </MenuList>
    </Menu>
  );
};

export default SocialMediaSharePost;
