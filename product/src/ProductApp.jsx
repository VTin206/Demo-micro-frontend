import React, { useState } from "react";
import "./index.scss";

const products = [
  {
    id: "headphones",
    name: "Wireless Headphones",
    category: "Audio",
    price: 1290000,
    description: "Active noise reduction, soft ear pads, and 30-hour battery life.",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "keyboard",
    name: "Mechanical Keyboard",
    category: "Workspace",
    price: 1590000,
    description: "Compact layout, tactile switches, and hot-swappable keycaps.",
    imageUrl:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "watch",
    name: "Smart Fitness Watch",
    category: "Wearable",
    price: 2190000,
    description: "Daily activity tracking, sleep insights, and quick notifications.",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "dock",
    name: "USB-C Travel Dock",
    category: "Accessories",
    price: 990000,
    description: "HDMI, USB-A, card reader, and pass-through charging in one hub.",
    imageUrl:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=900&q=80"
  }
];

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
}

export default function ProductApp() {
  const [lastAdded, setLastAdded] = useState(null);

  const addToCart = (product) => {
    window.dispatchEvent(
      new CustomEvent("cart:add", {
        detail: product
      })
    );

    setLastAdded(product.name);
  };

  return (
    <section className="remote-card product-app">
      <div className="remote-header">
        <div>
          <p className="eyebrow">Product MFE</p>
          <h2>Product catalog</h2>
        </div>
        <span className="remote-badge">Remote 3001</span>
      </div>

      {lastAdded && (
        <div className="event-note">
          Published <strong>cart:add</strong> for {lastAdded}
        </div>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-media">
              <img src={product.imageUrl} alt={product.name} />
              <span>{product.category}</span>
            </div>
            <div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
            </div>
            <div className="product-footer">
              <strong>{formatCurrency(product.price)}</strong>
              <button type="button" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
