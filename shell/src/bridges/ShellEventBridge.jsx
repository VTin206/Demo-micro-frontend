import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerShellEventBridge } from "../services/eventBridgeService";

export function ShellEventBridge({ onCartChange, onUserChange }) {
  const navigate = useNavigate();

  useEffect(() => {
    return registerShellEventBridge({ navigate, onCartChange, onUserChange });
  }, [navigate, onCartChange, onUserChange]);

  return null;
}
