const CART_KEY = "mfe:ecommerce:cart";
const CHECKOUT_ORDER_KEY = "mfe:ecommerce:checkout-order";

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
  const checkoutOrder = readJson(CHECKOUT_ORDER_KEY, null);

  if (checkoutOrder?.items?.length) {
    return checkoutOrder;
  }

  const cartItems = readJson(CART_KEY, []);
  return {
    items: cartItems,
    total: getCartTotal(cartItems)
  };
}

export function createMockOrder(orderData) {
  return {
    id: `ORDER-${Date.now()}`,
    status: "success",
    ...orderData
  };
}
