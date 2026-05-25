import React, { useEffect, useMemo, useState } from "react";
import "./index.scss";
import {
  clearCart as clearStoredCart,
  getCart,
  saveCart
} from "./features/cart/services/cartService";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
}

function notifyCartUpdated(items) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  window.dispatchEvent(
    new CustomEvent("cart:updated", {
      detail: { items, total }
    })
  );
}

export default function CartApp() {
  const [items, setItems] = useState(getCart);

  useEffect(() => {
    const refreshFromCartEvent = () => {
      setItems(getCart());
    };

    window.addEventListener("cart:add", refreshFromCartEvent);
    window.addEventListener("cart:updated", refreshFromCartEvent);

    return () => {
      window.removeEventListener("cart:add", refreshFromCartEvent);
      window.removeEventListener("cart:updated", refreshFromCartEvent);
    };
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );
  const shipping = items.length ? 39000 : 0;
  const grandTotal = total + shipping;

  const updateItems = (nextItems) => {
    setItems(nextItems);
    saveCart(nextItems);
    notifyCartUpdated(nextItems);
  };

  const decreaseQuantity = (productId) => {
    updateItems(
      items
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
    clearStoredCart();
    notifyCartUpdated([]);
  };

  const startCheckout = () => {
    window.dispatchEvent(
      new CustomEvent("checkout:start", {
        detail: { items, total }
      })
    );
  };

  return (
    <section className="remote-card cart-app">
      <div className="remote-header">
        <div>
          <p className="eyebrow">Cart MFE</p>
          <h2>Shopping cart</h2>
          <p className="remote-subtitle">Review selected items before checkout.</p>
        </div>
        <span className="remote-badge">Remote 3002</span>
      </div>

      <div className="event-note">
        Listening for <strong>cart:add</strong> and <strong>cart:updated</strong>
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <h3>Your cart is empty</h3>
          <p>Add products from the Product MFE before starting checkout.</p>
        </div>
      ) : (
        <>
          <ul className="cart-list">
            {items.map((item) => (
              <li className="cart-item" key={item.id}>
                <div className="cart-product">
                  {item.imageUrl && (
                    <img className="cart-thumb" src={item.imageUrl} alt={item.name} />
                  )}
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {formatCurrency(item.price)} x {item.quantity}
                    </span>
                  </div>
                </div>
                <button type="button" onClick={() => decreaseQuantity(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="cart-total">
            <div>
              <span>Subtotal</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <div>
              <span>Shipping</span>
              <strong>{formatCurrency(shipping)}</strong>
            </div>
            <div className="grand-total">
              <span>{itemCount} items</span>
              <strong>{formatCurrency(grandTotal)}</strong>
            </div>
          </div>

          <div className="action-row">
            <button type="button" className="secondary-button" onClick={clearCart}>
              Clear
            </button>
            <button type="button" onClick={startCheckout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}
