import React, { Component, Suspense, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Route,
  Routes,
  useNavigate
} from "react-router-dom";
import "./index.scss";
import { EVENTS } from "./shared/constants/events";
import { STORAGE_KEYS } from "./shared/constants/storageKeys";

const ProductApp = React.lazy(() => import("product/ProductApp"));
const CartApp = React.lazy(() => import("cart/CartApp"));
const ProfileApp = React.lazy(() => import("profile/ProfileApp"));
const CheckoutApp = React.lazy(() => import("checkout/CheckoutApp"));

function readJson(key, fallback) {
  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch (error) {
    console.warn(`Cannot read ${key}`, error);
    return fallback;
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function getCartItems() {
  return readJson(STORAGE_KEYS.CART, []);
}

function addProductToCart(product) {
  const items = getCartItems();
  const existingItem = items.find((item) => item.id === product.id);

  const nextItems = existingItem
    ? items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      )
    : [...items, { ...product, quantity: 1 }];

  writeJson(STORAGE_KEYS.CART, nextItems);
  return nextItems;
}

function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
}

function ShellEventBridge({ onCartChange, onUserChange }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCartAdd = (event) => {
      const product = event.detail;

      if (!product || !product.id) {
        return;
      }

      const nextItems = addProductToCart(product);
      onCartChange(nextItems);

      window.dispatchEvent(
        new CustomEvent(EVENTS.CART_UPDATED, {
          detail: { items: nextItems, total: getCartTotal(nextItems) }
        })
      );
    };

    const handleCheckoutStart = (event) => {
      const items = event.detail?.items?.length ? event.detail.items : getCartItems();
      const order = {
        items,
        total: getCartTotal(items),
        startedAt: new Date().toISOString()
      };

      writeJson(STORAGE_KEYS.CHECKOUT_ORDER, order);
      navigate("/checkout");
    };

    const handleUserLogin = (event) => {
      const user = event.detail;

      if (!user || !user.name) {
        return;
      }

      writeJson(STORAGE_KEYS.USER, user);
      onUserChange(user);
    };

    window.addEventListener(EVENTS.CART_ADD, handleCartAdd);
    window.addEventListener(EVENTS.CHECKOUT_START, handleCheckoutStart);
    window.addEventListener(EVENTS.USER_LOGIN, handleUserLogin);

    return () => {
      window.removeEventListener(EVENTS.CART_ADD, handleCartAdd);
      window.removeEventListener(EVENTS.CHECKOUT_START, handleCheckoutStart);
      window.removeEventListener(EVENTS.USER_LOGIN, handleUserLogin);
    };
  }, [navigate, onCartChange, onUserChange]);

  return null;
}

class RemoteErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("Remote app failed", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="status-panel">
          <h2>Remote app unavailable</h2>
          <p>Check whether the remote server and its remoteEntry.js are running.</p>
        </section>
      );
    }

    return this.props.children;
  }
}

function RemoteView({ children }) {
  return (
    <RemoteErrorBoundary>
      <Suspense
        fallback={
          <section className="status-panel">
            <h2>Loading remote app</h2>
            <p>Webpack Module Federation is loading the remoteEntry.js manifest.</p>
          </section>
        }
      >
        {children}
      </Suspense>
    </RemoteErrorBoundary>
  );
}

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
    >
      {children}
    </NavLink>
  );
}

function CommerceOverview({ cartCount, cartTotal, user }) {
  return (
    <section className="commerce-overview">
      <div className="overview-copy">
        <p className="eyebrow">E-commerce Workspace</p>
        <h2>Storefront dashboard</h2>
        <p>
          Monitor the current customer session, cart value, and checkout readiness in one
          place.
        </p>
      </div>

      <div className="metric-grid">
        <div className="metric-card">
          <span>Cart Value</span>
          <strong>{formatCurrency(cartTotal)}</strong>
        </div>
        <div className="metric-card">
          <span>Cart Units</span>
          <strong>{cartCount}</strong>
        </div>
        <div className="metric-card highlight">
          <span>Customer</span>
          <strong>{user ? "Signed in" : "Guest"}</strong>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [cartItems, setCartItems] = useState(getCartItems);
  const [user, setUser] = useState(() => readJson(STORAGE_KEYS.USER, null));

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );
  const cartTotal = useMemo(() => getCartTotal(cartItems), [cartItems]);

  return (
    <BrowserRouter>
      <ShellEventBridge onCartChange={setCartItems} onUserChange={setUser} />
      <div className="shell-layout">
        <header className="shell-header">
          <div className="brand-lockup">
            <div className="brand-mark">EC</div>
            <div>
              <p className="eyebrow">Module Federation Case Study</p>
              <h1>E-commerce Micro Frontend</h1>
            </div>
          </div>
          <div className="shell-summary">
            <div className="summary-card">
              <span>Customer</span>
              <strong>{user ? user.name : "Guest user"}</strong>
            </div>
            <div className="summary-card accent">
              <span>Cart</span>
              <strong>{cartCount} item{cartCount === 1 ? "" : "s"}</strong>
            </div>
          </div>
        </header>

        <nav className="shell-nav" aria-label="Primary">
          <NavItem to="/products">Products</NavItem>
          <NavItem to="/cart">Cart</NavItem>
          <NavItem to="/profile">Profile</NavItem>
          <NavItem to="/checkout">Checkout</NavItem>
        </nav>

        <main className="shell-main">
          <CommerceOverview cartCount={cartCount} cartTotal={cartTotal} user={user} />

          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route
              path="/products"
              element={
                <RemoteView>
                  <ProductApp />
                </RemoteView>
              }
            />
            <Route
              path="/cart"
              element={
                <RemoteView>
                  <CartApp />
                </RemoteView>
              }
            />
            <Route
              path="/profile"
              element={
                <RemoteView>
                  <ProfileApp />
                </RemoteView>
              }
            />
            <Route
              path="/checkout"
              element={
                <RemoteView>
                  <CheckoutApp />
                </RemoteView>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

const root = document.getElementById("app");
ReactDOM.createRoot(root).render(<App />);
