import NextLink from "next/link";
import { useRouter } from "next/router";
import { Flex, Divider, Link, Image } from "@chakra-ui/react";

import {
  HomeIcon,
  PageIcon,
  // FollowIcon,
  ArticleIcon,
  EventsIcon,
  ShopIcon,
  VoucherIcon,
  Product,
  Service,
} from "../../ui/icons";
import NavItem from "./nav-item";
import routes from "../../../helper/constants/route-constants";
import { TextSmall } from "../../ui/text/text";
import { default as CustomLink } from "../../ui/link";
// import { useUser } from "../../../hooks/user-hooks";

export default function Sidebar(props) {
  const {
    hideSidebarAvatar,
    defaultNavSize = "large",
    navSize = "MAX",
  } = props;
  //const [navSize, changeNavSize] = useState(defaultNavSize);
  // const { data: userData = {} } = useUser();
  const router = useRouter();

  return (
    <>
      <Flex
        pos="sticky"
        top="0"
        marginTop="0"
        //boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
        w={navSize == "MIN" ? "90px" : "240px"}
        minW={navSize == "MIN" ? "90px" : "240px"}
        translateX={"-240px"}
        transition={"all 0.4s"}
        flexDir="column"
        //justifyContent="space-between"
        bg="white"
        sx={{
          "@media screen and (max-width: 768px)": {
            display: "none",
          },
        }}
        h="full"
        maxH="100vh"
      >
        <Flex
          color="white"
          height={16}
          p="5%"
          justifyContent="center"
          alignItems="center"
          width="full"
        >
          <NextLink href={routes.home} passHref>
            <Link textDecoration="none">
              <Image
                src={
                  navSize === "MAX"
                    ? "/kridas-logo.svg"
                    : "/kridas-logo-light.png"
                }
                alt="Kridas-logo"
              />
            </Link>
          </NextLink>
        </Flex>
        <Flex p="5%" pr={0} flexDir="column" w="100%" as="nav" mt={3}>
          <NavItem
            navSize={navSize}
            icon={HomeIcon}
            title="Home"
            href={routes.home}
            active={router.pathname === routes.home}
          />

          <NavItem
            navSize={navSize}
            icon={PageIcon}
            title="Pages"
            href={routes.userPages}
            active={router.pathname === routes.userPages}
          />

          <NavItem
            navSize={navSize}
            icon={ArticleIcon}
            title="Articles"
            href={routes.userArticles}
            active={router.pathname === routes.userArticles}
          />

          {/* <NavItem
            navSize={navSize}
            icon={FollowIcon}
            title="Followers"
            href={routes.userFollowers}
            active={router.pathname === routes.userFollowers}
          /> */}

          <NavItem
            navSize={navSize}
            icon={EventsIcon}
            title="Events"
            href={routes.userEvents}
            active={router.pathname === routes.userEvents}
          />

          {/* <NavItem
            navSize={navSize}
            icon={ShopIcon}
            title="Shop"
            href={routes.shop}
            active={router.pathname === routes.shop}
          />
          <NavItem
            navSize={navSize}
            icon={VoucherIcon}
            title="Vouchers"
            href={routes.vouchers}
            active={router.pathname === routes.vouchers}
          /> */}
          <NavItem
            navSize={navSize}
            icon={Product}
            title="Products"
            href={routes.products}
            active={router.pathname === routes.products}
          />
          <NavItem
            navSize={navSize}
            icon={Service}
            title="Services"
            href={routes.services}
            active={router.pathname === routes.services}
          />
        </Flex>

        <Flex
          direction="row"
          mt="auto"
          p={3}
          columnGap={2}
          flexWrap="wrap"
          fontSize="sm"
          color="gray.500"
          fontWeight="normal"
        >
          <CustomLink href={routes.terms} color="inherit" fontWeight="inherit">
            Terms
          </CustomLink>
          <TextSmall>|</TextSmall>
          <CustomLink
            href={routes.privacyPolicy}
            color="inherit"
            fontWeight="inherit"
          >
            Privacy Policy
          </CustomLink>
          <CustomLink
            href={routes.shippingPolicy}
            color="inherit"
            fontWeight="inherit"
          >
            Shipping & Delivery Policy
          </CustomLink>
          <CustomLink
            href={routes.cancellationPolicy}
            color="inherit"
            fontWeight="inherit"
          >
            Cancellation & Refund Policy
          </CustomLink>
          <CustomLink
            href={routes.contact}
            color="inherit"
            fontWeight="inherit"
          >
            Contact Us
          </CustomLink>
        </Flex>
      </Flex>

      <Flex
        flexDir="column"
        w="100%"
        as="nav"
        sx={{
          "@media screen and (min-width: 769px)": {
            display: "none",
          },
        }}
        h="full"
      >
        <NavItem
          navSize={navSize}
          icon={HomeIcon}
          title="Home"
          href={routes.home}
          active={router.pathname === routes.home}
        />
        <Divider />
        <NavItem
          navSize={navSize}
          icon={PageIcon}
          title="Pages"
          href={routes.userPages}
          active={router.pathname === routes.userPages}
        />
        <Divider />
        <NavItem
          navSize={navSize}
          icon={ArticleIcon}
          title="Articles"
          href={routes.userArticles}
          active={router.pathname === routes.userArticles}
        />
        <Divider />
        {/* <NavItem
          navSize={navSize}
          icon={FollowIcon}
          title="Followers"
          href={routes.userFollowers}
          active={router.pathname === routes.userFollowers}
        />
        <Divider /> */}
        <NavItem
          navSize={navSize}
          icon={EventsIcon}
          title="Events"
          href={routes.userEvents}
          active={router.pathname === routes.userEvents}
        />
        <Divider />
        {/* <NavItem
          navSize={navSize}
          icon={ShopIcon}
          title="Shop"
          href={routes.shop}
          active={router.pathname === routes.shop}
        />
        <Divider />
        <NavItem
          navSize={navSize}
          icon={VoucherIcon}
          title="Vouchers"
          href={routes.vouchers}
          active={router.pathname === routes.vouchers}
        />
        <Divider /> */}
        <NavItem
          navSize={navSize}
          icon={Product}
          title="Products"
          href={routes.products}
          active={router.pathname === routes.products}
        />
        <Divider />
        <NavItem
          navSize={navSize}
          icon={Service}
          title="Services"
          href={routes.services}
          active={router.pathname === routes.services}
        />
        <Divider />
        <Flex
          direction="row"
          mt="auto"
          p={3}
          columnGap={2}
          flexWrap="wrap"
          fontSize="sm"
          color="gray.500"
          fontWeight="normal"
        >
          <CustomLink href={routes.terms} color="inherit" fontWeight="inherit">
            Terms
          </CustomLink>
          <TextSmall>|</TextSmall>
          <CustomLink
            href={routes.privacyPolicy}
            color="inherit"
            fontWeight="inherit"
          >
            Privacy Policy
          </CustomLink>
          <CustomLink
            href={routes.shippingPolicy}
            color="inherit"
            fontWeight="inherit"
          >
            Shipping & Delivery Policy
          </CustomLink>
          <CustomLink
            href={routes.cancellationPolicy}
            color="inherit"
            fontWeight="inherit"
          >
            Cancellation & Refund Policy
          </CustomLink>
          <CustomLink
            href={routes.contact}
            color="inherit"
            fontWeight="inherit"
          >
            Contact Us
          </CustomLink>
        </Flex>
      </Flex>
    </>
  );
}
