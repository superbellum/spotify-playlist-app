import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import pkceChallenge from "pkce-challenge";
import { handleCallBack, redirectToSpotifyAuth } from "../lib/utils";
import {
  IDP_URL,
  CLIENT_ID,
  REDIRECT_URI,
  SCOPE
} from '../lib/constants';


const AuthContext = createContext();


export function useAuth() {
  return useContext(AuthContext);
}


export function AuthProvider ({ children }) {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
    } else {
      setAccessToken(null);
    }
    setLoading(false);
  }, []);

  async function login() {
    if (accessToken)
      return;
    else {
      const challenge = await pkceChallenge(128);
      sessionStorage.setItem("code_verifier", challenge.code_verifier);
      await redirectToSpotifyAuth(IDP_URL, CLIENT_ID, REDIRECT_URI, SCOPE, challenge);
    }
  };

  function logout() {
    setAccessToken(null);
    sessionStorage.removeItem('code_verifier');
    sessionStorage.removeItem('access_token');
    navigate('/login');
  };

  async function handleRedirectCallback() {
    const rawData = await handleCallBack(
            IDP_URL,
            CLIENT_ID,
            REDIRECT_URI
    );
    if (rawData && rawData.access_token) {
      sessionStorage.setItem('access_token', rawData.access_token);
      setAccessToken(rawData.access_token);
      return true;
    }
    return false;
  }

  return (
    <AuthContext.Provider value={{ accessToken, login, logout, handleRedirectCallback }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}