import { STORAGE_KEYS } from "../shared/constants/storageKeys";

export function readJson(key, fallback) {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    console.warn(`Cannot read ${key}`, error);
    return fallback;
  }
}

export function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeKey(key) {
  window.localStorage.removeItem(key);
}

export function getCartItems() {
  return readJson(STORAGE_KEYS.CART_ITEMS, []);
}

export function saveCartItems(items) {
  writeJson(STORAGE_KEYS.CART_ITEMS, items);
}

export function addProductToCart(product) {
  const items = getCartItems();
  const existingItem = items.find((item) => item.id === product.id);

  const nextItems = existingItem
    ? items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    : [...items, { ...product, quantity: 1 }];

  saveCartItems(nextItems);
  return nextItems;
}

export function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCurrentUser() {
  return readJson(STORAGE_KEYS.USER_PROFILE, null);
}

export function saveCheckoutOrder(order) {
  writeJson(STORAGE_KEYS.CHECKOUT_ORDER, order);
}

export function saveUser(user) {
  writeJson(STORAGE_KEYS.USER_PROFILE, user);
}

export function clearUser() {
  removeKey(STORAGE_KEYS.USER_PROFILE);
}
