import { EVENTS } from "../constants/events";
import { STORAGE_KEYS } from "../constants/storageKeys";

const mockUser = {
  id: "user-1001",
  name: "Nguyen An",
  email: "nguyen.an@example.com",
  tier: "Gold Member",
  location: "Ho Chi Minh City",
  orders: 12
};

export function getMockUser() {
  return mockUser;
}

export function loginMockUser(user) {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));

  window.dispatchEvent(
    new CustomEvent(EVENTS.USER_LOGIN, {
      detail: user
    })
  );

  return user;
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_PROFILE));
  } catch {
    return null;
  }
}

export function logoutMockUser() {
  localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);

  window.dispatchEvent(
    new CustomEvent(EVENTS.USER_LOGOUT, {
      detail: null
    })
  );
}
