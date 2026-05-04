import React, { useState } from "react";
import "./index.scss";

const demoUser = {
  id: "user-1001",
  name: "Nguyen An",
  email: "nguyen.an@example.com",
  tier: "Gold Member",
  location: "Ho Chi Minh City",
  orders: 12
};

export default function ProfileApp() {
  const [loginStatus, setLoginStatus] = useState("Not logged in");

  const login = () => {
    window.dispatchEvent(
      new CustomEvent("user:login", {
        detail: demoUser
      })
    );

    setLoginStatus(`Published user:login for ${demoUser.name}`);
  };

  return (
    <section className="remote-card profile-app">
      <div className="remote-header">
        <div>
          <p className="eyebrow">Profile MFE</p>
          <h2>Customer profile</h2>
        </div>
        <span className="remote-badge">Remote 3003</span>
      </div>

      <div className="profile-panel">
        <div className="avatar">NA</div>
        <div>
          <h3>{demoUser.name}</h3>
          <p>{demoUser.email}</p>
          <span>{demoUser.tier}</span>
        </div>
      </div>

      <dl className="profile-facts">
        <div>
          <dt>Location</dt>
          <dd>{demoUser.location}</dd>
        </div>
        <div>
          <dt>Completed orders</dt>
          <dd>{demoUser.orders}</dd>
        </div>
      </dl>

      <div className="event-note">{loginStatus}</div>

      <button type="button" onClick={login}>
        Simulate Login
      </button>
    </section>
  );
}
