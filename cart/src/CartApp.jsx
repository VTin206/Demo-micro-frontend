import React from "react";
import "./index.scss";
import { useCart } from "./features/cart/hooks/useCart";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
}

export default function CartApp() {
  const {
    items,
    total,
    itemCount,
    shipping,
    grandTotal,
    increaseItem,
    decreaseItem,
    removeItem,
    clear,
    checkout
  } = useCart();

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
        Synced by <strong>cart:updated</strong> and publishing <strong>checkout:start</strong>
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
                <div className="cart-actions">
                  <div className="quantity-control" aria-label={`${item.name} quantity`}>
                    <button
                      type="button"
                      className="quantity-button"
                      onClick={() => decreaseItem(item.id)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="quantity-button"
                      onClick={() => increaseItem(item.id)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
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
            <button type="button" className="secondary-button" onClick={clear}>
              Clear
            </button>
            <button type="button" onClick={checkout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </section>
  );
}
