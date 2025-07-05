import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ProgressSpinner } from 'primereact/progressspinner';
import { useAuth } from "../context/useAuth";


export default function SpotifyCallBack() {
  const navigate = useNavigate();
  const { handleRedirectCallback } = useAuth();
  const [searchParams] = useSearchParams();

  async function completeLogin() {
    const success = await handleRedirectCallback();
    navigate(success ? '/' : '/login');
  }

  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      console.error("Error during authentication:", error);
      navigate('/login');
      return;
    }

    completeLogin();
  }, []);

  return (
    <ProgressSpinner />
  )
}
