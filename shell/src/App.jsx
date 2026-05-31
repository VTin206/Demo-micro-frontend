import React, { Component, Suspense, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes
} from "react-router-dom";
import "./index.scss";
import { ShellEventBridge } from "./bridges/ShellEventBridge";
import {
  getCartItems,
  getCartTotal,
  getCurrentUser
} from "./services/sessionStorageService";

const ProductApp = React.lazy(() => import("product/ProductApp"));
const CartApp = React.lazy(() => import("cart/CartApp"));
const ProfileApp = React.lazy(() => import("profile/ProfileApp"));
const CheckoutApp = React.lazy(() => import("checkout/CheckoutApp"));

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND"
  }).format(value);
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

function HomeView() {
  return (
    <section className="home-panel">
      <div>
        <p className="eyebrow">Runtime Integration</p>
        <h2>Shell coordinates the commerce session</h2>
        <p>
          Product, Cart, Profile, and Checkout remain independent remotes while Shell
          owns routing, layout, and shared browser events.
        </p>
      </div>
      <div className="flow-grid">
        <div>
          <span>1</span>
          <strong>Product publishes cart:add</strong>
        </div>
        <div>
          <span>2</span>
          <strong>Shell updates cart:items</strong>
        </div>
        <div>
          <span>3</span>
          <strong>Cart starts checkout</strong>
        </div>
        <div>
          <span>4</span>
          <strong>Checkout confirms payment</strong>
        </div>
      </div>
    </section>
  );
}

function App() {
  const [cartItems, setCartItems] = useState(getCartItems);
  const [user, setUser] = useState(getCurrentUser);

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
          <NavItem to="/">Home</NavItem>
          <NavItem to="/products">Products</NavItem>
          <NavItem to="/cart">Cart</NavItem>
          <NavItem to="/profile">Profile</NavItem>
          <NavItem to="/checkout">Checkout</NavItem>
        </nav>

        <main className="shell-main">
          <CommerceOverview cartCount={cartCount} cartTotal={cartTotal} user={user} />

          <Routes>
            <Route path="/" element={<HomeView />} />
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
        <footer className="shell-footer">
          <span>Shell App - Host</span>
          <span>Events: cart:add, cart:updated, checkout:start, user:login, user:logout</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

const root = document.getElementById("app");
ReactDOM.createRoot(root).render(<App />);
