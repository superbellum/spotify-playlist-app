import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner';
import { handleCallBack } from "../lib/utils";
import {
  IDP_URL,
  CLIENT_ID,
  REDIRECT_URI,
} from '../lib/constants';


export default function SpotifyCallBack() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const rawData = await handleCallBack(
        IDP_URL,
        CLIENT_ID,
        REDIRECT_URI
      );
      if (rawData.access_token) {
        sessionStorage.setItem('access_token', rawData.access_token);
        navigate('/');
      }
    };

    fetchToken();
  }, [navigate]);

  return (
    <ProgressSpinner />
  )
}
