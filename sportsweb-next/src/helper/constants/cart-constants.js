import { format } from "date-fns";
import { covertTimeToUTCDate } from "./common-constants";

// Used to verify quantity for cart, checkout and order again
export const verifyCartQuantity = async (items, mutateAsync, toast) => {
  const mutations = [];
  items.forEach((item) => {
    const mutationPromise = mutateAsync(item.productId);
    mutations.push(mutationPromise);
  });

  try {
    const availableQuantities = await Promise.all(mutations);
    if (items.length !== availableQuantities.length) return;

    const areItemsAvailable = items.every((item, index) => {
      if (item.quantity > availableQuantities[index]) {
        toast({
          title: `The available quantity for ${item.productName} is ${availableQuantities[index]}`,
          status: "error",
          isClosable: true,
        });
        return false;
      } else {
        return true;
      }
    });

    return areItemsAvailable;
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const getCTServiceDateTime = (shoppingCartAttr) => {
  const date = format(new Date(shoppingCartAttr.startTime), "dd/MM/yyyy");
  const weeklyScheduleDetailId = shoppingCartAttr.weeklyScheduleDetailId;
  const weeklyScheduleDetail =
    shoppingCartAttr.serviceWeeklySchedule.weeklyScheduleDetails.find(
      (wsd) => wsd.weeklyScheduleDetailId === weeklyScheduleDetailId
    );
  const startTime = format(
    covertTimeToUTCDate(weeklyScheduleDetail.startTime),
    "hh:mm aa"
  );
  const endTime = format(
    covertTimeToUTCDate(weeklyScheduleDetail.endTime),
    "hh:mm aa"
  );
  return `${date} (${startTime} - ${endTime})`;
};

export const deleteItemsFromCart = async (
  cart,
  mutateAsync,
  userId,
  productTypeId
) => {
  const mutations = [];
  cart.forEach((cartItem) => {
    if (cartItem.productTypeId === productTypeId) {
      const mutationPromise = mutateAsync({
        cartId: cartItem.shoppingCartId,
        userId,
      });
      mutations.push(mutationPromise);
    }
  });

  try {
    return await Promise.all(mutations);
  } catch (e) {
    console.log(e);
  }
};

export const addProductsToCart = async (items, mutateAsync, userId) => {
  const mutations = [];
  items.forEach((item) => {
    if (item.productTypeId !== "SER" && item.productTypeId !== "EPRD") {
      const mutationPromise = mutateAsync({
        productId: item.productId,
        qty: item.quantity,
        userId,
      });
      mutations.push(mutationPromise);
    }
  });

  try {
    return await Promise.all(mutations);
  } catch (e) {
    console.log(e);
  }
};
