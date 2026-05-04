import React, { useEffect, useMemo, useState } from "react";
import "./index.scss";

const CART_STORAGE_KEY = "mfe:ecommerce:cart";

function readCart() {
  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
    return rawValue ? JSON.parse(rawValue) : [];
  } catch (error) {
    console.warn("Cannot read cart", error);
    return [];
  }
}

function writeCart(items) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

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
  const [items, setItems] = useState(readCart);

  useEffect(() => {
    const refreshFromCartEvent = () => {
      setItems(readCart());
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

  const updateItems = (nextItems) => {
    setItems(nextItems);
    writeCart(nextItems);
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
    updateItems([]);
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
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
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
