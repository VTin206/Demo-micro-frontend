import React from "react";
import "./index.scss";
import { useProfile } from "./features/profile/hooks/useProfile";

export default function ProfileApp() {
  const { user, isAuthenticated, loginStatus, login, logout } = useProfile();

  return (
    <section className="remote-card profile-app">
      <div className="remote-header">
        <div>
          <p className="eyebrow">Profile MFE</p>
          <h2>Customer profile</h2>
          <p className="remote-subtitle">Customer account details for this demo session.</p>
        </div>
        <span className="remote-badge">Remote 3003</span>
      </div>

      <div className="profile-panel">
        <div className="avatar">NA</div>
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span>{user.tier}</span>
        </div>
      </div>

      <div className="membership-card">
        <span>Member Benefits</span>
        <strong>Free express shipping</strong>
        <p>Eligible on electronics orders over 1,000,000 VND.</p>
      </div>

      <dl className="profile-facts">
        <div>
          <dt>Location</dt>
          <dd>{user.location}</dd>
        </div>
        <div>
          <dt>Completed orders</dt>
          <dd>{user.orders}</dd>
        </div>
      </dl>

      <div className="event-note">{loginStatus}</div>

      <div className="profile-actions">
        {isAuthenticated ? (
          <button type="button" className="secondary-button" onClick={logout}>
            Logout
          </button>
        ) : (
          <button type="button" onClick={login}>
            Simulate Login
          </button>
        )}
      </div>
    </section>
  );
}
