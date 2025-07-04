import React, { useEffect } from "react";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const { login } = useAuth();

  useEffect(() => {
    login();
  }, [login]);

}
