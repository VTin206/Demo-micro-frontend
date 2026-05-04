import React, { useMemo, useState } from "react";
import "./index.scss";

const CART_STORAGE_KEY = "mfe:ecommerce:cart";
const CHECKOUT_STORAGE_KEY = "mfe:ecommerce:checkout-order";

function readJson(key, fallback) {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    console.warn(`Cannot read ${key}`, error);
    return fallback;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
}

function getInitialOrder() {
  const checkoutOrder = readJson(CHECKOUT_STORAGE_KEY, null);

  if (checkoutOrder?.items?.length) {
    return checkoutOrder;
  }

  const cartItems = readJson(CART_STORAGE_KEY, []);
  return {
    items: cartItems,
    total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  };
}

export default function CheckoutApp() {
  const [order] = useState(getInitialOrder);
  const [form, setForm] = useState({
    fullName: "Nguyen An",
    address: "123 Nguyen Hue, Ho Chi Minh City",
    method: "Cash on delivery"
  });
  const [status, setStatus] = useState("Payment is not submitted");

  const totalQuantity = useMemo(
    () => order.items.reduce((sum, item) => sum + item.quantity, 0),
    [order.items]
  );

  const submitPayment = (event) => {
    event.preventDefault();
    setStatus("Mock payment submitted successfully");
  };

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <section className="remote-card checkout-app">
      <div className="remote-header">
        <div>
          <p className="eyebrow">Checkout MFE</p>
          <h2>Checkout</h2>
        </div>
        <span className="remote-badge">Remote 3004</span>
      </div>

      {order.items.length === 0 ? (
        <div className="empty-state">
          <h3>No order is ready</h3>
          <p>Start checkout from the Cart MFE to pass order data into this view.</p>
        </div>
      ) : (
        <div className="checkout-grid">
          <div>
            <h3>Order summary</h3>
            <ul className="cart-list">
              {order.items.map((item) => (
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
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </li>
              ))}
            </ul>
            <div className="cart-total">
              <span>{totalQuantity} items</span>
              <strong>{formatCurrency(order.total)}</strong>
            </div>
          </div>

          <form className="checkout-form" onSubmit={submitPayment}>
            <label>
              Full name
              <input name="fullName" value={form.fullName} onChange={updateField} />
            </label>
            <label>
              Shipping address
              <textarea name="address" value={form.address} onChange={updateField} />
            </label>
            <label>
              Payment method
              <select name="method" value={form.method} onChange={updateField}>
                <option>Cash on delivery</option>
                <option>Bank transfer</option>
                <option>Demo credit card</option>
              </select>
            </label>
            <button type="submit">Submit Mock Payment</button>
            <div className="event-note">{status}</div>
          </form>
        </div>
      )}
    </section>
  );
}
