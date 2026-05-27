"use client";

import { useState } from "react";

import { createClient }
from "@/lib/supabase/client";

export default function SignupPage() {

  const supabase = createClient();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const signup = async () => {

    const { error } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (error) {

      alert(error.message);
      return;
    }

    alert("Signup Success");
  };

  return (

    <main
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: 320,
        }}
      >

        <h1>
          Signup
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
        />

        <button onClick={signup}>
          Create Account
        </button>

      </div>

    </main>
  );
}