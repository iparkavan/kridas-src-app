import { Fragment } from "react";
import {
  Box,
  Circle,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { AddIcon, CloseIcon, MinusIcon, ShopIcon } from "../ui/icons";
import Button from "../ui/button";
import {
  useDeleteUserCart,
  useUpdateCart,
  useUserCart,
} from "../../hooks/cart-hooks";
import { TextMedium, TextSmall, TextXtraSmall } from "../ui/text/text";
import routes from "../../helper/constants/route-constants";
// import DeleteModal from "../ui/modal/delete-modal";
import DeletePopover from "../ui/popover/delete-popover";
import { useProductCount } from "../../hooks/product-hooks";

const CartPopover = ({ userData }) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { data: cartData } = useUserCart(userData?.user_id, {
    select: (data) => {
      if (data === "") {
        return [];
      } else {
        return data.filter(
          (item) =>
            item.productTypeId !== "SER" && item.productTypeId !== "EPRD"
        );
      }
    },
  });

  const { mutate: updateMutate, isLoading: isUpdateLoading } = useUpdateCart();
  const { mutate: deleteMutate, isLoading: isDeleteLoading } =
    useDeleteUserCart();
  const { mutate: countMutate, isLoading: isCountLoading } = useProductCount();
  const isLoading = isUpdateLoading || isCountLoading;

  const handleUpdate = (cartItem, type) => {
    let qty = cartItem.quantity;
    qty = type === "add" ? ++qty : --qty;
    if (qty <= 0) {
      handleDelete(cartItem.shoppingCartId);
    } else {
      countMutate(cartItem.productId, {
        onSuccess: (productQuantity) => {
          if (type === "delete" || qty <= productQuantity) {
            updateMutate({
              productId: cartItem.productId,
              qty,
              shoppingCartId: cartItem.shoppingCartId,
              userId: userData?.user_id,
              serviceId: null,
              shoppingCartAttrList: null,
              weeklyScheduleDetailId: null,
            });
          } else {
            toast({
              title: `The available quantity for ${cartItem.productName} is ${productQuantity}`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        },
      });
    }
  };

  const handleDelete = (cartId) => {
    deleteMutate({ cartId, userId: userData?.user_id });
  };

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label="shopping cart"
          variant="ghost"
          icon={
            <>
              <ShopIcon fontSize="20px" />
              {cartData?.length > 0 && (
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
                  {cartData.length}
                </Circle>
              )}
            </>
          }
        />
      </PopoverTrigger>
      <PopoverContent w="sm">
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Cart</PopoverHeader>
        <PopoverBody>
          {cartData?.length > 0 ? (
            <Grid
              templateColumns="45% auto max-content auto"
              gap={3}
              justifyItems="center"
              alignItems="center"
            >
              {cartData.map((cartItem, index) => {
                if (index >= 2) return null;
                const totalPrice = cartItem.quantity * cartItem.productSpecialPrice;
                return (
                  <Fragment key={cartItem.shoppingCartId}>
                    <GridItem w="full">
                      <Box
                        border="1px"
                        borderColor="gray.400"
                        padding={2}
                        borderRadius="lg"
                      >
                        <TextSmall noOfLines={2}>
                          {cartItem.productName}
                        </TextSmall>
                        <HStack mt={1}>
                          <Circle h="4px" w="4px" bgColor="gray.500" />
                          <TextXtraSmall color="gray.500" noOfLines={1}>
                            {cartItem.productDesc}
                          </TextXtraSmall>
                        </HStack>
                      </Box>
                    </GridItem>
                    <GridItem>
                      <HStack spacing={2}>
                        <IconButton
                          icon={<MinusIcon fontSize="16px" />}
                          colorScheme="primary"
                          variant="outline"
                          size="xs"
                          isRound={true}
                          isLoading={
                            isLoading ||
                            (cartItem.quantity === 1 && isDeleteLoading)
                          }
                          onClick={() => handleUpdate(cartItem, "delete")}
                        />
                        <TextSmall>{cartItem.quantity}</TextSmall>
                        <IconButton
                          icon={<AddIcon fontSize="16px" />}
                          colorScheme="primary"
                          variant="outline"
                          size="xs"
                          isRound={true}
                          isLoading={isLoading}
                          onClick={() => handleUpdate(cartItem, "add")}
                        />
                      </HStack>
                    </GridItem>
                    <GridItem>
                      <TextSmall>
                        {totalPrice} {cartItem.productPriceCurrency}
                      </TextSmall>
                    </GridItem>
                    <GridItem>
                      <DeletePopover
                        title="Delete Item"
                        trigger={
                          <IconButton
                            icon={<CloseIcon fontSize="16px" />}
                            colorScheme="primary"
                            variant="outline"
                            size="xs"
                            // tooltipLabel="Delete Item"
                          />
                        }
                        handleDelete={() =>
                          handleDelete(cartItem.shoppingCartId)
                        }
                      >
                        <TextSmall>
                          Are you sure you want to remove this item from your
                          cart?
                        </TextSmall>
                      </DeletePopover>
                      {/* <IconButton
                        icon={<CloseIcon fontSize="16px" />}
                        colorScheme="primary"
                        variant="outline"
                        size="xs"
                        onClick={onOpen}
                      />
                      <DeleteModal
                        isOpen={isOpen}
                        onClose={onClose}
                        title="Delete Item"
                        content="Are you sure you want to remove this item from you cart?"
                        buttonText="Delete"
                        isLoading={isDeleteLoading}
                        handleDelete={() =>
                          handleDelete(cartItem.shoppingCartId)
                        }
                      /> */}
                    </GridItem>
                  </Fragment>
                );
              })}
              <GridItem colSpan={4} justifySelf="end">
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  onClick={() => router.push(routes.cart)}
                >
                  View Cart
                </Button>
              </GridItem>
            </Grid>
          ) : (
            <TextMedium>No items are present in the cart</TextMedium>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default CartPopover;
