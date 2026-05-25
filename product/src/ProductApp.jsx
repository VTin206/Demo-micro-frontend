import React, { useState } from "react";
import "./index.scss";
import { useProducts } from "./features/products/hooks/useProducts";

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
}

export default function ProductApp() {
  const { products } = useProducts();
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
          <p className="remote-subtitle">Curated electronics for quick demo orders.</p>
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
              <div className="product-meta">
                <span>{product.rating} rating</span>
                <span>{product.stock}</span>
              </div>
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
