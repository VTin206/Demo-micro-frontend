const USER_KEY = "mfe:ecommerce:user";

export function loginMockUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  window.dispatchEvent(
    new CustomEvent("user:login", {
      detail: user
    })
  );

  return user;
}

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function logoutMockUser() {
  localStorage.removeItem(USER_KEY);
}
