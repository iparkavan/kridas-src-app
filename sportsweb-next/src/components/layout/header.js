import { useCallback, useRef, useState, useEffect, Fragment } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Input,
  ListItem,
  VStack,
  Image,
  Link,
  LinkOverlay,
  LinkBox,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  useBoolean,
  Collapse,
  CircularProgress,
  Center,
  List,
  useBreakpointValue,
  Hide,
  Circle,
} from "@chakra-ui/react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useUser, useSearchByName } from "../../hooks/user-hooks";
import { useSearchByTag } from "../../hooks/hash-tag-hook";
// import { useLookupTable } from "../../hooks/lookup-table-hooks";
import routes from "../../helper/constants/route-constants";
import { TextSmall, TextXtraSmall } from "../ui/text/text";
import {
  LogoutIcon,
  MenuAltIcon,
  BellIcon,
  PersonIcon,
  SettingsIcon,
  MenuVerticalIcon,
  NavSearchIcon,
  Activity,
  CoinIcon,
  OrderIcon,
  LockIcon,
} from "../ui/icons";
import Sidebar from "./user-layout/sidebar";
import { HeadingXtraSmall } from "../ui/heading/heading";
import {
  useNotification,
  useReadAllNotification,
  useNotificationInfiniteByUserId,
} from "../../hooks/notification-hook";
import { io } from "socket.io-client";
import { useLogoutActivity } from "../../hooks/activity-hook";
import { useIntersectionObserver } from "../../hooks/common-hooks";
import CartPopover from "../cart/cart-popover";
import LockProfileModal from "../user/lock-profile-modal";

const Header = (props) => {
  const router = useRouter();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  // const {socket} =props
  const {
    isOpen: isLockProfileOpen,
    onOpen: onLockProfileOpen,
    onClose: onLockProfileClose,
  } = useDisclosure();
  const [isMenuOpen, setIsMenuOpen] = useBoolean();
  const [isSearchOpen, setIsSearchOpen] = useBoolean();

  const { data: userData = {} } = useUser();
  // const { data: professionData = [] } = useLookupTable("PRF");

  const loadMoreRefSm = useRef();
  const loadMoreRefLg = useRef();

  const {
    data: notificationData = [],
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    error,
    isLoading: notificationLoading,
    refetch,
  } = useNotificationInfiniteByUserId(userData?.["user_id"]);

  useIntersectionObserver({
    target: loadMoreRefSm,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  useIntersectionObserver({
    target: loadMoreRefLg,
    onIntersect: fetchNextPage,
    enabled: !!hasNextPage,
  });

  const {
    mutate: notificationUpdate,
    isLoading,
    isSuccess,
  } = useReadAllNotification();
  const { mutate: searchMutate, isLoading: isSearchLoading } =
    useSearchByName();
  const { mutate: searchTagMutate } = useSearchByTag();
  const [suggestions, setSuggestions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [message, setMessage] = useState("Post");
  const [notificationCount, setNotificationCount] = useState(
    notificationData?.pages?.[0]?.notification_count
  );
  const { mutate: logoutActivityMutate } = useLogoutActivity();
  const socket_url = process.env.NEXT_PUBLIC_SOCKET_URL;

  useEffect(() => {
    const socket = io(socket_url);
    socket?.on(`${userData.user_id}`, (data) => {
      // setNotificationCount(data?.count);
      refetch();
    });
    socket?.on(`public_notification`, (data) => {
      // setNotificationCount(data?.count);
      refetch();
    });
    return () => {
      socket.disconnect();
    };
  }, [refetch, socket_url, userData.user_id]);

  const handleDrawerToggle = (size) => {
    onDrawerOpen();
  };

  const handleMenuToggle = (size) => {
    props.handleMenuToggle(size);
  };

  const handleToggle = useBreakpointValue({
    base: handleDrawerToggle,
    md: handleMenuToggle,
  });

  const onSearchChange = useCallback(
    (e) => {
      setSearchText(e.target.value);
      if (e.target.value && e.target.value.startsWith("#")) {
        if (e.target.value.length > 1) {
          searchTagMutate(e.target.value, {
            onSuccess: (data) => {
              setSuggestions(data);
            },
          });
        } else {
          setSuggestions([]);
        }
      } else if (e.target.value) {
        setSuggestions([]);
        searchMutate(
          { search_text: e.target.value },
          {
            onSuccess: (data) => {
              setSuggestions(data);
            },
          }
        );
      }
    },
    [searchMutate, searchTagMutate]
  );

  const logoutActivity = () => {
    logoutActivityMutate(userData?.["user_id"]);
  };

  const logoutHandler = () => {
    logoutActivityMutate(
      { user_id: userData?.["user_id"] },
      {
        onSettled: () => {
          signOut({ callbackUrl: "/" });
        },
      }
    );
  };

  const handleHashTag = (tag) => {
    router.push(`/search?hashtag=${tag.trim()}`);
  };

  // useEffect(() => {
  //   socket?.on(userData.user_id, (data) => {
  //     refetch();
  //     // setNotificationCount(notificationData.notification_count)
  //     // setNotificationCount(data?.count)
  //     // alert(JSON.stringify(data))
  //   });
  // }, [socket,notificationData,notificationUpdate]);

  const getNotificationMsg = async (type) => {
    let msg = "";
    switch (type) {
      case "FD":
        setMessage("Post");
        break;
      case "EV":
        setMessage("Event");
        break;
      case "AR":
        setMessage("Article");
        break;
    }
    return msg;
  };

  return (
    <>
      <Flex
        as="nav"
        bg="white"
        w="full"
        align="center"
        gap={{ base: 5, sm: 2, md: 2, lg: 5 }}
        // minH={16}
        h={16}
        px={5}
        justify={{ base: "space-between", md: "none" }}
        pos="sticky"
        top={0}
        zIndex={5}
        boxShadow="sm"
      >
        <IconButton
          variant="ghost"
          aria-label="toggle sidebar"
          icon={<MenuAltIcon />}
          // onClick={handleMenuToggle}
          onClick={handleToggle}
          fontSize="20px"
          _focus={{ boxShadow: "none" }}
        />

        <Box display={{ md: "none" }} minW="150px" flexBasis="250px">
          <NextLink href={routes.home} passHref>
            <Link textDecoration="none">
              <Image src="/kridas-logo.svg" alt="Kridas-logo" />
            </Link>
          </NextLink>
        </Box>

        <Box
          display={{ base: "none", md: "revert" }}
          flexBasis={{ md: "350px", lg: "500px" }}
          minW="200px"
          pos="relative"
        >
          <Input
            placeholder="Search for users, pages & hashtags"
            type="search"
            value={searchText}
            onChange={(e) => onSearchChange(e)}
          />
          {searchText && (
            <Box
              bg="white"
              px={4}
              py={3}
              position="absolute"
              top="50px"
              w="full"
              boxShadow="sm"
              maxHeight="250px"
              overflow="auto"
              zIndex={1}
            >
              {suggestions.length === 0 && isSearchLoading && (
                <Center>
                  <CircularProgress isIndeterminate size="24px" />
                </Center>
              )}
              {suggestions.length === 0 && !isSearchLoading && (
                <TextSmall>No results found</TextSmall>
              )}
              <List spacing={3}>
                {suggestions?.map((d, index) => (
                  <ListItem key={index}>
                    {searchText.startsWith("#") && suggestions.length > 0 ? (
                      <HStack
                        spacing={5}
                        w="full"
                        onClick={() => handleHashTag(d.hashtag_title)}
                        cursor="pointer"
                      >
                        <Avatar size="sm" name="#" />
                        <TextSmall>{`#${d.hashtag_title}`}</TextSmall>
                      </HStack>
                    ) : (
                      <LinkBox>
                        <LinkOverlay
                          href={
                            d.type === "U"
                              ? `/user/profile/${d.id}`
                              : d.type === "C"
                              ? `/page/${d.id}`
                              : `/events/${d.id}`
                          }
                        >
                          <HStack spacing={5}>
                            <Avatar size="sm" name={d.name} src={d.avatar} />
                            <TextSmall>{d.name}</TextSmall>
                          </HStack>
                        </LinkOverlay>
                      </LinkBox>
                    )}
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        <IconButton
          display={{ base: "inherit", sm: "none" }}
          variant="ghost"
          aria-label="open menu"
          icon={<MenuVerticalIcon />}
          onClick={() => {
            setIsMenuOpen.toggle();
            setIsSearchOpen.off();
          }}
          fontSize="20px"
        />

        <IconButton
          display={{ base: "none", sm: "inherit", md: "none" }}
          variant="ghost"
          aria-label="open menu"
          icon={<NavSearchIcon />}
          onClick={() => {
            setSearchText("");
            setIsSearchOpen.toggle();
          }}
          fontSize="20px"
        />

        {/* <IconButton
          display={{ base: "none", sm: "inherit" }}
          ml={{ md: "auto" }}
          variant="ghost"
          aria-label="open menu"
          icon={<BellIcon />}
          fontSize="20px"
        /> */}

        <HStack
          // flexBasis="250px"
          ml={{ md: "auto" }}
          maxW={{ sm: "200px", lg: "300px" }}
          display={{ base: "none", sm: "inherit" }}
          px={{ md: 2 }}
          py={2}
          cursor={"pointer"}
          borderRadius="10px"
          _hover={{ bg: "gray.100" }}
          onClick={() => {
            router.push(routes.profile(userData["user_name"]));
          }}
        >
          <Avatar
            size={"sm"}
            name={userData["full_name"]}
            src={userData["user_profile_img"]}
          />
          <VStack align="flex-start" spacing={0}>
            <HeadingXtraSmall color="primary.500" noOfLines={2}>
              {userData["full_name"]}
            </HeadingXtraSmall>
            {/* {userData?.["bio_details"]?.["profession"] && (
              <TextXtraSmall color="#8f8fb1">
                {
                  professionData.find(
                    (profession) =>
                      profession["lookup_key"] ===
                      userData["bio_details"]["profession"]
                  )?.["lookup_value"]
                }
              </TextXtraSmall>
            )} */}
          </VStack>
        </HStack>

        <Box display={{ base: "none", sm: "inherit" }}>
          <CartPopover userData={userData} />
        </Box>
        <IconButton
          display={{ base: "none", sm: "inherit" }}
          variant="ghost"
          aria-label="Rewards"
          icon={<CoinIcon />}
          onClick={() => {
            router.push(routes.userRewards);
          }}
        />

        <Menu autoSelect={false}>
          <MenuButton
            display={{ base: "none", sm: "inherit" }}
            mx={{ xl: 4 }}
            as={IconButton}
            variant="ghost"
            aria-label="notifications"
            icon={
              <>
                <BellIcon fontSize="20px" />
                {notificationData?.pages?.[0]?.notification_count > 0 && (
                  <Circle
                    pos="absolute"
                    top="0"
                    left="18px"
                    bg="red.500"
                    p="3px"
                    minW="18px"
                    color="white"
                    fontSize="10px"
                    fontWeight="medium"
                  >
                    {notificationData?.pages?.[0]?.notification_count}
                  </Circle>
                )}
              </>
            }
            onClick={() => {
              notificationUpdate({ userId: userData.user_id });
            }}
          />
          <MenuList
            display={{ base: "none", sm: "inherit" }}
            maxHeight="250px"
            overflow="auto"
          >
            {notificationLoading ? (
              "Loading..."
            ) : error ? (
              "An error has occurred: " + error.message
            ) : notificationData?.pages?.[0]?.content?.length > 0 ? (
              notificationData?.pages?.map((page) =>
                page?.content?.map((notification, index) => (
                  <Fragment key={index}>
                    <MenuItem
                      onClick={() => {
                        if (
                          notification.notification_type === "P" ||
                          notification.notification_type === "S" ||
                          notification.notification_type === "RCT"
                        ) {
                          router.push(
                            routes.post(notification["feeds"]["feed_id"])
                          );
                        } else if (notification.notification_type === "C") {
                          router.push(
                            routes.page(notification["detail"]["id"])
                          );
                        } else if (notification.notification_type === "FWU") {
                          router.push(
                            routes.profile(
                              notification["follower_user_details"][
                                "public_name"
                              ]
                            )
                          );
                        }
                        // ? router.push(
                        //     routes.profile(
                        //       notification["detail"]["public_name"]
                        //     )
                        //   )
                        // : router.push(routes.page(notification.detail.id));
                      }}
                    >
                      {notification.follower_user_details ? (
                        <HStack spacing={4}>
                          <Avatar
                            size="sm"
                            name={notification.follower_user_details?.name}
                            src={notification.follower_user_details?.avatar}
                          />
                          {notification.notification_type === "FWU" && (
                            <TextSmall>{`${notification?.follower_user_details?.name} started following you`}</TextSmall>
                          )}
                        </HStack>
                      ) : notification.reactor_details ? (
                        <HStack spacing={4}>
                          <Avatar
                            size="sm"
                            name={notification.reactor_details?.name}
                            src={notification.reactor_details?.avatar}
                          />
                          {notification.notification_type === "RCT" && (
                            <TextSmall>{`${notification?.reactor_details?.name} reacted to your post`}</TextSmall>
                          )}
                        </HStack>
                      ) : (
                        <HStack spacing={4}>
                          <Avatar
                            size="sm"
                            name={notification.detail.name}
                            src={notification.detail.avatar}
                          />
                          {notification.notification_type === "P" && (
                            <TextSmall>{`${
                              notification?.detail?.name
                            } has created a ${
                              notification.feed_type === "FD"
                                ? "Post"
                                : notification.feed_type === "EV"
                                ? "Event"
                                : "Article"
                            }`}</TextSmall>
                          )}
                          {notification.notification_type === "S" && (
                            <TextSmall>{`${notification?.detail?.name} has shared an Article`}</TextSmall>
                          )}

                          {notification.notification_type === "C" && (
                            <TextSmall>
                              {notification.feed_type === "TM"
                                ? `You have been added in the team ${notification?.detail?.name}`
                                : `A page has been created in your team name ${notification?.detail?.name}`}
                            </TextSmall>
                          )}
                        </HStack>
                      )}
                    </MenuItem>
                    {index !==
                      notificationData?.pages?.[0]?.content.length - 1 && (
                      <MenuDivider my={0} />
                    )}
                  </Fragment>
                ))
              )
            ) : (
              <MenuItem>No notifications found</MenuItem>
            )}
            <span ref={loadMoreRefLg} />
            {isFetchingNextPage && (
              <CircularProgress
                alignSelf="center"
                isIndeterminate
                size="24px"
              />
            )}
          </MenuList>
        </Menu>

        <Menu autoSelect={false}>
          <MenuButton
            display={{ base: "none", sm: "inherit" }}
            as={IconButton}
            aria-label="menu options"
            icon={<SettingsIcon fontSize="20px" />}
            variant="ghost"
          />
          <MenuList>
            <MenuItem
              onClick={() => {
                router.push(routes.profile(userData["user_name"]));
              }}
              icon={<PersonIcon fontSize="1rem" />}
            >
              <TextSmall>My Profile</TextSmall>
            </MenuItem>
            <MenuItem
              onClick={() => {
                router.push(routes.orders);
              }}
              icon={<OrderIcon fontSize="1rem" />}
            >
              <TextSmall>My Orders</TextSmall>
            </MenuItem>
            <MenuItem
              icon={<SettingsIcon fontSize="1rem" />}
              onClick={() => router.push(routes.userAccountSettings)}
            >
              <TextSmall>Account Settings</TextSmall>
            </MenuItem>
            {/* <MenuItem
              icon={<LockIcon fontSize="1rem" />}
              onClick={onLockProfileOpen}
            >
              <TextSmall>Lock Profile</TextSmall>
            </MenuItem> */}
            <LockProfileModal
              isOpen={isLockProfileOpen}
              onClose={onLockProfileClose}
            />
            <MenuItem
              icon={<Activity fontSize="1rem" />}
              onClick={() => router.push(routes.userActivity)}
            >
              <TextSmall>Activity logs</TextSmall>
            </MenuItem>
            <MenuDivider my={0}></MenuDivider>
            <MenuItem
              onClick={logoutHandler}
              icon={<LogoutIcon fontSize="1rem" />}
            >
              <TextSmall>Sign Out</TextSmall>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <Box
        display={{ sm: "none" }}
        position="sticky"
        top={16}
        zIndex={2}
        boxShadow="md"
      >
        <Collapse in={isMenuOpen}>
          <HStack
            bg="white"
            w="full"
            justify="space-between"
            px={5}
            py={1}
            // minH={16}
            h={16}
          >
            <IconButton
              variant="ghost"
              aria-label="open menu"
              icon={<NavSearchIcon />}
              onClick={() => {
                setSearchText("");
                setIsSearchOpen.toggle();
              }}
              fontSize="20px"
            />

            <HStack
              p={2}
              cursor={"pointer"}
              borderRadius="10px"
              _hover={{ bg: "gray.100" }}
              onClick={() => {
                router.push(routes.profile(userData["user_name"]));
              }}
            >
              <Avatar
                size={"sm"}
                name={userData["full_name"]}
                src={userData["user_profile_img"]}
              />
              <VStack align="flex-start" spacing={0}>
                <HeadingXtraSmall color="primary.500" noOfLines={2}>
                  {userData["full_name"]}
                </HeadingXtraSmall>
                {/* {userData?.["bio_details"]?.["profession"] && (
                  <TextXtraSmall color="#8f8fb1">
                    {
                      professionData.find(
                        (profession) =>
                          profession["lookup_key"] ===
                          userData["bio_details"]["profession"]
                      )?.["lookup_value"]
                    }
                  </TextXtraSmall>
                )} */}
              </VStack>
            </HStack>

            <CartPopover userData={userData} />
            <IconButton
              // display={{ base: "none", sm: "inherit", md: "none" }}
              variant="ghost"
              aria-label="Rewards"
              icon={<CoinIcon />}
              onClick={() => {
                router.push(routes.userRewards);
              }}
            />
            <Menu autoSelect={false}>
              <MenuButton
                as={IconButton}
                variant="ghost"
                aria-label="notifications"
                icon={
                  <>
                    <BellIcon fontSize="20px" />
                    {notificationData?.pages?.[0]?.notification_count > 0 && (
                      <Circle
                        pos="absolute"
                        top="0"
                        left="18px"
                        bg="red.500"
                        p="3px"
                        minW="18px"
                        color="white"
                        fontSize="10px"
                        fontWeight="medium"
                      >
                        {notificationData?.pages?.[0]?.notification_count}
                      </Circle>
                    )}
                  </>
                }
                onClick={() => {
                  notificationUpdate({ userId: userData.user_id });
                }}
              />
              <MenuList
                maxHeight="250px"
                overflow="auto"
                minW="auto"
                maxW="100vw"
              >
                {notificationLoading ? (
                  "Loading..."
                ) : error ? (
                  "An error has occurred: " + error.message
                ) : notificationData?.pages?.[0]?.content?.length > 0 ? (
                  notificationData?.pages?.map((page) =>
                    page?.content?.map((notification, index) => (
                      <Fragment key={index}>
                        <MenuItem
                          onClick={() => {
                            if (
                              notification.notification_type === "P" ||
                              notification.notification_type === "S" ||
                              notification.notification_type === "RCT"
                            ) {
                              router.push(
                                routes.post(notification["feeds"]["feed_id"])
                              );
                            } else if (notification.notification_type === "C") {
                              router.push(
                                routes.page(notification["detail"]["id"])
                              );
                            } else if (
                              notification.notification_type === "FWU"
                            ) {
                              router.push(
                                routes.profile(
                                  notification["follower_user_details"][
                                    "public_name"
                                  ]
                                )
                              );
                            }
                            // ? router.push(
                            //     routes.profile(
                            //       notification["detail"]["public_name"]
                            //     )
                            //   )
                            // : router.push(routes.page(notification.detail.id));
                          }}
                        >
                          {notification.follower_user_details ? (
                            <HStack spacing={4}>
                              <Avatar
                                size="sm"
                                name={notification.follower_user_details?.name}
                                src={notification.follower_user_details?.avatar}
                              />
                              {notification.notification_type === "FWU" && (
                                <TextSmall>{`${notification?.follower_user_details?.name} started following you`}</TextSmall>
                              )}
                            </HStack>
                          ) : notification.reactor_details ? (
                            <HStack spacing={4}>
                              <Avatar
                                size="sm"
                                name={notification.reactor_details?.name}
                                src={notification.reactor_details?.avatar}
                              />
                              {notification.notification_type === "RCT" && (
                                <TextSmall>{`${notification?.reactor_details?.name} reacted to your post`}</TextSmall>
                              )}
                            </HStack>
                          ) : (
                            <HStack spacing={4}>
                              <Avatar
                                size="sm"
                                name={notification.detail.name}
                                src={notification.detail.avatar}
                              />
                              {notification.notification_type === "P" && (
                                <TextSmall>{`${
                                  notification?.detail?.name
                                } has created a ${
                                  notification.feed_type === "FD"
                                    ? "Post"
                                    : notification.feed_type === "EV"
                                    ? "Event"
                                    : "Article"
                                }`}</TextSmall>
                              )}
                              {notification.notification_type === "S" && (
                                <TextSmall>{`${notification?.detail?.name} has shared an Article`}</TextSmall>
                              )}

                              {notification.notification_type === "C" && (
                                <TextSmall>
                                  {notification.feed_type === "TM"
                                    ? `You have been added in the team ${notification?.detail?.name}`
                                    : `A page has been created in your team name ${notification?.detail?.name}`}
                                </TextSmall>
                              )}
                            </HStack>
                          )}
                        </MenuItem>
                        {index !==
                          notificationData?.pages?.[0]?.content.length - 1 && (
                          <MenuDivider my={0} />
                        )}
                      </Fragment>
                    ))
                  )
                ) : (
                  <MenuItem>No notifications found</MenuItem>
                )}
                <span ref={loadMoreRefSm} />
                {isFetchingNextPage && (
                  <CircularProgress
                    alignSelf="center"
                    isIndeterminate
                    size="24px"
                  />
                )}
              </MenuList>
            </Menu>

            <Menu autoSelect={false}>
              <MenuButton
                as={IconButton}
                aria-label="menu options"
                icon={<SettingsIcon fontSize="20px" />}
                variant="ghost"
              />
              <MenuList>
                <MenuItem
                  onClick={() => {
                    router.push(routes.profile(userData["user_name"]));
                  }}
                  icon={<PersonIcon fontSize="1rem" />}
                >
                  <TextSmall>My Profile</TextSmall>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push(routes.orders);
                  }}
                  icon={<OrderIcon fontSize="1rem" />}
                >
                  <TextSmall>My Orders</TextSmall>
                </MenuItem>
                <MenuItem
                  icon={<SettingsIcon fontSize="1rem" />}
                  onClick={() => router.push(routes.userAccountSettings)}
                >
                  <TextSmall>Account Settings</TextSmall>
                </MenuItem>
                {/* <MenuItem
                  icon={<LockIcon fontSize="1rem" />}
                  onClick={onLockProfileOpen}
                >
                  <TextSmall>Lock Profile</TextSmall>
                </MenuItem> */}
                <LockProfileModal
                  isOpen={isLockProfileOpen}
                  onClose={onLockProfileClose}
                />
                <MenuItem
                  icon={<Activity fontSize="1rem" />}
                  onClick={() => router.push(routes.userActivity)}
                >
                  <TextSmall>Activity logs</TextSmall>
                </MenuItem>
                <MenuDivider my={0}></MenuDivider>
                <MenuItem
                  onClick={logoutHandler}
                  icon={<LogoutIcon fontSize="1rem" />}
                >
                  <TextSmall>Sign Out</TextSmall>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Collapse>
      </Box>

      <Box
        display={{ md: "none" }}
        pos="sticky"
        top={{ base: 32, sm: 16 }}
        zIndex={1}
        boxShadow="md"
      >
        <Collapse in={isSearchOpen} style={{ overflow: "initial" }}>
          <Box bg="white" w="full" h={16} px={5} py={3}>
            <Box pos="relative" w="full">
              <Input
                placeholder="Search for users, pages & hashtags"
                type="search"
                value={searchText}
                onChange={(e) => onSearchChange(e)}
              />

              {searchText && (
                <Box
                  bg="white"
                  px={4}
                  py={3}
                  position="absolute"
                  top="50px"
                  w="full"
                  boxShadow="md"
                  maxHeight="250px"
                  overflow="auto"
                  zIndex={1}
                >
                  {suggestions.length === 0 && isSearchLoading && (
                    <Center>
                      <CircularProgress isIndeterminate size="24px" />
                    </Center>
                  )}
                  {suggestions.length === 0 && !isSearchLoading && (
                    <TextSmall>No results found</TextSmall>
                  )}
                  <List spacing={3}>
                    {suggestions?.map((d, index) => (
                      <ListItem key={index}>
                        {searchText.startsWith("#") &&
                        suggestions.length > 0 ? (
                          <HStack
                            spacing={5}
                            w="full"
                            onClick={() => handleHashTag(d.hashtag_title)}
                            cursor="pointer"
                          >
                            <Avatar size="sm" name="#" />
                            <TextSmall>{`#${d.hashtag_title}`}</TextSmall>
                          </HStack>
                        ) : (
                          <LinkBox>
                            <LinkOverlay
                              href={
                                d.type === "U"
                                  ? `/user/profile/${d.id}`
                                  : d.type === "C"
                                  ? `/page/${d.id}`
                                  : `/events/${d.id}`
                              }
                            >
                              <HStack spacing={5}>
                                <Avatar
                                  size="sm"
                                  name={d.name}
                                  src={d.avatar}
                                />
                                <TextSmall>{d.name}</TextSmall>
                              </HStack>
                            </LinkOverlay>
                          </LinkBox>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Box>
          </Box>
        </Collapse>
      </Box>

      <Hide above="md">
        <Drawer placement="left" onClose={onDrawerClose} isOpen={isDrawerOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              {userData["full_name"]}
            </DrawerHeader>
            <DrawerBody>
              <Sidebar></Sidebar>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Hide>
    </>
  );
};

export default Header;
