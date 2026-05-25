"use client";

import React from "react";

/* =========================
   TABLE WRAPPER
========================= */

function Table({ children }: any) {
  return (
    <div
      style={{
        overflowX: "auto",
        margin: "18px 0",
        borderRadius: 12,
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: 14,
        }}
      >
        {children}
      </table>
    </div>
  );
}

/* =========================
   TABLE HEAD
========================= */

function Thead({ children }: any) {
  return <thead>{children}</thead>;
}

/* =========================
   TABLE BODY
========================= */

function Tbody({ children }: any) {
  return <tbody>{children}</tbody>;
}

/* =========================
   TABLE ROW
========================= */

function Tr({ children }: any) {
  return (
    <tr
      style={{
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </tr>
  );
}

/* =========================
   TABLE HEADER CELL
========================= */

function Th({ children }: any) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "10px 12px",
        fontWeight: 700,
        background: "rgba(0,0,0,0.05)",
        color: "#3a2a12",
      }}
    >
      {children}
    </th>
  );
}

/* =========================
   TABLE CELL
========================= */

function Td({ children }: any) {
  return (
    <td
      style={{
        padding: "10px 12px",
        verticalAlign: "top",
        color: "#5a3f1a",
      }}
    >
      {children}
    </td>
  );
}

/* =========================
   EXPORT (IMPORTANT)
========================= */

const TableRenderer = Object.assign(Table, {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
});

export default TableRenderer;