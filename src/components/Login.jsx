import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { accessToken, login } = useAuth();

  function handleLogin() {
    if (!accessToken) {
      login();
    } else {
      navigate("/");
    }
  }

  useEffect(() => {
    handleLogin();
  }, []);

}
