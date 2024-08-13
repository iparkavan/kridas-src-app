import {
  Box,
  Checkbox,
  Circle,
  GridItem,
  HStack,
  IconButton,
  useBreakpointValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useCartContext } from "../../context/cart-context";
import { getCTServiceDateTime } from "../../helper/constants/cart-constants";
import { useDeleteUserCart, useUpdateCart } from "../../hooks/cart-hooks";
import { useProductCount } from "../../hooks/product-hooks";
import { useUser } from "../../hooks/user-hooks";
import { AddIcon, CloseIcon, MinusIcon } from "../ui/icons";
import DeleteModal from "../ui/modal/delete-modal";
import { TextMedium, TextSmall } from "../ui/text/text";
import ResponsiveCartItem from "./responsive-cart-item";

const CartItem = ({ cartItem, desktopDisplay }) => {
  const { data: userData } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { mutate: updateMutate, isLoading: isUpdateLoading } = useUpdateCart();
  const { mutate: deleteMutate, isLoading: isDeleteLoading } =
    useDeleteUserCart();
  const { mutate: countMutate, isLoading: isCountLoading } = useProductCount();
  const isLoading = isUpdateLoading || isCountLoading;

  const { cartItems, setCartItems } = useCartContext();

  const isCartItemChecked = Boolean(
    cartItems.find((item) => item.shoppingCartId === cartItem.shoppingCartId)
  );

  const handleCheckbox = (e) => {
    if (e.target.checked) {
      const updatedItems = [...cartItems, cartItem];
      setCartItems(updatedItems);
    } else {
      const filteredItems = cartItems.filter(
        (item) => item.shoppingCartId !== cartItem.shoppingCartId
      );
      setCartItems(filteredItems);
    }
  };

  let qty = cartItem.quantity;
  const handleUpdate = (type) => {
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
    deleteMutate(
      { cartId, userId: userData?.user_id },
      {
        onSuccess: onClose,
      }
    );
  };

  const totalPrice = cartItem.quantity * cartItem.productSpecialPrice;
  // const isCalendarType = cartItem.shoppingCartAttrList.length > 0;
  // let calendarSlot;
  // if (isCalendarType) {
  //   calendarSlot = getCTServiceDateTime(cartItem.shoppingCartAttrList[0]);
  // }
  const isMinusLoading = isLoading || (qty === 1 && isDeleteLoading);

  return (
    <>
      {/* Desktop Styles */}
      <GridItem display={desktopDisplay} justifySelf="start" w="full">
        <Box border="1px" borderColor="gray.400" padding={4} borderRadius="lg">
          <TextMedium noOfLines={2}>{cartItem.productName}</TextMedium>
          <HStack mt={1}>
            <Circle h="4px" w="4px" bgColor="gray.500" />
            <TextSmall color="gray.500" noOfLines={1}>
              {cartItem.productDesc}
            </TextSmall>
          </HStack>
          {/* {isCalendarType && (
            <TextSmall mt={1} color="gray.500">
              {calendarSlot}
            </TextSmall>
          )} */}
        </Box>
      </GridItem>
      <GridItem display={desktopDisplay}>
        <HStack spacing={3}>
          <IconButton
            icon={<MinusIcon fontSize="16px" />}
            colorScheme="primary"
            variant="outline"
            size="xs"
            isRound={true}
            isLoading={isMinusLoading}
            onClick={() => handleUpdate("delete")}
            disabled={cartItem.productTypeId === "SER"}
          />
          <TextMedium>{cartItem.quantity}</TextMedium>
          <IconButton
            icon={<AddIcon fontSize="16px" />}
            colorScheme="primary"
            variant="outline"
            size="xs"
            isRound={true}
            isLoading={isLoading}
            onClick={() => handleUpdate("add")}
            disabled={cartItem.productTypeId === "SER"}
          />
        </HStack>
      </GridItem>
      <GridItem display={desktopDisplay}>
        <TextMedium>
          {totalPrice} {cartItem.productPriceCurrency}
        </TextMedium>
      </GridItem>
      <GridItem display={desktopDisplay}>
        <IconButton
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
          handleDelete={() => handleDelete(cartItem.shoppingCartId)}
        />
      </GridItem>

      {/* Mobile Styles */}
      <GridItem display={{ lg: "none" }} w="full">
        <ResponsiveCartItem
          cartItem={cartItem}
          onOpen={onOpen}
          totalPrice={totalPrice}
          handleUpdate={handleUpdate}
          isLoading={isLoading}
          isMinusLoading={isMinusLoading}
        />
      </GridItem>

      <GridItem>
        <Checkbox
          borderColor="primary.500"
          colorScheme="primary"
          size="lg"
          isChecked={isCartItemChecked}
          onChange={handleCheckbox}
        />
      </GridItem>
    </>
  );
};

export default CartItem;
