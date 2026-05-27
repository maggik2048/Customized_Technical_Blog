"use client";

import { useState } from "react";

export default function EnterPage() {

  const [password, setPassword] =
    useState("");

  const submit = () => {

    if (password === "1234") {

      document.cookie =
        "site_access=true; path=/";

      window.location.href = "/";
    }
    else {

      alert("Wrong Password");
    }
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
          width: 300,
        }}
      >

        <h1>
          Enter Site
        </h1>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          style={{
            padding: 12,
          }}
        />

        <button
          onClick={submit}
          style={{
            padding: 12,
            cursor: "pointer",
          }}
        >
          Enter
        </button>

      </div>

    </main>
  );
}