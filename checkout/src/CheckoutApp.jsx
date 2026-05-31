import React from "react";
import "./index.scss";
import { useCheckout } from "./features/checkout/hooks/useCheckout";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
}

export default function CheckoutApp() {
  const {
    order,
    form,
    status,
    totalQuantity,
    paymentSubmitted,
    updateField,
    submitPayment
  } = useCheckout();

  return (
    <section className="remote-card checkout-app">
      <div className="remote-header">
        <div>
          <p className="eyebrow">Checkout MFE</p>
          <h2>Checkout</h2>
          <p className="remote-subtitle">Confirm customer details and payment method.</p>
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
            <div className="checkout-steps" aria-label="Checkout progress">
              <span className="active">Cart</span>
              <span className="active">Details</span>
              <span>Payment</span>
            </div>
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
            <button type="submit" disabled={paymentSubmitted}>
              Confirm Payment
            </button>
            <div className="event-note">{status}</div>
          </form>
        </div>
      )}
    </section>
  );
}
