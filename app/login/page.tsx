"use client";

import { useState } from "react";

import { useRouter }
from "next/navigation";

import { createClient }
from "@/lib/supabase/client";

export default function LoginPage() {

  const router = useRouter();

  const supabase = createClient();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login = async () => {

    const { error } =
      await supabase
        .auth
        .signInWithPassword({
          email,
          password,
        });

    if (error) {

      alert(error.message);
      return;
    }

    router.push("/admin");
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
          Login
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

        <button onClick={login}>
          Login
        </button>

      </div>

    </main>
  );
}