import { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "../hooks/user-hooks";
import { useUserCart } from "../hooks/cart-hooks";

const CartContext = createContext();

const CartProvider = (props) => {
  const { data: userData } = useUser();
  const { data: cartData, isSuccess } = useUserCart(userData?.user_id, {
    select: (data) => {
      // API Return empty string ("") if no items in the cart
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
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      setCartItems(cartData);
    }
  }, [cartData, isSuccess]);

  const value = { cartItems, setCartItems };
  return <CartContext.Provider value={value} {...props} />;
};

const useCartContext = () => {
  return useContext(CartContext);
};

export { CartProvider, useCartContext };
