import React, { FormEventHandler, useState } from "react";
import { createRoot } from "react-dom/client";
import { LoginForm } from "./components/login-form";
import { RegisterForm } from "./components/register-form";

import "./style.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase-setup";
import Posts from "./components/posts";

createRoot(document.getElementById("app")!).render(<App />);

function App() {
  const [tab, setTab] = React.useState<"login" | "register" | "posts">("login");
  const [hasAuth, setHasAuth] = useState<string | null | undefined>();

  onAuthStateChanged(auth, (user) => {
    setHasAuth(user?.uid);
  });

  return (
    <main className="flex w-screen h-screen items-center justify-center flex-col gap-3 bg-violet-500">
      {tab === "login" && <LoginForm />}
      {tab === "register" && <RegisterForm />}
      {tab === "posts" && hasAuth && <Posts />}

      {tab === "posts" && !hasAuth && (
        <div className="bg-white p-10 rounded-md">You are not logged in</div>
      )}

      <div className="flex gap-5">
        <button
          className="bg-white p-2 rounded-lg cursor-pointer"
          onClick={() => setTab("login")}
        >
          Login
        </button>
        <button
          className="bg-white p-2 rounded-lg cursor-pointer"
          onClick={() => setTab("posts")}
        >
          Posts
        </button>
        <button
          className="bg-white p-2 rounded-lg cursor-pointer"
          onClick={() => setTab("register")}
        >
          Register
        </button>
      </div>
    </main>
  );
}
