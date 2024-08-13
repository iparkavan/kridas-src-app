import { Box, Center, HStack, Icon, Link } from "@chakra-ui/react";

import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
} from "../ui/icons";
import { TextXtraSmall } from "../ui/text/text";
import { useLookupTable } from "../../hooks/lookup-table-hooks";

const ViewSocialLinks = ({ socials = [] }) => {
  const { data: socialData = [] } = useLookupTable("SOC");

  const getSocialDetails = (type) => {
    const socialDetails = {};
    socialDetails.name = socialData.find((soc) => soc["lookup_key"] === type)?.[
      "lookup_value"
    ];
    switch (type) {
      case "FBK":
        socialDetails.icon = FacebookIcon;
        socialDetails.color = "var(--chakra-colors-facebook-500)";
        socialDetails.bgColor = "var(--chakra-colors-facebook-100)";
        break;
      case "TWI":
        socialDetails.icon = TwitterIcon;
        socialDetails.color = "var(--chakra-colors-twitter-500)";
        socialDetails.bgColor = "var(--chakra-colors-twitter-100)";
        break;
      case "INS":
        socialDetails.icon = InstagramIcon;
        socialDetails.color = "red.500";
        socialDetails.bgColor = "red.100";
        break;
      case "LIN":
        socialDetails.icon = LinkedinIcon;
        socialDetails.color = "var(--chakra-colors-linkedin-500)";
        socialDetails.bgColor = "var(--chakra-colors-linkedin-100)";
        break;
    }
    return socialDetails;
  };

  return (
    <HStack flexWrap="wrap" spacing={0} gap={5}>
      {socials?.map((soc) => {
        const socialDetails = getSocialDetails(soc.type);
        return soc.link ? (
          <HStack
            key={soc.type}
            spacing={0}
            gap={3}
            alignItems="center"
            flexWrap="wrap"
          >
            <Center bg={socialDetails.bgColor} p={3} borderRadius="50%">
              <Icon
                as={socialDetails.icon}
                w="5"
                h="5"
                color={socialDetails.color}
              />
            </Center>
            <Box>
              <TextXtraSmall>{socialDetails.name}</TextXtraSmall>
              <Link
                href={soc.link}
                fontSize="sm"
                color="primary.500"
                isExternal
              >
                {soc.link}
              </Link>
            </Box>
          </HStack>
        ) : null;
      })}
    </HStack>
  );
};

export default ViewSocialLinks;
