import { EVENTS } from "../constants/events";
import { STORAGE_KEYS } from "../constants/storageKeys";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART_ITEMS)) || [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(cart));
}

export function getCartTotal(cart) {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartItemCount(cart) {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

export function notifyCartUpdated(items) {
  window.dispatchEvent(
    new CustomEvent(EVENTS.CART_UPDATED, {
      detail: { items, total: getCartTotal(items) }
    })
  );
}

export function updateCartItemQuantity(cart, productId, quantity) {
  const nextCart = cart
    .map((item) => (item.id === productId ? { ...item, quantity } : item))
    .filter((item) => item.quantity > 0);

  saveCart(nextCart);
  return nextCart;
}

export function removeCartItem(cart, productId) {
  const nextCart = cart.filter((cartItem) => cartItem.id !== productId);
  saveCart(nextCart);
  return nextCart;
}

export function clearCart() {
  localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
}

export function startCheckout(items) {
  saveCart(items);

  window.dispatchEvent(
    new CustomEvent(EVENTS.CHECKOUT_START, {
      detail: { items, total: getCartTotal(items) }
    })
  );
}
