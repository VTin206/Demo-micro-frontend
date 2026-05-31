import { useMemo, useState } from "react";
import {
  getCurrentUser,
  getMockUser,
  loginMockUser,
  logoutMockUser
} from "../services/profileService";

export function useProfile() {
  const mockUser = useMemo(() => getMockUser(), []);
  const [currentUser, setCurrentUser] = useState(getCurrentUser);
  const [loginStatus, setLoginStatus] = useState(
    currentUser ? `Logged in as ${currentUser.name}` : "Not logged in"
  );

  const login = () => {
    const nextUser = loginMockUser(mockUser);
    setCurrentUser(nextUser);
    setLoginStatus(`Published user:login for ${nextUser.name}`);
  };

  const logout = () => {
    logoutMockUser();
    setCurrentUser(null);
    setLoginStatus("Published user:logout");
  };

  return {
    user: currentUser || mockUser,
    currentUser,
    isAuthenticated: Boolean(currentUser),
    loginStatus,
    login,
    logout
  };
}
