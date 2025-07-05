import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';

export default function Home() {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <>
      <div className="text-center">
        <i className="pi pi-amazon"></i>
        <p>this is main page, etc</p>
        { accessToken && (
          <div>
            <Message severity="success" text="You are logged in!" />
            <Button label="Logout" className="p-button-outlined" onClick={handleLogout} />
          </div>
        )}
      </div>
    </>
  )
}
