import { EVENTS } from "../constants/events";
import { STORAGE_KEYS } from "../constants/storageKeys";

function readJson(key, fallback) {
  try {
    const rawValue = localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCheckoutOrder() {
  const checkoutOrder = readJson(STORAGE_KEYS.CHECKOUT_ORDER, null);

  if (checkoutOrder?.items?.length) {
    return checkoutOrder;
  }

  const cartItems = readJson(STORAGE_KEYS.CART_ITEMS, []);
  return {
    items: cartItems,
    total: getCartTotal(cartItems)
  };
}

export function confirmMockPayment(orderData) {
  const nextOrder = {
    id: `ORDER-${Date.now()}`,
    status: "success",
    paidAt: new Date().toISOString(),
    ...orderData
  };

  const existingOrders = readJson(STORAGE_KEYS.CHECKOUT_ORDERS, []);
  localStorage.setItem(
    STORAGE_KEYS.CHECKOUT_ORDERS,
    JSON.stringify([nextOrder, ...existingOrders])
  );
  localStorage.removeItem(STORAGE_KEYS.CART_ITEMS);
  localStorage.removeItem(STORAGE_KEYS.CHECKOUT_ORDER);

  window.dispatchEvent(
    new CustomEvent(EVENTS.CART_UPDATED, {
      detail: { items: [], total: 0 }
    })
  );

  return nextOrder;
}
