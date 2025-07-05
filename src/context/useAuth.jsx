import { createContext, useContext, useState, useEffect } from 'react';
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
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
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
      localStorage.setItem("code_verifier", challenge.code_verifier);
      await redirectToSpotifyAuth(IDP_URL, CLIENT_ID, REDIRECT_URI, SCOPE, challenge);
    }
  };

  function logout() {
    setAccessToken(null);
    localStorage.clear();
  };

  async function handleRedirectCallback() {
    const rawData = await handleCallBack(
            IDP_URL,
            CLIENT_ID,
            REDIRECT_URI
    );
    if (rawData && rawData.access_token) {
      localStorage.setItem('access_token', rawData.access_token);
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