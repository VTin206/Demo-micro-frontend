import { useEffect, useMemo, useState } from "react";
import { EVENTS } from "../constants/events";
import {
  clearCart as clearStoredCart,
  getCart,
  getCartItemCount,
  getCartTotal,
  notifyCartUpdated,
  removeCartItem,
  startCheckout,
  updateCartItemQuantity
} from "../services/cartService";

export function useCart() {
  const [items, setItems] = useState(getCart);

  useEffect(() => {
    const refreshCart = () => {
      setItems(getCart());
    };

    window.addEventListener(EVENTS.CART_UPDATED, refreshCart);

    return () => {
      window.removeEventListener(EVENTS.CART_UPDATED, refreshCart);
    };
  }, []);

  const total = useMemo(() => getCartTotal(items), [items]);
  const itemCount = useMemo(() => getCartItemCount(items), [items]);
  const shipping = items.length ? 39000 : 0;
  const grandTotal = total + shipping;

  const updateQuantity = (productId, quantity) => {
    const nextItems = updateCartItemQuantity(items, productId, quantity);
    setItems(nextItems);
    notifyCartUpdated(nextItems);
  };

  const increaseItem = (productId) => {
    const item = items.find((cartItem) => cartItem.id === productId);

    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const decreaseItem = (productId) => {
    const item = items.find((cartItem) => cartItem.id === productId);

    if (item) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const removeItem = (productId) => {
    const nextItems = removeCartItem(items, productId);
    setItems(nextItems);
    notifyCartUpdated(nextItems);
  };

  const clear = () => {
    clearStoredCart();
    setItems([]);
    notifyCartUpdated([]);
  };

  const checkout = () => {
    startCheckout(items);
  };

  return {
    items,
    total,
    itemCount,
    shipping,
    grandTotal,
    updateQuantity,
    increaseItem,
    decreaseItem,
    removeItem,
    clear,
    checkout
  };
}
