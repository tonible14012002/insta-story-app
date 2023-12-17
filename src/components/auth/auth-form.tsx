import { useState } from "react";
import { LoginForm } from "./login";
import { Register } from "./register";

export const AuthForm = () => {
  const [mode, setMode] = useState<"login" | "register">("login");

  const onRegister = () => setMode("register");
  const onLogin = () => setMode("login");

  if (mode === "login") return <LoginForm onRegister={onRegister} />;
  return <Register onLogin={onLogin} />;
};
