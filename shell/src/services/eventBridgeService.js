import { EVENTS } from "../shared/constants/events";
import {
  addProductToCart,
  clearUser,
  getCartItems,
  getCartTotal,
  saveCheckoutOrder,
  saveUser
} from "./sessionStorageService";

function publishCartUpdated(items) {
  window.dispatchEvent(
    new CustomEvent(EVENTS.CART_UPDATED, {
      detail: { items, total: getCartTotal(items) }
    })
  );
}

export function registerShellEventBridge({ navigate, onCartChange, onUserChange }) {
  const handleCartAdd = (event) => {
    const product = event.detail;

    if (!product || !product.id) {
      return;
    }

    const nextItems = addProductToCart(product);
    onCartChange(nextItems);
    publishCartUpdated(nextItems);
  };

  const handleCartUpdated = (event) => {
    const items = Array.isArray(event.detail?.items) ? event.detail.items : getCartItems();
    onCartChange(items);
  };

  const handleCheckoutStart = (event) => {
    const items = event.detail?.items?.length ? event.detail.items : getCartItems();
    const order = {
      items,
      total: getCartTotal(items),
      startedAt: new Date().toISOString()
    };

    saveCheckoutOrder(order);
    navigate("/checkout");
  };

  const handleUserLogin = (event) => {
    const user = event.detail;

    if (!user || !user.name) {
      return;
    }

    saveUser(user);
    onUserChange(user);
  };

  const handleUserLogout = () => {
    clearUser();
    onUserChange(null);
  };

  window.addEventListener(EVENTS.CART_ADD, handleCartAdd);
  window.addEventListener(EVENTS.CART_UPDATED, handleCartUpdated);
  window.addEventListener(EVENTS.CHECKOUT_START, handleCheckoutStart);
  window.addEventListener(EVENTS.USER_LOGIN, handleUserLogin);
  window.addEventListener(EVENTS.USER_LOGOUT, handleUserLogout);
  window.addEventListener(EVENTS.USER_UPDATED, handleUserLogin);

  return () => {
    window.removeEventListener(EVENTS.CART_ADD, handleCartAdd);
    window.removeEventListener(EVENTS.CART_UPDATED, handleCartUpdated);
    window.removeEventListener(EVENTS.CHECKOUT_START, handleCheckoutStart);
    window.removeEventListener(EVENTS.USER_LOGIN, handleUserLogin);
    window.removeEventListener(EVENTS.USER_LOGOUT, handleUserLogout);
    window.removeEventListener(EVENTS.USER_UPDATED, handleUserLogin);
  };
}
