import { useEffect, useState } from "react";
import { Message } from 'primereact/message';
import pkceChallenge from "pkce-challenge";
import { redirectToSpotifyAuth } from "../lib/utils";
import {
  IDP_URL,
  CLIENT_ID,
  REDIRECT_URI,
  SCOPE
} from '../lib/constants';


export default function Home() {
  const [accessTokenVisibility, setAccessTokenVisibility] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    async function doAuth() {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        const challenge = await pkceChallenge(128);
        sessionStorage.setItem("code_verifier", challenge.code_verifier);
        await redirectToSpotifyAuth(IDP_URL, CLIENT_ID, REDIRECT_URI, SCOPE, challenge);
      } else {
        setAccessToken(token);
        setAccessTokenVisibility(true);
      }
    }
    doAuth();
  }, []);

  return (
    <>
      <div className="text-center">
        <i className="pi pi-amazon"></i>
        <p>this is main page, etc</p>
        { accessTokenVisibility && (
          <Message severity="info" className="text-center" text={`Access token: ${accessToken}`}/>
        )}
      </div>
    </>
  )
}
